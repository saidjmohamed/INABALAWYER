DO $$
DECLARE
  blida_court_id UUID;
  tipaza_court_id UUID;
BEGIN
  -- Attempt to insert Blida Court of Appeal
  INSERT INTO public.courts (name, level)
  VALUES ('مجلس قضاء البليدة', 'court_of_appeal')
  ON CONFLICT (name) DO NOTHING;
  -- Get its ID regardless of whether it was just inserted or already existed
  SELECT id INTO blida_court_id FROM public.courts WHERE name = 'مجلس قضاء البليدة';

  -- Insert courts under Blida if the parent exists
  IF blida_court_id IS NOT NULL THEN
    INSERT INTO public.courts (name, level, parent_id)
    VALUES
      ('محكمة البليدة', 'tribunal', blida_court_id),
      ('محكمة بوفاريك', 'tribunal', blida_court_id),
      ('محكمة العفرون', 'tribunal', blida_court_id),
      ('محكمة الأربعاء', 'tribunal', blida_court_id),
      ('محكمة موزاية', 'tribunal', blida_court_id),
      ('محكمة أولاد يعيش', 'tribunal', blida_court_id),
      ('محكمة وادي العلايق', 'tribunal', blida_court_id)
    ON CONFLICT (name) DO NOTHING;
  END IF;

  -- Attempt to insert Tipaza Court of Appeal
  INSERT INTO public.courts (name, level)
  VALUES ('مجلس قضاء تيبازة', 'court_of_appeal')
  ON CONFLICT (name) DO NOTHING;
  -- Get its ID
  SELECT id INTO tipaza_court_id FROM public.courts WHERE name = 'مجلس قضاء تيبازة';

  -- Insert courts under Tipaza if the parent exists
  IF tipaza_court_id IS NOT NULL THEN
    INSERT INTO public.courts (name, level, parent_id)
    VALUES
      ('محكمة تيبازة', 'tribunal', tipaza_court_id),
      ('محكمة شرشال', 'tribunal', tipaza_court_id),
      ('محكمة القليعة', 'tribunal', tipaza_court_id),
      ('محكمة حجوط', 'tribunal', tipaza_court_id)
    ON CONFLICT (name) DO NOTHING;
  END IF;
END $$;