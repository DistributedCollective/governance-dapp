import { genesisAddress } from 'utils/helpers';
import { useEffect, useState } from 'react';
import { bignumber } from 'mathjs';
import { network } from '../../containers/BlockChainProvider/network';

export function useVestedStaking_balanceOf(address: string) {
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState('0');
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    setLoading(true);

    const get = async () => {
      const adr1 = await network.call('vestingRegistry', 'getVesting', [
        address,
      ]);
      const adr2 = await network.call('vestingRegistry', 'getTeamVesting', [
        address,
      ]);
      const bal1 = await network.call('staking', 'balanceOf', [adr1]);
      const bal2 = await network.call('staking', 'balanceOf', [adr2]);
      setValue(bignumber(String(bal1)).add(String(bal2)).toString());
      setLoading(false);
      setError(null);
    };

    if (address !== genesisAddress) {
      get().catch(e => {
        setValue('0');
        setError(e);
        setLoading(false);
      });
    }
  }, [address]);

  return { value, loading, error };
}
