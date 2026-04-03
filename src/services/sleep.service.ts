import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database.types'

type SleepLog = Database['public']['Tables']['sleep_logs']['Row']
type SleepInsert = Database['public']['Tables']['sleep_logs']['Insert']

export const SleepService = {
  /**
   * Get sleep logs for a specific date
   */
  async getSleepLogs(userId: string, date: string): Promise<SleepLog[]> {
    console.log('😴 Fetching sleep logs for date:', date)

    const { data, error } = await supabase
      .from('sleep_logs')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)
      .order('sleep_start', { ascending: false })

    if (error) {
      console.error('Error fetching sleep logs:', error)
      return []
    }

    console.log('Sleep logs found:', data?.length || 0)
    return data || []
  },

  /**
   * Add sleep log
   */
  async addSleepLog(
    userId: string,
    sleepStart: string, // ISO timestamp
    sleepEnd: string, // ISO timestamp
    quality?: 'poor' | 'fair' | 'good' | 'excellent',
    notes?: string,
    date?: string
  ): Promise<boolean> {
    // Calculate duration in hours
    const start = new Date(sleepStart)
    const end = new Date(sleepEnd)
    const durationMs = end.getTime() - start.getTime()
    const durationHours = Math.round((durationMs / (1000 * 60 * 60)) * 10) / 10

    // Use the date of when you woke up (sleep_end)
    const targetDate = date || end.toISOString().split('T')[0]

    console.log('➕ Adding sleep log:', {
      userId,
      sleepStart,
      sleepEnd,
      durationHours,
      quality,
      date: targetDate,
    })

    if (durationHours <= 0) {
      console.error('Invalid sleep duration: sleep_end must be after sleep_start')
      return false
    }

    if (durationHours > 24) {
      console.error('Invalid sleep duration: cannot exceed 24 hours')
      return false
    }

    const insertData: SleepInsert = {
      user_id: userId,
      sleep_start: sleepStart,
      sleep_end: sleepEnd,
      duration_hours: durationHours,
      quality: quality,
      notes: notes,
      date: targetDate,
    }

    const { error } = await supabase.from('sleep_logs').insert(insertData)

    if (error) {
      console.error('Error adding sleep log:', error)
      return false
    }

    console.log('✅ Sleep log added successfully')
    return true
  },

  /**
   * Delete sleep log
   */
  async deleteSleepLog(logId: string): Promise<boolean> {
    console.log('🗑️ Deleting sleep log:', logId)

    const { error } = await supabase.from('sleep_logs').delete().eq('id', logId)

    if (error) {
      console.error('Error deleting sleep log:', error)
      return false
    }

    console.log('✅ Sleep log deleted successfully')
    return true
  },

  /**
   * Calculate recommended sleep hours based on age
   */
  getRecommendedSleepHours(age: number): { min: number; max: number } {
    if (age < 18) return { min: 8, max: 10 } // Teenagers
    if (age < 65) return { min: 7, max: 9 } // Adults
    return { min: 7, max: 8 } // Older adults
  },

  /**
   * Get sleep quality label
   */
  getSleepQualityLabel(
    hours: number,
    recommendedMin: number,
    recommendedMax: number
  ): 'poor' | 'fair' | 'good' | 'excellent' {
    if (hours < recommendedMin - 2) return 'poor'
    if (hours < recommendedMin) return 'fair'
    if (hours > recommendedMax + 2) return 'fair'
    if (hours > recommendedMax) return 'good'
    return 'excellent'
  },
}
