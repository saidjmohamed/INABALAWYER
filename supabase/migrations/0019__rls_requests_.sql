-- حذف سياسة التحديث الحالية
DROP POLICY IF EXISTS "Users can update their own requests" ON public.requests;

-- إنشاء سياسة تحديث جديدة للطلبات
CREATE POLICY "Allow creators, assigned lawyers, and admins to update requests" ON public.requests
FOR UPDATE TO authenticated
USING (
  (auth.uid() = creator_id) OR -- يمكن للمنشئ تحديث طلبه الخاص
  (auth.uid() = lawyer_id) OR -- يمكن للمحامي المعين تحديث الطلب
  (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')) -- يمكن للمشرفين تحديث أي طلب
);