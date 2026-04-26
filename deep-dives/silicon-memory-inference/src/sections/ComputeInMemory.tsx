import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Alert from '@cloudscape-design/components/alert';
import Link from '@cloudscape-design/components/link';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import { CimDiagram } from '../components/CimDiagram';

export function ComputeInMemory() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header
            variant="h1"
            description="Move arithmetic into the memory array — eliminate the dominant cost of inference"
          >
            Compute-in-Memory — PIM and HyperCIM
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            <strong>The thesis.</strong> Most of the energy spent in modern AI
            inference is not spent doing arithmetic — it is spent moving bytes
            from memory to compute and back. If the bandwidth wall (Section 6)
            is real, and if every previous architectural fix has been some
            flavor of &ldquo;move bytes faster,&rdquo; then there is one
            structural alternative left: do not move the bytes. Place the
            arithmetic units inside the memory array, perform the operation
            where the data already lives, and ship only the result.
          </Box>
          <Box variant="p">
            <strong>The two production directions.</strong> Samsung HBM-PIM
            embeds compute units inside DRAM banks of HBM2 / HBM3 stacks —
            existing memory technology with arithmetic added. HyperCIM-class
            architectures take the more radical route: memory arrays designed
            from the start to do compute in place, exposed as accelerators
            for specific workload classes. The two directions answer
            different questions about how aggressive the architecture should
            be vs how compatible with existing software.
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Conventional von Neumann path versus compute-in-memory path"
          >
            What the architecture changes
          </Header>
        }
      >
        <SpaceBetween size="m">
          <CimDiagram />
          <Box variant="p">
            In the conventional path, every operation requires moving operand
            bytes across the bus to the compute unit, performing the
            arithmetic, and moving the result back. The energy cost per
            operation is dominated by the move, not by the arithmetic.
            Compute-in-memory eliminates the move: the operation happens at
            the memory cells themselves, so only the result crosses the bus
            (if it crosses at all).
          </Box>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Samsung's commercial PIM line"
          >
            Samsung HBM-PIM (Aquabolt-XL)
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            Samsung HBM-PIM places compute units inside DRAM banks of HBM2 / HBM3
            stacks. The interface remains HBM-compatible — host accelerators
            see standard HBM addresses but can issue PIM-specific commands
            that execute arithmetic at the bank level rather than reading the
            data out. Published gains target generic primitives that map
            naturally to in-bank compute: GEMV (matrix-vector multiply) at
            8.9× speedup, speech recognition at 3.5×, LSTM inference at 2.54×
            ({' '}
            <Link
              external
              href="https://semiconductor.samsung.com/news-events/tech-blog/"
            >
              Samsung Semiconductor Tech Blog
            </Link>
            , accessed 2026-04-23).
          </Box>
          <Alert type="warning" header="No published MoE benchmark">
            The published gains all target GEMV-class kernels. Samsung has
            not published an HBM-PIM benchmark on transformer attention or
            MoE routing. Any &ldquo;HBM-PIM is good for MoE&rdquo; claim is
            speculative based on the operator structure rather than
            measurement; the matmul-class operators that dominate transformer
            decode would in principle benefit from in-bank compute, but the
            measured number is not yet in the public record. Treat as
            promising direction, not as deployed solution.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="HyperCIM and the broader CIM landscape"
          >
            HyperCIM
          </Header>
        }
      >
        <SpaceBetween size="m">
          <Box variant="p">
            HyperCIM is one of the companies bringing CIM-class silicon to
            market. The publicly documented HyperCIM product is an LPU
            (Language Processing Unit) marketed as a multi-database /
            data-fabric accelerator rather than directly as an LLM-inference
            accelerator. The architectural framing — compute placed inside
            the memory substrate — is consistent with the broader CIM thesis,
            but the public positioning is data-management workloads, not
            transformer decode
            ({' '}
            <Link external href="https://hypercim.com/">
              HyperCIM
            </Link>
            , accessed 2026-04-24).
          </Box>
          <Alert type="warning" header="What the public record does and does not show">
            HyperCIM-as-MoE-inference-accelerator is not a claim the public
            materials make — they present HyperCIM as a data-fabric /
            multi-database LPU. The MoE framing for compute-in-memory
            generalizes from the energy argument (eliminate data movement →
            win on sparse activation), but a specific HyperCIM-runs-MoE
            benchmark is not in the public record we could verify. The
            structural argument is interesting; the production benchmark is
            not yet there.
          </Alert>
        </SpaceBetween>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="The argument and the trade-offs"
          >
            The CIM bet, evaluated
          </Header>
        }
      >
        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <Box variant="h3">What the bet wins</Box>
            <ul>
              <li>Energy per operation drops dramatically — most of the cost was the move, and the move is gone</li>
              <li>For matmul-class operators, the in-bank parallelism is enormous — every bank is a compute unit</li>
              <li>For sparse activation patterns (MoE), only the active expert needs to fire, reducing wasted reads</li>
              <li>Bandwidth wall stops binding — the operation never crosses the wall</li>
            </ul>
          </div>
          <div>
            <Box variant="h3">What the bet costs</Box>
            <ul>
              <li>Constrained operator set — only what the in-array compute supports</li>
              <li>Precision constraints — analog CIM introduces noise, digital CIM costs area</li>
              <li>Programming model — every workload needs to map onto in-array primitives</li>
              <li>Software ecosystem — frameworks (PyTorch, JAX) do not yet target CIM natively at scale</li>
              <li>Operator fallback to host — when something is not supported, the cost can be catastrophic for the model</li>
            </ul>
          </div>
        </ColumnLayout>
      </Container>

      <Container
        header={
          <Header
            variant="h2"
            description="Where CIM fits in the 2026-2027 architecture conversation"
          >
            CIM in the 2026 portfolio
          </Header>
        }
      >
        <Box variant="p">
          CIM is not a deployed-at-scale answer to the bandwidth wall today.
          Samsung HBM-PIM has shipped commercial parts with measured GEMV
          gains. HyperCIM is in market with a specific (data-fabric)
          positioning. Various academic CIM proposals have produced ISCA and
          MICRO papers. None of these have displaced HBM-attached GPU /
          accelerator architectures from production inference fleets in 2026.
        </Box>
        <Box variant="p">
          The right framing is to engage the energy argument as structurally
          correct — data movement <em>is</em> the dominant cost at scale —
          while being honest about the deployment timeline and the
          operator-set constraints. AWS&apos;s position is portfolio-based:
          when CIM-class silicon is production-ready for a workload, AWS will
          be where it lands; until then, GPU and Trainium silicon serve the
          same role with different physics.
        </Box>
        <ExpandableSection headerText="Why CIM and MoE pair well in theory">
          <Box variant="p">
            MoE workloads are sparse: only k of N experts fire per token, and
            the activation pattern is not predictable until the router fires.
            In a conventional architecture this means HBM has to be sized to
            hold all N experts even though only k are active. In a CIM
            architecture each expert lives in its own memory region, and
            firing only k of N is the natural operation rather than an
            optimization to chase. The energy-per-token win compounds: lower
            arithmetic intensity (Section 22) plus lower energy per byte
            moved. Whether this translates into a deployable MoE-on-CIM
            system is open; the structural argument is the strongest version
            of the CIM case.
          </Box>
        </ExpandableSection>
      </Container>
    </SpaceBetween>
  );
}
