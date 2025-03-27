import { createClient } from '@supabase/supabase-js'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL ist nicht definiert')
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY ist nicht definiert')
}

console.log('Initialisiere Supabase Client mit URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false
    }
  }
)

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