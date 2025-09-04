import { Audio } from 'expo-av';
import { useLocalSearchParams, useRouter } from "expo-router";
import { Banknote, Building, CheckCircle, Download, Languages, Phone } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

// Language content definitions
const languageContent = {
  en: {
    title: "Yes, your KYC is completed! ✅",
    subtitle: "(Your verification was successful)",
    audioMessage: "Audio message playing: 'KYC verified successfully'",
    audioText: '"Your KYC has been completed successfully. You can now take loans and open bank accounts."',
    sectionTitle: "Now you can: 📋",
    loanTitle: "Take a loan 💰",
    loanSubtitle: "(Get financial assistance)",
    loanDetails: "Agriculture loan, business loan, personal loan",
    bankTitle: "Open bank account 🏦",
    bankSubtitle: "(Start banking services)",
    bankDetails: "Zero balance account, savings account, current account",
    schemesTitle: "Get government schemes 🌾",
    schemesSubtitle: "(Access government programs)",
    schemesDetails: "PM-KISAN, Crop Insurance, Mudra Loan, and more",
    nextStepsTitle: "What to do next? 📞",
    nextSteps: [
      "Visit bank or talk to agent",
      "Apply for loan",
      "Get information about government schemes"
    ],
    helpText: "Need help? Our team will assist you",
    doneButton: "Finish",
    certificateText: "✅ Your KYC certificate will be ready in 2 hours"
  },
  hi: {
    title: "जी, आपकी KYC पूरी हो गई है! ✅",
    subtitle: "(Yes, your KYC is completed!)",
    audioMessage: "Audio message playing: 'KYC verified successfully'",
    audioText: '"आपकी KYC सफलतापूर्वक पूरी हो गई है। अब आप लोन ले सकते हैं और बैंक खाता खोल सकते हैं।"',
    sectionTitle: "अब आप यह कर सकते हैं: 📋",
    loanTitle: "लोन ले सकते हैं 💰",
    loanSubtitle: "(You can take a loan)",
    loanDetails: "Agriculture loan, business loan, personal loan",
    bankTitle: "बैंक खाता खोल सकते हैं 🏦",
    bankSubtitle: "(You can open a bank account)",
    bankDetails: "Zero balance account, savings account, current account",
    schemesTitle: "सरकारी योजनाएं पा सकते हैं 🌾",
    schemesSubtitle: "(Get government schemes)",
    schemesDetails: "PM-KISAN, Fasal Bima, Mudra Loan, and more",
    nextStepsTitle: "आगे क्या करें? 📞",
    nextSteps: [
      "बैंक जाएं या एजेंट से बात करें",
      "लोन के लिए आवेदन करें",
      "सरकारी योजनाओं की जानकारी लें"
    ],
    helpText: "मदद चाहिए? हमारी टीम आपकी मदद करेगी",
    doneButton: "समाप्त करें",
    certificateText: "✅ आपका KYC प्रमाणपत्र 2 घंटे में तैयार हो जाएगा"
  }
};

export default function SuccessScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'hi'>('hi');

  const content = languageContent[currentLanguage];
const confidence = params.confidence ? ` with ${params.confidence}% confidence` : '';

  // Play success voice message
   useEffect(() => {
    const playSuccessSound = async () => {
      try {
        // Using expo-audio instead of expo-av
        const sound = new Audio.Sound();
        
       
        setIsPlaying(true);
        await sound.loadAsync(require('@/assets/audio/kyc-success.mp3'));
        await sound.playAsync();
        
        
        setTimeout(() => {
          setIsPlaying(false);
        }, 1000); 
        
      } catch (error) {
        console.log('Audio not available, showing visual message only');
        setIsPlaying(false);
      }
    };

    playSuccessSound();
  }, []);

  const toggleLanguage = () => {
    setCurrentLanguage(prev => prev === 'hi' ? 'en' : 'hi');
  };

  return (
    <ScrollView className="flex-1 bg-green-50">
    
      <TouchableOpacity 
        onPress={toggleLanguage}
        className="absolute top-4 right-4 z-50 bg-white p-3 rounded-full shadow-md border border-gray-200"
       
      >
        <Languages size={24} color="#4B5563" />
        <Text className="text-xs text-gray-600 mt-1 text-center">
          {currentLanguage.toUpperCase()}
        </Text>
         
      </TouchableOpacity>
       

      <View className="flex-1 justify-center items-center p-6 min-h-screen pt-16">
        {/* Success Header */}
        <View className="items-center mb-8">
          <CheckCircle size={80} color="#22C55E" />
          <Text className="text-3xl font-bold mt-4 text-center text-green-800">
            {content.title}
          </Text>
          <Text className="text-lg text-green-600 text-center mt-2">
            {content.subtitle}
          </Text>
          <Text className="text-lg text-green-600 text-center mt-2">
        {params.message || `KYC Approved${confidence}!`}
      </Text>
        </View>

        
        <View className="bg-green-100 rounded-xl p-4 mb-6 border border-green-200 w-full">
          <View className="flex-row items-center">
            <Phone size={24} color="#16a34a" />
            <Text className="text-green-800 ml-2 font-semibold">
              {isPlaying ? "🔊 Playing audio message..." : "✅ KYC verified successfully"}
            </Text>
          </View>
          <Text className="text-green-600 text-sm mt-2">
            {content.audioText}
          </Text>
        </View>

        {/* What You Can Do Now */}
        <View className="bg-white rounded-2xl p-6 mb-6 w-full border border-green-100">
          <Text className="text-xl font-bold text-center text-gray-900 mb-4">
            {content.sectionTitle}
          </Text>

          {/* Loan Option */}
          <TouchableOpacity 
            className="bg-blue-50 rounded-xl p-4 mb-4 border border-blue-100 active:bg-blue-100"
            onPress={() => console.log("Loan option selected")}
          >
            <View className="flex-row items-center">
              <Banknote size={32} color="#1d4ed8" />
              <View className="ml-4 flex-1">
                <Text className="text-lg font-semibold text-blue-900">
                  {content.loanTitle}
                </Text>
                <Text className="text-blue-700 text-sm">
                  {content.loanSubtitle}
                </Text>
                <Text className="text-gray-600 text-xs mt-1">
                  {content.loanDetails}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Bank Account Option */}
          <TouchableOpacity 
            className="bg-green-50 rounded-xl p-4 mb-4 border border-green-100 active:bg-green-100"
            onPress={() => console.log("Bank account option selected")}
          >
            <View className="flex-row items-center">
              <Building size={32} color="#16a34a" />
              <View className="ml-4 flex-1">
                <Text className="text-lg font-semibold text-green-900">
                  {content.bankTitle}
                </Text>
                <Text className="text-green-700 text-sm">
                  {content.bankSubtitle}
                </Text>
                <Text className="text-gray-600 text-xs mt-1">
                  {content.bankDetails}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Government Schemes */}
          <TouchableOpacity 
            className="bg-yellow-50 rounded-xl p-4 border border-yellow-100 active:bg-yellow-100"
            onPress={() => console.log("Govt schemes selected")}
          >
            <View className="flex-row items-center">
              <Download size={32} color="#ca8a04" />
              <View className="ml-4 flex-1">
                <Text className="text-lg font-semibold text-yellow-900">
                  {content.schemesTitle}
                </Text>
                <Text className="text-yellow-700 text-sm">
                  {content.schemesSubtitle}
                </Text>
                <Text className="text-gray-600 text-xs mt-1">
                  {content.schemesDetails}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Next Steps */}
        <View className="bg-white rounded-2xl p-6 mb-6 w-full border border-gray-100">
          <Text className="text-lg font-semibold text-center text-gray-900 mb-4">
            {content.nextStepsTitle}
          </Text>
          
          <View className="space-y-2">
            {content.nextSteps.map((step, index) => (
              <Text key={index} className="text-gray-600 text-center">
                • {step}
              </Text>
            ))}
          </View>
        </View>

       

        {/* Done Button */}
        <TouchableOpacity 
          onPress={() => router.replace('/')}
          className="bg-green-600 px-8 py-4 rounded-xl w-full active:bg-green-700"
        >
          <Text className="text-white text-lg font-semibold text-center">
            {content.doneButton}
          </Text>
        </TouchableOpacity>

      
        <Text className="text-gray-500 text-center mt-6 text-xs">
          {content.certificateText}
        </Text>
      </View>
    </ScrollView>
  );
}