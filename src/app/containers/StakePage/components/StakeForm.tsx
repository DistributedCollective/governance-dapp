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

          <label className="block mt-8 text-theme-white text-md font-medium mb-2">
            Select Year:
          </label>

          <div className="flex">
            <button
              type="button"
              className="leading-7 mr-6 rounded border border-theme-blue cursor-pointer transition duration-300 ease-in-out hover:bg-theme-blue hover:bg-opacity-30 px-5 py-0 text-center border-r text-md text-theme-blue tracking-tighter"
            >
              2021
            </button>
            <button
              type="button"
              className="leading-7 mr-6 rounded border border-theme-blue cursor-pointer transition duration-300 ease-in-out hover:bg-theme-blue hover:bg-opacity-30 px-5 py-0 text-center border-r text-md text-theme-blue tracking-tighter"
            >
              2022
            </button>
            <button
              type="button"
              className="leading-7 rounded border border-theme-blue cursor-pointer transition duration-300 ease-in-out hover:bg-theme-blue hover:bg-opacity-30 px-5 py-0 text-center border-r text-md text-theme-blue tracking-tighter"
            >
              2023
            </button>
          </div>
          <div className="flex mt-5">
            <div className="calendar month flex w-full pl-1">
              <div className="w-1/6">
                <div className="mb-1 font-light text-sm text-center text-gray-300">
                  Jan
                </div>
                <div className="flex items-center justify-center -ml-0.25 -mt-0.25 h-10 leading-10 rounded-lg border border-theme-blue cursor-pointer transition duration-300 ease-in-out hover:bg-theme-blue hover:bg-opacity-30 px-5 py-0 text-center border-r text-md text-theme-blue tracking-tighter">
                  25
                </div>
                <div className="flex items-center justify-center -ml-0.25 -mt-0.25 h-10 leading-10 rounded-lg border border-theme-blue cursor-pointer transition duration-300 ease-in-out hover:bg-theme-blue hover:bg-opacity-30 px-5 py-0 text-center border-r text-md text-theme-blue tracking-tighter">
                  -
                </div>
                <div className="flex items-center justify-center -ml-0.25 -mt-0.25 h-10 leading-10 rounded-lg border border-theme-blue cursor-pointer transition duration-300 ease-in-out hover:bg-theme-blue hover:bg-opacity-30 px-5 py-0 text-center border-r text-md text-theme-blue tracking-tighter">
                  -
                </div>
              </div>
              <div className="w-1/6">
                <div className="mb-1 font-light text-sm text-center text-gray-300">
                  Feb
                </div>
                <div className="flex items-center justify-center -ml-0.25 -mt-0.25 h-10 leading-10 rounded-lg border border-theme-blue cursor-pointer transition duration-300 ease-in-out hover:bg-theme-blue hover:bg-opacity-30 px-5 py-0 text-center border-r text-md text-theme-blue tracking-tighter">
                  25
                </div>
                <div className="flex items-center justify-center -ml-0.25 -mt-0.25 h-10 leading-10 rounded-lg border border-theme-blue cursor-pointer transition duration-300 ease-in-out hover:bg-theme-blue hover:bg-opacity-30 px-5 py-0 text-center border-r text-md text-theme-blue tracking-tighter">
                  -
                </div>
                <div className="flex items-center justify-center -ml-0.25 -mt-0.25 h-10 leading-10 rounded-lg border border-theme-blue cursor-pointer transition duration-300 ease-in-out hover:bg-theme-blue hover:bg-opacity-30 px-5 py-0 text-center border-r text-md text-theme-blue tracking-tighter">
                  -
                </div>
              </div>
              <div className="w-1/6">
                <div className="mb-1 font-light text-sm text-center text-gray-300">
                  Mar
                </div>
                <div className="flex items-center justify-center -ml-0.25 -mt-0.25 h-10 leading-10 rounded-lg border border-theme-blue cursor-pointer transition duration-300 ease-in-out hover:bg-theme-blue hover:bg-opacity-30 px-5 py-0 text-center border-r text-md text-theme-blue tracking-tighter">
                  25
                </div>
                <div className="flex items-center justify-center -ml-0.25 -mt-0.25 h-10 leading-10 rounded-lg border border-theme-blue cursor-pointer transition duration-300 ease-in-out hover:bg-theme-blue hover:bg-opacity-30 px-5 py-0 text-center border-r text-md text-theme-blue tracking-tighter">
                  -
                </div>
                <div className="flex items-center justify-center -ml-0.25 -mt-0.25 h-10 leading-10 rounded-lg border border-theme-blue cursor-pointer transition duration-300 ease-in-out hover:bg-theme-blue hover:bg-opacity-30 px-5 py-0 text-center border-r text-md text-theme-blue tracking-tighter">
                  -
                </div>
              </div>
              <div className="w-1/6">
                <div className="mb-1 font-light text-sm text-center text-gray-300">
                  Apr
                </div>
                <div className="flex items-center justify-center -ml-0.25 -mt-0.25 h-10 leading-10 rounded-lg border border-theme-blue cursor-pointer transition duration-300 ease-in-out hover:bg-theme-blue hover:bg-opacity-30 px-5 py-0 text-center border-r text-md text-theme-blue tracking-tighter">
                  25
                </div>
                <div className="flex items-center justify-center -ml-0.25 -mt-0.25 h-10 leading-10 rounded-lg border border-theme-blue cursor-pointer transition duration-300 ease-in-out hover:bg-theme-blue hover:bg-opacity-30 px-5 py-0 text-center border-r text-md text-theme-blue tracking-tighter">
                  -
                </div>
                <div className="flex items-center justify-center -ml-0.25 -mt-0.25 h-10 leading-10 rounded-lg border border-theme-blue cursor-pointer transition duration-300 ease-in-out hover:bg-theme-blue hover:bg-opacity-30 px-5 py-0 text-center border-r text-md text-theme-blue tracking-tighter">
                  -
                </div>
              </div>
              <div className="w-1/6">
                <div className="mb-1 font-light text-sm text-center text-gray-300">
                  May
                </div>
                <div className="flex items-center justify-center -ml-0.25 -mt-0.25 h-10 leading-10 rounded-lg border border-theme-blue cursor-pointer transition duration-300 ease-in-out hover:bg-theme-blue hover:bg-opacity-30 px-5 py-0 text-center border-r text-md text-theme-blue tracking-tighter">
                  25
                </div>
                <div className="flex items-center justify-center -ml-0.25 -mt-0.25 h-10 leading-10 rounded-lg border border-theme-blue cursor-pointer transition duration-300 ease-in-out hover:bg-theme-blue hover:bg-opacity-30 px-5 py-0 text-center border-r text-md text-theme-blue tracking-tighter">
                  -
                </div>
                <div className="flex items-center justify-center -ml-0.25 -mt-0.25 h-10 leading-10 rounded-lg border border-theme-blue cursor-pointer transition duration-300 ease-in-out hover:bg-theme-blue hover:bg-opacity-30 px-5 py-0 text-center border-r text-md text-theme-blue tracking-tighter">
                  -
                </div>
              </div>
              <div className="w-1/6">
                <div className="mb-1 font-light text-sm text-center text-gray-300">
                  Jun
                </div>
                <div className="flex items-center justify-center -ml-0.25 -mt-0.25 h-10 leading-10 rounded-lg border border-theme-blue cursor-pointer transition duration-300 ease-in-out hover:bg-theme-blue hover:bg-opacity-30 px-5 py-0 text-center border-r text-md text-theme-blue tracking-tighter">
                  25
                </div>
                <div className="flex items-center justify-center -ml-0.25 -mt-0.25 h-10 leading-10 rounded-lg border border-theme-blue cursor-pointer transition duration-300 ease-in-out hover:bg-theme-blue hover:bg-opacity-30 px-5 py-0 text-center border-r text-md text-theme-blue tracking-tighter">
                  -
                </div>
                <div className="flex items-center justify-center -ml-0.25 -mt-0.25 h-10 leading-10 rounded-lg border border-theme-blue cursor-pointer transition duration-300 ease-in-out hover:bg-theme-blue hover:bg-opacity-30 px-5 py-0 text-center border-r text-md text-theme-blue tracking-tighter">
                  -
                </div>
              </div>
            </div>
          </div>
          <label
            className="block text-theme-white text-md font-medium mb-2 mt-8"
            htmlFor="vouting-power"
          >
            Voting Power received:
          </label>
          <div className="flex space-x-4">
            <input
              className="border text-theme-white appearance-none text-md font-semibold text-center h-10 rounded-lg w-full py-2 px-3 bg-transparent tracking-normal focus:outline-none focus:shadow-outline"
              id="vouting-power"
              type="text"
              placeholder="0"
              defaultValue={numberFromWei(props.votePower)}
            />
          </div>
          <p className="block text-theme-white text-md font-light mb-2 mt-7">
            Tx Fee: 0.0006 rBTC
          </p>
          <div className="text-gray-700 text-xs mt-3 hidden">
            Balance:{' '}
            <span
              className={`text-gray-900 ${
                props.sovBalanceOf.loading && 'skeleton'
              }`}
            >
              {numberFromWei(props.sovBalanceOf.value).toLocaleString()}
            </span>{' '}
            SoV
            {Number(props.votePower) > 0 && (
              <>
                <br />
                Will be added to your vote: +{' '}
                {numberFromWei(props.votePower).toLocaleString()}
              </>
            )}
          </div>
        </div>

        <div className="mb-4 px-6 mb-12 hidden">
          <StakingDateSelector
            value={props.timestamp}
            onChange={value => props.onChangeTimestamp(value)}
            kickoffTs={Number(props.kickoff.value)}
            title="Stake until date"
            stakes={props.stakes}
          />
        </div>
        <div className="grid grid-rows-1 grid-flow-col gap-4">
          <button
            type="submit"
            className={`uppercase w-full text-black bg-gold text-xl font-extrabold px-4 hover:bg-opacity-80 py-2 rounded-lg transition duration-500 ease-in-out ${
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
