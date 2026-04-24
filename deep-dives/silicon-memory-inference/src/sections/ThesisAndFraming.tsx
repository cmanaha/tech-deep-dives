import React from 'react';
import Box from '@cloudscape-design/components/box';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Link from '@cloudscape-design/components/link';
import Alert from '@cloudscape-design/components/alert';
import { SectionShell } from '../components/SectionShell';

export function ThesisAndFraming() {
  return (
    <SectionShell
      status="draft"
      title="Thesis and Framing — Beyond peak FLOPs"
      subtitle="Inference is memory-bound, and silicon has never been more heterogeneous"
      tldr={[
        'Peak FLOPs is the last number that matters for inference. The ridge point sits far to the left of most decode workloads.',
        'To land on the FLOPs, three things have to arrive at the functional unit at the same time: the instruction, the data, and the right data shape.',
        'Silicon has never been more heterogeneous. Each architecture optimizes a different subset of (instruction delivery, data delivery, shape fit, power, determinism).',
        'Workload character selects the architecture. OLTP and business-logic workloads lean on branch prediction and retirement; transformer decode leans on wide tensor pipes and staged memory.',
        'Mispredict or stall costs are architecture-specific. A front-end bubble on a Xeon core is a different event from a pipeline bubble on a tensor core or a Trainium systolic array.',
      ]}
      scope={[
        'Arithmetic intensity and the roofline model — define ridge point, memory-bound, compute-bound.',
        'The instruction-data-shape triangle — why all three must align.',
        'Heterogeneity as the organizing fact — the list of live architectures and what each one bets on.',
        'Workload taxonomy — OLTP, batch analytics, training, prefill, decode, real-time inference, HFT.',
        'Retirement and stall semantics across out-of-order cores, tensor pipes, systolic arrays, and dataflow fabrics.',
        'Why FLOPs-first vendor marketing misleads and what to ask instead.',
      ]}
      panelistMap="This is the shared lens for the whole panel. Land the framing here and every subsequent answer has a consistent yardstick — AWS, Cerebras, and HyperCIM can each describe what their silicon does without the audience reaching for peak FLOPs."
      evaluationLens={[
        'What is the arithmetic intensity of the workload being pitched? Where does it sit on the roofline?',
        'How does the instruction reach the functional unit — front-end width, ISA, compile-time vs runtime scheduling?',
        'How does the data reach the unit — tier count, bandwidth, staging, prefetch, page walk cost?',
        'Is the data shape native or translated? Tile size, precision, layout, stride, alignment.',
        'What happens on a miss or stall — stall cost, bubble recovery, replay, retry, compensation?',
      ]}
    >
      <SpaceBetween size="l">
        <Header variant="h2">Why peak FLOPs is the wrong first number</Header>
        <Box variant="p">
          The instinctive question when a vendor announces a new accelerator is "how many FLOPs does
          it do?" For modern inference workloads that question is nearly useless on its own. A
          transformer model in the decode phase — the per-token generation loop that dominates
          chatbot and agent latency — produces one output token at a time and, for each token,
          reads the entire model's weights from memory. The arithmetic per byte read is small. The
          silicon spends most of its time waiting for bytes, not executing math.
        </Box>
        <Box variant="p">
          Concretely, an NVIDIA H200 SXM reaches 3,958 TFLOPS of FP8 tensor performance against
          4.8 TB/s of HBM3e bandwidth
          {' ('}
          <Link
            external
            href="https://www.nvidia.com/en-us/data-center/h200/"
          >
            NVIDIA H200 product page
          </Link>
          {', accessed 2026-04-23). The ratio is roughly 825 FLOPs per byte — the ridge point of the'}
          {' '}
          <Link
            external
            href="https://dl.acm.org/doi/10.1145/1498765.1498785"
          >
            Roofline model (Williams, Waterman, Patterson — CACM 2009)
          </Link>
          . Any workload with arithmetic intensity below that number is memory-bound; adding more
          FLOPs to the chip does nothing. LLM decode with a modest batch size lives two orders of
          magnitude below the ridge, which is why memory bandwidth, not FLOPs, is the
          first-order variable for inference economics.
        </Box>

        <Header variant="h2">The instruction-data-shape triangle</Header>
        <Box variant="p">
          Saying "the workload is memory-bound" is only half the story. To land an actual
          operation on a functional unit, three things have to arrive together:
        </Box>
        <Box variant="p">
          <strong>The instruction.</strong> The ISA has to encode the operation the workload
          wants. A matmul on a Xeon 6 core uses AMX tile-register instructions; on a Blackwell GPU
          it uses tcgen05.mma; on Trainium it is emitted by the Neuron compiler as a systolic-array
          descriptor. The compiler decides which of these is issued and when.
        </Box>
        <Box variant="p">
          <strong>The data.</strong> The operand bytes have to be staged through the memory
          hierarchy so they are resident in registers (or in the tier the ISA reads from) at
          issue time. On a GPU that means SMEM then TMEM then register file. On Trainium it means
          SBUF and PSUM. On a Xeon core it means L1D, because AMX reads operands from the tile
          register file that is sourced from L1.
        </Box>
        <Box variant="p">
          <strong>The shape.</strong> The operand layout — tile size, stride, alignment, precision
          — has to match what the functional unit expects. A 16×16 BF16 tile that fits a tensor
          core is a different object from a contiguous FP32 vector that fits AVX-512. A kernel
          written against the wrong shape either recompiles to something slower or spills to a
          fallback path.
        </Box>
        <Alert type="info" header="Consequence for architecture decisions">
          Peak FLOPs assumes all three legs of the triangle are aligned for free. In practice
          instruction selection is the compiler's job, data staging is the memory hierarchy's
          job, and shape fit is a property of the kernel. A silicon choice that looks strong on
          peak FLOPs can lose to a slower chip that delivers the triangle more consistently.
        </Alert>

        <Header variant="h2">Heterogeneity as the organizing fact</Header>
        <Box variant="p">
          Silicon has never been more heterogeneous. The live 2026 list includes Arm Neoverse
          host cores (Graviton4 and Graviton5), x86 hosts (Intel Xeon 6 Granite Rapids, AMD
          EPYC Turin), NVIDIA Hopper and Blackwell GPUs, AWS Trainium and Inferentia, Cerebras
          wafer-scale, Groq LPU, SambaNova RDU, and compute-in-memory devices (Samsung HBM-PIM,
          HyperCIM). Each of these optimizes a different subset of the triangle.
        </Box>
        <Box variant="p">
          A Graviton5 core bets on predictable instruction delivery, branch prediction, and
          large L3 for OLTP and microservice workloads — the kind of code where the retirement
          pipeline matters more than tensor throughput. A Blackwell GPU bets on TMEM-resident
          tiles and tcgen05 matmul — the kind of code where instruction fetch is trivial but
          data staging is everything. Trainium bets on ahead-of-time schedule compilation —
          the instruction stream is a fixed descriptor rather than an out-of-order reorder
          buffer. No single architecture is "best"; the right question is which workload you
          are sitting on and which leg of the triangle it stresses.
        </Box>

        <Header variant="h2">Workload character and stall cost</Header>
        <Box variant="p">
          The same heterogeneity appears inside a single box when you change the workload. A
          business-logic workload — payments, user session state, order bookkeeping — spends its
          time in branchy code with hard-to-predict jumps, short-lived allocations, and data
          that fits comfortably in L2 and L3. On that workload, the front-end width and branch
          predictor of an out-of-order core are the dominant performance variables; tensor
          cores and HBM sit idle.
        </Box>
        <Box variant="p">
          Swap the same box to transformer decode and the picture inverts. Branches are
          predictable and sparse; the inner loop is a sequence of matmuls staged from HBM.
          Now the front end is over-provisioned and the bottleneck is HBM bandwidth. Stall
          costs also change: a branch mispredict on a Xeon costs tens of cycles to drain and
          refill the pipeline; a pipeline bubble on a tensor core costs the matmul's worth of
          FLOPs that did not retire; a SBUF miss on Trainium costs a compiler-visible schedule
          slip. These are qualitatively different events, and architectural choices should be
          evaluated against the event type the workload actually produces, not against an
          abstract peak.
        </Box>

        <Header variant="h2">What to ask instead of "how many FLOPs"</Header>
        <Box variant="p">
          The rest of this deep dive is organized around the questions that replace peak FLOPs.
          Section 3 defines the roofline and computes ridge points for the major silicon
          families. Section 4 walks the seven-tier memory hierarchy. Sections 8-16 take each
          silicon family and show which leg of the triangle it optimizes, with vendor-cited
          evidence. Sections 20-22 cover the software techniques (KV cache, quantization,
          disaggregated serving) that change a workload's arithmetic intensity and therefore
          its placement on the roofline.
        </Box>
      </SpaceBetween>
    </SectionShell>
  );
}
