import { useTheme, type Theme } from '../../hooks/useTheme';

const THEMES: { id: Theme; label: string; desc: string; swatch: string }[] = [
  { id: 'arena',       label: 'Arena',       desc: 'Classic red — default',      swatch: '#8B1A1A' },
  { id: 'battlefield', label: 'Battlefield', desc: 'Tactical green scheme',      swatch: '#1A5A1A' },
  { id: 'classic',     label: 'Classic',     desc: 'High contrast, minimal',     swatch: '#7A0000' },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-2">
      <p className="text-xs text-dfa-text-muted uppercase tracking-widest font-medium">Theme</p>
      <div className="grid grid-cols-3 gap-2">
        {THEMES.map(t => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={`p-2.5 rounded border text-left transition-colors ${
              theme === t.id
                ? 'border-dfa-red bg-dfa-red/10'
                : 'border-dfa-border-neutral hover:border-dfa-border'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: t.swatch }} />
              <span className="text-xs font-bold text-dfa-text">{t.label}</span>
            </div>
            <p className="text-[10px] text-dfa-text-muted leading-tight">{t.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
