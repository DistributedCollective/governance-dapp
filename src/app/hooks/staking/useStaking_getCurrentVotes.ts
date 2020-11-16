import { useContractCallWithValue } from '../useContractCallWithValue';
import { genesisAddress } from 'utils/helpers';

export function useStaking_getCurrentVotes(address: string) {
  return useContractCallWithValue(
    'staking',
    'getCurrentVotes',
    '0',
    address || genesisAddress,
  );
}
