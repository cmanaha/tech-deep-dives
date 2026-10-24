import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Table from '@cloudscape-design/components/table';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { AwsCompilerStack } from '../components/AwsCompilerStack';
import { Cite } from '../components/Cite';
import { S } from '../sources/AwsCompilersAndTooling';

interface ComponentRow {
  component: string;
  version: React.ReactNode;
}

const componentRows: ComponentRow[] = [
  {
    component: 'torch-neuronx (PyTorch NeuronX)',
    version: (
      <>
        2.9.0.2.15, released with Neuron 2.31.0
        <Cite s={S.pytorchNotes} />
      </>
    ),
  },
  {
    component: 'JAX NeuronX (jax-neuronx)',
    version: (
      <>
        0.10.0, supports up to JAX 0.9.0
        <Cite s={S.neuronReleaseNotes} />
      </>
    ),
  },
  {
    component: 'neuronx-cc',
    version: (
      <>
        2.27.5334.0
        <Cite
          s={S.neuronReleaseNotes}
          note="The compiler's release-notes page heads its Neuron 2.32.0 entry 2.27.5334.0, but its Latest version line reads 2.27.4747.0."
        />
        <Cite s={S.compilerNotes} />
      </>
    ),
  },
  {
    component: 'NKI',
    version: (
      <>
        0.6.0
        <Cite s={S.neuronReleaseNotes} />
      </>
    ),
  },
  {
    component: 'Neuron Runtime',
    version: (
      <>
        2.34.10.0
        <Cite s={S.neuronReleaseNotes} />
      </>
    ),
  },
  {
    component: 'nrtpy (beta)',
    version: (
      <>
        2.34.10
        <Cite s={S.neuronReleaseNotes} />
      </>
    ),
  },
  {
    component: 'vLLM Neuron (beta)',
    version: (
      <>
        0.24.0.1.1.0
        <Cite s={S.neuronReleaseNotes} />
      </>
    ),
  },
  {
    component: 'NxD Inference (maintenance)',
    version: (
      <>
        0.10.18399
        <Cite s={S.neuronReleaseNotes} />
      </>
    ),
  },
  {
    component: 'Neuron Developer Tools',
    version: (
      <>
        2.32.28.0
        <Cite s={S.neuronReleaseNotes} />
      </>
    ),
  },
  {
    component: 'TorchNeuron',
    version: (
      <>
        Closed beta
        <Cite s={S.pytorchNative} />
      </>
    ),
  },
];

export function AwsCompilersAndTooling() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Which path a model takes to a NEFF, the compiler default since Neuron 2.27.0 that sets your matmul precision, and which library, profiler and kernel path to reach for"
          >
            AWS Compilers and Kernel Tooling
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>What the stack is.</strong> A PyTorch or JAX model reaches Trainium through the
            Neuron SDK. A framework integration captures the model as an XLA (Accelerated Linear
            Algebra) graph; neuronx-cc, the Neuron Graph Compiler, compiles it ahead of time into a
            NEFF (Neuron Executable File Format); and the Neuron Runtime loads the NEFF and runs
            it.
            <Cite s={S.neuronCompiler} /> This is the AWS counterpart to{' '}
            <em>NVIDIA Compilers and Kernel Tooling</em>; <em>AWS Trainium, Inferentia and Neuron</em>{' '}
            covers the NeuronCore it targets.
          </Box>
          <Box variant="p">
            <strong>The NEFF is the schedule.</strong> The compiler back end allocates memory and
            fixes the instruction order before the model runs
            <Cite s={S.nkiOverview} />, so no warp scheduler makes those choices at run time.
            Trainium2 and Trainium3 still support dynamic shapes and control flow in their ISA
            (instruction set architecture)
            <Cite s={S.trainium2Arch} />
            <Cite s={S.trainium3Arch} />, and NKI (Neuron Kernel Interface) 0.6.0 adds
            data-dependent loops at run time.
            <Cite s={S.neuronWhatsNew} /> Most tuning therefore happens before the run: the compiler
            flags, the graph you hand the compiler, and the kernels you write in NKI.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The graph compiler runs four stages before it emits the NEFF; an NKI kernel skips the first three and hands you what they would decide"
          >
            The default path, and where NKI enters
          </Header>
        }
      >
        <SpaceBetween size="m">
          <AwsCompilerStack />
          <Box variant="p">
            torch-neuronx captures a PyTorch model through PyTorch/XLA, and JAX NeuronX does the
            same for JAX.
            <Cite s={S.neuronCache} />
            <Cite s={S.jaxNeuronx} /> neuronx-cc then runs four stages: graph-level optimization
            in the XLA front end, including operator fusion; loop-level optimization, which sets
            layout, tiling and loop fusion; intrinsics mapping to hardware instructions; and the back
            end, which allocates memory and schedules instructions.
            <Cite s={S.nkiOverview} />
          </Box>
          <Box variant="p">
            <strong>NKI enters at the back end.</strong> An NKI kernel skips the first three stages:
            it compiles into an IR (intermediate representation) the back end consumes directly, and
            direct allocation lets it skip some back-end passes as well.
            <Cite s={S.nkiOverview} /> That is the source of NKI&apos;s instruction-level control:
            the tiling and instruction choices of stages 2 and 3 are yours.
          </Box>
          <Box variant="p">
            <strong>The PyTorch path is moving.</strong> PyTorch 2.9 is the last version on
            PyTorch/XLA; from PyTorch 2.10, Neuron uses TorchNeuron, and scripts need updating.
            <Cite s={S.pytorchNotes} /> TorchNeuron is a native PyTorch backend that runs eager mode
            and torch.compile, without Inductor. It is open source at aws-neuron/torch-neuronx and in
            public beta from Neuron 2.33.0 (October 2026).
            <Cite s={S.torchNeuron233} />
            <Cite s={S.torchNeuronxRepo} />
          </Box>
          <ExpandableSection headerText="Components and versions in Neuron 2.32.0 (August 2026)">
            <Table
              items={componentRows}
              columnDefinitions={[
                { id: 'component', header: 'Component', cell: (r) => r.component, minWidth: 170 },
                { id: 'version', header: 'Version', cell: (r) => r.version, minWidth: 150 },
              ]}
              variant="embedded"
              wrapLines
            />
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Since Neuron 2.27.0 an FP32 model's matmuls stay FP32 unless you ask for BF16, and an S3 compile cache stops every machine recompiling the same graph"
          >
            Two settings to choose before the first compile
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Matmul precision.</strong> neuronx-cc compiles matrix multiplications in the
            model&apos;s own data type by default (<code>--auto-cast=none</code>), a default since
            neuronx-cc 2.22.12471.0 (Neuron SDK 2.27.0); earlier versions cast FP32 (32-bit floating
            point) matmuls to BF16 (bfloat16). An FP32 model compiled without an explicit{' '}
            <code>--auto-cast</code> runs its matmuls in FP32, which can reduce inference throughput
            and increase compiled model size.
            <Cite s={S.neuronCompiler} /> For BF16 matmuls, pass{' '}
            <code>--auto-cast=matmult --auto-cast-type=bf16</code> (<code>all</code> casts every FP32
            operation and can lower accuracy); inside a framework, compiler options go in{' '}
            <code>NEURON_CC_FLAGS</code>.
            <Cite s={S.compilerCli} />
          </Box>
          <Box variant="p">
            <strong>The compile cache.</strong> Compiled graphs are cached under a hash of the
            compiler flags and the XLA graph; a new compiler version or a changed graph compiles
            again
            <Cite s={S.neuronCache} />, so changing <code>--auto-cast</code> recompiles, and each
            distinct graph pays its own compile. The default cache,{' '}
            <code>/var/tmp/neuron-compile-cache</code>, is local; point{' '}
            <code>NEURON_COMPILE_CACHE_URL</code> at a read-write <code>s3://</code> bucket and
            machines such as CI (continuous integration) runners reuse each other&apos;s compiled
            graphs. Graphs traced with frozen weights through <code>torch_neuronx.trace</code> are
            not cached.
            <Cite s={S.neuronCache} />
          </Box>
          <Box variant="code">
            <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{String.raw`# The default is --auto-cast=none: FP32 matmuls stay FP32. Ask for BF16 explicitly.
export NEURON_CC_FLAGS="--auto-cast=matmult --auto-cast-type=bf16"

# Share compiled graphs across machines. The bucket must exist and be read-write.
export NEURON_COMPILE_CACHE_URL="s3://your-bucket/neuron-compile-cache"`}</pre>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Start new serving work on vLLM Neuron and new training work on TorchNeuron; the NeuronX Distributed libraries are in maintenance"
          >
            Which library to serve and train on
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Serving.</strong> vLLM Neuron, in beta since July 2026, implements models inside
            the vLLM plugin with no dependency on NxD Inference (NeuronX Distributed Inference), and
            runs on Trn2 and Trn3. NxD Inference is in maintenance mode, and AWS directs its users
            to vLLM Neuron.
            <Cite s={S.neuronWhatsNew} /> Pin vLLM Neuron by release tag.
            <Cite s={S.vllmNeuronRepo} />
          </Box>
          <Box variant="p">
            <strong>Training.</strong> NeuronX Distributed Training and the NxD Core training APIs
            are in maintenance mode, with security fixes only.
            <Cite s={S.neuronWhatsNew} /> Training moves to TorchNeuron, which supports
            PyTorch&apos;s native FSDP (Fully Sharded Data Parallel) and DTensor (Distributed Tensor)
            APIs and runs TorchTitan with minimal code changes.
            <Cite s={S.pytorchNative} />
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The NEFF fixes the instruction order while the timing still varies; three tools show where the time goes, from device inventory to a full profile"
          >
            Profiling: neuron-ls, neuron-top and Neuron Explorer
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The order is fixed; the timing varies.</strong> Per-hop latency of the
            intra-node ring collectives is about 1 to 2 microseconds and depends on HBM (high
            bandwidth memory) load
            <Cite s={S.intranodeCollectives} />, and on Trn2 the Tensor Engine can throttle under
            dI/dt current limits.
            <Cite s={S.devToolsNotes} /> Run time can therefore differ between runs of the same
            NEFF; a profile of the real run shows where it went.{' '}
            <em>Determinism: NEFF and GPU Reproducibility</em> covers what a fixed order means for
            reproducible output.
          </Box>
          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="h3">neuron-ls</Box>
              <Box variant="p">
                Lists the Neuron devices, the NeuronCore IDs on each, and their CPU and NUMA
                (Non-Uniform Memory Access) node affinity.
                <Cite s={S.devToolsNotes} />
              </Box>
            </div>
            <div>
              <Box variant="h3">neuron-top</Box>
              <Box variant="p">
                Shows live NeuronCore and vCPU utilization and memory usage.
                <Cite s={S.neuronTopGuide} />
              </Box>
            </div>
            <div>
              <Box variant="h3">Neuron Explorer</Box>
              <Box variant="p">
                The profiling suite that replaces Neuron Profiler and Profiler 2.0; its System
                Timeline shows device HBM usage.
                <Cite s={S.devToolsNotes} /> Capture with <code>neuron-explorer capture</code>, which
                replaces <code>neuron-profile capture</code> in Neuron 2.32.0; the old
                profiler&apos;s TensorBoard plugin is out of support.
                <Cite s={S.neuronWhatsNew} />
              </Box>
            </div>
          </ColumnLayout>
          <Box variant="p">
            Start with neuron-ls for the devices and their NUMA nodes, watch neuron-top while the
            job runs, and capture with Neuron Explorer when utilization is lower than you expect.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Check the NKI Library first; if you still need a kernel, write it, test it on a CPU, and time the NEFF it compiles to"
          >
            Writing a kernel in NKI
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">What NKI is</Box>
              <Box variant="p">
                A bare-metal language and compiler for Trainium and Inferentia, written in Python,
                with syntax and tile-level semantics similar to Triton and NumPy.
                <Cite s={S.nkiOverview} /> The author places tiles in SBUF (State Buffer) and PSUM
                (Partial Sum buffer) explicitly
                <Cite s={S.nkiTrnInf2Arch} />
                <Cite s={S.nkiTrn2Arch} />
                <Cite s={S.ncMatmul} />; in Triton, the compiler manages memory allocation and data
                movement.
                <Cite s={S.gluonIntro} /> NKI is stable from NKI 0.3.0 (Neuron 2.29.0).
                <Cite s={S.neuronWhatsNew} />
              </Box>
            </div>
            <div>
              <Box variant="h3">When to reach for it</Box>
              <Box variant="p">
                Check the NKI Library first: AWS&apos;s open-source (Apache 2.0) collection of
                optimized kernels
                <Cite s={S.neuronWhatsNew} />, here at its 2.32 tag.
                <Cite s={S.nkiLibraryRepo} /> Its MoE (mixture of experts) kernels, Router Top-K
                among them, shipped in Neuron 2.28.0.
                <Cite s={S.neuronWhatsNew} /> Write your own when the profile shows the
                compiler&apos;s kernel for an operator is the bottleneck, or when no standard
                operator expresses the kernel you need, such as a custom attention variant.
              </Box>
            </div>
          </ColumnLayout>
          <Box variant="p">
            <strong>Develop on a CPU, then time the NEFF.</strong> NKI&apos;s experimental CPU
            simulator runs a kernel without Trainium hardware: set <code>NKI_SIMULATOR=1</code> or
            call <code>nki.simulate(kernel)</code>.
            <Cite s={S.neuronWhatsNew} /> nrtpy (beta) then loads and runs the NEFF your kernel
            compiles to directly from Python, without PyTorch or JAX
            <Cite s={S.nkiOverview} />, so you can time the kernel on its own before it goes into a
            model.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
