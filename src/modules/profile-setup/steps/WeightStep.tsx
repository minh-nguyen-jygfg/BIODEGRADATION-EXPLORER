import React from 'react'
import { View } from 'react-native'
import ProfileSetupLayout from '../components/ProfileSetupLayout'
import NumericStepper from '../components/NumericStepper'

interface WeightStepProps {
    value: number
    onChange: (value: number) => void
    onNext: () => void
    onBack: () => void
}

const WeightStep: React.FC<WeightStepProps> = ({ value, onChange, onNext, onBack }) => {
    return (
        <ProfileSetupLayout
            currentStep={6}
            totalSteps={8}
            title="Cân nặng của bạn?"
            onBack={onBack}
            onNext={onNext}
        >
            <View>
                <NumericStepper
                    value={value}
                    onChange={onChange}
                    unit="kg"
                    min={30}
                    max={300}
                    step={0.1}
                    decimalPlaces={1}
                />
            </View>
        </ProfileSetupLayout>
    )
}

export default WeightStep
