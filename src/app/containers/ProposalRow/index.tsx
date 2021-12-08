import React, { useMemo } from 'react';
import { ProposalState } from 'types/Proposal';
import { Link, useLocation } from 'react-router-dom';
import Linkify from 'react-linkify';
import styled from 'styled-components/macro';
import { useGetProposalCreateEvent } from '../../hooks/useGetProposalCreateEvent';
import { useGetProposalState } from '../../hooks/useGetProposalState';
import { ProposalStatusBadge } from '../../components/ProposalStatusBadge';
import { ProposalRowStateBadge } from '../../components/ProposalRowStateBadge';
import { dateByBlocks } from '../../../utils/helpers';
import { MergedProposal } from '../../hooks/useProposalList';
import { bignumber } from 'mathjs';
import { LoadableValue } from 'app/components/LoadableValue';

interface Props {
  proposal: MergedProposal;
}

export function ProposalRow({ proposal }: Props) {
  const {
    loading: loadingCreated,
    value: created,
    event,
  } = useGetProposalCreateEvent(proposal);
  const { loading: loadingState, state } = useGetProposalState(proposal);
  const location = useLocation();

  const loaded = useMemo(() => !loadingState && !!state, [loadingState, state]);

  if (!loaded) {
    return (
      <>
        <tr>
          <td>
            <div className="flex justify-between items-center w-full space-x-4 py-5 px-5">
              <div className="w-full skeleton h-4" />
            </div>
          </td>
          <td>
            <div className="flex justify-between items-center w-full space-x-4 py-5 px-5">
              <div className="w-full skeleton h-4" />
            </div>
          </td>
          <td>
            <div className="flex justify-between items-center w-full space-x-4 py-5 px-5">
              <div className="w-full skeleton h-4" />
            </div>
          </td>
          <td>
            <div className="flex justify-between items-center w-full space-x-4 py-5 px-5">
              <div className="w-full skeleton h-4" />
            </div>
          </td>
          <td>
            <div className="flex justify-between items-center w-full space-x-4 py-5 px-5">
              <div className="w-full skeleton h-4" />
            </div>
          </td>
        </tr>
      </>
    );
  }

  let blue = 50;
  if (proposal.forVotes !== proposal.againstVotes) {
    blue = Math.min(
      Math.round(
        bignumber(proposal.forVotes)
          .div(bignumber(proposal.forVotes).add(proposal.againstVotes))
          .mul(100)
          .toNumber() || 0,
      ),
    );
  }
  const red = 100 - blue;

  return (
    <>
      <tr key={proposal.id}>
        {state === ProposalState.Active ? (
          <>
            <td className="font-montserrat max-w-sm truncate">
              <Linkify newTab={true}>
                {String(proposal.id).padStart(3, '0')} •{' '}
                {loadingCreated ? (
                  <em>Loading, please wait..</em>
                ) : (
                  created?.description
                )}
              </Linkify>
            </td>
            <td className="text-center hidden xl:table-cell truncate">
              #{proposal.startBlock}
            </td>
            <td className="text-center hidden xl:table-cell">
              <div className="flex flex-row space-x-4 items-center">
                <ProposalStatusBadge state={state} />
                <StyledBar>
                  <div
                    className="progress__blue"
                    style={{ width: `${blue}%` }}
                  />
                  <div className="progress__red" style={{ width: `${red}%` }} />
                </StyledBar>
              </div>
            </td>
            <td className="text-center hidden xl:table-cell truncate">
              {dateByBlocks(
                proposal.startTime,
                proposal.startBlock,
                proposal.endBlock,
              )}{' '}
              - #{proposal.endBlock}
            </td>
            <td className="text-center">
              <Link
                to={{
                  pathname: `/proposals/${proposal.id}/${proposal.contractName}`,
                  state: { background: location },
                }}
                className="text-gold hover:text-gold hover:underline font-thin font-montserrat tracking-normal"
              >
                View Proposal
              </Link>
            </td>
          </>
        ) : (
          <>
            <td className="font-montserrat max-w-sm truncate">
              <Linkify newTab={true}>
                {String(proposal.id).padStart(3, '0')} •{' '}
                {loadingCreated ? (
                  <em>Loading, please wait..</em>
                ) : (
                  created?.description
                )}
              </Linkify>
            </td>
            <td className="text-center hidden xl:table-cell tracking-normal truncate">
              #{proposal.startBlock}
            </td>
            <td className="text-center hidden xl:table-cell">
              <ProposalRowStateBadge state={state} />
            </td>
            <td className="text-center hidden xl:table-cell tracking-normal truncate">
              <LoadableValue
                value={dateByBlocks(
                  proposal.startTime,
                  event?.blockNumber,
                  proposal.endBlock,
                )}
                loading={loadingCreated}
              />
            </td>
            <td className="text-center">
              <Link
                to={`/${proposal.contractName}/${proposal.id}`}
                className="text-gold hover:text-gold hover:underline font-thin font-montserrat tracking-normal"
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
