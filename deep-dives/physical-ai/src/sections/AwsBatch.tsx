import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import { ClusterFigure } from '../components/Cluster';
import type { ClusterSpec, JobToken } from '../components/Cluster';

const ids = ['1', '2', '3', '4', '5', '6'];
const inQueue = (from: number): JobToken[] => ids.slice(from).map((id, k) => ({ id, label: id, at: { q: 0, pos: k } }));

const SPEC: ClusterSpec = {
  title: 'An AWS Batch cluster running an array job on Spot GPU instances',
  desc: 'Jobs enter a job queue, the scheduler asks compute environments for instances, jobs run on GPUs.',
  submit: { label: 'SubmitJob, array of 6', sub: 'one child per evaluation seed' },
  queues: [{ label: 'Job queue: eval', sub: 'children wait here as RUNNABLE' }],
  scheduler: { label: 'Batch scheduler', sub: 'matches jobs to compute environments' },
  done: { label: 'SUCCEEDED' },
  groups: [
    { label: 'Compute environment 1', sub: ['g6e, g6 and g5 families, 0 to 64 vCPUs', 'SPOT_PRICE_CAPACITY_OPTIMIZED'], market: 'spot', gpus: 1, places: 4, type: 'g6e.xlarge' },
    { label: 'Compute environment 2', sub: ['same families, used when 1 cannot fill'], market: 'on-demand', gpus: 1, places: 2, type: 'g6e.xlarge' },
  ],
  stores: [
    { label: 'Amazon S3', sub: 'checkpoints, results' },
    { label: 'Container registry', sub: 'the job image' },
  ],
  network: 'One VPC: subnets in several Availability Zones',
  jobNoun: 'one child job',
  steps: [
    { caption: 'Nothing is running.', scheduler: ['queue empty', 'no instances'], instances: {}, jobs: ids.map((id, k) => ({ id, label: id, at: { submit: k } })) },
    { caption: 'Six children arrive.', scheduler: ['6 RUNNABLE', 'asks for 4 GPUs'], instances: { '0.0': 'launching', '0.1': 'launching', '0.2': 'launching', '0.3': { state: 'launching', type: 'g6.xlarge' } }, jobs: inQueue(0) },
    {
      caption: 'Instances join; four children start.',
      scheduler: ['4 RUNNING, 2 RUNNABLE'],
      instances: { '0.0': 'running', '0.1': 'running', '0.2': 'running', '0.3': { state: 'running', type: 'g6.xlarge' } },
      jobs: [...ids.slice(0, 4).map((id, k) => ({ id, label: id, at: { g: 0, i: k }, tone: 'running' as const })), ...inQueue(4)],
    },
    {
      caption: 'Spot notice on one instance. The child writes a checkpoint.',
      scheduler: ['instance 2 draining'],
      instances: { '0.0': 'running', '0.1': 'notice', '0.2': 'running', '0.3': { state: 'running', type: 'g6.xlarge' } },
      jobs: [...ids.slice(0, 4).map((id, k) => ({ id, label: id, at: { g: 0, i: k }, tone: 'running' as const })), ...inQueue(4)],
      checkpoints: [{ id: 'c2', at: { g: 0, i: 1 } }],
    },
    {
      caption: 'The child goes back to the queue; the checkpoint is in S3.',
      scheduler: ['retry 2 of 3', 'asks On-Demand'],
      instances: { '0.0': 'running', '0.2': 'running', '0.3': { state: 'running', type: 'g6.xlarge' }, '1.0': 'launching' },
      jobs: [
        { id: '1', label: '1', at: { g: 0, i: 0 }, tone: 'running' },
        { id: '2', label: '2', at: { q: 0, pos: 2 }, tone: 'requeued' },
        { id: '3', label: '3', at: { g: 0, i: 2 }, tone: 'running' },
        { id: '4', label: '4', at: { g: 0, i: 3 }, tone: 'running' },
        ...inQueue(4),
      ],
      checkpoints: [{ id: 'c2', at: { store: 0, pos: 0 } }],
    },
    {
      caption: 'All done; scale to zero.',
      scheduler: ['queue empty', 'scaling to 0 vCPUs'],
      instances: {},
      jobs: ids.map((id, k) => ({ id, label: id, at: { done: k }, tone: 'done' as const })),
      checkpoints: [{ id: 'c2', at: { store: 0, pos: 0 } }],
    },
  ],
};

export function AwsBatch() {
  return (
    <Container header={<Header variant="h1">25. AWS Batch</Header>}>
      <div data-stub="true">
        <Box variant="p">This section is being written.</Box>
      </div>
      <ClusterFigure spec={SPEC} name="a Batch array job on Spot" cites="" caption="Draft." />
    </Container>
  );
}
