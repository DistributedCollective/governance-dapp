/**
 *
 * Asynchronously loads the component for ProposalRow
 *
 */

import { lazyLoad } from 'utils/loadable';

export const ProposalRow = lazyLoad(
  () => import('./index'),
  module => module.ProposalRow,
);
