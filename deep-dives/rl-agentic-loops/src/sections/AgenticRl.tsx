import type { ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Table from '@cloudscape-design/components/table';
import { Cite, arxiv, gh, TRL_TAG, VERL_TAG } from '../components/Cite';

/* ------------------------------------------------------------------------ */
/* Sources                                                                  */
/* ------------------------------------------------------------------------ */

/** Jin et al., Search-R1 (v5 carries the COLM 2025 running header). */
const SEARCH_R1 = arxiv('2503.09516v5');
/** Feng et al., ReTool (ByteDance Seed). */
const RETOOL = arxiv('2504.11536v2');
/** Wang et al., RAGEN and StarPO. */
const RAGEN = arxiv('2504.20073v2');
/** Wei et al., SWE-RL (Meta). */
const SWE_RL = arxiv('2502.18449v2');
/** Kimi Team, Kimi K2 technical report. */
const KIMI_K2 = arxiv('2507.20534v2');
/** Zhai et al., the pass@(k,T) study of tool-use RL. */
const PASS_KT = arxiv('2604.14877v1');
/** Agentica and Together AI, DeepSWE post (published 2025-07-02). */
const DEEPSWE = 'https://www.together.ai/blog/deepswe';
/** SageMaker AI Developer Guide, "Preparing your agent" (multi-turn RL). */
const SM_MTRL_AGENT =
  'https://docs.aws.amazon.com/sagemaker/latest/dg/model-customize-mtrl-agent.html';

function verl(path: string, lines?: string): string {
  return gh('volcengine/verl', VERL_TAG, path, lines);
}

function trl(path: string, lines?: string): string {
  return gh('huggingface/trl', TRL_TAG, `trl/trainer/${path}`, lines);
}

/* ------------------------------------------------------------------------ */
/* Diagram: the agent-environment loop and one episode as the trainer sees  */
/* ------------------------------------------------------------------------ */

type SegKind = 'prompt' | 'model' | 'tool';

interface Seg {
  x: number;
  w: number;
  kind: SegKind;
  label: string;
}

const SEGS: Seg[] = [
  { x: 110, w: 80, kind: 'prompt', label: 'prompt' },
  { x: 190, w: 150, kind: 'model', label: 'think, call a tool' },
  { x: 340, w: 110, kind: 'tool', label: 'tool result' },
  { x: 450, w: 150, kind: 'model', label: 'think, call a tool' },
  { x: 600, w: 110, kind: 'tool', label: 'tool result' },
  { x: 710, w: 120, kind: 'model', label: 'final answer' },
];

const MASK_TEXT: Record<SegKind, string> = {
  prompt: 'not trained',
  model: '1: trained',
  tool: '0: masked',
};

const ADV_TEXT: Record<SegKind, string> = {
  prompt: '',
  model: 'A',
  tool: '0',
};

function AgentLoopDiagram() {
  const tokY = 158;
  const tokH = 40;
  const maskY = 206;
  const rewY = 244;
  const advY = 282;
  const rowH = 30;
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 900 392"
        role="img"
        aria-labelledby="agentic-loop-title"
        style={{ width: '100%', minWidth: 660, height: 'auto' }}
      >
        <title id="agentic-loop-title">
          One agentic episode as the trainer sees it. The policy model writes reasoning and a tool
          call; the environment runs the call and returns its output, which joins the context, and
          the loop repeats until the model gives a final answer. In the token sequence, the
          model&apos;s own tokens carry loss mask 1 and are trained, while tool-result tokens carry
          loss mask 0: the model reads them but is not trained on them. The grader scores the end
          state once, and that single reward is written on the last token with zeros everywhere
          else. The advantage computed from it is the same value on every trained token of the
          episode.
        </title>
        <style>{`
          .agentic-loop-policy { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .agentic-loop-env { fill: #fbf3d5; stroke: #8b6c00; stroke-width: 1.5; }
          .agentic-loop-grader { fill: #ecf7ec; stroke: #037f0c; stroke-width: 1.5; }
          .agentic-loop-t { fill: #16191f; font: 600 13px sans-serif; text-anchor: middle; }
          .agentic-loop-s { fill: #414d5c; font: 11px sans-serif; text-anchor: middle; }
          .agentic-loop-edge { fill: #414d5c; font: 11px sans-serif; text-anchor: middle; }
          .agentic-loop-arr { stroke: #5f6b7a; stroke-width: 1.5; fill: none; }
          .agentic-loop-garr { stroke: #037f0c; stroke-width: 1.5; fill: none; }
          .agentic-loop-head { fill: #414d5c; font: 600 12px sans-serif; }
          .agentic-loop-row { fill: #414d5c; font: 600 11px sans-serif; }
          .agentic-loop-seg-prompt { fill: #f4f4f4; stroke: #879596; stroke-width: 1; }
          .agentic-loop-seg-model { fill: #0972d3; stroke: #065299; stroke-width: 1; }
          .agentic-loop-seg-tool { fill: #fbf3d5; stroke: #8b6c00; stroke-width: 1; stroke-dasharray: 4 3; }
          .agentic-loop-st-prompt { fill: #414d5c; font: 11px sans-serif; text-anchor: middle; }
          .agentic-loop-st-model { fill: #ffffff; font: 600 11px sans-serif; text-anchor: middle; }
          .agentic-loop-st-tool { fill: #6b5300; font: 600 11px sans-serif; text-anchor: middle; }
          .agentic-loop-cell { fill: #ffffff; stroke: #d1d5db; stroke-width: 1; }
          .agentic-loop-cell-prompt { fill: #f4f4f4; stroke: #d1d5db; stroke-width: 1; }
          .agentic-loop-ct-prompt { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .agentic-loop-ct-model { fill: #065299; font: 600 11px sans-serif; text-anchor: middle; }
          .agentic-loop-ct-tool { fill: #6b5300; font: 600 11px sans-serif; text-anchor: middle; }
          .agentic-loop-r { fill: #037f0c; }
          .agentic-loop-rt { fill: #ffffff; font: 600 12px sans-serif; text-anchor: middle; }
          .agentic-loop-leg { fill: #414d5c; font: 11px sans-serif; }
        `}</style>
        <defs>
          <marker
            id="agentic-loop-ah"
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="4"
            orient="auto-start-reverse"
            markerUnits="userSpaceOnUse"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill="#5f6b7a" />
          </marker>
          <marker
            id="agentic-loop-gah"
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="4"
            orient="auto-start-reverse"
            markerUnits="userSpaceOnUse"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill="#037f0c" />
          </marker>
        </defs>

        <rect x={0} y={0} width={900} height={392} rx={8} fill="#ffffff" />

        {/* Policy model */}
        <rect x={20} y={16} width={250} height={100} rx={6} className="agentic-loop-policy" />
        <text x={145} y={44} className="agentic-loop-t">
          Policy model
        </text>
        <text x={145} y={66} className="agentic-loop-s">
          the model being trained
        </text>
        <text x={145} y={84} className="agentic-loop-s">
          writes the blue tokens,
        </text>
        <text x={145} y={102} className="agentic-loop-s">
          reads tool results as context
        </text>

        {/* Environment */}
        <rect x={450} y={16} width={280} height={100} rx={6} className="agentic-loop-env" />
        <text x={590} y={44} className="agentic-loop-t">
          Environment
        </text>
        <text x={590} y={64} className="agentic-loop-s">
          a sandbox and its tools: search,
        </text>
        <text x={590} y={82} className="agentic-loop-s">
          shell, code runner, file editor
        </text>
        <text x={590} y={100} className="agentic-loop-s">
          writes the amber tokens
        </text>

        {/* Grader */}
        <rect x={760} y={16} width={120} height={100} rx={6} className="agentic-loop-grader" />
        <text x={820} y={44} className="agentic-loop-t">
          Grader
        </text>
        <text x={820} y={66} className="agentic-loop-s">
          scores the
        </text>
        <text x={820} y={82} className="agentic-loop-s">
          end state,
        </text>
        <text x={820} y={98} className="agentic-loop-s">
          once
        </text>

        {/* Loop arrows */}
        <line
          x1={274}
          y1={50}
          x2={446}
          y2={50}
          className="agentic-loop-arr"
          markerEnd="url(#agentic-loop-ah)"
        />
        <text x={360} y={40} className="agentic-loop-edge">
          tool call (the action)
        </text>
        <line
          x1={446}
          y1={86}
          x2={274}
          y2={86}
          className="agentic-loop-arr"
          markerEnd="url(#agentic-loop-ah)"
        />
        <text x={360} y={104} className="agentic-loop-edge">
          tool result (observation)
        </text>
        <line
          x1={732}
          y1={66}
          x2={756}
          y2={66}
          className="agentic-loop-arr"
          markerEnd="url(#agentic-loop-ah)"
        />

        {/* Episode strip */}
        <text x={110} y={146} className="agentic-loop-head">
          One episode, as the trainer sees it
        </text>
        <text x={20} y={tokY + 24} className="agentic-loop-row">
          tokens
        </text>
        <text x={20} y={maskY + 19} className="agentic-loop-row">
          loss mask
        </text>
        <text x={20} y={rewY + 19} className="agentic-loop-row">
          reward
        </text>
        <text x={20} y={advY + 19} className="agentic-loop-row">
          advantage
        </text>

        {SEGS.map((s, i) => (
          <g key={`seg-${i}`}>
            <rect
              x={s.x}
              y={tokY}
              width={s.w}
              height={tokH}
              className={`agentic-loop-seg-${s.kind}`}
            />
            <text x={s.x + s.w / 2} y={tokY + 24} className={`agentic-loop-st-${s.kind}`}>
              {s.label}
            </text>

            <rect
              x={s.x}
              y={maskY}
              width={s.w}
              height={rowH}
              className={s.kind === 'prompt' ? 'agentic-loop-cell-prompt' : 'agentic-loop-cell'}
            />
            <text x={s.x + s.w / 2} y={maskY + 19} className={`agentic-loop-ct-${s.kind}`}>
              {MASK_TEXT[s.kind]}
            </text>

            <rect
              x={s.x}
              y={rewY}
              width={s.w}
              height={rowH}
              className={s.kind === 'prompt' ? 'agentic-loop-cell-prompt' : 'agentic-loop-cell'}
            />
            {s.kind !== 'prompt' && i < SEGS.length - 1 && (
              <text x={s.x + s.w / 2} y={rewY + 19} className={`agentic-loop-ct-${s.kind}`}>
                0
              </text>
            )}

            <rect
              x={s.x}
              y={advY}
              width={s.w}
              height={rowH}
              className={s.kind === 'prompt' ? 'agentic-loop-cell-prompt' : 'agentic-loop-cell'}
            />
            {ADV_TEXT[s.kind] && (
              <text x={s.x + s.w / 2} y={advY + 19} className={`agentic-loop-ct-${s.kind}`}>
                {ADV_TEXT[s.kind]}
              </text>
            )}
          </g>
        ))}

        {/* The last cell of the reward row: zeros, then r on the last token */}
        <text x={746} y={rewY + 19} className="agentic-loop-ct-model">
          0 ... 0
        </text>
        <rect x={798} y={rewY + 3} width={28} height={rowH - 6} rx={3} className="agentic-loop-r" />
        <text x={812} y={rewY + 20} className="agentic-loop-rt">
          r
        </text>

        {/* Grader writes r on the last token */}
        <path
          d={`M865,116 L865,${rewY + 15} L832,${rewY + 15}`}
          className="agentic-loop-garr"
          markerEnd="url(#agentic-loop-gah)"
        />

        {/* Legend */}
        <rect x={20} y={330} width={14} height={14} className="agentic-loop-seg-model" />
        <text x={40} y={341} className="agentic-loop-leg">
          model tokens: the actions, trained
        </text>
        <rect x={276} y={330} width={14} height={14} className="agentic-loop-seg-tool" />
        <text x={296} y={341} className="agentic-loop-leg">
          tool-result tokens: in context, masked from the loss
        </text>
        <rect x={660} y={330} width={14} height={14} rx={2} className="agentic-loop-r" />
        <text x={680} y={341} className="agentic-loop-leg">
          r: the one reward
        </text>
        <text x={20} y={370} className="agentic-loop-leg">
          A: the episode&apos;s advantage against its group, the same on every trained token
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Table: five environments, four fields                                    */
/* ------------------------------------------------------------------------ */

interface EnvRow {
  id: string;
  name: string;
  source: ReactNode;
  env: ReactNode;
  action: ReactNode;
  obs: ReactNode;
  reward: ReactNode;
}

const ENV_ROWS: EnvRow[] = [
  {
    id: 'search-r1',
    name: 'Search-R1',
    source: (
      <Cite tier={3} href={SEARCH_R1} venue="COLM 2025">
        Search-R1, Sections 3.1 to 4.3
      </Cite>
    ),
    env: 'The E5 retriever over a 2018 Wikipedia dump, three passages per search',
    action: (
      <>
        A query between <code>&lt;search&gt;</code> tags; a final answer
      </>
    ),
    obs: (
      <>
        Retrieved passages between <code>&lt;information&gt;</code> tags
      </>
    ),
    reward: 'Exact match of the final answer; no format reward, no learned reward model',
  },
  {
    id: 'retool',
    name: 'ReTool',
    source: (
      <Cite tier={3} href={RETOOL} venue="preprint">
        ReTool, Section 2.3
      </Cite>
    ),
    env: 'A code sandbox',
    action: (
      <>
        Code between <code>&lt;code&gt;</code> tags inside the reasoning
      </>
    ),
    obs: (
      <>
        The interpreter&apos;s output or error message, between{' '}
        <code>&lt;interpreter&gt;</code> tags
      </>
    ),
    reward:
      '+1 if the final answer is equivalent to the ground truth, -1 otherwise; no reward for code that runs',
  },
  {
    id: 'ragen',
    name: 'RAGEN',
    source: (
      <Cite tier={3} href={RAGEN} venue="preprint">
        RAGEN, Sections 2.2 and 3, Appendix C
      </Cite>
    ),
    env: 'Four small worlds: a two-armed bandit, Sokoban (a box-pushing puzzle), FrozenLake (a grid walk on slippery ice) and WebShop (a simulated web shop)',
    action: (
      <>
        Reasoning in <code>&lt;think&gt;</code> tags, then moves in <code>&lt;answer&gt;</code>{' '}
        tags; up to 5 turns and 10 actions per episode in training
      </>
    ),
    obs: 'The next state and a per-step reward',
    reward:
      'Per world. Sokoban: +1 per box on target, -1 for off-target boxes, +10 on completion, -0.1 per action. FrozenLake: 1 on success, else 0. Any world: -0.1 for a malformed response',
  },
  {
    id: 'swe-rl',
    name: 'SWE-RL',
    source: (
      <Cite tier={3} href={SWE_RL} venue="NeurIPS 2025">
        SWE-RL, Section 2.1
      </Cite>
    ),
    env: 'Nothing runs: an issue, the full text of the relevant files, and the patch that was merged',
    action: 'One response with search-and-replace edits',
    obs: 'None: a single turn',
    reward: (
      <>
        -1 for a malformed response, otherwise the text similarity (0 to 1) of the predicted and
        merged patches, from Python&apos;s <code>difflib.SequenceMatcher</code>
      </>
    ),
  },
  {
    id: 'deepswe',
    name: 'DeepSWE',
    source: (
      <Cite tier={2} href={DEEPSWE}>
        DeepSWE post, Section 2.2 (Agentica and Together AI)
      </Cite>
    ),
    env: "R2E-Gym: each task's repository in its own Docker image, with a terminal and file system",
    action: 'Four tools: run a bash command, search, view or edit a file, finish',
    obs: "Each tool's output, including stdout and stderr",
    reward:
      '1 if the patch passes a selected sample of the tests within five minutes (the official evaluation allows 30), else 0',
  },
];

function EnvironmentsTable() {
  return (
    <Table
      variant="embedded"
      wrapLines
      trackBy="id"
      items={ENV_ROWS}
      columnDefinitions={[
        {
          id: 'name',
          header: 'Setup',
          cell: (r) => (
            <SpaceBetween size="xxs">
              <Box variant="strong">{r.name}</Box>
              {r.source}
            </SpaceBetween>
          ),
        },
        { id: 'env', header: 'Environment', cell: (r) => r.env },
        { id: 'action', header: 'Action', cell: (r) => r.action },
        { id: 'obs', header: 'Observation', cell: (r) => r.obs },
        { id: 'reward', header: 'Reward', cell: (r) => r.reward },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function AgenticRl() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="What you build to RL-train an agent: a sandbox, tool interfaces and a grader (verl v0.9.1 and TRL v1.16.0, papers and posts read 2026-10-30)"
          >
            9. Agentic RL
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Agentic RL (reinforcement learning) trains a model on whole episodes of tool use. One
            episode, also called a rollout, runs from a task prompt to a final answer: the model
            writes a tool call, a sandbox runs it, the output is appended to the context, and the
            model continues, turn after turn, until it submits. The policy, the model being trained
            seen as a probability distribution over its next token, learns through the same loop as
            single-answer RL: sample attempts, score them, make the better ones more likely. The
            reward, one number per episode, still arrives once, at the end.
          </Box>
          <Box variant="p">
            That moves the work into the environment: a sandbox to act in, tool interfaces the
            model can call, and a grader that scores the finished episode. The trainer meets a
            second challenge, credit assignment, working out which step earned the result, over a
            transcript that mixes the model&apos;s own tokens with text the tools wrote. Agentica
            and Together AI report how far a well-built environment can take a model: Qwen3-32B,
            trained with RL only on 64 H100 GPUs for six days, rose from 23% to 42.2% pass@1 (the
            chance that a single attempt succeeds) on SWE-Bench Verified, a set of human-validated
            GitHub issues scored by whether the repository&apos;s tests pass after the model&apos;s
            patch{' '}
            <Cite tier={2} href={DEEPSWE} kind="vendor-claim">
              DeepSWE post, introduction and Figure 2 (Agentica and Together AI)
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="See which tokens an update trains and where the single reward lands, before you write an environment"
          >
            One episode, one reward
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Every setup in this section has the shape below. The policy writes reasoning and a tool
            call. The environment executes the call and returns its output as text, which joins
            the context, so the model reads it on the next turn. Those tokens belong to the
            environment: the model conditions on them and did not choose them. The episode ends
            when the model submits, or when it hits a turn, length or time limit, and the grader
            scores the end state.
          </Box>
          <AgentLoopDiagram />
          <Box variant="small" color="text-body-secondary">
            Segment lengths are illustrative, not measured. The mask values follow TRL and verl at
            the pinned tags; the advantage row follows verl&apos;s GRPO estimator.
          </Box>
          <Box variant="p">
            The trainer separates the two kinds of token with a loss mask, one 0 or 1 per token
            that decides whether the token counts in the training loss. TRL (Transformers
            Reinforcement Learning, Hugging Face&apos;s post-training library) gives every
            tool-result token a 0 and multiplies that mask into the loss{' '}
            <Cite tier={1} href={trl('grpo_trainer.py', 'L2146-L2154')} kind="code">
              TRL grpo_trainer.py L2146-L2154
            </Cite>{' '}
            <Cite tier={1} href={trl('grpo_trainer.py', 'L3027')} kind="code">
              TRL grpo_trainer.py L3027
            </Cite>
            . verl, an open RL training framework, marks the tokens the model wrote with 1 and
            context tokens with 0, and its agent loop adds tool responses as context{' '}
            <Cite
              tier={1}
              href={verl('verl/utils/tokenizer/continuous_token.py', 'L398-L413')}
              kind="code"
            >
              verl continuous_token.py L398-L413
            </Cite>{' '}
            <Cite
              tier={1}
              href={verl('verl/experimental/agent_loop/tool_agent_loop.py', 'L386-L397')}
              kind="code"
            >
              verl tool_agent_loop.py L386-L397
            </Cite>
            . The papers make the same choice: Search-R1 masks retrieved passages and ReTool masks
            its interpreter output{' '}
            <Cite tier={3} href={SEARCH_R1} venue="COLM 2025">
              Search-R1, Section 3.1
            </Cite>{' '}
            <Cite tier={3} href={RETOOL} venue="preprint">
              ReTool, Section 2.3.2
            </Cite>
            . The mask shows in results. In Search-R1&apos;s ablation on Qwen2.5-7B with PPO
            (Proximal Policy Optimization), the average over seven question-answering datasets was
            0.431 with retrieved tokens masked and 0.343 without{' '}
            <Cite tier={3} href={SEARCH_R1} venue="COLM 2025">
              Search-R1, Table 4
            </Cite>
            .
          </Box>
          <Box variant="p">
            The reward is as sparse in the code as in the definition. verl writes the
            episode&apos;s score into the last response position of a tensor of zeros{' '}
            <Cite
              tier={1}
              href={verl('verl/experimental/agent_loop/agent_loop.py', 'L143-L148')}
              kind="code"
            >
              verl agent_loop.py L143-L148
            </Cite>
            . Its GRPO (Group Relative Policy Optimization) estimator sums each row back into one
            number, compares it with the other episodes sampled for the same prompt, and copies the
            resulting advantage, how much better this episode did than its group, onto every token
            whose mask is 1{' '}
            <Cite tier={1} href={verl('verl/trainer/ppo/core_algos.py', 'L304-L331')} kind="code">
              verl core_algos.py L304-L331
            </Cite>
            . Crediting the outcome to individual turns is left to the advantage estimator; the
            environment does none of it. Our reading of the code: a search that found the answer
            and a wasted search in the same episode get the same push, and only the comparison
            across many episodes tells them apart.
          </Box>
          <Box variant="p">
            What you write is the environment&apos;s side of that contract. In TRL it is a class:
            its methods are exposed as tools, a <code>reset</code> method starts each episode, and
            an optional <code>get_reward</code> method scores the finished rollout from the
            environment&apos;s own state. The feature is marked experimental{' '}
            <Cite tier={1} href={trl('grpo_trainer.py', 'L266-L281')}>
              TRL grpo_trainer.py L266-L281
            </Cite>
            .
          </Box>
          <ExpandableSection headerText="The lines that build the mask, place the reward and spread the advantage">
            <SpaceBetween size="s">
              <Box variant="p">
                Read at verl v0.9.1 and TRL v1.16.0. The first block puts the reward on the last
                position; the second sums it back and multiplies the group-normalised score by the
                response mask; the third and fourth build and apply the masks.
              </Box>
              <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>
                {`# verl verl/experimental/agent_loop/agent_loop.py L143-L148
# rm_scores: reward score for each token
rm_scores = torch.zeros_like(output["response_mask"], dtype=torch.float32)
rm_scores[-1] = reward_score

# verl verl/trainer/ppo/core_algos.py L304, L329 (GRPO outcome advantage)
scores = token_level_rewards.sum(dim=-1)
scores = scores.unsqueeze(-1) * response_mask

# verl verl/utils/tokenizer/continuous_token.py L399-L400, L412-L413
if merge_result.kind == "assistant":
    aligned_mask += [1] * merge_result.appended_token_count
elif merge_result.kind == "context":
    aligned_mask += [0] * merge_result.appended_token_count

# TRL trl/trainer/grpo_trainer.py L2154, L3027
tool_mask[idx_with_tool] += [0] * tool_length + [1] * post_tool_length
mask = completion_mask if "tool_mask" not in inputs else completion_mask * inputs["tool_mask"]`}
              </pre>
              <Box variant="p">
                verl&apos;s batched path places the score the same way, at the last valid response
                position of each row{' '}
                <Cite
                  tier={1}
                  href={verl('verl/experimental/agent_loop/agent_loop.py', 'L1093-L1099')}
                  kind="code"
                >
                  verl agent_loop.py L1093-L1099
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
            description="Copy the shape of an environment that already trained an agent: what it runs, what the model writes, what comes back, and how it is scored"
          >
            Five environments, four fields
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Each published setup answers four questions: the environment the agent acts in, the
            action it writes, the observation it receives, and the reward. Five setups span the
            range, from one search tool to a full repository in a container.
          </Box>
          <EnvironmentsTable />
          <Box variant="p">
            Every reward checks the outcome, and none pays for calling a tool. ReTool leaves out a
            reward for code that runs, to limit reward hacking{' '}
            <Cite tier={3} href={RETOOL} venue="preprint">
              ReTool, Section 2.3
            </Cite>
            , and Search-R1 uses neither a format reward nor a learned reward model{' '}
            <Cite tier={3} href={SEARCH_R1} venue="COLM 2025">
              Search-R1, Section 3.4
            </Cite>
            . In our reading, the model learns to call a tool to the extent that calling it raises
            the outcome score.
          </Box>
          <Box variant="p">
            The simplest environment executes nothing. SWE-RL scores one response by its text
            similarity to the patch that was merged, so its environment is a dataset of issues,
            file contents and patches. Trained this way, Llama3-SWE-RL-70B, built on
            Llama-3.3-70B-Instruct, solved 41.0% of SWE-Bench Verified inside Agentless Mini, a
            pipeline scaffold{' '}
            <Cite tier={3} href={SWE_RL} venue="NeurIPS 2025">
              SWE-RL, Sections 1 and 3.1
            </Cite>
            . The graded similarity is what made that reward learnable: with an exact-match reward
            instead, the average reward stayed near zero to the end of training, because real
            patches vary too much to match exactly{' '}
            <Cite tier={3} href={SWE_RL} venue="NeurIPS 2025">
              SWE-RL, Figure 5
            </Cite>
            . At the other end, DeepSWE&apos;s environment executes everything: it gives the agent
            a terminal in each task&apos;s own Docker image and grades the submitted patch by
            running tests{' '}
            <Cite tier={2} href={DEEPSWE}>
              DeepSWE post, Sections 2.1 and 2.2
            </Cite>
            .
          </Box>
          <Box variant="p">
            Past a handful of environments, the interface itself becomes infrastructure. Kimi
            K2&apos;s RL runs on a Gym-like framework with a unified interface, modelled on OpenAI
            Gym, for adding environments. It mixes tasks with verifiable rewards and, for
            subjective tasks such as creative writing, a self-critique rubric reward, in which the
            model&apos;s own critic ranks responses by pairwise comparison against rubrics{' '}
            <Cite tier={3} href={KIMI_K2} venue="preprint">
              Kimi K2 report, Sections 3.2 and 3.3.4
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Separate a warm start from RL, and reliability from reach, before you trust an agent's headline number"
          >
            Read an agent&apos;s gain as a pass@k curve
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Headline numbers in agentic RL often fold several stages together. On
            Qwen2.5-32B-Instruct, ReTool reports 67.0% on AIME 2024 (a US competition-math exam
            whose integer answers a rule can check) after 400 RL steps, against 40.0% after 1,080
            steps of RL without the code tool, with responses about 40% shorter after RL{' '}
            <Cite tier={3} href={RETOOL} venue="preprint">
              ReTool, Section 1
            </Cite>
            . Its RL starts from a cold start, SFT (supervised fine-tuning) on code-augmented
            reasoning traces, and that stage alone reached 40.9%, from 26.7% for the untrained
            model{' '}
            <Cite tier={3} href={RETOOL} venue="preprint">
              ReTool, Section 1
            </Cite>
            . In our arithmetic from those figures, the cold start accounts for 14.2 of the 40.3
            points and RL with the tool for the other 26.1.
          </Box>
          <Box variant="p">
            The same question applies to the number that opened this section. Agentica and
            Together AI report 23% to 42.2% pass@1 for Qwen3-32B with RL only, the 42.2% averaged
            over 16 runs, and 71.0% pass@16, the chance that at least one of 16 attempts succeeds{' '}
            <Cite tier={2} href={DEEPSWE} kind="vendor-claim">
              DeepSWE post, introduction and Figure 2 (Agentica and Together AI)
            </Cite>
            . A pass@16 for the base Qwen3-32B in the same setup was not located in this research,
            so whether RL widened what the model can solve, or made it more reliable at what it
            could already solve, stays open for this result.
          </Box>
          <Box variant="p">
            Section 8, What RL Does to a Model, reads that difference as a curve: pass@k is the
            chance that at least one of k attempts succeeds, and on static reasoning the base model
            tends to catch up as k grows. One small study asked the question of a search agent.
            Qwen2.5-7B-Instruct got one tool, a keyword search over ten paragraphs per question
            (two relevant, eight distractors), and was trained with LoRA (Low-Rank Adaptation, a
            small trainable add-on to frozen weights) GRPO on 200 problems, with 100 test problems
            per category, k up to 64 and up to five tool rounds{' '}
            <Cite tier={3} href={PASS_KT} venue="preprint">
              Pass@(k,T), Section 3
            </Cite>
            . On bridge questions, where the second search depends on what the first one found,
            tool-use RL ended above the base at large k, 0.81 against 0.77 at k = 64, a margin of
            about four problems, and the gap widened as k grew. At k = 1 the base was slightly
            ahead, 0.363 against 0.335. SFT on expert trajectories for the same 200 problems ended
            at 0.73{' '}
            <Cite tier={3} href={PASS_KT} venue="preprint">
              Pass@(k,T), Sections 4.1 and 4.2
            </Cite>
            .
          </Box>
          <Box variant="p">
            Both trained models saw the same problems, and the authors attribute the difference to
            the learning signal, imitation against self-directed exploration under a binary reward{' '}
            <Cite tier={3} href={PASS_KT} venue="preprint">
              Pass@(k,T), Section 4.1
            </Cite>
            . In their mechanism analysis, RL reweighted strategies the base model already had
            toward those whose later reasoning more often reached the right answer, and the gain
            sat in how the agent used what it retrieved rather than in what it searched for{' '}
            <Cite tier={3} href={PASS_KT} venue="preprint">
              Pass@(k,T), abstract
            </Cite>
            . Our reading: the tool supplies information the model does not hold, and RL taught it
            to use that information, which fits the tool condition of section 8. It is the clearest
            boundary expansion located in the agentic setting in this research, and it is small.
          </Box>
          <ExpandableSection headerText="How far the pass@(k,T) result reaches">
            <SpaceBetween size="s">
              <Box variant="p">
                One base model, 200 training problems and 100 test problems per category; the
                authors did not repeat the pipeline on other models. On comparison questions, where
                the two searches are independent, RL behaved as in static reasoning, and the
                expansion appeared only on the sequential bridge questions{' '}
                <Cite tier={3} href={PASS_KT} venue="preprint">
                  Pass@(k,T), abstract and limitations
                </Cite>
                .
              </Box>
              <Box variant="p">
                Four problems in 100 is about one binomial standard error at a pass rate near 0.8,
                in our arithmetic: <code>sqrt(0.8 * 0.2 / 100) = 0.04</code>. The RL arm is a LoRA
                adapter, and k stops at 64, below the sample counts of the static-reasoning studies
                in section 8.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Size the sandbox fleet before the GPUs, and set the episode rules that keep a multi-turn run training"
          >
            The environment is a fleet
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            An environment that executes code is a container per attempt. In DeepSWE&apos;s final
            run, each RL iteration started 512 Docker containers in parallel, a batch of 64 tasks
            with 8 attempts each; with parallel experiments on top, this overloaded Docker&apos;s
            API server and crashed the Docker daemon, and the team moved scheduling to Kubernetes,
            on worker nodes of about 200 CPU cores each{' '}
            <Cite tier={2} href={DEEPSWE}>
              DeepSWE post, Section 2.2 (Agentica and Together AI)
            </Cite>
            . Kimi K2&apos;s software-engineering environment runs on Kubernetes sandboxes with over
            10,000 concurrent instances{' '}
            <Cite tier={3} href={KIMI_K2} venue="preprint">
              Kimi K2 report, Section 3.2.1
            </Cite>
            . While rollouts wait on an environment the GPUs sit idle, so Kimi K2 runs heavy
            environments as dedicated services, keeps many rollouts in flight to hide their
            latency, and pauses very long episodes to resume them in the next iteration, a
            technique called partial rollout{' '}
            <Cite tier={3} href={KIMI_K2} venue="preprint">
              Kimi K2 report, Section 3.3.4
            </Cite>
            .
          </Box>
          <Box variant="p">
            Two episode rules from these runs keep training stable. DeepSWE&apos;s compact
            filtering masks out of the loss any episode that hits the context limit, the step limit
            or a timeout. An agent can stumble on a passing patch without knowing it, and
            rewarding those episodes reinforced the steps that followed until the reward
            collapsed; with the filter, reward goes only to episodes the agent ends by submitting{' '}
            <Cite tier={2} href={DEEPSWE}>
              DeepSWE post, Section 2.3 (Agentica and Together AI)
            </Cite>
            .
          </Box>
          <Box variant="p">
            RAGEN names a recurring collapse in multi-turn training the Echo Trap: the spread of
            rewards within a group collapses, entropy (how spread out the model&apos;s next-token
            distribution is) drops, and gradients spike. Training only on the prompts whose
            episodes disagree most delays it. Under PPO, keeping 75% of rollouts extended stable
            training on FrozenLake from 100 to 140 steps, and keeping 50% avoided collapse{' '}
            <Cite tier={3} href={RAGEN} venue="preprint">
              RAGEN, Sections 4.1 and 4.2
            </Cite>
            . The filter applies section 7&apos;s rule to whole episodes: a group whose episodes
            all score the same has zero advantage and carries no gradient.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Build the environment and its grader first: on a managed service, they are the part you own"
          >
            What you bring to managed multi-turn RL
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The split in this section&apos;s diagram is also the contract of SageMaker AI&apos;s
            managed multi-turn RL. SageMaker sends prompts from your dataset to your agent and
            updates the policy model; your agent calls the policy model for each turn, takes
            actions in your environment such as calling tools, and reports a reward for the
            complete rollout{' '}
            <Cite tier={1} href={SM_MTRL_AGENT}>
              SageMaker AI Developer Guide: Preparing your agent
            </Cite>
            . The model&apos;s tokens and the update belong to the service; the sandbox, the tools
            and the grader belong to you. Section 23, RL &amp; Learning Loops on AWS, covers the
            service.
          </Box>
          <Box variant="p">
            Whichever trainer runs the update, the first deliverable is the environment: a reset
            into a task, tools that return text, limits on turns, length and time, and a grader
            that runs once per episode and that the agent cannot satisfy without doing the task
            (section 10, The Reward Is a Proxy, gives the checklist). Before training, run the
            untrained model through it and measure how often it succeeds. Agentica and Together
            AI&apos;s run started at 23% pass@1 and reached 42.2%{' '}
            <Cite tier={2} href={DEEPSWE} kind="vendor-claim">
              DeepSWE post, Figure 2 (Agentica and Together AI)
            </Cite>
            ; a task the model never solves gives every episode in a group the same zero, and
            leaves RL nothing to learn from.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
