import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react-native'
interface PROPS{
    currentStep:number,
    handlePrevious:()=>void,
    handleNext:()=>void,
    documents:{[key:string]: string | null},
    currentDocument:{id:string,name:string,description:string},
    isLastStep:boolean,
    handleSubmit:()=>void,
    allDocumentsUploaded:boolean,
    loading?:boolean
}
const Navagation = ({ 
    currentStep,
     handlePrevious,
      handleNext, 
     documents,
      currentDocument,
      isLastStep,
      handleSubmit
    , allDocumentsUploaded,
     loading
}:PROPS) => {

    return (
   
 <View className="flex-row justify-between mb-8">
          <TouchableOpacity 
            onPress={handlePrevious}
            disabled={currentStep === 0}
            className={`flex-row items-center px-6 py-3 rounded-xl ${
              currentStep === 0 ? "bg-gray-300" : "bg-gray-200"
            }`}
          >
            <ChevronLeft size={20} color={currentStep === 0 ? "#999" : "#333"} />
            <Text className={`ml-2 ${currentStep === 0 ? "text-gray-600" : "text-gray-800"}`}>
              Previous
            </Text>
          </TouchableOpacity>

          {!isLastStep ? (
            <TouchableOpacity 
              onPress={handleNext}
              disabled={!documents[currentDocument.id]}
              className={`flex-row items-center px-6 py-3 rounded-xl ${
                documents[currentDocument.id] ? "bg-primary" : "bg-gray-300"
              }`}
            >
              <Text className="text-white mr-2">Next</Text>
              <ChevronRight size={20} color="white" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              onPress={handleSubmit}
              disabled={!allDocumentsUploaded || loading}
              className={`px-6 py-3 rounded-xl ${
                allDocumentsUploaded && !loading ? "bg-green-600" : "bg-gray-300"
              }`}
            >
              <Text className="text-white">
                {loading ? "Submitting..." : "Submit All Documents"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
   
  )
}

export default Navagation

