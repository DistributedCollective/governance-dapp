import { ChainId } from './types';

export const rpcNodes = {
  30: 'https://public-node.rsk.co',
  31: 'https://public-node.testnet.rsk.co',
};

export const wssNodes = {
  30: 'wss://mainnet2.sovryn.app/ws',
  31: 'wss://testnet.sovryn.app/ws',
};

export const blockExplorers = {
  30: 'https://explorer.rsk.co',
  31: 'https://explorer.testnet.rsk.co',
};

// Block time in seconds
export const blockTime = 30;

export const CHAIN_ID = Number(process.env.REACT_APP_CHAIN_ID || 31) as ChainId;
export const CHAIN_NAME = CHAIN_ID === 30 ? 'mainnet' : 'testnet';
