import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

const selectDomain = (state: RootState) => state.stakePage || initialState;

export const selectStakePage = createSelector(
  [selectDomain],
  stakePageState => stakePageState,
);
