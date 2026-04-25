import React from 'react';

// Side-by-side: Trainium NEFF AOT path versus GPU determinism opt-in.

export function DeterminismDiagram() {
  const width = 880;
  const height = 360;
  const colW = (width - 60) / 2;

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Trainium NEFF ahead-of-time path versus GPU determinism opt-in flags"
        style={{ border: '1px solid #e9ebed', borderRadius: '8px', background: '#ffffff' }}
      >
        <text x={20} y={26} fontSize={13} fontWeight={700} fill="#16191f">
          Determinism — two architectural paths to the same property
        </text>

        {/* Left: Trainium NEFF AOT */}
        <rect x={20} y={50} width={colW} height={290} rx={10} fill="#fdf3ec" stroke="#ec7211" strokeWidth={2} />
        <text x={36} y={78} fontSize={13} fontWeight={700} fill="#ec7211">
          Trainium — determinism by construction
        </text>
        <text x={36} y={96} fontSize={11} fill="#687078">
          NEFF ahead-of-time compilation
        </text>
        <text x={36} y={124} fontSize={12} fontWeight={600} fill="#16191f">
          Why it is automatic
        </text>
        <text x={36} y={144} fontSize={11} fill="#16191f">• Schedule is fixed in the NEFF binary</text>
        <text x={36} y={160} fontSize={11} fill="#16191f">• No runtime kernel selection</text>
        <text x={36} y={176} fontSize={11} fill="#16191f">• No warp scheduler decisions</text>
        <text x={36} y={192} fontSize={11} fill="#16191f">• No cache contention (compiler-managed)</text>
        <text x={36} y={208} fontSize={11} fill="#16191f">• Reduction order baked into schedule</text>
        <text x={36} y={236} fontSize={12} fontWeight={600} fill="#16191f">
          What you get
        </text>
        <text x={36} y={254} fontSize={11} fill="#16191f">
          Same NEFF + same input + same silicon
        </text>
        <text x={36} y={270} fontSize={11} fill="#16191f">
          → bit-exact same output, same order
        </text>
        <text x={36} y={300} fontSize={11} fontStyle="italic" fill="#ec7211">
          Audit reconstruction is replay,
        </text>
        <text x={36} y={316} fontSize={11} fontStyle="italic" fill="#ec7211">
          not approximate reproduction.
        </text>

        {/* Right: GPU opt-in */}
        <rect x={40 + colW} y={50} width={colW} height={290} rx={10} fill="#f2f8fd" stroke="#0972d3" strokeWidth={2} />
        <text x={56 + colW} y={78} fontSize={13} fontWeight={700} fill="#0972d3">
          NVIDIA GPU — determinism opt-in
        </text>
        <text x={56 + colW} y={96} fontSize={11} fill="#687078">
          CCCL + cuBLAS / cuDNN flags
        </text>
        <text x={56 + colW} y={124} fontSize={12} fontWeight={600} fill="#16191f">
          What you turn on
        </text>
        <text x={56 + colW} y={144} fontSize={11} fill="#16191f">• cuBLAS deterministic mode</text>
        <text x={56 + colW} y={160} fontSize={11} fill="#16191f">• cuDNN deterministic kernel selection</text>
        <text x={56 + colW} y={176} fontSize={11} fill="#16191f">• CCCL 3.1 collective determinism</text>
        <text x={56 + colW} y={192} fontSize={11} fill="#16191f">• PRNG seeding + reduction order</text>
        <text x={56 + colW} y={208} fontSize={11} fill="#16191f">• Avoid atomic-add reductions</text>
        <text x={56 + colW} y={236} fontSize={12} fontWeight={600} fill="#16191f">
          What it costs
        </text>
        <text x={56 + colW} y={254} fontSize={11} fill="#16191f">
          Throughput drop (deterministic kernels
        </text>
        <text x={56 + colW} y={270} fontSize={11} fill="#16191f">
          are not always the fastest)
        </text>
        <text x={56 + colW} y={300} fontSize={11} fontStyle="italic" fill="#0972d3">
          Achievable, but you opt into it
        </text>
        <text x={56 + colW} y={316} fontSize={11} fontStyle="italic" fill="#0972d3">
          and validate per-kernel.
        </text>
      </svg>
    </div>
  );
}
