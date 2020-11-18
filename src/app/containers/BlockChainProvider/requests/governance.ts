import { network } from '../network';

export function governance_propose(
  targets: string[],
  values: string[],
  signatures: string[],
  calldatas: string[],
  description: string,
  account,
) {
  // 0x04fa98E97A376a086e3BcAB99c076CB249e5740D
  // 0
  // getBalanceOf(address)
  // 0x0000000000000000000000007be508451cd748ba55dcbe75c8067f9420909b49
  return network.send(
    'governorAlpha',
    'propose',
    [
      ['0x04fa98E97A376a086e3BcAB99c076CB249e5740D'],
      ['0'],
      ['getBalanceOf(address)'],
      ['0x0000000000000000000000007be508451cd748ba55dcbe75c8067f9420909b49'],
      'Testing new proposal',
      { from: account },
    ],
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
