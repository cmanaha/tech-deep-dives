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

// The neuronx-cc stages as AWS names them on the NKI overview page ("How NKI
// works", Neuron 2.33.0): graph-level optimization in the XLA front end,
// loop-level optimization, hardware intrinsics mapping, and the back end that
// allocates memory and schedules instructions. NKI kernels skip the first
// three stages and enter at the back end. The input is either front end's
// graph: StableHLO from TorchNeuron, or an XLA graph from JAX NeuronX and the
// XLA build of torch-neuronx. Conventions mirror NvidiaCompilerStack: the
// default path is solid, the opt-in path dashed, and a legend sits below.

type Tone = 'blue' | 'green' | 'orange' | 'slate';

const tones: Record<Tone, { fill: string; stroke: string }> = {
  blue: { fill: '#f2f8fd', stroke: '#0972d3' },
  green: { fill: '#ecf7ec', stroke: '#037f0c' },
  orange: { fill: '#fdf3ec', stroke: '#ec7211' },
  slate: { fill: '#f4f4f4', stroke: '#414d5c' },
};

interface HandleSpec {
  id: string;
  type: 'source' | 'target';
  position: Position;
}

interface StackNodeData extends Record<string, unknown> {
  title: string;
  lines: string[];
  tone: Tone;
  width: number;
  handles: HandleSpec[];
}

interface FrameNodeData extends Record<string, unknown> {
  label: string;
  width: number;
  height: number;
}

type StackNodeType = Node<StackNodeData, 'stack'>;
type FrameNodeType = Node<FrameNodeData, 'frame'>;

// Each line is its own element: a "\n" inside a React Flow label collapses to
// a space, so multi-line labels need explicit blocks.
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
          style={{ opacity: 0, width: 6, height: 6, minWidth: 0, minHeight: 0, border: 0 }}
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

// The neuronx-cc boundary: a labelled panel drawn behind the four stages.
function FrameNode({ data }: NodeProps<FrameNodeType>) {
  return (
    <div
      style={{
        width: data.width,
        height: data.height,
        boxSizing: 'border-box',
        background: '#fafafa',
        border: '1.5px solid #879596',
        borderRadius: 10,
        fontFamily: 'sans-serif',
        textAlign: 'center',
        paddingTop: 8,
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 700, lineHeight: '18px', color: '#414d5c' }}>
        {data.label}
      </div>
    </div>
  );
}

const nodeTypes = { stack: StackNode, frame: FrameNode };

const W = 186; // node width
const COL = 216; // column pitch: W plus a 30-unit corridor
const x = (col: number) => col * COL;
const STAGE_Y = 200;
const OUT_Y = 350;

const h = (id: string, type: 'source' | 'target', position: Position): HandleSpec => ({
  id,
  type,
  position,
});

function stack(
  id: string,
  col: number,
  y: number,
  tone: Tone,
  title: string,
  lines: string[],
  handles: HandleSpec[]
): StackNodeType {
  return {
    id,
    type: 'stack',
    position: { x: x(col), y },
    data: { title, lines, tone, width: W, handles },
    draggable: false,
    selectable: false,
    focusable: false,
  };
}

const frame: FrameNodeType = {
  id: 'neuronx-cc',
  type: 'frame',
  position: { x: -16, y: 160 },
  data: { label: 'neuronx-cc, the Neuron Graph Compiler', width: x(3) + W + 32, height: 126 },
  draggable: false,
  selectable: false,
  focusable: false,
  zIndex: -1,
};

const stackNodes: StackNodeType[] = [
  stack('model', 0, 0, 'blue', 'PyTorch or JAX model', ['TorchNeuron: StableHLO;', 'JAX, torch-neuronx 2.9:', 'an XLA graph'], [
    h('out', 'source', Position.Bottom),
  ]),
  stack('nki', 3, 0, 'green', 'NKI kernel', ['Python, tile-level;', 'you place tiles in', 'SBUF and PSUM'], [
    h('out', 'source', Position.Bottom),
  ]),
  stack('s1', 0, STAGE_Y, 'blue', '1. Graph level', ['XLA front end:', 'operator fusion'], [
    h('in', 'target', Position.Top),
    h('out', 'source', Position.Right),
  ]),
  stack('s2', 1, STAGE_Y, 'blue', '2. Loop level', ['layout, tiling,', 'loop fusion'], [
    h('in', 'target', Position.Left),
    h('out', 'source', Position.Right),
  ]),
  stack('s3', 2, STAGE_Y, 'blue', '3. Intrinsics', ['loop nests become', 'hardware instructions'], [
    h('in', 'target', Position.Left),
    h('out', 'source', Position.Right),
  ]),
  stack('s4', 3, STAGE_Y, 'blue', '4. Back end', ['memory allocation,', 'instruction scheduling'], [
    h('in', 'target', Position.Left),
    h('nki', 'target', Position.Top),
    h('out', 'source', Position.Bottom),
  ]),
  stack('neff', 3, OUT_Y, 'orange', 'NEFF', ['the compiled program;', 'instruction order', 'fixed at compile time'], [
    h('in', 'target', Position.Top),
    h('out', 'source', Position.Left),
  ]),
  stack('runtime', 2, OUT_Y, 'slate', 'Neuron Runtime', ['loads the NEFF', 'and runs it on', 'NeuronCores'], [
    h('in', 'target', Position.Right),
  ]),
];

const nodes: Node[] = [frame, ...stackNodes];

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
    targetHandle?: string;
    label?: string;
    dashed?: boolean;
    width?: number;
    straight?: boolean;
  } = {}
): Edge {
  return {
    id,
    source,
    target,
    sourceHandle: 'out',
    targetHandle: opts.targetHandle ?? 'in',
    type: opts.straight ? 'straight' : 'smoothstep',
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
const slate = '#5f6b7a';

const edges: Edge[] = [
  edge('m-1', 'model', 's1', blue, { label: 'StableHLO or XLA graph' }),
  edge('1-2', 's1', 's2', blue),
  edge('2-3', 's2', 's3', blue),
  edge('3-4', 's3', 's4', blue),
  edge('k-4', 'nki', 's4', green, { targetHandle: 'nki', label: 'skips stages 1 to 3', dashed: true }),
  edge('4-n', 's4', 'neff', blue, { width: 3 }),
  edge('n-r', 'neff', 'runtime', slate, { straight: true }),
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

export function AwsCompilerStack() {
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <div role="img" aria-labelledby="aws-compiler-stack-title" style={{ position: 'relative' }}>
      <span
        id="aws-compiler-stack-title"
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          overflow: 'hidden',
          clip: 'rect(0 0 0 0)',
          whiteSpace: 'nowrap',
        }}
      >
        TorchNeuron hands neuronx-cc a StableHLO graph, and JAX NeuronX or the XLA build of
        torch-neuronx 2.9 hands it an XLA graph. With default settings neuronx-cc runs four stages
        in order: graph-level optimization with operator fusion, loop-level
        optimization with layout and tiling, mapping loop nests to hardware instructions, and a back
        end that allocates memory and schedules instructions. The back end emits the NEFF, whose
        instruction order is fixed at compile time, and the Neuron Runtime loads it and runs it on
        NeuronCores. A kernel written in NKI skips the first three stages and enters at the back
        end.
      </span>
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <div
          ref={containerRef}
          style={{
            width: '100%',
            minWidth: 800,
            height: 480,
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
          default path, no options set
        </span>
        <span style={{ display: 'inline-block' }}>
          {legendLine(green, true)}
          opt-in: a kernel you write in NKI
        </span>
      </Box>
    </div>
  );
}
