import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { HbfStackDiagram } from '../components/HbfStackDiagram';
import { HbfSweepsChart } from '../components/HbfSweepsChart';
import { HbfPlacementMap } from '../components/HbfPlacementMap';
import { HbfPackageDiagram } from '../components/HbfPackageDiagram';
import { Cite } from '../components/Cite';
import { S } from '../sources/HighBandwidthFlash';

const disturbNote =
  'Gen 1 read flat out: 1.6 TB/s over 512 GB is 3.125 sweeps a second; at 1,024 pages per block each block collects 3,200 page reads a second. Refresh interval = threshold / 3,200 s (31 s at 10^5, 312 s at 10^6, which takes 16.4 or 1.6 GB/s of writes across the stack); life = rated P/E cycles x refresh interval.';

export function HighBandwidthFlash() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="What a terabyte of flash on the accelerator package can hold, what it cannot, and the three numbers to get from a vendor before planning for it"
          >
            High Bandwidth Flash
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>What HBF is.</strong> High Bandwidth Flash (HBF) is a stack of NAND (NOT-AND)
            flash dies on a controller base die, placed on the accelerator package beside HBM (High
            Bandwidth Memory). One 16-high stack holds 512 GiB and reads at up to about 3 TB/s.
            <Cite s={S.ocpSpec} /> Sandisk and SK hynix, who wrote its specification under the
            Open Compute Project (OCP), describe it as HBM&apos;s read bandwidth with 8 to 16
            times the capacity, and Sandisk puts the cost as similar.
            <Cite s={S.ocpSpec} kind="vendor-claim" note="Specification introduction: '8x to 16x of the capacity of HBM, while delivering the same read bandwidth'." />
            <Cite s={S.sandiskSkHynixMou} kind="vendor-claim" note="'up to 8-16x the capacity of HBM at a similar cost'. No price is published, and no vendor statement located during this research names the HBM stack the ratio is measured against: 512 GB is 8x a 64 GB stack and 16x a 32 GB stack." />
          </Box>
          <Box variant="p">
            <strong>Why it matters for inference.</strong> DeepSeek-V3 at FP8 (8-bit floating
            point) is 671 GB of weights, which takes the HBM of at least three Rubin GPUs at 288 GB
            each.
            <Cite s={S.deepseekV3Report} kind="derived" note="671B parameters x 1 byte at FP8 = 671 GB; 671 / 288 = 2.3, so three GPUs." />
            <Cite s={S.hgxPage} /> HBF would put terabytes on the package. What it gives up is
            bandwidth per byte stored: a first-generation HBF stack can be read end to end about 3
            times a second, a shipping HBM4 stack about 80 times.
            <Cite s={S.sandiskFactSheet} kind="derived" note="Sandisk's vendor claim for its first-generation stack: 1.6 TB/s / 512 GB = 3.1 per second." />
            <Cite s={S.micronHbm4} kind="derived" note="Micron: greater than 2.8 TB/s from a 36 GB 12-high stack = more than 78 per second." />
            <Cite s={S.samsungHbm4} kind="derived" note="Samsung: up to 3.3 TB/s per stack, over 36 GB = 92 per second." />{' '}
            That ratio decides what HBF can hold. HBF is a roadmap technology: a published
            interface specification and one taped-out memory die, with no product on sale as of
            October 2026.
            <Cite s={S.sandiskInvestorDay2026} kind="roadmap" note="Sandisk: first HBF memory die taped out; samples of inference devices with HBF targeted for 2027." />
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Where 512 GiB and about 3 TB/s per stack come from, and which jobs of an SSD controller move into your serving software"
          >
            A NAND stack wired like HBM
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            HBF keeps HBM&apos;s construction and changes the memory and the link. Sixteen NAND
            dies stack on a logic base die, joined by through-silicon vias (TSVs), on the same
            class of advanced package as HBM. The base die reaches the accelerator over 16 UCIe
            (Universal Chiplet Interconnect Express) channels carrying AXI (Advanced eXtensible
            Interface) transactions, where HBM uses the JEDEC (Joint Electron Device Engineering
            Council) HBM interface.
            <Cite s={S.ocpSpec} /> An accelerator therefore needs UCIe ports at every HBF site:
            adopting HBF takes new accelerator silicon.
            <Cite s={S.ocpSpec} kind="derived" note="Follows from the specified interface: 16 UCIe-A x64 channels per stack, with no JEDEC HBM interface." />
          </Box>
          <Box variant="p">
            <strong>What moves into software.</strong> The base die is a flash controller: ECC
            (error-correcting code), NAND command scheduling, bad-block and TSV repair, a page-read
            counter per block, and an optional SRAM (static RAM) scratchpad. The rest of an SSD
            (solid-state drive) controller&apos;s work moves to the host. HBF runs no garbage
            collection, the host writes each NAND block in consecutive 4 KiB pages, and wear
            levelling is done by the base die or by the host. Reads can be as small as 64 B;
            writes are 4 KiB. HBF and HBM are separate, non-coherent memories with their own
            address spaces, so the serving engine decides what lives where.
            <Cite s={S.ocpSpec} />
          </Box>
          <HbfStackDiagram />
          <Box variant="small" color="text-body-secondary">
            Every figure and duty in the diagram is from the specification <Cite s={S.ocpSpec} />.
          </Box>
          <ExpandableSection headerText="Interface details from the OCP specification, version 0.7.0">
            <Box variant="p">
              Each channel is a UCIe-A module with a 64-bit main band and a 1-bit sideband, with
              45 µm bumps and a reach under 2 mm. Grade 1 runs 8 channels at 8 GT/s on an 8-high
              stack for 0.384 TB/s; grade 2 runs 16 at 16 GT/s on a 16-high stack for 1.536 TB/s;
              grade 3 runs 16 at 32 GT/s for 3.072 TB/s. The footprint is about 10.975 x 16 mm and
              775 µm tall, preliminary until version 1.0.
              <Cite s={S.ocpSpec} />
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="One division, bandwidth over capacity, puts an HBF stack near 3 reads of the whole device per second and an HBM4 stack near 80, and predicts which data fits"
          >
            Sweeps per second decides what belongs on it
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Divide a device&apos;s bandwidth by its capacity to get sweeps per second: how many
            times a second the whole device can be read end to end. A Sandisk Gen 1 HBF stack, 1.6
            TB/s over 512 GB, sweeps 3.1 times a second.
            <Cite s={S.sandiskFactSheet} kind="derived" note="Sandisk's first-generation figures: 1.6 TB/s read, 512 GB per stack." />{' '}
            A shipping HBM4 stack, 2.8 to 3.3 TB/s over 36 GB, sweeps 78 to 92 times.
            <Cite s={S.samsungHbm4} kind="derived" note="Up to 3.3 TB/s per stack." />
            <Cite s={S.micronHbm4} kind="derived" note="Above 2.8 TB/s; HBM4 36 GB 12-high." />{' '}
            Per stack, HBF delivers half to all of HBM4&apos;s bandwidth, with 14 times as much
            data behind it.
          </Box>
          <HbfSweepsChart />
          <Box variant="small" color="text-body-secondary">
            Each bar is our division of the cited figures. HBF grades, grade 1&apos;s 256 GiB
            taken as half the 16-high stack
            <Cite s={S.ocpSpec} kind="derived" />; Sandisk Gen 1
            <Cite s={S.sandiskFactSheet} kind="vendor-claim" />; HBM4 at the JEDEC bin, 2,048 bits
            at 8 Gb/s
            <Cite s={S.jedecHbm4} />, over 36 GB
            <Cite s={S.micronHbm4} />; shipping HBM4
            <Cite s={S.samsungHbm4} kind="vendor-claim" />
            <Cite s={S.micronHbm4} kind="vendor-claim" />
            <Cite s={S.skhynixHbm4} kind="vendor-claim" />; HBM4E samples, 16 Gb/s per pin and 48
            GB
            <Cite s={S.skhynixHbm4e} kind="roadmap" />; Vera&apos;s LPDDR5X (Low-Power Double Data
            Rate 5X)
            <Cite s={S.graceCpuPage} kind="vendor-claim" />. No HBF product ships.
          </Box>
          <Box variant="p">
            <strong>What it predicts.</strong> A decode step cannot finish faster than the bytes it
            reads divided by the bandwidth serving them. A dense 405B-parameter model at FP8 is
            405 GB; eight Gen 1 stacks (12.8 TB/s) read it in 31.6 ms, a ceiling of about 32
            tokens a second per sequence.
            <Cite s={S.sandiskFactSheet} kind="derived" note="405 GB / (8 x 1.6 TB/s). Weights only: ignores KV cache reads, attention and prefetch waste." />{' '}
            DeepSeek-V3, a mixture-of-experts (MoE) model, activates 37B of its 671B parameters per
            token
            <Cite s={S.deepseekV3Report} />, so the same stacks read one token&apos;s weights in
            2.9 ms, against 1.7 ms from a Rubin GPU&apos;s 22 TB/s of HBM4.
            <Cite s={S.hgxPage} kind="derived" note="37 GB / 12.8 TB/s and 37 GB / 22 TB/s, weights only. 22 TB/s is the HGX page's individual Rubin GPU figure." />{' '}
            Data that is large and partly read per step suits HBF; data read in full every step
            runs at the sweep rate.
          </Box>
          <Box variant="p">
            <strong>Batching helps HBF less.</strong> One weight sweep serves the whole batch, but
            each sequence reads its own KV (key-value) cache every step, and the set of experts a
            batch touches grows with the batch. OXMIQ Labs&apos; system model, presented at Hot
            Chips 2026 and reported by trade press, found HBF cheaper at low batch but with 85%
            &quot;dead capacity&quot;, and HBM cheaper per token once concurrency rose.
            <Cite s={S.tomsOxmiq} kind="simulated" />
            <Cite s={S.sthOxmiq} kind="simulated" />
          </Box>
          <Box variant="p">
            <strong>Latency sets the prefetch depth.</strong> No HBF read latency is published;
            Sandisk says only that it is higher than HBM&apos;s.
            <Cite s={S.sandiskFactSheet} kind="vendor-claim" /> Studies assume 1 to 20 µs per page
            read
            <Cite s={S.flint} kind="simulated" note="Simulator input: 1 to 2 µs, SLC flash." />
            <Cite s={S.hbfSim} kind="simulated" note="Simulator input: about 20 µs per page read." />
            , against 10 to 100 ns for HBM in Google&apos;s ballpark table.
            <Cite s={S.maPatterson} kind="simulated" note="Table 3, which the authors label a ballpark comparison." />{' '}
            By Little&apos;s law, data in flight equals bandwidth times latency: a 1.6 TB/s stack
            needs 6.4 MB in flight at 4 µs and 32 MB at 20 µs.
            <Cite s={S.sandiskFactSheet} kind="derived" note="1.6 TB/s x 4 µs = 6.4 MB; 1.6 TB/s x 20 µs = 32 MB." />{' '}
            The runtime has to issue megabyte-scale reads across all 16 channels well ahead of use.
            <Cite s={S.ocpSpec} note="Full bandwidth needs '(4KiB * N) * all UCIe channels' moved at once; with 16 banks per channel that is 1 MiB (our arithmetic)." />
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="MoE expert pools, resident models and shared context go on HBF; per-token KV cache and activations stay in HBM or SRAM, and the performance evidence behind that split is all simulation"
          >
            What to put on it and what to keep in HBM
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Two questions place any object. How many times is it read for each write? That
            decides whether flash endurance can carry it. How much of what is stored does one
            decode step read? That decides whether the sweep rate caps its speed.
          </Box>
          <HbfPlacementMap />
          <Box variant="small" color="text-body-secondary">
            Positions are qualitative, from the specification&apos;s usage examples
            <Cite s={S.ocpSpec} />, Google&apos;s placement rule
            <Cite s={S.maPatterson} /> and the placement map in the HBF Sucks? study
            <Cite s={S.hbfSucks} kind="simulated" />.
          </Box>
          <Box variant="p">
            <strong>Weights, MoE expert pools first.</strong> Weights are the specification&apos;s
            first usage example: written at load with every channel interleaved, read at every
            token.
            <Cite s={S.ocpSpec} /> An MoE model reads a small share per token, 5.5% for
            DeepSeek-V3, so the sweep rate binds less.
            <Cite s={S.deepseekV3Report} kind="derived" note="37B activated of 671B total." /> In a
            simulation of Qwen3-235B-A22B, using HBF capacity to raise resident experts per device
            from 8 to 32 cut average time per output token from 10.20 to 9.13 ms.
            <Cite s={S.potentialApps} kind="simulated" note="At 4 requests a second. The study assumes HBF does not reduce the bandwidth of the HBM-resident path." />{' '}
            The engineering work is prefetch: with a static, compiler-driven prefetcher, MoE models
            wasted 86% to 96% of HBF traffic in FLINT&apos;s simulation.
            <Cite s={S.flint} kind="simulated" /> See <em>Mixture of Experts and Sparse Activation</em>{' '}
            for how routing sets which experts a step reads.
          </Box>
          <Box variant="p">
            <strong>Resident models and shared context.</strong> With several models loaded,
            switching needs no load from storage.
            <Cite s={S.ocpSpec} /> In a simulation of 27 models of 1B to 40B parameters, four
            times the capacity cut mean time to first token from 196.1 ms to 6.8 ms.
            <Cite s={S.potentialApps} kind="simulated" /> Google researchers also put slow-changing
            context, such as a code or paper corpus, on HBF.
            <Cite s={S.maPatterson} />
          </Box>
          <Box variant="p">
            <strong>Per-token KV cache stays in HBM.</strong> The same Google paper calls HBF
            &quot;infeasible for KV Cache data updated for every query or generation token&quot;.
            <Cite s={S.maPatterson} /> A simulation of HBF as a drop-in replacement for an SSD
            KV-cache pool, in packages that gave up near-tier memory to fit it, found KV writes
            outnumbering reads on four production traces, average end-to-end latency 2 to 5.5
            times higher, and a TLC (triple-level cell) HBF tier wearing out at 0.56 times the SSD
            pool&apos;s life. The authors&apos; verdict: &quot;The device is fine; the drop-in
            deployment is not.&quot;
            <Cite s={S.hbfSucks} kind="simulated" /> FlashAccel argues KV can work on SLC
            (single-level cell) flash, where about 100,000 P/E (program/erase) cycles let a 1 TB
            device absorb about 55 TB of writes a day, and on compact KV: 70 KB per token for
            DeepSeek-V3&apos;s MLA (multi-head latent attention) against 502 KB for Llama 3.1
            405B&apos;s GQA (grouped-query attention).
            <Cite s={S.flashAccel} kind="simulated" note="Author assumption and calculation: 100,000 P/E cycles over 5 years is about 55 a day. KV bytes per token from the paper's Table II." />{' '}
            The inputs that settle it, HBF&apos;s cell type and rated P/E cycles, are unpublished.
          </Box>
          <Box variant="p">
            <strong>Conditional cases and activations.</strong> Sparse long-context attention can
            fit when it selects KV in flash-page-sized units: SPLASH, built that way, reports 3.5 to
            11.4 times its baselines&apos; decode throughput per GPU at 100 ms per token.
            <Cite s={S.splash} kind="simulated" /> Activations, rewritten every layer, belong in HBM
            or the base-die SRAM, and the specification suggests separate channel groups for
            weights and KV because mixing them in one zone may cost endurance and capacity.
            <Cite s={S.ocpSpec} /> <em>KV Cache and FlashAttention</em> covers KV sizing; KV reused
            across requests belongs on the off-package tier in{' '}
            <em>Flash as a Cache Tier for Inference</em>.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Why refresh turns reads into writes, so even frozen weights spend endurance, and why device life swings from weeks to decades on two unpublished numbers"
          >
            Reading wears flash too
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Plan HBF as a cache reloaded from storage.</strong> The specification
            guarantees 24 hours of retention at 85 C while powered, has the host refresh data
            typically every 24 to 48 hours, does not guarantee retention without power and recommends
            SSDs for persistent data.
            <Cite s={S.ocpSpec} /> Sandisk&apos;s 2025 fact sheet calls HBF non-volatile with no
            refresh power needed
            <Cite s={S.sandiskFactSheet} kind="vendor-claim" />; plan on the specification. Keep
            the storage load path and budget the time to refill every stack after a power loss,
            which depends on a sustained NAND write rate that neither the specification nor Sandisk
            nor SK hynix publishes.
          </Box>
          <Box variant="p">
            <strong>Refresh turns reads into writes.</strong> Retention refresh alone rewrites
            everything resident 0.5 to 1 times a day.
            <Cite s={S.ocpSpec} kind="derived" note="One full rewrite every 24 to 48 hours." /> Reads
            add more: the base die counts page reads per block, and after a product-specific count
            the host must rewrite the block to guard against read disturb.
            <Cite s={S.ocpSpec} /> For weights read every step, that count sets device life.
            FLINT&apos;s simulation, assuming SLC and 10<sup>6</sup> reads per block, has a block
            read every step lasting 29 days at 10<sup>5</sup> P/E cycles and 8 years at a projected
            10<sup>7</sup>; a naive burst refresh there stalled a channel for 26 s to 22 min.
            <Cite s={S.flint} kind="simulated" />
          </Box>
          <Box variant="p">
            <strong>How wide the range is.</strong> A Gen 1 stack read flat out, with FLINT&apos;s
            assumed 1,024 pages per block, gives each block 3,200 page reads a second. At a
            read-disturb threshold of 10<sup>5</sup> reads every block needs a rewrite every 31
            seconds, and at 10<sup>5</sup> P/E cycles the stack lasts 36 days; at 10<sup>6</sup>{' '}
            reads and 10<sup>7</sup> cycles it lasts 99 years.
            <Cite s={S.sandiskFactSheet} kind="derived" note={disturbNote} />
            <Cite s={S.flint} kind="simulated" note="Simulator inputs: block geometry, threshold range and P/E sweep." />{' '}
            Real workloads read less than flat out, so these are lower bounds for those inputs,
            and HBF&apos;s actual threshold and rating are unpublished.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Swapping one HBM4 stack for one HBF stack adds about 476 GB and gives up 1.2 to 1.7 TB/s at that site; the layouts on record show how vendors spend the trade"
          >
            Each HBF site trades HBM bandwidth for capacity
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            HBF stacks take the package sites HBM stacks would use; Sandisk designed its stack to
            HBM4&apos;s footprint, power profile and height.
            <Cite s={S.sandiskFactSheet} kind="vendor-claim" /> One Gen 1 HBF stack in place
            of a 36 GB HBM4 12-high stack adds 476 GB and gives up 1.2 to 1.7 TB/s at that site.
            <Cite s={S.sandiskFactSheet} kind="derived" note="512 - 36 = 476 GB; shipping HBM4 at 2.8 to 3.3 TB/s minus Gen 1's 1.6 TB/s." />
            <Cite s={S.micronHbm4} />
            <Cite s={S.samsungHbm4} /> Sandisk&apos;s HBF examples fill all or most sites with HBF
            <Cite s={S.sandiskInvestorDay2025} kind="vendor-claim" />; the specification&apos;s
            example keeps four HBM stacks beside two HBF stacks, managed as separate memories.
            <Cite s={S.ocpSpec} />
          </Box>
          <HbfPackageDiagram />
          <Box variant="small" color="text-body-secondary">
            Sandisk&apos;s layouts and capacities
            <Cite s={S.sandiskInvestorDay2025} kind="vendor-claim" note="The slides give totals only; 24 GB per HBM stack is our division, 192 GB / 8." />; the specification&apos;s
            layout, summed to 1,168 GiB
            <Cite s={S.ocpSpec} kind="derived" />; 12.8 TB/s is eight stacks at 1.6 TB/s
            <Cite s={S.sandiskFactSheet} kind="derived" />; Rubin
            <Cite s={S.hgxPage} />.
          </Box>
          <Box variant="p">
            <strong>Where it sits among the tiers.</strong> Per GPU, eight Gen 1 stacks give 12.8
            TB/s against a Rubin GPU&apos;s 22 TB/s: an all-HBF package trades about 40% of the
            bandwidth for 14 times the capacity.
            <Cite s={S.hgxPage} kind="derived" note="12.8 / 22 = 0.58; 4,096 / 288 = 14.2. 22 TB/s and 288 GB are the HGX page's individual Rubin GPU figures." /> HBF
            lands between HBM and host memory, but it attaches to the accelerator, so its
            competitor for any byte is the HBM beside it. One Gen 1 stack reads 1.33 times as fast
            as a whole Vera CPU&apos;s LPDDR5X (1.2 TB/s)
            <Cite s={S.graceCpuPage} kind="derived" note="1.6 / 1.2 = 1.33." /> and 25 times as
            fast as a CXL (Compute Express Link) 2.0 x16 link.
            <Cite s={S.cxl3Spec} kind="derived" note="CXL 2.0 signals at 32 GT/s (CXL 3.0 doubles it to 64 GT/s): 32 GT/s x 16 lanes / 8 = 64 GB/s per direction; 1.6 TB/s / 64 GB/s = 25." />{' '}
            <em>HBM and the Bandwidth Wall</em> covers the HBM side of the trade;{' '}
            <em>DDR5, MRDIMM, LPDDR5X and CXL</em> covers the host side.
          </Box>
          <ExpandableSection headerText="Worked example: DeepSeek-V3 on the specification's layout">
            <Box variant="p">
              DeepSeek-V3&apos;s 671 GB of FP8 weights fit on the layout&apos;s two HBF stacks
              (1,099.5 GB) with 429 GB to spare.
              <Cite s={S.ocpSpec} kind="derived" note="2 x 512 GiB = 1,099.5 GB; 1,099.5 - 671 = 428.5 GB." /> At 128K
              context one sequence&apos;s KV cache is 131,072 tokens x 70,272 bytes = 9.21 GB
              <Cite s={S.deepseekV3Config} kind="derived" note="MLA caches (512 + 64) values per layer x 61 layers x 2 bytes = 70,272 bytes per token." />
              , so the layout&apos;s 154.6 GB of HBM holds 16 sequences, against 20 for three Rubin
              GPUs after their 671 GB of weights, ignoring activations and workspace.
              <Cite s={S.hgxPage} kind="derived" note="4 x 36 GiB = 154.6 GB; 3 x 288 = 864 GB; 864 - 671 = 193 GB; 193 / 9.21 = 20." />{' '}
              One package comes close to three GPUs for this model; each token&apos;s 37 GB of
              active weights then take 11.6 ms to read from the two stacks at Gen 1 speed.
              <Cite s={S.sandiskFactSheet} kind="derived" note="37 GB / (2 x 1.6 TB/s), weights only; 6.0 ms at grade 3." />
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="A published interface, one taped-out die and device samples targeted for 2027: what to ask a vendor for, and what to build, before HBF enters a capacity plan"
          >
            What exists and what to plan for
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>What exists.</strong> The OCP HBF specification, version 0.7.0, was published
            on 3 August 2026 by Sandisk and SK hynix; Google and Tenstorrent joined as consortium
            members during standardisation, and Sandisk later named Meta.
            <Cite s={S.ocpSpec} />
            <Cite s={S.sandiskOcpRelease} />
            <Cite s={S.sandiskInvestorDay2026} /> Sandisk announced in August 2026 that it had
            taped out its first HBF memory die, and targets samples of inference devices with HBF
            in 2027.
            <Cite s={S.sandiskInvestorDay2026} kind="vendor-claim" />
            <Cite s={S.sandiskSkHynixMou} kind="roadmap" note="'early 2027' for AI-inference devices with HBF." />{' '}
            Its undated roadmap adds a Gen 2 above 2 TB/s with up to 1 TB per stack and a Gen 3 at
            3.2 TB/s with up to 1.5 TB.
            <Cite s={S.sandiskFactSheet} kind="roadmap" /> SK hynix calls its HBF product AIN B and
            at the 2026 OCP Global Summit showed a structural model and internal simulations.
            <Cite s={S.skhynixOcp2025} />
            <Cite s={S.skhynixOcp2026} /> Samsung and Kioxia concepts were located only in trade
            press reports.
            <Cite s={S.digitimesSamsung} />
            <Cite s={S.blocksFilesKioxia} />
          </Box>
          <Box variant="p">
            <strong>What is still missing.</strong> This research, in October 2026, located no
            accelerator vendor announcement of an HBF product, no vendor mass-production year
            (trade press reports brokerage estimates of 2028
            <Cite s={S.trendforceTapeout} kind="roadmap" />
            ), no measurement of HBF silicon, and no HBF support in vLLM, SGLang or TensorRT-LLM.
            Every system-level performance result on this page is a simulation or a model.
          </Box>
          <Box variant="h3">Ask a vendor for three datasheet numbers</Box>
          <ol>
            <li>
              <strong>Read latency</strong>, end to end through the base die and UCIe. It sets the
              data in flight per stack, 32 MB at 20 µs, and so how far ahead the runtime must
              prefetch.
            </li>
            <li>
              <strong>Rated P/E cycles and cell type.</strong> The device reports rated and average
              P/E cycles; the specification leaves the value to each product.
              <Cite s={S.ocpSpec} /> They decide whether anything written per request, KV cache
              above all, can live on HBF.
            </li>
            <li>
              <strong>Read-disturb threshold and pages per block.</strong> For weights read every
              step they set the refresh rate and the device&apos;s life: 36 days to 99 years for a
              stack read flat out, across the values FLINT considers.
            </li>
          </ol>
          <Box variant="p">
            Ask as well for write bandwidth (it sets the reload time after a power loss), power per
            stack and price per GB; no vendor figure for any of them was located in this research.
          </Box>
          <Box variant="h3">Plan for</Box>
          <ul>
            <li>A storage reload path sized to refill every stack after a power loss.</li>
            <li>
              A serving runtime that owns placement, sequential writes, wear levelling and refresh
              scheduling.
            </li>
            <li>An accelerator with UCIe ports at its HBF sites.</li>
            <li>
              MoE expert pools and resident models as the first tenants, sized by sweeps per
              second: about 3 a second for an HBF stack against about 80 for HBM4. Per-token KV
              cache stays in HBM, and KV reused across requests goes to the tier in{' '}
              <em>Flash as a Cache Tier for Inference</em>.
            </li>
          </ul>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
