# References awaiting review

Read each sentence against the section list and confirm the number points to the section it means.

| # | Section | Title |
|---|---|---|
| 1 | 1 | One Loop: What It Learns From and Where It Keeps It |
| 2 | 2 | Getting Started |
| 3 | 3 | Fine-Tuning Techniques: Where the Learning Signal Comes From |
| 4 | 4 | Learning From Answers: Supervised Fine-Tuning & Distillation |
| 5 | 5 | The Language Model Is Already a Policy |
| 6 | 6 | Policy Gradient |
| 7 | 7 | Two Leashes: PPO's Clip & the KL |
| 8 | 8 | Learning From Preferences: Reward Models, RLHF & DPO |
| 9 | 9 | RLVR & GRPO |
| 10 | 10 | What RL Does to a Model |
| 11 | 11 | Distillation or RL: A Teacher's Answers or a Score on Your Own |
| 12 | 12 | Agentic RL |
| 13 | 13 | The Reward Is a Proxy |
| 14 | 14 | A Text Loop Is RL on the Context |
| 15 | 15 | Verbal Reinforcement & Self-Correction |
| 16 | 16 | Memories, Playbooks & Skill Libraries |
| 17 | 17 | Optimising the Prompt |
| 18 | 18 | Your Loops Through the RL Lens |
| 19 | 19 | Hybrids |
| 20 | 20 | Where Words Fall Short |
| 21 | 21 | What Lives in Weights & What Lives in Context |
| 22 | 22 | An RL Step Is an Inference Job Inside a Training Job |
| 23 | 23 | Cost per Improvement |
| 24 | 24 | Side by Side on a DGX Spark |
| 25 | 25 | Choosing a Technique: Fine-Tuning, a Text Loop or a Hybrid |
| 26 | 26 | Fine-Tuning & Learning Loops on AWS |
| 27 | 27 | Glossary & Sources |

- OneLoop.tsx:264 [4, 10, 21] Some old ability is forgotten, more the more training changes what the model would write compared with its base; RL changes it less than SFT does (sections 4, 10 and 21)'
- OneLoop.tsx:566 [5, 13] s comparisons to score answers), a program, an environment or a judge (sections 5 to 13).
- OneLoop.tsx:574 [3, 11] s judgement of each token the model wrote itself: on-policy distillation: the model writes its own answer and the stronger model rates each of its tokens, so it takes its samples from RL and its targets from distillation (sections 3 and 11).
- GettingStarted.tsx:534 [5, 8] The RL vocabulary on tokens, sections 5 to 8: the policy; the policy gradient, the basic rule for turning a score into a weight change; the clip of PPO (Proximal Policy Optimization), which stops pushing a token's probability further once training has moved it a set fraction from where it started; the KL penalty, a charge for drifting from the model the run
- FineTuningSignals.tsx:957 [4] Section 4 shows the other half of the push: with the same multiplier, a token the model found unlikely moves further.
- LearningFromAnswers.tsx:950 [11] s likeliest tokens instead [cite] ; section 11 shows why most on-policy distillation recipes choose it.
- LearningFromAnswers.tsx:1110 [11] A stronger model you may train on: section 11 shows when distilling it beats RL, as it did for DeepSeek on a 32B base with the 800,000 samples built during R1's training.
- DistillationOrRl.tsx:763 [4] s distillation trainer by default, is the KL divergence of section 4, taken at each position of the student's own answer, with the student first: loss = average over answers y sampled from pi_student, of sum over t of KL(pi_student || pi_teacher) at position t Here p
