import React from 'react';

// Hopper SM internals: register file, SMEM/L1, tensor cores, async copy + TMA, sourced from L2 → HBM3.

export function HopperSmDiagram() {
  const width = 880;
  const height = 360;

  return (
    <div style={{ width: '100%' }}>
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Hopper Streaming Multiprocessor internals: warp scheduler, register file, shared memory, L1, tensor cores, async copy and TMA, sourced from L2 and HBM3"
        style={{ border: '1px solid #e9ebed', borderRadius: '8px', background: '#ffffff' }}
      >
        <text x={20} y={24} fontSize={13} fontWeight={700} fill="#16191f">
          Hopper SM internals — what an H100 / H200 streaming multiprocessor holds
        </text>

        {/* SM box */}
        <rect x={20} y={50} width={580} height={290} rx={10} fill="#f2f8fd" stroke="#0972d3" strokeWidth={2} />
        <text x={36} y={72} fontSize={13} fontWeight={700} fill="#0972d3">Streaming Multiprocessor (SM)</text>
        <text x={36} y={88} fontSize={11} fill="#687078">64 concurrent warps · 32 threads / warp · max 32 thread blocks</text>

        {/* Register file */}
        <rect x={36} y={104} width={170} height={80} rx={6} fill="#ffffff" stroke="#0972d3" strokeWidth={1.5} />
        <text x={46} y={124} fontSize={12} fontWeight={700} fill="#16191f">Register file</text>
        <text x={46} y={142} fontSize={11} fill="#16191f">64K × 32-bit / SM</text>
        <text x={46} y={156} fontSize={11} fill="#16191f">≤ 255 registers / thread</text>
        <text x={46} y={174} fontSize={10} fontStyle="italic" fill="#0972d3">~1 cycle</text>

        {/* SMEM / L1 */}
        <rect x={216} y={104} width={170} height={80} rx={6} fill="#ecf7ec" stroke="#037f0c" strokeWidth={1.5} />
        <text x={226} y={124} fontSize={12} fontWeight={700} fill="#16191f">SMEM + L1</text>
        <text x={226} y={142} fontSize={11} fill="#16191f">228 KB SMEM / SM</text>
        <text x={226} y={156} fontSize={11} fill="#16191f">256 KB combined</text>
        <text x={226} y={174} fontSize={10} fontStyle="italic" fill="#037f0c">~10-15 ns</text>

        {/* Tensor Core */}
        <rect x={396} y={104} width={188} height={80} rx={6} fill="#fdf3ec" stroke="#ec7211" strokeWidth={1.5} />
        <text x={406} y={124} fontSize={12} fontWeight={700} fill="#16191f">4th-gen Tensor Core</text>
        <text x={406} y={142} fontSize={11} fill="#16191f">FP8 / BF16 / FP16 / TF32</text>
        <text x={406} y={156} fontSize={11} fill="#16191f">wgmma instructions</text>
        <text x={406} y={174} fontSize={10} fontStyle="italic" fill="#ec7211">3,958 TFLOPS FP8 (full chip)</text>

        {/* Async copy / TMA / cooperative groups */}
        <rect x={36} y={200} width={548} height={56} rx={6} fill="#ffffff" stroke="#414d5c" strokeWidth={1.5} />
        <text x={46} y={222} fontSize={12} fontWeight={700} fill="#16191f">Async copy + TMA + cooperative groups</text>
        <text x={46} y={240} fontSize={11} fill="#687078">Software-pipelined operand staging from L2 / HBM into SMEM. The compiler (CUTLASS, Triton, Inductor) decides when bytes land.</text>

        {/* Warp scheduler */}
        <rect x={36} y={272} width={548} height={56} rx={6} fill="#ffffff" stroke="#414d5c" strokeWidth={1.5} />
        <text x={46} y={294} fontSize={12} fontWeight={700} fill="#16191f">Warp scheduler</text>
        <text x={46} y={312} fontSize={11} fill="#687078">Picks ready warps per clock; no speculation. Stalled warps yield to ready ones — latency hiding via concurrency, not branch prediction.</text>

        {/* L2 + HBM column */}
        <rect x={620} y={50} width={240} height={130} rx={10} fill="#fce7e7" stroke="#d91515" strokeWidth={2} />
        <text x={636} y={72} fontSize={13} fontWeight={700} fill="#d91515">L2 cache (device-wide)</text>
        <text x={636} y={92} fontSize={11} fill="#16191f">50 MB on H100 / H200</text>
        <text x={636} y={108} fontSize={11} fill="#16191f">Shared across all SMs</text>
        <text x={636} y={126} fontSize={10} fontStyle="italic" fill="#d91515">~150 ns class</text>

        <rect x={620} y={196} width={240} height={144} rx={10} fill="#fce7e7" stroke="#d91515" strokeWidth={2} />
        <text x={636} y={220} fontSize={13} fontWeight={700} fill="#d91515">HBM</text>
        <text x={636} y={240} fontSize={11} fill="#16191f">H100: 80 GB HBM3</text>
        <text x={636} y={256} fontSize={11} fill="#16191f">→ 3.35 TB/s</text>
        <text x={636} y={278} fontSize={11} fill="#16191f">H200: 141 GB HBM3e</text>
        <text x={636} y={294} fontSize={11} fill="#16191f">→ 4.8 TB/s (1.4×)</text>
        <text x={636} y={318} fontSize={10} fontStyle="italic" fill="#d91515">~250 ns latency</text>

        {/* Arrows from SM to L2/HBM */}
        <line x1={600} y1={190} x2={620} y2={120} stroke="#16191f" strokeWidth={1.5} markerEnd="url(#arrowL)" />
        <line x1={600} y1={230} x2={620} y2={266} stroke="#16191f" strokeWidth={1.5} markerEnd="url(#arrowL)" />
        <defs>
          <marker id="arrowL" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#16191f" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
