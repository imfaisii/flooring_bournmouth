// =====================================================
// Telegram Service - Forum Topics Integration
// =====================================================

import type {
  TelegramForumTopicResponse,
  TelegramSendMessageResponse,
  TelegramMessage,
} from '@/types/support'

/**
 * Telegram Bot API Service for Forum Groups
 * Handles creating topics, sending messages, and webhook processing
 */
class TelegramService {
  private readonly botToken: string
  private readonly forumGroupId: string
  private readonly baseUrl: string

  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN || ''
    this.forumGroupId = process.env.TELEGRAM_FORUM_GROUP_ID || ''
    this.baseUrl = `https://api.telegram.org/bot${this.botToken}`

    if (!this.botToken || !this.forumGroupId) {
      console.warn('Telegram service not configured. Set TELEGRAM_BOT_TOKEN and TELEGRAM_FORUM_GROUP_ID.')
    }
  }

  /**
   * Check if Telegram service is properly configured
   */
  isConfigured(): boolean {
    return Boolean(this.botToken && this.forumGroupId)
  }

  /**
   * Create a new forum topic for a support conversation
   *
   * @param conversationId - UUID of the conversation
   * @param userName - Name of the user (or "Anonymous User")
   * @param initialMessage - First message from user
   * @returns Telegram Forum Topic ID (message_thread_id)
   */
  async createTopicForConversation(
    conversationId: string,
    userName: string,
    initialMessage: string
  ): Promise<number> {
    if (!this.isConfigured()) {
      throw new Error('Telegram service not configured')
    }

    // Generate topic name (max 128 characters)
    const topicName = this.generateTopicName(userName, conversationId, initialMessage)

    try {
      const response = await fetch(`${this.baseUrl}/createForumTopic`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: this.forumGroupId,
          name: topicName,
          icon_color: 0x6FB9F0, // Blue color
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('Telegram createForumTopic error:', errorData)
        throw new Error(
          errorData.description || `Failed to create forum topic: ${response.statusText}`
        )
      }

      const data: TelegramForumTopicResponse = await response.json()

      if (!data.ok || !data.result?.message_thread_id) {
        throw new Error('Invalid response from Telegram API')
      }

      const threadId = data.result.message_thread_id

      // Send initial message to the topic
      await this.sendMessageToTopic(
        threadId,
        this.formatNewTicketMessage(userName, initialMessage),
        userName
      )

      return threadId
    } catch (error) {
      console.error('Failed to create Telegram forum topic:', error)
      throw error
    }
  }

  /**
   * Send a text message to a forum topic
   *
   * @param threadId - Forum topic ID (message_thread_id)
   * @param text - Message text
   * @param userName - User name for context
   * @returns Telegram message ID
   */
  async sendMessageToTopic(
    threadId: number,
    text: string,
    userName?: string
  ): Promise<number> {
    if (!this.isConfigured()) {
      throw new Error('Telegram service not configured')
    }

    try {
      const response = await fetch(`${this.baseUrl}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: this.forumGroupId,
          message_thread_id: threadId,
          text: text,
          parse_mode: 'HTML',
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('Telegram sendMessage error:', errorData)
        throw new Error(
          errorData.description || `Failed to send message: ${response.statusText}`
        )
      }

      const data: TelegramSendMessageResponse = await response.json()

      if (!data.ok || !data.result?.message_id) {
        throw new Error('Invalid response from Telegram API')
      }

      return data.result.message_id
    } catch (error) {
      console.error('Failed to send Telegram message:', error)
      throw error
    }
  }

  /**
   * Send a photo to a forum topic
   *
   * @param threadId - Forum topic ID
   * @param imageUrl - URL of the image
   * @param caption - Optional caption text
   * @returns Telegram message ID
   */
  async sendPhotoToTopic(
    threadId: number,
    imageUrl: string,
    caption?: string
  ): Promise<number> {
    if (!this.isConfigured()) {
      throw new Error('Telegram service not configured')
    }

    try {
      const response = await fetch(`${this.baseUrl}/sendPhoto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: this.forumGroupId,
          message_thread_id: threadId,
          photo: imageUrl,
          caption: caption || '',
          parse_mode: 'HTML',
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('Telegram sendPhoto error:', errorData)
        throw new Error(
          errorData.description || `Failed to send photo: ${response.statusText}`
        )
      }

      const data: TelegramSendMessageResponse = await response.json()

      if (!data.ok || !data.result?.message_id) {
        throw new Error('Invalid response from Telegram API')
      }

      return data.result.message_id
    } catch (error) {
      console.error('Failed to send Telegram photo:', error)
      throw error
    }
  }

  /**
   * Notify support team about conversation status change
   *
   * @param threadId - Forum topic ID
   * @param status - New status
   */
  async notifyStatusChange(
    threadId: number,
    status: 'open' | 'resolved' | 'closed'
  ): Promise<void> {
    if (!this.isConfigured()) {
      return // Silent fail for non-critical notification
    }

    const statusEmoji = {
      open: '🔵',
      resolved: '✅',
      closed: '🔒',
    }

    const message = `${statusEmoji[status]} <b>Conversation ${status.toUpperCase()}</b>`

    try {
      await this.sendMessageToTopic(threadId, message)
    } catch (error) {
      console.error('Failed to send status notification:', error)
      // Don't throw - this is non-critical
    }
  }

  /**
   * Close a forum topic (optional - marks as resolved)
   *
   * @param threadId - Forum topic ID
   */
  async closeTopic(threadId: number): Promise<void> {
    if (!this.isConfigured()) {
      return
    }

    try {
      await fetch(`${this.baseUrl}/closeForumTopic`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: this.forumGroupId,
          message_thread_id: threadId,
        }),
      })
    } catch (error) {
      console.error('Failed to close topic:', error)
      // Don't throw - this is optional
    }
  }

  /**
   * Extract message_thread_id from Telegram update
   *
   * @param message - Telegram message object
   * @returns Thread ID or null
   */
  extractThreadId(message: TelegramMessage): number | null {
    return message.message_thread_id || null
  }

  /**
   * Check if message is from the support group
   *
   * @param message - Telegram message object
   * @returns True if from support group
   */
  isFromSupportGroup(message: TelegramMessage): boolean {
    return message.chat.id.toString() === this.forumGroupId
  }

  // =====================================================
  // Private Helper Methods
  // =====================================================

  /**
   * Generate topic name for conversation
   * Format: "🎫 UserName - First few words"
   * Max length: 128 characters
   */
  private generateTopicName(
    userName: string,
    conversationId: string,
    initialMessage: string
  ): string {
    const prefix = '🎫 '
    const maxLength = 128
    const shortId = conversationId.substring(0, 8)

    // Truncate initial message
    let preview = initialMessage.trim()
    if (preview.length > 50) {
      preview = preview.substring(0, 47) + '...'
    }

    // Build topic name
    let topicName = `${prefix}${userName} - ${preview}`

    // Ensure within length limit
    if (topicName.length > maxLength) {
      const available = maxLength - prefix.length - userName.length - 3 // " - "
      preview = initialMessage.substring(0, Math.max(available - 3, 10)) + '...'
      topicName = `${prefix}${userName} - ${preview}`
    }

    return topicName
  }

  /**
   * Format initial ticket message for Telegram
   */
  private formatNewTicketMessage(userName: string, message: string): string {
    return `
<b>🆕 New Support Ticket</b>

<b>From:</b> ${this.escapeHtml(userName)}
<b>Message:</b>
${this.escapeHtml(message)}

<i>Reply to this message to respond to the user.</i>
`.trim()
  }

  /**
   * Format user follow-up message for Telegram
   */
  formatUserMessage(userName: string, message: string): string {
    return `
<b>👤 ${this.escapeHtml(userName)}:</b>
${this.escapeHtml(message)}
`.trim()
  }

  /**
   * Escape HTML special characters for Telegram
   */
  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
  }
}

// Export singleton instance
export const telegramService = new TelegramService()
