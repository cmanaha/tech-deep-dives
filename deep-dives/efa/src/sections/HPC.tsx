import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { SourceRef } from '@tech-deep-dives/shared';
import type { DocRef } from '@tech-deep-dives/shared';

/**
 * EFA for Traditional HPC.
 *
 * Sourcing rule for this file (revamp/source-authority-standard.md): every
 * load-bearing claim carries a SourceRef. Every benchmark figure names the
 * benchmark, the instance type and what it was compared against, because
 * "EFA against ENA" is three different measurements depending on the pair.
 */

const ACCESSED = '2026-08-02';

const docs: Record<string, DocRef> = {
  hpc: {
    title: 'EC2 instance types: Specifications for high-performance computing instances',
    url: 'https://docs.aws.amazon.com/ec2/latest/instancetypes/hpc.html',
    tier: 1,
    accessed: ACCESSED,
  },
  efa: {
    title: 'EC2 User Guide: Elastic Fabric Adapter for AI/ML and HPC workloads',
    url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html',
    tier: 1,
    accessed: ACCESSED,
  },
  efaStart: {
    title: 'EC2 User Guide: Get started with EFA and MPI',
    url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa-start.html',
    tier: 1,
    accessed: ACCESSED,
  },
  hpc8a: {
    title: "AWS What's New: Announcing new high performance computing Amazon EC2 Hpc8a instances",
    url: 'https://aws.amazon.com/about-aws/whats-new/2026/02/announcing-amazon-ec2-hpc8a-instances/',
    tier: 2,
    accessed: ACCESSED,
  },
  multirail: {
    title:
      'AWS HPC Blog: Optimizing MPI application performance on hpc7a by effectively using both EFA devices',
    url: 'https://aws.amazon.com/blogs/hpc/optimizing-mpi-application-performance-on-hpc7a-by-effectively-using-both-efa-devices/',
    tier: 2,
    accessed: ACCESSED,
  },
  gen2: {
    title:
      'AWS HPC Blog: Second generation EFA, improving HPC and ML application performance in the cloud',
    url: 'https://aws.amazon.com/blogs/hpc/second-generation-efa-improving-hpc-and-ml-application-performance-in-the-cloud/',
    tier: 2,
    accessed: ACCESSED,
  },
  cfdDirect: {
    title: 'CFD Direct: OpenFOAM HPC with AWS EFA',
    url: 'https://cfd.direct/cloud/openfoam-hpc-aws-efa/',
    tier: 3,
    accessed: ACCESSED,
  },
};

export function HPC() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header variant="h1" description="Which simulations the fabric changes, how to point an MPI stack at it, and which family to buy.">
            EFA for Traditional HPC
          </Header>
        }
      >
        <Box variant="p">
          The HPC workloads EFA changes are the <strong>tightly-coupled</strong> ones, where MPI
          (Message Passing Interface) ranks wait on their neighbours every timestep and the wire
          sets the pace of the whole simulation. Which side of that line your code sits on decides
          whether the fabric is worth buying at all.
        </Box>
      </Container>

      <Container
        header={<Header variant="h2" description="Communication frequency puts your code in one column or the other, which is the first thing to settle.">Which HPC workloads the fabric actually changes</Header>}
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Split the field by how often a rank waits on its neighbours. Every-timestep exchange
            puts real time in the network, so the fabric moves the whole job; ranks that run alone
            are bounded by compute or by storage. The equivalent check on your own code is where
            its wall time goes, since it is the time spent inside MPI calls that the fabric acts on.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Tightly Coupled (EFA critical)</Box>
              <ul>
                <li><strong>Weather/Climate:</strong> WRF (Weather Research and Forecasting), MPAS, IFS: domain decomposition, halo exchange every timestep</li>
                <li><strong>CFD:</strong> OpenFOAM, ANSYS Fluent: mesh partitioning, neighbor communication</li>
                <li><strong>Molecular Dynamics:</strong> GROMACS, LAMMPS, NAMD: particle domain decomposition</li>
                <li><strong>Seismic Processing:</strong> Finite-difference wave propagation</li>
                <li><strong>Structural Analysis:</strong> ABAQUS, LS-DYNA: implicit solvers with global coupling</li>
              </ul>
            </div>
            <div>
              <Box variant="h3">Loosely Coupled (EFA optional)</Box>
              <ul>
                <li><strong>Monte Carlo and parameter sweeps:</strong> Independent trajectories or cases, minimal to no inter-rank communication</li>
                <li><strong>Genomics pipelines:</strong> BWA, GATK: bound by storage I/O</li>
                <li><strong>Rendering:</strong> Frame-independent, scatter-gather at boundaries</li>
              </ul>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>

      <Container
        header={<Header variant="h2" description="Three published results, each naming the pair it compares, so you can tell which one speaks to your decision.">Measured performance</Header>}
      >
        <ColumnLayout columns={3} variant="text-grid">
          <div>
            <Box variant="h3">CFD (OpenFOAM), EFA against standard networking</Box>
            <Box variant="p">
              Strong scaling of a fixed 97-million-cell case on c5n.18xlarge, 36 physical cores per
              instance. CFD Direct reports linear scaling at 1,008 cores across 28 instances, which
              they put at <strong>98.4%</strong> parallel efficiency. The same report puts standard
              networking at 70 to 90% scaling at 504 cores{' '}
              <SourceRef provenance="documented" doc={docs.cfdDirect} />. Parallel efficiency is
              what that comparison turns on, so it is the number to record on your own case.
            </Box>
          </div>
          <div>
            <Box variant="h3">Weather (WRF), multi-rail EFA against single-rail</Box>
            <Box variant="p">
              WRF v4.2.2 CONUS 2.5 km on hpc7a with Intel MPI 2021.9.0. Setting{' '}
              <code>I_MPI_MULTIRAIL=1</code> gave a <strong>10% increase in speedup at 32
              instances</strong>, and at 192 instances <strong>the increase was over 30%</strong>{' '}
              <SourceRef provenance="documented" doc={docs.multirail} />. This is EFA against EFA:
              what you leave on the table by using one of two EFA devices, and the only one of these
              three results that a single environment variable turns on.
            </Box>
          </div>
          <div>
            <Box variant="h3">Collectives, newer EFA software against older</Box>
            <Box variant="p">
              On a 128-GPU, 16-instance p4d.24xlarge cluster, AWS compared its January 2022 EFA
              software stack against November 2022 and reports allreduce performance up{' '}
              <strong>10% for large messages and 50% for small messages</strong>, with over 18%
              improvement for FSDP and over 8% for Megatron-LM on the same hardware{' '}
              <SourceRef provenance="documented" doc={docs.gen2} />. The stack moves under you, so
              re-measure after upgrades.
            </Box>
          </div>
        </ColumnLayout>
      </Container>

      <Container
        header={<Header variant="h2" description="EFA is reached through libfabric, so the MPI question is really which libfabric your MPI has loaded.">Wiring MPI to the fabric</Header>}
      >
        <SpaceBetween size="m">
          <Box variant="p">
            AWS names two MPI implementations as supported, Open MPI 4.1 and later and Intel MPI
            2019 Update 5 and later <SourceRef provenance="documented" doc={docs.efa} />. MPICH runs
            over the same libfabric provider, and AWS support covers the two named above.
          </Box>
          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="h3">Open MPI</Box>
              <Box variant="p">
                Use <code>--mca mtl ofi</code> to select the OFI (OpenFabrics Interfaces, libfabric) layer.
                EFA is selected automatically when the EFA provider is available.
              </Box>
            </div>
            <div>
              <Box variant="h3">Intel MPI</Box>
              <Box variant="p">
                Set <code>FI_PROVIDER=efa</code>, <code>I_MPI_OFI_LIBRARY_INTERNAL=0</code>,
                and <code>I_MPI_MULTIRAIL=1</code> on instances with two or more EFA interfaces,
                the setting behind the WRF result above. Intel MPI has its own libfabric; point it
                at the system libfabric with EFA support.
              </Box>
            </div>
            <div>
              <Box variant="h3">MPICH</Box>
              <Box variant="p">
                Configure with <code>--with-libfabric</code> pointing to EFA-enabled
                libfabric. Set <code>FI_PROVIDER=efa</code> at runtime.
              </Box>
            </div>
          </ColumnLayout>

          <ExpandableSection
            headerText="Memory registration and message size"
            headerDescription="Two properties that change how you budget RAM and how you read a benchmark"
          >
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>Memory registration:</strong> EFA requires memory registration for
                zero-copy transfers. MPI implementations do it for you, and registered pages stay
                pinned in RAM, so large jobs have to budget for those buffers up front.
              </Box>
              <Box variant="p">
                <strong>Message sizes:</strong> EFA helps most where per-message overhead dominates,
                which means small messages sent at high rate. Large messages still get the
                bandwidth advantage, with the per-message saving a smaller share of the transfer.
                The sourced figure above agrees in direction: the allreduce improvement AWS reports
                was 50% for small messages against 10% for large ones{' '}
                <SourceRef provenance="documented" doc={docs.gen2} />.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={<Header variant="h2" description="The dedicated HPC families are the price-performance answer and the most constrained families on EC2. Pick knowing both.">Choosing the instance</Header>}
      >
        <SpaceBetween size="m">
          <Box variant="p">
            For CPU-only HPC with EFA, the dedicated HPC families are narrow on purchase and shape
            options: no Spot, no Dedicated Hosts, no metal sizes, and Linux-first support{' '}
            <SourceRef provenance="documented" doc={docs.hpc} />. The placement constraint is the
            one every EFA workload has: traffic stays inside a single Availability Zone and a
            single VPC <SourceRef provenance="documented" doc={docs.efa} />. AWS recommends a
            cluster placement group and stops short of requiring one{' '}
            <SourceRef provenance="documented" doc={docs.efaStart} />.
          </Box>
          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="h3">Hpc7a (AMD, Nitro v4)</Box>
              <Box variant="p">
                Up to 192 cores of AMD EPYC 9R14, 300 Gbps EFA. Reaching 300 Gbps needs at least two
                ENIs on separate network cards; one card tops out at 150 Gbps{' '}
                <SourceRef provenance="documented" doc={docs.hpc} />. The multi-rail result above
                was measured here, so an idle second device is the 10% at 32 instances and over
                30% at 192 that AWS published{' '}
                <SourceRef provenance="documented" doc={docs.multirail} />.
              </Box>
            </div>
            <div>
              <Box variant="h3">Hpc7g (Graviton3E, Nitro v5)</Box>
              <Box variant="p">
                Up to 64 cores, 200 Gbps EFA, one network card{' '}
                <SourceRef provenance="documented" doc={docs.hpc} />. Every hpc7g size is RDMA read
                only <SourceRef provenance="documented" doc={docs.efa} />.
              </Box>
            </div>
            <div>
              <Box variant="h3">Hpc6id (Intel, Nitro v4)</Box>
              <Box variant="p">
                64 cores of Intel Xeon Ice Lake, 200 Gbps EFA, and 4 x 3800 GB of NVMe instance
                store for jobs that need local scratch{' '}
                <SourceRef provenance="documented" doc={docs.hpc} />.
              </Box>
            </div>
            <div>
              <Box variant="h3">Hpc8a (AMD, Nitro v6, newest)</Box>
              <Box variant="p">
                192 cores of AMD EPYC 9R45, 768 GiB, 300 Gbps EFA{' '}
                <SourceRef provenance="documented" doc={docs.hpc} />. AWS states up to 40% higher
                performance, up to 25% better price performance and up to 42% higher memory
                bandwidth than Hpc7a <SourceRef provenance="documented" doc={docs.hpc8a} />. Nitro
                v6 pairs with EFA v4.
              </Box>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
