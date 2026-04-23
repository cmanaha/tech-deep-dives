import React from 'react';
import { SectionShell } from '../components/SectionShell';

export function QuantizationAndPrecision() {
  return (
    <SectionShell
      title="Quantization and Precision Formats"
      subtitle="INT8, FP8, FP6, FP4, NVFP4, MXFP, and why quantization is a memory technique first"
      tldr={[
        'Quantization moves precision down — FP16 or BF16 to FP8 to FP4 — cutting memory footprint and bandwidth proportionally.',
        'The bandwidth savings usually dominate the FLOP savings. Quantization is a memory technique first, a compute technique second.',
        'NVFP4 is NVIDIA E2M1 with microscaling at block granularity. MXFP (OCP Microscaling) is the open-standard equivalent — MXFP4 and MXFP8 are the common drop points.',
        'Accuracy cost is non-trivial at FP4 and requires calibration, mixed precision for sensitive layers, and sometimes quantization-aware training.',
      ]}
      scope={[
        'Precision ladder: FP64, FP32, TF32, BF16, FP16, FP8 (E4M3, E5M2), FP6, FP4 (E2M1).',
        'Block-scaled formats: NVFP4, MXFP4, MXFP8 — scale per microblock, not per tensor.',
        'INT8 vs FP8: when INT quantization still beats FP for serving throughput.',
        'Calibration: post-training quantization, GPTQ, AWQ, SmoothQuant, and how they differ.',
        'Mixed precision: which layers keep higher precision, which drop, automated precision search.',
        'Hardware support matrix: Hopper (FP8), Blackwell (FP4 / NVFP4 / MXFP), Trainium, Xeon AMX (INT8 / BF16 / FP16), EPYC AVX-512 (BF16 / INT8).',
      ]}
      panelistMap="Shared across panelists. Each architecture has a native precision story — use this section to compare on concrete numbers rather than vendor slides."
      evaluationLens={[
        'What precision does the kernel actually execute in — and is the silicon native or emulating?',
        'Has the model been calibrated for the target precision, or is accuracy sliding silently?',
        'Which layers need to stay at higher precision, and does the runtime support mixed-precision execution?',
        'Does the precision format have block scaling — and if yes, what is the block size?',
      ]}
    />
  );
}
