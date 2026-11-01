# Claims: section 6, Precision for Training: BF16, FP8 & Microscaled Formats

File: `src/sections/Precision.tsx`. Every source below was re-opened on 2026-10-31 (arXiv PDFs via pdftotext, GitHub files at the pinned tags or Neuron SHA, vendor pages and the OCP PDF's Wayback copy), so every Cite carries the default accessed date. Derived figures were recomputed in Python from the inputs named. "Newly read" marks a source line read for this section that no register row quotes.

Pinned bases used below:
- TE = https://github.com/NVIDIA/TransformerEngine/blob/v2.21.0/
- MG = https://github.com/NVIDIA/Megatron-LM/blob/core_v0.20.0/
- TT = https://github.com/pytorch/torchtitan/blob/v0.4.0/
- NS = https://github.com/aws-neuron/aws-neuron-sdk/blob/10832bbcc6b6920b3046a7d7aa59b6b684f6b81a/

Format: claim | source URL | register, wave 2 row or experiment

## Header and intro

- H100 dense peaks: 1,979 TFLOPS FP8 and 989.5 TFLOPS BF16, each half NVIDIA's "with sparsity" figure (vendor specification) | https://www.nvidia.com/en-us/data-center/h100/ | T01-27; T05-14; W1-16; W1-25
- Training needs weight updates far smaller than the weights they change | https://arxiv.org/abs/1710.03740v3 (Section 3.1) | T01-39; W1-36
- 16 bytes per parameter of weights, gradients and optimizer state stay put across formats (header) | https://arxiv.org/abs/1910.02054v3 (Section 3.1) | T01-9; W1-30; W1-48

## A narrow format needs a scale factor

- FP16 turns any value below 2^-24 into zero | https://arxiv.org/abs/1710.03740v3 (Section 3.1) | T01-39
- E4M3 (4 exponent, 3 mantissa bits) tops out at 448 | https://arxiv.org/abs/2209.05433v2 (Table 1) | T01-42
- A tensor is stored as format values times a scale: multiply before the cast so the largest magnitude lands near the format's maximum, multiply by the inverse after | https://arxiv.org/abs/2209.05433v2 (Section 2) | T01-42 (newly read: Section 2 scaling text)
- Inference quantization scales and bit layouts live in the silicon dive, section 27 | ../silicon-memory-inference/ (internal link) | SCOPE section 6 diagram note
- Loss scaling: the original recipe used a constant factor from 8 to 32K, chosen so the largest gradient times the factor stays below 65,504; skipping the update on overflow was one option | https://arxiv.org/abs/1710.03740v3 (Section 3.2) | T01-40; W1-39
- Raising and lowering the factor by watching for overflow was proposed as future work | https://arxiv.org/abs/1710.03740v3 (Section 6) | T01-40; W1-39 (wording fix applied: "shared by every tensor", top rung "model")

## Where the scale factor lives

- Microscaled formats use smaller blocks to narrow the range each block has to cover | https://arxiv.org/abs/2509.25149v2 (Section 2) | T01-49
- BF16 keeps FP32's 8 exponent bits with 7 mantissa bits; largest value 3.38e38 against FP16's 6.55e4; trains without loss scaling; GEMMs take BF16 inputs and accumulate in FP32 | https://arxiv.org/abs/1905.12322v3 (Section 3, Table 1) | T01-41
- FP8's range cannot cover every tensor's values, so tensors carry their own scales; E4M3 for weights and activations, E5M2 (max 57,344) for gradients; skipping updates on overflow "not a good choice" for FP8 | https://arxiv.org/abs/2209.05433v2 (Sections 2 and 3, Table 1) | T01-42
- Transformer Engine DelayedScaling takes the scale from an amax history, 1,024 steps by default; Float8CurrentScaling from the current tensor; both default to HYBRID (E4M3 forward, E5M2 backward) | TE transformer_engine/common/recipe/__init__.py#L29-L52 and #L176-L321 | T01-44
- DeepSeek-V3: every FP8 matmul input in E4M3, one scale per 1 x 128 activation tile and per 128 x 128 weight block, computed online | https://arxiv.org/abs/2412.19437v2 (Section 3.3.2) | T01-46; W1-40 (wording fix applied: "every FP8 matrix multiply input", not "everywhere")
- DeepSeek-V3 kept embedding, output head, attention and normalization, among others, in BF16 or FP32 | https://arxiv.org/abs/2412.19437v2 (Section 3.3.1) | T01-47; W1-40
- MXFP8 block: 32 FP8 values (E4M3 or E5M2) sharing one 8-bit E8M0 power-of-two scale; (8 + 32 x 8) / 32 = 8.25 bits per value | https://web.archive.org/web/20251208023552/https://www.opencompute.org/documents/ocp-microscaling-formats-mx-v1-0-spec-final-pdf (Sections 5.1, 5.2, 5.4) | T01-48; U01-7 closed (wave2-step-maths G3); W1-44
- MX paper's training flow: matmuls in MX, vector operations such as normalization and softmax in BF16 or FP32 | https://arxiv.org/abs/2310.10537v3 (Section 4.1) | T01-48
- NVFP4: 16-value blocks, E4M3 block scales, one FP32 scale per tensor | https://arxiv.org/abs/2509.25149v2 (Section 2) | T01-49; W1-44
- Transformer Engine's NVFP4 recipe: 16 x 16 block scale for weights, stochastic rounding for gradients | TE transformer_engine/common/recipe/__init__.py#L502-L530 | newly read (NVFP4BlockScaling docstring)
- Diagram labels restate the five rungs above (FP16 one loss scale; BF16 none; FP8 per tensor; DeepSeek-V3 128 x 128 and 1 x 128; MXFP8 32; NVFP4 16 plus one per tensor); caption marks it schematic | as the rungs above | W1-39 (top rung "model"); W1-44
- Transformer Engine's block recipes MXFP8BlockScaling and Float8BlockScaling default to E4M3 | TE transformer_engine/common/recipe/__init__.py#L345-L430 | T01-44
- Per-tensor scales need E5M2's range for gradients and per-block scales do not (labelled our reading) | TE recipe L29-L52, L345-L430; https://arxiv.org/abs/2412.19437v2 | C01-7 [SPECULATIVE: our reading]
- Megatron Core example configurations pair `--fp8-format hybrid` with `tensorwise`, and `e4m3` with `blockwise` and `mxfp8` | MG docs/user-guide/features/low_precision_training.md#L140-L151, #L232-L242, #L244-L253 | T03-19 (newly read: example config lines)

## What each step down has cost in published runs

- FP8 proposal ran simulated FP8 (values clipped to FP8, arithmetic in 16-bit); within run-to-run noise of 16-bit training up to GPT 175B; perplexity 6.68 against 6.65 at 175B, compared at 75% of training because the BF16 baseline had not finished | https://arxiv.org/abs/2209.05433v2 (Sections 4 and 4.1, Table 4) | T01-43; W1-41 (both dropped conditions restored)
- DeepSeek-V3 FP8 recipe: relative loss error below 0.25% against BF16 on two smaller models (DeepSeek-V2-Lite and V2 scale) trained for about 1T tokens; not DeepSeek-V3's own run | https://arxiv.org/abs/2412.19437v2 (Section 3.3) | T01-47; W1-42
- NVFP4 on a 12B hybrid Mamba-Transformer, 10T tokens: below 1% relative loss error against FP8 in the stable phase, slightly above 1.5% during learning-rate decay | https://arxiv.org/abs/2509.25149v2 (Section 3) | T01-50; W1-43
- That run kept 16% of linear layers (first two and last eight blocks) in BF16 | https://arxiv.org/abs/2509.25149v2 (Section 4.1) | T01-50; W1-43
- No independent production report of NVFP4 pretraining was located in this research | (search scope of registers 01 and wave2-step-maths) | hedge, scope kept
- The later two results keep some layers in higher precision; the FP8 proposal clipped all GEMM inputs | sources of the three rows above | derived from T01-43, T01-47, T01-50
- Megatron Core lists keeping the first and last transformer blocks in BF16 (`--first-last-layers-bf16`) as the first defense against early-training instability under FP8 or FP4 | MG docs/user-guide/features/low_precision_training.md#L200 | newly read

## What your accelerator and framework run

- Transformer Engine gates: FP8 needs CC 8.9 or higher (code tests 9.0 as "hopper and above"); FP8 block scaling 9.0 with CUDA 12.9 or later; MXFP8 and NVFP4 need 10.0 | TE transformer_engine/pytorch/quantization.py#L151-L187 | T01-45; W1-45 (CUDA condition restored)
- With no recipe given, Transformer Engine picks MXFP8BlockScaling where MXFP8 is supported, DelayedScaling on Hopper | TE transformer_engine/pytorch/quantization.py#L261-L273 | T01-45; W1-45
- p5.48xlarge carries eight H100s; p6-b200.48xlarge eight B200s | https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html | T05-2; T05-4
- A configuration with the recipe unset changes scaling when it moves from p5 to p6-b200 (labelled our reading of the code) | TE quantization.py#L261-L273 | derived from T01-45 [SPECULATIVE: our reading]
- Megatron Core: `--fp8-format` (`e4m3` or `hybrid`), `--fp8-recipe` `delayed` (default), `tensorwise`, `blockwise` (1 x 128 and 128 x 128, Hopper and Blackwell), `mxfp8` (Blackwell); NVFP4 via `--fp4-format e2m1` on Blackwell | MG docs/user-guide/features/low_precision_training.md#L39-L46 | T03-19
- Megatron Core FP8 is off unless the format is set | MG megatron/core/transformer/transformer_config.py#L664-L676 | T03-19 (newly read: config default lines)
- Accelerate v1.15.0 runs FP8 on two actively maintained backends, Transformer Engine and torchao | https://github.com/huggingface/accelerate/blob/v1.15.0/docs/source/usage_guides/low_precision_training.md#L33 | T03-41
- NeMo AutoModel v0.7.0 lists FP8 through Transformer Engine and torchao | https://github.com/NVIDIA-NeMo/Automodel/blob/v0.7.0/README.md#L168-L169 | T03-28
- TorchTitan v0.4.0 (released 2026-10-28) removed legacy Float8; its formats are MXFP8 and experimental NVFP4, Blackwell only; MXFP8 needs a TorchAO nightly because TorchAO 0.18 lacks the kernels (release notes); the MXFP8 README at the same tag lists TorchAO 0.18.0 or later (README L25-L29), a doc-versus-doc conflict the page now names; a nightly satisfies both [our reading] | https://github.com/pytorch/torchtitan/releases/tag/v0.4.0 | T03-13; W3-14; W1-46
- So FP8 on p5 or p5en goes through Megatron Core, Accelerate or NeMo AutoModel | derived from the four rows above | T03-13; T03-19; T03-28; T03-41
- Trainium2 Tensor Engine takes cFP8, FP16, BF16, TF32 and FP32, with stochastic rounding | NS about-neuron/arch/neuron-hardware/neuron-core-v3.rst#L25-L29 | T01-51; W1-47
- cFP8 is 8-bit floating point with configurable range and precision; programmable rounding mode includes stochastic rounding | NS about-neuron/arch/neuron-features/data-types.rst#L98-L105 | newly read (expansion of cFP8)
- Trainium2 lists 1,299 dense FP8 TFLOPS against 667 BF16 (vendor specification) | NS about-neuron/arch/neuron-hardware/trainium2.rst#L7-L27 | T05-17
- TorchNeuron is the native PyTorch backend, a public beta in Neuron 2.33.0 | NS release-notes/components/torchneuron.rst#L18-L20 | T03-36
- TorchNeuron: `bfloat16` "the training baseline"; "FP8 and MXFP8 require Trainium 3" | NS torch/about-pytorch-neuron.rst#L117-L118 | T03-36; W3-36; W1-46
- On a trn2.48xlarge at Neuron 2.33 the PyTorch path trains in BF16 although the chip lists an FP8 peak | derived from the two rows above | W3-36
- Trainium3 keeps Trainium2's BF16 peak (671 against 667) and roughly doubles the 8-bit peak, 1,299 FP8 to 2,517 MXFP8 (vendor specification) | NS about-neuron/arch/neuron-hardware/trainium3.rst#L29-L79 | T05-18; W5-27 (wording fix applied: compares Trn2 FP8 with Trn3 MXFP8)
- A Trainium3 run collects the gain only in MXFP8 and MXFP4, which share the 2,517 peak (labelled our reading) | NS trainium3.rst#L29-L79 | T05-18 [SPECULATIVE: our reading]
- (Expandable) TorchTitan Neuron fork documents MXFP8 dense-linear training for Qwen3 on Trainium3 through torchao with Neuron MXFP8 support; attention and FFN linears in MXFP8, output head BF16; ValueError off Trainium3 | https://github.com/aws-neuron/torchtitan-neuron/blob/release-2.33.0/torchtitan_neuron/docs/neuron_mxfp8.md#L1-L16 | T03-53; C03-10
- (Expandable) TorchNeuron 2.33.0 release notes: "does not include TorchAO integration or composite MXFP8 data type support" | NS release-notes/components/torchneuron.rst#L186-L187 | T03-36; C03-10
- (Expandable) Whether the fork's Trainium3 path runs on public 2.33.0 packages was not settled | none | C03-10 open; U03-4

## Precision moves the compute bill and leaves the model state

- Model state under mixed-precision Adam is 16 bytes per parameter: 2 weights, 2 gradients, 12 for FP32 master and two Adam moments | https://arxiv.org/abs/1910.02054v3 (Section 3.1) | T01-9; W1-30
- Every recipe above keeps the FP32 master for the update | https://arxiv.org/abs/1710.03740v3 (3.1); https://arxiv.org/abs/1905.12322v3 (3); https://arxiv.org/abs/2412.19437v2 (3.3.3); https://arxiv.org/abs/2310.10537v3 (4.1) | T01-39; T01-41; T01-47; T01-48; W1-48
- TorchTitan's MXFP8 and NVFP4 paths keep persistent parameters and checkpoint state in high precision | TT torchtitan/quantization/README.md#L1-L18 | T03-13 (newly read: README lines)
- None of the 16 bytes depends on the compute format, so precision moves the arithmetic bill more than the memory bill (labelled our reading) | sources above | W1-25 note [SPECULATIVE: our reading]
- DeepSeek-V3's FP8 weight-gradient matmul let it store activations in FP8 | https://arxiv.org/abs/2412.19437v2 (Section 3.3.1) | T01-47 (newly read: activation caching text)
- Megatron Core keeps the 2-byte working weights in FP8 with `--fp8-param-gather` | MG docs/user-guide/features/low_precision_training.md#L211-L213 | newly read
- Llama 3.1 70B has N = 70,553,706,496 parameters | https://huggingface.co/api/models/meta-llama/Llama-3.1-70B | T01-3
- 40% MFU is an assumption inside Llama 3 405B's 38% to 43% BF16 MFU on H100 | https://arxiv.org/abs/2407.21783v3 (Section 3.3.2, Table 4) | T01-6; W1-35; build-log "default MFU"
- 6ND = 6 x 70,553,706,496 x 1e12 = 4.23e23 FLOPs; BF16 at 40% MFU: 4.23e23 / (989.5e12 x 0.40 x 3,600) = 297,093 H100-hours; FP8 at the same MFU 148,547; model state 16 x N = 1,128.9 GB in both columns | derived (inputs above and H100 spec) | 01 W2; 01 W8; W1-25; W1-19
- FP8 column is an upper bound at equal MFU; vector ops stay in BF16 or FP32 (and DeepSeek-V3 kept attention and output head there), which is our reading of why measured gains come in lower | sources above | W1-25 [SPECULATIVE: our reading]
- H100 dense peaks are half the "with sparsity" 1,979 BF16 and 3,958 FP8 (vendor specification) | https://www.nvidia.com/en-us/data-center/h100/ | T05-14; W1-16
- (Expandable) Megatron Bridge 0.7.0 archive: Llama 3 70B on 64 H100s in FP8 (container 26.04.01, 8,192 tokens, GBS 256, TP 4, PP 8) at 731 model TFLOP/s per GPU (vendor claim) | https://docs.nvidia.com/nemo/megatron-bridge/0.7.0/performance-summary-archive.html | proposed T01-64 (wave2-step-maths); U01-5 narrowed
- (Expandable) 731 / 1,979 = 37% of FP8 peak; 989.5 x 0.40 = 396 TFLOP/s; 731 / 396 = 1.85 times | derived | proposed T01-64
- (Expandable) TorchTitan MXFP8: up to 2 times BF16 for GEMMs on common shapes, up to 28% for training, on B200 (vendor claim) | TT torchtitan/quantization/mxfp8/README.md#L1-L36 | T03-13 (newly read: README speed-up lines)

## Choose the format for your accelerator

- trn2.48xlarge: BF16, TorchNeuron's training baseline; FP8 and MXFP8 require Trainium3 | NS torch/about-pytorch-neuron.rst#L117-L118 (cited above) | T03-36; W3-36
- p5, p5e, p5en: Megatron Core's fastest stable FP8 on H100 is `--bf16 --fp8-format hybrid --fp8-recipe tensorwise --fp8-param-gather` with the distributed optimizer; `delayed` when optimizer state is offloaded to CPU | MG docs/user-guide/features/low_precision_training.md#L232-L242 | T03-19 (newly read: H100 config)
- p6-b200: MXFP8, Transformer Engine's default on Blackwell; Megatron Core `--bf16 --fp8-format e4m3 --fp8-recipe mxfp8 --fp8-param-gather --reuse-grad-buf-for-mxfp8-param-ag` with the distributed optimizer (`--use-distributed-optimizer`, guide L252) | MG docs/user-guide/features/low_precision_training.md#L244-L253 | T01-45; T03-19 (newly read: B200 config)
- NVFP4 is demonstrated so far in its vendor's run | https://arxiv.org/abs/2509.25149v2 | T01-50; hedge above
- Closing: keep a short BF16 comparison run; keep first and last blocks in BF16 if the lower format drifts; plan at the BF16 figure, 297,000 to about 148,500 at most | restates rows above | W1-25

### Per-accelerator disclosure (`AcceleratorList`)

- H100 and H200 share 989.5 BF16 and 1,979 FP8 dense TFLOPS (vendor specification) | https://www.nvidia.com/en-us/data-center/h100/; https://www.nvidia.com/en-us/data-center/h200/ | T05-14; W5-26
- H100/H200 formats: DelayedScaling (default), Float8CurrentScaling, Float8BlockScaling (CUDA 12.9 or later) | TE transformer_engine/pytorch/quantization.py#L151-L187 | T01-45
- H100/H200 paths: Megatron `tensorwise`, `delayed`, `blockwise`; Accelerate or AutoModel via TE or torchao; TorchTitan v0.4.0 no FP8 path | MG low_precision_training.md#L39-L46; https://github.com/pytorch/torchtitan/releases/tag/v0.4.0 | T03-19; T03-13; T03-41; T03-28
- B200: 2,250 BF16, 4,500 FP8, 9,000 FP4 dense TFLOPS per GPU, our arithmetic from eight-GPU board figures (sparse / 2 / 8) (vendor specification) | https://www.nvidia.com/en-us/data-center/hgx/ | T05-15 (FP4 newly read from the HGX page)
- B200 adds MXFP8BlockScaling (default) and NVFP4BlockScaling | TE transformer_engine/pytorch/quantization.py#L261-L273 (default); #L151-L187 (NVFP4 gate, compute capability 10.0, L173-L177) | T01-45
- B200 paths: Megatron `mxfp8`, `--fp4-format e2m1` for NVFP4 on Transformer Engine 2.7.0.dev0 or later; TorchTitan MXFP8 with TorchAO nightly, experimental NVFP4 | MG low_precision_training.md#L39-L46; TorchTitan release notes | T03-19; T03-13
- Trainium2: 667 BF16 and 1,299 FP8 on the chip page; per-core 79 and 158 x 8 = 632 and 1,264; neither page says why | NS trainium2.rst#L7-L27; NS neuron-core-v3.rst#L25-L29 | T05-17; T01-51; C01-4; U01-13 open (hedged)
- Trainium2 formats and path: as in the section body | NS neuron-core-v3.rst#L25-L29; NS about-pytorch-neuron.rst#L117-L118 | T01-51; T03-36
- Trainium3: 671 BF16/FP16/TF32 and 2,517 MXFP8/MXFP4 against Trainium2's 1,299 FP8; 2,517 / 671 = 3.75 times, our arithmetic | NS trainium3.rst#L29-L79 | T05-18; W5-27
- Trainium3 path: MXFP8 dense-linear training for Qwen3 in the TorchTitan Neuron fork, public-package status open | torchtitan-neuron release-2.33.0 neuron_mxfp8.md#L1-L16 | T03-53; C03-10 open
