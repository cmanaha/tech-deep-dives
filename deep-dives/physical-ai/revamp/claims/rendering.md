# Claims: section 13, Rendering and Ray Tracing

claim | register ID

The shipped SO-101 vision task renders one 64x64 wrist-camera image per policy step; it covers the pick half only | F06-27
Rasterisation projects triangles onto the image and is fast at deciding visibility; ray tracing follows rays per pixel and gives physically accurate shadows and reflections | F06-56
An RT core accelerates traversal of the bounding-volume hierarchy, "the most time consuming part of the ray tracing calculations" | F06-57
NVIDIA's profiling guide lists tensor cores and "RT Cores, if available" as separate units; no RT-core counter located in that guide | F08-36
The EC2 G7 GPU has "5th Gen Tensor Cores, and 4th Gen RT Cores" plus NVENC and NVDEC engines, 32 GB per GPU | F08-43
NVIDIA's H100 and H200 product pages do not mention RT cores; memory 80 or 94 GB and 141 GB | F06-59
Engine mapping, training and inference on tensor cores and memory | F08-42, F08-76
Engine mapping, GPU physics batches on general compute and memory (tensor cores not involved: our reading) | F06-100, F08-42, F08-76
Engine mapping, RTX rendering needs RT cores | F06-52, F06-57, F06-101
Engine mapping, ray tracing written as GPU code runs on general compute (our reading) | F06-24, F06-62, F06-101
Engine mapping, video decode and encode are separate fixed-function engines; H100 has no encoder and no AV1 decode; LeRobot writes AV1 by default | F08-31, F08-44, F05-47, F05-35
Engine mapping, world-model generation on tensor cores and tens of GB of memory | F05-108, F08-76
A 64x64 image is 4,096 rays; 640x480 is 307,200 rays, 75 times more; renderer cost scales linearly with resolution and number of cameras | F06-24
8,192 environments x 64 x 64 = 33.6 million pixels per step | F06-103
Isaac Lab 3.0 benchmark, Cartpole, 8,192 environments, one RTX PRO 6000 Blackwell Server Edition, no camera: 1,023,698 training FPS at 0.93 GB (vendor claim) | F06-47
Same with one camera per environment: 152,124 FPS at 57.3 GB; factor 6.7 in throughput and 62 in memory (vendor claim; ratios derived) | F06-48
The benchmark card has 96 GB | F06-58
The Cartpole rows' camera size is not established (label says 64, task config says 96 x 96, export records neither) | F06-104
Kuka-Allegro lift, one fixed 64 x 64 camera per environment: 220,831 to 115,889 FPS on Newton at 13.6 GB, a factor of 1.9 (vendor claim) | F06-49, F06-103
Newton rows render plain colour, RTX rows a shaded data type | F06-103
Memory ladder per environment: 57 KB to 468 KB state only; 1.7 MB to 7.8 MB with a small camera; about 2 GB for a full-fidelity camera (derived) | F06-102
Isaac Lab's highest-fidelity camera runs out of memory beyond 48 cameras on a 96 GB card (author reported) | F06-63
Playground paper time split for a Franka camera pick task on one RTX 4090: physics 24%, rendering 18%, policy inference 1%, policy update 57% (author reported) | F06-33
Three rendering paths by hardware: rasterisation, compute ray tracing, RTX (our reading) | F06-101
MuJoCo's built-in renderers are rasterisers that run on a GPU graphics pipeline or on the CPU | F06-61
Isaac Sim 6.2.0: "GPUs without RT Cores (A100, H100) are not supported."; tiers RTX 4080 16 GB minimum, RTX PRO 6000 Blackwell 48 GB ideal | F06-52
Isaac Lab 3.0: "Headless Newton simulation does not require RTX hardware"; "RTX rendering has its own GPU and driver requirements" | F06-51
MuJoCo Warp batch renderer: 8192 worlds, one 64x64 camera each, about 1.3 million frames per second on an RTX 6000 Ada, 44.4 GB (vendor claim; frames per second derived) | F06-24
Isaac Lab's Warp renderer is direct lighting only, for throughput and memory over fidelity | F06-50
Tiled rendering: one tile per environment in one frame buffer, output a tensor (environments, height, width, channels) | F06-64
MuJoCo Warp falls back to the Warp path when the RTX back end is unavailable; no vendor sentence naming A100, H100 or B200 as supported was located | F06-62
AWS post of 9 June 2026, written against Isaac Sim 5.1: RTX renderer needs RT cores; G5, G6, G6e, G7e compatible; P4d, P4de, P5, P5e, P5en, P6-B200, P6-B300, P6e-GB200 not | F06-60
G7 generally available 18 June 2026, 32 GB per GPU, "4th Gen RT Cores"; adding it to the list is our reading | F08-52, F08-43, F08-58
G7e generally available 20 January 2026, RTX PRO 6000 Blackwell Server Edition with 96 GB per GPU | F08-53
Nothing newer than G7 and G7e in the G families on the EC2 specification page | F08-51
RTX camera rendering belongs on G families only (our reading) | F08-85, F06-60
EC2 docs print usable GiB: 48 GB shows as 44 GiB, 24 GB as 22 GiB | F08-45
RT cores per card: A10 72, 24 GB; L4 third-generation, no count, 24 GB; L40S 142, 48 GB; RTX PRO 6000 Blackwell Server Edition 188, 96 GB | F06-58
Isaac Sim 6.2.0 on aarch64 supports only the DGX Spark; no Graviton path (our reading) | F06-53
