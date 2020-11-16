import { useEffect, useState } from 'react';
import { Proposal, ProposalState } from 'types/Proposal';
import { network } from '../containers/BlockChainProvider/network';

interface StateResult {
  state: ProposalState;
  loading: boolean;
}

export function useGetProposalState(proposal: Proposal) {
  const [state, setState] = useState<StateResult>({
    state: ProposalState.Active,
    loading: true,
  });

  useEffect(() => {
    if (proposal.id) {
      setState(prevState => ({ ...prevState, loading: true }));
      network
        .call('governorAlpha', 'state', [proposal.id])
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
