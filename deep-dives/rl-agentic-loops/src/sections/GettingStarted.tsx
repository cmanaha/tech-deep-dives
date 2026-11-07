import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';
import type { ReactNode } from 'react';
import { Cite, arxiv } from '../components/Cite';

/* ------------------------------------------------------------------------ */
/* Sources                                                                  */
/* ------------------------------------------------------------------------ */

/** Shinn et al., Reflexion: Language Agents with Verbal Reinforcement Learning. */
const REFLEXION = arxiv('2303.11366v4');
/** Training-Free Group Relative Policy Optimization. */
const TF_GRPO = arxiv('2510.08191v1');

/* ------------------------------------------------------------------------ */
/* Diagram: the reading map                                                 */
/* ------------------------------------------------------------------------ */

type RouteId = 'loops' | 'advisor' | 'rl' | 'finetune';

/** The four shorter routes, as SCOPE.md section 2 gives them. */
const ROUTE_SECTIONS: Record<RouteId, number[]> = {
  loops: [1, 2, 3, 5, 10, 13, 14, 15, 16, 17, 18, 19, 20, 21, 23, 25],
  advisor: [1, 2, 3, 5, 9, 10, 11, 13, 17, 19, 20, 21, 23, 25, 26],
  rl: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
  finetune: [1, 2, 3, 4, 5, 8, 9, 10, 11, 13, 23, 25, 26],
};
/** Section 22 is the optional systems coda of the RL route. */
const RL_OPTIONAL = [22];

const ROUTE_ORDER: RouteId[] = ['loops', 'advisor', 'rl', 'finetune'];

const ROUTE_STYLE: Record<RouteId, { letter: string; color: string }> = {
  loops: { letter: 'L', color: '#0972d3' },
  advisor: { letter: 'A', color: '#a04a00' },
  rl: { letter: 'R', color: '#037f0c' },
  finetune: { letter: 'F', color: '#6f4cc4' },
};

/** Section titles from App.tsx, wrapped by hand to fit a node. */
const TITLE_LINES: Record<number, string[]> = {
  1: ['1. One Loop: What It', 'Learns From and', 'Where It Keeps It'],
  2: ['2. Getting Started'],
  3: ['3. Fine-Tuning', 'Techniques: Where', 'the Learning Signal', 'Comes From'],
  4: ['4. Learning From', 'Answers: Supervised', 'Fine-Tuning &', 'Distillation'],
  5: ['5. The Language', 'Model Is Already a', 'Policy'],
  6: ['6. Policy Gradient'],
  7: ['7. Two Leashes:', "PPO's Clip & the KL"],
  8: ['8. Learning From', 'Preferences: Reward', 'Models, RLHF & DPO'],
  9: ['9. RLVR & GRPO'],
  10: ['10. What RL Does to', 'a Model'],
  11: ['11. Distillation or', "RL: A Teacher's", 'Answers or a Score', 'on Your Own'],
  12: ['12. Agentic RL'],
  13: ['13. The Reward Is a', 'Proxy'],
  14: ['14. A Text Loop Is', 'RL on the Context'],
  15: ['15. Verbal', 'Reinforcement &', 'Self-Correction'],
  16: ['16. Memories,', 'Playbooks & Skill', 'Libraries'],
  17: ['17. Optimising the', 'Prompt'],
  18: ['18. Your Loops', 'Through the RL Lens'],
  19: ['19. Hybrids'],
  20: ['20. Where Words', 'Fall Short'],
  21: ['21. What Lives in', 'Weights & What', 'Lives in Context'],
  22: ['22. An RL Step Is an', 'Inference Job Inside', 'a Training Job'],
  23: ['23. Cost per', 'Improvement'],
  24: ['24. Side by Side on', 'a DGX Spark'],
  25: ['25. Choosing a', 'Technique: Fine-', 'Tuning, a Text Loop', 'or a Hybrid'],
  26: ['26. Fine-Tuning &', 'Learning Loops on', 'AWS'],
};

const GS_W = 980;
const GS_H = 960;
const NODE_W = 132;
const NODE_H = 96;
/** Vertical offset of the route marks inside a node. */
const PIP_DY = 80;

interface Band {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  /** Rows of section numbers; each row is spread evenly across the band. */
  rows: number[][];
}

const ROW_H = 140;
const BANDS: Band[] = [
  { x: 36, y: 16, w: 312, h: ROW_H, label: 'Framing', rows: [[1, 2]] },
  { x: 380, y: 16, w: 312, h: ROW_H, label: 'Stage 1. Where the signal comes from', rows: [[3, 4]] },
  { x: 36, y: 186, w: 928, h: ROW_H, label: 'Stage 2. The RL vocabulary on tokens', rows: [[5, 6, 7, 8]] },
  {
    x: 36,
    y: 356,
    w: 928,
    h: ROW_H,
    label: 'Stage 3. What RL with a program as grader does to a model, set against distillation',
    rows: [[9, 10, 11, 12, 13]],
  },
  {
    x: 36,
    y: 526,
    w: 928,
    h: ROW_H,
    label: 'Stage 4. The same loop, with the context as the parameter',
    rows: [[14, 15, 16, 17, 18, 19]],
  },
  {
    x: 36,
    y: 696,
    w: 612,
    h: 248,
    label: 'Stage 5. The comparison, the cost and the choice',
    rows: [
      [20, 21, 22, 23],
      [24, 25, 26],
    ],
  },
];

/** Node top-left corners, computed from the bands: 12 units of padding, even gaps. */
const NODE_POS: Record<number, { x: number; y: number }> = (() => {
  const pos: Record<number, { x: number; y: number }> = {};
  for (const b of BANDS) {
    const perRow = Math.max(...b.rows.map((r) => r.length));
    const gap = perRow > 1 ? (b.w - 24 - perRow * NODE_W) / (perRow - 1) : 0;
    b.rows.forEach((row, ri) => {
      row.forEach((n, i) => {
        pos[n] = { x: b.x + 12 + i * (NODE_W + gap), y: b.y + 30 + ri * (NODE_H + 14) };
      });
    });
  }
  return pos;
})();

function routesFor(section: number): { id: RouteId; optional: boolean }[] {
  const out: { id: RouteId; optional: boolean }[] = [];
  for (const id of ROUTE_ORDER) {
    if (ROUTE_SECTIONS[id].includes(section)) out.push({ id, optional: false });
    else if (id === 'rl' && RL_OPTIONAL.includes(section)) out.push({ id, optional: true });
  }
  return out;
}

function RoutePip({ id, cx, cy, optional }: { id: RouteId; cx: number; cy: number; optional: boolean }) {
  const { letter, color } = ROUTE_STYLE[id];
  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={8}
        fill={optional ? '#ffffff' : color}
        stroke={color}
        strokeWidth={optional ? 1.8 : 1}
        strokeDasharray={optional ? '3 2' : undefined}
      />
      <text
        x={cx}
        y={cy + 4}
        textAnchor="middle"
        fontFamily="sans-serif"
        fontSize={11}
        fontWeight={700}
        fill={optional ? color : '#ffffff'}
      >
        {letter}
      </text>
    </g>
  );
}

function SectionNode({ n }: { n: number }) {
  const { x, y } = NODE_POS[n];
  const lines = n === 2 ? [...TITLE_LINES[2], 'You are here'] : TITLE_LINES[n];
  const here = n === 2;
  const slotX = [x + 18, x + 40, x + 62, x + 84];
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={NODE_W}
        height={NODE_H}
        rx={6}
        fill="#ffffff"
        stroke={here ? '#414d5c' : '#879596'}
        strokeWidth={here ? 2.5 : 1.2}
      />
      {lines.map((line, i) => (
        <text
          key={line}
          x={x + 8}
          y={y + 18 + i * 14}
          fontFamily="sans-serif"
          fontSize={11}
          fontWeight={i === 0 ? 600 : 400}
          fontStyle={here && i === 1 ? 'italic' : undefined}
          fill={here && i === 1 ? '#5f6b7a' : '#16191f'}
        >
          {line}
        </text>
      ))}
      {routesFor(n).map(({ id, optional }) => (
        <RoutePip
          key={id}
          id={id}
          cx={slotX[ROUTE_ORDER.indexOf(id)]}
          cy={y + PIP_DY}
          optional={optional}
        />
      ))}
    </g>
  );
}

const LEGEND_X = 680;
const LEGEND_Y = 696;

function LegendRow({ y, lines, children }: { y: number; lines: string[]; children: ReactNode }) {
  return (
    <g>
      {children}
      {lines.map((line, i) => (
        <text key={line} x={LEGEND_X + 38} y={y + 4 + i * 14} fontFamily="sans-serif" fontSize={11} fill="#16191f">
          {line}
        </text>
      ))}
    </g>
  );
}

function ReadingMapDiagram() {
  const arrow = { stroke: '#5f6b7a', strokeWidth: 2, fill: 'none', markerEnd: 'url(#gs-map-ah)' };
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox={`0 0 ${GS_W} ${GS_H}`}
        role="img"
        aria-labelledby="gs-map-title"
        aria-describedby="gs-map-desc"
        style={{ width: '100%', minWidth: 760, height: 'auto' }}
      >
        <title id="gs-map-title">
          The dive&apos;s reading map. Sections 1 and 2 frame the dive. Five stages then run in
          order: where the signal comes from (sections 3 and 4), the RL vocabulary on tokens (5 to
          8), what RL with a program as grader does to a model, set against distillation (9 to 13),
          the same loop with the context as the parameter (14 to 19), and the comparison, the cost
          and the choice (20 to 26), which builds on stage 3 directly as well as on stage 4.
          Lettered marks inside each section show which of the four shorter routes reads it.
        </title>
        <desc id="gs-map-desc">
          L, the route for readers who run agent loops and want them to learn: sections 1, 2, 3, 5,
          10, 13 to 21, 23 and 25. A, the route for readers who advise a team choosing between
          reinforcement fine-tuning and prompting: sections 1, 2, 3, 5, 9, 10, 11, 13, 17, 19, 20,
          21, 23, 25 and 26. R, the route for readers who want RL properly: sections 2 to 13 in
          order, with section 22 optional, drawn as a dashed mark. F, the route for readers choosing
          a fine-tuning technique: sections 1, 2, 3, 4, 5, 8, 9, 10, 11, 13, 23, 25 and 26. Section
          24 is on no shorter route.
        </desc>
        <defs>
          <marker
            id="gs-map-ah"
            viewBox="0 0 10 10"
            refX={9}
            refY={5}
            markerWidth={7}
            markerHeight={7}
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="#5f6b7a" />
          </marker>
        </defs>
        <rect x={0} y={0} width={GS_W} height={GS_H} rx={8} fill="#ffffff" />

        {BANDS.map((b) => (
          <g key={b.label}>
            <rect
              x={b.x}
              y={b.y}
              width={b.w}
              height={b.h}
              rx={8}
              fill="#f4f6f8"
              stroke="#d1d5db"
              strokeWidth={1.2}
            />
            <text
              x={b.x + 10}
              y={b.y + 18}
              fontFamily="sans-serif"
              fontSize={12}
              fontWeight={700}
              fill="#16191f"
            >
              {b.label}
            </text>
          </g>
        ))}

        {/* The path between stages */}
        <path d="M 348 94 H 378" style={arrow} />
        <path d="M 536 156 V 184" style={arrow} />
        <path d="M 500 326 V 354" style={arrow} />
        <path d="M 500 496 V 524" style={arrow} />
        <path d="M 340 666 V 694" style={arrow} />
        {/* Stage 5 also builds on stage 3 directly */}
        <path
          d="M 60 496 V 506 Q 60 511 55 511 H 23 Q 18 511 18 516 V 676 Q 18 681 23 681 H 55 Q 60 681 60 686 V 694"
          style={arrow}
        />
        <text x={72} y={688} fontFamily="sans-serif" fontSize={11} fill="#414d5c">
          Stage 5 also builds on stage 3
        </text>

        {Object.keys(NODE_POS).map((k) => (
          <SectionNode key={k} n={Number(k)} />
        ))}

        {/* Legend */}
        <rect x={LEGEND_X} y={LEGEND_Y} width={284} height={248} rx={8} fill="#ffffff" stroke="#d1d5db" strokeWidth={1.2} />
        <text x={LEGEND_X + 12} y={LEGEND_Y + 20} fontFamily="sans-serif" fontSize={12} fontWeight={700} fill="#16191f">
          Shorter routes
        </text>
        <LegendRow y={LEGEND_Y + 42} lines={['I run agent loops and want them', 'to learn']}>
          <RoutePip id="loops" cx={LEGEND_X + 22} cy={LEGEND_Y + 42} optional={false} />
        </LegendRow>
        <LegendRow
          y={LEGEND_Y + 82}
          lines={['I advise a team choosing between', 'reinforcement fine-tuning and', 'prompting']}
        >
          <RoutePip id="advisor" cx={LEGEND_X + 22} cy={LEGEND_Y + 82} optional={false} />
        </LegendRow>
        <LegendRow y={LEGEND_Y + 136} lines={['I want RL properly']}>
          <RoutePip id="rl" cx={LEGEND_X + 22} cy={LEGEND_Y + 136} optional={false} />
        </LegendRow>
        <LegendRow y={LEGEND_Y + 162} lines={['I want to choose a fine-tuning', 'technique']}>
          <RoutePip id="finetune" cx={LEGEND_X + 22} cy={LEGEND_Y + 162} optional={false} />
        </LegendRow>
        <LegendRow y={LEGEND_Y + 202} lines={['Optional on the RL route']}>
          <RoutePip id="rl" cx={LEGEND_X + 22} cy={LEGEND_Y + 202} optional={true} />
        </LegendRow>
        <LegendRow y={LEGEND_Y + 226} lines={['The path from stage to stage']}>
          <path d={`M ${LEGEND_X + 12} ${LEGEND_Y + 226} H ${LEGEND_X + 34}`} style={arrow} />
        </LegendRow>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

function IdeaCard({
  title,
  children,
  where,
}: {
  title: string;
  children: ReactNode;
  where: ReactNode;
}) {
  return (
    <div>
      <Box variant="h3">{title}</Box>
      <Box variant="p">{children}</Box>
      <Box variant="small" color="text-body-secondary">
        {where}
      </Box>
    </div>
  );
}

export function GettingStarted() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Five ideas to hold, and the shortest route through the dive for the reason you are reading (sources read 2026-10-30)"
          >
            2. Getting Started
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The dive runs to 27 sections, from where a fine-tuning signal comes from, through the
            reinforcement learning (RL) vocabulary, to a choice of technique and the AWS services
            that run it. A reader with one question needs a subset of them, and the challenge is
            choosing that subset without losing the thread. This section says where the dive
            starts, gives the five ideas the rest of it leans on, and the routes through it.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Check that the dive starts where your experience ends, and find where the two mechanics it builds on are explained"
          >
            Who the dive is written for
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The dive is written for a technical reader who uses language models, prompts and agent
            loops in practice and knows that a model has weights, counted in billions of
            parameters, that can be fine-tuned, but not how training turns a signal into a change
            in those weights. Two mechanics carry the rest: the gradient step, which section 4
            builds where SFT (supervised fine-tuning) first needs it and the{' '}
            <Link href="../llm-training-systems/">
              training dive, section 3: One Training Step: What It Computes and Keeps
            </Link>{' '}
            follows onto the hardware, and the cost of the context, which every call pays again
            and the <Link href="../vllm/">vLLM dive, section 6: Automatic Prefix Caching</Link>{' '}
            shows a serving engine taking back with a cache.
          </Box>
          <Box variant="p">
            Each section defines the terms it uses when it first uses them. If a shorter route
            brings you to a term out of order, section 27, Glossary &amp; Sources, lists every
            acronym the dive uses and its reading list, grouped by authority.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Hold five ideas and any section on any route reads; each one names the section that defines it"
          >
            Five ideas to hold
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Every later section leans on five ideas. The section named under each one defines it
            with its evidence.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <IdeaCard
              title="Where the signal comes from"
              where="Defined in section 3, Fine-Tuning Techniques: Where the Learning Signal Comes From."
            >
              Fine-tuning techniques differ first in what they learn from: example answers, a
              stronger model&apos;s answers, pairs of answers where one is better, or a score on
              the model&apos;s own attempts. An answer gives a target at every token of the
              response; a score gives one number for the whole response.
            </IdeaCard>
            <IdeaCard
              title="Policy and reward"
              where="Defined in section 5, The Language Model Is Already a Policy."
            >
              RL calls whatever chooses the actions a policy. Here the policy is the language model:
              at each step it gives a probability to every possible next token, and every sampled
              call draws from those probabilities. A reward is one number per attempt, produced by a
              grader, and it usually arrives only at the end of the response.
            </IdeaCard>
            <IdeaCard
              title="Advantage"
              where="Defined in section 5; section 6, Policy Gradient, shows the two ways to estimate it."
            >
              How much better or worse an attempt did than expected. As an illustration: if
              attempts at a prompt pass 30% of the time, scored 1 for a pass and 0 for a fail, the
              expected score is 0.3, so a pass is 0.7 above expectation and a fail 0.3 below. The
              sign decides whether a training step makes that attempt more likely or less likely.
            </IdeaCard>
            <IdeaCard
              title="The grader as a proxy"
              where={
                <>
                  Section 9, RLVR &amp; GRPO (RL with verifiable rewards, and Group Relative Policy
                  Optimization), introduces the program as grader; section 13, The Reward Is a
                  Proxy, shows how to build one that holds up under optimisation.
                </>
              }
            >
              The grader is the program or model that produces the reward. It stands in for what
              you actually want, and optimisation pressure finds the places where the two differ:
              training makes whatever the grader rewards more likely, including answers that score
              well without being what you meant.
            </IdeaCard>
            <IdeaCard
              title="pass@k and the capability boundary"
              where="pass@k is defined in section 5; section 10, What RL Does to a Model, defines the boundary and reads both as a curve."
            >
              pass@1 is how often one sample succeeds, and pass@k is whether any of k samples
              does; averaged over problems, it is the share solved within k tries. The capability
              boundary is the set of problems a model solves when k is large: what its sampling can
              reach at all.
            </IdeaCard>
          </ColumnLayout>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="See why the map and the RL sections come before the loops you already run, so the second half reads as the same loop with a new place to keep what it learns"
          >
            The path, and why in this order
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Read in full, the dive runs in five stages after the two opening sections.
          </Box>
          <ol>
            <li>
              <Box variant="p">
                Where the signal comes from, sections 3 and 4: the map of fine-tuning techniques by
                signal source, then the two that learn from written answers, SFT and distillation.
                Section 4 builds the gradient step, the log-probability of a token and the KL
                (Kullback-Leibler) divergence, a number for how different two next-token
                distributions are, because SFT and distillation are where the dive first needs
                them.
              </Box>
            </li>
            <li>
              <Box variant="p">
                The RL vocabulary on tokens, sections 5 to 8: the policy; the policy gradient, the
                basic rule for turning a score into a weight change; the clip of PPO (Proximal
                Policy Optimization), a limit on how far one round of training can move the model;
                the KL penalty, a charge for drifting from the model the run started from; and
                learning from preferences, where a reward model is trained on people&apos;s choices
                between two responses, or DPO (Direct Preference Optimization) learns from those
                pairs directly.
              </Box>
            </li>
            <li>
              <Box variant="p">
                What RL with a program as grader does to a model, sections 9 to 13, including what
                a frozen model can buy back without training (the close of section 10), how it
                compares with distilling a stronger model (section 11), and ending on the reward as
                a proxy (section 13).
              </Box>
            </li>
            <li>
              <Box variant="p">
                The same loop rebuilt with the context as the trainable parameter, sections 14 to
                19: the text a loop writes plays the part the weights play in RL.
              </Box>
            </li>
            <li>
              <Box variant="p">The comparison, the cost and the choice, sections 20 to 26.</Box>
            </li>
          </ol>
          <Box variant="p">
            The two answer-based techniques come before RL because RL reads most easily as their
            extension: section 6 builds the policy gradient as fine-tuning on the model&apos;s own
            samples, weighted by their score. RL comes before the loops because the loop papers
            describe themselves in its terms. Reflexion&apos;s full title is &quot;Reflexion:
            Language Agents with Verbal Reinforcement Learning&quot;{' '}
            <Cite tier={3} href={REFLEXION} venue="NeurIPS 2023">
              Reflexion, title
            </Cite>
            , and Training-Free GRPO is named in full &quot;Training-Free Group Relative Policy
            Optimization&quot;, after the RL algorithm of section 9{' '}
            <Cite tier={3} href={TF_GRPO} venue="preprint">
              Training-Free GRPO, title and abstract
            </Cite>
            . The capability result in section 10 comes before the words track because it sets what
            a loop would have to reproduce. Section 13 previews the words track: its second half
            already uses Ralph, autoresearch and Reflexion, and points ahead to the sections that
            introduce them.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Pick the route that matches why you are reading, and skip the sections it does not need"
          >
            Four shorter routes
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Each shorter route is built around one reason to read. Reinforcement fine-tuning, in
            the second, is the name AWS and OpenAI give to managed RL on a model they host.
          </Box>
          <ul>
            <li>
              <Box variant="p">
                <Box variant="strong" display="inline">
                  &quot;I run agent loops and want them to learn&quot;:
                </Box>{' '}
                sections 1, 2, 3, 5, 10, 13 to 21, 23 and 25.
              </Box>
            </li>
            <li>
              <Box variant="p">
                <Box variant="strong" display="inline">
                  &quot;I advise a team choosing between reinforcement fine-tuning and
                  prompting&quot;:
                </Box>{' '}
                sections 1, 2, 3, 5, 9, 10, 11, 13, 17, 19, 20, 21, 23, 25, 26.
              </Box>
            </li>
            <li>
              <Box variant="p">
                <Box variant="strong" display="inline">
                  &quot;I want RL properly&quot;:
                </Box>{' '}
                sections 2 to 13 in order, with section 22, An RL Step Is an Inference Job Inside a
                Training Job, as an optional coda on the systems side.
              </Box>
            </li>
            <li>
              <Box variant="p">
                <Box variant="strong" display="inline">
                  &quot;I want to choose a fine-tuning technique&quot;:
                </Box>{' '}
                sections 1, 2, 3, 4, 5, 8, 9, 10, 11, 13, 23, 25, 26.
              </Box>
            </li>
          </ul>
          <Box variant="p">
            The map lays the sections out by stage. Arrows show the path from stage to stage, and
            a lettered mark inside a section shows which shorter route reads it. Section 19,
            Hybrids, is section 1&apos;s third store, a small trained model; section 24 runs on a
            DGX Spark, NVIDIA&apos;s desktop machine.
          </Box>
          <ReadingMapDiagram />
          <Box variant="small" color="text-body-secondary">
            Sections read left to right within a stage. Section 24, Side by Side on a DGX Spark,
            is on no shorter route: it runs one RL step on hardware you can own and sets out the
            protocol for running the comparison there.
          </Box>
          <Box variant="p">
            Where a section on a shorter route names a method from a section you skipped, look for
            a one-clause gloss with a pointer beside it, as when section 25 introduces GEPA as
            &quot;Genetic-Pareto, the reflective prompt optimiser of section 17&quot;.
          </Box>
          <ExpandableSection headerText="What each shorter route keeps from the first half, and why">
            <SpaceBetween size="s">
              <Box variant="p">
                Each shorter route keeps the early sections that its later stops point back to.
              </Box>
              <Box variant="p">
                <Box variant="strong" display="inline">
                  Sections 3 and 5, on every route.
                </Box>{' '}
                Section 3 is the map of signal sources that section 25&apos;s second question forks
                into. Section 5 defines the policy, the reward, the advantage and pass@k, and its
                closing block is the bridge that section 14 builds the words track on.
              </Box>
              <Box variant="p">
                <Box variant="strong" display="inline">
                  Section 10, on every route.
                </Box>{' '}
                Section 21 points to it for sharpening, section 23&apos;s calculator takes
                sampling more at query time from it, and section 25 caps that option at the base
                model&apos;s own pass@k with a pointer back to it.
              </Box>
              <Box variant="p">
                <Box variant="strong" display="inline">
                  Section 13, on every route.
                </Box>{' '}
                Section 18&apos;s hardening checklist starts with its grader checks, and section 25
                sends a gap with no trustworthy signal back to its four checks.
              </Box>
              <Box variant="p">
                <Box variant="strong" display="inline">
                  Sections 9 and 26, on the advisor and fine-tuning routes.
                </Box>{' '}
                Section 25 relies on section 9 to turn today&apos;s base rate, the share of
                attempts the model passes now, into the expected share of training groups that
                carry no learning signal: when every attempt in a group gets the same score, no
                attempt did better or worse than the others, every advantage is 0, and the group
                adds nothing to the reward-driven part of the update (only the KL penalty, when it
                is switched on, still acts on it). Section 25 also names the AWS service for each
                path and leaves the detail to section 26.
              </Box>
              <Box variant="p">
                <Box variant="strong" display="inline">
                  Sections 4, 8 and 11, on the fine-tuning route.
                </Box>{' '}
                Section 4 builds SFT and distillation, section 8 the techniques that learn from
                pairs of answers, and section 11 sets distillation against RL, the fork section 25
                sends a gap in reasoning skill to.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <Box variant="p">
            Pick the route that matches why you are reading. If you came straight here, read
            section 1, One Loop: What It Learns From and Where It Keeps It, first on every route
            but the RL one. All four routes then continue at section 3, Fine-Tuning Techniques:
            Where the Learning Signal Comes From.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
