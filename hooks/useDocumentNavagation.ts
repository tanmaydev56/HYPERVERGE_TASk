// hooks/useDocumentNavigation.ts
import { useState } from "react";
import { useRouter } from "expo-router";
import { addToQueue } from "@/lib/offlineQueues";
import { analyzeWithGemini } from "@/lib/gemini";
import { Alert } from "react-native";
import { convertImageToBase64 } from "@/lib/imageUtils";

export const useDocumentNavigation = (DOCUMENT_STEPS: any[], setCurrentStep: any, documents: any) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    try {
      // Convert all images to base64 for offline queue
      const documentImages: { [key: string]: string } = {};
      
      for (const [docType, uri] of Object.entries(documents)) {
        if (uri && docType !== 'selfie') {
          const base64Image = await convertImageToBase64(uri);
          documentImages[docType] = base64Image;
        }
      }

      const selfieBase64 = documents.selfie ? await convertImageToBase64(documents.selfie) : null;

      // Add to offline queue
      await addToQueue({
        type: 'KYC_VERIFICATION',
        data: {
          documentImages,
          selfieImage: selfieBase64,
          timestamp: new Date().toISOString()
        }
      });

      // Analyze with Gemini AI
      const analysisResult = await analyzeWithGemini(documentImages, selfieBase64);
      
      if (analysisResult.kycStatus === 'approved') {
        router.push({
          pathname: "/results",
          params: { 
            status: 'approved',
            confidence: analysisResult.confidence,
            faceMatch: analysisResult.faceMatchConfidence
          }
        });
      } else {
        router.push({
          pathname: "/results",
          params: { 
            status: 'rejected',
            reason: analysisResult.rejectionReason,
            issues: JSON.stringify(analysisResult.issues)
          }
        });
      }
    } catch (error) {
      console.error('Submission error:', error);
      Alert.alert("Error", "Failed to submit documents. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    handleNext,
    handlePrevious,
    handleSubmit,
    loading
  };
};