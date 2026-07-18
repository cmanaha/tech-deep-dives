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
import { GravitonComparison } from '../components/GravitonComparison';

interface SpecRow {
  spec: string;
  g4: string;
  g5: string;
}

const specRows: SpecRow[] = [
  { spec: 'ISA', g4: 'ARMv9.0-A', g5: 'ARMv9.2-A' },
  { spec: 'Process', g4: 'TSMC N4 / N5', g5: 'TSMC 3 nm' },
  { spec: 'Cores per socket', g4: '96', g5: '192 (2×)' },
  { spec: 'Clock', g4: '2.8 GHz (1S) / 2.7 GHz (2S)', g5: '3.1 GHz' },
  { spec: 'L1 I / D', g4: '64 / 64 KB · 4-cycle L1D', g5: 'UNKNOWN (per-core L1 split not directly stated in vendor pages fetched)' },
  { spec: 'L2 per core', g4: '2 MB · 8-way · 11 cycles', g5: '2 MB' },
  { spec: 'L3 total', g4: '36 MB SLC (CMN-700)', g5: '192 MB distributed (CMN-S3)' },
  { spec: 'L3 per core', g4: '375 KB', g5: '1 MB (2.67×)' },
  { spec: 'DDR speed', g4: 'DDR5-5600', g5: 'DDR5-7200' },
  { spec: 'Peak DRAM BW', g4: '537.6 GB/s', g5: '691.2 GB/s' },
  { spec: 'Per-core DRAM BW', g4: '5.6 GB/s', g5: '3.6 GB/s (-36%)' },
  { spec: 'NUMA', g4: '2-socket; 138 ns cross', g5: 'Eliminated — single socket' },
  { spec: 'Inter-core latency', g4: '30-60 ns', g5: '~33% lower (AWS claim)' },
];

export function GravitonDeepDive() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="The Arm host silicon line that powers the largest fraction of EC2 — Neoverse V2 and V3 generations"
          >
            Graviton deep dive
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>What Graviton is.</strong> AWS-designed Arm Neoverse server CPUs.
            Graviton4 (Neoverse V2) shipped at re:Invent 2023 with 96 cores per socket
            and ARMv9.0 ISA. Graviton5 (Neoverse V3) was announced December 2025 with
            192 cores per socket and ARMv9.2. Both target general server workloads —
            web tier, microservices, databases, analytics — and increasingly inference
            stacks where the host CPU runs orchestration, tokenization, and KV-cache
            management for a GPU or Trainium accelerator.
          </Box>
          <Box variant="p">
            <strong>Why this section.</strong> Graviton is the Arm point of comparison
            for every host-side decision in a 2026 inference deployment. Its memory
            hierarchy made one of the most aggressive architectural shifts of any
            current host CPU between V2 and V3 — moving from a unified system-level
            cache (SLC) to a distributed L3, and doubling cores while DRAM channels
            stayed flat. That shift is the canonical example of the per-core bandwidth
            regression flagged in Section 4.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Side by side — what changed and what stayed"
          >
            Graviton4 → Graviton5
          </Header>
        }
      >
        <SpaceBetween size="m">
          <GravitonComparison />
          <Table
            items={specRows}
            columnDefinitions={[
              { id: 'spec', header: 'Spec', cell: (r) => r.spec, minWidth: 180 },
              { id: 'g4', header: 'Graviton4 (Neoverse V2)', cell: (r) => r.g4 },
              { id: 'g5', header: 'Graviton5 (Neoverse V3)', cell: (r) => r.g5 },
            ]}
            variant="embedded"
            wrapLines
          />
          <Box variant="small">
            Graviton4 cache and latency numbers measured by{' '}
            <Link
              external
              href="https://chipsandcheese.com/p/arms-neoverse-v2-in-awss-graviton-4"
            >
              Chips and Cheese — Neoverse V2
            </Link>
            . Graviton5 architectural facts from AWS announcements
            ({' '}
            <Link
              external
              href="https://www.aboutamazon.com/news/aws/aws-graviton-5-cpu-amazon-ec2"
            >
              About Amazon — Graviton 5
            </Link>
            ) and{' '}
            <Link
              external
              href="https://www.theregister.com/2025/12/04/amazon_graviton_5/"
            >
              The Register
            </Link>
            . CMN-S3 reference{' '}
            <Link
              external
              href="https://www.arm.com/products/silicon-ip-system/neoverse-interconnect/cmn-s3"
            >
              ARM CMN-S3
            </Link>
            . All accessed 2026-04-23.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Why the per-core DRAM bandwidth dropped — and what AWS did about it"
          >
            The cache-philosophy shift
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Graviton4 — System Level Cache (SLC).</strong> 36 MB of L3 sits on
            the CMN-700 mesh as a unified, shared, last-level cache. Each of the 96
            cores effectively shares this 36 MB, which works out to ~375 KB of L3 per
            core if you divided it evenly. The mesh has ~32 bytes/cycle bidirectional
            bandwidth per stop. CMN-700 also requires a snoop filter sized at least
            1.5× aggregate L2 capacity — for 96 × 2 MB L2 = 192 MB exclusive L2, the
            snoop filter eats ~288 MB of on-mesh storage, comparable in area to the
            SLC itself.
          </Box>
          <Box variant="p">
            <strong>Graviton5 — distributed L3.</strong> 192 MB of L3 distributed
            across the CMN-S3 mesh. At 192 cores that is exactly 1 MB of L3 per core —
            5.3× the per-chip L3 of Graviton4 and 2.67× per-core. The shift is not
            cosmetic. Doubling cores massively increases mesh traffic and contention
            on a unified cache; distributing L3 across the mesh enables better
            coherence scaling and predictable latency. AWS claims CMN-S3 delivers
            ~33% lower inter-core latency vs Graviton4.
          </Box>
          <Alert type="warning" header="Per-core DRAM bandwidth dropped 36%">
            Graviton4: 12 channels of DDR5-5600 = 537.6 GB/s aggregate divided across
            96 cores = <strong>5.6 GB/s per core</strong>. Graviton5: 12 channels of
            DDR5-7200 = 691.2 GB/s aggregate divided across 192 cores ={' '}
            <strong>3.6 GB/s per core</strong>. Aggregate bandwidth went up; per-core
            bandwidth went down. The 5.3× larger L3 is explicit compensation —
            workloads with hot working sets that fit in L3 see &gt;100 GB/s effective
            per-core bandwidth from cache, an order-of-magnitude shift over what they
            would see going to DRAM. Workloads that miss L3 routinely will land worse
            on Graviton5 than Graviton4 on a per-thread basis.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What AWS publishes about Graviton5 ML uplift, and what is actually doing the work"
          >
            ML and SLM inference on Graviton5
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The vendor-cited number.</strong> AWS&apos;s only first-party ML
            performance figure for Graviton5 vs Graviton4 is &ldquo;up to 35% faster
            for machine learning workloads&rdquo; — published on the M9g preview
            announcement and the M9g product page
            ({' '}
            <Link
              external
              href="https://www.aboutamazon.com/news/aws/aws-graviton-5-cpu-amazon-ec2"
            >
              About Amazon — AWS Graviton 5
            </Link>
            , accessed 2026-04-25). Larger uplifts in the 80%+ range that circulate
            in coverage usually trace back to Arm&apos;s &ldquo;up to 84% in AI data
            analytics&rdquo; V3-vs-V2 marketing claim — which is data analytics, not
            SLM inference, and is reported by third parties rather than vendor docs.
          </Box>
          <Box variant="p">
            <strong>What the Int8 FMA matrix accumulator actually is, and where it
            lives.</strong> Neoverse V3 supports FEAT_I8MM, which provides the SMMLA
            (signed), UMMLA (unsigned), and USMMLA (mixed) instructions — these are
            the Int8 matrix-multiply-accumulate operations that multiply 4×4 8-bit
            submatrices into 32-bit accumulators in a single instruction. They are
            the canonical Int8 FMA accumulator that quantized SLM inference depends
            on. V3 also supports FEAT_BF16, which provides BFMMLA (BF16
            matrix-multiply-accumulate) and the SDOT / UDOT dot-product family.
            Confirmed via the ARM Neoverse V3 product page
            ({' '}
            <Link external href="https://www.arm.com/products/silicon-ip-cpu/neoverse/neoverse-v3">
              ARM Neoverse V3
            </Link>
            , accessed 2026-04-25) and the upstream GCC compiler V3 / V3AE feature
            definitions which enumerate (I8MM, BF16, ...) for both V2 and V3.
          </Box>
          <Box variant="p">
            <strong>What changed in V3 vs V2.</strong> FEAT_I8MM and FEAT_BF16 are
            inherited from Neoverse V2 — both generations ship SMMLA / UMMLA / BFMMLA.
            Graviton4 (V2) and Graviton5 (V3) therefore both expose the Int8 FMA
            matrix accumulator at the ISA level. ARM positions V3 as &ldquo;double-
            digit performance improvements over Neoverse V2 on cloud and ML
            applications&rdquo; — roughly 13% IPC plus the platform-level upgrade.
            The Int8 FMA accumulator is the same instruction; it just runs against a
            faster memory hierarchy on V3. Graviton3 (c7g) already exploited these
            instructions in 2023 for INT8 quantized inference via ONNX Runtime
            BFMMLA / SMMLA / UMMLA kernels
            ({' '}
            <Link
              external
              href="https://github.com/aws/aws-graviton-getting-started"
            >
              AWS Graviton Getting Started
            </Link>
            , accessed 2026-04-25).
          </Box>
          <Alert type="info" header="Where the SLM uplift actually comes from">
            On Graviton5, the dominant lever for SLM (Small Language Model) inference
            is the <strong>memory subsystem</strong>, not the ISA. DDR5-7200 versus
            Graviton4&apos;s DDR5-5600 delivers +28.6% per-channel bandwidth. The
            distributed L3 cache is 5.3× the per-chip total. Inter-core latency drops
            ~33%. SLM decode is memory-bandwidth bound (Section 22), so the
            memory-tier upgrade is the bigger lever than any matmul-instruction
            change. SVE2 + BFMMLA / SMMLA continue to do the matmul work they were
            already doing on Graviton3 / 4 — the cache and DRAM path is what got
            faster.
          </Alert>
          <Alert type="warning" header="UNKNOWN">
            SME (Scalable Matrix Extension) and SME2 enablement on Poseidon (Neoverse
            V3) is not confirmed in the vendor pages fetched. Arm positions SME as a
            future Neoverse CSS deliverable, with SME2 currently shipping on client
            Lumex CSS. AWS has not stated SME / SME2 support on Graviton5. Treat any
            &ldquo;Graviton5 has SME&rdquo; claim as unverified until the V3 TRM
            confirms.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What capital-markets and inference workloads should care about"
          >
            What this means for workload placement
          </Header>
        }
      >
        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <Box variant="h3">Wins on Graviton5</Box>
            <ul>
              <li>Workloads with hot working sets that fit in 1 MB / core L3</li>
              <li>KV-cache management, tokenizer fleets, embedding servers</li>
              <li>Microservices with locality-friendly data structures</li>
              <li>Single-socket deployments (NUMA eliminated)</li>
              <li>Workloads sensitive to inter-core latency</li>
            </ul>
          </div>
          <div>
            <Box variant="h3">Watch out on Graviton5</Box>
            <ul>
              <li>Workloads streaming through datasets larger than L3</li>
              <li>JVM-heavy GC where heap traversal misses cache</li>
              <li>Bandwidth-per-thread-sensitive databases</li>
              <li>Workloads that benefited from Graviton4&apos;s 5.6 GB/s per-core BW</li>
              <li>Code that assumed cross-socket cost (it is now zero)</li>
            </ul>
          </div>
        </ColumnLayout>
        <ExpandableSection headerText="Why eliminating NUMA matters more than it looks">
          <Box variant="p">
            Graviton4 supported 2-socket configurations with ~138 ns cross-socket
            latency. Many workloads (MySQL replication, JVM with a large heap, tightly
            coupled microservices) had to be NUMA-pinned to avoid the penalty.
            Graviton5 fits all 192 cores in a single socket — no cross-socket fabric to
            worry about, no scheduler tuning to keep threads on the &ldquo;right&rdquo;
            half. That is a real operational simplification, and it changes the
            performance profile of code that previously paid implicit NUMA tax.
          </Box>
        </ExpandableSection>
      </Container>
    </SpaceBetween>
  );
}
