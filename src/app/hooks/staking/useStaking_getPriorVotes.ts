import { useContractCallWithValue } from '../useContractCallWithValue';
import { genesisAddress } from '../../../utils/helpers';

export function useStaking_getPriorVotes(
  address: string,
  blockNumber: number,
  timestamp: number,
) {
  return useContractCallWithValue(
    'staking',
    'getPriorVotes',
    '0',
    !!address && address !== genesisAddress,
    address,
    blockNumber,
    timestamp,
  );
}
