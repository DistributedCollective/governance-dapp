import { IContractNetworks } from './types';
import GovernorAdminABI from './abi/GovernorAdmin.json';
import StakingABI from './abi/Staking.json';
import SovTokenABI from './abi/SOV.json';
import VestingRegistryABI from './abi/VestingRegistry.json';

export const contracts: IContractNetworks = {
  testnet: {
    sovToken: {
      address: '0x6a9A07972D07e58F0daf5122d11E069288A375fb',
      abi: SovTokenABI as any,
    },
    staking: {
      address: '0xc37A85e35d7eECC82c4544dcba84CF7E61e1F1a3',
      abi: StakingABI as any,
    },
    governorAdmin: {
      address: '0x1528f0341a1Ea546780caD690F54b4FBE1834ED4',
      abi: GovernorAdminABI as any,
    },
    governorOwner: {
      address: '0x058FD3F6a40b92b311B49E5e3E064300600021D7',
      abi: GovernorAdminABI as any,
    },
    vestingRegistry: {
      address: '0x80ec7ADd6CC1003BBEa89527ce93722e1DaD5c2a',
      abi: VestingRegistryABI as any,
    },
    vestingRegistry2: {
      address: '0x310006E356b0818C3Eaf86a9B2f13013d4691a1c',
      abi: VestingRegistryABI as any,
    },
    vestingRegistry3: {
      address: '0x52E4419b9D33C6e0ceb2e7c01D3aA1a04b21668C',
      abi: VestingRegistryABI as any,
    },
  },
  mainnet: {
    sovToken: {
      address: '0xEFc78fc7d48b64958315949279Ba181c2114ABBd',
      abi: SovTokenABI as any,
    },
    staking: {
      address: '0x5684a06CaB22Db16d901fEe2A5C081b4C91eA40e',
      abi: StakingABI as any,
    },
    governorAdmin: {
      address: '0xfF25f66b7D7F385503D70574AE0170b6B1622dAd',
      abi: GovernorAdminABI as any,
    },
    governorOwner: {
      address: '0x6496DF39D000478a7A7352C01E0E713835051CcD',
      abi: GovernorAdminABI as any,
    },
    vestingRegistry: {
      address: '0x80B036ae59B3e38B573837c01BB1DB95515b7E6B',
      abi: VestingRegistryABI as any,
    },
    vestingRegistry2: {
      address: '0x0a9bDbf5e104a30fb4c99f6812FB85B60Fd8D372',
      abi: VestingRegistryABI as any,
    },
    vestingRegistry3: {
      address: '0x14F3FE332e21Ef3f5d244C45C8D5fbFcEF2FB5c9',
      abi: VestingRegistryABI as any,
    },
  },
};
