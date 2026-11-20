import type { CSSProperties, ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { Cite, Derived } from '../components/Cite';
import { AnimatedFigure } from '../components/Figure';
import { Placeholder, Snippet } from '../components/Blocks';
import { ARM, TASK_STORY } from '../lib/task';

/* Palette shared across the dive (revamp/diagram-plan.md, section 1). */
const INK = '#16191f';
const NEUTRAL_INK = '#5f6b7a';
const EMPHASIS = '#0972d3';
const TENSOR_FILL = '#e6f6ea';
const TENSOR_INK = '#1e7b3a';
const STORE_FILL = '#eef0f2';
const STORE_INK = '#44505c';
const ROBOT_FILL = '#fff6d6';
const ROBOT_INK = '#7a5c00';
const FAIL_FILL = '#fde8ef';
const FAIL_INK = '#a8274f';

/** Keeps a narrow, phone-first drawing from growing oversized on a wide screen. */
const NARROW: CSSProperties = { maxWidth: 520, margin: '0 auto' };

const LIST: CSSProperties = { margin: 0, paddingLeft: 22 };
const TH: CSSProperties = { textAlign: 'left', padding: '6px 10px', borderBottom: '2px solid #5f6b7a', verticalAlign: 'bottom' };
const TD: CSSProperties = { padding: '6px 10px', borderBottom: '1px solid #d5dbdb', verticalAlign: 'top' };

/** The thread task, stated once for this section. */
const TASK_SENTENCE = `Each station is an ${ARM} arm that must ${TASK_STORY}, with a small computer beside it running the policy.`;

function shown(show: boolean, reduced: boolean): CSSProperties {
  return { opacity: show ? 1 : 0, transition: reduced ? 'none' : 'opacity 400ms ease' };
}

function moved(x: number, y: number, reduced: boolean): CSSProperties {
  return { transform: `translate(${x}px, ${y}px)`, transition: reduced ? 'none' : 'transform 700ms ease' };
}

interface FlowBox {
  y: number;
  h: number;
  title: string;
  fill: string;
  ink: string;
}

function BoxFrame({ box, x, w, active }: { box: FlowBox; x: number; w: number; active: boolean }) {
  return (
    <g>
      <rect
        x={x}
        y={box.y}
        width={w}
        height={box.h}
        rx={6}
        fill={box.fill}
        stroke={active ? EMPHASIS : box.ink}
        strokeWidth={active ? 2.5 : 1.2}
      />
      <text x={x + 12} y={box.y + 21} fontSize={13} fontWeight={700} fill={box.ink}>
        {box.title}
      </text>
    </g>
  );
}

function DownArrow({ x, y0, y1 }: { x: number; y0: number; y1: number }) {
  return (
    <g>
      <line x1={x} y1={y0} x2={x} y2={y1 - 6} stroke={NEUTRAL_INK} strokeWidth={1.5} />
      <path d={`M${x - 5} ${y1 - 7} L${x + 5} ${y1 - 7} L${x} ${y1} Z`} fill={NEUTRAL_INK} />
    </g>
  );
}

/* ------------------------------------------------------------------------ */
/* Diagram 18.1 (animated): a staged rollout, with the abort case            */
/* ------------------------------------------------------------------------ */

const ROLLOUT_STEPS = [
  'A new policy version is ready: an image in the registry, and a component version that names it by digest.',
  'A deployment targets the canary thing group, a few arms chosen to go first. An IoT job carries it.',
  'Each canary downloads the image. The nucleus asks the running policy component whether it is safe to update, waits 60 seconds by default, then starts the new version.',
  'The gate: each canary reports RUNNING or ERRORED. Nothing wider starts until this reads well.',
  'The rollout widens to the fleet group, and the rate grows only as successes are reported.',
  'The abort case: failures cross the threshold and the job cancels the arms still queued. The seven that already updated stay updated until a new deployment pins the old version.',
];

const RO_X = 12;
const RO_W = 376;
const RO_BOXES: FlowBox[] = [
  { y: 10, h: 58, title: 'Amazon S3 and the container registry', fill: STORE_FILL, ink: STORE_INK },
  { y: 90, h: 58, title: 'Deployment (an IoT job underneath)', fill: '#ffffff', ink: NEUTRAL_INK },
  { y: 170, h: 96, title: 'Canary thing group', fill: ROBOT_FILL, ink: ROBOT_INK },
  { y: 288, h: 58, title: 'Gate: health reported to the cloud', fill: '#ffffff', ink: NEUTRAL_INK },
  { y: 368, h: 186, title: 'Fleet thing group', fill: ROBOT_FILL, ink: ROBOT_INK },
];
/** Where the travelling dot rests at each step (viewBox units). */
const RO_DOT_Y = [39, 119, 191, 317, 389, 389];
/** Which box carries the emphasis stroke at each step. */
const RO_ACTIVE = [0, 1, 2, 3, 4, 4];

type DeviceState = 'old' | 'asked' | 'new' | 'failed' | 'cancelled';

function Device({ x, y, state, reduced }: { x: number; y: number; state: DeviceState; reduced: boolean }) {
  const size = 26;
  const fill = state === 'new' ? TENSOR_FILL : state === 'failed' ? FAIL_FILL : state === 'cancelled' ? '#ffffff' : '#ffffff';
  const stroke =
    state === 'new' ? TENSOR_INK : state === 'failed' ? FAIL_INK : state === 'asked' ? EMPHASIS : state === 'cancelled' ? NEUTRAL_INK : ROBOT_INK;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={size}
        height={size}
        rx={4}
        fill={fill}
        stroke={stroke}
        strokeWidth={state === 'asked' ? 2.5 : 1.5}
        strokeDasharray={state === 'cancelled' ? '4 3' : undefined}
        style={{ transition: reduced ? 'none' : 'fill 400ms ease, stroke 400ms ease' }}
      />
      {/* A tick for the new policy, a cross for a failure: colour is never the only carrier. */}
      <path
        d={`M${x + 6} ${y + 14} L${x + 11} ${y + 19} L${x + 20} ${y + 8}`}
        fill="none"
        stroke={TENSOR_INK}
        strokeWidth={2}
        style={shown(state === 'new', reduced)}
      />
      <path
        d={`M${x + 7} ${y + 7} L${x + 19} ${y + 19} M${x + 19} ${y + 7} L${x + 7} ${y + 19}`}
        fill="none"
        stroke={FAIL_INK}
        strokeWidth={2}
        style={shown(state === 'failed', reduced)}
      />
    </g>
  );
}

function fleetState(index: number, step: number): DeviceState {
  if (step < 4) return 'old';
  if (index < 7) return 'new';
  if (step === 4) return 'old';
  return index < 9 ? 'failed' : 'cancelled';
}

function LegendItem({ x, y, state, label }: { x: number; y: number; state: DeviceState; label: string }) {
  const fill = state === 'new' ? TENSOR_FILL : state === 'failed' ? FAIL_FILL : '#ffffff';
  const stroke = state === 'new' ? TENSOR_INK : state === 'failed' ? FAIL_INK : state === 'cancelled' ? NEUTRAL_INK : ROBOT_INK;
  return (
    <g>
      <rect x={x} y={y - 11} width={12} height={12} rx={2} fill={fill} stroke={stroke} strokeWidth={1.5} strokeDasharray={state === 'cancelled' ? '3 2' : undefined} />
      <text x={x + 18} y={y} fontSize={12} fill={INK}>
        {label}
      </text>
    </g>
  );
}

function RolloutDiagram({ step, reduced }: { step: number; reduced: boolean }) {
  const canary: DeviceState = step < 2 ? 'old' : step === 2 ? 'asked' : 'new';
  const tx = RO_X + 12;
  return (
    <div style={NARROW}>
      <svg viewBox="0 0 400 566" role="img" aria-labelledby="fleet-rollout-title" style={{ width: '100%', height: 'auto' }}>
        <title id="fleet-rollout-title">A new policy version travelling through a staged rollout, with the abort case</title>
        <desc>
          Five boxes from top to bottom: storage, a deployment, a canary thing group of three devices, a health gate and a fleet
          thing group of twenty devices. A dot moves down one box per step. In the last step seven fleet devices run the new
          policy, two have failed and eleven queued devices are cancelled.
        </desc>
        <rect x={0} y={0} width={400} height={566} fill="#fbfbfd" />
        <g fontFamily="sans-serif">
          {RO_BOXES.map((box, i) => (
            <BoxFrame key={box.title} box={box} x={RO_X} w={RO_W} active={RO_ACTIVE[step] === i} />
          ))}
          <DownArrow x={200} y0={68} y1={90} />
          <DownArrow x={200} y0={148} y1={170} />
          <DownArrow x={200} y0={266} y1={288} />
          <DownArrow x={200} y0={346} y1={368} />

          <text x={tx} y={50} fontSize={12} fill={INK}>
            policy 1.5.0: one image, pinned by digest
          </text>
          <text x={tx} y={130} fontSize={12} fill={INK}>
            one target group; a rate, an abort rule, a timeout
          </text>

          {/* Canary group: three devices and what they are doing. */}
          <text x={tx} y={208} fontSize={12} fill={INK}>
            three arms that take the update first
          </text>
          {[0, 1, 2].map((i) => (
            <Device key={i} x={tx + i * 36} y={222} state={canary} reduced={reduced} />
          ))}
          <text x={146} y={240} fontSize={12} fill={INK} style={shown(step < 2, reduced)}>
            running policy 1.4.0
          </text>
          <text x={146} y={240} fontSize={12} fontWeight={700} fill={EMPHASIS} style={shown(step === 2, reduced)}>
            asked first; default wait 60 s
          </text>
          <text x={146} y={240} fontSize={12} fill={TENSOR_INK} style={shown(step > 2, reduced)}>
            running policy 1.5.0
          </text>

          <text x={tx} y={328} fontSize={12} fill={INK}>
            each device reports RUNNING or ERRORED
          </text>

          {/* Fleet group: twenty devices in two rows. */}
          <text x={tx} y={406} fontSize={12} fill={INK} style={shown(step < 4, reduced)}>
            twenty arms, still on policy 1.4.0
          </text>
          <text x={tx} y={406} fontSize={12} fontWeight={700} fill={EMPHASIS} style={shown(step === 4, reduced)}>
            the rate grows as successes are reported
          </text>
          <text x={tx} y={406} fontSize={12} fontWeight={700} fill={FAIL_INK} style={shown(step === 5, reduced)}>
            abort: queued arms cancelled, updated arms stay
          </text>
          {Array.from({ length: 20 }, (_, i) => (
            <Device key={i} x={25 + (i % 10) * 36} y={420 + Math.floor(i / 10) * 36} state={fleetState(i, step)} reduced={reduced} />
          ))}
          <LegendItem x={25} y={514} state="old" label="old policy" />
          <LegendItem x={205} y={514} state="new" label="new policy" />
          <LegendItem x={25} y={536} state="failed" label="failed" />
          <LegendItem x={205} y={536} state="cancelled" label="cancelled while queued" />

          {/* The travelling dot: the new policy version. */}
          <circle cx={0} cy={0} r={7} fill={EMPHASIS} style={moved(366, RO_DOT_Y[step], reduced)} />
        </g>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Diagram 18.2 (animated): episodes travelling back, and the loop closing   */
/* ------------------------------------------------------------------------ */

const BACK_STEPS = [
  'The arm finishes an episode. Its rows and video sit as files on the disk beside the arm.',
  'At the episode boundary an upload component sends the files to Amazon S3 in parts.',
  'In the bucket they join the episodes from every other arm: the fleet writes one dataset.',
  'Curation and training run on it. In the one published fleet loop cited here, an episode reached the learner in 41 s at the median.',
  'Training publishes a new policy version. In that same loop a new model reached a robot in 38 s at the median.',
  'The new version returns through the staged rollout of the previous figure, and the next episodes are recorded under it. The loop has closed.',
];

const BK_X = 12;
const BK_W = 330;
const BK_BOXES: FlowBox[] = [
  { y: 10, h: 58, title: 'Device disk beside the arm', fill: ROBOT_FILL, ink: ROBOT_INK },
  { y: 90, h: 58, title: 'Upload component', fill: STORE_FILL, ink: STORE_INK },
  { y: 170, h: 58, title: 'Amazon S3: the dataset', fill: STORE_FILL, ink: STORE_INK },
  { y: 250, h: 58, title: 'Curation and training', fill: TENSOR_FILL, ink: TENSOR_INK },
  { y: 330, h: 58, title: 'New policy version published', fill: '#ffffff', ink: NEUTRAL_INK },
];
const BK_SUBS = [
  'one episode: Parquet rows + MP4 video',
  'sends the files at the episode boundary',
  'episodes from every arm in the fleet',
  'one fleet, median: 41 s arm to learner',
  'one fleet, median: 38 s back to a robot',
];
const BK_DOT_Y = [39, 119, 199, 279, 359, 39];
const BK_ACTIVE = [0, 1, 2, 3, 4, 0];

function EpisodesBackDiagram({ step, reduced }: { step: number; reduced: boolean }) {
  const closed = step === 5;
  return (
    <div style={NARROW}>
      <svg viewBox="0 0 400 440" role="img" aria-labelledby="fleet-back-title" style={{ width: '100%', height: 'auto' }}>
        <title id="fleet-back-title">Episodes travelling from the device disk to Amazon S3 and training, and a new policy returning</title>
        <desc>
          Five boxes from top to bottom: the device disk, an upload component, the dataset in Amazon S3, curation and training,
          and a new policy version. A dot moves down one box per step. In the last step a line runs up the right side from the
          new policy version back to the device.
        </desc>
        <rect x={0} y={0} width={400} height={440} fill="#fbfbfd" />
        <g fontFamily="sans-serif">
          {BK_BOXES.map((box, i) => (
            <g key={box.title}>
              <BoxFrame box={box} x={BK_X} w={BK_W} active={BK_ACTIVE[step] === i} />
              <text x={BK_X + 12} y={box.y + 40} fontSize={12} fill={INK}>
                {BK_SUBS[i]}
              </text>
            </g>
          ))}
          <DownArrow x={177} y0={68} y1={90} />
          <DownArrow x={177} y0={148} y1={170} />
          <DownArrow x={177} y0={228} y1={250} />
          <DownArrow x={177} y0={308} y1={330} />

          {/* The return path up the right side: drawn faint, then emphasised when the loop closes. */}
          <path
            d="M342 359 H372 V39 H352"
            fill="none"
            stroke={closed ? EMPHASIS : NEUTRAL_INK}
            strokeWidth={closed ? 2.5 : 1.2}
            strokeDasharray={closed ? undefined : '5 4'}
          />
          <path d="M352 33 L352 45 L342 39 Z" fill={closed ? EMPHASIS : NEUTRAL_INK} />

          <text x={200} y={412} fontSize={12} textAnchor="middle" fill={INK} style={shown(!closed, reduced)}>
            dashed line: the way back to the arm
          </text>
          <text x={200} y={412} fontSize={12} fontWeight={700} textAnchor="middle" fill={EMPHASIS} style={shown(closed, reduced)}>
            back to the arm through the staged rollout
          </text>
          <text x={200} y={428} fontSize={12} textAnchor="middle" fill={INK} style={shown(closed, reduced)}>
            the next episodes are recorded under the new policy
          </text>

          <circle cx={0} cy={0} r={7} fill={EMPHASIS} style={moved(318, BK_DOT_Y[step], reduced)} />
        </g>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Snippets, verbatim from the pinned first-party pages                      */
/* ------------------------------------------------------------------------ */

const RECIPE = String.raw`RecipeFormatVersion: '2020-01-25'
ComponentName: com.example.MyPrivateDockerComponent
ComponentVersion: '1.0.0'
ComponentDescription: 'A component that runs a Docker container from a private Amazon ECR image.'
ComponentPublisher: Amazon
ComponentDependencies:
  aws.greengrass.DockerApplicationManager:
    VersionRequirement: ~2.0.0
  aws.greengrass.TokenExchangeService:
    VersionRequirement: ~2.0.0
Manifests:
  - Platform:
      os: all
    Lifecycle:
        Run: docker run account-id.dkr.ecr.region.amazonaws.com/repository[:tag|@digest]
    Artifacts:
      - URI: "docker:account-id.dkr.ecr.region.amazonaws.com/repository[:tag|@digest]"`;

const DEPLOYMENT_DOC = String.raw`{
  "targetArn": "targetArn",
  "deploymentName": "deploymentName",
  "components": {
    "com.example.IndustrialDashboard": {
      "componentVersion": "1.0.0",
      "configurationUpdate": {
        "reset": [
          "/network/useHttps",
          "/tags"
        ],
        "merge": "{\"tags\":[\"/boiler/1/temperature\",\"/boiler/1/pressure\",\"/boiler/2/temperature\",\"/boiler/2/pressure\"]}"
      }
    }
  },
  "deploymentPolicies": {
    "componentUpdatePolicy": {
      "action": "NOTIFY_COMPONENTS",
      "timeoutInSeconds": 30
    },
    "configurationValidationPolicy": {
      "timeoutInSeconds": 60
    },
    "failureHandlingPolicy": "ROLLBACK"
  },
  "iotJobConfiguration": {
    "abortConfig": {
      "criteriaList": [
        {
          "action": "CANCEL",
          "failureType": "ALL",
          "minNumberOfExecutedThings": 100,
          "thresholdPercentage": 5
        }
      ]
    },
    "jobExecutionsRolloutConfig": {
      "exponentialRate": {
        "baseRatePerMinute": 5,
        "incrementFactor": 2,
        "rateIncreaseCriteria": {
          "numberOfNotifiedThings": 10,
          "numberOfSucceededThings": 5
        }
      },
      "maximumPerMinute": 50
    },
    "timeoutConfig":  {
      "inProgressTimeoutInMinutes": 5
    }
  }
}`;

/* ------------------------------------------------------------------------ */
/* Tables                                                                    */
/* ------------------------------------------------------------------------ */

interface VocabRow {
  term: string;
  vendor: ReactNode;
  arm: ReactNode;
  cite: ReactNode;
}

const VOCAB: VocabRow[] = [
  {
    term: 'Thing',
    vendor: <>&quot;An AWS IoT thing is a representation of a specific device or logical entity.&quot;</>,
    arm: 'The cloud record of the computer beside one arm.',
    cite: <Cite id="F07-121">Greengrass developer guide, How it works</Cite>,
  },
  {
    term: 'Core device',
    vendor: <>&quot;A Greengrass core device is an AWS IoT thing.&quot;</>,
    arm: 'A thing that runs the Greengrass software: the Jetson beside the arm, or a DGX Spark on the desk.',
    cite: <Cite id="F07-121">Greengrass developer guide, How it works</Cite>,
  },
  {
    term: 'Nucleus',
    vendor: (
      <>
        &quot;a mandatory component and the minimum requirement to run the AWS IoT Greengrass Core software on a
        device&quot;
      </>
    ),
    arm: (
      <>
        The agent program on the device (section 17): a Java program that needs at least 96 MB of RAM, or nucleus
        lite, small C daemons documented at less than 15 MB.
      </>
    ),
    cite: (
      <>
        <Cite id="F07-84">Greengrass developer guide, Greengrass nucleus</Cite>{' '}
        <Cite id="F07-85">Greengrass developer guide, Greengrass nucleus lite</Cite>
      </>
    ),
  },
  {
    term: 'Component',
    vendor: (
      <>
        &quot;All software that is developed and deployed with AWS IoT Greengrass is modeled as a component.&quot; It
        is a recipe, &quot;A JSON or YAML file that describes the software module by defining component details,
        configuration, and parameters&quot;, plus artifacts, &quot;The source code, binaries, or scripts that define
        the software that will run on your device&quot;.
      </>
    ),
    arm: 'The policy is one versioned component whose recipe names the container image and how to start it. An episode uploader is a second one.',
    cite: <Cite id="F07-122">Greengrass developer guide, How it works</Cite>,
  },
  {
    term: 'Deployment',
    vendor: (
      <>
        &quot;the process to send components and apply the desired component configuration to a destination target
        device, which can be a single Greengrass core device or a group of Greengrass core devices&quot;
      </>
    ),
    arm: (
      <>
        The full list of components a target should run. It stands: an arm that was switched off &quot;receives the
        deployment the next time it connects&quot;.
      </>
    ),
    cite: <Cite id="F07-123">Greengrass developer guide, How it works and Manage deployments</Cite>,
  },
  {
    term: 'Thing group',
    vendor: <>&quot;To deploy to multiple core devices, specify a thing group that includes those devices.&quot;</>,
    arm: 'A named set of things. A replacement Jetson joins the fleet by being added to the group.',
    cite: <Cite id="F07-125">Greengrass developer guide, Create deployments</Cite>,
  },
  {
    term: 'Shadow',
    vendor: (
      <>
        A JSON document per thing, kept in the cloud, with a <code>desired</code> part (what an application asks
        for), a <code>reported</code> part (what the device says it is) and a <code>delta</code> (the difference,
        sent to the device).
      </>
    ),
    arm: (
      <>
        The answer to &quot;which policy version is this arm running&quot;, readable while the arm is offline. At
        most 8 KB per document. Nucleus lite does not support the component that syncs it.
      </>
    ),
    cite: <Cite id="F07-177">AWS IoT developer guide, Device Shadow service</Cite>,
  },
  {
    term: 'Job',
    vendor: <>&quot;a remote operation that is sent to and run on one or more devices&quot;</>,
    arm: 'The carrier under a group deployment: how fast an update spreads and when it stops.',
    cite: <Cite id="F07-178">AWS IoT developer guide, Jobs key concepts</Cite>,
  },
];

function VocabTable() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 680 }}>
        <thead>
          <tr>
            <th style={TH}>Term</th>
            <th style={{ ...TH, width: '40%' }}>In AWS&apos;s words</th>
            <th style={{ ...TH, width: '44%' }}>On the bench</th>
          </tr>
        </thead>
        <tbody>
          {VOCAB.map((row) => (
            <tr key={row.term}>
              <td style={TD}>
                <strong>{row.term}</strong>
              </td>
              <td style={TD}>{row.vendor}</td>
              <td style={TD}>
                {row.arm} {row.cite}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface ThreeCol {
  a: ReactNode;
  b: ReactNode;
  c: ReactNode;
}

const ROUTES: ThreeCol[] = [
  {
    a: 'Container image',
    b: (
      <>
        Bake the weights into the image. The recipe lists its address with a <code>docker:</code> prefix and a
        helper component pulls it from the registry.
      </>
    ),
    c: (
      <>
        The documentation read does not say whether the 2 GB quota counts a <code>docker:</code> image, and AWS
        publishes no maximum image size through Greengrass.
      </>
    ),
  },
  {
    a: 'S3 object fetched by the component',
    b: (
      <>
        Keep the weights in S3. The component&apos;s <code>install</code> step downloads them with the device&apos;s
        temporary credentials.
      </>
    ),
    c: (
      <>
        The script must check and skip a file already present: <code>install</code> runs again at every Greengrass
        start, and its default timeout is 120 s.{' '}
        <Cite id="F07-128">Greengrass component recipe reference, lifecycle</Cite>
      </>
    ),
  },
  {
    a: 'Split artifacts',
    b: 'Cut the weights across several components of under 2 GB each, tied together by dependencies.',
    c: 'Every piece is one more component version to publish and pin.',
  },
];

const UPLOAD_ROWS: ThreeCol[] = [
  {
    a: 'What it is',
    b: (
      <>
        A Greengrass component that queues and exports in the background. Your code appends one export task per
        file: its local address, the bucket and the key. <Cite id="F07-172">Greengrass developer guide, Export configurations</Cite>
      </>
    ),
    c: (
      <>
        Your own component calls S3 with an AWS SDK, which picks up the device&apos;s temporary credentials.{' '}
        <Cite id="F07-175">Greengrass developer guide, Interact with AWS services</Cite>
      </>
    ),
  },
  {
    a: 'What comes built in',
    b: (
      <>
        Multipart upload above a threshold whose minimum is 5 MB, a device-wide bandwidth cap, 5 export threads by
        default and a priority per stream. <Cite id="F07-173">Greengrass developer guide, Export configurations</Cite>
      </>
    ),
    c: (
      <>
        Nothing: the component owns queueing, retry, bandwidth and ordering. AWS&apos;s example only lists buckets;
        multipart transfer through the SDK is our reading.
      </>
    ),
  },
  {
    a: 'What it costs on the device',
    b: (
      <>
        A Java program that &quot;requires a minimum of 70 MB RAM in addition to the AWS IoT Greengrass Core
        software&quot;. <Cite id="F07-171">Greengrass developer guide, Manage data streams</Cite>
      </>
    ),
    c: 'No extra process beyond the uploader itself.',
  },
  {
    a: 'On nucleus lite',
    b: (
      <>
        Supported since stream manager 2.2.0, which brings Java back onto a device whose nucleus avoided it (our
        reading). <Cite id="F07-139">Greengrass developer guide, Stream manager</Cite>
      </>
    ),
    c: 'Works with no Java on the device.',
  },
];

const EDGE_ROWS: ThreeCol[] = [
  {
    a: 'When the link drops',
    b: (
      <>
        Offline is a normal state: the device takes the current deployment when it next connects.{' '}
        <Cite id="F07-123">Greengrass developer guide, Manage deployments</Cite>
      </>
    ),
    c: (
      <>
        &quot;is not a fit for disconnected, disrupted, intermittent or limited (DDIL) environments&quot;. Running
        pods keep running, nothing can be changed, and a node can take up to 30 minutes to rejoin. <Cite id="F09-119">EKS user guide, Hybrid Nodes overview</Cite>{' '}
        <Cite id="F09-125">EKS best practices, hybrid nodes and disconnections</Cite>
      </>
    ),
  },
  {
    a: 'Network',
    b: (
      <>
        Outbound only, on port 8883 or 443. No VPN, and nothing listens on the robot. <Cite id="F07-189">AWS IoT developer guide, Device communication protocols</Cite>
      </>
    ),
    c: (
      <>
        A private link in both directions: the control plane opens connections to the node. Guidance, &quot;not a
        strict requirement&quot;: at least 100 Mbps and at most 200 ms round trip. <Cite id="F09-120">EKS user guide, Hybrid Nodes prerequisites</Cite>
      </>
    ),
  },
  {
    a: 'Platforms the pages name',
    b: (
      <>
        The architecture Armv8 (AArch64) and no Linux distribution. JetPack and DGX OS are not named.{' '}
        <Cite id="F07-140">Greengrass developer guide, Greengrass nucleus requirements</Cite>
      </>
    ),
    c: (
      <>
        A table that lists Ubuntu 24.04 on x86 and Arm. Jetson Linux and DGX OS are not rows of it.{' '}
        <Cite id="F09-121">EKS user guide, Hybrid Nodes operating systems</Cite>
      </>
    ),
  },
  {
    a: 'GPU access',
    b: (
      <>
        None of the four documented container recipes passes a GPU flag; two AWS samples add one. <Cite id="F07-156">Greengrass developer guide, Run a Docker container</Cite>{' '}
        <Cite id="F07-157">AWS samples: genai-at-edge and the Physical AI Toolchain edge stack</Cite>
      </>
    ),
    c: (
      <>
        The hybrid node pages read in this research say nothing about GPUs.{' '}
        <Cite id="F09-122">EKS user guide, Hybrid Nodes pages</Cite>
      </>
    ),
  },
  {
    a: 'What you operate',
    b: 'The nucleus and your components.',
    c: (
      <>
        A Kubernetes node and a pod network you install yourself (Cilium or Calico).{' '}
        <Cite id="F09-123">EKS user guide, Hybrid Nodes add-ons</Cite>
      </>
    ),
  },
];

function ThreeColTable({ head, rows, minWidth }: { head: [string, string, string]; rows: ThreeCol[]; minWidth: number }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%', minWidth }}>
        <thead>
          <tr>
            <th style={{ ...TH, width: '20%' }}>{head[0]}</th>
            <th style={{ ...TH, width: '40%' }}>{head[1]}</th>
            <th style={{ ...TH, width: '40%' }}>{head[2]}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td style={TD}>
                <strong>{row.a}</strong>
              </td>
              <td style={TD}>{row.b}</td>
              <td style={TD}>{row.c}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                   */
/* ------------------------------------------------------------------------ */

export function Fleet() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Know how a new policy reaches a hundred robots safely and how their episodes come back: one component may carry 2 GB of artifacts, a policy weighs about 6 GB, and a rollout has a brake and no reverse gear (AWS IoT Greengrass nucleus v2.18.4 and AWS documentation, read 2026-11-20)"
          >
            18. The Fleet
          </Header>
        }
      >
        <SpaceBetween size="s">
          <Box variant="p">
            A fleet is many copies of one station. {TASK_SENTENCE} Section 17, Running on the Robot, put one policy
            on one such computer. This section covers what changes when there are many: how a new policy version
            reaches all of them without stopping the ones that work, and how the episodes they record (section 9,
            Collecting Data) travel back to become training data.
          </Box>
          <Box variant="p">
            The path taught here is AWS IoT (Internet of Things) Core and AWS IoT Greengrass, read from AWS&apos;s
            own documentation. &quot;A hundred robots&quot; is an illustration: AWS&apos;s rollout example steps at
            1,000 devices, and the one published fleet loop cited below has 16 robots.{' '}
            <Cite id="F07-93">AWS IoT developer guide, Job rollout rates</Cite>{' '}
            <Cite id="F07-108">Learning While Deploying, section V</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Three things have to move once there is more than one arm, and you know which AWS services carry them today">
            From one arm to a fleet
          </Header>
        }
      >
        <SpaceBetween size="s">
          <Box variant="p">
            With one arm you carry the policy over on a cable and read the episodes off the disk. With many, three
            things have to move by themselves: a new policy out to every robot without breaking the ones that work,
            evidence of how it behaves back, and both fast enough that a failure seen today is fixed this week.
          </Box>
          <Box variant="p">
            AWS defines Greengrass as &quot;an open source Internet of Things (IoT) edge runtime and cloud service
            that helps you build, deploy and manage IoT applications on your devices&quot;. Read that as two halves:
            a program on each device that keeps an outbound connection to your account, and a cloud service that
            tells it what to run. <Cite id="F07-120">Greengrass developer guide, What is AWS IoT Greengrass</Cite>{' '}
            Under it sit AWS IoT Core (the device registry and the message broker) and AWS IoT Device Management
            (jobs). On 2026-11-20 none of the three appears in AWS&apos;s lists of services in maintenance, in
            sunset or shut down.{' '}
            <Cite id="F07-191">AWS General Reference, service lifecycle tables</Cite>
          </Box>
          <Box variant="p">
            The robot-specific service is gone: AWS RoboMaker&apos;s end-of-support date is September 10, 2025.{' '}
            <Cite id="F07-98">AWS General Reference, Services in Full Shutdown</Cite> No first-party statement of
            what replaces it was located in this research; its documentation returned HTTP 404 on the day it was
            read. <Cite id="F07-100">RoboMaker developer guide (page removed)</Cite> AWS IoT Greengrass V1 ended on
            October 7, 2026, so everything below is Greengrass V2.{' '}
            <Cite id="F07-99">AWS General Reference, Services in Full Shutdown</Cite>
          </Box>
          <ExpandableSection headerText="What sits beside this path: neighbouring IoT services and their status in November 2026">
            <ul style={LIST}>
              <li>
                <strong>Secure tunneling</strong> gives an operator a session such as SSH to a device behind a
                firewall, with no inbound port, on both nuclei.{' '}
                <Cite id="F07-183">AWS IoT developer guide, Secure tunneling</Cite>
              </li>
              <li>
                <strong>Fleet indexing</strong> makes the registry, shadows and connectivity searchable, so
                &quot;arms on the new policy that report a low success rate&quot; becomes one query.{' '}
                <Cite id="F07-182">AWS IoT developer guide, Fleet indexing</Cite>
              </li>
              <li>
                <strong>Device Defender</strong> audits device configuration and watches behaviour. Its page says
                the detect feature &quot;will no longer be available to new customers starting August 31,
                2026&quot;; audit remains available.{' '}
                <Cite id="F07-184">AWS IoT developer guide, Device Defender</Cite>
              </li>
              <li>
                <strong>AWS IoT FleetWise</strong>, the vehicle-fleet data collector, is in maintenance (announced
                March 31, 2026): no new customers.{' '}
                <Cite id="F07-191">AWS General Reference, Services in Maintenance</Cite>
              </li>
              <li>
                <strong>The operating system is a separate layer.</strong> No AWS page describing a managed update
                of a Linux device&apos;s operating system was located in this research; NVIDIA documents the update
                tools for Jetson Linux and ships no fleet service.{' '}
                <Cite id="F07-185">Greengrass developer guide, Update the Core software</Cite>{' '}
                <Cite id="F07-186">Jetson Linux developer guide, update mechanism</Cite>
              </li>
            </ul>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Eight words that let you read any Greengrass page, each one placed on the bench">
            The vocabulary, in the vendor&apos;s words
          </Header>
        }
      >
        <SpaceBetween size="s">
          <Box variant="p">
            AWS IoT has its own nouns, and its documentation assumes them. The first six describe what runs where.
            The last two answer fleet questions: what state is each arm in, and how does a change spread.
          </Box>
          <VocabTable />
          <Box variant="p">
            Two rules follow. A deployment is the whole list for its target: &quot;A new deployment to the same
            target overwrites the previous deployment to the target&quot;, and a component left out of the new
            revision is uninstalled. Start each revision from the current one.{' '}
            <Cite id="F07-124">Greengrass developer guide, Manage deployments</Cite> And a device runs the union of
            the deployments that target it, its own thing plus each of its groups; if two pin different versions of
            one component, the deployment fails on the device. Pin the policy in exactly one deployment per arm.{' '}
            <Cite id="F07-126">Greengrass developer guide, Manage deployments</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="2 GB per component against a policy of about 6 GB: three routes around the limit, and the recipe that carries the reference">
            Delivering a policy
          </Header>
        }
      >
        <SpaceBetween size="s">
          <Box variant="p">
            The plain way to ship software with Greengrass is as artifacts: files in S3 that the nucleus downloads
            and checks against a digest. That way stops at a hard limit. One component&apos;s artifacts may total at
            most 2 GB, and the limit cannot be raised.{' '}
            <Cite id="F07-87">AWS General Reference, Greengrass V2 quotas</Cite> A large policy does not fit.
            NVIDIA&apos;s Jetson Thor tutorial for a VLA (vision-language-action) policy, the kind of model from
            section 5 that reads camera images and an instruction and outputs motor commands, gives its weights as
            &quot;~6 GB+&quot;. <Cite id="F07-54">Jetson AI Lab tutorial, OpenPi on Thor</Cite>
          </Box>
          <Box variant="p">
            So the component carries a reference and the bytes travel another way. AWS documents the mechanisms;
            using them for multi-gigabyte weights is our reading, and none of the three was tested in this research.{' '}
            <Cite id="F07-168">AWS General Reference quotas and Greengrass developer guide</Cite>
          </Box>
          <ThreeColTable head={['Route', 'How the bytes travel', 'Scope']} rows={ROUTES} minWidth={640} />
          <Snippet
            title="A container component recipe, as AWS documents it for a private registry image"
            mode="copied"
            source={<Cite id="F07-153">Greengrass developer guide, Run a Docker container</Cite>}
          >
            {RECIPE}
          </Snippet>
          <Box variant="p">
            Read it from the top. The first line fixes the recipe format, and the next four name and version the
            component. <Cite id="F07-151">Greengrass component recipe reference</Cite> The two dependencies are
            helper components the nucleus installs first: the Docker application manager pulls images, and the token
            exchange service lends it the device&apos;s temporary credentials for a private repository in Amazon ECR
            (Elastic Container Registry, AWS&apos;s image store). Under <code>Manifests</code>, the artifact is the
            image address with a <code>docker:</code> prefix, a reference and no bytes, and the lifecycle is one
            shell line, a plain <code>docker run</code>.
          </Box>
          <Box variant="p">
            The square brackets mean &quot;put a tag or a digest here&quot;. AWS recommends one of the two, &quot;To
            ensure that all of your core devices run the same version of an image&quot;; a tag can be moved to a new
            image and a digest cannot.{' '}
            <Cite id="F07-154">Greengrass developer guide, Docker application manager</Cite> The recipe passes no
            GPU flag (section 17 covers GPU access), and it starts the container with <code>Run</code>, the weaker
            choice for a rollout, as the next block shows.{' '}
            <Cite id="F07-156">Greengrass developer guide, Run a Docker container</Cite>
          </Box>
          <ExpandableSection headerText="What happens to a multi-gigabyte download on a poor link (read from the nucleus source, not run)">
            <Box variant="p">
              At v2.18.4 the Java nucleus keeps a partial S3 artifact, asks for the rest with an HTTP{' '}
              <code>Range</code> request, and retries network errors once a minute with no attempt limit. What ends
              a slow download is the job timeout of the next block. Nucleus lite&apos;s downloader was not read.{' '}
              <Cite id="F07-169">aws-greengrass-nucleus v2.18.4, ArtifactDownloader.java and S3Downloader.java</Cite>{' '}
              The nucleus also refuses a download that would push its component store past 10 GB by default.{' '}
              <Cite id="F07-170">aws-greengrass-nucleus v2.18.4, ComponentManager.java</Cite>
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Send the new policy to a few arms, read what they report, widen only on success, and know that an abort is a brake with no reverse gear">
            Staged rollout
          </Header>
        }
      >
        <SpaceBetween size="s">
          <Box variant="p">
            A staged rollout updates a few devices first, widens as successes accumulate and stops when too many
            fail. Use it for every change to robots that move; for one arm on the bench a deployment to that one
            thing is enough. The mechanism is borrowed. &quot;AWS IoT Greengrass uses AWS IoT Core jobs to send deployments to core
            devices, so these options are identical to the configuration options for AWS IoT Core jobs.&quot;
            Greengrass says what to install; the job underneath says how fast it spreads, when to stop and how long
            each device gets. <Cite id="F07-162">Greengrass developer guide, Create deployments</Cite>
          </Box>
          <AnimatedFigure
            name="a staged rollout with the abort case"
            steps={ROLLOUT_STEPS}
            intervalMs={2800}
            cites="F07-90 F07-93 F07-95 F07-129 F07-162 F07-164 F07-165"
            caption={
              <>
                Read from the top; the blue dot is the new policy version. Illustrative, not measured: the device
                counts, the version numbers and the point where the failures arrive are invented. The 60-second
                wait is the documented default.
              </>
            }
          >
            {(step, reduced) => <RolloutDiagram step={step} reduced={reduced} />}
          </AnimatedFigure>
          <Box variant="p">
            <strong>The rate.</strong> Either constant, a <code>maximumPerMinute</code> of at least 1 device per
            minute, or exponential, with a <code>baseRatePerMinute</code> from 1 to 1000 and an{' '}
            <code>incrementFactor</code> from 1.1 to 5.{' '}
            <Cite id="F07-92">AWS IoT API reference, ExponentialRolloutRate and JobExecutionsRolloutConfig</Cite>{' '}
            AWS&apos;s own example starts at 50 per minute with a factor of 2 and doubles each time another 1,000
            devices have been notified or have succeeded: 50, 100, 200, 400 per minute. The rate rises only on
            evidence of success. A hundred arms want the same shape with smaller thresholds. <Cite id="F07-93">AWS IoT developer guide, Job rollout rates</Cite>
          </Box>
          <Box variant="p">
            <strong>The abort rule.</strong> It names a failure type, a minimum number of devices before it can
            fire and a threshold percentage of failures. Its only action is <code>CANCEL</code>.{' '}
            <Cite id="F07-94">AWS IoT API reference, AbortCriteria</Cite> A cancel is narrow: &quot;only QUEUED job
            executions are canceled&quot;, and executions in progress &quot;will not be canceled&quot;. Arms that
            took the new policy keep it. <Cite id="F07-95">AWS IoT developer guide, Job configurations</Cite> A
            rollout has a brake and no reverse gear. Going back is a second action: a new deployment revision that
            pins the previous version. <Cite id="F07-164">Greengrass developer guide, Cancel deployments</Cite>
          </Box>
          <Box variant="p">
            <strong>On each device.</strong> First the nucleus asks. By default it notifies every running component
            before replacing it, the component can answer that now is a bad moment, and the nucleus waits 60
            seconds; after that &quot;the deployment proceeds on the device&quot;. An episode lasts tens of seconds,
            so our reading is that the policy component defers until the gripper is empty, with the timeout set
            above the longest episode.{' '}
            <Cite id="F07-90">Greengrass V2 API reference, DeploymentComponentUpdatePolicy</Cite> The two calls
            that let a component defer are absent from the operations listed in nucleus lite&apos;s README at
            v2.7.0. <Cite id="F07-137">aws-greengrass-lite v2.7.0, README</Cite> Then the new version starts. If
            that fails, by default &quot;the AWS IoT Greengrass Core software rolls back that core device to its
            previous configuration&quot;. <Cite id="F07-163">Greengrass developer guide, Create deployments</Cite>
          </Box>
          <Box variant="p">
            <strong>Why the lifecycle step decides whether rollback ever fires.</strong> A recipe starts its program
            with <code>run</code> or <code>startup</code>. With <code>run</code>, &quot;the deployment can be
            complete and successful even if the run lifecycle script fails soon after running&quot;. With{' '}
            <code>startup</code>, the deployment waits until the component reports a state itself. So a policy
            component written with <code>startup</code> can load its weights, run one warm-up inference and only
            then report <code>RUNNING</code>. If the model fails to load it reports <code>ERRORED</code>, the
            deployment fails on that arm, the arm rolls back and the failure counts toward the abort threshold.
            That health gate is our reading of the documented mechanism; every container example AWS documents uses{' '}
            <code>Run</code>. <Cite id="F07-129">Greengrass component recipe reference, lifecycle</Cite> The gate
            has a ceiling: the cloud sees a core device as <code>HEALTHY</code> or <code>UNHEALTHY</code>, which
            says the software started. Whether the block lands in the cup has to come back as data.{' '}
            <Cite id="F07-131">Greengrass developer guide, Check core device status</Cite>
          </Box>
          <Box variant="p">
            <strong>Where the canaries live.</strong> The documented way to update a few devices first is a
            subdeployment, &quot;a deployment that targets a smaller subset of devices within a parent
            deployment&quot;. The documentation read does not say whether a subdeployment can pin a component
            version different from its parent&apos;s without the version conflict described earlier; a separate
            canary thing group avoids the question.{' '}
            <Cite id="F07-165">Greengrass developer guide, Create subdeployments</Cite>
          </Box>
          <Snippet
            title="A create-deployment document with rollout, abort and timeout, as AWS documents it"
            mode="copied"
            source={<Cite id="F07-162">Greengrass developer guide, Create deployments</Cite>}
          >
            {DEPLOYMENT_DOC}
          </Snippet>
          <Box variant="p">
            Read it in three parts. <code>components</code> is the list for the target. <code>deploymentPolicies</code>{' '}
            is the per-device behaviour: ask components first (this example shortens the wait to 30 seconds), let
            them validate new configuration, roll back on failure. <code>iotJobConfiguration</code> is the spread:
            start at 5 devices per minute, double once 10 were notified and 5 succeeded, never exceed 50 per minute,
            cancel when 5% of executions fail after at least 100 have executed, and give each device 5 minutes.
            Two of those numbers need changing for robots, in our reading. A 5-minute timeout is shorter than the
            download: at 100 Mbit/s, 6 GB takes 8 minutes, so a healthy arm would time out and count as a failure.
            And a minimum of 100 executed devices never fires in a fleet of 20 arms.{' '}
            <Cite id="F07-161">Greengrass developer guide, deployment policies</Cite>{' '}
            <Cite id="F07-162">Greengrass developer guide, Create deployments</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Small signals travel as messages, episodes travel as files, and one published fleet closed the loop in under a minute each way">
            Episodes back to S3
          </Header>
        }
      >
        <SpaceBetween size="s">
          <Box variant="p">
            The connection every device already holds to AWS IoT Core speaks MQTT (Message Queuing Telemetry
            Transport), a lightweight protocol in which a device publishes a small message to a named topic and
            whatever subscribed to that topic receives it. It suits small things. A message can be at most 128 KB, a
            connection can make 100 publish requests per second, and its data is processed at 512 KB per second.
            One raw 640x480 camera frame is 921,600 bytes, seven times the message limit.{' '}
            <Cite id="F07-97">AWS General Reference, AWS IoT Core quotas</Cite> An episode is files: in section
            9&apos;s example dataset, 86.1 MB for 50 episodes, about <Derived>1.7</Derived> MB each (86.1 / 50).{' '}
            <Cite id="F05-29">Hugging Face hub file listing of the example dataset</Cite>
          </Box>
          <Box variant="p">
            So split the traffic. Over MQTT goes a record per episode of a few hundred bytes (which arm, which
            policy version, success or failure), which a rule in AWS IoT Core can write to S3. That record is the
            task-level evidence the rollout gate lacks. The files go to S3 directly. &quot;Messages for signals, S3
            for files&quot; is our reading of the limits; no AWS page read in this research states when to keep
            data off MQTT. <Cite id="F07-176">AWS IoT developer guide, Basic Ingest and the S3 rule action</Cite>
          </Box>
          <Box variant="p">
            For the files, AWS documents two routes. Both can use S3 multipart upload, which sends an object as up
            to 10,000 parts of 5 MiB to 5 GiB each, so a dropped link costs one part.{' '}
            <Cite id="F07-102">Amazon S3 user guide, multipart upload limits</Cite> Both are code you write:
            LeRobot&apos;s built-in uploader targets the Hugging Face Hub.{' '}
            <Cite id="F07-112">LeRobot v0.7.0, inference.mdx</Cite>
          </Box>
          <ThreeColTable head={['', 'Stream manager', 'A component that calls S3 itself']} rows={UPLOAD_ROWS} minWidth={680} />
          <Box variant="p">
            Choose stream manager when the link is poor or shared and you want a queue and a bandwidth cap without
            writing them; the documentation read does not say whether it resumes a multipart upload after the device
            reboots. Choose the direct call when memory is the scarce thing or the device runs nucleus lite. On
            arm64 the pages read cover the nucleus only: the Java one lists Armv8, and nucleus lite ships an arm64
            package. <Cite id="F07-140">Greengrass developer guide, Greengrass nucleus requirements</Cite>{' '}
            <Cite id="F07-142">aws-greengrass-lite v2.7.0, package readme</Cite>
          </Box>
          <AnimatedFigure
            name="episodes back to S3 and the loop closing"
            steps={BACK_STEPS}
            intervalMs={2800}
            cites="F07-102 F07-108 F07-109 F07-172"
            caption={
              <>
                Read from the top; the blue dot is one episode, then the policy trained on it. The two latencies are
                author reported, from one 16-robot run of the authors&apos; own system on one site. The boxes are a
                schematic, not measured.
              </>
            }
          >
            {(step, reduced) => <EpisodesBackDiagram step={step} reduced={reduced} />}
          </AnimatedFigure>
          <Box variant="p">
            <strong>How fast can the loop close?</strong> One published system gives a measured answer.
            &quot;Learning While Deploying&quot; ran 16 two-armed robots that upload complete episodes to object
            storage at episode boundaries, while a central learner broadcasts an updated shared policy every 50
            training steps. <Cite id="F07-108">Learning While Deploying, section V</Cite> On an 8-hour run with
            those 16 robots the authors report that an episode became available to the learner 41 s after it was
            produced at the median (148 s at the 99th percentile), and that a published model reached a robot in 38
            s at the median (55 s at the 99th percentile).{' '}
            <Cite id="F07-109">Learning While Deploying, Table VI</Cite> Under a minute each way, on the
            authors&apos; own plumbing, where a staged deployment&apos;s default handshake alone waits 60 seconds.
          </Box>
          <Box variant="p">
            <strong>How much data is that?</strong> For this arm, megabytes per episode. For an upper bound, a
            sizing model in &quot;The Robot Data Factory&quot; computes 38.41 MB/s for a reference robot with seven
            1920x1080, 30 fps video streams recording around the clock: 3.32 TB per robot per day, and for 120
            robots 4.61 GB/s and 11.95 PB per 30 days. It is the authors&apos; model, with no measurement behind
            it.{' '}
            <Cite id="F07-106">The Robot Data Factory, appendix B.3</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Pick the agent for a machine beside a robot by asking whether its link drops and whether anything may connect in">
            Greengrass core device or Kubernetes hybrid node
          </Header>
        }
      >
        <SpaceBetween size="s">
          <Box variant="p">
            There is a second way to attach a machine on your premises to AWS. Amazon EKS (Elastic Kubernetes
            Service) Hybrid Nodes joins it to a cloud Kubernetes cluster as a worker node, so the scheduler that
            places training jobs on cloud GPUs can also place a pod on it.
          </Box>
          <ThreeColTable head={['', 'Greengrass core device', 'EKS hybrid node']} rows={EDGE_ROWS} minWidth={680} />
          <Box variant="p">
            Our reading of those rows: a Jetson on or beside a robot is a Greengrass core device. A DGX Spark is a
            hybrid node only when the lab already runs its training and evaluation on EKS, the machine sits on a
            wired network with a private link to the cluster, and somebody is willing to run a pod network on it.
            Section 25, Choosing, returns to this decision.{' '}
            <Cite id="F09-127">EKS user guide, Hybrid Nodes overview</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="What has not been measured yet, and the seven steps that take one device from the bench into the fleet">
            The hook-up of one Jetson and one Spark
          </Header>
        }
      >
        <SpaceBetween size="s">
          <Box variant="p">
            Everything above is read from documentation and source code; nothing was run on a device. No
            first-party AWS post or sample from 2025 or 2026 showing working Greengrass V2 code for a GPU policy
            container on a Jetson together with episode upload to S3 was located in this research.{' '}
            <Cite id="F07-199">AWS sample repositories searched</Cite>
          </Box>
          <Placeholder
            what={
              <>
                the measured hook-up of one Jetson Orin Nano Super and one DGX Spark to AWS IoT Greengrass: whether
                each nucleus installs on JetPack and on DGX OS; the memory the nucleus and stream manager really
                use; the <code>docker run</code> flags a recipe needs for the GPU on each machine; the time to
                deploy a multi-gigabyte policy and whether an interrupted download resumes; what a deliberately
                failing start does (the reported state, the rollback and its duration); whether a canary
                subdeployment can pin a newer version; and the upload throughput for one LeRobot episode by each
                route, with its effect on inference latency.
              </>
            }
            source={
              <>
                the owner&apos;s own hook-up of his Jetson Orin Nano Super and DGX Spark against his AWS account,
                not yet done.
              </>
            }
          />
          <Box variant="p">Until then, this is the order in which the documentation has you work.</Box>
          <ol style={LIST}>
            <li>
              <strong>Create the account side.</strong> Five objects: a thing, a thing group, an AWS IoT policy, an
              IAM (Identity and Access Management) role called the token exchange role, and a role alias pointing at
              it. The installer can create them, or you create them from a workstation and no AWS credentials ever
              sit on the device. <Cite id="F07-144">Greengrass developer guide, Install with automatic provisioning</Cite>{' '}
              <Cite id="F07-145">Greengrass developer guide, Install with manual provisioning</Cite>
            </li>
            <li>
              <strong>Open the network, outbound only.</strong> The device dials out to four kinds of endpoint, on
              port 8883 or 443 for MQTT and 8443 or 443 for HTTPS.{' '}
              <Cite id="F07-190">Greengrass developer guide, Allow device traffic</Cite>
            </li>
            <li>
              <strong>Install a nucleus.</strong> The Java nucleus needs a Java runtime of version 8 or later and
              installs with one documented command. Nucleus lite installs from a package whose readme names Ubuntu
              24.04. <Cite id="F07-143">Greengrass developer guide, quick installation</Cite>{' '}
              <Cite id="F07-142">aws-greengrass-lite v2.7.0, package readme</Cite>
            </li>
            <li>
              <strong>Extend the device&apos;s role.</strong> The default policy &quot;doesn&apos;t include access
              to files in S3 buckets&quot;. Add <code>s3:GetObject</code> for artifacts, three registry actions for
              private images, and <code>s3:PutObject</code> with the multipart actions for the episodes bucket.{' '}
              <Cite id="F07-149">Greengrass developer guide, Authorize core devices</Cite>{' '}
              <Cite id="F07-175">Greengrass developer guide, Interact with AWS services</Cite>
            </li>
            <li>
              <strong>Package the policy as a component</strong>, image pinned by digest, and try it on the bench
              device with a local deployment, made on the device itself with no cloud round trip.{' '}
              <Cite id="F07-127">Greengrass developer guide, Greengrass CLI deployment</Cite>
            </li>
            <li>
              <strong>Deploy from the cloud</strong>, first to the one thing, then to a thing group with a rate, an
              abort rule and a timeout sized for your fleet and your download.{' '}
              <Cite id="F07-125">Greengrass developer guide, Create deployments</Cite>
            </li>
            <li>
              <strong>Add the uploader and watch one episode arrive</strong> in the bucket. After that the second
              arm is one more thing in the group, and beyond a handful, fleet provisioning lets every device ship
              with one shared claim certificate that it trades for its own on first connection.{' '}
              <Cite id="F07-174">Stream manager Python SDK v1.1.2, stream_manager_s3.py</Cite>{' '}
              <Cite id="F07-146">Greengrass developer guide, Fleet provisioning</Cite>
            </li>
          </ol>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
