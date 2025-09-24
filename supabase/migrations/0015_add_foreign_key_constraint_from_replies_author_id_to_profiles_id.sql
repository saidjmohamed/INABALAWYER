ALTER TABLE public.replies
ADD CONSTRAINT replies_author_id_fkey_profiles
FOREIGN KEY (author_id) REFERENCES public.profiles(id) ON DELETE CASCADE;