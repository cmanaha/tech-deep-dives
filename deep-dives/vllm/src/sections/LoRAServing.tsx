import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Table from '@cloudscape-design/components/table';
import Alert from '@cloudscape-design/components/alert';
import Link from '@cloudscape-design/components/link';

export function LoRAServing() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Host one base model and serve many cheap fine-tuned adapters, switching per request, instead of standing up N full models."
          >
            13. LoRA &amp; Multi-Adapter Serving
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The problem it removes:</strong> You have one base model and a dozen
            specializations &mdash; a SQL generator, a support-tone rewriter, a per-customer
            persona, a classifier. The naive answer is a dozen full fine-tunes, each a complete
            copy of the weights, each pinned to its own GPU. That is a dozen times the VRAM, a dozen
            cold replicas to keep warm, and a dozen things to deploy. Most of those copies are{' '}
            <em>byte-for-byte identical</em> to the base model; only a thin slice of weights actually
            differs.
          </Box>
          <Box variant="p">
            <strong>What LoRA serving buys:</strong> A LoRA (Low-Rank Adaptation) adapter is that
            thin slice &mdash; a small pair of low-rank matrices that ride on top of the frozen base
            weights. Instead of N full models you load the base model <em>once</em> and attach many
            adapters, each a few megabytes to low hundreds of megabytes, against that one shared copy
            of the expensive weights. vLLM goes further than &quot;load them all&quot;: it{' '}
            <strong>selects the adapter per request</strong> by name and &mdash; the part that makes
            this economical at scale &mdash; runs requests targeting <em>different</em> adapters{' '}
            <strong>together in a single batch</strong>. One base model, one set of GPUs, many
            specializations, no per-adapter replica (
            <Link external href="https://docs.vllm.ai/en/latest/features/lora/">
              vLLM Docs: LoRA Adapters, accessed 2026-06-07
            </Link>
            ).
          </Box>
          <Box variant="p">
            This section is the practitioner&apos;s view: how to register and select adapters, the
            knobs that govern memory and concurrency, the multi-tenant production caveat, and how
            Kubernetes routes to the right replica. The batched kernels that actually let one GPU
            apply many different adapters in the same forward pass &mdash; the Punica / SGMV
            (Segmented Gather Matrix-Vector) style implementation &mdash; are walked against the real
            source in the <strong>Inside the Codebase &rarr; Model Layer, Quant &amp; LoRA</strong>{' '}
            tab. Here we stay above the kernel.
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">One base model, many adapters, a mixed batch</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            The base weights are loaded once and shared. Each in-flight request carries an adapter ID
            (or none, meaning the raw base model). The scheduler assembles a batch from whatever
            requests are ready &mdash; <em>regardless of which adapter each one wants</em> &mdash; and
            the batched LoRA kernels apply the correct adapter&apos;s low-rank delta per row of the
            batch. The diagram below shows three adapters plus a base-only request all riding the same
            forward pass.
          </Box>

          <Box variant="code">
            <Box variant="small" color="text-status-info">
              One shared base model + slotted adapters serving a mixed batch
            </Box>
            <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{String.raw`
 incoming requests          ┌──────────────── single GPU replica ────────────────┐
 (each names a model):      │                                                     │
                            │   BASE MODEL WEIGHTS  (loaded once, shared)         │
  req → "sql-lora"   ──┐    │   ┌───────────────────────────────────────────┐   │
  req → "base"       ──┤    │   │   frozen W  (the expensive multi-GB copy)  │   │
  req → "tone-lora"  ──┤    │   └───────────────────────────────────────────┘   │
  req → "sql-lora"   ──┤    │                                                     │
  req → "persona-7"  ──┘    │   active adapter slots  (max_loras on GPU):         │
        │                   │   ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐      │
        │  per-request      │   │sql-lora│ │tone-   │ │persona-│ │ (free) │      │
        │  adapter select   │   │  A·B   │ │lora A·B│ │ 7  A·B │ │        │      │
        ▼                   │   └────────┘ └────────┘ └────────┘ └────────┘      │
   ┌─────────────┐         │        ▲          ▲          ▲                       │
   │  scheduler  │─────────│────────┴──────────┴──────────┴── CPU LRU cache ◄──┐ │
   │ builds ONE  │         │            batched LoRA kernels                    │ │
   │ mixed batch │         │   y = Wx  +  (per-row adapter)·B·A·x               │ │
   └─────────────┘         │            ──────┬──────                          │ │
        │                  │                   ▼                                │ │
   rows:[sql,base,tone,    │   one forward pass, correct delta applied per row  │ │
        sql,persona-7]     └─────────────────────────────────────────────────────┘
                                          max_cpu_loras: adapters parked in host RAM,
                                          paged onto a GPU slot on demand (LRU) ──────┘
`}</pre>
          </Box>

          <Alert type="info">
            <strong>Why &quot;base&quot; sits in the same batch:</strong> a base-only request is just
            a request with no adapter delta &mdash; the LoRA term is zero for that row. There is no
            penalty for mixing adapted and un-adapted traffic; they share the one prefill/decode pass
            over the shared base weights. The cost of an adapter is the small extra{' '}
            <code>B&middot;A&middot;x</code> term per token, not a separate model invocation.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">How vLLM serves it: register at startup, select by name</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            The production-safe path is <strong>static registration</strong>. You name your adapters
            at server startup and they become first-class &quot;models&quot; the OpenAI-compatible
            endpoint can route to. The flag is{' '}
            <code>--lora-modules {'{name}={path}'}</code>, repeated per adapter:
          </Box>

          <Box variant="code">
            <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{String.raw`vllm serve meta-llama/Llama-3.2-3B-Instruct \
    --enable-lora \
    --lora-modules sql-lora=jeeejeee/llama32-3b-text2sql-spider \
                   tone-lora=/models/tone-rewriter \
                   persona-7=/models/persona-7`}</pre>
          </Box>

          <Box variant="p">
            From the caller&apos;s side there is nothing new to learn: a request{' '}
            <strong>selects an adapter by putting its name in the <code>model</code> field</strong>{' '}
            &mdash; <code>{'"model": "sql-lora"'}</code> &mdash; exactly as it would name a base
            model. The <code>/models</code> endpoint lists the base model <em>and</em> every
            registered adapter, so clients can discover what is available. Quoting the docs, requests
            &quot;can use the LoRA adapter as if it were any other model via the <code>model</code>{' '}
            request parameter&quot; (
            <Link external href="https://docs.vllm.ai/en/latest/features/lora/">
              vLLM Docs: LoRA Adapters, accessed 2026-06-07
            </Link>
            ). Omit the adapter name (or name the base model) and you get the raw base model. This is
            the whole reason the OpenAI-compatible surface needs no extension for multi-adapter
            serving &mdash; an adapter <em>is</em> a model name. See{' '}
            <strong>12. The OpenAI-Compatible Server</strong> for the endpoint itself.
          </Box>

          <Alert type="info">
            <strong>Multi-LoRA batching is the differentiator.</strong> Registering many adapters is
            cheap; the hard engineering is serving requests for different adapters in the{' '}
            <em>same</em> batch without falling back to one-batch-per-adapter. vLLM does this with
            batched, segmented kernels in the Punica / SGMV family &mdash; a single GPU op gathers the
            right adapter weights for each row and applies them together. The internals (the kernel
            shapes, the segment gather, where it plugs into the linear layers) are deferred to the{' '}
            <strong>Inside the Codebase &rarr; Model Layer, Quant &amp; LoRA</strong> tab on purpose;
            this section treats the batched kernel as a black box that &quot;just works.&quot;
          </Alert>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">The knobs that govern memory and concurrency</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            Four engine arguments shape what multi-LoRA serving costs and how many adapters can be
            live at once. The descriptions below are quoted from the LoRA configuration reference;
            the practitioner reading is mine.
          </Box>

          <Table
            variant="embedded"
            header={<Header variant="h3">LoRA engine arguments</Header>}
            columnDefinitions={[
              { id: 'flag', header: 'Flag', cell: (i) => <code>{i.flag}</code> },
              { id: 'doc', header: 'What the docs say', cell: (i) => i.doc },
              { id: 'use', header: 'How to think about it', cell: (i) => i.use },
            ]}
            items={[
              {
                flag: '--enable-lora',
                doc: 'Turns LoRA support on.',
                use: 'The master switch. Off by default; nothing else here matters until it is set.',
              },
              {
                flag: 'max_loras',
                doc: '"Max number of LoRAs in a single batch."',
                use: 'The count of concurrent GPU adapter slots — how many distinct adapters can co-exist in one mixed batch. Each slot reserves GPU memory, so this is a throughput-vs-VRAM dial, not a hard catalog limit. More registered adapters than slots is fine; they page in.',
              },
              {
                flag: 'max_lora_rank',
                doc: '"Max LoRA rank."',
                use: 'The largest adapter rank the server will accept (rank = the inner dimension of the B·A factorization). Sized for the highest-rank adapter you will load; higher rank means more per-adapter memory and compute. An adapter exceeding this is rejected.',
              },
              {
                flag: 'max_cpu_loras',
                doc: '"Maximum number of LoRAs to store in CPU memory. Must be >= than max_loras."',
                use: 'The host-RAM LRU cache of adapters. Adapters live cheaply in CPU memory and are paged onto a GPU slot on demand; least-recently-used ones fall out when the cache is full. Lets you offer far more adapters than fit on the GPU at once.',
              },
              {
                flag: 'fully_sharded_loras',
                doc: '"By default, only half of the LoRA computation is sharded with tensor parallelism. Enabling this will use the fully sharded layers."',
                use: 'A tensor-parallel optimization. At high TP degree and large rank, sharding the whole LoRA computation (not just half) can cut the per-GPU LoRA overhead. A tuning knob for multi-GPU replicas, not an everyday setting.',
              },
            ]}
          />
          <Box variant="small">
            Sources:{' '}
            <Link external href="https://docs.vllm.ai/en/latest/features/lora/">
              vLLM Docs: LoRA Adapters
            </Link>{' '}
            and{' '}
            <Link external href="https://docs.vllm.ai/en/latest/api/vllm/config/lora.html">
              vLLM Docs: LoRAConfig reference
            </Link>{' '}
            &mdash; both accessed 2026-06-07.
          </Box>

          <Alert type="info">
            <strong>The mental model:</strong> <code>max_loras</code> is your{' '}
            <em>GPU working set</em> of adapters; <code>max_cpu_loras</code> is your{' '}
            <em>host-RAM catalog</em>, with the constraint that the catalog must be at least as large
            as the working set. Adapters cycle between the two on an LRU basis, the same shape of
            cache as KV offloading uses for blocks. <code>max_lora_rank</code> bounds the size of any
            single adapter; <code>fully_sharded_loras</code> is a multi-GPU efficiency tweak you reach
            for only under tensor parallelism.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">The production caveat: dynamic load/unload is not for hostile multi-tenancy</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            vLLM also exposes adapters you can add and remove <em>at runtime</em>, without restarting
            the server. The endpoints are <code>POST /v1/load_lora_adapter</code> (with a{' '}
            <code>lora_name</code> and <code>lora_path</code>) and{' '}
            <code>POST /v1/unload_lora_adapter</code>, and they are gated behind the environment
            variable <code>VLLM_ALLOW_RUNTIME_LORA_UPDATING=True</code> &mdash; they do nothing unless
            you opt in. This is genuinely useful for fast iteration: push a freshly trained adapter
            and serve it in seconds.
          </Box>

          <Alert type="warning">
            <strong>Quoted from the docs, verbatim:</strong>{' '}
            <em>
              &quot;This feature comes with security risks. It should not be used in production unless
              it is an isolated, fully trusted environment.&quot;
            </em>{' '}
            (
            <Link external href="https://docs.vllm.ai/en/latest/features/lora/">
              vLLM Docs: LoRA Adapters, accessed 2026-06-07
            </Link>
            )
          </Alert>

          <Box variant="p">
            Why it is dangerous: the load endpoint takes a <strong>path</strong>, and the server
            reads adapter weights from it. In a shared or internet-exposed deployment that is an
            arbitrary-path / untrusted-artifact vector &mdash; an attacker who can reach the endpoint
            can make the server load weights of their choosing. The guidance is therefore not
            &quot;never use it&quot; but &quot;only behind a trust boundary&quot;: a developer
            sandbox, a single-tenant CI loop, an internal isolated environment where every caller is
            trusted. For anything fronting real users, prefer static <code>--lora-modules</code>{' '}
            registration and treat the adapter set as part of your deployment artifact, not a runtime
            input.
          </Box>

          <Alert type="info">
            <strong>The unsolved-upstream part:</strong> dynamic runtime loading is{' '}
            <em>per-replica</em>. In a fleet of N replicas, a single{' '}
            <code>load_lora_adapter</code> call lands on whichever replica served the request &mdash;
            it does not propagate to the others. Keeping a dynamically-managed adapter set consistent
            across a horizontally-scaled, multi-tenant fleet is not something vLLM solves on its own;
            it pushes the problem up to the orchestration layer. That is exactly the gap the
            Kubernetes routing story below addresses &mdash; and why, for multi-tenant production,
            static registration plus adapter-aware routing is the durable pattern rather than ad-hoc
            runtime loads.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">The Kubernetes angle: routing by adapter</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            Once you scale past one replica, &quot;which replica is serving adapter X right now?&quot;
            becomes a routing question. A naive load balancer scatters requests across replicas
            blindly &mdash; so a request for <code>sql-lora</code> may land on a replica that has
            paged that adapter out, forcing a reload and a cold slot. The fix is{' '}
            <strong>adapter-aware routing</strong>: send each request to a replica that already holds
            the adapter it wants.
          </Box>
          <Box variant="p">
            The <strong>Gateway API Inference Extension</strong> (an official Kubernetes project for
            self-hosting generative models) implements exactly this. Its model-aware routing
            &quot;extends to Low-Rank Adaptation (LoRA) fine-tuned models,&quot; and it routes using
            capability data the model servers expose &mdash; described as &quot;Data provided by model
            serving platforms about performance, availability and capabilities to optimize routing.
            Includes things like Prefix Cache status or LoRA Adapters availability&quot; (
            <Link external href="https://gateway-api-inference-extension.sigs.k8s.io/">
              Gateway API Inference Extension, accessed 2026-06-07
            </Link>
            ).
          </Box>
          <Box variant="p">
            The concrete signal on the vLLM side is the Prometheus metric{' '}
            <code>vllm:lora_requests_info</code> &mdash; documented as &quot;Running stats on lora
            requests&quot; (
            <Link external href="https://docs.vllm.ai/en/latest/usage/metrics.html">
              vLLM Docs: Metrics, accessed 2026-06-07
            </Link>
            ). It reports which adapters a replica is actually serving, which the gateway scrapes to
            place adapter-targeted requests on the replica that already has the adapter resident
            &mdash; turning the per-replica nature of adapter loading from a liability into a routing
            input. The Kubernetes and gateway integration details live in{' '}
            <strong>17. Kubernetes: llm-d, KServe &amp; Gateway API</strong>; the metrics themselves,
            their labels, and how to scrape them are covered in{' '}
            <strong>20. Observability &amp; Benchmarking</strong>.
          </Box>

          <ExpandableSection headerText="Putting it together: the production pattern for a multi-tenant adapter fleet">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>1. Register statically.</strong> Bake the adapter set into the deployment via{' '}
                <code>--lora-modules</code>; do not rely on runtime <code>load_lora_adapter</code> for
                user-facing traffic. The adapter set becomes a versioned artifact, not a mutable
                runtime input &mdash; sidestepping the untrusted-path risk in the warning above.
              </Box>
              <Box variant="p">
                <strong>2. Size the two caches.</strong> Set <code>max_loras</code> to the number of
                adapters you want hot on the GPU concurrently (your working set), and{' '}
                <code>max_cpu_loras</code> to the full catalog you want resident in host RAM
                (necessarily &ge; <code>max_loras</code>). Set <code>max_lora_rank</code> to your
                largest adapter&apos;s rank. The LRU paging between the two absorbs a catalog larger
                than the GPU can hold at once.
              </Box>
              <Box variant="p">
                <strong>3. Route by adapter.</strong> Front the fleet with the Gateway API Inference
                Extension (or an equivalent adapter-aware router) consuming{' '}
                <code>vllm:lora_requests_info</code>, so requests land on a replica that already holds
                the target adapter &mdash; minimizing cross-replica reloads and keeping the GPU
                working set stable per replica.
              </Box>
              <Box variant="p">
                <strong>4. Reserve dynamic loading for trusted lanes.</strong> Use{' '}
                <code>VLLM_ALLOW_RUNTIME_LORA_UPDATING</code> only in isolated, fully-trusted
                environments &mdash; development, CI, internal experimentation &mdash; never on a
                multi-tenant, user-facing endpoint. Treat &quot;dynamic in dev, static in
                prod&quot; as the default split.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">When LoRA serving is the right call</Header>}>
        <Table
          variant="embedded"
          columnDefinitions={[
            { id: 'situation', header: 'Situation', cell: (i) => i.situation },
            { id: 'verdict', header: 'Verdict', cell: (i) => i.verdict },
            { id: 'why', header: 'Why', cell: (i) => i.why },
          ]}
          items={[
            {
              situation: 'Many specializations of one base model',
              verdict: 'Strong fit',
              why: 'This is the design center: one shared base, N cheap adapters, mixed batching. You pay for the base weights once instead of N times.',
            },
            {
              situation: 'Per-customer or per-tenant personas at modest scale',
              verdict: 'Strong fit',
              why: 'Each tenant gets its own adapter, all served from one base. The CPU LRU cache lets the catalog of adapters dwarf what fits on the GPU.',
            },
            {
              situation: 'Hostile multi-tenant, adapters supplied by untrusted users at runtime',
              verdict: 'Caution',
              why: 'Static registration is fine; dynamic runtime loading is explicitly not for production outside a trusted boundary. Do not expose load_lora_adapter to untrusted callers.',
            },
            {
              situation: 'A handful of adapters, all of them always hot',
              verdict: 'Good fit',
              why: 'Set max_loras to cover them all and they stay resident on the GPU; the CPU cache rarely engages. Simplest possible multi-LoRA setup.',
            },
            {
              situation: 'Specializations that diverge heavily from the base',
              verdict: 'Reconsider',
              why: 'LoRA captures low-rank deltas. If a use case needs the model to behave very differently, a full fine-tune (its own replica) may serve quality better than a high-rank adapter — weigh quality against the cost of a separate model.',
            },
            {
              situation: 'One model, no specializations',
              verdict: 'Skip',
              why: 'Nothing to gain. Leave --enable-lora off; the LoRA machinery is pure overhead with no adapters to serve.',
            },
          ]}
        />
      </Container>
    </SpaceBetween>
  );
}
