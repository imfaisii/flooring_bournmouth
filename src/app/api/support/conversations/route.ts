// =====================================================
// Support Conversations API Routes
// GET  /api/support/conversations - List conversations
// POST /api/support/conversations - Create new conversation
// =====================================================

import { NextRequest, NextResponse } from 'next/server'
import { supportService } from '@/lib/services/support-service'
import { telegramService } from '@/lib/services/telegram-service'
import { validateAnonymousId } from '@/lib/utils/anonymous-id'
import type {
  CreateConversationRequest,
  CreateConversationResponse,
  GetConversationsResponse,
} from '@/types/support'

/**
 * GET /api/support/conversations
 * List all conversations for an anonymous user
 *
 * Query params:
 * - anonymous_id: Anonymous user ID
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const anonymousId = searchParams.get('anonymous_id')

    if (!anonymousId) {
      return NextResponse.json(
        { error: 'anonymous_id is required' },
        { status: 400 }
      )
    }

    if (!validateAnonymousId(anonymousId)) {
      return NextResponse.json(
        { error: 'Invalid anonymous_id format' },
        { status: 400 }
      )
    }

    const conversations = await supportService.getConversations(anonymousId)

    const response: GetConversationsResponse = { conversations }

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    })
  } catch (error) {
    console.error('Get conversations error:', error)
    return NextResponse.json(
      { error: 'Failed to get conversations' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/support/conversations
 * Create a new support conversation and Telegram forum topic
 *
 * Body:
 * - anonymous_id: Anonymous user ID
 * - initial_message: First message from user
 */
export async function POST(req: NextRequest) {
  try {
    // Parse request body
    let body: CreateConversationRequest
    try {
      body = await req.json()
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    const { anonymous_id, initial_message } = body

    // Validate inputs
    if (!anonymous_id || !initial_message) {
      return NextResponse.json(
        { error: 'anonymous_id and initial_message are required' },
        { status: 400 }
      )
    }

    if (!validateAnonymousId(anonymous_id)) {
      return NextResponse.json(
        { error: 'Invalid anonymous_id format' },
        { status: 400 }
      )
    }

    if (!initial_message.trim()) {
      return NextResponse.json(
        { error: 'initial_message cannot be empty' },
        { status: 400 }
      )
    }

    if (initial_message.length > 5000) {
      return NextResponse.json(
        { error: 'initial_message is too long (max 5000 characters)' },
        { status: 400 }
      )
    }

    // Step 1: Create conversation in database
    const conversation = await supportService.createConversation({
      anonymous_id,
      initial_message: initial_message.trim(),
    })

    // Step 2: Create Telegram forum topic (if configured)
    let threadId: number | null = null
    if (telegramService.isConfigured()) {
      try {
        threadId = await telegramService.createTopicForConversation(
          conversation.id,
          'Anonymous User',
          initial_message.trim()
        )

        // Update conversation with thread ID
        await supportService.setConversationThreadId(conversation.id, threadId)
        conversation.message_thread_id = threadId
      } catch (telegramError) {
        console.error('Failed to create Telegram topic:', telegramError)
        // Continue anyway - conversation is created
      }
    }

    // Step 3: Create initial user message
    const userMessage = await supportService.createMessage({
      conversation_id: conversation.id,
      sender_type: 'user',
      content: initial_message.trim(),
    })

    // Step 4: Create system message
    const systemMessage = await supportService.createMessage({
      conversation_id: conversation.id,
      sender_type: 'system',
      content: threadId
        ? 'Your message has been forwarded to our support team. We will respond shortly.'
        : 'Support system is currently offline. Your message has been saved and will be reviewed.',
    })

    const messages = [userMessage, systemMessage]

    const response: CreateConversationResponse = {
      success: true,
      conversation,
      messages,
    }

    return NextResponse.json(response, {
      status: 201,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    })
  } catch (error) {
    console.error('Create conversation error:', error)
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    )
  }
}
