// app/kyc/[id].tsx
import AIHelpButton,{analyzeDocumentWithGemini, analyzeKycBundle} from "@/components/AIHelpButton";
import { addToQueue } from "@/lib/offlineQueues";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { isKycApproved } from "@/lib/Verification";
import {
  Alert,
  KeyboardAvoidingView, Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { convertImageToBase64 } from '@/lib/imageUtils';
import ProgressHeader from "@/components/ProgressHeader";
import ImagePriew from "@/components/ImagePriew";
import Navagation from "@/components/Navagation";
import { VerificationResult } from "@/constants/types";
import { DOCUMENT_STEPS } from "@/constants/constant";



export default function DocumentCollectionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [documents, setDocuments] = useState<{[key: string]: string | null}>({
    aadhaar: null,
    pan: null,
    dl: null,
   
    selfie: null,
  });
 
  const [loading, setLoading] = useState(false);
  const [verificationResults, setVerificationResults] = useState<{[key: string]: VerificationResult}>({});
  const currentDocument = DOCUMENT_STEPS[currentStep];
  const isLastStep = currentStep === DOCUMENT_STEPS.length - 1;
  const isSelfieStep = currentDocument.id === "selfie";
  const allDocumentsUploaded = Object.values(documents).every(doc => doc !== null);

  useEffect(() => {
    if (!DOCUMENT_STEPS.find(step => step.id === id)) {
      router.back();
    }
  }, [id]);
  
  useEffect(() => {
  const expectedId = DOCUMENT_STEPS[currentStep].id;
  if (id !== expectedId) router.setParams({ id: expectedId });
}, [currentStep]);

const openImagePicker = async () => {
  try {
    const isSelfieStep = currentDocument.id === "selfie";
    
    if (isSelfieStep) {
      // For selfie, use camera
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "Camera permission is needed to take selfie");
        return;
      }

      const res = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!res.canceled) {
        const compressed = await ImageManipulator.manipulateAsync(
          res.assets[0].uri,
          [{ resize: { width: 640 } }],
          { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG }
        );
        
        setDocuments(prev => ({
          ...prev,
          [currentDocument.id]: compressed.uri
        }));
      }
    } else {
      // For documents, use gallery
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "Gallery permission is needed to upload documents");
        return;
      }

      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!res.canceled) {
        const compressed = await ImageManipulator.manipulateAsync(
          res.assets[0].uri,
          [{ resize: { width: 800 } }],
          { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG }
        );
        
        setDocuments(prev => ({
          ...prev,
          [currentDocument.id]: compressed.uri
        }));

        const imageBase64 = await convertImageToBase64(compressed.uri);
        const result = await analyzeDocumentWithGemini(currentDocument.id, imageBase64);
        if (result && !result.verified) {
          Alert.alert(
            '⚠️ Verification Issues',
            `Please check your ${currentDocument.name}:\n${result.issues.join('\n• ')}`
          );
        }
      }
    }
  } catch (error) {
    Alert.alert("Error", "Failed to process image. Please try again.");
  }
};



 const handleNext = () => {
  if (currentStep < DOCUMENT_STEPS.length - 1) {
    const nextStep = DOCUMENT_STEPS[currentStep + 1].id;
    setCurrentStep(prev => prev + 1);
    router.setParams({ id: nextStep });   // ← keeps params.id synced
  }
};
 const handlePrevious = () => {
  if (currentStep > 0) {
    const prevStep = DOCUMENT_STEPS[currentStep - 1].id;
    setCurrentStep(prev => prev - 1);
    router.setParams({ id: prevStep });
  }
};
const handleSubmit = async () => {
  if (!allDocumentsUploaded) {
    Alert.alert('Incomplete', 'Please upload all required documents before submitting.');
    return;
  }

  setLoading(true);
  try {
    /* ----- 1.  collect base64 ----- */
    const documentImages: Record<string, string> = {};
    for (const [docType, uri] of Object.entries(documents)) {
      if (uri && docType !== 'selfie') {
        documentImages[docType] = await convertImageToBase64(uri);
      }
    }
    const selfieBase64 = documents.selfie ? await convertImageToBase64(documents.selfie) : null;

    /* ----- 2.  Gemini bundle ----- */
    const geminiResult = await analyzeKycBundle(documentImages, selfieBase64);

    /* ----- 3.  build result array for your rule ----- */
    const docResults: VerificationResult[] = Object.entries(documentImages).map(([type, _]) =>
      geminiResult.docResults?.[type] ?? { verified: false, confidence: 0, issues: [], details: { type } }
    );
    const selfieResult: VerificationResult =
      geminiResult.selfieResult ?? { verified: false, confidence: 0, issues: [], details: { type: 'selfie' } };

    /* ----- 4.  pass / fail ----- */
    if (isKycApproved([...docResults, selfieResult])) {
      /* ---------- SUCCESS ---------- */
      for (const [docType, uri] of Object.entries(documents)) {
        if (!uri) continue;
        await addToQueue(docType, {
          documentType: docType,
          verification: {
            verified: true,
            confidence: docType === 'selfie' ? selfieResult.confidence : geminiResult.confidence,
            aiVerified: true,
          },
        }, uri);
      }

      router.replace({
        pathname: '/success',
        params: {
          message: `KYC Approved by AI! Overall confidence: ${geminiResult.confidence}%`,
          verified: 'true',
          confidence: geminiResult.confidence.toString(),
        },
      });
    } else {
      /* ---------- FAILED ---------- */
      router.replace({
        pathname: '/failed',
        params: {
          message: `KYC Rejected: ${geminiResult.issues.join(', ')}`,
          issues: JSON.stringify(geminiResult.issues),
          confidence: geminiResult.confidence.toString(),
          details: JSON.stringify(geminiResult.details || {}),
          verified: 'false',
        },
      });
    }
  } catch (error) {
    console.error('KYC submission error:', error);
    Alert.alert('Error', 'Failed to complete verification. Please try again.');
  } finally {
    setLoading(false);
  }
};


  
  const progressFillWidth = `${(currentStep ) / DOCUMENT_STEPS.length * 100}%`;


  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      className="flex-1 bg-white"
    >
      
      
      {/* Progress Header */}
      <ProgressHeader currentStep={currentStep} DOCUMENT_STEPS={DOCUMENT_STEPS} currentDocument={currentDocument} progressFillWidth={progressFillWidth} /> 

      <ScrollView className="flex-1 px-6 pt-6">
        {/* Instructions */}
        <Text className="text-xl font-bold text-center mb-4">
          {currentDocument.name}
        </Text>
        <Text className="text-gray-600 text-center mb-6">
          {currentDocument.description}
        </Text>

        
       <ImagePriew isSelfieStep={isSelfieStep}
        openImagePicker={openImagePicker}
         documents={documents}
          currentDocument={currentDocument} />       

        
       <Navagation currentStep={currentStep}
        handlePrevious={handlePrevious}
         handleNext={handleNext}
          documents={documents}
           currentDocument={currentDocument} 
           isLastStep={isLastStep} 
       handleSubmit={handleSubmit}
        allDocumentsUploaded={allDocumentsUploaded}
         loading={loading}
         />
       
        {/* Document Status Overview */}
        <View className="bg-gray-50 rounded-xl p-4 mb-8">
          <Text className="font-semibold mb-3">Document Status</Text>
          {DOCUMENT_STEPS.map((step, index) => (
            <View key={step.id} className="flex-row items-center mb-2">
              <View className={`w-3 h-3 rounded-full mr-3 ${
                documents[step.id] ? "bg-green-500" : "bg-gray-300"
              }`} />
              <Text className={index === currentStep ? "font-semibold text-primary" : "text-gray-600"}>
                {step.name} {documents[step.id] ? "✓" : ""}
              </Text>
            </View>
          ))}
        </View>
       <AIHelpButton 
  documentUri={documents[currentDocument.id]}
  onVerificationComplete={(result) => {
    setVerificationResults(prev => ({
      ...prev,
      [currentDocument.id]: result
    }));
  }}
/>
      </ScrollView>
    
         
    </KeyboardAvoidingView>
  );
}