import type { CSSProperties } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Link from '@cloudscape-design/components/link';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { Cite, Derived, Toy } from '../components/Cite';
import { M } from '../components/Math';
import { Figure } from '../components/Figure';
import { linear } from '../lib/scale';
import { ARM, TASK_NAME } from '../lib/task';

/* Section 19. Agents Running the Loop. Leans on sections 8 and 16. */

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

const TH: CSSProperties = { textAlign: 'left', padding: '6px 10px', borderBottom: '2px solid #5f6b7a', verticalAlign: 'bottom' };
const TD: CSSProperties = { padding: '6px 10px', borderBottom: '1px solid #d5dbdb', verticalAlign: 'top' };

/* ------------------------------------------------------------------------ */
/* Diagram 19.1 (static): one station of the loop, and what the agent may   */
/* change                                                                    */
/* ------------------------------------------------------------------------ */

const GPU_SUB = "the station's own card; in a cluster, a queue";
const FROZEN_ROWS = [
  'Success check: passes or fails each attempt',
  'Reset: sets the scene for the next rollout',
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
          runs on the robot, and each attempt is scored. The success check, the reset and the safety limits are frozen: the
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
        {arrow(338, 366, 'each attempt is scored')}

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
            description="Know what must sit beyond a coding agent's reach before it runs a robot's improvement loop unattended, and why the 99% within eight attempts one agent-run loop reports cannot stand for a first-try rate (ENPIRE paper v2 and repository, AWS documentation, read 2026-11-20)"
          >
            19. Agents Running the Loop: What the Agent May Touch and Who Grades It
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A coding agent can be left to improve a robot&apos;s policy unattended only if three things sit outside
            its reach: the reset that puts the scene back, the success check that grades each attempt at the task,
            and the safety limits that stop the arm. The agent is a language model working through an agent
            program that lets it read and write files and run commands, and the policy is the model that drives the
            arm. Asked to raise a success
            rate, an agent that can edit the check can change what counts as a success, and one that runs the reset
            can choose its own test and retry for free. The rate cannot tell either from a better policy.
          </Box>
          <Box variant="p">
            ENPIRE, a 2026 research system from NVIDIA and two universities, gives each of eight real robot stations
            its own agent. A person and the agent build the three parts once and freeze them, and the training is left
            to the agent. Its authors report 99% &quot;pass@8&quot; across the tasks they showcase.{' '}
            <Cite id="F04-2">ENPIRE paper, sections 1, 2.1 and 2.2</Cite>{' '}
            <Cite id="F04-5">ENPIRE paper, figure 1</Cite>{' '}
            <Cite id="F04-16">ENPIRE paper, abstract and section 3</Cite>
          </Box>
          <Box variant="p">
            An attempt is one try at the task, ending when the policy succeeds, fails or runs out of time. A rollout
            is one reset followed by up to eight attempts, and pass@8 counts a rollout as a success if any of its
            attempts succeeds. No reset comes between the attempts, and each retry is made, in the authors&apos;
            words, &quot;after witnessing the previous failure&quot;; their definition does not say how that failure
            is passed on to the next attempt.{' '}
            <Cite id="F04-16">ENPIRE paper, section 3</Cite>
          </Box>
          <Box variant="p">
            That count mixes first tries with retries. If the eight attempts were independent, a policy that
            succeeds on <Derived>44</Derived>% of first tries would already reach 99%, since all eight fail together
            with probability <M>{'0.56^8 \\approx 0.01'}</M>. It is a different quantity from the success rate section 16 counts, the
            share of single attempts that succeed, and mistaken for that rate it can make a <Derived>44</Derived>% policy look like
            a 99% one.{' '}
            <Cite id="F04-16">ENPIRE paper, abstract and section 3</Cite>
          </Box>
          <Box variant="p">
            The same rule covers compute once the loop leaves the robot&apos;s own workstation. On the workstation
            the cap is physical, one GPU per robot; on a shared cluster it becomes a setting, and the agent must not be able to edit that
            setting either. Anything the agent&apos;s grade, test or spend depends on belongs outside its reach.{' '}
            <Cite id="F04-49">ENPIRE repository, autoresearch_instruction.md</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Divide one improvement cycle between the agent and the code around it, and spend robot time last when testing each change"
          >
            One cycle: code resets, runs and grades; the agent reads, edits and trains
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Improving a policy by hand is a cycle an engineer repeats: put the scene back, run the policy, decide
            whether the attempt worked, study the failures, edit the training code, train again. ENPIRE splits that
            cycle between code and the agent. Code does the first three steps on every rollout: the reset, the run
            and the success check, the paper&apos;s verifier. Its verdict is the grade the agent works to raise. The agent does the other three steps: it reads logs and papers, edits the training code and
            launches the next training run. <Cite id="F04-1">ENPIRE paper, abstract</Cite>{' '}
            <Cite id="F04-2">ENPIRE paper, sections 1 and 2.1</Cite>
          </Box>
          <Box variant="p">
            Each station, the unit the fleet scales by, is one robot, one GPU that both trains and runs the policy,
            and its own agent. No policy work leaves the station; only the agent&apos;s language model runs elsewhere,
            as a hosted model.{' '}
            <Cite id="F04-5">ENPIRE paper, figure 1 and appendix B.2</Cite>{' '}
            <Cite id="F04-25">ENPIRE paper, appendix C.4</Cite>{' '}
            <Cite id="F04-49">ENPIRE repository, autoresearch_instruction.md</Cite>
          </Box>
          <ExpandableSection headerText="Station hardware, for reference">
            <Box variant="p">
              Two arms and three cameras; one NVIDIA RTX 5090 (32 GB), a 24-core CPU and 128 GB of RAM. That one
              32 GB card carries all the station&apos;s GPU work: training, the policy, and the reset&apos;s detection
              and motion planning.{' '}
              <Cite id="F04-5">ENPIRE paper, appendix B.2</Cite>{' '}
              <Cite id="F04-14">ENPIRE paper, appendix A.1</Cite>
            </Box>
          </ExpandableSection>
          <Box variant="p">
            ENPIRE works in two stages. In stage one, a person and the agent build the code half once per task and
            freeze it; in stage two, the agent runs its half with no person in the loop. Stage one starts from a few
            minutes of recorded successes and failures, from which the agent writes the success check as code that
            returns pass or fail for one attempt. For inserting a pin, the check requires three conditions at once:
            the pin aligned in the camera image, the gripper at the right height, and a force estimate in range.{' '}
            <Cite id="F04-2">ENPIRE paper, section 2.1</Cite>{' '}
            <Cite id="F04-12">ENPIRE paper, section 2.1 and figure 9</Cite>
          </Box>
          <Box variant="p">
            The agent also writes the reset, which returns the scene to the start of the hardest phase of the task,
            such as the moment before the pin goes in. It runs object detection, pose tracking and GPU motion planning,
            so the reset is itself a workload on the station&apos;s GPU.{' '}
            <Cite id="F04-14">ENPIRE paper, section 2.1 and appendix A.1</Cite>
          </Box>
          <Box variant="p">
            The person sets the bar. They state the precision the check must reach: of the attempts it passes, the
            share that truly succeeded. Precision is the bar that protects the grade, because a false pass is a reward
            the agent can chase, while a false fail only slows it down. As an illustration, take a check that passes
            every true success and one failure in ten. A policy that truly succeeds <Toy>60</Toy>% of the time reports{' '}
            <Toy>0.6 + 0.4 x 0.1 = 0.64</Toy>, and the check&apos;s precision is <Toy>0.6 / 0.64 = 0.94</Toy>. Even
            at that precision, an agent that learns which failures the check passes can push the reported figure
            higher without improving the policy. <Cite id="F04-13">ENPIRE paper, appendix A.2</Cite>
          </Box>
          <Box variant="p">
            Precision also moves with the policy. The same check on a policy that truly succeeds <Toy>20</Toy>% of
            the time reports <Toy>0.2 + 0.8 x 0.1 = 0.28</Toy>, a precision of <Toy>0.2 / 0.28 = 0.71</Toy>. The
            figure that stays put is the share of failures the check passes, one in ten in both cases. A precision
            measured on the stage-one recordings therefore holds only for their mix of successes and failures, and
            drifts as the policy improves. When you set the bar, state the share of failures the check may pass, the
            figure that belongs to the check, and re-measure precision as the policy changes.
          </Box>
          <Box variant="p">
            The person also states the check&apos;s recall, the share of true successes it passes, and its latency,
            because it runs after every attempt: on a task that fastens a zip tie, it reads two camera views within a
            150 ms budget. The paper does not report the precision and recall its checks achieved. Last, the person
            keeps a test the agent cannot train on: a few minutes of labelled snapshots are held out, and &quot;the
            agent may study failures, but cannot train on the test set or alter metric computation&quot;.{' '}
            <Cite id="F04-13">ENPIRE paper, appendix A.2</Cite>{' '}
            <Cite id="F04-12">ENPIRE paper, appendix A.2</Cite>
          </Box>
          <Box variant="p">
            In stage two the agent&apos;s whole instruction is a prompt of nine lines. The first sets the goal:{' '}
            <code>/goal Achieve a 100% success rate over each window of 50 consecutive episodes.</code> The rest tells
            it to start a team of helper agents (subagents) to study different methods, to work on its own Git branch,
            and to pull what the other stations push. Git is the only channel between stations; there is no central
            server. <Cite id="F04-4">ENPIRE paper, appendix B.1, figure 10</Cite>{' '}
            <Cite id="F04-7">ENPIRE paper, section 2.2 and appendix B.1</Cite>
          </Box>
          <Box variant="p">
            The agent picks the learning method: behaviour cloning (copying demonstrations, section 4), reinforcement
            learning (RL, which improves a policy from its own scored attempts, here on the real robot), a scripted
            policy, or a mix. It also sets the training settings, such as the batch size. In the published
            eight-agent run on pin insertion, the most notable gain came from a mix: adding a behaviour-cloning term
            to the training loss raised the &quot;team-average best success rate&quot;, a running best averaged over the
            team, by 10.8 percentage points.{' '}
            <Cite id="F04-3">ENPIRE paper, sections 2.2 and 3.2</Cite>{' '}
            <Cite id="F04-23">ENPIRE paper, appendix B.6</Cite>
          </Box>
          <Box variant="p">
            Every idea follows one order, set in the repository&apos;s instruction file, and the order spends robot
            time last. On hardware, the authors write, the binding resource is &quot;the agent&apos;s robot-access
            budget, not its compute&quot;. The agent records one hypothesis that real attempts could prove wrong, makes the smallest
            change to the policy side that tests it, and runs the unit tests and an offline evaluation. Only then does
            it run the approved number of real attempts. It reads the result file, the metrics and the video, and
            keeps the change only if it passes the configured gates: enough successes, and no regression on what
            already worked. Failed attempts stay in the record.{' '}
            <Cite id="F04-9">ENPIRE repository, autoresearch_instruction.md</Cite>{' '}
            <Cite id="F04-21">ENPIRE paper, section 5.2</Cite>
          </Box>
          <Box variant="p">
            The agent&apos;s process never addresses a motor. Its requests reach the hardware through a small local
            server on the station. ENPIRE&apos;s policy acts 30 times a second, the same rate as the {ARM}&apos;s
            host loop (section 3), while the station&apos;s joint controllers track each target 100 times a second.
            The agent works on a far slower clock: the eight-agent run tried 86 ideas in about 3.4 hours, about{' '}
            <Derived>86 / 3.4 / 8 = 3.2</Derived> per agent-hour. The agent&apos;s loop is counted in minutes per
            idea, the arm&apos;s in milliseconds per action.{' '}
            <Cite id="F04-6">ENPIRE paper, appendix B.1</Cite>{' '}
            <Cite id="F04-23">ENPIRE paper, appendix B.6 and figure 12</Cite>
          </Box>
          <ExpandableSection headerText="The station server's three calls">
            <Box variant="p">
              <code>/start</code> begins a run on the hardware, <code>/restart</code> opens a fresh directory for the
              next run&apos;s data, and <code>/home</code> sends the arms to their home pose.{' '}
              <Cite id="F04-6">ENPIRE paper, appendix B.1</Cite>
            </Box>
          </ExpandableSection>
          <Figure
            cites="F04-3 F04-6 F04-7 F04-8 F04-12"
            caption={
              <>
                The box headed &quot;The agent may change&quot; is all the agent may edit; the dashed box headed
                &quot;Frozen&quot; is built once with a person and then only read. One pass runs down the middle arrows,
                and the arrow up the right side carries the grade back to the agent for its next idea. Illustrative layout, not measured.
              </>
            }
          >
            <AgentLoopDiagram />
          </Figure>
          <Box variant="p">
            On the {ARM} {TASK_NAME} task, stage one would be a few minutes of the block landing in the cup and of
            misses, a check the agent writes to tell the two apart, and a reset that lifts the block out of the cup and
            sets it back at its start. No {ARM} adapter appears in the ENPIRE repository&apos;s file list at the
            pinned commit, so the robot interface would be yours to write.{' '}
            <Cite id="F04-2">ENPIRE paper, section 2.1</Cite>{' '}
            <Cite id="F04-5">ENPIRE paper, figure 1 and appendix B.2</Cite>{' '}
            <Cite id="F04-26">ENPIRE repository at its pinned commit</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Tell the limits built into the hardware path from those an instruction file only states, and plan to enforce the second kind yourself"
          >
            The agent edits the training, and a written rule fences off the rest
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The repository&apos;s instruction file draws the line in one sentence: the agent &quot;may improve policy
            and training code, but it must not change the environment, reset procedure, verifier, safety limits,
            evaluation seeds, or artifact schema.&quot; It adds &quot;Never redefine success inside the policy&quot;,
            and it declares the scoring code read-only, because changing it &quot;invalidates comparison with prior
            runs&quot;. The paper&apos;s word for the frozen parts is &quot;immutable&quot;, yet in the repository
            files read at the pinned commit the line is only text: they show no mechanism that stops the agent from
            editing what it protects.{' '}
            <Cite id="F04-8">ENPIRE repository, autoresearch_instruction.md and AGENTS.md</Cite>
          </Box>
          <Box variant="p">
            Inside the line the agent has wide latitude. It works in one repository with permission prompts switched
            off, so it runs commands without a person approving each one, and it has unrestricted internet access.
            Data and logs from earlier sessions are pruned before a new session starts, so each one begins from a clean
            workspace. The design is open inside the repository and narrow at the robot, where the three calls are the
            only door. <Cite id="F04-11">ENPIRE paper, appendix B.1</Cite>
          </Box>
          <Box variant="p">
            Two kinds of limit catch what the agent&apos;s code gets wrong. Position and motion limits are software:
            crossing one fails the rollout at once and triggers a reset, and because they are code, they are on the list of
            what the agent must not change. Keep them outside its repository.{' '}
            <Cite id="F04-10">ENPIRE paper, section 2.1</Cite>{' '}
            <Cite id="F04-8">ENPIRE repository, autoresearch_instruction.md</Cite>
          </Box>
          <Box variant="p">
            The second kind sits in the hardware: the gripper&apos;s force bound is in the actuator, which is
            torque-limited, so a bad contact stalls instead of pushing hard enough to damage the
            hardware, and the paper calls that bound essential because the eight stations run unattended, with no
            person to intervene. The repository&apos;s security notes require &quot;explicit operator intent&quot; and
            &quot;a physical emergency stop within reach&quot; for every real-robot command, and neither source says
            how that fits stations that run unattended.{' '}
            <Cite id="F04-10">ENPIRE paper, section 2.1 and appendix B.3, and SECURITY.md</Cite>{' '}
            <Cite id="F04-8">ENPIRE repository, autoresearch_instruction.md</Cite>
          </Box>
          <Box variant="p">
            Simulation shows what else the agent could reach. In ENPIRE&apos;s simulated kitchen tasks, to stop the
            agent cheating, the environment removes calls such as <code>get_task_info</code>,{' '}
            <code>reset_env</code>, <code>reset_to_initial</code>, task-specific command-line helpers and queries for
            the true target. Each leaks the task&apos;s state or grants a retry, two routes to a grade without a
            better policy.{' '}
            <Cite id="F04-24">ENPIRE paper, appendix D.1</Cite>
          </Box>
          <Box variant="p">
            Other agent-run loops published in 2026 draw the same line in other places, and what stands between the
            agent and its grade ranges from a written rule whose enforcement is unpublished (ENPIRE) to a separate
            process (SEAR, a benchmark for coding agents on robot tasks). To judge a loop you meet, find what it puts out of the agent&apos;s reach and who grades.
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 640 }}>
              <thead>
                <tr>
                  <th style={TH}>Loop</th>
                  <th style={TH}>The agent changes</th>
                  <th style={TH}>Out of its reach</th>
                  <th style={TH}>Who grades</th>
                  <th style={TH}>Source</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>ENPIRE</td>
                  <td style={TD}>Training and policy code, the learning method, its settings</td>
                  <td style={TD}>
                    Environment, reset, verifier, safety limits, evaluation seeds, by written rule; the files read show
                    no mechanism enforcing it
                  </td>
                  <td style={TD}>A check the agent wrote with a person, then froze, tested against a held-out set</td>
                  <td style={TD}>
                    <Cite id="F04-8">ENPIRE autoresearch_instruction.md</Cite>{' '}
                    <Cite id="F04-13">ENPIRE paper, appendix A.2</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>ASPIRE: the agent writes the policy as a program and trains no weights</td>
                  <td style={TD}>Robot control programs, and repairs kept as text &quot;skills&quot;</td>
                  <td style={TD}>The robot&apos;s programming interface</td>
                  <td style={TD}>
                    A second, fresh agent must reproduce a repair from its written description before it is kept; the
                    coordinator checks that only allowed calls were used
                  </td>
                  <td style={TD}>
                    <Cite id="F04-27">ASPIRE paper v2, overview</Cite>{' '}
                    <Cite id="F04-28">ASPIRE paper v2, skill validation</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    AgenticRobotics (&quot;You Don&apos;t Need To Stay in The Loop&quot;, a single-author preview
                    preprint)
                  </td>
                  <td style={TD}>Analysis and training runs, done by disposable worker agents</td>
                  <td style={TD}>The objective, which cannot be edited</td>
                  <td style={TD}>
                    A language-model controller that owns the measurement and the decision to keep a checkpoint
                  </td>
                  <td style={TD}>
                    <Cite id="F04-34">AgenticRobotics paper v2, abstract and section 1</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>SEAR: a benchmark that runs coding agents on simulated and real robot tasks</td>
                  <td style={TD}>Anything inside its own container</td>
                  <td style={TD}>The held-out start states and the grading logic</td>
                  <td style={TD}>
                    A separate judge that receives the frozen policy and &quot;ignores any success the policy
                    claims&quot;
                  </td>
                  <td style={TD}>
                    <Cite id="F04-82">SEAR paper, abstract</Cite>{' '}
                    <Cite id="F04-83">SEAR paper, section 2.4</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">
            SEAR&apos;s judge is the clearest published form of the separation. The agent may train and test as it
            likes inside its container; when its budget ends, its policy is frozen and handed to a judge that holds the
            start states and the grading code, and the agent never touches either. A fence made of a process boundary
            holds whatever the agent writes, where a fence made of a sentence holds only while the agent follows it.{' '}
            <Cite id="F04-83">SEAR paper, section 2.4, sealed judge</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Catch a test the agent chose, a model check that leans toward success and a count too small to rank a change, each with the measure that exposes it"
          >
            How an agent&apos;s score parts from the robot&apos;s skill
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            An agent improving against its success check is an optimiser, and{' '}
            <Link href="../rl-agentic-loops/#reward-proxy">an optimiser takes the cheapest route to a high score</Link>.
            On a robot, one cheap route runs through the reset, because whoever resets the scene chooses the test.
            SEAR reports that on a real robot &quot;success in practice overstates success in
            the test&quot;: during practice the agent resets the scene itself and rarely creates the hard starting
            states an operator sets up for the test. Keep a set of start states the agent never chose, and score the
            policy on those. <Cite id="F04-84">SEAR paper, section 4</Cite>
          </Box>
          <Box variant="p">
            When the success check is a call to a general vision-language model (a language model that also reads
            images) rather than code, ambiguous attempts tend to come back as successes, and an agent optimising
            against such a check is paid for the failures among them. FailBench, a 2026 test of 13 such models
            on 2,197 real and simulated manipulation attempts, scores them by balanced accuracy, the average of the
            detection rates on successes and on failures, so 0.5 is chance. It found &quot;a systematic bias toward
            predicting success under ambiguous evidence&quot;. <Cite id="F04-45">FailBench paper, abstract</Cite>
          </Box>
          <Box variant="p">
            Where such a model fails is predictable. In the FailBench authors&apos; words, detection &quot;approaches
            saturation when success is determined by observable object motion, but approaches chance when success
            depends on establishing contact&quot;, with no model above 0.60 on contact-intensive assembly. ENPIRE&apos;s
            check for pin insertion, a contact task, does not rest on the camera alone: two of its three conditions are
            the gripper&apos;s height and a force estimate.{' '}
            <Cite id="F04-45">FailBench paper, abstract</Cite>{' '}
            <Cite id="F04-12">ENPIRE paper, figure 9</Cite>
          </Box>
          <Box variant="p">
            The number of evaluation episodes matters most late in a run, when the gains get small. After ENPIRE&apos;s early
            10.8-point gain, later ideas such as batch-size tuning (+0.9) and controller compensation (+1.3) added
            about one point each. Whether a one-point gain is real depends on how many episodes measured it, and the
            project page&apos;s data for the 86 ideas gives each one&apos;s time, its agent and whether it raised the
            best rate, with no episode count.{' '}
            <Cite id="F04-23">ENPIRE paper, appendix B.6, and project page data</Cite>
          </Box>
          <Box variant="p">
            AgenticRobotics, which runs its loop on one GPU, measured the noise in its own evaluation: &quot;100
            held-out episodes give a +/-9.5-point interval&quot;, at the success rates it was measuring. A gain is the
            difference of two such rates, so at those rates its interval is wider still: about{' '}
            <Derived>
              <M>{'9.5\\sqrt{2} \\approx 13.4'}</M>
            </Derived>{' '}
            points when the two counts are independent. Fixing the seeds does not fix
            the outcomes: re-running one evaluation with the same seeds left the total unchanged while 22 of the 100
            episodes flipped. Without the count, a reader cannot tell ENPIRE&apos;s one-point gains from noise.{' '}
            <Cite id="F04-36">AgenticRobotics paper v2, section 4</Cite>{' '}
            <Cite id="F04-35">AgenticRobotics paper v2, sections 3.5 and 5</Cite>{' '}
            <Cite id="F04-37">AgenticRobotics paper v2, section 5</Cite>
          </Box>
          <Box variant="p">
            AgenticRobotics answers with a gate against false promotions, because the best of several noisy scores
            is partly noise. Its own example: a checkpoint that measured 63% once &quot;pooled to 56.5% over 1,200
            episodes, so 63% is a metric-best observation, not an estimate of skill&quot;. So with <M>w</M> the
            half-width of the 95% interval on the difference between two success rates, a new checkpoint replaces the
            best outright only if it beats it by at least <M>{'1.5w'}</M>; a smaller positive gain is kept only if a
            paired test, which scores both checkpoints on the same episodes, confirms it.{' '}
            <Cite id="F04-35">AgenticRobotics paper v2, sections 3.5, 4.2 and 5</Cite>
          </Box>
          <Box variant="p">
            The same paper reports against its own design: on the one
            training run it measured, taking the final checkpoint with no measurement at all beat every
            measurement-driven selector, its own included, by 5.6 to 10.0 points of held-out success. One run is
            itself a small count, so take the narrower lesson: a selector is no better than the evaluation count
            behind it, and a kept change has to clear the interval at the attempts you actually ran.{' '}
            <Cite id="F04-37">AgenticRobotics paper v2, section 5</Cite>
          </Box>
          <Box variant="p">
            AdaRSI, an agent loop tested on the {ARM} itself, shows the count at small scale. There a coding agent
            first rewrites the instructions, tools and procedure around a frozen VLA (vision-language-action model: a
            vision-language model with an action head, section 5), and fine-tunes only the sub-steps that stay
            unreliable. Its authors tested placing a toy in a bowl on an {ARM}, with objects, sizes and orientations
            the demonstrations did not show, and report that the rewrite raised success on those from 65% to 100%,
            with 10 attempts per configuration.{' '}
            <Cite id="F04-85">AdaRSI paper v2, section 5.4 and appendix D</Cite>
          </Box>
          <Box variant="p">
            Ten successes in ten on one configuration are a strong result and a small count. The 95% Wilson interval of
            section 16, the range of true rates that could plausibly have produced a count, has a simple lower end when
            every attempt succeeds: <M>{'n / (n + z^2)'}</M>, with <M>n</M> the attempts and <M>{'z = 1.96'}</M> the
            multiplier for 95%, so <M>{'z^2 \\approx 3.84'}</M>. For ten attempts that is{' '}
            <Derived>10 / (10 + 3.84) = 0.72</Derived>, so a policy whose true rate is only <Derived>72%</Derived>{' '}
            could plausibly produce the same ten successes.{' '}
            <Cite id="F11-203">LeRobot v0.7.0, eval_stats.py, wilson_interval()</Cite>{' '}
            <Cite id="F06-97">Wilson interval, worked example of section 16</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Work out which first-try rates a 99% within eight attempts allows, and measure the first try yourself before you compare two policies"
          >
            99% pass@8 counts first tries and retries together
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            pass@1 is the first-try rate, the number section 16 counts, and pass@8 can sit far above it. How far
            depends on what a retry is. The authors contrast their retries with best-of-N sampling, where each attempt
            is a fresh, independent draw, and that independent case is the reference: with a first-try rate{' '}
            <M>p</M> and independent attempts, a rollout fails only if all eight fail, so pass@8 is{' '}
            <M>{'1-(1-p)^8'}</M>.{' '}
            <Cite id="F04-16">ENPIRE paper, section 3</Cite>
          </Box>
          <Box variant="p">
            The authors&apos; project page gives the opposite case, a policy that cannot recover from a failure,
            which &quot;stays near pass@1 (a 13% policy stays ~13%, not 99%)&quot;. Under fresh draws the same 13%
            policy would pass <Derived>1 - 0.87^8 = 0.67</Derived> of its rollouts. The two figures differ only in
            what a retry is: <Derived>67%</Derived> if every retry is a fresh draw, 13% if a retry after a failure
            almost never succeeds.{' '}
            <Cite id="F04-16">ENPIRE project page and paper, section 3</Cite>
          </Box>
          <Box variant="p">
            So a 99% within eight attempts fits very different policies. With fresh draws it needs a first try of{' '}
            <Derived>44</Derived>%. With retries that add nothing it needs a first try near 99%. A first try below{' '}
            <Derived>44</Derived>% reaches it only if retries succeed more often than first tries; the authors credit
            their retries with seeing the previous failure, and the paper&apos;s text gives no first-try rate for its
            final policies to show where in that range the 99% sits.{' '}
            <Cite id="F04-16">ENPIRE paper, section 3</Cite>
          </Box>
          <Box variant="p">
            By our reading, SEAR&apos;s caution about practice and test applies to the 99% as well. In stage two the
            scene is set by the one reset frozen in stage one, which returns it to the start of the hardest phase.
            So the 99% covers the task from that phase on, started from scenes that reset produced, none of them
            chosen by an operator for a test.{' '}
            <Cite id="F04-16">ENPIRE paper, abstract</Cite>{' '}
            <Cite id="F04-2">ENPIRE paper, section 2.1</Cite>{' '}
            <Cite id="F04-14">ENPIRE paper, section 2.1 and appendix A.1</Cite>{' '}
            <Cite id="F04-84">SEAR paper, section 4</Cite>
          </Box>
          <Box variant="p">
            The agent&apos;s own finish line is a count too: 100% over each window of 50 consecutive episodes. The
            nine-line prompt does not say whether an episode is one attempt or a whole rollout, so meeting the goal
            need not mean fifty first tries in a row. Fifty successes in fifty, counted either way, have a Wilson lower
            end of{' '}
            <Derived>50 / (50 + 3.84) = 0.929</Derived>, so a policy whose true rate is about <Derived>93%</Derived>{' '}
            could plausibly produce them. To compare an agent-trained policy
            with your own, run first tries from start states the agent never chose, and count them as section 16
            does. <Cite id="F04-4">ENPIRE paper, appendix B.1, figure 10</Cite>{' '}
            <Cite id="F11-203">LeRobot v0.7.0, eval_stats.py, wilson_interval()</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Find what an eight-robot fleet waited on, and budget tokens, the cost the authors found growing faster than the fleet"
          >
            Eight robots bought less than four times the speed, and the robots waited on the agents
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Handing the loop to agents hands them its pace. The authors timed fleets of one, four and eight agents, one robot each, against two finish lines: the first
            time a task reaches its target, and the prompt&apos;s own objective of 100% over every window of 50
            consecutive episodes. To the first target, 100% success on pin insertion, the time fell from 2.5 hours
            with one agent to 0.89 with four and 0.67 with eight. On Push-T, a pushing task scored from 0 to 1, the fleets took 4.7, 3.1 and 2.0
            hours to reach a score of 1.0. Eight times the robots bought about <Derived>2.5 / 0.67 = 3.7</Derived>{' '}
            times the speed on pin insertion and <Derived>4.7 / 2.0 = 2.4</Derived> times on Push-T, not eight.{' '}
            <Cite id="F04-18">ENPIRE paper, figure 3 and section 3.3</Cite>{' '}
            <Cite id="F04-4">ENPIRE paper, appendix B.1, figure 10</Cite>
          </Box>
          <Box variant="p">
            The prompt&apos;s objective gives a smaller speed-up still. On pin insertion, the authors report the time
            to complete it as 4.5 hours with one agent and 2.0 with eight,{' '}
            <Derived>4.5 / 2.0 = 2.25</Derived> times faster, against <Derived>3.7</Derived> to the first target.{' '}
            <Cite id="F04-20">ENPIRE project page, chart data</Cite>
          </Box>
          <Box variant="p">
            The utilisation figures show where the rest went. Robot utilisation is the share of research wall-clock
            time in which the robot is running an experiment, and GPU utilisation is the same share for the
            station&apos;s GPU. On pin insertion the authors report robot utilisation of 49.1% with one agent, 30.9% with
            four and 29.8% with eight, while GPU utilisation rose from 29.4% to 32.5% and 49.0%. The standard
            deviations are wide: at eight agents the GPU figure is 49.0 plus or minus 30.2. With eight agents a robot
            stood idle the other <Derived>70</Derived>% of the time.{' '}
            <Cite id="F04-19">ENPIRE project page, utilisation chart data, and paper section 2.2</Cite>
          </Box>
          <Box variant="p">
            The robots waited on the agents. A robot waits while its agent reads logs, writes code, debugs or waits
            for its language model, and as the fleet grows, agents spend more of their time summarising each
            other&apos;s branches and less operating the robot. They &quot;may also fail to launch parallel training
            sessions to exhaust GPU resources&quot;. So the robots stood idle more than half the time at
            every fleet size. The robot-access budget the authors call binding is a count: the real attempts each
            idea may spend, which the operator approves in advance, and a count set in advance limits each idea
            however long the robot sits idle.{' '}
            <Cite id="F04-21">ENPIRE paper, sections 4 and 5.2</Cite>{' '}
            <Cite id="F04-9">ENPIRE repository, autoresearch_instruction.md</Cite>{' '}
            <Cite id="F04-19">ENPIRE project page, utilisation chart data</Cite>
          </Box>
          <Box variant="p">
            What the loop asks of machines follows from where it waits. The agent itself is a remote inference
            workload: tokens from a hosted language model, most of them context it has sent before. Locally it reads
            logs, writes code and pushes to Git, work for a CPU and a disk. The GPU works in bursts, when a training run
            or the reset&apos;s detection and motion-planning models run, and at every fleet size the authors tested it
            was idle more than half the time. If you serve the agent&apos;s model yourself, it becomes a language-model
            serving job, the workload the <Link href="../vllm/">vLLM dive</Link> sizes.{' '}
            <Cite id="F04-19">ENPIRE project page, utilisation chart data</Cite>{' '}
            <Cite id="F04-14">ENPIRE paper, appendix A.1</Cite>{' '}
            <Cite id="F04-22">ENPIRE paper, appendix C.2</Cite>
          </Box>
          <Figure
            cites="F04-18 F04-19 F04-20"
            caption={
              <>
                Each group of bars is one ENPIRE fleet size on pin insertion. Top: as agents are added, the robot runs
                experiments a smaller share of the time and the GPU a larger one. Middle and bottom: the fleet
                completes the prompt&apos;s objective sooner and spends more tokens doing it. These hours run longer
                than the times to first reach the target, because the objective is the later finish line.
              </>
            }
          >
            <FleetChart />
          </Figure>
          <Box variant="p">
            Tokens are the cost that grows fastest. The authors report 9,269 tokens a minute with one agent, 40,029
            with four and 140,310 with eight: <Derived>15</Derived> times the tokens for eight times the agents, and{' '}
            <Derived>1.9</Derived> times what eight copies of the single agent would use. Tokens to complete the
            objective rose from 2.5 million to 16.8 million while the time fell from 4.5 to 2.0 hours,{' '}
            <Derived>6.7</Derived> times the tokens for <Derived>2.25</Derived> times the speed. In the authors&apos;
            words, larger fleets &quot;reach success sooner, but require a disproportionately higher token
            budget&quot;. <Cite id="F04-20">ENPIRE project page, token chart data, and paper section 4</Cite>
          </Box>
          <Box variant="p">
            Those figures may leave out most of what an agent sends. On a simplified real Push-T task, one agent used
            80M tokens in total: 77M cached input, 2.4M fresh input and 0.27M output. Cached input is context the model
            provider has already processed on an earlier call and reads again, so about{' '}
            <Derived>77 / 80 = 96%</Derived> of the tokens are the agent re-sending its own history.{' '}
            <Cite id="F04-22">ENPIRE paper, appendix C.2, figure 13</Cite>
          </Box>
          <Box variant="p">
            The paper does not say whether the fleet figures count cached input, and its numbers suggest they do not.
            The fleet chart gives one agent 2.5 million tokens to complete the objective on pin insertion. The Push-T
            agent used 80M, but the paper gives its uncached work as 2.6M, close to the chart&apos;s figure. The
            two are different tasks, so the match is a hint, not proof. Budget from the full count, and price the cached share at your provider&apos;s
            cached-input rate, the line that decides the bill.{' '}
            <Cite id="F04-22">ENPIRE paper, appendix C.2, figure 13</Cite>
          </Box>
          <Box variant="p">
            With the robots waiting on the agents, the choice of agent program and language model moves the pace too. On the same
            simplified task, the ENPIRE authors timed three pairings of agent program and model, one run each: first success came after 54.41 minutes with
            Codex driving GPT-5.5, 62.01 with Claude Code driving Opus 4.7, and 105.00 with Codex driving Opus 4.7.
            The slowest pairing took <Derived>105.00 / 54.41 = 1.9</Derived> times as long as the fastest.{' '}
            <Cite id="F04-25">ENPIRE paper, appendix C.4</Cite>
          </Box>
          <Box variant="p">
            How the agent sees the cameras matters as well. Varying it for a Codex agent gave 54.67 minutes with
            images in the model&apos;s own input, 72.32 with no images and 99.18 with images behind a tool it had to
            call. Each figure is one run on one simplified task, so treat the gaps as indicative. The authors suggest
            why no images beat the tool: the agent can infer the task&apos;s state from its logs, while repeated calls
            to an image tool add overhead.{' '}
            <Cite id="F04-25">ENPIRE paper, appendix C.3 and C.4</Cite>
          </Box>
          <Box variant="p">
            On 10 simulated tasks, the ASPIRE authors report the same loop scoring from 14.8% to 99.2% depending only on
            which language model drives it. Test the model and the agent program together on your own task before
            tuning anything else. <Cite id="F04-30">ASPIRE paper v2, section 3.8 and table 18</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Put the grade, the job timeout, the capacity ceiling and the robot itself where the agent's credentials cannot reach, in the order a first unattended night needs them"
          >
            On shared capacity, the station&apos;s limits become settings the agent cannot edit
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The published loops cap compute with hardware. Their budgets are limits an operator sets, such as
            ENPIRE&apos;s number of approved real-robot attempts and AgenticRobotics&apos; required timeout on every
            tool call. Neither of those two lets the agent choose its hardware, and neither publishes a GPU-hour or
            token budget enforced on it. <Cite id="F04-49">ENPIRE autoresearch_instruction.md and the AgenticRobotics paper</Cite>
          </Box>
          <Box variant="p">
            Move the loop onto a shared queue and the physical cap is gone. The agent becomes a tenant, one more user
            submitting jobs to hardware that others use, and an unusual one: its GPU work arrives in bursts of short
            training runs, most of them discarded (58 of 86 ideas gave no gain in ENPIRE&apos;s eight-agent run), and
            its steady demand is tokens from a model served elsewhere. Every guarantee the station gave by construction
            now has to be configured outside the repository the agent edits and outside what its credentials can write.
            The design that follows is ours, built from AWS documentation, not an AWS-documented robotics pattern.{' '}
            <Cite id="F04-48" kind="our-reading">ENPIRE, AgenticRobotics and ASPIRE resource figures</Cite>{' '}
            <Cite id="F04-23">ENPIRE paper, appendix B.6</Cite>{' '}
            <Cite id="F04-52">AWS Batch User Guide, resource-aware scheduling</Cite>
          </Box>
          <Box variant="p">
            The grade goes first, because it is what the agent works to raise, and it takes two parts. The success
            check, whose verdict the agent trains against, sits with the reset and the safety limits outside the
            repository the agent edits, where the agent&apos;s credentials can read its verdicts and cannot change its
            code. The final judge runs the way SEAR&apos;s does: a separate job that receives the frozen policy, holds the
            evaluation start states, and returns only the verdict. <Cite id="F04-83">SEAR paper, section 2.4, sealed judge</Cite>{' '}
            <Cite id="F04-8">ENPIRE repository, autoresearch_instruction.md</Cite>
          </Box>
          <Box variant="p">
            The agent&apos;s GPU jobs fit AWS Batch, AWS&apos;s managed job queue, which runs each job in a container
            on instances it starts. Batch offers the three caps those jobs need: a time limit per job, a ceiling on
            total capacity, and a count on the robots. Each holds against the agent only when it is set at a step the
            agent cannot edit. Time comes first, because Batch sets no limit by default, and a job without one runs
            until its container exits. For scale, ENPIRE&apos;s agents spent about{' '}
            <Derived>3.4 x 60 x 8 / 86 = 19</Derived> agent-minutes per idea, robot and training time included, so a
            training job that runs for hours is far out of step with the pace of that run. Set the timeout from the
            longest training run one idea should need.{' '}
            <Cite id="F04-50">AWS Batch User Guide, job timeouts</Cite>{' '}
            <Cite id="F04-23">ENPIRE paper, appendix B.6</Cite>
          </Box>
          <Box variant="p">
            The setting is <code>attemptDurationSeconds</code>. At the limit Batch sends the container SIGTERM and, 30
            seconds later, SIGKILL, so a training job that handles SIGTERM has about 30 seconds to save a checkpoint;
            a job ended this way is not retried. The value can sit in the job definition or come with the submission,
            so it holds against the agent only if the agent&apos;s submissions pass through a step that sets it and
            that the agent cannot edit. In this design that step is a small submit service of yours: it alone holds
            credentials that can submit to the queue, and it sets the job definition and the timeout on every job the
            agent asks for. <Cite id="F04-50">AWS Batch User Guide, job timeouts</Cite>
          </Box>
          <Box variant="p">
            The capacity ceiling is the compute environment&apos;s <code>maxvCpus</code>, the most vCPUs it may run
            at once; it caps GPUs only through the instance types the environment is allowed to launch. If the
            agent&apos;s jobs run on Amazon EKS (Elastic Kubernetes Service, AWS&apos;s managed Kubernetes), the node
            autoscaler Karpenter can cap GPUs by name, with <code>nvidia.com/gpu</code> in a NodePool&apos;s{' '}
            <code>spec.limits</code>; with no limit set, the only cap is the account&apos;s EC2 quota. Karpenter
            launches nodes in parallel and checks its limit only eventually, so a fast burst of agent jobs can overrun
            it: treat it as a backstop, with the exact ceiling at the submit step.{' '}
            <Cite id="F10-3">AWS Batch API Reference, ComputeResource</Cite>{' '}
            <Cite id="F10-407">Karpenter v1.15.3 docs, NodePool limits</Cite>
          </Box>
          <Box variant="p">
            The robot is the cap no instance type provides: one physical robot, one experiment at a time. It applies once
            robot attempts are submitted as jobs too, each calling the station&apos;s local server. Batch&apos;s
            consumable resources make a job wait until a counted resource, such as a licence token, is free. Model each
            station as one such resource with a count of one, and no two jobs that declare it can drive the same robot at
            once; the submit service adds the declaration to every robot job, so the agent cannot leave it out.{' '}
            <Cite id="F04-52">AWS Batch User Guide, resource-aware scheduling</Cite>
          </Box>
          <Box variant="p">
            Consumable resources also work under fair-share scheduling, which divides the queue among teams or agents
            by weight. Use it to keep a burst of agent jobs from starving people; it divides in proportion, and the
            fair-share page names no GPU-hour cap, so leave the ceiling to <code>maxvCpus</code> and the submit
            step.{' '}
            <Cite id="F04-52">AWS Batch User Guide, resource-aware scheduling</Cite>{' '}
            <Cite id="F04-51">AWS Batch User Guide, fair-share scheduling</Cite>
          </Box>
          <Box variant="p">
            The agent&apos;s own process runs code a language model wrote, and ENPIRE runs it with permission prompts
            off and unrestricted internet access, so it needs a stronger fence than one repository. A design picks one of two
            AWS hosts for it; neither keeps the agent from the success check or the judge, which is a matter of what its credentials can
            write. <Cite id="F04-11">ENPIRE paper, appendix B.1</Cite>
          </Box>
          <Box variant="p">
            The first host is a Nitro Sandbox on EKS. AWS Nitro Sandboxes, announced on 9 November 2026, run each pod
            or task in its own Firecracker microVM, a lightweight virtual machine with its own Linux kernel, pitched
            by AWS to &quot;safely execute LLM-generated code&quot;. A pod opts in by setting{' '}
            <code>runtimeClassName</code> to <code>isolated-sandbox</code>, on Kubernetes 1.36 or later, and the
            isolated mode is there to &quot;Protect the node and other pods from a compromised workload&quot;.{' '}
            <Cite id="F09-43">AWS What&apos;s New post and EKS User Guide, Nitro Sandboxes</Cite>{' '}
            <Cite id="F09-44">EKS User Guide, Auto Mode release notes</Cite>
          </Box>
          <Box variant="p">
            The sandbox&apos;s network annotation is all or nothing: set, it boots the sandbox with no network device,
            which would also cut the agent off from its model and Git. So the agent&apos;s sandbox keeps a network,
            and where that network may reach is a limit to design separately.{' '}
            <Cite id="F09-43">EKS User Guide, Nitro Sandboxes</Cite>
          </Box>
          <Box variant="p">
            The GPU is the other limit: on accelerated instances a sandbox &quot;runs CPU workloads only&quot;, and
            GPU passthrough &quot;is currently unavailable&quot;. So the tenant splits in two. The agent&apos;s own
            work (editing code, running unit tests, reading logs) runs inside the sandbox, and the training job it
            launches runs outside, as a Batch job under a timeout and a capacity ceiling. The submit step between the
            two is where the caps are set.{' '}
            <Cite id="F09-45">EC2 User Guide, Nitro Sandboxes, considerations and limitations</Cite>
          </Box>
          <Box variant="p">
            The second host, Amazon Bedrock AgentCore Runtime, is AWS&apos;s managed service for running agents, the
            choice when you would rather not run the cluster. A session on its microVMs ends after at most 8 hours,
            and an idle one after 15 minutes by default. The idle default can bite first: if the session sees no
            activity while its agent waits on a training job, it ends at 15 minutes, so raise that default for an
            agent that waits on jobs.{' '}
            <Cite id="F04-53">AgentCore Developer Guide, quotas</Cite>
          </Box>
          <Box variant="p">
            The 8-hour cap bites a campaign, the whole run of ideas toward the goal:
            ENPIRE&apos;s comparison of coding agents, an experiment apart from the fleet timings, ran one agent for 8
            hours on Push-T (4 on pin insertion), and AgenticRobotics&apos; published campaign ran over five calendar
            days. ENPIRE keeps its state in Git, which outlasts any session. Keep the campaign&apos;s state outside
            the session the same way, and the end of a session no longer ends the campaign.{' '}
            <Cite id="F04-53">AgentCore Developer Guide, quotas</Cite>{' '}
            <Cite id="F04-17">ENPIRE project page, figure 3 data</Cite>{' '}
            <Cite id="F04-36">AgenticRobotics paper v2, section 4</Cite>{' '}
            <Cite id="F04-7">ENPIRE paper, section 2.2</Cite>
          </Box>
          <Box variant="p">
            Before an agent&apos;s first unattended night, put the success check, the judge, the reset, the evaluation
            start states and the safety limits where its credentials cannot write, and give every job it submits a timeout through a step
            it cannot edit. From the first run, log robot utilisation, GPU utilisation and tokens per minute, and
            measure the policy&apos;s first-try rate on start states the agent never chose. That rate is the number to
            compare across policies: with independent tries, a first try of <Derived>44</Derived>% is already enough
            for 99% within eight.{' '}
            <Cite id="F04-16">ENPIRE paper, section 3</Cite>
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
