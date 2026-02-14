// =====================================================
// Support Conversation Details API Routes
// GET   /api/support/conversations/[id] - Get conversation with messages
// PATCH /api/support/conversations/[id] - Update conversation status
// =====================================================

import { NextRequest, NextResponse } from 'next/server'
import { supportService } from '@/lib/services/support-service'
import { telegramService } from '@/lib/services/telegram-service'
import { validateAnonymousId } from '@/lib/utils/anonymous-id'
import type {
  GetConversationResponse,
  UpdateConversationRequest,
} from '@/types/support'

/**
 * GET /api/support/conversations/[id]
 * Get conversation with all messages
 *
 * Query params:
 * - anonymous_id: Anonymous user ID (for verification)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(req.url)
    const anonymousId = searchParams.get('anonymous_id')
    const { id: conversationId } = await params

    // Validate conversation ID format (UUID)
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(conversationId)) {
      return NextResponse.json(
        { error: 'Invalid conversation ID format' },
        { status: 400 }
      )
    }

    // Verify anonymous access if provided
    if (anonymousId) {
      if (!validateAnonymousId(anonymousId)) {
        return NextResponse.json(
          { error: 'Invalid anonymous_id format' },
          { status: 400 }
        )
      }

      const hasAccess = await supportService.verifyAnonymousAccess(
        conversationId,
        anonymousId
      )

      if (!hasAccess) {
        return NextResponse.json(
          { error: 'Access denied to this conversation' },
          { status: 403 }
        )
      }
    }

    // Get conversation and messages
    const { conversation, messages } = await supportService.getConversationWithMessages(
      conversationId
    )

    const response: GetConversationResponse = { conversation, messages }

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Conversation not found') {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }

    console.error('Get conversation error:', error)
    return NextResponse.json(
      { error: 'Failed to get conversation' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/support/conversations/[id]
 * Update conversation status
 *
 * Body:
 * - status: New status ('open' | 'resolved' | 'closed')
 * - anonymous_id: Anonymous user ID (for verification)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: conversationId } = await params

    // Parse request body
    let body: UpdateConversationRequest
    try {
      body = await req.json()
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    const { status, anonymous_id } = body

    // Validate inputs
    if (!status) {
      return NextResponse.json(
        { error: 'status is required' },
        { status: 400 }
      )
    }

    if (!['open', 'resolved', 'closed'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      )
    }

    if (!anonymous_id) {
      return NextResponse.json(
        { error: 'anonymous_id is required' },
        { status: 400 }
      )
    }

    if (!validateAnonymousId(anonymous_id)) {
      return NextResponse.json(
        { error: 'Invalid anonymous_id format' },
        { status: 400 }
      )
    }

    // Verify access
    const hasAccess = await supportService.verifyAnonymousAccess(
      conversationId,
      anonymous_id
    )

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Access denied to this conversation' },
        { status: 403 }
      )
    }

    // Get conversation to check thread ID
    const conversation = await supportService.getConversationById(conversationId)

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }

    // Update conversation status
    await supportService.updateConversation(conversationId, { status })

    // Notify Telegram if configured
    if (telegramService.isConfigured() && conversation.message_thread_id) {
      try {
        await telegramService.notifyStatusChange(
          conversation.message_thread_id,
          status
        )
      } catch (telegramError) {
        console.error('Failed to notify Telegram of status change:', telegramError)
        // Continue anyway
      }

      // Optionally close the topic if status is closed
      if (status === 'closed') {
        try {
          await telegramService.closeTopic(conversation.message_thread_id)
        } catch (closeError) {
          console.error('Failed to close Telegram topic:', closeError)
        }
      }
    }

    // Get updated conversation
    const { conversation: updatedConversation, messages } =
      await supportService.getConversationWithMessages(conversationId)

    const response: GetConversationResponse = {
      conversation: updatedConversation,
      messages,
    }

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    })
  } catch (error) {
    console.error('Update conversation error:', error)
    return NextResponse.json(
      { error: 'Failed to update conversation' },
      { status: 500 }
    )
  }
}
