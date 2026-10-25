import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

if (!url || !anon) {
  console.warn('Variables Supabase manquantes. Copiez .env.example vers .env.local.')
}

export const supabase = createClient(url || 'https://example.supabase.co', anon || 'missing-key', {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
})
