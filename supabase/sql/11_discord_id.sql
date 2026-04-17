alter table public.profiles
  add column if not exists discord_id text;
