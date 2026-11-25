# Claims: section 21, Reading a Machine: Counters Tell a Core Limit From a Memory Limit

claim | register ID

The part a job fills first is read off hardware counters for the CPU core's halves and the GPU's units; each part has a counter that shows it (the dive's grouping) | F08-50
A slot is one chance per cycle to pass one micro-operation from the front end to the back end; each slot is sorted into one of four categories by two questions: was a micro-operation delivered, and did it retire | F08-2, F08-3
Back-end bound splits at level 2 into memory bound (stalled on loads or stores) and core bound (execution resources busy or dependent operations, for example chained long-latency floating-point operations) | F08-6
Level 2 splits back-end loss into memory bound (waiting on loads and stores) and core bound (waiting on execution units); a job whose loads wait on main memory gains from faster memory (more bandwidth where loads stream, lower latency where each load waits for the one before; two different limits) and not from a faster core; a core-bound job gains the reverse (scoped to main memory in round 3, since memory bound also covers data-cache waits, F08-24) | F08-6, F08-41, F08-24
Our measurement, single run, MuJoCo humanoid on a DGX Spark: X925 retiring 45.7%, bad speculation 5.6%, front end 12.2%, back end 36.5%, memory stall 0.4% of cycles, 4.37 instructions per cycle, 57,240 steps/s; A725 retiring 61.0% at 28,662 steps/s | F08-61
Verdict: the card's own level-1 counters place the loss in the back end and go no further; the call between core and main memory comes from the same-chip comparison, with the 0.4-point memory-stall bound ruling out the stalls that event counts; both point at the core rather than main memory, and a faster core is the purchase the card supports; whether a wider core would help is left open, because core bound covers both busy units and dependent operations and a level-1 count sees neither; inside the core, execution units and caches remain to be told apart and a level-2 count would settle it (level 2 puts L1 and L2 data-cache stalls on the memory-bound side); Q4 ends on the level-2 count (the dive's inference from the cited figures, stated without a label) | F08-61, F08-66, F08-67, F08-6, F08-73, F08-24
Same chip: the X925 stepped the model twice as fast as the A725 (57,240 against 28,662 steps/s, ratio 1.997) | F08-61
Same chip: main memory serves either Spark core at about the same rate: one-core triad over a footprint larger than the caches 44.38 GB/s on the X925 and 43.95 GB/s on the A725 (F08-66 reads the equal figure as memory, not core, being the limit) | F08-66
Same chip: pointer chase at DRAM 123.96 ns per load on the X925 and 144.92 ns on the A725, 144.92 / 123.96 = 1.17 (derived); so main memory cannot account for the factor of two (our inference from F08-66 and F08-67) | F08-67
The caches differ: on the physics step the A725 refilled its L2 data cache 0.38 times per thousand instructions and the X925 0.12 times (refill columns of the report table), so part of the gap may be cache; level 2 (which counts L1 and L2 data-cache stalls as memory-bound) would separate them | F08-61, F08-24
The memory-stall figure is the event stall_backend_mem, counted in the second execution with the detail events | F08-60
nvidia-smi GPU utilisation is the percent of time one or more kernels was executing; one small kernel back to back reads 100% | F08-30
nvidia-smi reports encoder and decoder utilisation separately | F08-31
Total slots = pipeline width x core clock cycles | F08-8
A slot stands for the hardware resources needed to process one micro-operation (Intel's uOp) | F08-2
Arm counts slots at the rename unit, the stage that passes micro-operations from the front end to the back end (it partitions the two); the slots per cycle are the core's execution bandwidth for top-down accounting | F08-14, F08-15
A cycle-based stall count is coarser than a slot split: on the illustrative 4-slot core, a cycle that moved 1 of 4 slots counts as not stalled (the register's example is 2 of 8) | F08-29
The front end predicts the next address, fetches and decodes instructions into micro-operations | F08-4
The back end executes micro-operations out of order and retires them in program order | F08-5
Top-down analysis was introduced by Intel (Yasin, ISPASS 2014; the year is no longer printed), cited in the opening where the method is named | F08-1
Retiring at 100% would mean the full width was reached; a high value does not prove there is nothing left to gain, because a slot counts as kept whenever its micro-operation retires, needed or not (reading of the definition) | F08-7
Instruction-cache misses are categorised under front-end bound | F08-4
Arm event definitions: CPU_CYCLES, STALL_SLOT (sum of STALL_SLOT_FRONTEND and STALL_SLOT_BACKEND), OP_SPEC (micro-operations dispatched), OP_RETIRED | F08-15
The generic Arm level-1 formula that Linux perf v7.3 ships (four expressions, no correction term) | F08-20
The four categories add to 100% by construction of the formula; the sum is not a validation | F08-69
Counters say, before purchase, whether a faster core or faster memory would help; the level-1 percentages and the level-2 split beneath them carry the decision (our reading of the parts and their counters) | F08-50, F08-6, F08-24
Intel introduced top-down analysis, and AMD and Arm also use it, sorting slots into the same four categories | F08-1, F08-8, F08-11, F08-14, F08-16
Opening: our measurements are single runs on two NVIDIA machines, named there as a DGX Spark desktop and a Jetson robot computer (Jetson Orin Nano Super) | F08-60, F08-73
Opening: on the X925 physics step the back end left 36.5% of slots empty, the largest of the three losses; the step ran twice as fast on the X925 as on the A725 while main memory streams to either core at about the same rate (44.38 and 43.95 GB/s, F08-66), so main memory does not explain the gap; the card points at the core rather than main memory and so at a faster core (verdict argued in the card's fourth question) | F08-61, F08-66
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
Nsight Compute, version 2026.4.0, profiles per kernel and needs more replays for more metrics | F08-33
Nsight Compute reports compute and memory throughput as a share of the GPU's maximum and per-pipeline utilisation; SpeedOfLight throughput metrics return the maximum percentage value of their constituent counters, so each figure is the highest of the percentages its constituent counters report and need not be a share of the chip's peak arithmetic rate or memory bandwidth | F08-34
The roofline: sloped part is the memory bandwidth limit, flat part the peak compute limit | F08-35
Nsight Compute must run as root on mobile platforms (Jetson) | F08-37
Our Nsight Compute pass on the DGX Spark needed root (a separate sentence, scoped to our pass; no entry says whether the Spark counts as a mobile platform) | F08-71
Other engines (display, copy, video encoder and decoder) share L2 and DRAM, so a small kernel can show traffic not its own | F08-38
tegrastats on a Jetson: GR3D_FREQ "Proportion of GPU activation time in a period"; EMC_FREQ memory-controller bandwidth in use (Jetson Linux r39.2.2 docs) | F08-40
The SM unit list includes "RT Cores, if available" with no metric; RT cores have no counter we located in these tools' documentation (nvidia-smi, DCGM, tegrastats and Nsight Compute were searched, U08-4; "not located", not "does not exist") | F08-36
The X925, A725 and Neoverse V3 files define a level 2 splitting back-end stalls into core-bound and memory-bound | F08-24
Sample card: 10 slots per cycle on the X925 as read from the kernel | F08-68
Sample card: MuJoCo 4.0.1 on the Spark; single run, one core, a humanoid model standing in for the SO-101 robot arm, whose own scene was not measured | F08-73
The branch microbenchmark mispredicts far more often per cycle than the physics step (256,608,053 / 7,794,987,434 against 79,584,976 / 19,922,115,591, derived) | F08-23
On the branch microbenchmark the borrowed correction, 256,608,053 x 4 / 7,794,987,434 = 13.17 points, with the mispredicts counted in a second execution, moves front end 37.6% to about 24.5% and bad speculation 11.9% to about 25.1%, so the larger of the two flips | F08-23, F08-60
Branch-microbenchmark shares printed unrounded, 37.65% front end and 11.91% bad speculation (F08-23 prints 37.6% and 11.9%) (derived: recomputed from the raw `branch` row of results-pass2/results-spark-x925.csv, the file F08-23 draws its counts from: 29,344,257,216 / (7,794,851,873 x 10); filled 0.28953 x (1 - 13,284,058,716 / 22,568,607,256)), printed so that 37.65 - 13.17 = 24.48 and 11.91 + 13.17 = 25.08 can be redone | F08-23
On the physics step the back end stays the largest loss with or without the estimated correction (derived from F08-23 and F08-61) | F08-23, F08-61
On Graviton, CMN counters work only on metal and with "certain OSes and kernels" (quoted, in the main text) | F08-27
Toy GPU: 100 SMs, one kernel back to back keeping 5 busy: nvidia-smi 100%, SM activity 5 / 100 = 0.05 (illustration of the two definitions) | F08-30, F08-32
The six top-down events in perf's lowercase spelling: cpu_cycles, stall_slot, stall_slot_frontend, stall_slot_backend, op_spec, op_retired | F08-60, F08-22
Arm's level-2 metrics divide back-end stalls into core-bound and memory-bound (STALL_BACKEND_MEMBOUND, STALL_BACKEND_CPUBOUND over STALL_BACKEND) | F08-24
GPU, DGX Spark, one Nsight Compute pass: 4096 x 4096 float32 matrix multiply as cutlass_80_simt_sgemm_128x128_8x4_nn_align1 in 8.35 ms, compute throughput 70.49%, memory throughput 50.47%; needed root (the derived GFLOP/s figure is no longer printed: no entry gives the GB10's float32 peak to set it against) | F08-71
"simt" in the kernel name is the general floating-point path; the float32 multiply did not use the tensor pipeline, so the pass says nothing about tensor cores (our reading, in the register entry) | F08-71
PyTorch's torch.set_float32_matmul_precision decides whether PyTorch may compute a float32 multiply in a narrower format: "highest", the default, computes in float32; "high" permits TensorFloat32 (10 mantissa bits explicitly stored, against float32's 23) when a fast kernel is available; the output stays float32. The page does not say which setting our run used (not recorded) | F08-88
Record the precision setting beside the kernel name, and read the name again after changing it; a name that still carries simt still ran on the general path (method note; the use line of F08-88 says the path is read from the kernel name) | F08-88, F08-71
Whether tensor cores work is read from DCGM tensor activity (fleet) and Nsight Compute per-pipeline utilisation (one kernel) | F08-32, F08-34
DCGM tensor activity: higher values indicate higher use of the tensor cores | F08-32
Q4 bound: memory-stall cycles at 0.4% of cycles hold at most 0.4 of the 36.5 back-end points even if each lost all 10 slots (derived); this rules out the stalls the event counts as a real part of the loss and leaves open memory waits in cycles that still moved some slots, which the event does not count (it counts whole cycles) | F08-61, F08-29
A cycle-based count misses cycles in which some slots still moved | F08-29
The Tier 0 set is level 1 only: no level-2 events were recorded | F08-73
On GPU instances without a metal size, a CPU card comes from a virtual machine with its size's event set and without the metal-only PMUs | F08-28, F08-26, F08-27
The two executions of the physics step ran 19,922,115,591 and 19,958,256,358 cycles | F08-23, F08-70
A single run has no variance, so it cannot show whether a small difference between two cards is above the noise | F08-73
Each program's six slot events and eight detail events were counted in two executions because perf, when it cannot schedule all requested events together, multiplexes them (each runs part of the time and is scaled), and a ratio of two events not counted at the same time, such as instructions per cycle, can lose accuracy; no counter count per core is printed | F08-87, F08-60
perf's CSV output (-x,) includes the percentage of measurement time each counter was running; below 100% means the counter was multiplexed and scaled | F08-87
The perf stat command for the six slot events, adapted from run.sh (variable names and program path ours); armv8_pmuv3_1 is the X925's PMU name on the Spark | F08-60, F08-68
Count STALL_FRONTEND_FLUSH and the level-2 events where the core's file defines them | F08-19, F08-24
Bad speculation: the next count is mispredicted branches per thousand instructions, the next step of AWS's Graviton recipe | F08-29
Front-end bound: Arm's level 2 for the X925, A725 and Neoverse V3 splits front-end stalls into waiting on instruction fetch (instruction cache, instruction TLB) and waiting on the branch predictor and flush recovery | F08-24
Back-end bound: which of memory bound and core bound chooses between faster memory and a faster core | F08-6, F08-41
A card computed without c reads front-end bound too high and bad speculation too low, each by c (V3, X925, A725 in the body; V1 in the expandable) | F08-22, F08-17
A refill is a cache miss that fetches a line from further out (gloss of the l2d_cache_refill column) | F08-61
Here the compute side came closer to its limit than the memory side (70.49% against 50.47%, read by the SpeedOfLight definition) | F08-71, F08-34
The eight detail events: retired instructions, cycles, back-end memory stalls, mispredicted branches, and cache refills and last-level misses (inst_retired, cpu_cycles, stall_backend_mem, br_mis_pred_retired, l1d/l2d/l1i_cache_refill, ll_cache_miss_rd) | F08-60
SO-101: named as "the SO-101 robot arm" in the sample-card sentence (built in sections 1 and 3) | F08-73
AWS's top-down method for Graviton, its own Arm processors | F08-29, F08-56
Arm's formula subtracts c, a share of cycles, directly from a share of slots, which treats every slot of a recovery cycle as an empty front-end slot (reading of the formula) | F08-19
Q3 of the card: 0.457 x 10 = 4.57 of the 10 slots per cycle carry kept micro-operations (derived); the card's 4.37 instructions per cycle is a different count, instructions rather than micro-operations, from the second execution | F08-61
Back-end bucket question: for a memory-bound job, whether its loads wait on the core's data caches or on main memory (level 2 puts L1 and L2 data-cache stalls on the memory side; external memory has its own bandwidth and latency limits) | F08-6, F08-24, F08-41
The tegrastats paragraph and the shared-engines and RT-cores paragraph sit in an expandable at the end of the GPU block (unchanged text) | F08-40, F08-38, F08-36
