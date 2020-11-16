import React from 'react';
import { getStatus, ProposalState } from 'types/Proposal';

const getStateClass = (state: ProposalState) => {
  switch (state) {
    case ProposalState.Succeeded:
    case ProposalState.Queued:
    case ProposalState.Executed:
      return 'proposal-state__active';
    case ProposalState.Canceled:
    case ProposalState.Defeated:
    case ProposalState.Expired:
    case ProposalState.Pending:
    case ProposalState.Active:
      return 'proposal-state__failed';
  }
};

interface Props {
  state: ProposalState;
}

export function ProposalRowStateBadge({ state }: Props) {
  return (
    <div className={`proposal-state ${getStateClass(state)}`}>
      {getStatus(state)}
    </div>
  );
}
