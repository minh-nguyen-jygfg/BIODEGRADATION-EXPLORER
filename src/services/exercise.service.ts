import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database.types'

type ExerciseLog = Database['public']['Tables']['exercise_logs']['Row']
type ExerciseInsert = Database['public']['Tables']['exercise_logs']['Insert']

export const ExerciseService = {
  /**
   * Get exercise logs for a specific date
   */
  async getExerciseLogs(userId: string, date: string): Promise<ExerciseLog[]> {
    console.log('🏃 Fetching exercise logs for date:', date)

    const { data, error } = await supabase
      .from('exercise_logs')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching exercise logs:', error)
      return []
    }

    console.log('Exercise logs found:', data?.length || 0)
    return data || []
  },

  /**
   * Add exercise log
   */
  async addExerciseLog(
    userId: string,
    exerciseType: 'cardio' | 'strength' | 'yoga' | 'sport' | 'other',
    durationMinutes: number,
    caloriesBurned?: number,
    notes?: string,
    date?: string
  ): Promise<boolean> {
    const targetDate = date || new Date().toISOString().split('T')[0]

    console.log('➕ Adding exercise log:', {
      userId,
      exerciseType,
      durationMinutes,
      caloriesBurned,
      date: targetDate,
    })

    const insertData: ExerciseInsert = {
      user_id: userId,
      exercise_type: exerciseType,
      duration_minutes: durationMinutes,
      calories_burned: caloriesBurned,
      notes: notes,
      date: targetDate,
    }

    const { error } = await supabase.from('exercise_logs').insert(insertData)

    if (error) {
      console.error('Error adding exercise log:', error)
      return false
    }

    console.log('✅ Exercise log added successfully')
    return true
  },

  /**
   * Delete exercise log
   */
  async deleteExerciseLog(logId: string): Promise<boolean> {
    console.log('🗑️ Deleting exercise log:', logId)

    const { error } = await supabase
      .from('exercise_logs')
      .delete()
      .eq('id', logId)

    if (error) {
      console.error('Error deleting exercise log:', error)
      return false
    }

    console.log('✅ Exercise log deleted successfully')
    return true
  },

  /**
   * Calculate calories burned based on exercise type and duration
   * These are approximate values (calories per minute)
   */
  calculateCaloriesBurned(
    exerciseType: 'cardio' | 'strength' | 'yoga' | 'sport' | 'other',
    durationMinutes: number,
    weightKg: number = 70 // Default weight
  ): number {
    // Calories burned per minute per kg of body weight
    const caloriesPerMinutePerKg: Record<string, number> = {
      cardio: 0.12, // Running, cycling
      strength: 0.08, // Weight training
      yoga: 0.04, // Yoga, stretching
      sport: 0.1, // Sports like football, basketball
      other: 0.07, // General exercise
    }

    const rate = caloriesPerMinutePerKg[exerciseType] || 0.07
    return Math.round(rate * weightKg * durationMinutes)
  },
}
