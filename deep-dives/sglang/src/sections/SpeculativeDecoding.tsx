import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Table from '@cloudscape-design/components/table';
import Link from '@cloudscape-design/components/link';
import type { ReactNode } from 'react';
import { Cite, sglangUrl, sglangTreeUrl, sglangDocsSrcUrl } from '../components/Cite';

const SRT = 'python/sglang/srt';
const HOOK = `${SRT}/arg_groups/speculative_hook.py`;
const FIELDS = `${SRT}/arg_groups/fields/spec.py`;
const INFO = `${SRT}/speculative/spec_info.py`;
const EW2 = `${SRT}/speculative/eagle_worker_v2.py`;
const EU = `${SRT}/speculative/eagle_utils.py`;
const SU = `${SRT}/speculative/spec_utils.py`;
const ADAPT = `${SRT}/speculative/adaptive_spec_params.py`;
const BRP = `${SRT}/managers/scheduler_components/batch_result_processor.py`;
const KVCONF = `${SRT}/mem_cache/kv_cache_configurator.py`;
const MOB = `${SRT}/arg_groups/model_override_base.py`;
const PIPE = `${SRT}/arg_groups/pipeline.py`;
const SPEC_DOC = 'advanced_features/speculative_decoding';
const SF_SHA = 'f586b1ee40b5e4bf3ef03954849024b57a5edb7a';
const SF = `https://github.com/sgl-project/SpecForge`;
const LMSYS_SF = 'https://www.lmsys.org/blog/2026-08-04-specforge-v0-3';
const EAGLE3_PAPER = 'https://arxiv.org/abs/2503.01840v3';
const BLOCK_PAPER = 'https://arxiv.org/abs/2403.10444v3';
const RELEASE = 'https://github.com/sgl-project/sglang/releases/tag/v0.5.22';

function vllmUrl(path: string, lines: string): string {
  return `https://github.com/vllm-project/vllm/blob/v0.31.0/${path}#${lines}`;
}

/* ------------------------------------------------------------------ */
/* Diagram: one draft-then-verify round, chain shape                   */
/* ------------------------------------------------------------------ */

function SpecRoundDiagram() {
  const steps = [134, 232, 330];
  const chips = [
    { x: 426, label: 'd1', note: 'kept', box: 'spec-round-kept', text: 'spec-round-ct' },
    { x: 490, label: 'd2', note: 'kept', box: 'spec-round-kept', text: 'spec-round-ct' },
    { x: 554, label: 'd3', note: 'rejected', box: 'spec-round-rej', text: 'spec-round-ct' },
    { x: 618, label: 'b', note: 'bonus', box: 'spec-round-bonus', text: 'spec-round-cw' },
  ];
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 860 400"
        role="img"
        aria-labelledby="spec-round-title"
        style={{ width: '100%', minWidth: 680, height: 'auto' }}
      >
        <title id="spec-round-title">
          One speculative decoding round in SGLang, drawn for the automatic chain shape of 3 draft
          steps with top-k 1. Starting from t0, the last token the previous round kept, the draft
          model runs one forward per step and proposes d1, d2 and d3. The target model then runs a
          single forward that scores t0 and the three drafts together. It agrees with d1 and d2 and
          rejects d3, so the round keeps d1, d2 and the target&apos;s own bonus token b in place of
          d3: three tokens committed, which sglang:spec_accept_length reports as 3. Draft-extend then
          runs the draft model over the kept tokens to refresh its KV cache for the next round.
        </title>
        <style>{`
          .spec-round-bg { fill: #ffffff; stroke: #d1d5db; stroke-width: 1; }
          .spec-round-ph { fill: #414d5c; font: 600 13px sans-serif; text-anchor: middle; }
          .spec-round-lane { fill: #16191f; font: 600 12px sans-serif; text-anchor: start; }
          .spec-round-sep { stroke: #e9ebed; stroke-width: 1; }
          .spec-round-div { stroke: #d1d5db; stroke-width: 1; stroke-dasharray: 5 4; }
          .spec-round-draft { fill: #e6f4f2; stroke: #1f7a70; stroke-width: 1.5; }
          .spec-round-target { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .spec-round-prev { fill: #f4f4f4; stroke: #879596; stroke-width: 1.5; }
          .spec-round-kept { fill: #ecf7ec; stroke: #037f0c; stroke-width: 1.5; }
          .spec-round-rej { fill: #fbf3d5; stroke: #8b6c00; stroke-width: 1.5; }
          .spec-round-bonus { fill: #0972d3; stroke: #065299; stroke-width: 1.5; }
          .spec-round-t { fill: #16191f; font: 600 13px sans-serif; text-anchor: middle; }
          .spec-round-s { fill: #414d5c; font: 11px sans-serif; text-anchor: middle; }
          .spec-round-tl { fill: #16191f; font: 600 13px sans-serif; text-anchor: start; }
          .spec-round-sl { fill: #414d5c; font: 11px sans-serif; text-anchor: start; }
          .spec-round-ct { fill: #16191f; font: 600 13px sans-serif; text-anchor: middle; }
          .spec-round-cw { fill: #ffffff; font: 600 13px sans-serif; text-anchor: middle; }
          .spec-round-arr { stroke: #5f6b7a; stroke-width: 1.5; fill: none; marker-end: url(#spec-round-ah); }
          .spec-round-ax { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
        `}</style>
        <defs>
          <marker
            id="spec-round-ah"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="8"
            markerHeight="8"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#5f6b7a" />
          </marker>
        </defs>

        <rect x={0} y={0} width={860} height={400} rx={8} className="spec-round-bg" />

        {/* phase headers and dividers */}
        <text x={272} y={34} className="spec-round-ph">1. Draft: one forward per step</text>
        <text x={550} y={34} className="spec-round-ph">2. Verify and keep</text>
        <text x={769} y={34} className="spec-round-ph">3. Draft-extend</text>
        <line x1={418} y1={48} x2={418} y2={352} className="spec-round-div" />
        <line x1={682} y1={48} x2={682} y2={352} className="spec-round-div" />

        {/* lanes */}
        <line x1={12} y1={152} x2={848} y2={152} className="spec-round-sep" />
        <line x1={12} y1={252} x2={848} y2={252} className="spec-round-sep" />
        <text x={20} y={112} className="spec-round-lane">Draft model</text>
        <text x={20} y={212} className="spec-round-lane">Target model</text>
        <text x={20} y={300} className="spec-round-lane">Committed</text>
        <text x={20} y={316} className="spec-round-lane">output</text>

        {/* draft steps */}
        {steps.map((x, i) => (
          <g key={x}>
            <rect x={x} y={80} width={80} height={56} rx={6} className="spec-round-draft" />
            <text x={x + 40} y={103} className="spec-round-t">{`step ${i + 1}`}</text>
            <text x={x + 40} y={122} className="spec-round-s">{`proposes d${i + 1}`}</text>
          </g>
        ))}
        <line x1={214} y1={108} x2={230} y2={108} className="spec-round-arr" />
        <line x1={312} y1={108} x2={328} y2={108} className="spec-round-arr" />

        {/* the last committed token feeds step 1 */}
        <rect x={134} y={280} width={56} height={40} rx={6} className="spec-round-prev" />
        <text x={162} y={305} className="spec-round-ct">t0</text>
        <text x={200} y={296} className="spec-round-sl">t0: the last token kept</text>
        <text x={200} y={312} className="spec-round-sl">by the previous round</text>
        <path d="M 162 280 V 140" className="spec-round-arr" />

        {/* drafts into one verify forward */}
        <path d="M 370 136 V 160 H 460 V 176" className="spec-round-arr" />
        <rect x={426} y={180} width={248} height={56} rx={6} className="spec-round-target" />
        <text x={550} y={203} className="spec-round-t">one target forward</text>
        <text x={550} y={222} className="spec-round-s">scores t0, d1, d2 and d3 together</text>

        {/* verdicts */}
        <line x1={550} y1={236} x2={550} y2={274} className="spec-round-arr" />
        {chips.map((c) => (
          <g key={c.label}>
            <rect x={c.x} y={280} width={56} height={40} rx={6} className={c.box} />
            <text x={c.x + 28} y={305} className={c.text}>{c.label}</text>
            <text x={c.x + 28} y={338} className="spec-round-s">{c.note}</text>
          </g>
        ))}
        <text x={694} y={296} className="spec-round-tl">3 tokens committed</text>
        <text x={694} y={314} className="spec-round-sl">spec_accept_length 3</text>
        <text x={694} y={330} className="spec-round-sl">2 drafts plus 1 bonus</text>

        {/* draft-extend over the kept tokens */}
        <path d="M 674 208 H 708 V 148" className="spec-round-arr" />
        <rect x={690} y={72} width={158} height={72} rx={6} className="spec-round-draft" />
        <text x={769} y={94} className="spec-round-t">draft-extend</text>
        <text x={769} y={113} className="spec-round-s">over the kept tokens</text>
        <text x={769} y={130} className="spec-round-s">refreshes draft KV</text>

        {/* time axis */}
        <line x1={134} y1={366} x2={846} y2={366} className="spec-round-arr" />
        <text x={490} y={390} className="spec-round-ax">one decode round, left to right</text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tables                                                              */
/* ------------------------------------------------------------------ */

interface AlgoRow {
  flag: string;
  source: ReactNode;
  pass: ReactNode;
  note: ReactNode;
}

const algoRows: AlgoRow[] = [
  {
    flag: 'EAGLE',
    source: (
      <>
        A separate EAGLE draft checkpoint: a small network that drafts from the target&apos;s hidden
        states{' '}
        <Cite tier={1} href={sglangUrl(INFO, 'L179-L182')}>
          spec_info.py L179-L182
        </Cite>
      </>
    ),
    pass: <code>--speculative-draft-model-path</code>,
    note: 'Tree or chain. With EAGLE3, the only algorithms that adaptive steps and rejection sampling accept.',
  },
  {
    flag: 'EAGLE3',
    source: 'A separate EAGLE-3 draft checkpoint',
    pass: <code>--speculative-draft-model-path</code>,
    note: 'The format SpecBundle ships (see "Where drafts come from").',
  },
  {
    flag: 'STANDALONE',
    source: 'A separate, smaller ordinary LLM (large language model) that ignores the hidden states',
    pass: <code>--speculative-draft-model-path</code>,
    note: 'Automatic shape is always a chain; no attention DP (data-parallel attention); mixed chunked prefill switched off.',
  },
  {
    flag: 'DFLASH',
    source: 'A separate DFlash draft checkpoint that proposes a block of tokens per step',
    pass: (
      <>
        <code>--speculative-draft-model-path</code> (required)
      </>
    ),
    note: (
      <>
        Block size from the draft&apos;s config, 16 if absent; pipeline parallelism of 1; attention DP
        only on Ascend NPU (neural processing unit){' '}
        <Cite tier={1} href={sglangUrl(HOOK, 'L279-L431')}>
          speculative_hook.py L279-L431
        </Cite>
      </>
    ),
  },
  {
    flag: 'NEXTN',
    source: (
      <>
        MTP (multi-token prediction) heads inside the target checkpoint; an alias of{' '}
        <code>EAGLE</code>{' '}
        <Cite tier={1} href={sglangUrl(`${SRT}/speculative/spec_registry.py`, 'L180-L183')}>
          spec_registry.py L180-L183
        </Cite>
      </>
    ),
    pass: (
      <>
        Nothing extra for DeepSeek V3 and later, the GLM-4 MoE (mixture of experts) and Bailing MoE
        families, Mistral Large 3, Pixtral, HY V3 and V4, and Qwen4-Exp: the draft path defaults to{' '}
        <code>--model-path</code>{' '}
        <Cite tier={1} href={sglangUrl(HOOK, 'L1028-L1063')}>
          speculative_hook.py L1028-L1063
        </Cite>
      </>
    ),
    note: 'Runs on the EAGLE worker, so every EAGLE rule in this section applies.',
  },
  {
    flag: 'DSPARK',
    source: 'A DSpark draft bundled in the target checkpoint, or a separate one',
    pass: (
      <>
        Nothing when the checkpoint bundles it; <code>--speculative-draft-model-path</code> otherwise{' '}
        <Cite tier={1} href={sglangUrl(HOOK, 'L605-L690')}>
          speculative_hook.py L605-L690
        </Cite>
      </>
    ),
    note: (
      <>
        CUDA or NPU; one draft step; attention DP needs <code>--enable-dp-lm-head</code>.
      </>
    ),
  },
  {
    flag: 'UNO',
    source: 'A LoRA (low-rank adaptation) adapter on the target model itself',
    pass: (
      <>
        <code>--uno-lora-path</code> and <code>--speculative-num-draft-tokens</code>; a draft path is
        refused{' '}
        <Cite tier={1} href={sglangUrl(HOOK, 'L432-L466')}>
          speculative_hook.py L432-L466
        </Cite>
      </>
    ),
    note: 'CUDA only; mixed chunked prefill switched off.',
  },
  {
    flag: 'NGRAM',
    source: 'No model: an n-gram trie on the host, built from tokens already seen',
    pass: 'Nothing',
    note: (
      <>
        A 12-token tree of up to 10 branches by default; CUDA, CPU or XPU (Intel GPU devices); no attention DP{' '}
        <Cite tier={1} href={sglangUrl(HOOK, 'L1195-L1282')}>
          speculative_hook.py L1195-L1282
        </Cite>
      </>
    ),
  },
  {
    flag: 'FROZEN_KV_MTP',
    source: 'A Gemma 4 assistant draft; chosen for you',
    pass: (
      <>
        <code>NEXTN</code> or <code>EAGLE</code> with the assistant draft&apos;s path;{' '}
        <code>EAGLE3</code> with that draft is an error{' '}
        <Cite tier={1} href={sglangUrl(HOOK, 'L80-L117')}>
          speculative_hook.py L80-L117
        </Cite>
      </>
    ),
    note: 'SGLang logs the promotion at startup.',
  },
];

interface ComboRow {
  combo: string;
  behaviour: ReactNode;
}

const comboRows: ComboRow[] = [
  {
    combo: 'PD disaggregation',
    behaviour: (
      <>
        Both roles load the draft. For the EAGLE family, prefill runs the target prefill and the first draft step, then
        ships the target KV, the draft KV, that step&apos;s top-k candidates and the last hidden state;
        decode starts its first verify from those and drafts every later step itself. Launch both
        roles with the same speculative flags (section 15, PD Disaggregation){' '}
        <Cite tier={1} href={sglangUrl(`${SRT}/disaggregation/prefill.py`, 'L985-L1003')}>
          prefill.py L985-L1003
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(`${SRT}/disaggregation/prefill.py`, 'L254-L306')}>
          prefill.py L254-L306
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(`${SRT}/speculative/eagle_disaggregation.py`, 'L25-L155')}>
          eagle_disaggregation.py L25-L155
        </Cite>
      </>
    ),
  },
  {
    combo: 'DP attention',
    behaviour: (
      <>
        <code>EAGLE</code>, <code>EAGLE3</code>, <code>NEXTN</code> and <code>DSPARK</code> run with it.{' '}
        <code>STANDALONE</code> and <code>NGRAM</code> refuse to start, <code>DFLASH</code> refuses
        except on Ascend NPU, and adaptive steps fall back to static ones{' '}
        <Cite tier={1} href={sglangUrl(HOOK, 'L987-L993')}>
          speculative_hook.py L987-L993
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(HOOK, 'L1278-L1282')}>
          speculative_hook.py L1278-L1282
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(HOOK, 'L295-L300')}>
          speculative_hook.py L295-L300
        </Cite>
      </>
    ),
  },
  {
    combo: 'Mixed chunked prefill',
    behaviour: (
      <>
        Kept with <code>EAGLE</code>, <code>EAGLE3</code>, <code>NEXTN</code>, <code>DFLASH</code>{' '}
        and <code>DSPARK</code>; switched off with a warning for <code>STANDALONE</code>,{' '}
        <code>NGRAM</code>, <code>UNO</code> and frozen-KV MTP{' '}
        <Cite tier={1} href={sglangUrl(INFO, 'L146-L157')}>
          spec_info.py L146-L157
        </Cite>
      </>
    ),
  },
  {
    combo: 'Draft precision and kernels',
    behaviour: (
      <>
        The draft inherits <code>--quantization</code>, the KV dtype and the attention backend unless
        told otherwise. Under a quantized target, pass{' '}
        <code>--speculative-draft-model-quantization unquant</code> for a draft that ships
        unquantized{' '}
        <Cite tier={1} href={sglangUrl(`${SRT}/arg_groups/serving_hook.py`, 'L654-L688')}>
          serving_hook.py L654-L688
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(`${SRT}/speculative/draft_utils.py`, 'L47-L61')}>
          draft_utils.py L47-L61
        </Cite>
      </>
    ),
  },
  {
    combo: 'KV memory',
    behaviour: (
      <>
        The draft&apos;s KV is indexed by the same slot numbers as the target&apos;s, so every slot
        holds draft KV beside target KV{' '}
        <Cite tier={1} href={sglangUrl(`${SRT}/managers/scheduler.py`, 'L1068-L1081')}>
          scheduler.py L1068-L1081
        </Cite>
        . <code>--speculative-draft-kv-cache-dtype</code> follows <code>--kv-cache-dtype</code> unless
        set, and <code>fp8_e4m3</code> halves the draft&apos;s share of a 16-bit cache{' '}
        <Cite tier={1} href={sglangUrl(FIELDS, 'L151-L163')}>
          spec.py L151-L163
        </Cite>
      </>
    ),
  },
];

interface WalkRow {
  file: ReactNode;
  what: ReactNode;
  why: string;
}

const walkRows: WalkRow[] = [
  {
    file: (
      <>
        <Cite tier={1} href={sglangUrl(INFO, 'L32-L182')}>
          spec_info.py L32-L182
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(INFO, 'L302-L361')}>
          L302-L361
        </Cite>
      </>
    ),
    what: (
      <>
        The algorithm enum, the capability predicates (<code>supports_grammar_overlap</code>,{' '}
        <code>supports_mixed_chunk</code>, <code>has_draft_kv</code>) and worker selection
      </>
    ),
    why: 'One screen that answers what a given algorithm supports.',
  },
  {
    file: (
      <>
        <Cite tier={1} href={sglangUrl(HOOK, 'L120-L277')}>
          speculative_hook.py L120-L277
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(HOOK, 'L984-L1193')}>
          L984-L1193
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(HOOK, 'L1340-L1371')}>
          L1340-L1371
        </Cite>
      </>
    ),
    what: 'The dispatcher, the EAGLE-family resolution and the automatic shape table',
    why: 'Where every speculative default in this section is decided, the reset to 48 included.',
  },
  {
    file: (
      <Cite tier={1} href={sglangUrl(EW2, 'L1350-L1481')}>
        eagle_worker_v2.py L1350-L1481
      </Cite>
    ),
    what: (
      <>
        <code>forward_batch_generation</code>: draft, verify, draft-extend, and the zero-step path
      </>
    ),
    why: 'The round in the diagram, as the scheduler runs it.',
  },
  {
    file: (
      <>
        <Cite tier={1} href={sglangUrl(EU, 'L157-L220')}>
          eagle_utils.py L157-L220
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(EU, 'L858-L1004')}>
          L858-L1004
        </Cite>
      </>
    ),
    what: 'Tree build with the ancestor-only mask; greedy, sampled and rejection-sampling verify',
    why: 'Tree against chain, and what counts as agreement.',
  },
  {
    file: (
      <Cite tier={1} href={sglangUrl(SU, 'L520-L725')}>
        spec_utils.py L520-L725
      </Cite>
    ),
    what: (
      <>
        <code>traverse_tree</code>, <code>GrammarTree</code> and <code>build_grammar_vocab_mask</code>
      </>
    ),
    why: 'How structured output and speculation compose.',
  },
];

const LAUNCH = `sglang serve --model-path TARGET \\
  --speculative-algorithm EAGLE3 \\
  --speculative-draft-model-path DRAFT \\
  --speculative-num-steps 3 --speculative-eagle-topk 1 \\
  --max-running-requests YOUR_CONCURRENCY \\
  --enable-metrics`;

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

export function SpeculativeDecoding() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Pick an algorithm by where its draft comes from, and know what speculation costs in concurrency before you turn it on (verified against SGLang v0.5.22, commit baa9befa, 2026-10-24)"
          >
            11. Speculative Decoding: draft, verify, keep the agreed prefix
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Speculative decoding has a cheap drafter propose the next few tokens and the target model
            check all of them in one forward pass. The target keeps the drafts it agrees with and adds
            one token of its own, so a round whose drafts land commits several tokens for a single
            target forward. SGLang runs none of this unless you pass{' '}
            <code>--speculative-algorithm</code>, which has no default{' '}
            <Cite tier={1} href={sglangUrl(FIELDS, 'L31-L34')}>
              spec.py L31-L34
            </Cite>
            .
          </Box>
          <Box variant="p">
            Two choices decide whether it pays. The first is the drafter: SGLang accepts nine built-in
            names, and each asks a different thing of you, a draft checkpoint, a target that carries
            its own draft heads, or nothing at all. The second is concurrency, and it moves through a
            flag you never set.{' '}
            <strong>
              With <code>--max-running-requests</code> unset, turning on EAGLE-family, NGRAM,{' '}
              <code>DFLASH</code> or <code>DSPARK</code> speculation resets it to 48, from 2048 to 4096
              otherwise
            </strong>{' '}
            <Cite tier={1} href={sglangUrl(HOOK, 'L995-L1003')} kind="code">
              speculative_hook.py L995-L1003
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(KVCONF, 'L2800-L2851')}>
              kv_cache_configurator.py L2800-L2851
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Read sglang:spec_accept_length as tokens committed per target forward, and know which work still runs when drafting stops"
          >
            One round: draft, verify, keep the agreed prefix
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            An EAGLE round has three parts{' '}
            <Cite tier={1} href={sglangUrl(EW2, 'L1381-L1441')}>
              eagle_worker_v2.py L1381-L1441
            </Cite>
            . The draft model runs one forward per draft step, each proposing the next token. The
            target model runs one forward over every drafted position. Then draft-extend runs the draft
            model over the tokens the round kept, refreshing its KV (key and value) cache and hidden
            state for the next round.
          </Box>
          <Box variant="p">
            In a chain (top-k 1) the verify width is the number of draft steps plus one: the token
            already sampled plus each drafted token{' '}
            <Cite tier={1} href={sglangUrl(HOOK, 'L1162-L1172')}>
              speculative_hook.py L1162-L1172
            </Cite>
            . The target keeps the longest run of drafts it agrees with, then adds the token it would
            have produced at the first disagreement, the bonus token. Every round therefore commits at
            least one token, and at most one more than the number of draft steps.
          </Box>

          <SpecRoundDiagram />
          <Box variant="small" color="text-body-secondary">
            Illustrative, not measured. The chain is the automatic shape for most targets: 3 draft
            steps, top-k 1, 4 verified positions. A <code>LlamaForCausalLM</code> or Grok-1 target
            gets a tree instead (see &quot;Draft shape&quot; below).
          </Box>

          <Box variant="p">
            That count is the number to watch. <code>sglang:spec_accept_length</code> is the mean of
            accepted drafts plus the bonus token per verify forward, so 1.0 means the drafts never land,
            and <code>sglang:spec_accept_rate</code> is accepted drafts over proposed drafts{' '}
            <Cite tier={1} href={sglangUrl(`${SRT}/observability/metrics_collector.py`, 'L503-L514')}>
              metrics_collector.py L503-L514
            </Cite>
            . The round in the diagram reads 3. Both gauges need <code>--enable-metrics</code>, and the
            periodic decode log line prints the same pair as <code>accept len</code> and{' '}
            <code>accept rate</code>{' '}
            <Cite
              tier={1}
              href={sglangUrl(`${SRT}/managers/scheduler_components/metrics_reporter.py`, 'L982')}
            >
              metrics_reporter.py L982
            </Cite>
            .
          </Box>
          <Box variant="p">
            Drafting can stop while the draft model keeps working. When adaptive speculation (below)
            drops to zero draft steps, draft and verify collapse to a normal decode, and draft-extend
            still runs every round so the draft is ready when load falls{' '}
            <Cite tier={1} href={sglangUrl(EW2, 'L1403-L1441')}>
              eagle_worker_v2.py L1403-L1441
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Match the algorithm to what you already have: a draft checkpoint, a target that ships its own draft heads, or nothing but the tokens already seen"
          >
            The algorithm menu, by where the draft comes from
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The first question is what supplies the draft, because it decides what you download, train
            or skip, and the answers group three ways. A separate draft checkpoint drives{' '}
            <code>EAGLE</code>, <code>EAGLE3</code>, <code>STANDALONE</code> and <code>DFLASH</code>.
            Heads or drafts that ship with the target drive <code>NEXTN</code>, <code>DSPARK</code>{' '}
            and <code>UNO</code>. <code>NGRAM</code> needs no model at all. The two newer families
            appear in prose as DFlash and DSpark; the flags spell them <code>DFLASH</code> and{' '}
            <code>DSPARK</code>.
          </Box>
          <Box variant="p">
            <code>--speculative-algorithm</code> resolves a name as a built-in first, then the{' '}
            <code>NEXTN</code> alias, then any algorithm a plugin registered{' '}
            <Cite tier={1} href={sglangUrl(INFO, 'L32-L65')}>
              spec_info.py L32-L65
            </Cite>
            . The draft sources below come from the documentation&apos;s method table and the
            resolution hook for each name{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(SPEC_DOC, 'L41-L121')}>
              SGLang docs: speculative decoding (v0.5.22 source)
            </Cite>
            .
          </Box>
          <Table
            variant="embedded"
            wrapLines
            columnDefinitions={[
              { id: 'flag', header: 'Flag value', cell: (r: AlgoRow) => <code>{r.flag}</code> },
              { id: 'source', header: 'Draft comes from', cell: (r: AlgoRow) => r.source },
              { id: 'pass', header: 'What you pass', cell: (r: AlgoRow) => r.pass },
              { id: 'note', header: 'Worth knowing', cell: (r: AlgoRow) => r.note },
            ]}
            items={algoRows}
          />
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Size --max-running-requests yourself before speculation goes on, because an unset cap drops to 48"
          >
            What speculation costs in concurrency
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>
              With <code>--max-running-requests</code> unset, turning on EAGLE-family, NGRAM,{' '}
              <code>DFLASH</code> or <code>DSPARK</code> speculation resets it to 48, from 2048 to 4096
              otherwise
            </strong>{' '}
            <Cite tier={1} href={sglangUrl(HOOK, 'L995-L1003')} kind="code">
              speculative_hook.py L995-L1003
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(KVCONF, 'L2800-L2851')}>
              kv_cache_configurator.py L2800-L2851
            </Cite>
            . On a server sized for thousands of concurrent requests, speculation therefore runs 48
            at once and queues the rest. Raise the cap to the concurrency you serve, then measure,
            because published gains shrink as batches grow. The EAGLE-3 authors report up to 6.5x
            speedup against plain Hugging Face decoding, and a 1.38x throughput gain inside SGLang at
            batch size 64{' '}
            <Cite tier={3} href={EAGLE3_PAPER}>
              EAGLE-3 paper, arXiv 2503.01840v3 (paper claim)
            </Cite>
            . LMSYS (Large Model Systems Organization) reports 1.37x to 2.36x for Kimi-K3 with a DSpark
            draft at 16 concurrent requests on 8 B300 GPUs, against up to 3.14x at one{' '}
            <Cite tier={2} href={LMSYS_SF}>
              LMSYS blog, 2026-08-04 (project claim)
            </Cite>
            . An explicit value is cut down, with a warning, if the KV pool cannot hold it{' '}
            <Cite tier={1} href={sglangUrl(KVCONF, 'L2800-L2851')}>
              kv_cache_configurator.py L2800-L2851
            </Cite>
            .
          </Box>
          <Box variant="p">
            The EAGLE family here is <code>EAGLE</code>, <code>EAGLE3</code>, <code>NEXTN</code>,{' '}
            <code>STANDALONE</code> and frozen-KV MTP, and each hook logs a warning when it applies the
            reset{' '}
            <Cite tier={1} href={sglangUrl(HOOK, 'L995-L1003')} kind="code">
              speculative_hook.py L995-L1003
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(HOOK, 'L1204-L1213')} kind="code">
              L1204-L1213
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(HOOK, 'L421-L430')} kind="code">
              L421-L430
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(HOOK, 'L777-L786')} kind="code">
              L777-L786
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(HOOK, 'L914-L923')} kind="code">
              L914-L923
            </Cite>
            . Without speculation the cap is derived from the KV pool, per data-parallel worker:
            KV tokens divided by context length times 512, clamped to 2048 to 4096, never above half
            the KV tokens, and on hybrid models never above what the Mamba state cache holds{' '}
            <Cite tier={1} href={sglangUrl(KVCONF, 'L2800-L2851')}>
              kv_cache_configurator.py L2800-L2851
            </Cite>
            . <code>UNO</code> is the one built-in whose hook leaves the cap alone, by our reading of its
            resolution code{' '}
            <Cite tier={1} href={sglangUrl(HOOK, 'L432-L596')} kind="code">
              speculative_hook.py L432-L596
            </Cite>
            . With attention DP the cut goes further. The reset writes the flag itself, and an
            explicit value is divided across attention-DP ranks, so by our reading of the two code
            paths 8 ranks run 6 requests each{' '}
            <Cite tier={1} href={sglangUrl(KVCONF, 'L2807-L2810')} kind="code">
              kv_cache_configurator.py L2807-L2810
            </Cite>
            .
          </Box>
          <Box variant="p">
            Opt-in adaptive speculation (<code>--speculative-adaptive</code>, <code>EAGLE</code> or{' '}
            <code>EAGLE3</code> chains only) changes the draft depth with load. It smooths the observed
            accept length and picks the steps per batch-size band. With its built-in table a batch of 1
            to 7 requests may draft up to 7 steps, 8 to 31 at most 3, 32 to 63 at most 1, and batches of
            64 or more drop to zero draft steps{' '}
            <Cite tier={1} href={sglangUrl(ADAPT, 'L27-L52')}>
              adaptive_spec_params.py L27-L52
            </Cite>
            . With top-k above 1, attention DP, multi-layer EAGLE, two-batch overlap or PD (prefill/decode) multiplexing
            it falls back to static settings with a warning{' '}
            <Cite tier={1} href={sglangUrl(ADAPT, 'L55-L91')}>
              adaptive_spec_params.py L55-L91
            </Cite>{' '}
            <Cite tier={1} href={sglangDocsSrcUrl('advanced_features/adaptive_speculative_decoding', 'L10-L14')}>
              SGLang docs: adaptive speculative decoding (v0.5.22 source)
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Know which shape your target gets with no flags, which attention backend that shape selects on B200, and the two flags that pin a chain"
          >
            Draft shape: chain or tree, and who picks it
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Three knobs set the shape: <code>--speculative-num-steps</code> (draft depth),{' '}
            <code>--speculative-eagle-topk</code> (branches kept per step) and{' '}
            <code>--speculative-num-draft-tokens</code> (positions verified). Leave all three unset and
            SGLang picks them from the target architecture. A <code>LlamaForCausalLM</code> or Grok-1
            target gets a tree: 5 draft
            steps, top-k 4, 8 verified tokens. Every other target, and any <code>STANDALONE</code>{' '}
            draft, gets a chain: 3 steps, top-k 1, 4 verified tokens{' '}
            <Cite tier={1} href={sglangUrl(HOOK, 'L1340-L1371')}>
              speculative_hook.py L1340-L1371
            </Cite>
            . Setting top-k or the draft-token count without <code>--speculative-num-steps</code> fails
            an assertion at startup{' '}
            <Cite tier={1} href={sglangUrl(HOOK, 'L1068-L1083')}>
              speculative_hook.py L1068-L1083
            </Cite>
            . To pin a chain, pass <code>--speculative-num-steps N --speculative-eagle-topk 1</code>;
            with top-k 1 the server sets the verify width to N + 1 whatever{' '}
            <code>--speculative-num-draft-tokens</code> says{' '}
            <Cite tier={1} href={sglangUrl(HOOK, 'L1162-L1172')}>
              speculative_hook.py L1162-L1172
            </Cite>
            .
          </Box>
          <Box variant="p">
            In a tree, each draft step keeps the k best continuations of every branch, the best nodes up
            to the draft-token count form the tree, and the target scores the whole tree in one forward
            with an attention mask that lets each node see only its own ancestors{' '}
            <Cite tier={1} href={sglangUrl(EU, 'L113-L220')}>
              eagle_utils.py L113-L220
            </Cite>
            . The kept path is the longest root-to-leaf path the target agrees with, plus the bonus
            token. A tree spends extra verify width, 8 positions per request at the Llama default
            against 4 for the default chain, to raise the accepted length.
          </Box>
          <Box variant="p">
            NGRAM and DFlash set their own shapes. NGRAM verifies a 12-token tree of up to 10 branches
            by default, its branch count taken from <code>--speculative-ngram-max-bfs-breadth</code>{' '}
            <Cite tier={1} href={sglangUrl(HOOK, 'L1214-L1239')}>
              speculative_hook.py L1214-L1239
            </Cite>
            . <code>DFLASH</code> forces one step and top-k 1 and verifies one block, sized from the
            draft checkpoint&apos;s config, 16 if the config does not say{' '}
            <Cite tier={1} href={sglangUrl(HOOK, 'L311-L396')}>
              speculative_hook.py L311-L396
            </Cite>
            .
          </Box>
          <Box variant="p">
            The shape also feeds the attention-backend choice, and with it the page size the radix cache
            reuses in (section 8, Attention Backends and Kernels). With{' '}
            <code>--speculative-eagle-topk</code> above 1, or top-k 1 with an explicit page size above
            1, Hopper and B200 MHA (multi-head attention) models leave their defaults for{' '}
            <code>flashinfer</code> (<code>triton</code> without FlashInfer), at page size 1 unless you set
            one{' '}
            <Cite tier={1} href={sglangUrl(`${SRT}/utils/common.py`, 'L4014-L4020')}>
              utils/common.py L4014-L4020
            </Cite>
            . On B200 the default also leaves <code>trtllm_mha</code> (the TensorRT-LLM attention
            kernels) and its 64-token pages when speculation is on and{' '}
            <code>--speculative-eagle-topk</code> is unset, because the backend is resolved before
            SGLang fills in the automatic shape{' '}
            <Cite tier={1} href={sglangUrl(MOB, 'L303-L311')} kind="code">
              model_override_base.py L303-L311
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(PIPE, 'L232-L294')} kind="code">
              pipeline.py L232-L294
            </Cite>
            . By our reading of the same lines, that includes targets whose automatic shape is a chain.
            To keep <code>trtllm_mha</code> under speculation on B200, set{' '}
            <code>--speculative-num-steps</code> and <code>--speculative-eagle-topk 1</code> yourself and
            leave <code>--page-size</code> unset; that backend refuses top-k above 1{' '}
            <Cite tier={1} href={sglangUrl(HOOK, 'L1068-L1090')} kind="code">
              speculative_hook.py L1068-L1090
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Know what the default verifier accepts for greedy and sampled requests, and which opt-in verifiers keep more drafts"
          >
            Verification: what counts as agreement
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A greedy request keeps a drafted token when it matches the target&apos;s own choice. A
            sampled request is verified target-only by default: each drafted token is treated as a
            certain proposal and accepted with the target&apos;s probability for it{' '}
            <Cite tier={1} href={sglangUrl(EU, 'L858-L1004')}>
              eagle_utils.py L858-L1004
            </Cite>
            . The two acceptance thresholds, <code>--speculative-accept-threshold-single</code> and{' '}
            <code>--speculative-accept-threshold-acc</code>, default to 1.0; values below 1 accept drafts
            more often than the target&apos;s probabilities allow, which trades exactness for acceptance{' '}
            <Cite tier={1} href={sglangUrl(FIELDS, 'L109-L116')}>
              spec.py L109-L116
            </Cite>
            .
          </Box>
          <Box variant="p">
            Two verifiers are opt-in. <code>--speculative-use-rejection-sampling</code> verifies against
            the draft&apos;s full distribution, which accepts more often when the draft is well
            calibrated. It takes <code>EAGLE</code> or <code>EAGLE3</code> chains only (top-k 1), with
            both thresholds at 1.0, and refuses deterministic inference. On ROCm (AMD&apos;s GPU software
            stack) it switches on for you for <code>EAGLE</code> with top-k 1, because ROCm verify
            otherwise falls back to greedy and ignores temperature{' '}
            <Cite tier={1} href={sglangUrl(HOOK, 'L1086-L1158')}>
              speculative_hook.py L1086-L1158
            </Cite>
            .
          </Box>
          <Box variant="p">
            Block verification, available from v0.5.22 and off by default (
            <code>--speculative-use-block-verification</code>), checks every drafted prefix and keeps
            the longest one that passes, even past an earlier rejected token, with a correction
            distribution that preserves the target&apos;s sampling{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(SPEC_DOC, 'L409-L432')}>
              SGLang docs: block verification (v0.5.22 source)
            </Cite>{' '}
            <Cite tier={3} href={BLOCK_PAPER}>
              Sun et al., Block Verification Accelerates Speculative Decoding, arXiv 2403.10444v3
            </Cite>
            . It accepts <code>EAGLE</code>, <code>EAGLE3</code> (and so <code>NEXTN</code>),{' '}
            <code>DFLASH</code> and <code>DSPARK</code> on CUDA or ROCm, and for the EAGLE pair it turns
            rejection sampling on, so those need top-k 1{' '}
            <Cite tier={1} href={sglangUrl(HOOK, 'L161-L180')}>
              speculative_hook.py L161-L180
            </Cite>{' '}
            <Cite tier={1} href={RELEASE}>
              v0.5.22 release notes
            </Cite>
            . Greedy requests keep the greedy check.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Check the combinations a production launch line runs into before you ship it: the overlap scheduler, JSON mode, hybrid models, PD and data-parallel attention"
          >
            Speculation beside the rest of the engine
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Every built-in algorithm has one worker that runs in both scheduler loops, and the overlap
            loop is the default, so the CPU work of round N+1 is prepared while round N runs on the GPU{' '}
            <Cite tier={1} href={sglangUrl(INFO, 'L302-L361')}>
              spec_info.py L302-L361
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(`${SRT}/managers/scheduler.py`, 'L495-L500')}>
              scheduler.py L495-L500
            </Cite>
            . Plan for overlap on with every algorithm on GPU, and pass{' '}
            <code>--disable-overlap-schedule</code> when you want the synchronous loop, which runs
            the same worker (section 4, The Scheduler). The documentation lists more overlap
            restrictions than v0.5.22&apos;s code applies; both sides are below, and the code side was
            read, not run.
          </Box>
          <ExpandableSection headerText="Where the documentation and v0.5.22's code differ on overlap, top-k and devices">
            <SpaceBetween size="s">
              <Box variant="p">
                The documentation says <code>NGRAM</code> and <code>DFLASH</code> turn the overlap
                scheduler off{' '}
                <Cite tier={1} href={sglangDocsSrcUrl(SPEC_DOC, 'L100-L118')} kind="doc-code-conflict">
                  SGLang docs: speculative decoding (v0.5.22 source)
                </Cite>
                . On GPU, no resolution hook turns overlap off for either at v0.5.22: the NGRAM hook
                does it only on CPU, and the DFLASH hook never touches the flag{' '}
                <Cite tier={1} href={sglangUrl(HOOK, 'L65-L77')}>
                  speculative_hook.py L65-L77
                </Cite>{' '}
                <Cite tier={1} href={sglangUrl(HOOK, 'L279-L431')}>
                  L279-L431
                </Cite>{' '}
                <Cite tier={1} href={sglangUrl(`${SRT}/speculative/ngram_worker.py`, 'L238-L310')}>
                  ngram_worker.py L238-L310
                </Cite>
                . This was read from code and not run. NGRAM does force mixed chunked prefill off, and
                DFlash keeps it{' '}
                <Cite tier={1} href={sglangUrl(HOOK, 'L1214-L1218')}>
                  speculative_hook.py L1214-L1218
                </Cite>
                .
              </Box>
              <Box variant="p">
                The documentation says the overlap scheduler supports only{' '}
                <code>--speculative-eagle-topk 1</code> and errors above it{' '}
                <Cite tier={1} href={sglangDocsSrcUrl(SPEC_DOC, 'L743-L750')} kind="doc-code-conflict">
                  SGLang docs: Speculative Decoding V2 (v0.5.22 source)
                </Cite>
                . The v0.5.22 argument hooks hold no such check, the V2 worker that both loops run has
                code paths for top-k above 1, and an in-tree CI (continuous integration) test launches{' '}
                <code>EAGLE3</code> with top-k 4 under the default loop{' '}
                <Cite tier={1} href={sglangUrl(EW2, 'L1092-L1102')}>
                  eagle_worker_v2.py L1092-L1102
                </Cite>{' '}
                <Cite tier={1} href={sglangUrl(EW2, 'L1209-L1215')}>
                  L1209-L1215
                </Cite>{' '}
                <Cite tier={1} href={sglangUrl('test/registered/attention/test_flash_attention_4.py', 'L69-L83')}>
                  test_flash_attention_4.py L69-L83
                </Cite>
                . That test was read, not run. Specific settings still need top-k 1:{' '}
                <code>trtllm_mha</code>, adaptive steps and rejection sampling.
              </Box>
              <Box variant="p">
                The documentation calls NGRAM CUDA-only{' '}
                <Cite tier={1} href={sglangDocsSrcUrl(SPEC_DOC, 'L842-L848')} kind="doc-code-conflict">
                  SGLang docs: NGRAM notes (v0.5.22 source)
                </Cite>
                ; the v0.5.22 argument check accepts CUDA, CPU and XPU{' '}
                <Cite tier={1} href={sglangUrl(HOOK, 'L1195-L1202')}>
                  speculative_hook.py L1195-L1202
                </Cite>
                . Runtime behaviour on CPU and XPU was not exercised in this research.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <Box variant="p">
            Structured output composes with speculation by masking the draft tree (section 10,
            Structured Output). For each constrained request the CPU walks the draft tree with the
            grammar and computes one mask row per node, and the target&apos;s verify logits are masked
            node by node, so a draft the grammar forbids is never accepted{' '}
            <Cite tier={1} href={sglangUrl(SU, 'L520-L635')}>
              spec_utils.py L520-L635
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(SU, 'L696-L725')}>
              L696-L725
            </Cite>
            . For the EAGLE family, <code>STANDALONE</code> and the DFlash family the walk overlaps the
            verify forward; NGRAM drafts on the CPU, so a constrained NGRAM batch waits for the previous
            step{' '}
            <Cite tier={1} href={sglangUrl(INFO, 'L165-L171')}>
              spec_info.py L165-L171
            </Cite>
            . When the grammar reaches its end state inside an accepted run, as when a JSON object
            closes, the rest of the run is dropped, neither emitted nor kept in the KV cache{' '}
            <Cite tier={1} href={sglangUrl(BRP, 'L876-L927')}>
              batch_result_processor.py L876-L927
            </Cite>
            .
          </Box>
          <Box variant="p">
            Hybrid models mix attention layers with Mamba-style linear layers (section 8, Attention
            Backends and Kernels) and checkpoint
            their recurrent state at fixed token intervals, so the radix cache can resume a prefix. In
            v0.5.22 that boundary check counts only the tokens the grammar kept{' '}
            <Cite tier={1} href={sglangUrl(BRP, 'L1607-L1641')}>
              batch_result_processor.py L1607-L1641
            </Cite>
            . Releases before it also counted the dropped tokens, so a checkpoint could be recorded for
            the wrong position and a later request reusing that prefix resumed from the wrong state{' '}
            <Cite tier={1} href={RELEASE}>
              v0.5.22 release notes
            </Cite>{' '}
            <Cite tier={1} href="https://github.com/sgl-project/sglang/pull/43029">
              PR 43029
            </Cite>
            . Serve a hybrid model with speculation and a grammar on v0.5.22 or later.
          </Box>
          <Table
            variant="embedded"
            wrapLines
            columnDefinitions={[
              { id: 'combo', header: 'Combination', cell: (r: ComboRow) => r.combo },
              { id: 'behaviour', header: 'What v0.5.22 does', cell: (r: ComboRow) => r.behaviour },
            ]}
            items={comboRows}
          />
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Find a ready-made draft before training one, and keep the training stack on its own SGLang version"
          >
            Where drafts come from
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            For many targets an EAGLE-3 draft already exists. SpecBundle is the catalogue of ready-made
            drafts trained with SpecForge, listed in the SGLang cookbook by target model{' '}
            <Cite tier={1} href={sglangUrl('docs/cookbook/specbundle/specbundle_usage.mdx', 'L9-L39')}>
              SpecBundle usage (v0.5.22 source)
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl('docs/cookbook/specbundle/supported_models.mdx')}>
              SpecBundle supported models (v0.5.22 source)
            </Cite>
            . The cookbook launches them as <code>EAGLE3</code> chains (3 steps, top-k 1, 4 verified
            tokens), so a Llama target served from SpecBundle runs a chain where the automatic setting
            would draft a tree.
          </Box>
          <Box variant="p">
            SpecForge, a separate repository from the SGLang team, trains drafts for SGLang: EAGLE3,
            P-EAGLE, MTP, DFlash and its Domino variant, and DSpark, with exporters that write
            SGLang-loadable checkpoints{' '}
            <Cite tier={1} href={`${SF}/tree/${SF_SHA}/specforge/algorithms`}>
              SpecForge specforge/algorithms at f586b1ee
            </Cite>{' '}
            <Cite tier={2} href={`${SF}/blob/${SF_SHA}/README.md#L16-L60`}>
              SpecForge README at f586b1ee
            </Cite>{' '}
            <Cite tier={1} href={`${SF}/tree/${SF_SHA}/specforge/export`}>
              SpecForge specforge/export at f586b1ee
            </Cite>
            . It has no tags or releases, so this dive pins commit f586b1ee (2026-10-22). At that commit
            it depends on <code>sglang==0.5.18</code> for its training-time target server, four releases
            behind v0.5.22{' '}
            <Cite tier={1} href={`${SF}/blob/${SF_SHA}/pyproject.toml#L25-L35`}>
              SpecForge pyproject.toml L25-L35
            </Cite>
            . Keep training and serving in separate environments.
          </Box>
          <ExpandableSection headerText="Published speedups and their conditions">
            <SpaceBetween size="s">
              <Box variant="p">
                The SGLang documentation reports 158 tokens/s without speculation, 244 with EAGLE-2 and
                373 with EAGLE-3 for Llama 3.1 8B Instruct on one H100 on MT-Bench, about 2.4x for
                EAGLE-3 by our arithmetic. The page gives no batch size or draft settings{' '}
                <Cite tier={1} href={sglangDocsSrcUrl(SPEC_DOC, 'L122-L152')}>
                  SGLang docs: performance highlights (v0.5.22 source; project claim)
                </Cite>
                ; the EAGLE-3 paper prints the same three figures as batch size 1, measured by the SGLang
                team{' '}
                <Cite tier={3} href={EAGLE3_PAPER}>
                  EAGLE-3 paper, arXiv 2503.01840v3, Table 4 (paper claim)
                </Cite>
                .
              </Box>
              <Box variant="p">
                The EAGLE-3 authors report a speedup ratio up to 6.5x against plain Hugging Face decoding,
                about 1.4x over EAGLE-2 at batch size 1, and a 1.38x throughput gain inside SGLang at batch
                size 64 for Llama 3.1 8B Instruct on one H100 with a 3-step chain{' '}
                <Cite tier={3} href={EAGLE3_PAPER}>
                  EAGLE-3 paper, arXiv 2503.01840v3 (paper claim)
                </Cite>
                .
              </Box>
              <Box variant="p">
                LMSYS reports, against plain autoregressive decoding: Qwen3.6-27B with a Domino draft at
                block size 16, 3.34x to 5.72x on 2 A100 GPUs at concurrency 1; Qwen3.5-397B-A17B with a
                DFlash draft at block size 16, up to 4.31x on HumanEval on 8 B200 GPUs with 8-way TP (tensor parallelism), BF16
                (bfloat16), greedy decoding, thinking on and concurrency 1; Kimi-K3 with a DSpark draft, up to
                3.14x on GSM8K on 8 B300 GPUs at concurrency 1 and 1.37x to 2.36x at concurrency 16. The
                post gives no acceptance-length figures{' '}
                <Cite tier={2} href={LMSYS_SF}>
                  LMSYS blog, SpecForge v0.3.0, 2026-08-04 (project claim)
                </Cite>
                .
              </Box>
              <Box variant="p">
                Every figure is a project or paper claim on the stated hardware, and the largest come from
                concurrency 1. Treat them as upper bounds and measure on your own traffic.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Start from a chain at a concurrency you chose, then keep or drop speculation on the accept length your own traffic produces"
          >
            Turning it on, and the number that decides
          </Header>
        }
      >
        <SpaceBetween size="m">
          <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{LAUNCH}</pre>
          <Box variant="p">
            Each flag answers one part of this section. The algorithm and draft path come from the menu.
            The two shape flags pin a chain, which also keeps <code>trtllm_mha</code> on a B200 MHA
            target that would default to it. The
            explicit cap replaces the 48 that speculation would otherwise set, so the server admits the
            concurrency you planned for.
          </Box>
          <Box variant="p">
            <strong>Against vLLM:</strong> neither engine speculates unless asked{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L391')}>
              vLLM vllm.py L391
            </Cite>
            . SGLang&apos;s EAGLE drafts a tree for a Llama target by default, where vLLM 0.31.0 drafts
            K-token chains; no token-tree option was found in vLLM&apos;s speculative config or attention
            backends{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/speculative.py', 'L455-L513')}>
              vLLM speculative.py L455-L513
            </Cite>
            . Compare the two at matched settings, with <code>--speculative-eagle-topk 1</code> on SGLang
            and the same draft depth on both (
            <Link href="../vllm/">vLLM dive, section 11: Speculative Decoding</Link>).
          </Box>
          <Box variant="p">
            <strong>Where to start:</strong> run the line above on a copy of your traffic at the
            concurrency you plan to serve, and read <code>sglang:spec_accept_length</code>, or{' '}
            <code>accept len</code> in the decode log. A value near 1.0 means the drafts are not
            landing. Speedup follows that number less the draft and verify overhead, which grows with
            batch size, so keep speculation only if throughput at your concurrency beats the same server
            with speculation off.
          </Box>
        </SpaceBetween>
      </Container>

      <ExpandableSection
        variant="container"
        headerText="Where this lives in code"
        headerDescription="The speculative-decoding reading path through the v0.5.22 source, in reading order"
      >
        <Table
          variant="embedded"
          wrapLines
          columnDefinitions={[
            { id: 'file', header: 'File and lines', cell: (r: WalkRow) => r.file },
            { id: 'what', header: 'What to look at', cell: (r: WalkRow) => r.what },
            { id: 'why', header: 'Why it matters', cell: (r: WalkRow) => r.why },
          ]}
          items={walkRows}
        />
        <Box variant="small" color="text-body-secondary">
          The speculative directory as a whole:{' '}
          <Cite tier={1} href={sglangTreeUrl(`${SRT}/speculative`)}>
            python/sglang/srt/speculative/
          </Cite>
        </Box>
      </ExpandableSection>
    </SpaceBetween>
  );
}
