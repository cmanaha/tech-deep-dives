import type { ReactNode } from 'react';
import Alert from '@cloudscape-design/components/alert';
import Box from '@cloudscape-design/components/box';

/**
 * Stills and short looping clips of a simulation or of the real arm, with their provenance.
 *
 * Files live in public/media/ and are listed in public/media/PROVENANCE.md. A still loads lazily.
 * A clip shows its poster frame and loads only when the reader presses play; it has no sound and
 * loops. Every capture says which software and version made it, on which date and by whom.
 */

/* The app is served with a relative base ('./'), and sections are selected by hash, so media sit beside index.html. */
const BASE = './';

export interface Provenance {
  /** Software and version that produced the pixels: "MuJoCo 4.0.1, offscreen OpenGL renderer". */
  software: string;
  /** Capture date, ISO form. */
  date: string;
  /** Who captured it: "this dive, scripted motion". */
  by: string;
  /** Model or asset source and licence, when the picture shows one. */
  asset?: string;
}

interface CaptureProps {
  /** File name in public/media, without extension for a clip ("so101-pick-place"). */
  file: string;
  kind: 'still' | 'clip';
  /** What the picture shows, for a reader who cannot see it. */
  alt: string;
  /** One or two sentences: what to look at. */
  caption: ReactNode;
  provenance: Provenance;
  /** Pixel size of the file, so the page reserves the space before it loads. */
  width: number;
  height: number;
  /** Largest painted width in px. */
  maxWidth?: number;
}

function ProvenanceLine({ p }: { p: Provenance }) {
  return (
    <Box variant="small" color="text-body-secondary">
      <span data-num="provenance">
        Capture: {p.software}; {p.date}; {p.by}.{p.asset ? ` ${p.asset}.` : ''}
      </span>
    </Box>
  );
}

export function Capture({ file, kind, alt, caption, provenance, width, height, maxWidth }: CaptureProps) {
  const frame = { display: 'block', width: '100%', height: 'auto', borderRadius: 8, border: '1px solid #d5dbdb', background: '#eef0f2' } as const;
  return (
    <figure data-capture={kind} style={{ margin: 0 }}>
      <div style={{ maxWidth: maxWidth ?? width, margin: '0 auto' }}>
        {kind === 'still' ? (
          <img src={`${BASE}media/${file}`} alt={alt} width={width} height={height} loading="lazy" decoding="async" style={frame} />
        ) : (
          <video
            controls
            loop
            muted
            playsInline
            preload="none"
            poster={`${BASE}media/${file}-poster.jpg`}
            width={width}
            height={height}
            aria-label={alt}
            style={frame}
          >
            <source src={`${BASE}media/${file}.webm`} type="video/webm" />
            <source src={`${BASE}media/${file}.mp4`} type="video/mp4" />
          </video>
        )}
      </div>
      <figcaption>
        <Box variant="small" color="text-body-secondary">
          {caption}
        </Box>
        <ProvenanceLine p={provenance} />
      </figcaption>
    </figure>
  );
}

/**
 * A dated slot for a capture that will be recorded on the owner's own machines or with the cameras
 * on the real arms. It says what will be shown and links to the first-party page meanwhile.
 */
export function CaptureSlot({ what, meanwhile }: { what: ReactNode; meanwhile?: ReactNode }) {
  return (
    <div data-placeholder="true" data-capture-slot="true">
      <Alert type="info" header="Capture slot, dated 2026-11-20">
        <Box variant="p">
          <Box variant="strong" display="inline">
            What will be shown here:
          </Box>{' '}
          {what}
        </Box>
        {meanwhile && (
          <Box variant="p">
            <Box variant="strong" display="inline">
              Until then:
            </Box>{' '}
            {meanwhile}
          </Box>
        )}
      </Alert>
    </div>
  );
}

/** Provenance shared by every SO-101 capture made for this dive (see public/media/PROVENANCE.md). */
export const MUJOCO_SO101: Provenance = {
  software: 'MuJoCo 4.0.1, offscreen renderer',
  date: '2026-11-20',
  by: 'made for this dive on a Mac; scripted motion, no learned policy',
  asset: 'SO-101 model from TheRobotStudio/SO-ARM100 at commit 141aea7 (Apache-2.0)',
};

/** A number read off one of our own captures; the capture's provenance line is its source. */
export function Seen({ children }: { children: ReactNode }) {
  return <span data-num="capture">{children}</span>;
}
