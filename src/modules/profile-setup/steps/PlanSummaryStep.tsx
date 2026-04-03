import React from 'react'
import { Text, View } from 'react-native'
import ProfileSetupLayout from '../components/ProfileSetupLayout'
import NutritionChart from '../components/NutritionChart'
import { NutritionPlan } from '../types/profile-setup.types'
import { formatNumber } from '../services/calorie-calculator.service'

interface PlanSummaryStepProps {
    nutritionPlan: NutritionPlan
    onNext: () => void
    onBack: () => void
    loading?: boolean
}

const PlanSummaryStep: React.FC<PlanSummaryStepProps> = ({ nutritionPlan, onNext, onBack, loading = false }) => {
    return (
        <ProfileSetupLayout
            currentStep={8}
            totalSteps={8}
            title="Tóm tắt kế hoạch"
            onBack={onBack}
            onNext={onNext}
            nextButtonText="Bắt đầu"
            nextButtonDisabled={loading}
        >
            <View>
                {/* Daily Calorie Goal */}
                <View className="mb-6">
                    <Text className="text-sm text-gray-600 mb-2">Mục tiêu</Text>
                    <Text className="text-4xl font-bold text-primary">
                        {formatNumber(nutritionPlan.dailyCalories)}
                    </Text>
                </View>

                {/* Nutrition Breakdown */}
                <View>
                    <Text className="text-base font-semibold text-gray-900 mb-4">Thành phần dinh dưỡng</Text>
                    <NutritionChart
                        protein_g={nutritionPlan.protein_g}
                        fat_g={nutritionPlan.fat_g}
                        carbs_g={nutritionPlan.carbs_g}
                    />
                </View>
            </View>
        </ProfileSetupLayout>
    )
}

export default PlanSummaryStep
