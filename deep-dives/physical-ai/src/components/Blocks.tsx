import type { ReactNode } from 'react';
import Alert from '@cloudscape-design/components/alert';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';

/**
 * A dated placeholder: one plain block that says which measurement or figure will land here and
 * where it will come from. Allowed only in sections 17, 18, 22, 23 and 24 (measurements, the IoT
 * hook-up, prices).
 */
export function Placeholder({ what, source }: { what: ReactNode; source: ReactNode }) {
  return (
    <div data-placeholder="true">
      <Alert type="info" header="Placeholder, dated 2026-11-20">
        <SpaceBetween size="xxs">
          <Box variant="p">
            <Box variant="strong" display="inline">
              What will land here:
            </Box>{' '}
            {what}
          </Box>
          <Box variant="p">
            <Box variant="strong" display="inline">
              Where it will come from:
            </Box>{' '}
            {source}
          </Box>
        </SpaceBetween>
      </Alert>
    </div>
  );
}

/**
 * A configuration or code snippet taken from a pinned first-party source. `mode` says whether the
 * text is a verbatim copy or was adapted (names, sizes) from the source; `source` is the Cite.
 */
export function Snippet({
  title,
  mode,
  source,
  ours,
  children,
}: {
  title: string;
  mode: 'copied' | 'adapted';
  source: ReactNode;
  /**
   * For an adapted or assembled snippet: one sentence naming the values that are this dive's
   * choices and not the source's ("the names, the instance list and the 256 vCPU ceiling are
   * ours"). With it, the citation check treats the numbers inside the block as ours.
   */
  ours?: ReactNode;
  children: string;
}) {
  return (
    <div data-snippet={mode}>
      <SpaceBetween size="xxs">
        <Box variant="strong">{title}</Box>
        <pre data-num={ours ? 'adapted' : undefined} style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>
          <code>{children}</code>
        </pre>
        <Box variant="small" color="text-body-secondary">
          {mode === 'copied' ? 'Copied from' : 'Adapted from'} {source}
          {ours && (
            <>
              {' '}
              <span data-num="adapted">Our choices: {ours}</span>
            </>
          )}
        </Box>
      </SpaceBetween>
    </div>
  );
}
