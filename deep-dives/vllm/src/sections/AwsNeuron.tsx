import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Table from '@cloudscape-design/components/table';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Alert from '@cloudscape-design/components/alert';
import Link from '@cloudscape-design/components/link';
import Badge from '@cloudscape-design/components/badge';

// ---------------------------------------------------------------------------
// Feature support matrix (Tier-1: vllm-neuron README + Neuron NxD Inference
// release notes, accessed 2026-06-07). Status reflects the plugin path on the
// current Neuron SDK; verify against the live release notes. This moves fast.
// ---------------------------------------------------------------------------
interface FeatureRow {
  feature: string;
  status: 'Supported' | 'WIP' | 'Not supported' | 'Fork only';
  notes: string;
}

const featureRows: FeatureRow[] = [
  {
    feature: 'Continuous batching',
    status: 'Supported',
    notes: 'The core vLLM scheduler runs; NxDI executes the model. The throughput story is the same one vLLM gives you on GPU.',
  },
  {
    feature: 'Prefix caching',
    status: 'Supported',
    notes: 'Improves time-to-first-token on shared prefixes. Same semantics as the GPU path.',
  },
  {
    feature: 'Speculative decoding (EAGLE)',
    status: 'Supported',
    notes: 'EAGLE v1 via the plugin; NxD Inference adds Eagle3 (documented on Llama 3.1 8B). Drafter checkpoints may need Neuron-side preparation.',
  },
  {
    feature: 'Multi-LoRA',
    status: 'Supported',
    notes: 'Streaming LoRA adapters via vLLM load_adapter API; adapters load into CPU memory at runtime.',
  },
  {
    feature: 'Tool calling / structured outputs',
    status: 'Supported',
    notes: 'Tool calling, dynamic sampling, CPU sampling and structured outputs are listed as functional in the plugin.',
  },
  {
    feature: 'Quantization (INT8 / FP8)',
    status: 'Supported',
    notes: "Configured through Neuron config (override_neuron_config in additional_config), NOT vLLM's --quantization flag. See note below.",
  },
  {
    feature: 'Multimodal',
    status: 'WIP',
    notes: 'Work-in-progress; docs cite Llama 4 (and Pixtral in the README). Verify the exact model list against the current release.',
  },
  {
    feature: 'Chunked prefill',
    status: 'Not supported',
    notes: 'Marked WIP / not available on the Neuron plugin path. Do not assume the GPU chunked-prefill scheduler behaviour.',
  },
  {
    feature: 'Disaggregated prefill / decode',
    status: 'Not supported',
    notes: 'Not on the plugin. Existed on the legacy vLLM-v0 Neuron fork, which is no longer supported.',
  },
  {
    feature: 'Multi-node distributed inference',
    status: 'Fork only',
    notes: 'The pattern Amazon Rufus shipped (Triton leader + NeuronWorker followers) was built on the AWS-maintained fork, not the upstream plugin. Verify current plugin support before relying on it.',
  },
];

function statusBadge(status: FeatureRow['status']) {
  if (status === 'Supported') return <Badge color="green">{status}</Badge>;
  if (status === 'WIP') return <Badge color="blue">{status}</Badge>;
  if (status === 'Fork only') return <Badge color="grey">{status}</Badge>;
  return <Badge color="red">{status}</Badge>;
}

// ---------------------------------------------------------------------------
// Neuron software stack diagram. Inline SVG, house style (see
// DisaggregatedServing.tsx). Top-to-bottom: vLLM frontend down to silicon.
// ---------------------------------------------------------------------------
function NeuronStackDiagram() {
  const layers = [
    { y: 20, fill: '#e9f2ff', stroke: '#0972d3', title: 'vLLM frontend + scheduler', sub: 'OpenAI server, continuous batching, prefix cache, LoRA, spec-decode logic' },
    { y: 86, fill: '#e9f7ef', stroke: '#037f0c', title: 'vllm-neuron plugin', sub: 'Hardware plugin via vLLM Plugin System, swaps in the NeuronWorker / model executor' },
    { y: 152, fill: '#f2f0fb', stroke: '#6b4fbb', title: 'NxD Inference (neuronx-distributed-inference)', sub: 'Sharding, compilation, optimized kernels, cross-node collectives' },
    { y: 218, fill: '#fdf3e7', stroke: '#b7791f', title: 'Neuron runtime + NKI kernels', sub: 'libnrt, compiler artifacts, NeuronCore scheduling' },
    { y: 284, fill: '#eef1f4', stroke: '#5f6b7a', title: 'Trainium / Inferentia silicon', sub: 'NeuronCores, on-chip HBM, NeuronLink intra-node, EFA inter-node' },
  ];
  return (
    <svg
      viewBox="0 0 640 360"
      role="img"
      aria-label="AWS Neuron software stack for vLLM, from the vLLM frontend down to Trainium silicon"
      style={{ width: '100%', height: 'auto' }}
    >
      <style>{`
        .nl-box { rx: 8; }
        .nl-title { font: 600 14px sans-serif; fill: #16191f; }
        .nl-sub { font: 11px sans-serif; fill: #414d5c; }
        .nl-arrow { stroke: #879596; stroke-width: 1.5; marker-end: url(#nl-arr); }
      `}</style>
      <defs>
        <marker id="nl-arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#879596" />
        </marker>
      </defs>
      {layers.map((l, i) => (
        <g key={l.title}>
          <rect x={40} y={l.y} width={560} height={52} rx={8} fill={l.fill} stroke={l.stroke} />
          <text className="nl-title" x={56} y={l.y + 22}>{l.title}</text>
          <text className="nl-sub" x={56} y={l.y + 40}>{l.sub}</text>
          {i < layers.length - 1 && (
            <line className="nl-arrow" x1={320} y1={l.y + 52} x2={320} y2={l.y + 66} />
          )}
        </g>
      ))}
    </svg>
  );
}

export function AwsNeuron() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="vLLM runs on Trainium and Inferentia through a hardware plugin on top of NxD Inference, not a fork. The SA job is knowing which instances the current SDK still supports, which features survive the port, and when the multi-node fork is the only thing that does what you need."
          >
            21. vLLM on AWS Neuron (Trainium / Inferentia)
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The mental model:</strong> vLLM&apos;s frontend, scheduler, and serving surface
            stay exactly what they are on GPU. What changes underneath is the model-execution layer.
            On Neuron that layer is supplied by the{' '}
            <strong>vllm-neuron plugin</strong> (a <em>hardware plugin</em>, not a fork),
            which uses vLLM&apos;s Plugin System to swap in a NeuronWorker that drives{' '}
            <strong>NxD Inference</strong> (<code>neuronx-distributed-inference</code>), which in turn
            compiles and runs the model on Trainium/Inferentia NeuronCores. The vllm-neuron README
            describes itself as a &quot;hardware plugin for vLLM on AWS Neuron&quot; that
            &quot;integrates with vLLM by using vLLM&apos;s Plugin System&quot; (
            <Link external href="https://github.com/vllm-project/vllm-neuron">
              github.com/vllm-project/vllm-neuron, accessed 2026-06-07
            </Link>
            ).
          </Box>
          <Box variant="p">
            <strong>Why this matters for an SA:</strong> the plugin model means you do <em>not</em> run
            a forked, lagging copy of vLLM for the common case. You run upstream vLLM with a
            Neuron backend. But coverage is not 1:1 with GPU. Some features are WIP, some are
            configured differently (quantization), and the headline multi-node pattern that Amazon
            Rufus ships in production lives in a <em>separate AWS-maintained fork</em>, not the plugin.
            Getting these boundaries right is the difference between a clean Trainium serving design
            and a stalled POC.
          </Box>
          <Box variant="p">
            The hardware itself (NeuronCores, on-chip HBM, NeuronLink, the Trainium/Inferentia
            memory hierarchy and why it suits inference economics) is the{' '}
            <Link external href="../silicon-memory-inference/">
              Silicon, Memory &amp; Inference
            </Link>{' '}
            sibling deep dive. The vLLM engine internals the plugin slots into (the worker / executor
            split, the scheduler, the model layer) are walked against source in the{' '}
            <strong>Inside the Codebase</strong> section. This section is the AWS practitioner&apos;s
            view: what runs, on what, with which features.
          </Box>
          <Alert type="warning" header="Verify against the current Neuron release before you commit a design">
            The Neuron SDK, the vllm-neuron plugin version, and the upstream vLLM version are coupled
            and revise on a roughly six-week cadence. Instance support and feature status have both
            changed across recent releases (see the instance-support note below). Every version,
            feature flag, and instance claim here is dated <strong>2026-06-07</strong> and should be
            re-checked against the{' '}
            <Link external href="https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/whats-new.html">
              Neuron What&apos;s New
            </Link>{' '}
            page and the plugin README for your target SDK.
          </Alert>
        </SpaceBetween>
      </Container>

      {/* ---------------------------------------------------------------- */}
      {/* Software stack diagram                                            */}
      {/* ---------------------------------------------------------------- */}
      <Container
        header={
          <Header
            variant="h2"
            description="One frontend, four layers of Neuron underneath it"
          >
            The Neuron software stack
          </Header>
        }
      >
        <SpaceBetween size="m">
          <NeuronStackDiagram />
          <Box variant="small">
            The only layer that differs from a GPU deployment is the executor: the vllm-neuron plugin
            replaces the GPU worker with a NeuronWorker, then defers sharding, compilation, kernels,
            and collectives to NxD Inference. Source for the layering: vllm-neuron README and the NxD
            Inference vLLM user guide (
            <Link external href="https://awsdocs-neuron.readthedocs-hosted.com/en/latest/libraries/nxd-inference/vllm/index.html">
              awsdocs-neuron.readthedocs-hosted.com &rarr; nxd-inference/vllm, accessed 2026-06-07
            </Link>
            ).
          </Box>
        </SpaceBetween>
      </Container>

      {/* ---------------------------------------------------------------- */}
      {/* Instance support + version coupling                              */}
      {/* ---------------------------------------------------------------- */}
      <Container
        header={
          <Header
            variant="h2"
            description="The single most consequential thing to get right, and it changed recently"
          >
            Which instances are supported (and the version coupling)
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Alert type="error" header="Trn1 and Inf2 fell off the current SDK">
            <Box variant="p">
              [<strong>Tier-1, AWS docs</strong>] On the <strong>current Neuron SDK</strong>, NxD
              Inference supports <strong>Trn2 and newer hardware only</strong>. The release notes
              state that &quot;NxD Inference models are now only supported on Trn2 and newer
              hardware&quot; because the current NKI (Neuron Kernel Interface) kernels are not
              supported on Trn1/Inf2, and direct customers to{' '}
              <strong>pin to Neuron release 2.28</strong> if they need Trn1/Inf2 (
              <Link external href="https://awsdocs-neuron.readthedocs-hosted.com/en/latest/release-notes/components/nxd-inference.html">
                Neuron release notes &rarr; NxD Inference, accessed 2026-06-07
              </Link>
              ).
            </Box>
            <Box variant="p">
              This is exactly why the vllm-neuron README (which can reflect an older pinned SDK) and
              the live NxD Inference release notes can disagree on the instance list. Trust the
              release notes for <em>your</em> SDK version, not a static README.
            </Box>
          </Alert>

          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="h3">Current SDK (Trn2 / Trn3)</Box>
              <Box variant="p">
                [Tier-1] The plugin + NxD Inference path targets <strong>Trn2 and Trn3</strong>.
                Trn3 (Trainium3) support was introduced in Neuron 2.27.0; the NxD Inference vLLM
                guide states relevance for Trn2 and Trn3. This is the path to design for on
                greenfield work.
              </Box>
            </div>
            <div>
              <Box variant="h3">Trn1 / Inf2 (pin 2.28)</Box>
              <Box variant="p">
                [Tier-1] Still runnable, but only by <strong>pinning Neuron SDK 2.28</strong> and the
                matching plugin/vLLM versions. You give up everything shipped after 2.28. Treat as a
                maintenance/migration path, not a target for new deployments.
              </Box>
            </div>
            <div>
              <Box variant="h3">Version coupling</Box>
              <Box variant="p">
                [Tier-1] The Neuron SDK, vllm-neuron plugin, and upstream vLLM versions are pinned
                together. Reported pairings have moved fast (e.g. plugin 0.5.x with Neuron 2.29.0;
                upstream vLLM auto-installed by the installer). <strong>Resolve the exact triple from
                the README/install guide for your SDK</strong> rather than copying a number from here.
              </Box>
            </div>
          </ColumnLayout>

          <Box variant="small">
            Latest Neuron SDK at access time: <strong>2.30.0 (2026-05-21)</strong> per the Neuron
            What&apos;s New page (
            <Link external href="https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/whats-new.html">
              accessed 2026-06-07
            </Link>
            ). Exact plugin / vLLM version numbers are intentionally not stated as hard facts here
            because the docs surfaces (README, install guide, release-notes index) report them at
            slightly different points in the release cycle: confirm at install time.
          </Box>
        </SpaceBetween>
      </Container>

      {/* ---------------------------------------------------------------- */}
      {/* Feature support matrix                                           */}
      {/* ---------------------------------------------------------------- */}
      <Container
        header={
          <Header
            variant="h2"
            description="What survives the port from GPU vLLM, and what does not"
          >
            Supported vs unsupported features on Neuron
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Table
            items={featureRows}
            columnDefinitions={[
              { id: 'feature', header: 'Feature', cell: (r) => r.feature, minWidth: 200 },
              { id: 'status', header: 'On Neuron', cell: (r) => statusBadge(r.status), minWidth: 130 },
              { id: 'notes', header: 'Notes', cell: (r) => r.notes, minWidth: 360 },
            ]}
            variant="embedded"
            wrapLines
          />
          <Box variant="small">
            [Tier-1] Status from the vllm-neuron README feature table, the vLLM AWS Neuron install
            page, and the Neuron NxD Inference release notes (all accessed 2026-06-07):{' '}
            <Link external href="https://github.com/vllm-project/vllm-neuron">
              vllm-neuron README
            </Link>
            ,{' '}
            <Link external href="https://docs.vllm.ai/en/v0.10.1/getting_started/installation/aws_neuron.html">
              vLLM AWS Neuron install
            </Link>
            ,{' '}
            <Link external href="https://awsdocs-neuron.readthedocs-hosted.com/en/latest/release-notes/components/nxd-inference.html">
              NxD Inference release notes
            </Link>
            . The &quot;WIP&quot; and model-specific items (multimodal model coverage, EAGLE
            variants) change most often, so verify per release.
          </Box>

          <Alert type="info" header="Two gotchas that bite GPU-trained intuition">
            <Box variant="p">
              <strong>1. Quantization is Neuron-config, not <code>--quantization</code>.</strong>{' '}
              [Tier-1] INT8/FP8 on Neuron is enabled through the Neuron config (the install guide
              shows it via <code>override_neuron_config</code> inside the{' '}
              <code>additional_config</code> argument), not the familiar vLLM{' '}
              <code>--quantization</code> flag. Carrying over a GPU launch command will not turn on
              quantization here.
            </Box>
            <Box variant="p">
              <strong>2. Chunked prefill is not available.</strong> [Tier-1] It is marked WIP / not
              supported on the plugin path. Schedulers and SLO models that assume chunked prefill
              (common on GPU vLLM for long-context latency smoothing) do not transfer.
            </Box>
          </Alert>

          <ExpandableSection headerText="The two code paths: plugin vs the AWS-maintained fork">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>vllm-neuron plugin (the default path).</strong> [Tier-1] Community/AWS-
                maintained hardware plugin on the current upstream vLLM. Use this for single-node
                Trn2/Trn3 serving. It is the path the install docs and What&apos;s New track.
              </Box>
              <Box variant="p">
                <strong>The legacy / AWS fork.</strong> [Tier-1] AWS has historically maintained a
                Neuron fork of vLLM (<code>aws-neuron/upstreaming-to-vllm</code>) on the older vLLM-v0
                architecture. It carried features the plugin did not, notably{' '}
                <strong>disaggregated inference</strong>, <strong>mllama</strong>, and the{' '}
                <strong>multi-node distributed inference</strong> pattern. The plugin README notes the
                v0 fork is &quot;no longer supported,&quot; while the upstream vLLM install page
                still points to an AWS fork &quot;for a more stable experience.&quot; (
                <Link external href="https://github.com/aws-neuron/upstreaming-to-vllm">
                  aws-neuron/upstreaming-to-vllm, accessed 2026-06-07
                </Link>
                ).
              </Box>
              <Alert type="warning">
                The fork story is the single most version-sensitive thing on this page. If your design
                depends on multi-node or disaggregation on Neuron, <strong>confirm which artifact
                provides it for your SDK</strong> before architecting around it. Do not assume
                the upstream plugin has reached parity.
              </Alert>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      {/* ---------------------------------------------------------------- */}
      {/* Rufus case study                                                  */}
      {/* ---------------------------------------------------------------- */}
      <Container
        header={
          <Header
            variant="h2"
            description="A production-scale multi-node Trainium + vLLM deployment, and what its architecture tells you"
          >
            Case study: Amazon Rufus on Trainium
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            [<strong>Tier-2, AWS ML blog</strong>] Amazon&apos;s Rufus shopping assistant runs
            multi-node LLM inference on Trainium with vLLM at production scale. AWS describes serving
            &quot;at production scale using tens of thousands of TRN1 instances&quot; and launching a
            larger model &quot;across over tens of thousands of AWS Trainium chips&quot; for Prime
            Day traffic (
            <Link external href="https://aws.amazon.com/blogs/machine-learning/how-amazon-scaled-rufus-by-building-multi-node-inference-using-aws-trainium-chips-and-vllm/">
              AWS ML blog: How Amazon scaled Rufus, accessed 2026-06-07
            </Link>
            ).
          </Box>

          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Leader node</Box>
              <Box variant="p">
                [Tier-2] &quot;Runs the Triton Inference Server and vLLM engine, serving as the
                primary orchestration unit for inference.&quot; The leader owns the request lifecycle
                and broadcasts model inputs to the followers.
              </Box>
            </div>
            <div>
              <Box variant="h3">Follower nodes</Box>
              <Box variant="p">
                [Tier-2] Each follower &quot;operates as an independent process and acts as a wrapper
                around the vLLM NeuronWorker component,&quot; continuously listening for inputs
                broadcast from the leader. Leader and followers share the same NeuronWorker
                implementation in vLLM.
              </Box>
            </div>
          </ColumnLayout>

          <Box variant="p">
            [Tier-2] <strong>Chip-to-chip / inter-node communication is EFA.</strong> The blog states
            &quot;cross-node collectives (such as all gather or all reduce) are managed by the Neuron
            Distributed Inference (NxDI) library, which uses EFA to deliver high-bandwidth, low-latency
            inter-node communication.&quot; This is the same EFA + collectives story covered in the{' '}
            <Link external href="../silicon-memory-inference/">
              Silicon, Memory &amp; Inference
            </Link>{' '}
            sibling, applied to inference rather than training.
          </Box>

          <Alert type="info" header="What the SA should take from Rufus">
            <Box variant="p">
              Rufus is the proof that multi-node Trainium + vLLM works at the very top of the scale
              range, but note the architecture: a <strong>Triton leader</strong> running the
              vLLM engine, <strong>NeuronWorker followers</strong>, NxDI managing cross-node
              collectives over <strong>EFA</strong>. That multi-node distribution is the capability
              that has historically lived in the <strong>AWS-maintained fork</strong>, not the
              upstream plugin (see the previous section). Treat Rufus as a pattern reference, then
              confirm which artifact gives you multi-node on your target SDK before replicating it.
            </Box>
          </Alert>
        </SpaceBetween>
      </Container>

      {/* ---------------------------------------------------------------- */}
      {/* When to choose Neuron                                            */}
      {/* ---------------------------------------------------------------- */}
      <Container
        header={
          <Header
            variant="h2"
            description="A decision note, not a benchmark claim"
          >
            When Trainium / Inferentia for vLLM
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Lean toward Neuron when</Box>
              <ul>
                <li>You are price-sensitive on inference economics and your model + features are on the supported list (see matrix).</li>
                <li>You are on <strong>Trn2/Trn3</strong> and can track the current Neuron SDK cadence.</li>
                <li>Your feature set is the &quot;survives the port&quot; subset: continuous batching, prefix caching, multi-LoRA, tool calling, EAGLE, Neuron-native quantization.</li>
                <li>You can standardize on a single-node serving topology, or you are prepared to adopt the AWS multi-node fork pattern deliberately.</li>
              </ul>
            </div>
            <div>
              <Box variant="h3">Stay on GPU vLLM when</Box>
              <ul>
                <li>You depend on features that are WIP or absent on Neuron: <strong>chunked prefill</strong>, disaggregated prefill/decode, broad multimodal coverage.</li>
                <li>You need multi-node inference and cannot take a dependency on a separate fork&apos;s lifecycle.</li>
                <li>You must stay on the absolute latest upstream vLLM features the day they ship (the Neuron path trails by the plugin/SDK coupling).</li>
                <li>Your only available capacity is Trn1/Inf2 and you are unwilling to pin to Neuron 2.28.</li>
              </ul>
            </div>
          </ColumnLayout>
          <Alert type="info">
            This is a <strong>capability</strong> decision guide, not a performance one. Cost and
            throughput comparisons depend on model, sequence lengths, and the specific Trainium/GPU
            generation: benchmark your own workload rather than porting a published ratio. The
            hardware-economics reasoning (memory bandwidth, HBM capacity, NeuronCore utilization) is
            in the{' '}
            <Link external href="../silicon-memory-inference/">
              Silicon, Memory &amp; Inference
            </Link>{' '}
            sibling.
          </Alert>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
