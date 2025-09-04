import {  Text, View } from 'react-native'
import React from 'react'
interface PROPS{
    currentStep:number,
    DOCUMENT_STEPS:{id:string,name:string,description:string}[],
    currentDocument:{id:string,name:string,description:string},
    progressFillWidth:string
}

const ProgressHeader = ({currentStep,DOCUMENT_STEPS,currentDocument,progressFillWidth}:PROPS) => {

  return (
     <View className="bg-primary px-6 pt-12 pb-4">
            <Text className="text-white text-lg font-bold text-center mb-2">
              Step {currentStep + 1} of {DOCUMENT_STEPS.length}
            </Text>
            <Text className="text-white text-center mb-4">
              {currentDocument.name}
            </Text>
            
            {/* Progress Bar */}
            <View className="bg-white/30 rounded-full h-2 mb-2">
        <View
          className="bg-green-500 rounded-full h-2 "
          style={{ width: progressFillWidth }}
        />
          </View>
          
          </View>
  )
}

export default ProgressHeader
