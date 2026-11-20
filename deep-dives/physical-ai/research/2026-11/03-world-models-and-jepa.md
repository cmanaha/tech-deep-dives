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

<!-- CURRENCY-TABLE-PLACEHOLDER -->

<!-- PINNED-SOURCES-PLACEHOLDER -->

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
- Use in dive: section 7, the masking picture. The resulting fraction of tokens hidden is not printed in the V-JEPA 2 paper; the V-JEPA paper gives it (F03-41).

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
- Use in dive: sections 7 (collapse). A collapsed encoder outputs one point; a single point is as far from a bell curve as a distribution can be, so the statistic is large and the gradient pushes embeddings apart.

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
- Use in dive: section 6, evidence behind the latent argument (an ablation on representation quality, not on planning).

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
- Evidence: https://research.nvidia.com/labs/gear/gr00t-2/assets/gr00t2_whitepaper.pdf | Tier 2, first-party lab technical report (not on arXiv as of this pass) | definition and benchmark claim (vendor reported) | "GR00T 2 is built on Cosmos-Predict2.5-2B, a video diffusion transformer pretrained for world simulation. Video, state, and action inputs become tokens in one sequence that a single 2B-parameter transformer processes"; "A frozen Wan 2.1 video VAE compresses each camera stream 4x in time and 8x in each spatial dimension. The latents are split into patches, giving 280 tokens per latent frame and camera at 224 x 320."; "GR00T 2 is trained with flow matching on future video latents and actions together, with one loss for each. At inference, a few denoising steps suffice: one or two for video and two to four for actions"; "a median of 153 ms to predict an action chunk for Dexter from three camera views on a GeForce RTX 5090"; "Turbo predicts in 124 ms on the onboard Jetson Thor of the Unitree G1" (accessed 2026-11-20)
- Use in dive: section 6, the current world-action model `[vendor claim]`. The contrast with DreamZero is the teaching point: 14B on 2 GB200 at 7 Hz in February 2026, 2B on one workstation GPU in November 2026. Project page: https://research.nvidia.com/labs/gear/gr00t-2/ ("Code Available in December").

**F03-105. GPU memory needed to run Cosmos3-Nano is not printed on the model card or in the benchmark pages read; the card only says a layer-wise offload flag "can help reduce memory usage".**
- Location: Cosmos3-Nano model card; `cosmos3-nano-generator.md` header
- Verdict: UNKNOWN (seed 02's 65.4 GB and 56.38 GB figures are for Cosmos-Transfer2.5-2B and Cosmos-Predict2-14B, both superseded)
- Evidence: https://huggingface.co/nvidia/Cosmos3-Nano (revision `45666784803b3a7ad577e0def405f9afcc3bddb2`) | Tier 1, model card | documentation of support | "Number of trainable model parameters: Cosmos3-Nano: 16B"; "Setting `--enable-layerwise-offload` can help reduce memory usage on GPUs with less available memory."; benchmark page: "Cosmos3-Nano rows use one GPU at 720p." (accessed 2026-11-20)
- Use in dive: compute table. [derived] 16B parameters at 2 bytes each (BF16) is 32 GB for the weights alone, before activations; the benchmark runs it on single GPUs from 80 GB (H100) upward and on the 96 GB RTX PRO 6000 Blackwell.

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

