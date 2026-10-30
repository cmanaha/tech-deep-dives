import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Table from '@cloudscape-design/components/table';
import Link from '@cloudscape-design/components/link';
import {
  Cite,
  arxiv,
  gh,
  researchUrl,
  E0_URL,
  TRL_TAG,
  TRL_PPO_TAG,
  VERL_TAG,
  OPENRLHF_TAG,
  SLIME_TAG,
  PRIME_RL_TAG,
} from '../components/Cite';

/* ------------------------------------------------------------------------ */
/* Sources                                                                  */
/* ------------------------------------------------------------------------ */

/** Sheng et al., HybridFlow: A Flexible and Efficient RLHF Framework (EuroSys 2025). */
const HYBRIDFLOW = arxiv('2409.19256v2');
/** Fu et al., AReaL: A Large-Scale Asynchronous Reinforcement Learning System (NeurIPS 2025). */
const AREAL = arxiv('2505.24298v5');
/** Skywork-OR1 technical report. */
const SKYWORK = arxiv('2505.22312v2');
/** PipelineRL: in-flight weight updates. */
const PIPELINERL = arxiv('2509.19128v2');
/** DeepSeek-R1 (Nature 2025), arXiv v2 with the supplementary appendices. */
const R1 = arxiv('2501.12948v2');
/** OpenRLHF paper. */
const OPENRLHF_PAPER = arxiv('2405.11143v6');
/** Ahmadian et al., Back to Basics (RLOO), ACL 2024. */
const AHM24 = arxiv('2402.14740v2');
/** Ivison et al., Unpacking DPO and PPO, NeurIPS 2024. */
const IVI24 = arxiv('2406.09279v2');
/** DeepSeekMath (GRPO). */
const DSM = arxiv('2402.03300v3');
/** verl team's public W&B record of its DAPO reproduction on Qwen2.5-32B. */
const VERL_DAPO_RUN = 'https://wandb.ai/verl-org/DAPO%20Reproduction%20on%20verl/runs/0qjd0wap';
/** verl-recipe commit pinned as the recipe submodule of verl v0.9.1. */
const VERL_RECIPE_SHA = 'e7f889574b8301cc0f0fc1d57c6d67f31ffeb689';

const E0_LOG_RUN1 = researchUrl('2026-10/E0-spark-smoke/run1/logs.jsonl');
const E0_LOG_RUN2 = researchUrl('2026-10/E0-spark-smoke/run2/logs.jsonl');
/** Conditions every E0 figure carries. */
const E0_TITLE =
  'E0: Qwen2.5-0.5B-Instruct, completions capped at 256 tokens, TRL 1.16.0 with vLLM 0.28.0 colocated on one GB10, single seed, two runs';

function trlCfg(lines: string): string {
  return gh('huggingface/trl', TRL_TAG, 'trl/trainer/grpo_config.py', lines);
}
function trlTrainer(lines: string): string {
  return gh('huggingface/trl', TRL_TAG, 'trl/trainer/grpo_trainer.py', lines);
}
function trlGen(lines: string): string {
  return gh('huggingface/trl', TRL_TAG, 'trl/generation/vllm_generation.py', lines);
}
function verl(path: string, lines: string): string {
  return gh('volcengine/verl', VERL_TAG, `verl/trainer/config/${path}`, lines);
}
function openrlhf(lines: string): string {
  return gh('OpenRLHF/OpenRLHF', OPENRLHF_TAG, 'openrlhf/cli/train_ppo_ray.py', lines);
}
function slime(path: string, lines: string): string {
  return gh('THUDM/slime', SLIME_TAG, path, lines);
}
function primeRl(path: string, lines: string): string {
  return gh('PrimeIntellect-ai/prime-rl', PRIME_RL_TAG, path, lines);
}

/* ------------------------------------------------------------------------ */
/* Diagram: synchronous and asynchronous steps on one time axis             */
/* ------------------------------------------------------------------------ */

/** x positions where a weight sync lands in the asynchronous generation pool. */
const TL_BOUNDS = [486, 682];
const TL_VERSION_FILL = ['#0972d3', '#6f4cc4', '#2ea597'];
const TL_SYNC_ENDS = [300, 360, 270, 330, 500];
const TL_SYNC_NEXT_ENDS = [810, 880, 760, 850, 880];
const TL_ASYNC_ROWS: Array<Array<[number, number]>> = [
  [[170, 250], [254, 400], [404, 560], [564, 640], [644, 760], [764, 880]],
  [[170, 330], [334, 430], [434, 600], [604, 700], [704, 880]],
  [[170, 220], [224, 360], [364, 520], [524, 620], [624, 790], [794, 880]],
  [[170, 290], [294, 470], [474, 540], [544, 720], [724, 820], [824, 880]],
];

/** Splits one response bar at each weight-sync boundary so each part carries its policy version. */
function versionSegments(x0: number, x1: number): Array<{ a: number; b: number; v: number }> {
  const cuts = [x0, ...TL_BOUNDS.filter((c) => c > x0 && c < x1), x1];
  const out: Array<{ a: number; b: number; v: number }> = [];
  for (let i = 0; i < cuts.length - 1; i += 1) {
    const mid = (cuts[i] + cuts[i + 1]) / 2;
    const v = TL_BOUNDS.filter((c) => c <= mid).length;
    out.push({ a: cuts[i], b: cuts[i + 1], v });
  }
  return out;
}

function StepTimelineDiagram() {
  const syncRowY = [56, 72, 88, 104, 120];
  const asyncRowY = [240, 256, 272, 288];
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 900 450"
        role="img"
        aria-labelledby="rl-systems-timeline-title"
        style={{ width: '100%', minWidth: 680, height: 'auto' }}
      >
        <title id="rl-systems-timeline-title">
          Synchronous and asynchronous RL steps on one time axis, illustrative. In the synchronous
          step one GPU pool generates a batch of responses; the batch thins as short responses
          finish and the step waits for the longest one, then the same GPUs run preparation,
          training and a weight sync before step 2 starts. In the asynchronous design a generation
          pool and a training pool run at the same time with no wait for the longest response:
          each weight sync lands in the generation pool while responses are in progress, so those
          responses continue under the new policy version, and the trainer trains on rollouts
          sampled one policy version earlier, a staleness of one.
        </title>
        <style>{`
          .rl-systems-tl-head { fill: #16191f; font: 600 13px sans-serif; }
          .rl-systems-tl-lab { fill: #414d5c; font: 11px sans-serif; text-anchor: end; }
          .rl-systems-tl-note { fill: #414d5c; font: 11px sans-serif; }
          .rl-systems-tl-mid { fill: #16191f; font: 11px sans-serif; text-anchor: middle; }
          .rl-systems-tl-step { fill: #414d5c; font: 600 11px sans-serif; text-anchor: middle; }
          .rl-systems-tl-stale { fill: #8b6c00; font: 600 11px sans-serif; text-anchor: middle; }
          .rl-systems-tl-train-t { fill: #16191f; font: 600 13px sans-serif; text-anchor: middle; }
          .rl-systems-tl-gen { fill: #0972d3; }
          .rl-systems-tl-thin { fill: #f2f3f3; stroke: #879596; stroke-width: 1; stroke-dasharray: 3 3; }
          .rl-systems-tl-prep { fill: #ecf7ec; stroke: #037f0c; stroke-width: 1.5; }
          .rl-systems-tl-train { fill: #f4f4f4; stroke: #414d5c; stroke-width: 1.5; }
          .rl-systems-tl-wait { fill: #ffffff; stroke: #879596; stroke-width: 1; stroke-dasharray: 4 3; }
          .rl-systems-tl-sync { fill: #ec7211; }
          .rl-systems-tl-land { stroke: #ec7211; stroke-width: 1.5; stroke-dasharray: 4 3; fill: none; }
          .rl-systems-tl-line { stroke: #879596; stroke-width: 1; fill: none; }
          .rl-systems-tl-div { stroke: #d1d5db; stroke-width: 1; stroke-dasharray: 5 4; }
          .rl-systems-tl-axis { stroke: #5f6b7a; stroke-width: 1.5; fill: none; marker-end: url(#rl-systems-tl-arrow); }
        `}</style>
        <defs>
          <marker
            id="rl-systems-tl-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="8"
            markerHeight="8"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="#5f6b7a" />
          </marker>
        </defs>
        <rect x="0" y="0" width="900" height="450" rx="8" fill="#ffffff" />

        {/* Panel A: synchronous */}
        <text className="rl-systems-tl-head" x="20" y="26">
          Synchronous: one GPU pool generates, then trains
        </text>
        <path className="rl-systems-tl-line" d="M170,50 V44 H676 V50" />
        <text className="rl-systems-tl-step" x="423" y="39">
          step 1
        </text>
        <path className="rl-systems-tl-line" d="M680,50 V44 H880" />
        <text className="rl-systems-tl-step" x="780" y="39">
          step 2
        </text>
        <text className="rl-systems-tl-lab" x="158" y="88">
          responses
        </text>
        <text className="rl-systems-tl-lab" x="158" y="102">
          in the batch
        </text>
        {TL_SYNC_ENDS.map((end, i) => (
          <g key={`s1-${syncRowY[i]}`}>
            <rect className="rl-systems-tl-gen" x="170" y={syncRowY[i]} width={end - 170} height="12" rx="2" />
            {end < 496 && (
              <rect className="rl-systems-tl-thin" x={end + 2} y={syncRowY[i]} width={496 - end} height="12" rx="2" />
            )}
          </g>
        ))}
        <rect className="rl-systems-tl-prep" x="500" y="56" width="40" height="76" rx="3" />
        <text className="rl-systems-tl-mid" x="520" y="98">
          prep
        </text>
        <rect className="rl-systems-tl-train" x="542" y="56" width="118" height="76" rx="3" />
        <text className="rl-systems-tl-train-t" x="601" y="99">
          train
        </text>
        <rect className="rl-systems-tl-sync" x="662" y="56" width="14" height="76" rx="2" />
        {TL_SYNC_NEXT_ENDS.map((end, i) => (
          <rect
            key={`s2-${syncRowY[i]}`}
            className="rl-systems-tl-gen"
            x="680"
            y={syncRowY[i]}
            width={end - 680}
            height="12"
            rx="2"
          />
        ))}
        <text className="rl-systems-tl-note" x="172" y="154">
          the batch thins as responses finish; the step waits for the longest
        </text>
        <path className="rl-systems-tl-line" d="M669,134 V142" />
        <text className="rl-systems-tl-mid" x="669" y="154">
          weight sync
        </text>

        <line className="rl-systems-tl-div" x1="20" y1="172" x2="880" y2="172" />

        {/* Panel B: asynchronous */}
        <text className="rl-systems-tl-head" x="20" y="198">
          Asynchronous: separate pools run at once
        </text>
        <text className="rl-systems-tl-note" x="500" y="198">
          tokens sampled by
        </text>
        {['v1', 'v2', 'v3'].map((label, i) => (
          <g key={label}>
            <rect x={612 + i * 48} y="188" width="12" height="12" rx="2" fill={TL_VERSION_FILL[i]} />
            <text className="rl-systems-tl-note" x={628 + i * 48} y="198">
              {label}
            </text>
          </g>
        ))}
        <text className="rl-systems-tl-note" x="494" y="227">
          in-flight update: responses in progress continue under v2
        </text>
        <text className="rl-systems-tl-lab" x="158" y="262">
          generation
        </text>
        <text className="rl-systems-tl-lab" x="158" y="276">
          pool
        </text>
        {TL_ASYNC_ROWS.map((row, r) =>
          row.map(([x0, x1]) =>
            versionSegments(x0, x1).map((s) => (
              <rect
                key={`a-${asyncRowY[r]}-${s.a}`}
                x={s.a}
                y={asyncRowY[r]}
                width={s.b - s.a}
                height="12"
                fill={TL_VERSION_FILL[s.v]}
              />
            )),
          ),
        )}
        {TL_BOUNDS.map((x) => (
          <path key={`land-${x}`} className="rl-systems-tl-land" d={`M${x},236 V332`} />
        ))}
        <text className="rl-systems-tl-lab" x="158" y="344">
          training
        </text>
        <text className="rl-systems-tl-lab" x="158" y="358">
          pool
        </text>
        <rect className="rl-systems-tl-wait" x="170" y="332" width="116" height="32" rx="3" />
        <text className="rl-systems-tl-mid" x="228" y="352">
          first batch fills
        </text>
        {[
          { x: 290, label: 'train on v1 rollouts', stale: 'staleness 0' },
          { x: 486, label: 'train on v1 rollouts', stale: 'staleness 1' },
          { x: 682, label: 'train on v2 rollouts', stale: 'staleness 1' },
        ].map((t) => (
          <g key={`t-${t.x}`}>
            <rect className="rl-systems-tl-train" x={t.x} y="332" width="180" height="32" rx="3" />
            <text className="rl-systems-tl-mid" x={t.x + 90} y="352">
              {t.label}
            </text>
            <rect className="rl-systems-tl-sync" x={t.x + 180} y="332" width="16" height="32" rx="2" />
            <text className="rl-systems-tl-stale" x={t.x + 90} y="384">
              {t.stale}
            </text>
          </g>
        ))}
        <path className="rl-systems-tl-line" d="M478,366 V388" />
        <text className="rl-systems-tl-mid" x="478" y="400">
          weight sync
        </text>

        <path className="rl-systems-tl-axis" d="M170,420 H884" />
        <text className="rl-systems-tl-note" x="884" y="440" textAnchor="end">
          time
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Skywork's rollout-time scaling table                                     */
/* ------------------------------------------------------------------------ */

interface ScaleRow {
  id: string;
  gpus: string;
  time: string;
  change: string;
}

const SCALE_ROWS: ScaleRow[] = [
  { id: '32', gpus: '32', time: '375 s', change: 'baseline' },
  { id: '64', gpus: '64', time: '270 s', change: '-105 s' },
  { id: '128', gpus: '128', time: '225 s', change: '-45 s' },
  { id: '256', gpus: '256', time: '205 s', change: '-20 s' },
];

function ScaleTable() {
  return (
    <Table<ScaleRow>
      variant="embedded"
      wrapLines
      trackBy="id"
      items={SCALE_ROWS}
      columnDefinitions={[
        { id: 'gpus', header: 'H800 GPUs', cell: (r) => r.gpus },
        { id: 'time', header: 'Rollout time for 1,024 responses', cell: (r) => r.time },
        { id: 'change', header: 'Change from the row above', cell: (r) => r.change },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function RlStepAsSystem() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Size and monitor a self-run RL job: generation takes most of each step, the longest response sets its length, and eight times the GPUs bought only a 45% cut in rollout time (papers, our DGX Spark run, and TRL v1.16.0, verl v0.9.1, OpenRLHF v0.11.2, slime v0.4.0 and prime-rl v0.10.0, read 2026-10-30)"
          >
            19. An RL Step Is an Inference Job Inside a Training Job
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            An RL (reinforcement learning) step runs two workloads on one set of weights. A batch
            inference job writes the attempts, a training job learns from their scores, and the new
            weights go back to the inference engine before the next batch of attempts starts. For a
            reader who runs inference engines most of the step is familiar work; what is new is the
            barrier at the end of generation and the copy at the end of training.
          </Box>
          <Box variant="p">
            Sizing a self-run job is the challenge of keeping both halves busy, and of knowing which
            one holds the clock on your run.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Read any RL framework's step as four jobs you already know how to size"
          >
            One step, four stages
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            One step of PPO (Proximal Policy Optimization, the classic RL algorithm for language
            models) decomposes into three stages{' '}
            <Cite tier={3} href={HYBRIDFLOW} venue="EuroSys 2025">
              HybridFlow, Section 2.1
            </Cite>
            , and a fourth appears whenever generation and training hold separate copies of the
            weights{' '}
            <Cite tier={3} href={HYBRIDFLOW} venue="EuroSys 2025">
              HybridFlow, Section 2.2
            </Cite>
            :
          </Box>
          <ul>
            <li>
              <strong>Generation.</strong> The actor, the policy being trained (named for its role
              next to the critic), decodes responses to a batch of prompts. Autoregressive decoding
              is memory-bound{' '}
              <Cite tier={3} href={HYBRIDFLOW} venue="EuroSys 2025">
                HybridFlow, Section 2.2
              </Cite>
              , and its batching mechanics are those of any serving engine:{' '}
              <Link href="../vllm/">vLLM dive, section 4: Scheduler &amp; Continuous Batching</Link>.
            </li>
            <li>
              <strong>Preparation.</strong> Each scoring model makes one forward pass over the
              prompts and responses: the reference model, a frozen copy of the starting policy,
              computes reference log-probabilities; the critic, a model that estimates how much
              reward to expect, computes values; a reward model computes rewards{' '}
              <Cite tier={3} href={HYBRIDFLOW} venue="EuroSys 2025">
                HybridFlow, Section 2.1
              </Cite>
              .
            </li>
            <li>
              <strong>Training.</strong> The actor and the critic are updated with Adam. Training is
              compute-bound, so the parallelism layout that suits it underuses the GPUs during
              generation{' '}
              <Cite tier={3} href={HYBRIDFLOW} venue="EuroSys 2025">
                HybridFlow, Sections 2.1 and 2.2
              </Cite>
              .
            </li>
            <li>
              <strong>Weight sync.</strong> The updated actor weights move from training to
              generation before the next batch is sampled{' '}
              <Cite tier={3} href={HYBRIDFLOW} venue="EuroSys 2025">
                HybridFlow, Section 2.2
              </Cite>
              . In TRL (Transformers Reinforcement Learning, Hugging Face&apos;s post-training
              library) with a colocated vLLM, that is a loop loading every parameter into the engine,
              followed by a reset of its prefix cache, since cached keys and values were computed
              under the old weights{' '}
              <Cite tier={1} href={trlGen('L481-L517')} kind="code">
                TRL vllm_generation.py L481-L517
              </Cite>
              ; for the cache itself see the{' '}
              <Link href="../vllm/">vLLM dive, section 6: Automatic Prefix Caching</Link>.
            </li>
          </ul>
          <Box variant="p">
            With a critic, a reference and a reward model next to the actor, PPO holds up to four
            models at once{' '}
            <Cite tier={3} href={AHM24} venue="ACL 2024">
              Back to Basics, Section 1
            </Cite>{' '}
            <Cite tier={1} href={gh('huggingface/trl', TRL_PPO_TAG, 'trl/experimental/ppo/ppo_trainer.py', 'L489')}>
              TRL v1.12.0 ppo_trainer.py L489
            </Cite>
            . GRPO (Group Relative Policy Optimization) drops the critic by scoring each response
            against the average reward of a group of responses to the same prompt{' '}
            <Cite tier={3} href={DSM} venue="preprint">
              DeepSeekMath, Section 4.1.1
            </Cite>
            , and TRL&apos;s GRPO trainer defaults beta, the weight of the KL (Kullback-Leibler
            divergence) penalty to the reference model, to 0.0, which skips loading the reference
            model as well{' '}
            <Cite tier={1} href={trlCfg('L681-L688')}>
              TRL grpo_config.py L681-L688
            </Cite>{' '}
            <Cite tier={1} href={trlTrainer('L982-L990')}>
              TRL grpo_trainer.py L982-L990
            </Cite>
            . That leaves one trained model plus the inference engine&apos;s copy of it.
          </Box>
          <Box variant="p">
            That configuration is what our own run on a DGX Spark measured: available unified
            memory fell by about 23 to 24 GiB at its lowest point (23.1 and 23.9 GiB in the two
            runs){' '}
            <Cite tier={0} href={E0_URL}>
              {E0_TITLE}
            </Cite>
            . On our reading of vLLM&apos;s startup log, most of that is the pool vLLM reserves up
            front: 14.6 GiB at the 0.12 memory fraction we set, 12.71 GiB of it KV (key-value)
            cache and 0.93 GiB the model weights. No measured memory figure for PPO&apos;s four
            models was located in the sources read.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Expect most of each step in generation, and read every published share with the conditions it was measured under"
          >
            Generation holds most of the clock
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The measured breakdowns agree on the order of the stages. Over the 1,000 training steps
            of Skywork-OR1-32B, rollout took 223 of 309 hours, 72.1%, and the policy update 8.7%{' '}
            <Cite tier={3} href={SKYWORK} venue="preprint">
              Skywork-OR1, Section 5.1, Table 7
            </Cite>
            ; the report does not state the GPU count for this run. In the same report&apos;s
            32-GPU ablation on a 7B model (DeepSeek-R1-Distill-Qwen-7B at 16K context), rollout took
            76% to 78% of the time{' '}
            <Cite tier={3} href={SKYWORK} venue="preprint">
              Skywork-OR1, Table 8 and Section 4.1
            </Cite>
            . verl&apos;s public reproduction of DAPO (Decoupled Clip and Dynamic sAmpling Policy
            Optimization) on Qwen2.5-32B logged 159.6 hours of step time over 489 steps on 16 nodes
            of 8 H800s, 67.4% of it in generation, by our sum of the run&apos;s per-step timers{' '}
            <Cite tier={2} href={VERL_DAPO_RUN}>
              verl team, W&amp;B run record DAPO-Qwen2.5-32B
            </Cite>{' '}
            <Cite tier={1} href={gh('verl-project/verl-recipe', VERL_RECIPE_SHA, 'dapo/README.md', 'L45')}>
              verl-recipe dapo/README.md L45
            </Cite>
            . The run is the verl team&apos;s reproduction; the DAPO authors&apos; own hours were
            not located. One 13B PPO study on TPUv3 states that rollout took more than 95% of training time,
            without a breakdown{' '}
            <Cite tier={3} href={IVI24} venue="NeurIPS 2024">
              Unpacking DPO and PPO, Appendix G
            </Cite>
            .
          </Box>
          <Box variant="p">
            Our own run sits at the short end. On a DGX Spark (hardware in the{' '}
            <Link href="../silicon-memory-inference/">Silicon, Memory &amp; Inference dive</Link>),
            generation was 62.0% and 62.9% of step time and training 29.9% and 29.5%, with a median
            step of 2.09 and 2.11 s for 16 completions{' '}
            <Cite tier={0} href={E0_URL}>
              {E0_TITLE}
            </Cite>
            : the same order of stages, at a scale where training is relatively larger. In the
            sources read, measured generation shares run from 62% (our 0.5B run) to 78%
            (Skywork&apos;s 7B ablation), and no general figure was located.
          </Box>
          <Box variant="p">
            Every later stage runs over the tokens generation wrote. Preparation is one forward pass
            of each scoring model over the prompts and responses{' '}
            <Cite tier={3} href={HYBRIDFLOW} venue="EuroSys 2025">
              HybridFlow, Section 2.1
            </Cite>
            , and training&apos;s forward and backward passes cover the same tokens, so the
            training side of the bill also scales with rollout tokens. Our reading of these
            breakdowns: longer responses raise the cost of every stage and of generation most,
            because decoding runs one forward step per generated token while the other stages take
            a whole response in one pass. Skywork&apos;s ablation at 16K context sits at 76% to
            78%; our 256-token run at 62%.
          </Box>
          <ExpandableSection headerText="What each published share counts">
            <SpaceBetween size="s">
              <Box variant="p">
                HybridFlow&apos;s often-quoted 58.9% counts generation and actor training together,
                as the share of the two actor nodes in its own run{' '}
                <Cite tier={3} href={HYBRIDFLOW} venue="EuroSys 2025">
                  HybridFlow, Section 2.2
                </Cite>
                . The OpenRLHF paper&apos;s statement that inference &quot;often accounts for over
                90%&quot; of RLHF (RL from human feedback) or RLVR (RL with verifiable rewards)
                runtime is a sentence in its introduction with no measurement behind it{' '}
                <Cite tier={3} href={OPENRLHF_PAPER} venue="preprint">
                  OpenRLHF, Section 1
                </Cite>
                .
              </Box>
              <Box variant="p">
                The weight move, 140 GB per iteration for a 70B actor, taking up to 36.4% of an
                iteration when training and generation sit on different devices, is a figure
                HybridFlow quotes from OpenRLHF&apos;s 2023 system (its reference 30){' '}
                <Cite tier={3} href={HYBRIDFLOW} venue="EuroSys 2025">
                  HybridFlow, Section 2.2
                </Cite>
                .
              </Box>
              <Box variant="p">
                Skywork-OR1-32B&apos;s 1,000 steps are those of the released checkpoint{' '}
                <Cite tier={3} href={SKYWORK} venue="preprint">
                  Skywork-OR1, Section 8.1, Table 12
                </Cite>
                ; no GPU count for that run was located in the report, so its figure stays in
                hours. In the verl reproduction, the other 114 hours of the run&apos;s 273.8-hour
                span sit outside the step timers (validation, checkpointing, and any idle or restart
                time, which the record does not separate){' '}
                <Cite tier={2} href={VERL_DAPO_RUN}>
                  verl team, W&amp;B run record DAPO-Qwen2.5-32B
                </Cite>
                . Our run&apos;s shares are of summed step time over 20 steps; the remainder is
                6.8% and 6.5% other preparation and 0.9% and 0.8% weight sync{' '}
                <Cite tier={0} href={E0_URL}>
                  {E0_TITLE}
                </Cite>
                .
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="See why adding rollout GPUs stops paying: eight times the GPUs bought a 45% cut in rollout time"
          >
            The longest response sets the step
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A synchronous step trains only once generation is done, and generation is done when its
            longest response ends: &quot;the generation step must wait until the finish of the
            longest output within a batch&quot;{' '}
            <Cite tier={3} href={AREAL} venue="NeurIPS 2025">
              AReaL, Section 1
            </Cite>
            . Reasoning models write responses of very different lengths, so the batch thins as the
            short ones finish and the GPUs are underused until the stragglers end{' '}
            <Cite tier={3} href={AREAL} venue="NeurIPS 2025">
              AReaL, Section 3.2
            </Cite>{' '}
            <Cite tier={3} href={PIPELINERL} venue="preprint">
              PipelineRL, Section 3
            </Cite>
            .
          </Box>
          <Box variant="p">
            Skywork measured what more GPUs buy against that barrier. In its ablation setup, for the
            same 1,024 responses per step, going from 32 to 256 H800s cut rollout time only from
            375 s to 205 s{' '}
            <Cite tier={3} href={SKYWORK} venue="preprint">
              Skywork-OR1, Section 5.2, Table 9
            </Cite>
            . The table names no model; its 1,024 responses match the 7B baseline of 64 prompts x
            16 samples{' '}
            <Cite tier={3} href={SKYWORK} venue="preprint">
              Skywork-OR1, Table 5
            </Cite>
            . <strong>Eight times the GPUs bought a 45% cut in rollout time</strong> (our
            arithmetic: 256 / 32 = 8, and (375 - 205) / 375 = 0.45).
          </Box>
          <ScaleTable />
          <Box variant="p">
            Two mechanisms produce that curve. Spreading a fixed batch over more GPUs shrinks each
            GPU&apos;s decode batch until decoding is memory-IO bound, where &quot;additional
            devices fail to improve throughput&quot;{' '}
            <Cite tier={3} href={AREAL} venue="NeurIPS 2025">
              AReaL, Section 3.2
            </Cite>
            ; on one H100, a 7B model&apos;s decode throughput rose almost linearly up to a batch of
            128{' '}
            <Cite tier={3} href={PIPELINERL} venue="preprint">
              PipelineRL, Section 3
            </Cite>
            . And rollout time is set by &quot;the time required to generate the longest
            response&quot;, which more GPUs do not shorten{' '}
            <Cite tier={3} href={SKYWORK} venue="preprint">
              Skywork-OR1, Section 5.2
            </Cite>
            . Skywork&apos;s authors name the more effective use of extra GPUs: a larger rollout
            budget, sized so rollout time stays roughly constant{' '}
            <Cite tier={3} href={SKYWORK} venue="preprint">
              Skywork-OR1, Section 5.2
            </Cite>
            .
          </Box>
          <Box variant="p">
            The tail can also be shortened from the inference side. DeepSeek-R1&apos;s RL framework
            uses the model&apos;s MTP (Multi-Token Prediction) module for self-speculative decoding,
            &quot;effectively minimizing the completion time for the longest samples&quot;{' '}
            <Cite tier={3} href={R1} venue="Nature 2025">
              DeepSeek-R1, Appendix B.1
            </Cite>
            . For the rollout engine&apos;s side of an RL step, see the{' '}
            <Link href="../sglang/">SGLang dive, section 13: SGLang as an RL Rollout Engine</Link>.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Decide how stale you will let rollouts get in exchange for never waiting on the tail or the weight broadcast"
          >
            Asynchronous designs pay for the tail in staleness
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            An asynchronous design gives generation and training their own GPUs and runs them at
            the same time. The trainer learns from rollouts the generation pool finished earlier,
            and new weights reach the generation pool while it is still writing. The price is
            staleness: a rollout can be sampled by a policy a few updates older than the one being
            trained.
          </Box>
          <StepTimelineDiagram />
          <Box variant="small" color="text-body-secondary">
            Illustrative, not measured: every duration is schematic. The synchronous panel follows
            TRL&apos;s colocated default; the asynchronous panel follows the pattern of AReaL,
            PipelineRL and prime-rl, where a bound caps the staleness.
          </Box>
          <Box variant="p">
            AReaL bounds staleness with one parameter, eta, the maximum permitted staleness in a
            training batch; at eta = 0 the system &quot;degenerates to synchronous RL&quot;{' '}
            <Cite tier={3} href={AREAL} venue="NeurIPS 2025">
              AReaL, Section 5.1
            </Cite>
            . It corrects for stale data with a decoupled PPO objective, which clips the update
            around a recent policy rather than around the stale policy that sampled the data{' '}
            <Cite tier={3} href={AREAL} venue="NeurIPS 2025">
              AReaL, Section 5.2
            </Cite>
            : decoupled because the policy that sampled the tokens and the policy that anchors the
            clip are two different snapshots. On a 1.5B math model with 16 nodes of 8 H800s and
            250 PPO steps, AReaL finished in 14.8 hours, against 41.0 for its own synchronous mode
            and an author-estimated 33.6 for synchronous verl, with both AReaL modes scoring about
            the same on AIME 2024 (American Invitational Mathematics Examination problems), 42.2
            and 42.0{' '}
            <Cite tier={3} href={AREAL} venue="NeurIPS 2025">
              AReaL, Section 7.1, Table 1
            </Cite>
            .
          </Box>
          <Box variant="p">
            PipelineRL updates weights mid-sequence: the generation engine &quot;only briefly
            pauses to receive the model weights&quot; and then continues the sequences in progress{' '}
            <Cite tier={3} href={PIPELINERL} venue="preprint">
              PipelineRL, Section 1
            </Cite>
            , so one response can carry tokens from two policy versions. prime-rl trains rollouts up
            to eight policy versions old by default and drops older ones, in flight and queued{' '}
            <Cite tier={1} href={primeRl('packages/prime-rl-configs/src/prime_rl/configs/orchestrator.py', 'L542-L543')}>
              prime-rl orchestrator.py L542-L543
            </Cite>
            .
          </Box>
          <Box variant="p">
            Our reading of these designs: everything asynchronous in RL systems exists to hide two
            waits, the straggler tail and the weight broadcast, and staleness is what it costs. The
            size of the prize is the section&apos;s strongest number. When{' '}
            <strong>eight times the GPUs buys only a 45% cut in rollout time</strong>, removing the
            wait is worth more than adding devices.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Know what TRL's default mismatch correction does to your loss, and what it costs per step"
          >
            Even a synchronous run is slightly off-policy
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            vLLM and the trainer compute slightly different probabilities for the same tokens under
            the same weights, so a run that is on-policy on paper trains on data from a slightly
            different policy. TRL recomputes the trainer&apos;s log-probability of every sampled
            token whenever vLLM generates, because &quot;the distribution mismatch between vLLM and
            the training model can be large and harm the training&quot;{' '}
            <Cite tier={1} href={trlTrainer('L2640-L2655')} kind="code">
              TRL grpo_trainer.py L2640-L2655
            </Cite>
            . On our run the per-token difference averaged 0.011, with single tokens up to 0.92 and
            1.14 in the two runs{' '}
            <Cite tier={0} href={E0_URL}>
              {E0_TITLE}
            </Cite>
            .
          </Box>
          <Box variant="p">
            The correction is an importance weight: the ratio of the trainer&apos;s probability for a
            sequence to the probability vLLM sampled it with. TRL corrects by default, weighting each
            sequence by its probability ratio and masking sequences whose ratio exceeds 3{' '}
            <Cite tier={1} href={trlCfg('L925-L962')}>
              TRL grpo_config.py L925-L962
            </Cite>{' '}
            <Cite tier={1} href={trlTrainer('L2660-L2703')}>
              TRL grpo_trainer.py L2660-L2703
            </Cite>{' '}
            <Cite tier={1} href={trlTrainer('L3146-L3147')}>
              TRL grpo_trainer.py L3146-L3147
            </Cite>
            . In the default mode, <code>sequence_mask</code>, the ratio is the exponential of the
            summed per-token differences, a sequence above the cap gets a weight of zero, and no
            lower bound applies. The docstring&apos;s list of modes still tags{' '}
            <code>token_truncate</code> as the default{' '}
            <Cite tier={1} href={trlCfg('L327-L331')} kind="doc-code-conflict">
              TRL grpo_config.py docstring L327-L331
            </Cite>
            ; the field default is <code>sequence_mask</code>{' '}
            <Cite tier={1} href={trlCfg('L934-L935')}>
              TRL grpo_config.py L934-L935
            </Cite>
            .
          </Box>
          <Box variant="p">
            OpenRLHF ships a correction of the same kind switched off:{' '}
            <code>--algo.advantage.is_correction_level</code> defaults to <code>off</code>, and its
            sequence level gates on the geometric mean of the token ratios, with bounds of 0.5 and
            5.0{' '}
            <Cite tier={1} href={openrlhf('L256-L290')}>
              OpenRLHF train_ppo_ray.py L256-L290
            </Cite>
            .
          </Box>
          <Box variant="p">
            Two numbers make the correction visible on a run. Its extra trainer forward pass over
            every completion took 6.8% and 6.5% of step time on our run{' '}
            <Cite tier={0} href={E0_URL}>
              {E0_TITLE}
            </Cite>{' '}
            <Cite tier={1} href={trlTrainer('L2642-L2655')} kind="code">
              TRL grpo_trainer.py L2642-L2655
            </Cite>
            . And TRL logs the ratio&apos;s minimum after the mask is applied: in our logs it read
            0.0 in 3 of 20 steps in one run and 2 of 20 in the other{' '}
            <Cite tier={0} href={E0_LOG_RUN1}>
              E0 run 1 logs.jsonl
            </Cite>{' '}
            <Cite tier={0} href={E0_LOG_RUN2}>
              E0 run 2 logs.jsonl
            </Cite>
            , which on our reading of the code means the mask dropped at least one sequence in those
            steps{' '}
            <Cite tier={1} href={trlTrainer('L2874-L2890')} kind="code">
              TRL grpo_trainer.py L2874-L2890
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Instrument five numbers on your first run, then let cluster size pick the placement"
          >
            What to measure, and when to split the pools
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Five numbers tell you where a step&apos;s time goes, and each has a reference point
            from the runs above:
          </Box>
          <ul>
            <li>
              <strong>Generation share of step time.</strong> 62.0% and 62.9% on our 0.5B run;
              67.4% to 78% in the published 7B and 32B runs.
            </li>
            <li>
              <strong>Idle GPU time while the longest responses finish.</strong> This is the tail
              that more GPUs barely shorten: eight times the GPUs for a 45% cut. With models on
              separate GPUs it also includes the models waiting on generation: in standalone
              placement &quot;models except the actor are idle&quot; during generation{' '}
              <Cite tier={3} href={HYBRIDFLOW} venue="EuroSys 2025">
                HybridFlow, Section 2.4
              </Cite>
              .
            </li>
            <li>
              <strong>Staleness</strong>, in an asynchronous run: how many policy versions separate
              the sampler from the trainer, against the bound you set (AReaL&apos;s eta,
              prime-rl&apos;s default of eight).
            </li>
            <li>
              <strong>Weight-sync time.</strong> In colocate mode the sync is an in-process copy: 17
              ms per step, 0.8% to 0.9% of step time, for 0.5B parameters on the Spark{' '}
              <Cite tier={0} href={E0_URL}>
                {E0_TITLE}
              </Cite>
              , against up to 36.4% of an iteration that HybridFlow quotes for a 70B actor moved
              across devices{' '}
              <Cite tier={3} href={HYBRIDFLOW} venue="EuroSys 2025">
                HybridFlow, Section 2.2
              </Cite>
              . Our reading: the cost grows with parameter count and with whether the copy crosses a
              device boundary. Our run tested colocated loading only; sleep mode and server mode
              were not tested.
            </li>
            <li>
              <strong>The log-probability recompute that the default mismatch correction adds</strong>
              : 6.5% to 6.8% of step time on our run, with its logged minimum ratio, where 0.0 marks
              a masked sequence.
            </li>
          </ul>
          <Box variant="p">
            On a DGX Spark, read free memory from the operating system. vLLM 0.28.0 sized its share
            from all 121.69 GiB of device memory: our 0.12 fraction gave 14.6 GiB while other
            services held about 70 GB, and <code>torch.cuda.mem_get_info()</code> reported 11.9
            GiB free where <code>free</code> reported 52 GiB available{' '}
            <Cite tier={0} href={E0_URL}>
              {E0_TITLE}
            </Cite>
            . The fraction is a share of the whole pool, whatever other processes hold, so size it
            against what <code>free</code> reports.
          </Box>
          <Box variant="p">
            Then let cluster size pick the placement. In HybridFlow&apos;s PPO runs on A100-80GB
            GPUs, colocating every model on the same GPUs won from 16 to 64 GPUs; split placement,
            with the actor and reference model on one set of GPUs and the critic and reward model
            on another, won at 96 GPUs for 13B models and at 96 to 128 for 34B models{' '}
            <Cite tier={3} href={HYBRIDFLOW} venue="EuroSys 2025">
              HybridFlow, Sections 8.1 and 8.3, Figure 12
            </Cite>
            . Colocation stops scaling there because a fixed batch spread over more data-parallel
            replicas lowers the ratio of computation to communication{' '}
            <Cite tier={3} href={HYBRIDFLOW} venue="EuroSys 2025">
              HybridFlow, Section 8.3
            </Cite>
            .
          </Box>
          <ExpandableSection headerText="Placement and memory defaults of five frameworks at pinned tags">
            <SpaceBetween size="s">
              <Box variant="p">
                Framework speed claims are each author&apos;s own, at older versions; this dive does
                not rank frameworks. These are the defaults a first run inherits.
              </Box>
              <Box variant="p">
                <strong>TRL v1.16.0.</strong> Generation runs through vLLM only with{' '}
                <code>use_vllm=True</code>; the default <code>False</code> uses{' '}
                <code>model.generate()</code>{' '}
                <Cite tier={1} href={trlCfg('L587-L593')}>
                  grpo_config.py L587-L593
                </Cite>
                . <code>vllm_mode</code> defaults to <code>colocate</code>, where vLLM runs in the
                training process and shares its GPUs{' '}
                <Cite tier={1} href={trlCfg('L594-L603')}>
                  grpo_config.py L594-L603
                </Cite>
                , with <code>vllm_gpu_memory_utilization</code> 0.3{' '}
                <Cite tier={1} href={trlCfg('L655-L663')}>
                  grpo_config.py L655-L663
                </Cite>{' '}
                and sleep mode off{' '}
                <Cite tier={1} href={trlCfg('L612-L618')}>
                  grpo_config.py L612-L618
                </Cite>
                .
              </Box>
              <Box variant="p">
                <strong>verl v0.9.1.</strong> Actor and rollout share the same GPUs
                (<code>hybrid_engine: true</code>), which every trainer except the v1{' '}
                <code>separate_async</code> trainer requires{' '}
                <Cite tier={1} href={verl('ppo_trainer.yaml', 'L55-L60')}>
                  ppo_trainer.yaml L55-L60
                </Cite>
                . The rollout engine gets 0.5 of GPU memory for its KV cache{' '}
                <Cite tier={1} href={verl('rollout/rollout.yaml', 'L45-L46')}>
                  rollout.yaml L45-L46
                </Cite>
                , frees that cache after generation{' '}
                <Cite tier={1} href={verl('rollout/rollout.yaml', 'L60-L61')}>
                  rollout.yaml L60-L61
                </Cite>
                , and defaults to a tensor-parallel size of 2, which assumes at least two GPUs per
                rollout replica{' '}
                <Cite tier={1} href={verl('rollout/rollout.yaml', 'L63-L64')}>
                  rollout.yaml L63-L64
                </Cite>
                .
              </Box>
              <Box variant="p">
                <strong>OpenRLHF v0.11.2.</strong> The three colocation flags,{' '}
                <code>--train.colocate_actor_ref</code>, <code>--train.colocate_critic_reward</code>{' '}
                and <code>--train.colocate_all</code>, all default to off{' '}
                <Cite tier={1} href={openrlhf('L206-L228')}>
                  train_ppo_ray.py L206-L228
                </Cite>
                , so each role gets its own GPUs, 8 per node by default{' '}
                <Cite tier={1} href={openrlhf('L201-L216')}>
                  train_ppo_ray.py L201-L216
                </Cite>
                . vLLM&apos;s memory fraction defaults to 0.95, a value that assumes vLLM owns its
                GPUs{' '}
                <Cite tier={1} href={openrlhf('L250-L255')}>
                  train_ppo_ray.py L250-L255
                </Cite>
                ; weights sync over <code>nccl</code> by default{' '}
                <Cite tier={1} href={openrlhf('L240')}>
                  train_ppo_ray.py L240
                </Cite>
                , and vLLM sleep mode is switched off unless <code>--train.colocate_all</code> is set{' '}
                <Cite tier={1} href={openrlhf('L707-L709')} kind="code">
                  train_ppo_ray.py L707-L709
                </Cite>
                .
              </Box>
              <Box variant="p">
                <strong>slime v0.4.0.</strong> <code>--colocate</code> is off by default, so
                inference gets its own GPU pool and the actor 8 GPUs per node{' '}
                <Cite tier={1} href={slime('slime/utils/arguments.py', 'L40-L79')}>
                  arguments.py L40-L79
                </Cite>
                . Under <code>--colocate</code>, offloading the trainer and the rollout engine is the
                default when unset; an explicit <code>--no-offload-train</code> is kept unless{' '}
                <code>--release-train</code> is on{' '}
                <Cite tier={1} href={slime('slime/utils/arguments.py', 'L2115-L2130')} kind="code">
                  arguments.py L2115-L2130
                </Cite>
                . Its <code>train.py</code> runs the synchronous step as generate, offload the
                rollout engine, train, offload the trainer, reload rollout weights, pause admission,
                update weights{' '}
                <Cite tier={1} href={slime('train.py', 'L47-L97')}>
                  train.py L47-L97
                </Cite>
                . The <code>--use-tis</code> mismatch correction is off by default{' '}
                <Cite tier={1} href={slime('slime/utils/arguments.py', 'L1165-L1174')}>
                  arguments.py L1165-L1174
                </Cite>
                .
              </Box>
              <Box variant="p">
                <strong>prime-rl v0.10.0.</strong> Trainer, inference and orchestrator ship as
                separate executables next to an <code>rl</code> launcher{' '}
                <Cite tier={1} href={primeRl('pyproject.toml', 'L39-L47')}>
                  pyproject.toml L39-L47
                </Cite>
                , the GPU extra requires <code>vllm&gt;=0.31.0</code> on Linux{' '}
                <Cite tier={1} href={primeRl('pyproject.toml', 'L58')}>
                  pyproject.toml L58
                </Cite>
                , and the staleness bound <code>max_off_policy_steps</code> defaults to 8{' '}
                <Cite tier={1} href={primeRl('packages/prime-rl-configs/src/prime_rl/configs/orchestrator.py', 'L542-L543')}>
                  orchestrator.py L542-L543
                </Cite>
                .
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <Box variant="p">
            On a single machine colocation is the only placement, and it is where to start: run the
            colocated default and measure the five numbers. When you add GPUs, spend them on a
            larger rollout budget before a shorter step, since eight times the GPUs bought only a
            45% cut in rollout time. Our reading of the runs above: a tail that dominates the step,
            a weight sync that crosses devices, or a cluster past the sizes where colocation stopped
            winning in HybridFlow&apos;s runs is the signal to split the pools, and then to accept a
            bounded staleness.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
