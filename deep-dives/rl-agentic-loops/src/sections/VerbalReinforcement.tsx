import type { ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Table from '@cloudscape-design/components/table';
import { Cite, arxiv } from '../components/Cite';

/* ------------------------------------------------------------------------ */
/* Sources                                                                  */
/* ------------------------------------------------------------------------ */

/** Shinn et al., Reflexion: Language Agents with Verbal Reinforcement Learning. */
const REFLEXION = arxiv('2303.11366v4');
/** Madaan et al., Self-Refine: Iterative Refinement with Self-Feedback. */
const SELF_REFINE = arxiv('2303.17651v2');
/** Huang et al., Large Language Models Cannot Self-Correct Reasoning Yet. */
const HUANG = arxiv('2310.01798v2');
/** Kamoi et al., When Can LLMs Actually Correct Their Own Mistakes? (critical survey). */
const KAMOI = arxiv('2406.01297v3');
/** Kumar et al., Training Language Models to Self-Correct via Reinforcement Learning (SCoRe). */
const SCORE = arxiv('2409.12917v2');
/** Zhao et al., ExpeL: LLM Agents Are Experiential Learners. */
const EXPEL = arxiv('2308.10144v3');
/** Ouyang et al., ReasoningBank. */
const REASONING_BANK = arxiv('2509.25140v2');
/** Youtu-Agent Team, Training-Free Group Relative Policy Optimization. */
const TF_GRPO = arxiv('2510.08191v1');
/** Yao et al., Retroformer. */
const RETROFORMER = arxiv('2308.02151v3');

function Reflexion({ children }: { children: ReactNode }) {
  return (
    <Cite tier={3} href={REFLEXION} venue="NeurIPS 2023">
      {children}
    </Cite>
  );
}

function Score({ children }: { children: ReactNode }) {
  return (
    <Cite tier={3} href={SCORE} venue="preprint">
      {children}
    </Cite>
  );
}

/* ------------------------------------------------------------------------ */
/* Diagram: the Reflexion loop, with the signal marked as the deciding part */
/* ------------------------------------------------------------------------ */

function ReflexionLoopDiagram() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 900 400"
        role="img"
        aria-labelledby="verbal-loop-title"
        style={{ width: '100%', minWidth: 680, height: 'auto' }}
      >
        <title id="verbal-loop-title">
          The Reflexion loop. A frozen actor model attempts the task. An evaluator scores the
          attempt: against a gold answer by exact match (an output-evaluated signal), by running
          unit tests the agent wrote itself (an execution-grounded signal), or, in intrinsic
          self-correction, by the model&apos;s own judgement with no outside signal. On a pass the
          loop stops. On a failure, a frozen self-reflection model writes a lesson, the lesson is
          appended to an episodic memory that holds one to three lessons, and the actor retries
          with those lessons in its context. The evaluator is the part that decides whether the
          loop learns.
        </title>
        <style>{`
          .verbal-loop-box { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .verbal-loop-sig { fill: #fbf3d5; stroke: #8b6c00; stroke-width: 3; }
          .verbal-loop-row-out { fill: #ecf7ec; stroke: #037f0c; stroke-width: 1; }
          .verbal-loop-row-none { fill: #f4f4f4; stroke: #879596; stroke-width: 1; stroke-dasharray: 4 3; }
          .verbal-loop-mem { fill: #e6f4f2; stroke: #1f7a70; stroke-width: 1.5; }
          .verbal-loop-slot { fill: #ffffff; stroke: #1f7a70; stroke-width: 1; }
          .verbal-loop-t { fill: #16191f; font: 600 13px sans-serif; text-anchor: middle; }
          .verbal-loop-s { fill: #414d5c; font: 11px sans-serif; text-anchor: middle; }
          .verbal-loop-rt { fill: #16191f; font: 600 12px sans-serif; text-anchor: start; }
          .verbal-loop-rs { fill: #414d5c; font: 11px sans-serif; text-anchor: start; }
          .verbal-loop-tag { fill: #8b6c00; }
          .verbal-loop-tagt { fill: #ffffff; font: 600 12px sans-serif; text-anchor: middle; }
          .verbal-loop-edge { fill: #414d5c; font: 600 11px sans-serif; text-anchor: middle; }
          .verbal-loop-edge-end { fill: #414d5c; font: 600 11px sans-serif; text-anchor: end; }
          .verbal-loop-arr { stroke: #5f6b7a; stroke-width: 1.5; fill: none; }
          .verbal-loop-stop { fill: #ffffff; stroke: #037f0c; stroke-width: 1.5; }
          .verbal-loop-stopt { fill: #037f0c; font: 600 11px sans-serif; text-anchor: middle; }
          .verbal-loop-slott { fill: #1f7a70; font: 11px sans-serif; text-anchor: middle; }
        `}</style>
        <defs>
          <marker
            id="verbal-loop-ah"
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

        <rect x={0} y={0} width={900} height={400} rx={8} fill="#ffffff" />

        {/* 1. Actor */}
        <rect x={20} y={62} width={210} height={106} rx={6} className="verbal-loop-box" />
        <text x={125} y={88} className="verbal-loop-t">
          1. Act
        </text>
        <text x={125} y={110} className="verbal-loop-s">
          Actor: a frozen LLM
        </text>
        <text x={125} y={128} className="verbal-loop-s">
          attempts the task with
        </text>
        <text x={125} y={146} className="verbal-loop-s">
          the lessons in its context
        </text>

        {/* 2. Signal, marked as the deciding part */}
        <rect x={305} y={14} width={290} height={24} rx={12} className="verbal-loop-tag" />
        <text x={450} y={30} className="verbal-loop-tagt">
          Decides whether the loop learns
        </text>
        <rect x={300} y={44} width={300} height={184} rx={6} className="verbal-loop-sig" />
        <text x={450} y={68} className="verbal-loop-t">
          2. Signal: the evaluator
        </text>
        <rect x={314} y={80} width={272} height={42} rx={4} className="verbal-loop-row-out" />
        <text x={326} y={97} className="verbal-loop-rt">
          Gold answer, exact match
        </text>
        <text x={326} y={113} className="verbal-loop-rs">
          output-evaluated (HotPotQA)
        </text>
        <rect x={314} y={128} width={272} height={42} rx={4} className="verbal-loop-row-out" />
        <text x={326} y={145} className="verbal-loop-rt">
          Self-written unit tests, run
        </text>
        <text x={326} y={161} className="verbal-loop-rs">
          execution-grounded (code)
        </text>
        <rect x={314} y={176} width={272} height={42} rx={4} className="verbal-loop-row-none" />
        <text x={326} y={193} className="verbal-loop-rt">
          The model&apos;s own judgement
        </text>
        <text x={326} y={209} className="verbal-loop-rs">
          no outside signal (self-correction)
        </text>

        {/* Pass exit */}
        <line
          x1={450}
          y1={228}
          x2={450}
          y2={246}
          className="verbal-loop-arr"
          markerEnd="url(#verbal-loop-ah)"
        />
        <rect x={395} y={248} width={110} height={24} rx={12} className="verbal-loop-stop" />
        <text x={450} y={264} className="verbal-loop-stopt">
          pass: stop
        </text>

        {/* 3. Reflector */}
        <rect x={670} y={62} width={210} height={106} rx={6} className="verbal-loop-box" />
        <text x={775} y={88} className="verbal-loop-t">
          3. Reflect
        </text>
        <text x={775} y={110} className="verbal-loop-s">
          Self-reflection: a frozen LLM
        </text>
        <text x={775} y={128} className="verbal-loop-s">
          turns the failed attempt
        </text>
        <text x={775} y={146} className="verbal-loop-s">
          into a written lesson
        </text>

        {/* Arrows across the top row */}
        <line
          x1={230}
          y1={115}
          x2={298}
          y2={115}
          className="verbal-loop-arr"
          markerEnd="url(#verbal-loop-ah)"
        />
        <text x={264} y={106} className="verbal-loop-edge">
          attempt
        </text>
        <line
          x1={600}
          y1={115}
          x2={668}
          y2={115}
          className="verbal-loop-arr"
          markerEnd="url(#verbal-loop-ah)"
        />
        <text x={634} y={106} className="verbal-loop-edge">
          fail
        </text>

        {/* Reflector to memory */}
        <line
          x1={775}
          y1={168}
          x2={775}
          y2={280}
          className="verbal-loop-arr"
          markerEnd="url(#verbal-loop-ah)"
        />
        <text x={765} y={228} className="verbal-loop-edge-end">
          append the lesson
        </text>

        {/* 4. Memory */}
        <rect x={600} y={282} width={280} height={100} rx={6} className="verbal-loop-mem" />
        <text x={740} y={304} className="verbal-loop-t">
          4. Remember: episodic memory
        </text>
        <text x={740} y={322} className="verbal-loop-s">
          1 to 3 lessons; the oldest drops out
        </text>
        <rect x={614} y={334} width={76} height={32} rx={4} className="verbal-loop-slot" />
        <text x={652} y={354} className="verbal-loop-slott">
          lesson 1
        </text>
        <rect x={702} y={334} width={76} height={32} rx={4} className="verbal-loop-slot" />
        <text x={740} y={354} className="verbal-loop-slott">
          lesson 2
        </text>
        <rect x={790} y={334} width={76} height={32} rx={4} className="verbal-loop-slot" />
        <text x={828} y={354} className="verbal-loop-slott">
          lesson 3
        </text>

        {/* 5. Retry: memory back to the actor */}
        <path
          d="M600,340 L125,340 L125,170"
          className="verbal-loop-arr"
          markerEnd="url(#verbal-loop-ah)"
        />
        <text x={362} y={360} className="verbal-loop-edge">
          5. Retry: the lessons join the next attempt&apos;s context
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Table: Reflexion's ablation on the 50 hardest HumanEval Rust problems    */
/* ------------------------------------------------------------------------ */

interface AblationRow {
  id: string;
  setup: string;
  tests: string;
  reflection: string;
  pass1: string;
}

const ABLATION_ROWS: AblationRow[] = [
  { id: 'base', setup: 'GPT-4, one attempt, no loop', tests: 'no', reflection: 'no', pass1: '0.60' },
  {
    id: 'no-tests',
    setup: 'Loop without its tests',
    tests: 'no',
    reflection: 'yes',
    pass1: '0.52',
  },
  {
    id: 'no-reflection',
    setup: 'Loop without reflection',
    tests: 'yes',
    reflection: 'no',
    pass1: '0.60',
  },
  { id: 'full', setup: 'Full Reflexion loop', tests: 'yes', reflection: 'yes', pass1: '0.68' },
];

function AblationTable() {
  return (
    <Table
      variant="embedded"
      wrapLines
      trackBy="id"
      items={ABLATION_ROWS}
      columnDefinitions={[
        { id: 'setup', header: 'Setup', cell: (r) => r.setup },
        { id: 'tests', header: 'Self-written tests', cell: (r) => r.tests },
        { id: 'reflection', header: 'Written reflection', cell: (r) => r.reflection },
        {
          id: 'pass1',
          header: 'pass@1',
          cell: (r) => (r.id === 'no-tests' ? <Box variant="strong">{r.pass1}</Box> : r.pass1),
        },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------ */
/* Table: SCoRe's first and second attempts                                 */
/* ------------------------------------------------------------------------ */

interface ScoreRow {
  id: string;
  setting: string;
  method: string;
  first: string;
  second: string;
  delta: string;
}

const SCORE_ROWS: ScoreRow[] = [
  {
    id: 'm-base',
    setting: 'MATH, Gemini 1.5 Flash',
    method: 'Base model, asked to correct itself',
    first: '52.6%',
    second: '41.4%',
    delta: '-11.2',
  },
  {
    id: 'm-sr',
    setting: 'MATH, Gemini 1.5 Flash',
    method: 'Self-Refine (prompting)',
    first: '52.8%',
    second: '51.8%',
    delta: '-1.0',
  },
  {
    id: 'm-star',
    setting: 'MATH, Gemini 1.5 Flash',
    method: 'SFT on successful correction traces',
    first: '53.6%',
    second: '54.0%',
    delta: '+0.4',
  },
  {
    id: 'm-pair',
    setting: 'MATH, Gemini 1.5 Flash',
    method: 'SFT on paired correction traces',
    first: '52.4%',
    second: '54.2%',
    delta: '+1.8',
  },
  {
    id: 'm-score',
    setting: 'MATH, Gemini 1.5 Flash',
    method: 'SCoRe (multi-turn RL)',
    first: '60.0%',
    second: '64.4%',
    delta: '+4.4',
  },
  {
    id: 'h-base',
    setting: 'HumanEval, Gemini 1.0 Pro',
    method: 'Base model, asked to correct itself',
    first: '53.7%',
    second: '56.7%',
    delta: '+3.0',
  },
  {
    id: 'h-sr',
    setting: 'HumanEval, Gemini 1.0 Pro',
    method: 'Self-Refine (prompting)',
    first: '53.7%',
    second: '52.5%',
    delta: '-1.2',
  },
  {
    id: 'h-score',
    setting: 'HumanEval, Gemini 1.0 Pro',
    method: 'SCoRe (multi-turn RL)',
    first: '52.4%',
    second: '64.6%',
    delta: '+12.2',
  },
];

function ScoreTable() {
  return (
    <Table
      variant="embedded"
      wrapLines
      trackBy="id"
      items={SCORE_ROWS}
      columnDefinitions={[
        { id: 'setting', header: 'Benchmark and model', cell: (r) => r.setting },
        { id: 'method', header: 'Method', cell: (r) => r.method },
        { id: 'first', header: 'First attempt', cell: (r) => r.first },
        { id: 'second', header: 'Second attempt', cell: (r) => r.second },
        { id: 'delta', header: 'Change (points)', cell: (r) => r.delta },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function VerbalReinforcement() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Make a reflection loop learn by giving it a signal from outside the model, before you tune how it reflects (sources read 2026-10-30)"
          >
            12. Verbal Reinforcement &amp; Self-Correction
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Verbal reinforcement is the smallest text loop. A frozen model attempts a task,
            receives a success signal, writes itself a short lesson about what went wrong, and
            retries with that lesson in its context. Reflexion, the base pattern for this section,
            reinforces a language agent through written feedback instead of weight updates{' '}
            <Reflexion>Reflexion, abstract</Reflexion>. Self-correction is the same move inside
            a single answer: the model critiques its own draft and revises it.
          </Box>
          <Box variant="p">
            The loop needs no training run and works with a model you can only call through an
            API. The challenge is knowing when it learns. The studies in this section point one
            way: the signal does the work. With a signal from outside the model, reflection gains;
            without one, the same loop stays flat or loses accuracy. In Reflexion&apos;s own
            ablation on the 50 hardest HumanEval Rust problems, GPT-4 in the loop with its unit
            tests removed scored 0.52, below the 0.60 it scored with no loop at all{' '}
            <Reflexion>Reflexion, Table 3</Reflexion>.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Name the five steps of a reflection loop and find the one that decides whether it learns"
          >
            The Reflexion loop
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Reflexion splits the work across three roles, each a prompted LLM: an Actor that
            attempts the task, an Evaluator that scores the attempt, and a Self-Reflection model
            that turns a failure into advice <Reflexion>Reflexion, Section 3</Reflexion>. One
            trial runs in five steps. The actor acts. The evaluator returns a reward, the number
            the loop is trying to raise; in Reflexion it is a success bit or a scalar score. On a
            failure, the reflector reads the attempt and its score and writes a lesson in plain
            language. The lesson is appended to an episodic memory, a short list of lessons kept
            for the next trials, which Reflexion bounds at a maximum &quot;usually set to 1-3&quot;
            to stay within the model&apos;s context limit. The actor then retries with those
            lessons in its prompt, until the evaluator passes an attempt or the trial limit is
            reached <Reflexion>Reflexion, Section 3 and Algorithm 1</Reflexion>. The memory is a
            sliding window, so a new lesson pushes out the oldest once it is full{' '}
            <Reflexion>Reflexion, Section 5</Reflexion>.
          </Box>
          <ReflexionLoopDiagram />
          <Box variant="small" color="text-body-secondary">
            Schematic of the loop in Reflexion, Section 3 and Algorithm 1. The third signal row is
            the intrinsic self-correction setting of the studies below, drawn into the same slot
            for comparison.
          </Box>
          <Box variant="p">
            In RL (reinforcement learning) terms, the policy, whatever decides the next action, is
            the model plus its memory text: the paper defines it as &quot;an agent&apos;s memory
            encoding paired with a choice of LLM parameters&quot;{' '}
            <Reflexion>Reflexion, Section 1</Reflexion>. The weights never move, so the only thing
            a trial can change is the memory. The reflector does credit assignment, the work of
            finding which step caused the result, in words: given a failure signal, it infers which
            earlier action led the attempt astray and states what to do instead{' '}
            <Reflexion>Reflexion, Section 3</Reflexion>.
          </Box>
          <Box variant="p">
            Reflexion fills the evaluator slot differently per task, and the difference matters
            for everything that follows. On HotPotQA (multi-hop questions over Wikipedia) the
            signal is exact-match grading against the dataset&apos;s gold answer, returned as a
            binary success bit <Reflexion>Reflexion, Section 4.2</Reflexion>. That signal is
            output-evaluated: a score on the final output, here an exact-match check against a gold
            answer. On programming tasks the agent writes up to six unit tests of its own and runs
            its code against them <Reflexion>Reflexion, Section 4.3</Reflexion>. That signal is
            execution-grounded: the result of actually running code. On ALFWorld (text-based
            household tasks) the evaluator was a hand-written heuristic or a second LLM used as a
            classifier <Reflexion>Reflexion, Section 4.1 and Figure 3</Reflexion>.
          </Box>
          <Box variant="p">
            The memory is small by design: three lessons on HotPotQA and one on the programming
            tasks <Reflexion>Reflexion, Sections 4.2 and 4.3</Reflexion>. Reflexion measures its
            gains across retries of the same tasks. Memory that accumulates across many tasks is
            the subject of section 13, Memories, Playbooks &amp; Skill Libraries.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="See which half of the loop carries the gain, in the ablation this section's argument rests on"
          >
            Without its tests, the loop scored below no loop
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Reflexion&apos;s ablation separates the signal from the reflection. On the 50 hardest
            HumanEval problems translated to Rust (HumanEval is a set of programming problems
            scored by unit tests), with GPT-4, the authors removed the agent&apos;s self-written
            tests, its written reflections, or both, and measured pass@1, the share of problems
            that the one submitted solution solves{' '}
            <Reflexion>Reflexion, Table 3 and Table 2 caption</Reflexion>.
          </Box>
          <AblationTable />
          <Box variant="p">
            The loop without its tests scored 0.52 against 0.60 for GPT-4 with no loop. In the
            authors&apos; reading, the agent could not tell whether its current code was correct,
            so it ran through every trial with no option to stop early, &quot;performing harmful
            edits to the implementation&quot;. With tests and no reflection, the tests and the
            compiler caught errors but the fixes did not follow from them, and the score stayed
            at the baseline. Only the loop with both a grounded signal and a written diagnosis
            gained <Reflexion>Reflexion, Section 4.3, ablation study</Reflexion>.
          </Box>
          <Box variant="p">
            The signal can also leak. A self-written test suite can pass wrong code, and a false
            pass ends the loop early with a wrong answer. With GPT-4, Reflexion raised HumanEval
            Python pass@1 from 80.1 to 91.0 and lowered MBPP Python (short Python programming
            problems) from 80.1 to 77.1 <Reflexion>Reflexion, Table 1</Reflexion>. The authors
            trace the difference to the tests: they passed a wrong solution 16.3% of the time on
            MBPP against 1.4% on HumanEval <Reflexion>Reflexion, Section 4.3</Reflexion>. On
            their analysis, the false-positive rate of the grader decided whether the same loop
            on the same model helped or hurt.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Predict whether asking a model to check its own answer will help, before you add the step"
          >
            Self-correction needs a signal from outside the model
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Self-correction drops the outside evaluator and asks the model to judge itself.
            Self-Refine uses one LLM as generator, critic and reviser, with no training{' '}
            <Cite tier={3} href={SELF_REFINE} venue="NeurIPS 2023">
              Self-Refine, abstract
            </Cite>
            . On math reasoning, GSM8K (grade-school math word problems), with GPT-3.5 the score
            was 64.1 before refinement and 64.1 after{' '}
            <Cite tier={3} href={SELF_REFINE} venue="NeurIPS 2023">
              Self-Refine, Table 1
            </Cite>
            . The authors trace the flat result to error detection: a consistent-looking chain of
            reasoning convinces the model that all is well, and ChatGPT&apos;s feedback said
            &quot;everything looks good&quot; for 94% of instances{' '}
            <Cite tier={3} href={SELF_REFINE} venue="NeurIPS 2023">
              Self-Refine, Section 3.3
            </Cite>
            . With oracle feedback, which sends an answer for revision only when it is wrong, the
            GPT-3.5 score rose from 64.06 to 68.9{' '}
            <Cite tier={3} href={SELF_REFINE} venue="NeurIPS 2023">
              Self-Refine, Appendix H.1 and Table 9
            </Cite>
            .
          </Box>
          <Box variant="p">
            Huang et al. call the setting intrinsic self-correction: the model reviews and revises
            its own answer with no external feedback, and decides by itself when to stop{' '}
            <Cite tier={3} href={HUANG} venue="ICLR 2024">
              Huang et al., Section 2
            </Cite>
            . On CommonSenseQA (multiple-choice commonsense questions), GPT-3.5 fell from 75.8 to
            38.1 after one round, at three model calls per question instead of one{' '}
            <Cite tier={3} href={HUANG} venue="ICLR 2024">
              Huang et al., Table 3
            </Cite>
            . When the gold label decided when to stop, the same model on the same questions rose
            from 75.8 to 89.7{' '}
            <Cite tier={3} href={HUANG} venue="ICLR 2024">
              Huang et al., Section 3.2 and Table 2
            </Cite>
            . The oracle run differs in the one respect the paper names: the gold label, not the
            model, decides that an answer is right.
          </Box>
          <Box variant="p">
            Reflexion&apos;s HotPotQA results sit on the oracle side of that line. Its signal there
            is the gold answer, and Huang et al. list Reflexion among the methods whose reported
            gains use oracle labels{' '}
            <Cite tier={3} href={HUANG} venue="ICLR 2024">
              Huang et al., Table 1
            </Cite>
            ; Kamoi et al. add that an exact match against ground-truth answers &quot;cannot be
            accessed in real-world applications&quot;{' '}
            <Cite tier={3} href={KAMOI} venue="TACL 2024">
              Kamoi et al., Section 4 and Table 4
            </Cite>
            . A Reflexion loop you deploy learns from whatever takes the gold answer&apos;s place
            in your system.
          </Box>
          <Box variant="p">
            The ability to judge and fix one&apos;s own answer can be trained into the weights
            instead. SCoRe (Self-Correction via Reinforcement Learning) trains one model with
            multi-turn RL on two-attempt episodes it generates itself: a first answer, an
            instruction to look for a mistake, and a second answer{' '}
            <Score>SCoRe, Sections 3 and 5</Score>. Gemini 1.5 Flash on MATH (competition
            mathematics problems) gained 4.4 points from first to second attempt after SCoRe
            training, where Self-Refine prompting lost 1.0; Gemini 1.0 Pro on HumanEval gained
            12.2 against Self-Refine&apos;s loss of 1.2 <Score>SCoRe, Tables 2 and 3</Score>.
            Those results cover one round of correction on two Gemini models, in a preprint.
          </Box>
          <Box variant="p">
            SCoRe still learns from an outside signal; it spends that signal during training. Its
            training reward is binary: whether the answer matches the ground truth on MATH, or
            passes all test cases on code. At test time there is no checker, and the
            second-attempt instruction does not reveal whether the first answer was right{' '}
            <Score>SCoRe, Sections 3 and 6</Score>. What reaches test time is the trained ability.
          </Box>
          <ExpandableSection headerText="SCoRe's first and second attempts, and what the change mixes">
            <SpaceBetween size="s">
              <ScoreTable />
              <Box variant="p">
                MATH results are on 500 held-out problems; HumanEval results come from a model
                trained on MBPP <Score>SCoRe, Section 6 and Tables 2 and 3</Score>. SCoRe also
                raised the first attempt on MATH, from 52.6% to 60.0%, so its 64.4% second attempt
                against Self-Refine&apos;s 51.8% mixes better first answers with better
                corrections. Supervised fine-tuning (SFT) on correction traces generated offline
                moved the MATH change only to +0.4 and +1.8 points. Prompted correction also
                breaks right answers: Self-Refine&apos;s second attempt turned 4.2% of MATH
                problems from correct to incorrect and 3.2% from incorrect to correct{' '}
                <Score>SCoRe, Table 2</Score>.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Decide what your memory keeps from a failed run: the outcome beside a success, or the model's story about it"
          >
            What to keep from a failure
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A loop that keeps lessons across tasks has to decide what to store from a failure. Our
            reading of these studies: failures help as memory when the update compares them with
            successes, and hurt as free-floating reflections. The three results behind that
            reading come from different models and benchmarks, and each number belongs only to
            its own setting.
          </Box>
          <Box variant="p">
            ExpeL, the Experiential Learning agent, with gpt-3.5-turbo acting and gpt-4 writing its
            insights, on HotPotQA: insights extracted from pairs of a success and a failure, plus
            lists of successes, reached a 39.0% success rate. Adding the agent&apos;s own
            reflections on its failures to that extraction step dropped it to 29.0%, next to the
            28.0% of the plain ReAct agent with no stored experience. The authors suggest the
            reflections sometimes contained hallucinations that misled the insight writer{' '}
            <Cite tier={3} href={EXPEL} venue="AAAI 2024">
              ExpeL, Section 5.6 and Table 3
            </Cite>
            .
          </Box>
          <Box variant="p">
            ReasoningBank, with Gemini-2.5-flash on WebArena-Shopping (web shopping tasks from the
            WebArena benchmark): memory distilled from successful runs only scored 46.5, and adding
            the failed runs raised it to 49.7{' '}
            <Cite tier={3} href={REASONING_BANK} venue="ICLR 2026">
              ReasoningBank, Section 5 and Figure 7
            </Cite>
            . Success and failure there are labels from an LLM judge, given without any
            ground-truth reference{' '}
            <Cite tier={3} href={REASONING_BANK} venue="ICLR 2026">
              ReasoningBank, Section 3.2
            </Cite>
            .
          </Box>
          <Box variant="p">
            Training-Free GRPO writes a lesson only from a group of attempts that contains both
            clear winners and losers. It takes the rule from GRPO (Group Relative Policy
            Optimization), where the advantage, how much better an attempt scored than its
            group&apos;s average, is zero when every attempt in the group gets the same reward{' '}
            <Cite tier={3} href={TF_GRPO} venue="preprint">
              Training-Free GRPO, Section 2
            </Cite>
            . In design terms, our reading says to store a failure together with a success it can
            be compared to.
          </Box>
          <Box variant="p">
            When the weak part is the reflection itself, the fix moves into weights. In
            Retroformer&apos;s example, a frozen model&apos;s reflection only rephrased the failed
            sequence of actions as its new plan, and the agent repeated the same wrong actions on
            the next trial{' '}
            <Cite tier={3} href={RETROFORMER} venue="ICLR 2024">
              Retroformer, Figure 1
            </Cite>
            . Retroformer trains a smaller, local reflector with policy gradient, the RL update
            that makes higher-reward outputs more likely, while the actor stays frozen{' '}
            <Cite tier={3} href={RETROFORMER} venue="ICLR 2024">
              Retroformer, abstract and Section 4
            </Cite>
            . Section 16, Hybrids, covers that pattern.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Spend your next hour of loop work where the learning comes from: the signal"
          >
            Invest in the grader before the reflector
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Across these studies the rule is short, in our reading: no outside signal, no
            learning. The reflector turns a signal into words the actor can use, and it cannot
            supply a signal that is missing. The sharpest evidence is the ablation this section
            opened with: Reflexion without its tests scored 0.52 on the hardest HumanEval Rust
            problems, below the 0.60 of GPT-4 with no loop at all, while the full loop reached
            0.68 <Reflexion>Reflexion, Table 3</Reflexion>.
          </Box>
          <Box variant="p">
            So before tuning a reflection prompt, write down what your loop&apos;s signal is. If it
            is execution-grounded (the result of a tool call or code run: tests, a compiler, an
            environment) or output-evaluated (a score on the final output: an exact-match check
            against a gold answer, a rubric, or a judge), the loop has something to learn from. If
            it is the model&apos;s own opinion of its own answer, the studies above give the
            outcome to plan for: flat on GSM8K with GPT-3.5, and a fall from 75.8 to 38.1 on
            CommonSenseQA. Where no checker exists at deployment but labelled training problems
            do, and you can train the model, SCoRe shows the other route: spend the signal during
            training.
          </Box>
          <Box variant="p">
            Then check that signal the way you would check an RL reward, with the grader checklist
            in section 10, The Reward Is a Proxy. Tune the reflector once the grader passes it.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
