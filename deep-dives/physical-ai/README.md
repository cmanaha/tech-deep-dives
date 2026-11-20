# Physical AI

**From a Robot's Demonstrations to a Fleet That Learns.** One arm, one task, every workload in the loop: the models,
the data, the simulation, the part of the machine each one loads, and how to orchestrate it on AWS.

**Status (2026-11-20):** research complete to Gate 1 of the iteration flywheel (ADR-003). Gate 1 checks 1 to 4 are
recorded in `RESEARCH-GUIDE.md` section 7; check 5, human approval of the section list, is pending. No app section is
written: `src/` holds a placeholder page so that the build gates run.

## What the dive is

A technical reader with no robotics background follows one task, an SO-101 arm picking up a block and placing it in
a cup, through the whole loop: collect demonstrations, process and curate, augment, simulate, train a policy and a
world model, evaluate, deploy to the robot, collect again. Each model family is taught before it is sized (imitation
learning, vision-language-action models, world models, JEPA in depth, reinforcement learning). The compute sections
then show which part of the machine each workload loads, and the AWS sections end with one table: workload, machine
part, instance family, orchestrator, capacity market, why.

26 sections are planned in 8 parts. The plan, the reader, the thesis and the numbers each section will print are in
`SCOPE.md`.

## What is here

| Path | What it holds |
|---|---|
| `SCOPE.md` | Reader, thesis, nine questions, the 26-section plan, numbers by section with register IDs, changes to the approved plan |
| `RESEARCH-GUIDE.md` | Research waves, reading path, evidence bar per claim type, Tier 0 requests, triage of every unknown, the Gate 1 record, the budget record |
| `research/2026-11/01` to `09` | Nine claim registers, 915 entries. Each entry has an ID, the claim, a pinned source, tier, evidence kind, a verbatim quote, a verdict and the section it feeds |
| `research/2026-11/wave2-A.md`, `-B.md`, `-C.md` | The refutation and freshness pass: one verdict row per load-bearing claim, by an agent that did not write the register |
| `research/experiments/` | Tier 0 results on hand (CPU stand-in workloads on a Jetson Orin Nano Super and a DGX Spark), with provenance and limits |
| `sources.md` | Every source, grouped by tier, then by register |
| `src/` | Placeholder app (one status section). `src/sections/` is created after Gate 1 |

## What the research found

Each line carries the register entries that hold the pinned source and the quote. Vendor and author figures are the
publisher's own.

- **Simulation and training are bought in different markets.** EC2 Capacity Blocks for ML list P and Trainium types
  only, and the SageMaker training plans list has no G-family type, so a fleet of ray-tracing GPUs cannot be reserved
  the way a training cluster can (F09-91, F09-35). No AWS page comparing AWS Batch, SageMaker HyperPod and Amazon EKS
  side by side for these workloads was located in this research (F09-110).
- **The ray-tracing rule is narrower than "Isaac needs a G instance".** Isaac Sim 6.2.0 states "GPUs without RT Cores
  (A100, H100) are not supported" (F06-52). Isaac Lab 3.0 states "Headless Newton simulation does not require RTX
  hardware" (F06-51). The rule holds for RTX rendering and for Isaac Sim itself.
- **Planning in latent space is slow today.** V-JEPA 2-AC takes 16 seconds per action on one RTX 4090 `[author
  reported]` (F03-25); the V-JEPA 2.1 paper reports 3 seconds on one A100 for the same settings `[author reported]`
  (F03-74). NVIDIA's GR00T 2, a world-action model, reports a median 153 ms per action chunk on an RTX 5090 for one
  robot and configuration after inference optimisation `[vendor claim]`, with code "Available in December" (F03-104).
  V-JEPA 2.1 (2026-03-16) and RoboJEPA (2026-10-07) are newer than the models the seed research named (F03-72, F03-75).
- **The thread task exists first-party.** MuJoCo Playground 1.0.0 (2026-11-06) ships an SO-101 vision pick-cube task
  trained in simulation and run on the real arm, without a published success rate, and a system identification script
  that fits 24 parameters of the arm (F06-25, F06-26, F06-30). LeRobot v0.7.0 replaced asynchronous inference with
  remote inference over Zenoh and wraps GR00T N1.7 only (F07-25, F02-47).
- **The video path has its own hardware.** LeRobot v0.7.0 encodes AV1 in software with a GOP size of 2 (F05-35). The
  A100 and H100 have no hardware encoder and cannot decode AV1 in hardware (F05-46, F05-47), so on those GPUs decode
  falls on the instance's CPU cores, 24 vCPUs per GPU on the eight-GPU sizes (F05-65).

## Standards

Sources are graded Tier 0 (our experiments) to Tier 4 (tutorials and press, for locating sources only). Every version
named in the registers was fetched on 2026-11-20. A source older than 2025 appears only as labelled history or as the
paper that introduced a concept. "Not located in this research" is never written as "does not exist".

## Build

```
pnpm --filter @tech-deep-dives/physical-ai build
bash scripts/ci.sh
```

Both run from the repository root.
