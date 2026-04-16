-- Links weapons to keywords; parameter is nullable text (e.g. '3' for Blast(3))
with
  w as (select id, name from public.weapons),
  k as (select id, name from public.keywords)
insert into public.weapon_keywords (weapon_id, keyword_id, parameter)
select w.id, k.id, v.param
from (values
  -- universal
  ('Flamer',                        'Template',         null),
  ('Flamer',                        'Slow',             null),
  ('Grenade Launcher',              'Blast (X)',        '3'),
  ('Grenade Launcher',              'Slow',             null),
  ('Frag Grenade',                  'Blast (X)',        '3'),
  ('Frag Grenade',                  'One Use',          null),
  -- bulldogs
  ('Bionic Arm',                    'Crit Damage',      null),
  ('Electrocannon',                 'Shock',            null),
  ('Electrocannon',                 'Slow',             null),
  ('L.M.G.',                        'Crit Stress',      null),
  ('L.M.G.',                        'Slow',             null),
  ('Revolver',                      'Mobile',           null),
  ('SMG',                           'Mobile',           null),
  ('The Whistler',                  'Shock',            null),
  ('The Whistler',                  'Template',         null),
  ('The Whistler',                  'Slow',             null),
  ('Bulldogs Grenade Launcher',     'Blast (X)',        '3'),
  ('Bulldogs Grenade Launcher',     'Slow',             null),
  -- les grognards
  ('Fusion Gun',                    'Crit AP',          null),
  ('Fusion Gun',                    'Ignores Cover',    null),
  ('Fusion Gun',                    'Slow',             null),
  ('Grognard Rifle',                'Crit Damage',      null),
  ('Kinetic Cannon',                'Knock Back',       null),
  ('Kinetic Cannon',                'Slow',             null),
  ('Les Grognards Grenade Launcher','Blast (X)',        '3'),
  ('Les Grognards Grenade Launcher','Slow',             null),
  ('Les Grognards Flamer',          'Template',         null),
  ('Les Grognards Flamer',          'Slow',             null),
  ('Les Grognards Frag Grenade',    'Blast (X)',        '3'),
  ('Les Grognards Frag Grenade',    'One Use',          null),
  -- einherjar
  ('Blood Axe',                     'Crit Damage',      null),
  ('Heavy Flamer',                  'Slow',             null),
  ('M.A.R.',                        'Crit AP',          null),
  ('Thunder Cannon',                'Crit Stress',      null),
  ('Thunder Cannon',                'Slow',             null),
  ('Einherjar Grenade Launcher',    'Blast (X)',        '3'),
  ('Einherjar Grenade Launcher',    'Slow',             null),
  -- ooh rah
  ('Hi-Vol. Auto Gun',              'Ignores Cover',    null),
  ('Hi-Vol. Auto Gun',              'Crit Stress',      null),
  ('Hi-Vol. Auto Gun',              'Slow',             null),
  ('Hi-Vol. Carbine',               'Ignores Cover',    null),
  ('Hi-Vol. Carbine',               'Mobile',           null),
  ('Hi-Vol. Carbine (Auto)',        'Ignores Cover',    null),
  ('Hi-Vol. Carbine (Auto)',        'Mobile',           null),
  ('Hi-Vol. Pistol',                'Ignores Cover',    null),
  ('Hi-Vol. Pistol',                'Mobile',           null),
  ('Hi-Vol. SMG',                   'Ignores Cover',    null),
  ('Hi-Vol. SMG',                   'Mobile',           null),
  ('Hi-Vol. Sniper Rifle',          'Ignores Cover',    null),
  ('Hi-Vol. Sniper Rifle',          'Slow',             null),
  ('Ooh Rah Shotgun',               'Knock Back',       null),
  ('Ooh Rah Shotgun',               'Mobile',           null),
  ('Shock Grenades',                'Shock',            null),
  ('Shock Grenades',                'Mobile',           null),
  ('Ooh Rah Flamer',                'Template',         null),
  ('Ooh Rah Flamer',                'Slow',             null),
  -- raumjager
  ('Auto Rifle',                    'Crit Stress',      null),
  ('Auto Rifle',                    'Slow',             null),
  ('Raumjager Energy Pistol',       'Mobile',           null),
  ('Raumjager Flamer',              'Template',         null),
  ('Raumjager Flamer',              'Slow',             null),
  ('Laserkarabiner',                'Crit Damage',      null),
  ('Laserkarabiner (Auto)',         'Crit Stress',      null),
  ('Plasgun',                       'Slow',             null),
  ('Plasgun',                       'Charged (X)',      '1'),
  -- sneakfeet
  ('SneakFeet Frag Grenade',        'Blast (X)',        '3'),
  ('Frying Pan',                    'Shock',            null),
  ('LRSF Rifle',                    'Slow',             null),
  ('Slug Gun',                      'Crit Damage',      null),
  ('SRSF Rifle',                    'Slow',             null)
) as v(weapon_name, keyword_name, param)
join w on w.name = v.weapon_name
join k on k.name = v.keyword_name
on conflict (weapon_id, keyword_id) do nothing;
