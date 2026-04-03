import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database.types'
import { ActivityLevelType, GenderType, GoalType, ProfileSetupData } from '../types/profile-setup.types'

type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

/**
 * Calculate date of birth from age
 */
const calculateDateOfBirth = (age: number): string => {
    const today = new Date()
    const birthYear = today.getFullYear() - age
    // Use January 1st as default birth date
    return `${birthYear}-01-01`
}

/**
 * Update user profile with profile setup data
 */
export const updateUserProfile = async (userId: string, data: ProfileSetupData): Promise<{ success: boolean; error?: string }> => {
    try {
        const updateData: ProfileUpdate = {
            full_name: data.full_name,
            gender: data.gender,
            goal: data.goal as 'lose_weight' | 'gain_muscle' | 'maintain' | null,
            date_of_birth: calculateDateOfBirth(data.age),
            height_cm: data.height_cm,
            current_weight_kg: data.current_weight_kg,
            activity_level: data.activity_level,
            updated_at: new Date().toISOString(),
        }

        // @ts-ignore - Supabase type inference issue, but this works at runtime
        const { error } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('id', userId)


        if (error) {
            console.error('Error updating profile:', error)
            return { success: false, error: error.message }
        }

        return { success: true }
    } catch (error) {
        console.error('Unexpected error updating profile:', error)
        return { success: false, error: 'An unexpected error occurred' }
    }
}
