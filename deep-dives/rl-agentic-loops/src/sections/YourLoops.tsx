import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Link from '@cloudscape-design/components/link';
import { Cite, arxiv, gh, AUTORESEARCH_SHA } from '../components/Cite';

/* ------------------------------------------------------------------------ */
/* Sources                                                                  */
/* ------------------------------------------------------------------------ */

const AR_REPO = 'karpathy/autoresearch';
const ar = (path: string, lines?: string) => gh(AR_REPO, AUTORESEARCH_SHA, path, lines);
const FUNSEARCH = 'https://www.nature.com/articles/s41586-023-06924-6';
const ALPHAEVOLVE = arxiv('2506.13131v1');
const RALPH = 'https://ghuntley.com/ralph/';
const BANDITS = arxiv('2403.15371v3');
const BEDROCK_CACHING = 'https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-caching.html';

/* ------------------------------------------------------------------------ */
/* Diagram: three loops on RL's five parts                                  */
/* ------------------------------------------------------------------------ */

type Mark = 'present' | 'missing' | 'weak';

interface MapCell {
  mark: Mark;
  /** Short tag shown on the first line of a marked cell. */
  tag?: string;
  lines: string[];
}

interface MapRow {
  id: string;
  part: string;
  gloss: [string, string];
  cells: [MapCell, MapCell, MapCell];
}

const MAP_LOOPS: { name: string; sub: string }[] = [
  { name: 'autoresearch', sub: 'keep or reset, one file' },
  { name: 'FunSearch and AlphaEvolve', sub: 'a scored population' },
  { name: 'Ralph', sub: 'a shell loop, fresh context' },
];

const MAP_ROWS: MapRow[] = [
  {
    id: 'policy',
    part: 'Policy',
    gloss: ['what writes each', 'attempt'],
    cells: [
      {
        mark: 'present',
        lines: ['A coding agent on a frozen', 'model edits train.py, steered', 'by program.md'],
      },
      {
        mark: 'weak',
        tag: 'COSTLY: PAID IN SAMPLES',
        lines: ['An LLM shown stored high', 'scorers; FunSearch: order of 10^6'],
      },
      {
        mark: 'present',
        lines: ['The same prompt, a fresh', 'context each run; state in the', 'plan, AGENT.md and the repo'],
      },
    ],
  },
  {
    id: 'reward',
    part: 'Reward',
    gloss: ['the score an', 'attempt earns'],
    cells: [
      {
        mark: 'weak',
        tag: 'WEAK: NO NOISE FLOOR',
        lines: ['val_bpb after 5 minutes of', 'training, read once'],
      },
      {
        mark: 'present',
        lines: ["A programmatic evaluator's", 'score, graded rather than', 'pass or fail'],
      },
      {
        mark: 'present',
        lines: ['Backpressure: tests, the', 'compiler and type checks', 'reject invalid code'],
      },
    ],
  },
  {
    id: 'update',
    part: 'Update rule',
    gloss: ['how a score changes', 'the next attempt'],
    cells: [
      {
        mark: 'present',
        lines: ['Keep the commit if val_bpb', 'fell, git reset otherwise:', 'greedy hill-climbing'],
      },
      {
        mark: 'present',
        lines: ['Store what the evaluator', 'accepts; sample high scorers', 'into the next prompt'],
      },
      {
        mark: 'missing',
        tag: 'MISSING: A SCORED RULE',
        lines: ['Agent updates plan, AGENT.md;', "operator adds 'signs' by hand"],
      },
    ],
  },
  {
    id: 'explore',
    part: 'Exploration',
    gloss: ['trying options of', 'unknown value'],
    cells: [
      {
        mark: 'missing',
        tag: 'MISSING FROM WHAT IS KEPT',
        lines: ["Advice only, such as 'try more", "radical architectural changes'"],
      },
      {
        mark: 'present',
        lines: ['Islands in FunSearch; a', 'database built for diversity', 'in AlphaEvolve'],
      },
      {
        mark: 'weak',
        tag: 'WEAK: NONE BY DESIGN',
        lines: ['One task per loop, picked by', 'the agent from the plan'],
      },
    ],
  },
  {
    id: 'credit',
    part: 'Credit',
    gloss: ['which change earned', 'the score'],
    cells: [
      {
        mark: 'present',
        lines: ['One idea per commit, so each', 'score belongs to one change'],
      },
      {
        mark: 'present',
        lines: ['One score per whole program;', 'the database keeps the program'],
      },
      {
        mark: 'present',
        lines: ['Notes in files say why a test', 'exists, for later loops'],
      },
    ],
  },
];

// Layout in viewBox units. 11px text budgets about 6.2 units per character; every cell line is
// at most 33 characters (about 205 units) inside a 228-unit cell with 10 units of padding.
const LM_W = 900;
const LM_LABEL_X = 12;
const LM_LABEL_W = 156;
const LM_COL_W = 228;
const LM_COL_GAP = 10;
const LM_COL_X = [0, 1, 2].map((i) => LM_LABEL_X + LM_LABEL_W + LM_COL_GAP + i * (LM_COL_W + LM_COL_GAP));
const LM_HEAD_Y = 14;
const LM_HEAD_H = 48;
const LM_ROW_Y0 = 74;
const LM_ROW_H = 62;
const LM_ROW_GAP = 8;
const LM_LEGEND_Y = LM_ROW_Y0 + MAP_ROWS.length * (LM_ROW_H + LM_ROW_GAP) + 10;
const LM_H = LM_LEGEND_Y + 34;

const LM_STYLE = `
  .your-loops-map-head { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
  .your-loops-map-label { fill: #f4f5f6; stroke: #879596; stroke-width: 1; }
  .your-loops-map-present { fill: #ffffff; stroke: #879596; stroke-width: 1; }
  .your-loops-map-weak { fill: #fbf3d5; stroke: #8b6c00; stroke-width: 1.5; }
  .your-loops-map-missing { fill: #fff5f5; stroke: #d91515; stroke-width: 2; stroke-dasharray: 6 4; }
  .your-loops-map-name { fill: #0f1b2a; font: 600 13px sans-serif; text-anchor: middle; }
  .your-loops-map-sub { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
  .your-loops-map-part { fill: #16191f; font: 600 13px sans-serif; }
  .your-loops-map-gloss { fill: #5f6b7a; font: 11px sans-serif; }
  .your-loops-map-t { fill: #16191f; font: 11px sans-serif; }
  .your-loops-map-tag-missing { fill: #b0120f; font: 700 11px sans-serif; }
  .your-loops-map-tag-weak { fill: #6b5300; font: 700 11px sans-serif; }
  .your-loops-map-leg { fill: #414d5c; font: 11px sans-serif; }
`;

function LoopsMapDiagram() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox={`0 0 ${LM_W} ${LM_H}`}
        role="img"
        aria-labelledby="your-loops-map-title"
        aria-describedby="your-loops-map-desc"
        style={{ width: '100%', minWidth: 700, height: 'auto' }}
      >
        <title id="your-loops-map-title">
          Three practitioner loops mapped onto the five parts of RL. autoresearch has a policy, a
          reward, a greedy update rule and clean credit, keeps no exploration in what it accepts, and
          reads its score once with no noise floor. FunSearch and AlphaEvolve fill all five parts,
          with a population for exploration, and pay in samples. Ralph has fresh context, a
          pass-or-fail reward and notes for credit, has no rule in code that compares attempts by
          score, so the operator improves it by hand, and does not explore by design.
        </title>
        <desc id="your-loops-map-desc">
          A grid with one row per RL part (policy, reward, update rule, exploration, credit
          assignment) and one column per loop. Red dashed cells mark a missing part, amber cells a
          weak or costly one, and white cells a part the loop has.
        </desc>
        <style>{LM_STYLE}</style>
        <rect x={0} y={0} width={LM_W} height={LM_H} rx={8} fill="#ffffff" />

        {MAP_LOOPS.map((loop, i) => (
          <g key={loop.name}>
            <rect
              x={LM_COL_X[i]}
              y={LM_HEAD_Y}
              width={LM_COL_W}
              height={LM_HEAD_H}
              rx={6}
              className="your-loops-map-head"
            />
            <text x={LM_COL_X[i] + LM_COL_W / 2} y={LM_HEAD_Y + 21} className="your-loops-map-name">
              {loop.name}
            </text>
            <text x={LM_COL_X[i] + LM_COL_W / 2} y={LM_HEAD_Y + 38} className="your-loops-map-sub">
              {loop.sub}
            </text>
          </g>
        ))}

        {MAP_ROWS.map((row, r) => {
          const y = LM_ROW_Y0 + r * (LM_ROW_H + LM_ROW_GAP);
          return (
            <g key={row.id}>
              <rect
                x={LM_LABEL_X}
                y={y}
                width={LM_LABEL_W}
                height={LM_ROW_H}
                rx={6}
                className="your-loops-map-label"
              />
              <text x={LM_LABEL_X + 10} y={y + 20} className="your-loops-map-part">
                {row.part}
              </text>
              <text x={LM_LABEL_X + 10} y={y + 36} className="your-loops-map-gloss">
                {row.gloss[0]}
              </text>
              <text x={LM_LABEL_X + 10} y={y + 51} className="your-loops-map-gloss">
                {row.gloss[1]}
              </text>
              {row.cells.map((cell, c) => {
                const x = LM_COL_X[c];
                const first = cell.tag ? 34 : 20;
                return (
                  <g key={`${row.id}-${c}`}>
                    <rect
                      x={x}
                      y={y}
                      width={LM_COL_W}
                      height={LM_ROW_H}
                      rx={6}
                      className={`your-loops-map-${cell.mark}`}
                    />
                    {cell.tag && (
                      <text
                        x={x + 10}
                        y={y + 17}
                        className={
                          cell.mark === 'missing'
                            ? 'your-loops-map-tag-missing'
                            : 'your-loops-map-tag-weak'
                        }
                      >
                        {cell.tag}
                      </text>
                    )}
                    {cell.lines.map((line, k) => (
                      <text key={k} x={x + 10} y={y + first + k * 15} className="your-loops-map-t">
                        {line}
                      </text>
                    ))}
                  </g>
                );
              })}
            </g>
          );
        })}

        <g>
          <rect
            x={LM_COL_X[0]}
            y={LM_LEGEND_Y}
            width={22}
            height={14}
            rx={3}
            className="your-loops-map-missing"
          />
          <text x={LM_COL_X[0] + 30} y={LM_LEGEND_Y + 11} className="your-loops-map-leg">
            Missing
          </text>
          <rect
            x={LM_COL_X[1]}
            y={LM_LEGEND_Y}
            width={22}
            height={14}
            rx={3}
            className="your-loops-map-weak"
          />
          <text x={LM_COL_X[1] + 30} y={LM_LEGEND_Y + 11} className="your-loops-map-leg">
            Weak or costly
          </text>
          <rect
            x={LM_COL_X[2]}
            y={LM_LEGEND_Y}
            width={22}
            height={14}
            rx={3}
            className="your-loops-map-present"
          />
          <text x={LM_COL_X[2] + 30} y={LM_LEGEND_Y + 11} className="your-loops-map-leg">
            Present
          </text>
        </g>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function YourLoops() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Harden the loops you already run: find the RL part each one leaves empty, then add the check that fills it, starting with a noise floor for a loop that decides about 100 experiments a night on one reading each (autoresearch at commit 228791fb; sources read 2026-10-30)"
          >
            15. Your Loops Through the RL Lens
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            autoresearch, FunSearch and Ralph are loops practitioners already run: a model proposes
            a change, something scores it, and the loop decides what to keep. Read through RL
            (reinforcement learning), each one fills the same five parts: the policy, whatever
            writes the next attempt; the reward, the score an attempt earns; the update rule, how
            a score changes what comes next; exploration, attempts spent on options of unknown
            value; and credit assignment, working out which change earned the score.
          </Box>
          <Box variant="p">
            The challenge in hardening one of these loops is finding the part it leaves empty,
            because that is where it keeps noise as progress, stalls on a local best, or waits for
            a person. autoresearch shows the stakes: at five minutes per experiment, its
            instructions count on about 100 experiments over a night&apos;s sleep, each kept or
            reset on a single reading of one number{' '}
            <Cite tier={1} href={ar('program.md', 'L114')}>
              autoresearch program.md L114
            </Cite>
            . Section 10, The Reward Is a Proxy, covered how a loop&apos;s evaluator gets gamed;
            this section maps each loop whole and ends on a checklist.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Fill in five parts for any loop and the one it leaves empty shows: exploration in autoresearch, a scored update rule in Ralph, and nothing in the search loops, which pay in samples instead"
          >
            Three loops on one map
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The map below places each loop on the five parts. Each column is developed in the
            blocks that follow, with its sources; the marked cells are what the checklist at the
            end supplies.
          </Box>
          <LoopsMapDiagram />
          <Box variant="small" color="text-body-secondary">
            The marks are our reading of each loop&apos;s code or published description, cited in
            the blocks below.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Know which of autoresearch's overnight wins to re-run before you trust them: about 100 experiments a night, each kept or reset on one reading"
          >
            autoresearch: greedy hill-climbing on one file
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            autoresearch gives a coding agent a small LLM training setup and lets it experiment
            overnight. The agent edits one file, <code>train.py</code>, and may not touch{' '}
            <code>prepare.py</code>, which holds the data, the constants and the evaluation{' '}
            <Cite tier={1} href={ar('program.md', 'L25-L31')}>
              autoresearch program.md L25-L31
            </Cite>
            . The one metric is val_bpb (validation bits per byte), lower is better{' '}
            <Cite tier={2} href={ar('README.md', 'L17')}>
              autoresearch README.md L17
            </Cite>
            , and every experiment trains for a fixed budget of 300 seconds{' '}
            <Cite tier={1} href={ar('prepare.py', 'L31')}>
              autoresearch prepare.py L31
            </Cite>
            . The agent commits each idea, keeps the commit if val_bpb improved, and resets the
            branch if it is equal or worse{' '}
            <Cite tier={1} href={ar('program.md', 'L94-L104')}>
              autoresearch program.md L94-L104
            </Cite>
            , and logs every run as keep, discard or crash in a <code>results.tsv</code> that git
            does not track{' '}
            <Cite tier={1} href={ar('program.md', 'L66-L102')}>
              autoresearch program.md L66-L102
            </Cite>
            .
          </Box>
          <Box variant="p">
            In RL terms the acceptance rule is greedy hill-climbing: a change survives only if it
            beats the current best, so the loop never takes a worse step that might lead somewhere
            better. Exploration exists only as advice to the proposing model. When it runs out of
            ideas it should &quot;try combining previous near-misses, try more radical architectural
            changes&quot;, and it may rewind, &quot;very very sparingly (if ever)&quot;{' '}
            <Cite tier={1} href={ar('program.md', 'L106-L112')}>
              autoresearch program.md L106-L112
            </Cite>
            . Nothing in what gets kept explores: a radical idea that scores worse is reset like
            any other.
          </Box>
          <Box variant="p">
            Credit assignment is clean by construction. Each idea is one commit and one reading{' '}
            <Cite tier={1} href={ar('program.md', 'L96-L98')}>
              autoresearch program.md L96-L98
            </Cite>
            , so a change owns its score. The shipped training script fixes its seed at 42{' '}
            <Cite tier={1} href={ar('train.py', 'L458-L459')}>
              autoresearch train.py L458-L459
            </Cite>
            , in the file where &quot;Everything is fair game&quot; for the agent{' '}
            <Cite tier={1} href={ar('program.md', 'L26')}>
              autoresearch program.md L26
            </Cite>
            .
          </Box>
          <Box variant="p">
            The reward has no noise floor, the amount a score moves between runs of identical
            code. The only acceptance test is whether val_bpb improved, and the one magnitude the
            instructions name is a judgement about complexity: &quot;A 0.001 val_bpb improvement
            that adds 20 lines of hacky code? Probably not worth it.&quot;{' '}
            <Cite tier={1} href={ar('program.md', 'L37')}>
              autoresearch program.md L37
            </Cite>{' '}
            Training stops on wall-clock time, after the step that takes the run past its budget{' '}
            <Cite tier={1} href={ar('train.py', 'L603-L604')} kind="code">
              autoresearch train.py L603-L604
            </Cite>
            , and the learning-rate schedule follows elapsed training time{' '}
            <Cite tier={1} href={ar('train.py', 'L555-L556')} kind="code">
              autoresearch train.py L555-L556
            </Cite>
            . Our reading of <code>train.py</code>: two runs of the same commit need not train for
            the same number of steps, so the fixed seed does not make a reading repeat, and a gain
            smaller than the run-to-run spread can be kept. The README concedes the cross-hardware
            form of this, that results &quot;become not comparable to other people running on
            other compute platforms&quot;{' '}
            <Cite tier={2} href={ar('README.md', 'L64')}>
              autoresearch README.md L64
            </Cite>
            .
          </Box>
          <Box variant="p">
            How much val_bpb varies between identical runs was not measured in any source located
            during this research, and we did not measure it. Treat a single small gain as
            unconfirmed until it repeats: across about 100 single-reading decisions a night, a loop
            that keeps any improvement has many chances to keep one that was noise (our reading).
          </Box>
          <ExpandableSection headerText="The lines behind the noise reading">
            <SpaceBetween size="s">
              <Box variant="p">
                At commit 228791fb, <code>train.py</code> seeds once, computes its schedules from
                elapsed training time, and breaks out of the loop once elapsed training time
                reaches the budget. The keep rule in <code>program.md</code> compares one reading
                with the current best.
              </Box>
              <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>
                <code>{`# train.py
458  torch.manual_seed(42)
459  torch.cuda.manual_seed(42)
516  # Schedules (all based on progress = training_time / TIME_BUDGET)
555      progress = min(total_training_time / TIME_BUDGET, 1.0)
556      lrm = get_lr_multiplier(progress)
603      if step > 10 and total_training_time >= TIME_BUDGET:
604          break

# program.md
103  8. If val_bpb improved (lower), you "advance" the branch, keeping the git commit
104  9. If val_bpb is equal or worse, you git reset back to where you started`}</code>
              </pre>
              <Box variant="p">
                Sources:{' '}
                <Cite tier={1} href={ar('train.py', 'L516-L526')} kind="code">
                  autoresearch train.py L516-L526
                </Cite>
                ,{' '}
                <Cite tier={1} href={ar('program.md', 'L103-L104')}>
                  autoresearch program.md L103-L104
                </Cite>
                . No repeat-run or noise rule appears in <code>program.md</code>,{' '}
                <code>README.md</code> or <code>train.py</code> at this commit (our reading of the
                three files). Section 10 showed the other weak point of this layout: the
                evaluation runs the model code the agent edits.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Get the exploration a greedy loop lacks by keeping a scored population and sampling parents from it, and budget for the samples that costs"
          >
            FunSearch and AlphaEvolve: a population supplies the exploration
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            FunSearch and AlphaEvolve search for programs: an LLM writes candidates (a frozen,
            pretrained one in FunSearch), and an evaluator, code that runs each candidate and
            scores it, decides what the loop learns. Both keep a scored population of programs, ask
            the LLM to write variants of the high scorers, and store the variants the evaluator
            accepts. In FunSearch a pretrained code
            model with no fine-tuning writes new versions of one function, and &quot;Programs that
            are correct are sent to the programs database to be stored&quot;{' '}
            <Cite tier={3} href={FUNSEARCH} venue="Nature 2023">
              FunSearch, Methods (Distributed system)
            </Cite>
            ; in AlphaEvolve &quot;promising solutions are registered back into the Program
            database&quot;{' '}
            <Cite tier={3} href={ALPHAEVOLVE} venue="preprint">
              AlphaEvolve, Figure 2
            </Cite>
            .
          </Box>
          <Box variant="p">
            Selection works through which stored programs are sampled into the next prompt.
            Neither loop keeps a candidate because it beat its parent, and neither reverts.
            FunSearch samples an island, then a program within it, &quot;favouring higher-scoring
            and shorter programs&quot;{' '}
            <Cite tier={3} href={FUNSEARCH} venue="Nature 2023">
              FunSearch, Programs database
            </Cite>
            . The chance of picking a cluster of programs grows exponentially with its score,
            scaled by a temperature, so lower-scoring programs keep some chance of becoming
            parents{' '}
            <Cite tier={3} href={FUNSEARCH} venue="Nature 2023">
              FunSearch, Methods, equation (1)
            </Cite>
            .
          </Box>
          <Box variant="p">
            The islands are subpopulations evolved independently, because &quot;Preserving and
            encouraging diversity of programs in the database is crucial to enable exploration and
            avoid being stuck in local optima&quot;; the loop periodically discards the programs in
            the worst half of the islands and reseeds them from the best survivors{' '}
            <Cite tier={3} href={FUNSEARCH} venue="Nature 2023">
              FunSearch, Programs database
            </Cite>
            . AlphaEvolve&apos;s database names the same goal, &quot;balancing exploration and
            exploitation&quot;, and draws in part on island-based population models{' '}
            <Cite tier={3} href={ALPHAEVOLVE} venue="preprint">
              AlphaEvolve, Section 2.5
            </Cite>
            . Our reading in RL terms: the population is the exploration term autoresearch lacks,
            because a program that scored lower stays available as a parent where autoresearch
            would reset it away.
          </Box>
          <Box variant="p">
            Both loops lean on the evaluator. FunSearch &quot;works best&quot; with an efficient
            evaluator and &quot;a &apos;rich&apos; scoring feedback quantifying the improvements
            (as opposed to a binary signal)&quot;{' '}
            <Cite tier={3} href={FUNSEARCH} venue="Nature 2023">
              FunSearch, Discussion
            </Cite>
            : a graded score lets the population rank its near-misses. AlphaEvolve lets the user
            stage evaluation as a cascade of test sets of increasing difficulty, with a candidate
            reaching the next stage only if it did well on the earlier ones, so the expensive tests
            run on promising programs only{' '}
            <Cite tier={3} href={ALPHAEVOLVE} venue="preprint">
              AlphaEvolve, Section 2.4
            </Cite>
            .
          </Box>
          <Box variant="p">
            The price is samples. AlphaEvolve&apos;s authors describe FunSearch as using
            &quot;millions of LLM samples&quot; and AlphaEvolve as needing thousands, and in the
            same table AlphaEvolve evolves whole files instead of one function, can evaluate for
            hours on accelerators where FunSearch needs 20 minutes or less on one CPU, and benefits
            from state-of-the-art models where FunSearch saw no benefit from larger ones{' '}
            <Cite tier={3} href={ALPHAEVOLVE} venue="preprint">
              AlphaEvolve, Table 1
            </Cite>
            . FunSearch&apos;s own paper puts its total at &quot;on the order of 10^6&quot; samples{' '}
            <Cite tier={3} href={FUNSEARCH} venue="Nature 2023">
              FunSearch, Pretrained LLM
            </Cite>
            , with several runs for some problems{' '}
            <Cite tier={3} href={FUNSEARCH} venue="Nature 2023">
              FunSearch, Distributed approach
            </Cite>
            . Our reading: better proposals mean fewer of them are needed, though the two systems
            differ in too many ways for the table to isolate the model&apos;s share.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Keep each iteration's context small and its state in files, and know that the person editing the prompt is the slowest update rule in the loop"
          >
            Ralph: fresh context, state in files, a person as the outer optimiser
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Ralph is Geoffrey Huntley&apos;s name for the same prompt fed to a coding agent in an
            endless shell loop, one task per iteration:{' '}
            <code>while :; do cat PROMPT.md | claude-code ; done</code>. In his description each
            iteration starts with a new context window and reads its state from files: a plan it
            picks the most important item from, an <code>AGENT.md</code> it updates with what it
            learns about building the project, the specifications, and notes in the code
            &quot;because future loops will not have the reasoning in their context window&quot;.
            Tests, type checks and static analysers act as backpressure, his word for checks that
            reject invalid code. When the agent goes wrong, the operator adds a &quot;sign&quot; to
            the prompt, such as &quot;SLIDE DOWN, DON&apos;T JUMP, LOOK AROUND&quot;{' '}
            <Cite tier={2} href={RALPH}>
              Huntley, Ralph Wiggum as a &quot;software engineer&quot; (author&apos;s post)
            </Cite>
            .
          </Box>
          <Box variant="p">
            In RL terms backpressure is the reward, a gate that passes or rejects each change. Two
            learners update the context at two speeds: the agent edits the plan and{' '}
            <code>AGENT.md</code> every iteration, and the operator edits the prompt after watching
            failures. Huntley puts the second one plainly: &quot;Each time Ralph does something bad,
            Ralph gets tuned - like a guitar.&quot;{' '}
            <Cite tier={2} href={RALPH}>
              Huntley, Ralph (author&apos;s post)
            </Cite>{' '}
            Our reading: the operator is a slow outer optimiser. No rule in code compares attempts
            by score, so the loop improves as fast as a person reads its failures, and it does not
            explore by design, since each iteration takes one task the agent judges most important.
            Credit travels in the notes.
          </Box>
          <Box variant="p">
            Fresh context per iteration is Huntley&apos;s answer to context degradation, argued from
            his own use rather than measured. He writes that &quot;you only have approximately 170k
            of context window to work with&quot; and that &quot;The more you use the context window,
            the worse the outcomes you&apos;ll get&quot;, and he names the price: &quot;you&apos;re
            effectively burning the allocation of the specifications every loop&quot;{' '}
            <Cite tier={2} href={RALPH}>
              Huntley, Ralph (author&apos;s post)
            </Cite>
            . autoresearch applies the same pressure inside one long session: each run&apos;s output
            goes to a log file, and the agent greps two lines from it, under the instruction not to
            &quot;let output flood your context&quot;{' '}
            <Cite tier={1} href={ar('program.md', 'L99-L100')}>
              autoresearch program.md L99-L100
            </Cite>
            . Section 17, Where Words Fall Short, covers the measurements of how models use long
            contexts.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Harden the loop you run tonight: section 10's grader checks first, then six checks that each supply a part the map marked missing or weak"
          >
            The hardening checklist
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Start with the evaluator. Section 10, The Reward Is a Proxy, ends on four grader checks
            that apply here unchanged: evaluator code the agent cannot edit, hidden or read-only
            tests, a held-out metric, and monitors kept out of the reward. Then add the six below.
          </Box>
          <Box variant="p">
            <Box variant="strong" display="inline">
              1. A measured noise floor before accepting a win.
            </Box>{' '}
            Run the unchanged best several times, take the spread of its scores as the floor, and
            accept a change only when its gain clears the floor or repeats. A loop that decides
            about 100 experiments a night on one reading each, with training cut on wall-clock
            time, is the case this check exists for.
          </Box>
          <Box variant="p">
            <Box variant="strong" display="inline">
              2. One change per trial.
            </Box>{' '}
            Commit one idea, score it, then decide, as autoresearch does: the score then belongs to
            that change. Two ideas in one trial leave a gain with no owner (our reading).
          </Box>
          <Box variant="p">
            <Box variant="strong" display="inline">
              3. Scorekeeping in code.
            </Box>{' '}
            Let code read the metric, compare it with the floor, write the log and run the keep or
            reset. In autoresearch the agent does each of these by following prose instructions. In
            a study of GPT-3.5, GPT-4 and Llama2 choosing among options with unknown payoffs, the
            one configuration that explored satisfactorily was GPT-4 with chain-of-thought and its
            history summarised outside the model; configurations with chain-of-thought and an
            unsummarised history did not{' '}
            <Cite tier={3} href={BANDITS} venue="NeurIPS 2024">
              Krishnamurthy et al., Abstract
            </Cite>
            .
          </Box>
          <Box variant="p">
            <Box variant="strong" display="inline">
              4. A population when the loop stalls.
            </Box>{' '}
            Our reading: this is the exploration term autoresearch lacks. When a greedy loop stops
            finding wins, keep several scored candidates and sample parents with a bias toward high
            scores, as FunSearch does, so a near-miss can still become the parent of the next best.
            Give it a graded score: a pass-or-fail check cannot rank one passing candidate above
            another.
          </Box>
          <Box variant="p">
            <Box variant="strong" display="inline">
              5. Fresh context, state in files.
            </Box>{' '}
            Start each iteration from files the loop maintains, such as a plan, a log and notes, as
            Ralph does, and keep raw run output out of the context, as autoresearch does. Huntley
            argues for this from his own use; section 17 has the measurements on long contexts.
          </Box>
          <Box variant="p">
            <Box variant="strong" display="inline">
              6. A stable prompt prefix, the evolving part after it.
            </Box>{' '}
            Put the instructions and specifications that do not change first and the plan, log or
            notes that do change after them, so the stable part stays eligible for prefix caching.
            On Amazon Bedrock&apos;s implicit caching, static content first and dynamic content last
            raises &quot;the likelihood of an exact prefix match&quot;, and a hit is best effort:
            &quot;Repeating an identical prompt doesn&apos;t guarantee a cache hit&quot;{' '}
            <Cite tier={1} href={BEDROCK_CACHING}>
              Amazon Bedrock user guide: prompt caching
            </Cite>
            . Ralph&apos;s rule to &quot;deterministically allocate the stack the same way every
            loop&quot;{' '}
            <Cite tier={2} href={RALPH}>
              Huntley, Ralph (author&apos;s post)
            </Cite>{' '}
            already produces this layout, in our reading; no cache measurement for Ralph was
            located. The mechanism is in the{' '}
            <Link href="../vllm/">vLLM dive, section 6: Automatic Prefix Caching</Link>, and
            section 17, Where Words Fall Short, prices what an edit early in an evolving context
            costs.
          </Box>
          <Box variant="p">
            Then write your own loop into the map above, one cell per part, and mark the cell it
            leaves empty. For a loop shaped like autoresearch that is the noise floor and the
            population; add the floor first, before the next overnight run decides another 100
            experiments on one reading each.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
