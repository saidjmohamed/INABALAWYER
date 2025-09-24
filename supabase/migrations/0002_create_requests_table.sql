-- Create custom types for request type and status.
CREATE TYPE public.request_type AS ENUM ('info', 'proxy');
CREATE TYPE public.request_status AS ENUM ('open', 'answered', 'completed');

-- Create the requests table.
CREATE TABLE public.requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  court_id UUID NOT NULL REFERENCES public.courts(id) ON DELETE CASCADE,
  type request_type NOT NULL,
  case_number TEXT NOT NULL,
  section TEXT,
  details TEXT,
  status request_status DEFAULT 'open' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for the requests table.
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;

-- Define security policies for requests.
CREATE POLICY "Authenticated users can create requests" ON public.requests
FOR INSERT TO authenticated WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Authenticated users can view requests" ON public.requests
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update their own requests" ON public.requests
FOR UPDATE TO authenticated USING (auth.uid() = creator_id);

CREATE POLICY "Users can delete their own requests" ON public.requests
FOR DELETE TO authenticated USING (auth.uid() = creator_id);