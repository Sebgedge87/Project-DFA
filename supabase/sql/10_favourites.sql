create table if not exists public.favourites (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  list_id     uuid not null references public.army_lists(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique(user_id, list_id)
);

alter table public.favourites enable row level security;

create policy "Users manage own favourites"
  on public.favourites for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
