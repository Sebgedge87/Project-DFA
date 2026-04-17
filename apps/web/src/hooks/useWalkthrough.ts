import { useState } from 'react';

const KEY = 'dfa-walkthrough-dismissed';

export function useWalkthrough() {
  const [dismissed, setDismissed] = useState(
    () => typeof localStorage !== 'undefined' && localStorage.getItem(KEY) === '1',
  );

  const dismiss = () => {
    localStorage.setItem(KEY, '1');
    setDismissed(true);
  };

  return { dismissed, dismiss };
}
