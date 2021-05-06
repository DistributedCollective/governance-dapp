import { IContractNetworks } from './types';
import GovernorAdminABI from './abi/GovernorAdmin.json';
import StakingABI from './abi/Staking.json';
import SovTokenABI from './abi/SOV.json';
import VestingRegistryABI from './abi/VestingRegistry.json';
import feeSharingProxyAbi from './abi/FeeSharingProxy.json';
import tokenAbi from './abi/abiTestToken.json';
import CSOVTokenAbi from './abi/CSOVToken.json';
import abiTestWBRTCToken from './abi/abiTestWBRTCToken.json';
import priceFeedsAbi from './abi/priceFeedAbi.json';
import SwapNetworkABI from './abi/SovrynSwapNetwork.json';

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
    feeSharingProxy: {
      address: '0x740E6f892C0132D659Abcd2B6146D237A4B6b653',
      abi: feeSharingProxyAbi as any,
    },
    DOC_token: {
      address: '0xCB46c0ddc60D18eFEB0E586C17Af6ea36452Dae0',
      abi: tokenAbi as any,
    },
    RBTC_token: {
      address: '0x69FE5cEC81D5eF92600c1A0dB1F11986AB3758Ab',
      abi: abiTestWBRTCToken as any,
    },
    USDT_token: {
      address: '0x4d5a316d23ebe168d8f887b4447bf8dbfa4901cc',
      abi: tokenAbi as any,
    },
    BPRO_token: {
      address: '0x4da7997a819bb46b6758b9102234c289dd2ad3bf',
      abi: tokenAbi as any,
    },
    SOV_token: {
      address: '0x6a9A07972D07e58F0daf5122d11E069288A375fb',
      abi: tokenAbi as any,
    },
    CSOV_token: {
      address: '0x75bbf7f4d77777730eE35b94881B898113a93124',
      abi: CSOVTokenAbi as any,
    },
    CSOV2_token: {
      address: '0x1dA260149ffee6fD4443590ee58F65b8dC2106B9',
      abi: CSOVTokenAbi as any,
    },
    priceFeed: {
      address: '0x7f38c422b99075f63C9c919ECD200DF8d2Cf5BD4',
      abi: priceFeedsAbi as any,
    },
    swapNetwork: {
      address: '0x61172B53423E205a399640e5283e51FE60EC2256',
      abi: SwapNetworkABI as any,
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
    feeSharingProxy: {
      address: '0x12B1B0C67d9A771EB5Db7726d23fdc6848fd93ef',
      abi: feeSharingProxyAbi as any,
    },
    DOC_token: {
      address: '0xe700691da7b9851f2f35f8b8182c69c53ccad9db',
      abi: tokenAbi as any,
    },
    RBTC_token: {
      address: '0x542fDA317318eBF1d3DEAf76E0b632741A7e677d',
      abi: abiTestWBRTCToken as any,
    },
    USDT_token: {
      address: '0xef213441a85df4d7acbdae0cf78004e1e486bb96',
      abi: tokenAbi as any,
    },
    BPRO_token: {
      address: '0x440cd83c160de5c96ddb20246815ea44c7abbca8',
      abi: tokenAbi as any,
    },
    SOV_token: {
      address: '0xEFc78fc7d48b64958315949279Ba181c2114ABBd',
      abi: tokenAbi as any,
    },
    CSOV_token: {
      address: '0x0106F2fFBF6A4f5DEcE323d20E16E2037E732790',
      abi: CSOVTokenAbi as any,
    },
    CSOV2_token: {
      address: '0x7f7Dcf9DF951C4A332740e9a125720DA242A34ff',
      abi: CSOVTokenAbi as any,
    },
    priceFeed: {
      address: '0x437AC62769f386b2d238409B7f0a7596d36506e4',
      abi: priceFeedsAbi as any,
    },
    swapNetwork: {
      address: '0x98aCE08D2b759a265ae326F010496bcD63C15afc',
      abi: SwapNetworkABI as any,
    },
    vestingRegistry3: {
      address: '0x14F3FE332e21Ef3f5d244C45C8D5fbFcEF2FB5c9',
      abi: VestingRegistryABI as any,
    },
  },
};
