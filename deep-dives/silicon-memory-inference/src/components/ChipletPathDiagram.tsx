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
  padding: '10px 12px',
  fontSize: '12px',
  fontWeight: 600,
  color: '#16191f',
  minWidth: '160px',
  textAlign: 'center' as const,
});

const nodes: Node[] = [
  {
    id: 'core',
    position: { x: 0, y: 100 },
    data: { label: 'Zen 5 core\n(L1D 48 KB, 4 cy)' },
    style: nodeStyle('#f2f8fd', '#0972d3'),
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: false,
  },
  {
    id: 'l2',
    position: { x: 200, y: 100 },
    data: { label: 'L2 — 1 MB / core\n~14 cycles' },
    style: nodeStyle('#f2f8fd', '#0972d3'),
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: false,
  },
  {
    id: 'l3',
    position: { x: 400, y: 100 },
    data: { label: 'L3 (CCD-local)\n32 MB / CCD, ~46 cy' },
    style: nodeStyle('#ecf7ec', '#037f0c'),
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: false,
  },
  {
    id: 'gmi',
    position: { x: 600, y: 100 },
    data: { label: 'GMI3-W link\n2 × 36 Gb/s, 64 B/cy' },
    style: nodeStyle('#fdf3ec', '#ec7211'),
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: false,
  },
  {
    id: 'iod',
    position: { x: 800, y: 100 },
    data: { label: 'IO die\nInfinity Fabric mesh' },
    style: nodeStyle('#fdf3ec', '#ec7211'),
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: false,
  },
  {
    id: 'umc',
    position: { x: 800, y: 240 },
    data: { label: 'UMC\nDDR5 controller' },
    style: nodeStyle('#fdf3ec', '#ec7211'),
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
    draggable: false,
  },
  {
    id: 'ddr',
    position: { x: 800, y: 360 },
    data: { label: 'DDR5-6400 channel\n50 GB/s' },
    style: nodeStyle('#fce7e7', '#d91515'),
    targetPosition: Position.Top,
    draggable: false,
  },
];

const edgeBase = {
  type: 'smoothstep' as const,
  markerEnd: { type: MarkerType.ArrowClosed, width: 12, height: 12 },
};

const edges: Edge[] = [
  { id: 'c-l2', source: 'core', target: 'l2', ...edgeBase, style: { stroke: '#0972d3', strokeWidth: 2 }, animated: true, label: '~1 ns' },
  { id: 'l2-l3', source: 'l2', target: 'l3', ...edgeBase, style: { stroke: '#0972d3', strokeWidth: 2 }, animated: true, label: '~3 ns' },
  { id: 'l3-gmi', source: 'l3', target: 'gmi', ...edgeBase, style: { stroke: '#037f0c', strokeWidth: 2 }, animated: true, label: '~10 ns' },
  { id: 'gmi-iod', source: 'gmi', target: 'iod', ...edgeBase, style: { stroke: '#ec7211', strokeWidth: 2 }, animated: true, label: '~20-40 ns' },
  { id: 'iod-umc', source: 'iod', target: 'umc', ...edgeBase, style: { stroke: '#ec7211', strokeWidth: 2 }, animated: true },
  { id: 'umc-ddr', source: 'umc', target: 'ddr', ...edgeBase, style: { stroke: '#d91515', strokeWidth: 2 }, animated: true, label: '~80-130 ns total' },
];

// FitViewOnResize watches the container for size changes and re-runs fitView so
// React Flow's coordinate system stays inside the visible area on mobile.
function FitViewOnResize({ containerRef }: { containerRef: React.RefObject<HTMLDivElement> }) {
  const { fitView } = useReactFlow();
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(() => {
      requestAnimationFrame(() => fitView({ padding: 0.15, duration: 0 }));
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [containerRef, fitView]);
  return null;
}

export function ChipletPathDiagram() {
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '460px', border: '1px solid #e9ebed', borderRadius: '8px' }}
    >
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          fitViewOptions={{ padding: 0.15 }}
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
