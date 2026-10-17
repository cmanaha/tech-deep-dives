import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Link from '@cloudscape-design/components/link';
import Badge from '@cloudscape-design/components/badge';
import { Glossary, GlossaryEntry } from '@tech-deep-dives/shared';
import { tierDescription, type Tier } from '../components/Cite';
import { collectSources, TIERS, type CitedSource } from '../sources';
import { sectionTitles } from '../sectionTitles';

// Definitions only. Figures belong in the sections, where each one carries a
// citation; a glossary entry that needs a number to make sense points to the
// section instead.
const glossary: GlossaryEntry[] = [
  // Memory and storage
  { acronym: 'HBM', fullForm: 'High Bandwidth Memory', description: 'DRAM dies stacked on a base die, joined by through-silicon vias and placed beside the accelerator on an interposer. HBM3, HBM3e and HBM4 are the generations in this dive.' },
  { acronym: 'HBF', fullForm: 'High Bandwidth Flash', description: 'NAND flash dies stacked like HBM and placed beside the accelerator, trading bandwidth and latency for far more capacity per stack. In development; see High Bandwidth Flash.' },
  { acronym: 'NAND', fullForm: 'NOT-AND (flash)', description: 'The flash memory architecture used in SSDs, named for the logic gate its strings of cells resemble.' },
  { acronym: 'NVMe', fullForm: 'Non-Volatile Memory Express', description: 'The command set and host interface SSDs use over PCIe.' },
  { acronym: 'SSD', fullForm: 'Solid-State Drive', description: 'Block storage built from NAND flash and a controller.' },
  { acronym: 'TLC', fullForm: 'Triple-Level Cell', description: 'A NAND cell that stores three bits.' },
  { acronym: 'SLC', fullForm: 'Single-Level Cell; System Level Cache', description: 'In flash, a NAND cell that stores one bit. In CPUs, a last-level cache shared by every core on the mesh, the term Arm-based designs such as Graviton use.' },
  { acronym: 'P/E', fullForm: 'Program/Erase (cycle)', description: 'One write and erase of a flash block. Flash endurance is counted in these cycles.' },
  { acronym: 'ECC', fullForm: 'Error-Correcting Code', description: 'Redundant bits stored with data so the controller can detect and correct bit errors.' },
  { acronym: 'DRAM', fullForm: 'Dynamic Random Access Memory', description: 'Volatile memory that stores each bit as charge in a capacitor and must be refreshed. DDR, LPDDR and HBM are all DRAM.' },
  { acronym: 'SRAM', fullForm: 'Static Random Access Memory', description: 'Volatile memory built from transistor latches. Faster and less dense than DRAM; used for caches and on-chip scratchpads.' },
  { acronym: 'DDR5', fullForm: 'Double Data Rate 5', description: 'The current JEDEC generation of server DRAM on DIMMs.' },
  { acronym: 'DIMM', fullForm: 'Dual In-line Memory Module', description: 'The plug-in module that carries DRAM chips on a server motherboard.' },
  { acronym: 'MRDIMM', fullForm: 'Multiplexed Rank DIMM', description: 'A buffered DIMM that interleaves two ranks so the host bus runs at a higher data rate than each rank. See DDR5, MRDIMM, LPDDR5X and CXL.' },
  { acronym: 'LPDDR5X', fullForm: 'Low-Power Double Data Rate 5X', description: 'Mobile-derived DRAM soldered next to the processor. NVIDIA Grace and DGX Spark use it.' },
  { acronym: 'CXL', fullForm: 'Compute Express Link', description: 'A cache-coherent protocol on the PCIe physical layer for attaching memory and accelerators to a host.' },
  { acronym: 'TSV', fullForm: 'Through-Silicon Via', description: 'A vertical connection through a thinned die, used to wire stacked HBM and HBF dies.' },
  { acronym: 'SMEM', fullForm: 'Shared Memory', description: 'The per-SM scratchpad on NVIDIA GPUs that software manages, carved from the same SRAM as the L1 cache.' },
  { acronym: 'TMEM', fullForm: 'Tensor Memory', description: 'Blackwell per-SM memory that holds Tensor Core accumulators.' },
  { acronym: 'TMA', fullForm: 'Tensor Memory Accelerator', description: 'Hopper and Blackwell unit that copies tiles between global memory and shared memory asynchronously.' },
  { acronym: 'SBUF', fullForm: 'State Buffer', description: 'The on-chip SRAM scratchpad in each NeuronCore, managed by the compiler or an NKI kernel.' },
  { acronym: 'PSUM', fullForm: 'Partial Sum buffer', description: 'NeuronCore on-chip memory that accumulates matrix-multiply results.' },
  { acronym: 'LLC', fullForm: 'Last-Level Cache', description: 'The largest and slowest cache before main memory.' },
  { acronym: 'TLB', fullForm: 'Translation Lookaside Buffer', description: 'A hardware cache of virtual-to-physical address translations.' },
  { acronym: 'DMA', fullForm: 'Direct Memory Access', description: 'A copy engine that moves data between memories without the processor issuing each load and store.' },
  { acronym: 'KV cache', fullForm: 'Key-Value cache', description: 'The attention keys and values a model stores for every token already processed, so decode does not recompute them.' },

  // Chiplets, topology and links
  { acronym: 'CCD', fullForm: 'Core Complex Die', description: 'An AMD compute chiplet carrying CPU cores and their L3 cache.' },
  { acronym: 'CCX', fullForm: 'Core Complex', description: 'A group of AMD cores sharing one L3 cache.' },
  { acronym: 'IOD', fullForm: 'I/O Die', description: 'The AMD central die holding the memory controllers, PCIe and the Infinity Fabric.' },
  { acronym: 'GMI', fullForm: 'Global Memory Interconnect', description: 'The AMD link between each CCD and the I/O die.' },
  { acronym: 'UMC', fullForm: 'Unified Memory Controller', description: 'The AMD DDR5 memory controller, one per channel, in the I/O die.' },
  { acronym: 'CMN', fullForm: 'Coherent Mesh Network', description: 'The Arm on-chip mesh interconnect family (CMN-700, CMN S3) that Neoverse server chips use.' },
  { acronym: 'CHA', fullForm: 'Caching and Home Agent', description: 'The Intel mesh stop that owns an L3 slice and its snoop filter.' },
  { acronym: 'MDF', fullForm: 'Modular Data Fabric', description: 'The Intel extension of the on-die mesh across the die boundaries of a multi-die Xeon 6.' },
  { acronym: 'EMIB', fullForm: 'Embedded Multi-die Interconnect Bridge', description: 'An Intel silicon bridge embedded in the package substrate that carries dense wiring between neighbouring dies.' },
  { acronym: 'NUMA', fullForm: 'Non-Uniform Memory Access', description: 'A design where memory latency and bandwidth depend on which processor or die makes the request.' },
  { acronym: 'NPS', fullForm: 'NUMA nodes Per Socket', description: 'The AMD BIOS setting (NPS1, NPS2, NPS4) that splits a socket into NUMA domains.' },
  { acronym: 'SNC', fullForm: 'Sub-NUMA Clustering', description: 'The Intel setting that splits a socket into several NUMA domains.' },
  { acronym: 'NV-HBI', fullForm: 'NVIDIA High-Bandwidth Interface', description: 'The die-to-die link that joins the two Blackwell dies into one GPU.' },
  { acronym: 'NVLink', fullForm: 'NVLink', description: 'The NVIDIA GPU-to-GPU interconnect. NVIDIA quotes NVLink bandwidth as the two directions added together.' },
  { acronym: 'NVLink-C2C', fullForm: 'NVLink Chip-to-Chip', description: 'The coherent CPU-to-GPU link inside Grace Hopper, Grace Blackwell and GB10.' },
  { acronym: 'NVSwitch', fullForm: 'NVLink Switch', description: 'The switch chip that connects every GPU in an NVLink domain to every other.' },
  { acronym: 'NVL72', fullForm: 'NVL72', description: 'The NVIDIA rack-scale system (GB200 NVL72, GB300 NVL72) whose 72 Blackwell GPUs share one NVLink domain.' },
  { acronym: 'MNNVL', fullForm: 'Multi-Node NVLink', description: 'NVLink spanning several compute trays, as in an NVL72 rack.' },
  { acronym: 'HGX', fullForm: 'HGX', description: 'The NVIDIA GPU baseboard, usually eight GPUs joined through NVLink switches, that most GPU servers are built on.' },
  { acronym: 'SXM', fullForm: 'SXM', description: 'The NVIDIA socketed GPU module form factor used on HGX boards. NVIDIA does not expand the name on the pages checked.' },
  { acronym: 'UCIe', fullForm: 'Universal Chiplet Interconnect Express', description: 'An open standard for die-to-die links inside a package.' },
  { acronym: 'PCIe', fullForm: 'Peripheral Component Interconnect Express', description: 'The standard host expansion bus.' },
  { acronym: 'GT/s', fullForm: 'Gigatransfers per second', description: 'Link signalling rate. Bandwidth depends on lane count and encoding as well.' },
  { acronym: 'RoCE', fullForm: 'RDMA over Converged Ethernet', description: 'RDMA carried over Ethernet.' },

  // Compute
  { acronym: 'SM', fullForm: 'Streaming Multiprocessor', description: 'The independent execution unit of an NVIDIA GPU, with its own warp schedulers, register file, shared memory and Tensor Cores.' },
  { acronym: 'ISA', fullForm: 'Instruction Set Architecture', description: 'The instructions a processor exposes to software.' },
  { acronym: 'AVX-512', fullForm: 'Advanced Vector Extensions 512', description: 'The x86 512-bit SIMD instruction set on Intel Xeon and AMD Zen 4 and Zen 5.' },
  { acronym: 'SVE2', fullForm: 'Scalable Vector Extension 2', description: 'The Arm SIMD instruction set whose vector length is chosen by the hardware.' },
  { acronym: 'AMX', fullForm: 'Advanced Matrix Extensions', description: 'Intel tile registers and matrix-multiply instructions on Xeon cores.' },
  { acronym: 'GEMM', fullForm: 'General Matrix Multiply', description: 'Matrix times matrix: the dominant operation in transformer prefill and training.' },
  { acronym: 'GEMV', fullForm: 'General Matrix-Vector multiply', description: 'Matrix times vector: the shape of single-sequence decode.' },
  { acronym: 'MMA', fullForm: 'Matrix Multiply-Accumulate', description: 'A Tensor Core operation that multiplies two tiles and adds the result to an accumulator.' },
  { acronym: 'wgmma', fullForm: 'Warpgroup Matrix Multiply-Accumulate', description: 'The Hopper Tensor Core instruction, issued by a group of four warps.' },
  { acronym: 'tcgen05', fullForm: 'Tensor Core generation 5', description: 'The Blackwell Tensor Core instruction family, which accumulates into TMEM.' },
  { acronym: 'SFU', fullForm: 'Special Function Unit', description: 'The GPU unit that evaluates transcendental functions such as exponentials.' },
  { acronym: 'PDL', fullForm: 'Programmatic Dependent Launch', description: 'A CUDA feature that lets the next kernel start its prologue before the previous kernel finishes.' },
  { acronym: 'NeuronCore', fullForm: 'NeuronCore', description: 'The compute core of Trainium and Inferentia, with tensor, vector, scalar and GPSIMD engines around SBUF and PSUM.' },
  { acronym: 'NEFF', fullForm: 'Neuron Executable File Format', description: 'The compiled Trainium or Inferentia program, scheduled ahead of time by the Neuron compiler.' },
  { acronym: 'NKI', fullForm: 'Neuron Kernel Interface', description: 'The Python kernel language for Trainium and Inferentia that programs SBUF and PSUM directly.' },
  { acronym: 'LPU', fullForm: 'Language Processing Unit', description: 'Groq\'s statically scheduled inference chip.' },
  { acronym: 'RDU', fullForm: 'Reconfigurable Dataflow Unit', description: 'SambaNova\'s dataflow accelerator.' },
  { acronym: 'WSE', fullForm: 'Wafer-Scale Engine', description: 'Cerebras\'s accelerator built from a whole wafer.' },
  { acronym: 'BTB', fullForm: 'Branch Target Buffer', description: 'A CPU cache of predicted branch targets.' },
  { acronym: 'xPU', fullForm: 'Any processing unit', description: 'Shorthand for a GPU or custom accelerator, used in the HBF specification.' },

  // Number formats
  { acronym: 'FP64', fullForm: '64-bit floating point', description: 'IEEE double precision. HPC paths only.' },
  { acronym: 'FP32', fullForm: '32-bit floating point', description: 'IEEE single precision. Master weights and optimizer state in training.' },
  { acronym: 'TF32', fullForm: 'TensorFloat-32', description: 'An NVIDIA Tensor Core math mode with FP32\'s 8-bit exponent and a 10-bit mantissa; inputs stay FP32 in memory.' },
  { acronym: 'BF16', fullForm: 'bfloat16', description: 'A 16-bit float with FP32\'s 8-bit exponent and a 7-bit mantissa.' },
  { acronym: 'FP16', fullForm: '16-bit floating point', description: 'IEEE half precision, with a 5-bit exponent and a 10-bit mantissa.' },
  { acronym: 'FP8', fullForm: '8-bit floating point', description: 'E4M3 (4 exponent bits, 3 mantissa bits) for weights and activations; E5M2 for gradients that need more range.' },
  { acronym: 'FP4 / E2M1', fullForm: '4-bit floating point', description: 'One sign bit, two exponent bits and one mantissa bit. Usable only with block scale factors, as in NVFP4 and MXFP4.' },
  { acronym: 'NVFP4', fullForm: 'NVIDIA 4-bit floating point', description: 'E2M1 values with an FP8 E4M3 scale for every 16 values and an FP32 scale per tensor.' },
  { acronym: 'MXFP4 / MXFP8', fullForm: 'Microscaling FP4 / FP8', description: 'Open Compute Project formats: 4-bit or 8-bit values with a shared power-of-two (E8M0) scale for every 32 values.' },
  { acronym: 'INT8', fullForm: '8-bit integer', description: 'Integer quantization with a scale factor; the older inference format.' },

  // Inference and models
  { acronym: 'LLM', fullForm: 'Large Language Model', description: 'A transformer language model too large for a single consumer device.' },
  { acronym: 'SLM', fullForm: 'Small Language Model', description: 'A language model small enough to run on one device. See Small Language Models.' },
  { acronym: 'FFN', fullForm: 'Feed-Forward Network', description: 'The per-token multilayer perceptron in each transformer layer, where most dense weights live.' },
  { acronym: 'MHA', fullForm: 'Multi-Head Attention', description: 'Attention where every query head has its own key and value head.' },
  { acronym: 'GQA', fullForm: 'Grouped-Query Attention', description: 'Attention where several query heads share one key and value head, shrinking the KV cache.' },
  { acronym: 'MQA', fullForm: 'Multi-Query Attention', description: 'Attention where all query heads share one key and value head.' },
  { acronym: 'MLA', fullForm: 'Multi-head Latent Attention', description: 'DeepSeek\'s attention, which caches a compressed latent vector instead of full keys and values.' },
  { acronym: 'MoE', fullForm: 'Mixture of Experts', description: 'A layer with many expert networks of which a router activates a few per token.' },
  { acronym: 'EP', fullForm: 'Expert Parallelism', description: 'Placing different MoE experts on different devices.' },
  { acronym: 'EPLB', fullForm: 'Expert Parallelism Load Balancer', description: 'Replicates and places busy experts so no device becomes the straggler.' },
  { acronym: 'TP', fullForm: 'Tensor Parallelism', description: 'Splitting each layer\'s weight matrices across devices.' },
  { acronym: 'PP', fullForm: 'Pipeline Parallelism', description: 'Placing consecutive layers on different devices.' },
  { acronym: 'MFU', fullForm: 'Model FLOPs Utilization', description: 'Useful model arithmetic per second divided by the hardware\'s peak.' },
  { acronym: 'TTFT', fullForm: 'Time To First Token', description: 'Latency from request arrival to the first output token, dominated by prefill.' },
  { acronym: 'TPOT', fullForm: 'Time Per Output Token', description: 'Average decode latency per generated token after the first.' },
  { acronym: 'RAG', fullForm: 'Retrieval-Augmented Generation', description: 'Retrieving documents from an external store and placing them in the prompt.' },
  { acronym: 'PagedAttention', fullForm: 'PagedAttention', description: 'vLLM\'s KV cache layout in fixed-size blocks, allocated like virtual memory pages.' },

  // Communication and storage paths
  { acronym: 'EFA', fullForm: 'Elastic Fabric Adapter', description: 'The AWS network interface for HPC and ML, with OS-bypass through libfabric.' },
  { acronym: 'SRD', fullForm: 'Scalable Reliable Datagram', description: 'The AWS transport beneath EFA. It sprays packets over many paths and delivers them reliably but unordered.' },
  { acronym: 'RDMA', fullForm: 'Remote Direct Memory Access', description: 'A network transfer that reads or writes remote memory without the remote CPU.' },
  { acronym: 'GPUDirect RDMA', fullForm: 'GPUDirect RDMA', description: 'NVIDIA\'s path for a network adapter to read and write GPU memory directly.' },
  { acronym: 'GDS', fullForm: 'GPUDirect Storage', description: 'NVIDIA\'s path for storage reads and writes straight between NVMe or a file system and GPU memory.' },
  { acronym: 'NCCL', fullForm: 'NVIDIA Collective Communications Library', description: 'The NVIDIA library for all-reduce, all-gather and other collectives; it runs them as GPU kernels.' },
  { acronym: 'NIXL', fullForm: 'NVIDIA Inference Xfer Library', description: 'The NVIDIA point-to-point transfer library for moving KV cache between serving instances.' },
  { acronym: 'EBS', fullForm: 'Elastic Block Store', description: 'AWS network-attached block storage.' },
  { acronym: 'IOPS', fullForm: 'I/O operations per second', description: 'Storage request rate, as distinct from bandwidth.' },
  { acronym: 'DPDK', fullForm: 'Data Plane Development Kit', description: 'Libraries and drivers for user-space packet processing that bypass the kernel network stack.' },
  { acronym: 'OS-bypass', fullForm: 'Operating system bypass', description: 'User-space code driving the network adapter directly, without a system call per message.' },

  // Compilers and tooling
  { acronym: 'PTX', fullForm: 'Parallel Thread Execution', description: 'The NVIDIA virtual instruction set. ptxas lowers it to SASS for one architecture.' },
  { acronym: 'SASS', fullForm: 'Streaming Assembler', description: 'The machine code an NVIDIA SM executes, specific to each architecture.' },
  { acronym: 'CUTLASS', fullForm: 'CUDA Templates for Linear Algebra Subroutines', description: 'The NVIDIA C++ template library for GEMM and convolution kernels.' },
  { acronym: 'CuTe', fullForm: 'CuTe', description: 'The layout and tensor algebra at the core of CUTLASS; CuTe DSL is its Python form.' },
  { acronym: 'DSL', fullForm: 'Domain-Specific Language', description: 'A language built for one kind of program, such as GPU kernels.' },
  { acronym: 'IR', fullForm: 'Intermediate Representation', description: 'A compiler\'s internal form of a program between source and machine code.' },
  { acronym: 'Triton', fullForm: 'Triton', description: 'A Python kernel language and compiler; the author writes block-level code and the compiler handles layouts and data movement.' },
  { acronym: 'Inductor', fullForm: 'TorchInductor', description: 'The default torch.compile backend. It generates Triton for the operations it fuses and calls cuBLAS for most matmuls.' },
  { acronym: 'ATen', fullForm: 'ATen', description: 'PyTorch\'s C++ tensor operator library, which calls cuBLAS and cuDNN on NVIDIA GPUs.' },
  { acronym: 'XLA', fullForm: 'Accelerated Linear Algebra', description: 'The OpenXLA compiler; the Neuron compiler takes its HLO as input.' },
  { acronym: 'HLO', fullForm: 'High-Level Operations', description: 'The XLA intermediate representation of a computation graph.' },
  { acronym: 'ONNX', fullForm: 'Open Neural Network Exchange', description: 'A portable file format for model graphs.' },
  { acronym: 'CCCL', fullForm: 'CUDA Core Compute Libraries', description: 'The NVIDIA library suite of Thrust, CUB and libcu++.' },
  { acronym: 'PRNG', fullForm: 'Pseudorandom Number Generator', description: 'An algorithm that produces a repeatable number stream from a seed.' },

  // Isolation
  { acronym: 'NIE', fullForm: 'Nitro Isolation Engine', description: 'The formally verified component of the Nitro hypervisor on Graviton5 that enforces memory isolation between VMs. See Isolation: NIE and MIG.' },
  { acronym: 'MIG', fullForm: 'Multi-Instance GPU', description: 'NVIDIA partitioning of one GPU into isolated instances, each with its own SMs, memory and cache.' },

  // Standards bodies
  { acronym: 'OCP', fullForm: 'Open Compute Project', description: 'The industry body behind the MX formats and the HBF specification work.' },
  { acronym: 'JEDEC', fullForm: 'JEDEC Solid State Technology Association', description: 'The standards body for DDR, LPDDR and HBM.' },

  // Capital markets
  { acronym: 'HFT', fullForm: 'High-Frequency Trading', description: 'Trading strategies that depend on tick-to-trade latency.' },
  { acronym: 'MiFID II', fullForm: 'Markets in Financial Instruments Directive II', description: 'The EU rules on trading venues, algorithmic trading and record-keeping.' },
  { acronym: 'RTS 6', fullForm: 'Regulatory Technical Standard 6', description: 'The MiFID II standard on organisational requirements for firms that trade algorithmically.' },
  { acronym: 'DORA', fullForm: 'Digital Operational Resilience Act', description: 'The EU regulation on ICT risk in financial services.' },
  { acronym: 'ICT', fullForm: 'Information and Communication Technology', description: 'The EU regulatory term for IT systems.' },
  { acronym: 'SR 11-7', fullForm: 'Supervisory Letter SR 11-7', description: 'US Federal Reserve guidance on model risk management.' },
  { acronym: 'SEC', fullForm: 'US Securities and Exchange Commission', description: 'US securities regulator; Rule 17a-4 governs broker-dealer records.' },
  { acronym: 'CFTC', fullForm: 'Commodity Futures Trading Commission', description: 'US derivatives regulator.' },
  { acronym: 'FINRA', fullForm: 'Financial Industry Regulatory Authority', description: 'The US self-regulatory organisation for broker-dealers.' },
];

const sources = collectSources();

const cited = (s: CitedSource) => s.sections.map((n) => sectionTitles[n] ?? n).join('; ');

function TierList({ tier }: { tier: Tier }) {
  const rows = sources.filter((s) => s.tier === tier);
  if (rows.length === 0) return null;
  return (
    <Container
      header={
        <Header variant="h2" counter={`(${rows.length})`}>
          {tierDescription[tier]}
        </Header>
      }
    >
      <ul style={{ margin: 0, paddingLeft: 20 }}>
        {rows.map((s) => (
          <li key={s.url} style={{ marginBottom: 8 }}>
            <Link href={s.url} external>
              {s.title}
            </Link>
            <Box variant="small" color="text-body-secondary">
              {s.publisher}. Accessed {s.accessed}. Cited in {cited(s)}.
            </Box>
          </li>
        ))}
      </ul>
    </Container>
  );
}

export function GlossaryAndSources() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Look up an acronym, or check where a figure comes from and how much weight it can bear"
          >
            Glossary and Sources
          </Header>
        }
      >
        <SpaceBetween size="s">
          <Box variant="p">
            Every figure in this dive carries a badge that names its publisher and tier. The
            tables below list each source once, with the date it was read and the sections that
            cite it. They are generated from the same records the badges use, so a source cannot
            appear on a page without appearing here.
          </Box>
          <Box variant="p">
            Weigh a figure by its tier and by the word on its badge.{' '}
            <Badge color="blue">T1</Badge> is official documentation, a specification, a filing or
            source code pinned to a commit or tag. <Badge color="grey">T2</Badge> is a vendor press
            release, blog, product page or keynote; a vendor performance figure is marked "claim"
            because nobody outside the vendor measured it.{' '}
            <Badge color="severity-medium">T3</Badge> is third-party analysis, an academic paper or
            trade press. "Derived" marks our own arithmetic on cited inputs, and "roadmap" marks a
            product that is not shipping.
          </Box>
          <Box variant="p">
            The claim registers behind each section, including the figures no source could
            confirm, are in the dive's <Box variant="code">research/2026-10-refresh/</Box> folder.
          </Box>
        </SpaceBetween>
      </Container>

      <Glossary entries={glossary} title="Glossary" />

      {TIERS.map((tier) => (
        <TierList key={tier} tier={tier} />
      ))}
    </SpaceBetween>
  );
}
