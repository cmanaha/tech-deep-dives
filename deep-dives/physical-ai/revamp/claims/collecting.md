# Claims: section 9, Collecting Data

claim | register ID

One command, lerobot-record, stores the follower's joint readings, the commanded targets and the camera frames of each episode | F05-1
Recorder defaults: 30 frames per second, 60 s per episode, 60 s reset, 50 episodes, upload to the hub on | F05-2
At the recorder's defaults a session is 50 x (60 + 60) s = 100 minutes of operator time, half of it resets, for at most 50 minutes of data (derived inside the entry; the h2 title keeps "at the recorder's defaults") | F05-2
LeRobot suggests at least 50 episodes, 10 per object location, cameras fixed, object visible; advice, not a measured threshold | F05-5
A hand-held rig: a person holds a gripper with a camera on it, software reconstructs the gripper's path from the video and the camera's motion sensor; UMI (2024) started the line | F05-7
UMI authors report 3 people, 1,400 demonstrations, 12 person-hours, 30 locations (1,400 / 12 = 117 per person-hour), more than 3 times faster than teleoperation on that task; gathered in places no robot was carried to (a rig has no robot, F05-7) | F05-8, F05-7
A rig records a gripper path (an end-effector action in section 3's terms) that must pass through inverse kinematics, which takes a kinematic model of the arm (section 3's claim), before an arm can follow it; a leader arm records joint targets its paired follower takes with no kinematic model (section 3 builds both terms) | F05-7, F05-23
HiFi-UMI-2K (July 2026): hand-held rig for two hands, six synchronised cameras; public release is a curated 2,000-hour subset of more than 20,000 hours; 16.0 TB in LeRobot format | F05-10
16.0 TB / 2,000 h = 8 GB per hour over six cameras, about 1.3 GB per camera-hour (derived inside F05-10), more than three times the example's 387 MB per camera-hour, so a camera-hour figure from one dataset does not size another | F05-10, F05-30
A second collection mode records corrections: the policy drives, a person takes over before a failure, the recovery is saved as training data | F05-6
Plain demonstrations contain no recoveries (cross-reference to section 4) | F05-6
A dataset has three kinds of content: tabular signals in Parquet, camera frames in MP4, metadata as JSON and Parquet | F05-17
The format version at LeRobot v0.7.0 is v3.0 | F05-16
Every frame row carries five bookkeeping columns: timestamp, frame_index, episode_index, index, task_index | F05-22
A two-camera arm row holds action (6 float32) and observation.state (6 float32); camera features have dtype video, pixels are in the MP4 files, so a training sample is a row plus the decoded frames each camera contributes | F05-23
On-disk paths: meta/info.json, meta/stats.json, meta/tasks.parquet, meta/episodes/chunk/file.parquet, data/chunk/file.parquet, videos/camera/chunk/file.mp4 (diagram 9.1) | F05-18, F05-29
Many episodes share one file; the writer appends to the current MP4 until the size target, then starts the next file; version 2 stored one file per episode, so at the millions of episodes the docs design for it meant millions of files | F05-19
File count follows bytes: at 387 MB per camera-hour, two video files at the 200 MB target of v0.7.0, however many episodes the hour holds | F05-20, F05-30
To read a frame the reader adds the row's timestamp to the episode's from_timestamp for that camera and asks the decoder for that time (toy numbers 55.7, 45, 1.5, 57.2 are labelled invented) | F05-25
A timestamp is the frame index over the nominal rate, with no clock read; a loop that ran at 25 Hz yields a dataset that claims 30, its motion 30 / 25 = 1.2 times faster than the person made it (Derived), which is the motion a policy trained on it copies (section 4's copying); the recorder reports the achieved rate per kept episode; discard a session whose rate is off (entry's use line) | F05-4
After 1,000 files in a chunk directory the writer starts the next directory | F05-21
A v2.1 dataset is refused at load with a message naming convert_dataset_v21_to_v30, which merges per-episode files and writes offsets | F05-28
Skipping dataset.finalize() leaves corrupt Parquet files (footer metadata unwritten); lerobot-record calls it after the last episode and before the upload | F05-3
One metadata row per episode: data file, first and last row, per camera the video file and start and end time | F05-24
Size defaults at v0.7.0: 100 MB per data Parquet file, 200 MB per video file, 1,000 files per chunk directory; the example dataset records 500 MB | F05-20
The example dataset lerobot/svla_so101_pickplace: 50 episodes, 11,939 frames at 30 fps, two 640x480 cameras, nine files, 86.1 MB | F05-29
The dataset is named for the SO-101 and its info.json records robot_type so100_follower, a value LeRobot uses for both the SO-100 and SO-101, so the files do not prove which arm recorded it (register 05 section 8, item 5) | F05-29 (wave 3 line), F05-23
File sizes: 45.5 MB, 40.1 MB, 0.37 MB, 72,560, 5,914, 3,401 and 2,246 bytes | F05-29
6.6 minutes of robot time; video 85,666,122 bytes over 11,939 x 2 camera frames; about 775 MB per robot-hour for two cameras, about 387 MB per camera-hour; 3,588 bytes per camera frame; 921,600 bytes raw; about 257 to 1; 199 GB per hour uncompressed; joint data 31 bytes per row, 3.3 MB per hour; mean episode 7.96 s (derived) | F05-30
Seven of the repository's nine files hold the data (the table lists them) | F05-29
The example's info.json does not record the compression settings behind its bytes; size disk as cameras x hours x a camera-hour figure weighed on your own first episode | F05-29, F05-30
Inter-frame compression: keyframes stored whole, later frames as differences; to return a frame the decoder loads the preceding keyframe and decodes up to the requested frame | F05-37
GOP size g: a keyframe every g frames | F05-36
Training (the data loader) requests a few frames at random places, unlike a film watched in order | F05-64
GOP 2: at most 2 decoded frames per requested frame; GOP 250 (illustration): worst case 250, average about 125 (derived inside the entry) | F05-37
Recording defaults at v0.7.0: libsvtav1 (SVT-AV1 software encoder), GOP 2, CRF 30; lower CRF means better quality and larger files | F05-35
Default path writes PNG frames and encodes after the episode; with streaming encoding on, the CPU encodes during capture, on the robot's clock | F05-44
Two 640x480 cameras at 30 fps are 18.4 million pixels per second; the docs label it 55M (three colour channels) and rate it "Low"; two 1920x1080 cameras are 124 million pixels per second, 373M in the docs' count, rated "High", "Requires powerful high-end CPU"; frames are dropped when the encoder falls behind; about 5% missing reads as an overloaded system | F05-45
Recording loads CPU cores; no GPU work at the defaults; in the sources read on 2026-11-20 the sizing stops at the docs' two ratings, with no CPU-utilisation figure for the 640x480 row (our reading entry) | F05-105, F05-45
The tutorial's record command sets streaming encoding on | F05-1
The Jetson Orin Nano has no hardware video encoder; every frame it records is encoded in software on the CPU | F05-57
Jetson Thor modules have H.264 and HEVC hardware encoders and no AV1 encode | F05-55
LeRobot's docs state software h264 gives files "~30-50% larger" at medium CPU use; hardware encoders give the largest files at very low CPU use | F05-43
LeRobot lists six hardware encoders, all H.264 or HEVC, none AV1; vcodec=auto picks the first available and falls back to libsvtav1 | F05-42
The docs say libsvtav1 is the default "because it provides the best training performance"; other codecs "can reduce CPU usage and be faster, but they typically produce larger files and may affect training time" | F05-43
libsvtav1 is rated the most CPU-intensive encoder by LeRobot's docs | F05-43
History (2024 benchmark): AV1 at GOP 2 and CRF 30 gave 5.59% of the image size and 0.48 times the load time on a 480x640 dataset, six consecutive frames; H.264 2.14% and H.265 1.38% at the same nominal settings; the directory is absent at v0.7.0 | F05-63
A CRF of 30 is a different quality in each codec, so the docs' "Smallest" and the benchmark (AV1 largest at the same nominal settings) can both hold (register 05, section 8); neither sizes the reader's disk | F05-63, F05-43
LeRobot chose AV1 "considering these results"; the docs' reason ("the best training performance") and the benchmark (AV1 won on load time, lost on size) point the same way; the percentages are against the benchmark's own original images on another dataset in 2024, so they rank codecs and do not size the reader's disk | F05-63, F05-43
The v0.7.0 defaults: two (codec, GOP) set the read trade, CRF sets quality against size | F05-35, F05-36
LeRobot decodes on CPU cores by default, and one random read there takes milliseconds: an open LeRobot pull request timed one random sample at about 5 ms (median, one process, warm file cache, hardware not stated) on a two-camera, 50-episode dataset; section 10 turns that time into data loader workers per GPU | F05-62, F05-39
LeRobot decodes on CPU cores by default, so CPU cores pay for every frame of GOP added | F05-39, F05-37
GOP trade: GOP 250's worst case is 250 / 2 = 125 times GOP 2's at most 2 decodes per random read (arithmetic on F05-37's numbers); more keyframes buy that read with a larger file; measure the size side by recording one episode at g = 2 and one at a long GOP | F05-37, F05-36
The example dataset's info.json records video.codec av1 | F05-23
"Encoder" means the video compressor from here to the end of section 11 (section 3 used it for the joint angle sensor) | F05-35
The still and the clip are MuJoCo renders of a simulated SO-101 (scripted motion), not frames of the public dataset; MuJoCo is the physics simulator of section 12 | capture provenance (Capture.tsx MUJOCO_SO101)
Had each of the public dataset's 50 episodes (7.96 s mean) been followed by the default 60 s reset, the session would take 50 x (7.96 + 60) s = 56.6 minutes for 6.6 minutes of data, about 12% (Derived); the reset is a setting, reset_time_s | F05-30, F05-2
Two 1920x1080 cameras carry 124 / 18.4 = 6.75 times the pixels of two 640x480 ones (Derived); the encode load follows the pixels | F05-45
Record one episode and check it first: achieved rate, missing frames, and your own ratio (episode video bytes over frames against 921,600 bytes raw) | F05-4, F05-45, F05-30
