-- إزالة الدالة والـ trigger القديمين إذا وجدا
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- إنشاء الدالة الجديدة مع معالجة أفضل للأخطاء وقيم افتراضية
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  user_count INTEGER;
  new_user_role public.user_role;
  initial_status public.user_status;
  meta_data JSONB;
  insert_result public.profiles%ROWTYPE;
BEGIN
  -- استخراج البيانات من raw_user_meta_data
  meta_data := new.raw_user_meta_data;
  
  -- التحقق من عدد المستخدمين لتحديد الدور (الأول admin، الباقي lawyer)
  SELECT count(*) INTO user_count FROM public.profiles;
  
  IF user_count = 0 THEN
    new_user_role := 'admin';
    initial_status := 'active'; -- Admin نشط فورًا
  ELSE
    new_user_role := 'lawyer';
    initial_status := 'active'; -- Lawyers نشطون افتراضيًا
  END IF;

  -- محاولة إدراج البيانات في جدول profiles مع معالجة الأخطاء
  BEGIN
    INSERT INTO public.profiles (
      id, 
      first_name, 
      last_name, 
      phone, 
      address, 
      email, 
      username, 
      status, 
      role, 
      organization,
      updated_at
    ) VALUES (
      new.id,
      COALESCE(meta_data ->> 'first_name', ''),
      COALESCE(meta_data ->> 'last_name', ''),
      COALESCE(meta_data ->> 'phone', null),
      COALESCE(meta_data ->> 'address', null),
      new.email,
      COALESCE(meta_data ->> 'username', null),  -- يمكن أن يكون null إذا لم يُدخل
      initial_status,
      new_user_role,
      COALESCE(meta_data ->> 'organization', null),
      NOW()  -- تعيين التاريخ الحالي لـ updated_at
    ) RETURNING * INTO insert_result;
    
    -- تسجيل نجاح الإدراج (يمكن رؤيته في Supabase logs)
    RAISE NOTICE 'تم إدراج ملف المستخدم الجديد بنجاح: %', new.id;
    
  EXCEPTION
    WHEN OTHERS THEN
      -- تسجيل الخطأ في Supabase logs للتشخيص
      RAISE NOTICE 'خطأ في إدراج ملف المستخدم %: %', new.id, SQLERRM;
      -- لا نرفع خطأ هنا لتجنب فشل التسجيل الأساسي، لكن نستمر
  END;

  RETURN new;
END;
$$;

-- إعادة إنشاء الـ trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();