import { useEffect, useState } from 'react';
import { ProposalState } from 'types/Proposal';
import { network } from '../containers/BlockChainProvider/network';
import { MergedProposal } from './useProposalList';

interface StateResult {
  state: ProposalState;
  loading: boolean;
}

export function useGetProposalState(proposal: MergedProposal) {
  const [state, setState] = useState<StateResult>({
    state: ProposalState.Pending,
    loading: true,
  });

  useEffect(() => {
    if (proposal?.id) {
      setState(prevState => ({ ...prevState, loading: true }));
      network
        .call(proposal.contractName, 'state', [proposal.id])
        .then(result => {
          setState(prevState => ({
            ...prevState,
            state: result as ProposalState,
            loading: false,
          }));
        })
        .catch(console.error);
    }
  }, [proposal, setState]);

  return state;
}
