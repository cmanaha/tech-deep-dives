# Verification: Graviton Deep Dive

Verified: 2026-10-23. Claims checked: 50 (sampled: 0, every claim checked). Confirmed 45,
wrong 3, unsupported 2, mislabelled 0, unverifiable 0.

No personal data went into any request. Fetches used WebFetch or curl with its default
User-Agent (raw.githubusercontent.com, api.github.com, docs.aws.amazon.com, aws.amazon.com,
aboutamazon.com, arm.com, chipsandcheese.com, support.arm.com).

## Gate 3 score: 8/10

Every Graviton4 and Graviton5 figure the section leans on (192 cores in one package, two
nodes with 96 MB of LLC each, 12 x DDR5-8800, 844.8 GB/s and 4.4 GB/s per core, the NUMA
count per size, Nitro v6, the GA dates) holds against AWS's own pages. The three wrong
figures sat in supporting detail (the BFMMLA shape, a rounding, a KB conversion) and are
fixed. The section carries a clear mental model with a size-by-NUMA table and ends on
commands the reader types. It loses points for repeating the 57% and 21% pair in six places
and for a placement list that is partly generic.

| Criterion | Score | Evidence |
| --- | --- | --- |
| Accuracy (after fixes) | 9 | 45 of 50 confirmed. None of the 5 failures was load-bearing: BFMMLA shape, 138.6 rounding, 375 KB unit, two shape and core-type cites; all fixed. |
| Mental model or practical value | 8 | "The model to carry" plus the diagram give the two-domain model; the size table and `numactl` lines are practical. Three bullets in "Fits Graviton5 well" (KV-cache and tokenizer fleets, locality-friendly microservices, latency-sensitive work) are generic and unsourced. |
| Shape | 9 | Introduces Graviton before dissecting it. h2 descriptions name the reader's moment. -21% lands in the intro, diagram, table and alert. Size detail is demoted into an ExpandableSection. The section ends on `-mcpu`, the NUMA check and the guide. |
| Writing | 8 | no-ai-tells gate clean. Attribution in the sentence only where it marks a vendor claim, a silence ("lists no SME", "does not list metal-48xl") or advice ("AWS recommends"). CMN first appears in the table before its expansion in prose; GEMM and SGEMM are never expanded. |
| Economy | 7 | +12% words is justified by the register's new material, but the 57%/21% derivation is restated in the intro, the table, the alert, the SLM alert and a placement bullet. |
| Diagrams | 9 | Inline SVG, `role="img"` with a sentence title, fonts 11 to 13 px, phone scroll wrapper. The probe found no overlap at 1440 or 390, and the PNGs are clean. |

## Claims

Source keys refer to `src/sources/GravitonDeepDive.ts`. README = aws-graviton-getting-started
README at 8b322a4, processor table.

| # | Claim (as shown) | Source key | Verdict | Source text (page) | Fix |
| --- | --- | --- | --- | --- | --- |
| 1 | Graviton4 announced at re:Invent 2023 | r8gPreview | CONFIRMED | Post dated "28 NOV 2023", category "AWS re:Invent" | none |
| 2 | Graviton4 GA since July 2024, starting with R8g | r8gGa | CONFIRMED (date) | "09 JUL 2024"; R8g "have been available in preview since re:Invent 2023" and "are now generally available". The post does not call R8g the first GA Graviton4 family; "starting with" rests on R8g being the family Graviton4 was announced in (preview post) | none |
| 3 | Graviton4 core is Neoverse V2 | r8gPreview | CONFIRMED | "96 Neoverse V2 cores, 2 MB of L2 cache per core, and 12 DDR5-5600 channels" | none |
| 4 | Graviton5 core is Neoverse V3 | graviton5AboutAmazon (intro) | UNSUPPORTED | Neither About Amazon nor the M9g post contains "Neoverse" (page text searched). README row "Core": "Neoverse-V3" | Added README cite |
| 5 | Graviton5 announced December 2025 | graviton5AboutAmazon | CONFIRMED | "The original article published on December 4, 2025 follows." | none |
| 6 | M9g GA June 2026 | m9gGa | CONFIRMED | "10 JUN 2026"; "Today, M9g instances are generally available, alongside the new M9gd instances" | none |
| 7 | C9g GA later that month | c9gGa | CONFIRMED | "30 JUN 2026"; "the general availability of ... C9g and C9gd instances" | none |
| 8 | R9g GA August 2026 | r9gGa | CONFIRMED | "31 AUG 2026"; "Today, Amazon EC2 R9g and R9gd instances are generally available" | none |
| 9 | First CPU in the AWS fleet with PCIe Gen6 and DDR5-8800 | m9gGa | CONFIRMED | "As the first CPU in the AWS fleet to support the latest generation of PCIe Gen6 and DDR5-8800 memory" | none |
| 10 | M9g and M9gd introduced NIE | m9gGa | CONFIRMED | "With M9g and M9gd instances we are raising the bar on security even further with the introduction of Nitro Isolation Engine." | none |
| 11 | 192 cores in a single package | graviton5AboutAmazon | CONFIRMED | "192 cores in a single package." | none |
| 12 | Package runs as two NUMA nodes, each with its own 96 MB LLC | gravitonReadme | CONFIRMED | "Memory (NUMA) nodes ... 1 (2 for 16xlarge and 48xlarge)"; "96MB per NUMA (24xlarge and 48xlarge)" | none |
| 13 | Two domains of 96 cores; 1 MB LLC per core in a node (derived) | gravitonReadme | CONFIRMED | 192 / 2 nodes on 48xlarge; 24xlarge is 96 vCPUs (96 cores) on 1 node with 96 MB; 96 / 96 = 1 | none |
| 14 | Package bandwidth +57%, per-core share -21% (derived) | m9gGa, r8gPreview | CONFIRMED | 844.8 / 537.6 = 1.571; 4.4 / 5.6 = 0.786 | none |
| 15 | ISA Armv9.0-A / Armv9.2-A | gravitonReadme | CONFIRMED | "Architecture revision ... Armv9.0-a / Armv9.2-a" | none |
| 16 | Graviton4 cores: 96 per socket, 192 on two-socket 48xlarge | gravitonReadme | CONFIRMED | "96 per socket (192 for 2-socket 48xlarge)" | none |
| 17 | Graviton4 2.8 GHz (2.7 on 48xlarge), no turbo | gravitonReadme | CONFIRMED | "2800MHz (2700MHz for 48xlarge)"; "Turbo supported ... No" | none |
| 18 | Graviton5 3.3 GHz, no turbo | gravitonReadme | CONFIRMED | "3300MHz"; "No" | none |
| 19 | L1 64 / 64 KB, both generations | gravitonReadme | CONFIRMED | "64kB inst / 64kB data" | none |
| 20 | 4-cycle L1D (measured) | chipsAndCheeseGraviton4 | CONFIRMED | "Minimum access latency is 4 cycles on V2's data cache." | none |
| 21 | L2 2 MB per core, both generations | gravitonReadme | CONFIRMED | "L2 cache (per core) ... 2MB / 2MB" | none |
| 22 | L2 11 cycles (measured) | chipsAndCheeseGraviton4 | CONFIRMED | "Latency is good at 11 cycles" | none |
| 23 | Graviton4 L3 36 MB shared, CMN-700 | gravitonReadme | CONFIRMED | "LLC (shared) ... 36MB"; "Interconnect ... CMN-700" | none |
| 24 | Graviton5 L3 2 x 96 MB per node, CMN-S3; 48 MB per node up to 16xlarge | gravitonReadme | CONFIRMED | "48MB per NUMA (<= 16xlarge), or 96MB per NUMA (24xlarge and 48xlarge)"; "CMN-S3" | none |
| 25 | Graviton4 L3 per core "375 KB" (derived) | gravitonReadme | WRONG | 36 MB / 96 = 0.375 MB. Writing it as 375 KB converts with 1 MB = 1000 KB, while the same table's cache sizes (64 KB, 2 MB) are binary units, where it would be 384 KB | Restated as 0.375 MB (table, prose, diagram) |
| 26 | AWS: 2.6x more L3 per core | graviton5AboutAmazon | CONFIRMED | "Each Graviton5 core has access to 2.6x more L3 cache than Graviton4" | none |
| 27 | AWS: 5x larger L3 | m9gGa | CONFIRMED | "With 192 cores, a 5x larger L3 cache" | none |
| 28 | Graviton4 12 x DDR5-5600 | r8gPreview | CONFIRMED | "12 DDR5-5600 channels"; R9g post also: "up from 5600 MT/s in Graviton4" | none |
| 29 | 24 channels on two-socket 48xlarge | gravitonReadme | CONFIRMED | "12x DDR5 (24x for 48xlarge)" | none |
| 30 | Graviton5 12 x DDR5-8800 | gravitonReadme, m9gGa | CONFIRMED | "12x DDR5"; "DDR5-8800 memory"; C9g "DDR5 8800MT/s DIMMs" | none |
| 31 | 537.6 GB/s; 5.6 GB/s per core (derived) | r8gPreview | CONFIRMED | 12 x 5.6 GT/s x 8 B = 537.6; / 96 = 5.6. Chips and Cheese confirms 64 bits per channel: "12 channel, 768-bit DDR5-5600" | none |
| 32 | 844.8 GB/s; 4.4 GB/s per core, 21% less (derived) | m9gGa | CONFIRMED | 12 x 8.8 x 8 = 844.8; / 192 = 4.4; the M9g post gives no GB/s figure ("higher memory bandwidth" only), so the note's hedge holds | none |
| 33 | DDR5-8800 is 57% more per channel than DDR5-5600 (derived) | m9gGa | CONFIRMED | 8,800 / 5,600 = 1.571 | none |
| 34 | Graviton4 NUMA: 1; 2 on two-socket 48xlarge | gravitonReadme | CONFIRMED | "1 (2 for 48xlarge)" | none |
| 35 | Cross-socket "about 138 ns" (measured) | chipsAndCheeseGraviton4 | WRONG | "Crossing socket boundaries brings latency to 138.6 ns on average" (rounds to 139) | Restated as 138.6 ns on average (table, expandable) |
| 36 | Core to core 30 to 60 ns (measured) | chipsAndCheeseGraviton4 | CONFIRMED | "Cacheline bounce latency across the CMN-700 mesh is quite good, with a latency of 30-60 ns." | none |
| 37 | Graviton5 NUMA: 1; 2 on 16xlarge and 48xlarge | gravitonReadme | CONFIRMED | "1 (2 for 16xlarge and 48xlarge)" | none |
| 38 | Up to 33% lower inter-core latency, credited to the single package (vendor claim) | graviton5AboutAmazon | CONFIRMED | "192 cores in a single package. This efficient design reduces the distance data must travel between cores, cutting inter-core communication latency by up to 33%" | none |
| 39 | Graviton4 instances C8g, M8g, R8g, X8g, I8g | gravitonReadme | CONFIRMED | Instances row lists exactly these five | none |
| 40 | Graviton5 M9g, M9gd, C9g, C9gd, R9g, R9gd on Nitro v6 | ec2 gp / co / mo | CONFIRMED | Hypervisor column "Nitro v6" for all six families | none |
| 41 | Size table: 1 to 48 / 64 / 96 / 192 vCPUs, one core each; nodes 1/2/1/2; LLC 48/48/96/96 MB | ec2 gp / co / mo, gravitonReadme | CONFIRMED | vCPUs equal cores, 1 thread per core, identical for m9g, c9g and r9g (medium 1 through 48xlarge 192); README rows as in 24 and 37 | none |
| 42 | metal-48xl is not in AWS's processor table | gravitonReadme | CONFIRMED | Table names only 16xlarge, 24xlarge and 48xlarge (the M9g post lists metal-48xl at 192 vCPUs) | none |
| 43 | ML inference up to 35% faster (vendor claim) | m9gGa | CONFIRMED | "up to 25% better compute performance compared to Graviton4-based instances, with ... up to 35% for machine learning inference" | none |
| 44 | Arm: "double-digit performance improvements over Neoverse V2 on cloud and ML applications" (vendor claim) | armNeoverseV3 | CONFIRMED | Verbatim on the page | none |
| 45 | FEAT_I8MM provides SMMLA, UMMLA, USMMLA; FEAT_BF16 adds BFMMLA | llvmMatMulDefs | CONFIRMED | L1752-1755 `let Predicates = [HasMatMulInt8]` with SMMLA, UMMLA, USMMLA; L1728-1731 `[HasNEON, HasBF16]` with `def BFMMLA` | none |
| 46 | SMMLA: 2x8 int8 by 8x2 int8 into a 2x2 int32 block in one 128-bit register | llvmMatMulFormat | UNSUPPORTED | LLVM gives only the types (`v4i32` from two `v16i8`; `.4s, .16b, .16b`), not the shape. QEMU v11.1.2 `do_mmla_b`: per 16-byte segment, sum0..sum3 each an 8-element dot product of one 8-byte row of `vn` and one of `vm` | Added qemuInt8Mmla record and cite |
| 47 | BFMMLA is "the same operation" on BF16 inputs with FP32 accumulators | llvmMatMulDefs | WRONG | FP32 accumulators confirmed (LLVM formats L9152-9160: `v4f32` from two `v8bf16`, not in the cited InstrInfo range). The shape differs: QEMU `gvec_bfmmla` builds each of four FP32 sums from two `bfdotadd` steps of two BF16 products, so 2x4 by 4x2, not 2x8 by 8x2 | Rewritten as "multiplies a 2x4 BF16 matrix by a 4x2 one into a 2x2 block of FP32 accumulators in the same 128-bit register"; LLVM note cut to what L1727-1755 states; qemuBfmmla added |
| 48 | Graviton3 bf16 and int8; Graviton4 adds SVE2 forms; Graviton5 adds afp and wfxt; BF16 and MMLA on G3/G4/G5 | gravitonReadme, gravitonLlamaCpp | CONFIRMED | "sve, rng, bf16, int8" / "sve2, sve-int8, sve-bf16, sve-bitperm, sve-crypto" / "afp, wfxt"; llama.cpp.md L85: Graviton3(E), Graviton4 and Graviton5 "support BFloat16 format and MMLA instructions" | none |
| 49 | No SME in the Graviton5 table; SIMD row "4x Neon/SVE 128-bit vectors" | gravitonReadme | CONFIRMED | No SME entry in any row; "SIMD instructions ... 4x Neon/SVE 128bit vectors" | none |
| 50 | ONNX Runtime INT8 MMLA QGEMM and BF16 SGEMM for Graviton3 since v1.17.0, released February 2024; MMLA on by default, BF16 opt-in via `mlas.enable_gemm_fastmath_arm64_bfloat16`; `-mcpu=neoverse-512tvb` for G3/G4/G5 | gravitonOnnx, onnxRuntime1170, gravitonReadme | CONFIRMED | onnx.md L34 "Starting version v1.17.0 ... Bfloat16 accelerated SGEMM kernels and INT8 MMLA accelerated Quantized GEMM (QGEMM) kernels"; L38 "MMLA QGEMM kernels are enabled by default"; L50 session config key; GitHub API `published_at` 2024-02-03; README `-mcpu` row "neoverse-512tvb" for Graviton3(E), 4 and 5 | none |

Diagram text was checked as part of rows 11 to 37 (cores, 2 MB L2, 36 and 96 MB LLC, per-core
LLC, DDR5 speeds, 537.6 and 844.8 GB/s, 5.6 and 4.4 GB/s, 21%, 48xlarge and 16xlarge node
notes, 24xlarge one node). Tiers: every URL carries the same tier in every source file
that uses it (scripted cross-check across `src/sources/*.ts`).

Scope note, not changed: "Only the two-socket 48xlarge adds a second node" (prose and
diagram) follows the README row "1 (2 for 48xlarge)". The table does not list Graviton4
metal-48xl sizes. For Graviton5 the page says so, but the Graviton4 claim does not carry the
same scope.

## ORCH-NOTES items

ORCH-NOTES.md flags nothing for this section. Verdicts for the four items in the dispatch:

1. **Graviton4 and Graviton5 figures.** All confirmed against AWS pages (README at 8b322a4,
   EC2 instance-type docs, AWS News Blog GA posts, About Amazon), except the three fixes
   above:
   - Cores 96 per socket / 192 in one package.
   - Neoverse V2 / V3; V3 was cited only to About Amazon, which does not name it, and now
     cites the README.
   - 12 channels of DDR5-5600 / DDR5-8800.
   - Bandwidth: derived, and AWS publishes no GB/s figure in the pages read.
   - LLC 36 MB / 96 MB per node (48 MB per node at 16xlarge and below).
   - NUMA per size as in rows 34, 37 and 41.
   - PCIe: Gen6 only. No lane count appears on the page or in any AWS page read, so there
     is nothing to check.
   - Families and GA dates as in rows 2 and 6 to 8, plus 39 and 40.
   - No Graviton5 figure comes from trade press. Every Graviton5 family named is GA, so no
     part needs the roadmap label.
2. **SVE width and BF16/INT8 throughput.** The only width claim is AWS's SIMD row, "4x
   Neon/SVE 128bit vectors". It is a core microarchitecture spec (Tier 1, not a performance
   claim); the README does not label it per core or per chip, and the page quotes it as-is.
   The page gives no BF16 or INT8 throughput figure. The two performance figures are
   per-generation vendor claims marked `vendor-claim`: AWS "up to 35%" ML inference
   (instance level, against Graviton4) and Arm's "double-digit" (core IP, against V2). The
   MMLA shapes are per instruction; the BFMMLA shape was wrong and is fixed.
3. **Consistency with Chiplet and Interconnect.** Consistent on one package (192 cores),
   one or two NUMA nodes (two on 16xlarge and 48xlarge), the CMN-S3 mesh, and LLC 96 MB per
   node on 24xlarge and 48xlarge (48 MB smaller). Mismatches are under "For the
   orchestrator".
4. **GitHub pinning.** All pinned. Four aws-graviton-getting-started URLs are at SHA
   8b322a4160b827be202beedaf35ce21b4c635603. LLVM is at tag llvmorg-23.1.3, ONNX Runtime at
   `releases/tag/v1.17.0`, and the two new QEMU records at tag v11.1.2. The `Link` to the
   guide uses the pinned tree URL. pinned-refs gate exit 0.

## Fixes applied

- `src/sections/GravitonDeepDive.tsx:268`: "Graviton5 (Neoverse V3) was announced" became
  "Graviton5 (Neoverse V3`<Cite gravitonReadme/>`) was announced".
- `src/sections/GravitonDeepDive.tsx:124-125`: "375 KB", note "36 MB / 96 cores." became
  "0.375 MB", note "36 MB / 96 cores = 0.375 MB.".
- `src/sections/GravitonDeepDive.tsx:346-347`: "about 375 KB per core" became "0.375 MB per
  core" (same note change).
- `src/components/GravitonComparison.tsx:75`: "375 KB per core" became "0.375 MB per core".
- `src/sections/GravitonDeepDive.tsx:188`: "about 138 ns across sockets" became "138.6 ns
  across sockets on average".
- `src/sections/GravitonDeepDive.tsx:525-526`: "measured about 138 ns" became "measured
  138.6 ns on average".
- `src/sections/GravitonDeepDive.tsx:407-410`: added `<Cite s={S.qemuInt8Mmla} note=...>`
  after the LLVM cite for the 2x8 by 8x2 shape.
- `src/sections/GravitonDeepDive.tsx:411-418`: rewrote the BFMMLA sentence.
  - Before: "FEAT_BF16 adds BFMMLA, the same operation on BF16 (bfloat16) inputs with FP32
    accumulators", with LLVM note "BFMMLA is defined under HasBF16 and writes v4f32 from two
    v8bf16 operands."
  - After: "FEAT_BF16 adds BFMMLA, which multiplies a 2x4 BF16 (bfloat16) matrix by a 4x2
    one into a 2x2 block of FP32 accumulators in the same 128-bit register", with LLVM note
    "BFMMLA is defined under HasBF16." plus the qemuBfmmla cite.
- `src/sources/GravitonDeepDive.ts:78-91`: new records `qemuInt8Mmla` (L2771-L2834) and
  `qemuBfmmla` (L3045-L3119). Both are Tier 1 pinned code, accessed 2026-10-23. The header
  comment notes why they exist.

## Checks

- `pnpm exec tsc --noEmit | grep ...`: "no type errors in my files".
- `pnpm exec eslint` on the three files, `--max-warnings 0`: exit 0.
- `pnpm exec vitest run src/__tests__/sections.test.tsx -t GravitonDeepDive`: 1 passed, 34
  skipped.
- Gates from the worktree root: no-ai-tells exit=0, svg-a11y exit=0, pinned-refs exit=0,
  pre-overflow exit=0. No hits in my files.
- `pnpm exec vite build --outDir /tmp/vf-GravitonDeepDive-dist --emptyOutDir`: exit 0.
- `node scripts/shoot.mjs --sections graviton --widths 1440,390 ...`: "graviton @1440: 1 SVG
  diagram(s), 0 React Flow, ok"; "graviton @390: ... ok". I read the PNGs:
  - At 1440, "0.375 MB per core" sits inside the LLC box with padding, and nothing
    overlaps.
  - At 390, the SVG scrolls inside its wrapper and the labels stay legible.
  - On the full page, the new Cite badges in the intro and the matrix paragraph wrap
    cleanly.

## For the orchestrator

- `src/sections/ChipletAndInterconnect.tsx:94`: "about 138 ns across sockets". Chips and
  Cheese says "138.6 ns on average", which rounds to 139. This page now says 138.6 ns. Make
  Chiplet say 138.6 (or about 139).
- `src/sections/ChipletAndInterconnect.tsx:104`: the row label "AWS Graviton5 (Neoverse V3)"
  sits next to a cite to About Amazon, which does not name Neoverse V3. The README at
  8b322a4 (already a record in that file) does, if a cite is wanted.
- Framing difference, no change needed: Chiplet's prose scopes the two nodes to "16xlarge and
  48xlarge". This page describes the package as two nodes, then gives nodes per size. The
  facts agree.
- Regenerate `sources.md`: two new records, `qemuInt8Mmla` and `qemuBfmmla`. QEMU is a new
  publisher.
- Glossary: no new acronyms. FP32 now appears with BFMMLA, but it was already in the
  section.

## Backlog

- Economy: the 57%/21% derivation is restated in five blocks (intro, table, NUMA alert, SLM
  alert, placement bullet). Cutting the SLM alert's restatement ("The 57% is a package
  figure ... 21% less than Graviton4") would save about 30 words. This is a style cut, not a
  correction.
- "Fits Graviton5 well" has three generic, unsourced bullets: KV-cache management, tokenizer
  fleets and embedding servers; microservices with locality-friendly data structures; and
  workloads sensitive to inter-core latency. The intro's "increasingly, the host side of
  inference" is also unsourced. Source them or cut them in the next iteration.
- Acronyms: CMN first appears in the spec table ("CMN-700 mesh") before its expansion in the
  NUMA prose. GEMM and SGEMM are never expanded.
- Graviton4 metal-48xl NUMA count: give it the same "not listed in AWS's table" scope that
  Graviton5 metal-48xl gets, or confirm it on hardware with `numactl --hardware`.
