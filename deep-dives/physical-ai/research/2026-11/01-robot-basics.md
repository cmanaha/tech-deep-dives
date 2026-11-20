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

