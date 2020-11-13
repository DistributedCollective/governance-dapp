import { AbiItem } from 'web3-utils';

/* --- STATE --- */
export interface BlockChainProviderState {
  network: NetworkName;
  chainId: ChainId;
  setupCompleted: boolean;
  connected: boolean;
  connecting: boolean;
  address: string;
}

export type NetworkName = keyof IContractNetworks;
export type ChainId = 30 | 31;

export type ContainerState = BlockChainProviderState;

export interface IContractNetworks {
  mainnet: INetworkToContract;
  testnet: INetworkToContract;
}

export interface INetworkToContract {
  sovToken: IContract;
  staking: IContract;
  timelock: IContract;
  governorAlpha: IContract;
}

export interface IContract {
  address: string;
  abi: AbiItem[] | AbiItem;
}

export type ContractName = keyof INetworkToContract;
