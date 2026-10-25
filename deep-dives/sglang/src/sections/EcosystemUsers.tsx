import type { ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Table from '@cloudscape-design/components/table';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';
import { Cite, sglangUrl, sglangTreeUrl, sglangDocsSrcUrl } from '../components/Cite';

/* ------------------------------------------------------------------------ */
/* Sources (every external link pinned to the tag or SHA register 08 read)  */
/* ------------------------------------------------------------------------ */

const README = 'README.md';
const SGLANG_RELEASE = 'https://github.com/sgl-project/sglang/releases/tag/v0.5.22';
const SGLANG_RELEASES = 'https://github.com/sgl-project/sglang/releases';
const README_V0521 = 'https://github.com/sgl-project/sglang/blob/v0.5.21/README.md#L72-L88';
const ADOPTION_PNG =
  'https://github.com/sgl-project/sgl-learning-materials/blob/3fdcfab3f5b651214519b79cf46d7e5923386210/slides/adoption.png';
const SGLANG_IO = 'https://www.sglang.io/';

const LMSYS_ABOUT = 'https://lmsys.org/about/';
const LMSYS_TPU_POST = 'https://www.lmsys.org/blog/2026-07-30-sglang-google-tpu/';
const RADIXARK_POST = 'https://www.radixark.com/blog/radixark-launches-100m-seed';
const PYTORCH_POST = 'https://pytorch.org/blog/sglang-joins-pytorch/';

const OMNI =
  'https://github.com/sgl-project/sglang-omni/blob/8200f49934d66de591c035cab1c626c0600905fa/pyproject.toml#L6-L37';
const SPECFORGE =
  'https://github.com/sgl-project/SpecForge/blob/fddcb4ad37733a821708170df28cac2f7bb6ea05/README.md';
const MINI_SGLANG =
  'https://github.com/sgl-project/mini-sglang/blob/9a91cfafe754aa85daee49998176275667eb58f2/README.md';
const SGL_JAX = 'https://github.com/sgl-project/sglang-jax/tree/9b98cbb3eec2acf0b8b040d987c6df680af911ec';
const TORCHTPU =
  'https://github.com/sgl-project/sglang-torchtpu/blob/00ef120c1e30bf34ef0d48a99f00c5d9ea693f85/README.md';
const OME_README =
  'https://github.com/ome-projects/ome/blob/5f1c40962a9038d6284e24c86d971505ea413229/README.md#L30';

const LINKEDIN_RANKING =
  'https://www.linkedin.com/blog/engineering/ai/turbocharging-linkedins-recommendation-systems-with-sglang';
const LINKEDIN_SCALING =
  'https://www.linkedin.com/blog/engineering/ai/scaling-llm-based-ranking-systems-with-sglang-at-linkedin';
const CLOUDFLARE_CLEF = 'https://blog.cloudflare.com/clef-faster-cheaper-multimodal/';
const CLOUDFLARE_INFIRE = 'https://blog.cloudflare.com/high-performance-llms/';
const BASETEN_STACK = 'https://www.baseten.co/resources/guide/the-baseten-inference-stack/';
const BASETEN_QWEN = 'https://www.baseten.co/blog/day-zero-benchmarks-for-qwen-3-with-sglang-on-baseten/';
const NOVITA = 'https://blogs.novita.ai/blog/optimizing-glm4-moe-for-production/';
const MICROSOFT_FOUNDRY =
  'https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/accelerating-deepseek-inference-with-amd-mi300-a-collaborative-breakthrough/4407673';

const OCI_IMPORT = 'https://docs.oracle.com/en-us/iaas/Content/generative-ai/imported-models.htm';
const GCP_OPEN_MODELS =
  'https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/open-models/choose-serving-option';
const GCP_TPU = 'https://docs.cloud.google.com/tpu/docs/pytorch-on-tpu';
const ALIBABA_PAI = 'https://www.alibabacloud.com/help/en/pai/user-guide/deploy-an-llm/';
const SAGEMAKER_OPENAI =
  'https://docs.aws.amazon.com/sagemaker/latest/dg/realtime-endpoints-openai-compatible.html';
const NVIDIA_2609 = 'https://docs.nvidia.com/deeplearning/frameworks/sglang-release-notes/rel-26-09.html';
const NVIDIA_2510 = 'https://docs.nvidia.com/deeplearning/frameworks/sglang-release-notes/rel-25-10.html';
const AMD_ROCM = 'https://rocm.docs.amd.com/projects/ai-ecosystem/en/latest/inference/sglang.html';
const INTEL_ARTICLE =
  'https://www.intel.com/content/www/us/en/developer/articles/technical/llama4-performance-on-intel-hardware.html';
const DOCKER_TAGS = 'https://hub.docker.com/r/lmsysorg/sglang/tags?name=v0.5.22';
const ASCEND = 'https://www.hiascend.com/eng/developer/inference';

const DEEPSEEK_V3 =
  'https://github.com/deepseek-ai/DeepSeek-V3/blob/9b4e9788e4a3a731f7567338ed15d3ec549ce03b/README.md#L305-L311';
const DEEPSEEK_ENGINE =
  'https://github.com/deepseek-ai/open-infra-index/blob/56d86855fcf6e08fdfd45ce6280bd24322c93351/OpenSourcing_DeepSeek_Inference_Engine/README.md#L12-L20';

const MILES = 'https://github.com/radixark/miles/blob/74f47d37c8d741fef467be558cb0ea2caced60bc';
const SLIME = 'https://github.com/THUDM/slime/blob/0b0c277d5b4cc66efc3b6db269e2e5184e8f3b1e';
const AREAL =
  'https://github.com/areal-project/AReaL/blob/ecc8b0e4dfb4e3965f67121a5c87866a07c390ae/pyproject.toml#L145-L149';
const VERL = 'https://github.com/verl-project/verl/blob/1876b06d0a3e4e71e06230be10af14492ca8a75b';
const ROLL =
  'https://github.com/alibaba/ROLL/blob/581046abce143e643221f8e292895c46a3b20112/requirements_torch280_sglang.txt#L10';
const AREAL_README =
  'https://github.com/areal-project/AReaL/blob/ecc8b0e4dfb4e3965f67121a5c87866a07c390ae/README.md#L143';
const TUNIX_SAMPLER =
  'https://github.com/google/tunix/blob/ce63a9fd65f02c4c398e74f000f98371c1575eb6/tunix/generate/sglang_jax_sampler.py#L28';
const TUNIX =
  'https://github.com/google/tunix/blob/ce63a9fd65f02c4c398e74f000f98371c1575eb6/tunix/rl/rollout/sglang_jax_rollout.py#L28-L41';

const DLC_SHA = '23970abd5b8919ea3e1add74692a0d056b2fcbd9';
const DLC_UBUNTU = `https://github.com/aws/deep-learning-containers/blob/${DLC_SHA}/docker/sglang/Dockerfile#L1-L6`;
const DLC_CHANGELOG = `https://github.com/aws/deep-learning-containers/blob/${DLC_SHA}/docs/sglang/changelog/index.md#L7-L22`;
const ECR_GALLERY = 'https://gallery.ecr.aws/deep-learning-containers/sglang';

const VLLM_GOVERNANCE_LINK = <Link href="../vllm/">vLLM dive, section 26: When Not vLLM</Link>;

/* ------------------------------------------------------------------------ */
/* Diagram 1: the ecosystem map                                              */
/* ------------------------------------------------------------------------ */

const MAP_FAMILY: { name: string; note: string }[] = [
  { name: 'SGLang Omni v0.1.9', note: 'speech models; pins sglang==0.5.22' },
  { name: 'SpecForge', note: 'draft-model training; pin a commit' },
  { name: 'SGL-JAX v0.1.0rc0', note: 'TPU engine in JAX; needs no sglang' },
  { name: 'SGLang-TorchTPU tpu-v0.1.0', note: 'TPU plugin installed beside sglang' },
  { name: 'Mini-SGLang', note: 'teaching copy, about 5,000 lines' },
  { name: 'RoleBasedGroup', note: 'Kubernetes roles API (section 18)' },
];

const MAP_RL: { name: string; pin: string; current?: boolean }[] = [
  { name: 'Miles v0.1.3', pin: '0.5.22 + a branch', current: true },
  { name: 'slime v0.4.0', pin: 'patched 0.5.15.post1' },
  { name: 'AReaL v2.1.0', pin: '0.5.10.post1' },
  { name: 'verl v0.9.1', pin: '0.5.8' },
  { name: 'ROLL v0.4.0', pin: '0.5.2' },
  { name: 'Tunix v0.1.7', pin: 'SGL-JAX, no sglang' },
];

const MAP_VENDOR: { name: string; pin: string; current?: boolean }[] = [
  { name: 'AWS, Ubuntu line', pin: '0.5.22', current: true },
  { name: 'AWS, Amazon Linux', pin: '0.5.19' },
  { name: 'NVIDIA 26.09', pin: '0.5.19' },
  { name: 'AMD guide image', pin: '0.5.15.post1' },
];

const FAM_Y0 = 40;
const FAM_STEP = 58;
const FAM_H = 50;
const ROW_H = 22;
const RL_Y = 62;
const VENDOR_Y = 232;

function EcosystemMapDiagram() {
  const rlH = MAP_RL.length * ROW_H + 6;
  const vendorH = MAP_VENDOR.length * ROW_H + 6;
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 900 428"
        role="img"
        aria-labelledby="eco-map-title"
        style={{ width: '100%', minWidth: 720, height: 'auto' }}
      >
        <title id="eco-map-title">
          SGLang is one Python package, sglang v0.5.22 under Apache-2.0, that carries the LLM runtime
          and SGLang Diffusion, hosted by LMSYS with RadixArk as a maintainer. Around it, sgl-project
          repositories ship on their own release trains: SGLang Omni v0.1.9 pins sglang 0.5.22,
          SpecForge has no tags, SGL-JAX v0.1.0rc0 needs no sglang package, SGLang-TorchTPU
          tpu-v0.1.0 installs beside it, Mini-SGLang teaches the design in about 5,000 lines, and
          RoleBasedGroup is a Kubernetes API. The Shepherd Model Gateway and the Open Model Engine
          moved to their own organisations. Third-party RL frameworks and vendor containers each
          install their own SGLang: Miles 0.5.22 plus a branch, slime a patched 0.5.15.post1, AReaL
          0.5.10.post1, verl 0.5.8, ROLL 0.5.2, and Tunix uses SGL-JAX; the AWS Ubuntu line 0.5.22,
          the AWS Amazon Linux line 0.5.19, NVIDIA&apos;s 26.09 container 0.5.19 and AMD&apos;s guide
          image 0.5.15.post1.
        </title>
        <style>{`
          .eco-map-pkg { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .eco-map-inner { fill: #ffffff; stroke: #0972d3; stroke-width: 1.2; }
          .eco-map-fam { fill: #e6f4f2; stroke: #1f7a70; stroke-width: 1.2; }
          .eco-map-moved { fill: #ffffff; stroke: #879596; stroke-width: 1.2; stroke-dasharray: 5 4; }
          .eco-map-holder { fill: #ffffff; stroke: #414d5c; stroke-width: 1.2; }
          .eco-map-third { fill: #efe7fb; stroke: #6f4cc4; stroke-width: 1.2; }
          .eco-map-h { fill: #414d5c; font: 600 11px sans-serif; text-anchor: start; }
          .eco-map-t { fill: #16191f; font: 600 13px sans-serif; text-anchor: start; }
          .eco-map-n { fill: #16191f; font: 600 12px sans-serif; text-anchor: start; }
          .eco-map-s { fill: #5f6b7a; font: 11px sans-serif; text-anchor: start; }
          .eco-map-b { fill: #16191f; font: 11px sans-serif; text-anchor: start; }
          .eco-map-v { fill: #16191f; font: 12px sans-serif; text-anchor: start; }
          .eco-map-cur { fill: #037f0c; font: 700 12px sans-serif; text-anchor: start; }
          .eco-map-rule { stroke: #d1d5db; stroke-width: 1; }
          .eco-map-lg { fill: #16191f; font: 11px sans-serif; text-anchor: start; }
        `}</style>

        <rect x={0} y={0} width={900} height={428} rx={8} fill="#ffffff" />

        {/* Column headers */}
        <text x={16} y={26} className="eco-map-h">sgl-project repos, own releases</text>
        <text x={298} y={26} className="eco-map-h">One package, and who holds it</text>
        <text x={574} y={26} className="eco-map-h">Third-party code: the SGLang it runs</text>

        {/* Left: sgl-project family */}
        {MAP_FAMILY.map((f, i) => {
          const y = FAM_Y0 + i * FAM_STEP;
          return (
            <g key={f.name}>
              <rect x={16} y={y} width={262} height={FAM_H} rx={6} className="eco-map-fam" />
              <text x={28} y={y + 20} className="eco-map-n">{f.name}</text>
              <text x={28} y={y + 38} className="eco-map-s">{f.note}</text>
            </g>
          );
        })}

        {/* Centre: holders */}
        <rect x={298} y={40} width={256} height={76} rx={6} className="eco-map-holder" />
        <text x={310} y={61} className="eco-map-t">Who holds the project</text>
        <text x={310} y={82} className="eco-map-b">LMSYS: host, a 501(c)(3) non-profit</text>
        <text x={310} y={100} className="eco-map-b">RadixArk: a maintainer; builds Miles</text>

        {/* Centre: the package */}
        <rect x={298} y={134} width={256} height={166} rx={6} className="eco-map-pkg" />
        <text x={310} y={156} className="eco-map-t">sglang v0.5.22</text>
        <text x={310} y={173} className="eco-map-s">one Python package, Apache-2.0</text>
        <rect x={312} y={184} width={228} height={48} rx={5} className="eco-map-inner" />
        <text x={324} y={204} className="eco-map-n">LLM runtime</text>
        <text x={324} y={221} className="eco-map-s">python/sglang/srt</text>
        <rect x={312} y={240} width={228} height={48} rx={5} className="eco-map-inner" />
        <text x={324} y={260} className="eco-map-n">SGLang Diffusion</text>
        <text x={324} y={277} className="eco-map-s">python/sglang/multimodal_gen</text>

        {/* Centre: moved out */}
        <rect x={298} y={318} width={256} height={72} rx={6} className="eco-map-moved" />
        <text x={310} y={338} className="eco-map-n">Moved to their own orgs</text>
        <text x={310} y={357} className="eco-map-b">Shepherd Model Gateway: smg-project</text>
        <text x={310} y={375} className="eco-map-b">Open Model Engine: ome-projects</text>

        {/* Right: RL frameworks */}
        <text x={574} y={54} className="eco-map-h">RL frameworks (release read)</text>
        <rect x={574} y={RL_Y} width={310} height={rlH} rx={6} className="eco-map-third" />
        {MAP_RL.map((r, i) => {
          const base = RL_Y + 18 + i * ROW_H;
          return (
            <g key={r.name}>
              {i > 0 && (
                <line x1={582} y1={RL_Y + 3 + i * ROW_H} x2={876} y2={RL_Y + 3 + i * ROW_H} className="eco-map-rule" />
              )}
              <text x={586} y={base} className="eco-map-n">{r.name}</text>
              <text x={730} y={base} className={r.current ? 'eco-map-cur' : 'eco-map-v'}>{r.pin}</text>
            </g>
          );
        })}

        {/* Right: vendor containers */}
        <text x={574} y={VENDOR_Y - 8} className="eco-map-h">Vendor containers</text>
        <rect x={574} y={VENDOR_Y} width={310} height={vendorH} rx={6} className="eco-map-third" />
        {MAP_VENDOR.map((r, i) => {
          const base = VENDOR_Y + 18 + i * ROW_H;
          return (
            <g key={r.name}>
              {i > 0 && (
                <line
                  x1={582}
                  y1={VENDOR_Y + 3 + i * ROW_H}
                  x2={876}
                  y2={VENDOR_Y + 3 + i * ROW_H}
                  className="eco-map-rule"
                />
              )}
              <text x={586} y={base} className="eco-map-n">{r.name}</text>
              <text x={730} y={base} className={r.current ? 'eco-map-cur' : 'eco-map-v'}>{r.pin}</text>
            </g>
          );
        })}

        {/* Right: orchestrators pointer */}
        <rect x={574} y={346} width={310} height={44} rx={6} className="eco-map-moved" />
        <text x={586} y={366} className="eco-map-b">Orchestrators (llm-d, Dynamo, Ray, KServe):</text>
        <text x={586} y={382} className="eco-map-b">section 18 carries their versions</text>

        {/* Legend */}
        <rect x={16} y={403} width={14} height={14} rx={2} className="eco-map-pkg" />
        <text x={36} y={414} className="eco-map-lg">the sglang package</text>
        <rect x={168} y={403} width={14} height={14} rx={2} className="eco-map-fam" />
        <text x={188} y={414} className="eco-map-lg">sgl-project repository</text>
        <rect x={340} y={403} width={14} height={14} rx={2} className="eco-map-third" />
        <text x={360} y={414} className="eco-map-lg">third-party code</text>
        <text x={500} y={414} className="eco-map-cur">0.5.22</text>
        <text x={548} y={414} className="eco-map-lg">tracks the current release; versions read 2026-10-24</text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Diagram 2: the evidence ladder                                            */
/* ------------------------------------------------------------------------ */

interface Rung {
  key: string;
  cls: string;
  title: string;
  tag: string;
  lines: [string, string, string];
}

const RUNGS: Rung[] = [
  {
    key: 'own',
    cls: 'eco-ladder-own',
    title: 'Runs its own product on SGLang',
    tag: 'first-party engineering posts, Tier 2',
    lines: [
      "LinkedIn ranking: 69% lower latency to rank 50 items (LinkedIn's own measurement)",
      'Cloudflare: its Clef decision model. Also Baseten (per model) and Novita (GLM models)',
      'The source can know: what it runs in production, and under which conditions',
    ],
  },
  {
    key: 'offer',
    cls: 'eco-ladder-offer',
    title: 'Offers SGLang to its customers',
    tag: 'vendor docs Tier 1, vendor blogs Tier 2',
    lines: [
      'Cloud: AWS, Google Cloud, Oracle Cloud, Alibaba Cloud',
      'Hardware: NVIDIA, AMD, Intel and Huawei images and guides',
      'The source can know: what it ships and supports, not which customers run it',
    ],
  },
  {
    key: 'claim',
    cls: 'eco-ladder-claim',
    title: 'Project and maintainer claims',
    tag: 'project claims, Tier 2',
    lines: [
      'README logo wall, sglang.io logo strip',
      'LMSYS and RadixArk scale figures: GPUs and tokens per day, no method given',
      'The source can know: who it works with. No workload, date or scale per name',
    ],
  },
];

const RUNG_Y0 = 44;
const RUNG_H = 96;
const RUNG_GAP = 20;

function EvidenceLadderDiagram() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 900 404"
        role="img"
        aria-labelledby="eco-ladder-title"
        style={{ width: '100%', minWidth: 720, height: 'auto' }}
      >
        <title id="eco-ladder-title">
          An adoption claim is worth what its source can know. Strongest: companies that run their own
          product on SGLang, in their own engineering posts: LinkedIn&apos;s ranking, where
          multi-item scoring cut latency for ranking 50 items by 69% by LinkedIn&apos;s own
          measurement, Cloudflare&apos;s Clef model, Baseten and Novita. Middle: cloud and hardware
          vendors that offer SGLang to customers, which can know what they ship but not who runs it.
          Weakest: the project&apos;s logo walls and the scale figures from LMSYS and RadixArk, which
          name no workload, date or scale. Off the ladder: DeepSeek recommends SGLang for its open
          weights, while its own engine is an early fork of vLLM.
        </title>
        <defs>
          <marker
            id="eco-ladder-ah"
            viewBox="0 0 10 10"
            refX={9}
            refY={5}
            markerWidth={8}
            markerHeight={8}
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="#414d5c" />
          </marker>
        </defs>
        <style>{`
          .eco-ladder-own { fill: #ecf7ec; stroke: #037f0c; stroke-width: 1.5; }
          .eco-ladder-offer { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.2; }
          .eco-ladder-claim { fill: #fbf3d5; stroke: #8b6c00; stroke-width: 1.2; }
          .eco-ladder-side { fill: #ffffff; stroke: #414d5c; stroke-width: 1.2; stroke-dasharray: 5 4; }
          .eco-ladder-t { fill: #16191f; font: 600 13px sans-serif; text-anchor: start; }
          .eco-ladder-tag { fill: #414d5c; font: italic 11px sans-serif; text-anchor: end; }
          .eco-ladder-b { fill: #16191f; font: 11px sans-serif; text-anchor: start; }
          .eco-ladder-k { fill: #5f6b7a; font: 11px sans-serif; text-anchor: start; }
          .eco-ladder-sh { fill: #16191f; font: 600 11px sans-serif; text-anchor: start; }
          .eco-ladder-ax { fill: #414d5c; font: 600 11px sans-serif; text-anchor: middle; }
          .eco-ladder-axis { stroke: #414d5c; stroke-width: 2; fill: none; marker-end: url(#eco-ladder-ah); }
        `}</style>

        <rect x={0} y={0} width={900} height={404} rx={8} fill="#ffffff" />

        {/* Strength axis */}
        <text x={40} y={30} className="eco-ladder-ax">stronger</text>
        <line x1={40} y1={370} x2={40} y2={46} className="eco-ladder-axis" />
        <text x={40} y={392} className="eco-ladder-ax">weaker</text>

        {/* Rungs */}
        {RUNGS.map((r, i) => {
          const y = RUNG_Y0 + i * (RUNG_H + RUNG_GAP);
          return (
            <g key={r.key}>
              <rect x={72} y={y} width={580} height={RUNG_H} rx={6} className={r.cls} />
              <text x={88} y={y + 23} className="eco-ladder-t">{r.title}</text>
              <text x={640} y={y + 23} className="eco-ladder-tag">{r.tag}</text>
              <text x={88} y={y + 45} className="eco-ladder-b">{r.lines[0]}</text>
              <text x={88} y={y + 63} className="eco-ladder-b">{r.lines[1]}</text>
              <text x={88} y={y + 83} className="eco-ladder-k">{r.lines[2]}</text>
            </g>
          );
        })}

        {/* Off the ladder */}
        <rect x={676} y={44} width={208} height={328} rx={6} className="eco-ladder-side" />
        <text x={692} y={67} className="eco-ladder-t">Off the ladder</text>
        <text x={692} y={89} className="eco-ladder-b">Recommends SGLang for</text>
        <text x={692} y={105} className="eco-ladder-b">its open weights</text>
        <text x={692} y={135} className="eco-ladder-sh">DeepSeek-V3 README:</text>
        <text x={692} y={151} className="eco-ladder-b">&quot;Inference with SGLang</text>
        <text x={692} y={167} className="eco-ladder-b">(recommended)&quot;</text>
        <text x={692} y={197} className="eco-ladder-sh">DeepSeek&apos;s own engine,</text>
        <text x={692} y={213} className="eco-ladder-b">April 2025: &quot;based on an</text>
        <text x={692} y={229} className="eco-ladder-b">early fork of vLLM&quot;</text>
        <text x={692} y={263} className="eco-ladder-k">Recommending an engine</text>
        <text x={692} y={279} className="eco-ladder-k">and running it in</text>
        <text x={692} y={295} className="eco-ladder-k">production are separate</text>
        <text x={692} y={311} className="eco-ladder-k">claims</text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* The one table: RL frameworks and vendor containers                        */
/* ------------------------------------------------------------------------ */

interface PinRow {
  id: string;
  who: ReactNode;
  kind: string;
  sglang: ReactNode;
  how: ReactNode;
  src: ReactNode;
}

const PIN_ROWS: PinRow[] = [
  {
    id: 'miles',
    who: 'Miles v0.1.3 (RadixArk), 2026-10-23',
    kind: 'RL framework',
    sglang: (
      <>
        <strong>v0.5.22</strong>, then the <code>sglang-miles</code> branch
      </>
    ),
    how: (
      <>
        Image starts <code>FROM lmsysorg/sglang:v0.5.22</code>, then reinstalls SGLang from the{' '}
        <code>sglang-miles</code> branch of the main repository
      </>
    ),
    src: (
      <>
        <Cite tier={1} href={`${MILES}/docker/Dockerfile#L13-L19`}>
          miles Dockerfile L13-L19
        </Cite>{' '}
        <Cite tier={1} href={`${MILES}/docker/Dockerfile#L213-L226`}>
          L213-L226
        </Cite>
      </>
    ),
  },
  {
    id: 'slime',
    who: 'slime v0.4.0 (THUDM), 2026-10-09',
    kind: 'RL framework',
    sglang: <>0.5.15.post1, patched</>,
    how: (
      <>
        Image built on slime&apos;s own <code>v0.5.15.post1</code> SGLang image, then patched
        with slime&apos;s SGLang patches (among them deterministic inference and weight pull)
      </>
    ),
    src: (
      <>
        <Cite tier={1} href={`${SLIME}/docker/Dockerfile#L1-L6`}>
          slime Dockerfile L1-L6
        </Cite>{' '}
        <Cite tier={1} href={`${SLIME}/docker/Dockerfile#L141-L158`}>
          L141-L158
        </Cite>
      </>
    ),
  },
  {
    id: 'areal',
    who: 'AReaL v2.1.0, 2026-08-25',
    kind: 'RL framework',
    sglang: <>0.5.10.post1</>,
    how: (
      <>
        Extra <code>sglang[tracing]==0.5.10.post1</code>, the default rollout backend; vLLM sits in a
        separate dependency file because the two pin incompatible torch versions
      </>
    ),
    src: (
      <>
        <Cite tier={1} href={AREAL}>
          AReaL pyproject.toml L145-L149
        </Cite>{' '}
        <Cite tier={1} href={AREAL_README}>
          AReaL README L143
        </Cite>
      </>
    ),
  },
  {
    id: 'verl',
    who: 'verl v0.9.1, 2026-09-20',
    kind: 'RL framework',
    sglang: <>0.5.8</>,
    how: (
      <>
        Extra <code>sglang[srt,openai]==0.5.8</code>; <code>sglang</code> is one of three rollout
        engines selected by name, beside <code>vllm</code> and <code>trtllm</code>
      </>
    ),
    src: (
      <>
        <Cite tier={1} href={`${VERL}/setup.py#L55-L59`}>
          verl setup.py L55-L59
        </Cite>{' '}
        <Cite tier={1} href={`${VERL}/verl/workers/rollout/base.py#L89-L92`}>
          verl rollout/base.py L89-L92
        </Cite>
      </>
    ),
  },
  {
    id: 'roll',
    who: 'ROLL v0.4.0 (Alibaba)',
    kind: 'RL framework',
    sglang: <>0.5.2</>,
    how: (
      <>
        Requirements file pins <code>sglang[srt,torch-memory-saver]==0.5.2</code>
      </>
    ),
    src: (
      <Cite tier={1} href={ROLL}>
        ROLL requirements_torch280_sglang.txt L10
      </Cite>
    ),
  },
  {
    id: 'tunix',
    who: 'Tunix v0.1.7 (Google), 2026-06-11',
    kind: 'RL framework',
    sglang: <>None: SGL-JAX</>,
    how: <>Rolls out through SGL-JAX, the TPU engine; the PyTorch <code>sglang</code> package is not used</>,
    src: (
      <>
        <Cite tier={1} href={TUNIX}>
          tunix sglang_jax_rollout.py L28-L41
        </Cite>{' '}
        <Cite tier={1} href={TUNIX_SAMPLER}>
          sglang_jax_sampler.py L28
        </Cite>
      </>
    ),
  },
  {
    id: 'dlc-ubuntu',
    who: 'AWS SGLang DLC, Ubuntu line',
    kind: 'Vendor container',
    sglang: (
      <>
        <strong>0.5.22</strong>
      </>
    ),
    how: (
      <>
        Built <code>FROM lmsysorg/sglang:v0.5.22</code> plus the EFA (Elastic Fabric Adapter)
        installer and the SageMaker entrypoint; first v0.5.22 tag pushed 2026-10-20
      </>
    ),
    src: (
      <>
        <Cite tier={1} href={DLC_UBUNTU}>
          DLC Dockerfile L1-L6
        </Cite>{' '}
        <Cite tier={1} href={ECR_GALLERY}>
          ECR Public Gallery: deep-learning-containers/sglang
        </Cite>
      </>
    ),
  },
  {
    id: 'dlc-al2023',
    who: 'AWS SGLang DLC, AL2023 server line, v1.4',
    kind: 'Vendor container',
    sglang: <>0.5.19</>,
    how: <>Built from source at the v0.5.19 commit, with DeepEP over EFA</>,
    src: (
      <Cite tier={1} href={DLC_CHANGELOG}>
        DLC changelog L7-L22
      </Cite>
    ),
  },
  {
    id: 'nvidia',
    who: 'NVIDIA SGLang container 26.09',
    kind: 'Vendor container',
    sglang: <>0.5.19</>,
    how: <>NVIDIA&apos;s own build of the stack, with CUDA 13.4.1</>,
    src: (
      <Cite tier={1} href={NVIDIA_2609}>
        NVIDIA: SGLang Release 26.09
      </Cite>
    ),
  },
  {
    id: 'amd',
    who: 'AMD ROCm guide image',
    kind: 'Vendor container',
    sglang: <>0.5.15.post1</>,
    how: (
      <>
        AMD&apos;s guide pulls <code>rocm/sgl-dev:v0.5.15.post1-...</code>; upstream publishes{' '}
        <code>v0.5.22-rocm10-mi30x</code> and <code>-mi35x</code>
      </>
    ),
    src: (
      <>
        <Cite tier={1} href={AMD_ROCM}>
          AMD ROCm docs: SGLang (unversioned)
        </Cite>{' '}
        <Cite tier={1} href={DOCKER_TAGS}>
          Docker Hub: lmsysorg/sglang v0.5.22 tags
        </Cite>
      </>
    ),
  },
];

/* ------------------------------------------------------------------------ */
/* Section                                                                   */
/* ------------------------------------------------------------------------ */

export function EcosystemUsers() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Weigh an SGLang adoption claim by who made it, and check which SGLang version your framework or container really runs before relying on a v0.5.22 behaviour (verified against SGLang v0.5.22, commit baa9befa, 2026-10-24)"
          >
            24. Ecosystem and Production Users
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            SGLang reaches most teams through something else: an RL (reinforcement learning)
            framework that drives it for rollouts, a vendor container, a managed platform, or a
            logo on a slide. Two challenges follow for a team weighing it. One is judging how much
            an adoption claim proves. The other is knowing which SGLang a given framework or image
            actually runs, because most of them freeze an older release than the one this dive
            describes.
          </Box>
          <Box variant="p">
            <strong>
              The clearest production statement located during this research is LinkedIn&apos;s:
              it ranks with SGLang, and multi-item scoring cut the latency of one request ranking 50
              items for a member by 69%, LinkedIn&apos;s own measurement against single-item
              scoring with prefix caching
            </strong>{' '}
            <Cite tier={2} href={LINKEDIN_RANKING}>
              LinkedIn Engineering, 2025-12-09
            </Cite>
            . This section maps the project and its family, grades the adoption evidence by what
            each source can know, and ends with the version check to run before relying on a
            v0.5.22 behaviour.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Know which install carries a feature, and which version pin it needs, before an announcement for SGLang sends you to the wrong package"
          >
            One package, a family of projects, and who holds them
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The <code>sglang</code> package carries two engines: the LLM (large language model)
            runtime under <code>python/sglang/srt</code>, and SGLang Diffusion, the image and video
            generation engine under <code>python/sglang/multimodal_gen</code>{' '}
            <Cite tier={1} href={sglangUrl(README, 'L21')}>
              README.md L21
            </Cite>{' '}
            <Cite tier={1} href={sglangTreeUrl('python/sglang/multimodal_gen')}>
              multimodal_gen/
            </Cite>
            . It is licensed Apache-2.0{' '}
            <Cite tier={1} href={sglangUrl('LICENSE', 'L1-L2')}>
              LICENSE L1-L2
            </Cite>
            . The README&apos;s ecosystem table groups the companion projects into six areas:
            diffusion, audio, speculative decoding, RL and post-training, deployment and
            orchestration, and education{' '}
            <Cite tier={1} href={sglangUrl(README, 'L62-L71')}>
              README.md L62-L71
            </Cite>
            . LMSYS (Large Model Systems Organization) hosts the project{' '}
            <Cite tier={1} href={sglangUrl(README, 'L97')}>
              README.md L97
            </Cite>
            .
          </Box>
          <Box variant="p">
            Around the package sit separately released projects, two of them for Google TPUs
            (Tensor Processing Units), and further out the third-party code that installs a
            pinned SGLang: RL frameworks and vendor containers. The map shows each piece with the
            SGLang release it runs.
          </Box>
          <EcosystemMapDiagram />
          <Box variant="small" color="text-body-secondary">
            Versions as read on 2026-10-24, each cited below the map or in the table that closes
            this section. Teal boxes ship from their own sgl-project repositories; purple rows are
            third-party code with the SGLang it installs.
          </Box>
          <Box variant="p">
            Most of the family ships from its own repository on its own release train, so a feature
            announced for &quot;SGLang&quot; can need a second package and a second pin:
          </Box>
          <ul>
            <li>
              SGLang Omni v0.1.9 serves speech and omni models and pins{' '}
              <code>sglang==0.5.22</code> on Linux, so its releases follow SGLang&apos;s{' '}
              <Cite tier={1} href={OMNI}>
                sglang-omni pyproject.toml L6-L37
              </Cite>
              .
            </li>
            <li>
              SpecForge trains the draft models that SGLang&apos;s speculative decoding loads
              (section 11, Speculative Decoding). It is MIT-licensed and publishes no tagged
              releases, so pin a commit{' '}
              <Cite tier={1} href={SPECFORGE}>
                SpecForge README (fddcb4a)
              </Cite>
              .
            </li>
            <li>
              On TPUs there are two routes, both installed apart from the GPU build. SGL-JAX is a separate engine written in JAX that reimplements SGLang&apos;s
              design; it is at tag v0.1.0rc0, and no dependency in its package file names{' '}
              <code>sglang</code>{' '}
              <Cite tier={1} href={SGL_JAX}>
                sglang-jax at v0.1.0rc0
              </Cite>
              . SGLang-TorchTPU is a plugin installed beside the package (
              <code>pip install sglang sglang-tpu</code>), first released as tpu-v0.1.0 on
              2026-10-19{' '}
              <Cite tier={1} href={TORCHTPU}>
                sglang-torchtpu README (tpu-v0.1.0)
              </Cite>
              .
            </li>
            <li>
              Mini-SGLang teaches the core ideas (radix cache, chunked prefill, overlap scheduling)
              in about 5,000 lines, by the project&apos;s own count. Its last commit is from May
              2026, so it teaches the design, not the v0.5.22 code{' '}
              <Cite tier={1} href={MINI_SGLANG}>
                mini-sglang README (9a91cfa)
              </Cite>
              .
            </li>
            <li>
              Two projects started in the sgl-project organisation and now live in their own: the
              gateway, as SMG (Shepherd Model Gateway) in <code>smg-project</code> (section 17, The
              Model Gateway), and OME (Open Model Engine), a Kubernetes operator with first-class
              SGLang support, in{' '}
              <code>ome-projects</code>{' '}
              <Cite tier={1} href={OME_README}>
                OME README L30 (v1.2.2)
              </Cite>
              . RBG (RoleBasedGroup), the Kubernetes API for multi-role deployments, stays in
              sgl-project; section 18, Multi-Node and Kubernetes Orchestrators, covers it.
            </li>
          </ul>
          <Box variant="p">
            Two organisations stand behind the code. LMSYS, the host, is a 501(c)(3) non-profit,
            incorporated in September 2024, that incubates open-source projects{' '}
            <Cite tier={2} href={LMSYS_ABOUT}>
              LMSYS: About
            </Cite>
            . RadixArk, a company whose work starts from SGLang and Miles{' '}
            <Cite tier={2} href={RADIXARK_POST}>
              RadixArk blog, 2026-05-05
            </Cite>
            , is &quot;a maintainer of the SGLang project&quot;{' '}
            <Cite tier={2} href={LMSYS_TPU_POST}>
              LMSYS blog, 2026-07-30
            </Cite>
            . For a buyer, that means a non-profit lab hosts the project and a commercial maintainer
            works beside it.
          </Box>
          <Box variant="p">
            <strong>Against vLLM:</strong> SGLang is a PyTorch ecosystem project{' '}
            <Cite tier={2} href={PYTORCH_POST}>
              PyTorch blog, by the SGLang team, 2025-03-19
            </Cite>{' '}
            hosted by LMSYS{' '}
            <Cite tier={1} href={sglangUrl(README, 'L97')}>
              README.md L97
            </Cite>
            ; vLLM is hosted by the PyTorch Foundation itself ({VLLM_GOVERNANCE_LINK}).
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Read any 'used by' statement at the strength of the party that made it, so a logo is never mistaken for a production statement"
          >
            Weigh an adoption claim by what its source can know
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            An adoption claim is worth what its source can know. A company writing about its own
            production can know what it runs and under which conditions. A vendor documenting an
            option can know what it ships to customers; its documentation says nothing about which
            of them run it. A
            project listing logos can know whom it works with, and the list carries no workload,
            date or scale. The ladder sorts every statement cited in this section by that test;
            the tier badge on each citation grades the document itself. First-party engineering
            posts are Tier 2, from the company itself, and logo walls are project claims.
          </Box>
          <EvidenceLadderDiagram />
          <Box variant="small" color="text-body-secondary">
            Classification of the sources cited in this section, by what each can know. The 69% is
            LinkedIn&apos;s own measurement, against single-item scoring with prefix caching.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="See what a production statement on SGLang looks like, and carry its conditions with it when you quote it"
          >
            The top rung: LinkedIn ranks with SGLang, Cloudflare serves its Clef model on it
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            LinkedIn runs LLM-based ranking on SGLang, behind a Python gRPC server of its own{' '}
            <Cite tier={2} href={LINKEDIN_SCALING}>
              LinkedIn Engineering, 2026-02-20
            </Cite>
            . The workload is what LinkedIn calls prefill-only ranking, &quot;using LLMs to
            understand and score content, not to write text&quot;{' '}
            <Cite tier={2} href={LINKEDIN_SCALING}>
              LinkedIn Engineering, 2026-02-20
            </Cite>
            : long inputs, and the model returns log-probabilities for a small set of scoring labels{' '}
            <Cite tier={2} href={LINKEDIN_RANKING}>
              LinkedIn Engineering, 2025-12-09
            </Cite>
            . For it, LinkedIn built SGLang&apos;s scoring API (pull request #6460) and a scoring
            path that skips decode and sampling (pull requests #8840 and #9748){' '}
            <Cite tier={2} href={LINKEDIN_SCALING}>
              LinkedIn Engineering, 2026-02-20
            </Cite>
            .
          </Box>
          <Box variant="p">
            <strong>
              On that workload, multi-item scoring cut the latency of one request ranking 50 items
              by 69%, LinkedIn&apos;s own measurement against single-item scoring with prefix
              caching
            </strong>{' '}
            <Cite tier={2} href={LINKEDIN_RANKING}>
              LinkedIn Engineering, 2025-12-09
            </Cite>
            . The figure describes scoring, where SGLang generates no text, so carry it to
            ranking-shaped traffic only. LinkedIn also initiated and contributed the work that made
            FA3 (FlashAttention 3) SGLang&apos;s default attention backend on Hopper GPUs (section
            8, Attention Backends and Kernels). It runs an internal fork of SGLang, and reports that
            upstreaming its kernel and system changes cut the work of maintaining that fork{' '}
            <Cite tier={2} href={LINKEDIN_RANKING}>
              LinkedIn Engineering, 2025-12-09
            </Cite>
            .
          </Box>
          <Box variant="p">
            In October 2026 Cloudflare reported moving the serving of Clef, one of
            &quot;Cloudflare&apos;s open-weight decision models&quot;, to SGLang, and upstreaming
            Clef support as pull request #42721, which shipped in v0.5.22{' '}
            <Cite tier={2} href={CLOUDFLARE_CLEF}>
              Cloudflare blog, 2026-10-09
            </Cite>{' '}
            <Cite tier={1} href={SGLANG_RELEASE}>
              SGLang v0.5.22 release notes
            </Cite>
            . Cloudflare also runs Infire, its own inference engine, for other models{' '}
            <Cite tier={2} href={CLOUDFLARE_INFIRE}>
              Cloudflare blog, 2026-04-16
            </Cite>
            , so the move is a per-model choice. The post&apos;s latency gains cover all of its
            serving-layer changes, with SGLang named as one of them, so they do not measure SGLang
            alone.
          </Box>
          <ExpandableSection headerText="Three more first-party statements, each with a narrower scope">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>Baseten</strong> benchmarks TensorRT-LLM, SGLang and vLLM and picks one per
                workload and hardware{' '}
                <Cite tier={2} href={BASETEN_STACK}>
                  Baseten: The Baseten Inference Stack
                </Cite>
                , and it served Qwen 3 to customers on SGLang{' '}
                <Cite tier={2} href={BASETEN_QWEN}>
                  Baseten blog, 2025-04-29
                </Cite>
                . SGLang is one engine in its portfolio.
              </Box>
              <Box variant="p">
                <strong>Novita AI</strong> serves GLM4-MoE, a MoE (mixture of experts) model family,
                on SGLang with its own optimizations, which it says are &quot;deployed and validated in
                Novita.ai&apos;s production inference service&quot;{' '}
                <Cite tier={2} href={NOVITA}>
                  Novita blog, 2026-01-21
                </Cite>
                .
              </Box>
              <Box variant="p">
                <strong>Microsoft</strong> engineers tuned SGLang kernels for DeepSeek-R1 and V3 on
                Azure AI Foundry with AMD MI300X GPUs in 2025, and wrote that some of that work was
                not yet upstream{' '}
                <Cite tier={2} href={MICROSOFT_FOUNDRY}>
                  Microsoft Foundry blog, 2025-04-24
                </Cite>
                . The post does not state which engine serves Foundry&apos;s DeepSeek endpoints
                today, so it sits between the top two rungs.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Use a vendor listing to find a supported image, and treat a logo as a lead to check against the company's own statement"
          >
            Vendor options and project claims: what each one tells you
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The middle rung is the widest. Cloud platforms document SGLang as an engine their
            customers can choose. AWS builds SGLang DLCs (Deep Learning Containers), one line from
            the upstream image{' '}
            <Cite tier={1} href={DLC_UBUNTU}>
              DLC Dockerfile L1-L6
            </Cite>
            , and SageMaker&apos;s OpenAI-compatible invoke path lists the SGLang DLC as supported{' '}
            <Cite tier={1} href={SAGEMAKER_OPENAI}>
              SageMaker docs: OpenAI-compatible endpoints
            </Cite>
            ; sections 19 to 21 cover those paths. Google Cloud lists SGLang among the serving
            frameworks for open models on its managed platform{' '}
            <Cite tier={1} href={GCP_OPEN_MODELS}>
              Google Cloud docs: open models overview
            </Cite>{' '}
            and names SGLang-TorchTPU and SGLang-JAX, the two TPU routes above, for TPU serving{' '}
            <Cite tier={1} href={GCP_TPU}>
              Google Cloud docs: PyTorch on Cloud TPU
            </Cite>
            . OCI (Oracle Cloud Infrastructure) Generative AI deploys imported models through OME,
            which pairs each model with vLLM or SGLang; the docs publish no split between the two{' '}
            <Cite tier={1} href={OCI_IMPORT}>
              OCI docs: Compatible Models for Import
            </Cite>
            . Alibaba Cloud&apos;s PAI (Platform for AI) EAS (Elastic Algorithm Service) lets a
            customer pick vLLM, SGLang or PAI&apos;s own BladeLLM for an LLM endpoint{' '}
            <Cite tier={1} href={ALIBABA_PAI}>
              Alibaba Cloud docs: Deploy LLMs on PAI-EAS
            </Cite>
            .
          </Box>
          <Box variant="p">
            These statements tell you that an image or a managed path exists and is supported.
            They are product statements: none of them says which engine serves the vendor&apos;s own
            products. A vendor image is also a validated stack at the vendor&apos;s pace, so check
            its SGLang release in the table at the end of this section.
          </Box>
          <ExpandableSection headerText="Hardware vendors: NVIDIA, AMD, Intel and Huawei">
            <SpaceBetween size="s">
              <Box variant="p">
                NVIDIA ships its own SGLang container, and describes release 25.10 as &quot;the
                first NVIDIA SGLang container release that brings optimizations for NVIDIA
                GPUs&quot;{' '}
                <Cite tier={1} href={NVIDIA_2510}>
                  NVIDIA: SGLang Release 25.10
                </Cite>
                . Its 26.09 container carries SGLang 0.5.19{' '}
                <Cite tier={1} href={NVIDIA_2609}>
                  NVIDIA: SGLang Release 26.09
                </Cite>
                . NVIDIA Dynamo runs SGLang as one of its engine backends; section 18 gives the
                release it installs.
              </Box>
              <Box variant="p">
                AMD documents SGLang for Instinct MI300 to MI355X GPUs and for Radeon RX 7000 and 9000
                series, Radeon PRO and Radeon AI PRO cards
                and publishes its own <code>rocm/sgl-dev</code> images; its guide&apos;s image is
                v0.5.15.post1, while SGLang publishes its own per-generation ROCm (AMD&apos;s GPU
                software stack) images such as <code>v0.5.22-rocm10-mi30x</code> and{' '}
                <code>-mi35x</code>{' '}
                <Cite tier={1} href={AMD_ROCM}>
                  AMD ROCm docs: SGLang (unversioned)
                </Cite>{' '}
                <Cite tier={1} href={DOCKER_TAGS}>
                  Docker Hub: lmsysorg/sglang v0.5.22 tags
                </Cite>
                .
              </Box>
              <Box variant="p">
                Intel works with the project on Xeon CPU serving{' '}
                <Cite tier={2} href={INTEL_ARTICLE}>
                  Intel developer article, 2025-04-22
                </Cite>
                , and upstream publishes <code>-xeon</code> and <code>-xpu</code> images for
                v0.5.22{' '}
                <Cite tier={1} href={DOCKER_TAGS}>
                  Docker Hub: lmsysorg/sglang v0.5.22 tags
                </Cite>
                . Huawei lists SGLang beside vLLM as a recommended text-generation engine on
                Ascend, labelled third-party{' '}
                <Cite tier={2} href={ASCEND}>
                  Huawei Ascend: Model Inference
                </Cite>
                .
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <Box variant="p">
            The bottom rung is the project&apos;s own. The README&apos;s &quot;Trusted by Industry
            and Research&quot; block says &quot;SGLang serves production workloads across AI labs,
            cloud platforms, enterprises, and universities&quot; above a logo image{' '}
            <Cite tier={2} href={sglangUrl(README, 'L106-L110')}>
              README.md L106-L110 (project claim)
            </Cite>
            . The image loads from a moving branch of another repository, so it can change without
            an SGLang release, and it names no workload, date or scale for any logo{' '}
            <Cite tier={2} href={ADOPTION_PNG}>
              adoption.png at 3fdcfab (project claim)
            </Cite>
            . The sglang.io home page shows a logo strip with no caption{' '}
            <Cite tier={2} href={SGLANG_IO}>
              sglang.io (unversioned)
            </Cite>
            .
          </Box>
          <Box variant="p">
            Scale figures come from the project and its commercial maintainer. LMSYS writes that
            SGLang &quot;runs on hundreds of thousands of GPUs worldwide and generates trillions of
            tokens in production every day&quot;{' '}
            <Cite tier={2} href={LMSYS_TPU_POST}>
              LMSYS blog, 2026-07-30 (project claim)
            </Cite>
            , and RadixArk that it &quot;powers trillions of tokens daily&quot;{' '}
            <Cite tier={2} href={RADIXARK_POST}>
              RadixArk blog, 2026-05-05 (maintainer claim)
            </Cite>
            . Neither gives a method or a date range. The &quot;over 400,000 GPUs&quot; figure
            comes from the README up to v0.5.21{' '}
            <Cite tier={2} href={README_V0521}>
              README.md L72-L88 at v0.5.21 (project claim)
            </Cite>
            , and the v0.5.22 README does not carry it{' '}
            <Cite tier={1} href={sglangUrl(README, 'L106-L110')}>
              README.md L106-L110
            </Cite>
            .
          </Box>
          <Box variant="p">
            One statement sits off the ladder. DeepSeek&apos;s V3 repository titles a section
            &quot;Inference with SGLang (recommended)&quot;{' '}
            <Cite tier={1} href={DEEPSEEK_V3}>
              DeepSeek-V3 README L305-L311
            </Cite>
            , while DeepSeek wrote in April 2025 that its own inference engine &quot;is based on an
            early fork of vLLM&quot;{' '}
            <Cite tier={1} href={DEEPSEEK_ENGINE}>
              open-infra-index README L12-L20
            </Cite>
            . Recommending an engine for open weights and running it in production are separate
            claims. Before you quote a logo or a recommendation as a user, look for the
            company&apos;s own statement of what it runs.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Find the SGLang release under your RL framework or vendor image before you rely on a v0.5.22 behaviour, because most of them freeze an older one"
          >
            Check which SGLang your framework or container runs
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            SGLang&apos;s docs list nine post-training integrations and call SGLang &quot;the de
            facto inference backend for modern LLM training frameworks&quot;, a project claim{' '}
            <Cite tier={2} href={sglangDocsSrcUrl('references/post_training_integration', 'L6-L29')}>
              SGLang docs: Post-Training Integration (v0.5.22 source, project claim)
            </Cite>
            . Each RL framework and vendor image freezes the SGLang it installs, and SGLang moves
            fast: its ten releases from v0.5.13 to v0.5.22, not counting a post release, came 13 to
            17 days apart{' '}
            <Cite tier={1} href={SGLANG_RELEASES}>
              SGLang releases
            </Cite>
            . Of the RL frameworks, only Miles tracks v0.5.22{' '}
            <Cite tier={1} href={`${MILES}/docker/Dockerfile#L13-L19`}>
              miles Dockerfile L13-L19
            </Cite>
            ; verl pins 0.5.8{' '}
            <Cite tier={1} href={`${VERL}/setup.py#L55-L59`}>
              verl setup.py L55-L59
            </Cite>{' '}
            and AReaL 0.5.10.post1{' '}
            <Cite tier={1} href={AREAL}>
              AReaL pyproject.toml L145-L149
            </Cite>
            . Of the vendor images, the AWS Ubuntu DLC pushed its first v0.5.22 image the day after
            SGLang&apos;s GitHub release{' '}
            <Cite tier={1} href={ECR_GALLERY}>
              ECR Public Gallery: deep-learning-containers/sglang
            </Cite>{' '}
            <Cite tier={1} href={SGLANG_RELEASE}>
              SGLang v0.5.22 release notes
            </Cite>
            , while NVIDIA&apos;s 26.09 container{' '}
            <Cite tier={1} href={NVIDIA_2609}>
              NVIDIA: SGLang Release 26.09
            </Cite>{' '}
            and the AWS AL2023 (Amazon Linux 2023) line{' '}
            <Cite tier={1} href={DLC_CHANGELOG}>
              DLC changelog L7-L22
            </Cite>{' '}
            carry 0.5.19. Section 18, Multi-Node and Kubernetes Orchestrators, runs the same check
            for the orchestrators.
          </Box>
          <Table
            variant="embedded"
            wrapLines
            trackBy="id"
            header={<Header variant="h3">SGLang by RL framework and vendor container, as of 2026-10-24</Header>}
            items={PIN_ROWS}
            columnDefinitions={[
              { id: 'who', header: 'Framework or image (release read)', cell: (r) => r.who, minWidth: 180 },
              { id: 'kind', header: 'Kind', cell: (r) => r.kind, minWidth: 110 },
              { id: 'sglang', header: 'SGLang it runs', cell: (r) => r.sglang, minWidth: 130 },
              { id: 'how', header: 'How it gets there', cell: (r) => r.how, minWidth: 260 },
              { id: 'src', header: 'Source', cell: (r) => r.src, minWidth: 170 },
            ]}
          />
          <Box variant="p">
            Miles is the case where a version number is not enough. Its image starts from{' '}
            <code>lmsysorg/sglang:v0.5.22</code> and then installs SGLang from the{' '}
            <code>sglang-miles</code> branch, so the code that runs is that branch&apos;s{' '}
            <Cite tier={1} href={`${MILES}/docker/Dockerfile#L13-L19`}>
              miles Dockerfile L13-L19
            </Cite>{' '}
            <Cite tier={1} href={`${MILES}/docker/Dockerfile#L213-L226`}>
              L213-L226
            </Cite>
            . A team that runs RL rollouts on one of these frameworks and serves production traffic
            on current SGLang should plan for two SGLang versions in its estate, with different
            flags and defaults. The pin also freezes security fixes: v0.5.22 is the first release
            carrying the upload-filename and diffusion-scheduler hardening in its release
            notes&apos; Security list{' '}
            <Cite tier={1} href={SGLANG_RELEASE}>
              SGLang v0.5.22 release notes
            </Cite>
            , which section 25, Operations and Failure Signatures, covers.
          </Box>
          <Box variant="p">
            <strong>
              Before relying on a v0.5.22 behaviour, read the version inside the image your
              framework or vendor runs.
            </strong>{' '}
            <code>{'python -c "import sglang; print(sglang.__version__)"'}</code> prints the
            installed package&apos;s version{' '}
            <Cite tier={1} href={sglangUrl('python/sglang/version.py', 'L1-L8')}>
              version.py L1-L8
            </Cite>
            , and a running server reports it in the <code>version</code> field of{' '}
            <code>/server_info</code>{' '}
            <Cite tier={1} href={sglangUrl('python/sglang/srt/entrypoints/http_server.py', 'L847-L874')}>
              http_server.py L847-L874
            </Cite>
            , a route to query from the operator side only (section 12, Talking to SGLang). Where
            the answer is older than v0.5.22, read that release&apos;s notes before trusting a
            default from this dive, and see section 13, SGLang as an RL Rollout Engine, for the
            refit calls a framework drives.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
