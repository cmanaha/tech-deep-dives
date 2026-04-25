import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Alert from '@cloudscape-design/components/alert';
import Table from '@cloudscape-design/components/table';
import Link from '@cloudscape-design/components/link';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { TickToTradeDiagram } from '../components/TickToTradeDiagram';

interface MetricRow {
  metric: string;
  meaning: string;
  why: string;
}

const metricRows: MetricRow[] = [
  { metric: 'p50 latency', meaning: 'Median wall-clock per request', why: 'Marketing number. Largely irrelevant for HFT.' },
  { metric: 'p99', meaning: '99th-percentile wall-clock', why: 'The edge of normal. Operational interest.' },
  { metric: 'p99.9', meaning: '99.9th-percentile wall-clock', why: 'One in a thousand requests. Where SLA promises usually live.' },
  { metric: 'p99.99', meaning: '99.99th-percentile wall-clock', why: 'One in ten thousand. Where audit and risk care.' },
  { metric: 'Tail jitter', meaning: 'p99.9 / p50 ratio', why: 'Predictability of the worst case. The number HFT engineers fight for.' },
  { metric: 'Tick-to-trade', meaning: 'Wire arrival → order out the wire', why: 'The end-to-end metric that contains everything else.' },
];

interface FailureRow {
  source: string;
  cost: string;
  pillarFix: string;
}

const failureRows: FailureRow[] = [
  { source: 'Noisy neighbor on shared HBM', cost: 'p99.9 spike from contention', pillarFix: 'MIG hardware partitioning (Section 26)' },
  { source: 'NUMA-cross memory access', cost: 'Tens of ns over local DRAM', pillarFix: 'NPS / SNC sub-NUMA mode (Sections 8, 10, 11)' },
  { source: 'Hypervisor scheduling jitter', cost: 'Microsecond-class outliers', pillarFix: 'NIE on Graviton5 (Section 26)' },
  { source: 'GPU kernel non-determinism', cost: 'Cannot reproduce decisions for audit', pillarFix: 'Trainium NEFF AOT or GPU determinism opt-in (Section 27)' },
  { source: 'Cross-CCD core-to-core hops', cost: '~150 ns over intra-CCD', pillarFix: 'Thread / memory pinning, NPS4 (Section 10)' },
  { source: 'NCCL kernel launch consuming SMs', cost: 'Decode kernels stalled', pillarFix: 'NIXL for KV-cache transport (Section 25)' },
];

export function CapitalMarketsLens() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="The applied lens — everything in this deep dive, viewed through capital-markets requirements"
          >
            Capital markets lens
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Why this section.</strong> Sections 1-27 walked the
            silicon and software with general-engineering framing. This
            section reads the same material through one specific audience —
            capital-markets technology leads. The metrics are different
            (tail latency, jitter, determinism, audit reproducibility), the
            architectural choices that matter are different (deterministic
            dataflow, NUMA pinning, hardware isolation), and the failure
            modes that cost real money are different (noisy neighbors at
            p99.9, mispredicted branches in trading paths, non-reproducible
            inference outputs). Same silicon, different lens.
          </Box>
          <Box variant="p">
            <strong>The single framing.</strong> Capital-markets workloads
            value <em>predictable worst case</em> over peak throughput. A
            trading engine that finishes in 1 µs every time is more valuable
            than one that finishes in 800 ns most of the time and 5 µs once
            in a thousand. The whole architecture of the deep dive — memory
            hierarchy, chiplet topology, isolation pillars, AOT compilation
            — is read here in terms of what it does for the worst case, not
            for the median.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The HFT pipeline and where memory architecture lands"
          >
            Tick-to-trade — the metric that contains everything
          </Header>
        }
      >
        <SpaceBetween size="m">
          <TickToTradeDiagram />
          <Box variant="p">
            The full round trip is in the low microseconds. Stages 1, 2, 6,
            and 7 (NIC arrival and OS-bypass send / receive) live in the
            networking stack — Solarflare or AWS EFA, DPDK, kernel-bypass
            transports. Stages 3, 4, and 5 (book update, strategy /
            inference, order generation) live in the silicon and memory
            architecture covered in this deep dive. Reducing wall-clock at
            stages 3-5 without harming the worst-case at stages 3-5 is the
            entire architecture problem.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Why p50 is the wrong metric and p99.9 is the right one"
          >
            The vocabulary that matters
          </Header>
        }
      >
        <Table
          items={metricRows}
          columnDefinitions={[
            { id: 'm', header: 'Metric', cell: (r) => r.metric, minWidth: 160 },
            { id: 'mn', header: 'Meaning', cell: (r) => r.meaning },
            { id: 'why', header: 'Why it matters', cell: (r) => r.why },
          ]}
          variant="embedded"
          wrapLines
        />
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Each line is a real production tail-latency source"
          >
            Failure modes and the pillars that address them
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Table
            items={failureRows}
            columnDefinitions={[
              { id: 's', header: 'Failure source', cell: (r) => r.source, minWidth: 240 },
              { id: 'c', header: 'Cost in production', cell: (r) => r.cost },
              { id: 'fix', header: 'Architecture pillar that addresses it', cell: (r) => r.pillarFix },
            ]}
            variant="embedded"
            wrapLines
          />
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Where the conventional wisdom about cloud memory expansion gets it wrong"
          >
            The CXL framing trap
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            CXL is the most-asked-about memory topic in cloud architecture
            conversations, and it is the wrong lever for HFT. CXL solves a
            capacity problem — &ldquo;I need more memory than fits in my
            socket&rdquo; — by attaching pooled or shared memory over a
            PCIe-class fabric. The link adds 200-400 ns of latency. For a
            tick-to-trade pipeline that fights for nanoseconds, adding a
            300 ns hop to read marginal bytes is going the wrong direction.
          </Box>
          <Alert type="warning" header="When CXL is the right answer for finance">
            Capacity-bound workloads outside the latency-sensitive path —
            risk modeling on large embeddings, regulatory analytics with
            in-memory OLAP, retrieval indexes for reference data — fit CXL
            well. The trick is recognizing that those are different
            workloads from the trading path. Section 7 covered the choice
            criteria; the capital-markets framing is &ldquo;CXL is for the
            workloads where p99 latency does not matter.&rdquo;
          </Alert>
          <Box variant="p">
            <strong>What replaces CXL in the trading path.</strong> Local
            DDR5 with NUMA pinning, MRDIMM where Xeon 6 6900P is acceptable,
            HBM-class memory on accelerators, and on-die SRAM for the
            hottest book state. None of these are pooled memory. The
            architecture of latency-sensitive finance is to keep the
            working set in tier 5 or above (LLC, L2, L1, registers) and
            never miss to tier 6 if avoidable.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Adjoint Algorithmic Differentiation, twin networks, and the inference workload that lands on the deep-dive silicon"
          >
            Differential Machine Learning — risk and pricing as an inference problem
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Why this section.</strong> The previous container framed
            tail latency for trading paths. The other half of the capital
            markets compute envelope is risk and valuation: FRTB IMA
            (Fundamental Review of the Trading Book — Internal Models
            Approach), CCR (Counterparty Credit Risk), CVA / xVA, ISDA SIMM
            (Standard Initial Margin Model), and intraday RWA (Risk-
            Weighted Asset) computation. These workloads are not
            latency-sensitive in the tick-to-trade sense — they are
            volume-sensitive. A bank revalues a derivatives book through
            thousands of market scenarios per day. That is millions of
            pricing function evaluations per book per day. Traditional
            Monte Carlo at scale is the bottleneck. Differential Machine
            Learning is the modern answer.
          </Box>
          <Box variant="p">
            <strong>AAD — the foundation underneath everything.</strong>{' '}
            <em>Adjoint Algorithmic Differentiation</em> is reverse-mode
            automatic differentiation applied to a pricing function. From
            Huge and Savine&apos;s 2020 paper:{' '}
            <em>&ldquo;It takes the time of 2 to 5 evaluations in practice
            to compute thousands of differentials with an efficient
            implementation&rdquo;</em>
            {' ('}
            <Link external href="https://arxiv.org/abs/2005.02347">
              Huge and Savine, &ldquo;Differential Machine Learning,&rdquo;
              arXiv:2005.02347
            </Link>
            , accessed 2026-04-25, footnote 3 page 5). This is the
            constant-time-in-risk-factors property: one reverse pass yields
            all sensitivities at 2-5× the forward pricing cost regardless
            of the number of input risk factors. AAD displaced
            bumping/finite-difference Greeks at investment banks starting
            with Giles and Glasserman&apos;s &ldquo;Smoking Adjoints&rdquo; in
            Risk Magazine, 2006.
          </Box>
          <Box variant="p">
            <strong>Differential Machine Learning — what &ldquo;differential&rdquo;
            means.</strong> Huge and Savine, abstract:{' '}
            <em>&ldquo;Differential ML is a general extension of supervised
            learning, where ML models are trained on examples of not only
            inputs and labels but also differentials of labels wrt
            inputs.&rdquo;</em> The training labels include both the price
            (function value) and the gradient of the price with respect to
            inputs, computed via AAD. Networks learn the pricing function
            and its sensitivities (Greeks) simultaneously. The mechanism is
            a <em>twin network</em>: a feed-forward path producing the
            price plus a backpropagation path producing the differentials,
            both consumed by the loss function during training.
          </Box>
          <Alert type="success" header="The headline result, vendor-cited">
            The Danske Bank benchmark in the paper trains a twin network on
            8,192 samples that produces a &ldquo;virtually perfect&rdquo;
            risk approximation — versus a vanilla neural network requiring
            65,536 samples to produce a much rougher result. Standard
            errors: 12.85M (classical at 64k samples) vs 1.77M
            (differential at 8k samples) on a 200M test range. Huge and
            Savine&apos;s framing:{' '}
            <em>&ldquo;Differential ML performs up to thousandfold better
            on small datasets&rdquo;</em> (paper §2 introduction page 10).
            And:{' '}
            <em>&ldquo;The twin network has the same degree of approximation
            as orders of magnitude slower nested Monte-Carlo&rdquo;</em> (§2.3
            page 13).
          </Alert>
          <Box variant="p">
            <strong>Where the regulated workloads live.</strong>{' '}
            <em>&ldquo;Regulations like XVA, CCR, FRTB or SIMM-MVA, where
            the values and risk sensitivities of Derivatives trading books
            are repeatedly computed in many different market states. An
            effective pricing approximation could execute the repeated
            computations orders of magnitude faster and resolve the
            considerable bottlenecks of these computations&rdquo;</em>{' '}
            (Huge and Savine 2020, page 2). FRTB IMA is the BCBS d457
            framework, January 2019, that defines expected-shortfall
            internal models for market risk capital
            ({' '}
            <Link external href="https://www.bis.org/bcbs/publ/d457.htm">
              BCBS d457
            </Link>
            , accessed 2026-04-25). ISDA SIMM is the bilateral initial
            margin standard:{' '}
            <em>&ldquo;SIMM uses sensitivities as inputs&rdquo;</em>{' '}
            (ISDA SIMM Methodology v2.4 §A.2, accessed 2026-04-25). Six
            risk classes, three sensitivity types (delta, vega, curvature),
            computed daily for every UMR-in-scope counterparty. AAD-
            generated differentials are the natural input.
          </Box>
          <Alert type="info" header="The silicon implication">
            Once the differential network is trained, inference at runtime
            is{' '}
            <em>&ldquo;a few matrix by vector products in limited dimension,
            and differentiation is performed in similar time by
            backpropagation&rdquo;</em>{' '}
            (Huge and Savine 2020 page 2). The bank&apos;s entire
            sensitivities-based risk pipeline — FRTB IMA scenario revaluation,
            ISDA SIMM daily margin computation, intraday CVA / xVA — collapses
            from heavy Monte Carlo to dense small-network inference. That
            inference workload maps cleanly onto the silicon covered by this
            deep dive: AWS Trainium / Inferentia for cost-optimized inference
            (Section 16), NVIDIA GPUs for training the twin networks (Section
            12-13), and host-CPU AMX or Graviton5 SVE2 for embedded inference
            in the trading and risk path (Sections 9, 11). The silicon answer
            for risk-and-valuation workloads is no longer a 10,000-CPU grid;
            it is a fleet of inference accelerators.
          </Alert>
          <ExpandableSection headerText="Antoine Savine — the canonical author for the AAD-and-differential-ML literature">
            <Box variant="p">
              Antoine Savine has been the most influential author connecting
              AAD to investment-bank practice. He authored{' '}
              <em>Modern Computational Finance: AAD and Parallel Simulations
              </em>{' '}(Wiley, 2018) and{' '}
              <em>Modern Computational Finance: Scripting for Derivatives
              and xVA</em>{' '}(Wiley, 2022), the canonical modern treatments
              of AAD in derivatives pricing. The 2020 differential ML paper
              with Brian Huge (then at Danske Bank) extended the framework
              from differentiation to learning. As of 2026, Savine is
              Managing Director at Barclays Fixed Income Quant Analytics;
              previously Hudson River Trading, Danske Bank, BNP-Paribas. He
              received the IAQF Innovation Award in 2026
              ({' '}
              <Link external href="https://antoinesavine.com/">
                Antoine Savine personal site
              </Link>
              , accessed 2026-04-25).
            </Box>
          </ExpandableSection>
          <ExpandableSection headerText="Reference implementation and where to start">
            <Box variant="p">
              The Huge / Savine reference TensorFlow implementation is open
              source at{' '}
              <Link external href="https://github.com/differential-machine-learning">
                github.com/differential-machine-learning
              </Link>
              . The notebooks repo includes the complete pipeline: AAD-
              generated training labels, twin network architecture, training
              loop, and the autocallable + Danske netting set benchmarks
              from the paper. Reading the paper alongside running the
              notebooks is the fastest way for an inference-silicon engineer
              to internalize what the workload actually looks like in TensorFlow
              terms — useful when reasoning about how it will deploy on
              Trainium, Inferentia, or NVIDIA inference SKUs.
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The AWS portfolio answer"
          >
            How the deep dive applies on stage
          </Header>
        }
      >
        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <Box variant="h3">For latency-sensitive trading</Box>
            <ul>
              <li>Graviton5 with NIE for tenant isolation (Section 9, 26)</li>
              <li>EPYC Turin M8azn 5 GHz for clock-bound paths (Section 10)</li>
              <li>NUMA pinning, NPS4 / SNC3 for predictable memory locality (Sections 4, 8, 10, 11)</li>
              <li>OS-bypass networking via EFA + SRD (Section 25)</li>
            </ul>
          </div>
          <div>
            <Box variant="h3">For inference in regulated workflows</Box>
            <ul>
              <li>Trainium NEFF AOT for bit-exact reproducibility (Section 16, 27)</li>
              <li>NVIDIA MIG for hardware-partitioned multi-tenancy (Section 26)</li>
              <li>NVFP4 / FP8 quantization to fit models economically (Section 23)</li>
              <li>Disaggregated serving for cost-efficient scale-out (Section 24)</li>
            </ul>
          </div>
          <div>
            <Box variant="h3">For risk + analytics</Box>
            <ul>
              <li>Xeon 6 6900P with MRDIMM-8800 for bandwidth-hungry analytics (Section 7, 11)</li>
              <li>CXL pooling for capacity-bound workloads (Section 7)</li>
              <li>Graviton5 distributed L3 for cache-friendly working sets (Section 9)</li>
              <li>P5en for inference-heavy quantitative analysis (Section 12)</li>
            </ul>
          </div>
          <div>
            <Box variant="h3">For audit + compliance</Box>
            <ul>
              <li>NIE Isabelle/HOL proof for tenant isolation evidence (Section 26)</li>
              <li>Trainium NEFF replay for inference reconstruction (Section 27)</li>
              <li>TEE-I/O on Blackwell for cryptographic separation (Section 26)</li>
              <li>Confidential computing across the stack</li>
            </ul>
          </div>
        </ColumnLayout>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What the panel audience cares about"
          >
            Anchoring the conversation
          </Header>
        }
      >
        <ExpandableSection headerText="Three questions every capital markets technologist will ask">
          <SpaceBetween size="s">
            <Box variant="p">
              <strong>1. What is your p99.9 jitter under contention?</strong>{' '}
              The honest answer is silicon-and-pillar specific. NIE on
              Graviton5 plus MIG on a Hopper / Blackwell GPU plus
              NUMA-pinned threads gets you the cleanest p99.9 story
              available on a public cloud. Trainium NEFF AOT eliminates
              kernel-selection variance entirely. The number itself depends
              on the workload — but the architectural answer is the
              three-pillar story, not a single feature.
            </Box>
            <Box variant="p">
              <strong>2. How do you demonstrate isolation to my regulator?
              </strong> The Isabelle/HOL proof script for NIE is inspectable.
              The MIG configuration and TEE-I/O attestation produce hardware
              evidence. The Trainium NEFF binary is the schedule, replayable
              indefinitely. Each piece maps to a specific compliance
              framework (Section 26 covered the mapping).
            </Box>
            <Box variant="p">
              <strong>3. What does this cost vs running in our colo?</strong>{' '}
              For latency-sensitive trading at the truly low end of
              tick-to-trade, dedicated colocation in an exchange building
              still wins on absolute wall-clock. Cloud silicon catches up on
              everything else: model risk, surveillance analytics, regulatory
              reporting, RAG over reference data, MoE-class inference
              workloads. The framing is workload-by-workload, not all-or-nothing.
            </Box>
          </SpaceBetween>
        </ExpandableSection>
      </Container>
    </SpaceBetween>
  );
}
