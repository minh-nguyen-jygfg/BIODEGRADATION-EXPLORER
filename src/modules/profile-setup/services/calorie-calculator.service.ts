import { ActivityLevelType, GenderType, GoalType, NutritionPlan } from '../types/profile-setup.types'

/**
 * Calculate Basal Metabolic Rate (BMR) using Mifflin-St Jeor equation
 */
export const calculateBMR = (
    weight_kg: number,
    height_cm: number,
    age: number,
    gender: GenderType
): number => {
    if (gender === 'male') {
        // Male: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age + 5
        return 10 * weight_kg + 6.25 * height_cm - 5 * age + 5
    } else {
        // Female: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age - 161
        return 10 * weight_kg + 6.25 * height_cm - 5 * age - 161
    }
}

/**
 * Get activity level multiplier
 */
export const getActivityMultiplier = (activityLevel: ActivityLevelType): number => {
    const multipliers: Record<ActivityLevelType, number> = {
        sedentary: 1.2, // Ít vận động
        light: 1.375, // Vận động nhẹ
        moderate: 1.55, // Vận động vừa
        active: 1.725, // Vận động mạnh
        very_active: 1.9, // Vận động cực độ
    }
    return multipliers[activityLevel]
}

/**
 * Get calorie adjustment based on goal
 */
export const getGoalAdjustment = (goal: GoalType): number => {
    const adjustments: Record<GoalType, number> = {
        lose_weight: -500, // Giảm cân
        maintain: 0, // Duy trì
        gain_muscle: 500, // Tăng cân
    }
    return adjustments[goal]
}

/**
 * Calculate daily calorie needs and macronutrient breakdown
 */
export const calculateNutritionPlan = (
    weight_kg: number,
    height_cm: number,
    age: number,
    gender: GenderType,
    activityLevel: ActivityLevelType,
    goal: GoalType
): NutritionPlan => {
    // Calculate BMR
    const bmr = calculateBMR(weight_kg, height_cm, age, gender)

    // Apply activity level multiplier
    const tdee = bmr * getActivityMultiplier(activityLevel)

    // Adjust for goal
    const dailyCalories = Math.round(tdee + getGoalAdjustment(goal))

    // Calculate macronutrients
    // Protein: 30% of calories (÷ 4 cal/g)
    const protein_g = Math.round((dailyCalories * 0.3) / 4 * 10) / 10

    // Fat: 25% of calories (÷ 9 cal/g)
    const fat_g = Math.round((dailyCalories * 0.25) / 9 * 10) / 10

    // Carbs: 45% of calories (÷ 4 cal/g)
    const carbs_g = Math.round((dailyCalories * 0.45) / 4 * 10) / 10

    return {
        dailyCalories,
        protein_g,
        fat_g,
        carbs_g,
    }
}

/**
 * Format number with thousand separators (e.g., 2512 → "2,512")
 */
export const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
