/**
 *
 * BlockChainProvider
 *
 */

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { WalletProvider, walletService } from '@sovryn/react-wallet';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { reducer, sliceKey, actions } from './slice';
import { selectBlockChainProvider } from './selectors';
import { blockChainProviderSaga } from './saga';
import { PageSkeleton } from '../../components/PageSkeleton';
import { TransactionHistory } from '../TransactionHistory/Loadable';
import { VestingDelegationDialog } from '../../components/VestingDelegationDialog';
import { CHAIN_ID } from './classifiers';

interface Props {
  children: React.ReactNode;
}

export function BlockChainProvider(props: Props) {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: blockChainProviderSaga });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const blockChainProvider = useSelector(selectBlockChainProvider);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.setup(CHAIN_ID));
  }, [dispatch]);

  if (!blockChainProvider.setupCompleted) {
    return <PageSkeleton />;
  }

  return (
    <>
      <WalletProvider options={{ chainId: CHAIN_ID, remember: true }}>
        <TransactionHistory />
        {walletService.connected && walletService.address && (
          <VestingDelegationDialog />
        )}
        {props.children}
      </WalletProvider>
    </>
  );
}
