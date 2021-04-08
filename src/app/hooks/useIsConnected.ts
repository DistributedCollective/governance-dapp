import { useWalletContext } from '@sovryn/react-wallet';

export function useIsConnected() {
  const { address, connected } = useWalletContext();
  return connected && !!address;
}
