-- Create replies table
CREATE TABLE public.replies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (REQUIRED for security)
ALTER TABLE public.replies ENABLE ROW LEVEL SECURITY;

-- Create policies for each operation
CREATE POLICY "Public can read all replies" ON public.replies
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can insert their own replies" ON public.replies
FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own replies" ON public.replies
FOR UPDATE TO authenticated USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own replies" ON public.replies
FOR DELETE TO authenticated USING (auth.uid() = author_id);