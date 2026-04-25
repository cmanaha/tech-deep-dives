import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Alert from '@cloudscape-design/components/alert';
import Link from '@cloudscape-design/components/link';
import { TriangleDiagram } from '../components/TriangleDiagram';

export function ThesisAndFraming() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Why peak FLOPs is the wrong first question for modern inference silicon"
          >
            Beyond peak FLOPs
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The framing problem.</strong> When a vendor announces a new accelerator, the
            first slide is almost always a FLOPs number — FP8 peak, sparse peak, or the
            next-precision-down peak that looks biggest. For modern inference workloads that
            number is nearly useless on its own. A transformer in the decode phase reads the
            entire model&apos;s weights from memory once per generated token and does a small
            amount of arithmetic per byte read. The silicon spends most of its time waiting
            for operands, not executing math. Peak FLOPs tells you about the ceiling; inference
            economics live on the floor.
          </Box>
          <Box variant="p">
            <strong>The concrete number.</strong> NVIDIA H200 SXM (Server PCIe Module form
            factor) ships 3,958 TFLOPS of FP8 tensor performance against 4.8 TB/s of
            HBM3e (High Bandwidth Memory generation 3e) bandwidth
            {' ('}
            <Link external href="https://www.nvidia.com/en-us/data-center/h200/">
              NVIDIA H200 product page
            </Link>
            , accessed 2026-04-23). Divide: the ridge point is roughly 825 FLOPs per byte —
            the boundary where a workload stops being bandwidth-bound and becomes
            compute-bound. Decode with a modest batch size lives at 2-10 FLOPs per byte. That
            is two orders of magnitude below the ridge. Doubling the peak FLOPs on that
            silicon would do nothing for decode; doubling the HBM bandwidth would roughly
            double the tokens per second.
          </Box>
          <Box variant="p">
            <strong>The heterogeneity reality.</strong> Silicon has never been more varied in
            how it delivers throughput. Arm Neoverse host cores, x86 CPUs with AMX
            (Advanced Matrix Extensions) tile registers, NVIDIA Hopper and Blackwell GPUs,
            AWS Trainium and Inferentia, Cerebras wafer-scale, Groq LPU (Language
            Processing Unit), SambaNova RDU (Reconfigurable Dataflow Unit), and
            compute-in-memory devices each
            make a different bet about how the instruction, the data, and the data shape
            should arrive at the functional unit. &ldquo;Fastest chip&rdquo; is an ill-formed
            question until you know which leg of that triangle your workload stresses.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Three things must arrive at the unit simultaneously — not just FLOPs"
          >
            The instruction-data-shape triangle
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A single FLOP happens when a functional unit executes a specified operation on a
            specified operand. For that to happen, the architecture has to deliver three
            things to the unit at the same clock: an <strong>instruction</strong>, the
            <strong> data</strong>, and the <strong>shape</strong> of that data. Every modern
            silicon architecture is a different answer to &ldquo;how do we keep this triangle
            aligned?&rdquo;
          </Box>
          <TriangleDiagram />
          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="h3">Instruction delivery</Box>
              <Box variant="p">
                The front end must fetch, decode, and issue an operation the workload wants.
                Out-of-order host cores do this speculatively with a branch predictor and
                BTB (Branch Target Buffer). GPU SMs (Streaming Multiprocessors) do it with
                a warp scheduler and no speculation. AWS Trainium does not do it at runtime
                at all — the Neuron compiler emits a NEFF (Neuron Executable File Format)
                descriptor ahead of time and the runtime plays it back. Cerebras WSE-3
                (Wafer-Scale Engine generation 3) bakes the program into per-processing-
                element state so there is no runtime front end.
              </Box>
            </div>
            <div>
              <Box variant="h3">Data delivery</Box>
              <Box variant="p">
                The operand bytes must be resident in the tier the unit reads from. On a
                CPU core: the register file sourced from L1. On a GPU SM: the register
                file sourced from SMEM (Shared Memory) and (on Blackwell) TMEM (Tensor
                Memory). On Trainium: SBUF (State Buffer) and PSUM (Partial Sum buffer).
                Every cache miss or scratchpad miss upstream turns into either a pipeline
                stall or a compiler-visible schedule slip — see Section 4 for the hierarchy.
              </Box>
            </div>
            <div>
              <Box variant="h3">Shape fit</Box>
              <Box variant="p">
                The operand layout — tile size, stride, alignment, precision — must match
                what the unit expects. AMX tile registers on Intel Xeon 6 hold 16 rows of
                up to 64 bytes. Blackwell tcgen05 reads TMEM tiles in specific shapes.
                Trainium&apos;s systolic array consumes tiles sized by the Neuron compiler.
                A kernel with the wrong tile either under-fills the unit or recompiles
                into a slower fallback that does not hit tensor-core throughput.
              </Box>
            </div>
          </ColumnLayout>
          <Alert type="info">
            Peak FLOPs implicitly assumes all three legs of the triangle are aligned for
            free. In practice, instruction selection is the compiler&apos;s job, data
            staging is the memory hierarchy&apos;s job, and shape fit is a property of the
            kernel author. A silicon choice that looks strong on peak FLOPs can lose to a
            slower chip that delivers the triangle more consistently on the target workload.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Workload character selects the bet — the same box looks like a different machine"
          >
            Heterogeneity is the organizing fact
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Consider two workloads on the same server. A payments ledger — branchy code,
            short-lived objects, working set in L2 and L3 — lives on the front end. Branch
            prediction accuracy and L3 hit rate are the first-order variables; the tensor
            cores on the same chip are dark silicon for this workload. Swap to transformer
            decode on the same box and the picture inverts. Branches are sparse and easily
            predicted, the front end is over-provisioned, and the bottleneck is HBM
            bandwidth staging weights into the tensor pipe. Different legs of the triangle,
            different silicon paying attention.
          </Box>
          <Box variant="p">
            This is why &ldquo;which chip is fastest&rdquo; is an ill-formed question until you
            specify the workload. An HFT matching engine at p99.9 tick-to-trade latency, a
            Retrieval-Augmented Generation (RAG) pipeline at tokens per second per dollar, a
            foundation-model training run at time-to-convergence, and a mixed-tenant SaaS
            backend at cost per request are four different architectures of problem. They
            select different triangles and, often, different silicon families.
          </Box>
          <Alert type="warning" header="Stall cost is not portable">
            A branch mispredict on an out-of-order core costs 15-20 cycles of drained
            pipeline. A pipeline bubble on a tensor core costs the matmul&apos;s worth of
            FLOPs that did not retire that clock. A schedule slip on Trainium is
            compiler-visible — the NEFF encoded when each operand had to arrive, so the
            miss shows up as a compile-time artifact rather than a runtime surprise. A
            fabric congestion event on WSE-3 is handled by static routing, meaning either
            the plan avoided it or the model does not fit. Transferring optimization
            intuitions between these architectures is dangerous — &ldquo;we cut p99 by
            raising speculation depth&rdquo; does not translate to a systolic array because
            there is no speculation depth to raise.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The rest of this deep dive is organized around the questions that replace peak FLOPs"
          >
            What to ask instead
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Section 3 defines the roofline formally and computes ridge points per
            architecture. Section 4 walks the seven-tier memory hierarchy. Section 6 digs
            into HBM — the tier that matters most for inference and the tier most actively
            contested in silicon roadmaps. Sections 8-16 take each silicon family in turn
            and show which leg of the triangle it optimizes, with Tier 1 vendor citations.
            Sections 20-22 cover the software techniques (KV cache layout,
            FlashAttention-class fusion, quantization, speculative decoding, disaggregated
            serving) that change a workload&apos;s arithmetic intensity and therefore its
            placement on the roofline.
          </Box>
          <Box variant="p">
            The organizing question of the deep dive is not &ldquo;how many FLOPs does this
            chip do&rdquo; but &ldquo;on this workload, which leg of the triangle binds, and
            what does the silicon do when that leg is late?&rdquo;
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
