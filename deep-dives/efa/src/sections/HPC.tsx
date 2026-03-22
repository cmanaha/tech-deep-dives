import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import ExpandableSection from '@cloudscape-design/components/expandable-section';

export function HPC() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header variant="h1" description="Can my tightly-coupled MPI simulation run in the cloud without performance degradation?">
            EFA for Traditional HPC
          </Header>
        }
      >
        <Box variant="p">
          EFA was originally built for HPC. The AI/ML use case came later as distributed
          training grew. For HPC, EFA enables <strong>tightly-coupled MPI workloads</strong> that
          exchange boundary conditions every timestep — workloads that were historically
          impossible in the cloud due to network latency and jitter.
        </Box>
      </Container>

      <Container header={<Header variant="h2">HPC Workload Categories</Header>}>
        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <Box variant="h3">Tightly Coupled (EFA critical)</Box>
            <ul>
              <li><strong>Weather/Climate:</strong> WRF, MPAS, IFS — domain decomposition, halo exchange every timestep</li>
              <li><strong>CFD:</strong> OpenFOAM, ANSYS Fluent — mesh partitioning, neighbor communication</li>
              <li><strong>Molecular Dynamics:</strong> GROMACS, LAMMPS, NAMD — particle domain decomposition</li>
              <li><strong>Seismic Processing:</strong> Finite-difference wave propagation</li>
              <li><strong>Structural Analysis:</strong> ABAQUS, LS-DYNA — implicit solvers with global coupling</li>
            </ul>
          </div>
          <div>
            <Box variant="h3">Loosely Coupled (EFA optional)</Box>
            <ul>
              <li><strong>Monte Carlo:</strong> Independent trajectories, minimal communication</li>
              <li><strong>Parameter sweeps:</strong> Embarrassingly parallel, no inter-rank communication</li>
              <li><strong>Genomics pipelines:</strong> BWA, GATK — mostly I/O bound, not network bound</li>
              <li><strong>Rendering:</strong> Frame-independent, scatter-gather at boundaries</li>
            </ul>
          </div>
        </ColumnLayout>
      </Container>

      <Container header={<Header variant="h2">Measured Performance (EFA vs ENA)</Header>}>
        <ColumnLayout columns={3} variant="text-grid">
          <div>
            <Box variant="h3">CFD (OpenFOAM)</Box>
            <Box variant="p">
              97-million-cell external aerodynamics on c5n.18xlarge:
              <strong> 98.4% parallel efficiency</strong> at 1,008 cores (28 instances).
              <strong> 4x improvement</strong> in scaling over ENA for standard CFD.
              Applications scale extra-linearly to over 200 cores.
            </Box>
          </div>
          <div>
            <Box variant="h3">Weather (WRF)</Box>
            <Box variant="p">
              CONUS 2.5km benchmark on hpc7a: enabling multi-rail EFA
              (<code>I_MPI_MULTIRAIL=1</code>) delivered <strong>10% speedup at 32
              instances</strong> and <strong>30%+ improvement at 192 instances</strong>.
              Multi-rail is critical for instances with 2+ EFA interfaces.
            </Box>
          </div>
          <div>
            <Box variant="h3">Molecular Dynamics</Box>
            <Box variant="p">
              AMBER, GROMACS, NAMD, LAMMPS: up to <strong>2.05x speedup</strong> at
              2 instances and 1.2x at 768 cores versus ENA networking. EFA&apos;s
              low-latency benefits are most pronounced at moderate scale where
              communication-to-compute ratio is highest.
            </Box>
          </div>
        </ColumnLayout>
      </Container>

      <Container header={<Header variant="h2">MPI + EFA Integration</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            MPI (Message Passing Interface) is the standard for HPC communication.
            EFA integrates via libfabric&apos;s EFA provider. Supported MPI implementations:
          </Box>
          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="h3">Open MPI</Box>
              <Box variant="p">
                Use <code>--mca mtl ofi</code> to select the OFI (libfabric) layer.
                EFA is selected automatically when the EFA provider is available.
              </Box>
            </div>
            <div>
              <Box variant="h3">Intel MPI</Box>
              <Box variant="p">
                Set <code>FI_PROVIDER=efa</code>, <code>I_MPI_OFI_LIBRARY_INTERNAL=0</code>,
                and <code>I_MPI_MULTIRAIL=1</code> (for instances with 2+ EFA interfaces).
                Intel MPI has its own libfabric — point it to the system libfabric with EFA support.
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

          <ExpandableSection headerText="HPC-specific EFA considerations">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>Memory registration:</strong> EFA requires memory registration for
                zero-copy transfers. MPI implementations handle this automatically, but
                be aware that registered memory is pinned and cannot be swapped. For large
                HPC jobs, this can consume significant memory.
              </Box>
              <Box variant="p">
                <strong>Message sizes:</strong> EFA is most impactful for small messages
                (&lt;64KB) where kernel overhead dominates. For large messages, the bandwidth
                advantage is still significant but the latency improvement is less dramatic.
              </Box>
              <Box variant="p">
                <strong>Collectives:</strong> EFA accelerates all MPI collectives (Allreduce,
                Allgather, Bcast, Scatter, Gather). The benefit is proportional to how
                frequently your application calls collectives vs. compute.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">HPC Instance Selection</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            For CPU-only HPC with EFA, the dedicated HPC instance families offer the best
            price-performance. Key differentiator: <strong>HPC instances are only available
            in cluster placement groups</strong> and are designed for sustained compute.
          </Box>
          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="h3">Hpc7a (AMD)</Box>
              <Box variant="p">96 cores, 300 Gbps EFA. Best for floating-point heavy workloads. AMD EPYC with AVX-512.</Box>
            </div>
            <div>
              <Box variant="h3">Hpc7g (Graviton3)</Box>
              <Box variant="p">64 cores, 200 Gbps EFA. Best price-performance for ARM-compatible HPC codes.</Box>
            </div>
            <div>
              <Box variant="h3">Hpc6id (Intel)</Box>
              <Box variant="p">64 vCPUs, 200 Gbps EFA + 15.2TB NVMe. For HPC with local storage needs.</Box>
            </div>
            <div>
              <Box variant="h3">Hpc8a (AMD, newest)</Box>
              <Box variant="p">96 cores (EPYC 9005), 300 Gbps EFA, Nitro v6. 40% higher performance and 42% greater memory bandwidth than hpc7a.</Box>
            </div>
          </ColumnLayout>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
