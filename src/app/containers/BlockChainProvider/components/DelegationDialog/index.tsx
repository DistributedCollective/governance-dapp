import React, { useState } from 'react';
import { Dialog, Text } from '@blueprintjs/core';
import Rsk3 from '@rsksmart/rsk3';
import { useDispatch, useSelector } from 'react-redux';
import { selectBlockChainProvider } from '../../selectors';
import { actions } from '../../slice';
import { useAccount } from '../../../../hooks/useAccount';
import {
  fromWei,
  genesisAddress,
  kFormatter,
} from '../../../../../utils/helpers';
import { useStaking_getCurrentVotes } from '../../../../hooks/staking/useStaking_getCurrentVotes';
import { useVestedStaking_balanceOf } from '../../../../hooks/staking/useVestedStaking_balanceOf';
import { vesting_delegate } from '../../requests/vesting';
// import { useStaking_delegates } from '../../../../hooks/staking/useStaking_delegates';

export function DelegationDialog() {
  const { showDelegationDialog } = useSelector(selectBlockChainProvider);
  const dispatch = useDispatch();
  const account = useAccount();

  const votes = useStaking_getCurrentVotes(account);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');

  const balance = useVestedStaking_balanceOf(account || genesisAddress);

  // const delegatesVested = useStaking_delegates(balance.vestingContract);
  // const delegatesTeam = useStaking_delegates(balance.teamVestingContract);

  const handleSubmit = async (team: boolean) => {
    setLoading(true);
    try {
      await vesting_delegate(
        team ? balance.teamVestingContract : balance.vestingContract,
        account,
        address.toLowerCase(),
      );
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.error(e);
    }
  };

  // const delegated =
  //   delegates.value.toLowerCase() !== genesisAddress.toLowerCase() &&
  //   delegates.value.toLowerCase() !== account.toLowerCase();

  return (
    <Dialog
      isOpen={showDelegationDialog}
      onClose={() => dispatch(actions.toggleDelagationDialog(false))}
      canEscapeKeyClose={false}
      canOutsideClickClose={false}
      className="bg-gray-light border"
      title="Delegate Voting Rights"
    >
      <div className="container pt-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="amount"
        >
          Delegate to
        </label>

        {/*{delegated && (*/}
        {/*  <p className="mt-2 mb-3 text-sm">*/}
        {/*    To delegate voting rights to yourself enter your own wallet*/}
        {/*    address*/}
        {/*  </p>*/}
        {/*)}*/}

        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline mb-5"
          id="stake-amount"
          type="text"
          placeholder="RSK wallet address"
          value={address}
          onChange={e => setAddress(e.currentTarget.value)}
        />

        <div className="mt-6" />

        {Number(balance.value) > 0 && (
          <Text tagName="p" ellipsize className="mb-3 text-sm">
            Staked SOV:{' '}
            {Number(fromWei(balance.value)).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 4,
            })}
          </Text>
        )}
        {balance.vestingContract === genesisAddress &&
          balance.teamVestingContract === genesisAddress && (
            <Text tagName="p" ellipsize className="mb-3 text-sm">
              Vested SOV:{' '}
              {Number(0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 4,
              })}
            </Text>
          )}
        {balance.vestingContract !== genesisAddress && (
          <Text tagName="p" ellipsize className="mb-3 text-sm">
            Vested SOV:{' '}
            {Number(fromWei(balance.vestedValue)).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 4,
            })}
          </Text>
        )}
        {balance.teamVestingContract !== genesisAddress && (
          <Text tagName="p" ellipsize className="mb-3 text-sm">
            Vested SOV (Team):{' '}
            {Number(fromWei(balance.teamVestedValue)).toLocaleString(
              undefined,
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 4,
              },
            )}
          </Text>
        )}
        {/*<Text tagName="p" ellipsize className="mt-2 mb-3 text-sm">*/}
        {/*  Delegated to: {delegated ? delegates.value : 'Yourself'}*/}
        {/*</Text>*/}

        {/*{!delegated && (*/}
        <Text tagName="p" ellipsize className="mt-5 mb-3 text-sm">
          Voting Power: {kFormatter(fromWei(votes.value))}
        </Text>
        {/*)}*/}

        <div className="text-right mt-3">
          {balance.vestingContract !== genesisAddress && (
            <button
              className={`rounded-md bg-gold bg-opacity-10 focus:outline-none focus:bg-opacity-50 hover:bg-opacity-40 transition duration-500 ease-in-out border px-5 py-2 text-md text-gold border-gold ${
                (!address ||
                  loading ||
                  !Rsk3.utils.isAddress((address || '').toLowerCase()) ||
                  balance.vestingContract === genesisAddress) &&
                'opacity-50 cursor-not-allowed'
              }`}
              disabled={
                !address ||
                loading ||
                !Rsk3.utils.isAddress((address || '').toLowerCase()) ||
                balance.vestingContract === genesisAddress
              }
              onClick={() => handleSubmit(false)}
            >
              Delegate
              {balance.teamVestingContract !== genesisAddress
                ? ' (Vested)'
                : ''}
            </button>
          )}

          {balance.teamVestingContract !== genesisAddress && (
            <button
              type="submit"
              className={`ml-3 rounded-md bg-gold bg-opacity-10 focus:outline-none focus:bg-opacity-50 hover:bg-opacity-40 transition duration-500 ease-in-out border px-5 py-2 text-md text-gold border-gold ${
                (!address ||
                  loading ||
                  !Rsk3.utils.isAddress((address || '').toLowerCase()) ||
                  balance.teamVestingContract === genesisAddress) &&
                'opacity-50 cursor-not-allowed'
              }`}
              disabled={
                !address ||
                loading ||
                !Rsk3.utils.isAddress((address || '').toLowerCase()) ||
                balance.teamVestingContract === genesisAddress
              }
              onClick={() => handleSubmit(true)}
            >
              Delegate
              {balance.vestingContract !== genesisAddress
                ? ' (Team Vested)'
                : ''}
            </button>
          )}
        </div>
      </div>
    </Dialog>
  );
}
