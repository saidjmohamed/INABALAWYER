CREATE POLICY "Allow creators and admins to delete requests" ON public.requests
FOR DELETE TO authenticated
USING (
  (auth.uid() = creator_id) OR
  (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
);