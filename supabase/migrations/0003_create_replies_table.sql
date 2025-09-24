-- Create the replies table.
CREATE TABLE public.replies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  request_id UUID NOT NULL REFERENCES public.requests(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for the replies table.
ALTER TABLE public.replies ENABLE ROW LEVEL SECURITY;

-- Define security policies for replies.
CREATE POLICY "Authenticated users can create replies" ON public.replies
FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authenticated users can view replies" ON public.replies
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update their own replies" ON public.replies
FOR UPDATE TO authenticated USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own replies" ON public.replies
FOR DELETE TO authenticated USING (auth.uid() = author_id);