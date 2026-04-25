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

const expertActiveStyle = {
  background: '#ecf7ec',
  border: '2px solid #037f0c',
  borderRadius: '8px',
  padding: '8px 12px',
  fontSize: '12px',
  fontWeight: 700,
  color: '#16191f',
  minWidth: '110px',
  textAlign: 'center' as const,
};
const expertIdleStyle = {
  background: '#f4f4f4',
  border: '2px dashed #aab7b8',
  borderRadius: '8px',
  padding: '8px 12px',
  fontSize: '12px',
  fontWeight: 600,
  color: '#687078',
  minWidth: '110px',
  textAlign: 'center' as const,
};
const tokenStyle = {
  background: '#f2f8fd',
  border: '2px solid #0972d3',
  borderRadius: '8px',
  padding: '10px 14px',
  fontSize: '13px',
  fontWeight: 700,
  color: '#16191f',
  minWidth: '150px',
  textAlign: 'center' as const,
};
const routerStyle = {
  background: '#fdf3ec',
  border: '2px solid #ec7211',
  borderRadius: '8px',
  padding: '10px 14px',
  fontSize: '13px',
  fontWeight: 700,
  color: '#16191f',
  minWidth: '150px',
  textAlign: 'center' as const,
};
const combineStyle = {
  background: '#232f3e',
  border: '2px solid #232f3e',
  borderRadius: '8px',
  padding: '10px 14px',
  fontSize: '13px',
  fontWeight: 700,
  color: '#ffffff',
  minWidth: '150px',
  textAlign: 'center' as const,
};

const nodes: Node[] = [
  {
    id: 'token',
    position: { x: 0, y: 200 },
    data: { label: 'Input token\nactivation' },
    style: tokenStyle,
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: false,
  },
  {
    id: 'router',
    position: { x: 220, y: 200 },
    data: { label: 'Router (gate net)\ntop-k softmax' },
    style: routerStyle,
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: false,
  },
  {
    id: 'e1',
    position: { x: 460, y: 0 },
    data: { label: 'Expert 1\nidle' },
    style: expertIdleStyle,
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: false,
  },
  {
    id: 'e2',
    position: { x: 460, y: 70 },
    data: { label: 'Expert 2\nACTIVE' },
    style: expertActiveStyle,
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: false,
  },
  {
    id: 'e3',
    position: { x: 460, y: 140 },
    data: { label: 'Expert 3\nidle' },
    style: expertIdleStyle,
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: false,
  },
  {
    id: 'e4',
    position: { x: 460, y: 210 },
    data: { label: 'Expert 4\nACTIVE' },
    style: expertActiveStyle,
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: false,
  },
  {
    id: 'e5',
    position: { x: 460, y: 280 },
    data: { label: 'Expert 5\nidle' },
    style: expertIdleStyle,
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: false,
  },
  {
    id: 'e6',
    position: { x: 460, y: 350 },
    data: { label: 'Expert 6\nidle' },
    style: expertIdleStyle,
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: false,
  },
  {
    id: 'e7',
    position: { x: 460, y: 420 },
    data: { label: 'Expert 7\nidle' },
    style: expertIdleStyle,
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: false,
  },
  {
    id: 'e8',
    position: { x: 460, y: 490 },
    data: { label: 'Expert 8\nidle' },
    style: expertIdleStyle,
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: false,
  },
  {
    id: 'combine',
    position: { x: 720, y: 245 },
    data: { label: 'Weighted combine\noutput activation' },
    style: combineStyle,
    targetPosition: Position.Left,
    draggable: false,
  },
];

const edgeBase = {
  type: 'smoothstep' as const,
  markerEnd: { type: MarkerType.ArrowClosed, width: 12, height: 12 },
};

const edges: Edge[] = [
  { id: 'e-tr', source: 'token', target: 'router', ...edgeBase, style: { stroke: '#0972d3', strokeWidth: 2 } },
  { id: 'r-1', source: 'router', target: 'e1', ...edgeBase, style: { stroke: '#aab7b8', strokeWidth: 1, strokeDasharray: '4 4' } },
  { id: 'r-2', source: 'router', target: 'e2', ...edgeBase, style: { stroke: '#037f0c', strokeWidth: 3 }, animated: true, label: 'route' },
  { id: 'r-3', source: 'router', target: 'e3', ...edgeBase, style: { stroke: '#aab7b8', strokeWidth: 1, strokeDasharray: '4 4' } },
  { id: 'r-4', source: 'router', target: 'e4', ...edgeBase, style: { stroke: '#037f0c', strokeWidth: 3 }, animated: true, label: 'route' },
  { id: 'r-5', source: 'router', target: 'e5', ...edgeBase, style: { stroke: '#aab7b8', strokeWidth: 1, strokeDasharray: '4 4' } },
  { id: 'r-6', source: 'router', target: 'e6', ...edgeBase, style: { stroke: '#aab7b8', strokeWidth: 1, strokeDasharray: '4 4' } },
  { id: 'r-7', source: 'router', target: 'e7', ...edgeBase, style: { stroke: '#aab7b8', strokeWidth: 1, strokeDasharray: '4 4' } },
  { id: 'r-8', source: 'router', target: 'e8', ...edgeBase, style: { stroke: '#aab7b8', strokeWidth: 1, strokeDasharray: '4 4' } },
  { id: '2-c', source: 'e2', target: 'combine', ...edgeBase, style: { stroke: '#037f0c', strokeWidth: 3 }, animated: true },
  { id: '4-c', source: 'e4', target: 'combine', ...edgeBase, style: { stroke: '#037f0c', strokeWidth: 3 }, animated: true },
];

// FitViewOnResize watches the container and re-runs fitView so React Flow's
// coordinate system stays inside the visible area on mobile.
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

export function MoeRoutingDiagram() {
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '560px', border: '1px solid #e9ebed', borderRadius: '8px' }}
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
