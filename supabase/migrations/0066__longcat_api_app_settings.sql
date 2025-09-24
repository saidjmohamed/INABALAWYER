INSERT INTO public.app_settings (key, value)
VALUES ('longcat_api_key', 'ak_1Lc0wm99H5C824a1374344iM0L74w')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;