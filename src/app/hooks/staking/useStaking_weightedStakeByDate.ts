import { useContractCallWithValue } from '../useContractCallWithValue';
import { genesisAddress } from '../../../utils/helpers';

export function useStaking_weightedStakeByDate(
  address: string,
  timestamp: number,
  startDate: number,
  blockNumber: number,
) {
  return useContractCallWithValue(
    'staking',
    'weightedStakeByDate',
    '0',
    !!address && address !== genesisAddress,
    address,
    timestamp,
    startDate,
    blockNumber,
  );
}
