import type { Tables } from '@/lib/supabase/database.types'

export type Contact = Tables<'contacts'>
export type Quote = Tables<'quotes'>

export type Lead = {
  id: string
  name: string
  email: string
  phone: string
  service: string
  message: string | null
  status: string | null
  type: 'contact' | 'quote'
  created_at: string
  updated_at?: string | null
  responded_at?: string | null
  address?: string // Only for quotes
}
