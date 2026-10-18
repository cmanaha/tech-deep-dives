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
import { Cite } from '../components/Cite';
import { S } from '../sources/CapitalMarketsLens';

interface MetricRow {
  metric: string;
  meaning: string;
  why: string;
}

const metricRows: MetricRow[] = [
  {
    metric: 'p50 latency',
    meaning: 'Median wall-clock per request',
    why: 'Marketing number. Largely irrelevant for HFT.',
  },
  {
    metric: 'p99',
    meaning: '99th-percentile wall-clock',
    why: 'The edge of normal. Operational interest.',
  },
  {
    metric: 'p99.9',
    meaning: '99.9th-percentile wall-clock',
    why: 'One in a thousand requests. Where SLA (service-level agreement) promises usually live.',
  },
  {
    metric: 'p99.99',
    meaning: '99.99th-percentile wall-clock',
    why: 'One in ten thousand. Where audit and risk care.',
  },
  {
    metric: 'Tail jitter',
    meaning: 'p99.9 / p50 ratio',
    why: 'Predictability of the worst case. The number HFT engineers fight for.',
  },
  {
    metric: 'Tick-to-trade',
    meaning: 'Wire arrival to order on the wire',
    why: 'The end-to-end metric that contains everything else.',
  },
];

interface FailureRow {
  source: React.ReactNode;
  cost: React.ReactNode;
  fix: React.ReactNode;
}

const failureRows: FailureRow[] = [
  {
    source: 'Noisy neighbor on shared HBM (High Bandwidth Memory)',
    cost: 'p99.9 spike from contention',
    fix: (
      <>
        MIG (Multi-Instance GPU) instances, each with dedicated memory and memory bandwidth
        <Cite
          s={S.migConcepts}
          note="Each GPU slice includes dedicated GPU memory resources which limit both the available capacity and bandwidth, and provide memory QoS."
        />{' '}
        (<em>Isolation: NIE and MIG</em>)
      </>
    ),
  },
  {
    source: 'Memory access that crosses NUMA nodes',
    cost: "Every miss pays the remote node's latency",
    fix: (
      <>
        Pin threads and their memory to one NUMA node (<em>Graviton Deep Dive</em>,{' '}
        <em>AMD EPYC Turin</em>, <em>Intel Xeon 6</em>)
      </>
    ),
  },
  {
    source: 'Core-to-core traffic across CCDs (Core Complex Dies) on AMD EPYC',
    cost: (
      <>
        About 150 ns between cores on different CCDs against about 45 ns within one, measured on an
        EPYC 9575F
        <Cite s={S.chipsAndCheeseTurin} kind="measured" />
      </>
    ),
    fix: (
      <>
        Keep threads that share data on one CCD (<em>AMD EPYC Turin</em>)
      </>
    ),
  },
  {
    source: 'Run-to-run differences in model output',
    cost: 'A decision you cannot reproduce for audit',
    fix: (
      <>
        Fix the batch shape or turn on batch-invariant serving (vLLM{' '}
        <code>VLLM_BATCH_INVARIANT=1</code>, beta)
        <Cite s={S.vllmBatchInvariance} />; on Trainium, also pin the NEFF (Neuron Executable File
        Format) and set a fixed rounding seed
        <Cite
          s={S.neuronEnvVars}
          note="NEURON_RT_STOCHASTIC_ROUNDING_SEED: set to a fixed value to ensure reproducibility between runs."
        />{' '}
        (<em>Determinism: NEFF and GPU Reproducibility</em>)
      </>
    ),
  },
];

export function CapitalMarketsLens() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="What the dive's silicon and memory choices do for the worst case, which is the number trading, risk and audit teams are judged on"
          >
            Capital markets lens
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Capital-markets technology leads read the same silicon through different metrics: tail
            latency, jitter, determinism and audit reproducibility. Different architecture choices
            matter to them: deterministic dataflow, NUMA (Non-Uniform Memory Access) pinning and
            hardware isolation. Different failures cost real money: noisy neighbors at p99.9,
            mispredicted branches in high-frequency trading (HFT) paths, and inference outputs
            nobody can reproduce. This section reads the rest of the dive through those
            requirements.
          </Box>
          <Box variant="p">
            <strong>The single framing.</strong> Capital-markets workloads value a{' '}
            <em>predictable worst case</em> over peak throughput. A trading engine that finishes in
            1 µs every time is worth more than one that finishes in 800 ns most of the time and 5 µs
            once in a thousand. Each part of the dive (memory hierarchy, chiplet topology,
            isolation, ahead-of-time compilation) is read here for what it does to the worst case
            rather than the median.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Which stages your silicon and memory choices can shorten, and which belong to the network stack"
          >
            Tick-to-trade: the metric that contains everything
          </Header>
        }
      >
        <SpaceBetween size="m">
          <TickToTradeDiagram />
          <Box variant="p">
            Tick-to-trade runs from the moment a market tick reaches the NIC (network interface
            card) to the moment the resulting order leaves it. Stages 1, 2, 6 and 7 live in the
            network stack. Exchange feeds arrive as multicast UDP (User Datagram Protocol)
            <Cite
              s={S.amdSdciWhitepaper}
              note="The financial technology (or Fintech) market requires low latency, wire speed packet performance, deterministic packet jitter, and specialized multicast processing."
            />
            , and kernel-bypass software hands the packets to user space: on AMD Solarflare
            adapters, Onload as a preload under the sockets API or ef_vi as a layer-2 library
            <Cite s={S.amdSdciWhitepaper} />, or DPDK (Data Plane Development Kit).
          </Box>
          <Box variant="p">
            EFA (Elastic Fabric Adapter) also bypasses the operating system, and it serves a
            different path. EFA traffic is not routable and cannot cross Availability Zones or VPCs
            (virtual private clouds)
            <Cite s={S.efaUserGuide} />, and libfabric&apos;s EFA provider lists no multicast
            capability.
            <Cite s={S.libfabricEfaMan} /> EFA carries traffic between instances inside one cluster;
            it is not the receive path for an exchange feed.
          </Box>
          <Box variant="p">
            Stages 3, 4 and 5 (book update, strategy or inference, order generation) live in the
            silicon and memory this deep dive covers. Shortening them without lengthening their
            worst case is the architecture challenge the rest of this section addresses.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Why p50 is the wrong target and p99.9 the right one">
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
            description="Four tail-latency and audit failures, each paired with the fix to put in place before you measure p99.9"
          >
            Failure modes and the pillars that address them
          </Header>
        }
      >
        <Table
          items={failureRows}
          columnDefinitions={[
            {
              id: 's',
              header: 'Failure source',
              cell: (r) => r.source,
              minWidth: 220,
            },
            { id: 'c', header: 'Cost in production', cell: (r) => r.cost },
            {
              id: 'fix',
              header: 'Architecture pillar that addresses it',
              cell: (r) => r.fix,
            },
          ]}
          variant="embedded"
          wrapLines
        />
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Why memory expansion belongs to capacity-bound work and stays out of the trading path"
          >
            Where CXL fits
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            CXL (Compute Express Link) memory meets a capacity challenge, more memory than fits in
            the socket, by attaching expansion or pooled memory over a PCIe-class link. Every access
            pays for the link: in Pond&apos;s estimates, CXL adds 70 to 90 ns over same-NUMA-node
            DRAM for a pool of 8 to 16 sockets, and more than 180 ns for rack-scale pooling.
            <Cite
              s={S.pond}
              kind="simulated"
              note="CXL 'will add 70-90ns to access latencies over same-NUMA-node DRAM with a pool size of 8-16 sockets, and add more than 180ns for rack-scale pooling.'"
            />{' '}
            For a tick-to-trade pipeline that fights for nanoseconds, a slower tier for marginal
            bytes moves the wrong way.
          </Box>
          <Alert type="info" header="When CXL is the right answer for finance">
            Capacity-bound work outside the latency-sensitive path fits CXL: risk models over large
            embeddings, regulatory analytics on in-memory OLAP (online analytical processing),
            retrieval indexes over reference data. For those workloads an extra 70 to 90 ns per
            access does not change the result. <em>DDR5, MRDIMM, LPDDR5X and CXL</em> covers the
            choice criteria. No EC2 instance with CXL-attached memory was located during this
            research.
          </Alert>
          <Box variant="p">
            <strong>What serves the trading path.</strong> Local DDR5 with threads and memory pinned
            to one NUMA node, and cache for the hottest book state. The working set stays in the
            last-level cache (LLC) or closer (LLC, L2, L1, registers), and misses to DRAM are the
            exception. <em>Memory Hierarchy Primer</em> lays out the tiers.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="How risk and margin work moves from Monte Carlo to small-network inference, and which silicon runs it"
          >
            Differential Machine Learning: risk and pricing as an inference problem
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Risk and valuation.</strong> The other half of capital-markets compute is FRTB
            IMA (Fundamental Review of the Trading Book, Internal Models Approach), CCR
            (Counterparty Credit Risk), CVA (Credit Valuation Adjustment) and the wider xVA family,
            ISDA SIMM (International Swaps and Derivatives Association, Standard Initial Margin
            Model) and intraday RWA (Risk-Weighted Asset) computation. These workloads care about
            volume rather than tick-to-trade latency: the values and sensitivities of a derivatives
            book are recomputed across many market states
            <Cite s={S.hugeSavine} note="Page 2." />, and Monte Carlo at that volume is the
            bottleneck. Differential Machine Learning is a way through it.
          </Box>
          <Box variant="p">
            <strong>AAD, the foundation.</strong> AAD (Adjoint Algorithmic Differentiation) is
            reverse-mode automatic differentiation applied to a pricing function. Huge and Savine:{' '}
            <em>
              &quot;It takes the time of 2 to 5 evaluations in practice to compute thousands of
              differentials with an efficient implementation&quot;
            </em>
            <Cite s={S.hugeSavine} note="Footnote 3, page 5." />. One reverse pass yields every
            sensitivity at 2 to 5 times the cost of one pricing, however many risk factors feed it.
            AAD began displacing bumping (finite-difference Greeks) at investment banks with Giles
            and Glasserman&apos;s &quot;Smoking Adjoints&quot; in <em>Risk</em>, January 2006.
            <Cite s={S.smokingAdjoints} />
          </Box>
          <Box variant="p">
            <strong>What &quot;differential&quot; means.</strong> From the paper&apos;s abstract:{' '}
            <em>
              &quot;Differential ML is a general extension of supervised learning, where ML models
              are trained on examples of not only inputs and labels but also differentials of labels
              wrt inputs.&quot;
            </em>
            <Cite s={S.hugeSavine} note="Abstract." /> The training labels carry the price and its
            gradient with respect to the inputs, computed with AAD, so the network learns the
            pricing function and its sensitivities (Greeks) together. The mechanism is a{' '}
            <em>twin network</em>: a feed-forward path produces the price, a backpropagation path
            produces the differentials, and the loss consumes both.
          </Box>
          <Alert type="success" header="The headline result (authors' measurement)">
            On the Danske Bank benchmark in the paper, a twin network trained on 8,192 samples gives
            a &quot;virtually perfect&quot; risk approximation, where a vanilla network needs 65,536
            samples for a much rougher one. Standard errors are 12.85M for the classical network at
            64k samples and 1.77M for the differential network at 8k, on a test range of 200M.
            <Cite s={S.hugeSavine} kind="measured" note="Section 2.3, pages 12 to 13." /> In the
            authors&apos; words,{' '}
            <em>
              &quot;differential ML performs up to thousandfold better on small datasets&quot;
            </em>
            <Cite s={S.hugeSavine} kind="measured" note="Page 10." />, and{' '}
            <em>
              &quot;The twin network has the same degree of approximation as orders of magnitude
              slower nested Monte-Carlo&quot;
            </em>
            <Cite s={S.hugeSavine} kind="measured" note="Section 2.3, page 13." />.
          </Alert>
          <Box variant="p">
            <strong>Where the regulated workloads live.</strong> The paper names its targets:{' '}
            <em>
              &quot;regulations like XVA, CCR, FRTB or SIMM-MVA, where the values and risk
              sensitivities of Derivatives trading books are repeatedly computed in many different
              market states. An effective pricing approximation could execute the repeated
              computations orders of magnitude faster and resolve the considerable bottlenecks of
              these computations&quot;
            </em>
            <Cite s={S.hugeSavine} note="Page 2." />. FRTB comes from BCBS d457 (Basel Committee on
            Banking Supervision, January 2019), which sets the market-risk framework, including the
            expected-shortfall internal models approach.
            <Cite s={S.bcbsD457} />
          </Box>
          <Box variant="p">
            <strong>When FRTB applies.</strong> The EU applies its new market-risk requirements from
            1 January 2027, with temporary relief measures until 31 December 2029.
            <Cite s={S.euFrtbDelegatedAct} /> The UK PRA (Prudential Regulation Authority) applies
            its internal models approach from 1 January 2028 and its other Basel 3.1 rules from
            January 2027.
            <Cite s={S.praFrtbIma} /> The US federal banking agencies proposed their capital rules,
            market risk included, on 19 March 2026, with comments due by 18 June 2026
            <Cite s={S.usCapitalProposal} />; no final US rule was located during this research.
          </Box>
          <Box variant="p">
            <strong>SIMM.</strong> ISDA SIMM is the bilateral initial-margin standard, and{' '}
            <em>&quot;SIMM uses sensitivities as inputs&quot;</em> (version 2.8+2512, in effect from
            11 July 2026).
            <Cite s={S.simmMethodology} note="Section A, paragraph 2." />
            <Cite s={S.simmAnnouncement} /> It covers six risk classes, and the margin is the sum of
            delta, vega and curvature margins, with curvature computed from vega inputs, plus a base
            correlation margin for credit qualifying risk.
            <Cite s={S.simmMethodology} /> AAD-generated differentials are the natural input.
          </Box>
          <Alert type="info" header="The silicon implication">
            Once trained, the network prices with{' '}
            <em>
              &quot;a few matrix by vector products in limited dimension, and differentiation is
              performed in similar time by backpropagation&quot;
            </em>
            <Cite s={S.hugeSavine} note="Page 2." />. Our reading, since the paper claims faster
            approximation rather than a change of hardware: the sensitivities pipeline (FRTB IMA
            scenario revaluation, SIMM margin, intraday CVA and xVA) moves from heavy Monte Carlo
            toward small dense-network inference. That workload maps onto the silicon in this dive:
            NVIDIA GPUs to train the twin networks (<em>NVIDIA Hopper</em>,{' '}
            <em>NVIDIA Blackwell</em>), Trainium or Inferentia to serve them (
            <em>AWS Trainium, Inferentia and Neuron</em>), and CPU matrix and vector units for
            inference inside the trading and risk path: Intel AMX (Advanced Matrix Extensions) on
            Xeon (<em>Intel Xeon 6</em>) or SVE2 (Scalable Vector Extension 2) on Graviton4 and
            Graviton5
            <Cite s={S.gravitonReadme} note="Graviton4 and Graviton5 support SVE2." /> (
            <em>Graviton Deep Dive</em>).
          </Alert>
          <ExpandableSection headerText="Reference implementation and where to start">
            <Box variant="p">
              The reference TensorFlow implementation is open source, pinned here to the commits
              read for this page. The{' '}
              <Link external href={S.dmlNotebooks.url}>
                notebooks repository
              </Link>
              <Cite s={S.dmlNotebooks} /> holds the executable code: DifferentialML, the main
              notebook, reproduces the paper&apos;s Bachelier example, DifferentialMLTF2 is its
              maintained TensorFlow 2 upgrade, and further notebooks apply differential learning to
              classic regression and to PCA (principal component analysis). The{' '}
              <Link external href={S.dmlAppendices.url}>
                appendices repository
              </Link>
              <Cite s={S.dmlAppendices} /> holds four companion appendices, from the
              Longstaff-Schwartz method to unsupervised training in production systems. Run the
              notebooks beside the paper to see the workload in TensorFlow terms before you size it
              for Trainium, Inferentia or an NVIDIA GPU.
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The instance family and the section to read next, for trading, regulated inference, risk analytics and audit"
          >
            Where each workload lands
          </Header>
        }
      >
        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <Box variant="h3">For latency-sensitive trading</Box>
            <ul>
              <li>
                Graviton5 instances, where NIE (Nitro Isolation Engine) runs on every instance
                <Cite s={S.nieComputeBlog} /> (<em>Graviton Deep Dive</em>,{' '}
                <em>Isolation: NIE and MIG</em>)
              </li>
              <li>
                M8azn (AMD EPYC Turin) at up to 5 GHz for clock-bound paths
                <Cite s={S.m8aznGa} /> (<em>AMD EPYC Turin</em>)
              </li>
              <li>
                Threads and memory pinned to one NUMA node (<em>Chiplet and Interconnect</em>,{' '}
                <em>AMD EPYC Turin</em>, <em>Intel Xeon 6</em>)
              </li>
              <li>
                EFA for OS-bypass traffic inside the cluster, within one Availability Zone and VPC
                <Cite s={S.efaUserGuide} /> (<em>Communication and Scale-Out</em>)
              </li>
            </ul>
          </div>
          <div>
            <Box variant="h3">For inference in regulated workflows</Box>
            <ul>
              <li>
                Trainium with the NEFF, rounding seed and batch shape pinned, so a result can be
                replayed
                <Cite s={S.neuronEnvVars} /> (<em>AWS Trainium, Inferentia and Neuron</em>,{' '}
                <em>Determinism: NEFF and GPU Reproducibility</em>)
              </li>
              <li>
                NVIDIA MIG for hardware-partitioned multi-tenancy (<em>Isolation: NIE and MIG</em>)
              </li>
              <li>
                NVFP4 (NVIDIA&apos;s 4-bit floating point) and FP8 quantization to fit models in
                less memory (<em>Quantization and Precision</em>)
              </li>
              <li>
                Disaggregated serving to scale prefill and decode separately (
                <em>Disaggregated Serving and Speculative Decoding</em>)
              </li>
            </ul>
          </div>
          <div>
            <Box variant="h3">For risk and analytics</Box>
            <ul>
              <li>
                Xeon 6 with MRDIMM (Multiplexed Rank DIMM) at 8,800 MT/s for bandwidth-bound
                analytics
                <Cite
                  s={S.xeon6Brief}
                  note="The product brief lists MRDIMM support at 8,800 MT/s."
                />{' '}
                (<em>DDR5, MRDIMM, LPDDR5X and CXL</em>, <em>Intel Xeon 6</em>)
              </li>
              <li>
                CXL memory for capacity-bound work, where a platform offers it (
                <em>DDR5, MRDIMM, LPDDR5X and CXL</em>)
              </li>
              <li>
                Graviton5 for cache-resident working sets: 96 MB of LLC per NUMA node on 24xlarge
                and 48xlarge, 48 MB on 16xlarge and smaller
                <Cite s={S.gravitonReadme} /> (<em>Graviton Deep Dive</em>)
              </li>
              <li>
                P5en (eight NVIDIA H200 GPUs) for inference-heavy quantitative analysis
                <Cite s={S.ec2AcceleratedSpecs} /> (<em>NVIDIA Hopper</em>)
              </li>
            </ul>
          </div>
          <div>
            <Box variant="h3">For audit and compliance</Box>
            <ul>
              <li>
                The NIE white paper, which states what the Isabelle/HOL proof covers and what it
                assumes
                <Cite s={S.nieWhitepaper} /> (<em>Isolation: NIE and MIG</em>)
              </li>
              <li>
                Blackwell TEE-I/O (Trusted Execution Environment for I/O) for confidential computing
                <Cite s={S.blackwellArchitecture} />; no EC2 documentation for GPU confidential
                computing was located during this research
              </li>
            </ul>
          </div>
        </ColumnLayout>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The three questions a capital-markets technologist will ask, and the answer each part of the dive supports"
          >
            Anchoring the conversation
          </Header>
        }
      >
        <SpaceBetween size="s">
          <Box variant="p">
            <strong>1. What is your p99.9 jitter under contention?</strong> The answer is specific
            to the silicon and the isolation in use. Threads and memory pinned to one NUMA node on
            the CPU path, and MIG instances with dedicated memory bandwidth on a shared GPU, each
            remove one source of contention; neither sets the number. Measure p99.9 on the instance
            and build you will deploy, under the contention you expect.
          </Box>
          <Box variant="p">
            <strong>2. How do you demonstrate isolation to my regulator?</strong> Start from the NIE
            white paper. Its Isabelle/HOL proof covers the confidentiality and integrity of each
            VM&apos;s private data across VM creation and configuration, vCPU management and memory
            management, and the paper names what sits outside it: micro-architectural side channels
            such as caches, and scheduling, which the deprivileged Nitro Hypervisor keeps.
            <Cite s={S.nieWhitepaper} /> AWS plans to make the NIE source code and proofs available
            to third parties for independent review.
            <Cite s={S.nieComputeBlog} /> On GPUs, the MIG layout is configuration you can show; for
            inference, the pinned replay set reproduces a decision.
          </Box>
          <Box variant="p">
            <strong>3. What does this cost against our colo?</strong> Our reading: at the low end of
            tick-to-trade, colocation in the exchange&apos;s data center keeps the absolute
            wall-clock advantage, because the feed arrives there as multicast UDP, while EFA traffic
            is not routable and its libfabric provider lists no multicast. Cloud silicon fits the
            rest: model risk, surveillance analytics, regulatory reporting, RAG (retrieval-augmented
            generation) over reference data, and mixture-of-experts (MoE) inference. Decide workload
            by workload.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
