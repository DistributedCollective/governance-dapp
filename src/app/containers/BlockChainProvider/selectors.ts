import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

const selectDomain = (state: RootState) =>
  state.blockChainProvider || initialState;

export const selectBlockChainProvider = createSelector(
  [selectDomain],
  blockChainProviderState => blockChainProviderState,
);
