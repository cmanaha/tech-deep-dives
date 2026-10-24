import React from 'react';

// How long each KV tier remembers a busy node's new prefixes, on a log time axis,
// against two reuse gaps with sources. Tier horizons are our arithmetic
// (research/2026-10-refresh/flash-cache-tier.md, rows R1 and R2) under the
// assumptions printed in the SVG; the tool-call range is NVIDIA's (R3) and the
// DeepSeek range places its words "a few hours to a few days" (R5) on the axis.
// The section caption carries the citations.
//
// On a phone the SVG keeps a 640 px minimum width and the wrapper scrolls.

const VB_W = 860;
const VB_H = 392;
const X0 = 60;
const X1 = 820;
const T_MAX = 604800; // one week in seconds

function xT(seconds: number): number {
  return X0 + (Math.log10(seconds) / Math.log10(T_MAX)) * (X1 - X0);
}

const TICKS = [
  { t: 1, label: '1 s' },
  { t: 10, label: '10 s' },
  { t: 60, label: '1 min' },
  { t: 600, label: '10 min' },
  { t: 3600, label: '1 h' },
  { t: 86400, label: '1 day' },
  { t: 604800, label: '1 week' },
];

const HBM_END = 105;
const DRAM_END = 105 + 176;
const FLASH_END = 105 + 176 + 3560;

const blue = '#0972d3';
const slate = '#414d5c';
const green = '#037f0c';

export function FlashMemoryClock() {
  const axisY = 300;
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        role="img"
        aria-labelledby="flash-clock-title"
        style={{ width: '100%', minWidth: 640, height: 'auto', display: 'block' }}
      >
        <title id="flash-clock-title">
          Under full prefill load, a p5en serving Llama 3.1 70B fills its HBM with new prefixes in
          about 105 seconds, host DRAM adds about 176 seconds, and the 30.4 TB instance store adds
          about an hour. Agent tool-call waits of 2 to 30 seconds fit the top two tiers; a disk
          cache that keeps prefixes for hours to days needs flash.
        </title>
        <style>{`
          .fmc-h { fill: #16191f; font: 600 13px sans-serif; }
          .fmc-in { fill: #ffffff; font: 600 12px sans-serif; }
          .fmc-out { fill: #16191f; font: 600 12px sans-serif; }
          .fmc-ev { fill: #16191f; font: 12px sans-serif; }
          .fmc-tick { fill: #414d5c; font: 12px sans-serif; }
          .fmc-note { fill: #5f6b7a; font: 11px sans-serif; }
        `}</style>
        <rect x="0" y="0" width={VB_W} height={VB_H} rx="8" fill="#ffffff" stroke="#e9ebed" />

        <text className="fmc-h" x="20" y="28">
          How long each tier holds a busy node&apos;s new prefixes
        </text>

        {/* Row 1: HBM alone */}
        <rect x={X0} y="44" width={xT(HBM_END) - X0} height="28" rx="3" fill={blue} />
        <text className="fmc-in" x={xT(HBM_END) - 8} y="63" textAnchor="end">
          HBM: about 105 s
        </text>

        {/* Row 2: HBM plus host DRAM */}
        <rect x={X0} y="84" width={xT(HBM_END) - X0} height="28" rx="3" fill={blue} opacity="0.35" />
        <rect x={xT(HBM_END)} y="84" width={xT(DRAM_END) - xT(HBM_END)} height="28" rx="3" fill={slate} />
        <text className="fmc-out" x={xT(DRAM_END) + 10} y="103">
          + host DRAM: about 176 s more
        </text>

        {/* Row 3: plus local flash */}
        <rect x={X0} y="124" width={xT(DRAM_END) - X0} height="28" rx="3" fill={slate} opacity="0.3" />
        <rect x={xT(DRAM_END)} y="124" width={xT(FLASH_END) - xT(DRAM_END)} height="28" rx="3" fill={green} />
        <text className="fmc-out" x={xT(FLASH_END) + 10} y="143">
          + instance store: about an hour
        </text>

        <line x1="20" y1="174" x2="840" y2="174" stroke="#d1d5db" strokeDasharray="5 4" />
        <text className="fmc-h" x="20" y="198">
          Reuse gaps seen in practice
        </text>

        {/* Agent tool-call waits, 2 to 30 s */}
        <line x1={xT(2)} y1="218" x2={xT(30)} y2="218" stroke="#ec7211" strokeWidth="4" />
        <line x1={xT(2)} y1="210" x2={xT(2)} y2="226" stroke="#ec7211" strokeWidth="2" />
        <line x1={xT(30)} y1="210" x2={xT(30)} y2="226" stroke="#ec7211" strokeWidth="2" />
        <text className="fmc-ev" x={(xT(2) + xT(30)) / 2} y="246" textAnchor="middle">
          Agent tool-call waits,
        </text>
        <text className="fmc-ev" x={(xT(2) + xT(30)) / 2} y="262" textAnchor="middle">
          2 to 30 s
        </text>

        {/* DeepSeek disk cache lifetime, a few hours to a few days */}
        <line
          x1={xT(10800)}
          y1="218"
          x2={xT(259200)}
          y2="218"
          stroke="#6f4cc4"
          strokeWidth="4"
          strokeDasharray="8 5"
        />
        <text className="fmc-ev" x={(xT(10800) + xT(259200)) / 2} y="246" textAnchor="middle">
          DeepSeek clears unused disk cache
        </text>
        <text className="fmc-ev" x={(xT(10800) + xT(259200)) / 2} y="262" textAnchor="middle">
          in &quot;a few hours to a few days&quot;
        </text>

        <line x1={X0} y1={axisY} x2={X1} y2={axisY} stroke="#414d5c" />
        {TICKS.map((k) => (
          <g key={k.t}>
            <line x1={xT(k.t)} y1={axisY} x2={xT(k.t)} y2={axisY + 6} stroke="#414d5c" />
            <text className="fmc-tick" x={xT(k.t)} y={axisY + 22} textAnchor="middle">
              {k.label}
            </text>
          </g>
        ))}

        <text className="fmc-note" x="20" y="352">
          Llama 3.1 70B with BF16 KV on a p5en (8x H200): about 900 GB of HBM, 1.5 TB of host DRAM and 30.4 TB of
        </text>
        <text className="fmc-note" x="20" y="368">
          instance store hold KV; new 8K prefixes at 50% MFU add about 26,000 tokens a second. Time axis is logarithmic.
        </text>
      </svg>
    </div>
  );
}
