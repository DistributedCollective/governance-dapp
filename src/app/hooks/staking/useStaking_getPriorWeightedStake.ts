import { useContractCallWithValue } from '../useContractCallWithValue';

export function useStaking_getPriorWeightedStake(
  address: string,
  blockNumber: number,
  timestamp: number,
) {
  return useContractCallWithValue(
    'staking',
    'getPriorWeightedStake',
    '0',
    address,
    blockNumber,
    timestamp,
  );
}
