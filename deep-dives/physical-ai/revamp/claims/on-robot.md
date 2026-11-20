# Claims: section 17, Running on the Robot

claim | register ID

One GR00T N1.7 policy call with TensorRT takes 149.0 ms on Jetson Orin, which is 4.5 control periods at 30 Hz (149.0 / 33.3 = 4.47); 357.9 ms in plain PyTorch (vendor claim) | F07-5
The same table: 116.6 ms on DGX Spark and 76.8 ms on AGX Thor (vendor claim) | F07-1
Jetson Orin Nano Super Developer Kit: 8 GB of memory shared by CPU and GPU, 7 W to 25 W (vendor specification) | F07-36
Jetson AGX Thor Developer Kit carries the T5000 module: 128 GB, 40 W to 130 W (vendor specification) | F07-39
DGX Spark: 128 GB unified memory, 240 W power supply, 140 W chip power budget (vendor specification) | F07-47
JetPack 7.2.2 is built on Ubuntu 24.04 with Linux kernel 6.8 and covers the Orin and Thor families | F07-44
DGX Spark needs a dedicated dependency stack; the GR00T guide pins an older TensorRT there | F07-9
NVIDIA's table says "Jetson Orin" without naming the module; no first-party policy latency on a Jetson Orin Nano was located in this research | F07-5, F07-117
Table conditions: nvidia/GR00T-N1.7-LIBERO checkpoint, batch size 1, action horizon 40, four denoising steps, two 256x256 cameras; preprocessing and action decoding included | F07-2
Each figure is the median of 60 timed calls on fixed inputs, Jetsons in MAXN mode; the table does "not measure closed-loop task success" | F07-3
No first-party figure located for camera exposure, USB transfer or servo bus write on an SO-101; a 30 fps frame can be up to 33.3 ms old | F07-118
Measured off-board chain: desktop robot computer 97.43 + 6.89 + 1.44 + 3.00 = 108.76 ms; Intel NUC 96.89 + 21.20 + 11.22 + 9.67 = 138.98 ms; 50 calls, wired Ethernet (author reported) | F07-68
Synchronous inference "introduces visible pauses between chunks"; asynchronous inference starts early, during execution | F07-62
Real-time chunking generates the next chunk while the current one plays and guides the new chunk to align with the part already executed | F07-12
The actions that will have been played before the new chunk arrives are frozen and the rest is generated to continue from them | F07-65
LeRobot v0.7.0 remote inference: checkpoint on a policy server, cameras and motors on the robot computer, "the remote client does not load weights", transport Zenoh | F07-25
Effective refill is max(refill_seconds, recent maximum turnaround + 1 / fps); default refill_seconds 0.5; at 30 Hz and 149 ms the floor is 0.182 s | F07-26
"If inference takes 1 second out of a 1.67-second prediction, only about 0.67 seconds remain. Another 1-second request cannot fit; no refill value fixes that."; turnaround must stay under half the chunk duration (our arithmetic) | F07-22
RTC on real robots: pi0.5, 50-action chunks at 50 Hz, up to +200 ms injected latency (d about 16, 320 ms), 480 episodes, 28 hours, "no degradation" (author reported) | F07-69
TensorRT is NVIDIA's inference compiler and runtime; it writes an engine from a model graph, usually ONNX; newest version 11.5.0 | F07-76
"By default, TensorRT engines are only compatible with the type of device where they were built."; hardware compatibility mode is not supported on JetPack and is added in TensorRT 11.5.0 on Arm server-class Linux, DGX Spark included | F07-77
The engine records TensorRT version and compute capability and "will fail to deserialize" on a mismatch; AGX Orin 8.7, AGX Thor 11.0, DGX Spark 12.1 | F07-79
Engines are built on the target device; a build takes about 2 to 5 minutes | F07-8
NVFP4 is "a 4-bit floating-point format with per-block scaling", native on Thor's GPU (vendor claim) | F07-58
On AGX Thor, mixed NVFP4 with the optimised execution profile cuts the call from 76.8 ms to 35.6 ms, a factor of 2.16; BF16 is the unquantised default; no other device has a quantised figure (vendor claim) | F07-4
One task-success check: H100, one LIBERO task, 20 episodes, PyTorch 20 of 20, TensorRT 19 of 20, unquantised BF16; no figure for NVFP4 or any Jetson (vendor claim) | F07-10
NVIDIA's tutorial states task success is unchanged under quantisation and prints no rate or episode count | F07-59
GR00T 2 Turbo: 124 ms per action chunk on Jetson Thor at 120 W; whitepaper only, no released code or weights (vendor claim) | F07-119
AWS IoT Greengrass is "an open source Internet of Things (IoT) edge runtime and cloud service ..."; two halves, device software and cloud service | F07-120
Two nucleus implementations, Java and C (nucleus lite) | F07-133
Java nucleus v2.18.4 needs a Java runtime, at least 256 MB disk and 96 MB RAM | F07-84
Nucleus lite cannot be driven by the Greengrass CLI on the device (feature matrix) | F07-135
Nucleus lite measured by AWS at 14.6 MB idle and 15.8 MB with six small components, on a Raspberry Pi 4 (vendor claim) | F07-138
For the Java nucleus AWS lists Armv8 (AArch64) and no Linux distribution | F07-140
Nucleus lite packages name Ubuntu 24.04; no Jetson is named | F07-142
A component is a recipe (JSON or YAML) plus artifacts | F07-122
A recipe defines "details, dependencies, artifacts, and lifecycles" | F07-151
AWS's container recipe: Docker application manager and token exchange service as dependencies, a docker: artifact URI, a plain docker run in the lifecycle (snippet copied) | F07-153
An untagged image floats to the latest version at deploy time; Docker must be installed and running first | F07-154
None of the four recipes on AWS's "Run a Docker container" page passes a GPU or device flag; camera and servo device flags are our reading | F07-156
Two AWS sample repositories start a Jetson container with docker run --runtime nvidia; neither was run; neither states the flags for a DGX Spark (Tier 2 samples) | F07-157
NVIDIA's own GR00T container command for Jetson and DGX Spark passes --runtime nvidia --gpus all | F07-11
Token exchange service: local server; X.509 certificate traded for temporary credentials of an IAM role, kept in memory, expiring after an hour by default; reached through an environment variable | F07-148
A container needs --network=host and two environment variables to reach TES; AWS notes host networking is less secure | F07-150
No first-party 2025 or 2026 sample running a GPU policy container on a Jetson under Greengrass was located in this research | F07-199
