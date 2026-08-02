# Source Authority Standard — Code Is The Authority

Established 2026-08-01 by Carlos. Candidate for promotion into CLAUDE.md / AGENTS.md
as a repo-wide rule once proven on the EFA revamp.

## The rule

**Code is the authority. Everything else is orientation.**

Ordered, strongest first:

1. **Source code at a pinned commit.** The implementation is what actually runs.
   This is the only thing that settles a disputed technical claim.
2. **Official AWS documentation.** A secondary check. Useful for intent, support
   statements, pricing, and anything not visible in open source.
3. **Code comments, in-repo README files, in-repo `.txt` / design / spec documents.**
   NOT authoritative. Use them to find your way around the code. Never cite them as
   proof of behaviour.
4. **Everything else.** Blogs, talks, third-party analysis. Inspiration only.

Where code and documentation disagree, **code wins**, and the disagreement is itself
a finding worth publishing.

## Why this rule exists (the case that produced it)

The current EFA dive asserts that RDMA Read and Write are emulated in software by the
libfabric EFA provider. The source of that claim is `SRD.txt`, an unmaintained 2019
spec document sitting in the same repository whose code contradicts it. The code
declares RDMA read and write as device opcodes. One stale in-repo text file put a
false claim into a published page and it survived every review, because a `.txt` file
in an official AWS repo reads like a primary source.

The same failure mode is why the "proof of OS bypass" argument went stale: it rested
on an absence in a driver that has since been filled in.

Corollary the project should exploit: doc-versus-code contradictions are valuable
content. Most readers cannot find them. Publishing them, with both sides cited, is
exactly the kind of depth that documentation cannot provide.

## Citation requirements

Every claim must be classifiable into one of three categories, and the rendered page
must make the category visible to the reader.

**A. Documented.** AWS states it. Cite the doc URL and the access date.

**B. Code-confirmed.** AWS documents it AND the code agrees. Cite both. This is the
strongest category and should be labelled as such.

**C. Code-derived inference.** AWS documents nothing, and the claim comes from reading
the implementation. Cite repo, commit SHA (not a branch name), file path, line number,
and the date read. The page must say plainly that this is inferred from source and not
an AWS statement. This category carries the dive's unique value and also its risk, so
it must never be laundered into the same voice as category A.

A fourth label is needed for the interesting case: **D. Doc-code contradiction.**
Both sides cited, with the code's reading marked as authoritative and the stale
document named.

## Pinning

- Pin to a commit SHA or a release tag. Never to `main` / `master`.
- Record the date the code was read alongside the SHA.
- A verification pass must be able to re-fetch that exact file at that exact SHA and
  confirm the quoted line is still what we say it is. This is a mechanical check and
  should become a ci.sh gate.

## Source-of-truth repositories for EFA

Primary (code):
- `amzn/amzn-drivers` — `kernel/linux/efa` (EFA kernel driver), `kernel/linux/ena`
  (ENA kernel driver)
- `linux-rdma/rdma-core` — `providers/efa` (userspace verbs provider)
- `ofiwg/libfabric` — `prov/efa` (the libfabric EFA provider)
- `aws/aws-ofi-nccl` — the NCCL transport plugin and its tuner
- `awslabs/aws-c-s3`, `awslabs/aws-c-io` — the CRT S3 client data path
- `awslabs/eks-ami` / `aws/eks-ami` — how the EKS AMI is actually built, including
  the literal `efa_installer.sh` invocation
- `aws/deep-learning-containers` — what the SageMaker DLCs actually install
- `aws/aws-ofi-nccl`, `NVIDIA/nccl` — for tuner and algorithm interaction

Carlos to confirm and extend this list; he flagged that AWS publishes more AMI-related
repositories worth treating as source of truth.

## Known trap already recorded

`amzn-drivers` ships `SRD.txt` (2019) stating "Currently only Send operation is
supported." The code in the same repository contradicts it. Do not cite `SRD.txt`.
