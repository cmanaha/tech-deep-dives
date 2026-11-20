# 07 The edge and the fleet: research register

## 1. Header

- **Research date:** 2026-11-20. Every URL in this file was accessed 2026-11-20.
- **Area:** stream 07 of the "Physical AI" dive. What runs on the robot (devices, latency budget from camera to motor, action chunking, real-time chunking, quantisation and per-device engines, off-board inference) and how a fleet is served (delivery, staged rollout, episode upload, how the loop closes).
- **Sections fed:** 17 "Running on the Robot", 18 "The Fleet".
- **Thread task:** an SO-101 robot arm picks up a block and places it in a cup.
- **Reader:** technical, level 100 to 200 (IT or software), no robotics background.
- **Quote policy:** quotes are verbatim from the pinned version, with house normalisation: curly quotes become straight quotes, typographic dashes become " - " or a hyphen, inline math is shown as plain text. Ellipses mark omissions.
- **Verdicts:** NEW (recorded fresh from the primary source); CARRIED (seed NN, re-fetched); STALE (superseded by a newer version); WRONG (seed said X, source says Y); UNKNOWN (unresolved, see the UNKNOWN register).
- **Labels:** `[vendor claim]` and `[author reported]` for performance figures printed by the party that built the thing; `[derived]` for arithmetic, with inputs shown; `[our reading]` for synthesis.
- **Seed:** "the seed research", file seed 04 (edge and sim-to-real; sections 1, 2, 3, 4.2, 4.3, 5, 6). A seed claim appears here only after its source was re-fetched.
- **Reused from earlier streams, not re-researched:** LeRobot v0.7.0 (2026-11-05, SHA `410c095eacc0011d998a73383eb94abed2715af0`) and its three inference backends (register 01, F01-40, F01-41); the control-rate ladder (register 01); real-time chunking as a pointer (register 02, F02-30, F02-31).

### Tiers

| Tier | What it covers |
|---|---|
| Tier 0 | Our experiments (none in this file) |
| Tier 1 | Source code at a pinned tag or 40-character SHA; official docs; API references; release notes on the vendor's own repository |
| Tier 2 | First-party vendor or lab blogs, announcements and talks |
| Tier 3 | Papers ("peer-reviewed (venue)" only where the venue was confirmed, otherwise "preprint"); third-party technical analysis |
| Tier 4 | Tutorials and press. Used only to locate primary sources |

Code over docs over blogs. Vendor and author performance numbers are claims, not measurements.

## 2. Currency table

Newest first-party version found on 2026-11-20, against what the seed research named.

| Item | Newest version found | Release date | Source | What the seed named |
|---|---|---|---|---|
| JetPack / Jetson Linux | JetPack 7.2.2 with Jetson Linux 39.2.2 (kernel 6.8, Ubuntu 24.04, CUDA 13.2.2, cuDNN 9.20.0), for Thor and the Orin family | 7.2.2 date not on the page (U8); JetPack 7.2 on 2026-06-01 | https://developer.nvidia.com/embedded/jetpack/downloads | JetPack 7 for Thor, JetPack 7.2 in one tutorial; JetPack 6 "in sustaining mode" for Orin |
| TensorRT | 11.5.0 (CUDA 13.5). On Jetson: 11.4.1 per the JetPack table, "10.16.2" per the same page's introduction (U9) | 2026-11-18 (GitHub release v11.5) | https://github.com/NVIDIA/TensorRT/releases/tag/v11.5 | a "10.x.x" docs URL |
| TensorRT Edge-LLM | v0.12.0 (adds GR00T N1.7 FP16 policy inference, pi0.5 engine builder) | 2026-11-13 | https://github.com/NVIDIA/TensorRT-Edge-LLM/releases/tag/v0.12.0 | "release/0.9.1-mlpinf" (September 2026 benchmark) |
| Jetson Thor modules | Shipping: T5000, T4000. Announced: T3000 and T2000, "available in Q1 2027" | announced 2026-07-15 | https://blogs.nvidia.com/blog/jetson-thor-robotics-edge-ai-agent/ | T4000 and T5000 only |
| Jetson Orin family | Unchanged hardware; AGX Orin 32GB gains Super Mode (241 TOPS) under JetPack 7.2 | 2026-06-01 | https://developer.nvidia.com/blog/deploy-agentic-ready-ai-at-the-edge-with-memory-efficiency-in-nvidia-jetpack-7-2/ | 200 TOPS for AGX Orin 32GB |
| Jetson list prices | As on the FAQ today (table in F07-42); no date on the table | accessed 2026-11-20 | https://developer.nvidia.com/embedded/faq | same figures, "list price on 2026-11-17", plus a July 2026 rise from press |
| DGX Spark | 128 GB, plus a 64 GB configuration through OEM partners; no price on the page | accessed 2026-11-20 | https://www.nvidia.com/en-us/products/workstations/dgx-spark/ | 128 GB with a 64 GB OEM option; prices from a forum post and press |
| Isaac-GR00T repository | Newest tagged release `n1.6.1-release` (2026-04-23); `n1.7-release` (2026-04-18); default branch head 708617f5 (2026-11-17) carries the N1.7 deployment tables | 2026-11-17 (head read) | https://github.com/NVIDIA/Isaac-GR00T | N1.7 "~28 Hz on Thor" |
| openpi repository | No tagged releases; default branch head 215abfb2 | 2026-08-24 | https://github.com/Physical-Intelligence/openpi | not versioned in the seed |
| LeRobot | v0.7.0 (reused from registers 01 and 02) | 2026-11-05 | https://github.com/huggingface/lerobot/releases/tag/v0.7.0 | docs at the moving default branch |
| Real-time chunking paper | arXiv 2506.07339v2, NeurIPS 2025 | v2 is the latest version | https://arxiv.org/abs/2506.07339v2 | v2 |
| Training-time RTC paper | arXiv 2512.05964v2 | v2 is the latest version | https://arxiv.org/abs/2512.05964v2 | unversioned |
| AWS IoT Greengrass nucleus | 2.18.4 | 2026-10-14 | https://github.com/aws-greengrass/aws-greengrass-nucleus/releases/tag/v2.18.4 | no version |
| AWS IoT Greengrass nucleus lite | v2.7.0 on GitHub; the AWS docs changelog reaches 2.5.1 | 2026-09-25 | https://github.com/aws-greengrass/aws-greengrass-lite/releases/tag/v2.7.0 | changelog to 2.5.0 |
| AWS IoT Greengrass V1 | End of support | 2026-10-07 | https://docs.aws.amazon.com/general/latest/gr/full_shutdown_services.html | same date |
| AWS RoboMaker | End of support; documentation removed (HTTP 404) | 2025-09-10 | https://docs.aws.amazon.com/general/latest/gr/full_shutdown_services.html | same date |

Checked and found no newer item: no Jetson device family newer than Thor was found on NVIDIA's Jetson pages on 2026-11-20 beyond the T3000 and T2000 modules. "Not found on the pages fetched" is the scope of that statement.

## 3. Pinned sources

### Papers

| arXiv ID and version | Title | Venue status | Entries |
|---|---|---|---|
| 2506.07339v2 | Real-Time Execution of Action Chunking Flow Policies | peer-reviewed (NeurIPS 2025, per the arXiv comments field) | F07-61 to F07-69 |
| 2512.05964v2 | Training-Time Action Conditioning for Efficient Real-Time Chunking | preprint | F07-70 to F07-72 |
| 2610.19656v3 | Accelerating VLA Inference with Perturbation Informed Execution | preprint | F07-73 to F07-75 |
| 2506.01844v1 | SmolVLA (asynchronous inference analysis only) | preprint | F07-116, F07-117 |
| 2609.16705v1 | The Robot Data Factory | preprint | F07-106, F07-107 |
| 2605.00416v4 | Learning While Deploying: Fleet-Scale Reinforcement Learning for Generalist Robot Policies | preprint | F07-108 to F07-110 |
| 2506.09937v2 | SAFE: Multitask Failure Detection for Vision-Language-Action Models | peer-reviewed (NeurIPS 2025, per the paper footer and arXiv comments) | F07-111 |

### Code

| Repository | Ref | 40-character SHA | Files read | Entries |
|---|---|---|---|---|
| huggingface/lerobot | tag v0.7.0 | `410c095eacc0011d998a73383eb94abed2715af0` | `docs/source/rtc.mdx`, `inference.mdx`, `remote_inference.mdx`, `hardware_guide.mdx`, `installation.mdx`, `il_robots.mdx`, `so101.mdx`, `_toctree.yml`; `src/lerobot/policies/rtc/configuration_rtc.py` | F07-12 to F07-29, F07-31 to F07-34, F07-112, F07-113, F07-118 |
| NVIDIA/Isaac-GR00T | default branch head, 2026-11-17 | `708617f5716c63fc0a327391492ea2b91977ae90` | `scripts/deployment/README.md`; repository tree listing | F07-1 to F07-11 |
| Physical-Intelligence/openpi | default branch head, 2026-08-24 | `215abfb217dbac7d5f1273282331b9b1866c0479` | `docs/remote_inference.md`, `packages/openpi-client/src/openpi_client/action_chunk_broker.py`, `README.md`; repository tree listing (177 files) | F07-30 |
| NVIDIA/TensorRT | tag v11.5 | `7fe18f085276e1e1dd1f872c5b6568143b31b57d` | release notes | F07-76 |
| NVIDIA/TensorRT-Edge-LLM | tag v0.12.0 | `513dcd18291e587c80928911a480761352f3c2d8` | `README.md`, release notes | F07-82, F07-83 |

### Docs

NVIDIA: Jetson Orin, Orin Nano Super Developer Kit, Jetson Thor and DGX Spark product pages; DGX Spark User Guide (hardware overview); Jetson FAQ; JetPack page and JetPack downloads page; TensorRT 11.5.0 release notes, support matrix, "Engine Compatibility" and "Working with Quantized Types"; Jetson AI Lab tutorials for openpi and GR00T N1.7 on Thor. AWS: Greengrass V2 developer guide (nucleus, nucleus lite, feature matrix, Docker components, stream manager), Greengrass V2 API reference (three pages), Greengrass quotas; AWS IoT jobs configuration guide and three API pages; AWS IoT Core quotas; Services in Full Shutdown; FleetWise availability change; Kinesis Video Streams edge agent and quotas; S3 multipart limits; Local Zones features. Full URLs are in the entries and in section 11. All accessed 2026-11-20.

Method note: NVIDIA and AWS pages were downloaded and converted to text locally, so quotes are from the page text. Tables on those pages arrive flattened (one cell per line); where a claim depends on which column a cell belongs to, the entry says so.

## 4. Claim register

Entries were written in the order the sources were read; the lettered headings group them by topic.

### A. Published policy latency on edge devices: GR00T N1.7 from the Isaac-GR00T repository

**F07-1. NVIDIA's Isaac-GR00T repository publishes one latency table for GR00T N1.7 across six devices. With the full TensorRT pipeline, one complete policy call takes a median 149.0 ms on Jetson Orin, 76.8 ms on AGX Thor, 116.6 ms on DGX Spark, 35.0 ms on an L40, 24.7 ms on an RTX Pro 6000 Blackwell and 22.9 ms on an H100. `[vendor claim]`**
- Location: `scripts/deployment/README.md`, "Performance", "Benchmark Results" table.
- Verdict: NEW (the seed carried only "~28 Hz on Jetson AGX Thor with TensorRT" from an earlier file; this table replaces it)
- Evidence: https://raw.githubusercontent.com/NVIDIA/Isaac-GR00T/708617f5716c63fc0a327391492ea2b91977ae90/scripts/deployment/README.md | Tier 1, first-party repository docs at a pinned SHA | benchmark claim (vendor reported) | "| Device | PyTorch eager | torch.compile | TensorRT full pipeline | TensorRT optimized + mixed NVFP4 | ... | H100 80GB HBM3 | 101.5 | 53.4 | 22.9 | - | / | RTX Pro 6000 Blackwell Server Edition (96 GB) | 75.7 | 52.1 | 24.7 | - | / | L40 | 123.7 | 66.8 | 35.0 | - | / | DGX Spark | 200.8 | 183.1 | 116.6 | - | / | AGX Thor (MAXN) | 106.8 | 100.5 | 76.8 | 35.6 | / | Jetson Orin (MAXN) | 357.9 | 224.3 | 149.0 | - |" (accessed 2026-11-20)
- Use in dive: section 17, the central latency table. The same 3-billion-parameter policy spans 22.9 ms to 357.9 ms depending on device and runtime: a factor of 15.6 `[derived: 357.9 / 22.9]`.

**F07-2. The table's conditions: the `nvidia/GR00T-N1.7-LIBERO` checkpoint (32 DiT blocks), batch size 1, action horizon 40, four denoising steps, two 256x256 camera inputs; timings include preprocessing and action decoding and exclude the network call.**
- Location: same file, paragraph above the table.
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/NVIDIA/Isaac-GR00T/708617f5716c63fc0a327391492ea2b91977ae90/scripts/deployment/README.md | Tier 1, first-party repository docs | benchmark claim (vendor reported) | "Median complete-policy-call latency for the `nvidia/GR00T-N1.7-LIBERO` `libero_10` checkpoint (32 DiT blocks): batch size 1, action horizon 40, four denoising steps, and two 256x256 camera inputs. Timings include preprocessing and action decoding, excluding RPC." (accessed 2026-11-20)
- Use in dive: section 17, the caption under the table. Two small cameras and four denoising steps: a three-camera 640x480 setup will be slower.

**F07-3. The table measures speed on fixed inputs, not whether the robot still succeeds: "they do not measure closed-loop task success". Each figure is the median of 60 timed calls, with Thor and Orin in MAXN power mode with `jetson_clocks` on.**
- Location: same file, "Measurement details".
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/NVIDIA/Isaac-GR00T/708617f5716c63fc0a327391492ea2b91977ae90/scripts/deployment/README.md | Tier 1, first-party repository docs | benchmark claim (vendor reported) | "Each backend uses three repetitions of 10 warmup calls and 20 timed calls; the reported median pools all 60 timed calls. PyTorch uses eight CPU threads and one interop thread. Thor and Orin use MAXN with `jetson_clocks` enabled. Results use fixed inputs and platform-specific runtimes; they do not measure closed-loop task success. TensorRT outputs were checked against PyTorch." (accessed 2026-11-20)
- Use in dive: section 17, the honesty note beside the table: median, maximum-power mode, no worst-case figure. A control loop cares about the worst call, which this table does not give (see U3).

**F07-4. On AGX Thor, quantising GR00T N1.7 to mixed NVFP4 with the "optimized" execution profile cuts the call from 76.8 ms to 35.6 ms, a factor of 2.16; from PyTorch eager (106.8 ms) the factor is 3.0. No other device has a quantised figure in the table. `[vendor claim]`**
- Location: same file, table row "AGX Thor (MAXN)" and section "Optional Thor quantization and execution optimization".
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/NVIDIA/Isaac-GR00T/708617f5716c63fc0a327391492ea2b91977ae90/scripts/deployment/README.md | Tier 1, first-party repository docs | benchmark claim (vendor reported) | "| AGX Thor (MAXN) | 106.8 | 100.5 | 76.8 | 35.6 |" and "adds `--execution-profile optimized` (cross-attention K/V caching, projection fusion, and CUDA graphs) and `--quantization fp8|mixed_nvfp4`. Baseline execution and unquantized BF16 remain the defaults." (accessed 2026-11-20)
- Use in dive: section 17, quantisation pays about 2x on Thor. `[derived: 76.8 / 35.6 = 2.16; 106.8 / 35.6 = 3.0]`. 35.6 ms is 28.1 calls per second `[derived: 1000 / 35.6]`, which matches the seed's "~28 Hz on Thor" and shows that figure was the quantised path.

**F07-5. On Jetson Orin the same policy needs 149.0 ms per call with TensorRT, 1.94 times Thor's 76.8 ms, and 357.9 ms in plain PyTorch. At a 30 Hz control rate, 149 ms is 4.5 control periods.**
- Location: same table, rows "Jetson Orin (MAXN)" and "AGX Thor (MAXN)".
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/NVIDIA/Isaac-GR00T/708617f5716c63fc0a327391492ea2b91977ae90/scripts/deployment/README.md | Tier 1, first-party repository docs | benchmark claim (vendor reported) | "| Jetson Orin (MAXN) | 357.9 | 224.3 | 149.0 | - |" (accessed 2026-11-20)
- Use in dive: section 17 worked example. `[derived: 149.0 / 76.8 = 1.94; 149.0 ms / 33.3 ms = 4.47 periods]`. The README does not say which Orin module "Jetson Orin" is (U1).

**F07-6. DGX Spark is slower than AGX Thor for this policy: 116.6 ms against 76.8 ms with TensorRT, and 200.8 ms against 106.8 ms in PyTorch eager. `[vendor claim]`**
- Location: same table, rows "DGX Spark" and "AGX Thor (MAXN)".
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/NVIDIA/Isaac-GR00T/708617f5716c63fc0a327391492ea2b91977ae90/scripts/deployment/README.md | Tier 1, first-party repository docs | benchmark claim (vendor reported) | "| DGX Spark | 200.8 | 183.1 | 116.6 | - |" (accessed 2026-11-20)
- Use in dive: section 17, a correction to an easy assumption: the desk-side box is not the faster inference device here. The README gives no reason; one stated difference is the software stack (F07-9). `[our reading]`

**F07-7. The full pipeline compiles seven model components into TensorRT engines (vision transformer, language model, a self-attention block, state encoder, action encoder, the 32-layer DiT action head, action decoder) and leaves only small glue operations in PyTorch. Compiling only the action head was the N1.6 default; for N1.7 the backbone "dominates inference time".**
- Location: same file, "TensorRT Acceleration" table and "DiT-only mode (legacy from N1.6)".
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/NVIDIA/Isaac-GR00T/708617f5716c63fc0a327391492ea2b91977ae90/scripts/deployment/README.md | Tier 1, first-party repository docs | documentation of support | "| ViT | **TRT** | Qwen3-VL Vision (24 blocks, FP32 for accuracy) | / | LLM | **TRT** | Qwen3-VL Text Model (16 layers, with deepstack injection) |" and "| DiT | **TRT** | AlternateVLDiT (32 layers) |" and "For N1.7, **full_pipeline is recommended** as it accelerates the backbone (ViT + LLM) which dominates inference time." (accessed 2026-11-20)
- Use in dive: section 17 mechanism: a VLA is not one engine but several, one per sub-network, and the vision-language backbone is where the time goes. Also: the vision encoder stays at FP32 "for accuracy", so "the model is FP8" never means every layer.

**F07-8. The build is a four-step pipeline run on the target device: export each component to ONNX, compile each ONNX file into an engine, verify outputs against PyTorch (expected cosine similarity 0.999 or higher), benchmark. The engine build takes about 2 to 5 minutes, and the README states "Engines are GPU-architecture-specific and must be rebuilt for different GPUs."**
- Location: same file, "Build TRT Engines" notes and "What each step does".
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/NVIDIA/Isaac-GR00T/708617f5716c63fc0a327391492ea2b91977ae90/scripts/deployment/README.md | Tier 1, first-party repository docs | documentation of support | "**Note:** Engine build takes ~2-5 minutes depending on GPU. Engines are GPU-architecture-specific and must be rebuilt for different GPUs." and "1. **Export to ONNX** (`export`) - Exports all model components ... to ONNX format under `<output-dir>/onnx/`. 2. **Build TensorRT Engines** (`build`) - Compiles each ONNX model into a GPU-specific TensorRT engine under `<output-dir>/engines/`. 3. **Verify Accuracy** (`verify`) - Runs PyTorch vs TRT output comparison. Expected: `Cosine Similarity: 0.999+` (PASS)." and "Build the TensorRT engines on the target device" (accessed 2026-11-20)
- Use in dive: section 17, "why an engine is built per device type", in the vendor's own repository words; and the build cost (minutes, on the robot's own computer). ONNX is the hand-off format between the trained checkpoint and the device.

**F07-9. In November 2026 the Isaac-GR00T deployment path puts Thor and Orin on the same software stack: JetPack 7.2, Jetson Linux 39.2, CUDA 13.2, Python 3.12, PyTorch 2.13.0. JetPack 6.x is "no longer supported" by this repository. DGX Spark uses CUDA 13.0 with PyTorch 2.10.0 and TensorRT pinned to 10.16.1.11.**
- Location: same file, "Platform-Specific Setup", "Jetson Thor Setup", "DGX Spark Setup", "Jetson Orin Setup".
- Verdict: NEW (the seed tied JetPack 7 to Thor only)
- Evidence: https://raw.githubusercontent.com/NVIDIA/Isaac-GR00T/708617f5716c63fc0a327391492ea2b91977ae90/scripts/deployment/README.md | Tier 1, first-party repository docs | documentation of support | "Orin uses JetPack 7.2 / Jetson Linux 39.2, CUDA 13.2, Python 3.12, and PyTorch 2.13.0 from the PyTorch cu132 index. JetPack 6.x / Jetson Linux R36 is no longer supported." and "Spark uses CUDA 13 and Python 3.12 like Thor, but requires a dedicated dependency stack and source-built `flash-attn` for `sm121`. TensorRT is pinned to 10.16.1.11 because 10.15.1 fails to compile the optimized Action Encoder at batch size 2." (accessed 2026-11-20)
- Use in dive: section 17 currency: JetPack 7.2 now covers Orin as well as Thor. The pinned TensorRT 10.16 on Spark shows the device stack trails the newest TensorRT release (F07-45, and the TensorRT entries in section I).

**F07-10. The one task-success check in the README is on an H100, one LIBERO task, 20 episodes: PyTorch 20 of 20, TensorRT full pipeline 19 of 20. It is an unquantised (BF16) engine; there is no success figure for the NVFP4 engine or for any Jetson. `[vendor claim]`**
- Location: same file, "Optional: LIBERO Closed-Loop Sim Evaluation".
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/NVIDIA/Isaac-GR00T/708617f5716c63fc0a327391492ea2b91977ae90/scripts/deployment/README.md | Tier 1, first-party repository docs | benchmark claim (vendor reported) | "Task: `KITCHEN_SCENE3_turn_on_the_stove_and_put_the_moka_pot_on_it`, 20 episodes: | PyTorch | 100% (20/20) | / | TRT (n17_full_pipeline) | 95% (19/20) | Difference is within simulation noise (p >> 0.05)." (accessed 2026-11-20)
- Use in dive: section 17, "what quantisation costs in task success": the vendor's evidence is 20 episodes on one task for the unquantised engine. Twenty episodes cannot separate 100% from 95%. See U4.

**F07-11. Running a GR00T container on a Jetson or Spark uses Docker with the NVIDIA runtime: `docker run ... --runtime nvidia --gpus all`.**
- Location: same file, "Shared Docker Workflow".
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/NVIDIA/Isaac-GR00T/708617f5716c63fc0a327391492ea2b91977ae90/scripts/deployment/README.md | Tier 1, first-party repository docs | documentation of support | "docker run -it --rm --runtime nvidia --gpus all \ --ipc=host \ --ulimit memlock=-1 \ --ulimit stack=67108864 \ --network host \" (accessed 2026-11-20)
- Use in dive: section 18, the command a fleet-delivery component would wrap to give a policy container the GPU (pairs with the Greengrass Docker entries in section G).

### B. Real-time chunking and the inference backends in LeRobot v0.7.0

**F07-12. LeRobot v0.7.0 documents real-time chunking (RTC) as the answer to one situation: a policy that emits chunks of future actions ("e.g., 50 steps at a time") and takes long enough per chunk that naive execution gives "pauses, jerky transitions, or sudden changes in strategy".**
- Location: `docs/source/rtc.mdx`, opening paragraphs.
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/rtc.mdx | Tier 1, first-party docs at tag v0.7.0 | definition | "These policies generate chunks of future actions (e.g., 50 steps at a time) instead of single actions. Because the models are large, producing each chunk takes longer than the time it takes the robot to execute it. Naively executing chunks leads to problems such as pauses, jerky transitions, or sudden changes in strategy whenever the next chunk arrives late or disagrees with the previously executed actions." and "RTC solves this by asynchronously generating the next chunk while the robot continues executing the current one, and by guiding the new chunk so it aligns smoothly with the portion of the previous chunk that has already been executed." (accessed 2026-11-20)
- Use in dive: section 17, the plain-words statement of the challenge. Note the doc's second sentence overstates: a chunk need not take longer than its whole execution for the issue to arise, only longer than one control period. `[our reading]`

**F07-13. RTC's mechanism in LeRobot's words: it "adds a guidance term to the flow-matching denoising process that forces the overlapping timesteps of the new chunk to stay close to the executed portion of the previous chunk, typically using a soft transition mask". The start of the new chunk is treated as an inpainting problem.**
- Location: `docs/source/rtc.mdx`, "How RTC Works (simplified)".
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/rtc.mdx | Tier 1, first-party docs | definition | "RTC treats the beginning of the new chunk like an inpainting or "fill-in-the-gaps" problem: it gently adjusts the first part of the new chunk so it blends naturally with the robot's ongoing motion." and "In technical terms, RTC adds a guidance term to the flow-matching denoising process that forces the overlapping timesteps of the new chunk to stay close to the executed portion of the previous chunk, typically using a soft transition mask." (accessed 2026-11-20)
- Use in dive: section 17 mechanism, first sentence. Pairs with the paper entries in section D for the formula.

**F07-14. `RTCConfig` at tag v0.7.0 has five tunable fields with these code defaults: `enabled = True`, `mode = "guided"`, `prefix_attention_schedule = LINEAR`, `max_guidance_weight = 10.0`, `execution_horizon = 10`.**
- Location: `src/lerobot/policies/rtc/configuration_rtc.py`, lines 57 to 80.
- Verdict: NEW (register 02, F02-31, quoted two of the five)
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/policies/rtc/configuration_rtc.py | Tier 1, code at tag v0.7.0 | code behaviour | "enabled: bool = True" / "mode: str = "guided"" / "# Todo change to exp / prefix_attention_schedule: RTCAttentionSchedule = RTCAttentionSchedule.LINEAR / max_guidance_weight: float = 10.0 / execution_horizon: int = 10" (accessed 2026-11-20)
- Use in dive: section 17 code block. The docs recommend the `EXP` schedule "for getting started" while the code default is `LINEAR` with a to-do comment: see the contradictions section.

**F07-15. What the parameters mean: `execution_horizon` is how many steps of the previous chunk the new one must stay consistent with ("Typical values: 8-12 steps"); `max_guidance_weight` is how hard that is enforced (10.0 is given as the value for 10-step flow matching); `inference_delay` is the model's latency counted in control steps, passed per call because it varies at run time.**
- Location: `docs/source/rtc.mdx`, "Key Parameters".
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/rtc.mdx | Tier 1, first-party docs | documentation of support | "**`execution_horizon`**: How many timesteps from the previous chunk to maintain consistency with. Higher values mean smoother transitions but potentially less reactivity. Typical values: 8-12 steps" and "For 10 steps flow matching (SmolVLA, Pi0, Pi0.5), a value of 10.0 is an optimal value." and "**`inference_delay`**: How many timesteps of inference latency your system has. This is passed to `predict_action_chunk()` rather than the config, since it may vary at runtime." (accessed 2026-11-20)
- Use in dive: section 17 worked example: latency in milliseconds becomes `inference_delay` in steps by dividing by the control period and rounding up.

**F07-16. The four prefix schedules say how strongly each overlapping step is pinned: `ZEROS` is binary (full weight up to `inference_delay`, then none), `ONES` is full weight across the whole `execution_horizon`, `LINEAR` and `EXP` decay from the delay to the horizon.**
- Location: `docs/source/rtc.mdx`, "Key Parameters", `prefix_attention_schedule`.
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/rtc.mdx | Tier 1, first-party docs | documentation of support | "- `LINEAR`: Linear decay from inference_delay to execution_horizon / - `EXP`: Exponential decay (recommended for getting started) / - `ONES`: Full weight across entire execution_horizon / - `ZEROS`: Binary (full weight up to inference_delay, then zero)" (accessed 2026-11-20)
- Use in dive: section 17 diagram: a strip of 50 action slots, the first `inference_delay` slots frozen at weight 1, a decaying band up to `execution_horizon`, the rest free.

**F07-17. LeRobot v0.7.0 has two RTC modes. `guided` (the default) applies the original guidance at inference time and works with ordinary flow-matching checkpoints. `trained` hard-inpaints the prefix, needs a pi0.5 checkpoint trained with `policy.rtc_training_max_delay > 0`, and "avoids the guidance backward pass".**
- Location: `docs/source/rtc.mdx`, "Key Parameters", `mode`.
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/rtc.mdx | Tier 1, first-party docs | documentation of support | "- `guided` (default) applies the original Jacobian guidance during denoising and works with ordinary flow-matching checkpoints. / - `trained` hard-inpaints the previous chunk's prefix with per-action flow timesteps. It currently requires a Pi05 checkpoint trained with `policy.rtc_training_max_delay > 0` and avoids the guidance backward pass." (accessed 2026-11-20)
- Use in dive: section 17: the two variants map to the two papers (section D). Guided costs extra compute per call (a backward pass through the model); trained moves that cost into training.

**F07-18. Trained-mode RTC is admitted only when `rtc_training_max_delay <= execution_horizon <= prediction_steps - rtc_training_max_delay`, and the code raises an error otherwise. The docs add that this "is not a latency guarantee".**
- Location: `src/lerobot/policies/rtc/configuration_rtc.py`, `validate_trained_rtc_horizon`, lines 29 to 54; `docs/source/rtc.mdx`, "Key Parameters".
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/policies/rtc/configuration_rtc.py | Tier 1, code at tag v0.7.0 | code behaviour | "if execution_horizon < training_max_delay: raise ValueError(f"Trained RTC execution_horizon ({execution_horizon}) must be at least the checkpoint's maximum conditioned delay rtc_training_max_delay ({training_max_delay}).")" and docs: "The admission rule is not a latency guarantee or a claim that larger capacities must fail at runtime; measured overlap, remaining actions and freshness checks still determine whether a returned chunk can execute." (accessed 2026-11-20)
- Use in dive: section 17, practical: a checkpoint trained for delays up to d steps cannot be deployed on a device whose latency exceeds d steps. The latency budget becomes a training setting.

**F07-19. The real-robot RTC command in the docs is an SO-100 follower with two 640x480, 30 fps cameras, started with `lerobot-rollout --strategy.type=base --inference.type=rtc`, on `--device=cuda`.**
- Location: `docs/source/rtc.mdx`, "Testing RTC with a Real Robot".
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/rtc.mdx | Tier 1, first-party docs | documentation of support | "lerobot-rollout \ --strategy.type=base \ --policy.path=${HF_USERNAME}/policy_repo_id \ --inference.type=rtc \ --inference.rtc.mode=guided \ --inference.rtc.execution_horizon=10 \ --inference.rtc.max_guidance_weight=10.0 \ --robot.type=so100_follower \ ... --robot.cameras="{ gripper: {type: opencv, index_or_path: 1, width: 640, height: 480, fps: 30}, front: {type: opencv, index_or_path: 0, width: 640, height: 480, fps: 30}}"" (accessed 2026-11-20)
- Use in dive: sections 17 and 9 of the task list: the concrete command for the arm task (swap `so100_follower` for `so101_follower`, per register 01).

**F07-20. Local RTC runs the policy in a background thread of the same process, with no network transport. When the action buffer runs empty, a supported robot holds its last applied target for `action_starvation_grace_s` (default 1 second); after that, or on an unsupported robot, the run faults. "Unlike the former local RTC path, exhaustion is no longer an indefinitely skipped tick."**
- Location: `docs/source/inference.mdx`, "Real-Time Chunking (`--inference.type=rtc`)".
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/inference.mdx | Tier 1, first-party docs | code behaviour (as documented) | "Local RTC runs in a background thread in the rollout process, without transport." and "With support, an empty buffer can retain the last applied target for `action_starvation_grace_s` (default 1 second), including the time needed to drain old inference and predict from a fresh capture. After motion has started, zero grace or an unsupported robot faults immediately on exhaustion; startup has its own deadline. Unlike the former local RTC path, exhaustion is no longer an indefinitely skipped tick." (accessed 2026-11-20)
- Use in dive: section 17, what happens when the model is too slow even for chunking: the arm holds position for up to one second, then stops with a fault. A safe state, stated.

**F07-21. Local RTC's default time budgets: an observation may be at most 5 s old by the time its actions execute, one action request may be outstanding for 10 s, and startup may take 120 s. The docs call these "starting values, not measured hardware guarantees".**
- Location: `docs/source/inference.mdx`, table under "Local RTC exposes these additional budgets".
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/inference.mdx | Tier 1, first-party docs | documentation of support | "| `max_observation_age_s` | `5 s` | Maximum source age through action execution | / | `action_timeout_s` | `10 s` | Outstanding action request | / | `startup_timeout_s` | `120 s` | Initial preparation and fresh-action startup |" and "These are starting values, not measured hardware guarantees. RTC must retain enough **post-trim playback** for another inference and timing margin." (accessed 2026-11-20)
- Use in dive: section 17, the defaults are loose (seconds), so the tool will not stop a deployment whose latency is merely bad; the reader must measure.

**F07-22. The rule that no setting can fix: after the steps consumed during inference are trimmed off, the remaining playback must still cover the next inference. The docs' example: "If inference takes 1 second out of a 1.67-second prediction, only about 0.67 seconds remain. Another 1-second request cannot fit; no refill value fixes that."**
- Location: `docs/source/remote_inference.mdx`, "Tuning" (paragraph after the refill table).
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/remote_inference.mdx | Tier 1, first-party docs | definition | "For alignment and RTC, check **usable playback after trimming**, not the nominal chunk length. If inference takes 1 second out of a 1.67-second prediction, only about 0.67 seconds remain. Another 1-second request cannot fit; no refill value fixes that. Reduce turnaround, use a longer supported horizon, or validate a different action frequency." (accessed 2026-11-20)
- Use in dive: section 17, the feasibility inequality: chunk duration minus latency must exceed latency, so latency must be under half the chunk duration. `[derived: H x dt - L >= L, so L <= H x dt / 2]`. 1.67 s is 50 actions at 30 Hz `[derived: 50 / 30 = 1.667 s]`.

**F07-23. LeRobot's rollout prints where each control tick's time went. The documented example at 30 Hz: observe (cameras) 3.13 ms mean, observation processing 0.50 ms, inference 5.18 ms, send (motor write) 0.40 ms, record 0.67 ms, against a 33.3 ms cycle budget. These are the doc's illustrative figures, with no hardware named.**
- Location: `docs/source/inference.mdx`, "Cadence Reporting".
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/inference.mdx | Tier 1, first-party docs | documentation of support (example output, hardware unstated) | "observe mean 3.13 ms · worst 9.00 ms · 31.7% of work · 2400 calls / process_obs mean 0.50 ms · worst 1.00 ms · 5.1% of work · 2400 calls / infer mean 5.18 ms · worst 40.00 ms · 52.4% of work · 2400 calls / send mean 0.40 ms · worst 0.40 ms · 4.1% of work · 2400 calls / record mean 0.67 ms · worst 620.00 ms · 6.8% of work · 2402 calls" and "cycles over the 33.3 ms work budget: 12/1197 (1.0%) - work mean 18.7 ms, worst 48.1 ms" (accessed 2026-11-20)
- Use in dive: section 17, the camera-to-motor chain as LeRobot itself names its stages: observe, process_obs, infer, send, record. The example's stage figures are a doc sample, not a benchmark; label them as such. The 620 ms "record" outlier is the blocking episode save, a real jitter source to name.

**F07-24. How to read that report, per the docs: "A high `infer` share points at the policy or the device; a high `observe` share points at the cameras", and "pacing headroom near zero means there is nothing left to absorb a slow tick".**
- Location: `docs/source/inference.mdx`, "Cadence Reporting", paragraph after the example.
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/inference.mdx | Tier 1, first-party docs | documentation of support | "Read it top-down: **effective cadence** is what you got against `--fps`, **cycles over budget** is how often the loop could not hold it, the **step breakdown** says where the time went, and **pacing headroom** near zero means there is nothing left to absorb a slow tick. A high `infer` share points at the policy or the device; a high `observe` share points at the cameras." (accessed 2026-11-20)
- Use in dive: section 17, the reader's next action: run a rollout and read this block before buying a bigger computer.

### C. Off-board inference: LeRobot remote inference at v0.7.0 and openpi

**F07-25. LeRobot v0.7.0 remote inference moves the checkpoint to a policy server and leaves cameras, motors and recording on the robot computer; "the remote client does not load weights". The transport is Zenoh (supported range `>=1.9.0,<1.11.0`), not gRPC.**
- Location: `docs/source/remote_inference.mdx`, "Start from a working rollout" and "1. Install on both computers".
- Verdict: CARRIED (seed 04 section 2.2 guessed "gRPC per the code layout; NOT VERIFIED"; re-fetched at v0.7.0)
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/remote_inference.mdx | Tier 1, first-party docs | documentation of support | "The checkpoint and model device move to the server; the remote client does not load weights." and "The supported Zenoh range is `>=1.9.0,<1.11.0`; `uv sync --locked` installs the lockfile version, currently 1.10.1." and "Query/reply handles discovery, admission and control; pub/sub carries inference data; liveliness tracks presence." (accessed 2026-11-20)
- Use in dive: section 17, off-board option. Zenoh is a publish/subscribe network protocol; here it carries observations one way and action chunks back.

**F07-26. The client decides when to ask for the next chunk with `refill_seconds` (default 0.5 s of remaining playback), but never later than the measured latency allows: "Effective refill is `max(refill_seconds, recent maximum turnaround + 1 / fps)`", where turnaround "includes encoding, network, queueing, inference and decoding".**
- Location: `docs/source/remote_inference.mdx`, "Parameters that matter".
- Verdict: NEW (replaces the seed's `chunk_size_threshold` 0.5 to 0.6, which is not in v0.7.0)
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/remote_inference.mdx | Tier 1, first-party docs | code behaviour (as documented) | "| `refill_seconds` | `0.5` seconds of remaining playback | Higher usually requests earlier; lower allows more of the plan to execute. A measured latency floor can override it. |" and "Effective refill is `max(refill_seconds, recent maximum turnaround + 1 / fps)`. Turnaround includes encoding, network, queueing, inference and decoding. The first accepted request supplies an initial estimate; later estimates use up to 100 steady-state samples." (accessed 2026-11-20)
- Use in dive: section 17 formula for the worked example. Symbols: `refill_seconds` is the configured threshold in seconds of actions left in the buffer; turnaround is the measured round trip; `fps` is the policy action rate. At 30 Hz with a 149 ms turnaround the floor is 0.149 + 0.033 = 0.182 s, below 0.5 s, so the default applies `[derived]`.

**F07-27. Three ways to join a new chunk to the old one in remote mode: append (keep the old slice, start the new one after it), aligned (drop the incoming steps whose time has already passed and replace only the future; the default), and RTC when the checkpoint supports it. Blending is off by default.**
- Location: `docs/source/remote_inference.mdx`, modes table.
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/remote_inference.mdx | Tier 1, first-party docs | documentation of support | "| Append | `mode=chunk`, `chunk_merge=append` | Preserve the full accepted execution slice; useful as a baseline, but the next chunk can begin from an older observation. | / | Alignment | `mode=chunk`, `chunk_merge=aligned` (the `auto` default) | Remove incoming steps already passed and replace only the future, reducing backward bumps between independent chunks. |" and "| RTC | `mode=rtc_guided` or `rtc_trained` | Use when the checkpoint supports RTC: inference itself conditions on the remaining trajectory. |" and "Plain chunks default to alignment with blending disabled." (accessed 2026-11-20)
- Use in dive: section 17, the ladder of asynchronous execution from simplest to RTC. "Aligned" is the non-learning version of the same idea: throw away the stale head of the new chunk.

**F07-28. Camera frames travel uncompressed by default ("Raw RGB is lossless and the default"); JPEG at quality 90 is an option. When the link is congested, observations are dropped and motor commands are not blocked.**
- Location: `docs/source/remote_inference.mdx`, "Independent deployments, bandwidth and connection loss".
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/remote_inference.mdx | Tier 1, first-party docs | documentation of support | "Raw RGB is lossless and the default. Try `--inference.encoding=jpeg --inference.jpeg_quality=90` to reduce image bandwidth, then compare turnaround and task quality." and "Observation congestion drops data rather than blocking motor dispatch." (accessed 2026-11-20)
- Use in dive: section 17 network arithmetic: one raw 640x480 RGB frame is 921,600 bytes `[derived: 640 x 480 x 3]`; a request carrying two such frames is about 1.8 MB before any compression.

**F07-29. LeRobot states the limits of what it has tested for remote inference: operating through a router, a private hosted GPU or a Hugging Face Space "has not been validated yet", and bare TCP "does not authenticate peers". ACT, SmolVLA, XVLA, EVO1 and LaWAM checkpoints have run on real robots through this path.**
- Location: `docs/source/remote_inference.mdx`, "Supported policies and robots" and the router section.
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/remote_inference.mdx | Tier 1, first-party docs | documentation of support | "ACT, SmolVLA, XVLA, EVO1 and LaWAM checkpoints have run on real robots through this path." and "Operating a robot through a router, a private hosted GPU or a Hugging Face Space has not been validated yet. Measure full turnaround and interruption behavior before operating a robot through a new topology; a working transport alone does not establish a usable motion budget." and "Binding a specific interface limits exposure but does not authenticate peers." (accessed 2026-11-20)
- Use in dive: section 17, scope hedge for "run the policy in the cloud": the documented, validated case is a GPU on the same lab network. A cloud GPU is untested by the project. LeRobot publishes no latency tolerance figure for remote inference (U6).

**F07-30. openpi (Physical Intelligence's open repository) serves policies over a WebSocket on port 8000 for off-robot GPUs. Its client-side `ActionChunkBroker` is plain synchronous chunking: "A new inference call to the inner policy is only made when the current list of chunks is exhausted." No real-time chunking code was located in the repository at the pinned SHA.**
- Location: `docs/remote_inference.md`; `packages/openpi-client/src/openpi_client/action_chunk_broker.py`; repository tree (177 files) searched for "rtc", "real_time", "chunk".
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/Physical-Intelligence/openpi/215abfb217dbac7d5f1273282331b9b1866c0479/packages/openpi-client/src/openpi_client/action_chunk_broker.py | Tier 1, code at a pinned SHA (head of the default branch, committed 2026-08-24) | code behaviour | "Wraps a policy to return action chunks one-at-a-time. Assumes that the first dimension of all action fields is the chunk size. A new inference call to the inner policy is only made when the current list of chunks is exhausted." and README: "the model can run on a different server and stream actions to the robot via a websocket connection" (accessed 2026-11-20)
- Use in dive: section 17: the lab that invented RTC has not released it in openpi; the open implementation to point readers at is LeRobot's. "Not located in the tree at this SHA" is the scope of the claim. The RTC docs page links a separate reference repository, `Physical-Intelligence/real-time-chunking-kinetix` (simulation benchmark; not read here).

### D. The SO-101 minimal deployment

**F07-31. The minimal deployment of a trained policy on the arm is one command on the computer the arm is plugged into: `lerobot-rollout --strategy.type=base` with the policy path, the robot type, the USB serial port and the camera description. The default backend is synchronous: one policy call per control tick, the loop blocks until the action is computed.**
- Location: `docs/source/inference.mdx`, "Base (`--strategy.type=base`)" and "Sync (default)".
- Verdict: NEW (register 01, F01-40, has the backend list; this entry is the deployment command)
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/inference.mdx | Tier 1, first-party docs | documentation of support | "lerobot-rollout \ --strategy.type=base \ --policy.path=${HF_USER}/my_policy \ --robot.type=so100_follower \ --robot.port=/dev/ttyACM0 \ --robot.cameras="{ front: {type: opencv, index_or_path: 0, width: 640, height: 480, fps: 30}}" \ --task="Put lego brick into the box" \ --duration=60" and "One policy call per control tick. The main loop blocks until the action is computed. Works with all policies. No extra flags needed." (accessed 2026-11-20)
- Use in dive: section 17, the "smallest thing that works" box: laptop, USB cable to the servo bus, USB camera, one process. Default `--fps` is 30 (same doc, flags table: "Policy inference and dataset recording frequency | 30").

**F07-32. LeRobot lets the same checkpoint run on CPU, CUDA or Apple MPS with `--device`, and warns: "Check that CPU inference can meet your required control rate before deploying on a robot."**
- Location: `docs/source/inference.mdx`, "Choosing a device"; flags table.
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/inference.mdx | Tier 1, first-party docs | documentation of support | "For example, add `--device=cpu` to the command above to run a CUDA-trained checkpoint on a CPU-only host, if the policy supports CPU execution. Check that CPU inference can meet your required control rate before deploying on a robot." and "| `--device` | Torch device (`cpu`, `cuda`, `mps`) | auto |" (accessed 2026-11-20)
- Use in dive: section 17: no stated minimum GPU for inference. LeRobot's hardware guide is titled for training only (F07-33).

**F07-33. LeRobot's "Compute Hardware Guide" sizes training, not inference: ACT-class policies peak at about 2 to 6 GB of GPU memory at batch 8 ("Laptop GPU (RTX 3060), L4, A10G"), SmolVLA about 10 to 16 GB, pi0-class about 24 to 40 GB. It states no inference requirement and no per-chunk latency for any policy. `[vendor claim, labelled "indicative" by the source]`**
- Location: `docs/source/hardware_guide.mdx`, "Memory by policy group".
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/hardware_guide.mdx | Tier 1, first-party docs | benchmark claim (vendor reported, indicative) | "| Light BC | `act`, `vqbet`, `tdmpc` | ~2-6GB | Laptop GPU (RTX 3060), L4, A10G | / | Diffusion | `diffusion`, `multi_task_dit` | ~8-14GB | RTX 4070+ / L4 / A10G | / | Small VLA | `smolvla` | ~10-16GB | RTX 4080+ / L4 / A10G | / | Large VLA | `pi0`, `pi0_fast`, `pi05`, `xvla`, `wall_x` | ~24-40GB | A100 40 GB+ (24 GB tight at BS 1) |" and "The numbers below are **indicative** - order-of-magnitude figures for picking hardware, not exact predictions." (accessed 2026-11-20)
- Use in dive: section 17, the laptop-GPU entry the task asked for: the only first-party statement is for training, where an RTX 3060-class laptop GPU is named as enough for ACT. Inference needs less memory than training, so the same laptop runs ACT inference `[our reading]`. SmolVLA and ACT per-chunk latency: not published by LeRobot (U5).

**F07-34. On a Jetson, LeRobot's install notes say video decoding "runs on CPU by default", and the Jetson Dockerfile it points to targets JetPack 6.2 and is "community-maintained".**
- Location: `docs/source/installation.mdx`, note under the TorchCodec step.
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/installation.mdx | Tier 1, first-party docs | documentation of support | "**Jetson (aarch64 + CUDA):** video decoding runs on CPU by default. `docker/Dockerfile.jetson` builds `torch`/`torchcodec` from source with CUDA support for JetPack 6.2 - community-maintained" (accessed 2026-11-20)
- Use in dive: section 17, practical: LeRobot on Jetson is a community path pinned to JetPack 6.2, while NVIDIA's GR00T path has moved to JetPack 7.2 (F07-9). A reader with an Orin Nano must pick which stack to flash. Video decode matters for training data, not for live inference from a USB camera `[our reading]`.

### E. The devices at their state on 2026-11-20 (NVIDIA first-party pages)

All AI-performance figures in this group are NVIDIA's own marketing units (TOPS, sparse INT8; TFLOPS, sparse FP4) and are `[vendor claim]`. They are theoretical peak arithmetic rates and say nothing direct about a policy's latency; section A is the measured-latency evidence.

**F07-35. The Jetson Orin family on NVIDIA's product page: AGX Orin 64GB is 275 TOPS, a 2048-core Ampere GPU with 64 Tensor Cores, a 12-core Arm Cortex-A78AE CPU, 64 GB LPDDR5 at 204.8 GB/s, 15 W to 60 W. Orin NX 16GB is 157 TOPS with 16 GB at 102.4 GB/s; Orin NX 8GB is 117 TOPS; both list power modes 10 W, 15 W, 25 W, 40 W. `[vendor claim]`**
- Location: Jetson Orin product page, "View Jetson Orin Technical Specifications" table, rows AI Performance, GPU, CPU, Memory, Power.
- Verdict: CARRIED (seed 04 section 1.1, re-fetched)
- Evidence: https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-orin/ | Tier 1, first-party product specification | benchmark claim (vendor reported) and documentation | "AI Performance / 275 TOPS / 248 TOPs / 241 TOPS / 157 TOPS / 117 TOPS / 67 TOPS / 67 TOPS / 34 TOPS" and "2048-core NVIDIA Ampere architecture GPU with 64 Tensor Cores" and "12-core Arm Cortex-A78AE v8.2 64-bit CPU" and "64GB 256-bit LPDDR5 / 204.8GB/s" and "Power / 15W - 60W / 15W-75W / 15W - 60W / 10W - 15W - 25W - 40W / 10W - 15W - 25W - 40W / 7W - 15W - 25W / 7W - 15W - 25W / 7W - 10W - 25W" (accessed 2026-11-20)
- Use in dive: section 17 device table. The page text was read from the flattened HTML table; the column order is AGX Orin developer kit and 64GB, Industrial, 32GB, NX 16GB, NX 8GB, Nano Super developer kit, Nano 8GB, Nano 4GB `[our reading of the column mapping]`.

**F07-36. The Jetson Orin Nano Super Developer Kit (the Orin Nano 8GB module on a carrier board) is 67 INT8 TOPS, 8 GB LPDDR5 at 102 GB/s, 7 W to 25 W; the "Super" figures came from a software update ("Up from 40 TOPS", "Up from 68 GB/s"). `[vendor claim]`**
- Location: Jetson Orin Nano Super Developer Kit page, key-figure strip and specification block.
- Verdict: CARRIED (seed 04 section 1.1, re-fetched)
- Evidence: https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-orin/nano-super-developer-kit/ | Tier 1, first-party product specification | benchmark claim (vendor reported) | "67 INT8 TOPS" and "8GB 128-bit LPDDR5 / 102 GB/s" and "7W-25W" and "1 Up from 40 TOPS. | 2 Up from 68 GB/s." and "NVIDIA's latest software update enhances Jetson Orin Nano's AI performance from 40 to 67 AI TOPs and memory bandwidth from 68 to 102 GB/s" (accessed 2026-11-20)
- Use in dive: section 17, the cheapest NVIDIA device a reader would pair with an SO-101. Its 8 GB is one pool shared by the CPU and the GPU (see F07-47 for the word "unified"), so an 8 GB device does not give a policy 8 GB of GPU memory.

**F07-37. The Orin Nano has no hardware video encoder: the specification table's encode cell reads "1080p30 supported by 1-2 CPU cores". It does have hardware decode (the last decode cell lists up to "11x 1080p30 (H.265)"). AGX Orin 64GB encodes up to "16x 1080p30 (H.265)" in hardware.**
- Location: Jetson Orin product page, specification table, rows "Video Encode" and "Video Decode".
- Verdict: NEW
- Evidence: https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-orin/ | Tier 1, first-party product specification | documentation of support | "Video Encode / 2x 4K60 (H.265) / 4x 4K30 (H.265) / 8x 1080p60 (H.265) / 16x 1080p30 (H.265) / ... / 1080p30 supported by 1-2 CPU cores" and "Video Decode / ... / 1x 4K60 (H.265) / 2x 4K30 (H.265) / 5x 1080p60 (H.265) / 11x 1080p30 (H.265)" (accessed 2026-11-20)
- Use in dive: sections 17 and 18, "which part of the machine each workload loads": recording episodes as video on an Orin Nano spends CPU cores on encoding, the same cores the control loop runs on. The mapping of the last cell to the Orin Nano columns is `[our reading]` of the flattened table.

**F07-38. Jetson AGX Orin 32GB is now listed at 241 TOPS in the page's top table, up from 200: JetPack 7.2 added a "Super Mode" that raises its GPU clock from 930 MHz to 1.3 GHz and its power ceiling to 60 W. `[vendor claim]`**
- Location: JetPack 7.2 blog (2026-06-01), section on Super Mode; Orin product page AI Performance row.
- Verdict: STALE (seed 04 section 1.1 gave AGX Orin 32GB as "200" sparse INT8 TOPS; superseded by JetPack 7.2 Super Mode)
- Evidence: https://developer.nvidia.com/blog/deploy-agentic-ready-ai-at-the-edge-with-memory-efficiency-in-nvidia-jetpack-7-2/ | Tier 2, first-party blog | benchmark claim (vendor reported) | "By increasing GPU frequencies from 930 MHz to 1.3 GHz and enabling higher power envelopes up to 60W, Super Mode boosts AI performance from 200 TOPS to 241 TOPS, a more than 20% increase over the standard AGX Orin 32 GB configuration." (accessed 2026-11-20)
- Use in dive: section 17 device table and a teaching point: on these devices the "performance" number is a power-mode setting, changed by a software release. The same Orin page still shows "200 SPARSE INT8 TOPS" in its lower table (see contradictions).

**F07-39. Jetson Thor today has two shipping modules. T5000: 2070 TFLOPS (FP4, sparse), a 2560-core Blackwell GPU, a 14-core Arm Neoverse-V3AE CPU, 128 GB LPDDR5X at 273 GB/s, 40 W to 130 W. T4000: 1200 TFLOPS, a 1536-core Blackwell GPU, a 12-core Neoverse-V3AE CPU, 64 GB LPDDR5X at 273 GB/s, 40 W to 70 W. The AGX Thor Developer Kit carries the T5000. `[vendor claim]`**
- Location: Jetson Thor product page, "Specifications" table, columns Jetson AGX Thor Developer Kit, Jetson T5000, Jetson T4000.
- Verdict: CARRIED (seed 04 section 1.1, re-fetched)
- Evidence: https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-thor/ | Tier 1, first-party product specification | benchmark claim (vendor reported) and documentation | "2070 TFLOPS (FP4-Sparse) / 1200 TFLOPS (FP4-Sparse)" and "2560-core NVIDIA Blackwell architecture GPU with fifth-gen Tensor Cores / Multi-Instance GPU (MIG) with 10 TPCs / 1536-core NVIDIA Blackwell architecture GPU with fifth-gen Tensor Cores / Multi-Instance GPU (MIG) with six TPCs" and "14-core Arm Neoverse-V3AE 64-bit CPU" / "12-core Arm Neoverse-V3AE 64-bit CPU" and "128 GB 256-bit LPDDR5X / 273 GB/s / 64 GB 256-bit LPDDR5X / 273 GB/s" and "Power / 40 W-130 W / 40 W-130 W / 40 W-70 W" (accessed 2026-11-20)
- Use in dive: section 17 device table. The Thor units are FP4 TFLOPS and the Orin units are INT8 TOPS, so the two columns cannot be divided into each other; NVIDIA's own comparison is "7.5x the performance and 3.5x the energy efficiency" of AGX Orin (same page, `[vendor claim]`), against a measured 1.94x on GR00T N1.7 (F07-5).

**F07-40. Thor's video row on the product page lists encoder and decoder counts, not stream counts: "2X NVENCODE" for the T5000 and "1X NVENCODE" for the T4000, and the decode row repeats the same text.**
- Location: Jetson Thor product page, "Specifications", rows "Video Encode" and "Video Decode".
- Verdict: NEW
- Evidence: https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-thor/ | Tier 1, first-party product specification | documentation of support | "Video Encode / 2X NVENCODE / 1X NVENCODE / Video Decode / 2X NVENCODE / 1X NVENCODE" (accessed 2026-11-20)
- Use in dive: section 17 device table, with a hedge: the decode row reading "NVENCODE" looks like a page error. Stream counts per resolution for Thor were not located on this page (U2).

**F07-41. Two smaller Thor modules were announced on July 15, 2026 and are not shipping yet. T3000: 865 FP4 TFLOPS, an eight-core Neoverse CPU, 32 GB LPDDR5X at 273 GB/s. T2000: 400 FP4 TFLOPS and 16 GB. Both "are scheduled to become available in Q1 2027". `[vendor claim]`**
- Location: NVIDIA blog "NVIDIA Introduces New Jetson Thor Computers to Advance Mainstream Robotics and Edge AI", July 15, 2026.
- Verdict: NEW (not in the seed)
- Evidence: https://blogs.nvidia.com/blog/jetson-thor-robotics-edge-ai-agent/ | Tier 2, first-party blog | announcement; benchmark claim (vendor reported) | "the Jetson and IGX T3000 modules, which delivers 865 FP4 teraflops of AI compute in a compact form factor roughly half the size and power of the T5000. Jetson T3000 combines an NVIDIA Blackwell GPU, an eight-core Neoverse Arm CPU, 32GB of LPDDR5X memory and 273GB/s of memory bandwidth, along with 25 GbE connectivity." and "With 400 FP4 teraflops of compute and 16GB of memory" and "The Jetson T3000 and T2000 modules are scheduled to become available in Q1 2027." (accessed 2026-11-20)
- Use in dive: section 17, "what is newer than the table": the Thor line is growing downward toward Orin's price class, and the post gives the reason in passing, "Migrating to T3000 helps reduce costs amid high memory prices". Prices for T3000 and T2000 are not in the post.

**F07-42. NVIDIA's Jetson FAQ lists these suggested prices on 2026-11-20: AGX Thor Developer Kit $5499; T5000 module $4999 (1KU+); T4000 $2999 (1KU+); AGX Orin Developer Kit $3499; AGX Orin 64GB $2999 (1KU+); AGX Orin 32GB $1799 (1KU+); Orin NX 16GB $999 (1KU+); Orin NX 8GB $649 (1KU+); Orin Nano Super Developer Kit $399; Orin Nano 8GB $399 (1KU+); Orin Nano 4GB $349 (1KU+).**
- Location: Jetson FAQ, "What is the price of Jetson products?" table (Product, MSRP (USD)).
- Verdict: CARRIED (seed 04 section 1.1, re-fetched; every seed "list price on 2026-11-17" figure matches)
- Evidence: https://developer.nvidia.com/embedded/faq | Tier 1, first-party FAQ | documentation (price list) | "Here is a summary of volume suggested pricing at 1KU+." and "Jetson AGX Thor Developer Kit / $5499 / Jetson T5000 Module / $4999 (1KU+) / Jetson T4000 Module / $2999 (1KU+) / Jetson AGX Orin Developer Kit / $3499 / Jetson AGX Orin 64GB Module / $2999 (1KU+) / Jetson AGX Orin Industrial / $3199 (1KU+) / Jetson AGX Orin 32GB Module / $1799 (1KU+) / Jetson Orin NX 16GB Module / $999 (1KU+) / Jetson Orin NX 8GB Module / $649 (1KU+) / Jetson Orin Nano Super Developer Kit / $399 / Jetson Orin Nano 8GB / $399 (1KU+) / Jetson Orin Nano 4GB / $349 (1KU+)" (accessed 2026-11-20)
- Use in dive: section 17 device table, price column, dated "as listed 2026-11-20". The FAQ table carries no date and no earlier prices.

**F07-43. That Jetson prices rose in July 2026, and by how much, cannot be shown from NVIDIA's own pages: the FAQ lists only today's prices. The seed's "33 to 101%" and its launch prices ($249 for the Orin Nano Super kit, $3,499 for the AGX Thor kit) came from press.**
- Location: Jetson FAQ, price table (no date, no history).
- Verdict: UNKNOWN (U7)
- Evidence: https://developer.nvidia.com/embedded/faq | Tier 1, first-party FAQ | documentation (absence) | the table has two columns, "Product" and "MSRP (USD)", and no revision date; the Orin Nano Super page still says "an unprecedented boost in performance at an amazing new price" without stating one (accessed 2026-11-20)
- Use in dive: section 17: state current prices with their date; do not state a percentage rise. If the rise is wanted, it needs an archived copy of the same FAQ page as the earlier first-party source.

**F07-44. The current JetPack is 7.2.2 with Jetson Linux 39.2.2, Linux kernel 6.8 and Ubuntu 24.04, and it supports both families: the AGX Thor Developer Kit, T5000, T4000 and the "Jetson Orin Family". It ships CUDA 13.2.2 and cuDNN 9.20.0.**
- Location: JetPack downloads page, title, "Supported Hardware" list and "Supported Libraries and SDK versions" table.
- Verdict: STALE (seed 04 section 1.1 said JetPack 7 "supports Jetson Thor" and "JetPack 6 is in sustaining mode" for Orin; JetPack 7.2 extended the 7 line to Orin on 2026-06-01)
- Evidence: https://developer.nvidia.com/embedded/jetpack/downloads | Tier 1, first-party release page | documentation of support | "JetPack 7.2.2 with Jetson Linux 39.2.2" and "Jetson AGX Thor Developer Kit / Jetson T5000 / Jetson T4000 / Jetson Orin Family" and "Jetson Linux / 39.2.2 / Kernel / k6.8 / Distro / L4T Ubuntu 24.04" and "NVIDIA CUDA / 13.2.2 / NVIDIA CuDNN / 9.20.0" and "NOTE: To use JetPack 7.2.2, download the JetPack 7.2.1 image below and apt-update your system" (accessed 2026-11-20)
- Use in dive: section 17 currency line. The page carries no release date for 7.2.2 (U8); JetPack 7.2 itself is dated 2026-06-01 by its blog post, which says it "extends the Ubuntu 24.04, kernel 6.8 and CUDA Toolkit 13.0 -based compute stack (introduced with Jetson Thor) to the Jetson Orin family".

**F07-45. The JetPack 7.2.2 page states two different TensorRT versions: its introduction says "TensorRT 10.16.2" and its version table says "11.4.1".**
- Location: JetPack downloads page, introduction sentence and "AI Compute" rows of the version table.
- Verdict: UNKNOWN (which is installed; U9)
- Evidence: https://developer.nvidia.com/embedded/jetpack/downloads | Tier 1, first-party release page | documentation (self-contradicting) | "Access release notes, packages, and resources for NVIDIA JetPack 7.2.2 with Jetson Linux 39.2.2, CUDA 13.2.2, TensorRT 10.16.2, and Jetson Agentic AI resources" and, in the table, "NVIDIA TensorRT / 11.4.1" (accessed 2026-11-20)
- Use in dive: section 17: do not print a TensorRT version for Jetson without checking on a device (`dpkg -l | grep tensorrt`). Supporting evidence for the 10.16 line: the Isaac-GR00T README pins "10.16.1.11" on DGX Spark (F07-9).

**F07-46. JetPack 7.2 lets Thor's GPU be split into two isolated instances (MIG, Multi-Instance GPU: a hardware partition of one GPU into parts with their own compute, cache and memory bandwidth), so a latency-critical policy and a best-effort model do not slow each other.**
- Location: JetPack 7.2 blog, section on MIG.
- Verdict: CARRIED (seed 04 section 1.1 MIG note, re-fetched; the seed's "6 TPCs / 10 TPCs" is the hardware, the software exposes two partitions)
- Evidence: https://developer.nvidia.com/blog/deploy-agentic-ready-ai-at-the-edge-with-memory-efficiency-in-nvidia-jetpack-7-2/ | Tier 2, first-party blog (2026-06-01) | documentation of support | "JetPack 7.2 on Jetson Thor introduces support for MIG, allowing the integrated NVIDIA Blackwell GPU to be partitioned into two isolated GPU instances with dedicated compute, cache, and memory bandwidth." and "developers can dedicate GPU resources to latency-sensitive robotics workloads while running best-effort AI inference or generative AI models on a separate partition" (accessed 2026-11-20)
- Use in dive: section 17, one sentence on jitter: the worst-case latency of a policy depends on what else shares the GPU, and Thor has a hardware answer that Orin lacks.

**F07-47. DGX Spark: a 20-core Arm CPU (10 Cortex-X925 plus 10 Cortex-A725), a Blackwell GPU with 6,144 CUDA cores, "128 GB LPDDR5x unified system memory" at 273 GB/s, one hardware video encoder and one decoder, a 240 W power supply with a 140 W chip power budget, and "up to 1 PFLOP (petaFLOP) at FP4 precision with sparsity". `[vendor claim]`**
- Location: DGX Spark User Guide, "Hardware Overview", "System Overview" and specification lists.
- Verdict: CARRIED (seed 04 section 1.1, re-fetched from the user guide)
- Evidence: https://docs.nvidia.com/dgx/dgx-spark/hardware.html | Tier 1, first-party docs | documentation; benchmark claim (vendor reported) | "20-core Arm processor (10 Cortex-X925 + 10 Cortex-A725)" and "128 GB LPDDR5x unified system memory, 256-bit interface, 4266 MHz, 273 GB/s bandwidth" and "1x NVENC, 1x NVDEC" and "AI Compute : Up to 1,000 TOPS (trillion operations per second) inference and up to 1 PFLOP (petaFLOP) at FP4 precision with sparsity / CUDA Cores : 6,144" and "Power Supply : 240W external power supply (included) / GB10 SOC Thermal Design Power (TDP) is 140W" (accessed 2026-11-20)
- Use in dive: section 17 device table, the desk-side row. "Unified" is the word to explain: the CPU and GPU address the same physical memory, so a model's weights are not copied between a system pool and a GPU pool, and the GPU can use nearly all of it.

**F07-48. DGX Spark's current price was not found on an NVIDIA page: the product page shows "Buy Now" with no figure, and it now also lists a 64 GB configuration "available exclusively through participating OEM partners".**
- Location: DGX Spark product page, overview and memory-configuration table.
- Verdict: UNKNOWN (U10; the seed's $3,999, $4,699 and $6,950 were from a forum post title and press)
- Evidence: https://www.nvidia.com/en-us/products/workstations/dgx-spark/ | Tier 1, first-party product page | documentation (absence) | "Available in 64 GB* or 128 GB memory configuration options." and "*64 GB memory configuration is available exclusively through participating OEM partners." (accessed 2026-11-20; the NVIDIA marketplace page did not load)
- Use in dive: section 17 device table: price cell "not stated on NVIDIA's page on 2026-11-20".

**F07-49. NVIDIA's Jetson FAQ still says JetPack 7 "will support Jetson Orin series 2026" and that "JetPack 6 is in sustaining mode", while the JetPack page says JetPack 7 gives "full support for the NVIDIA Jetson Orin and Thor platform". The FAQ sentence predates JetPack 7.2.**
- Location: Jetson FAQ, "What version of JetPack should I use?"; JetPack page, "JetPack 7 Overview".
- Verdict: NEW
- Evidence: https://developer.nvidia.com/embedded/jetpack | Tier 1, first-party product page | documentation of support | "JetPack 7 gives you full support for the NVIDIA Jetson Orin and Thor platform, preemptable real-time kernel, Multi-Instance GPU (MIG), and integrated Holoscan Sensor Bridge. Built on Linux Kernel 6.8 and Ubuntu 24.04 LTS"; FAQ (https://developer.nvidia.com/embedded/faq): "JetPack 7 supports Jetson Thor with Linux 24.04 LTS, Kernel 6.8 our latest compute stack and libraries. It will support Jetson Orin series 2026 / JetPack 6 is in sustaining mode." (accessed 2026-11-20)
- Use in dive: section 17, practical: an Orin owner in November 2026 can run JetPack 7.2.x; guides written for JetPack 6 (including LeRobot's Jetson Dockerfile, F07-34) are one major version behind. Also worth one phrase: JetPack 7 ships a preemptible real-time kernel, the operating-system half of holding a control period.

**F07-50. Jetson modules have a stated operating lifetime of 5 years (10 years for the industrial variants), which bounds how long a fleet's on-robot computer is supported.**
- Location: Jetson FAQ, "What is the operating lifetime for Jetson products?".
- Verdict: CARRIED (seed 04 section 1.1 lifecycle note, re-fetched)
- Evidence: https://developer.nvidia.com/embedded/faq | Tier 1, first-party FAQ | documentation | "All Jetson modules (except those listed below) / Tegra K1 Soc / 5 Years / Jetson AGX Xavier Industrial / Jetson AGX Orin Industrial / Jetson TX2i module / Tegra K1 Industrial SoC / 10 Years" (accessed 2026-11-20)
- Use in dive: section 18, one line in the fleet planning notes.

### F. Published policy latency on Thor from the Jetson AI Lab tutorials

**F07-51. NVIDIA's Jetson AI Lab tutorial for pi0.5 on AGX Thor (JetPack 7.2, MAXN, the `pi05_libero` checkpoint, action horizon 10) reports about 132 ms per call in PyTorch BF16, about 54 ms with a TensorRT FP8 engine (2.4x) and about 49 ms with FP8 plus NVFP4 (about 2.7x). `[vendor claim]`**
- Location: "OpenPi on Thor" tutorial, "Performance" table; step 8 and step 11 expected output.
- Verdict: CARRIED (seed 04 section 1.2, re-fetched; figures match)
- Evidence: https://www.jetson-ai-lab.com/tutorials/openpi_on_thor/ | Tier 2, first-party tutorial site | benchmark claim (vendor reported) | "Benchmarked on Jetson AGX Thor Developer Kit (JetPack 7.2, MAXN power mode), pi05_libero, action horizon 10: | Inference Backend | Total Latency (ms) | Model Latency (ms) | Speedup | PyTorch BF16 | ~132 | ~128 | 1.0x | TensorRT FP8 | ~54 | ~53 | 2.4x | TensorRT FP8 + NVFP4 | ~49 | ~48 | ~2.7x |" and "Total inference time: 48.84 +/- 0.16 ms" (accessed 2026-11-20)
- Use in dive: section 17 latency table, second policy. Action horizon 10 here against 40 in the GR00T table and 50 in pi0.5's default: the three figures are not like for like.

**F07-52. The tutorial validates the quantised pi0.5 engine by output similarity only: an overall cosine similarity of 0.9946 against PyTorch for FP8 plus NVFP4 (minimum 0.9883 over the action steps), and about 0.9995 for FP8 alone. It reports no task success rate. `[vendor claim]`**
- Location: same tutorial, step 9 precision table and step 12 expected comparison output.
- Verdict: CARRIED (seed 04 section 1.2, re-fetched)
- Evidence: https://www.jetson-ai-lab.com/tutorials/openpi_on_thor/ | Tier 2, first-party tutorial site | benchmark claim (vendor reported) | "FP8 | ~53 ms | Most stable accuracy (cosine ~ 0.9995)" and "FP8 + NVFP4 | ~48 ms | Fastest; accuracy typically ~ 0.99, see Step 12" and "Cosine Similarity: - Overall: 0.99456406 - Per-timestep Mean: 0.99467865 - Per-timestep Min: 0.98825477" and "Cosine similarity ~ 0.99 confirms the TRT engine faithfully reproduces PyTorch behavior" (accessed 2026-11-20; the source prints the approximately-equal sign, shown here as "~")
- Use in dive: section 17, "what quantisation costs": the evidence is how close the output vectors are, which is a proxy. Cosine similarity is the cosine of the angle between the two action vectors; 1.0 means same direction. A 0.99 match per call says nothing by itself about errors that compound over a closed loop.

**F07-53. FP16 is not usable for pi0.5: the tutorial says the model "uses BF16 natively (8-bit exponent)" and that FP16's 5-bit exponent overflows in the attention layers, an error that "compounds over the denoising loop".**
- Location: same tutorial, note under the step 9 precision table.
- Verdict: NEW
- Evidence: https://www.jetson-ai-lab.com/tutorials/openpi_on_thor/ | Tier 2, first-party tutorial site | code behaviour (as documented) | "Note: Pure FP16 ( --precision fp16 ) is not supported. The Pi0.5 model uses BF16 natively (8-bit exponent). FP16 has a much smaller dynamic range (5-bit exponent), causing overflow in the Gemma attention layers that compounds over the denoising loop." (accessed 2026-11-20)
- Use in dive: section 17 precision-format primer: BF16 and FP16 are both 16 bits wide but split them differently (BF16 keeps the 8-bit exponent of FP32 and gives up mantissa bits; FP16 has a 5-bit exponent and more mantissa). "Half precision" is not one thing.

**F07-54. The hand-off chain in the tutorial is "JAX Checkpoint -> PyTorch -> ONNX (FP8 + NVFP4) -> TensorRT Engine -> Inference": quantisation is applied at ONNX export with NVIDIA ModelOpt using calibration data, and the engine is then compiled on the Thor with `trtexec`. The model weights are "~6 GB+".**
- Location: same tutorial, "Pipeline Overview", "Prerequisites", steps 9 and 10.
- Verdict: NEW
- Evidence: https://www.jetson-ai-lab.com/tutorials/openpi_on_thor/ | Tier 2, first-party tutorial site | documentation of support | "JAX Checkpoint --> PyTorch --> ONNX (FP8 + NVFP4) --> TensorRT Engine --> Inference" and "Export with FP8/NVFP4 quantization via NVIDIA ModelOpt" and "Calibration data is loaded (from the dataset) for FP8 quantization / LLM layers are quantized to NVFP4 precision and converted to 2DQ format" and "Compile the ONNX model into a TensorRT engine using trtexec" and "NVMe SSD recommended (model weights are ~6 GB+)" (accessed 2026-11-20; arrows normalised)
- Use in dive: section 17 mechanism diagram (checkpoint, ONNX file with quantise and dequantise nodes, engine). Section 18: a 6 GB artifact is the thing a fleet has to deliver, which exceeds one Greengrass limit (section G).

**F07-55. The tutorial pins openpi to commit `15a9616` (2026-06-16) and adds its own deployment scripts, because "Upstream OpenPi does not include the Jetson Thor deployment scripts or the TensorRT export patches".**
- Location: same tutorial, step 2.
- Verdict: NEW
- Evidence: https://www.jetson-ai-lab.com/tutorials/openpi_on_thor/ | Tier 2, first-party tutorial site | documentation of support | "Note: Pinned to commit 15a9616 ( update output objects to support batching , 2026-06-16). The full FP8 + NVFP4 pipeline in this tutorial has been validated end-to-end on this commit." and "Upstream OpenPi does not include the Jetson Thor deployment scripts or the TensorRT export patches." (accessed 2026-11-20)
- Use in dive: section 17, practical: the 49 ms figure belongs to a patched fork at a pinned commit, not to a stock install.

**F07-56. The matching tutorial for GR00T N1.7 on Thor reports about 126 ms in PyTorch eager (backbone 47.7 ms, action head 68.2 ms), about 44 ms with optimised FP8 (backbone 14.1 ms, action head 21.1 ms) and about 40 ms with mixed NVFP4 (13.6 ms and 17.2 ms), with one camera. Its headline is "from 125 ms down to 39.9 ms, a 3.1x speedup at 25 Hz". `[vendor claim]`**
- Location: "GR00T N1.7 on Thor" tutorial, headline and "Performance" table.
- Verdict: NEW
- Evidence: https://www.jetson-ai-lab.com/tutorials/groot_n17_on_thor/ | Tier 2, first-party tutorial site | benchmark claim (vendor reported) | "Benchmarked on Jetson AGX Thor Developer Kit (JetPack 7.2, MAXN power mode), GR00T-N1.7-LIBERO/libero_10, 4 denoising steps, 1 camera, batch size 1. Latencies are medians over 20 iterations after 5 warmup iterations." and "PyTorch Eager | 47.7 ms | 68.2 ms | ~126 ms | 8.0 Hz" and "TensorRT optimized + FP8 | 14.1 ms | 21.1 ms | ~44 ms | 22.6 Hz" and "TensorRT optimized + mixed NVFP4 | 13.6 ms | 17.2 ms | ~40 ms | 25.1 Hz" (accessed 2026-11-20)
- Use in dive: section 17: where the time goes inside one call (backbone versus action head) and what each optimisation attacks. The repository table (F07-1) gives 35.6 ms with two cameras and the tutorial about 40 ms with one: two first-party figures for the same configuration that differ (see contradictions).

**F07-57. Two separate mechanisms produce the Thor speedup. Quantisation shrinks the backbone (27 ms to 13.6 ms). A precision-independent graph restructuring (caching the cross-attention keys and values across denoising steps, fusing projections, CUDA graphs) shrinks the action head (45 ms to 17.2 ms).**
- Location: same tutorial, "How the Optimization Works".
- Verdict: NEW
- Evidence: https://www.jetson-ai-lab.com/tutorials/groot_n17_on_thor/ | Tier 2, first-party tutorial site | code behaviour (as documented); benchmark claim (vendor reported) | "Even under the NVFP4 policy, accuracy-sensitive layers stay at higher precision: the LLM o_proj and down_proj, and the DiT attention, remain FP8. FP8 and NVFP4 are both Q/DQ recipes layered over an FP16 graph, so the TensorRT network boundary stays FP16 in either case. This is what shrinks the backbone from 27 ms to 13.6 ms." and "This is a graph-restructuring pass, independent of precision, and it is where the action head goes from 45 ms to 17.2 ms" (accessed 2026-11-20)
- Use in dive: section 17 mechanism: the action head runs once per denoising step (four times here), so anything that does not change between steps (the vision-language features it attends to) can be computed once. That is caching, not quantisation, and it gave the larger saving: 27.8 ms against 13.4 ms `[derived: 45 - 17.2; 27 - 13.6]`.

**F07-58. NVFP4 is, in NVIDIA's words, "a 4-bit floating-point format with per-block scaling", supported natively by Thor's Blackwell GPU; the tutorial says this is what allows 4-bit quantisation "without the accuracy collapse you would get from 4-bit integer formats". Calibration uses 10 samples of real robot data. `[vendor claim]`**
- Location: same tutorial, "Why Jetson AGX Thor?" and "Pipeline Overview" table.
- Verdict: NEW
- Evidence: https://www.jetson-ai-lab.com/tutorials/groot_n17_on_thor/ | Tier 2, first-party tutorial site | definition; documentation of support | "Thor's Blackwell GPU has native NVFP4 support, a 4-bit floating-point format with per-block scaling, which is what makes the aggressive quantization in this tutorial possible without the accuracy collapse you would get from 4-bit integer formats." and "2. Calibrate | ModelOpt inserts Q/DQ nodes using 10 samples of real robot data" (accessed 2026-11-20)
- Use in dive: section 17 precision primer. Calibration: run a few real observations through the model to record the range of values each layer produces, so each layer's 4-bit or 8-bit grid can be scaled to fit. This is why the build needs data from the target robot. The repository table has no quantised row for Orin (F07-1); what Orin's older GPU generation supports is addressed in F07-83 and U13.

**F07-59. The tutorial asserts that the quantised GR00T engine keeps task success ("with no measurable loss in task success", "closed-loop task success is on par with the PyTorch baseline") and prints no success rate, episode count or task list to support it.**
- Location: same tutorial, headline paragraph and the sentence after the "Performance" table.
- Verdict: NEW
- Evidence: https://www.jetson-ai-lab.com/tutorials/groot_n17_on_thor/ | Tier 2, first-party tutorial site | benchmark claim (vendor reported, unquantified) | "taking end-to-end inference from 125 ms down to 39.9 ms, a 3.1x speedup at 25 Hz, with no measurable loss in task success" and "Accuracy holds across all three TensorRT configurations, and it holds where it matters most: closed-loop task success is on par with the PyTorch baseline." (accessed 2026-11-20; the page text was searched for a percentage or an episode count and none was found)
- Use in dive: section 17, hedge: "NVIDIA states task success is unchanged and publishes no figure". Preserve that scope. This and F07-10 are the whole first-party record on quantisation and success located in this research (U4).

**F07-60. The same software release moved the numbers: the tutorial notes JetPack 7.2 "is roughly 13% faster than JetPack 7.1 across every unoptimized configuration".**
- Location: same tutorial, note under the "Performance" table.
- Verdict: NEW
- Evidence: https://www.jetson-ai-lab.com/tutorials/groot_n17_on_thor/ | Tier 2, first-party tutorial site | benchmark claim (vendor reported) | "Note: these numbers are measured on JetPack 7.2, which is roughly 13% faster than JetPack 7.1 across every unoptimized configuration, so the speedup over the bf16 TensorRT baseline is 2.04x here rather than the 2.41x quoted against a JetPack 7.1 baseline." (accessed 2026-11-20)
- Use in dive: section 18: an operating-system update is a performance change, so it goes through the same staged rollout as a policy update.

### G. Real-time chunking: the paper (arXiv 2506.07339v2, NeurIPS 2025) and the training-time variant (arXiv 2512.05964v2)

Symbols used in this group, as the paper defines them: H is the prediction horizon (actions per chunk); dt is the controller sampling period; delta is the time the policy takes to produce one chunk; d = floor(delta / dt) is the inference delay in control steps; s is the execution horizon (how many actions of a chunk run before the next chunk takes over).

**F07-61. The paper's latest version is v2 and its arXiv comments field reads "published in NeurIPS 2025". Register 01 left the venue unconfirmed (F01-80); the listing confirms it.**
- Location: arXiv listing for 2506.07339, version history and comments field.
- Verdict: CARRIED (seed 04 section 2.3, re-fetched)
- Evidence: https://arxiv.org/abs/2506.07339v2 | Tier 3, peer-reviewed (NeurIPS 2025, per the arXiv comments field) | documentation | "Comments: published in NeurIPS 2025" (accessed 2026-11-20)
- Use in dive: section 17 citation line; closes the venue question raised in registers 01 and 02.

**F07-62. The paper defines the two ways to run a chunking policy. Synchronous: start inference when the current chunk's executed part ends, and wait; when the model is slower than one control period this "introduces visible pauses between chunks" and changes the robot's dynamics from what it was trained on. Asynchronous: start inference early, while executing.**
- Location: section 2 (background), paragraphs on synchronous and asynchronous inference.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2506.07339v2 | Tier 3, peer-reviewed (NeurIPS 2025) | definition | "Naive synchronous inference, the default in many prior works ..., simply starts inference at the end of the execution horizon and waits while the policy generates the next chunk. When delta > Delta-t, this introduces visible pauses between chunks that not only slow down execution but also change the dynamics of the robot, introducing distribution shift between training and evaluation. To develop a real-time strategy, we must first introduce asynchronous inference, where inference is started early and happens concurrently with execution." (accessed 2026-11-20; Greek symbols spelled out)
- Use in dive: section 17, the two-row timing diagram (synchronous with gaps, asynchronous without). LeRobot's default backend is the synchronous one (F07-31).

**F07-63. The inference delay is counted in control steps: d = floor(delta / dt). To run s actions per chunk, an asynchronous controller must start inference d steps before the hand-over, and an action is always available as long as d <= H - s.**
- Location: section 2, definition of d and the real-time constraint.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2506.07339v2 | Tier 3, peer-reviewed (NeurIPS 2025) | definition | "We define d := floor(delta / Delta-t) and call this quantity the inference delay, corresponding to number of controller timesteps between when o_t is received and when A_t is available. ... If A_0 is currently executing, and we desire an execution horizon of s, then an asynchronous algorithm must start inference at s - d. So long as d <= H - s, then this strategy will satisfy the real-time constraint and guarantee that an action is always available when it is needed." (accessed 2026-11-20; math shown as plain text)
- Use in dive: section 17 formula, with every symbol defined above. Worked example input: delta = 149 ms, dt = 33.3 ms gives d = floor(4.47) = 4.

**F07-64. Asynchrony alone is not enough: the new chunk was computed from an observation d steps old and may choose a different way to do the task, so the hand-over from old chunk to new can be "arbitrarily discontinuous and out-of-distribution", a jerk that gets worse with higher delay.**
- Location: section 2, last paragraph; Figure 2 caption.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2506.07339v2 | Tier 3, peer-reviewed (NeurIPS 2025) | definition | "since the policy cannot know what will happen between steps s - d and s while generating A_{s-d}, the transition point between a_{s-1|0} and a_{s|s-d} may be arbitrarily discontinuous and out-of-distribution. Similar to a too-short execution horizon, this strategy leads to jerky behavior that is worsened dramatically with higher delays" and Figure 2: "The original chunk that was executing ... had planned to go above the obstacle while the newly generated chunk ... goes below the obstacle." (accessed 2026-11-20)
- Use in dive: section 17, the challenge RTC meets, with the paper's own picture: old plan goes over the obstacle, new plan goes under, and the arm is asked to jump between them.

**F07-65. RTC's idea: treat the first d actions of the new chunk as frozen (they will have been executed from the old chunk before the new one arrives), and generate the rest so that it is consistent with them, "much like inpainting a section of an image that has been removed". The paper's Figure 3 example: with d = 4, actions a0 to a3 are frozen at full weight, a4 to a10 are guided with decreasing weight, and the last s = 5 are freshly generated.**
- Location: section 3 opening; Figure 3 caption.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2506.07339v2 | Tier 3, peer-reviewed (NeurIPS 2025) | definition | "Our key insight is to pose real-time chunking as an inpainting problem." and "If inference starts after the execution of a_{-1} and the inference delay is d = 4, then the newly generated chunk will not be available until after a_3 is consumed. Therefore, a_{0:3} are "frozen" and are attended to with a full guidance weight of 1. In the intermediate region, a_{4:10}, actions from the previous chunk are available but may be updated, since inference will have finished before a_4 is needed. This region is attended to with an exponentially decreasing guidance weight. Finally, the last s = 5 actions are beyond the end of the previous chunk, and need to be freshly generated. The execution horizon, s, is a hyperparameter constrained by d <= s <= H - d." (accessed 2026-11-20)
- Use in dive: section 17, the central diagram and the constraint d <= s <= H - d. The three regions (frozen, guided, free) map to LeRobot's `inference_delay`, `execution_horizon` and the remainder (F07-15, F07-16).

**F07-66. The soft mask: weight 1 for the first d actions, weight 0 for the last s actions (which have no counterpart in the old chunk), and an exponential decay from 1 to 0 in between, because "actions further in the future should be treated with more uncertainty". Freezing only the first d actions (a hard mask) lets the new chunk still switch strategy when d is small.**
- Location: section 3.2 "Soft Masking for Improved Cross-Chunk Continuity", equation 5.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2506.07339v2 | Tier 3, peer-reviewed (NeurIPS 2025) | definition | "naively inpainting using only the first d timesteps of the previous action chunk is often insufficient to ensure that the new chunk takes a consistent strategy, particularly when d is small" and "The first d actions get a weight of 1; the last s actions of the new chunk do not overlap with the previous chunk, so they get a weight of 0; the actions in between get weights that exponentially decay from 1 to 0, accounting for the fact that actions further in the future should be treated with more uncertainty." (accessed 2026-11-20)
- Use in dive: section 17 formula block: W_i = 1 for i < d; W_i = c_i (e^{c_i} - 1)/(e - 1) for d <= i < H - s, with c_i = (H - s - i)/(H - s - d + 1); W_i = 0 for i >= H - s (equation 5, transcribed from the PDF; check against the rendered paper before printing). This is the `EXP` schedule of F07-16.

**F07-67. The guidance costs compute: each denoising step needs a backward pass through the model, so on an RTX 4090 pi0.5 goes from 76 ms to 97 ms per call (denoising from 14 ms to 35 ms for five steps; image encoders 18 ms and language-model prefill 44 ms are unchanged). "RTC incurs a 2.5x latency increase per denoising step." `[author reported]`**
- Location: appendix A.3, Tables 1 and 3.
- Verdict: CARRIED (seed 04 section 2.3 gave 76 ms and 97 ms; re-fetched, and the component split is new)
- Evidence: https://arxiv.org/abs/2506.07339v2 | Tier 3, peer-reviewed (NeurIPS 2025) | benchmark claim (author reported) | "Image encoders (SigLIP) 18ms 18ms / LLM prefill (Gemma 2B) 44ms 44ms / Denoising step (x5) 14ms 35ms / Total 76ms 97ms" and "Measurements are taken from a single profiling trace for each method, run on an RTX 4090 GPU. RTC incurs a 2.5x latency increase per denoising step." and "RTC slows down inference due to backpropagating through each denoising step" (accessed 2026-11-20)
- Use in dive: section 17 compute cost: inference-time RTC makes the model 28% slower `[derived: 97 / 76 = 1.28]` to make its slowness harmless. Also the anatomy of one VLA call: 18 + 44 = 62 ms (82% of 76 ms) is spent before any action is denoised `[derived]`.

**F07-68. The paper gives a measured end-to-end latency chain for a real robot with an off-board GPU on a wired LAN. Desktop robot computer: model 97.43 ms, network 6.89 ms, image resize 1.44 ms, other 3.00 ms, total 108.76 ms. Small on-robot computer (Intel NUC): model 96.89 ms, network 21.20 ms, image resize 11.22 ms, other 9.67 ms, total 138.98 ms. `[author reported]`**
- Location: appendix A.3, Table 2.
- Verdict: NEW (the seed's open question "PI's latency table for mobile vs static robots ... cut off in extraction" is closed here)
- Evidence: https://arxiv.org/abs/2506.07339v2 | Tier 3, peer-reviewed (NeurIPS 2025) | benchmark claim (author reported) | "Component / Time (mobile) / Time (non-mobile) / Model 96.89 +/- 0.16ms 97.43 +/- 0.28ms / Network 21.20 +/- 3.12ms 6.89 +/- 2.39ms / Image resize 11.22 +/- 5.00ms 1.44 +/- 0.27ms / Other 9.67 +/- 3.20ms 3.00 +/- 0.68ms / Total 138.98 +/- 6.71ms 108.76 +/- 2.34ms" and "The image resizing component happens on the CPU of the robot computer. In the mobile manipulation case, this computer is an Intel NUC portable computer with a 12th Gen Intel i7-1260P processor. ... the robot computer and the inference workstation are both connected to the same LAN via a wired Ethernet connection, and communication happens via the WebSocket protocol. ... Measurements are taken from 50 inference calls during a real episode rollout" (accessed 2026-11-20)
- Use in dive: section 17, the best first-party latency budget found: model, network, preprocessing and "other" as separate lines, with spreads. Two lessons: the weak on-robot CPU cost 10 ms more for image resizing alone, and the model's time barely varies (0.2 ms) while the network's does (2 to 3 ms). Camera exposure and motor-bus time are not in this table (U11).

**F07-69. Test conditions and result on real robots: pi0.5 with H = 50 and dt = 20 ms (a 50 Hz robot), five denoising steps, a starting delay of about d = 6, then +100 ms and +200 ms of injected latency (d about 11 and 16); six two-armed tasks, 480 episodes, 28 hours of robot time. RTC showed "no degradation" with injected delay, synchronous inference "degrades linearly", and temporal ensembling could not run at +100 ms or +200 ms because its oscillations tripped the robot's protective stop. `[author reported]`**
- Location: section 4.2 "Real-World Results", setup and results paragraphs; Figure 6 caption.
- Verdict: CARRIED (seed 04 section 2.3, re-fetched)
- Evidence: https://arxiv.org/abs/2506.07339v2 | Tier 3, peer-reviewed (NeurIPS 2025) | benchmark claim (author reported) | "We use pi0.5 (H = 50, Delta-t = 20ms) with n = 5 denoising steps, giving a model latency of 76ms for the baselines and 97ms for RTC. We use remote inference over LAN, which adds 10-20ms of latency, giving a starting inference delay around d ~ 6 for RTC. ... +100ms and +200ms of injected latency, corresponding to d ~ 11 and d ~ 16, respectively." and "trials for a total of 480 episodes, adding up to 28 hours of pure robot execution time" and "RTC is completely robust to injected delay, showing no degradation, whereas synchronous degrades linearly and both TE variants do not run at all due to causing such high oscillations that the robot's protective stop is triggered" (accessed 2026-11-20)
- Use in dive: section 17, the strongest number for the section: a 50-action chunk tolerated a total delay of about 300 ms (d = 16 of 50 steps) with no loss. `[derived: 16 x 20 ms = 320 ms]`. The abstract says "inference delays in excess of 300 milliseconds".

**F07-70. Training-time RTC (arXiv 2512.05964v2) removes the inference-time cost by teaching the model the same trick during training: for each training example a delay is sampled, the first d actions of the chunk are given clean (not noised) and the model learns to denoise only the rest. At run time the prefix is just fed in; no guidance and no backward pass.**
- Location: abstract; section III; appendix code listing `compute_loss`.
- Verdict: CARRIED (seed 04 section 2.3 cited the ID; re-fetched, v2 is the latest version)
- Evidence: https://arxiv.org/abs/2512.05964v2 | Tier 3, preprint (first-party lab; venue not confirmed) | definition | "we propose a simple alternative: simulating inference delay at training time and conditioning on action prefixes directly, eliminating any inference-time overhead. Our method requires no modifications to the model architecture or robot runtime, and can be implemented with only a few additional lines of code." and, in the appendix code, "# sample delays from some distribution of choice: # here, we use Unif[0, max_delay), as in our real-world experiments / delay = jax.random.randint(delay_rng, (b,), 0, max_delay) / # set time to 1.0 for the action prefix / prefix_mask = jnp.arange(ah)[None, :] < delay[:, None] / time = jnp.where(prefix_mask, 1.0, time[:, None])" (accessed 2026-11-20)
- Use in dive: section 17 mechanism, second variant: which tensor changes. The per-action flow-matching time is set to "fully denoised" for the prefix positions, and the loss is taken only on the remaining positions. This is LeRobot's `trained` mode (F07-17) and its `rtc_training_max_delay` setting (F07-18).

**F07-71. Its latency figures: delays sampled uniformly from 0 to 10 steps in training, "which supports a maximum latency of 200ms on a 50Hz robot"; measured on a remote H100 with five denoising steps, 108 ms end to end for training-time RTC (d about 5) against 135 ms for inference-time RTC (d about 7). `[author reported]`**
- Location: section IV.B (real-world results), setup paragraph.
- Verdict: CARRIED (seed 04 section 2.3, re-fetched; figures match)
- Evidence: https://arxiv.org/abs/2512.05964v2 | Tier 3, preprint | benchmark claim (author reported) | "We sample delays uniformly between 0 and 10 during training, which supports a maximum latency of 200ms on a 50Hz robot. During evaluations, we perform inference on a remote H100 server with 5 denoising steps, averaging 108ms of end-to-end latency for training-time RTC (d ~ 5) and 135ms for inference-time RTC (d ~ 7)." (accessed 2026-11-20)
- Use in dive: section 17: the latency the fleet will see is a training hyperparameter. A checkpoint trained for at most 10 steps of delay at 50 Hz covers 200 ms `[derived: 10 x 20 ms]`; the same 10 steps on a 30 Hz arm cover 333 ms `[derived: 10 x 33.3 ms]`.

**F07-72. In simulation the trained variant beats the guided one once the delay is 2 steps or more, and is marginally worse at delays of 0 and 1; on two real tasks (building a box, making espresso, with the pi0.6 model) the two perform similarly and both are faster than synchronous execution. `[author reported]`**
- Location: section IV.A and Figure 3 caption; Figure 5 caption.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2512.05964v2 | Tier 3, preprint | benchmark claim (author reported) | "Training-time RTC performs better than inference-time RTC at inference delays of 2 or higher. Each data point represents 2048 trials" and "Training-time and inference-time RTC perform similarly, while both improving speed over synchronous inference." (accessed 2026-11-20)
- Use in dive: section 17, when to use which: guided RTC for a checkpoint you did not train (no retraining needed), trained RTC when you fine-tune anyway and the device is slow.

### H. An independent measurement of the same policies on AGX Orin and AGX Thor (arXiv 2610.19656v3)

**F07-73. A third-party paper measured three policies on both Jetson generations without quantisation, at batch size 1: pi0.5 takes 310.4 ms on AGX Orin and 127.2 ms on AGX Thor; GR00T N1.5 takes 149.3 ms and 62.8 ms; GR00T N1.7 takes 209.9 ms and 101.1 ms. `[author reported]`**
- Location: appendix B.1, Table 6 "GPU latency across batch sizes on Jetson Orin and Jetson Thor".
- Verdict: CARRIED (seed 04 section 1.2, re-fetched; the ID, title "Accelerating VLA Inference with Perturbation Informed Execution" and all six figures match; latest version is v3, 2026-10-18)
- Evidence: https://arxiv.org/abs/2610.19656v3 | Tier 3, preprint | benchmark claim (author reported) | "Model / Jetson Orin / Jetson Thor / B = 1 ... / pi0.5 310.4 361.6 464.1 581.1 676.6 127.2 149.8 179.3 215.3 267.0 / GR00T N1.5 149.3 162.1 192.2 230.8 273.4 62.8 67.2 73.7 82.7 90.8 / GR00T N1.7 209.9 235.4 301.6 361.6 401.1 101.1 111.5 124.5 148.3 166.2" (accessed 2026-11-20)
- Use in dive: section 17, the independent cross-check of the vendor table. Orin-to-Thor ratios: 2.44 for pi0.5, 2.38 for GR00T N1.5, 2.08 for GR00T N1.7 `[derived: 310.4/127.2; 149.3/62.8; 209.9/101.1]`, against the vendor's 1.94 (F07-5).

**F07-74. The conditions differ from NVIDIA's table in ways that explain the gap: older software (Orin on Jetson Linux R36.5.0 with TensorRT 10.3, Thor on R38.4.0 with TensorRT 10.13), only the action head compiled with TensorRT while the backbone runs in eager PyTorch, and timing that excludes input preprocessing and host-to-device transfer.**
- Location: appendix B.2, Table 8 and "Inference Configurations".
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2610.19656v3 | Tier 3, preprint | benchmark claim (author reported) | "Jetson Linux R36.5.0 R38.4.0 / CUDA 12.6 13.0 / PyTorch 2.8.0 2.13.0+cu130 / TensorRT 10.3.0.30 10.13.3.9 / Power mode MAXN MAXN" and "All models use bfloat16 without quantization. ... GR00T System 1 uses the TensorRT deployment path provided by the official GR00T repository, while System 2 uses eager PyTorch with SDPA. We use 10 flow-matching steps for pi0.5 and 4 for both GR00T models. ... Timing covers backbone inference and action generation from GPU-resident inputs, excluding input reprocessing, observation host-to-device transfer" (accessed 2026-11-20)
- Use in dive: section 17, teaching point: 209.9 ms (paper, Orin, JetPack 6 line, backbone in PyTorch) against 149.0 ms (vendor, Orin, JetPack 7.2, all engines) for the same model on the same device class. The software stack is worth 29% `[derived: 1 - 149.0/209.9]`. A latency figure without its stack is not a fact.

**F07-75. The same paper's introduction prints figures that contradict its own table: "GR00T N1.7 requires 80.4ms per policy call on Jetson Orin and 150.9 ms on Jetson Thor", which has the slower device faster. The sentence survives in v3.**
- Location: section 1 (introduction), second paragraph.
- Verdict: CARRIED (seed 04 section 1.2 flagged the conflict; re-fetched at v3, still present)
- Evidence: https://arxiv.org/abs/2610.19656v3 | Tier 3, preprint | benchmark claim (author reported, internally inconsistent) | "For example, GR00T N1.7 requires 80.4ms per policy call on Jetson Orin and 150.9 ms on Jetson Thor (Li et al., 2026; Bjorck et al., 2025), whereas observation acquisition and actuation can operate up to 60Hz and 1kHz, respectively" (accessed 2026-11-20)
- Use in dive: do not cite the introduction's figures; cite Table 6. Listed under contradictions.

### I. Quantisation and compilation: TensorRT at its current version

**F07-76. The newest TensorRT is 11.5.0; its GitHub release is dated 2026-11-18. It uses CUDA 13.5 and adds ONNX opset 25. The Jetson software lags it: JetPack 7.2.2's table lists TensorRT 11.4.1, and the TensorRT support matrix names "Jetson AGX Orin (JetPack 7.2.2+)" and "Jetson AGX Thor (JetPack 7.2.2+)" as its JetPack targets.**
- Location: NVIDIA/TensorRT GitHub releases; TensorRT 11.5.0 release notes, "Key Features and Enhancements"; support matrix platform list.
- Verdict: NEW (the seed pointed at a "10.x.x" docs URL)
- Evidence: https://github.com/NVIDIA/TensorRT/releases/tag/v11.5 (tag commit 7fe18f085276e1e1dd1f872c5b6568143b31b57d, published 2026-11-18) | Tier 1, release notes | documentation of support | "TensorRT 11.5 Release" and "Updated default CUDA version to 13.5." and "Added support for ONNX opset 25 and updated the supported ONNX release to 1.22.0."; release notes (https://docs.nvidia.com/deeplearning/tensorrt/latest/getting-started/release-notes-11/11.5.0.html): "CUDA 13.5 : TensorRT 11.5.0 uses CUDA 13.5." (accessed 2026-11-20)
- Use in dive: section 17 currency line. TensorRT is NVIDIA's inference compiler and runtime: it takes a model graph (usually an ONNX file), picks a GPU implementation for every layer by timing candidates on the build machine, and writes the result as an "engine" file.

**F07-77. The exact sentence on why an engine is built per device type, from the TensorRT 11.5 docs: "By default, TensorRT engines are only compatible with the type of device where they were built." The escape hatch, hardware compatibility mode, "is not supported on NVIDIA DriveOS or NVIDIA JetPack".**
- Location: TensorRT docs, "Engine Compatibility" page, section "Hardware Compatibility".
- Verdict: CARRIED (seed 04 section 1.1 quoted the support matrix from a search summary; re-fetched at the current docs version, with the JetPack exclusion new)
- Wave 2 (2026-11-20, SCOPE NARROWER): The one-engine-per-device-type rule holds on Jetson (JetPack). TensorRT 11.5.0 adds a hardware compatibility mode on Arm server-class Linux, DGX Spark included (`wave2-C.md`, register 07 row 27), so do not state the rule for the DGX Spark without that qualifier.
- Evidence: https://docs.nvidia.com/deeplearning/tensorrt/latest/inference-library/engine-compatibility.html | Tier 1, first-party docs (TensorRT 11.5.0) | documentation of support | "By default, TensorRT engines are only compatible with the type of device where they were built. With build-time configuration, engines that are compatible with other types of devices can be built. Currently, hardware compatibility is not supported on NVIDIA DriveOS or NVIDIA JetPack. Starting in TensorRT 11.5.0, hardware compatibility is supported on Linux ARM SBSA. An engine built there with HardwareCompatibilityLevel::kAMPERE_PLUS can run on supported NVIDIA Ampere and later GPUs on Linux ARM SBSA." (accessed 2026-11-20)
- Use in dive: section 17, the load-bearing sentence for "an engine built on one device type is rebuilt for another". On a Jetson there is no portable-engine option at all, so a fleet with Orin and Thor robots ships one ONNX file and builds two engines.

**F07-78. The support matrix states the same rule in three lines: engines are not portable across platforms (Linux and Windows), across TensorRT versions unless built version-compatible, or "across different GPU architectures" unless built in hardware compatibility mode.**
- Location: TensorRT support matrix, "Engine Portability".
- Verdict: CARRIED (seed 04 section 1.1, re-fetched; wording matches the seed's summary)
- Evidence: https://docs.nvidia.com/deeplearning/tensorrt/latest/getting-started/support-matrix.html | Tier 1, first-party docs (TensorRT 11.5.0) | documentation of support | "Platform: Serialized engines are not portable across platforms, such as Linux and Windows." and "Hardware Compatibility: Engines built with hardware compatibility mode can run on multiple GPU architectures, depending on the hardware compatibility level used. Without this mode, engines are not portable across different GPU architectures." (accessed 2026-11-20)
- Use in dive: section 17, supporting evidence in an expandable block.

**F07-79. How the check works: the engine file records the TensorRT version and the GPU's compute capability (a major.minor number naming the GPU generation), and it "will fail to deserialize" on a mismatch. In the support matrix Jetson AGX Orin is compute capability 8.7, Jetson AGX Thor is 11.0 and DGX Spark is 12.1.**
- Location: "Engine Compatibility" page, "Compatibility Checks"; support matrix, GPU architecture selector.
- Verdict: NEW
- Evidence: https://docs.nvidia.com/deeplearning/tensorrt/latest/inference-library/engine-compatibility.html | Tier 1, first-party docs | code behaviour (as documented) | "TensorRT records the major, minor, patch, and build versions of the library used to create the plan in a plan. If these do not match the runtime version used to deserialize the plan, it will fail to deserialize." and "TensorRT also records the compute capability (major and minor versions) in the plan and checks it against the GPU on which the plan is being loaded. If they do not match, the plan will fail to deserialize. This ensures that kernels selected during the build phase are present and can run."; support matrix selector: "12.1 (DGX Spark) ... 11.0 (Jetson AGX Thor) ... 8.7 (Jetson AGX Orin)" (accessed 2026-11-20)
- Use in dive: section 17 worked example: an engine built on Thor (11.0) is refused by Orin (8.7) at load time, a clean failure at the point of detection. Two rebuild triggers for a fleet: a different device type, and a JetPack update that changes the TensorRT version. "Plan" is TensorRT's word for the engine file.

**F07-80. Within one GPU generation an engine built on one model usually runs on another with "only a small performance drop": the docs' example is an RTX 4080 engine used on an RTX 4090.**
- Location: "Engine Compatibility" page, paragraph after "Compatibility Checks".
- Verdict: NEW
- Evidence: https://docs.nvidia.com/deeplearning/tensorrt/latest/inference-library/engine-compatibility.html | Tier 1, first-party docs | documentation of support | "If it is impossible to build a TensorRT engine for each type of GPU, you can select several GPUs to build engines with and run the engine on different GPUs with the same architecture. For example, among the NVIDIA RTX 40xx GPUs, you can build an engine with RTX 4080 and an engine with RTX 4060. At runtime, you can use the RTX 4080 engine on an RTX 4090 GPU and the 4060 engine on an RTX 4070 GPU. In most cases, the engine will run without functional issues and with only a small performance drop" (accessed 2026-11-20)
- Use in dive: section 17, the precise scope of "per device type": per GPU architecture and TensorRT version, not per serial number. One engine per robot model, not per robot. Whether a T5000 engine loads on a T4000 (same compute capability, different GPU size) is not stated for Jetson (U12).

**F07-81. TensorRT 11.5 documents four quantised data types: INT8, INT4 (weights only), FP8 (8-bit floating point: 4 exponent bits, 3 mantissa bits) and FP4 (4-bit floating point: 2 exponent bits, 1 mantissa bit). Its precision list for current data-centre GPUs is "TF32, FP32, FP16, FP8, FP4, BF16, and INT8".**
- Location: TensorRT docs, "Working with Quantized Types", "Supported Data Types"; 11.5.0 release notes, GB300 item.
- Verdict: NEW
- Wave 2 (2026-11-20, SCOPE NARROWER): The quoted precision list is from the TensorRT 11.5.0 release notes, in a paragraph about Windows on ARM: "The supported precisions are the same as for compute capability 10.3 on x86-64: TF32, FP32, FP16, FP8, FP4, BF16, and INT8." Compute capability 10.3 is B300 and GB300. The sentence says nothing about H100, L40S or B200; which of FP8 and FP4 older GPUs accelerate stays U13.
- Evidence: https://docs.nvidia.com/deeplearning/tensorrt/latest/inference-library/work-quantized-types.html | Tier 1, first-party docs (TensorRT 11.5.0) | definition | "Supported Data Types : INT8 (signed 8-bit integer) / INT4 (signed 4-bit integer, weight-only quantization) / FP8E4M3 (FP8, 8-bit floating point with 4 exponent and 3 mantissa bits) / FP4E2M1 (FP4, 4-bit floating point with 2 exponent and 1 mantissa bit)" and "TensorRT uses a symmetric quantization scheme, where both activations and weights are mapped to quantized values centered around zero. ... typically involving only a scaling factor."; release notes: "The supported precisions are the same as for compute capability 10.3 on x86-64: TF32, FP32, FP16, FP8, FP4, BF16, and INT8." (accessed 2026-11-20)
- Use in dive: section 17 precision primer table (format, bits, what it stores, where used). With the sign bit, FP8 is 1 + 4 + 3 and FP4 is 1 + 2 + 1 bits `[derived]`. NVFP4 (F07-58) is this FP4 element type plus a per-block scale factor. Which of these each Jetson GPU accelerates could not be read from the support matrix, whose precision table is loaded interactively (U13).

**F07-82. TensorRT Edge-LLM is NVIDIA's C++ runtime for language, vision-language and now action models on Jetson, DRIVE and DGX Spark. Its newest release is 0.12.0 (2026-11-13), which adds GR00T N1.7 policy inference at FP16 and a direct engine builder for pi0.5; pi0.5 support was first marked "experimental" in 0.11.0 (September 2026).**
- Location: NVIDIA/TensorRT-Edge-LLM README at tag v0.12.0; v0.12.0 release notes.
- Verdict: STALE (seed 04 section 1.3 named "release/0.9.1-mlpinf" and said the benchmark post "does not mention VLA/GR00T support"; superseded by 0.11.0 and 0.12.0)
- Evidence: https://github.com/NVIDIA/TensorRT-Edge-LLM/releases/tag/v0.12.0 (tag commit 513dcd18291e587c80928911a480761352f3c2d8) | Tier 1, release notes and README at a tag | documentation of support | README: "TensorRT Edge-LLM is NVIDIA's C++ inference runtime for text, vision, audio, speech, and action models on NVIDIA Jetson, NVIDIA DRIVE, and NVIDIA DGX Spark. The supported frontend exports Hugging Face checkpoints to ONNX for C++ engine building"; release notes: "Added GR00T N1.7 FP16 policy inference for the LIBERO checkpoint and libero_sim embodiment" and "Added a checkpoint-direct pi0.5 engine builder and expanded Cosmos3 policy deployment guidance" (accessed 2026-11-20)
- Use in dive: section 17, "what runs the VLM backbone on a Jetson": the same project that runs chat models on Thor now carries robot policies, in C++ with no Python in the loop. No latency figure for a policy under Edge-LLM was located (U14).

**F07-83. Orin's GPU generation gets a narrower set of quantisation features: the Edge-LLM 0.12.0 notes add "FP8 KV-cache storage support for Ampere, including Jetson Orin, with attention computed in FP16", that is, FP8 as a storage format with the arithmetic done at 16 bits.**
- Location: v0.12.0 release notes, "Runtime and performance".
- Verdict: NEW
- Evidence: https://github.com/NVIDIA/TensorRT-Edge-LLM/releases/tag/v0.12.0 | Tier 1, release notes | documentation of support | "Added FP8 KV-cache storage support for Ampere, including Jetson Orin, with attention computed in FP16" (accessed 2026-11-20)
- Use in dive: section 17, why Thor's quantised rows have no Orin counterpart: on Orin an 8-bit float can shrink what is stored, and the computation still runs in FP16 `[our reading of this one line; see U13]`.

### J. Fleet delivery on AWS: AWS IoT Greengrass v2

**F07-84. AWS IoT Greengrass v2 is edge software that receives "deployments" of "components" from the cloud. Its core, the nucleus, is at version 2.18.4 (GitHub release 2026-10-14); it is a Java program needing a Java runtime of version 8 or later, at least 256 MB of disk and 96 MB of RAM on Linux.**
- Location: Greengrass developer guide, "Greengrass nucleus", Versions, Requirements and Changelog; GitHub releases of aws-greengrass/aws-greengrass-nucleus.
- Verdict: NEW (the seed gave no nucleus version)
- Evidence: https://docs.aws.amazon.com/greengrass/v2/developerguide/greengrass-nucleus-component.html | Tier 1, first-party docs | documentation of support | "The Greengrass nucleus component ( aws.greengrass.Nucleus ) is a mandatory component and the minimum requirement to run the AWS IoT Greengrass Core software on a device." and "Minimum 256 MB disk space available for the AWS IoT Greengrass Core software." and "Minimum 96 MB RAM allocated to the AWS IoT Greengrass Core software." and "Java Runtime Environment (JRE) version 8 or greater." and changelog top row "2.18.4 / Bug fixes and improvements / Fixes an issue where the nucleus fails a deployment instead of retrying when a Docker image download is interrupted by a network error"; release date from https://github.com/aws-greengrass/aws-greengrass-nucleus/releases/tag/v2.18.4 (accessed 2026-11-20)
- Use in dive: section 18, the delivery agent on the robot. A component is a named, versioned unit: a recipe (a small file saying what to download and which commands to run at install, start and stop) plus its artifacts (the files). The 2.18.4 fix is about interrupted Docker image downloads, which is the large-artifact path a policy uses.

**F07-85. Greengrass nucleus lite is a second runtime, written for constrained devices: it "uses less than 15MB RAM" and needs 5 MB of storage, runs on Linux with systemd, and was introduced with Greengrass 2.14.0. The docs changelog tops out at 2.5.1 while GitHub's newest release is v2.7.0 (2026-09-25).**
- Location: Greengrass developer guide, "Greengrass nucleus lite", opening, Requirements, Changelog; GitHub releases of aws-greengrass/aws-greengrass-lite.
- Verdict: CARRIED (seed 04 section 3.1, re-fetched; the version gap between docs and GitHub is new)
- Evidence: https://docs.aws.amazon.com/greengrass/v2/developerguide/greengrass-nucleus-lite-component.html | Tier 1, first-party docs | documentation of support | "The Greengrass nucleus lite ( aws.greengrass.NucleusLite ) is a device runtime for constrained edge devices optimized for minimal memory footprint (uses less than 15MB RAM). It has been introduced with AWS IoT Greengrass version 2.14.0 release and is backward compatible with AWS IoT Greengrass generic components, Greengrass V2 API, and SDK." and "15MB of RAM space for the nucleus runtime. / 5MB of storage (disk/FLASH)." and, for 2.2.0, "Adds support for container image artifact URIs."; https://github.com/aws-greengrass/aws-greengrass-lite/releases/tag/v2.7.0 (published 2026-09-25) (accessed 2026-11-20)
- Use in dive: section 18: on an 8 GB Orin Nano, where every megabyte of the shared memory pool is also GPU memory, a 15 MB agent against a Java virtual machine of 96 MB or more is a real choice.

**F07-86. Nucleus lite gives up features a robot may want: per the feature matrix it cannot set system resource limits for component processes, cannot gather system telemetry metrics, and cannot run the Kinesis Video Streams edge connector. It can run Docker containers and stream manager.**
- Location: Greengrass developer guide, "Greengrass feature compatibility" matrix (columns: Linux, Windows, nucleus lite).
- Verdict: CARRIED (seed 04 section 3.1, re-fetched)
- Evidence: https://docs.aws.amazon.com/greengrass/v2/developerguide/operating-system-feature-support-matrix.html | Tier 1, first-party docs | documentation of support | "Run Docker containers in components | Yes | Yes | Yes" and "Process and export high-volume data streams using stream manager | Yes | Yes | Yes" and "Gather and act on real-time system telemetry metrics | Yes | Yes | No" and "Configure system resource limits for component processes | Yes | No | No" and "Publish video streams to Amazon Kinesis Video Streams using the edge connector for Kinesis Video Streams component | Yes | No | No" (accessed 2026-11-20; column order read from the flattened table)
- Use in dive: section 18 trade-off table: full nucleus against nucleus lite.

**F07-87. One component's artifacts may total at most 2 GB, and the limit cannot be raised. The recipe may be at most 16 KB; a deployment document 7 KB (single device), 31 KB (group) or 6 MB (with large configuration support); and `CreateComponentVersion` is limited to 1 request per second per Region.**
- Location: AWS General Reference, "AWS IoT Greengrass V2 endpoints and quotas", quotas for components, deployments and API operations.
- Verdict: CARRIED (seed 04 section 3.1, re-fetched; all figures match)
- Evidence: https://docs.aws.amazon.com/general/latest/gr/greengrassv2.html | Tier 1, first-party docs | documentation (quota) | "Maximum size of component recipe | 16 KB | No" and "Maximum total size of component artifacts | 2 GB | No | This quota applies to the sum of all artifacts for a component." and "Maximum size of deployment document for a thing deployment (without large configuration support) | 7 KB | No" and "Maximum size of deployment document for a thing group deployment (without large configuration support) | 31 KB | No" and "Request rate for CreateComponentVersion | 1 request per second per Region | No" (accessed 2026-11-20)
- Use in dive: section 18, the constraint that shapes delivery: pi0.5's weights are "~6 GB+" (F07-54), three times the artifact limit `[derived: 6 / 2]`. A policy travels as a container image or as an S3 object fetched by the component's own script, with the component carrying the reference.

**F07-88. A component can run a Docker container whose image comes from Amazon ECR (public or private), Docker Hub or an S3 bucket; the artifact is written as `docker:registry/image[:tag|@digest]`. Docker Engine 1.9.1 or later must already be installed on the device; versions "up to and including 29.6.0" work. The page says nothing about GPUs.**
- Location: Greengrass developer guide, "Run a Docker container", Requirements and artifact URI formats.
- Verdict: CARRIED (seed 04 section 3.1, re-fetched)
- Evidence: https://docs.aws.amazon.com/greengrass/v2/developerguide/run-docker-container.html | Tier 1, first-party docs | documentation of support | "Docker Engine 1.9.1 or later installed on the Greengrass core device. Versions up to and including 29.6.0, such as 20.10, 24.0, 25.0, and 27.5, work with the AWS IoT Greengrass Core software. You must install Docker directly on the core device before you deploy components that run Docker containers." and "docker: registry / image [ :tag|@digest ]" and "Private Amazon ECR image: docker: account-id .dkr.ecr. region .amazonaws.com/ repository / image [ :tag|@digest ]" (accessed 2026-11-20; the page text was searched for "gpu", "nvidia" and "runtime" with no match on GPU access)
- Use in dive: section 18: GPU access for a policy container on a Jetson is whatever `docker run` command the recipe's lifecycle script contains; NVIDIA's own command is `--runtime nvidia --gpus all` (F07-11). AWS does not document that combination on this page: "not located on the Docker component page" is the scope `[our reading]`. Pinning by `@digest` is what makes a rollout reproducible.

**F07-89. If a deployment fails on a device, Greengrass rolls the device back to its previous configuration by default: `failureHandlingPolicy` defaults to `ROLLBACK`, the alternative is `DO_NOTHING`.**
- Location: Greengrass V2 API reference, `DeploymentPolicies`.
- Verdict: CARRIED (seed 04 section 3.1, re-fetched)
- Evidence: https://docs.aws.amazon.com/greengrass/v2/APIReference/API_DeploymentPolicies.html | Tier 1, API reference | documentation of support | "failureHandlingPolicy / The failure handling policy for the configuration deployment. This policy defines what to do if the deployment fails. / Default: ROLLBACK / Type: String / Valid Values: ROLLBACK | DO_NOTHING" (accessed 2026-11-20)
- Use in dive: section 18. Scope to state: "fails" means the component did not install or start. A policy that starts cleanly and then drops blocks is a healthy deployment as far as Greengrass knows `[our reading]`.

**F07-90. By default Greengrass asks components before updating them and waits 60 seconds: `componentUpdatePolicy.action` defaults to `NOTIFY_COMPONENTS`, a component can answer with `DeferComponentUpdate`, and `timeoutInSeconds` defaults to 60. "If the component waits for longer than this timeout, then the deployment proceeds on the device."**
- Location: Greengrass V2 API reference, `DeploymentComponentUpdatePolicy`.
- Verdict: CARRIED (seed 04 section 3.1, re-fetched)
- Evidence: https://docs.aws.amazon.com/greengrass/v2/APIReference/API_DeploymentComponentUpdatePolicy.html | Tier 1, API reference | documentation of support | "NOTIFY_COMPONENTS - The deployment notifies each component before it stops and updates that component. Components can use the SubscribeToComponentUpdates IPC operation to receive these notifications. Then, components can respond with the DeferComponentUpdate IPC operation." and "Default: NOTIFY_COMPONENTS" and "timeoutInSeconds / The amount of time in seconds that each component on a device has to report that it's safe to update. If the component waits for longer than this timeout, then the deployment proceeds on the device. / Default: 60" (accessed 2026-11-20)
- Use in dive: section 18 worked example: a pick-and-place episode on the arm lasts tens of seconds, so with the default a deployment can replace the policy process mid-motion unless the component defers until the gripper is empty and the timeout is set above the longest episode `[our reading]`.

**F07-91. A Greengrass deployment to a group of devices is delivered by an AWS IoT job underneath, and exposes the same three controls: a rollout rate, a stop (abort) configuration and a timeout.**
- Location: Greengrass V2 API reference, `DeploymentIoTJobConfiguration`.
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/greengrass/v2/APIReference/API_DeploymentIoTJobConfiguration.html | Tier 1, API reference | documentation of support | "Contains information about an AWS IoT job configuration." and "abortConfig / The stop configuration for the job. This configuration defines when and how to stop a job rollout." and "jobExecutionsRolloutConfig / The rollout configuration for the job. This configuration defines the rate at which the job rolls out to the fleet of target devices." and "timeoutConfig / ... defines the amount of time each device has to complete the job." (accessed 2026-11-20)
- Use in dive: section 18: one mental model for both services. Greengrass says what to install; the job underneath says how fast it spreads and when to stop.

### K. Staged rollout: AWS IoT Device Management jobs

**F07-92. A job's rollout is either a constant rate, `maximumPerMinute` (minimum 1 device per minute), or an exponential rate with a `baseRatePerMinute` from 1 to 1000 and an `incrementFactor` from 1.1 to 5.**
- Location: AWS IoT API reference, `JobExecutionsRolloutConfig` and `ExponentialRolloutRate`.
- Verdict: CARRIED (seed 04 section 3.2, re-fetched; the bounds on the exponential fields are new)
- Evidence: https://docs.aws.amazon.com/iot/latest/apireference/API_ExponentialRolloutRate.html | Tier 1, API reference | documentation of support | "baseRatePerMinute / The minimum number of things that will be notified of a pending job, per minute at the start of job rollout. ... Valid Range: Minimum value of 1. Maximum value of 1000." and "incrementFactor / The exponential factor to increase the rate of rollout for a job. ... Valid Range: Minimum value of 1.1. Maximum value of 5."; https://docs.aws.amazon.com/iot/latest/apireference/API_JobExecutionsRolloutConfig.html: "maximumPerMinute / The maximum number of things that will be notified of a pending job, per minute. This parameter allows you to create a staged rollout. ... Valid Range: Minimum value of 1." (accessed 2026-11-20)
- Use in dive: section 18 worked example inputs. A "thing" is AWS IoT's record for one device, here one robot.

**F07-93. AWS's own example of an exponential rollout: a base rate of 50 per minute and an increment factor of 2, with the rate doubling each time another 1,000 devices have been notified or have succeeded, gives 50, 100, 200, 400 per minute.**
- Location: AWS IoT developer guide, "Job configurations", "Job rollout rates".
- Verdict: CARRIED (seed 04 section 3.2, re-fetched)
- Evidence: https://docs.aws.amazon.com/iot/latest/developerguide/jobs-configurations-details.html | Tier 1, first-party docs | documentation of support | "a job rollout with a base rate of 50 per minute, increment factor of 2, and number of notified and succeeded devices each as 1,000, would work as follows: The job will start at a rate of 50 job executions per minute and continue at that rate until either 1,000 things have received job execution notifications, or 1,000 successful job executions have occurred." and the table "Rollout rate per minute | 50 | 100 | 200 | 400 / Number of notified devices or successful job executions to satisfy a rate increase | 1,000 | 2,000 | 3,000 | 4,000" (accessed 2026-11-20)
- Use in dive: section 18: the rate grows only as evidence of success accumulates, which is the whole idea of a staged rollout. The example is sized for thousands of devices; a 100-robot fleet needs smaller thresholds (teaching material, section 5).

**F07-94. A job can cancel itself: the abort criteria name a failure type (`FAILED`, `REJECTED`, `TIMED_OUT` or `ALL`), a minimum number of devices notified before the rule can fire (at least 1), and a threshold percentage of failures (up to 100, two decimals). The only action is `CANCEL`.**
- Location: AWS IoT API reference, `AbortCriteria`.
- Verdict: CARRIED (seed 04 section 3.2, re-fetched)
- Evidence: https://docs.aws.amazon.com/iot/latest/apireference/API_AbortCriteria.html | Tier 1, API reference | documentation of support | "action / The type of job action to take to initiate the job abort. / Valid Values: CANCEL" and "failureType / ... Valid Values: FAILED | REJECTED | TIMED_OUT | ALL" and "minNumberOfExecutedThings / The minimum number of things which must receive job execution notifications before the job can be aborted. / Valid Range: Minimum value of 1." and "thresholdPercentage / The minimum percentage of job execution failures that must occur to initiate the job abort. AWS IoT Core supports up to two digits after the decimal ... Valid Range: Maximum value of 100." (accessed 2026-11-20)
- Use in dive: section 18 worked example: "after at least 5 robots, cancel if 20% or more report FAILED".

**F07-95. An abort stops the spread and does not undo it: "only QUEUED job executions are canceled", while executions that are `IN_PROGRESS` "will not be canceled". Robots that already took the new policy keep it.**
- Location: AWS IoT developer guide, "Job configurations", note under the abort configuration.
- Verdict: CARRIED (seed 04 section 3.2, re-fetched)
- Evidence: https://docs.aws.amazon.com/iot/latest/developerguide/jobs-configurations-details.html | Tier 1, first-party docs | code behaviour (as documented) | "When the abort criteria is met for canceling a job execution, only QUEUED job executions are canceled. Any queued retries for the device will not be attempted. However, current job executions that have an IN_PROGRESS status will not be canceled." (accessed 2026-11-20)
- Use in dive: section 18, the practical point of the section: abort is a brake, not a reverse gear. Returning the canary robots to the old policy is a second deployment that pins the previous version.

**F07-96. The abort rule only sees what devices report: the docs' examples are a device reporting `REJECTED` when it is incompatible, a device that "must be programmed to report the FAILURE status", and a timeout. Nothing in the job service evaluates how well the robot performs its task.**
- Location: AWS IoT developer guide, "Job configurations", abort configuration cases.
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/iot/latest/developerguide/jobs-configurations-details.html | Tier 1, first-party docs | documentation of support | "When a threshold percentage of devices report failure for their job executions, such as when your device encounters a disconnection when attempting to download the job document from an Amazon S3 URL. In such cases, your device must be programmed to report the FAILURE status to AWS IoT." and "When a TIMED_OUT status is reported because the job execution times out for a threshold percentage of devices after the job executions have started." (accessed 2026-11-20)
- Use in dive: section 18: for a policy rollout to abort on worse behaviour, the robot-side code must hold the job `IN_PROGRESS` through a trial period, measure something (success over the first N episodes, intervention count, failure-detector alarms), and only then report `SUCCEEDED` or `FAILED` `[our reading]`. The same page notes an account limit of 500 concurrent jobs.

### L. What AWS IoT Core can and cannot carry

**F07-97. An MQTT message through AWS IoT Core can be at most 128 KB, a connection can make 100 publish requests per second, and data on one connection is processed at 512 KB per second. None of the three is adjustable.**
- Location: AWS General Reference, "AWS IoT Core endpoints and quotas", message broker limits table.
- Verdict: CARRIED (seed 04 section 3.3, re-fetched)
- Evidence: https://docs.aws.amazon.com/general/latest/gr/iot-core.html | Tier 1, first-party docs | documentation (quota) | "MQTT payload size / The payload for every publish request can be no larger than 128 KB. AWS IoT Core rejects publish and connect requests larger than this size. / 128 Kilobytes / 128 Kilobytes / No" and "Publish requests per second per connection / ... / 100 / 100 / No" and "Throughput per second per connection / Data received or sent over a client connection is processed at a maximum throughput rate. Data that exceeds the maximum throughput is delayed in processing. / 512 Kilobytes / 512 Kilobytes / No" (accessed 2026-11-20)
- Use in dive: section 18 arithmetic: one raw 640x480 RGB camera frame is 921,600 bytes, seven times the 128 KB message limit `[derived: 921,600 / 131,072 = 7.0]`, and one camera at 30 frames per second is 27.6 MB/s raw, 54 times the 512 KB/s connection limit `[derived: 921,600 x 30 / 512,000]`. MQTT (a lightweight publish/subscribe protocol for devices) carries status, events and "new version available" notices; episodes go another way.

### M. What replaced AWS RoboMaker, and the other retirements

**F07-98. AWS RoboMaker is in AWS's "Services in Full Shutdown" table with an end-of-support date of September 10, 2025. Full shutdown means the service is "completely removed from the AWS portfolio and ... no longer available or supported in any capacity".**
- Location: AWS General Reference, "Services in Full Shutdown", definition paragraph and table row.
- Verdict: CARRIED (seed 04 section 5, re-fetched)
- Evidence: https://docs.aws.amazon.com/general/latest/gr/full_shutdown_services.html | Tier 1, first-party docs | documentation | "Full shutdown represents the final stage in the lifecycle of a service or feature. Services and features in full shutdown are completely removed from the AWS portfolio and are no longer available or supported in any capacity." and "AWS RoboMaker / September 10, 2025" (accessed 2026-11-20)
- Use in dive: section 18, one sentence so the reader does not go looking for it. AWS has had no robot-specific managed service since that date.

**F07-99. The same table lists the other robot and device services the seed named, each with its date: AWS IoT RoboRunner March 14, 2024; Fleet Hub for AWS IoT Device Management October 18, 2025; Amazon Lookout for Vision October 31, 2025; AWS Snowball Edge November 12, 2025; AWS IoT Analytics December 15, 2025; AWS SimSpace Weaver March 31, 2026; AWS IoT Events May 20, 2026; AWS Panorama May 20, 2026; AWS IoT Greengrass V1 October 7, 2026.**
- Location: AWS General Reference, "Services in Full Shutdown" table.
- Verdict: CARRIED (seed 04 section 5, re-fetched; all nine dates match)
- Evidence: https://docs.aws.amazon.com/general/latest/gr/full_shutdown_services.html | Tier 1, first-party docs | documentation | "AWS IoT Analytics / December 15, 2025 / Fleet Hub for AWS IoT Device Management / October 18, 2025 / AWS IoT Events / May 20, 2026 / AWS IoT Greengrass V1 / October 7, 2026 / AWS IoT RoboRunner / March 14, 2024" and "Amazon Lookout for Vision / October 31, 2025" and "AWS Panorama / May 20, 2026" and "AWS SimSpace Weaver / March 31, 2026 / AWS Snowball Edge / November 12, 2025" (accessed 2026-11-20)
- Use in dive: section 18, an expandable "retired, do not design around" list. Greengrass V1 ended six weeks before this register's date, so any tutorial using Lambda-based Greengrass V1 groups is dead; V2 is the only Greengrass.

**F07-100. What AWS recommends in place of RoboMaker could not be read from a first-party RoboMaker page: the RoboMaker documentation now returns HTTP 404 and the product URL redirects to the general AWS products page. The seed's notice text ("transitioning to AWS Batch to help run containerized simulations") came from search-result snippets.**
- Location: fetch attempts on the RoboMaker developer guide and product page.
- Verdict: UNKNOWN (U15)
- Evidence: https://docs.aws.amazon.com/robomaker/latest/dg/chapter-welcome.html | Tier 1, first-party docs (page removed) | documentation (absence) | HTTP 404 on the developer guide and on the documentation root; https://aws.amazon.com/robomaker/ redirects to https://aws.amazon.com/products/ (accessed 2026-11-20)
- Use in dive: section 18: write "AWS removed RoboMaker on September 10, 2025; simulation now runs on general compute (stream 09)" and do not quote a recommendation. The AWS Batch multi-container simulation post exists (AWS HPC blog, fetched, HTTP 200) and its text contains no mention of RoboMaker.

**F07-101. AWS IoT FleetWise "is no longer open to new customers"; existing customers can continue, and AWS points to its "Guidance for Connected Mobility on AWS" as the alternative.**
- Location: AWS IoT FleetWise developer guide, "AWS IoT FleetWise availability change".
- Verdict: CARRIED (seed 04 section 3.5, re-fetched; the seed's cut-off date of April 30, 2026 was from a search result and was not re-verified, so it is not carried)
- Evidence: https://docs.aws.amazon.com/iot-fleetwise/latest/developerguide/iotfleetwise-availability-change.html | Tier 1, first-party docs | documentation | "AWS IoT FleetWise is no longer open to new customers. Existing AWS IoT FleetWise customers can continue using the service" and "AWS IoT FleetWise is no longer accepting new customers." (accessed 2026-11-20)
- Use in dive: section 18, same "do not design around" list. FleetWise was the vehicle-fleet data collector a reader might reach for by analogy.

### N. Episode upload and closing the loop

**F07-102. Episodes go to Amazon S3 as objects, and the device can upload a large file in parts: up to 10,000 parts of 5 MiB to 5 GiB each, with a maximum object size of 48.8 TiB.**
- Location: Amazon S3 user guide, "Amazon S3 multipart upload limits".
- Verdict: NEW
- Evidence: https://docs.aws.amazon.com/AmazonS3/latest/userguide/qfacts.html | Tier 1, first-party docs | documentation (limit) | "Maximum object size / 48.8 TiB / Maximum number of parts per upload / 10,000 / Part numbers / 1 to 10,000 (inclusive) / Part size / 5 MiB to 5 GiB. There is no minimum size limit on the last part of your multipart upload." (accessed 2026-11-20)
- Use in dive: section 18: multipart upload is what makes a flaky robot uplink workable, since a dropped connection costs one part and not the whole file. 5 GiB x 10,000 = 48.8 TiB `[derived]`. An SO-101 episode is megabytes, far below any of these limits.

**F07-103. Greengrass stream manager is the built-in way to queue data on the device and export it when the link allows: it "works in environments with intermittent or limited connectivity", with per-stream policies for storage size, retention, bandwidth use and priority.**
- Location: Greengrass developer guide, "Manage data streams on Greengrass core devices".
- Verdict: NEW (the seed named stream manager without a quote)
- Evidence: https://docs.aws.amazon.com/greengrass/v2/developerguide/manage-data-streams.html | Tier 1, first-party docs | documentation of support | "Stream manager works in environments with intermittent or limited connectivity. You can define bandwidth use, timeout behavior, and how the AWS IoT Greengrass Core handles stream data when it is connected or disconnected. You can also set priorities to control the order in which the AWS IoT Greengrass Core exports streams to the AWS Cloud." and "You can define policies for storage type, size, and data retention for each stream" (accessed 2026-11-20)
- Use in dive: section 18, the upload path: record locally, queue, export to S3 in the background with a bandwidth cap so uploads never compete with a remote-inference link.

**F07-104. Amazon Kinesis Video Streams accepts live video at up to 12.5 MB per second (100 Mbps) per stream, in fragments of 1 to 20 seconds and at most 50 MB, with at most 3 tracks per stream.**
- Location: Kinesis Video Streams developer guide, "Kinesis Video Streams service quotas", media API quotas for PutMedia.
- Verdict: CARRIED (seed 04 section 3.4, re-fetched)
- Evidence: https://docs.aws.amazon.com/kinesisvideostreams/latest/dg/limits.html | Tier 1, first-party docs | documentation (quota) | "12.5 MB/second, or 100 Mbps [s] per stream" and "Minimum fragment duration: 1 second [h] / Maximum fragment duration: 20 seconds [h] / Maximum fragment size: 50 MB [h] / Maximum number of tracks: 3 [s]" (accessed 2026-11-20)
- Use in dive: section 18: KVS is for watching a robot live or storing camera video as video. Training wants synchronised episodes (video plus joint states plus actions on one clock), which KVS's video tracks do not hold, so the training data path is files to S3 `[our reading]`.

**F07-105. The Kinesis Video Streams Edge Agent records from IP cameras over RTSP on site and uploads "on a customer-defined schedule". It installs as a Greengrass V2 component, on Snowball Edge, or natively; access is by request form. The page still lists Snowball Edge, which the shutdown table says ended on November 12, 2025.**
- Location: Kinesis Video Streams developer guide, "Schedule video recording and storage with Amazon Kinesis Video Streams Edge Agent".
- Verdict: CARRIED (seed 04 section 3.4, re-fetched from the page itself, not a search summary)
- Evidence: https://docs.aws.amazon.com/kinesisvideostreams/latest/dg/edge.html | Tier 1, first-party docs | documentation of support | "With the Amazon Kinesis Video Streams Edge Agent, you can locally record and store video from the cameras and stream videos to the cloud on a customer-defined schedule for long-term storage, playback, and analytical processing." and "To access the Amazon Kinesis Video Streams Edge Agent, complete this brief form." and "The feature works with any IP camera that can stream over RTSP protocol." and "On AWS Snowball Edge: You can run the Amazon Kinesis Video Streams Edge Agent on Snowball Edge devices." (accessed 2026-11-20)
- Use in dive: section 18, one sentence, with scope: it fits fixed cameras watching a robot cell (RTSP), not the USB cameras on an SO-101; and it cannot run under nucleus lite (F07-86). The page carries no last-updated date and one stale option, so its currency is doubtful (U16).

**F07-106. The seed's "3.32 TB per robot per day" is real and is a model, not a measurement: "The Robot Data Factory" (arXiv 2609.16705v1, 15 September 2026) computes 38.41 MB/s for a reference robot with seven 1920x1080, 30 fps video streams, a LiDAR and scalar sensors, recording around the clock. For 120 robots it gives 4.61 GB/s and 11.95 PB per 30 days. `[author reported, modelled]`**
- Location: appendix B.3 (reference robot and stream sizing), equations for the per-robot and fleet rates.
- Verdict: CARRIED (seed 04 section 4.3, re-fetched; ID and figures match)
- Evidence: https://arxiv.org/abs/2609.16705v1 | Tier 3, preprint | benchmark claim (author reported; a sizing model) | "Every video stream records 1920 x 1080 pixels, three colour channels at 1 byte/channel, at 30 frames/s. The reference robot carries N_v = 7 such streams." and "S_robot = 19.20 + 5.24 + 13.96 = 38.41 MB/s, S_robot(T_30) = 49.77 + 13.59 + 36.19 = 99.55 TB, that is 3.32 TB per robot per day." and "S_RDF = 120 x 38.41 = 4.61 GB/s, S_RDF(T_30) = 11.95 PB." (accessed 2026-11-20; equations shown as plain text)
- Use in dive: section 18, the upper bound for a sensor-rich humanoid, labelled as modelled. 38.41 MB/s x 86,400 s = 3.32 TB `[derived]`, so the figure assumes 24 hours of recording per day. Video is half of it after compression (19.20 of 38.41 MB/s).

**F07-107. In that model each 1080p30 stream is stored with hardware H.265 or AV1 encoding at about 22 Mbit/s (91,430 bytes per frame against 6,220,800 raw), and the on-robot hardware video encoder is what makes the capture rate feasible.**
- Location: appendix B.3, video assumption and equations.
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2609.16705v1 | Tier 3, preprint | benchmark claim (author reported; an assumption of the model) | "Video is stored with hardware H.265/AV1 encoding at an average of 91.43 x 10^3 byte/frame, corresponding to approximately 22 Mbit/s" and "1920 x 1080 x 3 = 6,220,800 byte/frame" and "S_v = 186.6 / 68 = 2.74 MB/s ... per stream" (accessed 2026-11-20)
- Use in dive: sections 17 and 18, "which part of the machine": episode recording loads the device's video encode engine (present on AGX Orin and Thor, absent on Orin Nano, F07-37). Compression ratio 68 `[derived: 6,220,800 / 91,430]`. Scaled to the arm: two 640x480 30 fps streams at the same ratio are about 0.8 MB/s `[derived: 2 x 921,600 x 30 / 68 = 813,000 bytes/s; an illustration using the paper's ratio, not a LeRobot figure]`.

**F07-108. A published fleet loop with measured plumbing: "Learning While Deploying" (arXiv 2605.00416v4) ran 16 two-armed robots that upload complete episodes to object storage at episode boundaries, while a central learner broadcasts an updated shared policy every 50 training steps. `[author reported]`**
- Location: section V (experimental setup); appendix on training data infrastructure (Fig. 10).
- Verdict: CARRIED (seed 04 section 4.2, re-fetched at v4)
- Evidence: https://arxiv.org/abs/2605.00416v4 | Tier 3, preprint | production report (author reported) | "each robot runs an edge client that accumulates per-frame observations into complete episodes and uploads them to distributed object storage at episode boundaries; episode metadata is persisted by a business service and event notifications are published to a message queue." and "The learner broadcasts the updated shared policy to the robot fleet every 50 training steps." and "approximately 60 total hours of online data collected across the robot fleet" (accessed 2026-11-20)
- Use in dive: section 18, the loop closing, as a diagram with four arrows: robot to object storage (episode), storage to queue (event), queue to learner (training batch), learner to robots (new weights).

**F07-109. Its measured loop latencies on an 8-hour, 16-robot run: an episode becomes available to the learner 41 s after it is produced at the median (148 s at the 99th percentile), and a published model reaches a robot in 38 s at the median (55 s at the 99th percentile). `[author reported]`**
- Location: appendix, Table VI "Operational Latency".
- Verdict: CARRIED (seed 04 section 4.2, re-fetched; figures match)
- Evidence: https://arxiv.org/abs/2605.00416v4 | Tier 3, preprint | production report (author reported) | "Path / P50 / P99 / Episode produced -> available to learner / 41 s / 148 s / Model published -> received by actor / 38 s / 55 s" and "End-to-end latency measured on the same 8-hour, 16-actor online-RL run ... Absolute values are sensitive to network configuration and link contention and may vary across deployments." (accessed 2026-11-20)
- Use in dive: section 18, the strongest number for "how fast can the loop close": under a minute each way, for 16 robots on one site. Compare the default Greengrass update handshake (60 s wait per component, F07-90): a per-minute weight refresh is a different mechanism from a staged software deployment `[our reading]`.

**F07-110. Human corrections are part of what the robot sends home: in the same system, when an operator intervenes, the corrective segment is stored with the autonomous rollout and both feed the learner.**
- Location: section IV (algorithm listing and text on online replay); appendix baselines paragraph.
- Verdict: CARRIED (seed 04 section 4.2, re-fetched)
- Evidence: https://arxiv.org/abs/2605.00416v4 | Tier 3, preprint | definition | "During online execution, human operators provided intervention segments when corrections are needed. These intervention segments are aggregated with autonomous rollouts to form an online training buffer of approximately 60 robot-hours pooled across all eight real-world tasks." (accessed 2026-11-20)
- Use in dive: section 18: the most valuable episodes are the ones where a person had to take over, so "intervention happened" is an upload trigger.

**F07-111. Failure detection as an on-robot trigger has a peer-reviewed first-party source: SAFE (arXiv 2506.09937v2, NeurIPS 2025) trains a small network on the policy's own internal features to "predict a single scalar indicating the likelihood of task failure", sets its alarm threshold with conformal prediction, and was tested on OpenVLA, pi0 and pi0-FAST in simulation and on real robots. `[author reported]`**
- Location: abstract; section 1 (introduction); first page footer (venue).
- Verdict: CARRIED (seed 04 section 4.5, re-fetched; venue confirmed from the paper's footer and the arXiv comments field "NeurIPS 2025 camera ready")
- Evidence: https://arxiv.org/abs/2506.09937v2 | Tier 3, peer-reviewed (NeurIPS 2025) | definition; benchmark claim (author reported) | "we design SAFE to learn from VLA internal features and predict a single scalar indicating the likelihood of task failure." and "We test it on OpenVLA, pi0, and pi0-FAST in both simulated and real-world environments extensively." and "while VLAs achieve success rates of 80-90% on seen tasks, their performance on unseen tasks drops to 30-60% out of the box" and "39th Conference on Neural Information Processing Systems (NeurIPS 2025)." (accessed 2026-11-20)
- Use in dive: section 18, on-robot filtering: the detector reads activations the policy already computed, so it adds little compute, and its scalar is both a stop signal and a "keep this episode" flag. Conformal prediction: a calibration method that sets a threshold from held-out data so that the false-alarm rate is bounded at a chosen level. The paper proposes detection; using the alarm as an upload filter is `[our reading]`. Its runtime overhead in milliseconds is not stated in the paper (U17).

**F07-112. LeRobot v0.7.0 has a rollout strategy, `sentry`, that records continuously and uploads on its own: "Continuous autonomous recording with periodic upload to the Hugging Face Hub", with episode boundaries computed so that "each saved episode produces a complete video file".**
- Location: `docs/source/inference.mdx`, "Strategies", the continuous-recording strategy paragraph.
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/inference.mdx | Tier 1, first-party docs | documentation of support | "Continuous autonomous recording with periodic upload to the Hugging Face Hub. Episode boundaries are auto-computed from camera resolution and FPS so each saved episode produces a complete video file, keeping uploads efficient." and "Policy state (hidden state, RTC queue) persists across episode boundaries: the robot does not reset between episodes." (accessed 2026-11-20)
- Use in dive: section 18, the SO-101 version of "episode upload": the same loop a fleet runs, with the Hugging Face Hub as the store. The strategy is `--strategy.type=sentry` (heading "Sentry (`--strategy.type=sentry`)" on the same page).

**F07-113. LeRobot v0.7.0 also ships the on-robot filter in its simplest form. The `highlight` strategy keeps "the last N seconds of telemetry" in a memory-bounded ring buffer and saves only when triggered. The `dagger` strategy alternates policy and human control, tags intervention frames with `intervention=True`, and by default records only the human correction windows.**
- Location: `docs/source/inference.mdx`, "Highlight (`--strategy.type=highlight`)" and "DAgger (`--strategy.type=dagger`)".
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/inference.mdx | Tier 1, first-party docs | documentation of support | "Autonomous rollout with on-demand recording via a memory-bounded ring buffer. The buffer captures the last N seconds of telemetry. Press the save key to flush the buffer and start live recording; press it again to save the episode." and "Human-in-the-loop data collection. Alternates between autonomous policy execution and human intervention via a teleoperator. Intervention frames are tagged with `intervention=True`." and "**Corrections-only mode** (default): Only human correction windows are recorded. Each correction becomes one episode." (accessed 2026-11-20)
- Use in dive: section 18, on-robot filtering on the arm task: keep a rolling buffer, and keep it for good only when something worth learning from happened. In LeRobot the trigger is a key press or a human taking over; in a fleet the same trigger would be a failure detector (F07-111) `[our reading]`. DAgger: a data-collection method where a person corrects the policy while it runs, so the dataset gains examples of recovering from the policy's own mistakes.

**F07-114. No first-party source describing shadow-mode or canary deployment of a learned robot policy by a named robot operator was located in this research. The first-party material found is the mechanism (AWS IoT jobs rollout and abort, F07-92 to F07-96) and one research system that swaps policies at episode boundaries (F07-108).**
- Location: n/a (search result of this pass and of the seed).
- Verdict: UNKNOWN (U18)
- Evidence: https://docs.aws.amazon.com/iot/latest/developerguide/jobs-configurations-details.html | Tier 1, first-party docs | documentation (mechanism only) | the page documents rollout rate and abort criteria and does not use the words "canary" or "shadow" (accessed 2026-11-20)
- Use in dive: section 18: describe shadow mode (the new policy computes actions that are logged and not executed) and canary (a few robots first) as general software practice, labelled `[our reading]`, without attributing them to a robot company.

**F07-115. AWS near-edge GPU capacity on 2026-11-20: most AWS Local Zones that list a GPU instance list G4dn only. Three list something newer: Los Angeles `us-west-2-lax-1b` (G7e), Atlanta `us-east-1-atl-2a` (P5) and Dallas `us-east-1-dfw-2a` (P6e-GB200 UltraServers); Los Angeles `us-west-2-lax-1a` lists G5.**
- Location: AWS Local Zones features page, per-zone instance lists.
- Verdict: CARRIED (seed 04 section 3.7, re-fetched)
- Wave 2 (2026-11-20, SCOPE NARROWER (two first-party pages disagree)): Per the Local Zones features page on 2026-11-20: G7e in Los Angeles (lax-1b), P5 in Atlanta, P6e-GB200 UltraServers in Dallas, G5 in Los Angeles (lax-1a) and Beijing. The Capacity Blocks price list also sells P5e in the Phoenix Local Zone and P5en and P6-B300 in Atlanta, as blocks. For an off-board policy the only near-edge On-Demand modern G type is G7e in Los Angeles [our reading].
- Evidence: https://aws.amazon.com/about-aws/global-infrastructure/localzones/features/ | Tier 1, first-party product page | documentation of support | "us-west-2-lax-1b ... T3, C5, C5d, M5, R5, R5d, G4dn, G7e, and I3en instances" and "us-east-1-atl-2a ... C6i, M6i, R6i, C6gn, C7i, and P5 instances" and "us-east-1-dfw-2a ... P6e-GB200 UltraServers" and "us-west-2-lax-1a ... T3, C5, C5d, M5, R5, R5d, G4dn, G5, and I3en instances" (accessed 2026-11-20)
- Use in dive: section 17, one line on "can the off-board GPU be AWS": only in a few metros with a current GPU; stream 09 owns the rest. The latency a robot would see from a Local Zone was not found as a published measurement (U6).

### O. The latency chain, and the two gaps in it

**F07-116. The SmolVLA paper (arXiv 2506.01844v1) gives the queue condition for asynchronous inference in closed form: with chunk length n, control period dt and expected inference latency l, the robot never runs out of actions if the refill threshold g (the fraction of the chunk still unexecuted when a new request is sent) satisfies g >= (l / dt) / n. It uses dt = 33 ms for a 30 frames-per-second robot.**
- Location: section 3.3 (asynchronous inference), paragraph "the behavior of async inference can be studied analytically".
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2506.01844v1 | Tier 3, preprint | definition | "let l be a random variable modeling the time needed to receive an action chunk A after sending an observation o, i.e. the sum of (i) the time to send across the observation o between the RobotClient and PolicyServer, (ii) the inference latency on the PolicyServer, and (iii) the time to send A between the PolicyServer and RobotClient" and "let Delta-t be the environment's control cycle. With a real-world frame-rate of 30 frames per second, Delta-t = 33ms. Consequently, exhausted queues at runtime - i.e. being idle awaiting for a new chunk - are avoided for g >= (E[l_S] / Delta-t) / n." and "Sequential limit (g = 0). The client drains the entire chunk before forwarding a new observation to the server. During the round-trip latency needed to compute the next chunk, the queue is empty, leaving the robot incapable of acting." (accessed 2026-11-20; symbols and the fraction shown as plain text)
- Use in dive: section 17 formula, simplest form: the buffer must hold at least as many actions as will be consumed while waiting. The paper's `RobotClient` and `PolicyServer` are the removed `async_inference` module; the idea lives on as `refill_seconds` in v0.7.0 (F07-26), which expresses the same threshold in seconds.

**F07-117. The SmolVLA paper states no per-chunk latency in milliseconds on any named device; it claims the model can be "deployed on consumer-grade GPUs or even CPUs". LeRobot v0.7.0's docs give none either. No first-party latency for SmolVLA or ACT on a Jetson Orin Nano was located.**
- Location: SmolVLA paper, abstract and sections 3 and 4 (full text searched for "ms", "latency", "Hz", "CPU"); LeRobot `hardware_guide.mdx`, `inference.mdx`, `rtc.mdx`.
- Verdict: UNKNOWN (U5; closes register 02's U10 as "not published in the paper")
- Evidence: https://arxiv.org/abs/2506.01844v1 | Tier 3, preprint | benchmark claim (absence) | "a single GPU and deployed on consumer-grade GPUs or even CPUs" (abstract); the only time figures in the text are the control period "Delta-t = 33ms" and task-completion times (accessed 2026-11-20)
- Use in dive: section 17: the worked example cannot use a published Orin Nano figure for the arm's own policy. It uses the published GR00T N1.7 figure on "Jetson Orin" (F07-5) and says so. A Tier 0 measurement on our own device would close this (stream 08 owns experiments).

**F07-118. No first-party figure was located for the first and last links of the chain on an SO-101: camera exposure and readout time, USB transfer time, and the time for the servo bus write. What exists: the frame interval (33.3 ms at 30 fps), LeRobot's sample breakdown (observe 3.13 ms, send 0.40 ms, hardware unstated, F07-23), and the off-board chain measured by Physical Intelligence (F07-68).**
- Location: n/a (gap); see F07-23 and F07-68.
- Verdict: UNKNOWN (U11)
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/inference.mdx | Tier 1, first-party docs | documentation (sample output only) | "observe mean 3.13 ms · worst 9.00 ms" and "send mean 0.40 ms · worst 0.40 ms" (accessed 2026-11-20)
- Use in dive: section 17 latency-budget diagram: draw the six links, fill the measured ones, and show the camera and bus links as "not published; measure with the cadence report". A frame grabbed at a 30 fps camera can be up to one frame interval old, 33.3 ms, before any processing starts `[derived: 1 / 30 s]`.

### Wave 2 addition (2026-11-20)

**F07-119. NVIDIA's newer GR00T 2 (November 2026, whitepaper only, no released code or weights) reports 124 ms per action chunk on a Jetson Thor at 120 W for its Turbo variant on the Unitree G1 [vendor claim]. The GR00T N1.7 table (F07-4, F07-5) remains the newest for a model the reader can download.**
- Location: GR00T 2 whitepaper, Table 27; carried from F03-104 with its wave 2 scope note.
- Verdict: NEW (added in wave 2: register 07 did not mention GR00T 2; `wave2-C.md` register 07 row 7)
- Evidence: https://research.nvidia.com/labs/gear/gr00t-2/assets/gr00t2_whitepaper.pdf | Tier 2, first-party whitepaper | benchmark claim (vendor reported) | "GR00T 2 Turbo Jetson Thor (120 W) 720.41 123.97 5.81x" (Table 27 row as recorded in `wave2-A.md` row 72; accessed 2026-11-20)
- Use in dive: section 17, one sentence after the N1.7 latency table, so the page does not present N1.7 as NVIDIA's newest edge figure.

## 5. Teaching material

### Section 17, "Running on the Robot"

**The plain-words idea.** The robot's control loop sends a new target to the motors at a fixed rate, 30 times a second on the SO-101, so it has 33.3 ms per step. A large policy takes longer than that to answer: 149 ms on a Jetson Orin for GR00T N1.7 (F07-5). The loop survives because the policy does not answer one step at a time. It returns a chunk, a list of the next 40 or 50 actions, and the loop plays the list back while the model works on the next one (F07-12, F07-62). The remaining difficulty is the seam between two lists, since the new list was computed from a camera image that is already several steps old (F07-64). Real-time chunking fixes the seam: the actions that will have run by the time the new list arrives are treated as fixed, and the model fills in the rest so that it continues from them (F07-65).

A second idea sits beside it. The model the robot runs is not the file that training produced. It is compiled for one kind of GPU into an "engine", often with its numbers stored in fewer bits, and that engine only loads on the kind of device it was built on (F07-77, F07-79).

**Worked example on the arm task (real figures, with the invented ones labelled).**

Inputs: the SO-101 follower has 6 servos; the LeRobot commands use cameras at 640x480 and 30 fps and a default `--fps` of 30 (F07-19, F07-31); the policy returns chunks of 50 actions (SmolVLA and pi0.5 defaults, register 02). No first-party latency exists for a policy on an Orin Nano (F07-117), so the example borrows the one published Orin figure: GR00T N1.7, 149.0 ms with TensorRT, 357.9 ms in plain PyTorch (F07-5). That model's own chunk is 40 actions; 50 is used here to match the arm's policies. Treat the pairing as an illustration.

1. Control period: dt = 1 / 30 s = 33.3 ms. A chunk of 50 actions is 50 x 33.3 ms = 1.667 s of motion.
2. Inference delay in steps: d = floor(149.0 / 33.3) = floor(4.47) = 4 by the paper's definition (F07-63). The fifth action is partly consumed too, so a careful controller budgets 5. The LeRobot client does this by taking the recent maximum turnaround plus one period: 0.149 + 0.033 = 0.182 s, which is 5.5 periods (F07-26).
3. Synchronous execution (LeRobot's default): the arm runs 50 actions, then stands still for 149 ms while the model computes. Idle share: 149 / (1667 + 149) = 8.2% of the time, as a visible pause every 1.8 s. In plain PyTorch: 357.9 / (1667 + 357.9) = 17.7%.
4. Asynchronous execution: with the default `refill_seconds = 0.5`, the client asks for the next chunk when 0.5 s of actions remain, that is 15 actions (0.5 x 30). While the model computes for 149 ms, about 5 of those 15 are consumed; 10 remain when the new chunk lands. No pause.
5. Feasibility check: the latency must be under half the chunk, 149 ms against 833 ms. Passed with room (F07-22). The SmolVLA form of the same check: g >= (149 / 33.3) / 50 = 0.09, so any threshold above 9% of the chunk avoids an empty queue (F07-116).
6. What real-time chunking freezes: with `inference_delay = 5` and `execution_horizon = 10`, positions 0 to 4 of the new chunk are frozen to the values the old chunk already committed to (weight 1), positions 5 to 9 are pulled toward the old chunk with a weight that decays to 0, and positions 10 to 49 are generated freely (F07-15, F07-16, F07-65).
7. What it costs: guided real-time chunking made pi0.5 28% slower per call on an RTX 4090, 97 ms against 76 ms (F07-67). Applied to 149 ms as an illustration only: about 191 ms, d = 5, still far inside the budget. The trained variant has no such cost but needs a checkpoint trained for it (F07-70).
8. The limit: at the published injected-delay test, a 50-action chunk at 50 Hz tolerated d = 16, about 320 ms, with no loss (F07-69). At 30 Hz, 16 steps is 533 ms.

Engine example: the trained checkpoint is exported once to ONNX. On a Thor robot the build produces engines stamped with compute capability 11.0; on an Orin robot, 8.7 (F07-79). Copy the Thor engine to the Orin and it "will fail to deserialize". Each build takes about 2 to 5 minutes on the device (F07-8). A fleet with both robot types therefore keeps one ONNX set and two engine sets, and rebuilds both when a JetPack update changes the TensorRT version.

**The mechanism.**

- Chunked playback. The policy maps one observation (camera images, 6 joint positions, the instruction text) to a tensor of shape (H, action_dim): H future actions, each a vector of 6 joint targets for the arm. The control loop pops one row per tick (F07-30 shows the simplest broker).
- Asynchronous refill. A background thread or a remote server computes the next chunk while rows are still being popped. The condition for never running dry: d <= H - s, where d = floor(delta / dt) is the latency in steps, H the chunk length, s the number of actions executed per chunk (F07-63).
- Real-time chunking, guided mode. The model generates a chunk by starting from noise and refining it over n denoising steps (flow matching). At each step a correction term is added that pulls the chunk toward a target Y, the leftover actions of the previous chunk, weighted per position by a mask W: W_i = 1 for i < d (frozen), a decaying weight for d <= i < H - s, and 0 for i >= H - s (F07-66). Computing that correction needs a gradient through the model, one backward pass per denoising step, and the strength is clipped at a maximum guidance weight beta (LeRobot's `max_guidance_weight`, default 10.0, F07-14).
- Real-time chunking, trained mode. During training a delay d is sampled per example; the first d actions are given to the model clean, with their flow-matching time set to "done", and the loss covers only the remaining positions. At run time the prefix is fed in directly (F07-70).
- Compilation. Each sub-network (vision encoder, language model, action head and small encoders: seven for GR00T N1.7, F07-7) is exported to ONNX and compiled by TensorRT into an engine for the local GPU. Quantisation inserts quantise and dequantise nodes into the ONNX graph, with scale factors found by running a few real observations (10 samples in NVIDIA's recipe, F07-58). Sensitive layers stay at higher precision (F07-57).
- Precision formats in use in 2026: BF16 as the unquantised default for these policies; FP16 unusable for pi0.5 (F07-53); FP8 and NVFP4 on Thor's Blackwell GPU (F07-56, F07-81); INT8 and INT4 documented by TensorRT and not used in either policy recipe read here (F07-81).

**What it costs in compute.**

| Item | Figure | Loads | Entry |
|---|---|---|---|
| GR00T N1.7 call, Jetson Orin, TensorRT | 149.0 ms median | GPU tensor cores, shared memory | F07-1, F07-5 |
| GR00T N1.7 call, AGX Thor, TensorRT / mixed NVFP4 | 76.8 ms / 35.6 ms | GPU tensor cores | F07-4 |
| GR00T N1.7 call, DGX Spark, TensorRT | 116.6 ms | GPU tensor cores | F07-6 |
| pi0.5 call, AGX Thor, BF16 / FP8 / FP8+NVFP4 | about 132 / 54 / 49 ms | GPU tensor cores | F07-51 |
| pi0.5 call, AGX Orin / AGX Thor, BF16, older stack | 310.4 / 127.2 ms | GPU tensor cores | F07-73 |
| pi0.5 call, RTX 4090: plain / guided RTC | 76 / 97 ms | GPU; the extra is a backward pass per denoising step | F07-67 |
| Split of one pi0.5 call | image encoders 18 ms, language-model prefill 44 ms, 5 denoising steps 14 ms | GPU | F07-67 |
| Off-board round trip beyond the model | network 6.89 ms, image resize 1.44 ms, other 3.00 ms (desktop); 21.20, 11.22, 9.67 ms (small on-robot PC) | network, CPU | F07-68 |
| Engine build | about 2 to 5 minutes per device type, 16 GB or more of GPU memory recommended | GPU and CPU of the target device | F07-8 |
| Weights on disk | pi0.5 "~6 GB+" | storage, then shared memory | F07-54 |
| Device power | Orin Nano 7 to 25 W; AGX Orin 15 to 60 W; T4000 40 to 70 W; T5000 40 to 130 W | battery or supply | F07-35, F07-36, F07-39 |
| Video encode for recording | hardware on AGX Orin and Thor; CPU cores on Orin Nano | video encode engine or CPU | F07-37, F07-40 |

### Section 18, "The Fleet"

**The plain-words idea.** One robot becomes many, and three things have to move. A new policy has to reach every robot without breaking the ones that work. Evidence of how the policy behaves has to come back. And the path from "a robot failed" to "a better policy is installed" has to be short enough to matter. On AWS the first is a Greengrass deployment carried by an IoT job, which spreads the update at a rate you set and stops spreading when too many robots report failure (F07-91 to F07-95). The second is files uploaded to S3, chosen on the robot because nobody can upload everything (F07-102, F07-106, F07-113). The third has one published measurement: about 40 seconds each way for 16 robots (F07-109).

**Worked example on the arm task (real limits, invented fleet labelled).**

Illustration: 100 SO-101 stations, each a Jetson running LeRobot under Greengrass, all in one thing group. A new policy version is ready.

1. Packaging. The engine is not shippable as one artifact for a large policy: pi0.5's weights are "~6 GB+" against a 2 GB per-component limit (F07-54, F07-87). The component carries a container image reference pinned by digest, or a script that pulls the weights from S3 (F07-88). Because engines are per device type, the component for Orin stations and the one for Thor stations differ, or the component builds the engine on first start, taking 2 to 5 minutes (F07-8).
2. Canary. Job 1 targets 5 robots with a constant rate of 1 per minute (the minimum, F07-92): 5 minutes to notify all five. Abort rule: after at least 5 notified, cancel if 20% or more report failure (F07-94). One bad robot of five is 20%, so one failure stops it.
3. Trial period. Each canary robot holds its job `IN_PROGRESS`, runs 20 pick-and-place episodes (illustration), and reports `SUCCEEDED` only if its success count is no worse than before. Without this step the job only proves the software installed (F07-89, F07-96).
4. Fleet. Job 2 targets the other 95 with an exponential rate: base 1 per minute, increment factor 2 (allowed range 1.1 to 5), rate increase every 10 successes (illustration, scaled down from AWS's 1,000 in F07-93). Following AWS's table pattern the rate goes 1, 2, 4, 8 per minute as successes reach 10, 20, 30, 40. Notification alone would take 10 + 5 + 2.5 + 1.25 + ... minutes, under 20 minutes for 95 robots; in practice the trial period of step 3 sets the pace, because the rate rises only on reported successes.
5. If it goes wrong at robot 30. The abort cancels the 65 queued robots. The 30 that already updated keep the new policy (F07-95). Putting them back is a new deployment that pins the previous version.
6. Not mid-motion. Greengrass by default notifies the component and waits 60 s before updating it (F07-90). The policy component defers while an episode is running, and the timeout is set above the longest episode.
7. What comes back. Raw video from two 640x480 cameras at 30 fps is 2 x 921,600 x 30 = 55.3 MB/s. That cannot go through IoT Core (128 KB per message, 512 KB/s per connection, F07-97). Encoded at the 68:1 ratio one sizing paper assumes, it is about 0.8 MB/s (F07-107); a 30-second episode is then about 24 MB with its joint data (illustration). If each station saved 100 such episodes a day the fleet would upload 100 x 100 x 24 MB = 240 GB a day (illustration). Saving only failures and human corrections (F07-111, F07-113) cuts that by whatever the success rate is: at 90% success, 24 GB a day.

**The mechanism.**

- Delivery: a component recipe names artifacts and lifecycle commands; a deployment maps component versions to a thing or thing group; the nucleus on each device downloads, installs, starts, and reports; on failure it rolls back by default (F07-84, F07-89).
- Spread control: the IoT job under the deployment notifies devices at `maximumPerMinute` or at an exponential rate, and evaluates abort criteria on reported statuses (F07-92, F07-94).
- Upload: the robot writes each episode to local storage, then uploads to S3 in parts so a dropped link costs one part (F07-102); stream manager can queue and throttle the export (F07-103). MQTT carries only small messages: status, events, "new version" notices (F07-97).
- Selection on the robot: a ring buffer holds the last N seconds; a trigger makes it permanent. Triggers with a first-party source: a human takeover (F07-110, F07-113) and a learned failure score on the policy's internal features (F07-111).
- Closing the loop: uploaded episodes become training data; the learner publishes weights; robots load them at an episode boundary (F07-108).

**What it costs in compute.**

| Item | Figure | Loads | Entry |
|---|---|---|---|
| Delivery agent on the robot | nucleus: Java, 96 MB RAM minimum on Linux; nucleus lite: under 15 MB RAM | CPU, shared memory | F07-84, F07-85 |
| Rollout control | no GPU; job rate 1 to 1000 per minute base | AWS control plane | F07-92 |
| Loop latency, 16 robots | episode to learner 41 s median, 148 s p99; model to robot 38 s median, 55 s p99 | network, object storage, learner | F07-109 |
| Fleet learner | "multi-host" program; GPU type and count not stated | GPUs (U19) | F07-108 |
| Modelled sensor-rich robot | 38.41 MB/s, 3.32 TB per robot per day if recording 24 hours | video encode engine, storage, uplink | F07-106 |
| Modelled fleet of 120 | 4.61 GB/s, 11.95 PB per 30 days | storage, network | F07-106 |
| Live video to KVS | up to 12.5 MB/s per stream | video encode engine, uplink | F07-104 |
| Failure detector | a small network on existing features; overhead not stated | GPU, marginal (U17) | F07-111 |

## 6. Stale or wrong in the seed research

| Seed file | Seed claim | What the source says now | Entry |
|---|---|---|---|
| seed 04, section 1.1 | JetPack 7 "supports Jetson Thor"; JetPack 6 is the Orin line | JetPack 7.2 (2026-06-01) extended the 7 line to Orin; current is JetPack 7.2.2 with Jetson Linux 39.2.2 for Thor and the Orin family. NVIDIA's own FAQ still carries the old sentence | F07-44, F07-49 |
| seed 04, section 1.1 | AGX Orin 32GB: "200" sparse INT8 TOPS | 241 TOPS with JetPack 7.2 Super Mode (the page's top table); the lower table still says 200 | F07-38 |
| seed 04, section 1.1 | Thor family is T4000 and T5000 | T3000 (865 FP4 TFLOPS, 32 GB) and T2000 (400, 16 GB) announced 2026-07-15, available Q1 2027 | F07-41 |
| seed 04, section 1.1 | "Price shock, July 2026 ... 33-101%", with launch prices | The first-party FAQ confirms today's prices only; the rise and its size are press-sourced and not verifiable first-party | F07-42, F07-43 |
| seed 04, section 1.1 | DGX Spark "$3,999 to $4,699", then "$6,950" | No price on NVIDIA's product page; not carried | F07-48 |
| seed 04, section 1.1 | TensorRT support matrix cited at a "10.x.x" URL from a search summary | TensorRT is 11.5.0 (2026-11-18); the portability sentences were re-read at 11.5, and hardware compatibility mode is explicitly unsupported on JetPack | F07-76 to F07-78 |
| seed 04, section 1.2 (via seed 01) | GR00T N1.7 "~28 Hz on Jetson AGX Thor with TensorRT" | True only for the optimised mixed-NVFP4 path (35.6 ms); the plain TensorRT pipeline is 76.8 ms, 13 Hz | F07-4 |
| seed 04, section 1.2 | Quantisation fidelity is reported only as cosine similarity | Still true for pi0.5. For GR00T N1.7 NVIDIA now also asserts unchanged task success, without a figure; the repository has one 20-episode check of the unquantised engine | F07-10, F07-52, F07-59 |
| seed 04, section 1.3 | TensorRT Edge-LLM "release/0.9.1-mlpinf"; no VLA support mentioned | Release 0.12.0 (2026-11-13) adds GR00T N1.7 FP16 policy inference and a pi0.5 engine builder | F07-82 |
| seed 04, section 2.2 | LeRobot async inference: `RobotClient`, `PolicyServer`, `chunk_size_threshold` 0.5 to 0.6, transport "gRPC ... NOT VERIFIED" | Removed in v0.7.0. Remote inference uses Zenoh, a policy server and `refill_seconds` (default 0.5 s) | F07-25, F07-26 |
| seed 04, section 2.3 | PI blog: RTC "remains completely unchanged up to +200ms" (from a search result) | The paper's own words: "completely robust to injected delay, showing no degradation" at +100 and +200 ms | F07-69 |
| seed 04, open questions | RTC latency table for mobile versus static robots "cut off in extraction" | Read in full: 138.98 ms and 108.76 ms totals with component lines | F07-68 |
| seed 04, section 3.5 | FleetWise cut-off date "April 30, 2026" (search result) | The availability page states closure to new customers; the date was not re-verified and is not carried | F07-101 |
| seed 04, section 5 | RoboMaker notice wording and its pointer to AWS Batch (search snippets) | RoboMaker docs return 404; the shutdown date is verified, the recommendation is not | F07-98, F07-100 |
| seed 04, section 3.1 | Nucleus lite changelog to 2.5.0 | Docs changelog reaches 2.5.1; GitHub's newest release is v2.7.0 (2026-09-25) | F07-85 |

Seed claims confirmed unchanged on re-fetch: Jetson list prices (F07-42); T5000 and T4000 specifications (F07-39); openpi on Thor figures (F07-51); arXiv 2610.19656 Table 6 (F07-73); training-time RTC latency figures (F07-71); Greengrass quotas and policy defaults (F07-87, F07-89, F07-90); IoT jobs rollout and abort (F07-92 to F07-95); IoT Core quotas (F07-97); the full-shutdown dates (F07-98, F07-99); KVS quotas (F07-104); the 3.32 TB model (F07-106); LWD loop latencies (F07-109); Local Zone GPU lists (F07-115).

## 7. Mental models worth teaching

1. **The loop is fast, the model is slow, and a buffer sits between them.** The control loop pops one action per tick from a list; the model's only job is to refill the list before it empties. Everything else in section 17 follows (F07-12, F07-62, F07-63, F07-116).
2. **Latency is counted in control steps, not milliseconds.** d = floor(latency / period). The same 149 ms is 4 steps at 30 Hz and 7 at 50 Hz, and d is what the feasibility rule and the training setting use (F07-63, F07-71).
3. **A chunk has three zones: frozen, guided, free.** The first d actions are already committed, the next few are pulled toward the old plan, the tail is new. That picture is the whole of real-time chunking (F07-65, F07-66, F07-16).
4. **You can pay for the seam at run time or at training time.** Guided mode costs a backward pass per denoising step (28% slower in the paper); trained mode costs nothing at run time and fixes the tolerated delay when the model is trained (F07-67, F07-70, F07-18).
5. **A latency number belongs to a stack.** The same model on the same device class measured 209.9 ms and 149.0 ms under two software stacks, and a JetPack update alone was worth 13% (F07-74, F07-60). Device, runtime, precision, cameras, denoising steps: all five, or the number means little.
6. **An engine is a compiled binary for one GPU type.** ONNX is the portable hand-off; the engine is rebuilt per device type and per TensorRT version, and refuses to load elsewhere (F07-77, F07-79, F07-8).
7. **Quantisation is per layer, and its evidence is thin.** Different parts of one model run at FP32, FP8 and NVFP4; half the speedup came from caching, not from fewer bits; and the published proof of unchanged task success is one 20-episode check and an unquantified sentence (F07-57, F07-10, F07-59).
8. **A rollout has a brake and no reverse gear.** Abort cancels queued devices only; robots already updated stay updated until a second deployment (F07-95).
9. **The fleet service knows whether software started, not whether the robot is any good.** Rollback and abort act on install failures and on statuses the device chooses to report, so the robot must turn task results into a status (F07-89, F07-96).
10. **Small messages one way, big files another.** MQTT tops out at 128 KB per message; one raw camera frame is seven times that. Control and status go over MQTT, episodes go to S3 as files, and the robot decides which episodes are worth sending (F07-97, F07-102, F07-113).

## 8. Contradictions between sources

| Topic | Source A | Source B | How to handle |
|---|---|---|---|
| GR00T N1.7 on AGX Thor, optimised mixed NVFP4 | Isaac-GR00T README: 35.6 ms, two cameras (F07-1) | Jetson AI Lab tutorial: about 40 ms ("39.9 ms"), one camera (F07-56) | Both first-party. The repository table is newer (SHA of 2026-11-17 against a tutorial pinned to a 2026-07-08 commit). Cite the repository table and note the range |
| GR00T N1.7 on Jetson Orin, unquantised | Isaac-GR00T README: 149.0 ms (F07-5) | arXiv 2610.19656v3 Table 6: 209.9 ms (F07-73) | Different stacks: JetPack 7.2 with all engines compiled against Jetson Linux R36.5 with the backbone in PyTorch (F07-74). Not a conflict once the stack is named |
| GR00T N1.7 latency inside one paper | arXiv 2610.19656v3 introduction: "80.4ms ... on Jetson Orin and 150.9 ms on Jetson Thor" (F07-75) | Same paper, Table 6: 209.9 ms Orin, 101.1 ms Thor (F07-73) | Use Table 6; the introduction's figures are unexplained |
| TensorRT version in JetPack 7.2.2 | JetPack downloads page, introduction: "TensorRT 10.16.2" (F07-45) | Same page, version table: "11.4.1"; the TensorRT support matrix ties 11.4.1 to JetPack 7.2.2 (F07-76) | Unresolved from documents (U9). Isaac-GR00T pins 10.16.1.11 on Spark (F07-9). Check on a device |
| AGX Orin 32GB AI performance | Orin page top table: 241 TOPS (F07-38) | Same page, lower table: "200 SPARSE INT8 TOPS" | 241 is the Super Mode figure under JetPack 7.2; 200 is the earlier mode |
| JetPack for Orin | Jetson FAQ: JetPack 7 "will support Jetson Orin series 2026" (F07-49) | JetPack page: "full support for the NVIDIA Jetson Orin and Thor platform" | The FAQ sentence is stale |
| RTC prefix schedule default | LeRobot docs: `EXP` "recommended for getting started" (F07-16) | LeRobot code: default `LINEAR`, with the comment "Todo change to exp" (F07-14) | Code is the authority: the default is `LINEAR`; pass `EXP` explicitly to match the paper's soft mask |
| Thor versus Orin | NVIDIA product page: "7.5x the performance" (F07-39) | Measured on GR00T N1.7: 1.94x (vendor table) to 2.08x (paper) (F07-5, F07-73) | The 7.5x is a peak-arithmetic marketing ratio across different units; use the measured ratios for latency |
| Nucleus lite newest version | AWS docs changelog: 2.5.1 (F07-85) | GitHub releases: v2.7.0, 2026-09-25 | GitHub is newer; the docs page lags |
| Snowball Edge | KVS Edge Agent page lists it as an install target (F07-105) | Full-shutdown table: ended November 12, 2025 (F07-99) | The KVS page is stale on this point |
| RTC paper venue | Register 01 (F01-80): venue not confirmed | arXiv comments field: "published in NeurIPS 2025" (F07-61) | Confirmed; registers 01 and 02 can cite NeurIPS 2025 |

## 9. UNKNOWN register

| ID | Unknown | Where it arises | What would close it |
|---|---|---|---|
| U1 | Which Orin module "Jetson Orin (MAXN)" is in the Isaac-GR00T table (AGX Orin 64GB is likely; not stated) | F07-5 | The benchmark script's device log, or an issue on the repository |
| U2 | Thor video encode and decode stream counts per resolution | F07-40 | The Jetson Thor module datasheet |
| U3 | Worst-case (p99 or maximum) policy latency on any Jetson; every first-party figure is a median or mean | F07-3 | A Tier 0 run with the LeRobot cadence report, which prints "worst" |
| U4 | Task success of a quantised (FP8 or NVFP4) policy with episode counts, on any device | F07-10, F07-52, F07-59 | A first-party table with success rates before and after quantisation; none located |
| U5 | SmolVLA and ACT per-chunk latency on an Orin Nano or a laptop GPU | F07-33, F07-117 | A Tier 0 measurement (stream 08) |
| U6 | A published latency tolerance for LeRobot remote inference, and a measured robot-to-Local-Zone round trip | F07-29, F07-115 | LeRobot states its remote path is not validated beyond a lab network; a Tier 0 test |
| U7 | Whether and by how much Jetson list prices rose in July 2026 | F07-43 | An archived copy of the NVIDIA FAQ from before July 2026 |
| U8 (CLOSED by wave 2 to the build date: `nvidia-l4t-core 39.2.2-20261112230500`, packages built 12 November 2026) | Release date of JetPack 7.2.2 | F07-44 | The Jetson Linux 39.2.2 release notes |
| U9 (CLOSED by wave 2: 11.4.1; apt index `nvidia-tensorrt 7.2.2-b56 => tensorrt-libs (= 11.4.1.31-1+cuda13.4)`; 10.16.2 was JetPack 7.2 and 7.2.1) | Which TensorRT version JetPack 7.2.2 installs (10.16.2 or 11.4.1) | F07-45 | `dpkg -l` on a flashed device, or the Jetson Linux release notes |
| U10 | DGX Spark current price | F07-48 | NVIDIA marketplace page (did not load) |
| U11 | Camera exposure and readout, USB transfer and servo bus write times on an SO-101 | F07-118 | Tier 0 timing; the camera's datasheet |
| U12 | Whether an engine built on a T5000 loads on a T4000 (same compute capability 11.0) | F07-80 | TensorRT docs for Jetson, or a test |
| U13 | Which precisions (FP8, FP4) TensorRT 11.5 accelerates on compute capability 8.7 (Orin) and 11.0 (Thor); the matrix is loaded interactively | F07-81, F07-83 | The support matrix's precision explorer, read in a browser |
| U14 | Policy latency under TensorRT Edge-LLM 0.12.0 | F07-82 | The project's performance-benchmarks page |
| U15 | AWS's stated replacement for RoboMaker, from a first-party page | F07-100 | An archived copy of the RoboMaker end-of-support notice |
| U16 | Whether the KVS Edge Agent is still actively offered (access by form; a stale install option on the page) | F07-105 | The KVS document history page |
| U17 | SAFE's added latency per step | F07-111 | Not stated: the full text was searched for a time figure and none was found. An author statement or a measurement |
| U18 | A named operator's first-party description of shadow-mode or canary rollout of a learned policy | F07-114 | A company engineering post; none located by this pass or the seed |
| U19 | GPU type and count of the fleet learner in "Learning While Deploying" | F07-108 | Not stated in v4 (full text searched for GPU and accelerator names; only "all local accelerators" appears). An author statement |
| U20 | Whether a `docker:` image artifact counts against the 2 GB component artifact quota | F07-87, F07-88 | The Greengrass quota notes or a test deployment |

## 10. Reading path for Carlos

1. **Isaac-GR00T `scripts/deployment/README.md` at SHA 708617f5, sections "Performance" and "Build TRT Engines"** (https://raw.githubusercontent.com/NVIDIA/Isaac-GR00T/708617f5716c63fc0a327391492ea2b91977ae90/scripts/deployment/README.md). One table, six devices, four runtimes: the fastest way to see what a device and a compiler are each worth.
2. **Real-time chunking paper, arXiv 2506.07339v2: Figure 2, Figure 3, section 3.2, then appendix A.3 Tables 2 and 3.** The two figures are the idea; Table 2 is the only measured camera-side-to-action latency budget found; Table 3 shows where one model call's time goes.
3. **LeRobot `docs/source/rtc.mdx` and `docs/source/remote_inference.mdx` ("Parameters that matter" and the tuning section) at v0.7.0.** The same idea as runnable flags on an SO-100 or SO-101, and the plain statement of the limit ("no refill value fixes that").
4. **LeRobot `docs/source/inference.mdx`, "Cadence Reporting".** What to run on our own arm to fill the unknowns: it prints the per-stage breakdown and the worst case.
5. **Jetson AI Lab, "GR00T N1.7 on Thor", section "How the Optimization Works"** (https://www.jetson-ai-lab.com/tutorials/groot_n17_on_thor/). Per-layer precision and the caching trick, with before and after per component. Read it knowing it asserts task success without a number.
6. **TensorRT docs, "Engine Compatibility", sections "Hardware Compatibility" and "Compatibility Checks"** (https://docs.nvidia.com/deeplearning/tensorrt/latest/inference-library/engine-compatibility.html). Ten minutes; settles why engines are per device.
7. **Training-time RTC, arXiv 2512.05964v2, section III and the 20-line code listing in the appendix.** The whole method is a mask on the flow-matching time.
8. **AWS IoT "Job configurations" page, "Job rollout rates" and the abort note** (https://docs.aws.amazon.com/iot/latest/developerguide/jobs-configurations-details.html), then the two Greengrass API pages `DeploymentPolicies` and `DeploymentComponentUpdatePolicy`. The rollout example table and the three defaults that decide what happens to a robot mid-task.
9. **"Learning While Deploying", arXiv 2605.00416v4, the infrastructure appendix (Fig. 10 and Table VI).** The one published fleet loop with numbers on it.
10. **"Services in Full Shutdown"** (https://docs.aws.amazon.com/general/latest/gr/full_shutdown_services.html). One screen; what not to design around.

## 11. Source list by tier

**Tier 1: code at a pinned ref, official docs, API references, release notes**
- huggingface/lerobot at tag v0.7.0, SHA 410c095eacc0011d998a73383eb94abed2715af0: `docs/source/{rtc,inference,remote_inference,hardware_guide,installation}.mdx`, `src/lerobot/policies/rtc/configuration_rtc.py` (raw URLs in the entries)
- NVIDIA/Isaac-GR00T at SHA 708617f5716c63fc0a327391492ea2b91977ae90 (head of the default branch, 2026-11-17): `scripts/deployment/README.md`; repository root https://github.com/NVIDIA/Isaac-GR00T
- Physical-Intelligence/openpi at SHA 215abfb217dbac7d5f1273282331b9b1866c0479 (head of the default branch, 2026-08-24): `docs/remote_inference.md`, `packages/openpi-client/src/openpi_client/action_chunk_broker.py`, `README.md`; repository root https://github.com/Physical-Intelligence/openpi
- NVIDIA/TensorRT release v11.5: https://github.com/NVIDIA/TensorRT/releases/tag/v11.5
- NVIDIA/TensorRT-Edge-LLM release v0.12.0: https://github.com/NVIDIA/TensorRT-Edge-LLM/releases/tag/v0.12.0
- aws-greengrass releases: https://github.com/aws-greengrass/aws-greengrass-nucleus/releases/tag/v2.18.4 ; https://github.com/aws-greengrass/aws-greengrass-lite/releases/tag/v2.7.0
- TensorRT 11.5.0 docs: https://docs.nvidia.com/deeplearning/tensorrt/latest/getting-started/release-notes-11/11.5.0.html ; https://docs.nvidia.com/deeplearning/tensorrt/latest/getting-started/support-matrix.html ; https://docs.nvidia.com/deeplearning/tensorrt/latest/inference-library/engine-compatibility.html ; https://docs.nvidia.com/deeplearning/tensorrt/latest/inference-library/work-quantized-types.html
- NVIDIA product and release pages: https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-orin/ ; https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-orin/nano-super-developer-kit/ ; https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-thor/ ; https://www.nvidia.com/en-us/products/workstations/dgx-spark/ ; https://docs.nvidia.com/dgx/dgx-spark/hardware.html ; https://developer.nvidia.com/embedded/faq ; https://developer.nvidia.com/embedded/jetpack ; https://developer.nvidia.com/embedded/jetpack/downloads
- AWS IoT Greengrass V2: https://docs.aws.amazon.com/greengrass/v2/developerguide/greengrass-nucleus-component.html ; https://docs.aws.amazon.com/greengrass/v2/developerguide/greengrass-nucleus-lite-component.html ; https://docs.aws.amazon.com/greengrass/v2/developerguide/operating-system-feature-support-matrix.html ; https://docs.aws.amazon.com/greengrass/v2/developerguide/run-docker-container.html ; https://docs.aws.amazon.com/greengrass/v2/developerguide/manage-data-streams.html ; https://docs.aws.amazon.com/general/latest/gr/greengrassv2.html ; https://docs.aws.amazon.com/greengrass/v2/APIReference/API_DeploymentPolicies.html ; https://docs.aws.amazon.com/greengrass/v2/APIReference/API_DeploymentComponentUpdatePolicy.html ; https://docs.aws.amazon.com/greengrass/v2/APIReference/API_DeploymentIoTJobConfiguration.html
- AWS IoT: https://docs.aws.amazon.com/iot/latest/developerguide/jobs-configurations-details.html ; https://docs.aws.amazon.com/iot/latest/apireference/API_JobExecutionsRolloutConfig.html ; https://docs.aws.amazon.com/iot/latest/apireference/API_ExponentialRolloutRate.html ; https://docs.aws.amazon.com/iot/latest/apireference/API_AbortCriteria.html ; https://docs.aws.amazon.com/general/latest/gr/iot-core.html
- AWS other: https://docs.aws.amazon.com/general/latest/gr/full_shutdown_services.html ; https://docs.aws.amazon.com/iot-fleetwise/latest/developerguide/iotfleetwise-availability-change.html ; https://docs.aws.amazon.com/kinesisvideostreams/latest/dg/edge.html ; https://docs.aws.amazon.com/kinesisvideostreams/latest/dg/limits.html ; https://docs.aws.amazon.com/AmazonS3/latest/userguide/qfacts.html ; https://aws.amazon.com/about-aws/global-infrastructure/localzones/features/

**Tier 2: first-party vendor or lab blogs and tutorials**
- https://www.jetson-ai-lab.com/tutorials/openpi_on_thor/
- https://www.jetson-ai-lab.com/tutorials/groot_n17_on_thor/
- https://developer.nvidia.com/blog/deploy-agentic-ready-ai-at-the-edge-with-memory-efficiency-in-nvidia-jetpack-7-2/ (2026-06-01)
- https://blogs.nvidia.com/blog/jetson-thor-robotics-edge-ai-agent/ (2026-07-15)

**Tier 3: papers**
- Real-time chunking: https://arxiv.org/abs/2506.07339v2 (peer-reviewed, NeurIPS 2025)
- SAFE: https://arxiv.org/abs/2506.09937v2 (peer-reviewed, NeurIPS 2025)
- Training-time RTC: https://arxiv.org/abs/2512.05964v2 (preprint)
- SmolVLA: https://arxiv.org/abs/2506.01844v1 (preprint)
- Perturbation Informed Execution: https://arxiv.org/abs/2610.19656v3 (preprint)
- The Robot Data Factory: https://arxiv.org/abs/2609.16705v1 (preprint)
- Learning While Deploying: https://arxiv.org/abs/2605.00416v4 (preprint)

**Tier 4: none cited.** Press and tracker sources named in the seed research (price-rise coverage, RoboMaker shutdown coverage) were not used.
