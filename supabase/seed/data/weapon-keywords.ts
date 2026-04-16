// { weapon_name, keyword_name, parameter }
// The seed script resolves these to IDs after inserting weapons and keywords.
export const weaponKeywords = [
  // ── UNIVERSAL ──────────────────────────────────────────────────────────────
  { weapon_name: 'Flamer',          keyword_name: 'Template',   parameter: null },
  { weapon_name: 'Flamer',          keyword_name: 'Slow',        parameter: null },
  { weapon_name: 'Grenade Launcher', keyword_name: 'Blast (X)',  parameter: '3' },
  { weapon_name: 'Grenade Launcher', keyword_name: 'Slow',       parameter: null },
  { weapon_name: 'Frag Grenade',    keyword_name: 'Blast (X)',   parameter: '3' },
  { weapon_name: 'Frag Grenade',    keyword_name: 'One Use',     parameter: null },

  // ── BULLDOGS ───────────────────────────────────────────────────────────────
  { weapon_name: 'Bionic Arm',                  keyword_name: 'Crit Damage',  parameter: null },
  { weapon_name: 'Electrocannon',               keyword_name: 'Shock',        parameter: null },
  { weapon_name: 'Electrocannon',               keyword_name: 'Slow',         parameter: null },
  { weapon_name: 'L.M.G.',                      keyword_name: 'Crit Stress',  parameter: null },
  { weapon_name: 'L.M.G.',                      keyword_name: 'Slow',         parameter: null },
  { weapon_name: 'Revolver',                    keyword_name: 'Mobile',       parameter: null },
  { weapon_name: 'SMG',                         keyword_name: 'Mobile',       parameter: null },
  { weapon_name: 'The Whistler',                keyword_name: 'Shock',        parameter: null },
  { weapon_name: 'The Whistler',                keyword_name: 'Template',     parameter: null },
  { weapon_name: 'The Whistler',                keyword_name: 'Slow',         parameter: null },
  { weapon_name: 'Bulldogs Grenade Launcher',   keyword_name: 'Blast (X)',    parameter: '3' },
  { weapon_name: 'Bulldogs Grenade Launcher',   keyword_name: 'Slow',         parameter: null },

  // ── LES GROGNARDS ──────────────────────────────────────────────────────────
  { weapon_name: 'Fusion Gun',                      keyword_name: 'Crit AP',        parameter: null },
  { weapon_name: 'Fusion Gun',                      keyword_name: 'Ignores Cover',  parameter: null },
  { weapon_name: 'Fusion Gun',                      keyword_name: 'Slow',           parameter: null },
  { weapon_name: 'Grognard Rifle',                  keyword_name: 'Crit Damage',    parameter: null },
  { weapon_name: 'Kinetic Cannon',                  keyword_name: 'Knock Back',     parameter: null },
  { weapon_name: 'Kinetic Cannon',                  keyword_name: 'Slow',           parameter: null },
  { weapon_name: 'Les Grognards Grenade Launcher',  keyword_name: 'Blast (X)',      parameter: '3' },
  { weapon_name: 'Les Grognards Grenade Launcher',  keyword_name: 'Slow',           parameter: null },
  { weapon_name: 'Les Grognards Flamer',            keyword_name: 'Template',       parameter: null },
  { weapon_name: 'Les Grognards Flamer',            keyword_name: 'Slow',           parameter: null },
  { weapon_name: 'Les Grognards Frag Grenade',      keyword_name: 'Blast (X)',      parameter: '3' },
  { weapon_name: 'Les Grognards Frag Grenade',      keyword_name: 'One Use',        parameter: null },

  // ── EINHERJAR ──────────────────────────────────────────────────────────────
  { weapon_name: 'Blood Axe',                keyword_name: 'Crit Damage',  parameter: null },
  { weapon_name: 'Heavy Flamer',             keyword_name: 'Slow',         parameter: null },
  { weapon_name: 'M.A.R.',                   keyword_name: 'Crit AP',      parameter: null },
  { weapon_name: 'Thunder Cannon',           keyword_name: 'Crit Stress',  parameter: null },
  { weapon_name: 'Thunder Cannon',           keyword_name: 'Slow',         parameter: null },
  { weapon_name: 'Einherjar Grenade Launcher', keyword_name: 'Blast (X)',  parameter: '3' },
  { weapon_name: 'Einherjar Grenade Launcher', keyword_name: 'Slow',       parameter: null },

  // ── OOH RAH ────────────────────────────────────────────────────────────────
  { weapon_name: 'Hi-Vol. Auto Gun',       keyword_name: 'Ignores Cover',  parameter: null },
  { weapon_name: 'Hi-Vol. Auto Gun',       keyword_name: 'Crit Stress',    parameter: null },
  { weapon_name: 'Hi-Vol. Auto Gun',       keyword_name: 'Slow',           parameter: null },
  { weapon_name: 'Hi-Vol. Carbine',        keyword_name: 'Ignores Cover',  parameter: null },
  { weapon_name: 'Hi-Vol. Carbine',        keyword_name: 'Mobile',         parameter: null },
  { weapon_name: 'Hi-Vol. Carbine (Auto)', keyword_name: 'Ignores Cover',  parameter: null },
  { weapon_name: 'Hi-Vol. Carbine (Auto)', keyword_name: 'Mobile',         parameter: null },
  { weapon_name: 'Hi-Vol. Pistol',         keyword_name: 'Ignores Cover',  parameter: null },
  { weapon_name: 'Hi-Vol. Pistol',         keyword_name: 'Mobile',         parameter: null },
  { weapon_name: 'Hi-Vol. SMG',            keyword_name: 'Ignores Cover',  parameter: null },
  { weapon_name: 'Hi-Vol. SMG',            keyword_name: 'Mobile',         parameter: null },
  { weapon_name: 'Hi-Vol. Sniper Rifle',   keyword_name: 'Ignores Cover',  parameter: null },
  { weapon_name: 'Hi-Vol. Sniper Rifle',   keyword_name: 'Slow',           parameter: null },
  { weapon_name: 'Ooh Rah Shotgun',        keyword_name: 'Knock Back',     parameter: null },
  { weapon_name: 'Ooh Rah Shotgun',        keyword_name: 'Mobile',         parameter: null },
  { weapon_name: 'Shock Grenades',         keyword_name: 'Shock',          parameter: null },
  { weapon_name: 'Shock Grenades',         keyword_name: 'Mobile',         parameter: null },
  { weapon_name: 'Ooh Rah Flamer',         keyword_name: 'Template',       parameter: null },
  { weapon_name: 'Ooh Rah Flamer',         keyword_name: 'Slow',           parameter: null },

  // ── RAUMJÄGER ──────────────────────────────────────────────────────────────
  { weapon_name: 'Auto Rifle',              keyword_name: 'Crit Stress',  parameter: null },
  { weapon_name: 'Auto Rifle',              keyword_name: 'Slow',         parameter: null },
  { weapon_name: 'Raumjager Energy Pistol', keyword_name: 'Mobile',       parameter: null },
  { weapon_name: 'Raumjager Flamer',        keyword_name: 'Template',     parameter: null },
  { weapon_name: 'Raumjager Flamer',        keyword_name: 'Slow',         parameter: null },
  { weapon_name: 'Laserkarabiner',          keyword_name: 'Crit Damage',  parameter: null },
  { weapon_name: 'Laserkarabiner (Auto)',   keyword_name: 'Crit Stress',  parameter: null },
  { weapon_name: 'Plasgun',                 keyword_name: 'Slow',         parameter: null },
  { weapon_name: 'Plasgun',                 keyword_name: 'Charged (X)',  parameter: '1' },

  // ── SNEAKFEET ──────────────────────────────────────────────────────────────
  { weapon_name: 'SneakFeet Frag Grenade',  keyword_name: 'Blast (X)',    parameter: '3' },
  { weapon_name: 'Frying Pan',              keyword_name: 'Shock',        parameter: null },
  { weapon_name: 'LRSF Rifle',              keyword_name: 'Slow',         parameter: null },
  { weapon_name: 'Slug Gun',                keyword_name: 'Crit Damage',  parameter: null },
  { weapon_name: 'SRSF Rifle',              keyword_name: 'Slow',         parameter: null },
];
