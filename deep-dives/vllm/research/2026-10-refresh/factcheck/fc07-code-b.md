# fc07-code-b: fact-check of CodebaseExecution.tsx and CodebaseModelLayer.tsx

Pin: vLLM v0.31.0, commit db9527a46873454610df6dbedf79a36d6bf1a7f6, read at `/tmp/vllm-new` on
2026-10-17. Line numbers below are at that pin. All fixes listed below are applied.

## codebase/CodebaseExecution.tsx

Claims checked: 96. CONFIRMED: 87 (includes the full `use_v2_model_runner` decision order and
both feature lists encoded in `RunnerSelectionDiagram`, the dense and MLA priority lists in
`BackendSelectionDiagram`, every MLA capability gate, the FA version default, the 44 / 6 registry
counts, the 2,410 / 7,531 line counts, async-scheduling conditions, O-level defaults, capture
sizes, DBO thresholds and gates, GC freeze, PP send/recv, breakable-cudagraph architecture list).

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| E1 | Worker "picks and sets the GPU, loads weights, profiles free memory, and under PP sends and receives" cited to one range | CodebaseExecution.tsx:671 | UNSUPPORTED | gpu_worker.py#L397-L462 covers device selection only; load_model is #L538-L561, determine_available_memory #L571-L583 | added the two missing cites |
| E2 | `sample_tokens()` drains state, computes logits, applies bitmask, samples | :886 | UNSUPPORTED (range) | model_runner.py#L1556-L1591 is `sample()`; `sample_tokens` is #L2050-L2098 | cite now L2050-L2098 plus L1556-L1600 |
| E3 | `build_attn_metadata()` builds "one metadata object per KV-cache group" | :980 | WRONG | attn_utils.py#L429-L555: one object per attention group (a KV-cache group can hold several), keyed by layer; cited L418-L429 held only the signature | reworded; cite L429-L555 |
| E4 | `flash_attn_varlen_func(...)` fed `cu_seqlens_q`, KV lengths and `block_table` | :1389 | UNSUPPORTED (range) | flash_attn.py#L1560-L1580 is the DCP path, which passes k/v and no block table; the paged call is #L1450-L1475 through the wrapper at #L113-L116 | cite moved to L1450-L1475 and L113-L116 |
| E5 | backend declares `forward_includes_kv_cache_update = False` | :1373 | UNSUPPORTED (range) | declared at flash_attn.py#L365, outside the cited attention.py#L724-L745 | added flash_attn.py L365 cite |
| E6 | "A full-graph mode with a NEVER backend becomes PIECEWISE"; FULL "otherwise downgraded" | :1206-1212, :103 | WRONG | compilation.py#L1390-L1406: FULL (mixed mode FULL) with a NEVER backend raises ValueError; only FULL_AND_PIECEWISE / FULL_DECODE_ONLY with NEVER downgrade (#L1417-L1442) | prose and table row corrected |
| E7 | breakable CUDA graph mechanism | :1296 | UNSUPPORTED (comment-only cite) | breakable_cudagraph.py#L1-L20 is a docstring; the mechanism is #L198-L211 (`add_eager`) | added code cite |
| E8 | with `CUDA_VISIBLE_DEVICES` set "the IDs index into it" | :1563 | OVERREACH | arg_utils.py#L2075-L2102: only integer IDs index into it; UUIDs map directly | narrowed to integer IDs |
| E9 | Worker "builds the matching class" in its constructor | :750 | WRONG (minor) | gpu_worker.py#L227 reads the flag in `__init__`; the runner is built in `init_device()` #L507-L526 | reworded, cite added |

Prose rules: no em-dash, en-dash, curly quotes, banned words or page-history voice found.

## codebase/CodebaseModelLayer.tsx

Claims checked: 78. CONFIRMED: 72 (387 unique architecture keys across ten tables, 29 entries into
`vllm/models/`, 14 Transformers-only architectures, 50 removed architectures, 21 of 285 model
files importing attention backends, ten `vllm/models` packages, lazy registry, md5/sha256 hash,
subprocess inspection, `--model-impl` semantics, `resolve_quant_method` online rules, the eight
FP8 block CUDA kernels in order, `--linear-backend` fallback log, LoRA stacked buffers and
sharding).

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| M1 | each `vllm/models` package imports "the `nvidia/` or `amd/` implementation" | CodebaseModelLayer.tsx:553 | OVERREACH | `dots3_note` has only `nvidia/`; `deepseek_v4` also has `cpu/` and `xpu/` | narrowed |
| M2 | chooser picks a kernel that "can implement this layer's shape" | :881 | WRONG (minor) | kernels/linear/__init__.py#L621: `can_implement(config)` checks the whole layer config (quant keys, dtypes, shape) | "this layer's configuration" |
| M3 | older GPU walks past DeepGEMM "to a later entry such as Marlin or the portable Triton kernel" | :935 | OVERREACH | scaled_mm/marlin.py#L34-L49: Marlin is supported from CC 7.5 and implements any config, so Turing and Ampere land on Marlin (weight-only); Triton is reached only when Marlin is ruled out; DeepGEMM gate is platforms/cuda.py#L709-L715 | reworded to Marlin, consistent with Quantization.tsx; cuda.py cite added |
| M4 | `_mcp_apply` "runs three steps" | :1031 | UNSUPPORTED (range) | column_parallel_linear.py#L24-L28 is the function header; shrink, all-gather, expand are #L57-L73 | cite now L24-L73 |
| M5 | runtime LoRA loading "carries caveats around slot pressure and load and evict cost"; startup adapters "loaded into the fixed max_loras slots" | :1113-1120 | UNSUPPORTED | model_manager.py#L352-L375 activates any adapter into a free slot on use; the documented caveat is security (docs/features/lora.md#L109-L113) | reworded to the documented caveat, consistent with LoRAServing.tsx |
| M6 | "no pure-PyTorch reference implementation"; "hardware without a Punica backend has no graceful fallback" | :1147-1150 | OVERREACH | a torch-ops wrapper exists (punica_cpu.py#L9-L23, lora/ops/torch_ops); the base platform `get_punica_wrapper` raises NotImplementedError (platforms/interface.py#L1088-L1090) | reworded to what the code shows |

Prose rules: clean.

## Diagrams

`RunnerSelectionDiagram` matches `VllmConfig.use_v2_model_runner` (vllm/config/vllm.py#L700-L761)
check for check: HiSparse / watermarking force V2, then `VLLM_USE_V2_MODEL_RUNNER`, then the
three ROCm architectures (#L75-L77, only when `_get_v1_model_runner_unsupported_features()` is
empty), then Triton, then the amber list. Amber panel = `_get_v2_model_runner_unsupported_features`
(#L3051-L3103, DBO entry from #L3245-L3246); blue panel = `_get_v1_model_runner_unsupported_features`
(#L3105-L3149, DFlash candidate heads from #L763-L776). `BackendSelectionDiagram` matches
`_get_backend_priorities` (platforms/cuda.py#L82-L179). `ForwardPipelineDiagram`,
`RegistryDiagram` and `QuantDispatchDiagram` match the cited code. No diagram changed, so the
harness was not re-run.

## Scores (after fixes)

**CodebaseExecution.tsx: 8/10.** Every runner, backend and graph-mode claim now traces to a pinned
line range that holds it, and the tab ends on the log lines to check. It is long and dense; the
CUDA-graph block carries more mechanism than most readers act on.

**CodebaseModelLayer.tsx: 8/10.** Registry counts, quant dispatch order and LoRA paths are
code-confirmed and agree with Quantization.tsx (Marlin weight-only FP8 on Turing and Ampere,
DeepGEMM Hopper and Blackwell). The interfaces and plugin expandables are reference material
rather than a mental model.

## Checks

- `pnpm --filter @tech-deep-dives/vllm typecheck`: `tsc --noEmit`, exit 0, no errors.
- `pnpm --filter @tech-deep-dives/vllm lint`: `eslint src --ext .ts,.tsx --max-warnings 0`, exit 0, no warnings.
- Prose scan of both files after edits: no em-dash, en-dash, curly quotes, banned words, or
  `/blob/main` / `/tree/main` links.

Status: COMPLETE.
