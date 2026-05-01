import { motion } from 'framer-motion';

interface PointsBarProps {
  current: number;
  max?: number;
  factionColor?: string; // hex without '#', e.g. '8B1A1A'
}

const WARN_THRESHOLD = 0.8;
const DANGER_THRESHOLD = 0.95;

const BREAKPOINTS = [0.25, 0.5, 0.75];

export function PointsBar({ current, max = 1000, factionColor }: PointsBarProps) {
  const pct     = Math.min(current / max, 1);
  const over    = current > max;
  const danger  = pct >= DANGER_THRESHOLD;
  const warn    = pct >= WARN_THRESHOLD;

  const barColor = over || danger
    ? '#C41E1E'
    : warn
    ? '#f59e0b'
    : factionColor
    ? `#${factionColor}`
    : '#8B1A1A';

  const labelColour = over
    ? 'text-red-400'
    : danger
    ? 'text-dfa-red-bright'
    : 'text-dfa-gold';

  const remaining = max - current;

  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between text-xs">
        <span className="text-dfa-text-muted font-medium uppercase tracking-wide">Points</span>
        <span className={`font-mono font-bold ${labelColour}`}>
          {current}
          <span className="text-dfa-text-muted font-normal"> / {max}</span>
        </span>
      </div>

      {/* Track */}
      <div className="relative">
        <div className="h-2 bg-dfa-surface-raised rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: barColor }}
            initial={{ width: 0 }}
            animate={{ width: `${pct * 100}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          />
        </div>
        {/* Breakpoint markers */}
        {BREAKPOINTS.map(bp => (
          <div
            key={bp}
            className="absolute inset-y-0 w-px bg-dfa-black/50 pointer-events-none"
            style={{ left: `${bp * 100}%`, top: 0, height: '8px' }}
          />
        ))}
      </div>

      {/* Remaining / over-limit message */}
      {over ? (
        <p className="text-[10px] text-red-400 font-medium">
          {current - max}pts over limit — remove units to continue
        </p>
      ) : (
        <p className="text-[10px] text-dfa-text-muted">
          <span className={warn || danger ? labelColour : 'text-dfa-text-muted'}>{remaining}pts</span> remaining
        </p>
      )}
    </div>
  );
}
