# MoE on AWS Trainium and Inferentia — Tier 1 research notes
Access date: 2026-04-24

## Sources fetched

- [T1] AWS Neuron Docs — MoE Inference Deep Dive: https://awsdocs-neuron.readthedocs-hosted.com/en/latest/libraries/nxd-inference/developer_guides/moe-arch-deep-dive.html
- [T1] AWS Neuron Docs — Trainium2 Architecture (general/arch): https://awsdocs-neuron.readthedocs-hosted.com/en/latest/general/arch/neuron-hardware/trainium2.html
- [T1] AWS Neuron Docs — Trn2 Instance & UltraServer: https://awsdocs-neuron.readthedocs-hosted.com/en/latest/general/arch/neuron-hardware/trn2-arch.html
- [T1] AWS Neuron Docs — Trainium2 Architecture Guide for NKI: https://awsdocs-neuron.readthedocs-hosted.com/en/latest/nki/guides/architecture/trainium2_arch.html
- [T1] AWS Neuron Docs — Neuron Collective Communication: https://awsdocs-neuron.readthedocs-hosted.com/en/latest/neuron-runtime/about/collectives.html
- [T1] AWS Neuron Docs — NxD Inference Feature Guide: https://awsdocs-neuron.readthedocs-hosted.com/en/latest/libraries/nxd-inference/developer_guides/feature-guide.html
- [T1] AWS Neuron Docs — NxD Training Features: https://awsdocs-neuron.readthedocs-hosted.com/en/latest/libraries/nxd-training/general/features.html
- [T1] AWS Neuron Docs — What's New (release history): https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/whats-new.html
- [T1] AWS Neuron Docs — Native PyTorch (TorchNeuron): https://awsdocs-neuron.readthedocs-hosted.com/en/latest/frameworks/torch/pytorch-native-overview.html
- [T1] AWS Neuron GitHub — neuronx-distributed-inference repo: https://github.com/aws-neuron/neuronx-distributed-inference
- [T2] AWS ML Blog — Optimizing Mixtral 8x7B on Inferentia2 (Apr 15, 2025): https://aws.amazon.com/blogs/machine-learning/optimizing-mixtral-8x7b-on-amazon-sagemaker-with-aws-inferentia2/

## Findings

1. **Neuron compiler / SDK MoE timeline.** The "What's New" page lists three SDK milestones [T1, https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/whats-new.html, accessed 2026-04-24]:
   - **Neuron 2.27.0 (Dec 19, 2025)** — first foundational MoE NKI kernels: "Router Top-K (expert selection for MoE)", "MoE CTE (Context Encoding)", "MoE TKG (Token Generation)". Qwen3-235B-A22B (Qwen3 MoE) support introduced here.
   - **Neuron 2.28.0 (Feb 26, 2026)** — MoE TKG enhancements: "gate/up projection clamping and fp16 support".
   - **Neuron 2.29.0 (Apr 9, 2026)** — "Top-K Reduce supports MoE output gathering with LNC sharding"; "MoE TKG introduces a dynamic all-expert algorithm".

2. **NKI for MoE / sparse activation kernels.** The general NKI landing page does not document MoE primitives directly [T1, https://awsdocs-neuron.readthedocs-hosted.com/en/latest/general/nki/, accessed 2026-04-24]. MoE kernels are shipped as part of the **NKI Library** (Router Top-K, MoE CTE, MoE TKG, Cumsum, Blockwise MM, Blockwise MM Backward) starting Neuron 2.27 [T1, what's new]. The NKI architecture guide describes the building blocks the kernels target — `nki.isa.nc_matmul`, PSUM banks, SBUF tiling — rather than MoE-specific APIs [T1, https://awsdocs-neuron.readthedocs-hosted.com/en/latest/nki/guides/architecture/trainium2_arch.html, accessed 2026-04-24].

3. **Neuron Distributed expert parallelism.** Both **NxD Inference** and **NxD Training** explicitly list expert parallelism as a supported strategy [T1].
   - NxD Training: "Tensor-parallelism", "Pipeline-parallelism" (1F1B and interleave), "Sequence-Parallelism", and "Expert-parallelism" are all listed [T1, https://awsdocs-neuron.readthedocs-hosted.com/en/latest/libraries/nxd-training/general/features.html, accessed 2026-04-24].
   - NxD Inference: ships reusable modules `RouterTopK`, `ExpertMLPs`, `MoE`, plus an `initialize_moe_module` helper, with built-in modeling code for Mixtral and DBRX [T1, https://awsdocs-neuron.readthedocs-hosted.com/en/latest/libraries/nxd-inference/developer_guides/feature-guide.html, accessed 2026-04-24].
   - The MoE deep dive defines: TP "shards expert weights along the intermediate dimension"; EP "distributes different experts across different NeuronCores, allowing each core to specialize in computing a subset of the total experts"; SP distributes the sequence dimension [T1, MoE deep dive].

4. **Trn2 UltraServer = 64 chips, NeuronLink-v3 ring.** [T1, https://awsdocs-neuron.readthedocs-hosted.com/en/latest/general/arch/neuron-hardware/trn2-arch.html, accessed 2026-04-24]:
   - "a total of 64 Trainium2 chips ... interconnected within a Trn2 UltraServer".
   - Topology: each Trn2 server is a 2D Torus across its 16 chips; UltraServer extends to a **3D Torus** by adding Z-dimension NeuronLinks between servers, "Trainium2 chips with the same coordinates in each Trn2 instance are connected in a ring topology".
   - Per-chip NeuronLink-v3 bandwidth: **1.28 TB/s** [T1, https://awsdocs-neuron.readthedocs-hosted.com/en/latest/general/arch/neuron-hardware/trainium2.html, accessed 2026-04-24]. UltraServer table lists inter-instance NeuronLink-v3 at **256 GB/s** per chip.
   - EFAv3 per UltraServer: **3,200 Gbps** (3.2 Tbps); per-chip aggregate "3.2Tbps device-RDMA connectivity" [T1, collectives].
   - Inter-server HBM-to-HBM latency: "**15us** ... to go from an HBM in one server to an HBM of another" [T1, collectives].

5. **All-to-All collective is documented; MoE link is implicit.** The collective communication page enumerates AllGather, ReduceScatter, AllReduce, **All-to-All**, and Permute, defining All-to-All as: "each rank sends different data to and receives different data from every other rank, resembling a distributed transpose" [T1, https://awsdocs-neuron.readthedocs-hosted.com/en/latest/neuron-runtime/about/collectives.html, accessed 2026-04-24]. The MoE deep dive notes EP currently uses **All-Gather**, with a planned **All-to-All-v** primitive: "All-to-All-v primitive in the Neuron SDK that will enable variable-sized token exchanges between EP ranks" [T1, MoE deep dive] — i.e., the canonical MoE dispatch/combine pattern is on the roadmap, not yet shipping as of 2.29. TorchNeuron docs confirm: "`torch.all_to_all_vdev_2d` and `torch.all_to_all_vdev_2d_offset` (MoE Dispatch/Combine ops) will be supported in future releases" [T1, native PyTorch overview].

6. **Officially documented MoE models on Trainium/Inferentia.**
   - NxD Inference modeling code: **Mixtral**, **DBRX** [T1, feature guide].
   - MoE deep dive supported list: **GPT-OSS (128 experts, top_k=8)**, **Llama4 (16 experts with shared experts)**, **DeepSeek-V3 (256 experts, top_k=8)**, **Qwen3-MoE**, **DBRX** [T1, MoE deep dive].
   - DeepSeek-V3 routing uses `GroupLimitedRouter` — "implements the no-auxiliary-loss method from DeepSeek-V3, which groups experts and selects top groups before performing top-k selection within those groups" [T1, MoE deep dive].
   - NxD Training model hub: "LLama, GPT, and Mixtral MoE implemented using both HuggingFace and Megatron-LM model classes" [T1, NxD training features]. **DeepSeek training is not documented.**

7. **CC-Cores (Collective Communication cores).** Trainium2 has "**16 CC-Cores** orchestrate collective communication among Trainium2 chips within and across instances" [T1, trainium2 architecture]. Definition: "dedicated synchronization processors responsible for the orchestration of collective communications" [T1, collectives]. They are the engines that drive the All-Gather (today) and the planned All-to-All-v (future) used by EP — i.e., the silicon path for expert routing traffic.

8. **SBUF / PSUM scratchpad on NeuronCore-v3 (Trainium2).** [T1, https://awsdocs-neuron.readthedocs-hosted.com/en/latest/nki/guides/architecture/trainium2_arch.html, accessed 2026-04-24]:
   - **SBUF: 28 MiB per NeuronCore-v3** (128 partitions × 224 KiB), up from 24 MiB on v2. The Trainium2 architecture page reports SBUF at the chip level as **224 MiB** (8 NeuronCores × 28 MiB).
   - **PSUM: 2 MiB per NeuronCore-v3** (unchanged from v2), the dedicated accumulator buffer for the Tensor Engine.
   - HBM: **96 GiB at 2.9 TB/s** per chip [T1, trainium2 architecture].
   - Tensor Engine: "**158 FP8, 79 BF16/FP16/TF32 and 20 FP32 dense TFLOPS**" per NeuronCore-v3.
   - For MoE expert MLPs specifically, SBUF/PSUM are used by the **Blockwise Matmul (BWMM)** kernel — the deep dive states BWMM "transforms the dynamic problem into a static one" by mapping tokens into fixed-size blocks, exploiting token skipping, weight skipping, and dynamic control flow [T1, MoE deep dive]. PSUM bank constraint (load-bearing for kernel authors): "On NeuronCore-v2 and -v3, the free dimension size of moving tile must not exceed 512, matching the maximum number of float32 elements per PSUM bank" [T1, NKI arch].

9. **Eight NeuronCores-v3 per chip; Logical NeuronCore Configuration (LNC).** "Every Trainium2 chip contains eight NeuronCore-V3 cores" [T1, trainium2 architecture]. LNC "lets you combine the compute and memory resources of multiple physical NeuronCores into a single logical NeuronCore" — relevant to MoE because Neuron 2.29 "Top-K Reduce supports MoE output gathering with LNC sharding" [T1, what's new].

10. **Mixtral on Inferentia2 (production reference).** [T2, https://aws.amazon.com/blogs/machine-learning/optimizing-mixtral-8x7b-on-amazon-sagemaker-with-aws-inferentia2/, dated April 15, 2025, accessed 2026-04-24]: Mixtral 8x7B deployed on `ml.inf2.24xlarge` (6 Inferentia2 chips, 12 NeuronCores). Tensor parallel degrees: "limited to 8, 16, and 32" (must divide 32 attention heads). Memory footprint: "**93.4 GB for weights plus 0.5 GB for KV caching**" at batch=1, seq=1024. Compiled via `optimum-cli export neuron`, served by `ghcr.io/huggingface/neuronx-tgi:0.0.25`. The blog gives no throughput/latency numbers.

## UNKNOWN

- **Quantitative all-to-all bandwidth on Trn2 UltraServer.** Docs give per-chip NeuronLink-v3 (1.28 TB/s) and inter-instance per-chip (256 GB/s), but do not publish a measured bisection or all-to-all throughput across the 64-chip 3D-Torus.
- **When does All-to-All-v actually ship in Neuron SDK?** Marked "future" in TorchNeuron docs and "planned" in MoE deep dive as of 2.29.0 (Apr 9, 2026); no committed version.
- **DeepSeek-V3 training on Trainium.** NxD Inference supports DS-V3 inference (256 experts, top_k=8, GroupLimitedRouter); NxD Training docs do not mention DeepSeek.
- **HyperPod-specific MoE guidance.** sagemaker-hyperpod.html was not fetched; no T1 confirmation that HyperPod recipes have MoE-specific prescriptions beyond NxD Training defaults.
- **GPT-OSS / Llama4 / Qwen3-MoE training paths.** Deep dive confirms inference; training-side doc coverage UNKNOWN.
- **Exact Neuron 2.21 MoE state.** Earlier mentions of Mixtral support on NxDI predate 2.27 NKI MoE kernels — the pre-2.27 path likely used non-NKI implementations, but the docs do not state this explicitly.

## Direct quotes worth using verbatim

> "Every Trainium2 chip contains eight NeuronCore-V3 cores."
> — [T1] https://awsdocs-neuron.readthedocs-hosted.com/en/latest/general/arch/neuron-hardware/trainium2.html

> "16 CC-Cores orchestrate collective communication among Trainium2 chips within and across instances."
> — [T1] https://awsdocs-neuron.readthedocs-hosted.com/en/latest/general/arch/neuron-hardware/trainium2.html

> "a total of 64 Trainium2 chips to be interconnected within a Trn2 UltraServer."
> — [T1] https://awsdocs-neuron.readthedocs-hosted.com/en/latest/general/arch/neuron-hardware/trn2-arch.html

> "NeuronCore-v3 SBUF capacity is 28MiB (or, 128 partitions of 224KiB), up from 24 MiB in NeuronCore-v2 ... PSUM capacity remains the same at 2MiB."
> — [T1] https://awsdocs-neuron.readthedocs-hosted.com/en/latest/nki/guides/architecture/trainium2_arch.html

> "Expert Parallelism (EP) distributes different experts across different NeuronCores, allowing each core to specialize in computing a subset of the total experts."
> — [T1] https://awsdocs-neuron.readthedocs-hosted.com/en/latest/libraries/nxd-inference/developer_guides/moe-arch-deep-dive.html

> "All-to-All-v primitive in the Neuron SDK that will enable variable-sized token exchanges between EP ranks."
> — [T1] https://awsdocs-neuron.readthedocs-hosted.com/en/latest/libraries/nxd-inference/developer_guides/moe-arch-deep-dive.html

> "In AlltoAll, each rank sends different data to and receives different data from every other rank, resembling a distributed transpose."
> — [T1] https://awsdocs-neuron.readthedocs-hosted.com/en/latest/neuron-runtime/about/collectives.html

> "The library includes ready-to-use modeling code for Mixtral and DBRX. These models are built using reusable MoE modules from NeuronX Distributed Core: RouterTopK, ExpertMLPs, and MoE."
> — [T1] https://awsdocs-neuron.readthedocs-hosted.com/en/latest/libraries/nxd-inference/developer_guides/feature-guide.html
