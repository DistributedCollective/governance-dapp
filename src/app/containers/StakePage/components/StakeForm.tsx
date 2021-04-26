import React, { FormEvent } from 'react';
import { fromWei, handleNumberInput, numberFromWei } from 'utils/helpers';
import { ContractCallResponse } from 'app/hooks/useContractCall';
import { StakingDateSelector } from '../../../components/StakingDateSelector';
import '../../../components/Header/index.scss';
interface Props {
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  amount: string;
  fee: string;
  timestamp?: number;
  onChangeAmount: (value: string) => void;
  onChangeTimestamp: (value: number) => void;
  sovBalanceOf: ContractCallResponse;
  isValid: boolean;
  kickoff: ContractCallResponse;
  stakes: undefined;
  votePower?: number;
  onCloseModal: () => void;
}

export function StakeForm(props: Props) {
  return (
    <>
      <h3 className="text-center mb-10 leading-10 text-3xl">Stake SOV</h3>
      <form onSubmit={props.handleSubmit}>
        <div className="mb-9 md:px-9 tracking-normal">
          <label
            className="leading-4 block text-theme-white text-md font-medium mb-2"
            htmlFor="amount"
          >
            Amount to Stake:
          </label>
          <div className="flex space-x-4 relative">
            <input
              className="appearance-none border text-md font-semibold text-center h-10 rounded-lg w-full py-2 px-14 bg-theme-white text-black tracking-normal focus:outline-none focus:shadow-outline"
              id="amount"
              type="text"
              value={props.amount}
              placeholder="Enter amount"
              onChange={e => props.onChangeAmount(handleNumberInput(e))}
            />
            <span className="text-black text-md font-semibold absolute top-3 right-5 leading-4">
              SOV
            </span>
          </div>
          <div className="flex rounded border border-theme-blue mt-4">
            <div
              onClick={() =>
                props.onChangeAmount(
                  fromWei((props.sovBalanceOf.value as any) / 10),
                )
              }
              className="cursor-pointer transition duration-300 ease-in-out hover:bg-theme-blue hover:bg-opacity-30 w-1/5 py-1 text-center border-r text-sm text-theme-blue tracking-tighter border-theme-blue"
            >
              10%
            </div>
            <div
              onClick={() =>
                props.onChangeAmount(
                  fromWei((props.sovBalanceOf.value as any) / 4),
                )
              }
              className="cursor-pointer transition duration-300 ease-in-out hover:bg-theme-blue hover:bg-opacity-30 w-1/5 py-1 text-center border-r text-sm text-theme-blue tracking-tighter border-theme-blue"
            >
              25%
            </div>
            <div
              onClick={() =>
                props.onChangeAmount(
                  fromWei((props.sovBalanceOf.value as any) / 2),
                )
              }
              className="cursor-pointer transition duration-300 ease-in-out hover:bg-theme-blue hover:bg-opacity-30 w-1/5 py-1 text-center border-r text-sm text-theme-blue tracking-tighter border-theme-blue"
            >
              50%
            </div>
            <div
              onClick={() =>
                props.onChangeAmount(
                  fromWei(((props.sovBalanceOf.value as any) / 4) * 3),
                )
              }
              className="cursor-pointer transition duration-300 ease-in-out hover:bg-theme-blue hover:bg-opacity-30 w-1/5 py-1 text-center border-r text-sm text-theme-blue tracking-tighter border-theme-blue"
            >
              75%
            </div>
            <div
              onClick={() =>
                props.onChangeAmount(fromWei(props.sovBalanceOf.value))
              }
              className="cursor-pointer transition duration-300 ease-in-out hover:bg-theme-blue hover:bg-opacity-30 w-1/5 py-1 text-center text-sm text-theme-blue tracking-tighter"
            >
              100%
            </div>
          </div>

          <StakingDateSelector
            title="Select new date"
            kickoffTs={Number(props.kickoff.value)}
            value={props.timestamp}
            onClick={value => props.onChangeTimestamp(value)}
            stakes={props.stakes}
          />

          <label
            className="block text-theme-white text-md font-medium mb-2 mt-8"
            htmlFor="voting-power"
          >
            Voting Power received:
          </label>
          <div className="flex space-x-4">
            <input
              readOnly
              className="border text-theme-white appearance-none text-md font-semibold text-center h-10 rounded-lg w-full py-2 px-3 bg-transparent tracking-normal focus:outline-none focus:shadow-outline"
              id="voting-power"
              type="text"
              placeholder="0"
              value={numberFromWei(props.votePower)}
            />
          </div>
          <p className="block text-theme-white text-md font-light mb-2 mt-7">
            Tx Fee: {props.fee} rBTC
          </p>
        </div>
        <div className="grid grid-rows-1 grid-flow-col gap-4">
          <button
            type="submit"
            className={`uppercase w-full text-black bg-gold bg-opacity-1 text-xl font-extrabold px-4 hover:bg-opacity-80 py-2 rounded-lg transition duration-500 ease-in-out ${
              !props.isValid &&
              'opacity-50 cursor-not-allowed hover:bg-opacity-100'
            }`}
            disabled={!props.isValid}
          >
            Confirm
          </button>
          <button
            type="button"
            onClick={() => props.onCloseModal()}
            className="border border-gold rounded-lg text-gold uppercase w-full text-xl font-extrabold px-4 py-2 hover:bg-gold hover:bg-opacity-40 transition duration-500 ease-in-out"
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}
