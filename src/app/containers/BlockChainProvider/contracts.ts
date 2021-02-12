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
      address: '0x462Ac951756EE704e5116F247071D2663A41fF9d',
      abi: TimelockABI as any,
    },
    governorAlpha: {
      address: '0xE8276A1680CB970c2334B3201044Ddf7c492F52A',
      abi: GovernorAlphaABI as any,
    },
  },
  mainnet: {
    sovToken: {
      address: '0xEFc78fc7d48b64958315949279Ba181c2114ABBd',
      abi: ERC20TokenABI as any,
    },
    ntSovToken: {
      address: '0xEFc78fc7d48b64958315949279Ba181c2114ABBd',
      abi: NtSOVABi as any,
    },
    staking: {
      address: '0x5684a06CaB22Db16d901fEe2A5C081b4C91eA40e',
      abi: StakingABI as any,
    },
    timelock: {
      address: '0x462Ac951756EE704e5116F247071D2663A41fF9d',
      abi: TimelockABI as any,
    },
    governorAlpha: {
      address: '0xC7A1637b37190a456b017897207bceb2A29f19b9',
      abi: GovernorAlphaABI as any,
    },
  },
};
