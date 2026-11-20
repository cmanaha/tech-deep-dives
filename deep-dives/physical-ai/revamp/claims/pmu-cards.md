# Claims: section 21, Reading a Machine: PMU Cards

claim | register ID

The front end predicts the next address, fetches and decodes instructions into micro-operations | F08-4
The back end executes micro-operations out of order and retires them in program order | F08-5
Intel's definition of a slot: "A pipeline slot represents the hardware resources needed to process one uOp." | F08-2
Arm counts slots at the stage that separates front end from back end; slots per cycle is a fixed property of each core | F08-14
The Cortex-X925 has 10 slots per cycle | F08-16
Top-down analysis was published by Intel in 2014 | F08-1
Each slot is sorted into one of four categories by two questions: was a micro-operation delivered, and did it retire | F08-3
Retiring at 100% would mean the full width was reached; a high value does not prove there is nothing left to gain | F08-7
Back-end bound splits into memory bound (stalled on loads or stores) and core bound (execution resources or dependent operations) | F08-6
Arm event definitions: CPU_CYCLES, STALL_SLOT, STALL_SLOT_FRONTEND, STALL_SLOT_BACKEND, OP_SPEC, OP_RETIRED | F08-15
The generic Arm level-1 formula that Linux perf v7.3 ships (four expressions, no correction term) | F08-20
The four categories add to 100% by construction of the formula; the sum is not a validation | F08-69
From Ice Lake, Intel cores hold the four ratios in a dedicated metrics register | F08-8
Raw counters of the X925 physics-step row (cycles, stall slots, started and retired micro-operations) and the recomputed 36.54% back-end bound | F08-69, F08-70
Intel pipeline width: 4 from Sandy Bridge, 5 from Ice Lake, 6 from Alder Lake and Sapphire Rapids, 8 from Lunar Lake and Arrow Lake | F08-8
AMD: 6 dispatch slots per cycle on Zen 4, 8 on Zen 5; the Zen 6 file also says 8 | F08-11, F08-12
AMD Zen 4 has a fifth bucket for slots lost to the sibling hardware thread | F08-11
Arm slots per cycle: Neoverse N1 5, V1 8, V2 8, V3 10, Cortex-X925 10, Cortex-A725 5; no file for the Cortex-A78AE | F08-16
Arm's per-core files live in the Telemetry Solution repository, release 2026.09 | F08-13
Intel's cookbook page says four slots per cycle, which is out of date against Intel's metrics file | F08-2, F08-8
Graviton3 is Neoverse V1, Graviton4 is Neoverse V2, Graviton5 is Neoverse V3 | F08-56
Our measurement, single run, MuJoCo humanoid on a DGX Spark: A725 retires 61.0% at 28,662 steps/s; X925 retires 45.7% at 57,240 steps/s, front end 12.2%, back end 36.5%, bad speculation 5.6%, memory stall 0.4% of cycles, 4.37 instructions per cycle | F08-61
Neoverse V1 correction: 4 cycles per mispredicted branch moved from front-end bound to bad speculation | F08-17
Neoverse V2 correction: the 4-cycle term is taken 1 cycle from the front end and 3 from the back end | F08-18
Neoverse V3, Cortex-X925 and Cortex-A725 use the measured event STALL_FRONTEND_FLUSH | F08-19
Linux v7.3 has per-core files for Neoverse cores and none for Cortex-X925 or Cortex-A725; perf stat --topdown on a DGX Spark would use the generic formula (our reading) | F08-21
Without the correction, front-end bound is too high and bad speculation too low by the same amount; back end and retiring are unchanged on V1, V3, X925, A725 (our reading) | F08-22
EC2: sizes with an entire dedicated socket get all PMU events; smaller sizes of newer generations a reduced set; older ones may get none | F08-25
Full PMU support by family and size, and basic support at smaller sizes | F08-26
AWS's Graviton recipe uses instructions per cycle and stalled cycles per thousand cycles; a cycle-based split is coarser than a slot-based one | F08-29
"Metal instances available" is yes only for G4dn and G5g among the accelerated families; the PMU table names no G or P family | F08-28
perf documentation: the bottleneck is real only if the workload is bound by the CPU | F08-9
The SM is the GPU's core processing unit; the unit list includes "RT Cores, if available"; no ray-tracing-core counter was located in this research | F08-36
Tensor cores are a pipeline of their own for matrix-multiply-accumulate instructions | F08-42
nvidia-smi GPU utilisation is the percent of time one or more kernels was executing | F08-30
nvidia-smi reports encoder and decoder utilisation separately | F08-31
DCGM (newest tag v4.7.0): SM activity (0.8 or greater "necessary, but not sufficient"), tensor activity, DRAM activity | F08-32
Nsight Systems, version 2026.6, is the whole-application timeline; that it shows a GPU waiting for the CPU is our reading | F08-39
Nsight Compute, version 2026.4.0, profiles per kernel and needs more replays for more metrics | F08-33
Nsight Compute reports compute and memory throughput as a share of the GPU's maximum and per-pipeline utilisation | F08-34
The roofline: sloped part is the memory bandwidth limit, flat part the peak compute limit | F08-35
Since 19 November 2026 EC2 Detailed Monitoring can publish one-minute GPU metrics with no agent in the instance; fields not read | F08-86
Sample card: 10 slots per cycle on the X925 as read from the kernel | F08-68
Sample card: MuJoCo 4.0.1 on the Spark; single run, one core, stand-in model | F08-73
