# Claims: section 1, One Robot, One Loop

claim | register ID

The standard setup is two arms: a leader a person moves by hand and a follower that copies it | F01-2
The SO-101 follower has six motors; five position the arm and the sixth opens and closes the gripper (the split is our reading) | F01-8
The SO-101 examples use two cameras, one on the wrist and one on top | F01-30
An episode frame holds joint readings (observation.state), motor commands (action) and one image entry per camera | F01-26
The loop has eight stages: collect, process and curate, augment, simulate, train the policy, train the world model, evaluate, export and deploy | F08-75
A machine has parts that fill separately: CPU cores, memory bandwidth, GPU tensor cores, GPU ray-tracing cores, GPU video engines, GPU memory (our reading) | F08-50
Diagram tags, stage 1 Collect: CPU cores (record and encode, row 1) | F08-76
Diagram tags, stage 2 Process and curate: CPU cores or the GPU's decode engines (row 2) | F08-76
Diagram tags, stage 3 Augment: CPU cores per GPU in the dataloader (row 4); GPU memory for generative augmentation (row 13) | F08-76
Diagram tags, stage 4 Simulate: CPU cores for the physics step (row 5); ray-tracing cores for RTX-rendered cameras (row 7) | F08-76
Diagram tags, stage 5 Train a policy: GPU tensor cores with GPU memory as the gate (row 8) | F08-76
Diagram tags, stage 6 Train a world model: GPU tensor cores (row 9) | F08-76
Diagram tags, stage 7 Evaluate: a mix of physics, cameras and policy inference (row 10) | F08-76
Diagram tags, stage 8 Export and deploy: GPU tensor cores on a shared-memory machine, memory bandwidth the shared part (row 12) | F08-76
Splitting the eight stages by machine part gives twelve workloads runnable for one arm, plus three known at vendor scale: fifteen (our reading) | F08-75
The part picks the machine; the shape (duration, coupling, interruptibility) picks how it is bought and scheduled; short independent units are interruptible, robot-clock jobs are not (our reading) | F08-78
