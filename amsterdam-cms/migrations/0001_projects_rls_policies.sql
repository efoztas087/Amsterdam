-- Enable RLS and create policies for the `projects` table

-- Enable row level security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Ensure existing admin policy (replace if present)
DROP POLICY IF EXISTS "admin-only-projects" ON public.projects;
CREATE POLICY "admin-only-projects" ON public.projects
  FOR ALL
  USING ((auth.jwt() ->> 'role'::text) = 'admin'::text)
  WITH CHECK ((auth.jwt() ->> 'role'::text) = 'admin'::text);

-- Allow authenticated users to INSERT (use this if admin UI authenticates users)
DROP POLICY IF EXISTS "authenticated-insert-projects" ON public.projects;
CREATE POLICY "authenticated-insert-projects" ON public.projects
  FOR INSERT
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Allow public SELECT of rows where published = true (public-facing list)
DROP POLICY IF EXISTS "public-select-published" ON public.projects;
CREATE POLICY "public-select-published" ON public.projects
  FOR SELECT
  USING (coalesce(published, false) = true);

-- Optional: allow authenticated users to SELECT their own rows or admins to see all
-- (Uncomment and adjust if you want authenticated users to see unpublished rows)
-- DROP POLICY IF EXISTS "authenticated-select-all" ON public.projects;
-- CREATE POLICY "authenticated-select-all" ON public.projects
--   FOR SELECT
--   USING (auth.role() = 'authenticated');

-- Note: Apply this file by pasting into Supabase SQL editor or by running it with psql
-- After applying, test inserts from the app; if the app uses the anon key, consider
-- either logging in in the app (so auth.role() = 'authenticated') or routing writes
-- through a server endpoint that uses the service_role key.
