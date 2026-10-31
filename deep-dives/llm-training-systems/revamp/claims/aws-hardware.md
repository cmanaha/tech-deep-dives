# Claims: section 21, Training Hardware on AWS

File: `src/sections/AwsHardware.tsx`. Re-opened on 2026-10-31 with curl (default user agent, no identifying headers), stripped to text locally: the EC2 accelerated computing specification page (ac.html), the P4, P5, P6, Trn1, Trn2 and Trn3 product pages, the EC2 UltraServers page, the Capacity Blocks pricing page, the two What's New posts of 2025-12-02 (P6e-GB300, Trn3), NVIDIA's A100, H100, H200, HGX, GB200 NVL72 and NVLink pages, and the Neuron 2.33 pages for Trainium, Trainium2, Trainium3, NeuronCore-v3, Trn2 architecture and Trn3 architecture; raw files at aws-neuron-sdk 10832bbcc6b6920b3046a7d7aa59b6b684f6b81a for `training/torchtitan/about-torchtitan-neuron.rst` and `torch/about-pytorch-neuron.rst`. Every figure the page prints from `src/lib/presets.ts` (INSTANCES, DENSE_MODELS) is imported, and the section 14 example is recomputed with `evaluateLayout` from `src/lib/parallelism.ts`. Rows cited without re-opening carry `accessed="2026-10-30"`: ZeRO Section 3.1, the Llama 3.1 70B Hugging Face metadata, the Capacity Blocks user guide.

Format: claim | source URL | register, wave 2 row or experiment

## Intro

- An instance's HBM per accelerator, dense peak and scale-up domain are the three inputs the calculators take | SCOPE section 21 payoff; presets.ts InstancePreset | R1 finding 22 (payoff wording) [our reading]
- Llama 3.1 70B model state needs 1.64 p5.48xlarge, 0.93 p5en.48xlarge, 0.68 trn2.48xlarge (repeated in h1, h2 description, floor table, closing paragraph) | see "Node-count floor" | 05 section 3.3, W5-24 [derived]

## Scale-up domain

- TP exchanges activations in every layer of every micro-batch; DP and PP communicate once per step or per micro-batch and can cross EFA | cross-reference to sections 7 and 9 | T02-13, T02-14, thesis [our reading, stated in section 7]
- 8 GPUs per instance in every P instance from p4d.24xlarge to p6-b300.48xlarge | https://docs.aws.amazon.com/ec2/latest/instancetypes/ac.html | T05-1 to T05-5, W5-19
- NVSwitch 600 GB/s on P4d | https://aws.amazon.com/ec2/instance-types/p4/ | T05-1
- NVSwitch 900 GB/s on P5, P5e, P5en | https://aws.amazon.com/ec2/instance-types/p5/ | T05-2, T05-3
- Fifth-generation NVLink up to 1.8 TB/s per GPU on P6-B200 | https://aws.amazon.com/ec2/instance-types/p6/ | T05-4
- 16 Trainium2 per trn2.48xlarge "connected using a 4x4, 2D Torus topology"; 64 in a Trn2 UltraServer of four trn2u.48xlarge on NeuronLink-v3 | https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/trn2-arch.html | T05-10, T05-11, W5-25
- trn1.32xlarge joins 16 Trainium chips on NeuronLink up to 768 GB/s | https://aws.amazon.com/ec2/instance-types/trn1/ ; ac.html | T05-9
- P6e-GB200 UltraServers of 36 or 72 GPUs, "up to 72 Blackwell GPUs within one NVLink domain", 4-GPU instances "only available in UltraServers" | https://aws.amazon.com/ec2/instance-types/p6/ | T05-6, T05-34, W5-19
- Trn3 Gen1 64 and Gen2 144 Trainium3 chips, all-to-all over NeuronSwitch-v1, "replacing the previous 2D-torus architecture" | https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/trn3-arch.html | T05-12, T05-34
- Diagram: domains of 8, 16, 64, 72, 144 drawn to scale; 18 instances of 4 GPUs; 36 servers of 4 Trainium3; four trn2u.48xlarge | the rows above | T05-6, T05-11, T05-12
- Network bandwidth per instance 3,200 Gbps on p5, p5en, p6-b200, trn2; 6,400 on p6-b300; product pages call it EFA | ac.html; p5, p6, trn2 product pages | T05-2 to T05-5, T05-10, W5-20
- 400 Gbps per GPU on P5 and P6-B200, 800 on P6-B300, 200 per Trainium2 chip | ac.html | 05 section 3.1, W5-20 [derived]
- Trn3 UltraServers 12,800 and 28,800 Gbps EFA for 64 and 144 chips, 200 per chip | trn3-arch.html | T05-12 [derived]
- The EC2 page gives no direction for its network figures | ac.html | Collectives.tsx states the same for 3,200 Gb/s (silence scoped to the page)
- 3,200 Gbps = 400 GB/s per instance = 400 Gbps = 50 GB/s per GPU; sections 7, 8, 14 divide cross-instance collective bytes by the instance figure, GPU-to-GPU bytes by the per-GPU share | cross-reference | build-log "Cross-instance pricing", T02-68 [section 7's reading]
- NEW, not in the registers: P6e-GB200 EFA disagrees between AWS pages. ac.html lists 3,200 Gbps per 4-GPU p6e-gb200.36xlarge (800 per GPU); the P6 page lists 28,800 Gbps aggregate EFA for u-p6e-gb200x72 (and 14,400 for x36) and "400 GB ps per GPU of EFAv4 networking", which is 1,600 per instance and 400 per GPU | ac.html ; https://aws.amazon.com/ec2/instance-types/p6/ | T05-6 vs T05-7 (T05-7 noted the 400 per GPU but no contradiction was recorded; W5-20 re-read only ac.html) [derived]
- Table and calculators take 3,200 for p6e-gb200 | presets.ts INSTANCES['p6e-gb200.36xlarge'].efaGbpsPerInstance | T05-6
- Inside a Trn2 UltraServer, chips with the same coordinates are joined in a ring | trn2-arch.html | T05-11
- Trn3's all-to-all design is "optimized for Mixture of Experts models and autoregressive inference serving" | trn3-arch.html | T05-12 (quote re-read 2026-10-31)
- A torus favours neighbour exchanges; the expert all-to-all is the traffic the Trn3 switch targets | none | T05-10 use-in-dive [our reading]

## Instance table

- Every row: accelerators, HBM per accelerator (GiB), dense BF16 and 8-bit peak, EFA per instance, NVMe | ac.html; NVIDIA and Neuron pages below | 05 section 3.1, T05-1 to T05-19
- p4d/p4de: 8 x A100 40/80 GiB, 400 Gbps (4 x 100), 8 x 1,000 GB NVMe; A100 BF16 312 dense, no FP8 | ac.html ; https://www.nvidia.com/en-us/data-center/a100/ | T05-1, T05-13
- p5: 8 x H100 80 GiB, 3,200 Gbps, 8 x 3,800 GB; H100 989.5 / 1,979 dense (half of 1,979 / 3,958 "with sparsity") | ac.html ; https://www.nvidia.com/en-us/data-center/h100/ | T05-2, T05-14, U02-7 hedge
- p5e/p5en: 8 x H200 141 GiB, 3,200 Gbps, 8 x 3,800 GB; H200 peaks equal H100's | ac.html ; https://www.nvidia.com/en-us/data-center/h200/ | T05-3, T05-14
- p6-b200: 8 x B200 179 GiB, 3,200 Gbps, 8 x 3,800 GB; 2,250 / 4,500 dense | ac.html ; https://www.nvidia.com/en-us/data-center/hgx/ | T05-4, T05-15
- p6-b300: 8 x B300 268 GiB, 6,400 Gbps, 8 x 3,800 GB; 2,250 / 4,500 dense; NVLink 1.8 TB/s per GPU | ac.html ; hgx | T05-5, T05-15, W5-21
- p6e-gb200: 4 x B200 (GB200) 185 GiB, 3,200 Gbps, 3 x 7,500 GB; 2,500 / 5,000 dense (GB200 NVL72 360 / 720 PFLOPS sparse per 72) | ac.html ; https://www.nvidia.com/en-us/data-center/gb200-nvl72/ | T05-6, T05-16
- trn1/trn1n: 16 x Trainium 32 GiB, 800 / 1,600 Gbps, 4 x 1,900 GB; 190 TFLOPS FP16/BF16/cFP8/TF32 | ac.html ; https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/trainium.html | T05-9, T05-19
- trn2: 16 x Trainium2 96 GiB, 3,200 Gbps, 4 x 1,900 GB; 667 / 1,299 dense; NeuronLink-v3 1.28 TB/s per chip | ac.html ; trainium2.html ; trn2-arch.html | T05-10, T05-17
- Trn3 Gen2 UltraServer: 144 x Trainium3 in 36 servers of 4, 144 GiB per chip, 671 / 2,517 MXFP8, 28,800 Gbps | trainium3.html ; trn3-arch.html | T05-12, T05-18
- NVIDIA prints sparse peaks; dense is half | hgx footnote "Dense is 1/2 sparse spec shown"; GB200 footnote | U02-7 (hedge accepted), T05-15, T05-16
- trn2: 64 ranks per instance at LNC=2, one process per logical NeuronCore | https://github.com/aws-neuron/aws-neuron-sdk/blob/10832bbcc6b6920b3046a7d7aa59b6b684f6b81a/training/torchtitan/about-torchtitan-neuron.rst#L206-L208 | T03-38
- 96 / 4 = 24 GiB per rank | presets.ts hbmPerRank | 03 W3 [derived]
- p6e-gb200 GPU named "NVIDIA B200" on ac.html but its peak is GB200's 2,500 against HGX B200's 2,250, 11% higher | ac.html ; gb200-nvl72 ; hgx | T05-16 [derived]
- AWS GiB vs NVIDIA GB: 80 GiB vs 80 GB per H100, about 7%; calculators take the smaller | ac.html ; h100 | C02-7; memory.ts capacity rule
- Section 7 reads 900 GB/s NVLink as 450 per direction; calculators divide by 450 | presets.ts NVLINK_HOPPER | T02-70 [our reading, section 7]
- C05-1: ac.html lists trn2.48xlarge "8192 GiB (16 x 512 GiB)" (still on 2026-10-31); Neuron gives 96 GiB per chip and 1,536 per instance; Trn2 product page 96 GB and 1.5 TB | ac.html ; trainium2.html ; trn2-arch.html ; https://aws.amazon.com/ec2/instance-types/trn2/ | C05-1, W5-22
- 512 GiB would plan with more than five times the HBM (512 / 96 = 5.3) | derived | [derived]
- P6e-GB300 and Trn3 UltraServers GA since 2 December 2025 | https://aws.amazon.com/about-aws/whats-new/2025/12/amazon-ec2-p6e-gb300-ultraservers-nvidia-gb300-nvl72-generally-available/ ; https://aws.amazon.com/about-aws/whats-new/2025/12/amazon-ec2-trn3-ultraservers/ | T05-8, T05-48
- Neither on ac.html nor with a rate on the Capacity Blocks pricing page on 2026-10-31 (zero "gb300"/"trn3" in both, re-read) | ac.html ; https://aws.amazon.com/ec2/capacityblocks/pricing/ | W5-23
- Not in the us-east-1 EC2 price file read for this research | https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/20261029175634/us-east-1/index.csv | W5-23 (wave 2 read, not re-read by this author)
- P6e-GB300 figures appear only relative to P6e-GB200 in the AWS pages read (1.5x GPU memory, 1.5x FP4 without sparsity); announcement says contact an AWS sales representative | What's New GB300 ; P6 page | T05-8, U05-1 hedge
- Neuron docs are the only first-party source of Trn3 configurations located in this research | trn3-arch.html | T05-48, U05-2 hedge

## Disclosure: other disagreements

- C05-2: ac.html p6-b200 "1432 GiB (8 x 179 GiB)", p6e-gb200 "740 GiB (4 x 185 GiB)", p6-b300 "2148 GiB (8 x 268 GiB)" while 8 x 268 = 2,144; P6 page "1440 GB" prose, 1,432 table, 2,144 for p6-b300; NVIDIA HGX B200 1.4 TB; GB200 superchip 372 GB for two GPUs | ac.html ; p6 ; hgx ; gb200-nvl72 | C05-2 (the 2,148 vs 8 x 268 arithmetic is NEW) [our reading for "the figure the instance exposes"]
- C05-3: Trainium3 NeuronLink 2.56 TB/s per device (trainium3.html); 2,048 GiB/s per device and 256 / 320 / 128 GB/s bidirectional per level (trn3-arch.html); 2 TB/s per chip (Trn3 product page) | trainium3.html ; trn3-arch.html ; https://aws.amazon.com/ec2/instance-types/trn3/ | C05-3
- C05-4: UltraServers page "(available in preview)" for Trn2; Trn2 product page "Trn2 UltraServers are available now"; Capacity Blocks guide lists Trn2 UltraServer blocks in us-east-2 | https://aws.amazon.com/ec2/ultraservers/ ; trn2 product page ; https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html (2026-10-30) | C05-4, T05-46
- U01-13 / C01-4: Trainium2 667 BF16 and 1,299 FP8 per chip; NeuronCore-v3 79 BF16 and 158 cFP8 per core, x 8 = 632 and 1,264, about 5% and 3% lower; no clock stated | trainium2.html ; https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/neuron-core-v3.html | T01-30, T01-51, C01-4, U01-13 hedge

## New silicon

- Generation table values (BF16, HBM GiB, 8-bit) from presets | as the table rows above | T05-14, T05-15, T05-18
- H200 = H100 compute with 76% more HBM (141 / 80) | h100 ; h200 ; ac.html | T05-14, W5-26 [derived]
- B300 keeps B200's BF16 and FP8 peaks with 50% more HBM (268 / 179 = 1.497) | hgx ; ac.html | T05-15, W5-21 [derived]
- Trainium3 keeps Trainium2's BF16 (671 vs 667) and roughly doubles the 8-bit peak, 1,299 FP8 to 2,517 MXFP8 (1.94x); 144 vs 96 GiB | trainium3.html | T05-18, W5-27 (SCOPE NARROWER wording used)
- A BF16 run on the newer part keeps its peak, so at equal MFU its step takes as long; gain is memory | none | SCOPE section 21 [our reading]
- TorchNeuron: bfloat16 is the training baseline; FP8 and MXFP8 require Trainium 3 | https://github.com/aws-neuron/aws-neuron-sdk/blob/10832bbcc6b6920b3046a7d7aa59b6b684f6b81a/torch/about-pytorch-neuron.rst#L115-L118 | W3-36, T03-36
- 70B at TP 8 x DP 4, ZeRO-1, 8,192 tokens, micro-batch 1, BF16 gradients, no recomputation: 85.0 GB per GPU; fits the H200 target 105.8 GB (75% of 141 GB); exceeds the H100's 80 GB | Calculator C (`evaluateLayout`, same inputs as SetMyRanks.tsx EX2_TP8 and EX2_H100_TP8) | section 14 example 2; 75% headroom is the dive's assumption (W1-24)
- H100 needs full recomputation or a four-stage pipeline instead | SetMyRanks.tsx example 2 | section 14

## Node-count floor

- Model state 16 bytes per parameter with mixed-precision Adam | https://arxiv.org/abs/1910.02054v3 (2026-10-30) | T01-9
- Llama 3.1 70B has 70,553,706,496 parameters | https://huggingface.co/api/models/meta-llama/Llama-3.1-70B (2026-10-30) | T01-3
- 70,553,706,496 x 16 = 1,128,859,303,936 bytes = 1,128.9 GB | modelStateBytes | 05 section 3.3, W5-24 [derived]
- HBM per instance from GiB x accelerators: p4d 343.6 GB (3.29), p5 687.2 (1.64), p5en 1,211.2 (0.93), p6-b200 1,537.6 (0.73), p6-b300 2,302.1 (0.49, from 8 x 268 GiB), trn1 549.8 (2.05), trn2 1,649.3 (0.68) | ac.html ; Neuron trainium2.html | 05 section 3.3, W5-24 [derived]; p6-b300 differs from the register's 2,306 GB because the register used the page's 2,148 GiB total (ratio 0.49 either way); trn1 row is NEW arithmetic on cited inputs
- With NVIDIA's 80 GB per H100 (Calculator B's smaller figure), P5 needs 1.76 | derived | C02-7 [derived, NEW]
- On P5 every 70B layout splits state across EFA, by sharding or pipeline stages; on p5en, p6-b200, p6-b300, trn2 the state alone fits one instance | derived from the floor | [our reading]
- Next action: dense peak into Calculator A (section 4), HBM per rank into B (section 5) and C (section 14), domain size as TP ceiling, EFA per instance as divisor; section 22 prices the count | cross-references | SCOPE section 21 practical value

## Links (navigational, not cited)

- EFA dive, section 8: Instance Support Matrix; section 7: The EC2 Instance Topology API (from `deep-dives/efa/src/App.tsx`)
- Silicon, Memory and Modern Inference dive, section 19: AWS Trainium, Inferentia and Neuron; section 16: Grace-Blackwell and UltraServer (from `deep-dives/silicon-memory-inference/src/App.tsx`)
