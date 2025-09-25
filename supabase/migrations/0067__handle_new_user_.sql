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

  -- إدراج البيانات في جدول profiles
  INSERT INTO public.profiles (id, first_name, last_name, phone, address, email, username, status, role, organization)
  VALUES (
    new.id,
    COALESCE(meta_data ->> 'first_name', ''),
    COALESCE(meta_data ->> 'last_name', ''),
    COALESCE(meta_data ->> 'phone', ''),
    COALESCE(meta_data ->> 'address', ''),
    new.email,
    COALESCE(meta_data ->> 'username', ''),
    initial_status,
    new_user_role,
    COALESCE(meta_data ->> 'organization', '')
  );

  RETURN new;
END;
$$;

-- التأكد من أن الـ trigger مفعل
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();