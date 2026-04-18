-- Unique constraints required for seed script upserts
alter table public.weapons
  add constraint weapons_name_key unique (name);

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'unit_types_faction_id_name_key'
      and conrelid = 'public.unit_types'::regclass
  ) then
    alter table public.unit_types add constraint unit_types_faction_id_name_key unique (faction_id, name);
  end if;
end $$;
