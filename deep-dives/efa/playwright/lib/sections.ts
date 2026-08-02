/**
 * The 20 sections of the EFA deep dive, in nav order.
 *
 * This list is duplicated from src/App.tsx on purpose. Playwright generates
 * one report row per section before the page is open, so it needs the list at
 * module load. gate-routes compares this list against the nav that the app
 * actually renders and fails on any drift, so the duplicate cannot rot
 * silently: add a section to App.tsx without adding it here and gate-routes
 * says so by name.
 */
export interface SectionRef {
  id: string;
  title: string;
}

export const SECTIONS: SectionRef[] = [
  { id: 'overview', title: 'What is EFA?' },
  { id: 'datapath', title: 'The Data Path: OS-Bypass End to End' },
  { id: 'srd', title: 'SRD: The Transport Protocol' },
  { id: 'device', title: 'The EFA Device: Attachment, Cards and Rails' },
  { id: 'libfabric', title: 'libfabric and the EFA Provider' },
  { id: 'ena', title: 'ENA and EFA: Two Devices, One Nitro Card' },
  { id: 'topology', title: 'The EC2 Instance Topology API' },
  { id: 'instances', title: 'Instance Support Matrix' },
  { id: 'nccl', title: 'NCCL over EFA: the aws-ofi-nccl Plugin' },
  { id: 'training', title: 'AI/ML Training' },
  { id: 'inference', title: 'AI/ML Inference' },
  { id: 'hpc', title: 'Traditional HPC' },
  { id: 'storage', title: 'Storage Data Paths: FSx, S3 and the CRT' },
  { id: 'comparison', title: 'EFA vs Alternatives' },
  { id: 'eks', title: 'EFA on Amazon EKS' },
  { id: 'sagemaker', title: 'EFA on SageMaker and HyperPod' },
  { id: 'operations', title: 'Operations, Observability and Failure Modes' },
  { id: 'pricing', title: 'Pricing Analysis' },
  { id: 'decision', title: 'Decision Guide' },
  { id: 'sources', title: 'Sources' },
];
