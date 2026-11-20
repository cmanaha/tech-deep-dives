# gate-content-overflow (desktop-1440)

Status: **PASS** (0 finding(s))

| field | value |
| --- | --- |
| generated | 2026-11-20T19:50:25.501Z |
| viewport | 1440 x 900 |
| base URL | http://127.0.0.1:4183/ |
| sections visited | 26 |
| sections measured checked | 26 |

## Scope

- Elements inside an ancestor whose overflow-x is auto, scroll or hidden are out of scope. Those containers hold their content on purpose.
- Only elements crossing the right edge are reported. In an LTR layout nothing left of the origin widens the document, and left: -10000px is how Cloudscape hides text for screen readers.
- Only the deepest offender is reported, widest first. An ancestor that is wide only because a child is wide adds nothing.
- Collapsed ExpandableSections are opened first, so content that is hidden by default is still measured.

## Findings

None.

## Sections visited

one-loop, getting-started, robot-computer, demonstrations, vla, world-models, jepa, robot-rl, collecting, curating, augmentation, physics, rendering, sim-to-real, training-scales, evaluation, on-robot, fleet, agents, workloads, pmu-cards, measurements, price-performance, aws-orchestration, choosing, sources
