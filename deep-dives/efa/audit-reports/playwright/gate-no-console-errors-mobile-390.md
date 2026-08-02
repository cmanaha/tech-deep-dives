# gate-no-console-errors (mobile-390)

Status: **PASS** (0 finding(s))

| field | value |
| --- | --- |
| generated | 2026-08-02T21:12:25.847Z |
| viewport | 390 x 844 |
| base URL | http://127.0.0.1:4174/ |
| sections visited | 20 |
| console messages checked | 4 |

## Scope

- Run against the Vite dev server on purpose. React strips its development warnings from a production build and this dive also sets terser drop_console, so the same gate aimed at dist/ would pass without being able to see anything.
- Counted as findings: any console.error, any uncaught page error, any failed script or stylesheet request, and console.warn messages matching the React warning patterns in this file.
- Ignored: Vite HMR connection chatter and the React DevTools suggestion.

## Findings

None.

## Sections visited

overview, datapath, srd, device, libfabric, ena, topology, instances, nccl, training, inference, hpc, storage, comparison, eks, sagemaker, operations, pricing, decision, sources
