import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Alert from '@cloudscape-design/components/alert';
import Table from '@cloudscape-design/components/table';
import Link from '@cloudscape-design/components/link';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { Xeon6Topology } from '../components/Xeon6Topology';

interface SkuRow {
  sku: string;
  cores: string;
  channels: string;
  ddrSpeed: string;
  notes: string;
}

const skuRows: SkuRow[] = [
  { sku: 'Xeon 6 6900P (LGA 7529)', cores: 'up to 128', channels: '12', ddrSpeed: 'DDR5-6400 / MRDIMM-8800', notes: 'Granite Rapids-AP. AMX FP16. SNC3.' },
  { sku: 'Xeon 6 6700P / 6500P (LGA 4710)', cores: 'up to 86', channels: '8', ddrSpeed: 'DDR5-6400 / MRDIMM-8000', notes: '4 / 8-socket capable.' },
  { sku: 'Xeon 6 6900E (Sierra Forest)', cores: 'up to 288 E-cores', channels: '12', ddrSpeed: 'DDR5-6400', notes: 'E-cores; no AVX-512, no AMX.' },
];

interface AmxRow {
  format: string;
  generation: string;
  notes: string;
}

const amxRows: AmxRow[] = [
  { format: 'BF16', generation: 'Sapphire Rapids (Xeon 4) onward', notes: 'Tile registers + TDPBF16PS' },
  { format: 'INT8', generation: 'Sapphire Rapids onward', notes: 'TDPBSSD / TDPBSUD / TDPBUSD / TDPBUUD' },
  { format: 'FP16', generation: 'Granite Rapids (Xeon 6) NEW', notes: 'TDPFP16PS — first FP16 tile matmul on Xeon' },
];

export function IntelXeon6() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Granite Rapids — three compute tiles, two IO dies, AMX FP16, MRDIMM up to DDR5-8800"
          >
            Intel Xeon 6 (Granite Rapids)
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>What Xeon 6 is.</strong> Intel&apos;s 6th-generation Xeon Scalable
            line, branded as Xeon 6. Two distinct silicon families share the brand:
            Granite Rapids (P-cores, Redwood Cove microarchitecture) and Sierra Forest
            (E-cores, Crestmont). This section covers Granite Rapids — the P-core
            family that competes with EPYC Turin in the inference-host space.
          </Box>
          <Box variant="p">
            <strong>What is new vs Emerald Rapids.</strong> Disaggregated chiplet
            architecture (3 compute tiles + 2 I/O dies on EMIB), wider mesh, AMX FP16
            (a new precision in the AMX instruction set), MRDIMM at DDR5-8800 on the
            6900P, and CXL 2.0 directly from the I/O die. The L3 grew to 504 MB
            declared (480 MB measured by third parties on the 6985P-C), and the L2 per
            P-core stayed at 2 MB but with a deeper 64-entry miss queue
            ({' '}
            <Link
              external
              href="https://chipsandcheese.com/p/a-look-into-intel-xeon-6s-memory"
            >
              Chips and Cheese — Xeon 6 memory
            </Link>
            , accessed 2026-04-23).
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Three compute tiles + two IO dies, joined by EMIB"
          >
            Topology
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Xeon6Topology />
          <Box variant="p">
            The compute tiles host the cores, L2, L3 slice, and four DDR5 controllers
            each. The IO dies host PCIe 5.0, UPI (socket-to-socket), CXL 2.0, and the
            on-die accelerators (DSA, IAA, QAT, DLB). Compute tiles communicate with
            external hosts only via the IO dies — there is no direct off-package path
            from the compute tiles. EMIB (Embedded Multi-die Interconnect Bridge)
            carries the high-density signals across the substrate. MDF (Modular Data
            Fabric) stops at die boundaries run at 2.5 GHz and handle the logical mesh
            protocol across boundaries
            ({' '}
            <Link
              external
              href="https://www.nextplatform.com/2024/09/24/intel-shoots-granite-rapids-xeon-6-into-the-datacenter/"
            >
              NextPlatform — Granite Rapids
            </Link>
            , accessed 2026-04-23).
          </Box>
          <Alert type="info" header="SNC3 is the default NUMA mode">
            Each compute tile is its own NUMA domain — three NUMA nodes per socket,
            each backed by ~160 MB of L3 and 4 DDR5 channels. The alternative
            &ldquo;HEX mode&rdquo; (former SNC1) collapses to a single NUMA with all
            DRAM striped across all 12 controllers. SNC3 is correct for low-latency
            workloads with thread / memory affinity; HEX for batch throughput without
            NUMA-aware code.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The matmul instruction set that puts a tensor unit on a host CPU"
          >
            AMX — including the new FP16 in Xeon 6
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>What AMX is.</strong> Advanced Matrix Extensions — Intel&apos;s
            tile-register-based matmul ISA. AMX defines 8 tile registers, each holding
            16 rows of up to 64 bytes (1 KB max per tile), with instructions that
            multiply two tiles into a third. AMX runs as a CPU-thread instruction —
            no host/device boundary, no PCIe — and is managed by the OS via XSAVE /
            XRSTOR. The tile registers source operands from L1D
            ({' '}
            <Link
              external
              href="https://www.intel.com/content/www/us/en/developer/articles/technical/advanced-matrix-extensions-overview.html"
            >
              Intel AMX overview
            </Link>
            , accessed 2026-04-23).
          </Box>
          <Table
            items={amxRows}
            columnDefinitions={[
              { id: 'fmt', header: 'Precision', cell: (r) => r.format, minWidth: 140 },
              { id: 'gen', header: 'First generation', cell: (r) => r.generation },
              { id: 'notes', header: 'Notes', cell: (r) => r.notes },
            ]}
            variant="embedded"
            wrapLines
          />
          <Box variant="p">
            <strong>AMX FP16 is the Xeon 6 specific addition.</strong> Sapphire and
            Emerald Rapids supported BF16 and INT8 only. Granite Rapids adds the
            TDPFP16PS instruction — FP16 tile matmul. For inference workloads
            quantized to FP16 or BF16, this brings Xeon 6 close to the per-thread
            tensor density of an entry-level GPU for small-batch host-side
            inference.
          </Box>
          <Box variant="p">
            <strong>The full AMX instruction set.</strong> Tile state is configured
            with LDTILECFG (load tile config) using a TILECFG palette — palette_id=1
            is the only currently-defined palette, providing 8 tile registers each
            up to 16 rows × 64 bytes. Tiles are loaded with TILELOADD / TILELOADDT1,
            stored with TILESTORED, zeroed with TILEZERO. The matmul family is
            TDPBF16PS (BF16 dot-product producing single-precision), TDPFP16PS
            (FP16, Granite Rapids), and TDPBSSD / TDPBSUD / TDPBUSD / TDPBUUD for
            INT8 with signed / unsigned operand combinations.
          </Box>
          <Alert type="info" header="oneDNN dispatcher tiers — the cleanest authoritative anchor for AMX generations">
            oneDNN exposes three AMX dispatcher tiers that map cleanly onto the
            Intel silicon timeline: <code>AVX10_1_512_AMX</code> (Sapphire Rapids
            and Emerald Rapids — BF16 and INT8 only), <code>AVX10_1_512_AMX_FP16
            </code> (Granite Rapids — adds TDPFP16PS), and <code>AVX10_2_AMX_2
            </code> (next-generation Xeon, AMX-2 with extended capabilities).
            Production code paths reach AMX through oneDNN, which is what PyTorch,
            TensorFlow, and OpenVINO use under the hood.
          </Alert>
          <ExpandableSection headerText="IPEX (Intel Extension for PyTorch) is archived — AMX paths now live in mainline PyTorch">
            <Box variant="p">
              IPEX was Intel&apos;s historical fast path for AMX-accelerated
              inference, providing optimized operators ahead of mainline PyTorch.
              The IPEX repository was archived as of March 30, 2026 — the AMX
              code paths have been upstreamed into mainline PyTorch and are
              accessed transparently via <code>torch.compile</code> on Xeon 6
              hardware. Production workflows that previously imported{' '}
              <code>intel_extension_for_pytorch</code> can now drop the import
              and rely on stock PyTorch.
            </Box>
          </ExpandableSection>
          <ExpandableSection headerText="AMX as the host-side path for SLM inference">
            <Box variant="p">
              The natural pairing for AMX FP16 is Small Language Model inference
              (Section 24). A 1-7B parameter SLM in FP16 fits comfortably in
              Xeon 6&apos;s 504 MB declared L3 plus DDR5-7200 / MRDIMM-8800
              channels. The latency profile for SLM decode on AMX is competitive
              with entry-level GPU inference at small batch sizes — particularly
              attractive for multi-tenant deployments where the cost of a
              dedicated accelerator per tenant does not pencil out.
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="A measured number from AWS, and where the host mesh runs out of headroom"
          >
            Memory bandwidth in the wild
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            On AWS r8i (custom Xeon 6 with DDR5-7200 RDIMMs), Chips and Cheese measured
            STREAM triad at <strong>691.62 GB/s</strong> per socket — 2.14× their
            Emerald Rapids measurement of 323.45 GB/s, hitting essentially the
            12-channel theoretical peak. AWS chose DDR5-7200 RDIMMs rather than
            MRDIMM-8800 for M8i / R8i, splitting the difference between the DDR5-6400
            baseline and the full-speed MRDIMM ceiling
            ({' '}
            <Link
              external
              href="https://aws.amazon.com/ec2/instance-types/m8i/"
            >
              AWS M8i instance page
            </Link>
            , accessed 2026-04-23).
          </Box>
          <Alert type="warning" header="Mesh congestion is the binding constraint">
            Per-core L3 read bandwidth on Granite Rapids is ~30 GB/s; on AMD Turin it
            is closer to 261 GB/s due to the per-CCX L3 architecture. At chip scale
            this means ~11 GB/s per core on Granite Rapids vs ~98 GB/s per core on
            Turin across all active cores. The mesh fabric carries every L3 access,
            and at high core counts that is a real architectural constraint. SNC3
            partial-mitigates by keeping accesses tile-local.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The lineup that ships in production"
          >
            SKU lineup
          </Header>
        }
      >
        <Table
          items={skuRows}
          columnDefinitions={[
            { id: 'sku', header: 'SKU', cell: (r) => r.sku, minWidth: 220 },
            { id: 'cores', header: 'Cores', cell: (r) => r.cores },
            { id: 'ch', header: 'DDR channels', cell: (r) => r.channels },
            { id: 'speed', header: 'DDR / MRDIMM speed', cell: (r) => r.ddrSpeed },
            { id: 'notes', header: 'Notes', cell: (r) => r.notes },
          ]}
          variant="embedded"
          wrapLines
        />
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Where Xeon 6 wins and where it does not"
          >
            Workload fit
          </Header>
        }
      >
        <ExpandableSection headerText="Where Xeon 6 wins" defaultExpanded>
          <ul>
            <li>AMX-emitting kernels — especially with the new FP16 instruction</li>
            <li>Bandwidth-hungry workloads on 6900P with MRDIMM-8800</li>
            <li>Capacity-heavy workloads up to 6 TB / socket</li>
            <li>Mixed-workload servers that benefit from on-die accelerators (DSA, QAT, IAA)</li>
            <li>CXL 2.0 attached pooled memory (direct from IO die)</li>
            <li>Workloads with NUMA-aware code that benefits from SNC3 tile partitioning</li>
          </ul>
        </ExpandableSection>
        <ExpandableSection headerText="Where Xeon 6 struggles">
          <ul>
            <li>Workloads bottlenecked on per-core L3 bandwidth (mesh congestion)</li>
            <li>Cross-tile-heavy workloads — each EMIB crossing adds ~24 ns</li>
            <li>Single-thread bandwidth comparisons vs Turin&apos;s per-CCX L3</li>
            <li>Highest core-count workloads — Turin Dense ships 192 cores</li>
          </ul>
        </ExpandableSection>
      </Container>
    </SpaceBetween>
  );
}
