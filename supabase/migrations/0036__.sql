-- Drop the existing, likely incorrect, insert policy
DROP POLICY IF EXISTS "Authenticated users can create requests" ON public.requests;

-- Create a new, secure insert policy that allows users to create their own requests
CREATE POLICY "Users can create their own requests"
ON public.requests
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = creator_id);