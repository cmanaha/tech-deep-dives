# Experiment: does `vllm serve` accept `--kv-cache-memory`? (2026-10-17)

Tier 0 (our own run). Supports the PagedAttentionKV statement that the docs spelling
`--kv-cache-memory` (docs/configuration/optimization.md) works although the flag is defined as
`--kv-cache-memory-bytes` (`vllm/engine/arg_utils.py` L1332 at v0.31.0).

## Inputs

- vLLM tree: tag `v0.31.0`, commit `db9527a46873454610df6dbedf79a36d6bf1a7f6` (`/tmp/vllm-new`).
- Parser under test: the real `FlexibleArgumentParser` class, loaded from
  `vllm/utils/argparse_utils.py` with its heavy imports stubbed (stubs for `regex`, `yaml` and the
  `vllm` package helpers the module imports at load time).
- Script: `kv-cache-memory-abbrev.py` (this directory). It builds a `serve` subparser with the
  CacheConfig flags that share the `--kv-cache-` prefix and parses four argument vectors.
- Uniqueness check: `grep -rhoE '"--kv-cache-memory[a-z-]*"' vllm | sort | uniq -c` returns exactly
  one flag, `--kv-cache-memory-bytes`, so an abbreviation cannot be ambiguous inside the vLLM tree.
  (A plugin that registers another flag with that prefix would make it ambiguous; none is in-tree.)

## Command

```bash
python3 -I kv-cache-memory-abbrev.py <stubs-dir> /tmp/vllm-new/vllm/utils/argparse_utils.py
```

## Output

```
allow_abbrev on serve parser: True
['serve', 'm', '--kv-cache-memory=8G'] -> 8589934592
['serve', 'm', '--kv-cache-memory', '8589934592'] -> 8589934592
['serve', 'm', '--kv_cache_memory=8G'] -> 8589934592
['serve', 'm', '--kv-cache-memory-bytes=8G'] -> 8589934592
```

## Result

`FlexibleArgumentParser` keeps argparse's `allow_abbrev=True`, so `--kv-cache-memory` resolves to
`--kv-cache-memory-bytes` by unique prefix (underscores are normalised to dashes as well). The docs
spelling works; it is an abbreviation, not a separate flag. Limits: this exercised the parser
class, not a full `vllm serve` start, and it rebuilt only the cache flag group rather than the
whole `serve` parser.
