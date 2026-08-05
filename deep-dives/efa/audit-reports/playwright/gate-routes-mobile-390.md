# gate-routes (mobile-390)

Status: **PASS** (0 finding(s))

| field | value |
| --- | --- |
| generated | 2026-08-05T23:05:24.692Z |
| viewport | 390 x 844 |
| base URL | http://127.0.0.1:4173/ |
| sections visited | 20 |
| nav sections checked | 20 |

## Scope

- Served from the production build in dist/, which is what ships.
- A section counts as mounted only when a new h1 replaces the previous one, so a stuck Suspense spinner reads as a failure rather than a pass.
- At 390 wide the side nav starts closed, so each click also exercises the drawer toggle.

## Findings

None.

## Sections visited

overview, datapath, srd, device, libfabric, ena, topology, instances, nccl, training, inference, hpc, storage, comparison, eks, sagemaker, operations, pricing, decision, sources
