// import { useContractCallWithValue } from '../useContractCallWithValue';
// import { useAccount } from '../useAccount';

export function useNtSoV_delegates() {
  return { value: '0', loading: false, error: null };
  // return useContractCallWithValue('ntSovToken', 'delegates', '0', useAccount());
}
