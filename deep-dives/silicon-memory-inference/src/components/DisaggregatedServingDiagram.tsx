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

const node = (color: string, border: string) => ({
  background: color,
  border: `2px solid ${border}`,
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
    id: 'request',
    position: { x: 0, y: 200 },
    data: { label: 'Inference request' },
    style: node('#f2f8fd', '#0972d3'),
    sourcePosition: Position.Right,
    draggable: false,
  },
  {
    id: 'router',
    position: { x: 220, y: 200 },
    data: { label: 'Request router' },
    style: node('#f2f8fd', '#0972d3'),
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: false,
  },
  {
    id: 'prefill',
    position: { x: 460, y: 80 },
    data: { label: 'Prefill cluster\nFLOP-rich GPUs\n(compute-bound)' },
    style: node('#fdf3ec', '#ec7211'),
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: false,
  },
  {
    id: 'kv',
    position: { x: 700, y: 80 },
    data: { label: 'KV cache transport\nNIXL / NCCL\nover NVLink / EFA' },
    style: node('#ecf7ec', '#037f0c'),
    sourcePosition: Position.Bottom,
    targetPosition: Position.Left,
    draggable: false,
  },
  {
    id: 'decode',
    position: { x: 700, y: 280 },
    data: { label: 'Decode cluster\nbandwidth-rich GPUs\n(memory-bound)' },
    style: node('#fce7e7', '#d91515'),
    sourcePosition: Position.Right,
    targetPosition: Position.Top,
    draggable: false,
  },
  {
    id: 'response',
    position: { x: 940, y: 280 },
    data: { label: 'Streaming\nresponse' },
    style: node('#f2f8fd', '#0972d3'),
    targetPosition: Position.Left,
    draggable: false,
  },
];

const e = {
  type: 'smoothstep' as const,
  markerEnd: { type: MarkerType.ArrowClosed, width: 12, height: 12 },
};

const edges: Edge[] = [
  { id: 'r-rt', source: 'request', target: 'router', ...e, style: { stroke: '#0972d3', strokeWidth: 2 }, animated: true },
  { id: 'rt-p', source: 'router', target: 'prefill', ...e, style: { stroke: '#ec7211', strokeWidth: 2 }, animated: true, label: 'prompt' },
  { id: 'p-k', source: 'prefill', target: 'kv', ...e, style: { stroke: '#037f0c', strokeWidth: 2 }, animated: true, label: 'KV cache' },
  { id: 'k-d', source: 'kv', target: 'decode', ...e, style: { stroke: '#037f0c', strokeWidth: 3 }, animated: true, label: 'transport' },
  { id: 'd-r', source: 'decode', target: 'response', ...e, style: { stroke: '#d91515', strokeWidth: 2 }, animated: true, label: 'tokens' },
];

export function DisaggregatedServingDiagram() {
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
