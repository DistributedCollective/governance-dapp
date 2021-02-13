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
