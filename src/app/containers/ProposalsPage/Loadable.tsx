/**
 * Asynchronously loads the component for ProposalsPage
 */

import { lazyLoad } from 'utils/loadable';

export const ProposalsPage = lazyLoad(
  () => import('./index'),
  module => module.ProposalsPage,
);
