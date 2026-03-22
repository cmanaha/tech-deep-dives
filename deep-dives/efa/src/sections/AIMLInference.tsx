import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Alert from '@cloudscape-design/components/alert';
import StatusIndicator from '@cloudscape-design/components/status-indicator';

export function AIMLInference() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header variant="h1" description="When does EFA matter for inference, and when doesn't it?">
            EFA for AI/ML Inference
          </Header>
        }
      >
        <Alert type="info">
          <strong>Key insight:</strong> EFA matters for inference ONLY when the model doesn&apos;t
          fit on a single instance&apos;s GPUs. If your model fits on one node, EFA provides
          zero benefit for inference.
        </Alert>
      </Container>

      <Container header={<Header variant="h2">When EFA Matters for Inference</Header>}>
        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <Box variant="h3">Multi-Node Tensor Parallelism</Box>
            <Box variant="p">
              Models too large for a single instance (e.g., 405B parameters at fp16 = ~810GB,
              exceeding even P5&apos;s 640GB total GPU memory). Tensor parallelism across
              nodes requires EFA for acceptable latency.
            </Box>
            <Box variant="p">
              Every token generation step requires communication between all TP ranks.
              For autoregressive generation, this happens <strong>per token</strong>.
              Even 1ms of extra network latency × 1000 tokens = 1 second added to response time.
            </Box>
            <StatusIndicator type="success">EFA critical</StatusIndicator>
          </div>
          <div>
            <Box variant="h3">Pipeline Parallelism for Throughput</Box>
            <Box variant="p">
              Splitting model layers across nodes for serving. Less latency-sensitive than TP
              (communication is between pipeline stages, not within every layer).
              But high bandwidth still matters for activation transfer.
            </Box>
            <StatusIndicator type="info">EFA beneficial</StatusIndicator>
          </div>
          <div>
            <Box variant="h3">NIXL (NVIDIA Inference Xfer Library)</Box>
            <Box variant="p">
              New in 2025 — purpose-built for multi-node inference transfer patterns including
              KV-cache migration, disaggregated prefill/decode, and speculative decoding across
              nodes. NIXL uses libfabric over EFA and is designed for the bursty, latency-sensitive
              transfer patterns that inference generates (unlike training&apos;s steady-state
              collectives). Requires libfabric 1.21.0+.
            </Box>
            <StatusIndicator type="success">EFA critical for NIXL</StatusIndicator>
          </div>
        </ColumnLayout>
      </Container>

      <Container header={<Header variant="h2">When EFA Does NOT Matter for Inference</Header>}>
        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <Box variant="h3">Single-Node Inference</Box>
            <Box variant="p">
              Most inference workloads. If your model fits on one P5 (8x H100, 640GB),
              all GPU-to-GPU communication uses NVLink/NVSwitch within the instance.
              EFA is not involved.
            </Box>
            <Box variant="p">
              Models up to ~300B parameters at fp16, or ~600B at fp8/int8, fit on a single P5.
              With quantization, even larger models fit.
            </Box>
            <StatusIndicator type="stopped">EFA irrelevant</StatusIndicator>
          </div>
          <div>
            <Box variant="h3">Batch Inference / Offline</Box>
            <Box variant="p">
              If latency isn&apos;t critical (batch processing, embedding generation),
              even multi-node inference can tolerate standard networking. The throughput
              improvement from EFA may not justify the placement group constraint.
            </Box>
            <StatusIndicator type="stopped">EFA optional</StatusIndicator>
          </div>
        </ColumnLayout>
      </Container>

      <Container header={<Header variant="h2">Inference Architecture Decision Tree</Header>}>
        <SpaceBetween size="m">
          <Box variant="p" fontSize="heading-s">
            <strong>Does the model fit on one instance?</strong>
          </Box>
          <Box variant="p" padding={{ left: 'l' }}>
            → <strong>Yes:</strong> No EFA needed. Use NVLink intra-node. Focus on batching
            and request routing.
          </Box>
          <Box variant="p" padding={{ left: 'l' }}>
            → <strong>No:</strong> You need multi-node. Next question:
          </Box>
          <Box variant="p" fontSize="heading-s" padding={{ left: 'l' }}>
            <strong>Is it latency-sensitive (real-time serving)?</strong>
          </Box>
          <Box variant="p" padding={{ left: 'xl' }}>
            → <strong>Yes:</strong> EFA required. Use cluster placement group. Tensor
            parallelism across nodes with EFA.
          </Box>
          <Box variant="p" padding={{ left: 'xl' }}>
            → <strong>No:</strong> EFA nice-to-have. Pipeline parallelism may work with
            standard networking. Evaluate cost vs. performance.
          </Box>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
