-- Unique constraints required for seed script upserts
alter table public.weapons
  add constraint weapons_name_key unique (name);

alter table public.unit_types
  add constraint unit_types_faction_id_name_key unique (faction_id, name);
