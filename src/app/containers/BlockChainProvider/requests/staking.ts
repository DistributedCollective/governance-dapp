import { genesisAddress, getContract } from 'utils/helpers';
import { network } from '../network';

// 1209600 two weeks

export function staking_stake(
  weiAmount: string,
  timeInSeconds: number,
  account: string,
  nonce: number,
) {
  return network.send(
    'staking',
    'stake',
    [
      weiAmount,
      timeInSeconds,
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

export function staking_extendStakingDuration(until: string, account: string) {
  return network.send(
    'staking',
    'extendStakingDuration',
    [
      until,
      {
        from: account,
      },
    ],
    {
      type: 'extend',
    },
  );
}
