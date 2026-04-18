import { NavLink } from 'react-router-dom';
import { Home, Library, Users, User, LogOut, BookOpen, Scroll } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

const navItems = [
  { to: '/',          label: 'Home',      Icon: Home },
  { to: '/lists',     label: 'My Lists',  Icon: Library },
  { to: '/community', label: 'Community', Icon: Users },
  { to: '/profile',   label: 'Profile',   Icon: User },
];

const navLinkClass = (isActive: boolean) =>
  `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors w-full ${
    isActive
      ? 'bg-dfa-red text-white'
      : 'text-dfa-text-muted hover:text-dfa-text hover:bg-dfa-surface-raised'
  }`;

interface SidebarProps {
  className?: string;
  onRosterOpen: () => void;
  rosterTriggerRef: React.RefObject<HTMLButtonElement>;
}

export function Sidebar({ className = '', onRosterOpen, rosterTriggerRef }: SidebarProps) {
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
      <nav aria-label="Main navigation" className="flex-1 p-3 space-y-1">
        {navItems.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => navLinkClass(isActive)}
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}

        {/* Roster — panel trigger, not a route */}
        <button
          ref={rosterTriggerRef}
          onClick={onRosterOpen}
          className={navLinkClass(false)}
        >
          <Scroll size={17} />
          Roster
        </button>

        {/* Separator */}
        <div className="border-t border-dfa-border my-1" />

        {/* Rules */}
        <NavLink
          to="/rules"
          className={({ isActive }) => navLinkClass(isActive)}
        >
          <BookOpen size={17} />
          Rules
        </NavLink>
      </nav>

      {/* User / sign-out */}
      <div className="p-3 border-t border-dfa-border">
        {user ? (
          <button
            onClick={signOut}
            aria-label="Sign out"
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
