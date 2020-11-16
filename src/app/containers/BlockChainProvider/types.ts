import { AbiItem } from 'web3-utils';

/* --- STATE --- */
export interface BlockChainProviderState {
  network: NetworkName;
  chainId: ChainId;
  setupCompleted: boolean;
  connected: boolean;
  connecting: boolean;
  address: string;
  governanceContractConfig: GovernanceContractConfig;
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

export interface GovernanceContractConfig {
  proposalMaxOperations: number;
  votingDelay: number;
  votingPeriod: number;
  proposalThreshold: number;
  quorumVotes: number;
}

export type ContractName = keyof INetworkToContract;
