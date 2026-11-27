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
  'A new policy version is ready. Its image is in the container registry, and a new component version names that image by its digest.',
  'You create a deployment for the canary thing group, a few arms chosen to take the update first. An AWS IoT job carries the deployment to them.',
  'Each canary arm downloads the image. The nucleus asks the running policy component whether it is safe to update. It starts the new version once the component agrees, or after 60 seconds by default if the component does not answer.',
  'Each canary arm reports RUNNING or ERRORED to the cloud. You do not deploy to the rest of the fleet until these reports look good.',
  'You deploy to the fleet group. The rollout rate grows as more arms are notified or report success.',
  'In the abort case, failures cross the threshold, and the job cancels the arms that are still queued. The seven arms that already updated keep the new version until a new deployment pins the old one.',
];

const RO_X = 12;
const RO_W = 376;
const RO_BOXES: FlowBox[] = [
  { y: 10, h: 58, title: 'Amazon S3 and the container registry', fill: STORE_FILL, ink: STORE_INK },
  { y: 90, h: 58, title: 'Deployment, sent as an AWS IoT job', fill: '#ffffff', ink: NEUTRAL_INK },
  { y: 170, h: 96, title: 'Canary thing group', fill: ROBOT_FILL, ink: ROBOT_INK },
  { y: 288, h: 58, title: 'Health check reported to the cloud', fill: '#ffffff', ink: NEUTRAL_INK },
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
          Five boxes from top to bottom: storage, a deployment, a canary thing group of three devices, a health check and a fleet
          thing group of seventeen devices. A dot moves down one box per step. In the last step, seven fleet devices run the new
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
            each canary reports RUNNING or ERRORED
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
    a: 'Container image that contains the weights',
    b: (
      <>
        A <code>docker:</code> reference to the image, pinned by its digest. The Docker application manager is the
        Greengrass component that pulls container images. It fetches the image from the registry.
      </>
    ),
    c: (
      <>
        Docker pulls the image. Since nucleus version 2.18.4, an image download that a network error interrupts is
        retried. In earlier versions, the deployment failed. The changelog does not say whether a retried pull
        resumes a partly downloaded layer or starts that layer again.
      </>
    ),
    d: (
      <>
        The quota page does not say whether the 2 GB limit applies to a <code>docker:</code> image. It also gives no
        maximum size for an image deployed through Greengrass.{' '}
        <Cite id="F07-153">Greengrass developer guide, Run a Docker container</Cite>{' '}
        <Cite id="F07-84">Greengrass nucleus changelog, 2.18.4</Cite>{' '}
        <Cite id="F07-168">AWS General Reference quotas and Greengrass developer guide</Cite>
      </>
    ),
  },
  {
    a: 'Weights in Amazon S3, downloaded by the component',
    b: (
      <>
        Only the S3 key, which is passed in the component&apos;s configuration. The token exchange service is the
        Greengrass component that gives a device short-lived AWS credentials. The <code>install</code> step uses
        those credentials to download the object.
      </>
    ),
    c: 'Your install script. If the script does not check the bytes and resume a broken download, nothing does.',
    d: (
      <>
        The <code>install</code> step runs again every time Greengrass starts, and it times out after 120 s by
        default. That is a quarter of the 480 s that 6 GB takes at 100 Mbit/s. So make the script skip a file that
        is already present, and raise the timeout.{' '}
        <Cite id="F07-128">Greengrass component recipe reference, lifecycle</Cite>{' '}
        <Cite id="F07-160">Greengrass developer guide, Create deployments, configuration update</Cite>{' '}
        <Cite id="F07-148">Greengrass developer guide, Interact with AWS services</Cite>{' '}
        <Cite id="F07-162">Greengrass developer guide, Create deployments</Cite>
      </>
    ),
  },
  {
    a: 'Weights split into artifacts of under 2 GB each',
    b: 'The weights themselves, as files of under 2 GB, spread across several components that depend on each other. If the weights are not already stored in files of that size, you need an install step that joins the pieces, and disk space for the joined copy.',
    c: (
      <>
        The nucleus. It checks every piece against a digest. In the v2.18.4 source code, it resumes a broken S3
        download with an HTTP <code>Range</code> request, which asks only for the bytes that are still missing. It
        retries a broken download once a minute, with no limit on the number of attempts. A checksum mismatch is
        handled differently: the nucleus deletes the file and retries up to 10 times.
      </>
    ),
    d: (
      <>
        The component store, which is the disk area where the nucleus keeps artifacts. Its limit is 10 GB by
        default, and the limit counts the artifacts already stored. So a second 6 GB version needs
        6 + 6 = 12 GB.{' '}
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
        It appends one export task for each file, with the file&apos;s location on the device, the bucket and the
        key. Stream manager runs the tasks in the order they were appended and reports <code>Success</code>. After
        that, your code deletes the file.{' '}
        <Cite id="F07-172">Greengrass developer guide, Export configurations, Amazon S3</Cite>
      </>
    ),
    c: (
      <>
        It calls S3 itself with an AWS SDK. The SDK picks up the device&apos;s temporary credentials from the token
        exchange service.{' '}
        <Cite id="F07-175">Greengrass developer guide, Interact with AWS services</Cite>
      </>
    ),
  },
  {
    a: 'What comes built in',
    b: (
      <>
        It uses multipart upload above a size threshold whose minimum is 5 MB. It has a bandwidth cap for the whole
        device, 5 export threads by default, and a priority from 1 to 10 for each stream. One stream uploads one
        file at a time, so parallel uploads need several streams. By default, a stream buffers 256 MB on the
        device.{' '}
        <Cite id="F07-173">Greengrass developer guide, stream manager configuration and Export configurations</Cite>
      </>
    ),
    c: 'Nothing. Your component has to handle queueing, retries, bandwidth and ordering itself.',
  },
  {
    a: 'Memory on the device',
    b: (
      <>
        Stream manager is a Java program that &quot;requires a minimum of 70 MB RAM in addition to the AWS IoT
        Greengrass Core software&quot;.{' '}
        <Cite id="F07-171">Greengrass developer guide, Manage data streams</Cite>
      </>
    ),
    c: 'No extra process beyond the uploader itself.',
  },
  {
    a: 'On nucleus lite',
    b: (
      <>
        Stream manager supports nucleus lite since version 2.2.0. It is still a Java program: its settings include
        arguments for the Java virtual machine.{' '}
        <Cite id="F07-139">Greengrass developer guide, Stream manager</Cite>
      </>
    ),
    c: 'It works with no Java on the device.',
  },
];

const EDGE_ROWS: ThreeCol[] = [
  {
    a: 'Platforms in the documentation',
    b: (
      <>
        The Armv8 (AArch64) architecture, but no Linux distribution. JetPack and DGX OS are not named.{' '}
        <Cite id="F07-140">Greengrass developer guide, Greengrass nucleus requirements</Cite>
      </>
    ),
    c: (
      <>
        A table that lists Ubuntu 24.04 on x86 and Arm. Jetson Linux and DGX OS are not in the table.{' '}
        <Cite id="F09-121">EKS user guide, Hybrid Nodes operating systems</Cite>
      </>
    ),
  },
  {
    a: 'GPU access',
    b: (
      <>
        None of the four documented container recipes passes a GPU flag. Two AWS samples add one.{' '}
        <Cite id="F07-156">Greengrass developer guide, Run a Docker container</Cite>{' '}
        <Cite id="F07-157">AWS samples: genai-at-edge and the Physical AI Toolchain edge stack</Cite>
      </>
    ),
    c: (
      <>
        The Hybrid Nodes pages cited here say nothing about GPUs.{' '}
        <Cite id="F09-122">EKS user guide, Hybrid Nodes pages</Cite>
      </>
    ),
  },
  {
    a: 'What you operate',
    b: 'The nucleus and your components.',
    c: (
      <>
        A Kubernetes node, and a pod network that you install yourself: Cilium or Calico. The Amazon VPC CNI
        (Container Network Interface) is the pod network that EKS uses in the cloud, and it is not compatible with
        hybrid nodes.{' '}
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
    b: 'A recipe can be at most 16 KB. A deployment document can be at most 7 KB for one thing, 31 KB for a thing group, or 6 MB with large configuration support.',
    c: <Cite id="F07-87">AWS General Reference, Greengrass V2 quotas</Cite>,
  },
  {
    a: 'Publishing components',
    b: 'CreateComponentVersion allows 1 request per second per Region. Other control-plane calls allow 30 requests per second per Region. A Region can hold 5,000 components, and 5,000 versions of each.',
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
    b: 'By default, install and startup time out after 120 s, shutdown after 15 s and recover after 60 s. The run step has no timeout.',
    c: <Cite id="F07-128">Greengrass component recipe reference, lifecycle</Cite>,
  },
  {
    a: 'Checks during an artifact download',
    b: 'The nucleus refuses a download when less than 20 MB of disk is free. On a checksum mismatch, it deletes the file and retries up to 10 times.',
    c: (
      <>
        <Cite id="F07-170">aws-greengrass-nucleus v2.18.4, ComponentManager.java</Cite>{' '}
        <Cite id="F07-169">aws-greengrass-nucleus v2.18.4, ArtifactDownloader.java</Cite>
      </>
    ),
  },
  {
    a: 'Rollout rate',
    b: 'A constant rate sets maximumPerMinute to at least 1. An exponential rate sets baseRatePerMinute between 1 and 1000, and incrementFactor between 1.1 and 5.',
    c: <Cite id="F07-92">AWS IoT API reference, ExponentialRolloutRate and JobExecutionsRolloutConfig</Cite>,
  },
  {
    a: 'Abort rule',
    b: 'failureType is FAILED, REJECTED, TIMED_OUT or ALL. minNumberOfExecutedThings is at least 1. thresholdPercentage is at most 100, with up to two decimal places. The only action is CANCEL.',
    c: <Cite id="F07-94">AWS IoT API reference, AbortCriteria</Cite>,
  },
  {
    a: 'Credentials and AWS IoT policies',
    b: 'Token exchange credentials expire after an hour by default. A change to the AWS IoT policy attached to a device certificate can take 6 to 8 minutes to take effect.',
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
            description="A policy such as pi0.5 has 6 GB or more of weights, but AWS IoT Greengrass, the service that delivers software to each arm, carries at most 2 GB in one package. An update that is spreading across many arms can be stopped, but it is not undone automatically. Before the first arm updates, choose how to deliver the weights, how to stage the update and how to go back to the previous version, and plan how the recorded episodes return to the cloud."
          >
            18. The Fleet: Deploying Policies to Many Robots and Collecting Their Data
          </Header>
        }
      >
        <SpaceBetween size="s">
          <Box variant="p">
            Once a policy works on one arm, the next step is to run it on many arms and to collect the episodes they
            record. On AWS, the service that delivers software to each arm is AWS IoT (Internet of Things) Greengrass.
            It has two halves. A program called the nucleus runs on the computer next to each arm, and a computer
            that runs the nucleus is called a core device. A component is the package that Greengrass delivers, and
            it consists of a recipe and artifacts. The recipe is a short file that says what to fetch and how to
            start the software. The artifacts are the files that the component fetches. The artifacts of one
            component can total at most 2 GB, and this limit cannot be raised. In the cloud, you create deployments.
            A deployment is the list of components, at fixed versions, that one core device or a group of core
            devices should run. The nucleus on each device installs whatever its deployment lists.{' '}
            <Cite id="F07-120">Greengrass developer guide, What is AWS IoT Greengrass</Cite>{' '}
            <Cite id="F07-121">Greengrass developer guide, How it works</Cite>{' '}
            <Cite id="F07-123">Greengrass developer guide, Manage deployments</Cite>{' '}
            <Cite id="F07-122">Greengrass developer guide, How it works</Cite>{' '}
            <Cite id="F07-151">Greengrass component recipe reference</Cite>{' '}
            <Cite id="F07-87">AWS General Reference, Greengrass V2 quotas</Cite>
          </Box>
          <Box variant="p">
            Updating a fleet of arms this way runs into three challenges before anyone can judge how well the new
            policy works:
          </Box>
          <ul style={LIST}>
            <li>
              <strong>The policy is larger than one component can carry.</strong> pi0.5 is a vision-language-action policy from
              Physical Intelligence. It has 6 GB or more of weights, and every arm needs a copy. One component can
              carry at most 2 GB, which is a third of 6 GB.{' '}
              <Cite id="F07-54">Jetson AI Lab tutorial, OpenPi on Thor</Cite>{' '}
              <Cite id="F07-87">AWS General Reference, Greengrass V2 quotas</Cite>
            </li>
            <li>
              <strong>The episodes are too large to send as messages.</strong> LeRobot is the library that records
              each attempt at the task. It keeps adding video to the same file until the file reaches 200 MB. Each arm
              also keeps a connection to the cloud for short messages, but one message can hold at most 128 KB. So a
              full video file is more than a thousand times larger than a message.{' '}
              <Cite id="F05-20">LeRobot v0.7.0 datasets/utils.py, file size defaults</Cite>{' '}
              <Cite id="F07-97">AWS General Reference, AWS IoT Core quotas</Cite>
            </li>
            <li>
              <strong>A rollout can be stopped, but it is not undone automatically.</strong> In earlier sections, a
              rollout meant one run of a policy on one arm. From here on, a rollout means the staged spread of a new
              policy version across the arms of a fleet. If the new policy runs badly, you can stop the rollout, but
              the arms that already took the new version keep it. To go back, you need a second deployment.{' '}
              <Cite id="F07-95">AWS IoT developer guide, Job configurations</Cite>{' '}
              <Cite id="F07-164">Greengrass developer guide, Cancel deployments</Cite>
            </li>
          </ul>
          <Box variant="p">
            The guidance in this section is based on AWS documentation and on the source code of Greengrass nucleus
            version 2.18.4, as of November 2026. We have not yet tested it on a device.
          </Box>
          <Box variant="p">
            AWS&apos;s documentation includes an example deployment, and its settings show what can go wrong on a
            small fleet. Take an illustrative fleet of twenty {ARM} desktop arms that share one 100 Mbit/s site link.
            The example&apos;s abort rule, which cancels a failing rollout, can never fire on this fleet. The rule
            waits until 100 arms have been notified, and the fleet has only 20. The example also sets a rollout
            rate, which is the number of arms that the deployment notifies of the update per minute. The rate starts
            at 5 arms a minute and doubles once 10 arms have been notified. So every arm has been told to update
            within 3 minutes: the first 10 arms at 5 a minute, then the other 10 at 10 a minute. Both settings are
            explained in more detail further down.{' '}
            <Cite id="F07-162">Greengrass developer guide, Create deployments</Cite>{' '}
            <Cite id="F07-94">AWS IoT API reference, AbortCriteria</Cite>{' '}
            <Cite id="F07-93">AWS IoT developer guide, Job rollout rates</Cite>
          </Box>
          <Box variant="p">
            The downloads cannot keep up with that pace. At 100 Mbit/s, one arm alone needs 8 minutes to fetch the
            policy: 6 GB is <Derived>48,000</Derived> megabits, and <Derived>48,000 / 100</Derived> ={' '}
            <Derived>480</Derived> s. That is longer than the example&apos;s limit of 5 minutes per arm. When all
            twenty arms download at once, they share the link, and the downloads take <Derived>160</Derived> minutes
            (<Toy>20</Toy> x 8).{' '}
            <Cite id="F07-162">Greengrass developer guide, Create deployments</Cite>
          </Box>
          <Box variant="p">
            The 6 GB figure is the size of the weight files on disk. NVIDIA&apos;s Jetson AI Lab tutorial runs pi0.5
            on a Jetson Thor and lists the weights as &quot;~6 GB+&quot; among its storage prerequisites. These files
            are what a deployment moves to every arm, and the 2 GB limit counts their size on disk. Before you plan the
            delivery to a smaller board, check on that board whether a policy of this size also fits in its memory,
            next to everything else the board runs. To deliver the weights, the component can either point to them
            or carry them in pieces. The options differ in who checks the bytes and who resumes a broken
            download.{' '}
            <Cite id="F07-54">Jetson AI Lab tutorial, OpenPi on Thor</Cite>{' '}
            <Cite id="F07-87">AWS General Reference, Greengrass V2 quotas</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Weights larger than 2 GB can reach an arm in three ways: inside a container image, as an S3 object that the component downloads, or split into pieces of under 2 GB. The three routes differ in who checks the bytes and who resumes a broken download, and that tells you which route suits your network link."
          >
            Delivering weights larger than the 2 GB component limit
          </Header>
        }
      >
        <SpaceBetween size="s">
          <Box variant="p">
            There are three ways to get weights larger than 2 GB onto an arm. In two of them, the weights stay
            outside the component, and the component points to them: either in a container image or in an Amazon S3
            object. In the third, you cut the weights into pieces that are small enough for components to carry.
          </Box>
          <Box variant="p">
            On every route, something has to check that the downloaded bytes are the right ones, and something has
            to resume a download that breaks. On each route, a different part of the system does these two tasks:
            Docker, your install script or the nucleus. The check uses a digest, which is a
            hash of a file&apos;s content computed in advance. Because of that, a reference by digest names exactly
            one set of bytes. The routes also rely on the recipe&apos;s lifecycle. The lifecycle is the list of
            commands that the nucleus runs for a component, such as an <code>install</code> step and a step that
            starts the software. These mechanisms are documented. The three routes are designs that we built from
            them for weights of this size.{' '}
            <Cite id="F07-152">Greengrass component recipe reference, artifacts</Cite>{' '}
            <Cite id="F07-128">Greengrass component recipe reference, lifecycle</Cite>{' '}
            <Cite id="F07-168">AWS General Reference quotas and Greengrass developer guide</Cite>
          </Box>
          <FourColTable
            head={['Route', 'What the component contains', 'Who checks the bytes and resumes a download', 'Main limit']}
            rows={ROUTES}
            minWidth={760}
          />
          <Box variant="p">
            Your choice depends on a question that the quota page leaves open: whether Greengrass deploys a{' '}
            <code>docker:</code> image of several gigabytes. If it does, use the image route on a steady link. Each
            release then needs one component version, the Docker application manager handles the pull, and a recipe
            starts the GPU container. Two AWS samples run a model on a Jetson: genai-at-edge and the Physical AI
            Toolchain. Both start a GPU container from a recipe in this way. Neither sample answers the size
            question. The Physical AI Toolchain sample, for one, keeps its model file out of the image and downloads
            it as a separate S3 artifact. So the first test to run on a device is to
            deploy an image of this size.{' '}
            <Cite id="F07-168">AWS General Reference quotas and Greengrass developer guide</Cite>{' '}
            <Cite id="F07-84">Greengrass nucleus changelog, 2.18.4</Cite>{' '}
            <Cite id="F07-157">AWS samples: genai-at-edge and the Physical AI Toolchain edge stack</Cite>{' '}
            <Cite id="F07-195">AWS Physical AI Toolchain sample, edge-stack.ts, inference component</Cite>
          </Box>
          <Box variant="p">
            If Greengrass refuses the image, or if the link drops often, split the weights into pieces. The nucleus
            then checks the bytes and resumes a broken download. Because of that, a dropped link costs only time, and
            only the deployment&apos;s time limit per arm stops a slow download. This route has two costs. You have
            to raise the store limit (<code>componentStoreMaxSizeBytes</code> in the nucleus configuration), and each
            release needs one component version per piece. Downloading from S3 in your own install step is the last
            choice, because it leaves both tasks to your script.{' '}
            <Cite id="F07-169">aws-greengrass-nucleus v2.18.4, ArtifactDownloader.java and S3Downloader.java</Cite>{' '}
            <Cite id="F07-170">Greengrass nucleus, componentStoreMaxSizeBytes</Cite>
          </Box>
          <Box variant="p">
            A component version always refers to the same bytes, and the nucleus enforces this. It checks each
            artifact against a digest that was computed when the component version was created, and &quot;If the hash
            doesn&apos;t match the digest, the deployment fails.&quot; AWS&apos;s Physical AI Toolchain sample
            shows the risk. It defines an inference component but creates no deployment, and the component points to
            an artifact stored under the key <code>latest/policy.trt</code>. If that object is replaced, every later
            install of that component version fails the check. So store each new set of weights under a new key,
            never overwrite an existing key, and point a new component version at the new key. On the S3 route, an install script gets no such check unless it computes one itself.{' '}
            <Cite id="F07-152">Greengrass component recipe reference, artifacts</Cite>{' '}
            <Cite id="F07-196">AWS Physical AI Toolchain sample, edge-stack.ts</Cite>
          </Box>
          <Box variant="p">
            The number of component versions is limited too. AWS allows 5,000 versions of one component in a Region.
            Suppose a training loop registers every hourly checkpoint as a component version, whether or not it is
            deployed. That loop runs out of versions in about 208 days (5,000 / 24). On the S3 route, a new S3 key
            passed in the deployment&apos;s configuration uses no component version at all, which is a point in
            favour of that route.{' '}
            <Cite id="F07-167">AWS General Reference, Greengrass V2 quotas</Cite>{' '}
            <Cite id="F07-160">Greengrass developer guide, Create deployments, configuration update</Cite>
          </Box>
          <Box variant="p">
            The recipe below is AWS&apos;s documented example for the image route. It shows how little the component
            itself contains.
          </Box>
          <Snippet
            title="AWS's example recipe for a component that runs a container image from a private registry"
            mode="copied"
            source={<Cite id="F07-153">Greengrass developer guide, Run a Docker container</Cite>}
          >
            {RECIPE}
          </Snippet>
          <Box variant="p">
            The artifact is the image&apos;s address with a <code>docker:</code> prefix. It is a reference and
            contains none of the image&apos;s bytes. In the square brackets, you put either a tag or a digest. Only a
            digest fixes the image, because a tag can be moved to a different image. An address with neither pulls
            &quot;the latest available version of that image&quot; on the day each device deploys. As a result, two
            arms in the same rollout can end up running different policies. The lifecycle line starts the container
            under <code>Run</code>. With <code>Run</code>, a deployment can report success before the policy has
            loaded.{' '}
            <Cite id="F07-154">Greengrass developer guide, Docker application manager</Cite>{' '}
            <Cite id="F07-129">Greengrass component recipe reference, run and startup</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="A deployment can reach an arm in the middle of a task. You can make the policy finish its episode before Greengrass replaces it, and you can make an arm whose new policy fails to load go back to the previous version automatically."
          >
            When an update arrives in the middle of an episode
          </Header>
        }
      >
        <SpaceBetween size="s">
          <Box variant="p">
            A deployment can reach an arm while the arm is working. The control loop runs inside the policy container
            (section 17, Running on the Robot). So while the old version stops and the new one starts, nothing sends
            the arm new targets for its motors. The swap should therefore happen at a moment when the arm can safely
            stand still, with the gripper empty. The nucleus comes in two builds, and they handle this moment
            differently.
          </Box>
          <Box variant="p">
            The first build is the Java nucleus, which needs at least 96 MB of RAM. By default, it asks before it
            updates: it notifies each running component before it stops and replaces it. A component that has
            subscribed to these notifications can answer with a deferral and choose how long the delay lasts. When
            the delay is up, the nucleus asks again. By default, the nucleus waits 60 seconds for an answer. If the
            component does not answer in that time, the nucleus replaces it anyway: &quot;the deployment proceeds on
            the device&quot;. So a policy component
            can hold the update until the episode ends and the gripper is empty, and then acknowledge it.{' '}
            <Cite id="F07-84">Greengrass nucleus v2.18.4 requirements</Cite>{' '}
            <Cite id="F07-90">Greengrass V2 API reference, DeploymentComponentUpdatePolicy</Cite>
          </Box>
          <Box variant="p">
            To answer the nucleus, a component needs some setup that AWS&apos;s container recipe does not include. A
            component talks to the nucleus over a local socket, and this channel is called IPC (interprocess
            communication). A component can use only the IPC operations that an <code>accessControl</code> policy in
            its configuration grants it. In AWS, a policy is also a document that grants permissions. In this
            section, &quot;policy&quot; on its own still means the model that controls the arm, and each permissions
            document is named in full. A component that runs in a container also needs the socket mounted into the
            container and two environment variables passed in: <code>SVCUID</code> and{' '}
            <code>AWS_GG_NUCLEUS_DOMAIN_SOCKET_FILEPATH_FOR_COMPONENT</code>. The documented recipe has none of these
            three things. If you copy it as printed, the component cannot defer an update, and the nucleus replaces
            it after 60 seconds, whatever the arm is doing.{' '}
            <Cite id="F07-155">Greengrass developer guide, authorize components for IPC; IPC in Docker components</Cite>{' '}
            <Cite id="F07-90">Greengrass V2 API reference, DeploymentComponentUpdatePolicy</Cite>
          </Box>
          <Box variant="p">
            The second build, nucleus lite, is written for constrained devices, and its documentation puts its memory
            use at under 15 MB. It saves about <Derived>80</Derived> MB (96 - 15), which is little on a board with
            gigabytes of memory. In exchange, it gives up the deferral. The README of nucleus lite v2.7.0 lists 12 IPC
            operations, and <code>SubscribeToComponentUpdates</code> and <code>DeferComponentUpdate</code> are not
            among them. So on the computer next to an arm, run the Java nucleus.{' '}
            <Cite id="F07-84">Greengrass nucleus v2.18.4 requirements</Cite>{' '}
            <Cite id="F07-85">aws-greengrass-lite v2.7.0 and Greengrass developer guide</Cite>{' '}
            <Cite id="F07-137">aws-greengrass-lite v2.7.0, README</Cite>
          </Box>
          <Box variant="p">
            A Greengrass deployment also cannot be limited to a maintenance window. Greengrass sends its deployments
            through the AWS IoT jobs service, which runs remote operations on many devices and is explained in the
            rollout settings below. That service can schedule work into a maintenance window. A Greengrass
            deployment, however, exposes only three of the job&apos;s settings: its rollout rate, its abort rule and
            its time limit. So on nucleus lite, the only way to keep an update away from a moving arm is to
            keep the arms idle from the moment you create the deployment until every arm has switched to the new
            version. On the illustrative link, that period includes up to <Derived>160</Derived> minutes of
            download.{' '}
            <Cite id="F07-179">AWS IoT developer guide, Jobs scheduling; Greengrass DeploymentIoTJobConfiguration</Cite>
          </Box>
          <Box variant="p">
            What counts as a successful deployment depends on which lifecycle step starts the new version. A recipe
            can start the software in one of two steps:
          </Box>
          <ul style={LIST}>
            <li>
              <strong>
                <code>run</code>:
              </strong>{' '}
              With <code>run</code>, &quot;the deployment can be complete and successful even if the run lifecycle
              script fails soon after running&quot;.
            </li>
            <li>
              <strong>
                <code>startup</code>:
              </strong>{' '}
              With <code>startup</code>, the deployment stays <code>IN_PROGRESS</code> until the start script exits or
              the component reports its own state, <code>RUNNING</code> or <code>ERRORED</code>.{' '}
              <Cite id="F07-129">Greengrass component recipe reference, run and startup</Cite>
            </li>
          </ul>
          <Box variant="p">
            With <code>startup</code>, a policy component can load its weights, run one warm-up inference, and only
            then report <code>RUNNING</code>. Inside a container, the policy sends that report itself with the{' '}
            <code>UpdateState</code> IPC operation. It uses the same socket and environment variables that the
            deferral needs. Both builds of the nucleus offer this operation. All four container recipes on AWS&apos;s
            Docker page start the container under <code>Run</code>, so you have to write this check yourself.{' '}
            <Cite id="F07-129">Greengrass component recipe reference, run and startup</Cite>{' '}
            <Cite id="F07-155">Greengrass developer guide, IPC in Docker components</Cite>{' '}
            <Cite id="F07-137">aws-greengrass-lite v2.7.0, README</Cite>{' '}
            <Cite id="F07-156">Greengrass developer guide, Run a Docker container, all recipes</Cite>
          </Box>
          <Box variant="p">
            If the weights fail to load, the policy reports <code>ERRORED</code>, and the deployment fails on that
            arm. By default, &quot;the AWS IoT Greengrass Core software rolls back that core device to its previous
            configuration&quot;. A component that errors three times without recovering becomes <code>BROKEN</code>,
            and it stays <code>BROKEN</code> until it is deployed again.{' '}
            <Cite id="F07-163">Greengrass developer guide, Create deployments, failure handling</Cite>{' '}
            <Cite id="F07-130">Greengrass component recipe reference, recover</Cite>
          </Box>
          <Box variant="p">
            The warm-up check proves only that the software runs. In the cloud, each core device shows as{' '}
            <code>HEALTHY</code> or <code>UNHEALTHY</code>, and <code>UNHEALTHY</code> means that a process on it is in
            an error state. Whether the arm managed to {TASK_STORY} has to come back as data: a record for each
            episode, sent along with the episodes.{' '}
            <Cite id="F07-131">Greengrass developer guide, Check core device status</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="AWS's example rollout settings do not work for a fleet of twenty arms. Set the timeout per device from your download time and the abort rule from your fleet size. Then send the update to a few arms first, because the rollout rate alone cannot stage an update across twenty arms."
          >
            Rollout settings for a fleet of tens of arms
          </Header>
        }
      >
        <SpaceBetween size="s">
          <Box variant="p">
            A deployment to many arms targets a thing group. In AWS IoT, a thing is the record of one device, here
            the computer next to one arm. A thing group is a named set of things. To add a replacement computer to
            the fleet, you add its thing to the group. Send each update in stages, as is common practice in software
            delivery. The update goes first to a canary group, which is a few arms in a thing group of their own that
            take the update before the rest. After that, it goes to the fleet group.{' '}
            <Cite id="F07-121">Greengrass developer guide, How it works</Cite>{' '}
            <Cite id="F07-123">Greengrass developer guide, Manage deployments</Cite>
          </Box>
          <Box variant="p">
            Greengrass sends a group deployment as an AWS IoT job. A job is a remote operation that runs on many
            devices. On each device, the job runs as a separate job execution. A job execution is{' '}
            <code>QUEUED</code> until the arm starts work on the update, and <code>IN_PROGRESS</code> while the arm
            downloads, installs and starts it. In this section, an arm whose job execution is still{' '}
            <code>QUEUED</code> is called queued. The settings that control how the update spreads belong to the job.
            They are the same options that any AWS IoT Core job takes:{' '}
            <Cite id="F07-178">AWS IoT developer guide, Jobs key concepts</Cite>{' '}
            <Cite id="F07-162">Greengrass developer guide, Create deployments</Cite>
          </Box>
          <ul style={LIST}>
            <li>
              <strong>Rollout rate:</strong> how fast the job tells arms about the update. The job does not notify
              every arm at once. It notifies a set number of arms per minute, and each arm starts its deployment once
              it has been notified.
            </li>
            <li>
              <strong>Abort rule:</strong> the condition under which the job is cancelled. A cancel reaches only the
              arms that are still queued.
            </li>
            <li>
              <strong>Timeout:</strong> the time limit for each arm.
            </li>
          </ul>
          <AnimatedFigure
            name="a staged rollout with the abort case"
            steps={ROLLOUT_STEPS}
            intervalMs={2800}
            cites="F07-90 F07-93 F07-95 F07-129 F07-162 F07-163 F07-164 F07-165"
            caption={
              <>
                The moving dot is the new policy version. Of the twenty arms, three are canaries in their own thing
                group and seventeen are in the fleet group. In the last step, the abort cancels the eight arms that are
                still queued. The seven arms that updated keep the new version, and the two that failed are back on
                version 1.4.0 because of the default failure handling. The figure assumes an abort minimum that the
                group can reach and a rollout rate slow enough that arms are still queued when the failures arrive.
                AWS&apos;s example settings provide neither. The figure is an illustration: the counts, the versions
                and the moment the failures arrive are invented. The 60 s is the documented default wait for a
                component that does not answer.
              </>
            }
          >
            {(step, reduced) => <RolloutDiagram step={step} reduced={reduced} />}
          </AnimatedFigure>
          <Snippet
            title="AWS's example deployment document, with a rollout rate, an abort rule and a timeout"
            mode="copied"
            source={<Cite id="F07-162">Greengrass developer guide, Create deployments</Cite>}
          >
            {DEPLOYMENT_DOC}
          </Snippet>
          <Box variant="p">
            AWS&apos;s example deploys an industrial dashboard, so only its deployment policies and job settings
            apply to a fleet of arms. The document has three parts:
          </Box>
          <ul style={LIST}>
            <li>
              <strong>
                <code>components</code>:
              </strong>{' '}
              the list of components that the target should run.
            </li>
            <li>
              <strong>
                <code>deploymentPolicies</code>:
              </strong>{' '}
              what happens on each arm. The nucleus asks components before it replaces them (this example waits 30
              seconds for an answer), gives them time to validate new configuration, and rolls back on failure.{' '}
              <Cite id="F07-161">Greengrass developer guide, deployment policies</Cite>
            </li>
            <li>
              <strong>
                <code>iotJobConfiguration</code>:
              </strong>{' '}
              how the update spreads. The job notifies 5 arms a minute, doubles the rate once 10 arms have been
              notified or 5 have succeeded, and never exceeds 50 a minute. It cancels the rollout once 5% of
              executions have failed, counted only after at least 100 arms have been notified. It gives each arm 5
              minutes.{' '}
              <Cite id="F07-162">Greengrass developer guide, Create deployments</Cite>
            </li>
          </ul>
          <Box variant="p">
            If you copy these settings onto twenty arms, you need four changes. Two are settings in this document,
            one is the group that each deployment targets, and one is in the recipe of the policy component. Without them, the problems range from a bad policy that
            reaches every arm to a good policy that is cancelled.
          </Box>
          <Box variant="p">
            <strong>1. Set the abort minimum to a number that the fleet can reach.</strong> Otherwise the rollout has
            no automatic brake. The abort rule cannot fire until <code>minNumberOfExecutedThings</code> arms have been
            notified. A group of twenty never reaches the example&apos;s 100, so the rollout runs to the end however
            many arms fail. Set the minimum to a count that the group reaches while most arms are still queued. Set
            the threshold low enough that the number of failures you are not willing to accept is enough to cross
            it. For example, with a
            minimum of 5 and a threshold of <Toy>20</Toy>% (illustrative numbers), one failure among the first five
            arms stops the rollout.{' '}
            <Cite id="F07-94">AWS IoT API reference, AbortCriteria</Cite>
          </Box>
          <Box variant="p">
            <strong>2. Make a success mean that the policy has loaded.</strong> The abort rule and the rollout rate
            both count what each arm&apos;s deployment reports. With <code>run</code>, an arm whose policy crashes a
            second after launch still reports success. The rollout rate increases once a set number of arms have
            succeeded, so a policy that crashes after launch speeds the rollout up instead of stopping it. With <code>startup</code> and a warm-up inference, the same crash is reported as a failure, and the
            abort rule counts it.{' '}
            <Cite id="F07-129">Greengrass component recipe reference, run and startup</Cite>{' '}
            <Cite id="F07-93">AWS IoT developer guide, Job rollout rates</Cite>
          </Box>
          <Box variant="p">
            The abort rule sees only what the arms report, so you can make the report show how the arm behaves. The
            job service does not judge whether the arm does its task: a device &quot;must be programmed to report
            the FAILURE status&quot;. So a policy component can run a trial itself. It keeps its <code>startup</code>{' '}
            step open through a set of trial episodes and reports <code>RUNNING</code> only if enough of them
            succeed. For this to work, raise the startup timeout from its 120 s default to cover the trial episodes,
            and set the timeout per device above that. A policy that loads but drops blocks then fails its
            deployment, its arm rolls back, and the failure counts toward the abort. This design is ours, built from
            documented parts.{' '}
            <Cite id="F07-96">AWS IoT developer guide, Job configurations, abort cases</Cite>{' '}
            <Cite id="F07-128">Greengrass component recipe reference, lifecycle</Cite>{' '}
            <Cite id="F07-129">Greengrass component recipe reference, run and startup</Cite>
          </Box>
          <Box variant="p">
            The trial needs a way to judge whether each episode succeeded. LeRobot&apos;s reinforcement-learning
            setup offers two ways (section 8, Reinforcement Learning for Robots). One is a small image classifier,
            trained beforehand on frames of successes and failures. The other is a person who marks each success
            with a gamepad or a keyboard.{' '}
            <Cite id="F04-74">HIL-SERL paper, sections 3.2 and 3.3</Cite>{' '}
            <Cite id="F04-77">LeRobot v0.7.0 hilserl.mdx</Cite>
          </Box>
          <Box variant="p">
            <strong>
              3. For tens of arms, stage the update with groups, because the rollout rate does not wait for results.
            </strong>{' '}
            The rate starts at a base number of arms per minute. It multiplies that number when a set count of
            notified arms or of succeeded arms is reached, whichever comes first. A second AWS example, on the page about
            job rollout rates, increases the rate every 1,000 devices, fifty times the size of this whole fleet. The
            deployment example above doubles its rate after 10 / 5 = 2 minutes, because the count of notified arms
            grows whatever the arms report. On the illustrative link, it notifies all twenty arms before any arm can
            finish its download. Deploy
            first to a canary group instead, and create the fleet group&apos;s deployment only after the
            canaries&apos; records look good.{' '}
            <Cite id="F07-93">AWS IoT developer guide, Job rollout rates</Cite>{' '}
            <Cite id="F07-162">Greengrass developer guide, Create deployments</Cite>
          </Box>
          <Box variant="p">
            The canary arms need a thing group of their own. A device runs the combination of every deployment that
            targets it: the deployment to its own thing and the deployments to each group it belongs to. If a thing
            deployment and a group deployment pin different versions of the same component, the deployment fails on
            the device. The documented error message reads &quot;No local or cloud component version satisfies the
            requirements&quot;. So you cannot hand the new version directly to a canary that is still in the fleet
            group. Put the canaries in a separate thing group instead. The other option is a subdeployment, which is
            a deployment that targets a subset of a parent deployment&apos;s devices. The subdeployment page does not
            say whether a subdeployment may pin a version different from its parent&apos;s.{' '}
            <Cite id="F07-125">Greengrass developer guide, Create deployments</Cite>{' '}
            <Cite id="F07-126">Greengrass developer guide, Manage deployments, dependency resolution failures</Cite>{' '}
            <Cite id="F07-165">Greengrass developer guide, Create subdeployments</Cite>
          </Box>
          <Box variant="p">
            <strong>4. Make the timeout per device longer than the download.</strong> The clock starts when an
            arm&apos;s job execution changes to <code>IN_PROGRESS</code>. If the arm has not finished when the time
            runs out, it is marked <code>TIMED_OUT</code>, and the failure type <code>ALL</code> counts that as a
            failure. On the illustrative link, the 6 GB policy needs 8 minutes for one arm and up to{' '}
            <Derived>160</Derived> minutes for twenty arms downloading together. So with the example&apos;s 5
            minutes, every arm is marked <code>TIMED_OUT</code>. Once the abort rule can fire, these timeouts alone
            cross its threshold and cancel a good policy. To set the timeout, measure the download with as many arms
            downloading at once as the rollout rate allows. Then set the timeout above that time plus the time for
            install and start-up. The timeout can be anything from 1 minute to 7 days.{' '}
            <Cite id="F07-162">Greengrass V2 API reference, IoTJobTimeoutConfig</Cite>{' '}
            <Cite id="F07-94">AWS IoT API reference, AbortCriteria</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="An abort stops a rollout, but the arms that already updated keep the new policy. To put them back, you create a new revision of the deployment, built from the current one. AWS's example recipe and deployment document need several changes before they can carry a policy to a fleet, and you can make them all in one pass."
          >
            Stopping a rollout and going back to the previous policy
          </Header>
        }
      >
        <SpaceBetween size="s">
          <Box variant="p">
            The abort rule has only one action, <code>CANCEL</code>, and a cancel has a narrow effect. With a cancel,
            &quot;only QUEUED job executions are canceled&quot;, and executions that are in progress &quot;will not
            be canceled&quot;. Cancelling the whole deployment by hand does not go further: &quot;If a core device
            already runs the deployment, you won&apos;t change the components on that device when you cancel the
            deployment.&quot; So the abort protects only the arms that are still queued when the failures start.{' '}
            <Cite id="F07-94">AWS IoT API reference, AbortCriteria</Cite>{' '}
            <Cite id="F07-95">AWS IoT developer guide, Job configurations</Cite>{' '}
            <Cite id="F07-164">Greengrass developer guide, Cancel deployments</Cite>
          </Box>
          <Box variant="p">
            At the example&apos;s rollout rate, on the illustrative link, the failed starts that would trigger the
            abort arrive only after every arm has been told to update. So for tens of arms, the canary group is what
            stops a bad policy. The abort rule protects the fleet group&apos;s deployment only if the rollout rate is
            slow enough to leave arms queued. A constant rate can go as low as 1 arm a minute.{' '}
            <Cite id="F07-162">Greengrass developer guide, Create deployments</Cite>{' '}
            <Cite id="F07-92">AWS IoT API reference, ExponentialRolloutRate and JobExecutionsRolloutConfig</Cite>
          </Box>
          <Box variant="p">
            The only automatic undo works on one arm at a time. With the default failure handling, a start that
            fails rolls that arm back. Across the fleet, nothing is undone automatically. Unless the component runs
            the trial episodes described above, a policy that starts cleanly and then drops blocks counts as a
            healthy deployment as far as Greengrass knows. To put those
            arms back, you create a new revision of the deployment for the same target, and the new revision pins the
            previous version. Creating the new revision also cancels the job of the revision before it.{' '}
            <Cite id="F07-89">Greengrass V2 API reference, DeploymentPolicies</Cite>{' '}
            <Cite id="F07-164">Greengrass developer guide, Cancel deployments and Check deployment status</Cite>
          </Box>
          <Box variant="p">
            Build every revision from the current one, including a revert. A deployment is the whole list of
            components that its target should run. &quot;A new deployment to the same target overwrites the previous
            deployment to the target&quot;, and a component missing from the new revision is uninstalled. So a
            revert that lists only the old policy would also remove the episode uploader. Instead, fetch the current
            revision, change only the policy&apos;s version, and create the deployment from that.{' '}
            <Cite id="F07-124">Greengrass developer guide, Manage deployments</Cite>
          </Box>
          <Box variant="p">
            In the same document, pin the versions of everything else. A deployment installs the latest supported
            versions of a component&apos;s dependencies. So a revision can bring in new patch versions of AWS&apos;s
            own components, and &quot;Some automatic updates, such as a nucleus update, can cause your devices to
            restart unexpectedly.&quot; To make sure that a rollout changes only the policy version, list the
            nucleus, the Docker application manager and the token exchange service with explicit versions next to the
            policy.{' '}
            <Cite id="F07-166">Greengrass developer guide, Manage deployments, deployment options</Cite>
          </Box>
          <Box variant="p">
            Before AWS&apos;s example recipe and deployment document can carry a policy to twenty arms, they need the
            following changes, in the order you would make them:
          </Box>
          <ol style={LIST}>
            <li>
              In the recipe, name the image by its digest, both in the artifact URI and in the{' '}
              <code>docker run</code> line.
            </li>
            <li>
              Add the GPU flag that both AWS samples pass on a Jetson: <code>--runtime nvidia</code>.{' '}
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
              Mount the nucleus socket into the container, and pass in <code>SVCUID</code> and{' '}
              <code>AWS_GG_NUCLEUS_DOMAIN_SOCKET_FILEPATH_FOR_COMPONENT</code>.
            </li>
            <li>
              In the deployment document, start from the current revision, so that it lists every component the arm
              runs.
            </li>
            <li>Pin the nucleus, the Docker application manager and the token exchange service to explicit versions.</li>
            <li>
              Set <code>minNumberOfExecutedThings</code> to a count that the group reaches while most arms are still
              queued. Set the threshold low enough that the number of failures you are not willing to accept is enough
              to cross it (5 and <Toy>20</Toy>% in the illustrative example).
            </li>
            <li>
              Set <code>inProgressTimeoutInMinutes</code> above the download time measured with arms downloading
              together, plus the time for install and start-up.
            </li>
            <li>
              Deploy to the canary thing group first, and deploy to the fleet group once the canaries&apos; records
              look good.
            </li>
          </ol>
          <Box variant="p">
            Pinning covers AWS&apos;s components, but not the operating system. As of November 2026, the AWS
            documentation cited here describes no managed update of the operating system on a Linux device. On a
            Jetson, the operating system is Jetson Linux, which NVIDIA ships in its JetPack release. NVIDIA&apos;s
            documentation describes update tools for it, including image-based updates written partition by
            partition, but no fleet service. So a JetPack upgrade across the arms is a rollout that you plan and run
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
            description="To size the uplink, start from the bytes that each arm records. Send the closed video files to Amazon S3, and send a short result for each episode as a message. A published study of one fleet shows how fast the loop from recording to a new policy can close."
          >
            Sending recorded episodes back to the cloud
          </Header>
        }
      >
        <SpaceBetween size="s">
          <Box variant="p">
            The data coming back from each arm is small, but it flows whenever the arm records. In the example dataset
            of section 9, Collecting Data, two 640x480 cameras produce about 775 MB of video per robot-hour, which is
            0.86 Mbit/s per camera. So an arm that records for a full hour sends about <Derived>1.72</Derived> Mbit/s
            (2 x 0.86), or <Derived>0.215</Derived> MB a second (775 MB / 3,600 s).{' '}
            <Cite id="F05-29">Hugging Face hub file listing of the example dataset</Cite>{' '}
            <Cite id="F05-30">from the file sizes of the example dataset</Cite>
          </Box>
          <Box variant="p">
            Across a fleet, these small flows add up. Twenty arms send about <Derived>34</Derived> Mbit/s (
            <Toy>20</Toy> x <Derived>1.72</Derived>). An illustrative fleet of a hundred arms sends{' '}
            <Derived>172</Derived> Mbit/s, which is more than a symmetric <Toy>100</Toy> Mbit/s site link carries
            upstream. At that fleet size, you size the link for the uploads rather than for the policy download.{' '}
            <Cite id="F05-30">from the file sizes of the example dataset</Cite>{' '}
            <Cite id="F07-54">Jetson AI Lab tutorial, OpenPi on Thor</Cite>
          </Box>
          <Box variant="p">
            For a single event, the download is the larger direction. One rollout to twenty arms moves{' '}
            <Derived>120</Derived> GB (<Toy>20</Toy> x 6). That is as much data as those arms record in{' '}
            <Derived>7.7</Derived> hours, at <Derived>15.5</Derived> GB an hour (<Toy>20</Toy> x 775 MB).{' '}
            <Cite id="F05-30">from the file sizes of the example dataset</Cite>{' '}
            <Cite id="F07-54">Jetson AI Lab tutorial, OpenPi on Thor</Cite>
          </Box>
          <ExpandableSection headerText="For comparison: the arm's raw video, and a robot with many sensors">
            <SpaceBetween size="s">
              <Box variant="p">
                The arm&apos;s upload budget is small because its video is encoded at the bench, before it is
                uploaded. Without encoding, the same frames would take 640 x 480 pixels x 3 bytes x 30 frames a
                second x 2 cameras x 3,600 s = 199 GB an hour per arm. That is about 257 times as much (199 GB / 775
                MB).{' '}
                <Cite id="F05-29">Hugging Face hub file listing of the example dataset</Cite>{' '}
                <Cite id="F05-30">from the file sizes of the example dataset</Cite>
              </Box>
              <Box variant="p">
                A robot with many sensors does not fit the link budget above. The paper &quot;The Robot Data
                Factory&quot; models a reference robot that records around the clock. The robot has seven 1920x1080
                video streams at 30 fps, a LiDAR and scalar sensors. A LiDAR (light detection and ranging) is a laser
                scanner that measures the distance to surrounding surfaces. For this robot, the authors compute 38.41
                MB/s, or 3.32 TB per robot per day. The figure comes from their model, with no measurement behind it.
                It is about <Derived>179</Derived> times the arm&apos;s <Derived>0.215</Derived> MB/s (
                <Derived>38.41 / 0.215</Derived>). For one robot, it is <Derived>307</Derived> Mbit/s (38.41 x 8),
                three times the illustrative link. For a fleet of such robots, you have to decide what to upload
                before you decide how to upload it.{' '}
                <Cite id="F07-106">The Robot Data Factory, appendix B.3</Cite>{' '}
                <Cite id="F05-30">the arm&apos;s 0.215 MB/s, from the file sizes of the example dataset</Cite>
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <Box variant="p">
            Each arm already holds a connection to the cloud, but that connection is not suitable for the files,
            because of their size. The connection goes to AWS IoT Core, the AWS service that holds the device registry
            and the message broker. It uses MQTT (Message Queuing Telemetry Transport). MQTT is a lightweight protocol
            in which a device publishes small messages to named topics, and subscribers receive them. The
            connection&apos;s rate would be enough: one connection moves 512 KB a second, and one arm produces{' '}
            <Derived>0.215</Derived> MB a second. The message size is the limit. A message can be at most 128 KB, so a
            200 MB video file would have to travel as about <Derived>1,600</Derived> messages (
            <Derived>200 x 1,024 / 128</Derived>) and be reassembled in the cloud.{' '}
            <Cite id="F07-97">AWS General Reference, AWS IoT Core quotas</Cite>{' '}
            <Cite id="F05-20">LeRobot v0.7.0 datasets/utils.py, file size defaults</Cite>{' '}
            <Cite id="F05-30">from the file sizes of the example dataset</Cite>
          </Box>
          <Box variant="p">
            So the traffic is split in two. The files go to Amazon S3. MQTT carries a short record for each episode:
            which arm recorded it, which policy version ran, and whether the episode succeeded or failed.{' '}
            <Cite id="F07-176">AWS IoT developer guide, Basic Ingest and the S3 rule action</Cite>
          </Box>
          <Box variant="p">
            The device still publishes the record over MQTT, but the record does not have to pass through the
            message broker on its way to S3. AWS IoT Core runs rules. A rule is a
            query over incoming messages, with actions that send the matching messages to other services. With Basic
            Ingest, a device publishes to a reserved topic whose name is <code>$aws/rules/</code> followed by the
            rule&apos;s name. That rule&apos;s actions then run &quot;without incurring messaging costs&quot;. The S3
            rule action writes each message to a bucket as a separate object, provided the object key includes a
            timestamp. This record shows whether the arm did its task, which the health check cannot show. An
            operator reads these records before creating the fleet group&apos;s deployment.{' '}
            <Cite id="F07-176">AWS IoT developer guide, Basic Ingest and the S3 rule action</Cite>
          </Box>
          <Box variant="p">
            To track the current state of each arm, use the device shadow. A shadow is a small JSON document for each
            thing, kept in the cloud, and you can read it while the arm is offline. Report the running policy version
            and a success count in the shadow. Fleet indexing is the AWS IoT feature that makes the registry and the
            shadows searchable. With it, one query can find the arms on the new policy whose success rate fell.
            Nucleus lite has no shadow support of its own.{' '}
            <Cite id="F07-177">AWS IoT developer guide, Device Shadow service</Cite>{' '}
            <Cite id="F07-182">AWS IoT developer guide, Fleet indexing</Cite>{' '}
            <Cite id="F07-135">Greengrass developer guide, feature compatibility</Cite>
          </Box>
          <Box variant="p">
            An uploader can send only a file that is closed, and LeRobot&apos;s writer does not close a file at the
            end of each episode. It appends each episode&apos;s video to the current MP4 file until the file would
            pass 200 MB, and then it starts a new file. At the example&apos;s 387 MB per camera-hour, a file closes
            about every <Derived>31</Derived> minutes (<Derived>200 / 387 x 60</Derived>). The frame rows are stored
            in table files in the Parquet format. These files are valid only after <code>finalize()</code>, which{' '}
            <code>lerobot-record</code> calls after the last episode. So the rows can be uploaded only after a
            recording session ends. The canary check does not have to wait for these files, because whether
            each episode succeeded travels in the per-episode MQTT record.{' '}
            <Cite id="F05-19">LeRobot v0.7.0 dataset_writer.py</Cite>{' '}
            <Cite id="F05-30">from the file sizes of the example dataset</Cite>{' '}
            <Cite id="F05-3">LeRobot v0.7.0 lerobot_record.py and dataset docs</Cite>
          </Box>
          <Box variant="p">
            LeRobot&apos;s own uploader sends data to the Hugging Face Hub, so you have to write the code for the path
            to S3. LeRobot&apos;s continuous recording mode, called the sentry strategy, shows how to solve the file
            problem. It sets episode boundaries so that &quot;each saved episode produces a complete video
            file&quot;. An uploader can send that file as soon as it closes.{' '}
            <Cite id="F07-112">LeRobot v0.7.0, inference.mdx</Cite>
          </Box>
          <Box variant="p">
            Two kinds of component can move the closed files to S3. The first is stream manager, a Greengrass
            component that queues data on the device and exports it in the background. The second is a component
            that you write yourself and that calls S3 directly.{' '}
            <Cite id="F07-171">Greengrass developer guide, Manage data streams</Cite>{' '}
            <Cite id="F07-175">Greengrass developer guide, Interact with AWS services</Cite>
          </Box>
          <ThreeColTable head={['', 'Stream manager', 'A component that calls S3 itself']} rows={UPLOAD_ROWS} minWidth={680} />
          <Box variant="p">
            On the Java nucleus, use stream manager. The documented minimum memory of the nucleus and stream manager
            together is 96 + 70 = <Derived>166</Derived> MB before any policy loads, which is little on a board with
            gigabytes of memory. For that memory, you get a queue, a bandwidth cap on the uplink, and priorities.
            With priorities, a short episode that contains a human correction can go ahead of bulk video. The stream
            manager pages do not say whether it resumes an upload after the device reboots.{' '}
            <Cite id="F07-84">Greengrass nucleus v2.18.4 requirements</Cite>{' '}
            <Cite id="F07-171">Greengrass developer guide, Manage data streams</Cite>{' '}
            <Cite id="F07-173">Greengrass developer guide, stream manager configuration</Cite>
          </Box>
          <Box variant="p">
            If a board runs nucleus lite to save memory, write your own upload component instead. Stream manager does
            run on nucleus lite, but it is still a Java program that needs at least 70 MB, more than four times what
            nucleus lite itself uses, so it would use up most of the saving. A component of your own needs no Java
            on the device. With multipart upload
            at the minimum part size of 5 MB, a 200 MB video file goes up in 40 parts, so a dropped link costs only
            one part. Stream manager does this for you. In your own component, you write the upload code yourself,
            because AWS&apos;s example recipe for this kind of component only lists buckets. That recipe is printed in
            section 24, Orchestrating Physical AI on AWS.{' '}
            <Cite id="F07-139">Greengrass developer guide, Stream manager</Cite>{' '}
            <Cite id="F07-171">Greengrass developer guide, Manage data streams</Cite>{' '}
            <Cite id="F07-85">Greengrass developer guide, Greengrass nucleus lite</Cite>{' '}
            <Cite id="F07-173">Greengrass developer guide, stream manager configuration</Cite>{' '}
            <Cite id="F07-102">Amazon S3 user guide, multipart upload limits</Cite>{' '}
            <Cite id="F07-175">Greengrass developer guide, Interact with AWS services</Cite>
          </Box>
          <Box variant="p">
            A published study shows how fast this loop can close. The authors of &quot;Learning While
            Deploying&quot; ran 16 two-armed robots. Each robot uploads complete episodes to object storage at episode
            boundaries, and a central learner broadcasts an updated shared policy every 50 training steps. In an
            8-hour run, the authors report that an episode reached the learner a median of 41 s after it was
            produced, and 148 s at the 99th percentile. A published model reached a robot in a median of 38 s, and in
            55 s at the 99th percentile. The authors note that these figures depend on the network configuration and on
            contention.{' '}
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
                Episode files go up from three of the twenty arms into one bucket and on to training. The next policy
                version comes back down to the three canary arms. The two spans on the ruler are drawn to the same
                scale. They are the medians that the authors of Learning While Deploying report for one 8-hour run of
                their own system with 16 robots. The rest of the figure is a schematic, and the arm count and the
                version numbers are invented.
              </>
            }
          >
            {(step, reduced) => <FleetLoop step={step} reduced={reduced} />}
          </AnimatedFigure>
          <Box variant="p">
            These spans show how fast a loop without staging can close: under a minute in each direction at the
            median. In that study, the learner broadcasts the weights to every robot at once, on the authors&apos; own
            network and with their own model. Staging a 6 GB policy on the illustrative link adds the canary wait to
            the download. Three canaries downloading together need about <Derived>24</Derived> minutes (3 x 8). They
            then run their trial episodes and report, and only after that does the fleet group&apos;s deployment
            start. Deploy to the whole fleet group at once when a fresher policy is worth more than the protection of
            a canary stage. Stage the update through the canaries when an arm running a bad policy costs more than
            the wait.{' '}
            <Cite id="F07-109">Learning While Deploying, Table VI</Cite>{' '}
            <Cite id="F07-162">Greengrass developer guide, Create deployments</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="AWS offers two ways to manage a machine outside its cloud. You can choose between them with three questions: does the machine's network link drop, can the machine accept incoming connections, and must one scheduler reach both this machine and the GPUs in the cloud?"
          >
            Choosing between a Greengrass core device and a Kubernetes hybrid node
          </Header>
        }
      >
        <SpaceBetween size="s">
          <Box variant="p">
            Everything so far assumes that each machine is a Greengrass core device, which takes its deployment
            whenever it next connects. AWS has a second way to attach a machine outside its cloud: Amazon EKS
            (Elastic Kubernetes Service) Hybrid Nodes. With Hybrid Nodes, the machine joins a Kubernetes cluster in
            the cloud as a worker node. The scheduler that places training pods on cloud GPUs can then place pods on
            that machine too. A hybrid node expects the opposite kind of network from a core device: one that stays
            connected.{' '}
            <Cite id="F07-123">Greengrass developer guide, Manage deployments</Cite>{' '}
            <Cite id="F09-119">EKS user guide, Hybrid Nodes overview</Cite>
          </Box>
          <Box variant="p">
            You decide how to attach each machine before you set it up. To place two example machines, ask three
            questions in order. The first machine is a Jetson next to an arm. The second is a DGX Spark, a desk-side machine from
            NVIDIA. Section 17, Running on the Robot, uses it as the policy server in LeRobot&apos;s remote inference
            example.{' '}
            <Cite id="F07-25">LeRobot remote inference guide</Cite>
          </Box>
          <Box variant="p">
            <strong>Does the link drop?</strong> A Greengrass device treats being offline as a normal state, and it
            takes the current deployment when it next connects. Hybrid Nodes, on the other hand, &quot;is not a fit
            for disconnected, disrupted, intermittent or limited (DDIL) environments&quot;. During a network outage,
            a hybrid node&apos;s pods keep running, but nothing on the node can be changed. A hybrid node can get its
            AWS credentials in one of two ways, and one of them is AWS Systems Manager. A node that gets its
            credentials from Systems Manager can take up to 30 minutes to rejoin after those credentials have
            lapsed. So if the link drops, choose Greengrass.{' '}
            <Cite id="F07-123">Greengrass developer guide, Manage deployments</Cite>{' '}
            <Cite id="F09-119">EKS user guide, Hybrid Nodes overview</Cite>{' '}
            <Cite id="F09-120">EKS user guide, Hybrid Nodes prerequisites</Cite>{' '}
            <Cite id="F09-125">EKS best practices, hybrid nodes and disconnections</Cite>
          </Box>
          <Box variant="p">
            <strong>Can the machine accept incoming connections?</strong> A Greengrass device opens only outgoing
            connections. Its MQTT connection uses port 8883 or 443, and the setup steps below list the other ports it
            needs. So it works behind a lab router without a VPN. A hybrid node needs
            private connectivity in both directions, because the EKS control plane opens connections to the node. The
            guidance for that link is at least 100 Mbps and at most 200 ms of round-trip time, and it is &quot;not a
            strict requirement&quot;.{' '}
            <Cite id="F07-189">AWS IoT developer guide, Device communication protocols</Cite>{' '}
            <Cite id="F09-120">EKS user guide, Hybrid Nodes prerequisites</Cite>
          </Box>
          <Box variant="p">
            <strong>Must one scheduler reach both the machine and the cloud GPUs?</strong> A hybrid node is worth
            what it costs to run only if the answer is yes. Every Kubernetes node needs a pod network. A pod network
            is the plugin that gives each pod an address. On a hybrid node, you install and run the pod network
            yourself.{' '}
            <Cite id="F09-123">EKS user guide, Hybrid Nodes add-ons</Cite>
          </Box>
          <Box variant="p">
            Taken together, the answers place the two machines. A Jetson on or next to a robot should be a Greengrass
            core device. A DGX Spark should be a hybrid node only when all three of these conditions hold:
          </Box>
          <ul style={LIST}>
            <li>The lab already runs its training and evaluation on EKS.</li>
            <li>
              The machine sits on a wired network with a private connection to the cluster&apos;s network in AWS.
              That network is a VPC (Virtual Private Cloud). The private connection is a VPN or AWS Direct Connect,
              AWS&apos;s private network link.
            </li>
            <li>
              Somebody will run a pod network on the machine.{' '}
              <Cite id="F09-127">EKS Hybrid Nodes overview, read for a Jetson and a DGX Spark</Cite>{' '}
              <Cite id="F09-120">EKS user guide, Hybrid Nodes prerequisites</Cite>
            </li>
          </ul>
          <Box variant="p">
            Apart from the network, the two options differ in three ways: the platforms that their documentation
            names, GPU access, and what you have to operate yourself.
          </Box>
          <ThreeColTable head={['', 'Greengrass core device', 'EKS hybrid node']} rows={EDGE_ROWS} minWidth={680} />
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Bring one arm's computer into the fleet by following the steps in the order that the documentation sets. Then time the first deployment before a second arm joins."
          >
            Setting up one Jetson and one DGX Spark
          </Header>
        }
      >
        <SpaceBetween size="s">
          <Box variant="p">
            AWS&apos;s documentation sets the order of the steps for one arm&apos;s computer. A DGX Spark that joins
            as a core device follows the same steps. We found no worked example of the whole path. None of the AWS
            posts and samples from 2025 or 2026 that we searched runs a GPU policy container on a Jetson with
            Greengrass V2 and uploads its episodes to S3.{' '}
            <Cite id="F07-199">AWS sample repositories searched</Cite>
          </Box>
          <ol style={LIST}>
            <li>
              <strong>Create the resources in your AWS account.</strong> You need five objects: a thing, a thing group,
              an AWS IoT policy, an IAM (Identity and Access Management) role called the token exchange role, and a
              role alias. The token exchange role says which AWS services the device&apos;s components may call. The
              role alias is the name through which the device&apos;s certificate reaches that role. The installer,
              which runs on the device, can create these objects for you. For that, you give it AWS credentials during
              the installation, and it does not store them. Alternatively, you create the objects from a workstation,
              so that AWS credentials never reach the device.{' '}
              <Cite id="F07-144">Greengrass developer guide, Install with automatic provisioning</Cite>{' '}
              <Cite id="F07-145">Greengrass developer guide, Install with manual provisioning</Cite>
            </li>
            <li>
              <strong>Allow outgoing network traffic only.</strong> For basic operation, the device connects out to
              four endpoints: the Greengrass data plane, the account&apos;s AWS IoT data endpoint, the account&apos;s
              AWS IoT credentials endpoint, and S3. They use port 8883 or 443 for MQTT, and port 8443 or 443 for
              HTTPS. If the image of the robot policy is in a private registry, the device also needs the endpoints of Amazon ECR
              (Elastic Container Registry), AWS&apos;s store for container images.{' '}
              <Cite id="F07-190">Greengrass developer guide, Allow device traffic</Cite>
            </li>
            <li>
              <strong>Install a nucleus.</strong> The Java nucleus needs a Java runtime, version 8 or later. Nucleus
              lite installs from a package whose readme names Ubuntu 24.04. Keep in mind that nucleus lite cannot
              defer an update, so it cannot keep an update away from a moving arm.{' '}
              <Cite id="F07-84">Greengrass developer guide, Greengrass nucleus requirements</Cite>{' '}
              <Cite id="F07-143">Greengrass developer guide, quick installation</Cite>{' '}
              <Cite id="F07-142">aws-greengrass-lite v2.7.0, package readme</Cite>{' '}
              <Cite id="F07-137">aws-greengrass-lite v2.7.0, README</Cite>
            </li>
            <li>
              <strong>Extend the token exchange role before the first deployment.</strong> The default IAM policy of
              the token exchange role &quot;doesn&apos;t include access to files in S3 buckets&quot;. Add <code>s3:GetObject</code> for the
              artifacts. Add <code>ecr:GetAuthorizationToken</code>, <code>ecr:BatchGetImage</code> and{' '}
              <code>ecr:GetDownloadUrlForLayer</code> for a private image. Add <code>s3:PutObject</code>,{' '}
              <code>s3:AbortMultipartUpload</code> and <code>s3:ListMultipartUploadParts</code> for the episodes
              bucket.{' '}
              <Cite id="F07-149">Greengrass developer guide, Authorize core devices</Cite>{' '}
              <Cite id="F07-175">Greengrass developer guide, Interact with AWS services</Cite>
            </li>
            <li>
              <strong>Package the policy as a component.</strong> Pin the image by its digest, and start it under{' '}
              <code>startup</code> with a warm-up inference. Test the component on the bench device with a local
              deployment. A local deployment is made on the device itself, with no round trip to the cloud.{' '}
              <Cite id="F07-127">Greengrass developer guide, Greengrass CLI deployment</Cite>
            </li>
            <li>
              <strong>Deploy from the cloud.</strong> Deploy first to the single thing. When more arms join, put a
              few of them in the canary thing group and the rest in the fleet group, and send each update to the
              canary group before the fleet group. Every deployment that targets the same arm has to pin the same
              policy version, because a thing deployment and a group deployment that pin different versions fail on
              the device. Set the timeout per device above your measured download time, and set an abort minimum that
              the group can reach.{' '}
              <Cite id="F07-125">Greengrass developer guide, Create deployments</Cite>
            </li>
            <li>
              <strong>Add the uploader, and check that one episode&apos;s files arrive in the bucket.</strong> After
              that, adding a second arm means adding one more thing to the group. Beyond a handful of arms, fleet
              provisioning lets every device ship with the same shared claim certificate. Each device exchanges that
              certificate for its own on its first connection.{' '}
              <Cite id="F07-174">Stream manager Python SDK v1.1.2, stream_manager_s3.py</Cite>{' '}
              <Cite id="F07-146">Greengrass developer guide, Fleet provisioning</Cite>
            </li>
          </ol>
          <Placeholder
            what={
              <>
                our measurements from setting up one Jetson Orin Nano Super and one DGX Spark with AWS IoT Greengrass.
                They will show:
                <br />
                whether each nucleus installs on JetPack and on DGX OS;
                <br />
                how much memory the nucleus and stream manager actually use;
                <br />
                which <code>docker run</code> flags a recipe needs to reach the GPU on each machine;
                <br />
                how long it takes to deploy a multi-gigabyte policy, and whether an interrupted download resumes;
                <br />
                what happens when a start fails on purpose (the reported state, the rollback and how long it takes);
                <br />
                whether a canary subdeployment can pin a newer version;
                <br />
                and the upload throughput for one LeRobot episode by each route, with its effect on inference latency.
              </>
            }
            source={
              <>
                our own setup of a Jetson Orin Nano Super and a DGX Spark with AWS IoT, which we have not yet done.
              </>
            }
          />
          <Box variant="p">
            Before the fleet group joins, measure two times over your own link. First, time the first cloud
            deployment from start to finish. Then time the canary group&apos;s deployment, with its arms downloading
            together. You set the timeout per device from the slowest arm. Because a 6 GB policy does not fit in one
            2 GB component, the same measurement also shows how long your chosen delivery route takes on each arm.
          </Box>
          <ExpandableSection headerText="Deployment limits and default values">
            <ThreeColTable head={['Limit', 'Value', 'Source']} rows={LIMIT_ROWS} minWidth={640} />
          </ExpandableSection>
          <ExpandableSection headerText="Retired and related AWS services">
            <ul style={LIST}>
              <li>
                <strong>AWS RoboMaker</strong> was AWS&apos;s service for robotics. It reached end of support on
                September 10, 2025, and it is now in full shutdown: it is &quot;no longer available or supported in
                any capacity&quot;. AWS names no replacement in the pages cited, and RoboMaker&apos;s documentation pages
                return HTTP 404.{' '}
                <Cite id="F07-98">AWS General Reference, Services in Full Shutdown</Cite>{' '}
                <Cite id="F07-100">RoboMaker developer guide (page removed)</Cite>
              </li>
              <li>
                <strong>AWS IoT Greengrass V1</strong> ended on October 7, 2026. So a tutorial built on V1 groups no
                longer applies. The components and deployments in this section are Greengrass V2 features.{' '}
                <Cite id="F07-99">AWS General Reference, Services in Full Shutdown</Cite>
              </li>
              <li>
                <strong>AWS IoT Core, Greengrass V2 and AWS IoT Device Management</strong> appear in none of AWS&apos;s
                lists of services that are in maintenance, in sunset or shut down, as of November 2026.{' '}
                <Cite id="F07-191">AWS General Reference, service lifecycle tables</Cite>
              </li>
              <li>
                <strong>Secure tunneling</strong> gives an operator a session, such as SSH, to a device behind a
                firewall without opening an inbound port. It works with both builds of the nucleus.{' '}
                <Cite id="F07-183">AWS IoT developer guide, Secure tunneling</Cite>
              </li>
            </ul>
          </ExpandableSection>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
