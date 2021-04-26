import { AbiItem } from 'web3-utils';

/* --- STATE --- */
export interface BlockChainProviderState {
  network: NetworkName;
  chainId: ChainId;
  setupCompleted: boolean;
  governanceContractConfig: GovernanceContractConfig;
  blockNumber: number;
  syncBlockNumber: number;
  transactionStack: string[];
  transactions: Transactions;
  showTransactions: boolean;
  showDelegationDialog: boolean;
  vestingType: string;
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
  governorAdmin: IContract;
  governorOwner: IContract;
  vestingRegistry: IContract;
  vestingRegistry2: IContract;
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

export interface Transactions {
  [transactionHash: string]: Transaction;
}

export type TransactionStatus = 'pending' | 'confirmed' | 'failed';
export type TransactionType =
  | 'approve'
  | 'stake'
  | 'withdraw'
  | 'extend'
  | 'propose'
  | 'execute'
  | 'cancel'
  | 'queue'
  | 'vote'
  | 'delegate'
  | undefined;

export interface Transaction {
  transactionHash: string;
  to: string;
  status: TransactionStatus;
  type?: TransactionType;
}

export type ContractName = keyof INetworkToContract;
