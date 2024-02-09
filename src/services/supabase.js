import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import  Constants  from 'expo-constants'

const SUPABASE_KEY=Constants.expoConfig.extra.supabaseKey
const SUPABASE_URL=Constants.expoConfig.extra.supabaseUrl

const supabaseUrl = SUPABASE_URL
const supabaseKey = SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

export default supabase
