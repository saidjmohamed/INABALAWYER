-- الخطوة 1: حذف السياسة الخاطئة التي كانت تمنع عمليات الإضافة
DROP POLICY "Authenticated users can create requests" ON public.requests;

-- الخطوة 2: إنشاء سياسة جديدة وصحيحة تسمح للمستخدمين المسجلين بإنشاء طلباتهم الخاصة
CREATE POLICY "Users can create their own requests"
ON public.requests
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = creator_id);