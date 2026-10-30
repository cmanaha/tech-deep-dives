import type { ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';
import { Cite, arxiv, gh, researchUrl, E0_URL, TRL_TAG } from '../components/Cite';

/* ------------------------------------------------------------------------ */
/* Sources                                                                  */
/* ------------------------------------------------------------------------ */

/** Agrawal et al., GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning. */
const GEPA = arxiv('2507.19457v2');

/** E0 scripts and raw logs, at the dive commit that holds them. */
const E0_TRAIN = researchUrl('2026-10/E0-spark-smoke/train.py');
const E0_RUN_SH = researchUrl('2026-10/E0-spark-smoke/run.sh');
const E0_FREEZE = researchUrl('2026-10/E0-spark-smoke/pip-freeze.txt');
const E0_RUN1_LOGS = researchUrl('2026-10/E0-spark-smoke/run1/logs.jsonl');
const E0_RUN2_LOGS = researchUrl('2026-10/E0-spark-smoke/run2/logs.jsonl');
const E0_RUN1_META = researchUrl('2026-10/E0-spark-smoke/run1/meta.json');
const E0_RUN2_TRAIN_LOG = researchUrl('2026-10/E0-spark-smoke/run2/train.log');

/** NVIDIA's DGX Spark playbooks, at the commit read for this dive. */
const SPARK_PLAYBOOKS = 'NVIDIA/dgx-spark-playbooks';
const SPARK_PLAYBOOKS_SHA = 'c035e0ac7d211509ec131b79b5b6f0f824a9e421';
const VLM_PLAYBOOK = 'nvidia/playbook-vlm-finetuning';

function trlCode(path: string, lines: string): string {
  return gh('huggingface/trl', TRL_TAG, path, lines);
}
function playbook(path: string, lines?: string): string {
  return gh(SPARK_PLAYBOOKS, SPARK_PLAYBOOKS_SHA, path, lines);
}

/** Conditions every E0 figure carries. */
const E0_TITLE =
  'E0: Qwen2.5-0.5B-Instruct, completions capped at 256 tokens, TRL 1.16.0 with vLLM 0.28.0 colocated on one GB10, single seed, two runs';

function E0({ children = E0_TITLE }: { children?: ReactNode }) {
  return (
    <Cite tier={0} href={E0_URL}>
      {children}
    </Cite>
  );
}
function Gepa({ children }: { children: ReactNode }) {
  return (
    <Cite tier={3} href={GEPA} venue="ICLR 2026">
      {children}
    </Cite>
  );
}

const INSTALL = `python3 -m venv venv
./venv/bin/pip install --upgrade pip
./venv/bin/pip install "vllm==0.28.0" "trl[vllm]==1.16.0"`;

const CONFIG = `# Set in train.py (condensed)
GRPOConfig(
    max_steps=20,
    per_device_train_batch_size=16,    # 16 completions: 2 prompts x 8
    num_generations=8,                 # also TRL's default
    max_completion_length=256,
    learning_rate=1e-6,
    temperature=1.0,
    use_vllm=True,
    vllm_mode="colocate",
    vllm_gpu_memory_utilization=0.12,  # a share of all 121.69 GiB on the Spark
    bf16=True,
    seed=0,
    model_init_kwargs={"dtype": "bfloat16"},
)
# model: Qwen/Qwen2.5-0.5B-Instruct, full fine-tuning, no LoRA

# TRL 1.16.0 defaults left in place
#   loss_type="dapo"   beta=0.0   epsilon=0.2   scale_rewards="group"
#   importance_sampling_level="token"   steps_per_generation=1   num_iterations=1
#   vllm_enable_sleep_mode=False   vllm_importance_sampling_correction=True`;

/* ------------------------------------------------------------------------ */
/* Diagrams                                                                 */
/* ------------------------------------------------------------------------ */

interface Segment {
  share: number;
  fill: string;
}

interface RunBar {
  label: string;
  y: number;
  median: string;
  gen: string;
  train: string;
  recompute: string;
  sync: string;
  segments: Segment[];
}

/** Bar geometry: 100% of summed step time spans BAR_W units from BAR_X. */
const BAR_X = 100;
const BAR_W = 660;
const BAR_H = 48;

const RUNS: RunBar[] = [
  {
    label: 'Run 1',
    y: 70,
    median: '2.087 s',
    gen: '62.0%',
    train: '29.9%',
    recompute: '6.8%',
    sync: '0.9%',
    segments: [
      { share: 62.0, fill: '#0972d3' },
      { share: 29.9, fill: '#1f7a70' },
      { share: 6.8, fill: '#ec7211' },
      { share: 0.9, fill: '#6f4cc4' },
    ],
  },
  {
    label: 'Run 2',
    y: 186,
    median: '2.110 s',
    gen: '62.9%',
    train: '29.5%',
    recompute: '6.5%',
    sync: '0.8%',
    segments: [
      { share: 62.9, fill: '#0972d3' },
      { share: 29.5, fill: '#1f7a70' },
      { share: 6.5, fill: '#ec7211' },
      { share: 0.8, fill: '#6f4cc4' },
    ],
  },
];

const MEDIANS = { gen: ['1.319 s', '1.341 s'], train: ['0.604 s', '0.605 s'] };

function StepTimeDiagram() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 860 300"
        role="img"
        aria-labelledby="lab-steptime-title"
        aria-describedby="lab-steptime-desc"
        style={{ width: '100%', minWidth: 680, height: 'auto' }}
      >
        <title id="lab-steptime-title">
          Where a GRPO step&apos;s time went on one DGX Spark, in two runs of 20 steps: generation
          took 62.0% and 62.9% of summed step time, training 29.9% and 29.5%, other preparation (the
          trainer&apos;s log-probability recompute for the mismatch correction plus the advantage
          computation) 6.8% and 6.5%, and the weight sync into vLLM 0.9% and 0.8%. The median step took 2.087 s and 2.110 s.
        </title>
        <desc id="lab-steptime-desc">
          Measured on our own run (Tier 0): Qwen2.5-0.5B-Instruct, 16 completions per step capped at
          256 tokens, TRL 1.16.0 with vLLM 0.28.0 colocated on one GB10, seed 0. Shares are of
          summed step time over all 20 steps; seconds are medians over steps 2 to 20.
        </desc>
        <rect x="0" y="0" width="860" height="300" rx="8" fill="#ffffff" stroke="#d1d5db" />
        <text x="24" y="34" fill="#16191f" fontFamily="sans-serif" fontSize="13" fontWeight="600">
          Share of summed step time, 20 GRPO steps per run
        </text>
        <text
          x="845"
          y="60"
          fill="#5f6b7a"
          fontFamily="sans-serif"
          fontSize="11"
          fontWeight="600"
          textAnchor="end"
        >
          Median step
        </text>
        {RUNS.map((run, r) => {
          let x = BAR_X;
          const rects = run.segments.map((s, i) => {
            const w = (s.share / 100) * BAR_W;
            const rect = (
              <rect key={i} x={x} y={run.y} width={w} height={BAR_H} fill={s.fill} />
            );
            x += w;
            return rect;
          });
          const genW = (run.segments[0].share / 100) * BAR_W;
          const trainW = (run.segments[1].share / 100) * BAR_W;
          const recX = BAR_X + genW + trainW;
          const recW = (run.segments[2].share / 100) * BAR_W;
          const syncX = recX + recW;
          const syncW = (run.segments[3].share / 100) * BAR_W;
          const recMid = recX + recW / 2;
          const syncMid = syncX + syncW / 2;
          const bottom = run.y + BAR_H;
          return (
            <g key={run.label}>
              <text
                x="24"
                y={run.y + 29}
                fill="#16191f"
                fontFamily="sans-serif"
                fontSize="13"
                fontWeight="600"
              >
                {run.label}
              </text>
              {/* remainder: scoring and time outside the timed calls */}
              <rect x={BAR_X} y={run.y} width={BAR_W} height={BAR_H} fill="#d1d5db" />
              {rects}
              <text
                x={BAR_X + genW / 2}
                y={run.y + 20}
                fill="#ffffff"
                fontFamily="sans-serif"
                fontSize="13"
                fontWeight="600"
                textAnchor="middle"
              >
                {`Generation ${run.gen}`}
              </text>
              <text
                x={BAR_X + genW / 2}
                y={run.y + 37}
                fill="#ffffff"
                fontFamily="sans-serif"
                fontSize="11"
                textAnchor="middle"
              >
                {`${MEDIANS.gen[r]} median`}
              </text>
              <text
                x={BAR_X + genW + trainW / 2}
                y={run.y + 20}
                fill="#ffffff"
                fontFamily="sans-serif"
                fontSize="13"
                fontWeight="600"
                textAnchor="middle"
              >
                {`Training ${run.train}`}
              </text>
              <text
                x={BAR_X + genW + trainW / 2}
                y={run.y + 37}
                fill="#ffffff"
                fontFamily="sans-serif"
                fontSize="11"
                textAnchor="middle"
              >
                {`${MEDIANS.train[r]} median`}
              </text>
              <line
                x1={recMid}
                y1={bottom}
                x2={recMid}
                y2={bottom + 18}
                stroke="#5f6b7a"
                strokeWidth="1.2"
              />
              <text
                x={recMid - 6}
                y={bottom + 22}
                fill="#16191f"
                fontFamily="sans-serif"
                fontSize="11"
                textAnchor="end"
              >
                {`Other preparation: log-probability recompute and advantages ${run.recompute}, 0.136 s median`}
              </text>
              <line
                x1={syncMid}
                y1={bottom}
                x2={syncMid}
                y2={bottom + 38}
                stroke="#5f6b7a"
                strokeWidth="1.2"
              />
              <text
                x={syncMid - 6}
                y={bottom + 42}
                fill="#16191f"
                fontFamily="sans-serif"
                fontSize="11"
                textAnchor="end"
              >
                {`Weight sync into vLLM ${run.sync}, 0.017 s median`}
              </text>
              <text
                x="845"
                y={run.y + 29}
                fill="#16191f"
                fontFamily="sans-serif"
                fontSize="13"
                fontWeight="600"
                textAnchor="end"
              >
                {run.median}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

interface Arm {
  title: string;
  detail: string;
  stroke: string;
  fill: string;
}

const ARMS: Arm[] = [
  {
    title: '(a) Base model',
    detail: 'changes nothing; the reference curve',
    stroke: '#879596',
    fill: '#f2f3f3',
  },
  {
    title: '(b) GRPO with LoRA',
    detail: 'changes LoRA weights; R training rollouts',
    stroke: '#0972d3',
    fill: '#f2f8fd',
  },
  {
    title: '(c) GEPA',
    detail: 'changes the prompt; R rollouts; reflector recorded',
    stroke: '#037f0c',
    fill: '#ecf7ec',
  },
  {
    title: '(d) Playbook loop, ACE pattern',
    detail: 'changes a playbook; R rollouts; reflector recorded',
    stroke: '#037f0c',
    fill: '#ecf7ec',
  },
  {
    title: '(e) Best-of-n with the verifier',
    detail: 'changes nothing; n samples per test query',
    stroke: '#6f4cc4',
    fill: '#efe7fb',
  },
];

function E1ArmsDiagram() {
  const armX = 280;
  const armW = 380;
  const armH = 46;
  const rowY = (i: number) => 50 + i * 70;
  const busX = 250;
  const taskMidY = 195;
  const measureX = 720;
  const measureW = 116;
  const measureLines: { t: string; y: number; bold?: boolean }[] = [
    { t: 'Measure', y: 80, bold: true },
    { t: 'same held-out', y: 112 },
    { t: 'test set,', y: 128 },
    { t: '500+ problems', y: 144 },
    { t: 'pass@1', y: 184 },
    { t: 'pass@k to', y: 200 },
    { t: 'k = 256', y: 216 },
    { t: 'tokens per', y: 256 },
    { t: 'query', y: 272 },
    { t: 'wall-clock', y: 312 },
  ];
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 860 396"
        role="img"
        aria-labelledby="lab-e1arms-title"
        style={{ width: '100%', minWidth: 680, height: 'auto' }}
      >
        <title id="lab-e1arms-title">
          The E1 protocol, not run in this build: one fresh synthetic task with a skill gap and an
          unstated rule, scored by one exact-match verifier, feeds five arms. The base model changes
          nothing, GRPO changes LoRA weights, GEPA changes the prompt, a playbook loop changes a
          playbook, and best-of-n changes nothing but spends n samples per query. Arms b, c and d
          share one training-rollout budget, and every arm is measured on the same held-out test
          set for pass@1, pass@k up to k = 256, tokens per query and wall-clock.
        </title>
        <defs>
          <marker
            id="lab-e1arms-ah"
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
        <rect x="0" y="0" width="860" height="396" rx="8" fill="#ffffff" stroke="#d1d5db" />
        <text x="24" y="30" fill="#16191f" fontFamily="sans-serif" fontSize="13" fontWeight="600">
          E1 protocol, not run in this build: one task, five arms, one test set
        </text>

        {/* task box */}
        <rect x="24" y="120" width="196" height="150" rx="6" fill="#fbf3d5" stroke="#8b6c00" strokeWidth="1.5" />
        {[
          { t: 'One task', y: 146, bold: true },
          { t: 'skill gap plus', y: 168 },
          { t: 'an unstated rule', y: 184 },
          { t: 'fresh synthetic items', y: 206 },
          { t: 'exact-match verifier', y: 228 },
          { t: 'in plain Python', y: 244 },
        ].map((l) => (
          <text
            key={l.t}
            x="122"
            y={l.y}
            fill="#16191f"
            fontFamily="sans-serif"
            fontSize={l.bold ? 13 : 11}
            fontWeight={l.bold ? 600 : 400}
            textAnchor="middle"
          >
            {l.t}
          </text>
        ))}

        {/* bus from task to arms */}
        <line x1="220" y1={taskMidY} x2={busX} y2={taskMidY} stroke="#5f6b7a" strokeWidth="1.5" />
        <line
          x1={busX}
          y1={rowY(0) + armH / 2}
          x2={busX}
          y2={rowY(4) + armH / 2}
          stroke="#5f6b7a"
          strokeWidth="1.5"
        />

        {ARMS.map((arm, i) => {
          const y = rowY(i);
          const mid = y + armH / 2;
          return (
            <g key={arm.title}>
              <line
                x1={busX}
                y1={mid}
                x2={armX - 2}
                y2={mid}
                stroke="#5f6b7a"
                strokeWidth="1.5"
                markerEnd="url(#lab-e1arms-ah)"
              />
              <rect
                x={armX}
                y={y}
                width={armW}
                height={armH}
                rx="6"
                fill={arm.fill}
                stroke={arm.stroke}
                strokeWidth="1.5"
              />
              <text
                x={armX + 14}
                y={y + 19}
                fill="#16191f"
                fontFamily="sans-serif"
                fontSize="13"
                fontWeight="600"
              >
                {arm.title}
              </text>
              <text x={armX + 14} y={y + 36} fill="#414d5c" fontFamily="sans-serif" fontSize="11">
                {arm.detail}
              </text>
              <line
                x1={armX + armW}
                y1={mid}
                x2={measureX - 2}
                y2={mid}
                stroke="#5f6b7a"
                strokeWidth="1.5"
                markerEnd="url(#lab-e1arms-ah)"
              />
            </g>
          );
        })}

        {/* measurement box */}
        <rect
          x={measureX}
          y={rowY(0)}
          width={measureW}
          height={rowY(4) + armH - rowY(0)}
          rx="6"
          fill="#f2f8fd"
          stroke="#065299"
          strokeWidth="1.5"
        />
        {measureLines.map((l) => (
          <text
            key={l.t}
            x={measureX + measureW / 2}
            y={l.y}
            fill="#16191f"
            fontFamily="sans-serif"
            fontSize={l.bold ? 13 : 11}
            fontWeight={l.bold ? 600 : 400}
            textAnchor="middle"
          >
            {l.t}
          </text>
        ))}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function SideBySideLab() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Run the dive's comparison on a machine you can own: one RL step took about 2.1 s on a 0.5B model, and at a 4% base rate 9 and 10 of 20 steps produced no gradient, so the protocol measures the base rate before it trains (our DGX Spark run with TRL 1.16.0 and vLLM 0.28.0, and sources read 2026-10-30)"
          >
            21. Side by Side on a DGX Spark
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            This section is the dive&apos;s lab, where its claims meet hardware a reader can own. It
            has two parts. E0, which we ran, asks whether an RL (reinforcement learning) training
            loop runs on one NVIDIA DGX Spark and where each step&apos;s time goes. E1, which this
            build did not run, is a protocol: one task, one verifier and one rollout budget (a
            rollout is one sampled attempt) put in front of a base model, an RL-trained model, two text loops and best-of-n sampling, so
            you can watch sharpening (probability moving toward answers the model could already
            produce) and instruction-learning (picking up a rule the prompt never stated) on the
            same chart. The machine itself is covered in the{' '}
            <Link href="../silicon-memory-inference/">Silicon, Memory &amp; Inference dive</Link>.
          </Box>
          <Box variant="p">
            One E0 result shapes the whole protocol. About 4% of the base model&apos;s answers were
            correct, and on 9 of 20 steps in one run and 10 of 20 in the other, every sampled answer scored
            zero, so those steps produced no gradient at all <E0 />. A task the starting model
            almost never solves gives RL nothing to learn from, which is why E1 measures the base
            rate before it trains anything.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Know what one RL step costs on a DGX Spark before you budget a longer run: about 2.1 s on a 0.5B model, most of it generation"
          >
            E0: where a GRPO step&apos;s time goes on one GB10
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            E0 trained Qwen2.5-0.5B-Instruct with GRPO (Group Relative Policy Optimization: sample a
            group of answers per prompt, score each one, and raise the probability of the answers
            that beat the group&apos;s average) for 20 steps, twice. TRL (Transformers Reinforcement
            Learning, Hugging Face&apos;s post-training library) 1.16.0 ran the training and vLLM
            0.28.0 generated the answers, colocated in the same process on one GB10. Each step
            sampled 8 answers for each of 2 prompts, capped at 256 tokens, on fresh synthetic
            arithmetic of the form <code>(a + b) * c - d</code>, scored 1 when the integer inside
            the answer tags matched and 0 otherwise. Both runs completed all 20 steps <E0 />{' '}
            <Cite tier={0} href={`${E0_TRAIN}#L37-L65`}>
              E0 train.py, task and grader
            </Cite>
            .
          </Box>
          <Box variant="p">
            The median step took 2.087 s in the first run and 2.110 s in the second, over steps 2 to
            20 (step 1 carries warm-up). Generation took 62.0% and 62.9% of summed step time and
            training (the loss forward pass, the backward pass and the optimizer step) 29.9% and
            29.5%. The rest of the preparation took 6.8% and 6.5%: the trainer&apos;s extra
            forward pass, which recomputes the log-probability of every sampled token so TRL can
            correct for vLLM and the trainer disagreeing about them (the mismatch correction),
            together with the advantage computation. Copying the updated weights into vLLM took 17
            ms per step, 0.9% and 0.8% <E0>E0 log</E0>{' '}
            <Cite tier={1} href={trlCode('trl/trainer/grpo_trainer.py', 'L2640-L2655')} kind="code">
              TRL grpo_trainer.py L2640-L2655
            </Cite>
            . Section 19, An RL Step Is an Inference Job Inside a Training Job, explains each stage;
            this run gives you one measured point to plan from.
          </Box>
          <StepTimeDiagram />
          <Box variant="small" color="text-body-secondary">
            Measured (Tier 0). Shares are of summed step time over all 20 steps of each run; seconds
            are medians over steps 2 to 20. The four stages sum to 99.6% and 99.7%; the grey
            remainder is scoring (under 0.1%) and time outside the timed calls.
          </Box>
          <Box variant="p">
            Every E0 figure holds for its conditions: one GB10, Qwen2.5-0.5B-Instruct with full
            fine-tuning in bf16 (16-bit floating point), completions capped at 256 tokens, a single
            seed and two runs, TRL 1.16.0 with vLLM 0.28.0 colocated. E0 shows the mechanism, not
            learning: twenty steps at a learning rate of 1e-6 from a 4% base rate test whether the
            loop runs, and the reward did not move and was not expected to <E0>E0 log</E0>. A larger model,
            longer outputs, LoRA (Low-Rank Adaptation, which trains small added matrices instead of
            every weight), vLLM&apos;s sleep mode and vLLM&apos;s server mode were not tested.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Read the two signals a live run hands you: steps with nothing to learn from, and two engines that disagree about the same weights"
          >
            What the logs show beyond the timing
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Steps with no gradient.</strong> The mean reward was 0.044 in both runs. On 9 of
            20 steps in run 1 and 10 of 20 in run 2, both groups of 8 scored all zero, TRL&apos;s{' '}
            <code>frac_reward_zero_std</code> read 1.0 and the loss was exactly 0.0 <E0 />{' '}
            <Cite tier={0} href={E0_RUN1_LOGS}>
              E0 run 1 logs.jsonl
            </Cite>{' '}
            <Cite tier={0} href={E0_RUN2_LOGS}>
              E0 run 2 logs.jsonl
            </Cite>
            . On those steps the advantage, how much better an answer did than its group&apos;s
            average, was zero for every answer, so nothing moved. Section 7, RLVR &amp; GRPO
            (RLVR: RL with verifiable rewards), derives that share from the base rate; on your own run it is the first number to check.
          </Box>
          <Box variant="p">
            <strong>Two engines, one set of weights.</strong> vLLM and the trainer disagree slightly
            about the same model. The per-token log-probability difference between vLLM&apos;s
            sampling and the trainer&apos;s recomputation averaged 0.011 per step in both runs, with
            single tokens differing by up to 0.92 and 1.14, and TRL&apos;s importance-sampling
            ratio, the factor that reweights a sampled answer by how likely the trainer finds it,
            reached 2.80 and 2.86 <E0>E0 log</E0>. That disagreement is why TRL pays for the extra forward
            pass by default; section 19 covers the correction. TRL logs both as{' '}
            <code>sampling/sampling_logp_difference</code> and{' '}
            <code>sampling/importance_sampling_ratio</code>, so you can watch them on every run.
          </Box>
          <Box variant="p">
            <strong>Memory, read the way unified memory needs.</strong> Per-process memory from{' '}
            <code style={{ whiteSpace: 'nowrap' }}>nvidia-smi</code> read zero for the run&apos;s processes, so E0 read{' '}
            <code>MemAvailable</code> from the operating system and PyTorch&apos;s own counters.
            Available memory fell 23,694 MiB and 24,472 MiB (23.1 and 23.9 GiB) at its lowest point,
            and <code>torch.cuda.max_memory_allocated</code> peaked at 17.23 and 17.89 GiB. vLLM
            applied its memory fraction to all 121.69 GiB of device memory: 0.12 became 14.6 GiB,
            whatever other processes held <E0>E0 log</E0>{' '}
            <Cite tier={0} href={E0_RUN2_TRAIN_LOG}>
              E0 run 2 train.log, vLLM startup line
            </Cite>
            . Size that fraction against what <code>free</code> reports as available.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Rebuild E0 in a fresh environment in a few minutes, without disturbing anything else on a shared machine"
          >
            Reproduce E0 on your own Spark
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            E0 ran in a fresh virtual environment from the PyPI wheels; the install resolved in
            about three minutes with no build from source <E0 />. NVIDIA&apos;s Unsloth playbook
            installs <code>trl==0.26.1</code> and <code>datasets==4.3.0</code> inside its container{' '}
            <Cite tier={1} href={playbook('nvidia/playbook-unsloth/README.md', 'L121')}>
              NVIDIA playbook-unsloth README L121
            </Cite>
            , below the <code>datasets&gt;=4.7.0</code> that TRL 1.16.0 requires{' '}
            <Cite tier={1} href={trlCode('pyproject.toml', 'L32')}>
              TRL pyproject.toml L32
            </Cite>
            , so E0 did not use it. The exact environment is in{' '}
            <Cite tier={0} href={E0_FREEZE}>
              E0 pip-freeze.txt
            </Cite>
            .
          </Box>
          <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{INSTALL}</pre>
          <Box variant="p">
            The trainer configuration, and the TRL 1.16.0 defaults it left in place, most of
            them read back from the trainer into <code>meta.json</code>{' '}
            <Cite tier={0} href={`${E0_TRAIN}#L165-L183`}>
              E0 train.py L165-L183
            </Cite>{' '}
            <Cite tier={0} href={E0_RUN1_META}>
              E0 run 1 meta.json
            </Cite>{' '}
            <Cite tier={1} href={trlCode('trl/trainer/grpo_config.py', 'L925-L926')}>
              TRL grpo_config.py L925-L926
            </Cite>
            :
          </Box>
          <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{CONFIG}</pre>
          <Box variant="p">
            E0 set the vLLM fraction to 0.12 as a ceiling for the job. TRL&apos;s default is 0.3{' '}
            <Cite tier={1} href={trlCode('trl/trainer/grpo_config.py', 'L656-L657')}>
              TRL grpo_config.py L656-L657
            </Cite>
            , which on the Spark&apos;s 121.69 GiB would ask for about 36.5 GiB (our arithmetic:
            0.3 x 121.69). The first run took 180 s from start to exit, with the model download and
            the first compile, and the second took 81 s with the compile cache warm <E0>E0 log</E0>.
          </Box>
          <ExpandableSection headerText="How to run it on a machine other people are using">
            <SpaceBetween size="s">
              <Box variant="p">
                E0 ran on a live shared host, with other services holding about 70 GB throughout{' '}
                <E0>E0 log</E0>. The runner script{' '}
                <Cite tier={0} href={E0_RUN_SH}>
                  E0 run.sh
                </Cite>{' '}
                and the run record carry five measures you can reuse:
              </Box>
              <ul>
                <li>
                  Check before you start that available memory clears your need with margin. E0
                  required at least 40 GiB available and found 52 GiB.
                </li>
                <li>
                  Keep everything the run writes in one directory: the virtual environment,{' '}
                  <code>HOME</code>, <code>TMPDIR</code>, <code>HF_HOME</code>, the pip cache and
                  the logs. No sudo, and no service touched.
                </li>
                <li>
                  Run at low priority with a hard time limit (<code>nice -n 10</code>,{' '}
                  <code>timeout 2h</code>) in its own session (<code>setsid</code>), so one signal
                  to that process group stops the run and nothing else.
                </li>
                <li>
                  Watch memory from outside the trainer: E0&apos;s watchdog sampled{' '}
                  <code>MemAvailable</code> every 10 s and would stop the run&apos;s own process
                  group below 15 GiB. It never fired.
                </li>
                <li>
                  Tear down by removing the run directory, then confirm no process from the run
                  remains and available memory is back where it started.
                </li>
              </ul>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Set up the side-by-side yourself: one task with two kinds of gap, one verifier, and one rollout budget for every arm that learns"
          >
            E1: one task, five arms (a protocol)
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            E1 is a protocol, which this build did not run. It asks how a base model, a
            GRPO-trained model and a frozen model with a learned prompt or playbook compare on one
            task, at pass@1 (the chance a single attempt passes) and at pass@k for large k (the
            chance at least one of k attempts passes). The prompt comes from GEPA (Genetic-Pareto,
            a prompt optimiser that reflects on scored attempts and evolves the prompt), the
            playbook from a loop in the ACE (Agentic Context Engineering) pattern.
          </Box>
          <Box variant="p">
            <strong>The task carries two kinds of gap.</strong> One is the skill itself; the other
            is a rule the verifier enforces and the prompt never states, such as an output
            convention or a domain rule, so a text loop has something to learn. Without the second
            gap the chart would favour RL because of the task type alone. Generate the items fresh,
            for example Countdown-style arithmetic (reach a target from given numbers), so no model
            has seen them. Score with an exact-match verifier in plain Python, outside any
            agent&apos;s write path, and check it against the grader checklist in section 10, The
            Reward Is a Proxy, before any arm trains on it.
          </Box>
          <Box variant="p">
            <strong>Measure the base rate first.</strong> On E0&apos;s arithmetic a 4% base rate
            left 9 and 10 of 20 steps with no gradient <E0 />. Sample a group of answers per
            training prompt from the base model, score them with the verifier, and adjust the
            difficulty, or drop prompts, until most prompts pass some of the time and fail some of
            the time. Use one small Qwen-family instruct model (0.5B to 1.5B) and one non-Qwen
            control of similar size; section 8, What RL Does to a Model, explains why results
            differ by model family.
          </Box>
          <E1ArmsDiagram />
          <Box variant="small" color="text-body-secondary">
            Protocol, not a result: E1 was not run in this build. R is one training-rollout budget
            shared by arms (b), (c) and (d).
          </Box>
          <ul>
            <li>
              <strong>(a) Base model</strong>, no training: the curve every other arm is read
              against.
            </li>
            <li>
              <strong>(b) GRPO</strong> with TRL at 1.16.0 and LoRA, with <code>loss_type</code> and{' '}
              <code>beta</code> stated and rollouts counted. Log{' '}
              <code>frac_reward_zero_std</code> and the policy entropy (how spread the model&apos;s
              next-token probabilities are) per step.
            </li>
            <li>
              <strong>(c) GEPA</strong> through DSPy 3.4.1, with the same model as the task
              model. Record the reflection model; label any run with a larger local reflector as
              such.
            </li>
            <li>
              <strong>(d) A playbook loop</strong> in the ACE pattern, on the same model: delta
              updates, where the model writes only new or changed
              entries and code merges them, with duplicates pruned. Record the reflection model here
              too.
            </li>
            <li>
              <strong>(e) Best-of-n with the verifier</strong> on the base model: sample n answers
              per test query and keep one the verifier passes. This is sharpening bought at
              inference time, plotted on the same chart.
            </li>
          </ul>
          <Box variant="p">
            <strong>Budget from E0&apos;s step time.</strong> Arms (b), (c) and (d) get the same
            number of training rollouts. The GEPA paper&apos;s GRPO baseline ran 500 steps, a fixed
            24,000 rollouts <Gepa>GEPA, Appendix E.4</Gepa>. At E0&apos;s 16 completions per step
            that is 1,500 steps, and at about 2.1 s per step about 53 minutes of step time (our
            arithmetic: 24,000 / 16 = 1,500 steps x 2.1 s = 3,150 s). That holds before any scaling
            to longer outputs or a larger model, which E0 did not measure.
          </Box>
          <Box variant="p">
            <strong>An optional point at 7B to 8B.</strong> That is the size where GEPA beat GRPO
            on the same model, Qwen3 8B, on a six-task aggregate, while GRPO kept the lead on
            AIME-2025 <Gepa>GEPA, Table 1</Gepa>. NVIDIA&apos;s
            own Spark playbook already runs GRPO with LoRA on a 7B model, Qwen2.5-VL-7B-Instruct (a
            vision-language model), with rank-32 adapters through Unsloth{' '}
            <Cite tier={1} href={playbook(`${VLM_PLAYBOOK}/assets/ui_image/src/train.yaml`)}>
              NVIDIA playbook-vlm-finetuning train.yaml
            </Cite>
            , and NVIDIA&apos;s README states that about 100 steps can take up to about 2 hours{' '}
            <Cite tier={1} href={playbook(`${VLM_PLAYBOOK}/README.md`, 'L222')} kind="vendor-claim">
              NVIDIA playbook-vlm-finetuning README L222
            </Cite>
            . Its shipped configuration samples 2 answers per prompt{' '}
            <Cite tier={1} href={playbook(`${VLM_PLAYBOOK}/assets/ui_image/src/train.yaml`, 'L9')} kind="code">
              train.yaml L9
            </Cite>{' '}
            and its script does not set <code>use_vllm</code>{' '}
            <Cite
              tier={1}
              href={playbook(`${VLM_PLAYBOOK}/assets/ui_image/src/train_image_vlm.py`, 'L164-L188')}
              kind="code"
            >
              train_image_vlm.py L164-L188
            </Cite>
            , so its pace is no estimate for E1&apos;s settings.
          </Box>
          <Box variant="p">
            <strong>Measure every arm the same way</strong>, on one held-out test set of at least
            500 problems: pass@1 and pass@k at k = 1, 4, 16, 64 and 256; tokens per test query,
            counting the learned prompt or playbook; training wall-clock; and rollouts used.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Know what each arm should show if the research holds, so a result that breaks a prediction tells you something"
          >
            What the research predicts for each arm
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            These are predictions to confirm or refute, not results. Each comes from a section of
            this dive, and each can fail on your task.
          </Box>
          <ul>
            <li>
              <strong>GRPO (b) beats both text loops (c, d) at pass@1 on the skill part.</strong>{' '}
              On AIME-2025, a competition-math exam, GRPO beat a prompt optimiser on the same
              model (section 14, Optimising the Prompt).
            </li>
            <li>
              <strong>The base model (a) matches or beats GRPO (b) at pass@256.</strong> On the
              models tested, RL raised pass@1 while pass@k at large k held or fell (section 8, What
              RL Does to a Model).
            </li>
            <li>
              <strong>The text loops (c, d) close more of the unstated-rule gap per rollout than
              GRPO (b).</strong> A prompt optimiser beat GRPO on one 8B model with a fraction of
              its rollouts (section 14).
            </li>
            <li>
              <strong>The text loops learn the rule from the verifier&apos;s verdict.</strong> Feed
              the verdict to the reflector on every attempt; section 12, Verbal Reinforcement &amp;
              Self-Correction, shows what a reflection loop does without a signal from outside the
              model.
            </li>
            <li>
              <strong>The text loops cost more tokens per query than GRPO.</strong> The learned
              prompt or playbook rides along on every query (section 13, Memories, Playbooks &amp;
              Skill Libraries).
            </li>
            <li>
              <strong>Best-of-n (e) recovers part of GRPO&apos;s pass@1 gain at n times the
              inference cost</strong> (section 8, under what a frozen model can buy back).
            </li>
          </ul>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Turn your E1 chart into a choice: which gap each arm closed, what it costs per query, and which result to re-test on a larger model"
          >
            Reading your E1 results
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Read the chart arm by arm against the base curve, in three passes. Have the verifier
            report the rule check and the answer check separately, so each pass has the numbers it
            needs.
          </Box>
          <Box variant="p">
            <strong>Which gap each arm closed.</strong> A gain that sits in the rule check is
            instruction-learning. A GRPO gain at pass@1 that is gone by pass@256 is sharpening, and
            best-of-n shows how much of it a frozen model buys back. A gain in the answer check that
            holds at pass@256 is the case the research expects least; check it against the non-Qwen
            control before you trust it.
          </Box>
          <Box variant="p">
            <strong>At what per-query cost.</strong> Put tokens per test query next to each gain.
            The text loops pay for their learned context on every query, best-of-n pays for n
            samples, and the GRPO model adds no prompt tokens but paid its training wall-clock up
            front. Section 20, Cost per Improvement, turns those into a breakeven
            volume.
          </Box>
          <Box variant="p">
            <strong>Which result would change on a larger model.</strong> On a 0.5B model the text
            loops run with a 0.5B reflector unless you record a larger one, and section 14 shows the
            optimiser&apos;s own capability bounds a text loop. The comparison between GRPO and the
            text loops on the unstated rule is therefore the result most likely to move at 7B to 8B.
            Re-run arms (b), (c) and (d) there before you generalise, and measure the base rate
            there first, because the rate belongs to the model and the task together.
          </Box>
          <Box variant="p">
            Then take the three readings to section 22, Choosing a Text Loop, a Hybrid or a Weight
            Update, where they become its decision questions: what kind of gap it is, what your
            signal scores today, and how many queries the learned artifact will serve.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
