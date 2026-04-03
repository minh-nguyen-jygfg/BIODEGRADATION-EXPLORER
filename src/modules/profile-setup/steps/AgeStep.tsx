import React from 'react'
import { View } from 'react-native'
import ProfileSetupLayout from '../components/ProfileSetupLayout'
import NumericStepper from '../components/NumericStepper'

interface AgeStepProps {
    value: number
    onChange: (value: number) => void
    onNext: () => void
    onBack: () => void
}

const AgeStep: React.FC<AgeStepProps> = ({ value, onChange, onNext, onBack }) => {
    return (
        <ProfileSetupLayout
            currentStep={4}
            totalSteps={8}
            title="Bạn bao nhiêu tuổi rồi?"
            onBack={onBack}
            onNext={onNext}
        >
            <View>
                <NumericStepper
                    value={value}
                    onChange={onChange}
                    unit="tuổi"
                    min={10}
                    max={120}
                    step={1}
                    decimalPlaces={0}
                />
            </View>
        </ProfileSetupLayout>
    )
}

export default AgeStep
