/**
 * Reader-facing title for each section file, so the sources appendix can say
 * where a source is cited in the words the side navigation uses. The numbers
 * stay in App.tsx; this map carries titles only, so reordering the navigation
 * does not need an edit here. src/__tests__/sections.test.tsx checks that
 * every section file has an entry.
 */
export const sectionTitles: Record<string, string> = {
  ThesisAndFraming: 'Thesis and Framing',
  HeterogeneityFact: 'The Heterogeneity Fact',
  RooflineAndArithmeticIntensity: 'Roofline and Arithmetic Intensity',
  MemoryHierarchyPrimer: 'Memory Hierarchy Primer',
  KernelExecutionLifecycle: 'Anatomy of a Kernel Execution',
  HbmAndBandwidthWall: 'HBM and the Bandwidth Wall',
  MainMemoryAndCxl: 'DDR5, MRDIMM, LPDDR5X and CXL',
  HighBandwidthFlash: 'High Bandwidth Flash',
  FlashCacheTier: 'Flash as a Cache Tier for Inference',
  ChipletAndInterconnect: 'Chiplet and Interconnect',
  GravitonDeepDive: 'Graviton Deep Dive',
  AmdEpycTurin: 'AMD EPYC Turin',
  IntelXeon6: 'Intel Xeon 6',
  NvidiaHopper: 'NVIDIA Hopper: H100 and H200',
  NvidiaBlackwell: 'NVIDIA Blackwell: B200 and B300',
  GraceBlackwellUltraServer: 'Grace-Blackwell and UltraServer',
  EdgeSharedMemorySilicon: 'Edge Shared-Memory Silicon: DGX Spark and Jetson',
  NvidiaCompilersAndTooling: 'NVIDIA Compilers and Kernel Tooling',
  AwsCustomSilicon: 'AWS Trainium, Inferentia and Neuron',
  AwsCompilersAndTooling: 'AWS Compilers and Kernel Tooling',
  CerebrasWaferScale: 'Cerebras Wafer-Scale',
  GroqSambanovaDataflow: 'Groq, SambaNova and Dataflow',
  ComputeInMemory: 'Compute-in-Memory',
  KvCacheAndFlashAttention: 'KV Cache and FlashAttention',
  MoeAndSparseActivation: 'Mixture of Experts and Sparse Activation',
  SmallLanguageModels: 'Small Language Models',
  QuantizationAndPrecision: 'Quantization and Precision',
  DisaggregatedServingAndSpeculative: 'Disaggregated Serving and Speculative Decoding',
  CommunicationAndScaleOut: 'Communication and Scale-Out',
  IsolationNie: 'Isolation: NIE and MIG',
  DeterminismAOT: 'Determinism: NEFF and GPU Reproducibility',
  CapitalMarketsLens: 'Capital Markets Lens',
  GlossaryAndSources: 'Glossary and Sources',
};
