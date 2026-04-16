import { createClient } from '@supabase/supabase-js';
import { existsSync, readFileSync, readdirSync } from 'fs';
import { join, extname, basename } from 'path';
import { keywords }       from './data/keywords';
import { factions }       from './data/factions';
import { weapons }        from './data/weapons';
import { unitTypes }      from './data/unit-types/index';
import { weaponKeywords } from './data/weapon-keywords';
import { unitWeapons }    from './data/unit-weapons';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const IMAGES_DIR = join(__dirname, 'images');
const SKIP_IMAGES = !existsSync(IMAGES_DIR);

// ── Image helpers ─────────────────────────────────────────────────────────────

function mimeType(filePath: string): string {
  const ext = extname(filePath).toLowerCase();
  if (ext === '.webp') return 'image/webp';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  return 'image/png';
}

async function uploadImage(
  bucket: string,
  storagePath: string,
  filePath: string,
): Promise<string | null> {
  const body = readFileSync(filePath);
  const { error } = await supabase.storage
    .from(bucket)
    .upload(storagePath, body, { contentType: mimeType(filePath), upsert: true });
  if (error) {
    console.warn(`  ⚠ Upload failed for ${storagePath}: ${error.message}`);
    return null;
  }
  const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath);
  return data.publicUrl;
}

// ── Main seed ─────────────────────────────────────────────────────────────────

async function seed() {
  // ── 1. Keywords ──────────────────────────────────────────────────────────────
  console.log('Seeding keywords...');
  const { error: kwErr } = await supabase
    .from('keywords')
    .upsert(keywords, { onConflict: 'name' });
  if (kwErr) throw kwErr;

  const { data: kwRows } = await supabase.from('keywords').select('id, name');
  const keywordId = Object.fromEntries(kwRows!.map((r) => [r.name, r.id]));

  // ── 2. Factions ──────────────────────────────────────────────────────────────
  console.log('Seeding factions...');
  const { error: facErr } = await supabase
    .from('factions')
    .upsert(factions, { onConflict: 'slug' });
  if (facErr) throw facErr;

  const { data: facRows } = await supabase.from('factions').select('id, slug');
  const factionId = Object.fromEntries(facRows!.map((r) => [r.slug, r.id]));

  // ── 3. Faction images ─────────────────────────────────────────────────────
  if (!SKIP_IMAGES) {
    console.log('Uploading faction images...');
    const facImgDir = join(IMAGES_DIR, 'factions');
    if (existsSync(facImgDir)) {
      for (const file of readdirSync(facImgDir)) {
        const slug = basename(file, extname(file));   // bulldogs.webp → bulldogs
        if (!factionId[slug]) { console.warn(`  ⚠ No faction for image: ${file}`); continue; }
        const url = await uploadImage('faction-images', file, join(facImgDir, file));
        if (url) {
          await supabase.from('factions').update({ image_url: url }).eq('id', factionId[slug]);
          console.log(`  ✓ ${slug}`);
        }
      }
    }
  } else {
    console.log('No images/ directory found — skipping image upload.');
  }

  // ── 4. Weapons ───────────────────────────────────────────────────────────────
  console.log('Seeding weapons...');
  const weaponsWithIds = weapons.map(({ faction_slug, ...w }) => ({
    ...w,
    faction_id: faction_slug ? factionId[faction_slug] ?? null : null,
  }));
  const { error: wpnErr } = await supabase
    .from('weapons')
    .upsert(weaponsWithIds, { onConflict: 'name' });
  if (wpnErr) throw wpnErr;

  const { data: wpnRows } = await supabase.from('weapons').select('id, name');
  const weaponId = Object.fromEntries(wpnRows!.map((r) => [r.name, r.id]));

  // ── 5. Unit types ─────────────────────────────────────────────────────────
  console.log('Seeding unit types...');
  const unitTypesWithIds = unitTypes.map(({ faction_slug, ...u }) => ({
    ...u,
    faction_id: factionId[faction_slug],
  }));
  const { error: utErr } = await supabase
    .from('unit_types')
    .upsert(unitTypesWithIds, { onConflict: 'name,faction_id', ignoreDuplicates: true });
  if (utErr) throw utErr;

  const { data: utRows } = await supabase.from('unit_types').select('id, name, faction_id');
  const unitTypeId   = Object.fromEntries(utRows!.map((r) => [r.name, r.id]));
  const unitFactionId = Object.fromEntries(utRows!.map((r) => [r.name, r.faction_id]));

  // ── 6. Unit images ────────────────────────────────────────────────────────
  if (!SKIP_IMAGES) {
    console.log('Uploading unit images...');
    const unitImgDir = join(IMAGES_DIR, 'units');
    if (existsSync(unitImgDir)) {
      for (const file of readdirSync(unitImgDir)) {
        // filename convention: {faction-slug}_{unit-name-kebab}.webp
        // e.g. bulldogs_the-red-devil.webp
        const stem = basename(file, extname(file));
        const [fSlug, ...rest] = stem.split('_');
        const unitName = rest.join('_').replace(/-/g, ' ');
        // Try exact match first, then case-insensitive
        const id = unitTypeId[unitName] ??
          Object.entries(unitTypeId).find(([k]) => k.toLowerCase() === unitName.toLowerCase())?.[1];
        if (!id) { console.warn(`  ⚠ No unit for image: ${file}`); continue; }
        const storagePath = `${fSlug}/${file}`;
        const url = await uploadImage('unit-images', storagePath, join(unitImgDir, file));
        if (url) {
          await supabase.from('unit_types').update({ image_url: url }).eq('id', id);
          console.log(`  ✓ ${stem}`);
        }
      }
    }
  }

  // ── 7. Weapon keywords ────────────────────────────────────────────────────
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

  // ── 8. Unit weapons ───────────────────────────────────────────────────────
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

  console.log('\nSeed complete ✓');
  if (SKIP_IMAGES) {
    console.log('\nTo seed images, create supabase/seed/images/ with:');
    console.log('  images/factions/{slug}.webp        (e.g. bulldogs.webp)');
    console.log('  images/units/{slug}_{name-kebab}.webp  (e.g. bulldogs_the-red-devil.webp)');
    console.log('Images should be WebP, max 200 KB for units and 500 KB for factions.');
  }
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
