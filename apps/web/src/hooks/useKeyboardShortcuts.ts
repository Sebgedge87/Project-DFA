import { useEffect, useRef, type RefObject } from 'react';

interface KeyboardShortcutsOptions {
  searchRef:     RefObject<HTMLInputElement>;
  onSave:        () => void;
  onRoleFilter:  (role: string) => void;
  onClearSearch: () => void;
}

const ROLE_KEYS: Record<string, string> = {
  '1': 'all', '2': 'captain', '3': 'specialist', '4': 'core',
};

export function useKeyboardShortcuts({ searchRef, onSave, onRoleFilter, onClearSearch }: KeyboardShortcutsOptions) {
  const onSaveRef        = useRef(onSave);
  const onRoleFilterRef  = useRef(onRoleFilter);
  const onClearSearchRef = useRef(onClearSearch);

  useEffect(() => { onSaveRef.current = onSave; });
  useEffect(() => { onRoleFilterRef.current = onRoleFilter; });
  useEffect(() => { onClearSearchRef.current = onClearSearch; });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const active  = document.activeElement;
      const inInput = active?.tagName === 'INPUT' || active?.tagName === 'TEXTAREA' || active?.tagName === 'SELECT';

      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        onSaveRef.current();
        return;
      }

      if (inInput) return;

      if (e.key === '/') {
        e.preventDefault();
        searchRef.current?.focus();
        return;
      }

      if (e.key === 'Escape') {
        onClearSearchRef.current();
        searchRef.current?.blur();
        return;
      }

      if (ROLE_KEYS[e.key]) {
        onRoleFilterRef.current(ROLE_KEYS[e.key]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchRef]);
}
