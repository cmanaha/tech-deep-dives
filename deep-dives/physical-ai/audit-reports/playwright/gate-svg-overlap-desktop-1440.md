# gate-svg-overlap (desktop-1440)

Status: **PASS** (0 finding(s))

| field | value |
| --- | --- |
| generated | 2026-11-20T20:05:29.347Z |
| viewport | 1440 x 900 |
| base URL | http://127.0.0.1:4183/ |
| sections visited | 26 |
| diagrams checked | 52 |

## Scope

- Scope is every svg in the content region that paints at least one <text>. Cloudscape icon svgs carry no text and are out of scope.
- Geometry is in viewBox user units, converted from client rects through the inverse of the svg screen CTM, so nested transform groups are handled.
- A pair counts as colliding only when the boxes overlap by more than 2 user units on both axes. Text boxes include ascender and descender padding, so adjacent lines of a stacked label do not trip it.
- Text counts as clipped when it sits more than 1 user units outside the viewBox.
- Collapsed ExpandableSections are opened before measuring.
- Advisory only: any diagram whose smallest label renders below 8 screen pixels is listed but does not fail the gate.

## Findings

None.

## Sections visited

one-loop, getting-started, robot-computer, demonstrations, vla, world-models, jepa, robot-rl, collecting, curating, augmentation, physics, rendering, sim-to-real, training-scales, evaluation, on-robot, fleet, agents, workloads, pmu-cards, measurements, price-performance, aws-orchestration, choosing, sources
