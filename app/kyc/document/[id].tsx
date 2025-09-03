// app/kyc/[id].tsx
import { useEffect, useState } from "react";
import {
  View, Text, TouchableOpacity, Alert,
  KeyboardAvoidingView, Platform, Image, ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Camera, ChevronLeft, ChevronRight } from "lucide-react-native";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { addToQueue } from "@/lib/offlineQueues";
import AIHelpButton from "@/components/AIHelpButton";

const DOCUMENT_STEPS = [
  { id: "aadhaar", name: "Aadhaar Card", description: "Front side of your Aadhaar card" },
  { id: "pan", name: "PAN Card", description: "Front side of your PAN card" },
  { id: "dl", name: "Driving License", description: "Front side of your Driving License" },
  { id: "voterid", name: "Voter ID", description: "Front side of your Voter ID card" },
  { id: "selfie", name: "Selfie Photo", description: "Clear photo of your face" },
];

export default function DocumentCollectionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [documents, setDocuments] = useState<{[key: string]: string | null}>({
    aadhaar: null,
    pan: null,
    dl: null,
    voterid: null,
    selfie: null,
  });
  const [loading, setLoading] = useState(false);

  const currentDocument = DOCUMENT_STEPS[currentStep];
  const isLastStep = currentStep === DOCUMENT_STEPS.length - 1;
  const allDocumentsUploaded = Object.values(documents).every(doc => doc !== null);

  useEffect(() => {
    if (!DOCUMENT_STEPS.find(step => step.id === id)) {
      router.back();
    }
  }, [id]);

  const openCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "Camera permission is needed to capture documents");
        return;
      }

      const isSelfie = currentDocument.id === "selfie";
      const res = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: isSelfie ? [1, 1] : [4, 3],
        quality: 0.7,
      });

      if (!res.canceled) {
        const compressed = await ImageManipulator.manipulateAsync(
          res.assets[0].uri,
          [{ resize: { width: isSelfie ? 640 : 800 } }],
          { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG }
        );

        setDocuments(prev => ({
          ...prev,
          [currentDocument.id]: compressed.uri
        }));
      }
    } catch (error) {
      Alert.alert("Error", "Failed to capture image. Please try again.");
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
      // Add all documents to offline queue
      for (const [docType, uri] of Object.entries(documents)) {
        if (uri && docType !== "selfie") {
          await addToQueue(docType, { documentType: docType }, uri);
        }
      }
      
      // Add selfie separately
      if (documents.selfie) {
        await addToQueue("selfie", { documentType: "selfie" }, documents.selfie);
      }

      router.replace({
        pathname: "/success",
        params: { message: "All documents submitted successfully!" }
      });
    } catch (error) {
      Alert.alert("Error", "Failed to submit documents. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getProgressPercentage = () => {
    return ((currentStep + 1) / DOCUMENT_STEPS.length) * 100;
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      className="flex-1 bg-white"
    >
      <AIHelpButton />
      
      {/* Progress Header */}
      <View className="bg-primary px-6 pt-12 pb-4">
        <Text className="text-white text-lg font-bold text-center mb-2">
          Step {currentStep + 1} of {DOCUMENT_STEPS.length}
        </Text>
        <Text className="text-white text-center mb-4">
          {currentDocument.name}
        </Text>
        
        {/* Progress Bar */}
        <View className="bg-white bg-opacity-30 rounded-full h-2 mb-2">
          <View 
            className="bg-white rounded-full h-2"
            style={{ width: `${getProgressPercentage()}%` }}
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

        {/* Camera Preview or Placeholder */}
        {documents[currentDocument.id] ? (
          <View className="items-center mb-6">
            <Image 
              source={{ uri: documents[currentDocument.id] as string }} 
              className="w-full h-64 rounded-xl mb-4 border border-gray-200"
              resizeMode="contain"
            />
            <TouchableOpacity 
              onPress={openCamera}
              className="bg-gray-100 rounded-xl px-6 py-3 items-center"
            >
              <Text className="text-primary font-semibold">Retake Photo</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity 
            onPress={openCamera}
            className="bg-gray-100 rounded-xl py-12 items-center mb-6 border-2 border-dashed border-gray-300"
          >
            <Camera size={48} color="#4A90E2" />
            <Text className="text-primary text-lg font-semibold mt-3">
              Tap to Capture
            </Text>
            <Text className="text-gray-600 text-center mt-2 px-4">
              Make sure the document is clear and all details are visible
            </Text>
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