import { AbiItem } from 'web3-utils';
import { contracts } from '../app/containers/BlockChainProvider/contracts';

export type ContractName = keyof typeof contracts;
export type ContractData = { [contractName: string]: ContractItemData };
export type ContractItemData = {
  address: string;
  abi: AbiItem | AbiItem[] | any;
  blockNumber: number;
};
