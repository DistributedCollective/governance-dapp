import { ContractName } from './../types';
import { network } from '../network';

export function governance_propose(
  targets: string[],
  values: string[],
  signatures: string[],
  calldatas: string[],
  description: string,
  account,
  contractName: ContractName | undefined = 'governorAdmin',
) {
  return network.send(
    contractName,
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

export function governance_proposalThreshold(
  contractName: ContractName | undefined = 'governorAdmin',
) {
  return network.call(contractName, 'proposalThreshold', []);
}

export function governance_quorumVotes(
  contractName: ContractName | undefined = 'governorAdmin',
) {
  return network.call(contractName, 'quorumVotes', []);
}

export function governance_proposalCount(
  contractName: ContractName | undefined = 'governorAdmin',
) {
  return network
    .call(contractName, 'proposalCount', [])
    .then(result => Number(result));
}
