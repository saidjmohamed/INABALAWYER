INSERT INTO public.app_settings (key, value)
VALUES ('google_gemini_api_key', 'YOUR_ACTUAL_GEMINI_API_KEY_HERE')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;