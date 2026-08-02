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
 * to a release tag or commit SHA.
 *
 * Corrections applied on 2026-08-02, from research/2026-08-refresh:
 *  - The tuner path is src/tuner/nccl_ofi_tuner.cpp, not tuner/. NCCL's
 *    comparison function is in src/graph/search.cc. There has never been a
 *    src/search.cc.
 *  - NCCL_ALGO / NCCL_PROTO do not disable the tuner on current versions.
 *    That bailout is in the v2 entry point only. The NCCL over EFA section
 *    owns the full version-by-version account; this page defers to it.
 *  - EFA does support GPUDirect Async, through FI_EFA_GDA_OPS on the
 *    efa-direct fabric, and the plugin consumes it.
 *  - SRD is reliable in hardware. RDMA read and write are device operations.
 *    Neither is emulated in software.
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
          <Header variant="h1" description="How EFA enables multi-node distributed training at scale">
            EFA for AI/ML Training
          </Header>
        }
      >
        <Box variant="p">
          Distributed training is fundamentally a <strong>communication-bound</strong> problem.
          As you scale from 1 node to N nodes, the fraction of time spent synchronizing
          gradients grows. EFA&apos;s role is to minimize this communication overhead so
          that scaling efficiency stays close to linear.
        </Box>
      </Container>

      <Container header={<Header variant="h2">Parallelism Strategies & EFA Impact</Header>}>
        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <Box variant="h3">Data Parallelism (DDP (Distributed Data Parallel) / FSDP (Fully Sharded Data Parallel))</Box>
            <Box variant="p">
              Each node has a full model copy, processes different data, synchronizes gradients
              via <strong>allreduce</strong>. Communication volume per step =
              2 × model_size × (N-1)/N.
            </Box>
            <Box variant="p">
              Worked as arithmetic, not as a benchmark: a 7B parameter model is 14 GB in fp16, so
              one step moves roughly 28 GB of allreduce traffic. Divide that by 100 Gbps and you get
              about 2.2 seconds on the wire. Divide it by the 3,200 Gbps of EFA bandwidth AWS
              documents for a P5 layout <SourceRef provenance="documented" doc={docs.efaAcc} /> and
              you get about 70 milliseconds. Treat the ratio as illustrative. It is line-rate
              division, and it ignores collective algorithm, message size and overlap with compute.
            </Box>
            <StatusIndicator type="success">
              EFA critical: allreduce is the bottleneck
            </StatusIndicator>
          </div>
          <div>
            <Box variant="h3">Model Parallelism (Tensor + Pipeline)</Box>
            <Box variant="p">
              Tensor parallelism splits individual layers across GPUs and requires
              <strong> all-to-all</strong> communication every forward/backward pass.
              Pipeline parallelism splits layers sequentially and requires
              <strong> point-to-point</strong> activation transfers between stages.
            </Box>
            <Box variant="p">
              Tensor parallelism is latency-sensitive (many small messages).
              Pipeline parallelism is bandwidth-sensitive (large activation tensors).
              EFA helps both: low latency for TP (Tensor Parallelism), high bandwidth for PP (Pipeline Parallelism).
            </Box>
            <StatusIndicator type="success">
              EFA critical, especially for tensor parallelism across nodes
            </StatusIndicator>
          </div>
          <div>
            <Box variant="h3">Expert Parallelism (MoE (Mixture of Experts))</Box>
            <Box variant="p">
              Mixture-of-Experts models route tokens to different expert sub-networks.
              The <strong>all-to-all</strong> communication pattern is unique: each node
              sends different amounts of data to different nodes based on routing decisions.
            </Box>
            <Box variant="p">
              SRD&apos;s multi-path routing handles asymmetric traffic well. An earlier version of
              this page said two more things here and both have been removed. The first was a
              message-size comparison against InfiniBand ConnectX-7 that traced to no benchmark we
              could cite. The second was wrong: EFA does support GPUDirect Async. The libfabric EFA
              provider exposes it as FI_EFA_GDA_OPS on the efa-direct fabric{' '}
              <SourceRef provenance="code-derived" code={code.gdaOps} />, and the aws-ofi-nccl
              plugin consumes it through a GIN (GPU-Initiated Networking) subsystem with a GDAKI
              variant <SourceRef provenance="code-derived" code={code.ginGdaki} />. It is opt-in at
              build time and at run time. The NCCL over EFA section has the full sequence.
            </Box>
            <StatusIndicator type="info">
              EFA beneficial. No sourced MoE dispatch gap to report.
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
              EFA&apos;s job is to make the inter-node links fast enough that they don&apos;t
              bottleneck the intra-node compute.
            </Box>
            <StatusIndicator type="success">
              EFA essential for the inter-node communication layer
            </StatusIndicator>
          </div>
        </ColumnLayout>
      </Container>

      <Container header={<Header variant="h2">The NCCL + EFA Stack</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            NVIDIA NCCL (Collective Communications Library) is the standard for GPU-to-GPU
            communication. The <code>aws-ofi-nccl</code> plugin bridges NCCL to EFA via libfabric.
          </Box>
          <ExpandableSection headerText="How the stack works">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>1. PyTorch/framework layer:</strong> Calls NCCL for collective operations
                (allreduce, allgather, reduce-scatter)
              </Box>
              <Box variant="p">
                <strong>2. NCCL:</strong> Implements collective algorithms (ring, tree, recursive halving-doubling).
                Determines which GPU talks to which GPU and in what order.
              </Box>
              <Box variant="p">
                <strong>3. aws-ofi-nccl plugin:</strong> Translates NCCL&apos;s transport operations
                (send/recv on channels) into libfabric operations. Handles memory registration,
                GDR (GPUDirect RDMA) when available.
              </Box>
              <Box variant="p">
                <strong>4. libfabric EFA provider:</strong> Maps libfabric operations to
                EFA hardware commands. Manages queue pairs, completion queues.
              </Box>
              <Box variant="p">
                <strong>5. EFA hardware + SRD:</strong> Moves data between nodes. Multi-path
                routing, packet spraying, hardware-based reliability.
              </Box>
            </SpaceBetween>
          </ExpandableSection>

          <Alert type="warning" header="Common gotcha: NCCL_TOPO_FILE is a legacy path">
            Advice to point <code>NCCL_TOPO_FILE</code> at a file for your instance type is stale on
            anything newer than P4d. The plugin ships exactly three topology XML files at v1.20.0,
            for p4d, p4de and g5.48xlarge{' '}
            <SourceRef provenance="code-derived" code={code.topoP4d} />
            <SourceRef provenance="code-derived" code={code.topoG5} />. On P5 and later there is no
            file to point at: the plugin discovers the topology and reorders the NIC-to-GPU rail
            assignment itself <SourceRef provenance="code-derived" code={code.sortRails} />. Leave
            the variable unset there.
          </Alert>

          <ExpandableSection headerText="NCCL environment variables for EFA: set almost nothing">
            <SpaceBetween size="s">
              <Box variant="p">
                The environment block that circulates in EFA tutorials is mostly obsolete. The
                plugin publishes its own cheatsheet, scoped by version rather than written as
                timeless advice <SourceRef provenance="code-derived" code={code.envCheatsheet} />.
                Read against it, <code>FI_PROVIDER=efa</code> is needed only on aws-ofi-nccl 1.5.0
                and older, <code>FI_EFA_USE_DEVICE_RDMA=1</code> should not be set on libfabric
                1.18.0 or later with aws-ofi-nccl 1.7.0 or later, <code>NCCL_TUNER_PLUGIN</code> has
                not been required since NCCL 2.21, and both <code>NCCL_BUFFSIZE</code> and the
                channel-count knobs are better left at their defaults. The NCCL over EFA section
                walks the block line by line and says which layer owns each variable.
              </Box>
              <Box variant="p">
                What is worth setting is the debug pair. The two lines below make the plugin report
                what it loaded and let libfabric say what it selected.
              </Box>
              <pre>
{`NCCL_DEBUG=INFO     # plugin init banner, provider, device count, rail groups
FI_LOG_LEVEL=info   # libfabric provider selection and warnings`}
              </pre>
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
                uses RDM endpoints, not raw DGRAM. What RDM adds is not reliability. SRD is reliable
                in hardware, and DGRAM endpoints are the unreliable ones. RDM adds ordering
                guarantees, unlimited message size through software segmentation, tagging, atomics
                and directed receive, which the provider declares in its capability set{' '}
                <SourceRef provenance="code-derived" code={code.rdmOrder} />. Those semantics carry
                overhead, and they are the ones NCCL expects.
              </Box>
              <Box variant="p">
                <strong>GPU memory gets different transfer protocols:</strong> when the buffer lives
                in GPU memory, libfabric restricts itself to the eager and runting-read protocols
                and skips the medium-message path. The mechanism is a threshold, not a pointer
                check: the provider sets the maximum medium message size to zero for CUDA, ROCR and
                Neuron memory and warns that only eager and runting read protocols are supported{' '}
                <SourceRef provenance="code-derived" code={code.hmemThresholds} />. An earlier
                version of this page named a function that does not exist and gave a rationale that
                appears nowhere in the source. Both are gone.
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
                and binds that rail for the communicator. The hardware has no concept of rails. The
                file is <code>src/nccl_ofi_rdma.cpp</code>. The plugin moved from C to C++ in
                v1.15.0, so any citation of <code>nccl_ofi_rdma.c</code> is pointing at a path that
                no longer exists.
              </Box>
              <Box variant="p">
                <strong>P2P GPU RDMA is runtime-probed:</strong> the plugin resolves{' '}
                <code>cuPointerGetAttributes</code> dynamically{' '}
                <SourceRef provenance="code-derived" code={code.cudaPointer} /> and calls it to
                classify a pointer at run time{' '}
                <SourceRef provenance="code-derived" code={code.cudaPointerCall} />. Where
                peer-to-peer access is unavailable, transfers stage through host memory instead. P2P
                is never guaranteed, so check for it rather than assume it.
              </Box>
              <Box variant="p">
                <strong>NCCL topology XML schema:</strong> The XML describes a tree of{' '}
                <code>&lt;system&gt;</code> → <code>&lt;cpu&gt;</code> → <code>&lt;pci&gt;</code> →{' '}
                <code>&lt;gpu&gt;</code>/<code>&lt;nic&gt;</code> nodes. Each NIC is placed under
                the same PCIe switch as its paired GPUs. This is how NCCL knows which NIC to use
                for each GPU&apos;s inter-node traffic. <code>aws-ofi-nccl</code> ships three such
                files at v1.20.0, for p4d, p4de and g5.48xlarge{' '}
                <SourceRef provenance="code-derived" code={code.topoP4d} />
                <SourceRef provenance="code-derived" code={code.topoG5} />. P5 and later have none,
                so the plugin reorders the rail assignment in software instead{' '}
                <SourceRef provenance="code-derived" code={code.sortRails} />.
              </Box>
              <Box variant="p">
                <strong>Algorithm selection:</strong> the <code>aws-ofi-nccl</code> tuner does not
                set <code>NCCL_ALGO</code> or <code>NCCL_PROTO</code>. It writes into{' '}
                <code>collCostTable</code>, the algorithm by protocol cost matrix, making preferred
                combinations cheaper. Two things this page used to say about that are corrected in
                the NCCL over EFA section, which owns the detail. First, <code>cmpScore</code> is
                not algorithm selection: it is the comparison function for a sort over candidate
                GPUs during ring and tree search, and it lives in{' '}
                <code>src/graph/search.cc</code>, never in <code>src/search.cc</code>{' '}
                <SourceRef provenance="code-derived" code={code.ncclCmpScore} />. Second, setting{' '}
                <code>NCCL_ALGO</code> or <code>NCCL_PROTO</code> does not disable the tuner on
                current versions. That bailout exists only in the v2 entry point, which serves NCCL
                2.21.x <SourceRef provenance="code-derived" code={code.tunerV2} />. The v3 entry
                point for NCCL 2.22.3 and later{' '}
                <SourceRef provenance="code-derived" code={code.tunerV3} /> and the v6 entry point
                for NCCL 2.30.3 and later{' '}
                <SourceRef provenance="code-derived" code={code.tunerV6} /> carry no such check. The
                tuner still runs; NCCL applies your filter on top of its cost table.
              </Box>
            </SpaceBetween>
          </ExpandableSection>

          <ExpandableSection headerText="Prerequisites often missed">
            <SpaceBetween size="s">
              <Alert type="warning">
                <strong>GDRCopy is a documented install step, and it is not GPUDirect RDMA:</strong>{' '}
                the AWS NCCL getting-started guide has a step for installing GDRCopy{' '}
                <SourceRef provenance="documented" doc={docs.efaNccl} />. It is a different
                mechanism from GPUDirect RDMA, which the EFA kernel driver enables on its own. Host
                staging happens when NIC-to-GPU peer-to-peer is unavailable, not because GDRCopy is
                absent. An earlier version of this page equated the two and stated a minimum GDRCopy
                version that no AWS source gives. Both are removed.
              </Alert>
              <Alert type="error">
                <strong>NVIDIA Fabric Manager required on P4d/P5:</strong> The{' '}
                <code>nvidia-fabricmanager</code> systemd service must be running to manage
                NVSwitch. Its version must <strong>exactly match</strong> the NVIDIA kernel
                module version. A mismatch renders all 8 GPUs non-functional for
                inter-GPU operations.
              </Alert>
              <Alert type="warning">
                <strong>Disk space:</strong> CUDA toolkit requires 10-20 GiB beyond base AMI (Amazon Machine Image).
                Allocate at minimum 30 GiB root volume or the EFA installer will fail silently.
              </Alert>
              <Alert type="info">
                <strong>nouveau driver:</strong> Must be blacklisted before installing NVIDIA
                proprietary drivers. Add <code>blacklist nouveau</code> to
                <code>/etc/modprobe.d/</code> and regenerate initramfs.
              </Alert>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Neuron + EFA (Trainium/Inferentia)</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            AWS Trainium and Inferentia2 chips use the <strong>Neuron SDK</strong> instead of
            CUDA/NCCL. The Neuron Collective Communication Library (Neuron CCL) talks to EFA
            directly via libfabric (no NCCL plugin needed).
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Trn1/Trn1n</Box>
              <Box variant="p">
                Up to 16 Trainium chips per instance. Trn1n has 16 EFA interfaces at 1,600 Gbps
                against Trn1&apos;s 8 at 800 Gbps{' '}
                <SourceRef provenance="documented" doc={docs.efa} />. The &quot;n&quot; suffix is
                twice the networking. For multi-node training, prefer Trn1n.
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
                Pricing section, not here.
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
                streaming multiprocessors. The size of the resulting speedup is workload-dependent
                and we have no AWS figure to quote for it.
              </Box>
              <Box variant="p">
                <strong>Hierarchical communication:</strong> Neuron automatically applies
                local reductions within a node first (NeuronLink), then inter-node
                coordination among designated processes over EFA, then broadcasts results.
                This minimizes expensive EFA traffic.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Scaling Efficiency: The Metric That Matters</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            The metric that matters is <strong>scaling efficiency</strong>: how much of the
            theoretical speedup you actually get. Perfect linear scaling is 100%.
          </Box>
          <Box variant="p">
            It converts directly to cost. At 90% efficiency on 64 nodes you pay for 64 and get the
            work of about 58. At 50% you get the work of about 32. That is the whole argument for
            spending engineering time on the network: it is not that training gets faster, it is
            that the nodes you are already paying for stop idling.
          </Box>
          <Alert type="info" header="No efficiency percentage is published here">
            An earlier version of this page gave a scaling efficiency band for EFA on P5 and a lower
            band for TCP at the same scale. Neither traces to a benchmark we can cite, so both are
            removed. Efficiency depends on model, parallelism strategy, batch size, node count and
            the collective algorithm chosen, so a single band would be misleading even if it were
            sourced. Measure it on your own job. The sourced performance numbers on this site are in
            the Traditional HPC section, each tied to a named benchmark and instance type.
          </Alert>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
