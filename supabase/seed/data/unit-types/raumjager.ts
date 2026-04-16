export const raumjagerUnitTypes = [
  {
    faction_slug: 'raumjager',
    name: 'Einsatzkommandant',
    role: 'captain',
    actions: 3, movement: 7, melee_attack: 5, ranged_attack: 4, defence: 6, health: 5,
    points: 104, max_per_army: 1, base_size_mm: 25, sort_order: 1,
    abilities: [
      { name: 'Befehlshaber', description: 'This Model has the Order Keyword.' },
      { name: 'Kinetic Shield', description: '8+ Shield Save against Ranged Attacks only.' },
      { name: 'Vorrücken!', description: 'Friendly Models that Activate within 6" of this Model may add 2" to their Movement.' },
      { name: 'Reaktionskraft', description: 'All Models in this Team are considered to be 3" further away when selected as the Target of a Ranged Attack.' },
    ],
  },
  {
    faction_slug: 'raumjager',
    name: 'Flammenjäger',
    role: 'specialist',
    actions: 2, movement: 7, melee_attack: 5, ranged_attack: 4, defence: 6, health: 5,
    points: 102, max_per_army: 4, base_size_mm: 25, sort_order: 2,
    abilities: [
      { name: 'Kinetic Shield', description: '8+ Shield Save against Ranged Attacks only.' },
      { name: 'Überlastung!', description: 'This Model may ignore the Flamer Slow Keyword. If this Model performs two Ranged Attack Actions it gains +1 Stress.' },
    ],
  },
  {
    faction_slug: 'raumjager',
    name: 'Totenjäger',
    role: 'specialist',
    actions: 2, movement: 7, melee_attack: 5, ranged_attack: 4, defence: 6, health: 5,
    points: 97, max_per_army: 4, base_size_mm: 25, sort_order: 3,
    abilities: [
      { name: 'Kinetic Shield', description: '8+ Shield Save against Ranged Attacks only.' },
      { name: 'Gravatic Stabilisers', description: "This model's Ranged Attacks gain the Mobile Keyword." },
    ],
  },
  {
    faction_slug: 'raumjager',
    name: 'Plasmajäger',
    role: 'specialist',
    actions: 2, movement: 7, melee_attack: 5, ranged_attack: 4, defence: 6, health: 5,
    points: 99, max_per_army: 4, base_size_mm: 25, sort_order: 4,
    abilities: [
      { name: 'Kinetic Shield', description: '8+ Shield Save against Ranged Attacks only.' },
      { name: 'Thermal Optics', description: 'Ignores Intervening Terrain.' },
    ],
  },
  {
    faction_slug: 'raumjager',
    name: 'Kampfsanitäter',
    role: 'core',
    actions: 3, movement: 7, melee_attack: 5, ranged_attack: 5, defence: 6, health: 5,
    points: 100, max_per_army: 1, base_size_mm: 25, sort_order: 5,
    abilities: [
      { name: 'Kinetic Shield', description: '8+ Shield Save against Ranged Attacks only.' },
      { name: 'Medic!', description: 'Action: This model or a model in base contact may heal d5 wounds.' },
      { name: 'Inspiring Presence', description: 'Friendly Models that activate within 6" of this Model may remove 1 Stress at the start of their Activation.' },
    ],
  },
  {
    faction_slug: 'raumjager',
    name: 'Erfahrener Jäger',
    role: 'core',
    actions: 2, movement: 7, melee_attack: 5, ranged_attack: 4, defence: 6, health: 5,
    points: 98, max_per_army: null, base_size_mm: 25, sort_order: 6,
    abilities: [
      { name: 'Kinetic Shield', description: '8+ Shield Save against Ranged Attacks only.' },
      { name: 'Spurfinder', description: 'This Model has the Order Keyword.' },
      { name: 'Tactical Advisor', description: 'Friendly Models within 4" may re-roll one Ranged Attack die per Action.' },
    ],
  },
  {
    faction_slug: 'raumjager',
    name: 'Eiserne Jäger',
    role: 'core',
    actions: 2, movement: 7, melee_attack: 5, ranged_attack: 4, defence: 6, health: 5,
    points: 97, max_per_army: null, base_size_mm: 25, sort_order: 7,
    abilities: [
      { name: 'Kinetic Shield', description: '8+ Shield Save against Ranged Attacks only.' },
      { name: 'Ausrücken', description: 'When this model performs the Disengage (2) Action it may perform 1 additional Action this Activation.' },
      { name: 'Eiserne Will', description: "At the beginning of this Model's activation you may remove 1 Stress from this Model." },
    ],
  },
];
