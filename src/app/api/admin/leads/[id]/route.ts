import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { status, type } = body

    const table = type === 'contact' ? 'contacts' : 'quotes'

    const updateData: any = { status }
    if (status === 'responded') {
      updateData.responded_at = new Date().toISOString()
    }

    const { error } = await supabase
      .from(table)
      .update(updateData)
      .eq('id', id)

    if (error) throw error

    // Trigger revalidation of admin pages after successful update
    revalidateTag('admin-stats', 'max')
    revalidateTag('admin-leads', 'max')
    revalidateTag('admin-charts', 'max')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update lead error:', error)
    return NextResponse.json(
      { error: 'Failed to update lead' },
      { status: 500 }
    )
  }
}
