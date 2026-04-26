# Sources — Silicon, Memory, and Modern Inference

Authoritative sources for the deep dive, organized by tier and section theme. Each cited claim in the app links back to an entry here with its access date.

## Sourcing policy (Carlos 2026-04-23)

Authoritative owner documentation is the first-class source. Academic papers are welcome context but are not authoritative for implementation claims — vendor behavior frequently diverges from published designs. When a claim comes from a paper it must also trace to vendor documentation; if it does not, the claim is flagged UNKNOWN.

## Tier definitions

- **Tier 0** — Our own experiments. Code, data, and inputs checked into `research/` or `iac/`.
- **Tier 1** — Official vendor documentation, formal specifications, source code, official reference manuals. The compiler and tooling sections rely almost exclusively on Tier 1.
- **Tier 2** — Vendor blog posts, conference talks (re:Invent, HotChips, MICRO, ISCA), official whitepapers, vendor-authored keynotes.
- **Tier 3** — Peer-reviewed papers, third-party technical analysis with methodology disclosed. Context only — any implementation claim must also trace to Tier 1 or 2.
- **Tier 4** — Blog posts and tutorials. Inspiration only. Never cited as source of truth.

## Primary authoritative sources (Tier 1) by section theme

### AWS Neuron, Trainium, Inferentia
- AWS Neuron SDK documentation — https://awsdocs-neuron.readthedocs-hosted.com/
- NKI (Neuron Kernel Interface) — https://awsdocs-neuron.readthedocs-hosted.com/en/latest/general/nki/
- torch-neuronx — https://awsdocs-neuron.readthedocs-hosted.com/en/latest/frameworks/torch/torch-neuronx/
- Neuron profiler reference — https://awsdocs-neuron.readthedocs-hosted.com/en/latest/tools/
- Neuron Distributed — https://awsdocs-neuron.readthedocs-hosted.com/en/latest/libraries/neuronx-distributed/

### NVIDIA compilers and kernel tooling
- CUDA Programming Guide — https://docs.nvidia.com/cuda/cuda-c-programming-guide/
- CUTLASS — https://github.com/NVIDIA/cutlass (README, media/, and in-tree docs)
- CuTe documentation — https://github.com/NVIDIA/cutlass/tree/main/media/docs/cute
- Triton — https://triton-lang.org/main/index.html
- cuDNN — https://docs.nvidia.com/deeplearning/cudnn/
- cuBLAS — https://docs.nvidia.com/cuda/cublas/
- Nsight Compute — https://docs.nvidia.com/nsight-compute/
- Nsight Systems — https://docs.nvidia.com/nsight-systems/

### PyTorch and JAX
- PyTorch documentation — https://pytorch.org/docs/
- torch.compile / Inductor — https://pytorch.org/docs/stable/torch.compiler.html
- JAX documentation — https://docs.jax.dev/

## Fact-check register

Will be populated here as each section moves from scaffold to draft. Format per entry:

- Claim
- Section where it appears
- Source (Tier + URL)
- Access date

## UNKNOWN register

Claims we could not verify. Each entry notes what would be needed to close it.
