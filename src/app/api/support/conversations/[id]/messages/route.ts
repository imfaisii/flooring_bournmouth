// =====================================================
// Support Messages API Routes
// POST /api/support/conversations/[id]/messages - Send message
// =====================================================

import { NextRequest, NextResponse } from 'next/server'
import { supportService } from '@/lib/services/support-service'
import { telegramService } from '@/lib/services/telegram-service'
import { validateAnonymousId } from '@/lib/utils/anonymous-id'
import type {
  SendMessageRequest,
  SendMessageResponse,
} from '@/types/support'

/**
 * POST /api/support/conversations/[id]/messages
 * Send a new message in a conversation
 *
 * Body:
 * - content: Message text (optional if image_url provided)
 * - image_url: Image URL (optional)
 * - anonymous_id: Anonymous user ID (for verification)
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: conversationId } = await params

    // Parse request body
    let body: SendMessageRequest
    try {
      body = await req.json()
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    const { content, image_url, anonymous_id } = body

    // Validate inputs
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

    if (!content?.trim() && !image_url) {
      return NextResponse.json(
        { error: 'Either content or image_url is required' },
        { status: 400 }
      )
    }

    if (content && content.length > 5000) {
      return NextResponse.json(
        { error: 'Message is too long (max 5000 characters)' },
        { status: 400 }
      )
    }

    // Verify access to conversation
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

    // Get conversation to check thread ID and status
    const conversation = await supportService.getConversationById(conversationId)

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }

    // Check if conversation is closed
    if (conversation.status === 'closed') {
      return NextResponse.json(
        { error: 'Cannot send messages to a closed conversation' },
        { status: 400 }
      )
    }

    // Create user message in database
    const message = await supportService.createMessage({
      conversation_id: conversationId,
      sender_type: 'user',
      content: content?.trim() || undefined,
      image_url: image_url || undefined,
    })

    // Forward to Telegram if configured and thread exists
    if (
      telegramService.isConfigured() &&
      conversation.message_thread_id
    ) {
      try {
        let telegramMessageId: number

        if (image_url) {
          // Send photo with caption
          telegramMessageId = await telegramService.sendPhotoToTopic(
            conversation.message_thread_id,
            image_url,
            content ? telegramService.formatUserMessage('Anonymous User', content.trim()) : undefined
          )
        } else if (content) {
          // Send text message
          const formattedMessage = telegramService.formatUserMessage(
            'Anonymous User',
            content.trim()
          )
          telegramMessageId = await telegramService.sendMessageToTopic(
            conversation.message_thread_id,
            formattedMessage,
            'Anonymous User'
          )
        } else {
          throw new Error('No content or image to send')
        }

        // Save Telegram message ID
        await supportService.setMessageTelegramId(message.id, telegramMessageId)
        message.telegram_message_id = telegramMessageId
      } catch (telegramError) {
        console.error('Failed to forward message to Telegram:', telegramError)
        // Continue anyway - message is saved in database
      }
    }

    const response: SendMessageResponse = {
      success: true,
      message,
    }

    return NextResponse.json(response, {
      status: 201,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    })
  } catch (error) {
    console.error('Send message error:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
