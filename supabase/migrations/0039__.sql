-- الخطوة 1: حذف القاعدة الأمنية المعطوبة الخاصة بإنشاء الطلبات
DROP POLICY IF EXISTS "Users can only insert their own requests" ON public.requests;
DROP POLICY IF EXISTS "Users can create their own requests" ON public.requests;

-- الخطوة 2: إنشاء قاعدة أمنية جديدة وصحيحة للسماح للمستخدمين بإنشاء طلباتهم الخاصة
CREATE POLICY "Allow authenticated users to create requests"
ON public.requests
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = creator_id);

-- الخطوة 3: حذف القاعدة الأمنية المعطوبة الخاصة بإنشاء الردود (إجراء وقائي)
DROP POLICY IF EXISTS "Users can create their own replies" ON public.replies;

-- الخطوة 4: إنشاء قاعدة أمنية جديدة وصحيحة للسماح للمستخدمين بإنشاء ردودهم الخاصة
CREATE POLICY "Allow authenticated users to create replies"
ON public.replies
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = author_id);