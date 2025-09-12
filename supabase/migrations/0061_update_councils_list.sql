-- Step 1: Clear the existing councils to ensure a clean slate.
TRUNCATE TABLE public.councils RESTART IDENTITY CASCADE;

-- Step 2: Insert the specific list of judicial councils.
INSERT INTO public.councils (name) VALUES
('مجلس قضاء الجزائر'),
('مجلس قضاء سطيف'),
('مجلس قضاء البليدة'),
('مجلس قضاء المدية');