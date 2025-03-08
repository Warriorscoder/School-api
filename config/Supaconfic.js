import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js'

dotenv.config(); 

const supabaseUrl = process.env.DB_URL
const supabaseKey = process.env.DB_API_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase