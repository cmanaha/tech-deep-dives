import React from 'react';
import Box from '@cloudscape-design/components/box';
import sparkTopologySvg from '../assets/spark-topology-lstopo.svg?raw';

// Tier 0 artifact: the actual hwloc/lstopo topology render captured over SSH
// from a physical DGX Spark (host spark-150b) on 2026-07-18. The raw capture
// and the full evidence bundle live in research/dgx-spark/.
//
// Safety note on dangerouslySetInnerHTML: the injected markup is a static
// asset checked into this repo and bundled at build time (?raw import). It is
// never derived from user or network input, so there is no XSS vector and no
// sanitizer dependency is warranted.

export function SparkTopologyCapture() {
  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          width: '100%',
          border: '1px solid #e9ebed',
          borderRadius: '8px',
          background: '#ffffff',
          padding: '8px',
          overflowX: 'auto',
        }}
        dangerouslySetInnerHTML={{ __html: sparkTopologySvg }}
      />
      <Box variant="small">
        lstopo (hwloc) run on a physical DGX Spark, 2026-07-18. Both ten-core
        clusters mix five 512 KB-L2 cores (Cortex-A725) with five 2 MB-L2 cores
        (Cortex-X925); the L3 slices are 8 MB and 16 MB; all twenty cores and
        122 GB sit in one NUMA node. The GB10 GPU appears as a PCI device
        (000f:01:00.0) with no memory of its own.
      </Box>
    </div>
  );
}
