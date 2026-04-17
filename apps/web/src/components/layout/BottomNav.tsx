import { NavLink } from 'react-router-dom';
import { Home, Library, BookOpen, Users, User, Scroll } from 'lucide-react';

const tabs = [
  { to: '/',          label: 'Home',      Icon: Home },
  { to: '/lists',     label: 'My Lists',  Icon: Library },
  { to: '/rules',     label: 'Rules',     Icon: BookOpen },
  { to: '/community', label: 'Community', Icon: Users },
  { to: '/profile',   label: 'Profile',   Icon: User },
];

interface BottomNavProps {
  className?: string;
  onRosterOpen: () => void;
}

export function BottomNav({ className = '', onRosterOpen }: BottomNavProps) {
  return (
    <nav aria-label="Main navigation" className={`bg-dfa-surface border-t border-dfa-border ${className}`}>
      <div className="flex">
        {tabs.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-1 py-2 text-xs transition-colors ${
                isActive ? 'text-dfa-red-bright' : 'text-dfa-text-muted hover:text-dfa-text'
              }`
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}

        {/* Roster — panel trigger */}
        <button
          onClick={onRosterOpen}
          className="flex-1 flex flex-col items-center gap-1 py-2 text-xs text-dfa-text-muted hover:text-dfa-text transition-colors"
        >
          <Scroll size={20} />
          <span>Roster</span>
        </button>
      </div>
    </nav>
  );
}
