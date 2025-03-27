import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Mangel = {
  id: number
  title: string
  comment: string
  image_path: string
  is_done: boolean
  created_at: string
}

export type Admin = {
  id: number
  username: string
  password: string
} 