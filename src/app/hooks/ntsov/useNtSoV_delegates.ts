import { useContractCallWithValue } from '../useContractCallWithValue';
import { useAccount } from '../useAccount';

export function useNtSoV_delegates() {
  return useContractCallWithValue('ntSovToken', 'delegates', '0', useAccount());
}
