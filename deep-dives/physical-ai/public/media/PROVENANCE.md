# Media provenance

Every file in this folder, with what made it. Captured 2026-11-20 for the Physical AI dive.

## SO-101 in MuJoCo (all `so101-*` files)

- **Software:** MuJoCo 4.0.1 (Python package `mujoco` 4.0.1 from PyPI), offscreen OpenGL renderer
  (`mujoco.Renderer`), on a Mac (Apple silicon). Video encoded with FFmpeg (VP9 in WebM, H.264 in MP4), no audio.
- **Arm model:** `Simulation/SO101/so101_new_calib_camera.xml` and its meshes from the TheRobotStudio/SO-ARM100
  repository at commit `141aea7bcac2744d92998e30268c413202a56f96` (Apache License 2.0). The model was not edited.
- **Added by this dive at load time:** the table plane, the block (a 2.5 cm cube, 20 g), the cup (a ring of wall
  segments fixed to the table), lights, and three cameras: a three-quarter scene camera, an overhead camera and a
  camera fixed to the gripper body near the model's wrist camera mount. Solver settings changed for the grasp:
  elliptic friction cone, `impratio` 10, 5 no-slip iterations, block friction 3.0.
- **Motion:** scripted, not a learned policy. Waypoints in Cartesian space, damped least-squares inverse
  kinematics on the gripper frame with the approach axis held vertical, position targets sent to the model's
  position actuators at 50 Hz, physics timestep 2 ms.
- **Scripts and data:** `research/experiments/E-mujoco-captures-2026-11-20/` (`so101_scene.py`,
  `make_captures.py`, `captures.json`, `so101-pick-place-joints.json`).
- **Licence of the captures:** made for this dive; the arm geometry shown is Apache-2.0 licensed by its authors.

| File | What it shows |
|---|---|
| `so101-scene.jpg` | The scene: arm, block, cup, as the gripper descends on the block |
| `so101-pick-place.webm`, `.mp4`, `-poster.jpg` | One scripted pick and place, 8.2 s at 25 frames per second, 720 x 480 |
| `so101-policy-views.webm`, `.mp4`, `-poster.jpg` | The same episode from the overhead and wrist cameras side by side, 480 x 360 each: the two image streams a policy would receive |
| `so101-episode-strip.jpg` | Six moments of the episode from the scene camera |
| `so101-contact.jpg` | The grasp, close up, bodies transparent, with the contact points and contact force arrows MuJoCo draws |
| `so101-render-passes.jpg` | One overhead frame as colour, depth and per-body segmentation |
| `so101-domain-randomisation.jpg` | Six randomised variants of the scene from the overhead camera: floor colour, light position and strength, object colours and positions, camera offset, arm tint |
| `so101-eval-grid.jpg` | Twelve replays of the same scripted motion with the block's start moved by up to 12 mm on each axis; green border where the block ended in the cup (8 of 12), red where it did not |

## Slots waiting for the owner's recordings

- Isaac Sim capture of the SO-101 scene, to be recorded on our own machines.
- Camera footage from the real arms.

No third-party image is redistributed in this folder.
