-- Step 1: Drop the existing check constraint on the 'type' column of the 'courts' table.
-- This is necessary because we cannot modify a check constraint directly.
ALTER TABLE public.courts DROP CONSTRAINT courts_type_check;

-- Step 2: Add a new check constraint with an expanded list of allowed values.
-- We are adding 'تجارية' to the list of valid court types.
ALTER TABLE public.courts ADD CONSTRAINT courts_type_check CHECK (type IN ('ابتدائية', 'إدارية', 'استئنافية', 'مجلس', 'تجارية'));

-- Step 3: Now that the table schema is updated, re-run the data seeding process.
-- First, clear any partial data from the previous failed attempt.
TRUNCATE public.courts, public.councils RESTART IDENTITY CASCADE;

-- Insert the list of councils.
INSERT INTO public.councils (name) VALUES
('مجلس قضاء الجزائر'),
('مجلس قضاء سطيف'),
('مجلس قضاء البليدة'),
('مجلس قضاء تيبازة'),
('مجلس قضاء بومرداس'),
('مجلس الدولة'),
('المحكمة العليا');

-- Insert courts for "مجلس قضاء الجزائر"
INSERT INTO public.courts (name, council_id, type) VALUES
('المحكمة الابتدائية الجزائر', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء الجزائر'), 'ابتدائية'),
('المحكمة الإدارية الجزائر', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء الجزائر'), 'إدارية'),
('المحكمة الاستئنافية الجزائر', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء الجزائر'), 'استئنافية'),
('المحكمة التجارية الجزائر', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء الجزائر'), 'تجارية'),
('المحكمة التجارية الاستئنافية الجزائر', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء الجزائر'), 'استئنافية');

-- Insert courts for "مجلس قضاء سطيف"
INSERT INTO public.courts (name, council_id, type) VALUES
('المحكمة الابتدائية سطيف', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء سطيف'), 'ابتدائية'),
('المحكمة الابتدائية عين الكبيرة', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء سطيف'), 'ابتدائية'),
('المحكمة الابتدائية عين ولمان', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء سطيف'), 'ابتدائية'),
('المحكمة الإدارية سطيف', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء سطيف'), 'إدارية'),
('المحكمة الاستئنافية سطيف', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء سطيف'), 'استئنافية'),
('المحكمة التجارية سطيف', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء سطيف'), 'تجارية'),
('المحكمة التجارية الاستئنافية سطيف', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء سطيف'), 'استئنافية');

-- Insert courts for "مجلس قضاء البليدة"
INSERT INTO public.courts (name, council_id, type) VALUES
('المحكمة الابتدائية البليدة', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء البليدة'), 'ابتدائية'),
('المحكمة الابتدائية بوفاريك', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء البليدة'), 'ابتدائية'),
('المحكمة الإدارية البليدة', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء البليدة'), 'إدارية'),
('المحكمة الاستئنافية البليدة', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء البليدة'), 'استئنافية'),
('المحكمة التجارية البليدة', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء البليدة'), 'تجارية'),
('المحكمة التجارية الاستئنافية البليدة', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء البليدة'), 'استئنافية');

-- Insert courts for "مجلس قضاء تيبازة"
INSERT INTO public.courts (name, council_id, type) VALUES
('المحكمة الابتدائية تيبازة', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء تيبازة'), 'ابتدائية'),
('المحكمة الابتدائية حجوط', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء تيبازة'), 'ابتدائية'),
('المحكمة الإدارية تيبازة', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء تيبازة'), 'إدارية'),
('المحكمة الاستئنافية تيبازة', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء تيبازة'), 'استئنافية'),
('المحكمة التجارية تيبازة', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء تيبازة'), 'تجارية'),
('المحكمة التجارية الاستئنافية تيبازة', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء تيبازة'), 'استئنافية');

-- Insert courts for "مجلس قضاء بومرداس"
INSERT INTO public.courts (name, council_id, type) VALUES
('المحكمة الابتدائية بومرداس', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء بومرداس'), 'ابتدائية'),
('المحكمة الابتدائية برج منايل', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء بومرداس'), 'ابتدائية'),
('المحكمة الإدارية بومرداس', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء بومرداس'), 'إدارية'),
('المحكمة الاستئنافية بومرداس', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء بومرداس'), 'استئنافية'),
('المحكمة التجارية بومرداس', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء بومرداس'), 'تجارية'),
('المحكمة التجارية الاستئنافية بومرداس', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء بومرداس'), 'استئنافية');

-- Insert high courts
INSERT INTO public.courts (name, council_id, type) VALUES
('مجلس الدولة', (SELECT id FROM public.councils WHERE name = 'مجلس الدولة'), 'مجلس'),
('المحكمة العليا', (SELECT id FROM public.councils WHERE name = 'المحكمة العليا'), 'مجلس');