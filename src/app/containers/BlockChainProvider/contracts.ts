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
      address: '0xC28C019C448735C47D246B9Fe25D2E87eE011c4d',
      abi: GovernorAlphaABI as any,
    },
  },
  mainnet: {
    sovToken: {
      address: '0x04fa98E97A376a086e3BcAB99c076CB249e5740D',
      abi: ERC20TokenABI as any,
    },
    staking: {
      address: '0xE25A4150d3b308B72c3f3AD053cA1E80bf4F1925',
      abi: StakingABI as any,
    },
    timelock: {
      address: '0x369652D3b156822A1e3A7e2056C95EF269339219',
      abi: TimelockABI as any,
    },
    governorAlpha: {
      address: '0xa313f5097B32B66a481E637B6bCD0f145FEf7b94',
      abi: GovernorAlphaABI as any,
    },
  },
};
