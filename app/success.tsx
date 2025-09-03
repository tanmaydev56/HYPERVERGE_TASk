// app/success.tsx (update)
import { View, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CheckCircle, XCircle } from "lucide-react-native";

export default function SuccessScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const isApproved = params.verified === "true";
const params = useLocalSearchParams();
  const router = useRouter();
  const isApproved = params.verified === "true";
  return (
    <View className="flex-1 bg-white justify-center items-center p-6">
      {isApproved ? (
        <>
          <CheckCircle size={80} color="#22C55E" />
          <Text className="text-2xl font-bold mt-4 text-center text-green-600">
            KYC Approved! ✅
          </Text>
          <Text className="text-gray-600 text-center mt-2 mb-4">
            {params.message || "Your KYC verification was successful!"}
          </Text>
        </>
      ) : (
        <>
          <XCircle size={80} color="#DC2626" />
          <Text className="text-2xl font-bold mt-4 text-center text-red-600">
            KYC Rejected
          </Text>
          <Text className="text-gray-600 text-center mt-2 mb-4">
            {params.message || "Please check your documents and try again."}
          </Text>
        </>
      )}
      
      <TouchableOpacity 
        onPress={() => router.replace('/')}
        className="bg-primary px-8 py-4 rounded-xl"
      >
        <Text className="text-white text-lg font-semibold">Done</Text>
      </TouchableOpacity>
    </View>
  );
}