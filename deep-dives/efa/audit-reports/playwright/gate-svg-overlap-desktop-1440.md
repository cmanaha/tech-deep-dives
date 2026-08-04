# gate-svg-overlap (desktop-1440)

Status: **PASS** (0 finding(s))

| field | value |
| --- | --- |
| generated | 2026-08-04T05:31:46.870Z |
| viewport | 1440 x 900 |
| base URL | http://127.0.0.1:4173/ |
| sections visited | 20 |
| diagrams checked | 31 |

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

overview, datapath, srd, device, libfabric, ena, topology, instances, nccl, training, inference, hpc, storage, comparison, eks, sagemaker, operations, pricing, decision, sources
