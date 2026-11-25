import { useState } from 'react';
import type { CSSProperties } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import FormField from '@cloudscape-design/components/form-field';
import Select from '@cloudscape-design/components/select';
import { Cite, Derived } from '../components/Cite';
import { Figure, AnimatedFigure } from '../components/Figure';
import { Formula, M } from '../components/Math';
import { RenderForm, RENDER_FORM_STEPS } from '../components/figures/RenderForm';
import { GpuEngines, ENGINES_BY_WORKLOAD, GPU_WORKLOADS } from '../components/GpuEngines';
import type { GpuWorkload } from '../components/GpuEngines';
import { linear } from '../lib/scale';
import { ARM, TASK_STORY, SIM_TASK, SIM_TASK_PLAIN, SIM_TASK_GAP } from '../lib/task';
import { Capture, CaptureSlot, MUJOCO_SO101 } from '../components/Capture';

/* Palette shared across the dive (revamp/diagram-plan.md, section 1). */
const INK = '#16191f';
const NEUTRAL_INK = '#5f6b7a';
const RT_FILL = '#fdeedd';
const RT_INK = '#a85a0a';

/** Keeps a narrow, phone-first drawing from growing oversized on a wide screen. */
const NARROW: CSSProperties = { maxWidth: 560, margin: '0 auto' };

const LIST: CSSProperties = { margin: 0, paddingLeft: 22 };
const TH: CSSProperties = { textAlign: 'left', padding: '6px 10px', borderBottom: '2px solid #5f6b7a', verticalAlign: 'bottom' };
const TD: CSSProperties = { padding: '6px 10px', borderBottom: '1px solid #d5dbdb', verticalAlign: 'top' };

/* ------------------------------------------------------------------------ */
/* Diagram 13.3 (chart): what one camera per environment costs              */
/* ------------------------------------------------------------------------ */

const FPS_STATE = 1023698;
const FPS_CAMERA = 152124;
const GB_STATE = 0.93;
const GB_CAMERA = 57.3;
const CARD_GB = 96;

function CameraCostChart() {
  const xf = linear(0, 1100000, 12, 388);
  const xg = linear(0, 100, 12, 388);
  const label = { fontFamily: 'sans-serif', fontSize: 12, fill: INK } as const;
  const head = { fontFamily: 'sans-serif', fontSize: 13, fontWeight: 'bold', fill: INK } as const;
  return (
    <div style={NARROW}>
      <svg viewBox="0 0 400 330" role="img" aria-labelledby="rendering-camera-cost-title" style={{ width: '100%', height: 'auto' }}>
        <title id="rendering-camera-cost-title">What one camera per environment costs in training throughput and in GPU memory</title>
        <desc>
          Two pairs of horizontal bars on linear axes, from NVIDIA&apos;s Isaac Lab benchmark of the Cartpole task with
          8,192 environments on one GPU. Throughput falls from 1,023,698 training frames per second with no camera to
          152,124 with one camera per environment. GPU memory rises from 0.93 GB to 57.3 GB on a card with 96 GB.
        </desc>
        <rect x="0" y="0" width="400" height="330" fill="#fbfbfd" />

        {/* throughput */}
        <text x="12" y="24" {...head}>
          Training throughput
        </text>
        <text x="12" y="46" {...label}>
          no camera: <tspan fontWeight="bold">1,023,698</tspan>
        </text>
        <rect x="12" y="52" width={xf(FPS_STATE) - 12} height="16" fill="#e3e6e9" stroke={NEUTRAL_INK} strokeWidth="1.2" />
        <text x="12" y="92" {...label}>
          one camera per environment: <tspan fontWeight="bold">152,124</tspan>, 6.7 times lower
        </text>
        <rect x="12" y="98" width={xf(FPS_CAMERA) - 12} height="16" fill={RT_FILL} stroke={RT_INK} strokeWidth="1.2" />
        <line x1="12" y1="124" x2="388" y2="124" stroke={NEUTRAL_INK} strokeWidth="1.5" />
        <g aria-hidden="true">
          {[
            { v: 0, t: '0', a: 'start' as const },
            { v: 500000, t: '500,000', a: 'middle' as const },
            { v: 1000000, t: '1,000,000', a: 'middle' as const },
          ].map((k) => (
            <g key={k.v}>
              <line x1={xf(k.v)} y1="124" x2={xf(k.v)} y2="129" stroke={NEUTRAL_INK} strokeWidth="1.5" />
              <text x={xf(k.v)} y="143" textAnchor={k.a} {...label}>
                {k.t}
              </text>
            </g>
          ))}
        </g>
        <text x="200" y="160" textAnchor="middle" {...label} fill={NEUTRAL_INK}>
          training frames per second (linear scale)
        </text>

        {/* memory */}
        <text x="12" y="192" {...head}>
          GPU memory used
        </text>
        <text x="388" y="192" textAnchor="end" {...label} fill={NEUTRAL_INK}>
          dashed line: the card, 96 GB
        </text>
        <text x="12" y="214" {...label}>
          no camera: <tspan fontWeight="bold">0.93 GB</tspan>
        </text>
        <rect x="12" y="220" width={Math.max(2.5, xg(GB_STATE) - 12)} height="16" fill="#e3e6e9" stroke={NEUTRAL_INK} strokeWidth="1.2" />
        <text x="12" y="258" {...label}>
          one camera per environment: <tspan fontWeight="bold">57.3 GB</tspan>, 62 times more
        </text>
        <rect x="12" y="264" width={xg(GB_CAMERA) - 12} height="16" fill={RT_FILL} stroke={RT_INK} strokeWidth="1.2" />
        <line x1={xg(CARD_GB)} y1="200" x2={xg(CARD_GB)} y2="290" stroke="#5b3fa8" strokeWidth="1.8" strokeDasharray="5 4" />
        <line x1="12" y1="290" x2="388" y2="290" stroke={NEUTRAL_INK} strokeWidth="1.5" />
        <g aria-hidden="true">
          {[
            { v: 0, t: '0', a: 'start' as const },
            { v: 50, t: '50', a: 'middle' as const },
            { v: 100, t: '100', a: 'end' as const },
          ].map((k) => (
            <g key={k.v}>
              <line x1={xg(k.v)} y1="290" x2={xg(k.v)} y2="295" stroke={NEUTRAL_INK} strokeWidth="1.5" />
              <text x={xg(k.v)} y="309" textAnchor={k.a} {...label}>
                {k.t}
              </text>
            </g>
          ))}
        </g>
        <text x="200" y="324" textAnchor="middle" {...label} fill={NEUTRAL_INK}>
          GB of GPU memory (linear scale)
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Diagram 13.2: the shared GPU engines card with a workload selector       */
/* ------------------------------------------------------------------------ */

function EnginePicker() {
  const [workload, setWorkload] = useState<GpuWorkload>('rtx-rendering');
  const picked = ENGINES_BY_WORKLOAD[workload];
  const options = GPU_WORKLOADS.map((w) => ({ value: w, label: ENGINES_BY_WORKLOAD[w].label }));
  return (
    <SpaceBetween size="s">
      <FormField label="Workload to light on the card">
        <Select
          selectedOption={options.find((o) => o.value === workload) ?? options[0]}
          onChange={({ detail }) => setWorkload(detail.selectedOption.value as GpuWorkload)}
          options={options}
          ariaLabel="Workload to light on the card"
        />
      </FormField>
      <Figure
        cites={`F08-36 F08-42 F08-43 ${picked.cites}`}
        caption={
          <>
            Each row is a separate unit of the same card, and the rows outlined in blue are the ones the selected
            workload uses. A card can lack a row altogether. Schematic, with no sizes drawn.
          </>
        }
      >
        <GpuEngines workload={workload} idPrefix="rendering" />
      </Figure>
      <Box variant="p">
        <span aria-live="polite">
          <Box variant="strong" display="inline">
            Why, for {picked.label}:
          </Box>{' '}
          {picked.reason}
        </span>
      </Box>
    </SpaceBetween>
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function Rendering() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Tell from the renderer a simulator uses whether its cameras can run on a training GPU, and work out how many camera-equipped copies of a scene fit in a card's memory (Isaac Sim 6.2.0, Isaac Lab 3.0 and MuJoCo 4.0.1, sources read 2026-11-20)"
          >
            13. Rendering and Ray Tracing: Why Simulated Cameras Pick the GPU
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Training a policy, the model that steers a robot arm, on camera images means the simulator has to draw
            every image the policy sees. That makes the simulator a renderer as well as a physics engine, and the
            renderer can rule out the GPU the training job wants. Isaac Sim, NVIDIA&apos;s simulator application, draws
            its cameras with an RTX renderer. That is a ray tracer: it follows a ray from each pixel into the scene,
            and it hands the costliest step of that work to RT cores (ray-tracing cores), a unit some GPUs carry
            and others leave out. <Cite id="F06-60">AWS Machine Learning Blog, Isaac Lab on SageMaker AI</Cite>{' '}
            <Cite id="F06-57">NVIDIA Developer, ray tracing explainer</Cite> Isaac Sim&apos;s requirements page
            for version 6.2.0 says: &quot;GPUs without RT Cores (A100, H100) are not supported.&quot;{' '}
            <Cite id="F06-52">Isaac Sim 6.2.0 requirements</Cite>
          </Box>
          <Box variant="p">
            The A100 and the H100 are data-centre training GPUs, the kind EC2 sells in its P instance families,
            while GPUs with RT cores sit in its G families. AWS&apos;s compatibility list for Isaac Sim&apos;s
            renderer, posted on 9 June 2026, marks every P family it names, from P4d to P6e-GB200, as incompatible
            and four G families as compatible. A job that draws its cameras with Isaac Sim simulates on a G
            family, whichever family trains the policy.{' '}
            <Cite id="F06-60">AWS Machine Learning Blog, Isaac Lab on SageMaker AI</Cite> The
            documented rule reaches as far as Isaac Sim and RTX rendering, so the first question to ask of a
            simulation job is which renderer draws its cameras.{' '}
            <Cite id="F06-101">synthesis of the renderer entries</Cite>
          </Box>
          <Box variant="p">
            The second question is how many cameras, because they size the card. Isaac Lab 3.0, NVIDIA&apos;s
            robot-learning framework, ships a release benchmark that trains 8,192 copies of Cartpole, a cart
            balancing a pole, on one GPU. With no camera NVIDIA reports
            1,023,698 training frames per second, a rate that includes the policy&apos;s updates, in 0.93 GB of GPU
            memory, about 0.11 MB per copy.{' '}
            <Cite id="F06-47">Isaac Lab v3.0.0 benchmark file, Cartpole rows</Cite> With one small camera per copy it
            reports 152,124 frames per second in 57.3 GB, 7.0 MB per copy: throughput falls by a factor of
            1,023,698 / 152,124 = 6.7 and memory grows by a factor of 57.3 / 0.93 = 62.{' '}
            <Cite id="F06-48">Isaac Lab v3.0.0 benchmark file, Cartpole-Camera rows</Cite>{' '}
            <Cite id="F06-102">arithmetic over the Isaac Lab figures</Cite> The camera, more than the physics,
            decides how many copies a card holds.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="See why a simulator that already knows where the block is must still draw it, at every decision and in every copy of the scene"
          >
            A policy that will run on cameras has to train on images
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            At the bench the {ARM} is asked to {TASK_STORY}, and its policy finds the block through two cameras
            (section 3, The Robot as a Computer). In a simulator the physics of section 12, Physics Simulation,
            already holds the block&apos;s position as numbers. A policy trained on those numbers expects to be
            handed them at the bench, where the arm has only its cameras to find the block with. So the simulated
            arm gets a simulated camera, and at every decision the simulator computes the image that camera would
            see. Computing that image is rendering.
          </Box>
          <Box variant="p">
            The simulated task that ships for this arm is <code>{SIM_TASK}</code> in MuJoCo Playground,
            DeepMind&apos;s suite of ready-made robot tasks for MuJoCo, its open-source physics simulator. It runs its policy ten times per simulated second and
            renders one 64x64 wrist-camera image at each of those steps while the policy learns to {SIM_TASK_PLAIN} ({SIM_TASK_GAP} is not part of the shipped task).{' '}
            <Cite id="F06-27">MuJoCo Playground v1.0.1, SO-101 pick-cube task.py</Cite>{' '}
            <Cite id="F06-61">MuJoCo 4.0.1 docs, rendering</Cite>
          </Box>
          <Box variant="p">
            One small image per step is light until training multiplies it. Reinforcement learning, which improves a policy from its own
            attempts (section 8, Reinforcement Learning for Robots), runs thousands of environments side by side on
            one GPU. An environment is one copy of the scene plus its task (section 12), and every one of them
            needs its own image at every step.{' '}
            <Cite id="F06-47">Isaac Lab v3.0.0 benchmark README</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Know what each method computes for one pixel, and find the one step of ray tracing, a tree search, whose hardware decides the GPU"
          >
            Rasterisation starts from the triangles, ray tracing from the pixels
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A simulator stores every surface as a mesh of triangles, and a renderer turns triangles into pixels.
            Rasterisation works triangle by triangle. It projects the three corners of a triangle onto the image
            and fills the pixels between them, and where two triangles land on the same pixel the one nearer the
            camera wins. That settles what is visible, quickly.{' '}
            <Cite id="F06-56">NVIDIA Developer, ray tracing explainer</Cite>
          </Box>
          <Box variant="p">
            Ray tracing works pixel by pixel. It sends a ray from the camera through the pixel and finds the first
            surface the ray lands on. From that point it sends more rays. A shadow ray goes toward the light, and
            if anything blocks it the point is dark. Reflections and light bounced off other surfaces are further
            rays of the same kind. Shadows and reflections come out physically accurate, and the price is counted
            in rays: at least one per pixel, and more for every effect.{' '}
            <Cite id="F06-56">NVIDIA Developer, ray tracing explainer</Cite>
          </Box>
          <AnimatedFigure
            name="one image formed by rasterising and by ray tracing"
            steps={RENDER_FORM_STEPS}
            intervalMs={3600}
            cites="F06-27"
            caption={
              <>
                Left, the scene the renderer holds. Right, the camera&apos;s image, formed twice from the same
                triangles. The rasteriser drawn here stops at projecting and filling, so the blue outline, the
                pixels where a shadow ray was blocked, marks the only pixels where the two images differ.
                Illustrative, not measured: the geometry is invented.
              </>
            }
          >
            {(step, reduced) => <RenderForm step={step} reduced={reduced} />}
          </AnimatedFigure>
          <Box variant="p">
            Every ray poses the same question: which triangle does it land on first? A ray tracer avoids testing
            every triangle by sorting them into a tree of nested boxes, a BVH (bounding-volume hierarchy). A ray
            that misses a box skips everything inside it, so the tracer walks down only the boxes the ray enters.
            NVIDIA calls that walk &quot;the most time consuming part of the ray tracing calculations&quot;.{' '}
            <Cite id="F06-57">NVIDIA Developer, ray tracing explainer, hardware section</Cite> A rasteriser never
            performs it. A ray tracer performs it for every ray, and the unit of the GPU it runs on is what
            separates one renderer&apos;s hardware requirement from another&apos;s.
          </Box>
          <ExpandableSection headerText="The arm's scene as a rasteriser draws it: colour, depth and segmentation">
            <SpaceBetween size="m">
              <Capture
                file="so101-render-passes.jpg"
                kind="still"
                width={1800}
                height={400}
                alt="One overhead frame of the arm, block and cup shown three ways: in colour, as a depth image and with each body filled in one flat colour."
                caption={
                  <>
                    One frame from the overhead camera, drawn three ways by the same renderer: colour, depth (brightness is
                    distance from the camera) and segmentation (one flat colour per body). A policy trained on camera images
                    receives the first; the other two come from the same pass over the scene.
                  </>
                }
                provenance={MUJOCO_SO101}
              />
              <CaptureSlot what="The same SO-101 scene ray traced by Isaac Sim, captured on our own machines." />
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="See which unit of a GPU each job loads, so that 'a GPU' stops being one resource when you size a simulation"
          >
            One card, several units, and a card can lack one
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A GPU is several units on one card, and a job fills the ones it uses while the rest sit idle. Tensor
            cores multiply matrices, the arithmetic of training and running a neural network. RT cores are hardware
            built to speed up the BVH walk, and they are the unit an RTX renderer hands the walk to. The general
            compute cores run every other kind of GPU code: the batched physics of section 12, a network&apos;s code
            other than its matrix multiplies, and the lighting and shading of a ray tracer. All of them work out of one
            pool of GPU memory. <Cite id="F08-42">NVIDIA Tensor Cores page and Nsight Compute pipelines</Cite>{' '}
            <Cite id="F06-100">GPU physics on general compute</Cite>{' '}
            <Cite id="F08-36">Nsight Compute, multiprocessor units</Cite>
          </Box>
          <EnginePicker />
          <Box variant="p">
            Policy training and RTX rendering share the general compute cores and memory and differ in one
            specialised unit each, so a card designed around the trainer&apos;s tensor cores can ship without the
            renderer&apos;s RT cores. <Cite id="F06-60">AWS Machine Learning Blog, Isaac Lab on SageMaker AI</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Find your simulator's renderer, and read in its vendor's words whether it needs RT cores, the general compute cores or no GPU at all"
          >
            The RT-core rule follows the renderer
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A simulator pairs a physics engine, which steps the scene, with a renderer, which draws it. GPU physics
            runs on the general compute cores (section 12), so whether a job needs RT cores is mostly a question
            about its renderer.{' '}
            <Cite id="F06-100">GPU physics on general compute</Cite>
          </Box>
          <Box variant="p">
            By our reading of the renderers&apos; documentation, the renderers of Isaac Sim, Isaac Lab and MuJoCo
            fall into three groups by where the BVH walk runs. The
            rasterisers skip the walk. The ray tracers written as ordinary GPU code, such as those built on Warp,
            NVIDIA&apos;s compiler from Python to GPU code, run it on the general compute cores. RTX rendering hands
            it to the RT cores, and it is the only group whose documentation asks for them.{' '}
            <Cite id="F06-101">synthesis of the renderer entries</Cite>{' '}
            <Cite id="F06-39">Newton v1.8.0 README</Cite>
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 640 }}>
              <thead>
                <tr>
                  <th style={TH}>Way to render</th>
                  <th style={TH}>Where you meet it</th>
                  <th style={TH}>What it loads</th>
                  <th style={TH}>RT cores</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>Rasterisation</td>
                  <td style={TD}>MuJoCo&apos;s built-in renderers</td>
                  <td style={TD}>The GPU&apos;s graphics pipeline, or CPU cores with no GPU at all</td>
                  <td style={TD}>
                    Not needed. <Cite id="F06-61">MuJoCo 4.0.1 docs, rendering</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Ray tracing written as ordinary GPU code</td>
                  <td style={TD}>MuJoCo Warp&apos;s batch renderer; the Warp renderer in Newton and Isaac Lab</td>
                  <td style={TD}>General compute cores and GPU memory</td>
                  <td style={TD}>
                    Not asked for. <Cite id="F06-24">MuJoCo 4.0.1 docs, batch rendering</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>RTX rendering</td>
                  <td style={TD}>Isaac Sim&apos;s renderer, and the same renderer as a standalone library for Isaac Lab</td>
                  <td style={TD}>RT cores for the walk; general compute cores and GPU memory for the rest</td>
                  <td style={TD}>
                    Required. <Cite id="F06-52">Isaac Sim 6.2.0 requirements</Cite>{' '}
                    <Cite id="F08-36">Nsight Compute, multiprocessor units</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">
            Isaac Sim is the one exception to the renderer rule: it carries the requirement into every job it runs, because the application
            as a whole is unsupported on a GPU without RT cores.{' '}
            <Cite id="F06-52">Isaac Sim 6.2.0 requirements</Cite> Isaac Lab 3.0 no longer needs Isaac Sim
            underneath it, and its install guide separates physics on Newton, its GPU physics engine (section 12),
            from rendering: &quot;Headless Newton simulation does not require RTX hardware&quot;, and &quot;RTX rendering has its own GPU and driver requirements&quot;. The
            guide adds a renderer&apos;s requirements &quot;when you need camera images or an interactive
            view&quot;, so headless here means a run with neither.{' '}
            <Cite id="F06-51">Isaac Lab v3.0.0 installation guide</Cite> A Newton training run with no camera and
            no viewer falls outside the rule, and the rule returns the moment an RTX renderer is switched on.
          </Box>
          <Box variant="p">
            Of Isaac Lab 3.0&apos;s three renderers, Newton Warp is a ray tracer built on Warp, and it computes
            direct lighting only: light that reaches a surface straight from a lamp, with no bounce. The documentation recommends it when
            &quot;camera throughput and memory matter more than material and lighting fidelity&quot;. The other
            two are RTX renderers: OVRTX, the same RTX renderer packaged to run without Isaac Sim and the one the
            documentation recommends, and Isaac RTX, which runs inside Isaac Sim and is labelled legacy.{' '}
            <Cite id="F06-50">Isaac Lab v3.0.0 docs, renderers</Cite>
          </Box>
          <Box variant="p">
            Newton Warp pairs with Newton, with OvPhysX (PhysX as a standalone library) or with Isaac Sim&apos;s
            PhysX. Paired with Newton, with no Isaac Sim underneath, it leaves the job with no documented RT-core
            requirement. Every pairing gives up reflections and indirect light.{' '}
            <Cite id="F06-50">Isaac Lab v3.0.0 docs, renderers</Cite>{' '}
            <Cite id="F06-52">Isaac Sim 6.2.0 requirements</Cite>
          </Box>
          <Box variant="p">
            What that fidelity is worth depends on how the policy is meant to cross to real cameras (section 14,
            Sim-to-Real and Real-to-Sim). Domain randomisation needs none of it: it varies the rendering so widely
            that &quot;the real world may appear to the model as just another variation&quot;.{' '}
            <Cite id="F06-66">Tobin et al., domain randomisation, abstract</Cite> The task that ships for this arm
            takes that route, varying colours, lighting, camera parameters and per-pixel noise on its 64x64 image.{' '}
            <Cite id="F06-28">MuJoCo Playground v1.0.1, SO-101 pick-cube task.py</Cite> On a Franka arm, a different
            robot from the SO-101, the MuJoCo Playground authors report 12 successes in 12 real trials, a small sample, for a pick policy trained on
            64x64 images from a ray tracer written as GPU code.{' '}
            <Cite id="F06-34">MuJoCo Playground paper, pick-cube from pixels</Cite>
          </Box>
          <Box variant="p">
            RTX earns its RT cores when the images must carry reflections, transparency or indirect light. On
            speed, the order depends on the comparison and on image size. Isaac Lab 3.0&apos;s documentation reports that in its release benchmarks
            &quot;Newton Warp has the highest throughput, and OVRTX outperforms Isaac RTX&quot;, and the Isaac Lab
            authors found a camera that casts its rays with Warp to be faster at low resolutions, and their tiled
            RTX camera faster at higher ones. <Cite id="F06-50">Isaac Lab v3.0.0 docs, renderers</Cite>{' '}
            <Cite id="F06-63">Isaac Lab paper, section 4.1.2</Cite> Both comparisons set whole renderers against
            each other, so neither isolates what the RT cores add. Time the candidates at the image size your
            policy reads before you choose one.
          </Box>
          <Box variant="p">
            A Warp renderer keeps P-family GPUs open, and one test run decides it. No vendor sentence naming the
            A100, H100 or B200 as supported for a Warp renderer was located in this research, so run one on a
            P-family GPU before you commit P capacity to it.{' '}
            <Cite id="F06-101">synthesis of the renderer entries</Cite>{' '}
            <Cite id="F06-62">MuJoCo docs, MuJoCo Warp chapter, default branch</Cite>
          </Box>
          <ExpandableSection headerText="Why the Warp path needs no RTX hardware: MuJoCo Warp's two back ends">
            <Box variant="p">
              MuJoCo Warp, the GPU version of MuJoCo (section 12), ships the same kind of renderer as Newton Warp
              as its default, <code>backend=&quot;warp&quot;</code>: a ray tracer whose BVH walk is ordinary code on
              the general compute cores. Its documentation after 4.0.1 adds <code>backend=&quot;optix&quot;</code>,
              a hardware back end built on NVIDIA&apos;s OptiX ray-tracing library and &quot;available on NVIDIA RTX
              GPUs&quot;, and when OptiX is unavailable MuJoCo Warp &quot;warns and falls back&quot; to the Warp
              path. The fallback shows that the Warp path does not depend on RTX hardware.{' '}
              <Cite id="F06-24">MuJoCo 4.0.1 docs, batch rendering</Cite>{' '}
              <Cite id="F06-62">MuJoCo docs, MuJoCo Warp chapter, default branch</Cite>
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Count the rays a training step sends from four settings, and put a time on them from a published benchmark"
          >
            A step of 8,192 small cameras is 33.6 million rays
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A ray tracer&apos;s work is counted in rays, and the count is a product. A 64x64 image has 64 x 64 =
            4,096 pixels, so 4,096 rays leave the camera before any shadow ray is sent. A 640x480 frame, the size
            the arm&apos;s real cameras deliver (section 3), is 307,200 rays, 75 times as many.{' '}
            <Cite id="F06-24">MuJoCo Warp docs and render benchmark</Cite>
          </Box>
          <Box variant="p">
            Training multiplies that by every camera in every environment. With <M>E</M> environments, <M>C</M>{' '}
            cameras in each, and images <M>W</M> pixels wide and <M>H</M> pixels high, one step sends at least{' '}
            <M>{String.raw`N_{\text{rays}}`}</M> rays:
          </Box>
          <Formula
            name="Camera rays per simulation step, at one ray per pixel"
            tex={String.raw`N_{\text{rays}} = E \times C \times W \times H`}
          />
          <Box variant="p">
            The learning algorithm sets <M>E</M>, by how many parallel copies it wants, and the policy sets the
            rest, by what it has to see. For 8,192 environments with one 64 x 64 camera each, that is 8,192 x 64 x
            64 = 33.6 million rays per step.{' '}
            <Cite id="F06-103">Isaac Lab v3.0.0 camera_cfg.py and benchmark README</Cite> No term is cheap to grow:
            the MuJoCo Warp project says its renderer &quot;scales linearly with resolution and number of
            cameras&quot;. <Cite id="F06-24">MuJoCo Warp pull request 1113</Cite>
          </Box>
          <Box variant="p">
            The same project&apos;s render benchmark puts a time on the product. With 8192 worlds (a world is one
            copy of the scene, section 12) and one 64x64 camera in each, on an RTX 6000 Ada, it records a render time
            of 756 per world per frame. Taking that as nanoseconds, the unit its physics rows imply, one batch of
            images takes 8192 x 756 ns = <Derived>6.2</Derived> ms.
            Carry the linear scaling to 640x480 and the batch takes <Derived>6.2 ms x 75 = 465 ms</Derived>, close
            to half a second for every step of the policy (an extrapolation: no published run is behind it).
            The task that ships for this arm stays at the small end, at 64x64.{' '}
            <Cite id="F06-24">MuJoCo Warp render benchmark and pull request 1113</Cite>{' '}
            <Cite id="F06-27">MuJoCo Playground v1.0.1, SO-101 pick-cube task.py</Cite>
          </Box>
          <Box variant="p">
            Isaac Lab draws thousands of cameras in one pass by tiled rendering, the job of its{' '}
            <code>TiledCamera</code> sensor class: each environment&apos;s camera owns one tile of a single large
            image on the GPU, which is drawn once and then cut apart. The result is
            already a tensor of shape (environments, height, width, channels) in GPU memory, where the policy reads
            it with no copy to the CPU. <Cite id="F06-64">Isaac Lab paper, section 2.3</Cite> Every
            camera&apos;s image sits in GPU memory at the same moment, beside the physics and the policy that
            reads them.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Read what one camera did to published training runs, and how far up the memory ladder each kind of camera takes one environment"
          >
            The camera&apos;s memory, more than its speed, sizes the card
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The Cartpole benchmark measures what a camera costs a whole training run, on one RTX PRO 6000 Blackwell
            Server Edition with 96 GB, a card with RTX in its name running a renderer that is not an RTX renderer.
            Newton steps the physics, and the Newton Warp renderer draws one 64 x 64 or
            96 x 96 camera per environment (the benchmark does not record which). The camera divides throughput by 6.7 and multiplies
            memory by 62: 57.3 GB, more than half the card, against 0.93 GB without it.{' '}
            <Cite id="F06-58">NVIDIA product page, RTX PRO 6000 Blackwell Server Edition</Cite>{' '}
            <Cite id="F06-48">Isaac Lab v3.0.0 benchmark file, Cartpole-Camera rows</Cite>{' '}
            <Cite id="F06-104">Isaac Lab v3.0.0 cartpole_common.py and benchmark export</Cite>
          </Box>
          <Figure
            cites="F06-47 F06-48 F06-58"
            caption={
              <>
                NVIDIA&apos;s figures for Cartpole with 8,192 environments on one GPU, with the two ratios worked
                from them. The dashed line is the 96 GB of the card the benchmark ran on.
              </>
            }
          >
            <CameraCostChart />
          </Figure>
          <Box variant="p">
            Only part of the throughput factor is the renderer&apos;s. The benchmark&apos;s training figure
            includes the policy updates, and with a camera the policy being updated reads images.{' '}
            <Cite id="F06-47">Isaac Lab v3.0.0 benchmark README</Cite> For a camera-based pick task on a Franka
            arm, the MuJoCo Playground authors report physics at 24% of training time, rendering at 18%, policy
            inference at 1% and the policy update at 57%, on one RTX 4090.{' '}
            <Cite id="F06-33">MuJoCo Playground paper, vision time breakdown</Cite> In a split like that one, a
            renderer twice as fast returns 9% of the training time and leaves the update&apos;s 57% where it was.
          </Box>
          <Box variant="p">
            Heavier physics shrinks the factor. With a Kuka arm and an Allegro hand lifting a cube, 8,192
            environments and one fixed 64 x 64 camera in each, NVIDIA reports 220,831 training frames per second
            with no camera and 115,889 with the Newton Warp renderer. That is a factor of 1.9 against
            Cartpole&apos;s 6.7: contact physics already takes much of each step, so the camera adds less on top.{' '}
            <Cite id="F06-49">Isaac Lab v3.0.0 benchmark file, Kuka-Allegro rows</Cite>{' '}
            <Cite id="F06-48">Isaac Lab v3.0.0 benchmark file, Cartpole-Camera rows</Cite>{' '}
            <Cite id="F06-103">Isaac Lab v3.0.0 camera_cfg.py</Cite>
          </Box>
          <Box variant="p">
            The same task shows what choosing RTX costs. On the same Newton physics, the Newton Warp renderer
            trains at 115,889 frames per second in 13.6 GB and the RTX renderer OVRTX at 97,307 in 18.6 GB:
            97,307 / 115,889 = <Derived>0.84</Derived> of the throughput, in <Derived>5.0</Derived> GB more
            memory. The two rows do not draw the same output, and the task&apos;s camera presets show the
            difference:{' '}
            <code>rgb64</code> renders plain colour at 64 x 64 for Newton Warp, and{' '}
            <code>simple_shading_full_mdl64</code> a shaded image at the same size for the RTX renderers. The gap
            is the renderer and its heavier output together.{' '}
            <Cite id="F06-49">Isaac Lab v3.0.0 benchmark file, Kuka-Allegro rows</Cite>{' '}
            <Cite id="F06-103">Isaac Lab v3.0.0 benchmark README</Cite>
          </Box>
          <Box variant="p">
            Per environment, memory spans about four orders of magnitude, from the physics state alone to one
            full-fidelity camera:
          </Box>
          <ul style={LIST}>
            <li>
              No camera: 57 KB to 468 KB per world for the physics state alone, from a humanoid to a cluttered
              two-arm table in MuJoCo Warp&apos;s benchmarks. A whole Isaac Lab training process with no camera,
              learner included, takes 0.1 MB to 1.8 MB per environment across its state-only tasks, 0.11 MB for
              Cartpole.{' '}
              <Cite id="F06-22">MuJoCo Warp nightly benchmarks, total_memory</Cite>{' '}
              <Cite id="F06-102">arithmetic over the Isaac Lab figures</Cite>{' '}
              <Cite id="F06-47">Isaac Lab v3.0.0 benchmark file, state-only rows</Cite>
            </li>
            <li>
              One small camera per environment: 13.6 GB / 8,192 = 1.7 MB on the Kuka lift and 57.3 GB / 8,192 =
              7.0 MB on Cartpole, both with the Newton Warp renderer, and up to 63.7 GB / 8,192 = 7.8 MB for
              Cartpole with an RTX renderer. <Cite id="F06-102">arithmetic over the Isaac Lab figures</Cite>{' '}
              <Cite id="F06-48">Isaac Lab v3.0.0 benchmark file, Cartpole-Camera rows</Cite> MuJoCo Warp&apos;s
              render benchmark falls in the same range: 44.4 GB for its 8192 worlds, about 5.4 MB per world.{' '}
              <Cite id="F06-24">MuJoCo Warp render benchmark</Cite>
            </li>
            <li>
              One camera at full fidelity: up to about 2 GB. The Isaac Lab authors report that the USD-Camera,
              their highest-fidelity camera type, runs out of memory beyond 48 cameras on a 96 GB card. 96 GB / 48
              = 2 GB is a ceiling on each camera&apos;s share, since the card also holds the physics and the
              learner, the code that updates the policy.{' '}
              <Cite id="F06-63">Isaac Lab paper, section 4.1.2</Cite>
            </li>
          </ul>
          <Box variant="p">
            The camera type is where a run fails outright. Pick the USD-Camera for a batch of thousands and the run
            ends in an out-of-memory error, while the <code>TiledCamera</code> and the{' '}
            <code>RayCasterCamera</code>, which casts its rays with Warp, scale &quot;to several thousand
            environments&quot;. <Cite id="F06-63">Isaac Lab paper, section 4.1.2</Cite>
          </Box>
          <Box variant="p">
            The small-camera range is too wide to size a card from, and the pixels do not account for it. One 64
            x 64 colour frame is 64 x 64 x 3 bytes, about <Derived>12 KB</Derived>. Subtract the Kuka task&apos;s
            no-camera row, 7.2 GB, from its camera row and the memory that came with the camera is{' '}
            <Derived>13.6 GB - 7.2 GB = 6.4 GB</Derived>, about <Derived>0.78 MB</Derived> per environment, more
            than <Derived>60</Derived> times the frame. Image size does not explain the spread between tasks either:
            even at 96 x 96 the Cartpole image has only 2.25 times the pixels of the Kuka one, while the memory that
            came with its camera, <Derived>57.3 GB - 0.93 GB = 56.4 GB</Derived>, is about <Derived>9</Derived>{' '}
            times the Kuka task&apos;s <Derived>6.4 GB</Derived>. NVIDIA&apos;s memory figures are one total per row for the whole training process, learner
            included, so where the rest of the megabytes sit is not published.{' '}
            <Cite id="F06-47">Isaac Lab v3.0.0 benchmark file</Cite>{' '}
            <Cite id="F06-102">arithmetic over the Isaac Lab figures</Cite>{' '}
            <Cite id="F06-104">Isaac Lab v3.0.0 cartpole_common.py and benchmark export</Cite>{' '}
            <Cite id="F06-48">Cartpole-Camera rows</Cite> <Cite id="F06-49">Kuka-Allegro rows</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Turn the renderer you chose into an EC2 family, then let GPU memory decide the size and how many environments fit"
          >
            The renderer picks the EC2 family, and GPU memory picks the size
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            An RTX renderer ties a simulation job to a G family, and the family in turn decides how the capacity
            can be booked. <Cite id="F08-58">the instance table</Cite> As of 2026-11-20, Capacity Blocks,
            AWS&apos;s way to reserve a block of GPU instances for a fixed window, cover P types and no G type
            (section 24, Orchestrating Physical AI on AWS).{' '}
            <Cite id="F09-91">EC2 User Guide, Capacity Blocks, supported instance types</Cite> A G-family
            simulation fleet can be held instead with an On-Demand Capacity Reservation, a reservation type that
            covers G instances (section 29, Choosing).{' '}
            <Cite id="F09-40">EKS best practices, AI/ML compute, reservations</Cite>
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 640 }}>
              <thead>
                <tr>
                  <th style={TH}>Job</th>
                  <th style={TH}>What it needs from the card</th>
                  <th style={TH}>EC2 family (our mapping)</th>
                  <th style={TH}>Source</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>Newton physics batches with no camera</td>
                  <td style={TD}>General compute cores, little memory</td>
                  <td style={TD}>G or P: any NVIDIA GPU of the Turing generation or newer (compute capability 7.5)</td>
                  <td style={TD}>
                    <Cite id="F06-51">Isaac Lab v3.0.0 installation guide</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Cameras drawn by a ray tracer written as GPU code</td>
                  <td style={TD}>General compute cores, megabytes of memory per environment</td>
                  <td style={TD}>G; P after one test run there</td>
                  <td style={TD}>
                    <Cite id="F06-101">synthesis of the renderer entries</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Cameras drawn by an RTX renderer, and Isaac Sim itself</td>
                  <td style={TD}>RT cores beside the general compute cores, megabytes to gigabytes of memory per camera</td>
                  <td style={TD}>G only: G5, G6, G6e, G7, G7e</td>
                  <td style={TD}>
                    <Cite id="F06-60">AWS Machine Learning Blog</Cite>{' '}
                    <Cite id="F08-85">price-performance per part</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Training the policy on the images</td>
                  <td style={TD}>Tensor cores, memory for the model</td>
                  <td style={TD}>G or P, by model size (section 15)</td>
                  <td style={TD}>
                    <Cite id="F08-76">the workload table</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">
            AWS&apos;s compatibility list predates G7, which became generally available on 18 June 2026 with &quot;4th Gen RT Cores&quot; on a 32 GB GPU, so G7 belongs
            with the RTX families. <Cite id="F08-52">AWS What&apos;s New, EC2 G7</Cite>{' '}
            <Cite id="F08-43">AWS, EC2 G7 product page</Cite>
          </Box>
          <Box variant="p">
            Inside a family, GPU memory picks the size, because memory is the part a simulated camera fills
            first, ahead of the unit that draws it (section 20, Fifteen Workloads, Five Shapes).{' '}
            <Cite id="F08-76">the workload table</Cite> The Cartpole recipe at 8,192 environments, 57.3 GB, fits the
            96 GB GPU of G7e, the benchmark&apos;s own card, and not the 32 GB GPU of G7. Scaled down by division,
            G7&apos;s GPU, sold as 32 GB, holds about <Derived>32 GB / 7.0 MB = 4,600</Derived> Cartpole
            environments and <Derived>32 GB / 1.7 MB = 19,000</Derived> of the Kuka task. A run&apos;s memory is a
            fixed part plus a cost per environment, and the published rows do not separate the two. Dividing the
            card by the average per environment charges the fixed part in proportion to the count. Where the card
            holds less than the run used, as with Cartpole&apos;s 57.3 GB, that charges too little of the fixed part
            and the estimate is a ceiling. Where it holds more, as with the Kuka task&apos;s 13.6 GB, it charges too
            much and the estimate is a floor.{' '}
            <Cite id="F06-48">Isaac Lab v3.0.0 benchmark file, Cartpole-Camera rows</Cite>{' '}
            <Cite id="F06-102">arithmetic over the Isaac Lab figures</Cite>{' '}
            <Cite id="F08-53">AWS What&apos;s New, EC2 G7e</Cite> <Cite id="F08-43">AWS, EC2 G7 product page</Cite>
          </Box>
          <ExpandableSection headerText="RT cores and memory card by card, AWS's full list, and Isaac Sim's own limits">
            <div style={{ overflowX: 'auto' }}>
              <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 560 }}>
                <thead>
                  <tr>
                    <th style={TH}>GPU (EC2 family)</th>
                    <th style={TH}>RT cores on the product page</th>
                    <th style={TH}>Memory</th>
                  </tr>
                </thead>
                <tbody>
                  <tr data-claim="F06-58">
                    <td style={TD}>A10 (G5 carries its AWS variant, the A10G)</td>
                    <td style={TD}>72</td>
                    <td style={TD}>24 GB</td>
                  </tr>
                  <tr data-claim="F06-58">
                    <td style={TD}>L4 (G6)</td>
                    <td style={TD}>&quot;third-generation RT Cores&quot;, no count printed</td>
                    <td style={TD}>24 GB</td>
                  </tr>
                  <tr data-claim="F06-58">
                    <td style={TD}>L40S (G6e)</td>
                    <td style={TD}>142, third generation</td>
                    <td style={TD}>48 GB</td>
                  </tr>
                  <tr data-claim="F08-43">
                    <td style={TD}>RTX PRO 4500 Blackwell Server Edition (G7)</td>
                    <td style={TD}>&quot;4th Gen RT Cores&quot; on AWS&apos;s G7 page, no count printed</td>
                    <td style={TD}>32 GB</td>
                  </tr>
                  <tr data-claim="F06-58">
                    <td style={TD}>RTX PRO 6000 Blackwell Server Edition (G7e)</td>
                    <td style={TD}>188, fourth generation</td>
                    <td style={TD}>96 GB</td>
                  </tr>
                  <tr data-claim="F06-59">
                    <td style={TD}>H100 (P5) and H200 (P5e, P5en)</td>
                    <td style={TD}>The product pages do not mention RT cores</td>
                    <td style={TD}>80 GB or 94 GB; 141 GB</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <Box variant="p">
              <Cite id="F06-58">NVIDIA product pages: A10, L4, L40S, RTX PRO 6000 Blackwell Server Edition</Cite>{' '}
              <Cite id="F08-43">AWS, EC2 G7 product page</Cite>{' '}
              <Cite id="F06-59">NVIDIA H100 and H200 product pages</Cite>
            </Box>
            <ul style={LIST}>
              <li>
                AWS&apos;s post of 9 June 2026, written against Isaac Sim 5.1 before Isaac Lab 3.0 shipped, marks
                P4d, P4de, P5, P5e, P5en, P6-B200, P6-B300 and P6e-GB200 as incompatible and G5, G6, G6e and G7e as
                compatible. Its verdict on the P families holds for RTX rendering and does not cover a headless
                Newton run.{' '}
                <Cite id="F06-60">AWS Machine Learning Blog, Isaac Lab on SageMaker AI</Cite>{' '}
                <Cite id="F06-51">Isaac Lab v3.0.0 installation guide</Cite>
              </li>
              <li>
                Isaac Sim 6.2.0 lists a GeForce RTX 4080 with 16 GB of GPU memory as its minimum and an RTX PRO 6000
                Blackwell with 48 GB as its ideal tier. The page names no variant, and its 48 GB is half the 96 GB
                of the Server Edition that G7e carries.{' '}
                <Cite id="F06-52">Isaac Sim 6.2.0 requirements</Cite>{' '}
                <Cite id="F08-53">AWS What&apos;s New, EC2 G7e</Cite>
              </li>
              <li>
                On aarch64, the Arm architecture, Isaac Sim 6.2.0 supports one machine, NVIDIA&apos;s DGX Spark
                desktop, so Graviton, AWS&apos;s Arm processor family, is not on its list.{' '}
                <Cite id="F06-53">Isaac Sim 6.2.0 requirements, aarch64</Cite>
              </li>
            </ul>
          </ExpandableSection>
          <Box variant="p">
            Before you rent a GPU for simulation, ask whether the policy reads images in simulation at all. If it
            does not and Isaac Sim is not underneath, the physics runs on G or P. If it does, the renderer decides
            the family: Isaac Sim or any RTX renderer sends the job to a G family, and a ray tracer written as GPU
            code gives up reflections and indirect light and keeps P possible, pending one test run there.{' '}
            <Cite id="F06-51">Isaac Lab v3.0.0 installation guide</Cite>
          </Box>
          <Box variant="p">
            Then size the card from your own task,
            since NVIDIA&apos;s rows put a camera environment anywhere from 1.7 MB to 7.8 MB.{' '}
            <Cite id="F06-102">arithmetic over the Isaac Lab figures</Cite> Run the task at two counts of
            environments, reading memory in the GiB the EC2 documentation lists (an L40S sold as 48 GB appears
            there as 44 GiB), and divide the difference in memory by the difference in count: that is the cost of
            one more environment, with the fixed part of the process left out.{' '}
            <Cite id="F08-45">EC2 accelerated computing specifications, accelerator memory</Cite> A second pair of
            runs at another image size shows how much of that cost grows with the pixels. The card&apos;s memory
            left free at the smaller run, divided by the cost of one environment, is how many more environments it
            holds.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
