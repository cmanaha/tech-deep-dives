import React from 'react';

// Schematic of KV cache layout: per-layer per-head K and V tensors growing with sequence length.
// Right side compares MHA vs GQA vs MQA group sizing.

export function KvCacheDiagram() {
  const width = 880;
  const height = 380;
  const colW = (width - 60) / 2;

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="KV cache size grows with layers, sequence length, and head count; MHA, GQA, and MQA reduce KV head count progressively"
        style={{ border: '1px solid #e9ebed', borderRadius: '8px', background: '#ffffff' }}
      >
        <text x={20} y={24} fontSize={13} fontWeight={700} fill="#16191f">
          KV cache layout — and how attention variants shrink it
        </text>

        {/* Left: KV cache per layer schematic */}
        <rect x={20} y={50} width={colW} height={310} rx={8} fill="#f2f8fd" stroke="#0972d3" strokeWidth={2} />
        <text x={36} y={78} fontSize={13} fontWeight={700} fill="#0972d3">
          KV cache per attention layer
        </text>
        <text x={36} y={96} fontSize={11} fill="#687078">
          K and V tensors grow with sequence length per request
        </text>

        {/* Stacked layers */}
        {Array.from({ length: 4 }).map((_, i) => {
          const y = 116 + i * 56;
          return (
            <g key={`layer-${i}`}>
              <rect x={36} y={y} width={colW - 32} height={48} rx={4} fill="#e1f0fb" stroke="#0972d3" strokeWidth={1.5} />
              <text x={48} y={y + 18} fontSize={11} fontWeight={700} fill="#0972d3">
                {`Layer ${i + 1}`}
              </text>
              <rect x={120} y={y + 6} width={140} height={36} rx={3} fill="#ffffff" stroke="#0972d3" strokeWidth={1} />
              <text x={190} y={y + 28} fontSize={10} fontWeight={700} fill="#0972d3" textAnchor="middle">K [seq, kv_heads, dim]</text>
              <rect x={272} y={y + 6} width={140} height={36} rx={3} fill="#ffffff" stroke="#0972d3" strokeWidth={1} />
              <text x={342} y={y + 28} fontSize={10} fontWeight={700} fill="#0972d3" textAnchor="middle">V [seq, kv_heads, dim]</text>
            </g>
          );
        })}

        <text x={36} y={350} fontSize={11} fill="#687078" fontStyle="italic">
          Size = 2 · layers · seq_len · kv_heads · head_dim · bytes_per_value
        </text>

        {/* Right: attention variants */}
        <rect x={40 + colW} y={50} width={colW} height={310} rx={8} fill="#ecf7ec" stroke="#037f0c" strokeWidth={2} />
        <text x={56 + colW} y={78} fontSize={13} fontWeight={700} fill="#037f0c">
          Attention variants
        </text>
        <text x={56 + colW} y={96} fontSize={11} fill="#687078">
          Each row halves the KV cache by reducing kv_heads
        </text>

        {/* MHA */}
        <text x={56 + colW} y={130} fontSize={12} fontWeight={700} fill="#16191f">MHA — Multi-Head Attention</text>
        <text x={56 + colW} y={146} fontSize={11} fill="#16191f">Each query head has its own K and V head</text>
        {Array.from({ length: 8 }).map((_, i) => (
          <g key={`mha-${i}`}>
            <rect x={56 + colW + i * 28} y={154} width={24} height={20} rx={2} fill="#ec7211" />
            <rect x={56 + colW + i * 28} y={178} width={24} height={20} rx={2} fill="#0972d3" />
          </g>
        ))}
        <text x={56 + colW + 240} y={172} fontSize={10} fill="#687078">8 Q · 8 KV</text>

        {/* GQA */}
        <text x={56 + colW} y={222} fontSize={12} fontWeight={700} fill="#16191f">GQA — Grouped Query Attention</text>
        <text x={56 + colW} y={238} fontSize={11} fill="#16191f">Q heads grouped to share KV (4:1 here)</text>
        {Array.from({ length: 8 }).map((_, i) => (
          <rect key={`gqa-q-${i}`} x={56 + colW + i * 28} y={246} width={24} height={20} rx={2} fill="#ec7211" />
        ))}
        {Array.from({ length: 2 }).map((_, i) => (
          <rect key={`gqa-kv-${i}`} x={56 + colW + i * 112} y={270} width={108} height={20} rx={2} fill="#0972d3" />
        ))}
        <text x={56 + colW + 240} y={264} fontSize={10} fill="#687078">8 Q · 2 KV</text>

        {/* MQA */}
        <text x={56 + colW} y={310} fontSize={12} fontWeight={700} fill="#16191f">MQA — Multi-Query Attention</text>
        <text x={56 + colW} y={326} fontSize={11} fill="#16191f">All Q heads share one KV pair</text>
        {Array.from({ length: 8 }).map((_, i) => (
          <rect key={`mqa-q-${i}`} x={56 + colW + i * 28} y={334} width={24} height={16} rx={2} fill="#ec7211" />
        ))}
        <rect x={56 + colW} y={354} width={224} height={16} rx={2} fill="#0972d3" />
        <text x={56 + colW + 240} y={346} fontSize={10} fill="#687078">8 Q · 1 KV</text>
      </svg>
    </div>
  );
}
