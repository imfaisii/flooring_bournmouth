-- =====================================================
-- Support Chat System with Telegram Forum Topics
-- =====================================================

-- Support conversations table
CREATE TABLE IF NOT EXISTS support_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  anonymous_id VARCHAR(100),

  -- CRITICAL: message_thread_id for Telegram Forum Topic (not message_id)
  message_thread_id BIGINT UNIQUE,

  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'closed')),
  initial_message TEXT,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Support messages table
CREATE TABLE IF NOT EXISTS support_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES support_conversations(id) ON DELETE CASCADE,
  sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('user', 'support', 'system')),
  sender_name VARCHAR(100),
  sender_telegram_id BIGINT,
  content TEXT,
  image_url TEXT,
  telegram_message_id BIGINT,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- Indexes for Performance
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_conversations_anonymous_id ON support_conversations(anonymous_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON support_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_thread_id ON support_conversations(message_thread_id);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON support_conversations(status);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message ON support_conversations(last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON support_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON support_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_telegram_id ON support_messages(telegram_message_id);

-- =====================================================
-- Row Level Security (RLS) Policies
-- =====================================================

ALTER TABLE support_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;

-- Conversations: Users can view their own (authenticated or anonymous)
CREATE POLICY "Users can view their conversations"
  ON support_conversations FOR SELECT
  USING (
    auth.uid() = user_id OR user_id IS NULL
  );

CREATE POLICY "Users can create conversations"
  ON support_conversations FOR INSERT
  WITH CHECK (
    auth.uid() = user_id OR user_id IS NULL
  );

CREATE POLICY "Users can update their conversations"
  ON support_conversations FOR UPDATE
  USING (
    auth.uid() = user_id OR user_id IS NULL
  );

-- Messages: Users can view messages in their conversations
CREATE POLICY "Users can view messages in their conversations"
  ON support_messages FOR SELECT
  USING (
    conversation_id IN (
      SELECT id FROM support_conversations
      WHERE user_id = auth.uid() OR user_id IS NULL
    )
  );

CREATE POLICY "Users can create messages in their conversations"
  ON support_messages FOR INSERT
  WITH CHECK (
    conversation_id IN (
      SELECT id FROM support_conversations
      WHERE user_id = auth.uid() OR user_id IS NULL
    )
  );

-- =====================================================
-- Realtime Configuration
-- =====================================================

-- Enable realtime for messages table
ALTER PUBLICATION supabase_realtime ADD TABLE support_messages;

-- Set replica identity to FULL for filtered subscriptions
ALTER TABLE support_messages REPLICA IDENTITY FULL;

-- Optional: Enable realtime for conversation status updates
ALTER PUBLICATION supabase_realtime ADD TABLE support_conversations;
ALTER TABLE support_conversations REPLICA IDENTITY FULL;

-- =====================================================
-- Database Functions and Triggers
-- =====================================================

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-update updated_at on conversation changes
CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON support_conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to update last_message_at when new messages arrive
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE support_conversations
  SET last_message_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Update last_message_at on new messages
CREATE TRIGGER update_last_message_timestamp
  AFTER INSERT ON support_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_last_message();

-- =====================================================
-- Comments for Documentation
-- =====================================================

COMMENT ON TABLE support_conversations IS 'Support chat conversations with Telegram Forum Topics integration';
COMMENT ON COLUMN support_conversations.message_thread_id IS 'Telegram Forum Topic ID (returned by createForumTopic API)';
COMMENT ON COLUMN support_conversations.anonymous_id IS 'Client-generated ID stored in localStorage for anonymous users';
COMMENT ON COLUMN support_conversations.status IS 'Conversation status: open, resolved, or closed';

COMMENT ON TABLE support_messages IS 'Individual messages in support conversations';
COMMENT ON COLUMN support_messages.sender_type IS 'Message sender: user, support, or system';
COMMENT ON COLUMN support_messages.telegram_message_id IS 'Individual Telegram message ID within the topic';
