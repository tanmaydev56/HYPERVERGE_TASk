//app/login.tsx
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity
} from "react-native";
import { account } from "../../lib/appwrite";



export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }
    
    setLoading(true);
    
    try {
      await account.createEmailPasswordSession(email.trim(), password.trim());
      router.replace("/start"); // or /profile-setup if you prefer
    } catch (err: any) {
      Alert.alert("Login failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white px-6 justify-center"
    >
      <Text className="text-3xl font-bold text-gray-900 mb-2">Welcome back</Text>
      <Text className="text-gray-600 mb-8">Sign in to continue</Text>

      <TextInput
        className="border border-gray-300 rounded-xl px-4 py-4 mb-4 bg-gray-50"
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        className="border border-gray-300 rounded-xl px-4 py-4 bg-gray-50"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        className={`mt-6 rounded-xl py-4 items-center ${loading ? "bg-gray-400" : "bg-primary"}`}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text className="text-white text-lg font-semibold">
          {loading ? "Signing in..." : "Sign In"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/signup")} className="mt-4">
        <Text className="text-center text-primary">Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}