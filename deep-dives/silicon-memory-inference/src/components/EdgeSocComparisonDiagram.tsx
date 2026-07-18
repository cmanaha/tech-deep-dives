import React from 'react';

// Side-by-side schematic of the two NVIDIA shared-memory edge machines:
// DGX Spark (GB10 Superchip) vs Jetson Orin Nano Super. Same style as
// GravitonComparison: two labeled panels, spec rows, closing takeaway.

export function EdgeSocComparisonDiagram() {
  const width = 880;
  const height = 430;
  const colW = (width - 60) / 2;
  const colY = 56;
  const colH = 330;
  const rightX = 40 + colW;

  return (
    <div style={{ width: '100%' }}>
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="DGX Spark GB10 versus Jetson Orin Nano Super: 128 GB unified LPDDR5X at 273 GB/s with NVLink-C2C versus 8 GB shared LPDDR5 at 102 GB/s on one SoC memory controller"
        style={{ border: '1px solid #e9ebed', borderRadius: '8px', background: '#ffffff' }}
      >
        <text x={20} y={26} fontSize={13} fontWeight={700} fill="#16191f">
          Two shared-memory machines: one desk-scale, one palm-scale
        </text>

        {/* DGX Spark panel */}
        <rect x={20} y={colY} width={colW} height={colH} rx={8} fill="#f2f8fd" stroke="#0972d3" strokeWidth={2} />
        <text x={32} y={colY + 24} fontSize={13} fontWeight={700} fill="#0972d3">
          DGX Spark (GB10 Superchip)
        </text>
        <text x={32} y={colY + 42} fontSize={11} fill="#687078">
          Desktop, 240 W PSU, 140 W SoC TDP, 1.2 kg
        </text>
        <text x={32} y={colY + 68} fontSize={12} fontWeight={600} fill="#16191f">
          CPU
        </text>
        <text x={32} y={colY + 84} fontSize={11} fill="#16191f">
          20 cores: 10x Cortex-X925 + 10x Cortex-A725
        </text>
        <text x={32} y={colY + 100} fontSize={11} fill="#16191f">
          Two mixed clusters (5P + 5E each), Armv9.2
        </text>
        <text x={32} y={colY + 126} fontSize={12} fontWeight={600} fill="#16191f">
          GPU
        </text>
        <text x={32} y={colY + 142} fontSize={11} fill="#16191f">
          Blackwell, 6,144 CUDA cores, 5th-gen Tensor
        </text>
        <text x={32} y={colY + 158} fontSize={11} fill="#16191f">
          Up to 1 PFLOP FP4 (sparse)
        </text>
        <text x={32} y={colY + 184} fontSize={12} fontWeight={600} fill="#16191f">
          Memory
        </text>
        <text x={32} y={colY + 200} fontSize={11} fill="#16191f">
          128 GB LPDDR5X unified, 256-bit, 273 GB/s
        </text>
        <text x={32} y={colY + 226} fontSize={12} fontWeight={600} fill="#16191f">
          CPU-GPU link
        </text>
        <text x={32} y={colY + 242} fontSize={11} fill="#16191f">
          NVLink-C2C, coherent, "5x PCIe Gen 5"
        </text>
        <text x={32} y={colY + 258} fontSize={11} fill="#16191f">
          (no absolute GB/s published for GB10)
        </text>
        <text x={32} y={colY + 284} fontSize={12} fontWeight={600} fill="#16191f">
          Scale-out
        </text>
        <text x={32} y={colY + 300} fontSize={11} fill="#16191f">
          ConnectX-7 200 Gbps, two units up to 405B
        </text>

        {/* Jetson panel */}
        <rect x={rightX + 20} y={colY} width={colW} height={colH} rx={8} fill="#ecf7ec" stroke="#037f0c" strokeWidth={2} />
        <text x={rightX + 32} y={colY + 24} fontSize={13} fontWeight={700} fill="#037f0c">
          Jetson Orin Nano Super
        </text>
        <text x={rightX + 32} y={colY + 42} fontSize={11} fill="#687078">
          Edge module, 7 to 25 W, software-enabled uplift
        </text>
        <text x={rightX + 32} y={colY + 68} fontSize={12} fontWeight={600} fill="#16191f">
          CPU
        </text>
        <text x={rightX + 32} y={colY + 84} fontSize={11} fill="#16191f">
          6x Cortex-A78AE, homogeneous, 1.7 GHz max
        </text>
        <text x={rightX + 32} y={colY + 100} fontSize={11} fill="#16191f">
          One quad cluster + one dual cluster, Armv8.2
        </text>
        <text x={rightX + 32} y={colY + 126} fontSize={12} fontWeight={600} fill="#16191f">
          GPU
        </text>
        <text x={rightX + 32} y={colY + 142} fontSize={11} fill="#16191f">
          Ampere, 1,024 CUDA cores, 32 Tensor cores
        </text>
        <text x={rightX + 32} y={colY + 158} fontSize={11} fill="#16191f">
          67 TOPS INT8 sparse (33 dense)
        </text>
        <text x={rightX + 32} y={colY + 184} fontSize={12} fontWeight={600} fill="#16191f">
          Memory
        </text>
        <text x={rightX + 32} y={colY + 200} fontSize={11} fill="#16191f">
          8 GB LPDDR5 shared, 128-bit, 102 GB/s (Super)
        </text>
        <text x={rightX + 32} y={colY + 226} fontSize={12} fontWeight={600} fill="#16191f">
          CPU-GPU link
        </text>
        <text x={rightX + 32} y={colY + 242} fontSize={11} fill="#16191f">
          None needed: CPU and iGPU share the SoC
        </text>
        <text x={rightX + 32} y={colY + 258} fontSize={11} fill="#16191f">
          DRAM through one memory controller
        </text>
        <text x={rightX + 32} y={colY + 284} fontSize={12} fontWeight={600} fill="#16191f">
          Scale-out
        </text>
        <text x={rightX + 32} y={colY + 300} fontSize={11} fill="#16191f">
          None (single module, GbE only)
        </text>

        <text x={20} y={height - 14} fontSize={11} fontStyle="italic" fill="#414d5c">
          One memory pool each. Pool capacity sets which models fit; pool bandwidth sets how fast they decode.
        </text>
      </svg>
    </div>
  );
}
