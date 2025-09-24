ALTER TABLE public.requests
ADD COLUMN lawyer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;