import { createClient } from '@supabase/supabase-js';
import { keywords }      from './data/keywords';
import { factions }      from './data/factions';
import { weapons }       from './data/weapons';
import { unitTypes }     from './data/unit-types/index';
import { weaponKeywords } from './data/weapon-keywords';
import { unitWeapons }   from './data/unit-weapons';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function seed() {
  // ── 1. Keywords ────────────────────────────────────────────────────────────
  console.log('Seeding keywords...');
  const { error: kwErr } = await supabase
    .from('keywords')
    .upsert(keywords, { onConflict: 'name' });
  if (kwErr) throw kwErr;

  const { data: kwRows } = await supabase.from('keywords').select('id, name');
  const keywordId = Object.fromEntries(kwRows!.map((r) => [r.name, r.id]));

  // ── 2. Factions ────────────────────────────────────────────────────────────
  console.log('Seeding factions...');
  const { error: facErr } = await supabase
    .from('factions')
    .upsert(factions, { onConflict: 'slug' });
  if (facErr) throw facErr;

  const { data: facRows } = await supabase.from('factions').select('id, slug');
  const factionId = Object.fromEntries(facRows!.map((r) => [r.slug, r.id]));

  // ── 3. Weapons ─────────────────────────────────────────────────────────────
  console.log('Seeding weapons...');
  const weaponsWithIds = weapons.map((w) => ({
    ...w,
    faction_id: w.faction_slug ? factionId[w.faction_slug] ?? null : null,
    faction_slug: undefined,
  }));
  const { error: wpnErr } = await supabase
    .from('weapons')
    .upsert(weaponsWithIds, { onConflict: 'name' });
  if (wpnErr) throw wpnErr;

  const { data: wpnRows } = await supabase.from('weapons').select('id, name');
  const weaponId = Object.fromEntries(wpnRows!.map((r) => [r.name, r.id]));

  // ── 4. Unit types ──────────────────────────────────────────────────────────
  console.log('Seeding unit types...');
  const unitTypesWithIds = unitTypes.map((u) => ({
    ...u,
    faction_id: factionId[u.faction_slug],
    faction_slug: undefined,
  }));
  const { error: utErr } = await supabase
    .from('unit_types')
    .upsert(unitTypesWithIds, { onConflict: 'id' });
  if (utErr) throw utErr;

  const { data: utRows } = await supabase.from('unit_types').select('id, name');
  const unitTypeId = Object.fromEntries(utRows!.map((r) => [r.name, r.id]));

  // ── 5. Weapon keywords ─────────────────────────────────────────────────────
  console.log('Seeding weapon keywords...');
  const wkRows = weaponKeywords
    .filter((wk) => weaponId[wk.weapon_name] && keywordId[wk.keyword_name])
    .map((wk) => ({
      weapon_id:  weaponId[wk.weapon_name],
      keyword_id: keywordId[wk.keyword_name],
      parameter:  wk.parameter ?? null,
    }));
  const { error: wkErr } = await supabase
    .from('weapon_keywords')
    .upsert(wkRows, { onConflict: 'weapon_id,keyword_id' });
  if (wkErr) throw wkErr;

  // ── 6. Unit weapons ────────────────────────────────────────────────────────
  console.log('Seeding unit weapons...');
  const uwRows = unitWeapons
    .filter((uw) => unitTypeId[uw.unit_name] && weaponId[uw.weapon_name])
    .map((uw) => ({
      unit_type_id: unitTypeId[uw.unit_name],
      weapon_id:    weaponId[uw.weapon_name],
    }));
  const { error: uwErr } = await supabase
    .from('unit_weapons')
    .upsert(uwRows, { onConflict: 'unit_type_id,weapon_id' });
  if (uwErr) throw uwErr;

  console.log('Seed complete.');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
