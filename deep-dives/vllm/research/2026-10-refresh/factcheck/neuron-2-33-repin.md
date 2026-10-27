# neuron-2-33-repin: adversarial fact-check of the AwsNeuron.tsx re-pin (185917b..b9959f4)

Status: DONE (2026-10-24). Seven corrections applied to `AwsNeuron.tsx`; typecheck, eslint, vitest
and the four static gates pass (exit codes below). No diagram geometry, SVG text or `<title>` was
changed, so the build-and-screenshot harness was not run.

Scope: every claim added or changed in `git diff 185917b b9959f4 -- deep-dives/vllm/src/sections/AwsNeuron.tsx`,
SVG text included. File owned: `deep-dives/vllm/src/sections/AwsNeuron.tsx` (section 21, nav id `neuron`).
Each register row in `09-neuron-2-33-repin.md` was treated as a lead and re-opened at its source.

Pins checked by this agent:

| Source | Pin | How checked |
| --- | --- | --- |
| vllm-neuron (new) | `v0.29.0.1.2.0` = `eb6cb360f7cff6082e22a9437d8ce0ba3891304a` | `git rev-parse HEAD` in `/tmp/vn-repin-2026-10-24/new`; GitHub refs API |
| vllm-neuron (old) | `v0.24.0.1.1.0` = `ed3580d01e8632897b29986ab7532d8c5925846f` | `git rev-parse HEAD` in `/tmp/vn-repin-2026-10-24/old` |
| torch-neuronx | `v2.33.0` = `b1b6c66a2be28bce3bed6ef20632f0d3164119ef` | `git rev-parse HEAD` in `/tmp/tn-research/torch-neuronx` |
| vLLM (dive pin) | `v0.31.0` = `db9527a46873454610df6dbedf79a36d6bf1a7f6` | GitHub refs API. `/tmp/vllm-new` is no longer a usable checkout (no `.git`; `vllm/platforms/` and `vllm/engine/` are empty), so the four v0.31.0 files cited were re-fetched from raw at the SHA into `/tmp/fc-v029.DXRCQK/v031_*` |
| vLLM (plugin pin) | `v0.29.0` = `98dff2a81d747d1dba01a47f939f48c3526d4206` | GitHub refs API; full source tarball at the SHA in `/tmp/fc-v029tar.g6pwEJ/src` |
| libtorch-neuronx-lite | `2.13.0.1.0.3112+653bc48f` cp312, sha256 `05b984920136399a14c022fd99a1e545c459d7e17508201da5260d6f31b735bc` | re-downloaded into `/tmp/fc-lite.cVVqK6` (HTTP 200) and re-hashed; it is the newest 2.13 build on the index |
| Neuron docs | `/en/v2.33.0/` | 12 pages fetched with curl (generic UA, no personal data), all HTTP 200, titles checked; text in `/tmp/fc-ndocs.B4wtfr/*.txt`. `/en/latest/` What's New still shows "Latest release: 2.33.0 (10/19/2026)" |
| vllm-neuron releases | v0.29.0.1.2.0 (2026-10-19T20:44:50Z), v0.21.0.1.0.0 (2026-07-20T18:38:10Z) | GitHub releases API (unauthenticated); no release newer than v0.29.0.1.2.0 |

Abbreviations: `VN/` = `https://github.com/vllm-project/vllm-neuron/blob/v0.29.0.1.2.0/`, `ND/` =
`https://awsdocs-neuron.readthedocs-hosted.com/en/v2.33.0/`, `LITE/` = the lite wheel's
`libtorch_neuronx_lite/` package (URL and sha256 above), `REL` = the v0.29.0.1.2.0 GitHub release body.

## Specific checks the orchestrator asked for

**R13, `NEURON_COMPILED_ARTIFACTS` (doc-code conflict).** CONFIRMED and correctly scoped. The page names
the three trees searched (the plugin at the tag, the 2.13.0.1.0.3112 lite wheel, vLLM 0.29.0's
`envs.py`) and claims nothing about neuronx-cc, nki or the runtime. Re-run here: in the plugin tree the
only hits are `docs/guides/features-guide.md` L55, L59, L1184, `reference-configuration.md` L202, L304
and `how-to-profile-workloads.md` L228 (no code); in the lite wheel, 0 hits across every file including
`lib/*.so` and `_compiler/_C.so`; in the whole vLLM 0.29.0 tree, not only `envs.py`, 0 hits. The
documentation side is right too: `VN/docs/guides/features-guide.md?plain=1#L53-L65` documents it.

**R37, DFlash.** CONFIRMED. `VN/vllm_neuron/vllm/worker/neuron_model_runner.py#L1229-L1245` accepts
`eagle3` and `dflash` and raises `Unsupported speculative decoding method` otherwise; vLLM 0.29.0's
`vllm/config/speculative.py` L66 defines `DFlashModelTypes = Literal["dflash"]`, so the method reaches
the plugin. Features guide L630-L646: "EAGLE3 and DFlash are supported speculative methods." The README
feature table (L95) still lists EAGLE3 only, a doc lag the page correctly does not follow.

**R58, next step.** The `NEURON_COMPILED_ARTIFACTS` instruction is gone and the replacement is right in
direction, but it overreached on the cache (row N5 below). Fixed.

**R8, "built on the TorchNeuron library".** CONFIRMED as a precision conflict. REL headline quoted
verbatim. Code: `VN/requirements/core.txt#L5-L7` names `libtorch-neuronx-lite` and no file in
`requirements/` other than the unreferenced `vllm_rc_test.txt` L9 names `torch-neuronx`; 0 imports of
`torch_neuronx` and 106 of `libtorch_neuronx_lite` under `vllm_neuron/`. `LITE/_compiler/_vendor_manifest.json`
L2-L6 shows the lowering is vendored from `aws-neuron/private-torch-neuronx` at `89f82904`. The page's
reading ("holds for the lowering, and not for the package") matches the AWS integration page's own text.

**2.5x figure.** Was a scoped vendor claim, but narrower than the source: REL says "up to ~2.5x higher
system-level and per-user throughput than the Neuron 2.32 release (measured at batch size 128; the exact
gain varies by batch size)" and ties it to "a new decode mega kernel ... with a packed-FP8 KV cache,
optimized MXFP4 prefill kernels"; the linked tutorial (`ND/vllm-neuron/docs/tutorials/tutorial-gpt-oss-120b-8k1k-trn3.html`)
is MXFP4-only, 8K/1K. Fixed (row N4). What's New 2.33.0 carries the same figure ("up to 2.5x more
throughput than Neuron 2.32").

**Env vars and defaults.** All CONFIRMED against code at the tag, in ranges that contain the evidence:
`VLLM_NEURON_BACKEND` unset or invalid gives native, `vllm_neuron` gives XLA (`VN/vllm_neuron/envs.py#L779-L786`,
aliases L683, warning helper L713); route doc `ND/vllm-neuron/docs/guides/how-to-choose-compilation-route.html`
"VLLM_NEURON_BACKEND='<value>' is not a valid route. The native route runs now."; native init imports
lite (`VN/vllm_neuron/__init__.py#L91-L96`, called from `register()` L253);
`TORCH_DEVICE_BACKEND_AUTOLOAD=0` and the PrivateUse1 error string verbatim on the integration page, with
torch-neuronx's autoload entry point at `pyproject.toml` L12 and its `TORCH_LIBRARY_IMPL(_, PrivateUse1, m)`
at `torch_neuronx/csrc/core/NeuronBindings.cpp` L857 (tag v2.33.0); precompile-cache condition in
`LITE/__init__.py` L83-L104 (predicate) and L162-L180 (gate), called at import L240; `nixl<1.4.0` at
`VN/requirements/core.txt#L37-L41`; NixlConnector rewrite at `VN/vllm_neuron/vllm/platform.py#L1194-L1219`,
called from `check_and_update_config` L722 (0 hits for the redirect string at v0.24.0.1.1.0);
`--max-num-active-seqs` at v0.31.0 `vllm/engine/arg_utils.py#L1688-L1691` and 0 hits anywhere in the
v0.29.0 tree; `--max-num-queued-reqs` / `--max-num-queued-tokens` at v0.29.0 `arg_utils.py#L1602-L1608`.
`VLLM_CACHE_ROOT` needed narrowing (row N2).

**Lifecycle dates.** CONFIRMED. `ND/about-neuron/announcements/neuron2.x/announce-eos-nxdi-nxd-core-inference.html`:
"Starting with Neuron Release 2.34, Neuron will end support for the NxD Inference library and the NxD
Core Inference APIs on Trn2 and Trn3 instances" and "On Inf2 and Trn1 instances, the NxD Inference
library and NxD Core Inference APIs remain in maintenance mode at Neuron SDK 2.31". `.../announce-eos-vllm-neuron-torch-xla.html`:
"Starting with Neuron Release 2.34, Neuron will end support for the Torch/XLA path in the vLLM Neuron
plugin on Trn2 and Trn3 instances." What's New 2.33.0 uses the page's own phrase, "Support on Trn2 and
Trn3 ends in Neuron 2.34". The same announcement contradicts the page's dating of NxD Inference
maintenance to 2.32.0 (row N1).

**GitHub URLs.** Every GitHub URL in the file is pinned to a tag (`v0.29.0.1.2.0`, `v0.29.0`, release
tag pages) or a SHA (the fork, `c4f76254`); `vllmUrl`/`vllmDocsUrl` pin `v0.31.0`. Every line anchor
re-opened lands on its evidence; the one range that did not carry the whole claim is row N6.

**Changelog voice and AI tells.** No page-history voice. The remaining "no longer" (L350) and "now"
(L664) sit inside verbatim source quotations; "Neuron 2.32.0 also stopped publishing" and "Each of the
last three SDK releases moved the pin" are product history that changes what the reader installs. No
em-dash, en-dash range, curly quote or banned word (grep and the gate agree).

## Findings

Claims checked: 66 (the 60 register rows, re-opened at source, plus the diagram footer and `<title>`,
the torch-neuronx autoload code, the lite METADATA pin, the "latest release" check and the whole-tree
searches). CONFIRMED: 59. Non-CONFIRMED: 7 (OVERREACH 5, UNSUPPORTED 1, prose rule 1). WRONG 0, STALE 0.

| # | claim (short) | file:line (after fix) | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| N1 | NxD Inference, "which Neuron 2.32.0 put" in maintenance mode (register R29) | AwsNeuron.tsx:355 | OVERREACH | `ND/about-neuron/announcements/neuron2.x/announce-eos-nxdi-nxd-core-inference.html`: "As announced in Neuron 2.30 and reaffirmed in Neuron 2.31, the NxD Inference library and NxD Core Inference APIs have been in maintenance mode"; the 2.32.0 entry in `ND/about-neuron/whats-new.html` links its quote to "NxD Inference and NxD Core maintenance support with Neuron SDK 2.31". The quote is verbatim; the start date is not 2.32.0 | "which is &quot;in maintenance mode; ...&quot;": quote and 2.32.0 citation kept, the dating removed |
| N2 | "Keep `VLLM_CACHE_ROOT` on storage that survives a restart: ... the NEFF cache sits under it unless `NEURON_LIBTORCH_CACHE_ROOT` is set" (R12, R13) | AwsNeuron.tsx:548-552 | OVERREACH | `LITE/envs.py` L87-L105: `elif "VLLM_CACHE_ROOT" in os.environ:` else `~/.cache/neuron_libtorch`; the plugin's own caches default to `~/.cache/vllm` when unset (`VN/vllm_neuron/envs.py#L917-L940`); `VN/vllm_neuron/vllm/inductor_cache.py#L200-L213` "the 2 caches have separate roots". A reader who persists the default `~/.cache/vllm` without exporting the variable loses the NEFFs | "Set `VLLM_CACHE_ROOT` explicitly ... the NEFF cache sits under it only when the variable is set in the environment (unset, the NEFFs go to `~/.cache/neuron_libtorch`; `NEURON_LIBTORCH_CACHE_ROOT`, when set, takes precedence)" |
| N3 | Cache advice ("Set `neuron_native` explicitly anyway, for the cache reason below") with no deployment scope (R12) | AwsNeuron.tsx:547-548 | OVERREACH | `ND/vllm-neuron/docs/guides/how-to-precompile-cache.html`, Limitations: "On a multi-node deployment, set TORCH_CACHING_PRECOMPILE=0 until the coordination lands" and "EPD wants the cache off ... Set TORCH_CACHING_PRECOMPILE=0 on each VE and PD engine"; `VN/examples/vllm_neuron/vllm/disaggregated_encoder/epd_common.py#L40` sets it | One sentence: on a multi-node or encoder-disaggregated (EPD) deployment the Precompile Cache guide asks for the cache off, with `TORCH_CACHING_PRECOMPILE=0`. EPD expanded here, its first use in reading order |
| N4 | 2.5x: "GPT-OSS-120B throughput up to about 2.5x ... on Trn3, measured at batch size 128" (R26) | AwsNeuron.tsx:654-657 | OVERREACH (vendor-claim scope) | REL Highlights, quoted in the section above: "system-level and per-user throughput", gain from a decode megakernel "with a packed-FP8 KV cache, optimized MXFP4 prefill kernels"; linked tutorial "supports Trn3 with MXFP4 weights only" | "system-level and per-user throughput up to about 2.5x that of the Neuron 2.32 release on Trn3 with MXFP4 weights and a packed FP8 KV cache, measured at batch size 128; the gain varies by batch size" |
| N5 | Next step: "start from the Neuron 2.33.0 DLC or DLAMI ... keep `VLLM_CACHE_ROOT` on persistent storage so every boot after the first reuses the traced graphs and the compiled NEFFs" (R58) | AwsNeuron.tsx:1088-1091 | OVERREACH | Precompile guide, "Cache layout and invalidation": the fingerprint changes with the vLLM config hash, buckets, compiler options and Torch/Lite/compiler/plugin versions, "so the first start after an upgrade is a cold start"; N2 for the variable; `ND/release-notes/components/dlamis.html` and `containers.html` name only the vLLM DLAMI/multi-framework DLAMI and `pytorch-inference-vllm-neuronx` as shipping vllm-neuron 0.29.0.1.2.0 (2.33.0 also ships a vLLM Omni DLC and a torch-neuronx DLAMI that do not) | "start from the Neuron 2.33.0 vLLM DLC or vLLM DLAMI ... and set `VLLM_CACHE_ROOT` to a directory on persistent storage so a restart on the same configuration and versions reuses ..." |
| N6 | Cite "libtorch-neuronx-lite wheel, __init__.py L83-L104" for "That cache turns on only when ..." (R12) | AwsNeuron.tsx:545 | UNSUPPORTED (range) | `LITE/__init__.py` L83-L104 is only `_is_native_route()`; the cache is gated at L162-L180 (`if not native: ... return state`, then `TORCH_CACHING_PRECOMPILE` / `caching_precompile = True`). The wheel URL carries no anchor, so the label is the reader's only pointer | Label now "__init__.py L83-L104, L162-L180" |
| N7 | NEFF first appears unexpanded in the diagram `<title>` and SVG text (L226, L276) before the prose expansion (R14, R59) | AwsNeuron.tsx:410, 466 | Prose rule (Acronym Standard) | Reading order: Stack h2 intro, then `NeuronStackDiagram`, then "How it compiles". NEFF occurs nowhere earlier in the dive (only AwsNeuron.tsx and the glossary) | Expanded in the Stack intro paragraph that renders before the diagram ("turns each model graph into NEFFs (Neuron Executable File Format), the programs Trainium runs"); the later duplicate expansion removed. No diagram change. Same pattern as fc11 T6 |

CONFIRMED rows (59) are summarised in the section above and in register 09 R1-R60. One wording note
that needed no fix: the diagram footer "Dashed: the maintenance line, with no new feature releases"
extends the NxD Inference "no new feature releases are planned" quote to the whole 0.5.x line; the
README marks plugin 0.5.3 "Maintenance" and Neuron's maintenance mode is "critical bug fixes and
security patches only", so it holds.

Length: the section grew by 4 lines net (two narrowing sentences, one expansion moved earlier).

## For the orchestrator

1. **sources.md.** One `Cite` label changed (lite wheel, now "__init__.py L83-L104, L162-L180"); the URL
   is unchanged and gen-sources dedups by URL, so the file may already be current. Run
   `node deep-dives/vllm/revamp/tools/gen-sources.mjs --check` (not run here, per instructions).
2. **GlossaryAndSources.tsx id 38** links `https://github.com/aws-neuron/upstreaming-to-vllm` with no
   tag or SHA (pre-existing; the pinned-refs gate passes). AwsNeuron.tsx pins the same repo at
   `tree/c4f76254591e9113f01cbed6684efd735ba3cb81`; suggest the same pin there.
3. **GlossaryAndSources.tsx TorchNeuron entry** reads "libtorch-neuronx-lite, its own copy of the
   TorchNeuron lowering". Lite is a package that includes that copy; "a package that includes its own
   copy of the TorchNeuron lowering" matches the integration page. Optional.
4. **DecisionGuide.tsx** (vLLM 0.29.0, README L133-L142): consistent with the section. No change.
5. **Register 09** should note N1-N7 against R29, R12/R13, R12, R26, R58, R12 and R14/R59. Its R13 scope
   ("vLLM v0.29.0 `vllm/envs.py`") can widen: the whole v0.29.0 tree has 0 hits. The page keeps the
   narrower envs.py scope, which is still true.
6. **`/tmp/vllm-new` is gutted** (no `.git`, empty `vllm/platforms/` and `vllm/engine/`). Any agent
   that reads v0.31.0 from it will fail or read nothing; re-checkout before the next pass.
7. The working tree had uncommitted edits from another session in
   `deep-dives/silicon-memory-inference/src/` (eight files by the end of this run, still changing) while
   these gates ran. They were not touched, and they are included in the gate results below.

## Gates

Run after the last edit, from `deep-dives/vllm` and from the repo root:

| Check | Exit |
| --- | --- |
| `pnpm exec tsc --noEmit` | 0 |
| `pnpm exec eslint src/sections/AwsNeuron.tsx --max-warnings 0` | 0 |
| `pnpm exec vitest run` | 0 (1 file, 5 tests passed) |
| `bash scripts/gates/no-ai-tells.sh` | 0 (PASS) |
| `bash scripts/gates/svg-a11y.sh` | 0 (PASS) |
| `bash scripts/gates/pinned-refs.sh` | 0 (PASS) |
| `bash scripts/gates/pre-overflow.sh` | 0 (PASS) |

## Score

AwsNeuron.tsx, after fixes: **8 / 10**.

| Criterion | Score |
| --- | --- |
| Factual accuracy at the pins (v0.29.0.1.2.0, vLLM 0.29.0 / v0.31.0, Neuron 2.33.0) | 9 |
| Citation coverage for quantitative claims (vendor figures labelled, conditions stated) | 9 |
| Section Shape (mental model, payoff last, h2 payoffs) | 8 |
| Prose rules | 9 |
| Diagram quality (title, role, geometry read from source; not re-rendered here) | 8 |

Rationale: every changed claim now matches code or a versioned AWS page, and the cache advice is scoped
to where the documentation says it works. It holds at 8 because the stack h2 carries four dense
practical paragraphs inline, with the `NEURON_COMPILED_ARTIFACTS` doc-code conflict among them, where
Section Shape rule 7 would put the conflict in a disclosure.
