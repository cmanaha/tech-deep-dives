import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Table from '@cloudscape-design/components/table';
import Alert from '@cloudscape-design/components/alert';
import { Cite, vllmUrl, vllmDocsUrl } from '../components/Cite';

const LORA_DOCS = vllmDocsUrl('features/lora/');
const LORA_MD = 'docs/features/lora.md';
const LORA_CFG = 'vllm/config/lora.py';
const MODELS = 'vllm/entrypoints/openai/models/serving.py';
const ROUTER = 'vllm/entrypoints/serve/lora/api_router.py';
const SERVE_CLI = 'vllm/entrypoints/cli/serve.py';
const VLLM_CFG = 'vllm/config/vllm.py';
const GIE_PROTOCOL =
  'https://github.com/kubernetes-sigs/gateway-api-inference-extension/blob/v1.6.2/docs/proposals/003-model-server-protocol/README.md';

function MixedBatchDiagram() {
  const blue = '#0972d3';
  const green = '#1d8102';
  const amber = '#8b6c00';
  const slate = '#414d5c';
  const secondary = '#5f6b7a';
  const text = '#16191f';
  const blueFill = '#f2f8fd';
  const greenFill = '#e8f5e9';
  const amberFill = '#fbf3e6';
  const grayFill = '#f4f4f4';
  const border = '#879596';
  const font = 'sans-serif';

  // Incoming requests (left column): each names a model.
  const reqs = [
    { label: 'req → "sql-lora"', fill: blueFill },
    { label: 'req → "base"', fill: grayFill },
    { label: 'req → "tone-lora"', fill: greenFill },
    { label: 'req → "sql-lora"', fill: blueFill },
    { label: 'req → "persona-7"', fill: amberFill },
  ];
  const reqX = 24;
  const reqW = 150;
  const reqH = 30;
  const reqGap = 8;
  const reqTop = 80;
  const reqBottom = reqTop + reqs.length * (reqH + reqGap) - reqGap;

  // Scheduler box.
  const schedY = reqBottom + 26;
  const schedH = 70;
  const schedMidY = schedY + schedH / 2;

  // Replica frame and the boxes inside it (top to bottom: base, kernels, slots).
  const repX = 220;
  const repY = 36;
  const repW = 580;
  const repH = 330;
  const innerX = repX + 24;
  const innerW = repW - 48;
  const midX = innerX + innerW / 2;
  const baseY = 76;
  const baseH = 52;
  const kernY = 152;
  const kernH = 76;
  const slotsBoxY = 256;
  const slotsBoxH = 96;

  // Three GPU adapter slots: the picture is drawn with --max-loras 3.
  const slots = [
    { name: 'sql-lora', fill: blueFill, stroke: blue },
    { name: 'tone-lora', fill: greenFill, stroke: green },
    { name: 'persona-7', fill: amberFill, stroke: amber },
  ];
  const slotLeft = innerX + 12;
  const slotW = 156;
  const slotGap = 20;
  const slotY = slotsBoxY + 32;
  const slotH = 52;

  // CPU cache below the replica frame.
  const cacheY = repY + repH + 32;
  const cacheH = 54;

  return (
    <svg
      role="img"
      aria-labelledby="mixed-batch-title"
      aria-describedby="mixed-batch-desc"
      style={{ width: '100%', minWidth: 640, height: 'auto' }}
      viewBox="0 0 820 472"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id="mixed-batch-title">
        One copy of the base weights and three GPU adapter slots serve a mixed batch of five
        requests in one forward pass, a picture that needs --max-loras 3 because the default of 1
        allows one adapter per batch.
      </title>
      <desc id="mixed-batch-desc">
        Five incoming requests each name a model: three LoRA adapters and the raw base model. The
        scheduler admits up to three distinct adapters into one batch for a single GPU replica that
        holds the base weights once. The shrink and expand kernels add each row&apos;s adapter delta
        in one forward pass, reading B and A from that row&apos;s slot; the base row adds nothing.
        Adapters page between the slots and a host-RAM cache sized by --max-cpu-loras, which
        defaults to the --max-loras value.
      </desc>
      <defs>
        <marker
          id="lora-mb-arrow"
          markerWidth="9"
          markerHeight="9"
          refX="8"
          refY="4.5"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L9,4.5 L0,9 z" fill={secondary} />
        </marker>
      </defs>
      <rect x={0} y={0} width={820} height={472} rx={8} fill="#ffffff" />

      {/* ---- Left column: incoming requests ---- */}
      <text x={reqX} y={reqTop - 28} fontSize={13} fontWeight="bold" fill={text} fontFamily={font}>
        Incoming requests
      </text>
      <text x={reqX} y={reqTop - 12} fontSize={11} fill={secondary} fontFamily={font}>
        (each names a model)
      </text>
      {reqs.map((r, i) => {
        const y = reqTop + i * (reqH + reqGap);
        return (
          <g key={`req-${i}`}>
            <rect x={reqX} y={y} width={reqW} height={reqH} rx={5} fill={r.fill} stroke={border} strokeWidth={1.1} />
            <text x={reqX + 12} y={y + 19} fontSize={12} fill={text} fontFamily={font}>
              {r.label}
            </text>
          </g>
        );
      })}

      {/* requests -> scheduler */}
      <line
        x1={reqX + reqW / 2}
        y1={reqBottom + 2}
        x2={reqX + reqW / 2}
        y2={schedY - 3}
        stroke={secondary}
        strokeWidth={1.6}
        markerEnd="url(#lora-mb-arrow)"
      />

      {/* ---- Scheduler ---- */}
      <rect x={reqX} y={schedY} width={reqW} height={schedH} rx={6} fill="#ffffff" stroke={blue} strokeWidth={1.5} />
      <text x={reqX + reqW / 2} y={schedY + 22} textAnchor="middle" fontSize={13} fontWeight="bold" fill={blue} fontFamily={font}>
        scheduler
      </text>
      <text x={reqX + reqW / 2} y={schedY + 40} textAnchor="middle" fontSize={11} fill={secondary} fontFamily={font}>
        one mixed batch,
      </text>
      <text x={reqX + reqW / 2} y={schedY + 56} textAnchor="middle" fontSize={11} fill={secondary} fontFamily={font}>
        at most 3 adapters
      </text>

      {/* scheduler -> kernels (elbow into the replica) */}
      <path
        d={`M${reqX + reqW},${schedMidY} H198 V${kernY + kernH / 2} H${innerX - 3}`}
        fill="none"
        stroke={secondary}
        strokeWidth={1.6}
        markerEnd="url(#lora-mb-arrow)"
      />

      {/* ---- Replica frame ---- */}
      <rect x={repX} y={repY} width={repW} height={repH} rx={8} fill="none" stroke={secondary} strokeWidth={1.4} strokeDasharray="6 4" />
      <text x={midX} y={repY + 24} textAnchor="middle" fontSize={13} fontWeight="bold" fill={text} fontFamily={font}>
        single GPU replica
      </text>

      {/* base weights */}
      <rect x={innerX} y={baseY} width={innerW} height={baseH} rx={6} fill={blueFill} stroke={blue} strokeWidth={1.3} />
      <text x={midX} y={baseY + 22} textAnchor="middle" fontSize={12} fontWeight="bold" fill={text} fontFamily={font}>
        BASE MODEL WEIGHTS: loaded once, shared
      </text>
      <text x={midX} y={baseY + 40} textAnchor="middle" fontSize={11} fill={secondary} fontFamily={font}>
        frozen W, one copy for every row in the batch
      </text>

      {/* base -> kernels */}
      <line
        x1={midX}
        y1={baseY + baseH + 2}
        x2={midX}
        y2={kernY - 3}
        stroke={secondary}
        strokeWidth={1.4}
        markerEnd="url(#lora-mb-arrow)"
      />
      <text x={midX + 10} y={kernY - 8} fontSize={11} fill={secondary} fontFamily={font}>
        W
      </text>

      {/* batched kernel box */}
      <rect x={innerX} y={kernY} width={innerW} height={kernH} rx={6} fill="#ffffff" stroke={border} strokeWidth={1.2} />
      <text x={midX} y={kernY + 22} textAnchor="middle" fontSize={12} fontWeight="bold" fill={text} fontFamily={font}>
        shrink/expand LoRA kernels: one forward pass
      </text>
      <text x={midX} y={kernY + 42} textAnchor="middle" fontSize={11} fill={secondary} fontFamily={font}>
        y = Wx + B·A·x, with B and A from each row&apos;s adapter slot
      </text>
      <text x={midX} y={kernY + 60} textAnchor="middle" fontSize={11} fill={secondary} fontFamily={font}>
        rows: sql-lora, base (no delta), tone-lora, sql-lora, persona-7
      </text>

      {/* slots -> kernels */}
      <line
        x1={innerX + innerW - 36}
        y1={slotsBoxY - 2}
        x2={innerX + innerW - 36}
        y2={kernY + kernH + 3}
        stroke={secondary}
        strokeWidth={1.4}
        markerEnd="url(#lora-mb-arrow)"
      />
      <text x={innerX + innerW - 46} y={slotsBoxY - 10} textAnchor="end" fontSize={11} fill={secondary} fontFamily={font}>
        adapter deltas
      </text>

      {/* adapter slots container */}
      <rect x={innerX} y={slotsBoxY} width={innerW} height={slotsBoxH} rx={6} fill="#ffffff" stroke={slate} strokeWidth={1.2} />
      <text x={innerX + 12} y={slotsBoxY + 20} fontSize={12} fontWeight="bold" fill={text} fontFamily={font}>
        GPU adapter slots: --max-loras 3 (the default is 1)
      </text>
      {slots.map((s, i) => {
        const x = slotLeft + i * (slotW + slotGap);
        return (
          <g key={`slot-${i}`}>
            <rect x={x} y={slotY} width={slotW} height={slotH} rx={6} fill={s.fill} stroke={s.stroke} strokeWidth={1.3} />
            <text x={x + slotW / 2} y={slotY + 22} textAnchor="middle" fontSize={12} fontWeight="bold" fill={text} fontFamily={font}>
              {s.name}
            </text>
            <text x={x + slotW / 2} y={slotY + 40} textAnchor="middle" fontSize={11} fill={secondary} fontFamily={font}>
              B·A
            </text>
          </g>
        );
      })}

      {/* cache <-> slots (paging in both directions) */}
      <line
        x1={midX}
        y1={cacheY - 3}
        x2={midX}
        y2={slotsBoxY + slotsBoxH + 3}
        stroke={slate}
        strokeWidth={1.5}
        markerStart="url(#lora-mb-arrow)"
        markerEnd="url(#lora-mb-arrow)"
      />
      <text x={midX + 12} y={cacheY - 12} fontSize={11} fill={slate} fontFamily={font} fontStyle="italic">
        page in / evict (LRU)
      </text>

      {/* ---- CPU LRU cache (below replica) ---- */}
      <rect x={innerX} y={cacheY} width={innerW} height={cacheH} rx={6} fill={grayFill} stroke={slate} strokeWidth={1.3} />
      <text x={midX} y={cacheY + 22} textAnchor="middle" fontSize={12} fontWeight="bold" fill={text} fontFamily={font}>
        CPU LRU cache: --max-cpu-loras (defaults to --max-loras)
      </text>
      <text x={midX} y={cacheY + 40} textAnchor="middle" fontSize={11} fill={secondary} fontFamily={font}>
        adapters parked in host RAM; a miss reloads the adapter from its path
      </text>
    </svg>
  );
}

export function LoRAServing() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Serve many fine-tuned adapters from one copy of the base weights, pick one per request by name, and raise the defaults that allow one adapter per batch (verified against vLLM v0.31.0, commit db9527a4, 2026-10-16)"
          >
            13. LoRA &amp; Multi-Adapter Serving
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The challenge:</strong> you have one base model and a dozen specializations: a
            SQL generator, a support-tone rewriter, a per-customer persona, a classifier. A dozen full
            fine-tunes means a dozen complete copies of the weights, each pinned to its own GPUs, a
            dozen replicas to keep warm and a dozen things to deploy. Most of those bytes are{' '}
            <em>identical</em> to the base model; only a thin slice of weights differs.
          </Box>
          <Box variant="p">
            <strong>What LoRA serving buys:</strong> a LoRA (Low-Rank Adaptation) adapter is that
            thin slice. For each linear layer it adapts, it holds two matrices, A of shape r x
            d_in and B of shape d_out x r, and their product B&middot;A rides on top of the frozen
            weight{' '}
            <Cite tier={1} href={vllmUrl('vllm/lora/layers/base_linear.py', 'L133-L154')} kind="code">
              base_linear.py L133-L154
            </Cite>
            . Its size follows from those shapes: r x (d_in + d_out) values per adapted layer,
            summed over the adapted layers, times the bytes per value, against d_in x d_out for the
            layer itself. You load the base model <em>once</em> and attach many adapters to that one
            copy. vLLM <strong>selects the adapter per request</strong> by name and runs requests for{' '}
            <em>different</em> adapters <strong>together in a single batch</strong>: one base model,
            one set of GPUs, many specializations{' '}
            <Cite tier={1} href={LORA_DOCS}>
              vLLM docs: LoRA Adapters
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Why five requests for three adapters cost one forward pass, and why that picture needs --max-loras 3 when the default is 1"
          >
            One base model, many adapters, a mixed batch
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The base weights are loaded once and shared. Each request carries an adapter name, or
            none for the raw base model. The scheduler builds a batch from whatever requests are
            ready, whichever adapter each one wants, up to <code>--max-loras</code> distinct adapters
            per step: a waiting request whose adapter would exceed that count is skipped and stays
            queued{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/sched/scheduler.py', 'L911-L922')} kind="code">
              scheduler.py L911-L922
            </Cite>
            . The batched kernels then add each row&apos;s own adapter delta in the same forward
            pass. The diagram shows three adapters and a base-only request in one pass.
          </Box>

          <div style={{ overflowX: 'auto' }}>
            <MixedBatchDiagram />
          </div>
          <Box variant="small" color="text-body-secondary">
            Illustrative, not measured. Drawn with <code>--max-loras 3</code>. At the default of 1{' '}
            <Cite tier={1} href={vllmUrl(LORA_CFG, 'L37-L38')}>
              lora.py L37-L38
            </Cite>
            , the scheduler fills each step with one adapter&apos;s requests plus base requests, and
            requests for the other two adapters wait. Adapters page between the GPU slots and an LRU
            (least recently used) cache in host RAM.
          </Box>

          <ExpandableSection headerText="The kernels behind the mixed batch">
            <Box variant="p">
              On CUDA, <code>PunicaWrapperGPU</code> drives Triton <code>lora_shrink</code> and{' '}
              <code>lora_expand</code> kernels (plus <code>fused_moe_lora</code> for
              mixture-of-experts layers), following the Punica design for multi-tenant LoRA serving{' '}
              <Cite tier={1} href={vllmUrl('vllm/lora/punica_wrapper/punica_gpu.py', 'L1-L37')} kind="code">
                punica_gpu.py L1-L37
              </Cite>
              . A per-token index picks each row&apos;s adapter slot, so one launch covers rows for
              different adapters. <strong>Inside the Codebase &rarr; Model Layer, Quant &amp; LoRA</strong>{' '}
              walks the default <code>add_lora_linear</code> path and the{' '}
              <code>--fully-sharded-loras</code> path against the source.
            </Box>
          </ExpandableSection>

          <Alert type="info" header="Why base requests share the batch">
            A base-only row has adapter index -1, so the LoRA term is skipped for that row, and a step
            with no adapter rows at all skips the LoRA kernels{' '}
            <Cite tier={1} href={vllmUrl('vllm/lora/punica_wrapper/utils.py', 'L35-L39')} kind="code">
              utils.py L35-L39
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/lora/ops/triton_ops/lora_kernel_metadata.py', 'L117-L123')} kind="code">
              lora_kernel_metadata.py L117-L123
            </Cite>
            . Mixed traffic needs no separate pass: adapted and base rows share one prefill and
            decode pass over the shared weights, and an adapter costs the extra{' '}
            <code>B&middot;A&middot;x</code> term on its own rows.
          </Alert>

          <Alert type="info" header="Shared weights, separate prefix cache">
            The adapter&apos;s name and path go into every prefix-cache block hash{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/kv_cache_utils.py', 'L567-L584')} kind="code">
              kv_cache_utils.py L567-L584
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/core/kv_cache_utils.py', 'L635')} kind="code">
              L635
            </Cite>
            . Requests under different adapters, or under an adapter and the base model, never reuse
            each other&apos;s cached KV (key/value) blocks, so a system prompt shared by five
            adapters is cached once per adapter. Budget prefix-cache capacity per adapter;{' '}
            <strong>6. Automatic Prefix Caching</strong> covers the hash chain.
          </Alert>

          <Box variant="p">
            LoRA runs on Model Runner V2, the default GPU runner, with its own LoRA state and
            CUDA-graph capture cases{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/worker/gpu/lora_utils.py', 'L20-L35')} kind="code">
              lora_utils.py L20-L35
            </Cite>
            ; it is absent from the features that send a deployment to the deprecated V1 model
            runner{' '}
            <Cite tier={1} href={vllmUrl(VLLM_CFG, 'L3051-L3103')} kind="code">
              vllm.py L3051-L3103
            </Cite>
            . Adaptive verification for speculative decoding is refused at startup when LoRA is
            enabled{' '}
            <Cite tier={1} href={vllmUrl(VLLM_CFG, 'L3151-L3161')} kind="code">
              vllm.py L3151-L3161
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Name adapters at startup and clients choose one with the model field, so the OpenAI API needs no extension"
          >
            How vLLM serves it: register at startup, select by name
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The production path is <strong>static registration</strong>. You name adapters at
            server startup and they become &quot;models&quot; the OpenAI-compatible endpoint can route
            to. The flag is <code>--lora-modules {'{name}={path} {name}={path}'}</code>: one flag,
            then one entry per adapter, because a repeated <code>--lora-modules</code> replaces the
            list the earlier one built. A JSON form adds a <code>base_model_name</code> per adapter{' '}
            <Cite tier={1} href={vllmUrl('vllm/entrypoints/launchers/cli_args.py', 'L35-L66')} kind="code">
              cli_args.py L35-L66
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/entrypoints/launchers/cli_args.py', 'L78-L82')} kind="code">
              L78-L82
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl(LORA_MD, 'L55')}>
              lora.md L55
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl(LORA_MD, 'L234-L249')}>
              lora.md L234-L249
            </Cite>
            . Set <code>--max-loras</code> to the number of adapters you want in one batch; the
            example raises it to 3 so its three adapters can share a step:
          </Box>

          <Box variant="code">
            <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>{String.raw`vllm serve meta-llama/Llama-3.2-3B-Instruct \
    --enable-lora \
    --max-loras 3 \
    --lora-modules sql-lora=jeeejeee/llama32-3b-text2sql-spider \
                   tone-lora=/models/tone-rewriter \
                   persona-7=/models/persona-7`}</pre>
          </Box>

          <Box variant="p">
            From the caller&apos;s side a request{' '}
            <strong>selects an adapter by putting its name in the <code>model</code> field</strong>{' '}
            (<code>{'"model": "sql-lora"'}</code>), exactly as it would name a base model.{' '}
            <code>/v1/models</code> lists the base model <em>and</em> every registered adapter, each
            adapter with its parent base model{' '}
            <Cite tier={1} href={vllmUrl(MODELS, 'L149-L165')} kind="code">
              serving.py L149-L165
            </Cite>
            . In the docs&apos; words, requests &quot;can specify the LoRA adapter as if it were any
            other model via the <code>model</code> request parameter&quot;{' '}
            <Cite tier={1} href={vllmUrl(LORA_MD, 'L88-L90')}>
              lora.md L88-L90
            </Cite>
            . Omit the adapter name, or name the base model, and you get the base model. An adapter{' '}
            <em>is</em> a model name, so the OpenAI-compatible surface needs no extension for
            multi-adapter serving. See <strong>12. The OpenAI-Compatible Server</strong> for the
            endpoint itself.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Two defaults to change before the first mixed batch: one adapter per batch and rank 16"
          >
            The knobs that govern memory and concurrency
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Six flags set what multi-LoRA serving costs and how many adapters run at once. The help
            text is quoted from the LoRA configuration; the reading in the last column is ours. Two
            defaults decide the first mixed batch: <code>--max-loras 1</code> allows one adapter per
            batch, and <code>--max-lora-rank 16</code> rejects any adapter of higher rank.
          </Box>

          <Table
            variant="embedded"
            wrapLines
            header={<Header variant="h3">LoRA engine arguments</Header>}
            columnDefinitions={[
              { id: 'flag', header: 'Flag', minWidth: 190, cell: (i) => <code>{i.flag}</code> },
              { id: 'def', header: 'Default', cell: (i) => i.def },
              { id: 'doc', header: 'Help text', cell: (i) => i.doc },
              { id: 'use', header: 'How to think about it', cell: (i) => i.use },
            ]}
            items={[
              {
                flag: '--enable-lora',
                def: 'off',
                doc: '"If True, enable handling of LoRA adapters."',
                use: 'The master switch. With it on, every adapter slot is reserved in GPU memory (see the cost below), so leave it off when you serve no adapters.',
              },
              {
                flag: '--max-loras',
                def: '1',
                doc: '"Max number of LoRAs in a single batch."',
                use: 'The GPU working set: distinct adapters per batch, one slot each. At the default of 1, a request for a second adapter waits until the first adapter leaves the batch. Registered adapters beyond this count page in from the CPU cache.',
              },
              {
                flag: '--max-lora-rank',
                def: '16 (allowed: 1, 8, 16, 32, 64, 128, 256, 320, 512)',
                doc: '"Max LoRA rank."',
                use: (
                  <>
                    Every slot is sized at this rank, so set it to your largest adapter&apos;s rank
                    and no higher{' '}
                    <Cite tier={1} href={vllmUrl(LORA_MD, 'L446-L461')}>
                      lora.md L446-L461
                    </Cite>
                    . A higher-rank adapter fails to load with &quot;LoRA rank r is greater than
                    max_lora_rank 16&quot;, and an adapter with bias terms is rejected too{' '}
                    <Cite tier={1} href={vllmUrl('vllm/lora/peft_helper.py', 'L123-L136')} kind="code">
                      peft_helper.py L123-L136
                    </Cite>
                    .
                  </>
                ),
              },
              {
                flag: '--max-cpu-loras',
                def: 'the --max-loras value',
                doc: '"Maximum number of LoRAs to store in CPU memory. Must be >= than max_loras."',
                use: 'The host-RAM LRU cache of loaded adapters. A registered adapter outside it is read again from its path when a batch needs it.',
              },
              {
                flag: '--fully-sharded-loras',
                def: 'off',
                doc: '"By default, only half of the LoRA computation is sharded with tensor parallelism. Enabling this will use the fully sharded layers. At high sequence length, max rank or tensor parallel size, this is likely faster."',
                use: 'A tensor-parallel tuning knob. "Likely faster" is the project\'s guidance, not a measurement: benchmark it against the default path at your tensor-parallel size.',
              },
              {
                flag: '--lora-target-modules',
                def: 'all supported modules',
                doc: '"Restrict LoRA to specific module suffixes (e.g., ["o_proj", "qkv_proj"]). If None, all supported LoRA modules are used."',
                use: (
                  <>
                    Restricts which layers carry LoRA at deployment time; the docs frame it as
                    performance tuning{' '}
                    <Cite tier={1} href={vllmUrl(LORA_MD, 'L463-L475')}>
                      lora.md L463-L475
                    </Cite>
                    .
                  </>
                ),
              },
            ]}
          />
          <Box variant="small">
            Defaults and help text:{' '}
            <Cite tier={1} href={vllmUrl(LORA_CFG, 'L27-L52')}>
              lora.py L27-L52
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl(LORA_CFG, 'L119-L127')}>
              L119-L127
            </Cite>
            ; flags:{' '}
            <Cite tier={1} href={vllmUrl('vllm/engine/arg_utils.py', 'L1541-L1562')}>
              arg_utils.py L1541-L1562
            </Cite>
            ; reference page:{' '}
            <Cite tier={1} href={vllmDocsUrl('api/vllm/config/lora/')}>
              vLLM docs: LoRAConfig
            </Cite>
            .
          </Box>

          <Box variant="p">
            <strong>What the slots cost.</strong> Each LoRA-wrapped linear layer pre-allocates its A
            and B buffers for every slot at the maximum rank: on a single GPU,{' '}
            <code>--max-loras</code> x <code>--max-lora-rank</code> x (d_in + d_out) values per
            layer, in the LoRA dtype, which defaults to the base model&apos;s{' '}
            <Cite tier={1} href={vllmUrl('vllm/lora/layers/base_linear.py', 'L111-L154')} kind="code">
              base_linear.py L111-L154
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl(LORA_CFG, 'L47-L48')}>
              lora.py L47-L48
            </Cite>
            . Raising either flag raises that reservation in proportion, whether or not the slots
            fill.
          </Box>

          <Alert type="info">
            <strong>The mental model: three tiers.</strong> <code>--max-loras</code> is your{' '}
            <em>GPU working set</em> of adapters, <code>--max-cpu-loras</code> is a{' '}
            <em>host-RAM cache</em> at least as large, and the registered adapter list is the{' '}
            <em>catalog</em>, read from each adapter&apos;s path on a cache miss{' '}
            <Cite tier={1} href={vllmUrl('vllm/lora/worker_manager.py', 'L276-L327')} kind="code">
              worker_manager.py L276-L327
            </Cite>
            . Adapters cycle between the tiers on an LRU basis, and <code>--max-lora-rank</code>{' '}
            sizes every slot.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Load, replace and resolve adapters while the server runs, and the rules that decide whether a call succeeds"
          >
            Runtime loading: new adapters without a restart, inside a trusted boundary
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Set <code>VLLM_ALLOW_RUNTIME_LORA_UPDATING</code> to <code>1</code> or <code>true</code>{' '}
            (any case) and the server registers two more routes:{' '}
            <code>POST /v1/load_lora_adapter</code>, with a <code>lora_name</code> and{' '}
            <code>lora_path</code>, and <code>POST /v1/unload_lora_adapter</code>, with a{' '}
            <code>lora_name</code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/envs.py', 'L1199-L1203')} kind="code">
              envs.py L1199-L1203
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl(ROUTER, 'L23-L99')} kind="code">
              api_router.py L23-L99
            </Cite>
            . Without the variable the routes are never registered, so the server has no such
            endpoints. With it, startup logs &quot;LoRA dynamic loading &amp; unloading is enabled in
            the API server. This should ONLY be used for local development!&quot;{' '}
            <Cite tier={1} href={vllmUrl(ROUTER, 'L30-L36')} kind="code">
              api_router.py L30-L36
            </Cite>
            , a line worth alerting on wherever runtime loading should be off. Inside a trusted
            environment it suits fast iteration: push a freshly trained adapter and serve it without
            a restart.
          </Box>

          <Alert type="warning">
            <strong>Quoted from the docs, verbatim:</strong>{' '}
            <em>
              &quot;This feature comes with security risks. It should not be used in production unless
              it is an isolated, fully trusted environment.&quot;
            </em>{' '}
            <Cite tier={1} href={vllmUrl(LORA_MD, 'L109-L110')}>
              lora.md L109-L110
            </Cite>
          </Alert>

          <Box variant="p">
            The load endpoint takes a <strong>path</strong> and the server reads adapter weights from
            it, so an attacker who can reach the endpoint can make the server load weights of their
            choosing. Keep it behind a trust boundary: a developer sandbox, a single-tenant
            continuous-integration loop or an isolated internal environment where every caller is
            trusted. For anything fronting real users, register adapters with{' '}
            <code>--lora-modules</code> and treat the adapter set as part of the deployment artifact.
          </Box>

          <Table
            variant="embedded"
            wrapLines
            header={<Header variant="h3">Rules a runtime load has to pass</Header>}
            columnDefinitions={[
              { id: 'case', header: 'Situation', cell: (i) => i.case },
              { id: 'does', header: 'What the server does', cell: (i) => i.does },
              { id: 'right', header: 'How to get it right', cell: (i) => i.right },
            ]}
            items={[
              {
                case: 'More than one API server process',
                does: (
                  <>
                    Startup fails with &quot;VLLM_ALLOW_RUNTIME_LORA_UPDATING cannot be used with
                    api_server_count &gt; 1&quot;{' '}
                    <Cite tier={1} href={vllmUrl(SERVE_CLI, 'L304-L307')} kind="code">
                      serve.py L304-L307
                    </Cite>
                  </>
                ),
                right: (
                  <>
                    With data parallelism behind the internal load balancer the count defaults to the
                    data-parallel size, so pass <code>--api-server-count 1</code>{' '}
                    <Cite tier={1} href={vllmUrl(SERVE_CLI, 'L105-L127')} kind="code">
                      serve.py L105-L127
                    </Cite>
                    . A runtime load then reaches every data-parallel engine: the client sends{' '}
                    <code>add_lora</code> to each engine and returns the first result{' '}
                    <Cite tier={1} href={vllmUrl('vllm/v1/engine/core_client.py', 'L1318-L1319')} kind="code">
                      core_client.py L1318-L1319
                    </Cite>{' '}
                    <Cite tier={1} href={vllmUrl('vllm/v1/engine/core_client.py', 'L1642-L1651')} kind="code">
                      core_client.py L1642-L1651
                    </Cite>
                    .
                  </>
                ),
              },
              {
                case: 'Adapter named after a served base model',
                does: (
                  <>
                    HTTP 400: the adapter &quot;conflicts with a served base model&quot;{' '}
                    <Cite tier={1} href={vllmUrl(MODELS, 'L258-L264')} kind="code">
                      serving.py L258-L264
                    </Cite>
                  </>
                ),
                right: 'Name adapters apart from every served base model name.',
              },
              {
                case: 'Name already loaded',
                does: (
                  <>
                    HTTP 400 unless the request sets <code>{'"load_inplace": true'}</code>, which
                    replaces the adapter under the same name{' '}
                    <Cite tier={1} href={vllmUrl(MODELS, 'L266-L275')} kind="code">
                      serving.py L266-L275
                    </Cite>
                  </>
                ),
                right: (
                  <>
                    The in-place path is built for asynchronous RL (reinforcement learning), where
                    adapters are retrained and swapped in without interrupting inference{' '}
                    <Cite tier={1} href={vllmUrl(LORA_MD, 'L216-L232')}>
                      lora.md L216-L232
                    </Cite>
                    .
                  </>
                ),
              },
              {
                case: 'Reload in place from the same path',
                does: (
                  <>
                    Accepted, with a warning that prefix-cache blocks computed with the previous
                    weights are not invalidated{' '}
                    <Cite tier={1} href={vllmUrl(MODELS, 'L215-L224')} kind="code">
                      serving.py L215-L224
                    </Cite>
                  </>
                ),
                right: 'Publish each new version at a new path. The path is part of every block hash, so new weights never reuse KV computed with the old ones.',
              },
            ]}
          />

          <Box variant="p">
            <strong>Resolver plugins load an adapter on first request.</strong> With runtime updating
            on, a request whose <code>model</code> names neither a base model nor a loaded adapter
            goes to the installed <code>LoRAResolver</code> plugins, which try to fetch and load an
            adapter of that name before the request runs{' '}
            <Cite tier={1} href={vllmUrl('vllm/entrypoints/serve/engine/serving.py', 'L49-L71')} kind="code">
              engine/serving.py L49-L71
            </Cite>
            . vLLM ships a filesystem resolver over <code>VLLM_LORA_RESOLVER_CACHE_DIR</code> and a
            Hugging Face Hub resolver over <code>VLLM_LORA_RESOLVER_HF_REPO_LIST</code>; an S3 resolver
            is a plugin you write{' '}
            <Cite tier={1} href={vllmUrl('vllm/envs.py', 'L1171-L1183')} kind="code">
              envs.py L1171-L1183
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl(LORA_MD, 'L163-L212')}>
              lora.md L163-L212
            </Cite>
            . The docs say to name the filesystem resolver in <code>VLLM_PLUGINS</code>{' '}
            <Cite tier={1} href={vllmUrl(LORA_MD, 'L166')} kind="doc-code-conflict">
              lora.md L166
            </Cite>
            , but with <code>VLLM_PLUGINS</code> unset vLLM loads every installed plugin, so the
            filesystem resolver arms as soon as its directory is set; the Hub resolver, which
            downloads remotely, must also be named in <code>VLLM_PLUGINS</code>{' '}
            <Cite tier={1} href={vllmUrl('vllm/plugins/lora_resolvers/filesystem_resolver.py', 'L49-L61')} kind="code">
              filesystem_resolver.py L49-L61
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/plugins/__init__.py', 'L56-L64')} kind="code">
              plugins/__init__.py L56-L64
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/plugins/lora_resolvers/hf_hub_resolver.py', 'L129-L145')} kind="code">
              hf_hub_resolver.py L129-L145
            </Cite>
            . A resolver is the same trust boundary as the load endpoint, reached through any
            request&apos;s <code>model</code> field.
          </Box>

          <Alert type="info">
            <strong>Runtime loads stay on one server.</strong> A load call records the adapter in the
            list of the server that received it{' '}
            <Cite tier={1} href={vllmUrl(MODELS, 'L215-L229')} kind="code">
              serving.py L215-L229
            </Cite>
            ; separate <code>vllm serve</code> replicas each keep their own. Keeping a
            runtime-managed adapter set consistent across a fleet falls to the orchestration layer,
            which is why multi-tenant production pairs static registration with the adapter-aware
            routing below.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Send each request to a replica already serving its adapter, using the gauge vLLM exports"
          >
            The Kubernetes angle: routing by adapter
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Once you scale past one replica, &quot;which replica is serving adapter X right now?&quot;
            becomes a routing question. A load balancer that ignores adapters scatters requests across
            replicas, so a request for <code>sql-lora</code> may land on a replica that has paged that
            adapter out, forcing a reload into a cold slot. <strong>Adapter-aware routing</strong>{' '}
            sends each request to a replica that already holds the adapter it wants.
          </Box>
          <Box variant="p">
            The <strong>Gateway API Inference Extension</strong> (a Kubernetes project for
            self-hosting generative models) implements this. Its model-aware routing &quot;extends to
            Low-Rank Adaptation (LoRA) fine-tuned models,&quot; and it routes on capability data the
            model servers expose: &quot;Data provided by model serving platforms about performance,
            availability and capabilities to optimize routing. Includes things like Prefix Cache
            status or LoRA Adapters availability&quot;{' '}
            <Cite tier={1} href="https://gateway-api-inference-extension.sigs.k8s.io/">
              Gateway API Inference Extension: project site
            </Cite>
            .
          </Box>
          <Box variant="p">
            On the vLLM side the signal is the Prometheus gauge <code>vllm:lora_requests_info</code>,
            &quot;Running stats on lora requests.&quot; Its labels carry <code>max_lora</code> (the{' '}
            <code>--max-loras</code> value) and two comma-separated adapter lists,{' '}
            <code>running_lora_adapters</code> and <code>waiting_lora_adapters</code>, and its value
            is the time of the last update{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/metrics/loggers.py', 'L988-L1001')} kind="code">
              loggers.py L988-L1001
            </Cite>{' '}
            <Cite tier={1} href={vllmUrl('vllm/v1/metrics/loggers.py', 'L1099-L1111')} kind="code">
              L1099-L1111
            </Cite>
            . The gateway reads it to place a request on a replica already serving its adapter. The
            Kubernetes integration lives in{' '}
            <strong>17. Kubernetes: llm-d, KServe &amp; Gateway API</strong>; scraping the metrics is
            covered in <strong>20. Observability &amp; Benchmarking</strong>.
          </Box>

          <ExpandableSection headerText="What the gateway protocol asks of vLLM, and where the two diverge">
            <SpaceBetween size="s">
              <Box variant="p">
                The model-server protocol at Gateway API Inference Extension v1.6.2 requires a server
                to serve an adapter named in the request&apos;s <code>model</code> argument and to
                export <code>vllm:lora_requests_info</code> with <code>max_lora</code>,{' '}
                <code>running_lora_adapters</code> and <code>waiting_lora_adapters</code>{' '}
                <Cite tier={1} href={`${GIE_PROTOCOL}#L43-L57`}>
                  Inference Extension v1.6.2 protocol L43-L57
                </Cite>
                . Static registration meets both requirements.
              </Box>
              <Box variant="p">
                <strong>Demand, not residency.</strong> The protocol describes{' '}
                <code>running_lora_adapters</code> as adapters &quot;currently loaded in GPU memory and
                ready to serve requests&quot; and <code>waiting_lora_adapters</code> as adapters
                &quot;waiting to be served&quot;. vLLM fills both labels from one per-adapter table of
                requests, so both list the same adapters: every adapter with at least one running or
                waiting request{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/metrics/stats.py', 'L613-L645')} kind="code">
                  stats.py L613-L645
                </Cite>{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/metrics/loggers.py', 'L1099-L1111')} kind="code">
                  loggers.py L1099-L1111
                </Cite>
                . An adapter idle in a GPU slot appears in neither. Under data parallelism vLLM warns
                that the gauge &quot;may be incorrect/misleading&quot;{' '}
                <Cite tier={1} href={vllmUrl('vllm/v1/metrics/loggers.py', 'L983-L987')} kind="code">
                  loggers.py L983-L987
                </Cite>
                .
              </Box>
              <Box variant="p">
                <strong>Tuned for runtime loading.</strong> The LoRA affinity algorithm in the
                protocol&apos;s reference EPP (Endpoint Picker) &quot;is highly biased towards
                vLLM&apos;s current dynamic LoRA implementation&quot;{' '}
                <Cite tier={1} href={`${GIE_PROTOCOL}#L37-L41`}>
                  Inference Extension v1.6.2 protocol L37-L41
                </Cite>
                , while the pattern below registers adapters statically. Check where the router places
                requests against <code>vllm:lora_requests_info</code> on your own adapter set before
                you rely on it.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Whether LoRA fits your workload, then the four steps that deploy a multi-tenant adapter fleet"
          >
            When LoRA serving is the right call
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Table
            variant="embedded"
            wrapLines
            columnDefinitions={[
              { id: 'situation', header: 'Situation', cell: (i) => i.situation },
              { id: 'verdict', header: 'Verdict', cell: (i) => i.verdict },
              { id: 'why', header: 'Why', cell: (i) => i.why },
            ]}
            items={[
              {
                situation: 'Many specializations of one base model',
                verdict: 'Strong fit',
                why: 'This is the design center: one shared base, N small adapters, mixed batching. You pay for the base weights once instead of N times.',
              },
              {
                situation: 'Per-customer or per-tenant personas at modest scale',
                verdict: 'Strong fit',
                why: 'Each tenant gets its own adapter, all served from one base. The CPU cache and the registered catalog let the adapter set exceed what fits on the GPU.',
              },
              {
                situation: 'Hostile multi-tenant, adapters supplied by untrusted users at runtime',
                verdict: 'Caution',
                why: 'Static registration is fine; runtime loading and resolver plugins belong inside a trusted boundary. Do not expose load_lora_adapter to untrusted callers.',
              },
              {
                situation: 'A handful of adapters, all of them always hot',
                verdict: 'Good fit',
                why: 'Set --max-loras to cover them all (the default is 1) and they stay resident on the GPU; the CPU cache rarely engages. The simplest multi-LoRA setup.',
              },
              {
                situation: 'Specializations that diverge heavily from the base',
                verdict: 'Reconsider',
                why: 'LoRA captures low-rank deltas. If a use case needs the model to behave very differently, a full fine-tune (its own replica) may serve quality better than a high-rank adapter. Weigh quality against the cost of a separate model.',
              },
              {
                situation: 'One model, no specializations',
                verdict: 'Skip',
                why: 'Nothing to gain. Leave --enable-lora off: with it on, adapter slots are reserved in GPU memory with no adapters to fill them.',
              },
            ]}
          />

          <Box variant="h3">The production pattern for a multi-tenant adapter fleet</Box>
          <Box variant="p">
            <strong>1. Register statically.</strong> Bake the adapter set into the deployment with{' '}
            <code>--lora-modules</code> instead of runtime <code>load_lora_adapter</code> calls for
            user-facing traffic. The adapter set becomes a versioned artifact rather than a runtime
            input, which keeps the untrusted-path risk out of production.
          </Box>
          <Box variant="p">
            <strong>2. Size the tiers.</strong> Set <code>--max-loras</code> to the distinct adapters
            you want in one batch (the default of 1 runs one adapter at a time),{' '}
            <code>--max-cpu-loras</code> to the adapters you want resident in host RAM (at least{' '}
            <code>--max-loras</code>, and equal to it unless set), and <code>--max-lora-rank</code>{' '}
            to your largest adapter&apos;s rank. Slots are reserved at full rank whether or not they
            fill.
          </Box>
          <Box variant="p">
            <strong>3. Route by adapter.</strong> Front the fleet with the Gateway API Inference
            Extension, or another adapter-aware router reading <code>vllm:lora_requests_info</code>,
            so requests land on a replica already serving the target adapter and each replica&apos;s
            GPU working set stays stable.
          </Box>
          <Box variant="p">
            <strong>4. Keep runtime loading in trusted lanes.</strong> Set{' '}
            <code>VLLM_ALLOW_RUNTIME_LORA_UPDATING</code>, and with it any resolver plugin, only in
            isolated, fully trusted environments such as development, continuous integration and
            internal experimentation, and publish each retrained adapter at a new path. Dynamic in
            development, static in production is the default split.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
