# TorchNeuron (Neuron 2.33.0): change plan across three dives

Stream `trainium`, branch `feat/2026-10-torchneuron`. Written 2026-10-24 after the three
research registers were complete. Evidence lives in
`deep-dives/silicon-memory-inference/research/2026-10-torchneuron/`:

- `01-primary-sources.md`: AWS docs at `/en/v2.33.0/`, What's New, PyTorch blog, aboutamazon,
  Hugging Face blog. Rows P1 to P74, E1 to E8, U1 to U11.
- `02-code.md`: torch-neuronx, vllm-neuron and torchtitan-neuron at tags. Rows C1 to C32.
- `03-semianalysis.md`: the SemiAnalysis report, public portion only. Rows SA1 to SA44.

Every row cited below by number resolves in those files.

## Pins (verified 2026-10-24)

| Source | Pin |
| --- | --- |
| Neuron docs | `https://awsdocs-neuron.readthedocs-hosted.com/en/v2.33.0/` (SDK 2.33.0 released 2026-10-19) |
| aws-neuron/torch-neuronx | tag `v2.33.0` = `b1b6c66a2be28bce3bed6ef20632f0d3164119ef` (only tag; published wheel 2.14.3.0.281 matches it, C31) |
| vllm-project/vllm-neuron | tag `v0.29.0.1.2.0` = `eb6cb360f7cff6082e22a9437d8ce0ba3891304a`; previous `v0.24.0.1.1.0` = `ed3580d01e8632897b29986ab7532d8c5925846f` |
| aws-neuron/torchtitan-neuron | tag `release-2.33.0` = `b7582e986586051d7be85d03956afe169624aeda` |
| vllm-project/vllm | the vLLM dive stays pinned to `v0.31.0` (`db9527a4`); the plugin pins vLLM `v0.29.0` (`98dff2a8`) |

Citation form: `https://github.com/aws-neuron/torch-neuronx/blob/v2.33.0/<path>#L<a>-L<b>`
(tag pin, accepted by `scripts/gates/pinned-refs.sh`). Docs always at `/en/v2.33.0/`, never
`/en/latest/`.

## Tier decisions

- Neuron docs, release notes and pinned code: Tier 1.
- AWS What's New, aboutamazon.com, and the PyTorch blog post written by the TorchNeuron team:
  Tier 2. Every coverage or speed figure from them is a vendor claim (`kind="vendor-claim"`).
- Hugging Face blog `hf-torchneuron`: Tier 2, publisher Hugging Face. HF is first-party for its
  own libraries (TRL, Transformers); its 89% architecture figure is a Hugging Face claim.
  (Register 01 listed it as Tier 3 because AWS did not co-author it; for statements about HF's
  own libraries the vendor rule applies.)
- SemiAnalysis: Tier 3, attributed in the sentence. Disclose once per dive where it is cited:
  the AWS launch post thanks SemiAnalysis for feedback on TorchNeuron's design (SA4), and
  SemiAnalysis had Trainium3 rack access before publication.
- Code-derived facts with no AWS statement are category C and the page says "in the source"
  or "the code" for them. Doc-code conflicts name both sides; code wins.

## What the evidence changes, and what the reader gets

### silicon-memory-inference

1. **AwsCompilersAndTooling** (main home; one author agent; owns the section file,
   `src/sources/AwsCompilersAndTooling.ts`, `src/components/AwsCompilerStack.tsx` and a new
   `src/components/TorchNeuronStackDiagram.tsx`).
   - h1 intro: the stack now has two front ends. PyTorch on Trn2 and Trn3 is TorchNeuron
     (TorchDynamo or a per-op trace, StableHLO through a vendored torch-mlir, neuronx-cc);
     JAX, and PyTorch on Trn1 and Inf2, stay on XLA. Both end in a NEFF on the Neuron
     Runtime (P6, P23, P72, C5, C9). Stale: "A framework integration captures the model as
     an XLA graph" for all PyTorch.
   - "The default path, and where NKI enters": the React Flow stack's input edge reads
     "XLA graph"; relabel so it is true for both front ends, and fix "torch-neuronx
     captures a PyTorch model through PyTorch/XLA" (true only for the 2.9 XLA lineage).
   - New h2, the mental model: TorchNeuron registers Trainium as the PyTorch device
     `neuron` through PrivateUse1 (P1, P2, C1, C2); eager mode compiles each ATen op to
     its own NEFF on first use and caches it by shape (P4, C5), so intermediates go through
     HBM; `torch.compile(backend="neuron")` turns each FX graph into one NEFF through
     AOTAutograd and StableHLO with no Inductor (P5, P6, C9); NKI kernels enter both paths
     as custom ops (P9, C13, C32); collectives go through a `neuron` c10d backend, on the
     collective cores inside a node and EFA between nodes (P16, C14). One package name,
     two products: `torch-neuronx` 2.13/2.14 is TorchNeuron, 2.9 is the deprecated XLA build
     that Trn1 and Inf2 keep (P11, P13, P23, C3). New inline SVG diagram of this stack.
   - New h2, practical: getting a PyTorch model onto `neuron` and through torch.compile.
     Port: `.to("neuron")`, `torch.accelerator` code unchanged, `xm.xla_device()` goes
     (P19, P74). Compile: `dynamic=False`, `fullgraph=True` while developing, only
     `mode="default"` (P15, P37, C9, C10); pad or bucket shapes because each new shape is a
     new NEFF (P41, C10); grouped GEMMs (`torch._grouped_mm`) always break the graph, which
     matters for MoE (P38); a graph that fails to lower raises by default (P39, C11); eager
     mode runs unlowered ops on the CPU, and the code drops the log line for most of them,
     so check `torch_neuronx.get_fallback_ops()` (P18, P53, C8: doc-code conflict, code
     wins). Support boundary in 2.33.0: no `torch.sparse`, `torch.func`, `torch.nested`,
     `torch.distributions`, no TorchAO or composite MXFP8, most `torch.fft` on CPU, FP8 only
     on Trn3 (P17, P65, P66, C17); the per-API table marks some forward-mode AD paths `Y`
     while the release notes and blog exclude it (P58): say AWS excludes it. Maturity
     figures, demoted to an ExpandableSection, each labelled: AWS's 100k Hugging Face sweep
     95.6% eager, 96.6% compiled (P63) and upstream ATen 94.7% of enabled tests (P64),
     vendor claims; Hugging Face's 89% of the top 100 text-generation architectures (P71);
     SemiAnalysis's one Qwen3-32B run on 16 Trainium2 chips, compiled 1.28x eager and a first
     step of minutes (SA21, SA27), Tier 3 with the disclosure; our count of registered ATen
     overloads (C7) and skip-list entries (C16), category C.
   - "Two settings to choose before the first compile": the compile-cache paragraph
     (`/var/tmp/neuron-compile-cache`, `NEURON_COMPILE_CACHE_URL`, `torch_neuronx.trace`) is
     XLA-path behaviour. Scope it, and give TorchNeuron's cache: content-addressed NEFFs in
     `TORCH_NEURONX_NEFF_CACHE_DIR` (default `/tmp/neff_cache`), keyed on the compiler
     version, so upgrades recompile (P41, C6; C22 for the disable switch). Re-verify the
     `--auto-cast=none` default against neuronx-cc 2.28.7631.0; the TorchNeuron compile
     path passes `--auto-cast=none` itself (C9).
   - Component table: Neuron 2.33.0 versions (P21, E3).
   - "Which library to serve and train on": vLLM Neuron 0.29.0.1.2.0 compiles through the
     TorchNeuron lowering by default (P24, P47, C27); NxD Inference, the NxD Core inference
     APIs and PyTorch/XLA inference end on Trn2 and Trn3 in Neuron 2.34 (P29, P32, P33);
     training is TorchNeuron plus TorchTitan Neuron, a beta fork with validated configs and
     documented limits (P26, P51, P52, C24; SA16 contradicted). PyTorch/XLA training ended
     in 2.30 (P35).
   - Profiling: `torch.profiler` with `ProfilerActivity.PrivateUse1` and `NeuronConfig`
     writes traces Neuron Explorer opens (P20, P49, C20); the Memory Viewer attributes
     eager allocations to Python lines (P50); the device timeline has one row per engine and
     per DMA engine at instruction granularity (SA39, SA41). Neuron Observer is fleet health
     telemetry, not a profiler (P27). SemiAnalysis's verdict on profiler quality stays out
     as worded (SA36 OPINION); the mechanism behind it goes in.
   - NKI: 0.7.0 in 2.33.0; register a kernel with `torch_neuronx.nki_op`, or call a plain
     `@nki.jit` kernel on `neuron` tensors (P9, C13, C32).
2. **AwsCustomSilicon** (orchestrator edit, small). The MoE alert says the 2.32.0 guide lists
   `torch.all_to_all_vdev_2d` for future releases (E6 STALE): the op is absent from the
   2.33.0 docs and from the code (C14); the 2.33.0 guide names MoE dispatch and combine and
   `torch._grouped_mm` instead (P10, P38). The "Trn1 and Inf2" column gains the software
   path: PyTorch on them stays on the deprecated XLA build; TorchNeuron supports Trn2 and
   Trn3 (P14, P23; C18/C19: support is a doc statement, the code does not gate it).
   FP8 on TorchNeuron needs Trn3 (P17, C17).
3. **CommunicationAndScaleOut** (orchestrator edit, small). Same stale `all_to_all_vdev_2d`
   sentence (E6, C14). Add the `neuron` c10d backend (P16, C14) and the TorchTitan Neuron
   expert-parallel dispatcher on an NKI all-to-all-v (SA24, register 03). TokenSwitch is
   private and NVIDIA-only in PyTorch 2.14 (SA23).
4. **KernelExecutionLifecycle** (orchestrator edit, small). The Trainium2 host row says
   torch-neuronx traces into an XLA graph; on Trn2 and Trn3 it is TorchNeuron (C5, C9). The
   fusion paragraph gains the eager-versus-compiled point: eager runs one NEFF per op with
   intermediates in HBM; torch.compile gives neuronx-cc the graph to fuse (P4, P62).
5. **DeterminismAOT** (orchestrator edit, small). `XLA_USE_BF16=1` turning on stochastic
   rounding is XLA-path behaviour; scope it. Adaptive eager fusion can shift intermediate
   precision (P7).
6. **GlossaryAndSources**, `sources.md`, `README.md` (orchestrator): new acronyms (StableHLO,
   MLIR, FX, DDP, HSDP, SDPA, JVP, DLAMI, DLC, LNC, OTLP), regenerated bibliography.

### vllm

7. **AwsNeuron** (one author agent; owns the section file). The section's spine is the
   plugin's vLLM pin, and it moved: vllm-neuron 0.29.0.1.2.0 pins vLLM 0.29.0 for Neuron
   2.33 (P24, P56, C25), two minor releases behind the dive's v0.31.0 rather than seven. The
   default compile path is now native torch.compile through libtorch-neuronx-lite, a
   separate package with its own snapshot of the TorchNeuron compiler, on PyTorch 2.13
   (P47, P54, C26, C27, C29, C30). The XLA route is deprecated and ends in 2.34 (P34).
   Co-installing torch-neuronx needs `TORCH_DEVICE_BACKEND_AUTOLOAD=0` (P47, C30). Model
   Runner V2 is the default for dense models only (P56). Re-pin every vllm-neuron citation
   from `v0.24.0.1.1.0` to `v0.29.0.1.2.0`, re-verifying each line reference; update the
   stack diagram and the plugin table. Vendor speed claims ("up to ~2.5x" GPT-OSS-120B on
   Trn3 at batch 128) only as labelled vendor claims.
8. **DecisionGuide**, **GlossaryAndSources** (orchestrator): the plugin README link and line
   range move to the new tag; source id 37 re-pinned; glossary row for Neuron/NxDI updated.
   `sources.md` regenerated with `revamp/tools/gen-sources.mjs`.

### rl-agentic-loops

9. **research/2026-10/06-aws-paths.md** (one research agent). F06-47 is STALE: TorchNeuron
   is a public beta from 2.33.0 (E7). The RL statement on "What is AWS Neuron" remains with
   no procedure: GRPO, PPO, verl, TRL and RLHF return no hits in the v2.33.0 docs search
   (E7, U1). New findings: Hugging Face states TRL runs on the `neuron` device and recommends
   the libraries over Optimum Neuron, with static shapes under torch.compile (P71, SA15);
   the PyTorch blog says TRL supports Trainium upstream (P68); vLLM Neuron runs on the
   TorchNeuron lowering, the serving half of a rollout loop (P24, P47); TorchTitan Neuron
   covers pre-training configs only (P51). Anthropic trains and serves Claude on Trainium2
   (Anthropic post, SA1); RL rollouts on Trainium are SemiAnalysis-only (SA1 UNVERIFIABLE).
   The UNKNOWN "whether RL runs on the TorchNeuron beta" narrows but stays open.
10. **RESEARCH-GUIDE.md** item 6 and **SCOPE.md** section 23 (orchestrator): restate the
    open question with the narrower scope.

## What stays out, and why

- SemiAnalysis's hiring claim (SA9), "80,000 physical cores" for CI (SA6), the compile-time
  roadmap (SA30), the 60-70% MoE comms share (SA26), the AWS table with undefined columns
  (SA35), the matmul MFU comparison against GB300 (SA31), FlexAttention 89/96 (SA32) and the
  profiler superlatives (SA36, SA37, SA44): each is either a personnel or roadmap claim with
  no first-party source, an opinion, or a figure whose definition the public text does not
  give. None changes what the reader builds or how they model the system.
- The "85% of developers use PyTorch" line (P70): unsourced.

## Open items carried forward

U1 (RL procedure on TorchNeuron), U2 (neuronx-cc and symbolic shapes), U5 (Trn1 runtime
behaviour), U6 (libtorch-neuronx-lite internals and pin), U7 (`all_to_all_vdev_2d`), U8 (GA
date), U11 (sweep pass criterion), SA35's table definitions.
