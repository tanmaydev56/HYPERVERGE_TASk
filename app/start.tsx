// app/start.tsx
import { useRouter } from "expo-router";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

import { account } from "@/lib/appwrite";
import {
  ArrowLeft,
  Car,
  CreditCard,
  FileText,
  LogOut,
  ShieldCheck,
  UserCheck
} from "lucide-react-native";
import { useEffect } from "react";

const kycMethods = [
  {
    id: "digilocker",
    name: "Digilocker",
    icon: ShieldCheck,
    description: "Verify via Digilocker for instant KYC.",
  },
  {
    id: "aadhaar",
    name: "Aadhaar Card",
    icon: CreditCard,
    description: "Upload or scan your Aadhaar.",
  },
  {
    id: "pan",
    name: "PAN Card",
    icon: FileText,
    description: "Upload your PAN for identity verification.",
  },
  {
    id: "voterid",
    name: "Voter ID",
    icon: UserCheck,
    description: "Use your Voter ID for KYC.",
  },
  {
    id: "dl",
    name: "Driving License",
    icon: Car,
    description: "Verify using your Driving License.",
  },
];

export default function KYCStartScreen() {
  const router = useRouter();
  useEffect(() => {
    (async () => {
      try {
        await account.get(); // session OK
      } catch {
        router.replace("/login"); // no session
      }
    })(); 
    }, []);
 const logout = async () => {
    await account.deleteSession("current");
    router.replace("/login");
  };
  return (
    <View className="flex-1 bg-white px-6 pt-12">
      {/* Header */}
      <View className="flex-row items-center mb-6">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text className="flex-1 text-2xl font-bold text-gray-900">
          Choose KYC Method
        </Text>
        <TouchableOpacity onPress={logout}>
          <LogOut size={24} color="#EF4444" />
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={kycMethods}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const Icon = item.icon;
          return (
            <TouchableOpacity
              className="flex-row items-center bg-gray-50 p-4 rounded-xl mb-4 active:bg-gray-100"
              onPress={() => router.push(`/kyc/${item.id}`)}
            >
              <Icon size={36} color="#4A90E2" className="mr-4" />
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-900">
                  {item.name}
                </Text>
                <Text className="text-sm text-gray-600">{item.description}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}