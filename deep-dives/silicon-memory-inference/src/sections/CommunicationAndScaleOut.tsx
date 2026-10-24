import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Alert from '@cloudscape-design/components/alert';
import Link from '@cloudscape-design/components/link';
import Table from '@cloudscape-design/components/table';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { CommunicationStack } from '../components/CommunicationStack';
import { Cite } from '../components/Cite';
import { S } from '../sources/CommunicationAndScaleOut';

interface EfaRow {
  instance: string;
  accelerators: React.ReactNode;
  efa: React.ReactNode;
  generation: React.ReactNode;
}

const efaRows: EfaRow[] = [
  {
    instance: 'p5.48xlarge',
    accelerators: (
      <>
        8 H100
        <Cite s={S.ec2AcceleratedSpecs} />
      </>
    ),
    efa: (
      <>
        3,200 Gbps, 400 per GPU
        <Cite s={S.ec2AcceleratedSpecs} kind="derived" note="3,200 Gbps / 8 GPUs." />
      </>
    ),
    generation: (
      <>
        Nitro v4, EFA v2
        <Cite s={S.efaUserGuide} />
      </>
    ),
  },
  {
    instance: 'p6e-gb200.36xlarge',
    accelerators: (
      <>
        4 B200
        <Cite s={S.ec2AcceleratedSpecs} />
      </>
    ),
    efa: (
      <>
        3,200 Gbps, 800 per GPU
        <Cite s={S.ec2AcceleratedSpecs} kind="derived" note="3,200 Gbps / 4 GPUs." />
        ; the P6 page&apos;s prose gives 400 per GPU
        <Cite s={S.p6Page} />, its instance table 3.2 Tbps
        <Cite s={S.p6Page} />
      </>
    ),
    generation: (
      <>
        Nitro v5 in the instance specification
        <Cite s={S.ec2AcceleratedSpecs} />; Nitro v6, EFA v4 in the EFA guide
        <Cite s={S.efaUserGuide} />
      </>
    ),
  },
  {
    instance: 'p6-b300.48xlarge',
    accelerators: (
      <>
        8 B300
        <Cite s={S.ec2AcceleratedSpecs} />
      </>
    ),
    efa: (
      <>
        6,400 Gbps, 800 per GPU
        <Cite s={S.ec2AcceleratedSpecs} kind="derived" note="6,400 Gbps / 8 GPUs." />
      </>
    ),
    generation: (
      <>
        Nitro v6, EFA v4
        <Cite s={S.efaUserGuide} />
      </>
    ),
  },
  {
    instance: 'trn2.48xlarge',
    accelerators: (
      <>
        16 Trainium2
        <Cite s={S.trn2Arch} />
      </>
    ),
    efa: (
      <>
        3,200 Gbps, 16 x 200
        <Cite s={S.ec2AcceleratedSpecs} />
      </>
    ),
    generation: (
      <>
        Nitro v5, EFA v3
        <Cite s={S.efaUserGuide} />
      </>
    ),
  },
  {
    instance: 'Trn3 Gen2 UltraServer',
    accelerators: (
      <>
        144 Trainium3
        <Cite s={S.trn3Arch} />
      </>
    ),
    efa: (
      <>
        28,800 Gbps
        <Cite
          s={S.trn3Arch}
          note="Listed in the Trn3 Gen2 UltraServer column; the page does not say whether the figure is per UltraServer or per server."
        />
      </>
    ),
    generation: (
      <>
        No Trn3 row in the EFA guide
        <Cite s={S.efaUserGuide} />
      </>
    ),
  },
];

export function CommunicationAndScaleOut() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Which library and link carry each kind of traffic between accelerators, and how much bandwidth is left once it leaves the fast domain"
          >
            Communication and Scale-Out
          </Header>
        }
      >
        <Box variant="p">
          Once a model spans more than one accelerator, its tensors cross a communication stack that
          starts where <em>Anatomy of a Kernel Execution</em> ends, at the chip boundary. Four kinds
          of traffic share it: training collectives (all-reduce, all-gather), MoE (mixture of
          experts) all-to-all dispatch and combine, KV-cache (key-value cache) transfers in
          disaggregated serving, and host control traffic. The shape of the traffic decides which
          library carries it.
        </Box>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Find the library your traffic calls and the link under it, on NVLink, EFA and Trainium"
          >
            The stack
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A collective library turns one call from many ranks into transfers; a transfer library
            moves one buffer between two devices. On GPUs these are NCCL (NVIDIA Collective
            Communications Library) and NIXL (NVIDIA Inference Xfer Library). Trainium runs
            collectives on CC-Cores (Collective Communication cores), callable from NKI (Neuron
            Kernel Interface) kernels. Across AWS instances, traffic reaches EFA (Elastic Fabric
            Adapter) and its SRD (Scalable Reliable Datagram) transport.
          </Box>
          <CommunicationStack />
          <Box variant="small" color="text-body-secondary">
            Nitro generations
            <Cite s={S.ec2AcceleratedSpecs} />
            <Cite s={S.efaUserGuide} />; SRD paths
            <Cite s={S.srdHpcBlog} />; Trn2 torus
            <Cite s={S.trn2Arch} />; NeuronLink-v4 and NeuronSwitch-v1
            <Cite s={S.trn3Arch} />.
          </Box>
          <ExpandableSection headerText="Open standards for the same jobs: UEC and UALink">
            <Box variant="p">
              SRD and NVLink each belong to one vendor; UEC and UALink are open specifications for
              scale-out and scale-up. UEC (Ultra Ethernet Consortium) Specification 1.0, from June
              2025, defines an Ethernet-based stack with remote direct memory access for AI and HPC
              (high performance computing) networks of up to millions of endpoints.
              <Cite s={S.uecSpec10} /> UALink (Ultra Accelerator Link) 200G 1.0, from April 2025,
              carries read, write and atomic transactions between up to 1,024 accelerators in a pod
              <Cite s={S.ualink10} />; its Common Specification 2.0, from April 2026, adds
              in-network compute.
              <Cite s={S.ualinkFourSpecs} /> AWS sat on the UALink board at the 1.0 release
              <Cite s={S.ualink10} /> and is designing Trainium4 for NVLink 6 through NVIDIA&apos;s
              NVLink Fusion.
              <Cite s={S.nvlinkFusionTrainium4} kind="roadmap" /> This research located no AWS
              announcement of a UEC or UALink product. <em>Chiplet and Interconnect</em> covers UCIe
              (Universal Chiplet Interconnect Express), which the UALink chiplet specification
              complies with.
              <Cite s={S.ualinkFourSpecs} />
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Which library to reach for, and the setting that puts each one on EFA"
          >
            NCCL and NIXL
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>NCCL</strong> implements all-reduce, all-gather, broadcast, reduce, all-to-all,
            scatter and gather
            <Cite
              s={S.ncclV2283}
              note="2.28.3 adds the host APIs ncclAlltoAll, ncclScatter and ncclGather."
            />{' '}
            over NVLink, InfiniBand and, through the aws-ofi-nccl plugin, EFA.
            <Cite s={S.awsOfiNccl} /> Most collectives run as CUDA kernels on the SMs (streaming
            multiprocessors) that also run the model; from 2.28, all-to-all, scatter, gather and
            all-gather inside one NVLink domain can run on copy engines instead.
            <Cite s={S.ncclV2283} /> Initial Rubin (sm107) support arrives in v2.32.3-1, without
            Rubin performance tuning.
            <Cite s={S.ncclV2323} />
          </Box>
          <Box variant="p">
            <strong>NIXL</strong> accelerates point-to-point transfers for inference frameworks such
            as NVIDIA Dynamo
            <Cite s={S.nixlReadme} />, which moves the KV cache from prefill to decode GPU memory
            with it.
            <Cite s={S.dynamoDisaggDoc} /> Its libfabric plugin lists AWS EFA as its one validated
            provider. The plugin also moves Trainium device memory, given one EFA interface per
            Neuron device: launch a trn2.48xlarge with all 16 EFA interfaces attached (a default
            launch attaches one ENA, Elastic Network Adapter, interface); a trn2.3xlarge does not
            qualify.
            <Cite s={S.nixlLibfabric} /> <em>Disaggregated Serving and Speculative Decoding</em>{' '}
            covers the backend switch: NIXL in vLLM and SGLang defaults to UCX (Unified
            Communication X), and EFA needs LIBFABRIC.
          </Box>
          <Alert type="info" header="Pick the library by the shape of the traffic">
            NCCL is collective-shaped: many ranks join one bandwidth-heavy operation. NIXL is
            point-to-point: one sender, one receiver, a latency-sensitive handoff. Production
            deployments use NCCL for training collectives and NIXL for KV-cache handoff in
            disaggregated inference.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What one AWS instance can send across the network, and why SRD spreads it over many paths"
          >
            EFA and SRD
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            EFA is the network device on AWS GPU and Trainium instances for this traffic; NCCL, NIXL
            and MPI (Message Passing Interface) reach it through libfabric, which bypasses the
            operating system kernel.
            <Cite s={S.efaUserGuide} /> On an in-order transport, one lost packet delays every
            packet behind it. SRD relaxes in-order delivery and sprays a block&apos;s packets over
            64 paths at a time, out of the hundreds or thousands in the fabric; higher layers
            restore order where they need it.
            <Cite s={S.srdHpcBlog} /> The EFA dive&apos;s section{' '}
            <Link href="../efa/">SRD: The Transport Protocol</Link> follows the mechanism.
          </Box>
          <Table
            variant="embedded"
            wrapLines
            items={efaRows}
            header={
              <Box variant="h4">
                EFA bandwidth is set per instance; divide it by the accelerators that share it
              </Box>
            }
            columnDefinitions={[
              {
                id: 'instance',
                header: 'Instance',
                cell: (r) => r.instance,
                minWidth: 130,
              },
              {
                id: 'acc',
                header: 'Accelerators',
                cell: (r) => r.accelerators,
                minWidth: 110,
              },
              { id: 'efa', header: 'EFA', cell: (r) => r.efa, minWidth: 170 },
              {
                id: 'gen',
                header: 'Nitro, EFA generation',
                cell: (r) => r.generation,
                minWidth: 180,
              },
            ]}
          />
          <Box variant="p">
            AWS&apos;s pages disagree on P6e-GB200&apos;s Nitro generation and on its EFA per GPU,
            and the P6 page disagrees with itself.{' '}
            <em>Grace-Blackwell and UltraServer</em> shows what the per-GPU gap means for an expert
            layout.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Where Trainium's collectives run, how much bandwidth leaves the instance, and which API to call for MoE dispatch"
          >
            Trainium collectives: CC-Cores and NeuronLink
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Trainium2 has 16 CC-Cores per chip
            <Cite s={S.trainium2Arch} />, synchronization processors that decide when the data
            movement engines transfer data at each step of a collective.
            <Cite s={S.collectives} /> NeuronLink-v3 gives each Trn2 chip 1,024 GB/s to the chips in
            its instance plus 256 GB/s to the other instances of a Trn2 UltraServer.
            <Cite s={S.trn2Arch} /> Each instance is a 4x4 2D torus, and same-position chips across
            the four instances form rings
            <Cite s={S.trn2Arch} />, a 4x4x4 torus in effect
            <Cite
              s={S.trn2Arch}
              kind="derived"
              note="A 4x4 torus per instance plus a 4-node ring per chip position gives 4x4x4; AWS does not use the term."
            />
            : a 64-chip scale-up domain built as a torus, where NVL72 is built on switches. Trn3
            replaces the torus with a switched all-to-all fabric, NeuronSwitch-v1, in UltraServers
            of 64 or 144 chips.
            <Cite s={S.trn3Arch} /> <em>AWS Trainium, Inferentia and Neuron</em> draws both fabrics.
          </Box>
          <Alert type="info" header="MoE dispatch on Trainium: the API to call">
            Call <code>nki.collectives.all_to_all_v</code> (Neuron 2.29.0 and later); the Neuron
            Runtime adds AllToAllV on Trn2 and Trn3 from 2.32.0, and the NKI Library&apos;s MoE
            kernels shipped in 2.28.0.
            <Cite s={S.neuronWhatsNew} /> <code>torch.all_to_all_vdev_2d</code> is a PyTorch op
            built on NVIDIA&apos;s NVSHMEM
            <Cite s={S.pytorchNvshmem} />, and the torch-neuronx source at v2.33.0 has no
            implementation of it.
            <Cite
              s={S.torchNeuronxRepo}
              note="Searched the source tree at the tag for all_to_all_vdev_2d and symm_mem: no matches. Our search of the code, not an AWS statement."
            />{' '}
            PyTorch 2.14&apos;s TokenSwitch dispatch and combine interface is private and
            NVIDIA-only.
            <Cite s={S.pytorch214Blog} /> PyTorch code on TorchNeuron opens its process group with{' '}
            <code>init_process_group(backend=&quot;neuron&quot;)</code>, which runs collectives,{' '}
            <code>all_to_all</code> among them, on the collective cores inside a node and over EFA
            between nodes.
            <Cite s={S.torchNeuronNotes} /> NVIDIA&apos;s Wide-EP (wide expert parallelism) runs
            over GB200 multi-node NVLink
            <Cite s={S.wideEpReadme} />; on Neuron, Wide-EP is a beta in vLLM Neuron
            <Cite s={S.neuronWhatsNew} />, and NxD Inference (NeuronX Distributed Inference),
            which ends on Trn2 and Trn3 in Neuron 2.34
            <Cite s={S.eosNxdInference} />, documents expert parallelism over All-Gather.
            <Cite s={S.nxdiMoe} />
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Keep expert-parallel dispatch inside the fast domain, and cross the network only with the library built for it"
          >
            MoE all-to-all: DeepEP, NCCL EP and Wide-EP
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            An MoE layer sends each token to the devices holding its experts (dispatch) and gathers
            the results (combine): two all-to-all exchanges per layer.
            <Cite s={S.deepEpReadme} /> <em>Mixture of Experts and Sparse Activation</em> covers the
            routing. Three GPU libraries implement the exchange: DeepEP, NCCL EP and Wide-EP.
          </Box>
          <ExpandableSection headerText="DeepEP, NCCL EP and Wide-EP: what each library is">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>DeepEP</strong> (release v1.2.1) is DeepSeek&apos;s open-source set of
                dispatch and combine kernels. On H800 GPUs with 400 Gb/s ConnectX-7 cards its normal
                kernels measured 153 GB/s for EP8 (expert parallelism across 8 GPUs) dispatch over
                NVLink and 51 GB/s for EP64 dispatch over RDMA (remote direct memory access).
                <Cite s={S.deepEpReadme} kind="measured" /> On EFA, AWS lists DeepEP v2 from its
                amazon-contributing fork as a supported library.
                <Cite s={S.efaUserGuide} />
              </Box>
              <Box variant="p">
                <strong>NCCL EP</strong> (nccl-ep-v0.1.0, June 2026) adds dispatch and combine
                primitives to NCCL, with full multi-node NVLink support and a setting for how many
                SMs it uses.
                <Cite s={S.ncclEp} /> <strong>Wide-EP</strong> is TensorRT-LLM&apos;s path on GB200.
                <Cite s={S.wideEpReadme} /> SGLang&apos;s <code>--moe-a2a-backend</code> chooses
                among backends including <code>deepep</code>, <code>mooncake</code>,{' '}
                <code>nixl</code> and <code>mori</code>.
                <Cite s={S.sglangExecArgs} />
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <Box variant="p">
            <strong>Size the expert group to the fast domain first</strong> (our reading of these
            figures). In DeepSeek&apos;s measurement, dispatch across 64 GPUs over RDMA ran at a
            third of the 8-GPU NVLink rate
            <Cite s={S.deepEpReadme} kind="derived" note="51 / 153 GB/s." />, and a Trn2 chip has a
            quarter of its in-instance NeuronLink bandwidth toward the other instances of an
            UltraServer.
            <Cite s={S.trn2Arch} kind="derived" note="256 / 1,024 GB/s per chip." /> Keep the group
            inside one domain when the model allows: 8 GPUs in a P5
            <Cite s={S.ec2AcceleratedSpecs} />, up to 72 in a P6e-GB200 UltraServer
            <Cite s={S.p6Page} />, 16 chips in a trn2.48xlarge.
            <Cite s={S.trn2Arch} /> Across EFA, use the path built for it: NCCL with aws-ofi-nccl,
            NIXL with LIBFABRIC, DeepEP v2 from AWS&apos;s fork, and{' '}
            <code>nki.collectives.all_to_all_v</code> on Trainium.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
