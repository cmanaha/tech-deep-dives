import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';
import { Cite, arxiv, gh, VERL_TAG } from '../components/Cite';

/* ------------------------------------------------------------------------ */
/* Sources                                                                  */
/* ------------------------------------------------------------------------ */

const AD = arxiv('2210.14215v1');
const DPT = arxiv('2306.14892v1');
const EXPLORE = arxiv('2403.15371v3');
const GREEDY = arxiv('2504.16078v1');
const EXPLOIT = arxiv('2502.00225v4');
const WHO_WHEN = arxiv('2505.00212v3');
const TRAIL = arxiv('2505.08638v3');
const RULER = arxiv('2404.06654v3');
const MIDDLE = arxiv('2307.03172v3');
const COMPACT = arxiv('2610.31710v2');
const ANTHROPIC_CACHING = 'https://platform.claude.com/docs/en/build-with-claude/prompt-caching';
const BEDROCK_CACHING = 'https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-caching.html';

function verl(path: string, lines?: string) {
  return gh('volcengine/verl', VERL_TAG, path, lines);
}

/* ------------------------------------------------------------------------ */
/* Diagram: the context as a working set with a cliff                       */
/* ------------------------------------------------------------------------ */

/** GPT-4's RULER row (Table 3): average of 13 tasks at each length. */
const RULER_GPT4: { label: string; score: number }[] = [
  { label: '4K', score: 96.6 },
  { label: '8K', score: 96.3 },
  { label: '16K', score: 95.2 },
  { label: '32K', score: 93.2 },
  { label: '64K', score: 87.0 },
  { label: '128K', score: 81.2 },
];
const RULER_THRESHOLD = 85.6;

const PLOT_X0 = 150;
const PLOT_DX = 128;
const PLOT_TOP = 70;
const PLOT_BOTTOM = 220;
/** Score axis runs from 75 (bottom) to 100 (top). */
const scoreY = (s: number) => PLOT_BOTTOM - ((s - 75) / 25) * (PLOT_BOTTOM - PLOT_TOP);
const lenX = (i: number) => PLOT_X0 + i * PLOT_DX;

interface Segment {
  x: number;
  w: number;
  label: string;
  stable: boolean;
}

const STRIP_Y = 352;
const STRIP_H = 46;
const SEGMENTS: Segment[] = [
  { x: 40, w: 110, label: 'tools', stable: true },
  { x: 150, w: 180, label: 'system prompt', stable: true },
  { x: 330, w: 140, label: 'instructions', stable: true },
  { x: 470, w: 140, label: 'playbook', stable: false },
  { x: 610, w: 110, label: 'notes', stable: false },
  { x: 720, w: 140, label: 'log, task state', stable: false },
];
const EDIT_X = 310;

function ContextCliffDiagram() {
  const pts = RULER_GPT4.map((p, i) => ({ ...p, x: lenX(i), y: scoreY(p.score) }));
  const line = pts.map((p) => `${p.x},${p.y}`).join(' ');
  const thrY = scoreY(RULER_THRESHOLD);
  const effX = lenX(4);
  const claimX = lenX(5);
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 900 500"
        role="img"
        aria-labelledby="words-limits-cliff-title"
        aria-describedby="words-limits-cliff-desc"
        style={{ width: '100%', minWidth: 680, height: 'auto' }}
      >
        <title id="words-limits-cliff-title">
          A context window is a working set with a cliff: GPT-4 claimed 128K tokens and held
          RULER&apos;s threshold only to 64K, and in a prompt laid out for caching, an edit in the
          stable prefix sends everything after it back to full price.
        </title>
        <desc id="words-limits-cliff-desc">
          Top panel, measured: GPT-4&apos;s average RULER score at 4K, 8K, 16K, 32K, 64K and 128K
          tokens is 96.6, 96.3, 95.2, 93.2, 87.0 and 81.2, against a threshold of 85.6, so its
          effective length is 64K. Bottom panel, illustrative: a context laid out as a stable
          prefix of tools, system prompt and instructions, followed by an evolving suffix of
          playbook, notes and log. An edit inside the system prompt invalidates the cache for
          everything to its right. Below the strip, the start and end of a long context are used
          best and the middle worst.
        </desc>
        <style>{`
          .wlc-t   { fill: #16191f; font: 600 13px sans-serif; }
          .wlc-s   { fill: #5f6b7a; font: 12px sans-serif; }
          .wlc-sm  { fill: #5f6b7a; font: 11px sans-serif; }
          .wlc-v   { fill: #0f1b2a; font: 600 12px sans-serif; text-anchor: middle; paint-order: stroke; stroke: #ffffff; stroke-width: 3px; }
          .wlc-vw  { fill: #8b6c00; font: 600 12px sans-serif; text-anchor: middle; paint-order: stroke; stroke: #ffffff; stroke-width: 3px; }
          .wlc-ax  { stroke: #879596; stroke-width: 1; }
          .wlc-grid { stroke: #e9ebed; stroke-width: 1; }
          .wlc-thr { stroke: #8b6c00; stroke-width: 1.5; stroke-dasharray: 6 4; }
          .wlc-mark { stroke: #414d5c; stroke-width: 1.2; stroke-dasharray: 3 3; }
          .wlc-line { stroke: #0972d3; stroke-width: 2.5; fill: none; }
          .wlc-seg-st { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.2; }
          .wlc-seg-ev { fill: #e6f4f2; stroke: #1f7a70; stroke-width: 1.2; }
          .wlc-segt { fill: #0f1b2a; font: 600 12px sans-serif; text-anchor: middle; }
          .wlc-miss { fill: #ec7211; }
          .wlc-edit { stroke: #d91515; stroke-width: 3; }
          .wlc-editt { fill: #b0170e; font: 600 12px sans-serif; }
          .wlc-br  { stroke: #414d5c; stroke-width: 1.2; fill: none; }
          .wlc-div { stroke: #d1d5db; stroke-width: 1; stroke-dasharray: 5 4; }
        `}</style>
        <defs>
          <linearGradient id="wlc-pos-grad" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#037f0c" stopOpacity="0.55" />
            <stop offset="50%" stopColor="#ec7211" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#037f0c" stopOpacity="0.55" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="900" height="500" rx="8" fill="#ffffff" />

        {/* Panel 1: measured RULER row */}
        <text x="40" y="30" className="wlc-t">
          Measured: GPT-4 on RULER, average of 13 tasks at each length (Table 3)
        </text>
        {[75, 80, 85, 90, 95, 100].map((s) => (
          <g key={s}>
            <line x1={PLOT_X0 - 20} x2={claimX + 30} y1={scoreY(s)} y2={scoreY(s)} className="wlc-grid" />
            <text x={PLOT_X0 - 28} y={scoreY(s) + 4} className="wlc-sm" textAnchor="end">
              {s}
            </text>
          </g>
        ))}
        <text x="40" y={PLOT_TOP + 70} className="wlc-sm">
          score
        </text>
        <text x="40" y={PLOT_TOP + 85} className="wlc-sm">
          (%)
        </text>
        <line x1={PLOT_X0 - 20} x2={PLOT_X0 - 20} y1={PLOT_TOP} y2={PLOT_BOTTOM} className="wlc-ax" />
        <line x1={PLOT_X0 - 20} x2={claimX + 30} y1={PLOT_BOTTOM} y2={PLOT_BOTTOM} className="wlc-ax" />
        <line x1={PLOT_X0 - 20} x2={claimX + 30} y1={thrY} y2={thrY} className="wlc-thr" />
        <text x={PLOT_X0 - 10} y={thrY + 16} className="wlc-sm">
          threshold 85.6: Llama2-7B&apos;s score at 4K
        </text>
        <line x1={effX} x2={effX} y1={PLOT_TOP - 12} y2={PLOT_BOTTOM} className="wlc-mark" />
        <line x1={claimX} x2={claimX} y1={PLOT_TOP - 12} y2={PLOT_BOTTOM} className="wlc-mark" />
        <text x={effX} y={PLOT_TOP - 18} className="wlc-v">
          effective: 64K
        </text>
        <text x={claimX} y={PLOT_TOP - 18} className="wlc-v">
          claimed: 128K
        </text>
        <polyline points={line} className="wlc-line" />
        {pts.map((p) => {
          const below = p.score < RULER_THRESHOLD;
          return (
            <g key={p.label}>
              <circle
                cx={p.x}
                cy={p.y}
                r="5"
                fill={below ? '#ec7211' : '#0972d3'}
                stroke="#ffffff"
                strokeWidth="1.5"
              />
              <text
                x={p.x + (p.x >= effX ? 30 : 0)}
                y={p.x >= effX ? p.y - 6 : p.y - 10}
                className={below ? 'wlc-vw' : 'wlc-v'}
              >
                {p.score.toFixed(1)}
              </text>
              <text x={p.x} y={PLOT_BOTTOM + 18} className="wlc-s" textAnchor="middle">
                {p.label}
              </text>
            </g>
          );
        })}
        <text x={(PLOT_X0 + claimX) / 2} y={PLOT_BOTTOM + 36} className="wlc-sm" textAnchor="middle">
          context length in tokens (doubling at each step)
        </text>

        <line x1="20" x2="880" y1="272" y2="272" className="wlc-div" />

        {/* Panel 2: illustrative layout of one context for prefix caching */}
        <text x="40" y="298" className="wlc-t">
          Illustrative, not measured: one context laid out for prefix caching
        </text>
        <path d={`M 40 336 L 40 330 L 470 330 L 470 336`} className="wlc-br" />
        <path d={`M 470 336 L 470 330 L 860 330 L 860 336`} className="wlc-br" />
        <text x="255" y="322" className="wlc-s" textAnchor="middle">
          stable prefix: identical every iteration
        </text>
        <text x="665" y="322" className="wlc-s" textAnchor="middle">
          evolving suffix: appended each iteration
        </text>
        {SEGMENTS.map((s) => (
          <g key={s.label}>
            <rect
              x={s.x}
              y={STRIP_Y}
              width={s.w}
              height={STRIP_H}
              className={s.stable ? 'wlc-seg-st' : 'wlc-seg-ev'}
            />
            <text x={s.x + s.w / 2} y={STRIP_Y + STRIP_H / 2 + 4} className="wlc-segt">
              {s.label}
            </text>
          </g>
        ))}
        <rect x={EDIT_X} y={STRIP_Y + STRIP_H + 6} width={860 - EDIT_X} height="6" rx="3" className="wlc-miss" />
        <line x1={EDIT_X} x2={EDIT_X} y1={STRIP_Y - 10} y2={STRIP_Y + STRIP_H + 14} className="wlc-edit" />
        <text x={EDIT_X + 8} y={STRIP_Y + STRIP_H + 30} className="wlc-editt">
          one edit here: everything to its right misses the cache and is billed again
        </text>

        <rect x="40" y="446" width="820" height="10" rx="5" fill="url(#wlc-pos-grad)" />
        <text x="40" y="476" className="wlc-sm">
          start: used best
        </text>
        <text x="450" y="476" className="wlc-sm" textAnchor="middle">
          middle of a long context: used worst
        </text>
        <text x="860" y="476" className="wlc-sm" textAnchor="end">
          end: used best
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function WhereWordsFallShort() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Where frozen models fall short, and the loop designs that work around it: keep the statistics in code, size memory to the length a model still uses, and put the evolving context after the stable part (verl v0.9.1 and sources read 2026-10-30)"
          >
            17. Where Words Fall Short
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A text loop asks a frozen model to do three jobs that RL (reinforcement learning) does
            with weight updates and statistics over many attempts: explore, by trying options of
            unknown value; assign credit, by working out which step earned the result; and carry
            what it has learned in a context window. The studies read for this dive say a frozen
            model proposes well and keeps score poorly, and that its context behaves like a
            working set with a cliff.
          </Box>
          <Box variant="p">
            One measurement carries the section. Asked to compute a standard exploration rule
            before each choice, Gemma2 27B computed it correctly in 87% of its rationales, and
            even when its rationale was correct it chose the greedy action more often than the
            optimal one, 58% against 21%{' '}
            <Cite tier={3} href={GREEDY} venue="preprint">
              LLMs are Greedy Agents, Section 4.2
            </Cite>
            . The blocks below take the evidence gap by gap, each with the loop design that covers
            it, and the last block turns them into three changes to make.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Know which models learn from reward inside their context, and why, so you can predict what the general LLM in your loop will do"
          >
            In-context RL is trained in
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            In-context RL is a policy, whatever chooses the next action, that gets better across
            episodes, complete attempts at a task, inside one context and with its weights
            untouched. It exists, and it is trained in. Algorithm Distillation (AD) trains a
            transformer on learning histories, the logged episodes of an RL algorithm as it
            improves, and the result &quot;is able to improve its policy entirely in-context
            without updating its network parameters&quot;{' '}
            <Cite tier={3} href={AD} venue="ICLR 2023">
              Algorithm Distillation, Abstract
            </Cite>
            . DPT (Decision-Pretrained Transformer) trains a transformer to predict the optimal
            action from a set of interactions with a task, across many tasks, and that set may be
            random interactions, expert demonstrations or an algorithm&apos;s rollouts{' '}
            <Cite tier={3} href={DPT} venue="NeurIPS 2023">
              DPT, Section 3
            </Cite>
            . The pretrained model then explores online and acts conservatively offline,
            &quot;despite not being explicitly trained to do so&quot;{' '}
            <Cite tier={3} href={DPT} venue="NeurIPS 2023">
              DPT, Abstract
            </Cite>
            .
          </Box>
          <Box variant="p">
            Our reading of these studies: both models were trained on many decision tasks, with
            targets built for deciding, the next action of an improving learner or the optimal
            action. A general chat model was trained for other targets, so whether it learns from
            reward inside its context is a question for experiment. DPT&apos;s authors leave the
            transfer open: &quot;further investigation is required to understand the
            implications of these findings for existing foundation models, such as
            instruction-finetuned models&quot;{' '}
            <Cite tier={3} href={DPT} venue="NeurIPS 2023">
              DPT, Limitations and future work
            </Cite>
            . The next block shows what such models did when tested.
          </Box>
          <ExpandableSection headerText="What Algorithm Distillation and DPT needed in order to learn in context">
            <SpaceBetween size="s">
              <Box variant="p">
                <Box variant="strong" display="inline">
                  Learning progress in the data.
                </Box>{' '}
                AD&apos;s control, Expert Distillation (ED), uses the same
                architecture and context but trains on expert trajectories only, rather than
                learning histories. &quot;AD maximizes the episodic return with in-context RL
                while ED does not learn&quot;{' '}
                <Cite tier={3} href={AD} venue="ICLR 2023">
                  Algorithm Distillation, Figure 4
                </Cite>
                .
              </Box>
              <Box variant="p">
                <Box variant="strong" display="inline">
                  Room for several episodes.
                </Box>{' '}
                The context has to span episodes: &quot;multi-episodic contexts of 2-4 episodes
                are necessary to learn a near-optimal in-context RL algorithm&quot;, and the
                authors name long episodes as the method&apos;s main limitation{' '}
                <Cite tier={3} href={AD} venue="ICLR 2023">
                  Algorithm Distillation, Figure 7 and Conclusion
                </Cite>
                . An agentic coding episode is long, so a context that cannot hold several
                attempts and their outcomes cannot learn across them in this sense (our reading).
              </Box>
              <Box variant="p">
                <Box variant="strong" display="inline">
                  An exact fit, for the theory.
                </Box>{' '}
                DPT &quot;can be viewed as an efficient implementation of Bayesian posterior
                sampling, a provably sample-efficient RL algorithm&quot;{' '}
                <Cite tier={3} href={DPT} venue="NeurIPS 2023">
                  DPT, Abstract
                </Cite>
                , under the assumption that the model &quot;fits the pretraining distribution
                exactly with enough coverage and data&quot;{' '}
                <Cite tier={3} href={DPT} venue="NeurIPS 2023">
                  DPT, Section 6
                </Cite>
                . Its training needs optimal-action labels; actions from another RL-trained agent
                worked in their place with &quot;a slight loss in performance&quot;{' '}
                <Cite tier={3} href={DPT} venue="NeurIPS 2023">
                  DPT, Limitations and future work
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
            description="See where a frozen model chooses well and where it needs code beside it: in the bandit studies the model proposes and code keeps score"
          >
            Strong proposers, weak statisticians
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The cleanest test of exploration is a multi-armed bandit: repeated choices among
            options with unknown payoffs, where each round the agent either explores, trying an
            option it knows little about, or exploits, taking the option with the best average
            reward so far, the greedy choice. Across
            GPT-3.5, GPT-4 and Llama2 with many prompt designs, only one configuration explored
            satisfactorily: GPT-4 with chain-of-thought reasoning and an externally summarised
            history, the number of plays and average reward of each option computed outside the
            model. Configurations with chain-of-thought and an unsummarised history did not{' '}
            <Cite tier={3} href={EXPLORE} venue="NeurIPS 2024">
              Krishnamurthy et al., Abstract and Section 2
            </Cite>
            .
          </Box>
          <Box variant="p">
            A second study found the pattern in Gemma2 from 2B to 27B parameters. On ten-armed
            bandits the 2B model tried 40% of the options and the 9B and 27B models 65%, and
            &quot;the model prematurely commits to a greedy strategy&quot;{' '}
            <Cite tier={3} href={GREEDY} venue="preprint">
              LLMs are Greedy Agents, Section 4.2
            </Cite>
            . The same study measured a knowing-doing gap on one model. Gemma2 27B was asked to
            write out the UCB (Upper Confidence Bound) rule, which adds a bonus to options tried
            less often, compute its values, and act on them. It computed them correctly in 87% of
            its rationales, and even when its rationale was correct it chose the greedy action
            more often than the optimal one: 58% against 21%{' '}
            <Cite tier={3} href={GREEDY} venue="preprint">
              LLMs are Greedy Agents, Section 4.2 and Figure 5
            </Cite>
            . Writing the rule down did not make the model follow it.
          </Box>
          <Box variant="p">
            Exploitation alone, picking the best action from a logged history of rewards, goes
            better. The models tested, GPT-5.2 among them, did well on small problems and
            degraded as problems grew, and reasoning models did best. On contextual bandits, where
            the best option depends on information given each round, every model tested stayed
            below a simple linear regression, including with the mitigations tried, a code
            interpreter and in-context summaries: &quot;all LLMs we study perform worse than a
            simple linear regression, even in non-linear settings&quot;{' '}
            <Cite tier={3} href={EXPLOIT} venue="UAI 2026">
              Should You Use Your LLM to Explore or Exploit?, Abstract and Section 1
            </Cite>
            . The same study found the models useful as proposers of candidate actions in large,
            semantically meaningful action spaces, a short list that &quot;can then be used to
            instantiate an off-the-shelf bandit algorithm&quot;{' '}
            <Cite tier={3} href={EXPLOIT} venue="UAI 2026">
              Should You Use Your LLM to Explore or Exploit?, Abstract and Section 1
            </Cite>
            .
          </Box>
          <Box variant="p">
            Our reading of these studies: a frozen model is a strong proposer and a weak
            statistician. It suggests plausible options well, and it does not reliably turn a
            history of numbers into the right next choice, even when it can state the rule. The
            design that follows keeps the counts, the averages and the choice rule in code and
            hands the model a summary, which is the one configuration that explored in the first
            study.
          </Box>
          <ExpandableSection headerText="The scope of the bandit results, and what has not been rerun">
            <SpaceBetween size="s">
              <Box variant="p">
                The exploration failure was measured on GPT-3.5, GPT-4 and Llama2 in a NeurIPS 2024
                paper and on Gemma2 in a 2025 preprint. A rerun of the same bandit protocol on 2026
                reasoning models was not located during this research. In the exploitation-only
                test, GPT-5-family reasoning models did best and still trailed a linear regression
                on contextual bandits. Its authors connect the two results (MAB is their
                abbreviation for multi-armed bandit): &quot;Frontier models can now solve fairly
                complicated MAB exploit puzzles. In contrast, Gpt-4 and Gpt-3.5 struggle,
                partially explaining their failure on end-to-end MAB tasks&quot;, citing
                Krishnamurthy et al. and a second 2024 study{' '}
                <Cite tier={3} href={EXPLOIT} venue="UAI 2026">
                  Should You Use Your LLM to Explore or Exploit?, Section 2
                </Cite>
                .
              </Box>
              <Box variant="p">
                Tool use was tested on the GPT-4 family, because the GPT-5 models were not
                configured for it at the time of writing. A code interpreter lifted GPT-4 above
                GPT-5.2 in one numerical contextual-bandit setting, and made it much slower and
                more expensive{' '}
                <Cite tier={3} href={EXPLOIT} venue="UAI 2026">
                  Should You Use Your LLM to Explore or Exploit?, Section 2 and Figure 2
                </Cite>
                .
              </Box>
              <Box variant="p">
                The knowing-doing gap was measured on Gemma2 27B only, over 64 parallel
                environments for 50 steps each. The paper&apos;s introduction gives the greedy
                share as 64% of actions when the rationale is correct; Section 4.2 and Figure 5
                give 58% greedy against 21% optimal, the figures used here{' '}
                <Cite tier={3} href={GREEDY} venue="preprint">
                  LLMs are Greedy Agents, Introduction and Section 4.2
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
            description="Know how often a model reading a failed run finds the step that caused it, before you trust a reflection to fix the right thing"
          >
            Credit assignment: many rollouts against one log
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Credit assignment is working out which step earned the result. RL on the weights and a
            text loop on the context do it differently, in our reading of these studies. RL
            assigns it statistically, across many rollouts, the sampled attempts. verl, for one,
            writes an episode&apos;s reward into the last response position of a tensor of
            zeros{' '}
            <Cite
              tier={1}
              href={verl('verl/experimental/agent_loop/agent_loop.py', 'L143-L148')}
              kind="code"
            >
              verl agent_loop.py L143-L148
            </Cite>
            , and its GRPO (Group Relative Policy Optimization) estimator copies the advantage,
            how much better this attempt did than the others sampled for the same prompt, onto
            every response token{' '}
            <Cite tier={1} href={verl('verl/trainer/ppo/core_algos.py', 'L304-L331')} kind="code">
              verl core_algos.py L304-L331
            </Cite>
            . A good step and a wasted one in the same attempt get the same push. Across thousands
            of attempts, the steps that recur in high-scoring attempts gain probability and the
            rest wash out. Section 9, Agentic RL, walks through that code.
          </Box>
          <Box variant="p">
            A text loop assigns credit by reading one log, and it has to name the step that
            mattered. On failure logs from 127 LLM multi-agent systems, the Who&amp;When dataset,
            the best automated method
            identified the responsible agent 53.5% of the time and the decisive step 14.2% of the
            time, with some methods below random{' '}
            <Cite tier={3} href={WHO_WHEN} venue="ICML 2025">
              Which Agent Causes Task Failures and When?, Abstract
            </Cite>
            . Accuracy fell as logs grew, step-level accuracy most, and at the longest contexts all
            three methods tested converged to near 0%{' '}
            <Cite tier={3} href={WHO_WHEN} venue="ICML 2025">
              Which Agent Causes Task Failures and When?, Section 4.4
            </Cite>
            . On single-agent traces from a coding agent working SWE-bench tasks (a
            software-engineering benchmark), the best of eight models acting as a separate judge
            located the annotated error 23.8% of the time, and three of the eight could not fit
            the traces in context{' '}
            <Cite tier={3} href={TRAIL} venue="preprint">
              TRAIL (Trace Reasoning and Agentic Issue Localization), Table 1
            </Cite>
            .
          </Box>
          <Box variant="p">
            Whether a coding agent&apos;s own reflection blames the right step when its tests fail
            was not measured in any study located during this research. Both figures above come
            from a separate model reading a trace it did not write. The design that follows makes
            credit cheap to assign, so the model never has to find it: one change per trial, so
            the score belongs to that change, as in section 15&apos;s checklist, and a short log
            per attempt, since accuracy fell as logs grew (our reading).
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Size a loop's memory to the length a model still uses, and place its edits so they do not re-price the whole prompt"
          >
            The context is a working set with a cliff
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A context window behaves like a working set: up to some length the model uses what is
            in it, and past that length performance falls away. RULER, a synthetic benchmark that
            measures the length at which a model still performs, sets the bar at Llama2-7B&apos;s
            score at 4K tokens, 85.6%, and calls the longest length above it the effective length.
            GPT-4 claimed 128K and held to 64K: it scored 96.6, 96.3, 95.2 and 93.2 from 4K to
            32K, 87.0 at 64K, then 81.2 at 128K{' '}
            <Cite tier={3} href={RULER} venue="COLM 2024">
              RULER, Table 3
            </Cite>
            . Of the models tested, all claiming 32K or more, only half held up at 32K{' '}
            <Cite tier={3} href={RULER} venue="COLM 2024">
              RULER, Abstract
            </Cite>
            . Position matters inside that length too. Performance is &quot;often highest when
            relevant information occurs at the beginning or end of the input context&quot;, and it
            degrades when the model must use information in the middle{' '}
            <Cite tier={3} href={MIDDLE} venue="TACL 2023">
              Lost in the Middle, Abstract
            </Cite>
            .
          </Box>
          <ContextCliffDiagram />
          <Box variant="small" color="text-body-secondary">
            Top: GPT-4&apos;s row of RULER Table 3; the orange point is the one below the
            threshold. Bottom: a schematic layout of one context, with the position finding from
            Lost in the Middle drawn under it. Illustrative, not measured.
          </Box>
          <Box variant="p">
            Edits re-price the context. Prompt caching reuses work only for an exact prefix. On the
            Claude API a hit needs &quot;100 percent identical prompt segments&quot;, the cache
            runs through tools, then system, then messages, and a change at one level invalidates
            that level and every level after it{' '}
            <Cite tier={1} href={ANTHROPIC_CACHING}>
              Anthropic docs: prompt caching
            </Cite>
            . Amazon Bedrock applies the same rule: &quot;Changes to a prompt prefix in
            subsequent requests result in cache misses.&quot; On Bedrock&apos;s implicit caching,
            static content first and dynamic content last raises the chance of an exact prefix
            match, and a hit is best effort: &quot;Repeating an identical prompt doesn&apos;t
            guarantee a cache hit&quot;{' '}
            <Cite tier={1} href={BEDROCK_CACHING}>
              Amazon Bedrock user guide: prompt caching
            </Cite>
            . How a serving engine finds and reuses the matching prefix is in the{' '}
            <Link href="../vllm/">vLLM dive, section 6: Automatic Prefix Caching</Link>.
          </Box>
          <Box variant="p">
            The price of an edit follows from the multipliers. On the Claude API a cache read costs
            0.1 times the base input price on most models, and a five-minute cache write 1.25
            times{' '}
            <Cite tier={1} href={ANTHROPIC_CACHING}>
              Anthropic docs: prompt caching, Pricing
            </Cite>
            . Edit one line near the top of the context and every token after it moves from the
            read price back to the full input price, and to the write price if you cache it again:
            1.25 divided by 0.1, or 12.5 times the read price per token, in our arithmetic. Our
            reading: a loop that rewrites the top of its context every iteration pays that on the
            whole context every iteration and never collects the read price.
          </Box>
          <ExpandableSection headerText="Fresh context or one long compacted session">
            <SpaceBetween size="s">
              <Box variant="p">
                Practitioners answer the cliff in two ways: restart each iteration with a fresh
                context and keep state in files, as the Ralph loop in section 15 does, or keep one
                long session and compact it by summarising its history. No controlled comparison
                of a fresh-context loop with one long compacted session on the same task was
                located during this research.
              </Box>
              <Box variant="p">
                A 2026 preprint measured compaction mid-task. Replacing a coding agent&apos;s full
                history with a summary damaged between 5% and 64% of 22 full-history SWE-bench
                successes, depending on the summarising model, and LLM summaries kept at most
                16.0% of recurring details against 79.1% for mechanical extraction{' '}
                <Cite tier={3} href={COMPACT} venue="preprint">
                  Compact-Bench, Abstract
                </Cite>
                . That bears on summarising in the middle of a task; it does not test restarting
                between tasks.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Turn the three gaps into loop design you can apply to the loop you run now: statistics in code, memory sized to effective length, the evolving part after the stable part"
          >
            Three changes to make in your loop
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Where a gap survives these changes, section 18, What Lives in Weights &amp; What Lives
            in Context, maps which improvements belong in the weights instead. For the loop you
            run on a frozen model, make these three changes.
          </Box>
          <Box variant="p">
            <Box variant="strong" display="inline">
              1. Keep statistics in code and hand the model a summary.
            </Box>{' '}
            Let code count attempts, average scores and apply the choice rule; give the model the
            summary and ask it for candidates. A model that computed the UCB rule correctly in 87%
            of its rationales still chose the greedy action over the optimal one when its
            rationale was correct, 58% against 21%, so the rule belongs in code. When the history needs shortening, extract it
            mechanically: in the compaction study, mechanical extraction kept 79.1% of recurring
            details against at most 16.0% for LLM summaries.
          </Box>
          <Box variant="p">
            <Box variant="strong" display="inline">
              2. Budget memory against effective length.
            </Box>{' '}
            Size the playbook, notes and log to the length your model still uses, measured on a
            test like RULER, rather than to the claimed window: GPT-4 held to 64K of its claimed
            128K. Put the stable rules at the start and the current task state at the end, since
            the middle is used worst.
          </Box>
          <Box variant="p">
            <Box variant="strong" display="inline">
              3. Keep the evolving part of the context after the stable part.
            </Box>{' '}
            Tools, system prompt, instructions and specifications go first and stay identical
            across iterations; the playbook, notes and log go after them, and edits happen there.
            Then confirm the hits: on Bedrock, read the cache usage fields in each response,
            because support for caching &quot;doesn&apos;t guarantee a cache hit for any
            request&quot;{' '}
            <Cite tier={1} href={BEDROCK_CACHING}>
              Amazon Bedrock user guide: prompt caching
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
