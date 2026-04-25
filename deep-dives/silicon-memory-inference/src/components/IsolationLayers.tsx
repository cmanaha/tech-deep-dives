import React from 'react';

// Three-pillar isolation diagram: NIE (host), MIG / TEE-I/O (accelerator), Trainium SBUF partitioning.

export function IsolationLayers() {
  const width = 880;
  const height = 360;
  const colW = (width - 60) / 3;

  return (
    <div style={{ width: '100%' }}>
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Three-pillar isolation: Nitro Isolation Engine on host, MIG with TEE-I/O on NVIDIA accelerators, compiler-managed SBUF partitioning on Trainium"
        style={{ border: '1px solid #e9ebed', borderRadius: '8px', background: '#ffffff' }}
      >
        <text x={20} y={26} fontSize={13} fontWeight={700} fill="#16191f">
          AWS three-pillar isolation story — host, accelerator, software
        </text>

        {/* Pillar 1: NIE */}
        <rect x={20} y={50} width={colW} height={290} rx={10} fill="#f2f8fd" stroke="#0972d3" strokeWidth={2} />
        <text x={36} y={78} fontSize={13} fontWeight={700} fill="#0972d3">
          Pillar 1 — Host
        </text>
        <text x={36} y={96} fontSize={11} fill="#687078">
          Nitro Isolation Engine (NIE)
        </text>
        <text x={36} y={124} fontSize={12} fontWeight={600} fill="#16191f">
          Mechanism
        </text>
        <text x={36} y={142} fontSize={11} fill="#16191f">
          Rust hypercall module beneath
        </text>
        <text x={36} y={158} fontSize={11} fill="#16191f">
          the Nitro Hypervisor
        </text>
        <text x={36} y={186} fontSize={12} fontWeight={600} fill="#16191f">
          Verification
        </text>
        <text x={36} y={204} fontSize={11} fill="#16191f">
          Isabelle/HOL proof
        </text>
        <text x={36} y={220} fontSize={11} fill="#16191f">
          ~250,000 lines · 30 min check
        </text>
        <text x={36} y={248} fontSize={12} fontWeight={600} fill="#16191f">
          Where it ships
        </text>
        <text x={36} y={266} fontSize={11} fill="#16191f">
          Graviton5 (M9g preview Dec 2025)
        </text>
        <text x={36} y={282} fontSize={11} fill="#16191f">
          C9g, R9g — 2026
        </text>
        <text x={36} y={310} fontSize={11} fontStyle="italic" fill="#0972d3">
          First formally verified
        </text>
        <text x={36} y={326} fontSize={11} fontStyle="italic" fill="#0972d3">
          cloud hypervisor
        </text>

        {/* Pillar 2: MIG */}
        <rect x={40 + colW} y={50} width={colW} height={290} rx={10} fill="#ecf7ec" stroke="#037f0c" strokeWidth={2} />
        <text x={56 + colW} y={78} fontSize={13} fontWeight={700} fill="#037f0c">
          Pillar 2 — Accelerator
        </text>
        <text x={56 + colW} y={96} fontSize={11} fill="#687078">
          MIG + TEE-I/O on NVIDIA
        </text>
        <text x={56 + colW} y={124} fontSize={12} fontWeight={600} fill="#16191f">
          Mechanism
        </text>
        <text x={56 + colW} y={142} fontSize={11} fill="#16191f">
          Hardware partitioning of GPU
        </text>
        <text x={56 + colW} y={158} fontSize={11} fill="#16191f">
          into up to 7 instances
        </text>
        <text x={56 + colW} y={186} fontSize={12} fontWeight={600} fill="#16191f">
          Per-instance isolation
        </text>
        <text x={56 + colW} y={204} fontSize={11} fill="#16191f">
          Dedicated SMs, L2 slice, HBM
        </text>
        <text x={56 + colW} y={220} fontSize={11} fill="#16191f">
          region + bandwidth + TEE-I/O
        </text>
        <text x={56 + colW} y={248} fontSize={12} fontWeight={600} fill="#16191f">
          Where it ships
        </text>
        <text x={56 + colW} y={266} fontSize={11} fill="#16191f">
          A100, H100, H200, B200, B300
        </text>
        <text x={56 + colW} y={282} fontSize={11} fill="#16191f">
          TEE-I/O adds encryption on Blackwell
        </text>
        <text x={56 + colW} y={310} fontSize={11} fontStyle="italic" fill="#037f0c">
          B300: up to 7 × ~34 GB
        </text>
        <text x={56 + colW} y={326} fontSize={11} fontStyle="italic" fill="#037f0c">
          per MIG instance
        </text>

        {/* Pillar 3: Trainium */}
        <rect x={60 + colW * 2} y={50} width={colW} height={290} rx={10} fill="#fdf3ec" stroke="#ec7211" strokeWidth={2} />
        <text x={76 + colW * 2} y={78} fontSize={13} fontWeight={700} fill="#ec7211">
          Pillar 3 — Software
        </text>
        <text x={76 + colW * 2} y={96} fontSize={11} fill="#687078">
          NEFF AOT on Trainium
        </text>
        <text x={76 + colW * 2} y={124} fontSize={12} fontWeight={600} fill="#16191f">
          Mechanism
        </text>
        <text x={76 + colW * 2} y={142} fontSize={11} fill="#16191f">
          Compiler-managed SBUF
        </text>
        <text x={76 + colW * 2} y={158} fontSize={11} fill="#16191f">
          + ahead-of-time schedule
        </text>
        <text x={76 + colW * 2} y={186} fontSize={12} fontWeight={600} fill="#16191f">
          What it gives you
        </text>
        <text x={76 + colW * 2} y={204} fontSize={11} fill="#16191f">
          Per-call deterministic output
        </text>
        <text x={76 + colW * 2} y={220} fontSize={11} fill="#16191f">
          No cache contention possible
        </text>
        <text x={76 + colW * 2} y={248} fontSize={12} fontWeight={600} fill="#16191f">
          Where it ships
        </text>
        <text x={76 + colW * 2} y={266} fontSize={11} fill="#16191f">
          Trainium2, Inferentia2
        </text>
        <text x={76 + colW * 2} y={282} fontSize={11} fill="#16191f">
          Trn2 UltraServer (64 chips)
        </text>
        <text x={76 + colW * 2} y={310} fontSize={11} fontStyle="italic" fill="#ec7211">
          Reproducibility as a
        </text>
        <text x={76 + colW * 2} y={326} fontSize={11} fontStyle="italic" fill="#ec7211">
          first-class property
        </text>
      </svg>
    </div>
  );
}
