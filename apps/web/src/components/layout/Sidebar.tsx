import { NavLink } from 'react-router-dom';
import { Home, Swords, BookOpen, Users, User, LogOut } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

const navItems = [
  { to: '/',          label: 'Home',      Icon: Home },
  { to: '/builder',   label: 'Builder',   Icon: Swords },
  { to: '/lists',     label: 'My Lists',  Icon: BookOpen },
  { to: '/community', label: 'Community', Icon: Users },
  { to: '/profile',   label: 'Profile',   Icon: User },
];

export function Sidebar({ className = '' }: { className?: string }) {
  const { user, signOut } = useAuthStore();

  return (
    <aside className={`bg-dfa-surface border-r border-dfa-border flex flex-col ${className}`}>
      {/* Logo */}
      <div className="px-5 py-5 border-b border-dfa-border">
        <span className="font-display text-dfa-red-bright font-bold text-xl tracking-wide uppercase">
          Death Fields Arena
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? 'bg-dfa-red text-white'
                  : 'text-dfa-text-muted hover:text-dfa-text hover:bg-dfa-surface-raised'
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User / sign-out */}
      <div className="p-3 border-t border-dfa-border">
        {user ? (
          <button
            onClick={signOut}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-sm text-dfa-text-muted hover:text-dfa-text hover:bg-dfa-surface-raised transition-colors"
          >
            <LogOut size={17} />
            Sign out
          </button>
        ) : (
          <NavLink
            to="/auth"
            className="flex items-center justify-center px-3 py-2 w-full rounded-md text-sm bg-dfa-red hover:bg-dfa-red-bright text-white transition-colors"
          >
            Sign in
          </NavLink>
        )}
      </div>
    </aside>
  );
}
