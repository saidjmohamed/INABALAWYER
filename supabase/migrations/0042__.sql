-- الخطوة 1: إزالة سياسات الإدخال الحالية لتجنب أي تعارض
DROP POLICY IF EXISTS "Users can insert their own requests" ON public.requests;
DROP POLICY IF EXISTS "Allow authenticated inserts on requests" ON public.requests;

-- الخطوة 2: إنشاء سياسة إدخال مبسطة ومؤقتة لتشخيص المشكلة
-- هذه السياسة تسمح لأي مستخدم مسجل بالإدخال، لتجاوز التحقق المعقد مؤقتًا
CREATE POLICY "Allow authenticated inserts for diagnostics"
ON public.requests
FOR INSERT
TO authenticated
WITH CHECK (true);

-- الخطوة 3: تطبيق نفس الإجراء التشخيصي على جدول الردود
DROP POLICY IF EXISTS "Users can insert their own replies" ON public.replies;
DROP POLICY IF EXISTS "Allow authenticated inserts on replies" ON public.replies;

CREATE POLICY "Allow authenticated reply inserts for diagnostics"
ON public.replies
FOR INSERT
TO authenticated
WITH CHECK (true);

-- الخطوة 4: التأكد من أن الأعمدة الرئيسية لا تقبل قيمًا فارغة
ALTER TABLE public.requests ALTER COLUMN creator_id SET NOT NULL;
ALTER TABLE public.replies ALTER COLUMN author_id SET NOT NULL;