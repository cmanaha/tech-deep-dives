# 03 World models and JEPA: research register

## 1. Header

- **Research date:** 2026-11-20. Every URL in this file was accessed 2026-11-20.
- **Area:** stream 03 of the "Physical AI" dive. What a world model is for, world models that generate pixels (Cosmos, Genie, the 1X World Model, world-action models), world models that predict in latent space, and the JEPA (Joint-Embedding Predictive Architecture) line from the 2022 position paper to V-JEPA 2, V-JEPA 2-AC, V-JEPA 2.1, LeJEPA and LeWorldModel, read from the papers and from the code at pinned SHAs.
- **Sections fed:** section 6 "World Models: Predicting What Happens Next" and section 7 "JEPA".
- **Reader:** technical (IT or software), knows what a model and training are, no robotics or self-supervised-learning background.
- **Thread task:** an SO-101 robot arm picks up a block and places it in a cup.
- **Quote policy:** quotes are verbatim from the pinned version, with house-style normalisation: curly quotes become straight quotes, typographic dashes become " - " or a hyphen, inline math is shown as plain text, line-break hyphenation from PDF extraction is rejoined. Ellipses mark omissions.
- **Verdicts:** NEW (recorded fresh from the primary source); CARRIED (seed NN, re-fetched); STALE (superseded by ...); WRONG (seed said X; source says Y); UNKNOWN (unresolved, see the UNKNOWN register).
- **Labels:** `[author reported]` and `[vendor claim]` for performance figures printed by the people who built the thing; `[derived]` for arithmetic, with inputs shown; `[our reading]` for synthesis.

### Tiers

| Tier | What it covers |
|---|---|
| Tier 0 | Our experiments (none in this file) |
| Tier 1 | Source code at a pinned 40-character SHA or release tag; official docs; model cards |
| Tier 2 | First-party lab or vendor blogs, project pages and talks |
| Tier 3 | Papers ("peer-reviewed (venue)" only where the venue was confirmed; otherwise "preprint") |
| Tier 4 | Tutorials and press. Used only to locate primary sources, never cited as fact |

Code is the authority over documentation. Vendor and author performance numbers are claims.

**Evidence kinds:** definition, documentation of support, benchmark claim (author or vendor reported), ablation, production report, code behaviour.

## 2. Currency table

Newest first-party version found on 2026-11-20 for every item this register names.

| Item | Newest version found | Release date | Source URL | What the seed research named |
|---|---|---|---|---|
| V-JEPA 2 paper | arXiv 2506.09985v1 (only version) | 2025-06-11 | https://arxiv.org/abs/2506.09985v1 | V-JEPA 2 (same) |
| V-JEPA encoder | V-JEPA 2.1 (arXiv 2603.14482v3), in the vjepa2 repository | 2026-03-16 release; v3 2026-06-11 | https://arxiv.org/abs/2603.14482v3 | V-JEPA 2 only |
| facebookresearch/vjepa2 code | no releases or tags; HEAD `204698b45b3712590f06245fbfba32d3be539812` | 2026-03-23 | https://github.com/facebookresearch/vjepa2 | repository, no SHA |
| JEPA robot world model | RoboJEPA, arXiv 2610.10515v1; code facebookresearch/robo_jepa `f93106f5f4a451fd526d51778aa8ab7c852eb824` | 2026-10-07 | https://arxiv.org/abs/2610.10515v1 | not named (V-JEPA 2-AC was the newest) |
| LeWorldModel paper | arXiv 2603.19312v3 | 2026-06-03 (v1 2026-03-13) | https://arxiv.org/abs/2603.19312v3 | LeWorldModel, earlier version |
| lucas-maes/le-wm code | no releases; HEAD `8edfeb336732b5f3ce7b8b210d0ba370a09e2cac` | 2026-05-22 | https://github.com/lucas-maes/le-wm | repository, no SHA |
| LeJEPA (SIGReg) | arXiv 2511.08544v3 | 2025-11-14 | https://arxiv.org/abs/2511.08544v3 | LeJEPA |
| JEPA-WMs study | arXiv 2512.24497v4 (TMLR, May 2026) | 2026-09-02 | https://arxiv.org/abs/2512.24497v4 | not named |
| VL-JEPA | arXiv 2512.10942v2 | 2026-02-02 | https://arxiv.org/abs/2512.10942v2 | not named |
| facebookresearch/eb_jepa | located, not read; last push 2026-07-17 | 2026-07-17 | https://github.com/facebookresearch/eb_jepa | not named |
| AMI Labs | company site; launch announcement; no model, paper or code listed | 2026-03-10 | https://amilabs.xyz/ | AMI Labs, from secondary reporting |
| NVIDIA Cosmos | Cosmos 3 (Super 64B, Nano 16B, Edge 4B); repo tag `Cosmos3`; HEAD `0eab578a8935e26aa41c2b7dc9f5ab00f790a037` | end of May 2026 (Nano, Super; the GitHub tag `Cosmos3` and press release are dated 2026-06-01, the README says "May 2026"); Edge July 2026; interactive simulation checkpoints October 2026; HEAD 2026-11-19 | https://github.com/NVIDIA/Cosmos | Cosmos 3 for the family, Cosmos-Predict2.5 and Transfer2.5 for memory and timing figures |
| Cosmos 3 paper | arXiv 2606.02800v4 | 2026-06-23 | https://arxiv.org/abs/2606.02800v4 | Cosmos 3 paper, earlier version |
| Cosmos-Predict2.5 | repository in limited maintenance; HEAD `a2c298b0a3df3778b973fe65e9e58877b292d8a7` | notice read 2026-11-20 | https://github.com/nvidia-cosmos/cosmos-predict2.5 | treated as current for per-clip figures |
| Genie | Genie 4 (model page; no date on the page) | UNKNOWN on first-party page (press: 2026-10-27, Tier 4) | https://deepmind.google/models/genie/ | Genie 3 current, Genie 4 unverified |
| Genie 3 | blog post | 2025-08-05 | https://deepmind.google/blog/genie-3-a-new-frontier-for-world-models/ | Genie 3 |
| Dreamer | Dreamer 4, arXiv 2509.24527v1 | 2025-09-29 | https://arxiv.org/abs/2509.24527v1 | not named |
| DreamZero | arXiv 2602.15922v1 (only version found) | 2026-02-17 | https://arxiv.org/abs/2602.15922v1 | DreamZero |
| GR00T world-action model | GR00T 2 whitepaper and project page; code "Available in December" | November 2026 | https://research.nvidia.com/labs/gear/gr00t-2/ | GR00T N2 / GR00T 2, described as built on DreamZero |
| 1X World Model | company post | 2026-01-12 | https://www.1x.tech/discover/world-model-self-learning | 1X World Model (same post) |
| LeRobot (SO-101 figures) | v0.7.0, SHA `410c095eacc0011d998a73383eb94abed2715af0` | 2026-11-05 | https://github.com/huggingface/lerobot | LeRobot, older version |

## 3. Pinned sources

### Papers

| Short name | Pinned version | Date of that version | Venue status | Parts read |
|---|---|---|---|---|
| V-JEPA 2 | https://arxiv.org/abs/2506.09985v1 | 2025-06-11 | preprint | sections 1 to 4, appendices A and B, Tables 9 and 12 |
| V-JEPA 2.1 | https://arxiv.org/abs/2603.14482v3 | 2026-06-11 | preprint | abstract, method, Table 6, Figure 8 |
| RoboJEPA | https://arxiv.org/abs/2610.10515v1 | 2026-10-07 | preprint | abstract, sections on data, planning, results, limits; Table 13 |
| LeWorldModel | https://arxiv.org/abs/2603.19312v3 | 2026-06-03 | preprint | whole paper including appendices A and D |
| LeJEPA | https://arxiv.org/abs/2511.08544v3 | 2025-11-14 | preprint | abstract, sections on the isotropic Gaussian and SIGReg |
| JEPA-WMs | https://arxiv.org/abs/2512.24497v4 | 2026-09-02 | peer-reviewed (TMLR, 05/2026, as printed on the paper) | sections 1, 2 and 7; Table 6 caption; the V-JEPA 2-AC bug note |
| VL-JEPA | https://arxiv.org/abs/2512.10942v2 | 2026-02-02 | preprint | abstract, section 1 |
| I-JEPA (history) | https://arxiv.org/abs/2301.08243v3 | 2023-04-13 | venue label conflicts (see section 8); treated as preprint | sections 3 and 4, appendix A |
| V-JEPA (history) | https://arxiv.org/abs/2404.08471v1 | 2024-02-15 (paper date; arXiv listing April 2024) | preprint | sections 2 to 4, Table 1 |
| VICReg (history) | https://arxiv.org/abs/2105.04906v3 | 2022-01-28 | peer-reviewed (ICLR 2022) | sections 3 and 4 |
| LeCun position paper (history) | "A Path Towards Autonomous Machine Intelligence", version 0.9.2, read from https://web.archive.org/web/20240101103457/https://openreview.net/pdf?id=BZ5a1r-kVsf (OpenReview itself served a browser challenge) | 2022-06-27 | position paper, not peer-reviewed | sections 2 to 4 |
| DreamerV3 (history) | https://arxiv.org/abs/2301.04104v2 | 2024-04-17 | preprint (venue not confirmed in this pass) | abstract, world model section |
| Dreamer 4 | https://arxiv.org/abs/2509.24527v1 | 2025-09-29 | preprint | abstract, sections 3 and 4 |
| DreamZero | https://arxiv.org/abs/2602.15922v1 | 2026-02-17 | preprint | abstract, sections 1 to 3 and 6 |
| Cosmos 3 | https://arxiv.org/abs/2606.02800v4 | 2026-06-23 | preprint | sections 3.1 and 4.1 |
| Cosmos-Predict2.5 | https://arxiv.org/abs/2511.00062v2 | listing only | preprint | not read; listing located only |
| GR00T 2 whitepaper | https://research.nvidia.com/labs/gear/gr00t-2/assets/gr00t2_whitepaper.pdf | November 2026 | first-party technical report, not on arXiv as of this pass | section 2, latency paragraphs, Figure 66 |

### Code and model cards

| Repository | Ref (40-character SHA) | Commit date | Files read |
|---|---|---|---|
| facebookresearch/vjepa2 | `204698b45b3712590f06245fbfba32d3be539812` (no release tags) | 2026-03-23 | `README.md`, `CHANGELOG.md`, `src/models/predictor.py`, `src/models/ac_predictor.py`, `app/vjepa/train.py`, `app/vjepa_droid/train.py`, `notebooks/utils/mpc_utils.py`, `notebooks/utils/world_model_wrapper.py`, `configs/train/vitl16/pretrain-256px-16f.yaml`, `configs/train/vitg16/droid-256px-8f.yaml` |
| lucas-maes/le-wm | `8edfeb336732b5f3ce7b8b210d0ba370a09e2cac` (no release tags) | 2026-05-22 | `jepa.py`, `module.py`, `train.py`, `eval.py`, `utils.py`, `config/train/*`, `config/eval/*`, `README.md` |
| NVIDIA/Cosmos | `0eab578a8935e26aa41c2b7dc9f5ab00f790a037` (tag `Cosmos3` dated 2026-06-01 also exists) | 2026-11-19 | `README.md`, `docs/reference/models.md`, `docs/reference/inference_benchmarks.md`, `docs/reference/inference_benchmarks/cosmos3-nano-generator.md`, `docs/reference/inference_benchmarks/benchmark_methodology.md` |
| facebookresearch/robo_jepa | `f93106f5f4a451fd526d51778aa8ab7c852eb824` | 2026-10 | `README.md` only |
| nvidia-cosmos/cosmos-predict2.5 | `a2c298b0a3df3778b973fe65e9e58877b292d8a7` | read 2026-11-20 | `README.md` (maintenance notice) |
| huggingface/lerobot | `410c095eacc0011d998a73383eb94abed2715af0` (tag v0.7.0) | 2026-11-05 | `src/lerobot/robots/so_follower/so_follower.py` (lines 72 to 77: six `sts3215` motors), `docs/source/il_robots.mdx` (example cameras 640 x 480 at 30 fps) |
| Hugging Face model card nvidia/Cosmos3-Nano | revision `45666784803b3a7ad577e0def405f9afcc3bddb2` | last modified 2026-11-12 | `README.md` (the card) |

Located, not read: facebookresearch/eb_jepa, facebookresearch/jepa-wms, galilai-group/stable-worldmodel (see the UNKNOWN register).

### Docs and first-party pages (all accessed 2026-11-20)

- https://amilabs.xyz/ and https://amilabs.xyz/updates (AMI Labs company site)
- https://deepmind.google/models/genie/ (Genie 4 model page)
- https://deepmind.google/blog/genie-3-a-new-frontier-for-world-models/ (Genie 3 post, 2025-08-05)
- https://research.nvidia.com/labs/gear/gr00t-2/ (GR00T 2 project page)
- https://www.1x.tech/discover/world-model-self-learning (1X World Model post, 2026-01-12)
- https://huggingface.co/nvidia/Cosmos3-Nano (model card, revision above)

---

## 4. Claim register

Groups, and the section each feeds: A to C (V-JEPA 2, V-JEPA 2-AC, LeWorldModel: section 7 core); D to G (the position paper, I-JEPA and V-JEPA as history, collapse, the 2025 to 2026 JEPA line: section 7); H to J (what a world model is for, pixel world models, the latent argument: section 6); K and L (planning, compute comparison: both sections).

Short code names used below: `vjepa2@2046` means facebookresearch/vjepa2 at SHA `204698b45b3712590f06245fbfba32d3be539812`; `le-wm@8edf` means lucas-maes/le-wm at SHA `8edfeb336732b5f3ce7b8b210d0ba370a09e2cac`. Raw file URLs are `https://raw.githubusercontent.com/<owner>/<repo>/<sha>/<path>`.

### A. V-JEPA 2: the video encoder (arXiv 2506.09985v1, 11 Jun 2025, the only version on the listing)

**F03-1. V-JEPA 2 is trained in two stages: an action-free encoder pretrained on over 1 million hours of internet video and 1 million images, then an action-conditioned predictor (V-JEPA 2-AC) trained on under 62 hours of robot video with the encoder frozen.**
- Location: abstract; Figure 1
- Verdict: CARRIED (seed 10, re-fetched)
- Evidence: https://arxiv.org/abs/2506.09985v1 | Tier 3, preprint (Meta FAIR, first-party lab) | definition | "We first pre-train an action-free joint-embedding-predictive architecture, V-JEPA 2, on a video and image dataset comprising over 1 million hours of internet video. ... we show how self-supervised learning can be applied to robotic planning tasks by post-training a latent action-conditioned world model, V-JEPA 2-AC, using less than 62 hours of unlabeled robot videos from the Droid dataset." (accessed 2026-11-20)
- Use in dive: section 7, the two-stage picture (watch a lot of video without actions, then learn what actions do from a little robot data).

**F03-2. The V-JEPA 2 pretraining objective: mask part of a video, encode the visible part, and have a predictor regress the representation of the masked part as computed by a second copy of the encoder. The loss is L1, in representation space, applied only to masked patches.**
- Location: section 2.1, equation (1)
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2506.09985v1 | Tier 3, preprint | definition | "The encoder and predictor are trained simultaneously using the objective, minimize over theta, phi, Delta_y: || P_phi(Delta_y, E_theta(x)) - sg(E_theta-bar(y)) ||_1, where Delta_y is a learnable mask token that indicates the locations of the dropped patches. The loss uses a stop-gradient operation, sg(.), and an exponential moving average, theta-bar, of the weights theta of the encoder network to prevent representation collapse. The loss is applied only to the predictions of the masked patches." (accessed 2026-11-20)
- Use in dive: section 7, the formula. Symbols: x masked view, y full video, E_theta encoder, E_theta-bar its moving-average copy (the target encoder), P_phi predictor, Delta_y mask tokens, sg stop-gradient.

**F03-3. V-JEPA 2 cuts video into "tubelets" of 2 frames by 16 by 16 pixels; each tubelet becomes one token.**
- Location: section 2.1 "Architecture"; Table 9 (Tubelet Size 2, Patch Size 16); Table 12 (Embedder "2 x 16 x 16 strided conv")
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2506.09985v1 | Tier 3, preprint | definition | "To process a video with our transformer encoder, we first patchify it as a sequence of tubelets of size 2 x 16 x 16 (T x H x W) and employ the same multiblock masking strategy as in Bardes et al. (2024)." (accessed 2026-11-20)
- Use in dive: section 7, the token-count worked example (two 256 x 256 frames become 16 x 16 = 256 tokens).

**F03-4. Encoder sizes: ViT-L 300M parameters (width 1024, depth 24), ViT-H 600M (width 1280, depth 32), ViT-g 1B (width 1408, depth 40). The pretraining predictor is the same for all: a ViT-small-like network of 22M parameters, width 384, depth 12, 12 heads.**
- Location: appendix A.3, Table 12
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2506.09985v1 | Tier 3, preprint | definition | Table 12 rows: "ViT-L 300M 1024 24 16 4096 2 x 16 x 16 strided conv / ViT-H 600M 1280 32 16 5120 / ViT-g 1B 1408 40 22 6144 / Predictor: ViT-s 22M 384 12 12 1536 N.A." (columns Params, Width, Depth, Heads, MLP, Embedder); "we increase the encoder from a ViT-L (300M parameters) to a ViT-g (1B parameters), while the predictor size is kept fixed across all pre-training experiments." (accessed 2026-11-20)
- Use in dive: section 7, model-size table; the asymmetry (a large encoder, a small predictor).

**F03-5. The released config for ViT-L pretraining sets the predictor to depth 12, width 384, 12 heads, with mask tokens and rotary position embeddings, matching the paper's Table 12.**
- Location: `configs/train/vitl16/pretrain-256px-16f.yaml`, `model:` block
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/facebookresearch/vjepa2/204698b45b3712590f06245fbfba32d3be539812/configs/train/vitl16/pretrain-256px-16f.yaml | Tier 1, code | code behaviour | "model_name: vit_large / pred_depth: 12 / pred_embed_dim: 384 / pred_num_heads: 12 / uniform_power: true / use_activation_checkpointing: true / use_mask_tokens: true / use_rope: true / zero_init_mask_tokens: true" (accessed 2026-11-20)
- Use in dive: section 7, "paper and code agree" on predictor size.

**F03-6. How the predictor uses mask tokens (code): encoder outputs for visible patches are projected to predictor width; one learnable mask token is repeated for every position, the copies at the masked positions are kept, concatenated to the context tokens, sorted back into position order, run through the transformer blocks, and only the outputs at masked positions are returned and projected back to encoder width.**
- Location: `src/models/predictor.py` lines 189 to 252
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/facebookresearch/vjepa2/204698b45b3712590f06245fbfba32d3be539812/src/models/predictor.py | Tier 1, code | code behaviour | lines 190, 203-205, 215, 250, 252: "x = self.predictor_embed(x)" ... "pred_tokens = self.mask_tokens[mask_index]" / "pred_tokens = pred_tokens.repeat(B, self.num_patches, 1)" / "pred_tokens = apply_masks(pred_tokens, masks_y)" ... "x = torch.cat([x, pred_tokens], dim=1)" ... "x = x[:, N_ctxt:]" ... "x = self.predictor_proj(x)" (accessed 2026-11-20)
- Use in dive: section 7, "which tensor goes where" for the predictor. A mask token is a learned placeholder vector that says "predict what belongs here"; position comes from rotary embeddings when `use_rope` is true (line 197 skips the additive position embedding in that case).

**F03-7. The loss line in code: mean absolute difference between predictor output and layer-normalised target-encoder output, at masked positions only. `loss_exp: 1.0` in the config makes it L1.**
- Location: `app/vjepa/train.py` lines 429 to 450; `configs/train/vitl16/pretrain-256px-16f.yaml` `loss:` block
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/facebookresearch/vjepa2/204698b45b3712590f06245fbfba32d3be539812/app/vjepa/train.py | Tier 1, code | code behaviour | lines 429-433: "def forward_target(c): / with torch.no_grad(): / h = target_encoder(c) / h = [F.layer_norm(hi, (hi.size(-1),)) for hi in h] / return h"; line 442: "h = [apply_masks(hi, mi, concat=False) for hi, mi in zip(h, masks_pred)]"; line 447: "loss += torch.mean(torch.abs(zij - hij) ** loss_exp) / loss_exp" (accessed 2026-11-20)
- Use in dive: section 7, the loss with the code beside the formula. `torch.no_grad()` around the target encoder is the stop-gradient of F03-2. The layer norm on targets is in the code and not in equation (1) of the paper.

**F03-8. The EMA update in code: after each optimiser step, every target-encoder weight becomes m times itself plus (1 - m) times the matching encoder weight, with m = 0.99925 held constant.**
- Location: `app/vjepa/train.py` lines 222, 296, 299-300, 471-480; config `optimization.ema: [0.99925, 0.99925]`; paper Table 9 "EMA 0.99925"
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/facebookresearch/vjepa2/204698b45b3712590f06245fbfba32d3be539812/app/vjepa/train.py | Tier 1, code | code behaviour | line 222: "target_encoder = copy.deepcopy(encoder)"; line 296: "p.requires_grad = False"; lines 471-480: "# Step 3. momentum update of target encoder / m = next(momentum_scheduler) / with torch.no_grad(): ... torch._foreach_mul_(params_k, m) / torch._foreach_add_(params_k, params_q, alpha=1 - m)" (accessed 2026-11-20)
- Use in dive: section 7, EMA made concrete. [derived] With m = 0.99925 the target moves 0.075% of the way toward the encoder per step (1 - 0.99925 = 0.00075), so it averages over roughly 1 / 0.00075 = 1,333 recent steps.

**F03-9. Masking in the released config: two mask generators per clip, one with 8 blocks each covering 15% of the frame area and one with 2 blocks each covering 70%, all spanning the full clip length in time. The paper's Table 9 gives the same numbers as "Spatial Mask Scale [0.15, 0.7], Temporal Mask Scale [1.0, 1.0]".**
- Location: `configs/train/vitl16/pretrain-256px-16f.yaml` `mask:` block; paper Table 9
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/facebookresearch/vjepa2/204698b45b3712590f06245fbfba32d3be539812/configs/train/vitl16/pretrain-256px-16f.yaml | Tier 1, code | code behaviour | "num_blocks: 8 / spatial_scale: [0.15, 0.15] / temporal_scale: [1.0, 1.0]" and "num_blocks: 2 / spatial_scale: [0.7, 0.7] / temporal_scale: [1.0, 1.0]" (accessed 2026-11-20)
- Use in dive: section 7, the masking picture. The resulting fraction of tokens hidden is not printed in the V-JEPA 2 paper; the V-JEPA paper gives it, about 90% (F03-60).

**F03-10. Pretraining data is VideoMix22M: 22 million samples from five sources (Something-Something v2 168 hours, Kinetics 614 hours, HowTo100M 134K hours, curated YT-Temporal-1B 1.6M hours, ImageNet 1M images).**
- Location: section 2.2, Table 1
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2506.09985v1 | Tier 3, preprint | definition | Table 1 rows: "SSv2 168K EgoVideo 168 No 0.056 / Kinetics 733K ExoVideo 614 No 0.188 / Howto100M 1.1M ExoVideo 134K No 0.318 / YT-Temporal-1B 19M ExoVideo 1.6M Yes 0.188 / ImageNet 1M Images n/a No 0.250" (columns Samples, Type, Total Hours, Apply Curation, Weight); "The resulting dataset, which we refer to as VideoMix22M (or VM22M), consists of 22 million samples." (accessed 2026-11-20)
- Use in dive: section 7, the "hours of video" figure. [derived] 168 + 614 + 134,000 + 1,600,000 is about 1.73 million hours listed; the abstract says "over 1 million hours".

**F03-11. Pretraining schedule and scale: 16-frame clips at 256 x 256 and 4 frames per second, global batch 3,072, 252K iterations (12K warm-up, 228K constant, 12K cool-down); the cool-down raises clips to 64 frames and up to 384 x 384.**
- Location: section 2.2 "Efficient Progressive-Resolution Training"; appendix Table 9
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2506.09985v1 | Tier 3, preprint | definition | "Our training process begins with a warmup phase where we train on 16-frame, 256 x 256-resolution videos with linear learning rate warmup over 12K iterations, followed by a main training phase with a constant learning rate for 228K iterations. Then, during the cooldown phase, we increase video duration and resolution while linearly decaying the learning rate over 12K iterations."; Table 9: "Number of frames 16 / 64; Frames per Second 4.0; Crop Size 256 / [256, 384, 512]; Batch Size (global) 3072; EMA 0.99925" (accessed 2026-11-20)
- Use in dive: section 7, training recipe; section 6 cost context.

**F03-12. The only pretraining compute figure the paper prints is a projection: training ViT-g on 64-frame 384 x 384 clips throughout would take roughly 60 GPU-years on A100s, and progressive resolution cuts GPU time by 8.4x. The actual GPU count and wall-clock time of the released run are not stated in the paper.**
- Location: section 2.2; Figure 5 (middle) caption
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2506.09985v1 | Tier 3, preprint | benchmark claim (author reported) | "training our ViT-g model on 64 x 384 x 384 inputs would require roughly 60 GPU-years (see Figure 5, Middle)."; "we achieve an 8.4x reduction in GPU time for a model that can ingest 64-frame, 384 x 384 resolution inputs"; Figure 5: "Training times (GPU-days) for ViT-g on A100 GPUs" (accessed 2026-11-20)
- Use in dive: section 7, cost. [derived] 60 GPU-years / 8.4 is about 7.1 A100 GPU-years, or about 62,600 A100 GPU-hours (7.14 x 8,766) `[author reported]` inputs.

**F03-13. The released ViT-L pretraining config asks for 16 nodes of 8 GPUs with 24 clips per GPU, which reproduces the paper's global batch of 3,072.**
- Location: `configs/train/vitl16/pretrain-256px-16f.yaml` lines 1 to 20
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/facebookresearch/vjepa2/204698b45b3712590f06245fbfba32d3be539812/configs/train/vitl16/pretrain-256px-16f.yaml | Tier 1, code | code behaviour | "nodes: 16 / tasks_per_node: 8 / cpus_per_task: 16 / mem_per_gpu: 220G" and "batch_size: 24" (accessed 2026-11-20)
- Use in dive: section 7, the shape of the pretraining job. [derived] 16 x 8 = 128 GPU processes; 128 x 24 = 3,072. The GPU model is not named in the config.

### B. V-JEPA 2-AC: the action-conditioned predictor and planning

**F03-14. In V-JEPA 2-AC the video encoder is frozen and only a new predictor is trained. The predictor is a transformer of about 300M parameters: 24 layers, 16 heads, width 1024.**
- Location: section 3.1 "Loss function" and "Architecture"
- Verdict: CARRIED (seed 10, re-fetched)
- Evidence: https://arxiv.org/abs/2506.09985v1 | Tier 3, preprint | definition | "Note that the encoder is kept frozen during this post-training phase."; "The predictor network P_phi(.) is a ~300M parameter transformer network with 24-layers, 16 heads, 1024 hidden dimension, and GELU activations." (accessed 2026-11-20)
- Use in dive: section 7, V-JEPA 2-AC size. The code defaults agree: `predictor_embed_dim=1024, depth=24, num_heads=16` in `src/models/ac_predictor.py` lines 27 to 29, and `pred_depth: 24 / pred_embed_dim: 1024 / pred_num_heads: 16` in `configs/train/vitg16/droid-256px-8f.yaml` (vjepa2@2046).

**F03-15. What the predictor takes in: per time step, one action token (7 numbers), one end-effector state token (7 numbers: 3 position, 3 orientation, 1 gripper) and the frame's 16 x 16 grid of 1408-wide encoder features, interleaved in time.**
- Location: section 3.1 "Model inputs" and "Loss function"
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2506.09985v1 | Tier 3, preprint | definition | "In practice, our feature maps are encoded using the ViT-g encoder and have the shape 16 x 16 x 1408. ... The sequence of feature maps, end-effector states, and actions are temporally interleaved as (a_k, s_k, z_k) k in [15] and processed with the transformer predictor network P_phi(.) to obtain a sequence of next state representation predictions"; "each action a_k is a real-valued 7-dimensional vector representing the change in end-effector state between frames k and k + 1." (accessed 2026-11-20)
- Use in dive: section 7, tensor shapes for the worked example. An action here is a change in gripper pose, not joint angles.

**F03-16. The interleaving in code: actions and states each pass through their own linear layer to width 1024, are placed in front of each frame's patch tokens, and the sequence has T x (H x W + 2) tokens.**
- Location: `src/models/ac_predictor.py` lines 53 to 55 and 141 to 153
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/facebookresearch/vjepa2/204698b45b3712590f06245fbfba32d3be539812/src/models/ac_predictor.py | Tier 1, code | code behaviour | lines 53-55: "self.predictor_embed = nn.Linear(embed_dim, predictor_embed_dim, bias=True) / self.action_encoder = nn.Linear(action_embed_dim, predictor_embed_dim, bias=True) / self.state_encoder = nn.Linear(action_embed_dim, predictor_embed_dim, bias=True)"; lines 146-153: "s = self.state_encoder(states).unsqueeze(2) / a = self.action_encoder(actions).unsqueeze(2) / x = x.view(B, T, self.grid_height * self.grid_width, D)  # [B, T, H*W, D] ... x = torch.cat([a, s, x], dim=2).flatten(1, 2)  # [B, T*(H*W+2), D]" (accessed 2026-11-20)
- Use in dive: section 7, "which tensor goes where". [derived] One 256 x 256 frame is 16 x 16 = 256 patch tokens, so each time step is 258 tokens.

**F03-17. Each frame is encoded on its own: the training code duplicates a single frame into a 2-frame clip so the tubelet embedder (which needs 2 frames) yields one 16 x 16 feature map per frame.**
- Location: `app/vjepa_droid/train.py` lines 134 and 408 to 414
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/facebookresearch/vjepa2/204698b45b3712590f06245fbfba32d3be539812/app/vjepa_droid/train.py | Tier 1, code | code behaviour | line 134: "tokens_per_frame = int((crop_size // patch_size) ** 2)"; lines 410-411: "c = c.permute(0, 2, 1, 3, 4).flatten(0, 1).unsqueeze(2).repeat(1, 1, 2, 1, 1) / h = target_encoder(c)" (accessed 2026-11-20)
- Use in dive: section 7. The paper says the same in words ("We use V-JEPA 2 encoder E(.) as an image encoder and encode each frame independently"); the code shows how a video encoder is made to do that.

**F03-18. Training loss: teacher forcing (predict frame k+1 from the true frames up to k) plus a rollout loss (feed the predictor its own output for T = 2 steps), both L1 against the frozen encoder's features of the real future frame.**
- Location: section 3.1, equations (2) to (4)
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2506.09985v1 | Tier 3, preprint | definition | "We also compute a two-step rollout loss to improve the model's ability to perform autoregressive rollouts at inference time."; "L_rollout(phi) := || P_phi(a_1:T, s_1, z_1) - z_T+1 ||_1. In practice we use T = 2 for computing the rollout loss"; "L(phi) := L_teacher-forcing(phi) + L_rollout(phi), and is minimized with respect to the predictor weights phi." (accessed 2026-11-20)
- Use in dive: section 7, the two-term loss and why the second term exists (at planning time the model consumes its own predictions).

**F03-19. The same two terms in code: `z_tf` is the one-step teacher-forced prediction, `z_ar` the autoregressive rollout for `auto_steps` steps (2 in the released config), and the loss is their sum of mean absolute errors.**
- Location: `app/vjepa_droid/train.py` lines 425 to 449; `configs/train/vitg16/droid-256px-8f.yaml` `loss:` block
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/facebookresearch/vjepa2/204698b45b3712590f06245fbfba32d3be539812/app/vjepa_droid/train.py | Tier 1, code | code behaviour | line 427: "z_tf = _step_predictor(_z, _a, _s, _e)"; line 431: "for n in range(1, auto_steps):"; line 441: "return torch.mean(torch.abs(z - _h) ** loss_exp) / loss_exp"; lines 446-449: "jloss = loss_fn(z_tf, h) / sloss = loss_fn(z_ar, h) / loss = jloss + sloss"; config: "auto_steps: 2 / loss_exp: 1.0 / normalize_reps: true" (accessed 2026-11-20)
- Use in dive: section 7, code beside formula.

**F03-20. Training data: clips of 4 seconds at 4 frames per second and 256 x 256 from the Droid dataset's left exocentric camera, a 7-degree-of-freedom Franka Panda arm with a two-finger gripper; clips shorter than 4 seconds are dropped, leaving under 62 hours, about 23k trajectories including failures. No rewards, task labels or success flags are used.**
- Location: section 3.1; appendix B.1; footnote 1
- Verdict: CARRIED (seed 10, re-fetched)
- Evidence: https://arxiv.org/abs/2506.09985v1 | Tier 3, preprint | definition | "In each iteration of training we randomly sample a mini-batch of 4 second video clips from the Droid dataset, and, for simplicity, discard any videos shorter than 4 seconds, leaving us with a smaller subset of the dataset comprising under 62 hours of video. The video clips are sampled with resolution 256 x 256 and a frame-rate of 4 frames-per-second (fps), yielding 16 frame clips"; footnote: "we train V-JEPA 2-AC on 23k trajectories from Droid, including successes and failures." (accessed 2026-11-20)
- Use in dive: section 7, what "a small amount of robot data" means.

**F03-21. V-JEPA 2-AC optimiser schedule: AdamW, batch size 256, 4,500 warm-up iterations, 85,500 constant, 4,500 decay (94,500 total). The released config asks for 4 nodes of 8 GPUs at 8 clips per GPU, which gives that batch of 256. GPU model and wall-clock time are not stated.**
- Location: paper appendix B.1; `configs/train/vitg16/droid-256px-8f.yaml`
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2506.09985v1 | Tier 3, preprint | definition | "We linearly warmup the learning rate from 7.5 x 10^-5 to 4.25 x 10^-4 over 4500 iterations, then hold it constant for 85500 iterations, and finally decay it to 0 over 4500 iterations. We use a batch size of 256 comprising 4 second video clips"; config at vjepa2@2046: "nodes: 4 / tasks_per_node: 8 / mem_per_gpu: 220G" and "batch_size: 8" and "epochs: 315 / ipe: 300" (accessed 2026-11-20)
- Use in dive: section 7 and the compute table. [derived] 4 x 8 = 32 GPU processes x 8 = 256; 315 epochs x 300 iterations = 94,500 iterations, equal to 4,500 + 85,500 + 4,500.

**F03-22. The released Droid config uses 8 frames per clip (`dataset_fpcs: [8]`, file name `droid-256px-8f`), while the paper describes 16-frame clips.**
- Location: `configs/train/vitg16/droid-256px-8f.yaml` `data:` block versus paper section 3.1
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/facebookresearch/vjepa2/204698b45b3712590f06245fbfba32d3be539812/configs/train/vitg16/droid-256px-8f.yaml | Tier 1, code | code behaviour | "dataset_fpcs: / - 8 / fps: 4" (accessed 2026-11-20)
- Use in dive: contradictions list only; do not state a clip length for the released checkpoint without saying which source.

**F03-23. Planning energy: the L1 distance between the predictor's imagined representation after T actions and the encoder's representation of a goal image. The robot executes only the first action, then plans again.**
- Location: section 3.2 "Energy minimization", equation (5); Figure 7
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2506.09985v1 | Tier 3, preprint | definition | "E(a-hat_1:T; z_k, s_k, z_g) := || P(a-hat_1:T; s_k, z_k) - z_g ||_1" ... "the model infers an action sequence ... by selecting a trajectory that minimizes the L1 distance between the world model's imagined state representation T steps into the future and its goal representation. In practice, we minimize (5) in each planning step using the Cross-Entropy Method (Rubinstein, 1997), and only execute the first action on the robot before re-planning, as in receding horizon control." (accessed 2026-11-20)
- Use in dive: section 7, the planning formula. Symbols: z_k current-frame features, s_k current end-effector state, z_g goal-image features, a-hat candidate actions, P the predictor rolled out T steps.

**F03-24. CEM settings in the paper's robot experiments: 800 samples, 10 refinement iterations using the top 10 samples, planning horizon 1.**
- Location: appendix B.2; Table 3
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2506.09985v1 | Tier 3, preprint | definition | "When planning with V-JEPA 2-AC, we use 800 samples, 10 refinement steps based on the top 10 samples from the previous iteration, and a planning horizon of 1. Since all considered tasks are relatively greedy, we found a short planning horizon to be sufficient for our setup." (accessed 2026-11-20)
- Use in dive: section 7 worked example. [derived] 800 x 10 x 1 = 8,000 predictor forward passes per action, run as 10 batches of 800, plus encoder passes for the current frame and the goal image.

**F03-25. Planning cost: 16 seconds per action on one NVIDIA RTX 4090 for V-JEPA 2-AC, against 4 minutes per action for an action-conditioned Cosmos video model with one tenth as many samples.**
- Location: section 4.2; Table 3
- Verdict: CARRIED (seed 10, re-fetched; the seed lacked the hardware)
- Evidence: https://arxiv.org/abs/2506.09985v1 | Tier 3, preprint | benchmark claim (author reported) | "In both cases we leverage the cross-entropy method (Rubinstein, 1997) for optimizing the sequence of actions using a single NVIDIA RTX 4090 GPU ... With 80 samples, 10 refinement steps, and a planning horizon of 1, it takes 4 minutes to compute a single action in each planning step with Cosmos. ... By contrast, with 10x more samples in each refinement step, the V-JEPA 2-AC world model requires only 16 seconds per action and leads to higher performance across all considered robot skills." (accessed 2026-11-20)
- Use in dive: sections 6 and 7, the central latent-versus-pixel planning number `[author reported]`. [derived] 16 s / 8,000 passes = 2 ms per candidate; Cosmos 240 s / (80 x 10) = 300 ms per candidate; ratio 150x per candidate, 15x per action. The Cosmos model here is the Cosmos 1 "latent diffusion-7B with continuous tokenizer" fine-tuned by the V-JEPA 2 authors, not a current Cosmos release.

**F03-26. Robot results (two Franka arms in two labs not in the training data, 10 trials each): reach 100%; grasp 65% (cup) and 25% (box); reach with object 75% and 75%; pick-and-place 80% (cup) and 65% (box). The Octo baseline scored 15% and 10% on pick-and-place.**
- Location: section 4.2, Table 2
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2506.09985v1 | Tier 3, preprint | benchmark claim (author reported) | Table 2, "V-JEPA 2-AC (ours) ... Avg 100% 65% 25% 75% 75% 80% 65%" and "Octo ... Avg 100% 15% 0% 15% 70% 15% 10%" (columns Reach, Grasp Cup, Grasp Box, Reach w/ Obj. Cup, Box, Pick-&-Place Cup, Box); "Success rates are reported out of 10 trials" (accessed 2026-11-20)
- Use in dive: section 7, what the method achieves on a task close to the dive's block-in-cup task `[author reported]`.

**F03-27. Pick-and-place needs sub-goal images: the model is given three goal images (object grasped, object near the target, object placed) and switches goals on a fixed schedule of 4, 10 and 4 time steps.**
- Location: section 4.2 "Prehensile manipulation"; Figure 10
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2506.09985v1 | Tier 3, preprint | definition | "For the pick-and-place tasks we present two sub-goal images to the model in addition to the final goal. ... The model first optimizes actions with respect to the first sub-goal for 4 time-steps before automatically switching to the second sub-goal for the next 10 time-steps, and finally the third goal for the last 4 time-steps." (accessed 2026-11-20)
- Use in dive: section 7 worked example on the arm task. [derived] 4 + 10 + 4 = 18 planning steps; 18 x 16 s = 288 s (4.8 minutes) of planning per pick-and-place at the published rate, and 18 x 8,000 = 144,000 predictor passes.

**F03-28. Limits the authors state: sampled actions are clipped to about 13 cm of gripper travel; results are sensitive to camera position; long horizons suffer from compounding prediction error and an exponentially growing search space; goals must be images.**
- Location: section 4.2 "Robot deployment"; section 4.3 "Limitations"
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2506.09985v1 | Tier 3, preprint | definition | "we constrain each sampled action to the L1-Ball of radius 0.075 centered at the origin, which corresponds to a maximum end-effector displacement of approximately 13 cm for each individual action"; "In practice, we manually tried different camera positions before settling on one that worked well across all of our experiments."; "autoregressive prediction suffers from error accumulation ... the number of possible action trajectories increases exponentially given a linear increase in the planning horizon" (accessed 2026-11-20)
- Use in dive: section 7, honest limits.

**F03-29. The released planning code differs from the paper's settings: the notebook wrapper defaults to 400 samples, 10 CEM steps, top 10 and a rollout of 2, and its CEM samples only x, y, z displacement and gripper, leaving rotation at zero.**
- Location: `notebooks/utils/world_model_wrapper.py` lines 20 to 29; `notebooks/utils/mpc_utils.py` lines 93 to 105 and 127 to 150
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/facebookresearch/vjepa2/204698b45b3712590f06245fbfba32d3be539812/notebooks/utils/world_model_wrapper.py | Tier 1, code | code behaviour | "mpc_args={ "rollout": 2, "samples": 400, "topk": 10, "cem_steps": 10, "momentum_mean": 0.15, "momentum_std": 0.15, "maxnorm": 0.05, "verbose": True, }"; mpc_utils.py lines 98-104: "action_samples = torch.cat( [ action_samples[:, :3], torch.zeros((len(action_samples), 3), device=mean.device), action_samples[:, -1:], ], dim=-1, )[:, None]" (accessed 2026-11-20)
- Use in dive: section 7, what someone reproducing it will find. [derived] 400 x 10 x 2 = 8,000 predictor step evaluations with the notebook defaults, the same count as the paper's 800 x 10 x 1.

**F03-30. The released CEM loop, step by step: repeat the context `samples` times; for each horizon step draw actions from a Gaussian and clip them; roll the predictor; score each final state by mean absolute difference to the goal features; keep the `topk` lowest; move mean and standard deviation toward the elite statistics with momentum; return the mean.**
- Location: `notebooks/utils/mpc_utils.py` lines 17 to 18 and 53 to 163
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/facebookresearch/vjepa2/204698b45b3712590f06245fbfba32d3be539812/notebooks/utils/mpc_utils.py | Tier 1, code | code behaviour | lines 17-18: "def l1(a, b): / return torch.mean(torch.abs(a - b), dim=-1)"; line 93: "action_samples = torch.randn(samples, mean.size(1), device=mean.device) * std[h] + mean[h]"; lines 122-123: "sims = objective(final_state.flatten(1), goal_state.flatten(1)) / indices = sims.topk(topk, largest=False).indices"; line 138: "mean_selected_actions[..., :3] * (1.0 - momentum_mean) + mean[..., :3] * momentum_mean" (accessed 2026-11-20)
- Use in dive: section 7, CEM as code. The momentum on the mean and standard deviation is a detail the paper's text does not mention.

### C. LeWorldModel (arXiv 2603.19312v3, 3 Jun 2026; code lucas-maes/le-wm)

**F03-31. LeWorldModel (LeWM) is a JEPA world model of about 15M parameters trained end to end from pixels with two loss terms, and the authors state it trains on a single GPU in a few hours. The paper (v3) does not name the GPU model or give a measured training time.**
- Location: abstract; section 1 contributions
- Verdict: WRONG (seed 10 said "an L40S in the paper"; no GPU model appears in the v3 text)
- Evidence: https://arxiv.org/abs/2603.19312v3 | Tier 3, preprint | benchmark claim (author reported) | "we introduce LeWorldModel (LeWM), the first JEPA that trains stably end-to-end from raw pixels using only two loss terms: a next-embedding prediction loss and a regularizer enforcing Gaussian-distributed latent embeddings. ... With 15M parameters trainable on a single GPU in a few hours, LeWM plans up to 48x faster than foundation-model-based world models" (accessed 2026-11-20)
- Use in dive: section 7, the small end of the JEPA line and the candidate for the dive's own training run.

**F03-32. LeWM encoder: ViT-Tiny, about 5M parameters, patch size 14, 12 layers, 3 heads, width 192. One vector per frame: the [CLS] token of the last layer passed through a projection MLP with batch normalisation.**
- Location: section 3.1 "Model Architecture"; appendix D
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2603.19312v3 | Tier 3, preprint | definition | "we use the tiny configuration (~5M parameters) with a patch size of 14, 12 layers, 3 attention heads, and hidden dimensions of 192. The observation embedding z_t is constructed from the [CLS] token embedding of the last layer, followed by a projection step. The projection step maps the [CLS] token embedding into a new representation space using a 1-layer MLP with Batch Normalization. This step is necessary because the final ViT layer applies a Layer Normalization, which prevents our anti-collapse objective from being optimized effectively." (accessed 2026-11-20)
- Use in dive: section 7. The whole frame becomes one 192-number vector; contrast with 256 vectors of 1,408 numbers per frame in V-JEPA 2-AC (F03-15).

**F03-33. LeWM predictor: a 6-layer, 16-head transformer with 10% dropout, about 10M parameters, causal over a short history of frame embeddings; the action enters through adaptive layer normalisation whose weights start at zero.**
- Location: section 3.1 "Model Architecture"
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2603.19312v3 | Tier 3, preprint | definition | "The predictor is a transformer with 6 layers, 16 attention heads, and 10% dropout (~10M parameters). Actions are incorporated into the predictor through Adaptive Layer Normalization (AdaLN) applied at each layer. The AdaLN parameters are initialized to zero to stabilize training and ensure that action conditioning impacts the predictor training progressively. The predictor takes as input a history of N frame representations and predicts the next frame representation auto-regressively with temporal causal masking" (accessed 2026-11-20)
- Use in dive: section 7, predictor description.

**F03-34. The model config in code: encoder `size: tiny`, `patch_size: 14`, 224-pixel images, not pretrained; predictor depth 6, 16 heads, `dim_head: 64`, `mlp_dim: 2048`, dropout 0.1, width 192; two projection MLPs with hidden width 2048 and BatchNorm1d; `embed_dim: 192`, `history_size: 3`.**
- Location: `config/train/model/lewm.yaml` lines 3 to 45; `config/train/lewm.yaml` lines 13 to 15
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/lucas-maes/le-wm/8edfeb336732b5f3ce7b8b210d0ba370a09e2cac/config/train/model/lewm.yaml | Tier 1, code | code behaviour | "encoder: / _target_: stable_pretraining.backbone.utils.vit_hf / size: tiny / patch_size: 14 / image_size: ${img_size} / pretrained: false" and "predictor: / _target_: module.ARPredictor / num_frames: ${history_size} ... depth: 6 / heads: 16 / mlp_dim: 2048 / dim_head: 64 / dropout: 0.1"; lewm.yaml: "img_size: 224 / embed_dim: 192 / history_size: 3" (accessed 2026-11-20)
- Use in dive: section 7, hyperparameter table. [derived] 224 / 14 = 16, so the encoder sees 16 x 16 = 256 patches plus one [CLS] token per frame; only the [CLS] output goes on. [derived] Counting the predictor's weights from `module.py` (6 conditional blocks at 1,798,400 each, plus position embedding and final norm) gives about 10.8M, in line with the paper's "~10M".

**F03-35. The two-term loss in code: mean squared error between predicted and actual next embeddings, plus `lambd` times the SIGReg statistic of the embeddings. There is no stop-gradient and no second encoder: `tgt_emb` comes from the same `encode` call as the context.**
- Location: `train.py` lines 27 to 41
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/lucas-maes/le-wm/8edfeb336732b5f3ce7b8b210d0ba370a09e2cac/train.py | Tier 1, code | code behaviour | lines 27-41: "output = self.model.encode(batch) / emb = output["emb"]  # (B, T, D) / act_emb = output["act_emb"] / ctx_emb = emb[:, :ctx_len] / ctx_act = act_emb[:, : ctx_len] / tgt_emb = emb[:, n_preds:] # label / pred_emb = self.model.predict(ctx_emb, ctx_act) # pred / # LeWM loss / output["pred_loss"] = (pred_emb - tgt_emb).pow(2).mean() / output["sigreg_loss"]= self.sigreg(emb.transpose(0, 1)) / output["loss"] = output["pred_loss"] + lambd * output["sigreg_loss"]" (accessed 2026-11-20)
- Use in dive: section 7, the centrepiece code quote. With `history_size: 3` and `num_preds: 1`, a training sample is 4 frames: frames 1 to 3 are context, and the predictor's three causal outputs are compared with frames 2 to 4.

**F03-36. The paper's loss: L_pred = || z-hat_t+1 - z_t+1 ||_2^2 with z-hat_t+1 = pred_phi(z_t, a_t), and L_LeWM = L_pred + lambda SIGReg(Z), with default M = 1024 projections and lambda = 0.1.**
- Location: section 3.1 "Training Objective", equations (1) to (3)
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2603.19312v3 | Tier 3, preprint | definition | "The complete LeWM training objective is defined as: L_LeWM = L_pred + lambda SIGReg(Z). The method introduces only two training hyperparameters: the number of random projections M used in SIGReg and the regularization weight lambda. Unless otherwise specified, we use M = 1024 projections and lambda = 0.1. ... We do not employ stop-gradient, exponential moving averages, or additional stabilization heuristics. Gradients are propagated through all components of the loss" (accessed 2026-11-20)
- Use in dive: section 7 formula. Symbols: z_t embedding of frame t, a_t action, z-hat the prediction, Z the tensor of all embeddings in the batch (history length N by batch B by dimension d), lambda the regulariser weight.

**F03-37. The released training config sets the SIGReg weight to 0.09, not the paper's 0.1; the other defaults are 17 knots, 1,024 projections, AdamW at learning rate 5e-5, weight decay 1e-3, batch 128, 100 epochs maximum, bf16 precision, gradient clipping at 1.0.**
- Location: `config/train/lewm.yaml` lines 17 to 43
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/lucas-maes/le-wm/8edfeb336732b5f3ce7b8b210d0ba370a09e2cac/config/train/lewm.yaml | Tier 1, code | code behaviour | "trainer: / max_epochs: 100 / devices: auto / accelerator: gpu / precision: bf16 / gradient_clip_val: 1.0" ... "loader: / batch_size: 128" ... "optimizer: / type: AdamW / lr: 5e-5 / weight_decay: 1e-3" ... "num_preds: 1 / loss: / sigreg: / weight: 0.09 / kwargs: / knots: 17 / num_proj: 1024" (accessed 2026-11-20)
- Use in dive: section 7 hyperparameter table; contradictions list (0.09 versus 0.1; `max_epochs: 100` versus the paper's "10 epochs", F03-43).

**F03-38. SIGReg in code: draw 1,024 random unit directions, project the embeddings onto each, and for each projection compare the batch's empirical characteristic function (mean of cos and sin of t times the projection) at 17 points t in [0, 3] with that of a standard Gaussian, exp(-t^2/2); integrate the squared difference with a Gaussian weight and scale by the batch size.**
- Location: `module.py` lines 10 to 36
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/lucas-maes/le-wm/8edfeb336732b5f3ce7b8b210d0ba370a09e2cac/module.py | Tier 1, code | code behaviour | lines 16-20: "t = torch.linspace(0, 3, knots, dtype=torch.float32) ... window = torch.exp(-t.square() / 2.0)"; lines 30-36: "A = torch.randn(proj.size(-1), self.num_proj, device=proj.device) / A = A.div_(A.norm(p=2, dim=0)) / # compute the epps-pulley statistic / x_t = (proj @ A).unsqueeze(-1) * self.t / err = (x_t.cos().mean(-3) - self.phi).square() + x_t.sin().mean(-3).square() / statistic = (err @ self.weights) * proj.size(-2) / return statistic.mean() # average over projections and time" (accessed 2026-11-20)
- Use in dive: section 7, SIGReg at tensor level. The input is `emb.transpose(0, 1)`, shape (T, B, D), so `.mean(-3)` averages over the batch B: the test asks "do this batch's embeddings, seen along a random direction, look like draws from a standard bell curve?"

**F03-39. Why SIGReg prevents collapse, in the paper's words: projecting onto random directions and testing each one-dimensional projection for normality is enough, because matching all one-dimensional marginals matches the joint distribution (Cramer-Wold theorem).**
- Location: section 3.1 "Training Objective"
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2603.19312v3 | Tier 3, preprint | definition | "SIGReg circumvents this limitation by projecting embeddings onto M random unit-norm directions u(m) in S^(d-1) and optimizing the univariate Epps-Pulley test statistic T(.) along the resulting one-dimensional projections h(m) = Z u(m) ... By the Cramer-Wold theorem, matching all one-dimensional marginals is equivalent to matching the full joint distribution." (accessed 2026-11-20)
- Use in dive: section 7 (collapse). A collapsed encoder outputs one point; a single point is as far from a bell curve as a distribution can be, so the statistic is large and the gradient pushes embeddings apart.

**F03-40. LeWM planning: CEM with 300 candidate action sequences, 30 iterations on Push-T (10 on the other environments), top 30 kept, horizon 5 steps where each step is a block of 5 environment actions; all 5 planned blocks are executed before replanning. Cost is the squared distance between the final predicted embedding and the goal image's embedding.**
- Location: paper section 3.2 and appendix D "Planning solver"; `config/eval/solver/cem.yaml`; `config/eval/pusht.yaml` lines 21 to 24; `jepa.py` lines 119 to 124
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2603.19312v3 | Tier 3, preprint | definition | "CEM samples 300 candidate action sequences and optimizes them for a maximum of 30 iterations in PushT and 10 iterations in the other environments. At each iteration, the top 30 trajectories are retained to update the sampling distribution, and the initial sampling variance is set to 1. The planning horizon is set to 5 steps, which corresponds to 25 environment timesteps due to the use of a frame skip of 5. We employ a receding-horizon Model Predictive Control (MPC) scheme with a horizon of 5, meaning that the entire optimized action sequence is executed before replanning."; code at le-wm@8edf `config/eval/solver/cem.yaml`: "num_samples: 300 / var_scale: 1.0 / n_steps: 30 / topk: 30" (accessed 2026-11-20)
- Use in dive: section 7 worked example. [derived] 300 x 30 x 5 = 45,000 predictor steps per plan on Push-T and 300 x 10 x 5 = 15,000 elsewhere; one plan yields 25 environment actions.

**F03-41. Planning time: the full plan takes 0.98 s for LeWM against 47 s for DINO-WM (a world model built on a frozen DINOv2 encoder), which is the "48x" in the abstract. The paper attributes it to encoding each observation with about 200 times fewer tokens. The GPU used for the timing is not named.**
- Location: Figure 3 (left) and caption; section 4.2
- Verdict: CARRIED (seed 10, re-fetched; the comparison target is now named)
- Evidence: https://arxiv.org/abs/2603.19312v3 | Tier 3, preprint | benchmark claim (author reported) | Figure 3 labels: "Full Planning / DINO-WM 47s / LeWM 0.98s"; caption: "Planning time comparison averaged over 50 runs. Encoding observations with ~200x fewer tokens than DINO-WM allows LeWM to achieve planning speeds comparable to PLDM while being up to ~50x faster than DINO-WM."; "LeWM achieves a 48x faster planning time, with the full planning completing in under one second" (accessed 2026-11-20)
- Use in dive: section 7 and compute table `[author reported]`. [derived] 47 / 0.98 = 48.0. The "48x faster" is against DINO-WM, another latent world model, not against a pixel-generating model.

**F03-42. Tasks: Two-Room (2D navigation), Push-T (2D pushing), OGBench-Cube (a simulated arm picks up a cube and places it at a target), Reacher (two-joint arm). On Push-T, LeWM reaches 96.0 +/- 2.83% success over three seeds, DINO-WM 92.0 +/- 1.63%, PLDM 78.0 +/- 5.0%. On OGBench-Cube DINO-WM is slightly ahead, and on Two-Room LeWM is behind both.**
- Location: section 4.1; Figure 5; Figure 6 caption; appendix Table 5; appendix E
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2603.19312v3 | Tier 3, preprint | benchmark claim (author reported) | Table 5: "DINO-WM 92.0 +/- 1.63 / PLDM 78.0 +/- 5.0 / LeWM (ours) 96.0 +/- 2.83"; Figure 6 caption: "On OGBench-Cube, DINO-WM slightly outperforms LeWM, possibly due to the higher visual complexity and the 3D nature of the environment ... In the simpler Two-Room environment, PLDM and DINO-WM outperform LeWM"; appendix E: "OGBench-Cube is a continuous 3D robotic manipulation task in which a robotic arm with an end-effector must pick up a cube and place it at a target location." (accessed 2026-11-20)
- Use in dive: section 7. OGBench-Cube is the published LeWM task closest to the dive's block-in-cup task; all four are simulated. No real-robot result is reported.

**F03-43. Training data sizes and epochs: Push-T 20,000 expert episodes averaging 196 steps; OGBench-Cube, Reacher and Two-Room 10,000 episodes each; every world model trained for 10 epochs; frame skip 5, batch 128, sub-trajectories of 4 frames, 224 x 224 pixels.**
- Location: appendix D; appendix E
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2603.19312v3 | Tier 3, preprint | definition | "We apply a frame-skip of 5, grouping consecutive actions between frames into a single action block. ... We use a batch size of 128 with sub-trajectories of size 4 corresponding to 4 frames and 4 blocks of 5 actions. Each frame is 224 x 224 pixels."; "PushT ... contains 20,000 expert episodes with an average length of 196 steps. However, we train each world model for only 10 epochs." (accessed 2026-11-20)
- Use in dive: section 7 data requirements. [derived] Push-T is about 20,000 x 196 = 3.92 million frames. The code computes the action input width as `frameskip * action_dim` (`train.py` line 68), so one "action" to the predictor is 5 consecutive raw actions concatenated.

**F03-44. Dataset format the loader expects: the README says HDF5 files under `$STABLEWM_HOME`, loaded by the external `stable-worldmodel` package with columns such as `pixels`, `action`, `proprio`, `state`. The Push-T training config at the pinned SHA names a `.lance` file instead.**
- Location: `README.md` "Data"; `train.py` lines 53 to 58; `config/train/data/pusht.yaml` lines 3 to 9; `eval.py` line 42
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/lucas-maes/le-wm/8edfeb336732b5f3ce7b8b210d0ba370a09e2cac/README.md | Tier 1, first-party docs and code | documentation of support | README: "Datasets use the HDF5 format for fast loading. ... Place the extracted `.h5` files under `$STABLEWM_HOME` (defaults to `~/.stable-wm/`)."; pusht.yaml: "frameskip: 5 / name: pusht_expert_train.lance / keys_to_load: / - pixels / - action / - proprio / - state"; train.py line 56: "dataset = swm.data.load_dataset(" ; eval.py line 42: "dataset = swm.data.HDF5Dataset(" (accessed 2026-11-20)
- Use in dive: section 7 practical note for anyone converting SO-101 recordings. The repository holds only model and loss; data loading, environments and the CEM solver live in `stable-worldmodel` (not read here, see the UNKNOWN register).

**F03-45. Limits the authors state: short planning horizons; dependence on offline data with good coverage; SIGReg weakens in very simple, low-diversity environments; action labels are required.**
- Location: section 6 "Limitations & Future Work"
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2603.19312v3 | Tier 3, preprint | definition | "Planning remains restricted to short horizons, motivating hierarchical world modeling for long-horizon reasoning. Our method also relies on offline datasets with sufficient coverage; in particular, low data diversity weakens SIGReg in simple, low-dimensional environments where matching a high-dimensional Gaussian prior is harder. ... Finally, dependence on action labels could be alleviated by inverse dynamics modeling." (accessed 2026-11-20)
- Use in dive: section 7 limits.

**F03-46. Ablations the authors report: success on Push-T stays above 80% for lambda between 0.01 and 0.2; performance drops when the embedding dimension falls below about 184; the number of projections and knots barely matters.**
- Location: appendix G; Figures 15 and 16
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2603.19312v3 | Tier 3, preprint | ablation | "for lambda in [0.01, 0.2], the success rate remains above 80%."; "performance drops when the embedding dimension falls below a certain threshold (around 184), while increasing the dimension beyond this value yields diminishing returns" (accessed 2026-11-20)
- Use in dive: section 7, "one knob to tune" claim with its evidence.

### D. "A Path Towards Autonomous Machine Intelligence" (LeCun, version 0.9.2, 2022-06-27): the paper that introduced JEPA (history)

Source note: the canonical copy is https://openreview.net/pdf?id=BZ5a1r-kVsf, which served a browser-verification page to every automated fetch on 2026-11-20. The text below was read from the Internet Archive capture of that same URL, https://web.archive.org/web/20240101103457/https://openreview.net/pdf?id=BZ5a1r-kVsf, whose first page reads "Version 0.9.2, 2022-06-27". A position paper, not peer reviewed.

**F03-47. JEPA as first defined: two inputs x and y are each encoded, and a predictor predicts the representation of y from the representation of x. It does not produce y itself.**
- Location: section 4.4 "Joint Embedding Predictive Architecture (JEPA)"; Figure 12
- Verdict: NEW
- Evidence: https://web.archive.org/web/20240101103457/https://openreview.net/pdf?id=BZ5a1r-kVsf | Tier 3, position paper (not peer reviewed), the paper that introduced the concept | definition | "The JEPA is non-generative in that it does not actually predict y, but predicts the representation of y, s_y from that of x, s_x."; "The two variables x and y are fed to two encoders producing two presentations s_x and s_y. These two encoders may be different. ... A predictor module predicts the representation of y from the representation of x. The predictor may depend on a latent variable z." (accessed 2026-11-20)
- Use in dive: section 7 opening definition. In a world model, x is what the robot sees now (plus an action) and y is what it sees next.

**F03-48. The energy of a JEPA is the prediction error measured between representations: E_w(x, y, z) = D(s_y, Pred(s_x, z)). Low energy means "y is a plausible continuation of x".**
- Location: section 4.4, equations after Figure 12; section 4.1
- Verdict: NEW
- Evidence: https://web.archive.org/web/20240101103457/https://openreview.net/pdf?id=BZ5a1r-kVsf | Tier 3, position paper | definition | "The energy is simply the prediction error in representation space: E_w(x, y, z) = D(s_y, Pred(s_x, z))"; section 4.1: "The system is a scalar-valued function F(x, y) that produces low energy values when x and y are compatible" [sentence continues beyond the extracted line] (accessed 2026-11-20)
- Use in dive: section 7, the energy-based framing in one line. Symbols: s_x, s_y the two representations; z an optional latent variable for what cannot be known from x; D a distance; w the weights. V-JEPA 2-AC's planning energy (F03-23) is this with D = L1 and y = the goal image.

**F03-49. The proposed agent has six modules: configurator, perception, world model, cost, short-term memory and actor.**
- Location: section 3, Figure 2 caption
- Verdict: NEW
- Evidence: https://web.archive.org/web/20240101103457/https://openreview.net/pdf?id=BZ5a1r-kVsf | Tier 3, position paper | definition | "The perception module estimates the current state of the world. The world model module predicts possible future world states as a function of imagined actions sequences proposed by the actor. The cost module computes a single scalar output called "energy" that measures the level of discomfort of the agent. ... The short-term memory module keeps track of the current and predicted world states and associated intrinsic costs. The actor module computes proposals for action sequences. The world model and the critic compute the possible resulting outcomes. The actor can find an optimal action sequence that minimizes the estimated future cost, and output the first action in the optimal sequence." (accessed 2026-11-20)
- Use in dive: section 7, the block diagram. Mapping to V-JEPA 2-AC [our reading]: perception = frozen encoder; world model = action-conditioned predictor; cost = L1 distance to the goal embedding; actor = the CEM loop.

**F03-50. The world model is described as a simulator of the relevant aspects of the world, and the paper separates a reactive mode ("Mode-1", one pass through a policy) from a planning mode ("Mode-2", optimising actions through the world model), noting that Mode-2 is expensive.**
- Location: section 3 "The world model module"; section 3.1
- Verdict: NEW
- Evidence: https://web.archive.org/web/20240101103457/https://openreview.net/pdf?id=BZ5a1r-kVsf | Tier 3, position paper | definition | "The world model is a kind of "simulator" of the relevant aspects of world."; "Using Mode-2 is onerous. ... Mode-1 is considerably less onerous, since it only requires a single pass through a policy" (accessed 2026-11-20)
- Use in dive: section 6 (planning versus a reactive policy) and section 7. The 16 seconds per action of F03-25 is Mode-2 cost in practice; a vision-language-action policy is Mode-1.

**F03-51. The stated advantage of JEPA: predicting in representation space removes the need to predict every detail of y, because the encoder can drop details that cannot be predicted. The example given is a car at a fork in the road.**
- Location: section 4.4; Figure 12 caption
- Verdict: NEW
- Evidence: https://web.archive.org/web/20240101103457/https://openreview.net/pdf?id=BZ5a1r-kVsf | Tier 3, position paper | definition | "The main advantage of JEPA is that it performs predictions in representation space, eschewing the need to predict every detail of y, and enabling the elimination of irrelevant details by the encoders."; "If x is a video clip of a car approaching a fork in the road, s_x and s_y may represent the position, orientation, velocity and other characteristics of the car before and after the fork, respectively, ignoring irrelevant details such as the trees bordering the road or the texture of the sidewalk."; "With JEPA, we lose the ability to generate outputs, but we gain a powerful way to represent multi-modal dependencies between inputs and outputs." (accessed 2026-11-20)
- Use in dive: section 6, the latent-prediction argument from its source, including the cost named by the author (no generated output to look at).

**F03-52. Hierarchical JEPA (H-JEPA): stack JEPAs so the lower one makes short-term predictions on detailed representations and the upper one makes longer-term predictions on more abstract representations.**
- Location: section 4.6, Figure 15 caption
- Verdict: NEW
- Evidence: https://web.archive.org/web/20240101103457/https://openreview.net/pdf?id=BZ5a1r-kVsf | Tier 3, position paper | definition | "In this diagram JEPA-1 extracts low-level representations and performs short-term predictions. JEPA-2 takes the representations extracted by JEPA-1 as inputs and extracts higher-level representations with which longer-term predictions can be performed. More abstract representations ignore details of the inputs that are difficult to predict in the long term" (accessed 2026-11-20)
- Use in dive: section 7 closing. It remains a proposal: V-JEPA 2 (F03-28) and LeWM (F03-45) both list hierarchical models as future work for long horizons.

**F03-53. The position paper's recipe for training a JEPA without collapse has four criteria: make s_x informative about x, make s_y informative about y, make s_y predictable from s_x, and keep the latent z low in information.**
- Location: section 4.5; Figure 13 caption
- Verdict: NEW
- Evidence: https://web.archive.org/web/20240101103457/https://openreview.net/pdf?id=BZ5a1r-kVsf | Tier 3, position paper | definition | "The basic principle of such training is that (1) s_x should be maximally informative about x; (2) s_y should be maximally informative about y; (3) s_y should be easily predictable from s_x; and (4) z should have minimal information content. Criteria 1, 2, and 4 collectively prevent a collapse of the energy" [function]; "Examples of such non-contrastive criteria for JEPA training include VICReg and Barlow Twins." (accessed 2026-11-20)
- Use in dive: section 7, the tension every JEPA loss has to balance: predictable (criterion 3) against informative (criteria 1 and 2). LeWM's two terms are exactly these two sides (F03-36).

### E. I-JEPA and V-JEPA (history: the image and first video instantiations)

**F03-54. I-JEPA (2023) has three networks: a context encoder that sees only the visible patches, a target encoder whose weights are an exponential moving average of the context encoder, and a narrow predictor that predicts the target encoder's outputs for masked blocks.**
- Location: Figure 3 caption; section 3
- Verdict: NEW (history)
- Evidence: https://arxiv.org/abs/2301.08243v3 | Tier 3, peer-reviewed (the arXiv comments field reads "2023 IEEE/CVF International Conference on Computer Vision"; the facebookresearch/ijepa repository description calls it "the CVPR paper"; see Contradictions) | definition | "The context encoder is a Vision Transformer (ViT), which only processes the visible context patches. The predictor is a narrow ViT that takes the context encoder output and, conditioned on positional tokens (shown in color), predicts the representations of a target block at a specific location. The target representations correspond to the outputs of the target-encoder, the weights of which are updated at each iteration via an exponential moving average of" [the context encoder weights] (accessed 2026-11-20)
- Use in dive: section 7, the three-box diagram that V-JEPA and V-JEPA 2 reuse.

**F03-55. I-JEPA masking: 4 target blocks, each 15% to 20% of the image with aspect ratio 0.75 to 1.5, and one context block of 85% to 100% of the image from which the target regions are removed.**
- Location: section 3 "Targets" and "Context"; Figure 4 caption
- Verdict: NEW (history)
- Evidence: https://arxiv.org/abs/2301.08243v3 | Tier 3, peer-reviewed | definition | "Given an image, we randomly sample 4 target blocks with scale in the range (0.15, 0.2) and aspect ratio in the range (0.75, 1.5). Next, we randomly sample a context block with scale in the range (0.85, 1.0) and remove any overlapping target blocks. Under this strategy, the target-blocks are relatively semantic, and the context-block is informative, yet sparse (efficient to process)." (accessed 2026-11-20)
- Use in dive: section 7, why blocks and not scattered patches: a large block cannot be filled in by copying neighbours, so the model has to know what the object is.

**F03-56. I-JEPA loss: the average squared (L2) distance between predicted and target patch representations. The target encoder's EMA momentum starts at 0.996 and rises linearly to 1.0.**
- Location: section 3 "Loss"; appendix A.1
- Verdict: NEW (history)
- Evidence: https://arxiv.org/abs/2301.08243v3 | Tier 3, peer-reviewed | definition | "The loss is simply the average L2 distance between the predicted patch-level representations s-hat_y(i) and the target patch-level representation s_y(i)"; "The target-encoder weights are identical to the context-encoder weights at initialization, and updated via an exponential moving average thereafter. We use a momentum value of 0.996, and linearly increase this value to 1.0 throughout pretraining" (accessed 2026-11-20)
- Use in dive: section 7 history table: I-JEPA L2 with a ramped EMA; V-JEPA and V-JEPA 2 L1; V-JEPA 2 fixed EMA 0.99925 (F03-8); LeWM L2 with no EMA (F03-35).

**F03-57. I-JEPA training compute as published: a ViT-Huge/14 on ImageNet with 16 A100 GPUs in under 72 hours, stated as less than 1,200 GPU-hours and over 10 times more efficient than a ViT-H/14 trained by pixel reconstruction (MAE).**
- Location: abstract; section 1 contributions
- Verdict: NEW (history)
- Evidence: https://arxiv.org/abs/2301.08243v3 | Tier 3, peer-reviewed | benchmark claim (author reported) | "we train a ViT-Huge/14 on ImageNet using 16 A100 GPUs in under 72 hours"; "Pretraining a ViT-H/14 on ImageNet requires less than 1200 GPU hours, which is over 2.5x faster than a ViT-S/16 pretrained with iBOT and over 10x more efficient than a ViT-H/14 pretrained with MAE. Predicting in representation space significantly reduces the total computation needed for self-supervised pretraining." (accessed 2026-11-20)
- Use in dive: section 7 compute history `[author reported]`. [derived] 16 x 72 = 1,152 GPU-hours, consistent with "less than 1200".

**F03-58. The I-JEPA predictor is deliberately narrow: width 384 whatever the encoder size, depth 12 for ViT-L and ViT-H encoders.**
- Location: appendix A.1 "Architectures"
- Verdict: NEW (history)
- Evidence: https://arxiv.org/abs/2301.08243v3 | Tier 3, peer-reviewed | definition | "the predictor is designed as a light-weight (narrow) ViT architecture. Specifically, we fix the embedding dimension of the predictor to 384 ... For ViT-L/16, ViT-H/16, and ViT-H/14 context-encoders, we set the depth of the predictor to 12." (accessed 2026-11-20)
- Use in dive: section 7. V-JEPA 2 keeps exactly this predictor shape (F03-4, F03-5).

**F03-59. V-JEPA (2024) moves the same idea to video: tokens are 16 x 16 pixel patches spanning 2 consecutive frames, and a 16-frame 224 x 224 clip becomes 8 x 14 x 14 = 1,568 tokens.**
- Location: section 3.2 "Network Parameterization"; appendix B
- Verdict: NEW (history)
- Evidence: https://arxiv.org/abs/2404.08471v1 | Tier 3, preprint | definition | "we split the video clip into a 3D grid of L spatio-temporal patches, where a patch consists of a 16 x 16 pixel block spanning 2 consecutive frames; we refer to these spatio-temporal patches as tokens."; "we apply a 3D convolution comprising d filters of size 2 x 16 x 16 with a temporal stride of 2 and a spatial stride of 16, resulting in a tensor of shape 8 x 14 x 14 x d. ... resulting in a 1D token sequence of shape 1568 x d." (accessed 2026-11-20)
- Use in dive: section 7, the tubelet arithmetic from its source (the 224-pixel case; the 256-pixel case is in the teaching section).

**F03-60. V-JEPA masking hides about 90% of the tokens: the union of 8 blocks of 15% of each frame ("short-range") or of 2 blocks of 70% ("long-range"), each block extended through the whole clip in time.**
- Location: section 3.2 "Prediction Task"
- Verdict: NEW (history)
- Evidence: https://arxiv.org/abs/2404.08471v1 | Tier 3, preprint | definition | "We leverage two types of masks: short-range masks, where we take the union of 8 randomly sampled target blocks covering 15% of each frame, and long-range masks, where we take the union of 2 randomly sampled target blocks covering 70% of each frame. ... the result is an average masking ratio of ~90%." (accessed 2026-11-20)
- Use in dive: section 7, mask ratio. V-JEPA 2 reuses these settings (F03-9), so its encoder processes roughly a tenth of the tokens in each training clip [our reading], which is part of why the method is cheap to train.

**F03-61. V-JEPA objective and data: L1 regression to an EMA target encoder behind a stop-gradient; trained on VideoMix2M, about 2 million videos, with batch size 3,072 and 16-frame clips of roughly 3 seconds.**
- Location: section 3.1; section 3.2 "Pretraining"
- Verdict: NEW (history)
- Evidence: https://arxiv.org/abs/2404.08471v1 | Tier 3, preprint | definition | "|| P_phi(E_theta(x), Delta_y) - sg(E-bar_theta(y)) ||_1, where sg(.) denotes a stop-gradient operation, which does not backpropagate through its argument, and E-bar_theta(.) is an exponential moving average of the network E_theta(.)."; "resulting in approximately 2 million videos. ... We use a batch size of 3072 for the ViT-L/16 and ViT-H/16 models ... Each model takes as input a video clip of 16 frames sampled with a frameskip of 4, corresponding to roughly 3 second clips" (accessed 2026-11-20)
- Use in dive: section 7 history row. V-JEPA 2 scaled the data from 2 million to 22 million videos and the encoder from 300M to 1B parameters (F03-4, F03-10).

**F03-62. V-JEPA ran the direct comparison: the same model trained to predict features beat the same model trained to predict pixels on every frozen-encoder benchmark in its Table 1.**
- Location: section 4.1; Table 1
- Verdict: NEW (history)
- Evidence: https://arxiv.org/abs/2404.08471v1 | Tier 3, preprint | ablation | Table 1 caption: "We ablate the effect of computing the prediction loss in feature space vs pixel space. All models are trained on VideoMix2M for 90K iterations with a batch size of 3072 using the multi-block prediction task. ... Predicting in feature space provide a consistent improvement over pixel space prediction." (accessed 2026-11-20)
- Use in dive: section 6, evidence behind the latent argument (an ablation on representation quality, not on planning). Table 1 rows for ViT-L/16 `[author reported]`: pixel target 68.6 (Kinetics-400), 66.0 (Something-Something v2), 73.3 (ImageNet-1K), 85.4 (Kinetics-400 fine-tuned); feature target 73.7, 66.2, 74.8, 85.6. The gap is 5.1 points on Kinetics-400 and 0.2 on Something-Something v2 [derived].

### F. Collapse and the ways each method prevents it

**F03-63. What collapse is: if the only goal is to make predicted and target representations match, the encoder can output the same vector for every input, and the loss is zero while the representation is useless.**
- Location: V-JEPA section 3.1; LeWM section 1
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2404.08471v1 | Tier 3, preprint | definition | "Naively implementing the objective using the regression ... would admit a trivial solution, where the encoder outputs a constant representation, regardless of its input." Also https://arxiv.org/abs/2603.19312v3 : "In this failure mode, the model maps all inputs to nearly identical representations to trivially satisfy the temporal prediction objective leading to unusable representations. Preventing collapse is therefore one of the central challenges in training JEPA models." (accessed 2026-11-20)
- Use in dive: section 7, collapse defined. A pixel-predicting model cannot collapse this way, because its target (the pixels) is fixed by the data and not produced by the model; the position paper says so: "A regular predictive or deterministic-generative architecture ... cannot collapse" (section 4.3 of the F03-47 source).

**F03-64. Collapse comes in two degrees: complete (all inputs map to nearly one point) and dimensional (embeddings spread out but only inside a low-dimensional subspace).**
- Location: LeJEPA section 2
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2511.08544v3 | Tier 3, preprint | definition | "JEPA's prediction task admits failure modes, such as representation collapse, where f_theta maps all inputs to nearly identical embeddings (complete collapse) or to a low-dimensional subspace (dimensional collapse)" (accessed 2026-11-20)
- Use in dive: section 7. Dimensional collapse is the harder one to see: the loss looks fine and the embeddings differ, but most of the 192 (or 1,408) numbers carry nothing.

**F03-65. Mechanism 1, EMA target plus stop-gradient (I-JEPA, V-JEPA, V-JEPA 2): the target comes from a slowly moving copy of the encoder that receives no gradient. The V-JEPA paper gives the explanation as a hypothesis borrowed from BYOL, not a proof.**
- Location: V-JEPA section 3.1 "Theoretical motivation"
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2404.08471v1 | Tier 3, preprint | definition | "The use of an exponential-moving average feature extractor along with a stop-gradient and a predictor has been used as a collapse prevention strategy for image pretraining (Grill et al., 2020)"; "The hypothesis is that incorporating an exponential moving average to compute the representation of y ensures that the predictor evolves faster than the encoder and remains close to optimal, thereby preventing collapse." (accessed 2026-11-20)
- Use in dive: section 7, mechanism 1 with its honest status (works in practice; explanation is a hypothesis). Code: F03-7 (`torch.no_grad()`), F03-8 (the update).

**F03-66. The criticism of mechanism 1 from the LeWM and LeJEPA authors: EMA and stop-gradient do not correspond to minimising a defined objective, and they are called heuristics.**
- Location: LeWM section 2; LeJEPA abstract
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2603.19312v3 | Tier 3, preprint | definition | "These approaches typically employ an exponential moving average (EMA) of the target encoder together with stop-gradient (SG) updates to stabilize training and prevent representation collapse. However, the theoretical understanding of EMA and SG remains limited, as they do not in general correspond to the minimization of a well-defined objective"; LeJEPA (https://arxiv.org/abs/2511.08544v3): "heuristics-free, e.g., no stop-gradient, no teacher-student, no hyper-parameter schedulers" (accessed 2026-11-20)
- Use in dive: section 7, why a second mechanism was sought. This is one research group's position on another's method (with LeCun an author on both sides); present it as the authors' argument.

**F03-67. Mechanism 2, variance and covariance regularisation (VICReg, 2022, history): one term keeps the standard deviation of every embedding dimension across the batch above a threshold, a second pushes the covariance between different dimensions to zero, and a third (invariance) pulls matching embeddings together.**
- Location: VICReg abstract; section 3; section 4.1 equation (6)
- Verdict: NEW (history)
- Evidence: https://arxiv.org/abs/2105.04906v3 | Tier 3, peer-reviewed (ICLR 2022, per the arXiv comments field "Accepted at ICLR 2022" and the PDF header "Published as a conference paper at ICLR 2022") | definition | "Variance: a hinge loss to maintain the standard deviation (over a batch) of each variable of the embedding above a given threshold. This term forces the embedding vectors of samples within a batch to be different. Covariance: a term that attracts the covariances (over a batch) between every pair of (centered) embedding variables towards zero. This term decorrelates the variables of each embedding and prevents an informational collapse in which the variables would vary together or be highly correlated."; "l(Z, Z') = lambda s(Z, Z') + mu [v(Z) + v(Z')] + nu [c(Z) + c(Z')]" (accessed 2026-11-20)
- Use in dive: section 7, mechanism 2. Variance stops complete collapse; covariance stops dimensional collapse. Symbols: s invariance (mean squared distance), v variance hinge, c covariance penalty; lambda, mu, nu their weights.

**F03-68. The cost of mechanism 2 for world models, per the LeWM authors: the end-to-end JEPA world model built on VICReg (PLDM) needs a seven-term loss with six tunable coefficients, against one for LeWM.**
- Location: LeWM abstract; section 4.1 "Baselines"; section 4.3
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2603.19312v3 | Tier 3, preprint | benchmark claim (author reported) | "This reduces tunable loss hyperparameters from six to one compared to the only existing end-to-end alternative."; "it relies on a seven-term training objective derived from the VICReg criterion, which introduces training instability and increases the complexity of hyperparameter tuning."; "PLDM requires search in polynomial time (O(n^6))" (accessed 2026-11-20)
- Use in dive: section 7, the practical reason SIGReg matters `[author reported]`.

**F03-69. Mechanism 3, SIGReg (LeJEPA, Nov 2025; LeWM, 2026): push the distribution of embeddings toward an isotropic Gaussian (same spread in every direction, no correlations), which the LeJEPA paper argues is the optimal distribution; one weight trades this against prediction.**
- Location: LeJEPA abstract
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2511.08544v3 | Tier 3, preprint | definition | "First, we identify the isotropic Gaussian as the optimal distribution that JEPAs' embeddings should follow to minimize downstream prediction risk. Second, we introduce a novel objective - Sketched Isotropic Gaussian Regularization (SIGReg) - to constrain embeddings to reach that ideal distribution. Combining the JEPA predictive loss with SIGReg yields LeJEPA with numerous theoretical and practical benefits: (i) single trade-off hyperparameter, (ii) linear time and memory complexity" (accessed 2026-11-20)
- Use in dive: section 7, mechanism 3. Code at tensor level: F03-38. An isotropic Gaussian has unit variance in every direction (so no complete collapse) and zero covariance (so no dimensional collapse): it enforces both VICReg conditions and the full shape of the distribution with one term [our reading].

**F03-70. Mechanism 4, contrastive negatives (history): push apart the embeddings of different inputs. The position paper argues against it because the number of negatives needed grows with the dimension of the representation.**
- Location: I-JEPA section 2; position paper section 4.3 and Figure 13 caption
- Verdict: NEW (history)
- Evidence: https://arxiv.org/abs/2301.08243v3 | Tier 3, peer-reviewed | definition | "several approaches have been investigated to prevent representation collapse, such as contrastive losses that explicitly push apart embeddings of negative examples". Position paper (F03-47 source): "As with every EBM, JEPAs can also be trained with contrastive methods. But doing so runs into the curse of dimensionality and limits the practical dimension of s_y."; "VICReg is contrastive over components, while traditional contrastive methods are contrastive over vectors, which requires a large number of contrastive samples." (accessed 2026-11-20)
- Use in dive: section 7, mechanism 4, one paragraph of history.

**F03-71. Mechanism 5, a frozen pretrained encoder: if the encoder is not trained at all while the predictor learns, it cannot collapse. V-JEPA 2-AC and DINO-WM work this way; the price is that the representation is whatever the pretrained encoder kept.**
- Location: LeWM section 2; LeWM Figure 2 caption; V-JEPA 2 section 5
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2603.19312v3 | Tier 3, preprint | definition | "Some approaches rely on pretrained encoders to obtain representations. This avoids collapse but limits the expressivity of representation to the pretrained encoder used."; "Foundation-based methods (DINO-WM) avoid collapse by freezing a pre-trained vision encoder, forgoing end-to-end learning." V-JEPA 2 (https://arxiv.org/abs/2506.09985v1): "The capabilities of a representation-space world model, such as V-JEPA 2-AC discussed above, are inherently limited by the state information encoded in the learned representation space." (accessed 2026-11-20)
- Use in dive: section 7. This closes the loop on V-JEPA 2-AC: stage 1 prevents collapse with EMA and stop-gradient; stage 2 has no collapse risk because the encoder is frozen (F03-14).

### G. The JEPA line in 2025 and 2026: what is newer than V-JEPA 2

**F03-72. V-JEPA 2.1 was released on 2026-03-16 in the same repository as V-JEPA 2 (arXiv 2603.14482, latest v3 of 2026-06-11). It changes the training recipe so that visible tokens also contribute to the loss and the loss is applied at several encoder depths, and it adds a ViT-G encoder of 2B parameters alongside distilled ViT-B (80M) and ViT-L (300M) encoders.**
- Location: vjepa2 `README.md` lines 2, 45 to 48 and the "V-JEPA 2.1 Pretrained Checkpoints" table; paper abstract
- Verdict: NEW (the seed research names only V-JEPA 2)
- Evidence: https://raw.githubusercontent.com/facebookresearch/vjepa2/204698b45b3712590f06245fbfba32d3be539812/README.md | Tier 1, first-party docs | documentation of support | "[2026-03-16]: V-JEPA 2.1 is released ... A new familly of models trained with a novel recipe that learns high quality and temporolly consistent dense features"; "(1) Dense Predictive Loss, a masking-based self-supervision objective where all tokens (both visible/context and masked tokens) contribute to the self-supervised training loss; (2) Deep Self-Supervision, which applies the self-supervised loss at multiple intermediate representations of the encoder models"; checkpoint table rows "ViT-B/16 80M 384 / ViT-L/16 300M 384 / ViT-g/16 1B 384 / ViT-G/16 2B 384" (accessed 2026-11-20)
- Use in dive: section 7, "current version" statement: as of November 2026 the newest V-JEPA encoder family is 2.1. "Dense features" means the per-patch vectors are individually meaningful (useful for depth and for locating things), not only their average.

**F03-73. V-JEPA 2.1 with the same 300M action-conditioned predictor recipe improves real-robot grasping: 70% grasp success at the V-JEPA 2 planning settings against 60% for V-JEPA 2, and 80% when planning over a horizon of 8 with 300 samples and 15 iterations. Pick-and-place stays at 80%.**
- Location: V-JEPA 2.1 section 5.4; Table 6
- Verdict: NEW
- Wave 2 (2026-11-20, SCOPE NARROWER): One object (a cup), 10 trials per skill. V-JEPA 2.1 raises grasp success from 60% to 70% at the V-JEPA 2 planning settings (800 samples, 10 iterations, horizon 1, 3 s) and to 80% with horizon 8 (300 samples, 15 iterations, 14 s per action); pick-and-place stays at 80% [author reported]. The paper's body says a 10% improvement and its caption and abstract say 20%; the 20% is the longer-horizon setting. The V-JEPA 2 baseline here (60%) differs from the 65% cup grasp in the V-JEPA 2 paper's own Table 2.
- Evidence: https://arxiv.org/abs/2603.14482v3 | Tier 3, preprint (Meta FAIR) | benchmark claim (author reported) | Table 6 rows: "VJEPA 2 (Assran et al., 2025) 800 10 1 3 sec. 100% 60% 80%" / "VJEPA 2.1 (ours) 800 10 1 3 sec. 100% 70% 80%" / "300 15 8 14 sec. 100% 80% 80%" (columns #Samples, Iter., Horizon, Time, Reach, Grasp, Pick-&-Place); "the predictor is an identical 24-layer transformer network containing approximately 300M parameters, and is trained on the Droid raw dataset ... using both a teacher-forcing and two-step rollout loss." (accessed 2026-11-20)
- Use in dive: section 7 `[author reported]`. [derived] 300 x 15 x 8 = 36,000 predictor steps per action for the horizon-8 setting. The table is for a cup, 10 trials per skill, one lab.

**F03-74. The same Table 6 reports 3 seconds per action for the 800-sample, 10-iteration, horizon-1 plan on a single A100, where the V-JEPA 2 paper reported 16 seconds on a single RTX 4090 for the same settings.**
- Location: V-JEPA 2.1 Table 6 caption and rows; V-JEPA 2 Table 3
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2603.14482v3 | Tier 3, preprint | benchmark claim (author reported) | "In both cases we leverage the cross-entropy method (Rubinstein, 1997) for optimizing the sequence of actions using a single A100 GPU."; row "VJEPA 2 (Assran et al., 2025) 800 10 1 3 sec." (accessed 2026-11-20)
- Use in dive: sections 7 and compute table. Two first-party figures for the same plan: 16 s (RTX 4090, 2025 paper) and 3 s (A100, 2026 paper). Neither paper explains the difference; see Contradictions. Quote both with their hardware.

**F03-75. RoboJEPA (arXiv 2610.10515v1, 7 Oct 2026; code facebookresearch/robo_jepa) is the newest JEPA robot world model found in this pass: action-conditioned predictors from 22M to 8B parameters trained on top of a frozen V-JEPA 2.1 ViT-G encoder, on 23 public datasets from 12 robot embodiments.**
- Location: abstract; section 2; repository README at SHA `f93106f5f4a451fd526d51778aa8ab7c852eb824`
- Verdict: NEW (not in the seed research)
- Evidence: https://arxiv.org/abs/2610.10515v1 | Tier 3, preprint (Meta FAIR) | definition | "we present RoboJEPA, a world model based on the Joint Embedding Predictive Architecture (JEPA) and trained on a large-scale dataset spanning 12 robotic embodiments. ... RoboJEPA, at 8B parameters, is the largest JEPA predictor model trained to date."; "It is trained with a plain l1 regression loss in the frozen encoder's latent space. RoboJEPA operates in the representation space of a frozen V-JEPA 2.1 encoder ... and is trained on a unified mixture of 23 public manipulation datasets spanning 12 embodiments and 26 different action spaces." README: "All world models share the frozen V-JEPA 2.1 ViT-G/384 encoder (1664-dim features) and differ in predictor size." (accessed 2026-11-20)
- Use in dive: section 7, the state of the art in November 2026. It is the V-JEPA 2-AC recipe (frozen encoder, L1 loss, teacher forcing plus rollout, CEM planning) scaled up 27 times in predictor size (8B / 0.3B).

**F03-76. RoboJEPA's training data: 15,022 hours of robot video, of which 6,692 hours carry synchronised actions, about 2.87 million trajectories. V-JEPA 2-AC used under 62 hours.**
- Location: section 2.1 "Data"; related work
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2610.10515v1 | Tier 3, preprint | definition | "The compiled dataset contains 15,022 hours of video, including 6,692 hours synchronized with actions; some demonstrations are recorded from multiple cameras."; "datasets (a mixture of approximately 2.87M trajectories across 12 robot platforms)" (accessed 2026-11-20)
- Use in dive: section 7 data scale. [derived] 15,022 / 62 is about 242 times the V-JEPA 2-AC video hours.

**F03-77. RoboJEPA plans toward one goal image with no sub-goals, on several GPUs at once: 4,096 CEM samples per iteration, 15 iterations on the first plan and 10 afterwards, horizon 5, 2 actions executed per replan, 20 environment steps per episode. The authors describe the speed as "not real-time" and "several seconds" per plan for the 8B model.**
- Location: section 2.2; appendix Table 13
- Verdict: NEW
- Wave 2 (2026-11-20, SCOPE NARROWER): The 4,096 samples per iteration (15 cold and 10 warm iterations, horizon 5, 2 actions per replan, 20 steps) is the real-robot DROID/Franka configuration of Table 13; the simulated RoboCasa runs use 1,024 samples and an execution prefix of 1. No measured seconds-per-plan figure is printed; "several seconds" is the authors' wording.
- Evidence: https://arxiv.org/abs/2610.10515v1 | Tier 3, preprint | definition | Table 13: "Planning horizon (predictor steps) H 5 / Context length (encoder steps) Lctx 2 / Execution prefix (actions per replan) Lexec 2 / Environment steps per episode 20 / CEM iterations (cold / warm) I0 / Istep 15 / 10 / Samples per iteration (global) Nsamp.M.G 4096 / Elite count, top-k 20"; "since CEM planning is heavily parallelizable, we connect the robot directly to the GPU cluster and run the planning on multiple GPUs. This way, we make the planning fast enough to be practical: while it is not real-time, it takes only several seconds to perform a multi-step planning even for an 8B model."; "we use only a single image goal that represents the final state of the task, and we do not use subgoals." (accessed 2026-11-20)
- Use in dive: section 7 planning comparison. [derived] Warm plan: 4,096 x 10 x 5 = 204,800 predictor steps; cold plan: 4,096 x 15 x 5 = 307,200. The planner GPU count for the real-robot runs is not in the lines read (UNKNOWN U9).

**F03-78. RoboJEPA real-robot results on a Franka (success %, image goal): the 8B model reaches 67 on grasp, 50 on object lift and 27 on pick-and-place; the text-conditioned pi0.5 reference reaches 5, 0 and 53. The authors call the policy numbers "contextual references rather than directly comparable baselines".**
- Location: section 4.3; Table 3
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2610.10515v1 | Tier 3, preprint | benchmark claim (author reported) | Table 3 (Progress / Success per task): "pi0-FAST 35 22 20 12 55 40 / pi0.5 25 5 12 0 69 53 / RoboJEPA-4B 60 60 54 30 49 21 / RoboJEPA-8B 67 67 65 50 42 27"; "These differences make the VLA results contextual references rather than directly comparable baselines." (accessed 2026-11-20)
- Use in dive: section 7, an honest scorecard `[author reported]`: with one goal image and no sub-goals, pick-and-place by latent planning is at 27% for the largest model, below the policy reference on that task and above it on the other two.

**F03-79. RoboJEPA's stated limits: the encoder stays frozen, the fits are close to data saturation, there is no language input, and actions are sampled without a learned proposal.**
- Location: section 6 (conclusion)
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2610.10515v1 | Tier 3, preprint | definition | "We scaled the predictor while keeping the V-JEPA 2.1 encoder frozen, so our laws describe a dynamics model on top of a fixed representation rather than the encoder and predictor jointly. Because we train for multiple epochs over a fixed corpus, our fits already sit close to data saturation, so pushing the frontier further will likely require more and more diverse interaction data rather than parameters alone. RoboJEPA also makes no use of text, planning instead toward a single image goal, and it makes no use of a learned policy proposal during planning" (accessed 2026-11-20)
- Use in dive: section 7 limits; link to section on data.

**F03-80. RoboJEPA training hardware as stated for one size: the 1B predictor run uses 256 data-parallel ranks, 32 nodes of 8 H100 GPUs. Inference profiling is reported on a single H200.**
- Location: appendix C.2; appendix I
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2610.10515v1 | Tier 3, preprint | benchmark claim (author reported) | "The 1B run uses Wddp=256 data-parallel ranks (32 nodes x 8 H100s)"; "All numbers are wall-clock measurements on a single NVIDIA H200 (140 GB HBM3) running PyTorch 2.9, on the 1 B predictor at 240p ... Naive BF16 inference is bound by host-side dispatch, not by matrix multiplication. At steady state (B=16, full KV cache, 2-view) GEMMs take only ~26% of GPU time, attention ~41%" (accessed 2026-11-20)
- Use in dive: section 7 compute; a workload-shape fact for the profiling sections (latent world-model inference at small batch is limited by CPU-side dispatch until compiled). Total GPU-hours per model size were not extracted (UNKNOWN U9).

**F03-81. "JEPA-WMs" is a named family: the paper "What Drives Success in Physical Planning with Joint-Embedding Predictive World Models?" (arXiv 2512.24497v4; TMLR, May 2026) defines it as world models trained only by a predictive loss in embedding space, and finds that CEM with an L2 cost plans best overall and that larger encoders and deeper predictors help on real-robot data but not in simple simulations.**
- Location: PDF header; section 1; section 7 (conclusion)
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2512.24497v4 | Tier 3, peer-reviewed (TMLR; PDF header "Published in Transactions on Machine Learning Research (05/2026)") | ablation | "We use the term JEPA-WM to refer to" [world models] "trained solely through a predictive loss in embedding space, with no reconstruction, reward prediction, or" [other auxiliary signal; sentence spans a line break]; "On the planning side, we found that CEM L2 performs best overall. ... Gradient-based planners (GD and Adam) excel on tasks with smooth cost landscapes like Metaworld, but fail on 2D navigation or contact-rich manipulation tasks due to local minima."; "on real-world data (DROID and Robocasa), both larger encoders and deeper predictors yield consistent improvements" (accessed 2026-11-20)
- Use in dive: section 7, an independent-of-vendor study (same lab family, peer reviewed) of which design choices matter; supports teaching CEM as the default planner.

**F03-82. The same paper reports a bug in the released V-JEPA 2-AC training code: the two-step rollout loss compares the rollout with the wrong target frame.**
- Location: appendix "V-JEPA-2-AC reproduction"
- Verdict: NEW
- Wave 2 (2026-11-20, STALE; closes U5): The public repository changed the rollout-loss line nine days after release: commit 93366fe723bc8980fd6e170f9eef221ec2091e70 (2025-06-20), "fix rollout loss term to predict z_3 from z_1 and \hat{z}_2, not from z_1 and \hat{z}_3". The code at the SHA this dive pins (204698b4) computes the rollout as the paper describes. Not established: that the commit and the JEPA-WMs note describe the same defect, or whether the released checkpoint was retrained after the fix. Replacement: the JEPA-WMs authors report that the code which produced the V-JEPA 2 paper's robot results miscomputed the two-step rollout loss; the repository fixed that line in June 2025.
- Evidence: https://arxiv.org/abs/2512.24497v4 | Tier 3, peer-reviewed (TMLR) | code behaviour (third-party report on first-party code, same organisation) | "To reproduce the V-JEPA-2-AC results, we find a bug in the code that yields the official results of the paper. The 2-step rollout loss is miscomputed, what is actually computed for this loss term is || P_phi(a_1:T, s_1, z_1) - z_T ||_1 in the paper's notations. ... We fix this bug and retrain the models." (accessed 2026-11-20)
- Use in dive: a caution beside F03-19 when quoting `app/vjepa_droid/train.py`. Whether the pinned SHA still has the behaviour was not checked line by line here (UNKNOWN U5).

**F03-83. LeJEPA (arXiv 2511.08544v3, 14 Nov 2025) is the image-pretraining paper that introduced SIGReg. It reports 79% ImageNet-1k linear-probe accuracy with a ViT-H/14 and states the implementation needs about 50 lines of code.**
- Location: abstract
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2511.08544v3 | Tier 3, preprint | benchmark claim (author reported) | "(v) distributed training-friendly implementation requiring only ~50 lines of code. ... using imagenet-1k for pretraining and linear evaluation with frozen backbone, LeJEPA reaches 79% with a ViT-H/14." (accessed 2026-11-20)
- Use in dive: section 7 lineage: LeJEPA (images, Nov 2025) supplies the regulariser; LeWorldModel (Mar 2026) applies it to action-conditioned world models.

**F03-84. VL-JEPA (arXiv 2512.10942v2, 2 Feb 2026) applies the JEPA idea to vision-language: it predicts continuous embeddings of the target text and decodes to words only when needed, with 1.6B parameters.**
- Location: abstract
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2512.10942v2 | Tier 3, preprint (Meta FAIR) | definition | "Instead of autoregressively generating tokens as in classical VLMs, VL-JEPA predicts continuous embeddings of the target texts. ... VL-JEPA achieves stronger performance while having 50% fewer trainable parameters. At inference time, a lightweight text decoder is invoked only when needed to translate VL-JEPA predicted embeddings into text." (accessed 2026-11-20)
- Use in dive: section 7, one line: the same "predict the embedding, not the raw output" move applied to text. It is not a robot world model.

**F03-85. Yann LeCun's post-Meta company is Advanced Machine Intelligence (AMI Labs). Its site states an official launch on 2026-03-10 with a round of 1.03 billion US dollars, and describes its aim as world models that predict in representation space. The site lists no released model, paper or code.**
- Location: https://amilabs.xyz/ (home) and https://amilabs.xyz/updates
- Verdict: NEW
- Evidence: https://amilabs.xyz/updates | Tier 2, first-party company page | production report (company statement) | "March 10, 2026 - Updates: Official launch. Advanced Machine Intelligence (AMI) is building a new breed of AI systems that understand the world, have persistent memory, can reason and plan, and are controllable and safe. We've raised a $1.03B USD (~EUR 890M) round from global investors ... We are a growing team of researchers and builders, operating in Paris, New York, Montreal and Singapore from day one."; home page: "AMI is developing world models that learn abstract representations of real-world sensor data, ignoring unpredictable details, and that make predictions in representation space. Action-conditioned world models allow agentic systems to predict the consequences of their actions, and to plan action sequences to accomplish a task, subject to safety guardrails." (accessed 2026-11-20)
- Use in dive: section 7, one sentence on where the idea's originator is working. The home page never uses the word "JEPA"; calling its approach JEPA is [our reading] of "predictions in representation space". Press articles (Tier 4) were used only to find the domain.

**F03-86. LeWorldModel's authors are at Mila and Universite de Montreal, New York University, Samsung SAIL and Brown University; the paper carries no Meta or AMI affiliation.**
- Location: LeWM title block
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2603.19312v3 | Tier 3, preprint | definition | "Lucas Maes*1 Quentin Le Lidec*2 Damien Scieur1,3 Yann LeCun2 Randall Balestriero4 / 1 Mila & Universite de Montreal 2 New York University 3 Samsung SAIL 4 Brown University" (accessed 2026-11-20)
- Use in dive: attribution. Describe LeWM as an academic paper with LeCun as co-author, not as a Meta or AMI release.

### H. What a world model is for

**F03-87. A world model predicts the future state of the world from past observations and actions.**
- Location: JEPA-WMs paper section 1; LeWM section 1
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2512.24497v4 | Tier 3, peer-reviewed (TMLR) | definition | "Ha & Schmidhuber (2018) proposed the idea of a world model, that is, a model predicting the future state of the world, given a context of past observations and actions." Also https://arxiv.org/abs/2603.19312v3 : "World Models (WMs) are a powerful family of methods that learn to predict the consequences of actions in the environment." (accessed 2026-11-20)
- Use in dive: section 6 opening definition. For the arm: given what the camera shows now and "move the gripper 5 cm left", predict what the camera will show next.

**F03-88. The uses named in the primary sources: planning by trying action sequences inside the model, improving a policy inside the model ("in imagination"), generating synthetic experience, and evaluating what would have happened under other actions.**
- Location: LeWM section 1; RoboJEPA related work
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2603.19312v3 | Tier 3, preprint | definition | "When successful, WMs allows agents to plan and to improve themselves solely form their model of the world, i.e., in imagination space. This is particularly valuable in the offline setting, where agents must learn from fixed datasets without environment interaction - leveraging the model to generate synthetic experience and evaluate counterfactual action sequences". RoboJEPA (https://arxiv.org/abs/2610.10515v1): "The same world model can then be used to evaluate or improve any policy, and to plan zero-shot for new goals at test time." (accessed 2026-11-20)
- Use in dive: section 6, the list of five uses (planning, policy training in imagination, synthetic data, policy evaluation, and the model as the policy: F03-93).

**F03-89. Policy training in imagination, history: DreamerV3 (arXiv 2301.04104, v2 of 2024-04-17) learns a world model and improves its behaviour by imagining future scenarios; its world model predicts future representations and rewards and learns its representations through autoencoding (reconstruction).**
- Location: abstract; section "World model learning"
- Verdict: NEW (history)
- Evidence: https://arxiv.org/abs/2301.04104v2 | Tier 3, preprint (venue not confirmed in this pass) | definition | "Dreamer learns a model of the environment and improves its behavior by imagining future scenarios."; "The world model learns compact representations of sensory inputs through autoencoding and enables planning by predicting future representations and rewards for potential actions." (accessed 2026-11-20)
- Use in dive: section 6 history. Dreamer also predicts in a latent space, but it keeps a pixel reconstruction loss and needs rewards; a JEPA world model has neither (the JEPA-WMs paper draws this line: "with no reconstruction, reward prediction, or value/policy heads, unlike methods such as MuZero, PlaNet or the Dreamer series").

**F03-90. Dreamer 4 exists (arXiv 2509.24527v1, 29 Sep 2025): a 2B-parameter world model (400M tokenizer, 1.6B dynamics) trained on 256 to 1,024 TPU-v5p chips that runs interactively in real time on a single H100, and an agent trained by reinforcement learning inside it reaches diamonds in Minecraft from offline data only.**
- Location: abstract; section 4 "Experiments"
- Verdict: NEW (the seed research does not name Dreamer 4)
- Evidence: https://arxiv.org/abs/2509.24527v1 | Tier 3, preprint (Google DeepMind) | benchmark claim (author reported) | "We introduce Dreamer 4, a scalable agent that learns to solve control tasks by reinforcement learning inside of a fast and accurate world model. ... The world model achieves real-time interactive inference on a single GPU through a shortcut forcing objective and an efficient transformer architecture."; "We train models with 2B parameters - 400M for the tokenizer and 1.6B for the dynamics model - on 256 to 1024 TPU-v5p"; "We measure the inference speed of each model on a single H100 GPU. Dreamer 4 and Lucid-v1 achieve real-time interactive inference by exceeding the 20 FPS of the Minecraft physics engine" (accessed 2026-11-20)
- Use in dive: section 6, the current end of the Dreamer line `[author reported]`. Its world model generates pixels through a tokenizer and a flow-style objective; its main result is in a video game, with a robotics dataset shown qualitatively (Figure 6).

**F03-91. Dreamer 4 reports that action conditioning needs far less labelled data than video: with 100 hours of actions out of 2,541 hours of video, it reaches 85% of the PSNR and 100% of the SSIM of a model trained with all actions.**
- Location: section 4.3 "Action generalization"; Figure 7
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2509.24527v1 | Tier 3, preprint | ablation | "With only 10 hours of actions, Dreamer 4 achieves 53% PSNR and 75% SSIM compared to a model trained with all actions. With 100 hours of actions, the performance increases further to 85% PSNR and 100% SSIM." (accessed 2026-11-20)
- Use in dive: section 6, the pattern shared with V-JEPA 2 (1M hours of video, 62 hours with actions, F03-1): learn how the world moves from unlabelled video, learn what actions do from a small labelled set.

**F03-92. A world model used as a robot simulator for evaluating policies is a shipped product category: NVIDIA lists Cosmos3-Nano-Sim-Bimanual for "closed-loop interactive robot policy simulation", and the Genie 4 page describes agents learning in generated worlds.**
- Location: NVIDIA/Cosmos `README.md` "Example checkpoints" table; Genie model page
- Verdict: CARRIED (seed 02, re-fetched)
- Evidence: https://github.com/NVIDIA/Cosmos (repo root; README read at SHA `0eab578a8935e26aa41c2b7dc9f5ab00f790a037`) | Tier 1, first-party docs | documentation of support | "Cosmos3-Nano-Sim-Bimanual | Nano | Closed-loop interactive robot policy simulation"; https://deepmind.google/models/genie/ : "generating worlds where agents - like SIMA - can learn new skills." (accessed 2026-11-20)
- Use in dive: section 6, use number four (evaluation without a robot). Correlation-with-real figures belong to the evaluation stream.

**F03-93. A world-action model (WAM) is one model that predicts future observations and the robot's actions together. The term is defined in the DreamZero paper (arXiv 2602.15922v1, 17 Feb 2026).**
- Location: DreamZero section 1; section 2
- Verdict: CARRIED (seed 01, re-fetched)
- Evidence: https://arxiv.org/abs/2602.15922v1 | Tier 3, preprint (NVIDIA) | definition | "We term this architecture a World Action Model (WAM) - a foundation model designed to predict both actions and visual future states in an aligned manner."; "We use the term World Action Models (WAMs) rather than Video Action Models (VAMs) to reflect that video is just one possible world modeling objective - future WAMs may align actions with other predictive modalities such as tactile sensing, force feedback, or learned latent representations." (accessed 2026-11-20)
- Use in dive: section 6, use number five (the world model is the policy). Note the last clause: the WAM authors themselves leave room for predicting latent representations instead of video.

### I. World models that generate pixels (current versions, November 2026)

**F03-94. The current Cosmos family is Cosmos 3, released 2026-05-31, in three sizes: Super 64B, Nano 16B and Edge 4B parameters (Edge released July 2026). An "Interactive World Simulation" set of example checkpoints was added in October 2026. The Cosmos-Predict2.5 repository says it is no longer under active development.**
- Location: NVIDIA/Cosmos `README.md` "What's new" and "Models"; Cosmos3-Nano model card "Release Date"; cosmos-predict2.5 README
- Verdict: CARRIED (seed 02, re-fetched)
- Wave 2 (2026-11-20, SCOPE NARROWER (date)): Write "end of May 2026" or cite the tag date: the GitHub tag `Cosmos3` and the press release are dated 2026-06-01 and the README says "May 2026"; 2026-05-31 is not printed by either.
- Evidence: https://github.com/NVIDIA/Cosmos (README at SHA `0eab578a8935e26aa41c2b7dc9f5ab00f790a037`) | Tier 1, first-party docs | documentation of support | "[Oct 2026] ... Interactive World Simulation with Cosmos for Physical AI - example model checkpoints and training recipes"; "[Jul 2026] Cosmos3-Edge released - the 4B tier for on-device, real-time deployment (Jetson AGX Orin / Thor / RTX Pro 6000)."; "[May 2026] Cosmos 3 released"; table "Cosmos3-Super | 64B | H200 / B200 / GB200", "Cosmos3-Nano | 16B | RTX Pro 6000 / H100 / B200", "Cosmos3-Edge | 4B | Jetson AGX Orin / Thor / RTX Pro 6000". Model card https://huggingface.co/nvidia/Cosmos3-Nano (revision `45666784803b3a7ad577e0def405f9afcc3bddb2`): "Hugging Face 05/31/2026". cosmos-predict2.5 README at SHA `a2c298b0a3df3778b973fe65e9e58877b292d8a7`: "This repository is no longer under active development and will receive only limited maintenance updates." (accessed 2026-11-20)
- Use in dive: section 6 currency: say "Cosmos 3", not Predict 2.5.

**F03-95. Cosmos 3 architecture: one "Mixture-of-Transformers" with two modes sharing weights, an autoregressive transformer for text (reasoning) and a diffusion transformer over noisy image, video, audio and action tokens (generation), trained with a rectified flow matching objective.**
- Location: NVIDIA/Cosmos `docs/reference/models.md` "Architecture"; Cosmos 3 paper section 4.1 "Training objective"
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/NVIDIA/Cosmos/0eab578a8935e26aa41c2b7dc9f5ab00f790a037/docs/reference/models.md | Tier 1, first-party docs | definition | "Cosmos 3 is built on a unified Mixture-of-Transformers (MoT) architecture combining an autoregressive transformer (reasoning; causal self-attention, next-token prediction) with a diffusion transformer (generation; full attention over noisy image/video/audio/action tokens)." Paper https://arxiv.org/abs/2606.02800v4 : "The Cosmos 3 generator is optimized under a rectified flow matching objective across all modalities." (accessed 2026-11-20)
- Use in dive: section 6, answer to "diffusion or autoregressive or flow": both towers, with flow matching for the generating side. In plain words, generation starts from noise and is refined over a number of steps (35 in the model card's examples) until it is a clean clip.

**F03-96. Cosmos 3 does not generate raw pixels directly either: a frozen video VAE (the Wan2.2-TI2V-5B encoder) compresses video 4 times in time and 32 by 32 in space, and the transformer generates in that compressed space; a decoder turns the result back into pixels.**
- Location: Cosmos 3 paper section 3.1
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2606.02800v4 | Tier 3, preprint (NVIDIA) | definition | "For visual generation, we use the video VAE encoder from Wan2.2-TI2V-5B ... The VAE compresses the input video temporally by 4x and spatially by 32 x 32, implemented as 16 x 16 spatial compression followed by a 2 x 2 patch merge. ... the VAE encoder for generation is kept frozen during training." (accessed 2026-11-20)
- Use in dive: section 6, a precision the latent argument needs: "pixel world model" in 2026 means "predicts a compressed code built to reconstruct every pixel". The difference from JEPA is the target: a reconstruction code (must keep all detail) versus a learned representation (free to drop detail). [derived] A 1280 x 720, 189-frame clip is about (189 / 4) x (720 / 32) x (1280 / 32) = 47 x 22.5 x 40, on the order of 42,000 latent tokens.

**F03-97. Cosmos 3 pretraining compute: Nano on 31.05 trillion tokens with 1,024 GB200 GPUs, Super on 17.86 trillion tokens with 2,048 GB200 GPUs. Days and GPU-hours are not stated.**
- Location: Cosmos 3 paper section 4.1 "Tokens trained"
- Verdict: CARRIED (seed 01, re-fetched at v4)
- Evidence: https://arxiv.org/abs/2606.02800v4 | Tier 3, preprint | benchmark claim (vendor reported) | "In the pre-training stage, Cosmos3-Nano was trained on 31.05T tokens using 1024 NVIDIA GB200 GPUs, while Cosmos3-Super was trained on 17.86T tokens using 2048 NVIDIA GB200 GPUs." (accessed 2026-11-20)
- Use in dive: section 6 and compute table `[vendor claim]`.

**F03-98. Published Cosmos3-Nano generation time for a 189-frame, 24 frames-per-second text-to-video clip on one GPU (native PyTorch, BF16): at 720p, 207.78 s on an H100 80GB, 114.85 s on a B200 and 786.37 s on an RTX PRO 6000 Blackwell; at "256p" (320 x 192), 7.61 s on the H100.**
- Location: NVIDIA/Cosmos `docs/reference/inference_benchmarks/cosmos3-nano-generator.md` "Text-to-Video (t2v)"; `benchmark_methodology.md`
- Verdict: NEW (seed 02 recorded Cosmos 3 per-clip latency as not verified)
- Evidence: https://raw.githubusercontent.com/NVIDIA/Cosmos/0eab578a8935e26aa41c2b7dc9f5ab00f790a037/docs/reference/inference_benchmarks/cosmos3-nano-generator.md | Tier 1, first-party docs | benchmark claim (vendor reported) | rows "RTX PRO 6000 Blackwell | PyTorch | 1 | 13.95 | 180.81 | 786.37", "H100 80GB HBM3 | PyTorch | 1 | 7.61 | 59.83 | 207.78", "B200 | PyTorch | 1 | 4.56 | 33.20 | 114.85" (columns GPU, Engine, GPUs, 256p, 480p, 720p; seconds). Methodology: "The 256p tier is 320x192, 480p is 832x480, and 720p is 1280x720 where those dimensions were recorded. Nano and Super primary video workloads use 189 frames at 24 FPS." (accessed 2026-11-20)
- Use in dive: sections 6 and compute table `[vendor claim]`. [derived] 189 frames / 24 = 7.875 s of video. H100 at 720p: 207.78 / 7.875 = 26.4 s of compute per second of video; at 320 x 192: 7.61 / 7.875 = 0.97 s per second. The same table lists a NIM (FP8) row at 86.16 s for 720p on the H100. NVIDIA's page warns the cells are from several campaigns and "must not be presented as a controlled cross-runtime ranking".

**F03-99. Cosmos3-Nano used as an action-conditioned world model ("Forward Dynamics - Robot": first observation plus an action trajectory in, rollout video out) is listed at about 2.0 s per rollout on an H100 80GB and 3.7 s on an RTX PRO 6000 Blackwell in native PyTorch. The rollout length for that row is not published.**
- Location: same file, "Forward Dynamics - Robot"; "Workload definitions"; methodology "Reproduction limits"
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/NVIDIA/Cosmos/0eab578a8935e26aa41c2b7dc9f5ab00f790a037/docs/reference/inference_benchmarks/cosmos3-nano-generator.md | Tier 1, first-party docs | benchmark claim (vendor reported) | "Forward dynamics | Initial visual observation and an action trajectory | Future-observation rollout video"; rows "RTX PRO 6000 Blackwell | PyTorch | 1 | 3.74 | 3.73 | 3.72" and "H100 80GB HBM3 | PyTorch | 1 | 2.00 | 2.01 | 1.98"; methodology: "Action rollout lengths, action chunks, and transfer inputs are separate workload dimensions" and "Exact prompts, seeds, action payloads, runtime builds, and warmup/repetition counts were not retained with every historical measurement." (accessed 2026-11-20)
- Use in dive: compute table `[vendor claim]`: the nearest first-party figure to "one imagined rollout of a pixel world model in 2026". [derived] A CEM plan of 800 candidates x 10 iterations would be 8,000 such rollouts, or about 16,000 GPU-seconds (4.4 GPU-hours) at 2.0 s each if run one at a time; batching behaviour is not published.

**F03-100. Genie 3 (Google DeepMind, 5 Aug 2025): an interactive world generated from a text prompt, navigable in real time at 24 frames per second at 720p, consistent for a few minutes. DeepMind tested it as a training environment for its SIMA agent.**
- Location: DeepMind blog "Genie 3: A new frontier for world models"
- Verdict: CARRIED (seed 02, re-fetched)
- Evidence: https://deepmind.google/blog/genie-3-a-new-frontier-for-world-models/ | Tier 2, first-party lab blog | benchmark claim (vendor reported) | "Given a text prompt, Genie 3 can generate dynamic worlds that you can navigate in real time at 24 frames per second, retaining consistency for a few minutes at a resolution of 720p."; "To test the compatibility of Genie 3 created worlds for future agent training, we generated worlds for a recent version of our SIMA agent" (accessed 2026-11-20)
- Use in dive: section 6 history of interactive world models `[vendor claim]`. No model size, hardware or cost is published.

**F03-101. Genie 4 is the current Genie: the DeepMind model page is titled "Genie 4", adds natively generated audio, states a limit of around a minute of continuous interaction, is offered through Project Genie, the Gemini API and Google AI Studio, and describes early robotics experiments. The page carries no date, frame rate, resolution, model size or hardware.**
- Location: https://deepmind.google/models/genie/
- Verdict: STALE (seed 02 treated Genie 3 as current and Genie 4 as unverified; the first-party page now presents Genie 4)
- Evidence: https://deepmind.google/models/genie/ | Tier 2, first-party lab page | documentation of support | "Genie 4 is our most realistic and interactive world model yet."; "The model currently supports around a minute of continuous interaction, rather than extended sessions."; "Genie 4 is now available in Project Genie, starting with eligible Google AI Ultra subscribers, and the Gemini API and Google AI Studio."; "We're exploring early applications of Genie 4 for robotics. In this example, Gemini 4 Argon creates a detailed multi-step plan to complete a task. The steps are shared as text captions to Genie 4 as the simulation is rendering." (accessed 2026-11-20)
- Use in dive: section 6 currency. The launch date (press says 27 Oct 2026, Tier 4) is not on the first-party page: UNKNOWN U7.

**F03-102. The 1X World Model (12 Jan 2026) uses a 14B video generation model as the policy backbone: it generates 5 seconds of video of the robot doing the task, and a separate inverse dynamics model extracts the actions. One inference takes 11 seconds on multiple GPUs plus 1 second for the action extraction.**
- Location: 1X post "World Model: self-learning" (section "The 1XWM training and inference recipe")
- Verdict: CARRIED (seed 01, re-fetched)
- Evidence: https://www.1x.tech/discover/world-model-self-learning | Tier 2, first-party company blog | production report (vendor reported) | "The 1XWM backbone is built upon a 14B generative video model."; "We train on 900 hours of egocentric human video ... We then fine-tune on 70 hours of robot data"; "Today, the 1XWM backbone takes 11 seconds to run, using multi-gpu inference ... Each inference generates 5 seconds of real-time video, and the IDM takes 1 second to extract actions from the generated rollout."; chart labels "1 GENERATION 30%" and "8 GENERATIONS 45%" (accessed 2026-11-20)
- Use in dive: section 6 `[vendor claim]`. [derived] 12 s of compute for 5 s of motion. An inverse dynamics model answers "which actions take the robot from this frame to that one". GPU type and count are not stated.

**F03-103. DreamZero is a 14B autoregressive video diffusion transformer that outputs video and actions together. Unoptimised it needs about 5.7 seconds per action chunk on one GPU; with the authors' optimisations it runs at 7 Hz on 2 GB200 GPUs, and they note that vision-language-action policies run above 20 Hz on consumer GPUs.**
- Location: abstract; section 3.2; section 6
- Verdict: CARRIED (seed 01, re-fetched)
- Evidence: https://arxiv.org/abs/2602.15922v1 | Tier 3, preprint (NVIDIA) | benchmark claim (vendor reported) | "we enable a 14B autoregressive video diffusion model to perform real-time closed-loop control at 7Hz"; "a naive implementation of DreamZero on a single GPU requires approximately 5.7 seconds per action chunk"; "we enable DreamZero to run at 7Hz using 2 GB200s. However, compared to current VLAs which runs up to over 20Hz on consumer GPUs, DreamZero is still computationally expensive due the large parameter size and the iterative denoising nature of video" (accessed 2026-11-20)
- Use in dive: section 6, world-action model cost `[vendor claim]`. No DreamZero successor paper was located in this pass; the same group's next release is GR00T 2 (F03-104).

**F03-104. GR00T 2 (NVIDIA, November 2026) is a world-action model: a single 2B-parameter transformer, built on Cosmos-Predict2.5-2B, that predicts future multi-view video and robot actions together with flow matching. It predicts an action chunk in a median 153 ms on an RTX 5090; GR00T 2 Turbo does so in 124 ms on a Jetson Thor.**
- Location: GR00T 2 whitepaper section 2 "Architecture" and "GR00T 2 Turbo"; project page
- Verdict: WRONG (seed 01 heading says DreamZero is "the WAM that GR00T N2/GR00T 2 builds on"; the whitepaper says GR00T 2 is built on Cosmos-Predict2.5-2B, and names DreamZero only as a compared policy in a figure)
- Wave 2 (2026-11-20, SCOPE NARROWER (latency); HOLDS (architecture)): The 153 ms is one robot and one configuration after NVIDIA's inference optimisations: Dexter, three camera views, RTX 5090 (449 ms unoptimised). The YAM arms take 180 ms (551 ms unoptimised). GR00T 2 Turbo takes 124 ms on the Unitree G1's Jetson Thor at 120 W and 38 ms on an RTX 5090 [vendor claim, whitepaper Table 27]. Code is "Available in December", so none of this can be reproduced today. The source is an NVIDIA whitepaper dated November 2026, not an arXiv preprint.
- Evidence: https://research.nvidia.com/labs/gear/gr00t-2/assets/gr00t2_whitepaper.pdf | Tier 2, first-party lab technical report (not on arXiv as of this pass) | definition and benchmark claim (vendor reported) | "GR00T 2 is built on Cosmos-Predict2.5-2B, a video diffusion transformer pretrained for world simulation. Video, state, and action inputs become tokens in one sequence that a single 2B-parameter transformer processes"; "A frozen Wan 2.1 video VAE compresses each camera stream 4x in time and 8x in each spatial dimension. The latents are split into patches, giving 280 tokens per latent frame and camera at 224 x 320."; "GR00T 2 is trained with flow matching on future video latents and actions together, with one loss for each. At inference, a few denoising steps suffice: one or two for video and two to four for actions"; "a median of 153 ms to predict an action chunk for Dexter from three camera views on a GeForce RTX 5090"; "Turbo predicts in 124 ms on the onboard Jetson Thor of the Unitree G1" (accessed 2026-11-20)
- Use in dive: section 6, the current world-action model `[vendor claim]`. The contrast with DreamZero is the teaching point: 14B on 2 GB200 at 7 Hz in February 2026, 2B on one workstation GPU in November 2026. Project page: https://research.nvidia.com/labs/gear/gr00t-2/ ("Code Available in December").

**F03-105. GPU memory needed to run Cosmos3-Nano is not printed on the model card or in the benchmark pages read; the card only says a layer-wise offload flag "can help reduce memory usage".**
- Location: Cosmos3-Nano model card; `cosmos3-nano-generator.md` header
- Verdict: UNKNOWN (seed 02's 65.4 GB and 56.38 GB figures are for Cosmos-Transfer2.5-2B and Cosmos-Predict2-14B, both superseded)
- Evidence: https://huggingface.co/nvidia/Cosmos3-Nano (revision `45666784803b3a7ad577e0def405f9afcc3bddb2`) | Tier 1, model card | documentation of support | "Number of trainable model parameters: Cosmos3-Nano: 16B"; "Setting `--enable-layerwise-offload` can help reduce memory usage on GPUs with less available memory."; benchmark page: "Cosmos3-Nano rows use one GPU at 720p." (accessed 2026-11-20)
- Use in dive: compute table. [derived] 16B parameters at 2 bytes each (BF16) is 32 GB for the weights alone, before activations; the benchmark runs it on single GPUs from 80 GB (H100) upward and on the 96 GB RTX PRO 6000 Blackwell.
- Wave 3 (2026-11-20): superseded. First-party memory figures were located outside the model card: see F03-121 to F03-127 (NIM floor for Nano in BF16: 58 GiB per device; framework FAQ: 32 GB; measured 33.8 GiB peak for one 720p image on an H100).

### J. The argument for predicting in latent space, and its price

**F03-106. The argument in the V-JEPA paper: a model that must predict pixels spends capacity and compute on low-level detail, and a model that predicts in latent space is free to drop detail that is irrelevant or unpredictable.**
- Location: V-JEPA section 2 "Feature Prediction versus Pixel Reconstruction"
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2404.08471v1 | Tier 3, preprint | definition | "Approaches that predict in pixel space must dedicate significant model capacity and compute to capture all the low-level detail in the visual input. By contrast, approaches that predict in latent space have the flexibility to eliminate irrelevant or unpredictable pixel-level details from the target representation" (accessed 2026-11-20)
- Use in dive: section 6, the argument quoted from a primary source. With F03-51 (the position paper) and F03-107 this is the three-source statement the brief asks for.

**F03-107. The same argument in the V-JEPA 2 paper, with its example: the trajectory of a moving object is predictable; the position of each blade of grass or each leaf is not.**
- Location: V-JEPA 2 section 1
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2506.09985v1 | Tier 3, preprint | definition | "in contrast to approaches based on video generation, the JEPA approach focuses on learning representations for predictable aspects of a scene (e.g., the trajectory of an object in motion) while ignoring unpredictable details that generative objectives emphasize, since they make pixel-level predictions (e.g., the precise location of each blade of grass in a field, or each leaf on a tree)." (accessed 2026-11-20)
- Use in dive: section 6. On the arm task: where the block will be after the gripper closes is predictable; the exact sensor noise and the reflection on the cup are not.

**F03-108. The V-JEPA 2 authors tie the argument to planning cost: they say video-generation world models are judged on visual quality and seldom on planning, "perhaps due to the computational cost of planning by generating video".**
- Location: V-JEPA 2 section 1
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2506.09985v1 | Tier 3, preprint | definition | "this line of research often emphasizes the evaluation of the faithfulness of the predictions and visual quality instead of planning capabilities, perhaps due to the computational cost of planning by generating video." (accessed 2026-11-20)
- Use in dive: section 6, bridge to the 16 s versus 4 min figure (F03-25).

**F03-109. The price of latent prediction, part 1: there are no pixels to look at. To inspect what the model imagines, both V-JEPA 2 and LeWM train a separate decoder afterwards, used only for visualisation.**
- Location: V-JEPA 2 appendix B.3; LeWM section 5.1 and appendix D
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2506.09985v1 | Tier 3, preprint | definition | "To visualize the model's predictions, we train a frame decoder on the Droid dataset that maps the V-JEPA 2 representations to human-interpretable pixels. ... The decoder is a feedforward network ... parameterized as a ViT-L." LeWM (https://arxiv.org/abs/2603.19312v3): "This decoder is used only as a diagnostic tool to visualize what visual information is retained in the [CLS] representation."; "The imagined rollout suggests that latent representations capture the global scene structure while finer details like end-effector angle are not fully preserved." (accessed 2026-11-20)
- Use in dive: section 6, the trade stated honestly. The LeWM sentence shows the risk: what the encoder drops may be something the task needs (the gripper angle).

**F03-110. The price, part 2: a predictor trained with an L1 or L2 loss outputs one future, the average of the plausible ones. The JEPA-WMs study names this as a limit of the family when the world is uncertain.**
- Location: JEPA-WMs section 7
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2512.24497v4 | Tier 3, peer-reviewed (TMLR) | definition | "A limitation of this class of approaches is the deterministic predictor: the MSE loss learns the conditional mean of potentially genuinely multi-modal futures. This is mitigated in our benchmarks by their deterministic dynamics, by the latent abstraction of task-irrelevant variability and closed-loop MPC providing robustness to prediction errors." (accessed 2026-11-20)
- Use in dive: sections 6 and 7 limits. The position paper's answer is the latent variable z (F03-47, F03-48); none of the released models read here (V-JEPA 2-AC, LeWM, RoboJEPA) uses one [our reading].

**F03-111. The price, part 3: the representation is only as good as the encoder. Both camps say so: V-JEPA 2-AC "fundamentally depend[s] on the information captured in the V-JEPA 2 representation space", and V-JEPA 2.1 was built because V-JEPA 2's per-patch features were weak on depth, which showed up as grasp failures.**
- Location: V-JEPA 2 section 1; V-JEPA 2.1 Figure 8 caption
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2506.09985v1 | Tier 3, preprint | definition | "Because V-JEPA 2-AC models world dynamics in a learned representation space, its capabilities fundamentally depend on the information captured in the V-JEPA 2 representation space". V-JEPA 2.1 (https://arxiv.org/abs/2603.14482v3): "VJEPA 2.1 features better encode depth information, leading to an improvement in robot manipulation when grasping the cup involves reasoning over actions along the depth axis of the camera." (accessed 2026-11-20)
- Use in dive: section 7, why the encoder version matters to a robot result (60% to 70% grasp with only the encoder changed, F03-73).

### K. Planning in latent space

**F03-112. Model-predictive control (MPC): plan a sequence of actions through the model, execute only the first part, observe, and plan again. The three JEPA planners differ in how much they execute before replanning: V-JEPA 2-AC executes 1 action of a 1-step plan, RoboJEPA 2 actions of a 5-step plan, LeWM all 5 action blocks of a 5-step plan.**
- Location: V-JEPA 2 section 3.2; RoboJEPA Table 13; LeWM appendix D
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2506.09985v1 | Tier 3, preprint | definition | "at each time step, we plan an action sequence for a fixed time horizon by minimizing a goal-conditioned energy function. We then execute the first action, observe the new state, and repeat the process." LeWM (https://arxiv.org/abs/2603.19312v3): "only the first K planned actions are executed before replanning from the updated observation"; RoboJEPA (https://arxiv.org/abs/2610.10515v1): "Execution prefix (actions per replan) Lexec 2" (accessed 2026-11-20)
- Use in dive: section 7 (and 6), MPC defined with the three real settings. Replanning often corrects model error; replanning rarely saves compute.

**F03-113. The cross-entropy method (CEM), step by step, as the LeWM appendix states it: sample a pool of candidate action sequences from a Gaussian (mean 0, standard deviation 1 at the start); roll each through the world model and give it a cost; keep the k lowest-cost candidates (the elites); set the Gaussian's mean and variance to the elites' statistics; repeat; return the final mean.**
- Location: LeWM appendix A, Algorithm 2
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2603.19312v3 | Tier 3, preprint | definition | "At every iteration, the algorithm samples a pool of candidate plans from a distribution, typically a Gaussian (with initial parameters mu = 0 and sigma = I). Next, each candidate plan is evaluated using the world model, and a cost is associated with it. The algorithm then selects the top k plans with the lowest cost, referred to as elites. These elites are used to compute statistics that update the parameters of the sampling distribution for the next iteration. ... The final action plan is obtained from the mean of the sampling distribution at the last iteration." (accessed 2026-11-20)
- Use in dive: section 7, CEM in words; F03-30 is the same thing in code. CEM needs no gradient through the model, only forward passes, which is why its cost is counted in predictor passes.

**F03-114. CEM's stated weaknesses: no guarantee of a global optimum, and it degrades as the action space grows.**
- Location: LeWM appendix A
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2603.19312v3 | Tier 3, preprint | definition | "in non-convex settings, there is no guarantee that the solution to which CEM converges is a global optimum. Furthermore, CEM suffers from the curse of dimensionality and becomes increasingly difficult to apply when the action space is large." (accessed 2026-11-20)
- Use in dive: section 7 limits. V-JEPA 2-AC's released code keeps the search to 4 numbers per step (x, y, z, gripper; F03-29) and RoboJEPA does the same ("3D-translation + 1D-gripper space with the end-effector orientation held fixed", Table 13 caption): a small action space is part of what makes CEM workable [our reading].

**F03-115. Compute per decision, from each paper's settings [derived: samples x iterations x horizon = predictor steps]: V-JEPA 2-AC 800 x 10 x 1 = 8,000; V-JEPA 2.1 long-horizon setting 300 x 15 x 8 = 36,000; LeWM on Push-T 300 x 30 x 5 = 45,000 (15,000 on other tasks); RoboJEPA 4,096 x 10 x 5 = 204,800 (307,200 on the first plan).**
- Location: inputs in F03-24, F03-73, F03-40, F03-77
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2506.09985v1 ; https://arxiv.org/abs/2603.14482v3 ; https://arxiv.org/abs/2603.19312v3 ; https://arxiv.org/abs/2610.10515v1 | Tier 3, preprints | [derived] arithmetic on author-reported settings | inputs quoted in the entries named under Location (accessed 2026-11-20)
- Use in dive: section 7 worked example and a comparison table. The steps are not equal work: a V-JEPA 2-AC step runs a 300M transformer over 258 tokens per frame; a LeWM step runs a 10M transformer over 1 to 3 tokens; a RoboJEPA-8B step runs an 8B transformer with a key-value cache.

**F03-116. Alternatives to CEM appear in the same sources: gradient-based planning (differentiate the cost with respect to the actions through the predictor) and learning a fast policy from the planner's output. LeWM ships an AdamW gradient solver config next to the CEM one.**
- Location: V-JEPA 2 section 4.2; JEPA-WMs section 7; le-wm `config/eval/solver/adam.yaml`; position paper section 3.1.3
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2506.09985v1 | Tier 3, preprint | definition | "We can potentially reduce the planning time for both models in future work by leveraging additional computing resources for planning, reducing the number of samples and refinement steps used at each time step, training a feed-froward policy in the world-models' imagination to initialize the planning problem, or potentially leveraging gradient-based planning"; le-wm@8edf adam.yaml: "_target_: stable_worldmodel.solver.GradientSolver / n_steps: 30 / batch_size: 1 / num_samples: 100" (accessed 2026-11-20)
- Use in dive: section 7, what reduces the planning bill. JEPA-WMs found gradient planners good on smooth tasks and poor on contact-rich ones (F03-81); the position paper's "From Mode-2 to Mode-1" is the policy-distillation idea (F03-50).

### L. Compute: pixel world model versus latent world model

**F03-117. Parameters, first-party figures: Cosmos3-Nano 16B (Super 64B, Edge 4B); DreamZero 14B; the 1X World Model backbone 14B; GR00T 2 2B; Dreamer 4 2B; V-JEPA 2-AC about 1B frozen encoder plus about 300M predictor; RoboJEPA 22M to 8B predictor on a 2B frozen encoder; LeWorldModel about 15M in total.**
- Location: F03-94, F03-103, F03-102, F03-104, F03-90, F03-4, F03-14, F03-75, F03-72, F03-31
- Verdict: NEW
- Evidence: sources as in the entries named under Location | Tier 1 to 3 as there | `[vendor claim]` and `[author reported]` parameter counts, collected | see those entries for quotes (accessed 2026-11-20)
- Use in dive: sections 6 and 7 comparison table, parameter column. [derived] Cosmos3-Nano has about 1,070 times the parameters of LeWM (16B / 15M) and about 12 times those of V-JEPA 2-AC encoder plus predictor (16B / 1.3B).

**F03-118. Time to imagine, first-party figures side by side (not like for like: different hardware, resolution, horizon and batch): Cosmos3-Nano robot forward-dynamics rollout about 2.0 s on an H100 `[vendor claim]`; Cosmos 1 7B fine-tuned for planning 300 ms per candidate on an RTX 4090 `[author reported, by the V-JEPA 2 authors]`; V-JEPA 2-AC 2 ms per candidate on an RTX 4090 and 0.375 ms on an A100 `[author reported]`; LeWM about 22 microseconds per candidate step if the 0.98 s figure is for the Push-T settings `[author reported]`.**
- Location: F03-99, F03-25, F03-74, F03-41, F03-40
- Verdict: NEW
- Wave 2 (2026-11-20, SCOPE NARROWER (LeWM row)): The V-JEPA 2-AC per-candidate figures reproduce (16 s / 8,000 = 2 ms; 3 s / 8,000 = 0.375 ms). For LeWM the paper does not say which planning setup the 0.98 s used (Figure 3: "averaged over 50 runs"; appendix D gives two iteration counts) and names no GPU. Print a range: between 22 and 65 microseconds per candidate step, depending on whether the plan used 30 or 10 CEM iterations [derived], or drop the per-candidate figure.
- Evidence: sources as in the entries named under Location | Tier 1 and 3 | [derived] from the quoted timings | 240 s / (80 x 10) = 0.3 s; 16 s / 8,000 = 2 ms; 3 s / 8,000 = 0.375 ms; 0.98 s / 45,000 = 21.8 microseconds (the LeWM paper says the timing is "averaged over 50 runs" and points to appendix D for the setup; appendix D gives 30 iterations for Push-T and 10 elsewhere, so the divisor is 45,000 or 15,000, the latter giving 65 microseconds) (accessed 2026-11-20)
- Use in dive: sections 6 and 7 comparison table, time column, with the caveat printed beside it. The like-for-like comparison that exists in a primary source is F03-25 (same GPU, same planner, 15x per action and 150x per candidate), and its pixel side is a 2025 model fine-tuned by the JEPA authors.

**F03-119. Training compute, first-party figures: Cosmos3-Nano 1,024 GB200 GPUs (duration not stated); V-JEPA 2 ViT-g an author projection of about 7 A100 GPU-years with progressive resolution [derived from 60 GPU-years / 8.4]; V-JEPA 2-AC a 32-GPU job for 94,500 iterations (duration not stated); RoboJEPA-1B 256 H100 GPUs (duration not extracted); I-JEPA ViT-H 16 A100 GPUs for under 72 hours; LeWorldModel "a single GPU in a few hours" (GPU not named).**
- Location: F03-97, F03-12, F03-21, F03-80, F03-57, F03-31
- Verdict: NEW
- Evidence: sources as in the entries named under Location | Tier 1 and 3 | `[vendor claim]` and `[author reported]` training figures, collected | see those entries for quotes (accessed 2026-11-20)
- Use in dive: sections 6 and 7 comparison table, training column. Only LeWM and the V-JEPA 2-AC predictor are in reach of one machine; a LeWM run on our own hardware would be Tier 0 evidence the dive does not yet have.

**F03-120. Per-epoch training times for JEPA world models on real hardware are published in the JEPA-WMs paper's Table 6: minutes per epoch on 16 or 32 H100 80 GB GPUs, with DROID trained for 315 epochs.**
- Location: JEPA-WMs appendix, Table 6 caption
- Verdict: NEW (located; cell values not extracted)
- Evidence: https://arxiv.org/abs/2512.24497v4 | Tier 3, peer-reviewed (TMLR) | benchmark claim (author reported) | "Table 6: Model-specific training times in minutes per epoch on 16 H100 80 GB GPUs for Maze and Wall, on 32 H100 GPUs for Push-T and Metaworld. ... For DROID, we display the train time for 10 epochs since we train for 315 epochs." (accessed 2026-11-20)
- Use in dive: pointer for the compute table: the only located source with wall-clock training time for a V-JEPA-2-AC-class predictor (UNKNOWN U4 until the cells are read).

### M. Wave 3 (2026-11-20): Cosmos 3 GPU memory, first-party figures

Pages read for this heading, all on 2026-11-20: the three Hugging Face model cards (`nvidia/Cosmos3-Nano` revision `45666784803b3a7ad577e0def405f9afcc3bddb2`, `nvidia/Cosmos3-Super` revision `73d5746645961a0ec9607123a003bd9c1f8a0282`, `nvidia/Cosmos3-Edge` revision `6afc1256321c3a8e623d89be3bc5117a1e90f96b`; each `README.md` in full by text search for memory terms); NVIDIA/Cosmos at `0eab578a8935e26aa41c2b7dc9f5ab00f790a037` (`README.md`, `COOKBOOK.md`, `docs/reference/models.md`, `docs/reference/inference_benchmarks.md` and all ten pages under `docs/reference/inference_benchmarks/`); NVIDIA/cosmos-framework at `82d6f4e7c08b04f4cfa7c6de103d9be2e30af213` (default-branch head, commit dated 2026-11-19; no releases; `README.md`, `docs/faq.md`, `docs/training.md`, `docs/inference.md`, `packages/diffusers-cpu-offloading/README.md` and its `benchmarks/README.md`, and the note files under `.agents/skills/cosmos3-inference-generate-media/`); the NVIDIA NIM for Cosmos support matrix and prerequisites pages. The model cards print no memory figure for Nano or Super. The figures below come from the other three places. They close F03-105 and U10. Units are kept as printed: the NIM page uses binary GiB, the framework FAQ uses GB.

**F03-121. The NIM support matrix prints a minimum GPU memory per device for each Cosmos 3 Generator configuration. Cosmos3-Nano, full precision (BF16) with the model and guardrails resident on the GPU: 58 GiB for generation and 64 GiB for the Transfer workload, plus a 40 GiB host-memory floor. With layer-by-layer offload to host memory the Nano floor drops to 31 GiB (host floor 64 GiB), a row the page says targets 32 GB cards such as the RTX 5090. Nano in FP8: 44 GiB resident, down to 31 GiB with offload. Cosmos3-Super: 150 GiB per device in BF16 and 93 GiB in FP8 resident, down to 42 GiB and 38 GiB with layer offload. The experimental Edge policy variant (`edge-droid`): 15 GiB.**
- Location: "Support Matrix", NVIDIA NIM for Cosmos WFM documentation ("latest", page footer "Last updated on Nov 05, 2026"), sections "Generator Profiles" and its notes.
- Verdict: NEW (closes the UNKNOWN in F03-105)
- Evidence: https://docs.nvidia.com/nim/cosmos/latest/support-matrix.html | Tier 1, first-party docs | documentation of support (vendor-stated minimums, enforced by the NIM's profile selection) | "Match a model to precision, GPU compute capability, GPU count, per-device video memory (VRAM), and system memory. Memory requirements use binary GiB: VRAM floors are per device, and system-memory floors are per host." Table "Generator Profiles", columns Variant Group, Precision, Model Offload, Guardrails During Diffusion, GPUs, Generation Minimum VRAM/Device, System-Memory Floor, Transfer Minimum VRAM/Device; rows as printed: "edge-droid (experimental) | BF16 | None | Resident | 1, 2, 4, 8 | 15 GiB | 16 GiB | Not supported"; "nano, nano-droid | BF16 | None | Resident | 1, 2, 4, 8 | 58 GiB | 40 GiB | 64 GiB"; "nano | BF16 | Layer | Offloaded | 1 | 31 GiB | 64 GiB | 35 GiB"; "nano | FP8 | None | Resident | 1, 2, 4, 8 | 44 GiB | 35 GiB | 50 GiB"; "nano | FP8 | Model | Resident | 1 | 38 GiB | 36 GiB | 44 GiB"; "nano | FP8 | Layer | Resident | 1 | 32 GiB | 36 GiB | 38 GiB"; "nano | FP8 | Layer | Offloaded | 1 | 31 GiB | 64 GiB | 35 GiB"; "super | BF16 | None | Resident | 1, 2, 4, 8 | 150 GiB | 112 GiB | 160 GiB"; "super | BF16 | Model | Resident | 1 | 93 GiB | 150 GiB | 99 GiB"; "super | BF16 | Layer | Resident | 1 | 42 GiB | 150 GiB | 50 GiB"; "super | FP8 | None | Resident | 1, 2, 4, 8 | 93 GiB | 76 GiB | 103 GiB"; "super | FP8 | Model | Resident | 1 | 64 GiB | 80 GiB | 76 GiB"; "super | FP8 | Layer | Resident | 1 | 38 GiB | 80 GiB | 50 GiB". Notes: "The 31-GiB Nano layer-offload rows target 32-GB client GPUs such as the GeForce RTX 5090, which does not meet their 35-GiB Transfer minimum." and "Treat the floors as minimums. Media processing, concurrency, and other host workloads can need more." and "Transfer needs more peak memory than ordinary generation, so startup checks it separately." (accessed 2026-11-20)
- Use in dive: sections 6 and 21 and the compute table. These are the floors the NIM container checks before it starts, per device, for the NIM runtime; they are not measured peaks of the open-source PyTorch path and the page gives no resolution or frame count for them. What the page can say: Nano fits one 80 GB GPU (H100, A100 80 GB class) with room to spare at full precision, fits a 48 GB card only in FP8 (44 GiB), and fits a 32 GB card only by keeping the weights in host memory; Super at full precision does not fit any single GPU under 150 GiB without offload. The table was parsed from the HTML page; the cell order was checked against the column headers and the page's own "31-GiB" and "35-GiB" sentence.

**F03-122. The same page prints floors for the Cosmos 3 Reasoner (the understanding tower served as a language model): Edge 12 GiB per device, Nano 23.1 GiB, Super 135 GiB on one GPU in BF16 (73 GiB per device on two) and 67 GiB in FP8.**
- Location: same page, "Reasoner Profiles" and "Unified-Memory Thresholds".
- Verdict: NEW
- Evidence: https://docs.nvidia.com/nim/cosmos/latest/support-matrix.html | Tier 1, first-party docs | documentation of support | Table "Reasoner Profiles", columns Model, Precision, GPUs, Tensor Parallelism, Minimum VRAM/Device, System-Memory Floor, Minimum Compute Capability; rows as printed: "edge | BF16 | 1 | 1 | 12 GiB | 8 GiB | 8.0"; "nano | BF16 | 1 | 1 | 23.1 GiB | 24 GiB | 8.0"; "nano | FP8 | 1 | 1 | 23.1 GiB | 17 GiB | 8.9"; "super | BF16 | 1 | 1 | 135 GiB | 72 GiB | 8.0"; "super | BF16 | 2 | 2 | 73 GiB | 72 GiB | 8.0"; "super | FP8 | 1 | 1 | 67 GiB | 43 GiB | 8.9". Also: "On unified-memory systems, effective shared memory is 70% of the device-reported total." and "Unified-memory systems (DGX Spark, Jetson AGX Thor): Default to Nano for both runtimes. Some Super Reasoner rows fit, but turnaround is impractical." (accessed 2026-11-20)
- Use in dive: section 21 (edge) and the compute table: on a Jetson-class shared-memory device only 70% of the total counts, so a 128 GB Jetson AGX Thor offers about 90 GB `[derived: 0.7 x 128 = 89.6]`, enough for the Nano Generator floor of 58 GiB and not for Super's 150 GiB.

**F03-123. The Cosmos framework's own FAQ answers "How much GPU memory do the models need?" with a two-row table: Cosmos3-Nano 32 GB, Cosmos3-Super 128 GB. The table labels the models "8B" and "32B", which differs from the 16B and 64B on the model cards; Edge is not in the table and no resolution, precision or workload is given.**
- Location: NVIDIA/cosmos-framework `docs/faq.md`, section "Inference", question "How much GPU memory do the models need?" (lines 153 to 158).
- Verdict: NEW
- Evidence: https://github.com/NVIDIA/cosmos-framework/blob/82d6f4e7c08b04f4cfa7c6de103d9be2e30af213/docs/faq.md | Tier 1, first-party docs at a pinned SHA | documentation of support (vendor stated, conditions not given) | "### Q: How much GPU memory do the models need?" with rows "Cosmos3-Nano (8B)   | 32 GB" and "Cosmos3-Super (32B) | 128 GB" [columns: Model, GPU Memory]; the next answer: "Inference auto-picks a value that fits the model at ~75% device memory (see `_get_dp_shard_size` in `cosmos_framework/inference/args.py`)" and "The auto-`dp_shard_size` formula is `ceil(model_memory / device_memory / utilization)`". Model cards: "Cosmos3-Nano: 16B", "Cosmos3-Super: 64B", "Cosmos3-Edge: 4B". (accessed 2026-11-20)
- Use in dive: compute table, as the open-source framework's stated figure next to the NIM floors of F03-121. `[our reading]` The 32 GB and 128 GB figures match the size of the BF16 weights at the card's parameter counts (16B x 2 bytes = 32 GB; 64B x 2 bytes = 128 GB `[derived]`), so read them as "memory for the weights", with activations on top: F03-124's measurement (about 31.5 GB of Nano weights, 33.8 GiB peak for one 720p image) agrees with that reading. The "8B" and "32B" labels are recorded as a contradiction in section 8; the page should use the model cards' 16B and 64B.

**F03-124. Measured Cosmos 3 memory on one H100 80 GB, from notes in NVIDIA's cosmos-framework repository: Cosmos3-Nano holds about 31.5 GB of BF16 weights and peaks at 33.8 GiB allocated for one 1280 x 720 image through Diffusers; served through TensorRT-LLM it sits at about 50.6 to 52.1 GiB after a 1280 x 720, 189-frame warm-up. Cosmos3-Edge peaks at about 9.0 GiB for an 832 x 480 image and 12.4 GiB allocated (15.2 GiB reserved) for a 121-frame video. The notes conclude that every Nano path fits an 80 GB GPU in BF16 as shipped, and point GPUs under about 40 GB to the FP8 revision.**
- Location: NVIDIA/cosmos-framework `.agents/skills/cosmos3-inference-generate-media/references/skill-notes.md`, section "2. Measured footprints"; `.agents/skills/cosmos3-inference-generate-media/SKILL.md`, table "Model sizes vs GPU".
- Verdict: NEW
- Evidence: https://github.com/NVIDIA/cosmos-framework/blob/82d6f4e7c08b04f4cfa7c6de103d9be2e30af213/.agents/skills/cosmos3-inference-generate-media/references/skill-notes.md | Tier 1, first-party repository at a pinned SHA, but a notes file written for coding agents and not a product document | benchmark claim (vendor reported; measured by the repository's automated evaluation runs) | "Measured by this skill's eval runs on one H100 80 GB (2026-10-21/23; not from the notebooks): Edge - diffusers t2i 832x480 ~9.0 GiB peak allocated, 3-5 s; diffusers t2v 121 frames ~12.4 GiB allocated / 15.2 GiB reserved, 16-23 s; framework t2i 9,735-9,785 MiB (nvidia-smi); TensorRT-LLM 17,633-17,770 MiB incl. its 832x480x121 warm-up" and "Nano - ~31.5 GB of bf16 weights (30.56 GiB resident after load); diffusers 720x1280 t2i 33.8 GiB peak allocated / 35.4 GiB reserved (36,939 MiB nvidia-smi); framework t2i 35,973 MiB; TensorRT-LLM with the shipped `cosmos3-nano-1gpu.yaml` 50,623-52,147 MiB after the default 720x1280x189 warm-up" and "Every Nano path fits an 80 GB GPU in bf16 as shipped - do not tune or offload first. For GPUs under ~40 GB use the fp8 revision". SKILL.md, Super distilled checkpoints: "measured: 131.4 GB = 122.4 GiB of bf16 safetensors per student". (accessed 2026-11-20)
- Use in dive: compute table, as the only measured peaks located, with their conditions. Limits to print with them: text-to-image for the 33.8 GiB figure (one frame), a serving warm-up for the 50 to 52 GiB figure; no measured peak for a full 189-frame Nano video through PyTorch is in the notes, and none for the "Forward Dynamics - Robot" rollout of F03-99. The provenance is weaker than a product page: the file says its numbers are "not from the notebooks", and a sibling note in the same directory says of action inference that "no source of the row states a GPU-memory footprint or a runtime". Treat as `[vendor reported, agent-run measurement]`.
- Rewrite check (2026-11-25, CORRECTION (units)): The quote gives "50,623-52,147 MiB" for the TensorRT-LLM serving figure. That is 49.4 to 50.9 GiB (MiB divided by 1,024), not 50.6 to 52.1 GiB as the claim sentence says. Print the source's MiB figures.

**F03-125. NVIDIA ships a weight-streaming adapter for Cosmos3-Nano that keeps the model's weights in CPU memory and streams them to the GPU as needed. With the FP8 checkpoint it completed all 21 of its modality and resolution cases on an RTX 5070, a 12 GB card, on a host with 128 GB of system memory. The adapter is for inference only and trades GPU memory for transfer time.**
- Location: NVIDIA/cosmos-framework `packages/diffusers-cpu-offloading/README.md` (opening, "Use the official FP8 checkpoint", "Behavior and limitations") and `packages/diffusers-cpu-offloading/benchmarks/README.md` ("Requirements").
- Verdict: NEW
- Evidence: https://github.com/NVIDIA/cosmos-framework/blob/82d6f4e7c08b04f4cfa7c6de103d9be2e30af213/packages/diffusers-cpu-offloading/README.md | Tier 1, first-party docs at a pinned SHA | documentation of support; benchmark claim (vendor reported) | "Run the Cosmos3-Nano Diffusers modular pipeline with model weights stored in CPU RAM and streamed to the GPU as needed. Computation stays on the GPU." and "Native FP8 generation completed all 21 modality/resolution cases on RTX 5070, with safety checking enabled except for explicitly labeled Transfer runs." and "The smaller GPU-memory footprint trades off against PCIe transfer time. These helpers are for inference, not training." and "Cosmos3-Nano is the supported model. Do not assume Cosmos3-Super or every action/control configuration has been validated." Benchmarks README: "The target RTX 5070 has 12 GB VRAM. We use a node configured with 128 GB system RAM; this is the test configuration, not a measured minimum RAM requirement." (accessed 2026-11-20)
- Use in dive: section 6 or 21, one sentence: the 16B model can run on a 12 GB consumer GPU when the weights live in host memory, at a speed cost the README does not quantify in the lines read (the benchmark runner records timings per run; no table is printed). This is the low end of the range whose high end is F03-121's 58 GiB resident floor.

**F03-126. NVIDIA's benchmark pages encode memory fit in a "GPUs" column instead of printing memory: a row uses one GPU when the model fits on a single device at its highest resolution and eight GPUs when it does not. Every Cosmos3-Nano row uses one GPU at 720p (the smallest device in the table is the 72 GB RTX PRO 5000 Blackwell); Cosmos3-Super's primary PyTorch rows use eight GPUs even on H200 141 GB; Cosmos3-Edge fits one GPU or one integrated platform at 480p. The pages say these are measured setups, not memory requirements. For fine-tuning, the framework's shipped recipes are 8-GPU configurations tested on 8 H100 80 GB.**
- Location: NVIDIA/Cosmos `docs/reference/inference_benchmarks/cosmos3-nano-generator.md`, `cosmos3-super-generator.md`, `cosmos3-edge-generator.md` (opening paragraphs); `COOKBOOK.md` legend; NVIDIA/cosmos-framework `README.md` line 73 and `docs/training.md` line 27.
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/NVIDIA/Cosmos/0eab578a8935e26aa41c2b7dc9f5ab00f790a037/docs/reference/inference_benchmarks/cosmos3-super-generator.md | Tier 1, first-party docs at a pinned SHA | documentation of support | "The configuration is one GPU when the model fits on a single device at its highest resolution, 720p, and eight GPUs when it does not. The **GPUs** column is authoritative: engines can use different counts when their memory requirements differ. Primary PyTorch rows use eight GPUs on the H200 platforms while several other engines use one; SGLang uses eight on H200 141GB HBM3. Smaller-memory platforms also have eight-GPU rows. These configurations are measured setups rather than universal memory requirements." Nano page: "Cosmos3-Nano rows use one GPU at 720p." Edge page: "Cosmos3-Edge fits on a single GPU or one integrated computing platform at 480p, so all populated rows report one." Cookbook legend: "`S` | 1 GPU, up to 96 GB" and "`M` | 1 GPU over 96 GB, or 2-8 GPUs". Framework README (https://github.com/NVIDIA/cosmos-framework/blob/82d6f4e7c08b04f4cfa7c6de103d9be2e30af213/README.md): "the shipped recipes under [`examples/`](./examples/README.md) are 8-GPU configurations (tested on 8× H100 80 GB)"; `docs/training.md`: "Cosmos3-Edge is only 2B and also fits a 4-GPU node". (accessed 2026-11-20)
- Use in dive: compute table and section 6: how to read NVIDIA's latency tables (F03-98, F03-99) for memory. The Nano platform list was read from the row labels of `cosmos3-nano-generator.md`: B200, B300, DGX Spark, H100 80GB HBM3, H100 NVL, H20, H200 141GB HBM3, H200 NVL, RTX PRO 5000 Blackwell 72GB, RTX PRO 6000 Blackwell. The LeRobot port's measured fine-tuning memory for Nano and Edge as robot policies is in register 02, F02-84 (Edge LoRA 21 GB, Nano LoRA 64 GB, on 80 GB GPUs).

**F03-127. Cosmos3-Edge (4B) is benchmarked on embedded devices on its model card: image-to-video (189 frames at 480p, vLLM-Omni) in 101.20 s on a Jetson T2000 with 16 GB, 194.76 s on a Jetson T3000 with 32 GB and 137.50 s on a Jetson AGX Thor T5000 with 128 GB; a robot forward-dynamics rollout in 6.05 s and a DROID policy call in 6.32 s on the T5000, against 3.91 s and 1.41 s on an H100 80 GB. The card prints no memory-used figure; the device sizes are the only memory information on it.**
- Location: `nvidia/Cosmos3-Edge` model card, "PBR (Performance Benchmark Reporting)", "Generator", "vLLM-Omni" table.
- Verdict: NEW
- Evidence: https://huggingface.co/nvidia/Cosmos3-Edge (revision `6afc1256321c3a8e623d89be3bc5117a1e90f96b`) | Tier 1, model card | benchmark claim (vendor reported) | "All results were measured using a single GPU and a batch size of 1." and "Unless otherwise noted, visual-generation benchmarks use **480p resolution**. Image-to-video benchmarks generate **189 frames**." Table columns GPU or Platform, Image-to-Video, Forward Dynamics, Inverse Dynamics, Policy DROID; rows "H100 SXM 80 GB | 27.64 s | 3.91 s | 5.60 s | 1.41 s", "Jetson AGX Thor T5000, 128 GB, MAXN | 137.50 s | 6.05 s | 7.19 s | 6.32 s", "Jetson T3000, 32 GB, 1100 MHz | 194.76 s | 8.67 s | 10.25 s | 8.63 s", "Jetson T2000, 16 GB, 702 MHz, THOR_NANO | 101.20 s" (the other three cells of the T2000 row are empty). Card: "Cosmos3-Edge: 4B". (accessed 2026-11-20)
- Use in dive: section 21 (edge) and the compute table: the Edge model is the Cosmos 3 size that runs on the robot's own computer, and a 16 GB device is enough for at least the image-to-video workload. Consistent with the NIM floor of 15 GiB for `edge-droid` (F03-121) and the measured 12.4 GiB for a 121-frame video (F03-124). The T2000 row being faster than the T3000 row is as printed; the card does not explain it and the page should not build on that ordering. Register 07 owns the Jetson device names.

---

## 5. Teaching material

The arm's figures used below, from LeRobot v0.7.0 at SHA `410c095eacc0011d998a73383eb94abed2715af0`: the SO-101 follower arm has six STS3215 servo motors (`shoulder_pan`, `shoulder_lift`, `elbow_flex`, `wrist_flex`, `wrist_roll`, `gripper`), so an action is 6 numbers; the documented example cameras are 640 x 480 at 30 frames per second. None of the models in this register has been run on an SO-101 by anyone we could cite. Every worked example below maps published settings onto the arm task and says so.

### 5.1 Section 6, "World Models: Predicting What Happens Next"

#### The plain-words idea

A world model is a network that answers one question: "if the scene looks like this now and the robot does that, what will the scene look like next?" (F03-87). Once a model can answer it, the robot can try actions in the model instead of in the room. The sources name five uses: search for a good action sequence by trying many (planning), train a policy on imagined experience, generate extra training data, score a policy without a robot, and use the model itself as the policy by having it output actions next to its prediction (F03-88, F03-92, F03-93).

The design choice that splits the field is what "the scene next" means. One family predicts the next video frames (through a compressed code that a decoder turns back into pixels). The other predicts a short list of numbers that summarises the next scene and never draws it. Section 6 teaches the first family and the argument between them; section 7 teaches the second.

#### Worked example on the arm task: what one imagined second costs

The task: the block sits 10 cm left of the cup. The camera sees it at 640 x 480, 30 frames per second.

1. **As video.** A 640 x 480 colour frame is 640 x 480 x 3 = 921,600 numbers. One second at 30 frames per second is 27,648,000 numbers `[derived]`. A video world model does not predict these directly: Cosmos 3 first compresses with a frozen VAE (a variational autoencoder, an encoder and decoder pair trained so the decoder can rebuild the pixels from the code), 4 times in time and 32 x 32 in space (F03-96). A 480 x 640 frame becomes 15 x 20 = 300 latent positions, and 30 frames become about 8 latent frames, so one second is roughly 2,400 tokens `[derived]`. The transformer then produces those tokens by denoising: start from noise and refine over several passes (35 in the model card's examples, F03-95).
2. **What that costs, published.** Cosmos3-Nano (16B parameters) used as an action-conditioned predictor takes about 2.0 s per rollout on one H100 (F03-99, `[vendor claim]`, rollout length not published). A free text-to-video clip of 7.875 s at 320 x 192 takes 7.61 s on the same GPU, and at 720p it takes 207.78 s (F03-98).
3. **Why that matters for planning.** Planning by search needs thousands of imagined futures per decision. V-JEPA 2-AC's planner uses 800 candidates x 10 rounds = 8,000 predictor passes per action (F03-24, F03-115). At 2.0 s each, run one at a time, that is 16,000 GPU-seconds, about 4.4 GPU-hours for one action `[derived]`. The V-JEPA 2 authors measured the same thing on a 2025 video model: with only 80 candidates, 4 minutes per action on an RTX 4090, against 16 s for their latent model with 800 (F03-25).
4. **The other way to use a video model.** Do not search. Have the model output the actions together with the video, once per decision. DreamZero (14B) does this at 7 Hz on 2 GB200 GPUs (F03-103); GR00T 2 (2B) predicts an action chunk in a median 153 ms on one RTX 5090 (F03-104). This is why the pixel family in 2026 is mostly world-action models and data generators, and the latent family is mostly planners `[our reading]`.

#### The mechanism (which tensor goes where)

A generic action-conditioned video world model, using Cosmos 3 and GR00T 2 as the concrete cases:

1. **Tokenise.** Camera frames go through the frozen VAE encoder. Cosmos 3: 4x in time, 32 x 32 in space (F03-96). GR00T 2: 4x in time, 8x per spatial dimension, then patches, giving 280 tokens per latent frame per camera at 224 x 320 (F03-104).
2. **Condition.** Past frames' tokens are clean. Text (and in Cosmos 3 the reasoning tower's output) and the action sequence enter as further tokens (F03-95).
3. **Generate.** Future-frame tokens start as Gaussian noise. The transformer is trained with flow matching: given a noisy mix of the true future tokens and noise, predict the direction that moves the mix toward the true tokens. In symbols, with x_1 the true future latent, x_0 noise, t a number between 0 and 1, and x_t = (1 - t) x_0 + t x_1, the network v predicts the velocity x_1 - x_0 and the loss is the squared error || v(x_t, t, conditions) - (x_1 - x_0) ||^2. The quoted sources name the objective ("rectified flow matching", F03-95; "flow matching on future video latents and actions together, with one loss for each", F03-104); the formula here is the standard form of that objective, not a quote, and the section writer should check it against Cosmos 3 paper section 4.1 before printing it.
4. **Decode.** The VAE decoder turns the finished latent into pixels. A world-action model also reads out the action tokens (F03-93, F03-104).

Three older or adjacent patterns the section should place in one sentence each: Dreamer (learn a compact latent model with a reconstruction loss and rewards, then train the policy inside it; F03-89, F03-90); the inverse-dynamics pattern of the 1X World Model (generate 5 s of video of the task being done, then a second model works out which actions produce that video; F03-102); interactive worlds for agents (Genie 3 and 4; F03-100, F03-101).

#### The latent argument, stated from the sources

- Pixels force the model to spend capacity on detail that does not matter or cannot be known: every blade of grass, every leaf (F03-106, F03-107, F03-51).
- Measured on representation quality, the same network trained to predict features beat the same network trained to predict pixels by 5.1 points on Kinetics-400 (73.7 against 68.6) and by 0.2 on Something-Something v2 (F03-62). That ablation is from 2024 and measures recognition, not planning.
- Measured on planning: 16 s against 4 min per action, same GPU (F03-25). The pixel side was a 2025 model tuned by the JEPA authors.
- The price: no pictures without an extra decoder, and what the encoder dropped may be something the task needs (F03-109, F03-111); one predicted future where several are possible (F03-110).
- The pixel camp's reply in its own words: video is "a dense representation of how the world evolves", and the DreamZero authors say future world-action models may predict "learned latent representations" (F03-93). Neither camp's source claims the question is settled `[our reading]`.

#### What it costs in compute, and which part of the machine it loads

| Workload | Published figure | Entry | Part of the machine |
|---|---|---|---|
| Pretraining a video world model | Cosmos3-Nano: 1,024 GB200 GPUs, 31.05T tokens; duration not stated | F03-97 | GPU tensor cores across many nodes; the network between them; storage throughput for video |
| Generating a clip | Cosmos3-Nano, 189 frames: 7.61 s (320 x 192) to 207.78 s (720p) on one H100 | F03-98 | GPU tensor cores (repeated transformer passes); GPU memory for 16B weights, at least 32 GB in BF16 `[derived]`, true need UNKNOWN (F03-105) |
| One action-conditioned rollout | Cosmos3-Nano: about 2.0 s on one H100 | F03-99 | same |
| World-action model control | DreamZero 14B: 7 Hz on 2 GB200. GR00T 2 2B: 153 ms per chunk on one RTX 5090; Turbo 124 ms on Jetson Thor | F03-103, F03-104 | GPU tensor cores; a few denoising steps per chunk |
| Video as policy with action extraction | 1X: 11 s multi-GPU plus 1 s for 5 s of motion | F03-102 | GPU tensor cores, several GPUs |
| Interactive world | Dreamer 4 2B: above 20 frames per second on one H100. Genie 3: 24 frames per second at 720p, hardware not stated | F03-90, F03-100 | GPU tensor cores |

None of these loads ray-tracing cores: a learned world model is matrix arithmetic, unlike a rendered simulator `[our reading]`. Whether the VAE decode and any video encode of the output run on the GPU's tensor cores or its video engines is not stated in the sources read.

#### Order to teach it in (section 6)

1. The question a world model answers, on the arm (F03-87).
2. The five uses, each in one line, with the arm (F03-88, F03-92, F03-93).
3. Policy training in imagination as the oldest use: Dreamer in two sentences (F03-89, F03-90).
4. How a video world model works: compress, condition, denoise, decode (F03-95, F03-96).
5. What exists in November 2026: Cosmos 3, Genie 4, the 1X World Model, GR00T 2 (F03-94, F03-101, F03-102, F03-104).
6. The cost of one imagined second, then of one planned action (F03-98, F03-99, F03-25).
7. Two ways out of that cost: output actions directly (world-action models, F03-103, F03-104) or stop predicting pixels (F03-106 to F03-108).
8. The price of leaving pixels (F03-109 to F03-111). Hand over to section 7.

### 5.2 Section 7, "JEPA"

#### The plain-words idea

A JEPA (Joint-Embedding Predictive Architecture) has three parts. An encoder turns what the camera sees into a list of numbers, the representation. A second encoder pass turns the thing to be predicted (a hidden part of the video, or the next frame) into its own representation. A predictor takes the first representation and tries to output the second (F03-47). The training signal is how far the prediction lands from the target, measured between the two lists of numbers, never between pictures (F03-48). That distance is called the energy: low when the target is a plausible match for the context, high when it is not.

Because the model grades its own homework (it produces both the prediction and the target), it can cheat: output the same numbers for every input and the distance is always zero. That failure is called collapse (F03-63). Most of what distinguishes one JEPA from another is how it prevents collapse.

A JEPA becomes a world model when the predictor also receives the robot's action and the target is the next frame's representation (F03-14, F03-36). The robot then plans by searching for the action sequence whose predicted representation lands closest to the representation of a picture of the goal (F03-23).

#### Worked example A: the encoder (V-JEPA 2) on arm video

Pretraining needs video only, no actions.

1. Take a clip of the arm: 16 frames at 256 x 256 (the paper samples 4 frames per second, so this is 4 seconds; F03-11). The 640 x 480 camera frame is resized.
2. Cut it into tubelets of 2 frames x 16 x 16 pixels (F03-3). That gives 16 / 2 = 8 steps in time and 256 / 16 = 16 per side: 8 x 16 x 16 = 2,048 tokens `[derived]`.
3. Hide most of them. The masks are blocks that run through the whole clip in time: 8 blocks of 15% of the frame, or 2 blocks of 70% (F03-9). In V-JEPA this hides about 90% of the tokens (F03-60); at that ratio about 205 of 2,048 stay visible (illustration: the V-JEPA 2 paper does not print its ratio).
4. The encoder (ViT-g, 1B parameters, width 1408; F03-4) processes only the visible tokens. The target encoder, a slowly updated copy, processes all 2,048.
5. The predictor (22M parameters, width 384; F03-4) receives the visible tokens' outputs plus one learnable "mask token" at every hidden position, each tagged with its position, and outputs a 1408-wide vector for each hidden position (F03-6).
6. Loss: the mean absolute difference between those outputs and the target encoder's vectors at the same positions (F03-2, F03-7).

Intuition for why this teaches physics-like knowledge: with the block and the gripper hidden for the whole clip in a region, the only way to predict that region's representation is to know how grippers and blocks move.

#### Worked example B: imagining and planning with V-JEPA 2-AC on pick-and-place

1. **Encode the present.** One frame, duplicated to fill a 2-frame tubelet, gives a 16 x 16 grid of 1408-wide vectors: 256 tokens (F03-17). That is 256 x 1,408 = 360,448 numbers `[derived]`, more numbers than the 256 x 256 x 3 = 196,608 values of the frame it came from. V-JEPA 2's representation is not small; it is abstract.
2. **Encode the goal.** A photo of the block in the cup, same encoder, same shape.
3. **One imagined step.** The predictor (300M parameters, 24 layers, width 1024; F03-14) receives 1 action token + 1 arm-state token + 256 patch tokens = 258 tokens per time step (F03-15, F03-16) and outputs the 256 patch vectors for the next step. One step is 0.25 s of world time at 4 frames per second (F03-20).
4. **The action.** V-JEPA 2-AC's action is 7 numbers describing the change of the gripper's pose (F03-15). The SO-101's native action is 6 joint targets. Using this model on the SO-101 would need either a conversion between the two or a predictor trained on SO-101 data `[our reading]`.
5. **Score a candidate.** Energy = mean absolute difference between the imagined grid and the goal grid (F03-23).
6. **Search with CEM** (F03-113, F03-24): draw 800 candidate actions from a Gaussian; imagine each; keep the 10 with the lowest energy; refit the Gaussian to those 10; repeat 10 times. 800 x 10 = 8,000 predictor passes. Execute the result, look again, repeat.
7. **Cost.** 16 s per action on an RTX 4090, 2 ms per pass (F03-25, F03-118); 3 s on an A100 per the later paper (F03-74).
8. **The whole task.** Pick-and-place uses three sub-goal images on a schedule of 4 + 10 + 4 = 18 steps (F03-27). 18 x 16 s = 288 s of planning on the RTX 4090, 18 x 3 s = 54 s on the A100, 18 x 8,000 = 144,000 predictor passes `[derived]`. The Cosmos baseline at 4 minutes per action would be 72 minutes `[derived]`. Published success for this task with a cup: 80% over 10 trials on a Franka arm (F03-26).

A toy CEM round to show the mechanics (illustration, invented numbers): the block is 10 cm left of the gripper. Round 1 samples sideways moves around 0 cm with spread 5 cm; the three best candidates are -6, -8 and -7 cm. Round 2 samples around their mean, -7 cm, with their spread, 1 cm. After a few rounds the mean sits near -10 cm.

#### Worked example C: the same task in LeWorldModel

1. A 224 x 224 frame is cut into 14 x 14 pixel patches: 16 x 16 = 256 patches plus one summary token, the [CLS] token (F03-32). The encoder is a 5M-parameter ViT-Tiny trained from scratch.
2. Only the [CLS] output is kept, passed through a small MLP: one vector of 192 numbers per frame (F03-32, F03-34). 224 x 224 x 3 = 150,528 pixel values become 192, a 784-fold reduction `[derived]`.
3. The predictor (10M parameters, 6 layers) sees the last 3 frame vectors (F03-34) and the action, which modulates its normalisation layers (F03-33), and outputs the next 192-number vector.
4. One model step covers 5 control steps (frame skip 5, F03-43), so its action input for an SO-101 would be 5 x 6 = 30 numbers `[derived]`.
5. Planning: 300 candidates x 30 rounds x 5 steps = 45,000 predictor passes on Push-T, in 0.98 s in total (F03-40, F03-41, F03-115). Each pass handles 3 tokens instead of 258.
6. The released code trains on Push-T and similar simulated tasks; a loader for arm episodes in LeRobot format is not part of it (F03-44).

#### The mechanism, formula by formula

Symbols used throughout: x is the input (video or frame); E_theta is the encoder with weights theta; P_phi is the predictor with weights phi; z = E_theta(x) is a representation; a hat marks a prediction; sg(.) means "treat as a constant: no gradient flows back through this".

**1. V-JEPA 2 pretraining loss (F03-2, F03-7).** Intuition: predict the hidden tokens' representations from the visible ones.

L = (1 / |M|) x sum over i in M of | P_phi( E_theta(x_visible), m )_i - sg( E_thetabar(x) )_i |

M is the set of hidden token positions and |M| its size; x_visible is the clip with hidden tokens removed; m is the learnable mask token placed at each hidden position; E_thetabar is the target encoder; | . | is the absolute difference averaged over the vector's entries (L1). The left term carries "what the predictor guessed"; the right term carries "what the full-view encoder says is there"; sg stops the target from moving to meet the guess.

**2. The target encoder update (F03-8).** After each optimiser step: thetabar = m x thetabar + (1 - m) x theta, with m = 0.99925 (this m is the momentum, a different quantity from the mask token; the sources use the same letter). Each step moves the target 0.075% of the way to the encoder; it takes about 924 steps to close half of any gap, ln(0.5) / ln(0.99925) `[derived]`. I-JEPA uses 0.996 rising to 1.0 (F03-56).

**3. V-JEPA 2-AC training loss (F03-18, F03-19).** The encoder E is frozen. z_k = E(frame k); a_k is the action between frames k and k+1; s_k is the arm state at frame k.

L = L_teacher-forcing + L_rollout

L_teacher-forcing = (1 / T) x sum over k of | P_phi(a_1..k, s_1..k, z_1..k) - z_k+1 |: predict each next frame from the true frames before it.

L_rollout = | P_phi(a_1..2, s_1, z_1, z-hat_2) - z_3 |: predict frame 2, feed that prediction back in, predict frame 3, and compare with the true frame 3. The first term teaches one-step accuracy; the second teaches the predictor to survive its own errors, which is what planning asks of it. (The released config rolls out 2 steps, F03-19. An independent study reports that the released code computed this term against the wrong frame; F03-82 and the UNKNOWN register.)

**4. Planning energy (F03-23).** E(a_1..T) = | P_phi(a_1..T; s_k, z_k) - z_goal |, with z_goal = E(goal image). The plan is the action sequence with the lowest E, found by CEM (F03-113, code in F03-30).

**5. LeWorldModel loss (F03-35, F03-36).** One encoder, trained together with the predictor, no target copy, no sg.

L = || z-hat_t+1 - z_t+1 ||^2 + lambda x SIGReg(Z), with z-hat_t+1 = P_phi(z_t, a_t)

The first term is the squared prediction error. The second measures how far the batch of embeddings Z is from a round Gaussian cloud. lambda is the one weight: 0.1 in the paper, 0.09 in the released config (F03-37).

**6. SIGReg (F03-38, F03-39, F03-69).** Intuition: a collapsed encoder gives a single point; a healthy one gives a spread-out cloud. Asking the cloud to look like a standard Gaussian in every direction rules out the point and also rules out a flat pancake (dimensional collapse, F03-64). Testing a 192-dimensional cloud directly is expensive, so test its shadow on many random lines: if every one-dimensional shadow is Gaussian, the cloud is Gaussian (the Cramer-Wold theorem, F03-39).

For one random unit direction u and a batch of N embeddings z_1..z_N, let p_n = u . z_n (the shadow of each embedding on the line). The statistic for that direction is

N x integral over t of w(t) x [ ( mean_n cos(t p_n) - exp(-t^2 / 2) )^2 + ( mean_n sin(t p_n) )^2 ] dt

mean_n cos(t p_n) and mean_n sin(t p_n) are the real and imaginary parts of the batch's characteristic function (a fingerprint of a distribution); exp(-t^2 / 2) is the same fingerprint for a standard Gaussian, whose imaginary part is zero; w(t) = exp(-t^2 / 2) is a weighting window; the integral is taken numerically at 17 points t from 0 to 3. SIGReg is the average over 1,024 random directions (and over time steps). Tensor shapes in the released code with batch 128, 4 frames, width 192: embeddings (4, 128, 192) times a (192, 1024) random matrix gives (4, 128, 1024) shadows, times 17 values of t gives 4 x 128 x 1,024 x 17 = 8,912,896 cosines and as many sines per training step `[derived]`.

**7. The five ways to prevent collapse, side by side (F03-65 to F03-71).**

| Mechanism | Used by | What it does | Its price |
|---|---|---|---|
| EMA target + stop-gradient | I-JEPA, V-JEPA, V-JEPA 2, V-JEPA 2.1 | the target moves slowly and receives no gradient, so it cannot rush to meet the prediction | explained by hypothesis, not by a defined objective (F03-65, F03-66); a second encoder in memory |
| Variance and covariance terms | VICReg, PLDM | keep every dimension's spread above a threshold; push correlations between dimensions to zero | several loss weights to tune: six for PLDM (F03-68) |
| SIGReg | LeJEPA, LeWorldModel | push the embedding cloud toward a round Gaussian | one weight; weakens in very simple, low-diversity environments (F03-45) |
| Contrastive negatives | older joint-embedding methods | push different inputs' embeddings apart | negatives needed grow with dimension (F03-70) |
| Frozen pretrained encoder | V-JEPA 2-AC, RoboJEPA, DINO-WM | the encoder is not trained, so it cannot collapse | the representation is whatever pretraining kept (F03-71, F03-111) |

#### What it costs in compute, and which part of the machine it loads

| Workload | Published figure | Entry | Part of the machine |
|---|---|---|---|
| Pretraining the video encoder | V-JEPA 2 ViT-g: projection of about 60 A100 GPU-years without progressive resolution, 8.4x less with it (about 7 `[derived]`); released ViT-L config asks for 16 nodes x 8 GPUs. Actual run not stated | F03-12, F03-13 | GPU tensor cores, many nodes, network; video decode to feed batches of 3,072 clips (decode path not examined in this register) |
| Pretraining an image JEPA (history) | I-JEPA ViT-H/14: 16 A100, under 72 hours, under 1,200 GPU-hours | F03-57 | GPU tensor cores |
| Training the action-conditioned predictor | V-JEPA 2-AC: config asks for 4 nodes x 8 GPUs, 94,500 iterations at batch 256; GPU model and time not stated. RoboJEPA-1B: 32 nodes x 8 H100 | F03-21, F03-80 | GPU tensor cores; the frozen 1B encoder runs forward on every batch |
| Training a small JEPA world model end to end | LeWM 15M: "a single GPU in a few hours", GPU not named; batch 128, bf16 | F03-31, F03-37 | one GPU's tensor cores; image decode and data loading on the CPU |
| Planning, large model | V-JEPA 2-AC: 16 s per action on an RTX 4090; 3 s on an A100. V-JEPA 2.1 at horizon 8: 14 s on an A100. RoboJEPA: several seconds across several GPUs | F03-25, F03-74, F03-73, F03-77 | GPU tensor cores (thousands of batched predictor passes); GPU memory for the batch of candidates (not published) |
| Planning, small model | LeWM: 0.98 s per plan, GPU not named | F03-41 | GPU tensor cores; small enough that CPU-side overhead may matter `[our reading]` |

No JEPA workload here uses ray-tracing cores or video encode engines. The camera frame must still be decoded and resized before the encoder.

#### Order to teach it in (section 7)

1. Representation: an encoder turns a frame into numbers that keep what matters (use example B step 1 or C step 2 for the picture).
2. JEPA's three parts and the energy (F03-47, F03-48).
3. Why the naive version fails: collapse, complete and dimensional (F03-63, F03-64).
4. Masked prediction on images, I-JEPA, as the simplest working case, with EMA and stop-gradient (F03-54 to F03-56).
5. The same on video: tubelets, heavy masking, V-JEPA then V-JEPA 2 (F03-59, F03-60, F03-1 to F03-11). Worked example A.
6. Adding actions: the frozen encoder and the action-conditioned predictor, teacher forcing and rollout (F03-14 to F03-19).
7. Planning: energy to a goal image, MPC, CEM. Worked example B (F03-23, F03-112, F03-113, F03-24, F03-25).
8. What the robot results are and where they stop (F03-26 to F03-28).
9. The small end-to-end alternative: LeWorldModel and SIGReg. Worked example C (F03-31 to F03-41).
10. The five anti-collapse mechanisms side by side (F03-65 to F03-71).
11. What is newest: V-JEPA 2.1, RoboJEPA, the JEPA-WMs study, AMI Labs (F03-72 to F03-86).
12. Limits: goal images, short horizons, one predicted future, compute per decision (F03-28, F03-45, F03-79, F03-110, F03-114).

---

## 6. Stale or wrong in the seed research

| Seed file | Seed claim | What the source says now | Entry |
|---|---|---|---|
| seed 10 | LeWM trains in a few hours on one GPU, "an L40S in the paper" | Paper v3 says "a single GPU in a few hours" and names no GPU model in the text read | F03-31 |
| seed 10 | LeWM plans "up to 48x faster than foundation-model world models" | The 48x is one comparison: 0.98 s against 47 s for DINO-WM | F03-41 |
| seed 10 | V-JEPA 2-AC plans at "about 16 s per action" | 16 s is on an RTX 4090 (V-JEPA 2 paper); the V-JEPA 2.1 paper reports 3 s on an A100 for the same settings | F03-25, F03-74 |
| seed 10, seed 12 | V-JEPA 2 and V-JEPA 2-AC are the newest JEPA models | V-JEPA 2.1 (March 2026) and RoboJEPA (October 2026) are newer | F03-72, F03-75 |
| seed 01 | DreamZero is "the WAM that GR00T N2/GR00T 2 builds on" | The GR00T 2 whitepaper says it is built on Cosmos-Predict2.5-2B; DreamZero appears as a compared policy | F03-104 |
| seed 02 | Cosmos 3 per-clip latency: "not on the repo page" | Published in the repository's inference benchmark pages | F03-98, F03-99 |
| seed 02 | Memory figures of 65.4 GB and 56.38 GB used to select instances | Those are Cosmos-Transfer2.5-2B and Cosmos-Predict2-14B; Predict2.5's repository is in limited maintenance and Cosmos 3's memory need is not published | F03-94, F03-105 |
| seed 02 | Genie 4 "NOT VERIFIED" (Wikipedia only) | First-party model page presents Genie 4; the date is still not on that page | F03-101 |
| seed 11 | LeWM "ships Push-T" as its dataset example | The README describes HDF5 files; the Push-T config at the pinned SHA names a `.lance` file; other environments have configs too | F03-44 |

---

## 7. Mental models worth teaching

1. **A world model is a "what if" function.** State plus action in, next state out; everything else (planning, imagination training, synthetic data, evaluation) is a way of calling it many times (F03-87, F03-88).
2. **Predict the summary, not the picture.** A JEPA predicts the encoder's description of the future, so it can ignore what cannot be predicted; the cost is that you cannot look at its prediction and it keeps only what the encoder kept (F03-51, F03-106, F03-107, F03-109, F03-111).
3. **A model that writes its own targets will cheat unless stopped.** Collapse is the default outcome of matching two learned representations, and each JEPA is defined largely by its anti-cheating rule: slow target, spread statistics, Gaussian cloud, or frozen encoder (F03-63, F03-65 to F03-71).
4. **Energy is distance to "plausible".** Training lowers the distance between prediction and target for real data; planning reuses the same distance, measured to a goal image, as the cost to minimise (F03-48, F03-23).
5. **Planning is paid in predictor passes.** Samples x iterations x horizon gives the bill: 8,000 for V-JEPA 2-AC, 45,000 for LeWM, 204,800 for RoboJEPA; the size of one pass decides whether that is 1 s or 16 s (F03-115, F03-118).
6. **Video teaches how the world moves; a little robot data teaches what actions do.** 1M hours of video and 62 hours of robot data for V-JEPA 2; 2,541 hours of video and 100 hours of actions for Dreamer 4 (F03-1, F03-91).
7. **Search or amortise.** A latent world model searches for actions at run time (seconds per decision); a world-action model has the search folded into one forward pass (GR00T 2 at 153 ms) (F03-25, F03-104, F03-116).
8. **"Pixel model" means "reconstruction code".** Video world models in 2026 also work in a compressed space; the difference from JEPA is that their code must rebuild every pixel (F03-96).
9. **Small can be enough when the task is narrow.** A 15M-parameter model with 192 numbers per frame plans Push-T at 96% success; the same paper shows a frozen-foundation-encoder model ahead on the 3D cube task (F03-31, F03-42).

---

## 8. Contradictions between sources

| Topic | Source A | Source B | How the dive should handle it |
|---|---|---|---|
| V-JEPA 2-AC planning time | 16 s per action, RTX 4090 (V-JEPA 2 paper, F03-25) | 3 s per action, single A100, same settings (V-JEPA 2.1 paper, F03-74) | Print both with their GPU. The 5x gap is not explained in either paper |
| V-JEPA 2-AC clip length | 16-frame clips (paper, F03-20) | `dataset_fpcs: [8]` (released config, F03-22) | Code is the authority for what the release runs; say the paper describes 16 |
| V-JEPA 2-AC planner settings | 800 samples, horizon 1 (paper, F03-24) | 400 samples, rollout 2, translation and gripper only (notebook defaults, F03-29) | Paper settings for the published numbers; note the notebook is a demo |
| V-JEPA 2-AC rollout loss | Paper formula compares the rollout with the true later frame (F03-18) | JEPA-WMs reports the released code computed it against the wrong frame (F03-82) | State as reported by a third party; our reading of the pinned SHA is recorded under U5 |
| LeWM SIGReg weight | lambda = 0.1 (paper, F03-36) | 0.09 (released config, F03-37) | Give both; the paper reports success is flat between 0.01 and 0.2 (F03-46) |
| LeWM epochs | 10 epochs (paper, F03-43) | `max_epochs: 100` (released config, F03-37) | Give both; any Tier 0 run must record which it used |
| LeWM dataset format | HDF5 (README, F03-44) | `.lance` in the Push-T config (F03-44) | Code is the authority; the loader lives in a package not read here (U8) |
| I-JEPA venue | arXiv comment names the IEEE/CVF International Conference on Computer Vision | the repository description says CVPR | Cite as arXiv 2301.08243v3 without a venue until confirmed |
| Cosmos 3 training GPU counts | section 4.1 text: 1,024 (Nano) and 2,048 (Super) GB200 (F03-97) | another line in the same paper reads "2048 and 4096 GPUs, respectively" (noted in the seed research and seen again in v4) | Quote section 4.1 and flag the second line; not resolved here (U12) |
| Is latent prediction better | V-JEPA and V-JEPA 2 authors: yes, for representation quality and planning cost (F03-62, F03-25) | DreamZero and GR00T 2: video prediction gives a dense training signal and runs at 153 ms when actions are output directly (F03-93, F03-104) | Present as an open design argument with each side's evidence and its limits |
| V-JEPA 2.1 release year | README "What's new" and arXiv: March 2026 (F03-72) | `CHANGELOG.md` at the pinned SHA: "[0.0.2] - 2025-03-16" | A typo in the changelog `[our reading]`: the entry sits above the 2025-06-05 initial release |
| Cosmos 3 parameter counts (added in wave 3) | Model cards: Nano 16B, Super 64B, Edge 4B (F03-117, F03-123) | cosmos-framework `docs/faq.md` labels them "Cosmos3-Nano (8B)" and "Cosmos3-Super (32B)"; `docs/training.md` calls Edge "only 2B" (F03-123, F03-126) | Use the model cards' counts. `[our reading]` The smaller labels count one tower (the generator or the reasoner) and the cards count the whole model; the framework's own notes call "8B Nano" a retired label (F03-124) |

---

## 9. UNKNOWN register

| ID | Unknown | Where it arises | What would close it |
|---|---|---|---|
| U1 | The GPU model and measured wall-clock time of LeWM training | F03-31 | A statement from the authors, or our own run (Tier 0) |
| U2 | The GPU used for LeWM's 0.98 s and DINO-WM's 47 s planning times, and which CEM settings were timed | F03-41, F03-118 | The paper's timing setup, if a later version states it; or timing `eval.py` ourselves |
| U3 | Actual GPU count and wall-clock time of the released V-JEPA 2 pretraining run | F03-12, F03-13 | An author statement; the paper gives only a projection |
| U4 | GPU model and wall-clock time of V-JEPA 2-AC predictor training; the cell values of JEPA-WMs Table 6 | F03-21, F03-120 | Read Table 6 of arXiv 2512.24497v4 in full |
| U5 (CLOSED by wave 2: fixed by commit 93366fe7 on 2025-06-20; the pinned SHA has the fix, see F03-82) | Whether facebookresearch/vjepa2 at the pinned SHA still has the rollout-loss behaviour that JEPA-WMs reports | F03-82 | Git history of `app/vjepa_droid/train.py`. Our reading of lines 424 to 448 at the pinned SHA: with `auto_steps: 2` the loop predicts frame 3 from the true frame 1 and the predicted frame 2 and compares with frames 2 and 3, which matches the paper's formula; we did not find the miscomputation in those lines, did not run the code, and did not check whether the file changed after the JEPA-WMs authors read it |
| U6 | GPU memory used by V-JEPA 2-AC planning (800 candidates x 258 tokens through a 300M predictor) | F03-25 | Run the notebook with a memory profiler (Tier 0) |
| U7 | Genie 4's release date, frame rate, resolution, model size and hardware | F03-101 | A dated first-party post; the model page has none of these |
| U8 | How `stable-worldmodel` loads datasets and what adapting it to LeRobot episodes needs | F03-44 | Read galilai-group/stable-worldmodel at a pinned SHA |
| U9 | RoboJEPA: number of GPUs used by the real-robot planner, seconds per decision, and total GPU-hours per model size | F03-77, F03-80 | Read the RoboJEPA appendix tables and the repository's planning configs |
| U10 (CLOSED by wave 3, 2026-11-20: NIM per-device floors F03-121 and F03-122; framework FAQ figure F03-123; measured peaks on one H100 F03-124; 12 GB offload path F03-125; benchmark GPU-count convention F03-126; Edge on 16 GB to 128 GB Jetson devices F03-127. STILL OPEN inside it: no measured peak for a 189-frame Nano video on the PyTorch path, and none for the robot forward-dynamics rollout of F03-99) | GPU memory needed to run Cosmos3-Nano, Super and Edge | F03-105 | A first-party figure, or a measurement |
| U11 | The rollout length (frames, action steps) behind the Cosmos3-Nano "Forward Dynamics - Robot" timing | F03-99 | NVIDIA's methodology page says the payloads were not retained for every measurement; a rerun would be needed |
| U12 (wave 2 proposes CLOSED: v4 gives 1,024 and 2,048 GB200 consistently in three passages; no conflicting set found) | Which GPU counts are right for Cosmos 3 pretraining where the paper gives two sets | F03-97 | An erratum or a later paper version |
| U13 | Whether AMI Labs has released any model, paper or code | F03-85 | None is listed on its site as of 2026-11-20; recheck before publication |
| U14 | DreamerV3's publication venue | F03-89 | The journal page; not fetched in this pass |
| U15 | The contents of facebookresearch/eb_jepa and facebookresearch/jepa-wms (located, not read) | section 3 | Read both at a pinned SHA |
| U16 | Whether any JEPA world model has been trained or run on an SO-100 or SO-101 arm | section 5 | Not located in this research; a search of the LeRobot hub and issues, or our own run |
| U17 | GR00T 2's training compute and its code (announced for December) | F03-104 | The December release; the whitepaper's training section was not read in full |

---

## 10. Reading path for Carlos

1. **LeWorldModel paper, arXiv 2603.19312v3: the section "Method: LeWorldModel", the appendix algorithm "Cross-Entropy Method (CEM) for Action Sequence Optimization", then Figure 7.** The whole JEPA world model fits on two pages: encoder, predictor, two-term loss, CEM. Read this first because nothing in it is hidden behind scale.
2. **le-wm at SHA `8edfeb336732b5f3ce7b8b210d0ba370a09e2cac`: `train.py` lines 20 to 41, `module.py` class `SIGReg` (lines 10 to 36), `jepa.py` `rollout` and `get_cost`.** The paper's formulas as about 80 lines of code; the fastest way to see which tensor goes where.
3. **V-JEPA 2 paper, arXiv 2506.09985v1: the overview figure, the pretraining objective, the sections "V-JEPA 2-AC: Learning an Action-Conditioned World Model" and "Planning: Zero-shot Robot Control" (robot results and the 16 s against 4 min comparison), then "Limitations".** The large-scale version of the same idea, and the source of the planning numbers.
4. **vjepa2 at SHA `204698b45b3712590f06245fbfba32d3be539812`: `app/vjepa_droid/train.py` lines 419 to 448 (teacher forcing and rollout), `notebooks/utils/mpc_utils.py` (CEM), `src/models/ac_predictor.py` (how actions are interleaved).** What the release really runs, including where it differs from the paper.
5. **LeCun, "A Path Towards Autonomous Machine Intelligence" v0.9.2: the parts on energy-based models, "Joint Embedding Predictive Architecture (JEPA)" with Figure 12, and Figure 13 on non-contrastive training.** History, and where the vocabulary comes from (energy, collapse, Mode-1 and Mode-2).
6. **I-JEPA paper, arXiv 2301.08243v3: Figure 3 and section 3.** The cleanest picture of context encoder, target encoder and predictor.
7. **JEPA-WMs, arXiv 2512.24497v4: the introduction with its list of contributions, the limitations discussion, and the "V-JEPA-2-AC reproduction" paragraph in the appendix.** An independent, peer-reviewed check on what matters in this family, including the bug report.
8. **RoboJEPA, arXiv 2610.10515v1: abstract, the results table and the limitations section.** The newest and largest JEPA robot model, with the honest numbers (27% pick-and-place).
9. **NVIDIA/Cosmos at SHA `0eab578a8935e26aa41c2b7dc9f5ab00f790a037`: `docs/reference/models.md` and `docs/reference/inference_benchmarks/cosmos3-nano-generator.md`.** What the pixel side is and costs today.
10. **GR00T 2 whitepaper, the "Architecture" and "GR00T 2 Turbo" paragraphs.** The world-action model at 2B parameters and 153 ms; the strongest current counter-example to "video models are too slow to control a robot".
11. **DreamZero, arXiv 2602.15922v1: the introduction and the inference-optimisation results.** Why the world-action camp predicts video, and what it took to make it run.

---

## 11. Source list by tier

### Tier 0 (our experiments)

None in this register.

### Tier 1 (code at a pinned SHA, official docs, model cards)

- facebookresearch/vjepa2 at `204698b45b3712590f06245fbfba32d3be539812`: https://github.com/facebookresearch/vjepa2
- lucas-maes/le-wm at `8edfeb336732b5f3ce7b8b210d0ba370a09e2cac`: https://github.com/lucas-maes/le-wm
- NVIDIA/Cosmos at `0eab578a8935e26aa41c2b7dc9f5ab00f790a037`: https://github.com/NVIDIA/Cosmos
- nvidia-cosmos/cosmos-predict2.5 at `a2c298b0a3df3778b973fe65e9e58877b292d8a7`: https://github.com/nvidia-cosmos/cosmos-predict2.5
- facebookresearch/robo_jepa at `f93106f5f4a451fd526d51778aa8ab7c852eb824` (README only): https://github.com/facebookresearch/robo_jepa
- huggingface/lerobot v0.7.0 at `410c095eacc0011d998a73383eb94abed2715af0`: https://github.com/huggingface/lerobot
- Model card nvidia/Cosmos3-Nano, revision `45666784803b3a7ad577e0def405f9afcc3bddb2`: https://huggingface.co/nvidia/Cosmos3-Nano

### Tier 2 (first-party lab and vendor pages)

- GR00T 2 whitepaper and project page (NVIDIA, November 2026): https://research.nvidia.com/labs/gear/gr00t-2/assets/gr00t2_whitepaper.pdf ; https://research.nvidia.com/labs/gear/gr00t-2/
- Genie 4 model page (Google DeepMind): https://deepmind.google/models/genie/
- Genie 3 post (Google DeepMind, 2025-08-05): https://deepmind.google/blog/genie-3-a-new-frontier-for-world-models/
- 1X World Model post (1X, 2026-01-12): https://www.1x.tech/discover/world-model-self-learning
- AMI Labs site: https://amilabs.xyz/ ; https://amilabs.xyz/updates

### Tier 3 (papers)

Peer-reviewed, venue confirmed:
- JEPA-WMs, "What Drives Success in Physical Planning with Joint-Embedding Predictive World Models?" (TMLR, 05/2026): https://arxiv.org/abs/2512.24497v4
- VICReg (ICLR 2022; history): https://arxiv.org/abs/2105.04906v3

Preprints, or venue not confirmed in this pass:
- V-JEPA 2: https://arxiv.org/abs/2506.09985v1
- V-JEPA 2.1: https://arxiv.org/abs/2603.14482v3
- RoboJEPA: https://arxiv.org/abs/2610.10515v1
- LeWorldModel: https://arxiv.org/abs/2603.19312v3
- LeJEPA: https://arxiv.org/abs/2511.08544v3
- VL-JEPA: https://arxiv.org/abs/2512.10942v2
- Dreamer 4: https://arxiv.org/abs/2509.24527v1
- DreamZero: https://arxiv.org/abs/2602.15922v1
- Cosmos 3: https://arxiv.org/abs/2606.02800v4
- I-JEPA (history): https://arxiv.org/abs/2301.08243v3
- V-JEPA (history): https://arxiv.org/abs/2404.08471v1
- DreamerV3 (history): https://arxiv.org/abs/2301.04104v2
- LeCun, "A Path Towards Autonomous Machine Intelligence", v0.9.2, 2022-06-27 (history; position paper): https://web.archive.org/web/20240101103457/https://openreview.net/pdf?id=BZ5a1r-kVsf

### Tier 4 (used only to locate primary sources; nothing cited as fact)

- Press and encyclopedia pages reporting a Genie 4 launch date of 2026-10-27 (the date is recorded as UNKNOWN U7).
- Web search result pages used to find the arXiv listings and repositories above.
