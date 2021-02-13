import { network } from '../network';

export function csov_delegate(address: string, account) {
  return network.send('staking', 'delegate', [address, { from: account }], {
    type: 'delegate',
  });
}
