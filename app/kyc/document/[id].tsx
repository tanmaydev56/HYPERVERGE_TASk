// app/kyc/[id].tsx
import AIHelpButton from "@/components/AIHelpButton";
import { addToQueue } from "@/lib/offlineQueues";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Camera, ChevronLeft, ChevronRight, Upload } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView, Platform,
  ScrollView,
  Text, TouchableOpacity,
  View,
} from "react-native";

import { convertImageToBase64 } from '@/lib/imageUtils';

// Add interface at top
interface VerificationResult {
  verified: boolean;
  confidence: number;
  issues: string[];
  details: {
    type: string;
    number?: string;
    name?: string;
    validity?: string;
  };
}
const DOCUMENT_STEPS = [
  { id: "aadhaar", name: "Aadhaar Card", description: "Upload front side of your Aadhaar card" },
  { id: "pan", name: "PAN Card", description: "Upload front side of your PAN card" },
  { id: "dl", name: "Driving License", description: "Upload front side of your Driving License" },
  { id: "selfie", name: "Selfie Photo", description: "Take a clear photo of your face using camera" },
];

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

        // Instant verification for documents (not selfie)
        const result = await verifyDocumentInstantly(currentDocument.id, compressed.uri);
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

// Add this verifyDocumentInstantly function (place it near your other functions)
const verifyDocumentInstantly = async (docType: string, uri: string): Promise<any> => {
  try {
    // Simulate verification for demo - replace with actual Gemini API when ready
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const results = {
      aadhaar: { 
        verified: Math.random() > 0.2, 
        confidence: Math.floor(Math.random() * 30) + 70,
        issues: Math.random() > 0.2 ? [] : ['Document blurry', 'Number not fully visible'],
        details: { type: 'Aadhaar', number: '123456789012', name: 'John Doe' }
      },
      pan: { 
        verified: Math.random() > 0.2,
        confidence: Math.floor(Math.random() * 30) + 70,
        issues: Math.random() > 0.2 ? [] : ['PAN number unclear', 'Name not readable'],
        details: { type: 'PAN', number: 'ABCDE1234F', name: 'John Doe' }
      },
      dl: { 
        verified: Math.random() > 0.2,
        confidence: Math.floor(Math.random() * 30) + 70,
        issues: Math.random() > 0.2 ? [] : ['License number unclear', 'Expiry date not visible'],
        details: { type: 'Driving License', number: 'DL1420110012345', name: 'John Doe' }
      },
      
    };

    const result = results[docType as keyof typeof results] || { 
      verified: false, 
      confidence: 0, 
      issues: ['Unknown document type'],
      details: { type: docType }
    };
    
    // Update verification results state
    setVerificationResults(prev => ({
      ...prev,
      [docType]: result
    }));

    return result;
  } catch (error) {
    console.error('Instant verification failed:', error);
    return {
      verified: false,
      confidence: 0,
      issues: ['Verification service unavailable'],
      details: { type: docType }
    };
  }
};

  const handleNext = () => {
    if (currentStep < DOCUMENT_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

const handleSubmit = async () => {
  if (!allDocumentsUploaded) {
    Alert.alert("Incomplete", "Please upload all required documents before submitting.");
    return;
  }

  setLoading(true);
  try {
    // Perform final face matching verification
    const finalResult = await performFinalFaceMatching();
    
    if (finalResult.verified) {
      // Add all documents to offline queue
      for (const [docType, uri] of Object.entries(documents)) {
        if (uri && docType !== "selfie") {
          await addToQueue(docType, { 
            documentType: docType,
            verification: verificationResults[docType]
          }, uri);
        }
      }
      
      // Add selfie separately
      if (documents.selfie) {
        await addToQueue("selfie", { 
          documentType: "selfie",
          verification: finalResult.faceMatch
        }, documents.selfie);
      }

      router.replace({
        pathname: "/success",
        params: { 
          message: `KYC Approved! Document confidence: ${finalResult.documentConfidence}%, Face match: ${finalResult.faceMatchConfidence}%`,
          verified: "true"
        }
      });
    } else {
      const allIssues = [
        ...finalResult.documentIssues,
        ...finalResult.faceMatchIssues
      ];
      
      Alert.alert(
        '❌ Final Verification Failed',
        `Please fix these issues:\n${allIssues.join('\n• ')}`,
        [{ text: 'Retry' }]
      );
    }
  } catch (error) {
    Alert.alert("Error", "Failed to complete verification. Please try again.");
  } finally {
    setLoading(false);
  }
};

// Add this new function for final face matching
const performFinalFaceMatching = async (): Promise<{
  verified: boolean;
  documentConfidence: number;
  faceMatchConfidence: number;
  documentIssues: string[];
  faceMatchIssues: string[];
}> => {
  try {
    // Simulate face matching verification (replace with actual Gemini call)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const faceMatchSuccess = Math.random() > 0.3; // 70% success rate
    const documentSuccess = verificationResults.aadhaar?.verified || 
                           verificationResults.pan?.verified || 
                           verificationResults.dl?.verified 

    if (faceMatchSuccess && documentSuccess) {
      return {
        verified: true,
        documentConfidence: 85,
        faceMatchConfidence: 90,
        documentIssues: [],
        faceMatchIssues: []
      };
    } else {
      return {
        verified: false,
        documentConfidence: 60,
        faceMatchConfidence: 45,
        documentIssues: documentSuccess ? [] : ['Document verification failed'],
        faceMatchIssues: faceMatchSuccess ? [] : ['Face does not match document photo']
      };
    }
  } catch (error) {
    return {
      verified: false,
      documentConfidence: 0,
      faceMatchConfidence: 0,
      documentIssues: ['Verification service error'],
      faceMatchIssues: ['Face matching unavailable']
    };
  }
};
  
  const progressFillWidth = `${(currentStep ) / DOCUMENT_STEPS.length * 100}%`;


  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      className="flex-1 bg-white"
    >
      <AIHelpButton 
  documentUri={documents[currentDocument.id]}
  onVerificationComplete={(result) => {
    setVerificationResults(prev => ({
      ...prev,
      [currentDocument.id]: result
    }));
  }}
/>
      
      {/* Progress Header */}
      <View className="bg-primary px-6 pt-12 pb-4">
        <Text className="text-white text-lg font-bold text-center mb-2">
          Step {currentStep + 1} of {DOCUMENT_STEPS.length}
        </Text>
        <Text className="text-white text-center mb-4">
          {currentDocument.name}
        </Text>
        
        {/* Progress Bar */}
        <View className="bg-white/30 rounded-full h-2 mb-2">
    <View
      className="bg-green-500 rounded-full h-2"   // <- green fill
      style={{ width: progressFillWidth }}
    />
      </View>
      
      </View>

      <ScrollView className="flex-1 px-6 pt-6">
        {/* Instructions */}
        <Text className="text-xl font-bold text-center mb-4">
          {currentDocument.name}
        </Text>
        <Text className="text-gray-600 text-center mb-6">
          {currentDocument.description}
        </Text>

        {/* Image Preview or Upload Button */}
        {documents[currentDocument.id] ? (
          <View className="items-center mb-6">
            <Image 
              source={{ uri: documents[currentDocument.id] as string }} 
              className="w-full h-64 rounded-xl mb-4 border border-gray-200"
              resizeMode="contain"
            />
            <TouchableOpacity 
              onPress={openImagePicker}
              className="bg-gray-100 rounded-xl px-6 py-3 items-center"
            >
              <Text className="text-primary font-semibold">
                {isSelfieStep ? "Retake Selfie" : "Change Document"}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity 
            onPress={openImagePicker}
            className="bg-gray-100 rounded-xl py-12 items-center mb-6 border-2 border-dashed border-gray-300"
          >
            {isSelfieStep ? (
              <>
                <Camera size={48} color="#4A90E2" />
                <Text className="text-primary text-lg font-semibold mt-3">
                  Take Selfie
                </Text>
                <Text className="text-gray-600 text-center mt-2 px-4">
                  Use camera to take a clear photo of your face
                </Text>
              </>
            ) : (
              <>
                <Upload size={48} color="#4A90E2" />
                <Text className="text-primary text-lg font-semibold mt-3">
                  Upload Document
                </Text>
                <Text className="text-gray-600 text-center mt-2 px-4">
                  Select from your gallery or take a photo
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {/* Navigation Buttons */}
        <View className="flex-row justify-between mb-8">
          <TouchableOpacity 
            onPress={handlePrevious}
            disabled={currentStep === 0}
            className={`flex-row items-center px-6 py-3 rounded-xl ${
              currentStep === 0 ? "bg-gray-300" : "bg-gray-200"
            }`}
          >
            <ChevronLeft size={20} color={currentStep === 0 ? "#999" : "#333"} />
            <Text className={`ml-2 ${currentStep === 0 ? "text-gray-600" : "text-gray-800"}`}>
              Previous
            </Text>
          </TouchableOpacity>

          {!isLastStep ? (
            <TouchableOpacity 
              onPress={handleNext}
              disabled={!documents[currentDocument.id]}
              className={`flex-row items-center px-6 py-3 rounded-xl ${
                documents[currentDocument.id] ? "bg-primary" : "bg-gray-300"
              }`}
            >
              <Text className="text-white mr-2">Next</Text>
              <ChevronRight size={20} color="white" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              onPress={handleSubmit}
              disabled={!allDocumentsUploaded || loading}
              className={`px-6 py-3 rounded-xl ${
                allDocumentsUploaded && !loading ? "bg-green-600" : "bg-gray-300"
              }`}
            >
              <Text className="text-white">
                {loading ? "Submitting..." : "Submit All Documents"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

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
       
      </ScrollView>
    </KeyboardAvoidingView>
  );
}