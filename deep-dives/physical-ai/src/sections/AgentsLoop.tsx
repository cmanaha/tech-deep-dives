import type { CSSProperties } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Link from '@cloudscape-design/components/link';
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
            description="Know what must sit beyond a coding agent's reach before it runs a robot's improvement loop unattended, and why the 99% headline such loops report measures recovery, not first tries (ENPIRE paper v2 and repository, AWS documentation, read 2026-11-20)"
          >
            19. Agents Running the Loop: What the Agent May Touch and Who Grades It
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A coding agent can improve a robot&apos;s policy without a person in the loop only if three things sit
            outside its reach: the reset that puts the scene back after each trial, the success check that grades the
            trial, and the safety limits that stop the arm. The agent is a language model that reads and writes files
            and runs commands, and the policy is the model that drives the arm. Asked to raise a success rate, an agent
            that can edit the check can change what counts as a success instead of improving the policy, and the rate
            cannot tell the two apart. <Cite id="F04-2">ENPIRE paper, sections 1, 2.1 and 2.2</Cite>
          </Box>
          <Box variant="p">
            ENPIRE, a 2026 research system from NVIDIA and two universities, gives each of eight real robot stations its
            own agent. It builds those three parts once with a person, freezes them, and leaves the agent the training.
            Its headline score measures something narrower than it seems. A trial is one attempt at the task, from a
            reset until the policy succeeds, fails or runs out of time. Section 16, Evaluation, also calls it an
            episode or a rollout, and counts the share of trials that succeed.{' '}
            <Cite id="F04-2">ENPIRE paper, sections 1, 2.1 and 2.2</Cite>{' '}
            <Cite id="F04-5">ENPIRE paper, figure 1</Cite>
          </Box>
          <Box variant="p">
            ENPIRE&apos;s headline uses a longer rollout: one reset followed by up to eight attempts, each made after
            seeing the previous failure. Its authors report 99% success &quot;pass@8&quot;, the share of such rollouts
            with a success in them. That is a measure of recovery. If the eight attempts were independent, a policy that succeeds on{' '}
            <Derived>44</Derived>% of first tries would already reach 99%, since <M>{'0.56^8 \\approx 0.01'}</M>. The
            paper&apos;s text gives no first-try rate for its final policies.{' '}
            <Cite id="F04-16">ENPIRE paper, abstract and section 3</Cite>
          </Box>
          <Box variant="p">
            The same rule covers compute once the loop leaves its station. On the station the cap is physical, one
            GPU per robot; on a shared cluster it becomes a setting, and the agent must not be able to edit that
            setting either. Anything the agent&apos;s grade, test or spend depends on belongs outside its reach.{' '}
            <Cite id="F04-49">ENPIRE repository, autoresearch_instruction.md</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Split one improvement cycle between the agent and the code around it, and see why robot time is spent last in every idea"
          >
            One cycle: code resets, runs and grades; the agent reads, edits and trains
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Improving a policy by hand is a cycle an engineer repeats: put the scene back, run the policy, decide
            whether the trial worked, study the failures, edit the training code, train again. ENPIRE splits that cycle
            between code and the agent. Code does the first three steps on every trial: the reset, the rollout and the success check. The
            paper calls that check the verifier. Its verdict is the grade the agent works to raise. The agent does the
            other three steps: it reads logs and papers, edits the training code and launches the next training run.{' '}
            <Cite id="F04-1">ENPIRE paper, abstract</Cite>{' '}
            <Cite id="F04-2">ENPIRE paper, sections 1 and 2.1</Cite>
          </Box>
          <Box variant="p">
            Each station is two robot arms, three cameras, its own agent and one workstation with one NVIDIA RTX 5090
            (32 GB), a 24-core CPU and 128 GB of RAM. That single GPU trains and runs the policy, with no shared
            cluster or off-station compute; the agent&apos;s language model is the one part that runs elsewhere, as a
            hosted model. The station is the unit the fleet scales by, and its one GPU is the only cap on the compute
            its agent can launch. <Cite id="F04-5">ENPIRE paper, figure 1 and appendix B.2</Cite>{' '}
            <Cite id="F04-25">ENPIRE paper, appendix C.4</Cite>{' '}
            <Cite id="F04-49">ENPIRE repository, autoresearch_instruction.md</Cite>
          </Box>
          <Box variant="p">
            ENPIRE works in two stages. In stage one, a person and the agent build the code half once per task and
            freeze it; in stage two, the agent runs its half with no person in the loop. Stage one starts from a few
            minutes of recorded successes and failures, from which the agent writes the success check as code that
            returns pass or fail for one trial. For inserting a pin, the check requires three conditions at once: the
            pin aligned in the camera image, the gripper at the right height, and a force estimate in range. Two of the
            three are not vision. <Cite id="F04-2">ENPIRE paper, section 2.1</Cite>{' '}
            <Cite id="F04-12">ENPIRE paper, section 2.1 and figure 9</Cite>
          </Box>
          <Box variant="p">
            The agent also writes the reset, which returns the scene to the start of the hardest phase of the task,
            such as the moment before the pin goes in. It runs object detection, pose tracking and GPU motion planning,
            so the reset is itself a workload on the station&apos;s GPU.{' '}
            <Cite id="F04-14">ENPIRE paper, section 2.1 and appendix A.1</Cite>
          </Box>
          <Box variant="p">
            The person sets the bar. They state the precision the check must reach, which is the share of the trials it
            passes that truly succeeded. Precision is the bar that protects the grade: a false pass is a reward the
            agent can chase, while a false fail only slows it down. As an illustration, if the check passes one failure
            in ten, a policy that truly succeeds <Toy>60</Toy>% of the time reports{' '}
            <Toy>0.6 + 0.4 x 0.1 = 0.64</Toy>, and an agent that learns which failures the check passes can push the
            reported figure higher without improving the policy.{' '}
            <Cite id="F04-13">ENPIRE paper, appendix A.2</Cite>
          </Box>
          <Box variant="p">
            The person also states the check&apos;s recall, the share of true successes it passes, and its latency,
            because it runs after every trial: on a task that fastens a zip tie, it reads two camera views within a 150
            ms budget. The paper does not report the precision and recall it set. Last, the person keeps a test the
            agent cannot study: a few minutes of labelled snapshots are held out, and &quot;the agent may study
            failures, but cannot train on the test set or alter metric computation&quot;.{' '}
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
            The agent picks the learning method. It can choose behaviour cloning (copying demonstrations, section 4);
            reinforcement learning (RL), which improves a policy from its own scored trials, here on the real robot, as
            section 8 describes for a real arm; a scripted policy; or a mix. It also sets the training settings, such as
            the batch size. In the published eight-agent run on pin insertion, the largest single gain came from a mix:
            adding a behaviour-cloning term to the training loss raised the team&apos;s best success rate by 10.8
            percentage points. <Cite id="F04-3">ENPIRE paper, sections 2.2 and 3.2</Cite>{' '}
            <Cite id="F04-23">ENPIRE paper, appendix B.6</Cite>
          </Box>
          <Box variant="p">
            Every idea follows one order, set in the repository&apos;s instruction file, and the order spends robot
            time last, because robot access is what the loop runs short of first. The agent records one hypothesis a trial could prove wrong, makes the smallest change to the
            policy side that tests it, and runs the unit tests and an offline evaluation. Only then does it run the
            approved number of real trials. It reads the result file, the metrics and the video, and keeps the change
            only if it passes the success and regression gates. Failed trials stay in the record.{' '}
            <Cite id="F04-9">ENPIRE repository, autoresearch_instruction.md</Cite>{' '}
            <Cite id="F04-21">ENPIRE paper, section 5.2</Cite>
          </Box>
          <Box variant="p">
            The agent never drives a motor. Its requests reach the hardware through a local server with three calls:{' '}
            <code>/start</code> begins a rollout, <code>/restart</code> opens a fresh directory for the next
            rollout&apos;s data, and <code>/home</code> sends the arms to their home pose. The policy it trains acts 30
            times a second, the rate of the {ARM}&apos;s host loop in section 3, The Robot as a Computer, while joint
            controllers track each target 100 times a second. The agent works on a far slower clock: the eight-agent
            run tried 86 ideas in about 3.4 hours, about three per agent-hour.{' '}
            <Cite id="F04-6">ENPIRE paper, appendix B.1</Cite>{' '}
            <Cite id="F04-23">ENPIRE paper, appendix B.6 and figure 12</Cite>
          </Box>
          <Figure
            cites="F04-3 F04-6 F04-7 F04-8 F04-12"
            caption={
              <>
                The blue box is all the agent may edit; the dashed box is built once with a person and then only
                read. One pass runs down the grey arrows, and the blue arrow carries the grade back to the agent for
                its next idea.
              </>
            }
          >
            <AgentLoopDiagram />
          </Figure>
          <Box variant="p">
            On the {ARM} {TASK_NAME} task, stage one would be a few minutes of the block landing in the cup and of
            misses, a check that tells the two apart, and a reset that lifts the block out of the cup and sets it back
            at its start. ENPIRE&apos;s code ships an adapter for its own two-arm stations and none for the {ARM},
            so that reset would be yours to write. <Cite id="F04-5">ENPIRE paper, section 2.2</Cite>{' '}
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
            The arm&apos;s own limits catch what the agent&apos;s code gets wrong. Position and motion limits end the
            episode and trigger a reset the moment they are crossed. The gripper is torque-limited, so a bad contact
            stalls instead of pushing hard enough to damage the hardware; the paper calls that bound essential because
            the eight stations run unattended, with no person to intervene. For the moments a person is present, the
            repository&apos;s security notes require &quot;explicit operator intent&quot; and &quot;a physical
            emergency stop within reach&quot; for real-robot commands. The motion limits are software, which is why
            they are on the list of what the agent must not change. Keep them outside its repository.{' '}
            <Cite id="F04-10">ENPIRE paper, section 2.1 and appendix B.3, and SECURITY.md</Cite>{' '}
            <Cite id="F04-8">ENPIRE repository, autoresearch_instruction.md</Cite>
          </Box>
          <Box variant="p">
            Simulation shows what else the agent could reach. In ENPIRE&apos;s simulated kitchen tasks, to stop the
            agent cheating, the environment removes the calls that leak the task&apos;s state or grant a retry:{' '}
            <code>get_task_info</code>, <code>reset_env</code>, <code>reset_to_initial</code>, task-specific
            command-line helpers and queries for the true target. In the agent&apos;s hands, a reset is a free retry.{' '}
            <Cite id="F04-24">ENPIRE paper, appendix D.1</Cite>
          </Box>
          <Box variant="p">
            Other agent-run loops published in 2026 draw the same line in other places, and what stands between the
            agent and its grade ranges from a written rule to a separate process. To judge a loop you meet, find what it
            puts out of the agent&apos;s reach and who grades.
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
                  <td style={TD}>Environment, reset, verifier, safety limits, evaluation seeds, by written rule</td>
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
            description="Catch a test the agent chose, a judge that leans toward success and a count too small to rank a change, each with the check that exposes it"
          >
            How an agent&apos;s score parts from the robot&apos;s skill
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            An agent improving against a grader is an optimiser, and an optimiser takes the cheapest route to a high
            score, the idea the <Link href="../rl-agentic-loops/">Learning From Feedback dive</Link> builds in its
            section 13, The Reward Is a Proxy. On a robot that route often runs through whoever resets the scene.
          </Box>
          <Box variant="p">
            Whoever runs the reset chooses the test. SEAR reports that on a real robot &quot;success in practice
            overstates success in the test&quot;: during practice the agent resets the scene itself and rarely creates
            the hard starting states an operator sets up for the test. Keep a set of start states the agent never
            chose, and score the policy on those. <Cite id="F04-84">SEAR paper, section 4</Cite>
          </Box>
          <Box variant="p">
            A judge built on a general vision-language model leans toward success, and an agent optimising against it is
            paid for failures. The FailBench study covered in section 8 found &quot;a systematic bias toward predicting
            success under ambiguous evidence&quot;, and no detector it tested exceeded 0.60 in balanced accuracy on
            contact-intensive assembly. Balanced accuracy averages the detection rates on successes and on failures,
            so 0.5 is chance. ENPIRE&apos;s check for pin insertion, a contact task, does not rest on the camera: two
            of its three conditions are the gripper&apos;s height and a force estimate.{' '}
            <Cite id="F04-45">FailBench paper, abstract</Cite>{' '}
            <Cite id="F04-12">ENPIRE paper, figure 9</Cite>
          </Box>
          <Box variant="p">
            A count too small to rank the change bites late, when the gains get small. After ENPIRE&apos;s early
            10.8-point gain, its later ideas such as batch-size tuning (+0.9) and controller compensation (+1.3) added
            about one point each. AgenticRobotics, which runs the loop on one GPU, measured its own instrument:
            &quot;100 held-out episodes give a +/-9.5-point interval&quot;, and re-running one evaluation with the same
            seeds left the total unchanged while 22 of the 100 episodes flipped outcome. ENPIRE does not give the trial
            count behind each gain; at 100 episodes, gains of +0.9 and +1.3 would sit deep inside that interval.{' '}
            <Cite id="F04-23">ENPIRE paper, appendix B.6</Cite>{' '}
            <Cite id="F04-35">AgenticRobotics paper v2, sections 3.5 and 5</Cite>{' '}
            <Cite id="F04-37">AgenticRobotics paper v2, section 5</Cite>
          </Box>
          <Box variant="p">
            AgenticRobotics answers with a gate. With <M>w</M> the half-width of the 95% interval on the difference between two
            success rates, a new checkpoint replaces the best only if it beats it by at least <M>{'1.5w'}</M>; a
            smaller gain goes to a paired test that scores both checkpoints on the same episodes, and no gain forces a
            change of strategy. The same paper reports against its own design: on the one training run it measured,
            taking the final checkpoint with no measurement at all beat every measurement-driven selector, its own
            included, by 5.6 to 10.0 points of held-out success. One run is itself a small count, so take the narrower
            lesson: a selector is no better than the evaluation count behind it, and a kept change has to clear the
            interval at the trials you actually ran. <Cite id="F04-35">AgenticRobotics paper v2, section 3.5</Cite>{' '}
            <Cite id="F04-37">AgenticRobotics paper v2, section 5</Cite>
          </Box>
          <Box variant="p">
            The nearest published agent loop on the {ARM} shows the count at small scale. In AdaRSI, a coding agent
            first rewrites the instructions, tools and procedure around a frozen VLA (vision-language-action model, the
            large pretrained policy of section 5), and fine-tunes only the sub-steps that stay unreliable. Its authors tested placing a toy in a bowl on an {ARM}, with objects,
            sizes and orientations the demonstrations did not show, and report that the rewrite raised success on those
            from 65% to 100%, with 10 trials per configuration. <Cite id="F04-85">AdaRSI paper v2, section 5.4 and appendix D</Cite>
          </Box>
          <Box variant="p">
            Ten successes in ten on one configuration are a strong result and a small count. The 95% Wilson interval of
            section 16, the range of true rates that could plausibly have produced a count, has a simple lower end when
            every trial succeeds: <M>{'n / (n + z^2)'}</M>, with <M>n</M> the trials and <M>{'z = 1.96'}</M> the
            multiplier for 95%, so <M>{'z^2 \\approx 3.84'}</M>. For ten trials that is{' '}
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
            description="Read the headline against the first-try rate that section 16 counts, and measure that rate yourself before comparing two policies"
          >
            99% pass@8 counts recoveries on a practised task
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The authors define the score in one sentence: &quot;We measure success as the chance of completing a task
            in one rollout, given a fixed number of retries (here, eight).&quot; Write pass@k for the share of rollouts
            that succeed within <M>k</M> attempts. Pass@1 is then the first-try rate, and pass@8 is the headline. The
            retries are not fresh draws: &quot;our retries happen after witnessing the previous failure&quot;, the
            authors add, unlike best-of-N sampling, which draws each attempt fresh.{' '}
            <Cite id="F04-16">ENPIRE paper, section 3</Cite>
          </Box>
          <Box variant="p">
            Fresh draws give the reference case. If each attempt succeeded with the same first-try rate <M>p</M> and
            the attempts were independent, a rollout would fail only if all eight failed, which happens with
            probability <M>{'(1-p)^8'}</M>, so pass@8 would be <M>{'1-(1-p)^8'}</M>. A policy that succeeds on 13% of
            first tries would then pass <Derived>1 - 0.87^8 = 0.67</Derived> of rollouts. The authors&apos; project
            page gives the low case, a policy that cannot recover from its failure: &quot;a policy that can&apos;t
            stays near pass@1 (a 13% policy stays ~13%, not 99%)&quot;. To land above the fresh-draw line, a retry has
            to succeed more often than a first try, which means the policy uses the failure it just saw. That is the
            recovery pass@8 measures, and a high pass@8 says little about the first try. <Cite id="F04-16">ENPIRE project page and paper, section 3</Cite>
          </Box>
          <Box variant="p">
            The 99% also comes from the task the policy practised. A 2026 survey of self-improving robot systems notes
            that in the pin-insertion experiment, ENPIRE &quot;trains and evaluates on the same task&quot;. In stage
            two every trial starts from the one reset frozen in stage one, so SEAR&apos;s finding applies: the policy
            has been scored on the starts that fixed reset produces, not on the hard starts an operator would set for a
            test.{' '}
            <Cite id="F04-16">ENPIRE paper, abstract</Cite>{' '}
            <Cite id="F04-2">ENPIRE paper, section 2.1</Cite>{' '}
            <Cite id="F04-86">Physical RSI survey, section 2.3</Cite>{' '}
            <Cite id="F04-84">SEAR paper, section 4</Cite>
          </Box>
          <Box variant="p">
            The agent&apos;s own finish line is a count too. The prompt asks for 100% over each window of 50 consecutive
            episodes. Whether an episode there is one attempt or a whole rollout, the lower end of the Wilson interval
            for 50 successes in 50 is <Derived>50 / (50 + 3.84) = 0.929</Derived>. To compare an agent-trained policy with your own, run
            first tries from start states the agent never chose, and count them as section 16 does.{' '}
            <Cite id="F04-4">ENPIRE paper, appendix B.1, figure 10</Cite>{' '}
            <Cite id="F11-203">LeRobot v0.7.0, eval_stats.py, wilson_interval()</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Read the authors' scaling result, find what the fleet waited on, and budget tokens, whose rate grew 15 times for eight times the agents"
          >
            Eight robots bought 2.25 to 3.7 times the speed, and the robots waited
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The authors timed fleets of one, four and eight agents, one robot each, against two finish lines: the first
            time a task reaches its target, and the prompt&apos;s own objective of 100% over every window of 50
            consecutive episodes. To the first target, pin insertion fell from 2.5 hours with one agent to 0.89 with
            four and 0.67 with eight. On Push-T, a pushing task scored from 0 to 1, the
            fleets took 4.7, 3.1 and 2.0 hours to reach a score of 1.0. Eight times the robots bought about 3.7 times the speed on pin insertion and 2.4 times on
            Push-T, not eight. <Cite id="F04-18">ENPIRE paper, figure 3 and section 3.3</Cite>{' '}
            <Cite id="F04-4">ENPIRE paper, appendix B.1, figure 10</Cite>
          </Box>
          <Box variant="p">
            The prompt&apos;s objective gives the smaller figure. On pin insertion, eight agents cut the time to
            complete it from 4.5 hours to 2.0, 2.25 times faster.{' '}
            <Cite id="F04-20">ENPIRE project page, chart data</Cite>
          </Box>
          <Box variant="p">
            The utilisation figures show where the rest went. The authors define robot utilisation as the share of
            research wall-clock time in which the robot is running an experiment, and GPU utilisation the same way for
            the station&apos;s GPU. On pin insertion they report robot utilisation of 49.1% with one agent, 30.9% with
            four and 29.8% with eight, while GPU utilisation rose from 29.4% to 32.5% and 49.0%. The standard
            deviations are wide: at eight agents the GPU figure is 49.0 plus or minus 30.2. With eight agents a robot
            stood idle the other <Derived>70</Derived>% of the time.{' '}
            <Cite id="F04-19">ENPIRE project page, utilisation chart data, and paper section 2.2</Cite>
          </Box>
          <Box variant="p">
            The cause is the agent&apos;s pace. A robot waits while its agent reads logs, writes
            code, debugs or waits for its language model. As the fleet grows, agents spend more of their time
            summarising each other&apos;s branches and less operating the robot, and they &quot;may also fail to launch
            parallel training sessions to exhaust GPU resources&quot;. On hardware, in the authors&apos; words,
            &quot;the binding resource is the agent&apos;s robot-access budget, not its compute&quot;.{' '}
            <Cite id="F04-21">ENPIRE paper, sections 4 and 5.2</Cite>
          </Box>
          <Box variant="p">
            What the loop asks of machines follows from where it waits. The agent itself is a remote inference
            workload: tokens from a hosted language model, most of them context it has sent before. Locally it reads
            logs, writes code and pushes to Git, work for a CPU and a disk. The GPU works in bursts, when a training run
            or the reset&apos;s detection and motion-planning models run, and at every fleet size the authors tested it
            was idle more than half the time. If you serve the agent&apos;s model yourself, that demand is a
            language-model serving workload (sized in the <Link href="../vllm/">vLLM dive</Link>).{' '}
            <Cite id="F04-19">ENPIRE project page, utilisation chart data</Cite>{' '}
            <Cite id="F04-14">ENPIRE paper, appendix A.1</Cite>{' '}
            <Cite id="F04-22">ENPIRE paper, appendix C.2</Cite>
          </Box>
          <Figure
            cites="F04-18 F04-19 F04-20"
            caption={
              <>
                Each group of bars is one ENPIRE fleet size on pin insertion. Top: as agents are
                added, the robot runs experiments a smaller share of the time and the GPU a larger one. Middle and
                bottom: the fleet completes the prompt&apos;s objective sooner and spends more tokens doing it. These
                hours run longer than the times to first reach the target, because the objective is the later finish
                line.
              </>
            }
          >
            <FleetChart />
          </Figure>
          <Box variant="p">
            Tokens are the cost that grows fastest. ENPIRE&apos;s fleets used 9,269 tokens a minute with one agent,
            40,029 with four and 140,310 with eight: 15 times the tokens for eight times the
            agents, and 1.9 times what eight copies of the single agent would use. Tokens to complete the objective
            rose from 2.5 million to 16.8 million while the time fell from 4.5 to 2.0 hours, 6.7 times the tokens for
            2.25 times the speed. In the authors&apos; words, larger fleets &quot;reach success sooner, but require a
            disproportionately higher token budget&quot;.{' '}
            <Cite id="F04-20">ENPIRE project page, token chart data, and paper section 4</Cite>
          </Box>
          <Box variant="p">
            Those figures may leave out most of what an agent sends. On a simplified real Push-T task, one agent used
            80M tokens in total: 77M cached input, 2.4M fresh input and 0.27M output. Cached input is context the model
            provider has already processed on an earlier call and reads again, so about 96% of the tokens are the agent
            re-sending its own history. The paper does not say whether the fleet figures count cached input, and one
            agent&apos;s 80M here, against 2.5 million to complete the objective on pin insertion, suggests they do
            not. Budget from the full count, with the cached share priced at your provider&apos;s cached-input rate,
            the line that dominates the bill.{' '}
            <Cite id="F04-22">ENPIRE paper, appendix C.2, figure 13</Cite>
          </Box>
          <Box variant="p">
            The agent itself is a setting with a large effect. On the same simplified task, the ENPIRE authors timed
            three pairings of agent program and model, one run each: first success came after 54.41 minutes with Codex
            driving GPT-5.5, 62.01 with Claude Code driving Opus 4.7, and 105.00 with Codex driving Opus 4.7. Single
            runs support only the large gap: the slowest pairing took <Derived>105.00 / 54.41 = 1.9</Derived> times as
            long as the fastest. In further single runs with Codex, the model reading camera images directly beat no vision (54.67
            against 72.32 minutes) and vision as a separate tool it had to call (99.18).{' '}
            <Cite id="F04-25">ENPIRE paper, appendix C.3 and C.4</Cite>
          </Box>
          <Box variant="p">
            On 10 simulated tasks, the ASPIRE authors report the same loop scoring from 14.8% to 99.2% depending only on
            which language model drives it. Test the model and the agent program together on your own task before
            tuning anything else.{' '}
            <Cite id="F04-30">ASPIRE paper v2, section 3.8 and table 18</Cite>
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
            In the published loops the cap on compute is physical: one GPU per station. The budgets that exist are
            counts an operator sets: ENPIRE&apos;s number of approved real-robot trials; the fixed numbers of iterations and
            trials in SimEX, a loop that searches in simulation before touching the robot; and AgenticRobotics&apos;
            required timeout on every tool call. None of the three lets the agent choose its hardware, and none
            publishes a GPU-hour or token budget enforced on it.{' '}
            <Cite id="F04-49">ENPIRE autoresearch_instruction.md, SimEX and AgenticRobotics papers</Cite>{' '}
            <Cite id="F04-43">SimEX paper v1, section 1</Cite>
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
            The grade goes first, because it is what the agent works to raise. Run the grader the way SEAR does: as a
            separate job that receives the frozen policy, holds the evaluation start states, and returns only the
            verdict. Its code and start states then live where the agent&apos;s credentials can read the verdict and
            cannot write the grader, and the safety limits stay in the station&apos;s code, outside the repository the
            agent edits. <Cite id="F04-83">SEAR paper, section 2.4, sealed judge</Cite>{' '}
            <Cite id="F04-8">ENPIRE repository, autoresearch_instruction.md</Cite>
          </Box>
          <Box variant="p">
            The agent&apos;s GPU jobs fit AWS Batch, AWS&apos;s managed job queue, which runs each job in a container
            on instances it starts. Batch holds the three caps those jobs need in one place: a time limit per job, a
            ceiling on total capacity, and a count on the robots. Time comes first, because Batch sets no limit by
            default, and a job without one runs until its container exits.{' '}
            <Cite id="F04-50">AWS Batch User Guide, job timeouts</Cite>
          </Box>
          <Box variant="p">
            The setting is <code>attemptDurationSeconds</code>. At the limit Batch sends the container SIGTERM and, 30
            seconds later, SIGKILL, so a training job has 30 seconds to save a checkpoint; a job ended this way is not
            retried. The value can sit in the job definition or come with the submission, so it holds against the agent
            only if the agent&apos;s submissions pass through a step that sets it and that the agent cannot edit.{' '}
            <Cite id="F04-50">AWS Batch User Guide, job timeouts</Cite>
          </Box>
          <Box variant="p">
            The capacity ceiling is the compute environment&apos;s <code>maxvCpus</code>, the most vCPUs it may run
            at once; it caps GPUs only through the instance types the environment is allowed to launch. If the agent&apos;s jobs run on Amazon EKS (Elastic Kubernetes Service,
            AWS&apos;s managed Kubernetes), the node autoscaler Karpenter can cap GPUs by name, with{' '}
            <code>nvidia.com/gpu</code> in a NodePool&apos;s <code>spec.limits</code>; with no limit set, the only cap
            is the account&apos;s EC2 quota. Karpenter launches nodes in parallel and checks its limit only eventually,
            so a fast burst of agent jobs can overrun it: treat it as a backstop, with the exact ceiling at the submit
            step. <Cite id="F10-3">AWS Batch API Reference, ComputeResource</Cite>{' '}
            <Cite id="F10-407">Karpenter v1.15.3 docs, NodePool limits</Cite>
          </Box>
          <Box variant="p">
            The robot is the cap no instance type provides: one physical arm, one experiment at a time. It applies
            once robot trials are submitted as jobs too, each calling the station&apos;s local server. Batch&apos;s
            consumable resources make a job wait until a counted resource, such as a licence token, is free. Model each
            station as one such resource with a count of one, and two jobs can never drive the same arm at once.
            Consumable resources also work under fair-share scheduling, which divides a shared queue among teams or
            agents by weight and keeps a burst of agent jobs from starving people. Fair share divides capacity in
            proportion, though, and counts no GPU-hours against a budget.{' '}
            <Cite id="F04-52">AWS Batch User Guide, resource-aware scheduling</Cite>{' '}
            <Cite id="F04-51">AWS Batch User Guide, fair-share scheduling</Cite>
          </Box>
          <Box variant="p">
            The agent&apos;s own code needs a stronger fence than one repository. AWS Nitro Sandboxes, announced on 9
            November 2026, run each pod or container in its own lightweight virtual machine, a Firecracker microVM with
            its own Linux kernel, and AWS pitches them for this case: to &quot;safely execute LLM-generated code&quot;.
            On EKS a pod opts in by setting <code>runtimeClassName</code> to <code>isolated-sandbox</code>, on
            Kubernetes 1.36 or later, and an annotation can boot the sandbox with no network device at all. ENPIRE gives
            its agent unrestricted internet access; in a sandbox, what the agent may reach, which must include its model
            and Git, becomes a choice you make.{' '}
            <Cite id="F09-43">AWS What&apos;s New post and EKS User Guide, Nitro Sandboxes</Cite>{' '}
            <Cite id="F04-11">ENPIRE paper, appendix B.1</Cite>
          </Box>
          <Box variant="p">
            One limit shapes the design: on accelerated instances a sandbox &quot;runs CPU workloads only&quot;, and GPU
            passthrough &quot;is currently unavailable&quot;. So the tenant splits in two. The agent&apos;s own work
            (editing code, running unit tests, reading logs) runs inside the sandbox, and the training job it launches
            runs outside, as a Batch job under a timeout and a capacity ceiling. The submit step between the two is
            where the caps are set.{' '}
            <Cite id="F09-45">EC2 User Guide, Nitro Sandboxes, considerations and limitations</Cite>
          </Box>
          <Box variant="p">
            The campaign, the whole run of ideas toward the goal, has to outlive the agent&apos;s session. On Amazon
            Bedrock AgentCore Runtime, AWS&apos;s managed host for agents, a session on its microVMs ends after at most
            8 hours, and an idle one after 15 minutes by default. ENPIRE&apos;s single-agent comparison runs were given 4 hours on pin insertion and 8 on Push-T,
            and it keeps its state in Git, which outlasts any session. Keep the campaign&apos;s state outside the
            session the same way, and an 8-hour cap ends a session, not the campaign.{' '}
            <Cite id="F04-53">AgentCore Developer Guide, quotas</Cite>{' '}
            <Cite id="F04-17">ENPIRE project page, figure 3 data</Cite>{' '}
            <Cite id="F04-7">ENPIRE paper, section 2.2</Cite>
          </Box>
          <Box variant="p">
            Before an agent&apos;s first unattended night, put the grader, the reset, the evaluation start states and
            the safety limits where its credentials cannot write, and give every job it submits a timeout through a step
            it cannot edit. From the first run, log robot utilisation, GPU utilisation and tokens per minute, and
            measure the policy&apos;s first-try rate on start states the agent never chose. ENPIRE&apos;s 99% pass@8
            counts recoveries; the number to compare across policies is the first try.{' '}
            <Cite id="F04-16">ENPIRE paper, section 3</Cite>
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
