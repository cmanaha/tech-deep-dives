import React from 'react';
import Box from '@cloudscape-design/components/box';
import sparkTopologySvg from '../assets/spark-topology-lstopo.svg?raw';
import { Cite } from './Cite';
import { S } from '../sources/EdgeSharedMemorySilicon';

// Tier 0 artifact: the hwloc/lstopo topology render captured over SSH from a
// physical DGX Spark on 2026-07-18. The raw capture and the full evidence bundle
// live in research/dgx-spark/ (spark-topology.svg is the source of this asset).
//
// The capture is shown as lstopo drew it. Only the root svg tag is rewritten at
// module load: the accessible name moves from aria-label to a <title> wired with
// aria-labelledby, and the width attribute becomes the dive's wide-diagram phone
// convention. lstopo draws 10px text in a 1261-unit viewBox, so a 1000px minimum
// width keeps that text near 8px on a phone, where the reader scrolls sideways.
//
// Safety note on dangerouslySetInnerHTML: the injected markup is a static asset
// checked into this repo and bundled at build time (?raw import). It is never
// derived from user or network input, so there is no XSS vector and no sanitizer
// dependency is warranted.

const TITLE_ID = 'spark-lstopo-title';
const TITLE =
  'lstopo capture of a physical DGX Spark: one package and one NUMA node holding 122 GB; two ten-core CPU clusters, each mixing five cores with 2 MB of L2 and five with 512 KB, behind L3 slices of 8 MB and 16 MB; and the GB10 GPU as a PCI device whose OpenCL view reports 121 GB, the shared pool.';

const accessibleSvg = sparkTopologySvg
  .replace(/^<\?xml[^>]*>\s*/, '')
  .replace(/ aria-label='[^']*'/, ` aria-labelledby='${TITLE_ID}'`)
  .replace(
    / width='100%'/,
    " style='width:100%;min-width:1000px;height:auto;display:block'"
  )
  .replace(/(<svg[^>]*>)/, `$1<title id='${TITLE_ID}'>${TITLE}</title>`);

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
        dangerouslySetInnerHTML={{ __html: accessibleSvg }}
      />
      <Box variant="small">
        lstopo (hwloc) on a physical DGX Spark, 17 July 2026 (US Pacific time). The GB10 GPU appears as PCI device
        000f:01:00.0, and its OpenCL view reports 48 compute units and 121 GB, the pool it shares
        with the CPU.
        <Cite s={S.sparkTopologySvg} kind="measured" />
      </Box>
    </div>
  );
}
