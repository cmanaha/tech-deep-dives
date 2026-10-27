# Fact check fc10-eks-ec2: sections 20 (SGLang on EKS and EC2) and 21 (EC2 Instances, Images and GPU-Dependent Behaviour)

Pin: SGLang v0.5.22, commit baa9befa381511cd4d56f83980951e5a45fffc6d, read at `/tmp/sglang-src`.
AWS Deep Learning Containers (DLC) read at commit 23970abd5b8919ea3e1add74692a0d056b2fcbd9 through `gh api`.
awsome-distributed-ai at 24a8d72095b3920bb0827a45c1c2bd6ce677cebe, ai-on-eks at 667e3022df4c90c55f7c74cc1412d5b66ebff8a9,
aws-ofi-nccl at v1.22.0, vLLM at v0.31.0 (all through `gh api`). AWS, NVIDIA, Kubernetes, PyPI and ECR Public pages fetched
2026-10-24 with curl (no identifying headers). Status: fixes applied, checks below.

## AwsSelfManagedPaths.tsx (section 20, SGLang on EKS and EC2)

Claims checked: 82. CONFIRMED: 78.

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| 1 | GPU-initiated NCCL traffic over EFA, which DeepEP V2 uses, "needs P5en, P6-B200 or P6-B300 and EFA installer 1.50.0 or later" | AwsSelfManagedPaths.tsx:855-866 | OVERREACH | aws-ofi-nccl v1.22.0 `doc/gin-getting-started.md#L5-L8` (two GIN modes, proxy and EFA-GDA) and `#L35-L44` (the instance list and installer floor are EFA-GDA requirements only); section 22 PdWideEpOverEfa.tsx L966 runs DeepEP V2 on P5 and P5e through the proxy | Rewrote: GIN has a proxy mode and EFA-GDA; only EFA-GDA needs P5en, P6-B200 or P6-B300 and installer 1.50.0+. Added a cite to L5-L8. Expanded EFA-GDA from the same AWS doc (L8) |
| 2 | "the SGLang manifests cited in this section use the device plugin" | AwsSelfManagedPaths.tsx:681 | WRONG | `docs/docs/references/multi_node_deployment/deploy_on_k8s.mdx` L96-L97, L141-L152 (SGLang's LWS example mounts `/dev/infiniband` in privileged pods; no `vpc.amazonaws.com/efa`); only AWS's PD sample `prefill.yaml#L214` uses the device plugin | Narrowed to "AWS's SGLang PD sample cited in this section uses the device plugin" |
| 3 | DLC `-ec2` is "the upstream v0.5.22 image plus the EFA installer and AWS patches", cite DLC Dockerfile L1-L13 | AwsSelfManagedPaths.tsx:724-728 | UNSUPPORTED (line range) | DLC `docker/sglang/Dockerfile` L37-L49 (CVE patches) and L72 (installer run) sit outside L1-L13 | Cite range widened to L1-L73 |
| 4 | DLC `-ec2` tag "built for amd64 only", cite Dockerfile L148-L161 and the ECR gallery | AwsSelfManagedPaths.tsx:808-815 | UNSUPPORTED (line range) | Neither cited source states the architecture (gallery returns a single-arch v2 manifest, no arch field); DLC `.github/config/image/sglang/ec2-ubuntu.yml#L9` `arch_type: "x86"` does | Added the ec2-ubuntu.yml L9 cite |

Build-log open items, section 20: `/health` sleeps 1 s before its first look (http_server.py L762-L769) while the
Kubernetes default `timeoutSeconds` is 1 s (Kubernetes probes page, "Defaults to 1 second"): CONFIRMED as a code reading,
not run, and the page keeps that hedge. A pause over 20 s fails `/health` (tokenizer_manager.py L939-L940 holds the request,
http_server.py L207 and L763 give the 20 s window): CONFIRMED as a code reading. DLC EKS page sets no probe timeout
(`docs/sglang/deployment/eks.md` L38-L47): CONFIRMED. Errata D7 (installer floor at L35-L44), B10 (three samples on
v0.5.12.post1, dsr1 on custom 0.5.13.post1, two digest-pinned dev images: README L12-L17), B1 (EKS overview names SGLang,
quickstart 0, Best Practices compute/networking/performance 0): CONFIRMED. Hugepages: the hedge "which of the two SGLang
needs was not tested" is kept; the AWS PD sample requests none (prefill.yaml, no `hugepages` string) and the EKS page says
"EFA requires hugepages" (CONFIRMED both sides).

Section 12 consistency: section 20 tells the reader to set the keys from section 12's key matrix and to keep `/server_info`
and `/get_server_info` off the client path of any Service, Ingress or load balancer (L376-L389, L878-L880), which matches
section 12's "Block both paths at the gateway or ingress for everyone but operators" (ApiSurfaces.tsx L1290-L1295) and its
EKS/EC2 matrix row (L525-L538). Section 20 keeps section 12's "our reading" hedge by writing "section 12 reads their
response as carrying both keys". CONFIRMED.

Score: 9/10. Every quantitative claim carries a pinned or versioned source and the code readings stay hedged; the probe
plan lands the 1,800-second figure three times and the section ends on a per-path next step.

## Ec2Instances.tsx (section 21, EC2 Instances, Images and GPU-Dependent Behaviour)

Claims checked: 96 (including 14 sizes by 6 spec columns, counted as one claim per row). CONFIRMED: 88.

| # | claim (short) | file:line | verdict | evidence (path#Lx or URL) | fix applied |
|---|---|---|---|---|---|
| 1 | B200 flip condition "speculative decoding off or on with an explicit `--speculative-eagle-topk 1`" (h1 bold line, h2 bold line, diagram title, map caption) | Ec2Instances.tsx:121-124, 559-562, 611-615, 703-706 | WRONG (cross-section) | build-log "Cross-section conditions": "speculation off, or on with explicit topk 1 and num-steps set", fc04 refinement (topk 1 needs `--speculative-num-steps`, and an explicit `--page-size` above 1 moves B200 to flashinfer); `speculative_hook.py` L1068-L1072; `utils/common.py` L4014-L4020 | Added "and `--speculative-num-steps` set" to both bold lines; diagram title and caption now say "no attention or page-size flag" and "with the step count set" / "with `--speculative-num-steps` set" |
| 2 | The P5-to-P6 flip "is our reading of the default chain in code, not a documented statement" | Ec2Instances.tsx:564-568 | OVERREACH | `docs/docs/advanced_features/attention_backend.mdx` L551-L554 documents fa3 on Hopper and trtllm_mha on Blackwell; the 64-token page and the speculation conditions are code-only (`overrides.py` L1124-L1137, `model_override_base.py` L303-L310) | Rewrote: the documentation names both backend defaults; the 64-token page and the speculation conditions are our reading of the code. Added the docs cite |
| 3 | Ubuntu DLC "Adds the EFA installer ... plus the SageMaker entrypoint", cite L13, L72-L73 | Ec2Instances.tsx:326-338 | UNSUPPORTED (line range) | DLC `docker/sglang/Dockerfile` L139-L142 (SageMaker entrypoint) and L158-L161 (EC2 entrypoint) | Rewrote as "plus a SageMaker or EC2 entrypoint per tag" with a cite to L129-L161 |
| 4 | Ubuntu and AL2023 lines "amd64 only", cites only the SageMaker configs while each row covers the EC2 tag too | Ec2Instances.tsx:313-322, 358-367 | UNSUPPORTED (partial) | DLC `.github/config/image/sglang/ec2-ubuntu.yml#L9` and `ec2-amzn2023.yml#L10` (`arch_type: "x86"`) | Added both EC2 config cites |
| 5 | "On the AWS DLCs, NIXL's LIBFABRIC backend finds the EFA installer's libfabric", cite Dockerfile.amzn2023 L168-L170 (the Mooncake line) | Ec2Instances.tsx:478-487 | UNSUPPORTED (line range) | register 09 D4; DLC `docker/sglang/Dockerfile` L72-L73 and `Dockerfile.amzn2023` L484-L490 install the EFA installer; L168-L170 supports only the Mooncake half | Added the two EFA installer cites to the NIXL half |
| 6 | KV used unexpanded at first use | Ec2Instances.tsx:546 | prose rule (acronym) | CLAUDE.md Acronym Standard | Expanded "KV (key-value)" |
| 7 | FP8 used unexpanded at first use | Ec2Instances.tsx:548 | prose rule (acronym) | CLAUDE.md Acronym Standard | Expanded "FP8 (8-bit floating point)" |
| 8 | AL2023 used in prose before its expansion in the image table | Ec2Instances.tsx:831 | prose rule (acronym) | CLAUDE.md Acronym Standard | Expanded "Amazon Linux 2023 (AL2023)" in the prose |

Build-log open items, section 21:

- Every EC2 size listed supports EFA, including p5.4xlarge: CONFIRMED row by row. EC2 spec page network table
  (https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html) shows "EFA ✓ Yes" for p4d.24xlarge, p4de.24xlarge,
  g5.48xlarge, g6.48xlarge, g6e.48xlarge, p5.4xlarge, p5.48xlarge, p5e.48xlarge, p5en.48xlarge, p6-b200.48xlarge,
  p6e-gb200.36xlarge, p6-b300.48xlarge, g7.48xlarge and g7e.48xlarge, and the EFA supported-instance list in the EC2 User
  Guide (https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html) lists all fourteen (p5.4xlarge under Nitro v4).
- Per-instance numbers: GPU count and model, memory per GPU, total GPU memory, network bandwidth and host CPU match the
  performance and network tables for all fourteen rows of SPEC_ROWS and MAP_ROWS (P4d 4x 100, G5 and G6 100, G6e 400,
  P5 family 3200, P6-B200 3200, P6e-GB200 3200, P6-B300 6400, G7 700, G7e 1600 Gbps). The page states no EFA interface
  count; section 20's "all 32 EFA devices of a p5.48xlarge" matches the EKS EFA page and the spec page's 32 network cards.
  P6e-GB300 is absent from the spec tables on 2026-10-24 (no "gb300" string), as the page says.
- EFA-GDA expansion: CONFIRMED. aws-ofi-nccl v1.22.0 `doc/gin-getting-started.md` L8 and L29 write "EFA-GDA (Elastic
  Fabric Adapter - GPU Direct Async)"; the EC2 User Guide EFA page calls the capability "GPUDirect Async (GDA)" under
  Accelerator Command Initiation. Kept.
- Note, not a defect: the EC2 User Guide marks Accelerator Command Initiation on g7 and g7e.12/24/48xlarge as well, while
  the aws-ofi-nccl EFA-GDA list names only P5en, P6-B200 and P6-B300. The page cites the aws-ofi-nccl list for EFA-GDA,
  which is the software support statement; no change.
- B200 condition: aligned with the Cross-section block, see row 1. The last block already carries the fc04 page-size
  refinement ("at topk 1, an explicit page size above 1 moves the model off trtllm_mha to flashinfer").
- DLC claims at 23970abd: Ubuntu line built on `lmsysorg/sglang:v0.5.22` (Dockerfile L3), EFA installer `latest`
  (L13, L72); AL2023 line SGLang 0.5.19, v1.4, DeepEP from `amazon-contributing/DeepEP`, NCCL 2.31.2,
  `TORCH_CUDA_ARCH_LIST='9.0;10.0;10.3'` (Dockerfile.amzn2023 L13-L25, changelog L7-L22): CONFIRMED. ECR Public: first
  0.5.22 tag pushed 2026-10-20T00:20Z; upstream release published 2026-10-19T02:55Z (GitHub release API): CONFIRMED.
- NVIDIA driver: CUDA release notes Table 2 (CUDA 13.0 to R580) and Table 3 (13.x at 580 or later) both carry the claim;
  the "Table 3" label stays correct.
- Against vLLM: v0.31.0 `platforms/cuda.py` L154-L179 orders FLASHINFER first on capability 10 and FLASH_ATTN first
  otherwise; `config/cache.py` L71 and L333-L334 default to 16, and `platforms/interface.py` L687-L697 keeps 16 because
  FlashInfer and FlashAttention both accept it (`flashinfer.py` L447-L448). CONFIRMED.

Score: 8/10. Accuracy and citation coverage are high after the fixes; held at 8 because the map, the spec table and the
image table together carry a dense grid of numbers and conditions that the reader has to cross-reference, and the
"Against vLLM" line sits mid-block rather than near the end of the mechanism discussion.

## Harness and checks

Diagram touched: `InstanceMapDiagram` title text only (section 21). `npx vite build --outDir /tmp/sglang-dist-fc10` then
`shoot.mjs --port 4480 --sections aws-self-managed,ec2`: `ec2 @1440: 1 SVG diagram(s), 0 React Flow, ok`,
`ec2 @390: 1 SVG diagram(s), 0 React Flow, ok`, `aws-self-managed` 0 diagrams, ok at both widths. Both PNGs read: no
overlap or clipping; at 390 the map scrolls horizontally inside its container, as authored (minWidth 720).

- `pnpm --filter @tech-deep-dives/sglang typecheck`: `tsc --noEmit`, exit 0, no errors.
- `pnpm --filter @tech-deep-dives/sglang lint`: `eslint src --ext .ts,.tsx --max-warnings 0`, exit 0, no output.
- `scripts/gates/no-ai-tells.sh`: PASS. `scripts/gates/pinned-refs.sh`: PASS. `scripts/gates/svg-a11y.sh`: PASS.

Not resolved: none. Orchestrator-owned files: the glossary should list FP8 and KV for section 21 if it is per-section
(both are now expanded in the file).
