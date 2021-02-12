import React from 'react';
import { EventData } from 'web3-eth-contract';
import { Proposal } from 'types/Proposal';
import { prettyTx } from 'utils/helpers';

interface Props {
  proposal: Proposal;
  createdEvent: EventData;
}

export function ProposalHistory(props: Props) {
  return (
    <>
      {!props.proposal ? (
        <div className="px-5">
          <div className="mt-3 mb-3 skeleton">loading</div>
          <div className="mb-3 skeleton">loading</div>
          <div className="mb-3 skeleton">loading</div>
        </div>
      ) : (
        <>
          {props.proposal && (
            <div className="flex items-start mb-5 -mt-1">
              <p className="text-lg max-w-130 leading-4 tracking-normal w-1/2 font-semibold">
                Proposed by:
              </p>
              <div className="w-auto">
                <p className="text-gold text-sm tracking-normal">
                  {props.proposal?.proposer && (
                    <>
                      {prettyTx(props.proposal?.proposer) ||
                        '0x00000000000000000'}
                    </>
                  )}
                </p>
              </div>
            </div>
          )}
          {props.proposal && props.createdEvent && (
            <div className="flex mb-6">
              <p className="text-lg tracking-normal max-w-130 leading-4 w-1/2 font-semibold">
                Proposed on:
              </p>
              <div className="w-auto">
                <p className="text-sm tracking-normal">
                  {props.createdEvent.blockNumber}
                </p>
                <p className="text-gold text-sm tracking-normal leading-3">
                  {props.proposal?.id && <>#{props.proposal.id}</>}
                </p>
              </div>
            </div>
          )}
          {props.proposal && (
            <>
              <div className="flex mb-4">
                <p className="text-lg max-w-130 tracking-normal leading-4 w-1/2 font-semibold">
                  Deadline:
                </p>
                <div className="w-auto">
                  <p className="text-sm tracking-normal">
                    {props.proposal.endBlock}
                  </p>
                  <p className="text-gold tracking-normal text-sm leading-3">
                    {props.proposal?.id && <>#{props.proposal.id}</>}
                  </p>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
