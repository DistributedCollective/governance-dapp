import moment from 'moment';
import { genesisAddress, getContract } from 'utils/helpers';
import { network } from '../network';

export function staking_stake(
  weiAmount: string,
  untilTs: number,
  account: string,
  nonce: number,
) {
  return network.send(
    'staking',
    'stake',
    [
      weiAmount,
      moment(untilTs).diff(moment(), 'seconds'),
      genesisAddress,
      genesisAddress,
      { from: account, nonce, gasLimit: 250000 },
    ],
    {
      type: 'stake',
    },
  );
}

export function staking_approve(
  weiAmount: string,
  account: string,
  nonce: number,
) {
  return network.send(
    'sovToken',
    'approve',
    [
      getContract('staking').address,
      weiAmount,
      {
        from: account,
        nonce,
      },
    ],
    {
      type: 'approve',
    },
  );
}

export function staking_withdraw(weiAmount: string, account: string) {
  return network.send(
    'staking',
    'withdraw',
    [
      weiAmount,
      account,
      {
        from: account,
      },
    ],
    {
      type: 'withdraw',
    },
  );
}

export function staking_allowance(account: string) {
  return network.call('sovToken', 'allowance', [
    account,
    getContract('staking').address,
  ]);
}

export function staking_increaseStake(
  weiAmount: string,
  account: string,
  nonce: number,
) {
  return network.send(
    'staking',
    'increaseStake',
    [
      weiAmount,
      genesisAddress,
      {
        from: account,
        nonce,
        gasLimit: 250000,
      },
    ],
    {
      type: 'stake',
    },
  );
}

export function staking_extendStakingDuration(until: number, account: string) {
  return network.send(
    'staking',
    'extendStakingDuration',
    [
      until + 86400, // adding 24 hours to date to make sure contract will not choose previous period.
      {
        from: account,
      },
    ],
    {
      type: 'extend',
    },
  );
}
