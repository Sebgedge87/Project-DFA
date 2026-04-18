import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

export default function AuthPage() {
  const { user, signInWithGoogle, signInWithDiscord, signInWithMagicLink } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo') ?? sessionStorage.getItem('auth-return-to') ?? '/';

  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      sessionStorage.removeItem('auth-return-to');
      navigate(returnTo, { replace: true });
    }
  }, [user, navigate, returnTo]);

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithMagicLink(email, returnTo !== '/' ? returnTo : undefined);
      setSent(true);
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-dfa-black flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="font-display text-dfa-red-bright text-4xl font-bold uppercase tracking-wide">
            Death Fields Arena
          </h1>
          <p className="text-dfa-text-muted text-sm mt-1">Army Builder</p>
        </div>

        <div className="bg-dfa-surface border border-dfa-border rounded-lg p-6 space-y-4">
          <h2 className="font-display text-dfa-text text-xl font-bold">Sign in</h2>

          <button
            onClick={() => signInWithGoogle(returnTo !== '/' ? returnTo : undefined)}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-md bg-white text-gray-900 text-sm font-semibold hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <button
            onClick={() => signInWithDiscord(returnTo !== '/' ? returnTo : undefined)}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-md bg-[#5865F2] text-white text-sm font-semibold hover:bg-[#4752C4] transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
            </svg>
            Continue with Discord
          </button>

          <div className="opacity-80 scale-[0.98] origin-top transition-all">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dfa-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-dfa-surface px-2 text-dfa-text-muted">or magic link</span>
              </div>
            </div>

            {sent ? (
              <p className="text-center text-sm text-dfa-gold mt-3">
                Check your email — link sent to {email}
              </p>
            ) : (
              <form onSubmit={handleMagicLink} className="space-y-3 mt-3">
                <div>
                  <label htmlFor="magic-link-email" className="block text-xs text-dfa-text-muted mb-1">
                    Email address
                  </label>
                  <input
                    id="magic-link-email"
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-dfa-black border border-dfa-border rounded-md text-sm text-dfa-text placeholder:text-dfa-text-muted focus:outline-none focus:border-dfa-red"
                  />
                </div>
                {error && <p className="text-xs text-red-400">{error}</p>}
                <button
                  type="submit"
                  className="w-full py-2 bg-dfa-red hover:bg-dfa-red-bright text-white text-sm font-bold rounded-md transition-colors"
                >
                  Send magic link
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
