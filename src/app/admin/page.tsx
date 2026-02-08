import { StatsCard } from '@/components/admin/StatsCard'
import { SubmissionsChart } from '@/components/admin/SubmissionsChart'
import { MessageSquare, TrendingUp, Users, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/Card'
import { startOfMonth } from 'date-fns'

async function getStats() {
  const supabase = await createClient()

  const now = new Date()
  const monthStart = startOfMonth(now)

  const [
    { count: totalContacts },
    { count: totalQuotes },
    { count: newContacts },
    { count: newQuotes },
    { count: respondedContacts },
    { count: respondedQuotes },
    { count: monthlyContacts },
    { count: monthlyQuotes },
  ] = await Promise.all([
    supabase.from('contacts').select('*', { count: 'exact', head: true }),
    supabase.from('quotes').select('*', { count: 'exact', head: true }),
    supabase.from('contacts').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('quotes').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('contacts').select('*', { count: 'exact', head: true }).eq('status', 'responded'),
    supabase.from('quotes').select('*', { count: 'exact', head: true }).eq('status', 'responded'),
    supabase.from('contacts').select('*', { count: 'exact', head: true }).gte('created_at', monthStart.toISOString()),
    supabase.from('quotes').select('*', { count: 'exact', head: true }).gte('created_at', monthStart.toISOString()),
  ])

  return {
    newInquiries: (newContacts || 0) + (newQuotes || 0),
    totalLeads: (totalContacts || 0) + (totalQuotes || 0),
    responded: (respondedContacts || 0) + (respondedQuotes || 0),
    thisMonth: (monthlyContacts || 0) + (monthlyQuotes || 0),
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const statsCards = [
    {
      label: 'New Inquiries',
      value: stats.newInquiries,
      icon: MessageSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Total Leads',
      value: stats.totalLeads,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Responded',
      value: stats.responded,
      icon: CheckCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      label: 'This Month',
      value: stats.thisMonth,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 font-heading">
          Welcome Back
        </h2>
        <p className="text-neutral-400">
          Here&apos;s what&apos;s happening with your flooring business today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat) => (
          <StatsCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Charts */}
      <div className="mb-8">
        <SubmissionsChart />
      </div>

      {/* Quick Actions */}
      <Card className="p-6 border-white/10">
        <h3 className="text-xl font-bold text-white mb-4 font-heading">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <a
            href="/admin/leads"
            className="p-4 border border-white/10 rounded-lg hover:border-accent hover:bg-white/5 transition-colors group"
          >
            <MessageSquare className="w-6 h-6 text-accent mb-2 group-hover:scale-110 transition-transform" />
            <p className="font-semibold text-white">View All Leads</p>
            <p className="text-sm text-neutral-400">
              Manage all submissions
            </p>
          </a>
        </div>
      </Card>
    </div>
  )
}
