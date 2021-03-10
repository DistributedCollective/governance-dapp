import { useContractCallWithValue } from '../useContractCallWithValue';
import { genesisAddress } from 'utils/helpers';

export function useVesting_getVesting(address: string) {
  return useContractCallWithValue(
    'vestingRegistry',
    'getVesting',
    genesisAddress,
    !!address && address !== genesisAddress,
    address || genesisAddress,
  );
}
