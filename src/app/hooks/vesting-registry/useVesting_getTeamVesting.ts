import { useContractCallWithValue } from '../useContractCallWithValue';
import { genesisAddress } from 'utils/helpers';

export function useVesting_getTeamVesting(address: string) {
  return useContractCallWithValue(
    'vestingRegistry',
    'getTeamVesting',
    '0',
    address || genesisAddress,
  );
}
