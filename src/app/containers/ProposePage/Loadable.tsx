/**
 * Asynchronously loads the component for ProposePage
 */

import { lazyLoad } from 'utils/loadable';

export const ProposePage = lazyLoad(
  () => import('./index'),
  module => module.ProposePage,
);
