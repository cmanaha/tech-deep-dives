import React from 'react';

// One Hopper SM and the memory outside it. Shows where wgmma reads its operands and
// keeps its accumulator, and how far each memory level sits in cycles. Every figure
// drawn here is cited in the caption the section renders below the SVG; the cycle
// counts are a Tier 3 microbenchmark (Luo et al., H800 PCIe) and are labelled so.
//
// On a phone the SVG keeps a 640 px minimum width and the wrapper scrolls sideways,
// so 11-unit labels render near 8 px instead of shrinking to 4 px.

export function HopperSmDiagram() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 880 412"
        role="img"
        aria-labelledby="hopper-sm-title"
        style={{ width: '100%', minWidth: 640, height: 'auto', display: 'block' }}
      >
        <title id="hopper-sm-title">
          On Hopper, the Tensor Memory Accelerator copies tiles from HBM through the L2 cache
          into each SM&apos;s shared memory, and wgmma reads operand B from shared memory,
          operand A from shared memory or registers, and keeps the accumulator D in registers.
          Each level outward costs more latency: about 29 cycles for shared memory, 263 for L2
          and 479 for a global load in a third-party microbenchmark.
        </title>
        <style>{`
          .hsm-sm { fill: #f2f8fd; stroke: #0972d3; stroke-width: 2; }
          .hsm-box { fill: #ffffff; stroke: #879596; stroke-width: 1.5; }
          .hsm-tc { fill: #fdf3ec; stroke: #ec7211; stroke-width: 1.5; }
          .hsm-smem { fill: #ecf7ec; stroke: #037f0c; stroke-width: 1.5; }
          .hsm-tma { fill: #e6f4f2; stroke: #1f7a70; stroke-width: 1.5; }
          .hsm-dev { fill: #fafbfc; stroke: #414d5c; stroke-width: 1.5; stroke-dasharray: 6 4; }
          .hsm-mem { fill: #fbf3d5; stroke: #8b6c00; stroke-width: 1.5; }
          .hsm-arr { stroke: #5f6b7a; stroke-width: 1.5; fill: none; marker-end: url(#hsm-ah); }
          .hsm-arr2 { stroke: #5f6b7a; stroke-width: 1.5; fill: none; marker-start: url(#hsm-ah); marker-end: url(#hsm-ah); }
          .hsm-h { fill: #16191f; font: 600 13px sans-serif; }
          .hsm-s { fill: #414d5c; font: 11px sans-serif; }
          .hsm-t { fill: #16191f; font: 600 13px sans-serif; }
          .hsm-b { fill: #16191f; font: 11px sans-serif; }
          .hsm-lat { fill: #8b6c00; font: 600 11px sans-serif; }
          .hsm-el { fill: #414d5c; font: 600 11px sans-serif; }
        `}</style>
        <defs>
          <marker
            id="hsm-ah"
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

        <rect x="0" y="0" width="880" height="412" rx="8" fill="#ffffff" stroke="#e9ebed" />

        {/* The SM */}
        <rect className="hsm-sm" x="12" y="12" width="584" height="388" rx="10" />
        <text className="hsm-h" x="28" y="36">
          One Hopper SM: compute capability 9.0, H100 and H200 alike
        </text>
        <text className="hsm-s" x="28" y="54">
          Up to 64 resident warps of 32 threads, up to 32 thread blocks
        </text>

        {/* Row A: warp schedulers, register file */}
        <rect className="hsm-box" x="28" y="70" width="264" height="80" rx="6" />
        <text className="hsm-t" x="40" y="92">
          Warp schedulers
        </text>
        <text className="hsm-b" x="40" y="112">
          Run other warps while
        </text>
        <text className="hsm-b" x="40" y="130">
          one waits on memory
        </text>

        <rect className="hsm-box" x="316" y="70" width="264" height="80" rx="6" />
        <text className="hsm-t" x="328" y="92">
          Register file: 64K x 32-bit
        </text>
        <text className="hsm-b" x="328" y="112">
          Up to 255 registers per thread
        </text>
        <text className="hsm-b" x="328" y="130">
          Holds the wgmma accumulator D
        </text>

        {/* Register file to and from the Tensor Cores */}
        <line className="hsm-arr" x1="400" y1="150" x2="400" y2="182" />
        <text className="hsm-el" x="410" y="170">
          A
        </text>
        <line className="hsm-arr2" x1="500" y1="150" x2="500" y2="182" />
        <text className="hsm-el" x="510" y="170">
          D
        </text>

        {/* Row B: Tensor Cores */}
        <rect className="hsm-tc" x="28" y="182" width="552" height="80" rx="6" />
        <text className="hsm-t" x="40" y="204">
          4th-generation Tensor Cores, driven by wgmma (sm_90a only)
        </text>
        <text className="hsm-b" x="40" y="224">
          Operand B from shared memory; A from shared memory or registers
        </text>
        <text className="hsm-b" x="40" y="242">
          H100 SXM: 3,958 TFLOPS FP8 sparse, about 1,979 dense (whole GPU)
        </text>

        {/* Shared memory to the Tensor Cores */}
        <line className="hsm-arr" x1="160" y1="294" x2="160" y2="262" />
        <text className="hsm-el" x="170" y="284">
          A, B
        </text>

        {/* Row C: shared memory + L1, TMA */}
        <rect className="hsm-smem" x="28" y="294" width="264" height="92" rx="6" />
        <text className="hsm-t" x="40" y="316">
          Shared memory (SMEM) + L1
        </text>
        <text className="hsm-b" x="40" y="336">
          SMEM up to 228 KB per SM
        </text>
        <text className="hsm-b" x="40" y="354">
          inside 256 KB of L1 + SMEM
        </text>
        <text className="hsm-lat" x="40" y="372">
          SMEM ~29, L1 ~41 cycles (Tier 3)
        </text>

        <rect className="hsm-tma" x="316" y="294" width="264" height="92" rx="6" />
        <text className="hsm-t" x="328" y="316">
          Tensor Memory Accelerator
        </text>
        <text className="hsm-b" x="328" y="336">
          Bulk-copies 1D to 5D tensors
        </text>
        <text className="hsm-b" x="328" y="354">
          between global memory and SMEM,
        </text>
        <text className="hsm-b" x="328" y="372">
          in both directions
        </text>

        {/* TMA into SMEM */}
        <line className="hsm-arr" x1="316" y1="340" x2="292" y2="340" />

        {/* Device-wide memory */}
        <text className="hsm-h" x="620" y="36">
          Device-wide, outside the SM
        </text>
        <text className="hsm-s" x="620" y="54">
          Shared by all 132 SMs on H100
        </text>

        <rect className="hsm-mem" x="620" y="70" width="248" height="136" rx="6" />
        <text className="hsm-t" x="632" y="92">
          HBM, per GPU
        </text>
        <text className="hsm-b" x="632" y="112">
          H100: 80 GB HBM3 at 3.35 TB/s
        </text>
        <text className="hsm-b" x="632" y="130">
          H200: 141 GB HBM3e at 4.8 TB/s
        </text>
        <text className="hsm-b" x="632" y="148">
          H200 over H100:
        </text>
        <text className="hsm-b" x="632" y="166">
          1.43x bandwidth, 1.76x capacity
        </text>
        <text className="hsm-lat" x="632" y="190">
          ~479 cycles (Tier 3)
        </text>

        <line className="hsm-arr" x1="744" y1="206" x2="744" y2="294" />

        <rect className="hsm-dev" x="620" y="294" width="248" height="92" rx="6" />
        <text className="hsm-t" x="632" y="316">
          L2 cache
        </text>
        <text className="hsm-b" x="632" y="336">
          50 MB on H100
        </text>
        <text className="hsm-b" x="632" y="354">
          H200 size not on its product page
        </text>
        <text className="hsm-lat" x="632" y="372">
          ~263 cycles (Tier 3)
        </text>

        {/* L2 into the TMA */}
        <line className="hsm-arr" x1="620" y1="340" x2="580" y2="340" />
      </svg>
    </div>
  );
}
