/**
 * Asynchronously loads the component for NotFoundPage
 */

import { lazyLoad } from 'utils/loadable';

export const ProposalListItem = lazyLoad(
  () => import('./index'),
  module => module.ProposalListItem,
);
