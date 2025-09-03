// components/AIHelpButton.tsx
import { TouchableOpacity, Text, Alert } from 'react-native';
import { MessageCircle } from 'lucide-react-native';
import { useLocalSearchParams } from 'expo-router';

// Simulated LLM responses based on context
const getAIResponse = (currentStep: string, documentType?: string) => {
  const responses: {[key: string]: string} = {
    aadhaar: "I see you're uploading Aadhaar. Make sure the 12-digit number is clearly visible and all four corners of the card are in the frame. Avoid shadows and glare.",
    pan: "For PAN card, ensure the PAN number (like ABCDE1234F) is clear and readable. The photo should include your name, father's name, and date of birth.",
    dl: "When capturing your Driving License, ensure the DL number, name, and validity dates are visible. Hold the card steady in good lighting.",
    voterid: "For Voter ID, make sure the EPIC number and your photo on the card are clear. Capture the front side with all details visible.",
    selfie: "For your selfie, ensure good lighting on your face. Remove sunglasses or hats. Look directly at the camera and make sure your entire face is visible.",
    general: "I'm here to help with your KYC process. You need to upload Aadhaar, PAN, Driving License, Voter ID, and a selfie photo. Make sure all documents are clear and valid.",
    offline: "You seem to be offline. Your documents will be saved securely and uploaded automatically when you're back online. You can continue the process.",
    error: "I notice there might be an issue. Please check your internet connection or try again. If the problem persists, contact support."
  };

  return responses[documentType || currentStep] || responses.general;
};

export default function AIHelpButton() {
  const params = useLocalSearchParams();
  const currentStep = params.id as string || 'general';

  const getHelp = () => {
    // Simulate LLM analysis based on current context
    const helpMessage = getAIResponse('help', currentStep);
    
    Alert.alert(
      "🤖 AI Assistant",
      helpMessage,
      [
        { 
          text: "Tell me more", 
          onPress: () => Alert.alert(
            "Additional Tips", 
            "• Use natural light for better photos\n• Keep the document flat on a dark surface\n• Ensure no fingers are covering the details\n• Check that all text is readable\n• Avoid reflections and glares",
            [{ text: "Got it" }]
          ) 
        },
        { text: "Thanks", style: "cancel" }
      ]
    );
  };

  return (
    <TouchableOpacity 
      onPress={getHelp} 
      className="absolute top-4 right-4 bg-blue-100 p-3 rounded-full shadow-md z-10"
      accessibilityLabel="Get AI help"
      accessibilityHint="Tap to get contextual help from AI assistant"
    >
      <MessageCircle size={24} color="#1D4ED8" />
    </TouchableOpacity>
  );
}