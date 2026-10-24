# Leverage pass: vLLM section 7, "Remote tiers on AWS: who moves the bytes, and where they land" and "Choosing a remote tier on AWS"

Date: 2026-10-24.

- **Scope:** the two containers in `deep-dives/vllm/src/sections/offload/RemoteKvTiersAws.tsx`, the diagram caption included.
- **Standards:** `deep-dives/efa/revamp/leverage-pass-standard.md`, `section-shape-standard.md` and the repo CLAUDE.md.
- **Inputs:** facts were taken as settled by `factcheck-vllm.md`, including its "## Applied" section (the corrections pass, run first). No source was fetched for this pass. Every sentence below traces to text already in the section after corrections.
- **Citations:** the set is unchanged by this pass, 88 `<Cite>` elements before and after with identical hrefs. This pass therefore adds nothing to `sources.md`; the corrections pass does, see "For the orchestrator" in `factcheck-vllm.md`.

**Word count method.** A script kept outside the repo strips JSX tags and `<Cite>` elements; cite titles are link text, not prose.

- **Counted:** h2 titles and descriptions, h3 headings, ExpandableSection header text, and the diagram caption.
- **Excluded:** the remote-tier table, the SVG, and ExpandableSection bodies. Bodies are reported separately as "in disclosures".

## Before

"Before" is the state after the corrections pass. The checker's scores, taken before any correction, are kept for reference.

| Container | Mental model | Practical leverage | Rigor | Accuracy | Economy |
| --- | --- | --- | --- | --- | --- |
| 1. Remote tiers on AWS (checker, pre-corrections) | 4 | 3 | 3 | 3 | 3 |
| 2. Choosing a remote tier (checker, pre-corrections) | 3 | 3 | 3 | 2 | 3 |
| 1. Remote tiers on AWS (after corrections) | 4 | 4 | 4 | 5 | 3 |
| 2. Choosing a remote tier (after corrections) | 3 | 4 | 4 | 5 | 3 |

**Container 1, mental model 4.** The bold lead named the two questions but answered only "where they land", and did not name the two answers. It came after the scope list of four tiers, about 70 words in. The consequence of landing in host memory (one more copy through the CPU tier or LMCache's L1) was stated only in the SVG `<title>`. **Economy 3:** the opening paragraph mixed the definition, the tier list and the HyperPod pointer.

**Container 2, mental model 3.** The container was procedure. The two questions reappeared only implicitly ("Plan for host memory", "Every S3 path starts in host memory"), and the order list, where the reader chooses, said nothing about where each step lands. **Economy 3.** Three things sat inline: the FSx sizing arithmetic, the Mooncake shm docs-versus-code conflict and the EFA setup pointer, which closed the container after the bandwidth check. The Valkey block opened on storage modes and put the gating fact (no released client) fourth. "so run it on EC2" repeated Container 1's "you run self-managed on EC2".

**Rigor 4 for both.** The citation gaps from the fact check are closed. Two absence claims still rest on a Tier 0 grep that the page cannot show: "nothing evicts them" (fs tier) and "calls no warm-up" (Mooncake connector tree).

**Visible prose words:**

| State | Container 1 | Container 2 | Total visible | In disclosures |
| --- | --- | --- | --- | --- |
| Original (pre-corrections) | 199 | 702 | 901 | 109 |
| After corrections (this pass's before) | 213 | 666 | 879 | 231 |

## Per-block answers

Q1 = what the block means to the reader. Q2 = the model it builds, and whether that model is visible. Q3 = how the reader acts on it, including what to watch.

| Block | Q1 | Q2 | Q3 |
| --- | --- | --- | --- |
| C1 h2 description | Why read on | Payoff already stated (GPU or host landing, per-client delivery) | Unchanged |
| C1 opening paragraph | What a remote tier is, and how to place one | Two questions: who moves the bytes, and whether they land in GPU or host memory. Host landing costs one more copy. Visible in the diagram's green and amber arrows and "copy to GPU" | Place any tier, including one this page does not cover |
| C1 scope paragraph | Which tiers are covered, and which are self-run | AWS services against self-managed stores on EC2 | Know what you operate yourself; find HyperPod's managed tier in the silicon dive |
| C1 mechanism paragraph | Why vLLM's own tiers land in host memory, and which two paths skip it | Only the CPU tier touches GPU memory; Mooncake registers CUDA memory; GDS reads into GPU memory | Choose `MooncakeStoreConnector` or the LMCache GDS backend if host landing is the limit |
| Diagram and caption | Model as a picture | Green against amber, mover on each arrow | Lookup; acronyms expanded in the caption |
| Table | Per-tier lookup: mover, landing, reach, maximum throughput, AWS latency, maturity | Same two questions as columns | Copy the `reach` settings; compare maxima. Excluded from the word count. Unchanged in this pass |
| C2 Mooncake: connector | Which of two Mooncake connectors is the cache tier | Cache tier against prefill-to-decode transfer | Pick `MooncakeStoreConnector` |
| C2 Mooncake: install | The wheel vLLM installs lacks EFA | None; practical | Install `-efa-cuda13` (or `-efa` on CUDA 12), keep libfabric on the path, set `"protocol": "efa"` |
| C2 Mooncake: size transfers | Throughput depends on transfer size | One transfer request is one EFA operation | Know the 64 KB against 1 MB gap; the vLLM setting is UNKNOWN and is stated as such |
| C2 Mooncake: watch | First-transfer cost per new peer | Lazy handshake on first send | Watch the first transfer to each new peer; vLLM's connector does not warm up |
| C2 Mooncake shm (now a disclosure) | A documented workaround the code at the tag makes stale | Doc against code | Do not trust the guide's `FI_EFA_ENABLE_SHM_TRANSFER=0` for CUDA builds; the header carries the point |
| C2 Valkey: gating | Not reachable from vLLM yet | Client release gates the tier | Wait for LMCache PR 5556 and glide 2.6.0; no managed offering located |
| C2 Valkey: host memory and lose-able node | What to plan for once it ships | Lands in host memory; DRAM or NVMe with no persistence | Size host memory; treat a node as a cache you can lose |
| C2 FSx: create with EFA | A create-time decision | EFA cannot be added later | Create with EFA; client setup in the EFA dive |
| C2 FSx: fs tier | What vLLM's fs tier gets on FSx | 700 Gbps host path, shared by content hash, no eviction | Mount one `root_dir`; plan cleanup |
| C2 FSx sizing (now a disclosure) | How big to make the file system | Throughput sets capacity; the cache-hit case needs 1.7 TiB of RAM | Size to 91.2, 153.6 or 62.4 TiB |
| C2 FSx: GDS | The GPU-landing FSx path | LMCache GDS backend, deprecated mode | Load nvidia-fs on every GDS client |
| C2 FSx other paths, Storage Blog (disclosures) | Answers to "what about X" | KVBM per-worker, llm-d retired, NIXL plugin only; blog against docs | None; understanding only. Left as is |
| C2 S3 | S3 always lands in host memory | Host-only engines | Use `s3_enable_s3express` in LMCache for Express One Zone |
| C2 order | The order to add tiers | The two questions restated per step | Add tiers in this order, then check bandwidth per GPU against recompute |

## Edits (verb, location)

Locations are lines in `RemoteKvTiersAws.tsx` after this pass.

1. **Reorder and re-express, C1 opening (L403-L411).** The two questions now come second in the container, right after the definition. They name both answers: "Two questions place each tier: who moves the bytes, and whether they land in GPU memory or in host memory." The consequence that was in the SVG `<title>` follows: "Bytes that land in host memory reach the GPU through one more copy, by vLLM's CPU tier or LMCache's L1."
2. **Reorder, C1 scope paragraph (L413-L422).** The tier list and the HyperPod pointer are split out of the opening into their own paragraph, after the model. "Four are covered" became "Four tiers are covered".
3. **Reorder, C1 mechanism paragraph (L424 onward).** It is now the third paragraph and leads straight with vLLM's secondary tiers. Text unchanged.
4. **Re-express, Mooncake install (L506-L521).** "Install X (Y on a CUDA 12 build), because ..." became "Install X, or Y on a CUDA 12 build: vLLM defaults to CUDA 13, ...". The libfabric and `protocol` clauses became their own sentence. No claim changed.
5. **Re-express, Mooncake watch (L549).** "no call to the warm-up that pays it in advance appears in vLLM v0.31.0's Mooncake connector code" became "vLLM v0.31.0's Mooncake connector code calls no warm-up to pay it in advance". The scope (the connector code tree, the cited directory) is unchanged.
6. **Demote, Mooncake shm conflict (L556-L568).** The doc-versus-code conflict moved into an ExpandableSection headed "Docs versus code: the guide's FI_EFA_ENABLE_SHM_TRANSFER=0 workaround is stale at v0.3.13.post1". The body and both cites are unchanged, including `kind="doc-code-conflict"`. The header names the variable, so a reader about to follow the guide sees it.
7. **Reorder, Valkey (L575-L620).** The gating paragraph (open PR 5556, glide 2.6.0 unreleased, no managed offering located) moved first. "Plan for host memory" and "Treat a node as a cache you can lose" follow.
8. **Re-express, Valkey (L608-L620).** The storage-mode sentence merged into "Treat a node as a cache you can lose: it keeps objects in DRAM, or on local NVMe behind a DRAM cache [configs.rs], with no persistence, ...".
9. **Delete, ", so run it on EC2" (Valkey gating).** Container 1 already says "two stores you run self-managed on EC2". The hedge sentence and its scope stay.
10. **Re-express, Valkey disclosure (L624).** "The README" became "The module's README".
11. **Reorder, EFA client setup pointer (L668-L672).** It moved from the end of Container 2 to directly after "Choose EFA at creation", the decision it supports. "FSx and EFA client setup is in" became "Client setup for FSx and EFA is in".
12. **Demote, FSx sizing arithmetic (L693-L707).** It moved into an ExpandableSection headed "Sizing: how many TiB one client needs at 700 or 1,200 Gbps". The numbers, the "By our arithmetic" label and the hedge "No AWS measurement located shows one client at either ceiling" are unchanged.
13. **Re-express, order lead-in (L807-L810).** It now ends "with who moves the bytes, and where they land, in parentheses:". The inference label "Our guidance" stays.
14. **Re-express, order steps (L812-L829).** Each step now carries its mover and landing, taken from the table's "Who moves the bytes" and "Lands in" cells:
    - Mooncake: "client-side EFA, into GPU memory"
    - fs on FSx: "Lustre client, into host memory"
    - GDS backend: "cuFile, into GPU memory"
    - S3: "HTTP, into host memory"
    - Valkey: "server-side EFA, into host memory"
15. **Reorder, container ending (L831-L837).** Container 2 now ends on the order list and its follow-up action, "Then check the tier's bandwidth per GPU against recompute in the flash-tier ladder (section 9) of Silicon, Memory & Inference". The EFA pointer no longer trails after it (edit 11).

Not edited: the table, the diagram and its `<title>` (already consistent with the corrected claims), the S3 block, the "Other FSx paths" and Storage Blog disclosures, and both h2 descriptions (both already state a payoff).

## Claim-set diff

The method was to diff the post-corrections snapshot against the result, at the level of sentence fragments, and to compare the href lists. The href lists are identical.

**Assertions in the after that were not in the before.** Each traces to text already in the section:

1. "whether they land in GPU memory or in host memory". This names the two answers to "where they land". Source: the diagram legend ("lands in GPU memory, no host hop" / "lands in host memory first") and the table's "Lands in" column.
2. "Bytes that land in host memory reach the GPU through one more copy, by vLLM's CPU tier or LMCache's L1." Source: the SVG `<title>` ("land them in host memory, from where vLLM's CPU tier or LMCache's L1 copies them to the GPU"), the diagram's "copy to GPU" arrow, and `tiering/base.py L130-L159`, cited in the next paragraph ("Load: secondary → CPU (primary) → GPU").
3. The five order-step parentheticals (edit 14). Each comes from the table's mover cell (C1, C7, C13, C19 cites) and its landing cell (B3, C2, C8, C14, C20 rows).
4. The shm disclosure header's "stale at v0.3.13.post1". Source: the body it heads (the guide's advice against `FI_HMEM` declared in the code at the tag). Register 02 row M74 and the orchestrator ruling use the same word.
5. The sizing disclosure header. It restates the arithmetic it heads.

**Assertions in the before that are not in the after.** None. ", so run it on EC2" survives as Container 1's "two stores you run self-managed on EC2". Every sourced number, the two doc-versus-code conflicts (Mooncake shm, valkey-large-object README), every hedge scope ("located", "by our arithmetic", "by our reading", "we did not trace") and the UNKNOWN on the vLLM transfer-size setting are still in the section. Three of them now sit inside disclosures.

**The three checks, applied to every sentence written in this pass:**

- **Scope.** No scope was strengthened. Edit 5 keeps "Mooncake connector code", and the hedge sentences are moved verbatim.
- **Citations.** No citation was attached to a new claim.
- **Inference.** No inference sits between a claim and its cite. "Our guidance" and "By our arithmetic" keep their labels.

## After

| Container | Mental model | Practical leverage | Rigor | Accuracy | Economy |
| --- | --- | --- | --- | --- | --- |
| 1. Remote tiers on AWS | 5 | 4 | 4 | 5 | 4 |
| 2. Choosing a remote tier | 4 | 4 | 4 | 5 | 4 |

**Container 1, mental model 4 to 5.** The model is the container's second sentence, and it names both answers and the consequence of host landing. The diagram, the table columns and the closing order list repeat it. **Economy 3 to 4:** the three paragraphs now do one job each (model, scope, mechanism). The word count rose by 28, which is the price of stating the model in prose. The mover list that only restated the table was already gone (K1).

**Container 2, mental model 3 to 4.** The two questions now appear at the point of choice, with an answer for every step. The Valkey and S3 blocks lead with where the bytes land. **Economy 3 to 4:** 50 fewer visible words, with three supporting blocks in disclosures whose headers carry the practical point.

**Practical leverage holds at 4 for both.** The reader now meets the Valkey gating fact first and finds the EFA setup pointer at the create-time decision. No new practical content was added, because the pass may not assert. The per-tier monitoring hook (`vllm:kv_offload_tiering_*` per `tier`) stays a backlog item from `factcheck-vllm.md`.

**Rigor and accuracy are unchanged.** The citations are untouched, and every claim is as the corrections pass left it.

**Visible prose words:**

| State | Container 1 | Container 2 | Total visible | In disclosures |
| --- | --- | --- | --- | --- |
| After this pass | 241 | 616 | 857 | 331 |
| Change from before | +28 | -50 | -22 | +100 |
| Change from original | +42 | -86 | -44 | +222 |

The total is under the 900 target.

## Verification

Run from the worktree root after this pass:

- **Exit 0:** `pnpm --filter @tech-deep-dives/vllm typecheck`, `lint` and `test` (5 of 5 passed), and `bash scripts/gates/no-ai-tells.sh`, `svg-a11y.sh`, `pinned-refs.sh` and `pre-overflow.sh`.
- **Exit 1:** `node deep-dives/vllm/revamp/tools/gen-sources.mjs --check` reports "sources.md is stale". This is expected from the corrections pass's citation changes; this pass changed no citation. The orchestrator regenerates it.
