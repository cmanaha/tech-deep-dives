import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';

/**
 * Figure wrappers for the Physical AI dive.
 *
 * The svg element itself is always written in the section file, with a literal role="img",
 * aria-labelledby and <title id>: the svg-a11y gate reads the source text. These wrappers add
 * what every figure needs around it: the register entries its numbers come from, a caption that
 * says how to read it, a scroll container for phones, and (AnimatedFigure) the controls.
 */

interface FigureProps {
  /** Register IDs, space separated, that hold every number drawn in the figure. */
  cites?: string;
  /** One or two sentences under the figure saying how to read it. */
  caption: ReactNode;
  /** Minimum painted width in px. On a narrower screen the figure scrolls sideways inside its box. */
  minWidth?: number;
  children: ReactNode;
}

export function Figure({ cites, caption, minWidth, children }: FigureProps) {
  return (
    <figure data-cites={cites} style={{ margin: 0 }}>
      <div style={{ overflowX: 'auto' }}>
        <div style={{ minWidth: minWidth ?? 0 }}>{children}</div>
      </div>
      <figcaption>
        <Box variant="small" color="text-body-secondary">
          {caption}
        </Box>
      </figcaption>
    </figure>
  );
}

/** True when the reader asked the system for reduced motion. */
export function usePrefersReducedMotion(): boolean {
  const query = '(prefers-reduced-motion: reduce)';
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia(query).matches,
  );
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined;
    const mq = window.matchMedia(query);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

export interface Stepper {
  /** Current step, 0-based. */
  step: number;
  playing: boolean;
  reduced: boolean;
  play: () => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  reset: () => void;
}

/**
 * Step state for an animated figure. Starts paused on step 0 (on the last step under reduced
 * motion, so the reader sees the finished picture). Play runs once to the last step and stops.
 */
export function useStepper(steps: number, intervalMs = 1400): Stepper {
  const reduced = usePrefersReducedMotion();
  const last = Math.max(0, steps - 1);
  const [step, setStep] = useState(() => (reduced ? last : 0));
  const [playing, setPlaying] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (timer.current !== null) {
      clearInterval(timer.current);
      timer.current = null;
    }
    setPlaying(false);
  }, []);

  useEffect(() => {
    if (!playing) return undefined;
    timer.current = setInterval(() => {
      setStep((s) => {
        if (s >= last) return s;
        return s + 1;
      });
    }, intervalMs);
    return () => {
      if (timer.current !== null) clearInterval(timer.current);
      timer.current = null;
    };
  }, [playing, intervalMs, last]);

  useEffect(() => {
    if (playing && step >= last) stop();
  }, [playing, step, last, stop]);

  const play = useCallback(() => {
    if (reduced) {
      // Reduced motion: no timed playback. Play shows the finished state.
      setStep(last);
      return;
    }
    setStep((s) => (s >= last ? 0 : s));
    setPlaying(true);
  }, [reduced, last]);

  return {
    step,
    playing,
    reduced,
    play,
    pause: stop,
    next: () => {
      stop();
      setStep((s) => Math.min(last, s + 1));
    },
    prev: () => {
      stop();
      setStep((s) => Math.max(0, s - 1));
    },
    reset: () => {
      stop();
      setStep(0);
    },
  };
}

interface AnimatedFigureProps {
  /** Short name of the animation, used in the control labels ("Play: one episode through the loop"). */
  name: string;
  /** One caption per step, in plain words. Its length is the number of steps. */
  steps: ReactNode[];
  /** Milliseconds per step while playing. */
  intervalMs?: number;
  /** Register IDs, space separated, that hold every number drawn or captioned. */
  cites?: string;
  /** One or two sentences under the figure saying how to read it. */
  caption: ReactNode;
  minWidth?: number;
  /** Draws the figure for a step. `reduced` is true when motion is reduced: skip CSS transitions. */
  children: (step: number, reduced: boolean) => ReactNode;
}

/**
 * An animated figure with play, pause, step and reset controls (all real buttons, so they are
 * reachable by keyboard), a text caption for the current step announced to screen readers, and a
 * static finished state when the reader prefers reduced motion. It never starts on its own.
 */
export function AnimatedFigure({ name, steps, intervalMs, cites, caption, minWidth, children }: AnimatedFigureProps) {
  const s = useStepper(steps.length, intervalMs);
  const last = steps.length - 1;
  return (
    <figure data-cites={cites} data-animated="true" data-step={s.step} style={{ margin: 0 }}>
      <div style={{ overflowX: 'auto' }}>
        <div style={{ minWidth: minWidth ?? 0 }}>{children(s.step, s.reduced)}</div>
      </div>
      <SpaceBetween size="xs">
        <div aria-live="polite" style={{ minHeight: '3.2em' }}>
          <Box variant="p">
            <Box variant="strong" display="inline">
              Step {s.step + 1} of {steps.length}.
            </Box>{' '}
            {steps[s.step]}
          </Box>
        </div>
        <SpaceBetween size="xs" direction="horizontal">
          {s.playing ? (
            <Button iconName="pause" onClick={s.pause} ariaLabel={`Pause: ${name}`}>
              Pause
            </Button>
          ) : (
            <Button iconName="play" variant="primary" onClick={s.play} ariaLabel={`Play: ${name}`}>
              {s.step >= last ? 'Replay' : 'Play'}
            </Button>
          )}
          <Button iconName="angle-left" onClick={s.prev} disabled={s.step === 0} ariaLabel={`Previous step: ${name}`}>
            Back
          </Button>
          <Button iconName="angle-right" iconAlign="right" onClick={s.next} disabled={s.step >= last} ariaLabel={`Next step: ${name}`}>
            Step
          </Button>
          <Button iconName="undo" onClick={s.reset} disabled={s.step === 0} ariaLabel={`Back to the first step: ${name}`}>
            Reset
          </Button>
        </SpaceBetween>
        {s.reduced && (
          <Box variant="small" color="text-body-secondary">
            Reduced motion is on: the figure shows its finished state and moves only when you press Back or Step.
          </Box>
        )}
        <figcaption>
          <Box variant="small" color="text-body-secondary">
            {caption}
          </Box>
        </figcaption>
      </SpaceBetween>
    </figure>
  );
}
