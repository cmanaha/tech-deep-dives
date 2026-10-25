import type { ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Table from '@cloudscape-design/components/table';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';
import { Cite, sglangUrl, sglangTreeUrl, sglangDocsSrcUrl } from '../components/Cite';

/* ------------------------------------------------------------------ */
/* Source paths and pinned external references                        */
/* ------------------------------------------------------------------ */

const SRT = 'python/sglang/srt';
const ENVIRON = `${SRT}/environ.py`;
const MC_ENGINE = `${SRT}/distributed/device_communicators/mooncake_transfer_engine.py`;
const MC_UTILS = `${SRT}/disaggregation/mooncake/utils.py`;
const MC_CONN = `${SRT}/disaggregation/mooncake/conn.py`;
const NIXL_CONN = `${SRT}/disaggregation/nixl/conn.py`;
const OVERRIDES = `${SRT}/arg_groups/overrides.py`;
const DISAGG_FIELDS = `${SRT}/arg_groups/fields/disagg.py`;
const EXEC_FIELDS = `${SRT}/arg_groups/fields/exec_.py`;
const MOE_HOOK = `${SRT}/arg_groups/moe_hook.py`;
const MOE_UTILS = `${SRT}/layers/moe/utils.py`;
const DEEPEP_V2 = `${SRT}/layers/moe/token_dispatcher/deepep_v2.py`;
const DOCKERFILE = 'docker/Dockerfile';
const PYPROJECT = 'python/pyproject.toml';
const PD_DOC = 'advanced_features/pd_disaggregation';

const DLC = 'https://github.com/aws/deep-learning-containers/blob/23970abd5b8919ea3e1add74692a0d056b2fcbd9';
const DLC_UBUNTU = `${DLC}/docker/sglang/Dockerfile`;
const DLC_AL2023 = `${DLC}/docker/sglang/Dockerfile.amzn2023`;
const DLC_CHANGELOG = `${DLC}/docs/sglang/changelog/index.md`;
const DLC_INSTALL_EFA = `${DLC}/scripts/docker/common/install_efa.sh`;

const GIN_DOC = 'https://github.com/aws/aws-ofi-nccl/blob/v1.22.0/doc/gin-getting-started.md';

const SAMPLES = 'https://github.com/awslabs/awsome-distributed-ai/blob/24a8d72095b3920bb0827a45c1c2bd6ce677cebe';
const DSR1 = `${SAMPLES}/examples/inference/sglang/dsr1-deepep-efa/README.md`;
const EP_CMP = `${SAMPLES}/micro-benchmarks/expert-parallelism/ep-backend-comparison`;

const FORK_SELECT =
  'https://github.com/amazon-contributing/DeepEP/blob/874779c9ccd2294b56304bd6cc5f138f1f71d097/csrc/kernels/elastic/kernel_select.hpp';
const UPSTREAM_DEEPEP_INIT =
  'https://github.com/deepseek-ai/DeepEP/blob/f6aa38fe06cd4a0489e7730365d4e0114970a2f3/deep_ep/__init__.py#L60-L67';
const SGL_DEEP_EP_PYPI = 'https://pypi.org/project/sgl-deep-ep/0.1.2.post1/';
const MC_EFA_PYPI = 'https://pypi.org/project/mooncake-transfer-engine-efa-cuda13/0.3.13.post1/';
const MC_BENCH =
  'https://github.com/kvcache-ai/Mooncake/blob/v0.3.13.post1/docs/source/design/transfer-engine/efa_transport.md#L354-L385';

const NIXL = 'https://github.com/ai-dynamo/nixl/blob/1683cf3b7f3d11674c03c5e861cea22339876c96';

const EC2_GUIDE = 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide';
const EFA_NIXL_DOC = `${EC2_GUIDE}/efa-start-nixl.html`;
const EFA_CHANGELOG = `${EC2_GUIDE}/efa-changelog.html`;
const PLACEMENT_DOC = `${EC2_GUIDE}/placement-strategies.html`;
const CAPACITY_BLOCKS_DOC = `${EC2_GUIDE}/ec2-capacity-blocks.html`;
const TOPOLOGY_DOC = `${EC2_GUIDE}/ec2-instance-topology-prerequisites.html`;
const AWS_RL_BLOG =
  'https://aws.amazon.com/blogs/machine-learning/scaling-moe-reinforcement-learning-on-amazon-eks-with-efa-and-deepep-with-40-more-throughput/';

/* ------------------------------------------------------------------ */
/* Bring-up orders                                                     */
/* ------------------------------------------------------------------ */

const KV_BRINGUP = `# KV stack: every prefill and decode node, bottom layer first

# 1. EFA installer: libfabric lists its EFA reliable-datagram interfaces
fi_info -p efa -t FI_EP_RDM

# 2. Mooncake route: swap in the EFA wheel (x86_64 only), then prove it
python3 -m pip uninstall -y mooncake-transfer-engine-cuda13 mooncake-transfer-engine-efa-cuda13
python3 -m pip install --no-deps mooncake-transfer-engine-efa-cuda13==0.3.13.post1
export LD_LIBRARY_PATH="/opt/amazon/efa/lib:/opt/amazon/efa/lib64:\${LD_LIBRARY_PATH:-}"
python3 -c 'from mooncake import engine; assert engine.SUPPORT_EFA'

# 3. Both roles: select EFA, and keep CUDA VMM allocators and MNNVL off
export MOONCAKE_PROTOCOL=efa
#    no expandable_segments:True in PYTORCH_CUDA_ALLOC_CONF or PYTORCH_ALLOC_CONF
#    SGLANG_MOONCAKE_CUSTOM_MEM_POOL unset (or INTRA_NODE_NVLINK)
#    MC_FORCE_MNNVL and NCCL_MNNVL_ENABLE unset

# 4. After both roles start: the KV path is EFA, not TCP, on each one
grep -E 'EfaTransport|Installing TCP transport' <server log>

# NIXL route, in place of steps 2 to 4 (EFA installer libfabric first on the library path)
export SGLANG_DISAGGREGATION_NIXL_BACKEND=LIBFABRIC
#    launch both roles with --disaggregation-transfer-backend nixl
#    server log: NIXL KVManager initialized with backend: LIBFABRIC`;

const EP_BRINGUP = `# EP stack: every node of every role, bottom layer first

# 1. EFA installer 1.50.0 or later (aws-ofi-nccl 1.21.1 or later)
fi_info -p efa -t FI_EP_RDM

# 2. NCCL at or above the GIN floor (lmsysorg/sglang:v0.5.22 ships 2.30.7)
pip show nvidia-nccl-cu13
python3 -m pip install --no-deps --force-reinstall "nvidia-nccl-cu13==2.31.2"

# 3. NCCL's EFA plugin, by its short name
export NCCL_NET_PLUGIN=ofi

# 4. P5en, P6-B200 and P6-B300 only: EFA-GDA
#    host: /etc/modprobe.d/nvidia-gdaki.conf, then reload the driver or reboot
#    options nvidia NVreg_RegistryDwords="PeerMappingOverride=1"
export NCCL_GIN_TYPE=5
export NCCL_SYM_GIN_KERNELS_ENABLE=0

# 5. DeepEP V2 built from amazon-contributing/DeepEP (the AL2023 DLC builds 874779c9)

# 6. Launch across nodes; direct mode is refused above one node
sglang serve --model-path <model> --moe-a2a-backend deepep_v2 --deepep-v2-mode hybrid \\
  --nnodes <n> --node-rank <i> --dist-init-addr <node0>:5000 ...

# 7. With NCCL_DEBUG=INFO NCCL_DEBUG_SUBSYS=INIT,ENV,NET, read every rank's log for:
#    no "NET/Plugin: Could not find: libnccl-net.so"   the OFI plugin loaded, not sockets
#    "DeepEP hybrid kernel selection: unordered"        the fork's kernels
#    "NCCL_GIN_TYPE set by environment to 5"
#    "NET/OFI gin GDAKI: createContext done"            EFA-GDA (P5 and P5e stay on proxy)
#    "deepep_v2_mode=hybrid"                            SGLang's layout`;

/* ------------------------------------------------------------------ */
/* Diagram: the two EFA stacks, one check per layer                    */
/* ------------------------------------------------------------------ */

interface LayerBox {
  key: string;
  x: number;
  y: number;
  w: number;
  h: number;
  stroke: string;
  fill: string;
  title: string;
  lines: string[];
  check: string;
  dashed?: boolean;
}

function TwoStacksDiagram() {
  const font = 'sans-serif';
  const text = '#16191f';
  const secondary = '#5f6b7a';
  const slate = '#414d5c';
  const checkInk = '#037f0c';
  const blue = '#0972d3';
  const blueFill = '#f2f8fd';
  const teal = '#1f7a70';
  const tealFill = '#e6f4f2';
  const purple = '#6f4cc4';
  const purpleFill = '#efe7fb';
  const amber = '#8b6c00';
  const amberFill = '#fbf3d5';
  const neutral = '#879596';

  const layers: LayerBox[] = [
    {
      key: 'k1',
      x: 20,
      y: 66,
      w: 420,
      h: 56,
      stroke: blue,
      fill: blueFill,
      title: 'SGLang PD: --disaggregation-transfer-backend',
      lines: [],
      check: 'Check: log names EfaTransport (Mooncake) or LIBFABRIC (NIXL)',
    },
    {
      key: 'e1',
      x: 460,
      y: 66,
      w: 420,
      h: 56,
      stroke: blue,
      fill: blueFill,
      title: 'SGLang: deepep_v2 with --deepep-v2-mode hybrid',
      lines: [],
      check: 'Check: startup log reports deepep_v2_mode=hybrid',
    },
    {
      key: 'e2',
      x: 460,
      y: 132,
      w: 420,
      h: 56,
      stroke: purple,
      fill: purpleFill,
      title: "DeepEP V2 (ElasticBuffer) from AWS's fork",
      lines: [],
      check: 'Check: log prints hybrid kernel selection: unordered',
    },
    {
      key: 'e3',
      x: 460,
      y: 198,
      w: 420,
      h: 56,
      stroke: amber,
      fill: amberFill,
      title: 'NCCL 2.31.2 or later; the v0.5.22 image has 2.30.7',
      lines: [],
      check: "Check: pip show nvidia-nccl-cu13 (torch's constant can differ)",
    },
    {
      key: 'e4',
      x: 460,
      y: 264,
      w: 420,
      h: 56,
      stroke: purple,
      fill: purpleFill,
      title: 'aws-ofi-nccl 1.21.0 or later, NCCL_NET_PLUGIN=ofi',
      lines: [],
      check: 'Check: NCCL_DEBUG=INFO loads aws-ofi-nccl, not sockets',
    },
    {
      key: 'e5',
      x: 460,
      y: 330,
      w: 420,
      h: 72,
      stroke: purple,
      fill: purpleFill,
      title: 'GIN backend: EFA-GDA on P5en, P6-B200, P6-B300',
      lines: ['CPU proxy on P5 and P5e (NCCL 2.31 default on EFA)'],
      check: 'Check: log shows NET/OFI gin GDAKI: createContext done',
    },
  ];

  const engineBox = (
    key: string,
    x: number,
    title: string,
    lines: string[],
    checkValue: string
  ) => (
    <g key={key}>
      <rect x={x} y={132} width={204} height={186} rx={6} fill={tealFill} stroke={teal} strokeWidth={1.4} />
      <text x={x + 12} y={156} fontSize={13} fontWeight={600} fill={text} fontFamily={font}>
        {title}
      </text>
      {lines.map((line, i) => (
        <text key={`${key}-l${i}`} x={x + 12} y={178 + i * 16} fontSize={11} fill={secondary} fontFamily={font}>
          {line}
        </text>
      ))}
      <text x={x + 12} y={274} fontSize={11} fontWeight={600} fill={checkInk} fontFamily={font}>
        Check:
      </text>
      <text x={x + 12} y={290} fontSize={11} fill={checkInk} fontFamily={font}>
        {checkValue}
      </text>
    </g>
  );

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 900 500"
        role="img"
        aria-labelledby="efa22-stacks-title"
        style={{ width: '100%', minWidth: 720, height: 'auto' }}
      >
        <title id="efa22-stacks-title">
          On EFA, PD&apos;s KV transfer and wide EP&apos;s expert all-to-all run through two
          different stacks that share only the EFA installer at the bottom. KV moves through
          Mooncake&apos;s EFA wheel or NIXL&apos;s LIBFABRIC plugin, both on the installer&apos;s
          libfabric. Expert traffic moves through DeepEP V2 from AWS&apos;s fork, NCCL 2.31.2 or
          later with GIN, and aws-ofi-nccl, using EFA-GDA on P5en, P6-B200 and P6-B300 or the CPU
          proxy on P5 and P5e. Mooncake EP and NIXL EP have no EFA path. Each layer carries one
          check, and fi_info is the first check of both stacks.
        </title>

        <rect x={0} y={0} width={900} height={500} rx={8} fill="#ffffff" />

        <text
          x={450}
          y={26}
          textAnchor="middle"
          fontSize={13}
          fontWeight={600}
          fill={text}
          fontFamily={font}
        >
          Two EFA stacks: KV transfer and expert all-to-all share only the EFA installer
        </text>

        <text x={20} y={54} fontSize={12} fontWeight={600} fill={slate} fontFamily={font}>
          KV transfer (PD), section 15
        </text>
        <text x={460} y={54} fontSize={12} fontWeight={600} fill={slate} fontFamily={font}>
          Expert all-to-all (wide EP), section 16
        </text>

        {layers.map((b) => (
          <g key={b.key}>
            <rect
              x={b.x}
              y={b.y}
              width={b.w}
              height={b.h}
              rx={6}
              fill={b.fill}
              stroke={b.stroke}
              strokeWidth={1.4}
              strokeDasharray={b.dashed ? '5 4' : undefined}
            />
            <text x={b.x + 12} y={b.y + 22} fontSize={13} fontWeight={600} fill={text} fontFamily={font}>
              {b.title}
            </text>
            {b.lines.map((line, i) => (
              <text
                key={`${b.key}-l${i}`}
                x={b.x + 12}
                y={b.y + 40 + i * 18}
                fontSize={11}
                fill={secondary}
                fontFamily={font}
              >
                {line}
              </text>
            ))}
            <text
              x={b.x + 12}
              y={b.y + (b.lines.length > 0 ? 58 : 42)}
              fontSize={11}
              fill={checkInk}
              fontFamily={font}
            >
              {b.check}
            </text>
          </g>
        ))}

        {engineBox(
          'k2a',
          20,
          'Mooncake EFA wheel',
          ['MOONCAKE_PROTOCOL=efa', 'on both roles', 'x86_64 only', 'rejects CUDA VMM allocators'],
          'engine.SUPPORT_EFA'
        )}
        {engineBox(
          'k2b',
          236,
          'NIXL, LIBFABRIC plugin',
          ["loads the host's libfabric", 'from the EFA installer', 'no EFA guard in SGLang'],
          'nixlbench --backend LIBFABRIC'
        )}

        <rect
          x={20}
          y={330}
          width={420}
          height={72}
          rx={6}
          fill="#f8f8f8"
          stroke={neutral}
          strokeWidth={1.2}
          strokeDasharray="5 4"
        />
        <text x={32} y={352} fontSize={12} fontWeight={600} fill={secondary} fontFamily={font}>
          No EP path on EFA through these libraries
        </text>
        <text x={32} y={370} fontSize={11} fill={secondary} fontFamily={font}>
          Mooncake EP: left out of the Mooncake EFA wheel
        </text>
        <text x={32} y={388} fontSize={11} fill={secondary} fontFamily={font}>
          NIXL EP: GPU device API in the UCX backend only
        </text>

        <rect x={20} y={414} width={860} height={72} rx={6} fill="#f2f3f3" stroke={slate} strokeWidth={1.4} />
        <text x={32} y={436} fontSize={13} fontWeight={600} fill={text} fontFamily={font}>
          EFA installer on every node: EFA driver, libfabric with the EFA provider, aws-ofi-nccl
        </text>
        <text x={32} y={454} fontSize={11} fill={secondary} fontFamily={font}>
          1.50.0 or later for EFA-GDA (libfabric 2.6.0amzn1.0, EFA driver 3.3.0, aws-ofi-nccl 1.21.1)
        </text>
        <text x={32} y={474} fontSize={11} fontWeight={600} fill={checkInk} fontFamily={font}>
          Check, first on both stacks: fi_info -p efa -t FI_EP_RDM
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Image table                                                         */
/* ------------------------------------------------------------------ */

interface ImageRow {
  id: string;
  image: ReactNode;
  kv: ReactNode;
  ep: ReactNode;
}

const IMAGE_ROWS: ImageRow[] = [
  {
    id: 'upstream',
    image: (
      <>
        <code>lmsysorg/sglang:v0.5.22</code> (upstream)
      </>
    ),
    kv: (
      <>
        Neither route as shipped: the standard Mooncake wheel, the distro libfabric, no EFA
        installer and no aws-ofi-nccl{' '}
        <Cite tier={1} href={sglangUrl(DOCKERFILE, 'L470-L472')}>
          Dockerfile L470-L472
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(DOCKERFILE, 'L700-L714')}>
          Dockerfile L700-L714
        </Cite>
        . Add the EFA installer for NIXL; add it and the Mooncake EFA wheel for Mooncake.
      </>
    ),
    ep: (
      <>
        NCCL 2.30.7, below the floor{' '}
        <Cite tier={1} href={sglangUrl(DOCKERFILE, 'L16')}>
          Dockerfile L16
        </Cite>
        , and <code>sgl-deep-ep</code> 0.1.2.post1{' '}
        <Cite tier={1} href={sglangUrl(PYPROJECT, 'L79')}>
          pyproject.toml L79
        </Cite>
        , whose V1 path the image sets up for IBGDA (GPU-initiated RDMA, remote direct memory
        access, over InfiniBand) on mlx5 NICs{' '}
        <Cite tier={1} href={sglangUrl(DOCKERFILE, 'L149-L150')}>
          Dockerfile L149-L150
        </Cite>{' '}
        and whose V2 hybrid kernels are the ordered ones only. Upgrade NCCL and install the fork.
      </>
    ),
  },
  {
    id: 'ubuntu',
    image: (
      <>
        AWS Ubuntu DLC, built from the upstream v0.5.22 image (amd64 only){' '}
        <Cite tier={1} href={`${DLC}/.github/config/image/sglang/ec2-ubuntu.yml#L1-L16`}>
          DLC ec2-ubuntu.yml L1-L16
        </Cite>
      </>
    ),
    kv: (
      <>
        NIXL over LIBFABRIC: the EFA installer, <code>latest</code> at build time, supplies
        libfabric{' '}
        <Cite tier={1} href={`${DLC_UBUNTU}#L1-L13`}>
          DLC Dockerfile L1-L13
        </Cite>{' '}
        <Cite tier={1} href={`${DLC_UBUNTU}#L55-L73`}>
          DLC Dockerfile L55-L73
        </Cite>
        . Mooncake: swap in the EFA wheel.
      </>
    ),
    ep: (
      <>
        Inherits NCCL 2.30.7{' '}
        <Cite tier={1} href={sglangUrl(DOCKERFILE, 'L508-L512')}>
          Dockerfile L508-L512
        </Cite>
        : upgrade <code>nvidia-nccl-cu13</code> and install the fork.
      </>
    ),
  },
  {
    id: 'al2023',
    image: (
      <>
        AWS Amazon Linux 2023 DLC, <code>server-cuda</code> and <code>server-sagemaker-cuda</code>{' '}
        v1.4, on SGLang 0.5.19
      </>
    ),
    kv: (
      <>
        NIXL over LIBFABRIC with the EFA installer. Mooncake: the image installs the standard
        0.3.13 wheel{' '}
        <Cite tier={1} href={`${DLC_AL2023}#L168-L170`}>
          DLC Dockerfile.amzn2023 L168-L170
        </Cite>
        , so swap in the EFA build.
      </>
    ),
    ep: (
      <>
        Ready: DeepEP V2 from the fork at <code>874779c9</code>, NCCL 2.31.2 and EFA 1.50.0{' '}
        <Cite tier={1} href={`${DLC_CHANGELOG}#L7-L22`}>
          DLC changelog v1.4.0
        </Cite>
        . Section 21 covers which families its kernels target.
      </>
    ),
  },
];

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

export function PdWideEpOverEfa() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Bring up PD (prefill/decode) KV (key-value) cache transfer and wide EP (expert parallelism) all-to-all over EFA (Elastic Fabric Adapter) as two separate stacks, with the check that proves each layer (verified against SGLang v0.5.22, commit baa9befa, 2026-10-24)"
          >
            22. PD and Wide EP over EFA
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            PD disaggregation and wide EP are two SGLang features that put sustained traffic on
            the network between GPU nodes. PD moves each request&apos;s KV cache from a
            prefill server to a decode server; wide EP runs an all-to-all exchange on every layer
            of an MoE (mixture of experts) model. On AWS that traffic crosses EFA, and the
            challenge is that the two features reach it through different libraries, so each needs
            its own bring-up and its own proof that it runs on EFA rather than on TCP. Section 15,
            PD Disaggregation, and section 16, Wide Expert Parallelism, cover what the features do;
            this section covers the transport underneath. The layers below SGLang belong to the EFA
            dive: <Link href="../efa/">EFA dive: libfabric and the EFA Provider</Link> and{' '}
            <Link href="../efa/">EFA dive: NCCL over EFA: the aws-ofi-nccl Plugin</Link>.
          </Box>
          <Box variant="p">
            The figure to carry through this section:{' '}
            <strong>
              DeepEP V2 over EFA needs NCCL (NVIDIA Collective Communications Library) 2.31.2 or
              later, while the upstream v0.5.22 image and
              the AWS Ubuntu DLC (Deep Learning Container) built on it ship NCCL 2.30.7
            </strong>{' '}
            <Cite tier={1} href={`${GIN_DOC}#L10-L15`}>
              aws-ofi-nccl getting-started guide L10-L15
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(DOCKERFILE, 'L16')}>
              Dockerfile L16
            </Cite>{' '}
            <Cite tier={1} href={`${DLC_UBUNTU}#L1-L6`}>
              DLC Dockerfile L1-L6
            </Cite>
            . An image can pass every KV check and still fail the expert all-to-all at the NCCL
            layer.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Know which library each feature runs through on EFA, and predict when an image ready for PD is still unready for wide EP"
          >
            Two stacks on one fabric
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            KV transfer runs on libfabric and its EFA provider. SGLang has two routes there: the
            Mooncake transfer engine with Mooncake&apos;s EFA wheel and{' '}
            <code>MOONCAKE_PROTOCOL=efa</code>{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(PD_DOC, 'L112-L132')}>
              SGLang docs: PD Disaggregation, AWS EFA (v0.5.22 source)
            </Cite>
            , a route on which SGLang refuses CUDA VMM (CUDA virtual memory management)
            allocators{' '}
            <Cite tier={1} href={sglangUrl(MC_UTILS, 'L40-L61')}>
              mooncake/utils.py L40-L61
            </Cite>
            , or NIXL (NVIDIA Inference Xfer Library) with{' '}
            <code>SGLANG_DISAGGREGATION_NIXL_BACKEND=LIBFABRIC</code>{' '}
            <Cite tier={1} href={sglangUrl(NIXL_CONN, 'L473-L519')}>
              nixl/conn.py L473-L519
            </Cite>
            . Neither is the default. <code>--disaggregation-transfer-backend</code> defaults to{' '}
            <code>mooncake</code>{' '}
            <Cite tier={1} href={sglangUrl(DISAGG_FIELDS, 'L65-L71')}>
              disagg.py L65-L71
            </Cite>
            , <code>MOONCAKE_PROTOCOL</code> to <code>rdma</code>{' '}
            <Cite tier={1} href={sglangUrl(ENVIRON, 'L824')}>
              environ.py L824
            </Cite>
            , and the NIXL backend to <code>UCX</code> (Unified Communication X){' '}
            <Cite tier={1} href={sglangUrl(ENVIRON, 'L713-L714')}>
              environ.py L713-L714
            </Cite>
            .
          </Box>
          <Box variant="p">
            Expert all-to-all runs on NCCL. The route for <code>--moe-a2a-backend deepep_v2</code>{' '}
            is NCCL GIN (GPU-Initiated Networking) through aws-ofi-nccl, AWS&apos;s NCCL network
            plugin, with DeepEP V2 built from AWS&apos;s fork, which adds the GIN backend for EFA{' '}
            <Cite tier={1} href={`${DLC_CHANGELOG}#L19-L22`}>
              DLC changelog v1.4.0
            </Cite>
            . On P5en, P6-B200 and P6-B300, GIN can run as EFA-GDA (Elastic Fabric Adapter GPU
            Direct Async), where the GPU kernel initiates network operations itself; elsewhere a
            CPU proxy thread assists{' '}
            <Cite tier={1} href={`${GIN_DOC}#L1-L15`}>
              aws-ofi-nccl GIN guide L1-L15
            </Cite>{' '}
            <Cite tier={1} href={`${GIN_DOC}#L35-L44`}>
              L35-L44
            </Cite>
            . AWS samples add DeepEP V1 on the libfabric transport of NVSHMEM (NVIDIA&apos;s OpenSHMEM
            library) and UCCL-EP, the UCCL project&apos;s DeepEP-compatible library, both covered
            further down.
          </Box>
          <Box variant="p">
            The libraries do not cross over. Mooncake&apos;s EFA wheel is built without Mooncake
            EP, so <code>--moe-a2a-backend mooncake</code> has no EFA build to run on{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(PD_DOC, 'L132')}>
              SGLang docs: PD Disaggregation L132
            </Cite>
            . NIXL&apos;s EP backend uses NIXL&apos;s GPU device API, and at NIXL v1.5.0 only the
            UCX backend implements it: the base backend returns not-supported, UCX overrides it,
            LIBFABRIC does not, and NIXL&apos;s EP example creates a UCX backend{' '}
            <Cite tier={1} href={`${NIXL}/src/api/cpp/backend/backend_engine.h#L157-L170`} kind="code">
              NIXL backend_engine.h L157-L170
            </Cite>{' '}
            <Cite tier={1} href={`${NIXL}/src/plugins/ucx/ucx_backend.h#L188-L193`} kind="code">
              NIXL ucx_backend.h L188-L193
            </Cite>{' '}
            <Cite tier={1} href={`${NIXL}/examples/device/ep/csrc/nixl_ep.cpp#L1420-L1432`} kind="code">
              NIXL nixl_ep.cpp L1420-L1432
            </Cite>
            . So NIXL reaches EFA for KV transfer and not for MoE all-to-all (read from code, not
            run).
          </Box>
          <Box variant="p">
            Our reading of the two stacks together:{' '}
            <strong>one image can be ready for PD over EFA and not for wide EP.</strong> The AWS
            Ubuntu DLC installs the EFA installer, which gives NIXL&apos;s LIBFABRIC plugin its
            libfabric{' '}
            <Cite tier={1} href={`${DLC_UBUNTU}#L55-L73`}>
              DLC Dockerfile L55-L73
            </Cite>
            , and keeps the upstream image&apos;s NCCL 2.30.7, below the DeepEP V2 floor.
          </Box>
          <TwoStacksDiagram />
          <Box variant="small" color="text-body-secondary">
            Layer order and checks are our reading of the sources cited in this section;
            illustrative, not measured. Version numbers come from the aws-ofi-nccl GIN guide, the
            EFA installer release notes and the v0.5.22 Dockerfile. Section 15 and section 16 own
            the mechanisms on top of each stack.
          </Box>
          <Box variant="p">
            Both stacks stand on the EFA installer, which brings the EFA kernel driver, libfabric
            and aws-ofi-nccl in one package: installer 1.50.0 (2026-08-21) ships libfabric
            2.6.0amzn1.0, EFA driver 3.3.0 and aws-ofi-nccl 1.21.1, and 1.51.0 (2026-10-22) ships
            libfabric 2.7.0amzn2.0, driver 3.3.1 and aws-ofi-nccl 1.22.0{' '}
            <Cite tier={1} href={EFA_CHANGELOG}>
              AWS docs: EFA release notes
            </Cite>
            . <code>fi_info -p efa -t FI_EP_RDM</code> returns libfabric&apos;s EFA interfaces of
            type <code>FI_EP_RDM</code>, libfabric&apos;s reliable-datagram endpoint{' '}
            <Cite tier={1} href={EFA_NIXL_DOC}>
              AWS docs: EFA and NIXL, step 5
            </Cite>
            , which makes it the first check on both stacks.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Pick the KV route your image can run, set its one variable on both roles, and confirm the transport in the log before any benchmark"
          >
            KV transfer: Mooncake&apos;s EFA wheel or NIXL&apos;s LIBFABRIC plugin
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The Mooncake route keeps SGLang&apos;s default transfer backend and changes one
            environment variable, <code>MOONCAKE_PROTOCOL=efa</code>, on prefill and decode. SGLang
            passes it to Mooncake&apos;s <code>TransferEngine.initialize</code> as the protocol{' '}
            <Cite tier={1} href={sglangUrl(MC_ENGINE, 'L195-L222')}>
              mooncake_transfer_engine.py L195-L222
            </Cite>
            ; no SGLang flag changes. It needs a different wheel:{' '}
            <code>mooncake-transfer-engine-efa-cuda13==0.3.13.post1</code> replaces{' '}
            <code>mooncake-transfer-engine-cuda13</code>, the two install the same{' '}
            <code>mooncake</code> module and must not be installed side by side, the EFA build is
            x86_64 only, and it bundles neither libfabric nor libefa, so the EFA installer&apos;s{' '}
            <code>/opt/amazon/efa/lib</code> or <code>lib64</code> goes on{' '}
            <code>LD_LIBRARY_PATH</code>{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(PD_DOC, 'L112-L132')}>
              SGLang docs: PD Disaggregation, AWS EFA (v0.5.22 source)
            </Cite>{' '}
            <Cite tier={1} href={MC_EFA_PYPI}>
              PyPI: mooncake-transfer-engine-efa-cuda13 0.3.13.post1
            </Cite>
            .
          </Box>
          <Box variant="p">
            The EFA path rules out CUDA VMM allocations, because
            the current libfabric EFA provider cannot transfer them{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(PD_DOC, 'L134-L143')}>
              SGLang docs: PD Disaggregation L134-L143
            </Cite>
            . SGLang enforces two of the documented rules at startup: with{' '}
            <code>MOONCAKE_PROTOCOL=efa</code>, <code>SGLANG_MOONCAKE_CUSTOM_MEM_POOL</code> set to{' '}
            <code>NVLINK</code> or <code>BAREX</code>, or <code>expandable_segments:True</code> in{' '}
            <code>PYTORCH_CUDA_ALLOC_CONF</code> or <code>PYTORCH_ALLOC_CONF</code>, raises a{' '}
            <code>ValueError</code> before the transfer engine starts, and{' '}
            <code>INTRA_NODE_NVLINK</code> is allowed{' '}
            <Cite tier={1} href={sglangUrl(MC_UTILS, 'L40-L61')}>
              mooncake/utils.py L40-L61
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(MC_CONN, 'L255-L260')}>
              mooncake/conn.py L255-L260
            </Cite>
            . It also keeps post-capture KV sizing off for Mooncake over EFA and uses the regular{' '}
            <code>cudaMalloc</code> pool{' '}
            <Cite tier={1} href={sglangUrl(OVERRIDES, 'L1764-L1769')}>
              overrides.py L1764-L1769
            </Cite>
            ; that sizing is an opt-in, <code>SGLANG_ENABLE_POST_CAPTURE_KV_SIZING</code>, off by
            default{' '}
            <Cite tier={1} href={sglangUrl(ENVIRON, 'L588-L589')}>
              environ.py L588-L589
            </Cite>
            , so on defaults the KV pool is sized the same way as on InfiniBand. The last rule is yours to keep: the documentation says to leave{' '}
            <code>MC_FORCE_MNNVL</code> and <code>NCCL_MNNVL_ENABLE</code> unset, since they select MNNVL (multi-node NVLink), a transport EFA does not provide, and the
            startup check reads neither{' '}
            <Cite tier={1} href={sglangUrl(MC_UTILS, 'L40-L61')} kind="code">
              mooncake/utils.py L40-L61
            </Cite>
            .
          </Box>
          <Box variant="p">
            One failure on this route raises no error. AWS&apos;s DeepSeek-R1 sample reports that
            without <code>MOONCAKE_PROTOCOL=efa</code> its KV cache moved over TCP sockets: the
            server came up, returned correct tokens and passed a smoke test, then deadlocked under
            sustained high-concurrency prefill with <code>KVTransferError ... session is not alive</code>.
            Its check is one server-log line on every role, <code>EfaTransport: Initialized EFA device</code>{' '}
            where the failing runs show <code>Installing TCP transport</code>{' '}
            <Cite tier={2} href={`${DSR1}#L68-L83`}>
              AWS sample dsr1-deepep-efa L68-L83
            </Cite>{' '}
            <Cite tier={2} href={`${DSR1}#L248-L252`}>
              AWS sample L248-L252
            </Cite>
            . Those runs used SGLang 0.5.13.post1 with Mooncake built from source with EFA on{' '}
            <Cite tier={2} href={`${DSR1}#L18-L27`}>
              AWS sample L18-L27
            </Cite>
            .
          </Box>
          <Box variant="p">
            The NIXL route takes <code>--disaggregation-transfer-backend nixl</code> and{' '}
            <code>SGLANG_DISAGGREGATION_NIXL_BACKEND=LIBFABRIC</code>. SGLang creates the named NIXL
            backend at startup and logs{' '}
            <code>NIXL KVManager initialized with backend: LIBFABRIC</code> when it is present{' '}
            <Cite tier={1} href={sglangUrl(NIXL_CONN, 'L473-L519')}>
              nixl/conn.py L473-L519
            </Cite>
            . When the plugin is missing, startup fails on NIXL&apos;s own not-found error from that
            create call, ahead of SGLang&apos;s plugin-list check{' '}
            <Cite tier={1} href={`${NIXL}/src/core/nixl_agent.cpp#L333-L339`} kind="code">
              NIXL nixl_agent.cpp L333-L339
            </Cite>{' '}
            <Cite tier={1} href={`${NIXL}/src/bindings/python/nixl_bindings.cpp#L601-L608`} kind="code">
              nixl_bindings.cpp L601-L608
            </Cite>
            . The <code>nixl</code> wheel builds its LIBFABRIC plugin against an EFA-enabled
            libfabric and leaves libfabric and libefa out of the wheel, so it loads whatever
            libfabric the library path finds{' '}
            <Cite tier={1} href={`${NIXL}/contrib/Dockerfile.manylinux#L328-L345`}>
              NIXL Dockerfile.manylinux L328-L345
            </Cite>{' '}
            <Cite tier={1} href={`${NIXL}/contrib/build-wheel.sh#L100-L100`} kind="code">
              NIXL build-wheel.sh L100
            </Cite>
            ; that is read from the build scripts, and the published wheel&apos;s file list was not
            inspected. Inside a container, put <code>/opt/amazon/efa/lib</code> (Ubuntu) or{' '}
            <code>lib64</code> (Amazon Linux 2023) ahead of the distro libfabric the upstream image
            installs{' '}
            <Cite tier={1} href={sglangUrl(DOCKERFILE, 'L710')}>
              Dockerfile L710
            </Cite>
            .
          </Box>
          <Box variant="p">
            EFA supports only NIXL 1.0.0 and later, AWS validates the install with{' '}
            <code>nixlbench --backend LIBFABRIC</code>, and its serving example is vLLM only, with
            SGLang named as a framework that can use NIXL{' '}
            <Cite tier={1} href={EFA_NIXL_DOC}>
              AWS docs: Get started with EFA and NIXL
            </Cite>
            ; the SGLang side is the one variable above. SGLang adds no EFA-specific check on its
            NIXL path: a search of the v0.5.22 NIXL transfer code for <code>efa</code> and{' '}
            <code>libfabric</code> finds nothing{' '}
            <Cite tier={1} href={sglangTreeUrl(`${SRT}/disaggregation/nixl`)} kind="code">
              disaggregation/nixl/
            </Cite>
            . The CUDA VMM limit belongs to the libfabric EFA provider, so our reading is that the
            Mooncake allocator settings apply on the NIXL route too; this was not tested.
          </Box>
          <Box variant="p">
            Which image carries which route, across both stacks:
          </Box>
          <Table
            variant="embedded"
            wrapLines
            trackBy="id"
            items={IMAGE_ROWS}
            columnDefinitions={[
              { id: 'image', header: 'Image', cell: (r) => r.image, minWidth: 160 },
              { id: 'kv', header: 'KV transfer over EFA', cell: (r) => r.kv, minWidth: 240 },
              { id: 'ep', header: 'Expert all-to-all over EFA', cell: (r) => r.ep, minWidth: 220 },
            ]}
          />
          <ExpandableSection headerText="Mooncake's published EFA ceiling (project claim, not reproduced)">
            <Box variant="p">
              Mooncake&apos;s in-repo transfer-engine benchmark reports, between two p5.48xlarge
              instances in one placement group, a GPU-to-GPU write peak of 388.90 GB/s and a read
              peak of 381.64 GB/s with 1 MB blocks, 32 threads and batch 128, and puts the write
              peak at about 97% of the 400 GB/s line rate of 32 x 100 Gbps{' '}
              <Cite tier={2} href={MC_BENCH}>
                Mooncake efa_transport.md L354-L385 (project claim)
              </Cite>
              . KV pages are far smaller than 1 MB, so read it as the fabric&apos;s ceiling for
              this transfer engine.
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Get DeepEP V2 across EFA nodes with the fork, the NCCL floor and the GIN backend your instance family supports"
          >
            Expert all-to-all: DeepEP V2 on NCCL GIN
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            On the SGLang side, wide EP over EFA is <code>--moe-a2a-backend deepep_v2</code> with{' '}
            <code>--deepep-v2-mode hybrid</code>. The mode defaults to <code>direct</code>, which
            is single-node NVLink{' '}
            <Cite tier={1} href={sglangUrl(EXEC_FIELDS, 'L813-L820')}>
              exec_.py L813-L820
            </Cite>
            , and SGLang refuses <code>direct</code> when <code>--nnodes</code> is above 1{' '}
            <Cite tier={1} href={sglangUrl(MOE_HOOK, 'L368-L372')}>
              moe_hook.py L368-L372
            </Cite>
            . The backend sets <code>NCCL_CUMEM_ENABLE=1</code> unless you set it{' '}
            <Cite tier={1} href={sglangUrl(MOE_HOOK, 'L336-L339')}>
              moe_hook.py L336-L339
            </Cite>
            , and it sets no GIN or plugin variable: a search of <code>python/sglang</code> for{' '}
            <code>NCCL_GIN</code> and <code>NCCL_NET_PLUGIN</code> finds nothing at v0.5.22{' '}
            <Cite tier={1} href={sglangTreeUrl('python/sglang')} kind="code">
              python/sglang/
            </Cite>
            . Section 16, Wide Expert Parallelism, covers its other launch rules.
          </Box>
          <Box variant="p">
            <strong>The DeepEP build.</strong> SGLang imports <code>ElasticBuffer</code> from{' '}
            <code>deep_ep</code>{' '}
            <Cite tier={1} href={sglangUrl(DEEPEP_V2, 'L40-L41')}>
              deepep_v2.py L40-L41
            </Cite>
            , and <code>pip install sglang</code> brings <code>sgl-deep-ep==0.1.2.post1</code>{' '}
            <Cite tier={1} href={sglangUrl(PYPROJECT, 'L79')}>
              pyproject.toml L79
            </Cite>
            , whose hybrid kernels are the ordered ones only{' '}
            <Cite tier={1} href={SGL_DEEP_EP_PYPI} kind="code">
              PyPI: sgl-deep-ep 0.1.2.post1 (wheel inspected)
            </Cite>
            . Ordered kernels need strong signals and VA (virtual-address) signals, and EFA-GDA
            supports neither{' '}
            <Cite tier={1} href={`${GIN_DOC}#L56-L69`}>
              aws-ofi-nccl GIN guide L56-L69
            </Cite>
            . The amazon-contributing/DeepEP fork adds unordered hybrid kernels that need neither,
            makes them the default, and prints{' '}
            <code>DeepEP hybrid kernel selection: unordered</code> when a process selects them{' '}
            <Cite tier={1} href={`${FORK_SELECT}#L25-L52`}>
              AWS DeepEP fork kernel_select.hpp L25-L52
            </Cite>
            . Install the fork; the AWS Amazon Linux 2023 DLC builds it at commit{' '}
            <code>874779c9</code>{' '}
            <Cite tier={1} href={`${DLC_AL2023}#L13-L23`}>
              DLC Dockerfile.amzn2023 L13-L23
            </Cite>{' '}
            <Cite tier={1} href={`${DLC_AL2023}#L135-L160`}>
              L135-L160
            </Cite>
            . Whether the stock wheel runs over the CPU-proxy backend was not tested. SGLang&apos;s
            import error points to deepseek-ai/DeepEP{' '}
            <Cite tier={1} href={sglangUrl(DEEPEP_V2, 'L90-L98')}>
              deepep_v2.py L90-L98
            </Cite>
            , whose main branch at <code>f6aa38fe</code> exports <code>EPBuffer</code>,{' '}
            <code>EngramBuffer</code> and <code>PPBuffer</code> and no <code>ElasticBuffer</code>{' '}
            <Cite tier={1} href={UPSTREAM_DEEPEP_INIT}>
              DeepEP __init__.py L60-L67
            </Cite>
            , so install the fork in place of what the message suggests.
          </Box>
          <Box variant="p">
            <strong>The NCCL floor.</strong> GIN needs NCCL 2.31.2 or later, aws-ofi-nccl 1.21.0 or
            later, and GDRCopy 2.5 or later for both the runtime and the <code>gdrdrv</code> kernel
            driver{' '}
            <Cite tier={1} href={`${GIN_DOC}#L10-L15`}>
              aws-ofi-nccl GIN guide L10-L15
            </Cite>
            . <strong>The upstream v0.5.22 image pins NCCL 2.30.7</strong> and reinstalls{' '}
            <code>nvidia-nccl-cu13</code> at that version after its dependency solve, with a comment that DeepEP needs it at
            runtime{' '}
            <Cite tier={1} href={sglangUrl(DOCKERFILE, 'L16')}>
              Dockerfile L16
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(DOCKERFILE, 'L508-L512')}>
              Dockerfile L508-L512
            </Cite>
            ; its GDRCopy is 2.5.1{' '}
            <Cite tier={1} href={sglangUrl(DOCKERFILE, 'L15')}>
              Dockerfile L15
            </Cite>
            , so the host&apos;s <code>gdrdrv</code> is the GDRCopy part to check (our reading).
            The AWS Amazon Linux 2023 DLC carries 2.31.2, which its release notes say the backend
            requires and checks at runtime, and it runs SGLang 0.5.19{' '}
            <Cite tier={1} href={`${DLC_CHANGELOG}#L7-L22`}>
              DLC changelog v1.4.0
            </Cite>
            . Upgrade <code>nvidia-nccl-cu13</code> in the image you run, or use that DLC. Check the
            NCCL that loads rather than the one PyTorch reports: AWS&apos;s EP benchmark recorded
            PyTorch&apos;s build constant as 2.29.7 while every arm loaded 2.31.2{' '}
            <Cite tier={2} href={`${EP_CMP}/RESULTS.md#L20-L20`}>
              AWS sample ep-backend-comparison RESULTS.md L20
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>The plugin.</strong> aws-ofi-nccl is how NCCL reaches EFA. Set{' '}
            <code>NCCL_NET_PLUGIN=ofi</code>, the short name. AWS&apos;s sample reports that the
            EFA installer&apos;s plugin package ships only <code>libnccl-net-ofi.so</code>, that
            NCCL looks for <code>libnccl-net.so</code> by default, logs{' '}
            <code>NET/Plugin: Could not find: libnccl-net.so</code> and falls back to TCP sockets,
            about 14 GB/s against about 400 GB/s, visible only as 3 to 5 times worse prefill TTFT
            (time to first token){' '}
            <Cite tier={2} href={`${DSR1}#L93-L93`}>
              AWS sample dsr1-deepep-efa L93
            </Cite>
            . AWS&apos;s DLC install script expects <code>libnccl-net-ofi.so</code> from installer
            1.44.0 on{' '}
            <Cite tier={1} href={`${DLC_INSTALL_EFA}#L19-L38`}>
              DLC install_efa.sh L19-L38
            </Cite>
            . The same plugin carries every cross-node NCCL collective, including MoE layers on{' '}
            <code>--moe-a2a-backend none</code>, so the check applies to any multi-node SGLang on
            EFA (our reading).
          </Box>
          <Box variant="p">
            <strong>The GIN backend, by instance family.</strong> aws-ofi-nccl runs GIN in two
            modes: proxy mode, where the GPU queues network operations and a CPU thread assists,
            and EFA-GDA, where the kernel initiates network communication directly{' '}
            <Cite tier={1} href={`${GIN_DOC}#L5-L8`}>
              aws-ofi-nccl GIN guide L5-L8
            </Cite>
            . EFA-GDA needs a P5en, P6-B200 or P6-B300; libfabric 2.6.0, rdma-core 64.0amzn0 and
            EFA driver 3.3.0 or later, which EFA installer 1.50.0 or later provides; and the NVIDIA
            driver loaded with <code>PeerMappingOverride=1</code>, which takes effect after a
            driver reload or a reboot{' '}
            <Cite tier={1} href={`${GIN_DOC}#L35-L54`}>
              aws-ofi-nccl GIN guide L35-L54
            </Cite>
            . Turn it on with <code>NCCL_GIN_TYPE=5</code> and{' '}
            <code>NCCL_SYM_GIN_KERNELS_ENABLE=0</code>; without the first, NCCL 2.31 uses proxy
            mode on EFA{' '}
            <Cite tier={1} href={`${GIN_DOC}#L71-L81`}>
              aws-ofi-nccl GIN guide L71-L81
            </Cite>
            . P5 and P5e are not on the EFA-GDA list, so DeepEP V2 there runs through the proxy.
            With <code>NCCL_DEBUG=INFO</code> and debug subsystems INIT, ENV and NET, EFA-GDA shows
            as <code>NCCL_GIN_TYPE set by environment to 5</code> followed by{' '}
            <code>NET/OFI gin GDAKI: createContext done</code>{' '}
            <Cite tier={1} href={`${GIN_DOC}#L98-L103`}>
              aws-ofi-nccl GIN guide L98-L103
            </Cite>
            .
          </Box>
          <ExpandableSection headerText="Two more EP routes on EFA, from AWS samples">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>DeepEP V1 on NVSHMEM&apos;s libfabric transport</strong>{' '}
                (<code>--moe-a2a-backend deepep</code>). DeepEP V1&apos;s internode kernels were
                written for IBGDA, which EFA does not provide. AWS&apos;s sample rewrites them onto
                NVSHMEM host-proxy paths and runs DeepSeek-R1 on two p5.48xlarge or p5en.48xlarge
                nodes with DeepEP <code>567632d</code> plus the EFA patch, NVSHMEM 3.7.0 built with
                only the libfabric transport, <code>NVSHMEM_REMOTE_TRANSPORT=libfabric</code>,{' '}
                <code>NVSHMEM_LIBFABRIC_PROVIDER=efa</code> and <code>/dev/gdrdrv</code> passed into
                the container, on SGLang 0.5.13.post1{' '}
                <Cite tier={2} href={`${DSR1}#L4-L37`}>
                  AWS sample dsr1-deepep-efa L4-L37
                </Cite>{' '}
                <Cite tier={2} href={`${DSR1}#L85-L96`}>
                  L85-L96
                </Cite>
                . The sample names a trap that applies to any DeepEP swap: the base image&apos;s
                stock <code>deep_ep</code> sits ahead on <code>sys.path</code>, so the server
                starts and logs DeepEP while running the wrong build, and the sample asserts the
                import path when it builds the image{' '}
                <Cite tier={2} href={`${DSR1}#L39-L48`}>
                  AWS sample L39-L48
                </Cite>
                .
              </Box>
              <Box variant="p">
                <strong>UCCL-EP</strong>, the UCCL project&apos;s DeepEP-compatible dispatch and
                combine over UCCL all-to-all and EFA{' '}
                <Cite tier={2} href={`${EP_CMP}/README.md#L5-L9`}>
                  AWS sample ep-backend-comparison README L5-L9
                </Cite>
                . UCCL&apos;s <code>ep/deep_ep_wrapper</code> exposes it under DeepEP&apos;s Python
                API, so <code>--moe-a2a-backend deepep</code> drives it unchanged. The sample runs
                the container <code>--privileged</code> and makes the mode explicit, reporting that
                with <code>--deepep-mode auto</code> UCCL&apos;s prefill path segfaults at startup;
                it is Hopper-only in that sample{' '}
                <Cite tier={2} href={`${DSR1}#L254-L274`}>
                  AWS sample dsr1-deepep-efa L254-L274
                </Cite>
                .
              </Box>
              <Box variant="p">
                Of the other backends, <code>none</code> keeps MoE on NCCL collectives through
                aws-ofi-nccl; <code>mooncake</code> and <code>nixl</code> have no EFA path, as
                above; <code>mori</code> is for AMD GPUs{' '}
                <Cite tier={1} href={sglangDocsSrcUrl('advanced_features/expert_parallelism', 'L50-L53')}>
                  SGLang docs: Expert Parallelism L50-L53
                </Cite>
                ; and whether <code>pplx</code> runs across EFA nodes was not verified during this
                research{' '}
                <Cite tier={1} href={sglangUrl(MOE_UTILS, 'L33-L47')}>
                  moe/utils.py L33-L47
                </Cite>
                .
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <ExpandableSection headerText="What AWS reports for expert parallelism over EFA (AWS sample and blog claims, not reproduced)">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>End to end, H200.</strong> AWS&apos;s DeepSeek-R1 sample, on SGLang
                0.5.13.post1 with single-pass runs, reports DeepEP V1 leading prefill at 161.5k
                input tokens per second (1K input, concurrency 256) and UCCL-EP leading decode at
                4094 tokens per second with TPOT (time per output token) 28 ms using DP (data
                parallelism) attention. It assembles DeepEP on prefill plus UCCL-EP on decode from
                per-stage measurements and states that the combination was not run end to end as
                one deployment{' '}
                <Cite tier={2} href={`${DSR1}#L294-L311`}>
                  AWS sample dsr1-deepep-efa L294-L311
                </Cite>
                .
              </Box>
              <Box variant="p">
                <strong>Kernel level, B200.</strong> AWS&apos;s synthetic dispatch-plus-combine
                benchmark, EP16 on two p6-b200.48xlarge nodes with 16 independent process starts,
                hidden size 7,168, 256 experts and top-8 routing, reports DeepEP V2 on EFA-GDA with
                the lowest slowest-rank latency in all four decode and prefill cells: about 10% to
                19% ahead of UCCL for decode and 39% to 50% for prefill{' '}
                <Cite tier={2} href={`${EP_CMP}/RESULTS.md#L5-L34`}>
                  AWS sample ep-backend-comparison RESULTS.md L5-L34
                </Cite>
                .
              </Box>
              <Box variant="p">
                <strong>RL (reinforcement learning) rollout, P5en.</strong> AWS&apos;s blog of 2026-09-25 claims
                &quot;enabling DeepEP over EFA increased aggregate RL rollout throughput by 40
                percent&quot; across 48 P5en instances, 16 for training and 32 for inference, with
                SGLang 0.5.17, DeepEP 2.0.0, NCCL 2.31.2 and EFA installer 1.49{' '}
                <Cite tier={2} href={AWS_RL_BLOG}>
                  AWS ML blog, 2026-09-25 (vendor claim)
                </Cite>
                . The baseline also differs in CUDA (12.9), PyTorch (2.9.1), NCCL (2.27), SGLang
                (0.5.9) and RL framework, so the 40 percent cannot be attributed to DeepEP alone.
                Installer 1.49 bundles aws-ofi-nccl 1.20.0{' '}
                <Cite tier={1} href={EFA_CHANGELOG}>
                  AWS docs: EFA release notes
                </Cite>
                , older than the 1.21 release that adds GIN{' '}
                <Cite tier={1} href={`${GIN_DOC}#L3`}>
                  aws-ofi-nccl GIN guide L3
                </Cite>
                , and the post does not say which GIN backend carried the traffic.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Keep each prefill and decode pair, and each EP group, in one network segment, and know what to use when capacity comes as a Capacity Block"
          >
            Place the pairs close
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A cluster placement group keeps instances in one Availability Zone and in the same
            high-bisection bandwidth segment of the network, and AWS recommends launching the
            group&apos;s instances in one request with one instance type. Capacity Blocks do not
            support placement groups{' '}
            <Cite tier={1} href={PLACEMENT_DOC}>
              AWS docs: Placement strategies
            </Cite>
            ; among GPU types, Capacity Blocks cover p4d, p4de, p5.4xlarge, p5, p5e, p5en, p6-b200
            and p6-b300, plus P6e-GB200 UltraServers{' '}
            <Cite tier={1} href={CAPACITY_BLOCKS_DOC}>
              AWS docs: Capacity Blocks for ML
            </Cite>
            . <code>DescribeInstanceTopology</code> returns three network-node levels for p4d,
            p4de, p5.48xlarge, p5e, p5en, g6e, g7e and p6e-gb200, and four for p6-b200 and
            p6-b300{' '}
            <Cite tier={1} href={TOPOLOGY_DOC}>
              AWS docs: EC2 topology prerequisites
            </Cite>
            ; our reading is to use it to put each prefill and decode pair, and each EP group, under
            the same lowest node. The vLLM dive covers both tools engine-neutrally (
            <Link href="../vllm/">vLLM dive, section 23: EC2 Topology &amp; Placement Groups</Link>).
          </Box>
          <Box variant="p">
            <strong>Against vLLM:</strong> the NIXL LIBFABRIC route and the EFA installer facts in
            the vLLM dive carry over to SGLang unchanged. SGLang adds a second KV route,
            Mooncake&apos;s EFA wheel with its allocator guard, and runs wide EP over EFA through
            DeepEP V2 from AWS&apos;s fork, which AWS packages in an SGLang DLC; SGLang&apos;s NIXL
            EP backend has no EFA path (
            <Link href="../vllm/">vLLM dive, section 22: vLLM on AWS GPUs, EFA &amp; NIXL</Link>).
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Run the two bring-up orders and stop at the first check that fails, so a TCP fallback never reaches a benchmark"
          >
            Bring up each stack from the bottom
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Both orders climb from the EFA installer one layer at a time, each step ending on the
            check from the diagram; the Mooncake steps follow SGLang&apos;s own EFA instructions{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(PD_DOC, 'L112-L143')}>
              SGLang docs: PD Disaggregation L112-L143
            </Cite>. Pick the instance family and image line first, in section 21, EC2 Instances, Images and
            GPU-Dependent Behaviour.
          </Box>
          <Box variant="p">
            <strong>KV transfer, for PD.</strong> Run it on prefill and decode alike:
          </Box>
          <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>
            <code>{KV_BRINGUP}</code>
          </pre>
          <Box variant="p">
            <strong>Expert all-to-all, for wide EP.</strong> Run it on every node of every role. A
            stop at step 2 is the gap this section opened with: the image ships NCCL 2.30.7, and
            DeepEP V2 over EFA needs 2.31.2 or later.
          </Box>
          <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>
            <code>{EP_BRINGUP}</code>
          </pre>
          <Box variant="p">
            With every check passing on both stacks, return to section 15, PD Disaggregation, for
            the queue gauges that size the pair, and to section 16, Wide Expert Parallelism, for
            the DeepEP mode on each role and the EPLB (expert-parallel load balancer) cadence.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
