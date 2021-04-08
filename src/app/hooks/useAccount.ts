import { useWalletContext } from '@sovryn/react-wallet';

export function useAccount() {
  const { address, connected } = useWalletContext();
  return connected && !!address ? address.toLowerCase() : '';
}
