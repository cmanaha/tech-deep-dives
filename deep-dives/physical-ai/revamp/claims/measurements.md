# Claims: section 22, Our Measurements

Opening ratios between the same two cores (X925 against A78AE): arithmetic 6.5, streaming 3.8, latency 2.4 | F08-65, F08-66, F08-67
Physics step: 57,240 steps per second on one Spark Cortex-X925 core, 14,507 on one Jetson Cortex-A78AE core, single runs, MuJoCo 4.0.1 and 3.17.0 | F08-61, F08-73
Ratio 57,240 / 14,507 = 3.9 (our arithmetic, Derived) | F08-61
No EC2 instance measured; nothing on more than one core; the humanoid is a stand-in, not the SO-101 | F08-73
The SO-101 is a six-motor arm (task wording from the dive's shared task constant, block into cup) | F01-8
IPC on the physics step: 4.37 (X925) and 2.48 (A78AE), from the detail-event run; 4.37 / 2.48 = 1.76 and 3.9 / 1.76 = 2.2 (our arithmetic, Derived; the throughput identity is textbook); perf stat wraps the whole command (start-up included) while workloads.py times the loop alone, so cycle counts do not give the clock and the 2.2 is not split further | F08-61, F08-60
Physics stand-in: humanoid with random controls; memory stall at or under 2.2% of cycles | F08-61
The policy stand-in stands for a small dense model on a CPU core, not the arm's GPU policy | F08-62
Policy stand-in: six 1024x1024 float32 matrix-vector products with ReLU in NumPy on one core; reads all 25.2 MB per pass, larger than any cache; not ACT or a VLA, batch 1 on the CPU where real policies run convolutions and attention on the GPU | F08-62, F08-63
Render stand-in: MuJoCo offscreen 640x480 through EGL with a physics step per frame; counters cover the CPU thread only; GPU share not recorded | F08-64
MuJoCo's renderers are rasterisers; EGL is hardware-accelerated headless rendering | F06-61
perf stat run twice per program (six top-down events stall_slot, stall_slot_frontend, stall_slot_backend, op_retired, op_spec, cpu_cycles; eight detail events incl. inst_retired and stall_backend_mem), pinned to one core; 14 single-thread microbenchmarks per core type; one GPU kernel per machine under Nsight Compute | F08-60
Memory stall and IPC come from a second execution, so ratios mixing them with slot shares compare two runs | F08-60
Slots per cycle: 6 (A78AE, derived as (stall_slot + op_spec) / cpu_cycles = 6.000 on three kernels, since each slot either stalls or dispatches; kernel reports 0; no Arm file), 5 (A725), 10 (X925); Spark has a GB10 GPU | F08-68, F08-16
Retiring = share of slots that started a micro-operation x share of started micro-operations kept; Jetson policy card 0.27131 x 0.98809 = 26.81% (shown as 27.1% and 98.8%, Derived) | F08-70, F08-62
Physics cards: retiring largest on all three (43.2%, 61.0%, 45.7%); A78AE loses 31.0% to the front end; X925 loses 36.5% to the back end with 0.4% memory stall | F08-61
Generic Arm formula from Linux perf books flush recovery as front-end bound | F08-20
Arm's X925 and A725 formulas move flush-recovery cycles to bad speculation via STALL_FRONTEND_FLUSH, not recorded in our runs | F08-19
Direction of the bias: front end too high, bad speculation too low by the same unknown amount; back end and retiring unchanged | F08-22
No Arm formula/file for the A78AE | F08-16
Illustration: borrowed 4-cycle constant (Neoverse V1 and V2); X925 physics 1.6 points (12.2% to about 10.6%, 5.6% to about 7.2%); branch microbenchmark 13.2 points; policy and memory programs under 0.5; borrowed constant and retired mispredictions | F08-23
Policy cards: Jetson 63.9% back-end bound, 62.3% memory stall; 6 x 1024 x 1024 x 4 bytes = 25.2 MB; 390 x 25.2 MB = 9.8 GB/s against triad 11.71 GB/s; 84% (Derived) | F08-62, F08-63
Spark policy: 35.3 GB/s (A725) against triad 43.95 (80%, Derived); 49.5 GB/s (X925) above triad 44.38; memory stall 22.8% and 22.4% | F08-63, F08-62, F08-66
Mem read loop on the X925: 28.94 GB/s, 82.9% front-end bound, limited by its own loop; a microbenchmark rate is a lower bound on what one core can draw (our reading in F08-63; the lower-bound statement is definitional) | F08-63
How a card shows its limit (our reading from the cards): core limit = retiring leading with memory stall near zero; memory limit = large back-end share and memory stall with demand near the triad figure | F08-61, F08-62, F08-63
Render cards: X925 69.2% back-end bound, 3.4% memory stall; a thread waiting on the GPU can read as back-end bound; 209, 937, 1,191 frames per second; cannot compare rendering hardware | F08-64
perf documentation: top-down names the bottleneck only for a CPU-bound workload | F08-9
FMA: 24 independent chains; 3.411, 5.595, 22.242 billion FMAs per second; ratio 6.5 | F08-65
Triad: 11.71, 43.95, 44.38 GB/s; ratio 3.8; the Spark's two cores reach the same figure | F08-66
Pointer chase: 291.58, 144.92, 123.96 ns per load; ratio 2.4; DRAM back end 97.6% to 99.0% bound | F08-67
Workload ratios X925 over A78AE: physics 3.9, policy 1,968 / 390 = 5.0, render 1,191 / 209 = 5.7 (Derived) | F08-61, F08-62, F08-64
Within the Spark: 57,240 / 28,662 = 2.0, 1,968 / 1,404 = 1.4 (Derived); X925 has twice the A725's slots but 4.37 against 3.01 instructions per cycle = 1.45 (Derived), retiring 45.7% of 10 against 61.0% of 5; if instructions per step match (one program, one version), 2.0 / 1.45 = 1.4 is the clock ratio (conditional derivation, textbook identity); policy IPC 3.07 and 2.96 | F08-61, F08-62, F08-68
Whole-machine memory bandwidth by NVIDIA: 102 GB/s (Jetson Orin Nano Super), 273 GB/s (DGX Spark), shared by CPU and GPU; 273 / 102 = 2.7 (Derived) against 3.8 for one core | F07-36, F07-47, F08-66
One core, one thread: nothing about scaling or shared-memory contention | F08-73
A per-core counter cannot see the GPU's share of a shared memory bus | F08-41
Nsight Compute throughput figures are shares of the GPU's maximum for SM compute and memory, each the maximum over its constituent counters; so 70.49% is one counter's share of its maximum, not the share of peak floating-point rate (follows from the definition) | F08-34, F08-71
Spark GPU kernel: 4096x4096, cutlass simt sgemm, 8.35 ms, compute 70.49%, memory 50.47%, SM clock 2.13 GHz, Nsight Compute 2025.3.1; about 16,460 GFLOP/s derived; simt means no tensor-core evidence (our reading) | F08-71
Jetson GPU kernel: 2048x2048, ampere sgemm, 42.31 ms, compute 74.49%, memory 48.27%, SM clock 306 MHz, Nsight Compute 2024.3.1; 406 GFLOP/s derived; GPU clock scales with load; durations not comparable | F08-72
Two passes from different benchmark versions; workload cards reproduce (throughput within 2.5%, categories within 0.7 points, Derived from the wave 4 reproducibility note); triad and memory-write split does not and is not printed | F08-73
Jetson triad pass 1 11.66 GB/s, 5.9% front end, 76.9% back end; pass 2 11.71 GB/s, 78.1% and 7.9%, 2.6% memory stall, which does not look like a memory-bound loop | F08-73, F08-66
Report percentages match raw counters for all 51 rows; 36.54% against 36.5%; 26.81% against 26.8% with the slot arithmetic | F08-70
Four categories add to 100% by construction; known-answer kernels (pointer chase back-end bound, FMA on the X925 0.0% front end, data held in registers) are the real check; advice to run a new program at least twice follows from the triad flip | F08-69, F08-67, F08-65, F08-73
Measurements still owed: real workloads with units of work (p50 and p99), EC2 instances, GPU counters, repeats; one card per phase | F08-74
Graviton generations are Arm Neoverse cores | F08-56
EC2 PMU access: sizes with an entire dedicated socket generally get every event; smaller newer sizes a reduced set; smaller older sizes may get none | F08-25
Full PMU support listed from c9g.12xlarge and c8g.24xlarge | F08-26
Placeholders (four, dated 2026-11-20): real workloads on the edge machines; EC2 families and the perf list capability check; GPU counters; repeats and corrections | F08-74, F08-73
