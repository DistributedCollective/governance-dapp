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
            <div className="flex items-start mb-6">
              <p className="text-lg xl:max-w-140 leading-4 w-1/2">
                Proposed by:
              </p>
              <div className="w-auto">
                <p className="text-gold text-sm">
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
              <p className="text-lg xl:max-w-140 leading-4 w-1/2">
                Proposed on:
              </p>
              <div className="w-auto">
                <p className="text-sm">{props.createdEvent.blockNumber}</p>
                <p className="text-gold text-sm">
                  {props.proposal?.id && <>#{props.proposal.id}</>}
                </p>
              </div>
            </div>
          )}
          {props.proposal && (
            <>
              <div className="flex mb-6">
                <p className="text-lg xl:max-w-140 leading-4 w-1/2">
                  Deadline:
                </p>
                <div className="w-auto">
                  <p className="text-sm">{props.proposal.endBlock}</p>
                  <p className="text-gold text-sm">
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
