import React from 'react';

interface Layer {
  name: string;
  what: string;
  fill: string;
  border: string;
}

const layers: Layer[] = [
  { name: 'Application — PyTorch / JAX / Triton kernels', what: 'Issues collective operations (allreduce, allgather, all-to-all)', fill: '#f2f8fd', border: '#0972d3' },
  { name: 'Collective library — NCCL / Neuron CC-Cores / DeepEP', what: 'Implements the collective on top of the transport layer', fill: '#ecf7ec', border: '#037f0c' },
  { name: 'Transfer library — NIXL', what: 'GPU-Direct RDMA without consuming SMs (used for KV cache handoff)', fill: '#ecf7ec', border: '#037f0c' },
  { name: 'Transport — EFA + SRD / NVLink / NeuronLink-v3', what: 'Reliable datagram delivery between GPUs / chips', fill: '#fdf3ec', border: '#ec7211' },
  { name: 'Hardware — Nitro v5 / NVSwitch / NeuronLink fabric', what: 'Physical layer, encryption, multi-path spraying', fill: '#fce7e7', border: '#d91515' },
];

export function CommunicationStack() {
  const width = 880;
  const rowH = 56;
  const rowGap = 8;
  const margin = { top: 50, side: 30 };
  const height = margin.top + layers.length * (rowH + rowGap) + 30;

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Communication stack from application down to hardware: NCCL, NIXL, EFA SRD, Nitro v5"
        style={{ border: '1px solid #e9ebed', borderRadius: '8px', background: '#ffffff' }}
      >
        <text x={20} y={26} fontSize={13} fontWeight={700} fill="#16191f">
          The communication stack — application to wire
        </text>
        {layers.map((l, i) => {
          const y = margin.top + i * (rowH + rowGap);
          return (
            <g key={l.name}>
              <rect
                x={margin.side}
                y={y}
                width={width - margin.side * 2}
                height={rowH}
                rx={6}
                fill={l.fill}
                stroke={l.border}
                strokeWidth={2}
              />
              <text x={margin.side + 14} y={y + 22} fontSize={12} fontWeight={700} fill={l.border}>
                {l.name}
              </text>
              <text x={margin.side + 14} y={y + 42} fontSize={11} fill="#16191f">
                {l.what}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
