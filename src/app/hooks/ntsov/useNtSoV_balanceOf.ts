import { useContractCallWithValue } from '../useContractCallWithValue';
import { genesisAddress } from 'utils/helpers';

export function useNtSoV_balanceOf(address: string) {
  return useContractCallWithValue(
    'ntSovToken',
    'balanceOf',
    '0',
    address || genesisAddress,
  );
}
