// faction_slug null = universal weapon shared across factions
export const weapons = [
  // ── UNIVERSAL ──────────────────────────────────────────────────────────────
  { faction_slug: null, name: 'Fists',          range_inches: 'Melee',    num_attacks: 2, damage: '1', defence_mod:  0, notes: null },
  { faction_slug: null, name: 'Bayonet',        range_inches: 'Melee',    num_attacks: 2, damage: '1', defence_mod: -1, notes: null },
  { faction_slug: null, name: 'Flamer',         range_inches: 'Template', num_attacks: 1, damage: 'd5', defence_mod: 0, notes: null },
  { faction_slug: null, name: 'Grenade Launcher', range_inches: '20"',   num_attacks: 2, damage: '2', defence_mod: +1, notes: 'Bulldogs variant' },
  { faction_slug: null, name: 'Frag Grenade',   range_inches: '8"',       num_attacks: 1, damage: '2', defence_mod: -1, notes: null },

  // ── BULLDOGS ───────────────────────────────────────────────────────────────
  { faction_slug: 'bulldogs', name: 'Bionic Arm',       range_inches: 'Melee',  num_attacks: 2, damage: '2', defence_mod: -2, notes: null },
  { faction_slug: 'bulldogs', name: 'Boot Knife',        range_inches: 'Melee',  num_attacks: 3, damage: '1', defence_mod: -1, notes: null },
  { faction_slug: 'bulldogs', name: 'Bulldog Rifle',     range_inches: '20"',    num_attacks: 2, damage: '1', defence_mod: -1, notes: null },
  { faction_slug: 'bulldogs', name: 'Electrocannon',     range_inches: '16"',    num_attacks: 3, damage: '1', defence_mod:  0, notes: null },
  { faction_slug: 'bulldogs', name: 'Energy Sabre',      range_inches: 'Melee',  num_attacks: 3, damage: '2', defence_mod: -2, notes: null },
  { faction_slug: 'bulldogs', name: 'L.M.G.',            range_inches: '20"',    num_attacks: 4, damage: '1', defence_mod:  0, notes: null },
  { faction_slug: 'bulldogs', name: 'Revolver',          range_inches: '8"',     num_attacks: 2, damage: '2', defence_mod: -1, notes: null },
  { faction_slug: 'bulldogs', name: 'SMG',               range_inches: '12"',    num_attacks: 4, damage: '1', defence_mod:  0, notes: null },
  { faction_slug: 'bulldogs', name: 'The Whistler',      range_inches: 'Template', num_attacks: 1, damage: '2', defence_mod: 0, notes: null },
  { faction_slug: 'bulldogs', name: 'Bulldogs Grenade Launcher', range_inches: '20"', num_attacks: 2, damage: '2', defence_mod: +1, notes: null },

  // ── LES GROGNARDS ──────────────────────────────────────────────────────────
  { faction_slug: 'les-grognards', name: 'Chain Sabre',      range_inches: 'Melee', num_attacks: 3, damage: '2', defence_mod: -1, notes: null },
  { faction_slug: 'les-grognards', name: 'Energy Pistol',    range_inches: '8"',    num_attacks: 2, damage: '2', defence_mod: -1, notes: null },
  { faction_slug: 'les-grognards', name: 'Fusion Gun',       range_inches: '12"',   num_attacks: 2, damage: '3', defence_mod:  0, notes: null },
  { faction_slug: 'les-grognards', name: 'Grognard Rifle',   range_inches: '20"',   num_attacks: 2, damage: '1', defence_mod:  0, notes: null },
  { faction_slug: 'les-grognards', name: 'Kinetic Cannon',   range_inches: '16"',   num_attacks: 3, damage: '2', defence_mod:  0, notes: null },
  { faction_slug: 'les-grognards', name: 'Les Grognards Grenade Launcher', range_inches: '20"', num_attacks: 3, damage: '2', defence_mod: -1, notes: null },
  { faction_slug: 'les-grognards', name: 'Les Grognards Flamer', range_inches: 'Template', num_attacks: 1, damage: 'd5', defence_mod: 0, notes: null },
  { faction_slug: 'les-grognards', name: 'Les Grognards Frag Grenade', range_inches: '8"', num_attacks: 1, damage: '2', defence_mod: -1, notes: null },

  // ── EINHERJAR ──────────────────────────────────────────────────────────────
  { faction_slug: 'einherjar', name: 'Blood Axe',        range_inches: 'Melee', num_attacks: 3, damage: '2', defence_mod: -1, notes: null },
  { faction_slug: 'einherjar', name: 'Dual Blood Axe',   range_inches: 'Melee', num_attacks: 4, damage: '2', defence_mod: -2, notes: null },
  { faction_slug: 'einherjar', name: 'Heavy Flamer',     range_inches: 'Template', num_attacks: 1, damage: 'd5', defence_mod: -1, notes: null },
  { faction_slug: 'einherjar', name: 'Knife',            range_inches: 'Melee', num_attacks: 3, damage: '1', defence_mod: -1, notes: null },
  { faction_slug: 'einherjar', name: 'M.A.R.',           range_inches: '16"',   num_attacks: 3, damage: '1', defence_mod:  0, notes: null },
  { faction_slug: 'einherjar', name: 'Shotgun',          range_inches: '8"',    num_attacks: 2, damage: '2', defence_mod: -1, notes: null },
  { faction_slug: 'einherjar', name: 'Thunder Cannon',   range_inches: '16"',   num_attacks: 3, damage: '2', defence_mod: -2, notes: null },
  { faction_slug: 'einherjar', name: 'Einherjar Grenade Launcher', range_inches: '20"', num_attacks: 3, damage: '2', defence_mod: -1, notes: null },

  // ── OOH RAH ────────────────────────────────────────────────────────────────
  { faction_slug: 'ooh-rah', name: 'Hi-Vol. Auto Gun',       range_inches: '20"',    num_attacks: 4, damage: '1', defence_mod: -1, notes: null },
  { faction_slug: 'ooh-rah', name: 'Hi-Vol. Carbine',        range_inches: '20"',    num_attacks: 2, damage: '1', defence_mod:  0, notes: null },
  { faction_slug: 'ooh-rah', name: 'Hi-Vol. Carbine (Auto)', range_inches: '12"',    num_attacks: 3, damage: '1', defence_mod:  0, notes: null },
  { faction_slug: 'ooh-rah', name: 'Hi-Vol. Pistol',         range_inches: '8"',     num_attacks: 4, damage: '1', defence_mod:  0, notes: null },
  { faction_slug: 'ooh-rah', name: 'Hi-Vol. SMG',            range_inches: '16"',    num_attacks: 4, damage: '1', defence_mod:  0, notes: null },
  { faction_slug: 'ooh-rah', name: 'Hi-Vol. Sniper Rifle',   range_inches: '28"',    num_attacks: 1, damage: '5', defence_mod: +2, notes: null },
  { faction_slug: 'ooh-rah', name: 'Ooh Rah Shotgun',        range_inches: '8"',     num_attacks: 2, damage: '2', defence_mod: -1, notes: null },
  { faction_slug: 'ooh-rah', name: 'Shock Grenades',         range_inches: '8"',     num_attacks: 3, damage: '0', defence_mod:  0, notes: null },
  { faction_slug: 'ooh-rah', name: 'Ooh Rah Flamer',         range_inches: 'Template', num_attacks: 1, damage: 'd5', defence_mod: 0, notes: null },

  // ── RAUMJÄGER ──────────────────────────────────────────────────────────────
  { faction_slug: 'raumjager', name: 'Auto Rifle',              range_inches: '20"',    num_attacks: 5, damage: '1', defence_mod:  0, notes: null },
  { faction_slug: 'raumjager', name: 'Raumjager Energy Pistol', range_inches: '8"',     num_attacks: 2, damage: '2', defence_mod: -1, notes: null },
  { faction_slug: 'raumjager', name: 'Raumjager Flamer',        range_inches: 'Template', num_attacks: 1, damage: 'd5', defence_mod: 0, notes: null },
  { faction_slug: 'raumjager', name: 'Laserkarabiner',          range_inches: '20"',    num_attacks: 2, damage: '1', defence_mod: -1, notes: null },
  { faction_slug: 'raumjager', name: 'Laserkarabiner (Auto)',   range_inches: '12"',    num_attacks: 3, damage: '1', defence_mod: -1, notes: null },
  { faction_slug: 'raumjager', name: 'Plasgun',                 range_inches: '16"',    num_attacks: 3, damage: '2', defence_mod: -1, notes: null },

  // ── SNEAKFEET ──────────────────────────────────────────────────────────────
  { faction_slug: 'sneakfeet', name: 'SneakFeet Frag Grenade', range_inches: '8"',    num_attacks: 1, damage: '3', defence_mod: -1, notes: null },
  { faction_slug: 'sneakfeet', name: 'Frying Pan',             range_inches: 'Melee', num_attacks: 2, damage: '2', defence_mod:  0, notes: null },
  { faction_slug: 'sneakfeet', name: 'Hunting Knife',          range_inches: 'Melee', num_attacks: 3, damage: '1', defence_mod: -1, notes: null },
  { faction_slug: 'sneakfeet', name: 'LRSF Rifle',             range_inches: '28"',   num_attacks: 1, damage: '5', defence_mod: -3, notes: null },
  { faction_slug: 'sneakfeet', name: 'Slug Gun',               range_inches: '16"',   num_attacks: 3, damage: '1', defence_mod:  0, notes: null },
  { faction_slug: 'sneakfeet', name: 'SRSF Rifle',             range_inches: '20"',   num_attacks: 2, damage: '2', defence_mod: -1, notes: null },
];
