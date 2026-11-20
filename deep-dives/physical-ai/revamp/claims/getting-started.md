# Claims: section 2, Getting Started

claim | register ID

A policy on the SO-101 takes six joint angles and one image per camera and returns six target joint angles | F01-26
The robot's clock runs 30 times a second at LeRobot's recording defaults | F01-28
A recorded frame holds observation.state (six float32 joint angles), action (six float32 targets) and one image per camera | F01-26
At LeRobot's defaults an episode runs for 60 s at 30 frames per second, 1,800 rows for a full-length episode | F01-28
NVIDIA's benchmark of one GR00T N1.7 policy call reports a median of 22.9 ms on an H100 and 149.0 ms on a Jetson Orin (vendor claim) | F01-74
The machine's parts (CPU cores, memory, GPU tensor cores, ray-tracing cores, video engines, storage and network; nine parts on the chip in section 20) are the dive's own grouping (our reading) | F08-50
The world models route includes sections 3 and 4 because section 7 uses action, chunk and control rate | SCOPE.md plan change C1 (no register entry; navigation)
Section dependencies (9 needs 3; 10 needs 9; 11 needs 6 and 12; 15 needs 4 to 7; 17 needs 3 and 5; 19 needs 8) | revamp/section-architecture.md (no register entry; navigation)
