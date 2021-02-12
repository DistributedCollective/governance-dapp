/**
 *
 * BlockChainProvider
 *
 */

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { reducer, sliceKey, actions } from './slice';
import { selectBlockChainProvider } from './selectors';
import { blockChainProviderSaga } from './saga';
import { PageSkeleton } from '../../components/PageSkeleton';
import { TransactionHistory } from '../TransactionHistory/Loadable';
import { ChainId } from './types';
import { DelegationDialog } from './components/DelegationDialog';

interface Props {
  children: React.ReactNode;
}

export const DEFAULT_CHAIN = Number(
  process.env.REACT_APP_CHAIN_ID || 31,
) as ChainId;

export function BlockChainProvider(props: Props) {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: blockChainProviderSaga });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const blockChainProvider = useSelector(selectBlockChainProvider);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.setup(DEFAULT_CHAIN));
  }, [dispatch]);

  if (!blockChainProvider.setupCompleted) {
    return <PageSkeleton />;
  }

  return (
    <>
      <TransactionHistory />
      {blockChainProvider.connected && blockChainProvider.address && (
        <DelegationDialog />
      )}
      {props.children}
    </>
  );
}
