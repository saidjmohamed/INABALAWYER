DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'court_of_appeal' AND enumtypid = 'public.court_level'::regtype) THEN
        ALTER TYPE public.court_level ADD VALUE 'court_of_appeal';
    END IF;
END $$;