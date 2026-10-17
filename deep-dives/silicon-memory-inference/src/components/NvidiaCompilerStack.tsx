import React, { useEffect, useRef } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Node,
  NodeProps,
  Edge,
  Handle,
  Background,
  MarkerType,
  Position,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import Box from '@cloudscape-design/components/box';

// Lowering paths from a PyTorch model to SASS. The Inductor routing follows the
// PyTorch v2.14.1 source (torch/_inductor/utils.py, kernel/mm.py): matmuls go to
// ATen (cuBLAS / cuBLASLt) by default, Triton GEMM templates join only under
// max-autotune, and CUTLASS / CuTe DSL also need their name in
// max_autotune_gemm_backends. Prebuilt libraries and CUDA Tile reach SASS
// without the PTX -> ptxas step drawn here.

type Tone = 'blue' | 'green' | 'amber' | 'teal' | 'orange' | 'slate';

const tones: Record<Tone, { fill: string; stroke: string }> = {
  blue: { fill: '#f2f8fd', stroke: '#0972d3' },
  green: { fill: '#ecf7ec', stroke: '#037f0c' },
  amber: { fill: '#fbf3d5', stroke: '#8b6c00' },
  teal: { fill: '#e6f4f2', stroke: '#1f7a70' },
  orange: { fill: '#fdf3ec', stroke: '#ec7211' },
  slate: { fill: '#f4f4f4', stroke: '#414d5c' },
};

interface HandleSpec {
  id: string;
  type: 'source' | 'target';
  position: Position;
  /** Offset along the node edge, as a CSS percentage; default is the centre. */
  at?: string;
}

interface StackNodeData extends Record<string, unknown> {
  title: string;
  lines: string[];
  tone: Tone;
  width: number;
  handles: HandleSpec[];
}

type StackNodeType = Node<StackNodeData, 'stack'>;

// Each line is its own element: a "\n" inside a React Flow label collapses to
// a space, so two-line labels need explicit blocks.
function StackNode({ data }: NodeProps<StackNodeType>) {
  const tone = tones[data.tone];
  return (
    <div
      style={{
        width: data.width,
        boxSizing: 'border-box',
        background: tone.fill,
        border: `2px solid ${tone.stroke}`,
        borderRadius: 8,
        padding: '8px 10px',
        textAlign: 'center',
        fontFamily: 'sans-serif',
        color: '#16191f',
      }}
    >
      {data.handles.map((h) => (
        <Handle
          key={h.id}
          id={h.id}
          type={h.type}
          position={h.position}
          isConnectable={false}
          style={{
            opacity: 0,
            width: 6,
            height: 6,
            minWidth: 0,
            minHeight: 0,
            border: 0,
            ...(h.at ? { left: h.at } : {}),
          }}
        />
      ))}
      <div style={{ fontSize: 14, fontWeight: 700, lineHeight: '18px' }}>{data.title}</div>
      {data.lines.map((line) => (
        <div key={line} style={{ fontSize: 13, lineHeight: '17px', color: '#414d5c' }}>
          {line}
        </div>
      ))}
    </div>
  );
}

const nodeTypes = { stack: StackNode };

const COL = 216; // column pitch: 176 wide nodes plus a 40-unit corridor
const W = 176;
const MID = (COL + 2 * COL) / 2 + W / 2; // centre line between the Triton and CUTLASS columns

const top = (id: string): HandleSpec => ({ id, type: 'target', position: Position.Top });
const bottom = (id: string): HandleSpec => ({ id, type: 'source', position: Position.Bottom });

function stack(
  id: string,
  x: number,
  y: number,
  width: number,
  tone: Tone,
  title: string,
  lines: string[],
  handles: HandleSpec[]
): StackNodeType {
  return {
    id,
    type: 'stack',
    position: { x, y },
    data: { title, lines, tone, width, handles },
    draggable: false,
    selectable: false,
    focusable: false,
  };
}

const nodes: StackNodeType[] = [
  stack('pytorch', MID - 120, 0, 240, 'blue', 'PyTorch model', ['torch.compile(model)'], [
    bottom('out'),
  ]),
  // Three source handles keep the three Inductor routes apart instead of
  // stacking them on one trunk.
  stack('inductor', MID - 120, 100, 240, 'blue', 'TorchInductor', ["torch.compile's default backend"], [
    top('in'),
    { id: 'to-cublas', type: 'source', position: Position.Bottom, at: '25%' },
    { id: 'out', type: 'source', position: Position.Bottom },
    { id: 'to-cutlass', type: 'source', position: Position.Bottom, at: '75%' },
  ]),
  stack('cublas', 0, 236, W, 'blue', 'cuBLAS / cuBLASLt', ['prebuilt kernels,', 'called through ATen'], [
    top('in'),
    bottom('out'),
  ]),
  stack('triton', COL, 236, W, 'green', 'Triton / Gluon', ['fused ops; GEMM', 'templates only under', 'max-autotune'], [
    top('in'),
    bottom('out'),
  ]),
  stack('cutlass', 2 * COL, 236, W, 'amber', 'CUTLASS / CuTe DSL', ['GEMM templates,', 'opt-in only'], [
    top('in'),
    bottom('out'),
  ]),
  stack('cutile', 3 * COL, 236, W, 'teal', 'cuTile / Tile C++', ['hand-written tile', 'kernels, compiled', 'by tileiras'], [
    bottom('out'),
  ]),
  stack('ptx', MID - W / 2, 400, W, 'orange', 'PTX', ['virtual instruction set'], [top('in'), bottom('out')]),
  stack('sass', MID - 160, 516, 320, 'slate', 'SASS in a cubin', ['machine code for one GPU architecture'], [
    top('in'),
    { id: 'left', type: 'target', position: Position.Left },
    { id: 'right', type: 'target', position: Position.Right },
  ]),
];

const arrow = (color: string) => ({ type: MarkerType.ArrowClosed, width: 14, height: 14, color });

const labelProps = {
  labelStyle: { fontSize: 12, fontWeight: 600, fill: '#16191f', fontFamily: 'sans-serif' },
  labelBgStyle: { fill: '#ffffff' },
  labelBgPadding: [4, 2] as [number, number],
  labelBgBorderRadius: 3,
};

function edge(
  id: string,
  source: string,
  target: string,
  color: string,
  opts: {
    sourceHandle?: string;
    targetHandle?: string;
    label?: string;
    dashed?: boolean;
    width?: number;
    step?: number;
  } = {}
): Edge {
  return {
    id,
    source,
    target,
    sourceHandle: opts.sourceHandle ?? 'out',
    targetHandle: opts.targetHandle ?? 'in',
    type: 'smoothstep',
    ...(opts.step !== undefined ? { pathOptions: { stepPosition: opts.step } } : {}),
    markerEnd: arrow(color),
    style: {
      stroke: color,
      strokeWidth: opts.width ?? 2,
      strokeDasharray: opts.dashed ? '6 4' : undefined,
    },
    focusable: false,
    selectable: false,
    ...(opts.label ? { label: opts.label, ...labelProps } : {}),
  };
}

const blue = '#0972d3';
const green = '#037f0c';
const amber = '#8b6c00';
const slate = '#5f6b7a';

const edges: Edge[] = [
  edge('p-i', 'pytorch', 'inductor', blue),
  edge('i-b', 'inductor', 'cublas', blue, {
    sourceHandle: 'to-cublas',
    label: 'matmul (default)',
    step: 0.2,
  }),
  edge('i-t', 'inductor', 'triton', green, { label: 'fused ops (default)', step: 0.8 }),
  edge('i-c', 'inductor', 'cutlass', amber, {
    sourceHandle: 'to-cutlass',
    label: 'opt-in',
    dashed: true,
    step: 0.5,
  }),
  edge('t-p', 'triton', 'ptx', slate),
  edge('c-p', 'cutlass', 'ptx', slate),
  edge('p-s', 'ptx', 'sass', slate, { label: 'ptxas', width: 3 }),
  edge('b-s', 'cublas', 'sass', slate, { targetHandle: 'left' }),
  edge('k-s', 'cutile', 'sass', slate, { targetHandle: 'right' }),
];

// FitViewOnResize re-runs fitView when the container changes size, so the
// graph stays inside the visible area.
function FitViewOnResize({ containerRef }: { containerRef: React.RefObject<HTMLDivElement> }) {
  const { fitView } = useReactFlow();
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(() => {
      requestAnimationFrame(() => fitView({ padding: 0.05, maxZoom: 1.1, duration: 0 }));
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [containerRef, fitView]);
  return null;
}

const legendLine = (color: string, dashed: boolean) => (
  <span
    aria-hidden="true"
    style={{
      display: 'inline-block',
      width: 28,
      height: 0,
      borderTop: `2px ${dashed ? 'dashed' : 'solid'} ${color}`,
      verticalAlign: 'middle',
      marginRight: 6,
    }}
  />
);

export function NvidiaCompilerStack() {
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <div role="img" aria-labelledby="nvidia-compiler-stack-title" style={{ position: 'relative' }}>
      <span
        id="nvidia-compiler-stack-title"
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          overflow: 'hidden',
          clip: 'rect(0 0 0 0)',
          whiteSpace: 'nowrap',
        }}
      >
        With default settings, torch.compile hands the model to TorchInductor, which generates Triton
        kernels for fused operations and sends matrix multiplies to cuBLAS or cuBLASLt through ATen.
        CUTLASS and CuTe DSL GEMM templates join only when you opt in with max-autotune and a backend
        list. Triton and CUTLASS kernels become PTX that ptxas assembles into SASS; cuBLAS ships
        prebuilt kernels, and cuTile kernels are compiled by tileiras.
      </span>
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <div
          ref={containerRef}
          style={{
            width: '100%',
            minWidth: 760,
            height: 560,
            boxSizing: 'border-box',
            background: '#ffffff',
            border: '1px solid #e9ebed',
            borderRadius: 8,
          }}
        >
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.05, maxZoom: 1.1 }}
              minZoom={0.3}
              nodesDraggable={false}
              nodesConnectable={false}
              nodesFocusable={false}
              edgesFocusable={false}
              elementsSelectable={false}
              zoomOnScroll={false}
              zoomOnPinch={false}
              zoomOnDoubleClick={false}
              panOnScroll={false}
              panOnDrag={false}
              preventScrolling={false}
              proOptions={{ hideAttribution: true }}
            >
              <Background gap={20} size={1} color="#e9ebed" />
              <FitViewOnResize containerRef={containerRef} />
            </ReactFlow>
          </ReactFlowProvider>
        </div>
      </div>
      <Box variant="small" color="text-body-secondary" margin={{ top: 'xs' }}>
        <span style={{ display: 'inline-block', marginRight: 20 }}>
          {legendLine(blue, false)}
          default, no options set
        </span>
        <span style={{ display: 'inline-block' }}>
          {legendLine(amber, true)}
          opt-in: max-autotune plus the backend list
        </span>
      </Box>
    </div>
  );
}
