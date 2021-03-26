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

export function vesting_withdraw(
  vestingAddress: string,
  receiver: string,
  owner: string,
) {
  return network.sendCustomContract(
    vestingAddress,
    VestingABI,
    'withdrawTokens',
    [receiver, { from: owner }],
    {
      type: 'withdraw',
    },
  );
}

export function vesting_getCliff(vestingAddress: string) {
  return network.callCustomContract(vestingAddress, VestingABI, 'cliff', []);
}

export function vesting_getDuration(vestingAddress: string) {
  return network.callCustomContract(vestingAddress, VestingABI, 'duration', []);
}

export function vesting_getStartDate(vestingAddress: string) {
  return network.callCustomContract(
    vestingAddress,
    VestingABI,
    'startDate',
    [],
  );
}

export function vesting_getEndDate(vestingAddress: string) {
  return network.callCustomContract(vestingAddress, VestingABI, 'endDate', []);
}

export function vesting_getFOUR_WEEKS(vestingAddress: string) {
  return network.callCustomContract(
    vestingAddress,
    VestingABI,
    'FOUR_WEEKS',
    [],
  );
}
