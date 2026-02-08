import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

// Public client for server-side API routes (uses anon/publishable key)
// This is for unauthenticated operations like contact/quote forms
export function createPublicClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  // Support both new (sb_publishable_) and legacy (anon) key formats
  const supabaseKey = process.env.SUPABASE_SERVICE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey,
      url: supabaseUrl
    })
    throw new Error('Missing Supabase environment variables. Please restart your dev server.')
  }

  return createClient<Database>(supabaseUrl, supabaseKey)
}

// Service role client for server-side operations that bypass RLS
// Use this for admin operations like saving form submissions
export function createServiceClient() {
  // Support both new (sb_secret_) and legacy (service_role) key formats
  const serviceKey = process.env.SUPABASE_SERVICE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!serviceKey) {
    throw new Error('Missing Supabase service key. Set SUPABASE_SERVICE_SECRET_KEY in .env.local')
  }

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}
