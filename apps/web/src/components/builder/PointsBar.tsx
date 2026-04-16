import { motion } from 'framer-motion';

interface PointsBarProps {
  current: number;
  max?:    number;
}

const WARN_THRESHOLD = 0.8;   // amber at 80%
const DANGER_THRESHOLD = 0.95; // red at 95%

export function PointsBar({ current, max = 1000 }: PointsBarProps) {
  const pct     = Math.min(current / max, 1);
  const over    = current > max;
  const danger  = pct >= DANGER_THRESHOLD;
  const warn    = pct >= WARN_THRESHOLD;

  const barColour = over || danger
    ? 'bg-dfa-red-bright'
    : warn
    ? 'bg-amber-500'
    : 'bg-dfa-red';

  const labelColour = over
    ? 'text-red-400'
    : danger
    ? 'text-dfa-red-bright'
    : 'text-dfa-gold';

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
      <div className="h-2 bg-dfa-surface-raised rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${barColour}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct * 100}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
      </div>

      {over && (
        <p className="text-[10px] text-red-400 font-medium">
          {current - max}pts over limit — remove units to continue
        </p>
      )}
    </div>
  );
}
