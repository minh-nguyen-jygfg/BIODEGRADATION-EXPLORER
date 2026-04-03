import React from 'react'
import { View } from 'react-native'
import ProfileSetupLayout from '../components/ProfileSetupLayout'
import ActivityLevelOption from '../components/ActivityLevelOption'
import { ACTIVITY_LEVEL_OPTIONS, ActivityLevelType } from '../types/profile-setup.types'

interface ActivityLevelStepProps {
    value: ActivityLevelType | null
    onChange: (value: ActivityLevelType) => void
    onNext: () => void
    onBack: () => void
}

const ActivityLevelStep: React.FC<ActivityLevelStepProps> = ({ value, onChange, onNext, onBack }) => {
    return (
        <ProfileSetupLayout
            currentStep={7}
            totalSteps={8}
            title="Cường độ vận động hàng ngày của bạn?"
            onBack={onBack}
            onNext={onNext}
            nextButtonDisabled={!value}
        >
            <View>
                {ACTIVITY_LEVEL_OPTIONS.map((option, index) => (
                    <ActivityLevelOption
                        key={index}
                        title={option.title}
                        description={option.description}
                        selected={value === option.value}
                        onPress={() => onChange(option.value)}
                    />
                ))}
            </View>
        </ProfileSetupLayout>
    )
}

export default ActivityLevelStep
