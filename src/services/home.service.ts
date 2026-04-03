import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']
type WaterLog = Database['public']['Tables']['water_logs']['Row']
type MealLog = Database['public']['Tables']['meal_logs']['Row']

export interface HomeData {
  profile: Profile
  todayCalories: number
  targetCalories: number
  macros: {
    protein: { current: number; target: number }
    fat: { current: number; target: number }
    carbs: { current: number; target: number }
  }
  bmi: number
  tdee: number
  waterIntake: {
    current: number
    target: number
  }
  exerciseMinutes: number
  sleepHours: number
}

export const HomeService = {
  /**
   * Get user profile data
   */
  async getUserProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching user profile:', error)
      return null
    }

    return data
  },

  /**
   * Get water intake for a specific date
   */
  async getWaterIntake(userId: string, date: string): Promise<number> {
    console.log('💧 getWaterIntake called for date:', date)
    
    const { data, error } = await supabase
      .from('water_logs')
      .select('amount_ml')
      .eq('user_id', userId)
      .eq('date', date)

    if (error) {
      console.error('Error fetching water intake:', error)
      return 0
    }

    const total = data.reduce((total, log) => total + log.amount_ml, 0)
    console.log('Water logs found:', data?.length || 0, 'records, total:', total, 'ml')
    
    return total
  },

  /**
   * Update water intake for a specific date
   */
  async updateWaterIntake(userId: string, amountMl: number, date?: string): Promise<boolean> {
    const targetDate = date || new Date().toISOString().split('T')[0]
    
    console.log('💧 Updating water intake for date:', targetDate, 'amount:', amountMl, 'ml')

    const { error } = await supabase
      .from('water_logs')
      .insert({
        user_id: userId,
        amount_ml: amountMl,
        date: targetDate, // Use selected date instead of always today
      })

    if (error) {
      console.error('Error updating water intake:', error)
      return false
    }

    console.log('✅ Water intake updated successfully')
    return true
  },

  /**
   * Delete last water log entry for a specific date
   */
  async deleteLastWaterLog(userId: string, date?: string): Promise<boolean> {
    const targetDate = date || new Date().toISOString().split('T')[0]
    
    console.log('🗑️ Deleting last water log for date:', targetDate)

    // Get the last water log for this date
    const { data: logs, error: fetchError } = await supabase
      .from('water_logs')
      .select('id, amount_ml')
      .eq('user_id', userId)
      .eq('date', targetDate)
      .order('id', { ascending: false })
      .limit(1)

    if (fetchError) {
      console.error('Error fetching water log:', fetchError)
      return false
    }

    if (!logs || logs.length === 0) {
      console.log('No water logs found to delete')
      return false
    }

    // Delete the last log
    const { error: deleteError } = await supabase
      .from('water_logs')
      .delete()
      .eq('id', logs[0].id)

    if (deleteError) {
      console.error('Error deleting water log:', deleteError)
      return false
    }

    console.log('✅ Water log deleted successfully:', logs[0].amount_ml, 'ml')
    return true
  },

  /**
   * Get meal logs for a specific date and calculate total calories + macros
   */
  async getMealData(userId: string, date: string): Promise<{
    calories: number
    protein: number
    fat: number
    carbs: number
  }> {
    console.log('📊 getMealData called for date:', date)
    
    // Create date range for the entire day
    const startOfDay = `${date}T00:00:00Z`
    const endOfDay = `${date}T23:59:59Z`
    
    console.log('Query range:', startOfDay, 'to', endOfDay)

    const { data, error } = await supabase
      .from('meal_logs')
      .select(`
        calories,
        meals (
          calories,
          protein_g,
          carbs_g,
          fats_g
        )
      `)
      .eq('user_id', userId)
      .gte('eaten_at', startOfDay)
      .lte('eaten_at', endOfDay)

    if (error) {
      console.error('Error fetching meal data:', error)
      return { calories: 0, protein: 0, fat: 0, carbs: 0 }
    }
    
    console.log('Meal logs found:', data?.length || 0, 'records')

    let totalCalories = 0
    let totalProtein = 0
    let totalFat = 0
    let totalCarbs = 0

    data.forEach((log: any) => {
      if (log.meals) {
        totalCalories += log.meals.calories || 0
        totalProtein += log.meals.protein_g || 0
        totalFat += log.meals.fats_g || 0
        totalCarbs += log.meals.carbs_g || 0
      } else {
        totalCalories += log.calories || 0
      }
    })

    const result = {
      calories: totalCalories,
      protein: totalProtein,
      fat: totalFat,
      carbs: totalCarbs,
    }
    
    console.log('Meal data result:', result)
    
    return result
  },

  /**
   * Calculate BMR (Basal Metabolic Rate)
   * Using Mifflin-St Jeor Equation
   */
  calculateBMR(
    weight: number,
    height: number,
    age: number,
    gender: 'male' | 'female' | 'other'
  ): number {
    if (gender === 'male') {
      return 10 * weight + 6.25 * height - 5 * age + 5
    } else {
      // For female and other
      return 10 * weight + 6.25 * height - 5 * age - 161
    }
  },

  /**
   * Calculate TDEE (Total Daily Energy Expenditure)
   */
  calculateTDEE(
    bmr: number,
    activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
  ): number {
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    }

    return Math.round(bmr * activityMultipliers[activityLevel])
  },

  /**
   * Calculate target calories based on goal
   */
  calculateTargetCalories(
    tdee: number,
    goal: 'lose_weight' | 'gain_muscle' | 'maintain'
  ): number {
    switch (goal) {
      case 'lose_weight':
        return Math.round(tdee - 500) // 500 calorie deficit
      case 'gain_muscle':
        return Math.round(tdee + 300) // 300 calorie surplus
      case 'maintain':
      default:
        return tdee
    }
  },

  /**
   * Calculate target macros
   */
  calculateTargetMacros(targetCalories: number, goal: 'lose_weight' | 'gain_muscle' | 'maintain') {
    let proteinPercent = 0.3
    let fatPercent = 0.25
    let carbsPercent = 0.45

    if (goal === 'lose_weight') {
      proteinPercent = 0.35
      fatPercent = 0.25
      carbsPercent = 0.4
    } else if (goal === 'gain_muscle') {
      proteinPercent = 0.3
      fatPercent = 0.2
      carbsPercent = 0.5
    }

    return {
      protein: Math.round((targetCalories * proteinPercent) / 4), // 4 cal per gram
      fat: Math.round((targetCalories * fatPercent) / 9), // 9 cal per gram
      carbs: Math.round((targetCalories * carbsPercent) / 4), // 4 cal per gram
    }
  },

  /**
   * Calculate BMI
   */
  calculateBMI(weight: number, height: number): number {
    // height in cm, weight in kg
    const heightInMeters = height / 100
    return Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10
  },

  /**
   * Calculate age from date of birth
   */
  calculateAge(dateOfBirth: string): number {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
  },

  /**
   * Get total exercise minutes for a specific date
   */
  async getExerciseMinutes(userId: string, date: string): Promise<number> {
    const data = await this.getExerciseData(userId, date)
    return data.minutes
  },

  /**
   * Get exercise data (minutes + calories burned) for a specific date (single query)
   */
  async getExerciseData(
    userId: string,
    date: string
  ): Promise<{ minutes: number; caloriesBurned: number }> {
    console.log('🏃 getExerciseData called for date:', date)

    const { data, error } = await supabase
      .from('exercise_logs')
      .select('duration_minutes, calories_burned')
      .eq('user_id', userId)
      .eq('date', date)

    if (error) {
      console.error('Error fetching exercise data:', error)
      return { minutes: 0, caloriesBurned: 0 }
    }

    const minutes = data.reduce((sum, log) => sum + (log.duration_minutes || 0), 0)
    const caloriesBurned = data.reduce((sum, log) => sum + (log.calories_burned || 0), 0)
    console.log(
      'Exercise logs found:',
      data?.length || 0,
      'records, total:',
      minutes,
      'minutes,',
      caloriesBurned,
      'kcal'
    )

    return { minutes, caloriesBurned }
  },

  /**
   * Get total sleep hours for a specific date
   */
  async getSleepHours(userId: string, date: string): Promise<number> {
    console.log('😴 getSleepHours called for date:', date)
    
    const { data, error } = await supabase
      .from('sleep_logs')
      .select('duration_hours')
      .eq('user_id', userId)
      .eq('date', date)

    if (error) {
      console.error('Error fetching sleep data:', error)
      return 0
    }

    const total = data.reduce((sum, log) => sum + log.duration_hours, 0)
    console.log('Sleep logs found:', data?.length || 0, 'records, total:', total, 'hours')
    
    return total
  },

  /**
   * Get all home data for dashboard for a specific date
   */
  async getHomeData(userId: string, date?: string): Promise<HomeData | null> {
    const targetDate = date || new Date().toISOString().split('T')[0]
    console.log('HomeService.getHomeData called for userId:', userId, 'date:', targetDate)
    
    try {
      // Fetch profile
      console.log('Fetching user profile...')
      const profile = await this.getUserProfile(userId)
      console.log('Profile fetched:', profile)
      
      if (!profile) {
        console.error('❌ Profile not found for user:', userId)
        return null
      }

      // Fetch meal data for the selected date
      console.log('Fetching meal data for date:', targetDate)
      const mealData = await this.getMealData(userId, targetDate)
      console.log('Meal data:', mealData)

      // Fetch water intake for the selected date
      console.log('Fetching water intake for date:', targetDate)
      const waterIntake = await this.getWaterIntake(userId, targetDate)
      console.log('Water intake:', waterIntake)

      // Fetch exercise data (minutes + calories burned) for the selected date
      console.log('Fetching exercise data for date:', targetDate)
      const exerciseData = await this.getExerciseData(userId, targetDate)
      const exerciseMinutes = exerciseData.minutes
      console.log('Exercise minutes:', exerciseMinutes, 'calories burned:', exerciseData.caloriesBurned)

      // Fetch sleep hours for the selected date
      console.log('Fetching sleep data for date:', targetDate)
      const sleepHours = await this.getSleepHours(userId, targetDate)
      console.log('Sleep hours:', sleepHours)

      // Calculate age
      const age = profile.date_of_birth
        ? this.calculateAge(profile.date_of_birth)
        : 25 // default

      // Calculate BMR
      const bmr = this.calculateBMR(
        profile.current_weight_kg || 70,
        profile.height_cm || 170,
        age,
        profile.gender || 'male'
      )

      // Calculate base TDEE (from BMR + activity level), then add calories burned from exercise today
      const baseTdee = this.calculateTDEE(
        bmr,
        profile.activity_level || 'moderate'
      )
      const tdee = baseTdee + exerciseData.caloriesBurned

      // Calculate target calories
      const targetCalories = this.calculateTargetCalories(
        tdee,
        profile.goal || 'maintain'
      )

      // Calculate target macros
      const targetMacros = this.calculateTargetMacros(
        targetCalories,
        profile.goal || 'maintain'
      )

      // Calculate BMI
      const bmi = this.calculateBMI(
        profile.current_weight_kg || 70,
        profile.height_cm || 170
      )

      // Calculate target water intake (35ml per kg body weight)
      const targetWater = Math.round((profile.current_weight_kg || 70) * 35)

      const homeData = {
        profile,
        todayCalories: mealData.calories,
        targetCalories,
        macros: {
          protein: {
            current: mealData.protein,
            target: targetMacros.protein,
          },
          fat: {
            current: mealData.fat,
            target: targetMacros.fat,
          },
          carbs: {
            current: mealData.carbs,
            target: targetMacros.carbs,
          },
        },
        bmi,
        tdee,
        waterIntake: {
          current: waterIntake,
          target: targetWater,
        },
        exerciseMinutes: exerciseMinutes,
        sleepHours: sleepHours,
      }
      
      console.log('✅ Home data calculated successfully:', homeData)
      return homeData
    } catch (error) {
      console.error('❌ Error fetching home data:', error)
      throw error // Throw error để component có thể catch
    }
  },
}
