import type { ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Table from '@cloudscape-design/components/table';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';
import { Cite, sglangUrl, sglangTreeUrl, sglangDocsSrcUrl } from '../components/Cite';

const ENGINE = 'python/sglang/srt/entrypoints/engine.py';
const HTTP = 'python/sglang/srt/entrypoints/http_server.py';
const SERVER_ARGS = 'python/sglang/srt/server_args.py';
const SCHEDULER = 'python/sglang/srt/managers/scheduler.py';
const DP_CTRL = 'python/sglang/srt/managers/data_parallel_controller.py';
const SERVING = 'python/sglang/srt/arg_groups/fields/serving.py';
const RUST_APP = 'rust/sglang-server/src/api_server/http';

const VLLM_CORE_STEP =
  'https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/engine/core.py#L640-L641';
const VLLM_EXECUTOR_RPC =
  'https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/v1/executor/multiproc_executor.py#L340-L351';
const VLLM_RUST_FRONTEND =
  'https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/envs.py#L1441-L1443';
const VLLM_RUST_TEXT =
  'https://github.com/vllm-project/vllm/blob/v0.31.0/rust/src/text/src/lib.rs#L4-L8';
const VLLM_RUST_README = 'https://github.com/vllm-project/vllm/blob/v0.31.0/rust/README.md#L3';
const RELEASE_NOTES = 'https://github.com/sgl-project/sglang/releases/tag/v0.5.22';

function RuntimePipelineDiagram() {
  const blue = '#0972d3';
  const blueDark = '#065299';
  const blueFill = '#f2f8fd';
  const neutral = '#879596';
  const text = '#16191f';
  const secondary = '#5f6b7a';
  const slateFill = '#f4f4f4';
  const font = 'sans-serif';

  const ringY = 80;
  const ringH = 104;
  const ringW = 226;
  const mainX = 20;
  const tp0X = 337;
  const detokX = 654;
  const edgeY = 150;

  const rankY = 264;
  const rankH = 56;
  const rankW = 104;
  const rankStep = 126;
  const busY = 236;
  const dropX = 400;

  const ranks = [1, 2, 3, 4, 5, 6, 7];

  const ringBox = (
    x: number,
    title: string,
    lines: string[],
    fill: string,
    stroke: string,
    strokeWidth: number,
  ) => (
    <g>
      <rect
        x={x}
        y={ringY}
        width={ringW}
        height={ringH}
        rx={8}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
      <text
        x={x + ringW / 2}
        y={ringY + 24}
        textAnchor="middle"
        fontSize={14}
        fontWeight={600}
        fill={text}
        fontFamily={font}
      >
        {title}
      </text>
      {lines.map((line, i) => (
        <text
          key={line}
          x={x + ringW / 2}
          y={ringY + 46 + i * 18}
          textAnchor="middle"
          fontSize={12}
          fill={i === lines.length - 1 ? secondary : text}
          fontFamily={font}
        >
          {line}
        </text>
      ))}
    </g>
  );

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 900 440"
        role="img"
        aria-labelledby="runtime-pipeline-title"
        aria-describedby="runtime-pipeline-desc"
        style={{ width: '100%', minWidth: 660, height: 'auto' }}
      >
        <title id="runtime-pipeline-title">
          A tensor-parallel launch over eight GPUs runs 10 processes: the main process with the
          HTTP server and TokenizerManager, eight scheduler processes that each drive one GPU, and
          one detokenizer. Requests and generated tokens travel one way around a ZMQ ring, and only
          the rank-0 scheduler reads the ring, broadcasting new requests to the other seven ranks so
          each builds the same batch.
        </title>
        <desc id="runtime-pipeline-desc">
          Main process to scheduler TP0 carries tokenized requests, TP0 to the detokenizer carries
          sampled token ids, and the detokenizer returns text to the TokenizerManager. Below TP0, a
          broadcast over the TP group&apos;s CPU process group reaches schedulers TP1 to TP7 on GPUs 1
          to 7.
        </desc>
        <defs>
          <marker
            id="runtime-pipeline-ah"
            markerWidth="8"
            markerHeight="8"
            refX="8"
            refY="4"
            orient="auto-start-reverse"
            markerUnits="userSpaceOnUse"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill={secondary} />
          </marker>
          <marker
            id="runtime-pipeline-ah-blue"
            markerWidth="8"
            markerHeight="8"
            refX="8"
            refY="4"
            orient="auto-start-reverse"
            markerUnits="userSpaceOnUse"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill={blue} />
          </marker>
        </defs>

        <rect x={0} y={0} width={900} height={440} rx={8} fill="#ffffff" />

        {/* Return edge of the ring: detokenizer back to the TokenizerManager */}
        <path
          d={`M ${detokX + ringW / 2} ${ringY} L ${detokX + ringW / 2} 46 L ${mainX + ringW / 2} 46 L ${mainX + ringW / 2} ${ringY - 2}`}
          fill="none"
          stroke={secondary}
          strokeWidth={1.5}
          markerEnd="url(#runtime-pipeline-ah)"
        />
        <text
          x={450}
          y={34}
          textAnchor="middle"
          fontSize={12}
          fill={secondary}
          fontFamily={font}
        >
          text, streamed back to the TokenizerManager
        </text>

        {ringBox(
          mainX,
          'Main process',
          ['HTTP server (FastAPI)', 'TokenizerManager', 'ps: your launch command'],
          '#ffffff',
          neutral,
          1.2,
        )}
        {ringBox(
          tp0X,
          'Scheduler TP0, GPU 0',
          ['+ TpModelWorker, ModelRunner', 'the only rank reading ZMQ', 'sglang::scheduler_TP0'],
          blueFill,
          blue,
          2,
        )}
        {ringBox(
          detokX,
          'Detokenizer',
          ['DetokenizerManager', 'token ids to text', 'sglang::detokenizer'],
          '#ffffff',
          neutral,
          1.2,
        )}

        {/* Ring edge: main to TP0 */}
        <line
          x1={mainX + ringW}
          y1={edgeY}
          x2={tp0X - 2}
          y2={edgeY}
          stroke={secondary}
          strokeWidth={1.5}
          markerEnd="url(#runtime-pipeline-ah)"
        />
        <text x={291.5} y={126} textAnchor="middle" fontSize={12} fill={secondary} fontFamily={font}>
          tokenized
        </text>
        <text x={291.5} y={140} textAnchor="middle" fontSize={12} fill={secondary} fontFamily={font}>
          requests
        </text>

        {/* Ring edge: TP0 to detokenizer */}
        <line
          x1={tp0X + ringW}
          y1={edgeY}
          x2={detokX - 2}
          y2={edgeY}
          stroke={secondary}
          strokeWidth={1.5}
          markerEnd="url(#runtime-pipeline-ah)"
        />
        <text x={608.5} y={126} textAnchor="middle" fontSize={12} fill={secondary} fontFamily={font}>
          sampled
        </text>
        <text x={608.5} y={140} textAnchor="middle" fontSize={12} fill={secondary} fontFamily={font}>
          token ids
        </text>

        {/* Rank-0 broadcast to the other TP ranks */}
        <line
          x1={dropX}
          y1={ringY + ringH}
          x2={dropX}
          y2={busY}
          stroke={blue}
          strokeWidth={1.8}
        />
        <line
          x1={20 + rankW / 2}
          y1={busY}
          x2={20 + 6 * rankStep + rankW / 2}
          y2={busY}
          stroke={blue}
          strokeWidth={1.8}
        />
        <text x={412} y={206} fontSize={12} fill={blueDark} fontFamily={font}>
          rank 0 broadcasts new requests to every TP rank
        </text>
        <text x={412} y={222} fontSize={12} fill={blueDark} fontFamily={font}>
          over the TP group&apos;s CPU process group
        </text>

        {ranks.map((r, i) => {
          const x = 20 + i * rankStep;
          const cx = x + rankW / 2;
          return (
            <g key={r}>
              <line
                x1={cx}
                y1={busY}
                x2={cx}
                y2={rankY - 2}
                stroke={blue}
                strokeWidth={1.5}
                markerEnd="url(#runtime-pipeline-ah-blue)"
              />
              <rect
                x={x}
                y={rankY}
                width={rankW}
                height={rankH}
                rx={6}
                fill={blueFill}
                stroke={neutral}
                strokeWidth={1.2}
              />
              <text
                x={cx}
                y={rankY + 22}
                textAnchor="middle"
                fontSize={12}
                fontWeight={600}
                fill={text}
                fontFamily={font}
              >
                Scheduler
              </text>
              <text
                x={cx}
                y={rankY + 42}
                textAnchor="middle"
                fontSize={12}
                fill={secondary}
                fontFamily={font}
              >
                {`TP${r}, GPU ${r}`}
              </text>
            </g>
          );
        })}

        {/* Process count footer */}
        <rect x={20} y={344} width={860} height={76} rx={8} fill={slateFill} stroke="#d1d5db" />
        <text
          x={450}
          y={372}
          textAnchor="middle"
          fontSize={14}
          fontWeight={600}
          fill={text}
          fontFamily={font}
        >
          --tp 8 on one node: 1 main + 8 schedulers + 1 detokenizer = 10 processes
        </text>
        <text
          x={450}
          y={398}
          textAnchor="middle"
          fontSize={12}
          fill={secondary}
          fontFamily={font}
        >
          Each scheduler holds its model worker, so scheduling and kernel launch share one process
          per GPU
        </text>
      </svg>
    </div>
  );
}

interface TitleRow {
  title: ReactNode;
  what: ReactNode;
  when: ReactNode;
}

const titleRows: TitleRow[] = [
  {
    title: 'The command you launched',
    what: 'HTTP server and TokenizerManager. No title is set, so ps shows the command line.',
    when: 'Always',
  },
  {
    title: <code>sglang::scheduler_TP0</code>,
    what: (
      <>
        One per GPU. Only parallel dimensions above 1 appear, so replicas read{' '}
        <code>sglang::scheduler_DP1_TP3</code> and an expert-parallel launch adds{' '}
        <code>_EP3</code>; a single-GPU server shows plain <code>sglang::scheduler</code>.
      </>
    ),
    when: 'Always',
  },
  {
    title: <code>sglang::detokenizer</code>,
    what: 'DetokenizerManager',
    when: 'Unless the Rust frontend is on',
  },
  {
    title: <code>sglang::data_parallel_controller</code>,
    what: 'Routes each request to one DP rank',
    when: 'More than one DP rank',
  },
  {
    title: (
      <>
        <code>sglang::tokenizer_worker:&lt;pid&gt;</code>, <code>sglang::detokenizer_router</code>
      </>
    ),
    what: 'Extra tokenizer workers, and the router in front of extra detokenizers',
    when: 'Worker-count flags above 1',
  },
];

interface CountRow {
  launch: ReactNode;
  gpus: string;
  procs: string;
  adds: ReactNode;
}

const countRows: CountRow[] = [
  {
    launch: <code>--tp 8</code>,
    gpus: '8',
    procs: '10',
    adds: 'Main, 8 schedulers, detokenizer',
  },
  {
    launch: <code>--tp 8 --attn-dp-size 2</code>,
    gpus: '8',
    procs: '11',
    adds: 'Adds the DataParallelController',
  },
  {
    launch: <code>--tp 8 --dp-size 2</code>,
    gpus: '16',
    procs: '19',
    adds: 'Controller, 16 schedulers in two replicas',
  },
  {
    launch: <code>--tp 8 --tokenizer-worker-num 4</code>,
    gpus: '8',
    procs: '14',
    adds: 'Four tokenizer worker processes; the launched process routes between them',
  },
  {
    launch: <code>--tp 8 --detokenizer-worker-num 4</code>,
    gpus: '8',
    procs: '14',
    adds: 'Four detokenizers plus a router process, in place of the one detokenizer',
  },
  {
    launch: (
      <>
        <code>SGLANG_RUST_SERVER=1</code> with <code>--tp 8</code>
      </>
    ),
    gpus: '8',
    procs: '9',
    adds: 'No detokenizer; the launched process only waits on the schedulers',
  },
];

export function RuntimeProcesses() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Read the process listing of an SGLang server, predict it from the launch flags, and size the CPU cores and ports the host needs (verified against SGLang v0.5.22, commit baa9befa, 2026-10-24)"
          >
            3. The SGLang Runtime: processes and sockets
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            An SGLang server is a small set of cooperating processes, and sizing a host for one
            starts with knowing which processes a launch creates. The SGLang Runtime (SRT) gives
            every GPU a scheduler process of its own and keeps HTTP, tokenization and
            detokenization in separate processes, connected by ZMQ (ZeroMQ) sockets. That split
            decides what <code>ps</code> shows, how many CPU cores stay busy and which ports have to
            be open.
          </Box>
          <Box variant="p">
            The figure to carry through this section: a launch with <code>--tp 8</code> (TP, tensor
            parallelism, over eight GPUs) runs <strong>10 processes</strong> on one node, namely the
            process you started, eight schedulers and one detokenizer{' '}
            <Cite tier={1} href={sglangUrl(ENGINE, 'L889-L987')} kind="code">
              engine.py L889-L987
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(ENGINE, 'L1315-L1321')} kind="code">
              engine.py L1315-L1321
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(SERVING, 'L50-L57')}>
              serving.py L50-L57
            </Cite>
            . The count is read from the launch code, not counted on a running server, and it
            leaves out Python multiprocessing helpers and the optional weight-cache daemons.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Know what each line of the process listing does, and why every GPU process reaches the same scheduling decision on its own"
          >
            Three kinds of process on a one-way ring
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The process you launch runs the HTTP server, a FastAPI app served by uvicorn by
            default, and the TokenizerManager, which tokenizes prompts, tracks each request&apos;s
            state and streams results back to the client{' '}
            <Cite tier={1} href={sglangUrl(HTTP, 'L2775-L2796')}>
              http_server.py L2775-L2796
            </Cite>
            . Scheduler processes own the GPUs, one per pair of PP (pipeline parallelism) rank and
            TP rank on the node{' '}
            <Cite tier={1} href={sglangUrl(ENGINE, 'L926-L961')}>
              engine.py L926-L961
            </Cite>
            . Each scheduler builds its model worker, the <code>TpModelWorker</code> and its{' '}
            <code>ModelRunner</code>, inside its own process{' '}
            <Cite tier={1} href={sglangUrl(SCHEDULER, 'L994-L1009')}>
              scheduler.py L994-L1009
            </Cite>
            , so scheduling and kernel launch for one GPU share one Python interpreter. A separate
            DetokenizerManager process turns token ids back into text{' '}
            <Cite tier={1} href={sglangUrl(ENGINE, 'L1121-L1370')}>
              engine.py L1121-L1370
            </Cite>
            .
          </Box>
          <Box variant="p">
            The three talk over ZMQ PUSH and PULL sockets arranged as a one-way ring: tokenized
            requests travel from the TokenizerManager to the scheduler, sampled token ids from the
            scheduler to the detokenizer, and text from the detokenizer back to the TokenizerManager{' '}
            <Cite tier={1} href={sglangUrl(SERVER_ARGS, 'L718-L801')}>
              server_args.py L718-L801
            </Cite>
            . On one node without attention data parallelism (attention DP, section 14) the socket
            endpoints are <code>ipc://</code> files in the temp directory, so the ring opens no TCP
            port. Three side channels sit beside the ring: the scheduler answers control requests
            and aborts straight to the TokenizerManager, a DEALER socket carries Engine RPC (remote
            procedure call) requests into the scheduler, and a PUSH socket carries scheduler metrics
            when metrics are on{' '}
            <Cite
              tier={1}
              href={sglangUrl(
                'python/sglang/srt/managers/scheduler_components/ipc_channels.py',
                'L36-L81',
              )}
            >
              ipc_channels.py L36-L81
            </Cite>
            .
          </Box>
          <Box variant="p">
            Without attention DP, only one scheduler reads the input socket: the first rank of the
            first pipeline stage.
            It drains the socket without blocking, then broadcasts the new requests over the TP
            group&apos;s CPU process group, so every rank runs the same scheduling step on the same
            input and builds the same batch{' '}
            <Cite
              tier={1}
              href={sglangUrl(
                'python/sglang/srt/managers/scheduler_components/request_receiver.py',
                'L112-L216',
              )}
            >
              request_receiver.py L112-L216
            </Cite>
            . That is the mental model to keep for the rest of the dive:{' '}
            <strong>
              three process types on a one-way ring, and every GPU process schedules for itself
            </strong>
            . Section 4, The Scheduler, covers what each of them decides at every step.
          </Box>

          <RuntimePipelineDiagram />
          <Box variant="small" color="text-body-secondary">
            Illustrative, not measured. Every ring edge is a ZMQ PUSH socket feeding a PULL socket;
            the control-reply, RPC and metrics channels are left out.
          </Box>

          <Box variant="p">
            Every child process sets a title, so the listing can be read line by line{' '}
            <Cite tier={1} href={sglangUrl(SCHEDULER, 'L6045-L6060')}>
              scheduler.py L6045-L6060
            </Cite>{' '}
            <Cite
              tier={1}
              href={sglangUrl('python/sglang/srt/managers/detokenizer_manager.py', 'L545')}
            >
              detokenizer_manager.py L545
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(DP_CTRL, 'L877')}>
              data_parallel_controller.py L877
            </Cite>{' '}
            <Cite
              tier={1}
              href={sglangUrl('python/sglang/srt/managers/multi_tokenizer_mixin.py', 'L767-L791')}
            >
              multi_tokenizer_mixin.py L767-L791
            </Cite>
            :
          </Box>
          <Table
            variant="embedded"
            wrapLines
            columnDefinitions={[
              { id: 'title', header: 'Title in ps', cell: (r) => r.title },
              { id: 'what', header: 'What it is', cell: (r) => r.what },
              { id: 'when', header: 'When it appears', cell: (r) => r.when },
            ]}
            items={titleRows}
          />

          <Box variant="p">
            <code>sglang serve</code> and the in-process <code>sglang.Engine</code> start the same
            schedulers and detokenizer through one launcher{' '}
            <Cite tier={1} href={sglangUrl(ENGINE, 'L331')}>
              engine.py L331
            </Cite>
            . They differ in what runs in your process: <code>Engine</code> keeps the
            TokenizerManager in your Python interpreter and gives you <code>generate</code> and{' '}
            <code>async_generate</code>, while the server puts its HTTP app in front of the same
            TokenizerManager{' '}
            <Cite tier={1} href={sglangUrl(HTTP, 'L2901-L2961')}>
              http_server.py L2901-L2961
            </Cite>
            . An offline job built on <code>Engine</code> shows the same schedulers and detokenizer
            in <code>ps</code>, with the job&apos;s own command line as the main process.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Know what --dp-size and --attn-dp-size add to the listing, and how a request reaches a replica by default"
          >
            Data-parallel replicas add one controller
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            When a launch has more than one DP (data parallelism) rank, counted as{' '}
            <code>--dp-size</code> times <code>--attn-dp-size</code>, it adds a
            DataParallelController process{' '}
            <Cite tier={1} href={sglangUrl(ENGINE, 'L904-L984')}>
              engine.py L904-L984
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl('python/sglang/srt/runtime_context.py', 'L202-L207')}>
              runtime_context.py L202-L207
            </Cite>
            . The controller takes the PULL end of the TokenizerManager&apos;s socket and pushes
            each request to one DP rank&apos;s scheduler, so it sits between the tokenizer and the
            schedulers.
          </Box>
          <Box variant="p">
            <code>--dp-size N</code> runs N independent replicas of the model. Each is a full TP
            group with its own input socket and its own KV (key-value) cache on its own range of
            GPUs, so the launch needs <code>dp_size x tp_size x pp_size</code> GPUs{' '}
            <Cite tier={1} href={sglangUrl(DP_CTRL, 'L393-L440')}>
              data_parallel_controller.py L393-L440
            </Cite>
            . <code>--attn-dp-size</code> stays inside one TP group: the engine starts the
            schedulers itself and the controller only routes. The default{' '}
            <code>--load-balance-method auto</code> resolves to <code>round_robin</code> (to{' '}
            <code>follow_bootstrap_room</code> on a PD prefill server){' '}
            <Cite
              tier={1}
              href={sglangUrl('python/sglang/srt/arg_groups/fields/parallel.py', 'L91-L103')}
            >
              parallel.py L91-L103
            </Cite>{' '}
            <Cite
              tier={1}
              href={sglangUrl('python/sglang/srt/arg_groups/serving_hook.py', 'L210-L227')}
            >
              serving_hook.py L210-L227
            </Cite>
            . Balancing separate servers by prefix affinity is a different job, done by the gateway
            in section 17, The Model Gateway.
          </Box>
          <ExpandableSection headerText="Least-loaded methods, and a documentation limit the code does not apply">
            <SpaceBetween size="s">
              <Box variant="p">
                <code>total_requests</code> and <code>total_tokens</code> pick the least-loaded rank
                from per-scheduler load snapshots (running plus waiting requests, or total tokens
                with requests as the tie-breaker) and count each new request against the chosen
                rank until the next snapshot. A request that carries <code>routed_dp_rank</code>{' '}
                skips the policy{' '}
                <Cite tier={1} href={sglangUrl(DP_CTRL, 'L90-L140')}>
                  data_parallel_controller.py L90-L140
                </Cite>{' '}
                <Cite tier={1} href={sglangUrl(DP_CTRL, 'L787-L847')}>
                  data_parallel_controller.py L787-L847
                </Cite>
                .
              </Box>
              <Box variant="p">
                The documentation says <code>total_tokens</code> can only be used when DP attention
                is applied{' '}
                <Cite
                  tier={1}
                  href={sglangDocsSrcUrl('advanced_features/server_arguments', 'L1228-L1232')}
                  kind="doc-code-conflict"
                >
                  SGLang docs: server arguments (v0.5.22 source)
                </Cite>
                . In v0.5.22&apos;s code every rank-0 scheduler publishes a load snapshot whether or
                not attention DP is on{' '}
                <Cite tier={1} href={sglangUrl(SCHEDULER, 'L817-L833')}>
                  scheduler.py L817-L833
                </Cite>{' '}
                <Cite
                  tier={1}
                  href={sglangUrl('python/sglang/srt/managers/load_snapshot.py', 'L638-L651')}
                >
                  load_snapshot.py L638-L651
                </Cite>
                , and no argument check ties the method to attention DP, so{' '}
                <code>total_tokens</code> is available for plain replicas. It was not exercised for
                this dive.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Predict the listing from the launch flags, then budget a core per process and open only the ports the launch binds"
          >
            Count processes, cores and ports before you size the host
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The count is <code>1 + GPUs + 1</code>, plus one controller when there is more than one
            DP rank, so <code>--tp 8</code> runs <strong>10 processes</strong>. The first three rows
            below follow the launch code{' '}
            <Cite tier={1} href={sglangUrl(ENGINE, 'L889-L987')} kind="code">
              engine.py L889-L987
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(ENGINE, 'L1315-L1321')} kind="code">
              engine.py L1315-L1321
            </Cite>
            ; the last three are our count from the same code with the worker and frontend flags
            applied{' '}
            <Cite tier={1} href={sglangUrl(ENGINE, 'L1035-L1090')} kind="code">
              engine.py L1035-L1090
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(HTTP, 'L2838-L2851')} kind="code">
              http_server.py L2838-L2851
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(ENGINE, 'L1296-L1312')} kind="code">
              engine.py L1296-L1312
            </Cite>
            . None was counted on a running server, and all of them leave out Python
            multiprocessing helpers and the optional weight-cache daemons.
          </Box>
          <Table
            variant="embedded"
            wrapLines
            columnDefinitions={[
              { id: 'launch', header: 'Launch', cell: (r) => r.launch },
              { id: 'gpus', header: 'GPUs', cell: (r) => r.gpus },
              { id: 'procs', header: 'Processes', cell: (r) => r.procs },
              { id: 'adds', header: 'What the listing holds', cell: (r) => r.adds },
            ]}
            items={countRows}
          />
          <Box variant="p">
            On a multi-node launch, node 0 runs the processes above for its own GPUs. Every other
            node runs only its schedulers, plus a DataParallelController when there is more than one
            DP rank{' '}
            <Cite tier={1} href={sglangUrl(ENGINE, 'L904-L906')}>
              engine.py L904-L906
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(DP_CTRL, 'L617-L618')}>
              data_parallel_controller.py L617-L618
            </Cite>
            . On the Python frontend, the launched process there waits for its schedulers to load,
            then serves a stub HTTP app on <code>--port</code> whose <code>/health</code>,{' '}
            <code>/health_generate</code> and <code>/ping</code> always answer 200{' '}
            <Cite tier={1} href={sglangUrl(ENGINE, 'L1228-L1281')}>
              engine.py L1228-L1281
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl('python/sglang/srt/utils/common.py', 'L3678-L3702')}>
              common.py L3678-L3702
            </Cite>
            . A health probe on a follower node therefore reports that the node finished loading,
            and after that says nothing about the model.
          </Box>
          <Box variant="p">
            <strong>CPU cores.</strong> Every process is its own Python interpreter. On the Python
            frontend, the rank-0 scheduler polls its sockets without blocking, and the idle sleeper
            that would wait on them is created only with <code>--sleep-on-idle</code>, which is off
            by default{' '}
            <Cite tier={1} href={sglangUrl(SCHEDULER, 'L835-L850')}>
              scheduler.py L835-L850
            </Cite>{' '}
            <Cite
              tier={1}
              href={sglangUrl('python/sglang/srt/arg_groups/fields/device.py', 'L74')}
            >
              device.py L74
            </Cite>
            . Our reading of the code is that rank 0 keeps a core busy with no traffic, and the
            other ranks loop at its pace through the per-step broadcast; CPU use was not measured
            for this dive. So budget at least one core per process, 10 for <code>--tp 8</code>,
            before the tokenization load, which lands on the main process. With{' '}
            <code>--sleep-on-idle</code>, an idle rank 0 waits on its sockets for up to one second at
            a time{' '}
            <Cite
              tier={1}
              href={sglangUrl(
                'python/sglang/srt/managers/scheduler_components/idle_sleeper.py',
                'L36-L37',
              )}
            >
              idle_sleeper.py L36-L37
            </Cite>
            .
          </Box>
          <Box variant="p">
            Tokenization and detokenization run in other processes, so their CPU work does not run
            inside the GPU loop. When either saturates, scale it:{' '}
            <code>--tokenizer-worker-num N</code> runs N HTTP worker processes, each with its own
            TokenizerManager, and <code>--detokenizer-worker-num N</code> runs N detokenizers behind
            a router; both default to 1{' '}
            <Cite tier={1} href={sglangUrl(SERVING, 'L50-L57')}>
              serving.py L50-L57
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(ENGINE, 'L1326-L1333')}>
              engine.py L1326-L1333
            </Cite>
            . A server with <code>--tokenizer-worker-num</code> above 1 asserts at start that{' '}
            <code>--api-key</code> is unset{' '}
            <Cite tier={1} href={sglangUrl(HTTP, 'L240-L250')}>
              http_server.py L240-L250
            </Cite>
            , and the key middleware is installed only in single-tokenizer mode{' '}
            <Cite tier={1} href={sglangUrl(HTTP, 'L2656-L2684')} kind="code">
              http_server.py L2656-L2684
            </Cite>
            , so authenticate in a gateway in front of it. Section 12, Talking to SGLang, covers the
            two keys.
          </Box>
          <Box variant="p">
            <strong>Ports.</strong> On one node without attention DP the ring uses{' '}
            <code>ipc://</code> files, so the TCP ports SGLang itself binds are the HTTP port (<code>--port</code>,
            default 30000, bound to <code>--host</code>, default 127.0.0.1){' '}
            <Cite tier={1} href={sglangUrl(SERVING, 'L65-L66')}>
              serving.py L65-L66
            </Cite>{' '}
            and one port for the <code>torch.distributed</code> rendezvous, which the launcher picks
            below the ephemeral range unless <code>--nccl-port</code> sets it{' '}
            <Cite tier={1} href={sglangUrl(SERVER_ARGS, 'L756-L761')}>
              server_args.py L756-L761
            </Cite>{' '}
            <Cite
              tier={1}
              href={sglangUrl('python/sglang/srt/distributed/bootstrap.py', 'L227-L243')}
            >
              bootstrap.py L227-L243
            </Cite>
            . Each DP replica takes its own rendezvous port{' '}
            <Cite tier={1} href={sglangUrl(DP_CTRL, 'L400-L407')}>
              data_parallel_controller.py L400-L407
            </Cite>
            , and <code>--grpc-port</code> adds one more. With attention DP the ring&apos;s channels
            move to TCP so they also work across nodes, and part of the set is chosen at start, so
            on a multi-node attention-DP deployment our reading is to allow TCP between the nodes
            rather than list ports.
          </Box>
          <ExpandableSection headerText="The attention-DP port map">
            <SpaceBetween size="s">
              <Box variant="p">
                The base address is <code>--dist-init-addr</code>, or 127.0.0.1 at{' '}
                <code>--port</code> plus 233 on a single node without one. The ring&apos;s channels
                take six consecutive ports starting one above the base (below it, if that would pass
                port 65535): tokenizer, detokenizer, RPC, metrics, the controller&apos;s input and
                load snapshots{' '}
                <Cite tier={1} href={sglangUrl(SERVER_ARGS, 'L803-L893')}>
                  server_args.py L803-L893
                </Cite>
                ; the Rust frontend adds one per DP rank to that block. On a multi-node launch,
                node 0 also listens 13 above the <code>--dist-init-addr</code> port to hand worker
                ports to the other nodes{' '}
                <Cite tier={1} href={sglangUrl(DP_CTRL, 'L458-L491')}>
                  data_parallel_controller.py L458-L491
                </Cite>
                , and its controller binds one more port per DP rank, picked at random, for the
                worker sockets{' '}
                <Cite tier={1} href={sglangUrl(DP_CTRL, 'L586-L616')} kind="code">
                  data_parallel_controller.py L586-L616
                </Cite>
                . The random ports are why a fixed allow-list falls short.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Know what changes in the listing, the routes, the keys and the CPU budget before you turn either option on"
          >
            The Rust frontend and the gRPC entrypoints
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Setting the environment variable <code>SGLANG_RUST_SERVER=1</code> (default off){' '}
            <Cite tier={1} href={sglangUrl('python/sglang/srt/environ.py', 'L1902')}>
              environ.py L1902
            </Cite>{' '}
            moves the HTTP server, tokenization and detokenization into a Rust extension that runs
            as threads inside the rank-0 scheduler process. Requests reach the scheduler through an
            in-process ring buffer in place of ZMQ, and no Python TokenizerManager or detokenizer
            starts{' '}
            <Cite tier={1} href={sglangUrl(ENGINE, 'L1291-L1312')}>
              engine.py L1291-L1312
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(SCHEDULER, 'L2331-L2360')}>
              scheduler.py L2331-L2360
            </Cite>
            . Under attention DP the first rank of each DP group hosts a listener, on{' '}
            <code>--port</code> plus its DP rank on the node{' '}
            <Cite
              tier={1}
              href={sglangUrl('python/sglang/srt/rust_server/server.py', 'L134-L149')}
            >
              rust_server/server.py L134-L149
            </Cite>
            . The mode serves <code>sglang serve</code> and <code>launch_server</code> only:{' '}
            <code>sgl.Engine</code> raises if the variable is set, and a multimodal model without a
            Rust preprocessing pipeline is refused before the port binds{' '}
            <Cite tier={1} href={sglangUrl(ENGINE, 'L308-L314')}>
              engine.py L308-L314
            </Cite>{' '}
            <Cite
              tier={1}
              href={sglangUrl('python/sglang/srt/rust_server/server.py', 'L76-L99')}
            >
              rust_server/server.py L76-L99
            </Cite>
            . A search of <code>docs/docs</code> at v0.5.22 finds no page that mentions the
            variable, and the release notes&apos; Rust Server heading calls the Rust frontend work
            experimental{' '}
            <Cite tier={1} href={RELEASE_NOTES}>
              SGLang v0.5.22 release notes
            </Cite>
            .
          </Box>
          <Box variant="p">
            Its HTTP router mounts <code>/generate</code>, <code>/health</code>,{' '}
            <code>/health_generate</code>, <code>/v1/models</code>, <code>/v1/completions</code>,{' '}
            <code>/v1/models/&#123;model&#125;</code>, <code>/v1/chat/completions</code>,{' '}
            <code>/server_info</code>, <code>/get_model_info</code> and <code>/model_info</code>{' '}
            <Cite tier={1} href={sglangUrl(`${RUST_APP}/app.rs`, 'L77-L81')} kind="code">
              app.rs L77-L81
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(`${RUST_APP}/native_api.rs`, 'L78-L113')}>
              native_api.rs L78-L113
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(`${RUST_APP}/openai.rs`, 'L32-L38')}>
              openai.rs L32-L38
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(`${RUST_APP}/openai/models.rs`, 'L16-L17')}>
              openai/models.rs L16-L17
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(`${RUST_APP}/info.rs`, 'L22-L32')}>
              info.rs L22-L32
            </Cite>
            , plus the KV bootstrap registry on a PD (prefill/decode) prefill server{' '}
            <Cite tier={1} href={sglangUrl(`${RUST_APP}/app.rs`, 'L95-L104')}>
              app.rs L95-L104
            </Cite>
            . A search of the <code>rust/</code> tree at v0.5.22 finds no <code>/metrics</code>,{' '}
            <code>/ping</code>, <code>/invocations</code>, <code>/v1/messages</code> or admin route{' '}
            <Cite tier={1} href={sglangTreeUrl('rust')} kind="code">
              rust/ at v0.5.22
            </Cite>
            , which is why section 19, SGLang on SageMaker AI and HyperPod, keeps the variable
            unset. The router is assembled with no authentication layer, and the start path passes
            none in{' '}
            <Cite tier={1} href={sglangUrl(`${RUST_APP}/app.rs`, 'L77-L92')} kind="code">
              app.rs L77-L92
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl('rust/sglang-server/src/lib.rs', 'L188-L198')} kind="code">
              lib.rs L188-L198
            </Cite>
            , so our reading of the code, not run, is that <code>--api-key</code> protects none of
            these routes in this mode. A deployment that scrapes <code>/metrics</code> or relies on
            a key keeps the Python frontend.
          </Box>
          <Box variant="p">
            The Rust frontend also changes the CPU budget. On Linux it splits the rank-0 scheduler&apos;s
            allowed CPU set: up to 2 cores for the scheduler loop, and a pool of up to 8 for the
            frontend&apos;s threads, or multimodal workers plus 4 when that is larger; with fewer than
            4 allowed cores it pins nothing{' '}
            <Cite
              tier={1}
              href={sglangUrl('python/sglang/srt/rust_server/config.py', 'L132-L158')}
              kind="code"
            >
              rust_server/config.py L132-L158
            </Cite>{' '}
            <Cite
              tier={1}
              href={sglangUrl('python/sglang/srt/rust_server/server.py', 'L109-L112')}
            >
              rust_server/server.py L109-L112
            </Cite>
            . vLLM&apos;s off-by-default Rust frontend, <code>VLLM_USE_RUST_FRONTEND=1</code>, takes
            the place of its API server process, tokenization and detokenization included, and still
            reaches the engine over ZMQ{' '}
            <Cite tier={1} href={VLLM_RUST_FRONTEND}>
              vLLM envs.py L1441-L1443 (v0.31.0)
            </Cite>{' '}
            <Cite tier={1} href={VLLM_RUST_TEXT}>
              vLLM rust/src/text/src/lib.rs L4-L8 (v0.31.0)
            </Cite>{' '}
            <Cite tier={1} href={VLLM_RUST_README}>
              vLLM rust/README.md L3 (v0.31.0)
            </Cite>
            ; SGLang&apos;s runs inside the GPU process itself (
            <Link href="../vllm/">vLLM dive, section 3: The V1 Engine Architecture</Link>).
          </Box>
          <Box variant="p">
            gRPC comes in two forms. <code>--grpc-port N</code> (or <code>SGLANG_GRPC_PORT</code>,
            off by default) starts a native gRPC server next to the HTTP server, inside the
            TokenizerManager process, so the process count does not change. It is refused with{' '}
            <code>--tokenizer-worker-num</code> above 1, with <code>--use-ray</code>, with{' '}
            <code>--encoder-only</code>, and with{' '}
            <code>--api-key</code> or <code>--admin-api-key</code>, because the gRPC listener
            bypasses the HTTP auth middleware{' '}
            <Cite
              tier={1}
              href={sglangUrl('python/sglang/srt/arg_groups/serving_hook.py', 'L392-L411')}
            >
              serving_hook.py L392-L411
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(HTTP, 'L414-L430')}>
              http_server.py L414-L430
            </Cite>
            . <code>--smg-grpc-mode</code>, the replacement for the deprecated{' '}
            <code>--grpc-mode</code>, swaps the HTTP server for the legacy gRPC servicer that the
            SGLang Model Gateway&apos;s gRPC mode talks to{' '}
            <Cite tier={1} href={sglangUrl('python/sglang/launch_server.py', 'L44-L51')}>
              launch_server.py L44-L51
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Confirm the count on your own server, then give the host the cores and ports it needs"
          >
            Check the listing before the first load test
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Start the server and run <code>ps -eo pid,args | grep sglang::</code>. A{' '}
            <code>--tp 8</code> launch should show eight <code>sglang::scheduler_TP</code> lines and
            one <code>sglang::detokenizer</code>, which with the launched process makes{' '}
            <strong>10 processes</strong>. Our figures come from reading the code, so your listing
            is the measurement. Give the host at least one core per process, add tokenizer workers
            when the main process saturates, keep <code>--host</code> at 127.0.0.1 until a gateway
            with keys sits in front, and on a multi-node attention-DP deployment allow TCP between
            the nodes.
          </Box>
          <Box variant="p">
            <strong>Against vLLM:</strong> within a TP group, SGLang ships only the new requests
            across the process boundary, and every GPU process makes the scheduling decision itself{' '}
            <Cite
              tier={1}
              href={sglangUrl(
                'python/sglang/srt/managers/scheduler_components/request_receiver.py',
                'L162-L216',
              )}
            >
              request_receiver.py L162-L216
            </Cite>
            ; vLLM schedules once per DP rank and sends the decision to its GPU workers{' '}
            <Cite tier={1} href={VLLM_CORE_STEP}>
              vLLM v1/engine/core.py L640-L641 (v0.31.0)
            </Cite>{' '}
            <Cite tier={1} href={VLLM_EXECUTOR_RPC}>
              vLLM multiproc_executor.py L340-L351 (v0.31.0)
            </Cite>
            . By default both keep HTTP and tokenization off the GPU-driving process (
            <Link href="../vllm/">vLLM dive, section 3: The V1 Engine Architecture</Link>).
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
