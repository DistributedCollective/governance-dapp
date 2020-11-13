import { Unit } from 'web3-utils';
import { toWei } from 'utils/helpers';

export function useWeiAmount(amount: any, unit: Unit = 'ether') {
  return toWei(amount, unit);
}
