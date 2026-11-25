import { useState } from 'react';
import type { CSSProperties } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Link from '@cloudscape-design/components/link';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import FormField from '@cloudscape-design/components/form-field';
import Select from '@cloudscape-design/components/select';
import { Cite, Toy } from '../components/Cite';
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
          one camera per environment: <tspan fontWeight="bold">152,124</tspan>, 6.7 times less
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
            Each row is a separate engine on the same card, in the colour this dive uses for that machine part. The
            rows outlined in blue are the ones the selected workload uses. A card can lack an engine altogether.
            Schematic, with no sizes drawn.
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
            description="Understand why a simulator with cameras needs a different GPU than a trainer, and which software the ray-tracing rule applies to (Isaac Sim 6.2.0, Isaac Lab 3.0 and MuJoCo 4.0.1, sources read 2026-11-20)"
          >
            13. Rendering and Ray Tracing: Why Simulated Cameras Pick the GPU
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Rendering is computing the image a camera would see of a scene that exists only as numbers. A policy that
            reads camera images needs one such image from every simulated camera at every decision, so the simulator
            that trains it is also a renderer. Rendering loads parts of a GPU that training a network leaves idle,
            which is why the two jobs can land on different instance families.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Why a simulator that already knows where the block is still has to draw a picture of it">
            The policy needs to see
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            At the bench the {ARM} is asked to {TASK_STORY}, and its policy finds the block through two cameras
            (section 3). Move the arm into a simulator and the physics of section 12 hands you the block&apos;s
            position as a number. A policy trained on that number expects to be told where the block is, and on the
            real arm nobody tells it. So the simulated arm gets a simulated camera, and the simulator has to work
            out what that camera sees.
          </Box>
          <Box variant="p">
            The simulated task that ships for this arm, <code>{SIM_TASK}</code> in MuJoCo Playground, renders one
            64x64 wrist-camera image per policy step. It covers the pick half of the story: the policy learns to{' '}
            {SIM_TASK_PLAIN}, and {SIM_TASK_GAP} is this dive&apos;s extension.{' '}
            <Cite id="F06-27">MuJoCo Playground v1.0.1, SO-101 pick-cube task.py</Cite> Training runs thousands of
            environments at once (an environment is one copy of the scene plus its task, section 12), and every one
            of them needs its own image at every step.
          </Box>
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
          <CaptureSlot
            what="Isaac Sim capture of the SO-101 scene, to be recorded on our own machines: the same scene drawn by a ray-traced renderer, with shadows and reflections."
            meanwhile="The frame above comes from MuJoCo's own renderer, which rasterises."
          />
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Rasterisation starts from the shapes, ray tracing starts from the pixels: enough to read any renderer's description">
            Two ways to make an image
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A simulator stores every surface as a mesh of triangles. There are two ways to turn triangles into the
            pixels of an image.
          </Box>
          <Box variant="p">
            <strong>Rasterisation</strong> starts from the triangles. It projects the corners of each triangle onto
            the image and fills the pixels in between. It is fast at deciding what is visible.
          </Box>
          <Box variant="p">
            <strong>Ray tracing</strong> starts from the pixels. It sends a ray from the camera through each pixel
            and finds the first surface the ray lands on. From that point it sends more rays. One of them, the
            shadow ray, goes toward the light: if something is in the way, the point is in shadow. Reflections and
            light bounced off other surfaces are more rays of the same kind, so shadows and reflections come out
            physically right at a higher cost per image.{' '}
            <Cite id="F06-56">NVIDIA Developer, ray tracing explainer</Cite>
          </Box>
          <Box variant="p">
            The figure forms one small image both ways. Step through it and watch where the shadow comes from.
          </Box>
          <AnimatedFigure
            name="one image formed by rasterising and by ray tracing"
            steps={RENDER_FORM_STEPS}
            intervalMs={3600}
            cites="F06-27"
            caption={
              <>
                Left, the scene the renderer holds. Right, the camera&apos;s image, formed twice from the same
                triangles: the blue outline marks the pixels where a shadow ray was blocked, the only pixels where
                the two images differ. Illustrative, not measured: the geometry is invented and the image is drawn
                at <Toy>16 x 12</Toy> pixels, where the shipped task renders 64 x 64. The rasteriser
                drawn here does only the two steps described above.
              </>
            }
          >
            {(step, reduced) => <RenderForm step={step} reduced={reduced} />}
          </AnimatedFigure>
          <Box variant="p">
            The expensive part of ray tracing is the search: which triangle does this ray land on? A ray tracer
            sorts the triangles into a tree of nested boxes and walks down it, so a ray that misses a box skips
            everything inside. The tree is a BVH (bounding-volume hierarchy), and NVIDIA calls walking it &quot;the
            most time consuming part of the ray tracing calculations&quot;.{' '}
            <Cite id="F06-57">NVIDIA Developer, ray tracing explainer, hardware section</Cite> Hold on to that
            search. Where it runs decides which GPU you need.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="See one card as separate engines, so 'a GPU' stops being one resource when you size a job">
            Two kinds of GPU work
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A GPU is several engines on one card. Tensor cores multiply matrices, the arithmetic of training and
            running a neural network. RT cores (ray-tracing cores) are hardware built to speed up the BVH search; RTX is
            NVIDIA&apos;s name for rendering that hands the search to them.
            NVENC and NVDEC (NVIDIA&apos;s video encode and decode engines) are fixed circuits that compress and
            decompress video and do nothing else. The general compute cores run every other kind of GPU code, the
            physics batches of section 12 included. GPU memory is shared by all of them.
          </Box>
          <Box variant="p">
            NVIDIA&apos;s profiling guide lists tensor cores and &quot;RT Cores, if available&quot; as separate
            units of a GPU.{' '}
            <Cite id="F08-36">Nsight Compute Profiling Guide, Streaming Multiprocessor</Cite> The words &quot;if
            available&quot; carry the section: a card can have some engines and lack others. The GPU in the EC2 G7
            family has &quot;5th Gen Tensor Cores, and 4th Gen RT Cores&quot; plus both video engines on one card.{' '}
            <Cite id="F08-43">AWS, EC2 G7 product page</Cite> NVIDIA&apos;s H100, the training GPU of the EC2 P5
            family, is described on its product page with no mention of RT cores or ray tracing.{' '}
            <Cite id="F06-59">NVIDIA H100 and H200 product pages</Cite>
          </Box>
          <EnginePicker />
          <Box variant="p">
            Pick policy training, then RTX rendering, and different rows light up. A trainer asks for tensor cores
            and memory. A simulator whose cameras are drawn by an RTX renderer asks for RT cores and memory. A card
            built for the first can lack the hardware for the second. The{' '}
            <Link href="../silicon-memory-inference/">Silicon, Memory &amp; Inference dive</Link> covers how the
            tensor side executes a model.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Count the rays by hand, then read what a camera did to one published training run: 6.7 times the throughput and 62 times the memory">
            Worked example: what one camera costs
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Count rays first. A 64x64 image has 64 x 64 = 4,096 pixels, so 4,096 rays leave the camera before any
            shadow ray is sent. A 640x480 frame, the size the real cameras of section 3 deliver, is 307,200 rays,
            75 times more.{' '}
            <Cite id="F06-24">MuJoCo Warp docs and render benchmark</Cite>
          </Box>
          <Box variant="p">
            Training multiplies that. With <M>E</M> environments, <M>C</M> cameras in each, and images <M>W</M>{' '}
            pixels wide and <M>H</M> pixels high, one step sends at least <M>{String.raw`N_{\text{rays}}`}</M> rays:
          </Box>
          <Formula
            name="Camera rays per simulation step (this page's count, one ray per pixel)"
            tex={String.raw`N_{\text{rays}} = E \times C \times W \times H`}
          />
          <Box variant="p">
            <M>E</M> carries the parallel copies that reinforcement learning wants, <M>C</M> the cameras the policy
            reads, and <M>{String.raw`W \times H`}</M> the image size. For 8,192 environments with one 64 x
            64 camera each, that is 8,192 x 64 x 64 = 33.6 million rays per step, one per pixel.{' '}
            <Cite id="F06-103">Isaac Lab v3.0.0 camera_cfg.py and benchmark README</Cite> Every term multiplies:
            the MuJoCo Warp project says its renderer &quot;scales linearly with resolution and number of
            cameras&quot;. <Cite id="F06-24">MuJoCo Warp pull request 1113</Cite>
          </Box>
          <Box variant="p">
            Now a published run. NVIDIA&apos;s release benchmark for Isaac Lab 3.0, its robot-learning framework,
            trains with 8,192 environments on one RTX PRO 6000 Blackwell Server Edition GPU. The task is Cartpole,
            a cart balancing a pole, where the camera&apos;s cost shows almost alone. On Newton,
            the GPU physics engine of section 12, NVIDIA reports 1,023,698 training frames per second at 0.93 GB of
            GPU memory with no camera.{' '}
            <Cite id="F06-47">Isaac Lab v3.0.0 benchmark file, Cartpole rows</Cite> With one small camera per
            environment, drawn by Newton&apos;s own ray tracer, it reports 152,124 at 57.3 GB. Our arithmetic from
            those rows: 1,023,698 / 152,124 is a factor of 6.7 in throughput, and 57.3 / 0.93 is a factor of 62 in
            GPU memory.{' '}
            <Cite id="F06-48">Isaac Lab v3.0.0 benchmark file, Cartpole-Camera rows</Cite>
          </Box>
          <Figure
            cites="F06-47 F06-48 F06-58"
            caption={
              <>
                NVIDIA&apos;s figures for Cartpole with 8,192 environments on one GPU; the two ratios are our
                arithmetic. Compare the bars inside each pair. The dashed line is the 96 GB of the card the
                benchmark ran on: one camera per environment takes more than half of it.
              </>
            }
          >
            <CameraCostChart />
          </Figure>
          <Box variant="p">
            The size of that camera image is not established. The benchmark export labels these rows as part of a
            64-pixel comparison, the task&apos;s default configuration sets 96 x 96, and the export does not record
            which size was rendered.{' '}
            <Cite id="F06-104">Isaac Lab v3.0.0 cartpole_common.py and benchmark export</Cite>
          </Box>
          <Box variant="p">
            A task closer to the arm&apos;s softens the throughput factor. With a Kuka arm and an Allegro hand
            lifting a cube, one fixed 64 x 64 camera per environment, NVIDIA reports 220,831 training frames per
            second without the camera and 115,889 with it on Newton, at 13.6 GB. That is a factor of 1.9: contact
            physics already takes much of each step, so the camera adds less on top.{' '}
            <Cite id="F06-49">Isaac Lab v3.0.0 benchmark file, Kuka-Allegro rows</Cite>{' '}
            <Cite id="F06-103">Isaac Lab v3.0.0 camera_cfg.py</Cite>
          </Box>
          <Box variant="p">
            Memory is the cost that binds. Per environment, by our arithmetic over the published figures:
          </Box>
          <ul style={LIST}>
            <li>physics with no camera: 57 KB to 468 KB per world;</li>
            <li>one small camera per environment: 1.7 MB to 7.8 MB;</li>
            <li>one camera at full fidelity: about 2 GB.</li>
          </ul>
          <Box variant="p">
            <Cite id="F06-102">arithmetic over the MuJoCo Warp and Isaac Lab figures</Cite> The last rung comes
            from the Isaac Lab authors, who report that their highest-fidelity camera type runs out of memory
            beyond 48 cameras on a 96 GB card.{' '}
            <Cite id="F06-63">Isaac Lab paper, section 4.1.2</Cite> Physics is cheap in memory and pixels are not.
            The camera decides how many environments fit on a card.
          </Box>
          <ExpandableSection headerText="How to read the benchmark rows">
            <ul style={LIST}>
              <li>
                The renderers do not draw the same output. The Newton rows render plain colour and the RTX rows a
                shaded data type, so the comparison between renderers is not pixel for pixel.{' '}
                <Cite id="F06-103">Isaac Lab v3.0.0 benchmark README</Cite>
              </li>
              <li>
                Rendering is one slice of a training step. For a camera-based pick task on a Franka arm, the
                authors of the MuJoCo Playground paper report physics at 24% of training time, rendering at
                18%, policy inference at 1% and the policy update at 57%, on one RTX 4090.{' '}
                <Cite id="F06-33">MuJoCo Playground paper, vision time breakdown</Cite>
              </li>
            </ul>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Which simulators need RT cores, in the vendors' words: the requirement belongs to one way of rendering, and physics is outside it">
            The rule, with its scope
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The BVH search can run in two places on a GPU, and rasterisation skips it. That gives three ways to
            render, each on different hardware. The grouping is our reading of the renderers&apos; documentation.{' '}
            <Cite id="F06-101">synthesis of the renderer entries</Cite>
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
                  <td style={TD}>RT cores and GPU memory</td>
                  <td style={TD}>
                    Required. <Cite id="F06-52">Isaac Sim 6.2.0 requirements</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">
            Isaac Sim, NVIDIA&apos;s simulator application, renders with RTX, and its requirements page for version 6.2.0 says: &quot;GPUs
            without RT Cores (A100, H100) are not supported.&quot;{' '}
            <Cite id="F06-52">Isaac Sim 6.2.0 requirements</Cite>
          </Box>
          <Box variant="p">
            That sentence is about Isaac Sim. Isaac Lab 3.0 no longer needs Isaac Sim underneath it, and its
            install guide draws the line in its own words: &quot;Headless Newton simulation does not require RTX
            hardware&quot;, and &quot;RTX rendering has its own GPU and driver requirements&quot;. Headless means
            running with no window and no camera images.{' '}
            <Cite id="F06-51">Isaac Lab v3.0.0 installation guide</Cite> So the rule is about RTX rendering. Physics
            is outside it.
          </Box>
          <Box variant="p">
            The middle row shows the scope from the other side. MuJoCo Warp&apos;s batch renderer is a ray tracer
            whose BVH search runs as ordinary code on the general compute cores. Its project
            publishes a benchmark of 8192 worlds with one 64x64 camera each on an RTX 6000 Ada: about 1.3 million
            frames per second by our arithmetic from its timing, using 44.4 GB of GPU memory.{' '}
            <Cite id="F06-24">MuJoCo Warp render benchmark</Cite> The trade is fidelity: Isaac Lab describes its
            Warp renderer as direct lighting only, for when &quot;camera throughput and memory matter more than
            material and lighting fidelity&quot;. <Cite id="F06-50">Isaac Lab v3.0.0 docs, renderers</Cite>
          </Box>
          <Box variant="p">
            Thousands of cameras are drawn in one pass. Each environment&apos;s camera gets one tile of a single
            large image on the GPU, which is then cut apart. The result is already a tensor of shape
            (environments, height, width, channels) in GPU memory, where the policy reads it.{' '}
            <Cite id="F06-64">Isaac Lab paper, section 2.3</Cite>
          </Box>
          <ExpandableSection headerText="How firm the middle row is">
            <Box variant="p">
              MuJoCo&apos;s documentation after 4.0.1 adds an optional back end for RTX GPUs and says that when it
              is unavailable the renderer &quot;warns and falls back&quot; to the Warp path. That is first-party
              evidence that the Warp path does not depend on RTX hardware.{' '}
              <Cite id="F06-62">MuJoCo docs, MuJoCo Warp chapter, default branch</Cite> A vendor sentence that
              names the A100, H100 or B200 as supported for these renderers was not located in this research.
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Turn the renderer you chose into an EC2 family, then let GPU memory pick the size">
            What it does to the instance choice
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            On EC2 the split falls between two families of GPU instance. The G families carry GPUs with RT cores.
            The P families carry the data-centre training GPUs. AWS stated the rule in a post of 9 June 2026,
            written against Isaac Sim 5.1: the RTX renderer &quot;requires GPUs with hardware RT Cores&quot;; G5,
            G6, G6e and G7e are compatible; P4d, P4de, P5, P5e, P5en, P6-B200, P6-B300 and P6e-GB200 are not.{' '}
            <Cite id="F06-60">AWS Machine Learning Blog, Isaac Lab on SageMaker AI</Cite>
          </Box>
          <Box variant="p">
            The post does not list G7, which became generally available on 18 June 2026. Its product page lists
            &quot;4th Gen RT Cores&quot; on a GPU with 32 GB.{' '}
            <Cite id="F08-52">AWS What&apos;s New, EC2 G7</Cite> <Cite id="F08-43">AWS, EC2 G7 product page</Cite>{' '}
            Counting G7 among the RTX-capable families is our reading of that page.{' '}
            <Cite id="F08-58">the dive&apos;s instance table</Cite> G7e, generally available since 20 January 2026,
            carries the card of the benchmark above, with 96 GB per GPU.{' '}
            <Cite id="F08-53">AWS What&apos;s New, EC2 G7e</Cite> The EC2 specification page read for this dive
            shows nothing newer than G7 and G7e in G. <Cite id="F08-51">EC2 accelerated computing specifications</Cite>
          </Box>
          <Box variant="p">The family column below is our reading of the entries cited in each row.</Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 640 }}>
              <thead>
                <tr>
                  <th style={TH}>Job</th>
                  <th style={TH}>Engine it needs</th>
                  <th style={TH}>EC2 family</th>
                  <th style={TH}>Source</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>Physics batches with no camera</td>
                  <td style={TD}>General compute cores, little memory</td>
                  <td style={TD}>G or P: any recent NVIDIA GPU</td>
                  <td style={TD}>
                    <Cite id="F06-51">Isaac Lab v3.0.0 installation guide</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Cameras drawn by a ray tracer written as GPU code</td>
                  <td style={TD}>General compute cores, megabytes of memory per environment</td>
                  <td style={TD}>G, and P by our reading; no vendor statement for the P-family GPUs was located</td>
                  <td style={TD}>
                    <Cite id="F06-101">synthesis of the renderer entries</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Cameras drawn by an RTX renderer, and Isaac Sim itself</td>
                  <td style={TD}>RT cores, megabytes to gigabytes of memory per camera</td>
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
                    <Cite id="F08-76">the dive&apos;s workload table</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">
            Inside a family, memory picks the size. The Cartpole run with cameras used 57.3 GB, 62 times the run
            without them, at a throughput 6.7 times lower.{' '}
            <Cite id="F06-48">Isaac Lab v3.0.0 benchmark file, Cartpole-Camera rows</Cite> That fits the 96 GB GPU
            of G7e. It does not fit the 32 GB GPU of G7, where the same recipe would need fewer environments or a
            smaller image. Read the usable figure off the EC2 documentation before sizing: it prints GiB, so a GPU
            sold as 48 GB shows as 44 GiB and one sold as 24 GB as 22 GiB.{' '}
            <Cite id="F08-45">EC2 accelerated computing specifications, accelerator memory</Cite>
          </Box>
          <ExpandableSection headerText="RT cores card by card, and two limits worth knowing">
            <div style={{ overflowX: 'auto' }}>
              <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 560 }}>
                <thead>
                  <tr>
                    <th style={TH}>GPU (EC2 family)</th>
                    <th style={TH}>RT cores on NVIDIA&apos;s product page</th>
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
              <Cite id="F06-59">NVIDIA H100 and H200 product pages</Cite>
            </Box>
            <ul style={LIST}>
              <li>
                Isaac Sim 6.2.0 lists a GeForce RTX 4080 with 16 GB of GPU memory as its minimum and an RTX PRO 6000
                Blackwell with 48 GB as its ideal tier.{' '}
                <Cite id="F06-52">Isaac Sim 6.2.0 requirements</Cite>
              </li>
              <li>
                On aarch64, the Arm processor architecture, Isaac Sim 6.2.0 supports only NVIDIA&apos;s DGX Spark
                desktop machine. By our reading that leaves no path for Isaac Sim on Graviton, AWS&apos;s Arm
                processors. <Cite id="F06-53">Isaac Sim 6.2.0 requirements, aarch64</Cite>
              </li>
              <li>
                A counter for RT-core use was not located in the profiling guide read for this dive.{' '}
                <Cite id="F08-36">Nsight Compute Profiling Guide</Cite>
              </li>
            </ul>
          </ExpandableSection>
          <Box variant="p">
            So the order of decisions is short. Decide whether the policy has to see in simulation. If it does,
            choose the renderer: one written as GPU code when throughput matters most, an RTX renderer when the
            images must carry reflections and indirect light. An RTX renderer sends the job to a G family. Then
            count environments against GPU memory, expecting megabytes per camera where physics took kilobytes.
            Section 20, Fifteen Workloads, Five Shapes, puts every workload of the loop on this same card.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
