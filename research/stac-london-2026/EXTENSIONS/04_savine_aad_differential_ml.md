# AAD and Differential Machine Learning — Savine and the investment-bank risk story
Access date: 2026-04-25

## Sources fetched [URL + tier]

**[AUTHORITATIVE]**
- Huge, B. and Savine, A. (2020). "Differential Machine Learning." arXiv:2005.02347v4 [q-fin.CP], 30 Sep 2020. https://arxiv.org/abs/2005.02347 — full PDF text extracted.
- Savine, A. Personal site / bio. https://antoinesavine.com/ — bio, career, books, IAQF Innovation Award (2026).
- ISDA. "ISDA SIMM Methodology, version 2.4 (based on v2.3.8: 26 July 2021), Effective Date: December 4, 2021." Official ISDA document. https://www.isda.org/a/CeggE/ISDA-SIMM_v2.6_PUBLIC.pdf — full PDF text extracted (file is v2.4 despite URL slug).
- BCBS. "Minimum capital requirements for market risk" (FRTB), 14 January 2019, corrected 25 February 2019. https://www.bis.org/bcbs/publ/d457.htm — landing page confirms IMA / expected shortfall framework.
- GitHub. differential-machine-learning organization and `notebooks` repo (Huge & Savine reference implementation, TensorFlow). https://github.com/differential-machine-learning

**[UNREACHABLE — not quoted]**
- SSRN 3591734 (403), Amazon book pages (500), Risk Magazine URL (404). arXiv is the canonical primary source.

## Key concepts (numbered, each cited)

1. **Adjoint Algorithmic Differentiation = reverse-mode AD over a pricer.** "Generalized to arbitrary computations unrelated to deep learning or AI, backpropagation becomes AD, or AAD when implemented automatically." [AUTHORITATIVE: Huge & Savine 2020, p.6, accessed 2026-04-25]

2. **Constant-time-in-risk-factors property — the core economic claim.** "This is the critical constant time property of adjoint differentiation. It takes the time of 2 to 5 evaluations in practice to compute thousands of differentials with an efficient implementation." [AUTHORITATIVE: Huge & Savine 2020, footnote 3, p.5] — i.e., one reverse pass yields all sensitivities at 2-5x the forward pricing cost regardless of the number of inputs. This is why AAD displaces bumping/finite-difference Greeks, which scale linearly in the number of risk factors.

3. **AAD's role at investment banks pre-dates differential ML.** "AAD was introduced to finance in the ground breaking 'Smoking Adjoints' [Giles & Glasserman, Risk 2006]… In finance, AAD produces risk reports in real time, including for exotic books or XVA. In the context of Monte-Carlo or LSM, AAD produces exact pathwise differentials for a very small cost." [AUTHORITATIVE: Huge & Savine 2020, p.4]

4. **Differential ML — what "differential" means.** "Differential ML is a general extension of supervised learning, where ML models are trained on examples of not only inputs and labels but also differentials of labels wrt inputs." [AUTHORITATIVE: Huge & Savine 2020, abstract]

5. **Twin networks — the architectural mechanism.** "We can combine feedforward (1) and backpropagation (2) equations into a single network representation, or twin network, corresponding to the computation of a prediction (approximate price) together with its differentials wrt inputs (approximate risk sensitivities)." [AUTHORITATIVE: Huge & Savine 2020, §1.2]

6. **Why the gradient labels help.** "AAD computes pathwise differentials with remarkable efficacy so differential ML algorithms provide extremely effective pricing and risk approximations." [AUTHORITATIVE: Huge & Savine 2020, abstract] The gradients are unbiased noisy estimates of true Greeks, so they regularise the network: "pathwise differentials are unbiased (noisy) estimates of ground truth Greeks." [p.4]

7. **Cost of producing differential training data.** "A differential training set takes 2-5 times longer to simulate with AAD, and it takes twice longer to train twin nets than standard ones. In return, we are going to see that differential ML performs up to thousandfold better on small datasets." [AUTHORITATIVE: Huge & Savine 2020, §2 intro, p.10]

8. **Demonstrated sample efficiency.** On Danske Bank's real netting set ("single and cross currency swaps and swaptions in 10 different currencies, eligible for XVA, CCR or other regulated computations… over 1000 [inputs] with all the path-dependencies"): twin net trained on 8,192 samples is "virtually perfect" while a vanilla net at 65,536 samples is "much more rough." Standard errors: 12.85M (classical, 64k) vs 1.77M (differential, 8k) on a 200M test range. "The twin network has the same degree of approximation as orders of magnitude slower nested Monte-Carlo." [AUTHORITATIVE: Huge & Savine 2020, §2.3, pp.12-13]

## Investment-bank use cases

The arXiv paper explicitly names every use case below as motivation:

- **XVA / CVA / CCR.** "In finance, AAD produces risk reports in real time, including for exotic books or XVA." [AUTHORITATIVE: Huge & Savine 2020, p.4] The Danske benchmark ran "in Danske Bank's XVA system" on a "model of everything (the 'Beast')" with 4-factor Cheyette per currency. [§2.3]

- **FRTB IMA.** "regulations like XVA, CCR, FRTB or SIMM-MVA, where the values and risk sensitivities of Derivatives trading books are repeatedly computed in many different market states. An effective pricing approximation could execute the repeated computations orders of magnitude faster and resolve the considerable bottlenecks of these computations." [AUTHORITATIVE: Huge & Savine 2020, p.2] BCBS d457 confirms FRTB IMA "relies upon the use of expected shortfall models." [AUTHORITATIVE: BCBS d457, 14 Jan 2019]

- **ISDA SIMM / SIMM-MVA.** Named in Huge & Savine 2020 ("e.g. for SIMM-MVA," p.11). ISDA mandates sensitivities-based inputs: "SIMM uses sensitivities as inputs… Sensitivities are used as inputs into aggregation formulae." [AUTHORITATIVE: ISDA SIMM v2.4, §A.2-A.3] Six risk classes, three sensitivity types: "the margin for each risk class is defined to be the sum of the Delta Margin, the Vega Margin, the Curvature Margin and the Base Corr Margin." [§B.5] Every UMR-in-scope counterparty computes these daily.

- **Capital / RWA and online portfolio risk.** Paper targets "computational bottlenecks of Derivatives risk reports and capital calculations" [abstract] via "disposable approximations… trained online, i.e. as a part of the risk computation." [p.2]

## Compute / silicon implications

- **Training labels are produced on the bank's existing AAD-instrumented Monte-Carlo engine** (Danske's "Superfly" / "Beast" in the paper). That engine is typically C++/CUDA on CPU clusters or GPU; the paper notes the 8k autocallable sample set "was generated in around 0.4 sec in Superfly, Danske Bank's proprietary derivatives pricing and risk management system." [AUTHORITATIVE: Huge & Savine 2020, §2.2, p.11]

- **Network training is GPU.** "The entire training process for the twin network (on entry level GPU), including the generation of the 8192 examples (on multithreaded CPU), took a few seconds on a standard workstation." [AUTHORITATIVE: Huge & Savine 2020, §2.3, p.12] Reference TensorFlow implementation at https://github.com/differential-machine-learning. [AUTHORITATIVE]

- **Inference is matrix-vector products.** "Trained NN computes prices and risks with near analytic speed. Inference is as fast as a few matrix by vector products in limited dimension, and differentiation is performed in similar time by backpropagation." [AUTHORITATIVE: Huge & Savine 2020, p.2] This is the workload that maps cleanly to capital-markets deployment on Inferentia, Graviton (BF16/INT8), or NVIDIA inference SKUs — though the paper itself does not name any silicon vendor. [SPECULATIVE — silicon mapping is my inference, not a Huge/Savine claim.]

- **Hessian / second-order is feasible at bounded cost.** Paper shows full Hessian costs "of order n times the original network… for the cost of 2n times the value prediction alone" using twin-network composition. [AUTHORITATIVE: Huge & Savine 2020, §3, p.13] Relevant for cross-gamma / xVA second-order risk.

## Direct quotes worth using verbatim

> "Differential machine learning combines automatic adjoint differentiation (AAD) with modern machine learning (ML) in the context of risk management of financial Derivatives." — Huge & Savine 2020, abstract

> "It takes the time of 2 to 5 evaluations in practice to compute thousands of differentials with an efficient implementation." — Huge & Savine 2020, footnote 3, p.5 (the canonical AAD-cost line)

> "AAD produces exact pathwise differentials for a very small cost." — Huge & Savine 2020, p.4

> "regulations like XVA, CCR, FRTB or SIMM-MVA, where the values and risk sensitivities of Derivatives trading books are repeatedly computed in many different market states." — Huge & Savine 2020, p.2

> "Differential ML performs up to thousandfold better on small datasets." — Huge & Savine 2020, §2 intro, p.10

> "The twin network has the same degree of approximation as orders of magnitude slower nested Monte-Carlo." — Huge & Savine 2020, §2.3, p.13

> "SIMM uses sensitivities as inputs." — ISDA SIMM Methodology v2.4, §A.2

## UNKNOWN

- Specific Risk Magazine issue/page numbers for the published version of "Differential Machine Learning" — Risk's own URL returned 404. The arXiv version is identical content per the GitHub repo description ("Risk articles 'Differential Machine Learning' (2020)").
- Exact wall-clock speedup numbers vs production Monte-Carlo at any named bank other than Danske — paper gives only the 8k-vs-64k sample-efficiency comparisons and the qualitative "orders of magnitude faster" framing. No FLOPs or seconds-per-trade-per-scenario figure is published.
- Whether any tier-1 bank has publicly disclosed Trainium / Inferentia / Graviton deployment of differential-ML pricing networks — no AUTHORITATIVE source found in this pass. Treat any such claim as [SPECULATIVE] until a named-bank press release or conference talk surfaces.
- Bibliographic facts for Savine's two Wiley books (exact ISBN/year/publisher) beyond the URL slugs — Amazon pages 500'd; not independently verified here.
- SSRN abstract page (3591734) — 403 from this environment; arXiv covers the same text.
- Any quantitative claim about FRTB IMA computational burden in absolute terms (e.g. "X CPU-hours per desk per day") — BCBS d457 landing page does not state one and the full 136-page PDF was not fetched.
