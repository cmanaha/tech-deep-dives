# P5: Portfolio-Wide Verification Harness Design

Date: 2026-08-01
Author: agent-driven design pass, for Carlos's review
Status: proposal. Nothing built. No file outside `docs/verification/` touched.

Inputs read: `docs/adr/0004-agent-driven-quality-gates.md`, `scripts/ci.sh`,
`scripts/audit.sh`, `scripts/gates/html-validate.sh`,
`deep-dives/efa/revamp/source-authority-standard.md`,
`deep-dives/efa/revamp/VERIFICATION-SUMMARY.md`,
`deep-dives/efa/revamp/section-architecture.md` (section 5, the eight proposed gates),
`deep-dives/efa/docs/adr/ADR-002-freshness-verification.md`, `CLAUDE.md`, `AGENTS.md`,
`deep-dives/caching-scope.md`.

## 0. The problem this solves

The 2026-08-01 EFA verification pass worked. Three adversarial verifiers found six
overstated claims and one flatly wrong one in research that had already passed a
review. That pass was hand-assembled: bespoke agent briefs, ad-hoc scope, one output
file, no way to run it again on the same dive next quarter and no way to run it at all
on `vllm`, `silicon-memory-inference`, or the caching dive that is already scoped.

Two structural facts make the one-off shape unacceptable:

1. **Verification decays on a schedule.** The p5.48xlarge price was already nine months
   wrong on the day the EFA dive shipped. Nothing in the repo noticed for five months.
2. **ADR-004 Phase 3 was specified and never built.** `scripts/audit/` does not exist.
   `.claude/agents/` and `.claude/skills/` are empty directories. `audit.sh` prints a
   backlog note and exits 0. The agent tier is currently a comment.

This document specifies the repeatable form: a lens catalogue, a ratchet table mapping
lenses to deterministic gates, a runner, the agent and skill definitions that make it
reusable, a cadence with a staleness budget, and an ADR outline.

### 0.1 A structural gap in ADR-004 that this design closes

ADR-004 has two tiers: deterministic (`ci.sh`, no network, no LLM) and agent-driven
(`audit.sh`, LLM). The most valuable checks this design proposes fall in neither.
Re-fetching a file at a pinned SHA and comparing it to a quoted line is fully
deterministic and needs no LLM, but it needs the network, and `ci.sh` states in its own
header that it excludes network-dependent checks.

So the architecture gains a middle tier:

| Tier | Name | LLM | Network | Runner | Blocks a commit |
|---|---|---|---|---|---|
| 1 | Deterministic offline | no | no | `ci.sh` | yes (local rhythm) |
| 1.5 | Deterministic networked | no | yes | `run-verification.sh --deterministic-only` | no |
| 2 | Agent lenses | yes | yes | `run-verification.sh` | no |

Tier 1.5 is the highest value per dollar in the whole system. It has the ratchet
property (same input, same verdict), costs nothing in tokens, and it is the tier that
would have caught the pricing drift.

---

## 1. The lens set

Nine lenses. Six are the candidates named in the brief, each observed to catch a real
error in the EFA pass. Three more (L7, L8, L9) come from failures in that same pass
that the six do not cover. One cross-cutting rule (R0) is not a lens but a runner
obligation.

Every lens shares one output contract, defined once in section 3.4: a finding file with
frontmatter, an evidence block, and a `ratchet:` field.

### L1. Code provenance re-fetch at a pinned SHA

**Checks.** For every claim in category B (code-confirmed) or C (code-derived
inference) under `source-authority-standard.md`: the cited repo, SHA, path and line
range still resolve, and the symbol or line the dive quotes is still present at that
location with that meaning.

**Evidence required.** The raw fetch URL at the pinned SHA, the retrieved line range
verbatim, and a byte-level or symbol-level match verdict. A claim of "still correct"
with no retrieved text is not a finding, it is an assertion.

**Naive failure mode.** Fetching the default branch instead of the SHA. Every existing
GitHub citation in this repo points at `/blob/main/` or `/blob/master/` (verified by
grep across `deep-dives/*/src`), so a naive run silently verifies against whatever
today's HEAD says and reports green while the pin is meaningless. Second failure: the
agent re-derives the claim from the file it just fetched rather than checking the
specific quoted line, which turns a mechanical check into a fresh (and differently
wrong) inference.

**Ratchet status.** Mostly mechanical. Splits into a Tier 1 offline gate (G-PIN) plus a
Tier 1.5 networked check (N-REFETCH). Only the residue (does the retrieved code still
*mean* what the prose says) stays agent work.

### L2. Doc versus code contradiction detection

**Checks.** Where a claim rests on AWS documentation, a README, a `.txt` spec, or a code
comment, does the implementation at the pinned SHA agree? Where they disagree, code
wins and the disagreement is publishable content (category D).

**Evidence required.** Both sides quoted: the doc sentence with URL and access date, the
code lines with repo, SHA, path and line numbers. Plus an explicit statement of which
side the dive currently follows.

**Naive failure mode.** This is the lens most prone to inventing contradictions. Two
sources at different abstraction levels read as contradictory when they are not: the EFA
pass's own finding is the model, where libfabric's env help says Data Path Direct
bypasses rdma-core *on the data path* and the in-repo comparison doc drops the
qualifier. A naive run reports "the docs are wrong" when the actual finding is "the doc
dropped a scope qualifier." Constrain the lens to contradictions where a specific
falsifiable statement in one source is denied by a specific line in the other.

**Ratchet status.** Stays agent-driven. Contradiction detection is judgment.

### L3. Numeric and pricing re-derivation from Tier 1

**Checks.** Every number with a unit is re-derived from a Tier 1 artifact, not
re-confirmed from a source that quoted it. Pricing re-derives from the AWS bulk price
list with the filter recorded. Bandwidth, device counts and instance specs re-derive
from the EC2 instance-type documentation or an API response.

**Evidence required.** The artifact identity (price list URL plus its `Last-Modified`
header, or the doc URL plus access date), the exact filter applied, and the derived
figure. The EFA pass proved the filter is load-bearing: `MarketOption=OnDemand` matters
because a `CapacityBlock` row exists at $0.00 for the same SKU. A re-derivation that
does not state its filter is not reproducible and does not count.

**Naive failure mode.** Confirming the number against the page that the dive already
cited, which confirms transcription and nothing else. Second failure: accepting the
current price as evidence the historical claim was right. The EFA pass hit exactly this
in reverse, confirming $55.04 while the causal story wrapped around it ("prices fell
since March 2026") was false, because the March 2026 list already read $55.04.

**Ratchet status.** Partly mechanical. Price re-derivation becomes Tier 1.5
(N-PRICE) because the price list is a machine-readable artifact with a stable filter
grammar. Everything else stays agent work.

### L4. Inference presented as fact

**Checks.** Claims in category C (code-derived inference) that are written in category A
voice. The test is whether a reader could tell, from the rendered page alone, that AWS
never said this and the dive worked it out from source.

**Evidence required.** The claim as rendered, the citation as rendered, and the specific
reason the claim exceeds its source: an arithmetic step, a generalisation across
devices, a naming decision. The EFA pass produced two clean examples: `0xefa4` labelled
"EFA v4" (five device IDs against four documented EFA versions, so the mapping is
invented) and p5's 8 GPUs x 4 EFA per PCIe root, which is the dive's own arithmetic
doing load-bearing work.

**Naive failure mode.** Flagging every derived statement. Deep dives exist to derive
things, so a lens that demands a doc for every sentence produces an unusable finding
list and gets ignored. Bind the lens to load-bearing claims only: a derived statement is
in scope when a reader could act on it (a purchase, a config, an architecture choice) or
when it is a headline claim of its section.

**Ratchet status.** Stays agent-driven. One weak deterministic proxy exists (G-DERIVED,
section 2) that catches derived *columns* in data modules, which is where the
`costPerGbps` and `spotEstimate` failures lived.

### L5. Overstatement and scope error

**Checks.** Claims true under a narrower condition than stated. The EFA pass's canonical
case: "the kernel driver implements post_send/poll_cq" is true for out-of-tree
`amzn-drivers` with `ENABLE_KVERBS` on by default, and false for mainline Linux where
`efa_dev_ops` has none of those ops. The qualifier axes seen so far are worth encoding
in the skill: upstream versus vendor fork, build flag, version or release tag, shipping
installer version versus master HEAD, region, instance family, and product tier (the
FSx finding: EFA is Persistent 2 only).

**Evidence required.** The narrower true statement, plus proof of at least one case where
the broad statement fails, at the same level of provenance as the original claim.

**Naive failure mode.** Manufacturing qualifiers. Every claim can be narrowed by adding
conditions, so an unconstrained lens returns a qualifier for every sentence and the
signal drowns. Require a demonstrated failing case, not a hypothesised one.

**Ratchet status.** Stays agent-driven. This is the highest-yield lens in the EFA pass
(most of the PARTLY-CORRECT verdicts) and the least mechanisable.

### L6. Negative claim refutation

**Checks.** Claims of the form "no source says X", "X is not supported", "nothing does
Y", "there is no path from A to B". These are disproved by a single counterexample, so
they are the cheapest claims to attack and the most expensive to get wrong.

**Evidence required.** Either a counterexample with full provenance, or a stated search
protocol that failed: the queries run, the repos and orgs searched, the grep patterns
used, and the result counts. A negative claim survives only when the failed-search
record is written down.

**Naive failure mode.** Accepting the negative because one search returned nothing. The
EFA pass has both outcomes in one document. "No AWS source says `hostNetwork` is needed"
was refuted in one search (three AWS-authored manifests set it). "There is no EFA path to
S3" survived, and it survived precisely because the check was recorded as zero
`efa`/`libfabric`/`rdma`/`GPUDirect` hits across all three CRT repos, which is a
falsifiable statement about a search, not a claim about the world.

**Ratchet status.** Stays agent-driven, with one mechanical assist: G-NEG (section 2)
greps section prose for negative-claim phrasings and requires each hit to be present in
the claim manifest with a `negative: true` flag, so the runner can guarantee every
negative claim is routed to L6 rather than left to chance.

### L7. Temporal attribution and causal story

**Checks.** Not "is the number right today" but "was the number right when we said it
was", and "is the story we tell about how it changed true". Covers version timelines,
"since version N" claims, "new in" claims, and price-change narratives.

**Evidence required.** At least two dated observations of the same fact, with the source
artifact for each, plus the transition point. The EFA pass shows why: $98.32 and $32.7726
were genuinely correct through the May 2025 list and the cut landed in June 2025, so the
correct sentence is about June 2025, not about March 2026.

**Naive failure mode.** Treating a current value as evidence about the past. Also
treating the dive's own access date as the date the fact became true, which is the exact
error that produced the nine-month-stale price.

**Ratchet status.** Stays agent-driven. Historical price lists are fetchable, so a
future ratchet is possible, but not in the first turn.

### L8. Fabricated and derived-number sweep

**Checks.** Numbers with no source at all, and derived arithmetic presented as sourced
fact. Distinct from L4 because the failure is not a voice problem, it is that no source
exists. The EFA pass found four Spot estimates fabricated (four different families all
assigned an identical 60 percent saving), an hpc7a figure that was never correct in any
region or year, a `costPerGbps` column that is pure arithmetic, and a Trn3 "28.8 Tbps"
absent from the announcement and probably collided with the P6e-GB200 figure.

**Evidence required.** For each flagged number: the search performed for a source and its
null result, plus a classification (fabricated, derived-from-cited-inputs, or
transcription collision from a nearby figure). The collision case matters because it is
the signature of a number that came from a model rather than a document.

**Naive failure mode.** Running this only over prose. Three of the four EFA cases lived
in table columns and data structures, not sentences. The claim manifest must extract
from data modules, not just JSX text.

**Ratchet status.** Partly mechanical. G-NUM and G-DERIVED (section 2) catch the
structural half. Whether a number is fabricated stays agent work.

### L9. Cross-dive consistency

**Checks.** The same fact asserted in two dives, with different values, different tier
labels, or different access dates. Only meaningful portfolio-wide, which is why it does
not appear in any per-dive pass. Live example: `deep-dives/vllm/src/sections/AwsGpuEfaNixl.tsx`
carries 24 `[Tier-` markers about EFA while `deep-dives/efa/` is being revamped for
correctness. If EFA's corrections land and vLLM's do not, the portfolio contradicts
itself.

**Evidence required.** Both renderings quoted with file paths and line numbers, both
citations, and a ruling on which is correct, or an explicit "both wrong" verdict.

**Naive failure mode.** Comparing surface strings and reporting differences in phrasing
as inconsistencies. Anchor on the claim manifest's normalised subject plus unit, not on
sentence similarity.

**Ratchet status.** Partly mechanical. A deterministic pre-pass clusters manifest entries
sharing a normalised subject and unit and emits candidate pairs; the agent only
adjudicates the pairs. This keeps the agent's input bounded, which matters because L9's
naive input is the cross product of every dive.

### R0. Correction re-verification (a runner rule, not a lens)

The EFA pass states plainly: "Two of our own corrections were themselves wrong" (the
trn2 memory verdict and the "100 Gbps class" grouping for g4dn/g5/vt1, actually 25 to 50
Gbps). A verifier's output is research, and research is what verifiers exist to attack.

**Rule.** Every finding with verdict `REFUTED` or `PARTLY-CORRECT` that proposes replacement
text is re-attacked by a second agent, under a different lens and with no access to the
first agent's reasoning (only the original claim, the proposed replacement, and the
evidence block). Cheap, because it is scoped to findings rather than to the dive: the
EFA pass would have re-attacked roughly 20 items, not 380.

R0 is enforced in `run-verification.sh` as a mandatory wave, not left to the operator.

---

## 2. What becomes a deterministic gate

The ratchet principle says every real bug an agent finds becomes a deterministic gate.
Applying it to the EFA findings gives the table below. "Tier" follows section 0.1.

Standard exit convention for every gate script:

- `0` pass
- `1` violation found (the gate did its job and the tree is bad)
- `2` gate could not run (missing prerequisite, no targets, network failure)

The distinction matters. In `ci.sh`, exit 2 is a hard failure, matching
`html-validate.sh`, which already exits 1 when it finds no targets on the theory that a
gate with nothing to check is a broken gate. In the audit runner, exit 2 marks the check
`UNVERIFIABLE` in the report and does not fail the run, because a network blip is not a
content defect.

### 2.1 Tier 1, offline, added to `ci.sh`

| ID | Script | Check logic | Exit 1 when | Ratchets which finding | Land when |
|---|---|---|---|---|---|
| **G-PIN** | `scripts/gates/citation-pins.sh` | For every `github.com` URL in `deep-dives/*/src/**` and `sources.md`: reject `/blob/main/`, `/blob/master/`, `/tree/main/`, `/tree/master/`, `/raw/main/`. Require the ref segment to match `^[0-9a-f]{40}$` or `^v?[0-9]+\.[0-9]+` (a release tag). Require a `read 20\d\d-\d\d-\d\d` or `accessed 20\d\d-\d\d-\d\d` within 5 lines of each pinned URL. | any unpinned or undated code URL | the whole "code is the authority" pinning rule; today every GitHub link in the repo fails this | after the EFA citation pass |
| **G-TIER** | `scripts/gates/tier-integrity.sh` | Every `[Tier-N` marker has `N` in `0..4`. Every `[Tier-` marker is followed within 5 lines by a `<Link` with an `href`. Zero `[Tier-4` markers in `src/sections/` outside the Sources section (CLAUDE.md: Tier 4 is inspiration only, never cited as fact). | malformed tier, uncited tier marker, or a Tier-4 citation | tier laundering; enforces the CLAUDE.md tier grammar mechanically | immediately |
| **G-CITE** | `scripts/gates/citation-coverage.sh` | Per section file: `count("[Tier-") >= 1` and `count("accessed 20") >= count("[Tier-")`. Exemptions by explicit list. | any section with zero citations | "zero inline citations across 11 EFA sections" | after citation pass (this is G2 from `section-architecture.md`) |
| **G-SYNC** | `scripts/gates/sources-sync.sh` | Run `scripts/gen-sources-md.mjs`, then `git diff --exit-code -- deep-dives/*/sources.md`. Assert every `research/` path named in `sources.md` exists on disk. | regenerated file differs, or a dangling path | the 28-versus-39 drift and the dangling `research/` reference | after `src/data/sources.ts` lands (G3) |
| **G-TELLS** | `scripts/gates/no-ai-tells.sh` | Grep for em-dash, `&mdash;`, en-dash, `&ndash;`, curly quotes, and the CLAUDE.md banned-vocabulary list with word boundaries, over `src/**/*.tsx`, `index.html`, `README.md`, `sources.md`. | any hit | 231 em-dashes in EFA (G1) | immediately |
| **G-SVG** | `scripts/gates/svg-a11y.sh` | Every `<svg` has `role="img"`, a `viewBox`, and `aria-labelledby` or a nested `<title`. No fixed pixel `width=`. Every React Flow wrapper has `role` and `aria-label`. | any non-conforming diagram | two unlabelled React Flow diagrams (G4) | immediately |
| **G-NUM** | `scripts/gates/uncited-number.sh` | In `src/sections/**` and `src/data/**`: any numeric literal adjacent to a unit token (`Gbps`, `Tbps`, `GB`, `TB`, `ns`, `us`, `ms`, `%`, `$`, `/hr`) must have a `[Tier-` marker or an explicit `SPECULATIVE`/`UNVERIFIED` marker within the same JSX element or object literal. | an uncited unit-bearing number | fabricated Spot estimates, hpc7a $3.60, Trn3 28.8 Tbps | after citation pass; needs a per-dive opt-in |
| **G-DERIVED** | `scripts/gates/derived-fields.sh` | Any field or column in `src/data/**` whose key matches `/(cost|price)Per|Estimate$|^spot/i` must carry a sibling `derived: true` or `source:` key. | a derived field presented as sourced data | `costPerGbps` and `spotEstimate` columns | immediately (once data modules exist) |
| **G-NEG** | `scripts/gates/negative-claims.sh` | Grep section prose for negative-claim phrasings (`no AWS source`, `not supported`, `there is no`, `never`, `nothing`, `zero .* (hits|support)`). Every hit must appear in the dive's claim manifest with `negative: true`. | a negative claim not routed to L6 | "no AWS source says hostNetwork is needed" | after the manifest extractor lands |
| **G-FILES** | `scripts/gates/required-files.sh` | Every dive dir has `README.md`, `sources.md`, `docs/adr/`, `src/__tests__/`, `.verification.json`. No empty tracked directories under `deep-dives/`. | missing artifact | missing README, empty `iac/`, missing `sources.md` on 2 of 3 dives (G8) | immediately |

What makes each of these deterministic: the input is the working tree, the logic is a
grep or a regenerate-and-diff, and no step consults a clock, a network, or a model.
Same tree, same verdict, forever.

### 2.2 Tier 1.5, networked, run by the audit runner

| ID | Script | Check logic | Exit 1 when | Exit 2 when |
|---|---|---|---|---|
| **N-REFETCH** | `scripts/audit/checks/pin-refetch.sh` | For each pinned citation in `claims.jsonl`: `curl -sf https://raw.githubusercontent.com/{repo}/{sha}/{path}`, extract the cited line range, compare against the `quote` field with whitespace normalised. | quote absent or changed at the pinned SHA | fetch fails, SHA unknown to the remote, rate limited |
| **N-LINK** | `scripts/audit/checks/link-rot.sh` | `curl -sIL --max-time 15` every unique external URL in `sources.md` and `src/**`. | 404 or 410 | timeout, 429, or 5xx (retry once, then UNVERIFIABLE) |
| **N-PRICE** | `scripts/audit/checks/price-recheck.sh` | For each row in `src/data/pricing.ts`: fetch the AWS bulk price list for the service and region, record its `Last-Modified`, filter to the row's SKU with `MarketOption=OnDemand`, compare to the checked-in figure. | derived figure differs from the checked-in figure | price list unreachable, SKU not found |
| **N-UPSTREAM** | `scripts/audit/checks/upstream-drift.sh` | For each watched repo in `.verification.json`: compare the pinned SHA to the current default-branch HEAD and to the latest release tag. Emit commits-behind and releases-behind counts. | never (advisory by design; emits the staleness input in section 5) | API unreachable |

`N-PRICE` deserves emphasis because it encodes the trap the EFA pass discovered. The
`MarketOption=OnDemand` filter is not an implementation detail, it is the check: a
`CapacityBlock` row exists at $0.00 for the same SKU, so an unfiltered re-derivation
returns a plausible wrong answer rather than an error.

`N-UPSTREAM` never fails. It exists to feed the staleness ledger, and a gate that fails
because someone else committed to their own repo would be unactionable noise.

### 2.3 Explicitly not deterministic, and why

- **Access-date staleness.** A gate whose verdict changes with the wall clock while the
  input tree is unchanged violates the ADR-004 contract directly. Staleness is a
  *scheduler input*, not a gate: it decides when to run agents. It lives in
  `scripts/audit/staleness-report.sh` and writes to the ledger. See section 5.
- **Acronym first-expansion ordering.** Requires stripping JSX to plain text and walking
  sections in nav order. The cheap half (every glossary acronym appears in the dive,
  every used acronym is in the glossary) is deterministic and should ship; strict
  ordering stays advisory until the extractor is proven, exactly as
  `section-architecture.md` recommends.
- **Prose word count per section.** Same fragility. Line count (G7 in
  `section-architecture.md`) is the honest deterministic proxy.

### 2.4 Per-dive opt-in

Applied repo-wide today, G-PIN, G-TELLS, G-CITE and G-NUM would fail on all three
existing dives at once. That is a wall, not a ratchet.

Each gate reads `deep-dives/{topic}/.verification.json`, which carries both the gate
opt-in list and the lens profile, so there is one file rather than the two that
`section-architecture.md`'s `.gates.json` and this design would otherwise create:

```json
{
  "gates": ["G-TELLS", "G-SVG", "G-FILES", "G-TIER"],
  "lenses": ["L1", "L2", "L3", "L4", "L5", "L6", "L7", "L8"],
  "watched_repos": [
    { "repo": "amzn/amzn-drivers", "pin": "b99452b7", "read": "2026-08-01" }
  ],
  "claim_classes": { "pricing": 30, "code": 90, "docs": 180, "event": 365 },
  "last_full_verification": null
}
```

The opt-in list is the visible record of how far the ratchet has turned. A dive is
"fully ratcheted" when its list contains every gate.

---

## 3. The runner

### 3.1 CLI

`scripts/audit/run-verification.sh`

```
Usage:
  run-verification.sh --dive <topic> [options]
  run-verification.sh --all [options]

Selection:
  --dive <topic>        verify one dive (deep-dives/<topic>)
  --all                 verify every dive except _template, plus the L9 cross-dive pass
  --lens L1,L3,L6       run only these lenses (default: the dive's .verification.json profile)
  --section <id>        restrict to one section id (repeatable)
  --stale-only          restrict to claims over their class staleness budget
  --findings <path>     re-verify only the findings in an existing FINDINGS.md (R0 mode)

Mode:
  --deterministic-only  Tier 1.5 network checks only. No LLM, no cost.
  --agents-only         skip Tier 1.5, go straight to lenses (assumes a recent N-* run)
  --dry-run             print the fan-out plan and cost estimate, write nothing, exit 0

Execution:
  --max-parallel N      concurrent shards (default 6)
  --max-claims-per-shard N   default 25
  --run-id <id>         override the default {YYYY-MM-DD}-{git short sha}

Output:
  --out <dir>           override the per-dive report root
  --no-rollup           skip writing docs/verification/{date}/
```

`--dry-run` is not decoration. ADR-003's flywheel counts budget (fetches used, agents
spawned, sections modified), and a verification run is the single largest agent spend in
the project. The plan must be inspectable before it is paid for.

`audit.sh` gains a `--with-verification` flag that shells into this runner, so the
existing entry point and the `pnpm audit:*` aliases keep working. `package.json` gains
`"verify": "bash scripts/audit/run-verification.sh"` and
`"verify:portfolio": "bash scripts/audit/run-verification.sh --all"`.

### 3.2 The claim manifest is the substrate

This is the piece that turns a one-off pass into a capability. Before any agent runs,
`scripts/audit/extract-claims.mjs` (deterministic Node, no LLM) parses
`deep-dives/{topic}/src/sections/*.tsx` and `src/data/*.ts` and emits `claims.jsonl`:

```jsonl
{"id":"efa-c0147","section":"inside-the-source","file":"src/sections/InsideSource.tsx","line":412,
 "text":"the kernel driver implements post_send, post_recv and poll_cq",
 "tier":1,"category":"C","citation":{"repo":"amzn/amzn-drivers","sha":"b99452b7",
 "path":"kernel/linux/efa/efa_data_verbs.c","lines":"1-798","read":"2026-08-01"},
 "class":"code","negative":false,"numbers":[],"subject":"efa.kernel_driver.data_verbs"}
```

Four consequences, each of which the EFA pass paid for by not having:

1. **Runs are comparable.** Two runs against the same tree verify the same claim set, so
   a diff between runs is meaningful. Without a manifest each run rediscovers a different
   claim set and "we fixed it" is unprovable.
2. **Shards are bounded and reproducible.** Fan-out is computed, not improvised.
3. **Findings address a stable id.** `claim_id: efa-c0147` survives text edits that a
   line number does not.
4. **The deterministic gates get a target list.** G-NEG and N-REFETCH both read the
   manifest rather than re-parsing JSX.

The extractor is the first thing to build and the only piece with no acceptable
substitute.

### 3.3 Fan-out

The proven unit of work is **one lens applied to one bounded claim cluster**. The EFA
pass's three verifiers (V1 core, V2 pricing, V3 EKS) were lens-and-topic shards and all
three returned. The 2026-04-21 pass's monolithic agent truncated, and 3 of its 11
per-section agents truncated. Section sharding alone is not the answer; bounded input is.

```
shard = { lens: L5, claims: [efa-c0140 .. efa-c0164], sections: [inside-the-source, architecture] }
```

Constraints:
- `<= 25` claims per shard (default), `<= 3` sections per shard.
- Concurrency capped at 6, run in waves.
- Each shard writes exactly one file and returns exactly one line to the orchestrator.

Wave order, which matters because later waves depend on earlier output:

1. **Wave 0 (free).** `extract-claims.mjs`, then Tier 1.5 `N-*` checks. Output feeds the
   agent waves: a claim whose pin already failed N-REFETCH does not need L1 spent on it,
   it needs a finding written.
2. **Wave 1.** L1, L2, L3 (evidence-heavy, network-bound).
3. **Wave 2.** L4, L5, L6, L7, L8 (judgment-heavy, read the Wave 1 evidence off disk).
4. **Wave 3 (R0).** Re-attack every REFUTED and PARTLY-CORRECT finding with proposed
   replacement text. Mandatory.
5. **Wave 4 (`--all` only).** L9 cross-dive, after every per-dive manifest exists.

### 3.4 On-disk convention

The brief offers two locations. Both are right, for different jobs.

```
deep-dives/{topic}/audit-reports/verification/{run-id}/
├── manifest/
│   ├── claims.jsonl              # deterministic extraction
│   └── plan.json                 # shard assignments, from --dry-run
├── deterministic/
│   ├── N-REFETCH.md
│   ├── N-LINK.md
│   ├── N-PRICE.md
│   └── N-UPSTREAM.md
├── shards/
│   ├── L1-cluster01.md           # one file per agent; the ONLY thing agents write
│   ├── L5-cluster03.md
│   └── R0-efa-f0012.md
├── FINDINGS.md                   # merged, severity-sorted (script, not agent)
├── RATCHET-BACKLOG.md            # proposed gates harvested from findings
└── SUMMARY.md                    # the only file a human or orchestrator reads

docs/verification/{YYYY-MM-DD}/
├── PORTFOLIO-SUMMARY.md          # roll-up across dives
├── {topic}-SUMMARY.md            # copy of each dive SUMMARY.md, frozen at this date
├── cross-dive-L9.md              # --all only
└── ledger.json                   # per-dive last-verified date, claim counts, open findings
```

`run-id` is `{YYYY-MM-DD}-{git short sha}`. The SHA is not decoration: a verdict is only
valid for the tree it ran against, and without the SHA a stale SUMMARY.md silently
claims authority over edited content. Per-dive reports stay next to the dive (ADR-004's
existing convention, and they are the working artifacts). `docs/verification/{date}/` is
the portfolio record and the thing Carlos reads.

Note that commit `0a667ed` deleted `audit-reports/` before publication. Keep that
behaviour: `audit-reports/` holds working artifacts and may be pruned, while
`docs/verification/{date}/` is permanent history. Add
`deep-dives/*/audit-reports/**/shards/` and `manifest/` to `.gitignore`; commit
`FINDINGS.md`, `RATCHET-BACKLOG.md` and `SUMMARY.md`.

### 3.5 Context discipline

ADR-004's rule is that findings land as markdown on disk and never stream into
orchestrator context. Made concrete:

- Each shard agent's **only** return value to the orchestrator is one line:
  `{shard-id} {status} {n_findings} {relative-path}`. The agent prompt states this as a
  hard contract and forbids summarising findings in the reply.
- The merge is done by `scripts/audit/merge-findings.mjs`, a deterministic script that
  reads shard files off disk and writes `FINDINGS.md`. No LLM reads all the shards.
  This is what keeps portfolio-wide runs from hitting the exact context wall that
  truncated the 2026-04-21 monolithic agent.
- `SUMMARY.md` is generated by the same script from the finding frontmatter: counts by
  verdict, counts by severity, the blocker list, and the ratchet backlog. It is a
  rendering of structured data, not a written summary.

### 3.6 Finding schema and triage

Every finding, in every shard file, carries frontmatter:

```yaml
---
id: EFA-L5-0007
lens: L5
claim_id: efa-c0147
verdict: CONFIRMED | PARTLY-CORRECT | REFUTED | UNVERIFIABLE
severity: blocker | correction | qualification | note
confidence: high | medium | low
evidence:
  - { repo: amzn/amzn-drivers, sha: b99452b7, path: kernel/linux/efa/efa_dev_ops.c, lines: 44-71, fetched: 2026-08-01 }
  - { url: "https://docs.aws.amazon.com/...", accessed: 2026-08-01 }
proposed_text: "On the out-of-tree amzn-drivers build (ENABLE_KVERBS, on by default) ..."
ratchet: proposed-gate:G-SCOPE-KVERBS | existing-gate:G-PIN | none
---
```

Severity ladder, with the action each triggers:

| Severity | Definition | Action |
|---|---|---|
| `blocker` | fabricated, or REFUTED and load-bearing | must not ship; text change required before publish |
| `correction` | wrong as written, replacement text supplied | text change required |
| `qualification` | true under a narrower scope | add the qualifier, do not delete the claim |
| `note` | style, tier label, or a better citation available | backlog |

The `ratchet:` field is the mechanism that makes ADR-004's ratchet principle operational
rather than aspirational. `merge-findings.mjs` greps for `ratchet: proposed-gate:` and
writes `RATCHET-BACKLOG.md`, so the question "which gates does this run owe us" is
answered by a script instead of by remembering. A run that produces findings and no
ratchet backlog entries is a run whose findings will recur.

Triage flow: `FINDINGS.md` sorted by severity, then by section. Carlos reads
`SUMMARY.md`. Blockers and corrections go to a fix wave. Every fix wave re-runs
`pnpm gates`. R0 has already re-attacked the corrections before Carlos sees them.

---

## 4. Agent and skill definitions

Both `.claude/agents/` and `.claude/skills/` are empty. ADR-004 Phase 3 says to build
them with the `skill-creator` and `agent-builder` plugins, eval-driven. Both plugins are
present in this environment.

### 4.1 Skills (the procedure, shared across agents)

`.claude/skills/`

| Skill | Contains | Used by |
|---|---|---|
| `source-authority` | Promotion of `deep-dives/efa/revamp/source-authority-standard.md` to repo scope: the code-is-authority ordering, the A/B/C/D categories, pinning rules, and the named `SRD.txt` trap. Every other skill references it. | all |
| `verify-claim-provenance` | L1/L2 procedure: construct the raw URL at the SHA, fetch, extract the line range, compare, and the rule that a claim of "unchanged" without retrieved text is invalid. Includes the WebSearch fallback (see 4.4). | code-provenance-verifier |
| `verify-numeric-tier1` | L3/L7 procedure: bulk price list retrieval, recording `Last-Modified`, the `MarketOption=OnDemand` filter and the `CapacityBlock` $0.00 trap, the two-dated-observations rule for causal stories. | numeric-verifier |
| `detect-inference-as-fact` | L4: category C detection, the load-bearing test, worked examples (`0xefa4`, the 8x4 arithmetic). | claim-scope-adversary |
| `detect-scope-overstatement` | L5: the qualifier axis checklist (upstream vs vendor fork, build flag, version, shipping installer vs master HEAD, region, instance family, product tier) and the demonstrated-failing-case requirement. | claim-scope-adversary |
| `refute-negative-claims` | L6: three-orthogonal-searches protocol, the failed-search record format, worked examples from both outcomes in the EFA pass. | claim-scope-adversary |
| `write-verification-finding` | The frontmatter schema, the evidence block format, the one-line return contract, and the file path convention. Every agent loads this, so the schema lives in exactly one place. | all |

Seven skills. The last one is the load-bearing one: a shared output contract is what lets
`merge-findings.mjs` stay a deterministic script.

### 4.2 Agents (the persona, tool scope, model)

`.claude/agents/`

| Agent | Lenses | Tools | Model | Notes |
|---|---|---|---|---|
| `code-provenance-verifier` | L1, L2 | Read, Grep, Glob, Bash (curl, git), WebFetch, Write (report path only) | Opus for L2, Sonnet acceptable for pure L1 | The only agent allowed to declare a doc-code contradiction. |
| `numeric-verifier` | L3, L7, L8 | Read, Grep, Bash, WebFetch, AWS pricing MCP | Opus | Numbers are where fabrication lives; judgment tier. |
| `claim-scope-adversary` | L4, L5, L6 | Read, Grep, Glob, WebFetch, WebSearch, Write | Opus | Highest-yield lens set in the EFA pass and the least mechanical. |
| `portfolio-consistency-auditor` | L9 | Read, Grep across all dives, Write | Opus | Input is the pre-clustered candidate-pair list, never the raw cross product. |

Four agents, run as many shards each. Claim extraction and finding merge are scripts, so
no model tier is spent on them. No Haiku anywhere: every one of these tasks is a judgment
call about whether evidence supports a claim.

Each agent definition states, verbatim: write findings to the given path; return one
status line; never summarise findings in the reply; never edit any file under
`deep-dives/*/src/`.

### 4.3 The eval set already exists

`VERIFICATION-SUMMARY.md` is a labelled corpus, which is what `agent-builder`'s
eval-driven process needs and what would otherwise take a day to construct:

- **Positive cases (should flag).** Data Path Direct does not eliminate rdma-core
  (REFUTED, L2). The kernel-driver claim is out-of-tree only (L5). `0xefa4` = "EFA v4" is
  unsourced (L4). "No AWS source says hostNetwork is needed" (L6). The four Spot
  estimates, hpc7a $3.60, Trn3 28.8 Tbps (L8). "Prices fell since March 2026" (L7).
  "SRD is built on top of ENA" (L2). Roughly 20 labelled items.
- **Negative cases (should not flag).** The seven CONFIRMED pricing claims, including
  $55.04 and $21.957642. The aws-dranet chart and support matrix. Batch MNP is ECS-only.
  These measure the false-positive rate, which is the number that decides whether anyone
  keeps running the harness. An adversary that flags everything is an adversary that gets
  turned off.
- **Trap cases.** The two corrections that were themselves wrong (trn2 memory, the
  "100 Gbps class" grouping for g4dn/g5/vt1) are the R0 eval set.

Target on the seed set: recall above 0.8 on positives, false-positive rate below 0.2 on
negatives. Both are measurable against a corpus that already exists, which is the reason
to build the agents now rather than after the EFA revamp overwrites its own evidence.

### 4.4 Environment blocker to encode

`VERIFICATION-SUMMARY.md` and `REVAMP-PLAN.md` both record that WebSearch failed on
every call for at least one agent with
`400 output_config.effort 'xhigh' is not supported when thinking is disabled`. Every
agent worked around it with WebFetch and curl against raw GitHub, which the summary notes
gave better provenance anyway.

Encode this as a rule in `verify-claim-provenance` rather than leaving it to rediscovery:
prefer WebFetch or curl against `raw.githubusercontent.com` at the pinned SHA; use
WebSearch only for discovery (finding candidate counterexamples in L6), never for
evidence. This is a better rule regardless of the bug, because a search result is not a
citable artifact.

---

## 5. Cadence and budget

### 5.1 Cadence

| Layer | Trigger | Cost | Wall time |
|---|---|---|---|
| Tier 1 gates | every commit, via `pnpm gates` | zero | seconds |
| Tier 1.5 (`--deterministic-only`) | weekly cron per dive; also before any publish | zero tokens, ~200 HTTP requests | 2 to 5 minutes |
| Per-dive agent run | ADR-003 Gate 3 before publish; on staleness trigger; after any upstream release on a watched repo | see 5.3 | 30 to 60 minutes |
| Portfolio run (`--all`) | quarterly, and once whenever a new dive lands (for L9) | see 5.3 | 2 to 4 hours |

The weekly Tier 1.5 run is the load-bearing cadence item. It costs nothing, it is
deterministic, and it is the layer that catches the failure mode that actually shipped:
a price that moved after publication. Everything above it is discretionary.

### 5.2 Staleness budget

Time since publication is the wrong trigger on its own. The EFA price was wrong at
publish, not after it, so a "re-verify after N months" rule would have re-verified a
claim that was never right. The budget is therefore per claim class, recorded in the
manifest and enforced by `staleness-report.sh` against the ledger.

| Class | Budget | Why this number |
|---|---|---|
| `pricing` | 30 days | The AWS bulk price list publishes a `Last-Modified` header and the EFA pass observed a real cut landing between the May 2025 and June 2025 lists. Monthly is the natural period of the artifact. Checking is free (N-PRICE, no LLM), so the budget is set by the artifact's period, not by cost. |
| `code` | 90 days, or any new release tag on a watched repo, whichever is first | A pinned SHA cannot go stale, so the budget is about relevance, not correctness. 90 days is one quarter of upstream drift; the release-tag trigger is what actually matters, because the EFA pass found that shipping installer 1.49.0 still carried driver 3.1.0 while master had r3.3.0. Version-skew findings arrive with releases, not with calendar time. |
| `docs` | 180 days | AWS doc pages carry no reliable change signal, so this is a sampling interval rather than a response to an event. Half a year keeps annual re:Invent-cycle changes inside one window while keeping the re-verification volume at roughly two runs per year per dive. |
| `event` | 365 days | Facts about a dated past event (an announcement, a GA date, a release date) do not move. The budget exists only to catch misattribution, which is a low-rate error. |

**Trigger rule.** A dive enters re-verification when either condition holds:

- any `pricing` claim is over budget, or
- more than 10 percent of claims in any single class are over budget.

The 10 percent floor exists so a handful of aged doc citations does not trigger a full
agent run. The pricing exception exists because pricing errors are the ones that mislead
a cost decision, which is the failure the EFA pass rated most serious.

**Scope rule.** The trigger runs `--stale-only`, not a full pass. Re-verifying 30 stale
claims costs roughly a tenth of re-verifying 300.

### 5.3 Agent count and cost

These are derived estimates from the observed EFA run, not measurements. Labelled as
such.

For a 24-section dive with roughly 300 extracted claims:

- Claims per lens: L1 and L2 apply to code-cited claims only (~40 percent), L3/L7/L8 to
  numeric claims (~25 percent), L4/L5 to all load-bearing claims (~60 percent), L6 to
  negative claims (~5 percent).
- At 25 claims per shard: roughly 5 + 3 + 7 + 1 = **16 shards**, plus **4 to 6 R0 shards**
  in Wave 3 if the finding rate resembles the EFA pass (about 20 corrections).
- **Per-dive total: 20 to 22 agent invocations**, in 4 waves of at most 6 concurrent.
- **Portfolio (4 dives including caching): 80 to 90 shards plus 3 to 5 L9 shards.**

Cost control levers, in the order to reach for them:

1. `--deterministic-only` weekly (zero token cost, catches the highest-frequency failure).
2. `--stale-only` on trigger, rather than full re-runs.
3. Manifest-bounded shards, so cost scales with claim count rather than with file size.
4. Model tiering: scripts for extraction and merge, Opus only for the judgment lenses,
   Sonnet acceptable for pure L1 mechanical comparison.
5. `--dry-run` before every full run, so the spend is a decision rather than a surprise.

---

## 6. Proposed ADR-0005 outline

**One-line thesis.** Verification is a portfolio capability with its own runner, its own
artifact convention, and its own cadence, and a finding is only durable if it either
changes the text or becomes a gate.

**Numbering collision, flagged for Carlos.** `deep-dives/efa/revamp/section-architecture.md`
already proposes `docs/adr/0005-inline-citation-architecture.md` for the same slot. Both
are repo-level. Recommendation: this ADR takes `0005` because it is the direct successor
to ADR-004 Phase 3 and because the citation architecture is one of its inputs; the
inline-citation decision becomes `0006`. Carlos to confirm before either is written.

```
# ADR-0005: Portfolio-Wide Verification

Status: Proposed
Date: 2026-08-01
Supersedes: ADR-004 Phase 3 (the unbuilt agent tier)
Extends: ADR-002 (freshness verification), promoting it from a per-dive design doc
         at deep-dives/efa/docs/adr/ to repo scope with an implementation
Related: ADR-003 (iteration flywheel, Gate 3), ADR-004 (two-tier quality gates)

## Context
- ADR-004 Phase 3 was specified and never built: scripts/audit/ absent,
  .claude/agents and .claude/skills empty, audit.sh --with-agents is a no-op.
- The 2026-08-01 EFA pass proved the agent tier finds real errors (6 overstated,
  1 refuted, plus fabricated pricing) but was hand-assembled and unrepeatable.
- ADR-002 predicted claim decay and has no implementation. The p5.48xlarge price
  was nine months wrong on the day the dive shipped and stayed wrong for five more.
- The portfolio is now three dives with a fourth scoped. One-off verification does
  not compose.
- The repo has no cross-dive consistency check, and vLLM already carries EFA claims
  that the EFA revamp is about to contradict.

## Decision
1. Adopt the nine-lens catalogue (L1..L9) plus the R0 correction re-verification rule.
2. Add Tier 1.5 to ADR-004's architecture: deterministic, networked, no LLM,
   runs in the audit runner rather than ci.sh, which keeps its no-network contract.
3. Make the claim manifest the substrate. No agent verification runs without
   claims.jsonl produced by a deterministic extractor.
4. Ratchet the mechanical residue of each lens into named gates (G-PIN, G-TIER,
   G-CITE, G-SYNC, G-TELLS, G-SVG, G-NUM, G-DERIVED, G-NEG, G-FILES;
   N-REFETCH, N-LINK, N-PRICE, N-UPSTREAM), with per-dive opt-in via
   deep-dives/{topic}/.verification.json.
5. Ship scripts/audit/run-verification.sh with per-dive and --all invocation,
   lens-and-cluster shard fan-out capped at 25 claims and 6 concurrent shards,
   and mandatory R0 wave.
6. Fix the artifact convention: working reports under
   deep-dives/{topic}/audit-reports/verification/{run-id}/, permanent record
   under docs/verification/{date}/ with a ledger.json.
7. Make every finding carry a ratchet: field, and have the merge script harvest
   RATCHET-BACKLOG.md from it. This is how ADR-004's ratchet principle stops
   being aspirational.
8. Promote source-authority-standard.md (code is the authority; categories A/B/C/D)
   from the EFA revamp folder to a repo-level skill and a CLAUDE.md / AGENTS.md rule.
9. Set the cadence: Tier 1 per commit, Tier 1.5 weekly, per-dive agent run at
   ADR-003 Gate 3 and on staleness trigger, portfolio quarterly.
10. Set the staleness budget per claim class (pricing 30d, code 90d or new release
    tag, docs 180d, event 365d) with the pricing-any / 10-percent-of-class trigger
    and --stale-only scoping.

## Consequences
Positive: verification becomes repeatable across dives and across time; findings
compound into gates; a new dive inherits the harness from its first commit; the
cheapest tier catches the failure that actually shipped; VERIFICATION-SUMMARY.md
becomes a reusable eval corpus.
Negative: a third tier and a fourth runner script to learn; the claim extractor is
new machinery with no substitute; agent runs remain expensive and human-triggered;
per-dive opt-in means the portfolio is unevenly ratcheted for a while, and the
opt-in file is itself a thing that can drift.
Neutral: existing dives will fail several gates on day one, which is why opt-in
exists; the ledger introduces state that must be committed and kept honest.

## Alternatives Considered
A. Extend audit.sh in place rather than a new runner. Rejected: audit.sh dispatches
   render/diagram/route auditors for rendered-DOM defects, a different problem with
   a different input (a running browser, not a claim manifest).
B. Put staleness in ci.sh as a gate. Rejected: a verdict that changes with the wall
   clock on an unchanged tree breaks ADR-004's determinism contract directly.
C. Agent-only verification, no manifest. Rejected: that is the 2026-08-01 pass,
   which worked once and cannot be repeated or diffed.
D. One monolithic verifier agent per dive. Rejected: the 2026-04-21 audit truncated
   a monolithic agent and 3 of 11 per-section agents. Bounded input is the fix.
E. Block merges on verification. Rejected for ADR-004's three original reasons
   (determinism, speed, cost), all of which apply more strongly here.

## References
- deep-dives/efa/revamp/VERIFICATION-SUMMARY.md (the evidence base and the eval corpus)
- deep-dives/efa/revamp/source-authority-standard.md (the rule being promoted)
- deep-dives/efa/revamp/section-architecture.md section 5 (the eight gates this absorbs)
- docs/verification/2026-08-01/P5-verification-harness-design.md (this design)
```

---

## 7. Build order

Nothing here needs to land at once. The order is chosen so each step is useful alone.

| Step | Deliverable | Unblocks |
|---|---|---|
| 1 | `scripts/audit/extract-claims.mjs` plus `.verification.json` schema | everything; no substitute |
| 2 | Tier 1.5 checks (N-REFETCH, N-LINK, N-PRICE, N-UPSTREAM) and `--deterministic-only` | the weekly cadence, at zero token cost |
| 3 | Immediately-landable Tier 1 gates: G-TELLS, G-SVG, G-FILES, G-TIER, G-DERIVED | the ratchet's first turn |
| 4 | `write-verification-finding` skill plus `merge-findings.mjs` | the shared output contract |
| 5 | The four agents plus six remaining skills, eval-driven against the EFA corpus | Tier 2 |
| 6 | `run-verification.sh` full fan-out, R0 wave, roll-up | per-dive runs |
| 7 | L9 and `--all` | portfolio runs |
| 8 | ADR-0005 written, `source-authority` promoted into CLAUDE.md and AGENTS.md | the standard binds future dives |
| 9 | Remaining gates as their prerequisites land: G-PIN, G-CITE, G-SYNC, G-NUM, G-NEG | full ratchet |

Steps 1 to 3 deliver most of the value that the EFA pass paid an agent fleet for, at zero
recurring token cost. Build them first.
