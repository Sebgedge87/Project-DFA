insert into public.factions (slug, name, tagline, color_primary, color_accent, store_url, rulebook_url, sort_order) values
  ('bulldogs',      'The Bulldogs',   'The Greatest Sport is War',              '8B1A1A', 'C4943A', 'https://www.wargamesatlantic.com/products/bulldogs',       'https://www.wargamesatlantic.com/products/death-fields-arena-rules', 1),
  ('les-grognards', 'Les Grognards',  'Vive la France!',                        '1A2B5E', 'C4943A', 'https://www.wargamesatlantic.com/products/les-grognards',   'https://www.wargamesatlantic.com/products/death-fields-arena-rules', 2),
  ('einherjar',     'Einherjar',      'The Warriors of Valhalla Take the Field', '2B4A7A', 'C4943A', 'https://www.wargamesatlantic.com/products/einherjar',       'https://www.wargamesatlantic.com/products/death-fields-arena-rules', 3),
  ('ooh-rah',       'Ooh Rah',        'Get Some!',                              '2B4A1A', 'C4943A', 'https://www.wargamesatlantic.com/products/ooh-rah',         'https://www.wargamesatlantic.com/products/death-fields-arena-rules', 4),
  ('raumjager',     'Raumjäger',      'Death From Above',                       '4A3A1A', 'C4943A', 'https://www.wargamesatlantic.com/products/raumjager',       'https://www.wargamesatlantic.com/products/death-fields-arena-rules', 5),
  ('sneakfeet',     'The SneakFeet',  'The Quietest Pulse in the Arena',        '2B4A1A', 'C4943A', 'https://www.wargamesatlantic.com/products/sneakfeet',       'https://www.wargamesatlantic.com/products/death-fields-arena-rules', 6)
on conflict (slug) do nothing;
