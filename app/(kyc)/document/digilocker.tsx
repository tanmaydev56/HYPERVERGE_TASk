import {  Text, View, TouchableOpacity, ScrollView, Linking } from 'react-native'
import React  from 'react'
import { useRouter } from 'expo-router'
import { ArrowLeft, Shield, Download, Smartphone,  ExternalLink } from 'lucide-react-native'

const DigiLockerScreen = () => {
  const router = useRouter()


  const openDigiLockerApp = () => {
    Linking.openURL('digilocker://')
      .catch(() => {
        Linking.openURL('https://digilocker.gov.in/')
      })
  }

  const openDigiLockerWeb = () => {
    Linking.openURL('https://digilocker.gov.in/')
  }

 

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center p-6  bg-white">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="p-2 mr-4"
        >
          <ArrowLeft size={26}   color="#374151" />
        </TouchableOpacity>
       
      </View>

      <ScrollView className="flex-1 p-6">
        {/* Hero Section */}
        <View className="items-center mb-8">
          <View className="bg-blue-100 p-6 rounded-full mb-4">
            <Shield size={48} color="#1D4ED8" />
          </View>
          <Text className="text-2xl font-bold text-center text-gray-900 mb-2">
            Secure Instant Verification
          </Text>
          <Text className="text-gray-600 text-center text-lg">
            Connect your DigiLocker account for instant document verification
          </Text>
        </View>

              {/* Get DigiLocker */}
        <View className="bg-gray-50 rounded-2xl p-5 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">Don't have DigiLocker?</Text>
          <TouchableOpacity 
            onPress={openDigiLockerWeb}
            className="flex-row items-center justify-between bg-white p-4 rounded-xl border border-gray-200 mb-3"
          >
            <View className="flex-row items-center">
              <Download size={20} color="#1D4ED8" />
              <Text className="ml-3 text-gray-700">Download DigiLocker App</Text>
            </View>
            <ExternalLink size={16} color="#6B7280" />
          </TouchableOpacity>
          
          <View className="flex-row space-x-3">
            <TouchableOpacity 
              onPress={openDigiLockerApp}
              className="flex-1 flex-row items-center justify-center bg-blue-100 p-3 rounded-lg"
            >
              <Smartphone size={16} color="#1D4ED8" />
              <Text className="ml-2 text-blue-800 text-sm">Open App</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={openDigiLockerWeb}
              className="flex-1 flex-row items-center justify-center bg-green-100 p-3 rounded-lg"
            >
              <ExternalLink size={16} color="#22C55E" />
              <Text className="ml-2 text-green-800 text-sm">Web Portal</Text>
            </TouchableOpacity>
          </View>
        </View>

      
      </ScrollView>

      {/* Fixed Button */}
     
    </View>
  )
}

export default DigiLockerScreen

