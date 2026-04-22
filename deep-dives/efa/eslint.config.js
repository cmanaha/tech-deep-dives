import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';

// Tier 1 deterministic lint gates for deep-dive content.
// See docs/adr/0004-agent-driven-quality-gates.md (forthcoming) for the
// two-tier discipline. Rules here must be deterministic and repeatable.

export default tseslint.config(
  { ignores: ['dist'] },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [tseslint.configs.recommended],
    plugins: {
      react: reactPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // Catches raw `<` and `>` in JSX text children.
      // Example bugs this prevents: a claim like `<500ns` or `>1 TB/s`
      // written inline becomes an unclosed JSX tag and either fails to
      // build or renders as a silent text fragment.
      //
      // `&` is NOT forbidden here — ampersands like "AI/ML & HPC" are
      // legitimate JSX text that React handles correctly. The HTML
      // validator gate (scripts/gates/html-validate.sh) catches raw `&`
      // in static index.html files where escaping actually matters.
      //
      // Quote forms are also left to default — Cloudscape-heavy content
      // uses them extensively and they render fine.
      'react/no-unescaped-entities': [
        'error',
        {
          forbid: ['>', '<'],
        },
      ],
    },
  }
);
