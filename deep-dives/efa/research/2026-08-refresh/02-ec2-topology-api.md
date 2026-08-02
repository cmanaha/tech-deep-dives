# EC2 Instance Topology API & Topology-Aware Placement — Research Report

**Research date / accessed:** 2026-08-01
**Scope:** `DescribeInstanceTopology`, `DescribeCapacityReservationTopology`, network-node hierarchy semantics, consumption patterns (Slurm / MPI / NCCL / Kueue), relationship to placement groups, Capacity Blocks, ODCRs, and integration points (HyperPod, EKS, PCS, Karpenter).
**Target:** New major section for the EFA deep dive at `/Users/carlos/workspace/git_repositories/tech-deep-dives/deep-dives/efa/`.

---

## 0. Source-tier legend

| Tier | Meaning |
|---|---|
| **[T1]** | Official AWS docs, API reference, official first-party source code (github.com/aws) |
| **[T2]** | AWS blogs, AWS what's-new announcements, `aws-samples` repos |
| **[T3]** | Third-party analysis, academic papers |
| **[SPECULATIVE]** | My inference / derivation, explicitly not sourced |

Where a number is not stated by any source, this report writes **UNKNOWN**. No estimates.

---

## 1. What already exists in the EFA deep dive (audit — do not duplicate)

Grep of `deep-dives/efa/src/` and `deep-dives/efa/docs/` for `topology` / `DescribeInstanceTopology`:

| File | Line(s) | What it currently says |
|---|---|---|
| `src/sections/Sources.tsx` | 19 | Source #29 — `DescribeInstanceTopology` API reference, tier 1, `accessDate: '2026-03-22'` |
| `src/sections/Sources.tsx` | 27 | Source #34 — `aws/aws-ofi-nccl topology XML files` (`/topology` dir), tier 1 |
| `src/sections/Sources.tsx` | 134 | Claim: "NCCL does not call EC2 topology API — topology graph is intra-node only" |
| `src/sections/Sources.tsx` | 135 | Claim: "P5/P5en have no topology XML — plugin uses `sort_rails()` instead" |
| `src/sections/Architecture.tsx` | 57–65 | "Network Topology: Intra-Node vs Inter-Node" container + `<NetworkTopologyDiagram />` — this is about NVLink vs EFA bandwidth, **not** about the EC2 topology API |
| `src/sections/Architecture.tsx` | 176–180 | One paragraph: "NCCL does NOT call the EC2 topology API… Inter-node topology is consumed by the scheduler layer (Slurm, torchrun, MPI hostfile generators) via `DescribeInstanceTopology`." |
| `src/sections/DecisionGuide.tsx` | 145–178 | "Topology-Aware Rank Assignment" container. Mostly `NCCL_TOPO_FILE` / tuner plugin. One paragraph names three layers and says EC2 topology API returns "3-4 layers of hashed network node IDs" and that the opportunity is "assembling them". |
| `src/sections/DecisionGuide.tsx` | 181–200+ | "EFA + Karpenter: Topology-Aware Scheduling" — this is about `topology.kubernetes.io/zone`, placement groups, consolidation, capacity type. **It does not mention `topology.k8s.aws/network-node-layer-*` at all.** |
| `src/sections/AIMLTraining.tsx` | 133–223 | `NCCL_TOPO_FILE`, NCCL topology XML schema, P4d/P4de XML present, P5/P5en absent |
| `docs/adr/ADR-003-iteration-flywheel.md` | 80 | Explicitly backlogged: "Missing topology-aware rank assignment section" → "No — backlog for next iteration" |

### Verdict on existing coverage

**Total existing coverage of the EC2 Topology API is ~2 paragraphs and 1 source entry.** The site currently:

1. **Correctly** frames the three-independent-layers model (NCCL intra-node graph / aws-ofi-nccl platform detection / EC2 inter-node API). Keep this framing and build on it.
2. **Correctly** states NCCL does not call the API itself.
3. **Has no** request/response shape, no field semantics, no `groupName` / `capacityBlockId` / `zoneId` explanation, no supported-instance-type list, no region list, no IAM, no quota discussion.
4. **Is missing entirely**: `DescribeCapacityReservationTopology` (GA 2025-10-30), the 4-layer hierarchy, `topology.k8s.aws/network-node-layer-*` labels, Kueue TAS annotations, Slurm `topology/tree` vs `topology/block`, `hostfile-topologify.py`.
5. **Contains a likely-misleading heading**: `DecisionGuide.tsx:181` titles a container "EFA + Karpenter: Topology-Aware Scheduling", but AWS documentation states topology-aware scheduling is **not supported with Karpenter** (see §7.4). The heading should be renamed or the caveat added.
6. The ADR already flags this as a known gap — this section closes ADR-003's backlog item.

**Conclusion: build a new dedicated section. Cross-link to (don't rewrite) the existing NCCL-topology material in `AIMLTraining.tsx` and `DecisionGuide.tsx`.**

---

## 2. `DescribeInstanceTopology` — exact API contract

**[T1]** https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeInstanceTopology.html — accessed 2026-08-01

### 2.1 Purpose (verbatim)

> "Describes a tree-based hierarchy that represents the physical host placement of your EC2 instances within an Availability Zone or Local Zone. You can use this information to determine the relative proximity of your EC2 instances within the AWS network to support your tightly coupled workloads."

### 2.2 Request parameters (complete, verbatim constraints)

| Parameter | Type | Required | Constraints / notes |
|---|---|---|---|
| `DryRun` | Boolean | No | Returns `DryRunOperation` if permitted, `UnauthorizedOperation` otherwise |
| `Filter.N` | Array of `Filter` | No | Supported filter names: `availability-zone`, `instance-type`, `zone-id` |
| `GroupName.N` | Array of String | No | **"Maximum 100 explicitly specified placement group names."** |
| `InstanceId.N` | Array of String | No | **"Maximum 100 explicitly specified instance IDs."** Default: describes all your instances |
| `MaxResults` | Integer | No | **Default `20`. Valid range: min 1, max 100.** "You can't specify this parameter and the instance IDs parameter in the same request." |
| `NextToken` | String | No | Standard EC2 pagination token |

Filter value semantics **[T1]**:
- `availability-zone` — AZ name (`us-west-2a`) or Local Zone name (`us-west-2-lax-1b`)
- `instance-type` — exact type (`p4d.24xlarge`) **or** family with wildcards: `*` matches zero or more chars, `?` matches zero or one char (e.g. `p4d*`)
- `zone-id` — AZ ID (`usw2-az2`) or Local Zone ID (`usw2-lax1-az1`)

### 2.3 Response elements

| Element | Type |
|---|---|
| `instanceSet` | Array of `InstanceTopology` |
| `nextToken` | String — `null` when no more items |
| `requestId` | String |

### 2.4 `InstanceTopology` data type — every field

**[T1]** https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_InstanceTopology.html — accessed 2026-08-01

| Field | Type | Verbatim description |
|---|---|---|
| `availabilityZone` | String | "The name of the Availability Zone or Local Zone that the instance is in." |
| `capacityBlockId` | String | "The ID of the Capacity Block. **This parameter is only supported for UltraServer instances and identifies instances within the UltraServer domain.**" |
| `groupName` | String | "The name of the placement group that the instance is in." |
| `instanceId` | String | "The instance ID." |
| `instanceType` | String | "The instance type." |
| `NetworkNodeSet.N` | Array of String | "The network nodes. **The nodes are hashed based on your account. Instances from different accounts running under the same server will return a different hashed list of strings.** The value is `null` or empty if: the instance type is not supported; the instance is in a state other than `running`." |
| `zoneId` | String | "The ID of the Availability Zone or Local Zone that the instance is in." |

> **Load-bearing gotcha #1 [T1]:** network node IDs are **per-account hashes**. Two accounts describing the *same physical server* get *different* `nn-…` strings. Any cross-account topology correlation (multi-account training fleets, shared Capacity Reservations across an AWS Organization) is impossible with these IDs. Existing deep-dive text at `DecisionGuide.tsx:172` says "hashed network node IDs" but does not state the cross-account consequence.

> **Load-bearing gotcha #2 [T1]:** all fields are `Required: No`. Defensive parsing is mandatory — `NetworkNodes` can be `null`/empty for an unsupported type or a non-`running` instance, and `capacityBlockId` is only ever populated for UltraServer instances.

### 2.5 Eventual consistency (verbatim) **[T1]**

> "The Amazon EC2 API follows an eventual consistency model due to the distributed nature of the system supporting it. As a result, when you call the DescribeInstanceTopology API command immediately after launching instances, the response might return a `null` value for `capacityBlockId` because the data might not have fully propagated across all subsystems."

Referenced: https://docs.aws.amazon.com/ec2/latest/devguide/eventual-consistency.html

### 2.6 Response shape (verbatim example, from AWS docs)

```json
{
    "Instances": [
        {
            "InstanceId": "i-1111111111example",
            "InstanceType": "p4d.24xlarge",
            "GroupName": "ML-group",
            "NetworkNodes": [
                "nn-1111111111example",
                "nn-2222222222example",
                "nn-3333333333example"
            ],
            "CapacityBlockId": "null",
            "ZoneId": "usw2-az2",
            "AvailabilityZone": "us-west-2a"
        }
    ],
    "NextToken": "SomeEncryptedToken"
}
```

Note the wire quirk **[T1]**: AWS's own published examples render an absent Capacity Block as the **string** `"null"`, not JSON `null`. Worth calling out in the deep dive — naive `if capacity_block_id:` truthiness checks in Python will treat `"null"` as truthy.

### 2.7 CLI / PowerShell surface **[T1]**

```bash
aws ec2 describe-instance-topology --region us-west-2 \
    --instance-ids i-1111111111example i-2222222222example

aws ec2 describe-instance-topology --region us-west-2 \
    --group-names ML-group HPC-group

aws ec2 describe-instance-topology --region us-west-2 \
    --filters Name=instance-type,Values=trn1*

aws ec2 describe-instance-topology --region us-east-1 \
    --filters "Name=instance-type,Values=p4d*,trn1n.32xlarge" \
              "Name=zone-id,Values=use1-az1,use1-atl2-az1"
```

PowerShell: `Get-EC2InstanceTopology` / `Get-EC2CapacityReservationTopology`.

---

## 3. The network-node hierarchy — what the levels actually mean

**[T1]** https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/how-ec2-instance-topology-works.html — accessed 2026-08-01

### 3.1 The stated model (verbatim)

> "The AWS network is arranged in a hierarchy of layers. EC2 instances connect into the network at or below the third layer, depending on the instance type. An instance's topology is described by a set of nodes, with one node in each layer of the network. The node set … provides a top-down view of the network hierarchy, with the bottom node connected to an instance."

> "Some instance types comprise 4 network nodes in a node set representing 4 layers in the network, while others comprise 3 network nodes representing 3 layers in the network."

### 3.2 Interpretation rules (verbatim, AWS's own wording)

> "`NetworkNodes` describes the network node set of a single instance."
> "In each network node set, the network nodes are listed in hierarchical order from top to bottom."
> "The network node that is connected to the instance is the last network node in the list (the bottom layer)."
> "To work out which instances are close to each other, first find common network nodes in the bottom layer. If there are no common network nodes in the bottom layer, then find common network nodes in the upper layers."

> "As a general rule, if the network node connected to any two instances is the same, these instances are physically close to each other… Furthermore, the fewer the number of hops between network nodes, the closer the instances are to each other."

### 3.3 The worked example AWS publishes

Diagram asset: `http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/images/instance-topology.png` — nodes labelled NN1–NN7, layers **i**, **ii**, **iii**, instances 1–4.

| Instance | Node set | Reading |
|---|---|---|
| 1 | NN1, NN2, NN4 | — |
| 2 | NN1, NN2, NN4 | Identical set to instance 1 → **closest possible pair** |
| 3 | NN1, NN2, NN5 | Shares NN2 (layer ii) with 1 & 2 → close, but one hop further |
| 4 | NN1, NN3, NN6 | Only shares NN1 (layer i) → furthest |

AWS's conclusion, verbatim: "instances 1, 2, and 3 are closer to each other than they are to instance 4 because they share NN2 in their network node set."

Also verbatim: "There are no instances running under network node 7 (NN7) in this example, and therefore the API output won't include NN7." — i.e. **the API returns a projection of the tree restricted to your running instances, not the full physical tree.**

### 3.4 Shared-prefix depth as a distance metric

The interpretation rules above are exactly a **longest-common-prefix** metric on the node list. Formally:

```
distance(a, b) = len(nodes_a) - lcp_len(nodes_a, nodes_b)
```

where `lcp_len` is the length of the longest common prefix. Distance 0 = same bottom node (closest). Distance 1 = shares everything but the leaf. Distance = `len(nodes)` = shares nothing (different top-layer node → in practice a different AZ or a different spine).

**[SPECULATIVE]** — the mapping of layer i/ii/iii onto *named* datacenter constructs (spine / aggregation / leaf / rack / ToR) is **not published by AWS**. AWS says only "a hierarchy of layers" and "the network node that is connected to the instance". AWS blog copy uses the loose phrasing "Availability Zones, network blocks, and physical racks" **[T2]** (HyperPod task-governance doc), but does **not** bind layer index → construct name. **Do not assert "layer 3 = leaf switch / ToR" as fact in the deep dive.** Write it as an analogy and label it.

**CONTRADICTION / ambiguity worth flagging:**
- **[T1]** EC2 User Guide: "EC2 instances connect into the network at or below the third layer, depending on the instance type" — implying the layer *indices* are absolute positions in a global AWS network hierarchy.
- **[T1]** `DescribeInstanceTopology` response: the array is per-instance and 3 or 4 elements long depending on instance type.

Consequence: for a 3-node instance type, `NetworkNodes[2]` is the leaf; for a 4-node type (`p6-b200.48xlarge`, `p6-b300.48xlarge`), `NetworkNodes[3]` is the leaf. **Index-from-the-end (`nodes[-1]`), never index-from-the-start.** See §6.3 for a first-party tool that gets this wrong.

---

## 4. Supported instance types, regions, state, IAM

**[T1]** https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-topology-prerequisites.html — accessed 2026-08-01

### 4.1 Instance types

**Returns 3 network nodes:**

- G-family: `g6e.xlarge`, `g6e.2xlarge`, `g6e.4xlarge`, `g6e.8xlarge`, `g6e.12xlarge`, `g6e.16xlarge`, `g6e.24xlarge`, `g6e.48xlarge`, `g7e.2xlarge`, `g7e.4xlarge`, `g7e.8xlarge`, `g7e.12xlarge`, `g7e.24xlarge`, `g7e.48xlarge`
- HPC: `hpc6a.48xlarge`, `hpc6id.32xlarge`, `hpc7g.4xlarge`, `hpc7g.8xlarge`, `hpc7g.16xlarge`, `hpc7a.12xlarge`, `hpc7a.24xlarge`, `hpc7a.48xlarge`, `hpc7a.96xlarge`, `hpc8a.96xlarge`
- P-family: `p3dn.24xlarge`, `p4d.24xlarge`, `p4de.24xlarge`, `p5.48xlarge`, `p5e.48xlarge`, `p5en.48xlarge`, `p6e-gb200.36xlarge`
- Trainium: `trn1.2xlarge`, `trn1.32xlarge`, `trn1n.32xlarge`, `trn2.48xlarge`, `trn2u.48xlarge`

**Returns 4 network nodes:**

- `p6-b200.48xlarge`, `p6-b300.48xlarge`

Verbatim footnote: "The number of network nodes returned is only applicable when using the DescribeInstanceTopology API. For the DescribeCapacityReservationTopology API, the number of network nodes returned will vary depending on the type and state of the Capacity Reservation."

> **Notable:** `p6e-gb200.36xlarge` (the GB200 UltraServer instance) is listed under **3** nodes in the EC2 prerequisites page, while `p6-b200`/`p6-b300` are **4**. But **[T2]** the AWS Containers blog on P6e-GB200 + DRA says P6e-GB200 nodes in EKS are labelled `topology.k8s.aws/network-node-layer-1` **through `network-node-layer-4`**. **CONTRADICTION:** EC2 prerequisites page **[T1]** places `p6e-gb200.36xlarge` in the 3-node bucket; the Containers blog **[T2]** describes layer-1..layer-4 labels on P6e-GB200 nodes. Tier-1 doc wins for the API contract; the blog may be describing the general label schema rather than that instance's actual depth. **Write the deep dive to read depth dynamically, not to hard-code 3 or 4.**

### 4.2 Regions (verbatim list) **[T1]**

US East (N. Virginia), US East (Ohio), US West (N. California), US West (Oregon); Africa (Cape Town); Asia Pacific (Jakarta, Hong Kong, Hyderabad, Melbourne, Mumbai, Osaka, Seoul, Singapore, Sydney, Tokyo); Canada (Central); Europe (Frankfurt, Ireland, London, Paris, Spain, Stockholm, Zurich); Israel (Tel Aviv); Middle East (Bahrain, UAE); South America (São Paulo); AWS GovCloud (US-West); AWS European Sovereign Cloud (Germany).

> "The DescribeCapacityReservationTopology API is not supported in Israel (Tel Aviv) and AWS GovCloud (US-West)."

**Region-availability regression to note:** **[T2]** the Nov 2023 launch announcement listed only 9 Regions (US East N. Virginia/Ohio, US West Oregon, AP Seoul/Tokyo, Canada Central, EU Frankfurt/Ireland/Stockholm). The current **[T1]** list is ~28. Good "this expanded a lot" data point.

### 4.3 State requirement **[T1]**

- `DescribeInstanceTopology` — instances must be in the **`running`** state.
- `DescribeCapacityReservationTopology` — Capacity Reservations must be **`pending`** or **`active`**.
- "You can't get topology information for instances or Capacity Reservations in any other state."

### 4.4 IAM **[T1]**

Required actions:
- `ec2:DescribeInstanceTopology`
- `ec2:DescribeCapacityReservationTopology`

Practical policy used by AWS's own first-party tool **[T1]** (`aws/aws-ofi-nccl` `contrib/scripts/topology_aware/README.md`) — note it also needs `DescribeInstances` because hostnames must be resolved to instance IDs:

```json
{
  "Version": "2012-10-17",
  "Statement": [{
      "Effect": "Allow",
      "Action": [
        "ec2:DescribeInstances",
        "ec2:DescribeInstanceTopology"
      ],
      "Resource": "*"
  }]
}
```

Both AWS tools note the managed policy `arn:aws:iam::aws:policy/AmazonEC2ReadOnlyAccess` covers this **[T1]/[T2]**. Like all `ec2:Describe*` actions, these do not support resource-level permissions — `"Resource": "*"` is the only option.

### 4.5 Pricing **[T1]**

> "There is no additional cost for describing your EC2 topology."

### 4.6 Rate limits / quotas

**UNKNOWN** — AWS does not publish a default throttle value for `DescribeInstanceTopology` or `DescribeCapacityReservationTopology` in any page located during this research.

What *is* documented **[T1]** (https://docs.aws.amazon.com/ec2/latest/devguide/ec2-api-throttling.html — accessed 2026-08-01): EC2 API throttling is a per-action **token bucket** with two Service Quotas entries per action:

| Quota name pattern | Meaning |
|---|---|
| `{API_NAME}` request bucket maximum capacity | Burst rate — max tokens available |
| `{API_NAME}` request bucket refill rate | Sustained rate — tokens added per second |
| `{API_NAME}` unfiltered request bucket maximum capacity | Burst rate for **unfiltered (unpaginated)** requests |
| `{API_NAME}` unfiltered request bucket refill rate | Sustained rate for unfiltered requests |

Two operational consequences worth writing up:

1. There is a **separate, stricter bucket for "unfiltered" requests**. `aws ec2 describe-instance-topology` with no `--instance-ids` / `--filters` is an unfiltered describe. At cluster scale, always filter or pass instance IDs.
2. `MaxResults` caps at **100** and `InstanceId.N` caps at **100**. A 2,000-node cluster is a minimum of **20 paginated calls**; AWS's own Slurm tool chunks instance lists into groups of 100 **[T2]** (`ec2-topology.py`: `chunk(instances, 100)`).

Exact numbers must be read per-account from the Service Quotas console (`https://console.aws.amazon.com/servicequotas/home/services/ec2/quotas/`) — allow up to 24 hours for quota adjustments to appear.

---

## 5. `DescribeCapacityReservationTopology` — the 2025 addition (entirely missing from the deep dive)

**[T2]** GA announcement: https://aws.amazon.com/about-aws/whats-new/2025/10/capacity-reservation-topology-api-ai-ml-hpc-instance-type/ — **posted 2025-10-30**, accessed 2026-08-01.

Verbatim from the announcement:

> "AWS announces the general availability of the Amazon Elastic Compute Cloud (EC2) Capacity Reservation Topology API. It joins the Instance Topology API in enabling customers to efficiently manage capacity, schedule jobs, and rank nodes for Artificial Intelligence, Machine Learning, and High-Performance Computing distributed workloads. The Capacity Reservation Topology API gives customers a unique per-account hierarchical view of the relative location of their capacity reservations."

> "Customers running distributed parallel workloads are managing thousands of instances across tens to hundreds of capacity reservations. With the Capacity Reservation Topology API, customers can describe the topology of their reservations as a network node set, which will show the relative proximity of their capacity **without the need to launch an instance**."

> "Customers can then use the Instance Topology API, which provides **consistent network nodes** from the Capacity Reservation Topology API with further granularity, enabling a consistent and seamless way to schedule jobs and rank nodes."

Announcement states availability in 26 Regions and "supported on all instances available with the Instance Topology API"; it does not enumerate instance types.

### 5.1 API contract **[T1]**

https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeCapacityReservationTopology.html — accessed 2026-08-01

| Parameter | Type | Constraints |
|---|---|---|
| `CapacityReservationId.N` | Array of String | **Maximum 10** explicitly specified IDs (vs 100 for instances) |
| `DryRun` | Boolean | — |
| `Filter.N` | Array of `Filter` | Only `availability-zone` and `instance-type` (**no `zone-id` filter**, unlike the instance API) |
| `MaxResults` | Integer | **Default `10`. Valid range: min 1, max 10.** (vs default 20 / max 100) |
| `NextToken` | String | — |

Response: `capacityReservationSet` (array of `CapacityReservationTopology`), `nextToken`, `requestId`.

### 5.2 `CapacityReservationTopology` fields **[T1]**

https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_CapacityReservationTopology.html — accessed 2026-08-01

| Field | Notes vs `InstanceTopology` |
|---|---|
| `availabilityZone` | same |
| `availabilityZoneId` | **note the name differs** — `availabilityZoneId` here vs `zoneId` on `InstanceTopology` |
| `capacityBlockId` | same semantics (UltraServer only) |
| `capacityReservationId` | replaces `instanceId` |
| `groupName` | placement group the CR is in |
| `instanceType` | same |
| `NetworkNodeSet.N` | same per-account hashing caveat; `null`/empty if type unsupported or CR not `active`/`pending` |
| `state` | **new** — current CR state |

> **API-design wart worth flagging in the deep dive [T1]:** the AZ-ID field is called `zoneId` on `InstanceTopology` and `availabilityZoneId` on `CapacityReservationTopology`. Code that unions both responses must handle both key names.

### 5.3 Documented differences table (verbatim from AWS) **[T1]**

| Comparison point | `DescribeInstanceTopology` | `DescribeCapacityReservationTopology` |
|---|---|---|
| Usage phase | Post-launch (execution mode) | Pre-launch (planning and management mode) |
| Primary purpose | Optimize workloads on running instances | Capacity planning and Capacity Reservation management (merge, split, assign) before instance launch |
| Number of network nodes | "Shows all nodes for a running instance. If the instance is in a Capacity Reservation, **the first nodes will match the corresponding Capacity Reservation topology, followed by additional nodes to connect to the instance.**" | "Shows a partial set of nodes, which vary based on the Capacity Reservation state (`pending` or `active`) and type." |
| State | Instances must be `running` | CRs must be `pending` or `active` |

Footnote verbatim: "For Capacity Blocks for Ultraservers, the network node set is the same when describing the topology for an `active` Capacity Reservation or its running instance."

> **This prefix-consistency guarantee is the single most useful new fact in the 2025 update.** It means: the node set you get pre-launch from a CR is a **prefix** of the node set you get post-launch from the instances in it. You can therefore do capacity-shopping (which CRs are co-located?) *before* spending a single instance-hour, and the answer will not be invalidated once you launch.

### 5.4 Worked CR example (verbatim) **[T1]**

```json
{
    "CapacityReservations": [
        {
            "CapacityReservationId": "cr-1111111111example",
            "CapacityBlockId": "null",
            "State": "active",
            "InstanceType": "p4d.24xlarge",
            "NetworkNodes": [
                "nn-1111111111example",
                "nn-2222222222example"
            ],
            "AvailabilityZone": "us-west-2a"
        },
        {
            "CapacityReservationId": "cr-2222222222example",
            "CapacityBlockId": "null",
            "State": "active",
            "InstanceType": "trn1.2xlarge",
            "NetworkNodes": [
                "nn-1111111111example",
                "nn-3333333333example"
            ],
            "AvailabilityZone": "us-west-2a"
        }
    ]
}
```

AWS's own reading, verbatim: "Because the Capacity Reservations are on different network nodes in `layer ii`, communication from instances in one Capacity Reservation to instances in the other Capacity Reservation will be inefficient."

CLI **[T1]**:
```bash
aws ec2 describe-capacity-reservation-topology --region us-east-1 \
    --capacity-reservation-id cr-1111111111example cr-2222222222example

aws ec2 describe-capacity-reservation-topology --region us-east-1 \
    --filters Name=instance-type,Values=p5en.48xlarge
```

---

## 6. How to actually use it

### 6.1 The ranking/sorting algorithm

The published sort **[T1]** (`aws/aws-ofi-nccl` `contrib/scripts/topology_aware/hostfile-topologify.py`, Copyright 2025 Amazon.com) is a **two-level bucket sort**, not a general LCP sort:

```python
l2_node = instance['NetworkNodes'][1]
l3_node = instance['NetworkNodes'][2]
network_to_hostname[l2_node][l3_node].append(hostname)
...
for l2 in network_to_hostname:
    for l3 in network_to_hostname[l2]:
        for hostname in network_to_hostname[l2][l3]:
            output_file.write("%s\n" % hostname)
```

Effect: hosts sharing a leaf (`l3`) are emitted contiguously; leaves under the same `l2` are emitted contiguously. Adjacent MPI ranks therefore land on physically adjacent hosts. That is the whole trick — no graph algorithm, just a stable nested grouping.

The script's own docstring **[T1]**:

> "It takes a hostfile containing a list of hostnames (one per line) and reorders them so that adjoining ranks are as close as possible in the network topology."

Additional mechanics worth reproducing in the deep dive **[T1]**:
- It paginates in batches of `pagination_count = 64`.
- It resolves hostname → private IP via `socket.gethostbyname(socket.getfqdn(hostname))` with `max_retries = 5`, **because "PCluster uses custom hostnames that the EC2 control plane doesn't see."** This is why `ec2:DescribeInstances` is needed alongside `ec2:DescribeInstanceTopology`.
- It then maps private IP → instance ID via `describe_instances` with filter `network-interface.addresses.private-ip-address`.

> **BUG / caveat to surface [T1, code read; impact SPECULATIVE]:** `hostfile-topologify.py` hard-codes `NetworkNodes[1]` and `NetworkNodes[2]`. For the **4-node** instance types (`p6-b200.48xlarge`, `p6-b300.48xlarge`) index 2 is *not* the leaf — index 3 is. On those instance types the script groups by the two middle layers and ignores the leaf entirely, so co-leaf hosts are not guaranteed to be adjacent. The correct generic form is `nodes[-1]` / `nodes[-2]`. Contrast with `aws-samples/ec2-topology-aware-for-slurm` **[T2]**, which does it right: `nb_network_level = len(network)` then recurses to that depth. **[SPECULATIVE]** on the size of the real-world impact — I have not benchmarked it, and AWS has not published a statement about this.

### 6.2 MPI rank file generation (Open MPI)

**[T1]** `aws/aws-ofi-nccl` `doc/topology-aware.md` — accessed 2026-08-01 via GitHub API.

Full published pipeline, verbatim:

```bash
# Note: this sample script is expected to be run inside of a Slurm (e.g. salloc/sbatch/srun) job

HOSTFILE=$(mktemp)
HOSTFILE_TOPO=$(mktemp)
HOSTFILE_TOPO_RMAP=$(mktemp)
scontrol show hostnames | tee ${HOSTFILE}
AWS_DEFAULT_REGION=<your-region>
<path-to-aws-ofi-nccl-library>/contrib/scripts/topology_aware/hostfile-topologify.py \
    --input ${HOSTFILE} --output ${HOSTFILE_TOPO}
(for i in $(cat ${HOSTFILE_TOPO}) ; do seq 1 ${SLURM_NTASKS_PER_NODE} | xargs -i -- echo $i ; done) > ${HOSTFILE_TOPO_RMAP}
```

Then the **sequential mapper** is what actually binds ranks to the sorted order **[T1]**:

```bash
# Open MPI v4.1
mpirun -N ${SLURM_NTASKS_PER_NODE} --hostfile ${HOSTFILE_TOPO_RMAP} \
    --mca rmaps seq  bash -c <your-application-executable>

# Open MPI v5.0
mpirun --hostfile ${HOSTFILE_TOPO_RMAP} --map-by seq \
    bash -c <your-application-executable>
```

AWS's explanation, verbatim: "mpirun specifies arbitrary mappings to use the 'sequential mapper,' which reads the hostfile line by line, assigning processes to nodes in whatever order the hostfile specifies."

> **This is the key teaching point.** Sorting the hostfile does nothing unless you *also* switch the mapper to `seq`. Default Open MPI mapping policies (by slot / by node) will re-order and destroy the topology alignment. `--mca rmaps seq` (v4.1) / `--map-by seq` (v5.0).

Docs referenced by AWS: https://www.open-mpi.org/doc/v4.1/man1/mpirun.1.php#sect12 and https://docs.open-mpi.org/en/v5.0.x/man-openmpi/man1/mpirun.1.html#mapping-ranking-and-binding-oh-my

### 6.3 Slurm `topology.conf` generation

**[T2]** https://github.com/aws-samples/ec2-topology-aware-for-slurm — accessed 2026-08-01 (last pushed 2025-05-30, 13 stars, MIT-0, authors: Maxime Hugues (AWS), Matthew Nightingale (AWS)). Referenced from **[T1]** `aws-ofi-nccl/doc/topology-aware.md` as the recommended Slurm tool.

Workflow **[T2]**:

```bash
# On the ParallelCluster HeadNode, as root
git clone https://github.com/aws-samples/ec2-topology-aware-for-slurm.git
cd ec2-topology-aware-for-slurm
python3 -m venv env && source env/bin/activate && pip3 install -r requirements.txt
python3 ec2-topology.py --cluster_name [CLUSTER_NAME] --instance_type [INSTANCE_TYPE]
# writes /opt/slurm/etc/topology.conf

cat >> /opt/slurm/etc/slurm.conf << EOF
TopologyPlugin=topology/tree
TopologyParam=RouteTree
EOF

scontrol reconfigure
systemctl restart slurmctld
```

Prerequisite stated verbatim **[T2]**: `ec2:DescribeInstanceTopology` on the HeadNode, addable via `AmazonEC2ReadOnlyAccess` in HeadNode `AdditionalIamPolicies`.

Explicit scope caveat, verbatim **[T2]**: **"We recommend this solution for static compute cluster."** — i.e. this is a point-in-time snapshot; it does not react to scale-out or node replacement. Also verbatim about the chart tool: "this is a 'point-in-time' snapshot of current cluster topology. If new instances are added, or instances are replaced, then topology chart will need to be re-run."

How the file is built **[T2]** (`ec2-topology.py`):
- `describe_instances` filtered on `instance-type`, `instance-state-name=running`, `tag:parallelcluster:cluster-name`, `tag:parallelcluster:node-type=Compute`
- chunks instance IDs 100 at a time → `describe_instance_topology`
- maps instance → Slurm node name by matching the **primary ENI** (`DeviceIndex == 0 and NetworkCardIndex == 0`) private IP against `scontrol show nodes --json`
- builds a `defaultdict` tree to depth `nb_network_level = len(network)` (correctly dynamic)
- emits recursively: `SwitchName={k} Switches={children}` for internal nodes, `SwitchName={k} Nodes={hostnames}` for leaves

Resulting `topology.conf` shape, verbatim from **[T1]** SageMaker HyperPod docs (Slurm 24.x format):

```
SwitchName=nn-6fe9d8a965d34d181 Switches=nn-0b53107754517bf0e
SwitchName=nn-0b53107754517bf0e Switches=nn-424c855d4ad825aa4,nn-95acd7c656329fc30
SwitchName=nn-424c855d4ad825aa4 Nodes=ip-10-1-111-198
SwitchName=nn-95acd7c656329fc30 Nodes=ip-10-1-53-231
```

Note the network-node hash **is used verbatim as the Slurm `SwitchName`**. That is the whole bridge between the EC2 API and the Slurm scheduler.

Job submission **[T1]**: `sbatch --switch=1 ...` forces allocation under a single switch.

### 6.4 Slurm `topology/block` (UltraServers) and `topology.yaml` (Slurm 25.11+)

**[T1]** https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-topology.html — accessed 2026-08-01

Slurm 25.11+ uses `topology.yaml` as source of truth and supports **multiple topologies in one file with per-partition assignment**:

```yaml
- topology: tree
  cluster_default: true
  tree:
    switches:
      - switch: root
        children: leaf-0,leaf-1
      - switch: leaf-0
        nodes: compute-p5-1,compute-p5-2
      - switch: leaf-1
        nodes: compute-p5-3,compute-p5-4
- topology: block
  cluster_default: false
  block:
    block_sizes:
      - 18
    blocks:
      - block: cb-001
        nodes: ultraserver-1-[1-18]
```

Slurm 24.x `topology.conf` block format **[T1]**:
```
BlockName=us1 Nodes=ultraserver1-[0-17]
BlockName=us2 Nodes=ultraserver2-[0-17]
BlockSizes=18
```

`topology/block` semantics, verbatim **[T1]**:
> "A block is a consecutive range of nodes / Blocks cannot overlap with each other / All nodes in a block are allocated to a job before the next block is used / The planning block size is the smallest block size configured / Every higher block level size is a power of two than the previous one"

Job flags **[T1]**: `--segment=N` (group N nodes together; must be ≤ planning block size), `--exclusive=topo` (no other jobs on the same block — "useful for benchmarking and performance-sensitive applications").

Documented sizing guidance **[T1]**:
- `BlockSizes=18` (or 17 if one node is spare) matches the UltraServer.
- "If `BlockSizes=18`, jobs with up to 18 instances will always run on a single UltraServer."
- "If `BlockSizes=16`, jobs with fewer than 16 instances will always run on a single UltraServer, while jobs with 18 instances may run on one or two UltraServers."
- `sbatch -N18` → whole block; `-N36` → two blocks; `-N24` → 18 + 6; `-N24 --segment=12` → 12 + 12.

Disable topology-aware placement **[T1]**: `TopologyPlugin=topology/flat` (or `topology/default`).

### 6.5 aws-ofi-nccl "topology awareness" — clarify the two meanings

This is a naming collision the deep dive should explicitly disambiguate, because the existing site content at `AIMLTraining.tsx:216-223` and `Sources.tsx:135` uses "topology" in the *other* sense:

| Sense | Artifact | Scope | Source |
|---|---|---|---|
| **(a)** NCCL topology XML | `aws-ofi-nccl/topology/*.xml`, `NCCL_TOPO_FILE` | **Intra-node**: GPU ↔ NVSwitch ↔ PCIe ↔ NIC. Present for P4d/P4de; absent for P5/P5en (plugin uses `sort_rails()`) | already in the deep dive, source #34 |
| **(b)** EC2 topology awareness | `aws-ofi-nccl/doc/topology-aware.md`, `contrib/scripts/topology_aware/` | **Inter-node**: which hosts are physically close; consumed by the *launcher* (mpirun hostfile), not by NCCL | **[T1]**, new |

Both live in the same repo. Neither calls the other. The existing deep-dive claim "NCCL does NOT call the EC2 topology API" (`Architecture.tsx:176`) remains **correct and verified** — the aws-ofi-nccl EC2-topology tooling is a *contrib script* that runs before `mpirun`, not library code inside the plugin.

---

## 7. Relationship to placement groups, Capacity Blocks, and ODCRs

### 7.1 The central limitation (verbatim) **[T1]**

https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-topology.html — accessed 2026-08-01

> "While topology information helps you understand instance placement, **you can't use it to launch a new instance physically close to an existing instance.** To influence instance placement, you can create Capacity Reservations in cluster placement groups."

Also verbatim: "Each topology view is unique per AWS account." and "The AWS Management Console does not support viewing topology."

> **This is the thesis sentence for the whole section.** The Topology API is **descriptive, not prescriptive**. Placement groups are the *control* plane; the Topology API is the *observability* plane. They solve different halves of the problem.

### 7.2 Placement group interaction

**[T1]** https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/cr-cpg.html — accessed 2026-08-01

> "You can create Capacity Reservations in placement groups that use the following strategies: Cluster; Precision Time."
> "**Spread and Partition placement groups do not support Capacity Reservations.**"

Mapping to the three placement-group strategies:

| Strategy | Intent | Topology API role |
|---|---|---|
| **Cluster** | Pack instances close together for low latency / high throughput | Topology API **verifies** what you got and **ranks within** the CPG. A CPG guarantees "same networking backbone" but does **not** guarantee all members share the same bottom-layer network node — see §7.3. |
| **Spread** | Distinct racks, anti-affinity | Topology API would show maximal divergence. No CR support. Irrelevant for EFA. |
| **Partition** | Grouped failure domains | No CR support. Topology API can observe but not drive. |

`groupName` on the `InstanceTopology` response, plus the `--group-names` request parameter (max 100), is precisely the join key between "the placement group I asked for" and "the physical topology I actually received."

### 7.3 When Topology API adds value beyond a cluster placement group

This is the highest-value analytical section for the deep dive. Grounded claims:

1. **A CPG is a single logical request; it is not a proof of leaf-level co-location.** **[T1]** ParallelCluster troubleshooting doc: "A placement group ensures that your instances are on the same networking backbone." The EC2 topology doc **[T1]** independently says the *only* way to influence placement is a CR in a CPG — and separately says instance sets within an AZ can differ at layers ii and iii. Therefore CPG membership and identical `NetworkNodes` are **not the same predicate**. **[SPECULATIVE]** on how often they diverge — AWS publishes no distribution.

2. **CPGs don't scale to the sizes where this matters.** For jobs spanning multiple CPGs, multiple ODCRs, or multiple Capacity Blocks, there is no single placement construct that covers the whole job. Topology API is the only mechanism that ranks *across* those boundaries. **[T2]** the CR Topology announcement is explicit about this scale: "customers … are managing thousands of instances across tens to hundreds of capacity reservations."

3. **CPGs can't do intra-group ranking.** Even a perfectly co-located CPG has an internal hierarchy. Rank 0↔1 traffic on the same leaf vs across an aggregation node is a real difference, and only the Topology API exposes it. This is the `hostfile-topologify.py` use case.

4. **CPG + ODCR has a known capacity failure mode Topology API helps diagnose.** **[T1]** ParallelCluster docs: zonal Reserved Instances "aren't placed in the same UC (or spine), which can cause insufficient capacity errors (ICEs) when using placement groups", and the documented mitigation is to disable the placement group. The `DescribeCapacityReservationTopology` API is now the pre-launch tool for exactly this diagnosis — check whether your reservations share upper-layer nodes *before* you attach a CPG and get an ICE.

5. **Post-scale-out drift.** Node replacement (spot reclaim, hardware failure, `BatchReplaceClusterNodes`) puts a new instance somewhere the original wasn't. The CPG name is unchanged; the topology is not. Re-running the Topology API is the only way to detect this. **[T2]** `ec2-topology-aware-for-slurm` is explicit that its output is a point-in-time snapshot; **[T1]** HyperPod solves this with continuous reconciliation (§7.5).

### 7.4 Capacity Blocks for ML and UltraServers

- `capacityBlockId` is populated **only for UltraServer instances** and "identifies instances within the UltraServer domain" **[T1]**.
- Verbatim **[T1]**: "For Capacity Blocks for Ultraservers, the network node set is the same when describing the topology for an `active` Capacity Reservation or its running instance."
- **[T1]** An UltraServer contains **up to 18** `p6e-gb200.36xlarge` instances, 4 GPUs each, all GPUs interconnected via NVLink switches. "To leverage this architecture effectively, jobs should be submitted to compute nodes from a single UltraServer."
- **[T1]** AWS PCS: "When you create an AWS PCS cluster with UltraServer compute node groups, the system inspects the Capacity Block, identifies the UltraServer type, and configures Slurm with the appropriate topology plugin… AWS PCS manages topology through a dynamically generated `topology.yaml` file… AWS PCS continuously reconciles the topology configuration to reflect the current cluster state." (https://docs.aws.amazon.com/pcs/latest/userguide/capacity-blocks-nvidia-imex.html)
- **[T1]** PCS on why block topology matters: `topology/block` "ensur[es] that jobs are placed within the same UltraServer and GPU-to-GPU communication uses NVLink **instead of falling back to EFA networking**."

> That last quote is the cleanest statement of why topology matters for an EFA deep dive: **correct topology placement is what keeps traffic off EFA entirely** on NVLink-domain hardware. Good framing hook.

---

## 8. Integration points

### 8.1 SageMaker HyperPod — Slurm

**[T1]** https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-topology.html — accessed 2026-08-01

- Automatic plugin selection: HyperPod "inspects all instance groups and their associated instance types, identifies the GPU communication characteristics of each instance type, and configures Slurm with the appropriate topology plugin. This process runs automatically and does not require any configuration."
- UltraServer types → `topology/block`; other topology-capable types → `topology/tree`.
- **Partition-level topology (Slurm 25.11+)** — resolution rules, verbatim:
  - all instance groups in the partition are UltraServer → `block`
  - all support network topology (not all UltraServer) → `tree`
  - mixed UltraServer + other topology-capable → `tree`
  - any group without topology support → no assignment, inherits cluster-wide `flat`
- Cluster default: one topology present → that one; both block+tree with no non-topology groups → `tree`; any non-topology group → `flat` "so that those nodes remain schedulable."
- **Dynamic topology updates** — regenerated on scale-up, scale-down, and node replacement (including `BatchReplaceClusterNodes`). "the topology always reflects the actual cluster state."
- Manual override warning, verbatim: "manual changes may be overwritten by HyperPod during subsequent cluster updates."
- Slurm 24.x limitations with `topology/block` + heterogeneous clusters: "Only nodes listed in blocks are schedulable by Slurm" and "Every block must have at least `BlockSizes[0]` nodes."

### 8.2 SageMaker HyperPod — EKS / task governance / Kueue

**[T1]** https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-operate-console-ui-governance-tasks-scheduling.html — accessed 2026-08-01

Minimum version: **HyperPod task governance `v1.2.2-eksbuild.1` or higher.**

Supported instance types (note this list differs from the EC2 prerequisites list — it includes `ml.p6-b300.48xlarge` but **not** `ml.p6-b200.48xlarge`, and no G6e/G7e/HPC families):
`ml.p3dn.24xlarge`, `ml.p4d.24xlarge`, `ml.p4de.24xlarge`, `ml.p5.48xlarge`, `ml.p5e.48xlarge`, `ml.p5en.48xlarge`, `ml.p6e-gb200.36xlarge`, `ml.p6-b300.48xlarge`, `ml.trn1.2xlarge`, `ml.trn1.32xlarge`, `ml.trn1n.32xlarge`, `ml.trn2.48xlarge`, `ml.trn2u.48xlarge`

Node labels applied automatically **[T1]**:
- `topology.kubernetes.io/region`
- `topology.kubernetes.io/zone`
- `topology.k8s.aws/network-node-layer-1`, `-2`, `-3` (doc text says "up to four network node layers" but enumerates only three)
- `topology.k8s.aws/ultraserver-id` — "An identifier used to label each of the instances belonging to the same NVLink domain in an UltraServer."

Kueue annotations **[T1]**:
- `kueue.x-k8s.io/podset-required-topology` — hard constraint; all pods must land on the same network node layer or the job stays suspended in the waitlist
- `kueue.x-k8s.io/podset-preferred-topology` — soft; "HyperPod task governance will try to schedule the pods within one layer before trying the next topology layer"
- **Mutually exclusive with `nodeSelector`**: "You can use either an annotation or nodeSelector, but not both at the same time."

Working example **[T1]/[T2]**:

```yaml
annotations:
  kueue.x-k8s.io/podset-required-topology: "topology.k8s.aws/network-node-layer-3"
```

HyperPod CLI **[T1]**:
```bash
hyp create hyp-pytorch-job --version 1.1 --job-name sample-pytorch-job \
  --namespace hyperpod-ns-team-name --queue-name hyperpod-ns-team-name-localqueue \
  --preferred-topology-label topology.k8s.aws/network-node-layer-1
```

PyTorchJob guidance, verbatim **[T1]**: "PyTorchJob always has one master node, so we recommend that you use topology to support worker pods instead."

Console/Studio: topology columns are **hidden by default** — enable **Requested topology** and **Topology constraint** columns manually **[T1]**.

**[T2]** Companion blog (published 2025-09-15): https://aws.amazon.com/blogs/machine-learning/schedule-topology-aware-workloads-using-amazon-sagemaker-hyperpod-task-governance/

```bash
kubectl get nodes -L topology.k8s.aws/network-node-layer-1
kubectl get nodes -L topology.k8s.aws/network-node-layer-2
kubectl get nodes -L topology.k8s.aws/network-node-layer-3
```

and a visualization script:
```bash
git clone https://github.com/aws-samples/awsome-distributed-training.git
cd awsome-distributed-training/1.architectures/7.sagemaker-hyperpod-eks/task-governance
bash visualize_topology.sh   # emits Mermaid flowchart
```

**No quantified performance numbers are published in that blog** — it claims "reduced latency" and "improved training efficiency" without benchmark figures. Write **UNKNOWN** for any speedup number; do not invent one.

### 8.3 EKS (non-HyperPod) topology labels

**[T2]** https://aws.amazon.com/blogs/containers/unlocking-next-generation-ai-performance-with-dynamic-resource-allocation-on-amazon-eks-and-amazon-ec2-p6e-gb200/ — accessed 2026-08-01. Verbatim:

> "As a node joins an EKS cluster, the cluster control plane pulls topology information associated with the instance through EC2 topology API and applies labels to the Kubernetes node resources as they join the cluster. Each `P6e-GB200` node in an EKS cluster is automatically labeled with its capacity block type (`eks.amazonaws.com/capacityType=CAPACITY_BLOCK` and `eks.amazonaws.com/nodegroup=cbr-1234xyz`) and detailed network topology labels (`topology.k8s.aws/network-node-layer-1` through network-node-layer-4)."

Also: with GPU Feature Discovery in the NVIDIA GPU Operator, nodes get `nvidia.com/gpu.clique` (e.g. `cluster-abc.0`) identifying the NVLink domain / clique. In NVL72, "up to 72 GPUs can be connected in a single memory-coherent NVLink domain."

**[T1]** `aws/aws-ofi-nccl` `doc/topology-aware.md` also asserts native EKS labeling and publishes a full label set including one **not** documented in the HyperPod page:

```json
"Topology": {
    "topology.k8s.aws/network-node-layer-1": "nn-1111111111example",
    "topology.k8s.aws/network-node-layer-2": "nn-2222222222example",
    "topology.k8s.aws/network-node-layer-3": "nn-3333333333example",
    "topology.k8s.aws/zone-id": "usw2-az2",
    "topology.kubernetes.io/region": "us-west-2",
    "topology.kubernetes.io/zone": "us-west-2a"
}
```

Note `topology.k8s.aws/zone-id` — the AZ **ID** (`usw2-az2`), which is the account-independent AZ identifier and therefore the right key for cross-account AZ correlation (unlike the network node hashes).

**Scope caveat / CONTRADICTION to flag:** the **[T2]** Containers blog scopes automatic EKS labeling to **P6e-GB200 nodes** specifically. **[T1]** `aws-ofi-nccl` doc states it generally: "Amazon EKS also supports topology-aware scheduling through its native integration with EC2 instance topology. When worker nodes are launched in an EKS cluster, Amazon EKS automatically discovers and exposes their network topology information as node labels." I could **not** locate a general EKS User Guide page enumerating `topology.k8s.aws/network-node-layer-*` as a standard managed-node-group label for all supported instance types. **Report this as unresolved, and present the DIY DaemonSet pattern (below) as the portable fallback.**

DIY fallback pattern **[T2]** — `aws-samples/sample-rlinf-on-eks` `infrastructure/manifests/topology-labeler.yaml`: a `kube-system` DaemonSet that, per node, reads IMDSv2 for instance ID + region, calls `aws ec2 describe-instance-topology --instance-ids $INSTANCE_ID`, and applies one label per returned layer. Critically it does this **dynamically**:

```bash
NODE_COUNT=$(echo "$NETWORK_NODES" | jq 'length')
for i in $(seq 0 $((NODE_COUNT - 1))); do
  LAYER=$((i + 1))
  NODE_ID=$(echo "$NETWORK_NODES" | jq -r ".[$i]")
  LABEL_ARGS="$LABEL_ARGS topology.k8s.aws/network-node-layer-${LAYER}=${NODE_ID}"
done
kubectl label node "$NODE_NAME" $LABEL_ARGS --overwrite
```

It also handles the empty case explicitly ("Instance type may not support DescribeInstanceTopology"). Good model to reproduce — it is depth-agnostic, unlike `hostfile-topologify.py`.

### 8.4 Karpenter — the negative result

**[T1]** HyperPod task governance doc, verbatim, under "Topology-aware scheduling with Karpenter":

> "Topology-aware scheduling (TAS) is **not supported** with Karpenter autoscaling. TAS is enabled by default in HyperPod task governance. If you plan to use Karpenter for node provisioning, disable TAS by following these steps:"

```bash
kubectl edit configmap kueue-manager-config -n kueue-system
# change TopologyAwareScheduling: true  ->  false
kubectl rollout restart deployment kueue-controller-manager -n kueue-system
# ~20s restart; Kueue re-evaluates stuck workloads automatically, no need to resubmit
```

Corroborating evidence **[T1]**: a GitHub code search for `network-node-layer` across `org:aws` returns **4** hits — `aws/aws-ofi-nccl` and three `aws/sagemaker-hyperpod-cli` files. A search scoped to `repo:aws/karpenter-provider-aws` returns **0**. Karpenter does not emit these labels.

**[T1]** The EKS ML node-pool doc (https://docs.aws.amazon.com/eks/latest/userguide/ml-node-pools.html) enumerates AI/ML well-known labels for EKS Auto Mode (`eks.amazonaws.com/*`) and self-managed Karpenter (`karpenter.k8s.aws/*`) — instance-family, category, generation, gpu-name, gpu-manufacturer, gpu-count, gpu-memory, `karpenter.sh/capacity-type`, `topology.kubernetes.io/zone`. **No network-node-layer label appears in either table.**

> **Action item for the deep dive:** `DecisionGuide.tsx:181` currently heads a container "EFA + Karpenter: Topology-Aware Scheduling". That title overclaims. Karpenter can enforce **zonal** and **placement-group** constraints; it cannot do **network-node-layer** topology-aware scheduling, and enabling Karpenter requires *disabling* Kueue TAS on HyperPod. Rename to something like "EFA + Karpenter: Zonal & Placement-Group Constraints" and add the TAS caveat.

### 8.5 AWS PCS and ParallelCluster

- **[T1]** AWS PCS auto-configures the Slurm topology plugin from the Capacity Block for UltraServer node groups; continuously reconciles `topology.yaml`.
- **[T2]** AWS ParallelCluster has **no built-in** Topology API integration; the recommended path is the `aws-samples/ec2-topology-aware-for-slurm` script, run manually on the HeadNode, recommended only "for static compute cluster."

> This is a genuinely useful decision axis for the deep dive: **PCS/HyperPod give you topology for free and keep it fresh; ParallelCluster makes you build it and it goes stale.**

---

## 9. 2025–2026 changes (delta since the deep dive's 2026-03-22 sources)

| Date | Change | Tier / URL |
|---|---|---|
| 2023-11-14 | Instance Topology API launch. Types: HPC6id, HPC6a, HPC7a, HPC7g, P3dn, P4d, P4de, P5, TRN1, TRN1n. 9 Regions. | **[T2]** https://aws.amazon.com/about-aws/whats-new/2023/11/instance-topology-api-ml-hpc-workloads/ |
| 2025-09-15 | HyperPod task-governance topology-aware scheduling blog (Kueue annotations, `visualize_topology.sh`) | **[T2]** aws.amazon.com/blogs/machine-learning/schedule-topology-aware-workloads-using-amazon-sagemaker-hyperpod-task-governance/ |
| **2025-10-30** | **`DescribeCapacityReservationTopology` GA** — pre-launch topology, 26 Regions, node-set prefix consistency with the instance API | **[T2]** https://aws.amazon.com/about-aws/whats-new/2025/10/capacity-reservation-topology-api-ai-ml-hpc-instance-type/ |
| current (2026-08-01) | **4-layer hierarchy** now exists: `p6-b200.48xlarge`, `p6-b300.48xlarge` return 4 network nodes | **[T1]** ec2-instance-topology-prerequisites.html |
| current | Instance-type list expanded to include **G6e, G7e, hpc8a.96xlarge, p5e, p5en, p6e-gb200, trn2, trn2u** | **[T1]** same |
| current | Region list expanded from 9 → ~28, incl. **AWS European Sovereign Cloud (Germany)** and AWS GovCloud (US-West) | **[T1]** same |
| current | Slurm **25.11+ `topology.yaml`** with per-partition topology, `topology/flat` default for heterogeneous clusters, `--segment` / `--exclusive=topo` | **[T1]** sagemaker-hyperpod-topology.html |
| current | `capacityBlockId` semantics narrowed/clarified to **UltraServer instances only** | **[T1]** API_InstanceTopology.html |
| current | Eventual-consistency note added: `capacityBlockId` may be `null` immediately post-launch | **[T1]** API_DescribeInstanceTopology.html |

**Not found / UNKNOWN:**
- Any published latency or throughput delta from topology-aware ranking (no AWS benchmark numbers located).
- Any published default throttle rate for either topology API.
- Any documented mapping of layer index → named datacenter construct (spine/aggregation/leaf).
- Any general (non-HyperPod, non-P6e-GB200) EKS User Guide page documenting `topology.k8s.aws/network-node-layer-*` as a standard label.
- Console support for viewing topology — explicitly **absent** per **[T1]**.

---

## 10. Proposed section outline

Working title: **"Topology-Aware Placement: The EC2 Instance Topology API"** — new tab or major container set, sibling to `Architecture.tsx`, cross-linked from `DecisionGuide.tsx`.

Per the repo's tab quality bar (h2-rooted, bold framing → diagram → ColumnLayout → ExpandableSection):

1. **Why topology exists at all** *(h2, bold framing paragraph)*
   - Framing: EFA gives you a fast wire; topology tells you how long the wire is. Collectives run at the speed of the slowest pair.
   - The thesis quote **[T1]**: "you can't use it to launch a new instance physically close to an existing instance."
   - Descriptive plane (Topology API) vs control plane (placement groups / CRs).
   - Getting-started on-ramp for a reader new to this: one `aws ec2 describe-instance-topology` call and how to read the output.

2. **The network-node hierarchy** *(h2 + Diagram 1)*
   - 3 vs 4 layers; which types give which.
   - AWS's NN1–NN7 worked example, re-drawn.
   - The shared-prefix distance rule, stated as a formula.
   - `nodes[-1]` not `nodes[2]` — the index-from-the-end rule.
   - **ExpandableSection:** "What the layers physically are" — honestly labelled **[SPECULATIVE]**; AWS does not publish spine/agg/leaf naming.

3. **API reference in practice** *(h2 + ColumnLayout)*
   - Request params table (limits: 100 IDs, 100 group names, MaxResults 20/100).
   - `InstanceTopology` field table with the per-account-hash caveat called out as an Alert.
   - Real CLI invocations + real JSON.
   - **ExpandableSection:** "Gotchas" — `"null"` as a string; all fields optional; eventual consistency on `capacityBlockId`; unfiltered-request throttle bucket; Console does not show topology.

4. **`DescribeCapacityReservationTopology`: seeing capacity before you buy it** *(h2 + Diagram 2)*
   - GA 2025-10-30; the pre-launch vs post-launch table.
   - The prefix-consistency guarantee and why it's the important bit.
   - Different limits (10 IDs, MaxResults 10), missing `zone-id` filter, `availabilityZoneId` vs `zoneId` naming wart.
   - Not available in Israel (Tel Aviv) or GovCloud (US-West).

5. **Turning topology into rank order** *(h2 + Diagram 3)*
   - The two-level bucket sort, with the actual `hostfile-topologify.py` code.
   - The full Slurm → hostfile → `--map-by seq` pipeline.
   - **Alert (warning):** `--mca rmaps seq` / `--map-by seq` is mandatory; sorting alone does nothing.
   - **ExpandableSection:** the hard-coded `NetworkNodes[1]/[2]` issue on 4-layer instance types, with the correct generic form.

6. **Slurm: `topology.conf`, `topology/tree`, `topology/block`** *(h2 + ColumnLayout)*
   - `SwitchName=nn-… Switches=…` / `Nodes=…` — the network-node hash used verbatim as the Slurm switch name.
   - `ec2-topology-aware-for-slurm` workflow + the "static clusters only" caveat.
   - `TopologyPlugin=topology/tree` + `TopologyParam=RouteTree`; `sbatch --switch=1`.
   - `topology/block` for UltraServers: block rules, `BlockSizes=18`, `--segment`, `--exclusive=topo`.
   - Slurm 25.11 `topology.yaml` and per-partition topology; `topology/flat` for heterogeneous clusters.

7. **Kubernetes: labels, Kueue, and the Karpenter gap** *(h2)*
   - `topology.k8s.aws/network-node-layer-1..4`, `topology.k8s.aws/zone-id`, `topology.k8s.aws/ultraserver-id`, `nvidia.com/gpu.clique`.
   - Kueue `podset-required-topology` vs `podset-preferred-topology`; mutually exclusive with `nodeSelector`; jobs suspend into the waitlist when required constraints can't be met.
   - **Alert (info):** TAS is not supported with Karpenter; how to disable it if you use Karpenter.
   - The DIY DaemonSet fallback (depth-agnostic labeler).

8. **Topology vs placement groups vs Capacity Blocks vs ODCRs** *(h2 + decision table)*
   - Cluster / Spread / Partition — only Cluster and Precision Time support CRs.
   - The five "when Topology API adds value beyond a CPG" arguments from §7.3.
   - The ICE / spine-mismatch diagnosis story.
   - Where `groupName` and `capacityBlockId` fit as join keys.

9. **Managed integrations: HyperPod, PCS, ParallelCluster, EKS** *(h2 + comparison table)*
   - Free-and-fresh (HyperPod, PCS) vs build-it-yourself-and-it-goes-stale (ParallelCluster).
   - Dynamic reconciliation on scale/replace; the manual-override-gets-overwritten warning.

10. **What we don't know** *(h2)*
    - No published speedup numbers. No layer→construct naming. No published throttle defaults. No Console support. Per-account hashing blocks cross-account correlation.
    - Explicitly UNKNOWN-labelled, per the deep dive's sourcing discipline.

**Cross-links to existing content (do not duplicate):**
- `AIMLTraining.tsx:216-223` — NCCL topology XML (intra-node). Link from §5's disambiguation.
- `DecisionGuide.tsx:168-178` — the three-independent-layers paragraph. This becomes the *summary*; the new section is the depth.
- `Architecture.tsx:176-180` — "NCCL does not call the EC2 topology API." Verified; keep and link.

**Edits required to existing files:**
- `Sources.tsx` — add ~10 new entries (see §11) and refresh source #29's `accessDate` to `2026-08-01`.
- `DecisionGuide.tsx:181` — rename the Karpenter container heading; add the TAS-not-supported caveat.
- `DecisionGuide.tsx:172` — "3-4 layers" is correct; add the cross-account-hash consequence.
- `docs/adr/ADR-003-iteration-flywheel.md:80` — mark the backlogged "topology-aware rank assignment" item as delivered.

---

## 11. Diagram ideas

### Diagram 1 — "The network node tree, and what 'close' means"

**What it shows:** AWS's own NN1–NN7 hierarchy, re-drawn in the site's visual language, with four instances hanging off leaf nodes and a **distance annotation between every pair**.

- Three layers (i/ii/iii) with a dashed fourth layer shown greyed and labelled "p6-b200 / p6-b300 only".
- Instances 1 & 2 both under NN4; instance 3 under NN5; instance 4 under NN6 (which hangs off NN3, not NN2).
- Each instance shows its literal `NetworkNodes` array beside it.
- Overlaid distance badges: 1↔2 = **0 hops (same leaf)**, 1↔3 = **shares layer ii**, 1↔4 = **shares layer i only**.
- NN7 drawn in dashed grey with the caption "no running instances → omitted from API output" — this teaches that the API returns a *projection*, not the physical tree.

**Why it earns its place:** it is the single concept everything else depends on, and the "shared-prefix depth = closeness" rule is much easier to see than to read.

### Diagram 2 — "Pre-launch vs post-launch: the prefix guarantee"

**What it shows:** two side-by-side columns for the same physical capacity.

- **Left — `DescribeCapacityReservationTopology` (pending/active, no instances yet):** two CR boxes, `cr-1111…` with `[nn-1111, nn-2222]` and `cr-2222…` with `[nn-1111, nn-3333]`. A red divergence marker at layer ii with the AWS caption: "communication between these two CRs will be inefficient."
- **Right — `DescribeInstanceTopology` (after launch):** the same reservations, now with instances, showing `[nn-1111, nn-2222, nn-4444]` — the CR node set highlighted as a **prefix** (solid) and the newly-revealed leaf appended (glow/accent).
- A connecting arrow labelled "same nodes, more granularity" and the API limits printed under each column (10 IDs / MaxResults 10 vs 100 IDs / MaxResults 100).

**Why it earns its place:** this is the newest material (GA 2025-10-30), it is entirely absent from the current site, and the prefix relationship is the non-obvious thing that makes pre-launch planning trustworthy.

### Diagram 3 — "One topology, four consumers"

**What it shows:** a single `DescribeInstanceTopology` response at the top fanning out into the four real consumption paths, each terminating in the actual artifact.

1. **MPI / Open MPI** → `hostfile-topologify.py` → sorted hostfile → `mpirun --map-by seq`. Annotate the sequential mapper as the mandatory step.
2. **Slurm** → `ec2-topology.py` → `topology.conf` (`SwitchName=nn-… Nodes=…`) → `TopologyPlugin=topology/tree` → `sbatch --switch=1`. Show the network-node hash flowing through unchanged into `SwitchName` — the literal bridge.
3. **Slurm / UltraServer** → `topology.yaml` block section → `BlockSizes=18` → `sbatch -N18 --exclusive=topo`.
4. **Kubernetes** → node labels `topology.k8s.aws/network-node-layer-1..4` → Kueue `podset-required-topology` → pod placement.

Plus a **greyed-out fifth branch** for NCCL with a red ✗ and the caption "NCCL never calls this API — intra-node graph only (`NCCL_TOPO_FILE`)", and a **greyed-out Karpenter branch** with "TAS not supported".

**Why it earns its place:** the negative branches are as instructive as the positive ones, it reinforces the existing (correct) claim at `Architecture.tsx:176`, and it gives the reader a single map from API response → the exact config file they need to write.

### Diagram 4 (bonus) — "Placement groups control, topology observes"

**What it shows:** a two-lane swimlane. Top lane (control plane, blue): `CreatePlacementGroup(cluster)` → `CreateCapacityReservation(in CPG)` → `RunInstances`. Bottom lane (observability plane, green): `DescribeCapacityReservationTopology` (hooks in after CR creation, before launch) → `DescribeInstanceTopology` (hooks in after RunInstances) → rank file / `topology.conf` / node labels. A vertical dashed barrier between the lanes labelled with the AWS quote: **"you can't use it to launch a new instance physically close to an existing instance."** Under the CPG box, a small warning: "Spread and Partition placement groups do not support Capacity Reservations."

**Why it earns its place:** it settles the most common misconception (that the Topology API can place instances) with a structural argument rather than a sentence.

---

## 12. Sources, grouped by tier

### Tier 1 — Official AWS documentation & first-party source code

All accessed **2026-08-01**.

1. `DescribeInstanceTopology` API reference — https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeInstanceTopology.html
2. `InstanceTopology` data type — https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_InstanceTopology.html
3. `DescribeCapacityReservationTopology` API reference — https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeCapacityReservationTopology.html
4. `CapacityReservationTopology` data type — https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_CapacityReservationTopology.html
5. Amazon EC2 topology (overview) — https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-topology.html
6. How Amazon EC2 topology works — https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/how-ec2-instance-topology-works.html
7. Prerequisites for Amazon EC2 topology — https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-topology-prerequisites.html
8. Examples for Amazon EC2 instance topology — https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-topology-examples.html
9. Use Capacity Reservations with placement groups — https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/cr-cpg.html
10. Request throttling for the Amazon EC2 API — https://docs.aws.amazon.com/ec2/latest/devguide/ec2-api-throttling.html
11. Eventual consistency in the Amazon EC2 API — https://docs.aws.amazon.com/ec2/latest/devguide/eventual-consistency.html
12. Using topology-aware scheduling in Amazon SageMaker HyperPod — https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-topology.html
13. Using topology-aware scheduling in HyperPod task governance — https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-eks-operate-console-ui-governance-tasks-scheduling.html
14. AWS PCS — Configure UltraServer instances — https://docs.aws.amazon.com/pcs/latest/userguide/capacity-blocks-nvidia-imex.html
15. EKS — Manage compute for AI/ML workloads with EKS Auto Mode and Karpenter (well-known label tables) — https://docs.aws.amazon.com/eks/latest/userguide/ml-node-pools.html
16. ParallelCluster — Placement groups and instance launch issues — https://docs.aws.amazon.com/parallelcluster/latest/ug/troubleshooting-v3-placemment-groups.html
17. ParallelCluster — ODCR / zonal RI troubleshooting (spine mismatch → ICE) — https://docs.aws.amazon.com/parallelcluster/latest/ug/compute-node-initialization-odcr-v3.html
18. `aws/aws-ofi-nccl` — `doc/topology-aware.md` — https://github.com/aws/aws-ofi-nccl/blob/master/doc/topology-aware.md
19. `aws/aws-ofi-nccl` — `contrib/scripts/topology_aware/README.md` — https://github.com/aws/aws-ofi-nccl/blob/master/contrib/scripts/topology_aware/README.md
20. `aws/aws-ofi-nccl` — `contrib/scripts/topology_aware/hostfile-topologify.py` (Copyright 2025 Amazon.com) — https://github.com/aws/aws-ofi-nccl/blob/master/contrib/scripts/topology_aware/hostfile-topologify.py

### Tier 2 — AWS blogs, what's-new announcements, aws-samples

All accessed **2026-08-01**.

21. Introducing the Capacity Reservation Topology API for AI, ML, and HPC instance types — posted **2025-10-30** — https://aws.amazon.com/about-aws/whats-new/2025/10/capacity-reservation-topology-api-ai-ml-hpc-instance-type/
22. Instance Topology API for ML and HPC workloads — posted **2023-11-14** — https://aws.amazon.com/about-aws/whats-new/2023/11/instance-topology-api-ml-hpc-workloads/
23. Schedule topology-aware workloads using Amazon SageMaker HyperPod task governance — published **2025-09-15** — https://aws.amazon.com/blogs/machine-learning/schedule-topology-aware-workloads-using-amazon-sagemaker-hyperpod-task-governance/
24. Unlocking next-generation AI performance with DRA on Amazon EKS and Amazon EC2 P6e-GB200 — https://aws.amazon.com/blogs/containers/unlocking-next-generation-ai-performance-with-dynamic-resource-allocation-on-amazon-eks-and-amazon-ec2-p6e-gb200/
25. `aws-samples/ec2-topology-aware-for-slurm` (MIT-0; last pushed 2025-05-30) — https://github.com/aws-samples/ec2-topology-aware-for-slurm
26. `aws-samples/awsome-distributed-training` — `1.architectures/7.sagemaker-hyperpod-eks/task-governance/visualize_topology.sh` — https://github.com/aws-samples/awsome-distributed-training
27. `aws-samples/sample-rlinf-on-eks` — `infrastructure/manifests/topology-labeler.yaml` — https://github.com/aws-samples/sample-rlinf-on-eks
28. Amazon EC2 P6-B300 instances GA (Blackwell Ultra, 6.4 Tbps EFA) — posted 2025-11 — https://aws.amazon.com/about-aws/whats-new/2025/11/amazon-ec2-p6-b300-instances-nvidia-blackwell-ultra-gpus-available/
29. Announcing Capacity Blocks support for AWS Parallel Computing Service — https://aws.amazon.com/blogs/hpc/announcing-capacity-blocks-support-for-aws-parallel-computing-service/

### Tier 3 — Third-party

None used. No third-party source was required for any claim in this report.

### Explicitly SPECULATIVE / UNKNOWN

- Mapping of network-node layer index → named datacenter construct (spine / aggregation / leaf / ToR): **not published**.
- Real-world performance impact of the `NetworkNodes[1]/[2]` hard-coding in `hostfile-topologify.py` on 4-layer instance types: **not measured, not published**.
- Default throttle rates for either topology API: **UNKNOWN** (mechanism documented, values are per-account in Service Quotas).
- Quantified speedup from topology-aware ranking: **UNKNOWN** — no AWS benchmark located.
- Whether EKS applies `topology.k8s.aws/network-node-layer-*` labels to **all** supported instance types or only P6e-GB200/HyperPod: **UNRESOLVED** — tier-1 aws-ofi-nccl doc says generally, tier-2 Containers blog scopes it to P6e-GB200, and no general EKS User Guide page was located.
- Frequency with which cluster-placement-group members diverge at the bottom network-node layer: **UNKNOWN**.
