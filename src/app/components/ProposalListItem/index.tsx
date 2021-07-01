import React from 'react';
import { Link } from 'react-router-dom';
import { VoteProgress } from '../VoteProgress';
import { Proposal } from '../../../types/Proposal';
import { dateByBlocks } from '../../../utils/helpers';
import { bignumber } from 'mathjs';

export function ProposalListItem(props: Proposal & { description: string }) {
  return (
    <Link
      to={`/proposals/${props.id}`}
      className="flex px-5 py-3 transition duration-300 bordered-list-item"
    >
      {!props.canceled && !props.executed ? (
        <div className="flex justify-between items-center w-full">
          <div className="flex justify-between items-center">
            <div className="pulsating-dot ml-5 mr-8" />
            <div>
              <div
                className={`font-medium mb-2 ${
                  !props.description && 'skeleton'
                }`}
              >
                {props.description || 'Title.'}
              </div>
              <div className="flex flex-row justify-start items-center">
                <StatusBadge {...props} />
                <div className="text-indigo-700 text-xs ml-3">
                  {String(props.id).padStart(3, '0')} • Ends at{' '}
                  {dateByBlocks(
                    props.startTime,
                    props.startBlock,
                    props.endBlock,
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="hidden md:block md:w-1/3">
            <VoteProgress
              max={bignumber(props.forVotes)
                .add(bignumber(props.againstVotes))
                .toString()}
              value={props.forVotes}
              color="green"
              showVotes={true}
            />
            <VoteProgress
              max={bignumber(props.forVotes)
                .add(bignumber(props.againstVotes))
                .toString()}
              value={props.againstVotes}
              color="gray"
              showVotes={true}
            />
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center w-full">
          <div className="w-full md:w-10/12">
            <div className="font-medium mb-2">{props.description}</div>
            <div className="flex flex-row justify-start items-center">
              <StatusBadge {...props} />
              <div
                className={`${
                  props.executed && props.canceled
                    ? 'text-green-500'
                    : 'text-gray-500'
                } text-xs ml-3`}
              >
                {props.startBlock} • {props.startTime}
              </div>
            </div>
          </div>
          <div className="hidden md:block w-2/12">
            {props.executed && 'Executed'}
            {props.canceled && 'Canceled'}
          </div>
        </div>
      )}
    </Link>
  );
}

const borderColorMap = {
  green: 'border-green-500',
  gray: 'border-gray-500',
  indigo: 'border-indigo-700',
};

const colorMap = {
  green: 'text-green-500',
  gray: 'text-gray-500',
  indigo: 'text-indigo-700',
};

function StatusBadge(item: Proposal) {
  let color = 'indigo';
  let text = 'Active';
  if (item.executed) {
    color = 'green';
    text = 'Executed';
  } else if (item.canceled) {
    color = 'gray';
    text = 'Canceled';
  }
  return (
    <div
      className={`border rounded py-0 px-1 text-xs ${borderColorMap[color]} ${colorMap[color]} text-center`}
      style={{ width: '70px' }}
    >
      {text}
    </div>
  );
}
