import { useState, useEffect } from 'react';
import { applyMode, Mode } from '@cloudscape-design/global-styles';

export function useTheme() {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    applyMode(mode === 'dark' ? Mode.Dark : Mode.Light);
  }, [mode]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setMode(e.matches ? 'dark' : 'light');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return { mode, setMode, toggleMode: () => setMode((m) => (m === 'dark' ? 'light' : 'dark')) };
}
