import React from 'react';

// Side by side: where a Groq 3 LPU and a SambaNova SN40L socket keep the working set.
// Every figure drawn here is cited in the caption the section renders below the SVG:
// LPU functional units, SRAM, DRAM and the Vera Rubin split from NVIDIA's LPX blog;
// SN40L tiers, the DDR-to-HBM load rate and Samba-CoE from the SN40L paper.
// Schematic, not to scale.
//
// Wide: on a phone the SVG keeps a 640 px minimum width and the wrapper scrolls
// sideways, so labels keep their size instead of shrinking.

const W = 880;
const H = 408;

const LPU_UNITS = [
  { name: 'MXM', l1: 'matrix', l2: 'multiply' },
  { name: 'VXM', l1: 'vector', l2: 'pointwise' },
  { name: 'SXM', l1: 'switch', l2: 'moves data' },
  { name: 'MEM', l1: '500 MB SRAM', l2: '150 TB/s' },
];

const SN_TIERS = [
  { tier: 'On-chip SRAM', cap: '520 MiB', bw: 'hundreds of TB/s', cls: 'dfs-t1' },
  { tier: 'HBM', cap: '64 GiB', bw: '1.8-2 TB/s', cls: 'dfs-t2' },
  { tier: 'DDR', cap: 'up to 1.5 TiB', bw: 'over 200 GB/s', cls: 'dfs-t3' },
];

export function DataflowSiliconDiagram() {
  const lx = 20;
  const rx = 450;
  const pw = 410;
  const unitW = 82;
  const unitGap = 12;
  const unitX0 = lx + 16 + (378 - (4 * unitW + 3 * unitGap)) / 2;

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-labelledby="dataflow-silicon-title"
        style={{ width: '100%', minWidth: 640, height: 'auto', display: 'block' }}
      >
        <title id="dataflow-silicon-title">
          Two dataflow chips keep the working set in different places. A Groq 3 LPU holds it
          in 500 MB of on-chip SRAM at 150 TB/s, with up to 512 GB of DRAM per 16-LPU tray
          behind the fabric, and on the Vera Rubin platform it runs decode&apos;s FFN and MoE expert
          layers while Rubin GPUs keep attention over the KV cache. A SambaNova SN40L socket
          spreads it across three tiers, 520 MiB of SRAM at hundreds of TB/s, 64 GiB of HBM at
          1.8 to 2 TB/s and up to 1.5 TiB of DDR at over 200 GB/s, and loads whole expert
          models from DDR into HBM as requests need them.
        </title>
        <style>{`
          .dfs-bg    { fill: #ffffff; stroke: #e9ebed; stroke-width: 1; }
          .dfs-head  { fill: #16191f; font: 600 13px sans-serif; }
          .dfs-gp    { fill: #f2f8fd; stroke: #0972d3; stroke-width: 2; }
          .dfs-sp    { fill: #ecf7ec; stroke: #037f0c; stroke-width: 2; }
          .dfs-gt    { fill: #0972d3; font: 600 13px sans-serif; }
          .dfs-st    { fill: #037f0c; font: 600 13px sans-serif; }
          .dfs-sub   { fill: #5f6b7a; font: 11px sans-serif; }
          .dfs-chip  { fill: #e1f0fb; stroke: #0972d3; stroke-width: 1.5; }
          .dfs-chipt { fill: #065299; font: 600 12px sans-serif; text-anchor: middle; }
          .dfs-unit  { fill: #ffffff; stroke: #0972d3; stroke-width: 1; }
          .dfs-un    { fill: #0972d3; font: 600 13px sans-serif; text-anchor: middle; }
          .dfs-ul    { fill: #16191f; font: 11px sans-serif; text-anchor: middle; }
          .dfs-dram  { fill: #fbf3d5; stroke: #8b6c00; stroke-width: 1.5; stroke-dasharray: 5 3; }
          .dfs-dt    { fill: #8b6c00; font: 600 12px sans-serif; }
          .dfs-arr   { stroke: #5f6b7a; stroke-width: 1.5; fill: none; marker-end: url(#dfs-ah); marker-start: url(#dfs-ah); }
          .dfs-colh  { fill: #5f6b7a; font: 600 10px sans-serif; }
          .dfs-t1    { fill: #ffffff; stroke: #037f0c; stroke-width: 1.5; }
          .dfs-t2    { fill: #f4faf4; stroke: #037f0c; stroke-width: 1.5; }
          .dfs-t3    { fill: #fdf3ec; stroke: #037f0c; stroke-width: 1.5; }
          .dfs-tn    { fill: #037f0c; font: 600 11px sans-serif; }
          .dfs-tv    { fill: #16191f; font: 11px sans-serif; }
          .dfs-tb    { fill: #414d5c; font: 11px sans-serif; }
          .dfs-h12   { fill: #16191f; font: 600 12px sans-serif; }
          .dfs-body  { fill: #16191f; font: 11px sans-serif; }
          .dfs-betg  { fill: #0972d3; font: italic 11px sans-serif; }
          .dfs-bets  { fill: #037f0c; font: italic 11px sans-serif; }
        `}</style>
        <defs>
          <marker
            id="dfs-ah"
            viewBox="0 0 10 10"
            refX={9}
            refY={5}
            markerWidth={6}
            markerHeight={6}
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="#5f6b7a" />
          </marker>
        </defs>

        <rect className="dfs-bg" x={0} y={0} width={W} height={H} rx={8} />
        <text className="dfs-head" x={20} y={30}>
          Two dataflow chips, two places to keep the working set
        </text>

        {/* Groq 3 LPU panel */}
        <rect className="dfs-gp" x={lx} y={48} width={pw} height={344} rx={8} />
        <text className="dfs-gt" x={lx + 16} y={74}>
          Groq 3 LPU, in an NVIDIA Groq 3 LPX tray
        </text>
        <text className="dfs-sub" x={lx + 16} y={92}>
          Compiler-scheduled dataflow; SRAM first, DRAM behind it
        </text>

        <rect className="dfs-chip" x={lx + 16} y={106} width={378} height={114} rx={6} />
        <text className="dfs-chipt" x={lx + 16 + 189} y={124}>
          One LPU
        </text>
        {LPU_UNITS.map((u, i) => {
          const x = unitX0 + i * (unitW + unitGap);
          return (
            <g key={u.name}>
              <rect className="dfs-unit" x={x} y={134} width={unitW} height={76} rx={4} />
              <text className="dfs-un" x={x + unitW / 2} y={156}>
                {u.name}
              </text>
              <text className="dfs-ul" x={x + unitW / 2} y={175}>
                {u.l1}
              </text>
              <text className="dfs-ul" x={x + unitW / 2} y={192}>
                {u.l2}
              </text>
            </g>
          );
        })}

        <line className="dfs-arr" x1={lx + 205} y1={223} x2={lx + 205} y2={253} />
        <rect className="dfs-dram" x={lx + 16} y={256} width={378} height={46} rx={6} />
        <text className="dfs-dt" x={lx + 30} y={275}>
          DRAM behind the fabric
        </text>
        <text className="dfs-body" x={lx + 30} y={292}>
          up to 512 GB per 16-LPU tray
        </text>

        <text className="dfs-h12" x={lx + 16} y={324}>
          On the Vera Rubin platform
        </text>
        <text className="dfs-body" x={lx + 16} y={341}>
          LPUs run decode&apos;s FFN and MoE expert layers;
        </text>
        <text className="dfs-body" x={lx + 16} y={357}>
          Rubin GPUs keep attention over the KV cache.
        </text>
        <text className="dfs-betg" x={lx + 16} y={380}>
          Bet: a compiled schedule, the working set in SRAM.
        </text>

        {/* SambaNova SN40L panel */}
        <rect className="dfs-sp" x={rx} y={48} width={pw} height={344} rx={8} />
        <text className="dfs-st" x={rx + 16} y={74}>
          SambaNova SN40L, per socket
        </text>
        <text className="dfs-sub" x={rx + 16} y={92}>
          Reconfigurable dataflow; three memory tiers
        </text>

        <text className="dfs-colh" x={rx + 28} y={116}>
          TIER
        </text>
        <text className="dfs-colh" x={rx + 150} y={116}>
          CAPACITY
        </text>
        <text className="dfs-colh" x={rx + 252} y={116}>
          BANDWIDTH
        </text>
        {SN_TIERS.map((t, i) => {
          const y = 124 + i * 46;
          return (
            <g key={t.tier}>
              <rect className={t.cls} x={rx + 16} y={y} width={378} height={38} rx={4} />
              <text className="dfs-tn" x={rx + 28} y={y + 24}>
                {t.tier}
              </text>
              <text className="dfs-tv" x={rx + 150} y={y + 24}>
                {t.cap}
              </text>
              <text className="dfs-tb" x={rx + 252} y={y + 24}>
                {t.bw}
              </text>
            </g>
          );
        })}
        <text className="dfs-body" x={rx + 16} y={290}>
          Models load from DDR into HBM at over 1 TB/s per node.
        </text>

        <text className="dfs-h12" x={rx + 16} y={324}>
          Samba-CoE
        </text>
        <text className="dfs-body" x={rx + 16} y={341}>
          150 expert models, a trillion parameters in total;
        </text>
        <text className="dfs-body" x={rx + 16} y={357}>
          each request is routed to one whole model.
        </text>
        <text className="dfs-bets" x={rx + 16} y={380}>
          Bet: tier the memory, switch whole models.
        </text>
      </svg>
    </div>
  );
}
