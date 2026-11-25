import type { CSSProperties, ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { Cite, Derived, Toy } from '../components/Cite';
import { AnimatedFigure } from '../components/Figure';
import { FLEET_LOOP_STEPS, FleetLoop } from '../components/figures/FleetLoop';
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
  'Each canary downloads the image. The nucleus asks the running policy component whether it is safe to update, and starts the new version once the component agrees, or after 60 seconds by default if it never answers.',
  'The gate: each canary reports RUNNING or ERRORED. Nothing wider starts until this reads well.',
  'The rollout widens to the fleet group, and the rate grows as devices are notified or report success.',
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
          thing group of seventeen devices. A dot moves down one box per step. In the last step seven fleet devices run the new
          policy, two have failed and eight queued devices are cancelled.
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
            asked first; 60 s if no answer
          </text>
          <text x={146} y={240} fontSize={12} fill={TENSOR_INK} style={shown(step > 2, reduced)}>
            running policy 1.5.0
          </text>

          <text x={tx} y={328} fontSize={12} fill={INK}>
            each device reports RUNNING or ERRORED
          </text>

          {/* Fleet group: seventeen devices in two rows. */}
          <text x={tx} y={406} fontSize={12} fill={INK} style={shown(step < 4, reduced)}>
            seventeen arms, still on policy 1.4.0
          </text>
          <text x={tx} y={406} fontSize={12} fontWeight={700} fill={EMPHASIS} style={shown(step === 4, reduced)}>
            rate grows as arms are notified or succeed
          </text>
          <text x={tx} y={406} fontSize={12} fontWeight={700} fill={FAIL_INK} style={shown(step === 5, reduced)}>
            abort: queued arms cancelled, updated arms stay
          </text>
          {Array.from({ length: 17 }, (_, i) => (
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

interface FourCol {
  a: ReactNode;
  b: ReactNode;
  c: ReactNode;
  d: ReactNode;
}

/** The three routes around the 2 GB artifact limit. */
const ROUTES: FourCol[] = [
  {
    a: 'Container image with the weights inside',
    b: (
      <>
        A <code>docker:</code> reference to the image, pinned by digest. The Docker application manager, the
        Greengrass component that pulls images for you, fetches it from the registry.
      </>
    ),
    c: (
      <>
        Docker pulls the image. Since nucleus 2.18.4 an image download interrupted by a network error is
        retried; before it, the deployment failed. The changelog does not say whether a retried pull resumes a
        layer or starts it again.
      </>
    ),
    d: (
      <>
        The quota page does not say whether the 2 GB counts a <code>docker:</code> image, or give a maximum image
        size through Greengrass.{' '}
        <Cite id="F07-153">Greengrass developer guide, Run a Docker container</Cite>{' '}
        <Cite id="F07-84">Greengrass nucleus changelog, 2.18.4</Cite>{' '}
        <Cite id="F07-168">AWS General Reference quotas and Greengrass developer guide</Cite>
      </>
    ),
  },
  {
    a: 'Weights in S3, fetched by the component',
    b: (
      <>
        The S3 key, passed in the component&apos;s configuration. The <code>install</code> step downloads the
        object with temporary credentials from the token exchange service, the Greengrass component that hands a
        device short-lived AWS credentials.
      </>
    ),
    c: 'Your script: it checks the bytes and resumes a broken download, or nothing does.',
    d: (
      <>
        <code>install</code> runs again at every Greengrass start and times out after 120 s by default, a quarter
        of the 480 s that 6 GB takes at 100 Mbit/s. Skip a file already present and raise the timeout.{' '}
        <Cite id="F07-128">Greengrass component recipe reference, lifecycle</Cite>{' '}
        <Cite id="F07-160">Greengrass developer guide, Create deployments, configuration update</Cite>{' '}
        <Cite id="F07-148">Greengrass developer guide, Interact with AWS services</Cite>{' '}
        <Cite id="F07-162">Greengrass developer guide, Create deployments</Cite>
      </>
    ),
  },
  {
    a: 'Weights split into artifacts of under 2 GB each',
    b: 'The bytes themselves, as files of under 2 GB across several components tied together by dependencies. Weights not already in files that size need an install step that joins the pieces, and disk for the joined copy.',
    c: (
      <>
        The nucleus. It checks every piece against a digest and, in its v2.18.4 code, resumes a broken S3 download
        with an HTTP <code>Range</code> request, which asks only for the bytes still missing, retried once a minute
        with no attempt limit.
      </>
    ),
    d: (
      <>
        The component store, the nucleus&apos;s disk area for artifacts, 10 GB by default and counting what is
        already stored: a second 6 GB version needs 6 + 6
        = 12 GB.{' '}
        <Cite id="F07-152">Greengrass component recipe reference, artifacts</Cite>{' '}
        <Cite id="F07-169">aws-greengrass-nucleus v2.18.4, ArtifactDownloader.java and S3Downloader.java</Cite>{' '}
        <Cite id="F07-170">aws-greengrass-nucleus v2.18.4, ComponentManager.java</Cite>
      </>
    ),
  },
];

function FourColTable({ head, rows, minWidth }: { head: [string, string, string, string]; rows: FourCol[]; minWidth: number }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%', minWidth }}>
        <thead>
          <tr>
            <th style={{ ...TH, width: '17%' }}>{head[0]}</th>
            <th style={{ ...TH, width: '25%' }}>{head[1]}</th>
            <th style={{ ...TH, width: '25%' }}>{head[2]}</th>
            <th style={{ ...TH, width: '33%' }}>{head[3]}</th>
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
              <td style={TD}>{row.d}</td>
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

const UPLOAD_ROWS: ThreeCol[] = [
  {
    a: 'What your code does',
    b: (
      <>
        Appends one export task per file: its local address, the bucket and the key. Stream manager runs the tasks
        in the order they were appended and reports <code>Success</code>, after which your code deletes the file.{' '}
        <Cite id="F07-172">Greengrass developer guide, Export configurations, Amazon S3</Cite>
      </>
    ),
    c: (
      <>
        Calls S3 itself with an AWS SDK, which picks up the device&apos;s temporary credentials from the token
        exchange service.{' '}
        <Cite id="F07-175">Greengrass developer guide, Interact with AWS services</Cite>
      </>
    ),
  },
  {
    a: 'What comes built in',
    b: (
      <>
        Multipart upload above a threshold whose minimum is 5 MB, a device-wide bandwidth cap, 5 export threads by
        default and a priority from 1 to 10 per stream. One stream uploads one file at a time; parallel uploads take several streams. A stream buffers 256 MB on
        the device by default.{' '}
        <Cite id="F07-173">Greengrass developer guide, stream manager configuration and Export configurations</Cite>
      </>
    ),
    c: 'Nothing: your component owns queueing, retry, bandwidth and ordering.',
  },
  {
    a: 'Memory on the device',
    b: (
      <>
        A Java program that &quot;requires a minimum of 70 MB RAM in addition to the AWS IoT Greengrass Core
        software&quot;.{' '}
        <Cite id="F07-171">Greengrass developer guide, Manage data streams</Cite>
      </>
    ),
    c: 'No process beyond the uploader itself.',
  },
  {
    a: 'On nucleus lite',
    b: (
      <>
        Supported since stream manager 2.2.0, and stream manager is itself a Java program: its settings include
        arguments for the Java virtual machine.{' '}
        <Cite id="F07-139">Greengrass developer guide, Stream manager</Cite>
      </>
    ),
    c: 'Works with no Java on the device.',
  },
];

const EDGE_ROWS: ThreeCol[] = [
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
        None of the four documented container recipes passes a GPU flag; two AWS samples add one.{' '}
        <Cite id="F07-156">Greengrass developer guide, Run a Docker container</Cite>{' '}
        <Cite id="F07-157">AWS samples: genai-at-edge and the Physical AI Toolchain edge stack</Cite>
      </>
    ),
    c: (
      <>
        The pages read say nothing about GPUs.{' '}
        <Cite id="F09-122">EKS user guide, Hybrid Nodes pages</Cite>
      </>
    ),
  },
  {
    a: 'What you operate',
    b: 'The nucleus and your components.',
    c: (
      <>
        A Kubernetes node and a pod network you install yourself, Cilium or Calico. The Amazon VPC CNI (Container
        Network Interface), the pod network EKS uses in the cloud, is not compatible.{' '}
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

/** Limits and defaults that rarely decide a design, kept for lookup. */
const LIMIT_ROWS: ThreeCol[] = [
  {
    a: 'Recipe and deployment document',
    b: 'Recipe at most 16 KB; deployment document at most 7 KB for one thing, 31 KB for a thing group, 6 MB with large configuration support.',
    c: <Cite id="F07-87">AWS General Reference, Greengrass V2 quotas</Cite>,
  },
  {
    a: 'Publishing components',
    b: 'CreateComponentVersion: 1 request per second per Region. Other control-plane calls: 30 per second per Region. 5,000 components per Region, and 5,000 versions of each.',
    c: (
      <>
        <Cite id="F07-87">AWS General Reference, Greengrass V2 quotas</Cite>{' '}
        <Cite id="F07-167">AWS General Reference, Greengrass V2 quotas</Cite>
      </>
    ),
  },
  {
    a: 'Deployment polling',
    b: 'A core device polls for deployment notifications every 15 seconds by default.',
    c: <Cite id="F07-167">Greengrass nucleus, deploymentPollingFrequencySeconds</Cite>,
  },
  {
    a: 'Lifecycle timeouts',
    b: 'install 120 s, startup 120 s, shutdown 15 s, recover 60 s; run has none.',
    c: <Cite id="F07-128">Greengrass component recipe reference, lifecycle</Cite>,
  },
  {
    a: 'Disk checks before a download',
    b: 'Refused below 20 MB of free disk; a checksum mismatch deletes the file and retries up to 10 times.',
    c: (
      <>
        <Cite id="F07-170">aws-greengrass-nucleus v2.18.4, ComponentManager.java</Cite>{' '}
        <Cite id="F07-169">aws-greengrass-nucleus v2.18.4, ArtifactDownloader.java</Cite>
      </>
    ),
  },
  {
    a: 'Rollout rate',
    b: 'Constant: maximumPerMinute of at least 1. Exponential: baseRatePerMinute from 1 to 1000, incrementFactor from 1.1 to 5.',
    c: <Cite id="F07-92">AWS IoT API reference, ExponentialRolloutRate and JobExecutionsRolloutConfig</Cite>,
  },
  {
    a: 'Abort rule',
    b: 'failureType FAILED, REJECTED, TIMED_OUT or ALL; minNumberOfExecutedThings at least 1; thresholdPercentage up to 100, two decimals; action CANCEL only.',
    c: <Cite id="F07-94">AWS IoT API reference, AbortCriteria</Cite>,
  },
  {
    a: 'Credentials and policies',
    b: 'Token exchange credentials expire after an hour by default. A change to the AWS IoT policy on a device certificate can take 6 to 8 minutes to become effective.',
    c: (
      <>
        <Cite id="F07-148">Greengrass developer guide, Interact with AWS services</Cite>{' '}
        <Cite id="F07-188">AWS IoT developer guide, AWS IoT Core policies</Cite>
      </>
    ),
  },
];

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
            description="A 6 GB policy will not fit the 2 GB package AWS's device software may carry, and a rollout can be stopped but is not automatically undone: choose the route, the settings and the way back before the first arm updates (read from Greengrass nucleus v2.18.4 and AWS documentation on 2026-11-20, not run on a device)"
          >
            18. The Fleet: A 6 GB Policy, a 2 GB Package and No Reverse Gear
          </Header>
        }
      >
        <SpaceBetween size="s">
          <Box variant="p">
            Updating a fleet of arms on AWS runs into three fixed facts before anyone judges the new policy. The
            policy is too big for the package: pi0.5, Physical Intelligence&apos;s vision-language-action policy,
            has 6 GB or more of weights to send to every arm. AWS&apos;s device software installs what it delivers
            in packages called components, and one component may carry at most 2 GB, a third of 6 GB. The episodes
            coming back are too big for a message: LeRobot, the library that records each attempt at the task, grows
            each video file to 200 MB, more than a thousand times the 128 KB one device message may hold.{' '}
            <Cite id="F07-54">Jetson AI Lab tutorial, OpenPi on Thor</Cite>{' '}
            <Cite id="F07-87">AWS General Reference, Greengrass V2 quotas</Cite>{' '}
            <Cite id="F05-20">LeRobot v0.7.0 datasets/utils.py, file size defaults</Cite>{' '}
            <Cite id="F07-97">AWS General Reference, AWS IoT Core quotas</Cite>
          </Box>
          <Box variant="p">
            And a rollout, the staged spread of a new version across the arms, has a brake and no automatic reverse
            gear. It can be stopped when the new policy runs badly, the arms that already took it keep it, and going
            back is a second deployment. Earlier sections used the word rollout for one run of a policy on one arm;
            from here on it means this spread across a fleet.{' '}
            <Cite id="F07-95">AWS IoT developer guide, Job configurations</Cite>{' '}
            <Cite id="F07-164">Greengrass developer guide, Cancel deployments</Cite>
          </Box>
          <Box variant="p">
            On AWS the delivery runs through AWS IoT (Internet of Things) Greengrass, in two halves. On each
            arm&apos;s computer runs the nucleus, which makes that computer a core device. In the cloud you create
            deployments, each a list of components at fixed versions for one core device or a group, and the nucleus
            installs whatever its deployment lists. A component carries the policy as a recipe, the short file that
            says what to fetch and how to start it, and artifacts, the files it fetches. The artifacts of one
            component may total at most 2 GB, and the limit cannot be raised.{' '}
            <Cite id="F07-120">Greengrass developer guide, What is AWS IoT Greengrass</Cite>{' '}
            <Cite id="F07-121">Greengrass developer guide, How it works</Cite>{' '}
            <Cite id="F07-123">Greengrass developer guide, Manage deployments</Cite>{' '}
            <Cite id="F07-122">Greengrass developer guide, How it works</Cite>{' '}
            <Cite id="F07-151">Greengrass component recipe reference</Cite>{' '}
            <Cite id="F07-87">AWS General Reference, Greengrass V2 quotas</Cite>
          </Box>
          <Box variant="p">
            AWS&apos;s example deployment shows what those facts do to a small fleet. Take an illustrative fleet of
            twenty {ARM} desktop arms behind one 100 Mbit/s site link. The example&apos;s rule that cancels a failing
            rollout can never fire, because it waits until 100 arms have been notified and the fleet has 20. Its
            rollout rate starts by notifying 5 arms a minute and doubles once 10 have been notified, so every arm has
            been told to update within 3 minutes (10 at 5 a minute, then 10 at 10).{' '}
            <Cite id="F07-162">Greengrass developer guide, Create deployments</Cite>{' '}
            <Cite id="F07-94">AWS IoT API reference, AbortCriteria</Cite>{' '}
            <Cite id="F07-93">AWS IoT developer guide, Job rollout rates</Cite>
          </Box>
          <Box variant="p">
            The download cannot keep that pace. One arm alone needs 8 minutes to fetch the policy (6 GB is{' '}
            <Derived>48,000</Derived> megabits, and <Derived>48,000 / 100</Derived> = <Derived>480</Derived> s), past
            the example&apos;s 5-minute limit per arm, and twenty downloading at once share the link for{' '}
            <Derived>160</Derived> minutes (<Toy>20</Toy> x 8).{' '}
            <Cite id="F07-162">Greengrass developer guide, Create deployments</Cite>
          </Box>
          <Box variant="p">
            The 6 GB is a size on disk. NVIDIA&apos;s Jetson AI Lab tutorial runs pi0.5 on a Jetson Thor, one of
            NVIDIA&apos;s onboard robot computers, and lists the weights as &quot;~6 GB+&quot; among its storage
            prerequisites. Those are the files a deployment moves to every arm, and the 2 GB limit applies to
            files. Whether a policy that size also fits in a smaller board&apos;s memory, beside everything
            else the board runs, is a check to make on that board before planning its delivery. For delivery, the component either points
            at the weights or carries them in pieces, and that choice decides who checks the bytes and who resumes a
            broken download.{' '}
            <Cite id="F07-54">Jetson AI Lab tutorial, OpenPi on Thor</Cite>{' '}
            <Cite id="F07-87">AWS General Reference, Greengrass V2 quotas</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Pick what the component carries and what it fetches, knowing which route leaves the byte check and the resume to you"
          >
            Getting 6 GB through a 2 GB package
          </Header>
        }
      >
        <SpaceBetween size="s">
          <Box variant="p">
            Two routes leave the weights where the component can point at them; the third cuts them into pieces it
            can carry. Each route hands two jobs, checking the bytes and resuming a broken download, to a different
            owner. A check compares the bytes with a digest, a hash of the content fixed in advance, so a reference by
            digest names exactly one set of bytes. A recipe&apos;s lifecycle lists the commands the nucleus runs,
            among them an <code>install</code> step and a step that starts the software. The mechanisms are
            documented, and the three routes are designs built from them for weights this size.{' '}
            <Cite id="F07-152">Greengrass component recipe reference, artifacts</Cite>{' '}
            <Cite id="F07-128">Greengrass component recipe reference, lifecycle</Cite>{' '}
            <Cite id="F07-168">AWS General Reference quotas and Greengrass developer guide</Cite>
          </Box>
          <FourColTable
            head={['Route', 'The component carries', 'Who checks and resumes the bytes', 'The limit that bites']}
            rows={ROUTES}
            minWidth={760}
          />
          <Box variant="p">
            Which route to take turns on the question the quota page leaves open. If a multi-gigabyte{' '}
            <code>docker:</code> image deploys, take the image on a steady link: one component version per release, a
            pull the Docker application manager handles, and a GPU container started from a recipe, as in both AWS
            samples that run a model on a Jetson. Neither settles the size question: the Physical AI Toolchain
            sample fetches its model file as a separate S3 artifact. Deploying such an image is the first test to
            run on a device.{' '}
            <Cite id="F07-168">AWS General Reference quotas and Greengrass developer guide</Cite>{' '}
            <Cite id="F07-84">Greengrass nucleus changelog, 2.18.4</Cite>{' '}
            <Cite id="F07-157">AWS samples: genai-at-edge and the Physical AI Toolchain edge stack</Cite>{' '}
            <Cite id="F07-195">AWS Physical AI Toolchain sample, edge-stack.ts, inference component</Cite>
          </Box>
          <Box variant="p">
            Split if the image is refused or the link drops often. The nucleus then owns both the check and the
            resume, so a dropped link costs time and only the deployment&apos;s per-arm time limit ends a slow
            download. The price is a raised store limit
            (<code>componentStoreMaxSizeBytes</code> in the nucleus configuration) and one version per piece per
            release. Fetching from S3 in your own install step comes last, since it leaves both jobs to your
            script.{' '}
            <Cite id="F07-169">aws-greengrass-nucleus v2.18.4, ArtifactDownloader.java and S3Downloader.java</Cite>{' '}
            <Cite id="F07-170">Greengrass nucleus, componentStoreMaxSizeBytes</Cite>
          </Box>
          <Box variant="p">
            A component version names fixed bytes, and the nucleus holds it to them. It checks each artifact against
            a digest computed when the version was created, and &quot;If the hash doesn&apos;t match the
            digest, the deployment fails.&quot; AWS&apos;s Physical AI Toolchain sample, a skeleton that creates no
            deployment, points its inference component at an artifact under the key <code>latest/policy.trt</code>.
            Once that object is replaced, every later install of that component version fails the check. Give new weights a new key or a new version, never a reused name. An install script on the S3 route gets
            no such check unless it computes one.{' '}
            <Cite id="F07-152">Greengrass component recipe reference, artifacts</Cite>{' '}
            <Cite id="F07-196">AWS Physical AI Toolchain sample, edge-stack.ts</Cite>
          </Box>
          <Box variant="p">
            New versions are not free either. AWS allows 5,000 versions of one component in a Region, so a training
            loop that registers every hourly checkpoint as a component version, deployed or not, runs out in about
            208 days (5,000 / 24). A new S3 key passed in the deployment&apos;s configuration spends no version at
            all, a point in favour of the S3 route.{' '}
            <Cite id="F07-167">AWS General Reference, Greengrass V2 quotas</Cite>{' '}
            <Cite id="F07-160">Greengrass developer guide, Create deployments, configuration update</Cite>
          </Box>
          <Box variant="p">The image route&apos;s recipe, as AWS documents it, shows how little the component itself holds.</Box>
          <Snippet
            title="A container component recipe, as AWS documents it for a private registry image"
            mode="copied"
            source={<Cite id="F07-153">Greengrass developer guide, Run a Docker container</Cite>}
          >
            {RECIPE}
          </Snippet>
          <Box variant="p">
            The artifact is the image&apos;s address behind a <code>docker:</code> prefix: a reference, with no bytes
            in it. The square brackets take a tag or a digest, and only the digest fixes the image, since a tag can
            be moved to another one. An address with neither pulls &quot;the latest available version of that
            image&quot; on the day each device deploys, so two arms in one rollout can run different policies. The
            lifecycle line starts the container under <code>Run</code>, which lets a deployment report success
            before the policy has loaded.{' '}
            <Cite id="F07-154">Greengrass developer guide, Docker application manager</Cite>{' '}
            <Cite id="F07-129">Greengrass component recipe reference, run and startup</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Let the policy finish its episode before it is replaced, and make a policy that fails to load roll its arm back by itself"
          >
            When an update lands in the middle of an episode
          </Header>
        }
      >
        <SpaceBetween size="s">
          <Box variant="p">
            A deployment reaches an arm while the arm is working. The control loop runs inside the policy container
            (section 17, Running on the Robot), so while one version stops and the next starts, nothing sends the arm
            new goals, and the swap belongs at a moment when the arm can stand still safely, with the gripper empty.
            The nucleus comes in two builds, and they meet that moment differently.
          </Box>
          <Box variant="p">
            The Java nucleus, which needs at least 96 MB of RAM, asks first by default: it
            notifies each running component before it stops and replaces it. A component that has
            subscribed to these notifications can answer with a deferral and a delay of its own choosing, and the
            nucleus asks again when the delay is up. One that does not answer within 60 seconds, the default, is
            replaced anyway: &quot;the deployment proceeds on the device&quot;. A policy component can therefore
            hold the update until the episode ends and the gripper is empty, then acknowledge.{' '}
            <Cite id="F07-84">Greengrass nucleus v2.18.4 requirements</Cite>{' '}
            <Cite id="F07-90">Greengrass V2 API reference, DeploymentComponentUpdatePolicy</Cite>
          </Box>
          <Box variant="p">
            Answering takes plumbing that AWS&apos;s container recipe lacks. A component talks to the nucleus over a
            local socket, through IPC (interprocess communication), and only for the operations an{' '}
            <code>accessControl</code> policy in its configuration grants it. A container also needs that socket mounted and two environment variables passed in:{' '}
            <code>SVCUID</code> and <code>AWS_GG_NUCLEUS_DOMAIN_SOCKET_FILEPATH_FOR_COMPONENT</code>. The documented recipe has none of the three, so copied as
            printed it cannot defer, and the nucleus replaces it after 60 seconds whatever the arm is doing.{' '}
            <Cite id="F07-155">Greengrass developer guide, authorize components for IPC; IPC in Docker components</Cite>{' '}
            <Cite id="F07-90">Greengrass V2 API reference, DeploymentComponentUpdatePolicy</Cite>
          </Box>
          <Box variant="p">
            Beside an arm, run the Java nucleus. Nucleus lite, written for constrained devices and documented at
            under 15 MB of memory, saves about <Derived>80</Derived> MB (96 - 15), little on a board with
            gigabytes, and gives up the deferral to do it: its README at v2.7.0 lists 12 IPC operations, and{' '}
            <code>SubscribeToComponentUpdates</code> and <code>DeferComponentUpdate</code> are not among them.{' '}
            <Cite id="F07-84">Greengrass nucleus v2.18.4 requirements</Cite>{' '}
            <Cite id="F07-85">aws-greengrass-lite v2.7.0 and Greengrass developer guide</Cite>{' '}
            <Cite id="F07-137">aws-greengrass-lite v2.7.0, README</Cite>
          </Box>
          <Box variant="p">
            A Greengrass deployment cannot carry a maintenance window either: the AWS IoT jobs service that carries
            deployments can schedule work into one, but a deployment exposes only its pace, abort rule and time
            limit. On lite, an update stays away from a moving arm only if the arms stay idle from the deployment&apos;s
            creation until each has swapped, up to <Derived>160</Derived> minutes of download on the illustrative
            link.{' '}
            <Cite id="F07-179">AWS IoT developer guide, Jobs scheduling; Greengrass DeploymentIoTJobConfiguration</Cite>
          </Box>
          <Box variant="p">
            When the new version starts, the recipe&apos;s start step decides what counts as success. With <code>run</code>, &quot;the deployment can be complete and
            successful even if the run lifecycle script fails soon after running&quot;. With <code>startup</code>,
            the deployment stays <code>IN_PROGRESS</code> until the start script exits or the component reports its
            own state, <code>RUNNING</code> or <code>ERRORED</code>.{' '}
            <Cite id="F07-129">Greengrass component recipe reference, run and startup</Cite>
          </Box>
          <Box variant="p">
            A policy component written with <code>startup</code> can load its weights, run one warm-up inference
            and only then report <code>RUNNING</code>. Inside a container the policy sends that report itself, with
            the <code>UpdateState</code> IPC operation, through the same socket and variables the deferral needs;
            both nuclei offer the operation. All four container recipes on AWS&apos;s Docker page start the
            container under <code>Run</code>, so this gate is yours to write.{' '}
            <Cite id="F07-129">Greengrass component recipe reference, run and startup</Cite>{' '}
            <Cite id="F07-155">Greengrass developer guide, IPC in Docker components</Cite>{' '}
            <Cite id="F07-137">aws-greengrass-lite v2.7.0, README</Cite>{' '}
            <Cite id="F07-156">Greengrass developer guide, Run a Docker container, all recipes</Cite>
          </Box>
          <Box variant="p">
            If the weights fail to load, the policy reports <code>ERRORED</code>, the deployment fails on that arm,
            and by default &quot;the AWS IoT Greengrass Core software rolls back that core device to its previous
            configuration&quot;. A component that errors three times without recovering becomes{' '}
            <code>BROKEN</code> and stays so until it is deployed again.{' '}
            <Cite id="F07-163">Greengrass developer guide, Create deployments, failure handling</Cite>{' '}
            <Cite id="F07-130">Greengrass component recipe reference, recover</Cite>
          </Box>
          <Box variant="p">
            The gate proves only that the software runs. The cloud sees each core device as <code>HEALTHY</code> or{' '}
            <code>UNHEALTHY</code>, and unhealthy means a process is in an error state. Whether the arm managed to {TASK_STORY} has to come back as data, in a per-episode record sent with the
            episodes.{' '}
            <Cite id="F07-131">Greengrass developer guide, Check core device status</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Size the per-device timeout to your download and the abort rule to your fleet, then stage the update through a few arms first, which the rate cannot do for twenty"
          >
            Rollout settings for tens of arms, ranked by what they break
          </Header>
        }
      >
        <SpaceBetween size="s">
          <Box variant="p">
            A deployment to many arms targets a thing group. A thing is AWS IoT&apos;s record of one device, here
            the computer beside one arm, and a thing group is a named set of things; adding a replacement computer to
            the group is how it joins the fleet. A staged update, the general software practice this section recommends, goes first to a canary group, a few arms in a thing
            group of their own that take it before the rest, and then to the fleet group.{' '}
            <Cite id="F07-121">Greengrass developer guide, How it works</Cite>{' '}
            <Cite id="F07-123">Greengrass developer guide, Manage deployments</Cite>
          </Box>
          <Box variant="p">
            Greengrass sends a group deployment as an AWS IoT job, a remote operation run on many devices, and the
            job&apos;s copy on one device is a job execution. The settings that shape the spread are the job&apos;s
            own, the same options any AWS IoT Core job takes: a rate at which arms are notified, a rule that cancels
            the job, and a time limit per arm.{' '}
            <Cite id="F07-178">AWS IoT developer guide, Jobs key concepts</Cite>{' '}
            <Cite id="F07-162">Greengrass developer guide, Create deployments</Cite>
          </Box>
          <AnimatedFigure
            name="a staged rollout with the abort case"
            steps={ROLLOUT_STEPS}
            intervalMs={2800}
            cites="F07-90 F07-93 F07-95 F07-129 F07-162 F07-163 F07-164 F07-165"
            caption={
              <>
                The moving dot is the new policy version. Of the twenty arms,
                three are canaries in their own thing group and seventeen are in the fleet group. In the last step the
                abort cancels the eight arms still queued; the seven updated keep the new version, and the two that
                failed are back on 1.4.0 by the default failure handling. It assumes a minimum the group can reach and a pace slow enough to leave arms queued
                when failures arrive; the example&apos;s settings give neither. Illustrative: the counts, the versions
                and the moment failures arrive are invented; the 60 s is the documented default wait for a component
                that does not answer.
              </>
            }
          >
            {(step, reduced) => <RolloutDiagram step={step} reduced={reduced} />}
          </AnimatedFigure>
          <Snippet
            title="A create-deployment document with a rollout rate, an abort rule and a timeout, as AWS documents it"
            mode="copied"
            source={<Cite id="F07-162">Greengrass developer guide, Create deployments</Cite>}
          >
            {DEPLOYMENT_DOC}
          </Snippet>
          <Box variant="p">
            AWS&apos;s example deploys an industrial dashboard, and only its policies and job settings carry over to
            a fleet of arms. <code>components</code> is the list the target should run.{' '}
            <code>deploymentPolicies</code> is what happens on each arm: ask components before replacing them (this
            example waits 30 seconds for an answer), give them time to validate new configuration, and roll back on
            failure. <code>iotJobConfiguration</code> is the spread: notify 5 arms a minute, double the rate once 10
            have been notified or 5 have succeeded, never exceed 50 a minute, cancel once 5% of executions have
            failed after at least 100 arms were notified, and give each arm 5 minutes.{' '}
            <Cite id="F07-161">Greengrass developer guide, deployment policies</Cite>{' '}
            <Cite id="F07-162">Greengrass developer guide, Create deployments</Cite>
          </Box>
          <Box variant="p">
            Copied onto twenty arms, four of those settings go wrong. In order of what each one breaks, from a bad
            policy that reaches every arm to a good one that is cancelled:
          </Box>
          <Box variant="p">
            <strong>1. The abort rule needs a minimum the fleet can reach.</strong> Without one the rollout has no
            automatic brake.
            The rule cannot fire until{' '}
            <code>minNumberOfExecutedThings</code> arms have been notified. A group of twenty never reaches the
            example&apos;s 100, so the rollout runs to its end however many arms fail. Set the minimum to a count the
            group reaches while most arms are still queued, and the threshold where the first failures you would not
            accept cross it. With a minimum of 5 and a threshold of <Toy>20</Toy>% (toy numbers), one failure among
            the first five arms stops the spread.{' '}
            <Cite id="F07-94">AWS IoT API reference, AbortCriteria</Cite>
          </Box>
          <Box variant="p">
            <strong>2. A success has to mean the policy loaded.</strong> The abort rule and the rate both count what
            each arm&apos;s deployment reports. Under <code>run</code>, an arm whose policy crashes a second after
            launch reports success, so a broken policy speeds the rollout up where it should stop it. Under{' '}
            <code>startup</code> with a warm-up inference, the same crash is a failure the abort counts.{' '}
            <Cite id="F07-129">Greengrass component recipe reference, run and startup</Cite>{' '}
            <Cite id="F07-93">AWS IoT developer guide, Job rollout rates</Cite>
          </Box>
          <Box variant="p">
            <strong>3. For tens of arms, stage with groups, because the rate does not wait for results.</strong> The rate
            notifies arms at a base rate per minute and multiplies it when a count of notified or of succeeded arms
            is reached, whichever comes first; AWS&apos;s own rate example steps every 1,000 devices, a fleet fifty times this one. Notifications
            reach their count whatever the arms report, so the example doubles after 10 / 5 = 2 minutes and, on the
            illustrative link, notifies all twenty before any arm can finish its download. Stage with a canary group
            that takes the update first, and create the fleet group&apos;s deployment only once the canaries&apos;
            records read well.{' '}
            <Cite id="F07-93">AWS IoT developer guide, Job rollout rates</Cite>{' '}
            <Cite id="F07-162">Greengrass developer guide, Create deployments</Cite>
          </Box>
          <Box variant="p">
            <strong>4. The per-device timeout has to cover the download.</strong> The clock starts when an
            arm&apos;s job execution turns <code>IN_PROGRESS</code>; an arm still unfinished when it runs out is
            marked <code>TIMED_OUT</code>, which the failure type <code>ALL</code> counts. On the illustrative link
            the 6 GB policy needs 8 minutes for one arm and up to <Derived>160</Derived> minutes for twenty
            together, so under the example&apos;s 5 every arm is marked <code>TIMED_OUT</code>. Once the abort can
            fire, those timeouts alone cross its threshold and cancel a good policy. Set the
            timeout above a download measured with as many arms at once as the rate allows, plus install and
            start-up; it may be anything from 1 minute to 7 days.{' '}
            <Cite id="F07-162">Greengrass V2 API reference, IoTJobTimeoutConfig</Cite>{' '}
            <Cite id="F07-94">AWS IoT API reference, AbortCriteria</Cite>
          </Box>
          <Box variant="p">
            The canaries need a group of their own. A device runs the union of every deployment that targets it, its
            own thing plus each group it belongs to, and a thing deployment and a group deployment that pin different
            versions of one component fail on the device (AWS&apos;s log line: &quot;No local or cloud component
            version satisfies the requirements&quot;). A canary left in the fleet group cannot be handed the new
            version directly. Put the canaries in a separate thing group, or use a subdeployment, which targets a subset of a
            parent deployment&apos;s devices; the subdeployment page does not say whether one may pin a version
            different from its parent&apos;s.{' '}
            <Cite id="F07-125">Greengrass developer guide, Create deployments</Cite>{' '}
            <Cite id="F07-126">Greengrass developer guide, Manage deployments, dependency resolution failures</Cite>{' '}
            <Cite id="F07-165">Greengrass developer guide, Create subdeployments</Cite>
          </Box>
          <Box variant="p">
            <strong>The abort rule sees only what arms report, so make the report carry behaviour.</strong> The job
            service judges no task: a device &quot;must be programmed to report the FAILURE status&quot;. A policy
            component can run the trial itself. It holds its <code>startup</code> step open through a set of trial
            episodes and reports <code>RUNNING</code> only if enough succeed, with the startup timeout raised from its
            120 s default to cover them and the per-device timeout above that. A policy that loads and drops blocks
            then fails its deployment, rolls its arm back and counts toward the abort. The design is ours, built from
            documented parts.{' '}
            <Cite id="F07-96">AWS IoT developer guide, Job configurations, abort cases</Cite>{' '}
            <Cite id="F07-128">Greengrass component recipe reference, lifecycle</Cite>{' '}
            <Cite id="F07-129">Greengrass component recipe reference, run and startup</Cite>
          </Box>
          <Box variant="p">
            The trial needs a judge for each episode, and LeRobot&apos;s reinforcement-learning setup shows the two
            on offer: a small image classifier trained beforehand on success and failure frames, or a person marking
            success with a gamepad or keyboard (section 8, Reinforcement Learning for Robots).{' '}
            <Cite id="F04-74">HIL-SERL paper, sections 3.2 and 3.3</Cite>{' '}
            <Cite id="F04-77">LeRobot v0.7.0 hilserl.mdx</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Know what an abort leaves running on the arms, put a bad policy's arms back with a revision built from the current one, and apply every correction to AWS's examples in one pass"
          >
            A brake and no reverse gear
          </Header>
        }
      >
        <SpaceBetween size="s">
          <Box variant="p">
            The abort&apos;s only action is <code>CANCEL</code>, and a cancel is narrow: &quot;only QUEUED job
            executions are canceled&quot;, while executions in progress &quot;will not be canceled&quot;. Cancelling
            the whole deployment by hand reaches no further: &quot;If a core device already runs the deployment, you
            won&apos;t change the components on that device when you cancel the deployment.&quot; So the abort
            saves only the arms still queued when failures start.{' '}
            <Cite id="F07-94">AWS IoT API reference, AbortCriteria</Cite>{' '}
            <Cite id="F07-95">AWS IoT developer guide, Job configurations</Cite>{' '}
            <Cite id="F07-164">Greengrass developer guide, Cancel deployments</Cite>
          </Box>
          <Box variant="p">
            At the example&apos;s pace, on the illustrative link, the failed starts that would set the abort off arrive only after every arm
            has been told to update. For tens of arms the canary group is the brake, and the abort rule guards the
            fleet group&apos;s deployment at a pace slow enough to leave arms queued; a constant rate may go as low
            as 1 arm a minute.{' '}
            <Cite id="F07-162">Greengrass developer guide, Create deployments</Cite>{' '}
            <Cite id="F07-92">AWS IoT API reference, ExponentialRolloutRate and JobExecutionsRolloutConfig</Cite>
          </Box>
          <Box variant="p">
            The one automatic undo covers one arm: a start that fails rolls that arm back, the default failure
            handling. Across the fleet there is no automatic undo. A policy that starts cleanly and then drops blocks is a
            healthy deployment as far as Greengrass knows, and putting those arms back takes a new revision for the
            same target that pins the previous version. Creating it also cancels the job of the revision before.{' '}
            <Cite id="F07-89">Greengrass V2 API reference, DeploymentPolicies</Cite>{' '}
            <Cite id="F07-164">Greengrass developer guide, Cancel deployments and Check deployment status</Cite>
          </Box>
          <Box variant="p">
            Build every revision, the revert included, from the current one. A deployment is the whole list of
            components its target should run: &quot;A new deployment to the same target overwrites the previous
            deployment to the target&quot;, and a component missing from the new revision is uninstalled. A revert
            that lists only the old policy would remove the episode uploader with it. Fetch the current revision,
            change the policy&apos;s version and nothing else, and create the deployment from that.{' '}
            <Cite id="F07-124">Greengrass developer guide, Manage deployments</Cite>
          </Box>
          <Box variant="p">
            Pin everything else in the same document. A deployment installs the latest supported versions of a
            component&apos;s dependencies, so a revision can bring in new patch versions of AWS&apos;s own
            components, and &quot;Some automatic updates, such as a nucleus update, can cause your devices to restart
            unexpectedly.&quot; List the nucleus, the Docker application manager and the token exchange service with
            explicit versions beside the policy, so that a new policy version is the only thing a rollout changes.{' '}
            <Cite id="F07-166">Greengrass developer guide, Manage deployments, deployment options</Cite>
          </Box>
          <Box variant="p">
            AWS&apos;s printed recipe and deployment document need these changes before they carry a policy to twenty
            arms, in the order you would make them:
          </Box>
          <ol style={LIST}>
            <li>
              In the recipe, name the image by digest, in the artifact URI and in the <code>docker run</code> line.
            </li>
            <li>
              Add the GPU flag both AWS samples pass on a Jetson, <code>--runtime nvidia</code>.{' '}
              <Cite id="F07-157">AWS samples: genai-at-edge and the Physical AI Toolchain edge stack</Cite>
            </li>
            <li>
              Start the container under <code>startup</code>, and have the policy report <code>RUNNING</code> with{' '}
              <code>UpdateState</code> only after a warm-up inference or a set of trial episodes.
            </li>
            <li>
              Raise the 120 s default timeout of <code>startup</code> to cover the trial episodes.{' '}
              <Cite id="F07-128">Greengrass component recipe reference, lifecycle</Cite>
            </li>
            <li>
              Grant <code>SubscribeToComponentUpdates</code> and <code>DeferComponentUpdate</code> in an{' '}
              <code>accessControl</code> policy.
            </li>
            <li>
              Mount the nucleus socket into the container and pass <code>SVCUID</code> and{' '}
              <code>AWS_GG_NUCLEUS_DOMAIN_SOCKET_FILEPATH_FOR_COMPONENT</code>.
            </li>
            <li>In the deployment document, start from the current revision, so it lists every component the arm runs.</li>
            <li>Pin the nucleus, the Docker application manager and the token exchange service to explicit versions.</li>
            <li>
              Set <code>minNumberOfExecutedThings</code> to a count the group reaches while most arms are queued, and
              the threshold where the first failures you would not accept cross it (5 and <Toy>20</Toy>% in the toy
              example).
            </li>
            <li>
              Set <code>inProgressTimeoutInMinutes</code> above a download measured with arms downloading together,
              plus install and start-up.
            </li>
            <li>Deploy to the canary thing group first, and to the fleet group once the canaries&apos; records read well.</li>
          </ol>
          <Box variant="p">
            Pinning reaches AWS&apos;s components and stops at the operating system. The AWS pages read describe no
            managed update of a Linux device&apos;s operating system. On a Jetson that system is Jetson Linux, shipped in NVIDIA&apos;s JetPack
            release, and NVIDIA documents its update tools, including image-based updates written partition by
            partition, with no fleet service. A JetPack upgrade across the arms is a rollout you plan and run
            yourself.{' '}
            <Cite id="F07-185">Greengrass developer guide, Update the Core software</Cite>{' '}
            <Cite id="F07-44">JetPack downloads page</Cite>{' '}
            <Cite id="F07-186">Jetson Linux developer guide, update mechanism</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Budget the uplink from the arm's own recorded bytes, ship closed files to S3 and a per-episode verdict as a message, and see how fast one published fleet closed the loop"
          >
            Episodes back: files to S3, a verdict over MQTT
          </Header>
        }
      >
        <SpaceBetween size="s">
          <Box variant="p">
            The return traffic is small per arm and flows whenever the arm records. In the example dataset of section 9, Collecting
            Data, two 640x480 cameras cost about 775 MB of video per robot-hour, 0.86 Mbit/s per camera. An arm that
            records all hour sends about <Derived>1.72</Derived> Mbit/s (2 x 0.86), or <Derived>0.215</Derived> MB
            a second (775 MB / 3,600 s).{' '}
            <Cite id="F05-29">Hugging Face hub file listing of the example dataset</Cite>{' '}
            <Cite id="F05-30">from the file sizes of the example dataset</Cite>
          </Box>
          <Box variant="p">
            Fleet size turns that trickle into a link budget. Twenty arms send about <Derived>34</Derived> Mbit/s (<Toy>20</Toy> x{' '}
            <Derived>1.72</Derived>). An illustrative hundred send <Derived>172</Derived> Mbit/s, more than a symmetric <Toy>100</Toy> Mbit/s
            site link carries upstream, so at that size the uploads, rather than the policy download, set the size
            of the link.{' '}
            <Cite id="F05-30">from the file sizes of the example dataset</Cite>{' '}
            <Cite id="F07-54">Jetson AI Lab tutorial, OpenPi on Thor</Cite>
          </Box>
          <Box variant="p">
            Per event, delivery is the heavy direction. One rollout to twenty arms moves <Derived>120</Derived> GB
            (<Toy>20</Toy> x 6), as much as those arms record in <Derived>7.7</Derived> hours at{' '}
            <Derived>15.5</Derived> GB an hour (<Toy>20</Toy> x 775 MB).{' '}
            <Cite id="F05-30">from the file sizes of the example dataset</Cite>{' '}
            <Cite id="F07-54">Jetson AI Lab tutorial, OpenPi on Thor</Cite>
          </Box>
          <ExpandableSection headerText="For scale: the same arm's raw video, and a sensor-rich robot">
            <SpaceBetween size="s">
              <Box variant="p">
                The arm&apos;s budget is small because its video is encoded at the bench. Raw, the same frames would
                be 640 x 480 pixels x 3 bytes x 30 frames a second x 2 cameras x 3,600 s = 199 GB an hour per arm,
                about 257 times as much (199 GB / 775 MB).{' '}
                <Cite id="F05-29">Hugging Face hub file listing of the example dataset</Cite>{' '}
                <Cite id="F05-30">from the file sizes of the example dataset</Cite>
              </Box>
              <Box variant="p">
                A sensor-rich robot breaks the link budget above. &quot;The Robot Data Factory&quot; models a reference robot with
                seven 1920x1080 video streams at 30 fps, a LiDAR (a laser range scanner) and scalar sensors recording
                around the clock, and its authors compute 38.41 MB/s, 3.32 TB per robot per day, as a model with no
                measurement behind it. That is about <Derived>179</Derived> times the arm&apos;s{' '}
                <Derived>0.215</Derived> MB/s (<Derived>38.41 / 0.215</Derived>), and <Derived>307</Derived> Mbit/s
                (38.41 x 8) for one robot: three times the illustrative link. A fleet of such robots chooses what to
                upload before it chooses how.{' '}
                <Cite id="F07-106">The Robot Data Factory, appendix B.3</Cite>{' '}
                <Cite id="F05-30">the arm&apos;s 0.215 MB/s, from the file sizes of the example dataset</Cite>
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <Box variant="p">
            The connection each arm already holds is the wrong pipe for the files, and size is the reason. It runs to
            AWS IoT Core, the service that holds the device registry and the message broker, and speaks MQTT (Message
            Queuing Telemetry Transport), a protocol in which a device publishes small messages to named topics. Its
            rate would do: a connection moves 512 KB a second against one arm&apos;s <Derived>0.215</Derived> MB. Its message size would
            not: a message may be at most 128 KB, and a 200 MB video file would have to travel as about{' '}
            <Derived>1,600</Derived> messages (<Derived>200 x 1,024 / 128</Derived>) and be reassembled in the
            cloud.{' '}
            <Cite id="F07-97">AWS General Reference, AWS IoT Core quotas</Cite>{' '}
            <Cite id="F05-20">LeRobot v0.7.0 datasets/utils.py, file size defaults</Cite>{' '}
            <Cite id="F05-30">from the file sizes of the example dataset</Cite>
          </Box>
          <Box variant="p">
            The two limits split the traffic: the files go to Amazon S3, and MQTT carries a short per-episode
            record, which arm, which policy version, success or failure.{' '}
            <Cite id="F07-176">AWS IoT developer guide, Basic Ingest and the S3 rule action</Cite>
          </Box>
          <Box variant="p">
            That record can reach S3 without the broker. AWS IoT Core runs rules, each a query over incoming messages
            with actions that send the matches to other services. With Basic Ingest a device publishes to a reserved
            topic that starts with <code>$aws/rules/</code> plus a rule&apos;s name, and that rule&apos;s actions run
            &quot;without incurring messaging costs&quot;; the S3 rule action writes each message to a bucket as its own object when the key
            carries a timestamp. The record is the task-level evidence the health check lacks, and it is what an
            operator reads before creating the fleet group&apos;s deployment.{' '}
            <Cite id="F07-176">AWS IoT developer guide, Basic Ingest and the S3 rule action</Cite>
          </Box>
          <Box variant="p">
            For the current state of each arm, use the device shadow: a small JSON document per thing, kept in the
            cloud and readable while the arm is offline. Report the running policy version and a success count there,
            and fleet indexing, the AWS IoT feature that makes the registry and the shadows searchable, can find the
            arms on the new policy whose success rate fell with one query. Nucleus lite has no shadow support of its
            own.{' '}
            <Cite id="F07-177">AWS IoT developer guide, Device Shadow service</Cite>{' '}
            <Cite id="F07-182">AWS IoT developer guide, Fleet indexing</Cite>{' '}
            <Cite id="F07-135">Greengrass developer guide, feature compatibility</Cite>
          </Box>
          <Box variant="p">
            What an uploader can ship is a closed file, and LeRobot&apos;s writer does not close one per episode. It
            appends each episode&apos;s video to the current MP4 until the file would pass 200 MB, then starts the
            next; at the example&apos;s 387 MB per camera-hour a file closes about every <Derived>31</Derived>{' '}
            minutes (<Derived>200 / 387 x 60</Derived>). Its Parquet files, the table files that hold the frame rows,
            are valid only after <code>finalize()</code>, which <code>lerobot-record</code> calls after the last
            episode, so the rows can be shipped only once a recording session ends. The verdict a rollout waits for
            does not wait with them: it travels as the per-episode MQTT record.{' '}
            <Cite id="F05-19">LeRobot v0.7.0 dataset_writer.py</Cite>{' '}
            <Cite id="F05-30">from the file sizes of the example dataset</Cite>{' '}
            <Cite id="F05-3">LeRobot v0.7.0 lerobot_record.py and dataset docs</Cite>
          </Box>
          <Box variant="p">
            LeRobot&apos;s own uploader targets the Hugging Face Hub, so the S3 path is code you write.
            LeRobot&apos;s continuous recording mode, the sentry strategy, shows the fix: it sets episode boundaries
            so that &quot;each saved episode produces a complete video file&quot;, which an uploader can ship as soon
            as it closes.{' '}
            <Cite id="F07-112">LeRobot v0.7.0, inference.mdx</Cite>
          </Box>
          <Box variant="p">
            Two kinds of component move the closed files to S3. Stream manager is a Greengrass component that
            queues data on the device and exports it in the background. The other is a component you write that
            calls S3 directly.{' '}
            <Cite id="F07-171">Greengrass developer guide, Manage data streams</Cite>{' '}
            <Cite id="F07-175">Greengrass developer guide, Interact with AWS services</Cite>
          </Box>
          <ThreeColTable head={['', 'Stream manager', 'A component that calls S3 itself']} rows={UPLOAD_ROWS} minWidth={680} />
          <Box variant="p">
            On the Java nucleus, take stream manager. The documented minimums of the nucleus and stream manager add
            to 96 + 70 = <Derived>166</Derived> MB before any policy loads, little beside a board&apos;s gigabytes.
            They buy a
            queue, a bandwidth cap on the uplink, and priorities that let a short episode with a human correction go
            ahead of bulk video. The stream manager pages do not say whether it resumes an upload after the device
            reboots.{' '}
            <Cite id="F07-84">Greengrass nucleus v2.18.4 requirements</Cite>{' '}
            <Cite id="F07-171">Greengrass developer guide, Manage data streams</Cite>{' '}
            <Cite id="F07-173">Greengrass developer guide, stream manager configuration</Cite>
          </Box>
          <Box variant="p">
            Where a small board runs nucleus lite, write the direct component instead, since stream manager is a Java program that needs
            at least 70 MB where lite is documented at under 15 MB. With multipart upload at the 5 MB minimum part
            size, a 200 MB video file goes up in 40 parts and a dropped link costs one part. Stream manager does this
            for you; in a direct component the upload code is yours, since AWS&apos;s example recipe of that kind,
            printed in section 24, Orchestrating Physical AI on AWS, only lists buckets.{' '}
            <Cite id="F07-139">Greengrass developer guide, Stream manager</Cite>{' '}
            <Cite id="F07-171">Greengrass developer guide, Manage data streams</Cite>{' '}
            <Cite id="F07-85">Greengrass developer guide, Greengrass nucleus lite</Cite>{' '}
            <Cite id="F07-173">Greengrass developer guide, stream manager configuration</Cite>{' '}
            <Cite id="F07-102">Amazon S3 user guide, multipart upload limits</Cite>{' '}
            <Cite id="F07-175">Greengrass developer guide, Interact with AWS services</Cite>
          </Box>
          <Box variant="p">
            How fast can the loop close? &quot;Learning While Deploying&quot; ran 16 two-armed robots that upload
            complete episodes to object storage at episode boundaries, while a central learner broadcasts an updated
            shared policy every 50 training steps. On an 8-hour run the authors report that an episode reached the
            learner 41 s after it was produced at the median (148 s at the 99th percentile), and a published model
            reached a robot in 38 s (55 s), figures they note depend on network configuration and contention.{' '}
            <Cite id="F07-108">Learning While Deploying, section V</Cite>{' '}
            <Cite id="F07-109">Learning While Deploying, Table VI</Cite>
          </Box>
          <AnimatedFigure
            name="episodes back to S3 and the loop closing"
            steps={FLEET_LOOP_STEPS}
            intervalMs={2800}
            cites="F07-102 F07-108 F07-109 F07-172"
            caption={
              <>
                Episode files go up from three of the twenty arms into one bucket and across to training, and the next policy
                version comes back down to the three canary arms. The two spans on the ruler are drawn to one scale: they are
                the medians the Learning While Deploying authors report for one 8-hour, 16-robot run of their own
                system. The rest is a schematic, with the arm count and version numbers invented.
              </>
            }
          >
            {(step, reduced) => <FleetLoop step={step} reduced={reduced} />}
          </AnimatedFigure>
          <Box variant="p">
            Those spans show how fast a loop with no staging can close: under a minute each way at the median, with
            a learner broadcasting weights to every robot at once on the authors&apos; own network and model. Staging
            a 6 GB policy on the illustrative link adds the canary wait to the download: three canaries downloading
            together need about <Derived>24</Derived> minutes (3 x 8), then run their trial episodes and report,
            before the fleet group&apos;s deployment starts. Deploy to the whole fleet
            group at once where a fresher policy is worth more than a brake; stage through the canaries where an arm
            running a bad policy costs more than the wait.{' '}
            <Cite id="F07-109">Learning While Deploying, Table VI</Cite>{' '}
            <Cite id="F07-162">Greengrass developer guide, Create deployments</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Place each machine by asking whether its link drops, whether anything may connect in to it, and whether one scheduler must reach it and the cloud GPUs"
          >
            Greengrass core device or Kubernetes hybrid node
          </Header>
        }
      >
        <SpaceBetween size="s">
          <Box variant="p">
            Everything so far assumes a Greengrass core device, which takes its deployment whenever it next
            connects. Each machine is placed before it is hooked up: as a core device, or through AWS&apos;s
            second way to attach a machine outside its cloud, Amazon EKS (Elastic Kubernetes Service) Hybrid Nodes.
            A hybrid node assumes the opposite network: it joins a cloud Kubernetes cluster as a worker node, so the
            scheduler that places training pods on cloud GPUs can place a pod on it too. Three questions, asked in
            order, place two machines: a Jetson beside an arm, and a DGX Spark, NVIDIA&apos;s desk-side machine,
            the example policy server for LeRobot&apos;s remote inference in section 17 (Running on the Robot).{' '}
            <Cite id="F07-123">Greengrass developer guide, Manage deployments</Cite>{' '}
            <Cite id="F07-25">LeRobot remote inference guide</Cite>{' '}
            <Cite id="F09-119">EKS user guide, Hybrid Nodes overview</Cite>
          </Box>
          <Box variant="p">
            <strong>Does the link drop?</strong> A Greengrass device treats offline as a normal state and takes the
            current deployment when it next connects. Hybrid Nodes &quot;is not a fit for disconnected, disrupted,
            intermittent or limited (DDIL) environments&quot;: during a cut its pods keep running and nothing can be
            changed, and a node whose AWS credentials come from Systems Manager, one of the two ways a hybrid node
            gets them, can take up to 30 minutes to rejoin once they have lapsed. A link that drops settles it for
            Greengrass.{' '}
            <Cite id="F07-123">Greengrass developer guide, Manage deployments</Cite>{' '}
            <Cite id="F09-119">EKS user guide, Hybrid Nodes overview</Cite>{' '}
            <Cite id="F09-120">EKS user guide, Hybrid Nodes prerequisites</Cite>{' '}
            <Cite id="F09-125">EKS best practices, hybrid nodes and disconnections</Cite>
          </Box>
          <Box variant="p">
            <strong>May anything connect in?</strong> A Greengrass device only dials out, on port 8883 or 443, so it
            works behind a lab router with no VPN. A hybrid node needs private connectivity in both directions,
            because the EKS control plane opens connections to the node. The
            stated guidance, &quot;not a strict requirement&quot;, is at least 100 Mbps and at most 200 ms round trip.{' '}
            <Cite id="F07-189">AWS IoT developer guide, Device communication protocols</Cite>{' '}
            <Cite id="F09-120">EKS user guide, Hybrid Nodes prerequisites</Cite>
          </Box>
          <Box variant="p">
            <strong>Must one scheduler reach both?</strong> Only then is a hybrid node worth what it costs to run.
            Every Kubernetes node needs a pod network, the plugin that gives each pod an address, and on a hybrid
            node you install and run it yourself.{' '}
            <Cite id="F09-123">EKS user guide, Hybrid Nodes add-ons</Cite>
          </Box>
          <Box variant="p">
            Read together, the answers place the two machines. A Jetson on or beside a robot is a Greengrass core device. A DGX Spark is a hybrid node only when the lab
            already runs its training and evaluation on EKS, the machine sits on a wired network with a VPN or AWS
            Direct Connect (a private link to AWS) to the cluster&apos;s VPC (Virtual Private Cloud, the private
            network the cluster lives in), and somebody will run a pod network on it.{' '}
            <Cite id="F09-127">EKS Hybrid Nodes overview, read for a Jetson and a DGX Spark</Cite>{' '}
            <Cite id="F09-120">EKS user guide, Hybrid Nodes prerequisites</Cite>
          </Box>
          <Box variant="p">
            Beyond the network, the two differ in the platforms their pages name, in GPU access and in what you
            operate:
          </Box>
          <ThreeColTable head={['', 'Greengrass core device', 'EKS hybrid node']} rows={EDGE_ROWS} minWidth={680} />
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Bring one arm's computer into the fleet in the order the documentation sets, and time the first deployment before a second arm joins"
          >
            The hook-up of one Jetson and one Spark
          </Header>
        }
      >
        <SpaceBetween size="s">
          <Box variant="p">
            The documentation sets the order of work for one arm&apos;s computer, and a DGX Spark that joins as a
            core device takes the same steps. No worked example was found for the whole path: none of the AWS posts and
            samples from 2025 or 2026 that were searched runs a GPU policy container on a Jetson with Greengrass V2
            and uploads its episodes to S3.{' '}
            <Cite id="F07-199">AWS sample repositories searched</Cite>
          </Box>
          <ol style={LIST}>
            <li>
              <strong>Create the account side.</strong> Five objects: a thing, a thing group, an AWS IoT policy, an
              IAM (Identity and Access Management) role called the token exchange role, and a role alias, the name through which the device&apos;s certificate reaches that role. The installer can create them with AWS credentials it does not store, or you create them from a
              workstation and no AWS credentials ever sit on the device.{' '}
              <Cite id="F07-144">Greengrass developer guide, Install with automatic provisioning</Cite>{' '}
              <Cite id="F07-145">Greengrass developer guide, Install with manual provisioning</Cite>
            </li>
            <li>
              <strong>Open the network, outbound only.</strong> For basic operation the device dials out to four
              endpoints: the Greengrass data plane, the account&apos;s AWS IoT data endpoint, its credentials endpoint
              and S3. They take port 8883 or 443 for MQTT and 8443 or 443 for HTTPS. A private image adds the
              endpoints of ECR (Elastic Container Registry), AWS&apos;s image registry.{' '}
              <Cite id="F07-190">Greengrass developer guide, Allow device traffic</Cite>
            </li>
            <li>
              <strong>Install a nucleus.</strong> The Java nucleus needs a Java runtime of version 8 or later.
              Nucleus lite installs from a package whose readme names Ubuntu 24.04, and gives up the deferral that
              keeps an update off a moving arm.{' '}
              <Cite id="F07-84">Greengrass developer guide, Greengrass nucleus requirements</Cite>{' '}
              <Cite id="F07-143">Greengrass developer guide, quick installation</Cite>{' '}
              <Cite id="F07-142">aws-greengrass-lite v2.7.0, package readme</Cite>{' '}
              <Cite id="F07-137">aws-greengrass-lite v2.7.0, README</Cite>
            </li>
            <li>
              <strong>Extend the token exchange role before the first deployment.</strong> The default policy
              &quot;doesn&apos;t include access to files in S3 buckets&quot;. Add <code>s3:GetObject</code> for artifacts; <code>ecr:GetAuthorizationToken</code>,{' '}
              <code>ecr:BatchGetImage</code> and <code>ecr:GetDownloadUrlForLayer</code> for a private image; and{' '}
              <code>s3:PutObject</code>, <code>s3:AbortMultipartUpload</code> and{' '}
              <code>s3:ListMultipartUploadParts</code> for the episodes bucket.{' '}
              <Cite id="F07-149">Greengrass developer guide, Authorize core devices</Cite>{' '}
              <Cite id="F07-175">Greengrass developer guide, Interact with AWS services</Cite>
            </li>
            <li>
              <strong>Package the policy as a component</strong>, image pinned by digest and started under{' '}
              <code>startup</code> with a warm-up inference, and try it on the bench device with a local deployment,
              made on the device itself with no cloud round trip.{' '}
              <Cite id="F07-127">Greengrass developer guide, Greengrass CLI deployment</Cite>
            </li>
            <li>
              <strong>Deploy from the cloud</strong>, first to the one thing, then to a canary group, then to the
              fleet group, with a per-device timeout above your measured download and an abort minimum the group
              reaches.{' '}
              <Cite id="F07-125">Greengrass developer guide, Create deployments</Cite>
            </li>
            <li>
              <strong>Add the uploader and watch one episode&apos;s files arrive</strong> in the bucket. After that
              the second arm is one more thing in the group, and beyond a handful, fleet provisioning lets every
              device ship with one shared claim certificate that it trades for its own on first connection.{' '}
              <Cite id="F07-174">Stream manager Python SDK v1.1.2, stream_manager_s3.py</Cite>{' '}
              <Cite id="F07-146">Greengrass developer guide, Fleet provisioning</Cite>
            </li>
          </ol>
          <Placeholder
            what={
              <>
                the measured hook-up of one Jetson Orin Nano Super and one DGX Spark to AWS IoT Greengrass:
                <br />
                whether each nucleus installs on JetPack and on DGX OS;
                <br />
                the memory the nucleus and stream manager really use;
                <br />
                the <code>docker run</code> flags a recipe needs for the GPU on each machine;
                <br />
                the time to deploy a multi-gigabyte policy and whether an interrupted download resumes;
                <br />
                what a deliberately failing start does (the reported state, the rollback and its duration);
                <br />
                whether a canary subdeployment can pin a newer version;
                <br />
                and the upload throughput for one LeRobot episode by each route, with its effect on inference latency.
              </>
            }
            source={
              <>
                our own hook-up of a Jetson Orin Nano Super and a DGX Spark to AWS IoT, not yet done.
              </>
            }
          />
          <Box variant="p">
            Time the first cloud deployment end to end over your own link, then the canary group&apos;s with its
            arms downloading together, before the fleet group joins. The per-device timeout is set from the slowest
            arm, and with a 6 GB policy against a 2 GB component limit it also tells
            you what the route you chose costs in minutes on every arm.
          </Box>
          <ExpandableSection headerText="Deployment limits and defaults, for lookup">
            <ThreeColTable head={['Limit', 'Value', 'Source']} rows={LIMIT_ROWS} minWidth={640} />
          </ExpandableSection>
          <ExpandableSection headerText="Retired and neighbouring AWS services, as listed on 2026-11-20">
            <ul style={LIST}>
              <li>
                <strong>AWS RoboMaker</strong>, the robot-specific service, reached end of support on September 10,
                2025, and full shutdown means it is &quot;no longer available or supported in any capacity&quot;.
                AWS names no replacement in the pages cited, and its documentation pages return HTTP 404.{' '}
                <Cite id="F07-98">AWS General Reference, Services in Full Shutdown</Cite>{' '}
                <Cite id="F07-100">RoboMaker developer guide (page removed)</Cite>
              </li>
              <li>
                <strong>AWS IoT Greengrass V1</strong> ended on October 7, 2026, so a tutorial built on V1 groups no
                longer applies; components and deployments as used throughout are Greengrass V2&apos;s.{' '}
                <Cite id="F07-99">AWS General Reference, Services in Full Shutdown</Cite>
              </li>
              <li>
                <strong>AWS IoT Core, Greengrass V2 and AWS IoT Device Management</strong> appear in none of
                AWS&apos;s lists of services in maintenance, in sunset or shut down on 2026-11-20.{' '}
                <Cite id="F07-191">AWS General Reference, service lifecycle tables</Cite>
              </li>
              <li>
                <strong>Secure tunneling</strong> gives an operator a session such as SSH to a device behind a
                firewall, with no inbound port, on both nuclei.{' '}
                <Cite id="F07-183">AWS IoT developer guide, Secure tunneling</Cite>
              </li>
            </ul>
          </ExpandableSection>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
