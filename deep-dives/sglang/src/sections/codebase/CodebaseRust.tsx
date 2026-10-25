import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';
import { Cite, sglangUrl, sglangTreeUrl } from '../../components/Cite';

const GW = 'sgl-model-gateway';
const MAIN = `${GW}/src/main.rs`;
const SERVER = `${GW}/src/server.rs`;
const HTTP_ROUTER = `${GW}/src/routers/http/router.rs`;
const PD_ROUTER = `${GW}/src/routers/http/pd_router.rs`;
const POL = `${GW}/src/policies`;
const CA = `${POL}/cache_aware.rs`;
const TREE = `${POL}/tree.rs`;
const WORKER = `${GW}/src/core/worker.rs`;
const PYBIND = `${GW}/bindings/python/src/sglang_router`;
const RARGS = `${PYBIND}/router_args.py`;
const LAUNCH_ROUTER = `${PYBIND}/launch_router.py`;
const SRT = 'python/sglang/srt';
const SCHED = `${SRT}/managers/scheduler.py`;
const ENGINE = `${SRT}/entrypoints/engine.py`;
const RECEIVER = `${SRT}/managers/scheduler_components/request_receiver.py`;
const RUST_PY = `${SRT}/rust_server/server.py`;
const PD_HOOK = `${SRT}/arg_groups/pd_disaggregation_hook.py`;
const RS = 'rust/sglang-server/src';
const RS_HTTP = `${RS}/api_server/http`;
const VLLM_RUST_FRONTEND =
  'https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/envs.py#L1441-L1443';
const VLLM_ROUTER_FORK = 'https://github.com/vllm-project/router/blob/v0.1.16/README.md#L339';
const VLLM_RUST_TEXT =
  'https://github.com/vllm-project/vllm/blob/v0.31.0/rust/src/text/src/lib.rs#L4-L8';
const VLLM_RUST_README = 'https://github.com/vllm-project/vllm/blob/v0.31.0/rust/README.md#L3';

const ROUTER_DEFAULTS = `python -c "from sglang_router.router_args import RouterArgs as A; print(A.policy, A.cache_threshold, A.balance_abs_threshold, A.balance_rel_threshold, A.eviction_interval_secs, A.max_tree_size)"`;

const RUST_PROBE = `SGLANG_RUST_SERVER=1 sglang serve --model-path <model>
# in the log: SGLANG_RUST_SERVER enabled, Rust server listen on 127.0.0.1:30000
curl -s -o /dev/null -w '%{http_code}\\n' http://127.0.0.1:30000/health
curl -s -o /dev/null -w '%{http_code}\\n' http://127.0.0.1:30000/metrics`;

export function CodebaseRust() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h2"
            description="Know which file makes the gateway's routing decision and which one answers HTTP when the Rust frontend is on, before you tune or expose either"
          >
            What this path explains
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The gateway decides each request from two things it keeps itself: an approximate tree
            of the prompt text it has already sent to each worker, and its own count of the
            requests it has open on each one. It never asks a worker what it cached. The balance
            check comes first: when the busiest worker has more than 64 requests over the idlest
            and more than 1.5 times its load, the request goes to the least-loaded worker. Otherwise a match
            over <strong>30% of the prompt</strong> sends it to the worker that received that
            prefix, and anything weaker goes to the least-loaded worker{' '}
            <Cite tier={1} href={sglangUrl(CA, 'L404-L471')}>
              cache_aware.rs L404-L471
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(MAIN, 'L150-L171')}>
              main.rs L150-L171
            </Cite>
            .
          </Box>
          <Box variant="p">
            The Rust frontend works one level down, inside a single SGLang server. With{' '}
            <code>SGLANG_RUST_SERVER=1</code>, a Rust extension inside a scheduler process takes over
            the HTTP API, tokenization and detokenization. It runs in the first scheduler of each
            attention DP (data parallelism) group, which is TP (tensor parallelism) rank 0 when
            attention DP is off. Its native API serves <code>/generate</code>, <code>/health</code>{' '}
            and <code>/health_generate</code>.
            Section 17 (The Model Gateway) and section 3 (The SGLang Runtime) explain both; this
            tab gives the files in the order a request meets them. Gateway paths are relative to{' '}
            <Cite tier={1} href={sglangTreeUrl(GW)}>
              sgl-model-gateway/
            </Cite>{' '}
            and the frontend crate lives under{' '}
            <Cite tier={1} href={sglangTreeUrl('rust/sglang-server')}>
              rust/sglang-server/
            </Cite>
            ; <code>rust/sglang-radix-tree/</code>, the radix cache&apos;s core, is in the Radix
            Cache &amp; Memory Pools tab.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Trace a request from the gateway's route table to the worker it picks, and read each default where the code sets it"
          >
            Stops 1 to 6: the gateway&apos;s routing decision
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ol>
            <li>
              <strong>
                <code>Cargo.toml</code>
              </strong>{' '}
              <Cite tier={1} href={sglangUrl(`${GW}/Cargo.toml`, 'L5-L34')}>
                Cargo.toml L5-L34
              </Cite>
              . Owns the build: the crate <code>sgl-model-gateway</code>, version 0.3.2, library
              name <code>smg</code>, and three binaries, <code>sgl-model-gateway</code>,{' '}
              <code>smg</code> and <code>amg</code>, built from the same <code>src/main.rs</code>.
              Section 17 covers which installed build matches this tag.
            </li>
            <li>
              <strong>
                <code>src/main.rs</code> and <code>bindings/python/src/sglang_router/router_args.py</code>
              </strong>{' '}
              <Cite tier={1} href={sglangUrl(MAIN, 'L133-L171')}>
                main.rs L133-L171
              </Cite>
              . Owns the defaults. The binary binds 0.0.0.0:30000, defaults <code>--policy</code> to{' '}
              <code>cache_aware</code> and accepts six policy names; <code>--cache-threshold</code>{' '}
              is 0.3, <code>--balance-abs-threshold</code> 64, <code>--balance-rel-threshold</code>{' '}
              1.5, <code>--eviction-interval</code> 120 seconds and <code>--max-tree-size</code>{' '}
              67,108,864. The Python launcher&apos;s <code>RouterArgs</code> repeats those values
              except <code>eviction_interval_secs</code>, which is 60, and accepts eight policy
              names; the comment above its list records the gap with the binary{' '}
              <Cite tier={1} href={sglangUrl(RARGS, 'L20-L63')}>
                router_args.py L20-L63
              </Cite>
              .
            </li>
            <li>
              <strong>
                <code>src/server.rs</code>
              </strong>{' '}
              <Cite tier={1} href={sglangUrl(SERVER, 'L580-L605')}>
                server.rs L580-L605
              </Cite>
              . Owns the route table and which group each route&apos;s key check covers. The
              inference routes carry the concurrency limit and the key check as route layers; the
              admin and worker-management routes get the control-plane check when one is
              configured and the same key check otherwise{' '}
              <Cite tier={1} href={sglangUrl(SERVER, 'L607-L655')}>
                server.rs L607-L655
              </Cite>
              . The public group has no key check: <code>/liveness</code>, <code>/readiness</code>,{' '}
              <code>/health</code>, <code>/health_generate</code>, <code>/engine_metrics</code>,{' '}
              <code>/v1/models</code>, <code>/model_info</code>, <code>/server_info</code> and the{' '}
              <code>get_</code> aliases of the last two. Read from code, not run. Section 17 (The
              Model Gateway) says which of them to block in front of the gateway, and section 12
              (APIs, LoRA &amp; the Admin Plane) explains why.
            </li>
            <li>
              <strong>
                <code>src/routers/http/router.rs</code>
              </strong>{' '}
              <Cite tier={1} href={sglangUrl(HTTP_ROUTER, 'L133-L185')}>
                router.rs L133-L185
              </Cite>
              . Owns the meeting of a request and a policy. <code>select_worker_for_model</code>{' '}
              keeps the available workers, takes the policy for the model and passes it the request
              text with <code>tokens: None</code>, because the HTTP router never tokenizes; that is
              why <code>prefix_hash</code> needs gRPC workers (section 17). With no worker left the
              client gets 503 <code>no_available_workers</code>, and only <code>cache_aware</code>{' '}
              and <code>manual</code> take a load guard on the chosen worker{' '}
              <Cite tier={1} href={sglangUrl(HTTP_ROUTER, 'L282-L302')}>
                router.rs L282-L302
              </Cite>
              .
            </li>
            <li>
              <strong>
                <code>src/policies/cache_aware.rs</code>
              </strong>{' '}
              <Cite tier={1} href={sglangUrl(CA, 'L386-L526')}>
                cache_aware.rs L386-L526
              </Cite>
              . Owns the decision. One tree per worker pool and model, keyed{' '}
              <code>pool::model</code> with pools <code>regular</code>, <code>prefill</code> and{' '}
              <code>decode</code>, so PD (prefill/decode) disaggregation roles never overwrite each other&apos;s entries{' '}
              <Cite tier={1} href={sglangUrl(CA, 'L76-L101')}>
                cache_aware.rs L76-L101
              </Cite>
              . <code>select_worker</code> reads every worker&apos;s load, tests both balance
              thresholds (L404-L413), and on imbalance calls <code>select_worker_min_load</code>,
              which still records the prompt under the worker it picks{' '}
              <Cite tier={1} href={sglangUrl(CA, 'L310-L382')}>
                cache_aware.rs L310-L382
              </Cite>
              . Balanced, it computes matched characters over input characters (L436-L441), sends a
              rate above <code>cache_threshold</code> to the matched worker, sends the rest to the
              least-loaded worker with a random tie break, and inserts the prompt under the choice
              (L444-L471). The design comment at the top of the file says the low-match case goes
              to the worker with the smallest tree{' '}
              <Cite tier={1} href={sglangUrl(CA, 'L25-L33')} kind="doc-code-conflict">
                cache_aware.rs L25-L33
              </Cite>
              ; the code at L451-L466 picks the least-loaded worker, so trust the code.
            </li>
            <li>
              <strong>
                <code>src/policies/tree.rs</code> and <code>src/core/worker.rs</code>
              </strong>{' '}
              <Cite tier={1} href={sglangUrl(TREE, 'L531-L619')}>
                tree.rs L531-L619
              </Cite>
              . Owns the two inputs. <code>prefix_match_with_counts</code> walks the tree by
              character and returns the deepest matched node&apos;s worker with the matched and
              input character counts; no tokenizer is involved.{' '}
              <code>evict_tenant_by_size</code> removes a worker&apos;s least recently used leaves
              while its character count is over <code>--max-tree-size</code>, at each eviction
              interval{' '}
              <Cite tier={1} href={sglangUrl(TREE, 'L718-L821')}>
                tree.rs L718-L821
              </Cite>
              . Load is an atomic counter on the worker{' '}
              <Cite tier={1} href={sglangUrl(WORKER, 'L784-L786')}>
                worker.rs L784-L786
              </Cite>
              , raised by <code>WorkerLoadGuard</code> at dispatch and lowered when the response
              body ends{' '}
              <Cite tier={1} href={sglangUrl(WORKER, 'L1141-L1168')}>
                worker.rs L1141-L1168
              </Cite>
              : this gateway&apos;s open requests, nothing the worker reports.
            </li>
          </ol>
          <ExpandableSection headerText="The PD pair, and policies built from a worker's hint">
            <SpaceBetween size="s">
              <Box variant="p">
                In PD mode <code>select_pd_pair</code> picks the prefill worker with the prefill
                policy and then the decode worker with the decode policy, each from its own pool{' '}
                <Cite tier={1} href={sglangUrl(PD_ROUTER, 'L976-L1035')}>
                  pd_router.rs L976-L1035
                </Cite>
                ; the Parallelism, MoE &amp; PD tab follows the request from there, starting at
                the room id.
              </Box>
              <Box variant="p">
                A worker registered with the label <code>policy=cache_aware</code>{' '}
                <Cite tier={1} href={sglangUrl(`${GW}/src/core/steps/worker/shared/update_policies.rs`, 'L102-L113')}>
                  update_policies.rs L102-L113
                </Cite>{' '}
                gives its model a policy built with <code>CacheAwarePolicy::new()</code>{' '}
                <Cite tier={1} href={sglangUrl(`${POL}/registry.rs`, 'L169-L198')} kind="code">
                  registry.rs L169-L198
                </Cite>
                , whose built-in defaults are a 0.5 threshold, 32 and 1.1 for balance, 30-second
                eviction and 10,000 characters{' '}
                <Cite tier={1} href={sglangUrl(`${POL}/mod.rs`, 'L106-L116')}>
                  mod.rs L106-L116
                </Cite>
                . Read from source, not run: that path, used for per-model policies, ignores the
                command-line thresholds.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="See what replaces the Python HTTP server when SGLANG_RUST_SERVER=1, which process hosts it, and which routes exist in that mode"
          >
            Stops 7 to 11: what the Rust frontend serves
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ol start={7}>
            <li>
              <strong>
                <code>python/sglang/srt/environ.py</code> and{' '}
                <code>python/sglang/srt/entrypoints/engine.py</code>
              </strong>{' '}
              <Cite tier={1} href={sglangUrl(`${SRT}/environ.py`, 'L1902')}>
                environ.py L1902
              </Cite>
              . Owns the switch: <code>SGLANG_RUST_SERVER</code> defaults to off. When it is on,
              the engine waits for the schedulers and starts no Python TokenizerManager and no
              detokenizer process{' '}
              <Cite tier={1} href={sglangUrl(ENGINE, 'L1292-L1313')}>
                engine.py L1292-L1313
              </Cite>
              .
            </li>
            <li>
              <strong>
                <code>python/sglang/srt/managers/scheduler.py</code>
              </strong>{' '}
              <Cite tier={1} href={sglangUrl(SCHED, 'L2331-L2360')}>
                scheduler.py L2331-L2360
              </Cite>
              . Owns the host process. <code>_hosts_rust_server</code> is true on the scheduler at
              PP (pipeline parallelism) rank 0, attention TP rank 0 and attention CP (context
              parallelism) rank 0, the first rank of each attention DP group, and <code>maybe_init_rust_server</code>{' '}
              launches the server there and makes it the scheduler&apos;s request source. The
              request receiver then drains an in-process ring in place of the ZMQ (ZeroMQ) socket{' '}
              <Cite tier={1} href={sglangUrl(RECEIVER, 'L117-L124')}>
                request_receiver.py L117-L124
              </Cite>
              .
            </li>
            <li>
              <strong>
                <code>python/sglang/srt/rust_server/server.py</code>
              </strong>{' '}
              <Cite tier={1} href={sglangUrl(RUST_PY, 'L124-L216')}>
                rust_server/server.py L124-L216
              </Cite>
              . Owns the launch. <code>RustServer.launch</code> listens on <code>--port</code> plus
              the DP group&apos;s index on the node, refuses a multimodal model with no Rust
              pipeline before it binds, and logs{' '}
              <code>SGLANG_RUST_SERVER enabled, Rust server listen on HOST:PORT</code>, with{' '}
              <code>(DP rank i/n)</code> appended under DP.
            </li>
            <li>
              <strong>
                <code>rust/sglang-server/src/lib.rs</code> and <code>utils/runtime.rs</code>
              </strong>{' '}
              <Cite tier={1} href={sglangUrl(`${RS}/lib.rs`, 'L1-L12')}>
                lib.rs L1-L12
              </Cite>
              . Owns the boundary with Python. The crate is an HTTP server, a TokenizerManager and
              tokenizer and detokenizer workers, all inside the scheduler process; the runtime
              starts one async runtime for the API, pools of tokenizer and detokenizer threads, and
              one thread each way to the scheduler{' '}
              <Cite tier={1} href={sglangUrl(`${RS}/utils/runtime.rs`, 'L1-L15')}>
                runtime.rs L1-L15
              </Cite>
              . The constructor Python calls, <code>Server::start</code>, passes no HTTP layer, so nothing wraps the router that stop 11 builds{' '}
              <Cite tier={1} href={sglangUrl(`${RS}/lib.rs`, 'L182-L199')} kind="code">
                lib.rs L182-L199
              </Cite>
              .
            </li>
            <li>
              <strong>
                <code>rust/sglang-server/src/api_server/http/app.rs</code>
              </strong>{' '}
              <Cite tier={1} href={sglangUrl(`${RS_HTTP}/app.rs`, 'L57-L104')}>
                app.rs L57-L104
              </Cite>
              . Owns the routes. <code>serve</code> merges three route modules:
              <ul>
                <li>
                  the native API, <code>/generate</code> plus <code>/health</code> and{' '}
                  <code>/health_generate</code>{' '}
                  <Cite tier={1} href={sglangUrl(`${RS_HTTP}/native_api.rs`, 'L77-L114')}>
                    native_api.rs L77-L114
                  </Cite>
                  ;
                </li>
                <li>
                  the info routes, <code>/server_info</code>, <code>/get_model_info</code> and{' '}
                  <code>/model_info</code>{' '}
                  <Cite tier={1} href={sglangUrl(`${RS_HTTP}/info.rs`, 'L22-L32')}>
                    info.rs L22-L32
                  </Cite>
                  ;
                </li>
                <li>
                  the OpenAI-style routes, <code>/v1/models</code>, <code>/v1/models/{'{model}'}</code>,{' '}
                  <code>/v1/completions</code> and <code>/v1/chat/completions</code>{' '}
                  <Cite tier={1} href={sglangUrl(`${RS_HTTP}/openai.rs`, 'L32-L38')}>
                    openai.rs L32-L38
                  </Cite>{' '}
                  <Cite tier={1} href={sglangUrl(`${RS_HTTP}/openai/models.rs`, 'L16-L17')}>
                    openai/models.rs L16-L17
                  </Cite>
                  .
                </li>
              </ul>
              Health answers 503 until the startup warm-up succeeds{' '}
              <Cite tier={1} href={sglangUrl(`${RS_HTTP}/app.rs`, 'L31-L55')}>
                app.rs L31-L55
              </Cite>
              . A search of the <code>rust/</code> tree finds no <code>/metrics</code>,{' '}
              <code>/ping</code> or <code>/invocations</code> route, which is why section 19 (SGLang
              on SageMaker AI &amp; HyperPod) keeps the variable unset on SageMaker. On a PD prefill
              server the bootstrap registry for the KV (key-value) cache transfer is mounted on this
              same listener{' '}
              <Cite tier={1} href={sglangUrl(`${RS_HTTP}/app.rs`, 'L95-L104')}>
                app.rs L95-L104
              </Cite>
              .
            </li>
          </ol>
          <Box variant="p">
            The router is assembled with no authentication layer, and a comment in{' '}
            <code>serve</code> says a configured <code>api_key</code> does not protect these routes{' '}
            <Cite tier={1} href={sglangUrl(`${RS_HTTP}/app.rs`, 'L83-L93')} kind="code">
              app.rs L83-L93
            </Cite>
            . Read from code, not run. Section 3 (The SGLang Runtime) and section 12 (APIs, LoRA
            &amp; the Admin Plane) give the consequence for keys; a deployment that relies on a key keeps the
            Python frontend or authenticates at the gateway.
          </Box>
          <ExpandableSection headerText="PD with the Rust frontend: the registry moves to the API port">
            <Box variant="p">
              On a prefill server in Rust mode the resolver sets{' '}
              <code>disaggregation_bootstrap_port</code> to <code>--port</code>, logs{' '}
              <code>KV bootstrap registry is served on the api port</code>, and refuses an explicit{' '}
              <code>--disaggregation-bootstrap-port</code> that differs from both the default and{' '}
              <code>--port</code>; decode servers and the gateway then target the prefill API
              port{' '}
              <Cite tier={1} href={sglangUrl(PD_HOOK, 'L251-L286')}>
                pd_disaggregation_hook.py L251-L286
              </Cite>{' '}
              <Cite tier={1} href={sglangUrl(PD_HOOK, 'L157-L158')}>
                pd_disaggregation_hook.py L157-L158
              </Cite>
              . The opt-in <code>prefill_complete</code> allocation policy refuses this registry{' '}
              <Cite tier={1} href={sglangUrl(PD_HOOK, 'L242-L248')}>
                pd_disaggregation_hook.py L242-L248
              </Cite>
              .
            </Box>
          </ExpandableSection>
          <Box variant="p">
            <strong>Against vLLM:</strong> vLLM&apos;s off-by-default Rust frontend,{' '}
            <code>VLLM_USE_RUST_FRONTEND=1</code>, takes the place of its API server process{' '}
            <Cite tier={1} href={VLLM_RUST_FRONTEND}>
              vLLM envs.py L1441-L1443 (v0.31.0)
            </Cite>
            , tokenization and detokenization included{' '}
            <Cite tier={1} href={VLLM_RUST_TEXT}>
              vLLM rust/src/text/src/lib.rs L4-L8 (v0.31.0)
            </Cite>
            , and still reaches the engine over ZMQ{' '}
            <Cite tier={1} href={VLLM_RUST_README}>
              vLLM rust/README.md L3 (v0.31.0)
            </Cite>
            ; SGLang&apos;s runs inside the GPU process itself. On the routing side, <code>vllm-project/router</code> is a fork of this
            gateway{' '}
            <Cite tier={1} href={VLLM_ROUTER_FORK}>
              vllm-project/router v0.1.16 README L339
            </Cite>{' '}
            (<Link href="../vllm/">vLLM dive, section 14: Inside the Codebase</Link>, The Rust
            Frontend tab;{' '}
            <Link href="../vllm/">vLLM dive, section 16: Kubernetes: Production-Stack &amp; Router</Link>
            ).
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Confirm the routing thresholds your gateway build runs with, and the routes a Rust-mode server answers, before you send it traffic"
          >
            The checks: the policy defaults and the native routes
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Policy defaults.</strong> The Python launcher takes its routing-policy defaults
            from the <code>RouterArgs</code> dataclass{' '}
            <Cite tier={1} href={sglangUrl(RARGS, 'L54-L63')}>
              router_args.py L54-L63
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(RARGS, 'L283-L339')}>
              router_args.py L283-L339
            </Cite>
            , though not every default: its parser binds <code>--prometheus-host</code> to{' '}
            <code>0.0.0.0</code> where the dataclass holds <code>None</code>{' '}
            <Cite tier={1} href={sglangUrl(RARGS, 'L85')}>
              router_args.py L85
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(RARGS, 'L486-L490')}>
              router_args.py L486-L490
            </Cite>
            . <code>python -m sglang_router.launch_router --help</code> prints the parser&apos;s
            defaults, because it uses <code>ArgumentDefaultsHelpFormatter</code>{' '}
            <Cite tier={1} href={sglangUrl(LAUNCH_ROUTER, 'L55-L60')}>
              launch_router.py L55-L60
            </Cite>
            . Print the six that drive stop 5 from the image or wheel you deploy:
          </Box>
          <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{ROUTER_DEFAULTS}</pre>
          <Box variant="p">
            By our reading of the v0.5.22 source, not run, a build from the tag prints{' '}
            <code>cache_aware 0.3 64 1.5 60 67108864</code>. Those are the values of the decision
            in stop 5: a fleet more than 64 requests and 1.5 times out of balance routes by load,
            and a balanced one routes by prefix only above 30% of the prompt. The standalone binary carries the same thresholds with a
            120-second <code>--eviction-interval</code>{' '}
            <Cite tier={1} href={sglangUrl(MAIN, 'L150-L171')}>
              main.rs L150-L171
            </Cite>
            . Other values mean another build; section 17 lists the builds that share the name.
          </Box>
          <Box variant="p">
            <strong>Native routes.</strong> Start a server in Rust mode and probe two paths:
          </Box>
          <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{RUST_PROBE}</pre>
          <Box variant="p">
            Expect 503 from <code>/health</code> during warm-up and 200 after, and 404 from{' '}
            <code>/metrics</code>, which has no route in this mode; the native API is{' '}
            <code>/generate</code>, <code>/health</code> and <code>/health_generate</code> (stop
            11). The log line and status codes above come from our reading of the code, not from a
            running server. If the log line is missing, the Python frontend is serving and the
            variable did not reach the scheduler process.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
