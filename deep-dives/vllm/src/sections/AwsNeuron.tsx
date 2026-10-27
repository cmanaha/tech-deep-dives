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
// Sources. vllm-neuron is pinned to tag v0.29.0.1.2.0 (commit eb6cb360), the
// plugin release in Neuron SDK 2.33.0 (2026-10-19). The plugin pins vLLM 0.29.0
// (commit 98dff2a8): citations about what a Neuron server runs use that tag, and
// every other vLLM citation stays on the dive's v0.31.0. AWS Neuron
// documentation is pinned to its versioned /en/v2.33.0/ URLs. Claim register:
// research/2026-10-refresh/09-neuron-2-33-repin.md.
// ---------------------------------------------------------------------------
const NEURON_ACCESSED = '2026-10-24';
const VN_TAG = 'v0.29.0.1.2.0';
const VN = `https://github.com/vllm-project/vllm-neuron/blob/${VN_TAG}`;
const VN_TREE = `https://github.com/vllm-project/vllm-neuron/tree/${VN_TAG}`;
const VN_README = `${VN}/README.md?plain=1`;
const VN_FEATURES = `${VN}/docs/guides/features-guide.md?plain=1`;
const VN_CONFIG = `${VN}/docs/guides/reference-configuration.md?plain=1`;
const VN_MIGRATION = `${VN}/docs/getting-started/migration-nxdi-to-vllm-neuron.md?plain=1`;
const VN_PLATFORM = `${VN}/vllm_neuron/vllm/platform.py`;
const VN_ENVS = `${VN}/vllm_neuron/envs.py`;
const VN_INIT = `${VN}/vllm_neuron/__init__.py`;
const VN_CORE_REQ = `${VN}/requirements/core.txt`;
const VN_MRV2_POLICY = `${VN}/vllm_neuron/vllm/model_runner_v2_policy.py`;
const VN_RUNNER_V1 = `${VN}/vllm_neuron/vllm/worker/neuron_model_runner.py`;
const VN_DI_EXAMPLE = `${VN_TREE}/examples/vllm_neuron/models/gpt_oss/120b/mxfp4/multinode_DI`;
const VN_REL_021 = 'https://github.com/vllm-project/vllm-neuron/releases/tag/v0.21.0.1.0.0';
const VN_REL_029 = 'https://github.com/vllm-project/vllm-neuron/releases/tag/v0.29.0.1.2.0';
// The published libtorch-neuronx-lite wheel the plugin installs (no public source
// tree; sha256 05b98492...b735bc). Paths in the visible titles are inside the wheel.
const LITE_WHEEL =
  'https://pip.repos.neuron.amazonaws.com/libtorch-neuronx-lite/libtorch_neuronx_lite-2.13.0.1.0.3112%2B653bc48f-cp312-cp312-linux_x86_64.whl';
const NEURON_DOCS = 'https://awsdocs-neuron.readthedocs-hosted.com/en/v2.33.0';
const NEURON_WHATS_NEW = `${NEURON_DOCS}/about-neuron/whats-new.html`;
const NEURON_VLLM_DOCS = `${NEURON_DOCS}/vllm-neuron/docs/index.html`;
const NEURON_VLLM_TORCHNEURON = `${NEURON_DOCS}/vllm-neuron/docs/design/compilation/how_vllm_is_integrated_with_torchneuron.html`;
const NEURON_VLLM_ROUTE = `${NEURON_DOCS}/vllm-neuron/docs/guides/how-to-choose-compilation-route.html`;
const NEURON_VLLM_PRECOMPILE = `${NEURON_DOCS}/vllm-neuron/docs/guides/how-to-precompile-cache.html`;
const NEURON_DLC_RN = `${NEURON_DOCS}/release-notes/components/containers.html`;
const NEURON_DLAMI_RN = `${NEURON_DOCS}/release-notes/components/dlamis.html`;
const EOS_NXDI = `${NEURON_DOCS}/about-neuron/announcements/neuron2.x/announce-eos-nxdi-nxd-core-inference.html`;
const EOS_VLLM_XLA = `${NEURON_DOCS}/about-neuron/announcements/neuron2.x/announce-eos-vllm-neuron-torch-xla.html`;
const NXDI_RN = `${NEURON_DOCS}/release-notes/archive/nxd-inference.html`;
const NXDI_VLLM = `${NEURON_DOCS}/inference-legacy/nxd-inference/developer_guides/vllm-user-guide-v1.html`;
const FORK = 'https://github.com/aws-neuron/upstreaming-to-vllm/tree/c4f76254591e9113f01cbed6684efd735ba3cb81';
const VLLM_0101_NEURON = 'https://docs.vllm.ai/en/v0.10.1/getting_started/installation/aws_neuron.html';
const VLLM_0290 = 'https://github.com/vllm-project/vllm/blob/v0.29.0';
const RUFUS =
  'https://aws.amazon.com/blogs/machine-learning/how-amazon-scaled-rufus-by-building-multi-node-inference-using-aws-trainium-chips-and-vllm/';

// ---------------------------------------------------------------------------
// Plugin version table (vllm-neuron README "Version", L137-L142 at the tag).
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
  { plugin: '0.29.0.1.2.0 (latest)', vllm: '0.29.0', sdk: '2.33', nxdi: 'Not required', instances: 'Trn2, Trn3', status: 'Beta' },
  { plugin: '0.24.0.1.1.0', vllm: '0.24.0', sdk: '2.32', nxdi: 'Not required', instances: 'Trn2, Trn3', status: 'Beta' },
  { plugin: '0.21.0.1.0.0', vllm: '0.21.0', sdk: '2.31', nxdi: 'Not required', instances: 'Trn2, Trn3', status: 'Beta' },
  { plugin: '0.5.3', vllm: '0.16.0', sdk: '2.31', nxdi: '0.10.x', instances: 'Trn1, Trn2, Trn3, Inf2', status: 'Maintenance' },
];

// ---------------------------------------------------------------------------
// Feature matrix for the 1.x plugin (README "Features" table at the tag, plus
// the features guide and the plugin code for the mechanics).
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
    feature: 'Model Runner V2',
    status: 'Supported',
    notes: (
      <>
        The default for dense text models. MoE, sliding-window and multimodal models, and
        speculative decoding, structured outputs or CPU sampling, run on Model Runner V1. The
        worker logs <code>Using the standalone V2 Neuron model runner.</code> when V2 is active.
      </>
    ),
  },
  {
    feature: 'Speculative decoding: EAGLE3, DFlash',
    status: 'Supported',
    notes: (
      <>
        Set through <code>--speculative-config</code> with <code>{'"method": "eagle3"'}</code> or{' '}
        <code>{'"method": "dflash"'}</code>; the plugin rejects any other method, so plain
        draft-model speculation is not available. Runs on Model Runner V1.
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
    notes: 'A workload that depends on LoRA stays on the 0.5.x line with NxD Inference, whose support on Trn2 and Trn3 ends in Neuron 2.34.',
  },
  {
    feature: 'Sleep mode and weight reload',
    status: 'Not supported',
    notes: 'The sleep and wake_up API in section 27 and the weight reload API are not available.',
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
    status: 'Supported',
    notes: (
      <>
        Tested on Qwen3-ASR 1.7B: speech-to-text through the OpenAI-compatible{' '}
        <code>/v1/audio/transcriptions</code> endpoint.
      </>
    ),
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
    notes: 'The supported splits are TP, SP, DP, EP and CP.',
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
      viewBox="0 0 860 484"
      role="img"
      aria-labelledby="neuron-stack-title"
      style={{ width: '100%', minWidth: 640, height: 'auto' }}
    >
      <title id="neuron-stack-title">
        Two vllm-neuron lines under the same vLLM serving surface. On the current 1.x line, vLLM 0.29.0
        sits on the vllm-neuron 0.29.0.1.2.0 platform plugin, which carries its own worker, scheduler,
        model runners, model implementations and NKI kernels. Below it, libtorch-neuronx-lite, a
        separate package with its own copy of the TorchNeuron lowering, compiles each graph through
        torch.compile to StableHLO and then with neuronx-cc to one NEFF per bucket on PyTorch 2.13; the
        deprecated XLA route ends in Neuron 2.34. The NEFFs run on the Neuron runtime on Trn2 and Trn3,
        with no NxD Inference layer. On the 0.5.x line, in maintenance, vLLM 0.16.0 sits on plugin
        0.5.3, which hands the model to NxD Inference 0.10.x, whose support on Trn2 and Trn3 ends in
        Neuron 2.34; it is the only line listed for Trn1 and Inf2.
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
      <rect x={0} y={0} width={860} height={484} rx={8} fill="#ffffff" />

      {/* Column headers */}
      <text className="nsd-h" x={34} y={28}>vllm-neuron 1.x: current (Beta)</text>
      <text className="nsd-hs" x={34} y={46}>Neuron 2.33, vLLM 0.29.0, no NxD Inference</text>
      <text className="nsd-h" x={524} y={28}>vllm-neuron 0.5.x: maintenance</text>
      <text className="nsd-hs" x={524} y={46}>Neuron 2.31, vLLM 0.16.0, NxD Inference 0.10.x</text>

      {/* Row 1: vLLM engine */}
      <rect x={20} y={60} width={460} height={54} rx={8} fill="#f2f8fd" stroke="#0972d3" strokeWidth={1.5} />
      <text className="nsd-t" x={34} y={83}>vLLM 0.29.0 engine (upstream code)</text>
      <text className="nsd-s" x={34} y={101}>vllm serve, OpenAI-compatible server, flags, metrics, KV block API</text>
      <rect x={510} y={60} width={330} height={54} rx={8} fill="#f4f4f4" stroke="#879596" strokeWidth={1.5} strokeDasharray="6 4" />
      <text className="nsd-t" x={524} y={83}>vLLM 0.16.0 engine</text>
      <text className="nsd-s" x={524} y={101}>vllm serve, OpenAI-compatible server</text>

      {/* Left: the plugin (NxD Inference folded in) */}
      <line className="nsd-arr" x1={250} y1={114} x2={250} y2={132} />
      <rect x={20} y={134} width={460} height={128} rx={8} fill="#ecf7ec" stroke="#037f0c" strokeWidth={1.5} />
      <text className="nsd-t" x={34} y={157}>vllm-neuron 0.29.0.1.2.0 platform plugin</text>
      <text className="nsd-s" x={34} y={177}>Registers through the vllm.platform_plugins entry point</text>
      <text className="nsd-s" x={34} y={194}>NeuronWorker and NeuronScheduler replace vLLM&apos;s defaults</text>
      <text className="nsd-s" x={34} y={211}>Model Runner V2: dense models. V1: MoE, spec decode, multimodal</text>
      <text className="nsd-s" x={34} y={228}>Model implementations and NKI kernels ship in the plugin</text>
      <text className="nsd-s" x={34} y={245}>KV transfer: NeuronNixlConnector over EFA (LIBFABRIC)</text>

      {/* Left: the compile layer */}
      <line className="nsd-arr" x1={250} y1={262} x2={250} y2={280} />
      <rect x={20} y={282} width={460} height={90} rx={8} fill="#e6f4f2" stroke="#1f7a70" strokeWidth={1.5} />
      <text className="nsd-t" x={34} y={305}>libtorch-neuronx-lite: torch.compile, native route</text>
      <text className="nsd-s" x={34} y={325}>Own copy of the TorchNeuron lowering; torch-neuronx is not used</text>
      <text className="nsd-s" x={34} y={342}>FX graph to StableHLO, then neuronx-cc: one NEFF per bucket</text>
      <text className="nsd-s" x={34} y={359}>PyTorch 2.13. XLA route (deprecated) ends in Neuron 2.34</text>

      {/* Right: plugin, then NxD Inference */}
      <line className="nsd-arr" x1={675} y1={114} x2={675} y2={132} />
      <rect x={510} y={134} width={330} height={54} rx={8} fill="#f4f4f4" stroke="#879596" strokeWidth={1.5} strokeDasharray="6 4" />
      <text className="nsd-t" x={524} y={157}>vllm-neuron 0.5.3 plugin</text>
      <text className="nsd-s" x={524} y={175}>Thin worker; NxD Inference runs the model</text>
      <line className="nsd-arr" x1={675} y1={188} x2={675} y2={206} />
      <rect x={510} y={208} width={330} height={72} rx={8} fill="#efe7fb" stroke="#6f4cc4" strokeWidth={1.5} strokeDasharray="6 4" />
      <text className="nsd-t" x={524} y={231}>NxD Inference 0.10.x</text>
      <text className="nsd-s" x={524} y={250}>Model code, sharding, compilation, kernels</text>
      <text className="nsd-s" x={524} y={267}>Trn2 and Trn3 support ends in Neuron 2.34</text>

      {/* Bottom row: runtime and instances */}
      <line className="nsd-arr" x1={250} y1={372} x2={250} y2={390} />
      <rect x={20} y={392} width={460} height={54} rx={8} fill="#eef1f4" stroke="#414d5c" strokeWidth={1.5} />
      <text className="nsd-t" x={34} y={415}>Neuron runtime on Trn2 and Trn3</text>
      <text className="nsd-s" x={34} y={433}>NeuronCores; EFA between instances for prefill/decode</text>
      <line className="nsd-arr" x1={675} y1={280} x2={675} y2={390} />
      <rect x={510} y={392} width={330} height={54} rx={8} fill="#f4f4f4" stroke="#879596" strokeWidth={1.5} strokeDasharray="6 4" />
      <text className="nsd-t" x={524} y={415}>Trn1, Trn2, Trn3, Inf2</text>
      <text className="nsd-s" x={524} y={433}>Trn1 / Inf2 NKI kernels: pin Neuron 2.28</text>

      <text className="nsd-foot" x={430} y={472}>
        Dashed: the maintenance line, with no new feature releases. Teal: the compile layer the plugin installs.
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
            description="Run vLLM on Trainium through the vLLM Neuron plugin: pick the plugin line from your instance family, check the feature matrix, set the compile path, and plan around the plugin's vLLM 0.29.0 pin (verified against vLLM v0.31.0, commit db9527a4, vllm-neuron v0.29.0.1.2.0, commit eb6cb360, and Neuron SDK 2.33.0, 2026-10-24)"
          >
            21. vLLM on AWS Neuron (Trainium / Inferentia)
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>What it is.</strong> vLLM reaches AWS Trainium through the vLLM Neuron plugin,{' '}
            <code>vllm-neuron</code>, &quot;the recommended serving solution for large language
            models on AWS Trainium&quot;{' '}
            <Cite tier={1} href={`${VN_README}#L3`} accessed={NEURON_ACCESSED}>
              vllm-neuron README L3
            </Cite>
            . vLLM v0.31.0 has no Neuron platform of its own: its built-in platforms are TPU, CUDA,
            ROCm, XPU and CPU{' '}
            <Cite tier={1} href={vllmUrl('vllm/platforms/__init__.py', 'L231-L237')} kind="code" accessed={NEURON_ACCESSED}>
              platforms/__init__.py L231-L237
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>The mental model.</strong> What clients and operators touch is vLLM&apos;s own:{' '}
            <code>vllm serve</code>, the OpenAI-compatible server, the flags and the metrics. The
            plugin swaps in its own scheduler and worker underneath and runs the model on NeuronCores,
            and it comes in two lines. The current 1.x line keeps the model implementations inside the
            plugin, compiles them through PyTorch&apos;s <code>torch.compile</code>, and drops NxD
            Inference (NeuronX Distributed Inference): &quot;NxD Inference is no longer a
            dependency&quot;{' '}
            <Cite tier={1} href={`${VN_README}#L135`} accessed={NEURON_ACCESSED}>
              vllm-neuron README L135
            </Cite>
            . The 0.5.x line hands the model to NxD Inference, which is &quot;in maintenance mode; no new feature releases are planned. Migrate
            to vLLM Neuron&quot;{' '}
            <Cite tier={1} href={NEURON_WHATS_NEW} accessed={NEURON_ACCESSED}>
              Neuron docs: What&apos;s New, 2.32.0 software lifecycle updates
            </Cite>
            , and whose support on Trn2 and Trn3 ends in Neuron 2.34{' '}
            <Cite tier={1} href={EOS_NXDI} accessed={NEURON_ACCESSED}>
              Neuron docs: NxD Inference end-of-support announcement
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>The version gap.</strong> The current plugin, 0.29.0.1.2.0, pins{' '}
            <strong>vLLM 0.29.0</strong>{' '}
            <Cite tier={1} href={`${VN_CORE_REQ}#L13-L14`} kind="code" accessed={NEURON_ACCESSED}>
              vllm-neuron requirements/core.txt L13-L14
            </Cite>{' '}
            <Cite tier={1} href={`${VN_README}#L137-L142`} accessed={NEURON_ACCESSED}>
              vllm-neuron README L137-L142
            </Cite>
            . A Trainium server therefore runs vLLM 0.29.0, two minor releases behind the v0.31.0
            this dive describes, and every flag or behaviour this dive dates after 0.29.0 is missing
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
            description="What the 1.x plugin replaces, what compiles your model and where NxD Inference went, so you can place any Neuron deployment on its line"
          >
            Two plugin lines, one serving surface
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Both lines keep vLLM on top and the Neuron runtime at the bottom. They differ in the
            middle. On the 1.x line the plugin carries the model code and the NKI (Neuron Kernel
            Interface) kernels, and a compile package it installs turns each model graph into
            NEFFs (Neuron Executable File Format), the programs Trainium runs, through
            TorchNeuron&apos;s lowering, with XLA (Accelerated Linear
            Algebra) as a deprecated second route. On the 0.5.x line the plugin is a worker over NxD Inference, which owns
            the model.
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <NeuronStackDiagram />
          </div>
          <Box variant="small" color="text-body-secondary">
            Schematic. Illustrative, not measured. Versions and instance lists come from the plugin
            README&apos;s version table{' '}
            <Cite tier={1} href={`${VN_README}#L133-L142`} accessed={NEURON_ACCESSED}>
              vllm-neuron README L133-L142
            </Cite>
            ; the compile layer from the plugin&apos;s TorchNeuron integration guide{' '}
            <Cite tier={1} href={NEURON_VLLM_TORCHNEURON} accessed={NEURON_ACCESSED}>
              Neuron docs: How vLLM is integrated with TorchNeuron
            </Cite>
            ; the 2.34 end dates from the end-of-support announcements{' '}
            <Cite tier={1} href={EOS_VLLM_XLA} accessed={NEURON_ACCESSED}>
              Neuron docs: Torch/XLA path in vLLM Neuron, end of support
            </Cite>
            ; the Trn1 / Inf2 pin from the NxD Inference release notes{' '}
            <Cite tier={1} href={NXDI_RN} accessed={NEURON_ACCESSED}>
              Neuron docs: NxD Inference release notes
            </Cite>
            .
          </Box>
          <ExpandableSection headerText="Code behind the plugin layer">
            <Box variant="p">
              On the 1.x line the plugin sets vLLM&apos;s worker class to <code>NeuronWorker</code>{' '}
              <Cite tier={1} href={`${VN_PLATFORM}#L728-L731`} kind="code" accessed={NEURON_ACCESSED}>
                vllm-neuron platform.py L728-L731
              </Cite>
              , replaces the default scheduler with <code>NeuronScheduler</code> (or{' '}
              <code>NeuronAsyncScheduler</code> under async scheduling){' '}
              <Cite tier={1} href={`${VN_PLATFORM}#L806-L819`} kind="code" accessed={NEURON_ACCESSED}>
                platform.py L806-L819
              </Cite>
              , and ships its own <code>model</code> and <code>nki</code> packages{' '}
              <Cite tier={1} href={`${VN_TREE}/vllm_neuron`} kind="code" accessed={NEURON_ACCESSED}>
                vllm-neuron vllm_neuron/
              </Cite>
              . Inside the worker, Model Runner V2 is the default for dense models; MoE
              (mixture-of-experts) models, speculative decoding and multimodal models run on Model
              Runner V1{' '}
              <Cite tier={1} href={VN_REL_029} accessed={NEURON_ACCESSED}>
                vllm-neuron v0.29.0.1.2.0 release notes
              </Cite>{' '}
              <Cite tier={1} href={`${VN_MRV2_POLICY}#L174-L230`} kind="code" accessed={NEURON_ACCESSED}>
                model_runner_v2_policy.py L174-L230
              </Cite>
              .
            </Box>
          </ExpandableSection>
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
            <Cite tier={1} href={`${VN_README}#L133-L142`} accessed={NEURON_ACCESSED}>
              vllm-neuron README L133-L142
            </Cite>
            . From 0.21.0 the plugin version reads <code>{'<vLLM version>.<plugin version>'}</code>,
            so <code>0.29.0.1.2.0</code> is vLLM 0.29.0 with plugin 1.2.0 and the vLLM pin is readable
            from the package name. Each of the last three SDK releases moved the pin: vLLM 0.21.0 with
            Neuron 2.31, 0.24.0 with Neuron 2.32, then 0.29.0 with Neuron 2.33.
          </Box>

          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Trn2 and Trn3: the 1.x plugin</Box>
              <Box variant="p">
                Design new work here. Neuron 2.33.0 (2026-10-19) is the latest SDK release{' '}
                <Cite tier={1} href={NEURON_WHATS_NEW} accessed={NEURON_ACCESSED}>
                  Neuron docs: What&apos;s New, 2.33.0
                </Cite>
                , and its vLLM DLAMIs (Deep Learning Amazon Machine Images) and vLLM DLC (Deep
                Learning Container) ship vLLM 0.29.0 with vllm-neuron 0.29.0.1.2.0{' '}
                <Cite tier={1} href={NEURON_DLAMI_RN} accessed={NEURON_ACCESSED}>
                  Neuron docs: DLAMI release notes
                </Cite>{' '}
                <Cite tier={1} href={NEURON_DLC_RN} accessed={NEURON_ACCESSED}>
                  Neuron docs: Containers release notes
                </Cite>
                ; the 2.33.0 DLCs are published on Ubuntu 26.04 only{' '}
                <Cite tier={1} href={NEURON_WHATS_NEW} accessed={NEURON_ACCESSED}>
                  Neuron docs: What&apos;s New, 2.33.0
                </Cite>
                . The 0.29.0.1.2.0 release notes claim GPT-OSS-120B system-level and per-user
                throughput up to about 2.5x that of the Neuron 2.32 release on Trn3 with MXFP4 weights
                and a packed FP8 KV cache, measured at batch size 128; the gain varies by batch size{' '}
                <Cite tier={1} href={VN_REL_029} accessed={NEURON_ACCESSED}>
                  vllm-neuron v0.29.0.1.2.0 release notes
                </Cite>
                . Each 2.x.0 SDK release since 2.28.0 (2026-02-26) has come 41 to 63 days after the
                one before{' '}
                <Cite tier={1} href={NEURON_WHATS_NEW} accessed={NEURON_ACCESSED}>
                  Neuron docs: What&apos;s New, release dates
                </Cite>
                : re-read the version table and rerun your benchmark at each one.
              </Box>
            </div>
            <div>
              <Box variant="h3">Trn1 and Inf2: the 0.5.x line only</Box>
              <Box variant="p">
                The README lists plugin 0.5.3 (vLLM 0.16.0,
                Neuron 2.31) for Trn1 and Inf2, while the NxD Inference release notes say &quot;NxD
                Inference models are now only supported on Trn2 and newer hardware&quot; and that
                customers who need NxD Inference kernel support on Trn1 or Inf2 &quot;should pin to
                release 2.28&quot;{' '}
                <Cite tier={1} href={NXDI_RN} accessed={NEURON_ACCESSED}>
                  Neuron docs: NxD Inference release notes
                </Cite>
                . The two AWS pages disagree. If a Trn1 or Inf2 deployment needs NxD Inference
                kernels, plan to the 2.28 pin the release notes give. On Trn1 and Inf2, NxD Inference
                remains &quot;in maintenance mode at Neuron SDK 2.31&quot; with critical bug fixes and
                security patches only{' '}
                <Cite tier={1} href={EOS_NXDI} accessed={NEURON_ACCESSED}>
                  Neuron docs: NxD Inference end-of-support announcement
                </Cite>
                . Neuron 2.32.0 also stopped publishing the legacy vLLM 0.16 DLC
                (<code>pytorch-inference-vllm-neuronx</code>): &quot;Use a 2.31.0 or earlier image if
                required&quot;{' '}
                <Cite tier={1} href={NEURON_WHATS_NEW} accessed={NEURON_ACCESSED}>
                  Neuron docs: What&apos;s New, 2.32.0
                </Cite>
                .
              </Box>
            </div>
          </ColumnLayout>

          <ExpandableSection headerText="Three code paths and the status of each">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>vllm-neuron 1.x (current, Beta).</strong> The plugin repository at{' '}
                <Cite tier={1} href={VN_TREE} accessed={NEURON_ACCESSED}>
                  vllm-project/vllm-neuron at v0.29.0.1.2.0
                </Cite>
                , documented at{' '}
                <Cite tier={1} href={NEURON_VLLM_DOCS} accessed={NEURON_ACCESSED}>
                  Neuron docs: vLLM Neuron
                </Cite>
                . The 1.x line began with v0.21.0.1.0.0 (2026-07-20){' '}
                <Cite tier={1} href={VN_REL_021} accessed={NEURON_ACCESSED}>
                  vllm-neuron v0.21.0.1.0.0 release notes
                </Cite>
                .
              </Box>
              <Box variant="p">
                <strong>vllm-neuron 0.5.x on NxD Inference (maintenance).</strong> Documented in{' '}
                <Cite tier={1} href={NXDI_VLLM} accessed={NEURON_ACCESSED}>
                  Neuron docs: vLLM User Guide for NxD Inference
                </Cite>
                , with a migration path to the 1.x line in{' '}
                <Cite tier={1} href={VN_MIGRATION} accessed={NEURON_ACCESSED}>
                  vllm-neuron migration guide
                </Cite>
                .
              </Box>
              <Box variant="p">
                <strong>aws-neuron/upstreaming-to-vllm (archived).</strong> AWS&apos;s fork of vLLM is
                archived on GitHub; its last push was on 2026-06-09 and its last release is Neuron
                2.26.1 (2025-10-29){' '}
                <Cite tier={1} href={FORK} accessed={NEURON_ACCESSED}>
                  aws-neuron/upstreaming-to-vllm (archived)
                </Cite>
                .
              </Box>
              <Box variant="p">
                <strong>vLLM&apos;s own documentation.</strong> The v0.10.1 docs carry an AWS Neuron
                installation page{' '}
                <Cite tier={1} href={VLLM_0101_NEURON} accessed={NEURON_ACCESSED}>
                  vLLM v0.10.1 docs: AWS Neuron installation
                </Cite>
                . The v0.31.0 docs have none; their installation index points to hardware plugins that
                live outside the main repository{' '}
                <Cite tier={1} href={vllmDocsUrl('getting_started/installation/')} accessed={NEURON_ACCESSED}>
                  vLLM docs: Installation, Hardware Plugins
                </Cite>
                .
              </Box>
            </SpaceBetween>
          </ExpandableSection>

          <Alert type="warning" header="vLLM 0.29.0 on Neuron, v0.31.0 everywhere else in this dive">
            Read every version note in this dive against 0.29.0 before you copy a GPU launch command.
            For example, <code>--max-num-active-seqs</code>, the running-batch cap in sections 4 and
            27, exists at v0.31.0{' '}
            <Cite tier={1} href={vllmUrl('vllm/engine/arg_utils.py', 'L1688-L1691')} kind="code" accessed={NEURON_ACCESSED}>
              arg_utils.py L1688-L1691
            </Cite>{' '}
            and does not appear in v0.29.0&apos;s argument parser{' '}
            <Cite tier={1} href={`${VLLM_0290}/vllm/engine/arg_utils.py`} kind="code" accessed={NEURON_ACCESSED}>
              vLLM v0.29.0 arg_utils.py
            </Cite>
            , so it is unavailable on a Neuron server. The queue caps{' '}
            <code>--max-num-queued-reqs</code> and <code>--max-num-queued-tokens</code> are in
            0.29.0&apos;s parser too{' '}
            <Cite tier={1} href={`${VLLM_0290}/vllm/engine/arg_utils.py#L1602-L1608`} kind="code" accessed={NEURON_ACCESSED}>
              vLLM v0.29.0 arg_utils.py L1602-L1608
            </Cite>
            .
          </Alert>
        </SpaceBetween>
      </Container>

      {/* ---------------------------------------------------------------- */}
      {/* Feature support matrix                                           */}
      {/* ---------------------------------------------------------------- */}
      <Container
        header={
          <Header
            variant="h2"
            description="What a GPU vLLM design keeps and loses on the 1.x plugin, so you can rule Trainium in or out before you size anything"
          >
            Feature matrix for the 1.x plugin
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Start with the model list, because it is short. The README&apos;s end-to-end tested
            models are Llama 3 (1B, 8B, 70B), GPT-OSS (20B, 120B), Qwen3 32B (dense), Qwen3-VL 32B,
            Qwen3-Embedding 8B and Qwen3-ASR 1.7B, all on Trn2 and Trn3{' '}
            <Cite tier={1} href={`${VN_README}#L31-L48`} accessed={NEURON_ACCESSED}>
              vllm-neuron README L31-L48
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
            <Cite tier={1} href={`${VN_README}#L59-L111`} accessed={NEURON_ACCESSED}>
              vllm-neuron README L59-L111
            </Cite>
            .
          </Box>
          <ExpandableSection headerText="Sources behind the notes column">
            <Box variant="small" color="text-body-secondary">
              The Model Runner V2 rules are in the features guide{' '}
              <Cite tier={1} href={`${VN_FEATURES}#L112-L165`} accessed={NEURON_ACCESSED}>
                features guide L112-L165
              </Cite>
              . The two speculative methods come from the features guide and the model runner, which
              raises on any other{' '}
              <Cite tier={1} href={`${VN_FEATURES}#L630-L646`} accessed={NEURON_ACCESSED}>
                features guide L630-L646
              </Cite>{' '}
              <Cite tier={1} href={`${VN_RUNNER_V1}#L1229-L1245`} kind="code" accessed={NEURON_ACCESSED}>
                neuron_model_runner.py L1229-L1245
              </Cite>
              . EPD keeps prefill and decode in one engine{' '}
              <Cite tier={1} href={`${VN_FEATURES}#L948-L957`} accessed={NEURON_ACCESSED}>
                features guide L948-L957
              </Cite>
              , and audio input goes through the transcription endpoint{' '}
              <Cite tier={1} href={`${VN_FEATURES}#L839-L841`} accessed={NEURON_ACCESSED}>
                features guide L839-L841
              </Cite>
              . The LoRA fallback is from the v0.21.0.1.0.0 known issues{' '}
              <Cite tier={1} href={VN_REL_021} accessed={NEURON_ACCESSED}>
                v0.21.0.1.0.0 release notes
              </Cite>
              , and its end date from the NxD Inference announcement{' '}
              <Cite tier={1} href={EOS_NXDI} accessed={NEURON_ACCESSED}>
                Neuron docs: NxD Inference end-of-support announcement
              </Cite>
              . The executor rule is in the plugin code{' '}
              <Cite tier={1} href={`${VN_PLATFORM}#L736-L744`} kind="code" accessed={NEURON_ACCESSED}>
                platform.py L736-L744
              </Cite>
              .
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      {/* ---------------------------------------------------------------- */}
      {/* Compile path, startup variables and the platform check            */}
      {/* ---------------------------------------------------------------- */}
      <Container
        header={
          <Header
            variant="h2"
            description="Which route compiles your model, the variables that select it and keep its NEFFs across restarts, and the log line that confirms the plugin loaded"
          >
            Set the compile path before the first start
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>How it compiles.</strong> vLLM captures each model graph with TorchDynamo. On the
            native route, the default, the graph is lowered through AOTAutograd and torch-mlir to
            StableHLO, the form <code>neuronx-cc</code> compiles into one NEFF per shape
            bucket{' '}
            <Cite tier={1} href={NEURON_VLLM_TORCHNEURON} accessed={NEURON_ACCESSED}>
              Neuron docs: How vLLM is integrated with TorchNeuron
            </Cite>
            . That lowering is TorchNeuron&apos;s, packaged separately: the plugin depends on{' '}
            <code>libtorch-neuronx-lite</code>, which carries its own copy of it, and not on{' '}
            <code>torch-neuronx</code>{' '}
            <Cite tier={1} href={VN_CORE_REQ} kind="code" accessed={NEURON_ACCESSED}>
              vllm-neuron requirements/core.txt
            </Cite>
            , and the native route imports lite at startup{' '}
            <Cite tier={1} href={`${VN_INIT}#L91-L96`} kind="code" accessed={NEURON_ACCESSED}>
              vllm_neuron/__init__.py L91-L96
            </Cite>
            . &quot;vLLM Neuron uses its own copy of the lowering, so the two versions can be
            different&quot;{' '}
            <Cite tier={1} href={NEURON_VLLM_TORCHNEURON} accessed={NEURON_ACCESSED}>
              Neuron docs: How vLLM is integrated with TorchNeuron
            </Cite>
            , so a fix that lands in public torch-neuronx is not evidence the plugin has it. The stack
            runs on PyTorch 2.13: vLLM 0.29.0 pins it{' '}
            <Cite tier={1} href={`${VLLM_0290}/requirements/cuda.txt#L7`} kind="code" accessed={NEURON_ACCESSED}>
              vLLM v0.29.0 requirements/cuda.txt L7
            </Cite>{' '}
            and the lite wheel requires it{' '}
            <Cite tier={1} href={LITE_WHEEL} kind="code" accessed={NEURON_ACCESSED}>
              libtorch-neuronx-lite 2.13.0.1.0.3112 wheel, METADATA L12
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>Two variables to set first.</strong>{' '}
            <code>VLLM_NEURON_BACKEND</code> selects the route: unset or <code>neuron_native</code>{' '}
            runs the native route, and <code>vllm_neuron</code> selects the XLA route{' '}
            <Cite tier={1} href={`${VN_ENVS}#L779-L786`} kind="code" accessed={NEURON_ACCESSED}>
              vllm-neuron envs.py L779-L786
            </Cite>
            , which is deprecated and ends on Trn2 and Trn3 in Neuron 2.34{' '}
            <Cite tier={1} href={EOS_VLLM_XLA} accessed={NEURON_ACCESSED}>
              Neuron docs: Torch/XLA path in vLLM Neuron, end of support
            </Cite>
            . A misspelled value logs a warning and runs native{' '}
            <Cite tier={1} href={NEURON_VLLM_ROUTE} accessed={NEURON_ACCESSED}>
              Neuron docs: How to choose a compilation route
            </Cite>
            . Set <code>neuron_native</code> explicitly anyway, for the cache reason below. If{' '}
            <code>torch-neuronx</code> is installed in the same environment, export{' '}
            <code>TORCH_DEVICE_BACKEND_AUTOLOAD=0</code> before the server starts: only one package can
            own the <code>neuron</code> device, and without it startup fails with{' '}
            <code>Tried to register multiple backend fallbacks for the same dispatch key PrivateUse1</code>{' '}
            <Cite tier={1} href={NEURON_VLLM_TORCHNEURON} accessed={NEURON_ACCESSED}>
              Neuron docs: How vLLM is integrated with TorchNeuron
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>Keep the compile across restarts.</strong> Warmup compiles one NEFF per shape
            bucket (sequence length by batch size) and caches it on disk for later restarts{' '}
            <Cite tier={1} href={`${VN_FEATURES}#L38-L40`} accessed={NEURON_ACCESSED}>
              vllm-neuron features guide L38-L40
            </Cite>
            ; budget that compile on first boot. The plugin&apos;s release notes claim up to 2x faster
            cold start and up to 6x faster warm start from the PyTorch precompile cache{' '}
            <Cite tier={1} href={VN_REL_029} accessed={NEURON_ACCESSED}>
              vllm-neuron v0.29.0.1.2.0 release notes
            </Cite>
            . That cache turns on only when <code>VLLM_NEURON_BACKEND</code> is{' '}
            <code>neuron_native</code> or <code>neuron</code>, so an unset variable runs the native
            route with the cache off{' '}
            <Cite tier={1} href={NEURON_VLLM_PRECOMPILE} accessed={NEURON_ACCESSED}>
              Neuron docs: How to use the Precompile Cache
            </Cite>{' '}
            <Cite tier={1} href={LITE_WHEEL} kind="code" accessed={NEURON_ACCESSED}>
              libtorch-neuronx-lite wheel, __init__.py L83-L104, L162-L180
            </Cite>
            . On a multi-node or encoder-disaggregated (EPD) deployment the Precompile Cache guide asks
            for the cache off, with <code>TORCH_CACHING_PRECOMPILE=0</code>. Set <code>VLLM_CACHE_ROOT</code>{' '}
            explicitly, to storage that survives a restart: the precompile cache reads from it, and the
            NEFF cache sits under it only when the variable is set in the environment (unset, the NEFFs
            go to <code>~/.cache/neuron_libtorch</code>; <code>NEURON_LIBTORCH_CACHE_ROOT</code>, when
            set, takes precedence). <code>TORCH_NEURONX_NEFF_CACHE_DIR</code>{' '}
            moves the NEFFs on their own, for example to a file system that later nodes share{' '}
            <Cite tier={1} href={LITE_WHEEL} kind="code" accessed={NEURON_ACCESSED}>
              libtorch-neuronx-lite wheel, envs.py L80-L138
            </Cite>
            .
          </Box>
          <ExpandableSection headerText="NEURON_COMPILED_ARTIFACTS and the TorchNeuron headline, checked against the code">
            <SpaceBetween size="s">
              <Box variant="p">
                The features guide documents <code>NEURON_COMPILED_ARTIFACTS</code> for
                pre-compiled artifacts{' '}
                <Cite tier={1} href={`${VN_FEATURES}#L53-L65`} accessed={NEURON_ACCESSED}>
                  features guide L53-L65
                </Cite>
                , but no code in the plugin at this tag, in the libtorch-neuronx-lite 2.13.0.1.0.3112
                wheel or in vLLM 0.29.0&apos;s <code>envs.py</code> reads that variable{' '}
                <Cite tier={1} href={VN_TREE} kind="doc-code-conflict" accessed={NEURON_ACCESSED}>
                  vllm-neuron at v0.29.0.1.2.0 (searched)
                </Cite>{' '}
                <Cite tier={1} href={LITE_WHEEL} kind="doc-code-conflict" accessed={NEURON_ACCESSED}>
                  libtorch-neuronx-lite wheel (searched)
                </Cite>
                .
              </Box>
              <Box variant="p">
                The release notes headline the native route as &quot;built on the TorchNeuron library&quot;{' '}
                <Cite tier={1} href={VN_REL_029} kind="doc-code-conflict" accessed={NEURON_ACCESSED}>
                  vllm-neuron v0.29.0.1.2.0 release notes
                </Cite>
                ; that holds for the lowering, and not for the package.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <Box variant="p">
            <strong>Check which platform loaded.</strong> The plugin registers{' '}
            <code>{'neuron = "vllm_neuron:register"'}</code> under the{' '}
            <code>vllm.platform_plugins</code> entry-point group{' '}
            <Cite tier={1} href={`${VN}/pyproject.toml#L25-L26`} kind="code" accessed={NEURON_ACCESSED}>
              vllm-neuron pyproject.toml L25-L26
            </Cite>
            , the group vLLM loads when it resolves which platform it runs on{' '}
            <Cite tier={1} href={vllmUrl('vllm/plugins/__init__.py', 'L21-L23')} kind="code" accessed={NEURON_ACCESSED}>
              plugins/__init__.py L21-L23
            </Cite>
            . At startup vLLM logs{' '}
            <code>Platform plugin neuron is activated</code> when the plugin is in use{' '}
            <Cite tier={1} href={`${VLLM_0290}/vllm/platforms/__init__.py#L270-L272`} kind="code" accessed={NEURON_ACCESSED}>
              vLLM v0.29.0 platforms/__init__.py L270-L272
            </Cite>
            ; an activated out-of-tree platform plugin takes precedence over the built-in platforms{' '}
            <Cite tier={1} href={vllmUrl('vllm/platforms/__init__.py', 'L272-L279')} kind="code" accessed={NEURON_ACCESSED}>
              platforms/__init__.py L272-L279
            </Cite>
            . If that line is missing at the default log level, vLLM did not activate the plugin.
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
            <Cite tier={1} href={`${VN_CONFIG}#L9-L32`} accessed={NEURON_ACCESSED}>
              vllm-neuron configuration reference L9-L32
            </Cite>
            , and the plugin reads the quantization choice from that key{' '}
            <Cite tier={1} href={`${VN_PLATFORM}#L876-L877`} kind="code" accessed={NEURON_ACCESSED}>
              platform.py L876-L877
            </Cite>
            . MXFP4 weights for gpt-oss on Trn3 look like this; on Trn2 the same setting fails at
            startup{' '}
            <Cite tier={1} href={`${VN_FEATURES}#L468-L481`} accessed={NEURON_ACCESSED}>
              features guide L468-L481
            </Cite>
            :
          </Box>
          <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{String.raw`vllm serve openai/gpt-oss-120b \
    --tensor-parallel-size 64 \
    --additional-config '{"neuron_config": {"quantization": "mxfp4"}}'`}</pre>
          <Box variant="p">
            FP8 weights come from a calibrated checkpoint&apos;s <code>quantization_config</code>,
            and an FP8 KV cache uses vLLM&apos;s own <code>--kv-cache-dtype fp8</code>{' '}
            <Cite tier={1} href={`${VN_FEATURES}#L448-L507`} accessed={NEURON_ACCESSED}>
              features guide L448-L507
            </Cite>
            . Leave <code>--quantization</code> unset on every path{' '}
            <Cite tier={1} href={`${VN_CONFIG}#L110-L122`} accessed={NEURON_ACCESSED}>
              configuration reference L110-L122
            </Cite>
            .
          </Box>

          <Box variant="p">
            <strong>2. Long prompts use segmented prefill.</strong> Prompts longer than{' '}
            <code>--max-num-batched-tokens</code> run over several iterations: with 8192, a 32K
            prompt takes four. Prefill and decode always run in separate batches on Neuron{' '}
            <Cite tier={1} href={`${VN_FEATURES}#L240-L264`} accessed={NEURON_ACCESSED}>
              features guide L240-L264
            </Cite>
            , so latency targets set from GPU mixed batching (section 4) do not transfer. If chunked
            prefill is enabled, the plugin logs a warning that Neuron chunks prefills only at batch
            size 1 and never mixes them with decode{' '}
            <Cite tier={1} href={`${VN_PLATFORM}#L749-L754`} kind="code" accessed={NEURON_ACCESSED}>
              platform.py L749-L754
            </Cite>
            .
          </Box>

          <Box variant="p">
            <strong>3. Prefill/decode uses the Neuron NIXL connector.</strong> Disaggregated serving
            moves the KV cache over NIXL with the LIBFABRIC backend on EFA, and needs{' '}
            <code>libcuda.so.1</code> and <code>libfabric.so.1</code> on the loader path{' '}
            <Cite tier={1} href={`${VN_FEATURES}#L410-L425`} accessed={NEURON_ACCESSED}>
              features guide L410-L425
            </Cite>
            . Name the connector <code>NeuronNixlConnector</code>, or keep the{' '}
            <code>NixlConnector</code> name from a GPU config: the plugin rewrites it to{' '}
            <code>NeuronNixlConnector</code> and fills in the module path{' '}
            <Cite tier={1} href={`${VN_PLATFORM}#L1194-L1219`} kind="code" accessed={NEURON_ACCESSED}>
              platform.py L1194-L1219
            </Cite>
            . The plugin installs NIXL below 1.4.0, so keep that ceiling in a custom image{' '}
            <Cite tier={1} href={`${VN_CORE_REQ}#L37-L41`} kind="code" accessed={NEURON_ACCESSED}>
              requirements/core.txt L37-L41
            </Cite>
            . The prefill server in the plugin&apos;s gpt-oss example passes the setting below, and
            the decode server runs as <code>kv_consumer</code>{' '}
            <Cite tier={1} href={VN_DI_EXAMPLE} accessed={NEURON_ACCESSED}>
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
            <Cite tier={1} href={`${VN}/examples/vllm_neuron/models/gpt_oss/120b/mxfp4/multinode_DI/run_prefill.sh#L26-L29`} kind="code" accessed={NEURON_ACCESSED}>
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
            <Cite tier={1} href={`${VN_MIGRATION}#L87-L108`} accessed={NEURON_ACCESSED}>
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
            <Cite tier={2} href={RUFUS} accessed={NEURON_ACCESSED}>
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
                    The leader &quot;runs the Triton Inference Server and vLLM engine, serving as the
                    primary orchestration unit for inference.&quot; After scheduling, requests go to
                    &quot;the NeuronWorker component in vLLM, which handles broadcasting model
                    inputs&quot;.
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
                <Cite tier={2} href={RUFUS} accessed={NEURON_ACCESSED}>
                  AWS ML blog: How Amazon scaled Rufus
                </Cite>
                . Section 23 (EC2 Topology &amp; Placement Groups) covers the topology API.
              </Box>
            </SpaceBetween>
          </ExpandableSection>

          <Alert type="info" header="What carries over to a new design">
            The stack in AWS&apos;s blog runs on Trn1, with collectives in NxD Inference, the
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
                <li>
                  Your model is in the tested list: Llama 3, GPT-OSS, Qwen3 32B, Qwen3-VL 32B,
                  Qwen3-Embedding 8B or Qwen3-ASR 1.7B.
                </li>
                <li>
                  Your feature set sits inside the matrix: continuous batching, prefix caching,
                  EAGLE3 or DFlash, structured outputs and tool calling, image, video or audio input,
                  EP for MoE models, and prefill/decode disaggregation over EFA.
                </li>
                <li>You run on Trn2 or Trn3 and can follow the Neuron SDK release rhythm.</li>
                <li>Your serving design works on vLLM 0.29.0.</li>
              </ul>
            </div>
            <div>
              <Box variant="h3">Stay on GPU vLLM when</Box>
              <ul>
                <li>You serve LoRA adapters, or need pipeline parallelism, chunked prefill, KV offload or sleep mode.</li>
                <li>Your model is outside the six tested families.</li>
                <li>You need a feature that landed after vLLM 0.29.0, which includes everything this dive dates to v0.30 or later.</li>
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
            depend on against 0.29.0. If all three pass, start from the Neuron 2.33.0 vLLM DLC or vLLM
            DLAMI, which ships vllm-neuron 0.29.0.1.2.0, set <code>VLLM_NEURON_BACKEND=neuron_native</code>,
            and set <code>VLLM_CACHE_ROOT</code> to a directory on persistent storage so a restart on the
            same configuration and versions reuses the traced graphs and the compiled NEFFs.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
