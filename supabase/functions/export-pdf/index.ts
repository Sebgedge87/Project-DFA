import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { PDFDocument, rgb, StandardFonts, PageSizes } from 'https://esm.sh/pdf-lib@1.17.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ── Colour helpers ────────────────────────────────────────────────────────────

function hexToRgb(hex: string) {
  const n = parseInt(hex.replace('#', ''), 16);
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}

const BRAND_RED   = hexToRgb('#8B1A1A');
const BRAND_GOLD  = hexToRgb('#C4943A');
const DARK_BG     = hexToRgb('#0D0D0D');
const SURFACE     = hexToRgb('#1A1A1A');
const BORDER      = hexToRgb('#3A1A1A');
const TEXT        = hexToRgb('#F0EDE8');
const TEXT_MUTED  = hexToRgb('#9A8A80');
const WHITE       = rgb(1, 1, 1);

// ── PDF builder ───────────────────────────────────────────────────────────────

async function buildPdf(list: any): Promise<Uint8Array> {
  const doc  = await PDFDocument.create();
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const reg  = await doc.embedFont(StandardFonts.Helvetica);

  const PAGE_W = PageSizes.A4[0];
  const PAGE_H = PageSizes.A4[1];
  const MARGIN = 40;
  const COL    = PAGE_W - MARGIN * 2;

  let page = doc.addPage(PageSizes.A4);
  let y    = PAGE_H - MARGIN;

  const faction     = list.faction;
  const accentHex   = faction?.color_primary ?? '8B1A1A';
  const accentColor = hexToRgb(`#${accentHex}`);

  // ── Helper: new page ────────────────────────────────────────────────────────
  function newPage() {
    page = doc.addPage(PageSizes.A4);
    y = PAGE_H - MARGIN;
    // Subtle top bar
    page.drawRectangle({ x: 0, y: PAGE_H - 6, width: PAGE_W, height: 6, color: accentColor });
  }

  function ensureSpace(needed: number) {
    if (y - needed < MARGIN) newPage();
  }

  // ── Cover header ────────────────────────────────────────────────────────────
  page.drawRectangle({ x: 0, y: PAGE_H - 6, width: PAGE_W, height: 6, color: accentColor });

  page.drawText('DEATH FIELDS ARENA', {
    x: MARGIN, y: y - 20, font: bold, size: 22, color: BRAND_RED,
  });
  y -= 30;

  page.drawText(list.name, {
    x: MARGIN, y, font: bold, size: 16, color: TEXT,
  });
  y -= 18;

  page.drawText(
    `${faction?.name ?? 'Unknown Faction'}  ·  ${list.points_total} / 1000 pts`,
    { x: MARGIN, y, font: reg, size: 10, color: BRAND_GOLD },
  );
  y -= 10;

  // Divider
  page.drawLine({ start: { x: MARGIN, y }, end: { x: PAGE_W - MARGIN, y }, thickness: 1, color: BORDER });
  y -= 20;

  // ── Unit blocks ─────────────────────────────────────────────────────────────
  for (const entry of list.army_entries ?? []) {
    const u = entry.unit_type;
    const abilities: any[] = u.abilities ?? [];
    const weapons: any[]   = u.weapons   ?? [];

    // Estimate height: header(28) + stats(22) + abilities(13*n) + weapons(12*n+18) + padding
    const estimatedH = 28 + 22 + abilities.length * 13 + (weapons.length > 0 ? weapons.length * 12 + 20 : 0) + 20;
    ensureSpace(estimatedH);

    // Unit header background
    page.drawRectangle({ x: MARGIN, y: y - 22, width: COL, height: 24, color: SURFACE });

    // Role badge
    const roleColor = u.role === 'captain' ? BRAND_GOLD : u.role === 'specialist' ? BRAND_RED : SURFACE;
    const roleLabel = (u.role as string).toUpperCase();
    page.drawRectangle({ x: MARGIN, y: y - 22, width: 64, height: 24, color: roleColor });
    page.drawText(roleLabel, {
      x: MARGIN + 4, y: y - 15, font: bold, size: 7,
      color: u.role === 'captain' ? DARK_BG : WHITE,
    });

    // Unit name + points
    page.drawText(u.name, {
      x: MARGIN + 70, y: y - 15, font: bold, size: 11, color: TEXT,
    });
    const ptsLabel = `${u.points * entry.quantity} pts${entry.quantity > 1 ? ` (×${entry.quantity})` : ''}`;
    const ptsW = bold.widthOfTextAtSize(ptsLabel, 10);
    page.drawText(ptsLabel, {
      x: PAGE_W - MARGIN - ptsW, y: y - 15, font: bold, size: 10, color: BRAND_GOLD,
    });
    y -= 26;

    // Stat grid
    const STATS = [
      { label: 'ACT', val: String(u.actions) },
      { label: 'MOV', val: `${u.movement}"` },
      { label: 'MEL', val: `${u.melee_attack}+` },
      { label: 'RAN', val: `${u.ranged_attack}+` },
      { label: 'DEF', val: `${u.defence}+` },
      { label: 'HP',  val: String(u.health) },
    ];
    const cellW = COL / STATS.length;
    STATS.forEach(({ label, val }, i) => {
      const cx = MARGIN + i * cellW + cellW / 2;
      page.drawText(label, { x: cx - bold.widthOfTextAtSize(label, 7) / 2, y, font: bold, size: 7, color: TEXT_MUTED });
      page.drawText(val,   { x: cx - bold.widthOfTextAtSize(val, 11) / 2,  y: y - 11, font: bold, size: 11, color: TEXT });
    });
    y -= 24;

    // Abilities
    if (abilities.length > 0) {
      for (const ab of abilities) {
        ensureSpace(14);
        const line = `★ ${ab.name}: ${ab.description}`;
        // Word-wrap at ~90 chars
        const words = line.split(' ');
        let current = '';
        for (const word of words) {
          const test = current ? `${current} ${word}` : word;
          if (reg.widthOfTextAtSize(test, 8) > COL - 4) {
            page.drawText(current, { x: MARGIN + 4, y, font: reg, size: 8, color: TEXT_MUTED });
            y -= 11;
            current = word;
          } else {
            current = test;
          }
        }
        if (current) {
          page.drawText(current, { x: MARGIN + 4, y, font: reg, size: 8, color: TEXT_MUTED });
          y -= 11;
        }
      }
      y -= 4;
    }

    // Weapons table
    if (weapons.length > 0) {
      ensureSpace(18 + weapons.length * 12);
      page.drawText('WEAPONS', { x: MARGIN + 4, y, font: bold, size: 7, color: TEXT_MUTED });
      y -= 11;

      // Table header
      const cols = [
        { label: 'Name',     x: MARGIN + 4,   w: 120 },
        { label: 'Range',    x: MARGIN + 128,  w: 44 },
        { label: 'Att',      x: MARGIN + 176,  w: 24 },
        { label: 'Dmg',      x: MARGIN + 204,  w: 24 },
        { label: 'AP',       x: MARGIN + 232,  w: 24 },
        { label: 'Keywords', x: MARGIN + 260,  w: 0 },
      ];
      cols.forEach(({ label, x }) => {
        page.drawText(label, { x, y, font: bold, size: 7, color: TEXT_MUTED });
      });
      y -= 3;
      page.drawLine({ start: { x: MARGIN, y }, end: { x: PAGE_W - MARGIN, y }, thickness: 0.5, color: BORDER });
      y -= 9;

      for (const wpn of weapons) {
        ensureSpace(12);
        const kw = (wpn.weapon_keywords ?? [])
          .map((wk: any) => wk.parameter ? `${wk.keyword.name}(${wk.parameter})` : wk.keyword.name)
          .join(', ') || '—';
        const ap = wpn.defence_mod !== 0 ? String(wpn.defence_mod) : '—';

        page.drawText(wpn.name,                  { x: cols[0].x, y, font: reg, size: 8, color: TEXT });
        page.drawText(wpn.range_inches ?? '—',   { x: cols[1].x, y, font: reg, size: 8, color: TEXT });
        page.drawText(String(wpn.num_attacks),   { x: cols[2].x, y, font: reg, size: 8, color: TEXT });
        page.drawText(wpn.damage,                { x: cols[3].x, y, font: reg, size: 8, color: TEXT });
        page.drawText(ap,                        { x: cols[4].x, y, font: reg, size: 8, color: TEXT });
        // Truncate keywords if too long
        const kwTrunc = kw.length > 52 ? kw.slice(0, 50) + '…' : kw;
        page.drawText(kwTrunc,                   { x: cols[5].x, y, font: reg, size: 8, color: TEXT_MUTED });
        y -= 12;
      }
    }

    y -= 12;
    // Section divider
    page.drawLine({ start: { x: MARGIN, y }, end: { x: PAGE_W - MARGIN, y }, thickness: 0.5, color: BORDER });
    y -= 12;
  }

  // ── Footer on last page ──────────────────────────────────────────────────────
  page.drawText('Death Fields Arena Army Builder  ·  wargamesatlantic.com', {
    x: MARGIN, y: MARGIN - 10, font: reg, size: 7, color: TEXT_MUTED,
  });

  return doc.save();
}

// ── Handler ───────────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const { listId } = await req.json();
  if (!listId) {
    return new Response(JSON.stringify({ error: 'Missing listId' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const authHeader = req.headers.get('Authorization') ?? '';
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } },
  );

  const { data, error } = await supabase
    .from('army_lists')
    .select(`
      *,
      faction: factions (*),
      army_entries (
        id, quantity,
        unit_type: unit_types (
          *,
          unit_weapons ( weapon: weapons ( *, weapon_keywords ( keyword: keywords (*), parameter ) ) )
        )
      )
    `)
    .eq('id', listId)
    .single();

  if (error || !data) {
    return new Response(JSON.stringify({ error: 'List not found or access denied' }), {
      status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const payload = {
    ...data,
    army_entries: (data.army_entries ?? []).map((e: any) => ({
      ...e,
      unit_type: {
        ...e.unit_type,
        weapons: e.unit_type?.unit_weapons?.map((uw: any) => uw.weapon) ?? [],
        unit_weapons: undefined,
      },
    })),
  };

  const pdfBytes = await buildPdf(payload);
  const filename = `${data.name.replace(/[^a-z0-9]/gi, '_')}_roster.pdf`;

  return new Response(pdfBytes, {
    status: 200,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
});
