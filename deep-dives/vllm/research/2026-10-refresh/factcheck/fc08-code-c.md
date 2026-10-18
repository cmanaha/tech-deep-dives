# fc08-code-c: fact-check of the codebase Distributed, Advanced and Rust tabs

Pin: vLLM v0.31.0, commit db9527a46873454610df6dbedf79a36d6bf1a7f6, read from `/tmp/vllm-new`
on 2026-10-18. Release notes from `/tmp/vllm-release-notes/`.

Files: `codebase/CodebaseDistributed.tsx`, `codebase/CodebaseAdvanced.tsx`,
`codebase/CodebaseRust.tsx` (all under `deep-dives/vllm/src/sections/`).

Status: in progress (draft written early so it survives an interruption).

## CodebaseRust.tsx

Confirmed so far: `VLLM_USE_RUST_FRONTEND` default 0 (`vllm/envs.py#L1441-L1449`);
`VLLM_RUST_FRONTEND_PATH` auto discovery and `FileNotFoundError` (`vllm/envs.py#L577-L609`);
16 workspace crates, edition 2024 (`rust/Cargo.toml#L1-L24`); toolchain channel 1.95; 340 `.rs`
files and 126,169 lines; every crate-graph edge is the transitive reduction of the
`[dependencies]` tables; build-info and tracing users; binary `vllm-rs` from `vllm-cmd`;
subcommands frontend, serve, bench serve, render (`rust/src/cmd/src/cli.rs#L90-L108`); Tokio cap
32 and mimalloc (`rust/src/cmd/src/main.rs#L17-L44`); `--data-parallel-size-local 0`
(`main.rs#L123-L139`).

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|

## CodebaseDistributed.tsx

Not yet checked.

## CodebaseAdvanced.tsx

Not yet checked.
