import { useContractCallWithValue } from '../useContractCallWithValue';
import { genesisAddress } from 'utils/helpers';

export function useStaking_getStakes(address: string) {
  return useContractCallWithValue(
    'staking',
    'getStakes',
    '0',
    !!address && address !== genesisAddress,
    address || genesisAddress,
  );
}
