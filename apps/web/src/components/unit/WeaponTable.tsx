import type { Weapon } from '@dfa/types';
import { Tooltip } from '../ui/Tooltip';
import { WEAPON_COLUMN_DEFINITIONS, KEYWORD_DEFINITIONS } from '../../data/statDefinitions';

interface WeaponTableProps {
  weapons?: Weapon[];
}

function ColHeader({ label }: { label: string }) {
  const def = WEAPON_COLUMN_DEFINITIONS[label];
  if (!def) return <>{label}</>;
  return (
    <Tooltip title={def.title} description={def.description}>
      <span>{label}</span>
    </Tooltip>
  );
}

export function WeaponTable({ weapons }: WeaponTableProps) {
  if (!weapons || weapons.length === 0) return null;

  return (
    <div className="space-y-1.5">
      <p className="text-[10px] font-bold text-dfa-text uppercase tracking-widest">
        Weapons
      </p>
      <div className="overflow-x-auto -mx-1">
        <table className="w-full text-xs min-w-[320px]">
          <thead>
            <tr className="text-dfa-text-muted text-[10px] uppercase tracking-wide">
              <th className="text-left pb-1 pr-2 font-medium">Name</th>
              <th className="text-center pb-1 px-1 font-medium"><ColHeader label="Range" /></th>
              <th className="text-center pb-1 px-1 font-medium"><ColHeader label="Att" /></th>
              <th className="text-center pb-1 px-1 font-medium"><ColHeader label="Dmg" /></th>
              <th className="text-center pb-1 px-1 font-medium"><ColHeader label="AP" /></th>
              <th className="text-left pb-1 pl-2 font-medium"><ColHeader label="Keywords" /></th>
            </tr>
          </thead>
          <tbody>
            {weapons.map(weapon => (
              <tr key={weapon.id} className="border-t border-dfa-border text-dfa-text">
                <td className="py-1 pr-2 font-medium">{weapon.name}</td>
                <td className="py-1 px-1 text-center font-mono">
                  {weapon.range_inches ?? '—'}
                </td>
                <td className="py-1 px-1 text-center font-mono">{weapon.num_attacks}</td>
                <td className="py-1 px-1 text-center font-mono">{weapon.damage}</td>
                <td className="py-1 px-1 text-center font-mono">
                  {weapon.defence_mod !== 0 ? weapon.defence_mod : '—'}
                </td>
                <td className="py-1 pl-2 text-dfa-text-muted">
                  {weapon.weapon_keywords.length === 0
                    ? '—'
                    : weapon.weapon_keywords.map((wk, i) => {
                        const kwDef = KEYWORD_DEFINITIONS[wk.keyword.name];
                        const label = wk.keyword.name + (wk.parameter ? `(${wk.parameter})` : '');
                        return (
                          <span key={i}>
                            {i > 0 && ', '}
                            {kwDef ? (
                              <Tooltip title={kwDef.title} description={kwDef.description}>
                                <span>{label}</span>
                              </Tooltip>
                            ) : (
                              label
                            )}
                          </span>
                        );
                      })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
