# Claims: section 21, Reading a Machine: PMU Cards

claim | register ID

The part a job fills first is read off hardware counters for the CPU core's halves and the GPU's units; each part has a counter that shows it (the dive's grouping) | F08-50
A slot is one chance per cycle to pass one micro-operation from the front end to the back end; each slot is sorted into one of four categories by two questions: was a micro-operation delivered, and did it retire | F08-2, F08-3
Back-end bound splits at level 2 into memory bound (stalled on loads or stores) and core bound (execution resources busy or dependent operations, for example chained long-latency floating-point operations) | F08-6
Memory bound is helped by faster memory: more bandwidth where loads stream, lower latency where each load waits for the one before (bandwidth and latency are two different limits); a faster core does not help it, and the reverse holds for core bound | F08-6, F08-41
Our measurement, single run, MuJoCo humanoid on a DGX Spark: X925 retiring 45.7%, bad speculation 5.6%, front end 12.2%, back end 36.5%, memory stall 0.4% of cycles, 4.37 instructions per cycle, 57,240 steps/s; A725 retiring 61.0% at 28,662 steps/s | F08-61
That the X925 physics step's evidence points at the execution units, so a faster core is the likelier help (our reading; the memory figure is a whole-cycle count from the second execution, so it points without proving), and only a level-2 count would rule out faster memory; whether a wider core would help is left open, because core bound covers both busy units and dependent operations and the run counted level 1 only | F08-61, F08-60, F08-6, F08-73, F08-24
The memory-stall figure is the event stall_backend_mem, counted in the second execution with the detail events | F08-60
nvidia-smi GPU utilisation is the percent of time one or more kernels was executing; one small kernel back to back reads 100% | F08-30
nvidia-smi reports encoder and decoder utilisation separately | F08-31
Total slots = pipeline width x core clock cycles | F08-8
A slot stands for the hardware resources needed to process one micro-operation (Intel's uOp) | F08-2
Arm counts slots at the rename unit, the stage that passes micro-operations from the front end to the back end (it partitions the two); the slots per cycle are the core's execution bandwidth for top-down accounting | F08-14, F08-15
A cycle-based stall count is coarser than a slot split: on the illustrative 4-slot core, a cycle that moved 1 of 4 slots counts as not stalled (the register's example is 2 of 8) | F08-29
The front end predicts the next address, fetches and decodes instructions into micro-operations | F08-4
The back end executes micro-operations out of order and retires them in program order | F08-5
Top-down analysis comes from a 2014 Intel paper (Yasin, ISPASS 2014), cited in the opening where the method is named | F08-1
Retiring at 100% would mean the full width was reached; a high value does not prove there is nothing left to gain | F08-7
Instruction-cache misses are categorised under front-end bound | F08-4
Arm event definitions: CPU_CYCLES, STALL_SLOT (sum of STALL_SLOT_FRONTEND and STALL_SLOT_BACKEND), OP_SPEC (micro-operations dispatched), OP_RETIRED | F08-15
The generic Arm level-1 formula that Linux perf v7.3 ships (four expressions, no correction term) | F08-20
The four categories add to 100% by construction of the formula; the sum is not a validation | F08-69
Counters say, before purchase, whether a faster core, faster memory or different code would help; the level-1 percentages and the level-2 split beneath them carry the decision (our reading of the parts and their counters) | F08-50, F08-6, F08-24
Top-down began in a 2014 Intel paper; Intel, AMD and Arm all sort slots into the same four categories | F08-1, F08-8, F08-11, F08-14, F08-16
Opening: the X925 physics step's back end left 36.5% of slots empty, the largest of the three losses, with 0.4% of cycles in memory stall | F08-61
Each vendor publishes width in machine-readable metric files that also define the formulas: Intel's TMA metrics file, Arm's per-core files in the Telemetry Solution, AMD's pipeline files in Linux perf | F08-8, F08-13, F08-11
Intel's VTune cookbook figure of four slots is wrong for Intel cores from Ice Lake on (5, 6, 8 in Intel's file) | F08-2, F08-8
A known-answer kernel is a test: the DRAM pointer chase is 97.6% to 99.0% back-end bound on the three core types, X925, A725 and A78AE (single runs) | F08-67, F08-69
From Ice Lake, Intel cores expose a fixed SLOTS counter and a metrics register holding the four ratios, so top-down needs no general-purpose counter | F08-10
AMD Zen 4 has a fifth bucket for slots lost to the sibling hardware thread (smt_contention) | F08-11
Raw counters of the X925 physics-step row (cycles, stall slots, dispatched and retired micro-operations) and the recomputed shares | F08-69, F08-70
(STALL_SLOT + OP_SPEC) / CPU_CYCLES returns the width: 10.000 on the X925, 5.000 on the A725, 6.000 on the A78AE (derived; the Jetson kernel reports 0) | F08-68, F08-15
Intel pipeline width: 4 from Sandy Bridge, 5 from Ice Lake, 6 from Alder Lake and Sapphire Rapids, 8 from Lunar Lake and Arrow Lake | F08-8
AMD: 6 dispatch slots per cycle on Zen 4, 8 on Zen 5; the Zen 6 file also says 8 | F08-11, F08-12
Arm slots per cycle: Neoverse N1 5, V1 8, V2 8, V3 10, Cortex-X925 10, Cortex-A725 5; no file for the Cortex-A78AE | F08-16
The Neoverse N1 file has no slot-stall events; its top-down method is cycle accounting (wave 4 note under F08-16) | F08-16
Arm's per-core files live in the Telemetry Solution repository, release 2026.09 | F08-13
Width comparison: X925 0.457 x 10 = 4.57 kept slots per cycle against A725 0.610 x 5 = 3.05 (derived from F08-61) | F08-61
Kept slots per cycle differ 4.57 / 3.05 = 1.5 times and steps per second 57,240 / 28,662 = 2.0 times; the remaining factor 2.0 / 1.5 = 1.33 is clock and micro-operations per step (derived identity); separating them needs the run's duration and step count beside the cycle and micro-operation counts (instruction to the reader) | F08-61
Graviton2 is Neoverse N1, Graviton3 is Neoverse V1, Graviton4 is Neoverse V2, Graviton5 is Neoverse V3 (Graviton2 cited beside the N1 paragraph too) | F08-56
The Neoverse V3 and Cortex-X925 files carry the same formula | F08-19
Intel's VTune cookbook (2025.4) says four slots per cycle, out of date against Intel's metrics file | F08-2, F08-8
Intel's Bad Speculation includes slots blocked while the pipeline recovers from a wrong speculation | F08-7
Neoverse V1 correction: 4 cycles per mispredicted branch moved from front-end bound to bad speculation | F08-17
Neoverse V2 correction: the 4-cycle term is taken 1 cycle from the front end and 3 from the back end | F08-18
Uncorrected on the V2: back-end bound too high by 3 cycles per mispredicted branch, front-end bound by 1, each over the cycle count (our arithmetic from Arm's V2 formula) | F08-18
Counting STALL_FRONTEND_FLUSH lets Arm's own formula make the correction | F08-19
Neoverse V3, Cortex-X925 and Cortex-A725 use the measured event STALL_FRONTEND_FLUSH (cycles recovering from a flush) | F08-19
Without the correction, front-end bound is too high and bad speculation too low by the same amount; back end and retiring unchanged on V1, V3, X925, A725 | F08-22
The physics-step run did not record STALL_FRONTEND_FLUSH; estimate borrowing the V1 constant: 79,584,976 x 4 / 19,922,115,591 = 1.6 points (front end 12.2% to about 10.6%, bad speculation 5.6% to about 7.2%); branch microbenchmark 13.2 points | F08-22, F08-23
Each program ran under perf stat twice: once for the six slot events, once for eight detail events (mispredicts, memory stall, instructions) | F08-60
Linux v7.3 (tagged 2026-10-18) has per-core files for Neoverse cores and none for Cortex-X925 or Cortex-A725; perf stat --topdown on a DGX Spark would use the generic formula (our reading) | F08-9, F08-21
EC2: sizes with an entire dedicated socket get all PMU events; smaller sizes of newer generations a reduced set; older ones may get none | F08-25
Full PMU support by family and size, and basic support at smaller sizes; the page does not list the reduced set | F08-26
AWS's Graviton recipe uses instructions per cycle and stalled cycles per thousand cycles | F08-29
Metal instances expose every hardware PMU (with OS driver support); on Graviton metal, Arm's Statistical Profiling Extension (samples individual instructions) and the mesh interconnect counters, which measure system-wide memory bandwidth, are not available to virtualised sizes, so that bandwidth measurement needs a metal size | F08-27
"Metal instances available" is yes only for G4dn and G5g among the accelerated families; the PMU table names no G or P family | F08-26, F08-28
The four shares name the job's bottleneck only when the job is bound by the measured CPU (perf documentation); stated on the first screen and again at the GPU block, where a timeline is the first reading of a GPU job | F08-9, F08-39
Nsight Systems, version 2026.6, is the whole-application timeline (CPU sampling, CUDA calls and kernels); its use for "is the GPU waiting for the CPU" is our reading, and so is the Nsight Compute table cell "Whether the GPU is waiting on the CPU" (cite label says so) | F08-39
The SM is the GPU's core processing unit; tensor cores are a pipeline of their own for MMA instructions | F08-36, F08-42
nvidia-smi sample period between 1 second and 1/6 second depending on the product | F08-30
DCGM (newest tag v4.7.0): SM activity (0.8 or greater "necessary, but not sufficient"; under 0.5 "likely indicates ineffective GPU usage", restated in the toy as "NVIDIA says usage is likely ineffective"; warps waiting on memory count as active), tensor activity, DRAM activity; 1 Hz default sampling | F08-32
Since 19 November 2026 EC2 Detailed Monitoring can publish one-minute GPU metrics with no agent in the instance; fields not read, so SM activity comes from DCGM until confirmed (expandable block) | F08-86
Nsight Compute, version 2026.4.0, profiles per kernel and needs more replays for more metrics | F08-33
Nsight Compute reports compute and memory throughput as a share of the GPU's maximum and per-pipeline utilisation; SpeedOfLight throughput metrics return the maximum percentage value of their constituent counters, so each figure is the busiest unit against its own peak and need not be a share of the chip's peak FLOP/s or memory bandwidth | F08-34
The roofline: sloped part is the memory bandwidth limit, flat part the peak compute limit | F08-35
Nsight Compute must run as root on mobile platforms (Jetson); our pass on the DGX Spark also needed root (stated in the same sentence, scoped to our pass) | F08-37, F08-71
Other engines (display, copy, video encoder and decoder) share L2 and DRAM, so a small kernel can show traffic not its own | F08-38
tegrastats on a Jetson: GR3D_FREQ "Proportion of GPU activation time in a period"; EMC_FREQ memory-controller bandwidth in use (Jetson Linux r39.2.2 docs) | F08-40
The SM unit list includes "RT Cores, if available" with no metric; RT cores have no counter we located in these tools' documentation (nvidia-smi, DCGM, tegrastats and Nsight Compute were searched, U08-4; "not located", not "does not exist") | F08-36
The X925, A725 and Neoverse V3 files define a level 2 splitting back-end stalls into core-bound and memory-bound | F08-24
Sample card: 10 slots per cycle on the X925 as read from the kernel | F08-68
Sample card: MuJoCo 4.0.1 on the Spark; single run, one core, a humanoid model standing in for the SO-101 | F08-73
The branch microbenchmark mispredicts far more often per cycle than the physics step (256,608,053 / 7,794,987,434 against 79,584,976 / 19,922,115,591, derived) | F08-23
On the branch microbenchmark the borrowed correction moves front end 37.6% to about 24.5% and bad speculation 11.9% to about 25.1%, so the larger of the two flips | F08-23
On the physics step the back end stays the largest loss with or without the estimated correction (derived from F08-23 and F08-61) | F08-23, F08-61
On Graviton, CMN counters work only on metal and with "certain OSes and kernels" (quoted, in the main text) | F08-27
Toy GPU: 100 SMs, one kernel back to back keeping 5 busy: nvidia-smi 100%, SM activity 5 / 100 = 0.05 (illustration of the two definitions) | F08-30, F08-32
The six top-down events in perf's lowercase spelling: cpu_cycles, stall_slot, stall_slot_frontend, stall_slot_backend, op_spec, op_retired | F08-60, F08-22
Arm's level-2 metrics divide back-end stalls into core-bound and memory-bound (STALL_BACKEND_MEMBOUND, STALL_BACKEND_CPUBOUND over STALL_BACKEND) | F08-24
GPU, DGX Spark, one Nsight Compute pass: 4096 x 4096 float32 matrix multiply as cutlass_80_simt_sgemm_128x128_8x4_nn_align1 in 8.35 ms, 2 x 4096^3 / 8.35 ms = about 16,460 GFLOP/s (derived), compute throughput 70.49%, memory throughput 50.47%; needed root | F08-71
"simt" in the kernel name is the general floating-point path; the float32 multiply did not use the tensor pipeline, so the pass says nothing about tensor cores (our reading, in the register entry); why PyTorch took that path, and which precision or setting would move it to the tensor cores, the run does not show (no register entry holds it) | F08-71
Whether tensor cores work is read from DCGM tensor activity (fleet) and Nsight Compute per-pipeline utilisation (one kernel) | F08-32, F08-34
DCGM tensor activity: higher values indicate higher use of the tensor cores | F08-32
Q4 bound: memory-stall cycles at 0.4% of cycles hold at most 0.4 of the 36.5 back-end points even if each lost all 10 slots (derived); this bounds only the counted cycles, not memory's whole share | F08-61, F08-29
A cycle-based count misses cycles in which some slots still moved | F08-29
The Tier 0 set is level 1 only: no level-2 events were recorded | F08-73
On GPU instances without a metal size, a CPU card comes from a virtual machine with its size's event set and without the metal-only PMUs | F08-28, F08-26, F08-27
The two executions of the physics step ran 19,922,115,591 and 19,958,256,358 cycles | F08-23, F08-70
A single run has no variance, so it cannot show whether a 1.6-point difference is above the noise | F08-73, F08-23
When a GPU does the work, the back-end question moves to the GPU readings: tensor activity, memory activity, or the kernel's place on the roofline | F08-32, F08-35
