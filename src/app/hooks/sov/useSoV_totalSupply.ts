import { useContractCallWithValue } from '../useContractCallWithValue';

export function useSoV_totalSupply() {
  return useContractCallWithValue('sovToken', 'totalSupply', '0');
}
