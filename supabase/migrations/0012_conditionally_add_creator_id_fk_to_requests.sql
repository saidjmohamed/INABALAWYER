-- Conditionally add the foreign key constraint to the requests table
-- This ensures the migration can be run multiple times without errors.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'requests_creator_id_fkey' AND conrelid = 'public.requests'::regclass
  ) THEN
    ALTER TABLE public.requests
    ADD CONSTRAINT requests_creator_id_fkey
    FOREIGN KEY (creator_id) REFERENCES public.profiles(id)
    ON DELETE CASCADE;
  END IF;
END;
$$;