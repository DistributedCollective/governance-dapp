import { useContractCallWithValue } from '../useContractCallWithValue';
import { genesisAddress } from '../../../utils/helpers';

export function useStaking_getPriorWeightedStake(
  address: string,
  blockNumber: number,
  timestamp: number,
) {
  return useContractCallWithValue(
    'staking',
    'getPriorWeightedStake',
    '0',
    !!address && address !== genesisAddress,
    address,
    blockNumber,
    timestamp,
  );
}
