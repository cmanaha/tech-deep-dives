import type { ReactNode } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Table from '@cloudscape-design/components/table';
import Link from '@cloudscape-design/components/link';
import { Cite, arxiv } from '../components/Cite';

/* ------------------------------------------------------------------------ */
/* Sources                                                                  */
/* ------------------------------------------------------------------------ */

/** Shinn et al., Reflexion: Language Agents with Verbal Reinforcement Learning. */
const REFLEXION = arxiv('2303.11366v4');
/** Ouyang et al., ReasoningBank. */
const REASONING_BANK = arxiv('2509.25140v2');
/** Zhao et al., ExpeL: LLM Agents Are Experiential Learners. */
const EXPEL = arxiv('2308.10144v3');
/** Majumder et al., CLIN: A Continually Learning Language Agent. */
const CLIN = arxiv('2310.10134v1');
/** Suzgun et al., Dynamic Cheatsheet: Test-Time Learning with Adaptive Memory. */
const CHEATSHEET = arxiv('2504.07952v1');
/** Wang et al., Voyager: An Open-Ended Embodied Agent with Large Language Models. */
const VOYAGER = arxiv('2305.16291v2');
/** Zhang et al., Agentic Context Engineering (ACE). */
const ACE = arxiv('2510.04618v3');
/** Youtu-Agent Team, Training-Free Group Relative Policy Optimization. */
const TF_GRPO = arxiv('2510.08191v1');
/** Feng et al., ReTool: Reinforcement Learning for Strategic Tool Use in LLMs. */
const RETOOL = arxiv('2504.11536v2');
/** Memento: fine-tuning LLM agents without fine-tuning LLMs (case-based memory). */
const MEMENTO = arxiv('2508.16153v2');
/** Anthropic docs: memory tool. */
const MEMORY_TOOL = 'https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool';
/** Anthropic docs: Agent Skills overview. */
const SKILLS_DOC = 'https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview';
/** Anthropic Engineering post, published Oct 16, 2025. */
const SKILLS_POST =
  'https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills';

function Ace({ children }: { children: ReactNode }) {
  return (
    <Cite tier={3} href={ACE} venue="ICLR 2026">
      {children}
    </Cite>
  );
}

function Cheatsheet({ children }: { children: ReactNode }) {
  return (
    <Cite tier={3} href={CHEATSHEET} venue="EACL 2026">
      {children}
    </Cite>
  );
}

function TfGrpo({ children }: { children: ReactNode }) {
  return (
    <Cite tier={3} href={TF_GRPO} venue="preprint">
      {children}
    </Cite>
  );
}

/* ------------------------------------------------------------------------ */
/* Diagram: the update-rule spectrum, with the failure at each extreme      */
/* ------------------------------------------------------------------------ */

interface SpectrumCard {
  name: string;
  lines: [string, string];
}

interface SpectrumBand {
  x: number;
  title: string;
  sub: string;
  cls: 'a' | 'b' | 'c';
  cards: SpectrumCard[];
}

const BAND_W = 273;
const CARD_H = 58;
const CARD_GAP = 8;
const CARD_TOP = 144;

const BANDS: SpectrumBand[] = [
  {
    x: 20,
    title: 'Append',
    sub: 'add entries, rarely remove any',
    cls: 'a',
    cards: [
      { name: 'Reflexion', lines: ['appends one lesson per failure;', 'keeps only the last 1 to 3'] },
      { name: 'ReasoningBank', lines: ['adds judged memory items by', 'simple addition'] },
      { name: 'Voyager', lines: ['adds a program to its library', 'once self-verification passes'] },
    ],
  },
  {
    x: 313,
    title: 'Itemised edits',
    sub: 'change single entries',
    cls: 'b',
    cards: [
      { name: 'ACE', lines: ['code merges small delta bullets;', 'duplicates removed by embedding'] },
      { name: 'ExpeL', lines: ['adds, edits, upvotes, downvotes;', 'an insight at count zero is removed'] },
      {
        name: 'Training-Free GRPO',
        lines: ['adds, deletes or modifies lessons', 'written from groups of attempts'],
      },
    ],
  },
  {
    x: 606,
    title: 'Regenerate',
    sub: 'write the whole store again',
    cls: 'c',
    cards: [
      { name: 'CLIN', lines: ['writes a new memory after each trial', 'from it plus the 3 latest memories'] },
      { name: 'Dynamic Cheatsheet', lines: ['a curator rewrites the whole', 'cheatsheet with every query'] },
    ],
  },
];

interface SpectrumNote {
  x: number;
  cls: 'fail' | 'ok';
  head: string;
  lines: [string, string, string];
}

const NOTES: SpectrumNote[] = [
  {
    x: 20,
    cls: 'fail',
    head: 'At this end: keep everything',
    lines: [
      'Full history (every past turn in the',
      'prompt): 26.7% against 50.0% for a',
      'curated cheatsheet (AIME 2024, Sonnet)',
    ],
  },
  {
    x: 313,
    cls: 'ok',
    head: 'In between: small, itemised steps',
    lines: [
      'each update adds, edits or removes',
      'a few entries; the rest of the store',
      'carries over unchanged',
    ],
  },
  {
    x: 606,
    cls: 'fail',
    head: 'At this end: context collapse',
    lines: [
      'One rewrite: 18,282 tokens to 122;',
      'accuracy 66.7 to 57.1, below the',
      '63.7 of no adaptation (AppWorld)',
    ],
  },
];

function UpdateRuleSpectrumDiagram() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 900 470"
        role="img"
        aria-labelledby="exp-spectrum-title"
        style={{ width: '100%', minWidth: 680, height: 'auto' }}
      >
        <title id="exp-spectrum-title">
          Text-loop update rules ordered by step size, how much of the stored context one update
          changes. Append rules (Reflexion, ReasoningBank, Voyager) add entries and rarely remove
          any. Itemised-edit rules (ACE, ExpeL, Training-Free GRPO) add, change or remove single
          entries. Regenerate rules (CLIN, Dynamic Cheatsheet) write the whole store again. Each
          extreme has its failure. Keeping everything: a full-history prompt scored 26.7% on AIME
          2024 with Claude 3.5 Sonnet against 50.0% for a curated cheatsheet. Rewriting
          everything: in a case study on AppWorld, one rewrite took the context from 18,282 tokens
          to 122 and accuracy from 66.7 to 57.1, below the 63.7 of no adaptation.
        </title>
        <style>{`
          .exp-spectrum-h { fill: #16191f; font: 600 13px sans-serif; text-anchor: start; }
          .exp-spectrum-ax { fill: #414d5c; font: 600 11px sans-serif; }
          .exp-spectrum-band-a { fill: #e6f4f2; stroke: #1f7a70; stroke-width: 1.5; }
          .exp-spectrum-band-b { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .exp-spectrum-band-c { fill: #efe7fb; stroke: #6f4cc4; stroke-width: 1.5; }
          .exp-spectrum-card-a { fill: #ffffff; stroke: #1f7a70; stroke-width: 1; }
          .exp-spectrum-card-b { fill: #ffffff; stroke: #0972d3; stroke-width: 1; }
          .exp-spectrum-card-c { fill: #ffffff; stroke: #6f4cc4; stroke-width: 1; }
          .exp-spectrum-bt { fill: #16191f; font: 600 13px sans-serif; text-anchor: middle; }
          .exp-spectrum-bs { fill: #414d5c; font: 11px sans-serif; text-anchor: middle; }
          .exp-spectrum-ct { fill: #16191f; font: 600 12px sans-serif; text-anchor: start; }
          .exp-spectrum-cs { fill: #414d5c; font: 11px sans-serif; text-anchor: start; }
          .exp-spectrum-fail { fill: #fbf3d5; stroke: #8b6c00; stroke-width: 2; }
          .exp-spectrum-ok { fill: #ecf7ec; stroke: #037f0c; stroke-width: 1.5; }
          .exp-spectrum-nh-fail { fill: #6b5200; font: 600 12px sans-serif; text-anchor: start; }
          .exp-spectrum-nh-ok { fill: #037f0c; font: 600 12px sans-serif; text-anchor: start; }
          .exp-spectrum-ns { fill: #16191f; font: 11px sans-serif; text-anchor: start; }
        `}</style>
        <defs>
          <linearGradient id="exp-spectrum-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#1f7a70" />
            <stop offset="0.5" stopColor="#0972d3" />
            <stop offset="1" stopColor="#6f4cc4" />
          </linearGradient>
        </defs>

        <rect x={0} y={0} width={900} height={470} rx={8} fill="#ffffff" />

        <text x={20} y={30} className="exp-spectrum-h">
          Where each update rule sits: how much of the stored context one update changes
        </text>

        {/* Step-size axis */}
        <text x={20} y={55} className="exp-spectrum-ax" textAnchor="start">
          Smallest step: add, rarely remove
        </text>
        <text x={880} y={55} className="exp-spectrum-ax" textAnchor="end">
          Largest step: replace everything
        </text>
        <rect x={20} y={64} width={860} height={12} rx={6} fill="url(#exp-spectrum-grad)" />

        {/* Bands and method cards */}
        {BANDS.map((band) => (
          <g key={band.title}>
            <rect
              x={band.x}
              y={92}
              width={BAND_W}
              height={260}
              rx={6}
              className={`exp-spectrum-band-${band.cls}`}
            />
            <text x={band.x + BAND_W / 2} y={114} className="exp-spectrum-bt">
              {band.title}
            </text>
            <text x={band.x + BAND_W / 2} y={131} className="exp-spectrum-bs">
              {band.sub}
            </text>
            {band.cards.map((card, i) => {
              const y = CARD_TOP + i * (CARD_H + CARD_GAP);
              return (
                <g key={card.name}>
                  <rect
                    x={band.x + 10}
                    y={y}
                    width={BAND_W - 20}
                    height={CARD_H}
                    rx={4}
                    className={`exp-spectrum-card-${band.cls}`}
                  />
                  <text x={band.x + 22} y={y + 20} className="exp-spectrum-ct">
                    {card.name}
                  </text>
                  <text x={band.x + 22} y={y + 37} className="exp-spectrum-cs">
                    {card.lines[0]}
                  </text>
                  <text x={band.x + 22} y={y + 51} className="exp-spectrum-cs">
                    {card.lines[1]}
                  </text>
                </g>
              );
            })}
          </g>
        ))}

        {/* The failure at each extreme, and the middle */}
        {NOTES.map((note) => (
          <g key={note.head}>
            <rect
              x={note.x}
              y={366}
              width={BAND_W}
              height={90}
              rx={6}
              className={note.cls === 'fail' ? 'exp-spectrum-fail' : 'exp-spectrum-ok'}
            />
            <text
              x={note.x + 12}
              y={388}
              className={note.cls === 'fail' ? 'exp-spectrum-nh-fail' : 'exp-spectrum-nh-ok'}
            >
              {note.head}
            </text>
            {note.lines.map((line, i) => (
              <text key={line} x={note.x + 12} y={406 + i * 15} className="exp-spectrum-ns">
                {line}
              </text>
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Table: the update rule of each method, with its source                   */
/* ------------------------------------------------------------------------ */

interface RuleRow {
  id: string;
  method: string;
  band: string;
  rule: string;
  source: ReactNode;
}

const RULE_ROWS: RuleRow[] = [
  {
    id: 'reflexion',
    method: 'Reflexion',
    band: 'Append',
    rule: 'After each failed trial, append one written lesson to an episodic memory bounded at a maximum "usually set to 1-3"; the oldest lesson drops out.',
    source: (
      <Cite tier={3} href={REFLEXION} venue="NeurIPS 2023">
        Reflexion, Sections 3 and 5
      </Cite>
    ),
  },
  {
    id: 'reasoningbank',
    method: 'ReasoningBank',
    band: 'Append',
    rule: 'An LLM judge labels each run a success or a failure; memory items (title, description, content) are extracted from both and added "with a simple addition operation"; retrieval is by embedding.',
    source: (
      <Cite tier={3} href={REASONING_BANK} venue="ICLR 2026">
        ReasoningBank, Section 3.2
      </Cite>
    ),
  },
  {
    id: 'voyager',
    method: 'Voyager',
    band: 'Append',
    rule: 'Each program GPT-4 writes and verifies is added to a skill library keyed by an embedding of its description; the 5 most relevant are retrieved for a new task.',
    source: (
      <Cite tier={3} href={VOYAGER} venue="TMLR">
        Voyager, Section 2.2 and Figure 4
      </Cite>
    ),
  },
  {
    id: 'ace',
    method: 'ACE',
    band: 'Itemised edits',
    rule: 'The playbook is a list of bullets, each with an identifier and counters of how often it was marked helpful or harmful. A curator writes small delta bullets; deterministic code merges them, updates counters in place, and an embedding comparison prunes duplicates.',
    source: <Ace>ACE, Sections 3, 3.1 and 3.2</Ace>,
  },
  {
    id: 'expel',
    method: 'ExpeL',
    band: 'Itemised edits',
    rule: 'An insight writer applies ADD, EDIT, UPVOTE and DOWNVOTE to a shared list. A new insight starts at an importance count of two and is removed when the count reaches zero.',
    source: (
      <Cite tier={3} href={EXPEL} venue="AAAI 2024">
        ExpeL, Section 4.2
      </Cite>
    ),
  },
  {
    id: 'tf-grpo',
    method: 'Training-Free GRPO',
    band: 'Itemised edits',
    rule: 'For each query, sample a group of attempts. For groups with clear winners and losers, an LLM writes why the winners won, then applies Add, Delete, Modify or Keep to the experience library.',
    source: <TfGrpo>Training-Free GRPO, Section 2</TfGrpo>,
  },
  {
    id: 'clin',
    method: 'CLIN',
    band: 'Regenerate',
    rule: 'After each trial, a frozen LLM writes a new memory of causal lessons from the latest trial and the memories of the three most recent trials.',
    source: (
      <Cite tier={3} href={CLIN} venue="COLM 2024">
        CLIN, Section 3.2
      </Cite>
    ),
  },
  {
    id: 'cheatsheet',
    method: 'Dynamic Cheatsheet',
    band: 'Regenerate',
    rule: 'A curator model updates the whole cheatsheet after each query, or before it from the 3 most similar past examples, with no ground-truth labels; it can add, refine or remove entries.',
    source: <Cheatsheet>Dynamic Cheatsheet, Sections 2.1 and 2.2</Cheatsheet>,
  },
];

function RuleTable() {
  return (
    <Table
      variant="embedded"
      wrapLines
      trackBy="id"
      items={RULE_ROWS}
      columnDefinitions={[
        {
          id: 'method',
          header: 'Method and band',
          minWidth: 150,
          cell: (r) => (
            <>
              <Box variant="strong" display="block">
                {r.method}
              </Box>
              <Box variant="small" display="block" color="text-body-secondary">
                {r.band}
              </Box>
            </>
          ),
        },
        { id: 'rule', header: 'What one update does', minWidth: 280, cell: (r) => r.rule },
        { id: 'source', header: 'Source', minWidth: 180, cell: (r) => r.source },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function AccumulatingExperience() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Design a playbook whose update rule keeps what it learned, with a signal that decides what enters it (sources read 2026-10-30)"
          >
            13. Memories, Playbooks &amp; Skill Libraries
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            A memory, a playbook or a skill library is the part of a text loop that outlives one
            task. After each episode the loop writes something down, a lesson, a strategy or a
            verified program, and the next task starts with it in context. It is the words-track
            counterpart of RL (reinforcement learning): the weights stay frozen and the store
            changes, so it works on a model you can only call through an API.
          </Box>
          <Box variant="p">
            The challenge is keeping what the store has learned. Every store has an update rule,
            and the rule sets how much of the store one update changes: the step size of section
            11, A Text Loop Is RL on the Context. A step that is too large erases. In a case study
            in the ACE (Agentic Context Engineering) paper on AppWorld (agent tasks run through the
            APIs of simulated apps), one full rewrite took an 18,282-token context to 122 tokens,
            and accuracy fell from 66.7 to 57.1, below the 63.7 of no adaptation at all <Ace>ACE, Section 2.2</Ace>. A step that is too small
            never compresses, and the store fills with clutter. The design choices that sit
            between those two failures fit on one checklist, at the end of this section.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Place any memory loop on one scale by asking how much of its store a single update changes"
          >
            Update rules, from append to rewrite
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The published loops fall into three bands. Append rules add entries and rarely remove
            any: Reflexion adds one lesson per failure, ReasoningBank adds memory items, and
            Voyager adds a program to its skill library once it passes a check. Itemised-edit
            rules change single entries: ExpeL (the Experiential Learning agent) votes on and edits
            a list of insights, ACE merges small delta bullets into a playbook, and Training-Free
            GRPO, a text version of GRPO (Group Relative Policy Optimization), adds, deletes or
            modifies written lessons. Regenerate rules write the whole store again: CLIN, a
            continually learning language agent, after each trial, and Dynamic Cheatsheet after
            each query. The table below the diagram gives each rule with its source.
          </Box>
          <UpdateRuleSpectrumDiagram />
          <Box variant="small" color="text-body-secondary">
            Placement is our reading of each paper&apos;s update rule; the bands are ordered, not
            measured. The left failure is Dynamic Cheatsheet&apos;s full-history baseline on AIME
            2024 (a US competition-math exam); the right failure is the ACE paper&apos;s case study
            on AppWorld, run on Dynamic Cheatsheet. Sources for both numbers are in the next
            block.
          </Box>
          <Box variant="p">
            Training-Free GRPO is the rule that maps most directly onto RL. GRPO (section 7, RLVR
            &amp; GRPO) samples a group of answers to one prompt and scores each by its advantage,
            how much better it did than the group&apos;s average. Training-Free GRPO keeps the
            group and replaces the number with words: for a group with clear winners and losers,
            an LLM writes why the winners won. The authors call this &quot;semantic
            advantage&quot; &quot;functionally equivalent to vanilla GRPO&apos;s&quot; numeric
            advantage, and the loop turns it into edits to its library of lessons <TfGrpo>Training-Free GRPO, Section 2</TfGrpo>. The gradient step becomes a
            handful of Add, Delete and Modify operations.
          </Box>
          <ExpandableSection headerText="The update rule of each method, with its source">
            <RuleTable />
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Know which failure your update rule invites, and what the evidence says sits between them"
          >
            Each end of the scale has its failure
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <Box variant="strong">Rewrite everything: context collapse.</Box> In the ACE
            paper&apos;s case study on AppWorld, an LLM asked to rewrite the whole accumulated
            context at every adaptation step held 18,282 tokens at step 60, with accuracy 66.7. At
            the next step it produced 122 tokens, and accuracy dropped to 57.1, below the 63.7 of
            no adaptation <Ace>ACE, Section 2.2</Ace>. The authors observed it with Dynamic
            Cheatsheet and argue the risk belongs to any end-to-end rewrite by an LLM, which tends
            to compress a long context into a short summary. In RL terms, our reading: this is an
            update with no trust region, the limit that PPO (Proximal Policy Optimization) puts on
            how far one step can move the policy (section 5, Two Leashes: PPO&apos;s Clip &amp; the
            KL). One step undid sixty.
          </Box>
          <Box variant="p">
            <Box variant="strong">Keep everything: clutter.</Box> Dynamic Cheatsheet&apos;s
            full-history baseline appends every previous turn to the prompt with no curation. On
            AIME 2024, Claude 3.5 Sonnet scored 23.3% with no memory, 26.7% with the full history
            and 50.0% with the curated cheatsheet{' '}
            <Cheatsheet>Dynamic Cheatsheet, Section 4.3 and Table 2</Cheatsheet>. The same holds
            for what retrieval puts in the prompt. In ReasoningBank on WebArena-Shopping (web shopping tasks from
            the WebArena benchmark) with Gemini-2.5-flash, one retrieved memory item raised success
            from 39.0 to 49.7, and two, three or four items lowered it to 46.0, 45.5 and 44.4{' '}
            <Cite tier={3} href={REASONING_BANK} venue="ICLR 2026">
              ReasoningBank, Appendix C.1
            </Cite>
            . How an append-only memory behaves over thousands of tasks was not measured in the
            sources read. The nearest evidence is that retrieval count, and Memento&apos;s case
            bank, which &quot;saturates quickly&quot; at about 3k training items{' '}
            <Cite tier={3} href={MEMENTO} venue="preprint">
              Memento, Section 5.5.3
            </Cite>
            .
          </Box>
          <Box variant="p">
            <Box variant="strong">Curate, with a model that can fill the store.</Box> Curation
            needs good entries to curate. GPT-4o-mini under both Dynamic Cheatsheet variants scored
            13.3% on AIME 2024, below its own 16.7% baseline. The authors&apos; explanation:
            &quot;the base model must produce correct solutions with sufficient frequency to
            populate the memory with high-quality, reusable strategies&quot;{' '}
            <Cheatsheet>Dynamic Cheatsheet, Section 4.5 and Table 3</Cheatsheet>. In our reading,
            a store learns from tasks the model already solves some of the time, the condition
            section 7 sets for a GRPO group to carry any gradient.
          </Box>
          <Box variant="p">
            <Box variant="strong">In between: itemised steps.</Box> ACE&apos;s own ablation
            measures the middle of the scale. On AppWorld with DeepSeek-V3.1, offline adaptation
            with incremental delta updates reached 76.2 task goal completion on the test-normal
            split; the same method with its delta updates removed reached 67.3, against 63.7 with
            no adaptation <Ace>ACE, Appendix A.5 and Table 18</Ace>.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Check what admits a lesson to your store before you trust what the store builds"
          >
            The signal decides what gets kept
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The update rule sets how much changes; the signal decides what. Section 12, Verbal
            Reinforcement &amp; Self-Correction, showed a reflection loop learning only from a
            signal outside the model, and a store inherits that rule. Voyager admits a program to
            its library only after a GPT-4 check that the task succeeded. Removing that
            self-verification cut the count of items the agent discovered in Minecraft by 73%, and
            the authors call it the most important of their feedback types{' '}
            <Cite tier={3} href={VOYAGER} venue="TMLR">
              Voyager, Section 3.4
            </Cite>
            .
          </Box>
          <Box variant="p">
            ACE shows the same split inside one paper, on one model (DeepSeek-V3.1). On AppWorld,
            where running the agent&apos;s code returns execution feedback, ACE adapting online
            without ground-truth labels reached 59.5 against 42.4 for the ReAct baseline (an agent
            that interleaves reasoning and tool calls) <Ace>ACE, Table 1</Ace>. On FiNER, which
            tags each token of a financial filing with one of 139 entity types, label-free online
            ACE fell to 67.3 against the base model&apos;s 70.7, while ACE with labels reached
            76.7 <Ace>ACE, Section 4.1 and Table 2</Ace>. The authors trace the drop to the
            signal: when &quot;ground-truth supervision or reliable execution signals are
            absent&quot;, &quot;the constructed context can be polluted by spurious or misleading
            signals&quot; <Ace>ACE, Section 4.4</Ace>.
          </Box>
          <Box variant="p">
            So name the check that admits a lesson before choosing an update rule: a test that
            runs, a label, an environment reward. Section 10, The Reward Is a Proxy, gives the
            grader checklist that applies to it unchanged.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Size what a playbook loop delivers next to an RL run, from the one comparison on offer and its caveats"
          >
            What a store buys against a weight update
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            No same-model, same-budget comparison against RL was located for these memory and
            playbook loops in this research. The one RL comparison on offer, in the Training-Free
            GRPO paper, pairs different base models: ReTool on Qwen2.5-32B-Instruct against the
            text loop on Qwen3-32B, both on AIME 2024 with a code interpreter{' '}
            <TfGrpo>Training-Free GRPO, Table 3</TfGrpo>. ReTool is a fine-tuning-plus-RL pipeline:
            supervised fine-tuning on code-augmented reasoning traces as a cold start, then RL
            with task outcomes as the reward{' '}
            <Cite tier={3} href={RETOOL} venue="preprint">
              ReTool, abstract
            </Cite>
            .
          </Box>
          <Box variant="p">
            On Qwen2.5-32B-Instruct, a ReAct agent scored 29.6 and ReTool 67.0. On Qwen3-32B, a
            ReAct agent scored 29.1 and Training-Free GRPO 33.5{' '}
            <TfGrpo>Training-Free GRPO, Table 3</TfGrpo>. Our arithmetic from the papers&apos;
            figures: the fine-tuning-plus-RL pipeline lifted its model by 67.0 - 29.6 = 37.4
            points, and the text loop lifted a different 32B model by 33.5 - 29.1 = 4.4 points.
            The table is captioned as Mean@32, accuracy averaged over 32 independent runs of each
            problem <TfGrpo>Training-Free GRPO, Section 3.1 and Table 3</TfGrpo>, and its 67.0
            for ReTool matches the figure ReTool reports for its own 32B model, &quot;67% accuracy
            with 400 training steps&quot;{' '}
            <Cite tier={3} href={RETOOL} venue="preprint">
              ReTool, abstract
            </Cite>
            .
          </Box>
          <Box variant="p">
            The cost runs the other way. Training-Free GRPO was cheap to learn and dearer per
            query, again on a pair that compares different base models{' '}
            <TfGrpo>Training-Free GRPO, Section 4.2</TfGrpo>; section 20, Cost per Improvement,
            prices it. Part of the per-query cost is the playbook itself, which rides in every
            prompt, and prefix caching decides how much of it is billed (
            <Link href="../vllm/">vLLM dive, section 6: Automatic Prefix Caching</Link>). ACE
            served 91.8% of its input tokens from cache, measured during evaluation with the
            playbook frozen <Ace>ACE, Section 4.7</Ace>. No measurement of the cache hit rate
            while a loop edits its own context was located in this research.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Know which half of the loop a managed memory or skills feature gives you, and which half you build"
          >
            Vendor memory and skills ship the store
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            On the pages read on 2026-10-30, Anthropic&apos;s memory tool is client-side file
            storage: Claude &quot;stores what it learns in files under <code>/memories</code>
            &quot; and reads them back in later conversations, and the application runs each file
            operation on storage it controls. The page leaves size caps and expiry to the
            application{' '}
            <Cite tier={1} href={MEMORY_TOOL}>
              Claude docs: memory tool
            </Cite>
            . Agent Skills are packaged instructions loaded on demand: about 100 tokens of
            metadata per Skill sit in context from startup, and the instructions, under 5k tokens,
            load when the Skill is triggered{' '}
            <Cite tier={1} href={SKILLS_DOC}>
              Claude docs: Agent Skills overview
            </Cite>
            .
          </Box>
          <Box variant="p">
            Neither page describes an evaluator or reward that decides which lessons are kept.
            Agents that create, edit and evaluate their own Skills are stated as a future goal in
            Anthropic&apos;s engineering post of Oct 16, 2025: &quot;we hope to enable agents to
            create, edit, and evaluate Skills on their own&quot;{' '}
            <Cite tier={2} href={SKILLS_POST}>
              Anthropic Engineering, Equipping agents for the real world with Agent Skills
            </Cite>
            . On these features the store and the write path exist. The signal that admits a
            lesson and the rule that edits the store are the builder&apos;s job, and the checklist
            below specifies them.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Build a playbook that keeps what it learned: four design choices, each tied to the failure it prevents"
          >
            A playbook design checklist
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The model behind the checklist, in our reading of these studies: the design of the
            state and its update rule set the step size, and the signal decides what each step
            writes. Small, itemised steps keep what was learned; a full rewrite can erase it in
            one move.
          </Box>
          <ul>
            <li>
              <Box variant="p">
                <Box variant="strong">Itemised bullets with counters.</Box> Store each lesson as
                its own entry with counts of how often it helped or misled, as ACE does{' '}
                <Ace>ACE, Section 3.1</Ace>. ExpeL&apos;s importance count does the same job: a new
                insight starts at two, and an insight whose count reaches zero is removed{' '}
                <Cite tier={3} href={EXPEL} venue="AAAI 2024">
                  ExpeL, Section 4.2
                </Cite>
                . Evidence then prunes a lesson, one entry at a time.
              </Box>
            </li>
            <li>
              <Box variant="p">
                <Box variant="strong">Delta updates.</Box> Have the model write only new or changed
                entries and merge them with code, so no single update can rewrite the store. A full
                rewrite took 18,282 tokens to 122 in one step{' '}
                <Ace>ACE, Section 2.2</Ace>; removing ACE&apos;s delta updates lowered AppWorld task
                goal completion from 76.2 to 67.3 <Ace>ACE, Table 18</Ace>.
              </Box>
            </li>
            <li>
              <Box variant="p">
                <Box variant="strong">De-duplication and a size limit.</Box> Compare entries by
                embedding similarity and merge near-duplicates, and prune when the store passes a
                length you set; on FiNER, ACE&apos;s accuracy held steady with that limit set
                anywhere from 10K to 100K tokens <Ace>ACE, Section 3.2 and Appendix A.6</Ace>.
                Keep what reaches the prompt small: ReasoningBank did best with one retrieved item
                of the one to four it tested{' '}
                <Cite tier={3} href={REASONING_BANK} venue="ICLR 2026">
                  ReasoningBank, Appendix C.1
                </Cite>
                .
              </Box>
            </li>
            <li>
              <Box variant="p">
                <Box variant="strong">Successes compared with failures.</Box> Write a lesson from
                a comparison. Training-Free GRPO writes lessons only from groups with both clear
                winners and losers <TfGrpo>Training-Free GRPO, Section 2</TfGrpo>, and ExpeL
                extracts insights from success and failure pairs; adding free-floating reflections
                on failures dropped ExpeL on HotPotQA (multi-hop questions over Wikipedia) from
                39.0 to 29.0{' '}
                <Cite tier={3} href={EXPEL} venue="AAAI 2024">
                  ExpeL, Section 5.6 and Table 3
                </Cite>{' '}
                (section 12 has the detail).
              </Box>
            </li>
          </ul>
          <Box variant="p">
            Then log the store&apos;s token count at every update. In our reading of the collapse
            case, a step that shrinks the store sharply is the signature to catch: in ACE&apos;s
            case study the accuracy drop arrived in the same step as the shrink.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
