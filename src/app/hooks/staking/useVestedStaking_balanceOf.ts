import { genesisAddress } from 'utils/helpers';
import { useEffect, useState } from 'react';
import { bignumber } from 'mathjs';
import { network } from '../../containers/BlockChainProvider/network';

export function useVestedStaking_balanceOf(address: string) {
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState('0');
  const [error, setError] = useState<any>(null);

  const [vestingContract, setVestingContract] = useState(genesisAddress);

  useEffect(() => {
    setLoading(true);

    const get = async () => {
      const adr1 = await network.call('vestingRegistry', 'getVesting', [
        address,
      ]);
      const adr2 = await network.call('vestingRegistry', 'getTeamVesting', [
        address,
      ]);

      let bal1: any = '0';

      if (adr1 !== genesisAddress) {
        bal1 = await network.call('staking', 'balanceOf', [adr1]);
        setVestingContract(String(adr1));
      }

      if (adr2 !== genesisAddress) {
        bal1 = await network.call('staking', 'balanceOf', [adr2]);
        setVestingContract(String(adr2));
      }

      if (adr1 === adr2 && adr1 === genesisAddress) {
        setVestingContract(genesisAddress);
      }

      const bal2 = await network.call('staking', 'balanceOf', [address]);
      setValue(bignumber(String(bal1)).add(String(bal2)).toString());
      setLoading(false);
      setError(null);
    };

    if (address !== genesisAddress) {
      get().catch(e => {
        setValue('0');
        setError(e);
        setLoading(false);
        setVestingContract(genesisAddress);
      });
    }
  }, [address]);

  return { value, loading, error, vestingContract };
}
