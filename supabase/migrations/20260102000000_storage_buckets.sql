-- ══════════════════════════════════════════════════════════════════════════════
-- Death Fields Arena — Storage Buckets
-- BUILDSPEC Phase 2
-- ══════════════════════════════════════════════════════════════════════════════

-- ── BUCKETS ───────────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('faction-images', 'faction-images', true, 5242880,  array['image/webp', 'image/jpeg', 'image/png']),
  ('unit-images',    'unit-images',    true, 1048576,  array['image/webp', 'image/jpeg', 'image/png'])
on conflict (id) do nothing;

-- ── PUBLIC READ POLICIES ──────────────────────────────────────────────────────
create policy "Public read faction images"
  on storage.objects for select
  using (bucket_id = 'faction-images');

create policy "Public read unit images"
  on storage.objects for select
  using (bucket_id = 'unit-images');

-- ── SERVICE ROLE WRITE (seed script uses service role key) ───────────────────
create policy "Service role write faction images"
  on storage.objects for insert
  with check (bucket_id = 'faction-images');

create policy "Service role write unit images"
  on storage.objects for insert
  with check (bucket_id = 'unit-images');

create policy "Service role update faction images"
  on storage.objects for update
  using (bucket_id = 'faction-images');

create policy "Service role update unit images"
  on storage.objects for update
  using (bucket_id = 'unit-images');
