export const lesGrognardsUnitTypes = [
  {
    faction_slug: 'les-grognards',
    name: 'Commandant de Ligne',
    role: 'captain',
    actions: 3, movement: 6, melee_attack: 4, ranged_attack: 4, defence: 4, health: 5,
    points: 119, max_per_army: 1, base_size_mm: 25, sort_order: 1,
    abilities: [
      { name: 'Command', description: 'This Model has the Order Keyword.' },
      { name: 'Alert', description: 'May make Reactions whilst it has the Activated token.' },
      { name: 'Kinetic Shield', description: '8+ Shield Save against Ranged Attacks only.' },
      { name: 'Les Troupes de Ligne', description: 'Whenever a model in this team makes a successful Ranged Attack action other friendly models within 4" and LoS may remove 1 stress.' },
    ],
  },
  {
    faction_slug: 'les-grognards',
    name: 'Garde de Kinetic',
    role: 'specialist',
    actions: 2, movement: 7, melee_attack: 5, ranged_attack: 4, defence: 5, health: 5,
    points: 98, max_per_army: 2, base_size_mm: 25, sort_order: 2,
    abilities: [
      { name: 'Overload!', description: 'May re-roll any Ranged Attack die. If you choose to re-roll any dice, at the end of the Action this model receives 1 Stress.' },
    ],
  },
  {
    faction_slug: 'les-grognards',
    name: 'Garde de Grenade',
    role: 'specialist',
    actions: 2, movement: 7, melee_attack: 5, ranged_attack: 4, defence: 5, health: 5,
    points: 113, max_per_army: 2, base_size_mm: 25, sort_order: 3,
    abilities: [
      { name: 'Feu de Pluie!', description: 'This Model may ignore the Slow Keyword. If this Model performs two Ranged Attack Actions it gains +1 Stress.' },
    ],
  },
  {
    faction_slug: 'les-grognards',
    name: 'Garde de Fusioner',
    role: 'specialist',
    actions: 2, movement: 7, melee_attack: 5, ranged_attack: 4, defence: 5, health: 5,
    points: 95, max_per_army: 2, base_size_mm: 25, sort_order: 4,
    abilities: [
      { name: 'Overload!', description: 'May re-roll any Ranged Attack die. If you choose to re-roll any dice, at the end of the Action this model receives 1 Stress.' },
    ],
  },
  {
    faction_slug: 'les-grognards',
    name: 'Garde de Flame',
    role: 'specialist',
    actions: 2, movement: 7, melee_attack: 5, ranged_attack: 4, defence: 5, health: 5,
    points: 104, max_per_army: 2, base_size_mm: 25, sort_order: 5,
    abilities: [
      { name: 'Mur de feu!', description: 'This Model may ignore the Slow Keyword. If this Model performs two Ranged Attack Actions it gains +1 Stress.' },
    ],
  },
  {
    faction_slug: 'les-grognards',
    name: "Garde d'Assaut",
    role: 'core',
    actions: 2, movement: 7, melee_attack: 4, ranged_attack: 4, defence: 5, health: 5,
    points: 106, max_per_army: null, base_size_mm: 25, sort_order: 6,
    abilities: [
      { name: 'Deadly Precision', description: 'This model gains Crit Damage on all Melee Attacks.' },
    ],
  },
  {
    faction_slug: 'les-grognards',
    name: 'Officier de Coordination',
    role: 'core',
    actions: 2, movement: 7, melee_attack: 5, ranged_attack: 4, defence: 5, health: 5,
    points: 97, max_per_army: 2, base_size_mm: 25, sort_order: 7,
    abilities: [
      { name: 'Comms', description: 'A Model with the Order Keyword may issue an order to models within 6" of this model following all of the rules for issuing orders.' },
      { name: 'Volley Fire', description: 'All Friendly Models within 4" and LoS of this Model may re-roll one Ranged Attack die per Ranged Attack Action.' },
    ],
  },
  {
    faction_slug: 'les-grognards',
    name: 'Infirmier de Combat',
    role: 'core',
    actions: 3, movement: 7, melee_attack: 5, ranged_attack: 4, defence: 5, health: 5,
    points: 97, max_per_army: 2, base_size_mm: 25, sort_order: 8,
    abilities: [
      { name: 'Medic!', description: 'Action: The bearer or a model in base contact may heal d5 wounds.' },
      { name: 'Through Grit Alone!', description: 'Action: Friendly models within 6" may remove 1 Stress.' },
    ],
  },
  {
    faction_slug: 'les-grognards',
    name: 'Sergent de Ligne',
    role: 'core',
    actions: 2, movement: 7, melee_attack: 5, ranged_attack: 4, defence: 5, health: 5,
    points: 93, max_per_army: 2, base_size_mm: 25, sort_order: 9,
    abilities: [
      { name: 'Inspiring Presence', description: 'Friendly Models that activate within 6" of this Model may remove 1 Stress at the start of their Activation.' },
      { name: 'Push on!', description: 'Friendly Models that Activate within 4" of this Model may add 2" to their Movement.' },
    ],
  },
  {
    faction_slug: 'les-grognards',
    name: 'Marqueur de Mort',
    role: 'core',
    actions: 2, movement: 7, melee_attack: 5, ranged_attack: 3, defence: 5, health: 5,
    points: 92, max_per_army: null, base_size_mm: 25, sort_order: 10,
    abilities: [
      { name: 'Sharpshooter', description: 'Ignores Intervening Terrain when making a Ranged Attack.' },
      { name: 'Precision Shot', description: "This model's ranged attacks gain the Keyword Crit AP." },
    ],
  },
  {
    faction_slug: 'les-grognards',
    name: 'Vétéran de Ligne',
    role: 'core',
    actions: 2, movement: 6, melee_attack: 5, ranged_attack: 4, defence: 5, health: 5,
    points: 93, max_per_army: 4, base_size_mm: 25, sort_order: 11,
    abilities: [
      { name: 'Kinetic Shield', description: '8+ Shield Roll against Ranged attacks.' },
      { name: 'Veteran', description: 'Roll a d10. On 6+ this model may make an additional Action once per Activation.' },
    ],
  },
  {
    faction_slug: 'les-grognards',
    name: 'Voltigeur',
    role: 'core',
    actions: 2, movement: 8, melee_attack: 5, ranged_attack: 4, defence: 5, health: 5,
    points: 93, max_per_army: null, base_size_mm: 25, sort_order: 12,
    abilities: [
      { name: 'Skirmisher', description: 'This Model ignores the effects of Difficult Ground and receives an additional +1 to Defence Rolls when in Cover.' },
    ],
  },
];
