import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from '../App';

/**
 * The previous version of this test asserted
 *   expect(container.querySelector('#root, [class]')).toBeDefined()
 * which cannot fail: querySelector returns Element or null, never undefined,
 * and toBeDefined passes on null. Worse, every section is React.lazy behind a
 * Suspense boundary, so a synchronous render only ever produced the spinner
 * and no section component was ever mounted.
 *
 * These assertions can actually fail.
 */

describe('App', () => {
  it('renders the deep dive title', () => {
    render(<App />);
    expect(screen.getAllByText(/Elastic Fabric Adapter/i).length).toBeGreaterThan(0);
  });

  it('mounts a real section once the lazy boundary resolves', async () => {
    render(<App />);
    // findBy* retries until the Suspense fallback is replaced by real content.
    const heading = await screen.findByRole('heading', { level: 1 }, { timeout: 5000 });
    expect(heading.textContent).toBeTruthy();
    expect(heading.textContent).not.toMatch(/loading/i);
  });

  it('offers navigation to both sibling deep dives', () => {
    render(<App />);
    expect(screen.getAllByText(/Silicon, Memory/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/vLLM/i).length).toBeGreaterThan(0);
  });
});
