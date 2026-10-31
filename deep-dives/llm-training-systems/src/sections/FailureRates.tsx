import { useRef } from 'react';
import type { CSSProperties } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { Cite, arxiv, gh, METASEQ_SHA } from '../components/Cite';
import { useNarrow } from '../components/useNarrow';
import { FAILURE_RATES } from '../lib/presets';
import { jobMttfSeconds } from '../lib/checkpoint';

/* ------------------------------------------------------------------------ */
/* Sources                                                                  */
/* ------------------------------------------------------------------------ */

/** The Llama 3 Herd of Models: Sec 3.3.1 (up to 16K H100, eight per server), Table 4, Sec 3.3.4 and Table 5. */
const LLAMA3 = arxiv('2407.21783v3');
const LLAMA3_V1 = arxiv('2407.21783v1');
const LLAMA3_V2 = arxiv('2407.21783v2');
/** Revisiting Reliability in Large-Scale Machine Learning Research Clusters (FAIR at Meta). */
const META_REL = arxiv('2410.21680v2');
/** MegaScale: Scaling Large Language Model Training to More Than 10,000 GPUs (NSDI 2024). */
const MEGASCALE = arxiv('2402.15627v1');
/** OPT-175B training chronicles in metaseq at the repository commit read. */
const OPT_FINAL = gh('facebookresearch/metaseq', METASEQ_SHA, 'projects/OPT/chronicles/final_update.md');
const OPT_27 = gh('facebookresearch/metaseq', METASEQ_SHA, 'projects/OPT/chronicles/27_percent_update.md');
/** AWS SageMaker HyperPod product and features pages (vendor claims). */
const HYPERPOD = 'https://aws.amazon.com/sagemaker/ai/hyperpod/';
const HYPERPOD_FEATURES = 'https://aws.amazon.com/sagemaker/ai/hyperpod/features/';
/** EC2 accelerated computing instance specifications (p5.48xlarge: 8 x H100). */
const EC2_AC = 'https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html';

/* ------------------------------------------------------------------------ */
/* Numbers: every MTTF on the page comes from the checkpoint calculator     */
/* ------------------------------------------------------------------------ */

const GPUS_PER_NODE = 8;
const HOUR = 3_600;

/** Llama 3 405B, Sec 3.3.4: 466 interruptions in a 54-day snapshot, 47 planned and 419 unexpected. */
const LLAMA3_DAYS = 54;
const LLAMA3_TOTAL = 466;
const LLAMA3_PLANNED = 47;
const LLAMA3_UNEXPECTED = 419;
/** Our arithmetic from the paper's counts: 1,296 hours over 419 interruptions. */
const LLAMA3_INTERVAL_H = (LLAMA3_DAYS * 24) / LLAMA3_UNEXPECTED;
const LLAMA3_PER_DAY = LLAMA3_UNEXPECTED / LLAMA3_DAYS;
/** Per thousand node-days if 2,048 or 1,024 eight-GPU servers ran for the whole window (T04-4). */
const llama3NodeRate = (nodes: number) => (LLAMA3_UNEXPECTED / (nodes * LLAMA3_DAYS)) * 1_000;

interface RateLine {
  key: 'rsc2' | 'rsc1' | 'worst';
  rate: number;
  short: string;
  name: string;
  color: string;
}

const RATE_LINES: RateLine[] = [
  { key: 'rsc2', rate: FAILURE_RATES.rsc2.value, short: '2.34', name: 'Meta RSC-2', color: '#037f0c' },
  { key: 'rsc1', rate: FAILURE_RATES.rsc1.value, short: '6.50', name: 'Meta RSC-1', color: '#0972d3' },
  { key: 'worst', rate: FAILURE_RATES.rsc1WorstMonth.value, short: '17.5', name: 'RSC-1\'s worst month', color: '#ec7211' },
];

const mttfHours = (nodes: number, rate: number) => jobMttfSeconds(nodes, rate) / HOUR;

function sig(v: number): string {
  return v >= 10 ? Math.round(v).toLocaleString('en-US') : v.toFixed(1);
}

/** Long form for prose and the table: minutes under an hour, hours under a day, then days. */
function formatInterval(hours: number): string {
  if (hours < 1) return `${Math.round(hours * 60)} minutes`;
  if (hours < 24) return `${sig(hours)} hours`;
  return `${sig(hours / 24)} days`;
}

/** Short form for the diagram. */
function formatShort(hours: number): string {
  if (hours < 1) return `${Math.round(hours * 60)} min`;
  if (hours < 24) return `${sig(hours)} h`;
  return `${sig(hours / 24)} days`;
}

/** "1.8 to 13 days" when both ends share a unit, else "40 minutes to 5.0 hours". */
function formatRange(low: number, high: number): string {
  const a = formatInterval(low);
  const b = formatInterval(high);
  const unitA = a.split(' ')[1];
  const unitB = b.split(' ')[1];
  return unitA === unitB ? `${a.split(' ')[0]} to ${b}` : `${a} to ${b}`;
}

/** The low and high ends of a node count's interval across Meta's three rates. */
function intervalRange(nodes: number) {
  const values = RATE_LINES.map((r) => mttfHours(nodes, r.rate));
  return { low: Math.min(...values), high: Math.max(...values) };
}

const REF_NODES = 32; // 256 GPUs, 32 p5.48xlarge: the dive's reference job
const BIG_NODES = 2_048; // 16,384 GPUs
const REF = intervalRange(REF_NODES);
const BIG = intervalRange(BIG_NODES);
/** Meta's projection for 16,384 GPUs at RSC-1's rate, reproduced by the formula. */
const BIG_RSC1_H = mttfHours(BIG_NODES, FAILURE_RATES.rsc1.value);
/** The model at 1,024 GPUs (128 nodes) at the worst-month rate, against Meta's measured 7.9 hours. */
const K1_WORST_H = mttfHours(128, FAILURE_RATES.rsc1WorstMonth.value);
/** One node's interval at RSC-1 and RSC-2. */
const ONE_NODE_RSC1_D = mttfHours(1, FAILURE_RATES.rsc1.value) / 24;
const ONE_NODE_RSC2_D = mttfHours(1, FAILURE_RATES.rsc2.value) / 24;
const BIG_RSC2_H = mttfHours(BIG_NODES, FAILURE_RATES.rsc2.value);

/* ------------------------------------------------------------------------ */
/* Diagram: job MTTF against job size, log axes, one line per measured rate */
/* ------------------------------------------------------------------------ */

const FONT = 'sans-serif';
const INK = '#16191f';
const MUTED = '#414d5c';
const GRID = '#e9ebed';
const GUIDE = '#879596';
const PURPLE = '#6f4cc4';

const X_TICKS = [8, 64, 256, 1_024, 4_096, 16_384];
const Y_TICKS = [
  { h: 1, t: '1 hour' },
  { h: 24, t: '1 day' },
  { h: 168, t: '1 week' },
  { h: 720, t: '1 month' },
  { h: 8_760, t: '1 year' },
];
const Y_MIN_H = 0.4;
const Y_MAX_H = 16_000;
const LINE_NODES = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1_024, 2_048];

function MttfChart() {
  const ref = useRef<HTMLDivElement>(null);
  const narrow = useNarrow(ref);

  const W = narrow ? 400 : 900;
  const x0 = narrow ? 56 : 92;
  const x1 = narrow ? 388 : 860;
  const top = narrow ? 132 : 104;
  const bottom = narrow ? 392 : 404;
  const H = bottom + (narrow ? 44 : 64);

  const lx0 = Math.log2(GPUS_PER_NODE);
  const lx1 = Math.log2(BIG_NODES * GPUS_PER_NODE);
  const ly0 = Math.log10(Y_MIN_H);
  const ly1 = Math.log10(Y_MAX_H);
  const sx = (gpus: number) => x0 + ((Math.log2(gpus) - lx0) / (lx1 - lx0)) * (x1 - x0);
  const sy = (hours: number) => bottom - ((Math.log10(hours) - ly0) / (ly1 - ly0)) * (bottom - top);

  const xRef = sx(REF_NODES * GPUS_PER_NODE);
  const xBig = sx(BIG_NODES * GPUS_PER_NODE);

  const refBox = narrow
    ? { w: 104, l1: '256 GPUs', l2: `${formatShort(REF.low).replace(' days', '')} to ${formatShort(REF.high)}` }
    : { w: 252, l1: '256 GPUs, 32 p5.48xlarge', l2: `one interruption every ${formatShort(REF.low).replace(' days', '')} to ${formatShort(REF.high)}` };
  const bigBox = narrow
    ? { w: 108, l1: '16,384 GPUs', l2: `${formatShort(BIG.low)} to ${formatShort(BIG.high)}` }
    : { w: 252, l1: '16,384 GPUs, 2,048 nodes', l2: `one interruption every ${formatShort(BIG.low)} to ${formatShort(BIG.high)}` };
  const boxTop = top + (narrow ? 6 : 8);
  const boxH = 42;
  const refBoxX = xRef - refBox.w / 2;
  const bigBoxX = x1 - bigBox.w;

  const legendItems = RATE_LINES.map((r) => ({ ...r, text: narrow ? `${r.short}: ${r.name}` : `${r.short}, ${r.name}` }));
  const llamaText = narrow
    ? `Llama 3 405B: ${LLAMA3_INTERVAL_H.toFixed(1)} h, up to 16K GPUs`
    : `Llama 3 405B: one unexpected interruption every ${LLAMA3_INTERVAL_H.toFixed(1)} h over ${LLAMA3_DAYS} days, on up to 16K GPUs`;

  // Wide legend: one row of rates after a lead-in, then the Llama 3 row. Narrow: one item per row.
  const wideRateX = [270, 430, 590];
  const legendY0 = narrow ? 54 : 62;
  const legendStep = narrow ? 16 : 20;

  const titleText = 'A job\'s MTTF divides by its node count';
  const subText = narrow
    ? '1 / (nodes x r_f), 8 GPUs per node, log axes'
    : 'MTTF = 1 / (nodes x r_f), 8 GPUs per node; both axes logarithmic';

  const titleSentence =
    `Job mean time to failure against job size on logarithmic axes, from 8 GPUs (one node) to 16,384 GPUs ` +
    `(2,048 nodes), for Meta's three measured failure rates. Each line halves for every doubling of nodes. ` +
    `At 256 GPUs, 32 p5.48xlarge, the interval is ${formatInterval(mttfHours(REF_NODES, RATE_LINES[2].rate))} at 17.5 failures per thousand node-days, ` +
    `${formatInterval(mttfHours(REF_NODES, RATE_LINES[1].rate))} at 6.50 and ${formatInterval(mttfHours(REF_NODES, RATE_LINES[0].rate))} at 2.34. ` +
    `At 16,384 GPUs it is ${formatInterval(mttfHours(BIG_NODES, RATE_LINES[2].rate))}, ${formatInterval(mttfHours(BIG_NODES, RATE_LINES[1].rate))} ` +
    `and ${formatInterval(mttfHours(BIG_NODES, RATE_LINES[0].rate))}. Llama 3 405B's one unexpected interruption every ` +
    `${LLAMA3_INTERVAL_H.toFixed(1)} hours, over a 54-day window on up to 16K GPUs, sits between the lines.`;

  return (
    <div ref={ref}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-labelledby="failures-mttf-title"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      >
        <title id="failures-mttf-title">{titleSentence}</title>
        <rect x={0} y={0} width={W} height={H} rx={8} fill="#ffffff" />

        <text x={narrow ? 12 : x0} y={narrow ? 20 : 22} fontFamily={FONT} fontSize={13} fontWeight={600} fill={INK}>
          {titleText}
        </text>
        <text x={narrow ? 12 : x0} y={narrow ? 36 : 40} fontFamily={FONT} fontSize={11} fill={MUTED}>
          {subText}
        </text>

        {/* Legend */}
        {narrow ? (
          <g>
            <text x={12} y={legendY0} fontFamily={FONT} fontSize={11} fontWeight={600} fill={MUTED}>
              Failures per 1,000 node-days:
            </text>
            {legendItems.map((r, i) => {
              const y = legendY0 + legendStep * (i + 1);
              return (
                <g key={r.key}>
                  <line x1={12} y1={y - 4} x2={36} y2={y - 4} stroke={r.color} strokeWidth={2.5} />
                  <text x={42} y={y} fontFamily={FONT} fontSize={11} fill={INK}>
                    {r.text}
                  </text>
                </g>
              );
            })}
            <line
              x1={12}
              y1={legendY0 + legendStep * 4 - 4}
              x2={36}
              y2={legendY0 + legendStep * 4 - 4}
              stroke={PURPLE}
              strokeWidth={3}
              strokeDasharray="5 3"
            />
            <text x={42} y={legendY0 + legendStep * 4} fontFamily={FONT} fontSize={11} fill={INK}>
              {llamaText}
            </text>
          </g>
        ) : (
          <g>
            <text x={x0} y={legendY0} fontFamily={FONT} fontSize={11} fontWeight={600} fill={MUTED}>
              Failures per 1,000 node-days:
            </text>
            {legendItems.map((r, i) => (
              <g key={r.key}>
                <line x1={wideRateX[i]} y1={legendY0 - 4} x2={wideRateX[i] + 24} y2={legendY0 - 4} stroke={r.color} strokeWidth={2.5} />
                <text x={wideRateX[i] + 30} y={legendY0} fontFamily={FONT} fontSize={11} fill={INK}>
                  {r.text}
                </text>
              </g>
            ))}
            <line
              x1={x0}
              y1={legendY0 + legendStep - 4}
              x2={x0 + 24}
              y2={legendY0 + legendStep - 4}
              stroke={PURPLE}
              strokeWidth={3}
              strokeDasharray="5 3"
            />
            <text x={x0 + 30} y={legendY0 + legendStep} fontFamily={FONT} fontSize={11} fill={INK}>
              {llamaText}
            </text>
          </g>
        )}

        {/* Grid and axes */}
        {Y_TICKS.map((t) => (
          <g key={t.t}>
            <line x1={x0} y1={sy(t.h)} x2={x1} y2={sy(t.h)} stroke={GRID} strokeWidth={1} />
            <text x={x0 - 8} y={sy(t.h) + 4} fontFamily={FONT} fontSize={11} fill={MUTED} textAnchor="end">
              {t.t}
            </text>
          </g>
        ))}
        {X_TICKS.map((g) => (
          <line key={`gx-${g}`} x1={sx(g)} y1={top} x2={sx(g)} y2={bottom} stroke={GRID} strokeWidth={1} />
        ))}
        <line x1={x0} y1={bottom} x2={x1} y2={bottom} stroke={MUTED} strokeWidth={1} />
        <line x1={x0} y1={top} x2={x0} y2={bottom} stroke={MUTED} strokeWidth={1} />
        {X_TICKS.map((g) => (
          <g key={`xt-${g}`}>
            <line x1={sx(g)} y1={bottom} x2={sx(g)} y2={bottom + 4} stroke={MUTED} strokeWidth={1} />
            <text x={sx(g)} y={bottom + 17} fontFamily={FONT} fontSize={11} fill={INK} textAnchor="middle">
              {narrow && g >= 1_024 ? `${g / 1_024}K` : g.toLocaleString('en-US')}
            </text>
            {!narrow && (
              <text x={sx(g)} y={bottom + 32} fontFamily={FONT} fontSize={11} fill={MUTED} textAnchor="middle">
                {(g / GPUS_PER_NODE).toLocaleString('en-US')}
              </text>
            )}
          </g>
        ))}
        {narrow ? (
          <text x={(x0 + x1) / 2} y={bottom + 34} fontFamily={FONT} fontSize={11} fill={MUTED} textAnchor="middle">
            GPUs in the job, 8 per node
          </text>
        ) : (
          <>
            <text x={x0 - 8} y={bottom + 17} fontFamily={FONT} fontSize={11} fontWeight={600} fill={MUTED} textAnchor="end">
              GPUs
            </text>
            <text x={x0 - 8} y={bottom + 32} fontFamily={FONT} fontSize={11} fontWeight={600} fill={MUTED} textAnchor="end">
              nodes
            </text>
            <text x={(x0 + x1) / 2} y={bottom + 52} fontFamily={FONT} fontSize={11} fill={MUTED} textAnchor="middle">
              Job size, 8 GPUs per node
            </text>
          </>
        )}

        {/* Guides from the callouts to the axis */}
        <line x1={xRef} y1={boxTop + boxH} x2={xRef} y2={bottom} stroke={GUIDE} strokeWidth={1.2} strokeDasharray="4 3" />
        <line x1={xBig} y1={boxTop + boxH} x2={xBig} y2={bottom} stroke={GUIDE} strokeWidth={1.2} strokeDasharray="4 3" />

        {/* One line per measured rate */}
        {RATE_LINES.map((r) => (
          <polyline
            key={r.key}
            points={LINE_NODES.map((n) => `${sx(n * GPUS_PER_NODE)},${sy(mttfHours(n, r.rate))}`).join(' ')}
            fill="none"
            stroke={r.color}
            strokeWidth={2.5}
          />
        ))}

        {/* Llama 3 405B: 3.1 h, drawn across its 8,192- and 16,384-GPU stages */}
        <line
          x1={sx(8_192)}
          y1={sy(LLAMA3_INTERVAL_H)}
          x2={xBig}
          y2={sy(LLAMA3_INTERVAL_H)}
          stroke={PURPLE}
          strokeWidth={3}
          strokeDasharray="5 3"
        />

        {/* The two marked job sizes */}
        {[REF_NODES, BIG_NODES].map((n) =>
          RATE_LINES.map((r) => (
            <circle
              key={`${n}-${r.key}`}
              cx={sx(n * GPUS_PER_NODE)}
              cy={sy(mttfHours(n, r.rate))}
              r={4.5}
              fill={r.color}
              stroke="#ffffff"
              strokeWidth={1.5}
            />
          )),
        )}

        {/* Callouts */}
        {[
          { x: refBoxX, box: refBox },
          { x: bigBoxX, box: bigBox },
        ].map(({ x, box }) => (
          <g key={box.l1}>
            <rect x={x} y={boxTop} width={box.w} height={boxH} rx={4} fill="#f2f8fd" stroke="#0972d3" strokeWidth={1.2} />
            <text x={x + box.w / 2} y={boxTop + 17} fontFamily={FONT} fontSize={13} fontWeight={600} fill={INK} textAnchor="middle">
              {box.l1}
            </text>
            <text x={x + box.w / 2} y={boxTop + 33} fontFamily={FONT} fontSize={11} fill={MUTED} textAnchor="middle">
              {box.l2}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Table: node count across Meta's three rates                              */
/* ------------------------------------------------------------------------ */

const cell: CSSProperties = {
  padding: '6px 8px',
  borderBottom: '1px solid #e9ebed',
  textAlign: 'left',
  verticalAlign: 'top',
};
const headCell: CSSProperties = { ...cell, fontWeight: 700, borderBottom: '2px solid #d1d5db' };

const TABLE_NODES = [1, 4, 32, 128, 1_024, 2_048];

function MttfTable() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={headCell}>Job size</th>
            <th style={headCell}>RSC-2, 2.34</th>
            <th style={headCell}>RSC-1, 6.50</th>
            <th style={headCell}>Worst month, 17.5</th>
          </tr>
        </thead>
        <tbody>
          {TABLE_NODES.map((n) => {
            const bold = n === REF_NODES || n === BIG_NODES;
            const gpus = `${(n * GPUS_PER_NODE).toLocaleString('en-US')} GPUs`;
            const nodes = `${n.toLocaleString('en-US')} ${n === 1 ? 'node' : 'nodes'}`;
            return (
              <tr key={n}>
                <td style={cell}>
                  {bold ? <strong>{gpus}</strong> : gpus}
                  <Box variant="small" display="block" color="text-body-secondary">
                    {nodes}
                  </Box>
                </td>
                {RATE_LINES.map((r) => {
                  const v = formatInterval(mttfHours(n, r.rate));
                  return (
                    <td key={r.key} style={cell}>
                      {bold ? <strong>{v}</strong> : v}
                    </td>
                  );
                })}
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

export function FailureRates() {
  const interval = LLAMA3_INTERVAL_H.toFixed(1);
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description={`Predict how often your job will stop from its node count, before you design anything to survive it: the interval between failures divides by the number of nodes, and Llama 3 405B, on up to 16K GPUs, saw one unexpected interruption every ${interval} hours (papers, operator notes and AWS pages, sources read 2026-10-31)`}
          >
            17. Failure Is the Steady State
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A large training job is synchronous: every step waits for the gradients of every GPU, so
            when one node stops, the whole job stops and restarts from its last checkpoint, the saved
            copy of its weights and optimizer state. At the failure rates Meta measured on its research
            clusters, one 8-GPU node runs {sig(ONE_NODE_RSC1_D)} to {sig(ONE_NODE_RSC2_D)} days between
            failures, and a job on 2,048 such nodes runs {formatRange(BIG_RSC1_H, BIG_RSC2_H)}, our
            arithmetic from Meta&apos;s rates. The challenge is to put a
            number on that interval for your own job, because checkpoints, restarts and node screening
            are all designed against it.
          </Box>
          <Box variant="p">
            The largest public report sets the scale. Llama 3 405B, trained on up to 16K GPUs, saw one
            unexpected interruption every {interval} hours over a 54-day window of pre-training, and still
            spent more than 90% of its time training{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint">
              Llama 3 Herd of Models, Sections 3.3.1 and 3.3.4
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Turn a per-node failure rate into your job's interruption interval with one division, and see why the interval shrinks in proportion to the node count"
          >
            A synchronous job fails when any node fails
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A synchronous job behaves as a series system: it runs only while every node runs, so its
            failure rate is the sum of its nodes&apos; rates. With <code>r_f</code> the failures per
            node-day and <code>N_nodes</code> the job&apos;s node count, the job&apos;s mean time to failure (MTTF), the average
            interval between interruptions, is <code>MTTF = 1 / (N_nodes x r_f)</code>{' '}
            <Cite tier={3} href={META_REL} venue="preprint">
              Revisiting Reliability in Large-Scale ML Research Clusters, Section III
            </Cite>
            . Double the nodes and the interval halves. The formula has no term for the model, the
            framework or the parallel layout: only the node count and the rate per node.
          </Box>
          <Box variant="p">
            Meta measured the rate on two research clusters of 8-GPU A100 servers: RSC-1, 16K GPUs of
            general ML work, and RSC-2, 8K GPUs focused on vision, over 11 months, 4 million jobs and more
            than 150 million GPU-hours{' '}
            <Cite tier={3} href={META_REL} venue="preprint">
              Revisiting Reliability, Abstract and Section II
            </Cite>
            . RSC-1 ran at 6.50 failures per thousand node-days and RSC-2 at 2.34, and RSC-1&apos;s rate
            moved between about 2.5 and about 17.5 within a year as failure modes came and went{' '}
            <Cite tier={3} href={META_REL} venue="preprint">
              Revisiting Reliability, Sections II-E and III
            </Cite>
            . The measured job MTTF fell from 47.7 days for 8-GPU jobs to 7.9 hours for 1,024-GPU jobs,
            and at RSC-1&apos;s rate the formula projects {BIG_RSC1_H.toFixed(1)} hours for a 16,384-GPU
            job{' '}
            <Cite tier={3} href={META_REL} venue="preprint">
              Revisiting Reliability, Section III and Figure 7
            </Cite>
            .
          </Box>
          <MttfChart />
          <Box variant="small" color="text-body-secondary">
            Computed from <code>MTTF = 1 / (N_nodes x r_f)</code> at Meta&apos;s three rates with 8 GPUs per
            node, the same function as the dive&apos;s checkpoint calculator in section 18; the 6.50 line
            reproduces Meta&apos;s own {BIG_RSC1_H.toFixed(1)}-hour projection at 16,384 GPUs. Llama 3&apos;s
            segment spans the 8,192- and 16,384-GPU stages of its pre-training{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint">
              Llama 3 Herd of Models, Table 4
            </Cite>
            , because the paper does not state the GPU count during the 54-day window.
          </Box>
          <Box variant="p">
            Read the slope as the lesson. Every tenfold increase in job size divides the interval by
            ten. The rate per node never changes along a line; only the multiplier does, which is why
            the same hardware that a one-node job barely notices stops a 2,048-node job several times a
            day. The rates are Meta&apos;s, measured on A100 servers; they
            are the measured inputs this dive has, and a fleet of newer instances has its own rate, our
            reading.
          </Box>
          <ExpandableSection headerText="How Meta counts a failure, and why the chart is an order-of-magnitude aid">
            <SpaceBetween size="s">
              <Box variant="p">
                <code>r_f</code> counts, among jobs using more than 128 GPUs, those assigned a{' '}
                <code>NODE_FAIL</code> status plus <code>FAILED</code> jobs with a critical health check firing in the last 10 minutes of the job (or 5
                minutes after it ended), divided by the node-days of runtime{' '}
                <Cite tier={3} href={META_REL} venue="preprint">
                  Revisiting Reliability, Section III, &quot;Comparing to actual job runs&quot;
                </Cite>
                . The measured job MTTF is per job-size bucket, and the paper introduces it with failures
                that stem from &quot;user programs to system software to hardware faults&quot;{' '}
                <Cite tier={3} href={META_REL} venue="preprint">
                  Revisiting Reliability, Section III, &quot;MTTF Decreases at Scale&quot;
                </Cite>
                .
              </Box>
              <Box variant="p">
                The two measures do not line up exactly. Meta&apos;s measured 7.9 hours for 1,024-GPU jobs
                is shorter than the formula gives at that size even at the worst-month rate,{' '}
                {K1_WORST_H.toFixed(1)} hours, and the paper does not reconcile the two; our reading is that
                the measured figure counts more kinds of failure. Use the lines to size an interval to the
                nearest order of magnitude.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Calibrate the model against runs that published their interruptions: at up to 16K GPUs, one every few hours, mostly hardware, almost all of it recovered by automation"
          >
            What large runs reported
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Llama 3 405B is the most detailed public report. During a {LLAMA3_DAYS}-day snapshot of
            pre-training the job was interrupted {LLAMA3_TOTAL} times: {LLAMA3_PLANNED} planned, for
            automated maintenance such as firmware upgrades or for operator changes to configuration or
            datasets, and {LLAMA3_UNEXPECTED} unexpected{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint">
              Llama 3 Herd of Models, Section 3.3.4
            </Cite>
            . That is one unexpected interruption every {interval} hours, about {LLAMA3_PER_DAY.toFixed(1)}{' '}
            a day, our arithmetic from the paper&apos;s counts. Significant manual intervention was needed
            only three times in the window; automation handled the rest{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint">
              Llama 3 Herd of Models, Section 3.3.4
            </Cite>
            .
          </Box>
          <Box variant="p">
            About 78% of the unexpected interruptions were attributed to confirmed or suspected hardware
            issues. By count the largest causes were faulty GPUs (148), GPU high-bandwidth memory, HBM3
            (72), software bugs (54), network switches and cables (35) and unplanned host maintenance
            (32), and the GPU rows add up to 268 of the 419, 64% by count{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint">
              Llama 3 Herd of Models, Section 3.3.4 and Table 5
            </Cite>
            . The GPU and its memory are where most interruptions start, so the node checks that exercise
            them cover the largest share, our reading of the table.
          </Box>
          <Box variant="p">
            The report agrees with Meta&apos;s cluster rates. If all 16,384 GPUs, 2,048 servers of eight,
            ran for the whole window, {LLAMA3_UNEXPECTED} interruptions are about{' '}
            {llama3NodeRate(2_048).toFixed(1)} per thousand node-days, inside the range of the research
            clusters; at 8,192 GPUs the rate would be {llama3NodeRate(1_024).toFixed(1)}, a little above
            RSC-1&apos;s 6.50. The paper does not state the GPU count during the window, and its count
            includes interruptions of every cause, so treat this as a consistency check (our arithmetic).
          </Box>
          <ExpandableSection headerText="Other operator reports, one figure each">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>OPT-175B.</strong> The team&apos;s notes cover about 90 restarts over the course of
                training the final model&apos;s lineage{' '}
                <Cite tier={2} href={OPT_FINAL}>
                  metaseq OPT chronicles, final_update.md line 24
                </Cite>
                . At the 27% mark they put most of the 40-plus restarts since mid-November down to
                hardware failures, replacement through the cloud interface could take hours and often
                returned the same bad machine, and restarts stalled when downloads of the 1.6 TB
                checkpoint from the blob store hung{' '}
                <Cite tier={2} href={OPT_27}>
                  metaseq OPT chronicles, 27_percent_update.md lines 6, 12 and 19
                </Cite>
                .
              </Box>
              <Box variant="p">
                <strong>MegaScale.</strong> ByteDance&apos;s production run on more than 10,000 GPUs
                restarted over 100 times in several weeks, and over 90% of the software and hardware
                faults were identified and fixed automatically{' '}
                <Cite tier={3} href={MEGASCALE} venue="NSDI 2024">
                  MegaScale, Sections 6.2 and 6.3
                </Cite>
                .
              </Box>
              <Box variant="p">
                <strong>Meta&apos;s research clusters.</strong> Hardware failures touched under 1% of jobs
                but 19% of GPU runtime. Removing 40 lemon nodes, nodes that fail repeatedly, found from
                their health-check and job history (24 on RSC-1, 1.2% of that cluster, and 16 on RSC-2,
                1.7%), cut the failure rate of jobs on 512 or more GPUs from 14% to 4%{' '}
                <Cite tier={3} href={META_REL} venue="preprint">
                  Revisiting Reliability, Sections II-E and IV-A
                </Cite>
                .
              </Box>
              <Box variant="p">
                <strong>Quoting Llama 3&apos;s Table 5.</strong> Its first row is internally inconsistent
                in every arXiv version: the count, 148, agrees with the 419 total, while its printed 30.1%
                does not (148 of 419 is 35.3%), and the text&apos;s 58.7% GPU share is the sum of the
                printed percentages{' '}
                <Cite tier={3} href={LLAMA3_V1} venue="preprint">
                  Llama 3 Herd of Models v1, Table 5
                </Cite>{' '}
                <Cite tier={3} href={LLAMA3_V2} venue="preprint">
                  v2, Table 5
                </Cite>{' '}
                <Cite tier={3} href={LLAMA3} venue="preprint">
                  v3, Table 5
                </Cite>
                . This page quotes counts.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Judge any goodput figure by who measured it and under what conditions: about 90% is what heavily automated operators report at 10K to 16K GPUs"
          >
            Goodput at that failure rate
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Effective training time ratio (ETTR) is the productive runtime of a job run over its
            wallclock time, and it is the goodput measure this dive uses{' '}
            <Cite tier={3} href={META_REL} venue="preprint">
              Revisiting Reliability, Section II-D
            </Cite>
            . Meta splits the wallclock into time in the queue, productive runtime and unproductive
            runtime, and names three sources of the unproductive part: re-training the steps since the
            last checkpoint, the restart overhead, and the time checkpointing adds{' '}
            <Cite tier={3} href={META_REL} venue="preprint">
              Revisiting Reliability, Sections II-D and III
            </Cite>
            . On a reservation the job holds for its whole run the queue term drops out, our reading.
            Failures set how often the first two are paid; section 18, Checkpointing, sets the interval
            that balances them against the third.
          </Box>
          <Box variant="p">
            About 90% is what heavily automated operators report at 10K to 16K GPUs. Llama 3 achieved
            higher than 90% effective training time{' '}
            <Cite tier={3} href={LLAMA3} venue="preprint">
              Llama 3 Herd of Models, Section 3.3.4
            </Cite>
            . MegaScale kept over 90% on more than 10,000 GPUs: detecting a failure and running
            diagnostic tests took under 10 minutes on average, and the job caught up to its pre-crash
            progress within 15 minutes of the latest checkpoint{' '}
            <Cite tier={3} href={MEGASCALE} venue="NSDI 2024">
              MegaScale, Section 6.2
            </Cite>
            . Meta&apos;s research clusters estimate 0.85 to 0.9 for their largest 2K to 4K GPU runs,
            assuming Daly-Young checkpoint intervals and 5-minute restart and save costs{' '}
            <Cite tier={3} href={META_REL} venue="preprint">
              Revisiting Reliability, Section III, Observation 10
            </Cite>
            .
          </Box>
          <Box variant="p">
            AWS states two goodput figures on its SageMaker HyperPod pages: &quot;60-80% typical goodput
            on self-managed clusters&quot;{' '}
            <Cite tier={1} href={HYPERPOD} kind="vendor-claim">
              SageMaker HyperPod product page
            </Cite>
            , and, with checkpointless training (recovery from peers&apos; in-memory state instead of a
            saved checkpoint; section 25, The Kubernetes Family), &quot;over 95% training goodput on
            clusters with thousands of AI accelerators&quot;{' '}
            <Cite tier={1} href={HYPERPOD_FEATURES} kind="vendor-claim">
              SageMaker HyperPod features page
            </Cite>
            , which the product page words as &quot;up to 95%&quot;{' '}
            <Cite tier={1} href={HYPERPOD} kind="vendor-claim">
              SageMaker HyperPod product page
            </Cite>
            . Neither page states the job size, duration, failure rate or baseline behind its figures,
            so they sit apart from the operator reports above. The populations differ too: the operator
            figures come from teams running their own automation at 10K GPUs and more, and the 60-80%
            describes typical self-managed clusters, our reading of the two sources.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Read your node count across the table to get the interval your checkpoint and restart design must beat, then keep known-bad nodes out of the job"
          >
            Your job&apos;s interruption interval
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Find your job size in the first column and read across. The columns are Meta&apos;s three
            measured rates, in failures per thousand node-days; every cell is the formula above,
            computed by the same function as the dive&apos;s checkpoint calculator.
          </Box>
          <MttfTable />
          <Box variant="small" color="text-body-secondary">
            <code>MTTF = 1 / (N_nodes x r_f)</code>, 8 GPUs per node, rates from{' '}
            <Cite tier={3} href={META_REL} venue="preprint">
              Revisiting Reliability, Sections II-E and III
            </Cite>
            . A planning estimate to the nearest order of magnitude; confirm it against your own
            fleet&apos;s failure history.
          </Box>
          <Box variant="p">
            Two rows carry this dive&apos;s examples. The reference job of sections 14 and 18, Llama 3.1
            70B on 256 H100 GPUs in 32 p5.48xlarge instances of 8 GPUs each{' '}
            <Cite tier={1} href={EC2_AC} accessed="2026-10-30">
              AWS instance types guide, accelerated computing
            </Cite>
            , meets an interruption every {formatRange(REF.low, REF.high)}. A 16,384-GPU job meets one
            every {formatRange(BIG.low, BIG.high)}, and
            that is the row Llama 3 405B lived in: one unexpected interruption every {interval} hours over
            a 54-day window of pre-training, on up to 16K GPUs. Plan with the worst-month column, since
            RSC-1&apos;s rate moved between about 2.5 and about 17.5 within one year, our reading of
            Meta&apos;s figures.
          </Box>
          <Box variant="p">
            Then design against the interval. Section 18, Checkpointing, turns your row into a checkpoint
            interval and an expected ETTR, and section 19, Resuming Correctly, makes each restart
            continue the same run. Recovery only pays once bad nodes stay out: Meta found that recovering
            from random failures &quot;is only effective once defective nodes can be reliably rotated
            out&quot;{' '}
            <Cite tier={3} href={META_REL} venue="preprint">
              Revisiting Reliability, Section II-C, Observation 2
            </Cite>
            , and removing its 40 lemon nodes cut the failure rate of 512-GPU-plus jobs from 14% to 4%.
            Screen every node before it joins the job with the deep health checks in section 24, The
            Slurm Family, and keep each node&apos;s failure history, so a node that keeps failing leaves
            the pool instead of rejoining the next restart.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
