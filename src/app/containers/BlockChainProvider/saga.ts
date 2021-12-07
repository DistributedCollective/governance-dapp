import {
  call,
  put,
  takeLatest,
  takeEvery,
  take,
  select,
} from 'redux-saga/effects';
import { eventChannel, END } from 'redux-saga';
import BlockTracker from 'eth-block-tracker-es5';
import { actions } from './slice';
import Web3 from 'web3';
import { network } from './network';
import { PayloadAction } from '@reduxjs/toolkit';
import { ChainId } from './types';
import { rpcNodes, wssNodes } from './classifiers';
import { selectBlockChainProvider } from './selectors';
import { TransactionReceipt } from 'web3-core';

function* setupSaga({ payload }: PayloadAction<ChainId>) {
  const web3Provider = new Web3.providers.HttpProvider(rpcNodes[payload], {
    keepAlive: true,
  });

  const web3WsProvider = new Web3.providers.WebsocketProvider(
    wssNodes[payload],
    {
      timeout: 5,
      reconnectDelay: 10,
    },
  );
  const web3 = new Web3(web3Provider);
  const wsWeb3 = new Web3(web3WsProvider);

  network.setWeb3(web3, payload === 30 ? 'mainnet' : 'testnet');
  network.setWsWeb3(wsWeb3, payload === 30 ? 'mainnet' : 'testnet', true);

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

// start block watcher
function createBlockPollChannel({ interval, web3 }) {
  return eventChannel(emit => {
    web3.currentProvider.sendAsync = web3.currentProvider.send;
    const blockTracker = new BlockTracker({
      provider: web3.currentProvider,
      pollingInterval: interval,
    });

    blockTracker.on('block', block => {
      console.log('got block', Number(block.number));
      emit(actions.blockReceived(block.number));
      emit(actions.processBlock(block));
    });

    blockTracker.start().catch(error => {
      emit(actions.blockFailed(error.message));
      emit(END);
    });

    return () => {
      blockTracker.stop().catch(_ => {
        // BlockTracker assumes there is an outstanding event subscription.
        // However for our tests we start and stop a BlockTracker in succession
        // that triggers an error.
      });
    };
  });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function* callCreateBlockPollChannel() {
  const web3 = network.wsWeb3;
  const blockChannel = yield call(createBlockPollChannel, {
    web3,
    interval: 10000,
  });

  try {
    while (true) {
      const event = yield take(blockChannel);
      yield put(event);
    }
  } finally {
    blockChannel.close();
  }
}

function* processBlock({ payload }: PayloadAction<any>) {
  const block = payload;
  try {
    const { address, transactionStack } = yield select(
      selectBlockChainProvider,
    );

    const txs = block.transactions;
    let hasChanges = false;

    if (txs.length > 0) {
      for (let i = 0; i < txs.length; i++) {
        const from = (txs[i].from || '').toLowerCase();
        const to = (txs[i].to || '').toLowerCase();
        const hash: string = txs[i].hash || '';

        if (transactionStack.includes(hash)) {
          const receipt: TransactionReceipt = yield call(
            network.web3.eth.getTransactionReceipt,
            hash,
          );
          if (receipt?.status) {
            hasChanges = true;
          }
          yield put(
            actions.updateTransactionStatus({
              transactionHash: hash,
              status: receipt.status ? 'confirmed' : 'failed',
            }),
          );
        }

        const hasContract = Object.values(network.contracts).find(contract => {
          const address = (contract as any).options.address.toLowerCase();
          return address === from || address === to;
        });

        if (hasContract) {
          hasChanges = true;
        }

        if (
          address &&
          (address.toLowerCase() === from || address.toLowerCase() === from)
        ) {
          hasChanges = true;
        }
      }
    }

    if (hasChanges) {
      yield put(actions.reSync(block.number));
    }
  } catch (error) {
    console.error('Error in block processing:');
    console.error(error);
    // yield put({ type: 'BLOCK_FAILED', error });
  }
}

function createBlockChannels({ web3 }) {
  return eventChannel(emit => {
    const blockEvents = web3.eth
      .subscribe('newBlockHeaders', (error, result) => {
        if (error) {
          emit(actions.blockFailed(error.message));

          console.error('Error in block header subscription:');
          console.error(error);

          emit(END);
        }
      })
      .on('data', blockHeader => {
        emit(actions.blockReceived(blockHeader));
        // emit({
        //   type: 'BLOCK_RECEIVED',
        //   blockHeader,
        //   web3,
        //   syncAlways,
        // });
      })
      .on('error', error => {
        emit(actions.blockFailed(error.message));
        // emit({ type: 'BLOCKS_FAILED', error });
        emit(END);
      });

    return () => {
      blockEvents.off();
    };
  });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function* callCreateBlockChannels() {
  const web3 = network.wsWeb3;
  const blockChannel = yield call(createBlockChannels, { web3 });

  try {
    while (true) {
      const event = yield take(blockChannel);
      yield put(event);
    }
  } finally {
    blockChannel.close();
  }
}

// used with ws channel
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function* processBlockHeader(event) {
  const blockNumber = event.payload.number;
  const web3 = network.web3;

  try {
    const block = yield call(web3.eth.getBlock, blockNumber, true);
    yield call(processBlock, {
      type: actions.processBlock.type,
      payload: block,
    });
  } catch (error) {
    console.error('Error in block processing:');
    console.error(error);
  }
}

// end block watcher

export function* blockChainProviderSaga() {
  yield takeLatest(actions.setup.type, setupSaga);
  // yield takeLatest(actions.setupCompleted.type, callCreateBlockChannels);
  // yield takeEvery(actions.blockReceived.type, processBlockHeader); // when using ws channel
  yield takeLatest(actions.setupCompleted.type, callCreateBlockPollChannel);
  yield takeEvery(actions.processBlock.type, processBlock); // when using poll channel
}
