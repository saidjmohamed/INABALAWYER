DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'tribunal' AND enumtypid = 'public.court_level'::regtype) THEN
        ALTER TYPE public.court_level ADD VALUE 'tribunal';
    END IF;
END $$;