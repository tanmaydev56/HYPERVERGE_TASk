import { Audio } from 'expo-av';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AlertTriangle, Languages } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { languageContent } from '@/constants/constant';

export default function FailedScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(true);
  const [lang, setLang] = useState<'en' | 'hi'>('hi');

  const content = languageContent[lang];
  const issues = params.issues ? JSON.parse(params.issues as string) : [];

  /* ------------ AUDIO ------------ */
  useEffect(() => {
    const playFailSound = async () => {
      try {
        const  sound  = new Audio.Sound();
        setIsPlaying(true);
        await sound.loadAsync(require('@/assets/audio/kyc-failed.mp3'));
        await sound.playAsync();
        setTimeout(() => setIsPlaying(false), 1500);
      } catch {
        setIsPlaying(false);
      }
    };
    playFailSound();
  }, []);

  
  return (
    <ScrollView className="flex-1 bg-red-50">
      {/* Lang toggle */}
      <TouchableOpacity
        onPress={() => setLang(prev => prev === 'hi' ? 'en' : 'hi')}
        className="absolute top-5 left-5 z-50 bg-white p-3 rounded-full shadow"
      >
        <Languages size={24} color="#374151" />
      </TouchableOpacity>

      <View className="p-6 pt-20 items-center">
        <AlertTriangle size={80} color="#EF4444" />
        <Text className="text-3xl font-bold text-center text-red-800 mt-4">
          {content.title}
        </Text>
        <Text className="text-lg text-red-600 text-center mt-2">
          {params.message || content.subtitle}
        </Text>
      </View>

      {/* Audio banner */}
      <View className="bg-red-100 rounded-xl p-4 mx-6 mb-6 border border-red-200">
        <Text className="text-red-800 font-semibold flex-row items-center">
          {isPlaying ? '🔊' : 'ℹ️'} {content.audioMessage}
        </Text>
        <Text className="text-red-600 text-sm mt-1">{content.audioText}</Text>
      </View>

      {/* Issues list */}
      <View className="bg-white rounded-2xl p-5 mx-6 mb-6 border border-red-100">
        <Text className="text-lg font-bold text-gray-900 mb-3">{content.issuesTitle}</Text>
        {(issues.length ? issues : content.issues).map((i: string, idx: number) => (
          <Text key={idx} className="text-gray-700 mb-1">• {i}</Text>
        ))}
      </View>
        {/* Gemini-Exact Reasons */}
{issues.length > 0 && (
  <View className="bg-orange-50 rounded-2xl p-5 mx-6 mb-6 border border-orange-200">
    <Text className="text-lg font-bold text-orange-900 mb-3">
      🧠 AI detected these problems:
    </Text>
    {issues.map((i: string, idx: number) => (
      <Text key={idx} className="text-orange-800 mb-1">• {i}</Text>
    ))}
    <Text className="text-xs text-orange-600 mt-2">
      Confidence: {params.confidence || 0}%
    </Text>
  </View>
)}
      {/* Next steps */}
      <View className="bg-white rounded-2xl p-5 mx-6 mb-6 border border-gray-100">
        <Text className="text-lg font-bold text-gray-900 mb-3">{content.nextStepsTitle}</Text>
        {content.nextSteps.map((s, idx) => (
          <Text key={idx} className="text-gray-700 mb-1">• {s}</Text>
        ))}
      </View>

      {/* Retry */}
      <TouchableOpacity
        onPress={() => router.replace('/(kyc)/document/aadhaar')}
        className="bg-red-600 mx-6 p-4 rounded-xl active:bg-red-700"
      >
        <Text className="text-white text-lg font-semibold text-center">{content.retryButton}</Text>
      </TouchableOpacity>

      {/* Help */}
      <Text className="text-gray-500 text-center mt-6 text-xs px-6">
        {content.helpText}{'\n'}{content.certificateText}
      </Text>
    </ScrollView>
  );
}