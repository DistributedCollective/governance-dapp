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
    dispatch(actions.setup(31));
  }, [dispatch]);

  if (!blockChainProvider.setupCompleted) {
    return <PageSkeleton />;
  }

  return <>{props.children}</>;
}
