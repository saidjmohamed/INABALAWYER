-- الخطوة 1: إزالة السياسة القديمة التي كانت تمنع عمليات الإضافة
DROP POLICY IF EXISTS "Allow authenticated inserts for diagnostics" ON public.requests;

-- الخطوة 2: إنشاء سياسة جديدة وصحيحة تسمح للمستخدمين المسجلين بإنشاء طلباتهم الخاصة
CREATE POLICY "Authenticated users can create requests"
ON public.requests
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = creator_id);