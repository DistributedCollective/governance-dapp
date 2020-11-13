// import Rsk from '@rsksmart/rsk3';
import { useSelector } from 'react-redux';
import { selectBlockChainProvider } from '../containers/BlockChainProvider/selectors';

export function useAccount() {
  const { address } = useSelector(selectBlockChainProvider);
  return !!address ? address : '';
  // return !!address ? Rsk.utils.toChecksumAddress(address) : '';
}
