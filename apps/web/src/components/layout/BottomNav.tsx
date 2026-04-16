import { NavLink } from 'react-router-dom';
import { Home, Swords, BookOpen, Users, User } from 'lucide-react';

const tabs = [
  { to: '/',         label: 'Home',      Icon: Home },
  { to: '/builder',  label: 'Builder',   Icon: Swords },
  { to: '/lists',    label: 'My Lists',  Icon: BookOpen },
  { to: '/community',label: 'Community', Icon: Users },
  { to: '/profile',  label: 'Profile',   Icon: User },
];

export function BottomNav({ className = '' }: { className?: string }) {
  return (
    <nav className={`bg-dfa-surface border-t border-dfa-border ${className}`}>
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
      </div>
    </nav>
  );
}
