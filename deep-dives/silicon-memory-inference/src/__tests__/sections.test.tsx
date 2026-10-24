import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { sectionTitles } from '../sectionTitles';

/**
 * Mounts every section component for real. A section that throws at render
 * time (a bad import, an undefined source key, a broken table definition)
 * fails here instead of on a reader's phone.
 */
type SectionModule = Record<string, unknown>;

const modules = import.meta.glob<SectionModule>('../sections/*.tsx', { eager: true });

const sections = Object.entries(modules).map(([path, mod]) => {
  const name = path.replace(/^.*\//, '').replace(/\.tsx$/, '');
  const component = mod[name];
  return [name, component] as const;
});

describe('sections', () => {
  it('exports one component per section file, named after the file', () => {
    const missing = sections.filter(([, c]) => typeof c !== 'function').map(([n]) => n);
    expect(missing).toEqual([]);
  });

  it('gives every section file a reader title for the sources appendix', () => {
    const untitled = sections.map(([n]) => n).filter((n) => !(n in sectionTitles));
    expect(untitled).toEqual([]);
  });

  it.each(sections)('%s mounts and renders an h1', (_name, component) => {
    const Section = component as React.FC;
    const { container } = render(<Section />);
    expect(container.querySelector('h1')).not.toBeNull();
    cleanup();
  });
});
