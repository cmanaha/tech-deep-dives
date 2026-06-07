# Deep Dive Template

Use this template to scaffold a new deep dive.

## Setup

1. Copy this entire `_template/` directory to `deep-dives/{your-topic}/`:
   ```bash
   cp -r deep-dives/_template deep-dives/my-topic
   ```

2. Update `package.json`:
   - Change `"name": "@tech-deep-dives/TOPIC"` to `"name": "@tech-deep-dives/my-topic"`

3. Update `index.html`:
   - Set the `<title>` to your deep dive title
   - Set the `<meta name="description">` content

4. Update `src/App.tsx`:
   - Replace the `title` and `subtitle` props on `DeepDiveLayout`
   - Define your actual sections in the `sections` array
   - Create section components (recommended: one file per section in `src/sections/`)

5. Install dependencies from the repo root:
   ```bash
   pnpm install
   ```

6. Start the dev server:
   ```bash
   pnpm --filter @tech-deep-dives/my-topic dev
   ```

7. Verify the build passes:
   ```bash
   pnpm --filter @tech-deep-dives/my-topic build
   ```

## Directory Structure

Once set up, your deep dive should have:

```
deep-dives/my-topic/
├── src/
│   ├── main.tsx           # Entry point (usually unchanged)
│   ├── App.tsx            # Section routing and layout
│   └── sections/          # One component per section
├── research/              # Raw research notes with citations
├── iac/                   # CloudFormation/CDK for experiments
├── docs/adr/              # Architecture Decision Records
├── sources.md             # All authoritative sources
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── eslint.config.js
└── index.html
```

## Adding Dependencies

Add React Flow for diagrams:
```bash
pnpm --filter @tech-deep-dives/my-topic add @xyflow/react
```

Add D3 for custom visualizations:
```bash
pnpm --filter @tech-deep-dives/my-topic add d3
pnpm --filter @tech-deep-dives/my-topic add -D @types/d3
```
