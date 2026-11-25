# Adversarial review, batch w3r1, set Z

| File | Argument | Depth | Clarity | Sentences | Parity | Verdict |
|---|---|---|---|---|---|---|
| doc-A | 9 | 9 | 8 | 8 | 9 | sets the bar |
| doc-B | 8 | 9 | 7 | 8 | 8 | not distinguishable by quality from the best files |
| doc-C | 6 | 7 | 6 | 6 | 6 | distinguishable: weaker |

## doc-A.txt: "4. Learning From Demonstrations: Why Copying Drifts and What Fixed It"

Scores
- argument 9: opens on a claim (copying fails for a reason the loss never sees), proves it with a bound and a worked toy number by paragraph 2, and every later block serves the call-rate-times-passes thesis.
- depth 9: objective, bound, chunking arithmetic, temporal-ensembling cost, three generative heads with their losses, per-stage latency split, and paper-versus-code default traps; two technical claims overreach (findings 3 and 4).
- clarity 8: intuition precedes every formula and symbols are defined before use, but a few terms arrive before they are built and the notation is overloaded (k twice, epsilon three times).
- sentences 8: mostly specific and consequential ("Behaviour cloning is regression whose test set is written by its own mistakes"); a residue of bookkeeping clauses and one muddled sentence.
- parity 9: the strongest file in the batch.

Findings, most damaging first

1. "Two changes contained it. Every policy described here is built on the first, and most of them on the second." The thesis says both changes contained compounding error, and the title ("What Fixed It") repeats that. Only the first does. The second (sampling one mode) addresses a different failure, averaging two valid motions into an invalid one, which the page itself treats as a separate mechanism later. The opening paragraph therefore states a wrong causal claim. Fix: "One change contained it; a second fixed a separate failure that copying also has."

2. "On the robot that second network is thrown away and z is set to zero, which gives one consistent way." This is the step that carries the whole ACT head, and it is asserted, not explained. The reader has just been told that regression averages modes; why does a decoder fed z = 0 pick one way instead of the average? The page lists ACT among heads that "draw a sample", yet at run time ACT draws nothing: it is deterministic. A level-400 page needs the mechanism (training gave the decoder mode-specific outputs conditioned on z; z = 0 is the prior's centre, so it lands on one learned way, with no guarantee which) or an honest hedge.

3. "The second line is plain regression: the squared distance between the network's velocity and that one". Two sections earlier the page proved that plain squared-error regression averages two valid motions into the obstacle. The reader will ask why regressing a velocity does not average in the same way, and the page never answers it directly (the regression target is conditioned on the noisy point and the flow time, so the average is taken only over the demonstrations compatible with that point). The toy example's "where a point ends depends on where its noise began" gestures at it without closing the loop.

4. "A−ϵ is the velocity along that line, the same at every τ, which is why the path is straight." True for one noise-demonstration pair during training; the field the network learns is an average over many crossing pairs and is not straight in general, which is why ten steps is a chosen setting and not an exact one. "it follows a straight route exactly however long it is" then overclaims the saving.

5. "In our reading, sampling one mode is a strong tendency on human demonstrations and falls short of a law." The sentence does not say what it means (the need to sample? the benefit?), and "In our reading" is bookkeeping. The evidence before it does not isolate the head either: OpenVLA-OFT changed decoding, chunking and loss together, so the 76.5% to 97.1% rise cannot be attributed to dropping a generative head. Say that, or drop the inference.

6. "The authors report about 30 tokens per chunk per arm. Against our count of 300 for this arm that is 300 / 30 = 10 times fewer." A ratio between the writer's hypothetical (6 joints x 50 actions) and a paper figure whose chunk length and joint count are not given. The "10 times" is unsupported unless the 30 is for the same chunk shape. "by our count" / "our count" is also family-5 bookkeeping, twice in two paragraphs.

7. "The chunk length sets how many times a second the policy is called" (paragraph 3) against, later, "Every chunked policy therefore carries two numbers: how many actions it predicts, and how many of those it plays before it looks again." The opening teaches the wrong variable; call rate is set by actions played, and the page's own table shows LeRobot Diffusion predicting 64 and playing 32.

8. The deadline is stated twice, differently, in the last two paragraphs: "It has to return before the chunk in play runs out" and then "has to stay under about half the duration of the chunk it predicts (section 17, Running on the Robot, works it)". The second rule is new in the final paragraph, underived, prefixed by "By our arithmetic", and uses predicted rather than played length. The closing action should not introduce a rule the reader has to take on trust.

9. "How each failure looks at the bench is our reading of its mechanism, here and in the closing table: this one is a smooth, confident reach that closes the gripper beside the block." Bookkeeping and self-reference in one sentence. The bench picture can simply be stated; the derivation note belongs in one plain clause or the citation.

10. "A policy gives the machine two jobs of different shape, training and the call on the arm (section 20, Fifteen Workloads, Five Shapes), and both are matrix arithmetic on a GPU's tensor cores." The penultimate paragraph turns into a tour: three cross-references, a training-size fact, a 2B/3B parameter figure, and an unexplained claim ("the cores that decode the episode video can fill before the GPU does"). It dilutes the ending and adds a 3B model after the page said "2B-parameter language model" with no reconciliation.

11. Terms used before they are built: "An illustrative 20-second episode at 30 ticks a second" (episode is defined only in the next section; tick never here); "the leader arm of the SO-101"; "the host stores". These may be built in earlier sections, but the first screen of this one leans on them.

12. Notation overload, handled by apology rather than by renaming: "(in this paper k counts iterations, where ACT used it for the chunk length)" and "this ϵ is noise, a different quantity from the error rate in the compounding-error bound". The flow loss then reuses ϵ for noise and A for a chunk previously written a_{t:t+k}. Rename once (e.g. n for denoising steps, a different noise symbol) and the warnings go away.

13. "The tensors are small." The expandable promises "the tensors" and then gives no shape: no image resolution, no token count, no output shape beyond "chunk_size rows". The claim is unsupported where a number was promised.

14. "pi0 predicts 50 actions and, as its authors report, plays 25 of them"; "The ACT authors report that they found the CVAE objective 'essential ...'"; "the paper notes, citing earlier work, that problems exist where it is reached". Attribution clauses that the citation already carries. The CVAE one is also a quote standing in where the ablation's number should be.

15. "It is a ceiling on what can happen and makes no claim about what a given arm will do." Restates the preceding "The bound is a worst case"; one of the two can go.

16. Header description ends "(the ACT, Diffusion Policy, pi0 and FAST papers, LeRobot v0.7.0 and the openpi code, read 2026-11-20)": a source list and an access date in the header, which is provenance bookkeeping on the first screen.

17. "The table gives each paper's own figures." Prose talking about its own table; the column header ("Authors' reported time per call") already says it.

## doc-B.txt: "19. Agents Running the Loop: What the Agent May Touch and Who Grades It"

Scores
- argument 8: opens on a falsifiable rule (three things outside the agent's reach), works a number in paragraph 3, and ends on the action it set up; the second thesis (99% measures recovery) is stated more strongly than the page's own arithmetic allows (finding 1).
- depth 9: verifier precision arithmetic, Wilson lower bounds, fleet scaling, utilisation, token and cache figures, and concrete enforcement settings (attemptDurationSeconds and its SIGTERM window, maxvCpus, Karpenter limits and their eventual consistency, consumable resources, sandbox GPU limits).
- clarity 7: the trial/episode/rollout vocabulary is redefined inside two paragraphs, eight named research systems arrive in quick succession, and two apparent contradictions are left for the reader to resolve.
- sentences 8: many strong, consequential lines ("A fence made of a process boundary holds whatever the agent writes, where a fence made of a sentence holds only while the agent follows it"); some spec-sheet listing and cross-reference bookkeeping.
- parity 8: close to doc-A; looser in structure and terminology, comparable in depth and voice.

Findings, most damaging first

1. "Its authors report 99% success 'pass@8', the share of such rollouts with a success in them. That is a measure of recovery. If the eight attempts were independent, a policy that succeeds on 44% of first tries would already reach 99%". The second sentence is contradicted by the third: if a 44% policy with no recovery at all reaches 99%, then 99% does not by itself measure recovery. The page's own later rule ("To land above the fresh-draw line, a retry has to succeed more often than a first try") needs the first-try rate, which "The paper's text gives no first-try rate" says is missing. The accurate claim is that pass@8 mixes first-try skill and recovery and cannot be split without pass@1. The header ("measures recovery, not first tries"), the section heading ("99% pass@8 counts recoveries") and the last line ("ENPIRE's 99% pass@8 counts recoveries") all repeat the overclaim.

2. "A trial is one attempt at the task, from a reset until the policy succeeds, fails or runs out of time. Section 16, Evaluation, also calls it an episode or a rollout" followed immediately by "ENPIRE's headline uses a longer rollout: one reset followed by up to eight attempts". The reader is told rollout = trial and, one sentence later, that a rollout is up to eight trials. The goal prompt then counts "episodes" and the page admits "Whether an episode there is one attempt or a whole rollout" is unknown. Fix the vocabulary once (attempt, rollout of up to eight attempts) and drop the cross-section synonym list, which is also bookkeeping.

3. "The authors' project page gives the low case, a policy that cannot recover from its failure: 'a policy that can't stays near pass@1 (a 13% policy stays ~13%, not 99%)'." One sentence earlier the page computed that a 13% policy with fresh draws reaches 67%. The quote says 13%. The page never says why a non-recovering policy sits at 13% rather than 67% (each retry starts from the failure state, not from a fresh reset, so a policy that cannot handle that state fails the same way again). Without that sentence the two numbers read as a contradiction.

4. "With eight agents a robot stood idle the other 70% of the time" sits beside "the order spends robot time last, because robot access is what the loop runs short of first" and the quote "the binding resource is the agent's robot-access budget, not its compute". A robot idle 70% of the time is not obviously the scarce resource. The reconciliation (the budget is a count of approved trials and the agent's own pace, not robot wall-clock) is implied but never stated, and the reader is left with a paradox at the centre of the scaling section.

5. "The agent's own code needs a stronger fence than one repository. AWS Nitro Sandboxes ..." and then "On Amazon Bedrock AgentCore Runtime, AWS's managed host for agents, a session on its microVMs ends after at most 8 hours". The design offers two hosts for the agent (an EKS pod in a Nitro Sandbox, and AgentCore Runtime) without saying they are alternatives or which the design uses. The 15-minute idle timeout is stated but its consequence for an agent that waits hours on a Batch training job is not drawn.

6. "ENPIRE's single-agent comparison runs were given 4 hours on pin insertion" against "eight agents cut the time to complete it from 4.5 hours to 2.0" (one agent: 4.5 hours). A one-agent run with a 4-hour budget and a one-agent time of 4.5 hours look inconsistent; if they are different experiments, one clause has to say so.

7. "As an illustration, if the check passes one failure in ten, a policy that truly succeeds 60% of the time reports 0.6 + 0.4 x 0.1 = 0.64". The paragraph has just defined precision ("the share of the trials it passes that truly succeeded"), and the example uses a false-pass rate instead. The reader is not shown the link (precision here is 0.6 / 0.64 = 0.94), so the worked number does not illustrate the term it follows.

8. "An agent improving against a grader is an optimiser, and an optimiser takes the cheapest route to a high score, the idea the Learning From Feedback dive builds in its section 13, The Reward Is a Proxy. On a robot that route often runs through whoever resets the scene." Cross-dive bookkeeping in the opening sentence of a section, and "often" is unsupported: one SEAR finding follows.

9. "A 2026 survey of self-improving robot systems notes that in the pin-insertion experiment, ENPIRE 'trains and evaluates on the same task'." A secondary source quoted for a fact about the primary, with attribution in the sentence. Training and evaluating on the same task is normal for task-specific policies; the point that matters (every trial starts from the one frozen reset) follows in the next sentence and does not need the survey.

10. "Each station is two robot arms, three cameras, its own agent and one workstation with one NVIDIA RTX 5090 (32 GB), a 24-core CPU and 128 GB of RAM." Spec-sheet listing at equal weight; only the one GPU carries a consequence. "One GPU per station" is then stated three times (opening, this paragraph, "In the published loops the cap on compute is physical: one GPU per station").

11. "The budgets that exist are counts an operator sets: ENPIRE's number of approved real-robot trials; the fixed numbers of iterations and trials in SimEX, a loop that searches in simulation before touching the robot; and AgenticRobotics' required timeout on every tool call." SimEX enters only to fill a list. With ENPIRE, ASPIRE, AgenticRobotics, SEAR, FailBench, AdaRSI, SimEX and a survey, the page names eight systems; the ones that appear once (SimEX, the survey) cost the reader more than they return.

12. "In further single runs with Codex, the model reading camera images directly beat no vision (54.67 against 72.32 minutes)". The page has just said "Single runs support only the large gap" (1.9x), then reports a 1.3x single-run gap as a result without the same caveat.

13. "Budget from the full count, with the cached share priced at your provider's cached-input rate, the line that dominates the bill." Whether cached input dominates depends on the price ratio, which is not given; at a typical discount the 77M cached tokens and the 2.4M fresh plus 0.27M output could be close. State it as a check, not a fact.

14. "The FailBench study covered in section 8 found ..." and "as section 8 describes for a real arm" and "(sized in the vLLM dive)": prose pointing at other sections where a clause of content would do. "A judge built on a general vision-language model" also uses vision-language model without the one-clause explanation the page later gives VLA.

15. "Its headline score measures something narrower than it seems." A teaser, separated from its payoff by two definitional sentences; the claim lands in the next paragraph. Move the payoff up or drop the teaser.

16. Header description ends "(ENPIRE paper v2 and repository, AWS documentation, read 2026-11-20)": source list and access date on the first screen.

## doc-C.txt: "9. RLVR & GRPO"

Scores
- argument 6: a real thesis exists (spend each step on prompts that can teach; a measured 9 of 20 steps produced nothing), but the page opens on a definition, then tours base models, successors and two configuration tables before the tool that serves the thesis (p^G + (1-p)^G) arrives in the last section.
- depth 7: strong practical depth on defaults (TRL's paper-index recipe versus code, verl's one-answer GRPO, the silent group's tokens diluting the divisor, an own measurement with a checked prediction); thin on mechanism, since the GRPO objective, ratio and clip are never shown and several table rows assert effects without the reason.
- clarity 6: many terms are expanded and not explained (MoE, KL, REINFORCE++, Routing Replay, cispo, grpo_passk) or not expanded at all (gae), and the reader leans on sections 6 and 7 for the core machinery.
- sentences 6: competent and often specific, but the prose is thick with bookkeeping ("our arithmetic" five times, "our reading" three, "our mapping"), pointers to other sections, version history and fragments.
- parity 6: a careful reference page, visibly below the argued files in this batch.

Findings, most damaging first

1. Title "9. RLVR & GRPO". Two bare acronyms and an ampersand: no claim, no subject a newcomer can parse, and no hint of the section's actual argument (prompts that are always or never solved waste the step). It is the same fault the owner named in "One Robot, One Loop". The other two titles in the batch each state a question and its answer.

2. "RLVR (RL with verifiable rewards, where RL is reinforcement learning) uses a program as the reward: ..." The page opens on a definition (fault family 1), with a nested expansion, then a DeepSeek result that is not the thesis, then a second definition (GRPO). The argument only starts in paragraph 2 ("The challenge is to spend each step on prompts that can teach the model something").

3. The thesis is buried and the blocks are out of order. The claim that zero-spread groups give no gradient is stated in paragraph 2, again in the GRPO block, in the figure caption, in the successor table ("An all-pass group has zero advantage and zero gradient"), and a fifth time at the start of the last section. The one tool that makes the claim usable before a run, "p^G + (1 - p)^G", appears only in the final section, after a successor table, a framework table and a managed-job table. Fault families 3 and 6.

4. "The paper's first arXiv version reported 71.0%; the second arXiv version and the Nature paper report 77.9%". Version history of a source, in reader prose. It neither builds a mental model nor changes an action; it belongs in the citation.

5. Bookkeeping throughout: "in our reading of the code" (twice), "(REINFORCE++, in our reading of the identifier)", "the right-hand column is our mapping onto the terms above", "DAPO's upper 0.28 would be 1.28 (our arithmetic)", "1,024 at the defaults (our arithmetic)", "(our arithmetic on the E0 figures)", "Our arithmetic: share of groups ...". Labelling 1 + 0.28 = 1.28 as the writer's arithmetic is the clearest case. One plain clause, once, would carry the provenance.

6. "\"Bias\" in this table means a systematic tilt in the objective, a different sense from the statistical bias of section 6." The table never uses "bias" in that sense. Its only use is in the REINFORCE++ row ("per-prompt normalisation is a biased estimator"), which is the statistical sense the note says the table does not mean. The note contradicts the table it introduces.

7. The GRPO objective is never shown. "The objective then averages the per-token loss over each answer's tokens" and "A zero advantage gives zero policy gradient" assume the reader knows what the per-token loss is and how an advantage turns into a gradient (log-probability times advantage, with the ratio and clip). A section titled for GRPO, aimed at level 400, should put that formula on the page; instead the ratio and clip are defined in passing in a table preamble ("Two terms from section 7 recur").

8. Successor-table rows assert effects without the mechanism: "The length divisor penalises long wrong answers less, so the model drifts toward them" (why: a negative advantage spread over more tokens gives each token a smaller push); "The standard-deviation divisor gives questions nearly always or never solved more weight" (why: a small spread divides by a small number); "Each token's ratio rests on a single sample, and the noise builds up over long answers" (opaque to the stated reader). The rows also break the heading's promise ("Each successor changes one term"): Dr. GRPO's length divisor and DAPO's token-level averaging change the same term, and the REINFORCE++/RLOO row joins two different changes while explaining only one.

9. "The page gives the identifiers; the right-hand column is our mapping onto the terms above." and "The table maps each term onto its setting in both frameworks." and "Read prompt A first." and "a variant the next blocks return to" and "the first terms the successors in the next block change". Prose about the page's own furniture (fault family 4). "The page" here means the AWS document, which a reader of this page will misread.

10. One-sentence pointer paragraphs: "On the 32B base where RL worked, distillation from DeepSeek-R1 did better still; section 11, Distillation or RL, gives the comparison and when each wins." and "Section 13, The Reward Is a Proxy, takes up what a checker can still miss." and "Section 10, What RL Does to a Model, reads these results as pass@k curves". The "A program as the reward" block is a tour: its facts (format reward, base sizes, spurious rewards) are never tied to the section's thesis, and the spurious-reward result, the most consequential fact in it, ends without its consequence (a recipe tested only on Qwen-Math can credit the base for what the reward did not do).

11. "AWS suggests importance_sampling for a team new to multi-turn RL, and calls PPO with clip thresholds of 0.8 and 1.2 the safe baseline for any first run". Two recommendations that point opposite ways for the same reader, reported side by side with no reconciliation, and importance_sampling as a loss (and cispo beside it) is never explained.

12. "the documented request sets 4 samples per prompt, as an example value rather than a default". The managed-job block lists settings and stops; it never runs the page's own formula on them. At the measured 4.4% base rate, a group of 4 is silent with probability about 0.84, against 0.70 at 8. That is the consequence the block exists to deliver.

13. "On the E0 figures, a 4% base rate left 9 and 10 of 20 steps with no gradient" and the table row "4.4% (E0)". E0 is a bare experiment identifier in reader prose; "our DGX Spark run" is the description it should carry, every time.

14. "seed 0, two runs" followed by different results (9 and 10 zero steps; 28 and 29 silent groups). Two runs at the same seed that disagree need one clause (nondeterministic generation, or different seeds); as written it reads as an error.

15. Acronyms expanded but not explained, against the page's own standard: "a 16B MoE (mixture of experts) base" (the GSPO evidence then depends on "the experts a token activates"); "the KL (Kullback-Leibler divergence) penalty of section 7"; "a training strategy called Routing Replay"; "adv_estimator: gae" (never expanded); "grpo_passk".

16. "One base model and one benchmark." A fragment doing the job of a hedge. Say what it limits: the ablation's gains are measured on one 32B base and AIME 2024 only.

17. The ending's last sentence is a pointer: "Section 25, Choosing a Technique: Fine-Tuning, a Text Loop or a Hybrid, turns the same measurement into its second decision question". The page's real ending is the sentence before it ("Drop or replace those prompts, or filter them during training"); the pointer dilutes it.

18. Header description: "Read the knobs on a managed GRPO job" names managed jobs as the subject, when the managed-job block is the shortest in the section, and ends with "(TRL v1.16.0 and verl v0.9.1, read 2026-10-30)": source and access date on the first screen.

## Batch answer

Groups by quality alone

- Group 1: doc-A and doc-B. Both open on a claim and work a number by the second or third paragraph (A: 600 decisions to 6 and the T²ε ceiling; B: 0.56^8 against a 99% headline). Both give each block a job in one argument, put the reader's configuration choices in the same paragraphs as the mechanism, and end on an action that repeats the strongest number. doc-A is the tighter of the two: intuition, formula and decomposition in that order every time, and almost no padding. doc-B is broader and looser: its terms shift (trial, episode, rollout), it names eight systems, and its central pass@8 claim is stated more strongly than its own arithmetic supports. It sits at the same level, a step below A, not in a different class.
- Group 2: doc-C. A careful, well-sourced reference page that reads differently. Its title is two bare acronyms. It opens on a definition. It states its thesis and then tours base models, a successor table and two settings tables before it hands over the tool that serves the thesis. It restates the zero-gradient fact five times, carries "our arithmetic / our reading / our mapping" bookkeeping, points at other sections where content should be, and leaves a level-400 gap: the GRPO objective itself is never on the page.

Would a careful reader tell them apart by quality alone? Yes, doc-C from the other two. Its title, its first screen and its middle give it away before the topic does: it describes and lists where A and B argue. A and B could not be reliably separated by quality. A reader would find A more rigorous, not of a different class.

Verdicts
- doc-A: sets the bar. Argued from the first sentence and level 400 throughout. Its faults are local: a thesis sentence that credits both changes with containing drift, the unexplained z = 0 step, and a little bookkeeping.
- doc-B: not distinguishable by quality from the best files. It has the same argued shape, depth and practical payoff. Its weaknesses (the pass@8 overclaim, the terminology drift, the named-system density) are fixable inside the current structure.
- doc-C: distinguishable: weaker. The title and opening are definitions, the blocks are out of order, the bookkeeping and self-reference are heavy, and the mechanism is thinner than its configuration detail.


---
Key (added after the review): doc-A this dive section 4 (published pilot, bar); doc-B this dive section 19; doc-C rl dive RLVR and GRPO
