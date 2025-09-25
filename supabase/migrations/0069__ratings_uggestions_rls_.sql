-- إنشاء جدول ratings لتقييمات الزوار
CREATE TABLE public.ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- تمكين RLS على ratings
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

-- سياسات RLS للتقييمات (السماح بالقراءة للجميع، الإدراج للجميع)
CREATE POLICY "Public can read ratings" ON public.ratings FOR SELECT USING (true);
CREATE POLICY "Public can insert ratings" ON public.ratings FOR INSERT WITH CHECK (true);

-- إنشاء جدول suggestions للاقتراحات
CREATE TABLE public.suggestions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  suggestion_text TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- تمكين RLS على suggestions
ALTER TABLE public.suggestions ENABLE ROW LEVEL SECURITY;

-- سياسات RLS للاقتراحات (السماح بالقراءة للجميع، الإدراج للجميع)
CREATE POLICY "Public can read suggestions" ON public.suggestions FOR SELECT USING (true);
CREATE POLICY "Public can insert suggestions" ON public.suggestions FOR INSERT WITH CHECK (true);