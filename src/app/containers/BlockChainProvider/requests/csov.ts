import { network } from '../network';

export function csov_delegate(address: string, account) {
  return network.send('ntSovToken', 'delegate', [address, { from: account }], {
    type: 'delegate',
  });
}
