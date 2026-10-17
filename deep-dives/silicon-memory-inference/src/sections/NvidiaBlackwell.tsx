import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Table from '@cloudscape-design/components/table';
import Link from '@cloudscape-design/components/link';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { BlackwellDieDiagram } from '../components/BlackwellDieDiagram';
import { Cite } from '../components/Cite';
import { S } from '../sources/NvidiaBlackwell';

interface SpecRow {
  spec: string;
  b200: React.ReactNode;
  b300: React.ReactNode;
}

const nvlinkNote =
  'NVIDIA rates NVLink 5 at 1.8 TB/s per GPU bidirectional (18 links x 100 GB/s); 900 GB/s each way is half of that.';

const specRows: SpecRow[] = [
  {
    spec: 'Construction',
    b200: (
      <>
        Two reticle-limited dies joined by NV-HBI at 10 TB/s; 208B transistors, TSMC 4NP
        <Cite s={S.blackwellArchitecture} />
      </>
    ),
    b300: (
      <>
        Same two-die design, up to 160 SMs
        <Cite
          s={S.blackwellUltraBlog}
          note="NVIDIA notes that available SM count and HBM capacity vary by SKU."
        />
      </>
    ),
  },
  {
    spec: 'Compute capability',
    b200: (
      <>
        10.0 (<code>sm_100</code>)
        <Cite s={S.cudaGpus} />
      </>
    ),
    b300: (
      <>
        10.3 (<code>sm_103</code>)
        <Cite s={S.cudaGpus} />
      </>
    ),
  },
  {
    spec: 'HBM per GPU',
    b200: (
      <>
        Up to 180 GB HBM3e
        <Cite s={S.blackwellTuningGuide} />
        <Cite s={S.dgxB200} />
      </>
    ),
    b300: (
      <>
        288 GB HBM3e in eight 12-high stacks
        <Cite s={S.blackwellUltraBlog} />
      </>
    ),
  },
  {
    spec: 'GPU memory as AWS lists it',
    b200: (
      <>
        179 GiB per GPU on P6-B200
        <Cite s={S.ec2AcceleratedSpecs} />
      </>
    ),
    b300: (
      <>
        268 GiB per GPU on P6-B300
        <Cite s={S.ec2AcceleratedSpecs} />
      </>
    ),
  },
  {
    spec: 'HBM bandwidth per GPU',
    b200: (
      <>
        8 TB/s
        <Cite
          s={S.dgxB200}
          kind="derived"
          note="DGX B200 lists 64 TB/s of HBM3e bandwidth across 8 GPUs; 64 / 8 = 8 TB/s."
        />
      </>
    ),
    b300: (
      <>
        8 TB/s
        <Cite s={S.blackwellUltraBlog} />
      </>
    ),
  },
  {
    spec: 'NVLink 5 per GPU',
    b200: (
      <>
        1.8 TB/s bidirectional (900 GB/s each way)
        <Cite s={S.hgxPage} />
        <Cite s={S.blackwellUltraBlog} note={nvlinkNote} />
      </>
    ),
    b300: (
      <>
        1.8 TB/s bidirectional (900 GB/s each way)
        <Cite s={S.blackwellUltraBlog} note={nvlinkNote} />
      </>
    ),
  },
  {
    spec: 'Tensor Core',
    b200: (
      <>
        5th generation, <code>tcgen05.mma</code>
        <Cite s={S.ptxIsa} />
      </>
    ),
    b300: (
      <>
        5th generation, <code>tcgen05.mma</code>
        <Cite s={S.ptxIsa} />
      </>
    ),
  },
  {
    spec: 'TMEM per SM',
    b200: (
      <>
        256 KB
        <Cite
          s={S.ptxIsa}
          note="512 columns x 128 rows of 32-bit cells on sm_100a and sm_100f, which is 256 KB."
        />
      </>
    ),
    b300: (
      <>
        256 KB
        <Cite s={S.blackwellUltraBlog} />
      </>
    ),
  },
  {
    spec: 'NVFP4 per GPU, dense / sparse',
    b200: (
      <>
        9 / 18 PFLOPS (HGX B200); 10 / 20 (GB200 NVL72)
        <Cite s={S.hgxPage} kind="derived" note="HGX B200: 144 sparse | 72 dense PFLOPS for 8 GPUs." />
        <Cite
          s={S.gb200Nvl72}
          kind="derived"
          note="GB200 NVL72: 1,440 sparse | 720 dense PFLOPS for 72 GPUs."
        />
      </>
    ),
    b300: (
      <>
        13.5 / 18 PFLOPS (HGX B300); 15 / 20 (GB300 NVL72)
        <Cite s={S.hgxPage} kind="derived" note="HGX B300: 144 sparse | 108 dense PFLOPS for 8 GPUs." />
        <Cite
          s={S.gb300Nvl72}
          kind="derived"
          note="GB300 NVL72: 1,440 sparse | 1,080 dense PFLOPS for 72 GPUs."
        />
      </>
    ),
  },
  {
    spec: 'INT8 Tensor Core, 8-GPU HGX board (sparse)',
    b200: (
      <>
        72 POPS
        <Cite s={S.hgxPage} note="Sparse specification; NVIDIA gives dense as half the figure." />
      </>
    ),
    b300: (
      <>
        3 POPS
        <Cite s={S.hgxPage} note="Sparse specification; NVIDIA gives dense as half the figure." />
      </>
    ),
  },
  {
    spec: 'FP64, 8-GPU HGX board',
    b200: (
      <>
        296 TFLOPS
        <Cite s={S.hgxPage} />
      </>
    ),
    b300: (
      <>
        10 TFLOPS
        <Cite s={S.hgxPage} />
      </>
    ),
  },
  {
    spec: 'AWS',
    b200: (
      <>
        P6-B200; P6e-GB200 UltraServer
        <Cite s={S.ec2AcceleratedSpecs} />
      </>
    ),
    b300: (
      <>
        P6-B300; P6e-GB300 UltraServer
        <Cite
          s={S.ec2AcceleratedSpecs}
          note="Lists p6-b300.48xlarge. P6e-GB300 does not appear on this page; the AWS P6e-GB300 announcement covers it."
        />
        <Cite s={S.p6eGb300Ga} />
      </>
    ),
  },
];

export function NvidiaBlackwell() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="What Blackwell changes for your kernels and your capacity plan, and how to choose between B200 and B300"
          >
            NVIDIA Blackwell: B200 and B300
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>What Blackwell is.</strong> Blackwell is the NVIDIA data-center GPU
            generation that follows Hopper (see <em>NVIDIA Hopper</em>). Each GPU is two
            reticle-limited dies joined by NV-HBI (NVIDIA High-Bandwidth Interface) at 10 TB/s
            and run as one CUDA device.
            <Cite s={S.blackwellArchitecture} /> Each streaming multiprocessor (SM) gains Tensor
            Memory (TMEM), 256 KB that holds the Tensor Core&apos;s running sum.
            <Cite s={S.blackwellUltraBlog} />
            <Cite s={S.ptxIsa} /> NVFP4, NVIDIA&apos;s 4-bit floating-point format, stores
            weights about 1.8x smaller than FP8.
            <Cite s={S.nvfp4Blog} />
          </Box>
          <Box variant="p">
            <strong>Why it matters for inference.</strong> B300, the Blackwell Ultra part,
            carries 288 GB of HBM3e (High Bandwidth Memory) per GPU against H200&apos;s 141 GB
            <Cite s={S.blackwellUltraBlog} />
            <Cite s={S.h200Page} />, at 8 TB/s, with 15 PFLOPS of dense NVFP4 per GPU.
            <Cite
              s={S.blackwellUltraBlog}
              note="NVIDIA's Blackwell Ultra figure. The 8-GPU HGX B300 board rates 108 PFLOPS dense, 13.5 per GPU."
            />{' '}
            For mixture-of-experts (MoE) models near a trillion parameters, the capacity step
            alone can be the difference between serving from one 8-GPU node and sharding across
            two. At FP8 such a model is about 1 TB of weights before any KV (key-value) cache; an
            8-GPU H200 node on AWS (P5en) holds 8 x 141 GiB and an 8-GPU B300 node (P6-B300)
            holds 8 x 268 GiB.
            <Cite
              s={S.ec2AcceleratedSpecs}
              kind="derived"
              note="1 trillion parameters x 1 byte at FP8 is about 1 TB. Per-GPU memory as AWS lists it for p5en.48xlarge and p6-b300.48xlarge."
            />
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Why 208 billion transistors on two dies still program as one GPU"
          >
            The two-die GPU
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A lithography reticle caps how large one die can be. Blackwell reaches 208 billion
            transistors on TSMC 4NP by building each GPU from two reticle-limited dies joined by
            NV-HBI, a 10 TB/s chip-to-chip link.
            <Cite s={S.blackwellArchitecture} /> CUDA sees one device, with one device ID, one
            address space and an L2 cache that both dies share with fully coherent memory
            access, so the programming model has no NUMA (non-uniform memory access) split between
            the dies.
            <Cite s={S.blackwellUltraBlog} /> B300 keeps the design and fills it with up to 160
            SMs and eight 12-high HBM3e stacks.
            <Cite
              s={S.blackwellUltraBlog}
              note="NVIDIA notes that available SM count and HBM capacity vary by SKU."
            />{' '}
            NVIDIA does not state how the stacks split between the two dies.
          </Box>
          <BlackwellDieDiagram />
          <Box variant="small" color="text-body-secondary">
            Dies, NV-HBI, transistor count and process
            <Cite s={S.blackwellArchitecture} />; B300 SMs, HBM stacks and bandwidth, TMEM,
            shared L2 and NVLink 5
            <Cite s={S.blackwellUltraBlog} />; B200 capacity and the 228 KB SMEM
            <Cite s={S.blackwellTuningGuide} />; B200 bandwidth
            <Cite s={S.dgxB200} kind="derived" />; operand placement and single-thread issue
            <Cite s={S.ptxIsa} />.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Where the accumulator lives on Blackwell, and why a Hopper wgmma kernel needs a rewrite to use it"
          >
            TMEM and the fifth-generation Tensor Core
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>TMEM holds the accumulator.</strong> On Hopper, the running sum of a matrix
            multiply lives in the registers of the warps that issue <code>wgmma</code>.
            <Cite s={S.ptxIsa} /> On Blackwell it lives in Tensor Memory, 256 KB per SM
            <Cite s={S.blackwellUltraBlog} />, and the fifth-generation Tensor Core instruction{' '}
            <code>tcgen05.mma</code> has single-thread semantics: one thread launches the whole
            MMA (matrix multiply-accumulate), where <code>mma.sync</code> and{' '}
            <code>wgmma</code> are collective instructions. Operand B always streams from shared
            memory (SMEM); operand A comes from SMEM or TMEM.
            <Cite s={S.ptxIsa} /> Inside the SM, TMEM is the new capacity: SMEM stays at
            Hopper&apos;s 228 KB per SM, within the same 256 KB of combined L1 and SMEM.
            <Cite s={S.blackwellTuningGuide} />
          </Box>
          <Box variant="p">
            <strong>What it means for your kernels.</strong> <code>wgmma</code> requires{' '}
            <code>sm_90a</code>
            <Cite s={S.ptxIsa} />, so a Hopper kernel built on it has no Blackwell build and
            needs a <code>tcgen05</code> rewrite. Kernel libraries add these paths release by
            release: CUTLASS (CUDA Templates for Linear Algebra Subroutines) adds Blackwell MoE
            GEMM (general matrix multiply) kernels tuned for low-latency inference in example 92,
            from v4.2.0.
            <Cite s={S.cutlassChangelog} /> For a worked Blackwell MoE kernel,{' '}
            <Link external href={S.cutlassExample92.url}>
              read example 92 at v4.8.0
            </Link>
            <Cite s={S.cutlassExample92} />. <em>NVIDIA Compilers and Kernel Tooling</em> covers
            the CUTLASS, Triton and PyTorch Inductor side.
          </Box>
          <Box variant="p">
            <strong>NVFP4.</strong> NVFP4 is a 4-bit float (E2M1: two exponent bits, one mantissa
            bit) with two levels of scale: an E4M3 scale factor for each block of 16 values and an
            FP32 scale for the whole tensor. Weights take about 3.5x less memory than FP16 and
            about 1.8x less than FP8.
            <Cite s={S.nvfp4Blog} /> For MoE, a smaller model fits on fewer GPUs, which lowers
            the expert-parallel degree and shrinks the all-to-all traffic the fabric carries (see{' '}
            <em>Mixture of Experts and Sparse Activation</em>).
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The spec sheet with every FP4 figure split into dense and sparse, so it lines up with a vendor quote"
          >
            B200 and B300 side by side
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Table
            items={specRows}
            columnDefinitions={[
              { id: 'spec', header: 'Spec', cell: (r) => r.spec, minWidth: 130 },
              { id: 'b200', header: 'B200', cell: (r) => r.b200 },
              { id: 'b300', header: 'B300 (Blackwell Ultra)', cell: (r) => r.b300 },
            ]}
            variant="embedded"
            wrapLines
          />
          <ExpandableSection headerText="Where the per-GPU NVFP4 figures come from">
            <Box variant="p">
              The HGX and NVL72 pages give NVFP4 per board or per rack as a sparse | dense pair.
              The table divides each pair by the GPU count.
            </Box>
            <ul>
              <li>
                HGX B200, 8 GPUs: 144 | 72 PFLOPS; HGX B300, 8 GPUs: 144 | 108 PFLOPS.
                <Cite s={S.hgxPage} />
              </li>
              <li>
                GB200 NVL72, 72 GPUs: 1,440 | 720 PFLOPS.
                <Cite s={S.gb200Nvl72} />
              </li>
              <li>
                GB300 NVL72, 72 GPUs: 1,440 | 1,080 PFLOPS.
                <Cite s={S.gb300Nvl72} />
              </li>
            </ul>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="B300 trades INT8 and FP64 for 1.5x dense FP4: which side of that trade your model sits on"
          >
            What changes between B200 and B300
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            B300 (Blackwell Ultra) is the same two-die design with more memory and a different
            balance of math units. These are the differences that decide where a workload
            belongs.
          </Box>
          <ul>
            <li>
              <strong>Dense NVFP4 rises 1.5x; the sparse peak stays.</strong> An 8-GPU HGX B300
              board rates 108 PFLOPS of dense NVFP4 against HGX B200&apos;s 72, and both rate 144
              PFLOPS sparse.
              <Cite s={S.hgxPage} /> AWS describes P6-B300 the same way: 1.5x the FP4 compute of
              P6-B200 without sparsity, and 1.5x the GPU memory.
              <Cite s={S.p6Page} kind="vendor-claim" /> A model served dense gets the gain; a
              model already on sparse FP4 kernels sees the same peak.
            </li>
            <li>
              <strong>INT8 and FP64 drop sharply.</strong> Per 8-GPU board, INT8 Tensor Core
              throughput falls from 72 to 3 POPS (peta-operations per second, sparse) and FP64
              from 296 to 10 TFLOPS.
              <Cite s={S.hgxPage} /> In PTX (Parallel Thread Execution, NVIDIA&apos;s virtual
              instruction set), the INT8 form of <code>tcgen05.mma</code> (
              <code>.kind::i8</code>) is listed for <code>sm_100a</code> and{' '}
              <code>sm_110a</code> only, and B300&apos;s <code>sm_103</code> is not on that list.
              <Cite s={S.ptxIsa} /> Run INT8-quantized models and FP64 work on B200, or move INT8
              models to FP8 or NVFP4 before targeting B300; FP8 holds at 72 PFLOPS sparse on both
              boards.
              <Cite s={S.hgxPage} />
            </li>
            <li>
              <strong>A different compute capability.</strong> B200 is 10.0 (
              <code>sm_100</code>) and B300 is 10.3 (<code>sm_103</code>).
              <Cite s={S.cudaGpus} /> Code built for the family target{' '}
              <code>compute_100f</code> runs on 10.0, 10.3 and 10.7 (Rubin)
              <Cite s={S.computeCapabilities} />, so target it when one build has to cover the
              fleet.
            </li>
            <li>
              <strong>Faster softmax.</strong> B300 doubles special function unit (SFU)
              throughput for the instructions attention uses, which NVIDIA says delivers
              &quot;up to 2x faster attention-layer compute compared to Blackwell GPUs&quot;.
              <Cite s={S.blackwellUltraBlog} kind="vendor-claim" />
            </li>
            <li>
              <strong>Twice the network on AWS.</strong> P6-B300 carries 6.4 Tbps of EFA
              (Elastic Fabric Adapter) bandwidth against P6-B200&apos;s 3.2 Tbps.
              <Cite s={S.p6Page} />
            </li>
          </ul>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What ships after Blackwell, and why a compute_100f build already runs on it"
          >
            After Blackwell: Vera Rubin
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Vera Rubin, the generation after Blackwell, is ramping into full production, with
            racks running at partners including CoreWeave, Google Cloud, Microsoft Azure, Oracle
            Cloud Infrastructure and Nebius.
            <Cite s={S.nvidiaQ2Fy27} /> Each Rubin GPU carries 288 GB of HBM4 and rates 35
            PFLOPS of dense NVFP4 (50 sparse).
            <Cite s={S.veraRubinNvl72} /> Rubin is compute capability 10.7, in the same family
            as B200 and B300, so code built for <code>compute_100f</code> runs on it; it raises
            shared memory to 328 KB per SM.
            <Cite s={S.computeCapabilities} />
          </Box>
          <Box variant="p">
            As of October 2026 the EC2 instance-type specification lists no Rubin instance.
            <Cite s={S.ec2AcceleratedSpecs} /> AWS plans to deploy Blackwell Ultra, Rubin and
            Rubin Ultra GPUs in 2027-2028.
            <Cite s={S.awsNvidia2026} kind="roadmap" /> Rubin Ultra and Feynman, the
            architecture NVIDIA names after Rubin, are roadmap parts.
            <Cite s={S.gtc2026} kind="roadmap" />
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Which workloads gain from Blackwell, and what to check before moving one off Hopper"
          >
            Where Blackwell fits
          </Header>
        }
      >
        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <Box variant="h3">Gains on Blackwell</Box>
            <ul>
              <li>
                MoE inference near a trillion parameters, where capacity and NVFP4 cut the GPU
                count. The 72-GPU NVLink domain of the P6e UltraServers is covered in{' '}
                <em>Grace-Blackwell and UltraServer</em>.
              </li>
              <li>
                Matmul-dominated kernels that map onto <code>tcgen05.mma</code> and TMEM.
              </li>
              <li>Long-context decode that needs HBM capacity for the KV cache.</li>
              <li>
                Models that hold accuracy at NVFP4, which stores weights about 1.8x smaller than
                FP8.
                <Cite s={S.nvfp4Blog} />
              </li>
            </ul>
          </div>
          <div>
            <Box variant="h3">Getting the move right</Box>
            <ul>
              <li>
                Rewrite Hopper kernels built on <code>wgmma</code>, which requires{' '}
                <code>sm_90a</code>.
                <Cite s={S.ptxIsa} /> Confirm that each kernel on the critical path has a
                Blackwell build, and note the library release it landed in.
              </li>
              <li>
                Keep INT8-quantized and FP64 workloads on B200, or move INT8 models to FP8 or
                NVFP4 before targeting B300.
              </li>
              <li>
                If the model already fits in an H200&apos;s 141 GB
                <Cite s={S.h200Page} />, price Hopper first: AWS cut P5en (H200) On-Demand prices
                25% from the May 31, 2025 baseline.
                <Cite s={S.gpuPriceCut} /> See <em>NVIDIA Hopper</em>.
              </li>
              <li>
                Validate accuracy at NVFP4 before committing a model to it (see{' '}
                <em>Quantization and Precision</em>).
              </li>
            </ul>
          </div>
        </ColumnLayout>
      </Container>
    </SpaceBetween>
  );
}
