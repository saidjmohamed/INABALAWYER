-- Add email column to the profiles table
ALTER TABLE public.profiles
ADD COLUMN email TEXT;

-- Update the handle_new_user function to include the email from the new user's data
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, phone, address, email)
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    new.raw_user_meta_data ->> 'phone',
    new.raw_user_meta_data ->> 'address',
    new.email -- Include the email from the auth.users table
  );
  RETURN new;
END;
$$;