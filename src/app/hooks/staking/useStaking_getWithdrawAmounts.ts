import { useContractCallWithValue } from '../useContractCallWithValue';

export function useStaking_getWithdrawAmounts(amount: string, until: number) {
  return useContractCallWithValue(
    'staking',
    'getWithdrawAmounts',
    '0',
    undefined,
    amount,
    until,
  );
}
