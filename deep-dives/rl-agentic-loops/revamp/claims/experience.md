# Claims: section 13, Memories, Playbooks & Skill Libraries (`src/sections/AccumulatingExperience.tsx`)

Authored 2026-10-30. Sources re-opened on 2026-10-30: arXiv HTML for ACE 2510.04618v3, Dynamic Cheatsheet 2504.07952v1, ReasoningBank 2509.25140v2, Memento 2508.16153v2, Training-Free GRPO 2510.08191v1; arXiv PDF (pdftotext) for CLIN 2310.10134v1, Voyager 2305.16291v2, ExpeL 2308.10144v3; arXiv export API abstracts for ReTool 2504.11536v2 and Reflexion 2303.11366v4; the Anthropic memory tool and Agent Skills pages (`.md` form) and the Anthropic engineering post. Venues from wave2-words G5 or the arXiv comments field. Format: `claim | source URL | register or wave 2 row`.

## Intro
- One full rewrite took the context from 18,282 tokens to 122; accuracy 66.7 to 57.1, below 63.7 with no adaptation; AppWorld case study (strongest number, landing 1) | https://arxiv.org/abs/2510.04618v3 (Sec 2.2) | F03-75; wave2-words row 25
- ACE expansion "Agentic Context Engineering" | https://arxiv.org/abs/2510.04618v3 (abstract) | F03-74; wave2-words row 29, G6
- Step size defined as how much of the store one update changes (pointer to section 11) | section 11 text | SCOPE section 11/13

## Update rules, from append to rewrite
- Reflexion appends one lesson per failure; memory bounded "usually set to 1-3"; oldest drops out (sliding window) | https://arxiv.org/abs/2303.11366v4 (Sec 3; Sec 5) | F03-1, F04-20; wave2-words rows 19, 45
- ReasoningBank: LLM judge labels success/failure without ground truth; items (title, description, content) from both; consolidation "with a simple addition operation"; embedding retrieval | https://arxiv.org/abs/2509.25140v2 (Sec 3.2) | F03-28; wave2-words row 45
- Voyager adds each GPT-4-written, verified program to a library keyed by an embedding of its description; top 5 retrieved | https://arxiv.org/abs/2305.16291v2 (Sec 2.2, Figure 4 caption) | F03-36; wave2-words row 45 (top-5 beyond the register quote, read in Figure 4 caption)
- ACE: itemised bullets with identifier and helpful/harmful counters; curator writes compact delta entries merged by deterministic non-LLM code; counters updated in place; embedding de-duplication | https://arxiv.org/abs/2510.04618v3 (Sec 3, 3.1, 3.2) | F03-74; wave2-words row 29
- ExpeL: ADD, EDIT, UPVOTE, DOWNVOTE; new insight importance count two; removed at zero; expansion "Experiential Learning (ExpeL) agent" | https://arxiv.org/abs/2308.10144v3 (Sec 4.2; abstract) | F03-18; wave2-words row 45
- Training-Free GRPO: group of attempts per query; lessons written only for groups with clear winners and losers; "semantic advantage" "functionally equivalent to vanilla GRPO's" numeric advantage; Add, Delete, Modify, Keep operations on the experience library | https://arxiv.org/abs/2510.08191v1 (Sec 2) | F03-86; wave2-words rows 12, 45
- CLIN: after each trial a frozen LLM writes a new memory from the most recent trial and the memories of the three most recent trials; gloss "a continually learning language agent" from the paper title | https://arxiv.org/abs/2310.10134v1 (Sec 3.2) | F03-22 (re-read 2026-10-30; wave 2 had carried it)
- Dynamic Cheatsheet: curator updates the memory after each query (DC-Cu) or before it from the top 3 retrieved past examples (DC-RS); no ground-truth labels; can refine or remove entries | https://arxiv.org/abs/2504.07952v1 (Sec 2.1, 2.2) | F03-32; wave2-words row 45
- Placement on the spectrum and the three bands | our reading of the rows above | SCOPE section 13 (diagram)
- GRPO advantage as how much better an attempt did than its group's average (definition) | https://arxiv.org/abs/2510.08191v1 (Sec 2) | F03-86

## Each end of the scale has its failure
- Collapse numbers (landing 2) as in the intro, "at step 60" | https://arxiv.org/abs/2510.04618v3 (Sec 2.2) | F03-75; wave2-words row 25
- The collapse was highlighted through Dynamic Cheatsheet; authors argue it is a risk of any end-to-end LLM rewrite, which compresses toward short summaries | https://arxiv.org/abs/2510.04618v3 (Sec 2.2: "While we highlight this through Dynamic Cheatsheet ... the issue is not specific to that method") | F03-75 (beyond the register quote)
- "No trust region" analogy to PPO's clip | our reading | F03-75 use-in-dive note
- Full history appends every previous turn with no curation; Claude 3.5 Sonnet AIME 2024: 23.3 baseline, 26.7 FH, 50.0 DC-Cu | https://arxiv.org/abs/2504.07952v1 (Sec 4.3, Table 2) | F03-34; wave2-words row 26
- NOT USED: GPT-4o "fell to 6.7% using FH" (DC Sec 4.3 text) conflicts with Table 2, which shows GPT-4o FH at 13.3 on AIME 2024; register F03-34 and wave2 row 26 quote the text figure | https://arxiv.org/abs/2504.07952v1 | flagged for the fact checkers
- ReasoningBank, WebArena-Shopping, Gemini-2.5-flash: 39.0 no memory, 49.7 with one retrieved item, 46.0 / 45.5 / 44.4 with two, three, four | https://arxiv.org/abs/2509.25140v2 (Appendix C.1, Figure 13) | wave2-words U9 triage row
- U9 hedge: append-only memory over thousands of tasks not measured in the sources read; Memento case bank "saturates quickly" at about 3k training items | https://arxiv.org/abs/2508.16153v2 (Sec 5.5.3) | F03-83; RESEARCH-GUIDE U9; wave2-words U9
- GPT-4o-mini AIME 2024: baseline 16.7, DC-Cu 13.3, DC-RS 13.3; authors' explanation quote "the base model must produce correct solutions with sufficient frequency ..." | https://arxiv.org/abs/2504.07952v1 (Sec 4.5, Table 3) | F03-34; wave2-words row 26
- Link from that condition to section 7's zero-advantage groups | our reading | F02-22 via section 7
- ACE ablation, AppWorld, DeepSeek-V3.1, offline, test-normal task goal completion: with incremental updates 76.2, without 67.3, ReAct 63.7 | https://arxiv.org/abs/2510.04618v3 (Appendix A.5, Table 18) | beyond the register; read at the pinned version 2026-10-30 (Appendix C.2 restates it as -11.7% TGC relative)

## The signal decides what gets kept
- Voyager: removing self-verification, -73% discovered item count; "the most important among all the feedback types" | https://arxiv.org/abs/2305.16291v2 (Sec 3.4; admission rule Sec 2.3, cite label now names both: fc05) | F03-38; wave2-words row 27
- Voyager self-verification is a GPT-4 check that the task succeeded before the skill is added | https://arxiv.org/abs/2305.16291v2 (Sec 2.2, Figure 4) | F03-36
- ACE AppWorld online, no GT labels: average 59.5 vs ReAct 42.4 over test-normal and test-challenge TGC and SGC (DeepSeek-V3.1; 'averaged' added: fc05) | https://arxiv.org/abs/2510.04618v3 (Table 1) | F03-76
- FiNER gloss: label each token of XBRL financial documents with one of 139 entity types | https://arxiv.org/abs/2510.04618v3 (Sec 4.1) | F03-77 (gloss beyond the register quote)
- ACE FiNER online: no labels 67.3 vs base 70.7; online with labels 76.7 (offline with labels 78.3; 'online' added: fc05) | https://arxiv.org/abs/2510.04618v3 (Table 2) | F03-77; wave2-words row 28
- Authors' quote: "when ground-truth supervision or reliable execution signals are absent", "the constructed context can be polluted by spurious or misleading signals" | https://arxiv.org/abs/2510.04618v3 (Sec 4.4) | F03-77; wave2-words row 28

## What a store buys against a weight update
- U7 hedge: no same-model, same-budget RL comparison located for the memory and playbook loops; the one on offer pairs different base models | https://arxiv.org/abs/2510.08191v1 (Table 3) | RESEARCH-GUIDE U7; wave2-words U7
- ReTool venue ICLR 2026 (proceedings PDF header; fc05 fix from 'preprint') | https://proceedings.iclr.cc/paper_files/paper/2026/file/4038c9208dfc22644c60ad39c24e5c53-Paper-Conference.pdf | fc04, fc05
- Table 3: Qwen2.5-32B-Instruct ReAct 29.6, ReTool 67.0; Qwen3-32B (non-thinking) ReAct 29.1, Training-Free GRPO 33.5; tool CI for all | https://arxiv.org/abs/2510.08191v1 (Table 3) | F03-90; wave2-words row 11
- Derived lifts, our arithmetic: 67.0 - 29.6 = 37.4; 33.5 - 29.1 = 4.4 | derived from Table 3 | wave2-words row 11
- ReTool pipeline: cold-start fine-tuning on code-augmented long-form reasoning traces, then RL with task outcomes as rewards; "Our 32B model achieves 67% accuracy with 400 training steps" | https://arxiv.org/abs/2504.11536v2 (abstract) | wave2-words row 11
- Table 3 captioned Mean@32; Mean@32 = 32 independent runs per problem, average pass@1 | https://arxiv.org/abs/2510.08191v1 (Sec 3.1, Table 3 caption) | F03-87 (definition beyond the register quote)
- Training-Free GRPO cheap to train, dearer per query, cross-model pair; priced in section 20 | https://arxiv.org/abs/2510.08191v1 (Sec 4.2) | F03-91; wave2-words row 13
- ACE 91.8% of input tokens served from cache, during evaluation (playbook frozen), prompt-caching study with GPT-5.1 through the OpenAI API (model added: fc05) | https://arxiv.org/abs/2510.04618v3 (Sec 4.7) | F03-79, F04-41; wave2-systems-cost row 27
- U10 hedge: no measurement of cache hit rate while a loop edits its own context located | RESEARCH-GUIDE U10; wave2-limits U10 | -
- Playbook rides in every prompt (prepended to future calls) | https://arxiv.org/abs/2510.08191v1 (Sec 2); https://arxiv.org/abs/2510.04618v3 (Sec 4.7) | F03-86, F03-79

## Vendor memory and skills ship the store
- Memory tool operates client-side; application runs the file operations on storage it controls | https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool | F03-42; wave2-words row 30
- Claude "stores what it learns in files under /memories and reads them back in later conversations" | same page | wave2-words row 30
- Page leaves size caps and expiry to the application ("Track memory file sizes and cap how large a file can grow"; "Periodically delete memory files that haven't been accessed in a long time") | same page | F03-42
- Agent Skills load on demand; Level 1 metadata ~100 tokens per Skill always (at startup); Level 2 instructions under 5k tokens when triggered | https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview | F03-40; wave2-words row 30
- Neither page describes an evaluator or reward deciding which lessons are kept (silence is the claim, attribution kept) | both pages above | F03-41, F03-42; wave2-words row 30
- Future goal quote "we hope to enable agents to create, edit, and evaluate Skills on their own"; post published Oct 16, 2025 | https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills | F03-41; wave2-words row 30

## A playbook design checklist
- Mental model line (state design and update rule set the step size; the signal decides what is written) | our reading | SCOPE section 13 mental model
- ACE counters of how often a bullet was marked helpful or harmful | https://arxiv.org/abs/2510.04618v3 (Sec 3.1) | F03-74
- ExpeL count starts at two; removed at zero | https://arxiv.org/abs/2308.10144v3 (Sec 4.2) | F03-18
- Delta updates item: collapse 18,282 to 122 (landing 3); delta ablation 76.2 to 67.3 | https://arxiv.org/abs/2510.04618v3 (Sec 2.2; Appendix A.5, Table 18) | F03-75; beyond register (Table 18)
- De-duplication by semantic embeddings; pruning trigger; FiNER stable from 10K to 100K tokens | https://arxiv.org/abs/2510.04618v3 (Sec 3.2; Appendix A.6, Table 21) | F03-74; beyond register (A.6)
- ReasoningBank best with one retrieved item of one to four tested | https://arxiv.org/abs/2509.25140v2 (Appendix C.1) | wave2-words U9 row
- Training-Free GRPO lessons only from groups with clear winners and losers | https://arxiv.org/abs/2510.08191v1 (Sec 2) | F03-86; wave2-words row 12
- ExpeL HotPotQA 39.0 vs 29.0 with reflections added to success/failure pairs | https://arxiv.org/abs/2308.10144v3 (Sec 5.6, Table 3) | F03-20; wave2-words row 23
- Monitoring advice (log store token count; a sharp shrink is the collapse signature) | our reading of ACE Sec 2.2 | F03-75

## Diagram (`exp-spectrum`)
- Numbers in the diagram: 26.7% vs 50.0% (DC Table 2), 18,282 to 122 tokens, 66.7 to 57.1, 63.7 (ACE Sec 2.2), "1 to 3" (Reflexion Sec 3), "3 latest memories" (CLIN Sec 3.2) | as above | F03-34, F03-75, F03-1, F03-22
