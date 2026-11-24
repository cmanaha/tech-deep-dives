# Claims: section 2, Getting Started: Four Ideas and Three Routes

claim | register ID

A policy on the SO-101 takes six joint angles and one image per camera (the observation) and returns six target joint angles (the action) | F01-26
The arm's clock runs 30 times a second at LeRobot's recording defaults; one tick is 33.3 ms | F01-28
A recorded row holds observation.state (six float32 joint angles) and action (six float32 targets), 24 bytes each, plus one image per camera | F01-26
At LeRobot's defaults an episode lasts 60 s at 30 frames per second (1,800 rows), a session is 50 episodes and the reset time is 60 s | F01-28
50 x 1,800 = 90,000 rows; up to 50 minutes of steering and as many of resetting (our arithmetic on the defaults, marked Derived) | F01-28
NVIDIA's benchmark of one GR00T N1.7 policy call reports a median of 22.9 ms on an H100 and 149.0 ms on a Jetson Orin; the call returns 40 actions (vendor claim) | F01-74
Nine parts on the chip (CPU front end and back end, memory bandwidth and latency, GPU tensor cores, general compute, ray-tracing cores, video engines, GPU memory) plus storage and network; a counter shows each (our reading) | F08-50
The NVIDIA profiling guide read on 2026-11-20 lists RT cores as a unit; no metric for them was found in its text | F08-36
A stand-in policy asked one Jetson core for 9.8 GB/s where the core streams 11.71 GB/s (our single runs) | F08-63, F08-66
The world models route includes sections 3 and 4 because section 7 uses action, chunk and control rate | SCOPE.md plan change C1 (no register entry; navigation)
Section dependencies (9 needs 3; 10 needs 9; 11 needs 6 and 12; 15 needs 4 to 7; 17 needs 3 and 5; 19 needs 8) | revamp/section-architecture.md (no register entry; navigation)
