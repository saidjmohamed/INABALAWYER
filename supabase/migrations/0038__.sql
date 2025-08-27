-- 1. Remove all potentially conflicting INSERT policies on the 'requests' table
DROP POLICY IF EXISTS "Authenticated users can create requests" ON public.requests;
DROP POLICY IF EXISTS "Users can create their own requests" ON public.requests;

-- 2. Create a single, correct policy for inserting new requests
CREATE POLICY "Users can only insert their own requests"
ON public.requests
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = creator_id);

-- 3. Proactively fix a similar issue on the 'replies' table
DROP POLICY IF EXISTS "Authenticated users can create replies" ON public.replies;

-- 4. Create a correct policy for inserting new replies
CREATE POLICY "Users can create their own replies"
ON public.replies
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = author_id);