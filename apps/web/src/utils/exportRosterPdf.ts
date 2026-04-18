interface ExportWeapon {
  name: string;
  range_inches?: string | null;
  num_attacks: number;
  damage: string | number;
  defence_mod?: number;
  weapon_keywords?: Array<{ keyword: { name: string }; parameter?: string | null }>;
}

interface ExportUnitType {
  name: string;
  role: string;
  points: number;
  actions: number;
  movement: number;
  melee_attack: number;
  ranged_attack: number;
  defence: number;
  health: number;
  abilities?: Array<{ name: string; description: string }>;
  weapons?: ExportWeapon[];
}

interface ExportEntry {
  quantity: number;
  unit_type: ExportUnitType;
}

export interface RosterExportData {
  name: string;
  points_total: number;
  faction?: { name: string; color_primary?: string } | null;
  army_entries: ExportEntry[];
}

function esc(str: string) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function exportRosterPdf(data: RosterExportData) {
  const accentHex = data.faction?.color_primary ?? 'C0392B';
  const accent = `#${accentHex}`;

  const unitRows = data.army_entries.map(entry => {
    const u = entry.unit_type;
    const totalPts = u.points * entry.quantity;
    const qty = entry.quantity > 1 ? ` <span class="qty">×${entry.quantity}</span>` : '';

    const stats = [
      ['ACT', u.actions],
      ['MOV', u.movement],
      ['MEL', u.melee_attack],
      ['RAN', u.ranged_attack],
      ['DEF', u.defence],
      ['HP', u.health],
    ].map(([label, val]) => `
      <div class="stat">
        <div class="stat-label">${label}</div>
        <div class="stat-val">${val}</div>
      </div>`).join('');

    const abilities = (u.abilities ?? []).map(a => `
      <div class="ability">
        <span class="ability-name">${esc(a.name)}:</span>
        <span class="ability-desc">${esc(a.description)}</span>
      </div>`).join('');

    const weaponRows = (u.weapons ?? []).map(w => {
      const kw = (w.weapon_keywords ?? [])
        .map(wk => wk.keyword.name + (wk.parameter ? `(${wk.parameter})` : ''))
        .join(', ') || '—';
      const ap = w.defence_mod != null && w.defence_mod !== 0 ? String(w.defence_mod) : '—';
      return `
        <tr>
          <td>${esc(w.name)}</td>
          <td class="center">${w.range_inches ?? 'Melee'}</td>
          <td class="center mono">${w.num_attacks}</td>
          <td class="center mono">${w.damage}</td>
          <td class="center mono">${ap}</td>
          <td>${esc(kw)}</td>
        </tr>`;
    }).join('');

    return `
      <div class="unit">
        <div class="unit-header">
          <div>
            <span class="unit-name">${esc(u.name)}</span>${qty}
            <span class="role-badge">${esc(u.role.toUpperCase())}</span>
          </div>
          <span class="unit-pts">${totalPts}pts</span>
        </div>
        <div class="unit-body">
          <div class="stats">${stats}</div>
          ${abilities ? `<div class="section-label">Abilities</div>${abilities}` : ''}
          ${weaponRows ? `
            <div class="section-label">Weapons</div>
            <table>
              <thead>
                <tr>
                  <th>Name</th><th class="center">Range</th><th class="center">Att</th>
                  <th class="center">Dmg</th><th class="center">AP</th><th>Keywords</th>
                </tr>
              </thead>
              <tbody>${weaponRows}</tbody>
            </table>` : ''}
        </div>
      </div>`;
  }).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${esc(data.name)} — Roster</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, Helvetica, sans-serif; font-size: 11pt; color: #1a1a1a; background: #fff; padding: 16mm 20mm; }
    .header { border-bottom: 3px solid ${accent}; padding-bottom: 12px; margin-bottom: 16px; }
    .faction-label { font-size: 8pt; text-transform: uppercase; letter-spacing: 0.12em; color: #888; margin-bottom: 4px; }
    h1 { font-size: 22pt; font-weight: bold; text-transform: uppercase; letter-spacing: 0.04em; line-height: 1.1; }
    .total-pts { font-size: 14pt; font-weight: bold; color: ${accent}; font-family: monospace; margin-top: 4px; }
    .unit { border: 1px solid #ddd; border-radius: 4px; margin: 10px 0; page-break-inside: avoid; }
    .unit-header { background: #f7f7f7; padding: 7px 12px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #ddd; }
    .unit-name { font-size: 13pt; font-weight: bold; }
    .qty { font-size: 11pt; color: #666; margin-left: 4px; }
    .role-badge { display: inline-block; font-size: 7pt; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; background: #eee; color: #555; border-radius: 2px; padding: 1px 5px; margin-left: 8px; vertical-align: middle; }
    .unit-pts { font-size: 11pt; font-weight: bold; color: ${accent}; font-family: monospace; }
    .unit-body { padding: 10px 12px; }
    .stats { display: grid; grid-template-columns: repeat(6, 1fr); gap: 4px; margin-bottom: 10px; }
    .stat { border: 1px solid #e5e5e5; border-radius: 3px; padding: 4px 2px; text-align: center; }
    .stat-label { font-size: 7.5pt; color: #999; text-transform: uppercase; letter-spacing: 0.1em; }
    .stat-val { font-size: 13pt; font-weight: bold; font-family: monospace; line-height: 1.2; }
    .section-label { font-size: 7.5pt; font-weight: bold; text-transform: uppercase; letter-spacing: 0.12em; color: #555; margin: 8px 0 4px; }
    .ability { font-size: 10pt; margin-bottom: 3px; line-height: 1.4; }
    .ability-name { font-weight: bold; color: ${accent}; }
    .ability-desc { color: #444; }
    table { width: 100%; border-collapse: collapse; font-size: 9.5pt; }
    th { text-align: left; font-size: 7.5pt; text-transform: uppercase; letter-spacing: 0.08em; color: #888; border-bottom: 1px solid #ddd; padding: 3px 5px; font-weight: normal; }
    td { padding: 4px 5px; border-bottom: 1px solid #f0f0f0; }
    .center { text-align: center; }
    .mono { font-family: monospace; }
    .footer { margin-top: 20px; text-align: center; font-size: 8.5pt; color: #bbb; }
    @media print {
      body { padding: 8mm 12mm; }
      @page { margin: 12mm; }
    }
  </style>
</head>
<body>
  <div class="header">
    ${data.faction?.name ? `<div class="faction-label">${esc(data.faction.name)}</div>` : ''}
    <h1>${esc(data.name)}</h1>
    <div class="total-pts">${data.points_total}pts</div>
  </div>
  ${unitRows}
  <div class="footer">Death Fields Arena &middot; wargamesatlantic.com</div>
  <script>window.onload = function() { window.print(); }<\/script>
</body>
</html>`;

  const w = window.open('', '_blank');
  if (!w) return;
  w.document.write(html);
  w.document.close();
}
