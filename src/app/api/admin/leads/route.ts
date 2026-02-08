import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { Lead } from '@/lib/types/leads'

// Enable ISR with 1-minute revalidation (tag-based revalidation on mutations)
export const revalidate = 60 // Revalidate every 1 minute

export async function GET() {
  try {
    const supabase = await createClient()

    // Check auth
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [{ data: contacts }, { data: quotes }] = await Promise.all([
      supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false }),
      supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false }),
    ])

    // Combine and format leads
    const leads: Lead[] = [
      ...(contacts || []).map(c => ({
        ...c,
        type: 'contact' as const,
        created_at: c.created_at || new Date().toISOString()
      })),
      ...(quotes || []).map(q => ({
        ...q,
        type: 'quote' as const,
        created_at: q.created_at || new Date().toISOString()
      })),
    ].sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    return NextResponse.json(
      { leads },
      {
        headers: {
          'Cache-Control': 'private, max-age=60, must-revalidate',
          'CDN-Cache-Control': 'private, max-age=60',
        }
      }
    )
  } catch (error) {
    console.error('Leads API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    )
  }
}
