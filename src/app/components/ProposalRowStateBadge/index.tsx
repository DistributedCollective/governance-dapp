import React from 'react';
import { getStatus, ProposalState } from 'types/Proposal';
import styled from 'styled-components/macro';

const getStateClass = (state: ProposalState) => {
  switch (state) {
    case ProposalState.Succeeded:
    case ProposalState.Queued:
    case ProposalState.Executed:
      return 'proposal-state__active';
    case ProposalState.Canceled:
    case ProposalState.Defeated:
    case ProposalState.Expired:
    case ProposalState.Active:
      return 'proposal-state__failed';
    case ProposalState.Pending:
      return '';
  }
};

interface Props {
  state: ProposalState;
}

const StyledDiv = styled.div`
  .proposal-state {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-right: 1rem;
    position: relative;
  }
`;

export function ProposalRowStateBadge({ state }: Props) {
  return (
    <StyledDiv>
      <div
        className={`proposal-state font-thin font-montserrat ${getStateClass(
          state,
        )}`}
      >
        {getStatus(state)}
      </div>
    </StyledDiv>
  );
}
