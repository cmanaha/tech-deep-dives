import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Table from '@cloudscape-design/components/table';
import Link from '@cloudscape-design/components/link';
import type { ReactNode } from 'react';
import { Cite, sglangUrl, sglangDocsSrcUrl } from '../components/Cite';

const RC = 'python/sglang/srt/mem_cache/radix_cache.py';
const POOL = 'python/sglang/srt/mem_cache/memory_pool.py';
const POLICY = 'python/sglang/srt/managers/schedule_policy.py';
const MEMFLAGS = 'python/sglang/srt/arg_groups/fields/memory.py';
const METRICS = 'python/sglang/srt/observability/metrics_collector.py';
const RUNTIME_EP = 'python/sglang/lang/backend/runtime_endpoint.py';
const INTERP = 'python/sglang/lang/interpreter.py';
const ARXIV = 'https://arxiv.org/html/2312.07104v2';
const LMSYS_2024 = 'https://lmsys.org/blog/2024-01-17-sglang/';

function vllmUrl(path: string, lines: string): string {
  return `https://github.com/vllm-project/vllm/blob/v0.31.0/${path}#${lines}`;
}

/* ------------------------------------------------------------------ */
/* Diagram 1: the radix tree with lock counts and one evicted leaf     */
/* ------------------------------------------------------------------ */

function RadixLocksDiagram() {
  const levelTwo = [
    { x: 30, title: 'user A, turn 1', l1: 'lock_ref 1', l2: 'on a running path', kind: 'held' },
    { x: 235, title: 'user B, turn 1', l1: 'lock_ref 0, used at t=3', l2: 'evicted first, whole', kind: 'gone' },
    { x: 440, title: 'user C, turn 1', l1: 'lock_ref 1', l2: 'running request', kind: 'held' },
    { x: 645, title: 'user D, turn 1', l1: 'lock_ref 0, used at t=7', l2: 'next candidate', kind: 'idle' },
  ];
  const boxClass: Record<string, string> = {
    held: 'radix-locks-held',
    gone: 'radix-locks-gone',
    idle: 'radix-locks-idle',
  };
  const edgeClass: Record<string, string> = {
    held: 'radix-locks-e-held',
    gone: 'radix-locks-e-gone',
    idle: 'radix-locks-e-idle',
  };
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 860 432"
        role="img"
        aria-labelledby="radix-locks-title"
        style={{ width: '100%', minWidth: 680, height: 'auto' }}
      >
        <title id="radix-locks-title">
          A shared system prompt with four conversations under it. The running requests of user A
          and user C lock every node from their match up to the root, so the system prompt carries
          lock_ref 2 and cannot be evicted. When an allocation is 100 slots short, the least
          recently used leaf with no lock, user B&apos;s, is evicted whole, all 4,000 of its
          tokens, and user D&apos;s idle leaf is the next candidate.
        </title>
        <style>{`
          .radix-locks-held { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .radix-locks-idle { fill: #ffffff; stroke: #879596; stroke-width: 1.5; }
          .radix-locks-gone { fill: #fbf3d5; stroke: #8b6c00; stroke-width: 1.5; stroke-dasharray: 6 4; }
          .radix-locks-t { fill: #16191f; font: 600 13px sans-serif; text-anchor: middle; }
          .radix-locks-s { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .radix-locks-sa { fill: #8b6c00; font: 11px sans-serif; text-anchor: middle; }
          .radix-locks-ct { fill: #8b6c00; font: 600 12px sans-serif; text-anchor: middle; }
          .radix-locks-leg { fill: #414d5c; font: 11px sans-serif; }
          .radix-locks-e-held { stroke: #0972d3; stroke-width: 1.5; fill: none; }
          .radix-locks-e-idle { stroke: #879596; stroke-width: 1.5; fill: none; }
          .radix-locks-e-gone { stroke: #8b6c00; stroke-width: 1.5; fill: none; stroke-dasharray: 6 4; }
        `}</style>
        <rect x={0} y={0} width={860} height={432} rx={8} fill="#ffffff" />

        {/* edges first, so boxes paint over line ends */}
        <line x1={430} y1={64} x2={430} y2={96} className="radix-locks-e-held" />
        {levelTwo.map((n) => (
          <line
            key={`e-${n.title}`}
            x1={430}
            y1={152}
            x2={n.x + 92.5}
            y2={196}
            className={edgeClass[n.kind]}
          />
        ))}
        <line x1={122.5} y1={270} x2={122.5} y2={306} className="radix-locks-e-held" />
        <line x1={327.5} y1={270} x2={327.5} y2={306} className="radix-locks-e-gone" />

        {/* root */}
        <rect x={345} y={16} width={170} height={48} rx={6} className="radix-locks-held" />
        <text x={430} y={36} className="radix-locks-t">root</text>
        <text x={430} y={54} className="radix-locks-s">lock_ref 1, permanent</text>

        {/* shared system prompt */}
        <rect x={300} y={96} width={260} height={56} rx={6} className="radix-locks-held" />
        <text x={430} y={118} className="radix-locks-t">shared system prompt</text>
        <text x={430} y={138} className="radix-locks-s">lock_ref 2: two running requests</text>

        {/* four conversations */}
        {levelTwo.map((n) => (
          <g key={n.title}>
            <rect x={n.x} y={196} width={185} height={74} rx={6} className={boxClass[n.kind]} />
            <text x={n.x + 92.5} y={218} className="radix-locks-t">{n.title}</text>
            <text x={n.x + 92.5} y={238} className={n.kind === 'gone' ? 'radix-locks-sa' : 'radix-locks-s'}>
              {n.l1}
            </text>
            <text x={n.x + 92.5} y={256} className={n.kind === 'gone' ? 'radix-locks-sa' : 'radix-locks-s'}>
              {n.l2}
            </text>
          </g>
        ))}

        {/* user A's second turn: the running request's matched node */}
        <rect x={30} y={306} width={185} height={56} rx={6} className="radix-locks-held" />
        <text x={122.5} y={328} className="radix-locks-t">user A, turn 2</text>
        <text x={122.5} y={346} className="radix-locks-s">lock_ref 1, running</text>

        {/* eviction callout under user B */}
        <rect x={235} y={306} width={300} height={70} rx={6} fill="#fffdf5" stroke="#8b6c00" strokeWidth={1} />
        <text x={385} y={326} className="radix-locks-ct">Allocation short by 100 slots</text>
        <text x={385} y={344} className="radix-locks-sa">B goes first: the oldest leaf with no lock.</text>
        <text x={385} y={361} className="radix-locks-sa">It is freed whole: all 4,000 of its tokens.</text>

        {/* legend */}
        <rect x={30} y={402} width={16} height={12} rx={2} className="radix-locks-held" />
        <text x={52} y={412} className="radix-locks-leg">held by a running request (lock_ref above 0)</text>
        <rect x={345} y={402} width={16} height={12} rx={2} className="radix-locks-idle" />
        <text x={367} y={412} className="radix-locks-leg">idle leaf with no lock: evictable</text>
        <rect x={592} y={402} width={16} height={12} rx={2} className="radix-locks-gone" />
        <text x={614} y={412} className="radix-locks-leg">evicted: slots back to the free list</text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Diagram 2: a cache hit is an index copy                             */
/* ------------------------------------------------------------------ */

function HitIndexCopyDiagram() {
  const rowCells = [12, 13, 14, 15, 40, 41, 88, 89];
  const stripX = 240;
  const stripW = 590;
  const slots = 96;
  const slotW = stripW / slots;
  const strips = [
    { y: 292, label: 'layer 0' },
    { y: 324, label: 'layer 1' },
    { y: 356, label: 'layer N-1' },
  ];
  const hitRuns = [
    { start: 12, len: 4, cls: 'radix-hit-hit' },
    { start: 40, len: 2, cls: 'radix-hit-hit' },
    { start: 88, len: 2, cls: 'radix-hit-new' },
  ];
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 860 432"
        role="img"
        aria-labelledby="radix-hit-title"
        style={{ width: '100%', minWidth: 680, height: 'auto' }}
      >
        <title id="radix-hit-title">
          On a cache hit, the slot indices stored on the matched tree path are copied into
          positions 0 to 5 of the new request&apos;s req_to_token row, and positions 6 and 7 get
          newly allocated slots for the uncached tail. Attention in every layer reads K and V
          through that row, so a hit moves indices and leaves every K and V byte where it is.
        </title>
        <defs>
          <marker
            id="radix-hit-ah"
            markerWidth="8"
            markerHeight="8"
            refX="8"
            refY="4"
            orient="auto-start-reverse"
            markerUnits="userSpaceOnUse"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill="#5f6b7a" />
          </marker>
          <marker
            id="radix-hit-ahg"
            markerWidth="8"
            markerHeight="8"
            refX="8"
            refY="4"
            orient="auto-start-reverse"
            markerUnits="userSpaceOnUse"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill="#1d8102" />
          </marker>
        </defs>
        <style>{`
          .radix-hit-node { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .radix-hit-hit { fill: #ecf7ec; stroke: #1d8102; stroke-width: 1.2; }
          .radix-hit-new { fill: #dcebfa; stroke: #0972d3; stroke-width: 1.2; }
          .radix-hit-strip { fill: #f4f4f4; stroke: #879596; stroke-width: 1; }
          .radix-hit-rl { fill: #16191f; font: 600 13px sans-serif; }
          .radix-hit-rs { fill: #5f6b7a; font: 11px sans-serif; }
          .radix-hit-nt { fill: #16191f; font: 600 12px sans-serif; text-anchor: middle; }
          .radix-hit-cell { fill: #16191f; font: 12px sans-serif; text-anchor: middle; }
          .radix-hit-g { fill: #1d8102; font: 11px sans-serif; text-anchor: middle; }
          .radix-hit-b { fill: #065299; font: 11px sans-serif; text-anchor: middle; }
          .radix-hit-gl { fill: #1d8102; font: 600 12px sans-serif; }
          .radix-hit-side { fill: #5f6b7a; font: 11px sans-serif; }
          .radix-hit-sl { fill: #414d5c; font: 11px sans-serif; }
          .radix-hit-foot { fill: #16191f; font: 600 12px sans-serif; text-anchor: middle; }
          .radix-hit-arr { stroke: #5f6b7a; stroke-width: 1.5; fill: none; marker-end: url(#radix-hit-ah); }
          .radix-hit-arrg { stroke: #1d8102; stroke-width: 2; fill: none; marker-end: url(#radix-hit-ahg); }
          .radix-hit-ln { stroke: #5f6b7a; stroke-width: 1.5; fill: none; }
        `}</style>
        <rect x={0} y={0} width={860} height={432} rx={8} fill="#ffffff" />

        {/* row 1: the tree path */}
        <text x={20} y={70} className="radix-hit-rl">radix tree</text>
        <text x={20} y={88} className="radix-hit-rs">(host side)</text>
        <rect x={150} y={44} width={270} height={60} rx={6} className="radix-hit-node" />
        <text x={285} y={62} className="radix-hit-nt">system prompt node</text>
        {[12, 13, 14, 15].map((v, i) => (
          <g key={`n1-${v}`}>
            <rect x={191 + i * 48} y={72} width={44} height={24} rx={3} className="radix-hit-hit" />
            <text x={213 + i * 48} y={89} className="radix-hit-cell">{v}</text>
          </g>
        ))}
        <line x1={420} y1={74} x2={448} y2={74} className="radix-hit-arr" />
        <rect x={450} y={44} width={170} height={60} rx={6} className="radix-hit-node" />
        <text x={535} y={62} className="radix-hit-nt">user turn node</text>
        {[40, 41].map((v, i) => (
          <g key={`n2-${v}`}>
            <rect x={489 + i * 48} y={72} width={44} height={24} rx={3} className="radix-hit-hit" />
            <text x={511 + i * 48} y={89} className="radix-hit-cell">{v}</text>
          </g>
        ))}

        {/* the copy */}
        <line x1={330} y1={108} x2={330} y2={166} className="radix-hit-arrg" />
        <text x={344} y={142} className="radix-hit-gl">cache hit: copy the slot indices</text>

        {/* row 2: the request's req_to_token row */}
        <text x={20} y={186} className="radix-hit-rl">req_to_token</text>
        <text x={20} y={202} className="radix-hit-rs">new request&apos;s row</text>
        {rowCells.map((v, i) => (
          <g key={`row-${i}`}>
            <rect
              x={150 + i * 60}
              y={172}
              width={56}
              height={32}
              rx={3}
              className={i < 6 ? 'radix-hit-hit' : 'radix-hit-new'}
            />
            <text x={178 + i * 60} y={193} className="radix-hit-cell">{v}</text>
          </g>
        ))}
        <text x={328} y={224} className="radix-hit-g">positions 0-5: copied from the tree</text>
        <text x={568} y={224} className="radix-hit-b">6-7: newly allocated</text>
        <text x={568} y={240} className="radix-hit-b">for the uncached tail</text>

        {/* from the row into the pool */}
        <line x1={630} y1={188} x2={700} y2={188} className="radix-hit-ln" />
        <line x1={700} y1={188} x2={700} y2={286} className="radix-hit-arr" />
        <text x={712} y={232} className="radix-hit-side">attention reads</text>
        <text x={712} y={247} className="radix-hit-side">K and V through</text>
        <text x={712} y={262} className="radix-hit-side">this row</text>

        {/* row 3: the token-to-KV pool */}
        <text x={20} y={318} className="radix-hit-rl">token-to-KV</text>
        <text x={20} y={334} className="radix-hit-rs">pool (GPU)</text>
        {strips.map((s) => (
          <g key={s.label}>
            <text x={150} y={s.y + 16} className="radix-hit-sl">{s.label}</text>
            <rect x={stripX} y={s.y} width={stripW} height={24} rx={3} className="radix-hit-strip" />
            {hitRuns.map((r) => (
              <rect
                key={`${s.label}-${r.start}`}
                x={stripX + r.start * slotW}
                y={s.y + 2}
                width={r.len * slotW}
                height={20}
                className={r.cls}
              />
            ))}
          </g>
        ))}
        <text x={430} y={410} className="radix-hit-foot">
          A hit writes indices into the row. The K and V bytes in every layer stay where they are.
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Diagram 3: a program's fork/join mapped onto radix-tree branches     */
/* ------------------------------------------------------------------ */

function ForkOntoTreeDiagram() {
  const branches = [30, 156, 282];
  const leaves = [496, 616, 736];
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 860 360"
        role="img"
        aria-labelledby="radix-fork-title"
        style={{ width: '100%', minWidth: 680, height: 'auto' }}
      >
        <title id="radix-fork-title">
          A program adds a shared header, forks three ways and joins. The fork sends the parent text
          once as a zero-token request, which becomes one node in the radix tree; each branch&apos;s
          gen resends the parent text plus its own suffix, matches that node and adds one leaf under
          it.
        </title>
        <defs>
          <marker
            id="radix-fork-ah"
            markerWidth="8"
            markerHeight="8"
            refX="8"
            refY="4"
            orient="auto-start-reverse"
            markerUnits="userSpaceOnUse"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill="#5f6b7a" />
          </marker>
          <marker
            id="radix-fork-aht"
            markerWidth="8"
            markerHeight="8"
            refX="8"
            refY="4"
            orient="auto-start-reverse"
            markerUnits="userSpaceOnUse"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill="#1f7a70" />
          </marker>
        </defs>
        <style>{`
          .radix-fork-prog { fill: #efe7fb; stroke: #6f4cc4; stroke-width: 1.5; }
          .radix-fork-node { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .radix-fork-h { fill: #16191f; font: 600 13px sans-serif; }
          .radix-fork-t { fill: #16191f; font: 600 12px sans-serif; text-anchor: middle; }
          .radix-fork-s { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .radix-fork-n { fill: #414d5c; font: 11px sans-serif; }
          .radix-fork-map { fill: #1f7a70; font: 11px sans-serif; text-anchor: middle; }
          .radix-fork-arr { stroke: #5f6b7a; stroke-width: 1.5; fill: none; marker-end: url(#radix-fork-ah); }
          .radix-fork-ln { stroke: #0972d3; stroke-width: 1.5; fill: none; }
          .radix-fork-m { stroke: #1f7a70; stroke-width: 1.5; fill: none; stroke-dasharray: 5 4; marker-end: url(#radix-fork-aht); }
        `}</style>
        <rect x={0} y={0} width={860} height={360} rx={8} fill="#ffffff" />

        <text x={30} y={28} className="radix-fork-h">The program</text>
        <text x={496} y={28} className="radix-fork-h">The radix tree it builds</text>

        {/* program side */}
        <rect x={30} y={44} width={360} height={40} rx={6} className="radix-fork-prog" />
        <text x={210} y={68} className="radix-fork-t">s += shared header and question</text>
        <line x1={210} y1={84} x2={210} y2={100} className="radix-fork-arr" />
        <rect x={30} y={102} width={360} height={56} rx={6} className="radix-fork-prog" />
        <text x={210} y={124} className="radix-fork-t">forks = s.fork(3)</text>
        <text x={210} y={144} className="radix-fork-s">sends the parent text once, zero new tokens</text>
        {branches.map((x, i) => (
          <g key={`b-${x}`}>
            <line x1={210} y1={158} x2={x + 54} y2={176} className="radix-fork-arr" />
            <rect x={x} y={178} width={108} height={44} rx={6} className="radix-fork-prog" />
            <text x={x + 54} y={204} className="radix-fork-t">{`branch ${i + 1}: gen`}</text>
            <line x1={x + 54} y1={222} x2={210} y2={250} className="radix-fork-arr" />
          </g>
        ))}
        <rect x={30} y={252} width={360} height={56} rx={6} className="radix-fork-prog" />
        <text x={210} y={274} className="radix-fork-t">forks.join()</text>
        <text x={210} y={294} className="radix-fork-s">copies each branch&apos;s variables back as lists</text>
        <text x={210} y={336} className="radix-fork-s">each gen resends the parent text plus its own suffix</text>

        {/* tree side */}
        <line x1={670} y1={78} x2={670} y2={100} className="radix-fork-ln" />
        {leaves.map((x) => (
          <line key={`le-${x}`} x1={670} y1={156} x2={x + 54} y2={196} className="radix-fork-ln" />
        ))}
        <rect x={610} y={44} width={120} height={34} rx={6} className="radix-fork-node" />
        <text x={670} y={66} className="radix-fork-t">root</text>
        <rect x={520} y={100} width={300} height={56} rx={6} className="radix-fork-node" />
        <text x={670} y={122} className="radix-fork-t">parent text</text>
        <text x={670} y={142} className="radix-fork-s">cached by the zero-token request at fork</text>
        {leaves.map((x, i) => (
          <g key={`l-${x}`}>
            <rect x={x} y={196} width={108} height={56} rx={6} className="radix-fork-node" />
            <text x={x + 54} y={218} className="radix-fork-t">{`branch ${i + 1} leaf`}</text>
            <text x={x + 54} y={238} className="radix-fork-s">suffix + output</text>
          </g>
        ))}
        <text x={496} y={286} className="radix-fork-n">With a page size above 1 (64 on B200),</text>
        <text x={496} y={302} className="radix-fork-n">only whole pages of the parent text are shared.</text>

        {/* mapping from program to tree */}
        <line x1={390} y1={130} x2={518} y2={128} className="radix-fork-m" />
        <text x={455} y={120} className="radix-fork-map">creates</text>
        <line x1={390} y1={200} x2={494} y2={224} className="radix-fork-m" />
        <text x={443} y={190} className="radix-fork-map">one leaf each</text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tables                                                              */
/* ------------------------------------------------------------------ */

interface PolicyRow {
  policy: string;
  first: ReactNode;
  when: ReactNode;
}

const policyRows: PolicyRow[] = [
  {
    policy: 'lru (default)',
    first: 'The prefix unused for longest.',
    when: 'General serving.',
  },
  {
    policy: 'lfu',
    first: 'The prefix with the fewest cache hits, then the least recent.',
    when: 'A few prompts are reused far more than the rest and must survive one-off bursts.',
  },
  {
    policy: 'slru',
    first: (
      <>
        Prefixes with fewer hits than <code>protected_threshold</code> (default 2), then the least
        recent.
      </>
    ),
    when: 'As lfu, with a floor on how much a one-off prefix can displace a proven one.',
  },
  {
    policy: 'priority',
    first: 'The prefix of the lowest-priority request, then the least recent.',
    when: 'You run priority scheduling; without it every request is priority 0 and this is lru.',
  },
  {
    policy: 'tlru',
    first: 'Conversation tails that the next prefill does not need to meet its TTFT budget, then the least recent.',
    when: (
      <>
        Multi-turn and agent traffic where tail TTFT matters more than hit rate. Startup fails
        unless <code>threshold</code> exceeds <code>next_prompt_estimate</code> in{' '}
        <code>--radix-eviction-policy-config</code>{' '}
        <Cite tier={1} href={sglangUrl('python/sglang/srt/arg_groups/kv_cache_hook.py', 'L385-L391')}>
          kv_cache_hook.py L385-L391
        </Cite>
        .
      </>
    ),
  },
];

interface KnobRow {
  flag: string;
  def: ReactNode;
  effect: ReactNode;
  src: ReactNode;
}

const knobRows: KnobRow[] = [
  {
    flag: '--enable-metrics',
    def: 'off',
    effect: (
      <>
        Mounts <code>/metrics</code>; without it there is nothing to scrape.
      </>
    ),
    src: (
      <Cite tier={1} href={sglangUrl('python/sglang/srt/arg_groups/fields/observability.py', 'L70')}>
        observability.py L70
      </Cite>
    ),
  },
  {
    flag: '--schedule-policy',
    def: 'fcfs',
    effect: (
      <>
        <code>lpm</code> reorders the queue by cached prefix while 128 or fewer requests wait.
      </>
    ),
    src: (
      <Cite tier={1} href={sglangUrl('python/sglang/srt/arg_groups/fields/schedule.py', 'L82-L98')}>
        schedule.py L82-L98
      </Cite>
    ),
  },
  {
    flag: '--radix-eviction-policy',
    def: 'lru',
    effect: 'Which idle leaf goes first. Orders only; pins nothing.',
    src: (
      <Cite tier={1} href={sglangUrl(MEMFLAGS, 'L25-L42')}>
        memory.py L25-L42
      </Cite>
    ),
  },
  {
    flag: '--page-size',
    def: '1, raised by the attention backend',
    effect: 'The reuse unit. Sections 6 and 8 cover which backend sets what.',
    src: (
      <Cite tier={1} href={sglangUrl('python/sglang/srt/arg_groups/overrides.py', 'L1304-L1326')}>
        overrides.py L1304-L1326
      </Cite>
    ),
  },
  {
    flag: '--disable-radix-cache',
    def: 'off (cache on)',
    effect: 'Every match is empty and every insert a no-op; cache-aware queue policies run as FCFS.',
    src: (
      <Cite tier={1} href={sglangUrl('python/sglang/srt/mem_cache/unified_radix_cache.py', 'L586-L620')}>
        unified_radix_cache.py L586-L620
      </Cite>
    ),
  },
];

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

export function RadixCache() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Predict what a request reuses, what stays resident and what gets evicted from the shape of the tree, and why a pool full of reusable prefixes reads as low sglang:token_usage (verified against SGLang v0.5.22, commit baa9befa, 2026-10-24)"
          >
            5. RadixAttention and the Radix Cache
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            SGLang keeps the KV (key and value) cache of finished requests in GPU memory and indexes
            it as a radix tree of token runs, so a later request that opens with the same tokens
            skips their prefill. The cache is on by default and{' '}
            <code>--disable-radix-cache</code> turns it off{' '}
            <Cite tier={1} href={sglangUrl(MEMFLAGS, 'L64-L70')}>
              memory.py L64-L70
            </Cite>
            ; startup also turns it off for some configurations, a PD (prefill/decode) decode
            server among them{' '}
            <Cite tier={1} href={sglangUrl('python/sglang/srt/arg_groups/pd_disaggregation_hook.py', 'L128-L134')}>
              pd_disaggregation_hook.py L128-L134
            </Cite>
            .
          </Box>
          <Box variant="p">
            The challenge is predicting what a request will reuse, what stays resident under load
            and what eviction removes. All three follow from the shape of the tree and the two
            tables beneath it.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What a cached prefix is in memory, and why a busy server's pool looks full of cache yet reports little usage"
          >
            Two tables and an index of token runs
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            KV addressing has two levels. The request-to-token table, <code>req_to_token</code>, is
            a 2-D int32 tensor with one row per request slot and one column per position up to the
            context length, and each entry is a KV slot index{' '}
            <Cite tier={1} href={sglangUrl(POOL, 'L374-L410')}>
              memory_pool.py L374-L410
            </Cite>
            . The token-to-KV pool maps that index to the K and V of every layer: for standard
            attention it is one K tensor and one V tensor per layer, each with a row per slot{' '}
            <Cite tier={1} href={sglangUrl(POOL, 'L2518-L2584')}>
              memory_pool.py L2518-L2584
            </Cite>
            .
          </Box>
          <Box variant="p">
            At page size 1 a slot holds one token. With a larger page, keys are cut to whole pages
            before match and insert, so the page size is the tree&apos;s reuse unit and a
            prompt&apos;s trailing partial page is recomputed next time{' '}
            <Cite tier={1} href={sglangUrl(RC, 'L147-L151')}>
              radix_cache.py L147-L151
            </Cite>
            . <code>--page-size</code> defaults to 1 and the attention backend can raise it{' '}
            <Cite tier={1} href={sglangUrl('python/sglang/srt/arg_groups/overrides.py', 'L1304-L1326')}>
              overrides.py L1304-L1326
            </Cite>
            . By our reading of the default chain, a Llama-style model with speculative decoding
            off reuses to the exact token on H100 and in 64-token steps on B200{' '}
            <Cite
              tier={1}
              href={sglangUrl('python/sglang/srt/arg_groups/model_override_base.py', 'L268-L341')}
              kind="code"
            >
              model_override_base.py L268-L341
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl('python/sglang/srt/arg_groups/overrides.py', 'L1125-L1137')} kind="code">
              overrides.py L1125-L1137
            </Cite>
            . Section 6 (KV Memory and the Defaults Your GPU Picks) and section 8 (Attention
            Backends and Kernels) cover that choice.
          </Box>
          <Box variant="p">
            The tree sits on top of both tables. Each node is a compressed edge: a variable-length
            run of token ids, the KV slot indices for those tokens, a lock count, access metadata
            and lazily computed page hashes{' '}
            <Cite tier={1} href={sglangUrl(RC, 'L250-L278')}>
              radix_cache.py L250-L278
            </Cite>
            . A node holds slot indices; the K and V bytes stay in the GPU pool. Lookup descends
            one child per step, keyed by the first page of the remaining tokens, and a match that
            ends inside an edge splits the node so the shared part becomes a node of its own{' '}
            <Cite tier={1} href={sglangUrl(RC, 'L651-L700')}>
              radix_cache.py L651-L700
            </Cite>
            .
          </Box>
          <Box variant="p">
            Nothing evicts in the background. A finished request&apos;s KV stays in the pool until
            an extend or decode allocation finds too few free slots, and the allocator then evicts
            just the shortfall{' '}
            <Cite tier={1} href={sglangUrl('python/sglang/srt/mem_cache/allocator/base.py', 'L144-L158')}>
              allocator/base.py L144-L158
            </Cite>
            . On a busy server the pool therefore stays nearly full of reusable prefixes, and free
            capacity means available plus evictable. The usage gauge is built on the same split:{' '}
            <code>sglang:token_usage</code> counts only slots held by running or locked requests,
            and cached KV that nothing references counts as free{' '}
            <Cite
              tier={1}
              href={sglangUrl('python/sglang/srt/managers/scheduler_components/pool_stats_observer.py', 'L235-L245')}
              kind="code"
            >
              pool_stats_observer.py L235-L245
            </Cite>
            . <strong>A pool full of reusable prefixes reads as low token usage.</strong>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Predict which prefixes survive memory pressure: whatever a running request holds stays, and eviction takes whole idle leaves only when an allocation is short"
          >
            What stays resident and what gets evicted
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Eviction never pulls KV out from under a running request, and a shared system prompt
            stays resident while any request that uses it runs, because admission locks the whole
            path. When the scheduler admits a request it locks the request&apos;s matched node{' '}
            <Cite tier={1} href={sglangUrl(POLICY, 'L1591')}>
              schedule_policy.py L1591
            </Cite>
            , and locking walks from that node to the root, incrementing <code>lock_ref</code> on
            every node of the path{' '}
            <Cite tier={1} href={sglangUrl(RC, 'L582-L616')}>
              radix_cache.py L582-L616
            </Cite>
            . The root is locked permanently{' '}
            <Cite tier={1} href={sglangUrl(RC, 'L348')}>
              radix_cache.py L348
            </Cite>
            . The first lock on a node moves its tokens from the evictable count to the protected
            count, and the lock is released when the request releases its KV{' '}
            <Cite tier={1} href={sglangUrl('python/sglang/srt/mem_cache/common.py', 'L408-L414')}>
              common.py L408-L414
            </Cite>
            .
          </Box>
          <Box variant="p">
            Eviction pops the lowest-ranked leaf with no lock from a heap, frees its whole KV run,
            and pushes the parent onto the heap once the parent is a leaf with no lock of its own{' '}
            <Cite tier={1} href={sglangUrl(RC, 'L552-L580')}>
              radix_cache.py L552-L580
            </Cite>
            . The tree that serves a dense model, the FULL component of{' '}
            <code>UnifiedRadixCache</code>, runs the same loop{' '}
            <Cite
              tier={1}
              href={sglangUrl('python/sglang/srt/mem_cache/unified_cache/components/full.py', 'L205-L239')}
            >
              components/full.py L205-L239
            </Cite>
            . Because a victim is freed in full and eviction stops only once the freed total covers
            the shortfall, one eviction can free far more than was asked: a 4,000-token
            conversation tail can go to fund a 100-token allocation.
          </Box>

          <RadixLocksDiagram />
          <Box variant="small" color="text-body-secondary">
            Illustrative, not measured. User A&apos;s running request holds both of user A&apos;s
            nodes and the system prompt; user C&apos;s holds user C&apos;s node and the system
            prompt.
          </Box>

          <Box variant="p">
            KV enters the tree when a prefill chunk completes and when the request finishes, so a
            request still decoding is visible to others only up to its last checkpoint{' '}
            <Cite tier={1} href={sglangUrl('python/sglang/srt/mem_cache/common.py', 'L253-L262')}>
              common.py L253-L262
            </Cite>
            . At finish the prompt and the output become two nodes, the output a leaf below the
            prompt, so the output goes first and the prompt outlives it{' '}
            <Cite tier={1} href={sglangUrl(RC, 'L485-L503')}>
              radix_cache.py L485-L503
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What changes when the index is a tree: the cost of a lookup, the size of an eviction, and how many copies of a shared prefix the pool holds"
          >
            A tree where a vLLM reader expects a hash chain
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Both engines identify a cached prefix by everything before it; the shape of the index
            decides the rest.
          </Box>
          <ul>
            <li>
              <strong>Lookup.</strong> One tree walk returns the longest cached token run{' '}
              <Cite tier={1} href={sglangUrl(RC, 'L651-L760')}>
                radix_cache.py L651-L760
              </Cite>
              ; vLLM computes one hash per full block, each folding in its parent&apos;s hash{' '}
              <Cite tier={1} href={vllmUrl('vllm/v1/core/kv_cache_utils.py', 'L684-L714')}>
                vLLM kv_cache_utils.py L684-L714
              </Cite>
              .
            </li>
            <li>
              <strong>Eviction unit.</strong> A whole leaf, which can be thousands of tokens, so the
              cached set is always a set of reachable prefixes{' '}
              <Cite
                tier={1}
                href={sglangUrl('python/sglang/srt/mem_cache/unified_cache/components/full.py', 'L205-L239')}
              >
                components/full.py L205-L239
              </Cite>
              ; vLLM evicts single blocks from the head of a free queue ordered by release{' '}
              <Cite tier={1} href={vllmUrl('vllm/v1/core/block_pool.py', 'L684-L700')}>
                vLLM block_pool.py L684-L700
              </Cite>
              . Both evict lazily, when an allocation needs room.
            </li>
            <li>
              <strong>Duplicates.</strong> A prefix that two requests compute at once is kept once:
              on insert the tree keeps the copy already cached and returns the newcomer&apos;s
              duplicate slots to the allocator{' '}
              <Cite tier={1} href={sglangUrl(RC, 'L503-L507')}>
                radix_cache.py L503-L507
              </Cite>
              . vLLM keeps both, and a comment in its block pool gives the reason: block IDs must not
              change, so block tables stay append-only{' '}
              <Cite tier={1} href={vllmUrl('vllm/v1/core/block_pool.py', 'L48-L52')}>
                vLLM block_pool.py L48-L52
              </Cite>
              .
            </li>
            <li>
              <strong>A hash chain as well.</strong> Each page&apos;s storage key is SHA-256 (Secure
              Hash Algorithm, 256-bit) over the previous page&apos;s digest and this page&apos;s
              token ids, seeded by the request&apos;s namespace when it has one{' '}
              <Cite tier={1} href={sglangUrl('python/sglang/srt/mem_cache/utils.py', 'L125-L175')}>
                mem_cache/utils.py L125-L175
              </Cite>
              . The tree serves local lookups; the hashes name pages identically on every instance,
              for the storage tier of HiCache (hierarchical cache, section 7) and for routers that
              consume KV events.
            </li>
          </ul>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Why a cache hit costs the same on a small model and a large one: slot indices move and KV bytes stay put"
          >
            A hit is an index copy
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            On a hit, the scheduler writes the matched path&apos;s slot indices into the first
            positions of the new request&apos;s <code>req_to_token</code> row, and the slots it
            allocates for the uncached tail after them{' '}
            <Cite tier={1} href={sglangUrl('python/sglang/srt/mem_cache/allocation.py', 'L55-L104')} kind="code">
              allocation.py L55-L104
            </Cite>
            . No K or V bytes move. Our reading of the code: the copy is the same size whatever the
            model&apos;s layer count or hidden size, because every layer&apos;s K and V buffers are
            addressed through the same slot indices. By the same reading, a hit is a table update
            in any paged-KV engine, vLLM&apos;s block tables included; the engines differ in the
            index above the table.
          </Box>

          <HitIndexCopyDiagram />
          <Box variant="small" color="text-body-secondary">
            Illustrative, not measured. Slot numbers are arbitrary; a real row holds one entry per
            token position up to the context length.
          </Box>

          <ExpandableSection headerText="Where the names point in the code">
            <Box variant="p">
              <code>RadixAttention</code> is the
              attention layer every model calls; it dispatches to an attention backend and holds no
              tree logic{' '}
              <Cite tier={1} href={sglangUrl('python/sglang/srt/layers/radix_attention.py', 'L98-L101')}>
                radix_attention.py L98-L101
              </Cite>{' '}
              <Cite tier={1} href={sglangUrl('python/sglang/srt/layers/radix_attention.py', 'L294-L302')}>
                radix_attention.py L294-L302
              </Cite>
              . The prefix cache is a separate object; for a standard model at v0.5.22 it is{' '}
              <code>UnifiedRadixCache</code>{' '}
              <Cite tier={1} href={sglangUrl('python/sglang/srt/mem_cache/registry.py', 'L83-L146')}>
                registry.py L83-L146
              </Cite>
              , whose match, insert, lock and eviction walks run on a Rust tree core by default{' '}
              <Cite tier={1} href={sglangUrl('python/sglang/srt/environ.py', 'L688')}>
                environ.py L688
              </Cite>
              . The startup log line{' '}
              <code>Tree cache initialized: source=default impl=UnifiedRadixCache</code> confirms which
              cache class you got{' '}
              <Cite tier={1} href={sglangUrl('python/sglang/srt/mem_cache/registry.py', 'L297-L306')}>
                registry.py L297-L306
              </Cite>
              ; a cache turned off with <code>--disable-radix-cache</code> is the same class and
              prints the same line{' '}
              <Cite tier={1} href={sglangUrl('python/sglang/srt/mem_cache/registry.py', 'L91-L99')} kind="code">
                registry.py L91-L99
              </Cite>
              . The <code>radix_cache.py</code> lines cited here are the readable Python form of the
              same walks.
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="When reordering the waiting queue by the tree helps, when it switches itself off, and how to test it on your own traffic"
          >
            Queue order: arrival by default, prefix match on request
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The waiting queue is first-come-first-served (FCFS) by default{' '}
            <Cite tier={1} href={sglangUrl('python/sglang/srt/arg_groups/fields/schedule.py', 'L82-L98')}>
              schedule.py L82-L98
            </Cite>
            . Under FCFS with LRU (least recently used) eviction, the scheduler protects queued
            work&apos;s cached prefixes without reordering by them: every 32 scheduling passes it
            re-touches the prefixes of up to 128 queued requests, the queue head last, so LRU evicts
            in reverse admission order and a request near the front keeps its prefix while it waits{' '}
            <Cite tier={1} href={sglangUrl(POLICY, 'L278-L298')}>
              schedule_policy.py L278-L298
            </Cite>
            . Decode servers in PD disaggregation skip this refresh.
          </Box>
          <Box variant="p">
            <code>--schedule-policy lpm</code> (longest prefix match) sorts the queue by matched
            prefix length each round. SGLang&apos;s tuning guide suggests trying it for workloads
            with many shared prefixes, at some scheduling overhead{' '}
            <Cite tier={1} href={sglangDocsSrcUrl('advanced_features/hyperparameter_tuning', 'L82')}>
              SGLang docs: hyperparameter tuning (v0.5.22 source)
            </Cite>
            . It falls back to FCFS for any round in which more than 128 requests wait, to bound
            matching cost{' '}
            <Cite tier={1} href={sglangUrl(POLICY, 'L300-L311')}>
              schedule_policy.py L300-L311
            </Cite>
            , so it stops reordering when the queue is deepest.
          </Box>
          <ExpandableSection headerText="The other cache-aware queue policies">
            <Box variant="p">
              The other cache-aware policies are <code>dfs-weight</code> (siblings that share a
              prefix run together), <code>hrrn</code> (highest response ratio next, which also falls
              back above 128) and the experimental <code>shortest-prefill-first</code>{' '}
              <Cite tier={1} href={sglangUrl(POLICY, 'L168-L276')}>
                schedule_policy.py L168-L276
              </Cite>
              . With the radix cache disabled, <code>lpm</code>, <code>dfs-weight</code> and{' '}
              <code>hrrn</code> run as FCFS and <code>shortest-prefill-first</code> refuses to start{' '}
              <Cite tier={1} href={sglangUrl(POLICY, 'L320-L340')}>
                schedule_policy.py L320-L340
              </Cite>
              .
            </Box>
          </ExpandableSection>
          <Box variant="p">
            For shared-prefix traffic whose queue stays under 128, test{' '}
            <code>--schedule-policy lpm</code> and compare <code>#cached-token</code> with{' '}
            <code>#new-token</code> in the prefill log lines before and after{' '}
            <Cite
              tier={1}
              href={sglangUrl('python/sglang/srt/managers/scheduler_components/metrics_reporter.py', 'L730-L760')}
            >
              metrics_reporter.py L730-L760
            </Cite>
            . No measurement of its effect was located during this research, so your own comparison
            is the evidence.
          </Box>
          <ExpandableSection headerText="The 2024 paper, its numbers, and when lpm was the default">
            <SpaceBetween size="s">
              <Box variant="p">
                The SGLang paper, &quot;SGLang: Efficient Execution of Structured Language Model
                Programs&quot; (Zheng et al., arXiv 2312.07104v2, June 2024){' '}
                <Cite tier={3} href="https://arxiv.org/abs/2312.07104v2">
                  arXiv 2312.07104v2
                </Cite>
                , introduced RadixAttention: a radix tree that maps token sequences to their KV,
                one token per page, the tree held on the CPU, LRU eviction of leaves, and a
                reference counter per node that blocks eviction while running requests use it{' '}
                <Cite tier={3} href={ARXIV}>
                  arXiv 2312.07104v2, section 3
                </Cite>
                . Those survive at v0.5.22 as the page-size-1 case, the eviction heap and{' '}
                <code>lock_ref</code>. Its cache-aware scheduling survives as <code>lpm</code>, the
                runtime default through v0.4.3.post2{' '}
                <Cite tier={1} href="https://github.com/sgl-project/sglang/blob/v0.4.3.post2/python/sglang/srt/server_args.py#L70">
                  v0.4.3.post2 server_args.py L70
                </Cite>{' '}
                and gave way to <code>fcfs</code> in v0.4.3.post3{' '}
                <Cite tier={1} href="https://github.com/sgl-project/sglang/blob/v0.4.3.post3/python/sglang/srt/server_args.py#L71">
                  v0.4.3.post3 server_args.py L71
                </Cite>
                . A benchmark that pits SGLang&apos;s longest-prefix ordering against vLLM is
                measuring a non-default SGLang mode.
              </Box>
              <Box variant="p">
                Paper claims, not measurements by this dive: up to 6.4x higher throughput and up to
                3.7x lower latency, mostly on AWS EC2 G5 instances (NVIDIA A10G 24 GB) with some A100
                80 GB runs, against Guidance v0.1.8, vLLM v0.2.5 and LMQL v0.7.3. The paper reports
                cache hit rates of 50% to 99% on its benchmarks, and 52.4% (LLaVA-Next-34B) and 74.1%
                (Vicuna-33B) over one month of Chatbot Arena traffic, a sense of the reuse real chat
                traffic offers{' '}
                <Cite tier={3} href={ARXIV}>
                  arXiv 2312.07104v2, abstract and section 6.2 (paper claim)
                </Cite>
                . The LMSYS (Large Model Systems Organization) launch blog reports up to 5 times
                higher throughput than Guidance and vLLM on A10G GPUs{' '}
                <Cite tier={2} href={LMSYS_2024}>
                  LMSYS blog, 2024-01-17 (project claim)
                </Cite>
                .
              </Box>
              <Box variant="p">
                The vLLM baseline in those comparisons is v0.2.5, which had no prefix cache; the
                paper says it chose that version because later vLLM releases had partially
                integrated RadixAttention. vLLM v0.31.0 caches prefixes by default{' '}
                <Cite tier={1} href={vllmUrl('vllm/config/cache.py', 'L142')}>
                  vLLM cache.py L142
                </Cite>{' '}
                (<Link href="../vllm/">vLLM dive, section 6: Automatic Prefix Caching</Link>), so the
                2024 numbers say nothing about the gap between the engines today.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Choose which idle prefixes go first when memory is short; every policy orders leaves with no lock, and none of them pins KV"
          >
            Eviction policy: one flag, five orderings
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <code>--radix-eviction-policy</code> defaults to <code>lru</code>{' '}
            <Cite tier={1} href={sglangUrl(MEMFLAGS, 'L25-L42')}>
              memory.py L25-L42
            </Cite>
            . Each policy is a sort key over evictable leaves, lowest first, so a policy decides
            the order of eviction and never protects KV from it{' '}
            <Cite tier={1} href={sglangUrl('python/sglang/srt/mem_cache/evict_policy.py', 'L16-L100')}>
              evict_policy.py L16-L100
            </Cite>
            . The table follows the eviction-policy guide{' '}
            <Cite tier={1} href={sglangDocsSrcUrl('advanced_features/radix_eviction_policy', 'L19-L32')}>
              SGLang docs: radix eviction policy (v0.5.22 source)
            </Cite>
            ; <code>lfu</code> is least frequently used, <code>slru</code> segmented LRU and{' '}
            <code>tlru</code> tail-optimized LRU, where TTFT is time to first token.
          </Box>
          <Table
            variant="embedded"
            wrapLines
            columnDefinitions={[
              { id: 'policy', header: 'Policy', cell: (r: PolicyRow) => <code>{r.policy}</code> },
              { id: 'first', header: 'Evicts first', cell: (r: PolicyRow) => r.first },
              { id: 'when', header: 'Use when', cell: (r: PolicyRow) => r.when },
            ]}
            items={policyRows}
          />
          <Box variant="p">
            A profiled Qwen3-VL path on large Hopper GPUs switches the default to{' '}
            <code>priority</code> unless you pass the flag yourself{' '}
            <Cite
              tier={1}
              href={sglangUrl('python/sglang/srt/arg_groups/model_overrides/qwen3_vl.py', 'L122-L126')}
            >
              qwen3_vl.py L122-L126
            </Cite>
            . The server-arguments reference lists four choices{' '}
            <Cite
              tier={1}
              href={sglangDocsSrcUrl('advanced_features/server_arguments', 'L559-L564')}
              kind="doc-code-conflict"
            >
              SGLang docs: server arguments (v0.5.22 source)
            </Cite>
            , while v0.5.22&apos;s code also accepts <code>tlru</code>{' '}
            <Cite tier={1} href={sglangUrl('python/sglang/srt/arg_groups/choices.py', 'L187')}>
              choices.py L187
            </Cite>
            , so trust the eviction-policy guide over that table.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Which series shows the cache working, which one looks like it is not, and the flags to change after reading them"
          >
            Read the gauges first, then the knobs
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Prometheus metrics are off by default; start the server with{' '}
            <code>--enable-metrics</code> to mount <code>/metrics</code>{' '}
            <Cite tier={1} href={sglangUrl('python/sglang/srt/entrypoints/http_server.py', 'L301-L304')}>
              http_server.py L301-L304
            </Cite>
            . Then read three series.
          </Box>
          <ul>
            <li>
              <strong>Pressure: <code>sglang:token_usage</code>.</strong> It is the share of KV
              slots held by running or locked requests{' '}
              <Cite tier={1} href={sglangUrl(METRICS, 'L396-L400')}>
                metrics_collector.py L396-L400
              </Cite>
              . Evictable cache counts as free, so a pool full of reusable prefixes reads as low
              usage: on a busy server, a low reading is the cache doing its job.
            </li>
            <li>
              <strong>Reuse: the cached share of prompt tokens.</strong> Use{' '}
              <code>sum(rate(sglang:cached_tokens_total[5m])) / sum(rate(sglang:prompt_tokens_total[5m]))</code>
              . The two counters carry different labels (<code>cache_source</code> and{' '}
              <code>is_streaming</code>), so sum each side before dividing{' '}
              <Cite tier={1} href={sglangUrl(METRICS, 'L2027-L2069')} kind="code">
                metrics_collector.py L2027-L2069
              </Cite>
              . The <code>sglang:cache_hit_rate</code> gauge holds only the most recent prefill
              batch&apos;s ratio, so it jumps from batch to batch{' '}
              <Cite
                tier={1}
                href={sglangUrl('python/sglang/srt/managers/scheduler_components/metrics_reporter.py', 'L803-L842')}
              >
                metrics_reporter.py L803-L842
              </Cite>
              .
            </li>
            <li>
              <strong>Eviction: <code>sglang:evicted_tokens_total</code>.</strong> It counts device
              slots freed by eviction{' '}
              <Cite tier={1} href={sglangUrl(METRICS, 'L2467-L2474')}>
                metrics_collector.py L2467-L2474
              </Cite>
              , and moves only when an allocation is short. Our reading: since whole leaves go at
              once, one step can far exceed the shortfall that caused it, and a rising eviction rate
              beside a falling cached share means the reusable working set no longer fits.
            </li>
          </ul>
          <Table
            variant="embedded"
            wrapLines
            header={<Header variant="h3">The knobs this section explains</Header>}
            columnDefinitions={[
              { id: 'flag', header: 'Flag', cell: (r: KnobRow) => <code>{r.flag}</code> },
              { id: 'def', header: 'Default at v0.5.22', cell: (r: KnobRow) => r.def },
              { id: 'effect', header: 'What it changes', cell: (r: KnobRow) => r.effect },
              { id: 'src', header: 'Source', cell: (r: KnobRow) => r.src },
            ]}
            items={knobRows}
          />
          <Box variant="p">
            <strong>Where to start:</strong> run with <code>--enable-metrics</code>, read{' '}
            <code>sglang:token_usage</code> as pressure and the counter ratio as reuse, and check{' '}
            <code>#cached-token</code> against <code>#new-token</code> in the prefill log. If
            shared-prefix traffic keeps its queue under 128, rerun it with{' '}
            <code>--schedule-policy lpm</code> and compare the same two fields. Change{' '}
            <code>--radix-eviction-policy</code> only when the policy table names your workload.
          </Box>
          <Box variant="p">
            <strong>Against vLLM:</strong> both engines identify a prefix by everything before it.
            SGLang&apos;s tree evicts whole leaves and frees duplicate KV on insert, where
            vLLM&apos;s hash chain evicts block by block in release order and keeps duplicates. For a
            dense Llama-style model at defaults, SGLang reuses to the token on H100, where vLLM
            reuses to the last full 16-token block{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/cache.py', 'L71')}>
              vLLM cache.py L71
            </Cite>
            , and SGLang reuses more coarsely than vLLM on B200, in 64-token pages. SGLang&apos;s
            eviction policy is one flag, where the vLLM dive documents LRU only (
            <Link href="../vllm/">vLLM dive, section 6: Automatic Prefix Caching</Link>).
          </Box>
        </SpaceBetween>
      </Container>

      <ExpandableSection
        variant="container"
        headerText="Design intent: programs as cache hints"
        headerDescription="How the frontend language turns a program's structure into radix-tree branches, and when it is still the right tool"
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The SGLang paper presents the project as two halves: a Python-embedded language for
            programs that make several LLM (large language model) calls, and a runtime that executes
            them{' '}
            <Cite tier={3} href={ARXIV}>
              arXiv 2312.07104v2, sections 1 and 2
            </Cite>
            . A program is a Python function decorated with <code>@sgl.function</code> that appends
            to a state <code>s</code>: <code>{'s += "text"'}</code>,{' '}
            <code>{'s += sgl.gen("name")'}</code>,{' '}
            <code>{'s += sgl.select("name", choices=[...])'}</code>, and parallel branches through{' '}
            <code>forks = s.fork(n)</code> and <code>forks.join()</code>{' '}
            <Cite tier={1} href={sglangUrl('python/sglang/lang/api.py', 'L23-L292')}>
              lang/api.py L23-L292
            </Cite>
            . The language is a client of the native <code>/generate</code> endpoint: every{' '}
            <code>gen</code> posts the full text so far, and reuse is the server&apos;s radix cache
            matching the resent prefix{' '}
            <Cite tier={1} href={sglangUrl(RUNTIME_EP, 'L157-L194')}>
              runtime_endpoint.py L157-L194
            </Cite>
            .
          </Box>
          <Box variant="p">
            <code>s.fork(3)</code> first sends the parent&apos;s text as a <code>/generate</code>{' '}
            request with <code>max_new_tokens: 0</code>, waits for it, then starts three child states
            that each carry the full parent text{' '}
            <Cite tier={1} href={sglangUrl(INTERP, 'L370-L402')}>
              interpreter.py L370-L402
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(RUNTIME_EP, 'L107-L116')}>
              runtime_endpoint.py L107-L116
            </Cite>
            . The server prefills that request, finishes it at zero output tokens and inserts its
            KV into the tree{' '}
            <Cite tier={1} href={sglangUrl('python/sglang/srt/managers/schedule_batch.py', 'L1447-L1453')}>
              schedule_batch.py L1447-L1453
            </Cite>
            . Each child&apos;s next <code>gen</code> resends the parent text plus its own suffix,
            matches the parent node and adds one leaf: the fork in the program becomes a branch point
            in the tree. With a page size above 1 (64 on B200), only whole pages of the shared prefix
            are reused{' '}
            <Cite tier={1} href={sglangUrl(RC, 'L147-L151')}>
              radix_cache.py L147-L151
            </Cite>
            . <code>join()</code> copies each child&apos;s new variables back to the parent as lists
            and leaves the parent&apos;s text as it was before the fork{' '}
            <Cite tier={1} href={sglangUrl(INTERP, 'L1052-L1076')}>
              interpreter.py L1052-L1076
            </Cite>
            .
          </Box>

          <ForkOntoTreeDiagram />
          <Box variant="small" color="text-body-secondary">
            Illustrative, not measured. The tree side shows only the nodes this program creates.
          </Box>

          <Box variant="p">
            <code>select</code> generates nothing. It caches the prompt with a zero-token request,
            then scores every prompt-plus-choice string in one batched zero-token{' '}
            <code>/generate</code> with input logprobs on, and rejects a temperature above 1e-5{' '}
            <Cite tier={1} href={sglangUrl(RUNTIME_EP, 'L246-L313')}>
              runtime_endpoint.py L246-L313
            </Cite>
            . The default rule, one of three, picks the highest mean logprob per token{' '}
            <Cite tier={1} href={sglangUrl('python/sglang/lang/choices.py', 'L31-L160')}>
              lang/choices.py L31-L160
            </Cite>
            , which the docs warn can favour a long choice whose later tokens are easy to predict{' '}
            <Cite tier={1} href={sglangDocsSrcUrl('references/frontend/choices_methods', 'L31')}>
              SGLang docs: choices methods (v0.5.22 source)
            </Cite>
            . <code>run_batch</code> traces the program and, when the constant text before the
            first argument exceeds 64 characters, sends it once as a zero-token request, so a shared
            few-shot header is cached before the batch arrives{' '}
            <Cite tier={1} href={sglangUrl(INTERP, 'L93-L107')}>
              interpreter.py L93-L107
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(INTERP, 'L240-L247')}>
              interpreter.py L240-L247
            </Cite>
            .
          </Box>
          <Box variant="p">
            The language frontend is deprecated and no longer actively maintained{' '}
            <Cite tier={1} href={sglangUrl('python/sglang/README.md', 'L8')}>
              python/sglang/README.md L8
            </Cite>
            , and its history matches: the 15 most recent commits to{' '}
            <code>python/sglang/lang</code> at the tag, April to September 2026, are mostly
            repository-wide refactor, lint and docs sweeps; the rest add one hosted backend, a Gemma
            4 chat template and a streaming-logprobs change, and its interpreter last gained a
            feature in October 2025{' '}
            <Cite tier={1} href="https://github.com/sgl-project/sglang/commits/v0.5.22/python/sglang/lang">
              commit history of python/sglang/lang at v0.5.22
            </Cite>
            . The docs place it under References, and the quickstart&apos;s first request is an
            OpenAI chat completion{' '}
            <Cite tier={1} href={sglangUrl('docs/docs.json', 'L1047-L1082')}>
              docs.json L1047-L1082
            </Cite>{' '}
            <Cite tier={1} href={sglangDocsSrcUrl('get-started/quickstart', 'L50-L55')}>
              SGLang docs: quickstart (v0.5.22 source)
            </Cite>
            . Its own feature tests live in <code>test/manual/</code>, outside CI (continuous
            integration){' '}
            <Cite tier={1} href={sglangUrl('test/README.md', 'L15')}>
              test/README.md L15
            </Cite>
            . On that evidence it is no longer the main way people use SGLang; the server and its
            APIs are (section 12, Talking to SGLang).
          </Box>
          <Box variant="p">
            Our reading of the same evidence: the language still fits multi-call programs that
            branch and score against an SGLang server, such as a fork over candidate continuations
            followed by a <code>select</code>, and few-shot batch runs that share a long header.
            If you keep it, point it at an SGLang server, because there the program tells the
            cache what it will share before it shares it. A hosted API loses that: the OpenAI
            backend keeps the base
            class&apos;s empty prefix-hint methods{' '}
            <Cite tier={1} href={sglangUrl('python/sglang/lang/backend/base_backend.py', 'L20-L36')} kind="code">
              lang/backend/base_backend.py L20-L36
            </Cite>
            , and its <code>select</code> raises on chat models{' '}
            <Cite tier={1} href={sglangUrl('python/sglang/lang/backend/openai.py', 'L312-L325')}>
              lang/backend/openai.py L312-L325
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </ExpandableSection>
    </SpaceBetween>
  );
}
