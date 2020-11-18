import { network } from '../network';

export function governance_propose(
  targets: string[],
  values: string[],
  signatures: string[],
  calldatas: string[],
  description: string,
  account,
) {
  return network.send(
    'governorAlpha',
    'propose',
    [targets, values, signatures, calldatas, description, { from: account }],
    {
      type: 'propose',
    },
  );
}

export function governance_queue(proposalId: number) {}

export function governance_cancel(proposalId: number) {}

export function governance_execute(proposalId: number) {}

export function governance_proposalThreshold() {
  return network.call('governorAlpha', 'proposalThreshold', []);
}

export function governance_quorumVotes() {
  return network.call('governorAlpha', 'quorumVotes', []);
}
