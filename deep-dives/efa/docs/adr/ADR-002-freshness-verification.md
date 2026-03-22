# ADR-002: Agentic Freshness Verification System

## Status
Accepted (design phase — not yet implemented)

## Context
Documentation ages badly. Even authoritative AWS docs can be outdated within months as new instance types, API changes, and pricing updates ship. The EFA deep dive cites 28+ sources — any of which can go stale. Manual re-verification doesn't scale.

The deeper problem: docs can lie by omission. Code and APIs at HEAD don't. The experiment is the ultimate source of truth.

## Decision
Three-layer verification system (to be implemented incrementally):

### Layer 1: Agentic CI/CD Freshness Loop
- Periodic agent runs (weekly/monthly) that re-verify cited claims against current sources
- Agent checks: do cited URLs still return the same data? Have version numbers changed? Do API responses match documented behavior?
- Output: freshness report per deep dive — which claims are still verified, which are stale, which need human review
- Human-in-the-loop: agent proposes updates, human approves before publishing

### Layer 2: Reproducible Micro-Experiments
- IaC-managed (CDK/CloudFormation) mini-benchmarks that confirm specific quantitative claims
- Examples: MPI ping-pong latency on EFA, DescribeInstanceTypes for interface counts, NCCL bandwidth tests
- Each experiment: spin up infrastructure, run test, capture result, tear down. Zero residual cloud resources.
- Results become Tier 0 sources (our own verified data) — highest authority
- Version-controlled in deep-dives/{topic}/experiments/

### Layer 3: Code/API Introspection
- Monitor upstream repos (aws-ofi-nccl releases, NCCL releases, amzn-drivers, libfabric) for changes that affect deep dive claims
- Agent reads changelogs and source diffs, identifies affected claims, flags for re-verification
- Triggered by: new release tags, significant commits to monitored repos

## Consequences
- Deep dive authority comes from verified claims, not just cited docs
- Each claim has a verification date and method (doc check, API probe, experiment)
- Stale claims are visually flagged in the UI (not silently wrong)
- Micro-experiments require AWS credentials and cost money — budget per verification run
- The freshness loop is itself an agent that needs monitoring (who watches the watchers?)

## Alternatives Considered
- Manual periodic review: doesn't scale, gets skipped
- Relying on doc update dates: docs don't always update when they should
- Crowdsourced verification: no community yet, single-user project
