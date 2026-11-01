import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Cite,
  arxiv,
  gh,
  ghTree,
  researchUrl,
  E1_URL,
  E4_URL,
  PYTORCH_TAG,
  DIVE_REPO_SHA,
  ACCESSED,
} from '../components/Cite';

describe('arxiv', () => {
  it('keeps the version in the abstract URL', () => {
    expect(arxiv('2407.21783v3')).toBe('https://arxiv.org/abs/2407.21783v3');
  });
});

describe('gh and ghTree', () => {
  it('pin files to the given tag, never a branch', () => {
    const url = gh('pytorch/pytorch', PYTORCH_TAG, '/torch/distributed/checkpoint/state_dict_saver.py', 'L300-L321');
    expect(url).toBe(
      `https://github.com/pytorch/pytorch/blob/${PYTORCH_TAG}/torch/distributed/checkpoint/state_dict_saver.py#L300-L321`,
    );
    expect(url).not.toMatch(/\/(blob|tree)\/(main|master)\//);
  });

  it('omits the fragment when no line range is given', () => {
    expect(gh('pytorch/torchtitan', 'v0.4.0', 'README.md')).not.toContain('#');
  });

  it('pins directories, and the repository root when no directory is given', () => {
    expect(ghTree('NVIDIA/Megatron-LM', 'core_v0.20.0', '/megatron/core')).toBe(
      'https://github.com/NVIDIA/Megatron-LM/tree/core_v0.20.0/megatron/core',
    );
    expect(ghTree('NVIDIA/Megatron-LM', 'core_v0.20.0')).toBe('https://github.com/NVIDIA/Megatron-LM/tree/core_v0.20.0');
  });
});

describe('Tier 0 links', () => {
  it('point at a 40-character commit of this repository', () => {
    expect(DIVE_REPO_SHA).toMatch(/^[0-9a-f]{40}$/);
    expect(researchUrl('2026-10/E1-spark-activation-memory.md')).toBe(E1_URL);
    expect(E4_URL).toBe(
      `https://github.com/cmanaha/tech-deep-dives/blob/${DIVE_REPO_SHA}/deep-dives/llm-training-systems/research/2026-10/E4-spark-checkpoint-staging.md`,
    );
  });
});

describe('Cite', () => {
  it('shows the tier, the venue, the link and the accessed date', () => {
    render(
      <Cite tier={3} href={arxiv('2407.21783v3')} venue="preprint">
        Llama 3 Herd of Models, Table 5
      </Cite>,
    );
    expect(screen.getByText('Tier 3')).toBeTruthy();
    expect(screen.getByText('preprint')).toBeTruthy();
    const link = screen.getByRole('link', { name: /Llama 3 Herd of Models, Table 5/ });
    expect(link.getAttribute('href')).toBe('https://arxiv.org/abs/2407.21783v3');
    expect(screen.getByText(`(accessed ${ACCESSED})`)).toBeTruthy();
  });

  it('labels Tier 0 as our own run and marks vendor claims', () => {
    render(
      <>
        <Cite tier={0} href={E1_URL}>
          E1 log
        </Cite>
        <Cite tier={1} href="https://www.nvidia.com/en-us/data-center/h100/" kind="vendor-claim">
          NVIDIA H100 specification
        </Cite>
      </>,
    );
    expect(screen.getByText('Tier 0: our run')).toBeTruthy();
    expect(screen.getByText('vendor claim')).toBeTruthy();
  });

  it('accepts an explicit accessed date', () => {
    render(
      <Cite tier={1} href="https://docs.aws.amazon.com/sagemaker/" accessed="2026-10-30">
        SageMaker docs
      </Cite>,
    );
    expect(screen.getByText('(accessed 2026-10-30)')).toBeTruthy();
  });
});
