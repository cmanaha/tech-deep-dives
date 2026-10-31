import type { ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Table from '@cloudscape-design/components/table';
import { Cite, arxiv, gh, researchUrl, E0_URL, TRL_TAG, VERL_TAG } from '../components/Cite';

/** DeepSeek-R1, arXiv v2 (the Nature 2025 text). */
const R1 = arxiv('2501.12948v2');
/** DeepSeek-R1, arXiv v1 (the earlier AIME figure). */
const R1V1 = arxiv('2501.12948v1');
/** DeepSeekMath (GRPO). */
const DSM = arxiv('2402.03300v3');
/** Liu et al., Understanding R1-Zero-Like Training (Dr. GRPO). */
const DRG = arxiv('2503.20783v2');
/** DAPO. */
const DAPO = arxiv('2503.14476v2');
/** GSPO (Qwen). */
const GSPO = arxiv('2507.18071v2');
/** REINFORCE++. */
const RPP = arxiv('2501.03262v9');
/** Ahmadian et al., Back to Basics (RLOO). */
const RLOO = arxiv('2402.14740v2');
/** Shao et al., Spurious Rewards. */
const SPUR = arxiv('2506.10947v2');

const TRL = 'huggingface/trl';
const VERL = 'volcengine/verl';
const TRL_CFG = 'trl/trainer/grpo_config.py';
const TRL_TR = 'trl/trainer/grpo_trainer.py';
const TRL_RLOO = 'trl/trainer/rloo_trainer.py';
const TRL_IDX = 'docs/source/paper_index.md';
const TRL_DOC = 'docs/source/grpo_trainer.md';
const VERL_PPO = 'verl/trainer/config/ppo_trainer.yaml';
const VERL_ACTOR = 'verl/trainer/config/actor/actor.yaml';
const VERL_ROLLOUT = 'verl/trainer/config/rollout/rollout.yaml';
const VERL_ALGOS = 'verl/trainer/ppo/core_algos.py';

const BEDROCK_RFT = 'https://docs.aws.amazon.com/bedrock/latest/userguide/reinforcement-fine-tuning.html';
const BEDROCK_JOB = 'https://docs.aws.amazon.com/bedrock/latest/userguide/rft-submit-job.html';
const MTRL = 'https://docs.aws.amazon.com/sagemaker/latest/dg/model-customize-mtrl-hyperparams.html';

/** E0 raw step logs (Tier 0). */
const E0_RUN1 = researchUrl('2026-10/E0-spark-smoke/run1/logs.jsonl');
const E0_RUN2 = researchUrl('2026-10/E0-spark-smoke/run2/logs.jsonl');

/* ------------------------------------------------------------------------ */
/* Diagram: one group of eight answers, and a group that teaches nothing    */
/* ------------------------------------------------------------------------ */

/** Rewards for prompt A: answers 2, 5 and 7 pass. */
const GROUP_A = [0, 1, 0, 0, 1, 0, 1, 0];

function GroupAdvantageDiagram() {
  const cx = (i: number) => 184 + i * 88;
  const zeroY = 196;
  const unit = 48;
  const up = 1.21 * unit;
  const down = 0.72 * unit;
  const rowLabel = (y: number, text: string) => (
    <text x={16} y={y} className="rlvr-group-row">
      {text}
    </text>
  );
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 860 462"
        role="img"
        aria-labelledby="rlvr-group-title"
        style={{ width: '100%', minWidth: 640, height: 'auto' }}
      >
        <title id="rlvr-group-title">
          One GRPO step with two prompts. For prompt A, eight sampled answers are checked: three pass
          with reward 1 and five fail with reward 0. The group mean is 0.375 and the standard deviation
          0.52, so each passing answer gets an advantage of plus 1.21 and is made more likely, and each
          failing answer gets minus 0.72 and is made less likely. For prompt B, all eight answers pass:
          the mean is 1 and the standard deviation 0, so every advantage is 0 and the group adds no
          gradient to the step.
        </title>
        <style>{`
          .rlvr-group-h { fill: #16191f; font: 600 13px sans-serif; }
          .rlvr-group-hg { fill: #414d5c; font: 600 13px sans-serif; }
          .rlvr-group-s { fill: #5f6b7a; font: 11px sans-serif; }
          .rlvr-group-row { fill: #414d5c; font: 600 11px sans-serif; }
          .rlvr-group-ans { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1; }
          .rlvr-group-anst { fill: #0f1b2a; font: 11px sans-serif; text-anchor: middle; }
          .rlvr-group-pass { fill: #ecf7ec; stroke: #037f0c; stroke-width: 1.5; }
          .rlvr-group-fail { fill: #f4f4f4; stroke: #879596; stroke-width: 1.5; }
          .rlvr-group-rt { fill: #16191f; font: 600 12px sans-serif; text-anchor: middle; }
          .rlvr-group-axis { stroke: #879596; stroke-width: 1; stroke-dasharray: 4 3; }
          .rlvr-group-up { fill: #037f0c; }
          .rlvr-group-down { fill: #ec7211; }
          .rlvr-group-val { fill: #16191f; font: 600 12px sans-serif; text-anchor: middle; }
          .rlvr-group-rule { stroke: #d1d5db; stroke-width: 1; }
          .rlvr-group-grey { fill: #f4f4f4; stroke: #d1d5db; stroke-width: 1; }
          .rlvr-group-greyt { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .rlvr-group-greyv { fill: #5f6b7a; font: 600 12px sans-serif; text-anchor: middle; }
          .rlvr-group-box { fill: none; stroke: #879596; stroke-width: 1.2; stroke-dasharray: 5 4; }
          .rlvr-group-leg { fill: #414d5c; font: 11px sans-serif; }
        `}</style>
        <rect x={0} y={0} width={860} height={462} rx={8} fill="#ffffff" />

        {/* Prompt A */}
        <text x={16} y={26} className="rlvr-group-h">
          Prompt A: eight sampled answers, three pass the checker
        </text>
        <text x={16} y={44} className="rlvr-group-s">
          Mean reward 0.375, standard deviation 0.52. Each advantage is (reward - mean) / standard
          deviation.
        </text>
        {rowLabel(73, 'Answer')}
        {rowLabel(103, 'Reward')}
        {rowLabel(zeroY + 4, 'Advantage')}
        <line x1={140} y1={zeroY} x2={844} y2={zeroY} className="rlvr-group-axis" />
        {GROUP_A.map((r, i) => {
          const x = cx(i);
          const pass = r === 1;
          return (
            <g key={`a-${i}`}>
              <rect x={x - 38} y={58} width={76} height={22} rx={4} className="rlvr-group-ans" />
              <text x={x} y={73} className="rlvr-group-anst">
                {`Answer ${i + 1}`}
              </text>
              <rect
                x={x - 20}
                y={88}
                width={40}
                height={22}
                rx={4}
                className={pass ? 'rlvr-group-pass' : 'rlvr-group-fail'}
              />
              <text x={x} y={103} className="rlvr-group-rt">
                {r}
              </text>
              {pass ? (
                <>
                  <rect x={x - 15} y={zeroY - up} width={30} height={up} rx={2} className="rlvr-group-up" />
                  <text x={x} y={zeroY - up - 7} className="rlvr-group-val">
                    +1.21
                  </text>
                </>
              ) : (
                <>
                  <rect x={x - 15} y={zeroY} width={30} height={down} rx={2} className="rlvr-group-down" />
                  <text x={x} y={zeroY + down + 15} className="rlvr-group-val">
                    -0.72
                  </text>
                </>
              )}
            </g>
          );
        })}

        <line x1={16} y1={264} x2={844} y2={264} className="rlvr-group-rule" />

        {/* Prompt B */}
        <text x={16} y={288} className="rlvr-group-hg">
          Prompt B: eight sampled answers, all eight pass
        </text>
        <text x={16} y={306} className="rlvr-group-s">
          Mean 1, standard deviation 0, so every advantage is 0: this group adds no gradient to the
          step.
        </text>
        <rect x={136} y={313} width={710} height={95} rx={6} className="rlvr-group-box" />
        {rowLabel(333, 'Answer')}
        {rowLabel(363, 'Reward')}
        {rowLabel(395, 'Advantage')}
        {GROUP_A.map((_, i) => {
          const x = cx(i);
          return (
            <g key={`b-${i}`}>
              <rect x={x - 38} y={318} width={76} height={22} rx={4} className="rlvr-group-grey" />
              <text x={x} y={333} className="rlvr-group-greyt">
                {`Answer ${i + 1}`}
              </text>
              <rect x={x - 20} y={348} width={40} height={22} rx={4} className="rlvr-group-grey" />
              <text x={x} y={363} className="rlvr-group-greyv">
                1
              </text>
              <rect x={x - 20} y={380} width={40} height={22} rx={4} className="rlvr-group-grey" />
              <text x={x} y={395} className="rlvr-group-greyv">
                0
              </text>
            </g>
          );
        })}

        {/* Legend */}
        <line x1={16} y1={424} x2={844} y2={424} className="rlvr-group-rule" />
        <rect x={72} y={437} width={14} height={14} rx={2} className="rlvr-group-pass" />
        <text x={92} y={448} className="rlvr-group-leg">
          pass, reward 1
        </text>
        <rect x={203} y={437} width={14} height={14} rx={2} className="rlvr-group-fail" />
        <text x={223} y={448} className="rlvr-group-leg">
          fail, reward 0
        </text>
        <rect x={334} y={437} width={14} height={14} rx={2} className="rlvr-group-up" />
        <text x={354} y={448} className="rlvr-group-leg">
          made more likely
        </text>
        <rect x={477} y={437} width={14} height={14} rx={2} className="rlvr-group-down" />
        <text x={497} y={448} className="rlvr-group-leg">
          made less likely
        </text>
        <rect x={620} y={437} width={14} height={14} rx={2} className="rlvr-group-box" />
        <text x={640} y={448} className="rlvr-group-leg">
          advantage 0: no gradient
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Tables                                                                    */
/* ------------------------------------------------------------------------ */

interface SuccessorRow {
  id: string;
  term: ReactNode;
  change: ReactNode;
  without: ReactNode;
  source: ReactNode;
}

const SUCCESSOR_ROWS: SuccessorRow[] = [
  {
    id: 'norm',
    term: "Normalisers: divide by the answer's length and by the group's standard deviation",
    change: 'Dr. GRPO removes both',
    without: (
      <>
        The length divisor penalises long wrong answers less, so the model drifts toward them. The
        standard-deviation divisor gives questions nearly always or never solved more weight.
      </>
    ),
    source: (
      <Cite tier={3} href={DRG} venue="COLM 2025">
        Dr. GRPO, Section 3.1
      </Cite>
    ),
  },
  {
    id: 'clip',
    term: 'Clip bound',
    change: (
      <>
        DAPO (Decoupled Clip and Dynamic sAmpling Policy Optimization) splits it: 0.2 below, 0.28
        above, called Clip-Higher
      </>
    ),
    without: (
      <>
        With a symmetric 0.2, a token at probability 0.01 can rise only to 0.012 in one update, while
        a likely token is not held back, so the clip can restrain exploration; DAPO&apos;s naive GRPO
        run showed entropy collapse.
      </>
    ),
    source: (
      <Cite tier={3} href={DAPO} venue="NeurIPS 2025">
        DAPO, Sections 1, 3.1 and 4.1
      </Cite>
    ),
  },
  {
    id: 'kept',
    term: 'Which prompts are kept',
    change: (
      <>
        DAPO&apos;s dynamic sampling over-samples and keeps only prompts whose accuracy in the group
        is strictly between 0 and 1
      </>
    ),
    without: (
      <>
        An all-pass group has zero advantage and zero gradient; as more prompts get solved, fewer
        carry signal and the batch gradient gets noisier.
      </>
    ),
    source: (
      <Cite tier={3} href={DAPO} venue="NeurIPS 2025">
        DAPO, Section 3.2
      </Cite>
    ),
  },
  {
    id: 'agg',
    term: 'How token losses are averaged',
    change: "DAPO's token-level loss averages over every token in the batch",
    without: (
      <>
        Averaging within each answer first makes tokens in long answers count for less, so long,
        repetitive answers go under-penalised; DAPO saw entropy and length grow unhealthily.
      </>
    ),
    source: (
      <Cite tier={3} href={DAPO} venue="NeurIPS 2025">
        DAPO, Section 3.3
      </Cite>
    ),
  },
  {
    id: 'ratio',
    term: 'Token or sequence ratio',
    change: (
      <>
        GSPO (Group Sequence Policy Optimization) uses one length-normalised likelihood ratio per
        answer and clips whole answers
      </>
    ),
    without: (
      <>
        Each token&apos;s ratio rests on a single sample, and the noise builds up over long answers. In
        Qwen&apos;s MoE runs, GRPO needed a training strategy called Routing Replay to converge and
        GSPO did not.
      </>
    ),
    source: (
      <Cite tier={3} href={GSPO} venue="preprint">
        GSPO, Sections 3, 4.1 and 5.1
      </Cite>
    ),
  },
  {
    id: 'adv',
    term: 'Where the advantage is normalised',
    change: (
      <>
        REINFORCE++ normalises across the whole batch instead of per prompt. RLOO (REINFORCE
        Leave-One-Out) takes each answer&apos;s baseline from the other answers, the sampled baseline
        of section 4
      </>
    ),
    without: (
      <>
        REINFORCE++&apos;s authors argue that per-prompt normalisation is a biased estimator with a
        tendency to overfit.
      </>
    ),
    source: (
      <>
        <Cite tier={3} href={RPP} venue="preprint">
          REINFORCE++, abstract
        </Cite>{' '}
        <Cite tier={3} href={RLOO} venue="ACL 2024">
          RLOO, Section 2.3
        </Cite>
      </>
    ),
  },
];

interface KnobRow {
  id: string;
  term: ReactNode;
  trl: ReactNode;
  verl: ReactNode;
}

const KNOB_ROWS: KnobRow[] = [
  {
    id: 'g',
    term: 'Group size',
    trl: (
      <>
        <code>num_generations=8</code>{' '}
        <Cite tier={1} href={gh(TRL, TRL_TAG, TRL_CFG, 'L480-L481')}>
          grpo_config.py L480-L481
        </Cite>
      </>
    ),
    verl: (
      <>
        <code>actor_rollout_ref.rollout.n: 1</code>, commented &quot;&gt; 1 for grpo&quot;{' '}
        <Cite tier={1} href={gh(VERL, VERL_TAG, VERL_ROLLOUT, 'L126-L127')}>
          rollout.yaml L126-L127
        </Cite>
      </>
    ),
  },
  {
    id: 'est',
    term: 'Advantage method',
    trl: (
      <>
        Group mean, then group standard deviation, in <code>GRPOTrainer</code>; leave-one-out in{' '}
        <code>RLOOTrainer</code>{' '}
        <Cite tier={1} href={gh(TRL, TRL_TAG, TRL_RLOO, 'L1688-L1690')}>
          rloo_trainer.py L1688-L1690
        </Cite>
      </>
    ),
    verl: (
      <>
        <code>algorithm.adv_estimator: gae</code>, PPO with a critic; set <code>grpo</code>,{' '}
        <code>rloo</code> or <code>reinforce_plus_plus</code>{' '}
        <Cite tier={1} href={gh(VERL, VERL_TAG, VERL_PPO, 'L77-L78')}>
          ppo_trainer.yaml L77-L78
        </Cite>{' '}
        <Cite tier={1} href={gh(VERL, VERL_TAG, VERL_ALGOS, 'L97-L110')}>
          core_algos.py L97-L110
        </Cite>
      </>
    ),
  },
  {
    id: 'std',
    term: 'Standard-deviation divisor (Dr. GRPO)',
    trl: (
      <>
        <code>{'scale_rewards="group"'}</code>; set <code>{'"none"'}</code> to remove it, or{' '}
        <code>{'"batch"'}</code> to scale by the whole batch{' '}
        <Cite tier={1} href={gh(TRL, TRL_TAG, TRL_CFG, 'L227-L236')}>
          grpo_config.py L227-L236
        </Cite>
      </>
    ),
    verl: (
      <>
        <code>algorithm.norm_adv_by_std_in_grpo: True</code>; set <code>False</code>{' '}
        <Cite tier={1} href={gh(VERL, VERL_TAG, VERL_PPO, 'L80-L81')}>
          ppo_trainer.yaml L80-L81
        </Cite>
      </>
    ),
  },
  {
    id: 'len',
    term: 'Length divisor and token averaging',
    trl: (
      <>
        <code>{'loss_type="dapo"'}</code>, DAPO&apos;s token-level average; <code>{'"dr_grpo"'}</code>{' '}
        divides by a constant; <code>{'"grpo"'}</code> is the per-answer average{' '}
        <Cite tier={1} href={gh(TRL, TRL_TAG, TRL_CFG, 'L237-L248')}>
          grpo_config.py L237-L248
        </Cite>
      </>
    ),
    verl: (
      <>
        <code>actor_rollout_ref.actor.loss_agg_mode: token-mean</code>{' '}
        <Cite tier={1} href={gh(VERL, VERL_TAG, VERL_ACTOR, 'L85-L90')}>
          actor.yaml L85-L90
        </Cite>
        ; <code>seq-mean-token-sum-norm</code> divides by a fixed length, <code>loss_scale_factor</code>{' '}
        or, when that is unset, the response length of the loss mask: Dr. GRPO&apos;s form in our
        reading of the code{' '}
        <Cite tier={1} href={gh(VERL, VERL_TAG, VERL_ALGOS, 'L1180-L1193')} kind="code">
          core_algos.py L1180-L1193
        </Cite>
      </>
    ),
  },
  {
    id: 'clip',
    term: 'Clip bound (DAPO Clip-Higher)',
    trl: (
      <>
        <code>epsilon=0.2</code>; <code>epsilon_high</code> unset, so equal to it; set{' '}
        <code>epsilon_high=0.28</code>{' '}
        <Cite tier={1} href={gh(TRL, TRL_TAG, TRL_CFG, 'L693-L714')}>
          grpo_config.py L693-L714
        </Cite>
      </>
    ),
    verl: (
      <>
        <code>clip_ratio_low: 0.2</code>, <code>clip_ratio_high: 0.2</code>; set the high bound to
        0.28{' '}
        <Cite tier={1} href={gh(VERL, VERL_TAG, VERL_ACTOR, 'L38-L42')}>
          actor.yaml L38-L42
        </Cite>
      </>
    ),
  },
  {
    id: 'keep',
    term: 'Which prompts are kept (DAPO dynamic sampling)',
    trl: (
      <>
        Not supported{' '}
        <Cite tier={1} href={gh(TRL, TRL_TAG, TRL_IDX, 'L154-L164')}>
          paper_index.md L154-L164
        </Cite>
        ; <code>frac_reward_zero_std</code> reports the share of samples in silent groups{' '}
        <Cite tier={1} href={gh(TRL, TRL_TAG, TRL_DOC, 'L189')}>
          grpo_trainer.md L189
        </Cite>
      </>
    ),
    verl: (
      <>
        <code>algorithm.filter_groups.enable: False</code>; set <code>True</code>{' '}
        <Cite tier={1} href={gh(VERL, VERL_TAG, VERL_PPO, 'L83-L90')}>
          ppo_trainer.yaml L83-L90
        </Cite>
      </>
    ),
  },
  {
    id: 'seq',
    term: 'Token or sequence ratio (GSPO)',
    trl: (
      <>
        <code>{'importance_sampling_level="token"'}</code>; set <code>{'"sequence"'}</code>{' '}
        <Cite tier={1} href={gh(TRL, TRL_TAG, TRL_CFG, 'L760-L761')}>
          grpo_config.py L760-L761
        </Cite>{' '}
        together with <code>{'loss_type="grpo"'}</code>: with the default <code>{'"dapo"'}</code> the
        trainer warns that each answer is weighted by its length{' '}
        <Cite tier={1} href={gh(TRL, TRL_TAG, TRL_TR, 'L928-L934')}>
          grpo_trainer.py L928-L934
        </Cite>
      </>
    ),
    verl: (
      <>
        <code>actor_rollout_ref.actor.policy_loss.loss_mode: vanilla</code>; set <code>gspo</code>{' '}
        <Cite tier={1} href={gh(VERL, VERL_TAG, VERL_ACTOR, 'L60-L61')}>
          actor.yaml L60-L61
        </Cite>{' '}
        <Cite tier={1} href={gh(VERL, VERL_TAG, VERL_ALGOS, 'L1545-L1546')}>
          core_algos.py L1545-L1546
        </Cite>
      </>
    ),
  },
];

interface MtrlRow {
  id: string;
  setting: ReactNode;
  def: ReactNode;
  choices: ReactNode;
  term: ReactNode;
}

const MTRL_ROWS: MtrlRow[] = [
  {
    id: 'g',
    setting: <code>group_size</code>,
    def: '8',
    choices: '2 to 32',
    term: 'Answers per prompt, the group',
  },
  {
    id: 'adv',
    setting: <code>advantage_method</code>,
    def: <code>group_based</code>,
    choices: (
      <>
        Nine, among them <code>rloo</code>, <code>reinforce_pp</code> (REINFORCE++, in our reading of
        the identifier) and <code>grpo_passk</code>
      </>
    ),
    term: 'Where the baseline comes from and how it is normalised',
  },
  {
    id: 'loss',
    setting: <code>loss_fn</code>,
    def: <code>ppo</code>,
    choices: (
      <>
        <code>importance_sampling</code>, <code>ppo</code>, <code>cispo</code>
      </>
    ),
    term: "The loss the advantage feeds: PPO's clipped form or an alternative",
  },
  {
    id: 'clip',
    setting: (
      <>
        <code>clip_low_threshold</code>, <code>clip_high_threshold</code>
      </>
    ),
    def: '0.8, 1.2',
    choices: '0 to 1, 1 to 10',
    term: (
      <>
        The clip bound written as ratio limits, 1 - 0.2 and 1 + 0.2; DAPO&apos;s upper 0.28 would be
        1.28 (our arithmetic)
      </>
    ),
  },
  {
    id: 'batch',
    setting: <code>global_batch_size</code>,
    def: '128',
    choices: '32, 64, 128',
    term: (
      <>
        Prompts per step; rollouts per step are batch size times group size, 1,024 at the defaults
        (our arithmetic)
      </>
    ),
  },
];

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function RlvrAndGrpo() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Read the knobs on a managed GRPO job: which knob fixes which bias, and why always-solved prompts waste the step (TRL v1.16.0 and verl v0.9.1, read 2026-10-30)"
          >
            7. RLVR &amp; GRPO
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            RLVR (RL with verifiable rewards, where RL is reinforcement learning) uses a program as the
            reward: a rule that compares a boxed final answer with the reference, or a compiler that
            runs the code against predefined test cases{' '}
            <Cite tier={3} href={R1} venue="Nature 2025">
              DeepSeek-R1, Section 2.2
            </Cite>
            . With that reward and RL alone, DeepSeek-R1-Zero raised its pass@1, the chance that one
            sampled answer is correct, on AIME 2024 (a US competition-math exam whose answers are
            numbers) from 15.6% to 77.9%{' '}
            <Cite tier={3} href={R1} venue="Nature 2025">
              DeepSeek-R1, Section 2.3
            </Cite>
            . The algorithm behind that run is GRPO (Group Relative Policy Optimization), which samples
            a group of answers to each prompt and scores every answer against the rest of its group{' '}
            <Cite tier={3} href={R1} venue="Nature 2025">
              DeepSeek-R1, Section 2.1
            </Cite>{' '}
            <Cite tier={3} href={DSM} venue="preprint">
              DeepSeekMath, Section 4.1.1
            </Cite>
            .
          </Box>
          <Box variant="p">
            The challenge is to spend each step on prompts that can teach the model something. A
            checker hands out 0s and 1s, and GRPO learns only from the differences inside a group: a
            group whose answers all score the same gives every answer an advantage, its score
            relative to the group, of 0, and the step spends its rollouts on that prompt for no
            gradient{' '}
            <Cite tier={3} href={DAPO} venue="NeurIPS 2025">
              DAPO, Section 3.2
            </Cite>
            . On our DGX Spark run of the GRPO trainer in TRL (Transformers Reinforcement Learning,
            Hugging Face&apos;s post-training library), a 0.5B model on fresh arithmetic produced
            exactly zero loss on 9 of 20 steps in one run and 10 of 20 in the other{' '}
            <Cite tier={0} href={E0_URL}>
              E0 log: GRPO smoke test on a DGX Spark
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Know what a verifier checks, and on which base models RL from scratch has worked"
          >
            A program as the reward
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A verifier is a program that scores an answer with no model in the loop. DeepSeek-R1&apos;s
            rule-based reward has two parts, added with equal weight. The accuracy reward checks a math
            answer given in a fixed format, such as inside a box, by rule, and compiles code and runs it
            against predefined test cases. The format reward pays for putting the reasoning between{' '}
            <code>&lt;think&gt;</code> and <code>&lt;/think&gt;</code> tags{' '}
            <Cite tier={3} href={R1} venue="Nature 2025">
              DeepSeek-R1, Section 2.2, Eq. 4
            </Cite>
            . DeepSeek kept neural reward models out of its reasoning training, because they were open
            to reward hacking during large-scale RL and cost substantial compute to retrain{' '}
            <Cite tier={3} href={R1} venue="Nature 2025">
              DeepSeek-R1, Section 2.2
            </Cite>
            . Section 10, The Reward Is a Proxy, takes up what a checker can still miss.
          </Box>
          <Box variant="p">
            DeepSeek-R1-Zero applied that reward to DeepSeek-V3-Base with no supervised fine-tuning
            first{' '}
            <Cite tier={3} href={R1} venue="Nature 2025">
              DeepSeek-R1, Section 1
            </Cite>
            . Its average pass@1 on AIME 2024 rose from 15.6% to 77.9% over the run, and reached 86.7%
            with self-consistency, a majority vote over several samples{' '}
            <Cite tier={3} href={R1} venue="Nature 2025">
              DeepSeek-R1, Section 2.3, Figure 1
            </Cite>
            . The paper&apos;s first arXiv version reported 71.0%; the second arXiv version and the
            Nature paper report 77.9%{' '}
            <Cite tier={3} href={R1V1} venue="preprint">
              DeepSeek-R1 v1, Section 2.2.4
            </Cite>
            .
          </Box>
          <Box variant="p">
            The result depends on the base. In DeepSeek&apos;s early experiments, RL from a base model failed
            to give meaningful AIME gains on a 7B dense and a 16B MoE (mixture of experts) base, which
            drifted into repetition as their responses grew, and worked on a 32B dense base (Qwen&apos;s)
            and on 230B and 671B MoE bases. DeepSeek recommends that work testing RL from scratch use
            sufficiently large and expressive models{' '}
            <Cite tier={3} href={R1} venue="Nature 2025">
              DeepSeek-R1, Supplementary G.1
            </Cite>
            .
          </Box>
          <Box variant="p">
            For a 32B model, distillation was the stronger path. Qwen2.5-32B-Base after more than
            10,000 RL steps reached 47.0 pass@1 on AIME 2024, on par with QwQ-32B-Preview;
            DeepSeek-R1-Distill-Qwen-32B, fine-tuned on R1&apos;s outputs with no RL stage, reached 72.6
            and led on every benchmark in the comparison{' '}
            <Cite tier={3} href={R1} venue="Nature 2025">
              DeepSeek-R1, Supplementary F.1, Table 16
            </Cite>
            .
          </Box>
          <Box variant="p">
            A 7B math base did respond to RL, in DeepSeek&apos;s own later run on Qwen2-Math-7B{' '}
            <Cite tier={3} href={R1} venue="Nature 2025">
              DeepSeek-R1, Supplementary F.1, Table 17
            </Cite>{' '}
            and in other work. The minimal recipe of Dr. GRPO (GRPO Done Right), a variant the next
            blocks return to, took
            Qwen2.5-Math-7B to 43.3% on AIME 2024 in 27 hours on 8 A100 GPUs{' '}
            <Cite tier={3} href={DRG} venue="COLM 2025">
              Dr. GRPO, abstract and Section 1
            </Cite>
            . That base family is a special case: GRPO with randomly assigned rewards raised
            Qwen2.5-Math-7B&apos;s score on MATH-500 (500 competition-math problems) by 21.4 points,
            and spurious rewards that help Qwen models often fail on Llama 3 and OLMo 2{' '}
            <Cite tier={3} href={SPUR} venue="ICML 2026">
              Spurious Rewards, abstract
            </Cite>
            . Section 8, What RL Does to a Model, reads these results as pass@k curves, where
            pass@k is the chance that at least one of k samples is correct.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Work out a GRPO advantage by hand, and spot the groups that give the update nothing"
          >
            GRPO scores each answer against its own group
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            GRPO is the sampled-baseline route of section 4, Policy Gradient. For each prompt it samples
            a group of G answers from the current model and scores each one. Every answer then gets an
            advantage, how much better it did than the group expected: its reward minus the
            group&apos;s mean reward, divided by the group&apos;s standard deviation. Every token of the
            answer carries that same advantage{' '}
            <Cite tier={3} href={DSM} venue="preprint">
              DeepSeekMath, Section 4.1.2
            </Cite>
            . Using the group as the baseline removes the critic, the value network that PPO (Proximal
            Policy Optimization) trains next to the policy, typically a model of comparable size{' '}
            <Cite tier={3} href={DSM} venue="preprint">
              DeepSeekMath, Section 4.1.1
            </Cite>
            .
          </Box>
          <Box variant="p">
            <code>A_i = (r_i - mean(r_1, ..., r_G)) / std(r_1, ..., r_G)</code>
          </Box>
          <Box variant="p">
            The objective then averages the per-token loss over each answer&apos;s tokens, dividing by
            the answer&apos;s length, and over the G answers{' '}
            <Cite tier={3} href={DSM} venue="preprint">
              DeepSeekMath, Eq. 3
            </Cite>
            . Those two divisors, the answer&apos;s length and the group&apos;s standard deviation, are
            the first terms the successors in the next block change.
          </Box>
          <GroupAdvantageDiagram />
          <Box variant="small" color="text-body-secondary">
            Illustrative, not measured: invented rewards for two prompts. The standard deviation is the
            sample standard deviation, divided by G - 1, as TRL v1.16.0 and verl v0.9.1 compute it{' '}
            <Cite tier={1} href={gh(TRL, TRL_TAG, 'trl/trainer/utils.py', 'L1021-L1044')}>
              TRL utils.py L1021-L1044
            </Cite>{' '}
            <Cite tier={1} href={gh(VERL, VERL_TAG, VERL_ALGOS, 'L319-L321')}>
              verl core_algos.py L319-L321
            </Cite>
            . A group in which all eight answers fail also gets an advantage of 0 everywhere.
          </Box>
          <Box variant="p">
            Read prompt A first. Three of eight answers pass, so the mean reward is 0.375 and the
            standard deviation 0.52. A passing answer sits 0.625 above the mean, 1.21 standard
            deviations, and a failing one sits 0.72 standard deviations below it. Prompt B&apos;s eight
            answers all pass: every reward equals the mean, and every advantage is 0. A zero advantage
            gives zero policy gradient{' '}
            <Cite tier={3} href={DAPO} venue="NeurIPS 2025">
              DAPO, Section 3.2
            </Cite>
            . TRL&apos;s defaults switch off the KL (Kullback-Leibler divergence) penalty of section 5
            and the entropy bonus, so under them prompt B adds no gradient to the step{' '}
            <Cite tier={1} href={gh(TRL, TRL_TAG, TRL_CFG, 'L681-L687')}>
              grpo_config.py L681-L687
            </Cite>{' '}
            <Cite tier={1} href={gh(TRL, TRL_TAG, TRL_CFG, 'L876-L877')}>
              grpo_config.py L876-L877
            </Cite>
            . Its tokens still count in the default loss&apos;s divisor, the number of completion
            tokens in the batch, so a silent group also shrinks the update the other groups make{' '}
            <Cite tier={1} href={gh(TRL, TRL_TAG, TRL_TR, 'L2497-L2498')}>
              grpo_trainer.py L2497-L2498
            </Cite>{' '}
            <Cite tier={1} href={gh(TRL, TRL_TAG, TRL_TR, 'L3168-L3173')}>
              grpo_trainer.py L3168-L3173
            </Cite>
            .
          </Box>
          <Box variant="p">
            Eight is the default group size in TRL&apos;s GRPO trainer{' '}
            <Cite tier={1} href={gh(TRL, TRL_TAG, TRL_CFG, 'L480-L481')}>
              grpo_config.py L480-L481
            </Cite>{' '}
            and in SageMaker AI multi-turn RL{' '}
            <Cite tier={1} href={MTRL}>
              SageMaker AI multi-turn RL hyperparameters reference
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Read a method's name as the GRPO term it changes and the tilt it removes"
          >
            Each successor changes one term of GRPO
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Each method below keeps GRPO&apos;s loop (sample a group, score it, weight each answer by
            its advantage) and changes one term. &quot;Bias&quot; in this table means a
            systematic tilt in the objective, a different sense from the statistical bias of section 4.
            Two terms from section 5 recur. The probability ratio is a token&apos;s probability under the
            model being updated divided by its probability when the answer was sampled, and the clip is
            PPO&apos;s limit on how far one update may push that ratio. Entropy measures how spread out
            the next-token distribution is.
          </Box>
          <Table
            variant="embedded"
            wrapLines
            trackBy="id"
            items={SUCCESSOR_ROWS}
            columnDefinitions={[
              { id: 'term', header: 'GRPO term', cell: (r) => r.term, minWidth: 150 },
              { id: 'change', header: 'The change', cell: (r) => r.change, minWidth: 220 },
              { id: 'without', header: 'What it addresses', cell: (r) => r.without, minWidth: 260 },
              { id: 'source', header: 'Source', cell: (r) => r.source, minWidth: 170 },
            ]}
          />
          <Box variant="p">
            Read the response-length curve with the loss in mind: Dr. GRPO&apos;s authors argue that
            GRPO&apos;s length growth is partly the length divisor at work, and their version kept
            length from growing wildly during training{' '}
            <Cite tier={3} href={DRG} venue="COLM 2025">
              Dr. GRPO, Section 3.2
            </Cite>
            . Check how your trainer averages the loss before you read a growing length as longer
            reasoning.
          </Box>
          <ExpandableSection headerText="Evidence: what each DAPO change did in one ablation, and GSPO's mixture-of-experts case">
            <SpaceBetween size="s">
              <Box variant="p">
                DAPO&apos;s authors added their changes one at a time to GRPO on a Qwen2.5-32B base and
                report AIME 2024 accuracy averaged over 32 samples: naive GRPO 30, then 36 with overlong
                filtering, 38 with Clip-Higher, 41 with a soft penalty for overlong answers, 42 with the
                token-level loss and 50 with dynamic sampling, against 47 for DeepSeek&apos;s
                R1-Zero-Qwen-32B{' '}
                <Cite tier={3} href={DAPO} venue="NeurIPS 2025">
                  DAPO, Table 1
                </Cite>
                . Dynamic sampling draws more samples per batch; the authors report that convergence
                still took less time, because fewer training steps were needed{' '}
                <Cite tier={3} href={DAPO} venue="NeurIPS 2025">
                  DAPO, Sections 3.2 and 4.2, Figure 6
                </Cite>
                . One base model and one benchmark.
              </Box>
              <Box variant="p">
                GSPO&apos;s case comes from Qwen&apos;s own training. On Qwen3-30B-A3B, about 10% of
                the experts a token activates change after each gradient update, which makes per-token
                ratios unstable; GSPO clipped about two orders of magnitude more tokens than GRPO and
                still trained more efficiently, without Routing Replay{' '}
                <Cite tier={3} href={GSPO} venue="preprint">
                  GSPO, Sections 5.1 to 5.3
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
            description="Know the GRPO your framework runs by default, and the setting that turns each fix on"
          >
            What a trainer runs when you ask for GRPO
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Defaults move between releases, so the tag matters. At TRL v1.16.0, <code>GRPOTrainer</code>{' '}
            runs a hybrid: DAPO&apos;s token-level average (<code>{'loss_type="dapo"'}</code>){' '}
            <Cite tier={1} href={gh(TRL, TRL_TAG, TRL_CFG, 'L801-L802')}>
              grpo_config.py L801-L802
            </Cite>{' '}
            with GRPO&apos;s per-group standard deviation (<code>{'scale_rewards="group"'}</code>){' '}
            <Cite tier={1} href={gh(TRL, TRL_TAG, TRL_CFG, 'L789-L790')}>
              grpo_config.py L789-L790
            </Cite>{' '}
            and no KL term{' '}
            <Cite tier={1} href={gh(TRL, TRL_TAG, TRL_CFG, 'L681-L687')}>
              grpo_config.py L681-L687
            </Cite>
            . At verl v0.9.1, the default is PPO with a critic, <code>adv_estimator: gae</code>{' '}
            <Cite tier={1} href={gh(VERL, VERL_TAG, VERL_PPO, 'L77-L78')}>
              ppo_trainer.yaml L77-L78
            </Cite>
            , with one answer per prompt{' '}
            <Cite tier={1} href={gh(VERL, VERL_TAG, VERL_ROLLOUT, 'L126-L127')}>
              rollout.yaml L126-L127
            </Cite>
            .
          </Box>
          <Box variant="p">
            A full Dr. GRPO setup in TRL needs two settings together. <code>{'loss_type="dr_grpo"'}</code>{' '}
            divides the summed token loss by a constant, the batch size times{' '}
            <code>max_completion_length</code>, which removes the length divisor;{' '}
            <code>{'scale_rewards="none"'}</code> removes the standard-deviation divisor. Either one
            alone leaves the other tilt in place{' '}
            <Cite tier={1} href={gh(TRL, TRL_TAG, TRL_TR, 'L2785-L2787')}>
              grpo_trainer.py L2785-L2787
            </Cite>{' '}
            <Cite tier={1} href={gh(TRL, TRL_TAG, TRL_TR, 'L3163-L3164')}>
              grpo_trainer.py L3163-L3164
            </Cite>
            . TRL&apos;s paper index gives a Dr. GRPO recipe that sets only{' '}
            <code>{'loss_type="dr_grpo"'}</code>{' '}
            <Cite tier={1} href={gh(TRL, TRL_TAG, TRL_IDX, 'L297-L313')} kind="doc-code-conflict">
              paper_index.md L297-L313
            </Cite>
            , which leaves <code>scale_rewards</code> at its default <code>{'"group"'}</code> and the
            standard-deviation divisor on{' '}
            <Cite tier={1} href={gh(TRL, TRL_TAG, TRL_CFG, 'L789-L790')}>
              grpo_config.py L789-L790
            </Cite>
            .
          </Box>
          <Box variant="p">
            On verl, switching to GRPO means setting the group size as well. With one answer per
            prompt, verl&apos;s GRPO estimator gives that group a mean of 0 and a standard deviation of
            1, so the advantage is the raw reward with no group baseline, in our reading of the code{' '}
            <Cite tier={1} href={gh(VERL, VERL_TAG, VERL_ALGOS, 'L315-L327')} kind="code">
              core_algos.py L315-L327
            </Cite>
            . The table maps each term onto its setting in both frameworks.
          </Box>
          <Table
            variant="embedded"
            wrapLines
            trackBy="id"
            items={KNOB_ROWS}
            columnDefinitions={[
              { id: 'term', header: 'Term', cell: (r) => r.term, minWidth: 150 },
              { id: 'trl', header: 'TRL v1.16.0: default, then the fix', cell: (r) => r.trl, minWidth: 260 },
              { id: 'verl', header: 'verl v0.9.1: default, then the fix', cell: (r) => r.verl, minWidth: 260 },
            ]}
          />
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Find the group size, the advantage method and the clip range in a Bedrock or SageMaker AI job"
          >
            The same knobs on a managed job
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Amazon Bedrock RFT (reinforcement fine-tuning) generates several responses per prompt,
            scores them with your reward function and trains with GRPO{' '}
            <Cite tier={1} href={BEDROCK_RFT}>
              Bedrock user guide: reinforcement fine-tuning
            </Cite>
            . The job request carries the group size as <code>trainingSamplePerPrompt</code>, next to
            batch size, epochs, learning rate, length limits and reasoning effort; the documented
            request sets 4 samples per prompt, as an example value rather than a default{' '}
            <Cite tier={1} href={BEDROCK_JOB}>
              Bedrock user guide: create an RFT job
            </Cite>
            .
          </Box>
          <Box variant="p">
            SageMaker AI multi-turn RL exposes more of this section&apos;s terms as named settings{' '}
            <Cite tier={1} href={MTRL}>
              SageMaker AI multi-turn RL hyperparameters reference
            </Cite>
            . The page gives the identifiers; the right-hand column is our mapping onto the terms above.
          </Box>
          <Table
            variant="embedded"
            wrapLines
            trackBy="id"
            items={MTRL_ROWS}
            columnDefinitions={[
              { id: 'setting', header: 'Setting', cell: (r) => r.setting, minWidth: 250 },
              { id: 'def', header: 'Default', cell: (r) => r.def, minWidth: 100 },
              { id: 'choices', header: 'Choices', cell: (r) => r.choices, minWidth: 220 },
              { id: 'term', header: 'Term in this section', cell: (r) => r.term, minWidth: 240 },
            ]}
          />
          <Box variant="p">
            AWS suggests <code>importance_sampling</code> for a team new to multi-turn RL, and calls PPO
            with clip thresholds of 0.8 and 1.2 the safe baseline for any first run{' '}
            <Cite tier={1} href={MTRL}>
              SageMaker AI multi-turn RL hyperparameters reference
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Estimate before a run how much of each step will carry no gradient, from one number you can measure today"
          >
            Always-solved and never-solved prompts waste the step
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A group whose answers all earn the same reward contributes no gradient, whether every
            answer passed or every answer failed{' '}
            <Cite tier={3} href={DAPO} venue="NeurIPS 2025">
              DAPO, Section 3.2
            </Cite>{' '}
            <Cite tier={1} href={MTRL}>
              SageMaker AI multi-turn RL hyperparameters reference
            </Cite>
            , yet each such prompt still costs a full group of rollouts. In
            DAPO&apos;s run the share of always-solved prompts grew as training went on: as the model solved more
            prompts, fewer prompts per batch carried signal and the batch gradient got noisier, which is
            why DAPO refills each batch with prompts whose accuracy is strictly between 0 and 1{' '}
            <Cite tier={3} href={DAPO} venue="NeurIPS 2025">
              DAPO, Section 3.2
            </Cite>
            .
          </Box>
          <Box variant="p">
            Our DGX Spark run shows the mechanism on a live trainer: Qwen2.5-0.5B-Instruct, full
            fine-tuning, fresh synthetic arithmetic of the form (a + b) * c - d scored 1 for the exact
            integer, 2 prompts with 8 answers each per step, TRL v1.16.0 defaults for the loss, the KL
            term and the reward scaling, seed 0, two runs. The mean reward was 0.044, a base rate of
            about 4%. On 9 of 20 steps in the first run and 10 of
            20 in the second, both groups scored all zero, TRL&apos;s <code>frac_reward_zero_std</code>{' '}
            read 1.0, and the loss was exactly 0.0: those steps produced no gradient{' '}
            <Cite tier={0} href={E0_URL}>
              E0 log: GRPO smoke test on a DGX Spark
            </Cite>
            . Counting groups instead of steps, 28 of 40 groups in the first run and 29 of 40 in the
            second had no spread in reward{' '}
            <Cite tier={0} href={E0_RUN1}>
              E0 run 1 step log
            </Cite>{' '}
            <Cite tier={0} href={E0_RUN2}>
              E0 run 2 step log
            </Cite>
            . Twenty steps at a learning rate of 1e-6 test the mechanism; the reward did not move and
            was not expected to.
          </Box>
          <Box variant="p">
            The base rate predicts that share. If every prompt had the same chance p that one answer
            passes, and answers were independent, a group of G answers would carry no gradient with
            probability <code>p^G + (1 - p)^G</code>. At p = 0.044 and G = 8 that is 0.70, consistent
            with the 28 and 29 of 40 groups in the logs, and both groups of a step are silent with
            probability 0.70 x 0.70 = 0.49, about 10 steps in 20 (our arithmetic on the E0 figures).
            Prompts of mixed difficulty each have their own p, so apply the formula per prompt.
          </Box>
          <ExpandableSection headerText="Our arithmetic: share of groups with no gradient, by base rate and group size">
            <SpaceBetween size="s">
              <Table
                variant="embedded"
                wrapLines
                trackBy="p"
                items={[
                  { p: '1% or 99%', g8: '92%', g16: '85%' },
                  { p: '4.4% (E0)', g8: '70%', g16: '49%' },
                  { p: '10% or 90%', g8: '43%', g16: '19%' },
                  { p: '30% or 70%', g8: '6%', g16: '0.3%' },
                  { p: '50%', g8: '0.8%', g16: 'under 0.01%' },
                ]}
                columnDefinitions={[
                  { id: 'p', header: 'Chance one answer passes', cell: (r) => r.p, minWidth: 94 },
                  { id: 'g8', header: 'No gradient, G = 8', cell: (r) => r.g8, minWidth: 107 },
                  { id: 'g16', header: 'No gradient, G = 16', cell: (r) => r.g16, minWidth: 107 },
                ]}
              />
              <Box variant="p">
                Computed from <code>p^G + (1 - p)^G</code>, assuming one rate for the prompt and
                independent answers. The curve is symmetric: a prompt solved 99% of the time is as
                silent as one solved 1% of the time. Doubling the group cuts the silent share sharply for
                prompts solved 10% to 90% of the time and barely moves it at 1% or 99%, where the
                always-solved and never-solved prompts sit.
                For sparse rewards, SageMaker AI&apos;s guidance is a moderate group size with a larger
                batch or more steps, or a lower learning rate, because each step&apos;s useful gradient
                is diluted{' '}
                <Cite tier={1} href={MTRL}>
                  SageMaker AI multi-turn RL hyperparameters reference
                </Cite>
                .
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <Box variant="p">
            During a run, <code>frac_reward_zero_std</code> is the number to watch in TRL: the fraction
            of samples whose group has zero reward spread, all answers correct or all incorrect{' '}
            <Cite tier={1} href={gh(TRL, TRL_TAG, TRL_DOC, 'L189')}>
              TRL docs, grpo_trainer.md L189
            </Cite>
            . TRL does not support DAPO&apos;s dynamic sampling{' '}
            <Cite tier={1} href={gh(TRL, TRL_TAG, TRL_IDX, 'L154-L164')}>
              paper_index.md L154-L164
            </Cite>
            ; verl has it as <code>algorithm.filter_groups.enable</code>, off by default{' '}
            <Cite tier={1} href={gh(VERL, VERL_TAG, VERL_PPO, 'L83-L90')}>
              ppo_trainer.yaml L83-L90
            </Cite>
            .
          </Box>
          <Box variant="p">
            Before you pay for a run, sample a group of answers from the starting model for each
            training prompt at your planned group size, score them with the grader you will train on,
            and count the prompts that pass every time or never. On the E0 figures, a 4% base rate left
            9 and 10 of 20 steps with no gradient at all; your count tells you how much of your run
            would do the same. Drop or replace those prompts, or filter them during training.
            Section 22, Choosing a Text Loop, a Hybrid or a Weight Update, turns the same measurement
            into its second decision question: what the model scores on your signal today.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
