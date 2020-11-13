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
