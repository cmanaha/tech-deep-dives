import React, { useCallback } from 'react';
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

const nodeStyle = (color: string, borderColor: string) => ({
  background: color,
  border: `2px solid ${borderColor}`,
  borderRadius: '8px',
  padding: '10px 16px',
  fontSize: '13px',
  fontWeight: 600,
  color: '#16191f',
  minWidth: '140px',
  textAlign: 'center' as const,
});

const labelStyle = {
  fontSize: '11px',
  fontWeight: 600,
  fill: '#687078',
};

// Traditional TCP/IP path (left column)
const tcpNodes: Node[] = [
  { id: 'tcp-app', position: { x: 50, y: 30 }, data: { label: 'Application' }, style: nodeStyle('#f2f8fd', '#0972d3'), sourcePosition: Position.Bottom, targetPosition: Position.Top },
  { id: 'tcp-syscall', position: { x: 50, y: 110 }, data: { label: 'System Call\n(context switch)' }, style: nodeStyle('#fdf3ec', '#ec7211'), sourcePosition: Position.Bottom, targetPosition: Position.Top },
  { id: 'tcp-stack', position: { x: 50, y: 200 }, data: { label: 'Kernel TCP Stack\n(protocol processing)' }, style: nodeStyle('#fdf3ec', '#ec7211'), sourcePosition: Position.Bottom, targetPosition: Position.Top },
  { id: 'tcp-buffers', position: { x: 50, y: 300 }, data: { label: 'Socket Buffers\n(memory copy)' }, style: nodeStyle('#fdf3ec', '#ec7211'), sourcePosition: Position.Bottom, targetPosition: Position.Top },
  { id: 'tcp-driver', position: { x: 50, y: 390 }, data: { label: 'NIC Driver' }, style: nodeStyle('#fdf3ec', '#ec7211'), sourcePosition: Position.Bottom, targetPosition: Position.Top },
  { id: 'tcp-nic', position: { x: 50, y: 470 }, data: { label: 'ENA NIC Hardware' }, style: nodeStyle('#e9ebed', '#414d5c'), sourcePosition: Position.Bottom, targetPosition: Position.Top },
  { id: 'tcp-wire', position: { x: 50, y: 550 }, data: { label: 'Network (TCP/IP)' }, style: nodeStyle('#e9ebed', '#414d5c'), targetPosition: Position.Top },
];

// EFA OS-bypass path (right column)
const efaNodes: Node[] = [
  { id: 'efa-app', position: { x: 380, y: 30 }, data: { label: 'Application\n(NCCL / MPI / NIXL)' }, style: nodeStyle('#f2f8fd', '#0972d3'), sourcePosition: Position.Bottom, targetPosition: Position.Top },
  { id: 'efa-plugin', position: { x: 380, y: 120 }, data: { label: 'aws-ofi-nccl plugin\n(or MPI OFI layer)' }, style: nodeStyle('#f2f8fd', '#0972d3'), sourcePosition: Position.Bottom, targetPosition: Position.Top },
  { id: 'efa-libfabric', position: { x: 380, y: 220 }, data: { label: 'libfabric\n(user-space, OS bypass)' }, style: nodeStyle('#ecf7ec', '#037f0c'), sourcePosition: Position.Bottom, targetPosition: Position.Top },
  { id: 'efa-hw', position: { x: 380, y: 330 }, data: { label: 'EFA Hardware\n(Nitro card)' }, style: nodeStyle('#ecf7ec', '#037f0c'), sourcePosition: Position.Bottom, targetPosition: Position.Top },
  { id: 'efa-srd', position: { x: 380, y: 440 }, data: { label: 'SRD Protocol\n(HW reliability, 64-path spray)' }, style: nodeStyle('#ecf7ec', '#037f0c'), sourcePosition: Position.Bottom, targetPosition: Position.Top },
  { id: 'efa-wire', position: { x: 380, y: 550 }, data: { label: 'Network (SRD/UDP encap)' }, style: nodeStyle('#ecf7ec', '#037f0c'), targetPosition: Position.Top },
];

// Labels
const labelNodes: Node[] = [
  { id: 'label-tcp', position: { x: 55, y: 0 }, data: { label: 'Traditional Path (~25-50μs)' }, style: { background: 'transparent', border: 'none', fontSize: '12px', fontWeight: 700, color: '#ec7211', width: '180px' }, draggable: false },
  { id: 'label-efa', position: { x: 385, y: 0 }, data: { label: 'EFA Path (~2-5μs)' }, style: { background: 'transparent', border: 'none', fontSize: '12px', fontWeight: 700, color: '#037f0c', width: '180px' }, draggable: false },
  { id: 'label-kernel', position: { x: -60, y: 160 }, data: { label: 'KERNEL\nSPACE' }, style: { background: '#fdf3ec', border: '1px dashed #ec7211', borderRadius: '4px', fontSize: '10px', fontWeight: 700, color: '#ec7211', padding: '4px 8px', width: '60px', textAlign: 'center' as const }, draggable: false },
  { id: 'label-user', position: { x: -60, y: 50 }, data: { label: 'USER\nSPACE' }, style: { background: '#f2f8fd', border: '1px dashed #0972d3', borderRadius: '4px', fontSize: '10px', fontWeight: 700, color: '#0972d3', padding: '4px 8px', width: '60px', textAlign: 'center' as const }, draggable: false },
];

const nodes = [...tcpNodes, ...efaNodes, ...labelNodes];

const edgeDefaults = {
  type: 'smoothstep',
  markerEnd: { type: MarkerType.ArrowClosed, width: 12, height: 12 },
  animated: false,
};

const tcpEdges: Edge[] = [
  { id: 'tcp-1', source: 'tcp-app', target: 'tcp-syscall', ...edgeDefaults, style: { stroke: '#ec7211', strokeWidth: 2 } },
  { id: 'tcp-2', source: 'tcp-syscall', target: 'tcp-stack', ...edgeDefaults, style: { stroke: '#ec7211', strokeWidth: 2 } },
  { id: 'tcp-3', source: 'tcp-stack', target: 'tcp-buffers', ...edgeDefaults, style: { stroke: '#ec7211', strokeWidth: 2 } },
  { id: 'tcp-4', source: 'tcp-buffers', target: 'tcp-driver', ...edgeDefaults, style: { stroke: '#ec7211', strokeWidth: 2 } },
  { id: 'tcp-5', source: 'tcp-driver', target: 'tcp-nic', ...edgeDefaults, style: { stroke: '#ec7211', strokeWidth: 2 } },
  { id: 'tcp-6', source: 'tcp-nic', target: 'tcp-wire', ...edgeDefaults, style: { stroke: '#ec7211', strokeWidth: 2 } },
];

const efaEdges: Edge[] = [
  { id: 'efa-1', source: 'efa-app', target: 'efa-plugin', ...edgeDefaults, style: { stroke: '#037f0c', strokeWidth: 2 }, animated: true },
  { id: 'efa-2', source: 'efa-plugin', target: 'efa-libfabric', ...edgeDefaults, style: { stroke: '#037f0c', strokeWidth: 2 }, animated: true },
  { id: 'efa-3', source: 'efa-libfabric', target: 'efa-hw', ...edgeDefaults, style: { stroke: '#037f0c', strokeWidth: 3 }, animated: true, label: 'OS bypass' },
  { id: 'efa-4', source: 'efa-hw', target: 'efa-srd', ...edgeDefaults, style: { stroke: '#037f0c', strokeWidth: 3 }, animated: true },
  { id: 'efa-5', source: 'efa-srd', target: 'efa-wire', ...edgeDefaults, style: { stroke: '#037f0c', strokeWidth: 3 }, animated: true },
];

const edges = [...tcpEdges, ...efaEdges];

export function EFADataPathDiagram() {
  return (
    <div style={{ height: '650px', width: '100%', background: '#fafafa', borderRadius: '8px', border: '1px solid #e9ebed' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={true}
        minZoom={0.5}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#e9ebed" gap={20} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
