import React, { useEffect, useRef, useState } from 'react';

// One MoE layer for one token. Inline SVG, Idiom A (class prefix moer-).
// Numbers drawn here (37B of 671B, 8 of 256) are cited in the section caption.
// Two layouts: a left-to-right flow for wide containers and a top-to-bottom
// flow for phones, chosen by container width.

const PICKED = new Set([2, 5]);
const NARROW_BELOW = 560;

const TITLE =
  "One MoE layer for one token. The router scores every routed expert and keeps the top k; only those experts and the always-on shared expert run, and the router's scores weight their outputs in the sum. The weights a token reads are attention plus the shared expert plus its k routed experts, so DeepSeek-V3 reads 37B of 671B parameters per token (5.5%), more than its routed fraction of 8 of 256 (3.1%).";

const STYLE = `
  .moer-bg { fill: #ffffff; stroke: #e9ebed; }
  .moer-tok { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
  .moer-rtr { fill: #fdf3ec; stroke: #ec7211; stroke-width: 1.5; }
  .moer-on { fill: #ecf7ec; stroke: #037f0c; stroke-width: 2; }
  .moer-off { fill: #f4f4f4; stroke: #aab7b8; stroke-width: 1.2; stroke-dasharray: 4 3; }
  .moer-shr { fill: #e6f4f2; stroke: #1f7a70; stroke-width: 2; }
  .moer-cmb { fill: #232f3e; stroke: #232f3e; }
  .moer-note { fill: #f8f9fa; stroke: #879596; stroke-width: 1; }
  .moer-t { fill: #16191f; font: 600 13px sans-serif; text-anchor: middle; }
  .moer-s { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
  .moer-e-on { fill: #1d5c14; font: 600 12px sans-serif; text-anchor: middle; }
  .moer-e-off { fill: #687078; font: 12px sans-serif; text-anchor: middle; }
  .moer-e-shr { fill: #1f5c55; font: 600 12px sans-serif; text-anchor: middle; }
  .moer-tw { fill: #ffffff; font: 600 13px sans-serif; text-anchor: middle; }
  .moer-sw { fill: #d1d5db; font: 11px sans-serif; text-anchor: middle; }
  .moer-nt { fill: #16191f; font: 600 12px sans-serif; }
  .moer-ns { fill: #414d5c; font: 11px sans-serif; }
  .moer-a { stroke: #0972d3; stroke-width: 1.5; fill: none; marker-end: url(#moer-ah-b); }
  .moer-a-on { stroke: #037f0c; stroke-width: 2; fill: none; marker-end: url(#moer-ah-g); }
  .moer-a-off { stroke: #aab7b8; stroke-width: 1; stroke-dasharray: 4 3; fill: none; }
  .moer-a-shr { stroke: #1f7a70; stroke-width: 2; fill: none; marker-end: url(#moer-ah-t); }
`;

function Defs() {
  const arrow = (id: string, color: string) => (
    <marker
      id={id}
      viewBox="0 0 10 10"
      refX="9"
      refY="5"
      markerWidth="7"
      markerHeight="7"
      orient="auto-start-reverse"
    >
      <path d="M0,0 L10,5 L0,10 z" fill={color} />
    </marker>
  );
  return (
    <defs>
      {arrow('moer-ah-b', '#0972d3')}
      {arrow('moer-ah-g', '#037f0c')}
      {arrow('moer-ah-t', '#1f7a70')}
    </defs>
  );
}

function Svg({ w, h, children }: { w: number; h: number; children: React.ReactNode }) {
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-labelledby="moe-routing-title"
      style={{ width: '100%', height: 'auto', display: 'block' }}
    >
      <title id="moe-routing-title">{TITLE}</title>
      <style>{STYLE}</style>
      <Defs />
      <rect className="moer-bg" x={0} y={0} width={w} height={h} rx={8} />
      {children}
    </svg>
  );
}

// Wide layout: token, router, expert column, weighted sum, left to right.
const EXPERT_X = 400;
const EXPERT_W = 176;
const EXPERT_H = 28;
const EXPERT_Y0 = 44;
const EXPERT_STEP = 34;
const ROUTER_OUT = { x: 326, y: 180 };
const COMBINE_IN_X = 614;
const SHARED_Y = EXPERT_Y0 + 8 * EXPERT_STEP + 6;
const SHARED_H = 40;

const wideExperts = Array.from({ length: 8 }, (_, i) => ({
  i,
  y: EXPERT_Y0 + i * EXPERT_STEP,
  picked: PICKED.has(i),
}));

function WideDiagram() {
  return (
    <Svg w={760} h={390}>
      <rect className="moer-tok" x={16} y={150} width={124} height={60} rx={6} />
      <text className="moer-t" x={78} y={176}>
        Token
      </text>
      <text className="moer-s" x={78} y={194}>
        activation
      </text>
      <line className="moer-a" x1={140} y1={180} x2={174} y2={180} />

      <rect className="moer-rtr" x={176} y={138} width={150} height={84} rx={6} />
      <text className="moer-t" x={251} y={162}>
        Router
      </text>
      <text className="moer-s" x={251} y={182}>
        scores every expert,
      </text>
      <text className="moer-s" x={251} y={198}>
        keeps the top k
      </text>

      <text className="moer-s" x={EXPERT_X + EXPERT_W / 2} y={30}>
        Routed experts (k = 2 of N = 8)
      </text>
      {wideExperts.map((e) => (
        <line
          key={`r${e.i}`}
          className={e.picked ? 'moer-a-on' : 'moer-a-off'}
          x1={ROUTER_OUT.x}
          y1={ROUTER_OUT.y}
          x2={EXPERT_X - 2}
          y2={e.y + EXPERT_H / 2}
        />
      ))}
      {wideExperts.map((e) => (
        <g key={`e${e.i}`}>
          <rect
            className={e.picked ? 'moer-on' : 'moer-off'}
            x={EXPERT_X}
            y={e.y}
            width={EXPERT_W}
            height={EXPERT_H}
            rx={5}
          />
          <text
            className={e.picked ? 'moer-e-on' : 'moer-e-off'}
            x={EXPERT_X + EXPERT_W / 2}
            y={e.y + 19}
          >
            {e.picked ? `Expert ${e.i + 1}: picked` : `Expert ${e.i + 1}`}
          </text>
        </g>
      ))}

      <line
        className="moer-a-shr"
        x1={ROUTER_OUT.x}
        y1={ROUTER_OUT.y + 8}
        x2={EXPERT_X - 2}
        y2={SHARED_Y + SHARED_H / 2}
      />
      <rect
        className="moer-shr"
        x={EXPERT_X}
        y={SHARED_Y}
        width={EXPERT_W}
        height={SHARED_H}
        rx={5}
      />
      <text className="moer-t" x={EXPERT_X + EXPERT_W / 2} y={SHARED_Y + 17}>
        Shared expert
      </text>
      <text className="moer-s" x={EXPERT_X + EXPERT_W / 2} y={SHARED_Y + 33}>
        runs for every token
      </text>

      {wideExperts
        .filter((e) => e.picked)
        .map((e, j) => (
          <line
            key={`c${e.i}`}
            className="moer-a-on"
            x1={EXPERT_X + EXPERT_W}
            y1={e.y + EXPERT_H / 2}
            x2={COMBINE_IN_X}
            y2={168 + j * 12}
          />
        ))}
      <line
        className="moer-a-shr"
        x1={EXPERT_X + EXPERT_W}
        y1={SHARED_Y + SHARED_H / 2}
        x2={COMBINE_IN_X}
        y2={196}
      />
      <rect className="moer-cmb" x={616} y={150} width={128} height={60} rx={6} />
      <text className="moer-tw" x={680} y={176}>
        Weighted sum
      </text>
      <text className="moer-sw" x={680} y={194}>
        by router scores
      </text>

      <rect className="moer-note" x={16} y={262} width={330} height={104} rx={6} />
      <text className="moer-nt" x={30} y={286}>
        Weights this token reads
      </text>
      <text className="moer-ns" x={30} y={306}>
        attention + shared expert + k routed experts
      </text>
      <text className="moer-ns" x={30} y={328}>
        DeepSeek-V3: 37B of 671B parameters (5.5%),
      </text>
      <text className="moer-ns" x={30} y={348}>
        while k / N alone is 8 of 256 (3.1%)
      </text>
    </Svg>
  );
}

// Narrow layout: token, router, a row of experts, weighted sum, top to bottom.
const NROW_Y = 170;
const NROW_H = 36;
const NBOX_W = 34;
const NBOX_STEP = 40;
const NSHARED_X = 16 + 7 * NBOX_STEP + NBOX_W + 14;
const NSHARED_W = 40;
const NROUTER_OUT = { x: 200, y: 126 };

const narrowExperts = Array.from({ length: 8 }, (_, i) => ({
  i,
  x: 16 + i * NBOX_STEP,
  picked: PICKED.has(i),
}));

function NarrowDiagram() {
  const pickedCx = narrowExperts.filter((e) => e.picked).map((e) => e.x + NBOX_W / 2);
  const sharedCx = NSHARED_X + NSHARED_W / 2;
  return (
    <Svg w={400} h={456}>
      <rect className="moer-tok" x={16} y={14} width={368} height={40} rx={6} />
      <text className="moer-t" x={200} y={39}>
        Token activation
      </text>
      <line className="moer-a" x1={200} y1={54} x2={200} y2={72} />

      <rect className="moer-rtr" x={16} y={74} width={368} height={52} rx={6} />
      <text className="moer-t" x={200} y={95}>
        Router
      </text>
      <text className="moer-s" x={200} y={114}>
        scores every expert, keeps the top k
      </text>

      {narrowExperts.map((e) => (
        <line
          key={`r${e.i}`}
          className={e.picked ? 'moer-a-on' : 'moer-a-off'}
          x1={NROUTER_OUT.x}
          y1={NROUTER_OUT.y}
          x2={e.x + NBOX_W / 2}
          y2={NROW_Y - 2}
        />
      ))}
      <line
        className="moer-a-shr"
        x1={NROUTER_OUT.x + 6}
        y1={NROUTER_OUT.y}
        x2={sharedCx}
        y2={NROW_Y - 2}
      />
      {narrowExperts.map((e) => (
        <g key={`e${e.i}`}>
          <rect
            className={e.picked ? 'moer-on' : 'moer-off'}
            x={e.x}
            y={NROW_Y}
            width={NBOX_W}
            height={NROW_H}
            rx={5}
          />
          <text
            className={e.picked ? 'moer-e-on' : 'moer-e-off'}
            x={e.x + NBOX_W / 2}
            y={NROW_Y + 23}
          >
            {`E${e.i + 1}`}
          </text>
        </g>
      ))}
      <rect
        className="moer-shr"
        x={NSHARED_X}
        y={NROW_Y}
        width={NSHARED_W}
        height={NROW_H}
        rx={5}
      />
      <text className="moer-e-shr" x={sharedCx} y={NROW_Y + 23}>
        S
      </text>

      {pickedCx.map((cx, j) => (
        <line
          key={`c${cx}`}
          className="moer-a-on"
          x1={cx}
          y1={NROW_Y + NROW_H}
          x2={176 + j * 24}
          y2={258}
        />
      ))}
      <line className="moer-a-shr" x1={sharedCx} y1={NROW_Y + NROW_H} x2={228} y2={258} />
      <rect className="moer-cmb" x={100} y={260} width={200} height={46} rx={6} />
      <text className="moer-tw" x={200} y={280}>
        Weighted sum
      </text>
      <text className="moer-sw" x={200} y={296}>
        by router scores
      </text>

      <rect className="moer-note" x={16} y={322} width={368} height={122} rx={6} />
      <text className="moer-nt" x={30} y={344}>
        Weights this token reads
      </text>
      <text className="moer-ns" x={30} y={364}>
        attention + shared expert + k routed experts
      </text>
      <text className="moer-ns" x={30} y={384}>
        DeepSeek-V3: 37B of 671B parameters (5.5%),
      </text>
      <text className="moer-ns" x={30} y={404}>
        while k / N alone is 8 of 256 (3.1%)
      </text>
      <text className="moer-ns" x={30} y={428}>
        Green: picked (k = 2 of N = 8). S: shared expert.
      </text>
    </Svg>
  );
}

/** Picks the phone layout when the container is narrower than NARROW_BELOW px. */
export function MoeRoutingDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => setNarrow(el.clientWidth < NARROW_BELOW));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref}>{narrow ? <NarrowDiagram /> : <WideDiagram />}</div>;
}
