# Claims: section 13, Rendering and Ray Tracing

claim | register ID

Isaac Sim draws its cameras with the Omniverse RTX renderer, which requires GPUs with hardware RT cores | F06-60
RT cores accelerate BVH traversal, "the most time consuming part of the ray tracing calculations" | F06-57
Isaac Sim 6.2.0: "GPUs without RT Cores (A100, H100) are not supported."; the whole application is unsupported on such a GPU | F06-52
AWS post of 9 June 2026, written against Isaac Sim 5.1: G5, G6, G6e, G7e compatible; P4d, P4de, P5, P5e, P5en, P6-B200, P6-B300, P6e-GB200 (data-centre GPUs without RT cores) not | F06-60
The A100 and H100 are data-centre training GPUs, sold on EC2 in the P families; GPUs with RT cores sit in the G families; a job that draws its cameras with Isaac Sim simulates on a G family whichever family trains the policy | F06-60
The documented rule reaches as far as Isaac Sim and RTX rendering (scope of the documentation; no claim beyond it, U8 open) | F06-101
MuJoCo's built-in renderers rasterise and need no RT cores; MuJoCo is DeepMind's open-source physics simulator (repository google-deepmind/mujoco) | F06-61, F06-101
Isaac Lab 3.0 needs no RTX hardware to run Newton when a job asks for neither camera images nor an interactive view | F06-51
Ray tracers written as GPU code (MuJoCo Warp, Isaac Lab 3.0's Newton Warp) ask for no RT cores in their documentation, which names no training GPU as supported (our reading) | F06-101, F06-62, F06-24, F06-50
The three groups by where the BVH walk runs; RTX is the only group whose documentation asks for RT cores (printed as "by our reading of the renderers' documentation") | F06-101
A simulator pairs a physics engine with a renderer; GPU physics runs on general compute, so the RT-core question is mostly about the renderer; Isaac Sim is the one exception, requiring RT cores for everything it runs | F06-100, F06-52
A Warp renderer keeps P-family GPUs open pending one test run (our mapping; U8) | F06-101, F06-62
MuJoCo Playground is DeepMind's suite of robot tasks for MuJoCo | F06-27, F06-61
Ray tracers written as GPU code include those built on Warp, NVIDIA's Python-to-GPU-code compiler; Newton is Isaac Lab 3.0's GPU physics engine; MuJoCo Warp is the GPU version of MuJoCo | F06-39, F06-24, F06-50
Isaac Lab 3.0: "Headless Newton simulation does not require RTX hardware"; "RTX rendering has its own GPU and driver requirements"; renderer requirements apply "when you need camera images or an interactive view"; Isaac Lab 3.0 no longer needs Isaac Sim | F06-51
Isaac Lab 3.0 benchmark, Cartpole, 8,192 environments, one RTX PRO 6000 Blackwell Server Edition, no camera: 1,023,698 training FPS (includes policy updates) at 0.93 GB, 0.11 MB per environment (vendor claim; per-environment figure derived) | F06-47, F06-102
Same with one small camera per environment (Newton Warp renderer): 152,124 FPS at 57.3 GB, 7.0 MB per environment; factor 6.7 in throughput and 62 in memory (vendor claim; ratios derived) | F06-48
The benchmark card has 96 GB | F06-58
The Cartpole rows' camera size is not recorded (label says 64, task config says 96 x 96); 96 x 96 is 2.25 times the pixels of 64 x 64 | F06-104
NVIDIA's memory figures are whole-process totals, so where the camera's megabytes sit is not published | F06-47, F06-104
The shipped SO-101 vision task, in MuJoCo Playground (DeepMind's task suite, repository google-deepmind/mujoco_playground), runs its policy at 10 Hz and renders one 64x64 wrist-camera image per policy step; it covers the pick only | F06-27
Training runs 8,192 environments on one GPU in Isaac Lab's benchmark | F06-47
Rasterisation projects triangles onto the image and is fast at deciding visibility; ray tracing follows rays per pixel and gives physically accurate shadows and reflections; the figure's rasteriser stops at projecting and filling (scoped to the illustration in its caption) | F06-56
BVH: tree of nested boxes; its traversal is the most time-consuming part of ray tracing | F06-57
Tensor cores multiply matrices (a pipeline that executes only MMA instructions, separate from general compute); GPU physics runs on general compute (our reading); a network's other code runs on the general compute cores | F08-42, F06-100
The SM's general units handle lighting and shading; RT cores are a shared unit inside the SM, "if available"; RT cores take only the BVH walk, the most time-consuming part | F08-36, F06-57
Policy training and RTX rendering share general compute and memory and differ in one specialised unit; a card designed around tensor cores can ship without RT cores (P-family data-centre GPUs) | F08-42, F08-36, F06-60
Engine figure caption: a card can lack a unit ("RT Cores, if available" in NVIDIA's profiling guide) | F08-36
The EC2 G7 GPU has "5th Gen Tensor Cores, and 4th Gen RT Cores" plus NVENC and NVDEC engines, 32 GB per GPU | F08-43
Engine figure mapping (shared GpuEngines, corrected 2026-11-25 per accuracy review B): policy training, policy inference and world-model generation on tensor cores, general compute cores and memory; physics batches on general compute and memory; RTX rendering on RT cores (BVH walk), general compute cores (lighting and shading) and memory; ray tracing as GPU code on general compute and memory; video decode and encode on NVDEC and NVENC with memory (the figure's memory row: every engine works out of it) | F08-42, F08-36, F08-76, F06-100, F06-52, F06-57, F06-101, F06-24, F06-62, F08-31, F08-44, F05-47, F05-35, F05-108
MuJoCo's built-in renderers are rasterisers that run on a GPU graphics pipeline or on the CPU | F06-61
Isaac Lab 3.0 renderers: Newton Warp (a Warp ray tracer, direct lighting only, for throughput and memory over fidelity), OVRTX (recommended RTX renderer), Isaac RTX (inside Isaac Sim, legacy) | F06-50
OVRTX is "kit-less RTX rendering", the RTX renderer packaged to run without Isaac Sim | F06-50
Newton Warp pairs with Newton or with PhysX (Isaac Sim's engine; the docs also list OvPhysX); paired with Newton and no Isaac Sim it leaves no documented RT-core requirement; with Isaac Sim underneath the job carries Isaac Sim's requirement; Newton Warp gives up reflections and indirect light | F06-50, F06-47, F06-51, F06-101, F06-52
The Cartpole benchmark card (RTX PRO 6000) has RTX in its name while its renderer, Newton Warp, is not one of the RTX renderers | F06-48, F06-50
Speed comparisons: in Isaac Lab 3.0's release benchmarks "Newton Warp has the highest throughput, and OVRTX outperforms Isaac RTX" (vendor claim); the Warp ray-caster camera is faster at low resolutions, the tiled RTX camera at higher ones (author reported; no crossover resolution printed, so the text advises timing at the reader's own image size); both compare whole renderers, not RT cores alone | F06-50, F06-63
Warp is NVIDIA's Python-to-GPU-code compiler underneath Newton | F06-39
RTX fidelity: reflections, transparency, indirect light, traded against throughput and memory | F06-50
Domain randomisation: randomise rendering so widely that "the real world may appear to the model as just another variation" | F06-66
The SO-101 task randomises colours, lighting, camera parameters and per-pixel image noise | F06-28
Playground authors: 12 of 12 real trials for a Franka pick policy trained on 64x64 images from a software ray tracer written in CUDA (author reported) | F06-34
MuJoCo Warp's batch renderer is a ray tracer on Warp's BVH, on general GPU compute | F06-24
MuJoCo Warp docs after 4.0.1: default backend="warp"; optional backend="optix" "available on NVIDIA RTX GPUs"; when OptiX is unavailable it "warns and falls back" to the Warp path; no vendor sentence naming A100, H100 or B200 as supported was located | F06-62
A 64x64 image is 4,096 rays; 640x480 is 307,200 rays, 75 times as many; renderer cost scales linearly with resolution and number of cameras | F06-24
8,192 environments x 64 x 64 = 33.6 million rays per step, one per pixel | F06-103
MuJoCo Warp render benchmark: 8192 worlds, one 64x64 camera each, on an RTX 6000 Ada, records a render time of 756 per world per frame (vendor claim, no unit printed); the text takes it as nanoseconds, "the unit its physics rows imply"; 6.2 ms per batch and 465 ms at 640x480 are derived, the second an extrapolation | F06-24
Tiled rendering in Isaac Lab, the TiledCamera sensor class: one tile per environment in one frame buffer, output a tensor (environments, height, width, channels) read without a copy to the CPU | F06-64
Training FPS includes policy updates; memory figures are whole-process, learner included | F06-47
Playground paper time split for a Franka camera pick task on one RTX 4090: physics 24%, rendering 18%, policy inference 1%, policy update 57% (author reported); halving rendering returns 9% (derived) | F06-33
Kuka-Allegro lift, one fixed 64 x 64 camera per environment: 220,831 to 115,889 FPS on Newton with the Newton Warp renderer at 13.6 GB, a factor of 1.9 (vendor claim; factor derived) | F06-49, F06-103
OVRTX on the same task: 97,307 FPS at 18.6 GB; 0.84 of Newton Warp's throughput, 5.0 GB more (derived); presets rgb64 (plain colour, 64 x 64, Newton Warp) and simple_shading_full_mdl64 (shaded data type, same size, RTX renderers) | F06-49, F06-103
Memory per environment: 57 KB to 468 KB physics state only (humanoid to Aloha clutter); whole Isaac Lab state-only training process 0.1 MB to 1.8 MB, 0.11 MB for Cartpole; the ladder from physics state to a full-fidelity camera spans more than four orders of magnitude (57 KB to about 2 GB, derived) | F06-22, F06-102, F06-47
Memory per environment with a small camera: 1.7 MB (13.6 GB) to 7.8 MB (63.7 GB) at 8,192 environments; 7.0 MB for the Cartpole Newton Warp row (derived) | F06-102, F06-48
MuJoCo Warp render benchmark memory: 44.4 GB for 8192 worlds, about 5.4 MB per world | F06-24
Isaac Lab's USD-Camera, the highest-fidelity camera type, runs out of memory beyond 48 cameras on a 96 GB card; 96 GB / 48 = 2 GB is a ceiling per camera (derived); the Tiled-Camera and the RayCasterCamera (Warp ray caster) scale "to several thousand environments"; ray caster faster at low resolutions, tiled camera at high (author reported) | F06-63, F06-102
A 64 x 64 colour frame is about 12 KB (derived) | F06-102, F06-103
Kuka-Allegro no-camera row 7.2 GB; memory that came with the camera 13.6 - 7.2 = 6.4 GB, about 0.78 MB per environment, more than 60 times a 12 KB frame (derived) | F06-49
Cartpole: memory that came with the camera 57.3 - 0.93 = 56.4 GB, about 9 times the Kuka task's 6.4 GB, against 2.25 times the pixels at most (derived) | F06-47, F06-48, F06-49, F06-104
The AWS list was written against Isaac Sim 5.1, before Isaac Lab 3.0 shipped; the P-family verdict now holds for RTX rendering, not for headless Newton (in the expandable) | F06-60, F06-51
EC2 table family column is our mapping (header says so); Newton physics with no camera: G or P, any NVIDIA GPU of the Turing generation or newer (compute capability 7.5) | F06-51
EC2 table, ray tracer as GPU code: G; P after one test run (the scope, no vendor statement covering P-family GPUs located, U8, is stated in the renderer section) | F06-101, F06-62
G7 generally available 18 June 2026, 32 GB per GPU, "4th Gen RT Cores"; the AWS list predates it; placing it with the RTX families is our reading | F08-52, F08-43, F08-58
G7e carries the benchmark's card, the RTX PRO 6000 Blackwell Server Edition with 96 GB per GPU | F08-53
Expandable table row: RTX PRO 4500 Blackwell Server Edition (G7), "4th Gen RT Cores" on AWS's G7 page, 32 GB | F08-43
Isaac Sim 6.2.0's ideal tier names "RTX PRO 6000 Blackwell" with no variant and 48 GB, half the 96 GB of the Server Edition in G7e | F06-52, F08-53
An RTX renderer ties a simulation job to a G family; G families carry RT-core GPUs, P families the data-centre training GPUs (instance table, our reading) | F08-58
Capacity Blocks list (as of 2026-11-20) holds P and Trainium types and no G type | F09-91
On-Demand Capacity Reservations cover G instances; a G-family fleet can be held that way | F09-40
RTX camera rendering belongs on G families only (our reading) | F08-85, F06-60
Simulated cameras fill GPU memory first, then the rendering path (our reading) | F08-76
Cartpole at 8,192 environments (57.3 GB) fits the 96 GB GPU of G7e and not the 32 GB GPU of G7 | F06-48, F08-53, F08-43
G7's GPU, sold as 32 GB, holds about 4,600 environments at 7.0 MB and 19,000 at 1.7 MB (derived); memory = fixed part + cost per environment, the rows do not separate them, and dividing by the average charges the fixed part in proportion to the count, so Cartpole (scaled down) is a ceiling and Kuka (scaled up) a floor | F06-48, F06-102, F06-47, F08-43
Sizing method: measure at two counts of environments, divide the memory difference by the count difference, divide the memory left free by that cost; a second pair at another image size separates the part that grows with the pixels (method, arithmetic; no published split of the per-environment megabytes exists in the registers) | F06-47
EC2 docs list memory in GiB: an L40S sold as 48 GB shows as 44 GiB (not "usable"; register correction 2026-11-25) | F08-45
RT cores per card: A10 72, 24 GB; L4 third-generation, no count, 24 GB; L40S 142, 48 GB; RTX PRO 6000 Blackwell Server Edition 188, 96 GB | F06-58
NVIDIA's H100 and H200 product pages do not mention RT cores; memory 80 or 94 GB and 141 GB | F06-59
Isaac Sim 6.2.0 tiers: RTX 4080 16 GB minimum, RTX PRO 6000 Blackwell 48 GB ideal | F06-52
Isaac Sim 6.2.0 on aarch64 supports only the DGX Spark, so Graviton is not on its list | F06-53
