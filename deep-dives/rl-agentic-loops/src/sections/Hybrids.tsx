import type { ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Table from '@cloudscape-design/components/table';
import { Cite, arxiv, gh, TRL_TAG } from '../components/Cite';

/* ------------------------------------------------------------------------ */
/* Sources                                                                  */
/* ------------------------------------------------------------------------ */

/** Asawa et al., How to Train Your Advisor: Steering Black-Box LLMs with Advisor Models (ICML 2026). */
const ADVISOR = arxiv('2510.02453v3');
/** Yao et al., Retroformer: Retrospective Large Language Agents with Policy Gradient Optimization. */
const RETROFORMER = arxiv('2308.02151v3');
/** Zhou et al., Memento: Fine-tuning LLM Agents without Fine-tuning LLMs. */
const MEMENTO = arxiv('2508.16153v2');
/** Schmied et al., LLMs are Greedy Agents: Effects of RL Fine-tuning on Decision-Making Abilities. */
const GREEDY_AGENTS = arxiv('2504.16078v1');
/** Nie et al., EVOLvE: Evaluating and Optimizing LLMs For In-Context Exploration (ICML 2025). */
const EVOLVE = arxiv('2410.06238v2');
/** Snell et al., Learning by Distilling Context. */
const CONTEXT_DISTILLATION = arxiv('2209.15189v1');
/** Soylu et al., Fine-Tuning and Prompt Optimization: Two Great Steps that Work Better Together. */
const BETTER_TOGETHER = arxiv('2407.10930v2');
/** Tanzer et al., A Benchmark for Learning to Translate a New Language from One Grammar Book (MTOB; ICLR 2024 per OpenReview). */
const MTOB = arxiv('2309.16575v2');

function trl(path: string, lines?: string): string {
  return gh('huggingface/trl', TRL_TAG, `trl/trainer/${path}`, lines);
}

function Advisor({ children }: { children: ReactNode }) {
  return (
    <Cite tier={3} href={ADVISOR} venue="ICML 2026">
      {children}
    </Cite>
  );
}

function Retroformer({ children }: { children: ReactNode }) {
  return (
    <Cite tier={3} href={RETROFORMER} venue="ICLR 2024">
      {children}
    </Cite>
  );
}

/* ------------------------------------------------------------------------ */
/* Diagram: the advisor writes words, the reward moves only its weights     */
/* ------------------------------------------------------------------------ */

function AdvisorStudentDiagram() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 900 350"
        role="img"
        aria-labelledby="hybrids-advisor-title"
        style={{ width: '100%', minWidth: 680, height: 'auto' }}
      >
        <title id="hybrids-advisor-title">
          An advisor pipeline. Each task input goes to a small advisor model you own, which
          writes advice into the context of a frozen student model behind an API. The student
          reads the task input and the advice and writes the final output. A scorer turns that
          output into a reward, and the reward updates only the advisor&apos;s weights, with
          GRPO. The student&apos;s weights never change and no gradient reaches it.
        </title>
        <style>{`
          .hybrids-advisor-in { fill: #ffffff; stroke: #879596; stroke-width: 1.5; }
          .hybrids-advisor-adv { fill: #f2f8fd; stroke: #0972d3; stroke-width: 2.5; }
          .hybrids-advisor-stu { fill: #f4f4f4; stroke: #414d5c; stroke-width: 1.5; }
          .hybrids-advisor-sco { fill: #fbf3d5; stroke: #8b6c00; stroke-width: 1.5; }
          .hybrids-advisor-pill-adv { fill: #0972d3; }
          .hybrids-advisor-pill-stu { fill: #414d5c; }
          .hybrids-advisor-pill-sco { fill: #8b6c00; }
          .hybrids-advisor-pt { fill: #ffffff; font: 600 11px sans-serif; text-anchor: middle; }
          .hybrids-advisor-t { fill: #16191f; font: 600 13px sans-serif; text-anchor: middle; }
          .hybrids-advisor-s { fill: #414d5c; font: 11px sans-serif; text-anchor: middle; }
          .hybrids-advisor-edge { fill: #414d5c; font: 600 11px sans-serif; text-anchor: middle; }
          .hybrids-advisor-note { fill: #414d5c; font: italic 11px sans-serif; text-anchor: middle; }
          .hybrids-advisor-rw { fill: #8b6c00; font: 600 12px sans-serif; text-anchor: middle; }
          .hybrids-advisor-arr { stroke: #5f6b7a; stroke-width: 1.5; fill: none; }
          .hybrids-advisor-rarr { stroke: #8b6c00; stroke-width: 2.5; fill: none; }
        `}</style>
        <defs>
          <marker
            id="hybrids-advisor-ah"
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
            id="hybrids-advisor-rh"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="5"
            orient="auto-start-reverse"
            markerUnits="userSpaceOnUse"
          >
            <path d="M0,0 L10,5 L0,10 Z" fill="#8b6c00" />
          </marker>
        </defs>

        <rect x={0} y={0} width={900} height={350} rx={8} fill="#ffffff" />

        {/* Task input */}
        <rect x={20} y={150} width={140} height={64} rx={6} className="hybrids-advisor-in" />
        <text x={90} y={178} className="hybrids-advisor-t">
          Task input
        </text>
        <text x={90} y={198} className="hybrids-advisor-s">
          one instance
        </text>

        {/* Advisor: trained */}
        <rect x={200} y={120} width={200} height={124} rx={6} className="hybrids-advisor-adv" />
        <rect x={255} y={130} width={90} height={20} rx={10} className="hybrids-advisor-pill-adv" />
        <text x={300} y={144} className="hybrids-advisor-pt">
          TRAINED
        </text>
        <text x={300} y={174} className="hybrids-advisor-t">
          Advisor
        </text>
        <text x={300} y={194} className="hybrids-advisor-s">
          small open model you own
        </text>
        <text x={300} y={212} className="hybrids-advisor-s">
          the RL policy: its action
        </text>
        <text x={300} y={230} className="hybrids-advisor-s">
          is a piece of advice
        </text>

        {/* Student: frozen */}
        <rect x={460} y={120} width={200} height={124} rx={6} className="hybrids-advisor-stu" />
        <rect x={515} y={130} width={90} height={20} rx={10} className="hybrids-advisor-pill-stu" />
        <text x={560} y={144} className="hybrids-advisor-pt">
          FROZEN
        </text>
        <text x={560} y={174} className="hybrids-advisor-t">
          Student
        </text>
        <text x={560} y={194} className="hybrids-advisor-s">
          model behind an API
        </text>
        <text x={560} y={212} className="hybrids-advisor-s">
          reads input plus advice,
        </text>
        <text x={560} y={230} className="hybrids-advisor-s">
          writes the final output
        </text>

        {/* Scorer */}
        <rect x={720} y={120} width={160} height={124} rx={6} className="hybrids-advisor-sco" />
        <rect x={755} y={130} width={90} height={20} rx={10} className="hybrids-advisor-pill-sco" />
        <text x={800} y={144} className="hybrids-advisor-pt">
          REWARD
        </text>
        <text x={800} y={174} className="hybrids-advisor-t">
          Scorer
        </text>
        <text x={800} y={194} className="hybrids-advisor-s">
          scores the student&apos;s
        </text>
        <text x={800} y={212} className="hybrids-advisor-s">
          final output: chrF,
        </text>
        <text x={800} y={230} className="hybrids-advisor-s">
          accuracy or a judge
        </text>

        {/* Forward arrows */}
        <line
          x1={160}
          y1={182}
          x2={198}
          y2={182}
          className="hybrids-advisor-arr"
          markerEnd="url(#hybrids-advisor-ah)"
        />
        <line
          x1={400}
          y1={182}
          x2={458}
          y2={182}
          className="hybrids-advisor-arr"
          markerEnd="url(#hybrids-advisor-ah)"
        />
        <text x={430} y={172} className="hybrids-advisor-edge">
          advice
        </text>
        <line
          x1={660}
          y1={182}
          x2={718}
          y2={182}
          className="hybrids-advisor-arr"
          markerEnd="url(#hybrids-advisor-ah)"
        />
        <text x={690} y={172} className="hybrids-advisor-edge">
          output
        </text>

        {/* The task input also reaches the student */}
        <polyline
          points="90,150 90,80 560,80 560,118"
          className="hybrids-advisor-arr"
          markerEnd="url(#hybrids-advisor-ah)"
        />
        <text x={330} y={70} className="hybrids-advisor-edge">
          the same task input goes to the student
        </text>

        {/* Reward path back to the advisor only */}
        <polyline
          points="800,244 800,290 300,290 300,248"
          className="hybrids-advisor-rarr"
          markerEnd="url(#hybrids-advisor-rh)"
        />
        <text x={560} y={268} className="hybrids-advisor-note">
          no weight or gradient access
        </text>
        <text x={550} y={316} className="hybrids-advisor-rw">
          reward: GRPO updates the advisor&apos;s weights only
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Same-model comparison table                                              */
/* ------------------------------------------------------------------------ */

interface ChrfRow {
  id: string;
  arm: string;
  trained: string;
  chrf: string;
  gain: string;
}

const CHRF_ROWS: ChrfRow[] = [
  {
    id: 'base',
    arm: 'Baseline: Qwen2.5 7B Instruct, untrained',
    trained: 'Nothing',
    chrf: '31.17',
    gain: '-',
  },
  {
    id: 'advisor',
    arm: 'Qwen2.5 3B Instruct advisor in front of the frozen 7B',
    trained: 'The 3B advisor',
    chrf: '38.98',
    gain: '+7.81',
  },
  {
    id: 'rl',
    arm: 'Direct RL on Qwen2.5 7B Instruct',
    trained: 'The 7B student itself',
    chrf: '42.38',
    gain: '+11.21',
  },
];

function ChrfTable() {
  return (
    <Table<ChrfRow>
      variant="embedded"
      wrapLines
      trackBy="id"
      items={CHRF_ROWS}
      columnDefinitions={[
        { id: 'arm', header: 'Arm (MTOB, Kalamang to English)', cell: (r) => r.arm },
        { id: 'trained', header: 'Weights that moved', cell: (r) => r.trained },
        { id: 'chrf', header: 'chrF', cell: (r) => r.chrf },
        { id: 'gain', header: 'Gain over baseline', cell: (r) => r.gain },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function Hybrids() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Improve an API model you cannot train by training a small model in front of it: in the one same-model test, that recovered about 70% of what RL on the big model gained (TRL v1.16.0 and papers, read 2026-10-30)"
          >
            16. Hybrids
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A hybrid keeps the large model frozen and puts the trained weights in a small model
            whose output is words. The small model reads each input and writes something into the
            large model&apos;s context; RL (reinforcement learning) trains the small model on how
            well the large model then does. In Advisor Models, a small
            open-weight model is trained to write per-instance advice in natural language for a
            black-box model, one whose weights you cannot modify{' '}
            <Advisor>Advisor Models, abstract</Advisor>. This section follows that design.
          </Box>
          <Box variant="p">
            The challenge it meets is common. The model you want to improve is an API model, so a
            weight update is out of reach, and a text loop that edits one shared prompt has hit
            its limit because the right behaviour changes from input to input. In the paper&apos;s
            one test that ran both arms on the same model, a low-resource translation task, the
            advisor recovered about 70% of the gain that direct RL on the model itself
            achieved: chrF, a character-overlap translation score, rose from 31.17 to 38.98 with
            the advisor and to 42.38 with direct RL
            (our arithmetic from the paper&apos;s figures){' '}
            <Advisor>Advisor Models, Section 4.4.3</Advisor>.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="See which model's weights move and where the reward is measured, so you know which access you need"
          >
            Two roles: an advisor you train, a student you call
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The advisor is the small model being trained, for example Qwen2.5 7B Instruct. The
            student is the frozen model it advises, for example GPT-4o mini; the paper uses
            &quot;black-box&quot; and &quot;student&quot; interchangeably. In the basic design the
            advisor sits between the user input and the student, and its advice is injected into
            the student&apos;s context <Advisor>Advisor Models, Section 3 and Figure 1</Advisor>.
          </Box>
          <Box variant="p">
            Training is RL on the advisor alone. The advisor samples candidate advice, the student
            produces outputs conditioned on it, and a task-specific reward, the score the training
            tries to raise, is computed from the student&apos;s final output. GRPO (Group Relative
            Policy Optimization), which samples a group of outputs for each input and makes the
            ones that scored above the group&apos;s average more likely, then updates the advisor
            &quot;based only on observed rewards&quot;{' '}
            <Advisor>Advisor Models, Section 3</Advisor>. No gradient is needed from the student,
            so the whole loop runs with API access to it{' '}
            <Advisor>Advisor Models, Section 3 and Figure 2</Advisor>.
          </Box>
          <AdvisorStudentDiagram />
          <Box variant="small" color="text-body-secondary">
            Schematic of the basic two-step design in Advisor Models, Section 3 and Figure 1.
            The scorer examples are the rewards used in the paper&apos;s domains.
          </Box>
          <Box variant="p">
            In RL terms the advisor is the policy, the model that maps an input to an action, and
            its action is a piece of advice. The frozen student belongs to the environment the
            advisor acts in. Retroformer&apos;s authors make the same move for their own frozen
            model: since it is frozen, &quot;it can be considered as part of the environment&quot;,
            and ordinary RL algorithms apply to the small model that remains{' '}
            <Retroformer>Retroformer, Section 3</Retroformer>. The learning is a real weight update;
            its effect on the large model travels only as words.
          </Box>
          <Box variant="p">
            Two variants change what the advisor reads. In a three-step version the student makes
            a first attempt, the advisor reads it and writes advice, and the student revises. In
            multi-turn tasks such as a coding agent, the student&apos;s actions and observations go
            back to the advisor, after every action or at regular intervals, for the next round of
            advice <Advisor>Advisor Models, Section 3 and Figure 2</Advisor>.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Know how much of an RL gain to expect when you can reach the model only through its API"
          >
            About 70% of the gain, without the big model&apos;s weights
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The authors expect direct RL to beat an advisor whenever the student&apos;s weights
            are available, and ran one test to measure by how much. The task was MTOB (Machine
            Translation from One Book{' '}
            <Cite tier={3} href={MTOB} venue="ICLR 2024">
              MTOB, abstract
            </Cite>
            ): translating Kalamang, an extremely low-resource language,
            into English, scored in chrF, a character-overlap measure of string similarity between
            the generated and the reference translation{' '}
            <Advisor>Advisor Models, Section 4</Advisor>. A Qwen2.5 3B Instruct advisor advised a
            Qwen2.5 7B Instruct student, against GRPO run directly on Qwen2.5 7B Instruct, with the
            same hyperparameters for 20 epochs{' '}
            <Advisor>Advisor Models, Section 4.4.3 and Appendix D.4</Advisor>.
          </Box>
          <ChrfTable />
          <Box variant="p">
            The advisor gained 7.81 chrF points where direct RL gained 11.21, so it recovered about
            70% of the gain while the 7B model&apos;s weights never moved (our arithmetic from the
            paper&apos;s figures). The authors&apos; own summary: direct RL &quot;remains the
            better option&quot;, and the advisor pipeline makes up &quot;most of the improvement
            over baseline&quot; <Advisor>Advisor Models, Section 4.4.3</Advisor>. The advisor in
            this test was the smaller of the two models, 3B against the 7B that direct RL trained.
          </Box>
          <ExpandableSection headerText="The arithmetic, and why 70% is a snapshot rather than a ceiling">
            <SpaceBetween size="s">
              <Box variant="p">
                <code>(38.98 - 31.17) / (42.38 - 31.17) = 7.81 / 11.21 = 0.697</code>, about 70%.
                The three chrF values are the paper&apos;s; the ratio is ours{' '}
                <Advisor>Advisor Models, Section 4.4.3 and Figure 9</Advisor>.
              </Box>
              <Box variant="p">
                The training curves differ in shape. Direct RL learns fast early and then flattens;
                the advisor improves steadily throughout; and both are still climbing when training
                ends <Advisor>Advisor Models, Appendix D.4 and Figure 14</Advisor>. The 70% is the
                ratio at 20 epochs, on one task and one pair of models.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Spot the gap a single prompt cannot close: behaviour that depends on something hidden in each input"
          >
            When the right answer depends on who is asking
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A prompt optimiser learns one instruction that every input reads, so it captures what
            the inputs share. When the right output depends on something that differs per input
            and is never stated, one instruction cannot carry the mapping. The advisor reads each
            input and writes advice for that input, so the mapping can live in its weights.
          </Box>
          <Box variant="p">
            The paper tests this on three personalisation tasks in which each user has a
            preference the prompt does not state, learned only through a scalar reward: the
            length of a media review, its reading level, and the style of a worked math solution.
            The student was GPT-4o mini and the advisor base Qwen2.5 7B Instruct. Two static
            methods, PAG (Profile-Augmented Generation) and GEPA (Genetic-Pareto, the reflective
            prompt optimiser of section 14, Optimising the Prompt), landed &quot;marginally above
            the un-optimized baselines, if at all&quot;. The advisor reached 0.94 reward out of a
            maximum 1.0 on review length, 99.6% accuracy on review level, and 0.948 out of 1.0 on
            math solutions <Advisor>Advisor Models, Section 4.3 and Figure 5</Advisor>. The authors
            worked with GEPA&apos;s authors to confirm a fair GEPA setup for these tasks{' '}
            <Advisor>Advisor Models, Section 4.3.1</Advisor>.
          </Box>
          <Box variant="p">
            That is the mental model for the whole section: when the right behaviour depends on
            something hidden per instance, some weights have to learn it. A hybrid lets those
            weights be small and yours while the model doing the work stays frozen.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Check that the student is missing something before you spend a training run on an advisor"
          >
            An advisor needs something to learn
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The authors state the condition directly: &quot;there must be something for the
            advisor to learn&quot;. They tested it on one domain, MATH-500 (500 competition
            mathematics problems), with a Qwen2.5 7B Instruct advisor and GPT-4o mini as the
            student, using the same hyperparameters as their other domains for 20 epochs. The
            trained advisor gave no significant improvement over the baselines{' '}
            <Advisor>Advisor Models, Section 4.4.4 and Figure 10</Advisor>.
          </Box>
          <Box variant="p">
            Their explanation is that frontier models are already &quot;maxed-out&quot; on math
            problem solving, so the advisor has nothing to add{' '}
            <Advisor>Advisor Models, Section 4.4.4 and Figure 10</Advisor>. The result covers one
            domain and one student; the reason is the authors&apos; reading of it. Where the paper
            did find gains, the domains were chosen to need knowledge the student lacked (a
            low-resource language, complex rule-following) or preferences it could not know in
            advance{' '}
            <Advisor>Advisor Models, Sections 1 and 4</Advisor>.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Recognise the same split in other designs: a small trained part next to a model that stays fixed"
          >
            The same split, elsewhere
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Other designs train a small component and leave the large model frozen. Retroformer
            trains the reflector. A frozen model&apos;s reflection, in the paper&apos;s example,
            &quot;only rephrases the prior failed actions sequences as the proposed plan&quot;, and
            the agent repeats the same wrong actions on the next trial{' '}
            <Retroformer>Retroformer, Figure 1</Retroformer>. Retroformer keeps the actor frozen and
            fine-tunes a smaller local reflector with PPO (Proximal Policy Optimization), rating
            each reflection by the change in episode return between one trial and the next{' '}
            <Retroformer>Retroformer, Section 4</Retroformer>. Section 12, Verbal
            Reinforcement &amp; Self-Correction, covers the frozen-reflection side of that example.
          </Box>
          <Box variant="p">
            Memento trains the retrieval. It keeps a case bank of past experiences and learns
            which case to retrieve with soft Q-learning, an RL method that learns a value for each
            choice, while the LLM component stays fixed{' '}
            <Cite tier={3} href={MEMENTO} venue="preprint">
              Memento, Section 3
            </Cite>
            .
          </Box>
          <ExpandableSection headerText="Three ways to move a context-side behaviour into weights">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>Exploration.</strong> RL fine-tuning of Gemma2 2B and 9B on bandit tasks
                (pick one of several options, see its reward, repeat) raised exploration and
                lowered regret, the reward lost against always picking the best option; the
                exploration it learned stayed sub-optimal, and for the 2B model RL narrowed the gap
                to UCB (Upper Confidence Bound), a classical bandit algorithm{' '}
                <Cite tier={3} href={GREEDY_AGENTS} venue="ICLR 2026">
                  Schmied et al., Sections 1 and 4.3
                </Cite>
                . Distilling a bandit algorithm into the model, through in-context demonstrations
                and fine-tuning on data generated by the algorithm, let smaller models explore
                better than larger ones on various tasks{' '}
                <Cite tier={3} href={EVOLVE} venue="ICML 2025">
                  EVOLvE, abstract and Section 4
                </Cite>
                . Section 17, Where Words Fall Short, covers the exploration failure these address.
              </Box>
              <Box variant="p">
                <strong>Context distillation.</strong> A model performs better with instructions
                or a scratchpad in its context, and the gain disappears when those tokens are gone.
                Context distillation fine-tunes the model to give, from the task input alone, the
                answer it gave with the instructions, so the gain is internalised into the weights{' '}
                <Cite tier={3} href={CONTEXT_DISTILLATION} venue="preprint">
                  Snell et al., abstract
                </Cite>
                .
              </Box>
              <Box variant="p">
                <strong>Alternating prompts and weights.</strong> BetterTogether optimises a
                pipeline&apos;s prompts and the weights of its model in turn, so that the same model
                teaches itself{' '}
                <Cite tier={3} href={BETTER_TOGETHER} venue="EMNLP 2024">
                  BetterTogether, abstract
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
            description="Lay out the four parts of an RL pipeline that improves an API model through a model you own"
          >
            Build it: train a model you own to steer one you call
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The paper reduces the integration to one change in any RL framework: an environment
            step that sends the advisor&apos;s output to the black-box model and computes the
            reward on the student&apos;s final output{' '}
            <Advisor>Advisor Models, Section 3</Advisor>. Four decisions define the pipeline.
          </Box>
          <Box variant="p">
            <strong>1. What the advisor sees.</strong> The task input, as in every design. Add the
            student&apos;s first attempt if you want the three-step variant, or the student&apos;s
            actions and observations every few steps for an agent{' '}
            <Advisor>Advisor Models, Section 3 and Figure 2</Advisor>.
          </Box>
          <Box variant="p">
            <strong>2. What it outputs.</strong> Advice in natural language, injected into the
            student&apos;s context; in the multi-turn design it is appended to whatever the student
            would normally receive <Advisor>Advisor Models, Section 3</Advisor>. Because it is text, you can read what
            the advisor learned to say; the paper shows the same task&apos;s advice before and
            after training <Advisor>Advisor Models, Figure 2</Advisor>.
          </Box>
          <Box variant="p">
            <strong>3. Where the reward comes from.</strong> A score on the student&apos;s final
            output: chrF against a reference translation, 0 or 1 for a wrong or right tax
            calculation, or an LLM judge (GPT-4.1 mini or GPT-5 mini) checking a user&apos;s
            preference <Advisor>Advisor Models, Section 4</Advisor>. Every reward costs a
            student call. The authors estimated 200 examples for 20 epochs at a GRPO group size of
            8 as 32,000 calls to a frontier model, thousands of dollars, so they trained against
            low-cost students such as GPT-4o mini and transferred the trained advisor to frontier
            students <Advisor>Advisor Models, Section 4</Advisor>. Before training, score the
            student alone on the same grader: an advisor needs a gap to close.
          </Box>
          <Box variant="p">
            <strong>4. What you train it with.</strong> GRPO on the advisor; the paper used a fork
            of the SkyRL framework on one node of eight H100 GPUs{' '}
            <Advisor>Advisor Models, Section 3 and Appendix A</Advisor>. In TRL (Transformers
            Reinforcement Learning, Hugging Face&apos;s post-training library), a custom reward
            function receives the prompts and the generated completions, plus any extra dataset
            columns, and returns one reward per completion; it may be synchronous or asynchronous{' '}
            <Cite tier={1} href={trl('grpo_trainer.py', 'L177-L191')}>
              TRL grpo_trainer.py L177-L191
            </Cite>{' '}
            <Cite tier={1} href={trl('grpo_trainer.py', 'L1579-L1661')} kind="code">
              TRL grpo_trainer.py L1579-L1661
            </Cite>
            . With a plain-text dataset the completions arrive as decoded strings{' '}
            <Cite tier={1} href={trl('grpo_trainer.py', 'L2229-L2247')} kind="code">
              TRL grpo_trainer.py L2229-L2247
            </Cite>
            . Our reading of that contract: train the advisor as the GRPO model, and put the
            student call and the scorer inside the reward function.
          </Box>
          <ExpandableSection headerText="A sketch of the reward function for TRL's GRPOTrainer">
            <SpaceBetween size="s">
              <Box variant="p">
                Illustrative, not run. <code>call_student</code> and <code>score</code> are yours:
                the API call to the frozen model and your grader. The <code>reference</code> column
                comes from the dataset, which TRL passes to reward functions as keyword arguments.
              </Box>
              <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>
                {`import asyncio
from trl import GRPOTrainer

async def student_reward(prompts, completions, reference, **kwargs):
    # completions are the advisor's advice; the student reads task plus advice
    outputs = await asyncio.gather(
        *(call_student(task, advice) for task, advice in zip(prompts, completions))
    )
    return [score(out, ref) for out, ref in zip(outputs, reference)]

trainer = GRPOTrainer(
    model="Qwen/Qwen2.5-3B-Instruct",   # the advisor: the only weights that move
    reward_funcs=student_reward,
    train_dataset=dataset,              # columns: prompt, reference
)
trainer.train()`}
              </pre>
            </SpaceBetween>
          </ExpandableSection>
          <Box variant="p">
            Then set the expectation against the one same-model comparison: where you can reach
            the weights, direct RL gained more, and an advisor in front of the frozen model
            recovered about 70% of that gain <Advisor>Advisor Models, Section 4.4.3</Advisor> (our
            arithmetic). Where you cannot reach the weights, train the advisor against a cheap
            student, then measure it in front of the model you serve, on the same grader.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
