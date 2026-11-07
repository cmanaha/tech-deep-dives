import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Table from '@cloudscape-design/components/table';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';
import { Cite, arxiv } from '../components/Cite';

/* ------------------------------------------------------------------------ */
/* Sources                                                                  */
/* ------------------------------------------------------------------------ */

/** Reasoning with Sampling (power sampling), the figure section 8 owns. */
const SAMPLING = arxiv('2510.14901v1');

/* ------------------------------------------------------------------------ */
/* Diagram: one loop with three slots for the update                        */
/* ------------------------------------------------------------------------ */

// Layout in viewBox units. Three columns share x positions so each slot sits under a step.
const OL_W = 780;
const OL_H = 372;
const OL_COL_X = [40, 284, 528];
const OL_COL_W = 214;
const OL_STEP_Y = 20;
const OL_STEP_H = 72;
const OL_SLOT_Y = 156;
const OL_SLOT_H = 150;
const OL_FAN_Y = 128;
const OL_RETURN_Y = 330;
const OL_RISER_X = 20;
const OL_CHIP_W = 150;
const OL_CHIP_H = 26;
const olCenter = (i: number) => OL_COL_X[i] + OL_COL_W / 2;

const OL_STEPS = [
  { title: '1. Sample attempts', sub: 'the model tries the task' },
  { title: '2. Score each attempt', sub: 'a test, a checker or a judge' },
  { title: '3. Update', sub: 'change one of three stores' },
];

const OL_SLOTS = [
  {
    cls: 'one-loop-cycle-wt',
    title: 'The weights',
    sub: ['training changes the model', 'sections 3 to 13'],
    chips: ['GRPO', 'PPO'],
  },
  {
    cls: 'one-loop-cycle-cx',
    title: 'The context',
    sub: ['a frozen model reads it', 'sections 14 to 18'],
    chips: ['Reflexion', 'GEPA'],
  },
  {
    cls: 'one-loop-cycle-sm',
    title: 'A small trained model',
    sub: ['writes context for a', 'large one, section 19'],
    chips: ['Advisor Models', 'Retroformer'],
  },
];

function OneLoopDiagram() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox={`0 0 ${OL_W} ${OL_H}`}
        role="img"
        aria-labelledby="one-loop-cycle-title"
        style={{ width: '100%', minWidth: 640, height: 'auto' }}
      >
        <title id="one-loop-cycle-title">
          The loop every method in this dive runs: sample attempts, score each one with a test, a
          checker or a judge, and update one of three stores so the next attempts score better. The
          three stores are the weights (examples GRPO and PPO), the context a frozen model reads
          (examples Reflexion and GEPA), and a small trained model that writes context for a large
          one (examples Advisor Models and Retroformer). The next attempts run with the updated
          store.
        </title>
        <style>{`
          .one-loop-cycle-bg { fill: #ffffff; }
          .one-loop-cycle-step { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .one-loop-cycle-wt { fill: #efe7fb; stroke: #6f4cc4; stroke-width: 1.5; }
          .one-loop-cycle-cx { fill: #ecf7ec; stroke: #037f0c; stroke-width: 1.5; }
          .one-loop-cycle-sm { fill: #e6f4f2; stroke: #1f7a70; stroke-width: 1.5; }
          .one-loop-cycle-chip { fill: #ffffff; stroke: #5f6b7a; stroke-width: 1; }
          .one-loop-cycle-t { fill: #0f1b2a; font: 600 14px sans-serif; text-anchor: middle; }
          .one-loop-cycle-sub { fill: #414d5c; font: 12px sans-serif; text-anchor: middle; }
          .one-loop-cycle-ct { fill: #16191f; font: 600 12px sans-serif; text-anchor: middle; }
          .one-loop-cycle-lbe { fill: #414d5c; font: 600 12px sans-serif; text-anchor: end; }
          .one-loop-cycle-lbm { fill: #414d5c; font: 600 12px sans-serif; text-anchor: middle; }
          .one-loop-cycle-ln { stroke: #5f6b7a; stroke-width: 1.5; fill: none; }
          .one-loop-cycle-arr { stroke: #5f6b7a; stroke-width: 1.5; fill: none; marker-end: url(#one-loop-cycle-ah); }
        `}</style>
        <defs>
          <marker
            id="one-loop-cycle-ah"
            viewBox="0 0 10 10"
            refX={9}
            refY={5}
            markerWidth={8}
            markerHeight={8}
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#5f6b7a" />
          </marker>
        </defs>

        <rect x={0} y={0} width={OL_W} height={OL_H} rx={8} className="one-loop-cycle-bg" />

        {/* The three steps of the loop */}
        {OL_STEPS.map((s, i) => (
          <g key={s.title}>
            <rect
              x={OL_COL_X[i]}
              y={OL_STEP_Y}
              width={OL_COL_W}
              height={OL_STEP_H}
              rx={8}
              className="one-loop-cycle-step"
            />
            <text x={olCenter(i)} y={OL_STEP_Y + 30} className="one-loop-cycle-t">
              {s.title}
            </text>
            <text x={olCenter(i)} y={OL_STEP_Y + 52} className="one-loop-cycle-sub">
              {s.sub}
            </text>
          </g>
        ))}
        <line
          x1={OL_COL_X[0] + OL_COL_W + 2}
          y1={OL_STEP_Y + OL_STEP_H / 2}
          x2={OL_COL_X[1] - 2}
          y2={OL_STEP_Y + OL_STEP_H / 2}
          className="one-loop-cycle-arr"
        />
        <line
          x1={OL_COL_X[1] + OL_COL_W + 2}
          y1={OL_STEP_Y + OL_STEP_H / 2}
          x2={OL_COL_X[2] - 2}
          y2={OL_STEP_Y + OL_STEP_H / 2}
          className="one-loop-cycle-arr"
        />

        {/* Fan from the update step to the three slots */}
        <line
          x1={olCenter(2)}
          y1={OL_STEP_Y + OL_STEP_H}
          x2={olCenter(2)}
          y2={OL_FAN_Y}
          className="one-loop-cycle-ln"
        />
        <line x1={olCenter(0)} y1={OL_FAN_Y} x2={olCenter(2)} y2={OL_FAN_Y} className="one-loop-cycle-ln" />
        {[0, 1, 2].map((i) => (
          <line
            key={`fan-${i}`}
            x1={olCenter(i)}
            y1={OL_FAN_Y}
            x2={olCenter(i)}
            y2={OL_SLOT_Y - 2}
            className="one-loop-cycle-arr"
          />
        ))}
        <text x={olCenter(2) - 10} y={OL_FAN_Y - 10} className="one-loop-cycle-lbe">
          where the update lands
        </text>

        {/* The three slots, each with two example methods */}
        {OL_SLOTS.map((slot, i) => (
          <g key={slot.title}>
            <rect
              x={OL_COL_X[i]}
              y={OL_SLOT_Y}
              width={OL_COL_W}
              height={OL_SLOT_H}
              rx={8}
              className={slot.cls}
            />
            <text x={olCenter(i)} y={OL_SLOT_Y + 26} className="one-loop-cycle-t">
              {slot.title}
            </text>
            <text x={olCenter(i)} y={OL_SLOT_Y + 46} className="one-loop-cycle-sub">
              {slot.sub[0]}
            </text>
            <text x={olCenter(i)} y={OL_SLOT_Y + 62} className="one-loop-cycle-sub">
              {slot.sub[1]}
            </text>
            {slot.chips.map((chip, j) => (
              <g key={chip}>
                <rect
                  x={olCenter(i) - OL_CHIP_W / 2}
                  y={OL_SLOT_Y + 76 + j * 34}
                  width={OL_CHIP_W}
                  height={OL_CHIP_H}
                  rx={13}
                  className="one-loop-cycle-chip"
                />
                <text x={olCenter(i)} y={OL_SLOT_Y + 93 + j * 34} className="one-loop-cycle-ct">
                  {chip}
                </text>
              </g>
            ))}
          </g>
        ))}

        {/* Return path: the next attempts run with the updated store */}
        {[0, 1, 2].map((i) => (
          <line
            key={`ret-${i}`}
            x1={olCenter(i)}
            y1={OL_SLOT_Y + OL_SLOT_H}
            x2={olCenter(i)}
            y2={OL_RETURN_Y}
            className="one-loop-cycle-ln"
          />
        ))}
        <path
          d={`M ${olCenter(2)} ${OL_RETURN_Y} H ${OL_RISER_X} V ${OL_STEP_Y + OL_STEP_H / 2} H ${OL_COL_X[0] - 2}`}
          className="one-loop-cycle-arr"
        />
        <text x={olCenter(1)} y={OL_RETURN_Y + 24} className="one-loop-cycle-lbm">
          the next attempts run with the updated store
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Table: what the store decides                                            */
/* ------------------------------------------------------------------------ */

interface StoreRow {
  id: string;
  decides: string;
  weights: string;
  context: string;
  small: string;
}

const STORE_ROWS: StoreRow[] = [
  {
    id: 'train',
    decides: 'Training cost',
    weights: 'A training run, paid once; generation takes most of each step (sections 22 and 23)',
    context:
      'Little up front: attempts sampled and scored, plus the calls that write the update (section 23)',
    small: 'An RL run on the small model only; the large model is reached through its API (section 19)',
  },
  {
    id: 'serve',
    decides: 'Cost per query',
    weights: 'The cost of serving the model it trained (section 23)',
    context:
      'The tokens the update adds to every query, part of which prompt caching takes back (section 23)',
    small:
      "A call to the small model on each input, plus the words it adds to the large model's context (section 19)",
  },
  {
    id: 'keep',
    decides: 'What the model keeps',
    weights:
      'Some old ability is forgotten, more the further training moves the model from its base; RL moves it less than SFT does (sections 4, 10 and 21)',
    context:
      'Every old ability once the text is removed, since the weights never move; the text can be read, edited and removed, and a store fed misleading feedback degrades (sections 16 and 21)',
    small: "Every ability of the large model once the advice is removed; only the small model's weights move (section 19)",
  },
  {
    id: 'learn',
    decides: 'What it holds best',
    weights:
      'What must be fast, calibrated or general: sharpening toward answers the model can already give, and new reasoning skill through distillation from a stronger model (sections 10, 11 and 21)',
    context:
      'What is specific, recent and auditable: instructions, procedures and facts (sections 16, 17 and 21)',
    small: 'Behaviour that changes from input to input, for a large model you cannot train (section 19)',
  },
];

function StoreTable() {
  return (
    <Table<StoreRow>
      variant="embedded"
      wrapLines
      trackBy="id"
      items={STORE_ROWS}
      columnDefinitions={[
        {
          id: 'decides',
          header: 'The store decides',
          minWidth: 130,
          cell: (r) => <Box variant="strong">{r.decides}</Box>,
        },
        // 240 px data columns: on a phone the clip lands mid-way through "The weights", so the
        // cut-off text shows the table scrolls on to two more columns.
        { id: 'weights', header: 'The weights', minWidth: 240, cell: (r) => r.weights },
        { id: 'context', header: 'The context', minWidth: 240, cell: (r) => r.context },
        { id: 'small', header: 'A small trained model', minWidth: 240, cell: (r) => r.small },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function OneLoop() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Place any fine-tuning technique or learning loop by the signal it learns from and the place its update lands, and know before the details what it costs and what it can learn (sources read 2026-10-30)"
          >
            1. One Loop: What It Learns From and Where It Keeps It
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A coding agent runs a loop many times a day: it tries a change, runs the tests, and
            adjusts. The tests tell it whether this attempt worked. The challenge this dive takes
            on is keeping what the loop learns, so that the next run, on the next task, starts
            better than the last one did.
          </Box>
          <Box variant="p">
            The models in question are the ones you already use: open-weight models counted in
            billions of parameters, and frontier models you reach through an API. Fine-tuning is
            any further training of a pretrained model&apos;s weights. Reinforcement learning (RL)
            is the family of fine-tuning this dive covers in most depth: the model makes attempts,
            a grader (a test, a checker or another model) scores each one, and training makes
            high-scoring attempts more likely and low-scoring ones less likely. The score is
            called the reward. A model whose weights you cannot change, such as one you call
            through a provider&apos;s API, is frozen; what it writes still depends on what it
            reads, its context, and a loop can learn by changing that.
          </Box>
          <Box variant="p">
            A loop learns from a signal, and the signal comes in two shapes. A score on the
            model&apos;s own attempt says how good that attempt was, and RL learns from it. A
            written answer, from a person or from a stronger model, says what to write at every
            token, and SFT (supervised fine-tuning, training the model to reproduce example
            answers) and distillation (the same training, with a stronger model writing the
            answers) learn from that. Section 3 maps every fine-tuning technique by where its
            signal comes from.
          </Box>
          <Box variant="p">
            Every method in this dive runs a version of the loop the coding agent runs: get a
            signal on what the model writes, and change something so the next attempts do better.
            The methods differ in where the change lands. That location decides four things
            before any detail of the method matters: what training costs, what each query costs,
            what the model keeps of what it could already do, and what can be learned at all.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Sort any method you meet, in this dive or in a paper, by the store its update writes to"
          >
            Three places to keep what the loop learns
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Three stores can hold the change: the weights, the context, or the weights of a
            second, smaller model.
          </Box>
          <Box variant="p">
            <Box variant="strong" display="inline">
              The weights.
            </Box>{' '}
            RL trains the model itself, and so do SFT and distillation (the{' '}
            <Link href="../llm-training-systems/">
              training dive, section 3: One Training Step: What It Computes and Keeps
            </Link>{' '}
            shows what one step of training computes and changes on the hardware). Two RL
            algorithms, recipes for turning scores into weight changes, recur through the dive.
            Both carry the word policy, which is RL&apos;s name for whatever chooses the actions;
            for a language model the policy is the model itself, choosing each next token. PPO
            (Proximal Policy Optimization) puts a limit on how far one round of training can move
            the model. GRPO (Group Relative Policy Optimization) samples a group of attempts at
            each prompt and judges each attempt against the group&apos;s average score. Sections 6
            and 7 build PPO, and section 9 builds GRPO.
          </Box>
          <Box variant="p">
            <Box variant="strong" display="inline">
              The context.
            </Box>{' '}
            A loop writes text that the next attempt reads, and the model stays frozen. Reflexion
            has the model write a short lesson in plain words after a failed attempt and puts that
            lesson into the context of the next attempt (section 15). GEPA (Genetic-Pareto) is a
            prompt optimiser: a model rewrites the prompt using the written feedback of the
            grader, and a rewrite is kept only if it scores better. Each new candidate is a
            rewrite of a parent chosen from the best so far, as in a genetic algorithm, and every
            candidate that is best on at least one example stays available as a parent, which is
            what Pareto refers to (section 17). Other loops in this store write a rewritten
            prompt, a playbook, a memory or a skill file, and the next attempt runs with it.
          </Box>
          <Box variant="p">
            <Box variant="strong" display="inline">
              A small trained model.
            </Box>{' '}
            RL trains a small model whose output becomes context for a large frozen one. In
            Advisor Models the small model writes advice that is added to the large model&apos;s
            prompt; in Retroformer it writes the reflection on a failed attempt that the large
            model reads before it tries again. Only the small model&apos;s weights change (section
            19).
          </Box>
          <OneLoopDiagram />
          <ExpandableSection headerText="The rest of the dive, sorted by store and section">
            <SpaceBetween size="s">
              <Box variant="p">
                Each name below is a method a later section introduces properly; the gloss here is
                enough to place it.
              </Box>
              <Box variant="p">
                <Box variant="strong" display="inline">The weights</Box> hold SFT and distillation,
                which train on written answers (section 4), and the comparison of distillation with
                RL (section 11); policy gradient, the basic rule for turning scores into weight
                changes that PPO and GRPO build on (section 6); PPO&apos;s limits on each step
                (section 7); RLHF (RL from human feedback) and DPO (Direct Preference
                Optimization), which learn from pairs of responses where one was judged better
                (section 8); GRPO and its successors, scored by a program that checks each answer
                (section 9); agentic RL, where one attempt is a whole multi-turn task in which the
                model calls tools, as in Search-R1 (a model trained to use a search engine while it
                reasons) and DeepSWE (a coding agent) (section 12); and SCoRe (Self-Correction via
                Reinforcement Learning), which trains a model to correct its own answers (section
                15).
              </Box>
              <Box variant="p">
                <Box variant="strong" display="inline">The context</Box> holds reflection and
                self-critique, where the model critiques its own output in words and tries again:
                Reflexion and Self-Refine (section 15). It holds memories, playbooks and skill
                libraries, which keep lessons, procedures or code from past attempts and add them to
                later prompts: ExpeL, ACE (Agentic Context Engineering), Dynamic Cheatsheet,
                Voyager and Training-Free GRPO, a text loop named after the RL method (section 16).
                It holds prompt optimisers, GEPA among them (section 17). And it holds loops you may
                already run: Ralph, the same prompt fed to a coding agent in an endless loop, and
                autoresearch, an agent that runs experiments by following written instructions,
                beside FunSearch and AlphaEvolve, which have a model propose programs and keep the
                ones an evaluator scores best (section 18).
              </Box>
              <Box variant="p">
                <Box variant="strong" display="inline">A small trained model</Box> holds Advisor
                Models and Retroformer, which train the model that writes the advice or the
                reflection, and Memento, which trains the part that retrieves past cases from a bank
                and shows them to the large model (section 19).
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <Box variant="p">
            A fourth route stores nothing. It samples a frozen model several times and chooses
            among the attempts, either with a verifier (a checker that recognises a correct answer)
            or with a sampling method that needs none, and it pays on every query instead of once.
            One training-free sampler nearly matched the single-shot score of GRPO, the score a
            GRPO-trained model gets with one attempt per problem, on a math benchmark, at about 8.84
            times the tokens per answer{' '}
            <Cite tier={3} href={SAMPLING} venue="ICLR 2026">
              Reasoning with Sampling, Table 1 and Section 5.3
            </Cite>
            . The closing block of section 10, What RL Does to a Model, prices that route.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Predict a method's training bill, its cost per query, what it keeps and what it can learn, from where its update lands"
          >
            Where the update lands sets the bill and the reach
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The table compares the three stores on four questions, and a few of its terms are new
            here. A training step is one pass of the loop: sample a batch of attempts, score them,
            update the weights. Generation is the model writing its attempts. Prompt caching is a
            provider feature that stores the processed form of the opening part of a prompt, so a
            repeat of that same opening costs less (the{' '}
            <Link href="../vllm/">vLLM dive, section 6: Automatic Prefix Caching</Link> shows the
            same idea inside a serving engine). The base model is the model before this training,
            and forgetting is the loss of something the base model could do. Sharpening makes a
            model more reliable at answers it can already give some of the time. A calibrated
            model&apos;s confidence in an answer matches how often such answers are right. In the
            row on what each store holds best, fast means a behaviour that adds no tokens to the
            prompt of any call, and general means one that applies to every input, including
            tasks the training never saw.
          </Box>
          <Box variant="p">
            Read across a row and the trade shows: the weights pay once and hold what must be fast,
            calibrated or general; the context pays on every query and holds what is specific,
            recent and auditable; a small trained model buys a weight update for a large model you
            can only call.
          </Box>
          <StoreTable />
          <Box variant="small" color="text-body-secondary">
            Our reading of the sections each cell names; the evidence and its scope are in those
            sections.
          </Box>
          <Box variant="p">
            So the first thing to ask of any method, in a paper or in a vendor&apos;s console, is
            where its update lands. The answer predicts its bill and its reach before you read how
            it works.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Name the signal you have, and the family of techniques that learns from it follows; section 3 maps each one"
          >
            Where the signal comes from
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            In every store the signal decides whether anything is learned, and fine-tuning
            techniques differ first in where it comes from. Six sources run through the dive,
            each with the section that covers it:
          </Box>
          <ul>
            <li>
              <Box variant="strong" display="inline">Raw text from your domain:</Box> continued
              pretraining, next-token training on documents with no instructions (section 3).
            </li>
            <li>
              <Box variant="strong" display="inline">Example answers someone wrote:</Box> SFT
              (section 4).
            </li>
            <li>
              <Box variant="strong" display="inline">A stronger model&apos;s answers:</Box>{' '}
              distillation (section 4), and set against RL in section 11.
            </li>
            <li>
              <Box variant="strong" display="inline">
                The model&apos;s own attempts, kept when a grader passes them:
              </Box>{' '}
              rejection-sampling fine-tuning, which is SFT on the passing attempts (sections 4 and
              6).
            </li>
            <li>
              <Box variant="strong" display="inline">
                Pairs of answers where one was judged better:
              </Box>{' '}
              RLHF and DPO (section 8).
            </li>
            <li>
              <Box variant="strong" display="inline">
                A score on each of the model&apos;s own attempts:
              </Box>{' '}
              RL, scored by a reward model, a program, an environment or a judge (sections 5 to
              13).
            </li>
          </ul>
          <Box variant="p">
            Wherever a score is the signal, it is also the surface an optimiser, the training run
            or loop doing the improving, learns to game: whatever raises the score gets
            reinforced, including ways of raising it that miss what you meant. Section 13, The
            Reward Is a Proxy, builds a grader for a training run and a text loop alike. The same
            signals feed the loops that keep their lesson in the context, and section 3 sets every
            signal against every store in one grid. The second of section 25&apos;s three decision
            questions starts here: what signal do you have?
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Go straight to the question you came with: each has a section that answers it, and a short answer here"
          >
            Five questions, and where each is answered
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <Box variant="strong" display="inline">
              Which fine-tuning technique fits the signal you have?
            </Box>{' '}
            Section 3, Fine-Tuning Techniques: Where the Learning Signal Comes From, then sections
            4 and 11. The short answer: written answers you trust point to SFT, a stronger model
            you may train on points to distillation, pairs of answers point to DPO, and a grader
            that can score fresh attempts points to RL. Section 25 adds what the model scores on
            your grader today.
          </Box>
          <Box variant="p">
            <Box variant="strong" display="inline">
              What does RL do to a model?
            </Box>{' '}
            Section 10, What RL Does to a Model. The short answer: on the models and benchmarks in
            the studies the dive read, RL with verifiable rewards (RLVR, RL where a program checks
            each answer) mostly makes a model more reliable at answers it could already produce
            some of the time. That is sharpening, and the weight change behind it is small.
          </Box>
          <Box variant="p">
            <Box variant="strong" display="inline">
              Which part of that can a loop reproduce in words?
            </Box>{' '}
            The closing block of section 10, then sections 14 to 19, from A Text Loop Is RL on the
            Context to Hybrids. The short answer: a frozen model can buy part of the sharpening
            back by sampling more and choosing well, at a price paid on every query, about 8.84
            times the tokens per answer for one training-free sampler{' '}
            <Cite tier={3} href={SAMPLING} venue="ICLR 2026">
              Reasoning with Sampling, Table 1 and Section 5.3
            </Cite>
            . A text loop captures missing instructions and procedures cheaply.
          </Box>
          <Box variant="p">
            <Box variant="strong" display="inline">
              Where do the words fall short?
            </Box>{' '}
            Section 20, Where Words Fall Short, with reasoning skill in section 21 and behaviour
            that varies from input to input in section 19. The short answer, our reading of the
            studies the dive draws on: where the gap is reasoning skill, behaviour that varies from
            input to input, exploration (trying kinds of answers the model does not yet favour), or
            working out which step of a long run earned the result.
          </Box>
          <Box variant="p">
            <Box variant="strong" display="inline">
              How do you choose?
            </Box>{' '}
            Section 25, Choosing a Technique: Fine-Tuning, a Text Loop or a Hybrid. The short
            answer: three questions, in order. What kind of gap is it? What signal do you have, and
            what does the model score on it today? Can you touch the weights, and how many queries
            will the learned artifact serve? The work starts with the signal.
          </Box>
          <Box variant="p">
            Your next step: section 2, Getting Started, gives the five ideas to hold and the
            shortest reading route for the reason you are here. If you came with one of the five
            questions, go straight to its section; section 27, Glossary &amp; Sources, catches any
            term you meet out of order.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
