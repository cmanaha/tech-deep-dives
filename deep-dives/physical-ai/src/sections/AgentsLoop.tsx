import type { CSSProperties } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Link from '@cloudscape-design/components/link';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { Cite } from '../components/Cite';
import { Figure } from '../components/Figure';
import { linear } from '../lib/scale';
import { ARM, TASK_STORY } from '../lib/task';

/* Section 19. Agents Running the Loop. Practical section: depends on section 8. */

/* Palette shared across the dive (revamp/diagram-plan.md, section 1). */
const INK = '#16191f';
const NEUTRAL_FILL = '#eef0f2';
const NEUTRAL_INK = '#5f6b7a';
const EMPHASIS = '#0972d3';
const GPU_FILL = '#e6f6ea';
const GPU_INK = '#1e7b3a';
const ROBOT_FILL = '#fff6d6';
const ROBOT_INK = '#7a5c00';

/** Keeps a narrow, phone-first drawing from growing oversized on a wide screen. */
const NARROW: CSSProperties = { maxWidth: 560, margin: '0 auto' };

const LIST: CSSProperties = { margin: 0, paddingLeft: 22 };
const TH: CSSProperties = { textAlign: 'left', padding: '6px 10px', borderBottom: '2px solid #5f6b7a', verticalAlign: 'bottom' };
const TD: CSSProperties = { padding: '6px 10px', borderBottom: '1px solid #d5dbdb', verticalAlign: 'top' };

/** The thread task mapped onto stage one of an agent-run loop, stated in one place. */
const TASK_STAGE_ONE = `On this dive's task, an ${ARM} that must ${TASK_STORY}, stage one would mean recording a few minutes of the block landing in the cup and of misses, and having the agent write the check that tells the two apart and a reset that takes the block out of the cup and puts it back at the start.`;

/* ------------------------------------------------------------------------ */
/* Diagram 19.1 (static): one station of the loop, and what the agent may   */
/* change                                                                    */
/* ------------------------------------------------------------------------ */

const GPU_SUB = "the station's own card; in a cluster, a queue";
const FROZEN_ROWS = [
  'Grader: a pass or fail check on each trial',
  'Reset: puts the scene back after each trial',
  'Safety limits and the emergency stop',
];

function AgentLoopDiagram() {
  const bx = 14;
  const bw = 316;
  const mid = bx + bw / 2;
  const bold13 = { fontFamily: 'sans-serif', fontSize: 13, fontWeight: 'bold' } as const;
  const body = { fontFamily: 'sans-serif', fontSize: 12, fill: INK } as const;
  const arrow = (y1: number, y2: number, label: string) => (
    <g>
      <line x1={mid} y1={y1} x2={mid} y2={y2 - 3} stroke={NEUTRAL_INK} strokeWidth="1.5" markerEnd="url(#agents-loop-arrow)" />
      <text x={mid + 10} y={(y1 + y2) / 2 + 4} {...body} fill={NEUTRAL_INK}>
        {label}
      </text>
    </g>
  );
  return (
    <div style={NARROW}>
      <svg viewBox="0 0 400 556" role="img" aria-labelledby="agents-loop-title" style={{ width: '100%', height: 'auto' }}>
        <title id="agents-loop-title">One station of an agent-run loop: what the coding agent may change and what is frozen</title>
        <desc>
          A coding agent proposes one idea and edits what it may change: the training code and policy code, the
          learning method and its settings, and its own Git branch. It starts a training run on a GPU, the new policy
          runs on the robot, and each trial is scored. The grader, the reset and the safety limits are frozen: the
          agent reads them and never changes them. The grade goes back to the agent, which tries again.
        </desc>
        <defs>
          <marker id="agents-loop-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0 0 L8 4 L0 8 Z" fill={NEUTRAL_INK} />
          </marker>
        </defs>
        <rect x="0" y="0" width="400" height="556" fill="#fbfbfd" />

        {/* the agent */}
        <rect x={bx} y="14" width={bw} height="52" rx="6" fill="#ffffff" stroke={NEUTRAL_INK} strokeWidth="1.5" />
        <text x={bx + 12} y="36" fontFamily="sans-serif" fontSize="14" fontWeight="bold" fill={INK}>
          Coding agent, one per station
        </text>
        <text x={bx + 12} y="54" {...body}>
          proposes one idea, then tests it
        </text>
        {arrow(66, 94, 'edits')}

        {/* what it may change */}
        <rect x={bx} y="94" width={bw} height="88" rx="6" fill="#f2f8fd" stroke={EMPHASIS} strokeWidth="2.5" />
        <text x={bx + 12} y="114" {...bold13} fill={EMPHASIS}>
          The agent may change
        </text>
        <text x={bx + 12} y="134" {...body}>
          training code and policy code
        </text>
        <text x={bx + 12} y="152" {...body}>
          the learning method and its settings
        </text>
        <text x={bx + 12} y="170" {...body}>
          its own Git branch, shared with other stations
        </text>
        {arrow(182, 210, 'starts a training run')}

        {/* GPU */}
        <rect x={bx} y="210" width={bw} height="50" rx="6" fill={GPU_FILL} stroke={GPU_INK} strokeWidth="1.5" />
        <text x={bx + 12} y="230" {...bold13} fill={GPU_INK}>
          GPU: trains the policy
        </text>
        <text x={bx + 12} y="248" {...body}>
          {GPU_SUB}
        </text>
        {arrow(260, 288, 'new policy')}

        {/* robot */}
        <rect x={bx} y="288" width={bw} height="50" rx="6" fill={ROBOT_FILL} stroke={ROBOT_INK} strokeWidth="1.5" />
        <text x={bx + 12} y="308" {...bold13} fill={ROBOT_INK}>
          Robot: runs the policy on real hardware
        </text>
        <text x={bx + 12} y="326" {...body}>
          through three calls: start, restart, home
        </text>
        {arrow(338, 366, 'each trial is scored')}

        {/* frozen zone */}
        <rect x={bx} y="366" width={bw} height="176" rx="6" fill={NEUTRAL_FILL} stroke={NEUTRAL_INK} strokeWidth="1.5" strokeDasharray="6 4" />
        <text x={bx + 12} y="386" {...bold13} fill={INK}>
          Frozen: the agent reads, never changes
        </text>
        <text x={bx + 12} y="404" {...body}>
          built once, with a person, before the loop
        </text>
        {FROZEN_ROWS.map((row, i) => (
          <g key={row}>
            <rect x={bx + 12} y={414 + i * 40} width={bw - 24} height="32" rx="4" fill="#ffffff" stroke={NEUTRAL_INK} strokeWidth="1" />
            <text x={bx + 22} y={434 + i * 40} {...body}>
              {row}
            </text>
          </g>
        ))}

        {/* the grade returns */}
        <path d={`M${bx + bw} 430 H358 V40 H${bx + bw + 5}`} fill="none" stroke={EMPHASIS} strokeWidth="2" markerEnd="url(#agents-loop-arrow-blue)" />
        <defs>
          <marker id="agents-loop-arrow-blue" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0 0 L8 4 L0 8 Z" fill={EMPHASIS} />
          </marker>
        </defs>
        <text x="382" y="235" textAnchor="middle" transform="rotate(-90 382 235)" {...bold13} fill={EMPHASIS}>
          the grade goes back to the agent
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Diagram 19.2 (chart): utilisation, hours and tokens against agent count  */
/* ------------------------------------------------------------------------ */

interface FleetPoint {
  agents: number;
  robot: number;
  gpu: number;
  hours: number;
  tokensM: number;
}

/* ENPIRE Fig. 7, pin insertion: the project page's chart data (register entries F04-19 and F04-20). */
const FLEET: FleetPoint[] = [
  { agents: 1, robot: 49.1, gpu: 29.4, hours: 4.5, tokensM: 2.5 },
  { agents: 4, robot: 30.9, gpu: 32.5, hours: 3.2, tokensM: 7.7 },
  { agents: 8, robot: 29.8, gpu: 49.0, hours: 2.0, tokensM: 16.8 },
];

const CX = [112, 222, 332];

function FleetChart() {
  const label = { fontFamily: 'sans-serif', fontSize: 12, fill: INK } as const;
  const title = { fontFamily: 'sans-serif', fontSize: 13, fontWeight: 'bold', fill: INK } as const;
  const yUtil = linear(0, 60, 196, 68);
  const yHours = linear(0, 5, 372, 282);
  const yTok = linear(0, 20, 528, 438);
  const cats = (y: number) =>
    FLEET.map((p, i) => (
      <text key={p.agents} x={CX[i]} y={y} textAnchor="middle" {...label}>
        {p.agents === 1 ? '1 agent' : `${p.agents} agents`}
      </text>
    ));
  const axis = (y: (v: number) => number, tickValues: number[]) => (
    <g aria-hidden="true">
      {tickValues.map((v) => (
        <g key={v}>
          <line x1="48" y1={y(v)} x2="386" y2={y(v)} stroke={v === 0 ? NEUTRAL_INK : '#d5dbdb'} strokeWidth={v === 0 ? 1.5 : 1} />
          <text x="42" y={y(v) + 4} textAnchor="end" {...label} fill={NEUTRAL_INK}>
            {v}
          </text>
        </g>
      ))}
    </g>
  );
  return (
    <div style={NARROW}>
      <svg viewBox="0 0 400 556" role="img" aria-labelledby="agents-fleet-title" style={{ width: '100%', height: 'auto' }}>
        <title id="agents-fleet-title">
          Robot and GPU utilisation, hours and tokens to complete the objective, for one, four and eight agents
        </title>
        <desc>
          Three bar panels for one, four and eight agents on pin insertion, as the authors report. The share of time
          the robot is executing an experiment falls from 49.1 percent to 30.9 and 29.8 percent while the share of
          time the station GPU is in use rises from 29.4 to 32.5 and 49.0 percent. Hours to complete the objective
          fall from 4.5 to 3.2 and 2.0. Tokens to complete it rise from 2.5 million to 7.7 and 16.8 million.
        </desc>
        <rect x="0" y="0" width="400" height="556" fill="#fbfbfd" />

        {/* panel A: utilisation */}
        <text x="14" y="22" {...title}>
          Share of wall-clock time in use (%)
        </text>
        <rect x="14" y="34" width="12" height="12" fill={ROBOT_FILL} stroke={ROBOT_INK} strokeWidth="1.5" />
        <text x="32" y="45" {...label}>
          robot running an experiment
        </text>
        <rect x="222" y="34" width="12" height="12" fill={GPU_FILL} stroke={GPU_INK} strokeWidth="1.5" />
        <text x="240" y="45" {...label}>
          station GPU in use
        </text>
        {axis(yUtil, [0, 20, 40, 60])}
        {FLEET.map((p, i) => (
          <g key={p.agents}>
            <rect x={CX[i] - 38} y={yUtil(p.robot)} width="34" height={yUtil(0) - yUtil(p.robot)} fill={ROBOT_FILL} stroke={ROBOT_INK} strokeWidth="1.5" />
            <text x={CX[i] - 21} y={yUtil(p.robot) - 6} textAnchor="middle" {...label} fontWeight="bold" fill={ROBOT_INK}>
              {p.robot.toFixed(1)}
            </text>
            <rect x={CX[i] + 4} y={yUtil(p.gpu)} width="34" height={yUtil(0) - yUtil(p.gpu)} fill={GPU_FILL} stroke={GPU_INK} strokeWidth="1.5" />
            <text x={CX[i] + 21} y={yUtil(p.gpu) - 6} textAnchor="middle" {...label} fontWeight="bold" fill={GPU_INK}>
              {p.gpu.toFixed(1)}
            </text>
          </g>
        ))}
        {cats(214)}

        {/* panel B: hours to complete the objective */}
        <text x="14" y="250" {...title}>
          Hours to complete the objective
        </text>
        <text x="14" y="267" {...label} fill={NEUTRAL_INK}>
          100% over every window of 50 consecutive episodes
        </text>
        {axis(yHours, [0, 5])}
        {FLEET.map((p, i) => (
          <g key={p.agents}>
            <rect x={CX[i] - 26} y={yHours(p.hours)} width="52" height={yHours(0) - yHours(p.hours)} fill={NEUTRAL_FILL} stroke="#44505c" strokeWidth="1.5" />
            <text x={CX[i]} y={yHours(p.hours) - 6} textAnchor="middle" {...label} fontWeight="bold">
              {`${p.hours.toFixed(1)} h`}
            </text>
          </g>
        ))}
        {cats(390)}

        {/* panel C: tokens to complete the objective */}
        <text x="14" y="424" {...title}>
          Tokens to complete the objective (millions)
        </text>
        {axis(yTok, [0, 10, 20])}
        {FLEET.map((p, i) => (
          <g key={p.agents}>
            <rect x={CX[i] - 26} y={yTok(p.tokensM)} width="52" height={yTok(0) - yTok(p.tokensM)} fill="#ffffff" stroke={NEUTRAL_INK} strokeWidth="1.5" />
            <text x={CX[i]} y={yTok(p.tokensM) - 6} textAnchor="middle" {...label} fontWeight="bold">
              {p.tokensM.toFixed(1)}
            </text>
          </g>
        ))}
        {cats(546)}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function AgentsLoop() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Know what changes when a coding agent launches the experiments in an engineer's place: what it may touch, who grades it and which limits to set from outside (ENPIRE paper v2 and repository, AWS documentation, read 2026-11-20)"
          >
            19. Agents Running the Loop
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Section 8, Reinforcement Learning for Robots, ended on its third lane: learning on the real arm, where
            every attempt waits on the robot, the reset and a person. This section depends on that lane and
            re-teaches none of it. It follows what happens when the person leaves and a coding agent (a language
            model that reads and writes files and runs commands) launches the experiments.
          </Box>
          <Box variant="p">
            What changes is who runs the improvement loop. An engineer improving a policy puts the scene back, runs
            the policy, decides whether the attempt worked, studies the failures, edits the training code and trains
            again. In an agent-run loop, code does the first three steps and the agent does the last three. People
            still define the task: they build the reset, the success check and the safety limits once, then freeze
            them. <Cite id="F04-2">ENPIRE paper, sections 1, 2.1 and 2.2</Cite>
          </Box>
          <Box variant="p">
            For capacity planning, the result to remember is how much hardware such a loop leaves waiting. In
            ENPIRE, the system this section follows, the authors report that a robot with one agent was running
            an experiment 49.1% of the time. With eight agents on eight robots the share fell to 29.8%. The robots
            wait on the agents. <Cite id="F04-19">ENPIRE project page, utilisation chart data</Cite>
          </Box>
          <Box variant="p">
            Agent-run loops where the thing being improved is text, with their own graders and reward design, are
            covered in the <Link href="../rl-agentic-loops/">Learning From Feedback dive</Link>.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Picture one station of an agent-run loop: what the agent edits, what it only reads and where its grade comes from"
          >
            What the agent does
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            ENPIRE is a framework that wraps a coding agent around a real robot. Its name spells its four modules:
            Environment (EN) for automatic reset and verification, Policy Improvement (PI) for launching training,
            Rollout (R) for running a policy on one robot or on several at once, and Evolution (E), in which the
            agent reads logs and papers and rewrites the training code. A rollout is one run of the policy on the
            robot. <Cite id="F04-1">ENPIRE paper, abstract</Cite>
          </Box>
          <Box variant="p">
            The published fleet is eight identical stations. Each has two arms, cameras, its own agent and one
            workstation with one NVIDIA RTX 5090 (32 GB), a 24-core CPU and 128 GB of RAM. No shared cluster is
            used: the station&apos;s single GPU trains the policy and runs it.{' '}
            <Cite id="F04-5">ENPIRE paper, figure 1 and appendix B.2</Cite>
          </Box>
          <Box variant="p">
            The work has two stages. Stage one happens once per task, with a person. From a few minutes of recorded
            successes and failures, the agent writes the success check, a function that returns pass or fail for one
            trial. For the paper&apos;s pin-insertion task that function combines visual alignment, the height of
            the gripper and a force estimate. The agent also writes the reset routine that puts the scene back. The
            person states the precision, recall and latency the check must reach, and then the check, the reset and
            the safety limits are frozen. <Cite id="F04-12">ENPIRE paper, section 2.1 and appendix A.2</Cite>{' '}
            <Cite id="F04-13">ENPIRE paper, appendix A.2</Cite>
          </Box>
          <Box variant="p">
            Stage two runs with nobody in the room. The agent&apos;s whole instruction is a prompt of nine lines. Its
            first line sets the goal: <code>/goal Achieve a 100% success rate over each window of 50 consecutive episodes.</code>{' '}
            The rest tells the agent to study several learning methods and to share its work with the other
            stations through Git branches. <Cite id="F04-4">ENPIRE paper, appendix B.1, figure 10</Cite>
          </Box>
          <Box variant="p">
            The agent picks the learning method itself. It may choose behaviour cloning (imitating recorded
            demonstrations, section 4), RL on the real robot (section 8&apos;s third lane), a scripted policy, or a
            mix, and it sets the hyperparameters. <Cite id="F04-3">ENPIRE paper, sections 2.2 and 3.2</Cite> The
            repository&apos;s instruction file fixes the order of work for every idea:
          </Box>
          <ol style={LIST}>
            <li>Record one hypothesis that a trial can prove wrong.</li>
            <li>Make the smallest change to the policy side that tests it.</li>
            <li>Run the unit tests and an offline evaluation first.</li>
            <li>Run only the approved number of trials on the real robot.</li>
            <li>Inspect the result file, the metrics and the video.</li>
            <li>
              Keep the change only when it passes the success and regression gates. Failed trials stay in the
              record. <Cite id="F04-9">ENPIRE repository, autoresearch_instruction.md</Cite>
            </li>
          </ol>
          <Figure
            cites="F04-3 F04-6 F04-7 F04-8 F04-12"
            caption={
              <>
                How to read it: follow the grey arrows down one pass of the loop, then the blue arrow back up. The
                blue box is everything the agent may edit. The dashed box is what it may only read. The GPU box is
                the station&apos;s own card in ENPIRE; the last part of this section replaces it with a queue.
                Illustrative layout, not measured.
              </>
            }
          >
            <AgentLoopDiagram />
          </Figure>
          <Box variant="p">
            The boundary in that picture is what makes the grade worth trusting. The same instruction file says the
            agent may improve policy and training code and must leave the environment, the reset procedure, the
            verifier (the success check), the safety limits and the evaluation seeds alone. These are written
            rules: the repository files read for this dive show them as text and show no mechanism that technically
            stops the agent from editing those files. <Cite id="F04-8">ENPIRE repository, autoresearch_instruction.md and AGENTS.md</Cite>
          </Box>
          <Box variant="p">
            The agent never talks to the motors: its requests go through a local server with three calls, one to
            start a rollout, one to open a fresh data directory and one to send the arms home. <Cite id="F04-6">ENPIRE paper, appendix B.1</Cite> Inside its one repository the
            agent runs with permission prompts switched off and unrestricted internet access.{' '}
            <Cite id="F04-11">ENPIRE paper, appendix B.1</Cite> Physical safety is independent of the agent&apos;s
            behaviour: motion limits end the episode and trigger a reset, the gripper is torque-limited so a bad
            contact stalls, and a physical emergency stop stays within reach.{' '}
            <Cite id="F04-10">ENPIRE paper, section 2.1 and appendix B.3</Cite>
          </Box>
          <Box variant="p">
            {TASK_STAGE_ONE} That mapping is our reading. ENPIRE&apos;s published runs use two-arm stations, and no{' '}
            {ARM} adapter was found in the repository&apos;s file list.{' '}
            <Cite id="F04-26">ENPIRE repository at its pinned commit</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Read the headline number for what it measures, then see what eight robots return for eight times the hardware"
          >
            What it buys
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Start with the headline, because it is easy to misread. The authors report that policies developed under
            ENPIRE reach 99% success &quot;pass@8&quot;: the policy counts as successful if it completes the task
            within up to eight attempts inside one rollout, each attempt made after seeing the previous failure. That
            measures recovery. It is a different quantity from the one-shot success rate of section 16, and the
            paper text does not give the one-shot rate of the final policies.{' '}
            <Cite id="F04-16">ENPIRE paper, abstract and section 3</Cite>
          </Box>
          <Box variant="p">
            The scaling result is the one that sizes a fleet. The authors ran the same task with one, four and eight
            agents, one robot each, and timed how long the fleet took to first reach the target score. Across their
            two tasks, eight robots buy roughly 2.4x to 3.7x in time to target for eight times the hardware.{' '}
            <Cite id="F04-18">ENPIRE paper, figure 3 and section 3.3</Cite>
          </Box>
          <Box variant="p">
            The reason sits in the utilisation figures. The paper defines robot utilisation as the share of research
            wall-clock time during which the robot is running an experiment, and GPU utilisation the same way for
            the station&apos;s GPU. On pin insertion, the authors report robot utilisation of 49.1% with one agent,
            30.9% with four and 29.8% with eight, while GPU utilisation rises from 29.4% to 32.5% to 49.0%. The
            spread between runs is wide: the GPU figure at eight agents is 49.0 plus or minus 30.2.{' '}
            <Cite id="F04-19">ENPIRE project page, utilisation chart data, and paper section 2.2</Cite>
          </Box>
          <Box variant="p">
            The paper&apos;s limitations section says where the time goes. A robot sits idle while its agent reads
            logs, writes code, debugs or waits for its language model. As the fleet grows, agents also spend more
            time summarising each other&apos;s branches and less operating the robot.{' '}
            <Cite id="F04-21">ENPIRE paper, section 4, limitations</Cite>
          </Box>
          <Figure
            cites="F04-18 F04-19 F04-20"
            caption={
              <>
                How to read it: each group of bars is one fleet size on pin insertion, as the authors report. Top:
                the robot is busy less of the time as agents are added and the GPU more. Middle and bottom: the
                fleet finishes sooner and spends more tokens doing it. The hours here measure completing the
                objective in the prompt, a stricter finish line than first reaching the target, so they are longer
                than the times behind the 2.4x to 3.7x range and belong to a separate comparison.
              </>
            }
          >
            <FleetChart />
          </Figure>
          <Box variant="p">
            Tokens are the third cost, after robots and GPUs. The authors report that the fleet&apos;s token rate
            grows 15x for 8x the agents, and that most of what an agent consumes is cached input: context the model
            provider has already processed and reads again on the next call.{' '}
            <Cite id="F04-20">ENPIRE project page, token chart data, and paper section 4</Cite>{' '}
            <Cite id="F04-22">ENPIRE paper, appendix C.2, figure 13</Cite>
          </Box>
          <Box variant="p">
            Most experiments are discarded, which is normal for research and matters for a scheduler. In the
            published eight-agent run on pin insertion the team tried 86 ideas in about 3.4 hours. 28 raised the
            team&apos;s best success rate and 58 did not.{' '}
            <Cite id="F04-23">ENPIRE paper, appendix B.6 and figure 12</Cite>
          </Box>
          <ExpandableSection headerText="The figures behind these statements, each with its own definition">
            <SpaceBetween size="s">
              <Box variant="p">
                The paper times its fleets in two ways, and the two belong in separate rows. Its figure 3 times how
                long a fleet takes to first reach the target. Its figure 7 times how long a fleet takes to complete
                the objective in the prompt, 100% over every window of 50 consecutive episodes. All values are the
                authors&apos;.
              </Box>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 640 }}>
                  <thead>
                    <tr>
                      <th style={TH}>Measure</th>
                      <th style={TH}>1 agent</th>
                      <th style={TH}>4 agents</th>
                      <th style={TH}>8 agents</th>
                      <th style={TH}>Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={TD}>Figure 3: time to first reach a normalized score of 1.0 on Push-T, the paper&apos;s other task</td>
                      <td style={TD}>4.7 h</td>
                      <td style={TD}>3.1 h</td>
                      <td style={TD}>2.0 h</td>
                      <td style={TD}>
                        <Cite id="F04-18">ENPIRE paper, figure 3</Cite>
                      </td>
                    </tr>
                    <tr>
                      <td style={TD}>Figure 3: time to first reach 100% success on pin insertion</td>
                      <td style={TD}>2.5 h</td>
                      <td style={TD}>0.89 h</td>
                      <td style={TD}>0.67 h</td>
                      <td style={TD}>
                        <Cite id="F04-18">ENPIRE paper, figure 3</Cite>
                      </td>
                    </tr>
                    <tr>
                      <td style={TD}>Figure 7: time to complete the objective on pin insertion</td>
                      <td style={TD}>4.5 h</td>
                      <td style={TD}>3.2 h</td>
                      <td style={TD}>2.0 h</td>
                      <td style={TD}>
                        <Cite id="F04-20">ENPIRE project page, chart data</Cite>
                      </td>
                    </tr>
                    <tr>
                      <td style={TD}>Figure 7: tokens to complete the objective</td>
                      <td style={TD}>2.5 million</td>
                      <td style={TD}>7.7 million</td>
                      <td style={TD}>16.8 million</td>
                      <td style={TD}>
                        <Cite id="F04-20">ENPIRE project page, chart data</Cite>
                      </td>
                    </tr>
                    <tr>
                      <td style={TD}>Figure 7: tokens per minute across the fleet</td>
                      <td style={TD}>9,269</td>
                      <td style={TD}>40,029</td>
                      <td style={TD}>140,310</td>
                      <td style={TD}>
                        <Cite id="F04-20">ENPIRE project page, chart data</Cite>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <Box variant="p">
                Where the tokens go, on a simplified real Push-T task with one agent, as the authors report: 80M
                tokens in total, of which 77M were cached input, 2.4M fresh input and 0.27M output. About 96% of
                the tokens are repeat reads of cached context.{' '}
                <Cite id="F04-22">ENPIRE paper, appendix C.2, figure 13</Cite>
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Place a different agent loop when you meet one: what its agent edits and who grades it"
          >
            Neighbours
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Other published loops differ from ENPIRE in the two things its diagram marks: what the agent may change
            and who holds the grade. Three neighbours and one ancestor are enough to place the rest.
          </Box>
          <ExpandableSection headerText="ASPIRE, a statistically gated loop, RACaP, and Eureka as history">
            <ul style={LIST}>
              <li>
                <strong>ASPIRE: the agent writes programs and trains no weights.</strong> One coding agent per task
                writes a robot control program, runs it, reads the traces to find the failure and repairs it. A
                repair enters a shared library of text &quot;skills&quot; only after a second, fresh agent
                reproduces the fix from the written proposal alone.{' '}
                <Cite id="F04-27">ASPIRE paper v2, overview</Cite> <Cite id="F04-28">ASPIRE paper v2, skill validation</Cite>{' '}
                The authors report that on 10 simulated benchmark tasks the same loop scores from 14.8% to 99.2%
                depending only on which language model drives it, with a mean agent time of 31 to 139 minutes per
                task. <Cite id="F04-30">ASPIRE paper v2, section 3.8 and table 18</Cite>
              </li>
              <li>
                <strong>&quot;You Don&apos;t Need To Stay in The Loop&quot;: the agent as a control plane.</strong>{' '}
                A language-model controller owns the measurement and the decision to keep a checkpoint, disposable
                worker agents do the analysis and the training runs, and the objective cannot be edited.{' '}
                <Cite id="F04-34">AgenticRobotics paper v2, abstract and section 1</Cite> It is a single-author
                preprint labelled a preview. Its published campaign ran in simulation on one Quadro RTX 8000: rounds
                0 to 26 over five calendar days, 121.6 GPU-hours over 5,475 evaluation episodes, with the
                controller&apos;s token use not kept. <Cite id="F04-36">AgenticRobotics paper v2, sections 4 and 5</Cite>{' '}
                The paper also reports against its own thesis. Taking the final checkpoint beat every
                measurement-driven selector, the paper&apos;s included, by 5.6 to 10.0 points of held-out success,
                and re-running one evaluation with the same seeds flipped 22 of 100 episode outcomes.{' '}
                <Cite id="F04-37">AgenticRobotics paper v2, section 5</Cite>
              </li>
              <li>
                <strong>RACaP: the agent evolves its own control library.</strong> The agent rewrites a library of
                robot-control code in simulation. The authors report 54.4% success in-domain on the LIBERO simulated
                benchmark, 45.0% zero-shot on LIBERO-PRO and 46.0% on the long-horizon LIBERO-Long.{' '}
                <Cite id="F04-42">RACaP paper, abstract</Cite>
              </li>
              <li>
                <strong>Eureka (2023): where agent-launched training started.</strong> A language model writes the
                reward function as code. One run is 5 iterations of 16 candidate rewards, each scored by a full RL
                training in a GPU simulator, so 5 x 16 = 80 trainings arriving in bursts of 16. The authors ran it
                on one station with 8 A100 GPUs in under one day per run.{' '}
                <Cite id="F04-39">Eureka paper, section 3.2 and appendix D.4</Cite>
              </li>
            </ul>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What an agent-run loop asks of a shared cluster, and the limits to set where the agent's code cannot reach them"
          >
            The agent as a tenant
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Move the loop from a station to a cluster and the agent becomes a tenant: it submits jobs to shared
            hardware, as a team of engineers does. Its habits are unusual. It asks for a GPU in bursts and leaves it
            idle between them, it discards most of what it runs, and its steady demand is tokens from a language
            model served somewhere else. Our reading is that this pattern repeats across the loops that publish
            resource figures.{' '}
            <Cite id="F04-48">our reading across the ENPIRE, AgenticRobotics and ASPIRE resource figures</Cite> If
            you serve the agent&apos;s model yourself, that is a language-model serving workload, covered in the{' '}
            <Link href="../vllm/">vLLM dive</Link>.
          </Box>
          <Box variant="p">
            In the papers, the cap on compute is physical: one GPU bolted to each station. None of the loops read
            lets the agent choose its hardware, and none publishes a GPU-hour or token budget enforced on the agent.
            ENPIRE&apos;s one budget is the number of real-robot trials the operator approves.{' '}
            <Cite id="F04-49">ENPIRE repository, autoresearch_instruction.md, and the sibling papers</Cite> On a
            shared queue the physical cap is gone, so the limits have to be configured, and they belong in the
            scheduler, outside the repository the agent edits.
          </Box>
          <Box variant="p">
            <strong>Cap every job&apos;s run time.</strong> AWS Batch is AWS&apos;s managed batch scheduler: you
            submit a job to a queue and Batch runs it in a container on instances it starts. A Batch job has no
            timeout unless one is set, and without one it runs until its container exits. Set{' '}
            <code>attemptDurationSeconds</code> (minimum 60 seconds) on the job definition. At the limit Batch sends
            the container SIGTERM, then SIGKILL 30 seconds later, and a job ended by its timeout is not retried. The
            job definition lives in the scheduler, so a training script the agent rewrote cannot extend it. A timeout
            passed when the job is submitted replaces the one in the job definition, so the cap holds against the
            agent itself only when submission goes through a wrapper or a role the agent cannot change.{' '}
            <Cite id="F04-50">AWS Batch User Guide, job timeouts</Cite>
          </Box>
          <Box variant="p">
            <strong>Run agent-written code behind a kernel boundary.</strong> ENPIRE fences its agent inside one
            repository. AWS Nitro Sandboxes give that fence hardware isolation: each pod runs inside its own
            lightweight virtual machine (a Firecracker microVM) with its own Linux kernel. AWS announced the feature
            on 9 November 2026 as available in all commercial regions, for pods on Amazon EKS (Elastic Kubernetes Service, AWS&apos;s managed
            Kubernetes), tasks on Amazon ECS (Elastic Container Service, AWS&apos;s own container orchestrator) and
            plain EC2. On EKS a pod opts in by setting <code>runtimeClassName</code> to{' '}
            <code>isolated-sandbox</code> or <code>confidential-sandbox</code>, on Kubernetes 1.36 or later.{' '}
            <Cite id="F09-43">AWS What&apos;s New post and EKS User Guide, Nitro Sandboxes</Cite>
          </Box>
          <Box variant="p">
            The sandbox has one limit that shapes the design: it cannot hold a GPU. The EC2 guide says that on
            accelerated instances a sandbox &quot;runs CPU workloads only&quot; and that GPU passthrough &quot;is
            currently unavailable&quot;. <Cite id="F09-45">EC2 User Guide, Nitro Sandboxes, considerations and limitations</Cite>{' '}
            Our reading is that this splits the tenant in two. The agent&apos;s own work (editing code, running
            unit tests, reading logs) runs inside the sandbox. The training job it launches runs outside, as an
            ordinary GPU job with a timeout.
          </Box>
          <Box variant="p">
            Before you hand a loop to an agent, do four things. Section 24, Orchestrating Physical AI on AWS, sets up the
            queues and the sandbox they rely on.
          </Box>
          <ol style={LIST}>
            <li>
              Freeze the grader, the reset and the evaluation seeds, and store them where the agent&apos;s
              credentials cannot write.
            </li>
            <li>Give every job the agent can submit a timeout in the job definition, and keep the submit call out of its hands.</li>
            <li>
              Run the agent&apos;s own code in a sandbox, and send its GPU work out as separate capped jobs.
            </li>
            <li>
              Log robot utilisation, GPU utilisation and tokens per minute from the first day. ENPIRE&apos;s robots
              were busy 49.1% of the time with one agent and 29.8% with eight, so the first thing to tune is how
              long the agent keeps the robot waiting.{' '}
              <Cite id="F04-19">ENPIRE project page, utilisation chart data</Cite>
            </li>
          </ol>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
