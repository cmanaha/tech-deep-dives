# 01 Robot basics: research register

## 1. Header

- **Research date:** 2026-11-20. Every URL in this file was accessed 2026-11-20.
- **Area:** stream 01 of the "Physical AI" dive. The robot as a computer: the SO-101 arm as the concrete case, its servos, sensors, action space, the LeRobot software that drives it, control rates from the servo loop up to a vision-language planner, and why latency is a physical quantity.
- **Sections fed:** section 3, "The Robot as a Computer". Entries on action chunking and on VLA outputs are pointers only; stream 02 owns them.
- **Seed research:** none for this stream. The rate ladder in seed 04 section 2.1 was re-fetched source by source before anything was carried (group H).
- **Reader:** knows computers (IT or software), has no robotics background.
- **Quote policy:** quotes are verbatim from the pinned version, with house normalisation: curly quotes become straight quotes, typographic dashes and non-breaking hyphens become " - " or a hyphen, multiplication signs become "x", degree, arrow and currency symbols are written out. Ellipses mark omissions. Code is quoted with its file and line numbers at the pinned ref.
- **Verdicts:** NEW (recorded fresh from the primary source); CARRIED (seed NN, re-fetched); STALE; WRONG; UNKNOWN (see section 9).
- **Labels:** `[derived]` arithmetic with inputs shown; `[vendor claim]` and `[author reported]` for performance figures from the party that built the thing; `[our reading]` for synthesis; `[illustration]` for invented toy numbers.

### Tiers

| Tier | What it covers |
|---|---|
| Tier 0 | Our experiments (none in this file) |
| Tier 1 | Source code at a pinned tag or 40-character SHA; official docs; manufacturer datasheets and memory tables |
| Tier 2 | First-party vendor or lab blogs and talks |
| Tier 3 | Papers ("peer-reviewed (venue)" only where the venue was confirmed, otherwise "preprint"); third-party technical analysis |
| Tier 4 | Tutorials and press. Used only to locate primary sources |

Code is the authority over documentation.

## 2. Currency table

Newest first-party version found on 2026-11-20 for everything this register names. "Seed" is what the seed research named (seed 04 section 2.1 and 2.2 are the only seed passages this stream touches).

| Item | Newest version found | Release date | Source | What the seed research named |
|---|---|---|---|---|
| LeRobot (huggingface/lerobot) | v0.7.0, tag commit `410c095eacc0011d998a73383eb94abed2715af0` | 2026-11-05 (GitHub release 2026-11-05T17:13:20Z; PyPI upload 2026-11-05T17:13:33) | https://github.com/huggingface/lerobot/releases/tag/v0.7.0 and https://pypi.org/pypi/lerobot/json | 0.7.0 seen on one machine. Confirmed as the newest release. Earlier: v0.6.1 (2026-08-03), v0.6.0 (2026-07-06), v0.5.1 (2026-04-07), v0.5.0 (2026-03-09) |
| SO-ARM100 repository (TheRobotStudio/SO-ARM100), home of the SO-101 design | default-branch head `141aea7bcac2744d92998e30268c413202a56f96` | commit of 2026-11-20T15:10:12Z (a vendor-list edit to the README; the SO-101 URDF was last changed 2025-07-02, commit `385e8d7c68e24945df6c60d9bd68837a4b7411ae`) | https://github.com/TheRobotStudio/SO-ARM100 (read at that SHA) | named without a SHA |
| SO-ARM100 tagged release | v0.1.1 | 2024-05-17 | `gh api repos/TheRobotStudio/SO-ARM100/releases` | not named. The only tagged release predates the SO-101, so the SHA above is the pin |
| Newer arm revision than the SO-101 | none found. The README at the pinned SHA presents the SO-101 as "the next-generation version of the SO-100" and marks the SO-100 docs deprecated; LeRobot v0.7.0 docs call the SO-101 "our flagship robot"; the owner's other repositories hold no newer arm | n/a | SO-ARM100 README at `141aea7`; LeRobot `docs/source/so101.mdx` at v0.7.0; `gh api users/TheRobotStudio/repos` | SO-101 |
| Servo: Feetech STS3215 | Product Specification edition A/0 (the only edition in its change record) | 2020-04-10 | https://core-electronics.com.au/attachments/uploads/sts3215-smart-servo-datasheet-translated.pdf (reseller-hosted machine translation) | not named. A newer edition on Feetech's own site was not checked (U3) |
| rustypot (pollen-robotics/rustypot), the servo I/O library under LeRobot v0.7.0 | v1.14.0, `5060152f23abdeed3790f08f7a9358e26351aeab`. Read at v1.13.1 (`7aa85e13143594ea4fd4ed9f29e3e29d39b5de85`), the lowest version LeRobot v0.7.0 accepts (`rustypot>=1.13.1,<2.0.0`) | v1.14.0 on PyPI 2026-11-17; v1.13.1 on 2026-10-14 | https://pypi.org/pypi/rustypot/json and `gh api repos/pollen-robotics/rustypot/tags` | not named. The STS3215 table was not diffed between 1.13.1 and 1.14.0 (U12) |
| NVIDIA GR00T, released code | GR00T N1.7, GitHub release `n1.7-release` (`23ace64f17aa5015259b8609d371eb61a357c776`); repo head read at `708617f5716c63fc0a327391492ea2b91977ae90` | release 2026-04-18; head commit 2026-11-17. Other releases: `n1.6.1-release` 2026-04-23, `n1.6-release` 2026-04-15, `n1.5-release` 2025-12-15 | `gh api repos/NVIDIA/Isaac-GR00T/releases` | "GR00T N1" rates and "GR00T 2" |
| NVIDIA GR00T, newest announced | GR00T 2 (research page; "Code Available in December") | page dated November 2026 | https://research.nvidia.com/labs/gear/gr00t-2 | "GR00T 2" named; confirmed |
| NVIDIA SONIC whole-body controller paper | arXiv 2511.07820v4 | v4 is the latest version listed on 2026-11-20 | https://arxiv.org/abs/2511.07820v4 | cited without a version |
| Physical Intelligence, newest model paper | pi0.7, arXiv 2604.15483v2 | submitted 2026-04-16; v2 online 2026-04-24 | https://arxiv.org/abs/2604.15483v2 | pi0.7 named; confirmed. A later PI model was not searched for beyond one web search (U13) |
| Figure Helix | Helix 2.5 (wave 2: supersedes Helix 02 as newest; publishes no control rates) | 2026-09-17 | https://www.figure.ai/news/helix-2-5-zero-shot-30-home-generalization | Helix and Helix 02. Helix 02 (2026-01-27, https://www.figure.ai/news/helix-02) remains the last Figure post with published rates |
| Google DeepMind Gemini Robotics | Gemini Robotics 2.5 | 2026-11-10 (Gemini Robotics 2 family: 2026-07-30) | https://deepmind.google/blog/gemini-robotics-2-5-accelerates-real-world-physical-intelligence/ | the March 2025 Gemini Robotics report only. The 2026 posts publish no rates (F01-79) |
| OpenArm hardware docs (the quasi-direct-drive comparison arm) | "Version: 2.0" | page last updated 2026-11-16 | https://docs.openarm.dev/hardware/openarm-2.0/motor | not named |

## 3. Pinned sources

All accessed 2026-11-20.

**Code (tag and 40-character SHA)**

| Repository | Ref | SHA | Files read | Entries |
|---|---|---|---|---|
| TheRobotStudio/SO-ARM100 | default-branch head, 2026-11-20 | `141aea7bcac2744d92998e30268c413202a56f96` | `README.md`, `CHANGELOG.md`, `Simulation/SO101/README.md`, `Simulation/SO101/so101_new_calib.urdf`, `Simulation/SO101/so101_new_calib.xml`, `Simulation/SO101/joints_properties.xml` | F01-1 to F01-7, F01-43, F01-48 to F01-50, F01-52, F01-63 |
| huggingface/lerobot | v0.7.0 | `410c095eacc0011d998a73383eb94abed2715af0` | under `src/lerobot/`: `robots/so_follower/so_follower.py`, `robots/so_follower/config_so_follower.py`, `teleoperators/so_leader/so_leader.py`, `teleoperators/so_leader/config_so_leader.py`, `motors/motors_bus.py`, `motors/feetech/feetech.py`, `motors/damiao/damiao.py`, `motors/damiao/tables.py`, `scripts/lerobot_record.py`, `scripts/lerobot_teleoperate.py`, `utils/cycle_timer.py`, `utils/robot_utils.py`, `utils/feature_utils.py`, `utils/constants.py`, `robots/utils.py`, `configs/dataset.py`, `configs/video.py`, `cameras/configs.py`, `cameras/opencv/configuration_opencv.py`, `model/kinematics.py`, `policies/{act,smolvla,pi05,groot,diffusion}/configuration_*.py`; `pyproject.toml`; under `docs/source/`: `so101.mdx`, `il_robots.mdx`, `cameras.mdx`, `inference.mdx`, `remote_inference.mdx`, `action_representations.mdx`, `hardware_guide.mdx`, `installation.mdx`, `openarm.mdx`, `damiao.mdx`, `unitree_g1.mdx`, `_toctree.yml` | F01-8 to F01-41, F01-51, F01-53 to F01-58, F01-62, F01-65 to F01-69, F01-81, F01-85 to F01-91 |
| huggingface/lerobot | v0.6.1 | `7e241bd630a3719a56157a497ce5d08f244784f1` | `src/lerobot/robots/so_follower/config_so_follower.py` (one default compared) | F01-19 |
| pollen-robotics/rustypot | v1.13.1 | `7aa85e13143594ea4fd4ed9f29e3e29d39b5de85` | `src/servo/feetech/sts3215.rs` | F01-11, F01-12, F01-14, F01-15 |
| NVIDIA/Isaac-GR00T | default-branch head, 2026-11-17 (newest release tag `n1.7-release` = `23ace64f17aa5015259b8609d371eb61a357c776`) | `708617f5716c63fc0a327391492ea2b91977ae90` | `README.md`, `scripts/deployment/README.md` | F01-60, F01-74, F01-92 |

Raw-file URL pattern used for every code quote: `https://raw.githubusercontent.com/<owner>/<repo>/<sha>/<path>`.

**Papers (arXiv ID with version; venue as confirmed)**

| arXiv | Paper | Venue | Entries |
|---|---|---|---|
| 2604.15483v2 | pi0.7 (Physical Intelligence), submitted 2026-04-16 | preprint | F01-59, F01-61, F01-77 |
| 2511.07820v4 | SONIC: whole-body humanoid control (NVIDIA) | preprint | F01-64, F01-75 |
| 2506.07339v2 | Real-Time Execution of Action Chunking Flow Policies (real-time chunking) | preprint (venue not confirmed in this pass) | F01-80 |
| 2504.16054v1 | pi0.5 (Physical Intelligence), April 2025 | preprint | F01-59, F01-61, F01-76 |
| 2503.14734v2 | GR00T N1 (NVIDIA), March 2025 | preprint | F01-70 |
| 2503.20020v1 | Gemini Robotics (Google DeepMind), March 2025 | preprint | F01-78 |
| 2410.24164v4 | pi0 (Physical Intelligence), 2024. Cited as the paper that introduced the design | preprint | F01-61, F01-76 |

**Datasheets**

- Feetech STS3215 Product Specification, edition A/0, 2020-04-10: https://core-electronics.com.au/attachments/uploads/sts3215-smart-servo-datasheet-translated.pdf (F01-42 to F01-47, F01-82, F01-84)
- Feetech STS3215 evaluation note (2020): https://www.mantech.co.za/datasheets/products/sts3215-200620a-1.pdf (F01-44, F01-46)

**First-party web pages (unversioned)**

- https://research.nvidia.com/labs/gear/gr00t-2 (F01-73)
- https://www.figure.ai/news/helix (F01-71) and https://www.figure.ai/news/helix-02 (F01-63, F01-72)
- https://deepmind.google/blog/gemini-robotics-2-brings-whole-body-intelligence-to-robots/ and https://deepmind.google/blog/gemini-robotics-2-5-accelerates-real-world-physical-intelligence/ (F01-79)
- https://docs.openarm.dev/hardware/openarm-2.0/motor (F01-66)

---

## 4. Claim register

### A. The SO-101 arm: hardware as the repository states it

**F01-1. The SO-101 is the successor to the SO-100 arm, designed by TheRobotStudio with Hugging Face; the changes it lists are better wiring, easier assembly and different motors on the leader arm.**
- Location: `README.md`, opening paragraph, SO-ARM100 at `141aea7`
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/TheRobotStudio/SO-ARM100/141aea7bcac2744d92998e30268c413202a56f96/README.md | Tier 1, first-party docs (hardware repo) | definition | "The SO-101 is the next-generation version of the SO-100 robot arm, originally designed by the RobotStudio in collaboration with Hugging Face. It has improved wiring, is easier to assemble (no gear removal) and uses updated motors for the leader arm." (accessed 2026-11-20)
- Use in dive: section 3, the one-line introduction of the arm the whole dive follows.

**F01-2. The standard setup is two arms: a leader arm a person moves by hand and a follower arm that copies it. They share almost all off-the-shelf parts and differ in their motors.**
- Location: `README.md`, "Sourcing Parts"
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/TheRobotStudio/SO-ARM100/141aea7bcac2744d92998e30268c413202a56f96/README.md | Tier 1, first-party docs | definition | "The follower and leader arm for this teleoperation setup will almost the same off the shelf parts (except for the motors). If you plan on creating the classic teleoperation set up to be used with the `LeRobot` library please buy from the Parts for Two Arms below." (accessed 2026-11-20; the missing verb is in the source)
- Use in dive: section 3, introducing leader and follower before teleoperation is mentioned.

**F01-3. The bill of materials for the two-arm set totals $229.88 in the US column (EUR 226.3 in the EU column); one follower arm alone totals $121.94 (EUR 124.3). These totals exclude the 3D-printed plastic parts and any camera.**
- Location: `README.md`, tables "Parts For Two Arms (Follower and Leader Setup)" and "Parts for One Follower Arm", rows "Total"
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/TheRobotStudio/SO-ARM100/141aea7bcac2744d92998e30268c413202a56f96/README.md | Tier 1, first-party docs | documentation of support (list prices as the repo states them; vendor prices move) | "| Total | --- | $229.88 | --- | EUR226.3 |" and "| Total | --- | $121.94 | --- | EUR124.3 |" (currency sign normalised to "EUR"; accessed 2026-11-20). The tables list servos, motor control board, USB-C cables, power supply, table clamps and a screwdriver set; no printed parts and no camera row [our reading of the table rows].
- Use in dive: section 3, "what the arm costs", with the caveat on what the total leaves out.

**F01-4. Each arm has six STS3215 servos. The two-arm bill of materials lists twelve: 7 with 1/345 gearing (part code C001), 2 with 1/191 gearing (C044), 3 with 1/147 gearing (C046), each at $13.89.**
- Location: `README.md`, "Parts For Two Arms" table, first three rows; footnote 2
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/TheRobotStudio/SO-ARM100/141aea7bcac2744d92998e30268c413202a56f96/README.md | Tier 1, first-party docs | documentation of support | "| STS3215 Servo 7.4V, 1/345 gear (C001) ... | 7 | $13.89 |", "| STS3215 Servo 7.4V, 1/191 gear (C044) ... | 2 | $13.89 |", "| STS3215 Servo 7.4V, 1/147 gear (C046) ... | 3 | $13.89 |"; footnote: "all six STS3215 servos needed for the SO-101 leader arm (3 x 1/147 gear (C046), 2 x 1/191 gear (C044), 1 x 1/345 gear (C001))" (accessed 2026-11-20). [derived] 7 + 2 + 3 = 12 servos; follower 6 x C001, leader 1 x C001 + 2 x C044 + 3 x C046.
- Use in dive: section 3, the parts list and the leader-versus-follower gearing difference.

**F01-5. The follower's servo comes in two voltage variants. The 7.4 V version has a stall torque of 16.5 kg.cm at 6 V; the 12 V version has 30 kg.cm and needs a 12 V, 5 A or larger power supply. The SO-101 leader is always 7.4 V.**
- Location: `README.md`, "Sourcing Parts", the IMPORTANT callout
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/TheRobotStudio/SO-ARM100/141aea7bcac2744d92998e30268c413202a56f96/README.md | Tier 1, first-party docs | documentation of support (torque figures are the repo restating the servo vendor: [vendor claim]) | "The STS3215 motors for the follower arm comes in two sizes. The 7.4V has a stall torque of 16.5kg.cm at 6V (and likely slightly less for a 5V power supply). The 12V version has a stall torque of 30kg.cm. While we found the 7.4V to be sufficient, if you would like more powerful motors you can buy the 12V version ... Note if you do this, you will also have to buy a 12V 5A+ power supply instead of a 5V one. The leader arm is always 7.4V for the SO101." (accessed 2026-11-20)
- Use in dive: section 3, servo strength and the voltage choice. [derived] 16.5 kg.cm x 0.0980665 N.m per kg.cm = 1.62 N.m; 30 kg.cm = 2.94 N.m.

**F01-6. Each arm's servos hang off one "Motor Control Board" (a Waveshare serial bus servo driver board in the linked listing, $10.6) that connects to the computer by USB-C. The arm's bill of materials contains no computer.**
- Location: `README.md`, parts tables, rows "Motor Control Board", "USB-C Cable 2 pcs", "Power Supply"
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/TheRobotStudio/SO-ARM100/141aea7bcac2744d92998e30268c413202a56f96/README.md | Tier 1, first-party docs | documentation of support | "| Motor Control Board | 2 | $10.6 | [Amazon](https://www.amazon.com/Waveshare-Integrates-Control-Circuit-Supports/dp/B0CTMM4LWK/) |" and "## Debugging Motors / For debugging, any Windows PC can connect over USB to program the servos and to debug or do tests." (accessed 2026-11-20). The absence of a computer in the table is [our reading] of the listed rows.
- Use in dive: section 3, "what compute sits on the arm": none; a host computer drives it over USB.

**F01-7. Cameras are optional add-ons in the hardware repo: it ships mounts for an overhead camera (a webcam or a 32x32 mm UVC module) and for wrist cameras (32x32 mm UVC module, Intel RealSense D405, RealSense D435/D435I, a Vinmooog webcam). It names no single required camera.**
- Location: `README.md`, "Optional Hardware", items 2 "Overhead Camera Mount" and 5 "Wrist-Mount Cameras"
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/TheRobotStudio/SO-ARM100/141aea7bcac2744d92998e30268c413202a56f96/README.md | Tier 1, first-party docs | documentation of support | "#### 2. Overhead Camera Mount / For bird's-eye views in single or bi-manual setups." and the wrist-camera table header "| 32x32 UVC Hex Nut (SO101) | 32x32 UVC Integrated (SO100/101) | 32x32 UVC Plug-on | RealSense D405 | RealSense D435/D435I | Webcam (Vinmooog) |" (accessed 2026-11-20)
- Use in dive: section 3, wrist camera versus scene camera on this arm.

### B. The SO-101 in LeRobot v0.7.0: joints, servo bus, encoder, units

Code URLs in this group use `https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/` (tag v0.7.0) and `https://raw.githubusercontent.com/pollen-robotics/rustypot/7aa85e13143594ea4fd4ed9f29e3e29d39b5de85/` (tag v1.13.1, the lowest rustypot version LeRobot v0.7.0 accepts).

**F01-8. In LeRobot v0.7.0 the SO-101 follower is six motors on one serial bus, with IDs 1 to 6: shoulder_pan, shoulder_lift, elbow_flex, wrist_flex, wrist_roll, gripper. All six are model `sts3215`. Five position the arm; the sixth opens and closes the gripper.**
- Location: `src/lerobot/robots/so_follower/so_follower.py` lines 68-80, tag v0.7.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/robots/so_follower/so_follower.py | Tier 1, code | code behaviour | `"shoulder_pan": Motor(1, "sts3215", norm_mode_body), "shoulder_lift": Motor(2, "sts3215", norm_mode_body), "elbow_flex": Motor(3, "sts3215", norm_mode_body), "wrist_flex": Motor(4, "sts3215", norm_mode_body), "wrist_roll": Motor(5, "sts3215", norm_mode_body), "gripper": Motor(6, "sts3215", MotorNormMode.RANGE_0_100),` (accessed 2026-11-20). The split "five arm joints plus one gripper" is [our reading] of the joint names and of the separate normalisation mode on the gripper.
- Use in dive: section 3, the list of joints; the basis of "the action is six numbers".

**F01-9. The SO-100 and SO-101 share one driver class in v0.7.0: `SO100Follower` and `SO101Follower` are both aliases of `SOFollower`, and the config registers under both `so101_follower` and `so100_follower`.**
- Location: `so_follower.py` lines 54-58 and 224-225; `config_so_follower.py` lines 56-64
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/robots/so_follower/so_follower.py | Tier 1, code | code behaviour | "Generic SO follower base implementing common functionality for SO-100/101/10X." and `SO100Follower = SOFollower` / `SO101Follower = SOFollower` (accessed 2026-11-20)
- Use in dive: section 3, a footnote: software written for the SO-100 follower runs on the SO-101 follower unchanged.

**F01-10. The follower uses six servos with 1/345 gearing. The leader uses three different gear ratios so that it holds its own weight and still moves easily by hand: shoulder pan 1/191, shoulder lift 1/345, elbow flex 1/191, wrist flex, wrist roll and gripper 1/147.**
- Location: `docs/source/so101.mdx`, "Step-by-Step Assembly Instructions", tag v0.7.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/so101.mdx | Tier 1, first-party docs | documentation of support | "The follower arm uses 6x STS3215 motors with 1/345 gearing. The leader, however, uses three differently geared motors to make sure it can both sustain its own weight and it can be moved without requiring much force." Table rows: "Base / Shoulder Pan | 1 | 1 / 191", "Shoulder Lift | 2 | 1 / 345", "Elbow Flex | 3 | 1 / 191", "Wrist Flex | 4 | 1 / 147", "Wrist Roll | 5 | 1 / 147", "Gripper | 6 | 1 / 147" (accessed 2026-11-20). Agrees with the bill of materials in F01-4 (1 x 1/345, 2 x 1/191, 3 x 1/147).
- Use in dive: section 3, the gear-ratio table and the backdrivability point (a lower reduction is easier to push by hand).

**F01-11. The STS3215 position sensor reports 4096 steps per full turn (12 bits).**
- Location: rustypot `src/servo/feetech/sts3215.rs` line 9, tag v1.13.1; LeRobot `motors_bus.py` `resolution()` docstring
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/pollen-robotics/rustypot/7aa85e13143594ea4fd4ed9f29e3e29d39b5de85/src/servo/feetech/sts3215.rs | Tier 1, code | code behaviour | "generate_servo!( STS3215, v1, resolution: 4096," and LeRobot `motors_bus.py`: "`int`: The steps per turn, e.g. 4096 on a 12-bit encoder." (accessed 2026-11-20). [derived] 360 / 4096 = 0.0879 degrees per step; 4096 / 360 = 11.38 steps per degree.
- Use in dive: section 3, worked example "encoder counts per degree".

**F01-12. LeRobot v0.7.0 opens the servo bus at 1,000,000 baud, which is also the STS3215 factory baud rate; the servo supports eight rates from 19,200 to 1,000,000.**
- Location: LeRobot `src/lerobot/motors/motors_bus.py` line 192; rustypot `sts3215.rs` lines 11-15
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/motors/motors_bus.py | Tier 1, code | code behaviour | "default_baudrate: int = 1_000_000"; rustypot: "baudrates: [ (1_000_000, 0), (500_000, 1), (250_000, 2), (128_000, 3), (115_200, 4), (57_600, 5), (38_400, 6), (19_200, 7), ], factory_baudrate: 1_000_000," (accessed 2026-11-20)
- Use in dive: section 3, the bus speed. [derived] at 1,000,000 baud with 10 bit-times per byte (8 data bits, start, stop) the wire carries at most 100,000 bytes per second, so one byte takes 10 microseconds.

**F01-13. In v0.7.0 LeRobot no longer talks to Feetech servos through its own Feetech bus class: `SerialMotorsBus` delegates the control table, resolution, baud rates and serial I/O to the Rust library rustypot, and `FeetechMotorsBus` is a deprecated alias kept for one release.**
- Location: `src/lerobot/motors/motors_bus.py` lines 156-161; `src/lerobot/motors/feetech/feetech.py` lines 16-20; `pyproject.toml` lines 176, 185-189
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/motors/motors_bus.py | Tier 1, code | code behaviour | "rustypot handles each model's metadata (control table, resolution, baud rates, operating modes) and the serial I/O; LeRobot handles normalisation, calibration and the recommended settings." and `feetech.py`: "Deprecated: `SerialMotorsBus` drives Feetech servos, from each motor's model. `FeetechMotorsBus` and the enums below stay for one release". `pyproject.toml`: `rustypot-dep = ["rustypot>=1.13.1,<2.0.0"]` (accessed 2026-11-20)
- Use in dive: section 3, a currency note for anyone who learned the stack before v0.7.0 (file paths and class names in older tutorials no longer match).

**F01-14. The servo's memory table is the arm's whole hardware interface. The registers LeRobot reads and writes include goal position, present position, present speed, present load, present voltage, present temperature and present current, plus the P, I and D coefficients of the servo's own position loop.**
- Location: rustypot `sts3215.rs` lines 30-92 (register table)
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/pollen-robotics/rustypot/7aa85e13143594ea4fd4ed9f29e3e29d39b5de85/src/servo/feetech/sts3215.rs | Tier 1, code | code behaviour | "reg: (p_coefficient, rw, 21, u8, None), reg: (d_coefficient, rw, 22, u8, None), reg: (i_coefficient, rw, 23, u8, None)," ... "reg: (goal_position, rw, 42, i16, AnglePosition)," ... "reg: (present_position, r, 56, i16, AnglePosition), reg: (present_speed, r, 58, u16, Velocity), ... reg: (present_load, r, 60, u16, None), reg: (present_voltage, r, 62, u8, None), reg: (present_temperature, r, 63, u8, None), ... reg: (present_current, r, 69, u16, None)," (accessed 2026-11-20)
- Use in dive: section 3, "the robot as a computer": a servo is a small networked device with a register map; proprioception is a read of those registers.

**F01-15. The STS3215 has four operating modes in its definition: position, velocity, pwm and step. It has no current (torque) mode; LeRobot's own mode list marks `current` as a Dynamixel mode.**
- Location: rustypot `sts3215.rs` line 17; LeRobot `motors_bus.py` `set_operating_mode` docstring, lines 600-617
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/pollen-robotics/rustypot/7aa85e13143594ea4fd4ed9f29e3e29d39b5de85/src/servo/feetech/sts3215.rs | Tier 1, code | code behaviour | "operating_modes: [(position, 0), (velocity, 1), (pwm, 2), (step, 3)]," and LeRobot: "- `position`: holds a goal position within one turn and the position limits. - `velocity`: turns endlessly at a goal velocity, as a wheel. - `pwm`: drives the motor voltage directly, open loop. - `step` (Feetech): moves by the number of steps written as the goal position. - `current` (Dynamixel): holds a goal current, that is a torque, whatever the position." (accessed 2026-11-20)
- Use in dive: section 3, position versus velocity versus torque control, stated from the arm's own servo: the SO-101 can be told where to go, and cannot be told how hard to push.

**F01-16. On connect, LeRobot puts every follower servo in position mode and writes the position loop gains P = 16, I = 0, D = 32 into the servo. The loop that turns "goal position" into motor voltage then runs inside the servo, and the host only sends goals.**
- Location: `so_follower.py` `configure()` lines 145-152; `config_so_follower.py` lines 44-47
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/robots/so_follower/so_follower.py | Tier 1, code | code behaviour | `self.bus.set_operating_mode("position", motor)` / `self.bus.write("P_Coefficient", motor, self.config.position_p_coefficient)` / `self.bus.write("I_Coefficient", motor, self.config.position_i_coefficient)` / `self.bus.write("D_Coefficient", motor, self.config.position_d_coefficient)`; config: "# Position-mode PID gains written to Feetech STS3215 motors at connect time. position_p_coefficient: int = 16 / position_i_coefficient: int = 0 / position_d_coefficient: int = 32" (accessed 2026-11-20). "The loop runs inside the servo" is [our reading]: the host writes gains to servo registers and afterwards writes only `Goal_Position` (F01-22).
- Use in dive: section 3, the inner position loop: where the PID lives and what its three numbers are on this arm.

**F01-17. The gripper servo is deliberately weakened in software: maximum torque limit 500 (50%), protection current 250 (50%), overload torque 25%, "to avoid burnout".**
- Location: `so_follower.py` lines 154-157
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/robots/so_follower/so_follower.py | Tier 1, code | code behaviour | `self.bus.write("Max_Torque_Limit", motor, 500)  # 50% of max torque to avoid burnout` / `self.bus.write("Protection_Current", motor, 250)  # 50% of max current to avoid burnout` / `self.bus.write("Overload_Torque", motor, 25)  # 25% torque when overloaded` (accessed 2026-11-20)
- Use in dive: section 3, why a position-controlled gripper needs a torque cap: it squeezes against a block it can never reach "through", so the servo would stall at full current.

**F01-18. Joint positions leave the bus normalised. With the v0.7.0 default `use_degrees = True` the five arm joints are in degrees measured from the middle of each joint's calibrated range; the gripper is always a 0 to 100 scale across its calibrated range. With `use_degrees = False` the arm joints are instead a -100 to 100 scale across each joint's calibrated range.**
- Location: `so_follower.py` line 68; `config_so_follower.py` lines 41-42; `motors_bus.py` `_normalize()` lines 1010-1036
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/motors/motors_bus.py | Tier 1, code | code behaviour | `norm_mode_body = MotorNormMode.DEGREES if config.use_degrees else MotorNormMode.RANGE_M100_100`; `use_degrees: bool = True`; in `_normalize`: `norm = (((bounded_val - min_) / (max_ - min_)) * 200) - 100` (RANGE_M100_100), `norm = ((bounded_val - min_) / (max_ - min_)) * 100` (RANGE_0_100), `mid = (min_ + max_) / 2` / `max_res = self.resolution(self._id_to_model(id_)) - 1` / `normalized_values[id_] = (val - mid) * 360 / max_res` (DEGREES) (accessed 2026-11-20)
- Use in dive: section 3, what the six numbers mean and in what units. Formula for the page: degrees = (raw - mid) x 360 / 4095, where raw is the encoder step count and mid is the midpoint of the calibrated range.

**F01-19. The comment above `use_degrees` in the follower config says to set it to True "for backward compatibility", while the default value is already True (the same at v0.6.1). A dataset recorded with the other setting holds arm joints on the -100 to 100 scale, so the same key name can carry two different units.**
- Location: `config_so_follower.py` lines 41-42 at v0.7.0 and at v0.6.1 (tag commit `7e241bd630a3719a56157a497ce5d08f244784f1`)
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/robots/so_follower/config_so_follower.py | Tier 1, code | code behaviour | "# Set to `True` for backward compatibility with previous policies/dataset / use_degrees: bool = True" (accessed 2026-11-20). The release in which the default changed was not traced (U1). The two-units consequence is [our reading] of F01-18.
- Use in dive: section 3, a practical warning: check which scale a downloaded SO-101 dataset or checkpoint uses before mixing it with your own recordings.

**F01-20. Calibration is done by hand: the user holds every joint at the middle of its range (which the software makes a half turn of each encoder), then sweeps each joint through its full range while the software records the minimum and maximum. The wrist roll is treated as a full-turn joint and is not swept. The docs give the purpose: the leader and follower must report the same values in the same pose, and a policy trained on one robot must work on another.**
- Location: `motors_bus.py` `record_calibration()` docstring, lines 938-951; `so_follower.py` line 140; `docs/source/so101.mdx`, "Calibrate"
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/motors/motors_bus.py | Tier 1, code and first-party docs | code behaviour | "The user then holds the joints in the middle of their range of motion, which becomes a half turn of each motor, and moves each joint through its whole range, recorded until ENTER. A full-turn motor is not recorded: it spans the whole encoder of its model."; `self.bus.record_calibration("position", full_turn_motors=["wrist_roll"])`; docs: "you'll need to calibrate your robot to ensure that the leader and follower arms have the same position values when they are in the same physical position. The calibration process is very important because it allows a neural network trained on one robot to work on another." (accessed 2026-11-20)
- Use in dive: section 3, why calibration exists: raw encoder steps depend on how each servo horn was screwed on; calibration maps them to a shared scale.

**F01-21. Setup is three commands before any learning: `lerobot-find-port` (which USB serial port is which arm), `lerobot-setup-motors` (write each servo's ID and baud rate into its non-volatile memory, one servo at a time), `lerobot-calibrate`.**
- Location: `docs/source/so101.mdx`, "Configure the motors" and "Calibrate"
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/so101.mdx | Tier 1, first-party docs | documentation of support | "Each motor is identified by a unique id on the bus. When brand new, motors usually come with a default id of `1`. ... Since we will write these parameters in the non-volatile section of the motors' internal memory (EEPROM), we'll only need to do this once." and the commands `lerobot-find-port`, `lerobot-setup-motors --robot.type=so101_follower --robot.port=...`, `lerobot-calibrate --robot.type=so101_follower --robot.port=... --robot.id=...` (accessed 2026-11-20)
- Use in dive: section 3, how a robot is configured: the bus is addressed like a small network (one ID per servo, one shared baud rate).

**F01-22. One control step on the follower is one bus read and one bus write: `get_observation()` does a sync read of `Present_Position` for all six servos and takes the latest frame from each camera; `send_action()` does a sync write of `Goal_Position` for all six.**
- Location: `so_follower.py` lines 163-185 and 202-213
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/robots/so_follower/so_follower.py | Tier 1, code | code behaviour | `obs_dict = self.bus.sync_read("Present_Position", num_retry=self.config.num_read_retries)` / `obs_dict = {f"{motor}.pos": val for motor, val in obs_dict.items()}` / `obs_dict[cam_key] = cam.read_latest()` and `self.bus.sync_write("Goal_Position", goal_pos)` (accessed 2026-11-20)
- Use in dive: section 3, the mechanism of one tick: read six positions, grab frames, write six goals.

**F01-23. The follower's observation is six floats named `<joint>.pos` plus one (height, width, 3) image per camera; its action is the same six `<joint>.pos` floats. The arm reports no velocity, load or current into the observation, although the servo has those registers.**
- Location: `so_follower.py` lines 83-104
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/robots/so_follower/so_follower.py | Tier 1, code | code behaviour | `return {f"{motor}.pos": float for motor in self.bus.motors}`; `features[cam_key] = (cam.height, cam.width, 3)`; `def observation_features(self) ...: return {**self._motors_ft, **self._cameras_ft}`; `def action_features(self) ...: return self._motors_ft` (accessed 2026-11-20). "No velocity, load or current" is [our reading] of `get_observation()` reading only `Present_Position` (F01-22) against the register list in F01-14.
- Use in dive: section 3, the SO-101's state and action are both 6-dimensional joint positions; the policy sees position and pixels and nothing about force.

**F01-24. The leader arm is read, not driven: `get_action()` is a sync read of `Present_Position` on the leader's six servos, returned under the same six `<joint>.pos` names the follower accepts. Teleoperation is therefore "copy six numbers from one bus to the other".**
- Location: `src/lerobot/teleoperators/so_leader/so_leader.py` lines 59-75 and 126-133
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/teleoperators/so_leader/so_leader.py | Tier 1, code | code behaviour | `action = self.bus.sync_read("Present_Position", num_retry=self.config.num_read_retries)` / `action = {f"{motor}.pos": val for motor, val in action.items()}`; `configure()`: `self.bus.disable_torque()` (accessed 2026-11-20). The one-line summary is [our reading].
- Use in dive: section 3, what teleoperation is mechanically, and why the recorded "action" is a joint-position target.

**F01-25. The bus read is not one simultaneous snapshot, and the code budgets for a slow USB adapter: status packets are awaited for 50 ms per attempt, "longer than the 16 ms latency timer of a USB adapter", and a failed read of the follower is retried twice by default.**
- Location: `motors_bus.py` lines 193-195 and `sync_read` docstring lines 1204-1206; `config_so_follower.py` lines 49-53
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/motors/motors_bus.py | Tier 1, code | code behaviour | "# Milliseconds a status packet is waited for, per attempt: longer than the 16 ms latency timer of a USB adapter. Each retry waits again. / default_timeout: int = 50"; "The values are therefore not one simultaneous snapshot."; config: "Feetech buses can occasionally return a corrupted status packet (\"Incorrect status packet!\"), especially when several joints move at once, which otherwise aborts the control loop. ... num_read_retries: int = 2" (accessed 2026-11-20)
- Use in dive: section 3, latency inside the cheapest part of the loop: a USB-serial adapter can hold data for milliseconds, which matters against a 33 ms tick.

### C. The LeRobot v0.7.0 control loop: rate, timing, what gets recorded

**F01-26. A recorded SO-101 frame has a 6-element float32 vector `observation.state`, a 6-element float32 vector `action`, and one `observation.images.<camera name>` entry per camera. The state and action vectors carry the six joint names as their element names.**
- Location: `src/lerobot/utils/feature_utils.py` `hw_to_dataset_features()` lines 69-96; `src/lerobot/utils/constants.py` lines 21-36; `docs/source/il_robots.mdx`, after the record example
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/utils/feature_utils.py | Tier 1, code | code behaviour | `if joint_fts and prefix == ACTION: features[prefix] = {"dtype": "float32", "shape": (len(joint_fts),), "names": list(joint_fts),}` and `if joint_fts and prefix == OBS_STR: features[f"{prefix}.state"] = {"dtype": "float32", "shape": (len(joint_fts),), "names": list(joint_fts),}`; `features[f"{prefix}.images.{key}"]`; docs: "The camera names you choose (here `wrist` and `top`) become the dataset keys `observation.images.wrist` and `observation.images.top`." (accessed 2026-11-20). [derived] six joints (F01-8) give shape (6,) for both; 6 x 4 bytes = 24 bytes each.
- Use in dive: section 3, the exact tensors a policy is trained on; the answer to "what do `observation.state` and `action` contain".

**F01-27. The recorded `action` is the leader arm's joint positions at that tick (the target sent to the follower), and `observation.state` is the follower's measured joint positions read just before. They are two different measurements of two different arms, in the same units.**
- Location: `src/lerobot/scripts/lerobot_record.py` `record_loop()` lines 312-373
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/scripts/lerobot_record.py | Tier 1, code | code behaviour | `obs = robot.get_observation()` ... `observation_frame = build_dataset_frame(dataset.features, obs_processed, prefix=OBS_STR)` ... `act = teleop.get_action()` ... `action_values = act_processed_teleop` ... `_sent_action = robot.send_action(robot_action_to_send)` ... `action_frame = build_dataset_frame(dataset.features, action_values, prefix=ACTION)` / `frame = {**observation_frame, **action_frame, "task": single_task}` / `dataset.add_frame(frame)` (accessed 2026-11-20). The in-code comment says the opposite intent for clipped actions ("so action actually sent is saved in the dataset") while the code stores `action_values`, the teleoperator's processed action; with the default `max_relative_target = None` the two are equal [our reading].
- Use in dive: section 3, why state and action differ even though both are "six joint angles": the action leads, the state lags, and the gap between them is what the servo loop is working to close.

**F01-28. The default recording rate is 30 frames per second; the default episode length is 60 s, the default reset time between episodes 60 s, and the default episode count 50.**
- Location: `src/lerobot/configs/dataset.py` `DatasetRecordConfig` lines 33-39; `docs/source/il_robots.mdx`, "Recording Parameters"
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/configs/dataset.py | Tier 1, code | code behaviour | "fps: int = 30", "episode_time_s: int | float = 60", "reset_time_s: int | float = 60", "num_episodes: int = 50" (accessed 2026-11-20). [derived] 1 / 30 = 33.3 ms per tick; 60 s x 30 = 1,800 frames per default-length episode.
- Use in dive: section 3, the control rate the dive uses for the arm: 30 Hz, 33.3 ms per tick.

**F01-29. Plain teleoperation (no recording) defaults to a faster loop than recording: 60 Hz against 30 Hz.**
- Location: `src/lerobot/scripts/lerobot_teleoperate.py` `TeleoperateConfig` lines 143-144
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/scripts/lerobot_teleoperate.py | Tier 1, code | code behaviour | "# Limit the maximum frames per second. / fps: int = 60" (accessed 2026-11-20). [derived] 1 / 60 = 16.7 ms per tick.
- Use in dive: section 3, the control rate is a software choice bounded by the slowest device in the loop (the camera, when recording).

**F01-30. Camera resolution and frame rate have no default in the code: the camera config fields `fps`, `width` and `height` default to `None` and the user passes them. The documentation's advice and every SO-101 example use 640x480 at 30 fps.**
- Location: `src/lerobot/cameras/configs.py` lines 61-63; `docs/source/cameras.mdx`, "Camera placement and lighting"; `docs/source/il_robots.mdx` teleoperate and record examples
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/cameras.mdx | Tier 1, code and first-party docs | documentation of support | code: "fps: int | None = None / width: int | None = None / height: int | None = None"; docs: "**Keep the resolution modest.** 640x480 at 30 fps is enough for most tasks and keeps recording and training fast."; tutorial command: `--robot.cameras="{ wrist: {type: opencv, index_or_path: 0, width: 640, height: 480, fps: 30}, top: {type: opencv, index_or_path: 1, width: 640, height: 480, fps: 30}}"` (accessed 2026-11-20)
- Use in dive: section 3, the camera figures for every worked example: two cameras (wrist and top), 640x480, 30 fps.

**F01-31. The SO-101 tutorial's camera setup is two RGB cameras: one named `wrist` (on the arm, moving with the gripper) and one named `top` (fixed, looking at the scene).**
- Location: `docs/source/il_robots.mdx`, "Teleoperate with cameras"
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/il_robots.mdx | Tier 1, first-party docs | documentation of support | "This example uses two cameras, `wrist` and `top`; we keep the same camera setup for the rest of the tutorial." (accessed 2026-11-20). What each camera looks at is [our reading] of the names and of the mounts in F01-7.
- Use in dive: section 3, wrist versus scene camera on the arm task.

**F01-32. LeRobot supports four camera classes in v0.7.0: OpenCV (phone, laptop, USB webcams), ZMQ (network cameras), Intel RealSense (with depth) and Reachy 2 cameras. Depth is available only through RealSense among these.**
- Location: `docs/source/cameras.mdx`, opening table
- Verdict: NEW
- Wave 2 (2026-11-20, WRONG (second sentence)): Depth is not RealSense-only. Corrected claim: LeRobot v0.7.0 has four camera classes; two of them, Intel RealSense and Reachy 2, also return depth, as a `(H, W, 1)` `uint16` map in millimetres. Quote from `docs/source/cameras.mdx` at v0.7.0, "Working with depth": "The Intel RealSense and Reachy 2 cameras can capture both color and depth in lockstep."
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/cameras.mdx | Tier 1, first-party docs | documentation of support | "| `OpenCVCamera` | Phone, built-in laptop, USB webcams | / | `ZMQCamera` | Network-connected cameras | / | `RealSenseCamera` | Intel RealSense (with depth) | / | `Reachy2Camera` | Reachy 2 robot cameras |" (accessed 2026-11-20)
- Use in dive: section 3, RGB versus depth: depth is an optional second image stream, stored as a one-channel image (`(cam.height, cam.width, 1)` in `so_follower.py`).

**F01-33. The control loop is a plain Python `while` loop with a fixed order: read the robot (joints and cameras), read the teleoperator, send the action, append the frame to the dataset, then sleep until the tick's deadline.**
- Location: `src/lerobot/scripts/lerobot_record.py` `record_loop()` lines 301-388, and the data-flow comment at lines 205-228
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/scripts/lerobot_record.py | Tier 1, code | code behaviour | `while timestamp < control_time_s:` ... `timer.tick()` / `with timer.section("observe"): obs = robot.get_observation()` / `with timer.section("teleop"): ... act = teleop.get_action()` / `with timer.section("send"): ... _sent_action = robot.send_action(robot_action_to_send)` / `with timer.section("record"): ... dataset.add_frame(frame)` / `timer.wait()` / `timestamp = time.perf_counter() - start_episode_t` (accessed 2026-11-20)
- Use in dive: section 3, the loop itself, quoted. It is an ordinary user-space loop on a general-purpose operating system, with no real-time guarantees.

**F01-34. Pacing is "sleep until an absolute deadline": the timer computes `deadline = cycle start + ticks done x tick interval`, with `tick_interval = 1.0 / (fps * multiplier)`, and sleeps for whatever time remains. A slow tick borrows time from the following ticks instead of shifting the schedule.**
- Location: `src/lerobot/utils/cycle_timer.py` lines 217, 379, 427-429 and class docstring
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/utils/cycle_timer.py | Tier 1, code | code behaviour | `self.tick_interval = 1.0 / (fps * multiplier)`; `deadline = self._cycle_start + self._ticks_done * self.tick_interval`; `if (sleep_t := deadline - now) > 0: ... precise_sleep(sleep_t)`; docstring: "the timer sleeps so each iteration takes `1/fps`, warns when the loop body alone cannot fit that budget" and "A slow tick therefore borrows budget from the ticks that follow it instead of pushing the whole cycle back." (accessed 2026-11-20)
- Use in dive: section 3, how a 30 Hz loop is actually held: do the work, then sleep the remainder of 33.3 ms.

**F01-35. The sleep itself depends on the operating system. On Linux the code calls `time.sleep`; on macOS and Windows it sleeps most of the interval and then busy-waits the last 10 ms, trading CPU for accuracy, with defaults "chosen to prioritize timing accuracy over CPU usage for the common 30 FPS use case".**
- Location: `src/lerobot/utils/robot_utils.py` `precise_sleep()` lines 19-59
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/utils/robot_utils.py | Tier 1, code | code behaviour | "def precise_sleep(seconds: float, spin_threshold: float = 0.010, sleep_margin: float = 0.005):"; "# On macOS and Windows the scheduler / sleep granularity can make short sleeps inaccurate. ... sleep for most of the time and spin for the final few milliseconds"; "# On Linux time.sleep is accurate enough for most uses / time.sleep(seconds)" (accessed 2026-11-20)
- Use in dive: section 3, compute cost of timing: on a Mac, one CPU core spins for up to 10 ms of every 33.3 ms tick just to hit the deadline.

**F01-36. When the loop body takes longer than its budget, LeRobot only warns; nothing enforces the rate. The warning names the usual causes: cameras, policy inference, CPU starvation.**
- Location: `cycle_timer.py` `wait()` lines 400-411
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/utils/cycle_timer.py | Tier 1, code | code behaviour | "Control loop is running slower ({1 / group_work:.1f} Hz) than the target FPS ({self.fps:g} Hz). {consequence} Common causes are: 1) Camera FPS not keeping up 2) Policy inference (action or text) taking too long 3) CPU starvation", where the consequence is "Dataset frames might be dropped and robot control might be unstable." when recording (accessed 2026-11-20)
- Use in dive: section 3, soft real time: a missed deadline is a log line, and the robot simply acts late.

**F01-37. A frame's timestamp in the dataset is derived from its index and the nominal fps. A session that actually ran at 25 Hz produces a dataset that claims 30 Hz, so the recorded motion plays back faster than it happened.**
- Location: `docs/source/il_robots.mdx`, "Cadence reporting"
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/il_robots.mdx | Tier 1, first-party docs | documentation of support | "This is worth reading before you train on the dataset. A frame's timestamp is derived from its index, so a session that ran at 25 Hz still produces a dataset that _claims_ 30 - the recorded motion is simply faster than reality." (accessed 2026-11-20)
- Use in dive: section 3, why timing is part of the data: a late loop silently changes the speed the policy learns.

**F01-38. In the documentation's sample cadence report for a 30 Hz recording, reading the robot ("observe": joints plus cameras) takes a mean of 13.65 ms and 74.4% of the loop's work; reading the leader takes 1.80 ms, sending the action 0.90 ms, writing the frame 1.70 ms; the loop sleeps 15.1 ms per tick on average.**
- Location: `docs/source/il_robots.mdx`, "Cadence reporting", sample output block
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/il_robots.mdx | Tier 1, first-party docs | documentation of support (an example printout in the docs: [illustration by the vendor], on unstated hardware, not a benchmark) | "observe mean 13.65 ms - worst 40.20 ms - 74.4% of work - 1200 calls", "teleop mean 1.80 ms", "send mean 0.90 ms", "record mean 1.70 ms", "pacing headroom: 15.1 ms slept per tick on average (max 16.7 ms) - near zero means the loop is saturated", "work mean 18.4 ms, worst 45.1 ms" (separator dots normalised; accessed 2026-11-20). [derived] 13.65 + 0.30 + 1.80 + 0.90 + 1.70 = 18.35 ms of work, leaving 33.3 - 18.4 = 14.9 ms.
- Use in dive: section 3, a time budget for one tick. Use only as the docs' example; hardware is not stated (U2).

**F01-39. During policy rollout the loop can command the motors faster than the policy runs: with `--interpolation_multiplier N` robot commands go out at fps x N Hz while policy inference and recording advance at fps Hz. Defaults are fps 30 and multiplier 1.**
- Location: `cycle_timer.py` class docstring; `docs/source/inference.mdx`, options table
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/utils/cycle_timer.py | Tier 1, code and first-party docs | code behaviour | "With `interpolation_multiplier == N` the control loop runs `N` ticks per policy cycle: robot commands go out every tick at `fps x N` Hz, while policy inference and dataset recording advance once per cycle at `fps` Hz."; docs table: "| `--fps` | Policy inference and dataset recording frequency | 30 |" and "| `--interpolation_multiplier` | Robot commands per policy action (control at `fps x N` Hz) | 1 |" (multiplication sign normalised to "x"; accessed 2026-11-20)
- Use in dive: section 3, the first rung of the rate ladder shown in the arm's own software: command rate and policy rate are two different numbers.

**F01-40. LeRobot v0.7.0 has three inference backends for rollout. Sync (the default) runs one policy call per control tick and blocks the loop until the action is computed. RTC (real-time chunking) computes action chunks in a background thread on the same machine. Remote sends observations to a policy server on another machine and does not load weights on the robot computer.**
- Location: `docs/source/inference.mdx`, "Inference Backends"
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/inference.mdx | Tier 1, first-party docs | documentation of support | "### Sync (default) / One policy call per control tick. The main loop blocks until the action is computed."; "### Real-Time Chunking (`--inference.type=rtc`) / A background thread produces action chunks asynchronously. The main control loop polls for the next ready action while the policy computes the next chunk in parallel."; "The remote backend obtains its policy contract from a server and does not load weights on the robot computer." (accessed 2026-11-20)
- Use in dive: section 3, the pointer to action chunking: a slow model can drive a fast loop only if the loop has a buffer of future actions to play. Stream 02 owns the mechanism.

**F01-41. The remote-inference docs describe the hardware split directly: a laptop or single-board computer wired to the arm keeps the cameras and motors; a GPU machine elsewhere runs the policy; the robot keeps moving from a buffer of upcoming actions while the server computes the next chunk.**
- Location: `docs/source/remote_inference.mdx`, opening and "How it works"
- Verdict: CARRIED (seed 04 section 2.2 cited the older "async inference" page with `RobotClient` and `PolicyServer`; re-fetched at v0.7.0, where the page is now `remote_inference` and the wording changed)
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/remote_inference.mdx | Tier 1, first-party docs | documentation of support | "Large policies need a GPU, and with a synchronous rollout the robot stops moving every time the policy computes its next chunk of actions. Remote inference splits the job in two: a **policy server** runs the checkpoint on a GPU, and the **robot computer** keeps control of cameras, motors, teleoperation and recording." and "the computer wired to the robot has no GPU, or one too small for the policy: a laptop or single-board computer next to the arm and a GPU workstation across the lab" and "The robot computer keeps a buffer of upcoming actions. When the buffer runs low it sends a fresh observation, keeps moving from the buffer while the server computes, and splices the new chunk into the part of the plan that has not been executed yet." (accessed 2026-11-20)
- Use in dive: section 3, item "what compute sits on or next to the arm", and the pointer to chunking.

### D. The servo: datasheet figures, the inner loop, and what a hobby servo cannot do

Datasheet used here: Shenzhen Feetech RC Model Co., "Product Specification", model STS3215, edition A/0, dated 2020-04-10, 8 pages. The copy read is a machine translation hosted by a reseller: https://core-electronics.com.au/attachments/uploads/sts3215-smart-servo-datasheet-translated.pdf . A second Feetech document (3 pages, "Feetech 2020 new product STS3215 Magnetic Encoder 360 Serial bus Servo Evaluation") was read from another reseller copy: https://www.mantech.co.za/datasheets/products/sts3215-200620a-1.pdf . Both predate 2025; they are the datasheet of a part still in the current bill of materials, so they are carried as the part's specification. No copy on Feetech's own site was fetched (U3).

**F01-42. Datasheet figures for the 7.4 V STS3215 (the 1/345 follower servo): no-load speed 0.238 s per 60 degrees (42 RPM) at 6 V and 0.192 s per 60 degrees (52 RPM) at 7.4 V; stall torque 16.5 kg.cm at 6 V and 19.5 kg.cm at 7.4 V; stall current 2 A at 6 V and 2.5 A at 7.4 V; rated torque 4 kg.cm at 6 V and 5 kg.cm at 7.4 V; input voltage 4 V to 7.4 V.**
- Location: Feetech Product Specification STS3215, edition A/0, section 5 "Electrical Specification", items 5-1 to 5-9 (page 3 of 8)
- Verdict: NEW
- Evidence: https://core-electronics.com.au/attachments/uploads/sts3215-smart-servo-datasheet-translated.pdf | Tier 1, manufacturer datasheet (reseller-hosted machine translation) | benchmark claim (vendor reported) [vendor claim] | "5-2 No Load Speed 0.238sec/60 deg (42RPM) 0.192sec/60 deg (52RPM)", "5-4 Stall Torque (at locked) 16.5kg.cm 19.5kg.cm", "Stall Current (at locked) 2a 2.5A", "5-7 Working Voltage Input Voltage 4V-7.4V", "5-8 Rated Torgue 4kg.cm 5kg.cm", "5-9 Rated Current 500mA 650mA" (columns are 6 V and 7.4 V; degree sign written out; accessed 2026-11-20). Agrees with the SO-ARM100 README's "16.5kg.cm at 6V" (F01-5).
- Use in dive: section 3, how strong and how fast one joint is. [derived] 42 RPM = 252 degrees per second = 4.40 rad/s; 52 RPM = 312 degrees per second = 5.45 rad/s. Rated (continuous) torque is about a quarter of stall torque: 4 / 16.5 = 0.24.

**F01-43. The datasheet states the gear ratio, the sensor and the play in the gears: gear ratio 1/345, copper gears, a 12-bit magnetic angle sensor covering 360 degrees, resolution 0.088 degrees (360/4096), backlash at most 0.5 degrees, weight 55 g.**
- Location: same datasheet, section 6 "Mechanical Specification" items 6-5 to 6-11 and section 7-1 items 7-6 to 7-8 (pages 4 and 5 of 8)
- Verdict: NEW
- Evidence: https://core-electronics.com.au/attachments/uploads/sts3215-smart-servo-datasheet-translated.pdf | Tier 1, manufacturer datasheet (reseller-hosted machine translation) | definition | "12Bits Magnetic Coding", "Angle 360 deg", "7-8 Electronic resolution Resolution [deg/pulse] 0.088 deg (360 deg /4096)", "7-6 Median Neutral Position 180 deg (2048)", "1/345" and "0.5 deg" in the gear ratio and backlash rows (the translation scrambles row labels in section 6; the values are read against the row order 6-8 weight "55+-1g", 6-10 gear ratio, 6-11 backlash) (accessed 2026-11-20). The SO-ARM100 simulation file models the same play: "<!-- +/- 0.5 deg of backlash -->" in `Simulation/SO101/joints_properties.xml` at `141aea7`.
- Use in dive: section 3. [derived] the sensor resolves 0.088 degrees but the gears allow up to 0.5 degrees of free play: 0.5 / 0.088 = 5.7 encoder steps of uncertainty the encoder cannot see, because it measures the output shaft position only through the gear train's slack [our reading; where on the gear train the magnet sits is not stated in the datasheet, U4].

**F01-44. The servo's control algorithm is PID, running in the servo, with parameters the user can change; the bus is half-duplex asynchronous serial at TTL level, 8 data bits, 1 stop bit, no parity, IDs 0 to 253, 38,400 bps to 1 Mbps with a 1 Mbps factory default.**
- Location: same datasheet, section 7-1 items 7-1 to 7-5 (page 4 of 8); evaluation document items 6 and 9
- Verdict: NEW
- Evidence: https://core-electronics.com.au/attachments/uploads/sts3215-smart-servo-datasheet-translated.pdf | Tier 1, manufacturer datasheet (reseller-hosted machine translation) | definition | "7-1 Command Signal Digital Packet", "7-2 Protocol Type Half Duplex Asynchronous Serial Communication 8bit, 1stop, No Parity", "7-3 ID range 0-253", "7-4 Communication Baud Rate 38400bps ~ 1 Mbps Customizable (factory default 1Mbps)", "7-5 Control Algorithm PID Customizable (support modification)"; evaluation document: "TTL communication level, half duplex asynchronous communication ... add synchronous read function (send an instruction to receive the read back instruction from each servo on the bus in turn.)" and "9. Open PID parameters." (accessed 2026-11-20). Note: rustypot's table lists 19,200 as the lowest rate (F01-12) where the datasheet says 38,400.
- Use in dive: section 3, the servo as a device on a shared wire: one data line, everyone takes turns, each servo answers by ID. This is the PID that F01-16 writes gains into.

**F01-45. The servo's inner loop rate is not published: neither Feetech document read here states how often the position PID runs.**
- Location: both Feetech documents, searched in full
- Verdict: UNKNOWN
- Evidence: https://core-electronics.com.au/attachments/uploads/sts3215-smart-servo-datasheet-translated.pdf | Tier 1, manufacturer datasheet | documentation of support (absence) | The datasheet's control section lists "Control Algorithm PID" with no period or frequency; no "Hz" or loop-time figure appears in either document (accessed 2026-11-20).
- Use in dive: section 3, the bottom rung of the rate ladder. For the SO-101 the page must say "inside the servo, at a rate Feetech does not publish" and take the kHz figure for the bottom rung from a system that does publish one (F01-72, F01-73). See U5.

**F01-46. The servo reports six quantities: load, position, speed, input voltage, current and temperature. "Load" is the motor drive's voltage duty cycle (1000 = 100%), and current is reported in units of 6.5 mA. Neither is a torque measurement.**
- Location: datasheet item 7-10; evaluation document item 8 "Multiple feedback"
- Verdict: NEW
- Evidence: https://www.mantech.co.za/datasheets/products/sts3215-200620a-1.pdf | Tier 1, manufacturer document (reseller-hosted copy) | definition | "Load feedback: the current control output drives the voltage duty cycle of the motor, and the full scale is 1000 = 100% torque output." / "Current feedback: The servo working current, 1 = 6.5mA" / "Voltage feedback: The servo working voltage,70=7V, 0.1V" / "Speed feedback: feedback the speed of current motor rotation, and the number of steps in unit time (per second) 50steps/second=0.732RPM 1 step=0.088 deg" (accessed 2026-11-20). "Neither is a torque measurement" is [our reading]: duty cycle and motor current are inputs to the gear train, and friction in a 1/345 gearbox sits between them and the output torque.
- Use in dive: section 3, proprioception beyond position: motor current as a crude stand-in for force, and why it is crude on a highly geared servo.

**F01-47. The servo protects itself in firmware: it cuts torque after being blocked for 2 s above 80% of stall, after drawing more than 2 A for 2 s, outside 4 V to 7.4 V, or above 70 degrees C.**
- Location: datasheet section 7-2 item 7-11 "Electronic Protection" (page 5 of 8)
- Verdict: NEW
- Evidence: https://core-electronics.com.au/attachments/uploads/sts3215-smart-servo-datasheet-translated.pdf | Tier 1, manufacturer datasheet (machine translation) | definition | "It enters the protection after being blocked at more than 80% of the locked rotor and lasts for 2s." / "The running current is greater than 2A and lasts for 2s After that, turn off the output and enter the over-current protection" / "greater than 7.4V or less than 4V to enter the protection" / "Turn off the torque output when the temperature is higher than 70 deg C" (accessed 2026-11-20)
- Use in dive: section 3, the safety layer at the bottom of the stack is in the servo firmware and is unaware of the policy above it. Pairs with F01-17 (LeRobot lowering the gripper's limits).

**F01-48. The SO-ARM100 repository's own MuJoCo model of the STS3215 gives simulation-side figures: a position actuator with proportional gain kp = 17.8 and force range plus or minus 3.35 N.m in `joints_properties.xml`, joint damping 0.60, friction loss 0.052, armature 0.028. The file says the motor properties are adapted from the Open Duck Mini project.**
- Location: `Simulation/SO101/joints_properties.xml`; `Simulation/SO101/README.md`, "Motor Parameters"; SO-ARM100 at `141aea7`
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/TheRobotStudio/SO-ARM100/141aea7bcac2744d92998e30268c413202a56f96/Simulation/SO101/joints_properties.xml | Tier 1, code (simulation model, not a measurement of the hardware) | code behaviour | `<default class="sts3215"> ... <joint damping="0.60" frictionloss="0.052" armature="0.028"/> <position kp="17.8" kv="0.0" forcerange="-3.35 3.35"/>`; README: "Motor properties for the STS3215 motors used in the robot are adapted from the Open Duck Mini project." (accessed 2026-11-20). Contradiction inside the repo: `so101_new_calib.xml` carries a second default, `<position kp="998.22" kv="2.731" forcerange="-2.94 2.94"/>` (see section 8).
- Use in dive: section 3 only as a pointer for the simulation stream: the simulated servo is a position actuator with a torque ceiling, which is the same abstraction as the real one. [derived] 2.94 N.m = 30 kg.cm x 0.0980665, the 12 V stall torque of F01-5.

**F01-49. The follower's joint ranges in the SO-ARM100 URDF: shoulder pan plus or minus 1.91986 rad (110 degrees), shoulder lift plus or minus 1.74533 rad (100 degrees), elbow flex plus or minus 1.69 rad (96.8 degrees), wrist flex plus or minus 1.65806 rad (95 degrees), wrist roll -2.74385 to 2.84121 rad (-157.2 to 162.8 degrees), gripper -0.174533 to 1.74533 rad (-10 to 100 degrees).**
- Location: `Simulation/SO101/so101_new_calib.urdf`, `<limit>` elements of the six revolute joints, lines 338-439
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/TheRobotStudio/SO-ARM100/141aea7bcac2744d92998e30268c413202a56f96/Simulation/SO101/so101_new_calib.urdf | Tier 1, code (robot description generated from CAD) | definition | `<joint name="shoulder_pan" type="revolute"> ... <limit effort="10" velocity="10" lower="-1.91986" upper="1.91986"/>`, `shoulder_lift ... lower="-1.74533" upper="1.74533"`, `elbow_flex ... lower="-1.69" upper="1.69"`, `wrist_flex ... lower="-1.65806" upper="1.65806"`, `wrist_roll ... lower="-2.74385" upper="2.84121"`, `gripper ... lower="-0.174533" upper="1.74533"` (accessed 2026-11-20). [derived] degrees = rad x 180 / pi. The `effort="10" velocity="10"` values are identical placeholders on every joint and are not servo limits [our reading].
- Use in dive: section 3, the shape of the action space: six numbers, each bounded.

**F01-50. Link lengths from the same URDF: shoulder-lift axis to elbow axis about 0.116 m, elbow axis to wrist-flex axis about 0.135 m, wrist-flex axis to wrist-roll frame about 0.064 m, wrist-roll frame to the gripper reference frame about 0.098 m.**
- Location: `so101_new_calib.urdf`, `<origin xyz=...>` of joints `elbow_flex` (line 395), `wrist_flex` (line 374), `wrist_roll` (line 354), `gripper_frame_joint` (line 303)
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/TheRobotStudio/SO-ARM100/141aea7bcac2744d92998e30268c413202a56f96/Simulation/SO101/so101_new_calib.urdf | Tier 1, code (robot description generated from CAD) | definition | `elbow_flex` origin `xyz="-0.11257 -0.028 1.73763e-16"`; `wrist_flex` origin `xyz="-0.1349 0.0052 3.62355e-17"`; `wrist_roll` origin `xyz="5.55112e-17 -0.0611 0.0181"`; `gripper_frame_joint` origin `xyz="-0.0079 -0.000218121 -0.0981274"` (metres; accessed 2026-11-20). [derived] Euclidean norms: sqrt(0.11257^2 + 0.028^2) = 0.1160; sqrt(0.1349^2 + 0.0052^2) = 0.1350; sqrt(0.0611^2 + 0.0181^2) = 0.0637; sqrt(0.0079^2 + 0.0002^2 + 0.0981^2) = 0.0984. Sum 0.413 m: an upper bound on shoulder-to-gripper-frame distance (the offsets are not all collinear when the arm is straight).
- Use in dive: section 3, the lever arm for "how fast does the gripper move": roughly 0.4 m from the shoulder at full stretch.

**F01-51. Position, velocity and torque control differ in what the commanded number means. LeRobot's mode list states each in one line; "current" mode is the torque mode, and "current-based position" mode is position control with a force ceiling, given as the mode for "a gripper that must not crush what it holds". The STS3215 offers neither (F01-15).**
- Location: LeRobot `motors_bus.py` `set_operating_mode` docstring, lines 606-616, tag v0.7.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/motors/motors_bus.py | Tier 1, code | definition | "- `position`: holds a goal position within one turn and the position limits. - `velocity`: turns endlessly at a goal velocity, as a wheel. - `pwm`: drives the motor voltage directly, open loop. ... - `current` (Dynamixel): holds a goal current, that is a torque, whatever the position. ... - `current_based_position` (Dynamixel): holds a goal position over several turns with the current capped by the goal current, as a gripper that must not crush what it holds." (accessed 2026-11-20)
- Use in dive: section 3, the three control modes in plain words, from the arm's own software.

### E. Degrees of freedom and action spaces

**F01-52. The SO-100/SO-101 design is a 5-degree-of-freedom arm plus a gripper: five rotary joints place and orient the gripper, and the sixth servo opens and closes it. The hardware repo's own CAD names say "5DOF".**
- Location: SO-ARM100 `CHANGELOG.md` entries v0.1.6 to v0.1.11; LeRobot joint list (F01-8)
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/TheRobotStudio/SO-ARM100/141aea7bcac2744d92998e30268c413202a56f96/CHANGELOG.md | Tier 1, first-party docs | definition | "Replaced CAD for Solidworks as zip: Version SO_5DOF_ARM100_08k" and "Added URDF for SO_5DOF_ARM100_8j" (accessed 2026-11-20; these changelog entries date from 2024 and name the SO-100, whose joint layout the SO-101 keeps per F01-9). 
- Use in dive: section 3, degrees of freedom. [our reading, general kinematics, no source fetched] a free rigid body has six degrees of freedom (three of position, three of orientation), so a 5-joint arm cannot reach every position with every orientation; for a block-into-cup task approached from above this does not bind.

**F01-53. A joint-space action is one target position per motor; an end-effector action is the gripper's position and orientation in Cartesian coordinates. Joint space is LeRobot's default and needs no model of the robot; end-effector space needs a kinematic model (a URDF file).**
- Location: LeRobot `docs/source/action_representations.mdx`, "Joint Space vs End-Effector Space", tag v0.7.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/action_representations.mdx | Tier 1, first-party docs | definition | "Joint-space actions directly specify target positions for each motor." / "Joint space is the default in LeRobot. It is simple, requires no kinematics model, and maps directly to motor commands. Most beginner setups (SO-100, Koch) use joint-space actions." / "End-effector-space actions specify the desired position and orientation of the robot's tool tip (gripper) in Cartesian coordinates" / "EE space is more intuitive for tasks like pick-and-place because it directly describes where the gripper should go, but it requires a kinematics model (URDF) to convert between EE poses and joint angles." (accessed 2026-11-20)
- Use in dive: section 3, joint space versus Cartesian space, with the SO-101 placed in joint space.

**F01-54. Forward kinematics answers "given the joint angles, where is the gripper"; inverse kinematics answers "given where the gripper should be, which joint angles". LeRobot implements both as processor steps on top of a solver (placo) that loads the SO-101 URDF and tracks the frame `gripper_frame_link`.**
- Location: `action_representations.mdx`, "Converting Between Spaces"; `src/lerobot/model/kinematics.py` class `RobotKinematics`
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/action_representations.mdx | Tier 1, first-party docs and code | definition | "# Joints -> EE (for observations: \"where is my gripper?\") / fk_step = ForwardKinematicsJointsToEE(...)" and "# EE -> Joints (for actions: \"move my gripper here\") / ik_step = InverseKinematicsEEToJoints(...)"; `kinematics = RobotKinematics(urdf_path="./SO101/so101_new_calib.urdf", target_frame_name="gripper_frame_link", ...)`; code: "Robot kinematics using placo library for forward and inverse kinematics." (arrows normalised; accessed 2026-11-20)
- Use in dive: section 3, the one plain paragraph on forward and inverse kinematics. Forward is a chain of fixed rotations and offsets (the URDF origins in F01-50) and always has one answer; inverse is solved numerically and can have several answers or none.

**F01-55. An action value can be absolute (the target itself), relative (an offset from the robot's state at the moment the chunk was predicted, the same reference for every action in the chunk) or delta (an offset from the previous action). Absolute is LeRobot's default. Deltas accumulate error; relative actions do not.**
- Location: `action_representations.mdx`, "Absolute, Relative, and Delta Actions"
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/action_representations.mdx | Tier 1, first-party docs | definition | "### Absolute Actions (LeRobot default) / Each action specifies the target position directly." / "### Relative Actions (used by OpenPI / pi0) / Each action in the chunk is an offset from the **current state at the moment of prediction**. All actions in the chunk share the same reference point" / "The conversion is straightforward: `relative = absolute - current_state`." / "### Delta Actions (sequential differences) / Each action is an offset from the **previous action** ... To recover absolute positions you must sum all previous deltas, which means errors accumulate over time. UMI explicitly argues against this representation for this reason." (accessed 2026-11-20)
- Use in dive: section 3, absolute versus delta actions, with the three-way vocabulary the docs use (the dive must not use "delta" for both).

**F01-56. For the pi-family policies in LeRobot v0.7.0, relative actions are opt-in (`use_relative_actions: bool = False`), and when enabled the gripper stays absolute by default (`relative_exclude_joints` defaults to `["gripper"]`).**
- Location: `src/lerobot/policies/pi05/configuration_pi05.py` lines 69-72
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/policies/pi05/configuration_pi05.py | Tier 1, code | code behaviour | "# Relative actions: converts absolute actions to relative (relative to state). / use_relative_actions: bool = False / # Joint names to exclude from relative (kept absolute). Empty list = all dims relative. / relative_exclude_joints: list[str] = field(default_factory=lambda: [\"gripper\"])" (accessed 2026-11-20)
- Use in dive: section 3, a practical default: an SO-101 pi0.5 fine-tune in LeRobot predicts absolute joint targets unless told otherwise.

**F01-57. Policies in LeRobot v0.7.0 output a chunk of future actions, and the default chunk length differs per policy: ACT 100 actions, SmolVLA 50, pi0.5 50 (with 10 flow-matching inference steps), GR00T 40, Diffusion Policy a 64-step horizon of which 32 are executed.**
- Location: `configuration_act.py` lines 85-86; `configuration_smolvla.py` lines 29-30 and 63; `configuration_pi05.py` lines 38-39 and 61; `configuration_groot.py` lines 251-252; `configuration_diffusion.py` lines 105-106 (all under `src/lerobot/policies/`)
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/policies/pi05/configuration_pi05.py | Tier 1, code | code behaviour | ACT: "chunk_size: int = 100 / n_action_steps: int = 100"; SmolVLA: "chunk_size: int = 50 / n_action_steps: int = 50" and "num_steps: int = 10"; pi0.5: "chunk_size: int = 50  # Number of action steps to predict, in openpi called \"action_horizon\" / n_action_steps: int = 50  # Number of action steps to execute" and "num_inference_steps: int = 10"; GR00T: "chunk_size: int = 40 / n_action_steps: int = 40"; Diffusion: "horizon: int = 64 / n_action_steps: int = 32" (accessed 2026-11-20)
- Use in dive: section 3, pointer to stream 02. [derived] at the 30 Hz default, 50 actions cover 50 / 30 = 1.67 s of motion and 100 actions cover 3.33 s.

**F01-58. VLA policies pad every robot to one fixed vector size. SmolVLA and pi0.5 in LeRobot use a maximum state and action dimension of 32; GR00T uses 132. The SO-101's six numbers occupy the first six slots.**
- Location: `configuration_smolvla.py` lines 41-42; `configuration_pi05.py` lines 57-58 and 173-180; `configuration_groot.py` lines 256-259
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/policies/pi05/configuration_pi05.py | Tier 1, code | code behaviour | "max_state_dim: int = 32 / max_action_dim: int = 32"; "shape=(self.max_state_dim,),  # Padded to max_state_dim"; GR00T: "max_state_dim: int = 132" / "max_action_dim: int = 132" (accessed 2026-11-20). "First six slots" is [our reading] of padding; the padding position was not traced in the processor code (U6).
- Use in dive: section 3, one model, many bodies: the action space is a fixed-width vector and each robot fills part of it.

**F01-59. Physical Intelligence's pi0.5 and pi0.7 are trained to output both joint targets and end-effector poses, with a text tag in the prompt selecting the mode; pi0.7's reported experiments use joint-space control, and the authors found no noticeable gain from end-effector control with their earlier models.**
- Location: arXiv 2504.16054v1 (pi0.5), training details; arXiv 2604.15483v2 (pi0.7), section V-D "Control mode" and the experiments section
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2504.16054v1 and https://arxiv.org/abs/2604.15483v2 | Tier 3, preprints (first-party lab) | definition; ablation [author reported] | pi0.5: "For all action data, we train the model to predict target joint and end-effector poses. To differentiate the two, we add ' control_mode joint/end effector control_mode ' to the text prompt." pi0.7: "we include both joint-level and end-effector actions during training and use a text identifier to designate the control mode in the prompt. Then at runtime, we can pick the control mode depending on the task." and "Experimental results below apply joint-space control, as we find that end-effector control does not yield noticeable gains in performance with our prior models" (accessed 2026-11-20)
- Use in dive: section 3, what action representation current policies use: joint targets remain the working default in the pi line as of April 2026.

**F01-60. NVIDIA's GR00T N1.7 (released April 2026) moved to a relative end-effector action space shared across robots and human video: actions are offsets from the current pose, and NVIDIA credits this for cross-embodiment transfer.**
- Location: NVIDIA/Isaac-GR00T `README.md` at `708617f5716c63fc0a327391492ea2b91977ae90` (default-branch head, 2026-11-17), "What's new" list
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/NVIDIA/Isaac-GR00T/708617f5716c63fc0a327391492ea2b91977ae90/README.md | Tier 1, first-party repo docs | documentation of support; the benefit is a [vendor claim] | "**Relative EEF Action Space** - N1.7 adopts a relative end-effector action space shared across robot and human embodiments. Representing actions as deltas from the current pose (rather than absolute targets) improves generalization and is a key factor in the model's cross-embodiment performance." (accessed 2026-11-20). Note NVIDIA's "deltas from the current pose" is what LeRobot's docs call "relative" (F01-55).
- Use in dive: section 3, the counter-example to F01-59: two leading model lines disagree on the action space, and the vocabulary disagrees too.

### F. Sensors: what the arm has, what bigger robots add

**F01-61. In the policy papers the observation is the same recipe as on the SO-101: a few RGB images plus the joint positions. pi0: 2 or 3 images per robot plus a vector of joint angles. pi0.5's robots carry wrist-mounted monocular RGB cameras. pi0.7's robots have a front-facing camera plus a wrist camera on each arm.**
- Location: arXiv 2410.24164v4 (pi0), model section; arXiv 2504.16054v1 (pi0.5), robot system section; arXiv 2604.15483v2 (pi0.7), robot platforms
- Verdict: NEW
- Evidence: https://arxiv.org/abs/2410.24164v4 , https://arxiv.org/abs/2504.16054v1 , https://arxiv.org/abs/2604.15483v2 | Tier 3, preprints (first-party lab); 2410.24164 is from 2024 and is cited as the paper that introduced the pi0 design | definition | pi0: "The observation consists of multiple RGB images, a language command, and the robot's proprioceptive state ... (with 2 or 3 images per robot) ... a vector of joint angle[s]"; pi0.5: "two 6 DoF arms with parallel jaw grippers and wrist-mounted monocular RGB cameras, a wheeled holonomic base, and a torso lift mechanism"; pi0.5 also: "proprioceptive state, which captures the position of the robot's joints"; pi0.7: "Each robot has a front-facing camera as well as wrist camera on each arm, and the mobile robots also have a rear-facing camera." (accessed 2026-11-20)
- Use in dive: section 3, the SO-101's sensor set (wrist camera, scene camera, joint positions) is the same kind of input frontier manipulation models use, at smaller scale. It defines "proprioception" from a primary source.

**F01-62. Depth is a second image stream, not a different kind of sensor to the software: LeRobot stores a depth camera as a single-channel (H, W, 1) image next to the 3-channel RGB image and flags it as a depth map.**
- Location: `src/lerobot/utils/feature_utils.py` `hw_to_dataset_features()` docstring; `so_follower.py` lines 91-95
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/utils/feature_utils.py | Tier 1, code | code behaviour | "Single-channel cameras (shape `(H, W, 1)`) are flagged as depth maps via `info[\"is_depth_map\"] = True`; three-channel cameras `(H, W, 3)` are treated as RGB." and `features[f"{cam_key}_depth"] = (cam.height, cam.width, 1)` (accessed 2026-11-20)
- Use in dive: section 3, RGB versus depth in one sentence. None of the SO-101 tutorial commands use depth (F01-30).

**F01-63. Touch and force are add-ons on this arm. The hardware repo lists a tactile skin (AnySkin) as optional hardware; at the other end of the scale Figure states that Helix 02 feeds "vision, touch, and proprioception" into one network.**
- Location: SO-ARM100 `README.md`, "Optional Hardware" item 4; figure.ai Helix 02 post (27 January 2026)
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/TheRobotStudio/SO-ARM100/141aea7bcac2744d92998e30268c413202a56f96/README.md and https://www.figure.ai/news/helix-02 | Tier 1 first-party docs; Tier 2 first-party vendor blog | documentation of support | README: "#### 4. Tactile Sensing (AnySkin) / Add touch sensing to your gripper."; Figure: "Helix 02 connects every onboard sensor - vision, touch, and proprioception - directly to every actuator through a single unified visuomotor neural network" [vendor claim] (accessed 2026-11-20)
- Use in dive: section 3, force and touch sensing: absent on the stock SO-101, present on current humanoids. A wrist force-torque sensor was not sourced in this pass (U7).

**F01-64. What a humanoid adds to proprioception: balance. NVIDIA's SONIC whole-body controller for the 29-joint Unitree G1 takes joint positions, joint velocities, the angular velocity of the robot's body and the direction of gravity in the body frame, plus its own previous action, with a 10-step history.**
- Location: arXiv 2511.07820v4 (SONIC), "States" paragraph and section 3.5 "Deployment"
- Verdict: CARRIED (seed 04 section 2.1 cited SONIC at an unversioned URL for rates; re-fetched at v4, and this entry adds the state definition)
- Evidence: https://arxiv.org/abs/2511.07820v4 | Tier 3, preprint (first-party lab, NVIDIA) | definition | "Proprioceptive information includes joint pose, joint velocity, root angular velocity, gravity vector in the root frame, and previous action. We concatenated a 10-step history of all proprioceptive quantities and actions" and "Experiments were conducted on a Unitree G1 platform (29 actuated joints)." (accessed 2026-11-20). That angular velocity and the gravity direction come from an inertial measurement unit (IMU: gyroscope plus accelerometer) is [our reading]; the paper's quoted sentence does not name the sensor.
- Use in dive: section 3, the one line on what humanoids add: a fixed arm cannot fall over, so it needs no sense of which way is down.

**F01-65. Motors built for torque control report torque as a first-class reading. LeRobot's Damiao bus (used by the OpenArm) returns position, velocity and torque per joint in one read, where the SO-101 loop reads position only.**
- Location: LeRobot `docs/source/damiao.mdx`, usage example, tag v0.7.0
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/damiao.mdx | Tier 1, first-party docs | documentation of support | "# Read all states at once (position, velocity, torque) ... # Returns: {'joint_1': {'position': 45.2, 'velocity': 1.3, 'torque': 0.5}, ...}" (accessed 2026-11-20)
- Use in dive: section 3, proprioception is a spectrum: position only (SO-101), position plus velocity plus torque (quasi-direct-drive arms).

### G. Actuators: hobby servo versus quasi-direct drive

**F01-66. The gear ratio is the main difference. The SO-101 follower servo reduces 345:1. The OpenArm, a research arm LeRobot also supports, uses motors with 10:1 and 9:1 reductions on most joints; its docs call the arm's motors "QDD" (quasi-direct drive) and "backdrivable" and note that its one 40:1 motor family "is not a QDD motor".**
- Location: OpenArm docs, "Motor" page, version 2.0, last updated 2026-11-16; LeRobot `docs/source/openarm.mdx`; Feetech datasheet item 6-10 (F01-43)
- Verdict: NEW
- Evidence: https://docs.openarm.dev/hardware/openarm-2.0/motor and https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/openarm.mdx | Tier 1, first-party docs (the OpenArm page was read through a fetch tool that returned quoted cells, not the raw page) | definition; [vendor claim] for torque figures | OpenArm table: reduction ratio "10:1" (DM-J4310-2EC V1.1), "40:1" (DM4340 series), "9:1" (DM-J8009P-2EC); rated torque "3 Nm", "9 Nm", "20 Nm"; peak torque "7 Nm", "27 Nm", "40 Nm"; "Although the DAMIAO 4340 series is not a QDD motor,"; LeRobot: "Built with QDD backdrivable motors and high compliance, OpenArm prioritizes safe human-robot interaction while maintaining practical payload capabilities (6.0kg peak / 4.1kg nominal)" (accessed 2026-11-20)
- Use in dive: section 3, why hobby servos differ from quasi-direct-drive actuators. [derived] 345 / 10 = 34.5: the SO-101 servo's gear train multiplies the motor's torque, and its friction and inertia as felt from the output, by a reduction 34.5 times larger. [our reading] a low reduction lets an outside push turn the motor (backdrivable) and lets motor current stand in for joint torque; a 345:1 gearbox hides both.

**F01-67. The SO-101 itself shows backdrivability as a design choice: the leader arm, which a person must push by hand, uses lower reductions (1/147 and 1/191) on five of six joints, "to make sure it can both sustain its own weight and it can be moved without requiring much force".**
- Location: LeRobot `docs/source/so101.mdx` (F01-10)
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/so101.mdx | Tier 1, first-party docs | documentation of support | "The leader, however, uses three differently geared motors to make sure it can both sustain its own weight and it can be moved without requiring much force." (accessed 2026-11-20). [derived] 345 / 147 = 2.35: the lightest leader gearing is 2.35 times easier to push than the follower's, by reduction ratio alone.
- Use in dive: section 3, backdrivability shown on the reader's own hardware before the word is used for bigger robots.

**F01-68. A quasi-direct-drive motor is commanded with five numbers per joint instead of one: a target position, a target velocity, a stiffness gain kp, a damping gain kd and a feed-forward torque. LeRobot packs these into one 8-byte CAN frame per motor ("MIT mode"), with default kp = 10.0 and kd = 0.5 and allowed ranges kp 0 to 500 and kd 0 to 5.**
- Location: LeRobot `src/lerobot/motors/damiao/damiao.py` `_encode_mit_packet()` lines 428-460 and line 150-151; `src/lerobot/motors/damiao/tables.py` lines 196-197
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/motors/damiao/damiao.py | Tier 1, code | code behaviour | "def _encode_mit_packet(self, motor_type: MotorType, kp: float, kd: float, position_degrees: float, velocity_deg_per_sec: float, torque: float,) -> list[int]: \"\"\"Helper to encode control parameters into 8 bytes for MIT mode.\"\"\""; "# Defaults: Kp=10.0 (Stiffness), Kd=0.5 (Damping)"; tables: "MIT_KP_RANGE = (0.0, 500.0) / MIT_KD_RANGE = (0.0, 5.0)" (accessed 2026-11-20). The law the motor applies to these five numbers is not in this file. The usual form is torque = kp x (target position - position) + kd x (target velocity - velocity) + feed-forward torque [our reading, not fetched from Damiao documentation, U8].
- Use in dive: section 3, torque control in practice: the host sets how stiff the joint is per command, so the same arm can be rigid for placing and soft for contact. The SO-101's stiffness is fixed by the PID gains written once at connect (F01-16).

**F01-69. The buses differ too. The OpenArm's motors sit on CAN FD at 1 Mbit/s arbitration and 5 Mbit/s data; the SO-101's servos share a half-duplex serial line at 1 Mbaud.**
- Location: LeRobot `docs/source/damiao.mdx`, "Configure CAN Interface"; `docs/source/openarm.mdx` config table; F01-12
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/damiao.mdx | Tier 1, first-party docs | documentation of support | "sudo ip link set can0 type can bitrate 1000000 dbitrate 5000000 fd on"; OpenArm table: "| `can_data_bitrate` | `5000000` | CAN FD data bitrate (5 Mbps) |" (accessed 2026-11-20)
- Use in dive: section 3, a comparison row for the "robot as a computer" table: both arms are small networks of motor controllers; the faster bus goes with the motors that need torque commands at a high rate.

### H. Control rates: the ladder from servo loop to planner

Every rate below is the figure the system's builders published, for their robot. None is a measurement made for this dive.

**F01-70. GR00T N1 (NVIDIA, March 2025) named the two-rate split: a vision-language model ("System 2") at 10 Hz on an NVIDIA L40 GPU, and an action model ("System 1") producing motor actions at 120 Hz. Sampling one chunk of 16 actions takes 63.9 ms on an L40.**
- Location: arXiv 2503.14734v2, introduction and model section
- Verdict: CARRIED (seed 04 section 2.1, re-fetched at v2)
- Evidence: https://arxiv.org/abs/2503.14734v2 | Tier 3, preprint (first-party lab) | benchmark claim [author reported] | "The System 2 reasoning module is a pre-trained Vision-Language Model (VLM) that runs at 10Hz on an NVIDIA L40 GPU." / "It generates closed-loop motor actions at a higher frequency (120Hz)." / "our publicly released GR00T-N1-2B model has 2.2B parameters in total, with 1.34B in the VLM. The inference time for sampling a chunk of 16 actions is 63.9ms on an L40 GPU using bf16." (accessed 2026-11-20)
- Use in dive: section 3, the origin of the "System 1 / System 2" vocabulary in robot models, with its rates. Superseded as NVIDIA's current model by F01-73 and F01-74.

**F01-71. Figure's Helix (20 February 2025) runs an onboard vision-language model at 7 to 9 Hz and a visuomotor policy at 200 Hz that outputs a 35-degree-of-freedom upper-body action.**
- Location: figure.ai/news/helix
- Verdict: CARRIED (seed 04 section 2.1 via seed 01, re-fetched)
- Evidence: https://www.figure.ai/news/helix | Tier 2, first-party vendor blog | benchmark claim [vendor claim] | "System 2 (S2): An onboard internet-pretrained VLM operating at 7-9 Hz for scene understanding and language comprehension" / "S1 executes as a separate real-time process, maintaining the critical 200Hz control loop required for smooth whole upper body action." / "Helix coordinates a 35-DoF action space at 200Hz" (accessed 2026-11-20)
- Use in dive: section 3, rate ladder, the 2025 rung values.

**F01-72. Figure's Helix 02 (27 January 2026) adds a third, faster layer: "System 0", a 10-million-parameter network that outputs joint-level actuator commands at 1 kHz, under System 1 at 200 Hz and a slow-reasoning System 2.**
- Location: figure.ai/news/helix-02
- Verdict: CARRIED (seed 04 section 2.1 via seed 01, re-fetched)
- Wave 2 (2026-11-20, STALE (partial)): Helix 02 (2026-01-27) is no longer Figure's newest model: "Helix 2.5: Zero-Shot 30-Home Generalization" was posted 2026-09-17 (https://www.figure.ai/news/helix-2-5-zero-shot-30-home-generalization, accessed 2026-11-20) and states no control rate, parameter count or latency. Helix 02's 1 kHz and 200 Hz remain the last rates Figure published; print them with the date and name Helix 2.5 as the newest model, which publishes none.
- Evidence: https://www.figure.ai/news/helix-02 | Tier 2, first-party vendor blog | benchmark claim [vendor claim] | "System 2 (S2) reasons slowly about goals: interpreting scenes, understanding language, and sequencing behaviors. System 1 (S1) thinks fast, translating perception into full-body joint targets at 200 Hz. System 0 (S0) executes at 1 kHz" / "Architecture: A 10M-parameter neural network that takes full-body joint state and base motion as input and outputs joint-level actuator commands at 1 kHz." (accessed 2026-11-20). No rate is stated for S2 on this page.
- Use in dive: section 3, the kHz rung of the ladder from a system that publishes it.

**F01-73. NVIDIA's GR00T 2 (research page dated November 2026, code "Available in December") publishes a full ladder for a Unitree G1 humanoid: a reasoning model picks the task; GR00T 2 Turbo plans 1.6 s chunks of whole-body motion tokens about once per second (124 ms per prediction on Jetson AGX Thor, 38 ms on an RTX 5090); the SONIC controller turns tokens into joint targets at 50 Hz; the diagram labels joint PD control at 1 kHz. Everything except the reasoning model runs on the robot.**
- Location: research.nvidia.com/labs/gear/gr00t-2, sections "Think Slow, Move Fast" and the deployment figure
- Verdict: CARRIED (seed 04 section 2.1 named "GR00T 2 Turbo: 1.6 s chunks about once per second" and placed System 0 on "Jetson Orin NX" from a secondary source; re-fetched from the first-party page, which confirms both)
- Evidence: https://research.nvidia.com/labs/gear/gr00t-2 | Tier 2, first-party lab page (no paper version pinned; the page's "Paper" link was not followed, U9) | benchmark claim [vendor claim] | "Optimized, a Turbo prediction for G1 takes 38 ms on an RTX 5090 and 124 ms onboard Jetson Thor, where it plans 1.6 s chunks of whole-body motion tokens about once per second; SONIC executes them at 50 Hz." / "A reasoning model chooses the task; GR00T 2 Turbo imagines and plans; SONIC turns latent whole-body tokens into joint targets. Everything but the reasoning model runs onboard." / figure labels: "NVIDIA Jetson AGX Thor - SONIC on Jetson Orin NX", "SONIC whole-body controller 50 Hz", "Unitree G1 joint PD control 1 kHz" / "The agent runs as System 2 (S2)." (accessed 2026-11-20; figure labels are quoted from the page's flattened text, so which box each rate belongs to should be checked against the rendered figure before use)
- Use in dive: section 3, the newest published ladder (November 2026): about 1 Hz planning of chunks, 50 Hz whole-body control, 1 kHz joint loop.

**F01-74. GR00T N1.7 is the newest GR00T with released code (GitHub release `n1.7-release`, 18 April 2026). NVIDIA's benchmark for one complete policy call (action horizon 40, four denoising steps, two 256x256 cameras, batch 1) gives a median of 22.9 ms on an H100, 24.7 ms on an RTX Pro 6000 Blackwell, 35.0 ms on an L40, 116.6 ms on DGX Spark, 76.8 ms on Jetson AGX Thor (35.6 ms with the mixed NVFP4 engine) and 149.0 ms on Jetson Orin, all with TensorRT; PyTorch eager on the same devices takes 101.5, 75.7, 123.7, 200.8, 106.8 and 357.9 ms.**
- Location: NVIDIA/Isaac-GR00T `scripts/deployment/README.md`, "Benchmark Results", at `708617f5716c63fc0a327391492ea2b91977ae90`; `README.md` line 72
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/NVIDIA/Isaac-GR00T/708617f5716c63fc0a327391492ea2b91977ae90/scripts/deployment/README.md | Tier 1, first-party repo docs | benchmark claim [vendor claim] | "Median complete-policy-call latency for the `nvidia/GR00T-N1.7-LIBERO` `libero_10` checkpoint (32 DiT blocks): batch size 1, action horizon 40, four denoising steps, and two 256x256 camera inputs. Timings include preprocessing and action decoding, excluding RPC." Table rows: "| H100 80GB HBM3 | 101.5 | 53.4 | 22.9 |", "| RTX Pro 6000 Blackwell Server Edition (96 GB) | 75.7 | 52.1 | 24.7 |", "| L40 | 123.7 | 66.8 | 35.0 |", "| DGX Spark | 200.8 | 183.1 | 116.6 |", "| AGX Thor (MAXN) | 106.8 | 100.5 | 76.8 | 35.6 |", "| Jetson Orin (MAXN) | 357.9 | 224.3 | 149.0 |"; "they do not measure closed-loop task success"; README: "GR00T N1.7 runs at ~40 Hz on NVIDIA RTX PRO 6000 Blackwell Server Edition and ~28 Hz on Jetson AGX Thor" (accessed 2026-11-20). [derived] 1000 / 24.7 = 40.5 calls per second and 1000 / 35.6 = 28.1, which matches the README's two figures; each call returns 40 actions.
- Use in dive: section 3, "what it costs in compute" for the policy rung: a 3-billion-parameter VLA call is 23 to 150 ms depending on the box, which is 1 to 5 control ticks at 30 Hz.

**F01-75. SONIC (NVIDIA, arXiv v4) runs four loops at four rates on a Jetson Orin inside the Unitree G1: policy inference at 50 Hz, command streaming at 500 Hz, operator input at 100 Hz, kinematic planning at 10 Hz; one policy forward pass takes 1 to 2 ms; the policy's outputs are tracked by a PD controller at each joint.**
- Location: arXiv 2511.07820v4, section 3.5 "Deployment" and the action definition
- Verdict: CARRIED (seed 04 section 2.1, re-fetched at v4)
- Evidence: https://arxiv.org/abs/2511.07820v4 | Tier 3, preprint (first-party lab) | benchmark claim [author reported] | "All inference ran onboard a Jetson Orin GPU using TensorRT with CUDA Graph acceleration, yielding 1-2 ms per policy forward pass and 12 ms for motion generation. The system used a multi-rate architecture with four concurrent loops: policy inference at 50 Hz, command streaming at 500 Hz, operator input at 100 Hz, and kinematic planning at 10 Hz." / "proportional-derivative (PD) controllers at each joint" (accessed 2026-11-20)
- Use in dive: section 3, a multi-rate system in one sentence from its authors; shows that a small controller (the deployed model has 42M parameters per the same section) is fast enough for an embedded GPU.

**F01-76. In the pi line the model's actions are joint or pose targets at 50 Hz, tracked by simple PD controllers; the model itself runs far less often. pi0 (2024) ran inference every 0.5 s on its 50 Hz robots, after executing 25 actions of each chunk, with 73 ms per inference on an RTX 4090 on board and 86 ms off board.**
- Location: arXiv 2410.24164v4 (pi0), inference appendix and Table I; arXiv 2504.16054v1 (pi0.5), robot system section
- Verdict: CARRIED (seed 04 section 2.1 gave "chunk H=50 at 50 Hz (one inference per ~1 s)"; the pi0 paper says every 0.5 s after 25 actions, see section 6)
- Evidence: https://arxiv.org/abs/2410.24164v4 and https://arxiv.org/abs/2504.16054v1 | Tier 3, preprints (first-party lab); the 2024 paper is cited as the one that introduced the design | benchmark claim [author reported] | pi0: "For the 20Hz UR5e and Franka robots, we run inference every 0.8 seconds (after executing 16 actions), and for all other robots, which run at 50Hz, we run inference every 0.5 seconds (after executing 25 actions)." and "image encoders 14 ms / observation forward pass 32 ms / x10 action forward pass (flow) 27 ms / network latency (if off-board) 13 ms / total on-board inference 73 ms / total off-board inference 86 m[s]"; "The operations were timed on an NVIDIA GeForce RTX 4090 consumer-grade GPU."; pi0.5: "the model directly commands target poses for the arms, gripper, and torso lift, and the target base velocities at 50 Hz (with action chunking). These targets are tracked with simple PD controllers, without any additional trajectory planning or collision detection." (accessed 2026-11-20)
- Use in dive: section 3, the split shown with numbers: 2 model calls per second feed a 50 Hz stream of targets that a PD loop tracks.

**F01-77. pi0.7 (Physical Intelligence, arXiv v2, April 2026) keeps the same shape: a 50-action chunk, robots at 50 Hz (UR5e at 20 Hz), a simple PD controller applying the output, and training that simulates inference delays of 0 to 12 timesteps, "a maximum inference latency of 240ms on a 50Hz robot".**
- Location: arXiv 2604.15483v2, architecture and training details; robot platforms
- Verdict: CARRIED (seed 04 section 2.3 via seed 01, re-fetched at v2)
- Evidence: https://arxiv.org/abs/2604.15483v2 | Tier 3, preprint (first-party lab) | definition; benchmark claim [author reported] | "The number of action tokens processed by the action expert is fixed at 50, representing an action chunk of 50 steps." / "During training, we simulate delays of 0 to 12 timesteps, corresponding to a maximum inference latency of 240ms on a 50Hz robot." / "The UR5e robots run at 20 Hz, while all other robots run at 50 Hz. ... The action output of the model is applied on each robot using a simple PD controller." (accessed 2026-11-20). [derived] 12 x 20 ms = 240 ms; a 50-action chunk at 50 Hz covers 1.0 s.
- Use in dive: section 3, the current (2026) pi figures; shows latency being treated as a training input, measured in control ticks.

**F01-78. Gemini Robotics (Google DeepMind, March 2025) splits one policy across the network: a backbone hosted in the cloud with query-to-response latency under 160 ms, and a decoder on the robot's onboard computer; end to end about 250 ms from observation to action chunk, with an effective control frequency of 50 Hz because each response carries several actions.**
- Location: arXiv 2503.20020v1, section on the Gemini Robotics model architecture
- Verdict: CARRIED (seed 04 section 2.1 via seed 01, re-fetched at v1)
- Evidence: https://arxiv.org/abs/2503.20020v1 | Tier 3, preprint (first-party lab) | benchmark claim [author reported] | "The model is made up of two components: a VLA backbone hosted in the cloud (Gemini Robotics backbone) and a local action decoder running on the robot's onboard computer (Gemini Robotics decoder)." / "its query-to-response latency has been optimized from seconds to under 160ms." / "When the backbone and local decoder are combined, the end-to-end latency from raw observations to low-level action chunks is approximately 250ms. With multiple actions in the chunk (Zhao et al., 2023), the effective control frequency is 50Hz." (accessed 2026-11-20)
- Use in dive: section 3, a quarter-second model driving a 50 Hz robot: the clearest published case of "slow model, fast loop".

**F01-79. Google DeepMind's 2026 model posts (Gemini Robotics 2 on 30 July 2026; Gemini Robotics 2.5 on 10 November 2026) state no control rate, latency or chunk length. The Gemini Robotics 2 post does say the on-device model runs locally "without network latency" as a design need and shows it on the SO101.**
- Location: deepmind.google blog posts named in the claim
- Verdict: NEW
- Evidence: https://deepmind.google/blog/gemini-robotics-2-brings-whole-body-intelligence-to-robots/ and https://deepmind.google/blog/gemini-robotics-2-5-accelerates-real-world-physical-intelligence/ | Tier 2, first-party lab blog (read through a fetch tool that returned quoted fragments) | documentation of support (and absence) | "Many robotic applications need to operate without network latency or internet connectivity." / "Gemini Robotics On-Device 2 is built specifically to handle these constraints - it is our most-efficient vision-language-action model (VLA) optimized to run locally on robotic devices." / "...as shown below with a diverse set of tasks being performed by the Dexmate, SO101, and Trossen platforms." (accessed 2026-11-20). No Hz, ms or chunk figure was found in either post.
- Use in dive: section 3, currency: the 2025 Gemini Robotics latency figures (F01-78) are the newest Google has published with numbers; and the SO-101 appears in a frontier lab's July 2026 on-device demo.

**F01-80. The reason for the split, in the words of the real-time chunking paper: large models are too slow to answer inside one control period, so "a model must think about its future actions while executing a previous one". Its setup: 76 ms model latency (97 ms with the method), plus 10 to 20 ms for inference over a local network.**
- Location: arXiv 2506.07339v2, introduction and experimental setup
- Verdict: CARRIED (seed 04 sections 2.2 and 2.3, re-fetched at v2)
- Evidence: https://arxiv.org/abs/2506.07339v2 | Tier 3, preprint (first-party lab; the seed research gives the venue as NeurIPS 2025, not confirmed in this pass) | definition; benchmark claim [author reported] | "applying large models to real-time control problems effectively will require some form of asynchronicity: that is, a model must think about its future actions while executing a previous one." / "giving a model latency of 76ms for the baselines and 97ms for RTC. We use remote inference over LAN, which adds 10-20ms of latency" (accessed 2026-11-20)
- Use in dive: section 3, the one paragraph on action chunking and the pointer to stream 02.

**F01-81. The same ladder exists on the SO-101, with fewer rungs: the servo's PID loop (rate unpublished, F01-45) tracks a goal position; the host writes new goals at 30 Hz by default, or 30 x N Hz with interpolation (F01-39); a chunking policy is called once per chunk, which at defaults is every 1.67 s for a 50-action chunk (F01-57); a language planner above that is optional (`--planner.model_id` in the rollout docs).**
- Location: synthesis of F01-16, F01-28, F01-39, F01-57; LeRobot `docs/source/inference.mdx`, "External planner"
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/inference.mdx | Tier 1, first-party docs | [our reading] built on code behaviour entries | "`--planner.model_id=<name>` routes `/vqa` and `/autosteer` through the annotation pipeline's VLM client (`annotations` extra) instead of the policy's text head. Calls run on a worker thread while the robot keeps acting" (accessed 2026-11-20)
- Use in dive: section 3, the rate-ladder diagram drawn for the reader's arm first, then for a humanoid (F01-73).

### I. Why latency is a physical quantity

**F01-82. An upper bound on how fast the SO-101's gripper can move: the datasheet's no-load joint speed times the arm's length. [derived] 42 RPM (6 V) = 4.40 rad/s; 4.40 rad/s x 0.413 m = 1.82 m/s. At 7.4 V: 52 RPM = 5.45 rad/s; x 0.413 m = 2.25 m/s. This is a ceiling for one joint swinging the fully stretched, unloaded arm.**
- Location: derived from F01-42 (datasheet speed) and F01-50 (URDF link lengths)
- Verdict: NEW
- Wave 2 (2026-11-20, SCOPE NARROWER): The arithmetic holds. The 1.82 and 2.25 m/s ceilings use the datasheet's no-load speeds at 6 V and 7.4 V; the stock bill of materials uses a 5 V supply, below both. Print one number: under about 1.8 m/s, no load, at 6 V; lower on the stock 5 V supply (not measured).
- Evidence: https://core-electronics.com.au/attachments/uploads/sts3215-smart-servo-datasheet-translated.pdf and https://raw.githubusercontent.com/TheRobotStudio/SO-ARM100/141aea7bcac2744d92998e30268c413202a56f96/Simulation/SO101/so101_new_calib.urdf | Tier 1 datasheet and code | [derived] | inputs: "0.238sec/60 deg (42RPM)", "0.192sec/60 deg (52RPM)"; link norms 0.1160 + 0.1350 + 0.0637 + 0.0984 = 0.413 m. 42 x 2 x pi / 60 = 4.398 rad/s. (accessed 2026-11-20). Caveats: no-load speed, so a real arm carrying its own weight is slower; the bill of materials lists a 5 V supply (F01-5), below both datasheet columns; no measured SO-101 tip speed was found (U10).
- Use in dive: section 3, the "real figure" for arm speed. Use it as "at most about 2 m/s"; do the blind-travel examples at a labelled working speed well below it.

**F01-83. Distance travelled blind = speed x delay. [derived] At an illustrative working speed of 0.25 m/s: one 30 Hz tick (33.3 ms) is 8.3 mm; 100 ms is 25 mm; 250 ms is 62.5 mm; 1 s is 250 mm. At the 1.82 m/s ceiling of F01-82: 33.3 ms is 61 mm and 100 ms is 182 mm.**
- Location: derived; delay values taken from F01-28 (33.3 ms tick), F01-74 (GR00T N1.7 call, 23 to 149 ms), F01-78 (about 250 ms end to end)
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/configs/dataset.py | Tier 1, code (for the 30 Hz input) | [derived]; the 0.25 m/s speed is an [illustration] | 0.25 m/s x 0.0333 s = 0.00833 m; 0.25 x 0.100 = 0.025 m; 0.25 x 0.250 = 0.0625 m; 1.82 x 0.0333 = 0.0606 m; 1.82 x 0.100 = 0.182 m. (accessed 2026-11-20)
- Use in dive: section 3, the core arithmetic of "latency is a physical quantity": a cup mouth is a few centimetres wide, so 100 ms of delay at a modest speed spends most of that tolerance.

**F01-84. What the encoder can see at the gripper. [derived] One encoder step is 0.088 degrees = 0.001534 rad; at 0.413 m from the shoulder that is 0.63 mm of gripper travel. The gear backlash of up to 0.5 degrees = 0.008727 rad is 3.6 mm at the same radius.**
- Location: derived from F01-11, F01-43, F01-50
- Verdict: NEW
- Evidence: https://core-electronics.com.au/attachments/uploads/sts3215-smart-servo-datasheet-translated.pdf | Tier 1, manufacturer datasheet | [derived] | 360 / 4096 = 0.0879 degrees; x pi / 180 = 0.001534 rad; x 0.413 m = 0.000634 m. 0.5 degrees x pi / 180 = 0.008727 rad; x 0.413 m = 0.00360 m. The backlash figure in radians matches the simulation file's `range="-0.008726646259971648 0.008726646259971648"` (F01-43). (accessed 2026-11-20)
- Use in dive: section 3, why the arm needs cameras: its own joint sensing is good to well under a millimetre per step at one joint, but slack in the gears alone is several millimetres at the gripper, before errors from five joints add up.

**F01-85. A camera at 30 fps delivers a new frame every 33.3 ms, and the loop does not wait for one: the follower calls `read_latest()`, which the docs describe as returning the most recent frame in the buffer, which "may be stale".**
- Location: LeRobot `docs/source/cameras.mdx`, "Frame access modes"; `so_follower.py` line 175
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/cameras.mdx | Tier 1, first-party docs and code | code behaviour | "| `read_latest(max_age_ms)` | Peeks at the most recent frame in buffer (may be stale). Raises `TimeoutError` if frame is older than `max_age_ms`. | No |" and `obs_dict[cam_key] = cam.read_latest()` (accessed 2026-11-20). [derived] 1 / 30 = 33.3 ms between frames, so with the camera and the loop both at 30 Hz and unsynchronised, the frame in hand is between 0 and 33.3 ms old at the moment it is read, before exposure, USB transfer and decoding are counted (those were not sourced, U11).
- Use in dive: section 3, camera frame time as a latency term; at 0.25 m/s [illustration] one frame of age is 8.3 mm.

**F01-86. Raw data rate of the arm task. [derived] One 640x480 RGB frame is 640 x 480 x 3 = 921,600 bytes. Two cameras at 30 fps: 2 x 30 x 921,600 = 55,296,000 bytes per second (55.3 MB/s, 442 Mbit/s). State plus action: (6 + 6) x 4 bytes x 30 = 1,440 bytes per second. The images are 38,400 times the joint data.**
- Location: derived from F01-26 (float32, shape 6), F01-28 (30 fps), F01-30 (640x480, two cameras)
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/src/lerobot/utils/feature_utils.py | Tier 1, code (inputs) | [derived] | 55,296,000 / 1,440 = 38,400. A default 60 s episode is 60 x 55,296,000 = 3.32 GB raw before video encoding (accessed 2026-11-20)
- Use in dive: section 3 worked example: the robot's body is 1.4 kB/s; its eyes are 55 MB/s. This is why recordings are video-encoded (default encoder `libsvtav1`, `src/lerobot/configs/video.py` line 89) and why the cost of a policy is dominated by vision.

**F01-87. With the default synchronous backend the arm stops while the model thinks; the docs say so directly, and say that the asynchronous backends only work if the buffered actions outlast the inference time.**
- Location: LeRobot `docs/source/remote_inference.mdx`, first paragraph; `docs/source/inference.mdx`, RTC section
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/inference.mdx | Tier 1, first-party docs | documentation of support | "with a synchronous rollout the robot stops moving every time the policy computes its next chunk of actions" (remote_inference.mdx) and "Continuous execution still requires enough usable action playback to cover inference latency and its variation." (inference.mdx) (accessed 2026-11-20)
- Use in dive: section 3, the condition that makes chunking work, stated as an inequality the reader can check: chunk duration left to play must exceed model latency. Example [derived]: a 50-action chunk at 30 Hz lasts 1,667 ms; a 149 ms call (GR00T N1.7 on Jetson Orin, F01-74) uses 149 / 33.3 = 4.5 ticks of it.

### J. What compute sits on or next to the arm

**F01-88. The SO-101 carries no computer. A host computer reaches each arm through a USB serial port (`/dev/ttyACM0` on Linux, `/dev/tty.usbmodem...` on macOS), one port per arm, and the cameras are separate USB devices on the same host.**
- Location: LeRobot `docs/source/so101.mdx`, "Find the USB ports associated with each arm"; SO-ARM100 bill of materials (F01-6)
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/so101.mdx | Tier 1, first-party docs | documentation of support | "To find the port for each bus servo adapter, connect MotorBus to your computer via USB and power." / "['/dev/ttyACM0', '/dev/ttyACM1']" / "Connect the usb cable from your computer and the power supply to the follower arm's controller board." (accessed 2026-11-20). "No computer on the arm" is [our reading] of the bill of materials, which lists only servos, a bus adapter board, cables, a power supply, clamps and a screwdriver.
- Use in dive: section 3, item 8: the arm is a peripheral. The "robot computer" is whatever the USB cables plug into.

**F01-89. LeRobot documents that host as "a laptop or single-board computer next to the arm", and supports Jetson boards with a caveat: on Jetson, video decoding runs on the CPU by default, and the CUDA build is community-maintained.**
- Location: LeRobot `docs/source/remote_inference.mdx` (F01-41); `docs/source/installation.mdx`, platform note
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/installation.mdx | Tier 1, first-party docs | documentation of support | "**Jetson (aarch64 + CUDA):** video decoding runs on CPU by default. `docker/Dockerfile.jetson` builds `torch`/`torchcodec` from source with CUDA support for JetPack 6.2 - community-maintained" (link targets omitted; accessed 2026-11-20)
- Use in dive: section 3, the Jetson option stated from the docs, with its limitation.

**F01-90. Indicative training cost for the arm task from LeRobot's hardware guide: about 50 episodes (roughly 45,000 frames at 30 fps), 5 epochs, 640x480 images: ACT in 30 to 60 minutes on one RTX 4090 or 3090, SmolVLA in 3 to 6 hours on one L4 or A10G, pi0 or pi0.5 in 4 to 8 hours on one A100 40 GB. Peak GPU memory at batch 8: ACT about 2 to 6 GB, SmolVLA about 10 to 16 GB, pi0-class about 24 to 40 GB. The guide calls these order-of-magnitude figures.**
- Location: LeRobot `docs/source/hardware_guide.mdx`, "Memory by policy group" and "Common scenarios", tag v0.7.0
- Verdict: NEW
- Wave 2 (2026-11-20, SCOPE NARROWER): The guide's times are for batch sizes 8 (ACT), 4 (SmolVLA on a 24 GB GPU) and 4 (pi0 or pi0.5), and for "5 epochs on a ~50-episode dataset (~45k frames at 30 fps x 30 s)", with "Real runs deviate by +/-50%". At LeRobot's default 60 s episode (F01-28) the same 50 episodes are 90,000 frames and each time doubles [derived]. The "20k steps, about 4 hours on a single A100" for SmolVLA (F02-63) is a different recipe.
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/hardware_guide.mdx | Tier 1, first-party docs | benchmark claim [vendor claim, stated as indicative] | "The numbers below are **indicative** - order-of-magnitude figures for picking hardware, not exact predictions."; "| Light BC | `act`, `vqbet`, `tdmpc` | ~2-6GB |", "| Small VLA | `smolvla` | ~10-16GB |", "| Large VLA | `pi0`, `pi0_fast`, `pi05`, `xvla`, `wall_x` | ~24-40GB |"; "| Single RTX 4090 / RTX 3090 (24 GB) | `act` | 8 | ~30-60min |", "| Single L4 / A10G (24 GB) | `smolvla` | 4 | ~3-6h |", "| Single A100 40 GB | `pi0` / `pi05` | 4 | ~4-8h |"; "total_frames = sum of frames over all episodes # 50 ep x 30 fps x 30 s = 45,000" (approximation sign normalised; accessed 2026-11-20)
- Use in dive: section 3, "what it costs in compute", as a pointer: stream 02 and the compute streams own the detail. It also names AWS `g5/g6` as the L4/A10G class.

**F01-91. The same guide gives measured step times on 4 x H100 80 GB at batch 32 for 5,000 steps on a roughly 50-episode dataset: Diffusion Policy 0.167 s per update (16 min 17 s total), SmolVLA 0.312 s (27 min 49 s), pi0.5 2.548 s (3 h 41 min), with data loading at 0.011 to 0.015 s per step and GPU utilisation about 80 to 95%.**
- Location: `hardware_guide.mdx`, "Multi-GPU matters a lot", reference table
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/huggingface/lerobot/410c095eacc0011d998a73383eb94abed2715af0/docs/source/hardware_guide.mdx | Tier 1, first-party docs | benchmark claim [vendor reported] | "| `diffusion` | 16m 17s | 0.167 | 0.015 | ~90% |", "| `smolvla` | 27m 49s | 0.312 | 0.011 | ~80% |", "| `pi05` | 3h 41m | 2.548 | 0.014 | ~95% |" (columns: wall-clock, `update_s`, `dataloading_s`, GPU util; accessed 2026-11-20). The guide notes that this benchmark's `dataloading_s` includes preprocessing.
- Use in dive: section 3 pointer only; a first-party statement of which part of the machine the training loads (GPU update time dominates data loading by 10x to 180x).

**F01-92. NVIDIA's GR00T repository ships a fine-tuning example for this exact arm family and task shape: demo data `cube_to_bowl_5` recorded on an SO100 arm (5 episodes), fine-tuned from the 3-billion-parameter `nvidia/GR00T-N1.7-3B` base; inference needs one GPU with 16 GB or more of memory, and the listed devices include Jetson AGX Thor and Orin and DGX Spark.**
- Location: NVIDIA/Isaac-GR00T `README.md` at `708617f5716c63fc0a327391492ea2b91977ae90`, demo data table and hardware requirements
- Verdict: NEW
- Evidence: https://raw.githubusercontent.com/NVIDIA/Isaac-GR00T/708617f5716c63fc0a327391492ea2b91977ae90/README.md | Tier 1, first-party repo docs | documentation of support | "| `demo_data/cube_to_bowl_5` | SO100 arm (5 episodes) | `NEW_EMBODIMENT` | Fine-tuning custom embodiment example |"; "| `nvidia/GR00T-N1.7-3B` | Base | ... | Base model (3B params) - zero-shot inference on pretrain embodiments, or finetune for new tasks |"; "**Inference:** 1 GPU with 16 GB+ VRAM (e.g., RTX 4090, L40, H100, Jetson AGX Thor/Orin, DGX Spark)." (accessed 2026-11-20)
- Use in dive: section 3 and the dive's threaded task: a first-party "cube to bowl" example on the SO-100/SO-101 family is the nearest published relative of "block into cup".

---

## 5. Teaching material for section 3, "The Robot as a Computer"

### 5.1 The plain-words idea

A robot arm is a small computer network with motors on it. Each joint is driven by a servo: a motor, a gearbox, a position sensor and a microcontroller in one box, which holds whatever angle it was last told to hold (F01-14, F01-16, F01-44). A host computer, which on the SO-101 is a laptop or a small board at the other end of a USB cable (F01-88, F01-89), repeats one short loop about 30 times a second: read the six joint angles and the camera frames, decide six new target angles, write them to the servos (F01-22, F01-28, F01-33). Everything "AI" lives in the "decide" step. Everything physical happens while that step is still computing, because the arm keeps moving (F01-83).

Three terms the section must build in this order, each from the arm:
1. **Observation**: what the robot knows this tick. On the SO-101: six joint positions (proprioception, the robot's sense of its own pose) and one image per camera (F01-23, F01-26, F01-61).
2. **Action**: what the robot is told this tick. On the SO-101: six target joint positions, same names and units as the observation (F01-23, F01-27).
3. **Control rate**: how many observation-action cycles run per second. 30 Hz when recording, so one tick is 33.3 ms (F01-28).

### 5.2 Worked example on the arm (real figures, arithmetic redoable)

The task: the SO-101 picks up a block and places it in a cup. Setup as in the LeRobot tutorial: one follower arm, a wrist camera and a top camera at 640x480 and 30 fps, loop at 30 Hz (F01-30, F01-31, F01-28).

| Quantity | Arithmetic | Result | Entries |
|---|---|---|---|
| Numbers the body reports per tick | 6 joints x 1 float32 | 6 values, 24 bytes | F01-8, F01-26 |
| Numbers the body is told per tick | 6 joints x 1 float32 | 6 values, 24 bytes | F01-26 |
| Body data per second | (24 + 24) x 30 | 1,440 bytes/s | F01-86 |
| One camera frame, raw | 640 x 480 x 3 | 921,600 bytes | F01-30 |
| Two cameras per second, raw | 2 x 30 x 921,600 | 55,296,000 bytes/s (55.3 MB/s) | F01-86 |
| Eyes versus body | 55,296,000 / 1,440 | 38,400 to 1 | F01-86 |
| One default 60 s episode, raw | 60 x 55,296,000 | 3.32 GB before video encoding | F01-28, F01-86 |
| Encoder steps per turn | 12 bits | 4096 | F01-11, F01-43 |
| Encoder steps per degree | 4096 / 360 | 11.38 | F01-11 |
| Degrees per step | 360 / 4096 | 0.088 | F01-43 |
| A 90 degree move, in steps | 4096 / 360 x 90 | 1024 (the datasheet's own example) | F01-43 |
| Raw step count to degrees, as LeRobot computes it | (raw - mid) x 360 / 4095, with raw = 3072 and mid = 2048 [illustration] | 90.02 degrees | F01-18 |
| One step, seen at the gripper at full reach | 0.001534 rad x 0.413 m | 0.63 mm | F01-84 |
| Gear backlash, seen at the gripper at full reach | 0.008727 rad x 0.413 m | 3.6 mm | F01-84 |
| One control tick | 1 / 30 | 33.3 ms | F01-28 |
| Fastest the gripper could go (one joint, unloaded, 6 V, arm stretched) | 42 RPM = 4.40 rad/s; x 0.413 m | 1.82 m/s ceiling | F01-82 |
| Gripper travel in one tick at 0.25 m/s [illustration] | 0.25 x 0.0333 | 8.3 mm | F01-83 |
| Gripper travel during a 100 ms model call at 0.25 m/s [illustration] | 0.25 x 0.100 | 25 mm | F01-83 |
| Gripper travel during a 250 ms cloud round trip at 0.25 m/s [illustration] | 0.25 x 0.250 | 62.5 mm | F01-78, F01-83 |
| Motion covered by one 50-action chunk at 30 Hz | 50 / 30 | 1.67 s | F01-57 |
| Ticks consumed by a 149 ms policy call (GR00T N1.7 on Jetson Orin) | 149 / 33.3 | 4.5 ticks | F01-74 |
| Leader versus follower gearing | 345 / 147 | 2.35 times lower reduction on the lightest leader joints | F01-10, F01-67 |
| Stall torque of the follower servo at 6 V | 16.5 kg.cm x 0.0980665 | 1.62 N.m | F01-5, F01-42 |

The only invented numbers are the 0.25 m/s working speed and the raw step value 3072. Everything else comes from the cited entries.

### 5.3 The mechanism (which number goes where)

One tick of `record_loop` at v0.7.0, in order (F01-22, F01-27, F01-33, F01-34):

1. `robot.get_observation()`: one sync read of register `Present_Position` (address 56, 2 bytes per servo) from servo IDs 1 to 6 over the 1 Mbaud half-duplex line; raw steps 0 to 4095 are converted to degrees (five arm joints) and to 0 to 100 (gripper); then `read_latest()` on each camera returns an array of shape (480, 640, 3) (F01-14, F01-18, F01-85).
2. `teleop.get_action()` (when teleoperating): the same sync read on the leader arm, giving six numbers under the same names (F01-24). When a policy drives, this step is the policy's output instead.
3. `robot.send_action()`: the six numbers are converted back to raw steps and written with one sync write to register `Goal_Position` (address 42) (F01-14, F01-22).
4. `dataset.add_frame()`: `observation.state` (6 float32), `action` (6 float32), `observation.images.wrist`, `observation.images.top` and the task string are appended (F01-26, F01-27).
5. `timer.wait()`: sleep until `cycle start + ticks done x (1 / fps)` (F01-34, F01-35).

Below the loop, inside each servo, a PID controller compares the present position with the goal position and sets the motor's drive voltage. LeRobot writes its gains once (P = 16, I = 0, D = 32) and never talks to that loop again (F01-16, F01-44). Formula for the page, with every symbol defined: drive = P x e + I x (running sum of e) + D x (change in e per step), where e = goal position minus present position, in encoder steps. The proportional term pushes harder the further the joint is from its goal; the derivative term brakes when the error is shrinking fast; the integral term is switched off on the SO-101 (I = 0), so a joint holding a load can sit slightly short of its goal. The exact units and update rate of the servo's PID are not published (F01-45, U5), so the formula is the textbook form and must be labelled as such.

Units formula (F01-18): degrees = (raw - mid) x 360 / 4095, where raw is the encoder reading in steps, mid is the midpoint of the joint's calibrated range in steps, and 4095 is the encoder resolution minus one. Gripper: percent = (raw - min) / (max - min) x 100, where min and max are the calibrated end stops.

Blind-travel formula (F01-83): distance = speed x delay. Speed is the gripper's speed in metres per second; delay is the time between the camera seeing the scene and the motors receiving the action computed from it, in seconds. Delay is a sum: frame age (0 to 33.3 ms at 30 fps, F01-85) + bus read (U14) + model call (23 to 358 ms for GR00T N1.7 by device and runtime, F01-74) + network if the model is remote (10 to 20 ms on a local network, F01-80) + up to one tick of waiting for the next write.

The rate ladder for the diagram (F01-81 for the arm, F01-73 for a humanoid):

| Rung | SO-101 with LeRobot v0.7.0 | Unitree G1 with GR00T 2 (NVIDIA, November 2026, vendor figures) |
|---|---|---|
| Joint loop | PID inside each STS3215, rate not published (F01-45) | joint PD control, labelled 1 kHz (F01-73) |
| Motor command stream | 30 Hz default; 30 x N Hz with interpolation (F01-28, F01-39) | SONIC whole-body controller, 50 Hz (F01-73, F01-75) |
| Policy | one call per chunk: 50 actions = 1.67 s at 30 Hz for SmolVLA or pi0.5 defaults (F01-57) | GR00T 2 Turbo: 1.6 s chunks about once per second, 124 ms per call on Jetson AGX Thor (F01-73) |
| Planner | optional external vision-language model, off the control path (F01-81) | "reasoning model", the only part not on the robot (F01-73) |

### 5.4 What it costs in compute

| Workload | Published figure | Which part of the machine | Entry |
|---|---|---|---|
| The control loop itself (read, write, record) | docs sample: 18.4 ms mean work per 33.3 ms tick, 74% of it reading joints and cameras; hardware not stated | host CPU, USB (serial adapter and cameras); on macOS and Windows one core busy-waits up to 10 ms per tick | F01-35, F01-38 |
| Servo bus | 1,000,000 baud, at most 100,000 bytes/s; USB adapter latency timer 16 ms | USB serial | F01-12, F01-25 |
| Raw camera streams | 55.3 MB/s for two 640x480 cameras at 30 fps | USB, memory; then video encode (default `libsvtav1`, a software encoder that runs on the CPU [our reading]; "auto" picks a hardware codec if available) | F01-86 |
| Policy inference, 3B-parameter VLA (GR00T N1.7), per call | TensorRT: 22.9 ms H100, 24.7 ms RTX Pro 6000 Blackwell, 35.0 ms L40, 116.6 ms DGX Spark, 76.8 ms AGX Thor (35.6 ms with NVFP4), 149.0 ms Jetson Orin; PyTorch eager 75.7 to 357.9 ms; 16 GB or more of GPU memory | GPU tensor cores; preprocessing on CPU ("PyTorch uses eight CPU threads") | F01-74, F01-92 |
| Policy inference, pi0 (2024), per call | 73 ms on an RTX 4090: 14 ms image encoders, 32 ms observation pass, 27 ms for 10 flow steps | GPU | F01-76 |
| Whole-body controller (SONIC) | 1 to 2 ms per forward pass on a Jetson Orin | embedded GPU | F01-75 |
| Training on about 50 episodes (45,000 frames), 5 epochs | ACT 30 to 60 min on one RTX 4090; SmolVLA 3 to 6 h on one L4 or A10G; pi0 or pi0.5 4 to 8 h on one A100 40 GB (indicative) | GPU; data loading is 0.011 to 0.015 s per step against 0.167 to 2.548 s of GPU update | F01-90, F01-91 |
| Training memory at batch 8 | ACT about 2 to 6 GB; SmolVLA about 10 to 16 GB; pi0-class about 24 to 40 GB (indicative) | GPU memory | F01-90 |

The servo's own PID costs the host nothing: it runs on the microcontroller inside each servo (F01-16, F01-44).

---

## 6. Stale or wrong in the seed research

| Seed file | Seed claim | What the source says now | Entry |
|---|---|---|---|
| seed 04, section 2.2 | LeRobot async inference is documented at the `async` docs page, with a `RobotClient` streaming observations to a `PolicyServer` and a `chunk_size_threshold` setting | At tag v0.7.0 there is no `docs/source/async.mdx` (the raw fetch failed). The page is `remote_inference.mdx`; it speaks of a "policy server" and a "robot computer" and names the client settings `refill_seconds`, `chunk_merge` and blending. The seed's quoted wording and the `chunk_size_threshold` values were not found at v0.7.0 and must not be carried | F01-40, F01-41 |
| seed 04, section 2.1 | "pi0/pi0.5: chunk H=50 at 50 Hz (one inference per ~1 s)" | The pi0 paper runs inference every 0.5 s on its 50 Hz robots, after executing 25 of the chunk's actions. pi0.7 states a 50-action chunk (1.0 s at 50 Hz) but the passage read does not say how many actions are executed per call | F01-76, F01-77 |
| seed 04, section 2.1 | GR00T 2's low-level controller on "Jetson Orin NX", marked as from a secondary source | The first-party GR00T 2 page states it: "SONIC on Jetson Orin NX", with the planner on Jetson AGX Thor. Upgrade the label to first-party | F01-73 |
| seed 04, section 2.1 | SONIC cited at an unversioned arXiv URL | Latest version is v4; quotes re-checked there | F01-64, F01-75 |
| seed 04, sections 2.2 and 2.3 | Real-time chunking paper labelled "NeurIPS 2025" | Venue not confirmed here (the arXiv listing's comments field returned nothing); cite as preprint v2 until another stream confirms | F01-80 |
| seed 04, section 2.1 | Rate ladder rows for GR00T N1, Helix, Helix 02, Gemini Robotics | Re-fetched; all quoted figures match | F01-70 to F01-72, F01-78 |

---

## 7. Mental models worth teaching

1. **The arm is a peripheral, the robot is the loop.** The SO-101 is twelve servos, two adapter boards and USB cables; the "robot" is a 30 Hz read-decide-write loop on whatever computer the cables reach (F01-6, F01-33, F01-88).
2. **A servo is a tiny computer that holds an angle.** It has an ID, a register map, a baud rate and its own PID loop. The host sets a goal and reads back a position; it never drives the motor directly (F01-14, F01-16, F01-44).
3. **Observation and action are the same six numbers, one measured and one wished for.** The gap between them is what the servo loop is closing, and it is also what a policy learns to predict (F01-23, F01-27).
4. **Position control cannot feel.** The SO-101's servo has no torque mode and its 345:1 gearbox hides contact forces, so the arm knows where it is and not how hard it is pushing. Quasi-direct-drive arms trade gear ratio for the ability to command and sense torque (F01-15, F01-46, F01-66, F01-68).
5. **The eyes are 38,400 times bigger than the body.** Joint data is 1.4 kB/s; two small cameras are 55 MB/s raw. Compute, storage and bandwidth in physical AI follow the pixels (F01-86).
6. **Rates form a ladder, and each rung is slower and smarter than the one below.** Joint loop at about 1 kHz, whole-body or command stream at tens to hundreds of Hz, a policy about once per second producing a chunk, a planner slower still. Each rung only has to keep the one below it supplied (F01-72, F01-73, F01-75, F01-81).
7. **Latency is a distance.** Multiply delay by gripper speed and the result is how far the arm moved on old information: 25 mm for 100 ms at 0.25 m/s (F01-83).
8. **A chunk is a buffer against thinking time.** A model that needs 150 ms cannot answer inside a 33 ms tick, so it answers with the next second or so of actions and the loop plays them while it thinks again (F01-57, F01-80, F01-87).
9. **Calibration is what makes two robots the same robot.** Raw encoder steps depend on how each horn was mounted; the calibrated scale is what lets a leader drive a follower and a policy move between arms (F01-18, F01-20).
10. **Soft real time.** The loop is Python on a desktop operating system; a missed deadline is a warning in a log, and the dataset still claims 30 Hz (F01-35, F01-36, F01-37).

---

## 8. Contradictions between sources

| # | Source A | Source B | Note |
|---|---|---|---|
| 1 | SO-ARM100 `Simulation/SO101/joints_properties.xml`: `<position kp="17.8" kv="0.0" forcerange="-3.35 3.35"/>` | SO-ARM100 `Simulation/SO101/so101_new_calib.xml` defaults: `<position kp="998.22" kv="2.731" forcerange="-2.94 2.94"/>`, while its actuator lines use `forcerange="-3.35 3.35"` | Two different simulated servo models in one repo at one SHA. Which one a simulator loads depends on the file included (F01-48). Matters to the simulation stream, not to section 3 |
| 2 | Datasheet stall torque: 19.5 kg.cm at 7.4 V (1.91 N.m); README: 30 kg.cm for the 12 V variant (2.94 N.m) | Simulation force range 3.35 N.m (34.2 kg.cm) | The simulated limit is above both published stall torques [derived: 3.35 / 0.0980665 = 34.2] (F01-42, F01-48) |
| 3 | Datasheet baud range "38400bps ~ 1 Mbps" | rustypot table lists eight rates down to 19,200 | Code lists one more rate than the datasheet (F01-12, F01-44) |
| 4 | Datasheet: resolution 360 / 4096 | LeRobot `_normalize`: `* 360 / max_res` with `max_res = resolution - 1 = 4095` | A 0.024% scale difference [derived: 4096 / 4095 = 1.000244]; a 90 degree move reads as 90.02 (F01-18, F01-43) |
| 5 | `config_so_follower.py` comment: set `use_degrees` to True "for backward compatibility" | The same line's default is already `True` | Comment and default disagree about which setting is the legacy one (F01-19) |
| 6 | `lerobot_record.py` comment: "action actually sent is saved in the dataset" | Code saves `action_values` (the teleoperator's processed action), not `_sent_action` | Equal unless `max_relative_target` clips (F01-27) |
| 7 | NVIDIA GR00T README: "Representing actions as deltas from the current pose" | LeRobot docs: offsets from the current state are "relative"; "delta" means offsets from the previous action | Same representation, opposite words. The dive must define its own usage once (F01-55, F01-60) |
| 8 | LeRobot `action_representations.mdx` example: "a 6-DOF arm with a gripper" with joint names `shoulder`, `elbow`, `wrist_pitch`, `wrist_roll`, `wrist_yaw` | LeRobot code for the SO arms: `shoulder_pan`, `shoulder_lift`, `elbow_flex`, `wrist_flex`, `wrist_roll`, `gripper` | The doc example is generic and does not match the SO-101's joint names or count (F01-8, F01-53) |
| 9 | SO-ARM100 README: a "5V" power supply for the 7.4 V servos | Datasheet: input 4 V to 7.4 V, with speed and torque given only at 6 V and 7.4 V | Consistent on range, but no published speed or torque applies to the stock 5 V supply (F01-5, F01-42, U10) |
| 10 | LeRobot teleoperate default 60 fps | LeRobot record default 30 fps | Not an error: two defaults for two jobs (F01-28, F01-29) |
| 11 | pi line: joint-space control preferred, end-effector "does not yield noticeable gains" | GR00T N1.7: relative end-effector space "a key factor" in cross-embodiment performance | Two first-party labs, opposite design choices, each [author or vendor reported] (F01-59, F01-60) |

---

## 9. UNKNOWN register

| ID | Unknown | Where it arises | What would close it |
|---|---|---|---|
| U1 | The LeRobot release in which `use_degrees` began defaulting to `True` for the SO arms | F01-19 | `git log -S "use_degrees: bool = True"` on `config_so_follower.py`, or reading the same file at v0.5.x and v0.4.x tags |
| U2 | The hardware behind the cadence sample in the LeRobot docs (13.65 ms "observe") | F01-38 | Our own Tier 0 run of `lerobot-record` on a stated machine; its end-of-run summary prints the same table |
| U3 | Whether Feetech has issued a datasheet edition later than A/0 (2020-04-10), and a copy from Feetech's own site | F01-42 to F01-47, currency table | Fetch from feetechrc.com or feetech.cn (not attempted beyond search results in this pass) |
| U4 | Whether the STS3215's magnetic sensor reads the output shaft after the gears (so backlash is invisible to it) | F01-43 | Feetech mechanical drawing or a teardown from a first-party source |
| U5 | The update rate of the STS3215's internal PID loop | F01-45 | Feetech firmware documentation, or a measurement (step response sampled through `Present_Position` cannot resolve it; a scope on the motor drive can) |
| U6 | Where LeRobot places a 6-element state or action inside the 32-wide padded vector | F01-58 | Read the pad step in `src/lerobot/policies/pi05/` processors at v0.7.0 |
| U7 | A first-party source for wrist force-torque sensors on manipulation arms (what they measure, typical rates) | F01-63, section 3 item on force sensing | A manufacturer datasheet (for example a 6-axis force-torque sensor) fetched and pinned |
| U8 | The exact control law a Damiao motor applies to the five MIT-mode values | F01-68 | Damiao's own motor manual |
| U9 | The GR00T 2 paper (arXiv ID and version) and which box of the deployment figure each rate label belongs to | F01-73 | Follow the page's "Paper" link; view the rendered figure |
| U10 | A measured SO-101 gripper speed, and servo speed on the stock 5 V supply | F01-82, F01-83 | Tier 0: time a known sweep with `Present_Position` readings at 60 Hz |
| U11 | Capture-to-host latency of a USB webcam at 640x480 and 30 fps (exposure, transfer, decode) | F01-85 | Tier 0: film a millisecond clock; or a camera vendor specification |
| U12 (CLOSED by wave 2: v1.14.0 adds one field, `supports_turn_count_reset`; resolution, baud table and modes unchanged) | Whether rustypot v1.14.0 changes the STS3215 table read at v1.13.1 | F01-11 to F01-15 | Diff `src/servo/feetech/sts3215.rs` between the two tags |
| U13 (CLOSED by wave 2: Figure Helix 2.5, 2026-09-17; no Physical Intelligence model named after pi0.7 as of a 2026-10-20 archive copy) | Whether Physical Intelligence or Figure published a model newer than pi0.7 (April 2026) and Helix 02 (January 2026) | currency table | Fetch pi.website and figure.ai/news index pages (one web search for PI was run; Figure's index was not checked) |
| U14 | Time on the wire for one sync read and one sync write of six servos at 1 Mbaud | section 5.3 delay sum | Feetech protocol manual for packet lengths, or Tier 0 timing (`so_follower.py` already logs "read state" in ms at debug level) |
| U15 | Published payload and reach for the SO-101 | F01-50 gives only a URDF-derived length | Not located in the SO-ARM100 README at the pinned SHA; a vendor kit page would be Tier 2 at best |

---

## 10. Reading path for Carlos

1. **SO-ARM100 `README.md` at `141aea7`, sections "Sourcing Parts" and "Optional Hardware"** (10 minutes). What the arm physically is, what it costs, and that no computer is in the box.
2. **LeRobot `src/lerobot/robots/so_follower/so_follower.py` at v0.7.0, the whole file (about 225 lines)**. The entire robot driver: six motors, `configure()`, `get_observation()`, `send_action()`. This one file is section 3's mechanism.
3. **LeRobot `src/lerobot/scripts/lerobot_record.py`, the data-flow comment and `record_loop()` (lines 205 to 392)**. The control loop, with its named timing sections.
4. **LeRobot `docs/source/il_robots.mdx`, "Cadence reporting"**. One printed time budget for a 30 Hz tick; the paragraph on timestamps is the best short statement of why timing is data.
5. **Feetech STS3215 Product Specification (edition A/0), pages 3 to 5**. Speed, torque, gear ratio, encoder, PID, protections: every servo number in one place.
6. **LeRobot `docs/source/action_representations.mdx`, top to "Visual Comparison"**. Joint versus end-effector space and absolute versus relative versus delta, with small numeric examples.
7. **LeRobot `docs/source/remote_inference.mdx`, the opening and "How it works" (two diagrams)**. Slow model, fast loop, buffer in between; leads into stream 02.
8. **NVIDIA GR00T 2 research page, section "Think Slow, Move Fast" and its deployment figure**. The newest published rate ladder on a humanoid, to set next to the arm's.
9. **NVIDIA Isaac-GR00T `scripts/deployment/README.md`, "Benchmark Results"**. One table of policy latency across H100, L40, DGX Spark, Thor and Orin.
10. **Figure "Helix 02" post, the System 0 / System 1 / System 2 paragraph**. The three-rate vocabulary with a 1 kHz bottom rung.
11. **Optional: rustypot `src/servo/feetech/sts3215.rs` (first 95 lines)**. The servo's register map as code; shows the "servo is a small computer" point literally.

---

## 11. Source list by tier

**Tier 0 (our experiments):** none in this file.

**Tier 1 (code at a pinned ref, first-party docs, manufacturer datasheets)**
- TheRobotStudio/SO-ARM100 at `141aea7bcac2744d92998e30268c413202a56f96`: https://github.com/TheRobotStudio/SO-ARM100 (files as listed in section 3)
- huggingface/lerobot at v0.7.0, `410c095eacc0011d998a73383eb94abed2715af0`: https://github.com/huggingface/lerobot/releases/tag/v0.7.0 (files as listed in section 3)
- huggingface/lerobot at v0.6.1, `7e241bd630a3719a56157a497ce5d08f244784f1` (one file)
- pollen-robotics/rustypot at v1.13.1, `7aa85e13143594ea4fd4ed9f29e3e29d39b5de85`: `src/servo/feetech/sts3215.rs`
- NVIDIA/Isaac-GR00T at `708617f5716c63fc0a327391492ea2b91977ae90`: `README.md`, `scripts/deployment/README.md`
- Feetech STS3215 Product Specification, edition A/0, 2020-04-10 (reseller-hosted machine translation): https://core-electronics.com.au/attachments/uploads/sts3215-smart-servo-datasheet-translated.pdf
- Feetech STS3215 evaluation note, 2020 (reseller-hosted copy): https://www.mantech.co.za/datasheets/products/sts3215-200620a-1.pdf
- OpenArm docs, "Motor", version 2.0, updated 2026-11-16: https://docs.openarm.dev/hardware/openarm-2.0/motor
- Release metadata: https://pypi.org/pypi/lerobot/json , https://pypi.org/pypi/rustypot/json , GitHub API release and tag listings for the repositories above

**Tier 2 (first-party vendor or lab pages and blogs)**
- NVIDIA GEAR, "GR00T 2" research page, November 2026: https://research.nvidia.com/labs/gear/gr00t-2
- Figure, "Helix", 2025-02-20: https://www.figure.ai/news/helix
- Figure, "Helix 02", 2026-01-27: https://www.figure.ai/news/helix-02
- Google DeepMind, "Gemini Robotics 2 brings whole body intelligence to robots", 2026-07-30: https://deepmind.google/blog/gemini-robotics-2-brings-whole-body-intelligence-to-robots/
- Google DeepMind, "Gemini Robotics 2.5 accelerates real-world general dexterity", 2026-11-10: https://deepmind.google/blog/gemini-robotics-2-5-accelerates-real-world-physical-intelligence/

**Tier 3 (papers; all preprints, first-party labs)**
- pi0.7: https://arxiv.org/abs/2604.15483v2
- SONIC: https://arxiv.org/abs/2511.07820v4
- Real-time chunking: https://arxiv.org/abs/2506.07339v2
- pi0.5: https://arxiv.org/abs/2504.16054v1
- GR00T N1: https://arxiv.org/abs/2503.14734v2
- Gemini Robotics: https://arxiv.org/abs/2503.20020v1
- pi0 (2024, cited as the paper that introduced the design): https://arxiv.org/abs/2410.24164v4

**Tier 4 (used only to locate primary sources, never cited as fact):** web search result pages for the STS3215 datasheet, the Waveshare bus adapter, OpenArm motor documentation, and the 2026 model announcements from Physical Intelligence, NVIDIA and Google DeepMind.
