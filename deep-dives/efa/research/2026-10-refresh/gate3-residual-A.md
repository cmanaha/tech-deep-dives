# Gate 3 residual fixes, group A (mechanism sections)

Input: gate3-rescore-A.md ("Regressions introduced by eb39b7e" and "Remaining corrections"). Backlog items not applied.
Files: DataPath.tsx, SrdProtocol.tsx, EfaDevice.tsx, Libfabric.tsx, EnaVsEfa.tsx. Nothing committed.

## Items

- DataPath, regression 1 (two gates "properties of the host"): applied as given.
- DataPath, remaining 1 (UARN doorbell sentence as inference): applied as given.
- DataPath, remaining 2 (uncited inline-payload claim): applied as given; the Step 4 sentence deleted and the LLQ column now reads "the descriptor is pushed to the device by MMIO". No SVG text touched.
- SrdProtocol, regression 1 (MTU unexpanded at first use): applied as given, inside regression 2's sentence ("the MTU (Maximum Transmission Unit) it needs"); grep confirms this is the only MTU in the section.
- SrdProtocol, regression 2 (cross-reference "how to enable it"): applied as given ("covers where it is switched on, ...").
- SrdProtocol, regression 3 (5 to 25 Gbps figure removed): applied as given, cited to the existing docs.enaExpress entry (same citation the pre-eb39b7e text used for this figure).
- SrdProtocol, remaining 1 (queue-pair Alert body duplicates its header): applied as given.
- SrdProtocol, remaining 2 (uncited "the card is what performs it" and "never blocks"): applied as given; first cited to the existing docs.storageBlog entry, second scoped as our reading.
- EfaDevice, remaining 1 (uncited "hang at the first collective"): applied as given; target checked, SrdProtocol decodes "Unreachable remote - never received a response" and its help text names security group rules first.
- EfaDevice, remaining 2 (uncited hugepages table cell): applied as given ("Our reading: ...").
- Libfabric, regression 1 (HIGH_PPS clause wider than its citation): applied as given; "the 2.7.0 reader drops it" now carries code.envUnregistered (existing registry entry, pinned v2.7.0 efa_env.c L49-L66). The stronger tree-wide form was not kept.
- Libfabric, remaining 1 (dangling "it" in the channel Alert): applied as given.
- Libfabric, remaining 2 (h2 description promising which fabric the job runs on): applied as given; traces to the efa / efa-direct paragraph under the diagram.
- Libfabric, remaining 3 (uncited "several hundred settings" in the h1 description): applied as given.
- EnaVsEfa, regression 1 (ladder note "Both AWS pages cover one Availability Zone"): applied as given. Table cell text, not SVG.
- EnaVsEfa, remaining 1 (universal absence "stated nowhere"): applied as given.
- EnaVsEfa, remaining 2 (unscoped "amzn-drivers carries no driver-level link aggregation"): applied as given.
- EnaVsEfa, remaining 3 (uncited "best of the three" / "lowest of the three"): applied as given ("on our reading"). Observation, not changed (outside the item list): the column header Badge "lowest latency" above it still states the latency position without scope; candidate for the orchestrator or backlog.
- EnaVsEfa, remaining 4 (ladder footer cannot bear the ENA Express row): applied as given; docs.enaExpress already in the section registry.

## Totals

19 of 19 applied as given (6 regressions, 13 remaining corrections). 0 applied narrower, 0 skipped. Backlog items not applied.

## Fetches

None. Every restored number or added citation uses an entry already in the section's registry (SrdProtocol docs.enaExpress and docs.storageBlog; Libfabric code.envUnregistered, pinned v2.7.0; EnaVsEfa docs.enaExpress).

## SVG text changed

None. Diagram geometry untouched. The EnaVsEfa ladder note is a Cloudscape table cell, not SVG.

## Checks (foreground, repo root)

- pnpm --filter @tech-deep-dives/efa typecheck: pass.
- pnpm --filter @tech-deep-dives/efa lint: pass (max-warnings 0).
- scripts/gates/no-ai-tells.sh, svg-a11y.sh, pinned-refs.sh, pre-overflow.sh: all PASS.
- Added lines grepped for em-dash, en-dash, curly quotes and entity forms: none.

STATUS: COMPLETE
