import { useEffect, useState } from 'react';
import type { RefObject } from 'react';

/**
 * True while the element behind `ref` is narrower than `thresholdPx`.
 *
 * Diagrams use it to switch to a narrow layout (fewer columns, shorter labels,
 * a taller viewBox) instead of scrolling sideways, so a diagram never grows
 * wider than its container on a phone. Measures the container, not the window,
 * so it also reacts to the side navigation opening.
 */
export function useNarrow(ref: RefObject<HTMLElement>, thresholdPx = 560): boolean {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const update = () => {
      const width = el.getBoundingClientRect().width;
      if (width > 0) setNarrow(width < thresholdPx);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, thresholdPx]);
  return narrow;
}
