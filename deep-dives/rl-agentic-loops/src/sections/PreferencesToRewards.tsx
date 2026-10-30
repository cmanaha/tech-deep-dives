import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Badge from '@cloudscape-design/components/badge';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Table from '@cloudscape-design/components/table';
import { Cite, arxiv, gh, TRL_TAG, TRL_PPO_TAG } from '../components/Cite';

/* ------------------------------------------------------------------------ */
/* Sources                                                                  */
/* ------------------------------------------------------------------------ */

/** Ouyang et al., InstructGPT. */
const INSTRUCTGPT = arxiv('2203.02155v1');
/** Christiano et al., deep RL from human preferences (Bradley-Terry and the Elo analogy). */
const CHRISTIANO = arxiv('1706.03741v4');
/** Rafailov et al., Direct Preference Optimization. */
const DPO = arxiv('2305.18290v3');
/** Ahmadian et al., Back to Basics (REINFORCE and RLOO for RLHF). */
const BACK_TO_BASICS = arxiv('2402.14740v2');
/** Shao et al., DeepSeekMath (the unified paradigm, Table 10 and Appendix A.1). */
const DEEPSEEKMATH = arxiv('2402.03300v3');
/** Xu et al., Is DPO Superior to PPO for LLM Alignment? */
const XU = arxiv('2404.10719v3');
/** Ivison et al., Unpacking DPO and PPO (the controlled 13B comparison). */
const IVISON = arxiv('2406.09279v2');
const IPO = arxiv('2310.12036v2');
const KTO = arxiv('2402.01306v5');
const ORPO = arxiv('2403.07691v2');
const SIMPO = arxiv('2405.14734v3');
/** Bai et al., Constitutional AI. */
const CAI = arxiv('2212.08073v1');
/** Lee et al., RLAIF versus RLHF. */
const RLAIF = arxiv('2309.00267v3');
/** First-party lab reports. */
const LLAMA3 = arxiv('2407.21783v3');
const QWEN3 = arxiv('2505.09388v1');
const GEMMA3 = arxiv('2503.19786v1');
const OPENAI_RFT = 'https://developers.openai.com/api/docs/guides/reinforcement-fine-tuning';
const SM_CUSTOMIZE = 'https://docs.aws.amazon.com/sagemaker/latest/dg/customizing-models.html';
const SM_OPEN_WEIGHT =
  'https://docs.aws.amazon.com/sagemaker/latest/dg/model-customize-open-weight.html';

function trl(path: string, lines?: string): string {
  return gh('huggingface/trl', TRL_TAG, `trl/trainer/${path}`, lines);
}

/* ------------------------------------------------------------------------ */
/* Diagram: the RLHF pipeline beside DPO's single stage                     */
/* ------------------------------------------------------------------------ */

function PipelinesDiagram() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 860 452"
        role="img"
        aria-labelledby="pref-pipe-title"
        style={{ width: '100%', minWidth: 640, height: 'auto' }}
      >
        <title id="pref-pipe-title">
          RLHF and DPO start from the same SFT model and the same preference pairs. RLHF uses the
          pairs to train a reward model, then runs PPO: it samples fresh responses from the policy,
          scores them with the reward model minus a KL penalty to the SFT model, and holds up to four
          models in memory (policy, reference, critic and reward model). DPO trains the policy on
          the pairs directly with one classification loss that raises the preferred response and
          lowers the rejected one relative to the reference, with no reward model, no critic and no
          sampling during training; it needs the policy plus the reference model&apos;s
          log-probabilities, which can be computed in advance.
        </title>
        <style>{`
          .pref-pipe-lane { fill: #414d5c; font: 600 13px sans-serif; }
          .pref-pipe-sft { fill: #f4f4f4; stroke: #879596; stroke-width: 1.5; }
          .pref-pipe-rlhf { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .pref-pipe-dpo { fill: #ecf7ec; stroke: #037f0c; stroke-width: 1.5; }
          .pref-pipe-pairs { fill: #e6f4f2; stroke: #1f7a70; stroke-width: 1.5; }
          .pref-pipe-mem { fill: #fbf3d5; stroke: #8b6c00; stroke-width: 1; }
          .pref-pipe-t { fill: #16191f; font: 600 13px sans-serif; text-anchor: middle; }
          .pref-pipe-s { fill: #414d5c; font: 11px sans-serif; text-anchor: middle; }
          .pref-pipe-mt { fill: #6b5300; font: 600 11px sans-serif; text-anchor: middle; }
          .pref-pipe-ms { fill: #6b5300; font: 11px sans-serif; text-anchor: middle; }
          .pref-pipe-mb { font-weight: 600; }
          .pref-pipe-edge { fill: #5f6b7a; font: 11px sans-serif; }
          .pref-pipe-arr { stroke: #5f6b7a; stroke-width: 1.5; fill: none; }
        `}</style>
        <defs>
          <marker
            id="pref-pipe-ah"
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="4"
            orient="auto-start-reverse"
            markerUnits="userSpaceOnUse"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill="#5f6b7a" />
          </marker>
        </defs>

        <rect x={0} y={0} width={860} height={452} rx={8} fill="#ffffff" />

        {/* RLHF lane */}
        <text x={20} y={28} className="pref-pipe-lane">
          RLHF: three stages
        </text>

        <rect x={20} y={40} width={220} height={96} rx={6} className="pref-pipe-sft" />
        <text x={130} y={66} className="pref-pipe-t">
          1. Supervised fine-tuning
        </text>
        <text x={130} y={88} className="pref-pipe-s">
          train on demonstrations
        </text>
        <text x={130} y={106} className="pref-pipe-s">
          output: the SFT model
        </text>

        <line x1={240} y1={88} x2={284} y2={88} className="pref-pipe-arr" markerEnd="url(#pref-pipe-ah)" />

        <rect x={290} y={40} width={240} height={96} rx={6} className="pref-pipe-rlhf" />
        <text x={410} y={66} className="pref-pipe-t">
          2. Reward model
        </text>
        <text x={410} y={88} className="pref-pipe-s">
          fit to pairwise preferences
        </text>
        <text x={410} y={106} className="pref-pipe-s">
          with a Bradley-Terry loss
        </text>
        <text x={410} y={124} className="pref-pipe-s">
          output: one score per answer
        </text>

        <line x1={530} y1={88} x2={574} y2={88} className="pref-pipe-arr" markerEnd="url(#pref-pipe-ah)" />

        <rect x={580} y={40} width={260} height={96} rx={6} className="pref-pipe-rlhf" />
        <text x={710} y={66} className="pref-pipe-t">
          3. PPO against the scores
        </text>
        <text x={710} y={88} className="pref-pipe-s">
          fresh samples from the policy,
        </text>
        <text x={710} y={106} className="pref-pipe-s">
          scored by the reward model,
        </text>
        <text x={710} y={124} className="pref-pipe-s">
          minus a KL penalty to SFT
        </text>

        <rect x={580} y={146} width={260} height={46} rx={4} className="pref-pipe-mem" />
        <text x={710} y={165} className="pref-pipe-mt">
          In memory: up to 4 models,
        </text>
        <text x={710} y={182} className="pref-pipe-ms">
          policy, reference, critic, reward model
        </text>

        {/* Shared input */}
        <rect x={290} y={200} width={240} height={72} rx={6} className="pref-pipe-pairs" />
        <text x={410} y={224} className="pref-pipe-t">
          Preference pairs
        </text>
        <text x={410} y={243} className="pref-pipe-s">
          prompt, preferred, rejected
        </text>
        <text x={410} y={260} className="pref-pipe-s">
          ranked by people or an AI judge
        </text>

        <line x1={410} y1={198} x2={410} y2={140} className="pref-pipe-arr" markerEnd="url(#pref-pipe-ah)" />
        <text x={420} y={174} className="pref-pipe-edge">
          train the reward model
        </text>

        <line x1={410} y1={274} x2={410} y2={318} className="pref-pipe-arr" markerEnd="url(#pref-pipe-ah)" />
        <text x={420} y={300} className="pref-pipe-edge">
          train the policy on them directly
        </text>

        {/* DPO lane */}
        <text x={20} y={306} className="pref-pipe-lane">
          DPO: one stage after SFT
        </text>

        <rect x={20} y={322} width={220} height={80} rx={6} className="pref-pipe-sft" />
        <text x={130} y={348} className="pref-pipe-t">
          1. Supervised fine-tuning
        </text>
        <text x={130} y={370} className="pref-pipe-s">
          the same first stage
        </text>
        <text x={130} y={388} className="pref-pipe-s">
          output: the SFT model
        </text>

        <line x1={240} y1={362} x2={284} y2={362} className="pref-pipe-arr" markerEnd="url(#pref-pipe-ah)" />

        <rect x={290} y={322} width={550} height={80} rx={6} className="pref-pipe-dpo" />
        <text x={565} y={348} className="pref-pipe-t">
          2. DPO: one classification loss on the pairs
        </text>
        <text x={565} y={370} className="pref-pipe-s">
          raise the preferred answer, lower the rejected one, relative to the reference
        </text>
        <text x={565} y={388} className="pref-pipe-s">
          no reward model, no critic, no sampling during training
        </text>

        <rect x={290} y={410} width={550} height={30} rx={4} className="pref-pipe-mem" />
        <text x={565} y={429} className="pref-pipe-ms">
          <tspan className="pref-pipe-mb">In memory:</tspan> the policy, plus reference
          log-probabilities (computable in advance)
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* The gradient table, complete                                             */
/* ------------------------------------------------------------------------ */

interface GradientRow {
  id: string;
  method: string;
  isNew: boolean;
  source: string;
  scorer: string;
  weight: string;
}

/** Rows 1 to 5 repeat section 5's table word for word; row 6 is this section's. */
const GRADIENT_ROWS: GradientRow[] = [
  {
    id: 'sft',
    method: 'SFT',
    isNew: false,
    source: 'Fixed targets from a dataset',
    scorer: 'None',
    weight: '1 for every target token',
  },
  {
    id: 'reinforce',
    method: 'REINFORCE',
    isNew: false,
    source: "The current policy's own samples",
    scorer: 'Any reward',
    weight: 'The reward that followed',
  },
  {
    id: 'rsft',
    method: 'Rejection-sampling fine-tuning',
    isNew: false,
    source: "The model's own samples",
    scorer: 'A grader that passes or fails each one',
    weight: '1 if it passed, 0 if not',
  },
  {
    id: 'grpo',
    method: 'RLOO or GRPO',
    isNew: false,
    source: 'Several samples per prompt from the current policy',
    scorer: 'A reward model or a program',
    weight: 'The reward relative to the other samples of the same prompt',
  },
  {
    id: 'ppo',
    method: 'PPO',
    isNew: false,
    source: "The current policy's own samples, one batch at a time",
    scorer: 'A reward model, minus a per-token KL penalty to the reference model',
    weight:
      'The advantage from a learned critic (GAE), times the probability ratio clipped to 1 ± epsilon',
  },
  {
    id: 'dpo',
    method: 'DPO',
    isNew: true,
    source:
      'Fixed pairs, sampled once from the SFT model or taken from an existing dataset; nothing is sampled during training',
    scorer:
      'A preference label on each pair, given before training: a person, an AI judge, or a rule in math tasks',
    weight:
      'Positive on the preferred response and negative on the rejected one, larger when the model currently ranks the pair the wrong way',
  },
];

function GradientTable() {
  return (
    <Table
      variant="embedded"
      wrapLines
      trackBy="id"
      items={GRADIENT_ROWS}
      columnDefinitions={[
        {
          id: 'method',
          header: 'Method',
          cell: (r) =>
            r.isNew ? (
              <>
                <Box variant="strong" display="inline">
                  {r.method}
                </Box>{' '}
                <Badge color="blue">added here</Badge>
              </>
            ) : (
              r.method
            ),
        },
        { id: 'source', header: 'Sample source', cell: (r) => r.source },
        { id: 'scorer', header: 'Scorer', cell: (r) => r.scorer },
        { id: 'weight', header: 'Weight on the log-probability gradient', cell: (r) => r.weight },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function PreferencesToRewards() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Turn preference data you already collect into a weight update, and tell when offline DPO (Direct Preference Optimization) is enough (TRL v1.12.0 and v1.16.0, papers read 2026-10-30)"
          >
            6. From Preferences to Rewards
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A reviewer who picks the better of two drafts, or a user who keeps one answer and
            regenerates another, produces a preference: which of two responses is better, with no
            score attached. Two standard routes lead from such pairs to a weight update: RLHF, RL
            (reinforcement learning) from human feedback, and DPO (Direct Preference Optimization).
            They start from the same pairs and differ in what runs during training.
          </Box>
          <Box variant="p">
            The challenge is to turn &quot;A is better than B&quot; into the one number per attempt
            that policy gradient needs to update the policy, the model seen as a probability
            distribution over responses (section 4, Policy Gradient), or to find a way around that
            number. RLHF learns a reward model from the pairs and runs PPO (Proximal Policy
            Optimization) against it. DPO folds the reward model into the policy and trains on the
            pairs with a classification loss, offline. In a controlled 13B comparison, PPO came out
            ahead of DPO by 0.7 points on average and took about 8 times the wall-clock to train
            on the dataset the authors timed, in our arithmetic from their training times{' '}
            <Cite tier={3} href={IVISON} venue="NeurIPS 2024">
              Ivison et al., Table 2 and Appendix K
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="See where the human judgment enters, what the pipeline cost next to pretraining, and why a PPO run can hold four models at once"
          >
            RLHF: fit a reward model to the pairs, then run PPO against it
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            RLHF, as InstructGPT ran it, has three steps: fine-tune a pretrained model on
            demonstrations (SFT, supervised fine-tuning), train a reward model on comparisons between
            outputs, then optimise the policy against that reward model with PPO. Steps 2 and 3 can
            repeat, with new comparisons collected on the current best policy{' '}
            <Cite tier={3} href={INSTRUCTGPT} venue="NeurIPS 2022">
              InstructGPT, Section 3.1
            </Cite>
            .
          </Box>
          <Box variant="p">
            On the authors&apos; own prompt distribution, human raters preferred the outputs of the
            1.3B InstructGPT model to those of 175B GPT-3, a model with over 100 times as many
            parameters{' '}
            <Cite tier={3} href={INSTRUCTGPT} venue="NeurIPS 2022">
              InstructGPT, abstract and Section 1
            </Cite>
            .
          </Box>
          <Box variant="p">
            The reward model reads a prompt and a response and returns one number. It learns from
            pairs through the Bradley-Terry model, which turns two scores into the probability that
            one answer is preferred: the difference in reward is the log-odds that a person picks the
            first answer, in the same way that a difference in Elo ratings predicts the winner of a
            chess game{' '}
            <Cite tier={3} href={CHRISTIANO} venue="NeurIPS 2017">
              Christiano et al., Section 2.2.3
            </Cite>{' '}
            <Cite tier={3} href={INSTRUCTGPT} venue="NeurIPS 2022">
              InstructGPT, Section 3.5
            </Cite>
            . The loss pushes the preferred response&apos;s score above the rejected one&apos;s:
          </Box>
          <Box variant="p">
            <code>loss = -log sigmoid(r(x, y_preferred) - r(x, y_rejected))</code>{' '}
            <Cite tier={3} href={INSTRUCTGPT} venue="NeurIPS 2022">
              InstructGPT, Eq. 1
            </Cite>
          </Box>
          <Box variant="p">
            The reward model is the human&apos;s stand-in at RL time. People enter the pipeline
            through the demonstrations and the comparisons; the PPO stage trains on prompts with no
            human labels{' '}
            <Cite tier={3} href={INSTRUCTGPT} venue="NeurIPS 2022">
              InstructGPT, Section 3.2
            </Cite>
            . During PPO the reward model&apos;s score is the reward, and a per-token KL
            (Kullback-Leibler divergence, how far one distribution has moved from another) penalty
            to the SFT model guards against over-optimising it{' '}
            <Cite tier={3} href={INSTRUCTGPT} venue="NeurIPS 2022">
              InstructGPT, Section 3.5
            </Cite>
            . Section 5, Two Leashes: PPO&apos;s Clip &amp; the KL, covers that penalty, and section
            10, The Reward Is a Proxy, what happens when the policy finds where the scorer is wrong.
          </Box>
          <Box variant="p">
            The post-training was cheap next to pretraining: 4.9 petaflop/s-days for the 175B SFT
            model and 60 for the 175B PPO-ptx model (PPO with pretraining data mixed into the
            updates), against 3,640 for GPT-3&apos;s pretraining{' '}
            <Cite tier={3} href={INSTRUCTGPT} venue="NeurIPS 2022">
              InstructGPT, Section 5.1
            </Cite>
            . In our arithmetic that is under 2% of the pretraining compute, (4.9 + 60) / 3,640; the
            paper gives no separate compute figure for training the reward model.
          </Box>
          <Box variant="p">
            The heavier cost is in the run itself. PPO in this setting holds up to four models at
            once: the policy being trained, the reference model (a frozen copy of the starting model,
            used for the KL penalty), the critic (a value model that predicts the reward a partial
            response will end up with) and the reward model{' '}
            <Cite tier={3} href={BACK_TO_BASICS} venue="ACL 2024">
              Ahmadian et al., Section 1
            </Cite>
            . The PPO trainer of TRL (Transformers Reinforcement Learning, Hugging Face&apos;s
            post-training library) at v1.12.0 lists exactly those four when it sets up training{' '}
            <Cite
              tier={1}
              href={gh('huggingface/trl', TRL_PPO_TAG, 'trl/experimental/ppo/ppo_trainer.py', 'L489')}
            >
              TRL v1.12.0 ppo_trainer.py L489
            </Cite>
            . Section 19, An RL Step Is an Inference Job Inside a Training Job, sizes them.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Train on the same pairs with one classification loss and no sampling, and know what that gives up"
          >
            DPO: the policy is its own reward model
          </Header>
        }
      >
        <SpaceBetween size="m">
          <PipelinesDiagram />
          <Box variant="small" color="text-body-secondary">
            Schematic. The stages follow InstructGPT and the DPO paper; the memory lines follow
            Ahmadian et al. for PPO and TRL&apos;s DPO configuration, cited in this section.
          </Box>
          <Box variant="p">
            DPO starts from the objective RLHF optimises, maximise the reward while paying a KL
            penalty to the reference model, and uses the fact that it has an exact solution: the
            reference policy reweighted by the exponential of the reward divided by beta, the KL
            coefficient{' '}
            <Cite tier={3} href={DPO} venue="NeurIPS 2023">
              DPO paper, Section 4, Eq. 4
            </Cite>
            .
          </Box>
          <Box variant="p">
            <code>pi*(y | x) = pi_ref(y | x) * exp(r(x, y) / beta) / Z(x)</code>
          </Box>
          <Box variant="p">
            Z(x) only normalises; it depends on the prompt and not on the response. Read the
            equation as a mental
            model: the policy RLHF aims for is the starting model with its own answers re-weighted,
            more probability on what the reward likes and less on what it does not. A response the
            reference gives zero probability stays at zero.
          </Box>
          <Box variant="p">
            Solve the same equation for the reward, and the reward becomes beta times the log-ratio of
            the policy to the reference, plus a term in Z(x). Put that into the Bradley-Terry model
            and the Z(x) term cancels, leaving a loss over the policy alone{' '}
            <Cite tier={3} href={DPO} venue="NeurIPS 2023">
              DPO paper, Section 4, Eqs. 5-7
            </Cite>
            :
          </Box>
          <Box variant="p">
            <code>
              loss = -log sigmoid(beta * [log(pi(y_w | x) / pi_ref(y_w | x)) - log(pi(y_l | x) /
              pi_ref(y_l | x))])
            </code>
          </Box>
          <Box variant="p">
            Here y_w is the preferred response and y_l the rejected one. That is a classification loss
            on pairs, and the policy network now represents both the language model and the reward{' '}
            <Cite tier={3} href={DPO} venue="NeurIPS 2023">
              DPO paper, abstract and Section 4
            </Cite>
            . Its gradient raises the likelihood of the preferred response, lowers that of the
            rejected one, and weights each pair by how wrongly the implied reward currently orders it;
            the authors report that a version without that weight can make the model degenerate{' '}
            <Cite tier={3} href={DPO} venue="NeurIPS 2023">
              DPO paper, Section 4
            </Cite>
            .
          </Box>
          <Box variant="p">
            DPO removes the separate reward model, the critic, and sampling from the model during
            training{' '}
            <Cite tier={3} href={DPO} venue="NeurIPS 2023">
              DPO paper, abstract and Section 5.2
            </Cite>
            . It keeps the reference model&apos;s log-probabilities: TRL&apos;s DPO loss subtracts the
            reference&apos;s log-probability of each chosen and rejected response from the
            policy&apos;s{' '}
            <Cite tier={1} href={trl('dpo_trainer.py', 'L1350-L1351')}>
              TRL v1.16.0 dpo_trainer.py L1350-L1351
            </Cite>
            . TRL can compute those once before training, so that the reference model does not need
            to stay in memory; the option, <code>precompute_ref_log_probs</code>, defaults to
            False{' '}
            <Cite tier={1} href={trl('dpo_config.py', 'L227-L233')}>
              TRL dpo_config.py L227-L233
            </Cite>
            . Its <code>beta</code> defaults to 0.1{' '}
            <Cite tier={1} href={trl('dpo_config.py', 'L297-L298')}>
              TRL dpo_config.py L297-L298
            </Cite>
            .
          </Box>
          <Box variant="p">
            DPO is offline: it trains on a fixed set of preference pairs, with no sampling from the
            model being trained. The pairs are sampled once, usually from the SFT model, or taken
            from a preference dataset someone already published{' '}
            <Cite tier={3} href={DPO} venue="NeurIPS 2023">
              DPO paper, Section 4, DPO outline
            </Cite>
            . PPO trains on data the current policy generates, and DPO&apos;s static data may limit
            exploration, which here means trying responses the data does not already contain{' '}
            <Cite tier={3} href={IVISON} venue="NeurIPS 2024">
              Ivison et al., Section 2.1
            </Cite>
            . A response that is in none of the pairs gets no direct signal.
          </Box>
          <ExpandableSection headerText="DPO's relatives, each defined by what it changes in DPO">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>IPO (Identity Preference Optimization)</strong> drops the Bradley-Terry link.
                Its authors show that when preferences are deterministic or nearly so, DPO overfits
                the preference data and its KL regularisation weakens; their evidence is theory and
                small bandit examples{' '}
                <Cite tier={3} href={IPO} venue="AISTATS 2024">
                  IPO paper, Sections 1 and 4.2
                </Cite>
                . TRL&apos;s DPO trainer takes <code>ipo</code> as a loss type{' '}
                <Cite tier={1} href={trl('dpo_config.py', 'L245-L252')}>
                  TRL dpo_config.py L245-L252
                </Cite>
                .
              </Box>
              <Box variant="p">
                <strong>KTO (Kahneman-Tversky Optimization)</strong> learns from a per-example label,
                desirable or undesirable, instead of pairs, and keeps the reference model. Its
                authors report matching or beating DPO from 1B to 30B parameters{' '}
                <Cite tier={3} href={KTO} venue="ICML 2024">
                  KTO paper, Section 1
                </Cite>
                . TRL ships it as its own trainer{' '}
                <Cite tier={1} href={trl('kto_trainer.py')}>
                  TRL v1.16.0 kto_trainer.py
                </Cite>
                .
              </Box>
              <Box variant="p">
                <strong>ORPO (Odds Ratio Preference Optimization)</strong> drops the reference model
                and folds preference learning into SFT with an odds-ratio term, so there is no
                separate preference stage{' '}
                <Cite tier={3} href={ORPO} venue="EMNLP 2024">
                  ORPO paper, abstract
                </Cite>
                .
              </Box>
              <Box variant="p">
                <strong>SimPO (Simple Preference Optimization)</strong> drops the reference model,
                scores a response by its length-normalised log-probability, and adds a target margin
                to the Bradley-Terry objective{' '}
                <Cite tier={3} href={SIMPO} venue="NeurIPS 2024">
                  SimPO paper, abstract and Section 2.2
                </Cite>
                .
              </Box>
              <Box variant="p">
                Choose by the data you hold. Pairs fit DPO, IPO, ORPO and SimPO; a thumbs-up or
                thumbs-down on single responses fits KTO.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Add DPO to the five rows of sections 4 and 5, and see it as the one method in the table that pushes a response down without sampling from the model it trains"
          >
            The gradient table, complete
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Sections 4 and 5 filled five rows: SFT, REINFORCE, rejection-sampling fine-tuning, RLOO
            (REINFORCE Leave-One-Out) or GRPO (Group Relative Policy Optimization), and PPO, whose
            weight is the advantage (how much better an attempt did than expected) estimated with GAE
            (Generalized Advantage Estimation) from the critic. DeepSeekMath&apos;s unified paradigm
            writes DPO in the same shape as the other rows: a coefficient times the gradient of each
            token&apos;s log-probability{' '}
            <Cite tier={3} href={DEEPSEEKMATH} venue="preprint">
              DeepSeekMath, Section 5.2.1, Table 10
            </Cite>
            . The samples are pairs drawn from the SFT model. The scorer is human preference in
            general domains, or a rule in math. The coefficient is positive on the preferred
            response&apos;s tokens and negative on the rejected one&apos;s, scaled by a sigmoid of how
            the policy currently ranks the pair against the reference{' '}
            <Cite tier={3} href={DEEPSEEKMATH} venue="preprint">
              DeepSeekMath, Appendix A.1.4, Eqs. 13-14
            </Cite>
            .
          </Box>
          <GradientTable />
          <Box variant="small" color="text-body-secondary">
            Rows 1 to 5 summarise sections 4 and 5, where their sources are cited.
          </Box>
          <Box variant="p">
            Read DPO&apos;s row against its neighbours. Its weight is signed like the RLOO, GRPO and
            PPO rows, so a rejected response is pushed down. Its samples are fixed like the SFT row
            and the offline form of rejection sampling, so nothing it learns comes from a response
            the model under training wrote. In our reading, the fixed samples are what make DPO
            cheap and also where it gives up exploration.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Weigh a gain of about a point against about 8 times the training wall-clock before you build a PPO pipeline"
          >
            PPO or DPO: what the head-to-head comparisons show
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Two studies compare the methods directly, and both put PPO ahead. In theory, every
            policy PPO can reach from a reward model also minimises the DPO loss, while DPO can also
            reach policies that exploit responses absent from the preference data{' '}
            <Cite tier={3} href={XU} venue="ICML 2024">
              Xu et al., Section 4, Theorem 4.1
            </Cite>
            . In experiments, PPO beat the other alignment methods in all of the authors&apos;
            testbeds, from dialogue to code competitions{' '}
            <Cite tier={3} href={XU} venue="ICML 2024">
              Xu et al., abstract
            </Cite>
            , and they name three details as the key to PPO&apos;s results: advantage normalisation,
            large batches, and updating the reference model as an exponential moving average{' '}
            <Cite tier={3} href={XU} venue="ICML 2024">
              Xu et al., Section 5
            </Cite>
            .
          </Box>
          <Box variant="p">
            The controlled comparison puts a size on the gap. Training a 13B model (Tulu 2 13B) with
            DPO and with PPO on the same preference datasets, the authors found better preference
            data gave the largest improvements, followed by the choice of learning algorithm. PPO
            beat DPO by an average of 0.7 points, most of it in reasoning, coding and safety, and by
            up to 2.5% in math{' '}
            <Cite tier={3} href={IVISON} venue="NeurIPS 2024">
              Ivison et al., abstract and Table 2
            </Cite>
            . On the UltraFeedback set, PPO with a 13B reward model and a 13B policy took 3 days on
            a TPU (tensor processing unit) v3 pod the authors describe as 256-size, plus about 10
            hours to train the reward model; DPO on the same roughly 60,000 pairs took 9 hours{' '}
            <Cite tier={3} href={IVISON} venue="NeurIPS 2024">
              Ivison et al., Appendix K
            </Cite>
            . On UltraFeedback, the dataset they timed, PPO led DPO by 1.2 points{' '}
            <Cite tier={3} href={IVISON} venue="NeurIPS 2024">
              Ivison et al., Table 2
            </Cite>
            , so the trade is about a point for about 8 times the wall-clock, in our arithmetic.
          </Box>
          <ExpandableSection headerText="The wall-clock arithmetic, and what it leaves out">
            <Box variant="p">
              PPO: 3 days x 24 = 72 hours. DPO: 9 hours. 72 / 9 = 8.0. Counting the reward
              model&apos;s roughly 10 hours, (72 + 10) / 9 = 9.1. The authors train on TPU v3 pods of
              256 or 128 and do not say which size the DPO run used, so the ratio compares
              wall-clock hours on hardware that may differ between the two runs{' '}
              <Cite tier={3} href={IVISON} venue="NeurIPS 2024">
                Ivison et al., Appendix K
              </Cite>
              . The timings are for UltraFeedback alone, where PPO led by 1.2 points (62.2 against
              61.0). The 0.7 is the average over five datasets, all subsampled to the same size but
              one; no timings are given for the other four{' '}
              <Cite tier={3} href={IVISON} venue="NeurIPS 2024">
                Ivison et al., Table 2
              </Cite>
              .
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Reuse an LLM judge you already run, as the labeler of your pairs or as the reward itself"
          >
            AI feedback: a critique in words becomes a weight update
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            RLAIF (RL from AI feedback) puts a model where the human labeler was. The term comes from
            Constitutional AI{' '}
            <Cite tier={3} href={RLAIF} venue="ICML 2024">
              Lee et al., abstract
            </Cite>
            , which uses a model&apos;s judgment twice. In its supervised stage, the model critiques
            its own response against a written principle and revises it, possibly several times,
            and a model is then fine-tuned on the final revisions. In its RL stage, a feedback model
            answers a multiple-choice question about which of two responses better follows a
            principle, and a preference model trained on those AI labels, mixed with human labels
            for helpfulness, becomes the reward for RL{' '}
            <Cite tier={3} href={CAI} venue="preprint">
              Constitutional AI, Section 1.2
            </Cite>
            ; the probabilities the feedback model gives to (A) and (B) are its training targets{' '}
            <Cite tier={3} href={CAI} venue="preprint">
              Constitutional AI, Section 4.1
            </Cite>
            .
          </Box>
          <Box variant="p">
            The critique-and-revise half is a text loop with a frozen model, the kind section 12,
            Verbal Reinforcement &amp; Self-Correction, develops; Constitutional AI then distils its
            output into the weights. That makes it the first bridge in this dive between words and
            weights: a critique written in language becomes either a revision to train on or a
            number to optimise.
          </Box>
          <Box variant="p">
            A later study removed the reward model as well. In d-RLAIF (direct RLAIF), an
            off-the-shelf LLM rates each response from 1 to 10 during RL, and that rating is the
            reward, which avoids a trained reward model going stale as the policy moves{' '}
            <Cite tier={3} href={RLAIF} venue="ICML 2024">
              Lee et al., Section 2.2.2
            </Cite>
            . With PaLM 2 models as labeler and policy, human raters preferred RLAIF and RLHF equally
            often in head-to-head comparison, 50% on summarisation and 52% on helpful dialogue,
            neither significantly different from 50%; on harmless dialogue, RLAIF&apos;s responses
            were rated harmless 88% of the time against 76% for RLHF{' '}
            <Cite tier={3} href={RLAIF} venue="ICML 2024">
              Lee et al., Table 1 and Section 4.1
            </Cite>
            . The authors estimate AI labelling at over 10 times cheaper than human annotation{' '}
            <Cite tier={3} href={RLAIF} venue="ICML 2024">
              Lee et al., Section 4.1
            </Cite>
            .
          </Box>
          <Box variant="p">
            In our reading, one detail applies to any judge whose output becomes a training target.
            A judge that reasons step by step before answering tends to give near-certain
            probabilities; Constitutional AI
            clamped them to the 40 to 60 percent range, and without the clamp its RL models learned
            to give more extreme responses{' '}
            <Cite tier={3} href={CAI} venue="preprint">
              Constitutional AI, Section 4.1
            </Cite>
            . Over-optimisation reaches AI feedback too: over-trained models from Constitutional
            AI&apos;s RL stage could turn overly harsh or append boilerplate{' '}
            <Cite tier={3} href={CAI} venue="preprint">
              Constitutional AI, Section 4.3
            </Cite>
            . Section 10, The Reward Is a Proxy, takes that up.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Start with DPO on the pairs you already hold, and move to on-policy RL when a verifier can score fresh samples"
          >
            Which preference update to try first
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Our reading of the two comparisons: DPO on preference data you already have is the first
            weight update to try when the signal is pairwise, and on-policy RL (training on fresh
            samples from the current model) earns its cost when a verifier, a program that checks an
            answer, can score fresh samples. The gap PPO bought in the controlled study was 0.7
            points on average, and 1.2 on the one dataset timed at about 8 times the wall-clock, and better preference data moved the
            results more than the choice of algorithm did{' '}
            <Cite tier={3} href={IVISON} venue="NeurIPS 2024">
              Ivison et al., abstract and Appendix K
            </Cite>
            . Neither study tests a verifier; section 7 covers RLVR (RL with verifiable rewards),
            where the reward is a program.
          </Box>
          <Box variant="p">
            Meta&apos;s Llama 3 report makes the same trade in production. Its authors trained their
            SFT models further with DPO, explored on-policy algorithms such as PPO, and found that
            DPO &quot;required less compute for large-scale models and performed better, especially
            on instruction following benchmarks like IFEval&quot;{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint">
              Llama 3 report, Section 4.1.4
            </Cite>
            , a benchmark of about 500 instructions such as &quot;write in more than 400
            words&quot; that a heuristic can check{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint">
              Llama 3 report, Section 5.2.1
            </Cite>
            . They ran DPO in rounds, on preference data collected with the best models of the
            previous round so that it sits closer to the policy being trained, and set beta to 0.1{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint">
              Llama 3 report, Section 4.1.4
            </Cite>
            .
          </Box>
          <ExpandableSection headerText="Other labs' post-training recipes, in the reports and pages read">
            <Box variant="p">
              Open-weight labs publish their recipes. Besides Llama 3&apos;s DPO, Qwen3&apos;s
              reasoning stage used GRPO on 3,995 query-verifier pairs{' '}
              <Cite tier={3} href={QWEN3} venue="preprint">
                Qwen3 report, Section 4.2
              </Cite>
              , and Gemma 3&apos;s RL stage built on improved versions of BOND (best-of-N
              distillation), WARM (weight-averaged reward models) and WARP (weight-averaged rewarded
              policies){' '}
              <Cite tier={3} href={GEMMA3} venue="preprint">
                Gemma 3 report, Section 3
              </Cite>
              . OpenAI and Anthropic name no current post-training algorithm in the first-party pages
              read for this dive: OpenAI&apos;s reinforcement fine-tuning guide describes a grader and
              a weight update without naming the optimiser{' '}
              <Cite tier={1} href={OPENAI_RFT}>
                OpenAI API docs: reinforcement fine-tuning
              </Cite>
              , and Anthropic&apos;s Constitutional AI paper names RLAIF and no policy-optimisation
              algorithm{' '}
              <Cite tier={3} href={CAI} venue="preprint">
                Constitutional AI
              </Cite>
              .
            </Box>
          </ExpandableSection>
          <Box variant="p">
            On AWS, SageMaker AI model customisation offers DPO on preferred and rejected response
            pairs{' '}
            <Cite tier={1} href={SM_CUSTOMIZE}>
              SageMaker AI developer guide: Model customization
            </Cite>
            , with LoRA (Low-Rank Adaptation) or full fine-tuning depending on the open-weight
            model{' '}
            <Cite tier={1} href={SM_OPEN_WEIGHT}>
              SageMaker AI developer guide: Open weight model customization
            </Cite>
            . Section 23, RL &amp; Learning Loops on AWS, maps the options.
          </Box>
          <Box variant="p">
            The order of moves follows. Put the pairs you already collect into DPO, starting from
            the default beta of 0.1 in TRL, which is also the value Llama 3 used, and measure the
            result on pairs held out from training. Spend on better pairs before a heavier
            algorithm, since data quality moved results most in the controlled study. Reach for PPO
            when the gap that remains is worth about 8 times the wall-clock. When the gap is one a
            program can check, take the RL route of section 7, RLVR &amp; GRPO.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
