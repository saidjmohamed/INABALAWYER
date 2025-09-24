CREATE OR REPLACE FUNCTION public.delete_conversation(p_conversation_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Security check: ensure the current user is a participant
  IF NOT (public.is_participant(p_conversation_id, auth.uid())) THEN
    RAISE EXCEPTION 'Permission denied: You are not a participant of this conversation.';
  END IF;

  -- Delete associated messages
  DELETE FROM public.messages WHERE conversation_id = p_conversation_id;

  -- Delete associated participants
  DELETE FROM public.participants WHERE conversation_id = p_conversation_id;

  -- Delete the conversation
  DELETE FROM public.conversations WHERE id = p_conversation_id;
END;
$$;