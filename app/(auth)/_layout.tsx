// app/_layout.tsx

import { Stack } from "expo-router";
import "../globals.css";
import { SafeAreaView } from "react-native-safe-area-context";


export default function RootLayout() {

  
  return (
    <>
      <SafeAreaView className="flex-1 bg-white">
        <Stack
          screenOptions={{
            headerShown: false,     
          }}
        >
       
          <Stack.Screen name="login" />
          <Stack.Screen name="signup" />
        </Stack>
      </SafeAreaView>
    </>
  );
}