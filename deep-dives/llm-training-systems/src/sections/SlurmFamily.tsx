import { useRef } from 'react';
import type { CSSProperties } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';
import { Cite, gh, ghTree, AWSOME_DISTRIBUTED_TRAINING_SHA, PARALLELCLUSTER_TAG } from '../components/Cite';
import { useNarrow } from '../components/useNarrow';
import { INSTANCES, PCS_FEES } from '../lib/presets';
import type { InstanceId, PcsControllerSize, PricePath } from '../lib/presets';
import { priceRun } from '../lib/runtime';
import type { CostResult } from '../lib/runtime';

/* ------------------------------------------------------------------------ */
/* Sources                                                                  */
/* ------------------------------------------------------------------------ */

/** Register date for rows cited without re-opening their source. */
const R1 = '2026-10-30';

/* Slurm (current online pages; both state "Version 26.05" on 2026-10-31) */
const SLURM_CONF = 'https://slurm.schedmd.com/slurm.conf.html';
const SLURM_SBATCH = 'https://slurm.schedmd.com/sbatch.html';

/* Your own Slurm on EC2 */
const PC_WHATIS = 'https://docs.aws.amazon.com/parallelcluster/latest/ug/what-is-aws-parallelcluster.html';
const PC_SUPPORT = 'https://docs.aws.amazon.com/parallelcluster/latest/ug/support-policy.html';
const PC_TAG = ghTree('aws/aws-parallelcluster', PARALLELCLUSTER_TAG);
const DLAMI_BASE = 'https://docs.aws.amazon.com/dlami/latest/devguide/aws-deep-learning-ami-gpubaseoss-ul2404-2026-10-28.html';

/* AWS's samples repository, at the commit register 06 pins */
const AWSOME = 'awslabs/awsome-distributed-ai';
const AWSOME_70B = (lines: string) =>
  gh(AWSOME, AWSOME_DISTRIBUTED_TRAINING_SHA, 'examples/training/fsdp/slurm/llama3_1_70b-training.sbatch', lines);
const AWSOME_HC_TREE = ghTree(AWSOME, AWSOME_DISTRIBUTED_TRAINING_SHA, 'validation/gpu-cluster-healthcheck');
const AWSOME_HC_README = gh(AWSOME, AWSOME_DISTRIBUTED_TRAINING_SHA, 'validation/gpu-cluster-healthcheck/README.md', 'L1-L5');

/* AWS PCS */
const PCS_UG = 'https://docs.aws.amazon.com/pcs/latest/userguide/';
const PCS_VERSIONS = `${PCS_UG}slurm-versions.html`;
const PCS_CUSTOM_AMI = `${PCS_UG}working-with_ami_custom.html`;
const PCS_DLAMI = `${PCS_UG}working-with_ami_pcs-ready-dlami.html`;
const PCS_AMI_NOTES = `${PCS_UG}ami-release-notes.html`;
const PCS_SIZE = `${PCS_UG}working-with_clusters_size.html`;
const PCS_CB = `${PCS_UG}capacity-blocks.html`;
const PCS_TOC = `${PCS_UG}toc-contents.json`;
const PCS_SETTINGS = `${PCS_UG}slurm-custom-settings-cluster.html`;
const PCS_REBOOT = `${PCS_UG}slurm-reboot.html`;
const PCS_REBOOT_FAQ = `${PCS_UG}slurm-reboot-faq.html`;
const PCS_REPLACED = `${PCS_UG}troubleshooting_instance-terminated-after-reboot.html`;
const PCS_PRICE = 'https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AWSPCS/20261027150327/us-east-1/index.json';
const PCS_PRICING = 'https://aws.amazon.com/pcs/pricing/';
const WN_PCS_P6E = 'https://aws.amazon.com/about-aws/whats-new/2026/06/aws-parallel-computing-service/';

/* SageMaker HyperPod with Slurm */
const SM_DG = 'https://docs.aws.amazon.com/sagemaker/latest/dg/';
const HP_SLURM = `${SM_DG}sagemaker-hyperpod-slurm.html`;
const HP_AUTO_RESUME = `${SM_DG}sagemaker-hyperpod-resiliency-slurm-auto-resume.html`;
const HP_SLURM_DEEP = `${SM_DG}sagemaker-hyperpod-resiliency-slurm-deep-health-checks.html`;
const HP_SLURM_HEALTH = `${SM_DG}sagemaker-hyperpod-resiliency-slurm-cluster-health-check.html`;
const HP_HMA = `${SM_DG}sagemaker-hyperpod-eks-resiliency-health-monitoring-agent.html`;
const HP_EKS_DEEP = `${SM_DG}sagemaker-hyperpod-eks-resiliency-deep-health-checks.html`;
const HP_MULTIHEAD = `${SM_DG}sagemaker-hyperpod-multihead-slurm.html`;
const HP_FAQ_SLURM = `${SM_DG}sagemaker-hyperpod-faq-slurm.html`;
const SM_PLANS = `${SM_DG}reserve-capacity-with-training-plans.html`;
const WN_HP_CUSTOM_AMI = 'https://aws.amazon.com/about-aws/whats-new/2026/07/hyperpod-custom-ami-slurm/';
const WN_HP_TOPOLOGY = 'https://aws.amazon.com/about-aws/whats-new/2026/04/amazon-sagemaker-hyperpod-automatic-slurm-topology/';

/* Prices and capacity */
const SM_PRICE =
  'https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonSageMaker/20261029165009/us-east-1/index.csv';
const EC2_PRICE = 'https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/20261029175634/us-east-1/index.csv';
const SM_PRICING_PAGE = 'https://aws.amazon.com/sagemaker/ai/pricing/';
const EC2_CB = 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html';

const EFA_TOPOLOGY_LINK = <Link href="../efa/">EFA dive, section 7: The EC2 Instance Topology API</Link>;

/* ------------------------------------------------------------------------ */
/* Numbers: one 32-instance p5.48xlarge fleet for a 30-day month,           */
/* priced by Calculator A's cost panel so this page and section 22 agree    */
/* ------------------------------------------------------------------------ */

const NVA = 'US East (N. Virginia)';
const P5: InstanceId = 'p5.48xlarge';
const FLEET = 32;
const MONTH_HOURS = 30 * 24;
const GPUS_PER_P5 = INSTANCES[P5].acceleratorsPerInstance.value;

function fleetMonth(size?: PcsControllerSize): CostResult {
  return priceRun({
    acceleratorHours: FLEET * GPUS_PER_P5 * MONTH_HOURS,
    accelerators: FLEET * GPUS_PER_P5,
    instance: P5,
    pcsControllerSize: size,
  });
}

function pathLine(run: CostResult, path: PricePath) {
  const line = run.lines.find((l) => l.path === path && l.region === NVA);
  if (!line) throw new RangeError(`SlurmFamily: no us-east-1 ${path} line for ${P5}`);
  return line;
}

function pcsFee(run: CostResult): number {
  const fee = run.fees.find((f) => f.fee === 'pcs');
  if (!fee) throw new RangeError(`SlurmFamily: no PCS fee for ${FLEET} x ${P5}`);
  return fee.usd;
}

const RUN_SMALL = fleetMonth('small');
const RUN_MEDIUM = fleetMonth('medium');
const EC2_LINE = pathLine(RUN_SMALL, 'ec2OnDemand');
const HP_LINE = pathLine(RUN_SMALL, 'hyperpod');
const EC2_RATE = EC2_LINE.usdPerUnitHour;
const HP_RATE = HP_LINE.usdPerUnitHour;
const EC2_MONTH = EC2_LINE.usd;
const HP_PREMIUM_MONTH = HP_LINE.usd - EC2_LINE.usd;
const PCS_SMALL_MONTH = pcsFee(RUN_SMALL);
const PCS_MEDIUM_MONTH = pcsFee(RUN_MEDIUM);
const PCS_SMALL_RATE = PCS_FEES.controllerUsdPerHour.small.value;
const PCS_MEDIUM_RATE = PCS_FEES.controllerUsdPerHour.medium.value;
const PCS_NODE_RATE = PCS_FEES.advancedNodeUsdPerInstanceHour.value;
const PCS_SMALL_MAX = PCS_FEES.maxInstances.small.value;
const PCS_MEDIUM_MAX = PCS_FEES.maxInstances.medium.value;
const PCS_LARGE_MAX = PCS_FEES.maxInstances.large.value;

const usd = (v: number) => `$${Math.round(v).toLocaleString('en-US')}`;
const share = (v: number) => `${((100 * v) / EC2_MONTH).toFixed(1)}%`;

/* ------------------------------------------------------------------------ */
/* Diagram 1: four layers under the same batch script, by owner             */
/* ------------------------------------------------------------------------ */

type Owner = 'aws' | 'you';

const OWNER_STYLE: Record<Owner, { fill: string; stroke: string; word: string }> = {
  aws: { fill: '#d6e9fb', stroke: '#0972d3', word: 'AWS' },
  you: { fill: '#fbf3d5', stroke: '#8b6c00', word: 'Yours' },
};

const INK = '#16191f';
const MUTED = '#414d5c';
const FONT = 'sans-serif';

interface LayerCell {
  owner: Owner;
  /** Two lines of at most 32 characters each. */
  lines: [string, string];
}

interface SlurmPath {
  name: string;
  sub: string;
  cells: [LayerCell, LayerCell, LayerCell, LayerCell];
}

const LAYERS: { name: string; sub: string; short: string }[] = [
  { name: 'Controller', sub: 'slurmctld', short: 'Controller' },
  { name: 'Node image', sub: 'what the nodes boot', short: 'Node image' },
  { name: 'Health checks', sub: 'finding a bad GPU', short: 'Health' },
  { name: 'Job restart', sub: 'after a node fails', short: 'Restart' },
];

const REQUEUE: LayerCell = { owner: 'you', lines: ['--requeue reruns the batch', 'script; it loads the checkpoint'] };

const SLURM_PATHS: SlurmPath[] = [
  {
    name: 'Your own Slurm on EC2',
    sub: 'by hand or with ParallelCluster',
    cells: [
      { owner: 'you', lines: ['slurmctld on an instance', 'you run and patch'] },
      { owner: 'you', lines: ['your AMI, often built', 'from a DLAMI'] },
      { owner: 'you', lines: ['HealthCheckProgram, prolog', 'and burn-in jobs you write'] },
      REQUEUE,
    ],
  },
  {
    name: 'AWS PCS',
    sub: 'a managed controller',
    cells: [
      { owner: 'aws', lines: ['runs slurmctld and applies', 'patch versions'] },
      { owner: 'you', lines: ['your AMI with the PCS agent;', 'PCS-ready DLAMI for GPU'] },
      { owner: 'you', lines: ['the same Slurm settings, set', 'as PCS custom settings'] },
      REQUEUE,
    ],
  },
  {
    name: 'HyperPod Slurm',
    sub: 'SageMaker HyperPod',
    cells: [
      { owner: 'aws', lines: ['slurmctld on controller nodes', 'HyperPod builds, with backups'] },
      { owner: 'aws', lines: ['HyperPod DLAMI or a custom AMI', 'on its base, plus your scripts'] },
      { owner: 'aws', lines: ['agent on every node; deep', 'checks before nodes join (GPU)'] },
      { owner: 'aws', lines: ['srun --auto-resume=1 reruns', 'the step on healthy nodes'] },
    ],
  },
];

const LAYERS_TITLE =
  'Four layers under the same Slurm batch script on three AWS paths. On your own Slurm on EC2 all four are yours: ' +
  'the slurmctld controller, the node image, the GPU health checks and the job restart through --requeue. On AWS PCS, ' +
  'AWS runs the controller and applies patch versions, and the node image, health checks and restart stay yours. On ' +
  'SageMaker HyperPod with Slurm, AWS runs all four: controller nodes it builds, its HyperPod DLAMI or a custom AMI on ' +
  'its base, a health agent with GPU deep health checks, and srun --auto-resume=1.';

function Legend({ x, y }: { x: number; y: number }) {
  return (
    <g>
      {(['aws', 'you'] as Owner[]).map((o, i) => (
        <g key={o}>
          <rect
            x={x + i * 190}
            y={y}
            width={16}
            height={12}
            rx={2}
            fill={OWNER_STYLE[o].fill}
            stroke={OWNER_STYLE[o].stroke}
            strokeWidth={1.2}
          />
          <text x={x + i * 190 + 22} y={y + 10} fontFamily={FONT} fontSize={11} fill={MUTED}>
            {o === 'aws' ? 'AWS runs or ships it' : 'Your team builds or runs it'}
          </text>
        </g>
      ))}
    </g>
  );
}

function SlurmLayersDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const narrow = useNarrow(ref, 720);

  if (narrow) {
    const W = 400;
    const labelW = 92;
    const cellX = 12 + labelW;
    const cellW = W - cellX - 12;
    const rowH = 48;
    const rowGap = 6;
    const headH = 28;
    const blockGap = 16;
    const blockH = headH + LAYERS.length * (rowH + rowGap);
    const top = 12;
    const legendY = top + SLURM_PATHS.length * (blockH + blockGap);
    const H = legendY + 46;
    return (
      <div ref={ref}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-labelledby="slurm-layers-title"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        >
          <title id="slurm-layers-title">{LAYERS_TITLE}</title>
          <rect x={0} y={0} width={W} height={H} rx={8} fill="#ffffff" />
          {SLURM_PATHS.map((p, pi) => {
            const y0 = top + pi * (blockH + blockGap);
            return (
              <g key={p.name}>
                <text x={12} y={y0 + 17} fontFamily={FONT} fontSize={14} fontWeight={600} fill={INK}>
                  {p.name}
                </text>
                {p.cells.map((c, li) => {
                  const y = y0 + headH + li * (rowH + rowGap);
                  const s = OWNER_STYLE[c.owner];
                  return (
                    <g key={LAYERS[li].name}>
                      <text x={12} y={y + rowH / 2 + 4} fontFamily={FONT} fontSize={12} fontWeight={600} fill={MUTED}>
                        {LAYERS[li].short}
                      </text>
                      <rect x={cellX} y={y} width={cellW} height={rowH} rx={4} fill={s.fill} stroke={s.stroke} strokeWidth={1.2} />
                      <text x={cellX + 8} y={y + 19} fontFamily={FONT} fontSize={12} fill={INK}>
                        <tspan fontWeight={600}>{s.word}: </tspan>
                        {c.lines[0]}
                      </text>
                      <text x={cellX + 8} y={y + 37} fontFamily={FONT} fontSize={12} fill={INK}>
                        {c.lines[1]}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}
          <rect x={12} y={legendY} width={16} height={12} rx={2} fill={OWNER_STYLE.aws.fill} stroke={OWNER_STYLE.aws.stroke} strokeWidth={1.2} />
          <text x={34} y={legendY + 10} fontFamily={FONT} fontSize={12} fill={MUTED}>
            AWS runs or ships it
          </text>
          <rect x={12} y={legendY + 22} width={16} height={12} rx={2} fill={OWNER_STYLE.you.fill} stroke={OWNER_STYLE.you.stroke} strokeWidth={1.2} />
          <text x={34} y={legendY + 32} fontFamily={FONT} fontSize={12} fill={MUTED}>
            Your team builds or runs it
          </text>
        </svg>
      </div>
    );
  }

  const W = 900;
  const labelX = 16;
  const colX0 = 182;
  const colW = 226;
  const colGap = 12;
  const headTop = 14;
  const rowTop = 74;
  const rowH = 70;
  const rowGap = 10;
  const legendY = rowTop + LAYERS.length * (rowH + rowGap) + 8;
  const H = legendY + 28;
  const colX = (i: number) => colX0 + i * (colW + colGap);

  return (
    <div ref={ref}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-labelledby="slurm-layers-title"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        <title id="slurm-layers-title">{LAYERS_TITLE}</title>
        <rect x={0} y={0} width={W} height={H} rx={8} fill="#ffffff" />

        {SLURM_PATHS.map((p, i) => (
          <g key={p.name}>
            <text x={colX(i) + colW / 2} y={headTop + 20} fontFamily={FONT} fontSize={13} fontWeight={600} fill={INK} textAnchor="middle">
              {p.name}
            </text>
            <text x={colX(i) + colW / 2} y={headTop + 37} fontFamily={FONT} fontSize={11} fill={MUTED} textAnchor="middle">
              {p.sub}
            </text>
          </g>
        ))}

        {LAYERS.map((layer, li) => {
          const y = rowTop + li * (rowH + rowGap);
          return (
            <g key={layer.name}>
              <text x={labelX} y={y + 30} fontFamily={FONT} fontSize={13} fontWeight={600} fill={INK}>
                {layer.name}
              </text>
              <text x={labelX} y={y + 47} fontFamily={FONT} fontSize={11} fill={MUTED}>
                {layer.sub}
              </text>
              {SLURM_PATHS.map((p, pi) => {
                const c = p.cells[li];
                const s = OWNER_STYLE[c.owner];
                const x = colX(pi);
                return (
                  <g key={p.name}>
                    <rect x={x} y={y} width={colW} height={rowH} rx={4} fill={s.fill} stroke={s.stroke} strokeWidth={1.2} />
                    <text x={x + 10} y={y + 20} fontFamily={FONT} fontSize={12} fontWeight={600} fill={INK}>
                      {s.word}
                    </text>
                    <text x={x + 10} y={y + 38} fontFamily={FONT} fontSize={11} fill={INK}>
                      {c.lines[0]}
                    </text>
                    <text x={x + 10} y={y + 54} fontFamily={FONT} fontSize={11} fill={INK}>
                      {c.lines[1]}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}

        <Legend x={colX0} y={legendY} />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Diagram 2: what an auto-resumed job waits for, with and without a spare  */
/* ------------------------------------------------------------------------ */

const RESUME_TITLE =
  'What an auto-resumed job waits for on HyperPod Slurm with on-start deep health checks turned on. With no spare ' +
  'node, the fault drains the node and ends the step, a replacement launches, the replacement must pass deep health ' +
  'checks whose DCGM level 4 diagnostics typically take about 45 to 90 minutes, and only then does the job resume ' +
  'from its checkpoint. With one spare worker in the cluster, the job resumes on the spare as soon as the step has ' +
  'ended, while the replacement is screened in the background and joins as the new spare.';

interface FlowBox {
  lines: string[];
  w: number;
  tone: 'step' | 'wait' | 'done' | 'side';
}

const TONE: Record<FlowBox['tone'], { fill: string; stroke: string; dash?: string }> = {
  step: { fill: '#f2f8fd', stroke: '#0972d3' },
  wait: { fill: '#fdf3ec', stroke: '#ec7211' },
  done: { fill: '#ecf7ec', stroke: '#037f0c' },
  side: { fill: '#f4f4f4', stroke: '#879596', dash: '4 3' },
};

function ResumeWaitDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const narrow = useNarrow(ref, 720);

  const box = (x: number, y: number, w: number, h: number, b: FlowBox, size: number) => {
    const t = TONE[b.tone];
    const lineGap = size + 4;
    const firstY = y + h / 2 - ((b.lines.length - 1) * lineGap) / 2 + 4;
    return (
      <g key={`${x}-${y}`}>
        <rect x={x} y={y} width={w} height={h} rx={4} fill={t.fill} stroke={t.stroke} strokeWidth={1.4} strokeDasharray={t.dash} />
        {b.lines.map((line, i) => (
          <text
            key={line}
            x={x + w / 2}
            y={firstY + i * lineGap}
            fontFamily={FONT}
            fontSize={size}
            fontWeight={i === 0 ? 600 : 400}
            fill={INK}
            textAnchor="middle"
          >
            {line}
          </text>
        ))}
      </g>
    );
  };

  const arrow = (x1: number, y1: number, x2: number, y2: number) => (
    <line
      key={`a-${x1}-${y1}-${x2}-${y2}`}
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="#5f6b7a"
      strokeWidth={1.5}
      markerEnd="url(#slurm-resume-ah)"
    />
  );

  const defs = (
    <defs>
      <marker id="slurm-resume-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
        <path d="M0,0 L10,5 L0,10 z" fill="#5f6b7a" />
      </marker>
    </defs>
  );

  const fault: FlowBox = { lines: ['GPU fault found', 'node drained,', 'step exits'], w: 150, tone: 'step' };
  const launch: FlowBox = { lines: ['Replacement', 'launches'], w: 120, tone: 'step' };
  const checks: FlowBox = { lines: ['Deep health checks', 'DCGM level 4 typically', 'about 45 to 90 minutes'], w: 210, tone: 'wait' };
  const resumed: FlowBox = { lines: ['Job resumes', 'from its checkpoint'], w: 150, tone: 'done' };
  const resumedSpare: FlowBox = { lines: ['Job resumes on the spare', 'from its checkpoint'], w: 210, tone: 'done' };
  const side: FlowBox = {
    lines: ['Replacement launches and is screened', 'in the background; it joins as the new spare'],
    w: 320,
    tone: 'side',
  };

  if (narrow) {
    const W = 400;
    const colW = 178;
    const xA = 14;
    const xB = W - 14 - colW;
    const top = 50;
    const hSmall = 58;
    const hBig = 72;
    const gap = 24;
    const yA = [top, top + hSmall + gap, top + 2 * (hSmall + gap), top + 2 * (hSmall + gap) + hBig + gap];
    const H = yA[3] + hSmall + 16;
    const n = (b: FlowBox, lines: string[]): FlowBox => ({ ...b, lines });
    return (
      <div ref={ref}>
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="slurm-resume-title" style={{ width: '100%', height: 'auto', display: 'block' }}>
          <title id="slurm-resume-title">{RESUME_TITLE}</title>
          {defs}
          <rect x={0} y={0} width={W} height={H} rx={8} fill="#ffffff" />
          <text x={xA + colW / 2} y={22} fontFamily={FONT} fontSize={14} fontWeight={600} fill={INK} textAnchor="middle">
            No spare node
          </text>
          <text x={xA + colW / 2} y={38} fontFamily={FONT} fontSize={12} fill={MUTED} textAnchor="middle">
            nodes = the job&apos;s count
          </text>
          <text x={xB + colW / 2} y={22} fontFamily={FONT} fontSize={14} fontWeight={600} fill={INK} textAnchor="middle">
            One spare worker
          </text>
          <text x={xB + colW / 2} y={38} fontFamily={FONT} fontSize={12} fill={MUTED} textAnchor="middle">
            nodes = the job&apos;s count + 1
          </text>
          {box(xA, yA[0], colW, hSmall, fault, 12)}
          {arrow(xA + colW / 2, yA[0] + hSmall, xA + colW / 2, yA[1] - 2)}
          {box(xA, yA[1], colW, hSmall, launch, 12)}
          {arrow(xA + colW / 2, yA[1] + hSmall, xA + colW / 2, yA[2] - 2)}
          {box(xA, yA[2], colW, hBig, n(checks, ['Deep health checks', 'DCGM level 4 typically', 'about 45 to 90 min']), 12)}
          {arrow(xA + colW / 2, yA[2] + hBig, xA + colW / 2, yA[3] - 2)}
          {box(xA, yA[3], colW, hSmall, resumed, 12)}

          {box(xB, yA[0], colW, hSmall, fault, 12)}
          {arrow(xB + colW / 2, yA[0] + hSmall, xB + colW / 2, yA[1] - 2)}
          {box(xB, yA[1], colW, hSmall, n(resumedSpare, ['Job resumes', 'on the spare']), 12)}
          {box(xB, yA[2], colW, hBig, n(side, ['Replacement is', 'screened meanwhile,', 'joins as the spare']), 12)}
        </svg>
      </div>
    );
  }

  const W = 900;
  const labelX = 16;
  const x0 = 186;
  const gap = 22;
  const hBox = 62;
  const yA = 56;
  const yB = 150;
  const ySide = 228;
  const H = ySide + 52 + 14;
  const xs = [x0, x0 + fault.w + gap, x0 + fault.w + gap + launch.w + gap];
  xs.push(xs[2] + checks.w + gap);
  const xSpare = x0 + fault.w + gap;

  return (
    <div ref={ref}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="slurm-resume-title" style={{ width: '100%', height: 'auto', display: 'block' }}>
        <title id="slurm-resume-title">{RESUME_TITLE}</title>
        {defs}
        <rect x={0} y={0} width={W} height={H} rx={8} fill="#ffffff" />
        <text x={labelX} y={26} fontFamily={FONT} fontSize={13} fontWeight={600} fill={INK}>
          HyperPod Slurm, on-start deep health checks on, a job step run with --auto-resume=1
        </text>

        <text x={labelX} y={yA + 28} fontFamily={FONT} fontSize={13} fontWeight={600} fill={INK}>
          No spare node
        </text>
        <text x={labelX} y={yA + 45} fontFamily={FONT} fontSize={11} fill={MUTED}>
          nodes = the job&apos;s count
        </text>
        {box(xs[0], yA, fault.w, hBox, fault, 11)}
        {arrow(xs[0] + fault.w, yA + hBox / 2, xs[1] - 2, yA + hBox / 2)}
        {box(xs[1], yA, launch.w, hBox, launch, 11)}
        {arrow(xs[1] + launch.w, yA + hBox / 2, xs[2] - 2, yA + hBox / 2)}
        {box(xs[2], yA, checks.w, hBox, checks, 11)}
        {arrow(xs[2] + checks.w, yA + hBox / 2, xs[3] - 2, yA + hBox / 2)}
        {box(xs[3], yA, resumed.w, hBox, resumed, 11)}

        <text x={labelX} y={yB + 28} fontFamily={FONT} fontSize={13} fontWeight={600} fill={INK}>
          One spare worker
        </text>
        <text x={labelX} y={yB + 45} fontFamily={FONT} fontSize={11} fill={MUTED}>
          nodes = the job&apos;s count + 1
        </text>
        {box(xs[0], yB, fault.w, hBox, fault, 11)}
        {arrow(xs[0] + fault.w, yB + hBox / 2, xSpare - 2, yB + hBox / 2)}
        {box(xSpare, yB, resumedSpare.w, hBox, resumedSpare, 11)}
        <path
          d={`M ${xs[0] + fault.w / 2} ${yB + hBox} V ${ySide + 26} H ${xSpare - 2}`}
          fill="none"
          stroke="#879596"
          strokeWidth={1.5}
          strokeDasharray="4 3"
          markerEnd="url(#slurm-resume-ah)"
        />
        {box(xSpare, ySide, side.w, 52, side, 11)}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Fee table                                                                */
/* ------------------------------------------------------------------------ */

const cell: CSSProperties = {
  padding: '6px 8px',
  borderBottom: '1px solid #e9ebed',
  textAlign: 'left',
  verticalAlign: 'top',
};
const numCell: CSSProperties = { ...cell, textAlign: 'right' };
const headCell: CSSProperties = { ...cell, fontWeight: 700, borderBottom: '2px solid #d1d5db' };

function FeeTable() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={headCell}>Path</th>
            <th style={{ ...headCell, textAlign: 'right' }}>Beyond EC2, 30 days</th>
            <th style={{ ...headCell, textAlign: 'right' }}>Share of the EC2 bill</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={cell}>Your own Slurm (ParallelCluster)</td>
            <td style={numCell}>$0 plus the controller instance</td>
            <td style={numCell}>controller only</td>
          </tr>
          <tr>
            <td style={cell}>AWS PCS, Small controller (up to {PCS_SMALL_MAX} instances)</td>
            <td style={numCell}>{usd(PCS_SMALL_MONTH)}</td>
            <td style={numCell}>{share(PCS_SMALL_MONTH)}</td>
          </tr>
          <tr>
            <td style={cell}>AWS PCS, Medium controller (up to {PCS_MEDIUM_MAX})</td>
            <td style={numCell}>{usd(PCS_MEDIUM_MONTH)}</td>
            <td style={numCell}>{share(PCS_MEDIUM_MONTH)}</td>
          </tr>
          <tr>
            <td style={cell}>HyperPod Slurm (inside the ml.* rate)</td>
            <td style={numCell}>{usd(HP_PREMIUM_MONTH)}</td>
            <td style={numCell}>{share(HP_PREMIUM_MONTH)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

const PRE: CSSProperties = { margin: 0, whiteSpace: 'pre', overflowX: 'auto' };

export function SlurmFamily() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Pick the Slurm path by who runs the controller and who checks the GPUs, then write one batch script that runs on all three and resumes without waiting 45 to 90 minutes for a replacement node's GPU diagnostics (AWS and Slurm 26.05 documentation and AWS's awsome-distributed-ai samples at a pinned commit, read 2026-10-31)"
          >
            24. The Slurm Family
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Slurm is the batch scheduler most large training teams already know. A controller daemon, slurmctld, holds
            the queue and allocates nodes{' '}
            <Cite tier={1} href={HP_MULTIHEAD}>
              SageMaker Developer Guide, HyperPod multi-head node support
            </Cite>
            , and a daemon on every node, slurmd, registers that node with the controller{' '}
            <Cite tier={1} href={SLURM_CONF}>
              Slurm 26.05 slurm.conf documentation
            </Cite>
            . A training job is a batch script: it asks for a node count, which Slurm treats as both the minimum and the
            maximum, may wait in the queue until all of those nodes are free{' '}
            <Cite tier={1} href={SLURM_SBATCH}>
              Slurm 26.05 sbatch documentation
            </Cite>
            , and then runs an <code>srun</code> step that starts a launcher such as torchrun on each node.
          </Box>
          <Box variant="p">
            AWS offers Slurm three ways: your own Slurm on EC2 (Amazon Elastic Compute Cloud), by hand or deployed with
            AWS ParallelCluster; PCS (AWS Parallel Computing Service), where AWS runs the controller; and SageMaker
            HyperPod with Slurm, where AWS builds the whole cluster and checks its nodes. The challenge is to pick the one
            whose split of work matches what your team wants to own, and then to build what that path leaves to you.
            Section 20, Who Owns What on AWS, holds the ownership grid for all seven AWS paths; this section takes its
            three Slurm columns down to the commands and settings a training job meets on each.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Write the batch script once, then see which of the four layers under it AWS runs on each path"
          >
            One batch script, four layers that change hands
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The batch script travels between the three paths. AWS&apos;s own sample for Llama 3.1 70B with FSDP (Fully
            Sharded Data Parallel) asks for four whole nodes and starts torchrun on each with eight processes and a c10d
            rendezvous{' '}
            <Cite tier={1} href={AWSOME_70B('L6-L73')} kind="code">
              awsome-distributed-ai llama3_1_70b-training.sbatch L6-L73
            </Cite>
            . It is written once for every Slurm cluster: it adds HyperPod&apos;s auto-resume flag only when the node has a{' '}
            <code>/opt/sagemaker_cluster</code> directory, which the script takes as the sign of a HyperPod cluster{' '}
            <Cite tier={1} href={AWSOME_70B('L104-L109')} kind="code">
              awsome-distributed-ai llama3_1_70b-training.sbatch L104-L109
            </Cite>
            .
          </Box>
          <pre style={PRE}>
            <code>{`#SBATCH --nodes=4
#SBATCH --exclusive
...
declare -a TORCHRUN_ARGS=(
  --nproc_per_node=$GPUS_PER_NODE
  --nnodes=$SLURM_JOB_NUM_NODES
  --rdzv_id=$SLURM_JOB_ID
  --rdzv_backend=c10d
  --rdzv_endpoint=$(hostname)
)
...
AUTO_RESUME=""
if [ -d "/opt/sagemaker_cluster" ]
then
  AUTO_RESUME="--auto-resume=1"
fi
srun \${AUTO_RESUME} -l ... \\
  \${TORCHRUN} "\${TORCHRUN_ARGS[@]}" \\
  $TRAIN_SCRIPT ...`}</code>
          </pre>
          <Box variant="small" color="text-body-secondary">
            Abridged from lines 6 to 10, 67 to 73 and 104 to 109 of the sample: comments, the echo line and the
            container and training arguments removed, and lines rewrapped to fit a phone.
          </Box>
          <Box variant="p">
            What changes from path to path is everything under the script: who runs the controller, who builds the AMI
            (Amazon Machine Image) the nodes boot, often from a DLAMI (Deep Learning AMI), who finds a bad GPU, and who
            restarts the job when a node fails. The colours match section
            20&apos;s grid.
          </Box>
          <SlurmLayersDiagram />
          <Box variant="small" color="text-body-secondary">
            Schematic, one row per layer, each cell traced in the blocks below. Section 20 holds the other rows for the
            same three paths: node replacement, capacity, fabric, Trainium, cost and status.
          </Box>
          <ExpandableSection headerText="Before you run the sample: its checkpoint interval">
            <Box variant="p">
              The sample checkpoints every 1,000 steps and stops after 30, and it resumes from the same directory it
              writes to{' '}
              <Cite tier={1} href={AWSOME_70B('L91-L97')} kind="code">
                llama3_1_70b-training.sbatch L91-L97
              </Cite>
              . Every restart on every path starts from the last checkpoint the job wrote, so set the interval from
              section 18, Checkpointing, before relying on any of them.
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Keep a cluster you already run, knowing that every health check and every requeue is a script your team writes"
          >
            Your own Slurm on EC2: every layer is yours
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Running Slurm yourself means operating slurmctld, writing all of <code>slurm.conf</code>, and building the
            node image, usually from a DLAMI, an AMI that already carries the NVIDIA driver and the EFA (Elastic Fabric
            Adapter) installer{' '}
            <Cite tier={1} href={DLAMI_BASE} accessed={R1}>
              DLAMI Developer Guide, Base GPU AMI release 20261027
            </Cite>
            . AWS ParallelCluster deploys such a cluster and charges nothing itself; you pay for the controller instance
            and everything else it creates{' '}
            <Cite tier={1} href={PC_WHATIS}>
              AWS ParallelCluster User Guide
            </Cite>
            . It is still maintained, at v3.16.2{' '}
            <Cite tier={1} href={PC_TAG} kind="code">
              aws-parallelcluster at v3.16.2
            </Cite>{' '}
            with the 3.16 line supported to 2028-02-20{' '}
            <Cite tier={1} href={PC_SUPPORT} accessed={R1}>
              AWS ParallelCluster support policy
            </Cite>
            , and every page of its user guide opens with a banner recommending AWS PCS for HPC (high-performance
            computing) and AI workloads{' '}
            <Cite tier={1} href={PC_WHATIS}>
              AWS ParallelCluster User Guide
            </Cite>
            .
          </Box>
          <Box variant="p">
            GPU health checking on this path is Slurm&apos;s own mechanism. <code>HealthCheckProgram</code> names a script
            that runs as root on every responding node at the interval <code>HealthCheckInterval</code> sets; the default
            interval of zero turns it off, the script must exist on every compute node, and it changes nothing unless it
            acts itself, for example by draining the node with <code>scontrol</code>. It is killed after{' '}
            <code>HealthCheckTimeout</code>, 60 seconds by default{' '}
            <Cite tier={1} href={SLURM_CONF}>
              Slurm 26.05 slurm.conf, HealthCheckProgram
            </Cite>
            . So the periodic check holds quick tests, such as <code>nvidia-smi</code> and the GPU count, and an hour of
            GPU diagnostics runs as a job of its own on a node held out of service, our reading.
          </Box>
          <Box variant="p">
            AWS&apos;s samples repository ships both kinds as a GPU health-check suite for self-managed Slurm and EKS
            (Amazon Elastic Kubernetes Service) clusters: lightweight checks meant for a prolog, an epilog or a periodic
            sweep, and intensive ones for a node under suspicion{' '}
            <Cite tier={1} href={AWSOME_HC_README}>
              awsome-distributed-ai gpu-cluster-healthcheck README
            </Cite>
            , including DCGM (NVIDIA Data Center GPU Manager) diagnostics at level 4, a multi-node NCCL (NVIDIA Collective
            Communications Library) all-reduce and EFA loopback tests, with a Slurm prolog and sbatch wrappers{' '}
            <Cite tier={1} href={AWSOME_HC_TREE} kind="code">
              gpu-cluster-healthcheck tree
            </Cite>
            . Replacing the failed instance is yours too: nothing on this path does it for you, our reading.
          </Box>
          <Box variant="p">
            Restart is <code>--requeue</code>: Slurm can requeue the batch job after a node failure and starts its batch
            script again from the beginning under the same job ID, and the cluster-wide <code>JobRequeue</code> setting
            gives the default{' '}
            <Cite tier={1} href={SLURM_SBATCH}>
              Slurm 26.05 sbatch, --requeue
            </Cite>
            . The script&apos;s first act is therefore loading the latest checkpoint; section 19, Resuming Correctly,
            covers what that load must restore. Topology-aware placement of ranks onto EC2&apos;s network is the{' '}
            {EFA_TOPOLOGY_LINK}.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Hand AWS the controller and keep your images, then add the GPU checks and requeue PCS leaves to you through the Slurm settings it allows"
          >
            AWS PCS: a managed controller over your own nodes
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            PCS runs slurmctld for you and updates it with Slurm patch versions{' '}
            <Cite tier={1} href={PCS_VERSIONS}>
              AWS PCS User Guide, Slurm versions
            </Cite>
            . The nodes boot an AMI you bring, which must carry the PCS agent, installed with AWS&apos;s installer, and a
            compatible Slurm, for which AWS recommends its installer too{' '}
            <Cite tier={1} href={PCS_CUSTOM_AMI} accessed={R1}>
              AWS PCS User Guide, custom AMIs
            </Cite>
            . For GPU nodes AWS publishes a PCS-ready DLAMI on Ubuntu 24.04 with the agent and several Slurm versions
            installed, and no machine learning framework such as PyTorch{' '}
            <Cite tier={1} href={PCS_DLAMI}>
              AWS PCS User Guide, PCS-ready DLAMI
            </Cite>
            . No PCS AMI carrying the Neuron stack was located on the PCS sample-AMI and PCS-ready DLAMI pages{' '}
            <Cite tier={1} href={PCS_AMI_NOTES}>
              AWS PCS User Guide, AMI release notes
            </Cite>
            , so a Trainium node group runs an AMI you build, our reading; section 27, Trainium: The Neuron Path, covers
            that stack.
          </Box>
          <Box variant="p">
            Two choices are hard to undo. Cluster size is fixed at creation: Small holds up to {PCS_SMALL_MAX} instances,
            Medium {PCS_MEDIUM_MAX.toLocaleString('en-US')} and Large {PCS_LARGE_MAX.toLocaleString('en-US')}, and a
            different size means a new cluster{' '}
            <Cite tier={1} href={PCS_SIZE} accessed={R1}>
              AWS PCS User Guide, cluster size
            </Cite>
            . The Slurm version runs on a clock. By the dates in PCS&apos;s version table, SchedMD ships a Slurm major
            every six months and PCS supports each for about 18 months from SchedMD&apos;s release, 13.5 to 14.7 months
            after it reaches PCS for the three current majors, so a PCS cluster takes a major upgrade about once a year to
            stay supported (our arithmetic from the table). Slurm 25.05 reaches end of
            life on PCS on 2026-11-30; after end of life no new cluster can use a version, and existing clusters can run
            up to 12 more months without guaranteed support{' '}
            <Cite tier={1} href={PCS_VERSIONS}>
              AWS PCS User Guide, Slurm versions
            </Cite>
            .
          </Box>
          <Box variant="p">
            GPU health is yours. The PCS user guide&apos;s table of contents has no entry containing &quot;health&quot;{' '}
            <Cite tier={1} href={PCS_TOC}>
              AWS PCS User Guide, table of contents
            </Cite>
            , but its supported cluster-level Slurm settings include <code>HealthCheckProgram</code>,{' '}
            <code>HealthCheckInterval</code>, <code>HealthCheckNodeState</code>, <code>JobRequeue</code>,{' '}
            <code>Prolog</code> and <code>Epilog</code>{' '}
            <Cite tier={1} href={PCS_SETTINGS}>
              AWS PCS User Guide, custom Slurm settings for clusters
            </Cite>
            . The checks from your own Slurm carry over, with the script baked into your AMI, since it must exist on every
            node. <code>HealthCheckTimeout</code> is absent from that list, so the 60-second default bounds the check on
            PCS, our reading of the two pages.
          </Box>
          <Box variant="p">
            Replacing a node runs through Slurm. PCS supports <code>scontrol reboot</code>, which reboots a node and keeps
            its EC2 instance; a reboot from anywhere else, such as the EC2 console or an automatic reboot after patching,
            makes PCS consider the instance unhealthy and replace it{' '}
            <Cite tier={1} href={PCS_REBOOT}>
              AWS PCS User Guide, Slurm reboot
            </Cite>{' '}
            <Cite tier={1} href={PCS_REPLACED}>
              AWS PCS troubleshooting, instance replaced after reboot
            </Cite>
            , so patches go into a new AMI and an updated node group. A Slurm reboot with <code>nextstate=DOWN</code>{' '}
            marks the node unhealthy and triggers replacement on purpose, and for a node with unstable GPU behaviour the
            guide gives drain and requeue: <code>scontrol reboot ASAP</code> on the node, then{' '}
            <code>scontrol requeue</code> on the affected jobs{' '}
            <Cite tier={1} href={PCS_REBOOT_FAQ}>
              AWS PCS User Guide, Slurm reboot FAQ
            </Cite>
            . Deciding that a GPU is bad is your health check&apos;s job, our reading.
          </Box>
          <Box variant="p">
            Capacity Blocks (accelerators reserved for a fixed date window; section 22, Capacity &amp; Cost) attach
            through a compute node group&apos;s launch template, one block per node group at a time; when the block ends,
            its instances are terminated and queued jobs stay pending until another node group or block is attached{' '}
            <Cite tier={1} href={PCS_CB} accessed={R1}>
              AWS PCS User Guide, Capacity Blocks
            </Cite>
            . PCS has supported P6e-GB200 and P6e-GB300 UltraServers since 2026-06-18, reserved through Capacity Blocks,
            and configures Slurm&apos;s topology plugin for them{' '}
            <Cite tier={2} href={WN_PCS_P6E} accessed={R1}>
              AWS What&apos;s New, PCS supports P6e UltraServers
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Let AWS screen every node and resume the job step, and keep a spare node so a resume does not wait out a replacement's 45 to 90 minutes of GPU diagnostics"
          >
            HyperPod Slurm: AWS checks the nodes and resumes the step
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            HyperPod builds the whole cluster, with controller, login and worker nodes, on its HyperPod DLAMI shaped by
            lifecycle scripts you supply{' '}
            <Cite tier={1} href={HP_SLURM}>
              SageMaker Developer Guide, HyperPod with Slurm
            </Cite>
            , or since 2026-07-13 on a custom AMI built on HyperPod&apos;s base AMI{' '}
            <Cite tier={2} href={WN_HP_CUSTOM_AMI}>
              AWS What&apos;s New, custom AMIs for HyperPod Slurm clusters
            </Cite>
            . One cluster can hold several controller nodes, and a backup takes over if the primary fails{' '}
            <Cite tier={1} href={HP_MULTIHEAD}>
              HyperPod multi-head node support
            </Cite>
            . HyperPod&apos;s agent writes part of <code>slurm.conf</code>: <code>ClusterName</code>,{' '}
            <code>SlurmctldHost</code>, <code>PartitionName</code> and <code>NodeName</code>, plus the{' '}
            <code>TaskPlugin</code> and <code>SchedulerParameters</code> values that node recovery and auto-resume need,
            and AWS strongly recommends leaving them unchanged{' '}
            <Cite tier={1} href={HP_FAQ_SLURM}>
              HyperPod Slurm FAQ
            </Cite>
            .
          </Box>
          <Box variant="p">
            Health checking comes in two tiers. A health-monitoring agent runs on every node with the same checks as on
            HyperPod EKS{' '}
            <Cite tier={1} href={HP_SLURM_HEALTH} accessed={R1}>
              HyperPod Slurm cluster health checks
            </Cite>
            , watching DCGM policy violations, <code>nvidia-smi</code> errors and the GPU count on GPU nodes, and Neuron
            monitor errors and the device count on Trainium{' '}
            <Cite tier={1} href={HP_HMA}>
              SageMaker Developer Guide, HyperPod health monitoring
            </Cite>
            . Deep health checks screen a node before it takes work. InstanceStress runs stress tests, GPU and PCI counts,
            DCGM diagnostics at level 4, typically about 45 to 90 minutes depending on GPU count, and EFA loopback tests
            of about 2 to 5 minutes; InstanceConnectivity runs a multi-node NCCL all-reduce of about 5 to 15 minutes. They
            run on start for an instance group that sets <code>OnStartDeepHealthChecks</code>, or on demand, with nodes
            held in a Slurm maintenance reservation until they pass; a node that fails is replaced and the replacement is
            checked again. Every deep check lists GPU instances only{' '}
            <Cite tier={1} href={HP_SLURM_DEEP}>
              HyperPod Slurm deep health checks
            </Cite>
            ; Trainium deep checks are documented for HyperPod EKS{' '}
            <Cite tier={1} href={HP_EKS_DEEP}>
              HyperPod EKS deep health checks
            </Cite>{' '}
            and not for HyperPod Slurm.
          </Box>
          <Box variant="p">
            Automatic node recovery, the default, reboots or replaces faulty nodes; when the agent finds a hardware fault
            it marks the node to drain and replaces it once the jobs on it exit. Restarting the job is a separate
            switch: a job step launched with <code>srun --auto-resume=1</code> restarts from the last checkpoint once the
            faulty nodes are replaced, nodes are then always replaced rather than rebooted, and jobs without the flag exit
            and wait for someone to resubmit them{' '}
            <Cite tier={1} href={HP_AUTO_RESUME}>
              HyperPod Slurm auto-resume
            </Cite>
            . The batch script AWS documents is three lines:
          </Box>
          <pre style={PRE}>
            <code>{`#!/bin/bash
#SBATCH --nodes 2
#SBATCH --exclusive
srun --auto-resume=1 train_auto_resume.sh`}</code>
          </pre>
          <Box variant="p">
            Four rules come with it{' '}
            <Cite tier={1} href={HP_AUTO_RESUME}>
              HyperPod Slurm auto-resume
            </Cite>
            . Run the job in an exclusive allocation and put every setup step inside the one <code>srun</code>, because
            the flag covers only that job step. Read the node list from <code>scontrol</code> inside the step, because{' '}
            <code>$SLURM_JOB_NODELIST</code> can be stale after a resume. Expect a requeue instead on nodes that declare
            GRES (generic resources, Slurm&apos;s name for devices such as GPUs): the whole job goes back in the queue and
            starts from the beginning. And auto-resume acts when the step exits with a non-zero status, so a hang has to
            become an exit first, our reading; section 30, The Telemetry Stack on AWS, covers the timeouts that do it.
          </Box>
          <Box variant="p">
            One documented condition is unsettled. The HyperPod Slurm overview says you can resume &quot;from the last
            checkpoint you saved, after faulty nodes are replaced with healthy ones in clusters with more than 16
            nodes&quot;{' '}
            <Cite tier={1} href={HP_SLURM}>
              SageMaker Developer Guide, HyperPod with Slurm
            </Cite>
            ; the auto-resume page says auto-resume &quot;starts the node replacement workflow and restarts the job after
            the faulty nodes are replaced&quot;{' '}
            <Cite tier={1} href={HP_AUTO_RESUME}>
              HyperPod Slurm auto-resume
            </Cite>
            , and neither it nor the Slurm FAQ states a node count{' '}
            <Cite tier={1} href={HP_FAQ_SLURM}>
              HyperPod Slurm FAQ
            </Cite>
            . On a cluster of 16 nodes or fewer, test a resume before relying on it.
          </Box>
          <Box variant="p">
            The two features meet at the replacement node. With deep health checks on, a replacement must pass them
            before it joins, but the resumed job does not wait for it: it can be scheduled on any other available node,
            and it waits only when none is free{' '}
            <Cite tier={1} href={HP_SLURM_DEEP}>
              HyperPod Slurm deep health checks
            </Cite>
            . A cluster with exactly the job&apos;s node count therefore holds every resume for the replacement&apos;s
            checks, at least the 45 to 90 minutes its DCGM diagnostics typically take, and one spare worker lets the job
            resume at once while the replacement is screened, our reading of that page.
          </Box>
          <ResumeWaitDiagram />
          <Box variant="small" color="text-body-secondary">
            Schematic, not to scale. The 45 to 90 minutes is AWS&apos;s typical duration for DCGM level 4 diagnostics,
            depending on GPU count; the replacement&apos;s launch time is not documented in the pages read. What the
            resumed script must restore, from the checkpoint to the data position, is section 19, Resuming Correctly.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Budget what each path charges beyond the GPU instances: about 1% of the EC2 bill for PCS, 20% for HyperPod, and only the controller instance for your own Slurm"
          >
            What each path charges beyond the instances
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The reference fleet is {FLEET} p5.48xlarge for a 30-day month in us-east-1, whose EC2 On-Demand bill is{' '}
            {usd(EC2_MONTH)} at ${EC2_RATE} per instance-hour{' '}
            <Cite tier={1} href={EC2_PRICE}>
              EC2 Price List, us-east-1, version 20261029175634
            </Cite>
            . PCS adds ${PCS_SMALL_RATE} per hour for a Small controller (${PCS_MEDIUM_RATE} for Medium) plus{' '}
            {`$${PCS_NODE_RATE}`} per P or Trn instance-hour{' '}
            <Cite tier={1} href={PCS_PRICE}>
              AWS PCS Price List, us-east-1, version 20261027150327
            </Cite>
            , the advanced node-management tier for those families{' '}
            <Cite tier={1} href={PCS_PRICING} accessed={R1}>
              AWS PCS pricing
            </Cite>
            . HyperPod has no separate fee: its premium sits in the cluster rate, ${HP_RATE} per ml.p5.48xlarge-hour{' '}
            <Cite tier={1} href={SM_PRICE}>
              SageMaker Price List, us-east-1, version 20261029165009
            </Cite>
            , which is billed for every hour the cluster is provisioned, busy or idle, our reading of the pricing example
            that bills a one-month cluster for all 720 hours{' '}
            <Cite tier={1} href={SM_PRICING_PAGE}>
              SageMaker AI pricing, pricing example 16
            </Cite>
            .
          </Box>
          <FeeTable />
          <Box variant="small" color="text-body-secondary">
            Our arithmetic, computed by section 22&apos;s cost panel (Calculator A), prices dated 2026-10-30:{' '}
            <code>
              PCS = {PCS_SMALL_RATE} x {MONTH_HOURS} + {PCS_NODE_RATE} x {FLEET} x {MONTH_HOURS}
            </code>
            ;{' '}
            <code>
              HyperPod = ({HP_RATE} - {EC2_RATE}) x {FLEET} x {MONTH_HOURS}
            </code>
            . The table counts the {FLEET} GPU instances only.
          </Box>
          <Box variant="p">
            A Small controller holds exactly this fleet and no more, so a fleet that may grow starts on Medium, a{' '}
            {usd(PCS_MEDIUM_MONTH - PCS_SMALL_MONTH)} difference a month. The larger difference is what each fee buys:
            PCS charges about {share(PCS_SMALL_MONTH)} of the EC2 bill, almost all of it the per-instance node-management
            fee, to run the controller and its node groups, and HyperPod charges{' '}
            {share(HP_PREMIUM_MONTH)} to run the controller, the node checks, the replacement and the resume.
            Section 22 prices the same fleet on Capacity Blocks and training plans.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Leave with the setup list for the Slurm path you pick; choosing between Slurm and Kubernetes is section 28's"
          >
            Pick within the family, then build what it leaves you
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>A cluster you already run: your own Slurm.</strong> Keep ParallelCluster clusters on the 3.16 line,
            supported to 2028-02-20, and start new clusters on PCS or HyperPod Slurm, as the ParallelCluster guide&apos;s
            own banner advises. Every item in the PCS list below except the controller is yours here as well.
          </Box>
          <Box variant="p">
            <strong>AWS runs the controller, you keep the images: PCS.</strong> Size the controller for the largest fleet
            you expect, budget ${PCS_NODE_RATE} per P or Trn instance-hour plus the controller, and plan a Slurm major
            upgrade about once a year, starting before 25.05 leaves support on 2026-11-30. Bake a{' '}
            <code>HealthCheckProgram</code> and a burn-in job into your AMI, the awsome-distributed-ai suite being a
            starting point; set <code>JobRequeue</code> or <code>--requeue</code>; reboot and replace nodes through{' '}
            <code>scontrol reboot</code>; and save before a Capacity Block&apos;s edge. EC2 starts terminating its
            instances at 11:00 UTC (Coordinated Universal Time) on its final day, 30 minutes before it ends, and a
            P6e-GB200 UltraServer block&apos;s instances must be terminated at least 60 minutes before its end{' '}
            <Cite tier={1} href={EC2_CB}>
              EC2 User Guide, Capacity Blocks
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>AWS owns node health and the resume: HyperPod Slurm.</strong> Set{' '}
            <code>OnStartDeepHealthChecks</code> to InstanceStress and InstanceConnectivity on the worker groups, launch
            every training step with <code>srun --auto-resume=1</code> inside one exclusive allocation, read the node list
            from <code>scontrol</code>, and keep one spare worker so a resume skips the replacement&apos;s 45 to 90 minutes
            of GPU diagnostics. On a training plan, save before its edge, which for a HyperPod cluster comes one hour
            before the plan ends{' '}
            <Cite tier={1} href={SM_PLANS}>
              SageMaker Developer Guide, training plans
            </Cite>
            .
          </Box>
          <ExpandableSection headerText="Dated changes to check against your cluster">
            <SpaceBetween size="xs">
              <Box variant="p">
                PCS: Slurm 25.05 end of life on 2026-11-30{' '}
                <Cite tier={1} href={PCS_VERSIONS}>
                  AWS PCS User Guide, Slurm versions
                </Cite>
                ; P6e-GB200 and P6e-GB300 UltraServer support since 2026-06-18{' '}
                <Cite tier={2} href={WN_PCS_P6E} accessed={R1}>
                  AWS What&apos;s New, PCS supports P6e UltraServers
                </Cite>
                .
              </Box>
              <Box variant="p">
                HyperPod Slurm: health-monitoring agent since 2025-09-11, which an older cluster gets by updating to
                the latest AMI{' '}
                <Cite tier={1} href={HP_AUTO_RESUME}>
                  HyperPod Slurm auto-resume
                </Cite>
                ; custom AMIs since 2026-07-13{' '}
                <Cite tier={2} href={WN_HP_CUSTOM_AMI}>
                  AWS What&apos;s New, custom AMIs for HyperPod Slurm clusters
                </Cite>
                ; automatic Slurm topology management announced 2026-04-23{' '}
                <Cite tier={2} href={WN_HP_TOPOLOGY}>
                  AWS What&apos;s New, HyperPod automatic Slurm topology
                </Cite>
                .
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <Box variant="p">
            On all three, the batch script stays the one AWS&apos;s sample shows, with <code>--auto-resume=1</code> added
            only on HyperPod, and the script loads its latest checkpoint before its first step. Section 28, Choosing Your
            Path, weighs the Slurm family against the Kubernetes family and training jobs; within this family, open the
            health-check settings of the path you picked before the first multi-node run.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
