/**
 *
 * ProposalRow
 *
 */

import React from 'react';
import { Proposal, ProposalState } from 'types/Proposal';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components/macro';
import { dateByBlocks, numberFromWei } from '../../../utils/helpers';
import { VoteProgress } from '../../components/VoteProgress';
import { useGetProposalCreateEvent } from '../../hooks/useGetProposalCreateEvent';
import { useGetProposalState } from '../../hooks/useGetProposalState';
import { ProposalStatusBadge } from '../../components/ProposalStatusBadge';
import { ProposalRowStateBadge } from '../../components/ProposalRowStateBadge';

interface Props {
  proposal: Proposal;
}

const StyledBar = styled.div`
  width: 100%;
  max-width: 100px;
  display: flex;
  height: 10px;
  flex-wrap: nowrap;
  margin: 5px 0 5px auto;
  border-radius: 8px;
  overflow: hidden;
  .progress__blue {
    width: 50%;
    background: rgb(78, 205, 196);
    background: linear-gradient(
      90deg,
      rgba(78, 205, 196, 1) 0%,
      rgba(0, 0, 0, 1) 100%
    );
  }
  .progress__red {
    width: 50%;
    background: rgb(0, 0, 0);
    background: linear-gradient(
      90deg,
      rgba(0, 0, 0, 1) 0%,
      rgba(205, 78, 78, 1) 100%
    );
  }
`;

export function ProposalRow({ proposal }: Props) {
  const { loading: loadingCreated, value: created } = useGetProposalCreateEvent(
    proposal,
  );
  const { loading: loadingState, state } = useGetProposalState(proposal);
  const location = useLocation();

  if (loadingState || loadingCreated || !created || !state) {
    return (
      <>
        <tr>
          <td>
            <div className="flex justify-between items-center w-full space-x-4 py-5 px-5">
              <div className="w-full skeleton h-4" />
              <div className="w-full skeleton h-4" />
            </div>
          </td>
          <td>
            <div className="flex justify-between items-center w-full space-x-4 py-5 px-5">
              <div className="w-full skeleton h-4" />
              <div className="w-full skeleton h-4" />
            </div>
          </td>
          <td>
            <div className="flex justify-between items-center w-full space-x-4 py-5 px-5">
              <div className="w-full skeleton h-4" />
              <div className="w-full skeleton h-4" />
            </div>
          </td>
          <td>
            <div className="flex justify-between items-center w-full space-x-4 py-5 px-5">
              <div className="w-full skeleton h-4" />
              <div className="w-full skeleton h-4" />
            </div>
          </td>
          <td>
            <div className="flex justify-between items-center w-full space-x-4 py-5 px-5">
              <div className="w-full skeleton h-4" />
              <div className="w-full skeleton h-4" />
            </div>
          </td>
        </tr>
      </>
    );
  }

  return (
    <>
      <tr key={proposal.id}>
        {state === ProposalState.Active ? (
          <>
            <td className="font-montserrat">
              SIP {String(proposal.id).padStart(3, '0')}. {created.description}
            </td>
            <td className="text-right hidden md:table-cell">#{proposal.id}</td>
            <td className="text-right hidden md:table-cell">
              <ProposalStatusBadge state={state} />
              <VoteProgress
                max={numberFromWei(proposal.quorum)}
                value={numberFromWei(proposal.forVotes)}
                color="green"
                showVotes={true}
              />
              <VoteProgress
                max={numberFromWei(proposal.quorum)}
                value={numberFromWei(proposal.againstVotes)}
                color="gray"
                showVotes={true}
              />
            </td>
            <td className="text-right hidden md:table-cell">
              {dateByBlocks(
                proposal.startTime,
                proposal.startBlock,
                proposal.endBlock,
              )}
              - #{proposal.id}
            </td>
            <td className="text-right">
              <Link
                to={{
                  pathname: `/proposals/${proposal.id}`,
                  state: { background: location },
                }}
                className="text-gold hover:text-gold hover:underline"
              >
                View Proposal
              </Link>
            </td>
          </>
        ) : (
          <>
            <td className="font-montserrat">
              SIP {String(proposal.id).padStart(3, '0')}.
              {created.description || 'Title.'}
            </td>
            <td className="text-right hidden md:table-cell">#{proposal.id}</td>
            <td className="text-right hidden md:table-cell">
              <ProposalRowStateBadge state={state} />
              <StyledBar>
                <div className="progress__blue"></div>
                <div className="progress__red"></div>
              </StyledBar>
            </td>
            <td className="text-right hidden md:table-cell">
              {dateByBlocks(
                proposal.startTime,
                proposal.startBlock,
                proposal.endBlock,
              )}
              - #{proposal.id}
            </td>
            <td className="text-right">
              <Link
                to={{
                  pathname: `/proposals/${proposal.id}`,
                  state: { background: location },
                }}
                className="text-gold hover:text-gold hover:underline"
              >
                View Proposal
              </Link>
            </td>
          </>
        )}
      </tr>
    </>
  );
}
