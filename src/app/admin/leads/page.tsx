import { createClient } from '@/lib/supabase/server'
import { LeadsTable } from '@/components/admin/LeadsTable'
import type { Lead } from '@/lib/types/leads'

async function getLeads(): Promise<Lead[]> {
  const supabase = await createClient()

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

  const leads: Lead[] = [
    ...(contacts || []).map(c => ({
      ...c,
      type: 'contact' as const,
      created_at: c.created_at || new Date().toISOString() // Ensure string
    })),
    ...(quotes || []).map(q => ({
      ...q,
      type: 'quote' as const,
      created_at: q.created_at || new Date().toISOString() // Ensure string
    })),
  ].sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  return leads
}

export default async function LeadsPage() {
  const leads = await getLeads()

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 font-heading">
          All Leads
        </h2>
        <p className="text-neutral-400">
          Manage all contact and quote submissions
        </p>
      </div>

      <LeadsTable initialLeads={leads} />
    </div>
  )
}
