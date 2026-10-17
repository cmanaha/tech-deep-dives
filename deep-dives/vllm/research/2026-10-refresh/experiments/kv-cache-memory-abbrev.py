import importlib.util, sys
sys.path.insert(0, sys.argv[1])  # stubs dir
spec = importlib.util.spec_from_file_location("argparse_utils", sys.argv[2])
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)
P = mod.FlexibleArgumentParser
root = P(description="vLLM CLI")
subs = root.add_subparsers(required=False, dest="subparser")
serve = subs.add_parser("serve")
g = serve.add_argument_group("CacheConfig")
g.add_argument("--block-size", type=int)
g.add_argument("--gpu-memory-utilization", "--device-memory-utilization", dest="gpu_memory_utilization", type=float)
g.add_argument("--kv-cache-memory-bytes", type=mod.human_readable_int)
g.add_argument("--kv-cache-dtype")
g.add_argument("--kv-cache-dtype-skip-layers")
g.add_argument("--kv-cache-metrics", action="store_true")
g.add_argument("--kv-cache-metrics-sample", type=float)
serve.add_argument("model_tag", nargs="?")
print("allow_abbrev on serve parser:", serve.allow_abbrev)
for argv in (["serve", "m", "--kv-cache-memory=8G"],
             ["serve", "m", "--kv-cache-memory", "8589934592"],
             ["serve", "m", "--kv_cache_memory=8G"],
             ["serve", "m", "--kv-cache-memory-bytes=8G"]):
    ns = root.parse_args(argv)
    print(argv, "->", ns.kv_cache_memory_bytes)
