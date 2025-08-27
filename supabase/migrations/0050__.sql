-- Tamanrasset
INSERT INTO public.courts (name, council_id, type) VALUES
('محكمة تمنراست', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء تمنراست'), 'ابتدائية'),
('محكمة عين صالح', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء تمنراست'), 'ابتدائية');

-- Tébessa
INSERT INTO public.courts (name, council_id, type) VALUES
('محكمة تبسة', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء تبسة'), 'ابتدائية'),
('محكمة الشريعة', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء تبسة'), 'ابتدائية'),
('محكمة بئر العاتر', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء تبسة'), 'ابتدائية');

-- Tlemcen
INSERT INTO public.courts (name, council_id, type) VALUES
('محكمة تلمسان', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء تلمسان'), 'ابتدائية'),
('محكمة مغنية', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء تلمسان'), 'ابتدائية'),
('محكمة سبدو', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء تلمسان'), 'ابتدائية');

-- Tiaret
INSERT INTO public.courts (name, council_id, type) VALUES
('محكمة تيارت', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء تيارت'), 'ابتدائية'),
('محكمة السوقر', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء تيارت'), 'ابتدائية'),
('محكمة فرندة', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء تيارت'), 'ابتدائية');

-- Tizi Ouzou
INSERT INTO public.courts (name, council_id, type) VALUES
('محكمة تيزي وزو', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء تيزي وزو'), 'ابتدائية'),
('محكمة عزازقة', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء تيزي وزو'), 'ابتدائية'),
('محكمة ذراع الميزان', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء تيزي وزو'), 'ابتدائية');

-- Jijel
INSERT INTO public.courts (name, council_id, type) VALUES
('محكمة جيجل', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء جيجل'), 'ابتدائية'),
('محكمة الطاهير', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء جيجل'), 'ابتدائية');

-- Saïda
INSERT INTO public.courts (name, council_id, type) VALUES
('محكمة سعيدة', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء سعيدة'), 'ابتدائية');

-- Skikda
INSERT INTO public.courts (name, council_id, type) VALUES
('محكمة سكيكدة', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء سكيكدة'), 'ابتدائية'),
('محكمة القل', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء سكيكدة'), 'ابتدائية'),
('محكمة عزابة', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء سكيكدة'), 'ابتدائية');

-- Sidi Bel Abbès
INSERT INTO public.courts (name, council_id, type) VALUES
('محكمة سيدي بلعباس', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء سيدي بلعباس'), 'ابتدائية'),
('محكمة تلاغ', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء سيدي بلعباس'), 'ابتدائية');

-- Annaba
INSERT INTO public.courts (name, council_id, type) VALUES
('محكمة عنابة', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء عنابة'), 'ابتدائية'),
('محكمة الحجار', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء عنابة'), 'ابتدائية');

-- Guelma
INSERT INTO public.courts (name, council_id, type) VALUES
('محكمة قالمة', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء قالمة'), 'ابتدائية');

-- Médéa
INSERT INTO public.courts (name, council_id, type) VALUES
('محكمة المدية', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء المدية'), 'ابتدائية'),
('محكمة قصر البخاري', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء المدية'), 'ابتدائية');

-- Mostaganem
INSERT INTO public.courts (name, council_id, type) VALUES
('محكمة مستغانم', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء مستغانم'), 'ابتدائية');

-- M'Sila
INSERT INTO public.courts (name, council_id, type) VALUES
('محكمة المسيلة', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء المسيلة'), 'ابتدائية'),
('محكمة بوسعادة', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء المسيلة'), 'ابتدائية');

-- Mascara
INSERT INTO public.courts (name, council_id, type) VALUES
('محكمة معسكر', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء معسكر'), 'ابتدائية'),
('محكمة تيغنيف', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء معسكر'), 'ابتدائية');

-- Ouargla
INSERT INTO public.courts (name, council_id, type) VALUES
('محكمة ورقلة', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء ورقلة'), 'ابتدائية'),
('محكمة حاسي مسعود', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء ورقلة'), 'ابتدائية');

-- El Bayadh
INSERT INTO public.courts (name, council_id, type) VALUES
('محكمة البيض', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء البيض'), 'ابتدائية');

-- Illizi
INSERT INTO public.courts (name, council_id, type) VALUES
('محكمة إليزي', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء إليزي'), 'ابتدائية');

-- Bordj Bou Arreridj
INSERT INTO public.courts (name, council_id, type) VALUES
('محكمة برج بوعريريج', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء برج بوعريريج'), 'ابتدائية');

-- Boumerdès
INSERT INTO public.courts (name, council_id, type) VALUES
('محكمة بومرداس', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء بومرداس'), 'ابتدائية'),
('محكمة دلس', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء بومرداس'), 'ابتدائية');

-- El Tarf
INSERT INTO public.courts (name, council_id, type) VALUES
('محكمة الطارف', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء الطارف'), 'ابتدائية');

-- Tindouf
INSERT INTO public.courts (name, council_id, type) VALUES
('محكمة تندوف', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء تندوف'), 'ابتدائية');

-- Tissemsilt
INSERT INTO public.courts (name, council_id, type) VALUES
('محكمة تيسمسيلت', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء تيسمسيلت'), 'ابتدائية');

-- El Oued
INSERT INTO public.courts (name, council_id, type) VALUES
('محكمة الوادي', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء الوادي'), 'ابتدائية');

-- Khenchela
INSERT INTO public.courts (name, council_id, type) VALUES
('محكمة خنشلة', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء خنشلة'), 'ابتدائية');

-- Souk Ahras
INSERT INTO public.courts (name, council_id, type) VALUES
('محكمة سوق أهراس', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء سوق أهراس'), 'ابتدائية');

-- Tipaza
INSERT INTO public.courts (name, council_id, type) VALUES
('محكمة تيبازة', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء تيبازة'), 'ابتدائية'),
('محكمة شرشال', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء تيبازة'), 'ابتدائية');

-- Mila
INSERT INTO public.courts (name, council_id, type) VALUES
('محكمة ميلة', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء ميلة'), 'ابتدائية');

-- Aïn Defla
INSERT INTO public.courts (name, council_id, type) VALUES
('محكمة عين الدفلى', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء عين الدفلى'), 'ابتدائية');

-- Naâma
INSERT INTO public.courts (name, council_id, type) VALUES
('محكمة النعامة', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء النعامة'), 'ابتدائية');

-- Aïn Témouchent
INSERT INTO public.courts (name, council_id, type) VALUES
('محكمة عين تموشنت', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء عين تموشنت'), 'ابتدائية');

-- Ghardaïa
INSERT INTO public.courts (name, council_id, type) VALUES
('محكمة غرداية', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء غرداية'), 'ابتدائية');

-- Relizane
INSERT INTO public.courts (name, council_id, type) VALUES
('محكمة غليزان', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء غليزان'), 'ابتدائية'),
('محكمة وادي ارهيو', (SELECT id FROM public.councils WHERE name = 'مجلس قضاء غليزان'), 'ابتدائية');