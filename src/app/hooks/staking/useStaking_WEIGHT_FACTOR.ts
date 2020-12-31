import { useContractCallWithValue } from '../useContractCallWithValue';

export function useStaking_WEIGHT_FACTOR() {
  return useContractCallWithValue('staking', 'WEIGHT_FACTOR', '0');
}
