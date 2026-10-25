import type { ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Table from '@cloudscape-design/components/table';
import Link from '@cloudscape-design/components/link';
import { Cite, sglangUrl, sglangDocsSrcUrl } from '../components/Cite';

const GM = 'python/sglang/srt/constrained/grammar_manager.py';
const BASE = 'python/sglang/srt/constrained/base_grammar_backend.py';
const XG = 'python/sglang/srt/constrained/xgrammar_backend.py';
const OUTLINES = 'python/sglang/srt/constrained/outlines_backend.py';
const LLG = 'python/sglang/srt/constrained/llguidance_backend.py';
const REASONER = 'python/sglang/srt/constrained/reasoner_grammar_backend.py';
const VALID = 'python/sglang/srt/constrained/json_schema_validation.py';
const SBI = 'python/sglang/srt/sampling/sampling_batch_info.py';
const SP = 'python/sglang/srt/sampling/sampling_params.py';
const TP_WORKER = 'python/sglang/srt/managers/tp_worker.py';
const RUNNER = 'python/sglang/srt/model_executor/model_runner.py';
const SCHEDULER = 'python/sglang/srt/managers/scheduler.py';
const RESULTS = 'python/sglang/srt/managers/scheduler_components/batch_result_processor.py';
const FLUSH = 'python/sglang/srt/managers/scheduler_components/flush_wrapper.py';
const TOKENIZER = 'python/sglang/srt/managers/tokenizer_manager.py';
const ENVIRON = 'python/sglang/srt/environ.py';
const PROTOCOL = 'python/sglang/srt/entrypoints/openai/protocol.py';
const SERVING_CHAT = 'python/sglang/srt/entrypoints/openai/serving_chat.py';
const SERVING_BASE = 'python/sglang/srt/entrypoints/openai/serving_base.py';
const HTTP_SERVER = 'python/sglang/srt/entrypoints/http_server.py';
const SERVING_FIELDS = 'python/sglang/srt/arg_groups/fields/serving.py';
const SERVING_HOOK = 'python/sglang/srt/arg_groups/serving_hook.py';
const CHOICES = 'python/sglang/srt/arg_groups/choices.py';
const COLLECTOR = 'python/sglang/srt/observability/metrics_collector.py';
const SPEC_UTILS = 'python/sglang/srt/speculative/spec_utils.py';
const PYPROJECT = 'python/pyproject.toml';
const UTILS = 'python/sglang/utils.py';
const LMSYS_FSM = 'https://lmsys.org/blog/2024-02-05-compressed-fsm/';
const ARXIV = 'https://arxiv.org/abs/2312.07104v2';

function vllmUrl(path: string, lines: string): string {
  return `https://github.com/vllm-project/vllm/blob/v0.31.0/${path}#${lines}`;
}

const VLLM_SERVER_LINK = (
  <Link href="../vllm/">vLLM dive, section 12: The OpenAI-Compatible Server</Link>
);

/* ------------------------------------------------------------------------ */
/* Diagram: one constrained decoding step                                   */
/* ------------------------------------------------------------------------ */

function ConstrainedStepDiagram() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 900 380"
        role="img"
        aria-labelledby="structured-step-title"
        style={{ width: '100%', minWidth: 680, height: 'auto' }}
      >
        <title id="structured-step-title">
          One constrained decoding step in SGLang v0.5.22. Each request&apos;s grammar is a state
          machine on the CPU, compiled once per distinct schema string on a thread pool. Before
          every sample the state machine fills its row of a vocabulary bitmask, one bit per token
          and 32 tokens per int32 word, in a pinned host buffer. The buffer is copied to the GPU,
          where penalties, then the mask, then logit_bias are applied to the logits that the
          forward pass computed, so forbidden tokens sit at minus infinity, and one token is
          sampled. The sampled token returns to the CPU and advances the state machine. With the
          overlap scheduler on, the forward pass runs a step ahead and only sampling waits for the
          CPU. A schema that fails to compile, or is still compiling after 10,000 polls, ends the
          request with HTTP 400 and is cached as failed.
        </title>
        <style>{`
          .structured-step-band-cpu { fill: #f7f4fc; stroke: #d5c8ef; stroke-width: 1; }
          .structured-step-band-gpu { fill: #f2f8fd; stroke: #b8d4f0; stroke-width: 1; }
          .structured-step-band-t { fill: #414d5c; font: 600 12px sans-serif; }
          .structured-step-cpu { fill: #ffffff; stroke: #6f4cc4; stroke-width: 1.5; }
          .structured-step-gpu { fill: #ffffff; stroke: #0972d3; stroke-width: 1.5; }
          .structured-step-fail { fill: #fbf3d5; stroke: #8b6c00; stroke-width: 1.5; }
          .structured-step-t { fill: #16191f; font: 600 13px sans-serif; text-anchor: middle; }
          .structured-step-s { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .structured-step-fs { fill: #5c4800; font: 11px sans-serif; text-anchor: middle; }
          .structured-step-arr { stroke: #5f6b7a; stroke-width: 1.5; fill: none; }
          .structured-step-arr-fail { stroke: #8b6c00; stroke-width: 1.5; fill: none; }
          .structured-step-lbl { fill: #5f6b7a; font: 11px sans-serif; }
        `}</style>
        <defs>
          <marker
            id="structured-step-ah"
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
            id="structured-step-ah-fail"
            markerWidth="8"
            markerHeight="8"
            refX="8"
            refY="4"
            orient="auto-start-reverse"
            markerUnits="userSpaceOnUse"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill="#8b6c00" />
          </marker>
        </defs>

        <rect x={0} y={0} width={900} height={380} rx={8} fill="#ffffff" />

        {/* Bands */}
        <rect x={10} y={10} width={880} height={170} rx={6} className="structured-step-band-cpu" />
        <text x={24} y={32} className="structured-step-band-t">
          CPU, inside each scheduler process
        </text>
        <rect x={220} y={210} width={670} height={160} rx={6} className="structured-step-band-gpu" />
        <text x={234} y={232} className="structured-step-band-t">
          GPU
        </text>

        {/* CPU row */}
        <rect x={24} y={50} width={176} height={100} rx={6} className="structured-step-cpu" />
        <text x={112} y={74} className="structured-step-t">
          New schema
        </text>
        <text x={112} y={94} className="structured-step-s">
          compiled once on a
        </text>
        <text x={112} y={110} className="structured-step-s">
          thread pool, cached
        </text>
        <text x={112} y={126} className="structured-step-s">
          by its exact string
        </text>

        <rect x={240} y={50} width={220} height={100} rx={6} className="structured-step-cpu" />
        <text x={350} y={82} className="structured-step-t">
          Grammar state machine
        </text>
        <text x={350} y={102} className="structured-step-s">
          one matcher per request
        </text>
        <text x={350} y={118} className="structured-step-s">
          advanced by accept_token
        </text>

        <rect x={500} y={50} width={376} height={100} rx={6} className="structured-step-cpu" />
        <text x={688} y={82} className="structured-step-t">
          Fill the vocabulary bitmask
        </text>
        <text x={688} y={102} className="structured-step-s">
          1 bit per token, 32 tokens per int32 word
        </text>
        <text x={688} y={118} className="structured-step-s">
          pinned host buffer; unconstrained rows stay all 1s
        </text>

        {/* GPU row */}
        <rect x={240} y={250} width={220} height={100} rx={6} className="structured-step-gpu" />
        <text x={350} y={278} className="structured-step-t">
          Sample one token
        </text>
        <text x={350} y={298} className="structured-step-s">
          with overlap on, it waits
        </text>
        <text x={350} y={314} className="structured-step-s">
          for the previous accept_token
        </text>

        <rect x={490} y={250} width={210} height={100} rx={6} className="structured-step-gpu" />
        <text x={595} y={274} className="structured-step-t">
          Mask the logits
        </text>
        <text x={595} y={292} className="structured-step-s">
          penalties, then the mask,
        </text>
        <text x={595} y={308} className="structured-step-s">
          then logit_bias;
        </text>
        <text x={595} y={324} className="structured-step-s">
          forbidden: minus infinity
        </text>

        <rect x={730} y={250} width={146} height={100} rx={6} className="structured-step-gpu" />
        <text x={803} y={278} className="structured-step-t">
          Forward pass
        </text>
        <text x={803} y={298} className="structured-step-s">
          computes logits,
        </text>
        <text x={803} y={314} className="structured-step-s">
          runs a step ahead
        </text>

        {/* Failure exit, outside both bands */}
        <rect x={24} y={250} width={176} height={100} rx={6} className="structured-step-fail" />
        <text x={112} y={274} className="structured-step-t">
          Compile fails or
        </text>
        <text x={112} y={294} className="structured-step-fs">
          still runs after 10,000
        </text>
        <text x={112} y={310} className="structured-step-fs">
          polls: HTTP 400, cached
        </text>
        <text x={112} y={326} className="structured-step-fs">
          as failed by its string
        </text>

        {/* Arrows: the loop */}
        <path d="M200,100 L238,100" className="structured-step-arr" markerEnd="url(#structured-step-ah)" />
        <path d="M460,100 L498,100" className="structured-step-arr" markerEnd="url(#structured-step-ah)" />
        <path d="M595,150 L595,248" className="structured-step-arr" markerEnd="url(#structured-step-ah)" />
        <text x={605} y={200} className="structured-step-lbl">
          non-blocking copy to the GPU
        </text>
        <path d="M730,300 L702,300" className="structured-step-arr" markerEnd="url(#structured-step-ah)" />
        <path d="M490,300 L462,300" className="structured-step-arr" markerEnd="url(#structured-step-ah)" />
        <path d="M350,250 L350,152" className="structured-step-arr" markerEnd="url(#structured-step-ah)" />
        <text x={340} y={200} className="structured-step-lbl" textAnchor="end">
          token returns to the matcher
        </text>
        <path
          d="M112,150 L112,248"
          className="structured-step-arr-fail"
          markerEnd="url(#structured-step-ah-fail)"
        />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Tables                                                                   */
/* ------------------------------------------------------------------------ */

interface RejectRow {
  id: string;
  send: ReactNode;
  result: ReactNode;
  fix: ReactNode;
  src: ReactNode;
}

const REJECT_ROWS: RejectRow[] = [
  {
    id: 'keywords',
    send: (
      <>
        A JSON schema with <code>if</code>/<code>then</code>/<code>else</code>, <code>not</code>,{' '}
        <code>multipleOf</code>, <code>uniqueItems</code>, <code>contains</code>,{' '}
        <code>minContains</code>, <code>maxContains</code>, <code>dependentRequired</code> or{' '}
        <code>dependentSchemas</code>
      </>
    ),
    result: (
      <>
        400: <code>JSON Schema at &lt;pointer&gt; is not supported by xgrammar: keyword(s) ... would
        be ignored</code>
      </>
    ),
    fix: (
      <>
        Drop or rewrite the keyword and check it after generation, or send the schema to a server
        launched with <code>--grammar-backend llguidance</code>
      </>
    ),
    src: (
      <Cite tier={1} href={sglangUrl(VALID, 'L32-L46')} kind="code">
        json_schema_validation.py L32-L46
      </Cite>
    ),
  },
  {
    id: 'format',
    send: (
      <>
        A string <code>format</code> outside XGrammar&apos;s list: <code>date</code>,{' '}
        <code>date-time</code>, <code>duration</code>, <code>email</code>, <code>hostname</code>,{' '}
        <code>ipv4</code>, <code>ipv6</code>, <code>json-pointer</code>,{' '}
        <code>relative-json-pointer</code>, <code>time</code>, <code>uri</code>,{' '}
        <code>uri-reference</code>, <code>uri-template</code>, <code>uuid</code>
      </>
    ),
    result: (
      <>
        400: <code>string format ... is not implemented</code>
      </>
    ),
    fix: <>Use a listed format, or a <code>pattern</code> in its place</>,
    src: (
      <Cite tier={1} href={sglangUrl(VALID, 'L47-L64')} kind="code">
        json_schema_validation.py L47-L64
      </Cite>
    ),
  },
  {
    id: 'groups',
    send: (
      <>
        One string field with two of <code>format</code>, <code>pattern</code> and a{' '}
        <code>minLength</code>/<code>maxLength</code> bound
      </>
    ),
    result: (
      <>
        400: <code>constraints ... cannot be enforced together</code>
      </>
    ),
    fix: <>Keep one of the three on each string field</>,
    src: (
      <Cite tier={1} href={sglangUrl(VALID, 'L147-L201')} kind="code">
        json_schema_validation.py L147-L201
      </Cite>
    ),
  },
  {
    id: 'compile',
    send: <>A schema, regex or EBNF that does not compile</>,
    result: (
      <>
        Ends before any token. OpenAI non-streaming calls get 400 with{' '}
        <code>Failed to compile json grammar: &lt;compiler error&gt;</code>; streaming calls get one
        error event with code 400 and the same message, and the stream ends
      </>
    ),
    fix: <>Fix the spec. The failure is cached, so the same string fails at once next time</>,
    src: (
      <>
        <Cite tier={1} href={sglangUrl(GM, 'L288-L310')} kind="code">
          grammar_manager.py L288-L310
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(TOKENIZER, 'L1891-L1921')} kind="code">
          tokenizer_manager.py L1891-L1921
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(SERVING_BASE, 'L116-L121')} kind="code">
          serving_base.py L116-L121
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(SERVING_CHAT, 'L2085-L2102')} kind="code">
          serving_chat.py L2085-L2102
        </Cite>
      </>
    ),
  },
  {
    id: 'outlines',
    send: (
      <>
        EBNF or a structural tag on a server launched with <code>--grammar-backend outlines</code>
      </>
    ),
    result: (
      <>
        400: <code>Failed to compile ebnf grammar: Unknown grammar error</code>, with{' '}
        <code>structural_tag</code> in place of <code>ebnf</code> for a structural tag
      </>
    ),
    fix: <>Outlines takes JSON schema and regex only; use XGrammar or llguidance</>,
    src: (
      <>
        <Cite tier={1} href={sglangUrl(OUTLINES, 'L163-L167')} kind="code">
          outlines_backend.py L163-L167
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(BASE, 'L188-L256')} kind="code">
          base_grammar_backend.py L188-L256
        </Cite>
      </>
    ),
  },
  {
    id: 'none',
    send: (
      <>
        Any constraint, on a server with <code>--grammar-backend none</code>, with{' '}
        <code>--skip-tokenizer-init</code>, or whose tokenizer XGrammar refused at startup
      </>
    ),
    result: (
      <>
        400 with the same message in all three cases: grammar-based generation is not supported
        when the server is launched with <code>--grammar-backend none</code>
      </>
    ),
    fix: (
      <>
        Search the startup log for <code>Grammar backend disabled because tokenizer is not
        supported by XGrammar</code> before trusting JSON mode on an unusual tokenizer
      </>
    ),
    src: (
      <>
        <Cite tier={1} href={sglangUrl(GM, 'L30-L44')} kind="code">
          grammar_manager.py L30-L44
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(GM, 'L145-L156')} kind="code">
          grammar_manager.py L145-L156
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(BASE, 'L376-L404')} kind="code">
          base_grammar_backend.py L376-L404
        </Cite>
      </>
    ),
  },
  {
    id: 'two',
    send: (
      <>
        Two of <code>json_schema</code>, <code>regex</code>, <code>ebnf</code> and{' '}
        <code>structural_tag</code> in one native request
      </>
    ),
    result: (
      <>
        Rejected before the scheduler:{' '}
        <code>Only one of json_schema, regex, ebnf, or structural_tag can be set.</code>
      </>
    ),
    fix: <>Send one constraint per request</>,
    src: (
      <Cite tier={1} href={sglangUrl(SP, 'L296-L306')}>
        sampling_params.py L296-L306
      </Cite>
    ),
  },
  {
    id: 'tools',
    send: (
      <>
        OpenAI <code>tool_choice: &quot;required&quot;</code> or a named tool, plus{' '}
        <code>response_format</code>, <code>regex</code> or <code>ebnf</code>
      </>
    ),
    result: (
      <>
        400, because the tool call is itself enforced with a grammar and both cannot hold; the
        GLM-4.7 tool parser, which constrains the whole reply, is the exception. With{' '}
        <code>tool_choice: &quot;auto&quot;</code> the output constraint wins, and a warning is
        logged when a tool constraint was set aside
      </>
    ),
    fix: <>Ask for a tool call or a response format, one per request</>,
    src: (
      <>
        <Cite tier={1} href={sglangUrl(PROTOCOL, 'L1191-L1225')} kind="code">
          protocol.py L1191-L1225
        </Cite>{' '}
        <Cite
          tier={1}
          href={sglangUrl('python/sglang/srt/function_call/function_call_parser.py', 'L295-L327')}
          kind="code"
        >
          function_call_parser.py L295-L327
        </Cite>
      </>
    ),
  },
];

interface KnobRow {
  id: string;
  knob: string;
  def: ReactNode;
  effect: ReactNode;
  src: ReactNode;
}

const KNOB_ROWS: KnobRow[] = [
  {
    id: 'backend',
    knob: '--grammar-backend',
    def: (
      <>
        <code>xgrammar</code> (declared <code>None</code>, resolved at startup)
      </>
    ),
    effect: (
      <>
        One backend for every request; <code>outlines</code> lacks EBNF and structural tags,{' '}
        <code>none</code> turns structured output off
      </>
    ),
    src: (
      <Cite tier={1} href={sglangUrl(SERVING_HOOK, 'L232-L237')}>
        serving_hook.py L232-L237
      </Cite>
    ),
  },
  {
    id: 'poll',
    knob: 'SGLANG_GRAMMAR_POLL_INTERVAL',
    def: <>0.005 s</>,
    effect: <>Longest wait for pending compiles each time a prefill batch is built</>,
    src: (
      <Cite tier={1} href={sglangUrl(ENVIRON, 'L399')}>
        environ.py L399
      </Cite>
    ),
  },
  {
    id: 'iters',
    knob: 'SGLANG_GRAMMAR_MAX_POLL_ITERATIONS',
    def: <>10000</>,
    effect: (
      <>
        Compile deadline in polls, at least 50 s; a timeout is cached as a failure until{' '}
        <code>/flush_cache</code> or a restart
      </>
    ),
    src: (
      <Cite tier={1} href={sglangUrl(ENVIRON, 'L400')}>
        environ.py L400
      </Cite>
    ),
  },
  {
    id: 'maxws',
    knob: '--constrained-json-max-whitespace-cnt',
    def: (
      <>
        <code>None</code> (unbounded)
      </>
    ),
    effect: <>Caps each run of whitespace in JSON output; XGrammar only</>,
    src: (
      <Cite tier={1} href={sglangUrl(SERVING_FIELDS, 'L287-L290')}>
        serving.py L287-L290
      </Cite>
    ),
  },
  {
    id: 'compact',
    knob: '--constrained-json-disable-any-whitespace',
    def: <>False</>,
    effect: <>Forces compact JSON; XGrammar and llguidance</>,
    src: (
      <Cite tier={1} href={sglangUrl(SERVING_FIELDS, 'L283-L286')}>
        serving.py L283-L286
      </Cite>
    ),
  },
  {
    id: 'wspattern',
    knob: '--constrained-json-whitespace-pattern',
    def: (
      <>
        <code>None</code>
      </>
    ),
    effect: <>A regex for allowed whitespace; Outlines and llguidance</>,
    src: (
      <Cite tier={1} href={sglangUrl(SERVING_FIELDS, 'L279-L282')}>
        serving.py L279-L282
      </Cite>
    ),
  },
  {
    id: 'reasoning',
    knob: '--reasoning-parser',
    def: (
      <>
        <code>None</code>
      </>
    ),
    effect: <>Leaves the think block unconstrained and starts the schema after it</>,
    src: (
      <Cite tier={1} href={sglangUrl(SERVING_FIELDS, 'L202')}>
        serving.py L202
      </Cite>
    ),
  },
  {
    id: 'strict',
    knob: '--enable-strict-thinking',
    def: <>False</>,
    effect: <>Masks inside the think block too; needs XGrammar</>,
    src: (
      <Cite tier={1} href={sglangUrl(SERVING_FIELDS, 'L217-L220')}>
        serving.py L217-L220
      </Cite>
    ),
  },
];

interface WalkRow {
  id: string;
  where: ReactNode;
  look: ReactNode;
  why: ReactNode;
}

const WALK_ROWS: WalkRow[] = [
  {
    id: 'admit',
    where: (
      <>
        <Cite tier={1} href={sglangUrl(SCHEDULER, 'L3200-L3202')}>
          scheduler.py L3200-L3202
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(GM, 'L145-L201')}>
          grammar_manager.py L145-L201
        </Cite>
      </>
    ),
    look: (
      <>
        <code>process_req_with_grammar</code>: the cache key, a hit against a parked request
      </>
    ),
    why: <>Where a constrained request leaves the path a plain one takes</>,
  },
  {
    id: 'backend',
    where: (
      <>
        <Cite tier={1} href={sglangUrl(BASE, 'L283-L298')}>
          base_grammar_backend.py L283-L298
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(BASE, 'L350-L445')}>
          base_grammar_backend.py L350-L445
        </Cite>
      </>
    ),
    look: <>Thread-pool compile, the plain dict cache, the backend factory and reasoner wrapper</>,
    why: <>The whole backend lifecycle in about 150 lines</>,
  },
  {
    id: 'compile',
    where: (
      <>
        <Cite tier={1} href={sglangUrl(XG, 'L346-L370')}>
          xgrammar_backend.py L346-L370
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(VALID, 'L167-L201')}>
          json_schema_validation.py L167-L201
        </Cite>
      </>
    ),
    look: <>JSON compile, with the keyword and format check that runs first</>,
    why: <>Every schema 400 in the table above starts here</>,
  },
  {
    id: 'poll',
    where: (
      <>
        <Cite tier={1} href={sglangUrl(SCHEDULER, 'L3959-L3963')}>
          scheduler.py L3959-L3963
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(GM, 'L203-L330')}>
          grammar_manager.py L203-L330
        </Cite>
      </>
    ),
    look: (
      <>
        <code>get_ready_grammar_requests</code>: the 5 ms poll, the all-gather across TP ranks, the
        timeout and its cached failure
      </>
    ),
    why: <>A new schema&apos;s wait, and the 10,000-poll deadline</>,
  },
  {
    id: 'mask',
    where: (
      <Cite tier={1} href={sglangUrl(SBI, 'L382-L449')}>
        sampling_batch_info.py L382-L449
      </Cite>
    ),
    look: (
      <>
        <code>update_regex_vocab_mask</code> and <code>apply_logits_bias</code>
      </>
    ),
    why: <>Mask construction, and the penalty, mask, bias order</>,
  },
  {
    id: 'bitmask',
    where: (
      <Cite tier={1} href={sglangUrl(XG, 'L65-L136')}>
        xgrammar_backend.py L65-L136
      </Cite>
    ),
    look: (
      <>
        Pinned int32 bitmask, <code>fill_next_token_bitmask</code>, the non-blocking copy and the
        apply kernel per device
      </>
    ),
    why: <>The default backend&apos;s mask format</>,
  },
  {
    id: 'overlap',
    where: (
      <>
        <Cite tier={1} href={sglangUrl(TP_WORKER, 'L667-L689')}>
          tp_worker.py L667-L689
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(RUNNER, 'L2033-L2059')}>
          model_runner.py L2033-L2059
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(SCHEDULER, 'L2038-L2042')}>
          scheduler.py L2038-L2042
        </Cite>
      </>
    ),
    look: (
      <>
        <code>delay_sample_func</code>, <code>_preprocess_logits</code> and{' '}
        <code>launch_batch_sample_if_needed</code>
      </>
    ),
    why: <>How a grammar keeps the overlap scheduler and delays only the sample</>,
  },
  {
    id: 'reasoner',
    where: (
      <Cite tier={1} href={sglangUrl(REASONER, 'L98-L192')}>
        reasoner_grammar_backend.py L98-L192
      </Cite>
    ),
    look: <>Thinking and generation phases, and the thinking budget</>,
    why: (
      <>
        Why <code>--reasoning-parser</code> decides where the schema starts
      </>
    ),
  },
];

/* ------------------------------------------------------------------------ */
/* The section                                                              */
/* ------------------------------------------------------------------------ */

export function StructuredOutput() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Know what a schema costs, which requests fail with a 400 before the first token, and the compile timeout that caches a failure until you flush (verified against SGLang v0.5.22, commit baa9befa, 2026-10-24)"
          >
            10. Structured Output: one bitmask per token
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Structured output holds a model to a JSON schema, a regular expression, an EBNF
            (Extended Backus-Naur Form) grammar or a structural tag, so a client can parse the
            answer without retrying. The challenge is enforcing that on every generated token at
            decode speed, when each new schema has to be compiled first and each token&apos;s legal
            options depend on the tokens before it.
          </Box>
          <Box variant="p">
            SGLang meets it with one bitmask per token. Each constrained request carries a grammar,
            a state machine on the CPU, that writes a mask over the vocabulary before every sample;
            the GPU pushes the forbidden tokens&apos; logits to minus infinity and samples from what
            is left. Compilation is a one-off cost per distinct schema string, paid off the
            scheduling path, and it has a deadline: a schema still compiling after 10,000 scheduler
            polls is cached as a failure.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Predict where a constrained token spends its time: CPU work to fill the mask, one copy, one GPU kernel, and a sample that waits for the CPU"
          >
            One constrained step
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Every constrained request holds a matcher, the grammar&apos;s current state. Before
            sampling, the batch allocates a packed bitmask in pinned host memory, one bit per
            vocabulary token and 32 tokens per int32 word, with every bit set; each live
            constrained request&apos;s matcher then writes its own row{' '}
            <Cite tier={1} href={sglangUrl(SBI, 'L382-L407')} kind="code">
              sampling_batch_info.py L382-L407
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(XG, 'L65-L74')} kind="code">
              xgrammar_backend.py L65-L74
            </Cite>
            . The buffer goes to the GPU with a non-blocking copy, and a kernel sets every
            disallowed logit to minus infinity{' '}
            <Cite tier={1} href={sglangUrl(XG, 'L122-L136')} kind="code">
              xgrammar_backend.py L122-L136
            </Cite>
            . Rows of unconstrained requests in the same batch keep all bits set, so the two kinds
            share a batch.
          </Box>
          <Box variant="p">
            The mask sits between two other logit transforms: repetition and frequency penalties
            first, then the grammar mask, then <code>logit_bias</code>{' '}
            <Cite tier={1} href={sglangUrl(SBI, 'L426-L449')} kind="code">
              sampling_batch_info.py L426-L449
            </Cite>
            . A positive <code>logit_bias</code> cannot revive a token the grammar forbids, because
            its logit is already minus infinity. After sampling, the scheduler hands the token to
            the matcher with <code>accept_token</code>, which moves the state machine one step{' '}
            <Cite tier={1} href={sglangUrl(RESULTS, 'L722')} kind="code">
              batch_result_processor.py L722
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(RESULTS, 'L859')} kind="code">
              batch_result_processor.py L859
            </Cite>
            .
          </Box>

          <ConstrainedStepDiagram />
          <Box variant="small" color="text-body-secondary">
            Illustrative, not measured. The loop runs once per decode step for every constrained
            request in the batch; box sizes carry no timing. The waiting sample applies with the
            overlap scheduler on and speculative decoding off.
          </Box>

          <Box variant="p">
            The mask for step N+1 depends on the token sampled at step N, which meets the overlap
            scheduler&apos;s one-step lead (section 4, The Scheduler). SGLang keeps the overlap and
            moves only the sample. With overlap on and speculative decoding off, a batch holding
            grammars launches its forward pass early, and its sampling runs only after the CPU has
            processed the previous batch&apos;s result, each grammar&apos;s{' '}
            <code>accept_token</code> included{' '}
            <Cite tier={1} href={sglangUrl(TP_WORKER, 'L667-L689')} kind="code">
              tp_worker.py L667-L689
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(SCHEDULER, 'L2038-L2042')} kind="code">
              scheduler.py L2038-L2042
            </Cite>
            . The mask is built at that moment, on the CPU, one row per constrained request{' '}
            <Cite tier={1} href={sglangUrl(RUNNER, 'L2033-L2059')} kind="code">
              model_runner.py L2033-L2059
            </Cite>
            . Our reading of that loop: the CPU work between two GPU steps grows with the number of
            constrained requests in the batch. With speculative decoding on, the grammar masks each
            node of the draft tree instead{' '}
            <Cite tier={1} href={sglangUrl(SPEC_UTILS, 'L520-L585')} kind="code">
              spec_utils.py L520-L585
            </Cite>
            , which section 11, Speculative Decoding, covers.
          </Box>
          <Box variant="p">
            With speculative decoding off, every constrained token costs one decode step. The
            SGLang paper{' '}
            <Cite tier={3} href={ARXIV}>
              arXiv 2312.07104v2
            </Cite>{' '}
            and a February 2024 LMSYS (Large Model Systems Organization) post describe jump-forward
            decoding over a compressed FSM (finite state machine): where the grammar allows only
            one continuation, the runtime appends the whole forced string in one step. The post
            reports up to 2x lower latency and up to 2.5x higher throughput on Llama-7B on one
            NVIDIA A10, against guidance with llama.cpp and Outlines with vLLM v0.2.7{' '}
            <Cite tier={2} href={LMSYS_FSM}>
              LMSYS blog, 2024-02-05 (project claim)
            </Cite>
            . At v0.5.22 that path is never reached: the grammar classes carry the jump-forward
            interface, nothing in the runtime under <code>python/</code> calls it, the
            Outlines backend never builds its jump-forward map, and no flag turns it on{' '}
            <Cite tier={1} href={sglangUrl(BASE, 'L119-L145')} kind="code">
              base_grammar_backend.py L119-L145
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(OUTLINES, 'L148-L161')} kind="code">
              outlines_backend.py L148-L161
            </Cite>
            . Our reading: size a JSON workload by its full output token count, the keys and braces
            the schema fixes included.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Why the first request with a new schema waits and the next one does not, and how a slow compile becomes a failure that every later request inherits"
          >
            What a new schema costs
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Compilation runs on a thread pool inside each scheduler process, off the scheduling
            path{' '}
            <Cite tier={1} href={sglangUrl(BASE, 'L201-L206')} kind="code">
              base_grammar_backend.py L201-L206
            </Cite>
            . A request whose grammar is not cached is parked in a grammar queue in place of the
            waiting queue{' '}
            <Cite tier={1} href={sglangUrl(SCHEDULER, 'L3200-L3202')} kind="code">
              scheduler.py L3200-L3202
            </Cite>
            . Each time the scheduler builds a prefill batch, it polls the pending compiles for up
            to 5 ms (<code>SGLANG_GRAMMAR_POLL_INTERVAL</code>), and a request moves to the waiting
            queue only once its grammar is ready on every TP (tensor parallelism) rank: ready is
            the intersection across ranks, failed is the union{' '}
            <Cite tier={1} href={sglangUrl(GM, 'L203-L274')} kind="code">
              grammar_manager.py L203-L274
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(ENVIRON, 'L399-L400')} kind="code">
              environ.py L399-L400
            </Cite>
            . A new schema&apos;s compile time therefore lands in its first request&apos;s TTFT
            (time to first token).
          </Box>
          <Box variant="p">
            The result is cached under the constraint type plus the exact spec string, and a later
            request with the same string gets a fresh matcher over the shared compiled grammar{' '}
            <Cite tier={1} href={sglangUrl(GM, 'L158-L195')} kind="code">
              grammar_manager.py L158-L195
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(XG, 'L148-L165')} kind="code">
              xgrammar_backend.py L148-L165
            </Cite>
            . Equivalent schemas with different bytes compile separately, and the OpenAI routes
            turn a schema object into its key with <code>json.dumps</code>, so key order still
            counts{' '}
            <Cite tier={1} href={sglangUrl(UTILS, 'L104-L105')} kind="code">
              utils.py L104-L105
            </Cite>
            . Our reading: build each schema in one place, such as one Pydantic model, so it always
            arrives as the same string. Failed compiles are cached as well, so a bad schema fails at
            once the second time. The cache is a plain dictionary with no eviction: every distinct
            string stays until a flush or a restart{' '}
            <Cite tier={1} href={sglangUrl(BASE, 'L283-L298')} kind="code">
              base_grammar_backend.py L283-L298
            </Cite>
            , so a workload that sends a unique schema per request grows it without ever hitting it
            (its memory cost was not measured in this research).
          </Box>
          <Box variant="p">
            <strong>The deadline.</strong> A request whose grammar is still not ready after 10,000
            polls (<code>SGLANG_GRAMMAR_MAX_POLL_ITERATIONS</code>) is abandoned{' '}
            <Cite tier={1} href={sglangUrl(GM, 'L246-L258')} kind="code">
              grammar_manager.py L246-L258
            </Cite>
            . By arithmetic on the code that is at least 50 seconds (10,000 x 5 ms), and longer
            when forward passes are slow: the code&apos;s own comment puts the real wait at the
            iteration count times the larger of the poll interval and the forward latency. The key
            is cached as a failure with the message{' '}
            <code>Grammar preprocessing timed out</code>, and the request is aborted{' '}
            <Cite tier={1} href={sglangUrl(GM, 'L312-L322')} kind="code">
              grammar_manager.py L312-L322
            </Cite>
            . Every later request with the same schema then hits that cached failure and fails at
            once with a 400, until the cache is flushed or the server restarts{' '}
            <Cite tier={1} href={sglangUrl(GM, 'L177-L189')} kind="code">
              grammar_manager.py L177-L189
            </Cite>
            .
          </Box>
          <Box variant="p">
            <code>/flush_cache</code> clears the grammar cache together with the radix cache and
            the KV (key-value) pools, and it runs only when the server has no running or waiting
            requests{' '}
            <Cite tier={1} href={sglangUrl(SCHEDULER, 'L5348-L5377')} kind="code">
              scheduler.py L5348-L5377
            </Cite>
            . On a busy server, <code>/flush_cache?timeout=N</code> waits up to N seconds for an
            idle moment and answers 400 if none comes{' '}
            <Cite tier={1} href={sglangUrl(HTTP_SERVER, 'L1009-L1024')} kind="code">
              http_server.py L1009-L1024
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(FLUSH, 'L24-L65')} kind="code">
              flush_wrapper.py L24-L65
            </Cite>
            . It sits on the admin plane, whose key section 12, Talking to SGLang, sets up. Flushing
            costs every cached prefix, so for schemas that need longer to compile, raise{' '}
            <code>SGLANG_GRAMMAR_MAX_POLL_ITERATIONS</code> at launch.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Which backends, schema keywords and request shapes are rejected before the first token, and the change each one needs"
          >
            What fails with a 400
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The grammar backend is one server-wide choice. <code>--grammar-backend</code> takes{' '}
            <code>xgrammar</code>, <code>outlines</code>, <code>llguidance</code> or{' '}
            <code>none</code>, which turns structured output off{' '}
            <Cite tier={1} href={sglangUrl(CHOICES, 'L131')}>
              choices.py L131
            </Cite>
            . The server-arguments table in the documentation lists the default as{' '}
            <code>None</code>{' '}
            <Cite
              tier={1}
              href={sglangDocsSrcUrl('advanced_features/server_arguments', 'L1452-L1455')}
              kind="doc-code-conflict"
            >
              SGLang docs: server arguments (v0.5.22 source)
            </Cite>
            ; v0.5.22 resolves that <code>None</code> to <code>xgrammar</code> at startup{' '}
            <Cite tier={1} href={sglangUrl(SERVING_HOOK, 'L232-L237')}>
              serving_hook.py L232-L237
            </Cite>
            , as the structured-outputs page states{' '}
            <Cite tier={1} href={sglangDocsSrcUrl('advanced_features/structured_outputs', 'L8-L18')}>
              SGLang docs: structured outputs (v0.5.22 source)
            </Cite>
            , so an unset flag means XGrammar. No field in the OpenAI protocol, the internal request
            structures or the sampling parameters selects a backend: the scheduler builds one at
            launch from the flag{' '}
            <Cite tier={1} href={sglangUrl(GM, 'L30-L44')} kind="code">
              grammar_manager.py L30-L44
            </Cite>
            . A plugin can register its own backend under a new name, and a registered name wins
            over the built-in ones{' '}
            <Cite tier={1} href={sglangUrl(BASE, 'L346-L363')} kind="code">
              base_grammar_backend.py L346-L363
            </Cite>
            .
          </Box>
          <Box variant="p">
            XGrammar, the default, gets a pre-check. Before compiling, SGLang checks each JSON
            schema and rejects keywords XGrammar 0.2.x would accept without enforcing, string
            formats it does not implement, and string fields that combine more than one kind of
            string constraint; the 400 names the JSON pointer and the keyword{' '}
            <Cite tier={1} href={sglangUrl(VALID, 'L167-L201')} kind="code">
              json_schema_validation.py L167-L201
            </Cite>
            . Outlines gets a wider keyword check of its own, which also rejects{' '}
            <code>minimum</code>, <code>maximum</code>, <code>allOf</code> and <code>oneOf</code>{' '}
            <Cite tier={1} href={sglangUrl(VALID, 'L66-L92')} kind="code">
              json_schema_validation.py L66-L92
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(OUTLINES, 'L169-L182')} kind="code">
              outlines_backend.py L169-L182
            </Cite>
            . SGLang 0.5.22 pins XGrammar 0.2.7 and Outlines 0.1.11 exactly, and accepts llguidance
            from 1.7.6 to below 2.0, all in the base install{' '}
            <Cite tier={1} href={sglangUrl(PYPROJECT, 'L24-L102')}>
              pyproject.toml L24-L102
            </Cite>
            . The llguidance backend gets no such pre-check, so its own compiler decides what it
            accepts{' '}
            <Cite tier={1} href={sglangUrl(LLG, 'L272-L284')} kind="code">
              llguidance_backend.py L272-L284
            </Cite>
            .
          </Box>
          <Box variant="p">
            On <code>/generate</code> and the offline <code>Engine</code>, a request carries one of{' '}
            <code>json_schema</code>, <code>regex</code>, <code>ebnf</code> or{' '}
            <code>structural_tag</code> in <code>sampling_params</code>{' '}
            <Cite tier={1} href={sglangUrl(SP, 'L146-L149')}>
              sampling_params.py L146-L149
            </Cite>
            . On the OpenAI routes, <code>response_format</code> of type <code>json_schema</code>{' '}
            becomes a JSON-schema grammar, <code>json_object</code> becomes the schema{' '}
            <code>{'{"type": "object"}'}</code>, and SGLang adds a <code>structural_tag</code>{' '}
            response format; <code>regex</code> and <code>ebnf</code> ride as top-level fields in{' '}
            <code>extra_body</code>{' '}
            <Cite tier={1} href={sglangUrl(PROTOCOL, 'L1161-L1189')} kind="code">
              protocol.py L1161-L1189
            </Cite>
            . <code>strict: false</code> turns the constraint off only when the chat encoding
            forwards <code>response_format</code> to the model itself, which at v0.5.22 is the{' '}
            <code>kimi_k3</code> encoding; everywhere else the schema is enforced whatever{' '}
            <code>strict</code> says{' '}
            <Cite tier={1} href={sglangUrl(SERVING_CHAT, 'L1257-L1262')} kind="code">
              serving_chat.py L1257-L1262
            </Cite>
            .
          </Box>
          <Table
            variant="embedded"
            wrapLines
            trackBy="id"
            header={<Header variant="h3">Requests rejected before the first token</Header>}
            items={REJECT_ROWS}
            columnDefinitions={[
              { id: 'send', header: 'What you send', cell: (r) => r.send, minWidth: 200 },
              { id: 'result', header: 'What happens at v0.5.22', cell: (r) => r.result, minWidth: 220 },
              { id: 'fix', header: 'What to do', cell: (r) => r.fix, minWidth: 180 },
              { id: 'src', header: 'Source', cell: (r) => r.src, minWidth: 170 },
            ]}
          />
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Get a schema-valid answer after the model reasons, where an unset parser binds the schema from the first token"
          >
            Reasoning models: the schema starts after the think block
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Launch with <code>--reasoning-parser</code> and the grammar waits. SGLang wraps the
            backend so that tokens inside the think block are unconstrained, and the schema starts
            binding once the model emits the think-end sequence, such as{' '}
            <code>{'</think>'}</code>{' '}
            <Cite tier={1} href={sglangUrl(REASONER, 'L98-L192')}>
              reasoner_grammar_backend.py L98-L192
            </Cite>{' '}
            <Cite
              tier={1}
              href={sglangDocsSrcUrl('advanced_features/structured_outputs_for_reasoning_models', 'L6-L10')}
            >
              SGLang docs: structured outputs for reasoning models (v0.5.22 source)
            </Cite>
            . The wrapper is installed only when the parser is set and the model defines think-end
            tokens{' '}
            <Cite tier={1} href={sglangUrl(BASE, 'L427-L443')} kind="code">
              base_grammar_backend.py L427-L443
            </Cite>
            . It is the only path that defers the grammar, so our reading is that without{' '}
            <code>--reasoning-parser</code> the schema binds from the first output token and a
            reasoning model cannot write free-form reasoning before the schema-bound output.
          </Box>
          <Box variant="p">
            <code>--enable-strict-thinking</code> (off by default) applies the mask inside the think
            block as well: it blocks model-specific tokens such as tool-call markers, and with a
            thinking budget set it allows only the think-end sequence once the budget is spent. It
            needs a backend that can filter tokens, which at v0.5.22 is XGrammar alone{' '}
            <Cite tier={1} href={sglangUrl(SERVING_FIELDS, 'L217-L220')}>
              serving.py L217-L220
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(REASONER, 'L284-L299')} kind="code">
              reasoner_grammar_backend.py L284-L299
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(XG, 'L250-L252')} kind="code">
              xgrammar_backend.py L250-L252
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Which two metrics carry structured-output data, how to keep JSON compact, and the first checks for a new deployment"
          >
            Running it: two metrics, the whitespace knobs and where to start
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Two Prometheus series carry structured-output data at v0.5.22: the gauge{' '}
            <code>sglang:num_grammar_queue_reqs</code>, requests waiting for a compile, and the
            counter <code>sglang:num_so_requests_total</code>, finished constrained requests{' '}
            <Cite tier={1} href={sglangUrl(COLLECTOR, 'L368-L372')} kind="code">
              metrics_collector.py L368-L372
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(COLLECTOR, 'L2070-L2073')} kind="code">
              metrics_collector.py L2070-L2073
            </Cite>
            . The compile-time histogram and the cache-hit, abort and timeout counters are
            registered beside them, but nothing under <code>python/</code> updates them, so they
            stay at zero{' '}
            <Cite tier={1} href={sglangUrl(COLLECTOR, 'L860-L990')} kind="code">
              metrics_collector.py L860-L990
            </Cite>
            . Alert on the queue gauge and on 400 responses instead. Both series need{' '}
            <code>--enable-metrics</code> (section 4, The Scheduler).
          </Box>
          <Box variant="p">
            By default XGrammar lets the model put any amount of whitespace between JSON tokens, so
            a long run of spaces or newlines still satisfies the grammar; that a model can drift
            into one is our reading of the default, not something observed here{' '}
            <Cite tier={1} href={sglangUrl(SERVING_FIELDS, 'L279-L290')}>
              serving.py L279-L290
            </Cite>
            . <code>--constrained-json-max-whitespace-cnt</code> caps each run, and{' '}
            <code>--constrained-json-disable-any-whitespace</code> forces compact JSON; the table
            names the backends each knob reaches{' '}
            <Cite tier={1} href={sglangUrl(BASE, 'L366-L414')} kind="code">
              base_grammar_backend.py L366-L414
            </Cite>
            .
          </Box>
          <Table
            variant="embedded"
            wrapLines
            trackBy="id"
            header={<Header variant="h3">The knobs this section explains</Header>}
            items={KNOB_ROWS}
            columnDefinitions={[
              { id: 'knob', header: 'Flag or variable', cell: (r) => <code>{r.knob}</code>, minWidth: 200 },
              { id: 'def', header: 'Default at v0.5.22', cell: (r) => r.def, minWidth: 150 },
              { id: 'effect', header: 'What it changes', cell: (r) => r.effect, minWidth: 220 },
              { id: 'src', header: 'Source', cell: (r) => r.src, minWidth: 160 },
            ]}
          />
          <Box variant="p">
            <strong>Where to start:</strong> launch with <code>--enable-metrics</code>, and search
            the startup log for <code>Grammar backend disabled</code> before trusting JSON mode on a
            new model. Send your production schemas through a staging server and fix every 400 the
            pre-check returns; on a reasoning model, set <code>--reasoning-parser</code>. Then watch{' '}
            <code>sglang:num_grammar_queue_reqs</code>. A request that stays in that queue is
            heading for the 10,000-poll deadline, at least 50 seconds, after which its schema stays
            cached as a failure until <code>/flush_cache</code> or a restart. Give very large
            schemas a higher <code>SGLANG_GRAMMAR_MAX_POLL_ITERATIONS</code> before they reach
            production.
          </Box>
          <Box variant="p">
            <strong>Against vLLM:</strong> both engines mask with XGrammar first. vLLM&apos;s
            default <code>auto</code> backend falls back per request when XGrammar rejects a schema{' '}
            <Cite tier={1} href={vllmUrl('vllm/config/structured_outputs.py', 'L21')}>
              vLLM structured_outputs.py L21
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/sampling_params.py', 'L1297-L1341')}>
              vLLM sampling_params.py L1297-L1341
            </Cite>
            , where SGLang runs one backend for every request, so an unusual schema can pass on vLLM
            and fail with a 400 on SGLang until it runs with{' '}
            <code>--grammar-backend llguidance</code>. Client request shapes differ for regex and
            grammar constraints: SGLang takes <code>regex</code> and <code>ebnf</code> as top-level{' '}
            <code>extra_body</code> fields, where vLLM nests its constraints under{' '}
            <code>structured_outputs</code> ({VLLM_SERVER_LINK}).
          </Box>
        </SpaceBetween>
      </Container>

      <ExpandableSection
        variant="container"
        headerText="Where this lives in code"
        headerDescription="The structured-output reading path through v0.5.22, in the order a constrained request travels"
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Read from the tag, top to bottom. The first four rows are the compile path a new schema
            takes; the last four are the per-token loop in the diagram above. Section 27, Inside
            the Codebase, places these files in the wider source tree.
          </Box>
          <Table
            variant="embedded"
            wrapLines
            trackBy="id"
            items={WALK_ROWS}
            columnDefinitions={[
              { id: 'where', header: 'File and lines at v0.5.22', cell: (r) => r.where, minWidth: 220 },
              { id: 'look', header: 'What to look at', cell: (r) => r.look, minWidth: 220 },
              { id: 'why', header: 'Why it matters', cell: (r) => r.why, minWidth: 180 },
            ]}
          />
        </SpaceBetween>
      </ExpandableSection>
    </SpaceBetween>
  );
}
