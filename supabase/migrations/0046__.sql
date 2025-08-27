-- الخطوة 1: تفريغ الجداول المرتبطة بالكامل لضمان عدم وجود بيانات قديمة
-- سيؤدي هذا إلى حذف جميع الطلبات والردود الحالية بشكل نهائي
TRUNCATE TABLE public.replies RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.requests RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.courts RESTART IDENTITY CASCADE;

-- الخطوة 2: إعادة إدراج بيانات المحاكم بشكل منظم وسليم
DO $$
DECLARE
  algiers_council_id UUID := gen_random_uuid(); -- استخدام UUID ديناميكي لتجنب أي تكرار
BEGIN
  -- إدراج مجلس قضاء الجزائر
  INSERT INTO public.courts (id, name, level, parent_id)
  VALUES (algiers_council_id, 'مجلس قضاء الجزائر', 'appeal', NULL);

  -- إدراج المحاكم التابعة لمجلس قضاء الجزائر
  INSERT INTO public.courts (id, name, level, parent_id)
  VALUES
    (gen_random_uuid(), 'محكمة سيدي امحمد', 'first_instance', algiers_council_id),
    (gen_random_uuid(), 'محكمة حسين داي', 'first_instance', algiers_council_id),
    (gen_random_uuid(), 'محكمة بئر مراد رايس', 'first_instance', algiers_council_id),
    (gen_random_uuid(), 'محكمة باب الواد', 'first_instance', algiers_council_id),
    (gen_random_uuid(), 'محكمة الحراش', 'first_instance', algiers_council_id),
    (gen_random_uuid(), 'محكمة الدار البيضاء', 'first_instance', algiers_council_id),
    (gen_random_uuid(), 'محكمة الرويبة', 'first_instance', algiers_council_id);
END $$;

-- الخطوة 3: التأكد من أن سياسة الأمان على جدول الطلبات صحيحة
-- حذف أي سياسات قديمة قد تكون متعارضة
DROP POLICY IF EXISTS "Users can create their own requests" ON public.requests;
DROP POLICY IF EXISTS "Allow authenticated users to create requests" ON public.requests;

-- إنشاء سياسة جديدة وآمنة تضمن أن منشئ الطلب هو المستخدم الحالي
CREATE POLICY "Users can create their own requests"
ON public.requests
FOR INSERT
TO authenticated
WITH CHECK (creator_id = auth.uid());