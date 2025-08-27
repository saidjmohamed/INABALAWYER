-- First, create the ENUM type for the request type if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'request_type') THEN
        CREATE TYPE public.request_type AS ENUM ('representation', 'information_retrieval');
    END IF;
END$$;

-- Add new columns to the cases table to store request-specific details
ALTER TABLE public.cases
ADD COLUMN IF NOT EXISTS request_type public.request_type,
ADD COLUMN IF NOT EXISTS case_number TEXT,
ADD COLUMN IF NOT EXISTS parties TEXT,
ADD COLUMN IF NOT EXISTS session_date TIMESTAMP WITH TIME ZONE;