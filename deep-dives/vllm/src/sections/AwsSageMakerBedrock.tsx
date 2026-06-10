import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Table from '@cloudscape-design/components/table';
import Alert from '@cloudscape-design/components/alert';
import Link from '@cloudscape-design/components/link';

function SageMakerPathsDiagram() {
  return (
    <svg
      viewBox="0 0 880 360"
      role="img"
      aria-labelledby="sm-paths-title"
      style={{ width: '100%', height: 'auto' }}
    >
      <title id="sm-paths-title">
        The three SageMaker paths to host vLLM arranged on an ownership spectrum, from most
        AWS-managed on the left to most you-managed on the right. Path A is LMI / DJL-Serving,
        where vLLM is the rolling-batch backend selected by config (OPTION_ROLLING_BATCH=vllm) and
        AWS owns the image. Path B is the AWS vLLM Deep Learning Container, an AWS-built image
        shipping vLLM deployed straight onto an endpoint, where AWS owns the image and you own
        config plus the endpoint. Path C is Bring-Your-Own-Container, where you own the Dockerfile,
        the vLLM or SGLang version, and the serving glue, and AWS owns only the endpoint runtime
        contract. All three paths deploy onto the same SageMaker real-time or async inference
        endpoint, which provides managed autoscaling, IAM, VPC, CloudWatch, and the model registry.
      </title>
      <style>
        {`
          .smcardA { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .smcardB { fill: #effcf8; stroke: #1f7a70; stroke-width: 1.5; }
          .smcardC { fill: #fbf3d5; stroke: #8b6c00; stroke-width: 1.5; }
          .smbase { fill: #e9f2fb; stroke: #065299; stroke-width: 2; }
          .smtitle { fill: #0f1b2a; font: 600 14px sans-serif; text-anchor: middle; }
          .smsub { fill: #414d5c; font: 11px sans-serif; text-anchor: middle; }
          .smspectrum { fill: #5f6b7a; font: 600 12px sans-serif; text-anchor: middle; letter-spacing: 0.4px; }
          .smbasetitle { fill: #0f1b2a; font: 600 13px sans-serif; text-anchor: middle; }
          .smedge { stroke: #879596; stroke-width: 1.5; fill: none; marker-end: url(#sm-arrow); }
        `}
      </style>
      <defs>
        <marker id="sm-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#879596" />
        </marker>
        <marker id="sm-spec-start" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M10,0 L0,5 L10,10 z" fill="#5f6b7a" />
        </marker>
        <marker id="sm-spec-end" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#5f6b7a" />
        </marker>
      </defs>

      {/* Spectrum arrow */}
      <line
        x1={150}
        y1={28}
        x2={730}
        y2={28}
        stroke="#5f6b7a"
        strokeWidth={1.5}
        markerStart="url(#sm-spec-start)"
        markerEnd="url(#sm-spec-end)"
      />
      <text className="smspectrum" x={150} y={18} textAnchor="start">MORE AWS-MANAGED</text>
      <text className="smspectrum" x={730} y={18} textAnchor="end">MORE YOU-MANAGED</text>

      {/* Path A card */}
      <rect className="smcardA" x={20} y={50} width={260} height={150} rx={8} />
      <text className="smtitle" x={150} y={74}>A. LMI / DJL-Serving</text>
      <text className="smsub" x={150} y={96}>vLLM is the rolling-batch</text>
      <text className="smsub" x={150} y={112}>backend of a managed</text>
      <text className="smsub" x={150} y={128}>model server.</text>
      <text className="smsub" x={150} y={152}>Config, not code:</text>
      <text className="smsub" x={150} y={168}>OPTION_ROLLING_BATCH=vllm</text>
      <text className="smsub" x={150} y={190} style={{ fontWeight: 600 }}>AWS owns the image.</text>

      {/* Path B card */}
      <rect className="smcardB" x={310} y={50} width={260} height={150} rx={8} />
      <text className="smtitle" x={440} y={74}>B. AWS vLLM DLC</text>
      <text className="smsub" x={440} y={96}>AWS-built Deep Learning</text>
      <text className="smsub" x={440} y={112}>Container shipping vLLM,</text>
      <text className="smsub" x={440} y={128}>deployed straight onto</text>
      <text className="smsub" x={440} y={144}>an endpoint.</text>
      <text className="smsub" x={440} y={168}>AWS owns the image;</text>
      <text className="smsub" x={440} y={190} style={{ fontWeight: 600 }}>you own config + endpoint.</text>

      {/* Path C card */}
      <rect className="smcardC" x={600} y={50} width={260} height={150} rx={8} />
      <text className="smtitle" x={730} y={74}>C. Bring-Your-Own-Container</text>
      <text className="smsub" x={730} y={96}>Your Dockerfile, your</text>
      <text className="smsub" x={730} y={112}>vLLM / SGLang version,</text>
      <text className="smsub" x={730} y={128}>your serving glue.</text>
      <text className="smsub" x={730} y={152}>ml-container-creator</text>
      <text className="smsub" x={730} y={168}>can scaffold it.</text>
      <text className="smsub" x={730} y={190} style={{ fontWeight: 600 }}>You own the image.</text>

      {/* Connectors down to the shared endpoint */}
      <path className="smedge" d="M150 200 V250" />
      <path className="smedge" d="M440 200 V250" />
      <path className="smedge" d="M730 200 V250" />

      {/* Shared SageMaker endpoint base */}
      <rect className="smbase" x={20} y={254} width={840} height={86} rx={8} />
      <text className="smbasetitle" x={440} y={286}>SageMaker real-time / async inference endpoint</text>
      <text className="smsub" x={440} y={310}>managed autoscaling, IAM, VPC, CloudWatch,</text>
      <text className="smsub" x={440} y={326}>model registry</text>
    </svg>
  );
}

function BedrockVsSelfHostDiagram() {
  return (
    <svg
      viewBox="0 0 900 540"
      role="img"
      aria-labelledby="bedrock-tree-title"
      style={{ width: '100%', height: 'auto' }}
    >
      <title id="bedrock-tree-title">
        A decision tree for choosing between self-hosting vLLM and Amazon Bedrock. First, do you
        need custom or fine-tuned weights that are not offered on Bedrock? If yes, self-host vLLM.
        If no, do you need a specific vLLM feature such as a multi-LoRA fleet, prefill/decode
        disaggregation, or custom batching and scheduling? If yes, self-host vLLM. If no, do you
        need instance-level hardware control for cost at volume, or VPC and data-residency
        isolation that Bedrock cannot give you? If yes, self-host vLLM. If no, use Bedrock, the
        lowest-ops choice. This is speculative, synthesized guidance, not a single AWS decision
        document.
      </title>
      <style>
        {`
          .bq { fill: #ffffff; stroke: #879596; stroke-width: 1.5; }
          .bself { fill: #e9f2fb; stroke: #065299; stroke-width: 2; }
          .bbed { fill: #effcf8; stroke: #1f7a70; stroke-width: 2; }
          .bqt { fill: #0f1b2a; font: 600 13px sans-serif; text-anchor: middle; }
          .bqs { fill: #5f6b7a; font: 11px sans-serif; text-anchor: middle; }
          .bleaf { fill: #0f1b2a; font: 600 14px sans-serif; text-anchor: middle; }
          .bleafsub { fill: #414d5c; font: 11px sans-serif; text-anchor: middle; }
          .bedge { stroke: #879596; stroke-width: 1.5; fill: none; marker-end: url(#bt-arrow); }
          .belbl { fill: #414d5c; font: 600 11px sans-serif; text-anchor: middle; }
        `}
      </style>
      <defs>
        <marker id="bt-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#879596" />
        </marker>
      </defs>

      {/* Q1 */}
      <rect className="bq" x={250} y={20} width={400} height={56} rx={6} />
      <text className="bqt" x={450} y={44}>Need custom / fine-tuned weights</text>
      <text className="bqt" x={450} y={62}>NOT offered on Bedrock?</text>

      {/* Q1 -> SELF-HOST (yes, left) */}
      <path className="bedge" d="M250 48 H120 V108" />
      <text className="belbl" x={170} y={40}>yes</text>

      {/* Q1 -> Q2 (no, down) */}
      <path className="bedge" d="M450 76 V128" />
      <text className="belbl" x={468} y={102}>no</text>

      {/* Q2 */}
      <rect className="bq" x={250} y={128} width={400} height={72} rx={6} />
      <text className="bqt" x={450} y={152}>Need a specific vLLM feature?</text>
      <text className="bqs" x={450} y={172}>multi-LoRA fleet, P/D disaggregation,</text>
      <text className="bqs" x={450} y={188}>custom batching / scheduling</text>

      {/* Q2 -> SELF-HOST (yes, left) — arrives at the leaf's right edge */}
      <path className="bedge" d="M250 164 H220" />
      <text className="belbl" x={235} y={156}>yes</text>

      {/* Q2 -> Q3 (no, down) */}
      <path className="bedge" d="M450 200 V252" />
      <text className="belbl" x={468} y={226}>no</text>

      {/* SELF-HOST leaf (left) — shared target of Q1-yes and Q2-yes */}
      <rect className="bself" x={20} y={108} width={200} height={64} rx={6} />
      <text className="bleaf" x={120} y={136}>SELF-HOST vLLM</text>
      <text className="bleafsub" x={120} y={156}>control &amp; specificity</text>

      {/* Q3 */}
      <rect className="bq" x={250} y={252} width={400} height={88} rx={6} />
      <text className="bqt" x={450} y={276}>Need instance-level hardware</text>
      <text className="bqt" x={450} y={294}>control for cost-at-volume, OR</text>
      <text className="bqs" x={450} y={314}>VPC / data-residency isolation</text>
      <text className="bqs" x={450} y={330}>Bedrock can&apos;t give you?</text>

      {/* Q3 -> SELF-HOST (yes, left) */}
      <path className="bedge" d="M250 296 H120 V420" />
      <text className="belbl" x={170} y={288}>yes</text>

      {/* Q3 -> BEDROCK (no, down) */}
      <path className="bedge" d="M450 340 V420" />
      <text className="belbl" x={468} y={384}>no</text>

      {/* SELF-HOST leaf (bottom-left) — target of Q3-yes */}
      <rect className="bself" x={20} y={420} width={200} height={64} rx={6} />
      <text className="bleaf" x={120} y={448}>SELF-HOST vLLM</text>
      <text className="bleafsub" x={120} y={468}>maximal control</text>

      {/* BEDROCK leaf (bottom-center) */}
      <rect className="bbed" x={300} y={420} width={300} height={64} rx={6} />
      <text className="bleaf" x={450} y={448}>USE BEDROCK</text>
      <text className="bleafsub" x={450} y={468}>lowest ops — the startup default</text>
    </svg>
  );
}

function LmiConfigToEngineDiagram() {
  return (
    <svg
      viewBox="0 0 900 360"
      role="img"
      aria-labelledby="lmi-config-title"
      style={{ width: '100%', height: 'auto' }}
    >
      <title id="lmi-config-title">
        How LMI configuration reaches the vLLM engine. On the left, two equivalent config sources feed
        LMI: serving.properties using option dot keys, and environment variables using OPTION
        underscore keys, where serving.properties overrides env. LMI then splits every key into one of
        two classes: LMI-native keys, which LMI translates into engine settings, and pass-through keys,
        which LMI forwards opaquely to vLLM EngineArgs without validating them, so a typo fails at
        container startup rather than at parse time. Both classes converge on vLLM's AsyncLLMEngine,
        which exposes the OpenAI-compatible API serving the chat completions and completions routes.
      </title>
      <style>
        {`
          .lcsrc { fill: #fbf3d5; stroke: #8b6c00; stroke-width: 1.5; }
          .lclmi { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .lcnative { fill: #effcf8; stroke: #1f7a70; stroke-width: 1.5; }
          .lcpass { fill: #fdf3f1; stroke: #b1462f; stroke-width: 1.5; }
          .lcengine { fill: #e9f2fb; stroke: #065299; stroke-width: 2; }
          .lct { fill: #0f1b2a; font: 600 13px sans-serif; text-anchor: middle; }
          .lcs { fill: #414d5c; font: 11px sans-serif; text-anchor: middle; }
          .lcmono { fill: #5f6b7a; font: 11px monospace; text-anchor: middle; }
          .lcedge { stroke: #879596; stroke-width: 1.5; fill: none; marker-end: url(#lc-arrow); }
          .lclbl { fill: #5f6b7a; font: 600 10px sans-serif; text-anchor: middle; }
        `}
      </style>
      <defs>
        <marker id="lc-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#879596" />
        </marker>
      </defs>

      {/* Config sources */}
      <rect className="lcsrc" x={20} y={40} width={200} height={56} rx={6} />
      <text className="lct" x={120} y={62}>serving.properties</text>
      <text className="lcmono" x={120} y={82}>option.* keys</text>

      <rect className="lcsrc" x={20} y={140} width={200} height={56} rx={6} />
      <text className="lct" x={120} y={162}>environment vars</text>
      <text className="lcmono" x={120} y={182}>OPTION_* keys</text>

      <text className="lclbl" x={120} y={120}>serving.properties overrides env</text>

      {/* LMI box */}
      <rect className="lclmi" x={300} y={88} width={150} height={60} rx={6} />
      <text className="lct" x={375} y={114}>LMI</text>
      <text className="lcs" x={375} y={132}>DJL-Serving</text>

      {/* edges sources -> LMI */}
      <path className="lcedge" d="M220 68 H260 V108 H300" />
      <path className="lcedge" d="M220 168 H260 V128 H300" />

      {/* Split into two classes */}
      <rect className="lcnative" x={510} y={36} width={210} height={64} rx={6} />
      <text className="lct" x={615} y={60}>LMI-native keys</text>
      <text className="lcs" x={615} y={80}>LMI translates</text>
      <text className="lcs" x={615} y={94}>into engine settings</text>

      <rect className="lcpass" x={510} y={136} width={210} height={72} rx={6} />
      <text className="lct" x={615} y={160}>pass-through keys</text>
      <text className="lcs" x={615} y={180}>forwarded opaquely to</text>
      <text className="lcs" x={615} y={194}>EngineArgs — not validated</text>

      {/* edges LMI -> classes */}
      <path className="lcedge" d="M450 108 H480 V68 H510" />
      <path className="lcedge" d="M450 128 H480 V170 H510" />

      {/* Engine box */}
      <rect className="lcengine" x={770} y={86} width={110} height={120} rx={6} />
      <text className="lct" x={825} y={120}>vLLM</text>
      <text className="lcs" x={825} y={138}>AsyncLLMEngine</text>
      <text className="lcs" x={825} y={166}>OpenAI-compatible</text>
      <text className="lcs" x={825} y={180}>API</text>

      {/* edges classes -> engine */}
      <path className="lcedge" d="M720 68 H745 V120 H770" />
      <path className="lcedge" d="M720 172 H745 V150 H770" />

      <text className="lclbl" x={825} y={228}>/v1/chat/completions</text>
    </svg>
  );
}

function SageMakerHostingSurfaceDiagram() {
  return (
    <svg
      viewBox="0 0 920 420"
      role="img"
      aria-labelledby="sm-surface-title"
      style={{ width: '100%', height: 'auto' }}
    >
      <title id="sm-surface-title">
        The SageMaker hosting surface for vLLM. The SageMaker AI platform contains three hosting
        surfaces. First, a real-time endpoint composed of Inference Components, where one component
        holds a base model that swaps LoRA adapters per request and components can scale to zero.
        Second, HyperPod running on EKS, where vLLM pods run multi-node over EFA with a tiered KV
        cache and optional llm-d prefill/decode disaggregation. Third, JumpStart, a one-click model
        source that lands open-source models on the LMI container, which uses vLLM as its backend.
        JumpStart feeds into the LMI-on-real-time-endpoint path.
      </title>
      <style>
        {`
          .ssplatform { fill: #f7fafd; stroke: #5f6b7a; stroke-width: 1.5; }
          .ssrt { fill: #f2f8fd; stroke: #0972d3; stroke-width: 1.5; }
          .sship { fill: #ffffff; stroke: #0972d3; stroke-width: 1.2; }
          .sshp { fill: #effcf8; stroke: #1f7a70; stroke-width: 1.5; }
          .ssjs { fill: #fbf3d5; stroke: #8b6c00; stroke-width: 1.5; }
          .sspt { fill: #0f1b2a; font: 600 13px sans-serif; text-anchor: middle; }
          .ssph { fill: #0f1b2a; font: 600 14px sans-serif; text-anchor: middle; }
          .sss { fill: #414d5c; font: 11px sans-serif; text-anchor: middle; }
          .ssmono { fill: #5f6b7a; font: 10px monospace; text-anchor: middle; }
          .ssedge { stroke: #879596; stroke-width: 1.5; fill: none; marker-end: url(#ss-arrow); }
        `}
      </style>
      <defs>
        <marker id="ss-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#879596" />
        </marker>
      </defs>

      {/* Platform frame */}
      <rect className="ssplatform" x={12} y={12} width={896} height={396} rx={10} />
      <text className="ssph" x={460} y={36} textAnchor="middle">Amazon SageMaker AI — hosting surface for vLLM</text>

      {/* Real-time endpoint with Inference Components */}
      <rect className="ssrt" x={36} y={58} width={400} height={180} rx={8} />
      <text className="sspt" x={236} y={82}>Real-time endpoint — Inference Components</text>

      <rect className="sship" x={56} y={100} width={170} height={114} rx={6} />
      <text className="sspt" x={141} y={124}>IC: base model</text>
      <text className="sss" x={141} y={146}>swaps LoRA adapters</text>
      <text className="sss" x={141} y={162}>per request</text>
      <text className="ssmono" x={141} y={184}>OPTION_MAX_LORAS</text>
      <text className="sss" x={141} y={204}>scale-to-zero</text>

      <rect className="sship" x={246} y={100} width={170} height={114} rx={6} />
      <text className="sspt" x={331} y={124}>IC: base model B</text>
      <text className="sss" x={331} y={146}>its own copy count</text>
      <text className="sss" x={331} y={162}>(Min/Max)</text>
      <text className="sss" x={331} y={188}>coexists on the</text>
      <text className="sss" x={331} y={204}>same endpoint</text>

      {/* HyperPod (EKS) */}
      <rect className="sshp" x={460} y={58} width={424} height={180} rx={8} />
      <text className="sspt" x={672} y={82}>HyperPod (EKS)</text>
      <text className="sss" x={672} y={106}>vLLM pods — multi-node over EFA</text>
      <text className="sss" x={672} y={128}>tiered KV cache (L1 CPU, L2 managed)</text>
      <text className="sss" x={672} y={150}>cache-aware routing (prefix / KV / session)</text>
      <text className="sss" x={672} y={172}>KEDA + Karpenter, minReplicaCount: 0</text>
      <text className="sss" x={672} y={200}>optional llm-d prefill/decode</text>
      <text className="sss" x={672} y={216}>disaggregation</text>

      {/* JumpStart */}
      <rect className="ssjs" x={36} y={300} width={300} height={86} rx={8} />
      <text className="sspt" x={186} y={326}>JumpStart — one-click source</text>
      <text className="sss" x={186} y={348}>open-source models land on the</text>
      <text className="sss" x={186} y={366}>LMI container (vLLM backend)</text>

      {/* JumpStart -> real-time endpoint (LMI -> vLLM) */}
      <path className="ssedge" d="M186 300 V268 H236 V238" />
      <text className="sss" x={300} y={262} textAnchor="start">→ LMI → vLLM</text>
    </svg>
  );
}

export function AwsSageMakerBedrock() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Three ways to run vLLM under SageMaker, the mechanics that actually bite (config, endpoint limits, scaling, HyperPod/JumpStart, placement) — and the harder question of whether a startup should self-host vLLM at all when Amazon Bedrock exists."
          >
            25. vLLM on SageMaker &amp; vs Bedrock
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The framing:</strong> by this point in the deep dive you know <em>how</em> vLLM
            works. This section is about <em>where you run it on AWS</em> and, one level up, whether
            you run it yourself at all. Two decisions, nested. First: if you have decided to operate
            vLLM, SageMaker gives you three distinct paths to host it &mdash; from fully managed to
            fully bring-your-own. Second, and prior to that: a startup founder should ask whether the
            right answer is to skip operating an inference server entirely and call{' '}
            <strong>Amazon Bedrock&apos;s</strong> managed model API instead. Get the second decision
            wrong and you are running a fleet you did not need; get it right and the three SageMaker
            paths are exactly the menu you want. Past the menu, this section also goes into the
            mechanics that actually decide whether a deploy works: how you configure vLLM under LMI,
            which endpoint type to pick and the timeouts that silently fail, how scaling and
            scale-to-zero work, the HyperPod and JumpStart surfaces, and where vLLM should ultimately
            live (SageMaker vs EKS vs EC2).
          </Box>
          <Box variant="p">
            <strong>The honest disclaimer up front:</strong> the &quot;self-host vLLM vs Bedrock&quot;
            decision below is <strong>synthesized guidance</strong> drawn from AWS&apos;s public
            positioning of each service &mdash; it is <em>not</em> a single AWS decision document, and
            you will not find an official AWS page that says &quot;choose Bedrock when X, choose
            self-hosted vLLM when Y.&quot; Treat the decision table as a practitioner&apos;s map, not
            an authoritative spec. The three SageMaker hosting paths, by contrast, are documented
            first-party and are labeled as such. This section pairs with{' '}
            <strong>26. When Not vLLM</strong> (the cases where you should not run vLLM at all) and{' '}
            <strong>28. Decision Guide</strong> (the consolidated end-to-end chooser).
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">The three SageMaker paths to run vLLM</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            SageMaker does not have &quot;a vLLM button.&quot; It has a spectrum: how much of the
            container and serving stack AWS owns versus how much you own. There are three discrete
            points on that spectrum, in order of decreasing AWS ownership. The diagram orients them;
            the tabs below walk each one against its first-party source.
          </Box>

          <Box variant="div">
            <Box variant="small" color="text-status-info">
              Three SageMaker paths to host vLLM, ordered by how much AWS owns vs. you own
            </Box>
            <SageMakerPathsDiagram />
          </Box>

          <Alert type="info">
            <strong>What all three share:</strong> whichever path you pick, the thing you get is a{' '}
            <em>SageMaker endpoint</em> &mdash; managed autoscaling, IAM auth, VPC attachment,
            CloudWatch metrics, and the model registry come from SageMaker, not from vLLM. The choice
            between A, B, and C is purely about <strong>who owns the container</strong>: AWS owns it
            (A and B) or you do (C). The vLLM engine inside is the same engine documented in the rest
            of this deep dive.
          </Alert>

          <ExpandableSection
            headerText="Path A — LMI / DJL-Serving with vLLM as the rolling-batch backend (the managed path)"
            defaultExpanded
          >
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>[Tier-1, AWS/DJL docs]</strong> The Large Model Inference (LMI) containers
                are, verbatim, &quot;a set of high-performance Docker Containers purpose built for
                large language model (LLM) inference&quot; that bundle an inference library with the
                DJL-Serving model server for &quot;efficient LLM serving on AWS SageMaker
                Endpoints&quot; (
                <Link
                  external
                  href="https://docs.djl.ai/master/docs/serving/serving/docs/lmi/index.html"
                >
                  DJL Docs: LMI Container Overview, accessed 2026-06-07
                </Link>
                ). LMI supports two inference backends &mdash; <strong>vLLM</strong> and
                TensorRT-LLM &mdash; behind a unified configuration format.
              </Box>
              <Box variant="p">
                <strong>The key move is that vLLM is selected by configuration, not code.</strong> You
                do not write a server; you set <code>OPTION_ROLLING_BATCH=vllm</code> (or, in{' '}
                <code>serving.properties</code>, <code>option.rolling_batch=vllm</code>) and DJL-Serving
                runs vLLM as its rolling-batch &mdash; that is, continuous-batching &mdash; engine
                under the hood (
                <Link
                  external
                  href="https://docs.djl.ai/master/docs/serving/serving/docs/lmi/user_guides/vllm_user_guide.html"
                >
                  DJL Docs: LMI vLLM User Guide, accessed 2026-06-07
                </Link>
                ). You then tune knobs like <code>option.max_rolling_batch_size</code> for your model
                and instance. This is the lowest-effort way to get vLLM&apos;s continuous batching on a
                SageMaker endpoint: point at a Hugging Face or S3 model ID, set the backend flag, deploy.
              </Box>
              <Alert type="warning">
                <strong>[Tier-1, DJL release notes / LMI blog] One correction:{' '}
                <code>OPTION_ROLLING_BATCH=vllm</code> is now the LEGACY path.</strong> Since LMI v17
                (September 2025) the default is <strong>async mode</strong> &mdash;{' '}
                <code>OPTION_ASYNC_MODE=true</code> with{' '}
                <code>OPTION_ENTRYPOINT=djl_python.lmi_vllm.vllm_async_service</code> &mdash; which wires
                LMI directly to vLLM&apos;s <code>AsyncLLMEngine</code> through vLLM&apos;s own OpenAI
                modules. The practical consequence: the request/response surface matches upstream
                vLLM&apos;s OpenAI-compatible server (tool calling, multimodal, logprobs) rather than
                DJL&apos;s older rolling-batch abstraction. Prefer async mode for new deploys; reach for
                <code>OPTION_ROLLING_BATCH=vllm</code> only when pinning to a pre-v17 image (
                <Link
                  external
                  href="https://docs.djl.ai/master/docs/serving/serving/docs/lmi/user_guides/vllm_user_guide.html"
                >
                  DJL Docs: LMI vLLM User Guide, accessed 2026-06-07
                </Link>
                ).
              </Alert>
              <Alert type="info">
                <strong>When Path A fits:</strong> you want vLLM&apos;s throughput characteristics but
                you do not want to own a container or pin a vLLM version. AWS owns the image and its
                upgrade cadence; you own a handful of <code>OPTION_*</code> environment variables. This
                is the default recommendation for most teams that have decided to self-host on SageMaker.
              </Alert>
            </SpaceBetween>
          </ExpandableSection>

          <ExpandableSection headerText="Path B — the AWS vLLM Deep Learning Container deployed directly on an endpoint">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>[Tier-1, AWS docs]</strong> AWS publishes a <strong>vLLM Deep Learning
                Container</strong> &mdash; an AWS-built, AWS-maintained image that ships vLLM itself
                (not vLLM-as-a-backend-of-DJL) &mdash; with first-party guidance for deploying it onto a
                SageMaker endpoint (
                <Link
                  external
                  href="https://docs.aws.amazon.com/deep-learning-containers/latest/devguide/dlc-vllm-sagemaker.html"
                >
                  AWS Docs: vLLM Deep Learning Containers on SageMaker, accessed 2026-06-07
                </Link>
                ).
                <Box variant="span" color="text-status-info">
                  {' '}
                  (Note: at access time this AWS doc page renders its body client-side; the URL is live
                  and first-party. Verify the exact deployment steps in-browser.)
                </Box>
              </Box>
              <Box variant="p">
                The distinction from Path A is subtle but real: in Path A the model server is
                DJL-Serving and vLLM is a pluggable engine; in Path B the container <em>is</em> a vLLM
                serving image that AWS maintains, deployed straight onto the endpoint. You get AWS&apos;s
                build, patching, and CVE hygiene of the image, but the server you are talking to is
                vLLM&apos;s own surface rather than DJL&apos;s abstraction.
              </Box>
              <Alert type="info">
                <strong>When Path B fits:</strong> you want to talk to vLLM directly &mdash; its native
                OpenAI-compatible surface and engine arguments &mdash; while still letting AWS own the
                container build and its security updates. A middle ground between &quot;DJL abstracts
                vLLM for me&quot; (A) and &quot;I build the image myself&quot; (C).
              </Alert>
            </SpaceBetween>
          </ExpandableSection>

          <ExpandableSection headerText="Path C — bring-your-own-container (the awslabs ml-container-creator generator)">
            <SpaceBetween size="s">
              <Box variant="p">
                <strong>[Tier-1, AWS docs / Tier-3, awslabs repo]</strong> SageMaker has always
                supported <strong>bring-your-own-container (BYOC)</strong>: package any server that
                honors the SageMaker endpoint runtime contract (the <code>/ping</code> and{' '}
                <code>/invocations</code> HTTP routes) and deploy it. For vLLM specifically, the AWS
                Labs <strong>ml-container-creator</strong> CLI generates SageMaker-compatible BYOC
                images and explicitly lists vLLM and SGLang among its supported LLM model servers,
                targeting SageMaker real-time and async endpoints (
                <Link external href="https://github.com/awslabs/ml-container-creator">
                  awslabs/ml-container-creator (GitHub), accessed 2026-06-07
                </Link>
                ).
              </Box>
              <Box variant="p">
                This is the path when you need a specific vLLM (or SGLang) version, a custom patch, an
                unusual dependency, or serving glue that neither LMI nor the AWS vLLM DLC ships. You own
                the Dockerfile and therefore the entire upgrade and security burden &mdash; the cost of
                maximum control.
              </Box>
              <Alert type="warning">
                <strong>The tier on this one:</strong> SageMaker BYOC is Tier-1 documented; the{' '}
                <code>ml-container-creator</code> generator itself is an <strong>AWS Labs</strong>{' '}
                project (Tier-3 relative to core AWS docs). Treat it as a convenience generator, not a
                supported product surface &mdash; you can always hand-write the Dockerfile against the
                SageMaker contract if you prefer not to depend on a Labs tool.
              </Alert>
            </SpaceBetween>
          </ExpandableSection>

          <Table
            variant="embedded"
            header={<Header variant="h3">The three paths at a glance</Header>}
            columnDefinitions={[
              { id: 'path', header: 'Path', cell: (i) => <strong>{i.path}</strong> },
              { id: 'owns', header: 'Who owns the container', cell: (i) => i.owns },
              { id: 'select', header: 'How vLLM gets selected', cell: (i) => i.select },
              { id: 'fit', header: 'Reach for it when', cell: (i) => i.fit },
            ]}
            items={[
              {
                path: 'A. LMI / DJL-Serving',
                owns: 'AWS (the LMI image)',
                select: 'Config: OPTION_ROLLING_BATCH=vllm',
                fit: 'You want vLLM throughput with the least ownership; AWS handles image + upgrades.',
              },
              {
                path: 'B. AWS vLLM DLC',
                owns: 'AWS (the vLLM image)',
                select: "AWS-built vLLM image, deployed onto the endpoint directly",
                fit: "You want vLLM's native surface but still want AWS to maintain the container.",
              },
              {
                path: 'C. BYOC',
                owns: 'You (your Dockerfile)',
                select: 'Whatever you build in; ml-container-creator can scaffold it',
                fit: 'You need a specific version, a custom patch, or serving glue the others lack.',
              },
            ]}
          />
          <Box variant="small">
            Sources &mdash; all accessed 2026-06-07:{' '}
            <Link external href="https://docs.djl.ai/master/docs/serving/serving/docs/lmi/index.html">
              DJL LMI Overview
            </Link>{' '}
            (Tier-1),{' '}
            <Link
              external
              href="https://docs.aws.amazon.com/deep-learning-containers/latest/devguide/dlc-vllm-sagemaker.html"
            >
              AWS vLLM DLC on SageMaker
            </Link>{' '}
            (Tier-1),{' '}
            <Link external href="https://github.com/awslabs/ml-container-creator">
              awslabs ml-container-creator
            </Link>{' '}
            (Tier-3 / AWS Labs).
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Configuring vLLM under LMI — and a worked deploy</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            Path A is the default, so it is worth knowing how its dials actually work. LMI takes config
            two equivalent ways: a <code>serving.properties</code> file using <code>option.*</code> keys,
            or environment variables using <code>OPTION_*</code> keys &mdash; and where both are set,{' '}
            <strong><code>serving.properties</code> overrides the environment</strong>. Under that there
            are two classes of key. <strong>LMI-native</strong> keys are ones LMI understands and{' '}
            <em>translates</em> into engine settings. <strong>Pass-through</strong> keys are forwarded
            opaquely to vLLM&apos;s <code>EngineArgs</code> and are <strong>not validated by LMI</strong>{' '}
            &mdash; so a typo in a pass-through key does not fail at parse time; it fails at container
            startup when vLLM rejects the argument (
            <Link
              external
              href="https://docs.djl.ai/master/docs/serving/serving/docs/lmi/deployment_guide/configurations.html"
            >
              [Tier-1] DJL Docs: LMI Configurations, accessed 2026-06-07
            </Link>
            ,{' '}
            <Link
              external
              href="https://docs.djl.ai/master/docs/serving/serving/docs/lmi/user_guides/vllm_user_guide.html"
            >
              [Tier-1] DJL Docs: LMI vLLM User Guide, accessed 2026-06-07
            </Link>
            ).
          </Box>

          <Box variant="div">
            <Box variant="small" color="text-status-info">
              LMI config sources split into LMI-native (translated) vs pass-through (forwarded) keys,
              both reaching vLLM&apos;s AsyncLLMEngine
            </Box>
            <LmiConfigToEngineDiagram />
          </Box>

          <Table
            variant="embedded"
            header={<Header variant="h3">The LMI config keys you reach for most (Tier-1, DJL docs)</Header>}
            columnDefinitions={[
              { id: 'key', header: 'Key (env form)', cell: (i) => <code>{i.key}</code> },
              { id: 'default', header: 'Default / example', cell: (i) => i.def },
              { id: 'what', header: 'What it does', cell: (i) => i.what },
            ]}
            items={[
              { key: 'OPTION_TENSOR_PARALLEL_DEGREE', def: '1 ("max" = all GPUs)', what: 'Tensor-parallel degree across the instance GPUs.' },
              { key: 'OPTION_MAX_ROLLING_BATCH_SIZE', def: '256', what: 'Max concurrent sequences in the continuous batch.' },
              { key: 'OPTION_QUANTIZE', def: 'awq / fp8 / bitsandbytes', what: 'Weight quantization scheme.' },
              { key: 'OPTION_DTYPE', def: 'fp16', what: 'Compute dtype for activations/weights.' },
              { key: 'OPTION_MAX_MODEL_LEN', def: 'e.g. 8192', what: 'Max context length the engine will allocate for.' },
              { key: 'OPTION_GPU_MEMORY_UTILIZATION', def: 'e.g. 0.9', what: 'Fraction of GPU memory vLLM may claim for weights + KV cache.' },
              { key: 'OPTION_ENABLE_PREFIX_CACHING', def: 'true / false', what: 'Turns on automatic prefix caching (see section 6).' },
              { key: 'OPTION_ENABLE_LORA / OPTION_MAX_LORAS', def: 'false / e.g. 4', what: 'Enables multi-LoRA serving and caps simultaneously loaded adapters.' },
              { key: 'OPTION_TRUST_REMOTE_CODE', def: 'false', what: 'Allows custom modeling code from the model repo.' },
              { key: 'OPTION_MODEL_LOADING_TIMEOUT', def: '1800 (s)', what: 'How long LMI waits for the model to load before failing.' },
              { key: 'HF_MODEL_ID', def: 'org/model | s3://… | /opt/ml/model', what: 'HF Hub id (needs HF_TOKEN for gated), an S3 URI, or a model_data S3DataSource mounted at /opt/ml/model.' },
            ]}
          />

          <Table
            variant="embedded"
            header={<Header variant="h3">LMI version → bundled vLLM version (Tier-1, DJL release notes)</Header>}
            columnDefinitions={[
              { id: 'lmi', header: 'LMI version', cell: (i) => <strong>{i.lmi}</strong> },
              { id: 'vllm', header: 'Bundled vLLM', cell: (i) => i.vllm },
              { id: 'tag', header: 'Image tag (djl-inference)', cell: (i) => <code>{i.tag}</code> },
            ]}
            items={[
              { lmi: 'v20 (2026-02-09)', vllm: '0.15.1', tag: '0.36.0-lmi20.0.0-cu128-v1.0' },
              { lmi: 'v19', vllm: '0.14.0', tag: '…-lmi19…' },
              { lmi: 'v18', vllm: '0.12.0', tag: '…-lmi18…' },
              { lmi: 'v17', vllm: '0.11.1', tag: '…-lmi17…' },
            ]}
          />
          <Box variant="small">
            ECR account <code>763104351884</code>, repo <code>djl-inference</code>. The LMI-bundled vLLM
            consistently <strong>lags upstream vLLM</strong> &mdash; a real tradeoff for Path A vs
            BYOC/EKS if you need a feature in a release LMI has not picked up yet (
            <Link
              external
              href="https://docs.djl.ai/master/docs/serving/serving/docs/lmi/release_notes.html"
            >
              [Tier-1] DJL Docs: LMI release notes, accessed 2026-06-07
            </Link>
            ;{' '}
            <Link
              external
              href="https://aws.amazon.com/blogs/machine-learning/supercharge-your-llm-performance-with-amazon-sagemaker-large-model-inference-container-v15/"
            >
              [Tier-2] AWS ML Blog: Supercharge LLM performance with LMI v15, accessed 2026-06-07
            </Link>
            ).
          </Box>

          <Box variant="div">
            <Box variant="h3">A worked deploy</Box>
            <Box variant="p">
              Retrieve the LMI image by version, build a <code>Model</code> with your config as env
              vars, and <code>deploy()</code> to a GPU instance. Async mode is set explicitly here:
            </Box>
            <pre style={{ overflowX: 'auto', fontSize: '12px', lineHeight: 1.5 }}>{`import sagemaker

container_uri = sagemaker.image_uris.retrieve(
    framework="djl-lmi", version="0.36.0", region=region
)

model = sagemaker.Model(
    image_uri=container_uri,
    role=role,
    env={
        "HF_MODEL_ID": "meta-llama/Llama-3.1-8B-Instruct",
        "OPTION_TENSOR_PARALLEL_DEGREE": "max",
        "OPTION_ASYNC_MODE": "true",
    },
)

predictor = model.deploy(
    instance_type="ml.g5.12xlarge",
    initial_instance_count=1,
)`}</pre>
            <Box variant="p">
              There is also a higher-level{' '}
              <code>sagemaker.djl_inference.model.DJLModel</code> wrapper that takes the same
              <code>OPTION_*</code> config and infers a sensible image, if you prefer not to retrieve the
              URI yourself (
              <Link
                external
                href="https://docs.djl.ai/master/docs/serving/serving/docs/lmi/deployment_guide/deploying-your-endpoint.html"
              >
                [Tier-1] DJL Docs: Deploying your endpoint, accessed 2026-06-07
              </Link>
              ).
            </Box>
          </Box>

          <Alert type="info">
            <strong>One route, two request schemas.</strong> The same <code>/invocations</code> route
            serves both the LMI-native <code>{'{"inputs", "parameters"}'}</code> schema and the OpenAI{' '}
            <code>{'{"messages": [...]}'}</code> schema &mdash; the presence of a <code>messages</code>{' '}
            field triggers a <code>chat.completion</code> response. Streaming uses SageMaker&apos;s{' '}
            <code>/invocations-response-stream</code> with <code>{'"stream": true'}</code> (JSON-lines{' '}
            <code>chat.completion.chunk</code> events). In async mode (v17+) the surface is exactly
            upstream vLLM&apos;s OpenAI API &mdash; tool calling, multimodal, and logprobs all come
            straight from the vLLM backend (
            <Link
              external
              href="https://docs.djl.ai/master/docs/serving/serving/docs/lmi/user_guides/chat_input_output_schema.html"
            >
              [Tier-1] DJL Docs: Chat input/output schema, accessed 2026-06-07
            </Link>
            ).
          </Alert>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Endpoint types, limits, and the streaming timeout</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            Whichever container path you pick, it lands on a SageMaker endpoint &mdash; and the endpoint{' '}
            <em>type</em> decides your payload ceiling, your timeout, and whether scale-to-zero is even
            possible. For vLLM there is really one primary choice and a couple of situational ones.
          </Box>

          <Table
            variant="embedded"
            header={<Header variant="h3">SageMaker endpoint types for vLLM (Tier-1, AWS docs)</Header>}
            columnDefinitions={[
              { id: 'type', header: 'Endpoint type', cell: (i) => <strong>{i.type}</strong> },
              { id: 'gpu', header: 'GPU', cell: (i) => i.gpu },
              { id: 'payload', header: 'Payload / timeout', cell: (i) => i.lim },
              { id: 'use', header: 'Use it for', cell: (i) => i.use },
            ]}
            items={[
              { type: 'Real-time', gpu: 'Yes', lim: '6 MB payload; 60 s (8 min streaming)', use: 'The PRIMARY choice — interactive, low-latency, streaming serving.' },
              { type: 'Asynchronous', gpu: 'Yes', lim: '1 GB payload; 60 min timeout', use: 'Long / large / batch-like requests; supports scale-to-zero.' },
              { type: 'Batch Transform', gpu: 'Yes (job)', lim: 'Job-based, offline', use: 'Niche offline eval / bulk generation.' },
              { type: 'Serverless', gpu: 'No', lim: '—', use: 'INCOMPATIBLE with vLLM — no GPU.' },
            ]}
          />
          <Box variant="small">
            Sources, accessed 2026-06-07:{' '}
            <Link external href="https://docs.aws.amazon.com/sagemaker/latest/dg/model-deploy-feature-matrix.html">
              [Tier-1] SageMaker deploy feature matrix
            </Link>
            ,{' '}
            <Link external href="https://docs.aws.amazon.com/sagemaker/latest/dg/deploy-model-options.html">
              [Tier-1] SageMaker deploy model options
            </Link>
            .
          </Box>

          <Alert type="warning">
            <strong>The streaming-timeout footgun.</strong> A real-time <em>non-streaming</em> request
            hard-caps at <strong>60 seconds</strong> (non-adjustable). Streaming via{' '}
            <code>/invocations-response-stream</code> extends that to <strong>8 minutes</strong>. A long
            generation that does <em>not</em> stream will silently fail at 60 s &mdash; so for very long
            jobs, either stream or move to an <strong>Asynchronous</strong> endpoint (60 min / 1 GB).
            Payload ceilings: <strong>6 MB</strong> for <code>InvokeEndpoint</code> (HTTP 413 if exceeded),{' '}
            <strong>25 MB</strong> for streaming (
            <Link external href="https://docs.aws.amazon.com/sagemaker/latest/dg/hosting-faqs.html">
              [Tier-1] SageMaker hosting FAQs, accessed 2026-06-07
            </Link>
            ).
          </Alert>

          <Alert type="warning">
            <strong>Large-model deploy params you must raise.</strong> vLLM models are big and slow to
            load, so the SageMaker defaults will fight you:
            <ul>
              <li>
                <code>VolumeSizeInGB</code> &mdash; default is too small for {'>'}30 GB models; a 70B FP16
                (~140 GB) needs {'>'}=180 GB.
              </li>
              <li>
                <code>ModelDataDownloadTimeoutInSeconds</code> &mdash; {'>'}=1800 for {'>'}40 GB models.
              </li>
              <li>
                <code>ContainerStartupHealthCheckTimeoutInSeconds</code> &mdash; {'>'}=1800, or
                vLLM&apos;s slow load trips the <code>/ping</code> health check into a restart loop.
              </li>
            </ul>
            The container must serve <code>/invocations</code> + <code>/ping</code> on{' '}
            <strong>port 8080</strong> &mdash; vLLM defaults to 8000, so the official vLLM SageMaker
            entrypoint and its <code>SM_VLLM_*</code> env vars do the translation (
            <Link external href="https://docs.aws.amazon.com/sagemaker/latest/dg/large-model-inference-hosting.html">
              [Tier-1] SageMaker large-model inference hosting, accessed 2026-06-07
            </Link>
            ;{' '}
            <Link external href="https://github.com/aws/model-hosting-container-standards">
              [Tier-1] aws/model-hosting-container-standards, accessed 2026-06-07
            </Link>
            ).
          </Alert>

          <Box variant="p">
            <strong>One open gap.</strong> vLLM does not yet natively honor SageMaker session affinity
            (the <code>X-Amzn-SageMaker-Session-Id</code> header) for cross-request KV reuse &mdash; it is
            an open RFC, so for now session-sticky prefix reuse on a SageMaker endpoint is not a
            turnkey feature (
            <Link external href="https://github.com/vllm-project/vllm/issues/28163">
              [Tier-1] vLLM issue #28163, accessed 2026-06-07
            </Link>
            ).
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Scaling on SageMaker: Inference Components, autoscaling &amp; scale-to-zero</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Inference Components (ICs)</strong> are the modern hosting object on a real-time
            endpoint. An IC is a deployable unit &mdash; a container plus a model &mdash; that reserves a
            slice of accelerators/memory and carries its own <code>MinCopyCount</code>/
            <code>MaxCopyCount</code>. Multiple ICs can share one endpoint. This is exactly the shape the
            multi-LoRA pattern wants: one IC is a vLLM/LMI container holding a base model that swaps LoRA
            adapters per request (S-LoRA / Punica, capped by <code>OPTION_MAX_LORAS</code>), and several
            such base-model ICs coexist on a single endpoint (
            <Link external href="https://docs.aws.amazon.com/sagemaker/latest/dg/endpoint-auto-scaling-policy.html">
              [Tier-1] SageMaker endpoint auto-scaling policy, accessed 2026-06-07
            </Link>
            ;{' '}
            <Link external href="https://aws.amazon.com/blogs/machine-learning/efficient-and-cost-effective-multi-tenant-lora-serving-with-amazon-sagemaker/">
              [Tier-2] AWS ML Blog: multi-tenant LoRA serving on SageMaker, accessed 2026-06-07
            </Link>
            ).
          </Box>

          <Alert type="info">
            <strong>Scale-to-zero is an Inference-Component feature only.</strong> Plain variant
            endpoints cannot scale to zero; ICs can, via <code>MinInstanceCount: 0</code> +{' '}
            <code>ManagedInstanceScaling</code>. Scale-out from zero is driven by the{' '}
            <code>NoCapacityInvocationFailures</code> step policy, and the cold start back up is roughly{' '}
            <strong>5&ndash;6 minutes</strong> &mdash; fine for dev/batch tenants, too slow for
            latency-critical paths (
            <Link external href="https://aws.amazon.com/blogs/machine-learning/unlock-cost-savings-with-the-new-scale-down-to-zero-feature-in-amazon-sagemaker-inference/">
              [Tier-2] AWS ML Blog: scale-down-to-zero on SageMaker Inference, accessed 2026-06-07
            </Link>
            ).
          </Alert>

          <Table
            variant="embedded"
            header={<Header variant="h3">Autoscaling metrics for LLM endpoints</Header>}
            columnDefinitions={[
              { id: 'metric', header: 'Metric', cell: (i) => <code>{i.metric}</code> },
              { id: 'res', header: 'Resolution', cell: (i) => i.res },
              { id: 'note', header: 'Note', cell: (i) => i.note },
            ]}
            items={[
              {
                metric: 'SageMakerVariantInvocationsPerInstance',
                res: '60 s',
                note: 'Legacy, not LLM-aware — counts invocations, blind to in-flight concurrency and streaming.',
              },
              {
                metric: 'SageMakerVariantConcurrentRequestsPerModelHighResolution',
                res: '10 s',
                note: 'Newer, streaming-aware (ConcurrentRequestsPerModel) — counts until the LAST streamed token; ~6x faster scale-out.',
              },
              {
                metric: 'SageMakerInferenceComponentConcurrentRequestsPerCopyHighResolution',
                res: '10 s',
                note: 'Per-copy concurrency (ConcurrentRequestsPerCopy) for IC autoscaling. Scale-FROM-zero still needs a step policy.',
              },
            ]}
          />
          <Box variant="small">
            Sources, accessed 2026-06-07:{' '}
            <Link external href="https://aws.amazon.com/blogs/machine-learning/amazon-sagemaker-inference-launches-faster-auto-scaling-for-generative-ai-models/">
              [Tier-2] AWS ML Blog: faster auto-scaling for generative AI models
            </Link>
            ,{' '}
            <Link external href="https://docs.aws.amazon.com/sagemaker/latest/dg/endpoint-auto-scaling-add-code-define.html">
              [Tier-1] SageMaker: define an auto-scaling policy
            </Link>
            .
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Beyond one endpoint: HyperPod &amp; JumpStart</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            Two SageMaker surfaces sit outside the single managed endpoint. <strong>SageMaker
            HyperPod</strong> inference is <strong>EKS-only</strong> (the Slurm flavor of HyperPod is
            training-only). vLLM is a first-class, officially documented container there: the docs show
            the <code>vllm/vllm-openai</code> image with <code>--tensor-parallel-size</code>, loading
            weights from S3, FSx, or the HF Hub. An <strong>Inference Operator</strong> manages the model
            download, the pods, an ALB, TLS, and metrics; both single- and multi-node are supported
            (multi-node requires EFA). HyperPod adds a managed <strong>tiered KV cache</strong> (L1 CPU,
            L2 Redis/managed) with cache-aware routing (prefix / KV / session / round-robin), and
            autoscaling via KEDA + Karpenter including <code>minReplicaCount: 0</code> scale-to-zero in
            the <code>InferenceEndpointConfig</code> CRD. AWS also runs <strong>llm-d</strong>{' '}
            disaggregated inference (prefill/decode split) on HyperPod (
            <Link external href="https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-model-deployment.html">
              [Tier-1] SageMaker HyperPod model deployment, accessed 2026-06-07
            </Link>
            ,{' '}
            <Link external href="https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-model-deployment-deploy-ftm.html">
              [Tier-1] HyperPod: deploy a foundation model, accessed 2026-06-07
            </Link>
            ,{' '}
            <Link external href="https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-model-deployment-autoscaling.html">
              [Tier-1] HyperPod inference autoscaling, accessed 2026-06-07
            </Link>
            ;{' '}
            <Link external href="https://aws.amazon.com/blogs/machine-learning/introducing-disaggregated-inference-on-aws-powered-by-llm-d/">
              [Tier-2] AWS ML Blog: disaggregated inference powered by llm-d, accessed 2026-06-07
            </Link>
            ).
          </Box>

          <Box variant="div">
            <Box variant="small" color="text-status-info">
              The SageMaker hosting surface for vLLM: real-time endpoint (Inference Components),
              HyperPod (EKS), and JumpStart as a one-click source onto LMI
            </Box>
            <SageMakerHostingSurfaceDiagram />
          </Box>

          <Box variant="p">
            <strong>JumpStart</strong> is the one-click / few-line front door: open-source models deploy
            with <code>JumpStartModel(model_id=...).deploy()</code>, and under the hood they run on the
            LMI container &mdash; which uses vLLM as its backend. A <code>JumpStartModel</code> CRD also
            deploys to HyperPod (via <code>modelHubName</code> <code>SageMakerPublicHub</code>) (
            <Link external href="https://aws.amazon.com/blogs/machine-learning/supercharge-your-llm-performance-with-amazon-sagemaker-large-model-inference-container-v15/">
              [Tier-2] AWS ML Blog: LMI v15 (JumpStart on LMI/vLLM), accessed 2026-06-07
            </Link>
            ;{' '}
            <Link external href="https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-hyperpod-model-deployment-autoscaling.html">
              [Tier-1] HyperPod inference autoscaling (JumpStartModel CRD), accessed 2026-06-07
            </Link>
            ).
          </Box>

          <Alert type="warning">
            <strong>[SPECULATIVE / UNKNOWN] Multi-node nuance.</strong> Standard SageMaker real-time
            endpoints (LMI) confirm <em>single-instance, multi-GPU</em> tensor parallelism. Genuine
            <em> cross-instance multi-node</em> vLLM is the HyperPod/EKS path. Whether a standard managed
            endpoint supports multi-node (cross-instance) vLLM was <strong>not confirmed in the
            docs</strong> at access time &mdash; treat multi-node-on-standard-endpoint as unverified and
            default to HyperPod/EKS for it.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Where vLLM should live: SageMaker vs EKS vs EC2</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Observability first, because it is the most common surprise.</strong> A SageMaker
            endpoint emits CloudWatch infrastructure and invocation metrics &mdash;{' '}
            <code>GPUUtilization</code>, <code>ModelLatency</code> (p50/p90/p99),{' '}
            <code>Invocation4XX</code>/<code>5XX</code>, <code>ConcurrentRequestsPerModel</code>, and
            streaming-specific <code>FirstChunkLatency</code> / <code>MidStreamErrors</code> &mdash; plus
            enhanced per-GPU / per-container metrics (March 2026), and it forwards the container&apos;s
            stdout/stderr (so vLLM&apos;s logs) to CloudWatch Logs (
            <Link external href="https://docs.aws.amazon.com/sagemaker/latest/dg/monitoring-cloudwatch.html">
              [Tier-1] SageMaker CloudWatch metrics, accessed 2026-06-07
            </Link>
            ;{' '}
            <Link external href="https://aws.amazon.com/blogs/machine-learning/enhanced-metrics-for-amazon-sagemaker-ai-endpoints-deeper-visibility-for-better-performance/">
              [Tier-2] AWS ML Blog: enhanced metrics for SageMaker endpoints, accessed 2026-06-07
            </Link>
            ).
          </Box>

          <Alert type="warning">
            <strong>The metrics gotcha.</strong> vLLM&apos;s own Prometheus <code>/metrics</code>{' '}
            &mdash; <code>vllm:num_requests_waiting</code>, the TTFT/TPOT histograms, the KV-cache hit
            rate &mdash; is <strong>not surfaced through a SageMaker endpoint</strong>. The container only
            exposes <code>/invocations</code> + <code>/ping</code> on 8080, so the rich vLLM-internal
            signals never leave the box by default. To get them you must bridge them out-of-band &mdash;
            for example, have the container <code>PutMetricData</code> to CloudWatch itself. That bridge
            is <strong>[SPECULATIVE]</strong> &mdash; it is a plausible pattern, not an AWS-official one (
            <Link external href="https://docs.vllm.ai/en/latest/design/metrics/">
              [Tier-1] vLLM Docs: metrics design, accessed 2026-06-07
            </Link>
            ).
          </Alert>

          <Table
            variant="embedded"
            header={<Header variant="h3">Placement: SageMaker managed endpoint vs EKS vs EC2</Header>}
            columnDefinitions={[
              { id: 'dim', header: 'Dimension', cell: (i) => i.dim },
              { id: 'sm', header: 'SageMaker', cell: (i) => i.sm },
              { id: 'eks', header: 'EKS', cell: (i) => i.eks },
              { id: 'ec2', header: 'EC2', cell: (i) => i.ec2 },
            ]}
            items={[
              { dim: 'Managed infra', sm: 'Yes', eks: 'Partial (you run K8s)', ec2: 'No' },
              { dim: 'Cost vs EC2', sm: '~15–40% premium [Tier-3, verify]', eks: 'Near EC2 + control plane', ec2: 'Baseline' },
              { dim: 'Spot for inference', sm: 'No (Spot = training only)', eks: 'Yes (+Karpenter, ~60–70% off)', ec2: 'Yes (DIY)' },
              { dim: 'A/B variants', sm: 'Native', eks: 'DIY', ec2: 'DIY' },
              { dim: 'Model Registry', sm: 'Native', eks: 'DIY', ec2: 'DIY' },
              { dim: 'vLLM Prometheus /metrics', sm: 'No (bridge out-of-band)', eks: 'Native', ec2: 'Native' },
              { dim: 'llm-d / disaggregation + Gateway API Inference Ext.', sm: 'No', eks: 'Yes (+HyperPod)', ec2: 'DIY' },
              { dim: 'Streaming', sm: 'Native SSE + bidi HTTP/2 (Nov 2025)', eks: 'DIY', ec2: 'DIY' },
              { dim: 'Latest vLLM version', sm: 'Lags (LMI cadence)', eks: 'Yes', ec2: 'Yes' },
              { dim: 'K8s expertise required', sm: 'No', eks: 'Yes', ec2: 'Some' },
            ]}
          />
          <Box variant="small">
            Sources, accessed 2026-06-07:{' '}
            <Link external href="https://docs.aws.amazon.com/sagemaker/latest/dg/hosting-faqs.html">
              [Tier-1] SageMaker hosting FAQs
            </Link>
            ,{' '}
            <Link external href="https://aws.amazon.com/blogs/machine-learning/introducing-disaggregated-inference-on-aws-powered-by-llm-d/">
              [Tier-2] AWS ML Blog: disaggregated inference (llm-d)
            </Link>
            ,{' '}
            <Link external href="https://aws.amazon.com/blogs/machine-learning/build-real-time-voice-applications-with-amazon-sagemaker-ai-and-vllm/">
              [Tier-2] AWS ML Blog: real-time voice with SageMaker AI + vLLM (streaming)
            </Link>
            . The <strong>cost premium figure is [Tier-3 / third-party] and time- and region-sensitive</strong>{' '}
            &mdash; verify against current pricing for your instances. For the EKS path in depth, see{' '}
            <strong>24. vLLM on Amazon EKS</strong>.
          </Box>

          <Box variant="div">
            <Box variant="h3">Useful AWS samples</Box>
            <Box variant="p">
              <Link external href="https://github.com/aws/model-hosting-container-standards">
                [Tier-1] aws/model-hosting-container-standards
              </Link>{' '}
              is the official vLLM-on-SageMaker quickstart &mdash; it carries the vLLM ECR Public image,
              the <code>SM_VLLM_*</code> env-var contract, and the <code>sagemaker-entrypoint.sh</code>{' '}
              that maps vLLM&apos;s 8000 to SageMaker&apos;s 8080. For load testing,{' '}
              <Link external href="https://github.com/aws-samples/load-test-llm-with-locust">
                [Tier-2] aws-samples/load-test-llm-with-locust
              </Link>{' '}
              ships a <code>sagemaker_vllm_loadtest.ipynb</code> (both accessed 2026-06-07).
            </Box>
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">The bigger decision: self-host vLLM vs Amazon Bedrock</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>Before you pick a SageMaker path, decide whether you should be operating an
            inference server at all.</strong> For a startup, the default answer is often &quot;no, call
            Bedrock&quot; &mdash; and then the SageMaker paths above become irrelevant until a concrete
            constraint forces you off the managed API. The honest version of this decision is a small
            number of <em>needs</em> that, when present, justify the operational weight of self-hosting.
            Absent all of them, Bedrock is the lower-total-cost choice for most early-stage teams.
          </Box>

          <Alert type="warning">
            <strong>[SPECULATIVE — synthesized]</strong> Everything in this decision section is the
            author&apos;s synthesis of AWS&apos;s public positioning of Bedrock and self-hosted vLLM. It
            is <em>not</em> a single AWS decision document. Use it as a starting map and validate the
            specifics &mdash; especially model availability and instance pricing &mdash; against
            first-party sources for your region and your model.
          </Alert>

          <Box variant="div">
            <Box variant="small" color="text-status-info">
              Decision tree: managed Bedrock vs self-hosted vLLM (SPECULATIVE — synthesized guidance)
            </Box>
            <BedrockVsSelfHostDiagram />
          </Box>

          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">Amazon Bedrock — the default for startups</Box>
              <Box variant="p">
                <strong>[Tier-1, AWS]</strong> Bedrock is a fully managed service that exposes
                foundation models through a single API &mdash; no servers, no GPUs to provision, no vLLM
                to operate, pay-per-token by default. For an early-stage team, that is the lowest
                operational burden and the fastest path to a working product. It is also{' '}
                <em>itself</em> powered by purpose-built AWS infrastructure, including AWS Trainium for
                the Amazon-built models &mdash; you get accelerator-grade serving without ever touching
                an accelerator. The trade you make is control: you serve the models AWS offers, on the
                tuning AWS chose, behind the API AWS exposes.
              </Box>
            </div>
            <div>
              <Box variant="h3">Self-hosted vLLM (EKS / EC2 / SageMaker) — when a need forces it</Box>
              <Box variant="p">
                <strong>[SPECULATIVE — synthesized]</strong> You take on operating the inference server
                &mdash; capacity, autoscaling, upgrades, on-call &mdash; in exchange for control. The
                justifying needs are concrete: <strong>custom or fine-tuned weights</strong> Bedrock
                does not host; <strong>instance-level hardware control</strong> to drive down cost at
                high, steady volume; <strong>specific vLLM features</strong> (a multi-LoRA fleet,
                prefill/decode disaggregation, custom batching/scheduling) the managed API does not
                surface; or <strong>VPC / data-residency isolation</strong> stricter than what a managed
                API boundary gives. If none of these is a hard requirement, self-hosting is operational
                cost without a matching benefit.
              </Box>
            </div>
          </ColumnLayout>

          <Table
            variant="embedded"
            header={<Header variant="h3">Need → Bedrock vs self-host vLLM (SPECULATIVE — synthesized)</Header>}
            columnDefinitions={[
              { id: 'need', header: 'The need', cell: (i) => i.need },
              { id: 'choice', header: 'Lean toward', cell: (i) => <strong>{i.choice}</strong> },
              { id: 'why', header: 'Why', cell: (i) => i.why },
            ]}
            items={[
              {
                need: 'Ship fast, minimal ops, standard frontier/foundation models',
                choice: 'Bedrock',
                why: 'No server, no GPU provisioning, pay-per-token. Lowest operational burden; the startup default.',
              },
              {
                need: 'Custom or fine-tuned weights not offered on Bedrock',
                choice: 'Self-host vLLM',
                why: 'If the exact weights you need are not in the Bedrock catalog, a managed FM API cannot serve them. vLLM can load arbitrary Hugging Face / local weights.',
              },
              {
                need: 'Cost-at-volume with steady, predictable traffic',
                choice: 'Self-host vLLM',
                why: 'Per-token pricing is convenient but can exceed amortized instance cost at sustained high volume. Instance-level control (right-sizing, reservations, quantization, batching) lets you optimize the unit economics yourself.',
              },
              {
                need: 'A specific vLLM feature: multi-LoRA fleet, P/D disaggregation, custom batching',
                choice: 'Self-host vLLM',
                why: 'These are engine-level capabilities (see sections 13, 9, 6). A managed FM API does not expose them; running vLLM does. This is the single most common reason a startup outgrows Bedrock.',
              },
              {
                need: 'VPC / data-residency isolation beyond a managed API boundary',
                choice: 'Self-host vLLM',
                why: 'Self-hosting puts the model inside your VPC and your account boundary end-to-end, for compliance regimes that require it. (Bedrock also offers private connectivity; self-hosting is the maximal-isolation end of the spectrum.)',
              },
              {
                need: 'Spiky, unpredictable, or low-volume traffic',
                choice: 'Bedrock',
                why: 'Pay-per-token means you pay nothing when idle. A self-hosted endpoint pays for the instance whether or not requests arrive — bad economics for bursty or low traffic.',
              },
            ]}
          />
          <Box variant="small">
            This table is <strong>[SPECULATIVE]</strong> synthesis of AWS positioning, not a single AWS
            decision doc. Validate model availability and pricing against{' '}
            <Link external href="https://aws.amazon.com/bedrock/">
              the Amazon Bedrock product page
            </Link>{' '}
            (Tier-1, accessed 2026-06-07) for your region and model.
          </Box>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">It is not purely &quot;managed vs DIY&quot;: Amazon contributes to vLLM upstream</Header>}>
        <SpaceBetween size="m">
          <Box variant="p">
            A common misframing is that Bedrock/SageMaker are Amazon&apos;s &quot;proprietary&quot;
            stack sitting opposite the &quot;open&quot; vLLM you self-host. That is not how it works.{' '}
            <strong>Amazon contributes optimizations directly upstream into vLLM</strong> &mdash; so the
            open engine you run yourself <em>and</em> the engine inside AWS&apos;s managed services share
            the same improvements. The managed services then layer Amazon-specific tuning on top. Two
            concrete, first-party-blogged examples:
          </Box>

          <ColumnLayout columns={2} variant="text-grid">
            <div>
              <Box variant="h3">fused_moe_lora — multi-LoRA on MoE models</Box>
              <Box variant="p">
                <strong>[Tier-2, AWS blog]</strong> Amazon created a{' '}
                <code>fused_moe_lora</code> kernel that &quot;integrates LoRA operations into&quot; the
                existing Mixture-of-Experts kernel, handling expert routing and adapter selection
                together &mdash; enabling efficient multi-LoRA serving where &quot;multiple custom
                models share the same GPU, with only the adapters swapped in and out per request.&quot;
                The blog reports, for GPT-OSS 20B,{' '}
                <strong>&quot;454% OTPS [output tokens per second] improvements and 87% lower TTFT [time
                to first token]&quot;</strong> across the optimization arc, and that AWS-specific tuning
                on top of upstream delivered <strong>&quot;19% higher Output Tokens Per Second&quot;</strong>{' '}
                and <strong>&quot;8% lower Time To First Token&quot;</strong> versus vLLM 0.15.0 (
                <Link
                  external
                  href="https://aws.amazon.com/blogs/machine-learning/efficiently-serve-dozens-of-fine-tuned-models-with-vllm-on-amazon-sagemaker-ai-and-amazon-bedrock/"
                >
                  AWS ML Blog: Efficiently serve dozens of fine-tuned models with vLLM, accessed
                  2026-06-07
                </Link>
                ).
              </Box>
            </div>
            <div>
              <Box variant="h3">P-EAGLE — parallel speculative decoding</Box>
              <Box variant="p">
                <strong>[Tier-2, AWS blog]</strong> Amazon contributed <strong>P-EAGLE</strong>, which
                turns EAGLE speculative decoding from autoregressive to parallel &mdash; generating
                &quot;all K draft tokens in a single forward pass&quot; &mdash; integrated into vLLM
                from version 0.16.0 and enabled with one config line,{' '}
                <code>{'"parallel_drafting": true'}</code>. On NVIDIA B200 the blog reports{' '}
                <strong>&quot;up to 1.69&times; speedup&quot;</strong> over vanilla EAGLE-3 at
                concurrency 1, with gains tapering at higher concurrency (
                <Link
                  external
                  href="https://aws.amazon.com/blogs/machine-learning/p-eagle-faster-llm-inference-with-parallel-speculative-decoding-in-vllm/"
                >
                  AWS ML Blog: P-EAGLE &mdash; Faster LLM inference with Parallel Speculative Decoding in
                  vLLM, accessed 2026-06-07
                </Link>
                ).
              </Box>
            </div>
          </ColumnLayout>

          <Alert type="warning">
            <strong>Tier discipline on the numbers:</strong> every percentage and multiplier above is{' '}
            <strong>[Tier-2 / blog-claimed]</strong> by AWS, measured on AWS-chosen hardware (NVIDIA
            B200) and models (GPT-OSS 20B/120B, Qwen3-Coder 30B). They are AWS&apos;s benchmarks, not
            independently reproduced here. Do not launder them into &quot;vLLM is 454% faster&quot;
            &mdash; they are deltas across specific optimization versions on specific configurations.
            Treat them as directional evidence that Amazon&apos;s upstream work is real and material,
            not as portable performance guarantees for your workload.
          </Alert>

          <ExpandableSection headerText="Why this matters for the self-host vs managed decision">
            <SpaceBetween size="s">
              <Box variant="p">
                The upstream-contribution pattern collapses part of the &quot;open vs managed&quot;
                tension. If you self-host vLLM at a recent enough version, you inherit Amazon&apos;s{' '}
                <code>fused_moe_lora</code> and P-EAGLE work directly &mdash; they are in the open engine.
                If you use SageMaker (Path A/B) or Bedrock, you get those same contributions{' '}
                <em>plus</em> Amazon&apos;s additional service-side tuning (the &quot;19% higher OTPS&quot;
                delta is exactly that extra layer). So the decision is not &quot;fast managed vs slow
                open&quot; &mdash; the open engine is genuinely fast and Amazon helps make it so. The
                decision is the one in the table above: <strong>do you have a concrete need (weights,
                cost-at-volume, a specific feature, isolation) that justifies operating the server
                yourself</strong>, given that the managed path gives you the same engine plus extra tuning
                for less operational weight?
              </Box>
              <Box variant="p">
                Put plainly: choose self-hosted vLLM for <em>control and specificity</em>, not because
                you assume managed services are running an inferior engine. They are not &mdash; they are
                often running <em>your</em> engine, improved.
              </Box>
            </SpaceBetween>
          </ExpandableSection>
        </SpaceBetween>
      </Container>

      <Container header={<Header variant="h2">Where this leaves you</Header>}>
        <SpaceBetween size="s">
          <Box variant="p">
            <strong>Two nested decisions, in order.</strong> First, the prior question: should you
            operate an inference server at all? For most startups the answer starts at{' '}
            <strong>Bedrock</strong> (lowest ops, managed FM API, itself on purpose-built AWS infra
            including Trainium) and only moves to self-hosted vLLM when a concrete need &mdash; custom
            weights, cost-at-volume, a specific vLLM feature, or VPC/data-residency isolation &mdash;
            forces the move. Second, only once you have decided to self-host on SageMaker: pick the
            hosting path by how much of the container you want to own &mdash;{' '}
            <strong>(A) LMI / DJL-Serving</strong> with <code>OPTION_ROLLING_BATCH=vllm</code> for the
            least ownership, <strong>(B) the AWS vLLM DLC</strong> for vLLM&apos;s native surface with
            AWS maintaining the image, or <strong>(C) BYOC</strong> when you need full control.
          </Box>
          <Alert type="info">
            <strong>Cross-links.</strong> For the cases where you should not run vLLM <em>at all</em>{' '}
            &mdash; including many of the &quot;just call Bedrock&quot; situations &mdash; see{' '}
            <strong>26. When Not vLLM</strong>. For the consolidated end-to-end chooser that folds this
            Bedrock-vs-self-host decision into the broader engine-and-platform selection, see{' '}
            <strong>28. Decision Guide</strong>.
          </Alert>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
