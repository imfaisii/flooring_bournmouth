'use client'

import { Card } from '@/components/ui/Card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useEffect, useState } from 'react'

interface ChartData {
  date: string
  contacts: number
  quotes: number
}

export function SubmissionsChart() {
  const [data, setData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/charts')
      .then(res => res.json())
      .then(result => {
        setData(result.data || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <Card className="p-6 border-white/10">
        <div className="h-[300px] flex items-center justify-center">
          <p className="text-neutral-500">Loading chart...</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 border-white/10">
      <h3 className="text-xl font-bold text-white mb-4 font-heading">
        Submissions This Month
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis
            dataKey="date"
            stroke="#525252"
            tick={{ fill: '#a3a3a3' }}
          />
          <YAxis
            stroke="#525252"
            tick={{ fill: '#a3a3a3' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1a1a1a',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#fff'
            }}
            itemStyle={{ color: '#e5e5e5' }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="contacts"
            stroke="#e6aa68"
            strokeWidth={2}
            name="Contacts"
            activeDot={{ r: 6, strokeWidth: 0, fill: '#fff' }}
          />
          <Line
            type="monotone"
            dataKey="quotes"
            stroke="#ca8a04"
            strokeWidth={2}
            name="Quotes"
            strokeDasharray="5 5"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}
