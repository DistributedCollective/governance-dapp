import { useContractCallWithValue } from '../useContractCallWithValue';
import { genesisAddress } from 'utils/helpers';

export function useStaking_currentBalance(address: string) {
  return useContractCallWithValue(
    'staking',
    'currentBalance',
    '0',
    address || genesisAddress,
  );
}
