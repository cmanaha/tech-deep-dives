import type { CSSProperties } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { Cite, Derived, Toy } from '../components/Cite';
import { Figure } from '../components/Figure';
import { ARM, TASK_STORY } from '../lib/task';
import { Capture, MUJOCO_SO101 } from '../components/Capture';

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

const FORMULA: CSSProperties = { display: 'block', margin: 0, padding: '8px 12px', background: '#f4f4f6', borderRadius: 6, overflowX: 'auto' };

const TH: CSSProperties = { textAlign: 'left', padding: '6px 10px', borderBottom: '2px solid #5f6b7a', verticalAlign: 'bottom' };
const TD: CSSProperties = { padding: '6px 10px', borderBottom: '1px solid #d5dbdb', verticalAlign: 'top' };

/** The public dataset weighed in section 9, named in one place. */
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
            description="See why an episode's weight is its video, and set the compression at the bench knowing that every later reader of the data pays for it (LeRobot v0.7.0 and one public dataset, read 2026-11-20)"
          >
            9. Collecting Data: Episode Size and Video Compression
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            An episode, one recorded attempt at the task (for this {ARM}, to {TASK_STORY}), is stored as two things of very different weight: rows
            in a table, one per tick of the arm&apos;s 30 Hz clock, and frames of compressed video, one stream per
            camera. The
            video is nearly all of it. A public 50-episode pick-and-place dataset in the format this arm records is
            86.1 MB in total. Its two camera files are 45.5 MB and 40.1 MB of that, and every joint reading and
            every command of all 50 episodes fits in a table of 0.37 MB.{' '}
            <Cite id="F05-29">Hugging Face hub file listing of the example dataset</Cite>
          </Box>
          <Box variant="p">
            Those video files are what is left after heavy compression. They hold 11,939 frames from each of two
            cameras in 85,666,122 bytes, 3,588 bytes a frame, where a raw 640x480 colour frame is 640 x 480 x 3 =
            921,600 bytes: about 257 to 1 in this one dataset. At that ratio an hour of recording is about 387 MB
            per camera, 775 MB for the pair, where the raw frames would be 199 GB, so, at one bench, disk is the cheap
            part of collecting data. The ratio is paid for in computing, twice: once to compress, on the CPU cores of the
            host beside the arm, and again to decompress, every time a training job reads a frame.{' '}
            <Cite id="F05-30">from the file sizes of the example dataset</Cite>
          </Box>
          <Figure
            cites="F05-29 F05-30"
            caption={
              <>
                Both bars are drawn to scale. Top: the public dataset by file. Bottom: one robot-hour of two-camera
                frames, uncompressed and as stored, computed from this one dataset.
              </>
            }
          >
            <WeightDiagram />
          </Figure>
          <Box variant="p">
            The first payment sets the size of the second. Two settings are chosen at the bench, where a person drives
            the arm through each episode by teleoperation (section 3), and every later reader of the data inherits
            them. One is the codec, the method that compresses the video and turns it back into frames. The other
            is how often the video stores a whole frame. The codec decides which machines can decode the video. The spacing decides how many frames a trainer
            decodes to get the one it asked for. LeRobot v0.7.0, the library that drives this arm, defaults to the settings that make reading fast: a
            whole frame every second frame, compressed by the software its docs rate as the most CPU-intensive.{' '}
            <Cite id="F05-35">LeRobot configs/video.py, encoder defaults</Cite>{' '}
            <Cite id="F05-43">LeRobot streaming video encoding docs, Choosing a Codec</Cite>
          </Box>
          <Box variant="p">
            Disk aside, what a recording costs at the bench is those CPU cores and a person. At the recorder&apos;s
            defaults a 50-episode session takes 100 minutes of a person&apos;s time for at most 50 minutes of
            data. <Cite id="F05-2">LeRobot dataset.py, recorder defaults</Cite>
          </Box>
          <ExpandableSection headerText="The example dataset, file by file" variant="footer">
            <SpaceBetween size="s">
              <Box variant="p">
                The dataset is <code>{EXAMPLE_DATASET}</code> on the Hugging Face hub, the site where LeRobot
                datasets are published: 11,939 frames at 30 fps from two 640x480 cameras, 6.6 minutes of robot
                time. Its metadata records the robot type as <code>so100_follower</code>, which LeRobot uses for both
                the SO-100 and the SO-101, so the files do not prove an SO-101 recorded it.{' '}
                <Cite id="F05-29">Hugging Face hub file listing of the example dataset</Cite>{' '}
                <Cite id="F05-30">from the file sizes of the example dataset</Cite>{' '}
                <Cite id="F05-23">info.json of the example dataset</Cite>
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
                      <td style={TD}>One row per episode: where it sits in the data and video files</td>
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
                The joint data is about 31 bytes per row, 3.3 MB per robot-hour, so the video sets the disk: cameras
                x hours x a camera-hour figure, 387 MB in this dataset. That figure comes from one scene at one image size, and its <code>info.json</code> does not record the
                compression settings that produced those bytes, so 257 to 1 says nothing certain about what the
                v0.7.0 defaults produce.{' '}
                <Cite id="F05-29">Hugging Face hub file listing of the example dataset</Cite>{' '}
                <Cite id="F05-30">from the file sizes of the example dataset</Cite>
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Find one episode's rows and frames inside a dataset directory, and compute the video time a training sample reads"
          >
            An episode is an index into a few shared files
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The recorder writes three kinds of file, and none of them belongs to one episode: Parquet files, a
            compressed column-by-column table format, for the numbers (joint states, actions, timestamps); MP4
            files for the encoded camera frames; and metadata, as JSON and Parquet, that describes the schema and
            says where each episode starts and ends.{' '}
            <Cite id="F05-17">LeRobot dataset v3 docs, lines 58 to 62</Cite> This layout is LeRobot dataset format
            v3.0, the version at LeRobot v0.7.0. <Cite id="F05-16">LeRobot dataset_metadata.py, line 64</Cite>
          </Box>
          <Box variant="p">
            The table has one row per tick, and its two camera columns hold no pixels: they have the type{' '}
            <code>video</code>, and their pixels are in the MP4 files, so one training sample is assembled from a
            row and the decoded frames each camera contributes to it.{' '}
            <Cite id="F05-23">info.json of the example dataset</Cite> Beside them a row holds{' '}
            <code>action</code> (six <code>float32</code> joint targets), <code>observation.state</code> (six{' '}
            <code>float32</code> measured joint positions) and five bookkeeping columns that the recorder fills
            in, among them <code>timestamp</code> and <code>frame_index</code>, the tick&apos;s number inside its
            episode. <Cite id="F05-22">LeRobot constants.py, default features</Cite>
          </Box>
          <Figure
            cites="F05-17 F05-18 F05-22 F05-23 F05-24 F05-29"
            caption={
              <>
                One episode becomes rows in a shared Parquet file, frames in one shared MP4 file per camera, and
                one metadata row that says where its part of each file is (outlined). The file paths are those of
                the public dataset. The strips are illustrative, not measured: that dataset packs 50 episodes into
                each file.
              </>
            }
          >
            <EpisodeOnDiskDiagram />
          </Figure>
          <Box variant="p">
            When an episode ends, the writer appends its video to the current MP4 of each camera, and starts a new
            file only when the current one would reach its size target.{' '}
            <Cite id="F05-19">LeRobot dataset_writer.py, lines 547 to 569</Cite> One metadata row per episode then
            records which data file holds it, its first and last row, and for each camera which video file and the
            start and end time of the episode inside that file.{' '}
            <Cite id="F05-24">LeRobot dataset_writer.py, episode metadata</Cite>
          </Box>
          <Box variant="p">
            The file count therefore follows the bytes far more than the episodes. At this dataset&apos;s rate one
            camera-hour is about 387 MB: about two video files at the 200 MB target of v0.7.0 when the hour is
            many short episodes. The writer never splits an episode, so a single hour-long episode is one 387 MB file, and, for
            illustration, three <Toy>20</Toy>-minute episodes of <Derived>129</Derived> MB each make three. Version 2 of the format wrote one file per episode, so at
            the millions of episodes LeRobot&apos;s docs design for it meant millions of files; version 3 keeps the
            count at the bytes over the size target.{' '}
            <Cite id="F05-19">LeRobot dataset v3 docs, lines 19 to 22 and 64</Cite>{' '}
            <Cite id="F05-20">LeRobot datasets/utils.py, size defaults</Cite>{' '}
            <Cite id="F05-30">from the file sizes of the example dataset</Cite>
          </Box>
          <Box variant="p">
            Reading one camera frame back is an addition. A row&apos;s <code>timestamp</code> is its time inside
            its own episode. The episode&apos;s metadata row holds <code>from_timestamp</code> for each camera: the
            time at which that episode begins inside the camera&apos;s shared MP4. The reader adds the two and asks
            the decoder for the frame at that time.{' '}
            <Cite id="F05-25">LeRobot dataset_reader.py, lines 429 to 446</Cite>
          </Box>
          <Box variant="p">
            <code style={FORMULA}>seek time = timestamp + from_timestamp</code>
          </Box>
          <Box variant="p">
            The first term places the frame in its episode and the second places the episode in the file. As an
            illustration with invented numbers, take an episode that begins <Toy>55.7</Toy> s into the side
            camera&apos;s file. Its row with <code>frame_index</code> <Toy>45</Toy> has a timestamp of{' '}
            <Toy>45</Toy> / 30 = <Toy>1.5</Toy> s, so the decoder is asked for <Toy>55.7</Toy> + <Toy>1.5</Toy> ={' '}
            <Toy>57.2</Toy> s. The addition costs nothing. Producing the frame at that time out of a compressed
            file is the decode, and its price was set when the video was written.
          </Box>
          <Box variant="p">
            The division in that example is how every timestamp is made: the frame&apos;s index over the nominal
            frame rate, with no clock read. A recording loop that really ran at 25 Hz therefore still produces a
            dataset that claims 30, and the motion it holds is 30 / 25 = <Derived>1.2</Derived> times faster than the one the person
            made.{' '}
            <Cite id="F05-4">LeRobot imitation learning guide, Cadence reporting</Cite>
          </Box>
          <Capture
            file="so101-episode-strip.jpg"
            kind="still"
            width={1800}
            height={300}
            alt="Six frames from one episode, left to right: the arm above the block, the gripper around it, the block lifted, carried over the cup and released."
            caption={
              <>
                Six frames of one episode in time order. In a recorded episode, each frame shares its timestamp with
                one row of the table, and that timestamp is what finds it in the video. The frames are rendered from a simulated SO-101 in MuJoCo,
                the physics simulator of section 12, Physics Simulation, and are not taken from the public dataset.
              </>
            }
            provenance={MUJOCO_SO101}
          />
          <Capture
            file="so101-policy-views"
            kind="clip"
            width={960}
            height={360}
            alt="The same episode from two cameras side by side: an overhead view of the table and a view from the gripper."
            caption={
              <>
                The same simulated episode from an overhead camera and a camera on the gripper. Each camera
                becomes its own video file in the dataset, and these two streams are what a policy receives as its
                images.
              </>
            }
            provenance={MUJOCO_SO101}
          />
          <ExpandableSection headerText="Size targets per file, and loading a v2.1 dataset" variant="footer">
            <SpaceBetween size="s">
              <Box variant="p">
                The defaults at v0.7.0 are at most 100 MB per data Parquet file, 200 MB per video file, and 1,000
                files per <code>chunk-NNN</code> directory, after which the writer starts the next directory. A
                dataset written by an earlier release keeps the value it was written with: the public dataset
                records a video file target of 500 MB.{' '}
                <Cite id="F05-20">LeRobot datasets/utils.py, size defaults</Cite>{' '}
                <Cite id="F05-21">LeRobot datasets/utils.py, lines 329 to 335</Cite>
              </Box>
              <Box variant="p">
                A dataset in format v2.1, one file per episode, is refused at load time with a message that names
                the script to run: <code>convert_dataset_v21_to_v30</code> merges the per-episode files into
                shared ones and writes the episode offsets.{' '}
                <Cite id="F05-28">LeRobot dataset v3 docs, migration</Cite>
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Work out how many frames a trainer decodes for each frame it asks for, and read LeRobot's three encoder defaults as one trade between the bench and the reader"
          >
            The keyframe interval sets what a random read costs
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The 257 to 1 is the codec&apos;s work, and its two halves run at different times on different
            machines. The encoder compresses, once,
            on the host beside the robot. The decoder decompresses, every time anyone reads a frame, wherever
            training runs. (Through section 11, encoder means the video compressor, not section 3&apos;s angle sensor on a joint.)
          </Box>
          <Box variant="p">
            Video compresses that far because consecutive frames are nearly the same picture. The encoder stores
            some frames whole. Such a frame is a keyframe: it can be decoded on its own. The frames after it are
            stored as differences from what came before. Reading therefore has a cost that depends on where the
            frame sits: to return one requested frame, a decoder loads the preceding keyframe and decodes every
            frame from there up to the one requested.{' '}
            <Cite id="F05-37">LeRobot video_utils.py, decoder docstrings</Cite>
          </Box>
          <Box variant="p">
            The spacing of the keyframes is the GOP (group of pictures) size: a keyframe every <code>g</code>{' '}
            frames. <Cite id="F05-36">LeRobot video encoding parameters, tuning table</Cite> A film is watched in
            order, so its keyframes can sit far apart and each frame is decoded once on the way through. Training
            reads the other way round: the data loader asks for a few frames at random places in the dataset.{' '}
            <Cite id="F05-64">LeRobot video benchmark README (2024), Requested timestamps</Cite>
          </Box>
          <Box variant="p">
            With a GOP of 2, a requested frame costs at most 2 decoded frames. With a GOP of 250, a common setting
            for streamed video and used here as an illustration, a random read decodes up to 250 frames. Against
            the at most 2 of a GOP of 2, that worst case is 250 / 2 = 125 times the decoding per random read. More keyframes buy that cheaper read with a larger file. The example dataset does not
            record its GOP, so to put a number on the size side for your own scene, record one episode at{' '}
            <code>g</code> = 2 and one at a long GOP and compare the two files.{' '}
            <Cite id="F05-37">LeRobot video_utils.py, decoder docstrings</Cite>{' '}
            <Cite id="F05-29">Hugging Face hub file listing of the example dataset</Cite>
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
            LeRobot decodes on CPU cores by default, and one random read there already takes milliseconds: an
            open LeRobot pull request times one random sample from a two-camera, 50-episode dataset at about 5 ms
            (a median, one process, warm file cache, hardware not stated). Section 10,
            Processing and Curating, turns that time into the data loader workers a GPU needs, and every extra
            decode per frame raises the count.{' '}
            <Cite id="F05-39">LeRobot video_utils.py, decode backends</Cite>{' '}
            <Cite id="F05-62">LeRobot pull request 4549</Cite>
          </Box>
          <Box variant="p">
            LeRobot v0.7.0 sets that trade with three encoder defaults: two set the read, and the third sets
            quality against size.
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 560 }}>
              <thead>
                <tr>
                  <th style={TH}>Setting</th>
                  <th style={TH}>Default</th>
                  <th style={TH}>What it is, and what it decides</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>
                    Codec, <code>vcodec</code>
                  </td>
                  <td style={TD}>
                    <code>libsvtav1</code>
                  </td>
                  <td style={TD}>
                    SVT-AV1, a software encoder (it runs on CPU cores) for AV1 (AOMedia Video 1), a video
                    compression standard. Every reader of the dataset needs an AV1 decoder.{' '}
                    <Cite id="F05-35">LeRobot configs/video.py, encoder defaults</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    GOP size, <code>g</code>
                  </td>
                  <td style={TD}>2</td>
                  <td style={TD}>
                    A keyframe every second frame. A random read costs at most 2 decodes, and the file is larger
                    than a long GOP would make it.{' '}
                    <Cite id="F05-37">LeRobot video_utils.py, decoder docstrings</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    CRF (constant rate factor), <code>crf</code>
                  </td>
                  <td style={TD}>30</td>
                  <td style={TD}>
                    The encoder&apos;s quality dial: one number for how much detail it may discard. Lower means
                    better quality and larger files.{' '}
                    <Cite id="F05-35">LeRobot configs/video.py, encoder defaults</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">
            The default codec is the expensive one to write. LeRobot&apos;s docs say <code>libsvtav1</code> is the
            default &quot;because it provides the best training performance&quot;, and that other codecs
            &quot;can reduce CPU usage and be faster, but they typically produce larger files and may affect
            training time&quot;. <Cite id="F05-43">LeRobot streaming video encoding docs, Choosing a Codec</Cite>
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 600 }}>
              <thead>
                <tr>
                  <th style={TH}>Encoder</th>
                  <th style={TH}>CPU use at the bench, as LeRobot rates it</th>
                  <th style={TH}>File size, as LeRobot rates it</th>
                  <th style={TH}>Codec the reader must decode</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>
                    <code>libsvtav1</code> (default)
                  </td>
                  <td style={TD}>High</td>
                  <td style={TD}>Smallest</td>
                  <td style={TD}>
                    AV1 <Cite id="F05-43">LeRobot streaming video encoding docs, Choosing a Codec</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    Software <code>h264</code>
                  </td>
                  <td style={TD}>Medium</td>
                  <td style={TD}>&quot;~30-50% larger&quot;</td>
                  <td style={TD}>
                    H.264, another video compression standard{' '}
                    <Cite id="F05-43">LeRobot streaming video encoding docs, Choosing a Codec</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Hardware encoders</td>
                  <td style={TD}>Very low</td>
                  <td style={TD}>Largest</td>
                  <td style={TD}>
                    H.264 or HEVC (High Efficiency Video Coding, also called H.265); none in LeRobot&apos;s list
                    writes AV1 <Cite id="F05-42">LeRobot configs/video.py, hardware codec list</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">
            A hardware encoder is a fixed circuit in a GPU or processor that compresses video without loading the
            CPU cores. LeRobot lists six, all H.264 or HEVC, so taking the encode load off the CPU means handing the
            reader a different codec. The setting <code>vcodec=auto</code> makes that choice for you: it picks the
            first hardware encoder the host offers and falls back to <code>libsvtav1</code> only when there is none,
            so the same command writes different codecs on different benches.{' '}
            <Cite id="F05-42">LeRobot configs/video.py, hardware codec list</Cite>
          </Box>
          <Box variant="p">
            LeRobot&apos;s 2024 video benchmark, the source of the defaults, measured both sides of the trade at
            GOP 2 and CRF 30 for three codecs, on a 480x640 real-world dataset. The AV1 video was the largest of
            the three, 5.59% the size of the original images against 2.14% for H.264 and 1.38% for H.265, and the
            fastest to read: it loaded six consecutive frames in 0.48 times the time the images took, the best in
            the table. LeRobot chose AV1 &quot;considering these results&quot;.{' '}
            <Cite id="F05-63">LeRobot video benchmark README at v0.4.0</Cite>
          </Box>
          <Box variant="p">
            The current docs rate <code>libsvtav1</code> &quot;Smallest&quot;, where the 2024 benchmark found
            AV1&apos;s file the largest, and give the reason for AV1 as &quot;the best training performance&quot;.
            The two rankings can both hold, because a CRF of 30 is a different quality in each codec, and either
            way the default was chosen for the read. The benchmark&apos;s percentages, taken
            against its own images on another dataset, rank the codecs; they do not size a disk.{' '}
            <Cite id="F05-43">LeRobot streaming video encoding docs, Choosing a Codec</Cite>{' '}
            <Cite id="F05-63">LeRobot video benchmark README at v0.4.0</Cite>
          </Box>
          <Box variant="p">
            Before you change any of the three, name the machine that will train on the data. Its decoders decide
            whether AV1 is acceptable, and if it decodes on CPU cores, those cores pay for every frame of GOP you
            add (section 10 lists which GPUs decode AV1 in hardware).{' '}
            <Cite id="F05-39">LeRobot video_utils.py, decode backends</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Know which settings move the encode load and onto what, and catch a recording that went wrong from its first episode"
          >
            Encoding is paid in the CPU cores beside the arm
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The default encoder runs in software, and at the defaults recording runs no model, so collection loads the
            host&apos;s CPU cores and asks nothing of its GPU.{' '}
            <Cite id="F05-105">the load of collection, from the recorder&apos;s defaults</Cite>
          </Box>
          <Box variant="p">
            By default the recorder writes each frame to disk as a PNG image and encodes
            the episode to MP4 after it ends. With <code>--dataset.streaming_encoding=true</code> frames go straight
            to an encoder thread during capture: saving an episode becomes near-instant, and the cores now encode
            video on the robot&apos;s clock, 30 ticks a second, while the recording loop runs.{' '}
            <Cite id="F05-44">LeRobot streaming video encoding docs, sections 1 to 3</Cite> The record command in
            LeRobot&apos;s tutorial turns it on, so a reader who copies that command is on the second path.{' '}
            <Cite id="F05-1">LeRobot imitation learning guide, Record a dataset</Cite>
          </Box>
          <Box variant="p">
            The size of the load follows the pixels, which makes camera resolution the lever. Two 640x480 cameras
            at 30 fps are 2 x 640 x 480 x 30 = 18.4 million pixels per second. LeRobot&apos;s docs rate that load
            &quot;Low&quot; and label it 55M, because their column counts the three colour channels of each pixel.
            Two 1920x1080 cameras are 124 million pixels per second, 373M in the docs&apos; count, rated
            &quot;High&quot; with the note &quot;Requires powerful high-end CPU&quot;.{' '}
            <Cite id="F05-45">LeRobot streaming video encoding docs, section 3</Cite> In the sources read on
            2026-11-20 the sizing stops at those two ratings, with no CPU-utilisation figure for the 640x480 row,
            so the first episode on your own host is the measurement.{' '}
            <Cite id="F05-105">the load of collection, from the recorder&apos;s defaults</Cite>
          </Box>
          <Box variant="p">
            On a small host the encoder and the recording loop draw on the same few cores. The Jetson Orin Nano, a
            small computer of the kind that sits beside a robot, has no hardware video encoder, so every frame it
            records is encoded in software on the CPU.{' '}
            <Cite id="F05-57">Jetson Linux Developer Guide, Software Encode in Orin Nano</Cite> NVIDIA&apos;s Jetson
            Thor modules have hardware encoders for H.264 and HEVC and none for AV1, so an AV1 dataset recorded on a
            Thor is still encoded on the CPU.{' '}
            <Cite id="F05-55">NVIDIA video encode and decode support matrix, Jetson tab</Cite>
          </Box>
          <Box variant="p">
            A recording can go wrong without stopping. The damage is then in the data, and each kind has a check
            you can run on the first episode.
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 720 }}>
              <thead>
                <tr>
                  <th style={TH}>What you would see</th>
                  <th style={TH}>What causes it</th>
                  <th style={TH}>What to check or change</th>
                  <th style={TH}>Source</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={TD}>Frames missing from an episode recorded with streaming encoding</td>
                  <td style={TD}>
                    The encoder fell behind. New frames are dropped and the capture loop keeps running
                  </td>
                  <td style={TD}>
                    The docs read about 5% of frames missing as an overloaded system. Use smaller images, software{' '}
                    <code>h264</code> or a hardware encoder, or turn streaming encoding off so the encode waits for
                    the end of the episode
                  </td>
                  <td style={TD}>
                    <Cite id="F05-45">LeRobot streaming video encoding docs, section 3</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Recorded motion that plays back faster than it happened</td>
                  <td style={TD}>
                    The loop ran under its nominal rate, and timestamps are computed from the frame index
                  </td>
                  <td style={TD}>
                    Read the achieved rate, which the recorder reports in one line for every episode you keep, and
                    discard a session whose rate is off before you train on it
                  </td>
                  <td style={TD}>
                    <Cite id="F05-4">LeRobot imitation learning guide, Cadence reporting</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <code>video.codec</code> in <code>meta/info.json</code> says H.264 or HEVC where you expected
                    AV1
                  </td>
                  <td style={TD}>
                    <code>vcodec=auto</code> found a hardware encoder on the recording host
                  </td>
                  <td style={TD}>Name the codec in the setting</td>
                  <td style={TD}>
                    <Cite id="F05-42">LeRobot configs/video.py, hardware codec list</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>Corrupt Parquet files after a recording script of your own</td>
                  <td style={TD}>
                    <code>dataset.finalize()</code> was skipped. It closes the Parquet writers, which write their
                    footer metadata at that point
                  </td>
                  <td style={TD}>
                    Call it before the script exits. <code>lerobot-record</code> calls it after the last episode
                    and before the upload
                  </td>
                  <td style={TD}>
                    <Cite id="F05-3">LeRobot lerobot_record.py and dataset v3 docs</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Price a session in person-hours, see what taking the robot out of it changes about the data, and settle the record command before the first episode"
          >
            At the recorder&apos;s defaults, a person-hour at the bench buys at most half an hour of data
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The cost no encoder setting reduces is the person. The bench is the teleoperation setup of section 3,
            The Robot as a Computer: you move a leader arm by hand, the follower arm copies it and does the task,
            and one command, <code>lerobot-record</code>, stores the follower&apos;s joint readings, the commanded
            targets and the camera frames of each episode.{' '}
            <Cite id="F05-1">LeRobot imitation learning guide, Record a dataset</Cite>
          </Box>
          <Box variant="p">
            The recorder&apos;s defaults are 30 frames per second, 60 s per episode, 60 s to reset the scene (put
            the block and the cup back) and 50 episodes, with an upload of the finished dataset to the hub switched
            on. One session at those defaults is 50 x (60 + 60) s = 100 minutes of a person&apos;s time, half of it
            resets, for at most 50 minutes of data.{' '}
            <Cite id="F05-2">LeRobot dataset.py, recorder defaults</Cite> An episode can be far shorter than that
            ceiling: the 50 of the public dataset average 7.96 s each. Had each been followed by the default 60 s
            reset, that session would have taken 50 x (7.96 + 60) s = <Derived>56.6</Derived> minutes of a
            person&apos;s time for 6.6 minutes of data, about <Derived>12</Derived>% of it. With episodes that
            short the reset is most of the session, and it is a setting: set <code>reset_time_s</code> to what
            putting the block and the cup back really takes.{' '}
            <Cite id="F05-30">from the file sizes of the example dataset</Cite>{' '}
            <Cite id="F05-2">LeRobot dataset.py, recorder defaults</Cite>
          </Box>
          <Box variant="p">
            Fifty is also the size LeRobot suggests for a first dataset: at least 50 episodes, 10 per object
            location, with the cameras fixed and the object visible in them. LeRobot gives it as advice,
            with no measured threshold behind it. Its rule of thumb for the cameras is a check you can run before the first
            episode: you should be able to do the task yourself looking only at the camera images.{' '}
            <Cite id="F05-5">LeRobot imitation learning guide, Tips for gathering data</Cite>
          </Box>
          <Box variant="p">
            The larger saving is to take the robot out of the session. With a hand-held data collection rig a
            person holds a gripper with a camera mounted on it and does the task directly, wherever the task is,
            and software reconstructs the gripper&apos;s path afterwards from the video and the camera&apos;s
            motion sensor. The idea comes from UMI (Universal Manipulation Interface), a 2024 project built around
            a 3D-printed gripper and an action camera. <Cite id="F05-7">UMI paper, section III</Cite>
          </Box>
          <Box variant="p">
            UMI&apos;s authors report that 3 people recorded 1,400 demonstrations of a cup-arrangement task in 12
            person-hours across 30 locations, which is 1,400 / 12 = 117 per person-hour, gathered with no
            robot present. On that task the authors put the hand-held gripper at more than 3 times faster
            than teleoperation. <Cite id="F05-8">UMI paper, sections V and VI</Cite>
          </Box>
          <Box variant="p">
            The speed has a price in what is recorded. A leader arm stores joint targets for the one follower it is
            paired with, numbers that follower takes with no kinematic model. A rig stores the path of a gripper: in section 3&apos;s terms an end-effector action, which names no
            robot&apos;s joints. Before an arm can follow it, inverse kinematics must convert it into joint angles,
            and that takes a kinematic model of the arm (section 3).{' '}
            <Cite id="F05-7">UMI paper, section III</Cite>{' '}
            <Cite id="F05-23">info.json of the example dataset</Cite>
          </Box>
          <Box variant="p">
            With no robot in the room, collection scales with the number of people, and then hours recorded stop
            being hours kept. HiFi-UMI-2K (July 2026) was collected with a hand-held rig for two hands and six
            synchronised cameras. Its dataset card puts the source corpus at more than 20,000 hours and the public
            release at a curated 2,000-hour subset, and choosing which hours to keep is a computing job of its own
            (section 10, Processing and Curating).{' '}
            <Cite id="F05-10">HiFi-UMI-2K dataset card and LeRobot v0.7.0 release post</Cite>
          </Box>
          <Box variant="p">
            The release uses LeRobot&apos;s format, the one your bench writes, and occupies 16.0 TB: 16.0 TB / 2,000
            h = 8 GB per hour over six cameras, about 1.3 GB per camera-hour, more than three times the example
            dataset&apos;s 387 MB. A camera-hour figure does not carry from one setup to another, and at thousands
            of hours the difference is terabytes.{' '}
            <Cite id="F05-10">HiFi-UMI-2K dataset card and LeRobot v0.7.0 release post</Cite>{' '}
            <Cite id="F05-30">from the file sizes of the example dataset</Cite>
          </Box>
          <Box variant="p">
            One kind of episode still needs the bench and the robot. Once a policy exists, it can drive the arm
            while a person stands by to take over when it is about to fail, and the recovery is saved as new
            training data. <Cite id="F05-6">LeRobot human-in-the-loop data collection guide</Cite> Plain
            demonstrations show the task and never the way back from a slip (section 4, Learning From
            Demonstrations), and this mode records exactly that.
          </Box>
          <Box variant="p">
            For one {ARM} learning to {TASK_STORY}, start with the leader arm: its recordings are joint targets
            this arm takes with no inverse kinematics, and the price is one person, one bench and a reset after
            every episode. Before the first episode, settle the codec, the camera resolution and the GOP on the record command.
            Choose the codec
            for the machine that will train on the data and name it rather than setting <code>auto</code>, which
            lets the recording host choose. Set the camera resolution knowing that two 1920x1080 cameras carry{' '}
            <Derived>(1920 x 1080) / (640 x 480) = 6.75</Derived> times the pixels of two 640x480 ones, and the encode load on the cores
            beside the arm follows the pixels. Leave <code>g</code> at 2 unless whatever reads the data plays each episode
            in order.
          </Box>
          <Box variant="p">
            Then record one episode and check it before you record the rest of the session. Read the achieved rate in the
            recorder&apos;s one-line digest, look for missing frames, and weigh the episode&apos;s video: its bytes
            over its frames, set against a raw frame at your resolution (width x height x 3 bytes; 921,600 at 640x480), give your own ratio in place of this
            dataset&apos;s 257 to 1.{' '}
            <Cite id="F05-4">LeRobot imitation learning guide, Cadence reporting</Cite>{' '}
            <Cite id="F05-30">from the file sizes of the example dataset</Cite> Before you pick a machine to train
            on a dataset someone hands you, open <code>meta/info.json</code> and read <code>video.codec</code> for
            each camera; the public dataset says <code>av1</code>.{' '}
            <Cite id="F05-23">info.json of the example dataset</Cite>
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
