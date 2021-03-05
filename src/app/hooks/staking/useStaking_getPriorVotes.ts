import { useContractCallWithValue } from '../useContractCallWithValue';

export function useStaking_getPriorVotes(
  address: string,
  blockNumber: number,
  timestamp: number,
) {
  return useContractCallWithValue(
    'staking',
    'getPriorVotes',
    '0',
    address,
    blockNumber,
    timestamp,
  );
}
