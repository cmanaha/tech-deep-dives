# gate-content-overflow (desktop-1440)

Status: **PASS** (0 finding(s))

| field | value |
| --- | --- |
| generated | 2026-08-04T06:39:17.295Z |
| viewport | 1440 x 900 |
| base URL | http://127.0.0.1:4173/ |
| sections visited | 20 |
| sections measured checked | 20 |

## Scope

- Elements inside an ancestor whose overflow-x is auto, scroll or hidden are out of scope. Those containers hold their content on purpose.
- Only elements crossing the right edge are reported. In an LTR layout nothing left of the origin widens the document, and left: -10000px is how Cloudscape hides text for screen readers.
- Only the deepest offender is reported, widest first. An ancestor that is wide only because a child is wide adds nothing.
- Collapsed ExpandableSections are opened first, so content that is hidden by default is still measured.

## Findings

None.

## Sections visited

overview, datapath, srd, device, libfabric, ena, topology, instances, nccl, training, inference, hpc, storage, comparison, eks, sagemaker, operations, pricing, decision, sources
