import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CheckCircle, Banknote, Building, Download, Phone } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Audio } from 'expo-av';

export default function SuccessScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [sound, setSound] = useState<Audio.Sound>();

  // Play success voice message
  useEffect(() => {
    const playSuccessSound = async () => {
      try {
        // For voice message, you can use text-to-speech or pre-recorded audio
        // Using Expo AV for simple sound playback
        const { sound } = await Audio.Sound.createAsync(
          require('@/assets/audio/kyc-success.mp3') // Add your audio file
        );
        setSound(sound);
        await sound.playAsync();
      } catch (error) {
        console.log('Error playing sound:', error);
        // Fallback: Use system text-to-speech if needed
      }
    };

    playSuccessSound();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  return (
    <ScrollView className="flex-1 bg-green-50">
      <View className="flex-1 justify-center items-center p-6 min-h-screen">
        {/* Success Header */}
        <View className="items-center mb-8">
          <CheckCircle size={80} color="#22C55E" />
          <Text className="text-3xl font-bold mt-4 text-center text-green-800">
            जी, आपकी KYC पूरी हो गई है! ✅
          </Text>
          <Text className="text-lg text-green-600 text-center mt-2">
            (Yes, your KYC is completed!)
          </Text>
        </View>

        {/* Voice Message Indicator */}
        <View className="bg-green-100 rounded-xl p-4 mb-6 border border-green-200">
          <View className="flex-row items-center">
            <Phone size={24} color="#16a34a" />
            <Text className="text-green-800 ml-2 font-semibold">
              Audio message playing: "KYC verified successfully"
            </Text>
          </View>
        </View>

        {/* What You Can Do Now */}
        <View className="bg-white rounded-2xl p-6 mb-6 w-full border border-green-100">
          <Text className="text-xl font-bold text-center text-gray-900 mb-4">
            अब आप यह कर सकते हैं: 📋
          </Text>
          <Text className="text-lg text-center text-gray-700 mb-4">
            (Now you can do this:)
          </Text>

          {/* Loan Option */}
          <TouchableOpacity className="bg-blue-50 rounded-xl p-4 mb-4 border border-blue-100">
            <View className="flex-row items-center">
              <Banknote size={32} color="#1d4ed8" />
              <View className="ml-4 flex-1">
                <Text className="text-lg font-semibold text-blue-900">
                  लोन ले सकते हैं 💰
                </Text>
                <Text className="text-blue-700 text-sm">
                  (You can take a loan)
                </Text>
                <Text className="text-gray-600 text-xs mt-1">
                  Agriculture loan, business loan, personal loan
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Bank Account Option */}
          <TouchableOpacity className="bg-green-50 rounded-xl p-4 mb-4 border border-green-100">
            <View className="flex-row items-center">
              <Building size={32} color="#16a34a" />
              <View className="ml-4 flex-1">
                <Text className="text-lg font-semibold text-green-900">
                  बैंक खाता खोल सकते हैं 🏦
                </Text>
                <Text className="text-green-700 text-sm">
                  (You can open a bank account)
                </Text>
                <Text className="text-gray-600 text-xs mt-1">
                  Zero balance account, savings account, current account
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Government Schemes */}
          <TouchableOpacity className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
            <View className="flex-row items-center">
              <Download size={32} color="#ca8a04" />
              <View className="ml-4 flex-1">
                <Text className="text-lg font-semibold text-yellow-900">
                  सरकारी योजनाएं पा सकते हैं 🌾
                </Text>
                <Text className="text-yellow-700 text-sm">
                  (Get government schemes)
                </Text>
                <Text className="text-gray-600 text-xs mt-1">
                  PM-KISAN, Fasal Bima, Mudra Loan, and more
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Next Steps */}
        <View className="bg-white rounded-2xl p-6 mb-6 w-full border border-gray-100">
          <Text className="text-lg font-semibold text-center text-gray-900 mb-4">
            आगे क्या करें? 📞
          </Text>
          <Text className="text-gray-700 text-center mb-2">
            (What to do next?)
          </Text>
          
          <View className="space-y-2">
            <Text className="text-gray-600 text-center">
              • बैंक जाएं या एजेंट से बात करें
            </Text>
            <Text className="text-gray-600 text-center">
              • लोन के लिए आवेदन करें
            </Text>
            <Text className="text-gray-600 text-center">
              • सरकारी योजनाओं की जानकारी लें
            </Text>
          </View>
        </View>

        {/* Contact Support */}
        <View className="items-center mb-8">
          <Text className="text-gray-600 text-center mb-2">
            मदद चाहिए? हमारी टीम आपकी मदद करेगी
          </Text>
          <TouchableOpacity className="bg-orange-500 px-6 py-3 rounded-full">
            <Text className="text-white font-semibold">
              📞 1800-123-4567 (Free)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Done Button */}
        <TouchableOpacity 
          onPress={() => router.replace('/')}
          className="bg-green-600 px-8 py-4 rounded-xl w-full"
        >
          <Text className="text-white text-lg font-semibold text-center">
            समाप्त करें (Done)
          </Text>
        </TouchableOpacity>

        {/* Certificate Note */}
        <Text className="text-gray-500 text-center mt-6 text-xs">
          ✅ आपका KYC प्रमाणपत्र 2 घंटे में तैयार हो जाएगा
          {"\n"}
          (Your KYC certificate will be ready in 2 hours)
        </Text>
      </View>
    </ScrollView>
  );
}