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

- OneLoop.tsx:14 [10] ; /* ------------------------------------------------------------------------ */ /* Sources */ /* ------------------------------------------------------------------------ */ /** Reasoning with Sampling (power sampling), the figure section 10 owns.
- OneLoop.tsx:47 [3, 13] sections 3 to 13'
- OneLoop.tsx:53 [14, 18] sections 14 to 18'
- OneLoop.tsx:59 [19] large one, section 19'
- OneLoop.tsx:246 [22, 23] A training run, paid once; generation takes most of each step (sections 22 and 23)'
- OneLoop.tsx:248 [23] Little up front: attempts sampled and scored, plus the calls that write the update (section 23)'
- OneLoop.tsx:249 [19] An RL run on the small model only; the large model is reached through its API (section 19)'
- OneLoop.tsx:254 [23] The cost of serving the model it trained (section 23)'
- OneLoop.tsx:256 [23] The tokens the update adds to every query, part of which prompt caching takes back (section 23)'
- OneLoop.tsx:258 [19] s context (section 19)", }, { id: 'keep'
- OneLoop.tsx:264 [4, 10, 21] Some old ability is forgotten, more the further training moves the model from its base; RL moves it less than SFT does (sections 4, 10 and 21)'
- OneLoop.tsx:266 [16, 21] Every old ability once the text is removed, since the weights never move; the text can be read, edited and removed, and a store fed misleading feedback degrades (sections 16 and 21)'
- OneLoop.tsx:267 [19] s weights move (section 19)", }, { id: 'learn'
- OneLoop.tsx:273 [10, 11, 21] What must be fast, calibrated or general: sharpening toward answers the model can already give, and new reasoning skill through distillation from a stronger model (sections 10, 11 and 21)'
- OneLoop.tsx:275 [16, 17, 21] What is specific, recent and auditable: instructions, procedures and facts (sections 16, 17 and 21)'
- OneLoop.tsx:276 [19] Behaviour that changes from input to input, for a large model you cannot train (section 19)'
- OneLoop.tsx:345 [3] Section 3 maps every fine-tuning technique by where its signal comes from.
- OneLoop.tsx:387 [6, 7] Sections 6 and 7 build PPO, and section 9 builds GRPO.
- OneLoop.tsx:388 [9] Sections 6 and 7 build PPO, and section 9 builds GRPO.
- OneLoop.tsx:396 [15] Reflexion has the model write a short lesson in plain words after a failed attempt and puts that lesson into the context of the next attempt (section 15).
- OneLoop.tsx:401 [17] Each new candidate is a rewrite of a parent chosen from the best so far, as in a genetic algorithm, and every candidate that is best on at least one example stays available as a parent, which is what Pareto refers to (section 17).
- OneLoop.tsx:411 [19] s weights change (section 19).
- OneLoop.tsx:423 [4] The weights hold SFT and distillation, which train on written answers (section 4), and the comparison of distillation with RL (section 11); policy gradient, the basic rule for turning scores into weight changes that PPO and GRPO build on (section 6); PPO's limits on each step (section 7); RLHF (RL from human feedback) and DPO (Direct Preference Optimization), which learn from pairs of responses wher
- OneLoop.tsx:424 [11] The weights hold SFT and distillation, which train on written answers (section 4), and the comparison of distillation with RL (section 11); policy gradient, the basic rule for turning scores into weight changes that PPO and GRPO build on (section 6); PPO's limits on each step (section 7); RLHF (RL from human feedback) and DPO (Direct Preference Optimization), which learn from pairs of responses where one was judged better (section 8); GRPO and its succes
- OneLoop.tsx:425 [6] The weights hold SFT and distillation, which train on written answers (section 4), and the comparison of distillation with RL (section 11); policy gradient, the basic rule for turning scores into weight changes that PPO and GRPO build on (section 6); PPO's limits on each step (section 7); RLHF (RL from human feedback) and DPO (Direct Preference Optimization), which learn from pairs of responses where one was judged better (section 8); GRPO and its successors, scored by a program that checks each answer (section 9); agentic RL, where one attempt is a whole multi-tu
- OneLoop.tsx:426 [7] s limits on each step (section 7); RLHF (RL from human feedback) and DPO (Direct Preference Optimization), which learn from pairs of responses where one was judged better (section 8); GRPO and its successors, scored by a program that checks each answer (section 9); agentic RL, where one attempt is a whole multi-turn task in which the model calls tools, as i
- OneLoop.tsx:428 [8] s limits on each step (section 7); RLHF (RL from human feedback) and DPO (Direct Preference Optimization), which learn from pairs of responses where one was judged better (section 8); GRPO and its successors, scored by a program that checks each answer (section 9); agentic RL, where one attempt is a whole multi-turn task in which the model calls tools, as in Search-R1 (a model trained to use a search engine while it reasons) and DeepSWE (a coding agent) (section 12); and SCoRe (Self-Correction via Reinf
- OneLoop.tsx:429 [9] s limits on each step (section 7); RLHF (RL from human feedback) and DPO (Direct Preference Optimization), which learn from pairs of responses where one was judged better (section 8); GRPO and its successors, scored by a program that checks each answer (section 9); agentic RL, where one attempt is a whole multi-turn task in which the model calls tools, as in Search-R1 (a model trained to use a search engine while it reasons) and DeepSWE (a coding agent) (section 12); and SCoRe (Self-Correction via Reinforcement Learning), which trains a model to correct its own answers (section 15).
- OneLoop.tsx:431 [12] pairs of responses where one was judged better (section 8); GRPO and its successors, scored by a program that checks each answer (section 9); agentic RL, where one attempt is a whole multi-turn task in which the model calls tools, as in Search-R1 (a model trained to use a search engine while it reasons) and DeepSWE (a coding agent) (section 12); and SCoRe (Self-Correction via Reinforcement Learning), which trains a model to correct its own answers (section 15).
- OneLoop.tsx:432 [15] each answer (section 9); agentic RL, where one attempt is a whole multi-turn task in which the model calls tools, as in Search-R1 (a model trained to use a search engine while it reasons) and DeepSWE (a coding agent) (section 12); and SCoRe (Self-Correction via Reinforcement Learning), which trains a model to correct its own answers (section 15).
- OneLoop.tsx:438 [15] The context holds reflection and self-critique, where the model critiques its own output in words and tries again: Reflexion and Self-Refine (section 15).
- OneLoop.tsx:441 [16] It holds memories, playbooks and skill libraries, which keep lessons, procedures or code from past attempts and add them to later prompts: ExpeL, ACE (Agentic Context Engineering), Dynamic Cheatsheet, Voyager and Training-Free GRPO, a text loop named after the RL method (section 16).
- OneLoop.tsx:442 [17] It holds prompt optimisers, GEPA among them (section 17).
- OneLoop.tsx:446 [18] And it holds loops you may already run: Ralph, the same prompt fed to a coding agent in an endless loop, and autoresearch, an agent that runs experiments by following written instructions, beside FunSearch and AlphaEvolve, which have a model propose programs and keep the ones an evaluator scores best (section 18).
- OneLoop.tsx:452 [19] A small trained model holds Advisor Models and Retroformer, which train the model that writes the advice or the reflection, and Memento, which trains the part that retrieves past cases from a bank and shows them to the large model (section 19).
- OneLoop.tsx:520 [3] <Container header={ <Header variant="h2" description="Name the signal you have, and the family of techniques that learns from it follows; section 3 maps each one" > Where the signal comes from } > In every store the signal decides whether anything is learned, and fine-tuning techniques differ first in where it comes from.
- OneLoop.tsx:535 [3] Seven sources run through the dive, each with the section that covers it: Raw text from your domain: continued pretraining, next-token training on documents with no instructions (section 3).
- OneLoop.tsx:539 [4] Example answers someone wrote: SFT (section 4).
- OneLoop.tsx:543 [4] s answers: distillation (section 4), and set against RL in section 11.
- OneLoop.tsx:543 [11] s answers: distillation (section 4), and set against RL in section 11.
- OneLoop.tsx:549 [4, 6] s own attempts, kept when a grader passes them: rejection-sampling fine-tuning, which is SFT on the passing attempts (sections 4 and 6).
- OneLoop.tsx:556 [8] Pairs of answers where one was judged better: RLHF and DPO (section 8).
- OneLoop.tsx:562 [5, 13] s own attempts: RL, scored by a reward model, a program, an environment or a judge (sections 5 to 13).
- OneLoop.tsx:570 [3, 11] s judgement of each token the model wrote itself: on-policy distillation, which takes its samples from RL and its targets from distillation (sections 3 and 11).
- OneLoop.tsx:578 [3] The same signals feed the loops that keep their lesson in the context, and section 3 sets every signal against every store in one grid.
- OneLoop.tsx:579 [25] The second of section 25's three decision questions starts here: what signal do you have? Five questions,
- OneLoop.tsx:600 [4, 11] Which fine-tuning technique fits the signal you have? Section 3, Fine-Tuning Techniques: Where the Learning Signal Comes From, then sections 4 and 11.
- OneLoop.tsx:603 [25] Section 25 adds what the model scores on your grader today.
- OneLoop.tsx:619 [10] Which part of that can a loop reproduce in words? The closing block of section 10, then sections 14 to 19, from A Text Loop Is RL on the Context to Hybrids.
- OneLoop.tsx:619 [14, 19] Which part of that can a loop reproduce in words? The closing block of section 10, then sections 14 to 19, from A Text Loop Is RL on the Context to Hybrids.
- OneLoop.tsx:632 [21] Where do the words fall short? Section 20, Where Words Fall Short, with reasoning skill in section 21 and behaviour that varies from input to input in section 19.
- OneLoop.tsx:633 [19] Where do the words fall short? Section 20, Where Words Fall Short, with reasoning skill in section 21 and behaviour that varies from input to input in section 19.
- OneLoop.tsx:648 [2] Your next step: section 2, Getting Started, gives the five ideas to hold and the shortest reading route for the reason you are here.
- OneLoop.tsx:650 [27] If you came with one of the five questions, go straight to its section; section 27, Glossary & Sources, catches any term you meet out of order.
- GettingStarted.tsx:33 [22] */ const ROUTE_SECTIONS: Record = { loops: [1, 2, 3, 5, 10, 13, 14, 15, 16, 17, 18, 19, 20, 21, 23, 25], advisor: [1, 2, 3, 5, 9, 10, 11, 13, 17, 19, 20, 21, 23, 25, 26], rl: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], finetune: [1, 2, 3, 4, 5, 8, 9, 10, 11, 13, 23, 25, 26], }; /** Section 22 is the optional systems coda of the RL route.
- GettingStarted.tsx:250 [1, 2] Sections 1 and 2 frame the dive.
- GettingStarted.tsx:251 [3, 4] Five stages then run in order: where the signal comes from (sections 3 and 4), the RL vocabulary on tokens (5 to 8), what RL with a program as grader does to a model, set against distillation (9 to 13), the same loop with the context as the parameter (14 to 19), and the comparison, the cost and the choice (20 to 26), which builds on stage 3 directly as well as on stage 4.
- GettingStarted.tsx:258 [1, 2, 3, 5, 10, 13, 21, 23, 25] L, the route for readers who run agent loops and want them to learn: sections 1, 2, 3, 5, 10, 13 to 21, 23 and 25.
- GettingStarted.tsx:260 [1, 2, 3, 5, 9, 10, 11, 13, 17, 19, 20, 21, 23, 25, 26] A, the route for readers who advise a team choosing between reinforcement fine-tuning and prompting: sections 1, 2, 3, 5, 9, 10, 11, 13, 17, 19, 20, 21, 23, 25 and 26.
- GettingStarted.tsx:261 [2, 13] R, the route for readers who want RL properly: sections 2 to 13 in order, with section 22 optional, drawn as a dashed mark.
- GettingStarted.tsx:262 [22] R, the route for readers who want RL properly: sections 2 to 13 in order, with section 22 optional, drawn as a dashed mark.
- GettingStarted.tsx:263 [1, 2, 3, 4, 5, 8, 9, 10, 11, 13, 23, 25, 26] F, the route for readers choosing a fine-tuning technique: sections 1, 2, 3, 4, 5, 8, 9, 10, 11, 13, 23, 25 and 26.
- GettingStarted.tsx:263 [24] Section 24 is on no shorter route.
- GettingStarted.tsx:419 [4] Two mechanics carry the rest: the gradient step, which section 4 builds where SFT (supervised fine-tuning) first needs it and the training dive, section 3: One Training Step: What It Computes and Keeps follows onto the hardware, and the cost of the context, which every call pays again and the vLLM div
- GettingStarted.tsx:430 [27] If a shorter route brings you to a term out of order, section 27, Glossary & Sources, lists every acronym the dive uses and its reading list, grouped by authority.
- GettingStarted.tsx:472 [5] <IdeaCard title="Advantage" where="Defined in section 5; section 6, Policy Gradient, shows the two ways to estimate it." > How much better or worse an attempt did than expected.
- GettingStarted.tsx:472 [6] <IdeaCard title="Advantage" where="Defined in section 5; section 6, Policy Gradient, shows the two ways to estimate it." > How much better or worse an attempt did than expected.
- GettingStarted.tsx:483 [9] Section 9, RLVR & GRPO (RL with verifiable rewards, and Group Relative Policy Optimization), introduces the program as grader; section 13, The Reward Is a Proxy, shows how to build one that holds up under optimisation.
- GettingStarted.tsx:496 [5] <IdeaCard title="pass@k and the capability boundary" where="pass@k is defined in section 5; section 10, What RL Does to a Model, defines the boundary and reads both as a curve." > pass@1 is how often one sample succeeds, and pass@k is whether any of k samples does; averaged over problems, it is the share solved within k tries.
- GettingStarted.tsx:524 [3, 4] Where the signal comes from, sections 3 and 4: the map of fine-tuning techniques by signal source, then the two that learn from written answers, SFT and distillation.
- GettingStarted.tsx:526 [4] Section 4 builds the gradient step, the log-probability of a token and the KL (Kullback-Leibler) divergence, a number for how different two next-token distributions are, because SFT and distillation are where the dive first needs them.
- GettingStarted.tsx:534 [5, 8] The RL vocabulary on tokens, sections 5 to 8: the policy; the policy gradient, the basic rule for turning a score into a weight change; the clip of PPO (Proximal Policy Optimization), a limit on how far one round of training can move the model; the KL penalty, a charge for drifting from the model the run started from; and learning from preferences, where a reward
- GettingStarted.tsx:545 [9, 13] What RL with a program as grader does to a model, sections 9 to 13, including what a frozen model can buy back without training (the close of section 10), how it compares with distilling a stronger model (section 11), and ending on the reward as a proxy (section 13).
- GettingStarted.tsx:546 [10] What RL with a program as grader does to a model, sections 9 to 13, including what a frozen model can buy back without training (the close of section 10), how it compares with distilling a stronger model (section 11), and ending on the reward as a proxy (section 13).
- GettingStarted.tsx:547 [11] What RL with a program as grader does to a model, sections 9 to 13, including what a frozen model can buy back without training (the close of section 10), how it compares with distilling a stronger model (section 11), and ending on the reward as a proxy (section 13).
- GettingStarted.tsx:548 [13] What RL with a program as grader does to a model, sections 9 to 13, including what a frozen model can buy back without training (the close of section 10), how it compares with distilling a stronger model (section 11), and ending on the reward as a proxy (section 13).
- GettingStarted.tsx:553 [14, 19] The same loop rebuilt with the context as the trainable parameter, sections 14 to 19: the text a loop writes plays the part the weights play in RL.
- GettingStarted.tsx:558 [20, 26] The comparison, the cost and the choice, sections 20 to 26.
- GettingStarted.tsx:563 [6] The two answer-based techniques come before RL because RL reads most easily as their extension: section 6 builds the policy gradient as fine-tuning on the model's own samples, weighted by their score.
- GettingStarted.tsx:571 [9] s full title is "Reflexion: Language Agents with Verbal Reinforcement Learning" [cite] , and Training-Free GRPO is named in full "Training-Free Group Relative Policy Optimization", after the RL algorithm of section 9 [cite] .
- GettingStarted.tsx:575 [10] The capability result in section 10 comes before the words track because it sets what a loop would have to reproduce.
- GettingStarted.tsx:576 [13] Section 13 previews the words track: its second half already uses Ralph, autoresearch and Reflexion, and points ahead to the sections that introduce them.
- GettingStarted.tsx:604 [1, 2, 3, 5, 10, 13, 21, 23, 25] "I run agent loops and want them to learn": sections 1, 2, 3, 5, 10, 13 to 21, 23 and 25.
- GettingStarted.tsx:613 [1, 2, 3, 5, 9, 10, 11, 13, 17, 19, 20, 21, 23, 25, 26] "I advise a team choosing between reinforcement fine-tuning and prompting": sections 1, 2, 3, 5, 9, 10, 11, 13, 17, 19, 20, 21, 23, 25, 26.
- GettingStarted.tsx:621 [2, 13] "I want RL properly": sections 2 to 13 in order, with section 22, An RL Step Is an Inference Job Inside a Training Job, as an optional coda on the systems side.
- GettingStarted.tsx:630 [1, 2, 3, 4, 5, 8, 9, 10, 11, 13, 23, 25, 26] "I want to choose a fine-tuning technique": sections 1, 2, 3, 4, 5, 8, 9, 10, 11, 13, 23, 25, 26.
- GettingStarted.tsx:636 [19] Section 19, Hybrids, is section 1's third store, a small trained model; section 24 runs on a DGX Spark, NVIDIA's desktop machine.
- GettingStarted.tsx:637 [1] Section 19, Hybrids, is section 1's third store, a small trained model; section 24 runs on a DGX Spark, NVIDIA's desktop machine.
- GettingStarted.tsx:637 [24] s third store, a small trained model; section 24 runs on a DGX Spark, NVIDIA's desktop machine.
- GettingStarted.tsx:648 [25] Where a section on a shorter route names a method from a section you skipped, look for a one-clause gloss with a pointer beside it, as when section 25 introduces GEPA as "Genetic-Pareto, the reflective prompt optimiser of section 17".
- GettingStarted.tsx:649 [17] Where a section on a shorter route names a method from a section you skipped, look for a one-clause gloss with a pointer beside it, as when section 25 introduces GEPA as "Genetic-Pareto, the reflective prompt optimiser of section 17".
- GettingStarted.tsx:658 [3, 5] Sections 3 and 5, on every route.
- GettingStarted.tsx:660 [3] Section 3 is the map of signal sources that section 25's second question forks into.
- GettingStarted.tsx:660 [25] Section 3 is the map of signal sources that section 25's second question forks into.
- GettingStarted.tsx:661 [5] Section 5 defines the policy, the reward, the advantage and pass@k, and its closing block is the bridge that section 14 builds the words track on.
- GettingStarted.tsx:662 [14] Section 5 defines the policy, the reward, the advantage and pass@k, and its closing block is the bridge that section 14 builds the words track on.
- GettingStarted.tsx:666 [10] Section 10, on every route.
- GettingStarted.tsx:668 [21] Section 21 points to it for sharpening, section 23's calculator takes sampling more at query time from it, and section 25 caps that option at the base model's own pass@k with a pointer back to it.
- GettingStarted.tsx:668 [23] Section 21 points to it for sharpening, section 23's calculator takes sampling more at query time from it, and section 25 caps that option at the base model's own pass@k with a pointer back to it.
- GettingStarted.tsx:669 [25] s calculator takes sampling more at query time from it, and section 25 caps that option at the base model's own pass@k with a pointer back to it.
- GettingStarted.tsx:674 [13] Section 13, on every route.
- GettingStarted.tsx:676 [18] Section 18's hardening checklist starts with its grader checks, and section 25 sends a gap with no trustworthy signal back to its four checks.
- GettingStarted.tsx:676 [25] s hardening checklist starts with its grader checks, and section 25 sends a gap with no trustworthy signal back to its four checks.
- GettingStarted.tsx:681 [9, 26] Sections 9 and 26, on the advisor and fine-tuning routes.
- GettingStarted.tsx:683 [25] Section 25 relies on section 9 to turn today's base rate, the share of attempts the model passes now, into the expected share of training groups that carry no learning signal: when every attempt in a group gets the same score, no attempt did better or worse than the others, every advantage is 0, and the group adds nothing to the
- GettingStarted.tsx:683 [9] Section 25 relies on section 9 to turn today's base rate, the share of attempts the model passes now, into the expected share of training groups that carry no learning signal: when every attempt in a group gets the same score, no attempt did better or worse than the others, every advantage is 0, and the group adds nothing to the reward-driven part of
- GettingStarted.tsx:688 [25] Section 25 also names the AWS service for each path and leaves the detail to section 26.
- GettingStarted.tsx:689 [26] Section 25 also names the AWS service for each path and leaves the detail to section 26.
- GettingStarted.tsx:693 [4, 8, 11] Sections 4, 8 and 11, on the fine-tuning route.
- GettingStarted.tsx:695 [4] Section 4 builds SFT and distillation, section 8 the techniques that learn from pairs of answers, and section 11 sets distillation against RL, the fork section 25 sends a gap in reasoning skill to.
- GettingStarted.tsx:695 [8] Section 4 builds SFT and distillation, section 8 the techniques that learn from pairs of answers, and section 11 sets distillation against RL, the fork section 25 sends a gap in reasoning skill to.
- GettingStarted.tsx:696 [11] Section 4 builds SFT and distillation, section 8 the techniques that learn from pairs of answers, and section 11 sets distillation against RL, the fork section 25 sends a gap in reasoning skill to.
- GettingStarted.tsx:696 [25] Section 4 builds SFT and distillation, section 8 the techniques that learn from pairs of answers, and section 11 sets distillation against RL, the fork section 25 sends a gap in reasoning skill to.
- FineTuningSignals.tsx:782 [1] Section 1 sorted learning by where it is kept.
- FineTuningSignals.tsx:797 [1] The section maps them, shows the one update they share, reads four published training recipes as sequences of signals, and ends by setting each signal against the three stores of section 1.
- FineTuningSignals.tsx:832 [21] No later section covers it; section 21 takes up facts in the weights against facts in the context.
- FineTuningSignals.tsx:842 [4] Section 4.
- FineTuningSignals.tsx:848 [4, 11] Sections 4 and 11.
- FineTuningSignals.tsx:855 [4, 6] Sections 4 and 6.
- FineTuningSignals.tsx:860 [8] Section 8.
- FineTuningSignals.tsx:866 [5, 13] Sections 5 to 13; section 10 shows what it changes in a model.
- FineTuningSignals.tsx:866 [10] Sections 5 to 13; section 10 shows what it changes in a model.
- FineTuningSignals.tsx:878 [11] Section 11.
- FineTuningSignals.tsx:890 [14] These are two ways to check a score, inside the score row, and section 14 uses them to place the loops that keep their lesson in the context.
- FineTuningSignals.tsx:912 [6] Section 6 shows how RL turns that one score into a push on every token of the answer.
- FineTuningSignals.tsx:918 [5] s own attempts, so it trains on what the model actually does; section 5 names the two cases off-policy and on-policy.
- FineTuningSignals.tsx:933 [11] Section 11 sets the two against each other with measured costs.
- FineTuningSignals.tsx:965 [4] Section 4 writes the form as a formula and opens a table of the choices, one row per technique, which grows through sections 6 to 8.
- FineTuningSignals.tsx:966 [6, 8] Section 4 writes the form as a formula and opens a table of the choices, one row per technique, which grows through sections 6 to 8.
- FineTuningSignals.tsx:1050 [11] Section 11 builds on-policy distillation and sets it against RL.
- FineTuningSignals.tsx:1063 [4] The same 800,000 samples, used for SFT alone, made the R1-Distill models of section 4.
- FineTuningSignals.tsx:1072 [11] Section 11 uses its comparison of the two.
- FineTuningSignals.tsx:1160 [1] Section 1 named three places to keep a lesson: the weights, the context a frozen model reads, and a small trained model that writes context for a large one.
- FineTuningSignals.tsx:1163 [14, 19] The loops of sections 14 to 19 fill the other two from the same signals: a score on an attempt can update the weights through RL, or a playbook the next attempt reads.
- FineTuningSignals.tsx:1167 [17] Two names in the grid are new here, both prompt optimisers of section 17.
- FineTuningSignals.tsx:1186 [25] Section 25 walks that choice in full; for a written answer or a teacher, read on to section 4, and for a grader alone, section 4 and then section 5.
- FineTuningSignals.tsx:1187 [4] Section 25 walks that choice in full; for a written answer or a teacher, read on to section 4, and for a grader alone, section 4 and then section 5.
- FineTuningSignals.tsx:1187 [4] Section 25 walks that choice in full; for a written answer or a teacher, read on to section 4, and for a grader alone, section 4 and then section 5.
- FineTuningSignals.tsx:1187 [5] Section 25 walks that choice in full; for a written answer or a teacher, read on to section 4, and for a grader alone, section 4 and then section 5.
- LearningFromAnswers.tsx:372 [6] Section 6 adds REINFORCE, rejection sampling and RLOO or GRPO; sections 7 and 8 add PPO and DPO.
- LearningFromAnswers.tsx:372 [7, 8] Section 6 adds REINFORCE, rejection sampling and RLOO or GRPO; sections 7 and 8 add PPO and DPO.
- LearningFromAnswers.tsx:432 [6] {t} ))} ))} ))} Section 6 adds REINFORCE, rejection sampling and RLOO or GRPO; sections 7 and 8 add PPO and DPO ); } /* ------------------------------------------------------------------------ */ /* Diagram: rejection-sampling fine-tuning */ /* ------------------------------------------------------------------------ */ const RS_PASS = [
- LearningFromAnswers.tsx:432 [7, 8] {t} ))} ))} ))} Section 6 adds REINFORCE, rejection sampling and RLOO or GRPO; sections 7 and 8 add PPO and DPO ); } /* ------------------------------------------------------------------------ */ /* Diagram: rejection-sampling fine-tuning */ /* ------------------------------------------------------------------------ */ const RS_PASS = [true, false, false, true, false, false, true, false]; function
- LearningFromAnswers.tsx:519 [6] SFT batch: answers 1, 4, 7 weight 1 on every token, the same loss as SFT Section 6 keeps the failed answers too, with a negative weight: that step is RL's policy gradient.
- LearningFromAnswers.tsx:581 [5] The letter pi stands for the model read as a probability distribution; section 5 gives it its RL name, the policy.
- LearningFromAnswers.tsx:722 [6] Section 6 adds the one rule of calculus the dive needs, about the gradient of a logarithm, with numbers, where RL first relies on it.
- LearningFromAnswers.tsx:762 [11] Section 11 sets that recipe against RL on the same base.
- LearningFromAnswers.tsx:878 [5] The temperature of a sampling call, the setting section 5 describes, is the same division.
- LearningFromAnswers.tsx:946 [11] s likeliest tokens instead [cite] ; section 11 shows why on-policy distillation uses it.
- LearningFromAnswers.tsx:946 [7] Section 7 reuses the same number for a different job: there the reference point is a frozen copy of the model the run started from, and the KL measures how far training has moved the model away from it.
- LearningFromAnswers.tsx:976 [19, 21, 25] Sections 19, 21 and 25 use it to move a text loop's lesson into the weights.
- LearningFromAnswers.tsx:981 [20] s logged learning histories, and the student learns to improve in context the way the algorithm improved; section 20 covers it.
- LearningFromAnswers.tsx:988 [8] BOND (Best-of-N Distillation): the teacher is best-of-n sampling, picking the best of n answers with a reward model, and the student learns to produce that choice in one try; section 8 places it in Gemma 3's recipe.
- LearningFromAnswers.tsx:1048 [6] Section 6 changes the weight: every sampled answer stays, weighted by how much better or worse than expected it scored, so a failed answer is pushed down as well as a good one pushed up.
- LearningFromAnswers.tsx:1092 [26] Section 26 has the limits, the prices and the services side by side.
- LearningFromAnswers.tsx:1102 [11] A stronger model you may train on: section 11 shows when distilling it beats RL, as it did for DeepSeek on a 32B base with 800,000 teacher samples.
- LearningFromAnswers.tsx:1103 [5] Only a grader: go on to section 5, where the model's own attempts and one score per attempt replace the written answer.
- LanguageModelAsPolicy.tsx:306 [4] Section 4 trained a model on answers someone else wrote: SFT makes a fixed answer more likely, token by token.
- LanguageModelAsPolicy.tsx:501 [4] Section 4 built the KL divergence, section 7 puts this penalty to work, and the last part of this section reads that code.
- LanguageModelAsPolicy.tsx:501 [7] Section 4 built the KL divergence, section 7 puts this penalty to work, and the last part of this section reads that code.
- PolicyGradient.tsx:385 [4] As in section 4, weight in the header above, the diagrams and the tables means the multiplier on a sample, how hard one update pushes on it; where the text means the parameters, it says the model's weights.
- PolicyGradient.tsx:392 [4] PPO (Proximal Policy Optimization) and GRPO (Group Relative Policy Optimization), the two RL algorithms this dive keeps returning to, both update a model this way, and so does SFT (section 4), with every sample's weight set to 1 [cite] .
- PolicyGradient.tsx:414 [4] The section ends on the gradient table section 4 opened with SFT and distillation, and adds REINFORCE, rejection-sampling fine-tuning (section 4's SFT on the model's own answers that passed a check) and RLOO (REINFORCE Leave-One-Out) or GRPO.
- PolicyGradient.tsx:415 [4] The section ends on the gradient table section 4 opened with SFT and distillation, and adds REINFORCE, rejection-sampling fine-tuning (section 4's SFT on the model's own answers that passed a check) and RLOO (REINFORCE Leave-One-Out) or GRPO.
- PolicyGradient.tsx:438 [5] In the formula, pi(y | x) is the probability the current model gives response y to prompt x (section 5's π), log is the logarithm, grad is the gradient with respect to the model's weights (section 4), and pi(.
- PolicyGradient.tsx:439 [4] s weights (section 4), and pi(.
- PolicyGradient.tsx:452 [4] grad log pi(y | x) is a gradient in section 4's sense, one entry for every weight of the model, pointing the way that most increases the probability of producing y again, and the update moves along it in proportion to the reward that followed [cite] .
- PolicyGradient.tsx:464 [4] A rule of calculus, the one section 4 promised, says the gradient of log pi(y | x) is the gradient of pi(y | x) divided by pi(y | x) itself: the same direction, scaled up by one over the probability.
- TwoLeashes.tsx:716 [4] The tether needs a number for how far the model has drifted from where it started, and section 4 built it: the KL divergence between two next-token distributions, zero where they agree and larger the more they differ, in the formula KL(P || Q) = sum over x of P(x) * log(P(x) / Q(x)) The reference point switches here.
- TwoLeashes.tsx:723 [4] In section 4's distillation, Q was a teacher the student should move toward.
- TwoLeashes.tsx:727 [4] The direction is the trained model first, the reverse KL of section 4.
- PreferencesToRewards.tsx:623 [6, 7] <Container header={ <Header variant="h2" description="Add DPO to the five rows of sections 6 and 7, and see it as the one method in the table that pushes a response down without sampling from the model it trains" > The gradient table, complete } > Section 4 opened the gradient table with SFT and distillation, and sections 6 and 7 added REIN
- PreferencesToRewards.tsx:631 [4] Section 4 opened the gradient table with SFT and distillation, and sections 6 and 7 added REINFORCE, rejection-sampling fine-tuning, RLOO (REINFORCE Leave-One-Out) or GRPO (Group Relative Policy Optimization), and PPO, whose weight is the advantage (how much better an attempt did than expected) estimated with GAE (Generalized Advantage Estimation) fr
- PreferencesToRewards.tsx:631 [6, 7] Section 4 opened the gradient table with SFT and distillation, and sections 6 and 7 added REINFORCE, rejection-sampling fine-tuning, RLOO (REINFORCE Leave-One-Out) or GRPO (Group Relative Policy Optimization), and PPO, whose weight is the advantage (how much better an attempt did than expected) estimated with GAE (Generalized Advantage Estimation) from the critic.
- PreferencesToRewards.tsx:896 [26] Section 26, Fine-Tuning & Learning Loops on AWS, maps the options.
- WhatRlDoes.tsx:510 [3] In one small study (Qwen2.5-7B-Instruct trained with GRPO through a LoRA adapter, section 3, on 200 problems, 100 test problems per category, k up to 64), tool-use RL on multi-hop search ended above the base at large k, 0.81 against 0.77 at k = 64, a margin of about four problems, and the gap widened as k grew Pass@(k,T), Sections 3 and 4.2
- DistillationOrRl.tsx:485 [5, 13] on-policy if the teacher shares your tokenizer RL sections 5 to 13 {/* Q1 to the three outcomes */} 0%
- DistillationOrRl.tsx:574 [4] Section 4 built distillation and sections 5 to 10 built RL; this section sets them against each other.
- DistillationOrRl.tsx:574 [5, 10] Section 4 built distillation and sections 5 to 10 built RL; this section sets them against each other.
- DistillationOrRl.tsx:580 [10] A grader gives one score per attempt, and RL mostly makes the student do more often what it already sometimes does; section 10 read that in the pass@k curves.
- DistillationOrRl.tsx:610 [4] Distillation needs a teacher whose terms let you train on its output (section 4 lists the main providers' terms) and one teacher answer per training example.
- DistillationOrRl.tsx:678 [10] Section 10 read what that run did to the pass@k curve.
- DistillationOrRl.tsx:695 [10] Section 10 read RL's pass@k curve: above the base at small k, below it at large k, which says RL mostly reweights paths the base could already sample.
- DistillationOrRl.tsx:708 [3] The mechanism is the one section 3 drew as dense against sparse.
- DistillationOrRl.tsx:726 [4] s answers is SFT, so our reading is that it pays the SFT side of that trade; section 4 has the numbers.
- DistillationOrRl.tsx:755 [4] The loss is the KL divergence of section 4, taken at each position of the student's own answer, with the student first: loss = average over answers y sampled from pi_student, of sum over t of KL(pi_student || pi_teacher) at position t Here p
- DistillationOrRl.tsx:769 [4] The direction, student first, is the reverse KL of section 4, and it makes the student concentrate on what the teacher rates likely.
- DistillationOrRl.tsx:780 [6] s advantage, the per-token weight of section 6, to minus the reverse KL estimated on the token the student sampled [cite] : advantage_t = log pi_teacher(y_t | x, y_&lt;t) - log pi_
- DistillationOrRl.tsx:793 [3] As an illustration, in section 3's wrong answer the student gives "42" probability 0.6 and the teacher 0.1: the advantage is ln 0.1 - ln 0.6 = -2.30 + 0.51 = -1.79, and the step pushes "42" down hard.
- DistillationOrRl.tsx:869 [3] That is the order the 2026 recipes of section 3 follow: RL trains specialists, and on-policy distillation merges them into one model.
- DistillationOrRl.tsx:894 [7, 8] s GRPO and DPO trainers, beta is the weight of the KL penalty of sections 7 and 8.
- DistillationOrRl.tsx:905 [26] Section 26 has the services.
- DistillationOrRl.tsx:944 [12] Your next step is to measure your base model on your grader before choosing either; section 12 takes RL to agents that act over many turns, where a teacher is often missing and the grader is the environment.
- AgenticRl.tsx:924 [26] Section 26, Fine-Tuning & Learning Loops on AWS, covers the service.
- TextLoopAsRl.tsx:912 [3] The second axis is how a score is checked, the split section 3 drew inside its score row.
- TextLoopAsRl.tsx:914 [3] A survey of agent adaptation calls this axis the signal source; this dive keeps that name for section 3's wider map, so here it is the way the score is checked: execution-grounded (the result of a tool call or code run: tests, a compiler, an environment) or output-evaluated (a score on the final output: an exact-match check against a gold answer, a rubric, or a judge) Adap
- PromptOptimization.tsx:507 [4] That is distillation into the context: section 4's distillation writes a stronger model's answers into the weights, and here the stronger model's judgement ends up in the prompt the cheap model reads.
- WeightsVsContext.tsx:404 [4] Distil the settled text (section 4); keep the part still changing in context.'
- WeightsVsContext.tsx:425 [11] Look for a stronger teacher first; section 11 sets distillation against RL, and section 10 covers the debate.'
- WeightsVsContext.tsx:425 [10] Look for a stronger teacher first; section 11 sets distillation against RL, and section 10 covers the debate.'
- WeightsVsContext.tsx:805 [4] Across RL and SFT (supervised fine-tuning, training on target answers token by token), the degree of forgetting was determined by the distributional shift, measured as section 4's KL divergence between the fine-tuned and the base model on the new task [cite] .
- RlStepAsSystem.tsx:369 [11] On-policy distillation (section 11) is the exception: the student generates its own attempts every step as in RL, and the teacher reads them, so in our reading this section applies to it, with the teacher in the place of the reference model.
- Choosing.tsx:304 [23] Can you touch the weights, and how many queries will it serve? API access only, or weights you own; section 23 prices the volume {/* Six of the seven paths (SFT sits behind the near-0% exit) */} {CT_LEAVES.map((pair, lane) => pair.map((leaf, side) => { const x = leafX(lane, side); const cx = x + CT_LEAF_W / 2; return ( <line x1={cx} y1={q3Bottom} x2={cx} y2={CT
- Choosing.tsx:494 [3] Name the signal first, as a row of section 3's map, because the row picks the family of technique.
- Choosing.tsx:495 [4] Written answers you trust lead to SFT (section 4).
- Choosing.tsx:496 [4, 11] A stronger model whose output you may train on leads to distillation (sections 4 and 11).
- Choosing.tsx:497 [8] Pairs of answers where one was judged better lead to DPO or RLHF (section 8).
- Choosing.tsx:636 [26] <Container header={ <Header variant="h2" description="Match your three answers to a path, and find the AWS service that runs it, detailed in section 26" > Seven paths, and the AWS service for each } > Each path names the answers that lead to it and, in one phrase, the AWS service that runs it where one exists.
- Choosing.tsx:647 [26] Section 26, Fine-Tuning & Learning Loops on AWS, details each service and what the customer brings to it.
- Choosing.tsx:717 [4] Section 4 has the loss and the one setting to get right, keeping the prompt out of it.
- RlOnAws.tsx:351 [25] ---------------------------- */ /* Section */ /* ------------------------------------------------------------------------ */ export function RlOnAws() { return ( <Container header={ <Header variant="h1" description="Find the AWS service for each path from section 25 and what you bring to it: Bedrock and SageMaker AI run SFT and distillation from a teacher's answers, one grader can drive a weight update or a prompt rewrite, and Bedrock's managed RL costs $80.00 per training hour (AWS pages read 2026-10-30 and 2026-11-07; HyperPod recipes 2.0.11, Neuron v2.33.0 and TRL v1.16.0)" > 26.
- RlOnAws.tsx:440 [4] Supervised fine-tuning is section 4's SFT run as a managed job on answers you supply.
- RlOnAws.tsx:457 [4] On our reading this is section 4's sequence-level distillation: the student learns from the teacher's text.
- RlOnAws.tsx:613 [25] Section 25's SFT path runs here as well as on Bedrock.
- RlOnAws.tsx:631 [11] On-policy distillation, section 11's method, therefore runs as your own training job.
- RlOnAws.tsx:633 [4] s licence and terms of use before training on its outputs; section 4 covers what the main providers allow.
- GlossaryAndSources.tsx:141 [4] Training on written prompt-answer examples with the next-token loss, counted on the answer tokens only (section 4).
- GlossaryAndSources.tsx:171 [4, 11] On-policy: the student writes the answer and the teacher scores each of its tokens (sections 4 and 11).' }, { acronym: 'Teacher, student'
- GlossaryAndSources.tsx:173 [11] s own mistakes (section 11).' }, { acronym: 'GKD'
- GlossaryAndSources.tsx:176 [3] More next-token training on raw domain text, with no prompt-answer structure (section 3).' }, { acronym: 'Rejection-sampling fine-tuning'
- GlossaryAndSources.tsx:177 [4] s own answers that passed a check, the rest rejected; the step between SFT and RL (section 4).' }, { acronym: 'LIMA'
- GlossaryAndSources.tsx:214 [7] A reading-comprehension benchmark; another of the regressions InstructGPT measured after RL (section 7).' }, { acronym: 'GPQA'
- GlossaryAndSources.tsx:216 [3] In section 3, the subject area of the tasks one report\'s RL stage starts on.' }, { acronym: 'GSM8K'
