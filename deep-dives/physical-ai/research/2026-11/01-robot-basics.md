# 01 Robot basics: research register

## 1. Header

- **Research date:** 2026-11-20. Every URL in this file was accessed 2026-11-20.
- **Area:** stream 01 of the "Physical AI" dive. The robot as a computer: the SO-101 arm as the concrete case, its servos, sensors, action space, the LeRobot software that drives it, control rates from the servo loop up to a vision-language planner, and why latency is a physical quantity.
- **Sections fed:** section 3, "The Robot as a Computer". Entries on action chunking and on VLA outputs are pointers only; stream 02 owns them.
- **Seed research:** none for this stream. The rate ladder in seed 04 section 2.1 was re-fetched source by source before anything was carried (group H).
- **Reader:** knows computers (IT or software), has no robotics background.
- **Quote policy:** quotes are verbatim from the pinned version, with house normalisation: curly quotes become straight quotes, typographic dashes become " - " or a hyphen. Ellipses mark omissions. Code is quoted with its file and line numbers at the pinned ref.
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

(Filled in as each item is fetched; see the end of this section for items still open.)

| Item | Newest version found | Release date | Source | What the seed research named |
|---|---|---|---|---|
| LeRobot (huggingface/lerobot) | v0.7.0, tag commit `410c095eacc0011d998a73383eb94abed2715af0` | 2026-11-05 (GitHub release published 2026-11-05T17:13:20Z; PyPI upload 2026-11-05T17:13:33) | https://github.com/huggingface/lerobot/releases/tag/v0.7.0 and https://pypi.org/pypi/lerobot/json | 0.7.0 seen on one machine. Confirmed as the newest release. Prior releases: v0.6.1 (2026-08-03), v0.6.0 (2026-07-06), v0.5.1 (2026-04-07), v0.5.0 (2026-03-09) |
| SO-ARM100 repository (TheRobotStudio/SO-ARM100), home of the SO-101 design | default-branch head `141aea7bcac2744d92998e30268c413202a56f96` | commit dated 2026-11-20T15:10:12Z | https://github.com/TheRobotStudio/SO-ARM100 (read at that SHA) | not named with a SHA |
| SO-ARM100 tagged release | v0.1.1 | 2024-05-17 | `gh api repos/TheRobotStudio/SO-ARM100/releases` | not named. The only tagged release predates the SO-101; the repo is consumed at head, so the SHA above is the pin |

## 3. Pinned sources

**Code (tag and 40-character SHA)**

| Repository | Ref | SHA | Files read | Entries |
|---|---|---|---|---|
| TheRobotStudio/SO-ARM100 | default-branch head, 2026-11-20 | `141aea7bcac2744d92998e30268c413202a56f96` | `README.md`, `CHANGELOG.md`, `Simulation/SO101/README.md`, `Simulation/SO101/so101_new_calib.urdf`, `Simulation/SO101/so101_new_calib.xml`, `Simulation/SO101/joints_properties.xml` | group A |
| huggingface/lerobot | v0.7.0 | `410c095eacc0011d998a73383eb94abed2715af0` | see group B onward | groups B to G |

Raw-file URL pattern used for every code quote: `https://raw.githubusercontent.com/<owner>/<repo>/<sha>/<path>`.

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

