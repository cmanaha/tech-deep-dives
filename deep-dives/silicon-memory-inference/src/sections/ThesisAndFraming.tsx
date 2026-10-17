import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Alert from '@cloudscape-design/components/alert';
import { TriangleDiagram } from '../components/TriangleDiagram';
import { Cite } from '../components/Cite';
import { S } from '../sources/ThesisAndFraming';

const sparseNote =
  'NVIDIA marks the H200 FP8 Tensor Core figure, 3,958 TFLOPS, "With sparsity". Its Hopper architecture blog lists Tensor Core peaks as dense/sparse pairs at a 1:2 ratio, so dense FP8 is about 1,979 TFLOPS.';

const ridgeNote =
  '1,979 TFLOPS / 4.8 TB/s = 412 FLOP per byte (dense FP8). With the sparse 3,958 TFLOPS it would be 825.';

const decodeNote =
  'A decode step multiplies every weight once per sequence in the batch: one multiply-add, 2 FLOPs. With 8-bit weights each weight is 1 byte, so a batch of B gives about 2B FLOP per byte of weights read: 2 to 10 at batch 1 to 5. 412 / 10 = 41 and 412 / 2 = 206. KV-cache reads add bytes, so real decode sits at or below this.';

const rooflineNote =
  'Roofline: attainable FLOP/s = min(peak FLOP/s, bandwidth x operational intensity). Below the ridge the bandwidth term is the smaller one, so attainable throughput moves with bandwidth and ignores peak.';

const mispredictNote =
  'MispredictPenalty in LLVM scheduling models at llvmorg-19.1.0: Neoverse V2 10 (commented "Copied from N2"), Zen 4 13, Sapphire Rapids 14. These are compiler cost estimates, not measurements.';

const amxNote =
  'Comment in amxintrin.h: "AMX tile register size can be configured, the maximum size is 16x64=1024 bytes."';

export function ThesisAndFraming() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="A way to predict how a model will run on any chip in this dive, from one ratio you can work out from a spec sheet"
          >
            Thesis and Framing
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            This deep dive gives you a way to predict how an inference workload will run on a chip
            before you benchmark it. Every operation needs three deliveries at a functional unit:
            an instruction, its operands and their layout. Find the one your workload waits on,
            then read each chip for how it makes that delivery. For decode, the phase that
            generates each output token, it is operand data, so read memory bandwidth first.
          </Box>
          <Box variant="p">
            <strong>Reading a spec sheet for inference.</strong> The headline figure is peak
            FLOPS, often quoted with sparsity.
            <Cite
              s={S.gb300Nvl72}
              note='"All Tensor Core specifications are with sparsity unless otherwise noted."'
            />{' '}
            Decode does little arithmetic per byte: a dense model reads every weight once per
            generated token, and an MoE (mixture of experts) model reads the experts each token
            selects.
            <Cite s={S.deepseekV3Report} />
          </Box>
          <Box variant="p">
            <strong>The anchor number.</strong> An NVIDIA H200 SXM delivers 1,979 TFLOPS of dense
            FP8 (8-bit floating point) against 4.8 TB/s of HBM3e (High Bandwidth Memory).
            <Cite s={S.h200Page} />
            <Cite s={S.hopperArchBlog} kind="derived" note={sparseNote} /> Dividing gives the ridge
            point, where a workload stops being limited by bandwidth and becomes limited by
            compute: about 412 FLOP per byte.
            <Cite s={S.h200Page} kind="derived" note={ridgeNote} /> Each weight feeds one
            multiply-add per sequence in the batch, so with 8-bit weights at batch 1 to 5, decode
            sits at 2 to 10 FLOP per byte, 40 to 200 times below the ridge.
            <Cite s={S.roofline} kind="derived" note={decodeNote} /> Doubling peak FLOPS does
            nothing for it; doubling bandwidth roughly doubles tokens per second until a fixed
            latency floor sets the step time.
            <Cite s={S.roofline} kind="derived" note={rooflineNote} />
          </Box>
          <Box variant="small" color="text-body-secondary">
            Sparse aside: NVIDIA&apos;s 3,958 TFLOPS FP8 headline is &quot;With sparsity&quot;, a
            rate that applies only to weights pruned to the 2:4 structured pattern, and it gives a
            ridge of 825. Place workloads with the dense figure.
            <Cite s={S.h200Page} />
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The three deliveries every operation waits on, and how each kind of chip makes them"
          >
            The instruction-data-shape triangle
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            An operation retires when a functional unit executes it. Three things must reach the
            unit in the same cycle: the <strong>instruction</strong>, the <strong>data</strong>,
            and the <strong>shape</strong> of that data. Each architecture in this dive is a
            different answer to keeping the three aligned.
          </Box>
          <TriangleDiagram />
          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="h3">Instruction delivery</Box>
              <Box variant="p">
                The front end fetches, decodes and issues the operation. Out-of-order host cores
                do it speculatively, with a branch predictor and a BTB (Branch Target Buffer). A
                GPU SM (Streaming Multiprocessor) issues from a warp scheduler and hides a stalled
                warp&apos;s latency by running other warps.
                <Cite s={S.cudaBestPractices} /> On Trainium the Neuron compiler fixes most of the
                schedule ahead of time in a NEFF (Neuron Executable File Format); Trainium3 adds
                ISA (instruction set architecture) support for dynamic shapes and control flow.
                <Cite s={S.trainium3Arch} /> On a Cerebras WSE-3 (Wafer-Scale Engine 3), each of
                900,000 cores runs its own program from 48 kB of local SRAM and fires a task when
                its data arrives, with no global scheduler.
                <Cite s={S.cerebrasS1} />
                <Cite s={S.cerebrasSdkBlog} />
              </Box>
            </div>
            <div>
              <Box variant="h3">Data delivery</Box>
              <Box variant="p">
                The operands must sit in the tier the unit reads from. On a CPU core that is the
                register file, filled from L1. On a GPU SM it is the register file, filled from
                SMEM (shared memory) and, on Blackwell, TMEM (Tensor Memory).
                <Cite s={S.ptxIsa} /> On Trainium it is SBUF (State Buffer) and PSUM (Partial Sum
                buffer).
                <Cite s={S.trainium2Arch} /> A miss upstream becomes a pipeline stall or a slip in
                the compiled schedule.
              </Box>
            </div>
            <div>
              <Box variant="h3">Shape fit</Box>
              <Box variant="p">
                The operand layout (tile size, stride, alignment, precision) must match what the
                unit consumes. An AMX (Advanced Matrix Extensions) tile register on Intel Xeon
                holds at most 16 rows of 64 bytes.
                <Cite s={S.clangAmxIntrin} note={amxNote} /> Blackwell&apos;s tcgen05 instructions read TMEM in
                fixed data-path layouts.
                <Cite s={S.ptxIsa} /> Trainium&apos;s systolic array consumes tiles the Neuron
                compiler sizes. A kernel with the wrong tile under-fills the unit or falls back to
                a slower path that misses tensor-core throughput.
              </Box>
            </div>
          </ColumnLayout>
          <Alert type="info">
            Peak FLOPS assumes all three deliveries arrive on time. In practice the compiler
            selects instructions, the memory hierarchy stages data, and the kernel author sets the
            shape. A chip that leads on peak FLOPS can lose to a slower one that makes the three
            deliveries more consistently on the target workload.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The workload decides which delivery binds, which is why a 2026 GPU rack carries a second kind of chip for decode"
          >
            Heterogeneity is the organizing fact
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Run two workloads on one server. A payments ledger (branchy code, a working set in L2
            and L3) lives on the front end: branch-prediction accuracy and L3 hit rate set its
            speed, and the tensor cores sit idle. Transformer decode inverts that. Its branches
            are few and predictable, and the bottleneck is HBM bandwidth staging weights into the
            tensor pipe.
          </Box>
          <Box variant="p">
            Across chips the spread is wider. Arm Neoverse host cores, x86 cores with AMX tiles,
            NVIDIA Hopper and Blackwell GPUs, AWS Trainium and Inferentia, Cerebras wafer-scale
            engines, the Groq LPU (Language Processing Unit), the SambaNova RDU (Reconfigurable
            Dataflow Unit) and compute-in-memory devices each place a different bet on how
            instruction, data and shape reach the unit.
          </Box>
          <Box variant="p">
            <strong>A GPU vendor ships the thesis.</strong> NVIDIA&apos;s Vera Rubin platform
            includes the NVIDIA Groq 3 LPX, a rack of LPUs built on Groq inference technology
            that NVIDIA licenses, in full production since August 2026.
            <Cite s={S.groqNvidiaLicense} />
            <Cite s={S.lpxProduction} /> Each LPU&apos;s primary working storage is 500 MB of
            on-chip SRAM. Within decode, LPX runs the MoE expert FFNs (feed-forward networks)
            while Rubin GPUs keep prefill and decode attention over the KV (key-value) cache.
            <Cite s={S.lpxBlog} /> One decode step crosses two kinds of silicon.
          </Box>
          <Box variant="p">
            So &quot;which chip is fastest&quot; has no answer until the workload is named. An
            HFT (high-frequency trading) matching engine judged on p99.9 tick-to-trade latency, a
            RAG (Retrieval-Augmented Generation) pipeline judged on tokens per second per dollar
            and a training run judged on time to convergence bind on different deliveries, and
            often land on different silicon.
          </Box>
          <Alert type="warning" header="Check that the mechanism exists before you port a tuning result">
            A branch mispredict costs a host core a pipeline refill, 10 to 14 cycles in
            LLVM&apos;s scheduling models.
            <Cite s={S.llvmNeoverseV2} note={mispredictNote} />
            <Cite s={S.llvmZnver4} note={mispredictNote} />
            <Cite s={S.llvmSapphireRapids} note={mispredictNote} /> A tensor-core pipeline bubble
            costs the matrix FLOPs that did not retire that cycle. On Trainium most of the
            schedule is fixed at compile time, so stalls are largely visible in the compiled
            schedule. On WSE-3 the compiler fixes the routes, and a model larger than one wafer is
            split at layer boundaries across several CS-3 systems.
            <Cite s={S.cerebrasInferenceBlog} /> &quot;We cut p99 by raising speculation
            depth&quot; gives a systolic array nothing to act on: it has no speculation depth.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The question to bring to every chip, and where the dive answers it"
          >
            What to ask instead
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Bring one question to every chip: on this workload, which delivery binds, and what
            does the silicon do when it is late? <em>Roofline and Arithmetic Intensity</em>{' '}
            computes ridge points across chips and precisions. <em>Memory Hierarchy Primer</em>{' '}
            and <em>Anatomy of a Kernel Execution</em> walk the tiers; <em>HBM and the Bandwidth
            Wall</em>, <em>DDR5, MRDIMM, LPDDR5X and CXL</em>, <em>High Bandwidth Flash</em> and{' '}
            <em>Flash as a Cache Tier for Inference</em> take the ones that hold weights and KV
            cache. The silicon sections, <em>Graviton Deep Dive</em> through{' '}
            <em>Compute-in-Memory</em>, show which delivery each family optimizes. The software
            sections, <em>KV Cache and FlashAttention</em> through{' '}
            <em>Disaggregated Serving and Speculative Decoding</em>, cover techniques that change
            a workload&apos;s arithmetic intensity and so move it on the roofline.
          </Box>
          <Box variant="p">
            For H200 decode the answer is data: the ridge sits near 412 FLOP per byte and decode
            at 2 to 10. To place your own workload, work out its FLOP per byte the way the anchor
            number does, then open <em>Roofline and Arithmetic Intensity</em>.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
