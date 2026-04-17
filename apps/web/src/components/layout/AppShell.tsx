import { useState, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { RosterPanel } from '../ui/RosterPanel';
import { WalkthroughModal } from '../ui/WalkthroughModal';

export function AppShell() {
  const [rosterOpen, setRosterOpen] = useState(false);
  const rosterTriggerRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-dfa-black">
      <Sidebar
        className="hidden md:flex md:w-60 flex-col shrink-0"
        onRosterOpen={() => setRosterOpen(true)}
        rosterTriggerRef={rosterTriggerRef}
      />
      <main className="flex-1 pb-20 md:pb-0 overflow-y-auto">
        <Outlet />
      </main>
      <BottomNav
        className="fixed bottom-0 inset-x-0 md:hidden z-50"
        onRosterOpen={() => setRosterOpen(true)}
      />
      <RosterPanel
        open={rosterOpen}
        onClose={() => setRosterOpen(false)}
        triggerRef={rosterTriggerRef}
      />
      <WalkthroughModal />
    </div>
  );
}
