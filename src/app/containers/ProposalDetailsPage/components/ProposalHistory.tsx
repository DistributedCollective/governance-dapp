import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '@blueprintjs/core';
import { EventData } from 'web3-eth-contract';
import { Proposal } from 'types/Proposal';
import { Popover2 } from '@blueprintjs/popover2';
import { translations } from 'locales/i18n';
import { toastSuccess } from 'utils/toaster';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { dateByBlocks, prettyTx } from 'utils/helpers';

interface Props {
  proposal: Proposal;
  createdEvent: EventData;
}

export function ProposalHistory(props: Props) {
  const { t } = useTranslation();
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
                {props.proposal?.proposer && (
                  <Popover2
                    minimal={true}
                    placement="top"
                    popoverClassName="bp3-tooltip2"
                    content={
                      <div className="flex items-center">
                        <p className="text-gold text-sm tracking-normal">
                          {props.proposal?.proposer || '0x00000000000000000'}
                        </p>
                        <CopyToClipboard
                          onCopy={() =>
                            toastSuccess(
                              <>{t(translations.onCopy.address)}</>,
                              'copy',
                            )
                          }
                          text={props.proposal?.proposer}
                        >
                          <Icon
                            title="Copy"
                            icon="duplicate"
                            className="text-white cursor-pointer hover:text-gold ml-2"
                            iconSize={15}
                          />
                        </CopyToClipboard>
                      </div>
                    }
                  >
                    <p className="text-gold text-sm tracking-normal cursor-pointer duration-300 hover:opacity-70 transition">
                      {prettyTx(props.proposal?.proposer) ||
                        '0x00000000000000000'}
                    </p>
                  </Popover2>
                )}
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
                  {dateByBlocks(
                    props.proposal.startTime,
                    props.createdEvent?.blockNumber,
                    props.createdEvent.blockNumber,
                  )}
                </p>
                <p className="text-gold text-sm tracking-normal leading-3">
                  #{props.createdEvent.blockNumber}
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
                    {dateByBlocks(
                      props.proposal.startTime,
                      props.createdEvent?.blockNumber,
                      props.proposal.endBlock,
                    )}
                  </p>
                  <p className="text-gold tracking-normal text-sm leading-3">
                    #{props.proposal.endBlock}
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
