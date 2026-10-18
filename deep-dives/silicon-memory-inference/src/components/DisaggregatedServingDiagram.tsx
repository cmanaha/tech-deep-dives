import React from 'react';

// Disaggregated serving as a U-shaped flow: the router sends the prompt to the
// prefill pool, the KV cache crosses once to the decode pool, and decode streams
// tokens back. An inset inside the decode pool shows the second split NVIDIA
// ships on Vera Rubin with Groq 3 LPX (attention on GPUs, FFN and MoE on LPUs,
// activations every token). The diagram carries no figures; the section caption
// cites every source.
//
// On a phone the SVG keeps a 640 px minimum width and the wrapper scrolls.

const VB_W = 860;
const VB_H = 400;

export function DisaggregatedServingDiagram() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        role="img"
        aria-labelledby="disagg-flow-title"
        style={{ width: '100%', minWidth: 640, height: 'auto', display: 'block' }}
      >
        <title id="disagg-flow-title">
          Disaggregated serving runs prefill in a compute-bound pool sized for time to first token
          and decode in a memory-bound pool sized for time per output token. The KV cache crosses
          from prefill to decode once per request: through NIXL over NVLink or EFA on GPUs, and
          through the Neuron runtime over EFA on Trainium. On Vera Rubin with Groq 3 LPX, decode
          splits again: attention stays on Rubin GPUs, FFN and MoE layers run on LPUs, and
          activations cross between them every token.
        </title>
        <style>{`
          .dsd-bg { fill: #ffffff; }
          .dsd-t { fill: #16191f; font: 600 13px sans-serif; text-anchor: middle; }
          .dsd-s { fill: #414d5c; font: 11px sans-serif; text-anchor: middle; }
          .dsd-b { fill: #16191f; font: 600 11px sans-serif; text-anchor: middle; }
          .dsd-l { fill: #5f6b7a; font: 600 11px sans-serif; text-anchor: middle; }
          .dsd-n { fill: #5f6b7a; font: 10px sans-serif; text-anchor: middle; }
          .dsd-blue { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .dsd-pre { fill: #fdf3ec; stroke: #ec7211; stroke-width: 1.5; }
          .dsd-dec { fill: #e6f4f2; stroke: #1f7a70; stroke-width: 1.5; }
          .dsd-kv { fill: #ecf7ec; stroke: #037f0c; stroke-width: 1.5; }
          .dsd-inset { fill: #ffffff; stroke: #879596; stroke-width: 1.2; stroke-dasharray: 5 4; }
          .dsd-gpu { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.2; }
          .dsd-lpu { fill: #efe7fb; stroke: #6f4cc4; stroke-width: 1.2; }
          .dsd-arr { stroke: #5f6b7a; stroke-width: 1.5; fill: none; marker-end: url(#dsd-ah); }
          .dsd-kvarr { stroke: #037f0c; stroke-width: 2.5; fill: none; marker-end: url(#dsd-ahg); }
          .dsd-act { stroke: #6f4cc4; stroke-width: 1.5; fill: none; marker-start: url(#dsd-ahp); marker-end: url(#dsd-ahp); }
        `}</style>
        <defs>
          <marker id="dsd-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#5f6b7a" />
          </marker>
          <marker id="dsd-ahg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#037f0c" />
          </marker>
          <marker id="dsd-ahp" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#6f4cc4" />
          </marker>
        </defs>

        <rect className="dsd-bg" x="0" y="0" width={VB_W} height={VB_H} rx="8" />

        {/* Client */}
        <rect className="dsd-blue" x="16" y="150" width="140" height="62" rx="6" />
        <text className="dsd-t" x="86" y="176">Client</text>
        <text className="dsd-s" x="86" y="195">prompt in, tokens out</text>

        {/* Router */}
        <rect className="dsd-blue" x="186" y="144" width="140" height="74" rx="6" />
        <text className="dsd-t" x="256" y="168">Router</text>
        <text className="dsd-s" x="256" y="187">picks a prefill and</text>
        <text className="dsd-s" x="256" y="202">a decode worker</text>

        {/* Client <-> Router */}
        <path className="dsd-arr" d="M156,170 H184" />
        <path className="dsd-arr" d="M186,194 H158" />

        {/* Prefill pool */}
        <rect className="dsd-pre" x="372" y="24" width="236" height="104" rx="6" />
        <text className="dsd-t" x="490" y="48">Prefill pool</text>
        <text className="dsd-s" x="490" y="68">compute-bound: each weight read</text>
        <text className="dsd-s" x="490" y="84">serves every prompt token</text>
        <text className="dsd-s" x="490" y="108">sized for time to first token</text>

        {/* Router -> Prefill */}
        <path className="dsd-arr" d="M256,144 V76 H370" />
        <text className="dsd-l" x="312" y="68">prompt</text>

        {/* KV handoff */}
        <rect className="dsd-kv" x="652" y="40" width="192" height="236" rx="6" />
        <text className="dsd-t" x="748" y="66">KV cache handoff</text>
        <text className="dsd-s" x="748" y="88">once per request:</text>
        <text className="dsd-s" x="748" y="104">prompt tokens x</text>
        <text className="dsd-s" x="748" y="120">KV bytes per token</text>
        <text className="dsd-b" x="748" y="152">GPU</text>
        <text className="dsd-s" x="748" y="168">NIXL over NVLink,</text>
        <text className="dsd-s" x="748" y="184">or libfabric over EFA</text>
        <text className="dsd-b" x="748" y="216">Trainium</text>
        <text className="dsd-s" x="748" y="232">Neuron runtime over EFA,</text>
        <text className="dsd-s" x="748" y="248">zero copy</text>

        {/* Prefill -> KV -> Decode */}
        <path className="dsd-kvarr" d="M608,76 H650" />
        <path className="dsd-kvarr" d="M652,236 H610" />

        {/* Decode pool */}
        <rect className="dsd-dec" x="372" y="184" width="236" height="200" rx="6" />
        <text className="dsd-t" x="490" y="208">Decode pool</text>
        <text className="dsd-s" x="490" y="228">memory-bound: every weight read</text>
        <text className="dsd-s" x="490" y="244">serves one token per sequence</text>
        <text className="dsd-s" x="490" y="264">sized for time per output token</text>

        {/* Inset: attention-FFN split on Vera Rubin + Groq 3 LPX */}
        <rect className="dsd-inset" x="384" y="278" width="212" height="96" rx="6" />
        <text className="dsd-n" x="490" y="294">on Vera Rubin with Groq 3 LPX</text>
        <rect className="dsd-gpu" x="392" y="302" width="86" height="44" rx="4" />
        <text className="dsd-b" x="435" y="320">Attention</text>
        <text className="dsd-s" x="435" y="336">Rubin GPUs</text>
        <rect className="dsd-lpu" x="514" y="302" width="74" height="44" rx="4" />
        <text className="dsd-b" x="551" y="320">FFN, MoE</text>
        <text className="dsd-s" x="551" y="336">LPUs</text>
        <path className="dsd-act" d="M481,324 H511" />
        <text className="dsd-n" x="490" y="364">activations every token</text>

        {/* Decode -> Router */}
        <path className="dsd-arr" d="M372,300 H256 V220" />
        <text className="dsd-l" x="312" y="316">tokens</text>
      </svg>
    </div>
  );
}
