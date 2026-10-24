import React from 'react';

// One HBF stack beside an accelerator, after the OCP HBF base-die specification
// v0.7.0, and the split of work between the base die, the host software and the
// SSD. Every figure drawn here is cited in the caption the section renders below.
//
// On a phone the SVG keeps a 640 px minimum width and the wrapper scrolls sideways,
// so 11-unit labels stay above 8 px instead of shrinking to 5 px.

const DIES = Array.from({ length: 16 }, (_, i) => 52 + i * 11);
const BUMPS = Array.from({ length: 14 }, (_, i) => 218 + i * 16);
const XPU_BUMPS = Array.from({ length: 12 }, (_, i) => 650 + i * 16);

export function HbfStackDiagram() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 860 452"
        role="img"
        aria-labelledby="hbf-stack-title"
        style={{ width: '100%', minWidth: 640, height: 'auto', display: 'block' }}
      >
        <title id="hbf-stack-title">
          An HBF stack is sixteen NAND dies joined by through-silicon vias to a base die that
          acts as a flash controller, wired to the accelerator over sixteen UCIe channels on
          the same interposer class as HBM, for 512 GiB and up to 3.072 TB/s per stack. The
          base die handles error correction, scheduling, repair and read counting; the host
          software owns placement, sequential writes and refresh; an SSD still holds the
          persistent copy.
        </title>
        <style>{`
          .hbfs-die { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1; }
          .hbfs-tsv { stroke: #414d5c; stroke-width: 3; }
          .hbfs-base { fill: #0972d3; stroke: #065299; stroke-width: 1.5; }
          .hbfs-ip { fill: #e9ebed; stroke: #879596; stroke-width: 1.5; }
          .hbfs-bump { fill: #879596; }
          .hbfs-xpu { fill: #ffffff; stroke: #414d5c; stroke-width: 2; }
          .hbfs-link { stroke: #037f0c; stroke-width: 2; }
          .hbfs-lead { stroke: #879596; stroke-width: 1; }
          .hbfs-calc { fill: #fafbfc; stroke: #d1d5db; stroke-width: 1.5; }
          .hbfs-a { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .hbfs-b { fill: #fbf3d5; stroke: #8b6c00; stroke-width: 1.5; }
          .hbfs-c { fill: #fafbfc; stroke: #879596; stroke-width: 1.5; }
          .hbfs-h { fill: #16191f; font: 600 13px sans-serif; }
          .hbfs-lb { fill: #0972d3; font: 600 12px sans-serif; text-anchor: end; }
          .hbfs-l { fill: #414d5c; font: 11px sans-serif; text-anchor: end; }
          .hbfs-wt { fill: #ffffff; font: 600 12px sans-serif; text-anchor: middle; }
          .hbfs-tc { fill: #16191f; font: 600 12px sans-serif; text-anchor: middle; }
          .hbfs-sc { fill: #414d5c; font: 11px sans-serif; text-anchor: middle; }
          .hbfs-gc { fill: #037f0c; font: 600 11px sans-serif; text-anchor: middle; }
          .hbfs-bt { fill: #16191f; font: 600 12px sans-serif; }
          .hbfs-bl { fill: #414d5c; font: 11px sans-serif; }
        `}</style>

        <rect x="0" y="0" width="860" height="452" rx="8" fill="#ffffff" stroke="#e9ebed" />

        <text className="hbfs-h" x="20" y="30">
          One 16-high HBF stack on the package, and who does which job
        </text>

        {/* NAND core dies and TSVs */}
        {DIES.map((y) => (
          <rect key={y} className="hbfs-die" x="210" y={y} width="240" height="9" rx="1" />
        ))}
        <line className="hbfs-tsv" x1="260" y1="50" x2="260" y2="232" />
        <line className="hbfs-tsv" x1="330" y1="50" x2="330" y2="232" />
        <line className="hbfs-tsv" x1="400" y1="50" x2="400" y2="232" />

        <text className="hbfs-lb" x="190" y="88">
          16 NAND core dies
        </text>
        <text className="hbfs-l" x="190" y="106">
          512 GiB per 16-high stack
        </text>
        <text className="hbfs-l" x="190" y="122">
          (8-high at grade 1)
        </text>
        <line className="hbfs-lead" x1="194" y1="100" x2="208" y2="100" />

        <text className="hbfs-l" x="190" y="176">
          Through-silicon vias join
        </text>
        <text className="hbfs-l" x="190" y="192">
          every die to the base die
        </text>
        <line className="hbfs-lead" x1="194" y1="184" x2="258" y2="184" />

        {/* Base die */}
        <rect className="hbfs-base" x="210" y="234" width="240" height="34" rx="3" />
        <text className="hbfs-wt" x="330" y="256">
          Base die: flash controller
        </text>

        {/* Accelerator */}
        <rect className="hbfs-xpu" x="640" y="154" width="200" height="114" rx="6" />
        <text className="hbfs-tc" x="740" y="190">
          Accelerator (xPU)
        </text>
        <text className="hbfs-sc" x="740" y="210">
          a GPU or custom chip
        </text>
        <text className="hbfs-sc" x="740" y="228">
          needs UCIe-A x64 ports
        </text>
        <text className="hbfs-sc" x="740" y="244">
          at each HBF site
        </text>

        {/* UCIe channels */}
        {[242, 248, 254, 260].map((y) => (
          <line key={y} className="hbfs-link" x1="452" y1={y} x2="638" y2={y} />
        ))}
        <text className="hbfs-gc" x="545" y="214">
          16 UCIe-A x64 channels
        </text>
        <text className="hbfs-sc" x="545" y="230">
          AXI over UCIe, under 2 mm
        </text>

        {/* Bumps and interposer */}
        {BUMPS.map((x) => (
          <rect key={`b${x}`} className="hbfs-bump" x={x} y="271" width="6" height="6" rx="3" />
        ))}
        {XPU_BUMPS.map((x) => (
          <rect key={`x${x}`} className="hbfs-bump" x={x} y="271" width="6" height="6" rx="3" />
        ))}
        <rect className="hbfs-ip" x="190" y="280" width="650" height="24" rx="3" />
        <text className="hbfs-sc" x="515" y="296">
          Interposer or bridge, as with HBM; HBF uses 45 µm bumps in its UCIe region
        </text>

        {/* Bandwidth arithmetic */}
        <rect className="hbfs-calc" x="470" y="50" width="370" height="90" rx="6" />
        <text className="hbfs-tc" x="655" y="72">
          Grade 3: 3.072 TB/s read per stack
        </text>
        <text className="hbfs-sc" x="655" y="92">
          32 GT/s x 64 bits = 256 GB/s per channel
        </text>
        <text className="hbfs-sc" x="655" y="108">
          x 16 channels = 4.096 TB/s raw
        </text>
        <text className="hbfs-sc" x="655" y="124">
          x 75% AXI link efficiency = 3.072 TB/s
        </text>

        {/* Who does which job */}
        <rect className="hbfs-a" x="20" y="322" width="262" height="118" rx="6" />
        <text className="hbfs-bt" x="34" y="344">
          The base die does
        </text>
        <text className="hbfs-bl" x="34" y="364">
          ECC and NAND command scheduling
        </text>
        <text className="hbfs-bl" x="34" y="380">
          Bad-block and TSV repair
        </text>
        <text className="hbfs-bl" x="34" y="396">
          A read counter for every block
        </text>
        <text className="hbfs-bl" x="34" y="412">
          Wear levelling: base die or host
        </text>
        <text className="hbfs-bl" x="34" y="428">
          Optional SRAM scratchpad
        </text>

        <rect className="hbfs-b" x="299" y="322" width="262" height="118" rx="6" />
        <text className="hbfs-bt" x="313" y="344">
          Your serving software does
        </text>
        <text className="hbfs-bl" x="313" y="364">
          Placement across the 16 channels
        </text>
        <text className="hbfs-bl" x="313" y="380">
          Sequential 4 KiB writes per block
        </text>
        <text className="hbfs-bl" x="313" y="396">
          Refresh every 24 to 48 hours
        </text>
        <text className="hbfs-bl" x="313" y="412">
          Refresh a block after X reads
        </text>

        <rect className="hbfs-c" x="578" y="322" width="262" height="118" rx="6" />
        <text className="hbfs-bt" x="592" y="344">
          The SSD still does
        </text>
        <text className="hbfs-bl" x="592" y="364">
          Holds the persistent copy
        </text>
        <text className="hbfs-bl" x="592" y="380">
          Refills every stack after power loss
        </text>
        <text className="hbfs-bl" x="592" y="396">
          (HBF retention is guaranteed
        </text>
        <text className="hbfs-bl" x="592" y="412">
          only 24 h at 85 C, powered)
        </text>
      </svg>
    </div>
  );
}
