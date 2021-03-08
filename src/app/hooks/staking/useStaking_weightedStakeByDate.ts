import { useContractCallWithValue } from '../useContractCallWithValue';

export function useStaking_weightedStakeByDate(
  address: string,
  timestamp: number,
  startDate: number,
  blockNumber: number,
) {
  return useContractCallWithValue(
    'staking',
    'weightedStakeByDate',
    '0',
    address,
    timestamp,
    startDate,
    blockNumber,
  );
}
