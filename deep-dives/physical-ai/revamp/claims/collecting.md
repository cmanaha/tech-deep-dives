# Claims: section 9, Collecting Data

claim | register ID

One command, lerobot-record, stores the follower's joint readings, the commanded targets and the camera frames of each episode | F05-1
Recorder defaults: 30 frames per second, 60 s per episode, 60 s reset, 50 episodes, upload to the hub on | F05-2
At the defaults a session is 50 x (60 + 60) s = 100 minutes of operator time for at most 50 minutes of data; half is resets (derived inside the entry) | F05-2
LeRobot suggests at least 50 episodes, 10 per object location, cameras fixed, object visible; advice, not a measured threshold | F05-5
A hand-held rig: a person holds a gripper with a camera on it, software reconstructs the gripper's path from the video and the camera's motion sensor; UMI (2024) started the line | F05-7
UMI authors report 3 people, 1,400 demonstrations, 12 person-hours, 30 locations (1,400 / 12 = 117 per person-hour), more than 3 times faster than teleoperation on that task | F05-8
A rig records a gripper path (an end-effector action in section 3's terms) that must be converted into joint angles; a leader arm records joint targets for its paired follower (our reading, unlabelled in prose) | F05-7, F05-23
HiFi-UMI-2K (July 2026): hand-held rig for two hands, six synchronised cameras; public release is a curated 2,000-hour subset of more than 20,000 hours; 16.0 TB in LeRobot format | F05-10
A second collection mode records corrections: the policy drives, a person takes over before a failure, the recovery is saved as training data | F05-6
Plain demonstrations contain no recoveries (cross-reference to section 4) | F05-6
A dataset has three kinds of content: tabular signals in Parquet, camera frames in MP4, metadata as JSON and Parquet | F05-17
The format version at LeRobot v0.7.0 is v3.0 | F05-16
Every frame row carries five bookkeeping columns: timestamp, frame_index, episode_index, index, task_index | F05-22
A two-camera arm row holds action (6 float32) and observation.state (6 float32); camera features have dtype video, pixels are in the MP4 files | F05-23
On-disk paths: meta/info.json, meta/stats.json, meta/tasks.parquet, meta/episodes/chunk/file.parquet, data/chunk/file.parquet, videos/camera/chunk/file.mp4 (diagram 9.1) | F05-18, F05-29
Many episodes share one file; the writer appends to the current MP4 until the size target, then starts the next file; the docs give this as how the format scales to millions of episodes; version 2 stored one file per episode | F05-19
To read a frame the reader adds the row's timestamp to the episode's from_timestamp for that camera and asks the decoder for that time (toy numbers 55.7, 45, 1.5, 57.2 are labelled invented) | F05-25
A timestamp is the frame index over the nominal rate, with no clock read; a loop that ran at 25 Hz yields a dataset that claims 30 and plays back faster; the recorder reports the achieved rate per kept episode | F05-4
When a chunk directory holds its 1,000th file the file index returns to 0 and the chunk index goes up by one | F05-21
A v2.1 dataset is refused at load with a message naming convert_dataset_v21_to_v30, which merges per-episode files and writes offsets | F05-28
Skipping dataset.finalize() leaves corrupt Parquet files (footer metadata unwritten); lerobot-record calls it after the last episode and before the upload | F05-3
One metadata row per episode: data file, first and last row, per camera the video file and start and end time | F05-24
Size defaults at v0.7.0: 100 MB per data Parquet file, 200 MB per video file, 1,000 files per chunk directory; the example dataset records 500 MB | F05-20
The example dataset lerobot/svla_so101_pickplace: 50 episodes, 11,939 frames at 30 fps, two 640x480 cameras, nine files, 86.1 MB | F05-29
The dataset is named for the SO-101 and its info.json records robot_type so100_follower; one follower class serves both arms | F05-29 (wave 3 line), F05-23
File sizes: 45.5 MB, 40.1 MB, 0.37 MB, 72,560, 5,914, 3,401 and 2,246 bytes | F05-29
6.6 minutes of robot time; video 85,666,122 bytes over 11,939 x 2 camera frames; about 775 MB per robot-hour for two cameras, about 387 MB per camera-hour; 3,588 bytes per camera frame; 921,600 bytes raw; about 257 to 1; 199 GB per hour uncompressed; joint data 31 bytes per row, 3.3 MB per hour; mean episode 7.96 s (derived) | F05-30
The repository is nine files; the table lists the seven under videos/, data/ and meta/ | F05-29
The example's info.json does not record the encoder settings behind its bytes; the figures are an example, not a constant | F05-29, F05-30
Inter-frame compression: keyframes stored whole, later frames as differences; to return a frame the decoder loads the preceding keyframe and decodes up to the requested frame | F05-37
GOP size g: a keyframe every g frames | F05-36
A policy requests a few frames at random places, unlike a film watched in order | F05-64
GOP 2: at most 2 decoded frames per requested frame; GOP 250 (illustration): worst case 250, average about 125 (derived inside the entry) | F05-37
Recording defaults at v0.7.0: libsvtav1 (SVT-AV1 software encoder), GOP 2, CRF 30; lower CRF means better quality and larger files | F05-35
Default path writes PNG frames and encodes after the episode; streaming encoding encodes during capture on the CPU | F05-44
Two 640x480 cameras at 30 fps are 18.4 million pixels per second; the docs label it 55M (three colour channels) and rate it "Low"; two 1920x1080 cameras are 124 million pixels per second, 373M in the docs' count, rated "High", "Requires powerful high-end CPU"; frames are dropped when the encoder falls behind; about 5% missing reads as an overloaded system | F05-45
Recording loads CPU cores; disk under 1 GB per hour; no GPU work at the defaults; no CPU-utilisation figure for the 640x480 row located in the sources read 2026-11-20 (our reading entry) | F05-105
The tutorial's record command sets streaming encoding on | F05-1
The Jetson Orin Nano has no hardware video encoder; encoding costs CPU time on its six Arm cores | F05-57
Jetson Thor modules have H.264 and HEVC hardware encoders and no AV1 encode | F05-55
LeRobot's docs state software h264 gives files "~30-50% larger" at medium CPU use; hardware encoders give the largest files at very low CPU use | F05-43
LeRobot lists six hardware encoders, all H.264 or HEVC, none AV1; vcodec=auto picks the first available and falls back to libsvtav1 | F05-42
The docs say libsvtav1 is the default "because it provides the best training performance"; other codecs "can reduce CPU usage and be faster, but they typically produce larger files and may affect training time" | F05-43
libsvtav1 is rated the most CPU-intensive encoder by LeRobot's docs | F05-43
History (2024 benchmark): AV1 at GOP 2 and CRF 30 gave 5.59% of the image size and 0.48 times the load time on a 480x640 dataset, six consecutive frames; H.264 2.14% and H.265 1.38% at the same nominal settings; the directory is absent at v0.7.0 | F05-63
The default was picked for decode behaviour at a small GOP (our reading); a CRF of 30 is a different quality in each codec, so the docs' "Smallest" and the benchmark can both hold (register 05, section 8) | F05-63, F05-43
The example dataset's info.json records video.codec av1 | F05-23
