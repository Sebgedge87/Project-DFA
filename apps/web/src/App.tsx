import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppShell } from './components/layout/AppShell';
import { useAuthStore } from './stores/authStore';
import HomePage from './pages/index';
import AuthPage from './pages/auth/index';
import BuilderPage from './pages/builder/[faction]';
import ListPage from './pages/list/[id]';
import ProfilePage from './pages/profile';
import SharePage from './pages/share/[token]';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1 } },
});

function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthStore();
  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

export default function App() {
  const init = useAuthStore((s) => s.init);

  useEffect(() => {
    const unsub = init();
    return unsub;
  }, [init]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public share view — no shell */}
          <Route path="/share/:token" element={<SharePage />} />
          {/* Auth — no shell */}
          <Route path="/auth" element={<AuthPage />} />
          {/* App shell wraps all authenticated routes */}
          <Route element={<AppShell />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/builder" element={<Navigate to="/" replace />} />
            <Route path="/builder/:faction" element={<BuilderPage />} />
            <Route
              path="/lists"
              element={<AuthGate><ProfilePage /></AuthGate>}
            />
            <Route
              path="/list/:id"
              element={<AuthGate><ListPage /></AuthGate>}
            />
            <Route
              path="/profile"
              element={<AuthGate><ProfilePage /></AuthGate>}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
