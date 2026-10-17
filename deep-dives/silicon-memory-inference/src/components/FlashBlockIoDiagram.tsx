import React from 'react';

// From one KV block to the I/O the drive sees. Block sizes are our arithmetic
// (research/2026-10-refresh/flash-cache-tier.md, rows B2, B4, B5) on the Llama
// 3.1 70B shape; the right panel is the BaM paper's author-measured result for
// CPU-initiated GDS on PCIe Gen4 x16 (rows P9, B7). The section caption carries
// the citations.
//
// On a phone the SVG keeps a 640 px minimum width and the wrapper scrolls.

const VB_W = 860;
const VB_H = 420;

const blue = '#0972d3';
const blueTint = '#f2f8fd';
const green = '#037f0c';
const amber = '#ec7211';
const grey = '#5f6b7a';
const ink = '#16191f';

const GRID_COLS = 16;
const GRID_ROWS = 5;

export function FlashBlockIoDiagram() {
  const cells: Array<{ x: number; y: number }> = [];
  for (let r = 0; r < GRID_ROWS; r += 1) {
    for (let c = 0; c < GRID_COLS; c += 1) {
      cells.push({ x: 310 + c * 15, y: 86 + r * 15 });
    }
  }
  const track = { x: 594, w: 236 };
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        role="img"
        aria-labelledby="flash-blockio-title"
        style={{ width: '100%', minWidth: 640, height: 'auto', display: 'block' }}
      >
        <title id="flash-blockio-title">
          One 16-token KV block of Llama 3.1 70B is 655 KB per GPU at tensor parallel 8. Stored
          layer by layer it becomes 80 reads of 8 KiB; stored page-first it is one read. BaM&apos;s
          authors measured CPU-initiated GPUDirect Storage reaching 23.6% of a PCIe Gen4 x16 link at
          4 KiB and filling it only at 32 KiB and above, so page-first layouts make KV offload a
          bandwidth workload.
        </title>
        <style>{`
          .fbi-h { fill: ${ink}; font: 600 13px sans-serif; }
          .fbi-t { fill: ${ink}; font: 600 13px sans-serif; text-anchor: middle; }
          .fbi-s { fill: #414d5c; font: 11px sans-serif; }
          .fbi-sc { fill: #414d5c; font: 11px sans-serif; text-anchor: middle; }
          .fbi-l { fill: ${ink}; font: 600 12px sans-serif; }
          .fbi-w { fill: #ffffff; font: 600 12px sans-serif; }
          .fbi-d { fill: ${ink}; font: 12px sans-serif; }
          .fbi-big { fill: ${ink}; font: 600 14px sans-serif; }
        `}</style>
        <defs>
          <marker id="fbi-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={grey} />
          </marker>
        </defs>
        <rect x="0" y="0" width={VB_W} height={VB_H} rx="8" fill="#ffffff" stroke="#e9ebed" />

        {/* Panel A: one block */}
        <rect x="12" y="12" width="268" height="282" rx="8" fill="#fafbfc" stroke="#d1d5db" />
        <text className="fbi-h" x="26" y="38">
          One 16-token KV block
        </text>
        <text className="fbi-s" x="26" y="56">
          Llama 3.1 70B, BF16 KV, 8 GPUs
        </text>
        <rect x="30" y="70" width="232" height="50" rx="6" fill={blueTint} stroke={blue} />
        <text className="fbi-t" x="146" y="92">
          5.24 MB per node
        </text>
        <text className="fbi-sc" x="146" y="110">
          16 tokens x 327,680 B
        </text>
        <line x1="146" y1="122" x2="146" y2="144" stroke={grey} strokeWidth="1.5" markerEnd="url(#fbi-ah)" />
        <rect x="30" y="148" width="232" height="50" rx="6" fill={blueTint} stroke={blue} />
        <text className="fbi-t" x="146" y="170">
          655 KB per GPU
        </text>
        <text className="fbi-sc" x="146" y="188">
          one of eight KV heads on each GPU
        </text>
        <line x1="146" y1="200" x2="146" y2="222" stroke={grey} strokeWidth="1.5" markerEnd="url(#fbi-ah)" />
        <rect x="30" y="226" width="232" height="50" rx="6" fill={blueTint} stroke={blue} />
        <text className="fbi-t" x="146" y="248">
          8 KiB per layer per GPU
        </text>
        <text className="fbi-sc" x="146" y="266">
          80 layers
        </text>

        {/* Panel B: layout sets the I/O size */}
        <rect x="296" y="12" width="268" height="282" rx="8" fill="#fafbfc" stroke="#d1d5db" />
        <text className="fbi-h" x="310" y="38">
          Layout sets the I/O size
        </text>
        <text className="fbi-l" x="310" y="74">
          Layer-first: 80 reads of 8 KiB
        </text>
        {cells.map((c, i) => (
          <rect key={i} x={c.x} y={c.y} width="11" height="11" rx="1.5" fill={amber} />
        ))}
        <text className="fbi-l" x="310" y="190">
          Page-first: 1 read of 655 KB
        </text>
        <rect x="310" y="202" width="236" height="44" rx="4" fill={green} />
        <text className="fbi-w" x="428" y="229" textAnchor="middle">
          one I/O per block per GPU
        </text>
        <text className="fbi-s" x="310" y="272">
          SGLang page_first, Dynamo batched writes
        </text>

        {/* Panel C: BaM measurement */}
        <rect x="580" y="12" width="268" height="282" rx="8" fill="#fafbfc" stroke="#d1d5db" />
        <text className="fbi-h" x="594" y="38">
          CPU-initiated GDS, measured
        </text>
        <text className="fbi-s" x="594" y="56">
          BaM authors, A100 on PCIe Gen4 x16
        </text>
        <text className="fbi-l" x="594" y="86">
          4 KiB reads
        </text>
        <rect x={track.x} y="94" width={track.w} height="24" rx="3" fill="#e9ebed" />
        <rect x={track.x} y="94" width={track.w * 0.236} height="24" rx="3" fill={amber} />
        <text className="fbi-d" x={track.x + track.w * 0.236 + 8} y="111">
          23.6% of the link
        </text>
        <text className="fbi-l" x="594" y="146">
          32 KiB reads and larger
        </text>
        <rect x={track.x} y="154" width={track.w} height="24" rx="3" fill={green} />
        <text className="fbi-w" x={track.x + 10} y="171">
          fills the link
        </text>
        <text className="fbi-l" x="594" y="206">
          GPU-initiated (BaM), 4 KiB
        </text>
        <rect x={track.x} y="214" width={track.w} height="24" rx="3" fill={green} />
        <text className="fbi-w" x={track.x + 10} y="231">
          about 25 GB/s from four SSDs
        </text>
        <text className="fbi-s" x="594" y="272">
          Author-measured, ASPLOS 2023
        </text>

        {/* Bottom band: IOPS to stream 18 GB/s */}
        <text className="fbi-h" x="26" y="328">
          IOPS needed to stream the instance store&apos;s 18 GB/s floor
        </text>
        <rect x="26" y="342" width="392" height="62" rx="6" fill="#fdf3ec" stroke={amber} />
        <text className="fbi-big" x="40" y="366">
          8 KiB reads: 2.2 million IOPS
        </text>
        <text className="fbi-s" x="40" y="388">
          half the instance&apos;s 4.4 million rating at 4 KiB
        </text>
        <rect x="442" y="342" width="392" height="62" rx="6" fill="#ecf7ec" stroke={green} />
        <text className="fbi-big" x="456" y="366">
          655 KB reads: about 27,000 IOPS
        </text>
        <text className="fbi-s" x="456" y="388">
          a throughput workload for the drives
        </text>
      </svg>
    </div>
  );
}
