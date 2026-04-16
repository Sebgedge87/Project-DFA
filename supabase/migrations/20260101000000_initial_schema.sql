-- ══════════════════════════════════════════════════════════════════════════════
-- Death Fields Arena — Initial Schema
-- BUILDSPEC §4
-- ══════════════════════════════════════════════════════════════════════════════

-- ── PROFILES ─────────────────────────────────────────────────────────────────
create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  username      text unique not null,
  display_name  text,
  avatar_url    text,
  bio           text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ── FACTIONS ──────────────────────────────────────────────────────────────────
create table public.factions (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,   -- 'bulldogs', 'les-grognards'
  name          text not null,
  tagline       text,
  lore          text,
  color_primary text not null,          -- hex without #
  color_accent  text not null,
  image_url     text,                   -- faction hero art
  store_url     text,                   -- wargamesatlantic.com product
  rulebook_url  text,                   -- PDF or page link
  sort_order    int default 0,
  created_at    timestamptz default now()
);

-- ── UNIT ROLES ENUM ───────────────────────────────────────────────────────────
create type unit_role as enum ('captain', 'specialist', 'core');

-- ── UNIT TYPES ────────────────────────────────────────────────────────────────
create table public.unit_types (
  id            uuid primary key default gen_random_uuid(),
  faction_id    uuid not null references factions(id),
  name          text not null,
  role          unit_role not null,
  actions       int not null,
  movement      int not null,
  melee_attack  int not null,
  ranged_attack int not null,
  defence       int not null,
  health        int not null,
  points        int not null,
  max_per_army  int,                    -- null = unlimited
  abilities     jsonb default '[]',     -- [{name, description}]
  image_url     text,
  base_size_mm  int default 25,
  store_url     text,
  sort_order    int default 0,
  created_at    timestamptz default now()
);

-- ── WEAPONS ───────────────────────────────────────────────────────────────────
create table public.weapons (
  id              uuid primary key default gen_random_uuid(),
  faction_id      uuid references factions(id),  -- null = universal
  name            text not null,
  range_inches    text,                  -- 'Melee', '20"', 'Template'
  num_attacks     int not null,
  damage          text not null,         -- '1', '2', 'd5'
  defence_mod     int default 0,         -- negative = AP
  notes           text,
  created_at      timestamptz default now()
);

-- ── UNIT → WEAPONS JOIN ────────────────────────────────────────────────────────
create table public.unit_weapons (
  unit_type_id  uuid not null references unit_types(id) on delete cascade,
  weapon_id     uuid not null references weapons(id) on delete cascade,
  primary key (unit_type_id, weapon_id)
);

-- ── KEYWORDS ──────────────────────────────────────────────────────────────────
create table public.keywords (
  id            uuid primary key default gen_random_uuid(),
  name          text unique not null,
  description   text not null
);

-- ── WEAPON → KEYWORDS JOIN ─────────────────────────────────────────────────────
create table public.weapon_keywords (
  weapon_id   uuid not null references weapons(id) on delete cascade,
  keyword_id  uuid not null references keywords(id) on delete cascade,
  parameter   text,   -- e.g. '3' for Blast(3)
  primary key (weapon_id, keyword_id)
);

-- ── ARMY LISTS ────────────────────────────────────────────────────────────────
create table public.army_lists (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references profiles(id) on delete cascade,
  faction_id    uuid not null references factions(id),
  name          text not null default 'My Army',
  notes         text,
  points_total  int not null default 0,
  is_public     boolean not null default false,
  share_token   text unique default encode(gen_random_bytes(12), 'base64url'),
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ── ARMY ENTRIES ──────────────────────────────────────────────────────────────
create table public.army_entries (
  id            uuid primary key default gen_random_uuid(),
  army_list_id  uuid not null references army_lists(id) on delete cascade,
  unit_type_id  uuid not null references unit_types(id),
  quantity      int not null default 1 check (quantity >= 1)
);

-- ── ROW LEVEL SECURITY ────────────────────────────────────────────────────────
alter table profiles     enable row level security;
alter table army_lists   enable row level security;
alter table army_entries enable row level security;

create policy "Own profile"
  on profiles for all
  using (auth.uid() = id);

create policy "Own lists"
  on army_lists for all
  using (auth.uid() = user_id);

create policy "Public lists readable"
  on army_lists for select
  using (is_public = true);

create policy "Own entries via list"
  on army_entries for all
  using (
    army_list_id in (
      select id from army_lists where user_id = auth.uid()
    )
  );

-- ── INDEXES ───────────────────────────────────────────────────────────────────
create index on unit_types (faction_id);
create index on army_lists (user_id);
create index on army_lists (share_token);
create index on army_entries (army_list_id);

-- ── AUTO-CREATE PROFILE ON SIGN-UP ───────────────────────────────────────────
-- Trigger fires on every new auth.users row (OAuth or magic link sign-up).
-- Pulls display_name and avatar_url from the provider metadata.
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'preferred_username',
             new.raw_user_meta_data->>'user_name',
             split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'full_name',
             new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── AUTO-UPDATE updated_at ────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at
  before update on profiles
  for each row execute procedure public.set_updated_at();

create trigger set_army_lists_updated_at
  before update on army_lists
  for each row execute procedure public.set_updated_at();
