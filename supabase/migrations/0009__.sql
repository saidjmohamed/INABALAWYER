-- تفعيل جميع المستخدمين المعلقين حاليًا
UPDATE public.profiles
SET status = 'active'
WHERE status = 'pending';

-- إذا كان هناك مستخدم واحد فقط في النظام، فامنحه دور المسؤول
DO $$
DECLARE
    user_count INTEGER;
BEGIN
    SELECT count(*) INTO user_count FROM public.profiles;
    IF user_count = 1 THEN
        UPDATE public.profiles
        SET role = 'admin';
    END IF;
END $$;


-- إعادة تعريف الدالة لتفعيل المستخدمين الجدد تلقائيًا وتعيين المستخدم الأول كمسؤول
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  user_count INTEGER;
  new_user_role public.user_role;
BEGIN
  -- التحقق مما إذا كان هناك أي مستخدم في جدول public.profiles قبل هذا الإدراج
  SELECT count(*) INTO user_count FROM public.profiles;

  -- إذا لم يكن هناك مستخدمون، فهذا هو المستخدم الأول، اجعله مسؤولاً
  IF user_count = 0 THEN
    new_user_role := 'admin';
  ELSE
    new_user_role := 'lawyer';
  END IF;

  INSERT INTO public.profiles (id, first_name, last_name, phone, address, email, username, status, role)
  VALUES (
    new.id, 
    new.raw_user_meta_data ->> 'first_name', 
    new.raw_user_meta_data ->> 'last_name',
    new.raw_user_meta_data ->> 'phone',
    new.raw_user_meta_data ->> 'address',
    new.email,
    new.raw_user_meta_data ->> 'username',
    'active', -- تعيين الحالة إلى "نشط" افتراضيًا
    new_user_role -- تعيين الدور بناءً على المنطق
  );
  RETURN new;
END;
$$;

-- إعادة إنشاء المشغل لاستخدام الدالة الجديدة
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();