-- Add clone_count to track how many times a list has been copied.
-- Drives the community top-10 ranking on the home page.
alter table public.army_lists
  add column if not exists clone_count int not null default 0;
