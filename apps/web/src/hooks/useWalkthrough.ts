import { useState } from 'react';

const KEY = 'dfa-walkthrough-dismissed';

export function useWalkthrough() {
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(KEY) === '1',
  );

  const dismiss = () => {
    localStorage.setItem(KEY, '1');
    setDismissed(true);
  };

  const enable = () => {
    localStorage.removeItem(KEY);
    setDismissed(false);
  };

  return { dismissed, dismiss, enable };
}
