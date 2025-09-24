-- Step 1: Drop the existing check constraint on the 'type' column of the 'courts' table if it exists.
ALTER TABLE public.courts DROP CONSTRAINT IF EXISTS courts_type_check;

-- Step 2: Add a new check constraint with an expanded list of allowed values, including 'تجارية'.
ALTER TABLE public.courts ADD CONSTRAINT courts_type_check CHECK (type IN ('ابتدائية', 'إدارية', 'استئنافية', 'مجلس', 'تجارية'));

-- Step 3: Clear existing data to ensure a clean slate.
TRUNCATE public.courts, public.councils RESTART IDENTITY CASCADE;

-- Step 4: Insert councils.
INSERT INTO public.councils (name) VALUES
('مجلس قضاء الجزائر'),
('مجلس قضاء سطيف'),
('مجلس قضاء البليدة'),
('مجلس قضاء تيبازة'),
('مجلس قضاء بومرداس'),
('مجلس الدولة'),
('المحكمة العليا');

-- Step 5: Insert courts for each council.

-- مجلس قضاء الجزائر
INSERT INTO public.courts (name, council_id, type) VALUES
('محكمة حسين داي', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء الجزائر'), 'ابتدائية'),
('محكمة سيدي امحمد', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء الجزائر'), 'ابتدائية'),
('محكمة باب الوادي', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء الجزائر'), 'ابتدائية'),
('محكمة بئر مراد رايس', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء الجزائر'), 'ابتدائية'),
('محكمة الحراش', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء الجزائر'), 'ابتدائية'),
('محكمة الدار البيضاء', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء الجزائر'), 'ابتدائية'),
('محكمة الرويبة', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء الجزائر'), 'ابتدائية'),
('المحكمة الإدارية للجزائر', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء الجزائر'), 'إدارية'),
('المحكمة التجارية المتخصصة الجزائر', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء الجزائر'), 'تجارية');

-- مجلس قضاء سطيف
INSERT INTO public.courts (name, council_id, type) VALUES
('محكمة سطيف', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء سطيف'), 'ابتدائية'),
('محكمة العلمة', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء سطيف'), 'ابتدائية'),
('محكمة عين ولمان', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء سطيف'), 'ابتدائية'),
('محكمة بوقاعة', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء سطيف'), 'ابتدائية'),
('محكمة عين الكبيرة', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء سطيف'), 'ابتدائية'),
('المحكمة الإدارية سطيف', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء سطيف'), 'إدارية');

-- مجلس قضاء البليدة
INSERT INTO public.courts (name, council_id, type) VALUES
('محكمة البليدة', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء البليدة'), 'ابتدائية'),
('محكمة العفرون', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء البليدة'), 'ابتدائية'),
('محكمة الأربعاء', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء البليدة'), 'ابتدائية'),
('محكمة بوفاريك', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء البليدة'), 'ابتدائية'),
('محكمة موزاية', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء البليدة'), 'ابتدائية'),
('محكمة أولاد يعيش', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء البليدة'), 'ابتدائية'),
('المحكمة الإدارية البليدة', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء البليدة'), 'إدارية');

-- مجلس قضاء تيبازة
INSERT INTO public.courts (name, council_id, type) VALUES
('محكمة تيبازة', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء تيبازة'), 'ابتدائية'),
('محكمة القليعة', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء تيبازة'), 'ابتدائية'),
('محكمة شرشال', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء تيبازة'), 'ابتدائية'),
('محكمة حجوط', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء تيبازة'), 'ابتدائية'),
('المحكمة الإدارية تيبازة', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء تيبازة'), 'إدارية');

-- مجلس قضاء بومرداس
INSERT INTO public.courts (name, council_id, type) VALUES
('محكمة بومرداس', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء بومرداس'), 'ابتدائية'),
('محكمة برج منايل', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء بومرداس'), 'ابتدائية'),
('محكمة دلس', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء بومرداس'), 'ابتدائية'),
('محكمة بودواو', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء بومرداس'), 'ابتدائية'),
('محكمة خميس الخشنة', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء بومرداس'), 'ابتدائية'),
('المحكمة الإدارية بومرداس', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء بومرداس'), 'إدارية');

-- المحاكم العليا
INSERT INTO public.courts (name, council_id, type) VALUES
('مجلس الدولة', (SELECT id FROM public.councils WHERE name = 'مجلس الدولة'), 'مجلس'),
('المحكمة العليا', (SELECT id FROM public.councils WHERE name = 'المحكمة العليا'), 'مجلس');