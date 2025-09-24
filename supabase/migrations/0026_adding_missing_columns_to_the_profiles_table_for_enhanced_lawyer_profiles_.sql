ALTER TABLE public.profiles
ADD COLUMN specialties TEXT[],
ADD COLUMN experience_years INTEGER,
ADD COLUMN languages TEXT[],
ADD COLUMN bio TEXT,
ADD COLUMN avatar_url TEXT;