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
    data: { label: 'PyTorch / JAX model' },
    style: nodeStyle('#f2f8fd', '#0972d3'),
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: false,
  },
  {
    id: 'frontend',
    position: { x: 220, y: 200 },
    data: { label: 'torch-neuronx /\njax-neuron' },
    style: nodeStyle('#f2f8fd', '#0972d3'),
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: false,
  },
  {
    id: 'xla',
    position: { x: 460, y: 100 },
    data: { label: 'XLA HLO' },
    style: nodeStyle('#ecf7ec', '#037f0c'),
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: false,
  },
  {
    id: 'nki',
    position: { x: 460, y: 300 },
    data: { label: 'NKI\nPython kernel DSL' },
    style: nodeStyle('#ecf7ec', '#037f0c'),
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: false,
  },
  {
    id: 'neuron-hlo',
    position: { x: 690, y: 200 },
    data: { label: 'Neuron HLO\n(operator fusion +\nSBUF tiling)' },
    style: nodeStyle('#fdf3ec', '#ec7211'),
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: false,
  },
  {
    id: 'neff',
    position: { x: 940, y: 200 },
    data: { label: 'NEFF\nahead-of-time binary' },
    style: nodeStyle('#fce7e7', '#d91515'),
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: false,
  },
];

const edgeBase = {
  type: 'smoothstep' as const,
  markerEnd: { type: MarkerType.ArrowClosed, width: 12, height: 12 },
};

const edges: Edge[] = [
  { id: 'p-f', source: 'pytorch', target: 'frontend', ...edgeBase, style: { stroke: '#0972d3', strokeWidth: 2 }, animated: true },
  { id: 'f-x', source: 'frontend', target: 'xla', ...edgeBase, style: { stroke: '#037f0c', strokeWidth: 2 }, animated: true, label: 'graph capture' },
  { id: 'f-n', source: 'frontend', target: 'nki', ...edgeBase, style: { stroke: '#037f0c', strokeWidth: 2 }, animated: true, label: 'custom kernels' },
  { id: 'x-h', source: 'xla', target: 'neuron-hlo', ...edgeBase, style: { stroke: '#ec7211', strokeWidth: 2 }, animated: true },
  { id: 'n-h', source: 'nki', target: 'neuron-hlo', ...edgeBase, style: { stroke: '#ec7211', strokeWidth: 2 }, animated: true },
  { id: 'h-e', source: 'neuron-hlo', target: 'neff', ...edgeBase, style: { stroke: '#d91515', strokeWidth: 3 }, animated: true, label: 'AOT compile' },
];

export function AwsCompilerStack() {
  return (
    <div style={{ width: '100%', height: '440px', border: '1px solid #e9ebed', borderRadius: '8px' }}>
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
