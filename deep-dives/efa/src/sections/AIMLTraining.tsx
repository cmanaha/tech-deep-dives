import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Alert from '@cloudscape-design/components/alert';
import StatusIndicator from '@cloudscape-design/components/status-indicator';

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
            <Box variant="h3">Data Parallelism (DDP / FSDP)</Box>
            <Box variant="p">
              Each node has a full model copy, processes different data, synchronizes gradients
              via <strong>allreduce</strong>. Communication volume per step =
              2 × model_size × (N-1)/N.
            </Box>
            <Box variant="p">
              For a 7B parameter model (14GB in fp16): ~28GB of allreduce traffic per step.
              At 100 Gbps (no EFA): ~2.2s communication overhead.
              At 3,200 Gbps (P5 EFA): ~70ms. That&apos;s a <strong>31x reduction</strong>.
            </Box>
            <StatusIndicator type="success">
              EFA critical — allreduce is the bottleneck
            </StatusIndicator>
          </div>
          <div>
            <Box variant="h3">Model Parallelism (Tensor + Pipeline)</Box>
            <Box variant="p">
              Tensor parallelism splits individual layers across GPUs — requires
              <strong> all-to-all</strong> communication every forward/backward pass.
              Pipeline parallelism splits layers sequentially — requires
              <strong> point-to-point</strong> activation transfers between stages.
            </Box>
            <Box variant="p">
              Tensor parallelism is latency-sensitive (many small messages).
              Pipeline parallelism is bandwidth-sensitive (large activation tensors).
              EFA helps both: low latency for TP, high bandwidth for PP.
            </Box>
            <StatusIndicator type="success">
              EFA critical — especially for tensor parallelism across nodes
            </StatusIndicator>
          </div>
          <div>
            <Box variant="h3">Expert Parallelism (MoE)</Box>
            <Box variant="p">
              Mixture-of-Experts models route tokens to different expert sub-networks.
              The <strong>all-to-all</strong> communication pattern is unique: each node
              sends different amounts of data to different nodes based on routing decisions.
            </Box>
            <Box variant="p">
              SRD&apos;s multi-path routing handles asymmetric traffic well.
              However, <strong>EFA falls slightly short of InfiniBand ConnectX-7</strong> on
              the specific message sizes used in MoE dispatch-and-combine patterns.
              EFA also does not support GPUDirect Async, which some MoE optimizations rely on.
            </Box>
            <StatusIndicator type="info">
              EFA beneficial but with known MoE dispatch gap vs InfiniBand
            </StatusIndicator>
          </div>
          <div>
            <Box variant="h3">Hybrid Parallelism (3D/4D)</Box>
            <Box variant="p">
              Modern large model training combines all strategies. Common pattern:
              TP within a node (NVLink), PP + DP across nodes (EFA).
            </Box>
            <Box variant="p">
              The key architecture decision: <strong>TP stays intra-node</strong> (NVLink
              has ~900 GB/s, far exceeding EFA) while <strong>PP and DP go inter-node</strong> (EFA).
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
                <strong>1. PyTorch/framework layer</strong> — Calls NCCL for collective operations
                (allreduce, allgather, reduce-scatter)
              </Box>
              <Box variant="p">
                <strong>2. NCCL</strong> — Implements collective algorithms (ring, tree, recursive halving-doubling).
                Determines which GPU talks to which GPU and in what order.
              </Box>
              <Box variant="p">
                <strong>3. aws-ofi-nccl plugin</strong> — Translates NCCL&apos;s transport operations
                (send/recv on channels) into libfabric operations. Handles memory registration,
                GDR (GPU Direct RDMA) when available.
              </Box>
              <Box variant="p">
                <strong>4. libfabric EFA provider</strong> — Maps libfabric operations to
                EFA hardware commands. Manages queue pairs, completion queues.
              </Box>
              <Box variant="p">
                <strong>5. EFA hardware + SRD</strong> — Moves data between nodes. Multi-path
                routing, packet spraying, hardware-based reliability.
              </Box>
            </SpaceBetween>
          </ExpandableSection>

          <Alert type="warning">
            <strong>Common gotcha:</strong> NCCL topology detection matters. Set{' '}
            <code>NCCL_TOPO_FILE</code> to the correct topology file for your instance type.
            Without it, NCCL may not discover the optimal communication paths between GPUs
            and EFA interfaces, leading to suboptimal performance. AWS Deep Learning AMIs
            include the correct topology files.
          </Alert>

          <ExpandableSection headerText="Key NCCL environment variables for EFA">
            <Box variant="code">
{`# Essential for EFA
FI_PROVIDER=efa                    # Tell libfabric to use EFA
FI_EFA_USE_DEVICE_RDMA=1           # GPUDirect RDMA (required on P4d, default on P5+)

# NCCL Tuner Plugin (auto-selects optimal algorithm + protocol per topology)
NCCL_TUNER_PLUGIN=/opt/amazon/ofi-nccl/lib/x86_64-linux-gnu/libnccl-ofi-tuner.so

# Manual overrides (only if tuner is NOT used)
# NCCL_PROTO=Simple               # Simple protocol (good for EFA)
# NCCL_ALGO=Ring                  # Ring algorithm (or Tree for large clusters)

# Performance tuning
NCCL_BUFFSIZE=8388608              # 8MB buffer (default 4MB)
NCCL_MIN_NCHANNELS=4               # Minimum NCCL channels

# Debugging
NCCL_DEBUG=INFO                    # Enable NCCL debug logging
# Verify EFA is active: look for "NET/OFI Selected Provider is efa*"
FI_LOG_LEVEL=info                  # Enable libfabric logging`}
            </Box>
          </ExpandableSection>
          <ExpandableSection headerText="Under the Hood: NCCL → libfabric → Hardware">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>RDM vs DGRAM endpoints:</strong> NCCL uses RDM (Reliable Datagram Message)
                endpoints, not raw DGRAM. RDM adds software-layer reliability, message tagging,
                and RMA (Remote Memory Access) emulation on top of EFA&apos;s unreliable datagram
                hardware. Raw MPI can use DGRAM endpoints directly. The choice matters: RDM
                endpoints carry overhead but provide the semantics NCCL expects.
                (Source: <code>efa_rdm_ep.c</code> in ofiwg/libfabric)
              </Box>
              <Box variant="p">
                <strong>GPU memory gets different transfer protocols:</strong> When the source
                or destination is GPU memory (detected via <code>cuda_is_addr_cuda_accessible</code>),
                libfabric restricts to only eager and runt-read protocols — the medium-message
                rendezvous protocol is skipped entirely. This is because GPU memory cannot be
                used as an inline source for the medium protocol&apos;s copy semantics.
                (Source: <code>efa_rdm_ep_use_p2p</code> in ofiwg/libfabric)
              </Box>
              <Box variant="p">
                <strong>NCCL operation mapping to libfabric verbs:</strong>
              </Box>
              <ul>
                <li><code>fi_send</code> — eager sends for small messages (below rendezvous threshold)</li>
                <li><code>fi_write</code> with immediate data — RDMA write path; immediate data
                  bit-packs <code>comm_id + seq_num + segment_count</code> into a single 64-bit value
                  for zero-copy completion signaling</li>
                <li><code>fi_read</code> — runt-read protocol for large GPU transfers</li>
              </ul>
              <Box variant="p">
                <strong>Multi-rail implementation</strong> (Source: <code>nccl_ofi_rdma.c</code> in
                aws/aws-ofi-nccl): Each rail gets a separate <code>fi_endpoint</code> +
                Address Vector (<code>fi_av</code>) + Completion Queue (<code>fi_cq</code>).
                Rail selection uses a three-phase software handshake: (1) sender picks a
                rail, (2) sends connection request with rail metadata, (3) receiver
                confirms and binds the rail for that communicator. This is entirely in
                software — the hardware has no concept of rails.
              </Box>
              <Box variant="p">
                <strong>P2P GPU RDMA is runtime-probed:</strong> The plugin calls
                <code>cuPointerGetAttribute</code> at runtime to check if GPU memory is
                directly accessible from the NIC. If not (older drivers, unsupported topology),
                it silently falls back to <code>cudaMemcpy</code> staging through host memory.
                This means P2P RDMA is never guaranteed — always verify with{' '}
                <code>NCCL_DEBUG=INFO</code> logs showing &quot;GPU Direct RDMA Enabled&quot;.
              </Box>
              <Box variant="p">
                <strong>Lazy QP creation:</strong> Queue Pairs are not created at{' '}
                <code>fi_endpoint</code> allocation time. The actual hardware QP is created
                at <code>fi_enable</code> — allowing the application to set all QP parameters
                before committing hardware resources. This matters for large clusters where
                thousands of endpoints are allocated but only a subset are used.
              </Box>
            </SpaceBetween>
          </ExpandableSection>

          <ExpandableSection headerText="Prerequisites often missed">
            <SpaceBetween size="s">
              <Alert type="error">
                <strong>GDRCopy required:</strong> GPUDirect RDMA (GDRCopy v2.4+) must be
                installed before running NCCL with EFA on any P-series instance. Without it,
                GPU-to-NIC transfers fall back to staged copies through host memory.
              </Alert>
              <Alert type="error">
                <strong>NVIDIA Fabric Manager required on P4d/P5:</strong> The{' '}
                <code>nvidia-fabricmanager</code> systemd service must be running to manage
                NVSwitch. Its version must <strong>exactly match</strong> the NVIDIA kernel
                module version — a mismatch renders all 8 GPUs non-functional for
                inter-GPU operations.
              </Alert>
              <Alert type="warning">
                <strong>Disk space:</strong> CUDA toolkit requires 10-20 GiB beyond base AMI.
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
            directly via libfabric — no NCCL plugin needed.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Trn1/Trn1n</Box>
              <Box variant="p">
                Up to 16 Trainium chips per instance. Trn1n has 16 EFA interfaces (1,600 Gbps)
                vs Trn1&apos;s 8 (800 Gbps). The &quot;n&quot; suffix = 2x networking. For
                multi-node training, always prefer Trn1n.
              </Box>
            </div>
            <div>
              <Box variant="h3">Trn2</Box>
              <Box variant="p">
                16 Trainium v2 chips, 16 EFA interfaces at 200 Gbps each = 3,200 Gbps (EFAv3).
                NeuronLink 2D torus at 1 TB/s intra-node. 30-40% better price-performance
                than P5e. Trn2 UltraServers connect 4 nodes = 64 chips, 12.8 Tbps EFA.
              </Box>
            </div>
          </ColumnLayout>

          <ExpandableSection headerText="Neuron architecture advantage: dedicated CC Engine">
            <SpaceBetween size="s">
              <Box variant="p">
                Each Trainium chip includes a dedicated <strong>Collective Compute (CC)
                Engine</strong> that orchestrates collectives (AllReduce, AllGather,
                ReduceScatter, All-to-All) independently from the NeuronCores. The CC cores
                control data movement engines, enabling communication to execute
                <strong> in parallel</strong> with compute — providing 10-15% additional
                acceleration that CUDA/NCCL architectures cannot match.
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

      <Container header={<Header variant="h2">Scaling Efficiency: The Numbers That Matter</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            The metric that matters is <strong>scaling efficiency</strong>: how much of the
            theoretical speedup do you actually get?
          </Box>
          <Box variant="p">
            Perfect linear scaling = 100%. Real-world with EFA on P5: typically
            <strong> 85-95% scaling efficiency</strong> for data-parallel training up to
            hundreds of nodes. Without EFA (TCP): drops to 40-60% at the same scale.
          </Box>
          <Box variant="p">
            The difference is not subtle — it directly translates to cost.
            If scaling efficiency is 90% on 64 nodes, you&apos;re paying for 64 nodes
            but getting the work of ~58. At 50% efficiency, you&apos;re getting the work of ~32.
            EFA doesn&apos;t just make training faster — it makes multi-node training
            <strong> economically viable</strong>.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
