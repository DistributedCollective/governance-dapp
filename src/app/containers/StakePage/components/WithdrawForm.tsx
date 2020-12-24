import React, { FormEvent } from 'react';
import { fromWei, handleNumberInput, numberFromWei } from 'utils/helpers';
import { ContractCallResponse } from 'app/hooks/useContractCall';
import moment from 'moment';

interface Props {
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  amount: string;
  until: number;
  onChangeAmount: (value: string) => void;
  balanceOf: ContractCallResponse;
  isValid: boolean;
}

export function WithdrawForm(props: Props) {
  return (
    <form onSubmit={props.handleSubmit}>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="amount"
        >
          Amount to withdraw
        </label>
        <div className="flex space-x-4">
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="withdraw-amount"
            type="text"
            placeholder="Amount"
            value={props.amount}
            onChange={e => props.onChangeAmount(handleNumberInput(e))}
          />
          <button
            type="button"
            className=""
            onClick={() => props.onChangeAmount(fromWei(props.balanceOf.value))}
          >
            MAX
          </button>
        </div>
        <div className="text-gray-700 text-xs mt-3">
          Staked balance:{' '}
          <span
            className={`text-gray-900 ${props.balanceOf.loading && 'skeleton'}`}
          >
            {numberFromWei(props.balanceOf.value).toLocaleString()}
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
          Withdraw
        </button>
        <div>
          {props.until && (
            <div className="text-gray-5 mb-4 text-xs">
              Your tokens are locked until:
              <br />
              <span className="font-bold">
                {moment(new Date(props.until * 1000)).format('DD.MM.YYYY')}
              </span>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
