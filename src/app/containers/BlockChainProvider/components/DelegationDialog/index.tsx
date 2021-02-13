import React, { useState } from 'react';
import { Dialog, Text } from '@blueprintjs/core';
import Rsk3 from '@rsksmart/rsk3';
import { useDispatch, useSelector } from 'react-redux';
import { selectBlockChainProvider } from '../../selectors';
import { actions } from '../../slice';
import { useAccount } from '../../../../hooks/useAccount';
import { fromWei, genesisAddress } from '../../../../../utils/helpers';
import { useStaking_getCurrentVotes } from '../../../../hooks/staking/useStaking_getCurrentVotes';
import { staking_delegate } from '../../requests/staking';
import { StakingDateSelector } from '../../../../components/StakingDateSelector';
import { useStaking_kickoffTs } from '../../../../hooks/staking/useStaking_kickoffTs';
import { useVestedStaking_balanceOf } from '../../../../hooks/staking/useVestedStaking_balanceOf';

export function DelegationDialog() {
  const { showDelegationDialog } = useSelector(selectBlockChainProvider);
  const dispatch = useDispatch();
  const account = useAccount();

  const votes = useStaking_getCurrentVotes(account);
  const kickoff = useStaking_kickoffTs();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');
  const [ts, setTs] = useState<any>();

  const balance = useVestedStaking_balanceOf(account || genesisAddress);

  const handleSubmit = async e => {
    e && e.preventDefault && e.preventDefault();
    setLoading(true);
    try {
      await staking_delegate(address.toLowerCase(), ts, account);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.error(e);
    }
  };

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
        <form onSubmit={handleSubmit}>
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="amount"
          >
            Delegate to
          </label>

          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline mb-5"
            id="stake-amount"
            type="text"
            placeholder="RSK wallet address"
            value={address}
            onChange={e => setAddress(e.currentTarget.value)}
          />

          <StakingDateSelector
            title="Delegate until"
            kickoffTs={Number(kickoff.value)}
            value={ts}
            onChange={e => setTs(e)}
            autoselect
          />

          <Text tagName="p" ellipsize className="mt-6 mb-3 text-sm">
            My SOV:{' '}
            {Number(fromWei(balance.value)).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 4,
            })}
          </Text>

          <Text tagName="p" ellipsize className="mt-2 mb-3 text-sm">
            Votes:{' '}
            {Number(fromWei(votes.value)).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 4,
            })}
          </Text>

          <div className="text-right mt-3">
            <button
              type="submit"
              className={`rounded-md bg-gold bg-opacity-10 focus:outline-none focus:bg-opacity-50 hover:bg-opacity-40 transition duration-500 ease-in-out border px-5 py-2 text-md text-gold border-gold ${
                (!address ||
                  loading ||
                  !Rsk3.utils.isAddress((address || '').toLowerCase())) &&
                'opacity-50 cursor-not-allowed'
              }`}
              disabled={
                !address ||
                loading ||
                !Rsk3.utils.isAddress((address || '').toLowerCase())
              }
            >
              Delegate
            </button>
          </div>
        </form>
      </div>
    </Dialog>
  );
}
