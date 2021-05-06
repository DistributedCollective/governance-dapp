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
      untilTs,
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

export function staking_withdraw(
  weiAmount: string,
  until: number,
  account: string,
) {
  return network.send(
    'staking',
    'withdraw',
    [
      weiAmount,
      until,
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

export function staking_extendStakingDuration(
  prevUntil: number,
  until: number,
  account: string,
) {
  return network.send(
    'staking',
    'extendStakingDuration',
    [
      prevUntil,
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

export function staking_delegate(address: string, lockDate: number, account) {
  return network.send(
    'staking',
    'delegate',
    [address, lockDate, { from: account }],
    {
      type: 'delegate',
    },
  );
}

export function staking_getPriorUserStakeByDate(
  address: string,
  date: number,
  blockNumber: number,
) {
  return network.call('staking', 'getPriorUserStakeByDate', [
    address,
    date,
    blockNumber,
  ]);
}

export function staking_withdrawFee(
  tokenAddress: string,
  processedCheckpoints: string,
  account: string,
) {
  return network.send('feeSharingProxy', 'withdraw', [
    tokenAddress,
    processedCheckpoints,
    account,
  ]);
}
export function staking_processedCheckpoints(
  account: string,
  tokenAddress: string,
) {
  return network.call('feeSharingProxy', 'processedCheckpoints', [
    account,
    tokenAddress,
  ]);
}
