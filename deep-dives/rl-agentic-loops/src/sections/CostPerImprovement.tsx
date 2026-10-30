import { Fragment, useState } from 'react';
import type { ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import Select from '@cloudscape-design/components/select';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';
import { Cite, arxiv } from '../components/Cite';
import type { CiteKind, Tier } from '../components/Cite';
import {
  BreakevenInputError,
  compareAtVolume,
  formatCompact,
  formatCount,
  formatUsd,
  niceAxis,
  perQueryCostFrom,
  priceQualityGap,
  requireFinite,
  requireNonNegative,
  requirePositive,
  totalCost,
  trainingCostFrom,
} from '../lib/breakeven';
import type { Comparison, CostOption, OptionKey, QualityTrade } from '../lib/breakeven';

/* ------------------------------------------------------------------------ */
/* Sources                                                                  */
/* ------------------------------------------------------------------------ */

/** Training-Free Group Relative Policy Optimization (Tencent Youtu), cost example in Section 4.2. */
const TF_GRPO = arxiv('2510.08191v1');
/** Agrawal et al., GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning. */
const GEPA = arxiv('2507.19457v2');
/** DeepSeek-R1, arXiv v2 with the Nature supplementary material as appendices. */
const R1 = arxiv('2501.12948v2');
/** ProRL: Prolonged Reinforcement Learning Expands Reasoning Boundaries in Large Language Models. */
const PRORL = arxiv('2505.24864v1');
/** Liu et al., Understanding R1-Zero-Like Training (Dr. GRPO). */
const DR_GRPO = arxiv('2503.20783v2');
/** Karan and Du, Reasoning with Sampling: Your Language Model is Secretly a Reasoner. */
const SAMPLING = arxiv('2510.14901v1');
/** Suzgun et al., Dynamic Cheatsheet: Test-Time Learning with Adaptive Memory. */
const CHEATSHEET = arxiv('2504.07952v1');
/** Zhang et al., Agentic Context Engineering. */
const ACE = arxiv('2510.04618v3');
const DEEPSWE = 'https://www.together.ai/blog/deepswe';
/** The verl team's reproduction of DAPO on Qwen2.5-32B, a finished public run record. */
const DAPO_RUN = 'https://wandb.ai/verl-org/DAPO%20Reproduction%20on%20verl/runs/0qjd0wap';
const BEDROCK_PRICING = 'https://aws.amazon.com/bedrock/pricing/';
/** AWS Price List API, AmazonBedrock offer for us-east-1, version published 2026-10-30. */
const BEDROCK_PRICE_LIST =
  'https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonBedrock/20261030160456/us-east-1/index.json';
const RFT_JOB = 'https://docs.aws.amazon.com/bedrock/latest/userguide/rft-submit-job.html';
const RFT_BEST_PRACTICES =
  'https://aws.amazon.com/blogs/machine-learning/reinforcement-fine-tuning-on-amazon-bedrock-best-practices/';

function TfGrpo({ children }: { children: ReactNode }) {
  return (
    <Cite tier={3} href={TF_GRPO} venue="preprint">
      {children}
    </Cite>
  );
}

/** Citations the calculator attaches to pre-filled values, one entry per citable location. */
type SourceId =
  | 'tfgrpo-cost'
  | 'tfgrpo-table3'
  | 'gepa-table1'
  | 'r1-cost'
  | 'prorl'
  | 'deepswe'
  | 'drgrpo'
  | 'dapo-run'
  | 'bedrock-pricing'
  | 'bedrock-price-list'
  | 'sampling'
  | 'cheatsheet';

interface SourceRef {
  readonly id: SourceId;
  readonly tier: Tier;
  readonly href: string;
  readonly label: string;
  readonly venue?: string;
  readonly kind?: CiteKind;
}

const SOURCES: readonly SourceRef[] = [
  { id: 'tfgrpo-cost', tier: 3, href: TF_GRPO, venue: 'preprint', label: 'Training-Free GRPO, Section 4.2' },
  { id: 'tfgrpo-table3', tier: 3, href: TF_GRPO, venue: 'preprint', label: 'Training-Free GRPO, Table 3' },
  { id: 'gepa-table1', tier: 3, href: GEPA, venue: 'ICLR 2026', label: 'GEPA, Table 1' },
  { id: 'r1-cost', tier: 3, href: R1, venue: 'Nature 2025', label: 'DeepSeek-R1, Appendix B.4.4 and Table 7' },
  { id: 'prorl', tier: 3, href: PRORL, venue: 'preprint', label: 'ProRL, Sections 1 and 3.2' },
  { id: 'deepswe', tier: 2, href: DEEPSWE, kind: 'vendor-claim', label: 'DeepSWE post (Agentica and Together AI)' },
  { id: 'drgrpo', tier: 3, href: DR_GRPO, venue: 'COLM 2025', label: 'Dr. GRPO, Section 1' },
  { id: 'dapo-run', tier: 2, href: DAPO_RUN, label: 'verl team, DAPO-Qwen2.5-32B run record (Weights & Biases)' },
  { id: 'bedrock-pricing', tier: 1, href: BEDROCK_PRICING, label: 'Amazon Bedrock pricing, reinforcement fine-tuning' },
  { id: 'bedrock-price-list', tier: 1, href: BEDROCK_PRICE_LIST, label: 'AWS Price List API, Nova 2 Lite RFT training hours' },
  { id: 'sampling', tier: 3, href: SAMPLING, venue: 'ICLR 2026', label: 'Reasoning with Sampling, Section 5.3' },
  { id: 'cheatsheet', tier: 3, href: CHEATSHEET, venue: 'EACL 2026', label: 'Dynamic Cheatsheet, Section 5, footnote 13' },
];

/** Renders the citation for one source id (mapped over the static list, so every link is fixed at build). */
function SourceCite({ id }: { id: SourceId }) {
  return (
    <>
      {SOURCES.map((s) =>
        s.id === id ? (
          <Cite key={s.id} tier={s.tier} href={s.href} venue={s.venue} kind={s.kind}>
            {s.label}
          </Cite>
        ) : null,
      )}
    </>
  );
}

/* ------------------------------------------------------------------------ */
/* Calculator state and presets                                             */
/* ------------------------------------------------------------------------ */

type Unit = 'gpu-hours' | 'training-hours' | 'rollouts' | 'dollars';
type FieldKey = 'quantity' | 'price' | 'perQuery' | 'multiplier' | 'quality';
const FIELD_KEYS: readonly FieldKey[] = ['quantity', 'price', 'perQuery', 'multiplier', 'quality'];

const UNIT_LABEL: Record<Unit, string> = {
  'gpu-hours': 'GPU-hours',
  'training-hours': 'Managed training hours',
  rollouts: 'Rollouts',
  dollars: 'US dollars, total',
};
const UNIT_OPTIONS = (Object.keys(UNIT_LABEL) as Unit[]).map((u) => ({ value: u, label: UNIT_LABEL[u] }));
/** The unit as a noun in the training-cost line ("20,000 GPU-hours x $0.5"). */
const UNIT_NOUN: Record<Unit, string> = {
  'gpu-hours': 'GPU-hours',
  'training-hours': 'training hours',
  rollouts: 'rollouts',
  dollars: 'dollars',
};

/** Where a field's value came from: the reader, a cited source, or a stated assumption. */
type Provenance =
  | { readonly kind: 'yours' }
  | { readonly kind: 'source'; readonly ids: readonly SourceId[]; readonly note?: string }
  | { readonly kind: 'note'; readonly text: string };

interface FieldState {
  readonly text: string;
  readonly from: Provenance;
}

interface SideState {
  readonly presetId: string;
  readonly unit: Unit;
  readonly fields: Readonly<Record<FieldKey, FieldState>>;
}

interface Preset {
  readonly id: string;
  readonly side: OptionKey;
  readonly label: string;
  readonly scope: string;
  readonly sources: readonly SourceId[];
  readonly unit?: Unit;
  readonly fill: Partial<Record<FieldKey, FieldState>>;
  /** Start this column's cost per query from the other column's: the same model on both sides. */
  readonly copyPerQueryFromOther?: boolean;
}

const YOURS: Provenance = { kind: 'yours' };
const EMPTY: FieldState = { text: '', from: YOURS };

function cited(text: string, ids: readonly SourceId[], note?: string): FieldState {
  return { text, from: { kind: 'source', ids, note } };
}

function noted(text: string, note: string): FieldState {
  return { text, from: { kind: 'note', text: note } };
}

const PRESETS: readonly Preset[] = [
  {
    id: 'own-a',
    side: 'a',
    label: 'Your own numbers',
    scope: 'Clears this column for your own training run and serving cost.',
    sources: [],
    fill: {},
  },
  {
    id: 'tfgrpo-rl',
    side: 'a',
    label: 'ReTool RL on Qwen2.5-32B (Training-Free GRPO paper)',
    scope:
      "The RL side of the paper's cost example: about 20,000 GPU-hours to replicate ReTool's training on Qwen2.5-32B-Instruct at an assumed $0.5 per GPU-hour, served on four GPUs at about 400 problems an hour, and 67.0 on AIME 2024. Cross-model: the text-loop side runs on the 671B DeepSeek-V3.1-Terminus.",
    sources: ['tfgrpo-cost', 'tfgrpo-table3'],
    unit: 'gpu-hours',
    fill: {
      quantity: cited('20000', ['tfgrpo-cost']),
      price: cited('0.5', ['tfgrpo-cost'], "the authors' assumed rental price"),
      perQuery: cited('0.005', ['tfgrpo-cost'], 'four GPUs at full load'),
      quality: cited('67.0', ['tfgrpo-table3'], 'AIME 2024, mean of 32 samples'),
    },
  },
  {
    id: 'grpo-qwen3-8b',
    side: 'a',
    label: 'GRPO with LoRA on Qwen3 8B (GEPA paper)',
    scope:
      '24,000 rollouts on each of six tasks, aggregate score 48.91. The same model as the GEPA preset in the other column, so this pair compares methods. Enter your price per rollout and your cost per query.',
    sources: ['gepa-table1'],
    unit: 'rollouts',
    fill: {
      quantity: cited('24000', ['gepa-table1']),
      quality: cited('48.91', ['gepa-table1'], 'aggregate of six tasks'),
    },
  },
  {
    id: 'r1',
    side: 'a',
    label: 'DeepSeek-R1 post-training',
    scope:
      "147K H800 GPU-hours, priced by the authors at $294K under an assumed $2 per GPU-hour. R1-Zero's pure RL run is 101K of those hours, on 512 GPUs. The table covers the R1-Zero run, SFT (supervised fine-tuning) data creation and the R1 run; the preparatory runs on a 30B model are not costed.",
    sources: ['r1-cost'],
    unit: 'gpu-hours',
    fill: {
      quantity: cited('147000', ['r1-cost']),
      price: cited('2', ['r1-cost'], "the authors' assumed rental price"),
    },
  },
  {
    id: 'prorl',
    side: 'a',
    label: 'ProRL, a 1.5B model',
    scope: 'About 16k H100 GPU-hours on 4 nodes of 8 GPUs, for more than 2,000 RL steps. Enter your price per GPU-hour.',
    sources: ['prorl'],
    unit: 'gpu-hours',
    fill: { quantity: cited('16000', ['prorl']) },
  },
  {
    id: 'deepswe',
    side: 'a',
    label: 'DeepSWE, Qwen3-32B (vendor claim)',
    scope:
      'Agentica and Together AI report six days on 64 H100s for an RL-only run. 9,216 GPU-hours is our arithmetic and assumes all 64 GPUs ran for all six days, which the post does not say.',
    sources: ['deepswe'],
    unit: 'gpu-hours',
    fill: { quantity: cited('9216', ['deepswe'], 'our arithmetic: 64 GPUs x 6 days x 24 hours') },
  },
  {
    id: 'drgrpo',
    side: 'a',
    label: 'Dr. GRPO, Qwen2.5-Math-7B',
    scope: 'A minimal recipe: 27 hours on 8 A100s, 216 GPU-hours by our arithmetic, on a math-specialised base model.',
    sources: ['drgrpo'],
    unit: 'gpu-hours',
    fill: { quantity: cited('216', ['drgrpo'], 'our arithmetic: 8 GPUs x 27 hours') },
  },
  {
    id: 'dapo-verl',
    side: 'a',
    label: "verl's DAPO reproduction, Qwen2.5-32B",
    scope:
      "159.6 hours of logged step time over 489 steps on 16 nodes of 8 GPUs: the verl team's reproduction, not the DAPO authors' own run. 20,429 GPU-hours is our arithmetic for step time; the run's whole 273.8-hour span would make it about 35,000.",
    sources: ['dapo-run'],
    unit: 'gpu-hours',
    fill: { quantity: cited('20429', ['dapo-run'], 'our arithmetic: 128 GPUs x 159.6 hours') },
  },
  {
    id: 'bedrock-rft',
    side: 'a',
    label: 'Amazon Bedrock reinforcement fine-tuning',
    scope:
      "$80.00 per training hour for each of the three base models: Nova 2 Lite, gpt-oss-20b and Qwen3 32B. No typical job length was located in this research, and early stopping makes the length depend on your data, so enter your job's hours.",
    sources: ['bedrock-pricing', 'bedrock-price-list'],
    unit: 'training-hours',
    fill: {
      quantity: noted('', "Enter your job's training hours: no typical job length was located in this research."),
      price: cited('80', ['bedrock-pricing', 'bedrock-price-list']),
    },
  },
  {
    id: 'own-b',
    side: 'b',
    label: 'Your own numbers',
    scope: 'Clears this column for your own text loop or sampler.',
    sources: [],
    fill: {},
  },
  {
    id: 'tfgrpo-text',
    side: 'b',
    label: 'Training-Free GRPO on DeepSeek-V3.1-Terminus, 671B',
    scope:
      'About $18 of API tokens to learn from 100 problems, then about $0.02 per problem served (60K input and 8K output tokens, with cache-hit pricing), and 82.7 on AIME 2024. Cross-model: the RL side is Qwen2.5-32B.',
    sources: ['tfgrpo-cost', 'tfgrpo-table3'],
    unit: 'dollars',
    fill: {
      quantity: cited('18', ['tfgrpo-cost']),
      perQuery: cited('0.02', ['tfgrpo-cost']),
      multiplier: noted('1', 'Set to 1: the $0.02 already includes the learned context.'),
      quality: cited('82.7', ['tfgrpo-table3'], 'AIME 2024, mean of 32 samples'),
    },
  },
  {
    id: 'gepa-qwen3-8b',
    side: 'b',
    label: 'GEPA on Qwen3 8B',
    scope:
      '3,936 rollouts per task on average, 1,839 to 7,051 across six tasks; aggregate score 54.85, ahead of GRPO on five tasks and behind on AIME-2025 (32.00 against 38.00). The same model as the GRPO preset. Enter your price per rollout and the cost per query of the optimised prompt.',
    sources: ['gepa-table1'],
    unit: 'rollouts',
    fill: {
      quantity: cited('3936', ['gepa-table1'], 'average budget across six tasks'),
      quality: cited('54.85', ['gepa-table1'], 'aggregate of six tasks'),
    },
  },
  {
    id: 'sampling',
    side: 'b',
    label: 'Inference-time sampling, no training (section 8)',
    scope:
      "No training run. About 8.84 times the tokens of standard inference per answer, in the paper's MATH-500 setting; the multiplier moves with output length and the sampler's settings. The cost per query starts from the weight-update column's, as if both columns served the same model.",
    sources: ['sampling'],
    unit: 'dollars',
    fill: {
      quantity: noted('0', 'No training run: the sampler works on the frozen model.'),
      multiplier: cited('8.84', ['sampling'], "the paper's MATH-500 setting"),
    },
    copyPerQueryFromOther: true,
  },
  {
    id: 'dc-rs',
    side: 'b',
    label: 'Dynamic Cheatsheet, retrieval and synthesis variant (Claude 3.5 Sonnet, AIME 2024)',
    scope:
      '1,035 tokens per query against 370 at baseline, 2.8 times by our arithmetic, for the variant with retrieval and synthesis. One model on one benchmark; the footnote does not say whether the cheatsheet in the prompt is counted. It learns while serving, so the training cost is set to 0.',
    sources: ['cheatsheet'],
    unit: 'dollars',
    fill: {
      quantity: noted('0', 'Learns while serving: no separate training run.'),
      multiplier: cited('2.8', ['cheatsheet'], 'our arithmetic: 1,035 / 370'),
    },
  },
  {
    id: 'dc-cu',
    side: 'b',
    label: 'Dynamic Cheatsheet, cumulative variant (Claude 3.5 Sonnet, AIME 2024)',
    scope:
      '1,831 tokens per query against 370 at baseline, 4.9 times by our arithmetic, for the cumulative variant. Same scope as the retrieval and synthesis variant: one model, one benchmark, training cost set to 0.',
    sources: ['cheatsheet'],
    unit: 'dollars',
    fill: {
      quantity: noted('0', 'Learns while serving: no separate training run.'),
      multiplier: cited('4.9', ['cheatsheet'], 'our arithmetic: 1,831 / 370'),
    },
  },
];

const CROSS_MODEL_SOURCES: readonly SourceId[] = ['tfgrpo-cost', 'tfgrpo-table3'];

function presetsFor(side: OptionKey): readonly Preset[] {
  return PRESETS.filter((p) => p.side === side);
}

function presetById(id: string): Preset {
  const found = PRESETS.find((p) => p.id === id);
  if (!found) throw new Error(`Unknown calculator preset: ${id}`);
  return found;
}

function blankSide(side: OptionKey): SideState {
  return {
    presetId: side === 'a' ? 'own-a' : 'own-b',
    unit: side === 'a' ? 'gpu-hours' : 'dollars',
    fields: { quantity: EMPTY, price: EMPTY, perQuery: EMPTY, multiplier: { text: '1', from: YOURS }, quality: EMPTY },
  };
}

/**
 * Applies a preset. It fills the values its source reports. A value another source filled is
 * cleared rather than left beside this one, a price in a different unit is cleared, and values
 * the reader typed stay.
 */
function applyPreset(current: SideState, preset: Preset, other: SideState): SideState {
  if (preset.id === 'own-a' || preset.id === 'own-b') return blankSide(preset.side);
  const unit = preset.unit ?? current.unit;
  const next = {} as Record<FieldKey, FieldState>;
  for (const key of FIELD_KEYS) {
    const fill = preset.fill[key];
    const cur = current.fields[key];
    if (fill) next[key] = fill;
    else if (key === 'perQuery' && preset.copyPerQueryFromOther) {
      next[key] = noted(
        other.fields.perQuery.text,
        "Copied from the weight-update column: the same model at standard inference (our assumption).",
      );
    } else if (key === 'price' && unit !== current.unit) next[key] = EMPTY;
    else if (cur.from.kind !== 'yours') next[key] = key === 'multiplier' ? { text: '1', from: YOURS } : EMPTY;
    else next[key] = cur;
  }
  return { presetId: preset.id, unit, fields: next };
}

function initialState(): { a: SideState; b: SideState } {
  const a = applyPreset(blankSide('a'), presetById('tfgrpo-rl'), blankSide('b'));
  const b = applyPreset(blankSide('b'), presetById('tfgrpo-text'), a);
  return { a, b };
}

/* ------------------------------------------------------------------------ */
/* Parsing and evaluation (input errors become messages, not exceptions)    */
/* ------------------------------------------------------------------------ */

type Rule = 'non-negative' | 'positive' | 'any';
type Parsed = { readonly ok: true; readonly value: number } | { readonly ok: false; readonly message: string };

const RULE_MESSAGE: Record<BreakevenInputError['code'], string> = {
  'not-a-number': 'Enter a number',
  negative: 'Enter zero or more',
  'not-positive': 'Enter a number above zero',
  'equal-per-query-cost': 'The two options cost the same per query',
};

function parseField(text: string, rule: Rule): Parsed {
  if (text.trim() === '') return { ok: false, message: 'Enter a number' };
  const n = Number(text);
  try {
    if (rule === 'positive') requirePositive(n, 'field');
    else if (rule === 'non-negative') requireNonNegative(n, 'field');
    else requireFinite(n, 'field');
    return { ok: true, value: n };
  } catch (e) {
    if (e instanceof BreakevenInputError) return { ok: false, message: RULE_MESSAGE[e.code] };
    throw e;
  }
}

const FIELD_RULE: Record<FieldKey, Rule> = {
  quantity: 'non-negative',
  price: 'non-negative',
  perQuery: 'non-negative',
  multiplier: 'positive',
  quality: 'any',
};

/** The fields a side's cost depends on (price is ignored when the unit is dollars). */
function costFields(side: OptionKey, unit: Unit): FieldKey[] {
  const keys: FieldKey[] = ['quantity', 'perQuery'];
  if (unit !== 'dollars') keys.push('price');
  if (side === 'b') keys.push('multiplier');
  return keys;
}

function fieldError(side: OptionKey, state: SideState, key: FieldKey): string | undefined {
  const text = state.fields[key].text;
  if (key === 'quality' && text.trim() === '') return undefined;
  if (key !== 'quality' && !costFields(side, state.unit).includes(key)) return undefined;
  const parsed = parseField(text, FIELD_RULE[key]);
  return parsed.ok ? undefined : parsed.message;
}

interface SideNumbers {
  readonly quantity: number;
  readonly price: number;
  readonly referencePerQuery: number;
  readonly multiplier: number;
  readonly option: CostOption;
}

type SideParse = { readonly ok: true; readonly numbers: SideNumbers } | { readonly ok: false };

function parseSide(side: OptionKey, state: SideState): SideParse {
  const keys = costFields(side, state.unit);
  const values: Partial<Record<FieldKey, number>> = {};
  for (const key of keys) {
    const parsed = parseField(state.fields[key].text, FIELD_RULE[key]);
    if (!parsed.ok) return { ok: false };
    values[key] = parsed.value;
  }
  const quantity = values.quantity ?? 0;
  const price = state.unit === 'dollars' ? 1 : (values.price ?? 0);
  const referencePerQuery = values.perQuery ?? 0;
  const multiplier = side === 'b' ? (values.multiplier ?? 1) : 1;
  const option: CostOption = {
    trainingCost: trainingCostFrom(quantity, price),
    perQueryCost: perQueryCostFrom(referencePerQuery, multiplier),
  };
  return { ok: true, numbers: { quantity, price, referencePerQuery, multiplier, option } };
}

type FormResult =
  | {
      readonly kind: 'ok';
      readonly a: CostOption;
      readonly b: CostOption;
      readonly comparison: Comparison;
      readonly quality: QualityTrade | 'missing';
    }
  | { readonly kind: 'parallel'; readonly volume: number; readonly totalA: number; readonly totalB: number }
  | { readonly kind: 'incomplete' };

function evaluateForm(a: SideState, b: SideState, volumeText: string): FormResult {
  const pa = parseSide('a', a);
  const pb = parseSide('b', b);
  const pv = parseField(volumeText, 'non-negative');
  if (!pa.ok || !pb.ok || !pv.ok) return { kind: 'incomplete' };
  const optA = pa.numbers.option;
  const optB = pb.numbers.option;
  let comparison: Comparison;
  try {
    comparison = compareAtVolume(optA, optB, pv.value);
  } catch (e) {
    if (e instanceof BreakevenInputError && e.code === 'equal-per-query-cost') {
      return { kind: 'parallel', volume: pv.value, totalA: totalCost(optA, pv.value), totalB: totalCost(optB, pv.value) };
    }
    throw e;
  }
  const qa = parseField(a.fields.quality.text, 'any');
  const qb = parseField(b.fields.quality.text, 'any');
  const quality = qa.ok && qb.ok ? priceQualityGap(comparison, qa.value, qb.value) : 'missing';
  return { kind: 'ok', a: optA, b: optB, comparison, quality };
}

function usesSource(state: SideState, ids: readonly SourceId[]): boolean {
  return FIELD_KEYS.some((k) => {
    const from = state.fields[k].from;
    return from.kind === 'source' && from.ids.some((id) => ids.includes(id));
  });
}

/* ------------------------------------------------------------------------ */
/* Calculator UI                                                            */
/* ------------------------------------------------------------------------ */

const NAME: Record<OptionKey, string> = { a: 'the weight update', b: 'the per-query option' };

function capital(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function points(n: number): string {
  return Number(n.toFixed(2)).toString();
}

function ProvenanceNote({ from }: { from: Provenance }) {
  if (from.kind === 'yours') return <>Your value.</>;
  if (from.kind === 'note') return <>{from.text}</>;
  return (
    <>
      From
      {from.ids.map((id) => (
        <Fragment key={id}>
          {' '}
          <SourceCite id={id} />
        </Fragment>
      ))}
      {from.note ? ` (${from.note}).` : '.'}
    </>
  );
}

interface NumberFieldProps {
  readonly label: string;
  readonly description?: string;
  readonly field: FieldState;
  readonly error?: string;
  readonly onChange: (text: string) => void;
}

function NumberField({ label, description, field, error, onChange }: NumberFieldProps) {
  return (
    <FormField
      label={label}
      description={description}
      errorText={error}
      constraintText={<ProvenanceNote from={field.from} />}
    >
      <Input
        type="number"
        inputMode="decimal"
        value={field.text}
        invalid={Boolean(error)}
        onChange={({ detail }) => onChange(detail.value)}
      />
    </FormField>
  );
}

interface SideFormProps {
  readonly side: OptionKey;
  readonly state: SideState;
  readonly onField: (key: FieldKey, text: string) => void;
  readonly onUnit: (unit: Unit) => void;
  readonly onPreset: (presetId: string) => void;
}

function SideForm({ side, state, onField, onUnit, onPreset }: SideFormProps) {
  const parsed = parseSide(side, state);
  const preset = presetById(state.presetId);
  const options = presetsFor(side).map((p) => ({ value: p.id, label: p.label }));
  const selected = options.find((o) => o.value === state.presetId) ?? null;
  const err = (key: FieldKey) => fieldError(side, state, key);
  const set = (key: FieldKey) => (text: string) => onField(key, text);
  const f = state.fields;
  return (
    <SpaceBetween size="s">
      <Box variant="h3">{side === 'a' ? 'Pay once: a weight update' : 'Pay per query: a text loop or a sampler'}</Box>
      <ColumnLayout columns={2}>
        <NumberField label="Training quantity" field={f.quantity} error={err('quantity')} onChange={set('quantity')} />
        <FormField label="Unit">
          <Select
            selectedOption={{ value: state.unit, label: UNIT_LABEL[state.unit] }}
            options={UNIT_OPTIONS}
            onChange={({ detail }) => onUnit(detail.selectedOption.value as Unit)}
          />
        </FormField>
      </ColumnLayout>
      {state.unit !== 'dollars' && (
        <NumberField
          label="Your price per unit ($)"
          field={f.price}
          error={err('price')}
          onChange={set('price')}
        />
      )}
      <Box variant="small" color="text-body-secondary">
        Training cost:{' '}
        {parsed.ok
          ? state.unit === 'dollars'
            ? formatUsd(parsed.numbers.option.trainingCost)
            : `${formatCount(parsed.numbers.quantity)} ${UNIT_NOUN[state.unit]} x ${formatUsd(parsed.numbers.price)} = ${formatUsd(parsed.numbers.option.trainingCost)}`
          : 'waiting for valid numbers'}
      </Box>
      {side === 'a' ? (
        <NumberField
          label="Serving cost per query ($)"
          description="For a model you host: hourly server cost divided by the queries actually served per hour."
          field={f.perQuery}
          error={err('perQuery')}
          onChange={set('perQuery')}
        />
      ) : (
        <ColumnLayout columns={2}>
          <NumberField
            label="Cost per query before the multiplier ($)"
            field={f.perQuery}
            error={err('perQuery')}
            onChange={set('perQuery')}
          />
          <NumberField
            label="Token multiplier"
            description="Tokens per query relative to the cost before the multiplier."
            field={f.multiplier}
            error={err('multiplier')}
            onChange={set('multiplier')}
          />
        </ColumnLayout>
      )}
      {side === 'b' && (
        <Box variant="small" color="text-body-secondary">
          Cost per query:{' '}
          {parsed.ok
            ? `${formatUsd(parsed.numbers.referencePerQuery)} x ${points(parsed.numbers.multiplier)} = ${formatUsd(parsed.numbers.option.perQueryCost)}`
            : 'waiting for valid numbers'}
        </Box>
      )}
      <NumberField
        label="Quality you measured (optional)"
        description="Same grader and scale in both columns."
        field={f.quality}
        error={err('quality')}
        onChange={set('quality')}
      />
      <FormField label="Pre-fill from a published run">
        <Select
          selectedOption={selected}
          options={options}
          onChange={({ detail }) => onPreset(detail.selectedOption.value ?? state.presetId)}
        />
      </FormField>
      <Box variant="small" color="text-body-secondary">
        {preset.scope}
        {preset.sources.map((id) => (
          <Fragment key={id}>
            {' '}
            <SourceCite id={id} />
          </Fragment>
        ))}
      </Box>
    </SpaceBetween>
  );
}

function ResultLines({ result, crossModel }: { result: FormResult; crossModel: boolean }) {
  if (result.kind === 'incomplete') {
    return <Box>Enter a number in each highlighted field to see the totals and the breakeven.</Box>;
  }
  if (result.kind === 'parallel') {
    return (
      <SpaceBetween size="xxs">
        <Box>
          At {formatCount(result.volume)} queries, {NAME.a} costs {formatUsd(result.totalA)} in total and {NAME.b}{' '}
          {formatUsd(result.totalB)}.
        </Box>
        <Box>
          The two options cost the same per query, so their lines never cross: the one with the lower training cost
          is cheaper at every volume.
        </Box>
      </SpaceBetween>
    );
  }
  const c = result.comparison;
  const be = c.breakeven;
  const diff = Math.abs(c.totalA - c.totalB);
  const q = result.quality;
  return (
    <SpaceBetween size="xxs">
      <Box>
        At {formatCount(c.volume)} queries, {NAME.a} costs {formatUsd(c.totalA)} in total and {NAME.b}{' '}
        {formatUsd(c.totalB)}.
      </Box>
      {be.kind === 'crossover' ? (
        <Box>
          <Box variant="strong" display="inline">
            Breakeven: {formatCount(be.volume)} queries.
          </Box>{' '}
          Below it {NAME[be.cheaperBelow]} costs less; above it {NAME[be.cheaperAbove]} does.
        </Box>
      ) : (
        <Box>
          <Box variant="strong" display="inline">
            No breakeven:
          </Box>{' '}
          {NAME[be.winner]} costs no more to train and less per query, so it is cheaper at every volume.
        </Box>
      )}
      {c.position === 'below' || c.position === 'above' ? (
        <Box>
          You are {c.position} the breakeven: {NAME[c.cheaper === 'tie' ? 'a' : c.cheaper]} saves {formatUsd(diff)} at
          your volume.
        </Box>
      ) : c.position === 'at' ? (
        <Box>You are at the breakeven: both options cost the same.</Box>
      ) : null}
      <Box>
        {q === 'missing'
          ? 'Enter a quality for both columns to price the gap.'
          : q.kind === 'cheaper-scores-at-least-as-well'
            ? q.qualityGap === 0
              ? 'Both score the same.'
              : `${capital(NAME[q.cheaper])} also scores ${points(q.qualityGap)} points higher.`
            : q.kind === 'equal-cost'
              ? q.better === 'tie'
                ? 'They also score the same.'
                : `${capital(NAME[q.better])} scores higher at the same cost.`
              : `${capital(NAME[q.better])} scores ${points(q.qualityGap)} points higher: at your volume it costs ${formatUsd(q.extraCost)} more, ${formatUsd(q.costPerPoint)} per point.`}
      </Box>
      {crossModel && (
        <Box color="text-status-warning">
          Some values come from the Training-Free GRPO pair, a cross-model comparison: a text loop on the 671B
          DeepSeek-V3.1-Terminus against an RL model on Qwen2.5-32B, at different accuracy.
        </Box>
      )}
    </SpaceBetween>
  );
}

/* ------------------------------------------------------------------------ */
/* Diagram: the two cost lines, driven by the calculator's inputs           */
/* ------------------------------------------------------------------------ */

function BreakevenChart({ a, b, comparison }: { a: CostOption; b: CostOption; comparison: Comparison }) {
  const W = 760;
  const H = 380;
  const L = 96;
  const R = 730;
  const T = 76;
  const B = 300;
  const blue = '#0972d3';
  const orange = '#ec7211';
  const ink = '#16191f';
  const grey = '#5f6b7a';
  const slate = '#414d5c';
  const be = comparison.breakeven;
  const xAxis = niceAxis(Math.max(comparison.volume, be.kind === 'crossover' ? be.volume : 0, 8) * 1.25);
  const yAxis = niceAxis(Math.max(totalCost(a, xAxis.max), totalCost(b, xAxis.max)));
  const x = (v: number) => L + (v / xAxis.max) * (R - L);
  const y = (c: number) => B - (c / yAxis.max) * (B - T);
  // Keep a label of `chars` characters (about 7 units each at 12px bold) inside the viewBox.
  const clampX = (cx: number, chars: number) => {
    const half = (chars * 7) / 2;
    return Math.min(Math.max(cx, half + 12), W - half - 12);
  };
  const vx = x(comparison.volume);
  const yourLabel = `Your volume: ${formatCount(comparison.volume)} queries`;
  const beLabel = be.kind === 'crossover' ? `Breakeven: ${formatCount(be.volume)} queries` : '';
  const cheaperNow =
    comparison.cheaper === 'tie' ? 'both options cost the same' : `${NAME[comparison.cheaper]} costs less`;
  const titleText =
    `Total cost against queries served. The weight update starts at ${formatUsd(a.trainingCost)} and adds ` +
    `${formatUsd(a.perQueryCost)} per query; the per-query option starts at ${formatUsd(b.trainingCost)} and adds ` +
    `${formatUsd(b.perQueryCost)} per query. ` +
    (be.kind === 'crossover'
      ? `The lines cross at ${formatCount(be.volume)} queries. `
      : `The lines do not cross: ${NAME[be.winner]} is cheaper at every volume. `) +
    `At your volume of ${formatCount(comparison.volume)} queries, ${cheaperNow}.`;
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-labelledby="cost-breakeven-title"
        style={{ width: '100%', minWidth: 600, height: 'auto' }}
      >
        <title id="cost-breakeven-title">{titleText}</title>
        <rect x={0} y={0} width={W} height={H} rx={8} fill="#ffffff" />

        {/* Legend */}
        <text x={20} y={30} fontFamily="sans-serif" fontSize={12} fontWeight={600} fill={ink}>
          Total cost:
        </text>
        <line x1={108} y1={26} x2={134} y2={26} stroke={blue} strokeWidth={3} />
        <text x={142} y={30} fontFamily="sans-serif" fontSize={12} fill={ink}>
          Pay once: weight update
        </text>
        <line x1={318} y1={26} x2={344} y2={26} stroke={orange} strokeWidth={3} />
        <text x={352} y={30} fontFamily="sans-serif" fontSize={12} fill={ink}>
          Pay per query: text loop or sampler
        </text>

        {/* Grid and y axis */}
        {yAxis.ticks.map((t) => (
          <g key={`y${t}`}>
            <line x1={L} y1={y(t)} x2={R} y2={y(t)} stroke="#e9ebed" strokeWidth={1} />
            <text x={L - 8} y={y(t) + 4} fontFamily="sans-serif" fontSize={11} fill={grey} textAnchor="end">
              ${formatCompact(t)}
            </text>
          </g>
        ))}
        <line x1={L} y1={T} x2={L} y2={B} stroke="#879596" strokeWidth={1} />
        <line x1={L} y1={B} x2={R} y2={B} stroke="#879596" strokeWidth={1} />

        {/* x axis */}
        {xAxis.ticks.map((t) => (
          <text key={`x${t}`} x={x(t)} y={B + 18} fontFamily="sans-serif" fontSize={11} fill={grey} textAnchor="middle">
            {formatCompact(t)}
          </text>
        ))}
        <text x={(L + R) / 2} y={B + 66} fontFamily="sans-serif" fontSize={11} fill={grey} textAnchor="middle">
          Queries served over the artifact&apos;s life
        </text>

        {/* Cost lines */}
        <line x1={x(0)} y1={y(a.trainingCost)} x2={x(xAxis.max)} y2={y(totalCost(a, xAxis.max))} stroke={blue} strokeWidth={3} />
        <line x1={x(0)} y1={y(b.trainingCost)} x2={x(xAxis.max)} y2={y(totalCost(b, xAxis.max))} stroke={orange} strokeWidth={3} />

        {/* Breakeven */}
        {be.kind === 'crossover' && (
          <g>
            <line x1={x(be.volume)} y1={y(totalCost(a, be.volume))} x2={x(be.volume)} y2={T - 6} stroke={ink} strokeWidth={1} strokeDasharray="2 3" />
            <circle cx={x(be.volume)} cy={y(totalCost(a, be.volume))} r={6} fill="#ffffff" stroke={ink} strokeWidth={2} />
            <text
              x={clampX(x(be.volume), beLabel.length)}
              y={T - 12}
              fontFamily="sans-serif"
              fontSize={12}
              fontWeight={600}
              fill={ink}
              textAnchor="middle"
            >
              {beLabel}
            </text>
          </g>
        )}

        {/* Your volume */}
        <line x1={vx} y1={B} x2={vx} y2={T} stroke={slate} strokeWidth={1.5} strokeDasharray="6 4" />
        <circle cx={vx} cy={y(comparison.totalA)} r={4.5} fill={blue} />
        <circle cx={vx} cy={y(comparison.totalB)} r={4.5} fill={orange} />
        <text
          x={clampX(vx, yourLabel.length)}
          y={B + 42}
          fontFamily="sans-serif"
          fontSize={12}
          fontWeight={600}
          fill={slate}
          textAnchor="middle"
        >
          {yourLabel}
        </text>
      </svg>
    </div>
  );
}

function BreakevenCalculator() {
  const [{ a, b }, setSides] = useState(initialState);
  const [volume, setVolume] = useState<FieldState>(
    noted('100000', 'A starting value from no source: replace it with your estimate.'),
  );

  const updateField = (side: OptionKey, key: FieldKey, text: string) =>
    setSides((s) => {
      const cur = s[side];
      return { ...s, [side]: { ...cur, fields: { ...cur.fields, [key]: { text, from: YOURS } } } };
    });
  const updateUnit = (side: OptionKey, unit: Unit) =>
    setSides((s) => ({ ...s, [side]: { ...s[side], unit } }));
  const choosePreset = (side: OptionKey, presetId: string) =>
    setSides((s) => {
      const other = side === 'a' ? s.b : s.a;
      return { ...s, [side]: applyPreset(s[side], presetById(presetId), other) };
    });

  const result = evaluateForm(a, b, volume.text);
  const volumeParsed = parseField(volume.text, 'non-negative');
  const crossModel = usesSource(a, CROSS_MODEL_SOURCES) || usesSource(b, CROSS_MODEL_SOURCES);

  return (
    <SpaceBetween size="l">
      <NumberField
        label="Queries over the artifact's life"
        description="How many queries you expect it to serve before it is retrained or retired."
        field={volume}
        error={volumeParsed.ok ? undefined : volumeParsed.message}
        onChange={(text) => setVolume({ text, from: YOURS })}
      />
      <ColumnLayout columns={2} borders="vertical">
        <SideForm
          side="a"
          state={a}
          onField={(k, t) => updateField('a', k, t)}
          onUnit={(u) => updateUnit('a', u)}
          onPreset={(p) => choosePreset('a', p)}
        />
        <SideForm
          side="b"
          state={b}
          onField={(k, t) => updateField('b', k, t)}
          onUnit={(u) => updateUnit('b', u)}
          onPreset={(p) => choosePreset('b', p)}
        />
      </ColumnLayout>
      <div aria-live="polite">
        <ResultLines result={result} crossModel={crossModel} />
      </div>
      {result.kind === 'ok' ? (
        <SpaceBetween size="xs">
          <BreakevenChart a={result.a} b={result.b} comparison={result.comparison} />
          <Box variant="small" color="text-body-secondary">
            Drawn from the inputs above. Each line is training cost plus cost per query times queries; the circle
            marks where they cross.
          </Box>
        </SpaceBetween>
      ) : (
        <Box variant="small" color="text-body-secondary">
          The chart appears when every cost field holds a valid number and the two options differ in cost per query.
        </Box>
      )}
    </SpaceBetween>
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function CostPerImprovement() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Pay once in training or on every query: find the query volume where the two cost the same, and which side of it you are on (sources read 2026-10-30)"
          >
            20. Cost per Improvement
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            An improvement can be bought in two places. A weight update, such as an RL (reinforcement learning) run,
            pays a training bill once and then serves at the cost of the model it trained. A text loop that learns a
            prompt, a playbook or a memory, or a sampler that spends extra tokens on a frozen model, pays little or
            nothing up front and more on every query. Which one costs less depends on how many queries the
            improvement serves before it is retrained or retired.
          </Box>
          <Box variant="p">
            The paper behind Training-Free GRPO, a text loop named after the RL method GRPO (Group Relative Policy
            Optimization), prices both sides of one such choice. At its prices the text loop stays cheaper until
            about 665,000 served problems, our arithmetic from the paper&apos;s figures{' '}
            <TfGrpo>Training-Free GRPO, Section 4.2</TfGrpo>. It is a cross-model comparison: the text loop ran on
            the 671B DeepSeek-V3.1-Terminus and the RL model is Qwen2.5-32B, at different accuracy. The calculator at
            the end of this section redoes it with your rates, your volume and the quality gap you measure.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Know the four numbers the decision turns on, and which of them only you can supply"
          >
            Two cost lines and where they cross
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Each option&apos;s total cost grows in a straight line with the queries it serves:{' '}
            <code>total = training cost + cost per query x queries</code>. The option that is cheaper to train starts
            lower; the one that is cheaper per query climbs more slowly. When one option is cheaper on both counts it
            wins at every volume. Otherwise the lines cross once, at the breakeven volume:{' '}
            <code>breakeven = (training cost A - training cost B) / (cost per query B - cost per query A)</code>. Below
            it the cheaper-to-train option costs less in total; above it the cheaper-to-serve one does.
          </Box>
          <Box variant="p">
            Cost settles half the decision. The two options rarely reach the same quality, so the calculator also
            takes a quality score for each, measured on one grader and one scale. When the option that is cheaper at
            your volume scores lower, it reports what each point of quality costs: the difference in total cost
            divided by the difference in score.
          </Box>
          <Box variant="p">
            Three of the four inputs are yours alone. Published runs give quantities, GPU-hours, rollouts or tokens,
            measured on someone else&apos;s hardware at someone else&apos;s prices; your rates turn them into
            dollars. No paper knows your query volume over the artifact&apos;s life or the quality gap on your own
            grader.
          </Box>
          <Box variant="p">
            One rate needs care. For a model you host, the cost per query is what the servers cost per hour divided
            by the queries they actually serve in that hour, idle hours included. The Training-Free GRPO authors make
            the point about their own RL figure: its cost per problem &quot;presupposes continuous GPU availability,
            which becomes inefficient under fluctuating or low request volumes&quot;{' '}
            <TfGrpo>Training-Free GRPO, Section 4.2</TfGrpo>. A cost per query measured at full load is a floor.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Size a weight update in published GPU-hours or rollouts, then price it at your own rate"
          >
            What a training run costs
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The published runs collected here range from a few hundred GPU-hours to well over a hundred thousand, and
            model size alone does not set the bill. A minimal recipe of Dr. GRPO (GRPO Done Right) on
            Qwen2.5-Math-7B took 27 hours on 8 A100s <SourceCite id="drgrpo" />, 216 GPU-hours by our arithmetic. ProRL (prolonged RL) trained a 1.5B
            model for more than 2,000 steps in about 16k H100 GPU-hours <SourceCite id="prorl" />, 74 times the 7B
            recipe&apos;s GPU-hours, on a newer GPU (our arithmetic). DeepSeek-R1&apos;s post-training took 147K H800
            GPU-hours, which its authors price at $294K under an assumed $2 per GPU-hour; R1-Zero&apos;s pure RL run
            is 101K of those hours, on 512 GPUs <SourceCite id="r1-cost" />.
          </Box>
          <Box variant="p">
            Two 32B runs sit between them. Agentica and Together AI report that DeepSWE&apos;s RL run on Qwen3-32B
            took 64 H100s for six days <SourceCite id="deepswe" />. verl&apos;s public reproduction of DAPO (Decoupled
            Clip and Dynamic sAmpling Policy Optimization) on Qwen2.5-32B logged 159.6 hours of step time over 489
            steps on 16 nodes of 8 GPUs <SourceCite id="dapo-run" />, about 20,400 GPU-hours by our arithmetic; that
            record is the verl team&apos;s run, not the DAPO authors&apos;.
          </Box>
          <Box variant="p">
            The calculator&apos;s one same-model pair of training budgets is GEPA (Genetic-Pareto), the reflective
            prompt optimiser of section 14, Optimising the Prompt, against GRPO with LoRA (Low-Rank Adaptation) on
            Qwen3 8B. GRPO is the RL method that samples a group of answers per prompt and reinforces those that beat
            the group&apos;s average. GEPA spent 1,839 to 7,051 rollouts per task, a rollout being one run on one
            example, against 24,000 for GRPO, and led across six tasks in aggregate, 54.85 to 48.91, while trailing on
            AIME-2025, a US competition-math exam <SourceCite id="gepa-table1" />. Price each side&apos;s rollouts
            separately: a GRPO rollout also pays for its share of the weight update.
          </Box>
          <Box variant="p">
            Managed RL is billed by the hour. Bedrock RFT (reinforcement fine-tuning) charges $80.00 per training hour
            for each of its three base models: gpt-oss-20b and Qwen3 32B on the pricing page, Nova 2 Lite in the AWS
            Price List <SourceCite id="bedrock-pricing" /> <SourceCite id="bedrock-price-list" />. The hours are the
            unknown. A Nova job &quot;can take a few hours depending on the size of your training data, number of
            epochs, and complexity of your reward functions&quot;{' '}
            <Cite tier={1} href={RFT_JOB}>
              Bedrock user guide, RFT jobs for Nova models
            </Cite>
            . No typical job length for any model was located in this research, and early stopping, on by default,
            ends training &quot;when performance improvements plateau&quot;{' '}
            <Cite tier={2} href={RFT_BEST_PRACTICES}>
              AWS Machine Learning Blog, RFT on Bedrock best practices
            </Cite>
            , so the length depends on your data. The calculator takes your hours as an input.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Estimate what learning in words adds to every query, and how much prompt caching takes back"
          >
            What each query costs
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            On the same model, a text loop&apos;s serving penalty is the tokens it adds to every query. In one study a
            memory loop raised tokens per query about three to five times: Dynamic Cheatsheet with Claude 3.5 Sonnet
            on AIME 2024 averaged 370 tokens at baseline against 1,035 and 1,831 under
            its two memory variants <SourceCite id="cheatsheet" />, 2.8 and 4.9 times by our arithmetic. That is one
            model on one benchmark, and the footnote reporting it does not say whether the cheatsheet in the prompt is
            counted.
          </Box>
          <Box variant="p">
            Prompt caching takes back much of the input side, because a learned playbook is a prefix repeated on
            every query. With the OpenAI API and GPT-5.1, 91.8% of ACE&apos;s (Agentic Context Engineering) input
            tokens came from cache at the evaluation stage, cutting billed input cost by 82.6% against counting raw
            context tokens{' '}
            <Cite tier={3} href={ACE} venue="ICLR 2026">
              ACE, Section 4.7
            </Cite>
            ; the paper reports that stage apart from the adaptation stage that builds the playbook{' '}
            <Cite tier={3} href={ACE} venue="ICLR 2026">
              ACE, Appendix A.3
            </Cite>
            . For a model you host the same saving comes from prefix caching (
            <Link href="../vllm/">vLLM dive, section 6: Automatic Prefix Caching</Link>). Enter your cost per query
            with caching on, at the hit rate your own prefix reaches.
          </Box>
          <Box variant="p">
            The third option trains nothing. Section 8, What RL Does to a Model, covers a training-free sampler that
            sharpens a frozen model&apos;s answers at about 8.84 times the tokens of standard inference, in the
            paper&apos;s MATH-500 (500 competition mathematics problems) setting <SourceCite id="sampling" />. The
            multiplier moves with output length and the sampler&apos;s settings, so the calculator takes it as an
            editable input on the per-query side.
          </Box>
          <Box variant="p">
            Our reading of these figures: a text loop is cheap to train, and it pays at serving mostly when it rides
            on a larger model than the RL alternative. On the same model the serving penalty is the extra context and
            answer tokens, which prompt caching narrows, and the expected query volume over the artifact&apos;s life
            decides which side wins.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Reuse the published breakeven only once you know what it compares and what it leaves out"
          >
            One priced pair, across two models
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The Training-Free GRPO paper prices both sides. Learning cost about $18 of API tokens and lifted the
            frozen 671B DeepSeek-V3.1-Terminus to 82.7 on AIME 2024{' '}
            <TfGrpo>Training-Free GRPO, Table 3 and Section 4.2</TfGrpo>. Replicating ReTool&apos;s RL training on
            Qwen2.5-32B-Instruct, which reached 67.0, took about 20,000 GPU-hours, about $10,000 at the authors&apos;
            assumed $0.5 per GPU-hour. At serving, the RL model on four GPUs at the same rate handles about 400
            problems an hour, $0.005 per problem; the text loop&apos;s requests average 60K input and 8K output
            tokens, about $0.02 per problem with cache-hit pricing <TfGrpo>Training-Free GRPO, Section 4.2</TfGrpo>.
          </Box>
          <Box variant="p">
            At those prices the text loop stays cheaper until about 665,000 served problems (our arithmetic). Read it
            as a comparison of two artifacts on different base models at different accuracy: the authors attribute the
            serving gap to model size, a large API model against a dedicated small one{' '}
            <TfGrpo>Training-Free GRPO, Section 4.2</TfGrpo>. It also leaves out the RL model&apos;s idle GPU time. At
            the paper&apos;s 400 problems an hour, 665,467 problems keep the 4-GPU server busy for 1,664 hours, about
            69 days of continuous load (our arithmetic); at any lower utilisation the RL side&apos;s real cost per
            problem rises above $0.005 and the breakeven moves out. Section 13, Memories, Playbooks &amp; Skill
            Libraries, compares the two methods on 32B-class models.
          </Box>
          <ExpandableSection headerText="The arithmetic behind 665,467 problems">
            <SpaceBetween size="xs">
              <Box variant="p">
                <code>RL training = 20,000 GPU-hours x $0.5 = $10,000</code>
              </Box>
              <Box variant="p">
                <code>RL cost per problem = 4 GPUs x $0.5 per hour / 400 problems per hour = $0.005</code>
              </Box>
              <Box variant="p">
                <code>breakeven = ($10,000 - $18) / ($0.02 - $0.005) = $9,982 / $0.015 = 665,467 problems</code>
              </Box>
              <Box variant="p">
                <code>server time = 665,467 / 400 per hour = 1,664 hours, about 69 days</code>
              </Box>
              <Box variant="p">
                The inputs are the paper&apos;s; the breakeven and the server time are ours. The $0.5 per GPU-hour is
                the authors&apos; assumed rental price, and they do not name the GPU type{' '}
                <TfGrpo>Training-Free GRPO, Section 4.2</TfGrpo>.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Enter your volume, your rates and the quality gap you measured, and read which option costs less for the queries you expect"
          >
            Find your side of the breakeven
          </Header>
        }
      >
        <SpaceBetween size="l">
          <Box variant="p">
            Start with the queries you expect the artifact to serve before it is retrained or retired. Each column
            then takes a training quantity with your price per unit, a cost per query and the quality you measured;
            the per-query column adds the token multiplier. Choose &quot;Your own numbers&quot; in a column to clear
            it. A preset fills only the values its source reports, each with its citation under the field, and any
            field you edit becomes yours. The calculator opens on the Training-Free GRPO pair above, a cross-model
            example.
          </Box>
          <BreakevenCalculator />
          <Box variant="p">
            To redo the paper&apos;s comparison on one base model, keep a weight update in the first column and put a
            text loop or the sampler on the same model in the second, with the cost per query you measure on your own
            traffic, caching on. Enter the quality gap from your grader, then read the result: it names the side of
            the breakeven you are on and, where the cheaper option scores lower, what each point of quality costs at
            your volume.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
