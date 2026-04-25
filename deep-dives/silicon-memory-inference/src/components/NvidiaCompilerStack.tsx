import React from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  MarkerType,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const nodeStyle = (color: string, borderColor: string) => ({
  background: color,
  border: `2px solid ${borderColor}`,
  borderRadius: '8px',
  padding: '10px 14px',
  fontSize: '12px',
  fontWeight: 600,
  color: '#16191f',
  minWidth: '170px',
  textAlign: 'center' as const,
});

const nodes: Node[] = [
  {
    id: 'pytorch',
    position: { x: 0, y: 200 },
    data: { label: 'PyTorch model\n(eager or torch.compile)' },
    style: nodeStyle('#f2f8fd', '#0972d3'),
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: false,
  },
  {
    id: 'inductor',
    position: { x: 220, y: 200 },
    data: { label: 'Inductor IR\n(graph capture)' },
    style: nodeStyle('#f2f8fd', '#0972d3'),
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: false,
  },
  {
    id: 'triton',
    position: { x: 460, y: 80 },
    data: { label: 'Triton DSL\n(Python kernels)' },
    style: nodeStyle('#ecf7ec', '#037f0c'),
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: false,
  },
  {
    id: 'cutlass',
    position: { x: 460, y: 200 },
    data: { label: 'CUTLASS / CuTe\n(C++ templates)' },
    style: nodeStyle('#ecf7ec', '#037f0c'),
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: false,
  },
  {
    id: 'libs',
    position: { x: 460, y: 320 },
    data: { label: 'cuBLAS / cuDNN /\ncuTENSOR' },
    style: nodeStyle('#ecf7ec', '#037f0c'),
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: false,
  },
  {
    id: 'ptx',
    position: { x: 700, y: 200 },
    data: { label: 'PTX\n(virtual ISA)' },
    style: nodeStyle('#fdf3ec', '#ec7211'),
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: false,
  },
  {
    id: 'sass',
    position: { x: 940, y: 200 },
    data: { label: 'SASS / cubin\n(Hopper / Blackwell)' },
    style: nodeStyle('#fce7e7', '#d91515'),
    targetPosition: Position.Left,
    draggable: false,
  },
];

const edgeBase = {
  type: 'smoothstep' as const,
  markerEnd: { type: MarkerType.ArrowClosed, width: 12, height: 12 },
};

const edges: Edge[] = [
  { id: 'p-i', source: 'pytorch', target: 'inductor', ...edgeBase, style: { stroke: '#0972d3', strokeWidth: 2 }, animated: true },
  { id: 'i-t', source: 'inductor', target: 'triton', ...edgeBase, style: { stroke: '#037f0c', strokeWidth: 2 }, animated: true, label: 'default' },
  { id: 'i-c', source: 'inductor', target: 'cutlass', ...edgeBase, style: { stroke: '#037f0c', strokeWidth: 2 }, animated: true, label: 'matmul' },
  { id: 'i-l', source: 'inductor', target: 'libs', ...edgeBase, style: { stroke: '#037f0c', strokeWidth: 2 }, animated: true, label: 'opt-in' },
  { id: 't-p', source: 'triton', target: 'ptx', ...edgeBase, style: { stroke: '#037f0c', strokeWidth: 2 }, animated: true },
  { id: 'c-p', source: 'cutlass', target: 'ptx', ...edgeBase, style: { stroke: '#037f0c', strokeWidth: 2 }, animated: true },
  { id: 'l-p', source: 'libs', target: 'ptx', ...edgeBase, style: { stroke: '#037f0c', strokeWidth: 2 }, animated: true },
  { id: 'p-s', source: 'ptx', target: 'sass', ...edgeBase, style: { stroke: '#ec7211', strokeWidth: 3 }, animated: true, label: 'ptxas' },
];

export function NvidiaCompilerStack() {
  return (
    <div style={{ width: '100%', height: '460px', border: '1px solid #e9ebed', borderRadius: '8px' }}>
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
      </ReactFlow>
    </div>
  );
}
