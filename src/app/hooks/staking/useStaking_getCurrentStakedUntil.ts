import { useContractCallWithValue } from '../useContractCallWithValue';

export function useStaking_getCurrentStakedUntil(timestamp: number) {
  return useContractCallWithValue(
    'staking',
    'getCurrentStakedUntil',
    '0',
    !!timestamp,
    timestamp,
  );
}
