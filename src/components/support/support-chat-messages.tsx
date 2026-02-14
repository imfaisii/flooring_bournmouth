'use client'

// =====================================================
// Support Chat Messages - Message List Component
// =====================================================

import { useEffect, useRef } from 'react'
import { useSupportStore } from '@/store/support-store'
import { Loader2, User, Headset } from 'lucide-react'

/**
 * Support Chat Messages
 * Displays conversation messages with auto-scroll
 */
export default function SupportChatMessages() {
  const { messages, currentConversation, isLoading, error } = useSupportStore()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current && messages.length > 0) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  // Loading state
  if (isLoading && !currentConversation) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error && !currentConversation) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-600 text-sm mb-2">⚠️ {error}</p>
          <button
            onClick={() => useSupportStore.getState().setError(null)}
            className="text-blue-600 text-sm hover:underline"
          >
            Dismiss
          </button>
        </div>
      </div>
    )
  }

  // Empty state - no conversation
  if (!currentConversation) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 text-gray-500">
        <div className="text-center max-w-sm">
          <Headset className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p className="font-medium mb-1">Start a conversation</p>
          <p className="text-sm text-gray-400">
            Send us a message and our support team will respond shortly.
          </p>
        </div>
      </div>
    )
  }

  // Messages view
  return (
    <div
      ref={messagesContainerRef}
      className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
    >
      {messages.length === 0 ? (
        <div className="text-center text-gray-500 text-sm py-8">
          <p>No messages yet</p>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender_type === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 shadow-sm ${
                  message.sender_type === 'user'
                    ? 'bg-blue-600 text-white'
                    : message.sender_type === 'system'
                    ? 'bg-yellow-50 text-yellow-900 text-sm border border-yellow-200'
                    : 'bg-white text-gray-900 border border-gray-200'
                }`}
              >
                {/* Support sender name */}
                {message.sender_type === 'support' && (
                  <div className="flex items-center gap-1 mb-1">
                    <Headset className="w-3 h-3 text-blue-600" />
                    <p className="text-xs font-semibold text-blue-600">
                      {message.sender_name || 'Support'}
                    </p>
                  </div>
                )}

                {/* User indicator */}
                {message.sender_type === 'user' && (
                  <div className="flex items-center gap-1 mb-1">
                    <User className="w-3 h-3" />
                    <p className="text-xs font-semibold opacity-90">You</p>
                  </div>
                )}

                {/* Image */}
                {message.image_url && (
                  <img
                    src={message.image_url}
                    alt=""
                    className="rounded mb-2 max-w-full"
                  />
                )}

                {/* Content */}
                {message.content && (
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                )}

                {/* Timestamp */}
                <p
                  className={`text-xs mt-1 ${
                    message.sender_type === 'user'
                      ? 'text-blue-100'
                      : message.sender_type === 'system'
                      ? 'text-yellow-700'
                      : 'text-gray-500'
                  }`}
                >
                  {formatTimestamp(message.created_at)}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  )
}

/**
 * Format timestamp for display
 */
function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) {
    return 'Just now'
  } else if (diffMins < 60) {
    return `${diffMins}m ago`
  } else if (diffMins < 1440) {
    const hours = Math.floor(diffMins / 60)
    return `${hours}h ago`
  } else {
    // Format as time
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }
}
