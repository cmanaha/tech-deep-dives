import { useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';
import { Cite, arxiv, gh, AWSOME_DISTRIBUTED_TRAINING_SHA, NEURON_SDK_SHA } from '../components/Cite';
import { useNarrow } from '../components/useNarrow';
import { DENSE_MODELS, GB, INSTANCES, memoryFigureBytes, shapeOf } from '../lib/presets';
import type { InstanceId, InstancePreset } from '../lib/presets';
import { modelStateBytes } from '../lib/memory';
import { evaluateLayout } from '../lib/parallelism';
import type { Layout, ParallelismInput } from '../lib/parallelism';

/* ------------------------------------------------------------------------ */
/* Sources                                                                  */
/* ------------------------------------------------------------------------ */

/** Date of the register rows cited without re-opening their source. */
const REGISTER_DATE = '2026-10-30';

/** EC2 accelerated computing instance specifications: accelerators, HBM, network, instance store. */
const EC2_AC = 'https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html';
/** EC2 P4 product page: 600 GB/s NVSwitch. */
const P4_PAGE = 'https://aws.amazon.com/ec2/instance-types/p4/';
/** EC2 P5 product page: 900 GB/s NVSwitch. */
const P5_PAGE = 'https://aws.amazon.com/ec2/instance-types/p5/';
/** EC2 P6 product page: NVLink 5, P6e UltraServer shapes, P6e-GB300 relative figures. */
const P6_PAGE = 'https://aws.amazon.com/ec2/instance-types/p6/';
/** EC2 Trn1 product page: NeuronLink up to 768 GB/s. */
const TRN1_PAGE = 'https://aws.amazon.com/ec2/instance-types/trn1/';
/** EC2 Trn2 product page: 96 GB per chip, 1.5 TB per instance, UltraServers available now. */
const TRN2_PAGE = 'https://aws.amazon.com/ec2/instance-types/trn2/';
/** EC2 Trn3 product page: NeuronLink-v4 2 TB/s per chip. */
const TRN3_PAGE = 'https://aws.amazon.com/ec2/instance-types/trn3/';
/** EC2 UltraServers page: Trn2 UltraServer "available in preview". */
const ULTRASERVERS_PAGE = 'https://aws.amazon.com/ec2/ultraservers/';
/** EC2 Capacity Blocks pricing page. */
const CB_PRICING = 'https://aws.amazon.com/ec2/capacityblocks/pricing/';
/** EC2 Capacity Blocks user guide: supported types and Regions, UltraServer table. */
const CB_GUIDE = 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html';
/** What's New, 2 December 2025: P6e-GB300 UltraServers generally available. */
const WN_GB300 =
  'https://aws.amazon.com/about-aws/whats-new/2025/12/amazon-ec2-p6e-gb300-ultraservers-nvidia-gb300-nvl72-generally-available/';
/** What's New, 2 December 2025: Trn3 UltraServers generally available. */
const WN_TRN3 = 'https://aws.amazon.com/about-aws/whats-new/2025/12/amazon-ec2-trn3-ultraservers/';
/** AWS Price List, AmazonEC2 offer 20261029175634, us-east-1. */
const EC2_PRICE_FILE =
  'https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/20261029175634/us-east-1/index.csv';

/** NVIDIA specification pages (vendor specifications; tensor-core figures printed with sparsity). */
const A100_SPEC = 'https://www.nvidia.com/en-us/data-center/a100/';
const H100_SPEC = 'https://www.nvidia.com/en-us/data-center/h100/';
const H200_SPEC = 'https://www.nvidia.com/en-us/data-center/h200/';
const HGX_SPEC = 'https://www.nvidia.com/en-us/data-center/hgx/';
const GB200_SPEC = 'https://www.nvidia.com/en-us/data-center/gb200-nvl72/';

/** Neuron documentation (Neuron 2.33.0 at the latest path on the read date). */
const NEURON_ARCH = 'https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware';
const NEURON_TRN1 = `${NEURON_ARCH}/trainium.html`;
const NEURON_TRN2 = `${NEURON_ARCH}/trainium2.html`;
const NEURON_TRN3 = `${NEURON_ARCH}/trainium3.html`;
const NEURON_TRN2_ARCH = `${NEURON_ARCH}/trn2-arch.html`;
const NEURON_TRN3_ARCH = `${NEURON_ARCH}/trn3-arch.html`;
const NEURON_NC3 = `${NEURON_ARCH}/neuron-core-v3.html`;
/** TorchTitan Neuron overview in the Neuron SDK repository: 64 ranks per trn2.48xlarge at LNC=2. */
const TT_NEURON_ABOUT = gh(
  'aws-neuron/aws-neuron-sdk',
  NEURON_SDK_SHA,
  'training/torchtitan/about-torchtitan-neuron.rst',
  'L206-L208',
);
/** TorchNeuron overview: bfloat16 is the training baseline; FP8 and MXFP8 require Trainium3. */
const TORCHNEURON_DTYPES = gh('aws-neuron/aws-neuron-sdk', NEURON_SDK_SHA, 'torch/about-pytorch-neuron.rst', 'L115-L118');

/** AWS nccl-tests sample: all_reduce across 2 x p5.48xlarge, 16 GiB at 487.09 GB/s bus bandwidth. */
const ADT_P5_SAMPLE = gh(
  'aws-samples/awsome-distributed-training',
  AWSOME_DISTRIBUTED_TRAINING_SHA,
  'micro-benchmarks/nccl-tests/README.md',
  'L206-L243',
);
/** Rajbhandari et al., ZeRO, Sec 3.1: 16 bytes per parameter for mixed-precision Adam. */
const ZERO = arxiv('1910.02054v3');
/** Meta's Hugging Face model metadata for Llama 3.1 70B (exact parameter count). */
const HF_LLAMA_70B = 'https://huggingface.co/api/models/meta-llama/Llama-3.1-70B';

/* ------------------------------------------------------------------------ */
/* Figures, from the shared presets (src/lib/presets.ts)                    */
/* ------------------------------------------------------------------------ */

const int = (n: number) => n.toLocaleString('en-US');
const fix = (n: number, d: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

/** HBM per accelerator in GiB, the unit AWS (and Neuron) print. */
function gibPerAccelerator(p: InstancePreset): number {
  const f = p.hbmPerAccelerator.find((x) => x.unit === 'GiB');
  if (!f) throw new RangeError(`no GiB figure for ${p.id}`);
  return f.value;
}

/** HBM per instance in bytes, from the GiB figure. */
function instanceHbmBytes(p: InstancePreset): number {
  const f = p.hbmPerAccelerator.find((x) => x.unit === 'GiB');
  if (!f) throw new RangeError(`no GiB figure for ${p.id}`);
  return memoryFigureBytes(f) * p.acceleratorsPerInstance.value;
}

const efaPerAccelerator = (p: InstancePreset) => p.efaGbpsPerInstance.value / p.acceleratorsPerInstance.value;

const P4D = INSTANCES['p4d.24xlarge'];
const P5 = INSTANCES['p5.48xlarge'];
const P5EN = INSTANCES['p5en.48xlarge'];
const B200 = INSTANCES['p6-b200.48xlarge'];
const B300 = INSTANCES['p6-b300.48xlarge'];
const GB200 = INSTANCES['p6e-gb200.36xlarge'];
const TRN2 = INSTANCES['trn2.48xlarge'];
const TRN3 = INSTANCES['trn3-gen2-ultraserver'];

const TRN2_RANKS = TRN2.ranksPerInstance?.value ?? 0;
const TRN2_RANK_GIB = TRN2.hbmPerRank?.[0].value ?? 0;

/** Llama 3.1 70B model state at 16 bytes per parameter. */
const P70 = DENSE_MODELS['llama-3.1-70b'].totalParameters.value;
const STATE_70B = modelStateBytes(P70, 16);
const nodesFor70b = (p: InstancePreset) => STATE_70B / instanceHbmBytes(p);

/** Section 14's example 2, recomputed here by Calculator C so the two sections print the same figure. */
const M70 = shapeOf(DENSE_MODELS['llama-3.1-70b']);
const TP8_DP4: Layout = {
  tp: 8,
  cp: 1,
  pp: 1,
  dp: 4,
  interleavedChunks: 1,
  sharding: 'zero1',
  microBatch: 1,
  recompute: 'none',
  gradientSync: 'oncePerStep',
};
const EX2_INPUT: ParallelismInput = {
  model: M70,
  instance: P5EN,
  instanceCount: 4,
  sequenceLength: 8_192,
  globalBatch: { sequences: 512 },
  attention: 'none',
};
const EX2_H200 = evaluateLayout(EX2_INPUT, TP8_DP4);
const EX2_H100 = evaluateLayout({ ...EX2_INPUT, instance: P5 }, TP8_DP4);

/* ------------------------------------------------------------------------ */
/* Diagram: the scale-up domains drawn to scale, with the EFA edge          */
/* ------------------------------------------------------------------------ */

const INK = '#16191f';
const MUTED = '#414d5c';
const FONT = 'sans-serif';
const EDGE = '#ec7211';
const EDGE_TEXT = '#b35900';
const DOMAIN_FILL = '#f2f8fd';
const GPU_FILL = '#0972d3';
const TRN_FILL = '#6f4cc4';
const GROUP_STROKE = '#879596';

/** One square per accelerator: 10 units with a 2-unit gap, the same in every domain. */
const CELL = 10;
const PITCH = 12;
const PAD = 6;
const ARROW = 28;

interface Domain {
  key: string;
  kind: 'gpu' | 'trn';
  /** Accelerators per group (one instance or server), as columns x rows. */
  groupCols: number;
  groupRows: number;
  /** Groups in the domain, as columns x rows. */
  layoutCols: number;
  layoutRows: number;
  groupGap: number;
  title: string;
  line2: string;
  line3: string;
  efa: string;
  efa2?: string;
}

const DOMAINS: Domain[] = [
  {
    key: 'gpu8',
    kind: 'gpu',
    groupCols: 4,
    groupRows: 2,
    layoutCols: 1,
    layoutRows: 1,
    groupGap: 0,
    title: '8 GPUs',
    line2: 'P4d to P6-B300',
    line3: 'NVSwitch or NVLink',
    efa: `EFA ${int(efaPerAccelerator(P5))} Gbps per GPU`,
    efa2: `(${int(efaPerAccelerator(P4D))} P4d, ${int(efaPerAccelerator(B300))} P6-B300)`,
  },
  {
    key: 'trn16',
    kind: 'trn',
    groupCols: 4,
    groupRows: 4,
    layoutCols: 1,
    layoutRows: 1,
    groupGap: 0,
    title: '16 Trainium2',
    line2: 'trn2.48xlarge',
    line3: '4x4 torus, NeuronLink',
    efa: `EFA ${int(efaPerAccelerator(TRN2))} Gbps per chip`,
  },
  {
    key: 'trn64',
    kind: 'trn',
    groupCols: 4,
    groupRows: 4,
    layoutCols: 2,
    layoutRows: 2,
    groupGap: 6,
    title: '64 Trainium2',
    line2: 'Trn2 UltraServer',
    line3: '4 trn2u.48xlarge',
    efa: `EFA ${int(efaPerAccelerator(TRN2))} Gbps per chip`,
  },
  {
    key: 'gpu72',
    kind: 'gpu',
    groupCols: 2,
    groupRows: 2,
    layoutCols: 6,
    layoutRows: 3,
    groupGap: 4,
    title: '72 GPUs',
    line2: 'u-p6e-gb200x72',
    line3: '18 instances, NVLink',
    efa: `EFA ${int(efaPerAccelerator(GB200))} Gbps per GPU`,
    efa2: '(P6 page: 400)',
  },
  {
    key: 'trn144',
    kind: 'trn',
    groupCols: 2,
    groupRows: 2,
    layoutCols: 6,
    layoutRows: 6,
    groupGap: 4,
    title: '144 Trainium3',
    line2: 'Trn3 Gen2 UltraServer',
    line3: '36 servers, NeuronSwitch',
    efa: `EFA ${int(efaPerAccelerator(TRN3))} Gbps per chip`,
  },
];

function groupSize(d: Domain) {
  return { w: d.groupCols * PITCH - (PITCH - CELL), h: d.groupRows * PITCH - (PITCH - CELL) };
}

function domainSize(d: Domain) {
  const g = groupSize(d);
  const w = d.layoutCols * g.w + (d.layoutCols - 1) * d.groupGap + 2 * PAD;
  const h = d.layoutRows * g.h + (d.layoutRows - 1) * d.groupGap + 2 * PAD;
  return { w, h };
}

/** Draws one domain with its bottom edge on `baseline`, centred on `cx`, and its label stack below. */
function DomainShape({ d, cx, baseline, big }: { d: Domain; cx: number; baseline: number; big: boolean }) {
  const { w, h } = domainSize(d);
  const g = groupSize(d);
  const x0 = cx - w / 2;
  const y0 = baseline - h;
  const fill = d.kind === 'gpu' ? GPU_FILL : TRN_FILL;
  const titleSize = big ? 15 : 13;
  const textSize = big ? 13 : 11;
  const step = big ? 18 : 16;
  const groups: ReactNode[] = [];
  for (let gr = 0; gr < d.layoutRows; gr += 1) {
    for (let gc = 0; gc < d.layoutCols; gc += 1) {
      const gx = x0 + PAD + gc * (g.w + d.groupGap);
      const gy = y0 + PAD + gr * (g.h + d.groupGap);
      const cells: ReactNode[] = [];
      for (let r = 0; r < d.groupRows; r += 1) {
        for (let c = 0; c < d.groupCols; c += 1) {
          cells.push(
            <rect key={`${r}-${c}`} x={gx + c * PITCH} y={gy + r * PITCH} width={CELL} height={CELL} rx={1.5} fill={fill} />,
          );
        }
      }
      groups.push(
        <g key={`${gr}-${gc}`}>
          {d.layoutCols * d.layoutRows > 1 && (
            <rect
              x={gx - 1.5}
              y={gy - 1.5}
              width={g.w + 3}
              height={g.h + 3}
              rx={2}
              fill="none"
              stroke={GROUP_STROKE}
              strokeWidth={1}
            />
          )}
          {cells}
        </g>,
      );
    }
  }
  const arrowTop = y0 - ARROW;
  return (
    <g>
      <rect x={x0} y={y0} width={w} height={h} rx={4} fill={DOMAIN_FILL} stroke={EDGE} strokeWidth={2.5} />
      {groups}
      <line
        x1={cx}
        y1={y0 - 2}
        x2={cx}
        y2={arrowTop + 4}
        stroke={EDGE}
        strokeWidth={2}
        markerEnd="url(#aws-hardware-domains-arrow)"
      />
      <text x={cx + 7} y={y0 - 11} fontFamily={FONT} fontSize={textSize} fontWeight={700} fill={EDGE_TEXT}>
        EFA
      </text>
      <text x={cx} y={baseline + 22} textAnchor="middle" fontFamily={FONT} fontSize={titleSize} fontWeight={700} fill={INK}>
        {d.title}
      </text>
      <text x={cx} y={baseline + 22 + step + 2} textAnchor="middle" fontFamily={FONT} fontSize={textSize} fill={MUTED}>
        {d.line2}
      </text>
      <text x={cx} y={baseline + 22 + 2 * step + 2} textAnchor="middle" fontFamily={FONT} fontSize={textSize} fill={MUTED}>
        {d.line3}
      </text>
      <text
        x={cx}
        y={baseline + 22 + 3 * step + 4}
        textAnchor="middle"
        fontFamily={FONT}
        fontSize={textSize}
        fontWeight={700}
        fill={EDGE_TEXT}
      >
        {d.efa}
      </text>
      {d.efa2 && (
        <text
          x={cx}
          y={baseline + 22 + 4 * step + 4}
          textAnchor="middle"
          fontFamily={FONT}
          fontSize={textSize}
          fill={EDGE_TEXT}
        >
          {d.efa2}
        </text>
      )}
    </g>
  );
}

const DOMAINS_TITLE =
  'The scale-up domains on AWS drawn to scale, one square per accelerator: 8 GPUs in every P instance up to P6-B300, 16 Trainium2 chips in a trn2.48xlarge, 64 in a Trn2 UltraServer, 72 GPUs in a P6e-GB200 UltraServer and 144 Trainium3 chips in a Trn3 Gen2 UltraServer. Each domain has an orange edge; every byte that crosses it rides EFA, at 400 Gbps per GPU on P5 and P6-B200, 800 on P6-B300 and on P6e-GB200 by the EC2 page, and 200 per Trainium2 or Trainium3 chip.';

function ArrowDefs() {
  return (
    <defs>
      <marker
        id="aws-hardware-domains-arrow"
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="7"
        markerHeight="7"
        orient="auto-start-reverse"
      >
        <path d="M0,0 L10,5 L0,10 z" fill={EDGE} />
      </marker>
    </defs>
  );
}

/** Wide layout: five domains on one baseline. */
function DomainsWide() {
  const W = 900;
  const H = 316;
  const baseline = 214;
  const centres = [110, 265, 420, 592.5, 777.5];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="aws-hardware-domains-title" style={{ width: '100%', height: 'auto' }}>
      <title id="aws-hardware-domains-title">{DOMAINS_TITLE}</title>
      <ArrowDefs />
      <rect x={0} y={0} width={W} height={H} rx={8} fill="#ffffff" />
      {DOMAINS.map((d, i) => (
        <DomainShape key={d.key} d={d} cx={centres[i]} baseline={baseline} big={false} />
      ))}
    </svg>
  );
}

/** Narrow layout: two domains per row, the same square size, so the scale holds. */
function DomainsNarrow() {
  const W = 400;
  const rows: { items: Domain[]; centres: number[] }[] = [
    { items: [DOMAINS[0], DOMAINS[1]], centres: [105, 295] },
    { items: [DOMAINS[2], DOMAINS[3]], centres: [105, 295] },
    { items: [DOMAINS[4]], centres: [200] },
  ];
  const LABELS = 112;
  let top = 14;
  const placed: { d: Domain; cx: number; baseline: number }[] = [];
  for (const row of rows) {
    const maxH = Math.max(...row.items.map((d) => domainSize(d).h));
    const baseline = top + ARROW + 8 + maxH;
    row.items.forEach((d, i) => placed.push({ d, cx: row.centres[i], baseline }));
    top = baseline + LABELS;
  }
  const H = top;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="aws-hardware-domains-title" style={{ width: '100%', height: 'auto' }}>
      <title id="aws-hardware-domains-title">{DOMAINS_TITLE}</title>
      <ArrowDefs />
      <rect x={0} y={0} width={W} height={H} rx={8} fill="#ffffff" />
      {placed.map((p) => (
        <DomainShape key={p.d.key} d={p.d} cx={p.cx} baseline={p.baseline} big />
      ))}
    </svg>
  );
}

function DomainsDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const narrow = useNarrow(ref, 700);
  return (
    <div ref={ref}>
      {narrow ? (
        <div style={{ maxWidth: 460, margin: '0 auto' }}>
          <DomainsNarrow />
        </div>
      ) : (
        <DomainsWide />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* The instance table                                                       */
/* ------------------------------------------------------------------------ */

const cell: CSSProperties = {
  padding: '6px 8px',
  borderBottom: '1px solid #e9ebed',
  textAlign: 'left',
  verticalAlign: 'top',
};
const headCell: CSSProperties = { ...cell, fontWeight: 700, borderBottom: '2px solid #d1d5db' };
const groupCell: CSSProperties = { ...cell, fontWeight: 700, background: '#f4f4f4' };
const tableStyle: CSSProperties = { width: '100%', borderCollapse: 'collapse', fontSize: 14 };

interface HwRow {
  id: InstanceId;
  name: string;
  accelerators: string;
  link: string;
  nvme: string;
  unit: 'GPU' | 'chip';
  /** "instance" except for the Trn3 row, whose unit is the UltraServer. */
  per: 'instance' | 'UltraServer';
  hbmNote?: string;
  fp8Label?: string;
  efaNote?: string;
}

interface HwGroup {
  label: string;
  rows: HwRow[];
}

const GROUPS: HwGroup[] = [
  {
    label: 'NVIDIA, 8 GPUs per instance',
    rows: [
      { id: 'p4d.24xlarge', name: 'p4d.24xlarge', accelerators: '8 x A100', link: 'NVSwitch, 600 GB/s', nvme: '8 x 1,000 GB', unit: 'GPU', per: 'instance', fp8Label: 'no FP8' },
      { id: 'p4de.24xlarge', name: 'p4de.24xlarge', accelerators: '8 x A100', link: 'NVSwitch, 600 GB/s', nvme: '8 x 1,000 GB', unit: 'GPU', per: 'instance', fp8Label: 'no FP8' },
      { id: 'p5.48xlarge', name: 'p5.48xlarge', accelerators: '8 x H100', link: 'NVSwitch, 900 GB/s', nvme: '8 x 3,800 GB', unit: 'GPU', per: 'instance' },
      { id: 'p5e.48xlarge', name: 'p5e.48xlarge', accelerators: '8 x H200', link: 'NVSwitch, 900 GB/s', nvme: '8 x 3,800 GB', unit: 'GPU', per: 'instance' },
      { id: 'p5en.48xlarge', name: 'p5en.48xlarge', accelerators: '8 x H200', link: 'NVSwitch, 900 GB/s', nvme: '8 x 3,800 GB', unit: 'GPU', per: 'instance' },
      { id: 'p6-b200.48xlarge', name: 'p6-b200.48xlarge', accelerators: '8 x B200', link: 'NVLink 5, 1.8 TB/s per GPU', nvme: '8 x 3,800 GB', unit: 'GPU', per: 'instance' },
      { id: 'p6-b300.48xlarge', name: 'p6-b300.48xlarge', accelerators: '8 x B300', link: 'NVLink, 1.8 TB/s per GPU', nvme: '8 x 3,800 GB', unit: 'GPU', per: 'instance' },
    ],
  },
  {
    label: 'NVIDIA, sold only inside UltraServers',
    rows: [
      {
        id: 'p6e-gb200.36xlarge',
        name: 'p6e-gb200.36xlarge',
        accelerators: '4 x B200 (GB200) per instance',
        link: 'one NVLink domain of 36 or 72 GPUs per UltraServer',
        nvme: '3 x 7,500 GB',
        unit: 'GPU',
        per: 'instance',
        efaNote: 'the P6 page implies 400 per GPU',
      },
    ],
  },
  {
    label: 'AWS Trainium',
    rows: [
      { id: 'trn1.32xlarge', name: 'trn1.32xlarge', accelerators: '16 x Trainium', link: 'NeuronLink, up to 768 GB/s', nvme: '4 x 1,900 GB', unit: 'chip', per: 'instance', fp8Label: 'cFP8 at the BF16 rate' },
      { id: 'trn1n.32xlarge', name: 'trn1n.32xlarge', accelerators: '16 x Trainium', link: 'NeuronLink, up to 768 GB/s', nvme: '4 x 1,900 GB', unit: 'chip', per: 'instance', fp8Label: 'cFP8 at the BF16 rate' },
      {
        id: 'trn2.48xlarge',
        name: 'trn2.48xlarge',
        accelerators: '16 x Trainium2',
        link: '4x4 torus, NeuronLink-v3 1.28 TB/s per chip; 64 chips per Trn2 UltraServer',
        nvme: '4 x 1,900 GB',
        unit: 'chip',
        per: 'instance',
        hbmNote: `${TRN2_RANK_GIB} GiB per rank, ${TRN2_RANKS} ranks`,
      },
      {
        id: 'trn3-gen2-ultraserver',
        name: 'Trn3 Gen2 UltraServer',
        accelerators: '144 x Trainium3, 36 servers of 4',
        link: 'NeuronSwitch-v1, all-to-all',
        nvme: 'not in the sources read',
        unit: 'chip',
        per: 'UltraServer',
        fp8Label: 'MXFP8',
      },
    ],
  },
];

function hbmText(r: HwRow): string {
  const p = INSTANCES[r.id];
  return `${int(gibPerAccelerator(p))} GiB`;
}

function peakText(r: HwRow): string {
  const p = INSTANCES[r.id];
  const bf16 = p.denseBf16TflopsPerAccelerator.value;
  const fp8 = p.denseFp8TflopsPerAccelerator?.value;
  const bf = Number.isInteger(bf16) ? int(bf16) : fix(bf16, 1);
  if (fp8 === undefined) return `${bf} / ${r.fp8Label ?? 'not listed'}`;
  return `${bf} / ${int(fp8)}${r.fp8Label && r.fp8Label !== 'no FP8' ? ` (${r.fp8Label})` : ''}`;
}

function efaText(r: HwRow): string {
  const p = INSTANCES[r.id];
  const gbps = p.efaGbpsPerInstance.value;
  const per = r.per === 'UltraServer' ? ' per UltraServer' : '';
  return `${int(gbps)} Gbps${per}, ${int(gbps / 8)} GB/s`;
}

function efaShareText(r: HwRow): string {
  const p = INSTANCES[r.id];
  return `${int(efaPerAccelerator(p))} Gbps per ${r.unit}${r.efaNote ? `; ${r.efaNote}` : ''}`;
}

function InstanceTable() {
  const ref = useRef<HTMLDivElement>(null);
  const narrow = useNarrow(ref, 720);
  return (
    <div ref={ref}>
      {narrow ? (
        <SpaceBetween size="m">
          {GROUPS.map((g) => (
            <div key={g.label}>
              <Box variant="h4">{g.label}</Box>
              {g.rows.map((r) => (
                <div key={r.id} style={{ borderBottom: '1px solid #e9ebed', padding: '8px 0' }}>
                  <Box variant="p" margin={{ bottom: 'xxs' }}>
                    <strong>{r.name}</strong>: {r.accelerators}; {r.link}
                  </Box>
                  <Box variant="p" margin={{ bottom: 'xxs' }}>
                    HBM {hbmText(r)} per {r.unit}
                    {r.hbmNote ? ` (${r.hbmNote})` : ''}. Dense TFLOPS, BF16 / 8-bit: {peakText(r)}.
                  </Box>
                  <Box variant="p">
                    EFA {efaText(r)} ({efaShareText(r)}). NVMe: {r.nvme}.
                  </Box>
                </div>
              ))}
            </div>
          ))}
        </SpaceBetween>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={headCell}>Instance (NVMe)</th>
                <th style={headCell}>Accelerators and fast link</th>
                <th style={headCell}>HBM per accelerator</th>
                <th style={headCell}>Dense BF16 / 8-bit TFLOPS</th>
                <th style={headCell}>EFA per instance (per accelerator)</th>
              </tr>
            </thead>
            <tbody>
              {GROUPS.map((g) => [
                <tr key={g.label}>
                  <td style={groupCell} colSpan={5}>
                    {g.label}
                  </td>
                </tr>,
                ...g.rows.map((r) => (
                  <tr key={r.id}>
                    <td style={cell}>
                      <strong>{r.name}</strong>
                      <br />
                      <Box variant="small" color="text-body-secondary">
                        {r.nvme}
                      </Box>
                    </td>
                    <td style={cell}>
                      {r.accelerators}; {r.link}
                    </td>
                    <td style={cell}>
                      {hbmText(r)}
                      {r.hbmNote && (
                        <>
                          <br />
                          <Box variant="small" color="text-body-secondary">
                            {r.hbmNote}
                          </Box>
                        </>
                      )}
                    </td>
                    <td style={cell}>{peakText(r)}</td>
                    <td style={cell}>
                      {efaText(r)}
                      <br />
                      <Box variant="small" color="text-body-secondary">
                        {efaShareText(r)}
                      </Box>
                    </td>
                  </tr>
                )),
              ])}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* New silicon: what each generational step changes                         */
/* ------------------------------------------------------------------------ */

const STEPS = [
  { label: 'H100 to H200', from: P5, to: P5EN, fp8: 'FP8' },
  { label: 'B200 to B300', from: B200, to: B300, fp8: 'FP8' },
  { label: 'Trainium2 to Trainium3', from: TRN2, to: TRN3, fp8: 'FP8 to MXFP8' },
];

function pctMore(a: number, b: number): string {
  return `+${Math.round((b / a - 1) * 100)}%`;
}

function tf(n: number): string {
  return Number.isInteger(n) ? int(n) : fix(n, 1);
}

function GenerationTable() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={headCell}>Step</th>
            <th style={headCell}>BF16 TFLOPS</th>
            <th style={headCell}>HBM, GiB</th>
            <th style={headCell}>8-bit TFLOPS</th>
          </tr>
        </thead>
        <tbody>
          {STEPS.map((s) => {
            const a = s.from.denseBf16TflopsPerAccelerator.value;
            const b = s.to.denseBf16TflopsPerAccelerator.value;
            const ha = gibPerAccelerator(s.from);
            const hb = gibPerAccelerator(s.to);
            const fa = s.from.denseFp8TflopsPerAccelerator?.value ?? 0;
            const fb = s.to.denseFp8TflopsPerAccelerator?.value ?? 0;
            return (
              <tr key={s.label}>
                <td style={cell}>{s.label}</td>
                <td style={cell}>
                  {tf(a)} to {tf(b)}
                </td>
                <td style={cell}>
                  {int(ha)} to {int(hb)} ({pctMore(ha, hb)})
                </td>
                <td style={cell}>
                  {int(fa)} to {int(fb)} {s.fp8}
                  {fa !== fb ? ` (${fix(fb / fa, 2)}x)` : ''}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* The node-count floor for Llama 3.1 70B                                   */
/* ------------------------------------------------------------------------ */

const FLOOR_ROWS: { id: InstanceId; note?: string }[] = [
  { id: 'p4d.24xlarge' },
  { id: 'p5.48xlarge' },
  { id: 'p5en.48xlarge' },
  { id: 'p6-b200.48xlarge' },
  { id: 'p6-b300.48xlarge' },
  { id: 'trn1.32xlarge' },
  { id: 'trn2.48xlarge' },
];

function FloorTable() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={headCell}>Instance</th>
            <th style={headCell}>HBM per instance</th>
            <th style={headCell}>Instances for 70B model state</th>
          </tr>
        </thead>
        <tbody>
          {FLOOR_ROWS.map((r) => {
            const p = INSTANCES[r.id];
            return (
              <tr key={r.id}>
                <td style={cell}>{r.id}</td>
                <td style={cell}>
                  {int(p.acceleratorsPerInstance.value * gibPerAccelerator(p))} GiB = {fix(instanceHbmBytes(p) / GB, 1)} GB
                </td>
                <td style={cell}>
                  <strong>{fix(nodesFor70b(p), 2)}</strong>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

const STATE_GB = fix(STATE_70B / GB, 1);
const P5_NODES = fix(nodesFor70b(P5), 2);
const P5EN_NODES = fix(nodesFor70b(P5EN), 2);
const TRN2_NODES = fix(nodesFor70b(TRN2), 2);

export function AwsHardware() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description={`Read any training instance as the three numbers the calculators need (memory per accelerator, peak arithmetic, and how many accelerators share the fast link) and know before any layout that Llama 3.1 70B's model state alone needs ${P5_NODES} p5.48xlarge (sources read 2026-10-31)`}
          >
            21. Training Hardware on AWS
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            An EC2 (Amazon Elastic Compute Cloud) training instance is the unit every earlier section
            was sizing for. Three of its numbers decide what a training layout can do: the HBM
            (high-bandwidth memory) on each accelerator, which bounds what one rank (one training
            process) can hold of the model state, the weights, gradients and optimizer state kept from
            step to step, and of the activations, the values a forward pass keeps for the backward
            pass; the dense peak arithmetic, the denominator of MFU (model FLOPs
            utilization, the share of peak a run achieves) and of every run-time estimate; and the
            scale-up domain, the set of accelerators joined by the fast link, NVLink or NeuronLink,
            past which every byte crosses EFA (Elastic Fabric Adapter).
          </Box>
          <Box variant="p">
            The challenge is reading those numbers off pages that print them in different units and,
            in a few cells, disagree. This section collects them in one table, the inputs that
            Calculators A, B and C take in sections 4, 5 and 14, and ends on the first sizing question
            the table answers: Llama 3.1 70B&apos;s model state alone needs {P5_NODES} p5.48xlarge,{' '}
            {P5EN_NODES} p5en.48xlarge or {TRN2_NODES} trn2.48xlarge before a single activation is
            stored (our arithmetic, worked in the last block).
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Know which link each parallel dimension will ride before you choose an instance: 8 GPUs share NVLink on every P instance up to P6-B300, 72 on a P6e-GB200 UltraServer, and everything past the domain is EFA"
          >
            The scale-up domain sets where tensor parallelism can live
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A scale-up domain is the group of accelerators one fast link joins. Tensor parallelism (TP,
            splitting every layer&apos;s matrices across the accelerators of one instance; section 9)
            exchanges activations inside every layer of every micro-batch, the slice of a step&apos;s
            batch that one forward and backward pass processes, so it belongs inside one domain. Data
            parallelism (replicas of the model on different data) and pipeline parallelism
            (consecutive layers on different accelerators) communicate once per step or per
            micro-batch and can cross EFA; section 7 prices the difference. The domain&apos;s size is the ceiling
            on a TP group that stays on the fast link. On AWS it comes in five sizes:
          </Box>
          <ul>
            <li>
              <strong>8 GPUs</strong> in every P instance from p4d.24xlarge to p6-b300.48xlarge{' '}
              <Cite tier={1} href={EC2_AC}>
                EC2 accelerated computing instance specifications
              </Cite>
              , on NVSwitch (600 GB/s on P4d, 900 GB/s on P5, P5e and P5en){' '}
              <Cite tier={1} href={P4_PAGE}>
                EC2 P4 product page
              </Cite>{' '}
              <Cite tier={1} href={P5_PAGE}>
                EC2 P5 product page
              </Cite>{' '}
              or fifth-generation NVLink at up to 1.8 TB/s per GPU on P6-B200{' '}
              <Cite tier={1} href={P6_PAGE}>
                EC2 P6 product page
              </Cite>
              .
            </li>
            <li>
              <strong>16 Trainium2 chips</strong> per trn2.48xlarge, &quot;connected using a 4x4, 2D
              Torus topology&quot;, and <strong>64</strong> in a Trn2 UltraServer, four
              trn2u.48xlarge joined by NeuronLink-v3{' '}
              <Cite tier={1} href={NEURON_TRN2_ARCH}>
                Neuron 2.33 Trn2 architecture
              </Cite>
              . A trn1.32xlarge also joins 16 chips, first-generation Trainium, on NeuronLink at up to
              768 GB/s{' '}
              <Cite tier={1} href={TRN1_PAGE}>
                EC2 Trn1 product page
              </Cite>
              .
            </li>
            <li>
              <strong>36 or 72 GPUs</strong> in a P6e-GB200 UltraServer (u-p6e-gb200x36 and
              u-p6e-gb200x72), &quot;up to 72 Blackwell GPUs within one NVLink domain&quot;, built from
              4-GPU p6e-gb200.36xlarge instances that are &quot;only available in UltraServers&quot;{' '}
              <Cite tier={1} href={P6_PAGE}>
                EC2 P6 product page
              </Cite>
              .
            </li>
            <li>
              <strong>64 or 144 Trainium3 chips</strong> in a Trn3 Gen1 or Gen2 UltraServer, joined
              all-to-all by NeuronSwitch-v1, &quot;replacing the previous 2D-torus architecture&quot;{' '}
              <Cite tier={1} href={NEURON_TRN3_ARCH}>
                Neuron 2.33 Trn3 architecture
              </Cite>
              .
            </li>
          </ul>
          <DomainsDiagram />
          <Box variant="small" color="text-body-secondary">
            Drawn to scale from the specifications cited in the text, not measured. Each square is one
            accelerator, and thin grey outlines group the accelerators of one instance or server. The
            orange border is the domain&apos;s edge: traffic inside it rides NVLink or NeuronLink, and
            traffic across it rides EFA at the per-accelerator share shown.
          </Box>
          <Box variant="p">
            AWS lists network bandwidth per instance, which the product pages give as EFA bandwidth:
            3,200 Gbps on p5.48xlarge, p5en.48xlarge, p6-b200.48xlarge and trn2.48xlarge, and 6,400
            on p6-b300.48xlarge{' '}
            <Cite tier={1} href={EC2_AC}>
              EC2 accelerated computing instance specifications
            </Cite>{' '}
            <Cite tier={1} href={P5_PAGE}>
              EC2 P5 product page
            </Cite>{' '}
            <Cite tier={1} href={P6_PAGE}>
              EC2 P6 product page
            </Cite>{' '}
            <Cite tier={1} href={TRN2_PAGE}>
              EC2 Trn2 product page
            </Cite>
            . Shared by the accelerators of the instance, that is 400 Gbps per GPU on P5 and P6-B200,
            800 on P6-B300 and 200 per Trainium2 chip, and the Trn3 UltraServers&apos; 12,800 and
            28,800 Gbps for 64 and 144 chips are 200 per chip as well{' '}
            <Cite tier={1} href={NEURON_TRN3_ARCH}>
              Neuron 2.33 Trn3 architecture
            </Cite>{' '}
            (our arithmetic from the listed totals). The EC2 page gives no direction for these figures.
          </Box>
          <Box variant="p">
            Mind the two 400s. A p5.48xlarge&apos;s 3,200 Gbps is 400 GB/s for the whole instance and
            400 Gbps, or 50 GB/s, for each GPU. Sections 7, 8 and 14 divide the bytes a collective (an
            exchange among a group of ranks, such as an all-reduce) sends between instances by the
            instance figure, 400 GB/s, because collectives that sum or
            gather combine inside the instance first and then leave over all of its network cards;
            bytes addressed GPU to GPU across instances, as in all-to-all and send and receive, pay
            each GPU&apos;s 50 GB/s share. That split is section 7&apos;s reading of the NCCL (NVIDIA
            Collective Communications Library) documentation and of an AWS sample that all-reduced 16
            GiB across two p5.48xlarge at 487 GB/s of bus bandwidth{' '}
            <Cite tier={2} href={ADT_P5_SAMPLE} kind="vendor-claim">
              awsome-distributed-training nccl-tests README L206-L243
            </Cite>
            .
          </Box>
          <Box variant="p">
            One per-instance figure differs between AWS pages. The EC2 page lists 3,200 Gbps for each
            4-GPU p6e-gb200.36xlarge, which is {int(efaPerAccelerator(GB200))} Gbps per GPU{' '}
            <Cite tier={1} href={EC2_AC}>
              EC2 accelerated computing instance specifications
            </Cite>
            ; the P6 page gives 28,800 Gbps of aggregate EFA for the 72-GPU UltraServer and &quot;400
            GB ps per GPU of EFAv4 networking&quot;, which is 1,600 Gbps per instance and 400 per GPU{' '}
            <Cite tier={1} href={P6_PAGE}>
              EC2 P6 product page
            </Cite>{' '}
            (our arithmetic). The table and the calculators take the EC2 page&apos;s 3,200; for a
            layout whose collectives cross P6e-GB200 UltraServers, price the crossing at both and let a
            measured step decide.
          </Box>
          <Box variant="p">
            The Trainium domains differ in shape as well as size. Inside a Trn2 UltraServer, chips with
            the same coordinates in each instance are joined in a ring{' '}
            <Cite tier={1} href={NEURON_TRN2_ARCH}>
              Neuron 2.33 Trn2 architecture
            </Cite>
            , while Trn3&apos;s all-to-all design is &quot;optimized for Mixture of Experts models and
            autoregressive inference serving&quot;{' '}
            <Cite tier={1} href={NEURON_TRN3_ARCH}>
              Neuron 2.33 Trn3 architecture
            </Cite>
            . By our reading, a torus favours exchanges between neighbouring chips, and the expert
            all-to-all of section 12 (Mixture of Experts: Expert Parallelism) is the traffic the Trn3
            switch is built for.
          </Box>
          <Box variant="p">
            Which EFA generation each instance carries is in the{' '}
            <Link href="../efa/">EFA dive, section 8: Instance Support Matrix</Link>, and where an
            instance sits in the network, for placement and rank order, in the{' '}
            <Link href="../efa/">EFA dive, section 7: The EC2 Instance Topology API</Link>.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Read the three inputs for any instance the calculators take off one table, with the unit and source of each, and know which AWS cell to distrust"
          >
            One table of inputs for every training instance
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Accelerators, HBM, network bandwidth and NVMe (Non-Volatile Memory Express) instance
            storage come from the EC2 specification page; the fast-link figures from the product
            pages. The peaks, in TFLOPS (trillion floating-point operations per second), are dense
            BF16 (bfloat16) and 8-bit figures per accelerator, and vendor specifications: the
            denominators an MFU divides by. NVIDIA prints its tensor-core peaks
            with sparsity and states that dense is half, so the table halves them (section 4, Counting
            the Arithmetic). The 8-bit column is FP8 (8-bit floating point) except where marked: cFP8
            is Trainium&apos;s configurable FP8, and MXFP8 (microscaled FP8) is
            Trainium3&apos;s block-scaled format.
          </Box>
          <InstanceTable />
          <Box variant="small" color="text-body-secondary">
            Sources:{' '}
            <Cite tier={1} href={EC2_AC}>
              EC2 accelerated computing instance specifications
            </Cite>
            ;{' '}
            <Cite tier={1} href={P4_PAGE}>
              EC2 P4
            </Cite>
            ,{' '}
            <Cite tier={1} href={P5_PAGE}>
              P5
            </Cite>
            ,{' '}
            <Cite tier={1} href={P6_PAGE}>
              P6
            </Cite>{' '}
            and{' '}
            <Cite tier={1} href={TRN1_PAGE}>
              Trn1
            </Cite>{' '}
            product pages;{' '}
            <Cite tier={1} href={A100_SPEC} kind="vendor-claim">
              NVIDIA A100
            </Cite>
            ,{' '}
            <Cite tier={1} href={H100_SPEC} kind="vendor-claim">
              H100
            </Cite>
            ,{' '}
            <Cite tier={1} href={H200_SPEC} kind="vendor-claim">
              H200
            </Cite>
            ,{' '}
            <Cite tier={1} href={HGX_SPEC} kind="vendor-claim">
              HGX B200 and B300
            </Cite>{' '}
            and{' '}
            <Cite tier={1} href={GB200_SPEC} kind="vendor-claim">
              GB200 NVL72
            </Cite>{' '}
            specifications; Neuron 2.33{' '}
            <Cite tier={1} href={NEURON_TRN1} kind="vendor-claim">
              Trainium
            </Cite>
            ,{' '}
            <Cite tier={1} href={NEURON_TRN2} kind="vendor-claim">
              Trainium2
            </Cite>
            ,{' '}
            <Cite tier={1} href={NEURON_TRN3} kind="vendor-claim">
              Trainium3
            </Cite>
            ,{' '}
            <Cite tier={1} href={NEURON_TRN2_ARCH}>
              Trn2
            </Cite>{' '}
            and{' '}
            <Cite tier={1} href={NEURON_TRN3_ARCH}>
              Trn3
            </Cite>{' '}
            architecture pages; the GB/s conversions and per-accelerator EFA shares are our
            arithmetic.
          </Box>
          <Box variant="p">
            Four readings of the table change what goes into a calculator:
          </Box>
          <ul>
            <li>
              <strong>On Trainium2 a rank is a logical core.</strong> TorchTitan Neuron runs one
              process per logical NeuronCore, {TRN2_RANKS} ranks per trn2.48xlarge at the default LNC
              (logical NeuronCore) setting of 2{' '}
              <Cite tier={1} href={TT_NEURON_ABOUT}>
                aws-neuron-sdk 2.33, about-torchtitan-neuron.rst L206-L208
              </Cite>
              , so each rank holds {gibPerAccelerator(TRN2)} / 4 = {TRN2_RANK_GIB} GiB (our
              arithmetic). Calculators B and C take those per-rank figures for trn2.
            </li>
            <li>
              <strong>The p6e-gb200 GPU has the GB200 peak.</strong> The EC2 page names it an NVIDIA
              B200, and its dense BF16 peak is the GB200 NVL72 figure,{' '}
              {int(GB200.denseBf16TflopsPerAccelerator.value)} TFLOPS{' '}
              <Cite tier={1} href={GB200_SPEC} kind="vendor-claim">
                NVIDIA GB200 NVL72 specification
              </Cite>
              , against {int(B200.denseBf16TflopsPerAccelerator.value)} on an HGX B200{' '}
              <Cite tier={1} href={HGX_SPEC} kind="vendor-claim">
                NVIDIA HGX specification
              </Cite>
              , 11% higher. A tool that picks its denominator by GPU name divides by the wrong one.
            </li>
            <li>
              <strong>GiB and GB differ by 7%.</strong> AWS lists HBM in GiB (2^30 bytes) and NVIDIA
              in GB (10^9 bytes): 80 GiB per H100 on the EC2 page, 80 GB on NVIDIA&apos;s{' '}
              <Cite tier={1} href={H100_SPEC} kind="vendor-claim">
                NVIDIA H100 specification
              </Cite>
              . Where both exist the calculators take the smaller figure. Section 7 reads
              NVIDIA&apos;s 900 GB/s of NVLink per H100 as 450 GB/s per direction, the figure the
              calculators divide by.
            </li>
            <li>
              <strong>Distrust the EC2 page&apos;s Trainium2 memory cell.</strong> It lists
              trn2.48xlarge accelerator memory as &quot;8192 GiB (16 x 512 GiB)&quot;{' '}
              <Cite tier={1} href={EC2_AC}>
                EC2 accelerated computing instance specifications
              </Cite>
              . The Neuron documentation gives 96 GiB per Trainium2 chip and 1,536 GiB per instance{' '}
              <Cite tier={1} href={NEURON_TRN2}>
                Neuron 2.33 Trainium2 architecture
              </Cite>{' '}
              <Cite tier={1} href={NEURON_TRN2_ARCH}>
                Neuron 2.33 Trn2 architecture
              </Cite>
              , and the Trn2 product page gives 96 GB and 1.5 TB{' '}
              <Cite tier={1} href={TRN2_PAGE}>
                EC2 Trn2 product page
              </Cite>
              . The Neuron documentation and the product page agree on 96, and the table and
              calculators use it; 512 GiB would let a memory budget plan with more than five times the
              HBM the chip has.
            </li>
          </ul>
          <Box variant="p">
            Two generally available products have no row. P6e-GB300 UltraServers and Trn3 UltraServers
            have been generally available since 2 December 2025{' '}
            <Cite tier={2} href={WN_GB300}>
              What&apos;s New: P6e-GB300 UltraServers
            </Cite>{' '}
            <Cite tier={2} href={WN_TRN3}>
              What&apos;s New: Trn3 UltraServers
            </Cite>
            , and on 2026-10-31 neither appears on the EC2 specification page or with a rate on the
            Capacity Blocks pricing page{' '}
            <Cite tier={1} href={EC2_AC}>
              EC2 accelerated computing instance specifications
            </Cite>{' '}
            <Cite tier={1} href={CB_PRICING}>
              EC2 Capacity Blocks pricing
            </Cite>
            , nor in the us-east-1 EC2 price file read for this research{' '}
            <Cite tier={1} href={EC2_PRICE_FILE}>
              AWS Price List, AmazonEC2 offer 20261029175634
            </Cite>
            . In the AWS pages read on 2026-10-31, P6e-GB300 figures appear only relative to
            P6e-GB200, 1.5 times the GPU memory and 1.5 times the FP4 (4-bit floating point) compute
            without sparsity, and the announcement sends buyers to an AWS sales representative{' '}
            <Cite tier={2} href={WN_GB300}>
              What&apos;s New: P6e-GB300 UltraServers
            </Cite>
            . For Trn3 the Neuron documentation is the only first-party source of configurations
            located in this research, and the table&apos;s Trn3 row takes the Gen2 UltraServer from it.
          </Box>
          <ExpandableSection headerText="Other places the pages disagree, and which figure the table takes">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>Blackwell HBM depends on the page and the unit.</strong> The EC2 page lists
                p6-b200 &quot;1432 GiB (8 x 179 GiB)&quot;, p6e-gb200 &quot;740 GiB (4 x 185
                GiB)&quot; and p6-b300 &quot;2148 GiB (8 x 268 GiB)&quot;, although 8 x 268 is 2,144{' '}
                <Cite tier={1} href={EC2_AC}>
                  EC2 accelerated computing instance specifications
                </Cite>
                . The P6 page prints &quot;1440 GB&quot; in prose and 1,432 in its table for p6-b200,
                and 2,144 for p6-b300{' '}
                <Cite tier={1} href={P6_PAGE}>
                  EC2 P6 product page
                </Cite>
                ; NVIDIA gives 1.4 TB per HGX B200 board{' '}
                <Cite tier={1} href={HGX_SPEC} kind="vendor-claim">
                  NVIDIA HGX specification
                </Cite>{' '}
                and 372 GB per two-GPU GB200 superchip{' '}
                <Cite tier={1} href={GB200_SPEC} kind="vendor-claim">
                  NVIDIA GB200 NVL72 specification
                </Cite>
                . The table takes the EC2 page&apos;s GiB per GPU, the figure the instance exposes by
                our reading.
              </Box>
              <Box variant="p">
                <strong>Trainium3&apos;s NeuronLink has three per-chip values.</strong> The Trainium3
                page gives 2.56 TB/s per device{' '}
                <Cite tier={1} href={NEURON_TRN3}>
                  Neuron 2.33 Trainium3 architecture
                </Cite>
                ; the Trn3 architecture page gives 2,048 GiB/s per device in its table, and per chip
                256 GB/s to the other chips of its server, 320 GB/s across servers and 128 GB/s across
                racks, all bidirectional{' '}
                <Cite tier={1} href={NEURON_TRN3_ARCH}>
                  Neuron 2.33 Trn3 architecture
                </Cite>
                ; the Trn3 product page gives 2 TB/s per chip{' '}
                <Cite tier={1} href={TRN3_PAGE}>
                  EC2 Trn3 product page
                </Cite>
                . No code settles it, so the table carries no Trn3 fast-link figure; for a collective,
                the per-level breakdown is the one it traverses, by our reading.
              </Box>
              <Box variant="p">
                <strong>Trn2 UltraServer status.</strong> The UltraServers page describes the Trn2
                UltraServer configuration as &quot;(available in preview)&quot;{' '}
                <Cite tier={1} href={ULTRASERVERS_PAGE}>
                  EC2 UltraServers page
                </Cite>
                , while the Trn2 product page says &quot;Trn2 UltraServers are available now&quot;{' '}
                <Cite tier={1} href={TRN2_PAGE}>
                  EC2 Trn2 product page
                </Cite>{' '}
                and the Capacity Blocks guide lists Trn2 UltraServer blocks in us-east-2{' '}
                <Cite tier={1} href={CB_GUIDE} accessed={REGISTER_DATE}>
                  EC2 Capacity Blocks user guide
                </Cite>
                . Two sources against one; the preview label reads as stale.
              </Box>
              <Box variant="p">
                <strong>Two Trainium2 peaks.</strong> The Trainium2 page lists 667 BF16 and 1,299 FP8
                dense TFLOPS per chip{' '}
                <Cite tier={1} href={NEURON_TRN2} kind="vendor-claim">
                  Neuron 2.33 Trainium2 architecture
                </Cite>
                ; the NeuronCore-v3 page lists 79 BF16 and 158 cFP8 TFLOPS per core{' '}
                <Cite tier={1} href={NEURON_NC3} kind="vendor-claim">
                  Neuron 2.33 NeuronCore-v3 architecture
                </Cite>
                , which over the chip&apos;s eight cores is 632 and 1,264, about 5% and 3% lower (our
                arithmetic). Neither page states a clock. The table uses the chip page&apos;s 667;
                section 4 shows which figure a framework divides by.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Know what a newer part buys a BF16 run before you pay for it: the same peak with more memory, which turns into less recomputation or a simpler layout"
          >
            New silicon adds low-precision throughput and memory while the BF16 peak holds still
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Across the three generational steps a training team meets on AWS, the dense BF16 peak
            barely moves while the memory per accelerator grows, and the 8-bit peak grows where it
            moves at all:
          </Box>
          <GenerationTable />
          <Box variant="p">
            H200 is H100 compute with 76% more HBM: NVIDIA prints the same BF16 and FP8 figures for
            both{' '}
            <Cite tier={1} href={H100_SPEC} kind="vendor-claim">
              NVIDIA H100 specification
            </Cite>{' '}
            <Cite tier={1} href={H200_SPEC} kind="vendor-claim">
              NVIDIA H200 specification
            </Cite>
            , and the EC2 page lists 80 against 141 GiB per GPU{' '}
            <Cite tier={1} href={EC2_AC}>
              EC2 accelerated computing instance specifications
            </Cite>
            . B300 keeps B200&apos;s BF16 and FP8 peaks{' '}
            <Cite tier={1} href={HGX_SPEC} kind="vendor-claim">
              NVIDIA HGX specification
            </Cite>{' '}
            with 50% more HBM, 268 against 179 GiB. Trainium3 keeps Trainium2&apos;s BF16 peak, 671
            against 667 TFLOPS, and roughly doubles the 8-bit peak, from 1,299 FP8 TFLOPS on Trainium2
            to 2,517 MXFP8 on Trainium3{' '}
            <Cite tier={1} href={NEURON_TRN3} kind="vendor-claim">
              Neuron 2.33 Trainium3 architecture
            </Cite>
            , with 144 GiB against 96. By our reading, a BF16 run on the newer part keeps its peak, so
            at equal MFU its step takes as long, and the gain lands in the memory budget. Which
            format each accelerator trains in at the pinned versions is section 6 (Precision for
            Training: BF16, FP8 &amp; Microscaled Formats); at Neuron 2.33 TorchNeuron names bfloat16
            its training baseline and states that FP8 and MXFP8 require Trainium3{' '}
            <Cite tier={1} href={TORCHNEURON_DTYPES}>
              aws-neuron-sdk 2.33, about-pytorch-neuron.rst L115-L118
            </Cite>
            , so a trn2 run trains in BF16.
          </Box>
          <Box variant="p">
            Section 5 (The Memory Budget) turns headroom into fewer recomputed activations or fewer
            pipeline stages, and section 14&apos;s second example shows it on one layout. Llama 3.1 70B
            at TP 8 x DP 4 (four data-parallel replicas) with ZeRO-1 (Zero Redundancy Optimizer stage
            1, which shards optimizer state across those replicas), 8,192-token sequences, micro-batch
            1, BF16 gradients and no recomputation needs {fix(EX2_H200.memory.totalBytes / GB, 1)} GB
            per GPU, by Calculator C. On four p5en.48xlarge that sits inside the H200&apos;s{' '}
            {fix(EX2_H200.memory.headroomTargetBytes / GB, 1)} GB target, the dive&apos;s assumed 75%
            of {fix(EX2_H200.memory.capacity.gb, 0)} GB; on four p5.48xlarge it exceeds the
            H100&apos;s whole {fix(EX2_H100.memory.capacity.gb, 0)} GB, and the same model needs full
            recomputation (re-running each layer&apos;s forward pass during the backward pass instead
            of storing its activations) or a four-stage pipeline instead. The H200&apos;s memory removes the need for
            either.
          </Box>
          <Box variant="p">
            The Trainium silicon itself is in the{' '}
            <Link href="../silicon-memory-inference/">
              Silicon, Memory and Modern Inference dive, section 19: AWS Trainium, Inferentia and Neuron
            </Link>
            , and the Grace-Blackwell rack in its{' '}
            <Link href="../silicon-memory-inference/">section 16: Grace-Blackwell and UltraServer</Link>.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description={`Know the floor on your cluster before you choose a layout: Llama 3.1 70B's ${STATE_GB} GB of model state needs ${P5_NODES} p5.48xlarge, ${P5EN_NODES} p5en.48xlarge or ${TRN2_NODES} trn2.48xlarge`}
          >
            Turn the table into a node count
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The first use of the table is a floor. Model state, the weights, gradients and optimizer
            state that persist from step to step (section 3), costs 16 bytes per parameter with
            mixed-precision Adam{' '}
            <Cite tier={3} href={ZERO} venue="preprint" accessed={REGISTER_DATE}>
              ZeRO, Section 3.1
            </Cite>
            . Llama 3.1 70B has {int(P70)} parameters{' '}
            <Cite tier={1} href={HF_LLAMA_70B} accessed={REGISTER_DATE}>
              Hugging Face model metadata, Llama 3.1 70B
            </Cite>
            , so its model state is {STATE_GB} GB before a single activation is stored. Divided by
            each instance&apos;s HBM, the accelerators times the per-accelerator GiB figure above:
          </Box>
          <FloorTable />
          <Box variant="p">
            The fraction is a floor. Activations, buffers and the 75% headroom target come on top
            (section 5), and every way of spreading state over more accelerators pays in collectives
            (section 8, Data Parallelism &amp; Sharding). On P5 the state alone needs{' '}
            {P5_NODES} instances, so every 70B layout on P5 splits it across EFA, by sharding (each
            rank keeping a slice) or by pipeline stages. On p5en, p6-b200, p6-b300 and trn2 the state alone fits one
            instance&apos;s HBM, and activations and the headroom target decide whether a layout does.
          </Box>
          <ExpandableSection headerText="The arithmetic behind the floor">
            <Box variant="p">
              <code>
                {int(P70)} x 16 bytes = {int(STATE_70B)} bytes = {STATE_GB} GB
              </code>
              . A p5.48xlarge has 8 x 80 GiB = 640 GiB = {fix(instanceHbmBytes(P5) / GB, 2)} GB, so{' '}
              <code>
                {STATE_GB} / {fix(instanceHbmBytes(P5) / GB, 1)} = {P5_NODES}
              </code>
              ; a trn2.48xlarge has 16 x 96 GiB = 1,536 GiB = {fix(instanceHbmBytes(TRN2) / GB, 2)} GB,
              so {TRN2_NODES}. The p6-b300 row uses 8 x 268 GiB, not the page&apos;s 2,148 total. With
              NVIDIA&apos;s 80 GB per H100, the smaller figure Calculator B takes, P5 needs{' '}
              {fix(STATE_70B / (8 * 80 * GB), 2)} instances. Our arithmetic on the cited inputs.
            </Box>
          </ExpandableSection>
          <Box variant="p">
            Take your instance&apos;s three numbers into the calculators. The dense peak at your
            training precision goes into Calculator A in section 4 for run time; the HBM per rank,{' '}
            {TRN2_RANK_GIB} GiB per logical core on trn2, into Calculator B in section 5 and Calculator
            C in section 14; and the domain size is the ceiling on TP in section 14&apos;s procedure,
            with the EFA per instance as the divisor for whatever crosses it. Section 22 (Capacity
            &amp; Cost) then prices the instance count you arrive at, starting from the {P5_NODES}{' '}
            p5.48xlarge that 70B&apos;s model state needs before anything else.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
