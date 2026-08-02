import type { DocRef } from '@tech-deep-dives/shared';

// ---------------------------------------------------------------------------
// Source references for the pricing section.
//
// Every On-Demand rate below was read out of the AWS Price List bulk API,
// publication version 20260728175247, under a strict filter:
//   TermType=OnDemand, Operating System=Linux, Tenancy=Shared,
//   CapacityStatus=Used, MarketOption=OnDemand, Pre Installed S/W=NA,
//   License Model=No License required.
// The MarketOption filter matters: the same SKU also carries a parallel
// MarketOption=CapacityBlock row priced at $0.0000000000.
// ---------------------------------------------------------------------------

export const PRICE_LIST_VIRGINIA: DocRef = {
  title: 'AWS Price List bulk API, Amazon EC2, us-east-1 (version 20260728175247)',
  url: 'https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/current/us-east-1/index.csv',
  tier: 1,
  accessed: '2026-08-01',
};

export const PRICE_LIST_OHIO: DocRef = {
  title: 'AWS Price List bulk API, Amazon EC2, us-east-2 (version 20260728175247)',
  url: 'https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/current/us-east-2/index.csv',
  tier: 1,
  accessed: '2026-08-01',
};

export const PRICE_LIST_ARCHIVE: DocRef = {
  title: 'AWS Price List bulk API, Amazon EC2 version index (120 archived monthly versions)',
  url: 'https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/index.json',
  tier: 1,
  accessed: '2026-08-01',
};

export const EFA_DOC: DocRef = {
  title: 'Amazon EC2 User Guide: Elastic Fabric Adapter for AI/ML and HPC workloads',
  url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html',
  tier: 1,
  accessed: '2026-08-01',
};

export const EFA_START_DOC: DocRef = {
  title: 'Amazon EC2 User Guide: Get started with EFA and MPI',
  url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start.html',
  tier: 1,
  accessed: '2026-08-01',
};

export const EFA_ACC_DOC: DocRef = {
  title: 'Amazon EC2 User Guide: Maximize network bandwidth on instances with multiple network cards',
  url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-acc-inst-types.html',
  tier: 1,
  accessed: '2026-08-01',
};

export const AC_DOC: DocRef = {
  title: 'Amazon EC2 instance types: accelerated computing specifications',
  url: 'https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html',
  tier: 1,
  accessed: '2026-08-01',
};

export const HPC_DOC: DocRef = {
  title: 'Amazon EC2 instance types: HPC specifications',
  url: 'https://docs.aws.amazon.com/ec2/latest/instancetypes/hpc.html',
  tier: 1,
  accessed: '2026-08-01',
};

export const CO_DOC: DocRef = {
  title: 'Amazon EC2 instance types: compute optimized specifications',
  url: 'https://docs.aws.amazon.com/ec2/latest/instancetypes/co.html',
  tier: 1,
  accessed: '2026-08-01',
};

export const GP_DOC: DocRef = {
  title: 'Amazon EC2 instance types: general purpose specifications',
  url: 'https://docs.aws.amazon.com/ec2/latest/instancetypes/gp.html',
  tier: 1,
  accessed: '2026-08-01',
};

export const CAPACITY_BLOCK_DOC: DocRef = {
  title: 'Amazon EC2 User Guide: how Capacity Blocks for ML work',
  url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/capacity-blocks-how.html',
  tier: 1,
  accessed: '2026-08-01',
};

export const CAPACITY_BLOCK_PRICING_DOC: DocRef = {
  title: 'Amazon EC2 Capacity Blocks for ML pricing page',
  url: 'https://aws.amazon.com/ec2/capacityblocks/pricing/',
  tier: 2,
  accessed: '2026-08-01',
};

export const WN_G7_DOC: DocRef = {
  title: "AWS What's New: Amazon EC2 G7 instances generally available (Jun 18, 2026)",
  url: 'https://aws.amazon.com/about-aws/whats-new/2026/06/amazon-ec2-g7-generally-available/',
  tier: 1,
  accessed: '2026-08-01',
};

export const WN_G7E_DOC: DocRef = {
  title: "AWS What's New: Amazon EC2 G7e instances generally available (Jan 20, 2026)",
  url: 'https://aws.amazon.com/about-aws/whats-new/2026/01/amazon-g7e-instances-generally-available/',
  tier: 1,
  accessed: '2026-08-01',
};

// ---------------------------------------------------------------------------
// Derived arithmetic. This is our division, not an AWS figure.
// Inputs are the two adjacent table columns, both of which carry their own
// citation, so a reader can redo the sum.
// ---------------------------------------------------------------------------

/** Exact price-list value, printed without introducing rounding. */
export function formatUsd(value: number): string {
  return `$${String(value)}`;
}

/** DERIVED: On-Demand rate divided by maximum EFA bandwidth. Never an AWS number. */
export function costPerGbps(usdPerHour: number, efaGbps: number): string {
  return `$${(usdPerHour / efaGbps).toFixed(4)}`;
}

export interface InstanceCost {
  type: string;
  /** us-east-1 Linux Shared-tenancy On-Demand, exact price-list value. */
  onDemandUsd: number;
  /** Maximum EFA bandwidth for the instance type, in Gbps. */
  efaGbps: number;
  /** Tier 1 document backing the bandwidth figure. */
  bandwidthDoc: DocRef;
  notes: string;
}

export const instanceCosts: InstanceCost[] = [
  { type: 'p6-b300.48xlarge', onDemandUsd: 142.416, efaGbps: 6400, bandwidthDoc: EFA_ACC_DOC, notes: '17 network cards, but card 0 carries only an ENA (Elastic Network Adapter) interface at 350 Gbps, so 16 cards carry EFA at 400 Gbps each.' },
  { type: 'p6-b200.48xlarge', onDemandUsd: 113.9328, efaGbps: 3200, bandwidthDoc: EFA_ACC_DOC, notes: '8 network cards, 400 Gbps EFA and 200 Gbps ENA each.' },
  { type: 'p5en.48xlarge', onDemandUsd: 63.296, efaGbps: 3200, bandwidthDoc: AC_DOC, notes: '16 network cards. Nitro v5, so EFA v3.' },
  { type: 'p5.48xlarge', onDemandUsd: 55.04, efaGbps: 3200, bandwidthDoc: AC_DOC, notes: '32 network cards. Up to 800 Gbps of the 3,200 is usable for IP traffic.' },
  { type: 'g7e.48xlarge', onDemandUsd: 33.14432, efaGbps: 1600, bandwidthDoc: WN_G7E_DOC, notes: 'Highest EFA bandwidth outside the P and Trn families. GA January 2026.' },
  { type: 'g7.48xlarge', onDemandUsd: 28.51328, efaGbps: 700, bandwidthDoc: WN_G7_DOC, notes: 'The GA announcement names us-east-2 and us-west-2, yet the us-east-1 price list already carries a rate.' },
  { type: 'p4de.24xlarge', onDemandUsd: 27.44705, efaGbps: 400, bandwidthDoc: AC_DOC, notes: '4 network cards at 100 Gbps. Nitro v3, so EFA v1, and RDMA (Remote Direct Memory Access) read only.' },
  { type: 'trn1n.32xlarge', onDemandUsd: 24.78, efaGbps: 1600, bandwidthDoc: AC_DOC, notes: '16 network cards at 100 Gbps. Nitro v4, so EFA v2.' },
  { type: 'p4d.24xlarge', onDemandUsd: 21.957642, efaGbps: 400, bandwidthDoc: AC_DOC, notes: '4 network cards at 100 Gbps. EFA traffic between P4d and other instance families is not supported.' },
  { type: 'trn1.32xlarge', onDemandUsd: 21.5, efaGbps: 800, bandwidthDoc: AC_DOC, notes: '8 network cards at 100 Gbps, so half the EFA bandwidth of trn1n at a similar instance rate.' },
  { type: 'm8gn.48xlarge', onDemandUsd: 13.968, efaGbps: 600, bandwidthDoc: GP_DOC, notes: '2 network cards. Highest EFA bandwidth available without an accelerator.' },
  { type: 'c8gn.48xlarge', onDemandUsd: 11.376, efaGbps: 600, bandwidthDoc: CO_DOC, notes: '2 network cards. The cheapest route to 600 Gbps of EFA.' },
  { type: 'c8i.48xlarge', onDemandUsd: 8.99616, efaGbps: 75, bandwidthDoc: CO_DOC, notes: '1 network card. EFA switches on only at 48xlarge in this family, and the ladder runs 50, 75, then 100 Gbps.' },
  { type: 'c6in.32xlarge', onDemandUsd: 7.2576, efaGbps: 200, bandwidthDoc: CO_DOC, notes: '2 network cards. Nitro v4, so EFA v2.' },
  { type: 'p5.4xlarge', onDemandUsd: 6.88, efaGbps: 100, bandwidthDoc: AC_DOC, notes: 'Single H100, single network card. EFA without GPUDirect RDMA.' },
  { type: 'c7gn.16xlarge', onDemandUsd: 3.9936, efaGbps: 200, bandwidthDoc: CO_DOC, notes: 'Nitro v5, so EFA v3, but RDMA write is not supported on this type.' },
  { type: 'c5n.18xlarge', onDemandUsd: 3.888, efaGbps: 100, bandwidthDoc: CO_DOC, notes: 'The original EFA instance. Nitro v3, EFA v1, no RDMA.' },
];

export interface HpcCost {
  type: string;
  region: string;
  regionDoc: DocRef;
  onDemandUsd: number;
  efaGbps: number;
  notes: string;
}

// Every HPC family carries Spot support = No in the EC2 HPC specifications table.
export const hpcCosts: HpcCost[] = [
  { type: 'hpc8a.96xlarge', region: 'us-east-2', regionDoc: PRICE_LIST_OHIO, onDemandUsd: 7.92, efaGbps: 300, notes: '192 cores, AMD EPYC 9R45. Nitro v6, so EFA v4.' },
  { type: 'hpc7a.96xlarge', region: 'us-east-2', regionDoc: PRICE_LIST_OHIO, onDemandUsd: 7.2, efaGbps: 300, notes: 'The 12xlarge, 24xlarge, 48xlarge and 96xlarge sizes all price identically at $7.20. Needs at least 2 network interfaces on separate cards, since each caps at 150 Gbps.' },
  { type: 'hpc6id.32xlarge', region: 'us-east-2', regionDoc: PRICE_LIST_OHIO, onDemandUsd: 5.7, efaGbps: 200, notes: 'Needs at least 2 network interfaces, since each caps at 170 Gbps.' },
  { type: 'hpc6a.48xlarge', region: 'us-east-2', regionDoc: PRICE_LIST_OHIO, onDemandUsd: 2.88, efaGbps: 100, notes: '1 network card at 100 Gbps. Nitro v4, so EFA v2.' },
  { type: 'hpc7g.16xlarge', region: 'us-east-1', regionDoc: PRICE_LIST_VIRGINIA, onDemandUsd: 1.6832, efaGbps: 200, notes: 'Graviton3E. The only HPC family with a us-east-1 rate. RDMA write is not supported.' },
];

export interface PriceHistoryRow {
  version: string;
  effective: string;
  p5: string;
  p4d: string;
}

// Archived monthly price-list versions, identical strict filter applied to each.
export const priceHistory: PriceHistoryRow[] = [
  { version: '20250203145209', effective: 'January 2025', p5: '$98.32', p4d: '$32.7726' },
  { version: '20250529210942', effective: 'May 2025', p5: '$98.32', p4d: '$32.7726' },
  { version: '20250703204906', effective: 'June 2025', p5: '$55.04', p4d: '$21.957642' },
  { version: '20260326154455', effective: 'March 2026', p5: '$55.04', p4d: '$21.957642' },
  { version: '20260728175247', effective: 'July 2026', p5: '$55.04', p4d: '$21.957642' },
];

export interface CapacityBlockRate {
  item: string;
  regions: string;
  hourly: string;
}

// Tier 2. These come from the Capacity Blocks product pricing page, not from
// the Price List bulk API. The page itself states: "The current prices are
// scheduled to be updated next in October, 2026."
export const capacityBlockRates: CapacityBlockRate[] = [
  { item: 'u-p6e-gb200x72 UltraServer (72 GPUs)', regions: 'US East (Dallas) Local Zone', hourly: '$761.904' },
  { item: 'p6-b300.48xlarge', regions: 'us-east-1, us-west-2, US East (Atlanta) Local Zone', hourly: '$112.32' },
  { item: 'p6-b200.48xlarge', regions: 'US East regions, us-west-2, ap-south-1', hourly: '$98.84' },
  { item: 'p5en.48xlarge', regions: 'US regions', hourly: '$54.920' },
  { item: 'p5.48xlarge', regions: 'US regions', hourly: '$41.528' },
  { item: 'trn2.48xlarge', regions: 'as listed on the pricing page', hourly: '$35.7608' },
  { item: 'trn1.32xlarge', regions: 'as listed on the pricing page', hourly: '$9.532' },
];
