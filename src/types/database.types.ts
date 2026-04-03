export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    email: string | null
                    full_name: string | null
                    avatar_url: string | null
                    gender: 'male' | 'female' | 'other' | null
                    date_of_birth: string | null
                    height_cm: number | null
                    current_weight_kg: number | null
                    activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active' | null
                    goal: 'lose_weight' | 'gain_muscle' | 'maintain' | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    gender?: 'male' | 'female' | 'other' | null
                    date_of_birth?: string | null
                    height_cm?: number | null
                    current_weight_kg?: number | null
                    activity_level?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active' | null
                    goal?: 'lose_weight' | 'gain_muscle' | 'maintain' | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    gender?: 'male' | 'female' | 'other' | null
                    date_of_birth?: string | null
                    height_cm?: number | null
                    current_weight_kg?: number | null
                    activity_level?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active' | null
                    goal?: 'lose_weight' | 'gain_muscle' | 'maintain' | null
                    created_at?: string
                    updated_at?: string
                }
            }
            weight_logs: {
                Row: {
                    id: string
                    user_id: string
                    weight_kg: number
                    logged_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    weight_kg: number
                    logged_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    weight_kg?: number
                    logged_at?: string
                }
            }
            water_logs: {
                Row: {
                    id: string
                    user_id: string
                    amount_ml: number
                    date: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    amount_ml: number
                    date?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    amount_ml?: number
                    date?: string
                }
            }
            meal_plans: {
                Row: {
                    id: string
                    name: string
                    goal_type: string
                    description: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    goal_type: string
                    description?: string | null
                    created_at?: string
                }
            }
            meals: {
                Row: {
                    id: string
                    plan_id: string | null
                    name: string
                    description: string | null
                    calories: number | null
                    protein_g: number | null
                    carbs_g: number | null
                    fats_g: number | null
                    meal_type: 'breakfast' | 'morning_snack' | 'lunch' | 'afternoon_snack' | 'dinner' | null
                    image_url: string | null
                }
                Insert: {
                    id?: string
                    plan_id?: string | null
                    name: string
                    description?: string | null
                    calories?: number | null
                    protein_g?: number | null
                    carbs_g?: number | null
                    fats_g?: number | null
                    meal_type?: 'breakfast' | 'morning_snack' | 'lunch' | 'afternoon_snack' | 'dinner' | null
                    image_url?: string | null
                }
            }
            meal_logs: {
                Row: {
                    id: string
                    user_id: string
                    meal_id: string | null
                    custom_meal_name: string | null
                    calories: number | null
                    eaten_at: string
                    meal_type: 'breakfast' | 'lunch' | 'snack' | 'dinner'
                }
                Insert: {
                    id?: string
                    user_id: string
                    meal_id?: string | null
                    custom_meal_name?: string | null
                    calories?: number | null
                    eaten_at?: string
                    meal_type: 'breakfast' | 'lunch' | 'snack' | 'dinner'
                }
            }
            articles: {
                Row: {
                    id: string
                    title: string
                    content: string | null
                    category: 'nutrition' | 'cooking_tips' | 'home_workout' | null
                    image_url: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    content?: string | null
                    category?: 'nutrition' | 'cooking_tips' | 'home_workout' | null
                    image_url?: string | null
                    created_at?: string
                }
            }
            saved_articles: {
                Row: {
                    id: string
                    user_id: string
                    article_id: string
                    saved_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    article_id: string
                    saved_at?: string
                }
            }
            exercise_logs: {
                Row: {
                    id: string
                    user_id: string
                    exercise_type: 'cardio' | 'strength' | 'yoga' | 'sport' | 'other'
                    duration_minutes: number
                    calories_burned: number | null
                    notes: string | null
                    date: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    exercise_type: 'cardio' | 'strength' | 'yoga' | 'sport' | 'other'
                    duration_minutes: number
                    calories_burned?: number | null
                    notes?: string | null
                    date?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    exercise_type?: 'cardio' | 'strength' | 'yoga' | 'sport' | 'other'
                    duration_minutes?: number
                    calories_burned?: number | null
                    notes?: string | null
                    date?: string
                    created_at?: string
                }
            }
            sleep_logs: {
                Row: {
                    id: string
                    user_id: string
                    sleep_start: string
                    sleep_end: string
                    duration_hours: number
                    quality: 'poor' | 'fair' | 'good' | 'excellent' | null
                    notes: string | null
                    date: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    sleep_start: string
                    sleep_end: string
                    duration_hours: number
                    quality?: 'poor' | 'fair' | 'good' | 'excellent' | null
                    notes?: string | null
                    date?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    sleep_start?: string
                    sleep_end?: string
                    duration_hours?: number
                    quality?: 'poor' | 'fair' | 'good' | 'excellent' | null
                    notes?: string | null
                    date?: string
                    created_at?: string
                }
            }
            notifications: {
                Row: {
                    id: string
                    user_id: string
                    type: 'meal_reminder' | 'water_reminder' | 'exercise_reminder' | 'sleep_reminder' | 'goal_completed' | 'streak' | 'weight_update' | 'new_article' | 'tip' | 'welcome'
                    title: string
                    message: string
                    icon: string
                    icon_bg: string
                    is_read: boolean
                    related_id: string | null
                    metadata: any | null
                    created_at: string
                    read_at: string | null
                }
                Insert: {
                    id?: string
                    user_id: string
                    type: 'meal_reminder' | 'water_reminder' | 'exercise_reminder' | 'sleep_reminder' | 'goal_completed' | 'streak' | 'weight_update' | 'new_article' | 'tip' | 'welcome'
                    title: string
                    message: string
                    icon: string
                    icon_bg: string
                    is_read?: boolean
                    related_id?: string | null
                    metadata?: any | null
                    created_at?: string
                    read_at?: string | null
                }
                Update: {
                    id?: string
                    user_id?: string
                    type?: 'meal_reminder' | 'water_reminder' | 'exercise_reminder' | 'sleep_reminder' | 'goal_completed' | 'streak' | 'weight_update' | 'new_article' | 'tip' | 'welcome'
                    title?: string
                    message?: string
                    icon?: string
                    icon_bg?: string
                    is_read?: boolean
                    related_id?: string | null
                    metadata?: any | null
                    created_at?: string
                    read_at?: string | null
                }
            }
            notification_settings: {
                Row: {
                    id: string
                    user_id: string
                    breakfast_enabled: boolean
                    breakfast_time: string
                    lunch_enabled: boolean
                    lunch_time: string
                    dinner_enabled: boolean
                    dinner_time: string
                    water_enabled: boolean
                    water_interval_hours: number
                    exercise_enabled: boolean
                    exercise_time: string
                    sleep_enabled: boolean
                    sleep_time: string
                    goal_notifications_enabled: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    breakfast_enabled?: boolean
                    breakfast_time?: string
                    lunch_enabled?: boolean
                    lunch_time?: string
                    dinner_enabled?: boolean
                    dinner_time?: string
                    water_enabled?: boolean
                    water_interval_hours?: number
                    exercise_enabled?: boolean
                    exercise_time?: string
                    sleep_enabled?: boolean
                    sleep_time?: string
                    goal_notifications_enabled?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    breakfast_enabled?: boolean
                    breakfast_time?: string
                    lunch_enabled?: boolean
                    lunch_time?: string
                    dinner_enabled?: boolean
                    dinner_time?: string
                    water_enabled?: boolean
                    water_interval_hours?: number
                    exercise_enabled?: boolean
                    exercise_time?: string
                    sleep_enabled?: boolean
                    sleep_time?: string
                    goal_notifications_enabled?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
        }
    }
}
