ALTER TABLE public.courts
ADD CONSTRAINT unique_court_name UNIQUE (name);