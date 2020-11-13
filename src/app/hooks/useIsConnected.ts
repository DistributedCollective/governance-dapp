import { useSelector } from 'react-redux';
import { selectBlockChainProvider } from '../containers/BlockChainProvider/selectors';

export function useIsConnected() {
  const { connected, address } = useSelector(selectBlockChainProvider);
  return connected && !!address;
}
