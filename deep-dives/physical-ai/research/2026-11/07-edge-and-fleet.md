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

## 4. Claim register

Entries were written in the order the sources were read; the lettered headings group them by topic. Sections 2 (currency table) and 3 (pinned sources) sit above this register.

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
- Use in dive: section 17 currency: JetPack 7.2 now covers Orin as well as Thor. The pinned TensorRT 10.16 on Spark shows the device stack trails the newest TensorRT release (F07 section E).

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
- Use in dive: section 17, the cheapest NVIDIA device a reader would pair with an SO-101. Its 8 GB is one pool shared by the CPU and the GPU (F07-41), so an 8 GB device does not give a policy 8 GB of GPU memory.

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
- Use in dive: section 17 precision primer. Calibration: run a few real observations through the model to record the range of values each layer produces, so each layer's 4-bit or 8-bit grid can be scaled to fit. This is why the build needs data from the target robot, and why Orin (Ampere GPU, no FP8 or NVFP4 arithmetic) has no quantised row.

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

