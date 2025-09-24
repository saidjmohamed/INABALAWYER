-- Add username column to profiles table if it doesn't exist
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS username TEXT;

-- Make sure the username is always unique
ALTER TABLE public.profiles
ADD CONSTRAINT profiles_username_key UNIQUE (username);

-- Update the function that creates a user profile to include the new username field
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, phone, address, email, username)
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    new.raw_user_meta_data ->> 'phone',
    new.raw_user_meta_data ->> 'address',
    new.email, -- The dummy email will be stored here
    new.raw_user_meta_data ->> 'username'
  );
  RETURN new;
END;
$$;