import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Table from '@cloudscape-design/components/table';
import { Cite, gh, ghTree, HYPERPOD_RECIPES_SHA, TRL_TAG } from '../components/Cite';

/* ------------------------------------------------------------------------ */
/* Sources (AWS pages are unversioned; the access date is the pin)          */
/* ------------------------------------------------------------------------ */

const BEDROCK_GUIDE = 'https://docs.aws.amazon.com/bedrock/latest/userguide';
/** Bedrock user guide: reinforcement fine-tuning overview, supported models, benefits. */
const BR_RFT = `${BEDROCK_GUIDE}/reinforcement-fine-tuning.html`;
/** Reward functions for Amazon Nova models (RLVR and RLAIF, Model as Judge). */
const BR_REWARD_NOVA = `${BEDROCK_GUIDE}/reward-functions.html`;
/** Reward functions for open-weight models (custom Lambda only). */
const BR_REWARD_OPEN = `${BEDROCK_GUIDE}/reward-functions-open-weight.html`;
/** Data preparation, Nova and open-weight models. */
const BR_DATA_NOVA = `${BEDROCK_GUIDE}/rft-prepare-data.html`;
const BR_DATA_OPEN = `${BEDROCK_GUIDE}/rft-prepare-data-open-weight.html`;
/** Bedrock customisation overview (SFT, RFT, distillation). */
const BR_CUSTOM = `${BEDROCK_GUIDE}/custom-models.html`;
/** How Bedrock Advanced Prompt Optimization works. */
const BR_APO = `${BEDROCK_GUIDE}/advanced-prompt-optimization-how.html`;
const BR_PRICING = 'https://aws.amazon.com/bedrock/pricing/';
/** AWS Price List API, AmazonBedrock offer for us-east-1, version published 2026-10-30. */
const BR_PRICE_LIST =
  'https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonBedrock/20261030160456/us-east-1/index.json';
/** AWS What's New, Bedrock RFT launch, 2025-12-03. */
const RFT_LAUNCH =
  'https://aws.amazon.com/about-aws/whats-new/2025/12/bedrock-reinforcement-fine-tuning-66-base-models/';
/** AWS Machine Learning Blog, RFT on Amazon Bedrock: best practices (2026-04-08). */
const RFT_BEST_PRACTICES =
  'https://aws.amazon.com/blogs/machine-learning/reinforcement-fine-tuning-on-amazon-bedrock-best-practices/';

const SAGEMAKER_GUIDE = 'https://docs.aws.amazon.com/sagemaker/latest/dg';
/** SageMaker AI model customisation overview (techniques, training types, infrastructure). */
const SM_CUSTOM = `${SAGEMAKER_GUIDE}/customizing-models.html`;
/** Open-weight model customisation: supported models and techniques table. */
const SM_OPEN_WEIGHT = `${SAGEMAKER_GUIDE}/model-customize-open-weight.html`;
/** Multi-turn RL: preparing your agent. */
const SM_MTRL_AGENT = `${SAGEMAKER_GUIDE}/model-customize-mtrl-agent.html`;
/** Multi-turn RL: hyperparameters reference. */
const SM_MTRL_PARAMS = `${SAGEMAKER_GUIDE}/model-customize-mtrl-hyperparams.html`;
/** Training session APIs, overview and Python SDK reference. */
const SM_SESSIONS = `${SAGEMAKER_GUIDE}/customizing-models-training-sessions.html`;
const SM_SESSIONS_SDK = `${SAGEMAKER_GUIDE}/training-sessions-sdk.html`;

/** SageMaker HyperPod recipes, release 2.0.11 (commit pinned in Cite.tsx). */
const RECIPES = 'aws/sagemaker-hyperpod-recipes';
const RECIPE_ROOT = 'hyperpod_recipes/recipes_src/fine-tuning';
const GRPO_RECIPE = `${RECIPE_ROOT}/qwen-0_7_0/verl-grpo-rlvr-qwen-3-32b-lora.yaml`;
const PPO_TRAINER = `${RECIPE_ROOT}/hydra_config/verl-0_7_0/ppo_trainer.yaml`;
const ROLLOUT_CFG = `${RECIPE_ROOT}/hydra_config/verl-0_7_0/rollout/rollout.yaml`;
const NOVA_RFT_RECIPE = `${RECIPE_ROOT}/nova/nova_2_0/nova_lite/RFT/nova_lite_2_0_p5_gpu_rft.yaml`;

/** Neuron documentation source at tag v2.33.0 (the docs searched for GRPO and PPO). */
const NEURON_DOCS_SHA = '10832bbcc6b6920b3046a7d7aa59b6b684f6b81a';
const NEURON_DOCS = 'https://awsdocs-neuron.readthedocs-hosted.com/en/v2.33.0';
const NEURON_TORCHNEURON = `${NEURON_DOCS}/torch/about-pytorch-neuron.html`;
const NEURON_NXDT_ARCHIVE = `${NEURON_DOCS}/archive/nxd-training/index.html`;

const AGENTCORE_GUIDE = 'https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide';
const AC_EPISODIC = `${AGENTCORE_GUIDE}/episodic-memory-strategy.html`;
const AC_EPISODIC_PROMPT = `${AGENTCORE_GUIDE}/memory-episodic-prompt.html`;
const AC_OVERRIDES = `${AGENTCORE_GUIDE}/memory-custom-strategy.html`;
const AC_SELF_MANAGED = `${AGENTCORE_GUIDE}/memory-self-managed-strategies.html`;
const AC_OPTIMIZATION = `${AGENTCORE_GUIDE}/optimization.html`;
const AC_OPTIMIZATION_HOW = `${AGENTCORE_GUIDE}/optimization-how-it-works.html`;
const AC_EVALUATIONS = `${AGENTCORE_GUIDE}/evaluations.html`;
/** AWS What's New: AgentCore optimization preview (2026-04-30) and GA (2026-06-17). */
const AC_OPT_PREVIEW = 'https://aws.amazon.com/about-aws/whats-new/2026/05/bedrock-agentcore-optimization-preview/';
const AC_OPT_GA =
  'https://aws.amazon.com/about-aws/whats-new/2026/06/amazon-bedrock-agentcore-new-optimization-capabilities/';
/** AWS Machine Learning Blog, episodic memory in AgentCore, with AWS's own evaluation (2026-01-21). */
const EPISODIC_BLOG =
  'https://aws.amazon.com/blogs/machine-learning/build-agents-to-learn-from-experiences-using-amazon-bedrock-agentcore-episodic-memory/';

/* ------------------------------------------------------------------------ */
/* Diagram: the weights stack and the words stack, three levels each        */
/* ------------------------------------------------------------------------ */

interface StackCell {
  title: string;
  lines: [string, string];
  bring: string[];
}

const LEVELS: { name: string; sub: [string, string] }[] = [
  { name: 'Managed', sub: ['AWS runs', 'the loop'] },
  { name: 'Serverless', sub: ['AWS runs the', 'infrastructure'] },
  { name: 'Self-managed', sub: ['you run', 'the loop'] },
];

const WEIGHTS_CELLS: StackCell[] = [
  {
    title: 'Amazon Bedrock reinforcement fine-tuning',
    lines: ['GRPO on Nova 2 Lite, gpt-oss-20B or Qwen3 32B', 'rank-32 LoRA adapter, $80.00 per training hour'],
    bring: ['the grader: a reward Lambda, or a judge for Nova', 'and at least 100 training records'],
  },
  {
    title: 'SageMaker AI model customisation',
    lines: ['SFT, DPO, RFT, multi-turn RL, distillation', 'and training session APIs on managed GPUs'],
    bring: ['an agent that reports the reward (multi-turn RL),', 'or the algorithm itself (training sessions)'],
  },
  {
    title: 'SageMaker HyperPod recipes, release 2.0.11',
    lines: ['verl GRPO on P5 or P4; asynchronous Nova 2 RFT', 'Trainium: TRL GRPO on the TorchNeuron public beta'],
    bring: ['the cluster and the recipe settings,', 'with the grader as a reward Lambda'],
  },
];

const WORDS_CELLS: StackCell[] = [
  {
    title: 'Bedrock Advanced Prompt Optimization',
    lines: ['AgentCore optimization: prompts, tool descriptions', 'rewrites scored against your evaluator'],
    bring: ['an evaluator: a rubric, Lambda or AgentCore', 'evaluator, and your approval before a change ships'],
  },
  {
    title: 'AgentCore Memory, episodic strategy',
    lines: ['reflections written across episodes', "default signal: an LLM's yes-or-no verdict"],
    bring: ['override prompts and model, or run a self-managed', 'pipeline to apply a programmatic grader'],
  },
  {
    title: 'Your own loop on Bedrock models',
    lines: ['any loop from sections 13 to 15', 'AWS supplies the model API (our reading)'],
    bring: ['the whole loop: the grader, the store', 'and the update rule'],
  },
];

const ROW_Y = [136, 286, 436];
const ROW_H = 132;
const WEIGHTS_X = 152;
const WORDS_X = 528;
const CELL_W = 360;

function StackCellShape({ x, y, cell, stack }: { x: number; y: number; cell: StackCell; stack: 'w' | 't' }) {
  return (
    <g>
      <rect x={x} y={y} width={CELL_W} height={ROW_H} rx={6} className={`aws-stk-${stack}`} />
      <text x={x + 14} y={y + 22} className="aws-stk-title">
        {cell.title}
      </text>
      <text x={x + 14} y={y + 40} className="aws-stk-sub">
        {cell.lines[0]}
      </text>
      <text x={x + 14} y={y + 56} className="aws-stk-sub">
        {cell.lines[1]}
      </text>
      <rect x={x + 10} y={y + 68} width={CELL_W - 20} height={54} rx={4} className="aws-stk-bring" />
      <text x={x + 22} y={y + 85} className="aws-stk-bring-label">
        You bring
      </text>
      {cell.bring.map((line, i) => (
        <text key={line} x={x + 22} y={y + 100 + i * 14} className="aws-stk-sub">
          {line}
        </text>
      ))}
    </g>
  );
}

function TwoStacksDiagram() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 900 580"
        role="img"
        aria-labelledby="aws-stacks-title"
        style={{ width: '100%', minWidth: 720, height: 'auto' }}
      >
        <title id="aws-stacks-title">
          Two stacks of AWS services for learning loops, each with three levels of control. The
          weights stack changes a model with a training run: Amazon Bedrock reinforcement
          fine-tuning at the managed level, SageMaker AI model customisation and training session
          APIs at the serverless level, and SageMaker HyperPod recipes plus Trainium through TRL at
          the self-managed level. The words stack keeps the model frozen and changes the text it
          reads: Bedrock Advanced Prompt Optimization and AgentCore optimization at the managed
          level, AgentCore Memory&apos;s episodic strategy at the serverless level, and your own
          loop on Bedrock models at the self-managed level. Your grader, a rule-based Lambda or an
          LLM judge, sits across the top of both stacks, and a highlighted box in each cell names
          what you bring at that level: a reward Lambda and training records, an agent or an
          algorithm, a cluster, an evaluator, memory overrides, or the whole loop.
        </title>
        <style>{`
          .aws-stk-bg { fill: #ffffff; stroke: #d1d5db; }
          .aws-stk-w { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .aws-stk-t { fill: #e6f4f2; stroke: #1f7a70; stroke-width: 1.5; }
          .aws-stk-bring { fill: #fbf3d5; stroke: #8b6c00; stroke-width: 1.5; }
          .aws-stk-grader { fill: #fbf3d5; stroke: #8b6c00; stroke-width: 2; }
          .aws-stk-level { fill: #414d5c; }
          .aws-stk-head-w { fill: #0972d3; }
          .aws-stk-head-t { fill: #1f7a70; }
          .aws-stk-title { fill: #16191f; font: 600 13px sans-serif; }
          .aws-stk-sub { fill: #414d5c; font: 11px sans-serif; }
          .aws-stk-bring-label { fill: #8b6c00; font: 600 11px sans-serif; }
          .aws-stk-white-title { fill: #ffffff; font: 600 13px sans-serif; text-anchor: middle; }
          .aws-stk-white-sub { fill: #ffffff; font: 11px sans-serif; text-anchor: middle; }
          .aws-stk-mid-title { fill: #16191f; font: 600 13px sans-serif; text-anchor: middle; }
          .aws-stk-mid-sub { fill: #414d5c; font: 11px sans-serif; text-anchor: middle; }
          .aws-stk-amber-title { fill: #8b6c00; font: 600 13px sans-serif; text-anchor: middle; }
          .aws-stk-arrow { stroke: #8b6c00; stroke-width: 1.5; fill: none; marker-end: url(#aws-stk-ah); }
        `}</style>
        <defs>
          <marker
            id="aws-stk-ah"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="8"
            markerHeight="8"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="#8b6c00" />
          </marker>
        </defs>
        <rect x={0} y={0} width={900} height={580} rx={8} className="aws-stk-bg" />

        {/* Column headers */}
        <text x={75} y={40} className="aws-stk-mid-sub">
          Level
        </text>
        <rect x={WEIGHTS_X} y={12} width={CELL_W} height={46} rx={6} className="aws-stk-head-w" />
        <text x={WEIGHTS_X + CELL_W / 2} y={31} className="aws-stk-white-title">
          Weights stack
        </text>
        <text x={WEIGHTS_X + CELL_W / 2} y={48} className="aws-stk-white-sub">
          a training run changes the model
        </text>
        <rect x={WORDS_X} y={12} width={CELL_W} height={46} rx={6} className="aws-stk-head-t" />
        <text x={WORDS_X + CELL_W / 2} y={31} className="aws-stk-white-title">
          Words stack
        </text>
        <text x={WORDS_X + CELL_W / 2} y={48} className="aws-stk-white-sub">
          the model stays frozen; the text it reads changes
        </text>

        {/* The grader, shared by both stacks */}
        <rect x={12} y={70} width={126} height={46} rx={6} className="aws-stk-grader" />
        <text x={75} y={98} className="aws-stk-amber-title">
          Start here
        </text>
        <rect x={WEIGHTS_X} y={70} width={WORDS_X + CELL_W - WEIGHTS_X} height={46} rx={6} className="aws-stk-grader" />
        <text x={(WEIGHTS_X + WORDS_X + CELL_W) / 2} y={89} className="aws-stk-mid-title">
          Your grader: a rule-based Lambda or an LLM judge
        </text>
        <text x={(WEIGHTS_X + WORDS_X + CELL_W) / 2} y={106} className="aws-stk-mid-sub">
          one grader, two update targets (our reading): it can drive a weight update or a prompt rewrite
        </text>
        <line x1={WEIGHTS_X + CELL_W / 2} y1={116} x2={WEIGHTS_X + CELL_W / 2} y2={134} className="aws-stk-arrow" />
        <line x1={WORDS_X + CELL_W / 2} y1={116} x2={WORDS_X + CELL_W / 2} y2={134} className="aws-stk-arrow" />

        {/* Levels and cells */}
        {LEVELS.map((level, i) => (
          <g key={level.name}>
            <rect x={12} y={ROW_Y[i]} width={126} height={ROW_H} rx={6} className="aws-stk-level" />
            <text x={75} y={ROW_Y[i] + 56} className="aws-stk-white-title">
              {level.name}
            </text>
            <text x={75} y={ROW_Y[i] + 76} className="aws-stk-white-sub">
              {level.sub[0]}
            </text>
            <text x={75} y={ROW_Y[i] + 92} className="aws-stk-white-sub">
              {level.sub[1]}
            </text>
            <StackCellShape x={WEIGHTS_X} y={ROW_Y[i]} cell={WEIGHTS_CELLS[i]} stack="w" />
            <StackCellShape x={WORDS_X} y={ROW_Y[i]} cell={WORDS_CELLS[i]} stack="t" />
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Table: each path from section 22, and where it runs on AWS               */
/* ------------------------------------------------------------------------ */

interface PathRow {
  path: string;
  service: string;
  bring: string;
}

const PATH_ROWS: PathRow[] = [
  {
    path: 'Inference-time sampling',
    service: 'No dedicated service: sample several answers from any model endpoint and keep what the grader passes (our reading)',
    bring: 'The grader and the per-query budget',
  },
  {
    path: 'A text loop with a hardened grader',
    service:
      'Bedrock Advanced Prompt Optimization, AgentCore optimization, AgentCore Memory, or your own loop on Bedrock models',
    bring: 'An evaluator; for memory, overrides or a self-managed pipeline',
  },
  {
    path: 'An advisor in front of an API model',
    service:
      'No dedicated service: a small open-weight model trained with SageMaker AI RFT or training sessions, in front of a Bedrock model (our reading)',
    bring: 'The grader, and the training loop if you use training sessions',
  },
  {
    path: 'SFT or distillation from a stronger model',
    service: 'SageMaker AI model customisation (SFT, distillation); Bedrock distillation',
    bring: 'Labelled pairs, or a teacher model and your prompts',
  },
  {
    path: 'Reinforcement fine-tuning, managed or self-run',
    service: 'Bedrock RFT; SageMaker AI RFT and multi-turn RL; HyperPod recipes',
    bring: 'The grader; an agent for multi-turn RL; a cluster for HyperPod',
  },
  {
    path: 'Distilling a stable playbook into weights',
    service:
      'SFT or distillation in SageMaker AI, on outputs the model wrote with the playbook in context (our reading)',
    bring: 'The playbook and the prompts it should cover',
  },
];

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function RlOnAws() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Find the AWS service for each path from section 22 and what you bring to it: one grader can drive a weight update or a prompt rewrite, and Bedrock's managed RL costs $80.00 per training hour (AWS pages, HyperPod recipes 2.0.11, Neuron v2.33.0 and TRL v1.16.0, read 2026-10-30)"
          >
            23. RL &amp; Learning Loops on AWS
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            AWS runs both kinds of learning loop this dive compares. Some services change a
            model&apos;s weights with a training run, RL (reinforcement learning) or fine-tuning.
            Others keep the model frozen and change the text it reads: a prompt, a tool
            description, a store of reflections. They sit in four product families, Amazon Bedrock,
            Amazon SageMaker AI, Amazon Bedrock AgentCore and the Neuron SDK for Trainium, at three
            levels of control, and each level asks you to bring a different component.
          </Box>
          <Box variant="p">
            The challenge is to find the service for the path you chose in section 22, Choosing a
            Text Loop, a Hybrid or a Weight Update, and to know what you own once you get there. One
            component recurs on both sides. Bedrock reinforcement fine-tuning scores its samples
            with a rule-based Lambda or an LLM judge{' '}
            <Cite tier={1} href={BR_REWARD_NOVA}>
              Bedrock user guide, reward functions for Nova models
            </Cite>
            , and Bedrock Advanced Prompt Optimization takes a Lambda function or an LLM-as-a-judge
            rubric as its metric{' '}
            <Cite tier={1} href={BR_APO}>
              Bedrock user guide, how Advanced Prompt Optimization works
            </Cite>
            . Our reading of the two services: one grader, two update targets. The grader you write
            first can drive a weight update or a prompt rewrite. The pages read do not say one
            Lambda runs unchanged in both, so check each service&apos;s input and output format
            before reusing one.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="See which services change weights and which change words, and the one component you own at each level"
          >
            Two stacks, three levels
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The weights stack trains a model. Its methods are SFT (supervised fine-tuning) on
            labelled answers, DPO (Direct Preference Optimization) on preferred and rejected pairs,
            and RFT (reinforcement fine-tuning) against a grader, which Bedrock runs with GRPO (Group
            Relative Policy Optimization), often training a LoRA (Low-Rank Adaptation) adapter, a
            small set of matrices added beside frozen weights. On Trainium, the documented RL route
            is Hugging Face&apos;s TRL (Transformers Reinforcement Learning) library. The words
            stack edits what a frozen model reads.
          </Box>
          <Box variant="p">
            Down each stack, AWS runs less and you run more. A managed service runs the whole loop
            against your grader. A serverless service runs the infrastructure around code or
            configuration you supply. At the self-managed level you run the loop yourself. The amber
            boxes mark what you bring.
          </Box>
          <TwoStacksDiagram />
          <Box variant="small" color="text-body-secondary">
            Schematic. The price, versions and model names are cited in the blocks below. &quot;One
            grader, two update targets&quot; is our reading of the Bedrock RFT and Advanced Prompt
            Optimization pages.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Start an RL run from a grader and 100 records, knowing what the job changes and what each hour costs"
          >
            Weights, managed: Bedrock reinforcement fine-tuning
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Bedrock RFT is RL run as a managed job. The model being trained, the policy, writes
            several responses to each training prompt, a reward function scores them, and Bedrock
            updates the model with GRPO{' '}
            <Cite tier={1} href={BR_RFT}>
              Bedrock user guide, reinforcement fine-tuning
            </Cite>
            . GRPO compares each response with the others sampled for the same prompt, so the
            advantage, how much better a response did than its group, needs no separate value model.
          </Box>
          <Box variant="p">
            The reward is a Lambda function. For tasks a rule can check, it is a rule-based grader:
            RLVR (RL with verifiable rewards). For subjective tasks on Nova 2 Lite there is RLAIF (RL
            from AI feedback), where the console&apos;s Model as Judge option converts a judge
            configuration into a Lambda function during training{' '}
            <Cite tier={1} href={BR_REWARD_NOVA}>
              Bedrock user guide, reward functions for Nova models
            </Cite>
            . The two open-weight models have no console judge; a judge for them is a Bedrock model
            your own Lambda calls{' '}
            <Cite tier={1} href={BR_REWARD_OPEN}>
              Bedrock user guide, reward functions for open-weight models
            </Cite>
            .
          </Box>
          <Box variant="p">
            Three base models are supported, each listed in one Region: Amazon Nova 2 Lite in
            us-east-1, and OpenAI gpt-oss-20B and Qwen3 32B in us-west-2{' '}
            <Cite tier={1} href={BR_RFT}>
              Bedrock user guide, RFT supported models
            </Cite>
            . A job needs at least 100 training records for either model family{' '}
            <Cite tier={1} href={BR_DATA_NOVA}>
              Bedrock user guide, RFT data for Nova models
            </Cite>{' '}
            <Cite tier={1} href={BR_DATA_OPEN}>
              Bedrock user guide, RFT data for open-weight models
            </Cite>
            . The whole training workflow is billed by the hour: $80.00 per training hour for each of
            the three models, gpt-oss-20b and Qwen3 32B on the pricing page and Nova 2 Lite in the
            AWS Price List{' '}
            <Cite tier={1} href={BR_PRICING}>
              Amazon Bedrock pricing, reinforcement fine-tuning
            </Cite>{' '}
            <Cite tier={1} href={BR_PRICE_LIST}>
              AWS Price List API, Nova 2 Lite RFT training hours
            </Cite>
            . AWS&apos;s best-practices post says the job trains a rank-32 LoRA adapter, and that
            early stopping, on by default, ends training when validation improvements plateau{' '}
            <Cite tier={2} href={RFT_BEST_PRACTICES}>
              AWS Machine Learning Blog, RFT on Bedrock best practices
            </Cite>
            . Section 20, Cost per Improvement, turns the hourly rate into a breakeven against a text
            loop.
          </Box>
          <Box variant="p">
            AWS states the benefit as RFT improving &quot;model accuracy by up to 66% on average
            compared to base models&quot;{' '}
            <Cite tier={1} href={BR_RFT} kind="vendor-claim">
              Bedrock user guide, benefits of RFT
            </Cite>
            . The statement names no benchmark, task or model, and the figure was first published when
            Nova 2 Lite was the only supported model{' '}
            <Cite tier={2} href={RFT_LAUNCH} kind="vendor-claim">
              AWS What&apos;s New, Bedrock RFT launch, 2025-12-03
            </Cite>
            . Treat it as AWS&apos;s claim and measure the gain on your own grader.
          </Box>
          <ExpandableSection headerText="A Region detail when you plan the job">
            <Box variant="p">
              The pricing page heads the open-weight RFT rates &quot;US East (N. Virginia) and US
              West (Oregon)&quot;{' '}
              <Cite tier={1} href={BR_PRICING}>
                Amazon Bedrock pricing, reinforcement fine-tuning
              </Cite>
              , while the user guide&apos;s model table lists gpt-oss-20B and Qwen3 32B in us-west-2
              only{' '}
              <Cite tier={1} href={BR_RFT}>
                Bedrock user guide, RFT supported models
              </Cite>
              . On our reading the model table is the availability list and the pricing heading
              covers more Regions than it does, so plan the Region from the model table.
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Bring an agent or your own algorithm, and let SageMaker AI hold the GPUs"
          >
            Weights, serverless: SageMaker AI model customisation
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            SageMaker AI model customisation lists six techniques: SFT on labelled prompt-response
            pairs, DPO on preferred and rejected pairs, RFT through RLVR or RLAIF, MTRL (multi-turn
            reinforcement learning) for
            agents, continuous customisation that chains techniques, and distillation from a teacher
            model to a student{' '}
            <Cite tier={1} href={SM_CUSTOM}>
              SageMaker AI developer guide, model customisation overview
            </Cite>
            . Section 22&apos;s path of SFT or distillation from a stronger model finds its service
            here; Bedrock lists distillation as a customisation method as well{' '}
            <Cite tier={1} href={BR_CUSTOM}>
              Bedrock user guide, customisation methods
            </Cite>
            .
          </Box>
          <Box variant="p">
            Multi-turn RL is section 9, Agentic RL, offered as an API. Your agent runs each episode,
            one complete attempt at a task: it calls the policy model through SageMaker AI, takes
            actions in your environment such as tool calls, and reports one reward score for the
            complete rollout, a rollout being the sampled episode{' '}
            <Cite tier={1} href={SM_MTRL_AGENT}>
              SageMaker AI developer guide, preparing your agent for multi-turn RL
            </Cite>
            . The environment and the grader live in your agent&apos;s code.
          </Box>
          <Box variant="p">
            Training session APIs hand you the algorithm. You open a session and call{' '}
            <code>sample()</code>, <code>forward_backward()</code> and <code>optim_step()</code>,
            composing them into whatever procedure your technique needs; the model stays loaded on
            GPUs between calls, and the service handles distributed execution and gradient
            synchronisation{' '}
            <Cite tier={1} href={SM_SESSIONS}>
              SageMaker AI developer guide, training session APIs
            </Cite>
            . The RL losses take log-probabilities and advantages as inputs{' '}
            <Cite tier={1} href={SM_SESSIONS_SDK}>
              SageMaker AI developer guide, training sessions SDK reference
            </Cite>
            , so on our reading the advantage estimator, GRPO&apos;s or any other, is your code.
          </Box>
          <ExpandableSection headerText="Multi-turn RL makes the advantage estimator a setting">
            <Box variant="p">
              Where training sessions leave the advantage to your code, multi-turn RL offers it as a
              hyperparameter. <code>advantage_method</code> defaults to <code>group_based</code> and
              takes nine values, among them <code>rloo</code> (RLOO, REINFORCE Leave-One-Out) and
              two identifiers AWS does not expand, <code>reinforce_pp</code> and{' '}
              <code>grpo_passk</code>; reading them as REINFORCE++ and a variant of GRPO aimed at
              pass@k, the chance that at least one of k attempts succeeds, is our reading. The loss is a second setting, <code>loss_fn</code>, with three values and{' '}
              <code>ppo</code> as the default{' '}
              <Cite tier={1} href={SM_MTRL_PARAMS}>
                SageMaker AI developer guide, multi-turn RL hyperparameters
              </Cite>
              . On our reading, the nine values are alternative ways to turn the same rollouts&apos;
              rewards into advantages, the comparison section 7, RLVR &amp; GRPO, makes among
              GRPO&apos;s successors.
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Read what the recipes run before you size a cluster, and know what Trainium documents for RL today"
          >
            Weights, self-managed: HyperPod recipes and Trainium
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Recipes are the configuration files behind SageMaker AI&apos;s self-managed options:
            training jobs where you pick the instance type, and persistent HyperPod clusters with
            fault recovery{' '}
            <Cite tier={1} href={SM_CUSTOM}>
              SageMaker AI developer guide, model customisation overview
            </Cite>
            . At release 2.0.11 the Qwen3 32B LoRA GRPO recipe shows what they run: verl&apos;s PPO
            (Proximal Policy Optimization) trainer with the advantage estimator switched to GRPO. It
            inherits verl&apos;s PPO trainer configuration, which sets the estimator to GAE
            (Generalized Advantage Estimation), the critic-based one{' '}
            <Cite tier={1} href={gh(RECIPES, HYPERPOD_RECIPES_SHA, PPO_TRAINER, 'L80-L81')} kind="code">
              HyperPod recipes ppo_trainer.yaml L80-L81
            </Cite>
            , and overrides it under the comment &quot;switch from GAE (upstream default) to
            GRPO&quot;{' '}
            <Cite tier={1} href={gh(RECIPES, HYPERPOD_RECIPES_SHA, GRPO_RECIPE, 'L33-L35')} kind="code">
              HyperPod recipes verl-grpo-rlvr-qwen-3-32b-lora.yaml L33-L35
            </Cite>
            . It generates rollouts with vLLM{' '}
            <Cite tier={1} href={gh(RECIPES, HYPERPOD_RECIPES_SHA, GRPO_RECIPE, 'L50-L51')} kind="code">
              same recipe L50-L51
            </Cite>
            , samples 8 responses per prompt, the default in the shared rollout settings{' '}
            <Cite tier={1} href={gh(RECIPES, HYPERPOD_RECIPES_SHA, ROLLOUT_CFG, 'L104-L105')} kind="code">
              HyperPod recipes rollout.yaml L104-L105
            </Cite>
            , and leaves the reward as an empty <code>lambda_arn</code> for your Lambda{' '}
            <Cite tier={1} href={gh(RECIPES, HYPERPOD_RECIPES_SHA, GRPO_RECIPE, 'L98-L102')} kind="code">
              same recipe L98-L102
            </Cite>
            .
          </Box>
          <Box variant="p">
            The Nova 2 Lite RFT recipe runs asynchronous rollouts, with{' '}
            <code>rollout_strategy.type: off_policy_async</code> and <code>age_tolerance: 2</code>{' '}
            <Cite tier={1} href={gh(RECIPES, HYPERPOD_RECIPES_SHA, NOVA_RFT_RECIPE, 'L29-L34')} kind="code">
              HyperPod recipes nova_lite_2_0_p5_gpu_rft.yaml L29-L34
            </Cite>
            . Off-policy means the trainer learns from rollouts an older copy of the policy sampled.
            Our reading is that <code>age_tolerance: 2</code> lets a rollout be about two policy
            versions old when it is trained on, the asynchronous design of section 19, An RL Step Is
            an Inference Job Inside a Training Job; the recipe does not define the unit.
          </Box>
          <Box variant="p">
            Every GRPO recipe at this release targets P5 or P4 instances. Across the 149{' '}
            <code>verl-grpo-*</code> files the instance types are <code>ml.p5.48xlarge</code>,{' '}
            <code>ml.p5e.48xlarge</code>, <code>ml.p5en.48xlarge</code>,{' '}
            <code>ml.p4de.24xlarge</code> and <code>ml.p4d.24xlarge</code>, and no path in the
            repository names Trainium or Neuron{' '}
            <Cite tier={1} href={ghTree(RECIPES, HYPERPOD_RECIPES_SHA, RECIPE_ROOT)} kind="code">
              HyperPod recipes 2.0.11, fine-tuning recipe tree
            </Cite>
            .
          </Box>
          <Box variant="p">
            On Trainium, GRPO and PPO were not found in the Neuron v2.33.0 documentation searched{' '}
            <Cite tier={1} href={ghTree('aws-neuron/aws-neuron-sdk', NEURON_DOCS_SHA)}>
              Neuron documentation source, v2.33.0
            </Cite>
            , and the library behind its DPO tutorial, NxD Training (NeuronX Distributed Training),
            has reached end of support{' '}
            <Cite tier={1} href={NEURON_NXDT_ARCHIVE}>
              Neuron v2.33.0, NxD Training archive notice
            </Cite>
            . The documented GRPO procedure comes from Hugging Face: TRL v1.16.0 runs its trainers
            on <code>torch-neuronx</code>{' '}
            <Cite tier={1} href={gh('huggingface/trl', TRL_TAG, 'docs/source/aws_trainium.md', 'L3')}>
              TRL aws_trainium.md L3
            </Cite>
            , the TorchNeuron backend AWS ships as a public beta on Trn2 and Trn3{' '}
            <Cite tier={1} href={NEURON_TORCHNEURON}>
              Neuron v2.33.0, What is TorchNeuron
            </Cite>
            , and its GRPO example generates rollouts with Transformers inside the training
            process, on one NeuronCore{' '}
            <Cite tier={1} href={gh('huggingface/trl', TRL_TAG, 'docs/source/aws_trainium.md', 'L53-L82')}>
              TRL aws_trainium.md L53-L82
            </Cite>
            .
          </Box>
          <ExpandableSection headerText="What TRL's Trainium example spends on compilation">
            <Box variant="p">
              Neuron compiles a graph for each input shape it sees, so TRL pads sequences to a
              multiple of 128 tokens on the <code>neuron</code> device to bound the number of shapes{' '}
              <Cite tier={1} href={gh('huggingface/trl', TRL_TAG, 'trl/trainer/grpo_config.py', 'L1055-L1057')}>
                TRL grpo_config.py L1055-L1057
              </Cite>
              . In the GRPO example on Qwen3-0.6B, Hugging Face reports that each new prompt size
              still compiles for about 12 minutes on one NeuronCore, and that once a size is
              compiled a step takes about 25 s{' '}
              <Cite tier={1} href={gh('huggingface/trl', TRL_TAG, 'docs/source/aws_trainium.md', 'L82')}>
                TRL aws_trainium.md L82
              </Cite>
              . Bucket prompt and completion lengths before the first run, because every new size
              costs a compile.
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Point a managed rewrite loop at your evaluator, and approve what it promotes"
          >
            Words, managed: prompt and agent optimisation
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Bedrock Advanced Prompt Optimization is a text loop of the kind sections 13 to 15 build,
            run as a job. It takes up to 10 prompt templates, up to 100 evaluation samples per
            template, ground-truth answers and your evaluation metric, given as an LLM-as-a-judge
            rubric, a Lambda function or short natural-language criteria. It then repeats
            inference, grading and rewriting until proprietary internal parameters end the loop.
            The inference and Lambda calls run in your account at their public prices, with no
            separate charge for the optimiser{' '}
            <Cite tier={1} href={BR_APO}>
              Bedrock user guide, how Advanced Prompt Optimization works
            </Cite>
            .
          </Box>
          <Box variant="p">
            AgentCore optimization runs the same kind of loop on a deployed agent. It reads the
            agent&apos;s traces and a target evaluator and proposes a rewritten system prompt or
            rewritten tool descriptions{' '}
            <Cite tier={1} href={AC_OPTIMIZATION}>
              AgentCore developer guide, optimization
            </Cite>
            ; the evaluator comes from AgentCore Evaluations, which scores traces with
            LLM-as-a-judge techniques{' '}
            <Cite tier={1} href={AC_EVALUATIONS}>
              AgentCore developer guide, evaluations
            </Cite>
            . A batch evaluation against test cases, an A/B test on live traffic, or both validate
            a recommendation, with statistical significance reported, and every recommendation needs
            your approval before it ships{' '}
            <Cite tier={2} href={AC_OPT_PREVIEW}>
              AWS What&apos;s New, AgentCore optimization preview, 2026-04-30
            </Cite>
            . You route all traffic to the winner, and its traces seed the next round{' '}
            <Cite tier={1} href={AC_OPTIMIZATION_HOW}>
              AgentCore developer guide, how optimization works
            </Cite>
            . Recommendations, batch evaluations and A/B tests have been generally available since
            2026-06-17{' '}
            <Cite tier={2} href={AC_OPT_GA}>
              AWS What&apos;s New, AgentCore optimization GA, 2026-06-17
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Know which signal writes your agent's reflections, and replace it when the transcript is not evidence enough"
          >
            Words, a managed store: AgentCore episodic memory
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            AgentCore Memory&apos;s episodic strategy keeps experience as text. It detects when an
            episode within a conversation completes, writes a structured record of it, and generates
            reflections across episodes, which AWS describes as &quot;giving models a way to learn
            from history&quot;{' '}
            <Cite tier={1} href={AC_EPISODIC}>
              AgentCore developer guide, episodic memory strategy
            </Cite>
            .
          </Box>
          <ExpandableSection headerText="AWS's own test of episodic memory on tau2-bench (a vendor claim)">
            <Box variant="p">
              AWS has measured it in its own test, a vendor claim. A Claude 3.7 agent worked tasks
              sampled from tau2-bench, customer-service scenarios in retail and airline domains
              where the agent helps a user reach a specific goal, after memory was extracted from a
              set of historical interactions; each task was attempted four times. In retail, the
              agent succeeded at least once in four attempts, the blog&apos;s Pass^1, on 77.2% of
              tasks with cross-episode reflections against 65.8% with no memory. In airline, at the
              stricter Pass^3, at least three successes in four, stored episodes retrieved as
              in-context examples reached 43.0% against 41% for reflections and 24% with no
              memory{' '}
              <Cite tier={2} href={EPISODIC_BLOG} kind="vendor-claim">
                AWS Machine Learning Blog, AgentCore episodic memory, performance evaluation
              </Cite>
              . The blog&apos;s Pass^1 counts a task solved if any of four attempts succeeds, which
              this dive would write pass@4 (our reading). The test builds memory once and evaluates
              once, with no curve over successive episodes, and the blog reports no task counts or
              seeds, so it shows what retrieved experience added at one point in time.
            </Box>
          </ExpandableSection>
          <Box variant="p">
            The signal behind each record is an LLM&apos;s verdict. The default episode-extraction
            prompt asks the model to &quot;Start with Yes or No&quot; on whether the acting party
            achieved its stated goal{' '}
            <Cite tier={1} href={AC_EPISODIC_PROMPT}>
              AgentCore developer guide, episodic memory system prompt
            </Cite>
            . Our reading is that this verdict reads the transcript with no external check, the kind
            of signal section 10, The Reward Is a Proxy, and section 12, Verbal Reinforcement &amp;
            Self-Correction, identify as weak. The extraction, consolidation and reflection steps
            can each be overridden with your own instructions and your choice of model{' '}
            <Cite tier={1} href={AC_OVERRIDES}>
              AgentCore developer guide, built-in strategies with overrides
            </Cite>
            .
          </Box>
          <Box variant="p">
            What an override can do, on our reading: tell the judge to rely on evidence in the
            transcript, such as test output the agent printed. It changes the judge&apos;s prompt
            and model, and nothing on the override page lets it run your tests, so a programmatic
            grader needs a self-managed strategy. There your own pipeline extracts the records and
            writes them through batch APIs such as <code>BatchCreateMemoryRecords</code>{' '}
            <Cite tier={1} href={AC_SELF_MANAGED}>
              AgentCore developer guide, self-managed strategies
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Run any loop from sections 13 to 15 on Bedrock models, and assemble the two paths that have no dedicated service among those covered here"
          >
            Words, self-run, and two paths with no dedicated service
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Any loop from sections 13 to 15 can run against Bedrock models with nothing
            AWS-specific beyond the model API (our reading). On the pages read, none of the
            words-side services is described as changing model weights{' '}
            <Cite tier={1} href={AC_EPISODIC}>
              AgentCore developer guide, episodic memory strategy
            </Cite>{' '}
            <Cite tier={1} href={BR_APO}>
              Bedrock user guide, how Advanced Prompt Optimization works
            </Cite>
            ; on our reading, where AWS says these services learn, what changes is retrieved text or
            an edited prompt.
          </Box>
          <Box variant="p">
            Two of section 22&apos;s paths have no dedicated service, on our reading of the services
            covered here. Inference-time sampling, drawing several answers and keeping the one the
            grader passes, runs against any model endpoint. An advisor, section 16&apos;s small
            trained model that writes per-input advice into a frozen model&apos;s prompt, can be an
            open-weight model trained on SageMaker AI and placed in front of a Bedrock model.
            SageMaker AI RFT supports RLVR and RLAIF on models as small as Qwen3 0.6B{' '}
            <Cite tier={1} href={SM_OPEN_WEIGHT}>
              SageMaker AI developer guide, open-weight models and techniques
            </Cite>
            , and training sessions let you write the advisor&apos;s GRPO loop yourself on the
            larger models they list{' '}
            <Cite tier={1} href={SM_SESSIONS}>
              SageMaker AI developer guide, training session APIs
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Start with the grader, then add the one component your level asks for"
          >
            One grader, two update targets
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Table<PathRow>
            variant="embedded"
            wrapLines
            header={<Header variant="h3">Each path from section 22, and where it runs on AWS</Header>}
            columnDefinitions={[
              { id: 'path', header: 'Path (section 22)', cell: (r) => r.path },
              { id: 'service', header: 'Where it runs on AWS', cell: (r) => r.service },
              { id: 'bring', header: 'What you bring', cell: (r) => r.bring },
            ]}
            items={PATH_ROWS}
          />
          <Box variant="p">
            What you bring, in order. The grader comes first at every level: on Bedrock RFT a
            grader and 100 records start a job billed at $80.00 per training hour, and the same
            grader belongs inside any loop you run yourself. Each level then adds one component.
            Multi-turn RL asks for an agent that runs the episode and reports the reward. Training
            sessions ask for the algorithm, advantages included. The managed words loops ask for an
            evaluator, an Advanced Prompt Optimization metric or an AgentCore evaluator, plus your
            approval of each AgentCore change. Write the grader first; the service follows from
            which of these components you are ready to own.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
