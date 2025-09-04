import { Image,  Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Camera, Upload } from 'lucide-react-native'
import { PROPSIMAGEPREVIEW } from '@/constants/types'
const ImagePriew = ({isSelfieStep, openImagePicker, documents, currentDocument}:PROPSIMAGEPREVIEW) => {
  return (
    <View>
    {documents[currentDocument.id] ? (
          <View className="items-center mb-6">
            <Image 
              source={{ uri: documents[currentDocument.id] as string }} 
              className="w-full h-64 rounded-xl mb-4 border border-gray-200"
              resizeMode="contain"
            />
            <TouchableOpacity 
              onPress={openImagePicker}
              className="bg-gray-100 rounded-xl px-6 py-3 items-center"
            >
              <Text className="text-primary font-semibold">
                {isSelfieStep ? "Retake Selfie" : "Change Document"}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity 
            onPress={openImagePicker}
            className="bg-gray-100 rounded-xl py-12 items-center mb-6 border-2 border-dashed border-gray-300"
          >
            {isSelfieStep ? (
              <>
                <Camera size={48} color="#4A90E2" />
                <Text className="text-primary text-lg font-semibold mt-3">
                  Take Selfie
                </Text>
                <Text className="text-gray-600 text-center mt-2 px-4">
                  Use camera to take a clear photo of your face
                </Text>
              </>
            ) : (
              <>
                <Upload size={48} color="#4A90E2" />
                <Text className="text-primary text-lg font-semibold mt-3">
                  Upload Document
                </Text>
                <Text className="text-gray-600 text-center mt-2 px-4">
                  Select from your gallery or take a photo
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}
        </View>
  )
}

export default ImagePriew

