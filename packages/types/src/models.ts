// Domain models shared across web and mobile

export type UnitRole = 'captain' | 'specialist' | 'core';

export interface Faction {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  lore: string | null;
  color_primary: string;
  color_accent: string;
  image_url: string | null;
  store_url: string | null;
  rulebook_url: string | null;
  sort_order: number;
}

export interface Keyword {
  id: string;
  name: string;
  description: string;
}

export interface WeaponKeyword {
  keyword: Keyword;
  parameter: string | null;
}

export interface Weapon {
  id: string;
  faction_id: string | null;
  name: string;
  range_inches: string | null;
  num_attacks: number;
  damage: string;
  defence_mod: number;
  notes: string | null;
  weapon_keywords: WeaponKeyword[];
}

export interface Ability {
  name: string;
  description: string;
}

export interface UnitType {
  id: string;
  faction_id: string;
  name: string;
  role: UnitRole;
  actions: number;
  movement: number;
  melee_attack: number;
  ranged_attack: number;
  defence: number;
  health: number;
  points: number;
  max_per_army: number | null;
  abilities: Ability[];
  image_url: string | null;
  base_size_mm: number;
  store_url: string | null;
  sort_order: number;
  weapons?: Weapon[];
}

export interface ArmyEntry {
  id: string;
  unit_type: UnitType;
  quantity: number;
}

export interface ArmyList {
  id: string;
  user_id: string;
  faction_id: string;
  name: string;
  notes: string | null;
  points_total: number;
  is_public: boolean;
  share_token: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
}
