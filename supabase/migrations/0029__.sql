-- 1. Create conversations table
CREATE TABLE public.conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for conversations
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- 2. Create participants table (linking users to conversations)
CREATE TABLE public.participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (conversation_id, user_id)
);

-- Enable RLS for participants
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;

-- 3. Create messages table
CREATE TABLE public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies for Security

-- Policy: Users can only see conversations they are part of.
CREATE POLICY "Allow access to own conversations" ON public.conversations
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.participants
    WHERE participants.conversation_id = conversations.id
    AND participants.user_id = auth.uid()
  )
);

-- Policy: Users can only see participants of conversations they are in.
CREATE POLICY "Allow access to participants of own conversations" ON public.participants
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.participants AS p
    WHERE p.conversation_id = participants.conversation_id
    AND p.user_id = auth.uid()
  )
);

-- Policy: Users can insert themselves into a conversation.
CREATE POLICY "Allow user to add themselves to a conversation" ON public.participants
FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

-- Policy: Users can only see messages in conversations they are part of.
CREATE POLICY "Allow access to messages in own conversations" ON public.messages
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.participants
    WHERE participants.conversation_id = messages.conversation_id
    AND participants.user_id = auth.uid()
  )
);

-- Policy: Users can only send messages in conversations they are part of.
CREATE POLICY "Allow sending messages in own conversations" ON public.messages
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.participants
    WHERE participants.conversation_id = messages.conversation_id
    AND participants.user_id = auth.uid()
  )
);