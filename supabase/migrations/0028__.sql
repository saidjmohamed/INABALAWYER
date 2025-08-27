CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  user_count INTEGER;
  new_user_role public.user_role;
  initial_status public.user_status;
BEGIN
  -- Check if there are any users in the public.profiles table before this insertion
  SELECT count(*) INTO user_count FROM public.profiles;

  -- If there are no users, this is the first user, make them an admin
  IF user_count = 0 THEN
    new_user_role := 'admin';
    initial_status := 'active'; -- Admin is active immediately
  ELSE
    new_user_role := 'lawyer';
    initial_status := 'active'; -- Lawyers are now active by default
  END IF;

  INSERT INTO public.profiles (id, first_name, last_name, phone, address, email, username, status, role, organization)
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    new.raw_user_meta_data ->> 'phone',
    new.raw_user_meta_data ->> 'address',
    new.email,
    new.raw_user_meta_data ->> 'username',
    initial_status, -- Use the determined initial status
    new_user_role, -- Set the role based on the logic
    new.raw_user_meta_data ->> 'organization' -- Add organization
  );
  RETURN new;
END;
$$;