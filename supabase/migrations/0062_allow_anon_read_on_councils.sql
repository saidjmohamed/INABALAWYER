-- Drop the existing policy which only allows authenticated users to read.
DROP POLICY IF EXISTS "Authenticated users can view councils" ON public.councils;

-- Create a new, more permissive policy that allows anyone (including anonymous users) to read the councils list.
CREATE POLICY "Public can view councils" ON public.councils
FOR SELECT TO anon, authenticated
USING (true);