import { useContractCallWithValue } from '../useContractCallWithValue';
import { genesisAddress } from 'utils/helpers';

export function useStaking_balanceOf(address: string) {
  return useContractCallWithValue(
    'staking',
    'balanceOf',
    '0',
    !!address && address !== genesisAddress,
    address || genesisAddress,
  );
}
