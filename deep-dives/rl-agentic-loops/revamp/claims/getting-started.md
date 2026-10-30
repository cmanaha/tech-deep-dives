# Claims: section 2, Getting Started

File: `src/sections/GettingStarted.tsx`. Survey section: two external citations (arXiv abstract
pages re-opened 2026-10-30); every other assertion is about the dive itself and is traced to the
finished section file and line that carries it, or to the SCOPE.md section 2 block.

One line per claim: `claim | source URL | register or wave 2 row`.

## External sources

- Reflexion's full title is "Reflexion: Language Agents with Verbal Reinforcement Learning" | https://arxiv.org/abs/2303.11366v4 (title, v4 revised 10 Oct 2023) | register 03 Reflexion header row and F03 Reflexion rows; register 04 F04-54 (same paper)
- Training-Free GRPO's full title is "Training-Free Group Relative Policy Optimization" | https://arxiv.org/abs/2510.08191v1 (title; abstract: "we propose Training-Free Group Relative Policy Optimization (Training-Free GRPO)") | register 03 Training-Free GRPO header row, F03-86

## Dive-internal claims (who it is for, the path, the routes)

- The dive has 24 sections, ending in AWS services and a glossary | src/App.tsx `sections` array | SCOPE.md section plan
- Reader profile: technical lead, knows inference engines, GPUs, prompts and agent loops, has run long autonomous coding agents, no formal RL background | SCOPE.md section 2 block, "Who this is for" | n/a
- Assumed: context window as everything a frozen model conditions on, with effective length and prefix caching as its cost rules; no calculus beyond a gradient step nudging weights | SCOPE.md section 2 block | n/a
- Section 17 applies effective length and prefix caching to learning loops | src/sections/WhereWordsFallShort.tsx:565-617, :661 | n/a
- The vLLM dive's section 6 is Automatic Prefix Caching (sibling link) | authoring-brief.md, sibling-dive link list | n/a
- Section 24 lists every acronym the dive uses and every source it cites | src/sections/GlossaryAndSources.tsx h1 description; SCOPE.md section 24 block | n/a
- Policy: a probability distribution sampled at each call; defined in section 3 | src/sections/LanguageModelAsPolicy.tsx:295-307 | F01-1, F01-2
- Reward: one number per attempt, usually only at the end; section 3 | src/sections/LanguageModelAsPolicy.tsx:419-433 | F01-6
- Advantage: how much better or worse than expected, its sign sets direction; defined in 3, estimated two ways in 4 | src/sections/LanguageModelAsPolicy.tsx:471-494; src/sections/PolicyGradient.tsx:518-524, :552-556 | F01-13, F01-18
- Grader introduced as a program in section 7 | src/sections/RlvrAndGrpo.tsx:669-682 | F02-6, F02-7
- Grader as a proxy that optimisation exploits; section 10 builds a grader that survives it | src/sections/RewardIsAProxy.tsx:446, :455-462 | n/a (section 10's own rows)
- pass@1 and pass@k defined in section 3 | src/sections/LanguageModelAsPolicy.tsx:551-560 | F02-40
- Capability boundary defined in section 8 and read as a curve there | src/sections/WhatRlDoes.tsx:345-347, :364-368 | F02-40
- Four stages and their section ranges; section 8 closes on what a frozen model can buy back; stage 2 ends on section 10 | SCOPE.md section 2 block; src/sections/WhatRlDoes.tsx:760-764; src/App.tsx | n/a
- Section 10's second half uses Ralph, autoresearch and Reflexion and points ahead to sections 12 and 15 | src/sections/RewardIsAProxy.tsx:812-896 | n/a
- The capability result comes before the words track because it sets what a loop would have to reproduce | SCOPE.md section 2 block (design rationale) | n/a
- Three routes, section lists verbatim from the scope | SCOPE.md section 2 block, "Three shorter routes" | n/a
- Section 21 is on no shorter route and runs the comparison on hardware you own | SCOPE.md route lists; src/sections/SideBySideLab.tsx:531 | n/a
- Section 22 introduces GEPA as "Genetic-Pareto, the reflective prompt optimiser of section 14" | src/sections/Choosing.tsx:653-654 | n/a
- Section 3's closing block is the bridge section 11 builds on | src/sections/LanguageModelAsPolicy.tsx:715-742; src/sections/TextLoopAsRl.tsx:800 | F04-54
- Section 18 points to section 8 for sharpening | src/sections/WeightsVsContext.tsx:527-530 | n/a
- Section 20's calculator takes inference-time sampling from section 8 | src/sections/CostPerImprovement.tsx:328 | n/a
- Section 22 caps inference-time sampling at the base model's own pass@k, pointing to section 8 | src/sections/Choosing.tsx:640-646 | n/a
- Section 15's hardening checklist starts with section 10's grader checks | src/sections/YourLoops.tsx:696 | n/a
- Section 22 sends a gap with no trustworthy signal back to section 10's four checks | src/sections/Choosing.tsx:104, :496-501 | n/a
- Section 22 relies on section 7 to turn a base rate into the expected share of groups with no gradient | src/sections/Choosing.tsx:537-539 | n/a
- Section 22 names the AWS service for each path and leaves the detail to section 23 | src/sections/Choosing.tsx:626 | n/a

## Diagram (ReadingMapDiagram)

- Node titles: the 23 section titles of src/App.tsx, wrapped | src/App.tsx | n/a
- Route marks: the scope's three route lists; section 19 drawn as optional on the RL route | SCOPE.md section 2 block | n/a
- Stage arrows: stage 2 builds on stage 1 | src/sections/RlvrAndGrpo.tsx:754, :802, :841 | n/a
- Stage 3 builds on stages 1 and 2 ("the RL vocabulary of sections 3 to 10 applies") | src/sections/TextLoopAsRl.tsx:800 | n/a
- Stage 4 builds on stage 3 | src/sections/WeightsVsContext.tsx:526-527; src/sections/Choosing.tsx:653; src/sections/WhereWordsFallShort.tsx:555, :636 | n/a
- Stage 4 also builds on stage 2 directly | src/sections/WeightsVsContext.tsx:529; src/sections/CostPerImprovement.tsx:328; src/sections/SideBySideLab.tsx:785, :893; src/sections/Choosing.tsx:500, :645 | n/a

## Scope refinement

- The scope says pass@k and the capability boundary are "defined in 3, read as a curve in 8". The
  finished sections define pass@k in section 3 and the capability boundary in section 8
  (WhatRlDoes.tsx:345). The page points each term to the section that holds it.
