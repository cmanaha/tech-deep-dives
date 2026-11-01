import { describe, expect, it } from 'vitest';
import {
  DEEPSEEK_V3,
  DEFAULT_HEADROOM,
  DEFAULT_MFU,
  DENSE_MODELS,
  E1_MEASURED_SBH,
  E3_FSDP2_PER_UNIT,
  EKS_FEES,
  FAILURE_RATES,
  FP32_GRADIENT_BYTES,
  FROZEN_BASE_BYTES,
  FSX_CAPACITY_STEPS_GIB,
  FSX_TIERS,
  GB,
  GiB,
  INSTANCES,
  OPTIMIZER_ROWS,
  PCS_FEES,
  PRICES,
  S3_CONNECTOR_PART_BYTES,
  S3_PUT_PER_SECOND_PER_PREFIX,
  SOURCES,
  customLlamaShape,
  memoryFigureBytes,
  rankFacts,
  requirePositiveInteger,
  requireUnitFraction,
  shapeOf,
  type Source,
} from '../lib/presets';

/** Every object in a tree that looks like a Source (has url and tier). */
function collectSources(node: unknown, out: Source[] = []): Source[] {
  if (node === null || typeof node !== 'object') return out;
  const record = node as Record<string, unknown>;
  if (typeof record.url === 'string' && typeof record.tier === 'number') out.push(record as unknown as Source);
  for (const value of Object.values(record)) collectSources(value, out);
  return out;
}

/** Every object in a tree that carries a numeric value; each must carry a source beside it. */
function collectSourcedNumbers(node: unknown, path: string, out: { path: string; source: unknown }[] = []) {
  if (node === null || typeof node !== 'object') return out;
  const record = node as Record<string, unknown>;
  if (typeof record.value === 'number') out.push({ path, source: record.source });
  for (const [key, value] of Object.entries(record)) {
    if (key !== 'source') collectSourcedNumbers(value, `${path}.${key}`, out);
  }
  return out;
}

const ALL_PRESETS = {
  DENSE_MODELS,
  DEEPSEEK_V3,
  INSTANCES,
  PRICES,
  PCS_FEES,
  EKS_FEES,
  OPTIMIZER_ROWS,
  FP32_GRADIENT_BYTES,
  FROZEN_BASE_BYTES,
  E1_MEASURED_SBH,
  E3_FSDP2_PER_UNIT,
  DEFAULT_MFU,
  DEFAULT_HEADROOM,
  FAILURE_RATES,
  FSX_TIERS,
  FSX_CAPACITY_STEPS_GIB,
  S3_CONNECTOR_PART_BYTES,
  S3_PUT_PER_SECOND_PER_PREFIX,
};

describe('source pinning (task brief: arXiv with a version, GitHub with a tag or SHA)', () => {
  const sources = [...collectSources(SOURCES), ...collectSources(ALL_PRESETS)];

  it('collects every source in the presets', () => {
    expect(sources.length).toBeGreaterThan(40);
  });

  it('every arXiv URL carries a version', () => {
    for (const s of sources.filter((x) => x.url.includes('arxiv.org'))) {
      expect(s.url, s.label).toMatch(/arxiv\.org\/abs\/\d{4}\.\d{4,5}v\d+$/);
    }
  });

  it('every GitHub URL pins a 40-character SHA, never main or master', () => {
    for (const s of sources.filter((x) => x.url.includes('github.com'))) {
      expect(s.url, s.label).toMatch(/\/blob\/[0-9a-f]{40}\//);
      expect(s.url, s.label).not.toMatch(/\/(main|master)\//);
    }
  });

  it('every source has a label, an https URL and a tier from 0 to 3', () => {
    for (const s of sources) {
      expect(s.label.length, s.url).toBeGreaterThan(0);
      expect(s.url).toMatch(/^https:\/\//);
      expect([0, 1, 2, 3]).toContain(s.tier);
    }
  });

  it('every preset number carries a source with a URL and tier', () => {
    const numbers = collectSourcedNumbers(ALL_PRESETS, 'presets');
    expect(numbers.length).toBeGreaterThan(100);
    for (const n of numbers) {
      const source = n.source as Partial<Source> | undefined;
      expect(source?.url, n.path).toMatch(/^https:\/\//);
      expect([0, 1, 2, 3], n.path).toContain(source?.tier);
    }
  });

  it('Tier 0 rows point at research files pinned to the dive commit', () => {
    expect(SOURCES.e1.tier).toBe(0);
    expect(SOURCES.e1.url).toContain('b0194661bd4b1be854e3cbeaa0b53fa2dd7058b3');
    expect(SOURCES.e3.url).toContain('E3-spark-fsdp2-collectives.md');
  });
});

describe('01 W1: Llama 3.1 parameter counts', () => {
  it('01 W1: 8B, 70B and 405B totals match the Hugging Face safetensors counts exactly', () => {
    expect(DENSE_MODELS['llama-3.1-8b'].totalParameters.value).toBe(8_030_261_248);
    expect(DENSE_MODELS['llama-3.1-70b'].totalParameters.value).toBe(70_553_706_496);
    expect(DENSE_MODELS['llama-3.1-405b'].totalParameters.value).toBe(405_853_388_800);
  });

  it('01 W1: the per-layer formulas reproduce the total and matmul-only counts of all three sizes', () => {
    for (const preset of Object.values(DENSE_MODELS)) {
      const shape = shapeOf(preset);
      const counted = customLlamaShape({
        name: shape.name,
        layers: shape.layers,
        hidden: shape.hidden,
        ffn: shape.ffn,
        heads: shape.heads,
        kvHeads: shape.kvHeads,
        headDim: shape.headDim,
        vocab: shape.vocab,
      });
      expect(counted.totalParameters, shape.name).toBe(shape.totalParameters);
      expect(counted.matmulParameters, shape.name).toBe(shape.matmulParameters);
      expect(counted.embeddingParameters, shape.name).toBe(shape.vocab * shape.hidden);
    }
  });

  it('T01-2: the vocabulary is 128,256 entries and the head dimension 128', () => {
    const shape = shapeOf(DENSE_MODELS['llama-3.1-8b']);
    expect(shape.vocab).toBe(128_256);
    expect(shape.headDim).toBe(128);
    expect(shape.heads * shape.headDim).toBe(shape.hidden);
  });

  it('customLlamaShape throws a RangeError naming the field', () => {
    const base = { name: 'x', layers: 2, hidden: 64, ffn: 128, heads: 4, kvHeads: 2, headDim: 16, vocab: 100 };
    expect(() => customLlamaShape({ ...base, layers: 0 })).toThrow(/layers/);
    expect(() => customLlamaShape({ ...base, kvHeads: 3 })).toThrow(RangeError);
  });
});

describe('02 and T02-71: DeepSeek-V3 MoE preset', () => {
  it('T02-71, T01-26: 61 layers, 256 routed experts, top-8, 671B total and 37B activated', () => {
    expect(DEEPSEEK_V3.layers.value).toBe(61);
    expect(DEEPSEEK_V3.routedExperts.value).toBe(256);
    expect(DEEPSEEK_V3.topK.value).toBe(8);
    expect(DEEPSEEK_V3.totalParameters.value).toBe(671e9);
    expect(DEEPSEEK_V3.activatedParameters.value).toBe(37e9);
    expect(DEEPSEEK_V3.totalParameters.source.url).toBe('https://arxiv.org/abs/2412.19437v2');
  });
});

describe('05 section 3.1: instances and per-rank facts', () => {
  it('05 section 3.1 and T02-68: p5.48xlarge has 8 ranks, 80 GB capacity, 450 GB/s NVLink and 50 GB/s EFA per GPU', () => {
    const f = rankFacts(INSTANCES['p5.48xlarge']);
    expect(f.ranksPerInstance).toBe(8);
    // C02-7: AWS prints 80 GiB, NVIDIA 80 GB; the smaller in bytes is the capacity.
    expect(f.hbmPerRankBytes).toBe(80 * GB);
    expect(f.denseBf16TflopsPerRank).toBe(989.5);
    expect(f.scaleUpBytesPerSecondPerRank).toBe(450 * GB);
    expect(f.efaBytesPerSecondPerRank).toBe(50 * GB);
  });

  it('05 section 3.1: p5en.48xlarge carries 141 GiB (AWS) and 141 GB (NVIDIA), converted explicitly', () => {
    const figures = INSTANCES['p5en.48xlarge'].hbmPerAccelerator;
    expect(figures.map((f) => f.unit)).toEqual(['GiB', 'GB']);
    expect(memoryFigureBytes(figures[0])).toBe(141 * GiB);
    expect(rankFacts(INSTANCES['p5en.48xlarge']).hbmPerRankBytes).toBe(141 * GB);
  });

  it('T03-38: trn2.48xlarge has 16 chips, 64 ranks at LNC=2 and 24 GiB per rank', () => {
    const trn2 = INSTANCES['trn2.48xlarge'];
    const f = rankFacts(trn2);
    expect(trn2.acceleratorsPerInstance.value).toBe(16);
    expect(f.ranksPerInstance).toBe(64);
    expect(f.ranksPerAccelerator).toBe(4);
    expect(f.hbmPerRankBytes).toBe(24 * GiB);
    expect(f.denseBf16TflopsPerRank).toBeCloseTo(667 / 4, 9);
    expect(f.efaBytesPerSecondPerRank).toBeCloseTo(6.25 * GB, 0);
  });

  it('rankFacts throws a RangeError naming the instance when no row states ranks or scale-up', () => {
    expect(() => rankFacts(INSTANCES['p6e-gb200.36xlarge'])).toThrow(/instance/);
    expect(() => rankFacts(INSTANCES['trn1.32xlarge'])).toThrow(RangeError);
  });
});

describe('05 section 3.2 and wave2-aws: prices', () => {
  const find = (instance: string, path: string) => PRICES.find((p) => p.instance === instance && p.path === path);

  it('T05-20, T05-22: p5.48xlarge On-Demand $55.04 and Capacity Block $47.757 per instance-hour', () => {
    expect(find('p5.48xlarge', 'ec2OnDemand')?.usdPerUnitHour.value).toBe(55.04);
    expect(find('p5.48xlarge', 'capacityBlock')?.usdPerUnitHour.value).toBe(47.757);
  });

  it('W5-11: the Trn2 block rate is Ohio and the P6e-GB200 rate the Dallas Local Zone', () => {
    expect(find('trn2.48xlarge', 'capacityBlock')?.region).toBe('US East (Ohio)');
    const p6e = PRICES.filter((p) => p.instance === 'p6e-gb200.36xlarge');
    expect(p6e.length).toBe(2);
    for (const row of p6e) expect(row.region).toBe('US East (Dallas) Local Zone');
    expect(p6e.map((r) => r.acceleratorsPerUnit.value).sort((a, b) => a - b)).toEqual([36, 72]);
  });

  it('every price row carries a Region, a date and a source', () => {
    for (const row of PRICES) {
      expect(row.region.length).toBeGreaterThan(0);
      expect(row.date).toMatch(/^2026-10-3[01]$/);
      expect(row.usdPerUnitHour.value).toBeGreaterThan(0);
      expect(row.usdPerUnitHour.source.url).toMatch(/^https:\/\//);
    }
  });

  it('T06-35, T06-41: PCS limits 32, 512 and 2,048 instances; EKS Auto Mode on p5 $2.64192 per instance-hour', () => {
    expect([PCS_FEES.maxInstances.small.value, PCS_FEES.maxInstances.medium.value, PCS_FEES.maxInstances.large.value]).toEqual([
      32, 512, 2_048,
    ]);
    expect(EKS_FEES.autoModeUsdPerInstanceHour['p5.48xlarge']?.value).toBe(2.64192);
  });
});

describe('01 W2, wave2-step-maths W1-50, 03 W4: optimizer byte rows', () => {
  const total = (id: keyof typeof OPTIMIZER_ROWS) => {
    const r = OPTIMIZER_ROWS[id];
    return r.weightBytes + r.gradientBytes + r.masterBytes + r.stateBytes;
  };

  it('W1-50: Adam mixed 16, DeepSeek-style 14, 8-bit Adam 10, Muon 12, Adafactor without momentum 8 bytes per parameter', () => {
    expect(total('adamMixed')).toBe(16);
    expect(total('adamBf16MomentsFp32Grads')).toBe(14);
    expect(total('adam8bit')).toBe(10);
    expect(total('muon')).toBe(12);
    expect(total('adafactorNoMomentum')).toBe(8);
  });

  it('T03-17: FP32 main gradients make Adam 18 bytes per parameter', () => {
    const r = OPTIMIZER_ROWS.adamMixed;
    expect(r.weightBytes + FP32_GRADIENT_BYTES.value + r.masterBytes + r.stateBytes).toBe(18);
  });

  it('03 W4: frozen base 2 bytes (LoRA) and 0.5 bytes (4-bit QLoRA) per parameter', () => {
    expect(FROZEN_BASE_BYTES.lora.value).toBe(2);
    expect(FROZEN_BASE_BYTES.qlora4bit.value).toBe(0.5);
  });
});

describe('E1, E3, T04-7 and storage figures', () => {
  it('E1: 34.03 sbh fused, 41.03 eager, 2.00 under full recomputation (Tier 0)', () => {
    expect(E1_MEASURED_SBH.fusedSwiglu.value).toBe(34.03);
    expect(E1_MEASURED_SBH.eagerSwiglu.value).toBe(41.03);
    expect(E1_MEASURED_SBH.fullRecompute.value).toBe(2);
  });

  it('T04-7: failure-rate presets 2.34, 6.50 and 17.5 per thousand node-days', () => {
    expect([FAILURE_RATES.rsc2.value, FAILURE_RATES.rsc1.value, FAILURE_RATES.rsc1WorstMonth.value]).toEqual([2.34, 6.5, 17.5]);
  });

  it('T00-1, W4-21, U04-8: PERSISTENT-1000 at $0.600, sizes 1,200 then 2,400 GiB steps, 8 MiB parts', () => {
    expect(FSX_TIERS[1000].usdPerGbMonth.value).toBe(0.6);
    expect(FSX_TIERS[1000].mbpsPerTib.value).toBe(1_000);
    expect(FSX_CAPACITY_STEPS_GIB.first.value).toBe(1_200);
    expect(FSX_CAPACITY_STEPS_GIB.increment.value).toBe(2_400);
    expect(S3_CONNECTOR_PART_BYTES.value).toBe(8 * 2 ** 20);
  });

  it('defaults are labelled: MFU 0.40 is an assumption', () => {
    expect(DEFAULT_MFU.value).toBe(0.4);
    expect(DEFAULT_MFU.source.basis).toBe('assumption');
    expect(DEFAULT_HEADROOM.value).toBe(0.75);
  });
});

describe('input checks', () => {
  it('requirePositiveInteger throws a RangeError naming the field on zero, negative and fractional counts', () => {
    expect(() => requirePositiveInteger('accelerators', 0)).toThrow(/accelerators/);
    expect(() => requirePositiveInteger('accelerators', -8)).toThrow(RangeError);
    expect(() => requirePositiveInteger('accelerators', 2.5)).toThrow(RangeError);
    expect(() => requirePositiveInteger('accelerators', Number.NaN)).toThrow(RangeError);
  });

  it('requireUnitFraction accepts (0, 1] only', () => {
    expect(() => requireUnitFraction('mfu', 0)).toThrow(/mfu/);
    expect(() => requireUnitFraction('mfu', 1.01)).toThrow(RangeError);
    expect(() => requireUnitFraction('mfu', 1)).not.toThrow();
  });
});
