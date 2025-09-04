import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Smartphone, FileText, Shield, Clock, CheckCircle } from "lucide-react-native";


export default function MethodSelectionScreen() {
  const router = useRouter();

  return (
     
    <ScrollView className="flex-1 bg-blue-50 p-6" >
      {/* Header Section */}
      
      <View className="items-center mt-10 mb-8">
        <View className="bg-blue-100 p-4 rounded-full mb-4">
          <Shield size={40} color="#1D4ED8" />
        </View>
        <Text className="text-3xl font-bold text-center text-gray-900 mb-2">
          Welcome to Secure KYC
        </Text>
        <Text className="text-lg text-gray-600 text-center">
          Let's verify your identity quickly and securely
        </Text>
      </View>

      {/* Process Overview */}
      <View className="bg-white rounded-2xl p-6 mb-6 border border-gray-100">
        <Text className="text-xl font-semibold text-center mb-4 text-gray-900">
           What You'll Need
        </Text>
        
        <View className="space-y-3">
          <View className="flex-row items-center">
            <CheckCircle size={20} color="#22C55E" />
            <Text className="ml-3 text-gray-700">Aadhaar Card</Text>
          </View>
          <View className="flex-row items-center">
            <CheckCircle size={20} color="#22C55E" />
            <Text className="ml-3 text-gray-700">PAN Card</Text>
          </View>
          <View className="flex-row items-center">
            <CheckCircle size={20} color="#22C55E" />
            <Text className="ml-3 text-gray-700">Driving License</Text>
          </View>
         
          <View className="flex-row items-center">
            <CheckCircle size={20} color="#22C55E" />
            <Text className="ml-3 text-gray-700">Your Selfie Photo</Text>
          </View>
        </View>
      </View>

      {/* Time Estimate */}
      <View className="bg-blue-50 rounded-2xl p-5 mb-6 border border-blue-100">
        <View className="flex-row items-center justify-center mb-2">
          <Clock size={20} color="#1D4ED8" />
          <Text className="ml-2 text-blue-800 font-semibold">
            Takes only 5-7 minutes
          </Text>
        </View>
        <Text className="text-center text-blue-600 text-sm">
          All documents can be captured with your phone camera
        </Text>
      </View>

      {/* Verification Options */}
     
      <Text className="text-lg font-semibold text-center mb-4 text-gray-900">
        Choose Verification Method
      </Text>

      {/* DigiLocker Option */}
      <TouchableOpacity
        className="bg-white rounded-2xl p-6 mb-4 border-2 border-blue-100 active:border-blue-300"
        onPress={() => router.push("/(kyc)/success")}
       
      >
        <View className="flex-row items-center">
          <View className="bg-blue-100 p-3 rounded-xl">
            <Smartphone size={28} color="#1D4ED8" />
          </View>
          <View className="ml-4 flex-1">
            <Text className="text-lg font-semibold text-gray-900">DigiLocker Verification</Text>
            <Text className="text-gray-600 mt-1 text-sm">
              Instant verification using government database
            </Text>
            <View className="flex-row items-center mt-2">
              <View className="bg-green-100 px-2 py-1 rounded">
                <Text className="text-green-800 text-xs font-medium">FASTEST</Text>
              </View>
              <Text className="text-blue-600 text-sm ml-2">Recommended</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {/* Document Upload Option */}
      <TouchableOpacity
        className="bg-white rounded-2xl p-6 mb-6 border-2 border-gray-100 active:border-gray-300"
        onPress={() => router.push("/(kyc)/document/aadhaar")}
      
        
      >
        <View className="flex-row items-center ">
          <View className="bg-gray-100 p-3 rounded-xl">
            <FileText size={28} color="#4B5563" />
          </View>
          <View className="ml-4 flex-1">
            <Text className="text-lg font-semibold text-gray-900">Manual Document Upload</Text>
            <Text className="text-gray-600 mt-1 text-sm">
              Upload photos of your documents step-by-step
            </Text>
            <View className="flex-row items-center mt-2">
              <Clock size={14} color="#6B7280" />
              <Text className="text-gray-500 text-sm ml-1">5-7 minutes</Text>
            </View>
          </View>
        </View>
       
      </TouchableOpacity>
     
<View className="h-20" >

  </View> 
      

    
    </ScrollView>
   
  );
}