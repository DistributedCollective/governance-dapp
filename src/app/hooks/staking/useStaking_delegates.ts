import { useContractCallWithValue } from '../useContractCallWithValue';
import { genesisAddress } from '../../../utils/helpers';

const date = new Date().getTime() + 86400e3 * 32;

export function useStaking_delegates(address: string) {
  return useContractCallWithValue(
    'staking',
    'delegates',
    genesisAddress,
    address,
    date,
  );
}
