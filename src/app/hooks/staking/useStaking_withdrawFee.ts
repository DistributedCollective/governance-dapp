import { useContractCallWithValue } from '../useContractCallWithValue';
import { genesisAddress } from 'utils/helpers';

export function useStaking_withdrawFee(token: string) {
  return useContractCallWithValue(
    'feeSharingProxy',
    'withdrawFees',
    '0',
    !!token && token !== genesisAddress,
    token || genesisAddress,
  );
}
