-- Drop existing policies that will be replaced
DROP POLICY IF EXISTS "Allow access to participants of own conversations" ON public.participants;
DROP POLICY IF EXISTS "Allow user to add themselves to a conversation" ON public.participants;
DROP POLICY IF EXISTS "Conversations can only be created via server-side logic" ON public.conversations;

-- Create a helper function to safely check if a user is in a conversation.
-- This function uses SECURITY DEFINER to bypass RLS and prevent infinite recursion.
DROP FUNCTION IF EXISTS public.is_participant(uuid, uuid);
CREATE OR REPLACE FUNCTION public.is_participant(p_conversation_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.participants
    WHERE conversation_id = p_conversation_id AND user_id = p_user_id
  );
$$;

-- Create a new, secure SELECT policy for participants using the helper function
CREATE POLICY "Users can view participants of their own conversations" ON public.participants
FOR SELECT
USING ( public.is_participant(conversation_id, auth.uid()) );

-- Create restrictive INSERT policies to ensure conversations are created via server logic
CREATE POLICY "Participants can only be added via server-side logic" ON public.participants
FOR INSERT
WITH CHECK (false);

CREATE POLICY "Conversations can only be created via server-side logic" ON public.conversations
FOR INSERT
WITH CHECK (false);

-- Create a secure function (RPC) to start a new conversation
DROP FUNCTION IF EXISTS public.start_conversation(uuid);
CREATE OR REPLACE FUNCTION public.start_conversation(other_user_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  existing_conversation_id uuid;
  new_conversation_id uuid;
  current_user_id uuid := auth.uid();
BEGIN
  -- Prevent creating a conversation with oneself
  IF current_user_id = other_user_id THEN
    RAISE EXCEPTION 'Cannot start a conversation with yourself.';
  END IF;

  -- Check for an existing conversation between the two users
  SELECT p1.conversation_id INTO existing_conversation_id
  FROM public.participants p1
  JOIN public.participants p2 ON p1.conversation_id = p2.conversation_id
  WHERE p1.user_id = current_user_id AND p2.user_id = other_user_id
  LIMIT 1;

  -- If a conversation already exists, return its ID
  IF existing_conversation_id IS NOT NULL THEN
    RETURN existing_conversation_id;
  END IF;

  -- If not, create a new conversation
  INSERT INTO public.conversations (id) VALUES (gen_random_uuid())
  RETURNING id INTO new_conversation_id;

  -- Add both users as participants
  INSERT INTO public.participants (conversation_id, user_id)
  VALUES (new_conversation_id, current_user_id), (new_conversation_id, other_user_id);

  RETURN new_conversation_id;
END;
$$;