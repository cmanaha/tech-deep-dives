// ChipletPathDiagram: the path one load takes on AMD EPYC Turin, from a Zen 5 core to
// DRAM. The bands across the top name who shares each stage: the core's private caches,
// the L3 and GMI link its CCD shares, and the IO die and memory every CCD in the socket
// shares. Every figure is cited in the caption the section renders below the diagram.

export function ChipletPathDiagram() {
  return (
    <div style={{ overflowX: "auto" }}>
      <svg
        viewBox="0 0 900 280"
        role="img"
        aria-labelledby="chiplet-path-title"
        style={{
          width: "100%",
          minWidth: 640,
          height: "auto",
          display: "block",
        }}
      >
        <title id="chiplet-path-title">
          A load on AMD EPYC Turin that misses a Zen 5 core&apos;s private 48 KB
          L1 data cache and 1 MB L2 reaches the 32 MB L3 its CCD shares, then
          leaves the compute die over the CCD&apos;s GMI link into the IO die,
          whose 12 DDR5 memory controllers every CCD in the socket shares. Each
          hop widens the set of cores the access competes with. Core to core
          takes about 45 ns inside one CCD and about 150 ns across CCDs, and a
          load reaches DRAM in about 130 ns in NPS1.
        </title>
        <style>{`
          .cpd-band { fill: #414d5c; font: 600 12px sans-serif; text-anchor: middle; }
          .cpd-brk { stroke: #879596; stroke-width: 1.2; fill: none; }
          .cpd-grp { fill: none; stroke: #0972d3; stroke-width: 1.5; stroke-dasharray: 6 4; }
          .cpd-grp-t { fill: #065299; font: 600 12px sans-serif; }
          .cpd-core { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .cpd-l3 { fill: #ecf7ec; stroke: #037f0c; stroke-width: 1.5; }
          .cpd-iod { fill: #fdf3ec; stroke: #ec7211; stroke-width: 1.5; }
          .cpd-mem { fill: #f2f3f3; stroke: #414d5c; stroke-width: 1.5; }
          .cpd-other { fill: #f4f4f4; stroke: #879596; stroke-width: 1.5; }
          .cpd-leg { fill: #fafafa; stroke: #d1d5db; stroke-width: 1; }
          .cpd-t { fill: #16191f; font: 600 14px sans-serif; text-anchor: middle; }
          .cpd-s { fill: #5f6b7a; font: 12px sans-serif; text-anchor: middle; }
          .cpd-lt { fill: #414d5c; font: 600 12px sans-serif; }
          .cpd-l { fill: #16191f; font: 12px sans-serif; }
          .cpd-v { fill: #16191f; font: 600 12px sans-serif; text-anchor: end; }
          .cpd-edge { fill: #8b6c00; font: 600 12px sans-serif; text-anchor: middle; }
          .cpd-edge-s { fill: #5f6b7a; font: 12px sans-serif; text-anchor: middle; }
          .cpd-arr { stroke: #5f6b7a; stroke-width: 1.5; fill: none; marker-end: url(#cpd-ah); }
          .cpd-gmi { stroke: #ec7211; stroke-width: 2.5; fill: none; marker-end: url(#cpd-ah-gmi); }
        `}</style>
        <defs>
          <marker
            id="cpd-ah"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="#5f6b7a" />
          </marker>
          <marker
            id="cpd-ah-gmi"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="#ec7211" />
          </marker>
        </defs>

        <rect x="0" y="0" width="900" height="280" rx="8" fill="#ffffff" />

        {/* Who shares each stage */}
        <text className="cpd-band" x="154" y="20">
          Private to one core
        </text>
        <path className="cpd-brk" d="M28,34 V28 H280 V34" />
        <text className="cpd-band" x="428" y="20">
          Shared by the CCD&apos;s cores
        </text>
        <path className="cpd-brk" d="M300,34 V28 H556 V34" />
        <text className="cpd-band" x="727" y="20">
          Shared by every CCD in the socket
        </text>
        <path className="cpd-brk" d="M570,34 V28 H884 V34" />

        {/* CCD 1: one compute die */}
        <rect
          className="cpd-grp"
          x="16"
          y="42"
          width="436"
          height="124"
          rx="10"
        />
        <text className="cpd-grp-t" x="28" y="60">
          CCD 1: up to 8 Zen 5 cores
        </text>

        <rect
          className="cpd-core"
          x="28"
          y="72"
          width="122"
          height="80"
          rx="6"
        />
        <text className="cpd-t" x="89" y="100">
          Zen 5 core
        </text>
        <text className="cpd-s" x="89" y="121">
          L1 data 48 KB
        </text>
        <text className="cpd-s" x="89" y="138">
          4 cycles
        </text>

        <rect
          className="cpd-core"
          x="172"
          y="72"
          width="108"
          height="80"
          rx="6"
        />
        <text className="cpd-t" x="226" y="106">
          L2
        </text>
        <text className="cpd-s" x="226" y="127">
          1 MB per core
        </text>

        <rect
          className="cpd-l3"
          x="300"
          y="72"
          width="138"
          height="80"
          rx="6"
        />
        <text className="cpd-t" x="369" y="100">
          L3
        </text>
        <text className="cpd-s" x="369" y="121">
          32 MB, shared by
        </text>
        <text className="cpd-s" x="369" y="138">
          the CCD&apos;s cores
        </text>

        <line className="cpd-arr" x1="150" y1="112" x2="170" y2="112" />
        <line className="cpd-arr" x1="280" y1="112" x2="298" y2="112" />

        {/* The die boundary: the CCD's GMI link into the IO die */}
        <line className="cpd-gmi" x1="438" y1="112" x2="566" y2="112" />
        <text className="cpd-edge" x="506" y="100">
          GMI link
        </text>
        <text className="cpd-edge-s" x="506" y="132">
          1 or 2 per CCD
        </text>

        {/* Every other CCD reaches the same IO die */}
        <rect
          className="cpd-other"
          x="300"
          y="196"
          width="138"
          height="56"
          rx="6"
        />
        <text className="cpd-t" x="369" y="220">
          CCD 2 to CCD 16
        </text>
        <text className="cpd-s" x="369" y="240">
          same layout
        </text>
        <line className="cpd-gmi" x1="438" y1="224" x2="566" y2="224" />
        <text className="cpd-edge-s" x="506" y="214">
          their GMI links
        </text>

        <rect
          className="cpd-iod"
          x="570"
          y="72"
          width="160"
          height="190"
          rx="6"
        />
        <text className="cpd-t" x="650" y="142">
          IO die
        </text>
        <text className="cpd-s" x="650" y="164">
          12 DDR5 memory
        </text>
        <text className="cpd-s" x="650" y="181">
          controllers, one
        </text>
        <text className="cpd-s" x="650" y="198">
          per channel
        </text>

        <line className="cpd-arr" x1="730" y1="167" x2="754" y2="167" />

        <rect
          className="cpd-mem"
          x="756"
          y="112"
          width="128"
          height="110"
          rx="6"
        />
        <text className="cpd-t" x="820" y="140">
          DDR5
        </text>
        <text className="cpd-s" x="820" y="161">
          12 channels
        </text>
        <text className="cpd-s" x="820" y="178">
          51.2 GB/s each
        </text>
        <text className="cpd-s" x="820" y="195">
          at DDR5-6400
        </text>

        {/* Latency legend */}
        <rect
          className="cpd-leg"
          x="16"
          y="180"
          width="268"
          height="82"
          rx="6"
        />
        <text className="cpd-lt" x="28" y="198">
          Approximate latency, EPYC Turin
        </text>
        <text className="cpd-l" x="28" y="218">
          Core to core, same CCD
        </text>
        <text className="cpd-v" x="272" y="218">
          45 ns
        </text>
        <text className="cpd-l" x="28" y="236">
          Core to core, across CCDs
        </text>
        <text className="cpd-v" x="272" y="236">
          150 ns
        </text>
        <text className="cpd-l" x="28" y="254">
          Load to DRAM, NPS1
        </text>
        <text className="cpd-v" x="272" y="254">
          130 ns
        </text>
      </svg>
    </div>
  );
}
