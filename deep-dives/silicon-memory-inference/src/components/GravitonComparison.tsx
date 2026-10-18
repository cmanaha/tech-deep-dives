import React from 'react';

// Graviton4 against Graviton5 as AWS's processor table describes them: Graviton4 is one
// NUMA node (96 cores, one 36 MB LLC); Graviton5 is one package that shows up as two NUMA
// nodes, each with 96 cores and its own 96 MB LLC. DRAM is drawn per package because the
// table gives the channel count per package, not per node. Every figure drawn here is
// cited in the caption the section renders below the SVG.
//
// On a phone the SVG keeps a 640 px minimum width and the wrapper scrolls sideways.

const G5_NODES = [
  { x: 376, label: 'NUMA node 0' },
  { x: 612, label: 'NUMA node 1' },
];

export function GravitonComparison() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 860 372"
        role="img"
        aria-labelledby="graviton-compare-title"
        style={{ width: '100%', minWidth: 640, height: 'auto', display: 'block' }}
      >
        <title id="graviton-compare-title">
          Graviton4 is one NUMA node: 96 cores share one 36 MB last-level cache and 12 channels
          of DDR5-5600, 537.6 GB/s or 5.6 GB/s per core. Graviton5 puts 192 cores in one
          package that runs as two NUMA nodes, each with 96 cores and its own 96 MB last-level
          cache, on 12 channels of DDR5-8800: 844.8 GB/s, or 4.4 GB/s per core, 21% less per
          core than Graviton4. The 16xlarge and 48xlarge sizes span both nodes.
        </title>
        <style>{`
          .grv-bg { fill: #ffffff; stroke: #e9ebed; }
          .grv-p4 { fill: #f2f8fd; stroke: #0972d3; stroke-width: 2; }
          .grv-p5 { fill: #ecf7ec; stroke: #037f0c; stroke-width: 2; }
          .grv-node { fill: #ffffff; stroke: #879596; stroke-width: 1.5; stroke-dasharray: 5 4; }
          .grv-llc { fill: #e6f4f2; stroke: #1f7a70; stroke-width: 1.5; }
          .grv-dram { fill: #e9ebed; stroke: #414d5c; stroke-width: 1.5; }
          .grv-h { fill: #16191f; font: 600 13px sans-serif; }
          .grv-h4 { fill: #0972d3; font: 600 13px sans-serif; }
          .grv-h5 { fill: #037f0c; font: 600 13px sans-serif; }
          .grv-sub { fill: #5f6b7a; font: 11px sans-serif; }
          .grv-nl { fill: #414d5c; font: 600 11px sans-serif; text-anchor: middle; }
          .grv-t { fill: #16191f; font: 12px sans-serif; text-anchor: middle; }
          .grv-tb { fill: #16191f; font: 600 12px sans-serif; text-anchor: middle; }
          .grv-s { fill: #414d5c; font: 11px sans-serif; text-anchor: middle; }
          .grv-foot { fill: #414d5c; font: 11px sans-serif; }
        `}</style>

        <rect className="grv-bg" x="0" y="0" width="860" height="372" rx="8" />
        <text className="grv-h" x="20" y="28">
          Twice the cores, split into two NUMA domains that each have their own LLC
        </text>

        {/* Graviton4 */}
        <rect className="grv-p4" x="20" y="44" width="300" height="308" rx="8" />
        <text className="grv-h4" x="36" y="68">
          Graviton4 (Neoverse V2)
        </text>
        <text className="grv-sub" x="36" y="86">
          Armv9.0-A, 2.8 GHz (2.7 GHz on 48xlarge)
        </text>
        <rect className="grv-node" x="36" y="100" width="268" height="124" rx="6" />
        <text className="grv-nl" x="170" y="118">
          One NUMA node
        </text>
        <text className="grv-t" x="170" y="140">
          96 cores, 2 MB L2 each
        </text>
        <rect className="grv-llc" x="56" y="154" width="228" height="54" rx="4" />
        <text className="grv-tb" x="170" y="177">
          36 MB LLC, shared
        </text>
        <text className="grv-s" x="170" y="196">
          375 KB per core
        </text>
        <rect className="grv-dram" x="36" y="240" width="268" height="54" rx="4" />
        <text className="grv-tb" x="170" y="263">
          12 x DDR5-5600
        </text>
        <text className="grv-s" x="170" y="282">
          537.6 GB/s, 5.6 GB/s per core
        </text>
        <text className="grv-foot" x="36" y="318">
          Only the two-socket 48xlarge
        </text>
        <text className="grv-foot" x="36" y="334">
          has a second NUMA node.
        </text>

        {/* Graviton5 */}
        <rect className="grv-p5" x="360" y="44" width="480" height="308" rx="8" />
        <text className="grv-h5" x="376" y="68">
          Graviton5 (Neoverse V3): 192 cores in one package
        </text>
        <text className="grv-sub" x="376" y="86">
          Armv9.2-A, 3.3 GHz, no turbo
        </text>
        {G5_NODES.map((n) => (
          <g key={n.label}>
            <rect className="grv-node" x={n.x} y="100" width="212" height="124" rx="6" />
            <text className="grv-nl" x={n.x + 106} y="118">
              {n.label}
            </text>
            <text className="grv-t" x={n.x + 106} y="140">
              96 cores, 2 MB L2 each
            </text>
            <rect className="grv-llc" x={n.x + 16} y="154" width="180" height="54" rx="4" />
            <text className="grv-tb" x={n.x + 106} y="177">
              96 MB LLC
            </text>
            <text className="grv-s" x={n.x + 106} y="196">
              1 MB per core
            </text>
          </g>
        ))}
        <rect className="grv-dram" x="376" y="240" width="448" height="54" rx="4" />
        <text className="grv-tb" x="600" y="263">
          12 x DDR5-8800 per package
        </text>
        <text className="grv-s" x="600" y="282">
          844.8 GB/s, 4.4 GB/s per core (21% less per core than Graviton4)
        </text>
        <text className="grv-foot" x="376" y="318">
          16xlarge and 48xlarge span both nodes.
        </text>
        <text className="grv-foot" x="376" y="334">
          24xlarge is one node: 96 cores and 96 MB of LLC.
        </text>
      </svg>
    </div>
  );
}
