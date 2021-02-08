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
      address: '0x04fa98E97A376a086e3BcAB99c076CB249e5740D',
      abi: ERC20TokenABI as any,
    },
    ntSovToken: {
      address: '0xc8cBdb42Ce55bDEe96D6425396e4047eE46F2E37',
      abi: NtSOVABi as any,
    },
    staking: {
      address: '0x0a440C27decD34dBb02754e9Ec00d3d3d38a4083',
      abi: StakingABI as any,
    },
    timelock: {
      address: '0x462Ac951756EE704e5116F247071D2663A41fF9d',
      abi: TimelockABI as any,
    },
    governorAlpha: {
      address: '0xD4f5b2F1Ce0b743018F0fa71F37208f4550B48E8',
      abi: GovernorAlphaABI as any,
    },
  },
};
