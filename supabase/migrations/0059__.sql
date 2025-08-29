-- Grant full access to admins on profiles
CREATE POLICY "Admins can manage all profiles"
ON public.profiles FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Grant full access to admins on cases
CREATE POLICY "Admins can manage all cases"
ON public.cases FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Grant full access to admins on replies
CREATE POLICY "Admins can manage all replies"
ON public.replies FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());