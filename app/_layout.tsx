// app/_layout.tsx
import { initQueue } from "@/lib/offlineQueues";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "./globals.css";

export default function RootLayout() {
  useEffect(() => { initQueue(); }, []);
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,     
        }}
      >
        {/* Public */}
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="otp" />

        {/* Protected */}
        <Stack.Screen name="index" />
        <Stack.Screen name="start" />
        
      </Stack>
    </>
  );
}