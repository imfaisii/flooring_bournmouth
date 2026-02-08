import { Card } from '@/components/ui/Card'
import { type LucideIcon } from 'lucide-react'

interface StatsCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  color: string
  bgColor: string
  trend?: {
    value: number
    label: string
  }
}

export function StatsCard({ label, value, icon: Icon, color, bgColor, trend }: StatsCardProps) {
  // Map old light bg colors to dark transparent versions
  const darkBgColor = bgColor.replace('100', '500/10');
  const darkIconColor = color.replace('600', '400');

  return (
    <Card className="p-6 border-white/10 hover:border-accent/30 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-neutral-400 mb-1 font-medium">{label}</p>
          <p className="text-3xl font-bold text-white font-heading tracking-wide">{value}</p>
          {trend && (
            <p className="text-xs text-neutral-500 mt-2">
              <span className={trend.value >= 0 ? 'text-green-400' : 'text-red-400'}>
                {trend.value >= 0 ? '+' : ''}{trend.value}%
              </span>{' '}
              {trend.label}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 ${darkBgColor} rounded-xl flex items-center justify-center flex-shrink-0 border border-white/5`}>
          <Icon className={`w-6 h-6 ${darkIconColor}`} />
        </div>
      </div>
    </Card>
  )
}
