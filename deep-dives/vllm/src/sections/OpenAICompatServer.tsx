import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Table from '@cloudscape-design/components/table';
import Alert from '@cloudscape-design/components/alert';
import Link from '@cloudscape-design/components/link';

export function OpenAICompatServer() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="The HTTP surface an integrator actually talks to — vllm serve, the endpoints it speaks, and the OpenAI dialect it deviates from."
          >
            12. The OpenAI-Compatible Server
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The drop-in value proposition:</strong> vLLM ships an HTTP server that{' '}
            <em>implements OpenAI&apos;s wire protocol</em>, so the client code you already wrote
            against OpenAI keeps working when you point it at your own GPU. You launch it with one
            command &mdash; <code>vllm serve</code> &mdash; and you get a server that, in the docs&apos;
            own framing, &quot;implements OpenAI&apos;s Completions API, Chat API, and more.&quot; The
            integration cost is a base-URL swap and an API key:
          </Box>
          <Box variant="code">
            <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{String.raw`# Start the server
vllm serve NousResearch/Meta-Llama-3-8B-Instruct \
  --dtype auto \
  --api-key token-abc123

# Same OpenAI SDK, different base_url
client = OpenAI(base_url="http://localhost:8000/v1",
                api_key="token-abc123")`}</pre>
          </Box>
          <Box variant="p">
            Because the contract is OpenAI&apos;s, the entire ecosystem built on that contract works
            without adapters: the official OpenAI Python and JS clients, LangChain, LlamaIndex,
            LiteLLM, and anything that already speaks <code>/v1/chat/completions</code>. The docs
            explicitly call out that &quot;you can use the official OpenAI Python client to interact
            with it&quot; for every generative endpoint. That compatibility is the whole point: vLLM
            competes on throughput and cost-per-token, not on making you rewrite your call sites (
            <Link external href="https://docs.vllm.ai/en/latest/serving/openai_compatible_server/">
              vLLM Docs: OpenAI-Compatible Server, accessed 2026-06-07
            </Link>
            ).
          </Box>
          <Alert type="info">
            This section is the <strong>integrator&apos;s view</strong> &mdash; the API surface and
            serving flags you configure from outside. How that server is actually wired (the Python
            entrypoint versus the opt-in Rust frontend, the request lifecycle) lives in{' '}
            <strong>Inside the Codebase &rarr; The Rust Frontend</strong>, and how guided decoding is
            implemented (the finite-state machines, the grammar compilation) lives in{' '}
            <strong>Inside the Codebase &rarr; Spec Decode, Guided Decode &amp; Compile</strong>. This
            page stays at the level of &quot;what you send and what you get back.&quot;
          </Alert>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">The endpoint surface</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            The server exposes three families of routes: <strong>OpenAI mirrors</strong> (drop-in
            compatible with the named OpenAI API), <strong>cross-vendor mirrors</strong> (Anthropic
            Messages, Cohere Embed/Rerank) for clients written against those SDKs, and{' '}
            <strong>vLLM-native and utility routes</strong> (pooling, scoring, tokenizer, health).
            Which routes light up depends on the model class you loaded &mdash; a generative model
            serves chat/completions, an embedding model serves <code>/v1/embeddings</code>, an ASR
            model serves the audio routes.
          </Box>

          <Box variant="code">
            <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{String.raw`
                         vllm serve  →  http://host:8000
                                  │
       ┌──────────────────────────┼──────────────────────────┐
       ▼                          ▼                          ▼
  OpenAI mirrors          Cross-vendor mirrors        vLLM-native / utility
  ─────────────           ────────────────────        ─────────────────────
  /v1/completions         /v1/messages    (Anthropic)  /pooling
  /v1/chat/completions    /v2/embed       (Cohere)     /classify
  /v1/responses           /rerank /v1/rerank /v2/rerank /score  /v1/score
  /v1/embeddings            (Cohere/Jina)              /tokenize /detokenize
  /v1/audio/transcriptions /invocations  (SageMaker)   /health /ping
  /v1/audio/translations                               /version /load
       │                                               /v1/models
       └── point any OpenAI SDK / LangChain / LiteLLM here
`}</pre>
          </Box>

          <Table
            variant="embedded"
            header={<Header variant="h3">Routes the server speaks</Header>}
            columnDefinitions={[
              { id: 'api', header: 'API', cell: (i) => i.api },
              { id: 'route', header: 'Route(s)', cell: (i) => <code>{i.route}</code> },
              { id: 'family', header: 'Family', cell: (i) => i.family },
              { id: 'applies', header: 'Applies to / notes', cell: (i) => i.applies },
            ]}
            items={[
              {
                api: 'Completions',
                route: '/v1/completions',
                family: 'OpenAI mirror',
                applies: 'Text-generation models. suffix not supported.',
              },
              {
                api: 'Chat Completions',
                route: '/v1/chat/completions',
                family: 'OpenAI mirror',
                applies: 'Generative models with a chat template. user is ignored.',
              },
              {
                api: 'Responses',
                route: '/v1/responses',
                family: 'OpenAI mirror',
                applies: "Text-generation models (OpenAI's newer Responses API).",
              },
              {
                api: 'Embeddings',
                route: '/v1/embeddings',
                family: 'OpenAI mirror',
                applies: 'Embedding models only.',
              },
              {
                api: 'Transcriptions',
                route: '/v1/audio/transcriptions',
                family: 'OpenAI mirror',
                applies: 'ASR (speech-to-text) models only.',
              },
              {
                api: 'Translations',
                route: '/v1/audio/translations',
                family: 'OpenAI mirror',
                applies: 'ASR models only.',
              },
              {
                api: 'Anthropic Messages',
                route: '/v1/messages',
                family: 'Cross-vendor',
                applies: 'For clients written against the Anthropic Messages API.',
              },
              {
                api: 'Cohere Embed',
                route: '/v2/embed',
                family: 'Cross-vendor',
                applies: "Compatible with Cohere's Embed API; any embedding model.",
              },
              {
                api: 'Rerank (Cohere/Jina)',
                route: '/rerank, /v1/rerank, /v2/rerank',
                family: 'Cross-vendor',
                applies: "Score models; implements Jina v1 + Cohere v1/v2 rerank.",
              },
              {
                api: 'Score',
                route: '/score, /v1/score',
                family: 'vLLM-native',
                applies: 'Cross-encoder / bi-encoder / late-interaction score models.',
              },
              {
                api: 'Classification',
                route: '/classify',
                family: 'vLLM-native',
                applies: 'Classification (pooling) models only.',
              },
              {
                api: 'Pooling',
                route: '/pooling',
                family: 'vLLM-native',
                applies: 'All pooling models (raw hidden-state pooling).',
              },
              {
                api: 'Tokenizer',
                route: '/tokenize, /detokenize',
                family: 'Utility',
                applies: 'Round-trip text to/from token IDs.',
              },
              {
                api: 'Models / health',
                route: '/v1/models, /health, /ping, /version, /load',
                family: 'Utility',
                applies: 'Discovery, health checks, version, load metrics.',
              },
            ]}
          />
          <Box variant="small">
            Endpoint inventory verified against the vLLM serving docs and{' '}
            <Link
              external
              href="https://github.com/vllm-project/vllm/blob/main/docs/serving/online_serving/README.md"
            >
              docs/serving/online_serving/README.md
            </Link>{' '}
            (main branch, accessed 2026-06-07). vLLM moves on roughly a bi-weekly release cadence;
            confirm against the version you deploy.
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Structured outputs (guided decoding)</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>What it guarantees:</strong> structured outputs constrain the decoder so the
            generated text is forced to conform to a shape you specify &mdash; one of a fixed set of
            choices, a regex, a JSON schema, or a context-free grammar. This is a{' '}
            <em>format</em> guarantee enforced at the token level, not a quality guarantee: the model
            cannot emit a token that would violate the constraint, but the docs are careful that this
            buys validity, not correctness. It is enabled by default in the server; you opt into a
            specific shape per request.
          </Box>

          <Table
            variant="embedded"
            header={<Header variant="h3">Constraint types (passed under structured_outputs)</Header>}
            columnDefinitions={[
              { id: 'field', header: 'Field', cell: (i) => <code>{i.field}</code> },
              { id: 'guarantee', header: 'What it forces', cell: (i) => i.guarantee },
            ]}
            items={[
              { field: 'choice', guarantee: 'Output is exactly one of the supplied choices.' },
              { field: 'regex', guarantee: 'Output matches the regex pattern.' },
              { field: 'json', guarantee: 'Output follows the supplied JSON schema.' },
              { field: 'grammar', guarantee: 'Output follows the context-free grammar.' },
              {
                field: 'structural_tag',
                guarantee: 'Output follows a JSON schema within a set of specified tags in the text.',
              },
            ]}
          />

          <Box variant="p">
            These ride in the request as extra parameters &mdash; for example{' '}
            <code>{'extra_body={"structured_outputs": {"choice": ["positive", "negative"]}}'}</code>.
            The OpenAI-standard <code>response_format</code> with a <code>json_schema</code> type is
            also honored for plain OpenAI-client compatibility (
            <Link external href="https://docs.vllm.ai/en/latest/features/structured_outputs/">
              vLLM Docs: Structured Outputs, accessed 2026-06-07
            </Link>
            ).
          </Box>

          <Alert type="warning">
            <strong>API change &mdash; the old <code>guided_*</code> fields are gone.</strong> If you
            are porting older code or following older tutorials, note that{' '}
            <code>guided_json</code>, <code>guided_regex</code>, <code>guided_choice</code>,{' '}
            <code>guided_grammar</code>, <code>guided_whitespace_pattern</code>, and the standalone{' '}
            <code>guided_decoding_backend</code> field were <strong>removed in v0.12.0</strong>. The
            current API folds all of them under a single <code>structured_outputs</code> object (e.g.{' '}
            <code>guided_json</code> &rarr; <code>{'{"structured_outputs": {"json": ...}}'}</code>),
            and the backend is now a server flag, not a per-request field.
          </Alert>

          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Backends &amp; how one gets chosen</Box>
              <Box variant="p">
                vLLM supports <strong>xgrammar</strong> and <strong>guidance</strong> as primary
                backends (with <strong>outlines</strong> and <strong>lm-format-enforcer</strong> also
                available). The default is <code>auto</code>, which &quot;will try to choose an
                appropriate backend based on the details of the request.&quot; You can pin one with{' '}
                <code>--structured-outputs-config.backend</code> on <code>vllm serve</code>. Backend
                choice has real consequences: regex syntax differs &mdash; xgrammar, guidance, and
                outlines use Rust-style regex while lm-format-enforcer uses Python&apos;s{' '}
                <code>re</code> module.
              </Box>
            </div>
            <div>
              <Box variant="h3">Reasoning models</Box>
              <Box variant="p">
                Structured outputs compose with reasoning models, but the reasoning trace must be
                parsed out separately &mdash; you start the server with a reasoning parser, e.g.{' '}
                <code>--reasoning-parser deepseek_r1</code>. For some models (the docs cite Qwen3
                Coder, v0.11.2+) structured outputs can silently disable when reasoning content is not
                split into the <code>reasoning</code> field; to force both on together set{' '}
                <code>--structured-outputs-config.enable_in_reasoning=True</code>.
              </Box>
            </div>
          </ColumnLayout>

          <Alert type="info">
            The finite-state-machine construction, grammar compilation, and the per-backend
            internals are out of scope here &mdash; they are walked against the real source in{' '}
            <strong>Inside the Codebase &rarr; Spec Decode, Guided Decode &amp; Compile</strong>.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Tool / function calling</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            The server speaks OpenAI&apos;s tools schema, but enabling model-driven tool calls is a{' '}
            <em>per-model</em> configuration, not a flip-a-flag default. Automatic tool choice
            requires two launch flags together: <code>--enable-auto-tool-choice</code> plus a{' '}
            <code>--tool-call-parser</code> matched to the model family (the parser knows how that
            specific model emits tool-call syntax). A chat template is usually needed too.
          </Box>

          <Box variant="code">
            <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{String.raw`vllm serve meta-llama/Llama-3.1-8B-Instruct \
    --enable-auto-tool-choice \
    --tool-call-parser llama3_json \
    --chat-template examples/tool_chat_template_llama3.1_json.jinja`}</pre>
          </Box>

          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">tool_choice modes</Box>
              <Box variant="p">
                vLLM supports named function calling plus <code>auto</code>,{' '}
                <code>required</code> (as of vllm&nbsp;&ge;&nbsp;0.8.3), and <code>none</code>. With{' '}
                <code>required</code>, &quot;the model is guaranteed to generate one or more tool
                calls&quot; matching the supplied schema. Named and required both run through the
                structured-outputs backend, so a validly-parsable call is guaranteed &mdash; the docs
                phrase it bluntly: &quot;You are guaranteed a validly-parsable function call - not a
                high-quality one.&quot;
              </Box>
            </div>
            <div>
              <Box variant="h3">Per-model parsers</Box>
              <Box variant="p">
                Parsers are named and model-specific &mdash; e.g. <code>hermes</code>,{' '}
                <code>mistral</code>, <code>llama3_json</code>, <code>llama4_pythonic</code>,{' '}
                <code>internlm</code>, <code>granite</code> / <code>granite4</code>,{' '}
                <code>deepseek_v3</code> / <code>deepseek_v31</code>, <code>qwen3_xml</code>,{' '}
                <code>kimi_k2</code>, <code>glm45</code>, and a generic <code>pythonic</code>. Picking
                the wrong parser for a model produces malformed or empty tool calls, so this must
                match the checkpoint you are serving.
              </Box>
            </div>
          </ColumnLayout>

          <Alert type="warning">
            <strong>The <code>strict</code> field is accepted but a no-op.</strong> OpenAI&apos;s
            function-definition <code>strict: true</code> triggers constrained decoding to guarantee
            arguments match the schema even in <code>auto</code> mode. vLLM, in its own words,
            &quot;does not implement <code>strict</code> mode today. The <code>strict</code> field is
            accepted in requests (to avoid breaking clients that set it), but it has no effect on
            decoding behavior.&quot; In <code>auto</code> mode, argument validity therefore depends
            entirely on the model&apos;s output quality and the parser &mdash; if you need a hard
            schema guarantee, use named or <code>required</code> tool choice, which <em>do</em> route
            through structured outputs (
            <Link external href="https://docs.vllm.ai/en/latest/features/tool_calling/">
              vLLM Docs: Tool Calling, accessed 2026-06-07
            </Link>
            ).
          </Alert>

          <Box variant="small">
            Note on parallel calls: setting <code>parallel_tool_calls=false</code> ensures vLLM
            returns zero or one tool call per request; the default <code>true</code> permits more
            than one, but &mdash; per the docs &mdash; there is no guarantee more than one is
            returned, as that is model-dependent.
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Multimodal inputs</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            On the Chat Completions endpoint, vLLM accepts the OpenAI multimodal message format, so
            vision and audio requests look exactly like they would against OpenAI. Images go in via{' '}
            <code>image_url</code> &mdash; either a remote URL or a base64 <code>data:</code> URI;
            audio via <code>input_audio</code> (base64) or <code>audio_url</code>; video via{' '}
            <code>video_url</code>. Multiple media items per message are supported.
          </Box>
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">What flows in</Box>
              <ul>
                <li>
                  Images via <code>image_url</code> (URL or base64 data URI), per the OpenAI Vision
                  API. <em>Note: the <code>image_url.detail</code> parameter is not supported.</em>
                </li>
                <li>
                  Audio via <code>input_audio</code> or <code>audio_url</code> &mdash; any format
                  readable by the underlying decoders.
                </li>
                <li>Video via <code>video_url</code>.</li>
              </ul>
            </div>
            <div>
              <Box variant="h3">Server-side controls</Box>
              <ul>
                <li>
                  <code>--limit-mm-per-prompt</code> caps media items per request (e.g. image=2).
                </li>
                <li>
                  <code>--allowed-local-media-path</code> opts into reading local files; off by
                  default.
                </li>
                <li>
                  <code>--allowed-media-domains</code> restricts fetchable domains to mitigate SSRF.
                </li>
              </ul>
            </div>
          </ColumnLayout>
          <Box variant="small">
            <Link external href="https://docs.vllm.ai/en/latest/features/multimodal_inputs.html">
              vLLM Docs: Multimodal Inputs, accessed 2026-06-07
            </Link>
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">vLLM-specific extra parameters</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            vLLM exposes sampling and serving controls that are not part of the OpenAI API. With the
            OpenAI SDK you pass them through <code>extra_body</code> (e.g.{' '}
            <code>{'extra_body={"top_k": 50}'}</code>); with a raw HTTP call you merge them straight
            into the JSON payload. These are the levers an integrator reaches for that OpenAI&apos;s
            schema never exposed.
          </Box>

          <Table
            variant="embedded"
            header={<Header variant="h3">Notable extra request parameters</Header>}
            columnDefinitions={[
              { id: 'param', header: 'Parameter', cell: (i) => <code>{i.param}</code> },
              { id: 'purpose', header: 'Purpose', cell: (i) => i.purpose },
            ]}
            items={[
              {
                param: 'top_k',
                purpose: 'Top-k sampling cutoff — not in the OpenAI API.',
              },
              {
                param: 'min_p',
                purpose: 'Minimum-probability sampling threshold.',
              },
              {
                param: 'repetition_penalty',
                purpose: 'Penalize already-seen tokens (distinct from frequency/presence penalties).',
              },
              {
                param: 'min_tokens',
                purpose: 'Force a minimum number of generated tokens before stop conditions apply.',
              },
              {
                param: 'add_special_tokens',
                purpose: 'Control whether special tokens are prepended to the prompt.',
              },
              {
                param: 'structured_outputs',
                purpose: 'The guided-decoding object (choice / regex / json / grammar / structural_tag).',
              },
              {
                param: 'priority',
                purpose:
                  'Request priority (lower = earlier). Non-zero errors unless the server runs priority scheduling.',
              },
              {
                param: 'cache_salt',
                purpose:
                  'Salt the prefix cache so other tenants cannot probe prompts via cache-hit timing.',
              },
              {
                param: 'mm_processor_kwargs',
                purpose: 'Per-request overrides for the multimodal processor.',
              },
              {
                param: 'vllm_xargs',
                purpose: 'Free-form string/numeric params consumed by custom extensions.',
              },
            ]}
          />

          <Box variant="small">
            Parameter set verified against the chat-completion request protocol source,{' '}
            <Link
              external
              href="https://github.com/vllm-project/vllm/blob/main/vllm/entrypoints/openai/chat_completion/protocol.py"
            >
              vllm/entrypoints/openai/chat_completion/protocol.py
            </Link>{' '}
            (main branch, accessed 2026-06-07). The completions endpoint exposes an analogous set.
          </Box>

          <ExpandableSection headerText="Documented OpenAI incompatibilities (params not supported / ignored)">
            <SpaceBetween size="s">
              <Box variant="p">
                Compatibility is high but not total. The docs call out specific parameters the server
                does not honor &mdash; design around these rather than assuming OpenAI-identical
                behavior:
              </Box>
              <Table
                variant="embedded"
                columnDefinitions={[
                  { id: 'endpoint', header: 'Endpoint', cell: (i) => i.endpoint },
                  { id: 'param', header: 'Parameter', cell: (i) => <code>{i.param}</code> },
                  { id: 'behavior', header: 'Behavior in vLLM', cell: (i) => i.behavior },
                ]}
                items={[
                  {
                    endpoint: 'Completions',
                    param: 'suffix',
                    behavior: 'Not supported.',
                  },
                  {
                    endpoint: 'Chat Completions',
                    param: 'user',
                    behavior: 'Ignored.',
                  },
                  {
                    endpoint: 'Chat Completions',
                    param: 'image_url.detail',
                    behavior: 'Not supported (multimodal).',
                  },
                  {
                    endpoint: 'Tool calling',
                    param: 'strict',
                    behavior: 'Accepted but a no-op — no effect on decoding.',
                  },
                ]}
              />
              <Box variant="p">
                Two more behaviors worth knowing: by default the server applies{' '}
                <code>generation_config.json</code> from the model repo, so a model creator&apos;s
                recommended sampling defaults can override yours &mdash; pass{' '}
                <code>--generation-config vllm</code> to disable that. And only the{' '}
                <code>X-Request-Id</code> HTTP header is supported, gated behind{' '}
                <code>--enable-request-id-headers</code> (
                <Link external href="https://docs.vllm.ai/en/latest/serving/openai_compatible_server/">
                  vLLM Docs: OpenAI-Compatible Server, accessed 2026-06-07
                </Link>
                ).
              </Box>
            </SpaceBetween>
          </ExpandableSection>

          <ExpandableSection headerText="Python frontend vs. the opt-in Rust frontend">
            <Box variant="p">
              The same <code>vllm serve</code> command can run the server&apos;s HTTP/request-handling
              frontend either as the default Python implementation or as an opt-in Rust frontend,
              which moves the per-request parsing and routing hot path off the Python interpreter. From
              an integrator&apos;s standpoint the wire contract is identical &mdash; the endpoints,
              parameters, and OpenAI compatibility described above do not change. The process model,
              what the Rust frontend takes over, and how to turn it on are covered against the source
              in <strong>Inside the Codebase &rarr; The Rust Frontend</strong>.
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
