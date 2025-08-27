-- Helper function to check if the current user is an admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Create app_settings table
CREATE TABLE public.app_settings (
  key TEXT PRIMARY KEY,
  value TEXT
);

-- Enable RLS
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Policies for app_settings table
-- 1. Allow public read access
CREATE POLICY "Public can read app settings" ON public.app_settings
FOR SELECT USING (true);

-- 2. Allow admins to insert/update/delete settings
CREATE POLICY "Admins can manage app settings" ON public.app_settings
FOR ALL USING (is_admin()) WITH CHECK (is_admin());