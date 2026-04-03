import React from 'react'
import { Text, View } from 'react-native'
import ProfileSetupLayout from '../components/ProfileSetupLayout'
import GenderCard from '../components/GenderCard'
import { GenderType } from '../types/profile-setup.types'

interface GenderStepProps {
    value: GenderType | null
    onChange: (value: GenderType) => void
    onNext: () => void
    onBack: () => void
}

const GenderStep: React.FC<GenderStepProps> = ({ value, onChange, onNext, onBack }) => {
    return (
        <ProfileSetupLayout
            currentStep={2}
            totalSteps={8}
            title="Giới tính của bạn là gì?"
            onBack={onBack}
            onNext={onNext}
            nextButtonDisabled={!value}
        >
            <View>
                {/* Gender Selection Cards */}
                <View className="flex-row gap-4 mb-6">
                    <GenderCard
                        icon="♂"
                        label="Nam"
                        iconColor="#14B8A6"
                        selected={value === 'male'}
                        onPress={() => onChange('male')}
                    />
                    <GenderCard
                        icon="♀"
                        label="Nữ"
                        iconColor="#EF4444"
                        selected={value === 'female'}
                        onPress={() => onChange('female')}
                    />
                </View>

                {/* Warning Message */}
                <View className="flex-row items-center bg-amber-50 p-3 rounded-lg">
                    <Text className="text-amber-600 mr-2">⚠️</Text>
                    <Text className="text-sm text-amber-700">Tính toán lượng calo</Text>
                </View>
            </View>
        </ProfileSetupLayout>
    )
}

export default GenderStep
