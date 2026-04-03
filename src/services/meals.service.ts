import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database.types'

type MealLog = Database['public']['Tables']['meal_logs']['Row']
type Meal = Database['public']['Tables']['meals']['Row']

export interface MealWithDetails extends MealLog {
  meals?: Meal | null
}

export interface MealsByType {
  breakfast: MealWithDetails[]
  lunch: MealWithDetails[]
  snack: MealWithDetails[]
  dinner: MealWithDetails[]
}

export const MealsService = {
  /**
   * Get all meal logs for a specific date
   */
  async getMealLogsByDate(userId: string, date: string): Promise<MealsByType> {
    console.log('🍽️ Fetching meals for date:', date)
    
    // Create date range for the entire day
    const startOfDay = `${date}T00:00:00Z`
    const endOfDay = `${date}T23:59:59Z`

    const { data, error } = await supabase
      .from('meal_logs')
      .select(`
        *,
        meals (*)
      `)
      .eq('user_id', userId)
      .gte('eaten_at', startOfDay)
      .lte('eaten_at', endOfDay)
      .order('eaten_at', { ascending: true })

    if (error) {
      console.error('Error fetching meal logs:', error)
      return {
        breakfast: [],
        lunch: [],
        snack: [],
        dinner: [],
      }
    }

    console.log('Meal logs found:', data?.length || 0, 'records')

    // Group meals by meal_type (stored in database)
    const mealsByType: MealsByType = {
      breakfast: [],
      lunch: [],
      snack: [],
      dinner: [],
    }

    data.forEach((log: any) => {
      // Use meal_type directly from the log
      const type = log.meal_type
      if (type === 'breakfast') {
        mealsByType.breakfast.push(log)
      } else if (type === 'lunch') {
        mealsByType.lunch.push(log)
      } else if (type === 'snack') {
        mealsByType.snack.push(log)
      } else if (type === 'dinner') {
        mealsByType.dinner.push(log)
      }
    })

    return mealsByType
  },

  /**
   * Add a meal log
   */
  async addMealLog(
    userId: string,
    mealId: string,
    date: string,
    mealType?: 'breakfast' | 'lunch' | 'snack' | 'dinner'
  ): Promise<boolean> {
    console.log('➕ Adding meal log:', { userId, mealId, date, mealType })

    // Determine eaten_at time based on meal type
    let eatenAt: string
    const now = new Date()
    const today = new Date().toISOString().split('T')[0]

    // Use typical meal times based on meal type
    const timeMap = {
      breakfast: '08:00:00',
      lunch: '12:00:00',
      snack: '15:30:00',
      dinner: '19:00:00',
    }

    // If date is today and no mealType specified, use current time
    if (date === today && !mealType) {
      eatenAt = now.toISOString()
    } else {
      // Use meal type time or default to current time
      const time = mealType ? timeMap[mealType] : `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:00`
      eatenAt = `${date}T${time}Z`
    }

    console.log('Setting eaten_at to:', eatenAt)

    // Default to breakfast if no meal type specified
    const finalMealType = mealType || 'breakfast'

    const { error } = await supabase
      .from('meal_logs')
      .insert({
        user_id: userId,
        meal_id: mealId,
        eaten_at: eatenAt,
        meal_type: finalMealType,
      })

    if (error) {
      console.error('Error adding meal log:', error)
      return false
    }

    console.log('✅ Meal log added successfully with meal_type:', finalMealType)
    return true
  },

  /**
   * Remove a meal log
   */
  async removeMealLog(mealLogId: string): Promise<boolean> {
    console.log('🗑️ Removing meal log:', mealLogId)

    const { error } = await supabase
      .from('meal_logs')
      .delete()
      .eq('id', mealLogId)

    if (error) {
      console.error('Error removing meal log:', error)
      return false
    }

    console.log('✅ Meal log removed successfully')
    return true
  },

  /**
   * Search meals by name
   */
  async searchMeals(query: string, limit: number = 20): Promise<Meal[]> {
    console.log('🔍 Searching meals:', query)

    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .ilike('name', `%${query}%`)
      .limit(limit)

    if (error) {
      console.error('Error searching meals:', error)
      return []
    }

    console.log('Meals found:', data?.length || 0)
    return data || []
  },

  /**
   * Get popular meals
   */
  async getPopularMeals(limit: number = 10): Promise<Meal[]> {
    console.log('⭐ Fetching popular meals')

    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .limit(limit)

    if (error) {
      console.error('Error fetching popular meals:', error)
      return []
    }

    return data || []
  },
}
