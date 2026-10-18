import type { ReactNode } from 'react';
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
import { Cite, vllmUrl, vllmDocsUrl } from '../components/Cite';

// ---------------------------------------------------------------------------
// Sources. vllm-neuron is pinned to tag v0.24.0.1.1.0 (commit ed3580d0), the
// latest plugin release on 2026-10-16. AWS Neuron documentation is pinned to
// its versioned /en/v2.32.0/ URLs.
// ---------------------------------------------------------------------------
const VN_TAG = 'v0.24.0.1.1.0';
const VN = `https://github.com/vllm-project/vllm-neuron/blob/${VN_TAG}`;
const VN_TREE = `https://github.com/vllm-project/vllm-neuron/tree/${VN_TAG}`;
const VN_README = `${VN}/README.md?plain=1`;
const VN_FEATURES = `${VN}/docs/guides/features-guide.md?plain=1`;
const VN_CONFIG = `${VN}/docs/guides/reference-configuration.md?plain=1`;
const VN_MIGRATION = `${VN}/docs/getting-started/migration-nxdi-to-vllm-neuron.md?plain=1`;
const VN_PLATFORM = `${VN}/vllm_neuron/vllm/platform.py`;
const VN_DI_EXAMPLE = `${VN_TREE}/examples/vllm_neuron/models/gpt_oss/120b/mxfp4/multinode_DI`;
const VN_REL_021 = 'https://github.com/vllm-project/vllm-neuron/releases/tag/v0.21.0.1.0.0';
const VN_REL_024 = 'https://github.com/vllm-project/vllm-neuron/releases/tag/v0.24.0.1.1.0';
const NEURON_WHATS_NEW = 'https://awsdocs-neuron.readthedocs-hosted.com/en/v2.32.0/about-neuron/whats-new.html';
const NEURON_VLLM_DOCS = 'https://awsdocs-neuron.readthedocs-hosted.com/en/v2.32.0/vllm-neuron/docs/index.html';
const NXDI_RN = 'https://awsdocs-neuron.readthedocs-hosted.com/en/v2.32.0/release-notes/components/nxd-inference.html';
const NXDI_VLLM = 'https://awsdocs-neuron.readthedocs-hosted.com/en/v2.32.0/libraries/nxd-inference/vllm/index.html';
const FORK = 'https://github.com/aws-neuron/upstreaming-to-vllm/tree/c4f76254591e9113f01cbed6684efd735ba3cb81';
const VLLM_0101_NEURON = 'https://docs.vllm.ai/en/v0.10.1/getting_started/installation/aws_neuron.html';
const VLLM_0240 = 'https://github.com/vllm-project/vllm/blob/v0.24.0';
const RUFUS =
  'https://aws.amazon.com/blogs/machine-learning/how-amazon-scaled-rufus-by-building-multi-node-inference-using-aws-trainium-chips-and-vllm/';

// ---------------------------------------------------------------------------
// Plugin version table (vllm-neuron README "Version", L127-L131 at the tag).
// ---------------------------------------------------------------------------
interface VersionRow {
  plugin: string;
  vllm: string;
  sdk: string;
  nxdi: string;
  instances: string;
  status: 'Beta' | 'Maintenance';
}

const versionRows: VersionRow[] = [
  { plugin: '0.24.0.1.1.0 (latest)', vllm: '0.24.0', sdk: '2.32', nxdi: 'Not required', instances: 'Trn2, Trn3', status: 'Beta' },
  { plugin: '0.21.0.1.0.0', vllm: '0.21.0', sdk: '2.31', nxdi: 'Not required', instances: 'Trn2, Trn3', status: 'Beta' },
  { plugin: '0.5.3', vllm: '0.16.0', sdk: '2.31', nxdi: '0.10.x', instances: 'Trn1, Trn2, Trn3, Inf2', status: 'Maintenance' },
];

// ---------------------------------------------------------------------------
// Feature matrix for the 1.x plugin (README "Features" table at the tag, plus
// the features guide for the mechanics).
// ---------------------------------------------------------------------------
interface FeatureRow {
  feature: string;
  status: 'Supported' | 'Not supported';
  notes: ReactNode;
}

const featureRows: FeatureRow[] = [
  {
    feature: 'Continuous batching',
    status: 'Supported',
    notes: 'On by default; the plugin\'s Neuron scheduler admits new requests without waiting for running ones.',
  },
  {
    feature: 'Prefix caching',
    status: 'Supported',
    notes: (
      <>
        On by default, as upstream; <code>--no-enable-prefix-caching</code> turns it off.
      </>
    ),
  },
  {
    feature: 'Chunked prefill (mixed batching)',
    status: 'Not supported',
    notes: 'Segmented prefill takes its place: long prompts run over several iterations, and prefill and decode never share a batch.',
  },
  {
    feature: 'Speculative decoding: EAGLE3',
    status: 'Supported',
    notes: (
      <>
        Set through <code>--speculative-config</code> with <code>{'"method": "eagle3"'}</code>. Draft-model
        speculation without an EAGLE3 draft is not supported.
      </>
    ),
  },
  {
    feature: 'Speculative decoding: MTP',
    status: 'Not supported',
    notes: 'Not available on the plugin.',
  },
  {
    feature: 'LoRA adapters',
    status: 'Not supported',
    notes: 'A workload that depends on LoRA stays on the 0.5.x line with NxD Inference.',
  },
  {
    feature: 'Structured outputs and tool calling',
    status: 'Supported',
    notes: 'JSON, regex and grammar-constrained output, plus tool calling.',
  },
  {
    feature: 'Quantization',
    status: 'Supported',
    notes: (
      <>
        BF16, FP8 weights from a calibrated checkpoint, FP8 KV cache, and MXFP4 or MXFP8
        (microscaling 4-bit or 8-bit float) weights on Trn3. Neuron keys go under <code>additional_config.neuron_config</code>; leave{' '}
        <code>--quantization</code> unset.
      </>
    ),
  },
  {
    feature: 'Multimodal: images or video with text',
    status: 'Supported',
    notes: 'Tested on Qwen3-VL 32B. The vision encoder can also run on its own server pool (EPD, encoder disaggregation), with prefill and decode together on a second pool.',
  },
  {
    feature: 'Multimodal: audio',
    status: 'Not supported',
    notes: 'No audio input path.',
  },
  {
    feature: 'Disaggregated prefill/decode',
    status: 'Supported',
    notes: '1P1D and xPyD. KV moves over NIXL with the LIBFABRIC backend on EFA.',
  },
  {
    feature: 'Parallelism: TP, SP, DP, EP, CP',
    status: 'Supported',
    notes: (
      <>
        The executor is <code>mp</code> or <code>uni</code>; any other backend setting, Ray
        included, is replaced with <code>mp</code>.
      </>
    ),
  },
  {
    feature: 'Pipeline parallelism',
    status: 'Not supported',
    notes: 'Not available; the supported splits are TP, SP, DP, EP and CP.',
  },
  {
    feature: 'KV cache offloading',
    status: 'Not supported',
    notes: 'The offload tiers in section 7 do not apply on Neuron.',
  },
];

function statusBadge(status: FeatureRow['status']) {
  return status === 'Supported' ? <Badge color="green">{status}</Badge> : <Badge color="red">{status}</Badge>;
}

// ---------------------------------------------------------------------------
// NeuronStackDiagram. Two columns: the current 1.x plugin line (solid) and the
// 0.5.x maintenance line (dashed). Idiom A, class prefix "nsd-".
// ---------------------------------------------------------------------------
function NeuronStackDiagram() {
  return (
    <svg
      viewBox="0 0 860 400"
      role="img"
      aria-labelledby="neuron-stack-title"
      style={{ width: '100%', minWidth: 640, height: 'auto' }}
    >
      <title id="neuron-stack-title">
        Two vllm-neuron lines under the same vLLM serving surface. On the current 1.x line, vLLM 0.24.0
        sits on the vllm-neuron 0.24.0.1.1.0 platform plugin, which carries its own worker and scheduler,
        the model implementations, the NKI kernels and the torch.compile path and runs straight on the
        Neuron runtime on Trn2 and Trn3, with no NxD Inference layer. On the 0.5.x line, in maintenance,
        vLLM 0.16.0 sits on plugin 0.5.3, which hands the model to NxD Inference 0.10.x; it is the only
        line listed for Trn1 and Inf2.
      </title>
      <style>{`
        .nsd-h    { fill: #16191f; font: 700 14px sans-serif; }
        .nsd-hs   { fill: #414d5c; font: 11px sans-serif; }
        .nsd-t    { fill: #16191f; font: 600 13px sans-serif; }
        .nsd-s    { fill: #414d5c; font: 11px sans-serif; }
        .nsd-foot { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
        .nsd-arr  { stroke: #879596; stroke-width: 1.5; fill: none; marker-end: url(#nsd-ah); }
      `}</style>
      <defs>
        <marker id="nsd-ah" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto-start-reverse">
          <path d="M0,0 L8,4 L0,8 Z" fill="#879596" />
        </marker>
      </defs>
      <rect x={0} y={0} width={860} height={400} rx={8} fill="#ffffff" />

      {/* Column headers */}
      <text className="nsd-h" x={34} y={30}>vllm-neuron 1.x: current (Beta)</text>
      <text className="nsd-hs" x={34} y={48}>Neuron 2.32, vLLM 0.24.0, no NxD Inference</text>
      <text className="nsd-h" x={524} y={30}>vllm-neuron 0.5.x: maintenance</text>
      <text className="nsd-hs" x={524} y={48}>Neuron 2.31, vLLM 0.16.0, NxD Inference 0.10.x</text>

      {/* Row 1: vLLM engine */}
      <rect x={20} y={66} width={460} height={56} rx={8} fill="#f2f8fd" stroke="#0972d3" strokeWidth={1.5} />
      <text className="nsd-t" x={34} y={89}>vLLM 0.24.0 engine (upstream code)</text>
      <text className="nsd-s" x={34} y={108}>vllm serve, OpenAI-compatible server, flags, metrics, KV block API</text>
      <rect x={510} y={66} width={330} height={56} rx={8} fill="#f4f4f4" stroke="#879596" strokeWidth={1.5} strokeDasharray="6 4" />
      <text className="nsd-t" x={524} y={89}>vLLM 0.16.0 engine</text>
      <text className="nsd-s" x={524} y={108}>vllm serve, OpenAI-compatible server</text>

      {/* Left: plugin spans the two middle rows (NxD Inference folded in) */}
      <line className="nsd-arr" x1={250} y1={122} x2={250} y2={144} />
      <rect x={20} y={146} width={460} height={136} rx={8} fill="#ecf7ec" stroke="#037f0c" strokeWidth={1.5} />
      <text className="nsd-t" x={34} y={170}>vllm-neuron 0.24.0.1.1.0 platform plugin</text>
      <text className="nsd-s" x={34} y={192}>Registers through the vllm.platform_plugins entry point</text>
      <text className="nsd-s" x={34} y={210}>NeuronWorker and NeuronScheduler replace vLLM&apos;s defaults</text>
      <text className="nsd-s" x={34} y={228}>Model implementations and NKI kernels ship in the plugin</text>
      <text className="nsd-s" x={34} y={246}>torch.compile via XLA to neuronx-cc, one program per bucket</text>
      <text className="nsd-s" x={34} y={264}>KV transfer: NeuronNixlConnector over EFA (LIBFABRIC)</text>

      {/* Right: plugin, then NxD Inference */}
      <line className="nsd-arr" x1={675} y1={122} x2={675} y2={144} />
      <rect x={510} y={146} width={330} height={56} rx={8} fill="#f4f4f4" stroke="#879596" strokeWidth={1.5} strokeDasharray="6 4" />
      <text className="nsd-t" x={524} y={169}>vllm-neuron 0.5.3 plugin</text>
      <text className="nsd-s" x={524} y={188}>Thin worker; NxD Inference runs the model</text>
      <line className="nsd-arr" x1={675} y1={202} x2={675} y2={224} />
      <rect x={510} y={226} width={330} height={56} rx={8} fill="#efe7fb" stroke="#6f4cc4" strokeWidth={1.5} strokeDasharray="6 4" />
      <text className="nsd-t" x={524} y={249}>NxD Inference 0.10.x</text>
      <text className="nsd-s" x={524} y={268}>Model code, sharding, compilation, kernels</text>

      {/* Row 4: runtime and instances */}
      <line className="nsd-arr" x1={250} y1={282} x2={250} y2={304} />
      <rect x={20} y={306} width={460} height={56} rx={8} fill="#eef1f4" stroke="#414d5c" strokeWidth={1.5} />
      <text className="nsd-t" x={34} y={329}>Neuron runtime on Trn2 and Trn3</text>
      <text className="nsd-s" x={34} y={348}>NeuronCores; EFA between instances for prefill/decode</text>
      <line className="nsd-arr" x1={675} y1={282} x2={675} y2={304} />
      <rect x={510} y={306} width={330} height={56} rx={8} fill="#f4f4f4" stroke="#879596" strokeWidth={1.5} strokeDasharray="6 4" />
      <text className="nsd-t" x={524} y={329}>Trn1, Trn2, Trn3, Inf2</text>
      <text className="nsd-s" x={524} y={348}>Trn1 / Inf2 NKI kernels: pin Neuron 2.28</text>

      <text className="nsd-foot" x={430} y={388}>
        Dashed: the maintenance line. NxD Inference gets no new feature releases.
      </text>
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
            description="Run vLLM on Trainium through the vLLM Neuron plugin: pick the plugin line from your instance family, check the feature matrix, and plan around the plugin's vLLM 0.24.0 pin (verified against vLLM v0.31.0, commit db9527a4, vllm-neuron v0.24.0.1.1.0, commit ed3580d0, and Neuron SDK 2.32.0, 2026-10-16)"
          >
            21. vLLM on AWS Neuron (Trainium / Inferentia)
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>What it is.</strong> vLLM reaches AWS Trainium through the vLLM Neuron plugin,{' '}
            <code>vllm-neuron</code>. Its README opens: &quot;The vLLM Neuron plugin is the
            recommended serving solution for large language models on AWS Trainium.&quot;{' '}
            <Cite tier={1} href={`${VN_README}#L3`}>
              vllm-neuron README L3
            </Cite>
            . The package registers <code>{'neuron = "vllm_neuron:register"'}</code> under the{' '}
            <code>vllm.platform_plugins</code> entry-point group{' '}
            <Cite tier={1} href={`${VN}/pyproject.toml#L24-L25`} kind="code">
              vllm-neuron pyproject.toml L24-L25
            </Cite>
            , the group vLLM loads when it resolves which platform it runs on{' '}
            <Cite tier={1} href={vllmUrl('vllm/plugins/__init__.py', 'L21-L23')} kind="code">
              plugins/__init__.py L21-L23
            </Cite>
            . vLLM v0.31.0 has no Neuron platform of its own: its built-in platforms are TPU, CUDA,
            ROCm, XPU and CPU{' '}
            <Cite tier={1} href={vllmUrl('vllm/platforms/__init__.py', 'L231-L237')} kind="code">
              platforms/__init__.py L231-L237
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>The mental model.</strong> What clients and operators touch is vLLM&apos;s own:{' '}
            <code>vllm serve</code>, the OpenAI-compatible server, the flags and the metrics. The
            plugin swaps in its own scheduler and worker underneath and runs the model on NeuronCores,
            and it comes in two lines. The current 1.x line keeps the model implementations inside the plugin and drops
            NxD Inference (NeuronX Distributed Inference): &quot;NxD Inference is no longer a
            dependency&quot;{' '}
            <Cite tier={1} href={`${VN_README}#L125`}>
              vllm-neuron README L125
            </Cite>
            . The 0.5.x line hands the model to NxD Inference, which Neuron 2.32.0 put &quot;in maintenance mode; no new feature releases are planned. Migrate
            to vLLM Neuron&quot;{' '}
            <Cite tier={1} href={NEURON_WHATS_NEW}>
              Neuron docs: What&apos;s New, 2.32.0 software lifecycle updates
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>The version gap.</strong> The latest plugin, 0.24.0.1.1.0, pins{' '}
            <strong>vLLM 0.24.0</strong>{' '}
            <Cite tier={1} href={`${VN_README}#L127-L131`}>
              vllm-neuron README L127-L131
            </Cite>
            . A Trainium server therefore runs vLLM 0.24.0, seven minor releases behind the v0.31.0
            this dive describes, and every flag or behaviour this dive dates after 0.24.0 is missing
            on it.
          </Box>
          <Box variant="p">
            Trainium hardware (NeuronCores, the memory hierarchy, inference economics) is the{' '}
            <Link external href="../silicon-memory-inference/">
              Silicon, Memory &amp; Inference
            </Link>{' '}
            deep dive. The worker and executor split the plugin slots into is{' '}
            <strong>section 14 (Inside the Codebase)</strong>. KV (key-value) cache transfer over EFA
            (Elastic Fabric Adapter) through NIXL (NVIDIA Inference Xfer Library) is{' '}
            <strong>section 22 (vLLM on AWS GPUs, EFA &amp; NIXL)</strong>.
          </Box>
        </SpaceBetween>
      </Container>

      {/* ---------------------------------------------------------------- */}
      {/* Software stack                                                    */}
      {/* ---------------------------------------------------------------- */}
      <Container
        header={
          <Header
            variant="h2"
            description="What the 1.x plugin replaces and where NxD Inference went, so you can place any Neuron deployment on its line before you read its docs"
          >
            Two plugin lines, one serving surface
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Both lines keep vLLM on top and the Neuron runtime at the bottom. They differ in the
            middle. On the 1.x line the plugin carries the model code, the NKI (Neuron Kernel
            Interface) kernels and the compile path (torch.compile through XLA, Accelerated Linear
            Algebra) itself. On the 0.5.x line the plugin is a worker over NxD Inference, which owns
            the model.
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <NeuronStackDiagram />
          </div>
          <Box variant="small" color="text-body-secondary">
            Schematic. Illustrative, not measured. Versions and instance lists come from the plugin
            README&apos;s version table{' '}
            <Cite tier={1} href={`${VN_README}#L123-L131`}>
              vllm-neuron README L123-L131
            </Cite>
            ; the Trn1 / Inf2 pin is from the NxD Inference release notes{' '}
            <Cite tier={1} href={NXDI_RN}>
              Neuron docs: NxD Inference release notes
            </Cite>
            .
          </Box>
          <Box variant="p">
            On the 1.x line the plugin sets vLLM&apos;s worker class to <code>NeuronWorker</code>{' '}
            <Cite tier={1} href={`${VN_PLATFORM}#L353-L356`} kind="code">
              vllm-neuron platform.py L353-L356
            </Cite>
            , replaces the default scheduler with <code>NeuronScheduler</code> (or{' '}
            <code>NeuronAsyncScheduler</code> under async scheduling){' '}
            <Cite tier={1} href={`${VN_PLATFORM}#L424-L437`} kind="code">
              platform.py L424-L437
            </Cite>
            , and ships its own <code>model</code> and <code>nki</code> packages{' '}
            <Cite tier={1} href={`${VN_TREE}/vllm_neuron`} kind="code">
              vllm-neuron vllm_neuron/
            </Cite>
            . Compilation runs through <code>torch.compile</code> with the plugin&apos;s backend,
            lowered through XLA to the Neuron compiler, <code>neuronx-cc</code>. Warmup compiles one program per shape bucket (sequence length by
            batch size) and caches it on disk for later restarts{' '}
            <Cite tier={1} href={`${VN_FEATURES}#L26-L42`}>
              vllm-neuron features guide L26-L42
            </Cite>
            . Budget that compile on first boot, or point <code>NEURON_COMPILED_ARTIFACTS</code> at a
            directory of pre-compiled artifacts so production nodes skip it{' '}
            <Cite tier={1} href={`${VN_FEATURES}#L44-L56`}>
              features guide L44-L56
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>Check which platform loaded.</strong> At startup vLLM logs{' '}
            <code>Platform plugin neuron is activated</code> when the plugin is in use{' '}
            <Cite tier={1} href={`${VLLM_0240}/vllm/platforms/__init__.py#L235-L237`} kind="code">
              vLLM v0.24.0 platforms/__init__.py L235-L237
            </Cite>
            ; an activated out-of-tree platform plugin takes precedence over the built-in platforms{' '}
            <Cite tier={1} href={vllmUrl('vllm/platforms/__init__.py', 'L272-L279')} kind="code">
              platforms/__init__.py L272-L279
            </Cite>
            . If that line is missing at the default log level, vLLM did not activate the plugin.
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
            description="Your instance family decides which plugin line you can run, and the line decides which vLLM version you get"
          >
            Pick the line from the instance family
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Table
            items={versionRows}
            columnDefinitions={[
              { id: 'plugin', header: 'vllm-neuron', cell: (r) => r.plugin, minWidth: 150 },
              { id: 'vllm', header: 'vLLM', cell: (r) => r.vllm },
              { id: 'sdk', header: 'Neuron SDK', cell: (r) => r.sdk },
              { id: 'nxdi', header: 'NxD Inference', cell: (r) => r.nxdi },
              { id: 'instances', header: 'Instances', cell: (r) => r.instances, minWidth: 150 },
              {
                id: 'status',
                header: 'Status',
                cell: (r) => (r.status === 'Beta' ? <Badge color="green">Beta</Badge> : <Badge color="grey">Maintenance</Badge>),
              },
            ]}
            variant="embedded"
            wrapLines
          />
          <Box variant="small" color="text-body-secondary">
            Table from the README&apos;s version section{' '}
            <Cite tier={1} href={`${VN_README}#L123-L131`}>
              vllm-neuron README L123-L131
            </Cite>
            . From 0.21.0 the plugin version reads <code>{'<vLLM version>.<plugin version>'}</code>,
            so <code>0.24.0.1.1.0</code> is vLLM 0.24.0 with plugin 1.1.0 and the vLLM pin is readable
            from the package name. Each of the last two SDK releases moved the pin: vLLM 0.21.0 with
            Neuron 2.31, then 0.24.0 with Neuron 2.32.
          </Box>

          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Trn2 and Trn3: the 1.x plugin</Box>
              <Box variant="p">
                Design new work here. Neuron 2.32.0 is the latest SDK release (2026-08-17), and its
                DLAMIs (Deep Learning Amazon Machine Images) and DLCs (Deep Learning Containers)
                ship vLLM 0.24.0 with vllm-neuron 0.24.0.1.1.0{' '}
                <Cite tier={1} href={NEURON_WHATS_NEW}>
                  Neuron docs: What&apos;s New, 2.32.0
                </Cite>
                . SDK releases have arrived roughly every six weeks since 2.28.0 (2026-02-26){' '}
                <Cite tier={1} href={NEURON_WHATS_NEW}>
                  Neuron docs: What&apos;s New, release dates
                </Cite>
                : re-read the version table at each one.
              </Box>
            </div>
            <div>
              <Box variant="h3">Trn1 and Inf2: the 0.5.x line only</Box>
              <Box variant="p">
                The 1.x plugin lists Trn2 and Trn3 only. The README lists plugin 0.5.3 (vLLM 0.16.0,
                Neuron 2.31) for Trn1 and Inf2, while the NxD Inference release notes say &quot;NxD
                Inference models are now only supported on Trn2 and newer hardware&quot; and that
                customers who need NxD Inference kernel support on Trn1 or Inf2 &quot;should pin to
                release 2.28&quot;{' '}
                <Cite tier={1} href={NXDI_RN}>
                  Neuron docs: NxD Inference release notes
                </Cite>
                . The two AWS pages disagree. If a Trn1 or Inf2 deployment needs NxD Inference
                kernels, plan to the 2.28 pin the release notes give. Neuron 2.32.0 also stopped publishing the legacy vLLM 0.16 DLC
                (<code>pytorch-inference-vllm-neuronx</code>): &quot;Use a 2.31.0 or earlier image if
                required&quot;{' '}
                <Cite tier={1} href={NEURON_WHATS_NEW}>
                  Neuron docs: What&apos;s New, 2.32.0
                </Cite>
                .
              </Box>
            </div>
          </ColumnLayout>

          <Alert type="warning" header="vLLM 0.24.0 on Neuron, v0.31.0 everywhere else in this dive">
            Read every version note in this dive against 0.24.0 before you copy a GPU launch command.
            For example, the admission-control flags <code>--max-num-queued-reqs</code> and{' '}
            <code>--max-num-queued-tokens</code> exist at v0.31.0{' '}
            <Cite tier={1} href={vllmUrl('vllm/engine/arg_utils.py', 'L1692-L1698')} kind="code">
              arg_utils.py L1692-L1698
            </Cite>{' '}
            and do not appear in v0.24.0&apos;s argument parser{' '}
            <Cite tier={1} href={`${VLLM_0240}/vllm/engine/arg_utils.py`} kind="code">
              vLLM v0.24.0 arg_utils.py
            </Cite>
            , so the queue limits in sections 4 and 27 are unavailable on a Neuron server.
          </Alert>

          <ExpandableSection headerText="Three code paths and the status of each">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>vllm-neuron 1.x (current, Beta).</strong> The plugin repository at{' '}
                <Cite tier={1} href={VN_TREE}>
                  vllm-project/vllm-neuron at v0.24.0.1.1.0
                </Cite>
                , documented at{' '}
                <Cite tier={1} href={NEURON_VLLM_DOCS}>
                  Neuron docs: vLLM Neuron
                </Cite>
                . The 1.x line began with v0.21.0.1.0.0 (2026-07-20){' '}
                <Cite tier={1} href={VN_REL_021}>
                  vllm-neuron v0.21.0.1.0.0 release notes
                </Cite>
                .
              </Box>
              <Box variant="p">
                <strong>vllm-neuron 0.5.x on NxD Inference (maintenance).</strong> Documented in{' '}
                <Cite tier={1} href={NXDI_VLLM}>
                  Neuron docs: vLLM on Neuron (NxD Inference)
                </Cite>
                , with a migration path to the 1.x line in{' '}
                <Cite tier={1} href={VN_MIGRATION}>
                  vllm-neuron migration guide
                </Cite>
                .
              </Box>
              <Box variant="p">
                <strong>aws-neuron/upstreaming-to-vllm (archived).</strong> AWS&apos;s fork of vLLM is
                archived on GitHub; its last push was on 2026-06-09 and its last release is Neuron
                2.26.1 (2025-10-29){' '}
                <Cite tier={1} href={FORK}>
                  aws-neuron/upstreaming-to-vllm (archived)
                </Cite>
                .
              </Box>
              <Box variant="p">
                <strong>vLLM&apos;s own documentation.</strong> The v0.10.1 docs carry an AWS Neuron
                installation page{' '}
                <Cite tier={1} href={VLLM_0101_NEURON}>
                  vLLM v0.10.1 docs: AWS Neuron installation
                </Cite>
                . The v0.31.0 docs have none; their installation index points to hardware plugins that
                live outside the main repository{' '}
                <Cite tier={1} href={vllmDocsUrl('getting_started/installation/')}>
                  vLLM docs: Installation, Hardware Plugins
                </Cite>
                .
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      {/* ---------------------------------------------------------------- */}
      {/* Feature support matrix                                           */}
      {/* ---------------------------------------------------------------- */}
      <Container
        header={
          <Header
            variant="h2"
            description="What a GPU vLLM design keeps, gains and loses on the 1.x plugin, so you can rule Trainium in or out before you size anything"
          >
            Feature matrix for the 1.x plugin
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Start with the model list, because it is short. The README&apos;s end-to-end tested
            models are Llama 3 (1B, 8B, 70B), GPT-OSS (20B, 120B), Qwen3-VL 32B and Qwen3-Embedding
            8B, all on Trn2 and Trn3{' '}
            <Cite tier={1} href={`${VN_README}#L31-L46`}>
              vllm-neuron README L31-L46
            </Cite>
            . Then check each feature your design needs. In the table, TP, SP, DP, EP and CP are
            tensor, sequence, data, expert and context parallelism; EAGLE is Extrapolation Algorithm
            for Greater Language-model Efficiency, MTP is multi-token prediction and LoRA is
            Low-Rank Adaptation; 1P1D and xPyD mean one prefill and one decode server, or several of
            each.
          </Box>
          <Table
            items={featureRows}
            columnDefinitions={[
              { id: 'feature', header: 'Feature', cell: (r) => r.feature, minWidth: 190 },
              { id: 'status', header: '1.x plugin', cell: (r) => statusBadge(r.status), minWidth: 120 },
              { id: 'notes', header: 'Notes', cell: (r) => r.notes, minWidth: 340 },
            ]}
            variant="embedded"
            wrapLines
          />
          <Box variant="small" color="text-body-secondary">
            Status from the README feature table, where Supported means &quot;integrated and tested
            for at least one model&quot;, so check the model&apos;s recipe too{' '}
            <Cite tier={1} href={`${VN_README}#L50-L101`}>
              vllm-neuron README L50-L101
            </Cite>
            . EAGLE3 and the draft-model limit come from the features and migration guides{' '}
            <Cite tier={1} href={`${VN_FEATURES}#L515-L532`}>
              features guide L515-L532
            </Cite>{' '}
            <Cite tier={1} href={`${VN_MIGRATION}#L47`}>
              migration guide L47
            </Cite>
            ; v0.24.0.1.1.0 adds EAGLE3 for GPT-OSS with a Speculators draft checkpoint{' '}
            <Cite tier={1} href={VN_REL_024}>
              vllm-neuron v0.24.0.1.1.0 release notes
            </Cite>
            . EPD keeps prefill and decode in one engine{' '}
            <Cite tier={1} href={`${VN_FEATURES}#L828-L837`}>
              features guide L828-L837
            </Cite>
            . The LoRA fallback is from the v0.21.0.1.0.0 known issues{' '}
            <Cite tier={1} href={VN_REL_021}>
              v0.21.0.1.0.0 release notes
            </Cite>
            . The executor rule is in the plugin code{' '}
            <Cite tier={1} href={`${VN_PLATFORM}#L361-L369`} kind="code">
              platform.py L361-L369
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      {/* ---------------------------------------------------------------- */}
      {/* Configuration that differs from GPU                               */}
      {/* ---------------------------------------------------------------- */}
      <Container
        header={
          <Header
            variant="h2"
            description="Four places where a GPU or 0.5.x launch command carries over wrong, and the form the 1.x plugin expects"
          >
            Configure it the Neuron way
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>1. Quantization goes under <code>neuron_config</code>.</strong> Neuron-specific
            options travel in vLLM&apos;s <code>--additional-config</code>, nested under{' '}
            <code>neuron_config</code>{' '}
            <Cite tier={1} href={`${VN_CONFIG}#L9-L32`}>
              vllm-neuron configuration reference L9-L32
            </Cite>
            , and the plugin reads the quantization choice from that key{' '}
            <Cite tier={1} href={`${VN_PLATFORM}#L493-L494`} kind="code">
              platform.py L493-L494
            </Cite>
            . MXFP4 weights for gpt-oss on Trn3 look like this; on Trn2 the same setting fails at
            startup{' '}
            <Cite tier={1} href={`${VN_FEATURES}#L356-L369`}>
              features guide L356-L369
            </Cite>
            :
          </Box>
          <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{String.raw`vllm serve openai/gpt-oss-120b \
    --tensor-parallel-size 64 \
    --additional-config '{"neuron_config": {"quantization": "mxfp4"}}'`}</pre>
          <Box variant="p">
            FP8 weights come from a calibrated checkpoint&apos;s <code>quantization_config</code>,
            and an FP8 KV cache uses vLLM&apos;s own <code>--kv-cache-dtype fp8</code>{' '}
            <Cite tier={1} href={`${VN_FEATURES}#L336-L395`}>
              features guide L336-L395
            </Cite>
            . Leave <code>--quantization</code> unset on every path{' '}
            <Cite tier={1} href={`${VN_CONFIG}#L109-L121`}>
              configuration reference L109-L121
            </Cite>
            .
          </Box>

          <Box variant="p">
            <strong>2. Long prompts use segmented prefill.</strong> Prompts longer than{' '}
            <code>--max-num-batched-tokens</code> run over several iterations: with 8192, a 32K
            prompt takes four. Prefill and decode always run in separate batches on Neuron{' '}
            <Cite tier={1} href={`${VN_FEATURES}#L128-L152`}>
              features guide L128-L152
            </Cite>
            , so latency targets set from GPU mixed batching (section 4) do not transfer. If chunked
            prefill is enabled, the plugin logs a warning that Neuron chunks prefills only at batch
            size 1 and never mixes them with decode{' '}
            <Cite tier={1} href={`${VN_PLATFORM}#L374-L379`} kind="code">
              platform.py L374-L379
            </Cite>
            .
          </Box>

          <Box variant="p">
            <strong>3. Prefill/decode uses the Neuron NIXL connector.</strong> Disaggregated serving
            moves the KV cache over NIXL with the LIBFABRIC backend on EFA, and needs{' '}
            <code>libcuda.so.1</code> and <code>libfabric.so.1</code> on the loader path{' '}
            <Cite tier={1} href={`${VN_FEATURES}#L298-L313`}>
              features guide L298-L313
            </Cite>
            . Name the connector <code>NeuronNixlConnector</code>; the plugin fills in its module
            path{' '}
            <Cite tier={1} href={`${VN_PLATFORM}#L753-L769`} kind="code">
              platform.py L753-L769
            </Cite>
            . The prefill server in the plugin&apos;s gpt-oss example passes the setting below, and
            the decode server runs as <code>kv_consumer</code>{' '}
            <Cite tier={1} href={VN_DI_EXAMPLE}>
              vllm-neuron example: gpt-oss 120B multinode_DI
            </Cite>
            :
          </Box>
          <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{String.raw`--kv-transfer-config '{"kv_connector": "NeuronNixlConnector", "kv_role": "kv_producer",
  "kv_buffer_device": "cuda", "kv_connector_extra_config": {"backends": ["LIBFABRIC"]}}'`}</pre>
          <Box variant="p">
            The example runs prefill and decode on two instances with EFA between them, and sets{' '}
            <code>VLLM_NIXL_SIDE_CHANNEL_HOST</code> and <code>VLLM_NIXL_SIDE_CHANNEL_PORT</code> so
            the peer can reach the side channel{' '}
            <Cite tier={1} href={`${VN}/examples/vllm_neuron/models/gpt_oss/120b/mxfp4/multinode_DI/run_prefill.sh#L26-L29`} kind="code">
              run_prefill.sh L26-L29
            </Cite>
            . The EFA side (which node posts the transfer, the side-channel host each node
            advertises, the two-host test before the first transfer) is section 22.
          </Box>

          <Box variant="p">
            <strong>4. A 0.5.x launch command needs translating.</strong> The 1.x plugin needs no{' '}
            <code>--device neuron</code> flag and no <code>VLLM_NEURON_FRAMEWORK</code> variable.
            Settings move from <code>--override-neuron-config</code> into{' '}
            <code>--additional-config</code> under <code>neuron_config</code>, and some fields are
            renamed: <code>context_encoding_buckets</code> becomes{' '}
            <code>num_batched_tokens_buckets</code>{' '}
            <Cite tier={1} href={`${VN_MIGRATION}#L87-L108`}>
              migration guide L87-L108
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      {/* ---------------------------------------------------------------- */}
      {/* Rufus case study                                                  */}
      {/* ---------------------------------------------------------------- */}
      <Container
        header={
          <Header
            variant="h2"
            description="A production-scale multi-node Trainium deployment, and which parts of its architecture carry over to the current plugin"
          >
            Case study: Amazon Rufus on Trainium
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Amazon&apos;s Rufus shopping assistant serves its model with vLLM on Trainium. AWS
            describes serving &quot;at production scale using tens of thousands of TRN1
            instances&quot; and launching a larger model &quot;across over tens of thousands of AWS
            Trainium chips&quot; for Prime Day traffic{' '}
            <Cite tier={2} href={RUFUS}>
              AWS ML blog: How Amazon scaled Rufus
            </Cite>
            .
          </Box>

          <ExpandableSection headerText="How the Rufus deployment is built: leader, followers, collectives">
            <SpaceBetween size="s">
              <ColumnLayout columns={2} variant="text-grid">
                <div>
                  <Box variant="h3">Leader node</Box>
                  <Box variant="p">
                    &quot;Runs the Triton Inference Server and vLLM engine, serving as the primary
                    orchestration unit for inference.&quot; After scheduling, requests go to &quot;the
                    NeuronWorker component in vLLM, which handles broadcasting model inputs&quot;.
                  </Box>
                </div>
                <div>
                  <Box variant="h3">Follower nodes</Box>
                  <Box variant="p">
                    Each follower &quot;operates as an independent process and acts as a wrapper around
                    the vLLM NeuronWorker component&quot;, listening for the inputs the leader broadcasts.
                  </Box>
                </div>
              </ColumnLayout>

              <Box variant="p">
                Cross-node collectives &quot;are managed by the Neuron Distributed Inference (NxDI)
                library, which uses EFA to deliver high-bandwidth, low-latency inter-node
                communication.&quot; The deployment pairs nodes with the EC2 DescribeInstanceTopology API
                and runs each multi-node unit on Amazon ECS (Elastic Container Service){' '}
                <Cite tier={2} href={RUFUS}>
                  AWS ML blog: How Amazon scaled Rufus
                </Cite>
                . Section 23 (EC2 Topology &amp; Placement Groups) covers the topology API.
              </Box>
            </SpaceBetween>
          </ExpandableSection>

          <Alert type="info" header="What carries over to a new design">
            The blog is AWS&apos;s account of a leader/follower vLLM deployment running on Trainium
            at very large scale. Its stack runs on Trn1, with collectives in NxD Inference, the
            library under today&apos;s 0.5.x maintenance line; Trn1 is outside the 1.x
            plugin&apos;s instance list. The 1.x plugin&apos;s multi-instance pattern is
            prefill/decode across instances over EFA, and its README does not list multi-node tensor
            parallelism for a single replica. Use Rufus as a pattern reference, and design a new
            deployment from what the 1.x plugin lists.
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
            description="A capability decision you can make before any benchmark, ending with the checks to run first"
          >
            When Trainium for vLLM
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Lean toward Trainium when</Box>
              <ul>
                <li>Your model is in the tested list: Llama 3, GPT-OSS, Qwen3-VL 32B or Qwen3-Embedding 8B.</li>
                <li>
                  Your feature set sits inside the matrix: continuous batching, prefix caching,
                  EAGLE3, structured outputs and tool calling, image or video input, EP for MoE
                  (mixture-of-experts) models, and prefill/decode disaggregation over EFA.
                </li>
                <li>You run on Trn2 or Trn3 and can follow the Neuron SDK release rhythm.</li>
                <li>Your serving design works on vLLM 0.24.0.</li>
              </ul>
            </div>
            <div>
              <Box variant="h3">Stay on GPU vLLM when</Box>
              <ul>
                <li>You serve LoRA adapters, or need pipeline parallelism, chunked prefill, KV offload or audio input.</li>
                <li>Your model is outside the four tested families.</li>
                <li>You need a feature that landed after vLLM 0.24.0, which includes everything this dive dates to v0.25 or later.</li>
                <li>Your only capacity is Trn1 or Inf2 and you will not build on the maintenance line.</li>
              </ul>
            </div>
          </ColumnLayout>
          <Box variant="p">
            These lists cover capability. Cost and throughput depend on the model, the sequence
            lengths and the Trainium or GPU generation, so benchmark your own workload rather than
            porting a published ratio. The hardware economics are in the{' '}
            <Link external href="../silicon-memory-inference/">
              Silicon, Memory &amp; Inference
            </Link>{' '}
            deep dive.
          </Box>
          <Box variant="p">
            <strong>Next step.</strong> Find your model in the README&apos;s tested list at the
            plugin tag, check every feature against the matrix above, and read each vLLM flag you
            depend on against 0.24.0. If all three pass, start from the Neuron 2.32.0 DLC or DLAMI,
            which ships vllm-neuron 0.24.0.1.1.0, and point <code>NEURON_COMPILED_ARTIFACTS</code> at
            the first boot&apos;s compiled artifacts for every node after it.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
