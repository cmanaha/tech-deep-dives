import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Table from '@cloudscape-design/components/table';
import Badge from '@cloudscape-design/components/badge';
import Alert from '@cloudscape-design/components/alert';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { SourceRef } from '@tech-deep-dives/shared';
import type { CodeRef, DocRef } from '@tech-deep-dives/shared';

/**
 * ENA vs EFA. Three conflations, each answered from driver source:
 *
 *   1. "EFA is a mode of ENA"        -> disjoint PCI ID sets, two drivers.
 *   2. "SRD is built on top of ENA"  -> EFA-only carries SRD with no ENA device.
 *   3. "LLQ is what ENA has and EFA lacks" -> both have it; the difference is
 *      which side of the kernel boundary writes the descriptor.
 *
 * Structural claims are pinned to a commit, per revamp/source-authority-standard.md.
 * Research: research/2026-08-refresh/06-ena-vs-efa.md.
 */

const READ = '2026-08-01';
const DRIVERS_SHA = 'b99452b70756b1b394b1e7ff238d4efbdca44c5b';
const UTILS_SHA = '6ecb14cf1dc3f17a375ea72c1aa3dfd72dc5a1e7';

/** A citation into amzn-drivers, pinned to the commit the research read. */
function drv(path: string, lines: string): CodeRef {
  return { repo: 'amzn/amzn-drivers', ref: DRIVERS_SHA, path, lines, read: READ };
}

const code = {
  enaPciIds: drv('kernel/linux/ena/ena_pci_id_tbl.h', 'L9-L43'),
  efaPciIds: drv('kernel/linux/efa/src/efa_main.c', 'L27-L40'),
  enaDriver: drv('kernel/linux/ena/ena_netdev.c', 'L5979-L5982'),
  efaDriver: drv('kernel/linux/efa/src/efa_main.c', 'L998-L1004'),
  enaMakefile: drv('kernel/linux/ena/Makefile', 'L1-L17'),
  efaKbuild: drv('kernel/linux/efa/src/Kbuild.in', 'L1-L2'),
  efaIbDevice: drv('kernel/linux/efa/src/efa_main.c', 'L616-L655'),
  efaQpType: drv('kernel/linux/efa/src/efa-abi.h', 'L90'),
  enaBars: drv('kernel/linux/ena/ena_netdev.h', 'L72-L74'),
  efaBars: drv('kernel/linux/efa/src/efa_main.c', 'L67-L69'),
  enaPush: drv('kernel/linux/common/ena_com/ena_eth_com.c', 'L95-L134'),
  enaWcMap: drv('kernel/linux/ena/ena_netdev.c', 'L4291-L4303'),
  efaUserMap: drv('kernel/linux/efa/src/efa_verbs.c', 'L890-L902'),
  efaSqDesc: drv('kernel/linux/efa/src/efa_verbs.c', 'L1148-L1149'),
  efaAbiKeys: drv('kernel/linux/efa/src/efa-abi.h', 'L115-L120'),
  enaRings: drv('kernel/linux/ena/ena_netdev.h', 'L76-L78'),
  enaMsix: drv('kernel/linux/ena/ena_netdev.h', 'L56-L70'),
  enaDim: drv('kernel/linux/ena/ena_netdev.c', 'L1791-L1822'),
  enaGro: drv('kernel/linux/ena/ena_netdev.c', 'L1722-L1724'),
  enaOffloads: drv('kernel/linux/ena/ena_netdev.c', 'L5304-L5336'),
  srdStats: drv('kernel/linux/common/ena_com/ena_admin_defs.h', 'L512-L536'),
  srdFlags: drv('kernel/linux/common/ena_com/ena_admin_defs.h', 'L162-L170'),
  srdGet: drv('kernel/linux/common/ena_com/ena_com.c', 'L2645-L2661'),
  srdEthtool: drv('kernel/linux/ena/ena_ethtool.c', 'L130-L135'),
  mtuCheck: {
    repo: 'amzn/amzn-ec2-ena-utilities',
    ref: UTILS_SHA,
    path: 'ena-express/check-ena-express-settings.sh',
    lines: 'L26-L27',
    read: READ,
  },
} satisfies Record<string, CodeRef>;

const docs = {
  efa: {
    title: 'EC2 User Guide: Elastic Fabric Adapter for AI/ML and HPC workloads',
    url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html',
    tier: 1,
    accessed: READ,
  },
  enaExpress: {
    title: 'EC2 User Guide: Improve network performance with ENA Express',
    url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ena-express.html',
    tier: 1,
    accessed: READ,
  },
  bandwidth: {
    title: 'EC2 User Guide: Amazon EC2 instance network bandwidth',
    url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-network-bandwidth.html',
    tier: 1,
    accessed: READ,
  },
} satisfies Record<string, DocRef>;

/**
 * Diagram 1. The conflation killer. Three interface types, and the PCI
 * functions each one actually materializes, with the real device IDs.
 */
function OneAttachmentTwoDevicesDiagram() {
  return (
    <svg
      viewBox="0 0 900 410"
      role="img"
      aria-labelledby="ena-efa-devices-title"
      style={{ width: '100%', height: 'auto' }}
    >
      <title id="ena-efa-devices-title">
        One network interface attachment can materialize one PCI function or two, and each
        function is its own device with its own driver. A plain interface creates an ENA
        function bound by ena.ko to a network device. An EFA with ENA interface creates an ENA
        function and a separate EFA function, bound by two independent drivers into two
        different kernel subsystems. An EFA-only interface creates the EFA function alone, so
        the attachment carries verbs and SRD queue pairs but no network device, IP address or
        route.
      </title>
      <style>
        {`
          .dv-bg { fill: #ffffff; }
          .dv-panel { fill: #ffffff; stroke: #879596; stroke-width: 1.5; }
          .dv-mid { fill: #f7fbff; stroke: #0972d3; stroke-width: 1.5; }
          .dv-ena { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .dv-efa { fill: #ecf7ec; stroke: #037f0c; stroke-width: 1.5; }
          .dv-drv { fill: #ffffff; stroke: #5f6b7a; stroke-width: 1.2; }
          .dv-none { fill: #f4f4f6; stroke: #879596; stroke-width: 1.2; stroke-dasharray: 5 4; }
          .dv-h { fill: #0f1b2a; font: 600 13px sans-serif; text-anchor: middle; }
          .dv-sub { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .dv-t { fill: #0f1b2a; font: 600 12px sans-serif; text-anchor: middle; }
          .dv-s { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .dv-cap { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .dv-ar { stroke: #5f6b7a; stroke-width: 1.5; fill: none; marker-end: url(#dv-head); }
        `}
      </style>
      <defs>
        <marker id="dv-head" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="#5f6b7a" />
        </marker>
      </defs>
      <rect className="dv-bg" x="0" y="0" width="900" height="410" rx="8" />

      {/* Panel 1: plain ENA interface */}
      <rect className="dv-panel" x="16" y="40" width="232" height="330" rx="8" />
      <text className="dv-h" x="132" y="64">Interface type: interface</text>
      <text className="dv-sub" x="132" y="82">Console shows no selection</text>
      <rect className="dv-ena" x="30" y="94" width="204" height="44" rx="6" />
      <text className="dv-t" x="132" y="114">ENA function</text>
      <text className="dv-s" x="132" y="130">1d0f:ec20</text>
      <path className="dv-ar" d="M132,140 L132,152" />
      <rect className="dv-drv" x="30" y="156" width="204" height="34" rx="6" />
      <text className="dv-t" x="132" y="178">ena.ko</text>
      <path className="dv-ar" d="M132,192 L132,204" />
      <rect className="dv-drv" x="30" y="208" width="204" height="52" rx="6" />
      <text className="dv-t" x="132" y="230">netdev, eth0</text>
      <text className="dv-s" x="132" y="248">IP address, routable</text>
      <rect className="dv-none" x="30" y="282" width="204" height="40" rx="6" />
      <text className="dv-s" x="132" y="300">No EFA function.</text>
      <text className="dv-s" x="132" y="315">No verbs, no SRD queue pairs.</text>

      {/* Panel 2: EFA with ENA */}
      <rect className="dv-mid" x="268" y="40" width="340" height="330" rx="8" />
      <text className="dv-h" x="438" y="64">Interface type: efa</text>
      <text className="dv-sub" x="438" y="82">Console shows EFA with ENA</text>
      <rect className="dv-ena" x="282" y="94" width="150" height="44" rx="6" />
      <text className="dv-t" x="357" y="114">ENA function</text>
      <text className="dv-s" x="357" y="130">1d0f:ec20</text>
      <rect className="dv-efa" x="452" y="94" width="146" height="44" rx="6" />
      <text className="dv-t" x="525" y="114">EFA function</text>
      <text className="dv-s" x="525" y="130">1d0f:efa4</text>
      <path className="dv-ar" d="M357,140 L357,152" />
      <path className="dv-ar" d="M525,140 L525,152" />
      <rect className="dv-drv" x="282" y="156" width="150" height="34" rx="6" />
      <text className="dv-t" x="357" y="178">ena.ko</text>
      <rect className="dv-drv" x="452" y="156" width="146" height="34" rx="6" />
      <text className="dv-t" x="525" y="178">efa.ko</text>
      <path className="dv-ar" d="M357,192 L357,204" />
      <path className="dv-ar" d="M525,192 L525,204" />
      <rect className="dv-drv" x="282" y="208" width="150" height="52" rx="6" />
      <text className="dv-t" x="357" y="230">netdev, eth0</text>
      <text className="dv-s" x="357" y="248">IP address, routable</text>
      <rect className="dv-drv" x="452" y="208" width="146" height="52" rx="6" />
      <text className="dv-t" x="525" y="230">ib_device</text>
      <text className="dv-s" x="525" y="248">no IP, not routable</text>
      <text className="dv-s" x="438" y="292">One attachment. Two PCI functions.</text>
      <text className="dv-s" x="438" y="308">Two drivers, two kernel subsystems,</text>
      <text className="dv-s" x="438" y="324">zero shared code.</text>

      {/* Panel 3: EFA-only */}
      <rect className="dv-panel" x="628" y="40" width="256" height="330" rx="8" />
      <text className="dv-h" x="756" y="64">Interface type: efa-only</text>
      <text className="dv-sub" x="756" y="82">Console shows EFA-only</text>
      <rect className="dv-efa" x="642" y="94" width="228" height="44" rx="6" />
      <text className="dv-t" x="756" y="114">EFA function</text>
      <text className="dv-s" x="756" y="130">1d0f:efa4</text>
      <path className="dv-ar" d="M756,140 L756,152" />
      <rect className="dv-drv" x="642" y="156" width="228" height="34" rx="6" />
      <text className="dv-t" x="756" y="178">efa.ko</text>
      <path className="dv-ar" d="M756,192 L756,204" />
      <rect className="dv-drv" x="642" y="208" width="228" height="52" rx="6" />
      <text className="dv-t" x="756" y="230">ib_device</text>
      <text className="dv-s" x="756" y="248">no IP, not routable</text>
      <rect className="dv-none" x="642" y="282" width="228" height="40" rx="6" />
      <text className="dv-s" x="756" y="300">No ENA function at all.</text>
      <text className="dv-s" x="756" y="315">Still carries SRD traffic.</text>

      <text className="dv-cap" x="450" y="392">
        Device IDs read from ena_pci_tbl and efa_pci_tbl at the pinned commit. Vendor 1d0f is Amazon.
      </text>
    </svg>
  );
}

/**
 * Diagram 2. The payoff. Both drivers push descriptors into the same
 * write-combined BAR. Only the identity of the writer differs.
 */
function WhoHoldsThePenDiagram() {
  return (
    <svg
      viewBox="0 0 900 420"
      role="img"
      aria-labelledby="ena-efa-pen-title"
      style={{ width: '100%', height: 'auto' }}
    >
      <title id="ena-efa-pen-title">
        ENA and EFA push transmit descriptors into the same write-combined memory region on the
        Nitro card, base address register 2 in both drivers. In ENA the kernel driver assembles
        the entry and writes it, so every packet crosses the kernel boundary. In EFA the kernel
        driver maps that same region into the application address space and steps out of the
        data path, so libfabric writes the descriptor directly with no system call. OS bypass is
        this difference and nothing more.
      </title>
      <style>
        {`
          .pn-bg { fill: #ffffff; }
          .pn-app { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .pn-fast { fill: #ecf7ec; stroke: #037f0c; stroke-width: 1.5; }
          .pn-kern { fill: #ffffff; stroke: #ec7211; stroke-width: 1.5; }
          .pn-band { fill: #fdf3ec; stroke: #ec7211; stroke-width: 1.2; stroke-dasharray: 5 4; }
          .pn-card { fill: #f4f4f6; stroke: #414d5c; stroke-width: 1.5; }
          .pn-bar { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .pn-ctl { fill: #f4f4f6; stroke: #879596; stroke-width: 1.2; stroke-dasharray: 5 4; }
          .pn-lane { fill: #0f1b2a; font: 600 13px sans-serif; }
          .pn-t { fill: #0f1b2a; font: 600 12px sans-serif; text-anchor: middle; }
          .pn-s { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .pn-tag { fill: #8b6c00; font: 600 10px sans-serif; letter-spacing: 0.6px; }
          .pn-note { fill: #5f6b7a; font: 11px sans-serif; }
          .pn-cap { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .pn-ar { stroke: #5f6b7a; stroke-width: 1.5; fill: none; marker-end: url(#pn-head); }
          .pn-arg { stroke: #037f0c; stroke-width: 3; fill: none; marker-end: url(#pn-headg); }
          .pn-dash { stroke: #879596; stroke-width: 1.2; fill: none; stroke-dasharray: 4 4; }
          .pn-div { stroke: #d1d5db; stroke-width: 1.2; stroke-dasharray: 5 4; }
        `}
      </style>
      <defs>
        <marker id="pn-head" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="#5f6b7a" />
        </marker>
        <marker id="pn-headg" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M0,0 L7,3.5 L0,7 z" fill="#037f0c" />
        </marker>
      </defs>
      <rect className="pn-bg" x="0" y="0" width="900" height="420" rx="8" />

      {/* Shared destination */}
      <rect className="pn-card" x="666" y="64" width="210" height="292" rx="8" />
      <text className="pn-t" x="771" y="90">NITRO CARD</text>
      <rect className="pn-bar" x="682" y="150" width="178" height="120" rx="6" />
      <text className="pn-t" x="771" y="190">MEM BAR 2</text>
      <text className="pn-s" x="771" y="212">write-combined</text>
      <text className="pn-s" x="771" y="232">descriptor push region</text>
      <text className="pn-s" x="771" y="300">ENA_MEM_BAR = 2</text>
      <text className="pn-s" x="771" y="316">EFA_MEM_BAR = 2</text>
      <text className="pn-s" x="771" y="338">One house convention</text>

      {/* Lane A: ENA */}
      <text className="pn-lane" x="24" y="42">ENA: the kernel driver holds the pen</text>
      <rect className="pn-band" x="164" y="62" width="342" height="88" rx="8" />
      <text className="pn-tag" x="176" y="78">KERNEL SPACE, IN THE DATA PATH</text>
      <rect className="pn-app" x="24" y="88" width="118" height="48" rx="6" />
      <text className="pn-t" x="83" y="110">Application</text>
      <text className="pn-s" x="83" y="128">sockets</text>
      <path className="pn-ar" d="M146,112 L172,112" />
      <rect className="pn-kern" x="176" y="88" width="140" height="48" rx="6" />
      <text className="pn-t" x="246" y="110">Kernel TCP/IP</text>
      <text className="pn-s" x="246" y="128">socket buffers</text>
      <path className="pn-ar" d="M320,112 L346,112" />
      <rect className="pn-kern" x="350" y="88" width="140" height="48" rx="6" />
      <text className="pn-t" x="420" y="110">ena.ko</text>
      <text className="pn-s" x="420" y="128">bounce buffer</text>
      <path className="pn-ar" d="M494,112 L660,112" />
      <text className="pn-s" x="577" y="100">__iowrite64_copy</text>
      <text className="pn-s" x="577" y="132">ena.ko does the write</text>

      <path className="pn-div" d="M16,196 L884,196" />

      {/* Lane B: EFA */}
      <text className="pn-lane" x="24" y="224">EFA: the application holds the pen</text>
      <rect className="pn-fast" x="24" y="246" width="118" height="48" rx="6" />
      <text className="pn-t" x="83" y="268">Application</text>
      <text className="pn-s" x="83" y="286">libfabric</text>
      <path className="pn-ar" d="M146,270 L172,270" />
      <rect className="pn-fast" x="176" y="246" width="180" height="48" rx="6" />
      <text className="pn-t" x="266" y="268">Mapped SQ ring</text>
      <text className="pn-s" x="266" y="286">in the app address space</text>
      <path className="pn-arg" d="M360,270 L658,270" />
      <text className="pn-s" x="509" y="258">store to mapped memory</text>
      <text className="pn-s" x="509" y="290">libfabric does the write</text>
      <path className="pn-dash" d="M266,326 L266,296" />
      <rect className="pn-ctl" x="176" y="326" width="254" height="44" rx="6" />
      <text className="pn-t" x="303" y="346">efa.ko, control path only</text>
      <text className="pn-s" x="303" y="362">efa_user_mmap_entry_insert</text>
      <text className="pn-note" x="444" y="344">Never touched again</text>
      <text className="pn-note" x="444" y="360">once the queue pair exists.</text>

      <text className="pn-cap" x="450" y="404">
        Same destination, same write-combining attribute. The kernel boundary is the only difference.
      </text>
    </svg>
  );
}

/**
 * Diagram 3. The dependency graph, drawn so the "SRD is built on ENA" error
 * has nowhere to hide. SRD is below both devices.
 */
function SrdSubstrateDiagram() {
  return (
    <svg
      viewBox="0 0 880 380"
      role="img"
      aria-labelledby="ena-efa-substrate-title"
      style={{ width: '100%', height: 'auto' }}
    >
      <title id="ena-efa-substrate-title">
        SRD, the Scalable Reliable Datagram transport, lives in the Nitro card below both
        devices. The ENA device consumes it as ENA Express, accelerating ordinary TCP and UDP
        flows with no application change. The EFA device consumes it as a verbs queue pair type
        for libfabric, NCCL and MPI. Both are peer consumers of the same transport, and the
        implementation sits below the PCI boundary in the card.
      </title>
      <style>
        {`
          .sb-bg { fill: #ffffff; }
          .sb-app { fill: #ffffff; stroke: #879596; stroke-width: 1.5; }
          .sb-ena { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .sb-efa { fill: #ecf7ec; stroke: #037f0c; stroke-width: 1.5; }
          .sb-srd { fill: #f4f4f6; stroke: #414d5c; stroke-width: 2; }
          .sb-h { fill: #0f1b2a; font: 600 14px sans-serif; text-anchor: middle; }
          .sb-t { fill: #0f1b2a; font: 600 13px sans-serif; text-anchor: middle; }
          .sb-s { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .sb-tag { fill: #414d5c; font: 600 10px sans-serif; letter-spacing: 0.6px; text-anchor: middle; }
          .sb-side { fill: #5f6b7a; font: 600 11px sans-serif; }
          .sb-cap { fill: #0f1b2a; font: 600 12px sans-serif; text-anchor: middle; }
          .sb-ar { stroke: #414d5c; stroke-width: 2; fill: none; marker-end: url(#sb-head); }
        `}
      </style>
      <defs>
        <marker id="sb-head" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="#414d5c" />
        </marker>
      </defs>
      <rect className="sb-bg" x="0" y="0" width="880" height="380" rx="8" />

      <rect className="sb-app" x="90" y="44" width="300" height="54" rx="6" />
      <text className="sb-t" x="240" y="68">Sockets application</text>
      <text className="sb-s" x="240" y="86">no code change</text>
      <rect className="sb-app" x="490" y="44" width="300" height="54" rx="6" />
      <text className="sb-t" x="640" y="68">libfabric, NCCL, MPI</text>
      <text className="sb-s" x="640" y="86">application must be ported</text>

      <path className="sb-ar" d="M240,100 L240,122" />
      <path className="sb-ar" d="M640,100 L640,122" />

      <rect className="sb-ena" x="90" y="126" width="300" height="84" rx="6" />
      <text className="sb-t" x="240" y="152">ENA device</text>
      <text className="sb-s" x="240" y="172">1d0f:ec20, ena.ko, netdev</text>
      <text className="sb-s" x="240" y="192">ENA Express: TCP and UDP over SRD</text>
      <rect className="sb-efa" x="490" y="126" width="300" height="84" rx="6" />
      <text className="sb-t" x="640" y="152">EFA device</text>
      <text className="sb-s" x="640" y="172">1d0f:efa4, efa.ko, ib_device</text>
      <text className="sb-s" x="640" y="192">EFA_QP_DRIVER_TYPE_SRD queue pairs</text>

      <path className="sb-ar" d="M240,248 L240,214" />
      <path className="sb-ar" d="M640,248 L640,214" />
      <text className="sb-side" x="252" y="236">peer consumer</text>
      <text className="sb-side" x="652" y="236">peer consumer</text>

      <rect className="sb-srd" x="60" y="252" width="760" height="92" rx="8" />
      <text className="sb-tag" x="440" y="274">NITRO CARD, BELOW THE PCI BOUNDARY</text>
      <text className="sb-h" x="440" y="298">SRD (Scalable Reliable Datagram) transport</text>
      <text className="sb-s" x="440" y="318">multipath spray, retransmission, reordering, congestion control</text>
      <text className="sb-s" x="440" y="336">Neither kernel driver contains any SRD implementation</text>

      <text className="sb-cap" x="440" y="368">
        ENA and EFA are peer consumers of the same transport.
      </text>
    </svg>
  );
}

interface DeviceRow {
  device: string;
  ids: string;
  driver: string;
  subsystem: string;
}

const deviceRows: DeviceRow[] = [
  {
    device: 'ENA',
    ids: '0x0051, 0x0ec2 (PF), 0x1ec2 (LLQ PF), 0xec20 (VF), 0xec21 (LLQ VF)',
    driver: 'ena.ko',
    subsystem: 'netdev',
  },
  {
    device: 'EFA',
    ids: '0xefa0, 0xefa1, 0xefa2, 0xefa3, 0xefa4 (all VF)',
    driver: 'efa.ko',
    subsystem: 'RDMA / verbs',
  },
];

interface LadderRow {
  config: string;
  ceiling: string;
  note: string;
}

const ladderRows: LadderRow[] = [
  {
    config: 'Default, outside a cluster placement group',
    ceiling: '5 Gbps',
    note: 'Enforced in the fabric, regardless of host capability.',
  },
  {
    config: 'Inside a cluster placement group',
    ceiling: '10 Gbps',
    note: 'The documented way to double a single flow without changing anything else.',
  },
  {
    config: 'ENA Express',
    ceiling: '25 Gbps',
    note: 'Capped by the aggregate instance limit. Scope is contested, see below.',
  },
  {
    config: 'Multipath TCP across several paths',
    ceiling: 'Higher, by adding flows',
    note: 'Several flows in parallel, each one still policed at its own ceiling.',
  },
];

export function EnaVsEfa() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Two PCI devices on one card: which one an attachment gives you, how to tell them apart, and which to pick."
          >
            ENA and EFA: Two Devices, One Nitro Card
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>
              EFA (Elastic Fabric Adapter) and ENA (Elastic Network Adapter) are two separate PCI
              (Peripheral Component Interconnect) devices, each bound by its own driver into its
              own kernel subsystem.
            </strong>{' '}
            You tell them apart by device ID and by the driver that claims them. The ENA table is a
            mix of PF (Physical Function) and VF (Virtual Function) entries{' '}
            <SourceRef provenance="code-derived" code={code.enaPciIds} />, and ena.ko binds them
            into netdev. The EFA table is all VF entries{' '}
            <SourceRef provenance="code-derived" code={code.efaPciIds} />, and efa.ko binds them
            into the RDMA (Remote Direct Memory Access) subsystem. Each identifier belongs to
            exactly one of the two sets, so lspci with numeric IDs on a running instance tells you
            which of the two devices an attachment gave you. The word doing the damage is
            attachment: one network interface attachment can create two PCI functions, so people
            reason backward from one attachment to one device.
          </Box>

          <OneAttachmentTwoDevicesDiagram />

          <Table
            variant="embedded"
            header={
              <Header variant="h3" description="All vendor 0x1d0f, Amazon. Each identifier belongs to exactly one set.">
                The two device ID sets
              </Header>
            }
            columnDefinitions={[
              {
                id: 'device',
                header: 'Device',
                cell: (item: DeviceRow) => (
                  <Badge color={item.device === 'EFA' ? 'green' : 'blue'}>{item.device}</Badge>
                ),
              },
              { id: 'ids', header: 'PCI device IDs', cell: (item: DeviceRow) => <code>{item.ids}</code> },
              { id: 'driver', header: 'Kernel module', cell: (item: DeviceRow) => <code>{item.driver}</code> },
              { id: 'subsystem', header: 'Kernel subsystem', cell: (item: DeviceRow) => item.subsystem },
            ]}
            items={deviceRows}
          />

          <Box variant="p">
            The subsystem boundary is the part you feel while operating. EFA registers an ib_device
            and sets node_type to RDMA_NODE_UNSPECIFIED, declining to claim it is InfiniBand or
            RoCE{' '}
            <SourceRef provenance="code-derived" code={code.efaIbDevice} />, and grepping the EFA
            sources for net_device, register_netdev and netdev_ops returns zero hits. The EFA device
            exists purely as an ib_device, so everything that hangs off a network interface, a MAC
            address, an IP address, ethtool, belongs to the ENA side of the attachment. An EFA-only
            interface creates no ENA device{' '}
            <SourceRef provenance="documented" doc={docs.efa} />, so on that attachment those tools
            have no netdev to read.
          </Box>

          <ExpandableSection
            headerText="The evidence that these are two independent devices"
            headerDescription="Separate registration, independent builds, and AWS stating the same device count"
          >
            <SpaceBetween size="s">
              <Box variant="p">
                Registration: each driver calls pci_register_driver with its own struct pci_driver
                and its own probe function, ena_probe{' '}
                <SourceRef provenance="code-derived" code={code.enaDriver} /> and efa_probe{' '}
                <SourceRef provenance="code-derived" code={code.efaDriver} />. Code sharing, tested
                in both directions: grepping the EFA sources for includes naming ena and the ENA
                sources for includes naming efa each returns zero hits, and the EFA build is
                self-contained{' '}
                <SourceRef provenance="code-derived" code={code.efaKbuild} />.
              </Box>
              <Box variant="p">
                The directory kernel/linux/common/ena_com is common across the ENA ports for Linux,
                FreeBSD and DPDK. Only the ENA Makefile references it, through ENA_COM_PATH{' '}
                <SourceRef provenance="code-derived" code={code.enaMakefile} />, while the EFA build
                carries its own efa_com, structurally parallel and textually independent{' '}
                <SourceRef provenance="code-derived" code={code.efaKbuild} />.
              </Box>
              <Box variant="p">
                The EC2 User Guide states that an EFA device can be attached in two ways: using a
                traditional EFA interface, also called EFA with ENA, which creates both an EFA
                device and an ENA device, or using an EFA-only interface, which creates just the EFA
                device{' '}
                <SourceRef provenance="code-confirmed" doc={docs.efa} code={code.efaPciIds} />. The
                same page separates EFA traffic from normal IP traffic from the ENA device of an EFA
                interface when it lists limitations{' '}
                <SourceRef provenance="documented" doc={docs.efa} />. Documentation and driver
                tables agree down to the count of devices, so the conflation starts with the reader.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What OS bypass actually is, stated so you can check it in the driver sources yourself."
          >
            Both have a low latency queue. The difference is who holds the pen.
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>
              Both ENA and EFA have an LLQ (Low Latency Queue). Both push transmit descriptors
              into device memory over PCIe. The difference is which side of the kernel boundary
              writes them.
            </strong>{' '}
            Both drivers use the same BAR (Base Address Register) convention: register BAR 0,
            memory BAR 2. ENA defines ENA_REG_BAR 0 and ENA_MEM_BAR 2{' '}
            <SourceRef provenance="code-derived" code={code.enaBars} />. EFA defines EFA_REG_BAR 0
            and EFA_MEM_BAR 2{' '}
            <SourceRef provenance="code-derived" code={code.efaBars} />. Both push into that
            region with write-combining. Then the paths diverge.
          </Box>

          <WhoHoldsThePenDiagram />

          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">ENA: the kernel driver writes</Box>
              <Box variant="p">
                ena.ko maps BAR 2 with devm_ioremap_wc, a write-combined mapping, during probe{' '}
                <SourceRef provenance="code-derived" code={code.enaWcMap} />. On transmit the
                driver assembles the descriptor entry in a host-memory bounce buffer, issues a
                write memory barrier, then blits the whole entry into the device with
                __iowrite64_copy, flipping a phase bit on ring wrap so the device can tell fresh
                entries from stale ones{' '}
                <SourceRef provenance="code-derived" code={code.enaPush} />.
              </Box>
              <Box variant="p">
                Push mode buys one thing: it removes a device-side descriptor fetch. The kernel
                stays where it was. The application makes a system call, the kernel network stack
                processes the packet, and ena.ko writes the descriptor for every packet sent.
              </Box>
            </div>
            <div>
              <Box variant="h3">EFA: the application writes</Box>
              <Box variant="p">
                EFA send-queue descriptors live in the same MEM BAR. The driver computes
                sq-&gt;desc as mem_bar plus llq_descriptors_offset{' '}
                <SourceRef provenance="code-derived" code={code.efaSqDesc} />. Then it hands that
                region to the application: efa_user_mmap_entry_insert creates a mapping with
                attribute EFA_MMAP_IO_WC, write-combined, and returns a key{' '}
                <SourceRef provenance="code-derived" code={code.efaUserMap} />.
              </Box>
              <Box variant="p">
                That key crosses the user ABI (Application Binary Interface) as llq_desc_mmap_key,
                alongside llq_desc_offset{' '}
                <SourceRef provenance="code-derived" code={code.efaAbiKeys} />. libfabric mmaps it
                and writes descriptors straight into the card. efa.ko set the mapping up and left.
              </Box>
            </div>
          </ColumnLayout>

          <Alert type="success" header="OS bypass, read straight out of the driver sources">
            EFA exposes to userspace what ENA keeps in the kernel: a character device, a verbs
            interface, and a mappable doorbell and descriptor ring. That single asymmetry is what
            OS bypass means. The two share a house design language, admin queue abstraction, phase
            bits, BAR 2 push region, write-combining, as separate implementations of it.
          </Alert>

          <ExpandableSection
            headerText="Depth: why write-combining is the load-bearing attribute"
            headerDescription="The reason both drivers ask for the same mapping type"
          >
            <SpaceBetween size="s">
              <Box variant="p">
                A write-combined mapping lets the CPU buffer consecutive stores and emit them as
                one large PCIe transaction instead of many small ones. Without it, a 128-byte
                descriptor entry becomes sixteen separate 8-byte writes across the bus, and push
                mode would be slower than letting the device fetch the descriptor itself.
              </Box>
              <Box variant="p">
                ENA gets it from devm_ioremap_wc in the kernel{' '}
                <SourceRef provenance="code-derived" code={code.enaWcMap} />. EFA gets it from
                EFA_MMAP_IO_WC on the userspace mapping{' '}
                <SourceRef provenance="code-derived" code={code.efaUserMap} />. EFA maps doorbells
                separately as non-cached, because a doorbell is a single write that must land
                immediately rather than sit in a combining buffer. Two mapping types, chosen for
                two access patterns, in one driver.
              </Box>
              <Box variant="p">
                One asymmetry worth knowing on the ENA side: LLQ is transmit only. Receive
                submission queues always run in regular mode, so the device fetches receive
                descriptors from host memory and push mode changes the send path alone.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Where the transport actually lives, and the shipping configuration that shows it."
          >
            SRD sits below both devices
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>
              SRD (Scalable Reliable Datagram) lives in the Nitro card. ENA and EFA are peer
              consumers of it.
            </strong>{' '}
            ENA reaches SRD through ENA Express. EFA reaches SRD as a native queue pair type.
            Both sit above the same transport on the same card, and the implementation itself is
            below the PCI boundary, inside the Nitro card.
          </Box>

          <SrdSubstrateDiagram />

          <Box variant="p">
            Two shipping facts fix SRD below both devices. An EFA-only interface creates an EFA
            device and no ENA device{' '}
            <SourceRef provenance="documented" doc={docs.efa} />, and it still carries SRD traffic,
            so SRD reaches the wire with the ENA device absent in a configuration AWS ships and
            documents. And the ENA driver's entire knowledge of SRD is a read-only statistics
            structure, struct ena_admin_ena_srd_stats, holding four counters{' '}
            <SourceRef provenance="code-derived" code={code.srdStats} />. Retransmission, the
            reliability state machine, congestion control and reordering all live below the PCI
            boundary, in the card. That is why the ethtool counters later in this section are the
            whole of the in-instance view of SRD.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="The baseline the other two are measured against: queue model, interrupt layout, offload list.">
            What ENA actually is
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            ENA registers a net_device and behaves like any modern NIC driver. The model is paired
            submission queue and completion queue per direction, multi-queue on both transmit and
            receive, with doorbells written as plain MMIO stores of the queue tail. The default
            ring size is 1024 entries, with a minimum of 256, and a wide LLQ ring default of 512{' '}
            <SourceRef provenance="code-derived" code={code.enaRings} />.
          </Box>

          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="h3">Interrupts</Box>
              <Box variant="p">
                MSI-X (Message Signaled Interrupts Extended) layout is exactly one admin vector
                plus one vector per I/O queue{' '}
                <SourceRef provenance="code-derived" code={code.enaMsix} />. If the platform grants
                fewer vectors than requested, the driver reduces the queue count to match. Queue
                count is negotiated, not fixed.
              </Box>
            </div>
            <div>
              <Box variant="h3">Moderation</Box>
              <Box variant="p">
                ENA implements DIM (Dynamic Interrupt Moderation) on top of the kernel net_dim
                library{' '}
                <SourceRef provenance="code-derived" code={code.enaDim} />. DIM applies to the
                receive path only: the driver's single adaptive-moderation function is
                ena_adjust_adaptive_rx_intr_moderation, which calls net_dim_get_rx_moderation.
              </Box>
            </div>
            <div>
              <Box variant="h3">Offloads</Box>
              <Box variant="p">
                All stateless and per-packet: IPv4 and IPv6 checksum, TSO (TCP Segmentation
                Offload), scatter-gather, RSS (Receive Side Scaling) receive hashing, and n-tuple
                flow steering{' '}
                <SourceRef provenance="code-derived" code={code.enaOffloads} />. RSS is the one that
                comes back below, as a cap on a single flow. XDP (eXpress Data Path) is supported:
                an eBPF hook that runs inside the kernel, with the kernel still in the path.
              </Box>
            </div>
          </ColumnLayout>

          <Alert type="warning" header="Receive aggregation is GRO, done in software">
            The receive path calls napi_gro_receive, the Linux stack entry point for GRO (Generic
            Receive Offload), which aggregates after delivery on the host CPU{' '}
            <SourceRef provenance="code-derived" code={code.enaGro} />. Secondary write-ups
            routinely credit ENA with hardware LRO (Large Receive Offload) instead. A grep for lro
            across the ENA and common driver trees returns zero hits beyond incidental substring
            matches on tailroom, and the tree carries no NETIF_F_LRO feature bit and no hardware
            coalescing path. Code is the authority: budget host cycles for receive aggregation.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="SRD under your existing sockets code: what it buys, what it costs, and how to confirm it is carrying traffic."
          >
            ENA Express
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>
              ENA Express puts TCP and UDP (User Datagram Protocol) flows onto SRD with no
              application change.
            </strong>{' '}
            AWS states it increases the maximum bandwidth a single flow can use from 5 Gbps up to
            25 Gbps, reduces tail latency between instances in the same Availability Zone,
            detects and avoids congested network paths, and handles packet reordering on the
            receiving end plus most retransmits in the network layer{' '}
            <SourceRef provenance="documented" doc={docs.enaExpress} />. You keep sockets. That is
            the entire point.
          </Box>

          <Alert type="info" header="The same AWS guide documents a median latency cost">
            In the same guide: during periods of time when network traffic is light, you might
            notice a slight increase in median packet latency, tens of microseconds, when the
            packet uses ENA Express{' '}
            <SourceRef provenance="documented" doc={docs.enaExpress} />. AWS follows it with a
            note that applications with high packets-per-second requirements needing to optimize
            for latency during uncongested periods may be better served by plain enhanced
            networking. SRD is a congestion play, and it costs tens of microseconds at idle.
          </Alert>

          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Enable it from the control plane</Box>
              <Box variant="p">
                ENA Express is configured on the ENI (Elastic Network Interface) attachment
                through the EC2 control plane, and the driver observes the result.
                ena_com_get_ena_srd_info reaches SRD through exactly one path, the statistics
                admin command ENA_ADMIN_GET_STATS_TYPE_ENA_SRD{' '}
                <SourceRef provenance="code-derived" code={code.srdGet} />, and the tree carries
                no ena_com_set_ena_srd counterpart. Reading is the whole of the driver's access.
              </Box>
              <Box variant="p">
                Any in-instance command you find for ENA Express is tuning: MTU (Maximum
                Transmission Unit), queue sizes, byte queue limits.
              </Box>
            </div>
            <div>
              <Box variant="h3">Three configuration bits</Box>
              <Box variant="p">
                The configuration bitmap carries ENA_ADMIN_ENA_SRD_ENABLED, then
                ENA_ADMIN_ENA_SRD_UDP_ENABLED, then ENA_ADMIN_ENA_SRD_UDP_ORDERING_BYPASS_ENABLED{' '}
                <SourceRef provenance="code-derived" code={code.srdFlags} />. The third one is the
                interesting one. It controls whether the device restores UDP ordering on receive
                or hands packets up out of order. That is an ordering-semantics knob, and it is
                the one place the sockets path offers the choice EFA makes natively.
              </Box>
              <Box variant="p">
                The enum comment reads ENA SRD configuration for ENI. This is attachment-level
                state. Detach the interface and the setting goes with it.
              </Box>
            </div>
          </ColumnLayout>

          <Alert type="warning" header="Set the interface MTU to 8900 or lower, and set it yourself for UDP">
            <SpaceBetween size="xs">
              <Box variant="p">
                AWS documents the requirement without the number: ENA Express requires a lower MTU
                than the default to accommodate additional AWS SRD headers, newly established TCP
                connections automatically clamp the MSS (Maximum Segment Size) to mitigate this,
                but UDP traffic still requires a lower MTU{' '}
                <SourceRef provenance="documented" doc={docs.enaExpress} />.
              </Box>
              <Box variant="p">
                The number comes from AWS's own checker script:
                MTU_RECOMMENDED_MAX is 8900 and MTU_RECOMMENDED_MIN is 8800{' '}
                <SourceRef provenance="code-derived" code={code.mtuCheck} />. So the MTU must be
                8900 or lower, down from the 9001 jumbo default, and going below 8800 costs
                bandwidth. TCP clamps its own MSS on new connections. For UDP the interface MTU is
                yours to set, and an application left at 9001 gets no warning from anything inside
                the instance.
              </Box>
            </SpaceBetween>
          </Alert>

          <Alert type="warning" header="Pick one: large LLQ or a deep transmit ring">
            Large LLQ raises the descriptor entry size from 128 to 256 bytes so tunneled packets
            fit their headers, and the hardware pays for it by halving the transmit ring from 1024
            entries to 512{' '}
            <SourceRef provenance="code-derived" code={code.enaRings} />. ENA Express wants a deep
            transmit ring. AWS's own checker script verifies both, that the transmit queue size is
            large enough and that the ENA module parameter keeps large LLQ available{' '}
            <SourceRef provenance="documented" doc={docs.enaExpress} />. The two pull against each
            other, so choose on traffic shape: tunneled packets need the wider descriptor, ENA
            Express needs the depth.
          </Alert>

          <ExpandableSection
            headerText="Confirm ENA Express is carrying the traffic, with the counters"
            headerDescription="Fallback is silent and bilateral, so the counters are the only ground truth"
          >
            <SpaceBetween size="s">
              <Box variant="p">
                AWS states that if ENA Express is not operating on both the sending and receiving
                instance, the communication falls back to standard ENA transmission{' '}
                <SourceRef provenance="documented" doc={docs.enaExpress} />. The fallback is
                silent: standard TCP, no error and no log line, and bandwidth that stays where it
                was. Asymmetric configuration is subtler still: two instances can both use ENA
                Express for TCP while UDP between them falls back, because only one of them
                enabled UDP.
              </Box>
              <Box variant="p">
                The driver exposes the counters through ethtool, gated on the SRD info capability{' '}
                <SourceRef provenance="code-derived" code={code.srdEthtool} />. The flags word is
                surfaced as a pseudo-statistic named ena_srd_mode.
              </Box>
              <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>
                {String.raw`# Ground truth for whether ENA Express is engaged on this interface.
ethtool -S eth0 | grep ena_srd

# ena_srd_mode                  configuration bitmap, as three flags
# ena_srd_tx_pkts               packets that actually rode SRD
# ena_srd_eligible_tx_pkts      packets that could have
# ena_srd_rx_pkts               packets received over SRD
# ena_srd_resource_utilization  percentage of SRD resources in use

# The ratio that matters. If tx_pkts is far below eligible_tx_pkts,
# traffic is silently falling back to standard ENA.`}
              </pre>
              <Box variant="p">
                One caveat on the last counter. ena_srd_resource_utilization is commented only as
                a percentage of the ENA SRD resources that is in use{' '}
                <SourceRef provenance="code-derived" code={code.srdStats} />. Which resource, and
                what action a high value should trigger, is stated nowhere in code or
                documentation. Watch it. Do not yet interpret it.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="What caps a single flow at 5 Gbps, and which of the three caps each fix removes.">
            Bandwidth reality
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            AWS defines a single flow as a unique 5-tuple TCP or UDP flow, and for protocols such
            as GRE or IPsec, the 3-tuple of source IP, destination IP and next protocol{' '}
            <SourceRef provenance="documented" doc={docs.bandwidth} />. The per-flow ceiling is the
            number that surprises people, because it is unrelated to the instance aggregate.
          </Box>

          <Table
            variant="embedded"
            header={<Header variant="h3">The single-flow ladder</Header>}
            columnDefinitions={[
              { id: 'config', header: 'Configuration', cell: (item: LadderRow) => item.config },
              {
                id: 'ceiling',
                header: 'Single-flow ceiling',
                cell: (item: LadderRow) => <strong>{item.ceiling}</strong>,
              },
              { id: 'note', header: 'Note', cell: (item: LadderRow) => item.note },
            ]}
            items={ladderRows}
            footer={
              <Box variant="small" color="text-body-secondary">
                All four rows sourced from the EC2 instance network bandwidth guide{' '}
                <SourceRef provenance="documented" doc={docs.bandwidth} />.
              </Box>
            }
          />

          <Box variant="h3">Three independent caps on a single flow</Box>
          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="p">
                <strong>1. Per-flow policing.</strong> The 5 Gbps and 10 Gbps ceilings are enforced
                in the fabric{' '}
                <SourceRef provenance="documented" doc={docs.bandwidth} />. Host capability is
                irrelevant. A 100 Gbps instance still gets 5 Gbps on one default flow.
              </Box>
            </div>
            <div>
              <Box variant="p">
                <strong>2. Single-queue serialization.</strong> RSS hashes the 5-tuple in the
                device and steers the flow to one receive ring{' '}
                <SourceRef provenance="code-derived" code={code.enaOffloads} />. Each ring is
                serviced by one MSI-X vector on one CPU{' '}
                <SourceRef provenance="code-derived" code={code.enaMsix} />. One flow lands on one
                core, and the driver cannot spread it because the hash is computed in hardware.
              </Box>
            </div>
            <div>
              <Box variant="p">
                <strong>3. Single-path routing.</strong> A conventional flow follows one path
                through the fabric. Its throughput is bounded by the most congested link on that
                one path.
              </Box>
            </div>
          </ColumnLayout>

          <Alert type="info" header="ENA Express fixes two of the three">
            It raises the ceiling and it sprays across paths, so causes 1 and 3 improve. Cause 2
            is untouched. The flow still lands on one receive queue on one core. This is exactly
            why AWS warns that high packets-per-second workloads may prefer plain enhanced
            networking{' '}
            <SourceRef provenance="documented" doc={docs.enaExpress} />: SRD adds per-packet work
            without removing the single-queue bottleneck. The general escape is more flows, or
            more interfaces.
          </Alert>

          <Box variant="h3">What multiple network cards buy you</Box>
          <Box variant="p">
            Instance types that support multiple network cards can be configured with one EFA per
            network card, and all other supported types support only one EFA per instance{' '}
            <SourceRef provenance="documented" doc={docs.efa} />. More cards raise the aggregate
            ceiling and give more independent paths into the fabric. The per-flow ceiling stays
            exactly where it was.
          </Box>
          <Box variant="p">
            Spreading across those cards is yours to arrange. ena_probe and efa_probe each bind
            one PCI function to one independent device instance{' '}
            <SourceRef provenance="code-derived" code={code.enaDriver} />, and amzn-drivers carries
            no driver-level link aggregation. At the host that means Linux bonding or ECMP
            (Equal-Cost Multi-Path); in the application it means opening more flows. For EFA,
            libfabric enumerates several domains and leaves the striping to the caller.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="What the sources leave unsettled, and the experiment that would close each. Do not size anything on them."
          >
            Three questions that stay open
          </Header>
        }
      >
        <SpaceBetween size="s">
          <ExpandableSection
            headerText="Is the ENA Express 25 Gbps figure same-Availability-Zone or same-Region?"
            headerDescription="Two AWS pages, two different scopes, both first-party"
          >
            <SpaceBetween size="s">
              <Box variant="p">
                The instance network bandwidth guide says, verbatim: configure ENA Express for
                eligible instances within the same Availability Zone to achieve up to 25 Gbps
                between those instances{' '}
                <SourceRef provenance="documented" doc={docs.bandwidth} />.
              </Box>
              <Box variant="p">
                The ENA Express guide says, verbatim: increases the maximum bandwidth a single
                flow can use from 5 Gbps up to 25 Gbps within the same Region, up to the aggregate
                instance limit. It reserves the same-Availability-Zone language for the tail
                latency benefit instead{' '}
                <SourceRef provenance="documented" doc={docs.enaExpress} />.
              </Box>
              <Box variant="p">
                These cannot both be the scope, and the driver cannot break the tie, because it
                only reads counters{' '}
                <SourceRef provenance="code-derived" code={code.srdGet} />. If you are sizing on the
                25 Gbps figure across Availability Zones, confirm it before you build on it.
              </Box>
            </SpaceBetween>
          </ExpandableSection>

          <ExpandableSection
            headerText="Do the five EFA PCI IDs map to EFA v1 through v4?"
            headerDescription="Five identifiers, four named generations, and no source stating the mapping"
          >
            <Box variant="p">
              The table defines five IDs, PCI_DEV_ID_EFA0_VF through PCI_DEV_ID_EFA4_VF{' '}
              <SourceRef provenance="code-derived" code={code.efaPciIds} />, while AWS names four
              EFA generations across four Nitro versions{' '}
              <SourceRef provenance="documented" doc={docs.efa} />. The tempting reading is that
              0xefa0 is EFA v1 and so on. No source in the repository states that mapping, and five
              identifiers against four named generations does not reconcile cleanly under any
              obvious rule, so do not infer a generation from a device ID. Running lspci with
              numeric IDs on a current-generation instance would settle it.
            </Box>
          </ExpandableSection>

          <ExpandableSection
            headerText="Can ENA Express run on the ENA half of an EFA attachment?"
            headerDescription="The drivers have no set path, so an API experiment is what settles it"
          >
            <Box variant="p">
              An EFA with ENA attachment has both devices{' '}
              <SourceRef provenance="documented" doc={docs.efa} />, and ENA Express is an
              attachment-level setting{' '}
              <SourceRef provenance="code-derived" code={code.srdFlags} />. Whether the EC2 control
              plane permits enabling ENA Express on the ENA half of an EFA-type interface is
              visible nowhere in the drivers, because the drivers have no SET path at all{' '}
              <SourceRef provenance="code-derived" code={code.srdGet} />, and the fetched
              documentation does not address it. Settling it needs an API experiment against an
              efa-type interface, not more reading.
            </Box>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Four axes that decide it: latency, CPU cost, ordering, programming model.">
            Choosing between them
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            ENA Express is SRD with EFA's programming model left out: you keep sockets and pay a
            small uncongested-latency tax. EFA is SRD with the kernel left out: you get the lowest
            latency and adopt libfabric, giving up IP addressing, routing and cross-zone reach.
            Plain ENA is the baseline both are measured against.
          </Box>

          <ColumnLayout columns={3} variant="text-grid">
            <div>
              <Box variant="h3">
                Plain ENA <Badge color="blue">default</Badge>
              </Box>
              <Box variant="p">
                <strong>Latency:</strong> better median than ENA Express while the network is
                quiet, which is why AWS points packets-per-second workloads back to plain enhanced
                networking{' '}
                <SourceRef provenance="documented" doc={docs.enaExpress} />. Worst under
                congestion, because one path plus TCP backoff.
              </Box>
              <Box variant="p">
                <strong>CPU cost:</strong> full kernel stack per packet, amortized by GRO.
              </Box>
              <Box variant="p">
                <strong>Ordering:</strong> TCP ordered, UDP unordered.
              </Box>
              <Box variant="p">
                <strong>Programming model:</strong> sockets. Crosses Availability Zones, routable,
                gets an IP address.
              </Box>
            </div>
            <div>
              <Box variant="h3">
                ENA Express <Badge color="green">no code change</Badge>
              </Box>
              <Box variant="p">
                <strong>Latency:</strong> better tail under load. Slightly worse median when
                uncongested, tens of microseconds{' '}
                <SourceRef provenance="documented" doc={docs.enaExpress} />.
              </Box>
              <Box variant="p">
                <strong>CPU cost:</strong> the same kernel stack cost as plain ENA, plus SRD work
                done in the card.
              </Box>
              <Box variant="p">
                <strong>Ordering:</strong> TCP ordered, reordering restored in the card. UDP
                optionally delivered out of order through the bypass flag{' '}
                <SourceRef provenance="code-derived" code={code.srdFlags} />.
              </Box>
              <Box variant="p">
                <strong>Programming model:</strong> sockets, unchanged. Enabled only from the
                control plane. MTU 8900 or lower.
              </Box>
            </div>
            <div>
              <Box variant="h3">
                EFA <Badge color="green">lowest latency</Badge>
              </Box>
              <Box variant="p">
                <strong>Latency:</strong> best of the three, because the application writes the
                descriptor itself and the kernel sits outside the data path entirely.
              </Box>
              <Box variant="p">
                <strong>CPU cost:</strong> lowest of the three. A send is a store into mapped
                memory, and the SRD protocol work happens in the card.
              </Box>
              <Box variant="p">
                <strong>Ordering:</strong> out-of-order delivery is the native model.
                EFA_QP_DRIVER_TYPE_SRD is the only driver queue pair type defined{' '}
                <SourceRef provenance="code-derived" code={code.efaQpType} />. Ordering is the
                application or middleware problem.
              </Box>
              <Box variant="p">
                <strong>Programming model:</strong> libfabric, NCCL, MPI or NIXL. The device
                carries no IP address and no route, and its reach stops at the Availability Zone
                boundary{' '}
                <SourceRef provenance="documented" doc={docs.efa} />.
              </Box>
            </div>
          </ColumnLayout>

          <Box variant="p">
            Start from the programming model, because it is the axis that decides the other three.
            Sockets keep you on plain ENA or ENA Express, and the choice between those two is
            whether your traffic spends its time congested. Code you can port to libfabric, NCCL,
            MPI or NIXL puts EFA on the table, and from there the latency and CPU numbers follow.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
