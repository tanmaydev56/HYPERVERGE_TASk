import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { XCircle, AlertCircle, RefreshCw } from "lucide-react-native";

export default function FailedScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  
  const issues = params.issues ? JSON.parse(params.issues as string) : [];
  const rejectionReason = params.message || "KYC verification failed";

  return (
    <ScrollView className="flex-1 bg-red-50 p-6">
      <View className="flex-1 justify-center items-center min-h-screen">
        {/* Failure Header */}
        <View className="items-center mb-8">
          <XCircle size={80} color="#DC2626" />
          <Text className="text-3xl font-bold mt-4 text-center text-red-800">
            KYC Rejected ❌
          </Text>
          <Text className="text-lg text-red-600 text-center mt-2">
            {rejectionReason}
          </Text>
        </View>

        {/* Issues List */}
        {issues.length > 0 && (
          <View className="bg-white rounded-2xl p-6 mb-6 w-full border border-red-100">
            <View className="flex-row items-center mb-4">
              <AlertCircle size={24} color="#DC2626" />
              <Text className="text-xl font-semibold text-red-900 ml-2">
                Issues Found:
              </Text>
            </View>
            
            <View className="space-y-2">
              {issues.map((issue: string, index: number) => (
                <View key={index} className="flex-row items-start">
                  <Text className="text-red-500 mr-2">•</Text>
                  <Text className="text-red-700 flex-1">{issue}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Next Steps */}
        <View className="bg-yellow-50 rounded-2xl p-6 mb-6 w-full border border-yellow-200">
          <Text className="text-lg font-semibold text-center text-yellow-900 mb-4">
            What to do next?
          </Text>
          
          <View className="space-y-2">
            <Text className="text-yellow-800 text-center">
              • Check document quality and retry
            </Text>
            <Text className="text-yellow-800 text-center">
              • Ensure good lighting for photos
            </Text>
            <Text className="text-yellow-800 text-center">
              • Use original documents (no screenshots)
            </Text>
            <Text className="text-yellow-800 text-center">
              • Contact support if issues persist
            </Text>
          </View>
        </View>

        {/* Retry Button */}
        <TouchableOpacity 
          onPress={() => router.back()} // Go back to retry
          className="bg-red-600 px-8 py-4 rounded-xl w-full mb-4 active:bg-red-700"
        >
          <View className="flex-row items-center justify-center">
            <RefreshCw size={20} color="white" />
            <Text className="text-white text-lg font-semibold ml-2">
              Retry KYC
            </Text>
          </View>
        </TouchableOpacity>

        {/* Support Contact */}
        <TouchableOpacity 
          onPress={() => console.log("Contact support")}
          className="bg-gray-200 px-8 py-4 rounded-xl w-full"
        >
          <Text className="text-gray-700 text-lg font-semibold text-center">
            📞 Contact Support
          </Text>
        </TouchableOpacity>

        {/* Note */}
        <Text className="text-gray-500 text-center mt-6 text-xs">
          Note: You can retry KYC verification after fixing the issues mentioned above.
        </Text>
      </View>
    </ScrollView>
  );
}