# Death Fields Arena — Game Data
## GAMEDATA.md — Seed Reference for All Six Factions
> Feed this file to Claude Code with: "Read GAMEDATA.md and generate all seed data files under supabase/seed/data/"

---

## Keywords (Universal)

These apply across all factions and must be seeded into the `keywords` table first.

| name | description |
|------|-------------|
| Blast (X) | Causes 1 additional point of Damage for each successful hit to all Models within X" of the original Target. Models wounded are Knocked Back directly away from the original target. |
| Cavalry | Model may not move vertically under any circumstances unless via ramps or stairs. May not Climb or use Ladders, but may Jump. |
| Charged (X) | Model or weapon may make a Charged Shot Action (2). Increases damage of each successful hit by X. Attacking model receives 1 Stress after. |
| Crit Damage | Attacker gains an extra point of Damage for every natural roll of a 0. |
| Crit Modifier | Attacker gains an additional -1 Armour Penetration for every natural roll of a 0. |
| Crit Stress | Defender immediately receives 1 Stress for every natural roll of a 0 in the Attacker's Attack roll. |
| Crit AP | Attacker gains an additional -1 Armour Penetration for every natural roll of a 0. |
| Ignores Cover | Attack prevents the Defender from gaining any benefit of Cover or Defensive Positions. |
| Ignores Intervening | Attack ignores the negative modifier from Intervening Terrain. |
| Immobile | Model may not make Move Actions under any circumstances and is never Knocked Back. |
| Knock Back | Models targeted are Knocked Back an additional 1" for each damage caused. |
| Large Target | All Ranged Attacks targeting this model gain +1 to Attack rolls and gain Ignores Intervening. |
| Mobile | Weapon ignores the negative modifier to Ranged Attack rolls for having performed a Move action prior to the Ranged Attack Action during the same Activation. |
| Order | Model may issue an Order to another Model within 6", transferring one available Action. Only models with the Order keyword may use this. Receiving model must not have an Activation Token. |
| Shield Breaker | Prevents the Defender from making any Shield Saves against this Attack. |
| Shock | Defender immediately receives 1 Stress for each successful hit in the Ranged or Melee Attack roll. |
| Slow | Ranged Weapons with this keyword may only make one Ranged Attack Action per Activation. |
| Split Fire (X) | Model may choose multiple targets within X" of one another. Split total Attacks between targets. Resolve sequence separately for each target. |
| Steadfast | Model is not Knocked Back at the end of Ranged or Melee Attack Sequences. |
| Template | Does not measure range. Place template with small end touching Attacker's base. Models at least partially under template are hit. Models hit may not make Fire Back Reaction. |
| Weapons Platform | All Actions become Action (2). Model cannot use the Interact Action. |
| One Use | This weapon may only be used once per game. |

---

## Faction 1 — The Bulldogs

```json
{
  "slug": "bulldogs",
  "name": "The Bulldogs",
  "tagline": "The Greatest Sport is War",
  "color_primary": "8B1A1A",
  "color_accent": "C4943A",
  "store_url": "https://www.wargamesatlantic.com/products/bulldogs",
  "rulebook_url": "https://www.wargamesatlantic.com/products/death-fields-arena-rules"
}
```

### Bulldogs — Weapons

| name | range_inches | num_attacks | damage | defence_mod | keywords |
|------|-------------|-------------|--------|-------------|----------|
| Bayonet | Melee | 2 | 1 | -1 | |
| Bionic Arm | Melee | 2 | 2 | -2 | Crit Damage |
| Boot Knife | Melee | 3 | 1 | -1 | |
| Bulldog Rifle | 20" | 2 | 1 | -1 | |
| Electrocannon | 16" | 3 | 1 | 0 | Shock, Slow |
| Energy Sabre | Melee | 3 | 2 | -2 | |
| Fists | Melee | 2 | 1 | 0 | |
| Grenade Launcher | 20" | 2 | 2 | +1 | Blast (3), Slow |
| L.M.G. | 20" | 4 | 1 | 0 | Crit Stress, Slow |
| Revolver | 8" | 2 | 2 | -1 | Mobile |
| SMG | 12" | 4 | 1 | 0 | Mobile |
| The Whistler | Template | 1 | 2 | 0 | Shock, Template, Slow |

### Bulldogs — Units

#### The Red Devil — Captain (max 1)
| stat | value |
|------|-------|
| actions | 3 |
| movement | 7 |
| melee_attack | 5 |
| ranged_attack | 5 |
| defence | 4 |
| health | 5 |
| points | 124 |
| role | captain |
| max_per_army | 1 |
| base_size_mm | 25 |
| equipment | Revolver, Energy Sabre |

**Abilities:**
- **Command** — This Model has the Order Keyword.
- **Inspiring Presence** — When this Model Activates, other Friendly Models within 6" may remove 1 Stress.
- **Killer's Instinct** — This Model may re-roll any of its Melee Attack rolls.
- **Who Dares Wins** — Models in this team ignore the Stress Modifier to their Movement stat.

---

#### Master of The Line — Captain (max 1)
| stat | value |
|------|-------|
| actions | 3 |
| movement | 7 |
| melee_attack | 5 |
| ranged_attack | 5 |
| defence | 4 |
| health | 5 |
| points | 103 |
| role | captain |
| max_per_army | 1 |
| base_size_mm | 25 |
| equipment | Bulldog Rifle, Bayonet |

**Abilities:**
- **Command** — This Model has the Order Keyword.
- **On My Mark!** — Friendly Models within 4" may re-roll one Ranged Attack die per Action.
- **Old Hand** — This Model counts as having 1 less Stress.
- **Volley Fire!** — Models in this team gain +1 Attack during Ranged Attacks when within 2" of a Friendly Model. Additionally Models in this team do not receive Stress from making a Fire Back Reaction.

---

#### The Old Sweat — Captain (max 1)
| stat | value |
|------|-------|
| actions | 3 |
| movement | 7 |
| melee_attack | 5 |
| ranged_attack | 5 |
| defence | 4 |
| health | 5 |
| points | 115 |
| role | captain |
| max_per_army | 1 |
| base_size_mm | 25 |
| equipment | SMG, Bionic Arm |

**Abilities:**
- **Command** — This Model has the Order Keyword.
- **Veteran** — This Model may re-roll one die in their Attack rolls and Defence rolls.
- **Keep Moving!** — Friendly Models that Activate within 4" of this Model may add 2" to their Movement.
- **Stiff Upper Lip** — At the start of their Activation, Models in this team may remove 1 Stress. When a Model in this Team makes a Recover Action they roll 2 d5 and select the highest result.

---

#### L.M.G. Gunner — Specialist (max 2)
| stat | value |
|------|-------|
| actions | 2 |
| movement | 7 |
| melee_attack | 5 |
| ranged_attack | 5 |
| defence | 4 |
| health | 5 |
| points | 95 |
| role | specialist |
| max_per_army | 2 |
| base_size_mm | 25 |
| equipment | L.M.G., Fists |

**Abilities:**
- **Saturated Fire** — May re-roll any Ranged Attack die. If you choose to re-roll any dice, at the end of the Action this model receives 1 Stress.

---

#### Grenadier — Specialist (max 2)
| stat | value |
|------|-------|
| actions | 2 |
| movement | 7 |
| melee_attack | 5 |
| ranged_attack | 5 |
| defence | 4 |
| health | 5 |
| points | 96 |
| role | specialist |
| max_per_army | 2 |
| base_size_mm | 25 |
| equipment | Grenade Launcher, Fists |

**Abilities:**
- **Buckshee Ammo** — May re-roll one failed Ranged Attack Dice per Ranged Attack.

---

#### Electro Gunner — Specialist (max 2)
| stat | value |
|------|-------|
| actions | 2 |
| movement | 7 |
| melee_attack | 5 |
| ranged_attack | 5 |
| defence | 4 |
| health | 5 |
| points | 93 |
| role | specialist |
| max_per_army | 2 |
| base_size_mm | 25 |
| equipment | Electrocannon, Fists |

**Abilities:** None

---

#### Whistler — Specialist (max 2)
| stat | value |
|------|-------|
| actions | 2 |
| movement | 7 |
| melee_attack | 5 |
| ranged_attack | 5 |
| defence | 4 |
| health | 5 |
| points | 105 |
| role | specialist |
| max_per_army | 2 |
| base_size_mm | 25 |
| equipment | The Whistler, Fists |

**Abilities:**
- **On the Boil** — This Model may ignore the Slow Keyword. If this Model performs two Ranged Attack Actions it gains +1 Stress.

---

#### Commando — Core
| stat | value |
|------|-------|
| actions | 2 |
| movement | 7 |
| melee_attack | 5 |
| ranged_attack | 5 |
| defence | 4 |
| health | 5 |
| points | 95 |
| role | core |
| max_per_army | null |
| base_size_mm | 25 |
| equipment | Bulldog Rifle, Boot Knife |

**Abilities:**
- **Cool in Cover** — This Model gains +1 to their Ranged Attack rolls when in Cover.

---

#### Rifleman — Core
| stat | value |
|------|-------|
| actions | 2 |
| movement | 7 |
| melee_attack | 5 |
| ranged_attack | 5 |
| defence | 4 |
| health | 5 |
| points | 93 |
| role | core |
| max_per_army | null |
| base_size_mm | 25 |
| equipment | Bulldog Rifle, Bayonet |

**Abilities:**
- **In the Line** — This Model ignores the Stress Modifier to Ranged Attack rolls when within 2" of another Friendly Model.

---

#### Tommy — Core
| stat | value |
|------|-------|
| actions | 2 |
| movement | 7 |
| melee_attack | 5 |
| ranged_attack | 5 |
| defence | 4 |
| health | 5 |
| points | 94 |
| role | core |
| max_per_army | null |
| base_size_mm | 25 |
| equipment | Bulldog Rifle, Bayonet |

**Abilities:**
- **Pepper Potting** — When this Model performs a Ranged Attack Action they may make a free 2" Move at the end of the Action. Must follow all of the usual rules for Move Actions.

---

#### Brew Sgt. — Core (max 2)
| stat | value |
|------|-------|
| actions | 2 |
| movement | 7 |
| melee_attack | 5 |
| ranged_attack | 5 |
| defence | 4 |
| health | 5 |
| points | 95 |
| role | core |
| max_per_army | 2 |
| base_size_mm | 25 |
| equipment | Bulldog Rifle, Fists |

**Abilities:**
- **Built on Tea** — Friendly Models that Activate within 4" of this Model may remove 1 Stress at the start of their Activation.
- **Cuppa?** — Action: Any Friendly Model in base contact with this Model, including this Model, may perform this Action. Remove all Stress from this Model.

---

#### Combat Medic — Core (max 2)
| stat | value |
|------|-------|
| actions | 3 |
| movement | 7 |
| melee_attack | 5 |
| ranged_attack | 5 |
| defence | 4 |
| health | 5 |
| points | 95 |
| role | core |
| max_per_army | 2 |
| base_size_mm | 25 |
| equipment | SMG, Fists |

**Abilities:**
- **Medic!** — Action: This model or a model in base contact may heal d5 wounds.

---

## Faction 2 — Les Grognards

```json
{
  "slug": "les-grognards",
  "name": "Les Grognards",
  "tagline": "Vive la France!",
  "color_primary": "1A2B5E",
  "color_accent": "C4943A",
  "store_url": "https://www.wargamesatlantic.com/products/les-grognards",
  "rulebook_url": "https://www.wargamesatlantic.com/products/death-fields-arena-rules"
}
```

### Les Grognards — Weapons

| name | range_inches | num_attacks | damage | defence_mod | keywords |
|------|-------------|-------------|--------|-------------|----------|
| Bayonet | Melee | 2 | 1 | -1 | |
| Chain Sabre | Melee | 3 | 2 | -1 | |
| Energy Pistol | 8" | 2 | 2 | -1 | |
| Fists | Melee | 2 | 1 | 0 | |
| Flamer | Template | 1 | d5 | 0 | Template, Slow |
| Frag Grenade | 8" | 1 | 2 | -1 | Blast (3), One Use |
| Fusion Gun | 12" | 2 | 3 | 0 | Crit AP, Ignores Cover, Slow |
| Grenade Launcher | 20" | 3 | 2 | -1 | Blast (3), Slow |
| Grognard Rifle | 20" | 2 | 1 | 0 | Crit Damage |
| Kinetic Cannon | 16" | 3 | 2 | 0 | Knock Back, Slow |

### Les Grognards — Units

#### Commandant de Ligne — Captain (max 1)
| stat | value |
|------|-------|
| actions | 3 |
| movement | 6 |
| melee_attack | 4 |
| ranged_attack | 4 |
| defence | 4 |
| health | 5 |
| points | 119 |
| role | captain |
| max_per_army | 1 |
| base_size_mm | 25 |
| equipment | Chain Sabre, Energy Pistol |

**Abilities:**
- **Command** — This Model has the Order Keyword.
- **Alert** — May make Reactions whilst it has the Activated token.
- **Kinetic Shield** — 8+ Shield Save against Ranged Attacks only.
- **Les Troupes de Ligne** — Whenever a model in this team makes a successful Ranged Attack action other friendly models within 4" and LoS may remove 1 stress.

---

#### Garde de Kinetic — Specialist (max 2)
| stat | value |
|------|-------|
| actions | 2 |
| movement | 7 |
| melee_attack | 5 |
| ranged_attack | 4 |
| defence | 5 |
| health | 5 |
| points | 98 |
| role | specialist |
| max_per_army | 2 |
| base_size_mm | 25 |
| equipment | Kinetic Cannon, Fists |

**Abilities:**
- **Overload!** — May re-roll any Ranged Attack die. If you choose to re-roll any dice, at the end of the Action this model receives 1 Stress.

---

#### Garde de Grenade — Specialist (max 2)
| stat | value |
|------|-------|
| actions | 2 |
| movement | 7 |
| melee_attack | 5 |
| ranged_attack | 4 |
| defence | 5 |
| health | 5 |
| points | 113 |
| role | specialist |
| max_per_army | 2 |
| base_size_mm | 25 |
| equipment | Grenade Launcher, Fists |

**Abilities:**
- **Feu de Pluie!** — This Model may ignore the Slow Keyword. If this Model performs two Ranged Attack Actions it gains +1 Stress.

---

#### Garde de Fusioner — Specialist (max 2)
| stat | value |
|------|-------|
| actions | 2 |
| movement | 7 |
| melee_attack | 5 |
| ranged_attack | 4 |
| defence | 5 |
| health | 5 |
| points | 95 |
| role | specialist |
| max_per_army | 2 |
| base_size_mm | 25 |
| equipment | Fusion Gun, Fists |

**Abilities:**
- **Overload!** — May re-roll any Ranged Attack die. If you choose to re-roll any dice, at the end of the Action this model receives 1 Stress.

---

#### Garde de Flame — Specialist (max 2)
| stat | value |
|------|-------|
| actions | 2 |
| movement | 7 |
| melee_attack | 5 |
| ranged_attack | 4 |
| defence | 5 |
| health | 5 |
| points | 104 |
| role | specialist |
| max_per_army | 2 |
| base_size_mm | 25 |
| equipment | Flamer, Fists |

**Abilities:**
- **Mur de feu!** — This Model may ignore the Slow Keyword. If this Model performs two Ranged Attack Actions it gains +1 Stress.

---

#### Garde d'Assaut — Core
| stat | value |
|------|-------|
| actions | 2 |
| movement | 7 |
| melee_attack | 4 |
| ranged_attack | 4 |
| defence | 5 |
| health | 5 |
| points | 106 |
| role | core |
| max_per_army | null |
| base_size_mm | 25 |
| equipment | Chain Sabre, Energy Pistol, Frag Grenade |

**Abilities:**
- **Deadly Precision** — This model gains Crit Damage on all Melee Attacks.

---

#### Officier de Coordination — Core (max 2)
| stat | value |
|------|-------|
| actions | 2 |
| movement | 7 |
| melee_attack | 5 |
| ranged_attack | 4 |
| defence | 5 |
| health | 5 |
| points | 97 |
| role | core |
| max_per_army | 2 |
| base_size_mm | 25 |
| equipment | Grognard Rifle, Bayonet |

**Abilities:**
- **Comms** — A Model with the Order Keyword may issue an order to models within 6" of this model following all of the rules for issuing orders.
- **Volley Fire** — All Friendly Models within 4" and LoS of this Model may re-roll one Ranged Attack die per Ranged Attack Action.

---

#### Infirmier de Combat — Core (max 2)
| stat | value |
|------|-------|
| actions | 3 |
| movement | 7 |
| melee_attack | 5 |
| ranged_attack | 4 |
| defence | 5 |
| health | 5 |
| points | 97 |
| role | core |
| max_per_army | 2 |
| base_size_mm | 25 |
| equipment | Grognard Rifle, Bayonet |

**Abilities:**
- **Medic!** — Action: The bearer or a model in base contact may heal d5 wounds.
- **Through Grit Alone!** — Action: Friendly models within 6" may remove 1 Stress.

---

#### Sergent de Ligne — Core (max 2)
| stat | value |
|------|-------|
| actions | 2 |
| movement | 7 |
| melee_attack | 5 |
| ranged_attack | 4 |
| defence | 5 |
| health | 5 |
| points | 93 |
| role | core |
| max_per_army | 2 |
| base_size_mm | 25 |
| equipment | Grognard Rifle, Bayonet |

**Abilities:**
- **Inspiring Presence** — Friendly Models that activate within 6" of this Model may remove 1 Stress at the start of their Activation.
- **Push on!** — Friendly Models that Activate within 4" of this Model may add 2" to their Movement.

---

#### Marqueur de Mort — Core
| stat | value |
|------|-------|
| actions | 2 |
| movement | 7 |
| melee_attack | 5 |
| ranged_attack | 3 |
| defence | 5 |
| health | 5 |
| points | 92 |
| role | core |
| max_per_army | null |
| base_size_mm | 25 |
| equipment | Grognard Rifle, Bayonet |

**Abilities:**
- **Sharpshooter** — Ignores Intervening Terrain when making a Ranged Attack.
- **Precision Shot** — This model's ranged attacks gain the Keyword Crit AP.

---

#### Vétéran de Ligne — Core (max 4)
| stat | value |
|------|-------|
| actions | 2 |
| movement | 6 |
| melee_attack | 5 |
| ranged_attack | 4 |
| defence | 5 |
| health | 5 |
| points | 93 |
| role | core |
| max_per_army | 4 |
| base_size_mm | 25 |
| equipment | Grognard Rifle, Bayonet |

**Abilities:**
- **Kinetic Shield** — 8+ Shield Roll against Ranged attacks.
- **Veteran** — Roll a d10. On 6+ this model may make an additional Action once per Activation.

---

#### Voltigeur — Core
| stat | value |
|------|-------|
| actions | 2 |
| movement | 8 |
| melee_attack | 5 |
| ranged_attack | 4 |
| defence | 5 |
| health | 5 |
| points | 93 |
| role | core |
| max_per_army | null |
| base_size_mm | 25 |
| equipment | Grognard Rifle, Bayonet |

**Abilities:**
- **Skirmisher** — This Model ignores the effects of Difficult Ground and receives an additional +1 to Defence Rolls when in Cover.

---

## Faction 3 — Einherjar

```json
{
  "slug": "einherjar",
  "name": "Einherjar",
  "tagline": "The Warriors of Valhalla Take the Field",
  "color_primary": "2B4A7A",
  "color_accent": "C4943A",
  "store_url": "https://www.wargamesatlantic.com/products/einherjar",
  "rulebook_url": "https://www.wargamesatlantic.com/products/death-fields-arena-rules"
}
```

### Einherjar — Weapons

| name | range_inches | num_attacks | damage | defence_mod | keywords |
|------|-------------|-------------|--------|-------------|----------|
| Blood Axe | Melee | 3 | 2 | -1 | Crit Damage |
| Dual Blood Axe | Melee | 4 | 2 | -2 | |
| Fists | Melee | 2 | 1 | 0 | |
| Grenade Launcher | 20" | 3 | 2 | -1 | Blast (3), Slow |
| Heavy Flamer | Template | 1 | d5 | -1 | Slow |
| Knife | Melee | 3 | 1 | -1 | |
| M.A.R. | 16" | 3 | 1 | 0 | Crit AP |
| Shotgun | 8" | 2 | 2 | -1 | |
| Thunder Cannon | 16" | 3 | 2 | -2 | Crit Stress, Slow |

### Einherjar — Units

#### Konungr — Captain (max 1)
| stat | value |
|------|-------|
| actions | 3 |
| movement | 6 |
| melee_attack | 4 |
| ranged_attack | 5 |
| defence | 4 |
| health | 5 |
| points | 106 |
| role | captain |
| max_per_army | 1 |
| base_size_mm | 25 |
| equipment | Blood Axe |

**Abilities:**
- **Hearth-Call** — This Model has the Order Keyword.
- **Svalinn Shield** — This model gains a 8+ shield save and adds +1 extra dice to their Defence rolls in Melee and Ranged combat.
- **Slayer's Instinct** — This Model may re-roll any of its Melee Attack rolls.
- **Shield Wall!** — Models in this Team receive +1 to Defence Rolls when within 2" of another Friendly Model.

---

#### Jarl — Captain (max 2)
| stat | value |
|------|-------|
| actions | 2 |
| movement | 6 |
| melee_attack | 4 |
| ranged_attack | 5 |
| defence | 4 |
| health | 5 |
| points | 101 |
| role | captain |
| max_per_army | 2 |
| base_size_mm | 25 |
| equipment | Blood Axe |

**Abilities:**
- **Hearth-Call** — This Model has the Order Keyword.
- **Svalinn Shield** — This model gains a 8+ shield save and adds +1 dice to their defence rolls in melee and ranged combat.
- **Raid!** — Friendly Models that Activate within 4" of this Model may add 2" to their Movement.

---

#### Berserker — Specialist (max 1)
| stat | value |
|------|-------|
| actions | 2 |
| movement | 6 |
| melee_attack | 4 |
| ranged_attack | 5 |
| defence | 4 |
| health | 5 |
| points | 104 |
| role | specialist |
| max_per_army | 1 |
| base_size_mm | 25 |
| equipment | Dual Blood Axe |

**Abilities:**
- **Slayer's Instinct** — This Model may re-roll any of its Melee Attack rolls.

---

#### Muspel-Warder — Specialist (max 2)
| stat | value |
|------|-------|
| actions | 2 |
| movement | 6 |
| melee_attack | 4 |
| ranged_attack | 5 |
| defence | 4 |
| health | 5 |
| points | 107 |
| role | specialist |
| max_per_army | 2 |
| base_size_mm | 25 |
| equipment | Heavy Flamer, Fists |

**Abilities:**
- **Fury of Muspelheim** — When rolling for damage, roll 2 d5 and choose the highest result.

---

#### Thunder Caller — Specialist (max 2)
| stat | value |
|------|-------|
| actions | 2 |
| movement | 6 |
| melee_attack | 4 |
| ranged_attack | 5 |
| defence | 4 |
| health | 5 |
| points | 101 |
| role | specialist |
| max_per_army | 2 |
| base_size_mm | 25 |
| equipment | Thunder Cannon |

**Abilities:** None

---

#### Sky-Shatterer — Specialist (max 2)
| stat | value |
|------|-------|
| actions | 2 |
| movement | 6 |
| melee_attack | 4 |
| ranged_attack | 5 |
| defence | 4 |
| health | 5 |
| points | 99 |
| role | specialist |
| max_per_army | 2 |
| base_size_mm | 25 |
| equipment | Grenade Launcher, Fists |

**Abilities:** None

---

#### Skald — Core (max 2)
| stat | value |
|------|-------|
| actions | 2 |
| movement | 6 |
| melee_attack | 4 |
| ranged_attack | 5 |
| defence | 4 |
| health | 5 |
| points | 94 |
| role | core |
| max_per_army | 2 |
| base_size_mm | 25 |
| equipment | M.A.R., Fists |

**Abilities:**
- **Skald-Song** — Friendly Models that Activate within 6" of this Model may remove 1 Stress at the start of their Activation.
- **Echoes of Valhalla** — When this Model Activates, Friendly models within 6" may remove 1 Stress.

---

#### Foringjar — Core
| stat | value |
|------|-------|
| actions | 2 |
| movement | 6 |
| melee_attack | 4 |
| ranged_attack | 5 |
| defence | 4 |
| health | 5 |
| points | 99 |
| role | core |
| max_per_army | null |
| base_size_mm | 25 |
| equipment | M.A.R., Knife |

**Abilities:**
- **Stalwart** — This Model is not Knocked Back as the result of a Ranged Attack.

---

#### Hird — Core
| stat | value |
|------|-------|
| actions | 2 |
| movement | 6 |
| melee_attack | 4 |
| ranged_attack | 5 |
| defence | 4 |
| health | 5 |
| points | 89 |
| role | core |
| max_per_army | null |
| base_size_mm | 25 |
| equipment | Shotgun, Fists |

**Abilities:**
- **Steady-Hand** — May re-roll one failed Ranged Attack Dice per Ranged Attack.

---

#### Bondsman — Core
| stat | value |
|------|-------|
| actions | 2 |
| movement | 6 |
| melee_attack | 4 |
| ranged_attack | 5 |
| defence | 4 |
| health | 5 |
| points | 86 |
| role | core |
| max_per_army | null |
| base_size_mm | 25 |
| equipment | M.A.R., Fists |

**Abilities:** None

---

## Faction 4 — Ooh Rah

```json
{
  "slug": "ooh-rah",
  "name": "Ooh Rah",
  "tagline": "Get Some!",
  "color_primary": "2B4A1A",
  "color_accent": "C4943A",
  "store_url": "https://www.wargamesatlantic.com/products/ooh-rah",
  "rulebook_url": "https://www.wargamesatlantic.com/products/death-fields-arena-rules"
}
```

### Ooh Rah — Weapons

| name | range_inches | num_attacks | damage | defence_mod | keywords |
|------|-------------|-------------|--------|-------------|----------|
| Fists | Melee | 2 | 1 | 0 | |
| Flamer | Template | 1 | d5 | 0 | Template, Slow |
| Hi-Vol. Auto Gun | 20" | 4 | 1 | -1 | Ignores Cover, Crit Stress, Slow |
| Hi-Vol. Carbine | 20" | 2 | 1 | 0 | Ignores Cover, Mobile |
| Hi-Vol. Carbine (Auto) | 12" | 3 | 1 | 0 | Ignores Cover, Mobile |
| Hi-Vol. Pistol | 8" | 4 | 1 | 0 | Ignores Cover, Mobile |
| Hi-Vol. SMG | 16" | 4 | 1 | 0 | Ignores Cover, Mobile |
| Hi-Vol. Sniper Rifle | 28" | 1 | 5 | +2 | Ignores Cover, Slow |
| Shotgun | 8" | 2 | 2 | -1 | Knock Back, Mobile |
| Shock Grenades | 8" | 3 | 0 | 0 | Shock, Mobile |

### Ooh Rah — Units

#### Lieutenant — Captain (max 1)
| stat | value |
|------|-------|
| actions | 3 |
| movement | 7 |
| melee_attack | 5 |
| ranged_attack | 5 |
| defence | 4 |
| health | 5 |
| points | 108 |
| role | captain |
| max_per_army | 1 |
| base_size_mm | 25 |
| equipment | Hi-Vol. Pistol, Fists |

**Abilities:**
- **Command** — This Model has the Order Keyword.
- **Semper-Fi!** — When this Model Activates, Friendly models within 6" may remove 1 Stress.
- **Target Overlay** — Friendly Models within 6" ignore Intervening Terrain modifier during Ranged Attack Actions.
- **Leathernecks** — Models in this team may re-roll one die per Defence Roll.

---

#### Staff Sergeant — Captain (max 1)
| stat | value |
|------|-------|
| actions | 3 |
| movement | 7 |
| melee_attack | 5 |
| ranged_attack | 5 |
| defence | 5 |
| health | 5 |
| points | 108 |
| role | captain |
| max_per_army | 1 |
| base_size_mm | 25 |
| equipment | Hi-Vol. SMG, Fists |

**Abilities:**
- **Command** — This Model has the Order Keyword.
- **Inspiring Presence** — Models that activate within 6" of this model may remove 1 stress at the start of their Activation.
- **Tactical Advisor** — Friendly Models within 4" may re-roll one Ranged Attack die per Action.

---

#### Sergeant — Captain (max 1)
| stat | value |
|------|-------|
| actions | 3 |
| movement | 7 |
| melee_attack | 5 |
| ranged_attack | 5 |
| defence | 5 |
| health | 5 |
| points | 99 |
| role | captain |
| max_per_army | 1 |
| base_size_mm | 25 |
| equipment | Hi-Vol. Carbine, Hi-Vol. Carbine (Auto), Fists |

**Abilities:**
- **Command** — This Model has the Order Keyword.
- **Ooh Rah!** — Action: Friendly Models within 6" may remove d5 Stress.

---

#### Auto Laser Rifleman — Specialist (max 2)
| stat | value |
|------|-------|
| actions | 2 |
| movement | 7 |
| melee_attack | 5 |
| ranged_attack | 5 |
| defence | 5 |
| health | 5 |
| points | 99 |
| role | specialist |
| max_per_army | 2 |
| base_size_mm | 25 |
| equipment | Hi-Vol. Auto Gun, Fists |

**Abilities:**
- **Overload!** — May re-roll any Ranged Attack die. If you choose to re-roll any dice, at the end of the Action this model receives 1 Stress.

---

#### Flamer Rifleman — Specialist (max 2)
| stat | value |
|------|-------|
| actions | 2 |
| movement | 7 |
| melee_attack | 5 |
| ranged_attack | 5 |
| defence | 5 |
| health | 5 |
| points | 98 |
| role | specialist |
| max_per_army | 2 |
| base_size_mm | 25 |
| equipment | Flamer, Fists |

**Abilities:**
- **Burn 'em Out!** — This Model may ignore the Flamer Slow Keyword. If this Model performs two Ranged Attack Actions it gains +1 Stress.

---

#### Sniper — Specialist (max 2)
| stat | value |
|------|-------|
| actions | 2 |
| movement | 7 |
| melee_attack | 5 |
| ranged_attack | 3 |
| defence | 5 |
| health | 5 |
| points | 110 |
| role | specialist |
| max_per_army | 2 |
| base_size_mm | 25 |
| equipment | Hi-Vol. Sniper Rifle, Fists |

**Abilities:**
- **Digital Optics** — This Model may re-roll one Failed Ranged Attack die.
- **Concealed Position** — This Model receives an additional +1 to Defence Rolls when benefiting from Cover.

---

#### Breacher — Core (max 2)
| stat | value |
|------|-------|
| actions | 2 |
| movement | 7 |
| melee_attack | 5 |
| ranged_attack | 5 |
| defence | 5 |
| health | 5 |
| points | 98 |
| role | core |
| max_per_army | 2 |
| base_size_mm | 25 |
| equipment | Shotgun, Shock Grenades, Fists |

**Abilities:** None

---

#### Combat Medic — Core (max 1)
| stat | value |
|------|-------|
| actions | 3 |
| movement | 7 |
| melee_attack | 5 |
| ranged_attack | 5 |
| defence | 5 |
| health | 5 |
| points | 100 |
| role | core |
| max_per_army | 1 |
| base_size_mm | 25 |
| equipment | Hi-Vol. Carbine, Hi-Vol. Carbine (Auto), Fists |

**Abilities:**
- **Medic!** — Action: The bearer or a model in base contact may heal d5 wounds.
- **Field Surgeon** — Friendly Models within 4" of this Model gain an additional 8+ Save against all Damage.

---

#### Fire Team Leader — Core (special limit)
| stat | value |
|------|-------|
| actions | 2 |
| movement | 7 |
| melee_attack | 5 |
| ranged_attack | 5 |
| defence | 5 |
| health | 5 |
| points | 94 |
| role | core |
| max_per_army | null |
| base_size_mm | 25 |
| equipment | Hi-Vol. Carbine, Hi-Vol. Carbine (Auto), Fists |

**Abilities:**
- **Command** — This Model has the Order Keyword.
- **Fire Coordinator** — Friendly Models within 4" of this Model gain +1 to Ranged Attack rolls.
- **Fire Team Leader (x)** — May include 1 Fire Team Leader in Team for every 2 Rifleman.

---

#### Rifleman — Core
| stat | value |
|------|-------|
| actions | 2 |
| movement | 7 |
| melee_attack | 5 |
| ranged_attack | 5 |
| defence | 5 |
| health | 5 |
| points | 89 |
| role | core |
| max_per_army | null |
| base_size_mm | 25 |
| equipment | Hi-Vol. Carbine, Hi-Vol. Carbine (Auto), Fists |

**Abilities:**
- **It's What We Do** — May re-roll one Ranged Attack Dice.

---

## Faction 5 — Raumjäger

```json
{
  "slug": "raumjager",
  "name": "Raumjäger",
  "tagline": "Death From Above",
  "color_primary": "4A3A1A",
  "color_accent": "C4943A",
  "store_url": "https://www.wargamesatlantic.com/products/raumjager",
  "rulebook_url": "https://www.wargamesatlantic.com/products/death-fields-arena-rules"
}
```

### Raumjäger — Weapons

| name | range_inches | num_attacks | damage | defence_mod | keywords |
|------|-------------|-------------|--------|-------------|----------|
| Auto Rifle | 20" | 5 | 1 | 0 | Crit Stress, Slow |
| Energy Pistol | 8" | 2 | 2 | -1 | Mobile |
| Fists | Melee | 2 | 1 | 0 | |
| Flamer | Template | 1 | d5 | 0 | Template, Slow |
| Laserkarabiner | 20" | 2 | 1 | -1 | Crit Damage |
| Laserkarabiner (Auto) | 12" | 3 | 1 | -1 | Crit Stress |
| Plasgun | 16" | 3 | 2 | -1 | Slow, Charged (1) |

### Raumjäger — Units

#### Einsatzkommandant — Captain (max 1)
| stat | value |
|------|-------|
| actions | 3 |
| movement | 7 |
| melee_attack | 5 |
| ranged_attack | 4 |
| defence | 6 |
| health | 5 |
| points | 104 |
| role | captain |
| max_per_army | 1 |
| base_size_mm | 25 |
| equipment | Energy Pistol, Fists |

**Abilities:**
- **Befehlshaber** — This Model has the Order Keyword.
- **Kinetic Shield** — 8+ Shield Save against Ranged Attacks only.
- **Vorrücken!** — Friendly Models that Activate within 6" of this Model may add 2" to their Movement.
- **Reaktionskraft** — All Models in this Team are considered to be 3" further away when selected as the Target of a Ranged Attack.

---

#### Flammenjäger — Specialist (max 4)
| stat | value |
|------|-------|
| actions | 2 |
| movement | 7 |
| melee_attack | 5 |
| ranged_attack | 4 |
| defence | 6 |
| health | 5 |
| points | 102 |
| role | specialist |
| max_per_army | 4 |
| base_size_mm | 25 |
| equipment | Flamer, Fists |

**Abilities:**
- **Kinetic Shield** — 8+ Shield Save against Ranged Attacks only.
- **Überlastung!** — This Model may ignore the Flamer Slow Keyword. If this Model performs two Ranged Attack Actions it gains +1 Stress.

---

#### Totenjäger — Specialist (max 4)
| stat | value |
|------|-------|
| actions | 2 |
| movement | 7 |
| melee_attack | 5 |
| ranged_attack | 4 |
| defence | 6 |
| health | 5 |
| points | 97 |
| role | specialist |
| max_per_army | 4 |
| base_size_mm | 25 |
| equipment | Auto Rifle, Fists |

**Abilities:**
- **Kinetic Shield** — 8+ Shield Save against Ranged Attacks only.
- **Gravatic Stabilisers** — This model's Ranged Attacks gain the Mobile Keyword.

---

#### Plasmajäger — Specialist (max 4)
| stat | value |
|------|-------|
| actions | 2 |
| movement | 7 |
| melee_attack | 5 |
| ranged_attack | 4 |
| defence | 6 |
| health | 5 |
| points | 99 |
| role | specialist |
| max_per_army | 4 |
| base_size_mm | 25 |
| equipment | Plasgun, Fists |

**Abilities:**
- **Kinetic Shield** — 8+ Shield Save against Ranged Attacks only.
- **Thermal Optics** — Ignores Intervening Terrain.

---

#### Kampfsanitäter — Core (max 1)
| stat | value |
|------|-------|
| actions | 3 |
| movement | 7 |
| melee_attack | 5 |
| ranged_attack | 5 |
| defence | 6 |
| health | 5 |
| points | 100 |
| role | core |
| max_per_army | 1 |
| base_size_mm | 25 |
| equipment | Laserkarabiner, Laserkarabiner (Auto), Fists |

**Abilities:**
- **Kinetic Shield** — 8+ Shield Save against Ranged Attacks only.
- **Medic!** — Action: This model or a model in base contact may heal d5 wounds.
- **Inspiring Presence** — Friendly Models that activate within 6" of this Model may remove 1 Stress at the start of their Activation.

---

#### Erfahrener Jäger — Core
| stat | value |
|------|-------|
| actions | 2 |
| movement | 7 |
| melee_attack | 5 |
| ranged_attack | 4 |
| defence | 6 |
| health | 5 |
| points | 98 |
| role | core |
| max_per_army | null |
| base_size_mm | 25 |
| equipment | Laserkarabiner, Laserkarabiner (Auto), Fists |

**Abilities:**
- **Kinetic Shield** — 8+ Shield Save against Ranged Attacks only.
- **Spurfinder** — This Model has the Order Keyword.
- **Tactical Advisor** — Friendly Models within 4" may re-roll one Ranged Attack die per Action.

---

#### Eiserne Jäger — Core
| stat | value |
|------|-------|
| actions | 2 |
| movement | 7 |
| melee_attack | 5 |
| ranged_attack | 4 |
| defence | 6 |
| health | 5 |
| points | 97 |
| role | core |
| max_per_army | null |
| base_size_mm | 25 |
| equipment | Laserkarabiner, Laserkarabiner (Auto), Fists |

**Abilities:**
- **Kinetic Shield** — 8+ Shield Save against Ranged Attacks only.
- **Ausrücken** — When this model performs the Disengage (2) Action it may perform 1 additional Action this Activation.
- **Eiserne Will** — At the beginning of this Model's activation you may remove 1 Stress from this Model.

---

## Faction 6 — The SneakFeet

```json
{
  "slug": "sneakfeet",
  "name": "The SneakFeet",
  "tagline": "The Quietest Pulse in the Arena",
  "color_primary": "2B4A1A",
  "color_accent": "C4943A",
  "store_url": "https://www.wargamesatlantic.com/products/sneakfeet",
  "rulebook_url": "https://www.wargamesatlantic.com/products/death-fields-arena-rules"
}
```

### SneakFeet — Weapons

| name | range_inches | num_attacks | damage | defence_mod | keywords |
|------|-------------|-------------|--------|-------------|----------|
| Fists | Melee | 2 | 1 | 0 | |
| Frag Grenade | 8" | 1 | 3 | -1 | Blast (3) |
| Frying Pan | Melee | 2 | 2 | 0 | Shock |
| Hunting Knife | Melee | 3 | 1 | -1 | |
| LRSF Rifle | 28" | 1 | 5 | -3 | Slow |
| Slug Gun | 16" | 3 | 1 | 0 | Crit Damage |
| SRSF Rifle | 20" | 2 | 2 | -1 | Slow |

### SneakFeet — Units

#### Quiet-flinger — Captain (max 1)
| stat | value |
|------|-------|
| actions | 3 |
| movement | 6 |
| melee_attack | 7 |
| ranged_attack | 3 |
| defence | 6 |
| health | 5 |
| points | 116 |
| role | captain |
| max_per_army | 1 |
| base_size_mm | 25 |
| equipment | LRSF Rifle, SRSF Rifle, Fists |

**Abilities:**
- **Shirif** — This Model has the Order Keyword.
- **Marksman** — This model ignores the -1 modifier when not targeting the closest enemy model with a Ranged Attack.
- **Unseen Marksmen** — All Models in this Team gain a +1 to Defence Rolls when selected as the target of a Ranged Attack from over 12" away.

---

#### Hardfoot — Captain (max 1)
| stat | value |
|------|-------|
| actions | 3 |
| movement | 6 |
| melee_attack | 6 |
| ranged_attack | 5 |
| defence | 6 |
| health | 5 |
| points | 105 |
| role | captain |
| max_per_army | 1 |
| base_size_mm | 25 |
| equipment | Slug Gun, Fists |

**Abilities:**
- **Shirif** — This Model has the Order Keyword.
- **Slippery** — 8+ Shield Save against Ranged and Melee Attacks only.
- **Slight of Stature** — Attacks that target models in this Team always suffer an additional -1 modifier to their Attack Rolls.

---

#### Grass-whistler — Specialist (max 4)
| stat | value |
|------|-------|
| actions | 2 |
| movement | 6 |
| melee_attack | 7 |
| ranged_attack | 3 |
| defence | 6 |
| health | 5 |
| points | 108 |
| role | specialist |
| max_per_army | 4 |
| base_size_mm | 25 |
| equipment | LRSF Rifle, SRSF Rifle, Fists |

**Abilities:**
- **Marksman** — This model ignores the -1 modifier when not targeting the closest enemy model with a Ranged Attack.
- **Concealed Position** — This Model receives an additional +1 to Defence Rolls when benefiting from Cover.

---

#### Bombarder — Core (max 4)
| stat | value |
|------|-------|
| actions | 2 |
| movement | 6 |
| melee_attack | 7 |
| ranged_attack | 5 |
| defence | 6 |
| health | 5 |
| points | 102 |
| role | core |
| max_per_army | 4 |
| base_size_mm | 25 |
| equipment | Slug Gun, Frag Grenades, Fists |

**Abilities:**
- **Bag o' Bombs!** — This Model may re-roll its Ranged Attack Dice when making a Ranged Attack with Frag Grenades.
- **Slippery** — 8+ Shield Save against Ranged and Melee Attacks only.

---

#### Pointfoot — Core (max 2)
| stat | value |
|------|-------|
| actions | 2 |
| movement | 6 |
| melee_attack | 7 |
| ranged_attack | 5 |
| defence | 6 |
| health | 5 |
| points | 88 |
| role | core |
| max_per_army | 2 |
| base_size_mm | 25 |
| equipment | Slug Gun, Fists |

**Abilities:**
- **Binoculars** — All Friendly Models within 4" of this model gain +1 to their ranged attack rolls.
- **Comms** — A Captain may issue an order to models within 6" of this model following all of the rules for issuing orders.
- **Concealed Position** — This Model receives an additional +1 to Defence Rolls when benefiting from Cover.

---

#### Cook — Core (max 2)
| stat | value |
|------|-------|
| actions | 2 |
| movement | 6 |
| melee_attack | 5 |
| ranged_attack | 5 |
| defence | 5 |
| health | 5 |
| points | 106 |
| role | core |
| max_per_army | 2 |
| base_size_mm | 25 |
| equipment | Slug Gun, Frying Pan |

**Abilities:**
- **A Hearty Meal** — Friendly Models that activate within 6" of this model may remove 1 stress at the start of their Activation.
- **Second Breakfast** — Friendly Models that activate within 4" of this model may remove 1 Damage at the start of their Activation.
- **Slippery** — 8+ Shield Save against Ranged and Melee Attacks only.

---

#### Quickfoot — Core
| stat | value |
|------|-------|
| actions | 2 |
| movement | 7 |
| melee_attack | 5 |
| ranged_attack | 5 |
| defence | 6 |
| health | 5 |
| points | 95 |
| role | core |
| max_per_army | null |
| base_size_mm | 25 |
| equipment | Slug Gun, Hunting Knife |

**Abilities:**
- **Light Footed** — This Model ignores the effects of Difficult Ground.
- **Fast Hands** — This Model may re-roll one failed Attack roll per Attack Action.
- **Slippery** — 8+ Shield Save against Ranged and Melee Attacks only.

---

#### Youngfoot — Core
| stat | value |
|------|-------|
| actions | 2 |
| movement | 6 |
| melee_attack | 7 |
| ranged_attack | 5 |
| defence | 6 |
| health | 5 |
| points | 85 |
| role | core |
| max_per_army | null |
| base_size_mm | 25 |
| equipment | Slug Gun, Fists |

**Abilities:**
- **Beginner's Luck** — When this model receives damage roll a d10 and call "odds" or "evens". If correct, reduce the damage received to 1.
- **Enthusiastic** — This Model may re-roll any of their Ranged Attack dice.

---

#### Stoutfoot — Core
| stat | value |
|------|-------|
| actions | 2 |
| movement | 6 |
| melee_attack | 7 |
| ranged_attack | 5 |
| defence | 5 |
| health | 5 |
| points | 91 |
| role | core |
| max_per_army | null |
| base_size_mm | 25 |
| equipment | Slug Gun, Fists |

**Abilities:**
- **Stubborn** — At the beginning of this Model's activation you may remove 1 Stress from this Model.
- **Slippery** — 8+ Shield Save against Ranged and Melee Attacks only.

---

## Seed Script Instructions for Claude Code

When generating `supabase/seed/data/` files from this document:

1. **`keywords.ts`** — Export array of `{ name, description }` objects from the Keywords table above
2. **`factions.ts`** — Export array of 6 faction objects from the JSON blocks above
3. **`weapons.ts`** — Export array of all weapons across all factions. Where a weapon name appears in multiple factions identically (e.g. Fists, Bayonet, Flamer), create ONE shared record with `faction_id: null`. Faction-specific variants get their own record with the faction's ID.
4. **`unit-types.ts`** — Export array of all units. The `abilities` field should be a JSON array: `[{ "name": "...", "description": "..." }]`
5. **`unit-weapons.ts`** — Export join records linking each unit to its weapons by name lookup
6. **`weapon-keywords.ts`** — Export join records linking each weapon to its keywords by name lookup

All IDs should use `crypto.randomUUID()` or be generated as stable UUIDs using a deterministic function seeded from the slug/name so re-running the seed is idempotent.
