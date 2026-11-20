import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { AnimatedFigure } from './Figure';

/**
 * The robot's loop running on real infrastructure: six stages, each drawn as what happens to the
 * arm's data, the part of the machine that stage loads, and the AWS service it runs on.
 *
 * Shared by section 20 (Fifteen Workloads, Five Shapes), which reads the "Loads" row, and section
 * 24 (Orchestrating Physical AI on AWS), which reads the "Runs on" row. The drawing prints no
 * numbers. The placements are the dive's reading of the registers (register 08 for the machine
 * part, register 09 for the service); the section passes the entries in `cites`.
 *
 * The svg-a11y gate reads literal strings on the svg tag, so the title id is fixed: mount one
 * instance per section.
 */

const INK = '#16191f';
const MUTED = '#5f6b7a';
const LINE = '#8d99a8';
const EMPHASIS = '#0972d3';
const FONT = 'sans-serif';

type Tone = 'cpu' | 'memory' | 'tensor' | 'general' | 'rt' | 'video' | 'outside';

/* The same colours section 20 gives the machine parts. */
const TONES: Record<Tone, { fill: string; ink: string }> = {
  cpu: { fill: '#e8f1fb', ink: '#1f5fa8' },
  memory: { fill: '#efe9fb', ink: '#5b3fa8' },
  tensor: { fill: '#e6f6ea', ink: '#1e7b3a' },
  general: { fill: '#f4f5f7', ink: '#5f6b7a' },
  rt: { fill: '#fdeedd', ink: '#a85a0a' },
  video: { fill: '#fde8ef', ink: '#a8274f' },
  outside: { fill: '#eef0f2', ink: '#44505c' },
};

type Picture = 'collect' | 'curate' | 'simulate' | 'train' | 'evaluate' | 'deploy';

interface Stage {
  name: string;
  picture: Picture;
  /** What happens in the robot's loop, three short lines. */
  does: string[];
  /** The machine part the stage loads, two short lines, and its colour. */
  loads: string[];
  tone: Tone;
  /** The AWS service it runs on, two short lines. */
  runs: string[];
  /** What the stage hands to the next one. */
  hands: string;
}

const STAGES: Stage[] = [
  {
    name: 'Collect',
    picture: 'collect',
    does: ['A person guides the arm.', 'Cameras and joint angles', 'are recorded as episodes.'],
    loads: ['CPU cores beside the robot', '(video encoding)'],
    tone: 'cpu',
    runs: ["The robot's own computer,", 'then an Amazon S3 bucket'],
    hands: 'episodes (video and joints)',
  },
  {
    name: 'Curate',
    picture: 'curate',
    does: ['Episodes are decoded,', 'checked, filtered and', 'indexed for search.'],
    loads: ['CPU cores or GPU video', 'decoders, then tensor cores'],
    tone: 'video',
    runs: ['AWS Batch array job on', 'Spot, one child per shard'],
    hands: 'a clean dataset',
  },
  {
    name: 'Simulate',
    picture: 'simulate',
    does: ['Many copies of the arm', 'run in simulation to', 'multiply the data.'],
    loads: ['General GPU compute, and', 'ray-tracing cores for cameras'],
    tone: 'rt',
    runs: ['Batch or Amazon EKS on', 'Spot, G-family instances'],
    hands: 'synthetic episodes',
  },
  {
    name: 'Train',
    picture: 'train',
    does: ['A policy learns to map', 'what the cameras see to', 'the next arm motions.'],
    loads: ['GPU tensor cores, with', 'GPU memory as the gate'],
    tone: 'tensor',
    runs: ['One GPU: Batch, SageMaker.', 'Many nodes: HyperPod, PCS'],
    hands: 'a checkpoint (weights)',
  },
  {
    name: 'Evaluate',
    picture: 'evaluate',
    does: ['Each checkpoint attempts', 'the task many times in', 'simulation and is scored.'],
    loads: ['A mix: physics, simulated', 'cameras, policy inference'],
    tone: 'general',
    runs: ['Batch array job on Spot,', 'one child per seed'],
    hands: 'a success rate',
  },
  {
    name: 'Deploy',
    picture: 'deploy',
    does: ['The best policy is built', "for the robot's chip and", 'sent to every arm.'],
    loads: ["The device's own GPU;", 'no cloud GPU at all'],
    tone: 'outside',
    runs: ['AWS IoT Greengrass,', 'a staged fleet rollout'],
    hands: 'new episodes from the fleet',
  },
];

export const LOOP_STEPS: string[] = [
  'Collect. A person guides the arm through the task while the cameras and the joint angles are recorded. The work happens on the computer next to the robot, which spends its CPU cores compressing video. The cloud only receives files.',
  'Curate. The uploaded episodes are decoded, checked and filtered. Each shard of episodes is independent of the others, so this stage is many small jobs that can be interrupted and rerun.',
  'Simulate. The arm and its scene are copied many times inside a simulator to produce more data than a person could record. The copies load the general compute of a GPU, and its ray-tracing cores when cameras are rendered.',
  'Train. The policy is fitted to the real and synthetic episodes. This is the stage that loads the tensor cores, and GPU memory decides which model fits on which instance.',
  'Evaluate. Every checkpoint attempts the task many times in simulation, each attempt from a different start. The attempts are independent, so they fan out as one job per seed.',
  'Deploy. The chosen policy is compiled for the chip on the robot and delivered to the fleet in stages. No cloud GPU is involved; the questions are rollout safety and artifact size.',
  'The loop closes. The deployed arms record new episodes, including the attempts that failed, and those go back to the first stage.',
];

function useNarrow(): boolean {
  const query = '(max-width: 760px)';
  const [narrow, setNarrow] = useState(
    () => typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia(query).matches,
  );
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined;
    const mq = window.matchMedia(query);
    const onChange = () => setNarrow(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return narrow;
}

/** A small arm: base, two links and a gripper, drawn from the base point. */
function MiniArm({ x, y, s, stroke }: { x: number; y: number; s: number; stroke: string }) {
  return (
    <g stroke={stroke} strokeWidth={Math.max(1.2, 2.4 * s)} strokeLinecap="round" fill="none">
      <line x1={x - 7 * s} y1={y} x2={x + 7 * s} y2={y} />
      <line x1={x} y1={y} x2={x - 6 * s} y2={y - 16 * s} />
      <line x1={x - 6 * s} y1={y - 16 * s} x2={x + 10 * s} y2={y - 24 * s} />
      <line x1={x + 10 * s} y1={y - 24 * s} x2={x + 15 * s} y2={y - 17 * s} />
      <line x1={x + 15 * s} y1={y - 17 * s} x2={x + 12 * s} y2={y - 12 * s} />
      <line x1={x + 15 * s} y1={y - 17 * s} x2={x + 19 * s} y2={y - 13 * s} />
    </g>
  );
}

function Pictogram({ kind, x, y }: { kind: Picture; x: number; y: number }) {
  const w = 84;
  const h = 64;
  const frame = <rect x={x} y={y} width={w} height={h} rx="6" fill="#f2f5f9" stroke="#c3ccd8" strokeWidth="1" />;
  if (kind === 'collect') {
    return (
      <g>
        {frame}
        <MiniArm x={x + 30} y={y + 54} s={1.3} stroke={INK} />
        <rect x={x + 49} y={y + 49} width="9" height="6" fill="#d13b32" />
        <rect x={x + 60} y={y + 8} width="16" height="11" rx="2" fill="#ffffff" stroke={INK} strokeWidth="1.4" />
        <polygon points={`${x + 60},${y + 13.5} ${x + 54},${y + 9} ${x + 54},${y + 18}`} fill={INK} />
        <line x1={x + 54} y1={y + 16} x2={x + 46} y2={y + 30} stroke={MUTED} strokeWidth="1" strokeDasharray="2 2" />
        <line x1={x + 54} y1={y + 11} x2={x + 22} y2={y + 30} stroke={MUTED} strokeWidth="1" strokeDasharray="2 2" />
      </g>
    );
  }
  if (kind === 'curate') {
    const keep = [true, true, false, true, false, true];
    return (
      <g>
        {frame}
        {keep.map((k, i) => {
          const fx = x + 8 + (i % 3) * 24;
          const fy = y + 8 + Math.floor(i / 3) * 26;
          return (
            <g key={i} opacity={k ? 1 : 0.45}>
              <rect x={fx} y={fy} width="20" height="20" rx="2" fill={k ? '#ffffff' : '#e3e6ea'} stroke={k ? '#1e7b3a' : MUTED} strokeWidth="1.4" />
              {k ? (
                <polyline points={`${fx + 5},${fy + 10} ${fx + 9},${fy + 14} ${fx + 15},${fy + 6}`} fill="none" stroke="#1e7b3a" strokeWidth="1.8" />
              ) : (
                <g stroke={MUTED} strokeWidth="1.6">
                  <line x1={fx + 5} y1={fy + 5} x2={fx + 15} y2={fy + 15} />
                  <line x1={fx + 15} y1={fy + 5} x2={fx + 5} y2={fy + 15} />
                </g>
              )}
            </g>
          );
        })}
      </g>
    );
  }
  if (kind === 'simulate') {
    return (
      <g>
        {frame}
        {Array.from({ length: 8 }, (_, i) => {
          const cx = x + 4 + (i % 4) * 19.5;
          const cy = y + 5 + Math.floor(i / 4) * 28;
          return (
            <g key={i}>
              <rect x={cx} y={cy} width="17" height="25" rx="2" fill="#ffffff" stroke="#a85a0a" strokeWidth="1" />
              <MiniArm x={cx + 7} y={cy + 21} s={0.55} stroke={INK} />
            </g>
          );
        })}
      </g>
    );
  }
  if (kind === 'train') {
    const layers = [
      [18, 32, 46],
      [12, 26, 40, 54],
      [25, 39],
    ];
    const lx = [x + 12, x + 32, x + 52];
    return (
      <g>
        {frame}
        {layers.slice(0, 2).flatMap((layer, li) =>
          layer.flatMap((a) => layers[li + 1].map((b) => <line key={`${li}-${a}-${b}`} x1={lx[li]} y1={y + a} x2={lx[li + 1]} y2={y + b} stroke="#9fb8a6" strokeWidth="0.9" />)),
        )}
        {layers.flatMap((layer, li) => layer.map((a) => <circle key={`${li}-${a}`} cx={lx[li]} cy={y + a} r="4" fill="#ffffff" stroke="#1e7b3a" strokeWidth="1.5" />))}
        <polyline points={`${x + 60},${y + 12} ${x + 64},${y + 30} ${x + 69},${y + 40} ${x + 74},${y + 45} ${x + 79},${y + 47}`} fill="none" stroke="#1e7b3a" strokeWidth="1.8" />
        <line x1={x + 59} y1={y + 52} x2={x + 80} y2={y + 52} stroke={MUTED} strokeWidth="1" />
      </g>
    );
  }
  if (kind === 'evaluate') {
    const ok = [true, true, false, true, true, true, false, true];
    return (
      <g>
        {frame}
        {ok.map((k, i) => {
          const fx = x + 5 + (i % 4) * 19.5;
          const fy = y + 7 + Math.floor(i / 4) * 27;
          return (
            <g key={i}>
              <rect x={fx} y={fy} width="16" height="22" rx="2" fill={k ? '#e6f6ea' : '#fdecea'} stroke={k ? '#1e7b3a' : '#b42318'} strokeWidth="1.3" />
              {k ? (
                <polyline points={`${fx + 4},${fy + 11} ${fx + 7},${fy + 15} ${fx + 12},${fy + 7}`} fill="none" stroke="#1e7b3a" strokeWidth="1.7" />
              ) : (
                <g stroke="#b42318" strokeWidth="1.6">
                  <line x1={fx + 4} y1={fy + 7} x2={fx + 12} y2={fy + 15} />
                  <line x1={fx + 12} y1={fy + 7} x2={fx + 4} y2={fy + 15} />
                </g>
              )}
            </g>
          );
        })}
      </g>
    );
  }
  return (
    <g>
      {frame}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <MiniArm x={x + 16 + i * 26} y={y + 56} s={0.8} stroke={INK} />
          <rect x={x + 10 + i * 26} y={y + 20} width="12" height="9" rx="1.5" fill="#dfe7f1" stroke={MUTED} strokeWidth="1" />
          <line x1={x + 16 + i * 26} y1={y + 6} x2={x + 16 + i * 26} y2={y + 17} stroke={EMPHASIS} strokeWidth="1.4" />
          <polygon points={`${x + 16 + i * 26},${y + 19} ${x + 13 + i * 26},${y + 14} ${x + 19 + i * 26},${y + 14}`} fill={EMPHASIS} />
        </g>
      ))}
    </g>
  );
}

function Txt({ x, y, bold, fill, size, anchor, children }: { x: number; y: number; bold?: boolean; fill?: string; size?: number; anchor?: 'start' | 'middle'; children: ReactNode }) {
  return (
    <text x={x} y={y} fontFamily={FONT} fontSize={size ?? 12} fontWeight={bold ? 'bold' : 'normal'} fill={fill ?? INK} textAnchor={anchor ?? 'start'}>
      {children}
    </text>
  );
}

const CARD_H = 206;

function Card({ stage, n, x, y, w, active, passed, emphasis, reduced }: { stage: Stage; n: number; x: number; y: number; w: number; active: boolean; passed: boolean; emphasis: 'part' | 'service'; reduced: boolean }) {
  const t = TONES[stage.tone];
  const col = x + 78;
  const partBold = emphasis === 'part';
  return (
    <g style={{ opacity: active || passed ? 1 : 0.62, transition: reduced ? 'none' : 'opacity 300ms ease' }}>
      <rect x={x} y={y} width={w} height={CARD_H} rx="8" fill="#ffffff" stroke={active ? EMPHASIS : LINE} strokeWidth={active ? 2.6 : 1.2} />
      <circle cx={x + 18} cy={y + 17} r="10" fill={active ? EMPHASIS : '#ffffff'} stroke={active ? EMPHASIS : INK} strokeWidth="1.4" />
      <Txt x={x + 18} y={y + 21.5} anchor="middle" bold fill={active ? '#ffffff' : INK}>
        {n}
      </Txt>
      <Txt x={x + 36} y={y + 22} bold size={14}>
        {stage.name}
      </Txt>
      <Pictogram kind={stage.picture} x={x + 10} y={y + 34} />
      {stage.does.map((line, i) => (
        <Txt key={line} x={x + 102} y={y + 48 + i * 16}>
          {line}
        </Txt>
      ))}
      <line x1={x + 10} y1={y + 106} x2={x + w - 10} y2={y + 106} stroke="#e3e6ea" strokeWidth="1" />
      <Txt x={x + 10} y={y + 123} fill={MUTED}>
        Loads
      </Txt>
      <rect x={col - 12} y={y + 113} width="8" height="26" rx="2" fill={t.fill} stroke={t.ink} strokeWidth="1" />
      {stage.loads.map((line, i) => (
        <Txt key={line} x={col} y={y + 123 + i * 15} bold={partBold} fill={partBold ? t.ink : INK}>
          {line}
        </Txt>
      ))}
      <Txt x={x + 10} y={y + 157} fill={MUTED}>
        Runs on
      </Txt>
      <rect x={col - 12} y={y + 147} width="8" height="26" rx="2" fill="#fff4e0" stroke="#b7791f" strokeWidth="1" />
      {stage.runs.map((line, i) => (
        <Txt key={line} x={col} y={y + 157 + i * 15} bold={!partBold} fill={INK}>
          {line}
        </Txt>
      ))}
      <Txt x={x + 10} y={y + 194} fill={MUTED}>
        Hands on
      </Txt>
      <Txt x={col} y={y + 194}>
        {stage.hands}
      </Txt>
    </g>
  );
}

function Flow({ x1, y1, x2, y2, on }: { x1: number; y1: number; x2: number; y2: number; on: boolean }) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const h = 8;
  const p = (da: number) => `${x2 - h * Math.cos(a + da)},${y2 - h * Math.sin(a + da)}`;
  const c = on ? EMPHASIS : LINE;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeWidth={on ? 2.4 : 1.6} />
      <polygon points={`${x2},${y2} ${p(0.5)} ${p(-0.5)}`} fill={c} />
    </g>
  );
}

function LoopSvg({ step, reduced, narrow, emphasis }: { step: number; reduced: boolean; narrow: boolean; emphasis: 'part' | 'service' }) {
  const closing = step >= STAGES.length;
  const W = narrow ? 400 : 840;
  const w = narrow ? 376 : 260;
  const gap = narrow ? 22 : 30;
  const top = 12;
  // Wide: 1 2 3 on the first row, 4 5 6 on the second from right to left, so 6 sits under 1.
  const pos = STAGES.map((_, i) => {
    if (narrow) return { x: 12, y: top + i * (CARD_H + gap) };
    const row = Math.floor(i / 3);
    const colIdx = row === 0 ? i : 5 - i;
    return { x: 12 + colIdx * (w + 18), y: top + row * (CARD_H + gap) };
  });
  const H = narrow ? top + 6 * (CARD_H + gap) + 16 : top + 2 * CARD_H + gap + 14;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="loop-on-aws-title" style={{ width: '100%', height: 'auto' }}>
      <title id="loop-on-aws-title">The robot&apos;s loop in six stages, with the machine part each stage loads and the AWS service it runs on</title>
      <desc>
        Six cards in loop order: collect, curate, simulate, train, evaluate, deploy. Each card has a small picture of
        the stage, three lines on what happens, the part of the machine it loads, the AWS service it runs on and what
        it hands to the next stage. An arrow from the last card returns to the first.
      </desc>
      <rect x="0" y="0" width={W} height={H} fill="#fbfbfd" />
      {STAGES.map((_, i) => {
        if (i === STAGES.length - 1) return null;
        const a = pos[i];
        const b = pos[i + 1];
        const on = step === i + 1;
        if (narrow) return <Flow key={i} x1={a.x + w / 2} y1={a.y + CARD_H} x2={b.x + w / 2} y2={b.y - 1} on={on} />;
        if (a.y === b.y) {
          const right = b.x > a.x;
          return <Flow key={i} x1={right ? a.x + w : a.x} y1={a.y + CARD_H / 2} x2={right ? b.x - 1 : b.x + w + 1} y2={a.y + CARD_H / 2} on={on} />;
        }
        return <Flow key={i} x1={a.x + w / 2} y1={a.y + CARD_H} x2={b.x + w / 2} y2={b.y - 1} on={on} />;
      })}
      {narrow ? (
        <g>
          <polyline points={`${12 + w / 2},${pos[5].y + CARD_H} ${12 + w / 2},${H - 6} 5,${H - 6} 5,${pos[0].y + 30}`} fill="none" stroke={closing ? EMPHASIS : LINE} strokeWidth={closing ? 2.4 : 1.6} />
          <polygon points={`12,${pos[0].y + 30} 4,${pos[0].y + 25} 4,${pos[0].y + 35}`} fill={closing ? EMPHASIS : LINE} />
        </g>
      ) : (
        <Flow x1={pos[5].x + w / 2} y1={pos[5].y} x2={pos[0].x + w / 2} y2={pos[0].y + CARD_H + 1} on={closing} />
      )}
      {STAGES.map((s, i) => (
        <Card key={s.name} stage={s} n={i + 1} x={pos[i].x} y={pos[i].y} w={w} active={closing ? i === 0 : step === i} passed={closing || i < step} emphasis={emphasis} reduced={reduced} />
      ))}
    </svg>
  );
}

/**
 * The loop figure. `emphasis` says which row the section is teaching: the machine part (section
 * 20) or the AWS service (section 24).
 */
export function LoopOnAws({ emphasis, cites, caption }: { emphasis: 'part' | 'service'; cites: string; caption: ReactNode }) {
  const narrow = useNarrow();
  return (
    <AnimatedFigure name="one episode through the loop on AWS" steps={LOOP_STEPS} intervalMs={3200} cites={cites} caption={caption}>
      {(step, reduced) => <LoopSvg step={step} reduced={reduced} narrow={narrow} emphasis={emphasis} />}
    </AnimatedFigure>
  );
}
