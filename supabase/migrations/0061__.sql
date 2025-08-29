-- Create table for FAQ
CREATE TABLE public.faq (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL UNIQUE,
  answer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.faq ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Authenticated users can read all FAQs
CREATE POLICY "Authenticated users can read FAQs"
ON public.faq FOR SELECT
TO authenticated
USING (true);

-- RLS Policies: Admins can manage all FAQs
CREATE POLICY "Admins can manage FAQs"
ON public.faq FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Seed initial FAQ data
INSERT INTO public.faq (question, answer) VALUES
('ما هو تطبيق إنابة ومعلومة؟', 'هو منصة إلكترونية لخدمة المحامين، تهدف إلى تنظيم الإنابات وتسهيل تبادل المعلومات المتعلقة بالقضايا.'),
('كيف يمكنني إيداع طلب جديد؟', 'يمكنك إيداع طلب جديد من خلال الضغط على زر "إيداع طلب جديد" في الصفحة الرئيسية وملء النموذج بالمعلومات المطلوبة.'),
('هل يمكنني التواصل مع محامٍ آخر بشكل خاص؟', 'نعم، يمكنك تصفح "دليل المحامين" وبدء محادثة خاصة مع أي محامٍ مسجل في المنصة.'),
('كيف أجد القضايا المتعلقة بمحكمة معينة؟', 'اذهب إلى قسم "الجهات القضائية"، ثم اختر المجلس أو المحكمة التي تريدها لعرض جميع الطلبات المتعلقة بها.');