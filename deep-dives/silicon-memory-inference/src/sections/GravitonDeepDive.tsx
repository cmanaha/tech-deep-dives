import React from 'react';
import { SectionShell } from '../components/SectionShell';

export function GravitonDeepDive() {
  return (
    <SectionShell
      title="Graviton Deep Dive"
      subtitle="Neoverse V2 and V3, CMN-700 and CMN-S3, distributed L3"
      tldr={[
        'Graviton4 is Arm Neoverse V2 on CMN-700. Graviton5 moves to Neoverse V3 on CMN-S3 with a 192 MB distributed L3.',
        'The mesh (CMN) is the story. Distributed L3 plus a chiplet-aware fabric keeps per-core bandwidth more stable than Xeon or EPYC as core count scales.',
        'SVE2 gives Graviton a portable vector ISA; workloads that exploit it see material gains over NEON-only code.',
        'Graviton targets price-performance and energy-per-instruction, not peak FLOPs. Instance match: M8g, R8g, C8g, and the upcoming M9g family.',
      ]}
      scope={[
        'Neoverse V2 microarchitecture: fetch / decode width, issue width, vector units, L1 / L2.',
        'Neoverse V3 uplift: wider front end, branch prediction improvements, updated SVE2 and memory ordering.',
        'CMN-700 vs CMN-S3 interconnect — ring-of-rings vs mesh, bisection bandwidth scaling.',
        'Distributed L3 — why 192 MB shared across the chip behaves differently from a big monolithic LLC.',
        'Per-core bandwidth curve as core count scales; the Graviton4 vs Graviton5 regression / uplift story.',
        'Instance families: M8g, R8g, C8g general + memory + compute; M9g as it lands.',
        'Workload fit: web tier, stateless services, Java / Node / Go / Rust, and the real story on AI inference on Graviton.',
      ]}
      panelistMap="AWS-only territory. Graviton is the silicon no other panelist has. Use this section to ground-truth the heterogeneity argument — not every workload should run on HBM; Graviton wins on service tier and some CPU-resident inference."
      evaluationLens={[
        'Is the workload a fit for SVE2, or scalar, or NEON-only legacy?',
        'Does the service tier need raw per-core throughput or aggregate energy-adjusted throughput?',
        'How does per-core bandwidth hold up at full core count on the target instance size?',
        'Is the jump from Graviton3 to Graviton4 to Graviton5 worth the recompile and retest cost for this workload?',
      ]}
    />
  );
}
