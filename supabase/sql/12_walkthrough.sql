alter table public.profiles
  add column if not exists has_completed_walkthrough boolean not null default false;
