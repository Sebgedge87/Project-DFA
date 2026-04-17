export interface StatDef {
  title: string;
  description: string;
}

// Verify descriptions against rules source before shipping.
export const STAT_DEFINITIONS: Record<string, StatDef> = {
  ACT: { title: 'Actions (ACT)', description: 'How many actions this model can take per activation. More actions = more flexibility each turn.' },
  MOV: { title: 'Movement (MOV)', description: 'How many inches this model can move per Move action. Higher is faster.' },
  MEL: { title: 'Melee (MEL)', description: 'Target number for melee attack rolls. Roll this or higher on a d10 to hit in close combat.' },
  RAN: { title: 'Ranged (RAN)', description: 'Target number for ranged attack rolls. Roll this or higher on a d10 to hit at range.' },
  DEF: { title: 'Defence (DEF)', description: 'Target number for defence rolls. Roll this or higher on a d10 to avoid a hit.' },
  HP:  { title: 'Hit Points (HP)', description: 'How much damage this model can take before being removed. Each wound reduces HP by 1.' },
};

export const WEAPON_COLUMN_DEFINITIONS: Record<string, StatDef> = {
  Range:    { title: 'Range', description: 'Maximum distance for ranged attacks in inches. "—" means this weapon is melee only.' },
  Att:      { title: 'Attacks (ATT)', description: 'Number of attack dice rolled when this weapon is used.' },
  Dmg:      { title: 'Damage (DMG)', description: 'Wounds inflicted on a successful hit.' },
  AP:       { title: 'Armour Piercing (AP)', description: 'Modifier applied to the target\'s Defence roll. Negative values make it harder to defend.' },
  Keywords: { title: 'Keywords', description: 'Special rules that modify how this weapon behaves. Hover individual keywords for details.' },
};

// Verify descriptions against rules source before shipping.
export const KEYWORD_DEFINITIONS: Record<string, StatDef> = {
  Mobile:        { title: 'Mobile', description: 'Can move and shoot in the same activation without penalty.' },
  Slow:          { title: 'Slow', description: 'Cannot move and shoot in the same activation.' },
  Blast:         { title: 'Blast', description: 'Hits all models within the listed radius in inches.' },
  Rending:       { title: 'Rending', description: 'Rolls of 6 to hit deal one additional automatic wound.' },
  Suppressing:   { title: 'Suppressing', description: 'Each hit places a Suppression token on the target unit.' },
  'Crit Stress': { title: 'Crit Stress', description: 'Critical hits cause a Stress token in addition to normal damage.' },
};
