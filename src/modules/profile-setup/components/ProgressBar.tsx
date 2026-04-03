import React from 'react'
import { View } from 'react-native'

interface ProgressBarProps {
    currentStep: number
    totalSteps: number
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
    return (
        <View className="flex-row gap-1 px-8">
            {Array.from({ length: totalSteps }).map((_, index) => (
                <View
                    key={index}
                    className={`flex-1 h-1 rounded-full ${index < currentStep ? 'bg-primary' : 'bg-gray-200'
                        }`}
                />
            ))}
        </View>
    )
}

export default ProgressBar
