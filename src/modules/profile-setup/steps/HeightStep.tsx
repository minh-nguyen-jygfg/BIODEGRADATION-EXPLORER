import React from 'react'
import { View } from 'react-native'
import ProfileSetupLayout from '../components/ProfileSetupLayout'
import NumericStepper from '../components/NumericStepper'

interface HeightStepProps {
    value: number
    onChange: (value: number) => void
    onNext: () => void
    onBack: () => void
}

const HeightStep: React.FC<HeightStepProps> = ({ value, onChange, onNext, onBack }) => {
    return (
        <ProfileSetupLayout
            currentStep={5}
            totalSteps={8}
            title="Chiều cao của bạn?"
            onBack={onBack}
            onNext={onNext}
        >
            <View>
                <NumericStepper
                    value={value}
                    onChange={onChange}
                    unit="cm"
                    min={100}
                    max={250}
                    step={0.5}
                    decimalPlaces={1}
                />
            </View>
        </ProfileSetupLayout>
    )
}

export default HeightStep
