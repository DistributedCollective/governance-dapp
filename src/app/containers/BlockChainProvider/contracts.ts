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
      address: '0x28698404bf6B243E016768782E96d5D506dB2A74',
      abi: StakingABI as any,
    },
    timelock: {
      address: '0x50104F18E59DE0a4736B15F5892Da965f24CB450',
      abi: TimelockABI as any,
    },
    governorAlpha: {
      address: '0xe23F154Bc37DfEE38A1A580d21A9107456a1BC16',
      abi: GovernorAlphaABI as any,
    },
  },
  mainnet: {
    sovToken: {
      address: '0x04fa98E97A376a086e3BcAB99c076CB249e5740D',
      abi: ERC20TokenABI as any,
    },
    staking: {
      address: '0x28698404bf6B243E016768782E96d5D506dB2A74',
      abi: StakingABI as any,
    },
    timelock: {
      address: '0x50104F18E59DE0a4736B15F5892Da965f24CB450',
      abi: TimelockABI as any,
    },
    governorAlpha: {
      address: '0xe23F154Bc37DfEE38A1A580d21A9107456a1BC16',
      abi: GovernorAlphaABI as any,
    },
  },
};
