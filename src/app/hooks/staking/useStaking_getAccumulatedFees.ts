import { useContractCallWithValue } from '../useContractCallWithValue';
import { genesisAddress } from 'utils/helpers';

export function useStaking_getAccumulatedFees(address: string, token: string) {
  return useContractCallWithValue(
    'feeSharingProxy',
    'getAccumulatedFees',
    '0',
    !!address && address !== genesisAddress,
    address || genesisAddress,
    token || genesisAddress,
  );
}
