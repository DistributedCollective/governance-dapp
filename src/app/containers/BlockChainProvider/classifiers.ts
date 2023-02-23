import { ChainId } from './types';

export const rpcNodes = {
  30: 'https://rsk-live.sovryn.app/rpc',
  31: 'https://testnet.sovryn.app/rpc',
};

export const wssNodes = {
  30: 'wss://mainnet.sovryn.app/websocket',
  31: 'wss://testnet.sovryn.app/websocket',
};

export const blockExplorers = {
  30: 'https://explorer.rsk.co',
  31: 'https://explorer.testnet.rsk.co',
};

// Block time in seconds
export const blockTime = 30;

export const CHAIN_ID = Number(process.env.REACT_APP_CHAIN_ID || 31) as ChainId;
export const CHAIN_NAME = CHAIN_ID === 30 ? 'mainnet' : 'testnet';
