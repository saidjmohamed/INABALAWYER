-- Drop the existing 'parties' column from the 'cases' table.
ALTER TABLE public.cases DROP COLUMN IF EXISTS parties;

-- Add new columns for plaintiff, defendant, and legal representative.
ALTER TABLE public.cases
ADD COLUMN plaintiff TEXT,
ADD COLUMN defendant TEXT,
ADD COLUMN legal_representative TEXT;