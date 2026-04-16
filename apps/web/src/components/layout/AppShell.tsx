import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';

export function AppShell() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-dfa-black">
      <Sidebar className="hidden md:flex md:w-60 flex-col shrink-0" />
      <main className="flex-1 pb-20 md:pb-0 overflow-y-auto">
        <Outlet />
      </main>
      <BottomNav className="fixed bottom-0 inset-x-0 md:hidden z-50" />
    </div>
  );
}
