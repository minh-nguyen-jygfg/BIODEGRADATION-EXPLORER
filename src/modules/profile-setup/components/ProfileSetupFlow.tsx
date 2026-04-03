import React, { useState } from 'react'
import { Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { supabase } from '@/lib/supabase'
import { ERouteTable } from '@/constants/route-table'
import { ActivityLevelType, GenderType, GoalType, NutritionPlan, ProfileSetupData } from '../types/profile-setup.types'
import { calculateNutritionPlan } from '../services/calorie-calculator.service'
import { updateUserProfile } from '../services/profile-setup.service'

// Import step components
import NameStep from '../steps/NameStep'
import GenderStep from '../steps/GenderStep'
import GoalStep from '../steps/GoalStep'
import AgeStep from '../steps/AgeStep'
import HeightStep from '../steps/HeightStep'
import WeightStep from '../steps/WeightStep'
import ActivityLevelStep from '../steps/ActivityLevelStep'
import PlanSummaryStep from '../steps/PlanSummaryStep'

const ProfileSetupFlow: React.FC = () => {
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(1)
    const [loading, setLoading] = useState(false)

    // Form data state
    const [formData, setFormData] = useState<ProfileSetupData>({
        full_name: '',
        gender: null,
        goal: null,
        age: 23,
        height_cm: 172.5,
        current_weight_kg: 70.2,
        activity_level: null,
    })

    // Nutrition plan state (calculated on step 8)
    const [nutritionPlan, setNutritionPlan] = useState<NutritionPlan>({
        dailyCalories: 0,
        protein_g: 0,
        fat_g: 0,
        carbs_g: 0,
    })

    // Navigation handlers
    const handleNext = () => {
        if (currentStep < 8) {
            // Calculate nutrition plan when moving to step 8
            if (currentStep === 7 && formData.gender && formData.goal && formData.activity_level) {
                const plan = calculateNutritionPlan(
                    formData.current_weight_kg,
                    formData.height_cm,
                    formData.age,
                    formData.gender,
                    formData.activity_level,
                    formData.goal as GoalType
                )
                setNutritionPlan(plan)
            }
            setCurrentStep(currentStep + 1)
        } else {
            // Final step - save and navigate to home
            handleComplete()
        }
    }

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        } else {
            // Go back to sign-up or previous screen
            router.back()
        }
    }

    // Complete profile setup
    const handleComplete = async () => {
        setLoading(true)
        try {
            // Get current user
            const {
              data: { user },
            } = await supabase.auth.getUser()
      
            if (!user) {
              Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng')
              setLoading(false)
              return
            }

            console.log('=== SAVING PROFILE SETUP DATA ===')
            console.log('User ID:', user.id)
            console.log('Name:', formData.full_name)
            console.log('Gender:', formData.gender)
            console.log('Goal:', formData.goal)
            console.log('Age:', formData.age)
            console.log('Height:', formData.height_cm, 'cm')
            console.log('Weight:', formData.current_weight_kg, 'kg')
            console.log('Activity Level:', formData.activity_level)
            console.log('Nutrition Plan:', nutritionPlan)
            console.log('==================================')
      
            // Update profile in Supabase
            const result = await updateUserProfile(user.id, formData)
      
            if (result.success) {
              // Navigate to home screen
              Alert.alert('Thành công!', 'Thông tin của bạn đã được lưu.', [
                {
                    text: 'OK',
                    onPress: () => router.replace(ERouteTable.HOME),
                },
              ])
            } else {
              Alert.alert('Lỗi', result.error || 'Không thể lưu thông tin. Vui lòng thử lại.')
            }
        } catch (error) {
            console.error('Error completing profile setup:', error)
            Alert.alert('Lỗi', 'Đã xảy ra lỗi. Vui lòng thử lại.')
        } finally {
            setLoading(false)
        }
    }

    // Render current step
    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <NameStep
                        value={formData.full_name}
                        onChange={(value) => setFormData({ ...formData, full_name: value })}
                        onNext={handleNext}
                        onBack={handleBack}
                    />
                )
            case 2:
                return (
                    <GenderStep
                        value={formData.gender}
                        onChange={(value) => setFormData({ ...formData, gender: value })}
                        onNext={handleNext}
                        onBack={handleBack}
                    />
                )
            case 3:
                return (
                    <GoalStep
                        value={formData.goal as GoalType | null}
                        onChange={(value) => setFormData({ ...formData, goal: value })}
                        onNext={handleNext}
                        onBack={handleBack}
                    />
                )
            case 4:
                return (
                    <AgeStep
                        value={formData.age}
                        onChange={(value) => setFormData({ ...formData, age: value })}
                        onNext={handleNext}
                        onBack={handleBack}
                    />
                )
            case 5:
                return (
                    <HeightStep
                        value={formData.height_cm}
                        onChange={(value) => setFormData({ ...formData, height_cm: value })}
                        onNext={handleNext}
                        onBack={handleBack}
                    />
                )
            case 6:
                return (
                    <WeightStep
                        value={formData.current_weight_kg}
                        onChange={(value) => setFormData({ ...formData, current_weight_kg: value })}
                        onNext={handleNext}
                        onBack={handleBack}
                    />
                )
            case 7:
                return (
                    <ActivityLevelStep
                        value={formData.activity_level}
                        onChange={(value) => setFormData({ ...formData, activity_level: value })}
                        onNext={handleNext}
                        onBack={handleBack}
                    />
                )
            case 8:
                return (
                    <PlanSummaryStep
                        nutritionPlan={nutritionPlan}
                        onNext={handleNext}
                        onBack={handleBack}
                        loading={loading}
                    />
                )
            default:
                return null
        }
    }

    return <>{renderStep()}</>
}

export default ProfileSetupFlow
