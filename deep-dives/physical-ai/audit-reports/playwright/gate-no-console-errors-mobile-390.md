# gate-no-console-errors (mobile-390)

Status: **PASS** (0 finding(s))

| field | value |
| --- | --- |
| generated | 2026-11-20T19:51:48.598Z |
| viewport | 390 x 844 |
| base URL | http://127.0.0.1:4184/ |
| sections visited | 26 |
| console messages checked | 4 |

## Scope

- Run against the Vite dev server on purpose. React strips its development warnings from a production build and this dive also sets terser drop_console, so the same gate aimed at dist/ would pass without being able to see anything.
- Counted as findings: any console.error, any uncaught page error, any failed script or stylesheet request, and console.warn messages matching the React warning patterns in this file.
- Ignored: Vite HMR connection chatter and the React DevTools suggestion.

## Findings

None.

## Sections visited

one-loop, getting-started, robot-computer, demonstrations, vla, world-models, jepa, robot-rl, collecting, curating, augmentation, physics, rendering, sim-to-real, training-scales, evaluation, on-robot, fleet, agents, workloads, pmu-cards, measurements, price-performance, aws-orchestration, choosing, sources
