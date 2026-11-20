# Claims: section 22, Our Measurements

Jetson A78AE core 14,507 and Spark X925 core 57,240 physics steps per second, MuJoCo 3.17.0 and 4.0.1, single run | F08-61, F08-73
Two machines; 14 single-thread microbenchmarks and 3 CPU stand-ins per core type; perf stat twice (six top-down events, eight detail events); one GPU matrix-multiply kernel per machine under Nsight Compute | F08-60
Software differed: MuJoCo 4.0.1 (Spark) and 3.17.0 (Jetson); Nsight Compute 2025.3.1 (Spark) and 2024.3.1 (Jetson) | F08-73, F08-71, F08-72
Physics stand-in is a MuJoCo humanoid with random controls, not the SO-101 | F08-61
Policy stand-in is six 1024x1024 float32 matrix-vector products with ReLU in NumPy on one core, not a real policy | F08-62
Render stand-in is a MuJoCo offscreen 640x480 render through EGL with a physics step per frame; GPU share not established | F08-64, F06-61
No EC2 instance and no real policy measured; one core; two passes from different benchmark versions are two single runs | F08-73
Physics cards: all four categories, memory stall and throughput for three core types | F08-61
Policy cards: all four categories, memory stall and throughput for three core types | F08-62
Render cards: all four categories, memory stall and throughput for three core types | F08-64
Slots per cycle on the cards: 6 (A78AE), 5 (A725), 10 (X925) | F08-68
Physics: retiring largest on all three (43.2%, 61.0%, 45.7%); Jetson loses 31.0% to the front end; X925 loses 36.5% to the back end with 0.4% memory stall (waiting on arithmetic is our reading) | F08-61
Policy: Jetson core 63.9% back-end bound and 62.3% of cycles stalled on memory; Spark memory stall 22.8% and 22.4%; 390, 1,404, 1,968 inferences per second | F08-62
Render: X925 69.2% back-end bound with 3.4% memory stall; 209, 937, 1,191 frames per second; cannot compare rendering hardware | F08-64
The top-down split names the bottleneck only for a CPU-bound workload | F08-9
Floating-point rate 3.411, 5.595, 22.242 billion fused multiply-adds per second, 24 chains | F08-65
Memory bandwidth 11.71, 43.95, 44.38 GB/s (triad); the Spark's two core types reach the same figure | F08-66
Memory latency 291.58, 144.92, 123.96 ns per load (pointer chase) | F08-67
Weights 6 x 1024 x 1024 x 4 bytes = 25.2 MB, larger than any cache; 390 x 25.2 MB = 9.8 GB/s against 9.25 GB/s read and 11.71 GB/s triad | F08-63
Same arithmetic on the Spark: 35.3 and 49.5 GB/s, beside triad 43.95 and 44.38 GB/s | F08-63
Nsight Compute throughput figures are shares of the GPU's maximum for compute (SM) and memory | F08-34
Spark GPU kernel: 4096x4096, cutlass simt sgemm, 8.35 ms, compute 70.49%, memory 50.47%, SM clock 2.13 GHz; simt means no tensor-core evidence (our reading) | F08-71
Jetson GPU kernel: 2048x2048, ampere sgemm, 42.31 ms, compute 74.49%, memory 48.27%, SM clock 306 MHz; durations not comparable | F08-72
Formula is the generic Arm one in Linux perf | F08-20
Arm's X925 and A725 formulas move flush-recovery cycles from front-end bound to bad speculation | F08-19
Runs did not record the event: front end too high, bad speculation too low by the same unknown amount; back end and retiring unaffected | F08-22
Illustration of the size: 1.6 points on the X925 physics step (12.2% to about 10.6%, 5.6% to about 7.2%); 13.2 points on the branch microbenchmark; under 0.5 on policy and memory | F08-23
Report matches raw counters: 36.54% against 36.5%, 26.81% against 26.8%; all 51 rows of pass 2 | F08-70
Four categories add to 100% by construction | F08-69
Spark slot counts 10 and 5 read from the OS and equal Arm's files; Jetson's 6 derived; no Arm file for the A78AE located | F08-68, F08-16
Workload cards reproduce across passes (throughput within 2.5%, categories within 0.5 points); triad and memory-write stall split does not and is not printed | F08-73
Pass 1 against pass 2 on the Jetson triad: 11.66 GB/s with 5.9% and 76.9%; 11.71 GB/s with 78.1% and 7.9% (shown only as evidence of non-reproduction) | F08-73
Slot split and memory stall come from two separate executions | F08-60
What the profiling project is asked for (real workloads, EC2 families, GPU counters, repeats) | F08-74
