// =====================================================
// Telegram Webhook Handler
// POST /api/telegram/webhook - Receive updates from Telegram
// =====================================================

import { NextRequest, NextResponse } from 'next/server'
import { supportService } from '@/lib/services/support-service'
import { telegramService } from '@/lib/services/telegram-service'
import type { TelegramUpdate } from '@/types/support'

/**
 * POST /api/telegram/webhook
 * Receive webhook updates from Telegram Bot API
 *
 * This endpoint is called by Telegram when:
 * - Admin replies to a message in a forum topic
 * - Any message is sent in the support group
 *
 * Flow:
 * 1. Verify secret token
 * 2. Extract message_thread_id (topic ID)
 * 3. Find conversation by thread ID
 * 4. Save support message to database
 * 5. Supabase Realtime notifies client automatically
 */
export async function POST(req: NextRequest) {
  try {
    // Step 1: Verify webhook secret token
    const secretToken = req.headers.get('x-telegram-bot-api-secret-token')
    const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET

    if (!expectedSecret) {
      console.error('TELEGRAM_WEBHOOK_SECRET not configured')
      return NextResponse.json(
        { error: 'Webhook not configured' },
        { status: 500 }
      )
    }

    if (secretToken !== expectedSecret) {
      console.warn('Telegram webhook: Invalid secret token')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Step 2: Parse Telegram update
    let update: TelegramUpdate
    try {
      update = await req.json()
    } catch (parseError) {
      console.error('Failed to parse Telegram update:', parseError)
      return NextResponse.json(
        { error: 'Invalid JSON' },
        { status: 400 }
      )
    }

    console.log('[Telegram Webhook] Received update:', {
      update_id: update.update_id,
      has_message: !!update.message,
      message_thread_id: update.message?.message_thread_id,
    })

    // Step 3: Extract and validate message
    const message = update.message

    if (!message) {
      // Not a message update - ignore
      return NextResponse.json({ ok: true })
    }

    // Check if message is from support group
    if (!telegramService.isFromSupportGroup(message)) {
      console.log('[Telegram Webhook] Message not from support group, ignoring')
      return NextResponse.json({ ok: true })
    }

    // Extract thread ID (forum topic ID)
    const threadId = telegramService.extractThreadId(message)

    if (!threadId) {
      // Message not in a topic - ignore
      console.log('[Telegram Webhook] Message has no thread ID, ignoring')
      return NextResponse.json({ ok: true })
    }

    // Ignore bot messages (avoid loops)
    if (message.from.is_bot) {
      console.log('[Telegram Webhook] Ignoring bot message')
      return NextResponse.json({ ok: true })
    }

    // Step 4: Find conversation by thread ID
    const conversation = await supportService.getConversationByThreadId(threadId)

    if (!conversation) {
      console.error('[Telegram Webhook] Conversation not found for thread:', threadId)
      // Send a warning message to the topic
      if (telegramService.isConfigured()) {
        try {
          await telegramService.sendMessageToTopic(
            threadId,
            '⚠️ <b>Warning:</b> This topic is not linked to any active conversation.',
            'System'
          )
        } catch (err) {
          console.error('Failed to send warning message:', err)
        }
      }
      return NextResponse.json({ ok: true })
    }

    // Step 5: Extract message content
    const content = message.text || message.caption || undefined

    // Get photo URL if present (use largest photo)
    let imageUrl: string | undefined = undefined
    if (message.photo && message.photo.length > 0) {
      // Telegram provides multiple sizes, get the largest
      const largestPhoto = message.photo[message.photo.length - 1]
      const fileId = largestPhoto.file_id

      // Get file path from Telegram
      try {
        const botToken = process.env.TELEGRAM_BOT_TOKEN
        const fileResponse = await fetch(
          `https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`
        )
        const fileData = await fileResponse.json()

        if (fileData.ok && fileData.result.file_path) {
          // Construct full URL to the file
          imageUrl = `https://api.telegram.org/file/bot${botToken}/${fileData.result.file_path}`
        }
      } catch (error) {
        console.error('[Telegram Webhook] Failed to get file URL:', error)
        // Fallback to file_id if URL fetch fails
        imageUrl = fileId
      }
    }

    if (!content && !imageUrl) {
      // No content to save - ignore
      console.log('[Telegram Webhook] Message has no content, ignoring')
      return NextResponse.json({ ok: true })
    }

    // Step 6: Save support message to database
    const supportMessage = await supportService.createMessage({
      conversation_id: conversation.id,
      sender_type: 'support',
      sender_name: message.from.first_name,
      sender_telegram_id: message.from.id,
      content: content,
      image_url: imageUrl,
    })

    // Save Telegram message ID
    await supportService.setMessageTelegramId(
      supportMessage.id,
      message.message_id
    )

    console.log('[Telegram Webhook] Saved support message:', {
      conversation_id: conversation.id,
      message_id: supportMessage.id,
      sender: message.from.first_name,
      has_content: !!content,
      has_image: !!imageUrl,
    })

    // Step 7: Supabase Realtime will automatically notify the client
    // No additional action needed - the INSERT trigger handles it

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[Telegram Webhook] Error processing update:', error)

    // Return 200 OK to Telegram even on error to prevent retries
    // We log the error but don't want Telegram to keep retrying
    return NextResponse.json({ ok: true })
  }
}

/**
 * GET /api/telegram/webhook
 * Return webhook information (for debugging)
 */
export async function GET() {
  return NextResponse.json({
    status: 'active',
    message: 'Telegram webhook endpoint is active',
    configured: {
      bot_token: !!process.env.TELEGRAM_BOT_TOKEN,
      forum_group_id: !!process.env.TELEGRAM_FORUM_GROUP_ID,
      webhook_secret: !!process.env.TELEGRAM_WEBHOOK_SECRET,
    },
  })
}
