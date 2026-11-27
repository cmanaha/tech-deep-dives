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
const LIST: CSSProperties = { margin: 0, paddingLeft: 22 };

/* ------------------------------------------------------------------------ */
/* Diagram 19.1 (static): one station of the loop, and what the agent may   */
/* change                                                                    */
/* ------------------------------------------------------------------------ */

const GPU_SUB = "the station's own, or one from a cluster queue";
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
          A coding agent proposes one idea and edits the parts it may change: the training code and the policy code,
          the learning method and its settings, and its own Git branch. It starts a training run on a GPU, the new
          policy runs on the robot, and each attempt is scored. The success check, the reset and the safety limits
          are frozen, so the agent can read them but cannot change them. The grade goes back to the agent, which then
          tries its next idea.
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
          Frozen: read-only for the agent
        </text>
        <text x={bx + 12} y="404" {...body}>
          built with a person before the loop starts
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
          Robot and GPU utilisation, hours and tokens to reach the prompt&apos;s goal, for one, four and eight agents
        </title>
        <desc>
          Three bar panels for one, four and eight agents on pin insertion, as the ENPIRE authors report them. The
          share of time the robot runs an experiment falls from 49.1 percent to 30.9 and 29.8 percent, while the share
          of time the station GPU is in use rises from 29.4 to 32.5 and 49.0 percent. The hours to reach the
          prompt&apos;s goal fall from 4.5 to 3.2 and 2.0. The tokens used to reach it rise from 2.5 million to 7.7
          and 16.8 million.
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

        {/* panel B: hours to reach the prompt's goal */}
        <text x="14" y="250" {...title}>
          Hours to reach the prompt&apos;s goal
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

        {/* panel C: tokens to reach the prompt's goal */}
        <text x="14" y="424" {...title}>
          Tokens to reach the prompt&apos;s goal (millions)
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
            description="A coding agent can run the cycle that improves a robot's policy with no person watching. Before you let it, you need to know which parts of that cycle the agent must not be able to change. You also need to know why a reported 99% success within eight attempts is not a first-try success rate, and how to set limits on shared AWS capacity that the agent cannot edit."
          >
            19. Agents Running the Loop: What a Coding Agent Can Control and How Its Work Is Checked
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A coding agent is a language model that works through an agent program, such as Codex or Claude Code. The
            agent program lets the model read and write files and run commands. Here, the agent&apos;s task is to
            improve a robot&apos;s policy. The policy is the model that controls the robot&apos;s arm.
          </Box>
          <Box variant="p">
            You can leave a coding agent to do this work unattended only if three parts of the loop are outside its
            reach:
          </Box>
          <ul style={LIST}>
            <li>
              <strong>The reset.</strong> This is the routine that puts the scene back at its starting state before
              each new series of attempts.
            </li>
            <li>
              <strong>The success check.</strong> This is the code that decides whether each attempt at the task
              passed or failed.
            </li>
            <li>
              <strong>The safety limits.</strong> These are the limits that stop the arm before it causes damage,
              such as position and motion limits and the emergency stop.
            </li>
          </ul>
          <Box variant="p">
            These parts must be out of reach because the agent is asked to raise a success rate. If the agent can edit
            the success check, it can change what counts as a success. If the agent runs the reset, it can choose its
            own test and retry for free. In both cases the reported success rate goes up, and the rate alone cannot
            show you whether the policy got better or the test got easier.
          </Box>
          <Box variant="p">
            ENPIRE is a 2026 research system from NVIDIA and two universities. It runs eight real robots, each at its
            own station with its own coding agent. A person and the agent build the reset, the success check and the
            safety limits once and then freeze them. After that, the agent handles the training on its own. For the
            tasks they showcase, the authors report a score of 99% on a measure called &quot;pass@8&quot;.{' '}
            <Cite id="F04-2">ENPIRE paper, sections 1, 2.1 and 2.2</Cite>{' '}
            <Cite id="F04-5">ENPIRE paper, figure 1</Cite>{' '}
            <Cite id="F04-16">ENPIRE paper, abstract and section 3</Cite>
          </Box>
          <Box variant="p">
            To read that score, you need two definitions. An attempt is one try at the task, and it ends when the
            policy succeeds, fails or runs out of time. A rollout is one reset followed by up to eight attempts. The
            pass@8 measure counts a rollout as a success if any of its attempts succeeds. The scene is not reset
            between the attempts, and the authors write that each retry is made &quot;after witnessing the previous failure&quot;.
            Their definition does not say how that failure is passed on to the next attempt.{' '}
            <Cite id="F04-16">ENPIRE paper, section 3</Cite>
          </Box>
          <Box variant="p">
            So pass@8 mixes first tries with retries. If the eight attempts were independent, a policy that succeeds
            on <Derived>44</Derived>% of first tries would already reach 99%. The reason is that the chance of all
            eight attempts failing is then <M>{'0.56^8 \\approx 0.01'}</M>. Section 16, Evaluation, counts a
            different number: the success rate, which is the share of single attempts that succeed. If you read
            pass@8 as that success rate, a <Derived>44</Derived>% policy can look like a 99% one.{' '}
            <Cite id="F04-16">ENPIRE paper, abstract and section 3</Cite>
          </Box>
          <Box variant="p">
            Once the loop runs outside the robot&apos;s own workstation, the limit on compute needs the same
            protection as the success check and the reset. On the workstation, the limit on compute is physical,
            because each robot has one GPU. On a shared cluster, that limit becomes a setting, and the agent must not
            be able to edit that setting either. In short, anything that the
            agent&apos;s grade, its test or its spending depends on must be outside its reach.{' '}
            <Cite id="F04-49">ENPIRE repository, autoresearch_instruction.md</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="ENPIRE splits each improvement cycle between fixed code and the coding agent. You will learn which steps each side runs, how the fixed parts are built, and why the agent uses the real robot last when it tests a change."
          >
            How one improvement cycle is split between code and the agent
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            When an engineer improves a policy by hand, they repeat a cycle of six steps. They put the scene back, run
            the policy, decide whether the attempt worked, study the failures, edit the training code and train again.
            ENPIRE splits that cycle between code and the agent. Code runs the first three steps on every rollout: the
            reset, the run and the success check. The paper calls the success check the verifier. The check&apos;s
            verdict on each attempt is the grade that the agent works to raise. The agent runs the other three steps:
            it reads logs and papers, edits the training code and starts the next training run.{' '}
            <Cite id="F04-1">ENPIRE paper, abstract</Cite>{' '}
            <Cite id="F04-2">ENPIRE paper, sections 1 and 2.1</Cite>
          </Box>
          <Box variant="p">
            ENPIRE scales its fleet by adding whole stations. Each station is one robot, one GPU that both trains and
            runs the policy, and its own agent. All of the policy work stays on the station. Only the agent&apos;s language
            model runs elsewhere, as a hosted model.{' '}
            <Cite id="F04-5">ENPIRE paper, figure 1 and appendix B.2</Cite>{' '}
            <Cite id="F04-25">ENPIRE paper, appendix C.4</Cite>{' '}
            <Cite id="F04-49">ENPIRE repository, autoresearch_instruction.md</Cite>
          </Box>
          <ExpandableSection headerText="The hardware in one station">
            <Box variant="p">
              Each station has two arms and three cameras. Its workstation has one NVIDIA RTX 5090 GPU with 32 GB of
              memory, a 24-core CPU and 128 GB of RAM. That one 32 GB GPU carries all of the station&apos;s GPU work:
              training, the policy, and the detection and motion planning that the reset uses.{' '}
              <Cite id="F04-5">ENPIRE paper, appendix B.2</Cite>{' '}
              <Cite id="F04-14">ENPIRE paper, appendix A.1</Cite>
            </Box>
          </ExpandableSection>
          <Box variant="p">
            ENPIRE works in two stages. In stage one, a person and the agent build the code side of the cycle once per
            task, and then they freeze it. In stage two, the agent runs its own side of the cycle with no person
            involved. Stage one starts from a few minutes of recorded successes and failures. From these recordings,
            the agent writes the success check as code that returns pass or fail for one attempt. For a task that
            inserts a pin, the check requires three conditions at the same time: the pin is aligned in the camera
            image, the gripper is at the right height, and a force estimate is in range.{' '}
            <Cite id="F04-2">ENPIRE paper, section 2.1</Cite>{' '}
            <Cite id="F04-12">ENPIRE paper, section 2.1 and figure 9</Cite>
          </Box>
          <Box variant="p">
            The agent also writes the reset. The reset returns the scene to the start of the hardest phase of the
            task, such as the moment before the pin goes in. To do this, it runs object detection and pose tracking,
            and it plans the arm&apos;s motion on the GPU. So the reset is itself a workload on the station&apos;s
            GPU.{' '}
            <Cite id="F04-14">ENPIRE paper, section 2.1 and appendix A.1</Cite>
          </Box>
          <Box variant="p">
            The person sets the quality bar for the success check by stating the precision it must reach. Precision
            is the share of the attempts passed by the check that truly succeeded. Precision matters most for the
            grade, because the two kinds of error affect the agent differently. When the check passes a failure, the
            agent is rewarded for that failure and can learn to repeat it. When the check fails a success, the agent
            is only slowed down.{' '}
            <Cite id="F04-13">ENPIRE paper, appendix A.2</Cite>
          </Box>
          <Box variant="p">
            Here is an illustration with made-up numbers. Take a check that passes every true success and also passes
            one failure in ten. A policy that truly succeeds <Toy>60</Toy>% of the time then gets a reported success
            rate of <Toy>0.6 + 0.4 x 0.1 = 0.64</Toy>, and the check&apos;s precision is{' '}
            <Toy>0.6 / 0.64 = 0.94</Toy>. Even at that precision, an agent that learns which failures the check passes
            can push the reported rate higher without improving the policy.
          </Box>
          <Box variant="p">
            Precision also changes when the policy changes. Apply the same check to a policy that truly succeeds{' '}
            <Toy>20</Toy>% of the time. The reported rate is <Toy>0.2 + 0.8 x 0.1 = 0.28</Toy>, and the precision is{' '}
            <Toy>0.2 / 0.28 = 0.71</Toy>. The number that stays the same is the share of failures that the check
            passes, which is one in ten in both cases. So a precision measured on the stage-one recordings holds only
            for the mix of successes and failures in those recordings, and it drifts as the policy improves. When you
            set the bar, state the share of failures the check may pass, because that number describes the check
            itself, while precision also depends on the policy&apos;s true success rate. Then measure precision again
            as the policy changes.
          </Box>
          <Box variant="p">
            The person also states two more requirements for the check. The first is recall. Recall is the share of
            true successes that the check passes. The second is latency, which matters because the check runs after
            every attempt.
            On a task that fastens a zip tie, for example, the check reads two camera views within a 150 ms budget.
            The paper does not report the precision and recall that its checks achieved.{' '}
            <Cite id="F04-13">ENPIRE paper, appendix A.2</Cite>{' '}
            <Cite id="F04-12">ENPIRE paper, appendix A.2</Cite>
          </Box>
          <Box variant="p">
            Last, the person keeps a test set that the agent cannot train on. A few minutes of labelled snapshots are
            held out, and the rule is that &quot;the agent may study failures, but cannot train on the test set or
            alter metric computation&quot;.{' '}
            <Cite id="F04-13">ENPIRE paper, appendix A.2</Cite>{' '}
            <Cite id="F04-12">ENPIRE paper, appendix A.2</Cite>
          </Box>
          <Box variant="p">
            In stage two, the agent&apos;s whole instruction is a prompt of nine lines. The first line sets the goal:{' '}
            <code>/goal Achieve a 100% success rate over each window of 50 consecutive episodes.</code> The other lines
            tell the agent to start a team of helper agents, called subagents, to study different methods. They also
            tell it to work on its own Git branch and to pull what the other stations push. Git is the only channel
            between the stations, and there is no central server.{' '}
            <Cite id="F04-4">ENPIRE paper, appendix B.1, figure 10</Cite>{' '}
            <Cite id="F04-7">ENPIRE paper, section 2.2 and appendix B.1</Cite>
          </Box>
          <Box variant="p">
            The agent chooses the learning method. It can use behaviour cloning, which trains the policy to copy
            demonstrations (section 4, Learning From Demonstrations). It can use reinforcement learning (RL), which
            improves the policy from its own scored attempts, here on the real robot. It can also write a scripted
            policy, which is control code written as a program instead of a trained model. Or it can use a mix of
            methods. The agent also sets the training settings, such as the batch size.
          </Box>
          <Box variant="p">
            In the published eight-agent run on pin insertion, the most notable gain came from a mix of methods.
            Adding a behaviour-cloning term to the training loss raised the &quot;team-average best success
            rate&quot; by 10.8 percentage points. That rate is the best success rate reached so far, averaged over the
            team.{' '}
            <Cite id="F04-3">ENPIRE paper, sections 2.2 and 3.2</Cite>{' '}
            <Cite id="F04-23">ENPIRE paper, appendix B.6</Cite>
          </Box>
          <Box variant="p">
            The repository&apos;s instruction file sets the order in which the agent tests every idea, and the real
            robot comes last in that order. The reason, in the authors&apos; words, is that on hardware the limiting
            resource is &quot;the agent&apos;s robot-access budget, not its compute&quot;. For each idea, the agent
            works through these steps:
          </Box>
          <ol style={LIST}>
            <li>It records one hypothesis that real attempts could prove wrong.</li>
            <li>It makes the smallest change to the policy side that tests the hypothesis.</li>
            <li>It runs the unit tests and an offline evaluation.</li>
            <li>Only after that, it runs the approved number of real attempts on the robot.</li>
            <li>It reads the result file, the metrics and the video.</li>
            <li>
              It keeps the change only if the change passes the gates set in the configuration: enough successes, and
              no regression on what already worked. Failed attempts stay in the record.{' '}
              <Cite id="F04-9">ENPIRE repository, autoresearch_instruction.md</Cite>{' '}
              <Cite id="F04-21">ENPIRE paper, section 5.2</Cite>
            </li>
          </ol>
          <Box variant="p">
            The agent&apos;s process never sends commands to a motor itself. Its requests reach the hardware through a
            small local server on the station. ENPIRE&apos;s policy runs 30 times a second. That is the same rate at
            which the {ARM}&apos;s host computer runs its control loop (section 3, The Robot as a Computer). The
            joint controllers on the station track each target 100 times a second. The agent works on a much slower
            clock. The eight-agent run tried 86 ideas in about 3.4 hours, which is about <Derived>86 / 3.4 / 8 = 3.2</Derived> ideas per
            agent-hour. So the agent&apos;s cycle is measured in minutes per idea, while the arm&apos;s control loop
            is measured in milliseconds per action.{' '}
            <Cite id="F04-6">ENPIRE paper, appendix B.1</Cite>{' '}
            <Cite id="F04-23">ENPIRE paper, appendix B.6 and figure 12</Cite>
          </Box>
          <ExpandableSection headerText="The three calls of the station server">
            <Box variant="p">
              The station server accepts three calls. <code>/start</code> begins a run on the hardware.{' '}
              <code>/restart</code> opens a fresh directory for the next run&apos;s data. <code>/home</code> sends the
              arms to their home pose. <Cite id="F04-6">ENPIRE paper, appendix B.1</Cite>
            </Box>
          </ExpandableSection>
          <Figure
            cites="F04-3 F04-6 F04-7 F04-8 F04-12"
            caption={
              <>
                The box headed &quot;The agent may change&quot; lists everything the agent may edit. The dashed box
                headed &quot;Frozen&quot; lists the parts that are built once with a person, which the agent can then
                only read. One pass
                of the cycle runs down the arrows in the middle. The arrow on the right side carries the grade back to
                the agent for its next idea. The layout is illustrative, and nothing in it is measured.
              </>
            }
          >
            <AgentLoopDiagram />
          </Figure>
          <Box variant="p">
            On the {ARM} {TASK_NAME} task, stage one would look like this. You would record a few minutes of the block
            landing in the cup and of misses. The agent would write a check that tells the two apart, and a reset that
            lifts the block out of the cup and sets it back at its starting position. At the commit we checked, the
            ENPIRE repository&apos;s file list has no {ARM} adapter, so you would have to write the robot interface
            yourself.{' '}
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
            description="In ENPIRE, some limits are built into the path to the hardware, and others exist only as a rule in an instruction file. You will learn how to tell the two kinds apart, and why you have to enforce the second kind yourself."
          >
            What the agent may change, and how the limits are enforced
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The repository&apos;s instruction file sets the boundary in one sentence. It says that the agent &quot;may
            improve policy and training code, but it must not change the environment, reset procedure, verifier,
            safety limits, evaluation seeds, or artifact schema.&quot; It adds &quot;Never redefine success inside the
            policy&quot;. It also declares the scoring code read-only, because changing that code &quot;invalidates
            comparison with prior runs&quot;. The paper calls the frozen parts &quot;immutable&quot;. However, we
            checked the repository&apos;s files at one fixed commit, and in those files the rule is only text: nothing
            in them stops the agent from editing the parts the rule protects.{' '}
            <Cite id="F04-8">ENPIRE repository, autoresearch_instruction.md and AGENTS.md</Cite>
          </Box>
          <Box variant="p">
            Inside that boundary, the agent has a lot of freedom. It works in one repository with permission prompts
            switched off, so it runs commands without a person approving each one. It also has unrestricted internet
            access. Data and logs from earlier sessions are removed before a new session starts, so each session begins
            from a clean workspace. This gives the agent wide access inside the repository and narrow access at the
            robot, where the station server&apos;s three calls are the only way to reach the hardware.{' '}
            <Cite id="F04-11">ENPIRE paper, appendix B.1</Cite>
          </Box>
          <Box variant="p">
            Two kinds of limit catch mistakes in the agent&apos;s code. The first kind is the software limits on the
            arm&apos;s position and motion. When the arm crosses one of them, the rollout fails at once and a reset
            starts. Because these limits are code, they are on the list of things the agent must not change. Keep them outside the
            agent&apos;s repository.{' '}
            <Cite id="F04-10">ENPIRE paper, section 2.1</Cite>{' '}
            <Cite id="F04-8">ENPIRE repository, autoresearch_instruction.md</Cite>
          </Box>
          <Box variant="p">
            The second kind is built into the hardware. The gripper&apos;s force limit sits in its actuator, which is
            torque-limited. So when the gripper makes a bad contact, it stalls instead of pushing hard enough to damage
            the hardware. The paper calls this limit essential, because the eight stations run unattended and no
            person is there to step in. The repository&apos;s security notes require &quot;explicit operator
            intent&quot; and &quot;a physical emergency stop within reach&quot; for every real-robot command. Neither
            the paper nor the repository says how that requirement fits stations that run unattended.{' '}
            <Cite id="F04-10">ENPIRE paper, section 2.1 and appendix B.3, and SECURITY.md</Cite>{' '}
            <Cite id="F04-8">ENPIRE repository, autoresearch_instruction.md</Cite>
          </Box>
          <Box variant="p">
            ENPIRE&apos;s simulated tasks show other ways an agent could raise its grade if they were left within its
            reach. To stop the agent from cheating in its simulated kitchen tasks, the environment removes calls such as <code>get_task_info</code>,{' '}
            <code>reset_env</code>, <code>reset_to_initial</code>, task-specific command-line helpers and queries for
            the true target. Each of these calls either leaks the task&apos;s state or gives the agent a free retry.
            Both are ways to raise the grade without a better policy.{' '}
            <Cite id="F04-24">ENPIRE paper, appendix D.1</Cite>
          </Box>
          <Box variant="p">
            Other agent-run loops published in 2026 put the boundary in other places. They also differ in what stands
            between the agent and its grade. In ENPIRE, a written rule stands between them, and how the rule is
            enforced is not published. In SEAR, a benchmark that runs coding agents on robot tasks, a separate process
            stands between them. When you
            assess a loop like these, find out what it puts out of the agent&apos;s reach and who does the grading.
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 640 }}>
              <thead>
                <tr>
                  <th style={TH}>Loop</th>
                  <th style={TH}>What the agent changes</th>
                  <th style={TH}>What is out of the agent&apos;s reach</th>
                  <th style={TH}>Who grades the result</th>
                  <th style={TH}>Source</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>ENPIRE</td>
                  <td style={TD}>The training code, the policy code, the learning method and its settings.</td>
                  <td style={TD}>
                    The environment, reset, verifier, safety limits and evaluation seeds. A written rule protects them,
                    and the repository files we checked show no mechanism that enforces the rule.
                  </td>
                  <td style={TD}>
                    A success check that the agent wrote with a person and then froze, tested against a held-out set.
                  </td>
                  <td style={TD}>
                    <Cite id="F04-8">ENPIRE autoresearch_instruction.md</Cite>{' '}
                    <Cite id="F04-13">ENPIRE paper, appendix A.2</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>ASPIRE, a loop in which the agent writes the policy as a program and trains no weights</td>
                  <td style={TD}>Robot control programs, and repairs that it keeps as text &quot;skills&quot;.</td>
                  <td style={TD}>The robot&apos;s programming interface.</td>
                  <td style={TD}>
                    A second, fresh agent must reproduce a repair from its written description before the repair is
                    kept. ASPIRE&apos;s coordinator checks that only allowed calls were used.
                  </td>
                  <td style={TD}>
                    <Cite id="F04-27">ASPIRE paper v2, overview</Cite>{' '}
                    <Cite id="F04-28">ASPIRE paper v2, skill validation</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    AgenticRobotics (&quot;You Don&apos;t Need To Stay in The Loop&quot;), a preview preprint by a
                    single author
                  </td>
                  <td style={TD}>Analysis and training runs, which disposable worker agents carry out.</td>
                  <td style={TD}>The objective, which cannot be edited.</td>
                  <td style={TD}>
                    A language-model controller that owns the measurement and decides whether to keep a checkpoint.
                  </td>
                  <td style={TD}>
                    <Cite id="F04-34">AgenticRobotics paper v2, abstract and section 1</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>SEAR, a benchmark that runs coding agents on simulated and real robot tasks</td>
                  <td style={TD}>Anything inside its own container.</td>
                  <td style={TD}>The held-out start states and the grading logic.</td>
                  <td style={TD}>
                    A separate judge that receives the frozen policy and &quot;ignores any success the policy
                    claims&quot;.
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
            SEAR&apos;s judge is the clearest published example of this separation. The agent may train and test as
            it likes inside its container. When its budget runs out, its policy is frozen and handed to a judge. The
            judge holds the start states and the grading code, and the agent never touches either of them. When the
            grading runs in a separate process, the grade stays safe whatever code the agent writes. When the grading
            is protected only by a written rule, the grade stays safe only as long as the agent follows the rule.{' '}
            <Cite id="F04-83">SEAR paper, section 2.4, sealed judge</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="An agent's score can rise while the policy stays the same. Three things can cause this: a test that the agent chose itself, a model-based success check that leans toward success, and an evaluation too small to show whether a change helped. For each one, you will learn the measurement that exposes it."
          >
            Three ways an agent&apos;s score can overstate the robot&apos;s skill
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            An agent that works to raise the grade of its success check is an optimiser, and{' '}
            <Link href="../rl-agentic-loops/#reward-proxy">an optimiser finds the cheapest way to a high score</Link>.
            On a robot, one cheap way goes through the reset, because the reset decides which starting states the
            policy is tested from.
            SEAR reports that on a real robot &quot;success in practice overstates success in the test&quot;. The
            reason is that during practice the agent resets the scene itself, and it rarely creates the hard starting
            states that an operator sets up for the test. So keep a set of start states that the agent never chose,
            and score the policy on those. <Cite id="F04-84">SEAR paper, section 4</Cite>
          </Box>
          <Box variant="p">
            Some success checks call a general vision-language model instead of running code. A vision-language model
            is a language model that also reads images. When such a model judges an ambiguous attempt, it tends to call
            the attempt a success. So an agent that optimises against this kind of check is rewarded for the failures
            among the ambiguous attempts. FailBench is a 2026 evaluation of 13 such models on 2,197 real and simulated
            manipulation attempts. It scores the models by balanced accuracy, which is the average of the detection
            rate on successes and the detection rate on failures. A balanced accuracy of 0.5 is no better than chance.
            FailBench found &quot;a systematic bias toward predicting success under ambiguous evidence&quot;.{' '}
            <Cite id="F04-45">FailBench paper, abstract</Cite>
          </Box>
          <Box variant="p">
            You can predict where such a model fails. In the FailBench authors&apos; words, detection &quot;approaches
            saturation when success is determined by observable object motion, but approaches chance when success
            depends on establishing contact&quot;. No model scored above 0.60 on contact-intensive assembly.
            ENPIRE&apos;s check for pin insertion, which is a contact task, does not rely on the camera alone: two of
            its three conditions are the gripper&apos;s height and a force estimate.{' '}
            <Cite id="F04-45">FailBench paper, abstract</Cite>{' '}
            <Cite id="F04-12">ENPIRE paper, figure 9</Cite>
          </Box>
          <Box variant="p">
            The number of evaluation episodes matters most late in a run, when the gains get small. In ENPIRE&apos;s
            eight-agent run on pin insertion, the early gain from the behaviour-cloning term was 10.8 points. After
            it, later ideas such as batch-size tuning (+0.9 points) and controller compensation (+1.3 points) added about one point each. Whether a one-point gain is real depends
            on how many episodes measured it. The project page&apos;s data for the 86 ideas gives each idea&apos;s
            time, its agent and whether it raised the best rate, but no episode count.{' '}
            <Cite id="F04-23">ENPIRE paper, appendix B.6, and project page data</Cite>
          </Box>
          <Box variant="p">
            AgenticRobotics, whose loop runs on one GPU, measured the noise in its own evaluation. At the success rates
            it was measuring, &quot;100 held-out episodes give a +/-9.5-point interval&quot;. A gain is the difference
            between two such rates, so the interval on a gain is wider still. When the two counts are independent, it
            is about{' '}
            <Derived>
              <M>{'9.5\\sqrt{2} \\approx 13.4'}</M>
            </Derived>{' '}
            points. Fixed seeds do not give fixed outcomes either. When the authors re-ran one evaluation with the same
            seeds, the total stayed the same, but 22 of the 100 episodes changed their outcome. Without the episode
            count, you cannot tell whether ENPIRE&apos;s one-point gains are more than noise.{' '}
            <Cite id="F04-36">AgenticRobotics paper v2, section 4</Cite>{' '}
            <Cite id="F04-35">AgenticRobotics paper v2, sections 3.5 and 5</Cite>{' '}
            <Cite id="F04-37">AgenticRobotics paper v2, section 5</Cite>
          </Box>
          <Box variant="p">
            AgenticRobotics adds a gate that stops a new checkpoint from replacing the best one by luck. It needs the
            gate because, when you pick the highest of several noisy scores, that score is likely to be high partly
            by chance. The paper gives its own example: a checkpoint that measured 63% once &quot;pooled to 56.5% over 1,200 episodes, so 63% is a metric-best
            observation, not an estimate of skill&quot;. The gate works as follows. Let <M>w</M> be the half-width of
            the 95% interval on the difference between two success rates. A new checkpoint replaces the best one
            outright only if it beats it by at least <M>{'1.5w'}</M>. A smaller positive gain is kept only if a paired
            test confirms it. A paired test scores both checkpoints on the same episodes.{' '}
            <Cite id="F04-35">AgenticRobotics paper v2, sections 3.5, 4.2 and 5</Cite>
          </Box>
          <Box variant="p">
            The same paper also reports a result against its own design. A selector is a rule that picks which
            checkpoint to keep. On the one training run the paper measured, simply taking the final checkpoint, with
            no measurement at all, beat every selector that used measurements, including its own. The margin was 5.6
            to 10.0 points of held-out success. One run is itself a small sample, so the lesson to take from it is
            narrower. A selector that uses measurements is only useful when each score rests on enough evaluation
            episodes. Keep a change only if its gain is larger than the interval for the number of attempts you
            actually ran.{' '}
            <Cite id="F04-37">AgenticRobotics paper v2, section 5</Cite>
          </Box>
          <Box variant="p">
            AdaRSI is an agent loop that was tested on the {ARM} itself, and it raises the same question about attempt
            counts at a small scale. AdaRSI works on a VLA (vision-language-action model). A VLA is a vision-language
            model with an added action head, which is the part that produces robot actions, as section 5,
            Vision-Language-Action Models, explains. In AdaRSI, a coding agent first rewrites the instructions, tools
            and procedure around a frozen VLA. Then it fine-tunes the model only for the sub-steps that are still
            unreliable. The authors tested the task of placing a toy in a bowl on an{' '}
            {ARM}, with objects, sizes and orientations that the demonstrations did not show. They report that the
            rewrite raised success on those cases from 65% to 100%, with 10 attempts per configuration.{' '}
            <Cite id="F04-85">AdaRSI paper v2, section 5.4 and appendix D</Cite>
          </Box>
          <Box variant="p">
            Ten successes out of ten on one configuration is a strong result, but it is a small count. Section 16,
            Evaluation, uses the 95% Wilson interval. This interval is the range of true success rates that could
            plausibly have produced an observed count. Write <M>n</M> for the number of attempts and <M>z</M> for the
            multiplier that sets the 95% level, <M>{'z = 1.96'}</M>, so <M>{'z^2 \\approx 3.84'}</M>. When every
            attempt succeeds, the lower end of the interval has a simple form: <M>{'n / (n + z^2)'}</M>. For ten
            attempts, the lower end is <Derived>10 / (10 + 3.84) = 0.72</Derived>. So a policy whose true success rate
            is only <Derived>72%</Derived> could plausibly produce the same ten successes.{' '}
            <Cite id="F11-203">LeRobot v0.7.0, eval_stats.py, wilson_interval()</Cite>{' '}
            <Cite id="F06-97">Wilson interval, worked example of section 16</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="A 99% success within eight attempts fits very different first-try rates. You will learn how to work out that range, and why you should measure the first try yourself before you compare two policies."
          >
            What a 99% pass@8 says about the first try
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The pass@1 measure is the first-try rate, which is the number section 16 counts. The pass@8 measure can be
            far above it, and how far depends on how a retry relates to the attempts before it. The authors contrast
            their retries with best-of-N sampling, in which each attempt is a fresh, independent draw. That
            independent case is a useful reference point. Write <M>p</M> for the
            first-try rate. With independent attempts, a rollout fails only if all eight attempts fail, so pass@8 is{' '}
            <M>{'1-(1-p)^8'}</M>. <Cite id="F04-16">ENPIRE paper, section 3</Cite>
          </Box>
          <Box variant="p">
            The authors&apos; project page gives the opposite case: a policy that cannot recover from a failure. Such
            a policy &quot;stays near pass@1 (a 13% policy stays ~13%, not 99%)&quot;. If the same 13% policy made
            independent attempts instead, it would pass <Derived>1 - 0.87^8 = 0.67</Derived> of its rollouts. The only
            difference between the two figures is how the retries behave. The rate is <Derived>67%</Derived> if every
            retry is a fresh draw, and 13% if a retry after a failure almost never succeeds.{' '}
            <Cite id="F04-16">ENPIRE project page and paper, section 3</Cite>
          </Box>
          <Box variant="p">So a 99% pass@8 fits very different policies:</Box>
          <ul style={LIST}>
            <li>
              <strong>Independent retries.</strong> If every retry is a fresh draw, a 99% pass@8 needs a first-try
              rate of <Derived>44</Derived>%.
            </li>
            <li>
              <strong>Retries that add nothing.</strong> If a retry after a failure almost never succeeds, a 99%
              pass@8 needs a first-try rate near 99%.
            </li>
            <li>
              <strong>Retries that do better than first tries.</strong> A first-try rate below <Derived>44</Derived>%
              reaches 99% only if retries succeed more often than first tries.
            </li>
          </ul>
          <Box variant="p">
            The authors attribute the value of their retries to seeing the previous failure. However, the
            paper&apos;s text gives no first-try rate for its final policies, so it does not show where in this range
            the 99% sits.{' '}
            <Cite id="F04-16">ENPIRE paper, section 3</Cite>
          </Box>
          <Box variant="p">
            SEAR&apos;s warning that practice overstates the test probably applies to the 99% as well, because of how
            ENPIRE sets the scene. In stage two, the scene is set by the one reset that was frozen in stage one, and
            that reset returns the scene to the start of the hardest phase of the task. So the 99% covers the task from that phase
            onward. Every rollout starts from a scene that the reset produced, and an operator chose none of them as a
            test.{' '}
            <Cite id="F04-16">ENPIRE paper, abstract</Cite>{' '}
            <Cite id="F04-2">ENPIRE paper, section 2.1</Cite>{' '}
            <Cite id="F04-14">ENPIRE paper, section 2.1 and appendix A.1</Cite>{' '}
            <Cite id="F04-84">SEAR paper, section 4</Cite>
          </Box>
          <Box variant="p">
            The agent&apos;s own goal is also a count: 100% over each window of 50 consecutive episodes. The nine-line
            prompt does not say whether an episode means one attempt or a whole rollout. So meeting the goal does not
            necessarily mean fifty first tries in a row. Counted either way, fifty successes in fifty have a Wilson
            lower end of <Derived>50 / (50 + 3.84) = 0.929</Derived>. So a policy whose true success rate is about{' '}
            <Derived>93%</Derived> could plausibly produce them. To compare a policy trained by an agent with one of
            your own, run first tries from start states the agent never chose, and count them the way section 16
            does. <Cite id="F04-4">ENPIRE paper, appendix B.1, figure 10</Cite>{' '}
            <Cite id="F11-203">LeRobot v0.7.0, eval_stats.py, wilson_interval()</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Going from one agent to eight made ENPIRE faster, but by less than four times, and the robots spent most of their time waiting for the agents. You will see where the time went and learn how to budget tokens, the cost that grew faster than the fleet."
          >
            Scaling to eight agents: speed, idle robots and token cost
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            When agents run the loop, the agents also set its pace. The authors timed fleets of one, four and eight
            agents, with one robot per agent. They measured the time to reach two finish lines. The first is the point
            at which a task first reaches its target. The second is the prompt&apos;s goal of 100% over every window
            of 50 consecutive episodes.{' '}
            <Cite id="F04-4">ENPIRE paper, appendix B.1, figure 10</Cite>
          </Box>
          <Box variant="p">
            On pin insertion, the target for the first finish line was 100% success. The time to reach it fell from
            2.5 hours with one agent to 0.89 hours with four and 0.67 hours with eight. Push-T is a pushing task that is scored from 0 to
            1. On Push-T, the fleets took 4.7, 3.1 and 2.0 hours to reach a score of 1.0. So eight times as many robots
            and agents gave about <Derived>2.5 / 0.67 = 3.7</Derived> times the speed on pin insertion and{' '}
            <Derived>4.7 / 2.0 = 2.4</Derived> times the speed on Push-T, not eight times.{' '}
            <Cite id="F04-18">ENPIRE paper, figure 3 and section 3.3</Cite>
          </Box>
          <Box variant="p">
            Measured against the prompt&apos;s goal, the speed-up is smaller still. On pin insertion, the authors
            report that reaching the goal took 4.5 hours with one agent and 2.0 hours with eight. That is{' '}
            <Derived>4.5 / 2.0 = 2.25</Derived> times faster, compared with <Derived>3.7</Derived> times for the first
            target. <Cite id="F04-20">ENPIRE project page, chart data</Cite>
          </Box>
          <Box variant="p">
            The utilisation figures show why the speed-up stayed so far below eight times. Robot utilisation is the
            share of research wall-clock time during which the robot is running an experiment. GPU utilisation is the same share for the
            station&apos;s GPU. On pin insertion, the authors report robot utilisation of 49.1% with one agent, 30.9%
            with four and 29.8% with eight. Over the same fleet sizes, GPU utilisation rose from 29.4% to 32.5% and
            49.0%. The standard deviations are wide: at eight agents, the GPU figure is 49.0 plus or minus 30.2. With
            eight agents, the robots stood idle for the other <Derived>70</Derived>% of the time.{' '}
            <Cite id="F04-19">ENPIRE project page, utilisation chart data, and paper section 2.2</Cite>
          </Box>
          <Box variant="p">
            The robots were waiting for the agents. A robot waits while its agent reads logs, writes code, debugs, or
            waits for its language model to answer. As the fleet grows, the agents spend more of their time
            summarising each other&apos;s branches and less time operating the robot. As a result, the robots stood
            idle more than half the time at every fleet size. The GPUs were underused too: the authors add that agents
            &quot;may also fail to launch parallel training sessions to exhaust GPU resources&quot;.{' '}
            <Cite id="F04-21">ENPIRE paper, sections 4 and 5.2</Cite>{' '}
            <Cite id="F04-19">ENPIRE project page, utilisation chart data</Cite>
          </Box>
          <Box variant="p">
            The robot-access budget that the authors call the limiting resource is a count. It is the number of real
            attempts that each idea may use, and the operator approves that number in advance. Because the count is
            fixed in advance, an idea cannot use more real attempts than the approved number, even while the robot
            sits idle.{' '}
            <Cite id="F04-21">ENPIRE paper, sections 4 and 5.2</Cite>{' '}
            <Cite id="F04-9">ENPIRE repository, autoresearch_instruction.md</Cite>
          </Box>
          <Box variant="p">
            Once you know where the loop waits, you can work out what it needs from each machine. The agent itself is
            a remote inference workload. It consumes tokens from a hosted language model, and most of those tokens are context
            it has sent before. On the station, the agent reads logs, writes code and pushes to Git, which is work for
            a CPU and a disk. The GPU works in bursts, when a training run or the reset&apos;s detection and
            motion-planning models run. At every fleet size the authors tested, the GPU was idle more than half the
            time. If you host the agent&apos;s language model yourself, that model becomes a language-model serving
            job, the kind of workload that the <Link href="../vllm/">vLLM dive</Link> sizes.{' '}
            <Cite id="F04-19">ENPIRE project page, utilisation chart data</Cite>{' '}
            <Cite id="F04-14">ENPIRE paper, appendix A.1</Cite>{' '}
            <Cite id="F04-22">ENPIRE paper, appendix C.2</Cite>
          </Box>
          <Figure
            cites="F04-18 F04-19 F04-20"
            caption={
              <>
                Each group of bars shows one ENPIRE fleet size on pin insertion. The top panel shows that, as agents
                are added, the robot runs experiments for a smaller share of the time and the GPU is in use for a
                larger share. The middle and bottom panels show that the fleet reaches the prompt&apos;s goal sooner
                and uses more tokens to do it. These hours are longer than the times to first reach the target,
                because the prompt&apos;s goal is the later finish line.
              </>
            }
          >
            <FleetChart />
          </Figure>
          <Box variant="p">
            Token use is the cost that grows fastest. The authors report 9,269 tokens per minute with one agent, 40,029
            with four and 140,310 with eight. So eight times as many agents used <Derived>15</Derived> times the tokens
            per minute, which is <Derived>1.9</Derived> times what eight copies of the single agent would use. The
            tokens used to reach the goal rose from 2.5 million to 16.8 million, while the time fell from 4.5 to 2.0
            hours. That is <Derived>6.7</Derived> times the tokens for <Derived>2.25</Derived> times the speed. In the
            authors&apos; words, larger fleets &quot;reach success sooner, but require a disproportionately higher
            token budget&quot;. <Cite id="F04-20">ENPIRE project page, token chart data, and paper section 4</Cite>
          </Box>
          <Box variant="p">
            These figures may leave out most of the tokens an agent sends. On a simplified real Push-T task, one agent
            used 80M tokens in total: 77M of cached input, 2.4M of fresh input and 0.27M of output. Cached input is
            context that the model provider has already processed on an earlier call and reads again. So about{' '}
            <Derived>77 / 80 = 96%</Derived> of the tokens are the agent sending its own history again.{' '}
            <Cite id="F04-22">ENPIRE paper, appendix C.2, figure 13</Cite>
          </Box>
          <Box variant="p">
            The paper does not say whether the fleet figures count cached input, and its numbers suggest that they do
            not. The fleet chart gives one agent 2.5 million tokens to reach the goal on pin insertion. The Push-T agent
            used 80M tokens in total, but the paper gives its uncached work as 2.6M, which is close to the
            chart&apos;s figure. The two runs are on different tasks, so the match is a hint, not proof. When you
            budget, start from the full token count, and price the cached share at your provider&apos;s cached-input
            rate. That rate applies to about 96% of the tokens, so it has a large effect on the bill.{' '}
            <Cite id="F04-22">ENPIRE paper, appendix C.2, figure 13</Cite>
          </Box>
          <Box variant="p">
            Because the robots wait for the agents, the choice of agent program and language model also changes the
            pace. On the same simplified task, the ENPIRE authors timed three pairings of agent program and model,
            with one run each. The first success came after 54.41 minutes with Codex driving GPT-5.5, after 62.01
            minutes with Claude Code driving Opus 4.7, and after 105.00 minutes with Codex driving Opus 4.7. The
            slowest pairing took <Derived>105.00 / 54.41 = 1.9</Derived> times as long as the fastest.{' '}
            <Cite id="F04-25">ENPIRE paper, appendix C.4</Cite>
          </Box>
          <Box variant="p">
            How the agent receives the camera images also matters. The authors varied this for a Codex agent and timed
            each setup: 54.67 minutes with images in the model&apos;s own input, 72.32 minutes with no images, and 99.18
            minutes with images available only through a tool that the agent had to call. Each figure is one
            run on one simplified task, so treat the gaps as indicative only. The authors suggest why no images did
            better than the image tool: the agent can infer the task&apos;s state from its logs, while repeated calls
            to an image tool add overhead.{' '}
            <Cite id="F04-25">ENPIRE paper, appendix C.3 and C.4</Cite>
          </Box>
          <Box variant="p">
            On 10 simulated tasks, the ASPIRE authors report that the same loop scored anywhere from 14.8% to 99.2%,
            depending only on which language model drove it. So test the language model and the agent program
            together on your own task before you tune anything else.{' '}
            <Cite id="F04-30">ASPIRE paper v2, section 3.8 and table 18</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="On a shared cluster, you have to configure the limits that the station's hardware used to provide. You will learn where to put the grade, the job timeout, the capacity ceiling and the robot itself so that the agent's credentials cannot change them. The steps come in the order you need them before the agent's first unattended night."
          >
            Running the loop on shared AWS capacity with limits the agent cannot edit
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The published loops limit compute through their fixed hardware. Their budgets are limits that an operator
            sets, such as ENPIRE&apos;s number of approved real-robot attempts and AgenticRobotics&apos; required timeout on
            every tool call. Neither of these two loops lets the agent choose its hardware. Neither publishes a
            GPU-hour or token budget that is enforced on the agent.{' '}
            <Cite id="F04-49">ENPIRE autoresearch_instruction.md and the AgenticRobotics paper</Cite>
          </Box>
          <Box variant="p">
            When you move the loop onto a shared queue, the physical limit disappears. The agent becomes a tenant,
            which means one more user that submits jobs to hardware that other people also use. The agent is an
            unusual tenant. Its GPU work arrives in bursts of short training runs, and most of those runs are thrown
            away: in ENPIRE&apos;s eight-agent run, 58 of the 86 ideas gave no gain. Its steady demand is tokens from a
            model served elsewhere. The station provided some limits through its hardware alone, such as one GPU per
            robot. On a shared queue, each of those limits has to be configured instead, and that configuration has to
            sit outside the repository the agent edits and outside what the agent&apos;s credentials can write. The
            design that follows is ours. We built it from AWS documentation, and it is not a robotics pattern that AWS
            documents.{' '}
            <Cite id="F04-48" kind="our-reading">ENPIRE, AgenticRobotics and ASPIRE resource figures</Cite>{' '}
            <Cite id="F04-23">ENPIRE paper, appendix B.6</Cite>{' '}
            <Cite id="F04-52">AWS Batch User Guide, resource-aware scheduling</Cite>
          </Box>
          <Box variant="p">
            Start with the grade, because the grade is what the agent works to raise. The grade has two parts. The
            first part is the success check, whose verdicts the agent trains against. Put the success check, the reset
            and the safety limits outside the repository the agent edits. Set up the agent&apos;s credentials so that
            they can read the check&apos;s verdicts but cannot change its code. The second part is the final judge.
            Run it the way SEAR runs its judge: as a separate job that receives the frozen policy, holds the evaluation start states,
            and returns only the verdict. <Cite id="F04-83">SEAR paper, section 2.4, sealed judge</Cite>{' '}
            <Cite id="F04-8">ENPIRE repository, autoresearch_instruction.md</Cite>
          </Box>
          <Box variant="p">
            AWS Batch, which is AWS&apos;s managed job queue, is a good fit for the agent&apos;s GPU jobs. Batch runs
            each job in a container on instances that it starts. It offers the three limits these jobs need: a time
            limit per job, a ceiling on total capacity, and a count that stops two jobs from using the same robot at
            once. Each of these limits restrains the agent only if it is set at a step that the agent cannot edit.
          </Box>
          <Box variant="p">
            Set the time limit first, because Batch sets no time limit by default, and a job without one runs until
            its container exits. As a reference point, ENPIRE&apos;s agents spent about{' '}
            <Derived>3.4 x 60 x 8 / 86 = 19</Derived> agent-minutes per idea, including robot time and training time.
            A training job that runs for hours would be far out of step with that pace. So set the timeout from the
            longest training run that one idea should need.{' '}
            <Cite id="F04-50">AWS Batch User Guide, job timeouts</Cite>{' '}
            <Cite id="F04-23">ENPIRE paper, appendix B.6</Cite>
          </Box>
          <Box variant="p">
            The timeout setting is <code>attemptDurationSeconds</code>. When a job reaches the limit, Batch sends its
            container SIGTERM and, 30 seconds later, SIGKILL. So a training job that handles SIGTERM has about 30
            seconds to save a checkpoint. A job that is ended this way is not retried. The timeout can be set in the
            job definition or passed with the submission. Because whoever submits a job can pass a timeout with it,
            the timeout restrains the agent only if the agent&apos;s submissions pass through a step that sets the
            timeout and that the agent cannot edit. In this design, that step is a small submit service that you run. Only the submit service holds credentials that can submit to
            the queue, and it sets the job definition and the timeout on every job that the agent asks for.{' '}
            <Cite id="F04-50">AWS Batch User Guide, job timeouts</Cite>
          </Box>
          <Box variant="p">
            The capacity ceiling is the compute environment&apos;s <code>maxvCpus</code> setting. It is the largest
            number of vCPUs that the environment may run at once. It limits GPUs only indirectly, through the instance
            types that the environment is allowed to launch.{' '}
            <Cite id="F10-3">AWS Batch API Reference, ComputeResource</Cite>
          </Box>
          <Box variant="p">
            Amazon EKS (Elastic Kubernetes Service) is AWS&apos;s managed Kubernetes. If the agent&apos;s jobs run on
            EKS, you can cap the number of GPUs directly with Karpenter. Karpenter is the node autoscaler that launches
            the cluster&apos;s nodes. To set the cap, you put <code>nvidia.com/gpu</code> in a NodePool&apos;s{' '}
            <code>spec.limits</code>. With no limit set, the only cap is the account&apos;s EC2 quota. Karpenter
            launches nodes in parallel, and its limit check is only eventually consistent, so a fast burst of agent
            jobs can go over the limit. Treat the Karpenter limit as a backstop, and set the exact ceiling at the
            submit step.{' '}
            <Cite id="F10-407">Karpenter v1.15.3 docs, NodePool limits</Cite>
          </Box>
          <Box variant="p">
            The third limit is the robot itself, and no instance setting provides it: one physical robot can run only
            one experiment at a time. This limit matters once robot attempts are also submitted as jobs, each of which
            calls the station&apos;s local server. Batch has consumable resources for this kind of limit. A consumable resource
            is a counted resource, such as a licence token, and a job that declares one waits until it is free. Model
            each station as one consumable resource with a count of one. Then no two jobs that declare it can drive the
            same robot at the same time. The submit service adds the declaration to every robot job, so the agent
            cannot leave it out.{' '}
            <Cite id="F04-52">AWS Batch User Guide, resource-aware scheduling</Cite>
          </Box>
          <Box variant="p">
            Consumable resources also work with fair-share scheduling. Fair-share scheduling divides a queue among
            teams or agents by weight. Use it to stop a burst of agent jobs from starving the jobs that people submit.
            Fair-share scheduling only divides capacity in proportion, and its documentation names no GPU-hour cap. So
            leave the ceiling to <code>maxvCpus</code> and to the submit step.{' '}
            <Cite id="F04-52">AWS Batch User Guide, resource-aware scheduling</Cite>{' '}
            <Cite id="F04-51">AWS Batch User Guide, fair-share scheduling</Cite>
          </Box>
          <Box variant="p">
            The agent&apos;s own process runs code that a language model wrote. ENPIRE runs that process with
            permission prompts off and with unrestricted internet access. So the process needs stronger isolation
            than a separate repository gives. This design runs it on one of two kinds of AWS host. Neither host keeps
            the agent away from the success check or the judge, because that depends on what the agent&apos;s credentials can write.{' '}
            <Cite id="F04-11">ENPIRE paper, appendix B.1</Cite>
          </Box>
          <Box variant="p">
            The first host is a Nitro Sandbox on EKS. AWS announced Nitro Sandboxes on 9 November 2026. A Nitro
            Sandbox runs each pod or task in its own Firecracker microVM. A microVM is a lightweight virtual machine,
            and each one has its own Linux kernel. AWS presents the feature as a way to &quot;safely execute
            LLM-generated code&quot;. A pod opts in by setting <code>runtimeClassName</code> to{' '}
            <code>isolated-sandbox</code>, on Kubernetes 1.36 or later. The isolated mode exists to &quot;Protect the
            node and other pods from a compromised workload&quot;.{' '}
            <Cite id="F09-43">AWS What&apos;s New post and EKS User Guide, Nitro Sandboxes</Cite>{' '}
            <Cite id="F09-44">EKS User Guide, Auto Mode release notes</Cite>
          </Box>
          <Box variant="p">
            The sandbox&apos;s network-isolation annotation is all or nothing. When it is set, the sandbox boots with
            no network device. That would also cut the agent off from its language model and from Git. So the
            agent&apos;s sandbox has to keep a network, and you have to design separately which destinations that network may
            reach. <Cite id="F09-43">EKS User Guide, Nitro Sandboxes</Cite>
          </Box>
          <Box variant="p">
            The other limitation of a Nitro Sandbox is the GPU. On accelerated instances, a sandbox &quot;runs CPU
            workloads only&quot;, and GPU passthrough &quot;is currently unavailable&quot;. So the agent&apos;s work
            has to be split in two. The agent&apos;s own work, such as editing code, running unit tests and reading
            logs, runs inside the sandbox. The training jobs that the agent launches run outside the sandbox, as Batch jobs with a timeout
            and a capacity ceiling. The submit step between the two is where those limits are set.{' '}
            <Cite id="F09-45">EC2 User Guide, Nitro Sandboxes, considerations and limitations</Cite>
          </Box>
          <Box variant="p">
            The second host is Amazon Bedrock AgentCore Runtime, which is AWS&apos;s managed service for running
            agents. Choose it when you would rather not run the cluster yourself. A session on its microVMs ends after
            at most 8 hours. An idle session ends after 15 minutes by default. So if the session sees no activity
            while its agent waits for a training job, it ends after 15 minutes, long before the 8-hour limit. Raise
            that default for an agent that waits on jobs.{' '}
            <Cite id="F04-53">AgentCore Developer Guide, quotas</Cite>
          </Box>
          <Box variant="p">
            A campaign is the whole run of ideas toward the goal. The 8-hour limit matters for a campaign, because a
            campaign can last longer than one agent session. In ENPIRE&apos;s comparison of coding agents, which is a
            separate experiment from the fleet timings, one agent ran for 8 hours on Push-T and for 4 hours on pin insertion.
            AgenticRobotics&apos; published campaign ran over five calendar days. ENPIRE keeps its state in Git, which
            outlasts any session. Keep the campaign&apos;s state outside the session in the same way, so that the end
            of a session does not end the campaign.{' '}
            <Cite id="F04-53">AgentCore Developer Guide, quotas</Cite>{' '}
            <Cite id="F04-17">ENPIRE project page, figure 3 data</Cite>{' '}
            <Cite id="F04-36">AgenticRobotics paper v2, section 4</Cite>{' '}
            <Cite id="F04-7">ENPIRE paper, section 2.2</Cite>
          </Box>
          <Box variant="p">Before an agent&apos;s first unattended night, do these four things:</Box>
          <ol style={LIST}>
            <li>
              Put the success check, the judge, the reset, the evaluation start states and the safety limits where the
              agent&apos;s credentials cannot write.
            </li>
            <li>Give every job that the agent submits a timeout, through a step that the agent cannot edit.</li>
            <li>From the first run, log robot utilisation, GPU utilisation and tokens per minute.</li>
            <li>
              Measure the policy&apos;s first-try rate on start states that the agent never chose. That rate is the
              number to compare across policies, because with independent tries a first-try rate of{' '}
              <Derived>44</Derived>% is already enough for 99% within eight attempts.{' '}
              <Cite id="F04-16">ENPIRE paper, section 3</Cite>
            </li>
          </ol>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
