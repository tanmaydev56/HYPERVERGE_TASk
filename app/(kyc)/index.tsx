// app/index.tsx
import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { User, Shield } from "lucide-react-native";
import {Models} from "appwrite";
import { account } from "../../lib/appwrite";

export default function HomeScreen() {
  const router = useRouter();
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await account.get();
      setUser(currentUser);
    } catch (error) {
      console.error('Auth error:', error);
      router.replace("/login");
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <View className="flex-1 bg-white px-6 pt-6">
    
      <View className="flex-row items-center justify-between mb-8">
        <View className="flex-row items-center">
          <View className="bg-blue-100 p-3 rounded-full mr-3">
            <User size={24} color="#3B82F6" />
          </View>
          <View>
            <Text className="text-lg font-semibold text-gray-900">
              Welcome back{user?.name ? `, ${user.name}` : '!'}
            </Text>
            {user?.email && (
              <Text className="text-gray-600 text-sm">{user.email}</Text>
            )}
          </View>
        </View>
        
      
      </View>

      
      <View className="flex-1 items-center justify-center">
        
        <View className="items-center mb-8">
          <View className="bg-blue-50 p-4 rounded-full mb-4">
            <Shield size={40} color="#3B82F6" />
          </View>
          <Text className="text-2xl font-bold text-center text-gray-900 mb-2">
            Secure KYC Verification
          </Text>
          <Text className="text-gray-600 text-center">
            Complete your identity verification in just a few minutes
          </Text>
        </View>

        <View className="bg-blue-50 rounded-xl p-5 mb-8 w-full border border-blue-200">
          <Text className="text-lg font-semibold text-blue-900 mb-3">Your Status</Text>
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-2xl font-bold text-blue-800">0</Text>
              <Text className="text-blue-600 text-sm">Verified</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-blue-800">3</Text>
              <Text className="text-blue-600 text-sm">Required</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-blue-800">0%</Text>
              <Text className="text-blue-600 text-sm">Complete</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          className="bg-blue-600 px-8 py-4 rounded-xl w-full items-center shadow-lg"
          onPress={() => router.push("/start")}
        
        >
          <Text className="text-white text-lg font-semibold">Start KYC Verification</Text>
          <Text className="text-blue-100 text-sm mt-1">Takes 5-7 minutes</Text>
        </TouchableOpacity>

      
        
      </View>
      <View className="pb-6">
        <Text className="text-center text-gray-400 text-xs">
          Last login: {new Date().toLocaleDateString()}
        </Text>
        <Text className="text-center text-gray-400 text-xs mt-1">
          Your data is securely encrypted
        </Text>
      </View>
    </View>
  );
}