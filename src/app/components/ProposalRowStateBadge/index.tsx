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
    justify-content: flex-end;
    padding-right: 1rem;
    position: relative;
    &:before {
      content: '';
      border-radius: 50%;
      height: 24px;
      width: 24px;
      background-size: 100% 100%;
      position: absolute;
      right: 0;
    }
    &__active {
      &:after {
        content: '';
        display: block;
        width: 4.8px;
        height: 9.6px;
        border: solid white;
        border-width: 0 1.6px 1.6px 0;
        position: absolute;
        transform: rotate(45deg);
        top: 5px;
        right: 0;
      }
    }
    &__failed {
      &:after {
        content: '';
        display: inline-block;
        position: absolute;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        width: 10px;
        height: 10px;
        background-image: url("data:image/svg+xml,%3Csvg width='10' height='10' viewBox='0 0 10 10' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8.77104 1.66231L8.3572 1.24847L5.06397 4.5417L1.77657 1.24847L1.36273 1.66231L4.65596 4.94971L1.36273 8.24294L1.77657 8.65678L5.06397 5.36355L8.3572 8.65678L8.77104 8.24294L5.47781 4.94971L8.77104 1.66231Z' fill='white'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M9.59574 1.6627L6.30251 4.9501L9.59537 8.24297L8.35723 9.48111L5.06436 6.18825L1.77696 9.48148L0.538451 8.24297L3.83132 4.9501L0.538086 1.6627L1.77696 0.423828L5.06436 3.71706L8.35723 0.424193L9.59574 1.6627ZM1.77657 1.24847L1.36273 1.66231L4.65596 4.94971L4.65271 4.95302L4.65184 4.95388L1.36273 8.24294L1.77657 8.65678L5.06397 5.36355L8.3572 8.65678L8.77104 8.24294L5.47781 4.94971L8.77104 1.66231L8.3572 1.24847L5.06814 4.53759L5.06728 4.53845L5.06397 4.5417L1.77657 1.24847Z' fill='white'/%3E%3C/svg%3E%0A");
        z-index: 1;
        top: 5px;
        right: 0;
      }
    }
  }
`;

export function ProposalRowStateBadge({ state }: Props) {
  return (
    <StyledDiv>
      <div className={`proposal-state ${getStateClass(state)}`}>
        {getStatus(state)}
      </div>
    </StyledDiv>
  );
}
