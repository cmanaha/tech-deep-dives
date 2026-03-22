import React from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import Alert from '@cloudscape-design/components/alert';
import ColumnLayout from '@cloudscape-design/components/column-layout';

export function EKSIntegration() {
  return (
    <SpaceBetween size="l">
      <Container
        header={
          <Header variant="h1" description="Running EFA workloads on Amazon EKS">
            EKS & Container Integration
          </Header>
        }
      >
        <Box variant="p">
          Running EFA workloads in Kubernetes requires the <strong>EFA Device Plugin</strong> for
          EKS. This plugin exposes EFA interfaces as extended resources that pods can request,
          similar to how the NVIDIA device plugin exposes GPUs.
        </Box>
      </Container>

      <Container header={<Header variant="h2">Setup Requirements</Header>}>
        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <Box variant="h3">Node Configuration</Box>
            <ul>
              <li>EFA-enabled instance type in the node group</li>
              <li>EFA interfaces enabled at instance launch</li>
              <li>Cluster placement group for the node group</li>
              <li>Security group allowing all traffic within the placement group</li>
              <li>EFA kernel driver installed (Amazon Linux 2/2023 includes it)</li>
            </ul>
          </div>
          <div>
            <Box variant="h3">Kubernetes Components</Box>
            <ul>
              <li><code>aws-efa-k8s-device-plugin</code> DaemonSet</li>
              <li>Pod requests: <code>vpc.amazonaws.com/efa: N</code></li>
              <li><code>hostNetwork: true</code> or Multus CNI for advanced setups</li>
              <li>NCCL/MPI libraries in container image</li>
              <li>Correct <code>NCCL_TOPO_FILE</code> mounted</li>
            </ul>
          </div>
        </ColumnLayout>
      </Container>

      <Container header={<Header variant="h2">Pod Spec Example</Header>}>
        <ExpandableSection headerText="PyTorch training job with EFA on EKS">
          <Box variant="code">
{`apiVersion: v1
kind: Pod
metadata:
  name: efa-training-worker
spec:
  hostNetwork: true        # Required for EFA
  dnsPolicy: ClusterFirstWithHostNet
  containers:
  - name: training
    image: your-training-image:latest
    resources:
      requests:
        nvidia.com/gpu: 8
        vpc.amazonaws.com/efa: 4    # Request 4 EFA interfaces
      limits:
        nvidia.com/gpu: 8
        vpc.amazonaws.com/efa: 4
    env:
    - name: FI_PROVIDER
      value: "efa"
    - name: FI_EFA_USE_DEVICE_RDMA
      value: "1"
    - name: NCCL_DEBUG
      value: "INFO"
    volumeMounts:
    - name: dshm
      mountPath: /dev/shm
  volumes:
  - name: dshm
    emptyDir:
      medium: Memory
      sizeLimit: "64Gi"     # Shared memory for NCCL`}
          </Box>
        </ExpandableSection>
      </Container>

      <Alert type="warning">
        <strong>hostNetwork requirement:</strong> EFA pods typically need <code>hostNetwork: true</code>,
        which means the pod uses the host&apos;s network namespace. This has security
        implications — pods can see all host network traffic. For production, consider
        network policies and RBAC to limit access. The Multus CNI can provide more
        granular control by attaching EFA interfaces as secondary networks.
      </Alert>

      <Container header={<Header variant="h2">Training Operators</Header>}>
        <ColumnLayout columns={2} variant="text-grid">
          <div>
            <Box variant="h3">Kubeflow Training Operator</Box>
            <Box variant="p">
              The <code>PyTorchJob</code> CRD supports EFA natively. Configure the worker
              template with EFA resources and the operator handles distributed training
              coordination (rank assignment, service discovery).
            </Box>
          </div>
          <div>
            <Box variant="h3">AWS Batch with EKS</Box>
            <Box variant="p">
              AWS Batch can orchestrate multi-node parallel jobs on EKS with EFA.
              Batch handles placement group allocation and job scheduling.
              Good for burst HPC workloads that don&apos;t need a persistent cluster.
            </Box>
          </div>
        </ColumnLayout>
      </Container>
    </SpaceBetween>
  );
}
