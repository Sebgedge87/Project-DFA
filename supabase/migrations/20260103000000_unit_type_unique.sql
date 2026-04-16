-- Unique constraint needed for seed upsert on (faction_id, name)
alter table public.unit_types
  add constraint unit_types_faction_id_name_key unique (faction_id, name);
