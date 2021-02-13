import { useContractCallWithValue } from '../useContractCallWithValue';
import { useAccount } from '../useAccount';

export function useStaking_delegates(address: string) {
  const account = useAccount();
  return useContractCallWithValue(
    'staking',
    'delegates',
    '0',
    account,
    address || account,
  );
}
