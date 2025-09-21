-- تحديث إعدادات المصادقة لتحسين الأمان

-- ضمان أن جميع الجداول في المخطط العام تستخدم RLS
DO $$
DECLARE 
  table_name text;
BEGIN
  FOR table_name IN 
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname = 'public'
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);
  END LOOP;
END $$;

-- تحديث سياسات الجداول إذا كانت غير موجودة
-- سياسات لجدول app_settings
DROP POLICY IF EXISTS "app_settings_select_policy" ON public.app_settings;
CREATE POLICY "app_settings_select_policy" ON public.app_settings 
FOR SELECT TO authenticated USING (true);

-- سياسات لجدول chatbot_conversations
DROP POLICY IF EXISTS "chatbot_conversations_policy" ON public.chatbot_conversations;
CREATE POLICY "chatbot_conversations_policy" ON public.chatbot_conversations 
FOR ALL TO authenticated USING (auth.uid() = user_id);

-- سياسات لجدول conversations
DROP POLICY IF EXISTS "conversations_select_policy" ON public.conversations;
CREATE POLICY "conversations_select_policy" ON public.conversations 
FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.participants 
    WHERE conversation_id = id AND user_id = auth.uid()
  )
);

-- سياسات لجدول participants
DROP POLICY IF EXISTS "participants_select_policy" ON public.participants;
CREATE POLICY "participants_select_policy" ON public.participants 
FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.participants p2 
    WHERE p2.conversation_id = participants.conversation_id 
    AND p2.user_id = auth.uid()
  )
);

-- سياسات لجدول messages
DROP POLICY IF EXISTS "messages_select_policy" ON public.messages;
CREATE POLICY "messages_select_policy" ON public.messages 
FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.participants 
    WHERE conversation_id = messages.conversation_id 
    AND user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "messages_insert_policy" ON public.messages;
CREATE POLICY "messages_insert_policy" ON public.messages 
FOR INSERT TO authenticated WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.participants 
    WHERE conversation_id = messages.conversation_id 
    AND user_id = auth.uid()
  ) AND sender_id = auth.uid()
);