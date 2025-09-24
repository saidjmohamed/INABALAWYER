-- إضافة القيمة المفقودة 'information_retrieval' إلى نوع البيانات request_type
-- استخدام IF NOT EXISTS لضمان عدم حدوث خطأ إذا كانت القيمة موجودة بالفعل
ALTER TYPE public.request_type ADD VALUE IF NOT EXISTS 'information_retrieval';