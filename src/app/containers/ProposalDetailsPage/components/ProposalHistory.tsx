import React from 'react';
import { EventData } from 'web3-eth-contract';
import { Proposal } from 'types/Proposal';
import { dateByBlocks } from 'utils/helpers';

interface Props {
  proposal: Proposal;
  createdEvent: EventData;
}

export function ProposalHistory(props: Props) {
  // const [executed, setExecuted] = useState<EventData>();
  // const [canceled, setCanceled] = useState<EventData>();
  // const [queued, setQueued] = useState<EventData>();
  // useEffect(() => {
  //   const getEvents = async () => {
  //     //
  //   };
  //   getEvents().then().catch();
  // }, [props.proposal?.id]);
  return (
    <div className="w-3/12 bg-white rounded shadow">
      <div className="px-5 py-3 border-b">
        <h4 className="font-bold">Proposal history</h4>
      </div>

      {!props.proposal ? (
        <div className="px-5">
          <div className="mt-3 mb-3 skeleton">loading</div>
          <div className="mb-3 skeleton">loading</div>
          <div className="mb-3 skeleton">loading</div>
        </div>
      ) : (
        <>
          {props.proposal && (
            <div className="px-5 py-2">
              <div>Active</div>
              <div className="text-xs text-gray-400">
                {dateByBlocks(
                  props.proposal.startTime,
                  props.proposal.startBlock,
                  props.proposal.startBlock,
                )}
              </div>
            </div>
          )}

          {props.proposal && props.createdEvent && (
            <div className="px-5 py-2">
              <div>Created</div>
              <div className="text-xs text-gray-400">
                {dateByBlocks(
                  props.proposal.startTime,
                  props.createdEvent.blockNumber,
                  props.createdEvent.blockNumber,
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
