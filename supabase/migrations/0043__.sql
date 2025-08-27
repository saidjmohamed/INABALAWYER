-- الخطوة 1: إزالة القيود الحالية لتجنب أي تضارب أو أخطاء قديمة
ALTER TABLE public.requests DROP CONSTRAINT IF EXISTS requests_creator_id_fkey;
ALTER TABLE public.requests DROP CONSTRAINT IF EXISTS requests_lawyer_id_fkey;

-- الخطوة 2: إعادة تعريف قيد "منشئ الطلب" بشكل واضح مع الحذف المتتالي (CASCADE)
-- هذا يضمن أنه إذا تم حذف ملف المنشئ، يتم حذف طلباته المرتبطة به
ALTER TABLE public.requests
ADD CONSTRAINT requests_creator_id_fkey
FOREIGN KEY (creator_id) REFERENCES public.profiles(id)
ON DELETE CASCADE;

-- الخطوة 3: إعادة تعريف قيد "المحامي المكلف" بشكل محسن مع تعيين القيمة NULL عند الحذف
-- هذا يضمن أنه إذا تم حذف ملف المحامي، فإن الطلب يصبح غير معين بدلاً من حذفه
ALTER TABLE public.requests
ADD CONSTRAINT requests_lawyer_id_fkey
FOREIGN KEY (lawyer_id) REFERENCES public.profiles(id)
ON DELETE SET NULL;