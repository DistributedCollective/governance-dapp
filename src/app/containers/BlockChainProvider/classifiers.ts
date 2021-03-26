import { ChainId } from './types';

export const rpcNodes = {
  30: 'https://public-node.rsk.co',
  31: 'https://testnet.sovryn.app/rpc',
};

export const wssNodes = {
  30: 'wss://mainnet.sovryn.app/ws',
  31: 'wss://testnet.sovryn.app/ws',
};

export const rpcBackupNodes = {
  30: 'https://public-node.rsk.co',
  31: 'https://public-node.testnet.rsk.co',
};

export const blockExplorers = {
  30: 'https://explorer.rsk.co',
  31: 'https://explorer.testnet.rsk.co',
};

// Block time in seconds
export const blockTime = 30;

export const CHAIN_ID = Number(process.env.REACT_APP_CHAIN_ID || 31) as ChainId;
