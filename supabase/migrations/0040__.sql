-- الخطوة 1: حذف القاعدة الأمنية المعطوبة (ذات التعريف الفارغ) من جدول الطلبات
DROP POLICY IF EXISTS "Allow authenticated users to create requests" ON public.requests;

-- الخطوة 2: حذف أي سياسات إدخال أخرى قد تكون متعارضة كإجراء احترازي
DROP POLICY IF EXISTS "Users can only insert their own requests" ON public.requests;
DROP POLICY IF EXISTS "Users can create their own requests" ON public.requests;

-- الخطوة 3: إنشاء القاعدة الأمنية الجديدة والصحيحة لجدول الطلبات
CREATE POLICY "Users can insert their own requests"
ON public.requests
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = creator_id);

-- الخطوة 4: تطبيق نفس الإصلاح الجذري على جدول الردود
DROP POLICY IF EXISTS "Allow authenticated users to create replies" ON public.replies;
DROP POLICY IF EXISTS "Users can create their own replies" ON public.replies;

-- الخطوة 5: إنشاء القاعدة الأمنية الجديدة والصحيحة لجدول الردود
CREATE POLICY "Users can insert their own replies"
ON public.replies
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = author_id);