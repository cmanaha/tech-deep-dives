import React, { useEffect, useRef } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Node,
  NodeProps,
  Edge,
  Handle,
  MarkerType,
  Position,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// The three deliveries sit at the corners of a triangle with the functional unit at its
// centre. The layout is compact (about 290 x 290 units) so that fitView keeps the 11px
// subtitles legible at a 390px viewport instead of shrinking a wide layout to fit.

interface HandleSpec {
  id: string;
  type: 'source' | 'target';
  position: Position;
  /** Offset along the side, as a CSS length (e.g. '25%'). */
  offset?: string;
}

interface BoxData extends Record<string, unknown> {
  title: string;
  subtitle: string;
  fill: string;
  stroke: string;
  dark?: boolean;
  handles: HandleSpec[];
}

type BoxNode = Node<BoxData, 'box'>;

const hiddenHandle: React.CSSProperties = {
  opacity: 0,
  width: 6,
  height: 6,
  minWidth: 0,
  minHeight: 0,
  border: 'none',
};

function BoxNodeView({ data }: NodeProps<BoxNode>) {
  return (
    <div
      style={{
        width: '100%',
        boxSizing: 'border-box',
        background: data.fill,
        border: `2px solid ${data.stroke}`,
        borderRadius: 8,
        padding: '8px 8px',
        textAlign: 'center',
        fontFamily: 'sans-serif',
        color: data.dark ? '#ffffff' : '#16191f',
      }}
    >
      {data.handles.map((h) => (
        <Handle
          key={h.id}
          id={h.id}
          type={h.type}
          position={h.position}
          isConnectable={false}
          style={{ ...hiddenHandle, ...(h.offset ? { left: h.offset } : {}) }}
        />
      ))}
      <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>{data.title}</div>
      <div style={{ fontSize: 11, fontWeight: 400, lineHeight: 1.35, marginTop: 2 }}>
        {data.subtitle}
      </div>
    </div>
  );
}

const nodeTypes = { box: BoxNodeView };

const nodes: BoxNode[] = [
  {
    id: 'instruction',
    type: 'box',
    position: { x: 0, y: 0 },
    style: { width: 130 },
    draggable: false,
    data: {
      title: 'Instruction',
      subtitle: 'fetched, decoded and issued',
      fill: '#f2f8fd',
      stroke: '#0972d3',
      handles: [{ id: 'out', type: 'source', position: Position.Bottom }],
    },
  },
  {
    id: 'data',
    type: 'box',
    position: { x: 160, y: 0 },
    style: { width: 130 },
    draggable: false,
    data: {
      title: 'Data',
      subtitle: 'operands in the tier the unit reads',
      fill: '#ecf7ec',
      stroke: '#037f0c',
      handles: [{ id: 'out', type: 'source', position: Position.Bottom }],
    },
  },
  {
    id: 'unit',
    type: 'box',
    position: { x: 55, y: 118 },
    style: { width: 180 },
    draggable: false,
    data: {
      title: 'Functional unit',
      subtitle: 'executes when all three arrive',
      fill: '#232f3e',
      stroke: '#232f3e',
      dark: true,
      handles: [
        { id: 'in-i', type: 'target', position: Position.Top, offset: '20%' },
        { id: 'in-d', type: 'target', position: Position.Top, offset: '80%' },
        { id: 'in-s', type: 'target', position: Position.Bottom },
      ],
    },
  },
  {
    id: 'shape',
    type: 'box',
    position: { x: 55, y: 232 },
    style: { width: 180 },
    draggable: false,
    data: {
      title: 'Shape',
      subtitle: 'tile size, stride, alignment, precision',
      fill: '#fdf3ec',
      stroke: '#ec7211',
      handles: [{ id: 'out', type: 'source', position: Position.Top }],
    },
  },
];

const edgeBase = {
  type: 'smoothstep' as const,
  animated: true,
  markerEnd: { type: MarkerType.ArrowClosed, width: 14, height: 14 },
};

const edges: Edge[] = [
  {
    id: 'i-u',
    source: 'instruction',
    sourceHandle: 'out',
    target: 'unit',
    targetHandle: 'in-i',
    ...edgeBase,
    markerEnd: { ...edgeBase.markerEnd, color: '#0972d3' },
    style: { stroke: '#0972d3', strokeWidth: 2 },
  },
  {
    id: 'd-u',
    source: 'data',
    sourceHandle: 'out',
    target: 'unit',
    targetHandle: 'in-d',
    ...edgeBase,
    markerEnd: { ...edgeBase.markerEnd, color: '#037f0c' },
    style: { stroke: '#037f0c', strokeWidth: 2 },
  },
  {
    id: 's-u',
    source: 'shape',
    sourceHandle: 'out',
    target: 'unit',
    targetHandle: 'in-s',
    ...edgeBase,
    markerEnd: { ...edgeBase.markerEnd, color: '#ec7211' },
    style: { stroke: '#ec7211', strokeWidth: 2 },
  },
];

const FIT = { padding: 0.08, maxZoom: 1.3 };

// FitViewOnResize re-runs fitView when the container changes size. React Flow's own
// fitView fires once at mount; without this the nodes clip when the container shrinks.
function FitViewOnResize({ containerRef }: { containerRef: React.RefObject<HTMLDivElement> }) {
  const { fitView } = useReactFlow();
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(() => {
      requestAnimationFrame(() => fitView({ ...FIT, duration: 0 }));
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [containerRef, fitView]);
  return null;
}

export function TriangleDiagram() {
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={containerRef}
      role="img"
      aria-label="The instruction-data-shape triangle: an instruction, its operand data and the data's shape each have to reach the functional unit, and the unit executes only when all three arrive."
      style={{
        width: '100%',
        maxWidth: 440,
        aspectRatio: '1 / 1',
        margin: '0 auto',
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
          fitViewOptions={FIT}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          panOnScroll={false}
          panOnDrag={false}
          preventScrolling={false}
          proOptions={{ hideAttribution: true }}
        />
        <FitViewOnResize containerRef={containerRef} />
      </ReactFlowProvider>
    </div>
  );
}
