'use client'

import { useState, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table'
import type { Lead } from '@/lib/types/leads'
import { format } from 'date-fns'
import { Mail, Phone, Calendar, ArrowUpDown, Filter, Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { toast } from 'sonner'
import { cn } from '@/lib/utils/cn'

interface LeadsTableProps {
  initialLeads: Lead[]
  onStatusChange?: () => void
}

type FilterStatus = 'all' | 'new' | 'responded' | 'archived'
type FilterType = 'all' | 'contact' | 'quote'

export function LeadsTable({ initialLeads, onStatusChange }: LeadsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [leads, setLeads] = useState(initialLeads)
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all')
  const [typeFilter, setTypeFilter] = useState<FilterType>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const handleStatusChange = async (id: string, newStatus: string, type: string) => {
    try {
      const response = await fetch(`/api/admin/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, type }),
      })

      if (!response.ok) throw new Error()

      setLeads(prev =>
        prev.map(lead =>
          lead.id === id ? { ...lead, status: newStatus } : lead
        )
      )

      toast.success('Status updated successfully')
      onStatusChange?.()
    } catch {
      toast.error('Failed to update status')
    }
  }

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesStatus = statusFilter === 'all' || (lead.status || 'new') === statusFilter
      const matchesType = typeFilter === 'all' || lead.type === typeFilter
      const matchesSearch =
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (lead.service && lead.service.toLowerCase().includes(searchQuery.toLowerCase()))

      return matchesStatus && matchesType && matchesSearch
    })
  }, [leads, statusFilter, typeFilter, searchQuery])

  const columns: ColumnDef<Lead>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <button
          className="flex items-center gap-2 font-heading font-bold text-neutral-300 hover:text-white transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name <ArrowUpDown className="w-4 h-4" />
        </button>
      ),
      cell: ({ row }) => (
        <div>
          <p className="font-bold text-white tracking-wide">{row.original.name}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className={cn(
              "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
              row.original.type === 'contact'
                ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
            )}>
              {row.original.type}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Contact',
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-neutral-400 group">
            <Mail className="w-3.5 h-3.5 group-hover:text-accent transition-colors" />
            <span className="group-hover:text-neutral-200 transition-colors">{row.original.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-400 group">
            <Phone className="w-3.5 h-3.5 group-hover:text-accent transition-colors" />
            <span className="group-hover:text-neutral-200 transition-colors">{row.original.phone}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'service',
      header: 'Service',
      cell: ({ row }) => (
        <span className="text-sm text-neutral-300 font-medium">{row.original.service}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status || 'new'
        const statusStyles: Record<string, string> = {
          new: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
          read: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
          responded: 'bg-green-500/10 text-green-400 border-green-500/20',
          archived: 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20',
        }
        return (
          <span className={cn(
            "px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border",
            statusStyles[status]
          )}>
            {status}
          </span>
        )
      },
    },
    {
      accessorKey: 'created_at',
      header: ({ column }) => (
        <button
          className="flex items-center gap-2 font-heading font-bold text-neutral-300 hover:text-white transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Date <ArrowUpDown className="w-4 h-4" />
        </button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <Calendar className="w-4 h-4 text-neutral-500" />
          {format(new Date(row.original.created_at), 'MMM dd, yyyy')}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          {(!row.original.status || row.original.status === 'new') && (
            <button
              onClick={() => handleStatusChange(
                row.original.id,
                'responded',
                row.original.type
              )}
              className="px-3 py-1.5 text-xs font-bold text-dark-bg bg-accent hover:bg-accent-light rounded-lg transition-colors"
            >
              Mark Responded
            </button>
          )}
          <button
            onClick={() => handleStatusChange(
              row.original.id,
              row.original.status === 'archived' ? 'new' : 'archived',
              row.original.type
            )}
            className="px-3 py-1.5 text-xs font-medium text-neutral-400 border border-white/10 hover:border-white/30 hover:text-white rounded-lg transition-colors"
          >
            {row.original.status === 'archived' ? 'Unarchive' : 'Archive'}
          </button>
        </div>
      ),
    },
  ]

  const table = useReactTable({
    data: filteredLeads,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
  })

  return (
    <div className="space-y-6">
      {/* Filters Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
        {/* Search */}
        <div className="relative md:col-span-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 md:col-span-3 justify-end items-center">
          <div className="flex items-center gap-2 mr-2">
            <Filter className="w-4 h-4 text-accent" />
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Filters:</span>
          </div>

          <FilterButton
            active={statusFilter === 'all'}
            onClick={() => setStatusFilter('all')}
            label="All Status"
          />
          <FilterButton
            active={statusFilter === 'new'}
            onClick={() => setStatusFilter('new')}
            label="New"
          />
          <FilterButton
            active={statusFilter === 'responded'}
            onClick={() => setStatusFilter('responded')}
            label="Responded"
          />
          <div className="w-px h-6 bg-white/10 mx-2 hidden sm:block" />
          <FilterButton
            active={typeFilter === 'all'}
            onClick={() => setTypeFilter('all')}
            label="All Types"
          />
          <FilterButton
            active={typeFilter === 'quote'}
            onClick={() => setTypeFilter('quote')}
            label="Quotes"
          />
          <FilterButton
            active={typeFilter === 'contact'}
            onClick={() => setTypeFilter('contact')}
            label="Contacts"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black/20 border-b border-white/10">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className="px-6 py-4 text-left text-xs font-bold text-neutral-500 uppercase tracking-widest"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-white/5">
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-white/5 transition-colors group">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-6 py-4 align-top border-l border-transparent first:border-0 group-hover:border-white/5">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="h-32 text-center text-neutral-500">
                    No leads found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function FilterButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border",
        active
          ? "bg-accent/20 text-accent border-accent/50 shadow-[0_0_10px_rgba(230,170,104,0.2)]"
          : "bg-transparent text-neutral-400 border-transparent hover:bg-white/5 hover:text-white hover:border-white/10"
      )}
    >
      {label}
    </button>
  )
}
