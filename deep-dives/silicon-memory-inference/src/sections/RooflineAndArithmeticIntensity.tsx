import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Alert from '@cloudscape-design/components/alert';
import Table from '@cloudscape-design/components/table';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { RooflineChart, RidgeMapChart } from '../components/RooflineChart';
import { Cite } from '../components/Cite';
import { S } from '../sources/RooflineAndArithmeticIntensity';

const hopperDense =
  'NVIDIA marks the Hopper Tensor Core figures "With sparsity". Its Hopper architecture blog lists Tensor Core peaks as dense/sparse pairs at a 1:2 ratio, so dense is half the page figure.';

const hgxDense =
  'The HGX page rates FP8 and BF16 for an 8-GPU board as sparse specifications and gives dense as half the sparse figure.';

const decodeNote =
  'A decode step multiplies every weight once per sequence in the batch: one multiply-add, 2 FLOP. FP16 and BF16 store 2 bytes per weight, FP8 1 byte, so batch 1 is about 1 FLOP per byte with 16-bit weights and 2 with FP8 weights. Against the H200 dense ridges: 206 / 1 = 206 and 412 / 2 = 206. KV-cache reads add bytes, so real decode sits at or below this.';

const rooflineNote =
  'Attainable FLOP/s = min(peak FLOP/s, bandwidth x arithmetic intensity). Below the ridge the bandwidth term is the smaller one.';

interface RidgeRow {
  chip: string;
  bw: React.ReactNode;
  bf16: React.ReactNode;
  fp8: React.ReactNode;
  fp4: React.ReactNode;
}

const ridgeRows: RidgeRow[] = [
  {
    chip: 'NVIDIA H100 SXM',
    bw: (
      <>
        3.35 TB/s
        <Cite s={S.h100Page} />
      </>
    ),
    bf16: (
      <>
        295
        <Cite s={S.h100Page} kind="derived" note="BF16 1,979 TFLOPS sparse, 989.5 dense. 989.5 / 3.35 = 295." />
      </>
    ),
    fp8: (
      <>
        591
        <Cite s={S.h100Page} kind="derived" note="FP8 3,958 TFLOPS sparse, 1,979 dense. 1,979 / 3.35 = 591." />
      </>
    ),
    fp4: '-',
  },
  {
    chip: 'NVIDIA H200 SXM',
    bw: (
      <>
        4.8 TB/s
        <Cite s={S.h200Page} />
      </>
    ),
    bf16: (
      <>
        206
        <Cite s={S.h200Page} kind="derived" note="BF16 1,979 TFLOPS sparse, 989.5 dense. 989.5 / 4.8 = 206." />
      </>
    ),
    fp8: (
      <>
        <strong>412</strong>
        <Cite s={S.h200Page} kind="derived" note="FP8 3,958 TFLOPS sparse, 1,979 dense. 1,979 / 4.8 = 412." />
      </>
    ),
    fp4: '-',
  },
  {
    chip: 'NVIDIA B200',
    bw: (
      <>
        8 TB/s
        <Cite s={S.dgxB200} kind="derived" note="DGX B200 lists 64 TB/s of HBM3e bandwidth across 8 GPUs; 64 / 8 = 8." />
      </>
    ),
    bf16: (
      <>
        281
        <Cite s={S.hgxPage} kind="derived" note="HGX B200 FP16/BF16 36 PFLOPS sparse for 8 GPUs: 2.25 dense per GPU. 2,250 / 8 = 281." />
      </>
    ),
    fp8: (
      <>
        562
        <Cite s={S.dgxB200} kind="derived" note="DGX B200 FP8 72 PFLOPS sparse for 8 GPUs: 4.5 dense per GPU. 4,500 / 8 = 562." />
      </>
    ),
    fp4: (
      <>
        1,125
        <Cite s={S.hgxPage} kind="derived" note="HGX B200 FP4 144 sparse | 72 dense PFLOPS for 8 GPUs: 9 dense per GPU. 9,000 / 8 = 1,125." />
      </>
    ),
  },
  {
    chip: 'NVIDIA B300',
    bw: (
      <>
        8 TB/s
        <Cite s={S.blackwellUltraBlog} />
      </>
    ),
    bf16: (
      <>
        281
        <Cite s={S.hgxPage} kind="derived" note="HGX B300 FP16/BF16 36 PFLOPS sparse for 8 GPUs: 2.25 dense per GPU. 2,250 / 8 = 281." />
      </>
    ),
    fp8: (
      <>
        562
        <Cite s={S.hgxPage} kind="derived" note="HGX B300 FP8 72 PFLOPS sparse for 8 GPUs: 4.5 dense per GPU. 4,500 / 8 = 562." />
      </>
    ),
    fp4: (
      <>
        1,688 (HGX B300)
        <Cite s={S.hgxPage} kind="derived" note="HGX B300 FP4 144 sparse | 108 dense PFLOPS for 8 GPUs: 13.5 dense per GPU. 13,500 / 8 = 1,688." />
        ; 1,875 (GB300 NVL72)
        <Cite s={S.gb300Nvl72} kind="derived" note="GB300 NVL72 FP4 1,440 sparse | 1,080 dense PFLOPS and up to 576 TB/s for 72 GPUs: 15 PFLOPS and 8 TB/s per GPU. 15,000 / 8 = 1,875." />
      </>
    ),
  },
  {
    chip: 'NVIDIA Rubin',
    bw: (
      <>
        22 TB/s
        <Cite s={S.hgxPage} note="Individual GPU Specifications table: 288 GB HBM4 | 22 TB/s." />
      </>
    ),
    bf16: (
      <>
        182
        <Cite s={S.hgxPage} kind="derived" note="FP16/BF16 4 PFLOPS (dense specification). 4,000 / 22 = 182." />
      </>
    ),
    fp8: (
      <>
        795
        <Cite s={S.hgxPage} kind="derived" note="FP8/FP6 17.5 PFLOPS (dense specification). 17,500 / 22 = 795." />
      </>
    ),
    fp4: (
      <>
        1,591
        <Cite s={S.hgxPage} kind="derived" note="NVFP4 35 PFLOPS (training, dense specification). 35,000 / 22 = 1,591. The 50 PFLOPS NVFP4 inference figure is sparse; it gives 2,273." />
      </>
    ),
  },
  {
    chip: 'AMD Instinct MI355X',
    bw: (
      <>
        8 TB/s
        <Cite s={S.amdMi355x} />
      </>
    ),
    bf16: '-',
    fp8: (
      <>
        625
        <Cite s={S.amdMi355x} kind="derived" note="Peak OCP-FP8 5 PFLOPS (10.1 with structured sparsity). 5,000 / 8 = 625." />
      </>
    ),
    fp4: (
      <>
        1,262
        <Cite s={S.amdMi355x} kind="derived" note="Peak MXFP4 10.1 PFLOPS. 10,100 / 8 = 1,262." />
      </>
    ),
  },
  {
    chip: 'AWS Trainium2',
    bw: (
      <>
        2.9 TB/s
        <Cite s={S.trainium2Arch} />
      </>
    ),
    bf16: (
      <>
        230
        <Cite s={S.trainium2Arch} kind="derived" note="667 BF16 TFLOPS. 667 / 2.9 = 230." />
      </>
    ),
    fp8: (
      <>
        448
        <Cite s={S.trainium2Arch} kind="derived" note="1,299 FP8 TFLOPS. 1,299 / 2.9 = 448." />
      </>
    ),
    fp4: '-',
  },
  {
    chip: 'AWS Trainium3',
    bw: (
      <>
        4.9 TB/s
        <Cite s={S.trainium3Arch} />
      </>
    ),
    bf16: (
      <>
        137
        <Cite s={S.trainium3Arch} kind="derived" note="671 BF16 TFLOPS. 671 / 4.9 = 137." />
      </>
    ),
    fp8: (
      <>
        514
        <Cite s={S.trainium3Arch} kind="derived" note="2,517 MXFP8/MXFP4 TFLOPS. 2,517 / 4.9 = 514." />
      </>
    ),
    fp4: (
      <>
        514
        <Cite s={S.trainium3Arch} kind="derived" note="MXFP4 shares the 2,517 TFLOPS MXFP8 rating, so the ridge does not move." />
      </>
    ),
  },
];

interface InputRow {
  id: string;
  chip: string;
  dense: string;
  sparse: string;
  bw: string;
  source: React.ReactNode;
}

const hopperSrc = (page: typeof S.h100Page) => (
  <>
    <Cite s={page} />
    <Cite s={S.hopperArchBlog} kind="derived" note={hopperDense} />
  </>
);

const inputRows: InputRow[] = [
  { id: 'h100-bf16', chip: 'H100 SXM, BF16', dense: '989.5 TFLOPS', sparse: '1,979 TFLOPS', bw: '3.35 TB/s', source: hopperSrc(S.h100Page) },
  { id: 'h100-fp8', chip: 'H100 SXM, FP8', dense: '1,979 TFLOPS', sparse: '3,958 TFLOPS', bw: '3.35 TB/s', source: hopperSrc(S.h100Page) },
  { id: 'h200-bf16', chip: 'H200 SXM, BF16', dense: '989.5 TFLOPS', sparse: '1,979 TFLOPS', bw: '4.8 TB/s', source: hopperSrc(S.h200Page) },
  { id: 'h200-fp8', chip: 'H200 SXM, FP8', dense: '1,979 TFLOPS', sparse: '3,958 TFLOPS', bw: '4.8 TB/s', source: hopperSrc(S.h200Page) },
  {
    id: 'b200-bf16',
    chip: 'B200, BF16',
    dense: '2.25 PFLOPS',
    sparse: '4.5 PFLOPS',
    bw: '8 TB/s',
    source: (
      <>
        <Cite s={S.hgxPage} kind="derived" note={hgxDense} />
        <Cite s={S.dgxB200} kind="derived" />
      </>
    ),
  },
  { id: 'b200-fp8', chip: 'B200, FP8', dense: '4.5 PFLOPS', sparse: '9 PFLOPS', bw: '8 TB/s', source: <Cite s={S.dgxB200} kind="derived" note="72 PFLOPS FP8 and 64 TB/s for 8 GPUs." /> },
  {
    id: 'b200-fp4',
    chip: 'B200, NVFP4',
    dense: '9 PFLOPS',
    sparse: '18 PFLOPS',
    bw: '8 TB/s',
    source: <Cite s={S.hgxPage} kind="derived" note="144 sparse | 72 dense PFLOPS for 8 GPUs." />,
  },
  {
    id: 'b300-bf16',
    chip: 'B300 (HGX), BF16',
    dense: '2.25 PFLOPS',
    sparse: '4.5 PFLOPS',
    bw: '8 TB/s',
    source: (
      <>
        <Cite s={S.hgxPage} kind="derived" note={hgxDense} />
        <Cite s={S.blackwellUltraBlog} />
      </>
    ),
  },
  { id: 'b300-fp8', chip: 'B300 (HGX), FP8', dense: '4.5 PFLOPS', sparse: '9 PFLOPS', bw: '8 TB/s', source: <Cite s={S.hgxPage} kind="derived" note={hgxDense} /> },
  {
    id: 'b300-fp4',
    chip: 'B300, NVFP4',
    dense: '13.5 PFLOPS (HGX); 15 (GB300 NVL72)',
    sparse: '18 PFLOPS (HGX); 20 (GB300 NVL72)',
    bw: '8 TB/s',
    source: (
      <>
        <Cite s={S.hgxPage} kind="derived" note="HGX B300: 144 sparse | 108 dense PFLOPS for 8 GPUs." />
        <Cite s={S.gb300Nvl72} kind="derived" note="GB300 NVL72: 1,440 sparse | 1,080 dense PFLOPS for 72 GPUs." />
      </>
    ),
  },
  { id: 'rubin-bf16', chip: 'Rubin, BF16', dense: '4 PFLOPS', sparse: '-', bw: '22 TB/s', source: <Cite s={S.hgxPage} /> },
  { id: 'rubin-fp8', chip: 'Rubin, FP8', dense: '17.5 PFLOPS', sparse: '-', bw: '22 TB/s', source: <Cite s={S.hgxPage} /> },
  { id: 'rubin-fp4', chip: 'Rubin, NVFP4', dense: '35 PFLOPS', sparse: '50 PFLOPS', bw: '22 TB/s', source: <Cite s={S.hgxPage} /> },
  { id: 'mi355x-fp8', chip: 'MI355X, OCP FP8', dense: '5 PFLOPS', sparse: '10.1 PFLOPS', bw: '8 TB/s', source: <Cite s={S.amdMi355x} /> },
  { id: 'mi355x-fp4', chip: 'MI355X, MXFP4', dense: '10.1 PFLOPS', sparse: '-', bw: '8 TB/s', source: <Cite s={S.amdMi355x} /> },
  { id: 'trn2-bf16', chip: 'Trainium2, BF16', dense: '667 TFLOPS', sparse: '-', bw: '2.9 TB/s', source: <Cite s={S.trainium2Arch} /> },
  { id: 'trn2-fp8', chip: 'Trainium2, FP8', dense: '1,299 TFLOPS', sparse: '-', bw: '2.9 TB/s', source: <Cite s={S.trainium2Arch} /> },
  { id: 'trn3-bf16', chip: 'Trainium3, BF16', dense: '671 TFLOPS', sparse: '-', bw: '4.9 TB/s', source: <Cite s={S.trainium3Arch} /> },
  { id: 'trn3-mx', chip: 'Trainium3, MXFP8 and MXFP4', dense: '2,517 TFLOPS', sparse: '-', bw: '4.9 TB/s', source: <Cite s={S.trainium3Arch} /> },
];

export function RooflineAndArithmeticIntensity() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Place any workload on any chip from two spec-sheet numbers, and see why your precision choice moves the ridge further than a chip generation does"
          >
            Roofline and Arithmetic Intensity
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The roofline model, published by Williams, Waterman and Patterson in Communications of
            the ACM in April 2009,
            <Cite s={S.roofline} /> answers one question about any workload on any chip: is it
            waiting on memory or on arithmetic? It still works seventeen years on because it reduces
            that question to a ratio of two figures every vendor publishes.
          </Box>
          <Box variant="p">
            <strong>Three quantities.</strong> <em>Arithmetic intensity</em> is FLOP per byte of
            DRAM (dynamic random-access memory) traffic, a property of the workload and its
            implementation. <em>Peak FLOPS</em> is the chip&apos;s arithmetic ceiling at one
            precision. <em>Peak bandwidth</em> is its DRAM throughput, HBM (High Bandwidth Memory)
            on every accelerator in this section. The <em>ridge point</em> is peak FLOPS divided by
            peak bandwidth. Below the ridge a workload is memory-bound and extra FLOPS do nothing
            for it; above the ridge it is compute-bound and extra bandwidth does nothing.
            <Cite s={S.roofline} note={rooflineNote} />
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Where decode and prefill land on an H200, and what one precision step does to the chip and to the workload"
          >
            The roofline, placed
          </Header>
        }
      >
        <SpaceBetween size="m">
          <RooflineChart />
          <Box variant="small" color="text-body-secondary">
            NVIDIA H200 SXM: dense Tensor Core peaks of 989.5 TFLOPS in BF16 (bfloat16) and 1,979
            TFLOPS in FP8 (8-bit floating point), against 4.8 TB/s of HBM3e.
            <Cite s={S.h200Page} />
            <Cite s={S.hopperArchBlog} kind="derived" note={hopperDense} /> Both axes are
            logarithmic. Workload intensities count weight bytes only, at 2 FLOP per weight per
            sequence in the batch.
          </Box>
          <Box variant="p">
            Decode at batch 1 sits about 200 times below the ridge at either precision.
            <Cite s={S.h200Page} kind="derived" note={decodeNote} /> FP8 doubles both the ridge
            and decode&apos;s intensity, so decode runs about twice as fast and stays just as far
            from the ridge. A batch of 64 with FP8 weights reaches about 128 FLOP per byte, still on
            the bandwidth slope. Prefill on a long prompt reuses each weight across thousands of
            tokens and runs on the compute ceiling.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Why decode speed follows HBM bandwidth and prefill speed follows FLOPS, and the spec-sheet estimate that follows"
          >
            Prefill and decode: one chip, two workloads
          </Header>
        }
      >
        <SpaceBetween size="m">
          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Prefill: far above the ridge</Box>
              <Box variant="p">
                Prefill processes the whole prompt in parallel to fill the KV (key-value) cache, so
                every weight read serves every prompt token in the batch. A 4k-token prompt at
                batch 16 puts 65,536 tokens behind each weight read, far above the H200 ridge.
                <Cite s={S.h200Page} kind="derived" note="Linear layers do about 2 FLOP per weight per token. With 8-bit weights and 65,536 tokens per weight read, the weight term alone allows over 100,000 FLOP per byte, against a ridge of 412." />{' '}
                More FLOPS help prefill directly; more HBM bandwidth helps only marginally.
              </Box>
            </div>
            <div>
              <Box variant="h3">Decode: deep below the ridge</Box>
              <Box variant="p">
                Decode generates one token per sequence per step, so each weight is read once and
                used once per sequence. A dense model does about 2 FLOP per
                parameter per token: about 1 FLOP per byte with FP16 (16-bit floating point) or
                BF16 weights, about 2 with FP8, two orders of magnitude short of H200&apos;s dense
                BF16 ridge of 206.
                <Cite s={S.h200Page} kind="derived" note={decodeNote} /> Tokens per second tracks
                HBM bandwidth almost linearly until another limit binds.
              </Box>
            </div>
          </ColumnLayout>
          <Alert type="info" header="Two consequences for serving">
            First, the spec sheet gives a ceiling on batch-1 decode speed: HBM bandwidth divided by
            the bytes read per token, the active parameter bytes plus the KV-cache bytes. A
            70-billion-parameter dense model in FP8 reads about 70 GB per token, so one H200 tops
            out near 68 tokens per second.
            <Cite s={S.h200Page} kind="derived" note="4.8 TB/s / 70 GB = 68.6 tokens per second, weights only; KV-cache reads lower it." />{' '}
            Second, GQA (grouped-query attention), KV-cache quantization, FlashAttention-class
            fusion and speculative decoding speed up decode by cutting the bytes moved per useful
            FLOP. Disaggregated serving instead runs prefill and decode on separate GPUs, which
            removes interference between the phases and lets each be sized on its own.
            <Cite s={S.distServe} />
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Read across a row for a precision step and down a column for a generation: the row moves the ridge further, so compute it at the precision you will run"
          >
            Ridge points across chips and precisions
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Table
            items={ridgeRows}
            columnDefinitions={[
              { id: 'chip', header: 'Chip', cell: (r) => r.chip, minWidth: 150 },
              { id: 'bw', header: 'HBM bandwidth', cell: (r) => r.bw, minWidth: 120 },
              { id: 'bf16', header: 'BF16 ridge', cell: (r) => r.bf16, minWidth: 150 },
              { id: 'fp8', header: 'FP8 ridge', cell: (r) => r.fp8, minWidth: 150 },
              { id: 'fp4', header: 'FP4 ridge', cell: (r) => r.fp4, minWidth: 170 },
            ]}
            variant="embedded"
            wrapLines
          />
          <Box variant="small" color="text-body-secondary">
            Dense peak FLOPS divided by HBM bandwidth, in FLOP per byte. FP8 is OCP (Open Compute
            Project) FP8 on MI355X and MXFP8, the OCP microscaling format, on Trainium3. FP4 is
            NVFP4 (NVIDIA&apos;s 4-bit float) on NVIDIA and MXFP4 on AMD and Trainium3. A dash
            means the cited source gives no figure for that precision.
          </Box>
          <RidgeMapChart />
          <Box variant="p">
            <strong>The precision step moves the ridge more than the generation does.</strong> At
            a fixed precision the ridge stays flat or falls: BF16 runs 295 on H100, 281 on B200
            and 182 on Rubin, whose HBM4 grew faster than its BF16 rate. A precision step on one
            chip moves it 2x on H200 (206 to 412) and almost 9x on Rubin (182 at BF16 to 1,591 at
            NVFP4). Your precision choice decides where the ridge sits more than your chip choice
            does.
          </Box>
          <Box variant="p">
            Halving the bytes matches a doubling of the FLOPS rate, so on H200 decode simply runs
            faster. The regime changes where the rate moves by more or less than 2x. On Rubin, BF16
            to FP8 goes from 4 to 17.5 PFLOPS, so a decode batch that was compute-bound at BF16 can
            land back on the bandwidth slope at FP8, faster but bandwidth-limited again.
            <Cite s={S.hgxPage} kind="derived" note="Weight GEMMs at batch B do B FLOP per byte with BF16 weights and 2B with FP8 weights. Against Rubin's ridges of 182 (BF16) and 795 (FP8), they turn compute-bound from B = 182 at BF16 but only from B = 398 at FP8." />{' '}
            On Trainium3, MXFP4 runs at the MXFP8 rate, so FP4 halves the bytes without moving the
            ridge.
            <Cite s={S.trainium3Arch} kind="derived" note="2,517 MXFP8/MXFP4 TFLOPS: the same rate at both precisions." />
          </Box>
          <Box variant="p">
            Faster HBM pulls the ridge left. Architectures that work out of on-chip memory change
            the denominator itself: Cerebras wafer-scale engines, compute-in-memory devices and
            NVIDIA&apos;s Groq 3 LPX, whose LPUs (Language Processing Units) each use 500 MB of
            on-chip SRAM (static RAM) as primary working storage.
            <Cite s={S.lpxBlog} /> <em>Cerebras Wafer-Scale</em>, <em>Groq, SambaNova and Dataflow</em> and{' '}
            <em>Compute-in-Memory</em> cover each.
          </Box>
          <ExpandableSection headerText="Peak FLOPS and bandwidth behind each ridge, dense and sparse">
            <SpaceBetween size="s">
              <Table
                items={inputRows}
                trackBy="id"
                columnDefinitions={[
                  { id: 'chip', header: 'Chip and precision', cell: (r) => r.chip, minWidth: 160 },
                  { id: 'dense', header: 'Dense peak', cell: (r) => r.dense, minWidth: 120 },
                  { id: 'sparse', header: 'Sparse peak (2:4)', cell: (r) => r.sparse, minWidth: 130 },
                  { id: 'bw', header: 'HBM per chip', cell: (r) => r.bw, minWidth: 100 },
                  { id: 'src', header: 'Source', cell: (r) => r.source, minWidth: 220 },
                ]}
                variant="embedded"
                wrapLines
              />
              <Box variant="p">
                Sparse rates apply only to weights pruned to the 2:4 structured pattern, so every
                ridge on this page uses the dense rate. With sparse rates the H200 FP8 ridge would
                be 825 and the Rubin NVFP4 ridge 2,273.
                <Cite s={S.h200Page} kind="derived" note="3,958 / 4.8 = 825." />
                <Cite s={S.hgxPage} kind="derived" note="50,000 / 22 = 2,273." />
              </Box>
              <Box variant="p">
                NVIDIA&apos;s pages give three HBM4 bandwidths for Rubin. The HGX page&apos;s
                individual-GPU table gives 22 TB/s; the Vera Rubin NVL72 page gives 19.2 TB/s per
                GPU; the HGX Rubin NVL8 board lists 130 TB/s across eight GPUs with lower compute
                (130 PFLOPS dense FP8).
                <Cite s={S.hgxPage} />
                <Cite s={S.veraRubinNvl72} /> The tables use the individual-GPU figures because
                FLOPS and bandwidth there come from one table. At 19.2 TB/s the Rubin ridges are
                208 (BF16), 911 (FP8) and 1,823 (NVFP4); on the NVL8 board&apos;s own figures the
                FP8 ridge is 1,000.
                <Cite s={S.hgxPage} kind="derived" note="4,000, 17,500 and 35,000 / 19,200; NVL8 board 130 PFLOPS / 130 TB/s." />{' '}
                Compute the ridge from the system you are buying. On all three the BF16 ridge stays
                inside the range of earlier generations.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Batch size, operator fusion and precision are the three levers you control at serving time, and each one stops at a different limit"
          >
            Moving the workload along the x-axis
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Batching.</strong> Each extra decode sequence reuses the same weight bytes, so
            N sequences raise the intensity of the weight GEMMs (general matrix multiplies) N
            times. That is why vLLM, TensorRT-LLM, SGLang and NxD Inference on Trainium
            spend so much code on continuous batching. On H200 the weight GEMMs reach the ridge
            near 200 sequences, with BF16 or FP8 weights alike.
            <Cite s={S.h200Page} kind="derived" note="2B FLOP per byte = 412 with FP8 weights gives B = 206; B FLOP per byte = 206 with BF16 weights gives the same B." />{' '}
            Attention does not batch this way: each sequence reads its own KV cache, so attention
            intensity stays roughly flat as the batch grows. KV-cache capacity caps the batch,
            because each request&apos;s KV cache grows with context length.{' '}
            <em>KV Cache and FlashAttention</em> walks that trade-off, and{' '}
            <em>Flash as a Cache Tier for Inference</em> covers a KV cache that outgrows HBM.
          </Box>
          <Box variant="p">
            <strong>Operator fusion.</strong> One kernel for several operators keeps intermediate
            tensors in SMEM (shared memory), TMEM (Tensor Memory) or SBUF (State Buffer) instead of
            HBM. FlashAttention fuses the attention matmul, softmax and second matmul and keeps the
            working tile on chip, which cuts HBM traffic and raises intensity. The current kernels
            are FlashAttention-3 on Hopper
            <Cite s={S.flashAttentionReadme} /> and FlashAttention-4, in beta, on Blackwell.
            <Cite s={S.fa4Release} /> CUTLASS, CuTe and Triton on NVIDIA and NKI (Neuron Kernel
            Interface) on Trainium emit fused kernels; <em>NVIDIA Compilers and Kernel Tooling</em>{' '}
            and <em>AWS Compilers and Kernel Tooling</em> cover them.
          </Box>
          <Box variant="p">
            <strong>Precision.</strong> Lower precision cuts the bytes per operand without changing
            the FLOP count, so FP8 weights roughly double intensity against BF16; NVFP4 and MXFP4
            push further. Before you pick a precision, read your chip&apos;s row in the ridge table:
            the step speeds up memory-bound decode through the bytes it saves, and compute-bound
            prefill only where the FLOPS rate rises with it. <em>Quantization and Precision</em> covers
            the full ladder and the numerics that make FP8 and FP4 usable at model scale.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
