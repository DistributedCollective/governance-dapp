import React, { FormEvent } from 'react';
import { fromWei, handleNumberInput, numberFromWei } from 'utils/helpers';
import { ContractCallResponse } from 'app/hooks/useContractCall';
import { StakingDateSelector } from '../../../components/StakingDateSelector';

interface Props {
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  amount: string;
  timestamp?: number;
  onChangeAmount: (value: string) => void;
  onChangeTimestamp: (value: number) => void;
  sovBalanceOf: ContractCallResponse;
  isValid: boolean;
  kickoff: ContractCallResponse;
  stakes: undefined;
}

export function StakeForm(props: Props) {
  return (
    <form onSubmit={props.handleSubmit}>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="amount"
        >
          Amount to stake
        </label>
        <div className="flex space-x-4">
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            type="text"
            placeholder="Amount"
            value={props.amount}
            onChange={e => props.onChangeAmount(handleNumberInput(e))}
          />
          <button
            type="button"
            className=""
            onClick={() =>
              props.onChangeAmount(fromWei(props.sovBalanceOf.value))
            }
          >
            MAX
          </button>
        </div>
        <div className="text-gray-700 text-xs mt-3">
          Balance:{' '}
          <span
            className={`text-gray-900 ${
              props.sovBalanceOf.loading && 'skeleton'
            }`}
          >
            {numberFromWei(props.sovBalanceOf.value).toLocaleString()}
          </span>{' '}
          SoV
        </div>
      </div>

      <div className="mb-4">
        <StakingDateSelector
          value={props.timestamp}
          onChange={value => props.onChangeTimestamp(value)}
          kickoffTs={Number(props.kickoff.value)}
          title="Stake until date"
          stakes={props.stakes}
        />
      </div>

      <button
        type="submit"
        className={`bg-green-500 text-white px-4 py-2 rounded ${
          !props.isValid && 'opacity-50 cursor-not-allowed'
        }`}
        disabled={!props.isValid}
      >
        Stake
      </button>
    </form>
  );
}
