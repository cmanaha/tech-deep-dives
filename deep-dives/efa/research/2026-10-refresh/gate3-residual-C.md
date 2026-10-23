# Gate 3 residual fixes, group C (input: gate3-rescore-C.md)

Scope: DecisionGuide, Overview, AIMLInference, HPC, NetworkComparison, EKSIntegration, SageMaker, StorageDataPaths.
Items: 3 regressions + 21 remaining corrections. Backlog items and the EKS accuracy flag (fact-check track) not applied.

## Items

- SageMaker, regression 1 (SMDDP instance scope vs SDK allowlist): applied narrower than given. Re-fetched sagemaker-python-sdk at the pinned tag v2.257.0, src/sagemaker/fw_utils.py L85-91: SM_DATAPARALLEL_SUPPORTED_INSTANCE_TYPES = ml.p3.16xlarge, ml.p3dn.24xlarge, ml.p4d.24xlarge, ml.p4de.24xlarge, local_gpu. Re-fetched the support page: lists ml.p3dn.24xlarge, ml.p4d.24xlarge, ml.p4de.24xlarge only. The given text "the SDK's own allowlist accepts all three" was true but hid the fourth type, so the doc and the code are stated as two facts: support page (documented, ddpSupport), then "The SDK's own allowlist accepts those three and ml.p3.16xlarge as well, which the support page does not list" (doc-code-conflict, ddpSupport + smddpTypes, conflict text names both lists), then the FAQ as the narrower P4d/P4de statement (ddpFaq). "In practice it runs only on P4d and P4de" and the code-confirmed badge are gone. "That list is the whole scope" (now ambiguous across three lists) re-expressed as "None of these lists includes P5, P6, Trn2 or the G family, so those run plain NCCL ...", which all three sources bear. L1122 "scoped to those three instance types" made explicit as "scoped to the support page's three instance types". The h2 description ("the three supported instance types") stays consistent with the support page.
- SageMaker, regression 2 (flexible instance groups "stays within an Availability Zone"): applied as given. Re-fetched the What's New page (aws.amazon.com/about-aws/whats-new/2026/04/sagemaker-hyperpod-flexible-instance-groups/): "provide multiple subnets across availability zones in a single instance group" and "Training customers benefit from multi-subnet distribution within an availability zone to avoid subnet exhaustion." The new sentence keeps that scope.
- SageMaker, correction 1 (DPD blog attribution narration, "Same post"): applied as given, with "In that transport" written as "In the transport the diagram shows" so the sentence keeps an antecedent now that the "four bands in the diagram" opener is gone. Vendor figure keeps "AWS's blog puts ..." attribution.
- SageMaker, correction 2 ("Note the order rule on that page"): applied as given; smpSmddp now cites both the composition sentence and the order sentence.
- SageMaker, correction 3 (provenance-only "Both log samples are quoted ..." sentence): applied as given; deepHealth moved to the 80 vs 30 sentence.
- AIMLInference, regression 1 (provenance label on the vLLM speculative-decoding README): applied as given, re-expression applied narrower. NcclOverEfa.tsx cites doc/gin-getting-started.md as a code-derived CodeRef, but DataPath.tsx cites the NVIDIA GDRCopy README as a DocRef with provenance "documented", and the re-scorer's fix asks for the DocRef form, so the DocRef form is used: new docs.vllmSpecDecodeDoc (title "vLLM documentation (v0.32.0): Speculative Decoding", URL pinned to tag v0.32.0, #L3), code.vllmSpecDecode removed, both SourceRefs (speculative-decoding column and Question 4) now provenance="documented". Re-fetched README L3 at v0.32.0: "to reduce inter-token latency under medium-to-low QPS (queries per second), memory-bound workloads". The re-scorer's "speculative decoding exists to cut inter-token latency" dropped that scope, so the sentence keeps it: "speculative decoding exists to cut inter-token latency in medium-to-low QPS (queries per second), memory-bound serving [doc], so every draft-to-verifier round-trip lands there, and that round-trip is what EFA shortens." ORCHESTRATOR: Sources.tsx id 54 type should change from 'source-code' to 'official-docs' (not my file).
- AIMLInference, correction 1 (640 GB uncited): applied narrower. Fetched ac.html: p5.48xlarge accelerator memory is "640 GiB (8 x 80 GiB)", not 640 GB. The sentence now reads "more than the 640 GiB (about 687 GB) of total GPU memory in a P5 instance [ac]" so the citation bears the unit; the 810 GB comparison still holds. New DocRef docs.ac declared in AIMLInference.tsx (the URL the Decision Guide already uses).
- AIMLInference, correction 2 (300B / 600B ceilings): applied narrower. The given text "about 600 GB against 640 GB, which leaves little" carried the same GB/GiB slip and an unquantified "little"; now "fit on a single P5 by weight alone: about 600 GB against 640 GiB (about 687 GB) of GPU memory [ac], which leaves under 90 GB for the KV-cache and activations (our arithmetic)".
- AIMLInference, correction 3 (NVLink h2 description vs batch column): applied as given.
- AIMLInference, correction 4 ("it is a recommendation" restatement): applied as given.
- DecisionGuide, correction 1 (negation inside the placement-group definition): applied as given.
- DecisionGuide, correction 2 (Question 1 NVLink scope wider than the instances named): applied narrower. The G5 interconnect could not be confirmed on ac.html (fetched; the page carries no interconnect column and no NVLink, NVSwitch or PCIe text), so nothing about G5 was added. Its current P-family list is p4d, p4de, p5, p5e, p5en, p6-b200, p6-b300, p6e-gb200 plus the single-GPU p5.4xlarge, so the given "a P-family GPU instance" became "a multi-GPU P-family instance": "A single-instance workload runs its collectives inside the instance: over NVLink on a multi-GPU P-family instance, or NeuronLink on trn1.32xlarge [trn1Arch]". The NVLink half stays uncited, as it was before 2dca933.
- DecisionGuide, correction 3 (dangling "its"): applied as given.
- DecisionGuide, correction 4 (optional, 11:00 UTC is documented): applied as given. Re-fetched ec2-capacity-blocks.html: "The termination process for instances running in a Capacity Block begins at 11:00AM Coordinated Universal Time (UTC) on the final day of the reservation." The added citation is the existing capacityBlocksUg; "(our arithmetic)" now scopes only the 10:30 UTC P6e-GB200 figure.
- Overview, correction 1 (h2 description routes instead of stating the payoff): applied as given.
- HPC, correction 1 (uncited superlative in the "Choosing the instance" h2 description): applied as given.
- NetworkComparison, correction 1 (NVLink "preliminary" qualifier dropped): applied as given. Re-fetched nvidia.com/en-us/data-center/nvlink/: "Preliminary specifications; may be subject to change." and the 3,000 GB/s figure are both on the page.
- NetworkComparison, correction 2 ("EFA has no switch-side collective offload" as a universal): applied as given.
- EKSIntegration, correction 1 ("every example it publishes"): applied as given (contract table detail cell, no SourceRef involved).
- EKSIntegration, correction 2 ("no operator CRD has an EFA-specific field"): applied as given; the CRD expansion is kept at its first (and only) occurrence.
- EKSIntegration, accuracy flag (Karpenter DRA warning scope, L947-952): not applied; the report routes it to the fact-check track, not to the corrections list.
- StorageDataPaths, correction 1 (15.5 microsecond figure without its placement-group condition): applied as given (matches NetworkComparison.tsx L153).
- StorageDataPaths, correction 2 (s3Whitepaper tier): applied as given, tier 1 to 2.
- StorageDataPaths, correction 3 (boundary body repeats its h2 description): applied as given, deletion only; the "no open-source artifact to read" clause was not moved into the description (it is an unscoped absence claim, and the description already carries the documentation-versus-code split).
- StorageDataPaths, correction 4 ("They are quoted here because ..."): applied as given, deletion only.

## Fetches (no personal data; curl default User-Agent)

- https://raw.githubusercontent.com/aws/sagemaker-python-sdk/v2.257.0/src/sagemaker/fw_utils.py (pinned tag; L85-91 allowlist)
- https://docs.aws.amazon.com/sagemaker/latest/dg/distributed-data-parallel-support.html
- https://aws.amazon.com/about-aws/whats-new/2026/04/sagemaker-hyperpod-flexible-instance-groups/
- https://raw.githubusercontent.com/vllm-project/vllm/v0.32.0/docs/features/speculative_decoding/README.md (pinned tag; L3)
- https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html
- https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html
- https://www.nvidia.com/en-us/data-center/nvlink/

## For the orchestrator (files outside this agent's scope)

- Sources.tsx id 54 (vLLM speculative decoding README, v0.32.0): change type 'source-code' to 'official-docs', per the re-scorer's regression fix; the section now cites it as a DocRef with provenance "documented".
- New in-section DocRef AIMLInference docs.ac (https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html, tier 1): register it in the appendix if the appendix lists per-section sources; the same URL is already cited by DecisionGuide.tsx.
- New DocRef AIMLInference docs.vllmSpecDecodeDoc uses the same URL as Sources.tsx id 54; no new appendix entry needed beyond the type change.
- s3Whitepaper tier changed 1 to 2 in StorageDataPaths.tsx; if the appendix lists it, its tier should match.
- No SVG text changed. No diagram geometry touched.

## Checks (repo root, foreground)

- pnpm --filter @tech-deep-dives/efa typecheck: pass
- pnpm --filter @tech-deep-dives/efa lint: pass (max-warnings 0)
- scripts/gates/no-ai-tells.sh, svg-a11y.sh, pinned-refs.sh, pre-overflow.sh: all PASS

Totals: 24 items (3 regressions, 21 corrections). Applied as given: 18. Applied narrower or adjusted: 6 (SageMaker regression 1; AIMLInference regression 1 re-expression; AIMLInference corrections 1 and 2, GiB unit; DecisionGuide correction 2; SageMaker correction 1, antecedent wording only). Skipped: 0. EKS accuracy flag left for the fact-check track.

STATUS: COMPLETE
