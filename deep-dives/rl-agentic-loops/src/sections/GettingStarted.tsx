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

type RouteId = 'loops' | 'advisor' | 'rl';

/** The three shorter routes, exactly as SCOPE.md section 2 gives them. */
const ROUTE_SECTIONS: Record<RouteId, number[]> = {
  loops: [1, 2, 3, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 22],
  advisor: [1, 2, 3, 7, 8, 10, 14, 16, 17, 18, 20, 22, 23],
  rl: [2, 3, 4, 5, 6, 7, 8, 9, 10],
};
/** Section 19 is the optional systems coda of the RL route. */
const RL_OPTIONAL = [19];

const ROUTE_ORDER: RouteId[] = ['loops', 'advisor', 'rl'];

const ROUTE_STYLE: Record<RouteId, { letter: string; color: string }> = {
  loops: { letter: 'L', color: '#0972d3' },
  advisor: { letter: 'A', color: '#a04a00' },
  rl: { letter: 'R', color: '#037f0c' },
};

/** Section titles from App.tsx, wrapped by hand to fit a node. */
const TITLE_LINES: Record<number, string[]> = {
  1: ['1. One Loop, Three', 'Places to Keep What', 'It Learns'],
  2: ['2. Getting Started'],
  3: ['3. The Language', 'Model Is Already a', 'Policy'],
  4: ['4. Policy Gradient'],
  5: ['5. Two Leashes:', "PPO's Clip & the KL"],
  6: ['6. From Preferences', 'to Rewards'],
  7: ['7. RLVR & GRPO'],
  8: ['8. What RL Does to', 'a Model'],
  9: ['9. Agentic RL'],
  10: ['10. The Reward Is a', 'Proxy'],
  11: ['11. A Text Loop Is', 'RL on the Context'],
  12: ['12. Verbal', 'Reinforcement &', 'Self-Correction'],
  13: ['13. Memories,', 'Playbooks & Skill', 'Libraries'],
  14: ['14. Optimising the', 'Prompt'],
  15: ['15. Your Loops', 'Through the RL Lens'],
  16: ['16. Hybrids'],
  17: ['17. Where Words', 'Fall Short'],
  18: ['18. What Lives in', 'Weights & What', 'Lives in Context'],
  19: ['19. An RL Step Is an', 'Inference Job Inside', 'a Training Job'],
  20: ['20. Cost per', 'Improvement'],
  21: ['21. Side by Side on', 'a DGX Spark'],
  22: ['22. Choosing a Text', 'Loop, a Hybrid or a', 'Weight Update'],
  23: ['23. RL & Learning', 'Loops on AWS'],
};

const GS_W = 980;
const GS_H = 668;
const NODE_W = 132;
const NODE_H = 80;

/** Node top-left corners, laid out by stage band. */
const NODE_POS: Record<number, { x: number; y: number }> = {
  // Framing band
  1: { x: 44, y: 42 },
  2: { x: 44, y: 184 },
  // Stage 1
  3: { x: 228, y: 42 },
  4: { x: 425, y: 42 },
  5: { x: 623, y: 42 },
  6: { x: 820, y: 42 },
  // Stage 2
  7: { x: 228, y: 184 },
  8: { x: 425, y: 184 },
  9: { x: 623, y: 184 },
  10: { x: 820, y: 184 },
  // Stage 3
  11: { x: 48, y: 326 },
  12: { x: 202, y: 326 },
  13: { x: 357, y: 326 },
  14: { x: 511, y: 326 },
  15: { x: 666, y: 326 },
  16: { x: 820, y: 326 },
  // Stage 4
  17: { x: 48, y: 468 },
  18: { x: 215, y: 468 },
  19: { x: 381, y: 468 },
  20: { x: 548, y: 468 },
  21: { x: 48, y: 562 },
  22: { x: 215, y: 562 },
  23: { x: 381, y: 562 },
};

const BANDS: { x: number; y: number; w: number; h: number; label: string }[] = [
  { x: 36, y: 16, w: 148, h: 254, label: 'Framing' },
  { x: 216, y: 16, w: 748, h: 112, label: 'Stage 1. The RL vocabulary on tokens' },
  {
    x: 216,
    y: 158,
    w: 748,
    h: 112,
    label: 'Stage 2. What RL with a program as grader does to a model',
  },
  {
    x: 36,
    y: 300,
    w: 928,
    h: 112,
    label: 'Stage 3. The same loop, with the context as the parameter',
  },
  { x: 36, y: 442, w: 656, h: 210, label: 'Stage 4. The comparison, the cost and the choice' },
];

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
  const slotX = [x + 18, x + 40, x + 62];
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
          cy={y + 65}
          optional={optional}
        />
      ))}
    </g>
  );
}

function ReadingMapDiagram() {
  const arrow = { stroke: '#5f6b7a', strokeWidth: 2, fill: 'none', markerEnd: 'url(#gs-map-ah)' };
  const legendX = 712;
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
          The dive&apos;s reading map. Sections 1 and 2 frame the dive. Four stages then run in
          order: the RL vocabulary on tokens (sections 3 to 6), what RL with a program as grader
          does to a model (7 to 10), the same loop with the context as the parameter (11 to 16),
          and the comparison, the cost and the choice (17 to 23), which builds on stage 2 directly
          as well as on stage 3. Lettered marks inside each section show which of the three shorter
          routes reads it.
        </title>
        <desc id="gs-map-desc">
          L, the route for readers who run agent loops and want them to learn: sections 1, 2, 3, 8,
          10, 11, 12, 13, 14, 15, 16, 17, 18, 20 and 22. A, the route for readers who advise a team
          choosing between reinforcement fine-tuning and prompting: sections 1, 2, 3, 7, 8, 10, 14,
          16, 17, 18, 20, 22 and 23. R, the route for readers who want RL properly: sections 2 to 10
          in order, with section 19 optional, drawn as a dashed mark. Section 21 is on no shorter
          route.
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
        <path d="M 184 80 H 214" style={arrow} />
        <path d="M 590 128 V 156" style={arrow} />
        <path d="M 590 270 V 298" style={arrow} />
        <path d="M 364 412 V 440" style={arrow} />
        {/* Stage 4 also builds on stage 2 directly */}
        <path d="M 240 270 V 280 Q 240 285 235 285 H 23 Q 18 285 18 290 V 422 Q 18 427 23 427 H 55 Q 60 427 60 432 V 440" style={arrow} />
        <text x={72} y={434} fontFamily="sans-serif" fontSize={11} fill="#414d5c">
          Stage 4 also builds on stage 2
        </text>

        {Object.keys(NODE_POS).map((k) => (
          <SectionNode key={k} n={Number(k)} />
        ))}

        {/* Legend */}
        <rect x={legendX} y={442} width={252} height={210} rx={8} fill="#ffffff" stroke="#d1d5db" strokeWidth={1.2} />
        <text x={legendX + 12} y={462} fontFamily="sans-serif" fontSize={12} fontWeight={700} fill="#16191f">
          Shorter routes
        </text>
        <RoutePip id="loops" cx={legendX + 22} cy={482} optional={false} />
        <text x={legendX + 38} y={486} fontFamily="sans-serif" fontSize={11} fill="#16191f">
          I run agent loops and want them
        </text>
        <text x={legendX + 38} y={500} fontFamily="sans-serif" fontSize={11} fill="#16191f">
          to learn
        </text>
        <RoutePip id="advisor" cx={legendX + 22} cy={522} optional={false} />
        <text x={legendX + 38} y={526} fontFamily="sans-serif" fontSize={11} fill="#16191f">
          I advise a team choosing between
        </text>
        <text x={legendX + 38} y={540} fontFamily="sans-serif" fontSize={11} fill="#16191f">
          reinforcement fine-tuning and
        </text>
        <text x={legendX + 38} y={554} fontFamily="sans-serif" fontSize={11} fill="#16191f">
          prompting
        </text>
        <RoutePip id="rl" cx={legendX + 22} cy={576} optional={false} />
        <text x={legendX + 38} y={580} fontFamily="sans-serif" fontSize={11} fill="#16191f">
          I want RL properly
        </text>
        <RoutePip id="rl" cx={legendX + 22} cy={600} optional={true} />
        <text x={legendX + 38} y={604} fontFamily="sans-serif" fontSize={11} fill="#16191f">
          Optional on that route
        </text>
        <path d={`M ${legendX + 12} 626 H ${legendX + 34}`} style={arrow} />
        <text x={legendX + 38} y={630} fontFamily="sans-serif" fontSize={11} fill="#16191f">
          The path from stage to stage
        </text>
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
            description="Four ideas to hold, and the shortest route through the dive for the reason you are reading (sources read 2026-10-30)"
          >
            2. Getting Started
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The dive runs to 24 sections, from the RL (reinforcement learning) vocabulary to a
            choice of method and the AWS services that run it. A reader with one question needs a
            subset of them, and the challenge is choosing that subset without losing the thread.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Check that the dive starts where your experience ends, and know where to look up a term you meet out of order"
          >
            Who the dive is written for
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The dive is written for a technical lead who knows inference engines, GPUs, prompts
            and agent loops in practice, has run long autonomous coding agents, and has no formal
            RL background. It takes two things from that background as given.
          </Box>
          <ul>
            <li>
              <Box variant="p">
                The context window as everything a frozen model conditions on, with its cost
                rules: the effective length, how much of a long context a model still uses well,
                and prefix caching. Section 17, Where Words Fall Short, applies both rules to
                learning loops, and the{' '}
                <Link href="../vllm/">vLLM dive, section 6: Automatic Prefix Caching</Link> covers
                the cache itself.
              </Box>
            </li>
            <li>
              <Box variant="p">
                A gradient step nudges the weights to make something more likely. The dive needs
                no calculus beyond that.
              </Box>
            </li>
          </ul>
          <Box variant="p">
            Each section defines the RL terms it uses when it first uses them. If a shorter route
            brings you to a term out of order, section 24, Glossary &amp; Sources, lists every
            acronym the dive uses and its reading list, grouped by authority.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Hold four ideas and any section on any route reads; each one names the section that defines it"
          >
            Four ideas to hold
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Every later section leans on four ideas. The section named under each one defines it
            with its evidence.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <IdeaCard
              title="Policy and reward"
              where="Defined in section 3, The Language Model Is Already a Policy."
            >
              The model is a policy: a probability distribution over next tokens, which every
              sampled call draws from. A reward is one number per attempt, and it usually arrives
              only at the end of the response.
            </IdeaCard>
            <IdeaCard
              title="Advantage"
              where="Defined in section 3; section 4, Policy Gradient, shows the two ways to estimate it."
            >
              How much better or worse an attempt did than expected. Its sign decides whether a
              training step makes that attempt more likely or less likely.
            </IdeaCard>
            <IdeaCard
              title="The grader as a proxy"
              where={
                <>
                  Section 7, RLVR &amp; GRPO (RL with verifiable rewards, and Group Relative Policy
                  Optimization), introduces the program as grader; section 10, The Reward Is a
                  Proxy, shows how to build one that holds up under optimisation.
                </>
              }
            >
              The grader is the program or model that produces the reward. It stands in for what
              you actually want, and optimisation pressure finds the places where the two differ.
            </IdeaCard>
            <IdeaCard
              title="pass@k and the capability boundary"
              where="pass@k is defined in section 3; section 8, What RL Does to a Model, defines the boundary and reads both as a curve."
            >
              pass@1 is how often one sample succeeds, and pass@k is whether any of k samples
              does. The capability boundary is the set of problems a model solves when k is large.
            </IdeaCard>
          </ColumnLayout>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="See why the RL sections come before the loops you already run, so the second half reads as the same loop with a new place to keep what it learns"
          >
            The path, and why in this order
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Read in full, the dive runs in four stages after the two opening sections.
          </Box>
          <ol>
            <li>
              <Box variant="p">
                The RL vocabulary on tokens, sections 3 to 6: the policy, the policy gradient, the
                clip of PPO (Proximal Policy Optimization) and the KL (Kullback-Leibler
                divergence) penalty, and rewards learned from preferences.
              </Box>
            </li>
            <li>
              <Box variant="p">
                What RL with a program as grader does to a model, sections 7 to 10, including what
                a frozen model can buy back without training (the close of section 8) and ending
                on the reward as a proxy (section 10).
              </Box>
            </li>
            <li>
              <Box variant="p">
                The same loop rebuilt with the context as the trainable parameter, sections 11 to
                16.
              </Box>
            </li>
            <li>
              <Box variant="p">The comparison, the cost and the choice, sections 17 to 23.</Box>
            </li>
          </ol>
          <Box variant="p">
            RL comes first because the loop papers describe themselves in its terms. Reflexion&apos;s
            full title is &quot;Reflexion: Language Agents with Verbal Reinforcement Learning&quot;{' '}
            <Cite tier={3} href={REFLEXION} venue="NeurIPS 2023">
              Reflexion, title
            </Cite>
            , and Training-Free GRPO is named in full &quot;Training-Free Group Relative Policy
            Optimization&quot;, after the RL algorithm of section 7{' '}
            <Cite tier={3} href={TF_GRPO} venue="preprint">
              Training-Free GRPO, title and abstract
            </Cite>
            . The capability result in section 8 comes before the words track because it sets what
            a loop would have to reproduce. Section 10 previews the words track: its second half
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
            Three shorter routes
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">Each shorter route is built around one reason to read.</Box>
          <ul>
            <li>
              <Box variant="p">
                <Box variant="strong" display="inline">
                  &quot;I run agent loops and want them to learn&quot;:
                </Box>{' '}
                sections 1, 2, 3, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 22.
              </Box>
            </li>
            <li>
              <Box variant="p">
                <Box variant="strong" display="inline">
                  &quot;I advise a team choosing between reinforcement fine-tuning and
                  prompting&quot;:
                </Box>{' '}
                sections 1, 2, 3, 7, 8, 10, 14, 16, 17, 18, 20, 22, 23.
              </Box>
            </li>
            <li>
              <Box variant="p">
                <Box variant="strong" display="inline">
                  &quot;I want RL properly&quot;:
                </Box>{' '}
                sections 2 to 10 in order, with section 19, An RL Step Is an Inference Job Inside a
                Training Job, as an optional systems coda.
              </Box>
            </li>
          </ul>
          <Box variant="p">
            The map lays the sections out by stage. Arrows show the path from stage to stage, and
            a lettered mark inside a section shows which shorter route reads it.
          </Box>
          <ReadingMapDiagram />
          <Box variant="small" color="text-body-secondary">
            Sections read left to right within a stage. Section 21, Side by Side on a DGX Spark,
            is on no shorter route: it runs one RL step on hardware you can own and sets out the
            protocol for running the comparison there.
          </Box>
          <Box variant="p">
            Where a section on the first two routes names a method from a section you skipped,
            look for a one-clause gloss with a pointer beside it, as when section 22 introduces
            GEPA as &quot;Genetic-Pareto, the reflective prompt optimiser of section 14&quot;.
          </Box>
          <ExpandableSection headerText="What each shorter route keeps from the RL half, and why">
            <SpaceBetween size="s">
              <Box variant="p">
                Each shorter route keeps the RL sections that its later stops point back to.
              </Box>
              <Box variant="p">
                <Box variant="strong" display="inline">
                  Section 3, on every route.
                </Box>{' '}
                It defines the policy, the reward, the advantage and pass@k, and its closing block
                is the bridge that section 11 builds the words track on.
              </Box>
              <Box variant="p">
                <Box variant="strong" display="inline">
                  Section 8, on every route.
                </Box>{' '}
                Section 18 points to it for sharpening, section 20&apos;s calculator takes
                inference-time sampling from it, and section 22 caps that option at the base
                model&apos;s own pass@k with a pointer back to it.
              </Box>
              <Box variant="p">
                <Box variant="strong" display="inline">
                  Section 10, on every route.
                </Box>{' '}
                Section 15&apos;s hardening checklist starts with its grader checks, and section 22
                sends a gap with no trustworthy signal back to its four checks.
              </Box>
              <Box variant="p">
                <Box variant="strong" display="inline">
                  Sections 7 and 23, on the advisor route.
                </Box>{' '}
                Section 22 relies on section 7 to turn today&apos;s base rate into the expected
                share of training groups that carry no gradient, and names the AWS service for each
                path while leaving the detail to section 23.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <Box variant="p">
            Pick the route that matches why you are reading. On the first two routes, read section
            1, One Loop, Three Places to Keep What It Learns, first if you came straight here. All
            three routes then continue at section 3, The Language Model Is Already a Policy.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
