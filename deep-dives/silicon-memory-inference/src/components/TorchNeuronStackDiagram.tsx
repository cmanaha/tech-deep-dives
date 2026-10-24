import React from 'react';

// TorchNeuron in one picture: a PyTorch program reaches the "neuron" device
// through the dispatcher, then takes one of two paths to neuronx-cc (eager:
// one NEFF per operator at -O1; torch.compile: one NEFF per graph at -O2).
// NKI kernels feed both paths as custom ops. The XLA path (JAX, and PyTorch
// 2.9 on Trn1 and Inf2) is the dashed grey lane on the left, into the same
// compiler. Every NEFF runs on the Neuron Runtime; torch.distributed takes the
// right-hand corridor to the c10d "neuron" backend. Every version and level
// drawn here is cited in the section prose around it.
//
// Idiom A (a <style> block), class and id prefix "tns-". On a phone the SVG
// keeps a 640 px minimum width and the wrapper scrolls sideways, the same
// convention as KvCacheDiagram.

const W = 900;
const H = 476;

// Lanes: x and width
const XLA = { x: 16, w: 144 };
const EAGER = { x: 182, w: 212 };
const NKI = { x: 422, w: 132 };
const COMP = { x: 582, w: 212 };
const mid = (l: { x: number; w: number }) => l.x + l.w / 2;

// Rows: y and height
const R1 = { y: 14, h: 44 }; // program
const R2 = { y: 80, h: 34 }; // dispatcher
const R3 = { y: 138, h: 80 }; // eager, NKI, torch.compile
const R4 = { y: 252, h: 32 }; // neuronx-cc
const R5 = { y: 306, h: 42 }; // NEFFs
const R6 = { y: 370, h: 32 }; // Neuron Runtime
const R7 = { y: 424, h: 38 }; // NeuronCores, c10d

const BAND_RIGHT = COMP.x + COMP.w; // 794: shared bands end here
const CORRIDOR_X = 852; // torch.distributed arrow

export function TorchNeuronStackDiagram() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-labelledby="tns-stack-title"
        style={{ width: '100%', minWidth: 640, height: 'auto', display: 'block' }}
      >
        <title id="tns-stack-title">
          On TorchNeuron a PyTorch program puts its model and tensors on the device neuron, and
          the PyTorch dispatcher hands each ATen operator to the Neuron backend registered through
          PrivateUse1. Eager mode lowers each operator to StableHLO and compiles it with neuronx-cc
          at -O1 into its own NEFF, cached by operator, shape and dtype. torch.compile captures an
          FX graph with TorchDynamo, generates forward and backward graphs with AOTAutograd, lowers
          them to StableHLO and compiles each at -O2 into one NEFF per graph. NKI kernels enter
          both paths as custom ops and compile into the graph&apos;s NEFF. JAX, and PyTorch 2.9 on
          Trn1 and Inf2 through the deprecated XLA build of torch-neuronx, reach the same
          neuronx-cc as an XLA graph. The Neuron Runtime loads every NEFF and runs it on the
          NeuronCores, and torch.distributed uses the c10d backend neuron, on collective cores
          inside a node and EFA (Elastic Fabric Adapter) between nodes.
        </title>
        <style>{`
          .tns-bg    { fill: #ffffff; stroke: #e9ebed; stroke-width: 1; }
          .tns-blue  { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .tns-green { fill: #ecf7ec; stroke: #037f0c; stroke-width: 1.5; stroke-dasharray: 6 4; }
          .tns-neff  { fill: #fdf3ec; stroke: #ec7211; stroke-width: 1.5; }
          .tns-cc    { fill: #fafafa; stroke: #879596; stroke-width: 1.5; }
          .tns-slate { fill: #f4f4f4; stroke: #414d5c; stroke-width: 1.5; }
          .tns-xla   { fill: #fafafa; stroke: #879596; stroke-width: 1.2; stroke-dasharray: 5 4; }
          .tns-t     { fill: #16191f; font: 600 13px sans-serif; text-anchor: middle; }
          .tns-s     { fill: #414d5c; font: 11px sans-serif; text-anchor: middle; }
          .tns-gt    { fill: #5f6b7a; font: 600 13px sans-serif; text-anchor: middle; }
          .tns-gs    { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .tns-lbl   { fill: #16191f; font: 600 11px sans-serif; }
          .tns-glbl  { fill: #5f6b7a; font: 600 11px sans-serif; }
          .tns-a-blue  { stroke: #0972d3; stroke-width: 1.5; fill: none; marker-end: url(#tns-ah-blue); }
          .tns-a-green { stroke: #037f0c; stroke-width: 1.5; fill: none; stroke-dasharray: 5 3; marker-end: url(#tns-ah-green); }
          .tns-a-grey  { stroke: #879596; stroke-width: 1.5; fill: none; stroke-dasharray: 5 4; marker-end: url(#tns-ah-grey); }
          .tns-a-slate { stroke: #5f6b7a; stroke-width: 1.5; fill: none; marker-end: url(#tns-ah-slate); }
        `}</style>
        <defs>
          {[
            ['tns-ah-blue', '#0972d3'],
            ['tns-ah-green', '#037f0c'],
            ['tns-ah-grey', '#879596'],
            ['tns-ah-slate', '#5f6b7a'],
          ].map(([id, color]) => (
            <marker
              key={id}
              id={id}
              markerWidth="8"
              markerHeight="8"
              refX="7"
              refY="4"
              orient="auto-start-reverse"
            >
              <path d="M0,0 L8,4 L0,8 Z" fill={color} />
            </marker>
          ))}
        </defs>

        <rect className="tns-bg" x={0.5} y={0.5} width={W - 1} height={H - 1} rx={8} />

        {/* Row 1: the PyTorch program, and the XLA lane's own source */}
        <rect className="tns-blue" x={EAGER.x} y={R1.y} width={884 - EAGER.x} height={R1.h} rx={8} />
        <text className="tns-t" x={(EAGER.x + 884) / 2} y={R1.y + 19}>
          PyTorch program: model and tensors on the device &quot;neuron&quot;
        </text>
        <text className="tns-s" x={(EAGER.x + 884) / 2} y={R1.y + 36}>
          .to(&quot;neuron&quot;), or torch.accelerator code unchanged
        </text>

        <rect className="tns-xla" x={XLA.x} y={R1.y} width={XLA.w} height={134} rx={8} />
        <text className="tns-gt" x={mid(XLA)} y={R1.y + 22}>
          XLA path
        </text>
        {['JAX NeuronX;', 'PyTorch 2.9 on', 'Trn1 and Inf2,', 'the deprecated', 'XLA build of', 'torch-neuronx'].map(
          (line, i) => (
            <text key={line} className="tns-gs" x={mid(XLA)} y={R1.y + 42 + i * 16}>
              {line}
            </text>
          )
        )}

        {/* Row 2: dispatcher */}
        <line className="tns-a-blue" x1={488} y1={R1.y + R1.h} x2={488} y2={R2.y} />
        <rect className="tns-blue" x={EAGER.x} y={R2.y} width={BAND_RIGHT - EAGER.x} height={R2.h} rx={8} />
        <text className="tns-t" x={(EAGER.x + BAND_RIGHT) / 2} y={R2.y + 22}>
          PyTorch dispatcher routes ATen ops to the Neuron backend (PrivateUse1)
        </text>

        {/* Row 3: eager, NKI, torch.compile */}
        <line className="tns-a-blue" x1={mid(EAGER)} y1={R2.y + R2.h} x2={mid(EAGER)} y2={R3.y} />
        <line className="tns-a-blue" x1={mid(COMP)} y1={R2.y + R2.h} x2={mid(COMP)} y2={R3.y} />

        <rect className="tns-blue" x={EAGER.x} y={R3.y} width={EAGER.w} height={R3.h} rx={8} />
        <text className="tns-t" x={mid(EAGER)} y={R3.y + 21}>
          Eager mode
        </text>
        {['one ATen op at a time,', 'lowered to StableHLO,', 'compiled on first use'].map((line, i) => (
          <text key={line} className="tns-s" x={mid(EAGER)} y={R3.y + 39 + i * 15}>
            {line}
          </text>
        ))}

        <rect className="tns-green" x={NKI.x} y={R3.y} width={NKI.w} height={R3.h} rx={8} />
        <text className="tns-t" x={mid(NKI)} y={R3.y + 21}>
          NKI kernel
        </text>
        {['nki_op custom op,', 'or a plain', '@nki.jit call'].map((line, i) => (
          <text key={line} className="tns-s" x={mid(NKI)} y={R3.y + 39 + i * 15}>
            {line}
          </text>
        ))}
        <line className="tns-a-green" x1={NKI.x} y1={R3.y + 40} x2={EAGER.x + EAGER.w} y2={R3.y + 40} />
        <line className="tns-a-green" x1={NKI.x + NKI.w} y1={R3.y + 40} x2={COMP.x} y2={R3.y + 40} />

        <rect className="tns-blue" x={COMP.x} y={R3.y} width={COMP.w} height={R3.h} rx={8} />
        <text className="tns-t" x={mid(COMP)} y={R3.y + 21}>
          torch.compile
        </text>
        {['Dynamo captures FX graph,', 'AOTAutograd: fwd + bwd,', 'lowered to StableHLO'].map((line, i) => (
          <text key={line} className="tns-s" x={mid(COMP)} y={R3.y + 39 + i * 15}>
            {line}
          </text>
        ))}

        {/* Row 4: neuronx-cc, shared by every lane */}
        <line className="tns-a-grey" x1={mid(XLA)} y1={R1.y + 134} x2={mid(XLA)} y2={R4.y} />
        <text className="tns-glbl" x={mid(XLA) + 9} y={208}>
          XLA graph
        </text>
        <line className="tns-a-blue" x1={mid(EAGER)} y1={R3.y + R3.h} x2={mid(EAGER)} y2={R4.y} />
        <text className="tns-lbl" x={mid(EAGER) + 9} y={R3.y + R3.h + 21}>
          -O1
        </text>
        <line className="tns-a-blue" x1={mid(COMP)} y1={R3.y + R3.h} x2={mid(COMP)} y2={R4.y} />
        <text className="tns-lbl" x={mid(COMP) + 9} y={R3.y + R3.h + 21}>
          -O2
        </text>

        <rect className="tns-cc" x={XLA.x} y={R4.y} width={BAND_RIGHT - XLA.x} height={R4.h} rx={8} />
        <text className="tns-t" x={488} y={R4.y + 21}>
          neuronx-cc, the Neuron Graph Compiler
        </text>

        {/* Row 5: NEFFs */}
        <line className="tns-a-grey" x1={mid(XLA)} y1={R4.y + R4.h} x2={mid(XLA)} y2={R5.y} />
        <line className="tns-a-blue" x1={mid(EAGER)} y1={R4.y + R4.h} x2={mid(EAGER)} y2={R5.y} />
        <line className="tns-a-blue" x1={mid(COMP)} y1={R4.y + R4.h} x2={mid(COMP)} y2={R5.y} />

        <rect className="tns-xla" x={XLA.x} y={R5.y} width={XLA.w} height={R5.h} rx={8} />
        <text className="tns-gt" x={mid(XLA)} y={R5.y + 19}>
          NEFF
        </text>
        <text className="tns-gs" x={mid(XLA)} y={R5.y + 35}>
          from the XLA graph
        </text>

        <rect className="tns-neff" x={EAGER.x} y={R5.y} width={EAGER.w} height={R5.h} rx={8} />
        <text className="tns-t" x={mid(EAGER)} y={R5.y + 19}>
          One NEFF per op
        </text>
        <text className="tns-s" x={mid(EAGER)} y={R5.y + 35}>
          cached by op, shape, dtype
        </text>

        <rect className="tns-neff" x={COMP.x} y={R5.y} width={COMP.w} height={R5.h} rx={8} />
        <text className="tns-t" x={mid(COMP)} y={R5.y + 19}>
          One NEFF per graph
        </text>
        <text className="tns-s" x={mid(COMP)} y={R5.y + 35}>
          NKI kernels compile into it
        </text>

        {/* Row 6: Neuron Runtime */}
        <line className="tns-a-grey" x1={mid(XLA)} y1={R5.y + R5.h} x2={mid(XLA)} y2={R6.y} />
        <line className="tns-a-slate" x1={mid(EAGER)} y1={R5.y + R5.h} x2={mid(EAGER)} y2={R6.y} />
        <line className="tns-a-slate" x1={mid(COMP)} y1={R5.y + R5.h} x2={mid(COMP)} y2={R6.y} />
        <rect className="tns-slate" x={XLA.x} y={R6.y} width={BAND_RIGHT - XLA.x} height={R6.h} rx={8} />
        <text className="tns-t" x={488} y={R6.y + 21}>
          Neuron Runtime loads each NEFF and runs it
        </text>

        {/* Row 7: NeuronCores, and the c10d backend reached down the right corridor */}
        <line className="tns-a-slate" x1={mid(EAGER)} y1={R6.y + R6.h} x2={mid(EAGER)} y2={R7.y} />
        <rect className="tns-slate" x={XLA.x} y={R7.y} width={NKI.x + NKI.w - XLA.x} height={R7.h} rx={8} />
        <text className="tns-t" x={(XLA.x + NKI.x + NKI.w) / 2} y={R7.y + 24}>
          NeuronCores
        </text>

        <line className="tns-a-slate" x1={CORRIDOR_X} y1={R1.y + R1.h} x2={CORRIDOR_X} y2={R7.y} />
        <rect className="tns-slate" x={COMP.x} y={R7.y} width={884 - COMP.x} height={R7.h} rx={8} />
        <text className="tns-t" x={(COMP.x + 884) / 2} y={R7.y + 16}>
          torch.distributed: c10d &quot;neuron&quot;
        </text>
        <text className="tns-s" x={(COMP.x + 884) / 2} y={R7.y + 31}>
          collective cores in a node, EFA between nodes
        </text>
      </svg>
    </div>
  );
}
