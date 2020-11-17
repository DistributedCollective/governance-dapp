import Web3 from 'web3';
import { EventData } from 'web3-eth-contract';
import { RevertInstructionError } from 'web3-core-helpers';
import {
  ContractName,
  IContract,
  INetworkToContract,
  NetworkName,
} from './types';
import { contracts } from './contracts';
import { store } from '../../../store/store';
import { actions } from './slice';
import { getContract } from '../../../utils/helpers';
import { DEFAULT_CHAIN } from './index';

class Network {
  public web3: Web3 = null as any;
  public writeWeb3: Web3 = null as any;
  public contracts: {} = {};
  public writeContracts: {} = {};

  private _network: NetworkName = null as any;
  private _writeNetwork: NetworkName = null as any;

  public setWeb3(
    web3: Web3,
    network: NetworkName,
    isWebsocket: boolean = false,
  ) {
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

    if (isWebsocket) {
      const provider = this.web3.currentProvider as any;

      provider.on('end', () => {
        provider.removeAllListeners('end');
        this.contracts = {};
        this.web3 = undefined as any;
        store.dispatch(actions.setup(DEFAULT_CHAIN));
      });
    }
  }

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

  public async call(
    contractName: ContractName,
    methodName: string,
    args: Array<any>,
  ): Promise<string | RevertInstructionError> {
    return this.contracts[contractName].methods[methodName](...args).call();
  }

  public async send(contractName: ContractName, methodName, ...args) {
    let params = args;
    let options = {};
    if (args && args.length && typeof args[args.length - 1] === 'object') {
      params = args.slice(0, -1);
      options = args[args.length - 1];
    }
    return new Promise<string>((resolve, reject) => {
      return this.writeContracts[contractName].methods[methodName](...params)
        .send(options)
        .once('transactionHash', tx => {
          store.dispatch(
            actions.addTransaction({
              transactionHash: tx,
              to: getContract(contractName).address,
            }),
          );
          resolve(tx);
        })
        .catch(e => {
          console.log('rejecting');
          reject(e);
        });
    });
  }

  public async getPastEvents(
    contractName: ContractName,
    eventName: string,
    filter: any = undefined,
    fromBlock: number = 0,
    toBlock: number | 'latest' = 'latest',
  ): Promise<EventData[]> {
    return this.contracts[contractName].getPastEvents(eventName, {
      fromBlock,
      toBlock,
      filter,
    });
  }

  protected makeContract(web3: Web3, contractConfig: IContract) {
    return new web3.eth.Contract(contractConfig.abi, contractConfig.address);
  }
}

export const network = new Network();
