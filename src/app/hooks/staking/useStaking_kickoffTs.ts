import { useContractCallWithValue } from '../useContractCallWithValue';

export function useStaking_kickoffTs() {
  return useContractCallWithValue('staking', 'kickoffTS', '0');
}
