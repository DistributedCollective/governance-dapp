import { useContractCallWithValue } from '../useContractCallWithValue';

export function useStaking_computeWeightByDate(
  lockDate: number,
  currentDate: number,
) {
  return useContractCallWithValue(
    'staking',
    'computeWeightByDate',
    '0',
    lockDate,
    currentDate,
  );
}
