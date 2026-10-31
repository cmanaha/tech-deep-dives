# Claims: section 17, Failure Is the Steady State

File: `src/sections/FailureRates.tsx`. Re-opened on 2026-10-31 with plain `curl` into a fresh `/tmp` directory and read as text (Cites carry the default accessed date): Llama 3 Herd of Models HTML v3 (Sec 3.3.1, Table 4, Sec 3.3.4, Table 5 cells); Revisiting Reliability in Large-Scale ML Research Clusters HTML v2 (Abstract, Sec II-B, II-C Observation 2, II-D, II-E, III, Figure 7, Observation 10, IV-A, Observation 11); MegaScale HTML v1 (Sec 6.2, 6.3); metaseq OPT chronicles `final_update.md` and `27_percent_update.md` at f7ffa5fd61cf90f498a36d365c13dd7f1a912ff7; the SageMaker HyperPod product and features pages. Llama 3 v1 and v2 Table 5 were re-read by wave 2 on 2026-10-31 (W4-6), not by this author. Not re-opened, `accessed="2026-10-30"`: the EC2 accelerated computing page (T05-2).

Every MTTF on the page (intro, chart, chart title, table, caption, ending) is computed at render time by `jobMttfSeconds` in `src/lib/checkpoint.ts` with the `FAILURE_RATES` presets in `src/lib/presets.ts` (2.34, 6.50, 17.5). Reproduced with an esbuild bundle of the same library on 2026-10-31: 1 node 10,256 / 3,692 / 1,371 h; 4 nodes 2,564 / 923 / 343 h; 32 nodes 320.5 / 115.4 / 42.9 h; 128 nodes 80.1 / 28.8 / 10.7 h; 1,024 nodes 10.0 / 3.61 / 1.34 h; 2,048 nodes 5.01 / 1.80 / 0.670 h. These match register 04 W1 cell for cell.

Format: claim | source URL | register, wave 2 row or experiment

## Header and opening

- A synchronous job stops when one node stops and restarts from its last checkpoint (definition, our framing of the series-system model) | https://arxiv.org/abs/2410.21680v2 | T04-7, W4-1
- At Meta's measured rates one 8-GPU node runs 154 (6.50) to 427 (2.34) days between failures; a 2,048-node job 1.8 to 5.0 hours (our arithmetic, `jobMttfSeconds`) | https://arxiv.org/abs/2410.21680v2 | 04 W1, W4-2
- Llama 3 405B, trained on up to 16K GPUs, one unexpected interruption every 3.1 hours over a 54-day window of pre-training (54 x 24 / 419 = 3.09 h, our arithmetic) | https://arxiv.org/abs/2407.21783v3 | T04-1, T04-4, W4-4, W4-5 (wording per W4-5 and build-log condition)
- Llama 3 kept more than 90% effective training time | https://arxiv.org/abs/2407.21783v3 | T04-1, W4-4

## A synchronous job fails when any node fails

- Series system: job failure rate is the sum of node rates; MTTF = 1 / (N_nodes x r_f) | https://arxiv.org/abs/2410.21680v2 | T04-7, W4-1
- The formula has no term for model, framework or layout (reading of the formula itself) | https://arxiv.org/abs/2410.21680v2 | T04-7
- RSC-1 16K GPUs general ML, RSC-2 8K GPUs vision; 11 months, 4 million jobs, over 150 million A100 GPU-hours | https://arxiv.org/abs/2410.21680v2 | T04-7
- Both clusters are 8 x A100 80GB per server (node) | https://arxiv.org/abs/2410.21680v2 (Sec II-B, "8 x NVIDIA A100 80GB per server (node)") | verified at source 2026-10-31; not a register row
- r_f 6.50 (RSC-1) and 2.34 (RSC-2) failures per thousand node-days | https://arxiv.org/abs/2410.21680v2 | T04-8, W4-1
- RSC-1's rate moved between about 2.5 and about 17.5 within a year as failure modes came and went | https://arxiv.org/abs/2410.21680v2 | T04-8, W4-1
- Measured job MTTF 47.7 days (8 GPUs) to 7.9 hours (1,024 GPUs); formula at RSC-1's rate projects 1.8 h at 16,384 GPUs | https://arxiv.org/abs/2410.21680v2 | T04-7, W4-1, 04 W1 check
- Chart: three lines from `jobMttfSeconds` at 2.34, 6.50, 17.5; 256-GPU points 13 days, 4.8 days, 1.8 days; 16,384-GPU points 5.0 h, 1.8 h, 40 min | derived | 04 W1, W4-2
- Llama 3's 3.1 h segment spans the 8,192- and 16,384-GPU stages of pre-training (Table 4); the paper does not state the GPU count during the window | https://arxiv.org/abs/2407.21783v3 | W1-55, W4-5 (Table 4 re-read 2026-10-31)
- Every tenfold job size divides the interval by ten; the per-node rate is constant along a line (reading of the formula) | derived | 04 W1 "Reading"
- The rates are Meta's on A100 servers; a fleet of newer instances has its own rate (our reading) | https://arxiv.org/abs/2410.21680v2 | our reading, hedge
- Expandable: r_f counts jobs above 128 GPUs with NODE_FAIL plus FAILED jobs with a critical health check in the last 10 minutes (or 5 minutes after completion), over node-days of runtime | https://arxiv.org/abs/2410.21680v2 | T04-8
- Expandable: measured MTTF introduced with failures from "user programs to system software to hardware faults" | https://arxiv.org/abs/2410.21680v2 (Sec III, "MTTF Decreases at Scale") | verified at source 2026-10-31
- Expandable: 7.9 h measured at 1,024 GPUs is below the formula's 10.7 h at 17.5; the paper does not reconcile them; our reading is that the measured figure counts more kinds of failure; order-of-magnitude aid | derived | 04 W1 checks, scope "order-of-magnitude planning aid"

## What large runs reported

- 466 interruptions in a 54-day snapshot: 47 planned (automated maintenance such as firmware upgrades, operator configuration or dataset changes), 419 unexpected | https://arxiv.org/abs/2407.21783v3 | T04-1, W4-4
- 3.1 hours between unexpected interruptions, 7.8 a day (our arithmetic) | derived | T04-4
- Significant manual intervention only three times; automation handled the rest | https://arxiv.org/abs/2407.21783v3 | T04-1
- About 78% confirmed or suspected hardware | https://arxiv.org/abs/2407.21783v3 | T04-2, W4-4
- Counts: faulty GPU 148, GPU HBM3 72, software bug 54, network switch/cable 35, unplanned host maintenance 32; GPU rows 268 of 419, 64% by count | https://arxiv.org/abs/2407.21783v3 | T04-2, T04-3, U04-1 accept-as-hedge (counts only)
- GPU and its memory are where most interruptions start, so node checks exercising them cover the largest share (our reading of the table) | https://arxiv.org/abs/2407.21783v3 | T04-2 "Use in dive"
- If all 2,048 servers ran throughout, 3.8 per thousand node-days, inside Meta's range; at 8,192 GPUs 7.6; GPU count not stated; counts every cause; consistency check (our arithmetic) | derived | T04-4
- OPT-175B notes cover about 90 restarts over the final model's lineage | https://github.com/facebookresearch/metaseq/blob/f7ffa5fd61cf90f498a36d365c13dd7f1a912ff7/projects/OPT/chronicles/final_update.md | T04-17, W4-29
- At 27%, most of the 40-plus restarts since mid-November due to hardware failures; cloud replacement took hours and often returned the same bad machine; restarts stalled when 1.6 TB checkpoint downloads from the blob store hung | https://github.com/facebookresearch/metaseq/blob/f7ffa5fd61cf90f498a36d365c13dd7f1a912ff7/projects/OPT/chronicles/27_percent_update.md | T04-17, T04-18, W4-29
- MegaScale: more than 10,000 GPUs, several weeks, over 100 restarts; over 90% of software and hardware faults identified and fixed automatically | https://arxiv.org/abs/2402.15627v1 | T04-13, W4-7, U04-11 (NSDI 2024)
- Meta clusters: hardware failures touched under 1% of jobs but 19% of GPU runtime | https://arxiv.org/abs/2410.21680v2 | T04-11, W4-3
- 40 lemon nodes (24 RSC-1, 1.2%; 16 RSC-2, 1.7%), found from health-check and job history; removal cut 512-plus-GPU job failures from 14% to 4% | https://arxiv.org/abs/2410.21680v2 | T04-12, W4-3
- Table 5 first row internally inconsistent in v1 to v3 (148 of 419 is 35.3%, printed 30.1%; 58.7% sums printed percentages); page quotes counts | https://arxiv.org/abs/2407.21783v1, https://arxiv.org/abs/2407.21783v2, https://arxiv.org/abs/2407.21783v3 | T04-3, C04-1, W4-6, U04-1

## Goodput at that failure rate

- ETTR is productive runtime of a job run over its wallclock | https://arxiv.org/abs/2410.21680v2 | T04-9, W4-41
- Wallclock = queue + productive + unproductive; three unproductive sources: re-training since last checkpoint, restart overhead, checkpoint overhead | https://arxiv.org/abs/2410.21680v2 (Sec II-D, Sec III) | T04-9; three sources verified at source 2026-10-31
- On a reservation held for the whole run the queue term drops out (our reading) | https://arxiv.org/abs/2410.21680v2 | W4-41 note
- About 90% at 10K to 16K GPUs with heavy automation: Llama 3 higher than 90%; MegaScale over 90% on more than 10,000 GPUs | https://arxiv.org/abs/2407.21783v3, https://arxiv.org/abs/2402.15627v1 | T04-1, T04-13, W4-8
- MegaScale: detection plus diagnostic tests under 10 minutes on average; catch-up within 15 minutes of the latest checkpoint | https://arxiv.org/abs/2402.15627v1 | T04-13
- Meta research clusters estimate 0.85 to 0.9 for largest 2K to 4K GPU runs, assuming Daly-Young intervals and 5-minute restart and save costs | https://arxiv.org/abs/2410.21680v2 | T04-11, W4-8
- AWS HyperPod product page: "60-80% typical goodput on self-managed clusters" (vendor claim) | https://aws.amazon.com/sagemaker/ai/hyperpod/ | T04-52, W4-30, C04-5
- Checkpointless training "over 95% training goodput on clusters with thousands of AI accelerators" (features page) and "up to 95%" (product page) (vendor claims) | https://aws.amazon.com/sagemaker/ai/hyperpod/features/, https://aws.amazon.com/sagemaker/ai/hyperpod/ | T04-52, W4-30
- Neither page states job size, duration, failure rate or baseline | same | T04-52, W4-30
- Populations differ: operator figures from teams with in-house automation at 10K GPUs and more; 60-80% describes typical self-managed clusters (our reading) | same | C04-5

## Your job's interruption interval

- Table: MTTF for 1, 4, 32, 128, 1,024, 2,048 nodes at 2.34, 6.50, 17.5, from `jobMttfSeconds` | https://arxiv.org/abs/2410.21680v2 (rates) | 04 W1, T04-7, T04-8
- Reference job (sections 14 and 18): Llama 3.1 70B on 256 H100 in 32 p5.48xlarge of 8 GPUs each | https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html | T05-2 (accessed 2026-10-30), register 02 section 3.2
- 256 GPUs: one interruption every 1.8 to 13 days; 16,384 GPUs: 40 minutes to 5.0 hours (calculator) | derived | 04 W1, W4-2 (scope's "2 to 13 days" printed as the calculator's 1.8)
- Llama 3 405B: one unexpected interruption every 3.1 hours over a 54-day window, on up to 16K GPUs (second landing) | https://arxiv.org/abs/2407.21783v3 | T04-4, W4-5
- Plan with the worst-month column since RSC-1 moved between about 2.5 and 17.5 within a year (our reading) | https://arxiv.org/abs/2410.21680v2 | T04-8 "Use in dive"
- Recovering from random failures "is only effective once defective nodes can be reliably rotated out" | https://arxiv.org/abs/2410.21680v2 (Sec II-C, Observation 2) | T04-12 cites Observation 2; this sentence verified at source 2026-10-31
- Removing 40 lemon nodes cut 512-GPU-plus job failures from 14% to 4% | https://arxiv.org/abs/2410.21680v2 | T04-12, W4-3
- Next actions: section 18 for interval and ETTR, section 19 for restart, section 24 deep health checks, keep node failure history | scope block 17 ending | scope
