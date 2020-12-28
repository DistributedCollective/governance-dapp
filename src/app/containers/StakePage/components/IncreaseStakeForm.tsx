import React, { FormEvent } from 'react';
import { fromWei, handleNumberInput, numberFromWei } from 'utils/helpers';
import { ContractCallResponse } from 'app/hooks/useContractCall';
import moment from 'moment';

interface Props {
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  amount: string;
  timestamp?: number;
  onChangeAmount: (value: string) => void;
  sovBalanceOf: ContractCallResponse;
  isValid: boolean;
}

export function IncreaseStakeForm(props: Props) {
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
            id="stake-amount"
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

      <div className="flex flex-row justify-between items-center space-x-4">
        <button
          type="submit"
          className={`bg-green-500 text-white px-4 py-2 rounded ${
            !props.isValid && 'opacity-50 cursor-not-allowed'
          }`}
          disabled={!props.isValid}
        >
          Increase
        </button>
        <div>
          {props.timestamp && (
            <div className="text-gray-5 mb-4 text-xs">
              Your tokens are locked until:
              <br />
              <span className="font-bold">
                {moment(new Date(props.timestamp * 1000)).format('DD.MM.YYYY')}
              </span>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
