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

const LIST: CSSProperties = { margin: 0, paddingLeft: 22 };

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
        <title id="collecting-disk-title">One episode split into its table rows, its video and its metadata</title>
        <desc>
          One episode at the top branches into three stacked panels. The first panel is a Parquet file of table rows
          with the columns action, observation.state, timestamp and four counters. The second panel holds one MP4 file
          for each camera. The third panel holds the metadata files. In each shared file, one segment is outlined: the
          segment that belongs to this episode.
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
          Numbers: one Parquet row per time step
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
          The table rows hold no pixels.
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
        <title id="collecting-weight-title">How the example dataset's bytes split by file, and stored video compared with uncompressed frames</title>
        <desc>
          The figure shows two bars. The first bar splits the 86.1 MB of the example dataset into the side camera
          video, the up camera video and a thin sliver for everything else. The second bar compares one hour of
          uncompressed frames from two cameras, 199 GB, with the same hour as stored video, 775 MB, which is only a
          sliver.
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
          the dark sliver: table rows, 0.37 MB, and metadata
        </text>

        <text x={x0} y={124} fontFamily="sans-serif" fontSize={13} fontWeight={700} fill={INK}>
          One hour of recording, two cameras
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
          The figure shows two strips of twelve video frames. In the first strip, every second frame is a keyframe,
          and returning the tenth frame means decoding two frames. In the second strip, only the first frame is a
          keyframe, and returning the tenth frame means decoding ten frames.
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
          Outlined: the frame the training job asked for.
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
            description="Almost all of a recorded episode's size is camera video, and you choose how that video is compressed when you record it. That choice affects the disk space a dataset needs and the decoding work that every later training job must do. Using LeRobot v0.7.0 and one public dataset, you can estimate both, along with what a recording session costs in a person's time."
          >
            9. Collecting Data: Episode Size and Video Compression
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            One recorded attempt at the task is called an episode. For the {ARM}, an episode is one attempt to{' '}
            {TASK_STORY}. LeRobot stores each episode as two kinds of data of very different size. The first is a
            table with one row for each step of the arm&apos;s control loop, which runs 30 times per second. The
            second is compressed video, with one stream for each camera.
          </Box>
          <Box variant="p">
            The video takes up almost all of the space. A public pick-and-place dataset of 50 episodes, recorded in
            the same format this arm uses, is 86.1 MB in total. Its two camera files take 45.5 MB and 40.1 MB of
            that. Every joint reading and every command of all 50 episodes fits in a table of 0.37 MB.{' '}
            <Cite id="F05-29">Hugging Face hub file listing of the example dataset</Cite>
          </Box>
          <Box variant="p">
            The video files are this small because the video is heavily compressed. Together they hold 11,939 frames
            from each of the two cameras in 85,666,122 bytes, which is 3,588 bytes per frame. An uncompressed
            640x480 colour frame takes 640 x 480 x 3 = 921,600 bytes. So in this one dataset, the video is
            compressed by a ratio of about 257 to 1. At that ratio, one hour of recording takes about 387 MB per
            camera, or 775 MB for both cameras. The same hour as uncompressed frames would take 199 GB. So for one
            arm recording its own demonstrations, disk space is the cheap part of collecting data.{' '}
            <Cite id="F05-30">from the file sizes of the example dataset</Cite>
          </Box>
          <Figure
            cites="F05-29 F05-30"
            caption={
              <>
                Both bars are drawn to scale. The top bar splits the public dataset by file. The bottom bar compares
                one hour of recording from two cameras as uncompressed frames and as stored video, using the
                compression ratio of this one dataset.
              </>
            }
          >
            <WeightDiagram />
          </Figure>
          <Box variant="p">
            Compression saves disk space but costs computing time, and you pay that cost twice. You pay once to compress the
            video, on the CPU cores of the computer next to the arm. You pay again to decompress it, every time a
            training job reads a frame. How much work each decompression takes depends on the settings you used to
            compress the video.
          </Box>
          <Box variant="p">
            You choose two compression settings at the bench. The bench is the recording setup where a person drives
            the arm through each episode by teleoperation (section 3, The Robot as a Computer). Every job that later
            reads the data has to work with the settings you chose there.
          </Box>
          <Box variant="p">
            The first setting is the codec. A codec is the method that compresses video into a file and turns the
            file back into frames when it is read. The part that compresses is the encoder, and the part that turns
            the file back into frames is the decoder. In section 3, The Robot as a Computer, the word encoder meant
            the angle sensor on a joint. From here to the end of section 11, Augmentation and Synthetic Data, it
            means the video compressor. Only machines that have a decoder for your codec can read the video.
          </Box>
          <Box variant="p">
            The second setting is how often the video stores a complete frame. This spacing controls how many frames
            a training job must decode to get the one frame it asked for. By default, LeRobot v0.7.0 uses the
            settings that make reading fast. It stores a complete frame every second frame, and it compresses the
            video with the encoder that its documentation rates as the most CPU-intensive.{' '}
            <Cite id="F05-35">LeRobot configs/video.py, encoder defaults</Cite>{' '}
            <Cite id="F05-43">LeRobot streaming video encoding docs, Choosing a Codec</Cite>
          </Box>
          <Box variant="p">
            Apart from disk space, a recording session costs two things at the bench: the CPU cores that compress
            the video, and a person&apos;s time. With the recorder&apos;s default settings, a session of 50 episodes
            takes 100 minutes of a person&apos;s time and produces at most 50 minutes of data.{' '}
            <Cite id="F05-2">LeRobot dataset.py, recorder defaults</Cite>
          </Box>
          <ExpandableSection headerText="The example dataset, file by file" variant="footer">
            <SpaceBetween size="s">
              <Box variant="p">
                The example dataset is <code>{EXAMPLE_DATASET}</code> on the Hugging Face hub. The Hugging Face hub
                is the site where LeRobot datasets are published. The dataset holds 11,939 frames at 30 fps from two
                640x480 cameras, which is 6.6 minutes of recording. Its metadata records the robot type as{' '}
                <code>so100_follower</code>. LeRobot uses that name for both the SO-100 and the SO-101, so the files
                do not prove that an SO-101 recorded the dataset.{' '}
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
                      <td style={TD}>Video from the side camera, for all 50 episodes</td>
                    </tr>
                    <tr>
                      <td style={TD}>
                        <code>videos/observation.images.up/chunk-000/file-000.mp4</code>
                      </td>
                      <td style={TD}>40.1 MB</td>
                      <td style={TD}>Video from the up camera, for all 50 episodes</td>
                    </tr>
                    <tr>
                      <td style={TD}>
                        <code>data/chunk-000/file-000.parquet</code>
                      </td>
                      <td style={TD}>0.37 MB</td>
                      <td style={TD}>The table rows for all 11,939 frames</td>
                    </tr>
                    <tr>
                      <td style={TD}>
                        <code>meta/episodes/chunk-000/file-000.parquet</code>
                      </td>
                      <td style={TD}>72,560 bytes</td>
                      <td style={TD}>One row per episode, which says where the episode sits in the data and video files</td>
                    </tr>
                    <tr>
                      <td style={TD}>
                        <code>meta/stats.json</code>
                      </td>
                      <td style={TD}>5,914 bytes</td>
                      <td style={TD}>Statistics for each column</td>
                    </tr>
                    <tr>
                      <td style={TD}>
                        <code>meta/info.json</code>
                      </td>
                      <td style={TD}>3,401 bytes</td>
                      <td style={TD}>The schema, the frame rate and the codec</td>
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
                The joint data takes about 31 bytes per row, which is 3.3 MB per hour of recording. So almost all of
                a dataset&apos;s disk space goes to video. To estimate it, multiply the number of cameras by the hours
                recorded and by the size of one hour of video from one camera, which is 387 MB in this dataset. That
                figure comes from one scene at one image size, and the dataset&apos;s{' '}
                <code>info.json</code> does not record the compression settings that produced the files. So the 257
                to 1 ratio does not tell you for certain what LeRobot v0.7.0&apos;s default settings produce.{' '}
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
            description="An episode has no files of its own. Its rows and its video are stored inside a few files that many episodes share, and a metadata row records where. From that metadata row and a row's timestamp, you can compute the exact time in the video file at which LeRobot's dataset reader finds a frame."
          >
            How an episode is stored on disk
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The recorder writes three kinds of file, and none of them belongs to a single episode:
          </Box>
          <ul style={LIST}>
            <li>
              <strong>Parquet files</strong> hold the numbers: joint states, actions and timestamps. Parquet is a
              compressed table format that stores the data column by column.
            </li>
            <li>
              <strong>MP4 files</strong> hold the compressed camera frames.
            </li>
            <li>
              <strong>Metadata files</strong>, in JSON and Parquet, describe the schema and record where each
              episode starts and ends.{' '}
              <Cite id="F05-17">LeRobot dataset v3 docs, lines 58 to 62</Cite>
            </li>
          </ul>
          <Box variant="p">
            This layout is version 3.0 of the LeRobot dataset format, the version that LeRobot v0.7.0 uses.{' '}
            <Cite id="F05-16">LeRobot dataset_metadata.py, line 64</Cite>
          </Box>
          <Box variant="p">
            The Parquet table has one row for each time step. It has a column for each camera, but those columns hold no
            pixels. Their type is <code>video</code>, which means that the pixels are stored in the MP4 files. So a
            training sample is built from one row of the table plus the matching frames, decoded from each
            camera&apos;s video. <Cite id="F05-23">info.json of the example dataset</Cite>
          </Box>
          <Box variant="p">
            Each row also holds two columns of numbers. The <code>action</code> column holds six <code>float32</code> joint targets, and the{' '}
            <code>observation.state</code> column holds six <code>float32</code> measured joint positions. The
            recorder also fills in five bookkeeping columns on every row. Two of them are <code>timestamp</code> and{' '}
            <code>frame_index</code>. The <code>frame_index</code> column holds the number of the time step inside
            its episode. <Cite id="F05-22">LeRobot constants.py, default features</Cite>
          </Box>
          <Figure
            cites="F05-17 F05-18 F05-22 F05-23 F05-24 F05-29"
            caption={
              <>
                One episode is stored as rows in a shared Parquet file, as frames in one shared MP4 file for each
                camera, and as one metadata row that says where the episode&apos;s part of each file is. That part is
                outlined in each strip. The file paths are those of the public dataset. Each strip is an
                illustration that shows ten episodes. In the public dataset, each file holds 50 episodes.
              </>
            }
          >
            <EpisodeOnDiskDiagram />
          </Figure>
          <Box variant="p">
            When an episode ends, the recorder&apos;s dataset writer appends the episode&apos;s video to the current MP4
            file of each camera.
            It starts a new file only when the current one would reach its size target.{' '}
            <Cite id="F05-19">LeRobot dataset_writer.py, lines 547 to 569</Cite> The writer then adds one metadata
            row for the episode. That row records which data file holds the episode, and the episode&apos;s first
            and last row in that file. For each camera, the row also records which video file holds the episode,
            and the times at which the episode starts and ends inside that file.{' '}
            <Cite id="F05-24">LeRobot dataset_writer.py, episode metadata</Cite>
          </Box>
          <Box variant="p">
            In LeRobot v0.7.0, the size target for a video file is 200 MB. One hour of video from one camera is
            called a camera-hour, and at this dataset&apos;s compression ratio a camera-hour of video is about 387
            MB. So an hour made of many short episodes fills about two video files per camera. The writer never
            splits an episode across files, so a single episode that lasts an hour becomes one 387 MB file. As an
            illustration, three <Toy>20</Toy>-minute episodes of <Derived>129</Derived> MB each become three files,
            because adding a second episode to a file would take it past the 200 MB target. As a result, the number
            of files depends mostly on the number of bytes recorded, and much less on the number of episodes. In
            version 3, the number of files is about the total size divided by the size target. Version 2 of the
            format wrote one file per episode. LeRobot&apos;s documentation says the format is designed for millions
            of episodes, and at that scale version 2 meant millions of files.{' '}
            <Cite id="F05-19">LeRobot dataset v3 docs, lines 19 to 22 and 64</Cite>{' '}
            <Cite id="F05-20">LeRobot datasets/utils.py, size defaults</Cite>{' '}
            <Cite id="F05-30">from the file sizes of the example dataset</Cite>
          </Box>
          <Box variant="p">
            To read one camera frame back, LeRobot&apos;s dataset reader only has to add two times. A row&apos;s{' '}
            <code>timestamp</code> is the time of that row inside its own episode. For each camera, the
            episode&apos;s metadata row holds <code>from_timestamp</code>, the time at which the episode begins
            inside that camera&apos;s shared MP4 file. The reader adds the two and asks the decoder for the frame at
            that time. <Cite id="F05-25">LeRobot dataset_reader.py, lines 429 to 446</Cite>
          </Box>
          <Box variant="p">
            <code style={FORMULA}>seek time = timestamp + from_timestamp</code>
          </Box>
          <Box variant="p">
            The first term gives the frame&apos;s position inside its episode, and the second term gives the
            episode&apos;s position inside the file. Here is an example with invented numbers. Take an episode that
            begins <Toy>55.7</Toy> s into the side camera&apos;s file. Its row with <code>frame_index</code>{' '}
            <Toy>45</Toy> has a timestamp of <Toy>45</Toy> / 30 = <Toy>1.5</Toy> s, so the reader asks the decoder
            for the frame at <Toy>55.7</Toy> + <Toy>1.5</Toy> = <Toy>57.2</Toy> s. The addition costs nothing. The
            expensive step is the decoding, which produces the frame at that time from the compressed file. You set
            how much the decoding costs when you write the video.
          </Box>
          <Box variant="p">
            The division in that example is how the recorder computes every timestamp. It divides the frame&apos;s
            index by the nominal frame rate, which is the rate the recorder was asked to run at, and it does not
            read a clock. So if the recording loop really ran at 25 Hz, the dataset still says 30 Hz. According to
            its timestamps, the motion it holds is then 30 / 25 = <Derived>1.2</Derived> times faster than the
            motion the person made. <Cite id="F05-4">LeRobot imitation learning guide, Cadence reporting</Cite>
          </Box>
          <Capture
            file="so101-episode-strip.jpg"
            kind="still"
            width={1800}
            height={300}
            alt="Six frames from one episode, left to right: the arm above the block, the gripper around it, the block lifted, carried over the cup and released."
            caption={
              <>
                The six frames come from one episode and are shown in time order. In a recorded episode, each frame
                has the same timestamp as one row of the table, and the reader uses that timestamp to find the frame
                in the video. These frames were rendered from a simulated SO-101 in MuJoCo, the physics simulator
                covered in section 12, Physics Simulation. They do not come from the public dataset.
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
                The clip shows the same simulated episode from an overhead camera and from a camera on the gripper.
                Each camera is stored as its own video file in the dataset, and these two video streams are the
                images that a policy receives as input.
              </>
            }
            provenance={MUJOCO_SO101}
          />
          <ExpandableSection headerText="File size targets, and loading an older v2.1 dataset" variant="footer">
            <SpaceBetween size="s">
              <Box variant="p">
                In LeRobot v0.7.0, the default size targets are at most 100 MB for each data Parquet file and 200 MB
                for each video file. Each <code>chunk-NNN</code> directory holds at most 1,000 files by default, and
                after that the writer starts the next directory. A dataset written by an earlier release keeps the
                size target it was written with. For example, the public dataset records a video file target of 500
                MB.{' '}
                <Cite id="F05-20">LeRobot datasets/utils.py, size defaults</Cite>{' '}
                <Cite id="F05-21">LeRobot datasets/utils.py, lines 329 to 335</Cite>
              </Box>
              <Box variant="p">
                LeRobot refuses to load a dataset in format v2.1, which stores one file per episode. The error
                message names the script that converts it. That script, <code>convert_dataset_v21_to_v30</code>,
                merges the per-episode files into shared files and writes the episode offsets, the positions of each
                episode inside the shared files.{' '}
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
            description="A training job reads frames from random places in a video. To return one frame, the decoder may first have to decode several others, and how many depends on how often the video stores a complete frame. You can use this to judge LeRobot's three default encoder settings, and to choose a codec that your training machine can decode."
          >
            Keyframes and the cost of reading a random frame
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The 257 to 1 compression ratio comes from the codec. Its two halves, the encoder and the decoder, run at
            different times and on different machines. The encoder compresses the video once, on the computer next
            to the robot. The decoder decompresses it every time anyone reads a frame, on whichever machine runs the
            training.
          </Box>
          <Box variant="p">
            Video can be compressed this much because consecutive frames show almost the same picture. The encoder
            stores some frames whole. A frame stored whole is called a keyframe, and it can be decoded on its own.
            The frames after a keyframe are stored as differences from the frames before them. Because of this, the
            cost of reading a frame depends on where the frame sits. To return one requested frame, a decoder loads
            the keyframe before it and decodes every frame from there up to the requested one.{' '}
            <Cite id="F05-37">LeRobot video_utils.py, decoder docstrings</Cite>
          </Box>
          <Box variant="p">
            The spacing of the keyframes is called the GOP (group of pictures) size. A GOP size of <code>g</code>{' '}
            means one keyframe every <code>g</code> frames.{' '}
            <Cite id="F05-36">LeRobot video encoding parameters, tuning table</Cite> A film is watched in order, so
            its keyframes can be far apart, and each frame is decoded once as playback moves through the file.
            Training reads video in a different way: the data loader asks for a few frames at random places in the
            dataset. <Cite id="F05-64">LeRobot video benchmark README (2024), Requested timestamps</Cite>
          </Box>
          <Box variant="p">
            With a GOP of 2, the decoder decodes at most 2 frames to return a requested frame. As an illustration,
            take a GOP of 250, a common setting for streamed video. With that GOP, a random read decodes up to 250
            frames. In the worst case, that is 250 / 2 = 125 times as much decoding per random read as with a GOP of
            2. On the other hand, more keyframes make the file larger. The example dataset does not
            record its GOP size. To measure how much larger the file gets for your own scene, record one episode
            with <code>g</code> = 2 and one with a long GOP, and compare the sizes of the two files.{' '}
            <Cite id="F05-37">LeRobot video_utils.py, decoder docstrings</Cite>{' '}
            <Cite id="F05-29">Hugging Face hub file listing of the example dataset</Cite>
          </Box>
          <Figure
            cites="F05-36 F05-37"
            caption={
              <>
                Each strip shows twelve consecutive frames of one video. The bracket under a strip spans the frames
                that the decoder must decode to return the outlined frame. The figure is an illustration, not a
                measurement, and the second strip uses a GOP of 12 so that it fits on the page.
              </>
            }
          >
            <GopDiagram />
          </Figure>
          <Box variant="p">
            By default, LeRobot decodes video on CPU cores, and one random read there already takes milliseconds.{' '}
            <Cite id="F05-39">LeRobot video_utils.py, decode backends</Cite> An open pull request to LeRobot times
            one random sample from a two-camera, 50-episode dataset at about 5 ms. That figure is a median from one
            process with a warm file cache, and the pull request does not state the hardware.{' '}
            <Cite id="F05-62">LeRobot pull request 4549</Cite> Section 10, Processing and Curating, uses that time to
            work out how many data loader workers a GPU needs. Every extra frame that must be decoded per requested
            frame raises that number.
          </Box>
          <Box variant="p">
            LeRobot v0.7.0 has three encoder settings that control these costs, listed in the table below. The first
            two, the codec and the GOP size, set what each read costs. The third, the CRF (constant rate factor),
            trades image quality against file size.
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 560 }}>
              <thead>
                <tr>
                  <th style={TH}>Setting</th>
                  <th style={TH}>Default</th>
                  <th style={TH}>What it is and what it affects</th>
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
                    AV1 (AOMedia Video 1) is a video compression standard. The default, <code>libsvtav1</code>, is
                    SVT-AV1, a software encoder for AV1, so it runs on CPU cores. Every machine that reads the
                    dataset needs an AV1 decoder.{' '}
                    <Cite id="F05-35">LeRobot configs/video.py, encoder defaults</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    GOP size, <code>g</code>
                  </td>
                  <td style={TD}>2</td>
                  <td style={TD}>
                    The video stores a keyframe every second frame. A random read decodes at most 2 frames, and the
                    file is larger than it would be with a long GOP.{' '}
                    <Cite id="F05-37">LeRobot video_utils.py, decoder docstrings</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    CRF, <code>crf</code>
                  </td>
                  <td style={TD}>30</td>
                  <td style={TD}>
                    CRF is the encoder&apos;s quality setting: a single number for how much detail the encoder may
                    discard. A lower value gives better quality and larger files.{' '}
                    <Cite id="F05-35">LeRobot configs/video.py, encoder defaults</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">
            LeRobot&apos;s documentation rates the default encoder as the most CPU-intensive of its options. It says
            that{' '}
            <code>libsvtav1</code> is the default &quot;because it provides the best training performance&quot;, and
            that other codecs &quot;can reduce CPU usage and be faster, but they typically produce larger
            files and may affect training time&quot;.{' '}
            <Cite id="F05-43">LeRobot streaming video encoding docs, Choosing a Codec</Cite> The table below compares
            the default with software <code>h264</code> and with hardware encoders. A hardware encoder is a fixed
            circuit in a GPU or processor that compresses video without loading the CPU cores.
          </Box>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 600 }}>
              <thead>
                <tr>
                  <th style={TH}>Encoder</th>
                  <th style={TH}>CPU use during recording, as LeRobot rates it</th>
                  <th style={TH}>File size, as LeRobot rates it</th>
                  <th style={TH}>Codec that reading jobs must decode</th>
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
                    H.264 or HEVC (High Efficiency Video Coding), a third video compression standard that is also
                    called H.265. None of the hardware encoders in LeRobot&apos;s list writes AV1.{' '}
                    <Cite id="F05-42">LeRobot configs/video.py, hardware codec list</Cite>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Box variant="p">
            LeRobot lists six hardware encoders, and all of them write H.264 or HEVC. So if you move the
            encoding work off the CPU, the jobs that read the data must decode a different codec. The setting{' '}
            <code>vcodec=auto</code> makes this choice for you. It picks the first hardware encoder that the
            recording computer offers, and it falls back to <code>libsvtav1</code> only when there is none. As a
            result, the same record command writes different codecs on different benches.{' '}
            <Cite id="F05-42">LeRobot configs/video.py, hardware codec list</Cite>
          </Box>
          <Box variant="p">
            LeRobot chose these defaults based on its own video benchmark from 2024. The benchmark measured both
            file size and read speed for three codecs, at a GOP of 2 and a CRF of 30, on a real-world dataset of
            480x640 images. In that benchmark, the AV1 video was the largest of the three. It was 5.59% of the size
            of the original images, against 2.14% for H.264 and 1.38% for H.265. On the other hand, AV1 was the
            fastest to read:
            it loaded six consecutive frames in 0.48 times the time that the original images took, the best result
            in the table. LeRobot chose AV1 &quot;considering these results&quot;.{' '}
            <Cite id="F05-63">LeRobot video benchmark README at v0.4.0</Cite>
          </Box>
          <Box variant="p">
            The two LeRobot sources rank the file sizes differently. The current documentation rates{' '}
            <code>libsvtav1</code> as &quot;Smallest&quot;, while the 2024 benchmark found that AV1 produced the
            largest file. Both rankings can be true, because a CRF of 30 gives a different quality in each codec.
            Either way, the documentation gives &quot;the best training performance&quot; as the reason for AV1, so
            the default was chosen for fast reading. The benchmark&apos;s percentages were measured against its own
            images, on a different dataset. Use them to rank the codecs, not to estimate disk space.{' '}
            <Cite id="F05-43">LeRobot streaming video encoding docs, Choosing a Codec</Cite>{' '}
            <Cite id="F05-63">LeRobot video benchmark README at v0.4.0</Cite>
          </Box>
          <Box variant="p">
            Before you change any of the three settings, decide which machine will train on the data. Whether AV1 is
            acceptable depends on the decoders that machine has. If the machine decodes on CPU cores, every frame
            you add to the GOP size adds decoding work for those cores. Section 10, Processing and Curating, lists
            which GPUs decode AV1 in hardware.{' '}
            <Cite id="F05-39">LeRobot video_utils.py, decode backends</Cite>
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The video is encoded on the CPU cores of the computer next to the arm, while the recording loop runs on the same computer. You can lower or move that load with the camera resolution, the choice of encoder and the streaming encoding option. You can also catch a faulty recording by checking its first episode."
          >
            Encoding load on the computer next to the arm
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The default encoder runs in software, and with the default settings the recorder runs no model. So data
            collection loads the CPU cores of the recording computer and does not use its GPU.{' '}
            <Cite id="F05-105">the load of collection, from the recorder&apos;s defaults</Cite>
          </Box>
          <Box variant="p">
            By default, the recorder writes each frame to disk as a PNG image and encodes the episode to MP4 after
            the episode ends. The option <code>--dataset.streaming_encoding=true</code> turns on streaming encoding
            instead. With streaming encoding, frames go straight to an encoder thread while they are captured, and
            saving an episode becomes almost instant. In exchange, the CPU cores now have to encode video in real
            time, 30 frames per second, while the recording loop runs.{' '}
            <Cite id="F05-44">LeRobot streaming video encoding docs, sections 1 to 3</Cite> The record command in
            LeRobot&apos;s tutorial turns streaming encoding on, so if you copy that command, you are using it.{' '}
            <Cite id="F05-1">LeRobot imitation learning guide, Record a dataset</Cite>
          </Box>
          <Box variant="p">
            The encoding load grows with the number of pixels per second, so camera resolution is the main setting
            you can use to change it. Two 640x480 cameras at 30 fps produce 2 x 640 x 480 x 30 = 18.4 million pixels
            per second. LeRobot&apos;s documentation rates that load as &quot;Low&quot; and labels it 55M, because
            its table counts the three colour channels of each pixel. Two 1920x1080 cameras produce 124 million
            pixels per second, which is 373M in the documentation&apos;s count. The documentation rates that load as
            &quot;High&quot;, with the note &quot;Requires powerful high-end CPU&quot;.{' '}
            <Cite id="F05-45">LeRobot streaming video encoding docs, section 3</Cite> In the LeRobot and
            NVIDIA sources cited in this section, the sizing of the encoding load stops at those two ratings, and
            none of them gives a CPU-utilisation figure for the 640x480 row. So to know the real load, measure it while you record the
            first episode on your own computer.{' '}
            <Cite id="F05-105">the load of collection, from the recorder&apos;s defaults</Cite>
          </Box>
          <Box variant="p">
            On a small computer, the encoder and the recording loop share the same few CPU cores. The NVIDIA Jetson
            Orin Nano is a small onboard computer of the kind used next to a robot. It has no hardware video
            encoder, so every frame it records is encoded in software on the CPU.{' '}
            <Cite id="F05-57">Jetson Linux Developer Guide, Software Encode in Orin Nano</Cite> NVIDIA&apos;s Jetson
            Thor modules have hardware encoders for H.264 and HEVC, but none for AV1. So an AV1 dataset recorded on
            a Jetson Thor is still encoded on the CPU.{' '}
            <Cite id="F05-55">NVIDIA video encode and decode support matrix, Jetson tab</Cite>
          </Box>
          <Box variant="p">
            A recording can go wrong without stopping or reporting an error, and then the problem ends up in the
            data. Each
            problem in the table below has a check that you can run on the first episode.
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
                  <td style={TD}>Frames are missing from an episode recorded with streaming encoding.</td>
                  <td style={TD}>
                    The encoder could not keep up. New frames are dropped, and the capture loop keeps running.
                  </td>
                  <td style={TD}>
                    LeRobot&apos;s documentation treats about 5% of frames missing as a sign of an overloaded system.
                    Use smaller images, software <code>h264</code> or a hardware encoder. You can also turn streaming
                    encoding off, so that encoding waits until the episode ends.
                  </td>
                  <td style={TD}>
                    <Cite id="F05-45">LeRobot streaming video encoding docs, section 3</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>The recorded motion plays back faster than it happened.</td>
                  <td style={TD}>
                    The recording loop ran slower than its nominal rate, and the timestamps are computed from the
                    frame index.
                  </td>
                  <td style={TD}>
                    Check the achieved rate, which the recorder reports in one line for every episode you keep. If
                    the rate is off, discard the session before you train on it.
                  </td>
                  <td style={TD}>
                    <Cite id="F05-4">LeRobot imitation learning guide, Cadence reporting</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>
                    <code>video.codec</code> in <code>meta/info.json</code> says H.264 or HEVC when you expected
                    AV1.
                  </td>
                  <td style={TD}>
                    The setting <code>vcodec=auto</code> found a hardware encoder on the recording computer.
                  </td>
                  <td style={TD}>Set the codec by name instead of using auto.</td>
                  <td style={TD}>
                    <Cite id="F05-42">LeRobot configs/video.py, hardware codec list</Cite>
                  </td>
                </tr>
                <tr>
                  <td style={TD}>The Parquet files are corrupt after a recording script that you wrote yourself.</td>
                  <td style={TD}>
                    The script did not call <code>dataset.finalize()</code>. That call closes the Parquet writers,
                    and the writers write their footer metadata when they close.
                  </td>
                  <td style={TD}>
                    Call <code>dataset.finalize()</code> before the script exits. The <code>lerobot-record</code>{' '}
                    command calls it after the last episode and before the upload.
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
            description="At LeRobot's default settings, one hour of a person's time at the bench produces at most half an hour of data. You can estimate a session's cost in person-hours, decide whether a hand-held rig without a robot suits your data, and fix the settings of the record command before the first episode."
          >
            Planning a recording session
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            One cost that no encoder setting reduces is the person&apos;s time. At the bench, you move a leader arm
            by hand, and the follower arm copies its movements and does the task (section 3, The Robot as a
            Computer). One command, <code>lerobot-record</code>, stores the
            follower&apos;s joint readings, the commanded targets and the camera frames of each episode.{' '}
            <Cite id="F05-1">LeRobot imitation learning guide, Record a dataset</Cite>
          </Box>
          <Box variant="p">
            The recorder&apos;s default settings are 30 frames per second, a limit of 60 s per episode and 50
            episodes per session. Between episodes, the defaults allow 60 s to reset the scene, which means putting the block and
            the cup back in place. Uploading the finished dataset to the Hugging Face hub is switched on by default. At those
            defaults, one session takes 50 x (60 + 60) s = 100 minutes of a person&apos;s time. Half of that time is
            spent on resets, and the session produces at most 50 minutes of data.{' '}
            <Cite id="F05-2">LeRobot dataset.py, recorder defaults</Cite>
          </Box>
          <Box variant="p">
            An episode can be much shorter than the 60 s limit. The 50 episodes of the public dataset average 7.96 s
            each. If each of them had been followed by the default 60 s reset, the session would have taken 50 x
            (7.96 + 60) s = <Derived>56.6</Derived> minutes of a person&apos;s time for 6.6 minutes of data. The data
            would then be only about <Derived>12</Derived>% of the session. With episodes that short, resets take up
            most of the session. The reset time is a setting, so set <code>reset_time_s</code> to the time it really
            takes to put the block and the cup back.{' '}
            <Cite id="F05-30">from the file sizes of the example dataset</Cite>{' '}
            <Cite id="F05-2">LeRobot dataset.py, recorder defaults</Cite>
          </Box>
          <Box variant="p">
            Fifty is also the number of episodes LeRobot suggests for a first dataset. Its guide recommends at least
            50 episodes, with 10 for each location of the object. It also recommends keeping the cameras fixed and
            the object visible in the camera images. LeRobot presents these numbers as advice, not as a measured threshold. Its rule of thumb
            for the cameras is a check you can run before the first episode: you should be able to do the task
            yourself while looking only at the camera images.{' '}
            <Cite id="F05-5">LeRobot imitation learning guide, Tips for gathering data</Cite>
          </Box>
          <Box variant="p">
            You save more of the person&apos;s time by recording without the robot. One way to do this is a
            hand-held data collection rig. A person holds a gripper with a camera mounted on it and does the task
            directly, wherever the task takes place. Afterwards, software reconstructs the gripper&apos;s path from
            the video and from the camera&apos;s motion sensor. The idea comes from UMI (Universal Manipulation
            Interface), a project from 2024 built around a 3D-printed gripper and an action camera.{' '}
            <Cite id="F05-7">UMI paper, section III</Cite>
          </Box>
          <Box variant="p">
            UMI&apos;s authors report that 3 people recorded 1,400 demonstrations of a cup-arrangement task in 12
            person-hours, across 30 locations and with no robot present. That is 1,400 / 12 = 117 demonstrations per
            person-hour. On that task, the authors report that the hand-held gripper was more than 3 times faster
            than teleoperation. <Cite id="F05-8">UMI paper, sections V and VI</Cite>
          </Box>
          <Box variant="p">
            The faster method records a different kind of data. A leader arm records joint targets for the one
            follower arm it is paired with, and that follower can use them directly, without a kinematic model. A
            hand-held rig records the path of a gripper. Section 3, The Robot as a Computer, calls this an
            end-effector action. It describes where the gripper goes and does not refer to any robot&apos;s joints.
            Before an arm can follow it, inverse kinematics must convert it into joint angles. That conversion needs
            a kinematic model of the arm, which section 3 builds.{' '}
            <Cite id="F05-7">UMI paper, section III</Cite>{' '}
            <Cite id="F05-23">info.json of the example dataset</Cite>
          </Box>
          <Box variant="p">
            Without a robot in the room, the amount of data you can collect grows with the number of people
            recording. At that scale, you may keep only part of what you record. HiFi-UMI-2K, a dataset from July
            2026, was collected with a hand-held rig for two hands with six synchronised cameras. According to its
            dataset card, the recordings it was drawn from total more than 20,000 hours, and the public release is a
            curated subset of 2,000 hours. Choosing which hours to keep is a computing job of its own, covered in
            section 10, Processing and Curating.{' '}
            <Cite id="F05-10">HiFi-UMI-2K dataset card and LeRobot v0.7.0 release post</Cite>
          </Box>
          <Box variant="p">
            The release uses the same LeRobot format that your bench writes, and it takes 16.0 TB. That is 16.0 TB /
            2,000 h = 8 GB per hour across six cameras, or about 1.3 GB per camera-hour. This is more than three
            times the example dataset&apos;s 387 MB per camera-hour. So a camera-hour figure from one setup does not
            carry over to another, and at thousands of hours the difference adds up to terabytes.{' '}
            <Cite id="F05-10">HiFi-UMI-2K dataset card and LeRobot v0.7.0 release post</Cite>{' '}
            <Cite id="F05-30">from the file sizes of the example dataset</Cite>
          </Box>
          <Box variant="p">
            One kind of episode still needs the bench and the robot. Once you have a trained policy, it can drive
            the arm while a person watches and takes over when the policy is about to fail. The person&apos;s
            recovery is then saved as new training data. LeRobot&apos;s guide to human-in-the-loop data
            collection describes this way of recording.{' '}
            <Cite id="F05-6">LeRobot human-in-the-loop data collection guide</Cite> Ordinary demonstrations show how
            to do the task, but they never show how to recover from a mistake (section 4, Learning From
            Demonstrations). This way of recording captures exactly those recoveries.
          </Box>
          <Box variant="p">
            For one {ARM} learning to {TASK_STORY}, start with the leader arm. Its recordings are joint targets that
            this arm can use without inverse kinematics. The cost is one person, one bench and a reset after every
            episode. Before the first episode, fix three settings on the record command:
          </Box>
          <ul style={LIST}>
            <li>
              <strong>Codec.</strong> Choose the codec for the machine that will train on the data, and set it by
              name. Do not use <code>auto</code>, because <code>auto</code> lets the recording computer choose.
            </li>
            <li>
              <strong>Camera resolution.</strong> Two 1920x1080 cameras carry{' '}
              <Derived>(1920 x 1080) / (640 x 480) = 6.75</Derived> times the pixels of two 640x480 cameras. The
              encoding load on the CPU cores of the computer next to the arm grows with the pixels.
            </li>
            <li>
              <strong>GOP size.</strong> Leave <code>g</code> at 2, unless every job that reads the data plays each
              episode in order.
            </li>
          </ul>
          <Box variant="p">
            Then record one episode and check it before you record the rest of the session:
          </Box>
          <ul style={LIST}>
            <li>
              <strong>Frame rate.</strong> Read the achieved rate in the one-line summary that the recorder prints
              for the episode.{' '}
              <Cite id="F05-4">LeRobot imitation learning guide, Cadence reporting</Cite>
            </li>
            <li>
              <strong>Missing frames.</strong> Check that the episode has all of its frames.
            </li>
            <li>
              <strong>Compression ratio.</strong> Divide the size of the episode&apos;s video by its number of
              frames. Then divide the size of an uncompressed frame at your resolution, which is width x height x 3
              bytes (921,600 bytes at 640x480), by that result. This gives your own ratio, to use in place of this
              dataset&apos;s 257 to 1.{' '}
              <Cite id="F05-30">from the file sizes of the example dataset</Cite>
            </li>
          </ul>
          <Box variant="p">
            When someone hands you a dataset, check its codec before you choose a machine to train on it. Open{' '}
            <code>meta/info.json</code> and read <code>video.codec</code> for each camera. In the public dataset, it
            says <code>av1</code>. <Cite id="F05-23">info.json of the example dataset</Cite>
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
