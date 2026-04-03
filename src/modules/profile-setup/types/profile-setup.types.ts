export interface ProfileSetupData {
    full_name: string
    gender: 'male' | 'female' | null
    goal: string | null
    age: number
    height_cm: number
    current_weight_kg: number
    activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active' | null
}

export interface NutritionPlan {
    dailyCalories: number
    protein_g: number
    fat_g: number
    carbs_g: number
}

export type GoalType = 'lose_weight' | 'gain_muscle' | 'maintain'
export type ActivityLevelType = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
export type GenderType = 'male' | 'female'

// Vietnamese goal options
export const GOAL_OPTIONS = [
    { label: 'Giảm cân', value: 'lose_weight' as GoalType },
    { label: 'Duy trì cân nặng', value: 'maintain' as GoalType },
    { label: 'Tăng cân', value: 'gain_muscle' as GoalType },
    { label: 'Cải thiện thành phần cơ thể', value: 'maintain' as GoalType },
    { label: 'Cải thiện sức khỏe tổng thể', value: 'maintain' as GoalType },
    { label: 'Ăn ngon hơn', value: 'maintain' as GoalType },
    { label: 'Cảm thấy tốt hơn', value: 'maintain' as GoalType },
]

// Vietnamese activity level options
export const ACTIVITY_LEVEL_OPTIONS = [
    {
        title: 'Ít vận động',
        description: 'Ít đi lại, không tập thể dục.',
        value: 'sedentary' as ActivityLevelType,
    },
    {
        title: 'Vận động nhẹ',
        description: 'Đi bộ nhẹ nhàng hoặc tập thể dục.',
        value: 'light' as ActivityLevelType,
    },
    {
        title: 'Vận động vừa',
        description: 'Tập thể thao hoặc chạy bộ.',
        value: 'moderate' as ActivityLevelType,
    },
    {
        title: 'Vận động mạnh',
        description: 'Tập luyện cường độ cao.',
        value: 'active' as ActivityLevelType,
    },
    {
        title: 'Vận động cực độ',
        description: 'Vận động viên/làm công việc tay chân.',
        value: 'very_active' as ActivityLevelType,
    },
]
