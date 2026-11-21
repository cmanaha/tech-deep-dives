import type { CSSProperties } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { Cite } from '../components/Cite';
import { Figure } from '../components/Figure';
import { M } from '../components/Math';
import { ARM, TASK_STORY } from '../lib/task';

/* Palette shared across the dive (revamp/diagram-plan.md, section 1). */
const INK = '#16191f';
const ROBOT_FILL = '#fff6d6';
const ROBOT_INK = '#7a5c00';
const VIDEO_FILL = '#fde8ef';
const VIDEO_INK = '#a8274f';
const STORE_FILL = '#eef0f2';
const STORE_INK = '#44505c';
const NEUTRAL_INK = '#5f6b7a';
const EMPHASIS = '#0972d3';

/** Keeps a narrow, phone-first drawing from growing oversized on a wide screen. */
const NARROW: CSSProperties = { maxWidth: 560, margin: '0 auto' };

const TH: CSSProperties = { textAlign: 'left', padding: '6px 10px', borderBottom: '2px solid #5f6b7a', verticalAlign: 'bottom' };
const TD: CSSProperties = { padding: '6px 10px', borderBottom: '1px solid #d5dbdb', verticalAlign: 'top' };

/** The public dataset this section weighs, named in one place. */
const EXAMPLE_DATASET = 'lerobot/svla_so101_pickplace';

/* ------------------------------------------------------------------------ */
/* Diagram 9.1: one episode exploded into rows, video and metadata          */
/* ------------------------------------------------------------------------ */

/** A shared file drawn as a strip of episodes, with one episode outlined. */
function EpisodeStrip({ y, fill, ink }: { y: number; fill: string; ink: string }) {
  const x0 = 52;
  const seg = 32;
  const marked = 6;
  return (
    <g>
      {Array.from({ length: 10 }, (_, i) => (
        <rect key={i} x={x0 + i * seg} y={y} width={seg} height={16} fill={fill} stroke={ink} strokeWidth={1} />
      ))}
      <rect x={x0 + marked * seg} y={y - 2} width={seg} height={20} fill="none" stroke={EMPHASIS} strokeWidth={2.5} />
    </g>
  );
}

function EpisodeOnDiskDiagram() {
  return (
    <div style={NARROW}>
      <svg viewBox="0 0 400 600" role="img" aria-labelledby="collecting-disk-title" style={{ width: '100%', height: 'auto' }}>
        <title id="collecting-disk-title">One episode exploded into its rows, its video and its metadata</title>
        <desc>
          One episode at the top branches into three stacked panels. The first is a Parquet file of rows with the
          columns action, observation.state, timestamp and four counters. The second is one MP4 file per camera. The
          third is the metadata files. In each shared file one segment is outlined: the part that belongs to this
          episode.
        </desc>
        <rect x={0} y={0} width={400} height={600} fill="#fbfbfd" />

        {/* The episode */}
        <rect x={16} y={12} width={368} height={46} rx={6} fill={ROBOT_FILL} stroke={ROBOT_INK} strokeWidth={1.5} />
        <text x={28} y={31} fontFamily="sans-serif" fontSize={13} fontWeight={700} fill={INK}>
          One episode: one attempt at the task
        </text>
        <text x={28} y={49} fontFamily="sans-serif" fontSize={12} fill={INK}>
          one row and one frame per camera, 30 times a second
        </text>

        {/* Trunk and branches */}
        <path d="M28 58 V510 M28 164 H40 M28 348 H40 M28 510 H40" fill="none" stroke={NEUTRAL_INK} strokeWidth={1.5} />

        {/* Panel A: rows */}
        <rect x={40} y={70} width={344} height={188} rx={6} fill={STORE_FILL} stroke={STORE_INK} strokeWidth={1.5} />
        <text x={52} y={90} fontFamily="sans-serif" fontSize={13} fontWeight={700} fill={INK}>
          Numbers: one row per tick, in Parquet
        </text>
        <text x={52} y={108} fontFamily="sans-serif" fontSize={12} fill={STORE_INK}>
          data/chunk-000/file-000.parquet
        </text>
        <EpisodeStrip y={120} fill="#ffffff" ink={STORE_INK} />
        <text x={260} y={154} textAnchor="middle" fontFamily="sans-serif" fontSize={12} fill={EMPHASIS}>
          this episode&apos;s rows
        </text>
        <text x={52} y={176} fontFamily="sans-serif" fontSize={12} fontWeight={700} fill={INK}>
          action
        </text>
        <text x={172} y={176} fontFamily="sans-serif" fontSize={12} fill={INK}>
          6 x float32, the joint targets
        </text>
        <text x={52} y={194} fontFamily="sans-serif" fontSize={12} fontWeight={700} fill={INK}>
          observation.state
        </text>
        <text x={172} y={194} fontFamily="sans-serif" fontSize={12} fill={INK}>
          6 x float32, measured angles
        </text>
        <text x={52} y={212} fontFamily="sans-serif" fontSize={12} fontWeight={700} fill={INK}>
          timestamp
        </text>
        <text x={172} y={212} fontFamily="sans-serif" fontSize={12} fill={INK}>
          float32, time in the episode
        </text>
        <text x={52} y={230} fontFamily="sans-serif" fontSize={12} fontWeight={700} fill={INK}>
          frame_index, episode_index, index, task_index
        </text>
        <text x={172} y={248} fontFamily="sans-serif" fontSize={12} fill={INK}>
          int64, filled in by the recorder
        </text>

        {/* Panel B: video */}
        <rect x={40} y={270} width={344} height={158} rx={6} fill={VIDEO_FILL} stroke={VIDEO_INK} strokeWidth={1.5} />
        <text x={52} y={290} fontFamily="sans-serif" fontSize={13} fontWeight={700} fill={INK}>
          Pixels: one MP4 file per camera
        </text>
        <text x={52} y={308} fontFamily="sans-serif" fontSize={12} fill={VIDEO_INK}>
          videos/observation.images.side/chunk-000/file-000.mp4
        </text>
        <EpisodeStrip y={319} fill="#ffffff" ink={VIDEO_INK} />
        <text x={52} y={356} fontFamily="sans-serif" fontSize={12} fill={VIDEO_INK}>
          videos/observation.images.up/chunk-000/file-000.mp4
        </text>
        <EpisodeStrip y={367} fill="#ffffff" ink={VIDEO_INK} />
        <text x={260} y={400} textAnchor="middle" fontFamily="sans-serif" fontSize={12} fill={EMPHASIS}>
          this episode&apos;s frames in each file
        </text>
        <text x={52} y={418} fontFamily="sans-serif" fontSize={12} fill={INK}>
          The rows hold no pixels.
        </text>

        {/* Panel C: metadata */}
        <rect x={40} y={438} width={344} height={148} rx={6} fill="#ffffff" stroke={NEUTRAL_INK} strokeWidth={1.5} />
        <text x={52} y={458} fontFamily="sans-serif" fontSize={13} fontWeight={700} fill={INK}>
          Metadata: the index and the schema
        </text>
        <text x={52} y={478} fontFamily="sans-serif" fontSize={12} fill={NEUTRAL_INK}>
          meta/episodes/chunk-000/file-000.parquet
        </text>
        <text x={64} y={494} fontFamily="sans-serif" fontSize={12} fill={EMPHASIS}>
          one row per episode: which files, which rows,
        </text>
        <text x={64} y={510} fontFamily="sans-serif" fontSize={12} fill={EMPHASIS}>
          start and end time inside each MP4
        </text>
        <text x={52} y={534} fontFamily="sans-serif" fontSize={12} fill={NEUTRAL_INK}>
          meta/info.json
        </text>
        <text x={172} y={534} fontFamily="sans-serif" fontSize={12} fill={INK}>
          schema, frame rate, codec
        </text>
        <text x={52} y={552} fontFamily="sans-serif" fontSize={12} fill={NEUTRAL_INK}>
          meta/stats.json
        </text>
        <text x={172} y={552} fontFamily="sans-serif" fontSize={12} fill={INK}>
          statistics per column
        </text>
        <text x={52} y={570} fontFamily="sans-serif" fontSize={12} fill={NEUTRAL_INK}>
          meta/tasks.parquet
        </text>
        <text x={172} y={570} fontFamily="sans-serif" fontSize={12} fill={INK}>
          the list of tasks
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Where the bytes are: the example dataset, and one robot-hour             */
/* ------------------------------------------------------------------------ */

function WeightDiagram() {
  const x0 = 16;
  const full = 368;
  const total = 86.1;
  const side = (45.5 / total) * full;
  const up = (40.1 / total) * full;
  const rest = full - side - up;
  const hour = (0.775 / 199) * full;
  return (
    <div style={NARROW}>
      <svg viewBox="0 0 400 216" role="img" aria-labelledby="collecting-weight-title" style={{ width: '100%', height: 'auto' }}>
        <title id="collecting-weight-title">Where the bytes of the example dataset are, and stored video against uncompressed frames</title>
        <desc>
          Two bars. The first splits the 86.1 MB of the example dataset into the side camera video, the up camera
          video and a sliver for everything else. The second compares one robot-hour of uncompressed frames, 199 GB,
          with the same hour as stored video, 775 MB, which is a sliver.
        </desc>
        <rect x={0} y={0} width={400} height={216} fill="#fbfbfd" />

        <text x={x0} y={22} fontFamily="sans-serif" fontSize={13} fontWeight={700} fill={INK}>
          The example dataset: 86.1 MB, 50 episodes
        </text>
        <rect x={x0} y={32} width={side} height={30} fill={VIDEO_FILL} stroke={VIDEO_INK} strokeWidth={1} />
        <rect x={x0 + side} y={32} width={up} height={30} fill={VIDEO_FILL} stroke={VIDEO_INK} strokeWidth={1} />
        <rect x={x0 + side + up} y={32} width={rest} height={30} fill={STORE_INK} />
        <text x={x0 + side / 2} y={51} textAnchor="middle" fontFamily="sans-serif" fontSize={12} fill={INK}>
          side camera video, 45.5 MB
        </text>
        <text x={x0 + side + up / 2} y={51} textAnchor="middle" fontFamily="sans-serif" fontSize={12} fill={INK}>
          up camera video, 40.1 MB
        </text>
        <path d={`M${x0 + full - 1} 62 V72`} fill="none" stroke={STORE_INK} strokeWidth={1.5} />
        <text x={x0 + full} y={87} textAnchor="end" fontFamily="sans-serif" fontSize={12} fill={INK}>
          the dark sliver: frame rows, 0.37 MB, plus metadata
        </text>

        <text x={x0} y={124} fontFamily="sans-serif" fontSize={13} fontWeight={700} fill={INK}>
          One robot-hour, two cameras
        </text>
        <rect x={x0} y={134} width={full} height={26} fill="#ffffff" stroke={NEUTRAL_INK} strokeWidth={1} />
        <text x={x0 + full / 2} y={152} textAnchor="middle" fontFamily="sans-serif" fontSize={12} fill={INK}>
          uncompressed frames, 199 GB
        </text>
        <rect x={x0} y={170} width={hour} height={26} fill={VIDEO_INK} />
        <text x={x0 + 12} y={188} fontFamily="sans-serif" fontSize={12} fill={INK}>
          the same hour as stored video, 775 MB: about 257 to 1
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Keyframes and the cost of one random frame                               */
/* ------------------------------------------------------------------------ */

function GopRow({ y, keyEvery, decodeFrom }: { y: number; keyEvery: number; decodeFrom: number }) {
  const x0 = 20;
  const step = 30;
  const asked = 9;
  return (
    <g>
      {Array.from({ length: 12 }, (_, i) => {
        const isKey = i % keyEvery === 0;
        return (
          <g key={i}>
            <rect
              x={x0 + i * step}
              y={y}
              width={28}
              height={28}
              fill={isKey ? VIDEO_FILL : '#ffffff'}
              stroke={isKey ? VIDEO_INK : NEUTRAL_INK}
              strokeWidth={1}
            />
            <text x={x0 + i * step + 14} y={y + 19} textAnchor="middle" fontFamily="sans-serif" fontSize={13} fontWeight={isKey ? 700 : 400} fill={isKey ? VIDEO_INK : NEUTRAL_INK}>
              {isKey ? 'K' : 'd'}
            </text>
          </g>
        );
      })}
      <rect x={x0 + asked * step - 2} y={y - 2} width={32} height={32} fill="none" stroke={EMPHASIS} strokeWidth={2.5} />
      <path
        d={`M${x0 + decodeFrom * step} ${y + 36} V${y + 41} H${x0 + asked * step + 28} V${y + 36}`}
        fill="none"
        stroke={INK}
        strokeWidth={1.5}
      />
    </g>
  );
}

function GopDiagram() {
  return (
    <div style={NARROW}>
      <svg viewBox="0 0 400 236" role="img" aria-labelledby="collecting-gop-title" style={{ width: '100%', height: 'auto' }}>
        <title id="collecting-gop-title">How many frames a decoder must decode to return one requested frame, at two keyframe spacings</title>
        <desc>
          Two strips of twelve video frames. In the first, every second frame is a keyframe, and returning the tenth
          frame means decoding two frames. In the second, only the first frame is a keyframe, and returning the tenth
          frame means decoding ten frames.
        </desc>
        <rect x={0} y={0} width={400} height={236} fill="#fbfbfd" />

        <text x={20} y={20} fontFamily="sans-serif" fontSize={13} fontWeight={700} fill={INK}>
          GOP 2: a keyframe every second frame
        </text>
        <GopRow y={30} keyEvery={2} decodeFrom={8} />
        <text x={380} y={88} textAnchor="end" fontFamily="sans-serif" fontSize={12} fill={INK}>
          decode 2 frames
        </text>

        <text x={20} y={118} fontFamily="sans-serif" fontSize={13} fontWeight={700} fill={INK}>
          GOP 12: one keyframe, then differences
        </text>
        <GopRow y={128} keyEvery={12} decodeFrom={0} />
        <text x={20} y={186} fontFamily="sans-serif" fontSize={12} fill={INK}>
          decode 10 frames to return the same one
        </text>

        <text x={20} y={210} fontFamily="sans-serif" fontSize={12} fill={INK}>
          K: keyframe, stored whole. d: stored as a difference.
        </text>
        <text x={20} y={227} fontFamily="sans-serif" fontSize={12} fill={EMPHASIS}>
          Outlined: the frame the trainer asked for.
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function CollectingData() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Know what an episode is on disk and what it costs to make one: 86.1 MB for 50 episodes in a public example, about 257 to 1 against the raw frames (LeRobot v0.7.0 and one public dataset, read 2026-11-20)"
          >
            9. Collecting Data
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            This section depends on section 3, The Robot as a Computer. It uses that section&apos;s terms as given:
            teleoperation with a leader arm, <code>observation.state</code>, <code>action</code>, the 30 ticks per
            second of the recording loop, and the gap between a few bytes of joint data and megabytes of camera
            frames. Section 2 said that an episode is one recorded attempt at the task.
          </Box>
          <Box variant="p">
            Here the {ARM} learning to {TASK_STORY} becomes a directory of files. The section covers who produces
            the episodes and at what cost in human time, which files an episode turns into, what a real 50-episode
            dataset weighs, and the one recording setting that every later reader of the data inherits: how the
            video is compressed.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Pick a way to collect by what the person holds, and know how much of a session is recording">
            Three ways to collect
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Teleoperation with a leader arm.</strong> This is the bench scene of section 3: you move the
            leader, the follower does the task, and one command, <code>lerobot-record</code>, stores the
            follower&apos;s joint readings, the commanded targets and the camera frames of each episode.{' '}
            <Cite id="F05-1">LeRobot imitation learning guide, Record a dataset</Cite> The recorder&apos;s defaults
            are 30 frames per second, 60 s per episode, 60 s to reset the scene (put the block and the cup back) and
            50 episodes. At those defaults one session is 50 x (60 + 60) s = 100 minutes of a person&apos;s time for
            at most 50 minutes of recorded data. Half of the session is resets.{' '}
            <Cite id="F05-2">LeRobot dataset.py, recorder defaults</Cite>
          </Box>
          <Box variant="p">
            Fifty is also the size LeRobot suggests for a first dataset: at least 50 episodes, 10 per object
            location, with the cameras fixed and the object visible in them. That is advice from the project, and no
            measured threshold stands behind it.{' '}
            <Cite id="F05-5">LeRobot imitation learning guide, Tips for gathering data</Cite>
          </Box>
          <Box variant="p">
            <strong>A hand-held data collection rig.</strong> The rig takes the robot out of the session. A person
            holds a gripper with a camera mounted on it and does the task directly, anywhere, and software
            reconstructs the gripper&apos;s path afterwards from the video and the camera&apos;s motion sensor. The
            idea comes from UMI (Universal Manipulation Interface), a 2024 project built around a 3D-printed gripper
            and an action camera. <Cite id="F05-7">UMI paper, section III</Cite> Its authors report that 3 people
            recorded 1,400 demonstrations of a cup-arrangement task in 12 person-hours across 30 locations, and that
            on that task the hand-held gripper was more than 3 times faster than teleoperation.{' '}
            <Cite id="F05-8">UMI paper, sections V and VI</Cite> What the rig records is the path of a gripper: in
            section 3&apos;s terms an end-effector action, where a leader arm records joint targets for the one
            follower it is paired with.
          </Box>
          <Box variant="p">
            <strong>A fleet.</strong> Many rigs and many people, run as an operation. HiFi-UMI-2K (July 2026) was
            collected with a hand-held rig for two hands and six synchronised cameras. Its dataset card states that
            the public release is a curated 2,000-hour subset of a source corpus of more than 20,000 hours, and the
            release occupies 16.0 TB in LeRobot format: the same format the single arm on your desk writes.{' '}
            <Cite id="F05-10">HiFi-UMI-2K dataset card and LeRobot v0.7.0 release post</Cite>
          </Box>
          <Box variant="p">
            Choose by what you have. A leader arm needs the robot at the bench and a reset after every episode, and
            it records joint targets for that robot. A rig needs no robot and goes wherever the task is. A
            fleet needs an organisation, and curation afterwards (section 10). The rest of this section follows the
            leader arm, because it is the one you can run on the {ARM} today.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="Open a dataset directory and know what each file holds and where one episode sits inside it">
            An episode on disk: rows plus video
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Open the directory the recorder wrote and you find three kinds of content. The numbers (joint states,
            actions, timestamps) are in Parquet files. Parquet is a column file format: a table stored column by
            column, compressed, with its schema inside the file. The camera frames are encoded into MP4 files, the
            common container file for compressed video. The metadata, as JSON and Parquet, describes the schema and
            says where each episode starts and ends.{' '}
            <Cite id="F05-17">LeRobot dataset v3 docs, lines 58 to 62</Cite> This layout is LeRobot dataset format
            v3.0, the version at LeRobot v0.7.0. <Cite id="F05-16">LeRobot dataset_metadata.py, line 64</Cite>
          </Box>
          <Box variant="p">
            A dataset is a table with one row per tick. For the two-camera arm a row holds <code>action</code> (six{' '}
            <code>float32</code> joint targets), <code>observation.state</code> (six <code>float32</code> measured
            joint positions) and five bookkeeping columns that the recorder fills in: <code>timestamp</code>,{' '}
            <code>frame_index</code> (the tick&apos;s number inside its episode), <code>episode_index</code>,{' '}
            <code>index</code> (the row&apos;s number in the whole dataset) and <code>task_index</code>.{' '}
            <Cite id="F05-22">LeRobot constants.py, default features</Cite> The two camera columns have the type{' '}
            <code>video</code>: their pixels are in the MP4 files and the row holds none.{' '}
            <Cite id="F05-23">info.json of the example dataset</Cite>
          </Box>
          <Figure
            cites="F05-17 F05-18 F05-22 F05-23 F05-24 F05-29"
            caption={
              <>
                Read it top to bottom: one episode becomes rows in a shared Parquet file, frames in one shared MP4
                file per camera, and one metadata row that says where its part of each file is (outlined). The file
                paths are those of the example dataset weighed below. The strips are illustrative, not measured:
                that dataset packs 50 episodes into each file.
              </>
            }
          >
            <EpisodeOnDiskDiagram />
          </Figure>
          <Box variant="p">
            The outlined segments carry the idea that makes the format work: files are containers, and episodes are
            an index into them. Many episodes share one file. The writer appends each new episode&apos;s video to
            the current MP4 until the file would reach its size target, then starts the next file.{' '}
            <Cite id="F05-19">LeRobot dataset_writer.py, lines 547 to 569</Cite> One metadata row per episode
            records which data file it is in, its first and last row, and for each camera which video file and the
            start and end time of the episode inside that file.{' '}
            <Cite id="F05-24">LeRobot dataset_writer.py, episode metadata</Cite>
          </Box>
          <Box variant="p">
            So the number of files follows the bytes, and the number of episodes does not change it. The defaults at
            v0.7.0 are at most 100 MB per data Parquet file, 200 MB per video file, and 1,000 files per{' '}
            <code>chunk-NNN</code> directory. A dataset written by an earlier release keeps the value it was written
            with: the example below records a video file target of 500 MB.{' '}
            <Cite id="F05-20">LeRobot datasets/utils.py, size defaults</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="86.1 MB for 50 episodes: what to budget per robot-hour, and which files hold the bytes">
            A real dataset, weighed
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <code>{EXAMPLE_DATASET}</code> is a public 50-episode pick-and-place dataset on the Hugging Face hub,
            the site where LeRobot datasets are published. It is named for the SO-101, and its own metadata records
            the robot type as <code>so100_follower</code>; LeRobot drives both arms with one follower class, so read
            it as an example of the format and of the byte counts. It holds 11,939 frames at 30 fps from two 640x480
            cameras. The whole repository is nine files and 86.1 MB.{' '}
            <Cite id="F05-29">Hugging Face hub file listing of the example dataset</Cite>
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 560 }}>
              <thead>
                <tr>
                  <th style={TH}>File</th>
                  <th style={TH}>Size</th>
                  <th style={TH}>What it holds</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>
                    <code>videos/observation.images.side/chunk-000/file-000.mp4</code>
                  </td>
                  <td style={TD}>45.5 MB</td>
                  <td style={TD}>Side camera, all 50 episodes</td>
                </tr>
                <tr>
                  <td style={TD}>
                    <code>videos/observation.images.up/chunk-000/file-000.mp4</code>
                  </td>
                  <td style={TD}>40.1 MB</td>
                  <td style={TD}>Up camera, all 50 episodes</td>
                </tr>
                <tr>
                  <td style={TD}>
                    <code>data/chunk-000/file-000.parquet</code>
                  </td>
                  <td style={TD}>0.37 MB</td>
                  <td style={TD}>All 11,939 frame rows</td>
                </tr>
                <tr>
                  <td style={TD}>
                    <code>meta/episodes/chunk-000/file-000.parquet</code>
                  </td>
                  <td style={TD}>72,560 bytes</td>
                  <td style={TD}>One row per episode: where it is in the files above</td>
                </tr>
                <tr>
                  <td style={TD}>
                    <code>meta/stats.json</code>
                  </td>
                  <td style={TD}>5,914 bytes</td>
                  <td style={TD}>Statistics per column</td>
                </tr>
                <tr>
                  <td style={TD}>
                    <code>meta/info.json</code>
                  </td>
                  <td style={TD}>3,401 bytes</td>
                  <td style={TD}>Schema, frame rate, codec</td>
                </tr>
                <tr>
                  <td style={TD}>
                    <code>meta/tasks.parquet</code>
                  </td>
                  <td style={TD}>2,246 bytes</td>
                  <td style={TD}>The list of tasks</td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">
            The two video files are all but half a megabyte of the 86.1 MB. Every joint reading and every command of
            all 50 episodes fits in the 0.37 MB Parquet file. Section 3 predicted this from the shapes of the data;
            here it is on disk.
          </Box>
          <Figure
            cites="F05-29 F05-30"
            caption={
              <>
                Both bars are drawn to scale. Top: the example dataset by file. Bottom: one robot-hour of two-camera
                frames, uncompressed and as stored, which is our arithmetic from this one dataset.
              </>
            }
          >
            <WeightDiagram />
          </Figure>
          <Box variant="p">
            Scaled to a budget, by our arithmetic from those file sizes: the dataset is 6.6 minutes of robot time,
            so its video costs about 775 MB per robot-hour for two cameras, or 3,588 bytes per camera frame. One
            uncompressed 640x480 colour frame is 921,600 bytes. The stored frame is about 257 times smaller, and the
            same hour uncompressed would be 199 GB. The joint data is about 31 bytes per frame, 3.3 MB per hour.{' '}
            <Cite id="F05-30">from the file sizes of the example dataset</Cite>
          </Box>
          <Box variant="p">
            Treat 775 MB per hour and 257 to 1 as an example and never as a constant. They come from one dataset of
            one scene, and its <code>info.json</code> does not record the encoder settings that produced those
            bytes. <Cite id="F05-29">Hugging Face hub file listing of the example dataset</Cite>{' '}
            <Cite id="F05-30">from the file sizes of the example dataset</Cite> A different scene, image size or
            setting gives different figures. What produces a ratio like this, and what it
            asks of whoever reads the data back, is the last decision of the recording.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header variant="h2" description="What the recording default implies for whoever decodes the video later, and when to change it">
            The codec choice
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A codec is a method for compressing video into a file and turning it back into frames. It has two
            halves that run at different times on different machines. The encoder compresses, once, on the host
            beside the robot. The decoder decompresses, every time anyone reads a frame, wherever training runs.
            (In section 3 an encoder was the angle sensor on a joint. In this section and the next two the word
            means the video compressor.)
          </Box>
          <Box variant="p">
            Video compresses so well because consecutive frames are nearly the same picture. The encoder stores some
            frames whole. Such a frame is a keyframe: it can be decoded on its own. The frames after it are stored
            as differences from what came before. The consequence for reading: to return one requested frame, a
            decoder must load the preceding keyframe and decode every frame from there up to the one requested.{' '}
            <Cite id="F05-37">LeRobot video_utils.py, decoder docstrings</Cite>
          </Box>
          <Box variant="p">
            GOP (group of pictures) size is the spacing of the keyframes: a keyframe every <M>g</M> frames.{' '}
            <Cite id="F05-36">LeRobot video encoding parameters, tuning table</Cite> A film is watched in order, so
            keyframes can be far apart and each frame is decoded once on the way through. A trainer reads video the
            other way round: a policy asks for a few frames at random places in the dataset.{' '}
            <Cite id="F05-64">LeRobot video benchmark README (2024), Requested timestamps</Cite> With GOP 2, a
            random frame costs at most 2 decoded frames. With a GOP of 250, a common setting for streamed video and
            used here as an illustration, the worst case is 250 and the average about 125, by our arithmetic.{' '}
            <Cite id="F05-37">LeRobot video_utils.py, decoder docstrings</Cite> More keyframes make a larger file
            and a cheaper random read.
          </Box>
          <Figure
            cites="F05-36 F05-37"
            caption={
              <>
                Each strip is twelve consecutive frames of one video, and the bracket under a strip spans the frames
                that must be decoded to return the outlined one. Illustrative, not measured: the second strip uses a
                GOP of 12 so that it fits the page.
              </>
            }
          >
            <GopDiagram />
          </Figure>
          <Box variant="p">
            LeRobot v0.7.0 makes that trade in favour of the reader. Its recording defaults are three settings:
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 520 }}>
              <thead>
                <tr>
                  <th style={TH}>Setting</th>
                  <th style={TH}>Default</th>
                  <th style={TH}>What it is</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>Codec</td>
                  <td style={TD}>
                    <code>libsvtav1</code>
                  </td>
                  <td style={TD}>
                    SVT-AV1, a software encoder (it runs on CPU cores) for AV1 (AOMedia Video 1), a video
                    compression standard
                  </td>
                </tr>
                <tr>
                  <td style={TD}>GOP size</td>
                  <td style={TD}>2</td>
                  <td style={TD}>A keyframe every second frame</td>
                </tr>
                <tr>
                  <td style={TD}>CRF (constant rate factor)</td>
                  <td style={TD}>30</td>
                  <td style={TD}>
                    The encoder&apos;s quality dial: one number for how much detail it may discard. Lower means
                    better quality and larger files
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">
            <Cite id="F05-35">LeRobot configs/video.py, encoder defaults</Cite>
          </Box>
          <Box variant="p">
            <strong>What the default costs at the bench.</strong> By default the recorder writes each frame as a PNG
            image and encodes the episode after it ends; with <code>--dataset.streaming_encoding=true</code> frames
            go to an encoder thread during capture, so the CPU encodes while the control loop runs.{' '}
            <Cite id="F05-44">LeRobot streaming video encoding docs, sections 1 to 3</Cite> Either way the load is
            CPU work on the host. Two 640x480 cameras at 30 fps are 18.4 million pixels per second. The docs rate
            that load &quot;Low&quot; and label it 55M, because their column counts the three colour channels of
            each pixel. When the encoder falls behind, frames are dropped and the capture loop keeps running, so a
            host that is too slow shows up as missing frames.{' '}
            <Cite id="F05-45">LeRobot streaming video encoding docs, section 3</Cite>
          </Box>
          <Box variant="p">
            <strong>When to change it.</strong> If the host cannot keep up, the alternatives are H.264 and HEVC
            (High Efficiency Video Coding, also called H.265), two other video compression standards. LeRobot&apos;s docs state that software <code>h264</code> gives files
            &quot;~30-50% larger&quot; than <code>libsvtav1</code> at medium CPU use, and that hardware encoders
            (fixed circuits in a GPU or processor that compress video without loading the CPU cores) give the
            largest files at very low CPU use.{' '}
            <Cite id="F05-43">LeRobot streaming video encoding docs, Choosing a Codec</Cite> The hardware encoders
            LeRobot can use are all H.264 or HEVC, and none is AV1: a dataset recorded that way is in a different
            codec from the default. <Cite id="F05-42">LeRobot configs/video.py, hardware codec list</Cite>
          </Box>
          <ExpandableSection headerText="Why the default is AV1 at GOP 2: the 2024 benchmark" variant="footer">
            <SpaceBetween size="s">
              <Box variant="p">
                This is history: the measurements are from 2024 and the benchmark directory is gone from the
                repository at v0.7.0. LeRobot chose AV1, GOP 2 and CRF 30 from its own video benchmark. It reports
                that on a 480x640 real-world dataset those settings gave a video 5.59% the size of the original
                images, with a load time 0.48 times that of loading the images, for six consecutive frames.{' '}
                <Cite id="F05-63">LeRobot video benchmark README at v0.4.0</Cite>
              </Box>
              <Box variant="p">
                In the same table the H.264 and H.265 files at the same nominal settings were smaller, 2.14% and
                1.38% of the images, and AV1 had the fastest load. CRF values do not mean the same thing in
                different codecs, so this does not contradict the current docs&apos; ranking of AV1 as the smallest
                output. Our reading of the table is that the default was picked for how it decodes at a small GOP.{' '}
                <Cite id="F05-63">LeRobot video benchmark README at v0.4.0</Cite>
              </Box>
            </SpaceBetween>
          </ExpandableSection>
          <Box variant="p">
            The codec is chosen once, at the bench, and paid for at every read. The example dataset shows the
            trade: 50 episodes in 86.1 MB.{' '}
            <Cite id="F05-29">Hugging Face hub file listing of the example dataset</Cite> With the v0.7.0 defaults a
            random frame costs at most two decodes, and every machine that trains on the data must be able to decode
            AV1.
          </Box>
          <Box variant="p">
            Before you record, decide who will decode. For a
            dataset someone hands you, open <code>meta/info.json</code> and read <code>video.codec</code> for each
            camera; the example dataset says <code>av1</code>.{' '}
            <Cite id="F05-23">info.json of the example dataset</Cite> Then go to section 10, Processing and
            Curating, which starts from that answer: which CPU cores and which GPU video engines can decode it, and
            how fast.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
