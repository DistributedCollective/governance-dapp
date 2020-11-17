/**
 *
 * Asynchronously loads the component for TransactionHistory
 *
 */

import { lazyLoad } from 'utils/loadable';

export const TransactionHistory = lazyLoad(
  () => import('./index'),
  module => module.TransactionHistory,
);
