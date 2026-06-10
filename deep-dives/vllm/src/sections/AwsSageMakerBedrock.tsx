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

export function AwsSageMakerBedrock() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Three ways to run vLLM under SageMaker — and the harder question of whether a startup should self-host vLLM at all when Amazon Bedrock exists."
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
            paths are exactly the menu you want.
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
