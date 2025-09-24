-- إصلاح مشاكل الأمان في جداول التطبيق

-- تحديث سياسات الجداول لضمان الأمان
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.councils ENABLE ROW LEVEL SECURITY;

-- إنشاء سياسات آمنة لجدول الملفات الشخصية
DROP POLICY IF EXISTS "_profiles_select_policy" ON public.profiles;
CREATE POLICY "profiles_select_policy" ON public.profiles 
FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
CREATE POLICY "profiles_update_policy" ON public.profiles 
FOR UPDATE TO authenticated USING (auth.uid() = id);

-- إنشاء سياسات آمنة لجدول القضايا
DROP POLICY IF EXISTS "cases_select_policy" ON public.cases;
CREATE POLICY "cases_select_policy" ON public.cases 
FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "cases_insert_policy" ON public.cases;
CREATE POLICY "cases_insert_policy" ON public.cases 
FOR INSERT TO authenticated WITH CHECK (auth.uid() = creator_id);

DROP POLICY IF EXISTS "cases_update_policy" ON public.cases;
CREATE POLICY "cases_update_policy" ON public.cases 
FOR UPDATE TO authenticated USING (auth.uid() = creator_id OR EXISTS (
  SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
));

-- إنشاء سياسات آمنة لجدول الردود
DROP POLICY IF EXISTS "replies_select_policy" ON public.replies;
CREATE POLICY "replies_select_policy" ON public.replies 
FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "replies_insert_policy" ON public.replies;
CREATE POLICY "replies_insert_policy" ON public.replies 
FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "replies_update_policy" ON public.replies;
CREATE POLICY "replies_update_policy" ON public.replies 
FOR UPDATE TO authenticated USING (auth.uid() = author_id OR EXISTS (
  SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
));

-- إنشاء سياسات آمنة للمحاكم
DROP POLICY IF EXISTS "courts_select_policy" ON public.courts;
CREATE POLICY "courts_select_policy" ON public.courts 
FOR SELECT TO authenticated USING (true);

-- إنشاء سياسات آمنة للمجالس
DROP POLICY IF EXISTS "councils_select_policy" ON public.councils;
CREATE POLICY "councils_select_policy" ON public.councils 
FOR SELECT TO authenticated USING (true);

-- تحديث إعدادات المصادقة
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;