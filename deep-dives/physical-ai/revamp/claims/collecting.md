# Claims: section 9, Collecting Data

claim | register ID

One command, lerobot-record, stores the follower's joint readings, the commanded targets and the camera frames of each episode | F05-1
Recorder defaults: 30 frames per second, 60 s per episode, 60 s reset, 50 episodes | F05-2
At the defaults a session is 50 x (60 + 60) s = 100 minutes of operator time for at most 50 minutes of data; half is resets (derived inside the entry) | F05-2
LeRobot suggests at least 50 episodes, 10 per object location, cameras fixed, object visible; advice, not a measured threshold | F05-5
A hand-held rig: a person holds a gripper with a camera on it, software reconstructs the gripper's path from the video and the camera's motion sensor; UMI (2024) started the line | F05-7
UMI authors report 3 people, 1,400 demonstrations, 12 person-hours, 30 locations, more than 3 times faster than teleoperation on that task | F05-8
A rig records a gripper path (an end-effector action in section 3's terms); a leader arm records joint targets for its paired follower (our reading) | F05-7, F05-23
HiFi-UMI-2K (July 2026): hand-held rig for two hands, six synchronised cameras; public release is a curated 2,000-hour subset of more than 20,000 hours; 16.0 TB in LeRobot format | F05-10
A dataset has three kinds of content: tabular signals in Parquet, camera frames in MP4, metadata as JSON and Parquet | F05-17
The format version at LeRobot v0.7.0 is v3.0 | F05-16
Every frame row carries five bookkeeping columns: timestamp, frame_index, episode_index, index, task_index | F05-22
A two-camera arm row holds action (6 float32) and observation.state (6 float32); camera features have dtype video, pixels are in the MP4 files | F05-23
On-disk paths: meta/info.json, meta/stats.json, meta/tasks.parquet, meta/episodes/chunk/file.parquet, data/chunk/file.parquet, videos/camera/chunk/file.mp4 (diagram 9.1) | F05-18, F05-29
Many episodes share one file; the writer appends to the current MP4 until the size target, then starts the next file | F05-19
One metadata row per episode: data file, first and last row, per camera the video file and start and end time | F05-24
Size defaults at v0.7.0: 100 MB per data Parquet file, 200 MB per video file, 1,000 files per chunk directory; the example dataset records 500 MB | F05-20
The example dataset lerobot/svla_so101_pickplace: 50 episodes, 11,939 frames at 30 fps, two 640x480 cameras, nine files, 86.1 MB | F05-29
The dataset is named for the SO-101 and its info.json records robot_type so100_follower; one follower class serves both arms | F05-29 (wave 3 line), F05-23
File sizes: 45.5 MB, 40.1 MB, 0.37 MB, 72,560, 5,914, 3,401 and 2,246 bytes | F05-29
6.6 minutes of robot time; about 775 MB per robot-hour for two cameras; 3,588 bytes per camera frame; 921,600 bytes raw; about 257 to 1; 199 GB per hour uncompressed; joint data 31 bytes per frame, 3.3 MB per hour (derived) | F05-30
The example's info.json does not record the encoder settings behind its bytes; the figures are an example, not a constant | F05-29, F05-30
Inter-frame compression: keyframes stored whole, later frames as differences; to return a frame the decoder loads the preceding keyframe and decodes up to the requested frame | F05-37
GOP size g: a keyframe every g frames | F05-36
A policy requests a few frames at random places, unlike a film watched in order | F05-64
GOP 2: at most 2 decoded frames per requested frame; GOP 250 (illustration): worst case 250, average about 125 (derived inside the entry) | F05-37
Recording defaults at v0.7.0: libsvtav1 (SVT-AV1 software encoder), GOP 2, CRF 30; lower CRF means better quality and larger files | F05-35
Default path writes PNG frames and encodes after the episode; streaming encoding encodes during capture on the CPU | F05-44
Two 640x480 cameras at 30 fps are 18.4 million pixels per second; the docs label it 55M (three colour channels) and rate it "Low"; frames are dropped when the encoder falls behind | F05-45
LeRobot's docs state software h264 gives files "~30-50% larger" at medium CPU use; hardware encoders give the largest files at very low CPU use | F05-43
LeRobot's hardware encoders are all H.264 or HEVC; none is AV1 | F05-42
History (2024 benchmark): AV1 at GOP 2 and CRF 30 gave 5.59% of the image size and 0.48 times the load time on a 480x640 dataset, six consecutive frames; H.264 2.14% and H.265 1.38% at the same nominal settings; the directory is absent at v0.7.0 | F05-63
The default was picked for decode behaviour at a small GOP (our reading) | F05-63
The example dataset's info.json records video.codec av1 | F05-23
