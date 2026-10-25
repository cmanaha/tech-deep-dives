import type { ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Table from '@cloudscape-design/components/table';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';
import { Cite, sglangUrl, sglangDocsSrcUrl } from '../components/Cite';

const SRT = 'python/sglang/srt';
const MOB = `${SRT}/arg_groups/model_override_base.py`;
const OVR = `${SRT}/arg_groups/overrides.py`;
const COMMON = `${SRT}/utils/common.py`;
const SPEC_HOOK = `${SRT}/arg_groups/speculative_hook.py`;
const RADIX = `${SRT}/mem_cache/radix_cache.py`;
const MEMORY_HOOK = `${SRT}/arg_groups/memory_hook.py`;
const DEEPSEEK_OVR = `${SRT}/arg_groups/model_overrides/deepseek_v2.py`;
const QUANT = `${SRT}/layers/quantization`;
const LOADER = `${SRT}/model_loader/loader.py`;
const AB_DOC = 'advanced_features/attention_backend';

const EC2_SPECS = 'https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html';
const NVIDIA_CC = 'https://developer.nvidia.com/cuda/gpus';
const CUDA_NOTES = 'https://docs.nvidia.com/cuda/cuda-toolkit-release-notes/index.html';
const ECR_GALLERY = 'https://gallery.ecr.aws/deep-learning-containers/sglang';
const GB300_GA =
  'https://aws.amazon.com/about-aws/whats-new/2025/12/amazon-ec2-p6e-gb300-ultraservers-nvidia-gb300-nvl72-generally-available/';
const GIN_DOC = 'https://github.com/aws/aws-ofi-nccl/blob/v1.22.0/doc/gin-getting-started.md';
const MOONCAKE_EFA_PYPI = 'https://pypi.org/project/mooncake-transfer-engine-efa-cuda13/0.3.13.post1/';
const VLLM_CACHE = 'https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/config/cache.py#L333-L334';
const VLLM_CUDA = 'https://github.com/vllm-project/vllm/blob/v0.31.0/vllm/platforms/cuda.py#L154-L179';

const DLC_SHA = '23970abd5b8919ea3e1add74692a0d056b2fcbd9';
function dlcUrl(path: string, lines?: string): string {
  const base = `https://github.com/aws/deep-learning-containers/blob/${DLC_SHA}/${path}`;
  return lines ? `${base}#${lines}` : base;
}
const DLC_UBUNTU = 'docker/sglang/Dockerfile';
const DLC_AL2023 = 'docker/sglang/Dockerfile.amzn2023';
const DLC_UBUNTU_CFG = '.github/config/image/sglang/sagemaker-ubuntu.yml';
const DLC_AL2023_CFG = '.github/config/image/sglang/sagemaker-amzn2023.yml';
const DLC_CHANGELOG = 'docs/sglang/changelog/index.md';

const VLLM_AWS_LINK = (
  <Link href="../vllm/">vLLM dive, section 22: vLLM on AWS GPUs, EFA &amp; NIXL</Link>
);

/* ------------------------------------------------------------------------ */
/* Diagram: the instance map, family to compute capability to defaults       */
/* ------------------------------------------------------------------------ */

type Band = 'generic' | 'hopper' | 'dcbw' | 'sm120';

interface MapRow {
  family: string;
  gpu: string;
  cc: string;
  mem: string;
  net: string;
  backend: string;
  page: string;
  band: Band;
}

const MAP_ROWS: MapRow[] = [
  { family: 'P4d', gpu: '8 x A100 40 GB', cc: 'SM80', mem: '40', net: '4 x 100', backend: 'flashinfer', page: '1', band: 'generic' },
  { family: 'P4de', gpu: '8 x A100 80 GB', cc: 'SM80', mem: '80', net: '4 x 100', backend: 'flashinfer', page: '1', band: 'generic' },
  { family: 'G5', gpu: '8 x A10G', cc: 'SM86 *', mem: '22', net: '100', backend: 'flashinfer', page: '1', band: 'generic' },
  { family: 'G6', gpu: '8 x L4', cc: 'SM89', mem: '22', net: '100', backend: 'flashinfer', page: '1', band: 'generic' },
  { family: 'G6e', gpu: '8 x L40S', cc: 'SM89', mem: '44', net: '400', backend: 'flashinfer', page: '1', band: 'generic' },
  { family: 'P5', gpu: '8 x H100', cc: 'SM90', mem: '80', net: '3,200', backend: 'fa3', page: '1', band: 'hopper' },
  { family: 'P5e', gpu: '8 x H200', cc: 'SM90', mem: '141', net: '3,200', backend: 'fa3', page: '1', band: 'hopper' },
  { family: 'P5en', gpu: '8 x H200', cc: 'SM90', mem: '141', net: '3,200', backend: 'fa3', page: '1', band: 'hopper' },
  { family: 'P6-B200', gpu: '8 x B200', cc: 'SM100', mem: '179', net: '3,200', backend: 'trtllm_mha', page: '64', band: 'dcbw' },
  { family: 'P6e-GB200', gpu: '4 x B200, Grace host', cc: 'SM100', mem: '185', net: '3,200', backend: 'trtllm_mha', page: '64', band: 'dcbw' },
  { family: 'P6-B300', gpu: '8 x B300', cc: 'SM103', mem: '268', net: '6,400', backend: 'trtllm_mha', page: '64', band: 'dcbw' },
  { family: 'P6e-GB300', gpu: 'GB300, Grace host', cc: 'SM103', mem: '', net: '', backend: 'trtllm_mha', page: '64', band: 'dcbw' },
  { family: 'G7', gpu: '8 x RTX PRO 4500', cc: 'SM120', mem: '32', net: '700', backend: 'flashinfer', page: '1', band: 'sm120' },
  { family: 'G7e', gpu: '8 x RTX PRO 6000', cc: 'SM120', mem: '96', net: '1,600', backend: 'flashinfer', page: '1', band: 'sm120' },
];

const MAP_COLS = { family: 28, gpu: 136, cc: 312, mem: 418, net: 516, backend: 626, page: 792 };
const MAP_TOP = 64;
const MAP_ROW_H = 26;
const MAP_BAND_GAP = 6;

function rowY(i: number): number {
  let gaps = 0;
  for (let k = 1; k <= i; k += 1) {
    if (MAP_ROWS[k].band !== MAP_ROWS[k - 1].band) gaps += 1;
  }
  return MAP_TOP + i * MAP_ROW_H + gaps * MAP_BAND_GAP;
}

function bandExtent(band: Band): { y: number; h: number } {
  const idx = MAP_ROWS.map((r, i) => (r.band === band ? i : -1)).filter((i) => i >= 0);
  const y = rowY(idx[0]);
  const h = rowY(idx[idx.length - 1]) + MAP_ROW_H - y;
  return { y, h };
}

const BANDS: Band[] = ['generic', 'hopper', 'dcbw', 'sm120'];

function InstanceMapDiagram() {
  const lastY = rowY(MAP_ROWS.length - 1) + MAP_ROW_H;
  const legendY = lastY + 26;
  const footY = legendY + 44;
  const height = footY + 18;
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox={`0 0 900 ${height}`}
        role="img"
        aria-labelledby="ec2-map-title"
        style={{ width: '100%', minWidth: 720, height: 'auto' }}
      >
        <title id="ec2-map-title">
          The EC2 family name stands in for a compute capability, and the capability sets
          SGLang&apos;s defaults. For a dense Llama-style model with no attention flag, and
          speculative decoding off or at an explicit topk of 1: P4d, P4de, G5, G6 and G6e (SM80 to
          SM89) get flashinfer with 1-token pages; P5, P5e and P5en (SM90, Hopper) get fa3 with
          1-token pages; P6-B200, P6e-GB200, P6-B300 and P6e-GB300 (SM100 and SM103, datacenter
          Blackwell) get trtllm_mha with 64-token pages; G7 and G7e (SM120) carry Blackwell GPUs
          and still fall back to flashinfer with 1-token pages. Each row also gives the GPUs,
          memory per GPU and network bandwidth of the family&apos;s largest size; P6e-GB300 specs
          were not in the EC2 spec tables on 2026-10-24.
        </title>
        <style>{`
          .ec2-map-generic { fill: #ffffff; stroke: #879596; stroke-width: 1.2; }
          .ec2-map-hopper { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.2; }
          .ec2-map-dcbw { fill: #efe7fb; stroke: #6f4cc4; stroke-width: 1.2; }
          .ec2-map-sm120 { fill: #fbf3d5; stroke: #8b6c00; stroke-width: 1.2; }
          .ec2-map-h { fill: #414d5c; font: 600 11px sans-serif; text-anchor: start; }
          .ec2-map-fam { fill: #16191f; font: 600 13px sans-serif; text-anchor: start; }
          .ec2-map-c { fill: #16191f; font: 12px sans-serif; text-anchor: start; }
          .ec2-map-be { fill: #16191f; font: 600 12px sans-serif; text-anchor: start; }
          .ec2-map-pg64 { fill: #16191f; font: 700 12px sans-serif; text-anchor: start; }
          .ec2-map-na { fill: #5f6b7a; font: italic 11px sans-serif; text-anchor: start; }
          .ec2-map-lg { fill: #16191f; font: 11px sans-serif; text-anchor: start; }
          .ec2-map-ft { fill: #5f6b7a; font: 11px sans-serif; text-anchor: start; }
          .ec2-map-rule { stroke: #d1d5db; stroke-width: 1; }
        `}</style>

        <rect x={0} y={0} width={900} height={height} rx={8} fill="#ffffff" />

        {/* Column headers */}
        <text x={MAP_COLS.family} y={30} className="ec2-map-h">EC2 family</text>
        <text x={MAP_COLS.family} y={46} className="ec2-map-h">(largest size)</text>
        <text x={MAP_COLS.gpu} y={30} className="ec2-map-h">GPUs</text>
        <text x={MAP_COLS.cc} y={30} className="ec2-map-h">Compute</text>
        <text x={MAP_COLS.cc} y={46} className="ec2-map-h">capability</text>
        <text x={MAP_COLS.mem} y={30} className="ec2-map-h">Memory per</text>
        <text x={MAP_COLS.mem} y={46} className="ec2-map-h">GPU (GiB)</text>
        <text x={MAP_COLS.net} y={30} className="ec2-map-h">Network</text>
        <text x={MAP_COLS.net} y={46} className="ec2-map-h">(Gbps)</text>
        <text x={MAP_COLS.backend} y={30} className="ec2-map-h">Default attention</text>
        <text x={MAP_COLS.backend} y={46} className="ec2-map-h">backend</text>
        <text x={MAP_COLS.page} y={30} className="ec2-map-h">KV page</text>
        <text x={MAP_COLS.page} y={46} className="ec2-map-h">(tokens)</text>
        <line x1={16} y1={55} x2={884} y2={55} className="ec2-map-rule" />

        {/* Bands, one per default chain */}
        {BANDS.map((b) => {
          const e = bandExtent(b);
          return <rect key={b} x={16} y={e.y} width={868} height={e.h} rx={5} className={`ec2-map-${b}`} />;
        })}

        {/* Rows */}
        {MAP_ROWS.map((r, i) => {
          const base = rowY(i) + 17;
          const sameBandAbove = i > 0 && MAP_ROWS[i - 1].band === r.band;
          return (
            <g key={r.family}>
              {sameBandAbove && (
                <line x1={24} y1={rowY(i)} x2={876} y2={rowY(i)} className="ec2-map-rule" />
              )}
              <text x={MAP_COLS.family} y={base} className="ec2-map-fam">{r.family}</text>
              <text x={MAP_COLS.gpu} y={base} className="ec2-map-c">{r.gpu}</text>
              <text x={MAP_COLS.cc} y={base} className="ec2-map-c">{r.cc}</text>
              {r.mem === '' ? (
                <text x={MAP_COLS.mem} y={base} className="ec2-map-na">specs not in EC2 tables</text>
              ) : (
                <>
                  <text x={MAP_COLS.mem} y={base} className="ec2-map-c">{r.mem}</text>
                  <text x={MAP_COLS.net} y={base} className="ec2-map-c">{r.net}</text>
                </>
              )}
              <text x={MAP_COLS.backend} y={base} className="ec2-map-be">{r.backend}</text>
              <text x={MAP_COLS.page} y={base} className={r.page === '64' ? 'ec2-map-pg64' : 'ec2-map-c'}>
                {r.page}
              </text>
            </g>
          );
        })}

        {/* Legend */}
        <rect x={28} y={legendY - 11} width={14} height={14} rx={2} className="ec2-map-generic" />
        <text x={50} y={legendY} className="ec2-map-lg">SM80 to SM89: generic chain</text>
        <rect x={250} y={legendY - 11} width={14} height={14} rx={2} className="ec2-map-hopper" />
        <text x={272} y={legendY} className="ec2-map-lg">SM90, Hopper: fa3</text>
        <rect x={420} y={legendY - 11} width={14} height={14} rx={2} className="ec2-map-dcbw" />
        <text x={442} y={legendY} className="ec2-map-lg">SM100 and SM103, datacenter Blackwell: trtllm_mha</text>
        <rect x={28} y={legendY + 9} width={14} height={14} rx={2} className="ec2-map-sm120" />
        <text x={50} y={legendY + 20} className="ec2-map-lg">
          SM120: Blackwell GPUs that take the generic chain, with none of the Blackwell defaults
        </text>
        <text x={28} y={footY} className="ec2-map-ft">
          * G5: SM86 by equivalence with the A10, our reading; NVIDIA&apos;s table lists no A10G.
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Table: the specs behind the map, from the EC2 spec tables                 */
/* ------------------------------------------------------------------------ */

interface SpecRow {
  id: string;
  size: string;
  gpus: string;
  perGpu: string;
  total: string;
  net: string;
  cpu: string;
}

const SPEC_ROWS: SpecRow[] = [
  { id: 'p4d', size: 'p4d.24xlarge', gpus: '8 x NVIDIA A100', perGpu: '40', total: '320', net: '4x 100', cpu: 'Intel Xeon Platinum 8275CL' },
  { id: 'p4de', size: 'p4de.24xlarge', gpus: '8 x NVIDIA A100', perGpu: '80', total: '640', net: '4x 100', cpu: 'Intel Xeon Platinum 8275CL' },
  { id: 'g5', size: 'g5.48xlarge', gpus: '8 x NVIDIA A10G', perGpu: '22', total: '178', net: '100', cpu: '2nd Gen AMD EPYC 7R32' },
  { id: 'g6', size: 'g6.48xlarge', gpus: '8 x NVIDIA L4', perGpu: '22', total: '178', net: '100', cpu: 'AMD EPYC 7R13' },
  { id: 'g6e', size: 'g6e.48xlarge', gpus: '8 x NVIDIA L40S', perGpu: '44', total: '357', net: '400', cpu: 'AMD EPYC 7R13' },
  { id: 'p5-4', size: 'p5.4xlarge', gpus: '1 x NVIDIA H100', perGpu: '80', total: '80', net: '100', cpu: 'AMD EPYC 7R13' },
  { id: 'p5', size: 'p5.48xlarge', gpus: '8 x NVIDIA H100', perGpu: '80', total: '640', net: '3200', cpu: 'AMD EPYC 7R13' },
  { id: 'p5e', size: 'p5e.48xlarge', gpus: '8 x NVIDIA H200', perGpu: '141', total: '1128', net: '3200', cpu: 'AMD EPYC 7R13' },
  { id: 'p5en', size: 'p5en.48xlarge', gpus: '8 x NVIDIA H200', perGpu: '141', total: '1128', net: '3200', cpu: 'Intel Xeon Sapphire Rapids' },
  { id: 'p6b200', size: 'p6-b200.48xlarge', gpus: '8 x NVIDIA B200', perGpu: '179', total: '1432', net: '3200', cpu: 'Intel Xeon Emerald Rapids' },
  { id: 'p6egb200', size: 'p6e-gb200.36xlarge', gpus: '4 x NVIDIA B200', perGpu: '185', total: '740', net: '3200', cpu: 'Nvidia Grace CPU' },
  { id: 'p6b300', size: 'p6-b300.48xlarge', gpus: '8 x NVIDIA B300', perGpu: '268', total: '2148', net: '6400', cpu: 'Intel Xeon Emerald Rapids' },
  { id: 'g7', size: 'g7.48xlarge', gpus: '8 x NVIDIA RTX PRO 4500', perGpu: '32', total: '256', net: '700', cpu: 'Intel Xeon Granite Rapids' },
  { id: 'g7e', size: 'g7e.48xlarge', gpus: '8 x NVIDIA RTX PRO Server 6000', perGpu: '96', total: '768', net: '1600', cpu: 'Intel Xeon Emerald Rapids' },
];

/* ------------------------------------------------------------------------ */
/* Table: the three images and what each one carries                         */
/* ------------------------------------------------------------------------ */

interface ImageRow {
  id: string;
  image: ReactNode;
  sglang: ReactNode;
  arch: ReactNode;
  carries: ReactNode;
  pick: ReactNode;
}

const IMAGE_ROWS: ImageRow[] = [
  {
    id: 'upstream',
    image: (
      <>
        Upstream <code>lmsysorg/sglang:v0.5.22</code>
      </>
    ),
    sglang: 'v0.5.22',
    arch: (
      <>
        amd64 and arm64{' '}
        <Cite tier={1} href={sglangUrl('.github/workflows/_docker-build-and-publish.yml', 'L117')}>
          _docker-build-and-publish.yml L117
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl('.github/workflows/_docker-build-and-publish.yml', 'L196')}>
          L196
        </Cite>
      </>
    ),
    carries: (
      <>
        CUDA 13.0 only; the release workflow publishes no CUDA 12 tag{' '}
        <Cite tier={1} href={sglangUrl('.github/workflows/release-docker.yml', 'L50-L53')}>
          release-docker.yml L50-L53
        </Cite>
        . No EFA installer, and the standard Mooncake wheel{' '}
        <Cite tier={1} href={sglangUrl('docker/Dockerfile', 'L470-L472')}>
          docker/Dockerfile L470-L472
        </Cite>
        .
      </>
    ),
    pick: 'P6e (Grace hosts), or any family where you add the EFA stack yourself.',
  },
  {
    id: 'ubuntu',
    image: (
      <>
        AWS DLC, Ubuntu line: <code>0.5.22-gpu-py312-cu130-ubuntu24.04-ec2</code> and{' '}
        <code>-sagemaker</code>
      </>
    ),
    sglang: (
      <>
        v0.5.22, built from the upstream image{' '}
        <Cite tier={1} href={dlcUrl(DLC_UBUNTU, 'L1-L6')}>
          DLC Dockerfile L1-L6
        </Cite>
      </>
    ),
    arch: (
      <>
        amd64 only{' '}
        <Cite tier={1} href={dlcUrl(DLC_UBUNTU_CFG, 'L10')}>
          sagemaker-ubuntu.yml L10
        </Cite>
      </>
    ),
    carries: (
      <>
        Adds the EFA installer, at its latest version when the image is built, plus the SageMaker
        entrypoint{' '}
        <Cite tier={1} href={dlcUrl(DLC_UBUNTU, 'L13')}>
          DLC Dockerfile L13
        </Cite>{' '}
        <Cite tier={1} href={dlcUrl(DLC_UBUNTU, 'L72-L73')}>
          L72-L73
        </Cite>
        . Keeps upstream&apos;s standard Mooncake wheel.
      </>
    ),
    pick: 'x86 families on the current release, including PD (prefill/decode) disaggregation over EFA through NIXL (NVIDIA Inference Xfer Library).',
  },
  {
    id: 'al2023',
    image: (
      <>
        AWS DLC, Amazon Linux 2023 (AL2023) &quot;server&quot; line: <code>server-cuda</code> and{' '}
        <code>server-sagemaker-cuda</code>, v1.4
      </>
    ),
    sglang: (
      <>
        0.5.19{' '}
        <Cite tier={1} href={dlcUrl(DLC_CHANGELOG, 'L7-L22')}>
          DLC changelog L7-L22
        </Cite>
      </>
    ),
    arch: (
      <>
        amd64 only{' '}
        <Cite tier={1} href={dlcUrl(DLC_AL2023_CFG, 'L11')}>
          sagemaker-amzn2023.yml L11
        </Cite>
      </>
    ),
    carries: (
      <>
        DeepEP V2 built from AWS&apos;s DeepEP fork, NCCL 2.31.2 and the EFA installer{' '}
        <Cite tier={1} href={dlcUrl(DLC_AL2023, 'L13-L23')}>
          Dockerfile.amzn2023 L13-L23
        </Cite>{' '}
        <Cite tier={1} href={dlcUrl(DLC_AL2023, 'L484-L490')}>
          L484-L490
        </Cite>
        . FlashMLA and DeepEP compiled for SM90, SM100 and SM103 only{' '}
        <Cite tier={1} href={dlcUrl(DLC_AL2023, 'L25')}>
          L25
        </Cite>{' '}
        <Cite tier={1} href={dlcUrl(DLC_AL2023, 'L122-L160')}>
          L122-L160
        </Cite>
        .
      </>
    ),
    pick: 'Wide EP (expert parallelism) across EFA nodes on P5, P5e, P5en, P6-B200 or P6-B300.',
  },
];

/* ------------------------------------------------------------------------ */
/* Table: choose a family by workload                                        */
/* ------------------------------------------------------------------------ */

interface ChooseRow {
  id: string;
  workload: string;
  keep: ReactNode;
  watch: ReactNode;
}

const CHOOSE_ROWS: ChooseRow[] = [
  {
    id: 'dense',
    workload: 'Single-node dense model',
    keep: (
      <>
        P5, P5e and P5en keep <code>fa3</code> with token-exact pages; P6 runs{' '}
        <code>trtllm_mha</code> with 64-token pages{' '}
        <Cite tier={1} href={sglangUrl(MOB, 'L293-L315')} kind="code">
          model_override_base.py L293-L315
        </Cite>
      </>
    ),
    watch: (
      <>
        P4d, P4de and G5 load FP8 checkpoints weight-only, with 16-bit math{' '}
        <Cite tier={1} href={sglangUrl(`${QUANT}/fp8_utils.py`, 'L2540-L2546')} kind="code">
          fp8_utils.py L2540-L2546
        </Cite>
        . G7e and G7 get none of the Blackwell defaults and run <code>flashinfer</code>{' '}
        <Cite tier={1} href={sglangUrl(MOB, 'L316-L324')} kind="code">
          model_override_base.py L316-L324
        </Cite>
        .
      </>
    ),
  },
  {
    id: 'prefix',
    workload: 'Shared-prefix agentic: long system prompts, multi-turn sessions',
    keep: (
      <>
        The P5 family reuses prefixes to the token by default{' '}
        <Cite tier={1} href={sglangUrl(OVR, 'L1304-L1326')} kind="code">
          overrides.py L1304-L1326
        </Cite>
      </>
    ),
    watch: (
      <>
        On P6 a shared prefix shorter than 64 tokens is never matched, and a partial last page is
        recomputed{' '}
        <Cite tier={1} href={sglangDocsSrcUrl(AB_DOC, 'L322')}>
          SGLang docs: attention backend (v0.5.22 source)
        </Cite>{' '}
        <Cite tier={1} href={sglangUrl(RADIX, 'L147-L151')}>
          radix_cache.py L147-L151
        </Cite>
        . Take the page-size action in the last block.
      </>
    ),
  },
  {
    id: 'pd',
    workload: 'PD disaggregation',
    keep: (
      <>
        Every family in the EC2 spec tables: the largest size of each supports EFA{' '}
        <Cite tier={1} href={EC2_SPECS}>
          EC2 accelerated computing specs
        </Cite>
      </>
    ),
    watch: (
      <>
        P6e needs the upstream image, which ships without the EFA installer or the Mooncake EFA
        wheel{' '}
        <Cite tier={1} href={sglangUrl('docker/Dockerfile', 'L470-L472')}>
          docker/Dockerfile L470-L472
        </Cite>
        , and that wheel is built for x86_64 only{' '}
        <Cite tier={1} href={MOONCAKE_EFA_PYPI}>
          PyPI: mooncake-transfer-engine-efa-cuda13 0.3.13.post1
        </Cite>
        , so on a Grace host Mooncake has no EFA build, by our reading. On the AWS DLCs, NIXL&apos;s
        LIBFABRIC backend finds the EFA installer&apos;s libfabric, and Mooncake over EFA needs a
        wheel swap{' '}
        <Cite tier={1} href={dlcUrl(DLC_AL2023, 'L168-L170')}>
          Dockerfile.amzn2023 L168-L170
        </Cite>
        .
      </>
    ),
  },
  {
    id: 'widep',
    workload: 'Wide-EP MoE (mixture of experts)',
    keep: (
      <>
        P5en, P6-B200 and P6-B300 support GPU-initiated EFA traffic, EFA-GDA (Elastic Fabric
        Adapter GPU Direct Async); P5 and P5e use the CPU proxy{' '}
        <Cite tier={1} href={`${GIN_DOC}#L7-L15`}>
          aws-ofi-nccl: GPU-Initiated Networking guide L7-L15
        </Cite>{' '}
        <Cite tier={1} href={`${GIN_DOC}#L36-L44`}>
          L36-L44
        </Cite>
      </>
    ),
    watch: (
      <>
        Of the three images, the AL2023 DLC carries DeepEP V2 over EFA: SGLang 0.5.19, kernels
        for SM90, SM100 and SM103 only, amd64 only, so it excludes P6e{' '}
        <Cite tier={1} href={dlcUrl(DLC_AL2023, 'L25')}>
          Dockerfile.amzn2023 L25
        </Cite>{' '}
        <Cite tier={1} href={dlcUrl(DLC_AL2023_CFG, 'L11')}>
          sagemaker-amzn2023.yml L11
        </Cite>
        . Section 22 has the bring-up.
      </>
    ),
  },
];

/* ------------------------------------------------------------------------ */
/* Section                                                                    */
/* ------------------------------------------------------------------------ */

export function Ec2Instances() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Map an EC2 instance family to the SGLang defaults, backends, features and image it changes, before you move a deployment between families (verified against SGLang v0.5.22, commit baa9befa, 2026-10-24)"
          >
            21. EC2 Instances, Images and GPU-Dependent Behaviour
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Choosing an EC2 (Elastic Compute Cloud) GPU family for SGLang also chooses a set of
            defaults. At startup SGLang reads the GPU&apos;s compute capability and branches on it:
            the capability picks the attention backend, the backend picks the KV page size, and the
            page size sets how finely the radix cache reuses prefixes. The same capability decides
            whether an FP8 checkpoint runs FP8 math, and memory per GPU sets the prefill chunk and
            decode graph sizes. The family name is a proxy for compute capability and memory.
          </Box>
          <Box variant="p">
            Section 6, KV Memory and the Defaults Your GPU Picks, and section 8, Attention Backends
            and Kernels, own the rules. This section maps them onto EC2 families and onto the
            images that run there, so a move between families changes only what you expect.
          </Box>
          <Box variant="p">
            <strong>
              Moving a dense Llama-style model from P5 to P6 changes its attention backend from{' '}
              <code>fa3</code> to <code>trtllm_mha</code> and its KV page from 1 token to 64, with no
              flag change, when speculative decoding is off or on with an explicit{' '}
              <code>--speculative-eagle-topk 1</code>.
            </strong>{' '}
            That is our reading of the default chain in code, not a documented statement{' '}
            <Cite tier={1} href={sglangUrl(MOB, 'L293-L315')} kind="code">
              model_override_base.py L293-L315
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(OVR, 'L1124-L1137')} kind="code">
              overrides.py L1124-L1137
            </Cite>
            . On a P5 the radix cache reuses a shared prefix to the exact token; on a P6 it rounds
            the match down to whole 64-token pages.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Read off the backend and page size a family gives a dense model before you launch on it"
          >
            The instance map
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Each family carries one GPU generation, so each row resolves to one compute capability
            and one default chain. P4d and P4de carry the A100, SM80 (compute capability 8.0,
            Ampere). G6 and G6e carry the L4 and L40S, SM89 (compute capability 8.9, Ada). P5, P5e
            and P5en carry the H100 and H200, SM90 (compute capability 9.0, Hopper). P6-B200 and
            P6e-GB200 carry the B200, SM100 (compute capability 10.0, datacenter Blackwell), and
            P6-B300 and P6e-GB300 carry the B300 and GB300, SM103 (compute capability 10.3){' '}
            <Cite tier={1} href={NVIDIA_CC}>
              NVIDIA: CUDA GPU compute capability
            </Cite>
            . NVIDIA&apos;s table lists the A10 at 8.6 and no A10G, so the map gives G5 SM86
            (compute capability 8.6) by equivalence, which is our reading.
          </Box>
          <InstanceMapDiagram />
          <Box variant="small" color="text-body-secondary">
            Largest size of each family, from the EC2 accelerated-computing spec tables{' '}
            <Cite tier={1} href={EC2_SPECS}>
              EC2 accelerated computing specs
            </Cite>
            ; memory per GPU in GiB as EC2 lists it. Defaults are for a dense Llama-style model,
            MHA or GQA (multi-head or grouped-query attention) with equal K and V head widths, no
            attention flag set, and speculative decoding off or at an explicit{' '}
            <code>--speculative-eagle-topk 1</code>; read from the default chain in code, not run.
            P6e-GB300 is generally available{' '}
            <Cite tier={2} href={GB300_GA}>
              AWS What&apos;s New, 2025-12
            </Cite>{' '}
            but its specs were not in the EC2 spec tables on 2026-10-24.
          </Box>
          <Box variant="p">
            G7e and G7 carry SM120 (compute capability 12.0) GPUs, the RTX PRO 6000 and RTX PRO
            4500 Blackwell Server Edition{' '}
            <Cite tier={1} href={NVIDIA_CC}>
              NVIDIA: CUDA GPU compute capability
            </Cite>
            . They get none of SGLang&apos;s Blackwell defaults, because the Blackwell branch tests
            for compute capability major 10, which covers SM100 and SM103 only{' '}
            <Cite tier={1} href={sglangUrl(COMMON, 'L302-L306')} kind="code">
              common.py L302-L306
            </Cite>
            . A dense model on a G7e falls through to the same chain as an A100:{' '}
            <code>flashinfer</code> with 1-token pages, or <code>triton</code> where FlashInfer is
            missing{' '}
            <Cite tier={1} href={sglangUrl(MOB, 'L316-L324')} kind="code">
              model_override_base.py L316-L324
            </Cite>
            .
          </Box>
          <ExpandableSection headerText="The instance specs behind the map">
            <SpaceBetween size="s">
              <Table
                variant="embedded"
                wrapLines
                trackBy="id"
                items={SPEC_ROWS}
                columnDefinitions={[
                  { id: 'size', header: 'Size', cell: (r) => <code>{r.size}</code>, minWidth: 150 },
                  { id: 'gpus', header: 'GPUs', cell: (r) => r.gpus, minWidth: 150 },
                  { id: 'per', header: 'Memory per GPU (GiB)', cell: (r) => r.perGpu },
                  { id: 'total', header: 'GPU memory (GiB)', cell: (r) => r.total },
                  { id: 'net', header: 'Network (Gbps)', cell: (r) => r.net },
                  { id: 'cpu', header: 'Host CPU', cell: (r) => r.cpu, minWidth: 160 },
                ]}
              />
              <Box variant="small" color="text-body-secondary">
                Every row from{' '}
                <Cite tier={1} href={EC2_SPECS}>
                  EC2 accelerated computing specs
                </Cite>
                , performance and network tables. Every size listed supports EFA (Elastic Fabric
                Adapter). The p5.4xlarge is a single H100, so it shows the P5 defaults on one GPU.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <ExpandableSection headerText="Where the documentation's &quot;Blackwell&quot; differs from v0.5.22's code">
            <Box variant="p">
              The documentation says Blackwell GPUs default MHA models to <code>trtllm_mha</code>{' '}
              unless speculative decoding uses topk above 1{' '}
              <Cite tier={1} href={sglangDocsSrcUrl(AB_DOC, 'L551-L554')} kind="doc-code-conflict">
                SGLang docs: attention backend (v0.5.22 source)
              </Cite>
              . In v0.5.22&apos;s code that branch requires compute capability major 10 and CUDA
              12.8 or later, so it holds on P6 and P6e and skips G7e and G7, which get{' '}
              <code>flashinfer</code>; on P6 it also leaves <code>trtllm_mha</code> when speculation
              is on with topk unset{' '}
              <Cite tier={1} href={sglangUrl(MOB, 'L303-L324')}>
                model_override_base.py L303-L324
              </Cite>{' '}
              <Cite tier={1} href={sglangUrl(COMMON, 'L302-L306')}>
                common.py L302-L306
              </Cite>
              . On a G7e or G7, read the last branch of section 8&apos;s table.
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Predict what changes when the same deployment moves between families: the backend and page from P5 to P6, FP8 math below SM89, and the memory-tiered sizes"
          >
            What a family move changes
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>
              Moving a dense Llama-style model from P5 to P6 changes attention from <code>fa3</code>{' '}
              to <code>trtllm_mha</code> and KV pages from 1 token to 64, with no flag change, when
              speculative decoding is off or on with an explicit{' '}
              <code>--speculative-eagle-topk 1</code>.
            </strong>{' '}
            On SM90 with CUDA 12.3 or later the chain returns <code>fa3</code>, and on SM100 and
            SM103 it returns <code>trtllm_mha</code>, or <code>fa4</code> when K and V head widths
            differ{' '}
            <Cite tier={1} href={sglangUrl(MOB, 'L293-L315')} kind="code">
              model_override_base.py L293-L315
            </Cite>
            . <code>fa3</code> keeps the default page of 1 token{' '}
            <Cite tier={1} href={sglangUrl(OVR, 'L1304-L1326')} kind="code">
              overrides.py L1304-L1326
            </Cite>
            ; <code>trtllm_mha</code> turns any page size outside 16, 32, 64 and 128 into 64, the
            default included{' '}
            <Cite tier={1} href={sglangUrl(OVR, 'L1124-L1137')} kind="code">
              overrides.py L1124-L1137
            </Cite>
            . The radix cache cuts every key to whole pages before it matches{' '}
            <Cite tier={1} href={sglangUrl(RADIX, 'L147-L151')} kind="code">
              radix_cache.py L147-L151
            </Cite>
            , so the reuse unit moves with the backend.
          </Box>
          <Box variant="p">
            Speculative decoding moves both ends of the flip, and section 8 has the detail. With{' '}
            <code>--speculative-eagle-topk</code> above 1, where the draft proposes several
            candidate tokens per step (section 11, Speculative Decoding), both families drop to{' '}
            <code>flashinfer</code> with 1-token pages{' '}
            <Cite tier={1} href={sglangUrl(COMMON, 'L4014-L4020')} kind="code">
              common.py L4014-L4020
            </Cite>
            . With speculation on and topk left unset, a P5 keeps <code>fa3</code> and a P6 lands on{' '}
            <code>flashinfer</code>, because the backend is chosen before SGLang fills in its
            automatic draft shape{' '}
            <Cite tier={1} href={sglangUrl(MOB, 'L303-L311')} kind="code">
              model_override_base.py L303-L311
            </Cite>
            . To keep <code>trtllm_mha</code> under speculation on P6, set{' '}
            <code>--speculative-eagle-topk 1</code> together with{' '}
            <code>--speculative-num-steps</code>: the automatic draft shape refuses an explicit
            topk without an explicit step count{' '}
            <Cite tier={1} href={sglangUrl(SPEC_HOOK, 'L1068-L1072')} kind="code">
              speculative_hook.py L1068-L1072
            </Cite>
            .
          </Box>
          <Box variant="p">
            MLA (multi-head latent attention) models take their own chain. DeepSeek V3 and R1 get{' '}
            <code>trtllm_mla</code> on P6{' '}
            <Cite tier={1} href={sglangUrl(DEEPSEEK_OVR, 'L179-L191')}>
              deepseek_v2.py L179-L191
            </Cite>
            , which also pages at 64 tokens unless you pass 32{' '}
            <Cite tier={1} href={sglangUrl(OVR, 'L1096-L1104')}>
              overrides.py L1096-L1104
            </Cite>
            ; section 8 lists the other MLA defaults.
          </Box>
          <Box variant="p">
            Quantized checkpoints follow the same capability line. On P4d, P4de and G5 (SM80 and
            SM86) an FP8 checkpoint still loads, but SGLang switches to the Marlin kernel: FP8
            weights with 16-bit math, which saves memory without FP8 speed{' '}
            <Cite tier={1} href={sglangUrl(`${QUANT}/fp8_utils.py`, 'L2540-L2546')} kind="code">
              fp8_utils.py L2540-L2546
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(`${QUANT}/fp8.py`, 'L506-L512')} kind="code">
              fp8.py L506-L512
            </Cite>
            . W8A8 FP8 (8-bit weights and activations) needs SM89 or newer, G6 and up, and the
            loader refuses to start below a format&apos;s minimum{' '}
            <Cite tier={1} href={sglangUrl(`${QUANT}/w8a8_fp8.py`, 'L67')}>
              w8a8_fp8.py L67
            </Cite>{' '}
            <Cite tier={1} href={sglangUrl(LOADER, 'L249-L262')}>
              loader.py L249-L262
            </Cite>
            . NVFP4 (NVIDIA&apos;s 4-bit floating-point format) GEMMs (general matrix
            multiplications) run through Marlin below SM100, which covers P4d, P4de, G5, G6, G6e
            and the P5 family, through <code>flashinfer_cutedsl</code>{' '}
            on P6, and through <code>flashinfer_cutlass</code> on G7e and G7{' '}
            <Cite tier={1} href={sglangUrl(`${QUANT}/fp4_utils.py`, 'L149-L162')} kind="code">
              fp4_utils.py L149-L162
            </Cite>
            .
          </Box>
          <Box variant="p">
            Memory per GPU sets two more defaults, the chunked-prefill size and the largest decode
            batch captured in a CUDA graph, in tiers that differ between a P5 and a P6{' '}
            <Cite tier={1} href={sglangUrl(MEMORY_HOOK, 'L78-L188')} kind="code">
              memory_hook.py L78-L188
            </Cite>
            ; section 6 lists the tiers. When you benchmark two families, pin{' '}
            <code>--attention-backend</code>, <code>--page-size</code>,{' '}
            <code>--chunked-prefill-size</code> and <code>--cuda-graph-max-bs-decode</code>, or
            the comparison measures two sets of defaults.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Pick the image by host CPU, SGLang version and the EFA stack your workload needs"
          >
            Images: upstream, or one of two AWS lines
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            This block compares three images; section 19, SGLang on SageMaker AI and HyperPod,
            named the two AWS ones. The upstream <code>lmsysorg/sglang:v0.5.22</code> image is a
            CUDA 13.0 build for amd64 and arm64, so the AMI (Amazon Machine Image) under it needs an NVIDIA driver from
            the 580 branch or later{' '}
            <Cite tier={1} href={CUDA_NOTES}>
              NVIDIA: CUDA Toolkit release notes, Table 3
            </Cite>
            . The AWS SGLang DLCs (Deep Learning Containers) trade freshness for features. The
            Ubuntu line is the upstream image plus the EFA (Elastic Fabric Adapter) installer, and
            its first v0.5.22 tag was pushed on 2026-10-20, a day after the upstream release of
            2026-10-19{' '}
            <Cite tier={1} href={ECR_GALLERY}>
              Amazon ECR (Elastic Container Registry) Public Gallery: deep-learning-containers/sglang
            </Cite>
            . The AL2023 line carries DeepEP V2 over EFA with the NCCL (NVIDIA Collective
            Communications Library) version that backend checks at runtime, and runs SGLang 0.5.19,
            three releases behind{' '}
            <Cite tier={1} href={dlcUrl(DLC_CHANGELOG, 'L7-L22')}>
              DLC changelog L7-L22
            </Cite>
            .
          </Box>
          <Table
            variant="embedded"
            wrapLines
            trackBy="id"
            items={IMAGE_ROWS}
            columnDefinitions={[
              { id: 'image', header: 'Image', cell: (r) => r.image, minWidth: 200 },
              { id: 'sglang', header: 'SGLang', cell: (r) => r.sglang, minWidth: 120 },
              { id: 'arch', header: 'CPU architecture', cell: (r) => r.arch, minWidth: 140 },
              { id: 'carries', header: 'What it carries', cell: (r) => r.carries, minWidth: 260 },
              { id: 'pick', header: 'Pick it for', cell: (r) => r.pick, minWidth: 180 },
            ]}
          />
          <Box variant="p">
            Both AWS lines are amd64 only, so P6e-GB200 and P6e-GB300, whose hosts are Arm Grace
            CPUs, need the multi-arch upstream image{' '}
            <Cite tier={1} href={dlcUrl(DLC_UBUNTU_CFG, 'L10')}>
              sagemaker-ubuntu.yml L10
            </Cite>{' '}
            <Cite tier={1} href={dlcUrl(DLC_AL2023_CFG, 'L11')}>
              sagemaker-amzn2023.yml L11
            </Cite>
            . The AL2023 line compiles its own FlashMLA and DeepEP for SM90, SM100 and SM103, so on
            P4d, G6e or G7e use the Ubuntu line or the upstream image{' '}
            <Cite tier={1} href={dlcUrl(DLC_AL2023, 'L25')}>
              Dockerfile.amzn2023 L25
            </Cite>
            . SGLang also builds ROCm (AMD&apos;s GPU software stack) images for AMD Instinct
            GPUs{' '}
            <Cite tier={1} href={sglangUrl('.github/workflows/release-docker-amd.yml', 'L33')}>
              release-docker-amd.yml L33
            </Cite>
            , and the EC2 accelerated-computing spec page read for this research lists no AMD
            Instinct instance, so on EC2 SGLang&apos;s GPU path is NVIDIA{' '}
            <Cite tier={1} href={EC2_SPECS}>
              EC2 accelerated computing specs
            </Cite>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Match your workload to the families that keep the feature it depends on, and the constraint each family trips"
          >
            Choose a family by workload
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Each row names the feature the workload depends on, the families that keep it, and the
            constraint to check before you commit capacity.
          </Box>
          <Table
            variant="embedded"
            wrapLines
            trackBy="id"
            items={CHOOSE_ROWS}
            columnDefinitions={[
              { id: 'workload', header: 'Workload', cell: (r) => r.workload, minWidth: 160 },
              { id: 'keep', header: 'Families that keep the feature', cell: (r) => r.keep, minWidth: 240 },
              { id: 'watch', header: 'Constraint to check', cell: (r) => r.watch, minWidth: 280 },
            ]}
          />
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Keep the prefix reuse and the backend you tested when the deployment lands on a new family"
          >
            Before you move a deployment between families
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The page-size action on P6.</strong> If your shared prefixes are short or do
            not end on a 64-token boundary, set <code>--page-size 16</code>, and keep shared
            prefixes at page multiples either way. <code>trtllm_mha</code> accepts 16, 32, 64 or
            128 in the code at v0.5.22{' '}
            <Cite tier={1} href={sglangUrl(OVR, 'L1124-L1137')} kind="code">
              overrides.py L1124-L1137
            </Cite>
            . The throughput effect of smaller pages was not measured in this research; the
            documentation notes that larger pages generally make the attention kernels faster{' '}
            <Cite tier={1} href={sglangDocsSrcUrl(AB_DOC, 'L322')}>
              SGLang docs: attention backend (v0.5.22 source)
            </Cite>
            . The action applies with speculative decoding off: at topk 1, an explicit page size
            above 1 moves the model off <code>trtllm_mha</code> to <code>flashinfer</code>{' '}
            <Cite tier={1} href={sglangUrl(COMMON, 'L4014-L4020')} kind="code">
              common.py L4014-L4020
            </Cite>
            . Section 6 sets out when the smaller page pays.
          </Box>
          <Box variant="p">
            <strong>Against vLLM:</strong> for a dense model both engines run FlashAttention 3 on
            H100 and FlashInfer kernels on B200, SGLang through its <code>trtllm_mha</code>{' '}
            wrapper{' '}
            <Cite tier={1} href={VLLM_CUDA}>
              vLLM v0.31.0 platforms/cuda.py L154-L179
            </Cite>
            . The family move changes SGLang&apos;s page from 1 token to 64, where vLLM keeps its
            16-token default block on both{' '}
            <Cite tier={1} href={VLLM_CACHE}>
              vLLM v0.31.0 config/cache.py L333-L334
            </Cite>
            . The NIXL and EFA installer material in the {VLLM_AWS_LINK} carries over.
          </Box>
          <Box variant="p">
            <strong>The pre-migration checklist.</strong>
          </Box>
          <ol style={{ margin: 0, paddingInlineStart: 20 }}>
            <li>
              Launch once on the new family with your flags and read the startup log: the line{' '}
              <code>Attention backend not specified. Use fa3 backend by default.</code> names the
              backend (<code>trtllm_mha</code> on P6), and on P6 a TensorRT-LLM MHA warning
              reports the page size changing to 64{' '}
              <Cite tier={1} href={sglangUrl(OVR, 'L1076-L1079')} kind="code">
                overrides.py L1076-L1079
              </Cite>{' '}
              <Cite tier={1} href={sglangUrl(OVR, 'L1124-L1137')} kind="code">
                overrides.py L1124-L1137
              </Cite>
              .
            </li>
            <li>
              If you run speculative decoding, set <code>--speculative-eagle-topk 1</code> and{' '}
              <code>--speculative-num-steps</code> yourself, so P6 keeps <code>trtllm_mha</code>.
            </li>
            <li>
              On P6, decide the page size before the first load test, by the action above.
            </li>
            <li>
              On P4d, P4de or G5, expect FP8 checkpoints to save memory, not time: they run
              weight-only.
            </li>
            <li>
              Benchmark families with the attention backend, page size, chunk size and decode
              graph size pinned, so the comparison measures the hardware.
            </li>
            <li>
              Pick the image by host CPU and version: the upstream image on P6e, the Ubuntu DLC
              for v0.5.22 on x86, the AL2023 DLC for DeepEP V2 over EFA; under a CUDA 13 image,
              use a driver from the 580 branch or later.
            </li>
            <li>
              For PD or wide EP across nodes, bring up EFA next: section 22, PD and Wide EP over
              EFA, takes the two stacks one layer at a time.
            </li>
          </ol>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
