import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';
import { Cite, sglangUrl, sglangTreeUrl, sglangDocsSrcUrl } from '../components/Cite';

const SRT = 'python/sglang/srt';
const RC = `${SRT}/mem_cache/radix_cache.py`;
const POLICY = `${SRT}/managers/schedule_policy.py`;
const SCHEDULER = `${SRT}/managers/scheduler.py`;
const BATCH = `${SRT}/managers/schedule_batch.py`;
const SCHED_FIELDS = `${SRT}/arg_groups/fields/schedule.py`;
const SERVING = `${SRT}/arg_groups/fields/serving.py`;
const OVR = `${SRT}/arg_groups/overrides.py`;
const MOB = `${SRT}/arg_groups/model_override_base.py`;
const SPEC_HOOK = `${SRT}/arg_groups/speculative_hook.py`;
const PD_HOOK = `${SRT}/arg_groups/pd_disaggregation_hook.py`;
const AUTH = `${SRT}/utils/auth.py`;
const HTTP = `${SRT}/entrypoints/http_server.py`;
const PREFILL = `${SRT}/disaggregation/prefill.py`;
const MOONCAKE_TE = `${SRT}/distributed/device_communicators/mooncake_transfer_engine.py`;
const NIXL_CONN = `${SRT}/disaggregation/nixl/conn.py`;
const TREE_CORE = `${SRT}/mem_cache/unified_cache/unified_tree_core.py`;
const GW = 'sgl-model-gateway';

const VLLM_TAG = 'v0.31.0';
function vllmUrl(path: string, lines?: string): string {
  const base = `https://github.com/vllm-project/vllm/blob/${VLLM_TAG}/${path}`;
  return lines ? `${base}#${lines}` : base;
}

const RELEASE_0522 = 'https://github.com/sgl-project/sglang/releases/tag/v0.5.22';
const RELEASES = 'https://github.com/sgl-project/sglang/releases';
const VLLM_ROUTER_FORK = 'https://github.com/vllm-project/router/blob/v0.1.16/README.md#L339';
const AWS_DLC_EKS =
  'https://github.com/aws/deep-learning-containers/blob/23970abd5b8919ea3e1add74692a0d056b2fcbd9/docs/sglang/deployment/eks.md#L8-L55';

const V4_LINK = <Link href="../vllm/">vLLM dive, section 4: Scheduler &amp; Continuous Batching</Link>;
const V5_LINK = <Link href="../vllm/">vLLM dive, section 5: Paged KV Cache &amp; Block Tables</Link>;
const V6_LINK = <Link href="../vllm/">vLLM dive, section 6: Automatic Prefix Caching</Link>;
const V10_LINK = <Link href="../vllm/">vLLM dive, section 10: Disaggregated Prefill / Decode</Link>;
const V12_LINK = <Link href="../vllm/">vLLM dive, section 12: The OpenAI-Compatible Server</Link>;
const V16_LINK = (
  <Link href="../vllm/">vLLM dive, section 16: Kubernetes: Production-Stack &amp; Router</Link>
);

/**
 * The component map: what is organised around the prefix index, what runs beside it, and the one
 * place the two zones meet (the attention backend sets the page size, the tree's reuse unit).
 */
function ComponentMapDiagram() {
  const ink = '#16191f';
  const sub = '#5f6b7a';
  const blue = '#0972d3';
  const blueDark = '#065299';
  const blueTint = '#f2f8fd';
  const teal = '#1f7a70';
  const tealTint = '#e6f4f2';
  const panel = '#fafbfc';
  const divider = '#d1d5db';
  const font = 'sans-serif';

  const around = [
    { x: 32, y: 60, title: 'Hits and eviction (5)', lines: ['a hit copies slot indices;', 'idle leaves go when memory is short'] },
    { x: 334, y: 60, title: 'Admission (4)', lines: ['charges the part of the prompt', 'the tree did not cover'] },
    { x: 32, y: 312, title: 'Model Gateway (17)', lines: ['routes by the prompt text', 'it already sent each worker'] },
    { x: 334, y: 312, title: 'HiCache (7, opt-in)', lines: ['an evicted node with a host copy', 'stays in the tree, host-only'] },
  ];
  const beside = [
    { y: 60, title: 'Structured output (10)', lines: ['a CPU grammar writes a', 'vocabulary bitmask per token'] },
    { y: 186, title: 'Attention backends (8)', lines: ['pick the kernel by model', 'family, then GPU generation'] },
    { y: 312, title: 'Speculative decoding (11)', lines: ['draft, then verify once;', 'off unless you turn it on'] },
  ];
  const boxW = 266;
  const boxH = 80;

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 900 420"
        role="img"
        aria-labelledby="thesis-map-title"
        style={{ width: '100%', minWidth: 640, height: 'auto' }}
      >
        <title id="thesis-map-title">
          The components of SGLang in two zones. Around the prefix index, a radix tree over the KV
          cache, sit cache hits and eviction, admission, the Model Gateway and HiCache, and each of
          them works from what the tree holds. Beside it sit structured output, speculative decoding
          and the attention backends. The two zones meet in one place: the attention backend sets the
          page size, which is the reuse unit of the tree.
        </title>
        <defs>
          <marker
            id="thesis-map-arrow"
            viewBox="0 0 10 10"
            refX={9}
            refY={5}
            markerWidth={8}
            markerHeight={8}
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill={sub} />
          </marker>
        </defs>

        <rect x={0} y={0} width={900} height={420} rx={8} fill="#ffffff" />

        {/* Zone 1: organised around the index */}
        <rect x={16} y={16} width={600} height={388} rx={8} fill={panel} stroke={divider} strokeWidth={1.2} />
        <text x={32} y={42} fill={blueDark} fontSize={14} fontWeight={700} fontFamily={font}>
          Organised around the index
        </text>

        {/* Zone 2: beside the index */}
        <rect x={632} y={16} width={252} height={388} rx={8} fill={panel} stroke={divider} strokeWidth={1.2} />
        <text x={648} y={42} fill={teal} fontSize={14} fontWeight={700} fontFamily={font}>
          Beside the index
        </text>

        {/* Links from the index to the four components around it */}
        <line x1={165} y1={140} x2={236} y2={186} stroke={blue} strokeWidth={1.5} />
        <line x1={467} y1={140} x2={396} y2={186} stroke={blue} strokeWidth={1.5} />
        <line x1={165} y1={312} x2={236} y2={270} stroke={blue} strokeWidth={1.5} />
        <line x1={467} y1={312} x2={396} y2={270} stroke={blue} strokeWidth={1.5} />

        {/* The index */}
        <rect x={176} y={186} width={280} height={84} rx={8} fill={blue} stroke={blueDark} strokeWidth={1.5} />
        <text x={316} y={214} textAnchor="middle" fill="#ffffff" fontSize={15} fontWeight={700} fontFamily={font}>
          The prefix index (5)
        </text>
        <text x={316} y={236} textAnchor="middle" fill="#ffffff" fontSize={12} fontFamily={font}>
          a radix tree of token runs
        </text>
        <text x={316} y={254} textAnchor="middle" fill="#ffffff" fontSize={12} fontFamily={font}>
          over the KV cache
        </text>

        {around.map((b) => (
          <g key={b.title}>
            <rect x={b.x} y={b.y} width={boxW} height={boxH} rx={6} fill={blueTint} stroke={blue} strokeWidth={1.2} />
            <text x={b.x + boxW / 2} y={b.y + 26} textAnchor="middle" fill={ink} fontSize={14} fontWeight={600} fontFamily={font}>
              {b.title}
            </text>
            <text x={b.x + boxW / 2} y={b.y + 48} textAnchor="middle" fill={sub} fontSize={12} fontFamily={font}>
              {b.lines[0]}
            </text>
            <text x={b.x + boxW / 2} y={b.y + 66} textAnchor="middle" fill={sub} fontSize={12} fontFamily={font}>
              {b.lines[1]}
            </text>
          </g>
        ))}

        {beside.map((b) => (
          <g key={b.title}>
            <rect x={648} y={b.y} width={220} height={boxH} rx={6} fill={tealTint} stroke={teal} strokeWidth={1.2} />
            <text x={758} y={b.y + 26} textAnchor="middle" fill={ink} fontSize={14} fontWeight={600} fontFamily={font}>
              {b.title}
            </text>
            <text x={758} y={b.y + 48} textAnchor="middle" fill={sub} fontSize={12} fontFamily={font}>
              {b.lines[0]}
            </text>
            <text x={758} y={b.y + 66} textAnchor="middle" fill={sub} fontSize={12} fontFamily={font}>
              {b.lines[1]}
            </text>
          </g>
        ))}

        {/* The one link across the zones */}
        <line
          x1={646}
          y1={228}
          x2={460}
          y2={228}
          stroke={sub}
          strokeWidth={1.6}
          markerEnd="url(#thesis-map-arrow)"
        />
        <text x={536} y={216} textAnchor="middle" fill={ink} fontSize={12} fontWeight={600} fontFamily={font}>
          sets the page size,
        </text>
        <text x={536} y={248} textAnchor="middle" fill={ink} fontSize={12} fontWeight={600} fontFamily={font}>
          the reuse unit
        </text>
      </svg>
    </div>
  );
}

export function ThesisAndFraming() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Predict how SGLang will treat your traffic from one idea, the KV (key-value) cache as a shared prefix index, and see which of its behaviours you already know from vLLM (verified against SGLang v0.5.22, commit baa9befa, 2026-10-24)"
          >
            1. Thesis &amp; Framing
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            SGLang is an open-source serving engine, and for language models the name covers two
            things its repository ships. One is a frontend language, a Python library for programs
            that make several model calls{' '}
            <Cite tier={1} href={sglangTreeUrl('python/sglang/lang')}>
              python/sglang/lang/
            </Cite>
            . The other is the SGLang Runtime (SRT), the serving engine itself{' '}
            <Cite tier={1} href={sglangUrl('python/sglang/README.md', 'L10')}>
              python/sglang/README.md L10
            </Cite>
            . The v0.5.22 tree presents the runtime behind an OpenAI-compatible API as the way to
            use SGLang: the quickstart&apos;s first request is an OpenAI chat completion, the docs
            file the language under References, and the package README marks the language
            frontend deprecated{' '}
            <Cite tier={1} href={sglangDocsSrcUrl('get-started/quickstart', 'L50-L55')}>
              SGLang docs: quickstart (v0.5.22 source)
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl('docs/docs.json', 'L1047-L1082')}>
              docs.json L1047-L1082
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl('python/sglang/README.md', 'L8')}>
              python/sglang/README.md L8
            </Cite>
            . This dive is about the runtime. The language appears where it explains the cache, in
            the design-intent block at the end of section 5, RadixAttention and the Radix Cache.
          </Box>
          <Box variant="p">
            SGLang describes itself as &quot;optimized for agentic workloads, large-scale serving,
            and RL rollouts&quot;{' '}
            <Cite tier={1} href={sglangUrl('README.md', 'L21')}>
              README.md L21
            </Cite>
            , where RL is reinforcement learning. Our reading of that list: all three send long
            prefixes again and again. An agent resends its system prompt and tool schemas on every
            call, a chat resends its history every turn, and an RL rollout samples many answers from
            one prompt. The challenge is to compute each shared prefix once. SGLang&apos;s bet is to
            index the KV cache by token sequence, so that a prefix computed for one
            request is found by every later request that opens with the same tokens.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Start from what carries over: the two engines are the same class, so most of what you know from vLLM still holds"
          >
            What you already know from vLLM
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Both engines page the KV cache, cache prefixes by default, overlap CPU and GPU work by
            default, queue requests first-come-first-served (FCFS) and recompute on preemption,
            outside the decode mode of SGLang&apos;s PD (prefill/decode) disaggregation, and on
            NVIDIA both run the same kernel projects, each through its own forks. By our reading of
            the two codebases, a feature list therefore mostly finds parity and a configuration
            comparison finds the differences; section 23, SGLang and vLLM Compared, has the full
            list.
          </Box>
          <ExpandableSection headerText="Where each shared default sits in both codebases">
            <ul>
              <li>
                Paged KV cache:{' '}
                <Cite tier={1} href={sglangUrl(`${SRT}/mem_cache/allocator/paged.py`, 'L136')}>
                  paged.py L136
                </Cite>{' '}
                ({V5_LINK}).
              </li>
              <li>
                Prefix caching on by default:{' '}
                <Cite tier={1} href={sglangUrl(`${SRT}/mem_cache/registry.py`, 'L83-L146')}>
                  registry.py L83-L146
                </Cite>{' '}
                <Cite tier={1} href={vllmUrl('vllm/config/cache.py', 'L142')}>
                  vLLM cache.py L142
                </Cite>
                .
              </li>
              <li>
                CPU and GPU overlap on by default:{' '}
                <Cite tier={1} href={sglangUrl(SCHEDULER, 'L1974-L2040')}>
                  scheduler.py L1974-L2040
                </Cite>{' '}
                <Cite tier={1} href={vllmUrl('vllm/config/vllm.py', 'L1576-L1635')}>
                  vLLM vllm.py L1576-L1635
                </Cite>
                .
              </li>
              <li>
                FCFS queue by default:{' '}
                <Cite tier={1} href={sglangUrl(SCHED_FIELDS, 'L82-L98')}>
                  schedule.py L82-L98
                </Cite>{' '}
                <Cite tier={1} href={vllmUrl('vllm/config/scheduler.py', 'L160')}>
                  vLLM scheduler.py L160
                </Cite>
                .
              </li>
              <li>
                Recompute on preemption:{' '}
                <Cite tier={1} href={sglangUrl(BATCH, 'L3298-L3418')}>
                  schedule_batch.py L3298-L3418
                </Cite>{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/core/sched/scheduler.py', 'L1538-L1581')}>
                  vLLM scheduler.py L1538-L1581
                </Cite>
                .
              </li>
              <li>
                Same kernel projects through forks, FlashInfer 0.7.x pinned on both sides and
                FlashAttention built from a fork:{' '}
                <Cite tier={1} href={sglangUrl('python/pyproject.toml', 'L41-L88')}>
                  pyproject.toml L41-L88
                </Cite>{' '}
                <Cite tier={1} href={sglangUrl('python/sglang/kernels/aot/CMakeLists.txt', 'L83-L89')}>
                  kernels/aot/CMakeLists.txt L83-L89
                </Cite>{' '}
                <Cite tier={1} href={vllmUrl('requirements/cuda.txt', 'L17-L18')}>
                  vLLM requirements/cuda.txt L17-L18
                </Cite>{' '}
                <Cite tier={1} href={vllmUrl('cmake/external_projects/vllm_flash_attn.cmake', 'L41-L42')}>
                  vLLM vllm_flash_attn.cmake L41-L42
                </Cite>
                .
              </li>
            </ul>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Know the three differences that change what your traffic does, and the section that owns each"
          >
            Where SGLang differs: three edges
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Our reading of the two codebases puts what differs at three edges: the index, the
            scheduler&apos;s defaults, and what ships in the engine repository.
          </Box>
          <Box variant="p">
            <strong>The index.</strong> SGLang indexes the KV cache as a radix tree whose edges are
            variable-length runs of tokens{' '}
            <Cite tier={1} href={sglangUrl(RC, 'L250-L278')}>
              radix_cache.py L250-L278
            </Cite>
            , where vLLM follows a chain of fixed-size block hashes{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/kv_cache_utils.py', 'L684-L714')}>
              vLLM kv_cache_utils.py L684-L714
            </Cite>{' '}
            ({V6_LINK}). The tree decides what a hit costs: the matched slot indices are copied into
            the new request&apos;s row, and no KV bytes move{' '}
            <Cite tier={1} href={sglangUrl(`${SRT}/mem_cache/allocation.py`, 'L55-L104')} kind="code">
              allocation.py L55-L104
            </Cite>
            . It decides what eviction removes: whole leaves that no running request holds, and only
            when an allocation finds too few free slots{' '}
            <Cite tier={1} href={sglangUrl(`${SRT}/mem_cache/allocator/base.py`, 'L144-L158')}>
              allocator/base.py L144-L158
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(RC, 'L552-L580')}>
              radix_cache.py L552-L580
            </Cite>
            . Queue orders that read the tree are opt-in, and the longest-prefix-match order,{' '}
            <code>lpm</code>, falls back to FCFS in any round where more than 128 requests wait{' '}
            <Cite tier={1} href={sglangUrl(POLICY, 'L300-L311')}>
              schedule_policy.py L300-L311
            </Cite>
            .
          </Box>
          <Box variant="p">
            The reuse unit of the tree is the page size, and the attention backend sets it, so the
            GPU decides how finely prefixes are reused. By our reading of the default chain in code,
            a dense Llama-style model reuses a shared prefix to the exact token on H100 and in{' '}
            <strong>64-token steps on B200</strong>, with no flag changed{' '}
            <Cite tier={1} href={sglangUrl(MOB, 'L268-L341')} kind="code">
              model_override_base.py L268-L341
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(OVR, 'L1125-L1137')} kind="code">
              overrides.py L1125-L1137
            </Cite>
            . The B200 figure holds with speculative decoding off, or on with{' '}
            <code>--speculative-eagle-topk 1</code> and <code>--speculative-num-steps</code> set
            explicitly{' '}
            <Cite tier={1} href={sglangUrl(SPEC_HOOK, 'L1068-L1090')} kind="code">
              speculative_hook.py L1068-L1090
            </Cite>
            . Against vLLM&apos;s default 16-token blocks{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/cache.py', 'L333-L334')}>
              vLLM cache.py L333-L334
            </Cite>
            , SGLang reuses more finely on H100 and less finely on B200. Section 5, RadixAttention
            and the Radix Cache, covers the tree; section 6, KV Memory and the Defaults Your GPU Picks, and
            section 8, Attention Backends and Kernels, cover the page size and when to set it.
          </Box>
          <Box variant="p">
            <strong>Scheduler defaults.</strong> Steps are prefill-first: the scheduler runs a
            prefill forward whenever it can form one, and decode runs in steps of its own{' '}
            <Cite tier={1} href={sglangUrl(SCHEDULER, 'L3766-L3870')} kind="code">
              scheduler.py L3766-L3870
            </Cite>
            , where vLLM shares one token budget per step between decodes and prefill chunks;{' '}
            <code>--enable-mixed-chunk</code>, off by default, is the closer match{' '}
            <Cite tier={1} href={sglangUrl(SCHED_FIELDS, 'L202-L205')}>
              schedule.py L202-L205
            </Cite>
            . Admission is a bet that answers stop early: a new request is charged its uncached
            prompt plus up to 4096 output tokens{' '}
            <Cite tier={1} href={sglangUrl(POLICY, 'L1336-L1360')}>
              schedule_policy.py L1336-L1360
            </Cite>
            . When the bet loses and KV runs out, retraction, SGLang&apos;s name for preemption,
            sends the requests with the fewest generated tokens back to the queue first{' '}
            <Cite tier={1} href={sglangUrl(SCHED_FIELDS, 'L122-L134')}>
              schedule.py L122-L134
            </Cite>
            . SGLang therefore protects long generations, where vLLM under FCFS preempts the most
            recently added request and protects early arrivals{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/sched/scheduler.py', 'L763-L771')}>
              vLLM scheduler.py L763-L771
            </Cite>{' '}
            ({V4_LINK}). Section 4, The Scheduler, covers both bets and the log lines that show them.
          </Box>
          <Box variant="p">
            <strong>What ships in the engine repository.</strong> Three fleet pieces arrive with
            SGLang. The first is a cache-aware gateway: the Rust <code>sgl-model-gateway</code> sits
            in the SGLang repository{' '}
            <Cite tier={1} href={sglangUrl(`${GW}/Cargo.toml`, 'L5-L34')}>
              Cargo.toml L5-L34
            </Cite>{' '}
            and routes <code>cache_aware</code> by default{' '}
            <Cite tier={1} href={sglangUrl(`${GW}/src/main.rs`, 'L150-L151')}>
              main.rs L150-L151
            </Cite>
            . vLLM&apos;s routers live in separate projects, and one of them,{' '}
            <code>vllm-project/router</code>, is a fork of the SGLang gateway{' '}
            <Cite tier={1} href={VLLM_ROUTER_FORK}>
              vllm-project/router v0.1.16 README L339
            </Cite>{' '}
            ({V16_LINK}).
          </Box>
          <Box variant="p">
            The second is the PD control plane, a mode of the same server{' '}
            <Cite tier={1} href={sglangUrl(`${SRT}/arg_groups/fields/disagg.py`, 'L55-L58')}>
              disagg.py L55-L58
            </Cite>
            . The gateway sends the request to a prefill and a decode server at once{' '}
            <Cite tier={1} href={sglangUrl(`${GW}/src/routers/http/pd_router.rs`, 'L701-L730')}>
              pd_router.rs L701-L730
            </Cite>
            , decode reserves pages for the KV, and prefill writes the KV into them, so the
            handshake is done before prefill finishes{' '}
            <Cite tier={1} href={sglangUrl(PREFILL, 'L462-L537')}>
              prefill.py L462-L537
            </Cite>
            . Both the Mooncake and the NIXL (NVIDIA Inference Xfer Library) backends push from
            prefill into decode memory{' '}
            <Cite tier={1} href={sglangUrl(MOONCAKE_TE, 'L246-L260')}>
              mooncake_transfer_engine.py L246-L260
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(NIXL_CONN, 'L1910-L1915')}>
              nixl/conn.py L1910-L1915
            </Cite>
            , where vLLM&apos;s reference <code>NixlConnector</code> pulls and a push connector is
            an option ({V10_LINK}).
          </Box>
          <Box variant="p">
            The third is the admin plane, the routes that change a running server, among them the
            weight updates an RL trainer calls. They are registered on every Python HTTP server, and
            with neither <code>--api-key</code> nor <code>--admin-api-key</code> set they accept
            any client that can reach the port, the three HiCache storage routes excepted{' '}
            <Cite tier={1} href={sglangUrl(AUTH, 'L79-L151')}>
              auth.py L79-L151
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(SERVING, 'L154-L161')}>
              serving.py L154-L161
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(HTTP, 'L1106-L1173')}>
              http_server.py L1106-L1173
            </Cite>
            . At the default 127.0.0.1 bind that is the local host{' '}
            <Cite tier={1} href={sglangUrl(SERVING, 'L65-L66')}>
              serving.py L65-L66
            </Cite>
            , and once a container passes <code>--host 0.0.0.0</code> it is the network{' '}
            <Cite tier={1} href={AWS_DLC_EKS}>
              AWS Deep Learning Containers: SGLang deployment doc
            </Cite>
            . vLLM registers its weight-update, cache-reset and sleep routes only under{' '}
            <code>VLLM_SERVER_DEV_MODE=1</code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/entrypoints/launchers/api_server/routers.py', 'L34-L37')}>
              vLLM routers.py L34-L37
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/entrypoints/serve/__init__.py', 'L43-L69')}>
              vLLM serve/__init__.py L43-L69
            </Cite>{' '}
            ({V12_LINK}). Section 17, The Model Gateway, section 15, PD Disaggregation, and section
            12, Talking to SGLang: APIs, LoRA (low-rank adaptation) and the Admin Plane, own the
            three pieces.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Place every later section on one map, and predict which behaviours follow from the prefix index and which run beside it"
          >
            One map for the rest of the dive
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The mental model to carry through the dive: the cache, admission, the gateway and
            HiCache (the hierarchical cache) are organised around the index, and request features and kernels run beside it.
          </Box>

          <ComponentMapDiagram />
          <Box variant="small" color="text-body-secondary">
            Illustrative, not measured. Numbers in parentheses are the sections of this dive that
            own each part.
          </Box>

          <Box variant="p">
            Around the index, each component works from what the tree holds. A hit and an eviction
            are operations on the tree. Admission charges the part of a prompt the tree did not cover{' '}
            <Cite tier={1} href={sglangUrl(POLICY, 'L1336-L1360')}>
              schedule_policy.py L1336-L1360
            </Cite>
            . The gateway approximates each worker&apos;s tree from the prompt text it has sent
            there{' '}
            <Cite tier={1} href={sglangUrl(`${GW}/src/policies/cache_aware.rs`, 'L405-L470')}>
              cache_aware.rs L405-L470
            </Cite>
            . HiCache is opt-in{' '}
            <Cite tier={1} href={sglangUrl(`${SRT}/arg_groups/fields/memory.py`, 'L98')}>
              memory.py L98
            </Cite>{' '}
            and stretches the same tree over host memory and storage: evicting a GPU node that
            already has a host copy keeps the node in the tree, host-only, so the next match still
            finds it{' '}
            <Cite tier={1} href={sglangUrl(TREE_CORE, 'L1758-L1791')} kind="code">
              unified_tree_core.py L1758-L1791
            </Cite>
            .
          </Box>
          <Box variant="p">
            Beside the index, structured output is a CPU state machine that writes a vocabulary
            bitmask before every sample{' '}
            <Cite tier={1} href={sglangUrl(`${SRT}/sampling/sampling_batch_info.py`, 'L382-L407')} kind="code">
              sampling_batch_info.py L382-L407
            </Cite>
            , and speculative decoding drafts tokens and verifies them in one target pass, and runs
            only when <code>--speculative-algorithm</code> is set{' '}
            <Cite tier={1} href={sglangUrl(`${SRT}/arg_groups/fields/spec.py`, 'L31-L34')}>
              spec.py L31-L34
            </Cite>
            . The kernels meet the index in one place: the attention backend sets the page size, the
            reuse unit of the tree, which is why the same Llama deployment reuses to the token on
            H100 and in <strong>64-token steps on B200</strong>.
          </Box>
          <Box variant="p">
            The model has a boundary worth knowing before you plan a disaggregated deployment: a PD
            decode server runs with the radix cache off by default, so prefix reuse happens on the
            prefill side{' '}
            <Cite tier={1} href={sglangUrl(PD_HOOK, 'L98-L134')}>
              pd_disaggregation_hook.py L98-L134
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Check your install against the pin before you trust a default from this dive, because a new SGLang release lands about every two weeks"
          >
            The version this dive describes
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Every default, flag and line number in this dive is read from SGLang v0.5.22, released
            2026-10-19 at commit <code>baa9befa</code>{' '}
            <Cite tier={1} href={RELEASE_0522}>
              SGLang v0.5.22 release
            </Cite>
            . It requires Python 3.11 or newer{' '}
            <Cite tier={1} href={sglangUrl('python/pyproject.toml', 'L16')}>
              pyproject.toml L16
            </Cite>
            , and on Python 3.10 <code>pip install sglang</code> does not fail: it installs the last
            release that supported 3.10{' '}
            <Cite tier={1} href={RELEASE_0522}>
              v0.5.22 release notes: breaking changes
            </Cite>
            .
          </Box>
          <Box variant="p">
            The project moves fast. Releases v0.5.14 to v0.5.22 came 13 to 17 days apart, with one
            patch release in between, and each of the seven from v0.5.16 to v0.5.22 lists breaking
            changes in its notes{' '}
            <Cite tier={1} href={RELEASES}>
              SGLang releases
            </Cite>
            ; v0.5.22 alone raised the Python floor and deprecated <code>--enable-dp-attention</code>{' '}
            in favour of <code>--attn-dp-size</code>{' '}
            <Cite tier={1} href={RELEASE_0522}>
              v0.5.22 release notes: breaking changes
            </Cite>
            .
          </Box>
          <Box variant="p">
            Before you act on a default from this dive, check the version you run with{' '}
            <code>python -c &quot;import sglang; print(sglang.__version__)&quot;</code>{' '}
            <Cite tier={1} href={sglangUrl('python/sglang/__init__.py', 'L58')}>
              __init__.py L58
            </Cite>{' '}
            and read the breaking changes of every release between it and v0.5.22. Then go to
            section 2, Getting Started, for your route through the dive and the settings a vLLM user
            gets wrong on day one.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
