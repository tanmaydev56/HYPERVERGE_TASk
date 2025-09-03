// app/_layout.tsx
import { initQueue } from "@/lib/offlineQueues";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "./globals.css";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  useEffect(() => { initQueue(); }, []);
  return (
    <>
    <SafeAreaView className="flex-1 bg-white" >
      <StatusBar style="dark" />
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