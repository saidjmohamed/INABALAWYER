-- إصلاح مشكلة search_path في الدالة is_admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
    AND status = 'active'
  );
$$;

-- تحديث سياسات RLS للجداول لمنع الوصول للمستخدمين المجهولين

-- 1. جدول app_settings
DROP POLICY IF EXISTS "Public can read app settings" ON app_settings;
CREATE POLICY "Only authenticated users can read app settings"
ON app_settings FOR SELECT
TO authenticated
USING (true);

-- 2. جدول cases
DROP POLICY IF EXISTS "Users can view all cases" ON cases;
CREATE POLICY "Only authenticated users can view cases"
ON cases FOR SELECT
TO authenticated
USING (true);

-- 3. جدول chatbot_conversations
DROP POLICY IF EXISTS "Users can manage their own chat messages" ON chatbot_conversations;
CREATE POLICY "Only authenticated users can manage their chat messages"
ON chatbot_conversations FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 4. جدول conversations
DROP POLICY IF EXISTS "Allow access to own conversations" ON conversations;
CREATE POLICY "Only authenticated users can access their conversations"
ON conversations FOR ALL
TO authenticated
USING (EXISTS (
  SELECT 1 FROM participants 
  WHERE participants.conversation_id = conversations.id 
  AND participants.user_id = auth.uid()
));

-- 5. جدول councils
DROP POLICY IF EXISTS "Authenticated users can view councils" ON councils;
CREATE POLICY "Only authenticated users can view councils"
ON councils FOR SELECT
TO authenticated
USING (true);

-- 6. جدول courts
DROP POLICY IF EXISTS "Authenticated users can view courts" ON courts;
CREATE POLICY "Only authenticated users can view courts"
ON courts FOR SELECT
TO authenticated
USING (true);

-- 7. جدول faq
DROP POLICY IF EXISTS "Authenticated users can read FAQs" ON faq;
CREATE POLICY "Only authenticated users can read FAQs"
ON faq FOR SELECT
TO authenticated
USING (true);

-- 8. جدول messages
DROP POLICY IF EXISTS "Allow access to messages in own conversations" ON messages;
CREATE POLICY "Only authenticated users can access messages in their conversations"
ON messages FOR ALL
TO authenticated
USING (EXISTS (
  SELECT 1 FROM participants p
  JOIN conversations c ON c.id = p.conversation_id
  WHERE p.conversation_id = messages.conversation_id
  AND p.user_id = auth.uid()
));

-- 9. جدول participants
DROP POLICY IF EXISTS "Users can view participants of their own conversations" ON participants;
CREATE POLICY "Only authenticated users can view participants of their conversations"
ON participants FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM participants p2
  WHERE p2.conversation_id = participants.conversation_id
  AND p2.user_id = auth.uid()
));

-- 10. جدول profiles
DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON profiles;
CREATE POLICY "Only authenticated users can view profiles"
ON profiles FOR SELECT
TO authenticated
USING (true);

-- 11. جدول replies
DROP POLICY IF EXISTS "Public can read all replies" ON replies;
CREATE POLICY "Only authenticated users can read replies"
ON replies FOR SELECT
TO authenticated
USING (true);

-- 12. جدول realtime.messages (إذا كان موجودًا)
DROP POLICY IF EXISTS "Allow access to messages in own conversations" ON realtime.messages;
CREATE POLICY "Only authenticated users can access messages in their conversations"
ON realtime.messages FOR ALL
TO authenticated
USING (EXISTS (
  SELECT 1 FROM participants p
  JOIN conversations c ON c.id = p.conversation_id
  WHERE p.conversation_id = realtime.messages.conversation_id
  AND p.user_id = auth.uid()
));

-- 13. جدول storage.objects
DROP POLICY IF EXISTS "Public can read app assets" ON storage.objects;
CREATE POLICY "Only authenticated users can read app assets"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'app_assets');

-- إضافة سياسة للتحميل للمستخدمين المصادقين فقط
CREATE POLICY "Only authenticated users can upload app assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'app_assets');

-- إضافة سياسة للتحديث للمستخدمين المصادقين فقط
CREATE POLICY "Only authenticated users can update app assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'app_assets');

-- إضافة سياسة للحذف للمستخدمين المصادقين فقط
CREATE POLICY "Only authenticated users can delete app assets"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'app_assets');