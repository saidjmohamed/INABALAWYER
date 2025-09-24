-- التأكد من أن جميع مستويات المحاكم المطلوبة موجودة في النوع المخصص
ALTER TYPE public.court_level ADD VALUE IF NOT EXISTS 'first_instance';
ALTER TYPE public.court_level ADD VALUE IF NOT EXISTS 'appeal';
ALTER TYPE public.court_level ADD VALUE IF NOT EXISTS 'cassation';