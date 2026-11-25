# Accuracy review, wave 3 round 1, reviewer C

Read from HEAD (81dd730); `AgentsLoop.tsx` is unmodified in the worktree, so HEAD is the committed text. Registers:
`research/2026-11/*.md` (04, 06, 09, 10a, 10c, 11c, wave2-B). Before text `/tmp/pai-text-before/19-agents.txt`,
after text `/tmp/pai-rw/w3-r1c/19-agents.txt`.

## Part 1. Section 19, Agents Running the Loop (`AgentsLoop.tsx`)

### The four points the task named

**pass@8 (F04-16).** The owner holds everywhere ("Its authors report", "The authors define", "author reported" on
every chip). The meaning does not. What the entry carries: the claim sentence (the register writer's words) says
"so this is a recovery measure and is different from a one-shot success rate"; the quoted evidence is only the
authors' definition ("the chance of completing a task in one rollout, given a fixed number of retries (here,
eight)"), "our retries happen after witnessing the previous failure", the project page's "99% pass@8 success rate
across the showcased manipulation tasks", and "a policy that can't stays near pass@1 (a 13% policy stays ~13%, not
99%)". No quote calls pass@8 a recovery measure. So "measures recovery" is our reading (the register's gloss on
the authors' framing), and the section's own `<Derived>` arithmetic refutes its unqualified form: at independent
attempts, 1 - (1 - p)^8 >= 0.99 needs p >= 1 - 0.01^(1/8) = 0.438, so a policy with no recovery at all reaches
99% at 44% per attempt. What the entries support: pass@8 counts rollouts with a success anywhere in up to eight
attempts (first tries included), it is a different quantity from the one-shot rate, and the paper text gives no
first-try rate, so 99% cannot be split into first-try skill and recovery. Finding E19-1.

**The F04-8 hedge.** Kept at its exact scope in the paragraph that states it: "in the repository files read at the
pinned commit the line is only text: they show no mechanism that stops the agent from editing what it protects"
matches F04-8's "The repo files read do not show a mechanism that technically prevents the agent from editing those
files" (U2 open). The table's "by written rule" is accurate. The comparison paragraph and the SEAR paragraph then
treat ENPIRE's fence as a sentence only, which U2 leaves open (M19-6).

**The scaling result.** Owner kept ("The authors timed"), every number matches F04-18 and F04-20, every ratio
reproduces. The h2 title combines a figure 3 ratio and a figure 7 ratio into one range, which F04-20's Wave 2 line
forbids (E19-2).

**The AWS tenancy passage.** Every AWS fact traces to an entry: no default Batch timeout, `attemptDurationSeconds`,
SIGTERM then SIGKILL 30 s later, not retried, definition or submission (F04-50); `maxvCpus` (F10-3); Karpenter
`nvidia.com/gpu` in `spec.limits`, account quota with no limit, eventually consistent overrun (F10-407); consumable
resources with licence tokens, FIFO and fair share (F04-52); fair share by weight, reservation against starvation
(F04-51); Nitro Sandboxes 9 November 2026, Firecracker microVM with its own kernel, "safely execute LLM-generated
code", `runtimeClassName: isolated-sandbox`, Kubernetes 1.36+, no-network annotation (F09-43); "runs CPU workloads
only", GPU passthrough "currently unavailable" (F09-45); AgentCore 8 h on microVMs, 15 min idle (F04-53). The text
names no IAM feature and no AWS Budgets feature: "credentials" appears only in design recommendations, and the
block opens with "The design that follows is ours, built from AWS documentation, not an AWS-documented robotics
pattern", so no identity or budget claim needs an entry. Five small overreaches are listed as minors (M19-13 to
M19-16).

**Derived numbers, redone.** 0.56^8 = 0.00967, 1 - 0.00967 = 0.990 (44% threshold 0.438); 1 - 0.87^8 = 0.672;
10 / 13.84 = 0.722; 50 / 53.84 = 0.929; z^2 = 3.8416; 0.6 + 0.4 x 0.1 = 0.64; 86 / 3.37 h / 8 = 3.19 per
agent-hour; 4.7 / 1.983 = 2.37; 2.4997 / 0.6667 = 3.75 ("about 3.7"); 4.5 / 2.0 = 2.25; 140,310.43 / 9,269.21 =
15.1; 140,310.43 / (8 x 9,269.21) = 1.89; 16.84 / 2.5 = 6.74; 77 / 80 = 96.3%; 105.00 / 54.41 = 1.93;
100 - 29.78 = 70.2; GPU std 30.15 = "30.2"; chart values 49.1 / 30.9 / 29.8, 29.4 / 32.5 / 49.0, 4.5 / 3.2 / 2.0 h,
2.5 / 7.7 / 16.8 M match F04-19 and F04-20. All reproduce.

### Findings

**E19-1 (error). pass@8 is stated to measure, and to count, recovery; the entries and the page's own arithmetic
support only "a different quantity from the first-try rate".**
- Sentences: header "why the 99% headline such loops report measures recovery, not first tries"; "That is a measure
  of recovery. If the eight attempts were independent, a policy that succeeds on 44% of first tries would already
  reach 99%"; h2 "99% pass@8 counts recoveries on a practised task"; "That is the recovery pass@8 measures, and a high
  pass@8 says little about the first try."; closing "ENPIRE's 99% pass@8 counts recoveries; the number to compare
  across policies is the first try."
- F04-16: see the verdict above. "counts recoveries" is also wrong literally: a rollout that succeeds on its first
  attempt counts toward pass@8 with no recovery in it. "such loops report" widens the owner from ENPIRE to agent
  loops in general; only ENPIRE reports a pass@8.
- Fix: header "...and why ENPIRE's 99% headline mixes first tries with retries"; replace "That is a measure of
  recovery." with "It counts a success on any of the eight attempts, the first included."; h2 "99% pass@8 mixes first
  tries and retries on a practised task"; replace "That is the recovery pass@8 measures" with "Without a first-try
  rate, the paper's figures cannot show how much of the 99% is recovery"; closing "ENPIRE's 99% pass@8 counts a
  success within eight attempts; ...". Register first: add a Wave 3 line to F04-16 replacing "so this is a recovery
  measure" with the scoped reading.

**E19-2 (error). The h2 title joins a figure 7 ratio and a figure 3 ratio into one range.**
- Sentence: "Eight robots bought 2.25 to 3.7 times the speed, and the robots waited"
- F04-18: 3.7x is pin insertion to first reach 100% (figure 3; Push-T gives 2.4x). F04-20: 2.25x is pin insertion to
  complete the objective (figure 7). F04-20's Wave 2 line: "Quote each figure with its own definition and do not
  combine them." The body keeps them apart; the title, the section's first line, does not. The register's own range
  is "2.4x to 3.7x" (F04-18, section 7 mental model 8).
- Fix: "Eight robots bought 2.4 to 3.7 times the speed to first success, and the robots waited".

**E19-3 (error). A scope the source does not have is added to SECURITY.md's requirement.**
- Sentence: "For the moments a person is present, the repository's security notes require "explicit operator intent"
  and "a physical emergency stop within reach" for real-robot commands."
- F04-10: SECURITY.md reads "Real-robot commands require explicit operator intent, a verified station and calibration
  profile, and a physical emergency stop within reach." The requirement is unconditional. The paper says the eight
  stations run "unattended ... with no human in the loop to intervene". The text resolves the tension between the two
  sources by narrowing the repository's rule, which neither entry supports.
- Fix: "The repository's security notes require "explicit operator intent" and "a physical emergency stop within
  reach" for every real-robot command; the paper's stations run unattended, and neither source says how the two fit."

**E19-4 (error). The absence claim moves from achieved values to target values.**
- Sentence: "The paper does not report the precision and recall it set."
- F04-13 use line: "The measured precision and recall of the resulting verifiers are not reported in the paper (U3)";
  U3: "Precision and recall achieved by ENPIRE's verifiers". No entry says whether the targets the person set are
  printed. New in the rewrite.
- Fix: "The paper does not report the precision and recall its checks achieved."

**E19-5 (error). "outright" is dropped from AgenticRobotics' gate, so "only if" becomes wrong.**
- Sentence: "a new checkpoint replaces the best only if it beats it by at least 1.5w; a smaller gain goes to a paired
  test that scores both checkpoints on the same episodes"
- F04-35: "An improvement is promoted outright only when Delta = m_new - m_best >= 1.5w ...; a positive but smaller
  delta triggers confirmation, judged by McNemar or a paired bootstrap on paired episodes." A smaller gain can still be
  promoted once confirmed.
- Fix: "a new checkpoint replaces the best outright only if it beats it by at least 1.5w; a smaller positive gain is
  kept only if a paired test on the same episodes confirms it".

**E19-6 (error). An absence claim about the ENPIRE paper with no entry behind it.**
- Sentence: "ENPIRE does not give the trial count behind each gain; at 100 episodes, gains of +0.9 and +1.3 would sit
  deep inside that interval."
- F04-23 records the ideas, the gains and the raised flags; no entry records whether the paper gives the episodes
  behind each gain (the claims file marks the sentence "our reasoning", but it is a statement about the paper's
  content). F04-9 mentions a "frozen rolling-success metric" and F04-4 a 50-episode window, so a count may exist.
- Fix: drop the first clause and keep the conditional: "Measured on 100 episodes, gains of +0.9 and +1.3 would sit
  inside that interval."

**M19-1 (minor). "which means the policy uses the failure it just saw" is our inference, stated as fact.**
- Sentence: "To land above the fresh-draw line, a retry has to succeed more often than a first try, which means the
  policy uses the failure it just saw."
- F04-16 quotes only "our retries happen after witnessing the previous failure". The first half is arithmetic (on
  average the conditional success of retries must exceed p). The second half is one cause among others: a retry
  starts from wherever the failed attempt left the scene, which can be easier or harder than the reset. The claims
  file marks the sentence "our reasoning". Likewise "one reset followed by up to eight attempts" reads "in one rollout"
  as "no reset between attempts", and "a policy that cannot recover" supplies the verb the quote "a policy that can't"
  elides; both are readings.
- Fix: "... a retry has to succeed more often than a first try, which the authors attribute to seeing the previous
  failure."

**M19-2 (minor). The survey's pin-insertion scope is widened to the whole 99%, and SEAR's finding is applied as
fact.**
- Sentences: "The 99% also comes from the task the policy practised." and "so SEAR's finding applies: the policy has
  been scored on the starts that fixed reset produces, not on the hard starts an operator would set for a test."
- F04-86 quotes the survey for "the pin-insertion experiment" only; F04-16's 99% is "across the showcased manipulation
  tasks" (also dropped from "Its authors report 99% success"). SEAR's finding (F04-84) is about an agent resetting the
  scene during practice; ENPIRE's reset is frozen code that returns the scene "to the start of the most challenging
  phase" (F04-14), so "not on the hard starts" is our reading.
- Fix: "On pin insertion the 99% also comes from the task the policy practised" and "SEAR's caution applies by our
  reading".

**M19-3 (minor). The opening "only if" is our thesis, carried by a citation to F04-2.**
- Sentence: "A coding agent can improve a robot's policy without a person in the loop only if three things sit
  outside its reach: ..."
- F04-2 documents ENPIRE's design (built once, frozen as "immutable APIs"); it states no necessary condition, and
  ENPIRE itself fences them by a written rule (F04-8).
- Fix: "... is trustworthy only if three things sit outside its reach" and treat it as the section's claim, or cite
  it as our reading.

**M19-4 (minor). "a test the agent cannot study" against the quote that follows.**
- Sentence: "Last, the person keeps a test the agent cannot study: ... "the agent may study failures, but cannot
  train on the test set or alter metric computation"."
- F04-13: the agent may study failures; it may not train on the set or change the metric.
- Fix: "a test the agent cannot train on".

**M19-5 (minor). Three small widenings in the ENPIRE walk-through.**
- "the largest single gain came from a mix": F04-23 says "a few high-impact ideas account for most of the progress -
  most notably BC regularization (I37, +10.8 pp)"; "most notably" is not "largest". "raised the team's best success
  rate": F04-23 says "team-average best success rate". Fix: "the most notable gain".
- "the order spends robot time last, because robot access is what the loop runs short of first": the instruction
  file (F04-9) gives no reason; the authors' "binding resource is the agent's robot-access budget" (F04-21) is a
  budget of approved trials, and F04-19 has the robots idle 51% to 70% of wall-clock. Fix: "and the order spends
  robot time last, the resource the authors call binding".
- "In the agent's hands ... the calls that leak the task's state or grant a retry: get_task_info, ...": F04-24 quotes
  "APIs such as"; the list is not exhaustive. Fix: "such as".

**M19-6 (minor). The comparison treats ENPIRE's fence as text only, past the scope of F04-8.**
- Sentences: "what stands between the agent and its grade ranges from a written rule to a separate process" and "a
  fence made of a sentence holds only while the agent follows it", with ENPIRE as the written-rule case.
- U2 leaves open whether the verifier and reset are enforced; F04-13 calls the held-out set "sandboxed" and F04-11
  scopes the agent's sandbox to "a single autoresearch repository".
- Fix: "ranges from a written rule, with enforcement unpublished, to a separate process".

**M19-7 (minor). The SO-101 paragraph hardens "not found" and loses its our-reading flag.**
- Sentence: "ENPIRE's code ships an adapter for its own two-arm stations and none for the SO-101, so that reset would
  be yours to write."
- F04-26: "No SO-101 adapter was found in the file list (U5)." The before text said so and said "That mapping is our
  reading". The adapter (`robot_adapters/real_yam.py`) is the robot interface; no entry ties the reset to it, and in
  ENPIRE the agent writes the reset in stage one anyway. The chip on F04-5 reads "ENPIRE paper, section 2.2"; F04-5's
  location is figure 1, appendix B.2 and B.4.
- Fix: "No SO-101 adapter appears in the repository's file list at the pinned commit, so the robot interface would
  be yours to write." Relabel the F04-5 chip "figure 1 and appendix B.2".

**M19-8 (minor). AgenticRobotics' +/-9.5 points belongs to its own success levels.**
- Sentence: "at 100 episodes, gains of +0.9 and +1.3 would sit deep inside that interval."
- F04-35: the +/-9.5 is AgenticRobotics' interval at its rates (about 56% to 63%). Near ENPIRE's 97%, a 95% interval
  on a difference at 100 episodes each is about +/-5 points (1.96 x sqrt((0.97 x 0.03 + 0.96 x 0.04) / 100) = 0.051).
  The conclusion holds; "that interval" does not transfer.
- Fix: "would sit inside the interval at that count" (together with E19-6's fix).

**M19-9 (minor). Two claims rest on entries the section never cites.**
- "AgenticRobotics, which runs the loop on one GPU" rests on F04-36 (one Quadro RTX 8000); "SEAR: a benchmark that
  runs coding agents on simulated and real robot tasks" rests on F04-82. Neither ID appears in the section.
- Fix: add `<Cite id="F04-36">` and `<Cite id="F04-82">`.

**M19-10 (minor). The token figures lost "the authors report".**
- Sentence: "ENPIRE's fleets used 9,269 tokens a minute with one agent, 40,029 with four and 140,310 with eight".
- F04-20: author reported (chart data). The before text said "The authors report that the fleet's token rate grows
  15x". The chip carries "author reported", the sentence does not.
- Fix: "The authors report 9,269 tokens a minute ...".

**M19-11 (minor). "the line that dominates the bill" is a pricing claim no entry carries.**
- Sentence: "Budget from the full count, with the cached share priced at your provider's cached-input rate, the line
  that dominates the bill."
- F04-22 use line: "The bill therefore depends on the provider's cached-input price." Whether 77M cached tokens
  outweigh 2.4M fresh and 0.27M output depends on the price ratio, which the register does not hold.
- Fix: "..., the line that decides the bill."

**M19-12 (minor). Register-[derived] figures appear without `<Derived>`.**
- "about three per agent-hour", "about 96%", "15 times", "1.9 times", "6.7 times", "2.25 times", "about 3.7 times",
  "2.4 times" are marked [derived] in F04-18, F04-20, F04-22, F04-23, while 44, 0.67, 70, 0.72, 0.929 and 1.9
  carry the tag.
- Fix: wrap them in `<Derived>`.

**M19-13 (minor). Fair share "counts no GPU-hours against a budget" is our reading of one page, stated as a
product property.**
- F04-51: "it is not an absolute GPU-hour budget [our reading of the page, which names no absolute cap]".
- Fix: "and the fair-share page names no GPU-hour cap."

**M19-14 (minor). The SIGTERM window is best effort, and saving needs a handler.**
- Sentence: "so a training job has 30 seconds to save a checkpoint"
- F04-50 use line: "Timeout terminations are handled on a best-effort basis." The 30 s is the documented gap; a save
  in it needs a SIGTERM handler in the job.
- Fix: "so a training job that handles SIGTERM has about 30 seconds to save a checkpoint".

**M19-15 (minor). Consumable resources hold only for jobs that declare them.**
- Sentence: "Model each station as one such resource with a count of one, and two jobs can never drive the same arm
  at once."
- F04-52: Batch starts a job "only when all the required consumable resources are available"; a job that does not
  declare the resource, or an agent that calls the station server directly (F04-6), is outside it. The modelling is
  our proposal (F04-52 use line), covered by the block's "The design that follows is ours".
- Fix: "and no two jobs that declare it can drive the same arm at once".

**M19-16 (minor). Two Nitro Sandbox details go past F09-43.**
- "run each pod or container in its own lightweight virtual machine": F09-43 says "each pod or task gets its own VM"
  (an ECS task can hold several containers). Fix: "each pod or task".
- "in a sandbox, what the agent may reach, which must include its model and Git, becomes a choice you make": the only
  network control in the entries is the annotation that boots "no network device", which would cut off the model too.
  Selective egress needs a mechanism no entry covers. Fix: "in a sandbox the network becomes a setting you control;
  the agent still needs its model and Git".

**M19-17 (minor). The loop diagram's caption dropped "Illustrative layout, not measured."**
- The before caption carried it; the figure draws a design from F04-3, F04-6, F04-7, F04-8, F04-12, not data.
- Fix: restore "Illustrative layout, not measured." at the end of the caption.

### Checked and holding

ENPIRE from NVIDIA, CMU and UC Berkeley, 2026, eight stations each with its own agent (F04-5); built once, frozen,
"immutable" (F04-2); trial definition and section 16's "trial and episode mean the same thing here"; code does
reset, rollout and verifier, agent reads logs and papers, edits code, launches training (F04-1, F04-2); two arms,
three D405 cameras, RTX 5090 32 GB, 24-core CPU, 128 GB, no shared cluster or off-station compute (F04-5); hosted
model via Codex with GPT-5.5 and Claude Code with Opus 4.7 (F04-25); one GPU as the compute cap (F04-49); success
check from a few minutes of recordings, "is_aligned and height_correct and force_correct", two of three not vision
(F04-12); reset to the start of the hardest phase with SAM3, BundleSDF and cuRobo on the station GPU (F04-14);
precision, recall and latency set by the person (F04-13); zip tie two views, 150 ms (F04-12); toy 0.64 labelled
`<Toy>`; nine-line prompt, goal quoted verbatim, subagents, own branch, pull from origin, Git the only channel
(F04-4, F04-7); BC, real-robot RL, scripted, mix, batch size (F04-3); +10.8, +0.9, +1.3 (F04-23); six-step order and
failed trials kept (F04-9); /start, /restart, /home, 30 Hz policy, 100 Hz joint control (F04-6); 30 Hz host loop in
section 3; 86 ideas in 3.37 h (F04-23); instruction-file quotes, "Never redefine success inside the policy",
"invalidates comparison with prior runs", "immutable" (F04-8); prompts bypassed, unrestricted internet, prior
sessions pruned (F04-11); limits end the episode and reset, torque-limited gripper, "essential" unattended (F04-10);
disabled simulation APIs (F04-24); table rows for ASPIRE (F04-27, F04-28), AgenticRobotics (F04-34) and SEAR
(F04-83); SEAR sealed judge (F04-83); Learning From Feedback dive section 13 is "The Reward Is a Proxy"
(`rl-agentic-loops/src/App.tsx`); SEAR "success in practice overstates success in the test" (F04-84); FailBench quote,
0.60, balanced accuracy definition, covered in section 8 (F04-45, section 8 text); "100 held-out episodes give a
+/-9.5-point interval", 22 of 100 flipped (F04-35, F04-37); 1.5w gate wording apart from E19-5, 5.6 to 10.0 points
on one lineage (F04-35, F04-37); AdaRSI SO-ARM101, toy in a bowl, OOD 65% to 100%, 10 trials per configuration,
author reported (F04-85); Wilson lower end n / (n + z^2) (F11-203, F06-97); pass@8 definition quote, "our retries
happen after witnessing the previous failure", project-page quote (F04-16); survey quote on pin insertion (F04-86);
50-episode window (F04-4); figure 3 times 2.5 / 0.89 / 0.67 h and 4.7 / 3.1 / 2.0 h (F04-18); figure 7 times 4.5 to
2.0 h (F04-20); utilisation definitions and values (F04-19); limitations quotes and "binding resource" quote (F04-21);
GPU idle more than half the time at every fleet size (F04-19); vLLM dive link; token rates, "reach success sooner,
but require a disproportionately higher token budget" (F04-20); 80M, 77M, 2.4M, 0.27M, the cached-input inference
and its hedge (F04-22); 54.41, 62.01, 105.00, 54.67, 72.32, 99.18, single runs (F04-25); ASPIRE 14.8% to 99.2% on 10
simulated tasks (F04-30); published budgets and "none publishes a GPU-hour or token budget" (F04-49, F04-43); 58 of
86 (F04-23); grader as a separate job in SEAR's manner, flagged as our design; the AWS facts listed above; ENPIRE's 4 h
and 8 h single-agent runs (F04-17) and Git state (F04-7).

Claims checked: about 150. Findings: 23 (6 error, 17 minor).

## Part 2. Confirming check of commit 81dd730, sections 15 and 16

Read `git show 81dd730 -- deep-dives/physical-ai/src deep-dives/physical-ai/research`; every changed sentence read
in its paragraph at 81dd730.

### Finding by finding

| Finding | Status | Evidence in the commit |
|---|---|---|
| E15-1 lost-machine number | RESOLVED | "None of the three saves had left the machine, so the run kept nothing: about 38 hours of training on eight GPUs, 8 x 38 = 304 GPU-hours (8 x 40 = 320 over the 40 hours the instance ran)." 29 is gone. F04-71: "ran for the 38 h left under the 40 h cap", 8 x H100, "the instance terminated with the checkpoints of steps 25, 50 and 75 on its disk". Residual note below. |
| E15-2 frozen-backbone step against a full-weight exchange | RESOLVED | The 0.62 s and 3% comparison is removed; the new sentence compares the two links only (3,200 / 50 = 64) and leaves the step time to the reader's own run. |
| E15-3 "the model before N1.7" | RESOLVED | "its first GR00T release, N1". Register 02 lists N1 (March 2025), N1.5 (2025), N1.6 (December 2025), N1.7 (April 2026); no earlier GR00T model appears. |
| E15-4 our arithmetic as the guide's | RESOLVED | "and by our arithmetic each training time doubles" (F01-90 Wave 2 marks it [derived]). 50 x 60 x 30 = 90,000. |
| E15-5 owners lost | RESOLVED | "by its authors' account" (F02-28, author reported) and "NVIDIA reports roughly 50,000 H100 GPU-hours for GR00T N1, on up to 1,024 GPUs" (F02-34, vendor reported). |
| M15-1 "the one-GPU sizes" | RESOLVED | "The small one-GPU sizes do not have it" (F08-49 "absent on the small sizes"). |
| M15-2 "cannot be reserved either way" | RESOLVED | "neither a Capacity Block nor a training plan reserves the G instances of the one-GPU size, while both reserve an eight-GPU P node." F09-91 lists p4d/p5/p5e/p5en/p6 and no G; F09-35 lists ml.p4d/ml.p5/ml.p5e/ml.p5en/ml.p6 and no G. Both lists hold eight-GPU P types. |
| M15-3 figure desc "fine-tunes" | RESOLVED | "Five one-GPU runs sit between half a GPU-hour and 10.9". |
| E16-1 "six to eight policies" | RESOLVED | "RoboWorld's correlation is computed over 8 policies and HF-WM's over six." (F06-89 "8 policies"; F06-90 "six RoboArena policies"); WorldGym's count is no longer implied; h2 description now "a correlation over a few policies". |
| M16-1 PolaRiS "handful of policies" | RESOLVED | The phrase is removed; register F06-83 gains a dated "Rewrite check" line recording that no quote carries the count. No other PolaRiS policy count remains in `Evaluation.tsx`. |
| M16-2 RoboWorld arithmetic unlabelled | RESOLVED | "By our arithmetic that is `<Derived>100 / 8 = 12.5</Derived>` ... `<Derived>100 x 3,600 / 4,186 = 86</Derived>`" and "by our arithmetic from RoboWorld's figures" in the last block (F06-89 marks both [derived]). |
| M16-3 million steps without its engine | RESOLVED | "with the Newton physics engine" (F06-47: Newton MJWarp 1,023,698 FPS at 0.93 GB). |
| M16-4 20-point gap everywhere | RESOLVED | "A 20-point gap near the top of the scale clears the noise" and "a 20-point gap near the top of the scale shows". 45/50 against 35/50 is 90% against 70%. |
| M16-5 "at least" | RESOLVED | "would look at least this different about one time in four". |

All 14 findings resolved.

### New numbers, redone

3,200 / 50 = 64 (and the link floors it compares: 6.3 GB at 6.25 GB/s = 1.0 s, at 400 GB/s = 15.75 ms, ratio 63.5);
8 x 38 = 304; 8 x 40 = 320; 4.0 / 3.4 = 1.18, printed 1.2; 52 / 22 = 2.36 (52.29 / 22.22 = 2.35), printed 2.4. All
reproduce and all carry `<Derived>`.

### Other changed sentences, checked in context

- "By steps the g6e run looks 4.0 / 3.4 = 1.2 times slower; by samples it is 52 / 22 = 2.4 times slower." Holds for
  the two runs as F09-82 prints them (20,000 steps each; batch 32 on ml.g7e.2xlarge in 3.4 h, batch 16 on
  ml.g6e.2xlarge in 4.0 h). The batch sizes differ, so the 2.4 is a property of the two runs, which is how the
  sentence words it.
- "The faster link moves the same gradient 3,200 / 50 = 64 times sooner; set against the compute time of one step,
  timed on your own run, that gap says whether a second server pays." Consistent with the floors in the sentence
  before it (one copy over each link); guidance, no new claim.
- "Which of the three settings a run uses is a command-line flag, and that flag has failed without warning." Holds:
  F02-42 (`--tune-llm`, `--tune-visual`) and F02-83 (`--peft.method_type=LORA`; before v0.7.0
  `--policy.use_peft=true` "silently fully fine-tuning").
- EvalLadder label "the reference on top": the top row is "Rung three: trials on the real arm", drawn at r = 1, the
  reference every other rung is correlated against. Holds.
- F06-83 register line: accurate description of the entry's quote.

### Residual

**M15-R1 (minor). "None of the three saves had left the machine, so the run kept nothing" is a reading of the log.**
- F04-71 quotes "before the latest checkpoint was uploaded" and "the instance terminated with the checkpoints of
  steps 25, 50 and 75 on its disk"; it does not say steps 25 and 50 were never copied off. The reading is the one
  reviewer A proposed and the most natural one, and the claim line says the run "lost its last checkpoints".
- Fix (optional): "By the run's log, none of the three saves had left the machine, so the run kept nothing: ...".

Changed sentences checked: 16. New errors: 0. Residual minor: 1.
