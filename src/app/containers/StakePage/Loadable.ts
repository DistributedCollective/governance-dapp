/**
 *
 * Asynchronously loads the component for StakePage
 *
 */

import { lazyLoad } from 'utils/loadable';

export const StakePage = lazyLoad(
  () => import('./index'),
  module => module.StakePage,
);
