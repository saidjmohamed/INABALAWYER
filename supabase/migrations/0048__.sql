-- To avoid errors with existing foreign keys, we drop dependent tables first.
DROP TABLE IF EXISTS public.replies;
DROP TABLE IF EXISTS public.requests;

-- Now we can drop the courts table.
DROP TABLE IF EXISTS public.courts;

-- And the enums that are no longer used.
DROP TYPE IF EXISTS public.court_level;
DROP TYPE IF EXISTS public.request_status;
DROP TYPE IF EXISTS public.request_type;

-- Create the new councils table
CREATE TABLE public.councils (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS and set policies for councils
ALTER TABLE public.councils ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view councils" ON public.councils FOR SELECT TO authenticated USING (true);

-- Create the new courts table
CREATE TABLE public.courts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  council_id UUID REFERENCES public.councils(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('ابتدائية','إدارية','استئنافية','مجلس')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS and set policies for courts
ALTER TABLE public.courts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view courts" ON public.courts FOR SELECT TO authenticated USING (true);

-- Create the new cases table
CREATE TABLE public.cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  court_id UUID REFERENCES public.courts(id) ON DELETE SET NULL,
  council_id UUID REFERENCES public.councils(id) ON DELETE SET NULL,
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS and set policies for cases
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all cases" ON public.cases FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert their own cases" ON public.cases FOR INSERT TO authenticated WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Users can update their own cases" ON public.cases FOR UPDATE TO authenticated USING (auth.uid() = creator_id);
CREATE POLICY "Users can delete their own cases" ON public.cases FOR DELETE TO authenticated USING (auth.uid() = creator_id);