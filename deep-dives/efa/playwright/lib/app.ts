import type { Page } from '@playwright/test';

/**
 * Navigation helpers for the EFA deep dive shell.
 *
 * The app has no router. All 20 sections are React.lazy components behind a
 * single Suspense boundary, switched by a nav click that calls setState. So
 * "visit a section" means "click its side-nav link and wait for the new h1 to
 * replace the old one", not "goto a URL". A broken lazy import shows up here
 * and nowhere else: the Suspense fallback never resolves, no h1 ever appears,
 * and the wait times out.
 *
 * At 390 wide the Cloudscape AppLayout keeps the side nav in a closed drawer,
 * so the link has to be revealed with the hamburger toggle first. The drawer
 * closes itself once a link is followed.
 */

const NAV_TOGGLE = 'button[class*="awsui_navigation-toggle"]';

/** Opens the app and waits for the first section to mount. */
export async function openApp(page: Page, baseUrl: string): Promise<string> {
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  return waitForSectionMounted(page, null);
}

/** Clicks a section's nav link, opening the mobile drawer first if needed. */
export async function selectSection(page: Page, id: string): Promise<void> {
  const link = page.locator(`a[href="#${id}"]`);
  if (!(await link.isVisible())) {
    const toggle = page.locator(NAV_TOGGLE);
    if (await toggle.isVisible()) {
      await toggle.click();
      await link.waitFor({ state: 'visible', timeout: 15_000 });
    }
  }
  await link.click();
}

/** The section the side nav currently marks as active, or null. */
export async function activeSectionId(page: Page): Promise<string | null> {
  return page.evaluate(() => {
    const current = document.querySelector('a[href^="#"][aria-current="page"]');
    const href = current?.getAttribute('href') ?? '';
    return href.length > 1 ? href.slice(1) : null;
  });
}

/**
 * Selects a section and waits for its body to mount. Returns the new h1.
 *
 * The app boots with its first section already selected, so clicking that
 * section's link changes nothing and there is no h1 transition to wait for.
 * Reading aria-current before the click is what tells the two cases apart.
 */
export async function visitSection(
  page: Page,
  id: string,
  previousH1: string | null,
): Promise<string> {
  const alreadyActive = (await activeSectionId(page)) === id;
  await selectSection(page, id);
  return waitForSectionMounted(page, alreadyActive ? null : previousH1);
}

/**
 * Waits until an h1 is present in the content region whose text differs from
 * `previousH1`. Returns the new h1 text.
 *
 * All 20 section titles are distinct, so a changed h1 is proof that the lazy
 * chunk resolved and the section body mounted rather than the Suspense
 * spinner still standing in for it.
 */
export async function waitForSectionMounted(
  page: Page,
  previousH1: string | null,
): Promise<string> {
  await page.waitForFunction(
    (prev) => {
      const h1 = document.querySelector('main h1');
      if (!h1) return false;
      const text = (h1.textContent ?? '').trim();
      if (text.length === 0) return false;
      return prev === null || text !== prev;
    },
    previousH1,
    { timeout: 45_000 },
  );
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  return (await page.locator('main h1').first().innerText()).trim();
}

/**
 * Expands every collapsed ExpandableSection in the content region.
 *
 * Diagrams authored inside a collapsed section have zero-size bounding boxes
 * and would be silently skipped by the geometry gates, which is the opposite
 * of what an audit should do. Buttons inside a nav are left alone so the
 * breadcrumb popover and the drawer toggle do not get clicked.
 */
export async function expandAllSections(page: Page): Promise<number> {
  let total = 0;
  for (let pass = 0; pass < 6; pass += 1) {
    const opened = await page.evaluate(() => {
      const main = document.querySelector('main');
      const h1 = main?.querySelector('h1');
      if (!main || !h1) return 0;
      let root: Element = h1;
      while (root.parentElement && root.parentElement !== main) {
        root = root.parentElement;
      }
      const targets = Array.from(
        root.querySelectorAll<HTMLElement>('[aria-expanded="false"]'),
      ).filter((el) => {
        if (el.closest('nav')) return false;
        const role = el.getAttribute('role');
        if (el.tagName !== 'BUTTON' && role !== 'button') return false;
        return el.getBoundingClientRect().width > 0;
      });
      targets.forEach((el) => el.click());
      return targets.length;
    });
    total += opened;
    if (opened === 0) break;
    await page.waitForTimeout(250);
  }
  if (total > 0) {
    await page.waitForTimeout(300);
    await page.evaluate(() => document.fonts.ready.then(() => undefined));
  }
  return total;
}
