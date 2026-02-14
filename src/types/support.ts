// =====================================================
// Support Chat System Types
// =====================================================

/**
 * Support conversation with Telegram Forum Topic integration
 */
export interface SupportConversation {
  id: string
  user_id: string | null
  anonymous_id: string
  message_thread_id: number | null // Telegram Forum Topic ID
  status: 'open' | 'resolved' | 'closed'
  initial_message: string
  last_message_at: string
  created_at: string
  updated_at: string
}

/**
 * Individual message in a support conversation
 */
export interface SupportMessage {
  id: string
  conversation_id: string
  sender_type: 'user' | 'support' | 'system'
  sender_name: string | null
  sender_telegram_id: number | null
  content: string | null
  image_url: string | null
  telegram_message_id: number | null
  is_read: boolean
  read_at: string | null
  created_at: string
}

/**
 * Data required to create a new conversation
 */
export interface CreateConversationData {
  anonymous_id: string
  initial_message: string
}

/**
 * Data required to create a new message
 */
export interface CreateMessageData {
  conversation_id: string
  sender_type: 'user' | 'support' | 'system'
  sender_name?: string
  sender_telegram_id?: number
  content?: string
  image_url?: string
  anonymous_id?: string // Required for validation on API routes
}

/**
 * Telegram webhook update structure
 */
export interface TelegramUpdate {
  update_id: number
  message?: TelegramMessage
}

export interface TelegramMessage {
  message_id: number
  message_thread_id?: number // Forum topic ID
  from: TelegramUser
  chat: TelegramChat
  date: number
  text?: string
  caption?: string
  photo?: TelegramPhotoSize[]
  reply_to_message?: TelegramMessage
}

export interface TelegramUser {
  id: number
  is_bot: boolean
  first_name: string
  last_name?: string
  username?: string
}

export interface TelegramChat {
  id: number
  type: 'private' | 'group' | 'supergroup' | 'channel'
  title?: string
  username?: string
}

export interface TelegramPhotoSize {
  file_id: string
  file_unique_id: string
  width: number
  height: number
  file_size?: number
}

/**
 * Telegram API response for createForumTopic
 */
export interface TelegramForumTopicResponse {
  ok: boolean
  result: {
    message_thread_id: number
    name: string
    icon_color: number
    icon_custom_emoji_id?: string
  }
}

/**
 * Telegram API response for sendMessage
 */
export interface TelegramSendMessageResponse {
  ok: boolean
  result: TelegramMessage
}

/**
 * Request/Response types for API routes
 */

export interface CreateConversationRequest {
  anonymous_id: string
  initial_message: string
}

export interface CreateConversationResponse {
  success: boolean
  conversation: SupportConversation
  messages: SupportMessage[]
}

export interface SendMessageRequest {
  content?: string
  image_url?: string
  anonymous_id: string
}

export interface SendMessageResponse {
  success: boolean
  message: SupportMessage
}

export interface UpdateConversationRequest {
  status?: 'open' | 'resolved' | 'closed'
  anonymous_id: string
}

export interface GetConversationResponse {
  conversation: SupportConversation
  messages: SupportMessage[]
}

export interface GetConversationsResponse {
  conversations: SupportConversation[]
}
