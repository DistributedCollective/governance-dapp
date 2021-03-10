import { useContractCallWithValue } from '../useContractCallWithValue';
import { genesisAddress } from 'utils/helpers';

export function useVesting_getOriginVesting(address: string) {
  return useContractCallWithValue(
    'vestingRegistry2',
    'getVesting',
    genesisAddress,
    !!address && address !== genesisAddress,
    address || genesisAddress,
  );
}
