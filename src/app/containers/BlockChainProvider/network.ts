import Web3 from 'web3';
import ContractClass, { EventData, Contract } from 'web3-eth-contract';
import { RevertInstructionError } from 'web3-core-helpers';
import { walletService } from '@sovryn/react-wallet';
import { web3Wallets } from '@sovryn/wallet';
import { AbiItem, toWei } from 'web3-utils';
import {
  ContractName,
  IContract,
  INetworkToContract,
  NetworkName,
  TransactionType,
} from './types';
import { contracts } from './contracts';
import { store } from '../../../store/store';
import { actions } from './slice';
import { getContract } from '../../../utils/helpers';
import { CHAIN_NAME } from './classifiers';

interface SendTxOptions {
  type?: TransactionType;
}

class Network {
  public web3: Web3 = null as any;
  public wsWeb3: Web3 = null as any;
  public writeWeb3: Web3 = null as any;
  public contracts: {} = {};
  public wsContracts: {} = {};
  public writeContracts: { [key: string]: Contract } = {};

  private _network: NetworkName = null as any;
  private _writeNetwork: NetworkName = null as any;

  public setWeb3(web3: Web3, network: NetworkName) {
    this.web3 = web3;
    if (this._network !== network) {
      this._network = network;
      for (const contractName of Object.keys(
        contracts[network] as INetworkToContract,
      )) {
        const { address, abi } = contracts[network][contractName];
        this.contracts[contractName] = this.makeContract(web3, {
          address,
          abi,
        });
      }
    }
  }

  public setWsWeb3(
    web3: Web3,
    network: NetworkName,
    isWebsocket: boolean = false,
  ) {
    this.wsWeb3 = web3;

    if (isWebsocket) {
      const provider = this.wsWeb3.currentProvider as any;

      for (const contractName of Object.keys(
        contracts[network] as INetworkToContract,
      )) {
        const { address, abi } = contracts[network][contractName];
        this.wsContracts[contractName] = this.makeContract(web3, {
          address,
          abi,
        });
      }

      provider.on('end', () => {
        provider.removeAllListeners('end');
        this.wsWeb3 = undefined as any;
      });
    }
  }

  /**
   * @deprecated
   * @param web3
   * @param network
   */
  public setWriteWeb3(web3: Web3, network: NetworkName) {
    this.writeWeb3 = web3;

    this.writeWeb3.eth.extend({
      methods: [
        {
          name: 'chainId',
          call: 'eth_chainId',
          outputFormatter: (this.writeWeb3.utils as any).hexToNumber,
        },
      ],
    });

    if (this._writeNetwork !== network) {
      this._writeNetwork = network;
      for (const contractName of Object.keys(
        contracts[network] as INetworkToContract,
      )) {
        const { address, abi } = contracts[network][contractName];
        this.writeContracts[contractName] = this.makeContract(web3, {
          address,
          abi,
        });
      }
    }
  }

  public async nonce(address: string): Promise<number> {
    return this.web3.eth.getTransactionCount(address);
  }

  public async blockNumber(): Promise<number> {
    return this.web3.eth.getBlockNumber();
  }

  public async call(
    contractName: ContractName,
    methodName: string,
    args: Array<any>,
    account?: string,
  ): Promise<string | RevertInstructionError> {
    return this.contracts[contractName].methods[methodName](...args).call({
      from: account,
    });
  }

  public async callCustomContract(
    contractAddress: string,
    abi: any,
    methodName: string,
    args: Array<any>,
  ) {
    const contract = new this.web3.eth.Contract(abi, contractAddress);
    return contract.methods[methodName](...args).call();
  }

  public async estimateGas(
    contractName: ContractName,
    methodName: string,
    args: Array<any>,
    nonce: number,
  ) {
    const { address, abi } = getContract(contractName);
    return this.estimateCustomGas(address, abi, methodName, args, nonce);
  }

  public async estimateCustomGas(
    address: string,
    abi: AbiItem[] | AbiItem,
    methodName: string,
    args: Array<any>,
    nonce: number,
  ) {
    let params = args;
    // let options = {};
    if (args && args.length && typeof args[args.length - 1] === 'object') {
      params = args.slice(0, -1);
      // options = args[args.length - 1]; // contains "from"
    }
    const options = {
      gasPrice: toWei('0.06', 'gwei'),
      to: address.toLowerCase(),
      from: walletService.address.toLowerCase(),
      nonce,
      data: this.getCustomContract({ address, abi })
        .methods[methodName](...params)
        .encodeABI(),
    };
    return new Promise<number>(resolve =>
      this.web3.eth.estimateGas(options).then(value => resolve(value)),
    );
  }

  public async send(
    contractName: ContractName,
    methodName,
    args: any[],
    sendTxOptions?: SendTxOptions,
  ) {
    const { address, abi } = contracts[CHAIN_NAME][contractName];
    return this.sendCustomContract(
      address,
      abi,
      methodName,
      args,
      sendTxOptions,
    );
  }

  public async sendCustomContract(
    contractAddress: string,
    abi: AbiItem[] | AbiItem | any,
    methodName,
    args: any[],
    sendTxOptions?: SendTxOptions,
  ) {
    let params = args;
    // let options = {};
    if (args && args.length && typeof args[args.length - 1] === 'object') {
      params = args.slice(0, -1);
      // options = args[args.length - 1]; // contains "from"
    }
    return new Promise<string>(async (resolve, reject) => {
      const data = this.getCustomContract({ address: contractAddress, abi })
        .methods[methodName](...params)
        .encodeABI();

      const nonce = await this.nonce(walletService.address.toLowerCase());

      const gasLimit = await this.estimateCustomGas(
        contractAddress,
        abi,
        methodName,
        params,
        nonce,
      );

      try {
        const signedTxOrTransactionHash = await walletService.signTransaction({
          to: contractAddress.toLowerCase(),
          value: '0',
          data: data,
          gasPrice: toWei('0.06', 'gwei'),
          nonce,
          gasLimit: String(gasLimit),
          chainId: walletService.chainId,
        });

        // Browser wallets (extensions) signs and broadcasts transactions themselves
        if (web3Wallets.includes(walletService.providerType!)) {
          store.dispatch(
            actions.addTransaction({
              transactionHash: signedTxOrTransactionHash,
              to: contractAddress,
              type: sendTxOptions?.type,
            }),
          );
          resolve(signedTxOrTransactionHash);
        } else {
          // Broadcast signed transaction and retrieve txHash.
          return network.web3.eth
            .sendSignedTransaction(signedTxOrTransactionHash)
            .once('transactionHash', tx => {
              store.dispatch(
                actions.addTransaction({
                  transactionHash: tx,
                  to: contractAddress,
                  type: sendTxOptions?.type,
                }),
              );
              resolve(tx);
            })
            .catch(e => reject(e));
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  public async getPastEvents(
    contractName: ContractName,
    eventName: string,
    filter: any = undefined,
    fromBlock: number = 0,
    toBlock: number | 'latest' = 'latest',
  ): Promise<EventData[]> {
    if (!this.wsContracts.hasOwnProperty(contractName)) {
      console.log('no ws contract for', contractName, eventName);
      return Promise.resolve([]);
    }

    return this.wsContracts[contractName].getPastEvents(eventName, {
      fromBlock,
      toBlock,
      filter,
    });
  }

  protected makeContract(web3: Web3, contractConfig: IContract) {
    return new web3.eth.Contract(contractConfig.abi, contractConfig.address);
  }

  protected getContract(contractName: ContractName) {
    const { address, abi } = contracts[CHAIN_NAME][contractName];
    return this.getCustomContract({ address, abi });
  }

  protected getCustomContract({ address, abi }: IContract) {
    address = address.toLowerCase();
    if (!this.writeContracts.hasOwnProperty(address)) {
      // @ts-ignore wrong typings for contract?
      this.writeContracts[address] = new ContractClass(abi, address);
    }
    return this.writeContracts[address];
  }
}

export const network = new Network();
