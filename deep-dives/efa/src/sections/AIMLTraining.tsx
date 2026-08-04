import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Alert from '@cloudscape-design/components/alert';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import { SourceRef } from '@tech-deep-dives/shared';
import type { CodeRef, DocRef } from '@tech-deep-dives/shared';

/**
 * EFA for AI/ML Training.
 *
 * Sourcing rule for this file (revamp/source-authority-standard.md): every
 * load-bearing claim carries a SourceRef, and every code reference is pinned
 * to a release tag or commit SHA. The NCCL over EFA section owns the
 * version-by-version account of the plugin and its tuner; this page states
 * the consequence and defers to it for the mechanism.
 */

const ACCESSED = '2026-08-02';
const READ = '2026-08-02';

/** Pinned refs. Never a branch: a branch citation cannot be re-verified. */
const PLUGIN_TAG = 'v1.20.0';
const NCCL_TAG = 'v2.30.4-1';
const LIBFABRIC_TAG = 'v2.6.0';
const EC2_DOC = 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/';

const plugin = (path: string, lines?: string): CodeRef => ({
  repo: 'aws/aws-ofi-nccl',
  ref: PLUGIN_TAG,
  path,
  lines,
  read: READ,
});
const nccl = (path: string, lines?: string): CodeRef => ({
  repo: 'NVIDIA/nccl',
  ref: NCCL_TAG,
  path,
  lines,
  read: READ,
});
const lfab = (path: string, lines?: string): CodeRef => ({
  repo: 'ofiwg/libfabric',
  ref: LIBFABRIC_TAG,
  path,
  lines,
  read: READ,
});

const code = {
  tunerV2: plugin('src/tuner/nccl_ofi_tuner.cpp', 'L138-L156'),
  tunerV3: plugin('src/tuner/nccl_ofi_tuner.cpp', 'L182-L186'),
  tunerV6: plugin('src/tuner/nccl_ofi_tuner.cpp', 'L188-L227'),
  ncclCmpScore: nccl('src/graph/search.cc', 'L181-L202'),
  rdma: plugin('src/nccl_ofi_rdma.cpp'),
  sortRails: plugin('src/platform-aws.cpp', 'L959-L991'),
  topoP4d: plugin('topology/p4d-24xl-topo.xml'),
  topoG5: plugin('topology/g5.48xl-topo.xml'),
  cudaPointer: plugin('src/nccl_ofi_cuda.cpp', 'L84'),
  cudaPointerCall: plugin('src/nccl_ofi_cuda.cpp', 'L290'),
  ginGdaki: plugin('src/rdma/gin/nccl_ofi_gin_gdaki.cpp', 'L145-L175'),
  gdaOps: lfab('prov/efa/src/fi_ext_efa.h', 'L11'),
  hmemThresholds: lfab('prov/efa/src/efa_hmem.c', 'L54-L95'),
  rdmOrder: lfab('prov/efa/src/efa_prov_info.c', 'L633-L640'),
  envCheatsheet: plugin('doc/efa-env-var.md', 'L28-L69'),
};

const docs: Record<string, DocRef> = {
  efa: {
    title: 'EC2 User Guide: Elastic Fabric Adapter for AI/ML and HPC workloads',
    url: `${EC2_DOC}efa.html`,
    tier: 1,
    accessed: ACCESSED,
  },
  efaNccl: {
    title: 'EC2 User Guide: Get started with EFA and NCCL',
    url: `${EC2_DOC}efa-start-nccl.html`,
    tier: 1,
    accessed: ACCESSED,
  },
  efaAcc: {
    title: 'EC2 User Guide: Maximize network bandwidth on instances with multiple network cards',
    url: `${EC2_DOC}efa-acc-inst-types.html`,
    tier: 1,
    accessed: ACCESSED,
  },
  nvlink: {
    title: 'NVIDIA NVLink and NVLink Switch',
    url: 'https://www.nvidia.com/en-us/data-center/nvlink/',
    tier: 2,
    accessed: ACCESSED,
  },
  trn2: {
    title: 'Amazon EC2 Trn2 Instances',
    url: 'https://aws.amazon.com/ec2/instance-types/trn2/',
    tier: 2,
    accessed: ACCESSED,
  },
  trainium: {
    title: 'AWS Trainium AI accelerator',
    url: 'https://aws.amazon.com/ai/machine-learning/trainium/',
    tier: 2,
    accessed: ACCESSED,
  },
};

export function AIMLTraining() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header variant="h1" description="Whether the fabric changes your step time is decided by which parallelism strategy you run and what it puts on the wire">
            EFA for AI/ML Training
          </Header>
        }
      >
        <Box variant="p">
          Distributed training is <strong>communication-bound</strong>. As you scale from 1 node to
          N nodes, the fraction of each step spent synchronizing grows, and EFA&apos;s job is to
          keep scaling efficiency close to linear.
        </Box>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Each strategy puts a different pattern on the wire, and the pattern decides whether the fabric is the thing holding you back">
            Parallelism Strategies & EFA Impact
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Each strategy splits the model and batch differently, and the split decides the traffic
            shape: one large allreduce per step, many small all-to-all exchanges, or point-to-point
            activation handoffs. Find your strategy below and you know which property of the fabric
            you are buying, bandwidth or latency.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Data Parallelism (DDP (Distributed Data Parallel) / FSDP (Fully Sharded Data Parallel))</Box>
              <Box variant="p">
                Each node has a full model copy, processes different data, synchronizes gradients via{' '}
                <strong>allreduce</strong>. Communication volume per step = 2 × model_size × (N-1)/N.
              </Box>
              <Box variant="p">
                Worked as arithmetic: a 7B parameter model is 14 GB in fp16, so one step moves roughly
                28 GB of allreduce traffic. Divide that by 100 Gbps and you get about 2.2 seconds on the
                wire. Divide it by the 3,200 Gbps of EFA bandwidth AWS documents for a P5 layout{' '}
                <SourceRef provenance="documented" doc={docs.efaAcc} /> and you get about 70
                milliseconds. Treat the ratio as illustrative: line-rate division that ignores
                collective algorithm, message size and overlap with compute.
              </Box>
              <StatusIndicator type="success">
                EFA critical: allreduce is the bottleneck
              </StatusIndicator>
            </div>
            <div>
              <Box variant="h3">Model Parallelism (Tensor + Pipeline)</Box>
              <Box variant="p">
                Tensor parallelism splits individual layers across GPUs and requires
                <strong> all-to-all</strong> communication every forward/backward pass. Pipeline
                parallelism splits layers sequentially and requires <strong> point-to-point</strong>{' '}
                activation transfers between stages.
              </Box>
              <Box variant="p">
                Tensor parallelism is latency-sensitive (many small messages) and pipeline
                parallelism is bandwidth-sensitive (large activation tensors). EFA serves both: low
                latency for TP (Tensor Parallelism), high bandwidth for PP (Pipeline Parallelism).
              </Box>
              <StatusIndicator type="success">
                EFA critical, especially for tensor parallelism across nodes
              </StatusIndicator>
            </div>
            <div>
              <Box variant="h3">Expert Parallelism (MoE (Mixture of Experts))</Box>
              <Box variant="p">
                Mixture-of-Experts models route tokens to different expert sub-networks. The{' '}
                <strong>all-to-all</strong> communication pattern is unique: each node sends different
                amounts of data to different nodes based on routing decisions.
              </Box>
              <Box variant="p">
                SRD&apos;s multi-path routing handles asymmetric traffic well. EFA supports GPUDirect
                Async: the libfabric EFA provider exposes it as FI_EFA_GDA_OPS on the efa-direct fabric{' '}
                <SourceRef provenance="code-derived" code={code.gdaOps} />, and the aws-ofi-nccl plugin
                consumes it through a GIN (GPU-Initiated Networking) subsystem with a GDAKI variant,
                opt-in at build time and at run time{' '}
                <SourceRef provenance="code-derived" code={code.ginGdaki} />. The NCCL over EFA
                section has the full sequence.
              </Box>
              <StatusIndicator type="info">
                EFA beneficial: routing decisions set the all-to-all volume
              </StatusIndicator>
            </div>
            <div>
              <Box variant="h3">Hybrid Parallelism (3D/4D)</Box>
              <Box variant="p">
                Modern large model training combines all strategies. Common pattern:
                TP within a node (NVLink), PP + DP (Data Parallelism) across nodes (EFA).
              </Box>
              <Box variant="p">
                The key architecture decision: <strong>TP stays intra-node</strong> (NVIDIA states
                900 GB/s per GPU for fourth-generation NVLink, which is what P5 carries, and 1,800
                GB/s for the fifth generation{' '}
                <SourceRef provenance="documented" doc={docs.nvlink} />, either of which far exceeds
                the inter-node fabric) while <strong>PP and DP go inter-node</strong> (EFA).
                EFA&apos;s job is to make the inter-node links fast enough to keep the intra-node
                compute busy.
              </Box>
              <StatusIndicator type="success">
                EFA essential for the inter-node communication layer
              </StatusIndicator>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Trainium reaches EFA through Neuron CCL and libfabric, and runs collectives on cores dedicated to communication">
            Neuron + EFA (Trainium/Inferentia)
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            AWS Trainium and Inferentia2 chips run on the <strong>Neuron SDK</strong>. The Neuron
            Collective Communication Library (Neuron CCL) calls libfabric directly, so the EFA path
            on these instances is Neuron CCL, then libfabric, then the device.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Trn1/Trn1n</Box>
              <Box variant="p">
                Up to 16 Trainium chips per instance. Trn1n has 16 EFA interfaces at 1,600 Gbps
                against Trn1&apos;s 8 at 800 Gbps <SourceRef provenance="documented" doc={docs.efa} />,
                so prefer Trn1n for multi-node training.
              </Box>
            </div>
            <div>
              <Box variant="h3">Trn2</Box>
              <Box variant="p">
                16 Trainium2 chips interconnected with NeuronLink, and 16 EFA interfaces at 200 Gbps
                each for 3.2 Tbps of EFAv3 networking. AWS states 30 to 40% better price performance
                than the GPU-based P5e and P5en instances. A Trn2 UltraServer connects 64 Trainium2
                chips across four Trn2 instances for 12.8 Tbps of EFAv3 networking{' '}
                <SourceRef provenance="documented" doc={docs.trn2} />. Instance rates are in the
                Pricing section.
              </Box>
            </div>
          </ColumnLayout>

          <ExpandableSection headerText="Neuron architecture advantage: dedicated CC Engine">
            <SpaceBetween size="s">
              <Box variant="p">
                Trainium puts collectives on <strong>dedicated collective cores</strong>. AWS
                describes them as dozens of communication cores physically separate from compute,
                with zero contention between compute and communication and on-chip traffic
                prioritization so time-sensitive data moves first, which minimizes the straggler
                effect <SourceRef provenance="documented" doc={docs.trainium} />. That is a
                structural difference from the CUDA and NCCL path, where a collective occupies GPU
                streaming multiprocessors. AWS publishes no figure for the resulting speedup, and it
                is workload-dependent.
              </Box>
              <Box variant="p">
                <strong>Hierarchical communication:</strong> Neuron reduces locally within a node
                over NeuronLink, coordinates between designated processes over EFA, then broadcasts
                the result. That keeps EFA traffic to a minimum.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Four layers, and the shortest correct configuration of them is almost empty">
            The NCCL + EFA Stack
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            NVIDIA NCCL (Collective Communications Library) is the standard for GPU-to-GPU
            communication. The <code>aws-ofi-nccl</code> plugin bridges NCCL to EFA via libfabric.
          </Box>
          <ExpandableSection headerText="How the stack works">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>1. Framework layer (PyTorch):</strong> calls NCCL for allreduce, allgather and reduce-scatter.
              </Box>
              <Box variant="p">
                <strong>2. NCCL:</strong> implements ring, tree and recursive halving-doubling, and decides which GPU talks to which, in what order.
              </Box>
              <Box variant="p">
                <strong>3. aws-ofi-nccl plugin:</strong> translates NCCL send and receive on channels into libfabric operations, registers memory, uses GDR (GPUDirect RDMA) where available.
              </Box>
              <Box variant="p">
                <strong>4. libfabric EFA provider:</strong> maps those operations to EFA hardware commands, managing queue pairs and completion queues.
              </Box>
              <Box variant="p">
                <strong>5. EFA hardware and SRD:</strong> moves the bytes, with multi-path routing, packet spraying and hardware reliability.
              </Box>
            </SpaceBetween>
          </ExpandableSection>

          <ExpandableSection headerText="NCCL environment variables for EFA: the two worth setting">
            <SpaceBetween size="s">
              <Box variant="p">
                Two lines earn a place in the launcher. They make the plugin report what it loaded
                and let libfabric say what it selected.
              </Box>
              <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>
{`NCCL_DEBUG=INFO     # plugin init banner, provider, device count, rail groups
FI_LOG_LEVEL=info   # libfabric provider selection and warnings`}
              </pre>
              <Box variant="p">
                The rest of the block that circulates in EFA tutorials is scoped to 2023 software.
                The plugin publishes its own cheatsheet, and each entry names the releases it
                applies to <SourceRef provenance="code-derived" code={code.envCheatsheet} />. Read
                against it, <code>FI_PROVIDER=efa</code> applies to aws-ofi-nccl 1.5.0 and older,
                the cheatsheet says to leave <code>FI_EFA_USE_DEVICE_RDMA=1</code> out on libfabric
                1.18.0 or later with aws-ofi-nccl 1.7.0 or later,{' '}
                <code>NCCL_TUNER_PLUGIN</code> became unnecessary at NCCL 2.21, and both{' '}
                <code>NCCL_BUFFSIZE</code> and the channel-count knobs work best at their defaults.
                The NCCL over EFA section walks the block line by line and says which layer owns
                each variable.
              </Box>
              <Box variant="p">
                Install steps, including GDRCopy, are AWS-documented{' '}
                <SourceRef provenance="documented" doc={docs.efaNccl} />.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <ExpandableSection headerText="Under the Hood: NCCL → libfabric → Hardware">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>RDM (Reliable Datagram Message) vs DGRAM (Datagram) endpoints:</strong> NCCL
                uses RDM endpoints. SRD already provides reliability in hardware, so what RDM buys
                is the layer above it: ordering guarantees, unlimited message size through software
                segmentation, tagging, atomics and directed receive, which the provider declares in
                its capability set <SourceRef provenance="code-derived" code={code.rdmOrder} />.
                Those semantics carry overhead, and they are the ones NCCL expects.
              </Box>
              <Box variant="p">
                <strong>GPU memory gets different transfer protocols:</strong> when the buffer lives
                in GPU memory, libfabric uses the eager and runting-read protocols only. The
                mechanism is a threshold: the provider sets the maximum medium message size to zero
                for CUDA, ROCR and Neuron memory and warns that only eager and runting read
                protocols are supported{' '}
                <SourceRef provenance="code-derived" code={code.hmemThresholds} />.
              </Box>
              <Box variant="p">
                <strong>NCCL operation mapping to libfabric verbs:</strong>
              </Box>
              <ul>
                <li><code>fi_send</code>: eager sends for small messages (below rendezvous threshold)</li>
                <li><code>fi_write</code> with immediate data: the RDMA write path, with completion
                  signalled out of the immediate data rather than a separate message</li>
                <li><code>fi_read</code>: runting-read protocol for large GPU transfers</li>
              </ul>
              <Box variant="p">
                <strong>Multi-rail implementation</strong>{' '}
                <SourceRef provenance="code-derived" code={code.rdma} />: each rail gets a separate{' '}
                <code>fi_endpoint</code>, Address Vector (<code>fi_av</code>) and Completion Queue
                (<code>fi_cq</code>). Rail selection is a software handshake: the sender picks a
                rail, sends a connection request carrying rail metadata, and the receiver confirms
                and binds that rail for the communicator. A rail is a software agreement between
                the two ends. The file is <code>src/nccl_ofi_rdma.cpp</code>; the
                plugin moved from C to C++ in v1.15.0, so citations pointing at{' '}
                <code>nccl_ofi_rdma.c</code> predate that move.
              </Box>
              <Box variant="p">
                <strong>P2P GPU RDMA is runtime-probed:</strong> the plugin resolves{' '}
                <code>cuPointerGetAttributes</code> dynamically{' '}
                <SourceRef provenance="code-derived" code={code.cudaPointer} /> and calls it to
                classify a pointer at run time{' '}
                <SourceRef provenance="code-derived" code={code.cudaPointerCall} />. Peer-to-peer
                access is a run-time property of a given pair of devices, so the plugin checks it
                per pointer and stages through host memory when it is unavailable.
              </Box>
              <Box variant="p">
                <strong>NCCL topology XML schema:</strong> The XML describes a tree of{' '}
                <code>&lt;system&gt;</code> → <code>&lt;cpu&gt;</code> → <code>&lt;pci&gt;</code> →{' '}
                <code>&lt;gpu&gt;</code>/<code>&lt;nic&gt;</code> nodes. Each NIC is placed under
                the same PCIe switch as its paired GPUs. This is how NCCL knows which NIC to use
                for each GPU&apos;s inter-node traffic. <code>aws-ofi-nccl</code> ships three such
                files at v1.20.0, for p4d, p4de and g5.48xlarge{' '}
                <SourceRef provenance="code-derived" code={code.topoP4d} />
                <SourceRef provenance="code-derived" code={code.topoG5} />. For P5 and later the
                plugin reorders the rail assignment in software instead{' '}
                <SourceRef provenance="code-derived" code={code.sortRails} />.
              </Box>
              <Box variant="p">
                <strong>Algorithm selection:</strong> the <code>aws-ofi-nccl</code> tuner writes
                into <code>collCostTable</code>, the algorithm by protocol cost matrix, making the
                combinations it prefers cheaper. NCCL then picks the minimum, so the tuner biases a
                choice NCCL still makes. Two details follow. <code>cmpScore</code> sorts candidate
                GPUs during ring and tree search and lives in <code>src/graph/search.cc</code>{' '}
                <SourceRef provenance="code-derived" code={code.ncclCmpScore} />, so guides naming
                it as the algorithm chooser (often at <code>src/search.cc</code>) name the wrong
                function. And the one entry point that switches the tuner off when{' '}
                <code>NCCL_ALGO</code> or <code>NCCL_PROTO</code> is set is v2, serving NCCL 2.21.x{' '}
                <SourceRef provenance="code-derived" code={code.tunerV2} />; v3 for NCCL 2.22.3 and
                later <SourceRef provenance="code-derived" code={code.tunerV3} /> and v6 for NCCL
                2.30.3 and later <SourceRef provenance="code-derived" code={code.tunerV6} /> run the
                tuner either way, with NCCL applying your filter on top of the cost table.
              </Box>
            </SpaceBetween>
          </ExpandableSection>

          <ExpandableSection headerText="Prerequisites to settle before the first run">
            <SpaceBetween size="s">
              <Alert type="warning">
                <strong>Install GDRCopy as its own step:</strong> the AWS NCCL getting-started guide
                carries one for it <SourceRef provenance="documented" doc={docs.efaNccl} />.
                GPUDirect RDMA is a separate mechanism, enabled by the EFA kernel driver, and host
                staging happens when NIC-to-GPU peer-to-peer is unavailable. AWS gives no minimum
                GDRCopy version, so this page quotes none.
              </Alert>
              <Alert type="error">
                <strong>NVIDIA Fabric Manager on P4d/P5:</strong> run the{' '}
                <code>nvidia-fabricmanager</code> systemd service to manage NVSwitch, at a version
                that <strong>exactly matches</strong> the NVIDIA kernel module. A mismatch takes all
                8 GPUs out of inter-GPU operations.
              </Alert>
              <Alert type="warning">
                <strong>Disk space:</strong> CUDA toolkit requires 10-20 GiB beyond base AMI (Amazon
                Machine Image). Allocate at minimum a 30 GiB root volume, or the EFA installer fails
                silently.
              </Alert>
              <Alert type="info">
                <strong>nouveau driver:</strong> blacklist it before installing the NVIDIA
                proprietary drivers. Add <code>blacklist nouveau</code> to{' '}
                <code>/etc/modprobe.d/</code> and regenerate initramfs.
              </Alert>
            </SpaceBetween>
          </ExpandableSection>

          <Alert type="success" header="Getting NCCL_TOPO_FILE right: leave it unset on P5 and later">
            The plugin ships exactly three topology XML files at v1.20.0, for p4d, p4de and
            g5.48xlarge <SourceRef provenance="code-derived" code={code.topoP4d} />
            <SourceRef provenance="code-derived" code={code.topoG5} />. On P5 and later the plugin
            discovers the topology on the running instance and reorders the NIC-to-GPU rail
            assignment itself <SourceRef provenance="code-derived" code={code.sortRails} />, so an
            unset variable is the correct setting there. Advice to point{' '}
            <code>NCCL_TOPO_FILE</code> at a file for your instance type is stale on anything newer
            than P4d.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="How much of the speedup you are paying for you actually get, and why no published number will tell you">
            Scaling Efficiency: The Metric That Matters
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Scaling efficiency</strong> is how much of the theoretical speedup you actually
            get, with perfect linear scaling at 100%. It converts directly to cost. At 90%
            efficiency on 64 nodes you pay for 64 and get the work of about 58. At 50% you get the
            work of about 32. That is the whole argument for spending engineering time on the
            network: the nodes you are already paying for stop idling.
          </Box>
          <Alert type="info" header="Efficiency depends on your job, so the band to trust is your own">
            No scaling efficiency band for EFA on P5, and none for TCP at the same scale, traces to
            a benchmark that can be cited, so this page quotes neither. Efficiency depends on model,
            parallelism strategy, batch size, node count and the collective algorithm chosen, so a
            single band would be misleading even if it were sourced. The sourced performance numbers
            on this site are in the Traditional HPC section, each tied to a named benchmark and
            instance type.
          </Alert>
          <Box variant="p">
            So measure it on your own job. Time one step on a single node and one step at your
            target node count. That ratio, against the node count, is what the network work buys.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
