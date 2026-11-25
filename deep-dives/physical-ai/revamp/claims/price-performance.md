# Claims: section 23, Price-Performance and Latency

claim | register ID
--- | ---
A machine five times faster is the better buy only if it costs less than five times as much or (edge) draws less than five times the watts; the five counts only for one unit of work from one model and software release; no price or power reading under load collected, placeholders hold the verdicts | F08-82, F08-83, F08-81, F08-59 (method, logic in view)
None of our runs recorded power under load; no dated price was collected | F08-83, F08-59
390 inferences per second for the policy stand-in on one Cortex-A78AE core of a Jetson Orin Nano Super, single run | F08-62
1,404 and 1,968 inferences per second on the DGX Spark Cortex-A725 and Cortex-X925 cores, single run | F08-62
1,968 / 390 = 5.0 is a per-core speed ratio (our arithmetic) | F08-62, Derived
The stand-in keeps one core busy (one core, one thread), so each machine's rate for it is that core's; the Spark is the better buy for it only if the whole Spark costs less than 5.0 times as much or draws less than 5.0 times the Jetson board's watts (arithmetic in view) | F08-73 (item 2), F08-83, F08-82, Derived
A job that loads every core or the GPU needs its own ratio with those parts loaded; single-core ratios do not predict whole-machine ones (section 22) | F08-73 (item 2), F08-66 use-in-dive line (one core against whole-machine figures)
Each inference reads all 6 x 1024 x 1024 x 4 bytes = 25.2 MB of weights, more than any cache on either machine; 390 x 25.2 MB = 9.8 GB/s against the 11.71 GB/s the Jetson core reached in the triad test; 62.3% of cycles stalled on memory; memory bandwidth is the part the job exhausts first on the Jetson | F08-63, F08-62
At 1,968 inferences per second the X925's derived demand is 49.5 GB/s, above its own triad figure of 44.38 GB/s, so one triad run is not that core's ceiling (logic from F08-63's premises, as F08-63 argues for the Mem read kernel; section 22 reads it the same way); 22.4% of cycles stalled; memory does not hold the X925 back the same way | F08-63 (derived, with its caveat), F08-66, F08-62
The two cores' triad figures differ 3.8 times; since the X925's figure is not its ceiling, 3.8 is a floor on what memory allows; the rest of the 5.0 may come from memory the test did not reach, the core or software, and with the NumPy release unrecorded nothing splits them; measure the Spark with the software you will run | F08-66, F08-63, F08-62, Derived (logic in view)
The NumPy version of the policy stand-in's runs is not recorded, so the policy pair leaves the software check open (opening and like-for-like block) | F08-62 (report and raw results read: no NumPy or BLAS version recorded)
Physics step stand-in: 14,507 (Jetson A78AE), 28,662 (Spark A725), 57,240 (Spark X925) steps per second, single run | F08-61
57,240 / 28,662 = 2.0 inside the Spark, same MuJoCo 4.0.1 (our arithmetic); on the Spark this physics step goes to its ten X925 cores before its ten A725 cores; the physics pair inside the Spark is the one pair that passes every check (figure caption) | F08-61, F08-73, F07-47, Derived
57,240 / 14,507 = 3.9 mixes a processor with a MuJoCo release; a run of both machines on one release would separate them (logic in view) | F08-61, F08-73, Derived
Camera render stand-in at 640x480: 209, 937 and 1,191 frames per second, single run | F08-64
The render run went through EGL (hardware-accelerated headless rendering); how much of each frame the GPU drew was not established, so the render panel ranks neither CPU cores nor GPUs | F08-64, F08-73
The stand-ins are not the arm's work: a humanoid where the arm is an SO-101, and a policy stand-in on a CPU core where real policies run convolutions and attention on a GPU | F08-73, F08-62 (use-in-dive line)
NVIDIA reports GR00T N1.7 on a Jetson Orin (module not named) at a median 357.9 ms in PyTorch eager and 149.0 ms with TensorRT; 357.9 / 149.0 = 2.4 (our arithmetic); the TensorRT build on AGX Thor is 76.8 ms, 1.94 times faster than the Orin, less than the runtime gained; so a change of runtime can move the call time further than a change of machine (h2 description) | F07-1, F07-5, Derived
The table gives a median per runtime (PyTorch eager, torch.compile, TensorRT), with the Jetson Orin in MAXN power mode; a call time compares only with the same model, runtime and mode | F07-1, F07-3 (logic in view)
GPU utilisation in nvidia-smi is the share of time at least one kernel was executing; one small kernel back to back reads 100% | F08-30
One unit of work per workload, fifteen workloads (twelve batches, three held against a clock); rows 13 to 15 come from published figures; GPU-hours per run is a cost per unit | F08-81 (batch or clock grouping is our reading)
Three workloads answer to a clock: encode keeps real time (1.0 per camera), the dataloader keeps pace with the GPU, the policy meets a deadline counted in control periods | F08-81, F08-84
Control period is 33.3 ms at 30 Hz | F08-84
Cloud formula: units per currency unit = units per second x 3,600 / price per hour, with AWS's published price on a stated date for one Region and purchase option | F08-82
Divide by the whole instance price; on Spot count only units that finished | F08-82
Price per part: price a workload on the instance built around the part it exhausts first, since every other part is paid for and left idle | F08-85
AV1 is LeRobot's default recording codec | F05-43, section 9
P5 is an EC2 training instance with H100 GPUs, which have no AV1 decode, so AV1 video is decoded on the CPU (12 physical cores per GPU on the eight-GPU size) or re-encoded; the price per sample includes that CPU work | F08-85, F08-58, F08-57
Video decoded in software and CPU physics fill CPU cores; CPU instances or a GPU instance with many cores per GPU | F08-85
Eight-GPU sizes of G5, G6, G6e, G7e, P5, P5e, P5en, P6-B200, P6-B300: 24 vCPUs per GPU at 2 threads per core, 12 physical cores; g7.48xlarge: 24 vCPUs per GPU at 1 thread per core, 24 physical cores, twice the cores per GPU | F08-57 (the list replaces the "every other eight-GPU x86 size" wording of F08-58's wave 2 line, which P4d and G4dn contradict)
G7's GPU, the RTX PRO 4500, has three hardware decoders that handle AV1; the B200 GPUs of P6-B200 decode AV1; section 10 lists the others | F08-58, F08-44, F05-48
Which of CPU decode on a P5, a re-encode, or an AV1-decoding GPU costs least per sample is decided by two measured rates (frames one CPU core decodes per second; frames a training run consumes per second, which the P5's cores must keep pace with) and dated prices in the cloud formula | F08-85, F08-82, F08-81 (logic in view)
Ray-traced camera simulation can be priced only on G families; P-family GPUs lack RT cores | F08-85, F08-58
Edge formula: units per joule = units per second / watts | F08-83
Purchase price per unit of rate = price / units per second (lower is better, the other way up from units per joule) | F08-83
Units per joule times what a battery holds is the work one charge buys | F08-83, arithmetic
Watts are the whole board's (Jetson VDD_IN covers the board; Spark nvidia-smi is GPU only); dividing by one part's watts raises the result | F08-83 (machine cards), F08-40, arithmetic
The Spark ran MuJoCo 4.0.1 and the Jetson MuJoCo 3.17.0 | F08-73
No EC2 instance measured yet | F08-73
NVIDIA states 7 W to 25 W for the Jetson Orin Nano Super Developer Kit | F07-36
Our Jetson ran in MAXN_SUPER power mode; no reading shows the board stayed within 25 W | F08-83 (Jetson card), F07-36
If the board drew no more than 25 W, the policy stand-in did at least 390 / 25 = 15.6 inferences per joule, and more, because one core of six was busy and the GPU idle | F08-83, F07-36, Derived
On this one-core job the Spark is ahead per joule only below 5.0 times the Jetson board's watts; a board under load draws at least its idle draw (about 4.8 W for this Jetson), so the line sits between 5.0 x 4.8 = 24 W and 5.0 x 25 = 125 W; the Spark's GPU alone idles at 10 W before its CPU cores; the chip has a 140 W power budget and the machine a 240 W supply, so the specifications allow either side and only readings under load on both machines place it | F07-47, F07-36, F08-83, Derived (load at least idle: logic in view)
Our single idle readings: Jetson board about 4.8 W (tegrastats VDD_IN), Spark GPU 10 W (nvidia-smi), which leaves out the CPU cores; no whole-system reading of the Spark is in our records | F08-83
tegrastats is the Jetson's built-in monitor and reports power per rail (VDD_*); VDD_IN is the whole board | F08-40, F08-83
Half-chunk rule: the actions for the time a call took are dropped when its chunk lands; what the chunk lasts minus one call must cover the next call, so a call may take up to half the chunk; asynchronous calls mean the arm need not stop to wait while a call runs | F07-22 (section 17 sets it out in symbols)
When a call outlasts what is left of the chunk the arm runs out of actions; a faster call, a longer supported chunk or a different action rate makes more room | F07-22
In LeRobot's local real-time chunking mode (policy in a background thread of the rollout process) a supported robot holds its last applied target for up to 1 second by default, then the run faults | F07-20
GR00T N1.7 benchmark returns 40 actions; played on the arm at 30 Hz, 40 / 30 = 1.33 s; half is 20 control periods, 667 ms; NVIDIA's TensorRT median on a Jetson Orin (module not named) is 149.0 ms; 667 / 149.0 = 4.5 (our arithmetic); the headroom holds for NVIDIA's setup (two 256x256 camera inputs, unnamed Orin in MAXN) | F07-2, F07-3, F07-5, Derived
Mean latency of the stand-in: 1 / 390 s = 2.56 ms per call on the Jetson core (our arithmetic); neither mean nor median shows a rare slow call for what it is | F08-84, Derived
Held against the deadline, a percentile sets the miss rate: hold the p99 against the room when one late call in a hundred is tolerable, the worst call when none is | F08-84, F07-22 (logic in view)
NVIDIA's GR00T N1.7 device table reports the median of 60 timed calls | F07-3
Sixty calls hold on average 60 x 0.01 = 0.6 calls beyond the p99; the chance of none is 0.99 to the power 60 = 0.55 (our arithmetic) | F07-3, Derived
No p99 exists in our stand-in or in NVIDIA's table | F08-84
Record the power mode beside a Jetson figure (NVIDIA records MAXN; our card records MAXN_SUPER) | F07-3, F08-83
Worked examples (the 99-to-1 slow call; a call every 20 periods, 1.5 calls a second, 67 s; an hour at 1.5 calls a second, 5,400 calls, 54 beyond the p99) | none: invented numbers, wrapped in Toy or marked as an illustration
