import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Smartphone, FileText } from "lucide-react-native";

export default function MethodSelectionScreen() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-gray-50 p-6">
      <Text className="text-2xl font-bold text-center mt-10 mb-2">
        Verify Your Identity
      </Text>
      <Text className="text-gray-600 text-center mb-10">
        Choose your preferred verification method
      </Text>

      {/* DigiLocker Option */}
      <TouchableOpacity
        className="bg-white rounded-xl p-6 mb-4 shadow-sm border border-gray-200"
        onPress={() => router.push("/kyc/digilocker")}
      >
        <View className="flex-row items-center">
          <Smartphone size={32} color="#4A90E2" />
          <View className="ml-4 flex-1">
            <Text className="text-lg font-semibold">DigiLocker Verification</Text>
            <Text className="text-gray-600 mt-1">
              Fast and secure. Fetch your documents directly from government database
            </Text>
            <Text className="text-blue-600 mt-2 text-sm">Recommended</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Document Upload Option */}
      <TouchableOpacity
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        onPress={() => router.push("/kyc/document/aadhaar")} // Changed to start with Aadhaar
      >
        <View className="flex-row items-center">
          <FileText size={32} color="#4A90E2" />
          <View className="ml-4 flex-1">
            <Text className="text-lg font-semibold">Document Upload</Text>
            <Text className="text-gray-600 mt-1">
              Upload photos of your Aadhaar, PAN, Driving License, Voter ID and Selfie
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <Text className="text-gray-500 text-center mt-10 text-sm">
        Your data is securely encrypted and never shared without your permission
      </Text>
    </ScrollView>
  );
}