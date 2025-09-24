-- Insert the Algiers Judicial Council
WITH council_insert AS (
  INSERT INTO public.courts (name, level)
  VALUES ('مجلس قضاء الجزائر', 'council')
  RETURNING id
)
-- Insert the primary courts affiliated with the Algiers Council
INSERT INTO public.courts (name, level, parent_id)
VALUES
  ('محكمة سيدي امحمد', 'court', (SELECT id FROM council_insert)),
  ('محكمة حسين داي', 'court', (SELECT id FROM council_insert)),
  ('محكمة بئر مراد رايس', 'court', (SELECT id FROM council_insert)),
  ('محكمة الحراش', 'court', (SELECT id FROM council_insert)),
  ('محكمة باب الواد', 'court', (SELECT id FROM council_insert)),
  ('محكمة الدار البيضاء', 'court', (SELECT id FROM council_insert)),
  ('محكمة الشراقة', 'court', (SELECT id FROM council_insert)),
  ('محكمة الرويبة', 'court', (SELECT id FROM council_insert));