import type { CSSProperties } from 'react';

/**
 * One GPU card drawn as separate engines, with the engines a given workload uses outlined.
 *
 * Shared by section 13 (Rendering and Ray Tracing) and section 20 (Fifteen Workloads, Five
 * Shapes). The drawing carries no numbers. Which engine a workload uses comes from the claim
 * registers and lives in ENGINES_BY_WORKLOAD below, with a one-line reason per workload.
 *
 * The svg-a11y gate reads literal strings on the svg tag, so the title id is fixed: mount one
 * instance per page. `idPrefix` namespaces every other id.
 */

export type GpuEngine = 'tensor' | 'rt' | 'nvenc' | 'nvdec' | 'general' | 'memory';

export type GpuWorkload =
  | 'policy-training'
  | 'policy-inference'
  | 'physics-batch'
  | 'rtx-rendering'
  | 'compute-ray-tracing'
  | 'video-decode'
  | 'video-encode'
  | 'world-model-generation';

export interface WorkloadEngines {
  /** Short name for selectors and for the "used by" line in the drawing. */
  label: string;
  /** The engines this workload loads. */
  engines: GpuEngine[];
  /** One line saying why, in reader words. */
  reason: string;
  /** Register entries behind the mapping, space separated, for a Figure's `cites`. */
  cites: string;
}

/**
 * Which engines each workload uses. Sources: register 08 (the workload table, F08-76; the unit
 * list, F08-36; tensor cores, F08-42; video engines, F08-31 and F08-44) and register 06 (GPU
 * physics, F06-100; the three rendering paths, F06-101; the RTX requirement, F06-52).
 */
export const ENGINES_BY_WORKLOAD: Record<GpuWorkload, WorkloadEngines> = {
  'policy-training': {
    label: 'policy training',
    engines: ['tensor', 'memory'],
    reason: 'Forward and backward passes of a network are matrix multiplies, and GPU memory decides which model fits.',
    cites: 'F08-42 F08-76',
  },
  'policy-inference': {
    label: 'policy inference',
    engines: ['tensor', 'memory'],
    reason: 'One forward pass per call: the same matrix multiplies as training, with the weights held in GPU memory.',
    cites: 'F08-42 F08-76',
  },
  'physics-batch': {
    label: 'physics batches',
    engines: ['general', 'memory'],
    reason:
      'Thousands of copies of the scene are stepped by ordinary GPU code on the general compute cores. By our reading of what those kernels compute, the tensor cores are not involved.',
    cites: 'F06-100 F08-42 F08-76',
  },
  'rtx-rendering': {
    label: 'RTX rendering',
    engines: ['rt', 'memory'],
    reason:
      'The RTX renderer hands the search for what each ray hits to the RT cores, so the card must have them. The images of every camera are held in GPU memory.',
    cites: 'F06-52 F06-57 F06-101',
  },
  'compute-ray-tracing': {
    label: 'ray tracing as GPU code',
    engines: ['general', 'memory'],
    reason:
      'A ray tracer can also be written as ordinary GPU code. The search then runs on the general compute cores and asks for no RT cores (our reading of the renderers documented this way).',
    cites: 'F06-24 F06-62 F06-101',
  },
  'video-decode': {
    label: 'video decode',
    engines: ['nvdec'],
    reason:
      'Decoding is fixed-function work on the decode engines, separate from the compute cores. The engine must support the codec of the file: some data-centre cards cannot decode AV1 (AOMedia Video 1, the codec LeRobot writes by default).',
    cites: 'F08-31 F08-76 F05-47 F05-35',
  },
  'video-encode': {
    label: 'video encode',
    engines: ['nvenc'],
    reason:
      'Encoding is fixed-function work on the encode engines. Some data-centre training cards have no encode engine at all, and the work falls to CPU cores.',
    cites: 'F08-31 F08-44 F05-47',
  },
  'world-model-generation': {
    label: 'world-model generation',
    engines: ['tensor', 'memory'],
    reason:
      'A generative world model is a large network run many times per clip: tensor cores for the arithmetic and tens of gigabytes of GPU memory to hold it.',
    cites: 'F05-108 F08-76',
  },
};

/** Workloads in the order a selector should list them. */
export const GPU_WORKLOADS: GpuWorkload[] = [
  'policy-training',
  'policy-inference',
  'physics-batch',
  'rtx-rendering',
  'compute-ray-tracing',
  'video-decode',
  'video-encode',
  'world-model-generation',
];

interface EngineRow {
  id: GpuEngine;
  name: string;
  does: string;
  fill: string;
  ink: string;
}

/* Colours follow the dive's palette for machine parts (revamp/diagram-plan.md, section 1). */
const ROWS: EngineRow[] = [
  { id: 'tensor', name: 'Tensor cores', does: 'matrix multiplies for training and inference', fill: '#e6f6ea', ink: '#1e7b3a' },
  { id: 'rt', name: 'Ray-tracing cores (RT cores)', does: 'find which triangle each ray hits', fill: '#fdeedd', ink: '#a85a0a' },
  { id: 'nvenc', name: 'Video encode engines (NVENC)', does: 'compress frames into video', fill: '#fde8ef', ink: '#a8274f' },
  { id: 'nvdec', name: 'Video decode engines (NVDEC)', does: 'turn video back into frames', fill: '#fde8ef', ink: '#a8274f' },
  { id: 'general', name: 'General compute cores', does: 'ordinary GPU code: everything else', fill: '#ffffff', ink: '#5f6b7a' },
];

const MEMORY: EngineRow = {
  id: 'memory',
  name: 'GPU memory',
  does: 'shared: every engine works out of it',
  fill: '#efe9fb',
  ink: '#5b3fa8',
};

const INK = '#16191f';
const MUTED = '#5f6b7a';
const EMPHASIS = '#0972d3';

const ROW_H = 62;
const ROW_GAP = 8;
const ROW_TOP = 46;

const WRAP: CSSProperties = { maxWidth: 520, margin: '0 auto' };

export function GpuEngines({ workload, idPrefix }: { workload: GpuWorkload | null; idPrefix: string }) {
  const picked = workload ? ENGINES_BY_WORKLOAD[workload] : null;
  const memoryTop = ROW_TOP + ROWS.length * (ROW_H + ROW_GAP) + 22;
  const cardBottom = memoryTop + ROW_H + 12;

  const row = (r: EngineRow, y: number) => {
    const used = picked ? picked.engines.includes(r.id) : false;
    return (
      <g key={r.id} data-engine={r.id} data-used={used ? 'true' : 'false'}>
        <rect
          x="20"
          y={y}
          width="360"
          height={ROW_H}
          rx="6"
          fill={r.fill}
          stroke={used ? EMPHASIS : r.ink}
          strokeWidth={used ? 2.5 : 1.2}
        />
        <path d={`M26 ${y + 8} V${y + ROW_H - 8}`} stroke={r.ink} strokeWidth="4" strokeLinecap="round" />
        <text x="38" y={y + 20} fontFamily="sans-serif" fontSize="13" fontWeight="bold" fill={r.ink}>
          {r.name}
        </text>
        <text x="38" y={y + 37} fontFamily="sans-serif" fontSize="12" fill={INK}>
          {r.does}
        </text>
        {picked && (
          <text
            x="38"
            y={y + 54}
            fontFamily="sans-serif"
            fontSize="12"
            fontWeight={used ? 'bold' : 'normal'}
            fill={used ? EMPHASIS : MUTED}
          >
            {used ? `used by: ${picked.label}` : 'not used by this workload'}
          </text>
        )}
      </g>
    );
  };

  return (
    <div style={WRAP}>
      <svg viewBox="0 0 400 498" role="img" aria-labelledby="gpu-engines-title" aria-describedby={`${idPrefix}-gpu-engines-desc`} style={{ width: '100%', height: 'auto' }}>
        <title id="gpu-engines-title">One GPU card drawn as separate engines that share one memory</title>
        <desc id={`${idPrefix}-gpu-engines-desc`}>
          {picked
            ? `Five engines on one card: tensor cores, ray-tracing cores, video encode engines, video decode engines and general compute cores, above the GPU memory they share. Outlined for ${picked.label}: ${[...ROWS, MEMORY]
                .filter((r) => picked.engines.includes(r.id))
                .map((r) => r.name)
                .join(', ')}.`
            : 'Five engines on one card: tensor cores, ray-tracing cores, video encode engines, video decode engines and general compute cores, above the GPU memory they share.'}
        </desc>
        <rect x="0" y="0" width="400" height="498" fill="#fbfbfd" />
        <text x="12" y="24" fontFamily="sans-serif" fontSize="13" fontWeight="bold" fill={INK}>
          One GPU card
        </text>
        <rect x="8" y="34" width="384" height={cardBottom - 34} rx="10" fill="#ffffff" stroke={MUTED} strokeWidth="1.5" />
        {ROWS.map((r, i) => row(r, ROW_TOP + i * (ROW_H + ROW_GAP)))}
        <text x="200" y={memoryTop - 7} textAnchor="middle" fontFamily="sans-serif" fontSize="12" fill={MUTED}>
          all of them read and write
        </text>
        {row(MEMORY, memoryTop)}
      </svg>
    </div>
  );
}
