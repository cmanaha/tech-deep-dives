import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Table from '@cloudscape-design/components/table';
import { Cite, arxiv, gh, ghTree, TRL_TAG, TRL_PPO_TAG, E0_URL } from '../components/Cite';

/* Sources used in this section. Papers carry their arXiv version; code carries its tag. */
const SB_URL = 'http://incompleteideas.net/book/RLbook2020.pdf';
const ZIE19 = arxiv('1909.08593v2');
const STI20 = arxiv('2009.01325v3');
const OUY22 = arxiv('2203.02155v1');
const GAE = arxiv('1506.02438v6');
const DSM24 = arxiv('2402.03300v3');
const AHM24 = arxiv('2402.14740v2');
const IVI24 = arxiv('2406.09279v2');
const YUE25 = arxiv('2504.13837v5');
const REFLEXION = arxiv('2303.11366v4');
const TRL = 'huggingface/trl';
const PPO_TRAINER = 'trl/experimental/ppo/ppo_trainer.py';
const PPO_CONFIG = 'trl/experimental/ppo/ppo_config.py';
const TRL_113_NOTES = 'https://github.com/huggingface/trl/releases/tag/v1.13.0';

/* ------------------------------------------------------------------------ */
/* Diagram: one response as a trajectory of token actions                   */
/* ------------------------------------------------------------------------ */

interface TokenCell {
  x: number;
  w: number;
  token: string;
  step: string;
}

const TOKENS: TokenCell[] = [
  { x: 200, w: 60, token: '7', step: 't = 1' },
  { x: 270, w: 60, token: '*', step: 't = 2' },
  { x: 340, w: 60, token: '5', step: 't = 3' },
  { x: 470, w: 70, token: '29', step: 't = T-2' },
  { x: 550, w: 90, token: '</answer>', step: 't = T-1' },
];
const EOS = { x: 650, w: 94 };
const ELLIPSIS_X = 435;

function TrajectoryDiagram() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg
        viewBox="0 0 760 318"
        role="img"
        aria-labelledby="policy-traj-title"
        style={{ width: '100%', minWidth: 640, height: 'auto' }}
      >
        <title id="policy-traj-title">
          One response from a language model, drawn as an RL trajectory. The prompt is the starting
          state. Each generated token is one action, sampled from the policy given the prompt plus
          every token so far, and the response ends with the end-of-sequence token. Every step
          before the end receives a reward of 0; the grader&apos;s single score, 1.0 for a correct
          answer, arrives with the end-of-sequence token. In the response view the whole response is
          one action. Credit assignment is the task of deciding which tokens earned that score. In
          TRL&apos;s PPO trainer at v1.12.0 every token also carries a KL penalty, and the score is
          added at the end.
        </title>
        <style>{`
          .policy-traj-prompt { fill: #ffffff; stroke: #879596; stroke-width: 1.5; }
          .policy-traj-tok { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .policy-traj-eos { fill: #0972d3; stroke: #065299; stroke-width: 1.5; }
          .policy-traj-zero { fill: #ffffff; stroke: #d1d5db; stroke-width: 1; }
          .policy-traj-win { fill: #ecf7ec; stroke: #037f0c; stroke-width: 1.5; }
          .policy-traj-kl { fill: #fbf3d5; stroke: #8b6c00; stroke-width: 1; }
          .policy-traj-h { fill: #16191f; font: 600 12px sans-serif; }
          .policy-traj-hc { fill: #16191f; font: 600 12px sans-serif; text-anchor: middle; }
          .policy-traj-s { fill: #414d5c; font: 11px sans-serif; }
          .policy-traj-sc { fill: #414d5c; font: 11px sans-serif; text-anchor: middle; }
          .policy-traj-tt { fill: #0f1b2a; font: 600 13px sans-serif; text-anchor: middle; }
          .policy-traj-tw { fill: #ffffff; font: 600 13px sans-serif; text-anchor: middle; }
          .policy-traj-sw { fill: #ffffff; font: 11px sans-serif; text-anchor: middle; }
          .policy-traj-z { fill: #5f6b7a; font: 12px sans-serif; text-anchor: middle; }
          .policy-traj-wt { fill: #024a07; font: 600 13px sans-serif; text-anchor: middle; }
          .policy-traj-klt { fill: #16191f; font: 12px sans-serif; text-anchor: middle; }
          .policy-traj-resp { fill: #4a2f99; font: 600 12px sans-serif; text-anchor: middle; }
          .policy-traj-credit { fill: #024a07; font: 600 12px sans-serif; text-anchor: middle; }
          .policy-traj-creditsub { fill: #414d5c; font: 11px sans-serif; text-anchor: middle; }
          .policy-traj-brk { stroke: #879596; stroke-width: 1.5; fill: none; }
          .policy-traj-brkp { stroke: #6f4cc4; stroke-width: 1.5; fill: none; }
          .policy-traj-arr { stroke: #5f6b7a; stroke-width: 1.5; fill: none; }
          .policy-traj-carr { stroke: #037f0c; stroke-width: 1.5; fill: none; stroke-dasharray: 6 4; }
        `}</style>
        <defs>
          <marker
            id="policy-traj-ah"
            markerWidth="8"
            markerHeight="8"
            refX="8"
            refY="4"
            orient="auto-start-reverse"
            markerUnits="userSpaceOnUse"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill="#5f6b7a" />
          </marker>
          <marker
            id="policy-traj-ahg"
            markerWidth="8"
            markerHeight="8"
            refX="8"
            refY="4"
            orient="auto-start-reverse"
            markerUnits="userSpaceOnUse"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill="#037f0c" />
          </marker>
        </defs>

        <rect x={0} y={0} width={760} height={318} rx={8} fill="#ffffff" />

        {/* Response view: the whole response as one action */}
        <text x={472} y={22} className="policy-traj-resp">
          Response view: the whole response is one action
        </text>
        <path d="M200,40 L200,32 L744,32 L744,40" className="policy-traj-brkp" />

        {/* The prompt, the starting state */}
        <rect x={16} y={48} width={170} height={56} rx={6} className="policy-traj-prompt" />
        <text x={101} y={71} className="policy-traj-hc">
          Prompt
        </text>
        <text x={101} y={90} className="policy-traj-sc">
          Compute (3 + 4) * 5 - 6
        </text>

        {/* Token actions */}
        {TOKENS.map((t) => (
          <g key={t.step}>
            <rect x={t.x} y={48} width={t.w} height={56} rx={6} className="policy-traj-tok" />
            <text x={t.x + t.w / 2} y={73} className="policy-traj-tt">
              {t.token}
            </text>
            <text x={t.x + t.w / 2} y={94} className="policy-traj-sc">
              {t.step}
            </text>
          </g>
        ))}
        <text x={ELLIPSIS_X} y={80} className="policy-traj-tt">
          ...
        </text>
        <rect x={EOS.x} y={48} width={EOS.w} height={56} rx={6} className="policy-traj-eos" />
        <text x={EOS.x + EOS.w / 2} y={73} className="policy-traj-tw">
          EOS
        </text>
        <text x={EOS.x + EOS.w / 2} y={94} className="policy-traj-sw">
          t = T
        </text>

        {/* Token view: the state and the next action */}
        <path d="M16,116 L16,124 L460,124 L460,116" className="policy-traj-brk" />
        <text x={16} y={144} className="policy-traj-h">
          Token view: the state before step T-2 is the prompt plus every token so far
        </text>
        <text x={16} y={161} className="policy-traj-s">
          The policy samples the next token, here 29, from π(token | state)
        </text>
        <path d="M466,126 Q492,126 502,110" className="policy-traj-arr" markerEnd="url(#policy-traj-ah)" />

        {/* Reward per step */}
        <text x={16} y={188} className="policy-traj-h">
          Reward per step
        </text>
        <text x={16} y={203} className="policy-traj-s">
          one score, at the end
        </text>
        {TOKENS.map((t) => (
          <g key={`r-${t.step}`}>
            <rect x={t.x + 6} y={176} width={t.w - 12} height={30} rx={4} className="policy-traj-zero" />
            <text x={t.x + t.w / 2} y={196} className="policy-traj-z">
              0
            </text>
          </g>
        ))}
        <text x={ELLIPSIS_X} y={196} className="policy-traj-z">
          ...
        </text>
        <rect x={EOS.x + 6} y={176} width={EOS.w - 12} height={30} rx={4} className="policy-traj-win" />
        <text x={EOS.x + EOS.w / 2} y={196} className="policy-traj-wt">
          R = 1.0
        </text>

        {/* Credit assignment */}
        <path d="M697,206 L697,222 L210,222" className="policy-traj-carr" markerEnd="url(#policy-traj-ahg)" />
        <text x={460} y={241} className="policy-traj-credit">
          Credit assignment: which tokens earned the 1.0?
        </text>
        <text x={460} y={257} className="policy-traj-creditsub">
          With one reward at the end, every step&apos;s return is that same score
        </text>

        {/* TRL v1.12.0 PPO: the two views mixed in one reward vector */}
        <text x={16} y={284} className="policy-traj-h">
          TRL v1.12.0 PPO
        </text>
        <text x={16} y={299} className="policy-traj-s">
          per-token reward
        </text>
        {TOKENS.map((t) => (
          <g key={`k-${t.step}`}>
            <rect x={t.x + 4} y={272} width={t.w - 8} height={30} rx={4} className="policy-traj-kl" />
            <text x={t.x + t.w / 2} y={292} className="policy-traj-klt">
              -β KL
            </text>
          </g>
        ))}
        <text x={ELLIPSIS_X} y={292} className="policy-traj-z">
          ...
        </text>
        <rect x={EOS.x + 4} y={272} width={EOS.w - 8} height={30} rx={4} className="policy-traj-kl" />
        <text x={EOS.x + EOS.w / 2} y={292} className="policy-traj-klt">
          -β KL + R
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* The vocabulary table                                                     */
/* ------------------------------------------------------------------------ */

interface VocabRow {
  term: string;
  generation: string;
  notation: string;
}

const VOCAB: VocabRow[] = [
  {
    term: 'Policy',
    generation: "The model's probability for each next token, set by its weights",
    notation: 'π_θ(a | s), π_θ(y | x)',
  },
  {
    term: 'State',
    generation: 'The prompt plus every token generated so far',
    notation: 's_t, x ◦ y_<t',
  },
  {
    term: 'Action',
    generation: 'The next token (token view) or the whole response (response view)',
    notation: 'a_t, y_t, or y',
  },
  {
    term: 'Rollout (episode, trajectory)',
    generation: 'One response, from the prompt to the end-of-sequence token, with its score',
    notation: 'τ, (x, y)',
  },
  {
    term: 'Reward',
    generation: "The grader's or reward model's score, given once at the end",
    notation: 'r, R, r(x, y)',
  },
  {
    term: 'Return',
    generation: 'Sum of rewards from step t to the end; with one end reward, the final score',
    notation: 'G_t',
  },
  {
    term: 'Value',
    generation: 'Expected return from a state: the predicted final score of a partial response',
    notation: 'V(s_t), V(x ◦ y_<t)',
  },
  {
    term: 'Advantage',
    generation: 'How much better an action did than the policy usually does from that state',
    notation: 'A = Q - V',
  },
];

/* ------------------------------------------------------------------------ */
/* Section                                                                  */
/* ------------------------------------------------------------------------ */

export function LanguageModelAsPolicy() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Read any reinforcement learning paper's equations by mapping them onto the sampling you already run (TRL v1.12.0 and papers, read 2026-10-30)"
          >
            3. The Language Model Is Already a Policy
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Every call to a language model at a temperature above zero draws from a probability
            distribution: the chance of each next token, given the prompt and every token so far. RL
            (reinforcement learning) calls a mapping from situations to probabilities over actions a
            policy{' '}
            <Cite tier={3} href={SB_URL} venue="textbook">
              Sutton and Barto, section 3.5
            </Cite>
            , so a language model is a policy before anyone trains it: fix the beginning of the
            sample to the prompt, and generate the rest with the model{' '}
            <Cite tier={3} href={ZIE19} venue="preprint">
              Ziegler et al., section 2
            </Cite>
            .
          </Box>
          <Box variant="p">
            The challenge in reading RL papers is vocabulary. The same response is a sequence of
            token actions in one paper and a single action in the next, and the equations change
            shape with that choice while the sampling call underneath stays the same. This section maps
            each RL term onto generation, so the rest of the dive, and any paper you open, reads in
            one language.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Tell whether an equation counts each token or the whole response as the action, and see that both describe the same sampling call"
          >
            One response, two ways to count its actions
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            In the token view, the state is the prompt plus the tokens generated so far, the action
            is the next token, and one response is one episode{' '}
            <Cite tier={3} href={IVI24} venue="NeurIPS 2024">
              Ivison et al., appendix F.2
            </Cite>
            . Moving to the next state is simple: append the chosen token. A state has to carry
            everything about the past that matters for the future, which RL calls the Markov
            property{' '}
            <Cite tier={3} href={SB_URL} venue="textbook">
              Sutton and Barto, section 3.1
            </Cite>
            . In our reading, the prefix meets that test by construction, because the model
            conditions on all of it. The context window is the state, and anything placed in it, a
            retrieved document, a tool result, a critique, becomes part of the state the policy acts
            on.
          </Box>
          <TrajectoryDiagram />
          <Box variant="small" color="text-body-secondary">
            Illustrative, not measured: a prompt in the style of E0&apos;s arithmetic task (E0 is
            our GRPO, Group Relative Policy Optimization, smoke test on a DGX Spark), drawn with a
            few readable tokens; a real tokenizer splits the text differently. EOS is the
            end-of-sequence token. The 1.0 is E0&apos;s grader for a correct tagged answer. The
            bottom row is the PPO (Proximal Policy Optimization) trainer of TRL (Transformers
            Reinforcement Learning, Hugging Face&apos;s post-training library) at v1.12.0, where β
            scales a KL (Kullback-Leibler divergence) penalty; the last part of this section reads
            that code.
          </Box>
          <Box variant="p">
            The response view treats the whole response as one action. InstructGPT describes its RL
            stage this way: the environment is a bandit environment that presents a random customer
            prompt, expects a response, scores it with the reward model and ends the episode{' '}
            <Cite tier={3} href={OUY22} venue="NeurIPS 2022">
              InstructGPT, section 3.5
            </Cite>
            . The two views describe the same computation. The next state is fully determined by the
            token just chosen, and the reward only arrives at the end, so the token-level process
            reduces to a bandit whose only states are the prompt and the finished response{' '}
            <Cite tier={3} href={AHM24} venue="ACL 2024">
              Ahmadian et al., section 3.3
            </Cite>
            .
          </Box>
          <Box variant="p">
            A bandit is the smallest RL problem: pick one of several options, receive one reward,
            and carry nothing forward. A new prompt each time makes it a contextual bandit, in which
            each action affects only its own reward; once actions also shape the next situation, the
            full RL problem begins{' '}
            <Cite tier={3} href={SB_URL} venue="textbook">
              Sutton and Barto, section 2.9
            </Cite>
            . The bandit isolates the explore-or-exploit trade (keep choosing what has scored best
            so far, or try something that might score better) in a setting that avoids much of the
            complexity of the full problem{' '}
            <Cite tier={3} href={SB_URL} venue="textbook">
              Sutton and Barto, chapter 2
            </Cite>
            .
          </Box>
          <Box variant="p">
            Which view a method takes shapes everything after it. PPO models each token as an
            action, while REINFORCE, the basic policy-gradient method of
            section 4, and RLOO (REINFORCE Leave-One-Out) model the entire response as one action{' '}
            <Cite tier={3} href={AHM24} venue="ACL 2024">
              Ahmadian et al., section 3.3
            </Cite>
            . Treating the response as one action lets plain REINFORCE optimise the sequence-level
            reward directly{' '}
            <Cite tier={3} href={AHM24} venue="ACL 2024">
              Ahmadian et al., section 2.2
            </Cite>
            . One attempt from prompt to score is called an episode, a rollout or a trajectory
            depending on the paper. This dive says rollout, and keeps episode where a source states
            its figure per episode.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="See why one number at the end-of-sequence token is the difficulty that critics, baselines and group averages in sections 4 to 7 exist to handle"
          >
            One score at the end, spread over every token
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The reward arrives once. The reward model scores entire responses and gives nothing at
            intermediate steps; each episode ends when the policy outputs the end-of-sequence (EOS)
            token, and the discount factor is 1, so a reward counts the same however many tokens
            precede it{' '}
            <Cite tier={3} href={STI20} venue="NeurIPS 2020">
              Stiennon et al., section 3.4, footnote 8
            </Cite>
            . In E0, the mean completion length per step ranged from 124 to 164 tokens, and each
            completion received a single number: 1.0 if the tagged answer was right, 0.0 if not{' '}
            <Cite tier={0} href={E0_URL}>
              E0 log: GRPO smoke test on a DGX Spark
            </Cite>
            . A signal that arrives this rarely is called a sparse reward. The same holds whether
            the score comes from a reward model trained on human preferences (section 6) or from a
            program that checks the answer (section 7).
          </Box>
          <Box variant="p">
            The return is the sum of rewards from a step to the end of the episode{' '}
            <Cite tier={3} href={SB_URL} venue="textbook">
              Sutton and Barto, section 3.3
            </Cite>
            . With one reward at the end and a discount of 1, every token&apos;s return is that same
            final score; the arithmetic follows from the two definitions. The return alone cannot
            tell the 29 that decided the answer from the tokens that came before it.
          </Box>
          <Box variant="p">
            Spreading that one score back over the tokens that earned it is the credit assignment
            problem: the long delay between actions and their effect on reward{' '}
            <Cite tier={3} href={GAE} venue="ICLR 2016">
              Schulman et al., Generalized Advantage Estimation, section 1
            </Cite>
            . For language models it is also why a per-token critic is hard to train: usually only
            the last token is assigned a reward score by the reward model, which complicates
            training a value function that is accurate at each token{' '}
            <Cite tier={3} href={DSM24} venue="preprint">
              DeepSeekMath, section 4.1.1
            </Cite>
            .
          </Box>
          <Box variant="p">
            Two quantities do the spreading. The value of a state is the return the policy is
            expected to collect from there{' '}
            <Cite tier={3} href={SB_URL} venue="textbook">
              Sutton and Barto, section 3.5
            </Cite>
            ; for a language model it is a prediction of the final score of a partial response, and
            PPO trains a separate value model to make it{' '}
            <Cite tier={3} href={IVI24} venue="NeurIPS 2024">
              Ivison et al., appendix F.2
            </Cite>
            . The advantage is how much better an action did than expected: Q, the expected return
            after taking that particular action and then following the policy{' '}
            <Cite tier={3} href={SB_URL} venue="textbook">
              Sutton and Barto, section 3.5
            </Cite>
            , minus V, the value of the state{' '}
            <Cite tier={3} href={GAE} venue="ICLR 2016">
              Schulman et al., Generalized Advantage Estimation, section 2
            </Cite>
            .
          </Box>
          <Box variant="p">
            <code>A(s, a) = Q(s, a) - V(s)</code>
          </Box>
          <Box variant="p">
            Its sign carries the decision. A policy-gradient step makes better-than-average actions
            more likely and worse-than-average actions less likely, and the advantage measures
            which side of the policy&apos;s default behaviour an action fell on{' '}
            <Cite tier={3} href={GAE} venue="ICLR 2016">
              Schulman et al., Generalized Advantage Estimation, section 2
            </Cite>
            . Section 4 shows the two ways to estimate it: learn V with a critic, or sample it from
            other attempts at the same prompt.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Read on-policy data, exploration and pass@k as properties of the sampling you configure, starting with the temperature"
          >
            How you sample decides what can be learned
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            On-policy methods evaluate or improve the policy that is making the decisions;
            off-policy methods improve a policy different from the one that generated the data{' '}
            <Cite tier={3} href={SB_URL} venue="textbook">
              Sutton and Barto, section 5.4
            </Cite>
            . A trainer that samples fresh rollouts from the current weights at every step is
            on-policy: in E0, each of the 20 steps generated 16 new completions with vLLM before it
            trained{' '}
            <Cite tier={0} href={E0_URL}>
              E0 log: GRPO smoke test on a DGX Spark
            </Cite>
            . Training on a fixed file of responses that another model or a person produced is
            off-policy; section 6 meets it in preference training on a fixed dataset.
          </Box>
          <Box variant="p">
            Exploration is the trade RL adds over supervised learning. The learner has to exploit
            what has already earned reward and also explore to find better actions, and the issue
            does not arise in supervised learning in its pure form{' '}
            <Cite tier={3} href={SB_URL} venue="textbook">
              Sutton and Barto, section 1.1
            </Cite>
            . Policy-gradient methods explore by keeping the policy from becoming deterministic{' '}
            <Cite tier={3} href={SB_URL} venue="textbook">
              Sutton and Barto, section 13.1
            </Cite>
            . For a language model, the knob is the sampling temperature you already set:
            InstructGPT sampled its RL rollouts at temperature 1{' '}
            <Cite tier={3} href={OUY22} venue="NeurIPS 2022">
              InstructGPT, appendix C.4
            </Cite>
            , the Tulu 2 PPO runs at 0.7{' '}
            <Cite tier={3} href={IVI24} venue="NeurIPS 2024">
              Ivison et al., appendix F.2
            </Cite>
            , and E0 at 1.0{' '}
            <Cite tier={0} href={E0_URL}>
              E0 log
            </Cite>
            . Greedy decoding returns the same response every time, so it explores nothing.
          </Box>
          <Box variant="p">
            pass@1 is the chance that one sample is correct. pass@k is the chance that at least one
            of k samples is: for one problem it is 1 if any of the k samples passes verification and
            0 otherwise, and its average over a dataset is the share of problems the model can solve
            within k tries{' '}
            <Cite tier={3} href={YUE25} venue="NeurIPS 2025">
              Yue et al., section 2
            </Cite>
            . It measures what sampling can reach, where pass@1 measures what one call returns.
            Section 8 reads the two as curves against k, and that comparison carries the dive&apos;s
            question of what RL adds to a model.
          </Box>
          <ExpandableSection headerText="Measuring pass@k on your own grader">
            <SpaceBetween size="s">
              <Box variant="p">
                Drawing exactly k samples per problem gives a high-variance estimate. Draw n
                samples per problem instead, with n at least k, count the c that pass, and use the
                unbiased estimator of Chen et al., as Yue et al. do{' '}
                <Cite tier={3} href={YUE25} venue="NeurIPS 2025">
                  Yue et al., appendix A.2
                </Cite>
                :
              </Box>
              <Box variant="p">
                <code>pass@k = mean over problems of [ 1 - C(n - c, k) / C(n, k) ]</code>
              </Box>
              <Box variant="p">
                Here <code>C(a, b)</code> is the binomial coefficient, the number of ways to choose
                b items from a. With a programmatic grader such as E0&apos;s, the same n samples give
                pass@1 and every pass@k up to n.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Map any paper's symbols onto a generation call in one table, then check where a trainer actually puts the reward"
          >
            Reading an RL paper&apos;s equations
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Every term above has a counterpart in a generation call, and papers write them with a
            small set of symbols. The table is the map; the notation column shows the common
            spellings.
          </Box>
          <Table
            variant="embedded"
            wrapLines
            trackBy="term"
            items={VOCAB}
            columnDefinitions={[
              { id: 'term', header: 'RL term', cell: (r) => r.term, minWidth: 140 },
              { id: 'gen', header: 'In a generation call', cell: (r) => r.generation, minWidth: 260 },
              { id: 'notation', header: 'Written as', cell: (r) => <code>{r.notation}</code>, minWidth: 150 },
            ]}
          />
          <Box variant="p">
            To tell which view an equation takes, look at what the log-probability is taken over.
            A sum over t of <code>log π(y_t | x, y_&lt;t)</code>, with a reward or advantage indexed
            by t and a value model over partial responses, is the token view: PPO as used for
            language models reads this way{' '}
            <Cite tier={3} href={IVI24} venue="NeurIPS 2024">
              Ivison et al., appendix F.2, Eq. 4
            </Cite>
            . A single <code>log π(y | x)</code> of the whole response, multiplied by a reward{' '}
            <code>R(y, x)</code>, is the response view: REINFORCE and RLOO read this way{' '}
            <Cite tier={3} href={AHM24} venue="ACL 2024">
              Ahmadian et al., section 2.2, Eq. 6
            </Cite>
            . The two connect through the factorisation every language model is built on: the
            probability of a sequence is the product of its next-token probabilities{' '}
            <Cite tier={3} href={ZIE19} venue="preprint">
              Ziegler et al., section 2
            </Cite>
            , so a response&apos;s log-probability is the sum of its tokens&apos; log-probabilities.
            Our arithmetic from that: a response-level update gives every token the same weight, and
            the token view lets each token carry its own.
          </Box>
          <Box variant="p">
            Running code mixes the two. TRL shipped its PPO trainer for the last time in v1.12.0,
            before removing it in v1.13.0{' '}
            <Cite tier={1} href={TRL_113_NOTES}>
              TRL v1.13.0 release notes: PPO is removed
            </Cite>
            . In that trainer every token gets a KL penalty, a charge for drifting from the
            reference model the run started from, and the reward model&apos;s score
            is added at the end of the response{' '}
            <Cite tier={1} href={gh(TRL, TRL_PPO_TAG, PPO_TRAINER, 'L771-L779')} kind="code">
              TRL v1.12.0 ppo_trainer.py L771-L779
            </Cite>
            . That is the bottom row of the diagram, and the same per-token reward as the PPO
            formulation in{' '}
            <Cite tier={3} href={IVI24} venue="NeurIPS 2024">
              Ivison et al., appendix F.2, Eq. 4
            </Cite>
            . The score is a response-level reward, the penalty is a token-level one, and the critic
            and the advantage are then computed per token{' '}
            <Cite tier={1} href={gh(TRL, TRL_PPO_TAG, PPO_TRAINER, 'L786-L798')} kind="code">
              TRL v1.12.0 ppo_trainer.py L786-L798
            </Cite>
            . Whether a per-token term exists is a setting: E0 ran GRPO with its KL coefficient at
            0.0, TRL v1.16.0&apos;s default, so one number per completion of 124 to 164 tokens on
            average was the only reward the run had{' '}
            <Cite tier={0} href={E0_URL}>
              E0 log: GRPO smoke test on a DGX Spark
            </Cite>
            .
          </Box>
          <ExpandableSection headerText="The reward vector in TRL v1.12.0, line by line">
            <SpaceBetween size="s">
              <Box variant="p">
                The block that builds the per-token reward, from{' '}
                <Cite tier={1} href={gh(TRL, TRL_PPO_TAG, PPO_TRAINER, 'L771-L779')} kind="code">
                  ppo_trainer.py L771-L779
                </Cite>
                :
              </Box>
              <pre style={{ margin: 0, whiteSpace: 'pre', overflowX: 'auto' }}>
                <code>{`# 4. compute rewards
# Formula used by http://joschu.net/blog/kl-approx.html for the k1 and k3 estimators
logr = ref_logprobs - logprobs
kl = -logr if args.kl_estimator == "k1" else (logr.exp() - 1) - logr  # Else statement is k3
non_score_reward = -args.kl_coef * kl
rewards = non_score_reward.clone()
actual_start = torch.arange(rewards.size(0), device=rewards.device)
actual_end = torch.where(sequence_lengths_p1 < rewards.size(1), sequence_lengths_p1, sequence_lengths)
rewards[actual_start, actual_end] += scores`}</code>
              </pre>
              <Box variant="p">
                Line by line: the per-token KL estimate compares the policy&apos;s log-probability of
                each sampled token with the reference model&apos;s; every token&apos;s reward starts as
                minus <code>kl_coef</code> times that estimate; then the reward model&apos;s{' '}
                <code>scores</code> are added at one index per response, at its end. The discount{' '}
                <code>gamma</code> defaults to 1.0, the same discount of 1 as above{' '}
                <Cite tier={1} href={gh(TRL, TRL_PPO_TAG, PPO_CONFIG, 'L264-L267')}>
                  TRL v1.12.0 ppo_config.py L264-L267
                </Cite>
                . In that release the class lives under <code>trl.experimental.ppo</code>; the
                top-level <code>from trl import PPOTrainer</code> had already stopped working in
                v1.10{' '}
                <Cite tier={1} href={TRL_113_NOTES}>
                  TRL v1.13.0 release notes
                </Cite>
                . At the dive&apos;s TRL pin, v1.16.0, the trainer directory holds GRPO and RLOO
                trainers and no PPO{' '}
                <Cite tier={1} href={ghTree(TRL, TRL_TAG, 'trl/trainer')}>
                  TRL v1.16.0 trl/trainer
                </Cite>
                , so classic PPO in TRL means pinning v1.12.0 or older.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Write any loop you run down as a policy, and find the part a text loop changes"
          >
            Edit the context, edit the policy
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            The vocabulary carries over to loops that never touch the weights. Reflexion, a loop
            that writes a lesson into memory after each failed attempt and then retries (section
            12), defines its policy as the agent&apos;s memory paired with a choice of model
            parameters{' '}
            <Cite tier={3} href={REFLEXION} venue="NeurIPS 2023">
              Reflexion, section 1
            </Cite>
            . In this section&apos;s terms, the memory sits in the context, the context is the state
            the model conditions on, and so editing the memory changes which responses the policy
            samples while the weights stay fixed. That is our reading, and section 11 builds the
            words track on it.
          </Box>
          <Box variant="p">
            The next step is to write down one loop or trainer you run in these terms: the action (a
            token or a whole response), where its reward lands and how often (one score per rollout,
            or a charge per token beside it), whether its samples come from the current policy, and
            what its policy is made of (the weights alone, or the weights plus text the loop carries
            forward). Sections 4 to 7 change the weights; sections 11 to 16 change that text.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
