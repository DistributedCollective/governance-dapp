import { useContractCallWithValue } from '../useContractCallWithValue';
import { genesisAddress } from 'utils/helpers';

export function useVesting_getVesting(address: string) {
  return useContractCallWithValue(
    'vestingRegistry',
    'getVesting',
    '0',
    address || genesisAddress,
  );
}
