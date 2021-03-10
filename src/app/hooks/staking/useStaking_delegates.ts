import { useEffect, useState } from 'react';
import { useContractCallWithValue } from '../useContractCallWithValue';
import { genesisAddress } from '../../../utils/helpers';
import { useStaking_kickoffTs } from './useStaking_kickoffTs';

export function useStaking_delegates(address: string) {
  const kickoff = useStaking_kickoffTs();
  const [ts, setTs] = useState(Number(kickoff));
  useEffect(() => {
    setTs((Number(kickoff.value) || 0) + 86400 * 14);
  }, [kickoff.value]);
  return useContractCallWithValue(
    'staking',
    'delegates',
    genesisAddress,
    !!address && address !== genesisAddress,
    address,
    ts || 0,
  );
}
