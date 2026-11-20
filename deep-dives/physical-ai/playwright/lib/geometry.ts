import type { Page } from '@playwright/test';

/**
 * Geometry probes that run inside the page.
 *
 * Everything about SVG text is reported in viewBox user units, not screen
 * pixels. That is deliberate: the authored coordinates in the section .tsx
 * files are user units, so a finding of "overlaps by 9.4 units at x=448" maps
 * straight onto the x/y attributes a human has to edit. Screen pixels would
 * change with the viewport and tell nobody where to look.
 *
 * The conversion uses the inverse of the outer svg's screen CTM applied to
 * each text node's client rect. Client rects already include every ancestor
 * transform, so nested translate groups are handled without walking them.
 */

export interface SvgTextBox {
  /** Rendered string, collapsed to one line. */
  text: string;
  /** Authored x/y attributes, when present. Local to any enclosing group. */
  attrX: string | null;
  attrY: string | null;
  /** Bounding box in viewBox user units. */
  left: number;
  top: number;
  right: number;
  bottom: number;
  /**
   * Rendered font size in screen pixels.
   *
   * Not the same as the authored font size. getComputedStyle on an SVG text
   * node reports the size in user units, so a 10px label inside an 880-unit
   * viewBox drawn 330px wide actually paints at 10 * 330/880, under 4px. The
   * viewBox scale has to be applied or this number is just the source value
   * read back.
   */
  screenFontPx: number;
}

export interface SvgProbe {
  /** The svg's <title>, which is what a human recognizes the diagram by. */
  title: string;
  /** aria-labelledby value, used as a fallback identifier. */
  labelledBy: string | null;
  index: number;
  viewBox: { x: number; y: number; width: number; height: number } | null;
  screenWidth: number;
  texts: SvgTextBox[];
}

/** Collects every authored diagram in the content region. */
export async function probeSvgs(page: Page): Promise<SvgProbe[]> {
  return page.evaluate(() => {
    const main = document.querySelector('main');
    const h1 = main?.querySelector('h1');
    if (!main || !h1) return [];
    let root: Element = h1;
    while (root.parentElement && root.parentElement !== main) {
      root = root.parentElement;
    }

    const collapse = (value: string | null): string =>
      (value ?? '').replace(/\s+/g, ' ').trim();

    const out: SvgProbe[] = [];
    const svgs = Array.from(root.querySelectorAll('svg'));

    svgs.forEach((svg, index) => {
      const rawTexts = Array.from(svg.querySelectorAll('text')).filter((el) => {
        if (el.closest('defs, clipPath, mask, marker, symbol, pattern')) return false;
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      });
      // No rendered <text> means this is a Cloudscape icon, not an authored
      // diagram. Only diagrams are in scope for an overlap gate.
      if (rawTexts.length === 0) return;

      const ctm = svg.getScreenCTM();
      if (!ctm) return;
      const inverse = ctm.inverse();
      const toUser = (rect: DOMRect) => {
        const a = new DOMPoint(rect.left, rect.top).matrixTransform(inverse);
        const b = new DOMPoint(rect.right, rect.bottom).matrixTransform(inverse);
        return {
          left: Math.min(a.x, b.x),
          top: Math.min(a.y, b.y),
          right: Math.max(a.x, b.x),
          bottom: Math.max(a.y, b.y),
        };
      };

      const vb = svg.viewBox?.baseVal ?? null;
      const titleEl = svg.querySelector(':scope > title');
      // Uniform scale from user units to screen pixels. These diagrams all use
      // the default preserveAspectRatio, so the x scale is the whole story.
      const userToScreen = Math.abs(ctm.a) || 1;

      out.push({
        title: collapse(titleEl?.textContent ?? null),
        labelledBy: svg.getAttribute('aria-labelledby'),
        index,
        viewBox:
          vb && vb.width > 0
            ? { x: vb.x, y: vb.y, width: vb.width, height: vb.height }
            : null,
        screenWidth: svg.getBoundingClientRect().width,
        texts: rawTexts.map((el) => {
          const box = toUser(el.getBoundingClientRect());
          const fontUnits = Number.parseFloat(window.getComputedStyle(el).fontSize) || 0;
          return {
            text: collapse(el.textContent),
            attrX: el.getAttribute('x'),
            attrY: el.getAttribute('y'),
            ...box,
            screenFontPx: fontUnits * userToScreen,
          };
        }),
      });
    });

    return out;
  });
}

export interface OverflowProbe {
  innerWidth: number;
  documentScrollWidth: number;
  /** Elements pushing the document wider than the viewport. */
  wideElements: Array<{ selector: string; text: string; left: number; right: number }>;
  /** Diagrams wider than the box they sit in. */
  svgOverflows: Array<{ title: string; overshootLeft: number; overshootRight: number }>;
}

/** Measures horizontal overflow at the document level and per diagram. */
export async function probeOverflow(page: Page): Promise<OverflowProbe> {
  return page.evaluate(() => {
    const TOL = 1;
    const innerWidth = window.innerWidth;
    const documentScrollWidth = Math.max(
      document.documentElement.scrollWidth,
      document.body.scrollWidth,
    );

    const describe = (el: Element): string => {
      const cls = String((el as HTMLElement).className ?? '')
        .split(/\s+/)
        .filter((c) => c.length > 0 && !/^awsui_/.test(c))
        .slice(0, 2)
        .join('.');
      const id = el.id ? `#${el.id}` : '';
      const awsui = String((el as HTMLElement).className ?? '').match(
        /awsui_([a-z0-9-]+)_/i,
      );
      const tag = el.tagName.toLowerCase();
      return `${tag}${id}${cls ? `.${cls}` : ''}${awsui ? `[${awsui[1]}]` : ''}`;
    };

    const containedByScroller = (el: Element): boolean => {
      let parent = el.parentElement;
      while (parent) {
        const overflowX = window.getComputedStyle(parent).overflowX;
        if (overflowX === 'auto' || overflowX === 'scroll' || overflowX === 'hidden') {
          return true;
        }
        parent = parent.parentElement;
      }
      return false;
    };

    const wideElements: OverflowProbe['wideElements'] = [];
    if (documentScrollWidth > innerWidth + TOL) {
      const candidates = Array.from(document.querySelectorAll<HTMLElement>('body *'));
      candidates.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        // Right edge only. In an LTR layout nothing to the left of the origin
        // widens the document, and the far-left idiom (left: -10000px) is how
        // Cloudscape hides text for screen readers. Flagging those would bury
        // the real cause under accessibility markup.
        if (rect.right <= innerWidth + TOL) return;
        if (containedByScroller(el)) return;
        // Only report the deepest offenders. An ancestor that is wide only
        // because its child is wide is noise.
        const childIsAlsoWide = Array.from(el.children).some(
          (child) => child.getBoundingClientRect().right > innerWidth + TOL,
        );
        if (childIsAlsoWide) return;
        wideElements.push({
          selector: describe(el),
          text: (el.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 80),
          left: Math.round(rect.left),
          right: Math.round(rect.right),
        });
      });
      // Widest offender first, so the element that caused the overflow leads
      // rather than whichever one the DOM walk happened to reach first.
      wideElements.sort((a, b) => b.right - a.right);
    }

    const main = document.querySelector('main');
    const h1 = main?.querySelector('h1');
    const svgOverflows: OverflowProbe['svgOverflows'] = [];
    if (main && h1) {
      let root: Element = h1;
      while (root.parentElement && root.parentElement !== main) {
        root = root.parentElement;
      }
      Array.from(root.querySelectorAll('svg')).forEach((svg) => {
        const parent = svg.parentElement;
        if (!parent) return;
        const rect = svg.getBoundingClientRect();
        if (rect.width === 0) return;
        const style = window.getComputedStyle(parent);
        const parentRect = parent.getBoundingClientRect();
        const boxLeft = parentRect.left + Number.parseFloat(style.paddingLeft || '0');
        const boxRight = parentRect.right - Number.parseFloat(style.paddingRight || '0');
        const overshootLeft = boxLeft - rect.left;
        const overshootRight = rect.right - boxRight;
        if (overshootLeft > TOL || overshootRight > TOL) {
          const titleEl = svg.querySelector(':scope > title');
          svgOverflows.push({
            title: (titleEl?.textContent ?? svg.getAttribute('aria-labelledby') ?? 'untitled svg')
              .replace(/\s+/g, ' ')
              .trim()
              .slice(0, 90),
            overshootLeft: Math.round(overshootLeft * 10) / 10,
            overshootRight: Math.round(overshootRight * 10) / 10,
          });
        }
      });
    }

    return { innerWidth, documentScrollWidth, wideElements, svgOverflows };
  });
}

/** Short, stable label for a diagram in a report. */
export function diagramLabel(probe: SvgProbe): string {
  const title = probe.title.length > 0 ? probe.title : '';
  const id = probe.labelledBy ?? `svg#${probe.index}`;
  if (title.length === 0) return `${id} (no <title>)`;
  const short = title.length > 110 ? `${title.slice(0, 110)}...` : title;
  return `${id} - ${short}`;
}

export const round1 = (value: number): number => Math.round(value * 10) / 10;
