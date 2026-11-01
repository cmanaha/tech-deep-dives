# 00 Orchestrator notes: facts fetched during synthesis

Entries the orchestrator recorded while writing `SCOPE.md` and `RESEARCH-GUIDE.md`, in the register
format of `wave1-brief.md`. Accessed 2026-10-30.

## Claim register

**T00-1. FSx for Lustre Persistent SSD storage in us-east-1 is priced per GB-month by throughput tier: $0.145 at 125 MB/s per TiB, $0.210 at 250, $0.340 at 500 and $0.600 at 1,000; persistent HDD at 12 and 40 MB/s per TiB is $0.025 and $0.083; backup storage $0.05 per GB-month.**
- Location: AWS Price List bulk offer file for AmazonFSx, us-east-1, offer version 20260911124432 (publication date 2026-09-11), products with `fileSystemType` Lustre and deployment option Persistent, OnDemand terms.
- Verdict: NEW
- Evidence: https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonFSx/current/us-east-1/index.json | Tier 1, first-party pricing data | pricing | "$0.600 per GB-Month of persistent SSD Lustre storage with 1000 MB/s per TiB - US East (N. Virginia)"; "$0.145 per GB-Month of persistent SSD Lustre storage with 125 MB/s per TiB - US East (N. Virginia)" (accessed 2026-10-30)
- Use in dive: section 18 (Calculator D's storage cost line) and section 23; experiment A3's cost. The offer does not say whether "GB" here is decimal or binary (see U04-7), so monthly figures derived from it are stated to two significant figures.

## Worked numbers

- The 60 s blocking save of the Llama 3.1 70B checkpoint needs about 16.5 TiB of PERSISTENT-1000 (register 04 W2). At $0.600 per GB-month that is about $10,000 to $11,000 a month (16,896 GB-months if the unit is GiB-based, 18,142 if decimal) [derived, T00-1].
- The 300 s blocking save needs 3.3 TiB of PERSISTENT-1000, about $2,000 to $2,200 a month [derived, T00-1, register 04 W2].
- A 4.8 TiB PERSISTENT-1000 file system kept for 8 hours for experiment A3 costs about $32 to $35 [derived: 4,915 to 5,278 GB x $0.600 / 730 h x 8 h].
