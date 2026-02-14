'use client'

// =====================================================
// Support Chat Widget - Main Component
// =====================================================

import { useEffect, useState } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { useSupportStore } from '@/store/support-store'
import { getOrCreateAnonymousId } from '@/lib/utils/anonymous-id'
import SupportChatMessages from './support-chat-messages'
import SupportChatInput from './support-chat-input'

/**
 * Support Chat Widget
 * Floating button with chat modal for anonymous support
 */
export default function SupportChatWidget() {
  const { isOpen, unreadCount, openWidget, closeWidget } = useSupportStore()
  const [anonymousId, setAnonymousId] = useState<string>('')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // Set client flag for hydration
    setIsClient(true)

    // Get or create anonymous ID
    try {
      const id = getOrCreateAnonymousId()
      setAnonymousId(id)
      console.log('[Support:Widget] Anonymous ID:', id)
    } catch (error) {
      console.error('[Support:Widget] Failed to get anonymous ID:', error)
    }
  }, [])

  if (!isClient) {
    // Prevent hydration mismatch
    return null
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => {
          openWidget()
          useSupportStore.getState().resetUnreadCount()
        }}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50 group"
        aria-label="Open support chat"
      >
        <MessageCircle className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
        <span className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Need help?
        </span>
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 z-40 md:hidden"
            onClick={closeWidget}
          />

          {/* Chat Container */}
          <div className="fixed bottom-6 right-6 w-full max-w-md md:w-96 h-[600px] max-h-[calc(100vh-3rem)] bg-white rounded-lg shadow-2xl flex flex-col z-50 mx-4 md:mx-0">
            {/* Header */}
            <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">Support Chat</h3>
                <p className="text-xs text-blue-100">We're here to help</p>
              </div>
              <button
                onClick={closeWidget}
                className="p-1 hover:bg-blue-700 rounded transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <SupportChatMessages />

            {/* Input */}
            <SupportChatInput anonymousId={anonymousId} />
          </div>
        </>
      )}
    </>
  )
}
