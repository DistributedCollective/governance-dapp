import React, { useState } from 'react';
import { Dialog, Text } from '@blueprintjs/core';
import Rsk3 from '@rsksmart/rsk3';
import { useDispatch, useSelector } from 'react-redux';
import { selectBlockChainProvider } from '../../containers/BlockChainProvider/selectors';
import arrowDown from 'assets/images/arrow-down.svg';
import { actions } from '../../containers/BlockChainProvider/slice';
import { useAccount } from '../../hooks/useAccount';
import { fromWei, genesisAddress, kFormatter } from '../../../utils/helpers';
import { useStaking_getCurrentVotes } from '../../hooks/staking/useStaking_getCurrentVotes';
import { useVestedStaking_balanceOf } from '../../hooks/staking/useVestedStaking_balanceOf';
import { vesting_delegate } from '../../containers/BlockChainProvider/requests/vesting';

export function VestingDelegationDialog() {
  const { showDelegationDialog, address, vestingType } = useSelector(
    selectBlockChainProvider,
  );
  const dispatch = useDispatch();
  const account = useAccount();
  const votes = useStaking_getCurrentVotes(account);
  const [loading, setLoading] = useState(false);
  const [addressTo, setAddressTo] = useState('');
  const balance = useVestedStaking_balanceOf(account || genesisAddress);

  const handleSubmit = async (team: boolean) => {
    setLoading(true);
    try {
      await vesting_delegate(
        team ? balance.teamVestingContract : balance.vestingContract,
        account,
        addressTo.toLowerCase(),
      );
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.error(e);
    }
  };

  return (
    <Dialog
      isOpen={showDelegationDialog}
      canEscapeKeyClose={false}
      canOutsideClickClose={false}
      className="bg-black max-w-29 w-full px-6 py-6 md:px-9 md:py-7 sm:p-4 rounded-3xl relative"
    >
      <Text
        tagName="h3"
        ellipsize
        className="text-center mb-8 leading-10 text-3xl tracking-normal"
      >
        Delegate
      </Text>
      <Text
        tagName="h4"
        ellipsize
        className="text-center text-gray-300 mb-8 leading-8 text-2xl tracking-normal"
      >
        {kFormatter(fromWei(votes.value))}
        <br />
        Voting Power
      </Text>
      <div className="mb-8 md:px-9 tracking-normal">
        <label
          className="leading-5 block text-theme-white text-md font-medium mb-2"
          htmlFor="amount"
        >
          Delegate from:
        </label>
        <div className="flex space-x-4 relative">
          <input
            readOnly
            className="appearance-none border border-gray-800 text-sm font-normal text-center h-10 rounded-lg w-full py-2 px-2 bg-black text-theme-white tracking-normal focus:outline-none focus:shadow-outline"
            type="text"
            defaultValue={address}
          />
        </div>
        <div className="text-center">
          <img className="mt-8 mb-8 mx-auto" src={arrowDown} alt="arrow" />
        </div>
        <label
          className="leading-5 block text-theme-white text-md font-medium mb-2"
          htmlFor="amount"
        >
          Delegate to:
        </label>
        <div className="flex space-x-4 relative">
          <input
            className="appearance-none border text-md font-semibold text-center h-10 rounded-lg w-full py-2 px-3 bg-theme-white text-black tracking-normal focus:outline-none focus:shadow-outline"
            id="stake-amount"
            type="text"
            placeholder="RSK wallet address"
            value={addressTo}
            onChange={e => setAddressTo(e.currentTarget.value)}
          />
        </div>
        <Text
          tagName="p"
          ellipsize
          className="block text-theme-white text-md font-light mb-3 mt-7"
        >
          Tx Fee: 0.0006 rBTC
        </Text>
      </div>
      <div className="grid grid-rows-1 mb-3 grid-flow-col gap-4">
        {vestingType === 'genesis' && (
          <button
            className={`uppercase w-full text-black bg-gold text-xl font-extrabold px-4 hover:bg-opacity-80 py-2 rounded-lg transition duration-500 ease-in-out ${
              (!addressTo ||
                loading ||
                !Rsk3.utils.isAddress((addressTo || '').toLowerCase()) ||
                balance.vestingContract === genesisAddress) &&
              'opacity-50 cursor-not-allowed hover:bg-opacity-100'
            }`}
            disabled={
              !addressTo ||
              loading ||
              !Rsk3.utils.isAddress((addressTo || '').toLowerCase()) ||
              balance.vestingContract === genesisAddress
            }
            onClick={() => handleSubmit(false)}
          >
            Confirm
          </button>
        )}
        {vestingType === 'team' && (
          <button
            type="submit"
            className={`uppercase w-full text-black bg-gold text-xl font-extrabold px-4 hover:bg-opacity-80 py-2 rounded-lg transition duration-500 ease-in-out ${
              (!addressTo ||
                loading ||
                !Rsk3.utils.isAddress((addressTo || '').toLowerCase()) ||
                balance.teamVestingContract === genesisAddress) &&
              'opacity-50 cursor-not-allowed hover:bg-opacity-100'
            }`}
            disabled={
              !addressTo ||
              loading ||
              !Rsk3.utils.isAddress((addressTo || '').toLowerCase()) ||
              balance.teamVestingContract === genesisAddress
            }
            onClick={() => handleSubmit(true)}
          >
            Confirm
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            dispatch(actions.toggleDelagationDialog(false));
            setAddressTo('');
          }}
          className="border border-gold rounded-lg text-gold uppercase w-full text-xl font-extrabold px-4 py-2 hover:bg-gold hover:bg-opacity-40 transition duration-500 ease-in-out"
        >
          Cancel
        </button>
      </div>
    </Dialog>
  );
}
