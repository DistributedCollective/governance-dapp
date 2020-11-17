/**
 *
 * ProposalRow
 *
 */

import React from 'react';
import { Proposal, ProposalState } from 'types/Proposal';
import { Link } from 'react-router-dom';
import { dateByBlocks, numberFromWei } from '../../../utils/helpers';
import { VoteProgress } from '../../components/VoteProgress';
import { useGetProposalCreateEvent } from '../../hooks/useGetProposalCreateEvent';
import { useGetProposalState } from '../../hooks/useGetProposalState';
import { ProposalStatusBadge } from '../../components/ProposalStatusBadge';
import { ProposalRowStateBadge } from '../../components/ProposalRowStateBadge';

interface Props {
  proposal: Proposal;
}

export function ProposalRow({ proposal }: Props) {
  const { loading: loadingCreated, value: created } = useGetProposalCreateEvent(
    proposal,
  );
  const { loading: loadingState, state } = useGetProposalState(proposal);

  if (loadingState || loadingCreated || !created || !state) {
    return (
      <>
        <div className="flex justify-between items-center w-full space-x-4 py-5 px-5">
          <div className="w-full skeleton h-4" />
          <div className="w-full skeleton h-4" />
        </div>
      </>
    );
  }

  return (
    <>
      <Link
        to={`/proposals/${proposal.id}`}
        className="flex px-5 py-3 transition duration-300 bordered-list-item hover:no-underline"
      >
        {state === ProposalState.Active ? (
          <div className="flex justify-between items-center w-full">
            <div className="flex justify-between items-center">
              <div className="pulsating-dot ml-5 mr-8" />
              <div>
                <div
                  className={`font-medium mb-2 ${
                    !created.description && 'skeleton'
                  }`}
                >
                  {created.description || 'Title.'}
                </div>
                <div className="flex flex-row justify-start items-center">
                  <ProposalStatusBadge state={state} />
                  <div className="text-indigo-700 text-xs ml-3">
                    {String(proposal.id).padStart(3, '0')} • Ends at{' '}
                    {dateByBlocks(
                      proposal.startTime,
                      proposal.startBlock,
                      proposal.endBlock,
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden md:block md:w-1/3">
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
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center w-full">
            <div className="w-full md:w-10/12">
              <div className="font-medium mb-2">{created.description}</div>
              <div className="flex flex-row justify-start items-center">
                <ProposalStatusBadge state={state} />
                <div
                  className={`${
                    proposal.executed && proposal.canceled
                      ? 'text-green-500'
                      : 'text-gray-500'
                  } text-xs ml-3`}
                >
                  {String(proposal.id).padStart(3, '0')} • Finished at{' '}
                  {dateByBlocks(
                    proposal.startTime,
                    proposal.startBlock,
                    proposal.endBlock,
                  )}
                </div>
              </div>
            </div>
            <div className="hidden md:block w-2/12">
              <ProposalRowStateBadge state={state} />
            </div>
          </div>
        )}
      </Link>
    </>
  );
}
