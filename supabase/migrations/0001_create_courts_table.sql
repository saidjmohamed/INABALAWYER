-- Create a custom type for court levels.
CREATE TYPE public.court_level AS ENUM ('council', 'court');

-- Create the courts table.
CREATE TABLE public.courts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  level court_level NOT NULL,
  parent_id UUID REFERENCES public.courts(id) ON DELETE CASCADE
);

-- Enable RLS for the courts table.
ALTER TABLE public.courts ENABLE ROW LEVEL SECURITY;

-- Allow any authenticated user to read the list of courts.
CREATE POLICY "Authenticated users can view courts" ON public.courts
FOR SELECT TO authenticated USING (true);