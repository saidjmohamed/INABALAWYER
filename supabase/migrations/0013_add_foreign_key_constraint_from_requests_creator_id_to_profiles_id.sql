ALTER TABLE public.requests
ADD CONSTRAINT requests_creator_id_fkey_profiles
FOREIGN KEY (creator_id) REFERENCES public.profiles(id) ON DELETE CASCADE;