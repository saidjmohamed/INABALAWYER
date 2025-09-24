-- الخطوة 1: إعادة بناء الرابط بين الطلبات والمحاكم
ALTER TABLE public.requests DROP CONSTRAINT IF EXISTS requests_court_id_fkey;
ALTER TABLE public.requests
ADD CONSTRAINT requests_court_id_fkey
FOREIGN KEY (court_id) REFERENCES public.courts(id)
ON DELETE CASCADE;

-- الخطوة 2: إعادة بناء الرابط بين الطلبات ومنشئ الطلب (المحامي)
ALTER TABLE public.requests DROP CONSTRAINT IF EXISTS requests_creator_id_fkey;
ALTER TABLE public.requests
ADD CONSTRAINT requests_creator_id_fkey
FOREIGN KEY (creator_id) REFERENCES public.profiles(id)
ON DELETE CASCADE;

-- الخطوة 3: إعادة بناء الرابط بين الردود والطلب الأصلي
ALTER TABLE public.replies DROP CONSTRAINT IF EXISTS replies_request_id_fkey;
ALTER TABLE public.replies
ADD CONSTRAINT replies_request_id_fkey
FOREIGN KEY (request_id) REFERENCES public.requests(id)
ON DELETE CASCADE;

-- الخطوة 4: إعادة بناء الرابط بين الردود وكاتب الرد (المحامي)
ALTER TABLE public.replies DROP CONSTRAINT IF EXISTS replies_author_id_fkey;
ALTER TABLE public.replies
ADD CONSTRAINT replies_author_id_fkey
FOREIGN KEY (author_id) REFERENCES public.profiles(id)
ON DELETE CASCADE;