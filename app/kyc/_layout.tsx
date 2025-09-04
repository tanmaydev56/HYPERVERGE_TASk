// app/_layout.tsx
import { initQueue } from "@/lib/offlineQueues";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "../globals.css";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity, View } from "react-native";
import { LogOut } from "lucide-react-native";
import { account } from "@/lib/appwrite";

export default function RootLayout() {
  const router = useRouter();
  
  const logout = async () => {
    try {
      await account.deleteSession("current");
      router.replace("/login");
    } catch (err: any) {
      alert("Logout failed: " + err.message);
    }
  };

  useEffect(() => { initQueue(); }, []);
  
  return (
    <>
      <SafeAreaView className="flex-1 bg-white">
        <StatusBar style="dark" />
        
        {/* Logout button container - aligned to top-right */}
        <View className="absolute top-0 right-0 z-50 p-4">
          <TouchableOpacity 
            onPress={logout}
            className="p-2 bg-red-100 rounded-full"
          >
            <LogOut size={24} color="#EF4444" />
          </TouchableOpacity>
        </View>

        <Stack
          screenOptions={{
            headerShown: false,     
          }}
        >
          {/* Public
          <Stack.Screen name="login" />
          <Stack.Screen name="signup" />
          <Stack.Screen name="otp" /> */}

          {/* Protected */}
          <Stack.Screen name="index" />
          <Stack.Screen name="start" />
        </Stack>
      </SafeAreaView>
    </>
  );
}