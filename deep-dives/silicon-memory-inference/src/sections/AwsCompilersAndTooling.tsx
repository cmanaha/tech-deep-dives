import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Table from '@cloudscape-design/components/table';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { AwsCompilerStack } from '../components/AwsCompilerStack';
import { TorchNeuronStackDiagram } from '../components/TorchNeuronStackDiagram';
import { Cite } from '../components/Cite';
import { S } from '../sources/AwsCompilersAndTooling';

interface ComponentRow {
  component: string;
  version: React.ReactNode;
}

const componentRows: ComponentRow[] = [
  {
    component: 'TorchNeuron, torch-neuronx native backend (beta)',
    version: (
      <>
        2.14.3.0 for PyTorch 2.14, 2.13.3.0 for PyTorch 2.13
        <Cite s={S.releaseNotes233} />
        <Cite s={S.torchNeuronNotes} />
      </>
    ),
  },
  {
    component: 'PyTorch NeuronX, the XLA build of torch-neuronx (deprecated)',
    version: (
      <>
        2.9.0.2.15.32035
        <Cite s={S.releaseNotes233} />
        <Cite s={S.pytorchXlaNotes233} />
      </>
    ),
  },
  {
    component: 'JAX NeuronX (jax-neuronx)',
    version: (
      <>
        0.10.0.1.0.14198, supports JAX 0.7.0 to 0.10.0
        <Cite s={S.releaseNotes233} />
      </>
    ),
  },
  {
    component: 'neuronx-cc',
    version: (
      <>
        2.28.7631.0
        <Cite s={S.releaseNotes233} />
      </>
    ),
  },
  {
    component: 'NKI',
    version: (
      <>
        0.7.0
        <Cite s={S.releaseNotes233} />
      </>
    ),
  },
  {
    component: 'Neuron Runtime',
    version: (
      <>
        2.35.30.0
        <Cite s={S.releaseNotes233} />
      </>
    ),
  },
  {
    component: 'nrtpy (beta)',
    version: (
      <>
        2.35.30
        <Cite s={S.releaseNotes233} />
      </>
    ),
  },
  {
    component: 'TorchTitan Neuron (beta)',
    version: (
      <>
        0.2.2+neuron.1
        <Cite s={S.releaseNotes233} />
      </>
    ),
  },
  {
    component: 'vLLM Neuron (beta)',
    version: (
      <>
        0.29.0.1.2.0
        <Cite s={S.releaseNotes233} />
      </>
    ),
  },
  {
    component: 'Neuron Developer Tools',
    version: (
      <>
        2.33.38.0
        <Cite s={S.releaseNotes233} />
      </>
    ),
  },
  {
    component: 'Neuron Observer (beta)',
    version: (
      <>
        0.2.0
        <Cite s={S.releaseNotes233} />
      </>
    ),
  },
  {
    component: 'NxD Inference (NeuronX Distributed Inference)',
    version: (
      <>
        No 2.33.0 release; the last is 0.10.18399, in Neuron 2.31.0
        <Cite s={S.nxdiArchive} />
        <Cite
          s={S.releaseNotes233}
          note="NxD Inference does not appear in the Neuron 2.33.0 component table."
        />
      </>
    ),
  },
];

const eagerThenCompile = String.raw`import torch
import torch_neuronx  # only to call its own APIs, such as get_fallback_ops

model = MyModel().to("neuron")
x = torch.randn(8, 1024, device="neuron")
ref = model(x)

torch_neuronx.clear_op_tracking()
model(x)
print("CPU fallback ops:", torch_neuronx.get_fallback_ops())

compiled = torch.compile(model, backend="neuron", fullgraph=True, dynamic=False)
out = compiled(x)
torch.testing.assert_close(out.cpu(), ref.cpu(), rtol=1e-2, atol=1e-2)`;

export function AwsCompilersAndTooling() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Which of two front ends takes your model to a NEFF, how to get a PyTorch model through TorchNeuron, the compiler default that sets your matmul precision, and which library, profiler and kernel path to reach for"
          >
            AWS Compilers and Kernel Tooling
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>What the stack is.</strong> A PyTorch or JAX model reaches Trainium through the
            Neuron SDK, and one of two front ends turns it into a graph for neuronx-cc, the Neuron
            Graph Compiler. PyTorch on Trn2 and Trn3 runs on TorchNeuron, a native PyTorch backend: it
            takes each operator in eager mode, or a TorchDynamo graph under torch.compile, and lowers
            it to StableHLO MLIR (Multi-Level Intermediate Representation) through a vendored
            torch-mlir importer.
            <Cite s={S.torchNeuron233} /> JAX, and PyTorch on Trn1 and Inf2, stay on XLA
            (Accelerated Linear Algebra): JAX NeuronX compiles through XLA
            <Cite s={S.whatIsNeuron233} />, and PyTorch there uses the deprecated XLA build of
            torch-neuronx 2.9.
            <Cite s={S.pytorchXlaNotes233} /> Both front ends end the same way: neuronx-cc compiles
            the graph into a NEFF (Neuron Executable File Format), and the Neuron Runtime loads the
            NEFF and runs it.
            <Cite s={S.neuronCompiler} />
            <Cite s={S.vllmTorchNeuronDesign} /> This is the AWS counterpart to{' '}
            <em>NVIDIA Compilers and Kernel Tooling</em>; <em>AWS Trainium, Inferentia and Neuron</em>{' '}
            covers the NeuronCore it targets.
          </Box>
          <Box variant="p">
            <strong>The NEFF is the schedule.</strong> The compiler back end allocates memory and
            fixes the instruction order before the NEFF runs
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
            Whichever front end produced the graph, neuronx-cc runs four stages on it: graph-level
            optimization in the XLA front end, including operator fusion; loop-level optimization,
            which sets layout, tiling and loop fusion; intrinsics mapping to hardware instructions;
            and the back end, which allocates memory and schedules instructions.
            <Cite s={S.nkiOverview} />
          </Box>
          <Box variant="p">
            <strong>NKI enters at the back end.</strong> An NKI kernel skips the first three stages:
            it compiles into an IR (intermediate representation) the back end consumes directly, and
            direct allocation lets it skip some back-end passes as well.
            <Cite s={S.nkiOverview} /> That is the source of NKI&apos;s instruction-level control:
            the tiling and instruction choices of stages 2 and 3 are yours.
          </Box>
          <ExpandableSection headerText="Components and versions in Neuron 2.33.0 (October 2026)">
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
            description="Predict what your PyTorch code does on Trainium: eager mode compiles one NEFF per operator, torch.compile one NEFF per graph, and NKI kernels and collectives plug into both"
          >
            TorchNeuron: Trainium as the PyTorch device neuron
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            TorchNeuron is the open-source native PyTorch backend for Trainium, at
            aws-neuron/torch-neuronx, in public beta from Neuron 2.33.0 and supported on Trn2 and
            Trn3.
            <Cite s={S.torchNeuron233} />
            <Cite s={S.torchNeuronxRepo} /> It registers Trainium as a standard PyTorch device named{' '}
            <code>neuron</code> through PrivateUse1, PyTorch&apos;s extension point for custom
            hardware, and the PyTorch dispatcher routes ATen operators on <code>neuron</code>{' '}
            tensors to the Neuron implementations.
            <Cite s={S.torchNeuron233} />
            <Cite s={S.whatsNew233} />
            <Cite s={S.tnxDeviceRegistration} /> Installing the package is enough:{' '}
            <code>import torch</code> loads it through the <code>torch.backends</code> entry point
            the package registers.
            <Cite s={S.torchIndex233} />
            <Cite s={S.tnxEntryPoints} />
          </Box>
          <TorchNeuronStackDiagram />
          <Box variant="small" color="text-body-secondary">
            Schematic, not measured. Solid blue: the two TorchNeuron paths. Dashed green: NKI
            kernels entering both as custom ops. Dashed grey: the XLA path. The -O1 and -O2
            compiler levels are the ones the torch-neuronx source sets at tag v2.33.0, cited below.
          </Box>
          <Box variant="p">
            <strong>Eager mode compiles one NEFF per operator.</strong> Each ATen operator is lowered
            to StableHLO, compiled by neuronx-cc into its own NEFF on first use, and enqueued for
            asynchronous execution.
            <Cite s={S.torchNeuron233} /> In the source, these per-operator compiles run at{' '}
            <code>-O1</code>, the level the compiler reference describes as minimizing compile time
            <Cite s={S.tnxEagerOptLevel} />
            <Cite s={S.compilerCli} />, and the dispatcher caches each result under the
            operator&apos;s shapes, dtypes and strides, so a repeat call with the same signature
            skips Python and the compiler.
            <Cite s={S.tnxDispatchCacheKey} /> A new shape means a new compile. Because every
            operator is its own NEFF, intermediates travel through HBM (High Bandwidth Memory)
            between operators.
            <Cite s={S.pytorchBlog} /> Operation concatenation, which fuses eligible queued eager
            operators, is experimental and off by default (
            <code>TORCH_NEURONX_ENABLE_CONCATENATION=1</code> turns it on).
            <Cite s={S.torchNeuronNotes} />
          </Box>
          <Box variant="p">
            <strong>torch.compile compiles one NEFF per graph.</strong>{' '}
            <code>backend=&quot;neuron&quot;</code> is a TorchDynamo backend, registered through the{' '}
            <code>torch_dynamo_backends</code> entry point.
            <Cite s={S.tnxEntryPoints} /> TorchDynamo captures an FX graph, AOTAutograd
            (ahead-of-time autograd) generates the forward and backward graphs, the backend lowers
            them to StableHLO, and neuronx-cc compiles each graph into a single NEFF; TorchInductor
            plays no part.
            <Cite s={S.torchNeuron233} />
            <Cite s={S.tnxAotAutograd} /> In the source, graph compiles run at <code>-O2</code>,
            the compiler&apos;s default level, with{' '}
            <code>--model-type transformer --auto-cast=none</code>.
            <Cite s={S.tnxGraphCompileFlags} />
            <Cite s={S.compilerCli} /> The graph is what gives neuronx-cc room to optimize: a graph
            break splits the model into segments that compile separately, each with less context.
            <Cite s={S.torchNeuron233} />
          </Box>
          <Box variant="p">
            <strong>NKI kernels enter both paths as custom ops.</strong> Call a plain{' '}
            <code>@nki.jit</code> kernel on <code>neuron</code> tensors directly, or register it with{' '}
            <code>torch_neuronx.nki_op</code>, which creates a named <code>torch.library</code>{' '}
            custom op; reach for <code>nki_op</code> only when you need autograd or a named
            operator.
            <Cite s={S.torchNeuronNotes} />
            <Cite s={S.torchBestPractices} />
            <Cite s={S.tnxNkiCustomOp} />
            <Cite s={S.nkiTorchHook} /> Under torch.compile the kernel stays in the FX graph and
            torch-mlir emits it as a StableHLO custom call, so it compiles into the same NEFF as the
            operators around it and costs no graph break.
            <Cite s={S.tnxNkiCustomCall} />
            <Cite s={S.torchBestPractices} />
          </Box>
          <Box variant="p">
            <strong>Collectives go through a <code>neuron</code> c10d backend.</strong>{' '}
            <code>init_process_group(backend=&quot;neuron&quot;)</code> selects it. It implements the
            standard collectives and point-to-point operations, and DDP (Distributed Data
            Parallel), FSDP2 (Fully Sharded Data Parallel, <code>fully_shard</code>), DTensor
            (Distributed Tensor) tensor and sequence parallelism, pipeline parallelism and an
            experimental context-parallel API run on it, using the collective cores within a node
            and EFA (Elastic Fabric Adapter) between nodes.
            <Cite s={S.torchNeuronNotes} />
            <Cite s={S.torchNeuron233} />
            <Cite s={S.tnxC10dBackend} /> Configure sharding in NeuronCores rather than GPUs: tensor
            parallelism takes the number of NeuronCores to shard across, and FSDP needs no
            configuration change.
            <Cite s={S.torchIndex233} />
            <Cite s={S.torchNeuron233} />
          </Box>
          <Box variant="p">
            <strong>One package name, two products.</strong> <code>torch-neuronx</code> 2.13 and 2.14
            are TorchNeuron: 2.13.3.0 for PyTorch 2.13 and 2.14.3.0 for PyTorch 2.14, on Python 3.12
            to 3.14 and Ubuntu 24.04 or 26.04.
            <Cite s={S.torchNeuronNotes} /> <code>torch-neuronx</code> 2.9.0.2.15.32035 is the
            XLA-based PyTorch NeuronX build, deprecated, and the PyTorch path Trn1 and Inf2 keep
            <Cite s={S.pytorchXlaNotes233} />; PyTorch 2.9 is the last version on PyTorch/XLA.
            <Cite s={S.whatsNew233} /> Install the family that matches your PyTorch version and keep
            the pin, for example <code>torch==2.14.0</code> with <code>torch-neuronx==2.14.*</code>,
            because earlier torch-neuronx versions are the XLA-based product.
            <Cite s={S.torchNeuronNotes} />
            <Cite s={S.torchNeuronxRepo} /> Treat the support list as the boundary: the source
            recognizes Trn1 and Inf2 instance types and does not refuse them, so nothing stops an
            install outside it.
            <Cite s={S.tnxPlatforms} />
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Change the device string, find the operators that fell back to the CPU, then compile with static shapes and full graphs inside the 2.33.0 support boundary"
          >
            Getting a PyTorch model onto neuron and through torch.compile
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Port by changing the device.</strong> Change <code>.to(&apos;cuda&apos;)</code>{' '}
            to <code>.to(&apos;neuron&apos;)</code>; code written against{' '}
            <code>torch.accelerator</code> needs no change, mixed precision uses{' '}
            <code>torch.autocast(device_type=&quot;neuron&quot;)</code>, and torch.compile needs{' '}
            <code>backend=&quot;neuron&quot;</code> with CUDA-specific modes removed.
            <Cite s={S.torchIndex233} /> Code written for the XLA build moves off{' '}
            <code>torch_xla</code> and <code>xm.xla_device()</code> onto the <code>neuron</code>{' '}
            device.
            <Cite s={S.torchNeuronNotes} />
          </Box>
          <Box variant="p">
            <strong>Prove the model in eager mode, then compile it.</strong> Eager mode runs an
            operator that has no Neuron lowering on the CPU, so the model still runs, at a cost in
            performance.
            <Cite s={S.torchNeuronNotes} />
            <Cite s={S.torchBestPractices} /> AWS&apos;s pages disagree on whether you are told: the
            TorchNeuron overview says the fallback emits a warning, and the best-practices page
            says it is silent.
            <Cite s={S.torchNeuron233} />
            <Cite s={S.torchBestPractices} /> The code sides with silence: the logger drops the
            fallback line for an operator with no Neuron implementation, and the one warning it
            prints comes from an implemented operator whose lowering raised an error.
            <Cite s={S.tnxFallbackLogDropped} />
            <Cite s={S.tnxLoweringFailWarn} /> Read <code>torch_neuronx.get_fallback_ops()</code>{' '}
            after a run instead of the log.{' '}
            <code>TORCH_NEURONX_FALLBACK_ONLY_FOR_UNIMPLEMENTED_OPS=1</code> turns a failed lowering
            into an error, and only operators with no Neuron implementation still fall back.
            <Cite s={S.torchBestPractices} />
            <Cite s={S.tnxFallbackOnlyUnimplemented} />
          </Box>
          <Box variant="code">
            <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{eagerThenCompile}</pre>
          </Box>
          <Box variant="small" color="text-body-secondary">
            Practice 1 from Best practices for TorchNeuron, with the <code>torch_neuronx</code>{' '}
            import its fallback check needs.
            <Cite s={S.torchBestPractices} />
            <Cite s={S.torchIndex233} note="Import torch_neuronx only to call its own APIs." />
          </Box>
          <Box variant="p">
            <strong>Compile with static shapes and full graphs.</strong>
          </Box>
          <ul>
            <li>
              Pass <code>dynamic=False</code>. Every new input shape is another compile and another
              NEFF, so pad or bucket inputs to a fixed set of shapes.
              <Cite s={S.torchNeuronNotes} />
              <Cite s={S.torchCompileRef} /> The compile reference says the backend forces{' '}
              <code>dynamic=False</code>; in the source that setting goes into an options
              dictionary nothing reads, so set it yourself.
              <Cite s={S.torchCompileRef} />
              <Cite s={S.tnxDynamicUnread} />
            </li>
            <li>
              Set <code>fullgraph=True</code>, which AWS recommends for the Neuron path: a graph
              break then raises <code>torch._dynamo.exc.Unsupported</code> instead of splitting the
              model.
              <Cite s={S.torchCompileRef} />
              <Cite s={S.torchNeuron233} />
            </li>
            <li>
              Leave <code>mode</code> at <code>&quot;default&quot;</code>:{' '}
              <code>reduce-overhead</code> and the <code>max-autotune</code> modes log a warning and
              run as default.
              <Cite s={S.torchCompileRef} />
            </li>
            <li>
              Expect forced graph breaks at <code>torch._grouped_mm</code> and{' '}
              <code>torch.nn.functional.grouped_mm</code> (always), at <code>torch.sort</code> over
              more than 16,384 elements, at <code>torch.topk</code> with k of 16,384 or more, and at
              any operation with no Neuron lowering.
              <Cite s={S.torchCompileRef} /> Grouped GEMMs (general matrix multiplies) carry the
              expert computation in MoE (mixture of experts) models, so under{' '}
              <code>fullgraph=True</code> an MoE model raises: keep the experts outside the
              compiled region.
              <Cite s={S.torchtitanAbout} />
            </li>
            <li>
              A captured graph that fails to lower raises by default.{' '}
              <code>TORCH_NEURONX_DISABLE_FALLBACK_EXECUTION=0</code> runs it operator by operator
              instead, and the best practices advise leaving the default, because a silent fallback
              can make a broken graph look like it works.
              <Cite s={S.torchCompileRef} />
              <Cite s={S.tnxCompileRaises} />
              <Cite s={S.torchBestPractices} />
            </li>
            <li>
              If the whole model will not compile yet, compile the hot regions: torch.compile can
              wrap one submodule while the rest stays in eager mode.
              <Cite s={S.torchBestPractices} />
            </li>
          </ul>
          <Box variant="p">
            <strong>The 2.33.0 support boundary.</strong> This release does not support{' '}
            <code>torch.sparse</code>, <code>torch.func</code>, <code>torch.nested</code> or{' '}
            <code>torch.distributions</code>, and has no TorchAO integration and no composite MXFP8
            (microscaling 8-bit floating point) data type support. Real-to-complex transforms such
            as <code>torch.fft.rfft</code> run on the device; the rest of <code>torch.fft</code>{' '}
            runs on the CPU.
            <Cite s={S.torchNeuronNotes} /> FP8 (8-bit floating point) requires Trn3, and the
            source disables the FP8 dtype mapping on Trn2.
            <Cite s={S.torchNeuron233} />
            <Cite s={S.tnxFp8Trn2} /> AWS also excludes forward-mode automatic differentiation from
            the first release.
            <Cite s={S.pytorchBlog} />
          </Box>
          <ExpandableSection headerText="How mature the beta is: published coverage and speed figures, and who produced them">
            <SpaceBetween size="s">
              <Box variant="p">
                AWS reports that its September 2026 sweep of about 100,000 Hugging Face models, each
                run in a reduced configuration, passed 95.6% in eager mode and 96.6% under
                torch.compile. For each model the sweep records whether it loads, runs forward and
                backward, and compiles, and which operators fell back to the CPU; the post does not
                say whether a model with CPU fallbacks counts as a pass.
                <Cite s={S.pytorchBlog} kind="vendor-claim" />
              </Box>
              <Box variant="p">
                AWS reports 94.7% of enabled upstream ATen tests passing in an August 2026 run.
                Across its upstream suites that run skipped about 39,000 tests deliberately for
                Neuron, and the pass rate counts enabled tests only.
                <Cite s={S.pytorchBlog} kind="vendor-claim" />
              </Box>
              <Box variant="p">
                Hugging Face reports that 89% of the 100 most-used text-generation model
                architectures are supported on TorchNeuron out of the box, against 46% with Optimum
                Neuron v0.4.5.
                <Cite s={S.hfBlog} kind="vendor-claim" />
              </Box>
              <Box variant="p">
                SemiAnalysis measured one Qwen3-32B TorchTitan run on 16 Trainium2 chips: 11,099
                tokens per second in eager mode and 14,156 compiled, about 1.28x, with a first step
                of 184.6 s in eager mode and 255.7 s compiled.
                <Cite
                  s={S.semiAnalysis}
                  kind="measured"
                  note="One run. Batch size, sequence length, parallelism layout and Neuron SDK version are not given in the public text."
                />{' '}
                That first step is compilation: it compiles every graph and can take several
                minutes, and the persistent NEFF cache saves later runs from paying it again.
                <Cite s={S.torchtitanAbout} /> AWS&apos;s launch post thanks SemiAnalysis for
                feedback on TorchNeuron&apos;s design
                <Cite s={S.pytorchBlog} />, and SemiAnalysis writes that its team had been trying
                Trainium3 racks for the past couple of weeks.
                <Cite s={S.semiAnalysis} />
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Since Neuron 2.27.0 an FP32 model's matmuls stay FP32 unless you ask for BF16, and a shared compile cache stops every machine recompiling the same graph"
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
            <code>NEURON_CC_FLAGS</code>
            <Cite s={S.compilerCli} />, which TorchNeuron passes to neuronx-cc as well.
            <Cite s={S.torchCompileRef} /> TorchNeuron&apos;s graph compiles already pass{' '}
            <code>--auto-cast=none</code>
            <Cite s={S.tnxGraphCompileFlags} />; the documented way to get BF16 there is in
            PyTorch, with BF16 tensors or <code>torch.autocast(device_type=&quot;neuron&quot;)</code>.
            <Cite s={S.torchNeuron233} />
          </Box>
          <Box variant="p">
            <strong>The compile cache on the XLA path.</strong> Compiled graphs are cached under a
            hash of the compiler flags and the XLA graph; a new compiler version or a changed graph
            compiles again
            <Cite s={S.neuronCache} />, so changing <code>--auto-cast</code> recompiles, and each
            distinct graph pays its own compile. The default cache,{' '}
            <code>/var/tmp/neuron-compile-cache</code>, is local; point{' '}
            <code>NEURON_COMPILE_CACHE_URL</code> at a read-write <code>s3://</code> bucket and
            machines such as CI (continuous integration) runners reuse each other&apos;s compiled
            graphs. Graphs traced with frozen weights through <code>torch_neuronx.trace</code> are
            not cached.
            <Cite s={S.neuronCache} />
          </Box>
          <Box variant="p">
            <strong>The NEFF cache on TorchNeuron.</strong> TorchNeuron keeps content-addressed NEFFs
            in <code>TORCH_NEURONX_NEFF_CACHE_DIR</code>, default <code>/tmp/neff_cache</code>, keyed
            on the lowered graph, the compiler configuration and the compiler version, so a compiler
            upgrade recompiles everything; pin torch-neuronx and neuronx-cc together in production.
            <Cite s={S.torchCompileRef} />
            <Cite s={S.tnxNeffCacheDir} />
            <Cite s={S.tnxNeffKeyCompilerVersion} /> To reuse NEFFs across runs and instances,
            point the directory at a shared mount such as Amazon FSx, and keep the lock directory,{' '}
            <code>TORCH_NEURONX_NEFF_LOCAL_CACHE_DIR</code>, on a local POSIX filesystem, because
            NFS and Lustre lock semantics are unreliable.
            <Cite s={S.torchCompileRef} /> To turn the cache off, set{' '}
            <code>TORCH_NEURONX_NEFF_DISABLE_CACHE=1</code>, the name the code reads. The
            repository&apos;s environment-variable list also documents{' '}
            <code>TORCH_NEURONX_DISABLE_NEFF_CACHE</code>, which only a helper nothing calls reads.
            <Cite s={S.tnxNeffCacheDisable} />
            <Cite s={S.tnxEnvVarsDoc} />
            <Cite s={S.tnxDisableNeffCacheHelper} />
          </Box>
          <Box variant="code">
            <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{String.raw`# neuronx-cc defaults to --auto-cast=none: FP32 matmuls stay FP32. Ask for BF16 explicitly.
export NEURON_CC_FLAGS="--auto-cast=matmult --auto-cast-type=bf16"

# XLA path: share compiled graphs across machines. The bucket must exist and be read-write.
export NEURON_COMPILE_CACHE_URL="s3://your-bucket/neuron-compile-cache"

# TorchNeuron: share NEFFs across runs and instances; keep the lock directory on local disk.
export TORCH_NEURONX_NEFF_CACHE_DIR="/fsx/neff_cache"`}</pre>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Serve on vLLM Neuron and train on TorchNeuron with TorchTitan Neuron; NxD Inference and PyTorch/XLA inference end on Trn2 and Trn3 in Neuron 2.34"
          >
            Which library to serve and train on
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Serving.</strong> vLLM Neuron, in beta since July 2026, implements models inside
            the vLLM plugin with no dependency on NxD Inference, and runs on Trn2 and Trn3.
            <Cite s={S.neuronWhatsNew} /> Release 0.29.0.1.2.0 makes native PyTorch torch.compile
            its default compilation path
            <Cite s={S.vllmNeuronNotes233} />, through its own package, libtorch-neuronx-lite,
            which carries its own copy of the TorchNeuron lowering and runs on PyTorch 2.13.
            <Cite s={S.vllmTorchNeuronDesign} />
            <Cite s={S.vllmNeuronCoreReq} />
            <Cite s={S.vllmTorchPin} /> The torch-neuronx installed beside it therefore does not
            change how vLLM Neuron compiles, and only one package can own the <code>neuron</code>{' '}
            device in a process: with both installed, set{' '}
            <code>TORCH_DEVICE_BACKEND_AUTOLOAD=0</code> in the environment before the server
            starts, or it stops at startup with a PrivateUse1 registration error.
            <Cite s={S.vllmTorchNeuronDesign} /> NxD Inference, the NxD Core inference APIs and
            PyTorch/XLA inference end support on Trn2 and Trn3 in Neuron 2.34: migrate inference to
            vLLM Neuron, and model build and trace code to torch.compile with TorchNeuron.
            <Cite s={S.whatsNew233} /> Pin vLLM Neuron by release tag.
            <Cite s={S.vllmNeuronRepo} />
          </Box>
          <Box variant="p">
            <strong>Training.</strong> PyTorch/XLA is no longer supported for training on Trainium
            from Neuron 2.30
            <Cite s={S.noXlaTraining} />, and NeuronX Distributed Training and the NxD Core
            training APIs are in maintenance mode, with security fixes only.
            <Cite s={S.neuronWhatsNew} /> On Trn2 and Trn3, train on TorchNeuron, with FSDP2 and
            DTensor as above.
            <Cite s={S.torchNeuronNotes} /> TorchTitan runs through TorchTitan Neuron 0.2.2+neuron.1
            (beta), the aws-neuron/torchtitan-neuron fork of pytorch/torchtitan: it keeps
            TorchTitan&apos;s model definitions, parallelism strategies and torch.compile
            integration without changes to your model code
            <Cite s={S.torchtitanAbout} />
            <Cite s={S.releaseNotes233} />, and it sends torch.compile calls that name no backend to{' '}
            <code>neuron</code>.
            <Cite s={S.torchtitanCompileBackend} /> Its validated configurations cover Llama3-8B,
            Qwen3-32B, DeepSeek-V3 and GPT-OSS; its documented limits include static shapes,{' '}
            <code>mode=&quot;default&quot;</code> only, MoE grouped GEMMs outside the compiled
            graph, and TorchTitan&apos;s built-in profiler, which cannot yet profile the device.
            <Cite s={S.torchtitanAbout} /> Hugging Face TRL (Transformer Reinforcement Learning)
            trainers run on TorchNeuron without code changes; on Neuron they pad sequences to a
            multiple of 128 tokens by default to limit the number of input shapes, and GRPO (Group
            Relative Policy Optimization) and RLOO (REINFORCE Leave-One-Out) generate rollouts with
            Transformers inside the training process rather than with vLLM.
            <Cite s={S.trlTrainium} />
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The NEFF fixes the instruction order while the timing still varies; torch.profiler and three tools show where the time goes, from device inventory to a per-engine timeline"
          >
            Profiling: neuron-ls, neuron-top and Neuron Explorer
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The order is fixed; the timing varies.</strong> Per-hop latency of the
            intra-node ring collectives is about 1 to 2 microseconds and depends on HBM load
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
                <Cite s={S.devTools233} />
                <Cite s={S.neuronWhatsNew} />
              </Box>
            </div>
          </ColumnLayout>
          <Box variant="p">
            <strong>From inside a TorchNeuron job.</strong> <code>torch.profiler</code> with{' '}
            <code>ProfilerActivity.PrivateUse1</code> captures framework, runtime and device traces
            for Neuron Explorer, which shows each PyTorch call with its ATen operators and the
            device activity under them; a default Neuron session starts with no extra
            configuration, and a <code>NeuronConfig</code> selects what is captured.
            <Cite s={S.torchNeuronNotes} />
            <Cite s={S.torchNeuron233} />
            <Cite s={S.explorerCapture} />
            <Cite s={S.tnxProfilerPlugin} /> <code>ProfileMode.DEVICE</code> reserves about 5 GB of
            HBM on Trn2 for hardware notifications, so budget for it when the model nearly fills
            device memory.
            <Cite s={S.explorerCapture} /> The device timeline gives each NeuronCore engine its own
            track of hardware instructions, colored by the PyTorch operator each came from, and each
            DMA (direct memory access) engine its own track of packets, so an engine that sits idle
            while another works shows as a gap.
            <Cite s={S.explorerDeviceTrace} /> In eager mode, the Memory Viewer attributes
            allocations to the Python source lines that made them.
            <Cite s={S.devTools233} />
          </Box>
          <Box variant="p">
            <strong>Fleet health is a separate tool.</strong> Neuron Observer (beta) is health
            telemetry for Trn2 and Trn3 nodes: a per-node daemon collects Trainium health signals,
            the <code>nobs</code> client checks node and device health, and the daemon serves a
            Prometheus <code>/metrics</code> endpoint. <code>neuron-monitor</code> stays fully
            supported during the beta.
            <Cite s={S.observerNotes} />
          </Box>
          <Box variant="p">
            Start with neuron-ls for the devices and their NUMA nodes, watch neuron-top while the
            job runs, and capture with Neuron Explorer, or with torch.profiler from inside a
            TorchNeuron job, when utilization is lower than you expect.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Check the NKI Library first; if you still need a kernel, write it, test it on a CPU, time the NEFF it compiles to, and call it from PyTorch"
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
                <Cite s={S.gluonIntro} /> NKI is stable from NKI 0.3.0 (Neuron 2.29.0)
                <Cite s={S.neuronWhatsNew} />, and Neuron 2.33.0 ships NKI 0.7.0.
                <Cite s={S.releaseNotes233} />
              </Box>
            </div>
            <div>
              <Box variant="h3">When to reach for it</Box>
              <Box variant="p">
                Check the NKI Library first: AWS&apos;s open-source (Apache 2.0) collection of
                optimized kernels
                <Cite s={S.neuronWhatsNew} />, here at its 2.32 tag.
                <Cite s={S.nkiLibraryRepo} /> Its MoE kernels, Router Top-K among them, shipped in
                Neuron 2.28.0.
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
          <Box variant="p">
            <strong>Then call it from PyTorch.</strong> On TorchNeuron, call the{' '}
            <code>@nki.jit</code> kernel on <code>neuron</code> tensors directly, or wrap it in{' '}
            <code>torch_neuronx.nki_op</code> for a named custom op that runs in eager mode and
            inside torch.compile. A model you train needs the kernel&apos;s backward pass,
            registered with <code>torch.library.register_autograd</code>.
            <Cite s={S.torchNeuronNotes} />
            <Cite s={S.torchNeuron233} />
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
