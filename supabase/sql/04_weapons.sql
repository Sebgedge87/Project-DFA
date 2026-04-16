-- faction_id resolved by slug; universal weapons have NULL faction_id
with fac as (select id, slug from public.factions)
insert into public.weapons (name, range_inches, num_attacks, damage, defence_mod, faction_id, notes)
select v.name, v.ri, v.na, v.dmg, v.dm, fac.id, v.notes
from (values
  -- universal
  (null,            'Fists',                         'Melee',    2, '1',   0,  null),
  (null,            'Bayonet',                       'Melee',    2, '1',  -1,  null),
  (null,            'Flamer',                        'Template', 1, 'd5',  0,  null),
  (null,            'Grenade Launcher',              '20"',      2, '2',   1,  'Generic variant'),
  (null,            'Frag Grenade',                  '8"',       1, '2',  -1,  null),
  -- bulldogs
  ('bulldogs',      'Bionic Arm',                    'Melee',    2, '2',  -2,  null),
  ('bulldogs',      'Boot Knife',                    'Melee',    3, '1',  -1,  null),
  ('bulldogs',      'Bulldog Rifle',                 '20"',      2, '1',  -1,  null),
  ('bulldogs',      'Electrocannon',                 '16"',      3, '1',   0,  null),
  ('bulldogs',      'Energy Sabre',                  'Melee',    3, '2',  -2,  null),
  ('bulldogs',      'L.M.G.',                        '20"',      4, '1',   0,  null),
  ('bulldogs',      'Revolver',                      '8"',       2, '2',  -1,  null),
  ('bulldogs',      'SMG',                           '12"',      4, '1',   0,  null),
  ('bulldogs',      'The Whistler',                  'Template', 1, '2',   0,  null),
  ('bulldogs',      'Bulldogs Grenade Launcher',     '20"',      2, '2',   1,  null),
  -- les grognards
  ('les-grognards', 'Chain Sabre',                   'Melee',    3, '2',  -1,  null),
  ('les-grognards', 'Energy Pistol',                 '8"',       2, '2',  -1,  null),
  ('les-grognards', 'Fusion Gun',                    '12"',      2, '3',   0,  null),
  ('les-grognards', 'Grognard Rifle',                '20"',      2, '1',   0,  null),
  ('les-grognards', 'Kinetic Cannon',                '16"',      3, '2',   0,  null),
  ('les-grognards', 'Les Grognards Grenade Launcher','20"',      3, '2',  -1,  null),
  ('les-grognards', 'Les Grognards Flamer',          'Template', 1, 'd5',  0,  null),
  ('les-grognards', 'Les Grognards Frag Grenade',    '8"',       1, '2',  -1,  null),
  -- einherjar
  ('einherjar',     'Blood Axe',                     'Melee',    3, '2',  -1,  null),
  ('einherjar',     'Dual Blood Axe',                'Melee',    4, '2',  -2,  null),
  ('einherjar',     'Heavy Flamer',                  'Template', 1, 'd5', -1,  null),
  ('einherjar',     'Knife',                         'Melee',    3, '1',  -1,  null),
  ('einherjar',     'M.A.R.',                        '16"',      3, '1',   0,  null),
  ('einherjar',     'Shotgun',                       '8"',       2, '2',  -1,  null),
  ('einherjar',     'Thunder Cannon',                '16"',      3, '2',  -2,  null),
  ('einherjar',     'Einherjar Grenade Launcher',    '20"',      3, '2',  -1,  null),
  -- ooh rah
  ('ooh-rah',       'Hi-Vol. Auto Gun',              '20"',      4, '1',  -1,  null),
  ('ooh-rah',       'Hi-Vol. Carbine',               '20"',      2, '1',   0,  null),
  ('ooh-rah',       'Hi-Vol. Carbine (Auto)',         '12"',      3, '1',   0,  null),
  ('ooh-rah',       'Hi-Vol. Pistol',                '8"',       4, '1',   0,  null),
  ('ooh-rah',       'Hi-Vol. SMG',                   '16"',      4, '1',   0,  null),
  ('ooh-rah',       'Hi-Vol. Sniper Rifle',          '28"',      1, '5',   2,  null),
  ('ooh-rah',       'Ooh Rah Shotgun',               '8"',       2, '2',  -1,  null),
  ('ooh-rah',       'Shock Grenades',                '8"',       3, '0',   0,  null),
  ('ooh-rah',       'Ooh Rah Flamer',                'Template', 1, 'd5',  0,  null),
  -- raumjager
  ('raumjager',     'Auto Rifle',                    '20"',      5, '1',   0,  null),
  ('raumjager',     'Raumjager Energy Pistol',       '8"',       2, '2',  -1,  null),
  ('raumjager',     'Raumjager Flamer',              'Template', 1, 'd5',  0,  null),
  ('raumjager',     'Laserkarabiner',                '20"',      2, '1',  -1,  null),
  ('raumjager',     'Laserkarabiner (Auto)',          '12"',      3, '1',  -1,  null),
  ('raumjager',     'Plasgun',                       '16"',      3, '2',  -1,  null),
  -- sneakfeet
  ('sneakfeet',     'SneakFeet Frag Grenade',        '8"',       1, '3',  -1,  null),
  ('sneakfeet',     'Frying Pan',                    'Melee',    2, '2',   0,  null),
  ('sneakfeet',     'Hunting Knife',                 'Melee',    3, '1',  -1,  null),
  ('sneakfeet',     'LRSF Rifle',                    '28"',      1, '5',  -3,  null),
  ('sneakfeet',     'Slug Gun',                      '16"',      3, '1',   0,  null),
  ('sneakfeet',     'SRSF Rifle',                    '20"',      2, '2',  -1,  null)
) as v(fac_slug, name, ri, na, dmg, dm, notes)
left join fac on fac.slug = v.fac_slug
on conflict (name) do nothing;
