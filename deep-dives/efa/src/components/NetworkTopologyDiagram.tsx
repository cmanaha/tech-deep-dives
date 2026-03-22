import React from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  Controls,
  MarkerType,
  Position,
  ConnectionLineType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const gpuStyle = {
  background: '#037f0c',
  border: '2px solid #025506',
  borderRadius: '6px',
  padding: '6px 10px',
  fontSize: '11px',
  fontWeight: 700,
  color: '#fff',
  minWidth: '60px',
  textAlign: 'center' as const,
};

const efaStyle = {
  background: '#0972d3',
  border: '2px solid #0656a3',
  borderRadius: '6px',
  padding: '6px 10px',
  fontSize: '11px',
  fontWeight: 700,
  color: '#fff',
  minWidth: '70px',
  textAlign: 'center' as const,
};

const instanceStyle = (color: string) => ({
  background: color,
  border: '2px solid #414d5c',
  borderRadius: '12px',
  padding: '12px',
  fontSize: '13px',
  fontWeight: 700,
  color: '#16191f',
  minWidth: '340px',
  minHeight: '180px',
  textAlign: 'center' as const,
});

const switchStyle = {
  background: '#414d5c',
  border: '2px solid #16191f',
  borderRadius: '8px',
  padding: '8px 16px',
  fontSize: '12px',
  fontWeight: 700,
  color: '#fff',
  minWidth: '200px',
  textAlign: 'center' as const,
};

// Node 1 — p5.48xlarge
const node1Gpus: Node[] = Array.from({ length: 8 }, (_, i) => ({
  id: `n1-gpu-${i}`,
  position: { x: 20 + i * 42, y: 40 },
  data: { label: `G${i}` },
  style: gpuStyle,
  parentId: 'node1',
  extent: 'parent' as const,
}));

const node1Efas: Node[] = Array.from({ length: 4 }, (_, i) => ({
  id: `n1-efa-${i}`,
  position: { x: 30 + i * 85, y: 130 },
  data: { label: `EFA ${i}` },
  style: efaStyle,
  parentId: 'node1',
  extent: 'parent' as const,
  sourcePosition: Position.Bottom,
}));

// Node 2 — p5.48xlarge
const node2Gpus: Node[] = Array.from({ length: 8 }, (_, i) => ({
  id: `n2-gpu-${i}`,
  position: { x: 20 + i * 42, y: 40 },
  data: { label: `G${i}` },
  style: gpuStyle,
  parentId: 'node2',
  extent: 'parent' as const,
}));

const node2Efas: Node[] = Array.from({ length: 4 }, (_, i) => ({
  id: `n2-efa-${i}`,
  position: { x: 30 + i * 85, y: 130 },
  data: { label: `EFA ${i}` },
  style: efaStyle,
  parentId: 'node2',
  extent: 'parent' as const,
  sourcePosition: Position.Bottom,
}));

const containerNodes: Node[] = [
  {
    id: 'node1',
    position: { x: 30, y: 30 },
    data: { label: 'Instance 1 (p5.48xlarge)' },
    style: instanceStyle('#f2f8fd'),
    type: 'group',
  },
  {
    id: 'node2',
    position: { x: 430, y: 30 },
    data: { label: 'Instance 2 (p5.48xlarge)' },
    style: instanceStyle('#f2f8fd'),
    type: 'group',
  },
  {
    id: 'nvlink-label-1',
    position: { x: 70, y: 95 },
    data: { label: 'NVSwitch (900 GB/s bisection)' },
    style: { background: 'transparent', border: 'none', fontSize: '10px', color: '#037f0c', fontWeight: 700, width: '280px', textAlign: 'center' as const },
    parentId: 'node1',
    extent: 'parent' as const,
  },
  {
    id: 'nvlink-label-2',
    position: { x: 70, y: 95 },
    data: { label: 'NVSwitch (900 GB/s bisection)' },
    style: { background: 'transparent', border: 'none', fontSize: '10px', color: '#037f0c', fontWeight: 700, width: '280px', textAlign: 'center' as const },
    parentId: 'node2',
    extent: 'parent' as const,
  },
  {
    id: 'fabric-switch',
    position: { x: 260, y: 260 },
    data: { label: 'AWS Network Fabric\n(SRD multi-path, 64 parallel paths)' },
    style: switchStyle,
    sourcePosition: Position.Top,
    targetPosition: Position.Top,
  },
  {
    id: 'placement-label',
    position: { x: 220, y: 330 },
    data: { label: 'Cluster Placement Group (single AZ)' },
    style: { background: 'transparent', border: '2px dashed #ec7211', borderRadius: '8px', fontSize: '11px', color: '#ec7211', fontWeight: 700, padding: '4px 12px', width: '280px', textAlign: 'center' as const },
    draggable: false,
  },
];

const nodes: Node[] = [
  ...containerNodes,
  ...node1Gpus,
  ...node1Efas,
  ...node2Gpus,
  ...node2Efas,
];

// NVLink edges within each node (connecting GPUs)
const nvlinkEdges1: Edge[] = Array.from({ length: 7 }, (_, i) => ({
  id: `nvlink-1-${i}`,
  source: `n1-gpu-${i}`,
  target: `n1-gpu-${i + 1}`,
  type: 'straight',
  style: { stroke: '#037f0c', strokeWidth: 3 },
  animated: true,
}));

const nvlinkEdges2: Edge[] = Array.from({ length: 7 }, (_, i) => ({
  id: `nvlink-2-${i}`,
  source: `n2-gpu-${i}`,
  target: `n2-gpu-${i + 1}`,
  type: 'straight',
  style: { stroke: '#037f0c', strokeWidth: 3 },
  animated: true,
}));

// EFA to fabric edges
const efaFabricEdges: Edge[] = [
  ...Array.from({ length: 4 }, (_, i) => ({
    id: `n1-efa-fabric-${i}`,
    source: `n1-efa-${i}`,
    target: 'fabric-switch',
    type: 'smoothstep',
    style: { stroke: '#0972d3', strokeWidth: 2 },
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed, width: 8, height: 8, color: '#0972d3' },
  })),
  ...Array.from({ length: 4 }, (_, i) => ({
    id: `n2-efa-fabric-${i}`,
    source: `n2-efa-${i}`,
    target: 'fabric-switch',
    type: 'smoothstep',
    style: { stroke: '#0972d3', strokeWidth: 2 },
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed, width: 8, height: 8, color: '#0972d3' },
  })),
];

const edges: Edge[] = [...nvlinkEdges1, ...nvlinkEdges2, ...efaFabricEdges];

export function NetworkTopologyDiagram() {
  return (
    <div style={{ height: '420px', width: '100%', background: '#fafafa', borderRadius: '8px', border: '1px solid #e9ebed' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={true}
        zoomOnScroll={false}
        zoomOnPinch={true}
        minZoom={0.4}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#e9ebed" gap={20} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
