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
  { acronym: 'CHMU', fullForm: 'CXL Hot-Page Monitoring Unit', description: 'A CXL device unit that counts accesses per page so host software can move hot pages to faster memory.' },
  { acronym: 'TSP', fullForm: 'TEE Security Protocol', description: 'The CXL protocol for attaching memory to a trusted execution environment.' },
  { acronym: 'MT/s', fullForm: 'Megatransfers per second', description: 'Transfers per second on each data pin, in millions. A DDR5-6400 DIMM runs at 6,400 MT/s.' },
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
  { acronym: 'DDR', fullForm: 'Double Data Rate', description: 'DRAM that transfers data on both edges of the clock. DDR4 and DDR5 are the server generations in this dive.' },
  { acronym: 'RDIMM', fullForm: 'Registered DIMM', description: 'A server DIMM with a register chip that buffers the command and address signals, so a channel can carry more and larger modules.' },
  { acronym: 'MRCD', fullForm: 'Multiplexed Registering Clock Driver', description: 'The buffer chip on an MRDIMM that interleaves its two ranks onto the host bus.' },
  { acronym: 'MDB', fullForm: 'Multiplexed-rank Data Buffer', description: 'The data buffer chips on an MRDIMM that interleave the two ranks onto the data bus, alongside the MRCD.' },
  { acronym: 'SOCAMM2', fullForm: 'Small Outline Compression Attached Memory Module 2', description: 'The JEDEC module format that puts LPDDR5X on a replaceable module instead of soldering it beside the processor. NVIDIA Vera uses SOCAMM modules.' },
  { acronym: 'LPDDR', fullForm: 'Low-Power Double Data Rate', description: 'The DRAM family built for phones and laptops, soldered beside the processor or carried on a SOCAMM2 module. LPDDR5, LPDDR5X and LPDDR6 are the generations here.' },
  { acronym: 'VRAM', fullForm: 'Video RAM', description: 'The dedicated memory on a discrete GPU card, separate from the host DRAM.' },
  { acronym: 'PIM', fullForm: 'Processing-in-Memory', description: 'Arithmetic units built into a memory device beside its banks, so data is used where it is stored. See Compute-in-Memory.' },
  { acronym: 'CIM', fullForm: 'Compute-in-Memory', description: 'The broader idea of computing where the data sits, in DRAM banks (PIM) or inside SRAM arrays.' },
  { acronym: 'PNM', fullForm: 'Processing-Near-Memory', description: 'Compute placed beside memory, such as in a CXL device or a buffer chip, rather than inside the DRAM banks.' },
  { acronym: 'DIMC', fullForm: 'Digital In-Memory Compute', description: 'Digital multiply-accumulate logic built into SRAM arrays, the d-Matrix Corsair design.' },
  { acronym: 'GDDR6, AiM', fullForm: 'Graphics DDR6; Accelerator-in-Memory', description: 'GDDR6 is the DRAM generation on graphics cards. AiM is SK hynix\'s GDDR6 part with compute units beside its banks.' },
  { acronym: 'SPHBM4', fullForm: 'Standard Package HBM4', description: 'A JEDEC HBM4 variant that serializes its interface onto fewer data signals.' },
  { acronym: 'PHY', fullForm: 'Physical layer', description: 'The circuit block that drives and receives signals on a link, such as the HBM interface between the base die and the accelerator.' },
  { acronym: 'CMM', fullForm: 'CXL Memory Module', description: 'Samsung\'s name for its CXL memory devices: CMM-D holds DRAM, CMM-H puts a DRAM cache in front of NAND.' },
  { acronym: 'DWPD', fullForm: 'Drive Writes Per Day', description: 'An SSD endurance rating: how many times the full capacity can be written each day over the warranty period.' },
  { acronym: 'L1D', fullForm: 'Level 1 data cache', description: 'The first-level cache that holds data, as distinct from the L1 instruction cache.' },
  { acronym: 'CTA', fullForm: 'Cooperative Thread Array', description: 'The PTX name for a CUDA thread block: threads that run on one SM and share its shared memory.' },
  { acronym: 'KVBM', fullForm: 'KV Block Manager', description: 'The NVIDIA Dynamo component that moves KV blocks between GPU memory (G1), pinned host memory (G2), local disk (G3) and object storage (G4).' },
  { acronym: 'CMX', fullForm: 'Context memory storage (NVIDIA)', description: 'An NVIDIA KV-cache storage tier: Ethernet-attached flash served through BlueField DPUs.' },
  { acronym: 'SCADA', fullForm: 'Scaled, accelerated data access (NVIDIA)', description: 'NVIDIA storage access in which a CPU daemon sets up the queues and GPU threads issue the reads.' },
  { acronym: 'P2PDMA', fullForm: 'PCI peer-to-peer DMA', description: 'The upstream Linux path that lets one PCIe device, such as a GPU, read from or write to another, such as an NVMe drive, without staging in host memory.' },
  { acronym: 'S3', fullForm: 'Simple Storage Service', description: 'Amazon object storage.' },
  { acronym: 'EFS', fullForm: 'Elastic File System', description: 'Amazon managed NFS file storage.' },
  { acronym: 'NFS', fullForm: 'Network File System', description: 'The file-sharing protocol that lets clients mount a remote file system.' },

  // Chiplets, topology and links
  { acronym: 'CCD', fullForm: 'Core Complex Die', description: 'An AMD compute chiplet carrying CPU cores and their L3 cache.' },
  { acronym: 'IOD', fullForm: 'I/O Die', description: 'The AMD central die holding the memory controllers, PCIe and the Infinity Fabric.' },
  { acronym: 'GMI', fullForm: 'Global Memory Interface', description: 'The AMD link between each CCD and the I/O die.' },
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
  { acronym: 'SXM', fullForm: 'SXM (NVIDIA); switch execution module (Groq)', description: 'At NVIDIA, the socketed GPU module form factor used on HGX boards; NVIDIA does not expand the name on the pages checked. On a Groq LPU, the module that moves and permutes data between the other modules.' },
  { acronym: 'UCIe', fullForm: 'Universal Chiplet Interconnect Express', description: 'An open standard for die-to-die links inside a package.' },
  { acronym: 'PCIe', fullForm: 'Peripheral Component Interconnect Express', description: 'The standard host expansion bus.' },
  { acronym: 'GT/s', fullForm: 'Gigatransfers per second', description: 'Link signalling rate. Bandwidth depends on lane count and encoding as well.' },
  { acronym: 'RoCE', fullForm: 'RDMA over Converged Ethernet', description: 'RDMA carried over Ethernet.' },
  { acronym: 'UPI', fullForm: 'Ultra Path Interconnect', description: 'The Intel coherent link between the sockets of a multi-socket Xeon server.' },
  { acronym: 'SERDES', fullForm: 'Serializer-deserializer', description: 'The circuit that turns parallel data into a fast serial stream for a link and back. PCIe, CXL and Ethernet lanes run on SERDES blocks.' },
  { acronym: 'TLP', fullForm: 'Transaction Layer Packet', description: 'The unit of a PCIe transfer: a header plus data.' },
  { acronym: 'TPH', fullForm: 'TLP Processing Hints', description: 'A PCIe header field that carries a steering tag telling the host where to place an inbound write.' },
  { acronym: 'SDCI', fullForm: 'Smart Data Cache Injection', description: 'AMD\'s feature for writing inbound device data straight into L3 instead of DRAM.' },
  { acronym: 'SDCIAE', fullForm: 'Smart Data Cache Injection Allocation Enforcement', description: 'The AMD control that limits how much of the L3 injected device data may occupy.' },
  { acronym: 'CLOSID', fullForm: 'Class of Service ID', description: 'The Linux resctrl identifier that ties a group of tasks to a cache and memory-bandwidth allocation.' },
  { acronym: 'UALink', fullForm: 'Ultra Accelerator Link', description: 'An open specification for scale-up links between accelerators, including a chiplet-level version.' },
  { acronym: 'UEC', fullForm: 'Ultra Ethernet Consortium', description: 'The industry group that defines Ultra Ethernet, an open Ethernet transport for AI and HPC scale-out networks.' },
  { acronym: 'AXI', fullForm: 'Advanced eXtensible Interface', description: 'The Arm on-chip bus protocol. Proposed HBF designs carry AXI transactions over UCIe.' },
  { acronym: 'C2C', fullForm: 'Chip-to-Chip', description: 'A direct link between two dies or packages, as in NVLink-C2C.' },
  { acronym: 'ASIC', fullForm: 'Application-Specific Integrated Circuit', description: 'A chip designed for one job, such as Trainium or an in-house hyperscaler accelerator.' },
  { acronym: 'OEM', fullForm: 'Original Equipment Manufacturer', description: 'The company that builds and sells the server or device around the chips.' },
  { acronym: 'MSRP', fullForm: 'Manufacturer\'s Suggested Retail Price', description: 'The list price a vendor publishes.' },
  { acronym: 'EDA', fullForm: 'Electronic Design Automation', description: 'The software used to design and verify chips, a memory-hungry CPU workload.' },

  // Compute
  { acronym: 'SM', fullForm: 'Streaming Multiprocessor', description: 'The independent execution unit of an NVIDIA GPU, with its own warp schedulers, register file, shared memory and Tensor Cores.' },
  { acronym: 'ISA', fullForm: 'Instruction Set Architecture', description: 'The instructions a processor exposes to software.' },
  { acronym: 'AVX-512', fullForm: 'Advanced Vector Extensions 512', description: 'The x86 512-bit SIMD instruction set on Intel Xeon and AMD Zen 4 and Zen 5.' },
  { acronym: 'SVE2', fullForm: 'Scalable Vector Extension 2', description: 'The Arm SIMD instruction set whose vector length is chosen by the hardware.' },
  { acronym: 'AMX', fullForm: 'Advanced Matrix Extensions', description: 'Intel tile registers and matrix-multiply instructions on Xeon cores.' },
  { acronym: 'GEMM', fullForm: 'General Matrix Multiply', description: 'Matrix times matrix: the dominant operation in transformer prefill and training.' },
  { acronym: 'GEMV', fullForm: 'General Matrix-Vector multiply', description: 'Matrix times vector: the shape of single-sequence decode.' },
  { acronym: 'MMA', fullForm: 'Matrix Multiply-Accumulate', description: 'A Tensor Core operation that multiplies two tiles and adds the result to an accumulator.' },
  { acronym: 'MAC', fullForm: 'Multiply-Accumulate', description: 'One multiply and one add into a running sum, the basic operation of matrix arithmetic.' },
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
  { acronym: 'SIMD', fullForm: 'Single Instruction, Multiple Data', description: 'One instruction applied to every lane of a vector register at once.' },
  { acronym: 'SIMT', fullForm: 'Single Instruction, Multiple Threads', description: 'The NVIDIA GPU model: groups of 32 threads (a warp) issue one instruction together, and each thread keeps its own registers.' },
  { acronym: 'AVX, AVX2, AVX10', fullForm: 'Advanced Vector Extensions', description: 'The x86 vector instruction families. AVX10 unifies AVX-512 features across Intel P-cores and E-cores.' },
  { acronym: 'VNNI', fullForm: 'Vector Neural Network Instructions', description: 'x86 instructions that multiply 8-bit or 16-bit integers and accumulate into 32 bits in one step.' },
  { acronym: 'SVE, SME', fullForm: 'Scalable Vector Extension; Scalable Matrix Extension', description: 'Arm vector and matrix instruction sets. SVE code runs unchanged at any vector width; SME adds outer-product matrix tiles.' },
  { acronym: 'GPSIMD', fullForm: 'General-purpose SIMD engine', description: 'The NeuronCore engine that runs custom code, beside the Tensor, Vector and Scalar engines.' },
  { acronym: 'MXM, VXM', fullForm: 'Matrix execution module; Vector execution module', description: 'The Groq LPU modules that do matrix multiplication and elementwise vector work.' },
  { acronym: 'TPU', fullForm: 'Tensor Processing Unit', description: 'Google\'s family of machine learning accelerators.' },
  { acronym: 'CUDA', fullForm: 'CUDA', description: 'NVIDIA\'s GPU programming model, compiler toolchain and runtime.' },
  { acronym: 'ROCm', fullForm: 'ROCm', description: 'AMD\'s GPU software stack: compiler, runtime and libraries.' },
  { acronym: 'SMT', fullForm: 'Simultaneous Multithreading', description: 'Two or more hardware threads sharing one core.' },
  { acronym: 'SoC', fullForm: 'System on Chip', description: 'One chip that carries the CPU, GPU, memory controllers and I/O.' },
  { acronym: 'TDP', fullForm: 'Thermal Design Power', description: 'The sustained power a chip and its cooling are designed for.' },
  { acronym: 'DPU', fullForm: 'Data Processing Unit', description: 'A network card with its own cores that offloads networking, storage and security from the host CPU, such as NVIDIA BlueField.' },
  { acronym: 'FPGA', fullForm: 'Field-Programmable Gate Array', description: 'A chip whose logic is configured after manufacture.' },
  { acronym: 'DSA', fullForm: 'Data Streaming Accelerator', description: 'The Intel Xeon accelerator that copies and moves data in place of CPU cores.' },
  { acronym: 'IAA', fullForm: 'In-Memory Analytics Accelerator', description: 'The Intel Xeon accelerator for compression, decompression and database scans.' },
  { acronym: 'FLOP, FLOPS', fullForm: 'Floating-point operation; floating-point operations per second', description: 'FLOPs counts work and FLOPS measures rate. TFLOPS and PFLOPS are 10^12 and 10^15 per second.' },
  { acronym: 'TOPS', fullForm: 'Tera Operations Per Second', description: 'Throughput in 10^12 operations per second, usually for integer formats.' },

  // Number formats
  { acronym: 'FP64', fullForm: '64-bit floating point', description: 'IEEE double precision. HPC paths only.' },
  { acronym: 'FP32', fullForm: '32-bit floating point', description: 'IEEE single precision. Master weights and optimizer state in training.' },
  { acronym: 'TF32', fullForm: 'TensorFloat-32', description: 'An NVIDIA Tensor Core math mode with FP32\'s 8-bit exponent and a 10-bit mantissa; inputs stay FP32 in memory.' },
  { acronym: 'BF16', fullForm: 'bfloat16', description: 'A 16-bit float with FP32\'s 8-bit exponent and a 7-bit mantissa.' },
  { acronym: 'FP16', fullForm: '16-bit floating point', description: 'IEEE half precision, with a 5-bit exponent and a 10-bit mantissa.' },
  { acronym: 'FP8', fullForm: '8-bit floating point', description: 'E4M3 (4 exponent bits, 3 mantissa bits) for weights and activations; E5M2 for gradients that need more range.' },
  { acronym: 'FP4 / E2M1', fullForm: '4-bit floating point', description: 'One sign bit, two exponent bits and one mantissa bit. Usable only with block scale factors, as in NVFP4 and MXFP4.' },
  { acronym: 'NVFP4', fullForm: 'NVIDIA 4-bit floating point', description: 'E2M1 values with an FP8 E4M3 scale for every 16 values and an FP32 scale per tensor.' },
  { acronym: 'MX, MXFP4, MXFP8', fullForm: 'Microscaling formats; Microscaling FP4 / FP8', description: 'Open Compute Project formats: 4-bit or 8-bit values with a shared power-of-two (E8M0) scale for every 32 values.' },
  { acronym: 'INT8', fullForm: '8-bit integer', description: 'Integer quantization with a scale factor; the older inference format.' },
  { acronym: 'INT4', fullForm: '4-bit integer', description: 'A weight format that stores each value in four bits, with a scale per group of values.' },
  { acronym: 'E4M3, E5M2', fullForm: 'FP8 encodings', description: 'The two 8-bit float layouts: 4 exponent and 3 mantissa bits, or 5 and 2. E4M3 keeps precision, E5M2 keeps range.' },
  { acronym: 'E8M0', fullForm: '8-bit exponent-only format', description: 'A power-of-two scale with no mantissa, used as the shared scale in MX formats.' },
  { acronym: 'FP6', fullForm: '6-bit floating point', description: 'A 6-bit float format in the OCP MX family.' },

  // Inference and models
  { acronym: 'LLM', fullForm: 'Large Language Model', description: 'A transformer language model too large for a single consumer device.' },
  { acronym: 'SLM', fullForm: 'Small Language Model', description: 'A language model small enough to run on one device. See Small Language Models.' },
  { acronym: 'FFN', fullForm: 'Feed-Forward Network', description: 'The per-token multilayer perceptron in each transformer layer, where most dense weights live.' },
  { acronym: 'MHA', fullForm: 'Multi-Head Attention', description: 'Attention where every query head has its own key and value head.' },
  { acronym: 'GQA', fullForm: 'Grouped-Query Attention', description: 'Attention where several query heads share one key and value head, shrinking the KV cache.' },
  { acronym: 'MQA', fullForm: 'Multi-Query Attention', description: 'Attention where all query heads share one key and value head.' },
  { acronym: 'MLA', fullForm: 'Multi-head Latent Attention', description: 'DeepSeek\'s attention, which caches a compressed latent vector instead of full keys and values.' },
  { acronym: 'RoPE', fullForm: 'Rotary Position Embedding', description: 'Encoding each token\'s position by rotating its query and key vectors. MLA caches a small RoPE key beside the latent.' },
  { acronym: 'MoE', fullForm: 'Mixture of Experts', description: 'A layer with many expert networks of which a router activates a few per token.' },
  { acronym: 'EP', fullForm: 'Expert Parallelism', description: 'Placing different MoE experts on different devices.' },
  { acronym: 'TP', fullForm: 'Tensor Parallelism', description: 'Splitting each layer\'s weight matrices across devices.' },
  { acronym: 'PP', fullForm: 'Pipeline Parallelism', description: 'Placing consecutive layers on different devices.' },
  { acronym: 'MFU', fullForm: 'Model FLOPs Utilization', description: 'Useful model arithmetic per second divided by the hardware\'s peak.' },
  { acronym: 'TTFT', fullForm: 'Time To First Token', description: 'Latency from request arrival to the first output token, dominated by prefill.' },
  { acronym: 'TPOT', fullForm: 'Time Per Output Token', description: 'Average decode latency per generated token after the first.' },
  { acronym: 'RAG', fullForm: 'Retrieval-Augmented Generation', description: 'Retrieving documents from an external store and placing them in the prompt.' },
  { acronym: 'PagedAttention', fullForm: 'PagedAttention', description: 'vLLM\'s KV cache layout in fixed-size blocks, allocated like virtual memory pages.' },
  { acronym: 'EAGLE', fullForm: 'Extrapolation Algorithm for Greater Language-model Efficiency', description: 'A speculative-decoding method that trains a small draft head on the target model\'s hidden states.' },
  { acronym: 'MTP', fullForm: 'Multi-Token Prediction', description: 'Extra heads trained with the model that predict tokens beyond the next one; serving stacks can use them as a speculative draft.' },
  { acronym: 'QAT', fullForm: 'Quantization-Aware Training; QuickAssist Technology (Intel)', description: 'In models, training or fine-tuning with quantization simulated in the forward pass, so the model learns to tolerate low precision. On Intel Xeon, the accelerator for cryptography and compression.' },
  { acronym: 'PTQ', fullForm: 'Post-Training Quantization', description: 'Quantizing a trained model without further training.' },
  { acronym: 'GPTQ', fullForm: 'GPTQ', description: 'A post-training quantization method for generative transformers that quantizes weights layer by layer while correcting the error each step introduces.' },
  { acronym: 'LoRA, QLoRA', fullForm: 'Low-Rank Adaptation; quantized LoRA', description: 'Fine-tuning that trains small low-rank matrices beside frozen weights; QLoRA does it on a quantized base model.' },
  { acronym: 'GGUF', fullForm: 'GGUF', description: 'The llama.cpp model file format.' },
  { acronym: 'PLE', fullForm: 'Per-Layer Embeddings', description: 'Gemma tables read by lookup at each layer, which count as parameters but cost little compute.' },
  { acronym: 'VLM', fullForm: 'Vision Language Model', description: 'A language model that also takes images as input.' },
  { acronym: 'ASR', fullForm: 'Automatic Speech Recognition', description: 'Speech-to-text models such as Whisper.' },
  { acronym: 'RL', fullForm: 'Reinforcement Learning', description: 'Training from rewards on the model\'s own outputs (rollouts).' },
  { acronym: 'TKG', fullForm: 'Token Generation', description: 'The NKI name for decode-phase kernels, as in Attention TKG.' },
  { acronym: 'CTE', fullForm: 'Context Encoding', description: 'The NKI name for prefill-phase kernels, as in attention CTE.' },
  { acronym: 'LSTM', fullForm: 'Long Short-Term Memory', description: 'A recurrent neural network layer, common in speech models before transformers.' },
  { acronym: 'AFD', fullForm: 'Attention-FFN Disaggregation', description: 'Serving attention and the FFN or expert layers on different hardware, passing activations between them each layer.' },
  { acronym: 'CoE', fullForm: 'Composition of Experts', description: 'SambaNova\'s approach of routing each request to one of many whole models.' },
  { acronym: 'MLC', fullForm: 'Machine Learning Compilation (MLC LLM)', description: 'An open-source engine that compiles LLMs for local GPUs and phones.' },
  { acronym: 'MMLU', fullForm: 'Massive Multitask Language Understanding', description: 'A multiple-choice knowledge benchmark.' },
  { acronym: 'GSM8K', fullForm: 'Grade School Math 8K', description: 'A benchmark of grade-school math word problems.' },
  { acronym: 'MRCR', fullForm: 'Multi-Round Coreference Resolution', description: 'A long-context benchmark that asks the model to retrieve one of several similar items from a long conversation.' },
  { acronym: 'QPS', fullForm: 'Queries Per Second', description: 'Request rate at a server.' },

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
  { acronym: 'UCX', fullForm: 'Unified Communication X', description: 'An open communication framework that picks the transport (RDMA, shared memory, TCP) for each transfer.' },
  { acronym: 'MPI', fullForm: 'Message Passing Interface', description: 'The standard API for message passing in HPC programs.' },
  { acronym: 'NVSHMEM', fullForm: 'NVSHMEM', description: 'An NVIDIA library that gives GPU threads one-sided reads and writes into other GPUs\' memory.' },
  { acronym: 'ENA', fullForm: 'Elastic Network Adapter', description: 'The standard EC2 network interface; EFA adds OS-bypass on top of it.' },
  { acronym: 'NIC', fullForm: 'Network Interface Card', description: 'The adapter that connects a host to the network.' },
  { acronym: 'TCP, UDP', fullForm: 'Transmission Control Protocol; User Datagram Protocol', description: 'The reliable, ordered stream protocol and the connectionless datagram protocol of IP networks.' },
  { acronym: 'VPC', fullForm: 'Virtual Private Cloud', description: 'An isolated AWS network.' },
  { acronym: 'EKS', fullForm: 'Elastic Kubernetes Service', description: 'Amazon managed Kubernetes.' },
  { acronym: 'HPC', fullForm: 'High Performance Computing', description: 'Tightly coupled scientific and engineering workloads across many nodes.' },

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
  { acronym: 'ONNX', fullForm: 'Open Neural Network Exchange', description: 'A portable file format for model graphs.' },
  { acronym: 'CCCL', fullForm: 'CUDA Core Compute Libraries', description: 'The NVIDIA library suite of Thrust, CUB and libcu++.' },
  { acronym: 'SDK', fullForm: 'Software Development Kit', description: 'The compilers, runtime, libraries and tools for a platform, such as the Neuron SDK.' },
  { acronym: 'NxD', fullForm: 'NeuronX Distributed', description: 'The AWS Neuron libraries for sharding training (NxD Training) and inference (NxD Inference) across NeuronCores.' },
  { acronym: 'FSDP', fullForm: 'Fully Sharded Data Parallel', description: 'PyTorch data parallelism that shards parameters, gradients and optimizer state across devices.' },
  { acronym: 'DTensor', fullForm: 'Distributed Tensor', description: 'The PyTorch tensor type that describes how one logical tensor is sharded across devices.' },
  { acronym: 'JAX', fullForm: 'JAX', description: 'Google\'s Python library for array programs compiled with XLA.' },
  { acronym: 'LLVM', fullForm: 'LLVM', description: 'The open compiler infrastructure behind Clang; its scheduling models describe each CPU core.' },
  { acronym: 'oneDNN', fullForm: 'oneAPI Deep Neural Network Library', description: 'Intel\'s CPU kernel library for deep learning, used by PyTorch on x86 and Arm.' },
  { acronym: 'IPEX', fullForm: 'Intel Extension for PyTorch', description: 'Intel\'s add-on package for PyTorch on Xeon, now archived in favour of stock PyTorch.' },
  { acronym: 'CI', fullForm: 'Continuous Integration', description: 'Automated builds and tests on every change.' },
  { acronym: 'JVM', fullForm: 'Java Virtual Machine', description: 'The runtime for Java and other JVM languages.' },

  // Isolation
  { acronym: 'NIE', fullForm: 'Nitro Isolation Engine', description: 'The formally verified component of the Nitro hypervisor on Graviton5 that enforces memory isolation between VMs. See Isolation: NIE and MIG.' },
  { acronym: 'MIG', fullForm: 'Multi-Instance GPU', description: 'NVIDIA partitioning of one GPU into isolated instances, each with its own SMs, memory and cache.' },
  { acronym: 'VM, vCPU', fullForm: 'Virtual Machine; virtual CPU', description: 'A guest operating system on a hypervisor, and one of its virtual processors.' },
  { acronym: 'EL1, EL2', fullForm: 'Exception Level 1 and 2', description: 'Arm privilege levels: EL1 runs the guest kernel, EL2 the hypervisor.' },
  { acronym: 'IOMMU', fullForm: 'I/O Memory Management Unit', description: 'The unit that translates and checks device memory accesses, so a device can reach only the memory it is granted.' },
  { acronym: 'TEE, TEE-I/O', fullForm: 'Trusted Execution Environment; TEE for I/O', description: 'Hardware that keeps a workload\'s memory encrypted and isolated from the host. TEE-I/O extends it to devices, so a GPU joins the protected guest.' },
  { acronym: 'SEV-SNP', fullForm: 'Secure Encrypted Virtualization with Secure Nested Paging', description: 'AMD confidential-VM technology that encrypts guest memory and protects its page mappings.' },
  { acronym: 'TDX', fullForm: 'Trust Domain Extensions', description: 'Intel confidential-VM technology.' },
  { acronym: 'AEAD', fullForm: 'Authenticated Encryption with Associated Data', description: 'Encryption that also proves the data was not modified.' },
  { acronym: 'UUID', fullForm: 'Universally Unique Identifier', description: 'A 128-bit identifier; each MIG instance gets its own.' },
  { acronym: 'QoS', fullForm: 'Quality of Service', description: 'Controls that guarantee or limit a tenant\'s share of a resource.' },
  { acronym: 'Isabelle/HOL', fullForm: 'Isabelle proof assistant, Higher-Order Logic', description: 'The interactive theorem prover used for the NIE proofs.' },

  // Standards bodies
  { acronym: 'OCP', fullForm: 'Open Compute Project', description: 'The industry body behind the MX formats and the HBF specification work.' },
  { acronym: 'JEDEC', fullForm: 'JEDEC Solid State Technology Association', description: 'The standards body for DDR, LPDDR and HBM.' },

  // Capital markets
  { acronym: 'HFT', fullForm: 'High-Frequency Trading', description: 'Trading strategies that depend on tick-to-trade latency.' },
  { acronym: 'MiFID II', fullForm: 'Markets in Financial Instruments Directive II', description: 'The EU rules on trading venues, algorithmic trading and record-keeping.' },
  { acronym: 'RTS 6', fullForm: 'Regulatory Technical Standard 6', description: 'The MiFID II standard on organisational requirements for firms that trade algorithmically.' },
  { acronym: 'DORA', fullForm: 'Digital Operational Resilience Act', description: 'The EU regulation on ICT risk in financial services.' },
  { acronym: 'ICT', fullForm: 'Information and Communication Technology', description: 'The EU regulatory term for IT systems.' },
  { acronym: 'SR 26-2', fullForm: 'Supervision and Regulation letter 26-2', description: 'US banking-agency guidance on model risk management, issued in April 2026 to replace SR 11-7.' },
  { acronym: 'SEC', fullForm: 'US Securities and Exchange Commission', description: 'US securities regulator; Rule 17a-4 governs broker-dealer records.' },
  { acronym: 'FRTB, IMA', fullForm: 'Fundamental Review of the Trading Book; Internal Models Approach', description: 'The Basel market-risk capital rules, and the option to compute capital with the bank\'s own models.' },
  { acronym: 'BCBS', fullForm: 'Basel Committee on Banking Supervision', description: 'The body that sets the Basel capital standards.' },
  { acronym: 'PRA', fullForm: 'Prudential Regulation Authority', description: 'The UK bank regulator, part of the Bank of England.' },
  { acronym: 'CCR', fullForm: 'Counterparty Credit Risk', description: 'The risk that a trading counterparty defaults before settling.' },
  { acronym: 'CVA, MVA, xVA', fullForm: 'Credit Valuation Adjustment; Margin Valuation Adjustment; X-Value Adjustment', description: 'Adjustments to a derivative\'s price for counterparty credit, margin funding and related costs.' },
  { acronym: 'ISDA SIMM', fullForm: 'International Swaps and Derivatives Association, Standard Initial Margin Model', description: 'The industry model for initial margin on uncleared derivatives.' },
  { acronym: 'RWA', fullForm: 'Risk-Weighted Assets', description: 'Assets weighted by risk, the base for bank capital ratios.' },
  { acronym: 'AAD', fullForm: 'Adjoint Algorithmic Differentiation', description: 'Computing every sensitivity of a price in one backward pass through the pricing code.' },
  { acronym: 'PCA', fullForm: 'Principal Component Analysis', description: 'A method that reduces data to the few directions that carry most of its variance.' },
  { acronym: 'OLAP', fullForm: 'Online Analytical Processing', description: 'Analytical queries over large in-memory or columnar data sets.' },
  { acronym: 'SLA', fullForm: 'Service-Level Agreement', description: 'A contractual promise on availability or latency.' },
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
