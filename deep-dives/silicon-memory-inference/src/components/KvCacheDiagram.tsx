import React from 'react';

// Left: the KV cache of one request, a K and a V tensor in every layer that grows by one
// entry per token, with the sizing formula. Right: how MHA, GQA, MQA and MLA shrink the
// KV-head term. The Llama 3.1 70B figures drawn here are cited in the section text below.
//
// On a phone the SVG keeps a 640 px minimum width and the wrapper scrolls sideways, so the
// 10 and 11 unit labels stay legible instead of shrinking to about 4 px.

const qHeads = Array.from({ length: 8 }, (_, i) => i);
const rowY = [104, 182, 260, 338];

export function KvCacheDiagram() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 880 460"
        role="img"
        aria-labelledby="kv-cache-layout-title"
        style={{ width: '100%', minWidth: 640, height: 'auto', display: 'block' }}
      >
        <title id="kv-cache-layout-title">
          The KV cache of one request holds a key tensor and a value tensor in every layer, and
          each grows by one entry per token, so its size is 2 x layers x sequence length x KV
          heads x head dimension x bytes per value. Attention variants shrink the KV-head term:
          multi-head attention keeps one KV head per query head, grouped-query attention shares
          one per group of four here (4x smaller), multi-query attention shares one across all
          query heads, and multi-head latent attention caches one compressed latent per token
          per layer instead of per-head keys and values.
        </title>
        <style>{`
          .kvd-bg { fill: #ffffff; stroke: #e9ebed; stroke-width: 1; }
          .kvd-left { fill: #f2f8fd; stroke: #0972d3; stroke-width: 2; }
          .kvd-right { fill: #ecf7ec; stroke: #037f0c; stroke-width: 2; }
          .kvd-layer { fill: #e1f0fb; stroke: #0972d3; stroke-width: 1.5; }
          .kvd-tensor { fill: #ffffff; stroke: #0972d3; stroke-width: 1; }
          .kvd-q { fill: #ec7211; }
          .kvd-kv { fill: #0972d3; }
          .kvd-lat { fill: #6f4cc4; }
          .kvd-title { fill: #16191f; font: 700 14px sans-serif; }
          .kvd-h-blue { fill: #0972d3; font: 700 13px sans-serif; }
          .kvd-h-green { fill: #037f0c; font: 700 13px sans-serif; }
          .kvd-sub { fill: #414d5c; font: 11px sans-serif; }
          .kvd-row { fill: #16191f; font: 700 12px sans-serif; }
          .kvd-desc { fill: #16191f; font: 11px sans-serif; }
          .kvd-layer-t { fill: #0972d3; font: 700 11px sans-serif; }
          .kvd-tensor-t { fill: #0972d3; font: 700 10px sans-serif; text-anchor: middle; }
          .kvd-count { fill: #414d5c; font: 10px sans-serif; }
          .kvd-in { fill: #ffffff; font: 700 10px sans-serif; text-anchor: middle; }
          .kvd-formula { fill: #16191f; font: italic 11px sans-serif; }
          .kvd-ex { fill: #065299; font: 700 11px sans-serif; }
        `}</style>

        <rect className="kvd-bg" x={0.5} y={0.5} width={879} height={459} rx={8} />
        <text className="kvd-title" x={20} y={28}>
          KV cache layout, and how attention variants shrink it
        </text>

        {/* Left: the KV cache of one request */}
        <rect className="kvd-left" x={20} y={46} width={410} height={400} rx={8} />
        <text className="kvd-h-blue" x={36} y={72}>
          KV cache per attention layer
        </text>
        <text className="kvd-sub" x={36} y={90}>
          K and V grow by one entry per token, per request
        </text>
        {['Layer 1', 'Layer 2', 'Layer 3', 'Layer L'].map((label, i) => {
          const y = 106 + i * 58;
          return (
            <g key={label}>
              <rect className="kvd-layer" x={36} y={y} width={378} height={48} rx={4} />
              <text className="kvd-layer-t" x={48} y={y + 28}>
                {label}
              </text>
              <rect className="kvd-tensor" x={104} y={y + 6} width={148} height={36} rx={3} />
              <text className="kvd-tensor-t" x={178} y={y + 28}>
                K [seq, kv_heads, dim]
              </text>
              <rect className="kvd-tensor" x={260} y={y + 6} width={148} height={36} rx={3} />
              <text className="kvd-tensor-t" x={334} y={y + 28}>
                V [seq, kv_heads, dim]
              </text>
            </g>
          );
        })}
        <text className="kvd-formula" x={36} y={358}>
          Size per request = 2 × layers × seq_len
        </text>
        <text className="kvd-formula" x={36} y={376}>
          × kv_heads × head_dim × bytes_per_value
        </text>
        <text className="kvd-ex" x={36} y={408}>
          Llama 3.1 70B at 2 bytes per value:
        </text>
        <text className="kvd-ex" x={36} y={426}>
          327,680 B per token, 2.68 GB per 8K-token request
        </text>

        {/* Right: attention variants */}
        <rect className="kvd-right" x={450} y={46} width={410} height={400} rx={8} />
        <text className="kvd-h-green" x={466} y={72}>
          Attention variants
        </text>
        <text className="kvd-sub" x={466} y={90}>
          Each row cuts kv_heads: 8, then 2 (4x smaller), then 1
        </text>

        {/* MHA */}
        <text className="kvd-row" x={466} y={rowY[0] + 14}>
          MHA: multi-head attention
        </text>
        <text className="kvd-desc" x={466} y={rowY[0] + 30}>
          Each query head has its own K and V head
        </text>
        {qHeads.map((i) => (
          <g key={`mha-${i}`}>
            <rect className="kvd-q" x={466 + i * 28} y={rowY[0] + 38} width={24} height={14} rx={2} />
            <rect className="kvd-kv" x={466 + i * 28} y={rowY[0] + 56} width={24} height={14} rx={2} />
          </g>
        ))}
        <text className="kvd-count" x={706} y={rowY[0] + 59}>
          8 Q, 8 KV
        </text>

        {/* GQA */}
        <text className="kvd-row" x={466} y={rowY[1] + 14}>
          GQA: grouped-query attention
        </text>
        <text className="kvd-desc" x={466} y={rowY[1] + 30}>
          Each group of 4 query heads shares one KV head
        </text>
        {qHeads.map((i) => (
          <rect key={`gqa-q-${i}`} className="kvd-q" x={466 + i * 28} y={rowY[1] + 38} width={24} height={14} rx={2} />
        ))}
        {[0, 1].map((i) => (
          <rect key={`gqa-kv-${i}`} className="kvd-kv" x={466 + i * 112} y={rowY[1] + 56} width={108} height={14} rx={2} />
        ))}
        <text className="kvd-count" x={706} y={rowY[1] + 59}>
          8 Q, 2 KV
        </text>

        {/* MQA */}
        <text className="kvd-row" x={466} y={rowY[2] + 14}>
          MQA: multi-query attention
        </text>
        <text className="kvd-desc" x={466} y={rowY[2] + 30}>
          All query heads share one KV head
        </text>
        {qHeads.map((i) => (
          <rect key={`mqa-q-${i}`} className="kvd-q" x={466 + i * 28} y={rowY[2] + 38} width={24} height={14} rx={2} />
        ))}
        <rect className="kvd-kv" x={466} y={rowY[2] + 56} width={220} height={14} rx={2} />
        <text className="kvd-count" x={706} y={rowY[2] + 59}>
          8 Q, 1 KV
        </text>

        {/* MLA */}
        <text className="kvd-row" x={466} y={rowY[3] + 14}>
          MLA: multi-head latent attention
        </text>
        <text className="kvd-desc" x={466} y={rowY[3] + 30}>
          One compressed latent per token; K and V rebuilt from it
        </text>
        {qHeads.map((i) => (
          <rect key={`mla-q-${i}`} className="kvd-q" x={466 + i * 28} y={rowY[3] + 38} width={24} height={14} rx={2} />
        ))}
        <rect className="kvd-lat" x={466} y={rowY[3] + 56} width={220} height={14} rx={2} />
        <text className="kvd-in" x={576} y={rowY[3] + 67}>
          latent
        </text>
        <text className="kvd-count" x={706} y={rowY[3] + 59}>
          8 Q, 1 latent
        </text>

        {/* Legend */}
        <rect className="kvd-q" x={466} y={424} width={12} height={10} rx={2} />
        <text className="kvd-count" x={484} y={433}>
          query head
        </text>
        <rect className="kvd-kv" x={566} y={424} width={12} height={10} rx={2} />
        <text className="kvd-count" x={584} y={433}>
          KV head
        </text>
        <rect className="kvd-lat" x={652} y={424} width={12} height={10} rx={2} />
        <text className="kvd-count" x={670} y={433}>
          compressed latent
        </text>
      </svg>
    </div>
  );
}
