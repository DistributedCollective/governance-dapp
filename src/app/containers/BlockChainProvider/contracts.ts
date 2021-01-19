import { IContractNetworks } from './types';
import GovernorAlphaABI from './abi/GovernorAlpha.json';
import StakingABI from './abi/Staking.json';
import TimelockABI from './abi/Timelock.json';
import ERC20TokenABI from './abi/ERC20Token.json';
import NtSOVABi from './abi/NTSOV.json';

export const contracts: IContractNetworks = {
  testnet: {
    sovToken: {
      address: '0x4c2bE6C604A3181Ef531914671902c2De068EA63',
      abi: ERC20TokenABI as any,
    },
    ntSovToken: {
      address: '0x4c2bE6C604A3181Ef531914671902c2De068EA63',
      abi: NtSOVABi as any,
    },
    staking: {
      address: '0x0a440C27decD34dBb02754e9Ec00d3d3d38a4083',
      abi: StakingABI as any,
    },
    timelock: {
      address: '0x0E9fb5B82bD46320d811104542EEE4209536978a',
      abi: TimelockABI as any,
    },
    governorAlpha: {
      address: '0x2ed3014C631F249BEf8f2930dD9833AECe0798DC',
      abi: GovernorAlphaABI as any,
    },
  },
  mainnet: {
    sovToken: {
      address: '0xbb6a00a7103b8110313DD9BE069B0Fa0D3bd62A4',
      abi: ERC20TokenABI as any,
    },
    ntSovToken: {
      address: '0xbb6a00a7103b8110313DD9BE069B0Fa0D3bd62A4',
      abi: NtSOVABi as any,
    },
    staking: {
      address: '0x0a440C27decD34dBb02754e9Ec00d3d3d38a4083',
      abi: StakingABI as any,
    },
    timelock: {
      address: '0x341E466029931697B26ac1B7d53be67aD0a7d062',
      abi: TimelockABI as any,
    },
    governorAlpha: {
      address: '0xC5b9612959F4228f9a2161815533804380C6D322',
      abi: GovernorAlphaABI as any,
    },
  },
};
