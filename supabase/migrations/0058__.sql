-- Create a new public storage bucket for app assets like images
INSERT INTO storage.buckets (id, name, public)
VALUES ('app_assets', 'app_assets', true)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies for storage objects in 'app_assets' bucket
-- 1. Allow public read access to all files in the bucket
CREATE POLICY "Public can read app assets" ON storage.objects
FOR SELECT USING (bucket_id = 'app_assets');

-- 2. Allow admins to upload/update/delete files
CREATE POLICY "Admins can manage app assets" ON storage.objects
FOR ALL USING (bucket_id = 'app_assets' AND is_admin())
WITH CHECK (bucket_id = 'app_assets' AND is_admin());