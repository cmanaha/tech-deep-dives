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
          dashed line: the card&apos;s 96 GB
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
      <FormField label="Workload to highlight on the card">
        <Select
          selectedOption={options.find((o) => o.value === workload) ?? options[0]}
          onChange={({ detail }) => setWorkload(detail.selectedOption.value as GpuWorkload)}
          options={options}
          ariaLabel="Workload to highlight on the card"
        />
      </FormField>
      <Figure
        cites={`F08-36 F08-42 F08-43 ${picked.cites}`}
        caption={
          <>
            Each row is a separate unit on the same GPU card. The rows outlined in blue are the units that the
            selected workload uses. Some cards do not have every unit shown here. The drawing is a schematic and
            does not show the sizes of the units.
          </>
        }
      >
        <GpuEngines workload={workload} idPrefix="rendering" />
      </Figure>
      <Box variant="p">
        <span aria-live="polite">
          <Box variant="strong" display="inline">
            Why these units are used for {picked.label}:
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
            description="To choose a GPU for a simulation job that renders camera images, first find out which renderer draws the images, because some renderers need RT cores that data-centre training GPUs such as the H100 do not have. Then estimate how many copies of the scene, each with its own camera, fit in the GPU's memory. The requirements and benchmark figures are those of Isaac Sim 6.2.0, Isaac Lab 3.0 and MuJoCo 4.0.1."
          >
            13. Rendering and Ray Tracing: Why Simulated Cameras Need GPUs With RT Cores
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The model that controls a robot arm is called a policy. When a policy learns from camera images in
            simulation, the simulator has to draw every image that the policy sees. So the simulator is a renderer
            as well as a physics engine, and the renderer&apos;s hardware requirements can rule out the GPU that you
            planned to use for training.
          </Box>
          <Box variant="p">
            Isaac Sim is NVIDIA&apos;s simulator application. It draws its camera images with an RTX renderer, which
            is a type of ray tracer. A ray tracer follows a ray from each pixel into the scene to find what that
            pixel shows. An RTX renderer hands the most expensive step of that work to the GPU&apos;s RT cores
            (ray-tracing cores). RT cores are a hardware unit that some GPUs have and others do not.{' '}
            <Cite id="F06-60">AWS Machine Learning Blog, Isaac Lab on SageMaker AI</Cite>{' '}
            <Cite id="F06-57">NVIDIA Developer, ray tracing explainer</Cite> The requirements page for Isaac Sim
            6.2.0 says: &quot;GPUs without RT Cores (A100, H100) are not supported.&quot;{' '}
            <Cite id="F06-52">Isaac Sim 6.2.0 requirements</Cite>
          </Box>
          <Box variant="p">
            The A100 and the H100 are data-centre GPUs built for training. EC2 offers GPUs of this kind in its P
            instance families, and GPUs with RT cores in its G instance families. On 9 June 2026, AWS posted a
            compatibility list for Isaac Sim&apos;s renderer. The list marks every P family it
            names, from P4d to P6e-GB200, as incompatible, and four G families as compatible. So if a job draws its
            cameras with Isaac Sim, its simulation has to run on a G-family instance, whichever family you use to
            train the policy. <Cite id="F06-60">AWS Machine Learning Blog, Isaac Lab on SageMaker AI</Cite>
          </Box>
          <Box variant="p">
            The documented requirement for RT cores reaches as far as Isaac Sim and RTX renderers. So the first
            question to ask about a simulation job is which renderer draws its cameras.{' '}
            <Cite id="F06-101">synthesis of the renderer entries</Cite>
          </Box>
          <Box variant="p">
            The second question is how many cameras the job renders, because the memory that the cameras use is
            what you size the GPU by. Isaac Lab 3.0 is NVIDIA&apos;s robot-learning framework. Its release includes a
            benchmark that trains 8,192 copies of Cartpole on one GPU. Cartpole is a small standard control task in
            which a cart balances a pole. Without cameras, NVIDIA reports 1,023,698 training frames per second in
            0.93 GB of GPU memory, about 0.11 MB per copy.{' '}
            <Cite id="F06-102">arithmetic over the Isaac Lab figures</Cite> This rate counts simulated frames, and it includes the
            time spent updating the policy. <Cite id="F06-47">Isaac Lab v3.0.0 benchmark file, Cartpole rows</Cite>
          </Box>
          <Box variant="p">
            With one small camera per copy, NVIDIA reports 152,124 frames per second in 57.3 GB, or 7.0 MB per
            copy. <Cite id="F06-48">Isaac Lab v3.0.0 benchmark file, Cartpole-Camera rows</Cite> So the camera
            lowers throughput by a factor of 1,023,698 / 152,124 = 6.7 and raises memory use by a factor of 57.3 /
            0.93 = 62. <Cite id="F06-102">arithmetic over the Isaac Lab figures</Cite> On this task, the number of
            copies that fit on one GPU depends more on the cameras than on the physics.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="A simulator already holds the position of every object as numbers. A policy that will use cameras on the real arm still has to train on images, so the simulator draws an image for every camera, at every policy step, in every copy of the scene."
          >
            Why the simulator has to render camera images
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            On the real arm, the {ARM}&apos;s task is to {TASK_STORY}, and its policy finds the block through the
            arm&apos;s two cameras (section 3, The Robot as a Computer). In a simulator, the physics engine already
            holds the block&apos;s position as numbers (section 12, Physics Simulation). A policy trained on those
            numbers would expect to receive them on the real arm as well. The real arm has no such numbers, only its
            cameras. So the simulated arm gets a simulated camera, and every time the policy chooses its next
            action, the simulator computes the image that camera would see. Computing that image is called
            rendering.
          </Box>
          <Box variant="p">
            MuJoCo is DeepMind&apos;s open-source physics simulator. MuJoCo Playground is DeepMind&apos;s set of
            ready-made robot tasks for MuJoCo. The simulated task that ships for this arm is <code>{SIM_TASK}</code> in
            MuJoCo Playground. In this task, the policy learns to {SIM_TASK_PLAIN}. The shipped task does not
            include {SIM_TASK_GAP}. The policy runs ten times per simulated second, and at each of those steps the
            simulator renders one 64x64 image from the wrist camera.{' '}
            <Cite id="F06-27">MuJoCo Playground v1.0.1, SO-101 pick-cube task.py</Cite>{' '}
            <Cite id="F06-61">MuJoCo 4.0.1 docs, rendering</Cite>
          </Box>
          <Box variant="p">
            One small image per step is cheap to render, but training multiplies the number of images.
            Reinforcement learning improves a policy from its own attempts (section 8, Reinforcement Learning for
            Robots). To do that, it runs thousands of environments side by side on one GPU. An environment is one
            copy of the scene together with its task, and every environment needs its own image at every step.{' '}
            <Cite id="F06-47">Isaac Lab v3.0.0 benchmark README</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Rasterisation and ray tracing compute the same image in two different ways. Once you know what each method computes for a pixel, you can see which step of ray tracing decides the hardware that a renderer needs: the search through a tree of boxes for the triangle that each ray hits."
          >
            How rasterisation and ray tracing form an image
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A simulator stores every surface as a mesh, which is a set of triangles. A renderer turns those
            triangles into pixels. Rasterisation works one triangle at a time. It projects the three corners of a
            triangle onto the image and fills the pixels between them. Where two triangles land on the same pixel,
            the renderer keeps the one nearer the camera. This is a fast way to work out what is visible.{' '}
            <Cite id="F06-56">NVIDIA Developer, ray tracing explainer</Cite>
          </Box>
          <Box variant="p">
            Ray tracing works one pixel at a time. It sends a ray from the camera through the pixel and finds the
            first surface that the ray hits. From that point, it sends more rays. A shadow ray goes toward the light,
            and if something blocks it, the point is in shadow. Reflections, and light that bounces off other
            surfaces, are computed with more rays of the same kind. The result is physically accurate shadows and
            reflections. The cost is counted in rays: at least one per pixel, and more for each extra effect.{' '}
            <Cite id="F06-56">NVIDIA Developer, ray tracing explainer</Cite>
          </Box>
          <AnimatedFigure
            name="one image formed by rasterising and by ray tracing"
            steps={RENDER_FORM_STEPS}
            intervalMs={3600}
            cites="F06-27"
            caption={
              <>
                The left side shows the scene that the renderer holds. The right side shows the camera&apos;s image,
                formed twice from the same triangles: once by rasterising and once by ray tracing. The rasteriser in
                this drawing only projects and fills triangles. So the only pixels where the two images differ are
                the ones outlined in blue, where a shadow ray was blocked. The drawing is an illustration with
                invented geometry, not a measurement.
              </>
            }
          >
            {(step, reduced) => <RenderForm step={step} reduced={reduced} />}
          </AnimatedFigure>
          <Box variant="p">
            For every ray, the ray tracer has to find the first triangle that the ray hits. To avoid testing every
            triangle in the scene, it sorts the triangles into a tree of nested boxes called a BVH (bounding-volume
            hierarchy). If a ray misses a box, it cannot hit anything inside that box, so the tracer walks down only
            into the boxes that the ray enters. NVIDIA calls this walk &quot;the most time consuming part of the ray
            tracing calculations&quot;.{' '}
            <Cite id="F06-57">NVIDIA Developer, ray tracing explainer, hardware section</Cite> A rasteriser never
            does this walk, and a ray tracer does it for every ray. So the hardware requirements of different
            renderers differ in which unit of the GPU runs this walk.
          </Box>
          <ExpandableSection headerText="The arm's scene drawn by a rasteriser in colour, depth and segmentation">
            <SpaceBetween size="m">
              <Capture
                file="so101-render-passes.jpg"
                kind="still"
                width={1800}
                height={400}
                alt="One overhead frame of the arm, block and cup shown three ways: in colour, as a depth image and with each body filled in one flat colour."
                caption={
                  <>
                    This is one frame from the overhead camera, drawn in three ways by the same renderer. The first
                    image is the colour image. The second is a depth image, in which brightness shows the distance
                    from the camera. The third is a segmentation image, in which each body is filled with one flat
                    colour. A policy trained on camera images receives the colour image. The renderer produces the
                    other two in the same pass over the scene.
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
            description="A GPU contains several kinds of processing units, and each job uses only some of them. When you size a simulation, treat each unit as a separate resource, because a GPU can lack a unit that your job needs."
          >
            The units inside a GPU and the jobs that use them
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A GPU card holds several kinds of units. All of them work out of the same pool of GPU memory, but a job
            keeps busy only the units it uses, while the others sit idle. Three kinds of unit matter for simulation
            and training.{' '}
            <Cite id="F08-36">Nsight Compute, multiprocessor units</Cite>
          </Box>
          <ul style={LIST}>
            <li>
              <strong>Tensor cores</strong> multiply matrices. Matrix multiplication is the arithmetic that
              training and running a neural network rely on.{' '}
              <Cite id="F08-42">NVIDIA Tensor Cores page and Nsight Compute pipelines</Cite>
            </li>
            <li>
              <strong>RT cores</strong> are hardware built to speed up the BVH walk. An RTX renderer hands the walk
              to them.
            </li>
            <li>
              <strong>General compute cores</strong> run every other kind of GPU code. This includes the batched
              physics of section 12, Physics Simulation, the parts of a neural network other than its matrix
              multiplications, and the lighting and shading in a ray tracer.{' '}
              <Cite id="F06-100">GPU physics on general compute</Cite>
            </li>
          </ul>
          <EnginePicker />
          <Box variant="p">
            Policy training and RTX rendering both use the general compute cores and GPU memory. Each of them also
            uses one specialised unit: training uses the tensor cores, and RTX rendering uses the RT cores. So a GPU
            designed around tensor cores for training can come without RT cores, as the A100 and the H100 do.{' '}
            <Cite id="F06-60">AWS Machine Learning Blog, Isaac Lab on SageMaker AI</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Find out which renderer your simulator uses. The vendor's documentation then tells you whether that renderer needs RT cores, runs on the general compute cores, or can run without a GPU."
          >
            Which renderers need RT cores
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A simulator combines two parts. The physics engine moves the scene forward in time, and the renderer
            draws it. GPU physics runs on the general compute cores (section 12, Physics Simulation). So whether a
            job needs RT cores depends mostly on its renderer.{' '}
            <Cite id="F06-100">GPU physics on general compute</Cite>
          </Box>
          <Box variant="p">
            The renderers in Isaac Sim, Isaac Lab and MuJoCo fall into three groups, based on where they run the
            BVH walk. Rasterisers do not do the walk at all. Warp is NVIDIA&apos;s framework for writing GPU code in
            Python. Ray tracers written as ordinary GPU code, such as the ones built on Warp, run the walk on the
            general compute cores. RTX renderers hand the walk to the RT cores, and they are the only group whose
            documentation asks for RT cores.{' '}
            <Cite id="F06-101">synthesis of the renderer entries</Cite>{' '}
            <Cite id="F06-39">Newton v1.8.0 README</Cite>
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 640 }}>
              <thead>
                <tr>
                  <th style={TH}>Rendering method</th>
                  <th style={TH}>Where it is used</th>
                  <th style={TH}>Hardware it uses</th>
                  <th style={TH}>Are RT cores required?</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>Rasterisation</td>
                  <td style={TD}>MuJoCo&apos;s built-in renderers</td>
                  <td style={TD}>The GPU&apos;s graphics pipeline, or CPU cores when there is no GPU</td>
                  <td style={TD}>
                    No. <Cite id="F06-61">MuJoCo 4.0.1 docs, rendering</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Ray tracing written as ordinary GPU code</td>
                  <td style={TD}>MuJoCo Warp&apos;s batch renderer, and the Warp renderer in Newton and Isaac Lab</td>
                  <td style={TD}>General compute cores and GPU memory</td>
                  <td style={TD}>
                    The documentation does not ask for them.{' '}
                    <Cite id="F06-24">MuJoCo 4.0.1 docs, batch rendering</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>RTX rendering</td>
                  <td style={TD}>Isaac Sim&apos;s renderer, and the same renderer as a standalone library for Isaac Lab</td>
                  <td style={TD}>RT cores for the BVH walk; general compute cores and GPU memory for everything else</td>
                  <td style={TD}>
                    Yes. <Cite id="F06-52">Isaac Sim 6.2.0 requirements</Cite>{' '}
                    <Cite id="F08-36">Nsight Compute, multiprocessor units</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">
            Isaac Sim is the one case where the requirement does not depend on the renderer. The whole application
            is unsupported on a GPU without RT cores, so every job that runs in Isaac Sim needs them.{' '}
            <Cite id="F06-52">Isaac Sim 6.2.0 requirements</Cite>
          </Box>
          <Box variant="p">
            Isaac Lab 3.0 does not need Isaac Sim. It can run its tasks on Newton, a GPU physics engine (section
            12, Physics Simulation). Its installation guide treats physics and rendering separately. It says that
            &quot;Headless Newton simulation does not require RTX hardware&quot;, and that &quot;RTX rendering has
            its own GPU and driver requirements&quot;. The guide adds the renderer&apos;s requirements only
            &quot;when you need camera images or an interactive view&quot;. So headless here means a run with no
            camera images and no interactive view.{' '}
            <Cite id="F06-51">Isaac Lab v3.0.0 installation guide</Cite> A Newton training run with no camera and no
            viewer therefore does not need RTX hardware. As soon as you switch on an RTX renderer, the job needs RT
            cores again.
          </Box>
          <Box variant="p">Isaac Lab 3.0 offers three renderers:</Box>
          <ul style={LIST}>
            <li>
              <strong>Newton Warp</strong> is a ray tracer built on Warp. It computes only direct lighting. Direct
              lighting is light that reaches a surface straight from a lamp. Light that first bounces off other
              surfaces is called indirect light, and Newton Warp does not compute it.
              The documentation recommends Newton Warp when &quot;camera throughput and memory matter more than
              material and lighting fidelity&quot;.
            </li>
            <li>
              <strong>OVRTX</strong> is the same RTX renderer as in Isaac Sim, packaged to run without Isaac Sim. It
              is the renderer that the documentation recommends.
            </li>
            <li>
              <strong>Isaac RTX</strong> runs inside Isaac Sim, and the documentation labels it as legacy.{' '}
              <Cite id="F06-50">Isaac Lab v3.0.0 docs, renderers</Cite>
            </li>
          </ul>
          <Box variant="p">
            PhysX is the physics engine inside Isaac Sim. OvPhysX is PhysX packaged as a standalone library. Newton
            Warp can work with three physics engines: Newton, OvPhysX, or the PhysX inside Isaac Sim. When you
            combine Newton Warp with Newton and do not run Isaac Sim, the job has no documented requirement for RT
            cores. With any of the three physics engines, Newton Warp gives up reflections and indirect light.{' '}
            <Cite id="F06-50">Isaac Lab v3.0.0 docs, renderers</Cite>{' '}
            <Cite id="F06-52">Isaac Sim 6.2.0 requirements</Cite>
          </Box>
          <Box variant="p">
            Whether you need reflections and indirect light depends on how you plan to make the policy work with the
            real cameras (section 14, Sim-to-Real and Real-to-Sim). One method is domain randomisation. It varies
            the rendering so widely during training that &quot;the real world may appear to the model as just
            another variation&quot;. <Cite id="F06-66">Tobin et al., domain randomisation, abstract</Cite> This
            method does not need reflections or indirect light. The task that ships for this arm
            uses domain randomisation. It varies the colours, the lighting, the camera parameters and per-pixel noise
            in its 64x64 image. <Cite id="F06-28">MuJoCo Playground v1.0.1, SO-101 pick-cube task.py</Cite>{' '}
            <Cite id="F06-27">MuJoCo Playground v1.0.1, SO-101 pick-cube task.py</Cite>
          </Box>
          <Box variant="p">
            The MuJoCo Playground authors trained a pick policy for a Franka arm, a different robot from the SO-101,
            on 64x64 images from a ray tracer written as GPU code. They report 12 successes in 12 trials on the real
            arm, which is a small sample. <Cite id="F06-34">MuJoCo Playground paper, pick-cube from pixels</Cite>
          </Box>
          <Box variant="p">
            An RTX renderer is the better choice when the images must show reflections, transparency or indirect
            light. Which renderer is faster depends on what you compare and on the image size. Isaac Lab 3.0&apos;s
            documentation reports that in its release benchmarks &quot;Newton Warp has the highest throughput, and
            OVRTX outperforms Isaac RTX&quot;. The authors of the Isaac Lab paper found that a camera that casts its
            rays with Warp is faster at low resolutions, and that their tiled RTX camera is faster at higher
            resolutions. <Cite id="F06-50">Isaac Lab v3.0.0 docs, renderers</Cite>{' '}
            <Cite id="F06-63">Isaac Lab paper, section 4.1.2</Cite> Both comparisons measure whole renderers against
            each other, so neither shows how much of the difference comes from the RT cores. To choose a renderer,
            time each candidate at the image size that your policy reads.
          </Box>
          <Box variant="p">
            A Warp renderer may let you run the simulation on P-family GPUs, but you need a test run to confirm it.
            We found no vendor statement that names the A100, H100 or B200 as supported for a Warp renderer. So
            before you commit P-family capacity to a Warp renderer, run it once on a P-family GPU.{' '}
            <Cite id="F06-101">synthesis of the renderer entries</Cite>{' '}
            <Cite id="F06-62">MuJoCo docs, MuJoCo Warp chapter, default branch</Cite>
          </Box>
          <ExpandableSection headerText="MuJoCo Warp's two ray-tracing back ends, and why the Warp back end needs no RTX hardware">
            <Box variant="p">
              MuJoCo Warp is the GPU version of MuJoCo (section 12, Physics Simulation). Its default renderer,{' '}
              <code>backend=&quot;warp&quot;</code>, is the same kind of renderer as Newton Warp: a ray tracer whose
              BVH walk is ordinary code on the general compute cores. Its documentation after version 4.0.1 adds a
              second option, <code>backend=&quot;optix&quot;</code>. This is a hardware back end built on OptiX,
              NVIDIA&apos;s ray-tracing library, and it is &quot;available on NVIDIA RTX GPUs&quot;. When OptiX is
              unavailable, MuJoCo Warp &quot;warns and falls back&quot; to the Warp back end. This fallback shows
              that the Warp back end does not depend on RTX hardware.{' '}
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
            description="You can count the rays that one training step sends from four settings: the number of environments, the number of cameras in each, and the width and height of the images. A published benchmark then gives a time for that work."
          >
            Counting the rays in one training step
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The work of a ray tracer grows with the number of rays it sends. A 64x64 image has 64 x 64 = 4,096
            pixels, so 4,096 rays leave the camera before any shadow ray is sent. The arm&apos;s real cameras deliver
            640x480 frames (section 3, The Robot as a Computer). A 640x480 frame has 307,200 pixels, 75 times as
            many. <Cite id="F06-24">MuJoCo Warp docs and render benchmark</Cite>
          </Box>
          <Box variant="p">
            Training multiplies this count by every camera in every environment. Take <M>E</M> environments,{' '}
            <M>C</M> cameras in each environment, and images that are <M>W</M> pixels wide and <M>H</M> pixels
            high. Then one simulation step sends at least <M>{String.raw`N_{\text{rays}}`}</M> camera rays:
          </Box>
          <Formula
            name="Camera rays per simulation step, at one ray per pixel"
            tex={String.raw`N_{\text{rays}} = E \times C \times W \times H`}
          />
          <Box variant="p">
            You set <M>E</M> when you choose how many parallel copies of the scene the learning algorithm runs. You
            set <M>C</M>, <M>W</M> and <M>H</M> when you decide what the policy has to see. For 8,192 environments
            with one 64 x 64 camera each, the formula gives 8,192 x 64 x 64 = 33.6 million rays per step.{' '}
            <Cite id="F06-103">Isaac Lab v3.0.0 camera_cfg.py and benchmark README</Cite> None of the four terms is
            cheap to increase. The MuJoCo Warp project says that its renderer &quot;scales linearly with resolution
            and number of cameras&quot;. <Cite id="F06-24">MuJoCo Warp pull request 1113</Cite>
          </Box>
          <Box variant="p">
            The same project&apos;s render benchmark gives a time for this work. MuJoCo calls one copy of the scene
            a world, where Isaac Lab says environment (section 12, Physics Simulation). The benchmark runs 8192
            worlds with one 64x64 camera in each, on an RTX 6000 Ada GPU, and records a render time of 756 per world
            per frame. If that figure is in nanoseconds, which is the unit that the benchmark&apos;s physics rows
            imply, one batch of images for all the worlds takes 8192 x 756 ns = <Derived>6.2</Derived> ms. If the
            linear scaling holds up to 640x480 images, the batch would take{' '}
            <Derived>6.2 ms x 75 = 465 ms</Derived>, close to half a second for every policy step. This is an
            extrapolation, and no published run measures it. The task that ships for this arm uses the small 64x64
            size.{' '}
            <Cite id="F06-24">MuJoCo Warp render benchmark and pull request 1113</Cite>{' '}
            <Cite id="F06-27">MuJoCo Playground v1.0.1, SO-101 pick-cube task.py</Cite>
          </Box>
          <Box variant="p">
            To draw thousands of cameras in one pass, Isaac Lab uses tiled rendering, which its{' '}
            <code>TiledCamera</code> sensor class performs. Each environment&apos;s camera gets one tile of a single
            large image on the GPU. The renderer draws the large image once and then cuts it into the separate
            camera images. The result is already a tensor of shape (environments, height, width, channels) in GPU
            memory, and the policy reads it there with no copy to the CPU.{' '}
            <Cite id="F06-64">Isaac Lab paper, section 2.3</Cite> This means that the images from all the cameras
            are in GPU memory at the same time, together with the physics state and the policy that reads them.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Published training runs show how much one camera per environment lowers throughput and raises GPU memory use. The memory per environment ranges from kilobytes with no camera to about 2 GB for one full-fidelity camera, and it is the number you size the GPU by."
          >
            How cameras change training throughput and GPU memory
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The Cartpole benchmark measures the effect of a camera on a whole training run. It ran on one RTX PRO
            6000 Blackwell Server Edition GPU with 96 GB of memory. The card has RTX in its name, but the renderer in
            this benchmark is not an RTX renderer. Newton steps the physics, and the Newton Warp renderer draws one
            camera per environment, at 64 x 64 or 96 x 96 pixels. The benchmark does not record which of the two
            sizes it used. The camera lowers throughput by a factor of 6.7 and raises memory use by a factor of 62,
            from 0.93 GB without a camera to 57.3 GB, which is more than half the card.{' '}
            <Cite id="F06-58">NVIDIA product page, RTX PRO 6000 Blackwell Server Edition</Cite>{' '}
            <Cite id="F06-48">Isaac Lab v3.0.0 benchmark file, Cartpole-Camera rows</Cite>{' '}
            <Cite id="F06-104">Isaac Lab v3.0.0 cartpole_common.py and benchmark export</Cite>
          </Box>
          <Figure
            cites="F06-47 F06-48 F06-58"
            caption={
              <>
                The chart shows NVIDIA&apos;s figures for Cartpole with 8,192 environments on one GPU, and the two
                ratios calculated from them. The dashed line marks the 96 GB of memory on the card that the
                benchmark ran on.
              </>
            }
          >
            <CameraCostChart />
          </Figure>
          <Box variant="p">
            Only part of the 6.7-fold drop in throughput comes from the renderer.{' '}
            <Cite id="F06-48">Isaac Lab v3.0.0 benchmark file, Cartpole-Camera rows</Cite> The benchmark&apos;s training
            figure includes the policy updates, and with a camera, the policy being updated reads images.{' '}
            <Cite id="F06-47">Isaac Lab v3.0.0 benchmark README</Cite> For a camera-based pick task on a Franka arm,
            on one RTX 4090, the MuJoCo Playground authors report how the training time splits: physics takes 24%,
            rendering 18%, policy inference 1% and the policy update 57%.{' '}
            <Cite id="F06-33">MuJoCo Playground paper, vision time breakdown</Cite> With a split like that, a
            renderer that is twice as fast saves 9% of the training time. The time spent on the policy update, 57%
            of the original, does not change.
          </Box>
          <Box variant="p">
            When the physics is heavier, the camera has a smaller effect on throughput. In one task, a Kuka arm with
            an Allegro hand lifts a cube, with 8,192 environments and one fixed 64 x 64 camera in each. For this
            task, NVIDIA reports 220,831 training frames per second with no camera and 115,889 with the Newton Warp
            renderer. That is a factor of 1.9, compared with 6.7 for Cartpole. The contact physics of this task
            already takes much of each step, so the camera adds less on top.{' '}
            <Cite id="F06-49">Isaac Lab v3.0.0 benchmark file, Kuka-Allegro rows</Cite>{' '}
            <Cite id="F06-48">Isaac Lab v3.0.0 benchmark file, Cartpole-Camera rows</Cite>{' '}
            <Cite id="F06-103">Isaac Lab v3.0.0 camera_cfg.py</Cite>
          </Box>
          <Box variant="p">
            The same task also shows the cost of choosing an RTX renderer. Both runs use Newton for the physics. With
            the Newton Warp renderer, training reaches 115,889 frames per second in 13.6 GB. With the RTX renderer
            OVRTX, it reaches 97,307 frames per second in 18.6 GB. So OVRTX gives 97,307 / 115,889 ={' '}
            <Derived>0.84</Derived> of the throughput and uses <Derived>5.0</Derived> GB more memory. The two runs do
            not produce the same images, and the task&apos;s camera presets show the difference. The preset{' '}
            <code>rgb64</code> renders plain colour at 64 x 64 for Newton Warp, and the preset{' '}
            <code>simple_shading_full_mdl64</code> renders a shaded image at the same size for the RTX renderers. So
            the gap comes from the renderer and its heavier output together.{' '}
            <Cite id="F06-49">Isaac Lab v3.0.0 benchmark file, Kuka-Allegro rows</Cite>{' '}
            <Cite id="F06-103">Isaac Lab v3.0.0 benchmark README</Cite>
          </Box>
          <Box variant="p">
            The memory that each environment needs spans about four orders of magnitude, from the physics state
            alone to one full-fidelity camera:
          </Box>
          <ul style={LIST}>
            <li>
              <strong>No camera.</strong> In MuJoCo Warp&apos;s benchmarks, the physics state alone takes 57 KB to
              468 KB per world, from a humanoid to a cluttered table with two arms. A whole Isaac Lab training
              process with no camera takes 0.1 MB to 1.8 MB per environment, across its tasks whose policies read only
              the physics state, and 0.11 MB for Cartpole. These Isaac Lab figures include the learner. The
              learner is the component of the training process that updates the policy.{' '}
              <Cite id="F06-22">MuJoCo Warp nightly benchmarks, total_memory</Cite>{' '}
              <Cite id="F06-102">arithmetic over the Isaac Lab figures</Cite>{' '}
              <Cite id="F06-47">Isaac Lab v3.0.0 benchmark file, state-only rows</Cite>
            </li>
            <li>
              <strong>One small camera per environment.</strong> With the Newton Warp renderer, each environment
              takes 13.6 GB / 8,192 = 1.7 MB on the Kuka lift task and 57.3 GB / 8,192 = 7.0 MB on Cartpole. With an
              RTX renderer, Cartpole takes up to 63.7 GB / 8,192 = 7.8 MB per environment.{' '}
              <Cite id="F06-102">arithmetic over the Isaac Lab figures</Cite>{' '}
              <Cite id="F06-48">Isaac Lab v3.0.0 benchmark file, Cartpole-Camera rows</Cite> MuJoCo Warp&apos;s
              render benchmark falls in the same range: 44.4 GB for its 8192 worlds, about 5.4 MB per world.{' '}
              <Cite id="F06-24">MuJoCo Warp render benchmark</Cite>
            </li>
            <li>
              <strong>One camera at full fidelity.</strong> Each camera can take up to about 2 GB. The USD-Camera is
              the highest-fidelity camera type in the Isaac Lab paper. Its authors report that it runs out of memory
              beyond 48 cameras on a 96 GB card. So 96 GB / 48 = 2 GB is an upper limit on each camera&apos;s share,
              because the card also holds the physics and the learner.{' '}
              <Cite id="F06-63">Isaac Lab paper, section 4.1.2</Cite>
            </li>
          </ul>
          <Box variant="p">
            Whether a run fits in memory at all can depend on the camera type you choose. To train with thousands of
            environments, use the <code>TiledCamera</code> or the <code>RayCasterCamera</code>, which scale &quot;to
            several thousand environments&quot;. The <code>RayCasterCamera</code> casts its rays with Warp. With the
            USD-Camera, a run of that size ends with an out-of-memory error.{' '}
            <Cite id="F06-63">Isaac Lab paper, section 4.1.2</Cite>
          </Box>
          <Box variant="p">
            The range for small cameras, 1.7 MB to 7.8 MB per environment, is too wide to size a GPU from, and the
            image pixels do not explain it. One 64 x 64 colour frame is 64 x 64 x 3 bytes, about{' '}
            <Derived>12 KB</Derived>. On the Kuka task, the run without a camera uses 7.2 GB and the run with a
            camera uses 13.6 GB. So the camera adds <Derived>13.6 GB - 7.2 GB = 6.4 GB</Derived>, about{' '}
            <Derived>0.78 MB</Derived> per environment, which is more than <Derived>60</Derived> times the size of
            the frame. Image size does not explain the difference between the two tasks either. Even if the
            Cartpole camera is 96 x 96, its image has only 2.25 times the pixels of the Kuka image. Yet the memory
            added by the Cartpole camera, <Derived>57.3 GB - 0.93 GB = 56.4 GB</Derived>, is about{' '}
            <Derived>9</Derived> times the <Derived>6.4 GB</Derived> added on the Kuka task. NVIDIA reports one
            memory total per run for the whole training process, including the learner. So NVIDIA&apos;s figures do
            not show where the rest of the memory goes.{' '}
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
            description="The renderer you choose tells you which EC2 instance families can run the job. Within a family, you choose the instance size by the GPU memory the job needs, and from that you can estimate how many environments fit on one GPU."
          >
            Choosing the EC2 instance family and size
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            If you use an RTX renderer, the simulation job has to run on a G-family instance, and that limits how
            you can reserve the capacity. <Cite id="F08-58">the instance table</Cite> Capacity Blocks for ML let you
            reserve a block of GPU instances for a fixed period. As of November 2026, they cover P instance types
            and no G instance type (section 24, Orchestrating Physical AI on AWS).{' '}
            <Cite id="F09-91">EC2 User Guide, Capacity Blocks, supported instance types</Cite> To reserve capacity
            for a G-family simulation fleet, you can use an On-Demand Capacity Reservation instead. This reservation
            type covers G instances (section 29, Choosing).{' '}
            <Cite id="F09-40">EKS best practices, AI/ML compute, reservations</Cite>
          </Box>
          <Box variant="p">
            The table below maps each GPU job in a simulation pipeline to EC2 instance families, based on what the
            job needs from the GPU.
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 640 }}>
              <thead>
                <tr>
                  <th style={TH}>Job</th>
                  <th style={TH}>What it needs from the GPU</th>
                  <th style={TH}>EC2 instance family</th>
                  <th style={TH}>Source</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>Newton physics batches with no camera</td>
                  <td style={TD}>General compute cores and little memory</td>
                  <td style={TD}>
                    G or P: any NVIDIA GPU of the Turing generation (compute capability 7.5) or newer
                  </td>
                  <td style={TD}>
                    <Cite id="F06-51">Isaac Lab v3.0.0 installation guide</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Cameras drawn by a ray tracer written as GPU code</td>
                  <td style={TD}>General compute cores and megabytes of memory per environment</td>
                  <td style={TD}>G; P only after a test run on a P-family GPU</td>
                  <td style={TD}>
                    <Cite id="F06-101">synthesis of the renderer entries</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Cameras drawn by an RTX renderer, and any job that runs in Isaac Sim</td>
                  <td style={TD}>RT cores and general compute cores, and megabytes to gigabytes of memory per camera</td>
                  <td style={TD}>G only: G5, G6, G6e, G7 and G7e</td>
                  <td style={TD}>
                    <Cite id="F06-60">AWS Machine Learning Blog</Cite>{' '}
                    <Cite id="F08-85">price-performance per part</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Training the policy on the images</td>
                  <td style={TD}>Tensor cores, and enough memory to hold the model</td>
                  <td style={TD}>G or P, depending on the model size (section 15, Training at Three Scales)</td>
                  <td style={TD}>
                    <Cite id="F08-76">the workload table</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">
            AWS posted its compatibility list on 9 June 2026, before G7 became generally available on 18 June
            2026, so the list does not settle G7. G7 has a 32 GB GPU with &quot;4th Gen RT Cores&quot;, so we expect it
            to run RTX rendering like the listed G families, but AWS has not confirmed it on that list. <Cite id="F08-52">AWS What&apos;s New, EC2 G7</Cite>{' '}
            <Cite id="F08-43">AWS, EC2 G7 product page</Cite>
          </Box>
          <Box variant="p">
            Within a family, you choose the instance size by its GPU memory. For a simulated camera, GPU memory is
            the bottleneck: it runs out before the unit that draws the images does (section 20, The Fifteen
            Workloads). <Cite id="F08-76">the workload table</Cite> The Cartpole run with 8,192 environments uses
            57.3 GB.{' '}
            <Cite id="F06-48">Isaac Lab v3.0.0 benchmark file, Cartpole-Camera rows</Cite> It fits on the 96 GB GPU of G7e, which is the card that the benchmark ran on, but not on the 32
            GB GPU of G7.{' '}
            <Cite id="F08-53">AWS What&apos;s New, EC2 G7e</Cite> G7&apos;s GPU is sold as 32 GB. If you divide those 32 GB by the memory per environment,
            you get about <Derived>32 GB / 7.0 MB = 4,600</Derived> Cartpole environments, or{' '}
            <Derived>32 GB / 1.7 MB = 19,000</Derived> environments of the Kuka task.
          </Box>
          <Box variant="p">
            Each of these estimates is a bound on how many environments fit. A run&apos;s memory is a fixed part plus a part
            that grows with each environment, and the published figures do not separate the two. When you divide
            the card&apos;s memory by the average per environment, you treat the fixed part as if it also grew with
            the number of environments. If the card is smaller than the run&apos;s memory, as with Cartpole&apos;s
            57.3 GB, this counts too little of the fixed part, so the estimate is an upper limit. If the card is
            larger than the run&apos;s memory, as with the Kuka task&apos;s 13.6 GB, this counts too much of the
            fixed part, so the estimate is a lower limit.{' '}
            <Cite id="F06-48">Isaac Lab v3.0.0 benchmark file, Cartpole-Camera rows</Cite>{' '}
            <Cite id="F06-102">arithmetic over the Isaac Lab figures</Cite>{' '}
            <Cite id="F08-53">AWS What&apos;s New, EC2 G7e</Cite> <Cite id="F08-43">AWS, EC2 G7 product page</Cite>
          </Box>
          <ExpandableSection headerText="RT cores and memory for each GPU, AWS's full compatibility list, and Isaac Sim's hardware limits">
            <div style={{ overflowX: 'auto' }}>
              <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 560 }}>
                <thead>
                  <tr>
                    <th style={TH}>GPU (EC2 family)</th>
                    <th style={TH}>RT cores listed on the product page</th>
                    <th style={TH}>Memory</th>
                  </tr>
                </thead>
                <tbody>
                  <tr data-claim="F06-58">
                    <td style={TD}>A10 (G5 has the AWS variant, the A10G)</td>
                    <td style={TD}>72</td>
                    <td style={TD}>24 GB</td>
                  </tr>
                  <tr data-claim="F06-58">
                    <td style={TD}>L4 (G6)</td>
                    <td style={TD}>&quot;third-generation RT Cores&quot;, with no count given</td>
                    <td style={TD}>24 GB</td>
                  </tr>
                  <tr data-claim="F06-58">
                    <td style={TD}>L40S (G6e)</td>
                    <td style={TD}>142, third generation</td>
                    <td style={TD}>48 GB</td>
                  </tr>
                  <tr data-claim="F08-43">
                    <td style={TD}>RTX PRO 4500 Blackwell Server Edition (G7)</td>
                    <td style={TD}>&quot;4th Gen RT Cores&quot; on AWS&apos;s G7 page, with no count given</td>
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
                    <td style={TD}>H100: 80 GB or 94 GB; H200: 141 GB</td>
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
                AWS&apos;s post of 9 June 2026 was written for Isaac Sim 5.1, before Isaac Lab 3.0 shipped. It marks
                P4d, P4de, P5, P5e, P5en, P6-B200, P6-B300 and P6e-GB200 as incompatible, and G5, G6, G6e and G7e as
                compatible. Its verdict on the P families applies to RTX rendering. It does not cover a headless
                Newton run.{' '}
                <Cite id="F06-60">AWS Machine Learning Blog, Isaac Lab on SageMaker AI</Cite>{' '}
                <Cite id="F06-51">Isaac Lab v3.0.0 installation guide</Cite>
              </li>
              <li>
                Isaac Sim 6.2.0 lists a GeForce RTX 4080 with 16 GB of GPU memory as its minimum, and an RTX PRO 6000
                Blackwell with 48 GB as its ideal tier. The requirements page does not say which variant of the RTX
                PRO 6000 it means. Its 48 GB is half the 96 GB of the Server Edition in G7e.{' '}
                <Cite id="F06-52">Isaac Sim 6.2.0 requirements</Cite>{' '}
                <Cite id="F08-53">AWS What&apos;s New, EC2 G7e</Cite>
              </li>
              <li>
                aarch64 is the Arm processor architecture. On aarch64, Isaac Sim 6.2.0 supports only one
                machine, NVIDIA&apos;s DGX Spark desktop. So AWS Graviton, AWS&apos;s family of Arm processors, is not
                on its list. <Cite id="F06-53">Isaac Sim 6.2.0 requirements, aarch64</Cite>
              </li>
            </ul>
          </ExpandableSection>
          <Box variant="p">
            Before you rent a GPU for simulation, check whether the policy reads images in simulation at all. If it
            does not, and the job does not run in Isaac Sim, the physics can run on a G or a P family. If the policy
            does read images, you choose the family from the renderer. A job that runs in Isaac Sim or uses any RTX
            renderer needs a G family. A job whose cameras use a ray tracer written as GPU code gives up reflections
            and indirect light. In exchange, it can also run on a P family, once a test run there confirms it.{' '}
            <Cite id="F06-51">Isaac Lab v3.0.0 installation guide</Cite>
          </Box>
          <Box variant="p">
            After that, size the GPU from your own task, because NVIDIA&apos;s figures put one environment with a
            camera anywhere from 1.7 MB to 7.8 MB. <Cite id="F06-102">arithmetic over the Isaac Lab figures</Cite>{' '}
            To measure the memory that each additional environment needs, run the task with two different numbers of
            environments. Read the memory in GiB, the unit that the EC2 documentation uses. For example, an L40S
            sold as 48 GB appears there as 44 GiB.{' '}
            <Cite id="F08-45">EC2 accelerated computing specifications, accelerator memory</Cite> Divide the
            difference in memory by the difference in the number of environments. The result is the memory for one
            more environment, without the fixed part of the process. A second pair of runs at a different image size
            shows how much of that memory grows with the number of pixels. Finally, divide the memory left free on
            the card during the smaller run by the memory per environment. The result is how many more environments
            the card can hold.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
