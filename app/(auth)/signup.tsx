//app/signup.tsx
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
import { account, ID } from "../../lib/appwrite";

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async () => {
    if (!email.trim() || !password.trim() || !name.trim()) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    setLoading(true);
    try {
      await account.create(ID.unique(), email.trim(), password.trim(), name.trim());
      await account.createEmailPasswordSession(email.trim(), password.trim());
      router.replace("/start"); // next step after signup
    } catch (err: any) {
      Alert.alert("Signup failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white px-6 justify-center"
    >
      <Text className="text-3xl font-bold text-gray-900 mb-2">Create Account</Text>
      <Text className="text-gray-600 mb-8">Fill in your details to get started</Text>

      <TextInput
        className="border border-gray-300 rounded-xl px-4 py-4 mb-4 bg-gray-50"
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />

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
        onPress={handleSignup}
        disabled={loading}
      >
        <Text className="text-white text-lg font-semibold">
          {loading ? "Creating..." : "Sign Up"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()} className="mt-4">
        <Text className="text-center text-primary">Already have an account? Sign in</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}