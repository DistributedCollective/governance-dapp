import { network } from '../network';
import VestingABI from '../abi/Vesting.json';

export function vesting_delegate(
  vestingAddress: string,
  owner: string,
  delegatee: string,
) {
  return network.sendCustomContract(
    vestingAddress,
    VestingABI,
    'delegate',
    [delegatee, { from: owner }],
    {
      type: 'delegate',
    },
  );
}

export function vesting_withdraw(address: string, account: string) {
  return network.sendCustomContract(
    address,
    VestingABI,
    'withdrawTokens',
    [address, { from: account }],
    {
      type: 'withdraw',
    },
  );
}
