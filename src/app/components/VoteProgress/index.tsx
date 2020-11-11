import React from 'react';

interface Props {
  value: number;
  max: number;
  color: 'green' | 'red' | 'gray';
  showVotes?: boolean;
}

const colorMap = {
  green: 'bg-green-500',
  red: 'bg-red-600',
  gray: 'bg-gray-600',
  indigo: 'bg-indigo-600',
};

export function VoteProgress(props: Props) {
  const percentage = Math.round((props.value / props.max) * 100);
  return (
    <div className="w-full flex flex-row flex-no-wrap items-center justify-between mt-3">
      <div
        className={`bg-opacity-25 ${colorMap[props.color]} h-1 rounded w-full`}
      >
        <div
          className={`${colorMap[props.color]} h-1 rounded`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {props.showVotes && (
        <div className="w-2/6 pl-3 text-xs">{kFormatter(props.value)}</div>
      )}
    </div>
  );
}

function kFormatter(num) {
  return Math.abs(num) > 999
    ? `${Number(Math.sign(num) * (Math.abs(num) / 1000)).toFixed(1)}k`
    : Math.sign(num) * Math.abs(num);
}
