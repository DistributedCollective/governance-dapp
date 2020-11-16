import { call, put, takeLatest } from 'redux-saga/effects';
import { actions } from './slice';
import Web3 from 'web3';
import { network } from './network';
import { PayloadAction } from '@reduxjs/toolkit';
import { ChainId } from './types';
import { rpcNodes } from './classifiers';
import { walletConnection } from './web3-modal';

function* setupSaga({ payload }: PayloadAction<ChainId>) {
  const nodeUrl = rpcNodes[payload];
  let web3Provider;
  if (nodeUrl.startsWith('http')) {
    web3Provider = new Web3.providers.HttpProvider(nodeUrl, {
      keepAlive: true,
    });
  } else {
    web3Provider = new Web3.providers.WebsocketProvider(nodeUrl, {
      reconnectDelay: 10,
    });
  }
  const web3 = new Web3(web3Provider);
  network.setWeb3(web3, payload === 30 ? 'mainnet' : 'testnet');
  walletConnection.init(payload);

  // const threshold = yield call(governance_proposalThreshold);
  // const quorumVotes = yield call(governance_quorumVotes);

  const threshold = 0;
  const quorumVotes = 0;

  yield put(
    actions.setupCompleted({
      proposalThreshold: threshold,
      quorumVotes: quorumVotes,
    }),
  );
}

function* connectedSaga({ payload }: PayloadAction<{ address: string }>) {
  yield put(actions.accountChanged(payload.address));
}

function* disconnectSaga() {
  yield call([walletConnection, walletConnection.disconnect]);
}

export function* blockChainProviderSaga() {
  yield takeLatest(actions.setup.type, setupSaga);
  yield takeLatest(actions.connected.type, connectedSaga);
  yield takeLatest(actions.disconnect.type, disconnectSaga);
}
