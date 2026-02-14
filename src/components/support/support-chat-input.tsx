'use client'

// =====================================================
// Support Chat Input - Message Input Component
// =====================================================

import { useState, FormEvent } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { useSupportStore } from '@/store/support-store'

interface SupportChatInputProps {
  anonymousId: string
}

/**
 * Support Chat Input
 * Handles message input and sending
 */
export default function SupportChatInput({ anonymousId }: SupportChatInputProps) {
  const {
    currentConversation,
    createConversation,
    sendMessage,
    isSending,
    error,
    setError,
  } = useSupportStore()

  const [message, setMessage] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!message.trim() || isSending || !anonymousId) {
      return
    }

    const messageText = message.trim()
    setMessage('') // Clear input immediately

    try {
      if (!currentConversation) {
        // Create new conversation with initial message
        console.log('[Support:Input] Creating new conversation')
        await createConversation(anonymousId, messageText)
      } else {
        // Send message to existing conversation
        console.log('[Support:Input] Sending message')
        await sendMessage(messageText)
      }
    } catch (err) {
      console.error('[Support:Input] Failed to send message:', err)
      // Restore message on error
      setMessage(messageText)
    }
  }

  // Check if conversation is closed or resolved
  if (
    currentConversation?.status === 'closed' ||
    currentConversation?.status === 'resolved'
  ) {
    return (
      <div className="p-4 border-t bg-gray-50">
        <div className="text-center mb-3">
          <p className="text-sm text-gray-600 mb-2">
            {currentConversation.status === 'closed'
              ? '🔒 This conversation has been closed.'
              : '✅ This conversation has been resolved.'}
          </p>
        </div>
        <button
          onClick={() => {
            useSupportStore.setState({
              currentConversation: null,
              messages: [],
            })
            setMessage('')
            setError(null)
          }}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Start New Ticket
        </button>
      </div>
    )
  }

  return (
    <div className="border-t bg-white">
      {/* Error display */}
      {error && (
        <div className="px-4 pt-3">
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Input form */}
      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              currentConversation
                ? 'Type your message...'
                : 'Describe your issue...'
            }
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
            disabled={isSending}
            maxLength={5000}
            autoFocus={!currentConversation}
          />
          <button
            type="submit"
            disabled={isSending || !message.trim()}
            className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
            aria-label="Send message"
          >
            {isSending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Character counter (optional) */}
        {message.length > 4000 && (
          <p className="text-xs text-gray-500 mt-2 text-right">
            {message.length} / 5000 characters
          </p>
        )}

        {/* Helper text */}
        {!currentConversation && (
          <p className="text-xs text-gray-500 mt-2">
            Press Enter to send your message to our support team
          </p>
        )}
      </form>
    </div>
  )
}
