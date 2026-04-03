import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';
import Constants from 'expo-constants';

// Access environment variables directly in React Native with Expo
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || 
                    process.env.EXPO_PUBLIC_SUPABASE_URL || 
                    'https://bpqxagsojrahffeijzqs.supabase.co';

const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || 
                        process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 
                        'sb_publishable_H3ch5b2LqmzDg4pBsfBaUw_i8jvhg1p';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
