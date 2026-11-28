# gate-routes (desktop-1440)

Status: **PASS** (0 finding(s))

| field | value |
| --- | --- |
| generated | 2026-11-28T10:19:32.164Z |
| viewport | 1440 x 900 |
| base URL | http://127.0.0.1:4183/ |
| sections visited | 30 |
| nav sections checked | 30 |

## Scope

- Served from the production build in dist/, which is what ships.
- A section counts as mounted only when a new h1 replaces the previous one, so a stuck Suspense spinner reads as a failure rather than a pass.
- At 390 wide the side nav starts closed, so each click also exercises the drawer toggle.

## Findings

None.

## Sections visited

one-loop, getting-started, robot-computer, demonstrations, vla, world-models, jepa, robot-rl, collecting, curating, augmentation, physics, rendering, sim-to-real, training-scales, evaluation, on-robot, fleet, agents, workloads, pmu-cards, measurements, price-performance, aws-orchestration, aws-batch, aws-pcs, hyperpod, eks, choosing, sources
