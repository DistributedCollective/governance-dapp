import React, { FormEvent } from 'react';

interface Props {
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  amount: string;
  onChangeAmount: (value: string) => void;
  isValid: boolean;
}

export function ExtendStakingDurationForm(props: Props) {
  return (
    <form onSubmit={props.handleSubmit}>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="amount"
        >
          Days to add
        </label>
        <div className="flex space-x-4">
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="days-amount"
            type="text"
            placeholder="Days to add"
            value={props.amount}
            onChange={e => props.onChangeAmount(e.currentTarget.value)}
          />
          <button type="button" onClick={() => props.onChangeAmount('14')}>
            MAX
          </button>
        </div>
      </div>

      <div className="flex flex-row justify-between items-center space-x-4">
        <button
          type="submit"
          className={`bg-green-500 text-white px-4 py-2 rounded ${
            !props.isValid && 'opacity-50 cursor-not-allowed'
          }`}
          disabled={!props.isValid}
        >
          Extend by {props.amount || '0'} days
        </button>
      </div>
    </form>
  );
}
