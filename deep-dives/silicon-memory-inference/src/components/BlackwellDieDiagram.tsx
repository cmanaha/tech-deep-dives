import React from 'react';

// One Blackwell GPU: two reticle-limited dies joined by NV-HBI, programmed as one CUDA
// device. Lower band: where tcgen05.mma reads its operands and writes its accumulator.
// Every figure drawn here is cited in the caption the section renders below the SVG.
//
// On a phone the SVG keeps a 640 px minimum width and the wrapper scrolls sideways, so
// 11-unit labels render near 8 px instead of shrinking to 4 px.

export function BlackwellDieDiagram() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 880 448"
        role="img"
        aria-labelledby="bw-die-title"
        style={{ width: '100%', minWidth: 640, height: 'auto', display: 'block' }}
      >
        <title id="bw-die-title">
          A Blackwell GPU is two reticle-limited dies joined by the 10 TB/s NV-HBI link and
          programmed as one CUDA device with an L2 cache shared coherently by both dies. Inside
          each SM, one thread issues tcgen05.mma: operands A and B come from shared memory (A
          can also come from Tensor Memory) and the accumulator D lives in the 256 KB Tensor
          Memory rather than in registers.
        </title>
        <style>{`
          .bwd-pkg { fill: #fafbfc; stroke: #414d5c; stroke-width: 1.5; stroke-dasharray: 6 4; }
          .bwd-die { fill: #f2f8fd; stroke: #0972d3; stroke-width: 2; }
          .bwd-hbi { fill: #ecf7ec; stroke: #037f0c; stroke-width: 2; }
          .bwd-l2 { fill: #e6f4f2; stroke: #1f7a70; stroke-width: 1.5; }
          .bwd-hbm { fill: #fbf3d5; stroke: #8b6c00; stroke-width: 1.5; }
          .bwd-nvl { fill: #efe7fb; stroke: #6f4cc4; stroke-width: 1.5; }
          .bwd-sm { fill: #ffffff; stroke: #879596; stroke-width: 1.5; }
          .bwd-tm { fill: #f2f8fd; stroke: #0972d3; stroke-width: 2; }
          .bwd-link { stroke: #037f0c; stroke-width: 4; }
          .bwd-arr { stroke: #5f6b7a; stroke-width: 1.5; fill: none; marker-end: url(#bwd-ah); }
          .bwd-arr-opt { stroke: #5f6b7a; stroke-width: 1.5; fill: none; stroke-dasharray: 5 4; marker-end: url(#bwd-ah); }
          .bwd-h { fill: #16191f; font: 600 13px sans-serif; }
          .bwd-s { fill: #414d5c; font: 11px sans-serif; }
          .bwd-hc { fill: #16191f; font: 600 13px sans-serif; text-anchor: middle; }
          .bwd-dt { fill: #0972d3; font: 600 13px sans-serif; text-anchor: middle; }
          .bwd-gt { fill: #037f0c; font: 600 13px sans-serif; text-anchor: middle; }
          .bwd-tc { fill: #16191f; font: 11px sans-serif; text-anchor: middle; }
          .bwd-sc { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .bwd-bc { fill: #16191f; font: 600 11px sans-serif; text-anchor: middle; }
          .bwd-el { fill: #414d5c; font: 600 11px sans-serif; text-anchor: middle; }
        `}</style>
        <defs>
          <marker
            id="bwd-ah"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="8"
            markerHeight="8"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#5f6b7a" />
          </marker>
        </defs>

        <rect x="0" y="0" width="880" height="448" rx="8" fill="#ffffff" stroke="#e9ebed" />

        {/* The package: one CUDA device */}
        <rect className="bwd-pkg" x="12" y="12" width="856" height="272" rx="10" />
        <text className="bwd-h" x="28" y="36">
          One Blackwell GPU, one CUDA device
        </text>
        <text className="bwd-s" x="28" y="54">
          208B transistors on TSMC 4NP across two dies; B300 has up to 160 SMs
        </text>

        {/* Die A */}
        <rect className="bwd-die" x="28" y="66" width="336" height="104" rx="8" />
        <text className="bwd-dt" x="196" y="92">
          Die A (reticle-limited)
        </text>
        <text className="bwd-tc" x="196" y="114">
          SMs with 5th-gen Tensor Cores
        </text>
        <text className="bwd-tc" x="196" y="132">
          SMEM and TMEM in every SM
        </text>

        {/* NV-HBI */}
        <line className="bwd-link" x1="364" y1="118" x2="384" y2="118" />
        <line className="bwd-link" x1="496" y1="118" x2="516" y2="118" />
        <rect className="bwd-hbi" x="384" y="78" width="112" height="80" rx="8" />
        <text className="bwd-gt" x="440" y="104">
          NV-HBI
        </text>
        <text className="bwd-gt" x="440" y="124">
          10 TB/s
        </text>
        <text className="bwd-tc" x="440" y="144">
          die to die
        </text>

        {/* Die B */}
        <rect className="bwd-die" x="516" y="66" width="336" height="104" rx="8" />
        <text className="bwd-dt" x="684" y="92">
          Die B (reticle-limited)
        </text>
        <text className="bwd-tc" x="684" y="114">
          SMs with 5th-gen Tensor Cores
        </text>
        <text className="bwd-tc" x="684" y="132">
          SMEM and TMEM in every SM
        </text>

        {/* Shared L2 */}
        <rect className="bwd-l2" x="28" y="182" width="824" height="30" rx="6" />
        <text className="bwd-bc" x="440" y="202">
          L2 cache shared by both dies, with fully coherent memory access
        </text>

        {/* HBM */}
        <rect className="bwd-hbm" x="28" y="224" width="824" height="48" rx="6" />
        <text className="bwd-bc" x="440" y="244">
          HBM3e: up to 180 GB (B200) or 288 GB in eight 12-high stacks (B300), 8 TB/s per GPU
        </text>
        <text className="bwd-sc" x="440" y="262">
          How the stacks split between the two dies is not published
        </text>

        {/* NVLink, outside the package */}
        <rect className="bwd-nvl" x="28" y="294" width="824" height="28" rx="6" />
        <text className="bwd-bc" x="440" y="313">
          NVLink 5 to other GPUs: 1.8 TB/s per GPU bidirectional (900 GB/s each way)
        </text>

        {/* Inside each SM */}
        <text className="bwd-h" x="28" y="352">
          Inside each SM: one thread issues tcgen05.mma, and the accumulator lives in TMEM
        </text>

        <rect className="bwd-sm" x="28" y="364" width="210" height="72" rx="8" />
        <text className="bwd-hc" x="133" y="388">
          Shared memory (SMEM)
        </text>
        <text className="bwd-tc" x="133" y="406">
          228 KB per SM, as on Hopper
        </text>
        <text className="bwd-sc" x="133" y="424">
          A and B operand tiles
        </text>

        <rect className="bwd-sm" x="335" y="364" width="210" height="72" rx="8" />
        <text className="bwd-hc" x="440" y="388">
          5th-gen Tensor Core
        </text>
        <text className="bwd-tc" x="440" y="406">
          tcgen05.mma
        </text>
        <text className="bwd-sc" x="440" y="424">
          issued by one thread
        </text>

        <rect className="bwd-tm" x="642" y="364" width="210" height="72" rx="8" />
        <text className="bwd-dt" x="747" y="388">
          Tensor Memory (TMEM)
        </text>
        <text className="bwd-tc" x="747" y="406">
          256 KB per SM, new
        </text>
        <text className="bwd-sc" x="747" y="424">
          holds accumulator D
        </text>

        {/* SMEM -> Tensor Core: A and B */}
        <line className="bwd-arr" x1="240" y1="400" x2="332" y2="400" />
        <text className="bwd-el" x="286" y="390">
          A and B
        </text>

        {/* Tensor Core -> TMEM: D */}
        <line className="bwd-arr" x1="547" y1="388" x2="639" y2="388" />
        <text className="bwd-el" x="593" y="378">
          accumulate D
        </text>

        {/* TMEM -> Tensor Core: optional A */}
        <line className="bwd-arr-opt" x1="640" y1="414" x2="548" y2="414" />
        <text className="bwd-el" x="594" y="430">
          A, optional
        </text>
      </svg>
    </div>
  );
}
