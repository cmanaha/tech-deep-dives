/**
 * The 30 sections of the Physical AI deep dive, in nav order.
 *
 * This list is duplicated from src/App.tsx on purpose. Playwright generates
 * one report row per section before the page is open, so it needs the list at
 * module load. gate-routes compares this list against the nav that the app
 * actually renders and fails on any drift, so the duplicate cannot rot
 * silently.
 */
export interface SectionRef {
  id: string;
  title: string;
}

export const SECTIONS: SectionRef[] = [
  { id: 'one-loop', title: '1. Fifteen Computing Jobs Behind One Robot Arm: Where Each One Should Run' },
  { id: 'getting-started', title: '2. Getting Started: The Key Ideas and Where to Begin' },
  { id: 'robot-computer', title: '3. The Robot as a Computer: Inputs, Outputs and a Deadline' },
  { id: 'demonstrations', title: '4. Learning From Demonstrations: Why Simple Copying Fails and How Current Policies Fix It' },
  { id: 'vla', title: '5. Vision-Language-Action Models: How They Are Built and What Their Specs Mean' },
  { id: 'world-models', title: '6. World Models: Predicting Video Frames or a Compact Summary' },
  { id: 'jepa', title: '7. JEPA: Predicting in Latent Space' },
  { id: 'robot-rl', title: '8. Reinforcement Learning for Robots: Training in Simulation and on the Real Arm' },
  { id: 'collecting', title: '9. Collecting Data: Episode Size and Video Compression' },
  { id: 'curating', title: '10. Processing and Curating: How Many CPU Cores Keep a Training GPU Fed' },
  { id: 'augmentation', title: '11. Augmentation and Synthetic Data: Three Ways to Get More Training Data' },
  { id: 'physics', title: '12. Physics Simulation: When to Use CPU Cores and When to Use a GPU' },
  { id: 'rendering', title: '13. Rendering and Ray Tracing: Why Simulated Cameras Need GPUs With RT Cores' },
  { id: 'sim-to-real', title: '14. Sim-to-Real and Real-to-Sim: Making a Policy Trained in Simulation Work on the Real Arm' },
  { id: 'training-scales', title: '15. Training at Three Scales: One GPU, One Node, Many Nodes' },
  { id: 'evaluation', title: '16. Evaluation: Measuring Success Rates and How Many Trials You Need' },
  { id: 'on-robot', title: '17. Running on the Robot: Controlling the Arm With a Model Slower Than Its Control Loop' },
  { id: 'fleet', title: '18. The Fleet: Deploying Policies to Many Robots and Collecting Their Data' },
  { id: 'agents', title: '19. Agents Running the Loop: What a Coding Agent Can Control and How Its Work Is Checked' },
  { id: 'workloads', title: '20. The Fifteen Workloads: Bottlenecks and Workload Types' },
  { id: 'pmu-cards', title: '21. Reading a Machine: Using Hardware Counters to Find the Bottleneck' },
  { id: 'measurements', title: '22. Our Measurements: Three Test Programs on Two Edge Computers' },
  { id: 'price-performance', title: '23. Price-Performance and Latency: Comparing Machines on the Same Unit of Work' },
  { id: 'aws-orchestration', title: '24. Orchestrating Physical AI on AWS: Which Service Runs Each Workload' },
  { id: 'aws-batch', title: '25. AWS Batch: A Managed Queue for Independent Jobs' },
  { id: 'aws-pcs', title: '26. AWS Parallel Computing Service: Managed Slurm for Multi-Node Jobs' },
  { id: 'hyperpod', title: '27. Amazon SageMaker HyperPod: A Long-Running Cluster That Recovers From Node Failures' },
  { id: 'eks', title: '28. Amazon EKS: Running GPU Jobs on Kubernetes' },
  { id: 'choosing', title: '29. Choosing: From a Workload to an Instance, a Scheduler and a Purchase Option' },
  { id: 'sources', title: '30. Glossary and Sources' },
];
