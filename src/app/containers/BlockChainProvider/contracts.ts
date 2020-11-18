import { IContractNetworks } from './types';
import GovernorAlphaABI from './abi/GovernorAlpha.json';
import StakingABI from './abi/Staking.json';
import TimelockABI from './abi/Timelock.json';
import ERC20TokenABI from './abi/ERC20Token.json';

export const contracts: IContractNetworks = {
  testnet: {
    sovToken: {
      address: '0x04fa98E97A376a086e3BcAB99c076CB249e5740D',
      abi: ERC20TokenABI as any,
    },
    staking: {
      address: '0xd13248252a9540f6EE00D81Ba65d30138CcCFA5F',
      abi: StakingABI as any,
    },
    timelock: {
      address: '0x6b5b3AaBcb97135371E55bD3eF8a44713aE1841F',
      abi: TimelockABI as any,
    },
    governorAlpha: {
      address: '0x4ed7fe81ea4A7A79d7c4728380ec742507DFf850',
      abi: GovernorAlphaABI as any,
    },
  },
  mainnet: {
    sovToken: {
      address: '0x04fa98E97A376a086e3BcAB99c076CB249e5740D',
      abi: ERC20TokenABI as any,
    },
    staking: {
      address: '0xd13248252a9540f6EE00D81Ba65d30138CcCFA5F',
      abi: StakingABI as any,
    },
    timelock: {
      address: '0x6b5b3AaBcb97135371E55bD3eF8a44713aE1841F',
      abi: TimelockABI as any,
    },
    governorAlpha: {
      address: '0x4ed7fe81ea4A7A79d7c4728380ec742507DFf850',
      abi: GovernorAlphaABI as any,
    },
  },
};
