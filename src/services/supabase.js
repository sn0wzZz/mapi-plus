import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'
import  Constants  from 'expo-constants'

const SUPABASE_KEY=Constants.expoConfig.extra.supabaseKey
const SUPABASE_URL=Constants.expoConfig.extra.supabaseUrl

const supabaseUrl = SUPABASE_URL
const supabaseKey = SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase
