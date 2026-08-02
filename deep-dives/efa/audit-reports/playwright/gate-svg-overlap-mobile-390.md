# gate-svg-overlap (mobile-390)

Status: **PASS** (0 finding(s))

| field | value |
| --- | --- |
| generated | 2026-08-02T21:50:55.618Z |
| viewport | 390 x 844 |
| base URL | http://127.0.0.1:4173/ |
| sections visited | 20 |
| diagrams checked | 31 |

## Scope

- Scope is every svg in the content region that paints at least one <text>. Cloudscape icon svgs carry no text and are out of scope.
- Geometry is in viewBox user units, converted from client rects through the inverse of the svg screen CTM, so nested transform groups are handled.
- A pair counts as colliding only when the boxes overlap by more than 2 user units on both axes. Text boxes include ascender and descender padding, so adjacent lines of a stacked label do not trip it.
- Text counts as clipped when it sits more than 1 user units outside the viewBox.
- Collapsed ExpandableSections are opened before measuring.
- Advisory only: any diagram whose smallest label renders below 8 screen pixels is listed but does not fail the gate.

## Findings

None.

## Advisories

These do not change the verdict above. They are a human judgement call.

### datapath (3)

**efa-d01-osbypass-title - A message sent over TCP crosses a system call, a socket buffer copy, the TCP protocol stack and the ENA driver...**

- smallest label renders at 3.5px (27 of 27 labels below 8px). The diagram is 308px wide here against a 880-unit viewBox.

**efa-d03-kernelsplit-title - The EFA kernel driver is on the control plane only. It creates queue pairs, protection domains, memory regions...**

- smallest label renders at 3.5px (23 of 23 labels below 8px). The diagram is 308px wide here against a 880-unit viewBox.

**efa-d04-doorbell-title - Sending one message costs six steps and no system calls. The application builds a work queue entry, writes it ...**

- smallest label renders at 3.5px (22 of 22 labels below 8px). The diagram is 308px wide here against a 880-unit viewBox.

### srd (3)

**efa-d05-srdroce-title - SRD and RoCEv2 make opposite bets about the network. InfiniBand Reliable Connected and RoCEv2 both deliver pac...**

- smallest label renders at 3.6px (48 of 48 labels below 8px). The diagram is 308px wide here against a 940-unit viewBox.

**efa-d06-spray-title - SRD splits a single message across many fabric paths at the same time and puts it back together at the receive...**

- smallest label renders at 3.4px (16 of 16 labels below 8px). The diagram is 308px wide here against a 900-unit viewBox.

**efa-d07-loss-title - When SRD loses a packet, the EFA device retransmits it on a different fabric path, and the application never s...**

- smallest label renders at 3.4px (9 of 9 labels below 8px). The diagram is 308px wide here against a 900-unit viewBox.

### device (2)

**efa-attach-modes-title - An EFA-only interface creates an EFA device and no ENA device, which is why it cannot be the primary interface...**

- smallest label renders at 3.8px (22 of 22 labels below 8px). The diagram is 308px wide here against a 900-unit viewBox.

**efa-cards-rails-title - Network cards, network interfaces, EFA devices and rails are four different counts. A p5.48xlarge has 32 netwo...**

- smallest label renders at 3.4px (29 of 29 labels below 8px). The diagram is 308px wide here against a 900-unit viewBox.

### libfabric (2)

**libfabric-stack-title - Nothing talks to the EFA device directly. NCCL, MPI and NIXL all reach it through libfabric, whose EFA provide...**

- smallest label renders at 3.8px (19 of 19 labels below 8px). The diagram is 308px wide here against a 900-unit viewBox.

**efa-protocol-ladder-title - The efa fabric picks a two-sided protocol by message size, and the ladder is different for host memory and for...**

- smallest label renders at 3.4px (21 of 21 labels below 8px). The diagram is 308px wide here against a 900-unit viewBox.

### ena (3)

**ena-efa-devices-title - One network interface attachment can materialize one PCI function or two, and the two are different devices ra...**

- smallest label renders at 3.8px (34 of 34 labels below 8px). The diagram is 308px wide here against a 900-unit viewBox.

**ena-efa-pen-title - ENA and EFA push transmit descriptors into the same write-combined memory region on the Nitro card, base addre...**

- smallest label renders at 3.4px (29 of 29 labels below 8px). The diagram is 308px wide here against a 900-unit viewBox.

**ena-efa-substrate-title - SRD, the Scalable Reliable Datagram transport, lives in the Nitro card below both devices. The ENA device cons...**

- smallest label renders at 3.5px (17 of 17 labels below 8px). The diagram is 308px wide here against a 880-unit viewBox.

### topology (3)

**efa-d10-title - DescribeInstanceTopology returns one network node per network layer, listed from the top of the hierarchy down...**

- smallest label renders at 3.3px (25 of 25 labels below 8px). The diagram is 308px wide here against a 940-unit viewBox.

**efa-d10b-title - DescribeCapacityReservationTopology returns a partial node set for a reservation that has no instances yet, an...**

- smallest label renders at 3.4px (26 of 26 labels below 8px). The diagram is 308px wide here against a 900-unit viewBox.

**efa-d11-title - Each network node in the response is a containment level between the Availability Zone and the instance, so th...**

- smallest label renders at 3.4px (16 of 16 labels below 8px). The diagram is 308px wide here against a 900-unit viewBox.

### instances (1)

**efa-gen-map-title - The EFA generation to Nitro version mapping. Nitro v6 pairs with EFA v4, Nitro v5 with EFA v3, Nitro v4 with E...**

- smallest label renders at 3.8px (20 of 20 labels below 8px). The diagram is 308px wide here against a 900-unit viewBox.

### nccl (2)

**nccl-stack-title - NCCL never talks to EFA directly. It loads aws-ofi-nccl as a network plugin, the plugin calls libfabric, and l...**

- smallest label renders at 3.8px (21 of 21 labels below 8px). The diagram is 308px wide here against a 900-unit viewBox.

**nccl-knobs-title - Every tuning variable belongs to exactly one layer, and most of the ones circulating for EFA are either owned ...**

- smallest label renders at 3.8px (36 of 36 labels below 8px). The diagram is 308px wide here against a 900-unit viewBox.

### storage (3)

**sdp-three-paths-title - A single GPU instance has four data paths available to it here, and only two of them touch the fabric. EFA wit...**

- smallest label renders at 3.3px (46 of 46 labels below 8px). The diagram is 308px wide here against a 920-unit viewBox.

**fod-doors-title - Deployment type and EFA enablement are set in the create-file-system call and cannot be changed afterwards, so...**

- smallest label renders at 3.3px (30 of 30 labels below 8px). The diagram is 308px wide here against a 920-unit viewBox.

**tfo-fanout-title - The throughput target passed to the Common Runtime S3 client is a divisor, not a rate limiter. One number pick...**

- smallest label renders at 3.3px (31 of 31 labels below 8px). The diagram is 308px wide here against a 920-unit viewBox.

### eks (3)

**eks-layer-cake-title - The EKS node image supplies only the EFA kernel driver and the rdma-core userspace, so libfabric, Open MPI, aw...**

- smallest label renders at 3.4px (35 of 35 labels below 8px). The diagram is 308px wide here against a 900-unit viewBox.

**eks-minimal-title - The minimal flag on the EFA installer withholds four package families rather than the two that AWS documentati...**

- smallest label renders at 3.4px (24 of 24 labels below 8px). The diagram is 308px wide here against a 900-unit viewBox.

**eks-node-lanes-title - Four different node provisioning mechanisms write the same EC2 network interface configuration in four differe...**

- smallest label renders at 3.3px (31 of 31 labels below 8px). The diagram is 308px wide here against a 900-unit viewBox.

### sagemaker (4)

**sm-contracts-title - Training jobs and HyperPod answer all four EFA ownership questions, with different owners at every stage, whil...**

- smallest label renders at 2.9px (43 of 43 labels below 8px). The diagram is 308px wide here against a 960-unit viewBox.

**sm-gates-title - A SageMaker training job only runs NCCL over EFA after passing four gates: an EFA-capable instance type, a con...**

- smallest label renders at 3.2px (32 of 32 labels below 8px). The diagram is 308px wide here against a 960-unit viewBox.

**sm-smddp-title - SMDDP supports only three instance types, all of them P3dn or P4 generation, and its optimized AllGather is P4...**

- smallest label renders at 3.2px (21 of 21 labels below 8px). The diagram is 308px wide here against a 960-unit viewBox.

**sm-dpd-title - HyperPod disaggregated prefill and decode moves the key-value cache from a prefiller pod to a decoder pod on a...**

- smallest label renders at 3.5px (22 of 22 labels below 8px). The diagram is 308px wide here against a 960-unit viewBox.

### operations (2)

**efa-ops-triage-title - A job that returns correct results slowly should be triaged from the bottom of the stack upward: first confirm...**

- smallest label renders at 3.3px (33 of 33 labels below 8px). The diagram is 308px wide here against a 940-unit viewBox.

**efa-ops-layers-title - EFA failure modes sit at five different layers, and the ones that stop a job outright are concentrated in the ...**

- smallest label renders at 3.3px (37 of 37 labels below 8px). The diagram is 308px wide here against a 940-unit viewBox.

## Sections visited

overview, datapath, srd, device, libfabric, ena, topology, instances, nccl, training, inference, hpc, storage, comparison, eks, sagemaker, operations, pricing, decision, sources
