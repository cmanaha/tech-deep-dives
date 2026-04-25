import React, { useEffect, useRef } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Node,
  Edge,
  Background,
  MarkerType,
  Position,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const nodeStyle = (color: string, borderColor: string) => ({
  background: color,
  border: `2px solid ${borderColor}`,
  borderRadius: '8px',
  padding: '10px 14px',
  fontSize: '13px',
  fontWeight: 600,
  color: '#16191f',
  minWidth: '170px',
  textAlign: 'center' as const,
});

const nodes: Node[] = [
  {
    id: 'instruction',
    position: { x: 0, y: 40 },
    data: { label: 'Instruction\n(ISA, decode, issue)' },
    style: nodeStyle('#f2f8fd', '#0972d3'),
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: false,
  },
  {
    id: 'data',
    position: { x: 560, y: 40 },
    data: { label: 'Data\n(operands staged through\nthe memory hierarchy)' },
    style: nodeStyle('#ecf7ec', '#037f0c'),
    sourcePosition: Position.Left,
    targetPosition: Position.Right,
    draggable: false,
  },
  {
    id: 'shape',
    position: { x: 280, y: 320 },
    data: { label: 'Shape\n(tile size, precision,\nlayout, alignment)' },
    style: nodeStyle('#fdf3ec', '#ec7211'),
    sourcePosition: Position.Top,
    targetPosition: Position.Top,
    draggable: false,
  },
  {
    id: 'unit',
    position: { x: 280, y: 150 },
    data: { label: 'Functional Unit\nexecutes 1 FLOP\nthis clock' },
    style: {
      background: '#232f3e',
      border: '2px solid #232f3e',
      borderRadius: '12px',
      padding: '14px 18px',
      fontSize: '14px',
      fontWeight: 700,
      color: '#ffffff',
      minWidth: '180px',
      textAlign: 'center' as const,
    },
    targetPosition: Position.Left,
    draggable: false,
  },
];

const edgeBase = {
  type: 'smoothstep' as const,
  markerEnd: { type: MarkerType.ArrowClosed, width: 14, height: 14 },
  animated: true,
};

const edges: Edge[] = [
  {
    id: 'i-u',
    source: 'instruction',
    target: 'unit',
    ...edgeBase,
    style: { stroke: '#0972d3', strokeWidth: 2 },
    label: 'decoded + issued',
    labelStyle: { fill: '#0972d3', fontWeight: 600, fontSize: 11 },
  },
  {
    id: 'd-u',
    source: 'data',
    target: 'unit',
    ...edgeBase,
    style: { stroke: '#037f0c', strokeWidth: 2 },
    label: 'resident in register tier',
    labelStyle: { fill: '#037f0c', fontWeight: 600, fontSize: 11 },
  },
  {
    id: 's-u',
    source: 'shape',
    target: 'unit',
    ...edgeBase,
    style: { stroke: '#ec7211', strokeWidth: 2 },
    label: 'native layout',
    labelStyle: { fill: '#ec7211', fontWeight: 600, fontSize: 11 },
  },
];

// FitViewOnResize watches the container for size changes and re-runs fitView so the
// React Flow coordinate system stays inside the visible area on mobile. React Flow's
// own fitView only fires once at mount; without this hook the nodes clip off-screen
// when the container shrinks.
function FitViewOnResize({ containerRef }: { containerRef: React.RefObject<HTMLDivElement> }) {
  const { fitView } = useReactFlow();
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(() => {
      // Defer to allow React Flow internal layout to settle before fitting.
      requestAnimationFrame(() => fitView({ padding: 0.2, duration: 0 }));
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
      style={{ width: '100%', height: '440px', border: '1px solid #e9ebed', borderRadius: '8px' }}
    >
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          zoomOnScroll={false}
          panOnScroll={false}
          panOnDrag={false}
          proOptions={{ hideAttribution: true }}
        >
          <Background gap={20} size={1} color="#e9ebed" />
          <FitViewOnResize containerRef={containerRef} />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
