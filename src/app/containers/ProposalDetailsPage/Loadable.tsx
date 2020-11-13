/**
 * Asynchronously loads the component for ProposalDetailsPage
 */

import { lazyLoad } from 'utils/loadable';

export const ProposalDetailsPage = lazyLoad(
  () => import('./index'),
  module => module.ProposalDetailsPage,
);
