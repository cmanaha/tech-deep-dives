# Claims: section 17, Running on the Robot

claim | register ID

## Opening

NVIDIA reports a median of 149.0 ms for one GR00T N1.7 call on "Jetson Orin" with TensorRT, and 357.9 ms in plain PyTorch on the same device (vendor claim) | F07-5
149.0 / 33.3 = 4.5 control periods at 30 Hz (our arithmetic) | F07-5
NVIDIA's benchmark uses an action horizon of 40 actions per call | F07-2
A 40-action chunk at 30 Hz lasts 40 / 30 = 1.33 s; the PyTorch call is 357.9 / 33.3 = 10.7 ticks (our arithmetic) | F07-2, F07-5
At the illustrative 0.25 m/s of section 3 the arm travels 37 mm in 149.0 ms and 89 mm in 357.9 ms (our arithmetic: speed times delay) | F01-83, F07-5

## Budget from camera to motor

NVIDIA's model card times the same model with one camera and TensorRT on the action head only, and prints 216.5 ms for a Jetson Orin; slower, with the backbone left uncompiled on an older TensorRT (TRT 10.3) | F02-40
The delay from camera to servo is four waits (section 3); a 30 fps frame can be up to 33.3 ms old | F07-118
NVIDIA's call time includes preprocessing and action decoding and excludes any network hop | F07-2
Table conditions: nvidia/GR00T-N1.7-LIBERO checkpoint, batch size 1, four denoising steps, two 256x256 cameras | F07-2
Each figure is the median of 60 timed calls on fixed inputs, Jetsons in maximum power mode; the table does "not measure closed-loop task success" | F07-3
NVIDIA's model card prints other figures for the same model (section 5 sets them side by side) | F07-3
LeRobot sample cadence report, 30 Hz, hardware not named: inference mean 5.18 ms, max 40.00 ms; recording mean 0.67 ms, max 620.00 ms (the blocking episode save) | F07-23
Worst call is a stall of about 35 ms on top of the typical call (our arithmetic: 40.00 - 5.18) | F07-23
Figure: compiled medians 149.0 ms Orin, 116.6 ms DGX Spark, 76.8 ms AGX Thor (vendor claim) | F07-1, F07-5
Measured off-board chain, 50 calls, wired Ethernet: desktop robot computer 97.43 + 6.89 + 1.44 + 3.00 = 108.76 ms; Intel NUC 96.89 + 21.20 + 11.22 + 9.67 = 138.98 ms (author reported) | F07-68
Model time varied by about 0.2 ms and network time by 2 to 3 ms across the 50 calls, so the network brings the jitter (author reported) | F07-68
LeRobot's guides give no timing for camera exposure, USB transfer or servo bus write on an SO-101; LeRobot's cadence report times camera reads and the motor write as its observe and send lines | F07-118, F07-23

## Chunks, synchronous and asynchronous

LeRobot's tuning rule: what remains after trimming must cover the next call | F07-22
A worst call up to about four times the 4.5-tick median still fits under about 20 ticks (our arithmetic) | F07-2, F07-5, F07-22
Local RTC runs the policy in a background thread with no network transport | F01-40, F07-20
The 0.5 s default holds until the slowest round trip passes 0.5 - 0.033 = 0.467 s, more than three times the 138.98 ms measured chain with a small on-robot computer (our arithmetic: 0.467 / 0.139 = 3.4) | F07-26, F07-68
Remote join modes: aligned (default) drops passed steps and replaces only the future, reducing backward bumps (so passed steps are not replayed, by construction); append, the baseline, plays out the old slice and starts the new chunk after it, so the next chunk can begin from an older observation; RTC when the checkpoint supports it, inference conditioning on the remaining trajectory | F07-27
LeRobot advises trying JPEG at quality 90, then comparing turnaround and task quality | F07-28
Two raw 640x480 RGB frames are 1,843,200 bytes, about 1.8 MB, about 15 ms of transfer on a gigabit link (our arithmetic: 14.7 Mbit at 1 Gbit/s, gigabit assumed) | F07-28
Five policy types (ACT, SmolVLA, XVLA, EVO1, LaWAM) have run on real robots through the remote path | F07-29
Synchronous inference is LeRobot's default and "the robot stops moving every time the policy computes its next chunk of actions" | F01-87
Synchronous pauses change the robot's dynamics, a shift between training and run time; asynchronous inference starts early, during execution | F07-62
Synchronous idle on the Orin: 149.0 / (1,333 + 149.0) = 10%, a stop every 1.5 s; 21% with the PyTorch call (our arithmetic) | F07-2, F07-5
Half-chunk rule H dt - L >= L, so L <= H dt / 2 (our arithmetic from LeRobot's tuning rule) | F07-22
"If inference takes 1 second out of a 1.67-second prediction, only about 0.67 seconds remain. Another 1-second request cannot fit; no refill value fixes that."; remedies: a shorter call, a longer chunk or a different action rate | F07-22
For a 40-action chunk the call may take about 20 ticks (our arithmetic) | F07-2, F07-22
RTC paper: d = floor(delta / dt), the inference delay in controller steps; d is 4 for the 149.0 ms call at 30 Hz (our arithmetic) | F07-63, F07-5
RTC paper's real-time constraint d <= s <= H - d, with s the actions played before the hand-over; d <= H - s guarantees "that an action is always available when it is needed"; for H = 40 and d = 4, s from 4 to 36 (our arithmetic) | F07-63, F07-65, F07-2
LeRobot v0.7.0 RTC computes the next chunk in a background thread on the robot computer | F01-40
Remote inference: checkpoint on a policy server, cameras, motors and recording on the robot computer, "the remote client does not load weights", transport Zenoh | F07-25
Effective refill = max(refill_seconds, recent maximum turnaround + 1 / fps); default refill_seconds 0.5 s; turnaround spans encoding, network, queueing, inference and decoding | F07-26
At 30 Hz and 149 ms the floor is 0.149 + 0.033 = 0.182 s, so the 0.5 s default applies: the client asks with 15 actions left (our arithmetic) | F07-26
Animation: illustrative timing, 50-action chunk at 30 Hz, calls of 5 and 30 ticks | F07-12, F07-22, F07-26, F07-65
Camera frames travel as raw RGB by default (about 1.8 MB for two 640x480 frames); a congested link drops observations rather than blocking motor commands | F07-28
Remote path validated on a lab network; router, private hosted GPU or Hugging Face Space "has not been validated yet"; "a working transport alone does not establish a usable motion budget" | F07-29

## Real-time chunking

Freezing only the first d actions lets the new chunk still switch strategy when d is small; the last s have no counterpart in the old chunk (the new chunk takes over s actions into the old one) | F07-66, F07-65
Guidance needs the gradient of the model's output with respect to its input, a backward pass ("RTC slows down inference due to backpropagating through each denoising step") | F07-67
execution_horizon spans the frozen and guided zones in the figure, H - s in the paper's symbols (our mapping of LeRobot's definition); the paper gives the name execution horizon to s | F07-15, F07-65
max_guidance_weight 10.0 is given for 10-step flow matching in SmolVLA, pi0 and pi0.5 | F07-15
Paper's figure: old chunk goes over an obstacle, new chunk under it; hand-over "may be arbitrarily discontinuous and out-of-distribution", worse as delay grows | F07-64
RTC treats the new chunk as inpainting: first d actions frozen, overlapping actions guided with weight decaying from 1 to 0, last s free; "actions further in the future should be treated with more uncertainty" | F07-65, F07-66
Figure: the paper's example layout, d = 4, s = 5; the shape of the decay drawn is illustrative | F07-65, F07-66
Guidance needs a backward pass at each denoising step | F07-13
pi0.5 on an RTX 4090: each denoising step 2.5 times slower, whole call 76 ms to 97 ms (28%); backbone 62 ms of the 76 unchanged (author reported) | F07-67
inference_delay is the latency in control steps, passed per call because it varies at run time | F07-15
4.47 ticks for the 149.0 ms median; the paper's definition d = floor(L / dt), applied here by us, gives 4; rounding up to 5 freezes one more action, safer when calls run longer than the median (our arithmetic and reasoning) | F07-5, F07-15, F07-63
execution_horizon default 10, typical 8 to 12, smoother when higher, less reactive | F07-14, F07-15
max_guidance_weight default 10.0, given as the value for 10-step flow matching | F07-14, F07-15
prefix_attention_schedule: code default LINEAR with a to-do comment; documentation recommends EXP for getting started | F07-14, F07-16
Training-time RTC: random delay per training example, clean prefix, no guidance or backward pass at run time | F07-70
Trained with delays 0 to 10, "which supports a maximum latency of 200ms on a 50Hz robot"; beat guided RTC in simulation at delays of 2 or more (author reported) | F07-71, F07-72
LeRobot trained mode needs a pi0.5 checkpoint with rtc_training_max_delay above 0 and checks rtc_training_max_delay <= execution_horizon <= prediction_steps - rtc_training_max_delay; guided mode works with ordinary checkpoints | F07-17, F07-18
10 ticks of trained delay covers 333 ms at 30 Hz (our arithmetic) | F07-71
Real robots (RTC "no degradation" as delay was added, synchronous "degrades linearly" with it): pi0.5, 50-action chunks, 50 Hz bimanual, 97 ms RTC call, LAN adds 10 to 20 ms, starting delay about 6 ticks; +100 ms and +200 ms injected (about 11 and 16 ticks; 16 x 20 ms = 320 ms, our arithmetic), 480 episodes, 28 hours of robot time; RTC "no degradation", synchronous "degrades linearly", temporal ensembling could not run at either added delay, oscillations tripped protective stops (author reported) | F07-69

## Compiling and quantising

On the Orin compiling saves 357.9 - 149.0 = 208.9 ms, the largest saving in the table, quantised Thor included (our arithmetic) | F07-1, F07-4
pi0.5 cosine similarity about 0.9995 for FP8 alone and 0.9946 with NVFP4 layers; 0.9946 is below GR00T's 0.999 verify threshold (our comparison) | F07-52, F07-8
Hardware compatibility mode is the escape from the one-engine-per-device-type rule; added in TensorRT 11.5.0 on Arm server-class Linux, not on JetPack | F07-76, F07-77
TensorRT builds an engine from a model graph, usually ONNX, timing implementations on the build machine | F07-76
GR00T N1.7 has seven engines; NVIDIA recommends the full pipeline because the backbone "dominates inference time" | F07-7
Compiled against PyTorch: Orin 357.9 to 149.0 ms, DGX Spark 200.8 to 116.6 ms, AGX Thor 106.8 to 76.8 ms (vendor claim) | F07-1
Factors 2.4, 1.7 and 1.4 (our arithmetic) | F07-1
BF16 is the default; TensorRT 11.5 documents FP8 (E4M3: sign bit, four exponent, three mantissa) and FP4 (E2M1: sign bit, two exponent, one mantissa) | F07-4, F07-81
NVFP4 is FP4 with per-block scaling, native on Thor's Blackwell GPU (vendor claim) | F07-58
FP16 overflows in pi0.5's attention layers, an error that "compounds over the denoising loop" | F07-53
GR00T N1.7's vision encoder stays at FP32 "for accuracy"; under NVFP4 accuracy-sensitive layers stay at FP8 | F07-7, F07-57, F07-58
Calibration runs 10 samples of real robot data | F07-57
AGX Thor: 76.8 ms to 35.6 ms with mixed NVFP4 and the optimised execution profile (vendor claim); factor 2.16 (our arithmetic) | F07-4
Thor tutorial, one camera (the README figure uses two): quantisation shrank the backbone 27 to 13.6 ms, a precision-independent rewrite shrank the action head 45 to 17.2 ms (vendor claim); savings 27.8 ms against 13.4 ms (our arithmetic) | F07-57, F07-2
pi0.5 on Thor, action horizon 10: about 132 ms PyTorch BF16, about 54 ms FP8 TensorRT, about 49 ms FP8 plus NVFP4 (vendor claim); 2.4 times (our arithmetic) | F07-51
NVIDIA's table has no quantised figure for the Orin | F07-4
H100, one LIBERO task (LIBERO: a suite of simulated manipulation tasks), 20 episodes: PyTorch 20 of 20 (19 of 20 is 95%, our arithmetic), unquantised BF16 TensorRT 19 of 20; no figure for NVFP4 or any Jetson (vendor claim) | F07-10
Thor tutorial states task success is unchanged with no rate or episode count | F07-59
pi0.5 tutorial checks cosine similarity 0.9946 against PyTorch | F07-52
TensorRT ties an engine to the GPU type that built it | F07-77
An engine records TensorRT version and compute capability and "will fail to deserialize" on a mismatch; AGX Orin 8.7, AGX Thor 11.0, DGX Spark 12.1 | F07-79
Engines built on the device, about 2 to 5 minutes; verify step expects cosine similarity 0.999 or more | F07-8
NVIDIA's GR00T guide pins an older TensorRT on the DGX Spark (10.16.1.11) with a separate dependency stack | F07-9

## Devices

Bandwidth floor: reading about 6 GB of weights once at 102 GB/s takes at least 6 / 102 = 59 ms (our arithmetic, assuming every weight is read once per call) | F07-36, F07-54
DGX Spark has the Thor's 128 GB at 273 GB/s and is still slower (vendor figures) | F07-6, F07-47, F07-39
GR00T's path on Orin uses JetPack 7.2; LeRobot's container JetPack 6.2 | F07-9, F07-34
Jetson Orin Nano Super Developer Kit: 8 GB shared at 102 GB/s, 7 W to 25 W (vendor specification) | F07-36
pi0.5 weights about 6 GB or more | F07-54
NVIDIA's table says "Jetson Orin" without naming the module (also stated in the opening); the SmolVLA paper and LeRobot's guides give no latency for SmolVLA or ACT on a Jetson Orin Nano | F07-5, F07-117
Only the Thor has a quantised figure in NVIDIA's table (35.6 ms); the Orin has only the compiled 149.0 ms | F07-4, F07-5
NVIDIA's Thor page claims 7.5 times the AGX Orin's performance (vendor claim) | F07-39
Thor bandwidth 273 / 204.8 = 1.33 times the AGX Orin 64GB's; measured ratios 1.94 to 2.08 sit far below the peak claim and above the bandwidth ratio (our arithmetic) | F07-39, F07-35, F07-73, F07-5
Third-party paper: GR00T N1.7 at 209.9 ms on AGX Orin and 101.1 ms on AGX Thor, with an older software stack and only the action head compiled; 2.08 times (our arithmetic) | F07-73, F07-74
NVIDIA's own table: 149.0 / 76.8 = 1.94 times (our arithmetic) | F07-5
DGX Spark 116.6 ms against Thor 76.8 ms compiled (vendor claim) | F07-6
DGX Spark and Thor: 128 GB at 273 GB/s | F07-47, F07-39
Network cost in the measured chain 6.89 ms to 21.20 ms (author reported) | F07-68
Jetson AGX Orin 64GB: 64 GB at 204.8 GB/s, 15 W to 60 W (vendor specification) | F07-35
Jetson AGX Thor Developer Kit (T5000): 128 GB at 273 GB/s, 40 W to 130 W (vendor specification) | F07-39
DGX Spark: 240 W power supply, 140 W chip budget (vendor specification) | F07-47
JetPack 7.2.2: Ubuntu 24.04, both Jetson families | F07-44
NVIDIA's GR00T guide no longer supports JetPack 6 | F07-9
LeRobot's Jetson Dockerfile targets JetPack 6.2 and is community-maintained | F07-34
MIG on Thor with JetPack 7.2: two isolated instances, each with its own compute, cache and memory bandwidth, so a latency-sensitive policy and a best-effort model (one whose timing does not matter) do not slow each other | F07-46

## Greengrass

Nucleus footprints against 8 GB: about 1% (Java, documented minimum, a floor) and 0.2% (lite, measured on a Raspberry Pi 4) (our arithmetic), beside pi0.5's ~6 GB+ of weights | F07-84, F07-138, F07-36, F07-54
Device flag examples --device /dev/video0 and --device /dev/ttyACM0 (our reading, standard Docker, in none of the AWS pages read on 2026-11-20) | F07-156
Credential variables AWS_CONTAINER_CREDENTIALS_FULL_URI and AWS_CONTAINER_AUTHORIZATION_TOKEN passed with -e | F07-150
AWS IoT Greengrass is an open source edge runtime and cloud service, in two halves; the device half is the nucleus | F07-120, F07-133
A recipe copied from AWS's page gives the container no access to the GPU, camera or servo bus; a container policy is started by a docker run line in its recipe | F07-156, F07-153
Two nucleus implementations, Java and C (nucleus lite) | F07-133
Java nucleus v2.18.4 needs a Java runtime, at least 256 MB disk and 96 MB RAM | F07-84
Nucleus lite v2.7.0 gives up features, among them being driven by the Greengrass CLI on the device | F07-135
Nucleus lite v2.5.0 packages on a Raspberry Pi 4: 14.6 MB idle, 15.8 MB with six small components (vendor claim) | F07-138
Java nucleus: 64-bit Arm Linux, no distribution named; JetPack not named | F07-140
Nucleus lite packages name Ubuntu 24.04 (the release JetPack 7.2.2 is built on) and no Jetson | F07-142, F07-44
A component is a recipe (JSON or YAML) plus artifacts; a recipe defines "details, dependencies, artifacts, and lifecycles" | F07-122, F07-151
AWS's container recipe: Docker application manager and token exchange service as dependencies, image pulled from ECR, plain docker run (snippet copied) | F07-153
An untagged image pulls the latest at deploy time | F07-154
None of the four recipes on AWS's "Run a Docker container" page passes a GPU or device flag | F07-156
Two AWS sample repositories (Tier 2 sample code) pass --runtime nvidia on a Jetson; the samples give no flags for a DGX Spark | F07-157
NVIDIA's GR00T container command for Jetson and DGX Spark passes --runtime nvidia --gpus all | F07-11
Camera and servo bus need Docker device flags that no AWS page shows (our inference, marked "would") | F07-156
Figure: the parts as AWS's and NVIDIA's documents describe them (not run on a device; the placeholder covers the hook-up) | F07-44, F07-120, F07-122, F07-148, F07-153, F07-156
TES: local server; X.509 certificate traded for temporary IAM role credentials, held in memory, one hour by default | F07-148
A container needs --network=host and two environment variables; AWS notes host networking is less secure | F07-150
Placeholder (unchanged): our own Greengrass hook-up of the Jetson Orin Nano Super and DGX Spark | none (placeholder)

## Failure modes

Local RTC default budgets: observation age 5 s (1.25 m at the illustrative 0.25 m/s, our arithmetic), outstanding request 10 s, "starting values, not measured hardware guarantees" | F07-21
Queue dry: a supported robot holds its last target for action_starvation_grace_s (1 s by default), then faults; unsupported robots fault at once | F07-20
Failure table rows | F01-87, F07-62, F07-12, F07-64, F07-17, F07-20, F07-22, F07-69, F07-79, F07-8
Cadence report lines: infer, observe, pacing headroom; headroom near zero "means there is nothing left to absorb a slow tick" | F07-24
Compiled Orin median 4.5 ticks against the 20 that half a 40-tick chunk allows; room for a worst call about four times longer (our arithmetic) | F07-5, F07-2
Cadence report lines give mean, worst and share of work | F07-23

Opening: compiling the model, and on newer boards quantising it, shortens the call (149.0 ms is compiled, unquantised) | F07-5, F07-4
Floating-point bits split between exponent (range) and mantissa (precision): general definition, no figure | none (definition)
Each later action in a chunk is a tick older than the one before (our reasoning) | F07-2
LeRobot's trained-mode admission rule is the paper's d <= s <= H - d written in LeRobot's names (our arithmetic, with execution_horizon = H - s) | F07-18, F07-63
Opening scope: LeRobot v0.7.0 ships a wrapper for GR00T N1.7; its RTC settings are given for SmolVLA, pi0 and pi0.5; NVIDIA timed the 149.0 ms on its own TensorRT path; where the Orin figure meets LeRobot's rules it illustrates the arithmetic (ours) | F02-47, F07-15, F07-5
The optimised execution profile: cross-attention K/V caching, projection fusion and CUDA graphs (glosses of projection fusion and CUDA graphs are general definitions) | F07-4
pi0.5 tutorial action horizon 10 = chunks of 10 actions | F07-51
The benchmark table gives no reason for the DGX Spark being slower than the Thor; the one stated difference is software: a separate dependency stack with TensorRT pinned to 10.16.1.11 (set side by side, no cause claimed) | F07-6, F07-9
Animation: 50-action chunk is the size LeRobot's RTC guide uses as its example; half is 25 ticks, against 20 for NVIDIA's 40-action chunk (our arithmetic) | F07-12, F07-2
The token exchange service hands out temporary AWS credentials | F07-148
Compiling and rewriting the graph buy more than fewer bits: on Thor the graph rewrite saved 27.8 ms against 13.4 ms from the bits (our arithmetic) | F07-57
A container that calls AWS (to read weights from S3, for instance) needs a third kind of flag, for credentials | F07-148, F07-150
The compiled engine needs the GPU; AWS's documented container recipe gives the policy container no GPU, camera or servo bus | F07-76, F07-156
Adapted run line: docker run --rm --runtime nvidia --network host (the Physical AI Toolchain sample's aarch64 line), --device /dev/video0 and --device /dev/ttyACM0 (ours, in none of the AWS pages read on 2026-11-20), image placeholder from AWS's recipe; not run on a device | F07-157, F07-156, F07-153
The camera and the servo bus each need Docker's --device flag (our reading, standard Docker) | F07-156
Animation caption: a 30-tick call asked with 15 actions (0.5 s x 30) of playback left runs the queue dry (our arithmetic) | F07-26, F07-22
LeRobot's rollout prints a per-stage timing (the cadence report) | F07-23
prediction_steps is the chunk length in the trained-mode bound (our mapping, consistent with F07-63) | F07-18
Nucleus footprint sentence: 96 MB documented floor (Java) and 15.8 MB measured on a Raspberry Pi 4 (lite); neither taken beside a policy on a Jetson | F07-84, F07-138
