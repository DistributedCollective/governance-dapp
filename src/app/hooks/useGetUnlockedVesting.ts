import { useEffect, useState } from 'react';
import { bignumber } from 'mathjs';
import { genesisAddress } from '../../utils/helpers';
import { useAccount } from './useAccount';
import { network } from '../containers/BlockChainProvider/network';
import {
  vesting_getCliff,
  vesting_getEndDate,
  vesting_getStartDate,
} from '../containers/BlockChainProvider/requests/vesting';
import { staking_getPriorUserStakeByDate } from '../containers/BlockChainProvider/requests/staking';

const FOUR_WEEKS = 2419200;

export function useGetUnlockedVesting(vestingAddress: string) {
  const account = useAccount();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('0');
  useEffect(() => {
    const run = async () => {
      let value = '0';
      let end;

      const startDate = Number(await vesting_getStartDate(vestingAddress));
      const cliff = Number(await vesting_getCliff(vestingAddress));
      const allUnlocked = await network.call('staking', 'allUnlocked', []);
      const blockNumber = await network.blockNumber();

      //in the unlikely case that all tokens have been unlocked early, allow to withdraw all of them.
      if (allUnlocked) {
        end = Number(await vesting_getEndDate(vestingAddress));
      } else {
        end = new Date().getTime() / 1e3;
      }

      for (let i = startDate + cliff; i < end; i += FOUR_WEEKS) {
        const stake: string = (await staking_getPriorUserStakeByDate(
          vestingAddress,
          i,
          blockNumber - 1,
        )) as string;
        value = bignumber(value).add(stake).toFixed(0);
      }

      console.log('amount for', vestingAddress, value);

      return value;
    };

    if (vestingAddress && vestingAddress !== genesisAddress) {
      setLoading(true);
      run()
        .then(value => setAmount(value))
        .catch(e => {
          console.error(e);
          setAmount('0');
        })
        .finally(() => setLoading(false));
    }
  }, [account, vestingAddress]);

  return { value: amount, loading };
}
