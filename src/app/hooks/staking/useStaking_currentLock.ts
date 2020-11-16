import { useContractCallWithValue } from '../useContractCallWithValue';
import { genesisAddress } from 'utils/helpers';

export function useStaking_currentLock(address: string) {
  return useContractCallWithValue(
    'staking',
    'currentLock',
    '0',
    address || genesisAddress,
  );
}
