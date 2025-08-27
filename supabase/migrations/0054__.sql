-- Create a new ENUM type for case status
CREATE TYPE public.case_status AS ENUM ('open', 'assigned', 'completed');

-- Add status and assignee_id columns to the cases table
ALTER TABLE public.cases
ADD COLUMN status public.case_status NOT NULL DEFAULT 'open',
ADD COLUMN assignee_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Add RLS policies for the new columns
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
-- Assuming existing policies are sufficient, but if not, we would add/update them here.
-- For now, we'll rely on the existing broad SELECT policy and specific UPDATE/DELETE policies.