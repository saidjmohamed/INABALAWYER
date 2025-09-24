-- Create custom types for user status and role for better data integrity.
CREATE TYPE public.user_status AS ENUM ('pending', 'active', 'rejected', 'disabled');
CREATE TYPE public.user_role AS ENUM ('lawyer', 'admin');

-- Create the profiles table to store user-specific information.
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  address TEXT,
  status user_status DEFAULT 'pending' NOT NULL,
  role user_role DEFAULT 'lawyer' NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Enable Row Level Security (RLS) for the profiles table.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies to ensure users can only access and manage their own profile.
CREATE POLICY "Users can view their own profile" ON public.profiles
FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE TO authenticated USING (auth.uid() = id);

-- This function automatically creates a profile entry when a new user signs up.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, phone, address)
  VALUES (
    new.id, 
    new.raw_user_meta_data ->> 'first_name', 
    new.raw_user_meta_data ->> 'last_name',
    new.raw_user_meta_data ->> 'phone',
    new.raw_user_meta_data ->> 'address'
  );
  RETURN new;
END;
$$;

-- Trigger the function after a new user is created in the auth.users table.
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();