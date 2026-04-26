import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Alert from '@cloudscape-design/components/alert';
import Link from '@cloudscape-design/components/link';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { Nvl72Diagram } from '../components/Nvl72Diagram';

export function GraceBlackwellUltraServer() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="The single-NVLink-domain rack — sized for MoE all-to-all"
          >
            Grace-Blackwell and the NVL72 UltraServer
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>What Grace-Blackwell is.</strong> A Superchip-class module pairing
            an NVIDIA Grace CPU with one or more Blackwell GPUs over NVLink-C2C, all
            inside a single coherent NVLink domain. The CPU runs orchestration,
            tokenization, KV-cache scheduling, and any host-side logic; the GPU runs
            the model. NVLink-C2C delivers 900 GB/s of coherent bandwidth between CPU
            and GPU — the same protocol that connects GPUs to each other in the rack.
          </Box>
          <Box variant="p">
            <strong>What NVL72 is.</strong> A rack-scale UltraServer that places 72
            Blackwell GPUs and 36 Grace CPUs into a single NVLink domain. Every GPU
            reaches every other GPU at 1.8 TB/s through the NVSwitch fabric;
            aggregate NVLink bandwidth is 130 TB/s. Aggregate GPU memory is 13.4 TB
            HBM3e; aggregate CPU memory is 17.3 TB LPDDR5X
            ({' '}
            <Link external href="https://www.nvidia.com/en-us/data-center/gb200-nvl72/">
              NVIDIA GB200 NVL72 product page
            </Link>
            , accessed 2026-04-23). The next generation, GB300 NVL72, raises GPU memory
            to 20 TB and FP4 PFLOPS to 1,440 ({' '}
            <Link external href="https://www.nvidia.com/en-us/data-center/gb300-nvl72/">
              NVIDIA GB300 NVL72
            </Link>
            , same access date).
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="One coherent fabric, 72 GPUs, MoE-sized"
          >
            The rack
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Nvl72Diagram />
          <Box variant="p">
            The NVSwitch fabric in NVL72 provides full bisection bandwidth — every GPU
            talks to every other GPU at the same 1.8 TB/s rate, no over-subscription.
            For traditional collective patterns (all-reduce, all-gather) this is
            already strong. The architectural decision that matters more, however, is
            for MoE workloads.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="MoE-sized — by design"
          >
            Why NVL72 was sized for 72
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Alert type="info" header="The MoE-shaped fabric">
            DeepSeek-R1 has 256 routed experts and recommends EP=64 (4 experts per
            GPU) for production deployment. EP=64 fits inside one NVL72 NVLink domain
            with eight GPUs of headroom. NVIDIA&apos;s own framing is explicit: &ldquo;If
            the selected experts reside on GPUs that sit on different nodes, the
            all-to-all communication becomes bottlenecked by slower internode
            communication protocols, such as InfiniBand&rdquo;
            ({' '}
            <Link
              external
              href="https://developer.nvidia.com/blog/how-nvidia-gb200-nvl72-and-nvidia-dynamo-boost-inference-performance-for-moe-models/"
            >
              NVIDIA Technical Blog
            </Link>
            , accessed 2026-04-23). The 72-GPU domain is large enough to host
            DeepSeek-class MoE end-to-end without an InfiniBand crossing.
          </Alert>
          <Box variant="p">
            The TensorRT-LLM Wide-EP path (Section 15) uses MNNVL — Multi-Node NVLink
            — to carry expert all-to-all over the NVL72 fabric. EP &gt; 8 was
            previously rare because the NVLink domain was 8 GPUs (HGX); on NVL72 the
            domain is 72, and Wide-EP up to 64 ships in TRT-LLM v0.21.0 onward. The
            architectural choice was made specifically for MoE.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What Grace adds — and why it sits next to the GPU"
          >
            The Grace half of the Superchip
          </Header>
        }
      >
        <ColumnLayout columns={3} variant="text-grid">
          <div>
            <Box variant="h3">CPU memory — 480 GB LPDDR5X</Box>
            <Box variant="p">
              At ~500 GB/s per CPU. Soldered, not socketed. Fits in a 16 W envelope.
              Sits on the same package as the GPU; the CUDA address space spans both.
              Section 7 covered LPDDR5X economics.
            </Box>
          </div>
          <div>
            <Box variant="h3">NVLink-C2C — 900 GB/s coherent</Box>
            <Box variant="p">
              CPU-to-GPU coherent bandwidth at the same 900 GB/s rate as Hopper
              NVLink. Coherent: the GPU can read CPU memory cacheably, and vice
              versa. KV-cache offload, embedding stores, and CPU-resident host
              orchestration all benefit.
            </Box>
          </div>
          <div>
            <Box variant="h3">Arm Neoverse cores — capable host</Box>
            <Box variant="p">
              72-core Neoverse V2 host CPU (similar lineage to Graviton4). For a
              Blackwell GPU, having a full-power Arm CPU on the same package
              eliminates an entire class of host-side bottlenecks.
            </Box>
          </div>
        </ColumnLayout>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="On AWS — the P6e UltraServer family"
          >
            Grace-Blackwell on AWS
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>P6e UltraServer — GB200.</strong> The AWS variant of NVIDIA&apos;s
            NVL72 platform. 72-GPU NVLink domain, 36 Grace CPUs, NVLink-C2C
            coherent. Capacity Blocks for ML pricing applies. Targeted at frontier
            training and large-scale MoE inference workloads where the 72-GPU NVLink
            domain is the architectural feature being paid for.
          </Box>
          <Box variant="p">
            <strong>P6e UltraServer — GB300.</strong> Refresh on the next-generation
            Blackwell Ultra. Higher GPU memory (288 GB / GPU, 20 TB aggregate), higher
            FP4 PFLOPS, same NVLink topology. The right pick when the workload needs
            either the larger HBM or the FP4 throughput.
          </Box>
          <ExpandableSection headerText="Why an UltraServer is not just a bigger box">
            <Box variant="p">
              An NVL72 UltraServer is not equivalent to nine 8-GPU HGX nodes
              connected by InfiniBand. The difference is the NVLink domain boundary.
              Inside the domain, GPU-to-GPU is 1.8 TB/s and coherent; outside the
              domain, GPU-to-GPU goes over EFA / InfiniBand at much lower bandwidth
              and higher latency. The architectural value of an UltraServer is that
              workloads which previously had to be partitioned across an InfiniBand
              boundary now fit inside one NVLink domain — which is exactly what MoE
              all-to-all needed.
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
