import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';

// Tier 1 deterministic lint gates for deep-dive content.
// Template config — new deep dives inherit these rules automatically.
// See docs/adr/0004-agent-driven-quality-gates.md (forthcoming).

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
      // Catches raw `<` / `>` in JSX text. See efa/eslint.config.js for
      // full rationale. HTML validator handles raw `&` in static HTML.
      'react/no-unescaped-entities': [
        'error',
        {
          forbid: ['>', '<'],
        },
      ],
    },
  }
);
