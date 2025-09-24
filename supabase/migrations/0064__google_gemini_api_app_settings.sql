INSERT INTO public.app_settings (key, value)
VALUES ('google_gemini_api_key', 'AIzaSyAgWpv8aKP17gOqI43IxZ-1jE0Xkrymrgc')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;