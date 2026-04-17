-- ─────────────────────────────────────────────────────────────────────────────
-- 08_starter_lists.sql
-- Six ~1,000-point starter armies — one per faction.
-- Run after 03_factions.sql and 05_unit_types.sql.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Schema: support template lists with no owner ─────────────────────────────

alter table public.army_lists
  alter column user_id drop not null;

alter table public.army_lists
  add column if not exists is_template boolean not null default false;

-- Allow anyone to read entries belonging to a public list
do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename  = 'army_entries'
      and policyname = 'Public list entries readable'
  ) then
    execute $p$
      create policy "Public list entries readable"
        on public.army_entries for select
        using (
          army_list_id in (select id from public.army_lists where is_public = true)
        )
    $p$;
  end if;
end $$;

-- ── Template army lists ───────────────────────────────────────────────────────

insert into public.army_lists (id, name, faction_id, points_total, is_public, is_template)
select '00000000-0000-0000-0000-000000000001'::uuid,
       'Shoulder to Shoulder', id, 963, true, true
from public.factions where slug = 'bulldogs'
on conflict (id) do nothing;

insert into public.army_lists (id, name, faction_id, points_total, is_public, is_template)
select '00000000-0000-0000-0000-000000000002'::uuid,
       'La Grande Armée', id, 986, true, true
from public.factions where slug = 'les-grognards'
on conflict (id) do nothing;

insert into public.army_lists (id, name, faction_id, points_total, is_public, is_template)
select '00000000-0000-0000-0000-000000000003'::uuid,
       'Shield Wall', id, 972, true, true
from public.factions where slug = 'einherjar'
on conflict (id) do nothing;

insert into public.army_lists (id, name, faction_id, points_total, is_public, is_template)
select '00000000-0000-0000-0000-000000000004'::uuid,
       'Semper Fi', id, 974, true, true
from public.factions where slug = 'ooh-rah'
on conflict (id) do nothing;

insert into public.army_lists (id, name, faction_id, points_total, is_public, is_template)
select '00000000-0000-0000-0000-000000000005'::uuid,
       'Ghost Strike', id, 993, true, true
from public.factions where slug = 'raumjager'
on conflict (id) do nothing;

insert into public.army_lists (id, name, faction_id, points_total, is_public, is_template)
select '00000000-0000-0000-0000-000000000006'::uuid,
       'Whisper and Smoke', id, 960, true, true
from public.factions where slug = 'sneakfeet'
on conflict (id) do nothing;

-- ── Army entries (delete + insert for idempotency) ───────────────────────────

-- Bulldogs: "Shoulder to Shoulder" (963pts, 10 models)
-- The Old Sweat 115 + L.M.G. Gunner 95 + Grenadier 96
-- + Rifleman×3 279 + Tommy×2 188 + Brew Sgt. 95 + Combat Medic 95
delete from public.army_entries
  where army_list_id = '00000000-0000-0000-0000-000000000001';

insert into public.army_entries (army_list_id, unit_type_id, quantity)
select '00000000-0000-0000-0000-000000000001', ut.id, v.qty
from (values
  ('The Old Sweat',  1),
  ('L.M.G. Gunner',  1),
  ('Grenadier',      1),
  ('Rifleman',       3),
  ('Tommy',          2),
  ('Brew Sgt.',      1),
  ('Combat Medic',   1)
) as v(uname, qty)
join public.unit_types ut on ut.name = v.uname
join public.factions    f on f.id = ut.faction_id and f.slug = 'bulldogs';

-- Les Grognards: "La Grande Armée" (986pts, 10 models)
-- Commandant de Ligne 119 + Garde de Kinetic 98 + Garde de Grenade 113
-- + Garde de Fusioner 95 + Voltigeur×2 186 + Vétéran de Ligne×2 186
-- + Marqueur de Mort 92 + Infirmier de Combat 97
delete from public.army_entries
  where army_list_id = '00000000-0000-0000-0000-000000000002';

insert into public.army_entries (army_list_id, unit_type_id, quantity)
select '00000000-0000-0000-0000-000000000002', ut.id, v.qty
from (values
  ('Commandant de Ligne',  1),
  ('Garde de Kinetic',     1),
  ('Garde de Grenade',     1),
  ('Garde de Fusioner',    1),
  ('Voltigeur',            2),
  ('Vétéran de Ligne',     2),
  ('Marqueur de Mort',     1),
  ('Infirmier de Combat',  1)
) as v(uname, qty)
join public.unit_types ut on ut.name = v.uname
join public.factions    f on f.id = ut.faction_id and f.slug = 'les-grognards';

-- Einherjar: "Shield Wall" (972pts, 10 models)
-- Konungr 106 + Berserker 104 + Muspel-Warder 107 + Sky-Shatterer 99
-- + Foringjar×2 198 + Hird×2 178 + Skald 94 + Bondsman 86
delete from public.army_entries
  where army_list_id = '00000000-0000-0000-0000-000000000003';

insert into public.army_entries (army_list_id, unit_type_id, quantity)
select '00000000-0000-0000-0000-000000000003', ut.id, v.qty
from (values
  ('Konungr',       1),
  ('Berserker',     1),
  ('Muspel-Warder', 1),
  ('Sky-Shatterer', 1),
  ('Foringjar',     2),
  ('Hird',          2),
  ('Skald',         1),
  ('Bondsman',      1)
) as v(uname, qty)
join public.unit_types ut on ut.name = v.uname
join public.factions    f on f.id = ut.faction_id and f.slug = 'einherjar';

-- Ooh Rah: "Semper Fi" (974pts, 10 models)
-- Lieutenant 108 + Auto Laser Rifleman 99 + Flamer Rifleman 98 + Sniper 110
-- + Rifleman×3 267 + Fire Team Leader 94 + Combat Medic 100 + Breacher 98
delete from public.army_entries
  where army_list_id = '00000000-0000-0000-0000-000000000004';

insert into public.army_entries (army_list_id, unit_type_id, quantity)
select '00000000-0000-0000-0000-000000000004', ut.id, v.qty
from (values
  ('Lieutenant',          1),
  ('Auto Laser Rifleman', 1),
  ('Flamer Rifleman',     1),
  ('Sniper',              1),
  ('Rifleman',            3),
  ('Fire Team Leader',    1),
  ('Combat Medic',        1),
  ('Breacher',            1)
) as v(uname, qty)
join public.unit_types ut on ut.name = v.uname
join public.factions    f on f.id = ut.faction_id and f.slug = 'ooh-rah';

-- Raumjäger: "Ghost Strike" (993pts, 10 models)
-- Einsatzkommandant 104 + Flammenjäger×2 204 + Totenjäger 97 + Plasmajäger 99
-- + Erfahrener Jäger 98 + Eiserne Jäger×3 291 + Kampfsanitäter 100
delete from public.army_entries
  where army_list_id = '00000000-0000-0000-0000-000000000005';

insert into public.army_entries (army_list_id, unit_type_id, quantity)
select '00000000-0000-0000-0000-000000000005', ut.id, v.qty
from (values
  ('Einsatzkommandant', 1),
  ('Flammenjäger',      2),
  ('Totenjäger',        1),
  ('Plasmajäger',       1),
  ('Erfahrener Jäger',  1),
  ('Eiserne Jäger',     3),
  ('Kampfsanitäter',    1)
) as v(uname, qty)
join public.unit_types ut on ut.name = v.uname
join public.factions    f on f.id = ut.faction_id and f.slug = 'raumjager';

-- SneakFeet: "Whisper and Smoke" (960pts, 10 models)
-- Hardfoot 105 + Grass-whistler×2 216 + Quickfoot×2 190
-- + Youngfoot×3 255 + Cook 106 + Pointfoot 88
delete from public.army_entries
  where army_list_id = '00000000-0000-0000-0000-000000000006';

insert into public.army_entries (army_list_id, unit_type_id, quantity)
select '00000000-0000-0000-0000-000000000006', ut.id, v.qty
from (values
  ('Hardfoot',       1),
  ('Grass-whistler', 2),
  ('Quickfoot',      2),
  ('Youngfoot',      3),
  ('Cook',           1),
  ('Pointfoot',      1)
) as v(uname, qty)
join public.unit_types ut on ut.name = v.uname
join public.factions    f on f.id = ut.faction_id and f.slug = 'sneakfeet';
