-- Drop the existing faulty policy
DROP POLICY IF EXISTS "Users can create their own requests" ON public.requests;

-- Recreate the policy with the correct security check
CREATE POLICY "Users can create their own requests"
ON public.requests
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = creator_id);