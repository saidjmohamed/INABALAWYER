-- Insert default maintenance_mode setting if it doesn't exist
INSERT INTO public.app_settings (key, value)
VALUES ('maintenance_mode', 'false')
ON CONFLICT (key) DO NOTHING;