import type { UnitRole } from '@dfa/types';

interface RoleBadgeProps {
  role: UnitRole;
}

const roleStyles: Record<UnitRole, string> = {
  captain:    'bg-dfa-gold text-dfa-black',
  specialist: 'bg-dfa-red text-white',
  core:       'bg-dfa-surface-raised text-dfa-text-muted',
};

const roleLabels: Record<UnitRole, string> = {
  captain:    'Captain',
  specialist: 'Specialist',
  core:       'Core',
};

export function RoleBadge({ role }: RoleBadgeProps) {
  return (
    <span
      className={`absolute top-2 left-2 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${roleStyles[role]}`}
    >
      {roleLabels[role]}
    </span>
  );
}
