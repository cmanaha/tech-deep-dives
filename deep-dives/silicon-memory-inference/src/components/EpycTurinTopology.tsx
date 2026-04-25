import React from 'react';

// Schematic of EPYC Turin: 12 CCDs around a central IO die, GMI3-W links, 12 DDR5 channels.
// Two ring layout — 6 CCDs above the IOD, 6 below — with DDR5 channels fanning out left/right.

export function EpycTurinTopology() {
  const width = 880;
  const height = 460;
  const cx = width / 2;
  const cy = height / 2;
  const iodW = 220;
  const iodH = 100;

  // Mid-row CCDs (positions 6 and 12) flank the IO die at matching offsets to
  // keep the layout symmetric — both 10px outside the IOD perimeter on their side.
  const ccdPositions = [
    { x: cx - 320, y: 50 },
    { x: cx - 175, y: 50 },
    { x: cx - 30, y: 50 },
    { x: cx + 115, y: 50 },
    { x: cx + 260, y: 50 },
    { x: cx - 250, y: 130 },
    { x: cx - 320, y: 320 },
    { x: cx - 175, y: 320 },
    { x: cx - 30, y: 320 },
    { x: cx + 115, y: 320 },
    { x: cx + 260, y: 320 },
    { x: cx + 120, y: 130 },
  ];
  const ccdW = 130;
  const ccdH = 60;

  return (
    <div style={{ width: '100%' }}>
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="AMD EPYC Turin topology: up to 12 CCDs each with 8 Zen 5 cores and 32 MB L3, connected to a central IO die over GMI3-Wide, with 12 DDR5 channels"
        style={{ border: '1px solid #e9ebed', borderRadius: '8px', background: '#ffffff' }}
      >
        <text x={20} y={24} fontSize={13} fontWeight={700} fill="#16191f">
          AMD EPYC Turin — up to 12 CCDs orbiting one IO die over GMI3-Wide
        </text>

        {/* IO die */}
        <rect
          x={cx - iodW / 2}
          y={cy - iodH / 2}
          width={iodW}
          height={iodH}
          rx={8}
          fill="#fdf3ec"
          stroke="#ec7211"
          strokeWidth={2}
        />
        <text
          x={cx}
          y={cy - 14}
          fontSize={13}
          fontWeight={700}
          fill="#16191f"
          textAnchor="middle"
        >
          IO die — TSMC 6 nm
        </text>
        <text
          x={cx}
          y={cy + 4}
          fontSize={11}
          fill="#16191f"
          textAnchor="middle"
        >
          12 UMC (DDR5) · 16 GMI ports · Infinity Fabric mesh
        </text>
        <text
          x={cx}
          y={cy + 22}
          fontSize={10}
          fill="#687078"
          textAnchor="middle"
        >
          PCIe 5 / xGMI / CXL 2.0
        </text>

        {/* CCDs and GMI links */}
        {ccdPositions.map((pos, i) => {
          const ccdCx = pos.x + ccdW / 2;
          const ccdCy = pos.y + ccdH / 2;
          // Terminate the GMI line at the IOD perimeter, not the IOD center,
          // so the dashed line does not pass through the IO-die label text.
          const iodLeft = cx - iodW / 2;
          const iodRight = cx + iodW / 2;
          const iodTop = cy - iodH / 2;
          const iodBottom = cy + iodH / 2;
          const targetX = Math.max(iodLeft, Math.min(iodRight, ccdCx));
          const targetY = Math.max(iodTop, Math.min(iodBottom, ccdCy));
          return (
            <g key={i}>
              <rect
                x={pos.x}
                y={pos.y}
                width={ccdW}
                height={ccdH}
                rx={6}
                fill="#f2f8fd"
                stroke="#0972d3"
                strokeWidth={2}
              />
              <text x={ccdCx} y={pos.y + 22} fontSize={11} fontWeight={700} fill="#0972d3" textAnchor="middle">
                {`CCD ${i + 1}`}
              </text>
              <text x={ccdCx} y={pos.y + 38} fontSize={10} fill="#16191f" textAnchor="middle">
                8 Zen 5 cores
              </text>
              <text x={ccdCx} y={pos.y + 52} fontSize={10} fill="#687078" textAnchor="middle">
                32 MB L3
              </text>
              {/* GMI link line — terminates at IOD perimeter */}
              <line
                x1={ccdCx}
                y1={ccdCy}
                x2={targetX}
                y2={targetY}
                stroke="#ec7211"
                strokeWidth={1.5}
                strokeDasharray="4 3"
              />
            </g>
          );
        })}

        {/* DDR5 channel lines */}
        <text x={20} y={cy - 8} fontSize={11} fontWeight={700} fill="#d91515">
          ← 6 × DDR5
        </text>
        <text x={width - 100} y={cy - 8} fontSize={11} fontWeight={700} fill="#d91515">
          6 × DDR5 →
        </text>

        {/* Title row at bottom */}
        <text x={20} y={height - 12} fontSize={11} fill="#687078">
          Up to 16 CCDs (Turin) or 12 CCDs (Turin Dense, 16 cores per CCD = 192 max). 12 × DDR5-6400 ≈ 614 GB/s peak.
        </text>
      </svg>
    </div>
  );
}
