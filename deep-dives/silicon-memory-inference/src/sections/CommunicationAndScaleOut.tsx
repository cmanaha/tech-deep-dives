import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Alert from '@cloudscape-design/components/alert';
import Link from '@cloudscape-design/components/link';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { CommunicationStack } from '../components/CommunicationStack';

export function CommunicationAndScaleOut() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="What carries data between accelerators when the workload exceeds one chip"
          >
            Communication and scale-out
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Why this section.</strong> Sections 5 and 7 of the kernel
            lifecycle (operand staging, retire and return) end at the chip
            boundary on a single-accelerator workload. For everything else —
            multi-GPU training, disaggregated serving, MoE expert parallelism,
            cross-rack scale-out — there is a transport layer that carries
            tensors between accelerators. This section walks the layers of
            that stack.
          </Box>
          <Box variant="p">
            <strong>The four kinds of traffic.</strong> Production AI systems
            generate four distinct communication patterns: collective
            operations during training (allreduce, allgather), expert
            all-to-all during MoE inference, KV cache transport during
            disaggregated serving, and host-coordination control traffic.
            Each has its own bandwidth and latency profile, and the stack
            optimizes accordingly.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Application down to wire"
          >
            The stack
          </Header>
        }
      >
        <SpaceBetween size="m">
          <CommunicationStack />
          <Box variant="p">
            The application layer issues high-level operations
            (<code>torch.distributed.all_reduce</code>, NKI collectives, NIXL
            transfers). The collective library decomposes those into
            transport-level sends and receives, applies optimizations
            (ring, tree, reduce-scatter + allgather), and submits them. The
            transport layer carries the bytes — EFA SRD on AWS, NVLink
            within an UltraServer, NeuronLink-v3 between Trainium chips. The
            hardware layer provides the physical link, encryption, and
            multi-path resilience.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The library that handles most NVIDIA collectives"
          >
            NCCL — and why NIXL was added next to it
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>NCCL.</strong> NVIDIA Collective Communications Library.
            Handles allreduce, allgather, broadcast, reduce, all-to-all, and
            scatter / gather across NVLink and InfiniBand / EFA. NCCL is the
            workhorse for distributed training. Its core implementation
            launches a CUDA kernel for every collective — even small
            point-to-point sends — which means it consumes streaming
            multiprocessors that could otherwise be running model code.
          </Box>
          <Box variant="p">
            <strong>NIXL.</strong> NVIDIA Inference Xfer Library. Designed
            specifically for KV-cache transport in disaggregated serving and
            for inference-side data movement that should not consume SMs.
            NIXL does GPU-Direct RDMA without launching kernels — the
            transfer happens on the network adapter and DMA engines, leaving
            the SMs free to run attention. NIXL has a libfabric plugin that
            uses EFA as the validated transport on AWS
            ({' '}
            <Link external href="https://github.com/ai-dynamo/nixl">
              NIXL repo
            </Link>
            , accessed 2026-03-22).
          </Box>
          <Alert type="info" header="Why both exist">
            NCCL is collective-shaped: many GPUs participate, the operation
            is bandwidth-heavy, and the SM cost is amortized across the work.
            NIXL is point-to-point-shaped: a sender and a receiver, the
            operation is latency-sensitive, and SM consumption is wasted
            when both sides are also running model kernels. Production
            deployments use NCCL for training collectives and NIXL for
            KV-cache handoff in disaggregated inference.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The AWS transport beneath both libraries"
          >
            EFA and SRD
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            EFA (Elastic Fabric Adapter) is the AWS network interface for
            GPU and Trainium instances. Underneath the libfabric API, EFA
            uses SRD (Scalable Reliable Datagram) — AWS&apos;s
            multi-path-spraying transport designed for datacenter networks.
            SRD sprays packets across up to 64 paths and reassembles
            out-of-order at the receiver, which eliminates head-of-line
            blocking on a single congested route. EFA carries NCCL traffic
            over the libfabric interface, and NIXL uses the same EFA fabric
            via its libfabric plugin
            ({' '}
            <Link external href="https://aws.amazon.com/hpc/efa/">
              AWS EFA page
            </Link>
            , accessed 2026-04-23).
          </Box>
          <Box variant="p">
            <strong>Per-instance bandwidth.</strong> EFA bandwidth scales
            with the instance family. P5: up to 3,200 Gbps aggregate. P6e
            UltraServer (GB200): EFA v3 with higher bandwidth. Trn2 and Trn2
            UltraServer ship EFA v3 alongside NeuronLink-v3. The exact
            per-family numbers track the EC2 instance pages.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The Trainium-side story"
          >
            Neuron CC-Cores and NeuronLink-v3
          </Header>
        }
      >
        <Box variant="p">
          Trainium ships dedicated silicon for collectives — the CC-Cores
          (Section 17). On Trainium2 there are 16 CC-Cores per chip,
          handling on-chip, on-host, and cross-host collectives without
          contending with the NeuronCores that run model compute. NeuronLink
          -v3 is the chip-to-chip fabric: 1.28 TB/s per chip intra-node, 256
          GB/s per chip inter-instance. The Trn2 UltraServer composes 64
          chips into a 3D Torus topology that gives the same coherent-domain
          property NVL72 has on the GPU side, sized for tensor-parallel
          and expert-parallel deployments.
        </Box>
        <Alert type="warning" header="The MoE all-to-all-v gap">
          Trainium MoE NKI kernels shipped in Neuron 2.27.0; the
          <code> torch.all_to_all_vdev_2d</code> primitive — the
          collective most directly required for MoE — is documented as
          roadmap as of Neuron 2.29. Today&apos;s Neuron MoE EP path uses
          All-Gather rather than All-to-All-v. This is a citeable gap
          relative to NVIDIA&apos;s Wide-EP over MNNVL, and worth knowing
          on stage and in customer conversations.
        </Alert>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The MoE-specific collective layer"
          >
            DeepEP and the MoE all-to-all
          </Header>
        }
      >
        <ExpandableSection headerText="What DeepEP does">
          <Box variant="p">
            DeepEP is DeepSeek&apos;s open-source library for high-throughput
            MoE all-to-all dispatch and combine. It implements a custom
            all-to-all primitive optimized for the MoE case where each token
            is routed to a small subset of experts. Reported numbers on the
            DeepEP repo: 153 GB/s NVLink intranode bandwidth and 51 GB/s
            RDMA bandwidth at EP=64 on H800 / CX7
            ({' '}
            <Link external href="https://github.com/deepseek-ai/DeepEP">
              DeepEP repo
            </Link>
            , accessed 2026-04-23). SGLang exposes DeepEP as one of several
            <code> --moe-a2a-backend</code> options. The TRT-LLM Wide-EP
            path uses MNNVL but follows the same architectural pattern.
          </Box>
        </ExpandableSection>
      </Container>
    </SpaceBetween>
  );
}
