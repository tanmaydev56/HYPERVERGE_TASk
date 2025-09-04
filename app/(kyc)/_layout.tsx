// app/_layout.tsx
import { Stack, useRouter } from "expo-router";
import "../globals.css";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity, View } from "react-native";
import {  LogOut } from "lucide-react-native";
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


  return (
    <>
      <SafeAreaView className="flex-1 bg-black">
        
        
      
        <View className="absolute top-[3.2rem] right-6 z-50 p-2">
          
          <TouchableOpacity 
            onPress={logout}
            className="p-3 bg-red-100 rounded-full"
          >
            <LogOut size={24} color="#EF4444" />
          </TouchableOpacity>
        </View>
      

        <Stack
          screenOptions={{
            headerShown: false,     
          }}
        >
        

          
          <Stack.Screen name="index" />
          <Stack.Screen name="start" />
        </Stack>
      </SafeAreaView>
    </>
  );
}