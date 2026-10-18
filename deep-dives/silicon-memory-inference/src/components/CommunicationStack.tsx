import React from 'react';

// The communication stack as a grid: one row per layer, one column per place
// the traffic runs. Idiom A (class-name block), prefix `cst-`. Every figure
// drawn here is cited in the caption under the diagram in
// CommunicationAndScaleOut.tsx.

interface Layer {
  name: string;
  role: string;
  /** Lines per column: NVLink domain, across GPU instances on EFA, Trainium. */
  cells?: [string[], string[], string[]];
  /** One cell spanning all three columns. */
  span?: string[];
}

const layers: Layer[] = [
  {
    name: 'Application',
    role: 'issues the operation',
    span: [
      'PyTorch, JAX, vLLM, SGLang, NKI kernels',
      'all-reduce, all-gather, all-to-all, KV-cache transfers',
    ],
  },
  {
    name: 'Collective library',
    role: 'many ranks, one operation',
    cells: [
      ['NCCL, NCCL EP, DeepEP', 'Wide-EP kernels for MoE'],
      ['NCCL via aws-ofi-nccl', 'DeepEP v2 (AWS fork) for MoE'],
      ['Neuron collectives on CC-Cores', 'nki.collectives.all_to_all_v'],
    ],
  },
  {
    name: 'Transfer library',
    role: 'one buffer, two workers',
    cells: [
      ['NIXL', 'GPU memory to GPU memory'],
      ['NIXL libfabric plugin', 'validated on EFA'],
      ['NIXL libfabric plugin', 'one EFA per Neuron device'],
    ],
  },
  {
    name: 'Transport',
    role: 'carries the bytes',
    cells: [
      ['NVLink'],
      ['EFA with SRD', '64 paths at a time'],
      ['NeuronLink-v3 / -v4', 'Trn2 / Trn3; EFA between servers'],
    ],
  },
  {
    name: 'Hardware',
    role: 'the link and its switch',
    cells: [
      ['NVSwitch'],
      ['Nitro card v5 / v6', 'v4 on P5'],
      ['4x4 torus per Trn2 instance', 'NeuronSwitch-v1 on Trn3'],
    ],
  },
];

const columns = [
  { head: 'GPUs in an NVLink domain', cls: 'nv' },
  { head: 'GPUs across instances (EFA)', cls: 'efa' },
  { head: 'Trainium', cls: 'trn' },
] as const;

const VB_W = 900;
const LABEL_X = 16;
const LABEL_W = 164;
const COL_X0 = 192;
const COL_GAP = 12;
const COL_W = (VB_W - LABEL_X - COL_X0 - COL_GAP * 2) / 3;
const ROW_Y0 = 76;
const ROW_H = 62;
const ROW_GAP = 10;
const VB_H = ROW_Y0 + layers.length * ROW_H + (layers.length - 1) * ROW_GAP + 18;

function colX(i: number): number {
  return COL_X0 + i * (COL_W + COL_GAP);
}

function CellText({ lines, cx, y }: { lines: string[]; cx: number; y: number }) {
  if (lines.length === 1) {
    return (
      <text className="cst-l1" x={cx} y={y + 35}>
        {lines[0]}
      </text>
    );
  }
  return (
    <>
      <text className="cst-l1" x={cx} y={y + 25}>
        {lines[0]}
      </text>
      <text className="cst-l2" x={cx} y={y + 44}>
        {lines[1]}
      </text>
    </>
  );
}

export function CommunicationStack() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        role="img"
        aria-labelledby="comm-stack-title"
        style={{
          width: '100%',
          minWidth: 640,
          height: 'auto',
          display: 'block',
        }}
      >
        <title id="comm-stack-title">
          Each layer of the communication stack has a different implementation depending on where
          the traffic runs. Inside an NVLink domain, NCCL, NCCL EP, DeepEP and NIXL run over NVLink
          and NVSwitch. Across GPU instances on AWS, NCCL reaches EFA through the aws-ofi-nccl
          plugin and NIXL through its libfabric plugin, and SRD sprays packets over 64 paths at a
          time from the Nitro card. On Trainium, Neuron collectives run on CC-Cores over NeuronLink,
          a torus on Trn2 and NeuronSwitch-v1 on Trn3, and NIXL needs one EFA interface per Neuron
          device.
        </title>
        <style>
          {`
            .cst-bg   { fill: #ffffff; stroke: #e9ebed; stroke-width: 1; }
            .cst-h    { fill: #16191f; font: 600 13px sans-serif; }
            .cst-ch   { fill: #16191f; font: 600 12px sans-serif; text-anchor: middle; }
            .cst-lab  { fill: #f4f4f4; stroke: #414d5c; stroke-width: 1.5; }
            .cst-ln   { fill: #16191f; font: 600 13px sans-serif; }
            .cst-lr   { fill: #414d5c; font: 11px sans-serif; }
            .cst-app  { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
            .cst-nv   { fill: #ecf7ec; stroke: #037f0c; stroke-width: 1.5; }
            .cst-efa  { fill: #fdf3ec; stroke: #ec7211; stroke-width: 1.5; }
            .cst-trn  { fill: #efe7fb; stroke: #6f4cc4; stroke-width: 1.5; }
            .cst-l1   { fill: #16191f; font: 600 11px sans-serif; text-anchor: middle; }
            .cst-l2   { fill: #414d5c; font: 11px sans-serif; text-anchor: middle; }
          `}
        </style>
        <rect className="cst-bg" x={0.5} y={0.5} width={VB_W - 1} height={VB_H - 1} rx={8} />
        <text className="cst-h" x={LABEL_X} y={28}>
          The communication stack, from the call to the link
        </text>
        {columns.map((c, i) => (
          <text key={c.head} className="cst-ch" x={colX(i) + COL_W / 2} y={60}>
            {c.head}
          </text>
        ))}
        {layers.map((l, r) => {
          const y = ROW_Y0 + r * (ROW_H + ROW_GAP);
          return (
            <g key={l.name}>
              <rect className="cst-lab" x={LABEL_X} y={y} width={LABEL_W} height={ROW_H} rx={6} />
              <text className="cst-ln" x={LABEL_X + 12} y={y + 25}>
                {l.name}
              </text>
              <text className="cst-lr" x={LABEL_X + 12} y={y + 44}>
                {l.role}
              </text>
              {l.span && (
                <>
                  <rect
                    className="cst-app"
                    x={COL_X0}
                    y={y}
                    width={COL_W * 3 + COL_GAP * 2}
                    height={ROW_H}
                    rx={6}
                  />
                  <CellText lines={l.span} cx={COL_X0 + (COL_W * 3 + COL_GAP * 2) / 2} y={y} />
                </>
              )}
              {l.cells &&
                l.cells.map((lines, i) => (
                  <g key={`${l.name}-${columns[i].cls}`}>
                    <rect
                      className={`cst-${columns[i].cls}`}
                      x={colX(i)}
                      y={y}
                      width={COL_W}
                      height={ROW_H}
                      rx={6}
                    />
                    <CellText lines={lines} cx={colX(i) + COL_W / 2} y={y} />
                  </g>
                ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
