// =====================================================
// Support Service - Database Operations
// =====================================================

import { createServiceClient } from '@/lib/supabase/api'
import type {
  SupportConversation,
  SupportMessage,
  CreateConversationData,
  CreateMessageData,
} from '@/types/support'

/**
 * Support Service for database operations
 * Uses service role client to bypass RLS for server-side operations
 */
class SupportService {
  private supabase

  constructor() {
    this.supabase = createServiceClient()
  }

  // =====================================================
  // Conversation Operations
  // =====================================================

  /**
   * Create a new support conversation
   *
   * @param data - Conversation creation data
   * @returns Created conversation
   */
  async createConversation(
    data: CreateConversationData
  ): Promise<SupportConversation> {
    const { anonymous_id, initial_message } = data

    const { data: conversation, error } = await this.supabase
      .from('support_conversations')
      .insert([
        {
          anonymous_id,
          initial_message,
          user_id: null, // Always null for anonymous users
          status: 'open',
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Failed to create conversation:', error)
      throw new Error('Failed to create conversation')
    }

    return conversation as SupportConversation
  }

  /**
   * Get conversation by ID
   *
   * @param id - Conversation ID
   * @returns Conversation or null
   */
  async getConversationById(id: string): Promise<SupportConversation | null> {
    const { data, error } = await this.supabase
      .from('support_conversations')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return null
      }
      console.error('Failed to get conversation:', error)
      throw new Error('Failed to get conversation')
    }

    return data as SupportConversation
  }

  /**
   * Get conversation by Telegram thread ID
   *
   * @param threadId - Telegram forum topic ID
   * @returns Conversation or null
   */
  async getConversationByThreadId(
    threadId: number
  ): Promise<SupportConversation | null> {
    const { data, error } = await this.supabase
      .from('support_conversations')
      .select('*')
      .eq('message_thread_id', threadId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      console.error('Failed to get conversation by thread ID:', error)
      throw new Error('Failed to get conversation by thread ID')
    }

    return data as SupportConversation
  }

  /**
   * Get all conversations for an anonymous user
   *
   * @param anonymousId - Anonymous user ID
   * @returns Array of conversations
   */
  async getConversations(anonymousId: string): Promise<SupportConversation[]> {
    const { data, error } = await this.supabase
      .from('support_conversations')
      .select('*')
      .eq('anonymous_id', anonymousId)
      .order('last_message_at', { ascending: false })

    if (error) {
      console.error('Failed to get conversations:', error)
      throw new Error('Failed to get conversations')
    }

    return (data as SupportConversation[]) || []
  }

  /**
   * Update conversation
   *
   * @param id - Conversation ID
   * @param updates - Partial conversation updates
   */
  async updateConversation(
    id: string,
    updates: Partial<SupportConversation>
  ): Promise<void> {
    const { error } = await this.supabase
      .from('support_conversations')
      .update(updates)
      .eq('id', id)

    if (error) {
      console.error('Failed to update conversation:', error)
      throw new Error('Failed to update conversation')
    }
  }

  /**
   * Update conversation with Telegram thread ID
   *
   * @param id - Conversation ID
   * @param threadId - Telegram forum topic ID
   */
  async setConversationThreadId(id: string, threadId: number): Promise<void> {
    await this.updateConversation(id, { message_thread_id: threadId })
  }

  // =====================================================
  // Message Operations
  // =====================================================

  /**
   * Create a new message
   *
   * @param data - Message creation data
   * @returns Created message
   */
  async createMessage(data: CreateMessageData): Promise<SupportMessage> {
    const {
      conversation_id,
      sender_type,
      sender_name,
      sender_telegram_id,
      content,
      image_url,
    } = data

    const { data: message, error } = await this.supabase
      .from('support_messages')
      .insert([
        {
          conversation_id,
          sender_type,
          sender_name: sender_name || null,
          sender_telegram_id: sender_telegram_id || null,
          content: content || null,
          image_url: image_url || null,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Failed to create message:', error)
      throw new Error('Failed to create message')
    }

    return message as SupportMessage
  }

  /**
   * Get messages for a conversation
   *
   * @param conversationId - Conversation ID
   * @param limit - Maximum number of messages (default: 100)
   * @returns Array of messages
   */
  async getMessages(
    conversationId: string,
    limit: number = 100
  ): Promise<SupportMessage[]> {
    const { data, error } = await this.supabase
      .from('support_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(limit)

    if (error) {
      console.error('Failed to get messages:', error)
      throw new Error('Failed to get messages')
    }

    return (data as SupportMessage[]) || []
  }

  /**
   * Mark messages as read
   *
   * @param messageIds - Array of message IDs
   */
  async markMessagesAsRead(messageIds: string[]): Promise<void> {
    if (messageIds.length === 0) return

    const { error } = await this.supabase
      .from('support_messages')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .in('id', messageIds)

    if (error) {
      console.error('Failed to mark messages as read:', error)
      throw new Error('Failed to mark messages as read')
    }
  }

  /**
   * Save Telegram message ID to a message
   *
   * @param messageId - Support message ID
   * @param telegramMessageId - Telegram message ID
   */
  async setMessageTelegramId(
    messageId: string,
    telegramMessageId: number
  ): Promise<void> {
    const { error } = await this.supabase
      .from('support_messages')
      .update({ telegram_message_id: telegramMessageId })
      .eq('id', messageId)

    if (error) {
      console.error('Failed to update telegram message ID:', error)
      throw new Error('Failed to update telegram message ID')
    }
  }

  // =====================================================
  // Validation Helpers
  // =====================================================

  /**
   * Verify anonymous ID matches conversation
   *
   * @param conversationId - Conversation ID
   * @param anonymousId - Anonymous ID to verify
   * @returns True if match, false otherwise
   */
  async verifyAnonymousAccess(
    conversationId: string,
    anonymousId: string
  ): Promise<boolean> {
    const conversation = await this.getConversationById(conversationId)

    if (!conversation) {
      return false
    }

    return conversation.anonymous_id === anonymousId
  }

  /**
   * Get conversation with messages
   *
   * @param conversationId - Conversation ID
   * @returns Object with conversation and messages
   */
  async getConversationWithMessages(conversationId: string): Promise<{
    conversation: SupportConversation
    messages: SupportMessage[]
  }> {
    const [conversation, messages] = await Promise.all([
      this.getConversationById(conversationId),
      this.getMessages(conversationId),
    ])

    if (!conversation) {
      throw new Error('Conversation not found')
    }

    return { conversation, messages }
  }
}

// Export singleton instance
export const supportService = new SupportService()
