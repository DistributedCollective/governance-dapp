import { useContractCallWithValue } from '../useContractCallWithValue';
import { genesisAddress } from 'utils/helpers';

export function useSoV_balanceOf(address: string) {
  return useContractCallWithValue(
    'sovToken',
    'balanceOf',
    '0',
    address || genesisAddress,
  );
}
