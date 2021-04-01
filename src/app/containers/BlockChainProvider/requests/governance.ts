import { ContractName } from './../types';
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
    'governorAdmin',
    'propose',
    [targets, values, signatures, calldatas, description, { from: account }],
    {
      type: 'propose',
    },
  );
}

export function governance_queue(governor: ContractName, proposalId: number) {
  return network.send(governor, 'queue', [proposalId]);
}

export function governance_cancel(proposalId: number) {}

export function governance_execute(governor: ContractName, proposalId: number) {
  return network.send(governor, 'execute', [proposalId]);
}

export function governance_proposalThreshold() {
  return network.call('governorAdmin', 'proposalThreshold', []);
}

export function governance_quorumVotes() {
  return network.call('governorAdmin', 'quorumVotes', []);
}

export function governance_proposalCount() {
  return network
    .call('governorAdmin', 'proposalCount', [])
    .then(result => Number(result));
}
