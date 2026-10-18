import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Table from '@cloudscape-design/components/table';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { CimDiagram } from '../components/CimDiagram';
import { Cite } from '../components/Cite';
import type { Source } from '../components/Cite';
import { S } from '../sources/ComputeInMemory';

interface PimResult {
  run: string;
  speedup: string;
  energy: string;
  source: Source;
  note: string;
}

const pimResults: PimResult[] = [
  {
    run: 'GPT-J 6B, 64 tokens out, 1 GPU',
    speedup: '2.16x',
    energy: '1.79x',
    source: S.samsungPimHc35,
    note: 'Slide 12, GPT-J (6B, 32 input tokens) on a single AMD MI100-PIM GPU, against the same GPU with ordinary HBM.',
  },
  {
    run: 'GPT-J 6B, 256 tokens out, 1 GPU',
    speedup: '2.33x',
    energy: '2.24x',
    source: S.samsungPimHc35,
    note: 'Slide 12, GPT-J (6B, 32 input tokens) on a single AMD MI100-PIM GPU, against the same GPU with ordinary HBM.',
  },
  {
    run: 'T5-based MoE, 32 GPUs',
    speedup: '2.71x',
    energy: '3.61x',
    source: S.samsungPimHc35,
    note: 'Slide 15, T5-large with DeepSpeed MoE layers moved to PIM, against GPU clusters with ordinary HBM.',
  },
  {
    run: 'T5-based MoE, 64 GPUs',
    speedup: '2.06x',
    energy: '2.88x',
    source: S.samsungPimHc35,
    note: 'Slide 15, T5-large with DeepSpeed MoE layers moved to PIM, against GPU clusters with ordinary HBM.',
  },
];

export function ComputeInMemory() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Do the arithmetic where the bytes live and cut the energy spent moving them: what Samsung measured, which parts are built, and the standard to watch"
          >
            Compute-in-Memory: PIM and In-Memory Accelerators
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>What compute-in-memory is.</strong> Compute-in-memory (CIM) puts arithmetic
            units inside or beside a memory array, so an operation runs where its operands
            already sit and only the result travels. Processing-in-memory (PIM) is the same idea
            built into a DRAM chip. The case for it rests on one number: fetching an operand from
            DRAM costs about 200 times the energy of the multiply-accumulate (MAC) that uses it,
            against 6 times from an on-chip buffer and 1 times from a register file.
            <Cite
              s={S.samsungPimHc35}
              kind="vendor-claim"
              note="Slide 3, normalized energy per MAC by operand source: register file 1x, neighbouring processing element 2x, 100 to 500 kB buffer 6x, DRAM 200x. Samsung cites Eyeriss (ISCA 2016); the Eyeriss paper itself was not read for this section."
            />
          </Box>
          <Box variant="p">
            <strong>Why it matters for inference.</strong> Decode at small batch runs mostly
            general matrix-vector multiplies (GEMV), which read every weight once per step and, at
            batch 1, use it for one MAC. Samsung profiled GEMV at 60 to 80% of generation latency
            for GPT-J 6B on an A100.
            <Cite
              s={S.samsungPimHc35}
              kind="vendor-claim"
              note="Slide 7: 'GEMV portion can be 60-80% of total generation latency, which are the target of PIM/PNM'. Profiled with DeepSpeed, GPT-J 6B, FP16, on an A100."
            />{' '}
            Wider HBM (High Bandwidth Memory) buses and more stacks move those bytes faster (see{' '}
            <em>HBM and the Bandwidth Wall</em>). CIM moves them a shorter distance.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Where the energy goes on each path, and why the bandwidth wall moves out by a fixed ratio instead of disappearing"
          >
            What the architecture changes
          </Header>
        }
      >
        <SpaceBetween size="m">
          <CimDiagram />
          <Box variant="p">
            In the conventional path every operand crosses the bus to the compute unit and the
            result crosses back, so the energy of each operation is mostly the trip. In-bank units
            read operands at the bank&apos;s internal bandwidth and send only results out. On
            Samsung&apos;s Aquabolt-XL the bank-level units see 4.92 TB/s where the host sees
            1.23 TB/s, 4 times as much.
            <Cite
              s={S.samsungPimHc33}
              kind="vendor-claim"
              note="'Off-chip and on-chip PIM compute bandwidth is 1.23 TB/s and 4.92 TB/s, respectively.'"
            />{' '}
            That ratio is how far the bandwidth wall moves, and every operator the memory cannot
            run still crosses the bus at the host&apos;s rate.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="A drop-in HBM2 part that an unmodified memory controller drives, and the gains Samsung measured on GPU, FPGA and cluster hosts"
          >
            Samsung HBM2-PIM (Aquabolt-XL)
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Samsung built HBM2-PIM by modifying its Aquabolt HBM2 design and calls it &quot;the
            first demonstrator vehicle of PIM&quot;. Each bank gets a programmable unit at its I/O
            boundary: a 16-lane FP16 (16-bit floating point) SIMD (single instruction, multiple
            data) array of multipliers and adders. The part keeps Aquabolt&apos;s form factor and
            timing. In PIM mode, ordinary DRAM read and write commands step a small program stored
            in each unit, so an unmodified HBM controller drives it; Samsung validated it that way
            with a GPU and an FPGA (field-programmable gate array).
            <Cite
              s={S.samsungPimHc33}
              kind="vendor-claim"
              note="'DRAM RD/WR command triggers execution of a PIM instruction in PIM mode'; 'drop-in replacement of JEDEC-specification compliant Aquabolt HBM2'; 'Validated fabricated HBM-PIM in system with unmodified HBM controller'."
            />{' '}
            Adopting it is therefore a memory and software change, with no new memory controller in
            the accelerator.
          </Box>
          <Box variant="p">
            Samsung measured 8.9x on a GEMV microkernel and 3.5x on speech recognition with a GPU
            host, and 2.54x on an LSTM (long short-term memory) layer with a Xilinx Alveo U280
            FPGA host.
            <Cite
              s={S.aquaboltIeeeMicro}
              kind="measured"
              note="Samsung-authored paper, so these are Samsung's own measurements; no independent replication was located. The Hot Chips 33 slides give 11.2x for the GEMV microkernel on the GPU system. The microkernel gain exceeds the 4x internal-to-external bandwidth ratio; the abstract read for this section does not say why."
            />
            <Cite
              s={S.samsungPimHc33}
              kind="vendor-claim"
              note="Alveo U280 slide: GEMV 2.82x, Add 2.85x, LSTM 2.54x."
            />
          </Box>

          <Box variant="h3">Transformer and MoE results</Box>
          <Box variant="p">
            Samsung ran transformer and MoE (mixture of experts) inference on AMD MI100 GPUs built
            with HBM-PIM, in a 96-GPU research cluster of 12 nodes on 200G InfiniBand. Each figure
            compares the same GPUs with ordinary HBM, and the GPT-J runs take 32 input tokens.
            <Cite
              s={S.samsungPimHc35}
              kind="vendor-claim"
              note="Slide 13: 96 MI100-PIM GPUs, 8 per node, 12 nodes on a 200G InfiniBand network, 24 GB (4 stacks) per GPU."
            />
          </Box>
          <Table
            variant="embedded"
            wrapLines
            columnDefinitions={[
              {
                id: 'run',
                header: 'Run on MI100-PIM',
                cell: (r) => (
                  <>
                    {r.run}
                    <Cite s={r.source} kind="vendor-claim" note={r.note} />
                  </>
                ),
              },
              { id: 'speedup', header: 'Speed-up', cell: (r) => r.speedup },
              { id: 'energy', header: 'Energy efficiency', cell: (r) => r.energy },
            ]}
            items={pimResults}
          />
          <Box variant="p">
            GPT-J&apos;s gain grows as the output lengthens from 64 to 256 tokens, which is what a
            decode-side speed-up predicts: more of the run is GEMV. The MoE gain shrinks from 2.71x
            to 2.06x as the cluster doubles from 32 to 64 GPUs. Only the expert feed-forward layers
            run in PIM, so the gain is capped by their share of each step; the router and the
            traffic between GPUs do not speed up.
            <Cite
              s={S.samsungPimHc35}
              kind="vendor-claim"
              note="Slide 14: DeepSpeed MoE replaces the T5LayerFF layers, and the MoE layers call Samsung's PIM library; experts are spread across GPUs, one process per GPU, over the ROCm collective library."
            />{' '}
            These are 2023 results on Samsung&apos;s own cluster, and no independent replication
            was located during this research.
          </Box>
          <ExpandableSection headerText="Why CIM suits MoE at small batch">
            <Box variant="p">
              An MoE layer reads only the weights of the experts each token is routed to:
              DeepSeek-V3 sends each token to 8 of its 256 routed experts.
              <Cite s={S.deepseekV3Config} /> A GPU kernel already skips the other experts, so CIM
              does not change which bytes are read. It does not save capacity either: every expert
              still has to sit in memory, and Samsung&apos;s MoE run spread the experts across
              GPUs with one process per GPU, the same expert parallelism a GPU cluster uses.
              <Cite s={S.samsungPimHc35} kind="vendor-claim" note="Slide 14: 'Each process is mapped to a GPU'." />
            </Box>
            <Box variant="p">
              What CIM changes is the cost of each active-expert byte: how far it travels and at
              what bandwidth. At small batch each expert sees few tokens (with 8 of 256 experts,
              about 1/32 of the batch), so its matmul is GEMV-shaped. Each weight byte is fetched
              for one or two MACs, which is where the 200x DRAM fetch cost dominates and the 4x
              in-bank bandwidth pays.
              <Cite
                s={S.deepseekV3Config}
                kind="derived"
                note="8 / 256 = 1/32: a batch of 32 gives each expert about one token per step."
              />{' '}
              As batch grows, each weight byte serves more tokens, its fetch cost is shared across
              them, and the advantage narrows. See <em>Roofline and Arithmetic Intensity</em> and{' '}
              <em>Mixture of Experts and Sparse Activation</em>.
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Two more built designs to evaluate, and the fast-small plus slow-large memory split that decides what a model gets from them"
          >
            In-memory accelerators: d-Matrix Corsair and SK hynix AiMX
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            d-Matrix Corsair is a PCIe (PCI Express) Gen5 x16 inference card built from 2,048
            digital in-memory compute (DIMC) cores. It carries two memories: 2 GB of
            &quot;Performance Memory&quot; at 150 TB/s and up to 256 GB of &quot;Capacity
            Memory&quot; at 400 GB/s, in a 600 W card.
            <Cite s={S.dmatrixCorsairBrief} kind="vendor-claim" /> The 375x bandwidth gap between
            the two tiers is the design: compute sits in a small fast tier and capacity in a large
            slow one, so the question to ask of any model is how much of each step&apos;s working
            set fits in the 2 GB.
            <Cite s={S.dmatrixCorsairBrief} kind="derived" note="150 TB/s / 400 GB/s = 375." />{' '}
            d-Matrix markets Corsair as a product, and its product page gives no deployment scale.
            <Cite s={S.dmatrixProduct} /> <em>High Bandwidth Flash</em> applies the same
            fast-small plus slow-large split one tier further down.
          </Box>
          <Box variant="p">
            SK hynix showed AiMX at CES 2026: an accelerator card prototype built on GDDR6-AiM
            chips (sixth-generation graphics DDR memory with Accelerator-in-Memory) specialized
            for large language models.
            <Cite
              s={S.skhynixCes2026}
              kind="roadmap"
              note="Footnote: 'Accelerator-in-Memory based Accelerator (AiMX): SK hynix's accelerator card prototype featuring a GDDR6-AiM chip which is specialized for large language models (LLMs)'."
            />
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What you gain and what you give up, in numbers where they exist, before you evaluate a CIM part"
          >
            The CIM bet, evaluated
          </Header>
        }
      >
        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <Box variant="h3">What the bet wins</Box>
            <ul>
              <li>
                Energy per operation falls by more than half on GEMV-class kernels: Samsung
                measured over 60% less on its GPU system.
                <Cite
                  s={S.aquaboltIeeeMicro}
                  kind="measured"
                  note="'reduced energy consumption by over 60%'. Samsung-authored paper, so this is Samsung's own measurement."
                />
                <Cite
                  s={S.samsungHbmPimRelease}
                  kind="vendor-claim"
                  note="The 2021 launch release claims 'more than 70%'."
                />
              </li>
              <li>
                In-bank units see 4x the host&apos;s bandwidth on Aquabolt-XL, and Samsung&apos;s
                LPDDR-PIM concept claims up to 8x: the wall moves out by that ratio and does not
                disappear.
                <Cite s={S.samsungPimHc33} kind="vendor-claim" />
                <Cite
                  s={S.samsungPimHc35}
                  kind="vendor-claim"
                  note="Slide 20: 'Utilize up to 8x higher in-DRAM bandwidth by multi-bank parallel operation'."
                />
              </li>
            </ul>
          </div>
          <div>
            <Box variant="h3">What the bet costs</Box>
            <ul>
              <li>
                A narrow operator set: Aquabolt-XL multiplies and adds in FP16, and everything else
                runs on the host.
                <Cite s={S.samsungPimHc33} kind="vendor-claim" />
              </li>
              <li>
                Vendor software: Samsung reaches PyTorch and TensorFlow through its own PIM runtime
                library and compiler, and d-Matrix ships its own stack, Aviator. This research
                located no upstream framework support.
                <Cite
                  s={S.samsungPimHc35}
                  kind="vendor-claim"
                  note="Slide 16: PIM Runtime Library and PIM AI Compiler under PyTorch and TensorFlow."
                />
                <Cite s={S.dmatrixProduct} />
              </li>
            </ul>
          </div>
        </ColumnLayout>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What to plan on today, and the standard that would let PIM come from more than one memory maker"
          >
            Where CIM stands, and what to watch
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            This research located no production inference fleet built on CIM. Samsung&apos;s LLM
            (large language model) results come from its own MI100-PIM GPUs and research cluster,
            <Cite s={S.samsungPimHc35} kind="vendor-claim" /> SK hynix labels AiMX a prototype,
            <Cite s={S.skhynixCes2026} kind="roadmap" /> and d-Matrix&apos;s product page gives no
            deployment scale.
            <Cite s={S.dmatrixProduct} /> Sizing an inference fleet today still runs on the levers
            in <em>HBM and the Bandwidth Wall</em>.
          </Box>
          <Box variant="p">
            The marker to watch is a standard. JEDEC (Joint Electron Device Engineering Council)
            is &quot;nearing completion&quot; of an LPDDR6 (Low-Power DDR6) processing-in-memory
            standard aimed at edge and data-center inference.
            <Cite
              s={S.jedecLpddr6Pim}
              kind="roadmap"
              note="2026-04-22: 'JEDEC is also nearing completion of a standard for LPDDR6 Processing-in-Memory (LPDDR6 PIM) technology ... intended to address the rapidly increasing performance and energy-efficiency requirements of edge and data-center inference'."
            />{' '}
            Its low-power memory committee lists the LPDDR6 standard itself (JESD209-6, July 2025)
            and no PIM standard yet.
            <Cite s={S.jedecJc426} /> Samsung&apos;s and d-Matrix&apos;s parts are programmed
            through their makers&apos; own software; a standard moves PIM from single-vendor parts toward one
            interface that several memory makers can build to. When it is published, ask your
            accelerator and SoC (system on chip) vendors whether their LPDDR6 parts implement it.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
