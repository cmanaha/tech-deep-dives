import React from 'react';

// Blackwell GB100: two reticle-sized dies joined by NV-HBI (~10 TB/s) presented as one logical GPU.
// New: TMEM 256 KB / SM, tcgen05.mma, NVFP4 datapath.

export function BlackwellDieDiagram() {
  const width = 880;
  const height = 380;

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="NVIDIA Blackwell GB100: two reticle-sized dies joined by NV-HBI presented as a single logical GPU; new TMEM 256 KB per SM and tcgen05.mma instructions"
        style={{ border: '1px solid #e9ebed', borderRadius: '8px', background: '#ffffff' }}
      >
        <text x={20} y={24} fontSize={13} fontWeight={700} fill="#16191f">
          Blackwell GB100 — two reticle-sized dies stitched into one coherent GPU
        </text>

        {/* Die A */}
        <rect x={20} y={50} width={350} height={250} rx={10} fill="#f2f8fd" stroke="#0972d3" strokeWidth={2} />
        <text x={36} y={74} fontSize={13} fontWeight={700} fill="#0972d3">Die A — reticle-sized</text>
        <text x={36} y={92} fontSize={11} fill="#687078">TSMC 4NP · ~104B transistors</text>
        <text x={36} y={120} fontSize={12} fontWeight={600} fill="#16191f">Per-SM additions (Blackwell)</text>
        <text x={36} y={138} fontSize={11} fill="#16191f">• TMEM 256 KB (new tier 2)</text>
        <text x={36} y={154} fontSize={11} fill="#16191f">• 5th-gen Tensor Core</text>
        <text x={36} y={170} fontSize={11} fill="#16191f">• tcgen05.mma instructions</text>
        <text x={36} y={186} fontSize={11} fill="#16191f">• NVFP4 (E2M1) datapath</text>
        <text x={36} y={216} fontSize={12} fontWeight={600} fill="#16191f">Memory side</text>
        <text x={36} y={232} fontSize={11} fill="#16191f">4 HBM3e stacks per die</text>
        <text x={36} y={250} fontSize={11} fill="#16191f">B200: ~180 GB · 8 TB/s class</text>
        <text x={36} y={268} fontSize={11} fill="#16191f">B300: 288 GB · 8 TB/s</text>
        <text x={36} y={290} fontSize={10} fontStyle="italic" fill="#0972d3">UNKNOWN per-die HBM split</text>

        {/* NV-HBI bridge */}
        <rect x={384} y={130} width={112} height={90} rx={8} fill="#ecf7ec" stroke="#037f0c" strokeWidth={2} />
        <text x={440} y={156} fontSize={12} fontWeight={700} fill="#037f0c" textAnchor="middle">NV-HBI</text>
        <text x={440} y={174} fontSize={10} fill="#16191f" textAnchor="middle">High-Bandwidth</text>
        <text x={440} y={188} fontSize={10} fill="#16191f" textAnchor="middle">Interface</text>
        <text x={440} y={206} fontSize={11} fontWeight={700} fill="#037f0c" textAnchor="middle">~10 TB/s</text>

        {/* Die B */}
        <rect x={510} y={50} width={350} height={250} rx={10} fill="#f2f8fd" stroke="#0972d3" strokeWidth={2} />
        <text x={526} y={74} fontSize={13} fontWeight={700} fill="#0972d3">Die B — reticle-sized</text>
        <text x={526} y={92} fontSize={11} fill="#687078">Mirror layout to Die A</text>
        <text x={526} y={120} fontSize={12} fontWeight={600} fill="#16191f">Coherent presentation</text>
        <text x={526} y={138} fontSize={11} fill="#16191f">A single CUDA device ID</text>
        <text x={526} y={154} fontSize={11} fill="#16191f">Unified address space</text>
        <text x={526} y={170} fontSize={11} fill="#16191f">No NUMA in CUDA model</text>
        <text x={526} y={186} fontSize={11} fill="#16191f">Software-transparent NV-HBI</text>
        <text x={526} y={216} fontSize={12} fontWeight={600} fill="#16191f">Memory side</text>
        <text x={526} y={232} fontSize={11} fill="#16191f">4 HBM3e stacks per die</text>
        <text x={526} y={250} fontSize={11} fill="#16191f">Aggregate HBM addressed as one</text>

        <text x={20} y={330} fontSize={11} fill="#687078">
          Total NVFP4 throughput (Blackwell Ultra B300): 14 PFLOPS per GPU. NVFP4 reduces DeepSeek-V3.2 from 690 GB FP8 to 415 GB.
        </text>
        <text x={20} y={350} fontSize={11} fill="#687078">
          NVLink Gen 5 per GPU: 1.8 TB/s GPU-to-GPU.
        </text>
      </svg>
    </div>
  );
}
