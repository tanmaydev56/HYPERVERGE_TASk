// app/kyc/[id].tsx
import AIHelpButton, { analyzeDocumentWithGemini, analyzeKycBundle } from "@/components/AIHelpButton";
import ImagePriew from "@/components/ImagePriew";
import Navagation from "@/components/Navagation";
import ProgressHeader from "@/components/ProgressHeader";
import { DOCUMENT_STEPS } from "@/constants/constant";
import { VerificationResult } from "@/constants/types";
import { convertImageToBase64 } from "@/lib/imageUtils";
import { addToQueue } from "@/lib/offlineQueues";
import { isKycApproved } from "@/lib/Verification";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";

export default function DocumentCollectionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(0);
  const [documents, setDocuments] = useState<{ [key: string]: string | null }>({
    aadhaar: null,
    pan: null,
    dl: null,
    selfie: null,
  });
  const [loading, setLoading] = useState(false);
  const [verificationResults, setVerificationResults] = useState<{ [key: string]: VerificationResult }>({});

  const currentDocument = DOCUMENT_STEPS[currentStep];
  const isLastStep = currentStep === DOCUMENT_STEPS.length - 1;
  const isSelfieStep = currentDocument.id === "selfie";
  const allDocumentsUploaded = Object.values(documents).every((doc) => doc !== null);

  // Ensure `id` matches current step
  useEffect(() => {
    if (!DOCUMENT_STEPS.find((step) => step.id === id)) router.back();
  }, [id]);

  useEffect(() => {
    const expectedId = DOCUMENT_STEPS[currentStep].id;
    if (id !== expectedId) router.setParams({ id: expectedId });
  }, [currentStep]);

  const openImagePicker = async () => {
    try {
      if (isSelfieStep) {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") return;

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
          setDocuments((prev) => ({ ...prev, [currentDocument.id]: compressed.uri }));
        }
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") return;

        const res = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
          setDocuments((prev) => ({ ...prev, [currentDocument.id]: compressed.uri }));

          // Optional AI verification for instant feedback
          const imageBase64 = await convertImageToBase64(compressed.uri);
          const result = await analyzeDocumentWithGemini(currentDocument.id, imageBase64);
          if (result && !result.verified) {
            setVerificationResults((prev) => ({ ...prev, [currentDocument.id]: result }));
          }
        }
      }
    } catch (error) {
      console.error("❌ Image processing failed:", error);
    }
  };

  const handleNext = () => {
    if (currentStep < DOCUMENT_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
      router.setParams({ id: DOCUMENT_STEPS[currentStep + 1].id });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      router.setParams({ id: DOCUMENT_STEPS[currentStep - 1].id });
    }
  };

  const handleSubmit = async () => {
    if (!allDocumentsUploaded) return;

    setLoading(true);
    try {
      const documentImages: Record<string, string> = {};
      for (const [docType, uri] of Object.entries(documents)) {
        if (uri && docType !== "selfie") {
          documentImages[docType] = await convertImageToBase64(uri);
        }
      }
      const selfieBase64 = documents.selfie ? await convertImageToBase64(documents.selfie) : null;

      const geminiResult = await analyzeKycBundle(documentImages, selfieBase64);
      const docResults: VerificationResult[] = await Promise.all(
        Object.entries(documentImages).map(([type, b64]) => analyzeDocumentWithGemini(type as any, b64))
      );
      const selfieResult: VerificationResult = selfieBase64
        ? await analyzeDocumentWithGemini("selfie", selfieBase64)
        : { verified: true, confidence: 100, issues: [], details: { type: "selfie" } };

      if (isKycApproved([...docResults, selfieResult])) {
        for (const [docType, uri] of Object.entries(documents)) {
          if (!uri) continue;
          await addToQueue(
            docType,
            {
              documentType: docType,
              verification: {
                verified: true,
                confidence: docType === "selfie" ? selfieResult.confidence : geminiResult.confidence,
                aiVerified: true,
              },
            },
            uri
          );
        }
        router.replace({
          pathname: "/success",
          params: {
            message: `KYC Approved! Confidence: ${geminiResult.confidence}%`,
            verified: "true",
            confidence: geminiResult.confidence.toString(),
          },
        });
      } else {
        router.replace({
          pathname: "/failed",
          params: {
            message: `KYC Rejected: ${geminiResult.issues.join(", ")}`,
            issues: JSON.stringify(geminiResult.issues),
            confidence: geminiResult.confidence.toString(),
            details: JSON.stringify(geminiResult.details || {}),
            verified: "false",
          },
        });
      }
    } catch (error) {
      console.error("❌ KYC submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  const progressFillWidth = `${(currentStep / DOCUMENT_STEPS.length) * 100}%`;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 bg-white">
      <ProgressHeader
        currentStep={currentStep}
        DOCUMENT_STEPS={DOCUMENT_STEPS}
        currentDocument={currentDocument}
        progressFillWidth={progressFillWidth}
      />

      <ScrollView className="flex-1 px-6 pt-6">
        <Text className="text-xl font-bold text-center mb-4">{currentDocument.name}</Text>
        <Text className="text-gray-600 text-center mb-6">{currentDocument.description}</Text>

        <ImagePriew
          isSelfieStep={isSelfieStep}
          openImagePicker={openImagePicker}
          documents={documents}
          currentDocument={currentDocument}
        />

        <Navagation
          currentStep={currentStep}
          handlePrevious={handlePrevious}
          handleNext={handleNext}
          documents={documents}
          currentDocument={currentDocument}
          isLastStep={isLastStep}
          handleSubmit={handleSubmit}
          allDocumentsUploaded={allDocumentsUploaded}
          loading={loading}
        />

        <View className="bg-gray-50 rounded-xl p-4 mb-8">
          <Text className="font-semibold mb-3">Document Status</Text>
          {DOCUMENT_STEPS.map((step, index) => (
            <View key={step.id} className="flex-row items-center mb-2">
              <View
                className={`w-3 h-3 rounded-full mr-3 ${
                  documents[step.id] ? "bg-green-500" : "bg-gray-300"
                }`}
              />
              <Text className={index === currentStep ? "font-semibold text-primary" : "text-gray-600"}>
                {step.name} {documents[step.id] ? "✓" : ""}
              </Text>
            </View>
          ))}
        </View>

        <AIHelpButton
          documentUri={documents[currentDocument.id]}
          onVerificationComplete={(result) =>
            setVerificationResults((prev) => ({
              ...prev,
              [currentDocument.id]: result,
            }))
          }
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
// this is the id page