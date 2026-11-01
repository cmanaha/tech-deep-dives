import { useRef } from 'react';
import type { CSSProperties } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';
import {
  Cite,
  arxiv,
  gh,
  AWSOME_DISTRIBUTED_TRAINING_SHA,
  DLC_SHA,
  METASEQ_SHA,
  NCCL_TESTS_TAG,
  NEMO_2_TAG,
  TORCHTITAN_TAG,
} from '../components/Cite';
import { useNarrow } from '../components/useNarrow';
import {
  DEFAULT_HEADROOM,
  DEFAULT_MFU,
  DENSE_MODELS,
  INSTANCES,
  rankFacts,
  shapeOf,
  type DenseModelId,
} from '../lib/presets';
import { denseRuntimeInputs, estimateRun, type AttentionMode } from '../lib/runtime';

/* ------------------------------------------------------------------------ */
/* Sources                                                                  */
/* ------------------------------------------------------------------------ */

/** Register rows cited without re-opening the source keep the register's date. */
const REGISTER_DATE = '2026-10-30';

/** AWS documentation (re-opened 2026-10-31 unless passed REGISTER_DATE). */
const OD_QUOTAS = 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-on-demand-instances.html';
const CB_GUIDE = 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html';
const TRAINING_PLANS = 'https://docs.aws.amazon.com/sagemaker/latest/dg/reserve-capacity-with-training-plans.html';
const SM_DG = 'https://docs.aws.amazon.com/sagemaker/latest/dg/';
const HP_SLURM_DEEP = `${SM_DG}sagemaker-hyperpod-resiliency-slurm-deep-health-checks.html`;
const HP_EKS_DEEP = `${SM_DG}sagemaker-hyperpod-eks-resiliency-deep-health-checks.html`;
const HP_SLURM_AMI = `${SM_DG}sagemaker-hyperpod-release-ami-slurm.html`;
const HP_EKS_AMI = `${SM_DG}sagemaker-hyperpod-release-ami-eks.html`;
const CHECKPOINTLESS_NOTES = `${SM_DG}sagemaker-eks-checkpointless-release-notes.html`;
const SMP_NOTES = `${SM_DG}model-parallel-release-notes.html`;
const EKS_ACCEL_AMI = 'https://docs.aws.amazon.com/eks/latest/userguide/ml-eks-optimized-ami.html';
const EKS_AMI_RELEASE = 'https://github.com/awslabs/amazon-eks-ami/releases/tag/v20261031';
const PCS_DLAMI = 'https://docs.aws.amazon.com/pcs/latest/userguide/working-with_ami_pcs-ready-dlami.html';
const DLAMI_20261027 =
  'https://docs.aws.amazon.com/dlami/latest/devguide/aws-deep-learning-ami-gpubaseoss-ul2404-2026-10-28.html';
const DLC_RELEASE = 'https://github.com/aws/deep-learning-containers/releases/tag/v2.16-pt-ec2-2.10.0-tr-gpu-py313';
const DLC_214_CONFIG = gh('aws/deep-learning-containers', DLC_SHA, '.github/config/image/pytorch/2.14-ec2-cuda.yml');
const EKS_OBS = 'https://docs.aws.amazon.com/eks/latest/best-practices/aiml-observability.html';

/** AWS sample repository at a pinned commit (Tier 2). */
function adt(path: string, lines?: string): string {
  return gh('aws-samples/awsome-distributed-training', AWSOME_DISTRIBUTED_TRAINING_SHA, path, lines);
}
const ADT_INDEX = adt('README.md', 'L81-L102');
const ADT_HEALTHCHECK = adt('validation/gpu-cluster-healthcheck/README.md', 'L60-L98');
const ADT_NCCL_SET = adt('micro-benchmarks/nccl-tests/README.md', 'L36-L45');
const ADT_P5_SAMPLE = adt('micro-benchmarks/nccl-tests/README.md', 'L206-L243');

/** nccl-tests v2.21.1 performance notes. */
function perf(lines: string): string {
  return gh('NVIDIA/nccl-tests', NCCL_TESTS_TAG, 'doc/PERFORMANCE.md', lines);
}
const NCCL_ENV = 'https://docs.nvidia.com/deeplearning/nccl/archives/nccl_2323/user-guide/docs/env.html';
/** aws-ofi-nccl at the release AWS's nccl-tests container pins, and libfabric's fi_info at the matching upstream tag. */
const OFI_INIT_LOG = gh('aws/aws-ofi-nccl', 'v1.21.1', 'src/nccl_ofi_net.cpp', 'L188-L195');
const FI_INFO_MAN = gh('ofiwg/libfabric', 'v2.6.0', 'man/fi_info.1.md', 'L89-L90');

/** TorchTitan v0.4.0 documentation and code. */
function tt(path: string, lines: string): string {
  return gh('pytorch/torchtitan', TORCHTITAN_TAG, path, lines);
}
const TT_FAKE_MODES = tt('docs/debugging.md', 'L18-L31');
const TT_FAKE_TOPOLOGY = tt('docs/debugging.md', 'L35-L75');
const TT_FAKE_MEMORY = tt('docs/debugging.md', 'L104-L125');
const TT_QUICKSTART = tt('README.md', 'L68-L81');
const TT_MULTINODE = tt('README.md', 'L246-L248');
const TT_FLOP_PARAMS = tt('torchtitan/models/common/flops.py', 'L84-L144');
const TT_FLOP_ATTN = tt('torchtitan/models/common/flops.py', 'L20-L51');

const NEMO_AUTOCONF_README = gh('NVIDIA/NeMo', NEMO_2_TAG, 'examples/llm/auto_configurator/README.md');
const PLAYBOOK = 'https://huggingface.co/spaces/nanotron/ultrascale-playbook/tree/c93890dd4b22356ee18ed9b863e6f2d0909729bc';

/** Production reports. */
const OPT_27 = gh('facebookresearch/metaseq', METASEQ_SHA, 'projects/OPT/chronicles/27_percent_update.md', 'L12-L17');
const META_REL = arxiv('2410.21680v2');
const LLAMA3 = arxiv('2407.21783v3');
const STRAGGLERS = arxiv('2505.05713v2');
const H100_SPEC = 'https://www.nvidia.com/en-us/data-center/h100/';
const XID_CATALOG = 'https://docs.nvidia.com/deploy/xid-errors/analyzing-xid-catalog.html';

/* ------------------------------------------------------------------------ */
/* Numbers                                                                  */
/* ------------------------------------------------------------------------ */

const P5 = INSTANCES['p5.48xlarge'];
const P5_RANKS = rankFacts(P5);
/** NVLink per GPU per direction, EFA per instance and per GPU on p5.48xlarge, GB/s (presets). */
const NVLINK_GBS = P5_RANKS.scaleUpBytesPerSecondPerRank / 1e9;
const EFA_INSTANCE_GBS = P5_RANKS.efaBytesPerSecondPerInstance / 1e9;
const EFA_GPU_GBS = P5_RANKS.efaBytesPerSecondPerRank / 1e9;

/** AWS's two-instance p5.48xlarge all_reduce_perf sample, largest row. */
const SAMPLE_BYTES = 17_179_869_184;
const SAMPLE_US = 66_132;
const SAMPLE_ALGBW = 259.78;
const SAMPLE_BUSBW = 487.09;
const SAMPLE_INSTANCES = 2;
/** Per-instance reading: algbw x 2(M-1)/M across M instances (section 7's count, our reading). */
const SAMPLE_PER_INSTANCE_GBS =
  ((SAMPLE_BYTES * 2 * (SAMPLE_INSTANCES - 1)) / SAMPLE_INSTANCES / (SAMPLE_US * 1e-6)) / 1e9;
const SAMPLE_SHARE = SAMPLE_PER_INSTANCE_GBS / EFA_INSTANCE_GBS;
const SAMPLE_FLOOR_MS = ((SAMPLE_BYTES * 2 * (SAMPLE_INSTANCES - 1)) / SAMPLE_INSTANCES / (EFA_INSTANCE_GBS * 1e9)) * 1e3;

/** Tokens per second per H100 at the default MFU, from Calculator A (as section 29 computes them). */
const H100_PEAK = P5.denseBf16TflopsPerAccelerator.value;
const MFU = DEFAULT_MFU.value;
const LONG_SEQ = 8_192;

function tokensPerSecond(id: DenseModelId, count: 'sixN' | 'torchtitan'): number {
  const inputs = denseRuntimeInputs(shapeOf(DENSE_MODELS[id]), count === 'sixN' ? 'full' : 'nonEmbedding');
  const attention: AttentionMode = count === 'sixN' ? 'none' : 'noDiscount';
  return estimateRun({
    ...inputs,
    tokens: 1e12,
    sequenceLength: LONG_SEQ,
    attention,
    peakTflopsPerAccelerator: H100_PEAK,
    accelerators: 1,
    mfu: MFU,
  }).tokensPerSecondPerAccelerator;
}

const num = (x: number) => x.toLocaleString('en-US');
/** "About" figures: nearest 100 above 2,000 tokens per second, nearest 5 below (as section 29). */
const about = (x: number) => num(x >= 2_000 ? Math.round(x / 100) * 100 : Math.round(x / 5) * 5);
const pct0 = (x: number) => `${Math.round(x * 100)}%`;

const TPS_8B_6N = about(tokensPerSecond('llama-3.1-8b', 'sixN'));
const TPS_70B_6N = about(tokensPerSecond('llama-3.1-70b', 'sixN'));
const TPS_8B_TT = about(tokensPerSecond('llama-3.1-8b', 'torchtitan'));
const TPS_70B_TT = about(tokensPerSecond('llama-3.1-70b', 'torchtitan'));
const MFU_PCT = pct0(MFU);
const HEADROOM_PCT = pct0(DEFAULT_HEADROOM.value);

/* ------------------------------------------------------------------------ */
/* Diagram: the bring-up ladder                                             */
/* ------------------------------------------------------------------------ */

const LADDER_NARROW_PX = 720;

/** Where a rung runs, from the account to the full run. */
const SCALES = ['Account', '1 process', '1 node', '2 nodes', 'Short jobs', 'Full run'] as const;
type ScaleIndex = 0 | 1 | 2 | 3 | 4 | 5;

interface Rung {
  n: number;
  title: string;
  catches: string;
  runs: string;
  section: string;
  from: ScaleIndex;
  to: ScaleIndex;
  /** Repeated on every node, each time one joins. */
  repeated?: boolean;
  group: 0 | 1 | 2 | 3;
}

const GROUPS = [
  { stroke: '#414d5c', fill: '#f4f4f4' },
  { stroke: '#1f7a70', fill: '#e6f4f2' },
  { stroke: '#0972d3', fill: '#f2f8fd' },
  { stroke: '#6f4cc4', fill: '#efe7fb' },
] as const;

const RUNGS: Rung[] = [
  { n: 1, title: 'Capacity and quota', catches: 'a zero quota, or no start date', runs: 'on the account', section: 'section 22', from: 0, to: 0, group: 0 },
  {
    n: 2,
    title: 'Screen every node',
    catches: 'bad GPUs, memory and links before a job',
    runs: 'on each node, each time one joins',
    section: 'sections 24, 25',
    from: 2,
    to: 5,
    repeated: true,
    group: 0,
  },
  { n: 3, title: 'Read the versions', catches: 'an NCCL, plugin or EFA mismatch', runs: 'inside the container', section: 'EFA dive', from: 2, to: 2, group: 0 },
  { n: 4, title: 'Collective baseline', catches: 'a slow or misconfigured fabric', runs: 'on one node, then two', section: 'section 7', from: 2, to: 3, group: 1 },
  { n: 5, title: 'Memory, then smoke run', catches: 'a layout that does not fit', runs: 'in one process, then on one node', section: 'section 5', from: 1, to: 2, group: 1 },
  { n: 6, title: 'Layout bake-off', catches: 'a layout that wins only on paper', runs: 'as short jobs on the training cluster', section: 'section 14', from: 4, to: 4, group: 2 },
  { n: 7, title: 'Throughput and MFU', catches: `a gap to the ${MFU_PCT} estimate`, runs: 'in the same short jobs', section: 'sections 4, 29', from: 4, to: 4, group: 2 },
  { n: 8, title: 'Checkpoint round trip', catches: 'a restart that is not the same run', runs: 'as a short job, one rank stopped', section: 'sections 18, 19', from: 4, to: 4, group: 3 },
  { n: 9, title: 'Scale out in steps', catches: 'stragglers and a starved data loader', runs: 'in steps up to the full world size', section: 'sections 19, 29', from: 4, to: 5, group: 3 },
  { n: 10, title: 'Alerts on', catches: 'signals that are off by default', runs: 'on a test job, then the full run', section: 'sections 29, 30', from: 4, to: 5, group: 3 },
];

function LadderDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const narrow = useNarrow(ref, LADDER_NARROW_PX);

  const ink = '#16191f';
  const muted = '#414d5c';
  const font = 'sans-serif';

  // Wide: one row per rung, with a dot matrix of where it runs.
  const wideW = 900;
  const rowTop = 92;
  const rowH = 42;
  const colX = [486, 558, 630, 702, 774, 846];
  const wideH = rowTop + RUNGS.length * rowH + 28;

  // Narrow: one card per rung, three text lines.
  const narrowW = 400;
  const cardTop = 54;
  const cardH = 66;
  const cardGap = 8;
  const narrowH = cardTop + RUNGS.length * (cardH + cardGap) - cardGap + 30;

  const W = narrow ? narrowW : wideW;
  const H = narrow ? narrowH : wideH;

  return (
    <div ref={ref}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-labelledby="bring-up-ladder-title"
        aria-describedby="bring-up-ladder-desc"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        <title id="bring-up-ladder-title">
          Bring-up is a ladder of ten checks taken in order, each at the smallest scale that can show the failures it
          catches: the account first, then one process and one node, then two nodes, then short jobs on the training
          cluster, and only then the full run, so a fault found early costs one node&apos;s time instead of the whole
          cluster&apos;s.
        </title>
        <desc id="bring-up-ladder-desc">
          {RUNGS.map((r) => `Rung ${r.n}, ${r.title}: runs ${r.runs}; catches ${r.catches}; ${r.section}.`).join(' ')}{' '}
          Screening is repeated on every node each time one joins.
        </desc>
        <rect x={0} y={0} width={W} height={H} rx={8} fill="#ffffff" />

        <text x={narrow ? 12 : 16} y={24} fontFamily={font} fontSize={13} fontWeight={600} fill={ink}>
          {narrow ? 'The bring-up ladder, top to bottom' : 'The bring-up ladder: ten checks, top to bottom, each at the smallest scale that shows its failures'}
        </text>
        <text x={narrow ? 12 : 16} y={41} fontFamily={font} fontSize={11} fill={muted}>
          {narrow ? 'Each rung at the smallest scale that shows its failures' : 'Left: the check, what it catches and the section that sets its pass condition. Right: where it runs.'}
        </text>

        {!narrow && (
          <>
            <text x={(colX[0] + colX[5]) / 2} y={64} fontFamily={font} fontSize={11} fontWeight={600} fill={ink} textAnchor="middle">
              Where it runs
            </text>
            {SCALES.map((label, i) => (
              <g key={label}>
                <text x={colX[i]} y={82} fontFamily={font} fontSize={11} fill={muted} textAnchor="middle">
                  {label}
                </text>
                <line x1={colX[i]} y1={rowTop - 4} x2={colX[i]} y2={rowTop + RUNGS.length * rowH - 4} stroke="#d1d5db" strokeWidth={1} strokeDasharray="3 4" />
              </g>
            ))}
            {RUNGS.map((r, i) => {
              const y0 = rowTop + i * rowH;
              const cy = y0 + 19;
              const g = GROUPS[r.group];
              return (
                <g key={r.n}>
                  <rect x={12} y={y0} width={wideW - 24} height={rowH - 4} rx={6} fill={g.fill} stroke={g.stroke} strokeWidth={1} />
                  <circle cx={36} cy={cy} r={12} fill={g.stroke} />
                  <text x={36} y={cy + 4} fontFamily={font} fontSize={11} fontWeight={700} fill="#ffffff" textAnchor="middle">
                    {r.n}
                  </text>
                  <text x={58} y={y0 + 17} fontFamily={font} fontSize={13} fontWeight={600} fill={ink}>
                    {r.title}
                  </text>
                  <text x={430} y={y0 + 17} fontFamily={font} fontSize={11} fill={muted} textAnchor="end">
                    {r.section}
                  </text>
                  <text x={58} y={y0 + 32} fontFamily={font} fontSize={11} fill={muted}>
                    catches {r.catches}
                  </text>
                  {r.to > r.from && (
                    <line
                      x1={colX[r.from]}
                      y1={cy}
                      x2={colX[r.to]}
                      y2={cy}
                      stroke={g.stroke}
                      strokeWidth={3}
                      strokeDasharray={r.repeated ? '6 5' : undefined}
                    />
                  )}
                  <circle cx={colX[r.from]} cy={cy} r={7} fill={g.stroke} />
                  {r.to > r.from && <circle cx={colX[r.to]} cy={cy} r={7} fill={g.stroke} />}
                </g>
              );
            })}
            <text x={16} y={wideH - 10} fontFamily={font} fontSize={11} fill={muted}>
              Dashed: repeated on every node, each time one joins the cluster. A line spans every scale the rung runs at.
            </text>
          </>
        )}

        {narrow && (
          <>
            {RUNGS.map((r, i) => {
              const y0 = cardTop + i * (cardH + cardGap);
              const g = GROUPS[r.group];
              return (
                <g key={r.n}>
                  <rect
                    x={8}
                    y={y0}
                    width={narrowW - 16}
                    height={cardH}
                    rx={6}
                    fill={g.fill}
                    stroke={g.stroke}
                    strokeWidth={r.repeated ? 1.5 : 1}
                    strokeDasharray={r.repeated ? '6 4' : undefined}
                  />
                  <circle cx={28} cy={y0 + 20} r={11} fill={g.stroke} />
                  <text x={28} y={y0 + 24} fontFamily={font} fontSize={11} fontWeight={700} fill="#ffffff" textAnchor="middle">
                    {r.n}
                  </text>
                  <text x={46} y={y0 + 24} fontFamily={font} fontSize={13} fontWeight={600} fill={ink}>
                    {r.title}
                  </text>
                  <text x={narrowW - 16} y={y0 + 24} fontFamily={font} fontSize={10} fill={muted} textAnchor="end">
                    {r.section}
                  </text>
                  <text x={46} y={y0 + 42} fontFamily={font} fontSize={11} fill={ink}>
                    Runs {r.runs}
                  </text>
                  <text x={46} y={y0 + 58} fontFamily={font} fontSize={11} fill={muted}>
                    Catches {r.catches}
                  </text>
                </g>
              );
            })}
            <text x={12} y={narrowH - 10} fontFamily={font} fontSize={11} fill={muted}>
              Dashed border: repeated on every node as it joins.
            </text>
          </>
        )}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

const PRE: CSSProperties = { margin: 0, whiteSpace: 'pre', overflowX: 'auto' };
const LIST: CSSProperties = { margin: 0, paddingLeft: 20 };

export function BringUp() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Bring a run up in the order that catches each failure at the cheapest scale, and replace the dive's estimates with your own measured step: removing nodes that failed repeatedly cut Meta's large-job failures from 14% to 4% (TorchTitan v0.4.0, nccl-tests v2.21.1, NeMo v2.7.3, AWS documentation and AWS samples at a pinned commit, read 2026-10-31)"
          >
            31. Bring-Up: From One Node to the Full Run
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Bring-up is the work between holding accelerators and starting the long run: the checks that prove the
            nodes, the fabric, the software and the chosen layout before weeks of cluster time depend on them. Every
            number this dive estimates, from MFU (model FLOPs utilization: the share of the accelerators&apos; peak
            rate of floating-point operations, or FLOPs, that a run achieves) to memory per rank, collective time and
            checkpoint interval, stays a prediction until a measured step replaces it.
          </Box>
          <Box variant="p">
            The challenge is to order the checks so that each failure shows up at the smallest scale that can reveal
            it: a bad GPU on one node, a slow fabric on two, a layout that does not fit in one process, a slow rank
            only at full width. Found there, a fault costs one node&apos;s time instead of the whole cluster&apos;s.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="See the ten rungs in order, where each one runs and the failure it catches, so a fault surfaces on one node before it can stop the full run"
          >
            The bring-up ladder
          </Header>
        }
      >
        <SpaceBetween size="m">
          <LadderDiagram />
          <Box variant="small" color="text-body-secondary">
            Schematic, not measured. The order is our reading of practices first-party sources state; each rung&apos;s
            sources are in the block that covers it.
          </Box>
          <Box variant="p">
            Each rung catches the failures that are cheapest to find at its scale, and passing it is what earns the
            next, larger one. Rungs 1 to 3 need no training code. Rungs 4 and 5 need one node or two. Rungs 6 to 8 run
            as short jobs on the cluster you will train on, and rungs 9 and 10 take the job to its full width with the
            alerts on.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Get a start date, keep bad nodes out before they take work, and read the software versions where they run: removing nodes that failed repeatedly cut Meta's large-job failures from 14% to 4%"
          >
            Rungs 1 to 3: capacity, clean nodes and known versions
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>1. Capacity and quota.</strong> The On-Demand quota for P and Trn instances, counted in vCPUs
            (virtual CPUs), defaults to 0{' '}
            <Cite tier={1} href={OD_QUOTAS}>
              EC2 On-Demand Instance quotas
            </Cite>
            , so a new account launches no p5.48xlarge On-Demand until it is raised. A future start date comes from a
            Capacity Block for ML, which can start up to eight weeks ahead and sits outside the On-Demand quota{' '}
            <Cite tier={1} href={CB_GUIDE}>
              EC2 Capacity Blocks for ML
            </Cite>
            , or from a SageMaker training plan, bookable up to 8 weeks ahead{' '}
            <Cite tier={1} href={TRAINING_PLANS}>
              SageMaker training plans
            </Cite>
            . Section 22, Capacity &amp; Cost, compares the purchases and the edges of their windows.
          </Box>

          <Box variant="p">
            <strong>2. Screen every node before it takes work, and every node that joins later.</strong> Nodes can
            arrive faulty: during OPT-175B&apos;s training, nodes came up with NCCL (NVIDIA Collective Communications
            Library) or InfiniBand faults or ECC (error-correcting code) errors, replacements often turned out to be the
            same bad machine, and the team added GPU burn-in and automated fabric tests{' '}
            <Cite tier={2} href={OPT_27} accessed={REGISTER_DATE}>
              OPT-175B logbook, 27% update, L12-L17
            </Cite>
            . HyperPod&apos;s deep health checks are AWS&apos;s form of that screen: DCGM (NVIDIA Data Center GPU
            Manager) diagnostics at level 4, typically about 45 to 90 minutes depending on GPU count, EFA (Elastic
            Fabric Adapter) loopback tests of about 2 to 5 minutes, and a multi-node NCCL all-reduce of about 5 to 15
            minutes. They run when instances are first provisioned or added, for an instance group that sets{' '}
            <code>OnStartDeepHealthChecks</code>, and a node that fails is replaced and its replacement checked
            again{' '}
            <Cite tier={1} href={HP_SLURM_DEEP}>
              HyperPod Slurm deep health checks
            </Cite>
            . That Slurm page lists GPU instances only; Trainium deep checks are documented on HyperPod EKS (Amazon
            Elastic Kubernetes Service){' '}
            <Cite tier={1} href={HP_EKS_DEEP}>
              HyperPod EKS deep health checks
            </Cite>
            . On a cluster you run yourself, AWS&apos;s sample health-check suite splits the same tests into a
            lightweight set of about 15 minutes, for job prologs and periodic sweeps, and an intensive set of 1 to 3
            hours (DCGM level 4, the multi-node NCCL all-reduce and EFA loopback) that needs the node to itself{' '}
            <Cite tier={2} href={ADT_HEALTHCHECK}>
              awsome-distributed-training gpu-cluster-healthcheck README L60-L98
            </Cite>
            .
          </Box>
          <Box variant="p">
            Keep each node&apos;s results, by instance, rather than only its latest pass. Meta found 40 nodes that
            failed repeatedly from historical health-check and job data, and removing them cut the failure rate of
            jobs on 512 or more GPUs from 14% to 4%{' '}
            <Cite tier={3} href={META_REL} venue="HPCA 2025">
              Revisiting Reliability in Large-Scale ML Research Clusters, Section IV-A
            </Cite>
            . A record per node lets a cluster you run yourself do the same, our reading. Section 20, Who Owns What on
            AWS, shows which paths screen nodes for you, and sections 24 to 26 give each path&apos;s screening; on
            SageMaker training jobs the check before a job is opt-in (section 26). The fabric checks are
            in the <Link href="../efa/">EFA dive, section 15: EFA on Amazon EKS</Link> and its{' '}
            <Link href="../efa/">section 19: Decision Guide</Link>.
          </Box>

          <Box variant="p">
            <strong>3. Read the versions inside the running container.</strong> NCCL, the aws-ofi-nccl plugin that
            carries its traffic over libfabric, and the EFA software under both have to agree with each other and
            with the instance (the{' '}
            <Link href="../efa/">EFA dive, section 9: NCCL over EFA: the aws-ofi-nccl Plugin</Link>). On every AWS
            path read, the AMI (Amazon Machine Image) supplies the EFA kernel driver and the container or the customer
            supplies NCCL and aws-ofi-nccl, and only pages that describe a container state an NCCL version; the list
            below gives each path&apos;s, including the one AMI that also carries aws-ofi-nccl on the host. One
            version decides two others: AWS&apos;s nccl-tests container pins EFA installer 1.50.0, which bundles
            aws-ofi-nccl 1.21.1 and libfabric 2.6.0amzn1.0, and pairs it with NCCL 2.31.2-1, the release the
            aws-ofi-nccl 1.21.1 notes name as tested{' '}
            <Cite tier={2} href={ADT_NCCL_SET}>
              awsome-distributed-training nccl-tests README L36-L45
            </Cite>
            . So read the versions where the job runs, our reading of these pages:
          </Box>
          <pre style={PRE}>
            <code>{`fi_info --version     # libfabric, run inside the training container
NCCL_DEBUG=VERSION    # NCCL prints its version when the program starts
NCCL_DEBUG=INFO       # adds "NET/OFI Initializing aws-ofi-nccl <version>"`}</code>
          </pre>
          <Box variant="p">
            The <code>VERSION</code> level prints the NCCL version at the start of the program{' '}
            <Cite tier={1} href={NCCL_ENV}>
              NCCL 2.32.3 environment variables, NCCL_DEBUG
            </Cite>
            . At <code>INFO</code>, the bring-up level section 30 sets, the plugin logs its own version and the
            libfabric version it loaded as it initialises{' '}
            <Cite tier={1} href={OFI_INIT_LOG} kind="code">
              aws-ofi-nccl v1.21.1 nccl_ofi_net.cpp L188-L195
            </Cite>
            , and <code>fi_info --version</code> prints libfabric&apos;s{' '}
            <Cite tier={1} href={FI_INFO_MAN}>
              libfabric v2.6.0 fi_info man page L89-L90
            </Cite>
            . Record the image digest with every benchmark, not only its tag: the Deep Learning Containers&apos;
            PyTorch 2.14 build configuration pins NCCL 2.30.7-1 and installs the EFA installer marked{' '}
            <code>latest</code> when the image is built{' '}
            <Cite tier={1} href={DLC_214_CONFIG} kind="code" accessed={REGISTER_DATE}>
              deep-learning-containers 2.14-ec2-cuda.yml
            </Cite>
            .
          </Box>
          <ExpandableSection headerText="What each AWS path documents about these versions">
            <SpaceBetween size="s">
              <ul style={LIST}>
                <li>
                  <strong>HyperPod Slurm and HyperPod EKS AMIs</strong>, entries of October 19 and October 16, 2026: EFA
                  installer 1.50.0, and no NCCL or aws-ofi-nccl version in the current entries{' '}
                  <Cite tier={1} href={HP_SLURM_AMI}>
                    HyperPod Slurm AMI release notes
                  </Cite>{' '}
                  <Cite tier={1} href={HP_EKS_AMI}>
                    HyperPod EKS AMI release notes
                  </Cite>
                  .
                </li>
                <li>
                  <strong>EKS-optimized AL2023 accelerated AMI</strong>, release v20261031: the <code>efa</code> 3.3.1
                  package{' '}
                  <Cite tier={1} href={EKS_AMI_RELEASE}>
                    amazon-eks-ami release v20261031
                  </Cite>
                  , listed as EFA minimal (kernel module and rdma-core); NCCL is not among the AMI&apos;s components{' '}
                  <Cite tier={1} href={EKS_ACCEL_AMI}>
                    EKS-optimized accelerated AMIs
                  </Cite>
                  .
                </li>
                <li>
                  <strong>PCS-ready DLAMI</strong> (AWS Parallel Computing Service, Deep Learning AMI): built on the Deep
                  Learning Base GPU AMI and carrying no AI or ML frameworks{' '}
                  <Cite tier={1} href={PCS_DLAMI}>
                    PCS-ready DLAMI
                  </Cite>
                  ; the base&apos;s release 20261027 ships EFA installer 1.51.0 and aws-ofi-nccl 1.22.0{' '}
                  <Cite tier={1} href={DLAMI_20261027} accessed={REGISTER_DATE}>
                    DLAMI release notes, 20261027
                  </Cite>
                  .
                </li>
                <li>
                  <strong>HyperPod checkpointless training container v1.0.1</strong>: NCCL 2.27.5, aws-ofi-nccl
                  1.16.0, EFA 1.43.0{' '}
                  <Cite tier={1} href={CHECKPOINTLESS_NOTES}>
                    HyperPod checkpointless training release notes
                  </Cite>
                  .
                </li>
                <li>
                  <strong>SMP (the SageMaker model parallelism library) v2.8.0 container</strong>: NCCL 2.23.4{' '}
                  <Cite tier={1} href={SMP_NOTES}>
                    SMP release notes
                  </Cite>
                  .
                </li>
                <li>
                  <strong>Deep Learning Containers, PyTorch training release v2.16</strong> (PyTorch 2.10): lists
                  libnccl-ofi without a version, and no EFA version{' '}
                  <Cite tier={1} href={DLC_RELEASE}>
                    deep-learning-containers release v2.16-pt-ec2-2.10.0-tr-gpu-py313
                  </Cite>
                  .
                </li>
              </ul>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description={`Replace section 7's link peaks with your own bus bandwidth, read per instance across instances against ${EFA_INSTANCE_GBS} GB/s, and prove the target layout fits in one process before it costs a multi-node job`}
          >
            Rungs 4 and 5: the collective baseline and the memory check
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>4. Collective baseline.</strong> Run nccl-tests, NVIDIA&apos;s collective benchmark, on one
            instance and then on two, and read the largest message sizes, where the time measures bandwidth rather
            than latency{' '}
            <Cite tier={1} href={perf('L5-L12')}>
              nccl-tests PERFORMANCE.md L5-L12
            </Cite>
            . Its bus bandwidth column, <code>busbw</code>, is built to be held against the hardware peak whatever the
            rank count{' '}
            <Cite tier={1} href={perf('L27-L29')}>
              nccl-tests PERFORMANCE.md L27-L29
            </Cite>
            , and its formula assumes each rank has its own bandwidth to the outside world{' '}
            <Cite tier={1} href={perf('L52')}>
              PERFORMANCE.md L52
            </Cite>
            . Section 7, Collectives &amp; What They Cost, explains both columns; what changes between one instance
            and two is the peak to hold them against.
          </Box>
          <ul style={LIST}>
            <li>
              <strong>One p5.48xlarge.</strong> Eight ranks on NVLink: hold <code>busbw</code> against {NVLINK_GBS} GB/s
              per GPU.
            </li>
            <li>
              <strong>Two p5.48xlarge.</strong> Collectives that sum or gather combine inside each instance first and
              cross on the instance&apos;s EFA, {EFA_INSTANCE_GBS} GB/s for its eight GPUs (section 7). nccl-tests still
              counts 16 ranks, so its <code>busbw</code> can exceed what one instance can send. Count instances
              instead: for an all-reduce across M instances, hold <code>algbw x 2(M-1)/M</code>, which is{' '}
              <code>algbw</code> itself at two, against {EFA_INSTANCE_GBS} GB/s. That reading is ours, from section
              7&apos;s per-instance count.
            </li>
          </ul>
          <ExpandableSection headerText="AWS's two-instance sample, read per instance">
            <Box variant="p">
              AWS&apos;s sample for two p5.48xlarge all-reduces 16 GiB in {num(SAMPLE_US)} microseconds, algbw{' '}
              {SAMPLE_ALGBW} GB/s and busbw {SAMPLE_BUSBW} GB/s{' '}
              <Cite tier={2} href={ADT_P5_SAMPLE} kind="vendor-claim">
                awsome-distributed-training nccl-tests README L206-L243
              </Cite>
              . The busbw is above the instance&apos;s {EFA_INSTANCE_GBS} GB/s because it counts 16 ranks. Read per
              instance, {Math.round(SAMPLE_PER_INSTANCE_GBS)} GB/s is about {pct0(SAMPLE_SHARE)} of {EFA_INSTANCE_GBS}{' '}
              GB/s: the run took {Math.round(SAMPLE_US / 1000)} ms against the {Math.round(SAMPLE_FLOOR_MS)} ms the
              instance&apos;s EFA needs at full rate (our arithmetic on the sample&apos;s row). The sample states no NCCL
              or EFA version, so take it as the shape of a healthy result rather than a pass threshold.
            </Box>
          </ExpandableSection>
          <Box variant="p">
            Your measured per-instance figure is the number to divide by wherever sections 7 and 14 divide by the{' '}
            {EFA_INSTANCE_GBS} GB/s peak, our reading.
          </Box>
          <Box variant="p">
            For an MoE (mixture of experts) layout add <code>alltoall_perf</code>: its bytes are addressed GPU to GPU
            and each GPU pays its {EFA_GPU_GBS} GB/s share (section 7). On Trainium the counterpart is AWS&apos;s
            nccom-tests sample{' '}
            <Cite tier={2} href={ADT_INDEX}>
              awsome-distributed-training README L81-L102
            </Cite>{' '}
            and the NCCOM tests in HyperPod EKS&apos;s deep checks{' '}
            <Cite tier={1} href={HP_EKS_DEEP}>
              HyperPod EKS deep health checks
            </Cite>
            . Section 7 holds the A1 protocol, not yet run, which would take these measurements on current releases.
          </Box>

          <Box variant="p">
            <strong>5. Check the target layout&apos;s memory in one process, then smoke-test it on one node.</strong>{' '}
            TorchTitan&apos;s fake process-group mode builds one rank of the real layout in a single process.{' '}
            <code>NGPU</code> names the logical world size rather than the processes launched, the run creates no
            NCCL process groups and moves no peer data, and the launcher stops it after one training step by
            default{' '}
            <Cite tier={1} href={TT_FAKE_TOPOLOGY}>
              TorchTitan v0.4.0 docs/debugging.md L35-L75
            </Cite>
            . Keep the model, dtype, batch geometry, parallel degrees, activation checkpointing, FSDP (Fully Sharded
            Data Parallel) policy and CUDA-graph settings identical to the intended job{' '}
            <Cite tier={1} href={TT_FAKE_MEMORY}>
              TorchTitan v0.4.0 docs/debugging.md L104-L125
            </Cite>
            . Adapted from TorchTitan&apos;s example, with your own recipe:
          </Box>
          <pre style={PRE}>
            <code>{`# One process stands in for logical rank 0 of a 256-rank job.
# With pipeline parallelism, add FAKE_PP_RANK=<stage> to pick the stage.
NGPU=256 COMM_BACKEND=fake MODULE=my_recipes CONFIG=my_target_layout ./run_train.sh`}</code>
          </pre>
          <Box variant="p">
            Fake execution represents PyTorch-managed parameters, optimizer state, activations, gradients and
            pipeline buffers, and does not represent NCCL communicator allocations, network registration or
            collective scratch{' '}
            <Cite tier={1} href={TT_FAKE_MEMORY}>
              docs/debugging.md L121-L125
            </Cite>
            . Compare its peak with Calculator B&apos;s estimate for the same layout (section 5, The Memory Budget),
            and keep a margin for what fake mode cannot see: that calculator targets {HEADROOM_PCT} of HBM
            (high-bandwidth memory) by default, our reading. A real distributed run is still required for communication,
            numerical and performance evidence{' '}
            <Cite tier={1} href={TT_FAKE_MODES}>
              docs/debugging.md L18-L31
            </Cite>
            .
          </Box>
          <Box variant="p">
            Then run the layout scaled down on one node for a few steps, reading the allocator&apos;s peaks as section
            29, What to Measure in a Run, sets out. It catches what fake mode cannot: NCCL starting over NVLink, the
            data loader, the first save and a loss that moves. That step is our reading,
            located as a stated practice in one first-party source&apos;s quick start and not in the two AWS
            repositories read. TorchTitan&apos;s quick start trains a debug model on one GPU, then a real recipe on 8
            GPUs{' '}
            <Cite tier={1} href={TT_QUICKSTART}>
              TorchTitan v0.4.0 README L68-L81
            </Cite>
            , then multi-node with Slurm{' '}
            <Cite tier={1} href={TT_MULTINODE}>
              README L246-L248
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description={`Keep the layout that measures fastest, then hold its tokens per second against Calculator A on the same FLOP count: at ${MFU_PCT} MFU an H100 trains Llama 3.1 8B at about ${TPS_8B_6N} tokens per second by 6N and about ${TPS_8B_TT} by TorchTitan's count at ${num(LONG_SEQ)} tokens`}
          >
            Rungs 6 and 7: pick the layout by measurement
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>6. Layout bake-off.</strong> Run the two or three layouts Calculator C kept (section 14, Set My
            Ranks: The Sizing Procedure) as short jobs, a few hundred steps each (our reading), on the cluster you will
            train on, and keep the one with the best measured throughput. NeMo 2.x&apos;s Auto Configurator ranked
            its candidates the same way, by measured throughput from short jobs, and warned that some may fail on
            memory{' '}
            <Cite tier={1} href={NEMO_AUTOCONF_README} accessed={REGISTER_DATE}>
              NeMo v2.7.3 Auto Configurator README
            </Cite>
            . The formulas pick the candidates and the implementation picks the winner: in the Ultra-Scale
            Playbook&apos;s sweep, which of tensor or pipeline parallelism ran faster flipped as its authors optimised
            each{' '}
            <Cite tier={3} href={PLAYBOOK} accessed={REGISTER_DATE}>
              The Ultra-Scale Playbook, benchmarking thousands of configurations
            </Cite>
            .
          </Box>
          <Box variant="p">
            If a short job cannot hold the whole cluster, run it on part of it with each candidate&apos;s tensor,
            pipeline and context degrees unchanged, repeat rung 5&apos;s fake-mode check at that size because a smaller
            FSDP degree raises memory per rank, and let rung 9 grow the winner to full width (our reading).
          </Box>
          <Box variant="p">
            <strong>7. Throughput and MFU against the estimate.</strong> Hold the winner&apos;s tokens per second per
            accelerator against Calculator A&apos;s estimate (section 4, Counting the Arithmetic), with the same FLOP
            count on both sides. At {MFU_PCT} MFU and the H100&apos;s dense BF16 (bfloat16) peak of {H100_PEAK} TFLOPS
            (trillion floating-point operations per second), half the sparse figure NVIDIA lists{' '}
            <Cite tier={1} href={H100_SPEC} kind="vendor-claim" accessed={REGISTER_DATE}>
              NVIDIA H100 specification
            </Cite>
            , counting 6N FLOPs per token with every parameter and no attention term, an H100 trains Llama 3.1 8B at
            about {TPS_8B_6N} tokens per second and 70B at about {TPS_70B_6N}. TorchTitan&apos;s MFU column also counts
            attention{' '}
            <Cite tier={1} href={TT_FLOP_ATTN} kind="code">
              TorchTitan v0.4.0 flops.py L20-L51
            </Cite>{' '}
            and leaves out the embedding table{' '}
            <Cite tier={1} href={TT_FLOP_PARAMS} kind="code">
              flops.py L84-L144
            </Cite>
            , so at {num(LONG_SEQ)}-token sequences its {MFU_PCT} is about {TPS_8B_TT} for 8B and about {TPS_70B_TT}{' '}
            for 70B (our arithmetic through Calculator A).
          </Box>
          <Box variant="p">
            The {MFU_PCT} is a labelled assumption inside the 38% to 43% that Llama 3 405B measured in BF16 on H100{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint">
              Llama 3 Herd of Models, Table 4
            </Cite>
            , and no first-party MFU for dense Llama-class training on H200 or Trainium2 was located in this research.
            Turn the logged rate into MFU as section 29 does, put it into Calculator A in place of the {MFU_PCT}, and
            the run-time and cost estimates of sections 4, 14 and 22 become your run&apos;s.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Prove a restart on purpose, grow the job to full width in steps, and switch the alerts on, so the first real failure costs one checkpoint interval and arrives as an alert"
          >
            Rungs 8 to 10: restart, scale out, alert
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>8. A checkpoint round trip.</strong> Save at the interval Calculator D gives for the measured step
            time (section 18, Checkpointing), stop one rank&apos;s process, and let the restart path bring the job
            back (section 19, Resuming Correctly, names the layer that restarts it on each path). Compare the loss
            curve after the resume with the curve before the stop, and check that each rank&apos;s data loader resumed
            at its next sample (section 19). Time the save&apos;s blocking time and the restart, the load included, and
            enter both in Calculator D in place of its assumptions, as section 18 asks. The round trip as a rung is our
            reading; its pass conditions are sections 18 and 19&apos;s.
          </Box>
          <Box variant="p">
            <strong>9. Scale out in steps.</strong> Grow the job to its full world size in a few steps, adding
            data-parallel replicas, and compare per-rank step time and the data-loading share with the step before
            (our reading). Past two instances, more replicas add little traffic per instance: an all-reduce of S bytes
            across M instances sends at least <code>2(M-1)/M x S</code> per instance, S at two instances and under 2S
            at any size (our arithmetic on section 7&apos;s count, bytes only; latency grows with the rank count). Step
            time that keeps rising as replicas join points elsewhere: at a slow rank, which section 19 finds from
            per-rank compute time and which cost 10.4% of allocated GPU-hours in ByteDance&apos;s trace of large
            jobs{' '}
            <Cite tier={3} href={STRAGGLERS} venue="OSDI 2025" accessed={REGISTER_DATE}>
              Understanding Stragglers in Large Model Training, Sections 3.1 and 4.1
            </Cite>
            , or at a data loader falling behind, which the EKS Best Practices Guide flags above 20% of training time{' '}
            <Cite tier={1} href={EKS_OBS}>
              EKS Best Practices Guide, AI/ML observability
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>10. Turn the alerts on before the long run.</strong> Switch on section 29&apos;s alert set, from a
            sustained throughput drop to any Xid (the NVIDIA driver&apos;s numbered GPU error reports) whose immediate
            bucket in NVIDIA&apos;s catalog is RESET_GPU, RESTART_BM or a WORKFLOW_ bucket{' '}
            <Cite tier={1} href={XID_CATALOG}>
              NVIDIA Xid catalog
            </Cite>
            , an alert rule that is our reading of the catalog, and the default-off signals that section 30, The
            Telemetry Stack on AWS, turns on for your path. On a short test job, check that every signal reports and
            every alert has data to read, then start the long run.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Run the ten checks in order, each against the section that sets its pass condition, and leave with your own measured step in place of every estimate in this dive"
          >
            Your bring-up checklist
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ol style={LIST}>
            <li>
              <strong>Quota or reservation:</strong> the On-Demand P or Trn quota raised, or a Capacity Block or
              training plan bought for the window (section 22).
            </li>
            <li>
              <strong>Every node screened:</strong> DCGM level 4, EFA loopback and a multi-node NCCL all-reduce
              passed, with results kept per node to find repeat offenders (sections 24 and 25).
            </li>
            <li>
              <strong>Versions recorded:</strong> libfabric, aws-ofi-nccl and NCCL read inside the container, with the
              image digest (EFA dive, section 9).
            </li>
            <li>
              <strong>Bus bandwidth measured:</strong> one instance against {NVLINK_GBS} GB/s per GPU, two instances
              per instance against {EFA_INSTANCE_GBS} GB/s (section 7).
            </li>
            <li>
              <strong>Memory checked:</strong> the fake-mode peak under Calculator B&apos;s estimate with headroom, then
              a one-node smoke run (section 5).
            </li>
            <li>
              <strong>Layout chosen by measurement:</strong> the best tokens per second among Calculator C&apos;s two
              or three (section 14).
            </li>
            <li>
              <strong>MFU measured</strong> on Calculator A&apos;s FLOP count and entered in Calculator A (sections 4
              and 29).
            </li>
            <li>
              <strong>Restart proven:</strong> loss and data position continue after a stopped rank, with the blocking
              and restart times entered in Calculator D (sections 18 and 19).
            </li>
            <li>
              <strong>Full width reached in steps:</strong> per-rank step time and the data-loading share steady at
              each step (sections 19 and 29).
            </li>
            <li>
              <strong>Alerts and default-off signals on</strong>, each tested on a short job (sections 29 and 30).
            </li>
          </ol>
          <Box variant="p">
            When rung 7 passes, the {MFU_PCT} this dive assumed gives way to your own run&apos;s MFU, and every
            estimate built on it follows. Start with rung 1 today: the quota request or the reservation sets the date
            every other rung waits for, and a Capacity Block can be booked up to eight weeks ahead{' '}
            <Cite tier={1} href={CB_GUIDE}>
              EC2 Capacity Blocks for ML
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
