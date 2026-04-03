import React, { ReactNode } from 'react'
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import ProgressBar from './ProgressBar'
import AppButton from '@/components/common/AppButton'

interface ProfileSetupLayoutProps {
    currentStep: number
    totalSteps: number
    title: string
    children: ReactNode
    onBack: () => void
    onNext: () => void
    nextButtonText?: string
    nextButtonDisabled?: boolean
}

const ProfileSetupLayout: React.FC<ProfileSetupLayoutProps> = ({
    currentStep,
    totalSteps,
    title,
    children,
    onBack,
    onNext,
    nextButtonText = 'Tiếp theo',
    nextButtonDisabled = false,
}) => {
    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header with Back Button */}
            <View className="pt-4 pb-6">
                <TouchableOpacity onPress={onBack} className="px-8 mb-6">
                    <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>

                {/* Progress Bar */}
                <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
            </View>

            {/* Content */}
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="px-8 py-6">
                    {/* Title */}
                    <Text className="text-2xl font-bold text-gray-900 mb-8">{title}</Text>

                    {/* Step Content */}
                    {children}
                </View>
            </ScrollView>

            {/* Bottom Button */}
            <View className="px-8 pb-8 pt-4">
                <AppButton title={nextButtonText} onPress={onNext} disabled={nextButtonDisabled} />
            </View>
        </SafeAreaView>
    )
}

export default ProfileSetupLayout
