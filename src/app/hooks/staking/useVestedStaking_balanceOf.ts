import { genesisAddress } from 'utils/helpers';
import { useEffect, useState } from 'react';
import { network } from '../../containers/BlockChainProvider/network';

export function useVestedStaking_balanceOf(address: string) {
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState('0');
  const [vestedValue, setVestedValue] = useState('0');
  const [teamVestedValue, setTeamVestedValue] = useState('0');
  const [error, setError] = useState<any>(null);

  const [vestingContract, setVestingContract] = useState(genesisAddress);
  const [teamVestingContract, setTeamVestingContract] = useState(
    genesisAddress,
  );

  useEffect(() => {
    setLoading(true);

    const get = async () => {
      const adr1 = await network.call('vestingRegistry', 'getVesting', [
        address,
      ]);
      const adr2 = await network.call('vestingRegistry', 'getTeamVesting', [
        address,
      ]);

      if (adr1 !== genesisAddress) {
        const vested = await network.call('staking', 'balanceOf', [adr1]);
        setVestingContract(String(adr1));
        setVestedValue(String(vested));
      }

      if (adr2 !== genesisAddress) {
        const teamVested = await network.call('staking', 'balanceOf', [adr2]);
        setTeamVestingContract(String(adr2));
        setTeamVestedValue(String(teamVested));
      }

      if (adr1 === adr2 && adr1 === genesisAddress) {
        setVestingContract(genesisAddress);
        setTeamVestingContract(genesisAddress);
      }

      const staked = await network.call('staking', 'balanceOf', [address]);
      setValue(String(staked));
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

  return {
    value,
    loading,
    error,
    vestingContract,
    vestedValue,
    teamVestedValue,
    teamVestingContract,
  };
}
