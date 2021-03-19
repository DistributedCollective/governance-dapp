import React, { FormEvent } from 'react';
import { numberFromWei } from 'utils/helpers';
import { ContractCallResponse } from 'app/hooks/useContractCall';
import { StakingDateSelector } from '../../../components/StakingDateSelector';
import moment from 'moment';

interface Props {
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  amount: string;
  timestamp?: number;
  onChangeTimestamp: (value: number) => void;
  sovBalanceOf: ContractCallResponse;
  isValid: boolean;
  kickoff: ContractCallResponse;
  balanceOf: ContractCallResponse;
  stakes: undefined;
  votePower?: number;
  prevExtend: number;
  onCloseModal: () => void;
}

export function ExtendStakeForm(props: Props) {
  return (
    <>
      <h3 className="text-center mb-10 leading-10 text-3xl">
        Extend SOV Stake
      </h3>
      <div className="text-gray-5 mb-4 md:px-9 tracking-normal text-xs">
        Previous until:
        <br />
        <span className="font-bold">
          {moment(new Date(props.prevExtend * 1e3)).format('DD.MM.YYYY')}
        </span>
      </div>
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
              readOnly
              className="appearance-none border border-theme-white text-md font-semibold text-center h-10 rounded-lg w-full py-2 px-14 bg-black text-theme-white tracking-normal focus:outline-none focus:shadow-outline"
              id="amount"
              type="text"
              defaultValue={props.amount}
            />
            <span className="text-theme-white text-md font-semibold absolute top-3 right-5 leading-4">
              SOV
            </span>
          </div>

          <StakingDateSelector
            title="Select new date"
            kickoffTs={Number(props.kickoff.value)}
            value={props.timestamp}
            onClick={value => props.onChangeTimestamp(value)}
            stakes={props.stakes}
            prevExtend={props.prevExtend}
            delegate={false}
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
