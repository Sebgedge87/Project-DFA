-- Run this first. Adds unique constraints required for idempotent seed upserts.
alter table public.weapons
  add constraint if not exists weapons_name_key unique (name);

alter table public.unit_types
  add constraint if not exists unit_types_faction_id_name_key unique (faction_id, name);
