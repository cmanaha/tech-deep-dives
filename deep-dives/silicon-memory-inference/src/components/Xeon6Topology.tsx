import React from 'react';

// Schematic of Intel Xeon 6 6900P Granite Rapids: 3 compute tiles on Intel 3 + 2 IO dies on Intel 7,
// joined by EMIB. SNC3 mode renders three NUMA domains, each with 4 DDR5 channels.

export function Xeon6Topology() {
  const width = 880;
  const height = 420;
  const tileW = 220;
  const tileH = 220;
  const ioW = 100;
  const ioH = 220;
  const startX = 30;
  const tileY = 70;

  const tiles = [0, 1, 2].map((i) => ({
    x: startX + i * (tileW + 20),
    label: `Compute tile ${i + 1}`,
    nodeId: i,
  }));

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Intel Xeon 6 Granite Rapids 6900P: three compute tiles on Intel 3 and two IO dies on Intel 7 joined by EMIB; SNC3 mode partitions into three NUMA domains"
        style={{ border: '1px solid #e9ebed', borderRadius: '8px', background: '#ffffff' }}
      >
        <text x={20} y={24} fontSize={13} fontWeight={700} fill="#16191f">
          Intel Xeon 6 6900P — three compute tiles + two I/O dies, joined by EMIB
        </text>
        <text x={20} y={42} fontSize={11} fill="#687078">
          Default mode is SNC3 — each tile is a NUMA domain with 4 DDR5 channels
        </text>

        {/* Compute tiles */}
        {tiles.map((t) => (
          <g key={t.nodeId}>
            <rect
              x={t.x}
              y={tileY}
              width={tileW}
              height={tileH}
              rx={8}
              fill="#f2f8fd"
              stroke="#0972d3"
              strokeWidth={2}
            />
            <text x={t.x + tileW / 2} y={tileY + 26} fontSize={13} fontWeight={700} fill="#0972d3" textAnchor="middle">
              {t.label}
            </text>
            <text x={t.x + tileW / 2} y={tileY + 46} fontSize={11} fill="#687078" textAnchor="middle">
              Intel 3, ~43 Redwood Cove cores
            </text>
            <text x={t.x + 14} y={tileY + 80} fontSize={11} fontWeight={600} fill="#16191f">
              Per-core
            </text>
            <text x={t.x + 14} y={tileY + 96} fontSize={11} fill="#16191f">
              L1: 64+48 KB · L2: 2 MB
            </text>
            <text x={t.x + 14} y={tileY + 124} fontSize={11} fontWeight={600} fill="#16191f">
              Tile L3
            </text>
            <text x={t.x + 14} y={tileY + 140} fontSize={11} fill="#16191f">
              ~160 MB · 40 CHA slices · 2.5 GHz
            </text>
            <text x={t.x + 14} y={tileY + 168} fontSize={11} fontWeight={600} fill="#16191f">
              Tile DDR5
            </text>
            <text x={t.x + 14} y={tileY + 184} fontSize={11} fill="#16191f">
              4 channels · DDR5-6400 / MRDIMM-8800
            </text>
            <text x={t.x + 14} y={tileY + 206} fontSize={10} fontStyle="italic" fill="#0972d3">
              NUMA domain
            </text>
          </g>
        ))}

        {/* I/O dies (left + right edges) */}
        <rect
          x={5}
          y={tileY}
          width={ioW}
          height={ioH}
          rx={8}
          fill="#fdf3ec"
          stroke="#ec7211"
          strokeWidth={2}
        />
        <text x={5 + ioW / 2} y={tileY + 24} fontSize={11} fontWeight={700} fill="#ec7211" textAnchor="middle">
          IO die A
        </text>
        <text x={5 + ioW / 2} y={tileY + 44} fontSize={10} fill="#687078" textAnchor="middle">
          Intel 7
        </text>
        <text x={5 + ioW / 2} y={tileY + 76} fontSize={10} fill="#16191f" textAnchor="middle">
          PCIe 5
        </text>
        <text x={5 + ioW / 2} y={tileY + 92} fontSize={10} fill="#16191f" textAnchor="middle">
          UPI
        </text>
        <text x={5 + ioW / 2} y={tileY + 108} fontSize={10} fill="#16191f" textAnchor="middle">
          CXL 2.0
        </text>
        <text x={5 + ioW / 2} y={tileY + 130} fontSize={10} fill="#16191f" textAnchor="middle">
          DSA / IAA
        </text>
        <text x={5 + ioW / 2} y={tileY + 146} fontSize={10} fill="#16191f" textAnchor="middle">
          QAT / DLB
        </text>

        <rect
          x={width - ioW - 5}
          y={tileY}
          width={ioW}
          height={ioH}
          rx={8}
          fill="#fdf3ec"
          stroke="#ec7211"
          strokeWidth={2}
        />
        <text x={width - ioW / 2 - 5} y={tileY + 24} fontSize={11} fontWeight={700} fill="#ec7211" textAnchor="middle">
          IO die B
        </text>
        <text x={width - ioW / 2 - 5} y={tileY + 44} fontSize={10} fill="#687078" textAnchor="middle">
          Intel 7
        </text>
        <text x={width - ioW / 2 - 5} y={tileY + 76} fontSize={10} fill="#16191f" textAnchor="middle">
          PCIe 5
        </text>
        <text x={width - ioW / 2 - 5} y={tileY + 92} fontSize={10} fill="#16191f" textAnchor="middle">
          UPI
        </text>
        <text x={width - ioW / 2 - 5} y={tileY + 108} fontSize={10} fill="#16191f" textAnchor="middle">
          CXL 2.0
        </text>

        {/* EMIB labels */}
        <text x={(5 + ioW + tiles[0].x) / 2} y={tileY + tileH / 2} fontSize={10} fontWeight={700} fill="#037f0c" textAnchor="middle">
          EMIB
        </text>
        <text x={(tiles[2].x + tileW + (width - ioW - 5)) / 2} y={tileY + tileH / 2} fontSize={10} fontWeight={700} fill="#037f0c" textAnchor="middle">
          EMIB
        </text>

        <text x={20} y={height - 14} fontSize={11} fill="#687078">
          504 MB declared L3 (480 MB measured) · MDF stops at 2.5 GHz · Mesh per-core L3 BW ~30 GB/s
        </text>
      </svg>
    </div>
  );
}
