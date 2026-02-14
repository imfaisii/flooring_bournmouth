# Support Chat System Documentation

A real-time support chat system with Telegram integration, AI bot responses, and human agent escalation.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Features](#features)
4. [Setup Guide](#setup-guide)
5. [Database Schema](#database-schema)
6. [API Endpoints](#api-endpoints)
7. [Telegram Integration](#telegram-integration)
8. [Real-time Updates](#real-time-updates)
9. [Frontend Components](#frontend-components)
10. [Troubleshooting](#troubleshooting)

---

## Overview

The support chat system provides:
- **AI Bot Mode**: Automated responses using AI for common questions
- **Human Agent Mode**: Escalation to human support via Telegram
- **Real-time Updates**: Live message updates using Supabase Realtime
- **Anonymous Support**: Works for both authenticated and anonymous users
- **Image Support**: Users can send images, agents can reply with images

### Flow Diagram

```
User Opens Chat Widget
        │
        ▼
┌───────────────────┐
│  AI Bot Mode      │ ◄── Default mode
│  (Automated)      │
└────────┬──────────┘
         │
         │ User types "talk to agent"
         ▼
┌───────────────────┐
│  Human Agent Mode │
│  (Telegram)       │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐     Webhook      ┌───────────────────┐
│  Message saved    │ ◄──────────────► │  Telegram Bot     │
│  to Database      │                  │  (Admin Chat)     │
└────────┬──────────┘                  └───────────────────┘
         │
         │ Supabase Realtime
         ▼
┌───────────────────┐
│  UI Updates       │
│  Instantly        │
└───────────────────┘
```

---

## Architecture

### Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | React + Zustand (state management) |
| Backend | Next.js API Routes |
| Database | Supabase (PostgreSQL) |
| Real-time | Supabase Realtime (postgres_changes) |
| AI | xAI Grok / OpenAI |
| Messaging | Telegram Bot API |

### Key Files

```
├── app/
│   └── api/
│       ├── support/
│       │   ├── conversations/
│       │   │   ├── route.ts              # List/Create conversations
│       │   │   └── [id]/
│       │   │       ├── route.ts          # Get/Update conversation
│       │   │       └── messages/
│       │   │           └── route.ts      # Get/Send messages
│       │   └── upload/
│       │       └── route.ts              # Image upload
│       └── telegram/
│           └── webhook/
│               └── route.ts              # Telegram webhook handler
├── components/
│   └── support/
│       ├── support-chat-widget.tsx       # Main widget component
│       ├── support-chat-messages.tsx     # Message list
│       └── support-chat-input.tsx        # Input with image upload
├── lib/
│   ├── services/
│   │   ├── telegram-service.ts           # Telegram API integration
│   │   └── support-ai-service.ts         # AI response generation
│   └── supabase/
│       └── services/
│           └── support-service.ts        # Database operations
├── store/
│   └── support-store.ts                  # Zustand store
├── types/
│   └── support.ts                        # TypeScript types
└── supabase/
    └── migrations/
        ├── 018_support_chat_system.sql   # Initial schema
        └── 019_support_anonymous_realtime.sql # RLS for realtime
```

---

## Features

### 1. AI Bot Mode (Default)

When a user opens the chat, they interact with an AI bot that:
- Answers common questions about the product
- Provides helpful information
- Detects when user wants human support

**Trigger phrases for human escalation:**
- "talk to agent"
- "human"
- "real person"
- "support agent"

### 2. Human Agent Mode

After escalation:
- All messages are forwarded to Telegram
- Support team replies via Telegram
- Replies appear in real-time in the chat widget

### 3. Conversation States

| Status | Description |
|--------|-------------|
| `open` | Active conversation |
| `pending` | Waiting for user/agent response |
| `resolved` | Issue resolved |
| `closed` | Conversation closed |

### 4. Modes

| Mode | Description |
|------|-------------|
| `ai_bot` | AI handles responses |
| `human_agent` | Human support via Telegram |

### 5. Start New Ticket

When a conversation is `closed` or `resolved`, the chat input is replaced with a "Start New Ticket" button:

```typescript
if (currentConversation?.status === 'closed' || currentConversation?.status === 'resolved') {
  return (
    <Button onClick={() => useSupportStore.getState().setCurrentConversation(null)}>
      Start New Ticket
    </Button>
  )
}
```

This clears the current conversation and shows the new ticket screen.

### 6. Unread Notification Badge

When new messages arrive from support while the chat widget is closed:
- A red badge appears on the chat button showing the unread count
- The badge shows "9+" for counts above 9
- The count resets to 0 when the widget is opened

---

## Setup Guide

### Prerequisites

1. **Supabase Project** with Realtime enabled
2. **Telegram Bot** created via @BotFather
3. **Environment Variables** configured

### Step 1: Create Telegram Bot

1. Open Telegram and search for `@BotFather`
2. Send `/newbot` and follow instructions
3. Save the bot token (e.g., `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

### Step 2: Get Your Chat ID

1. Start a chat with your new bot
2. Send any message to the bot
3. Visit: `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates`
4. Find your `chat.id` in the response

### Step 3: Environment Variables

```env
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your-bot-token-from-botfather
TELEGRAM_ADMIN_CHAT_ID=your-telegram-chat-id
TELEGRAM_WEBHOOK_SECRET=random-32-character-string

# Site URL (for webhook)
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### Step 4: Database Migration

Run in Supabase SQL Editor:

```sql
-- See supabase/migrations/018_support_chat_system.sql
-- See supabase/migrations/019_support_anonymous_realtime.sql
```

### Step 5: Register Telegram Webhook

```bash
npx tsx scripts/setup-telegram-webhook.ts
```

Or manually via URL:
```
https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://your-domain.com/api/telegram/webhook&secret_token=<WEBHOOK_SECRET>
```

### Step 6: Verify Setup

1. Check webhook status:
   ```
   https://api.telegram.org/bot<TOKEN>/getWebhookInfo
   ```

2. Check endpoint:
   ```
   https://your-domain.com/api/telegram/webhook
   ```

---

## Database Schema

### Tables

#### `support_conversations`

```sql
CREATE TABLE support_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),      -- NULL for anonymous
  anonymous_id VARCHAR(100),                    -- For anonymous users
  telegram_message_id BIGINT,                   -- For reply threading
  mode VARCHAR(20) DEFAULT 'ai_bot',            -- 'ai_bot' | 'human_agent'
  status VARCHAR(20) DEFAULT 'open',            -- 'open' | 'pending' | 'resolved' | 'closed'
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `support_messages`

```sql
CREATE TABLE support_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES support_conversations(id),
  sender_type VARCHAR(20) NOT NULL,             -- 'user' | 'support' | 'bot' | 'system'
  sender_name VARCHAR(100),                     -- Display name
  sender_telegram_id BIGINT,                    -- Telegram user ID
  content TEXT,
  image_url TEXT,
  telegram_message_id BIGINT,                   -- For reply matching
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### RLS Policies

```sql
-- Allow anonymous users to view their conversations
CREATE POLICY "Users can view support conversations"
  ON support_conversations FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Allow anonymous users to view messages
CREATE POLICY "Users can view support messages"
  ON support_messages FOR SELECT
  USING (
    conversation_id IN (
      SELECT id FROM support_conversations
      WHERE user_id = auth.uid() OR user_id IS NULL
    )
  );
```

### Realtime Configuration

```sql
-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE support_messages;

-- Required for filtered subscriptions
ALTER TABLE support_messages REPLICA IDENTITY FULL;
```

---

## API Endpoints

### Conversations

#### `GET /api/support/conversations`
List user's conversations.

Query params:
- `anonymous_id` - For anonymous users

#### `POST /api/support/conversations`
Create new conversation.

Body:
```json
{
  "anonymous_id": "anon_123..." // Optional, for anonymous users
}
```

#### `GET /api/support/conversations/[id]`
Get conversation with messages.

#### `PATCH /api/support/conversations/[id]`
Update conversation status.

Body:
```json
{
  "status": "resolved",
  "anonymous_id": "anon_123..."
}
```

### Messages

#### `GET /api/support/conversations/[id]/messages`
Get messages for conversation.

#### `POST /api/support/conversations/[id]/messages`
Send a message.

Body:
```json
{
  "content": "Hello!",
  "image_url": "https://...", // Optional
  "anonymous_id": "anon_123..."
}
```

### Telegram Webhook

#### `POST /api/telegram/webhook`
Receives updates from Telegram when support replies.

---

## Telegram Integration

### Message Flow: User → Telegram

1. User sends message in chat widget
2. API saves message to database
3. If in `human_agent` mode:
   - `TelegramService.forwardToSupport()` is called
   - Message formatted and sent to admin chat
   - `telegram_message_id` saved for reply threading

### Message Flow: Telegram → User

1. Support replies to message in Telegram
2. Telegram sends webhook to `/api/telegram/webhook`
3. Webhook verifies secret token
4. `TelegramService.handleSupportReply()` processes reply
5. Message saved to database with `sender_type: 'support'`
6. Supabase Realtime notifies client
7. UI updates instantly

### Telegram Service Functions

```typescript
// Forward user message to Telegram
forwardToSupport(conversation, messages, userInfo)

// Forward image to Telegram
forwardImageToSupport(conversation, imageUrl, caption)

// Handle reply from Telegram
handleSupportReply(telegramMessage)

// Notify about status changes
notifyStatusChange(conversation, newStatus)
```

---

## Real-time Updates

### Supabase Realtime Subscription

```typescript
const channel = supabase
  .channel(`support_messages:${conversationId}`)
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'support_messages',
      filter: `conversation_id=eq.${conversationId}`,
    },
    (payload) => {
      const newMessage = payload.new as SupportMessage
      // Add to state
    }
  )
  .subscribe()
```

### Requirements for Realtime to Work

1. **Table added to publication:**
   ```sql
   ALTER PUBLICATION supabase_realtime ADD TABLE support_messages;
   ```

2. **Replica identity set to FULL:**
   ```sql
   ALTER TABLE support_messages REPLICA IDENTITY FULL;
   ```

3. **RLS policies allow SELECT:**
   - Users must be able to SELECT the rows they want to receive updates for

---

## Frontend Components

### Support Store (Zustand)

```typescript
interface SupportState {
  isOpen: boolean
  conversations: SupportConversation[]
  currentConversation: SupportConversation | null
  messages: SupportMessage[]
  isLoading: boolean
  isSending: boolean
  unreadCount: number

  // Actions
  openWidget: () => void
  closeWidget: () => void
  loadConversations: () => Promise<void>
  createConversation: () => Promise<SupportConversation | null>
  sendMessage: (content?: string, imageUrl?: string) => Promise<void>
  subscribeToMessages: (conversationId: string) => () => void
}
```

### Unread Notification Badge

The widget displays an unread count badge when new messages arrive while the chat is closed:

```typescript
// In subscribeToMessages handler
if (newMessage.sender_type !== 'user') {
  if (state.isOpen) {
    // Mark as read if widget is open
    get().markAsRead([newMessage.id])
  } else {
    // Increment unread count if widget is closed
    return {
      messages: [...state.messages, newMessage],
      unreadCount: state.unreadCount + 1,
    }
  }
}
```

The badge is reset when the widget is opened:

```typescript
openWidget: () => {
  set({ isOpen: true, unreadCount: 0 })
  get().loadConversations()
}
```

### Subscription Management

The store prevents duplicate subscriptions and properly cleans up:

```typescript
// Track active subscription to prevent duplicates
let activeSubscription: { conversationId: string; unsubscribe: () => void } | null = null

// In subscribeToMessages:
if (activeSubscription?.conversationId === conversationId) {
  return activeSubscription.unsubscribe  // Already subscribed
}

if (activeSubscription) {
  activeSubscription.unsubscribe()  // Clean up previous
}
```

### Optimistic Updates

Messages appear instantly before server confirmation:

```typescript
// Create optimistic message
const optimisticMessage = {
  id: `temp_${Date.now()}`,
  content: content,
  sender_type: 'user',
  // ...
}

// Add to UI immediately
set({ messages: [...messages, optimisticMessage] })

// Send to server
const response = await fetch(...)

// Replace with real message
set({ messages: serverMessages })
```

---

## Troubleshooting

### Webhook Returns 401 Unauthorized

**Cause:** Secret token mismatch between Telegram and your app.

**Fix:**
1. Check `TELEGRAM_WEBHOOK_SECRET` in Vercel env vars
2. Re-register webhook with matching secret:
   ```bash
   npx tsx scripts/setup-telegram-webhook.ts
   ```

### Messages Not Appearing in Real-time

**Cause:** RLS policies blocking realtime or replica identity not set.

**Fix:**
1. Run the RLS migration:
   ```sql
   -- See 019_support_anonymous_realtime.sql
   ```

2. Check browser console for:
   ```
   [Support:Store] Realtime subscription status: SUBSCRIBED
   ```

### Telegram Not Receiving Messages

**Cause:** Missing env vars or webhook not registered.

**Fix:**
1. Verify env vars are set in Vercel
2. Check webhook info:
   ```
   https://api.telegram.org/bot<TOKEN>/getWebhookInfo
   ```

### Conversation Not Found Error

**Cause:** RLS blocking server-side queries.

**Fix:** Ensure service functions use `getServiceRoleClient()`:
```typescript
const supabase = client || getServiceRoleClient()
```

---

## Implementing in Another Project

### Minimal Setup Checklist

1. **Database:**
   - [ ] Create `support_conversations` table
   - [ ] Create `support_messages` table
   - [ ] Add RLS policies
   - [ ] Enable realtime for messages table
   - [ ] Set replica identity to FULL

2. **Backend:**
   - [ ] Create conversation API routes
   - [ ] Create message API routes
   - [ ] Create Telegram webhook endpoint
   - [ ] Implement TelegramService

3. **Frontend:**
   - [ ] Create Zustand store with realtime subscription
   - [ ] Create chat widget component
   - [ ] Implement optimistic updates

4. **Telegram:**
   - [ ] Create bot via @BotFather
   - [ ] Get admin chat ID
   - [ ] Register webhook
   - [ ] Set environment variables

5. **Environment:**
   - [ ] `TELEGRAM_BOT_TOKEN`
   - [ ] `TELEGRAM_ADMIN_CHAT_ID`
   - [ ] `TELEGRAM_WEBHOOK_SECRET`
   - [ ] `NEXT_PUBLIC_SITE_URL`

---

## Security Considerations

1. **Webhook Verification:** Always verify the `x-telegram-bot-api-secret-token` header
2. **RLS Policies:** Ensure users can only access their own conversations
3. **Anonymous ID:** Store in localStorage, validate server-side
4. **Admin Chat ID:** Verify messages come from authorized admin chat
5. **Service Role:** Use service role client only on server-side
