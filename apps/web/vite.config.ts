import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'url';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@dfa/types':           fileURLToPath(new URL('../../packages/types/src/index.ts', import.meta.url)),
      '@dfa/logic':           fileURLToPath(new URL('../../packages/logic/src/index.ts', import.meta.url)),
      '@dfa/supabase-client': fileURLToPath(new URL('../../packages/supabase-client/src/index.ts', import.meta.url)),
    },
  },
});
