# Physical AI profiling, second pass: DGX Spark and Jetson Orin Nano

## 1. Machine capability: microbenchmarks, one core each

| Kernel | Unit | Jetson A78AE | Spark A725 | Spark X925 |
|---|---|---|---|---|
| FMA | Gfma/s | 3.411 | 5.595 | 22.242 |
| Ray/tri (CPU) | Mtest/s | 57 | 143.9 | 337.8 |
| Branch | Mbranch/s | 123.8 | 194.4 | 323.5 |
| Front end | Mcall/s | 40 | 94.5 | 122.3 |
| Triad L1 | GB/s | 68.71 | 88.15 | 182.92 |
| Triad L2 | GB/s | 51.03 | 64.36 | 182.38 |
| Triad L3 | GB/s | 30.13 | 80.1 | 126.99 |
| Triad DRAM | GB/s | 11.71 | 43.95 | 44.38 |
| Mem read | GB/s | 9.25 | 22.08 | 28.94 |
| Mem write | GB/s | 19.89 | 43.18 | 42.58 |
| Latency L1 | ns/load | 2.32 | 1.43 | 1.03 |
| Latency L2 | ns/load | 6.47 | 3.68 | 3.9 |
| Latency L3 | ns/load | 10.08 | 6.29 | 5.81 |
| Latency DRAM | ns/load | 291.58 | 144.92 | 123.96 |

## 2. What each kernel does to the pipeline (top-down level 1)


**Jetson A78AE** (slots per cycle 6)

| Kernel | Front end | Back end | Retiring | Bad spec | Mem stall (cycles) | IPC |
|---|---|---|---|---|---|---|
| FMA | 33.1% | 30.8% | 36.1% | 0.0% | 0.0% | 2.17 |
| Ray/tri (CPU) | 26.2% | 23.1% | 19.1% | 31.7% | 0.0% | 1.18 |
| Branch | 30.5% | 20.3% | 24.5% | 24.7% | 0.0% | 1.47 |
| Front end | 80.9% | 7.0% | 5.4% | 6.6% | 0.0% | 0.33 |
| Triad L1 | 15.2% | 1.2% | 83.0% | 0.6% | 0.0% | 5.84 |
| Triad L2 | 37.6% | 0.8% | 61.6% | 0.1% | 0.0% | 4.31 |
| Triad L3 | 62.7% | 0.9% | 36.3% | 0.0% | 0.2% | 2.53 |
| Triad DRAM | 78.1% | 7.9% | 14.0% | 0.0% | 2.6% | 0.98 |
| Mem read | 4.3% | 79.0% | 16.6% | 0.0% | 49.8% | 1.32 |
| Mem write | 25.8% | 38.7% | 35.5% | 0.0% | 1.2% | 2.13 |
| Latency L1 | 12.3% | 75.1% | 12.5% | 0.0% | 0.0% | 0.75 |
| Latency L2 | 4.5% | 91.0% | 4.5% | 0.0% | 0.0% | 0.27 |
| Latency L3 | 2.9% | 94.2% | 2.9% | 0.0% | 15.7% | 0.17 |
| Latency DRAM | 0.7% | 98.9% | 0.4% | 0.0% | 97.9% | 0.02 |

**Spark A725** (slots per cycle 5)

| Kernel | Front end | Back end | Retiring | Bad spec | Mem stall (cycles) | IPC |
|---|---|---|---|---|---|---|
| FMA | 18.3% | 38.4% | 43.3% | 0.0% | 0.0% | 2.16 |
| Ray/tri (CPU) | 11.4% | 26.6% | 35.9% | 26.1% | 0.0% | 1.84 |
| Branch | 35.0% | 9.8% | 28.5% | 26.7% | 0.0% | 1.42 |
| Front end | 66.4% | 0.1% | 9.5% | 24.0% | 0.0% | 0.48 |
| Triad L1 | 7.1% | 0.3% | 91.9% | 0.6% | 0.0% | 4.59 |
| Triad L2 | 4.9% | 28.0% | 67.0% | 0.1% | 0.4% | 3.34 |
| Triad L3 | 6.1% | 10.6% | 83.3% | 0.0% | 7.3% | 4.11 |
| Triad DRAM | 3.7% | 50.4% | 45.8% | 0.1% | 44.6% | 2.27 |
| Mem read | 5.5% | 58.2% | 36.2% | 0.1% | 1.8% | 1.97 |
| Mem write | 19.0% | 4.7% | 76.3% | 0.0% | 0.1% | 2.88 |
| Latency L1 | 0.1% | 84.9% | 15.0% | 0.0% | 0.0% | 0.75 |
| Latency L2 | 0.1% | 94.0% | 5.9% | 0.0% | 0.1% | 0.29 |
| Latency L3 | 0.2% | 96.3% | 3.5% | 0.0% | 3.2% | 0.19 |
| Latency DRAM | 0.4% | 97.6% | 1.9% | 0.1% | 73.5% | 0.09 |

**Spark X925** (slots per cycle 10)

| Kernel | Front end | Back end | Retiring | Bad spec | Mem stall (cycles) | IPC |
|---|---|---|---|---|---|---|
| FMA | 0.0% | 38.1% | 61.8% | 0.0% | 0.0% | 6.18 |
| Ray/tri (CPU) | 7.7% | 22.5% | 30.2% | 39.7% | 0.0% | 3.10 |
| Branch | 37.6% | 33.4% | 17.0% | 11.9% | 0.0% | 1.70 |
| Front end | 62.3% | 11.9% | 5.0% | 20.7% | 0.0% | 0.44 |
| Triad L1 | 39.6% | 0.9% | 58.8% | 0.6% | 0.0% | 6.87 |
| Triad L2 | 39.3% | 2.1% | 58.6% | 0.0% | 0.0% | 6.83 |
| Triad L3 | 42.5% | 16.6% | 40.8% | 0.0% | 8.5% | 4.75 |
| Triad DRAM | 24.5% | 61.0% | 14.4% | 0.0% | 39.9% | 1.63 |
| Mem read | 82.9% | 3.3% | 13.8% | 0.0% | 0.9% | 1.83 |
| Mem write | 34.6% | 45.2% | 20.1% | 0.0% | 0.5% | 2.09 |
| Latency L1 | 0.0% | 92.5% | 7.5% | 0.0% | 0.0% | 0.75 |
| Latency L2 | 0.0% | 97.9% | 2.0% | 0.0% | 5.0% | 0.19 |
| Latency L3 | 0.1% | 98.6% | 1.4% | 0.0% | 24.9% | 0.14 |
| Latency DRAM | 0.3% | 99.0% | 0.7% | 0.0% | 79.0% | 0.07 |

## 3. Three representative physical AI workloads


**Physics sim step (MuJoCo humanoid)**

| Core | Throughput | Front end | Back end | Retiring | Bad spec | Mem stall | IPC | Br miss/kinst | L1d refill/kinst | L2 refill/kinst | L1i refill/kinst |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Jetson A78AE | 14507 steps/s | 31.0% | 21.5% | 43.2% | 4.3% | 2.2% | 2.48 | 1.78 | 5.22 | 4.57 | 7.22 |
| Spark A725 | 28662 steps/s | 10.1% | 22.0% | 61.0% | 6.9% | 0.7% | 3.01 | 1.38 | 5.42 | 0.38 | 6.53 |
| Spark X925 | 57240 steps/s | 12.2% | 36.5% | 45.7% | 5.6% | 0.4% | 4.37 | 0.91 | 3.64 | 0.12 | 6.38 |

**Policy inference (6x1024 MLP, CPU)**

| Core | Throughput | Front end | Back end | Retiring | Bad spec | Mem stall | IPC | Br miss/kinst | L1d refill/kinst | L2 refill/kinst | L1i refill/kinst |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Jetson A78AE | 390 infer/s | 9.0% | 63.9% | 26.8% | 0.3% | 62.3% | 0.93 | 0.36 | 34.23 | 41.82 | 1.41 |
| Spark A725 | 1404 infer/s | 22.8% | 21.6% | 54.8% | 0.8% | 22.8% | 2.96 | 0.40 | 65.05 | 65.21 | 0.69 |
| Spark X925 | 1968 infer/s | 4.5% | 67.0% | 28.0% | 0.5% | 22.4% | 3.07 | 0.38 | 13.52 | 62.37 | 0.62 |

**Camera render (MuJoCo offscreen 640x480)**

| Core | Throughput | Front end | Back end | Retiring | Bad spec | Mem stall | IPC | Br miss/kinst | L1d refill/kinst | L2 refill/kinst | L1i refill/kinst |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Jetson A78AE | 209 frames/s | 34.0% | 38.5% | 25.9% | 1.6% | 6.2% | 1.45 | 2.01 | 4.11 | 6.65 | 7.98 |
| Spark A725 | 937 frames/s | 19.1% | 42.1% | 35.0% | 3.8% | 6.3% | 1.73 | 1.92 | 11.90 | 12.33 | 14.46 |
| Spark X925 | 1191 frames/s | 8.2% | 69.2% | 21.6% | 0.9% | 3.4% | 2.11 | 0.19 | 5.77 | 6.30 | 7.91 |

## Slots-per-cycle self check

| Core | fma | chase_mem | wl_sim |
|---|---|---|---|
| Jetson A78AE | 6.000 | 6.000 | 6.000 |
| Spark A725 | 5.000 | 5.000 | 5.000 |
| Spark X925 | 10.000 | 10.000 | 10.000 |
