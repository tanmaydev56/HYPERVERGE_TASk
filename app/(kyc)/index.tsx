// app/index.tsx
import { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { LogOut } from "lucide-react-native";
import { account } from "../../lib/appwrite";

export default function HomeScreen() {
  const router = useRouter();


  useEffect(() => {
    (async () => {
      try {
        await account.get();
      } catch {
        router.replace("/login");
      }
    })();
  }, []);

  /* Logout handler */


  return (
    <View className="flex-1 bg-white px-6 pt-12">
      {/* Header */}
      <View className="flex-row items-center">
        <Text className="flex-1 text-2xl font-bold text-gray-900">
          Dashboard
        </Text>
       
      </View>

      <View className="flex-1 items-center justify-center">
        <Text className="text-3xl font-bold mb-6">Welcome back!</Text>

        <TouchableOpacity
          className="bg-primary px-6 py-3 rounded-xl"
          onPress={() => router.push("/start")}
        >
          <Text className="text-white text-lg font-semibold">Start KYC</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}