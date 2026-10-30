import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Table from '@cloudscape-design/components/table';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { Cite, arxiv } from '../components/Cite';

/* ------------------------------------------------------------------------ */
/* Sources                                                                  */
/* ------------------------------------------------------------------------ */

/** Adaptation of Agentic AI (survey), the source of the signal axis. */
const SURVEY = arxiv('2512.16301v3');
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
    sub: ['training changes the model', 'sections 3 to 10'],
    chips: ['GRPO', 'PPO'],
  },
  {
    cls: 'one-loop-cycle-cx',
    title: 'The context',
    sub: ['a frozen model reads it', 'sections 11 to 15'],
    chips: ['Reflexion', 'GEPA'],
  },
  {
    cls: 'one-loop-cycle-sm',
    title: 'A small trained model',
    sub: ['writes context for a', 'large one, section 16'],
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
    weights: 'A training run, paid once; generation takes most of each step (sections 19 and 20)',
    context:
      'Little up front: attempts sampled and scored, plus the calls that write the update (section 20)',
    small: 'An RL run on the small model only; the large model is reached through its API (section 16)',
  },
  {
    id: 'serve',
    decides: 'Cost per query',
    weights: 'The cost of serving the model it trained (section 20)',
    context:
      'The tokens the update adds to every query, part of which prompt caching takes back (section 20)',
    small:
      "A call to the small model on each input, plus the words it adds to the large model's context (section 16)",
  },
  {
    id: 'keep',
    decides: 'What the model keeps',
    weights:
      'Some old ability is forgotten, more the further training moves the model from its base; RL moves it less than SFT (supervised fine-tuning) does (sections 8 and 18)',
    context:
      'Every old ability once the text is removed, since the weights never move; the text can be read, edited and removed, and a store fed misleading feedback degrades (sections 13 and 18)',
    small: "Every ability of the large model once the advice is removed; only the small model's weights move (section 16)",
  },
  {
    id: 'learn',
    decides: 'What it holds best',
    weights:
      'What must be fast, calibrated or general: sharpening toward answers the model can already give, and new reasoning skill through distillation from a stronger model (sections 8 and 18)',
    context:
      'What is specific, recent and auditable: instructions, procedures and facts (sections 13, 14 and 18)',
    small: 'Behaviour that changes from input to input, for a large model you cannot train (section 16)',
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
            description="Place any method in this dive by where its update lands, and know before the details what it costs and what it can learn (sources read 2026-10-30)"
          >
            1. One Loop, Three Places to Keep What It Learns
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
            Every method in this dive runs that loop: sample attempts, score them, and change
            something so the next attempts score better. The methods differ in where the change
            lands. That location decides four things before any detail of the method matters: what
            training costs, what each query costs, what the model keeps of what it could already
            do, and what can be learned at all.
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
            Three stores can hold the change. In the weights, RL (reinforcement learning) such as
            PPO (Proximal Policy Optimization) or GRPO (Group Relative Policy Optimization) trains
            the model itself. In the context a frozen model reads, a model whose weights stay
            fixed, a loop such as Reflexion or GEPA (Genetic-Pareto) writes a reflection, a
            rewritten prompt, a playbook, a memory or a skill file, and the next attempt runs with
            it. In a small trained model that writes context for a large one, RL trains the small
            model, as in Advisor Models and Retroformer, and the large model stays frozen.
          </Box>
          <OneLoopDiagram />
          <ExpandableSection headerText="The rest of the dive, sorted by store and section">
            <SpaceBetween size="s">
              <Box variant="p">
                <Box variant="strong" display="inline">The weights</Box> hold policy gradient, the
                update behind PPO and GRPO (section 4); PPO&apos;s limits on each step (section 5);
                RLHF (RL from human feedback) and DPO (Direct Preference Optimization), which learn
                from pairs of responses where one was judged better (section 6); GRPO and its
                successors, scored by a program that checks each answer (section 7); agentic RL
                such as Search-R1 and DeepSWE, where one attempt is a multi-turn episode with tools
                (section 9); and SCoRe (Self-Correction via Reinforcement Learning), which trains a
                model to correct its own answers (section 12).
              </Box>
              <Box variant="p">
                <Box variant="strong" display="inline">The context</Box> holds reflection and
                self-critique, Reflexion and Self-Refine (section 12); memories, playbooks and skill
                libraries such as ExpeL, ACE (Agentic Context Engineering), Dynamic Cheatsheet,
                Voyager and Training-Free GRPO, a text loop named after the RL method (section 13);
                prompt optimisers, GEPA among them (section 14); and loops you may already run,
                Ralph and autoresearch, beside the program-search loops FunSearch and AlphaEvolve
                (section 15).
              </Box>
              <Box variant="p">
                <Box variant="strong" display="inline">A small trained model</Box> holds Advisor
                Models and Retroformer, which train the model that writes the advice or the
                reflection, and Memento, which trains the retrieval over a bank of past cases
                (section 16).
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <Box variant="p">
            A fourth route stores nothing. Sampling a frozen model several times and choosing among
            the attempts, with a verifier (a checker that recognises a correct answer) or with a
            sampler that needs none, pays on every query instead: a training-free sampler nearly matched
            the single-shot score of GRPO on a math benchmark, at about 8.84 times the tokens per
            answer{' '}
            <Cite tier={3} href={SAMPLING} venue="ICLR 2026">
              Reasoning with Sampling, Table 1 and Section 5.3
            </Cite>
            . The closing block of section 8, What RL Does to a Model, prices that route.
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
            Read across a row of the table and the trade shows: the weights pay once and hold what must be fast, calibrated or general; the
            context pays on every query and holds what is specific, recent and auditable; a small
            trained model buys a weight update for a large model you can only call.
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
            description="Ask where a loop's score comes from before anything else about it: the score decides whether the loop learns, in any store"
          >
            Where the score comes from
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            In every store the score decides whether anything is learned, and it is the surface an
            optimiser learns to game. The second axis the dive uses is where the signal comes
            from, taken from a survey of agent adaptation: execution-grounded (the result of a tool call or code run: tests, a
            compiler, an environment) or output-evaluated (a score on the final output: an
            exact-match check against a gold answer, a rubric, or a judge){' '}
            <Cite tier={3} href={SURVEY} venue="preprint">
              Adaptation of Agentic AI, Section 1
            </Cite>
            . In this dive the axis crosses all three stores, an extension of the survey&apos;s frame,
            and section 11, A Text Loop Is RL on the Context, places every method of the words track
            on the grid the two axes make.
          </Box>
          <Box variant="p">
            Section 10, The Reward Is a Proxy, builds a grader for a training run and a text loop
            alike; section 12, Verbal Reinforcement &amp; Self-Correction, shows what a loop learns with no signal from outside the model. The
            second of section 22&apos;s three decision questions starts here: what signal do you
            have?
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Go straight to the question you came with: each has a section that answers it, and a short answer here"
          >
            Four questions, and where each is answered
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <Box variant="strong" display="inline">
              What does RL do to a model?
            </Box>{' '}
            Section 8, What RL Does to a Model. The short answer: on the models and benchmarks in
            the studies the dive read, RL with verifiable rewards mostly makes a model more reliable at answers
            it could already produce some of the time. That is sharpening, and the weight change
            behind it is small.
          </Box>
          <Box variant="p">
            <Box variant="strong" display="inline">
              Which part of that can a loop reproduce in words?
            </Box>{' '}
            The closing block of section 8, then sections 11 to 16, from A Text Loop Is RL on the
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
            Section 17, Where Words Fall Short, with reasoning skill in section 18 and behaviour that
            varies from input to input in section 16. The short answer, our reading of the studies the
            dive draws on: where the gap is reasoning skill, behaviour that varies from input to input,
            exploration, or working out which step of a long run earned the result.
          </Box>
          <Box variant="p">
            <Box variant="strong" display="inline">
              How do you choose?
            </Box>{' '}
            Section 22, Choosing a Text Loop, a Hybrid or a Weight Update. The short answer: three
            questions, in order. What kind of gap is it? What signal do you have, and what does the
            model score on it today? Can you touch the weights, and how many queries will the
            learned artifact serve? The work starts with the grader.
          </Box>
          <Box variant="p">
            Your next step: section 2, Getting Started, gives the four ideas to hold and the
            shortest reading route for the reason you are here. If you came with one of the four
            questions, go straight to its section; section 24, Glossary &amp; Sources, catches any
            term you meet out of order.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
