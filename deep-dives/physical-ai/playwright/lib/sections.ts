/**
 * The 26 sections of the Physical AI deep dive, in nav order.
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
  { id: 'one-loop', title: '1. One Robot, One Loop' },
  { id: 'getting-started', title: '2. Getting Started' },
  { id: 'robot-computer', title: '3. The Robot as a Computer' },
  { id: 'demonstrations', title: '4. Learning From Demonstrations' },
  { id: 'vla', title: '5. Vision-Language-Action Models' },
  { id: 'world-models', title: '6. World Models: Predicting What Happens Next' },
  { id: 'jepa', title: '7. JEPA: Predicting in Latent Space' },
  { id: 'robot-rl', title: '8. Reinforcement Learning for Robots' },
  { id: 'collecting', title: '9. Collecting Data' },
  { id: 'curating', title: '10. Processing and Curating' },
  { id: 'augmentation', title: '11. Augmentation and Synthetic Data' },
  { id: 'physics', title: '12. Physics Simulation' },
  { id: 'rendering', title: '13. Rendering and Ray Tracing' },
  { id: 'sim-to-real', title: '14. Sim-to-Real and Real-to-Sim' },
  { id: 'training-scales', title: '15. Training at Three Scales' },
  { id: 'evaluation', title: '16. Evaluation' },
  { id: 'on-robot', title: '17. Running on the Robot' },
  { id: 'fleet', title: '18. The Fleet' },
  { id: 'agents', title: '19. Agents Running the Loop' },
  { id: 'workloads', title: '20. Fifteen Workloads, Five Shapes' },
  { id: 'pmu-cards', title: '21. Reading a Machine: PMU Cards' },
  { id: 'measurements', title: '22. Our Measurements' },
  { id: 'price-performance', title: '23. Price-Performance and Latency' },
  { id: 'aws-orchestration', title: '24. Orchestrating It on AWS' },
  { id: 'choosing', title: '25. Choosing' },
  { id: 'sources', title: '26. Glossary and Sources' },
];
