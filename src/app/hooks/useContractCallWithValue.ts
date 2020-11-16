import { useEffect, useState } from 'react';
import { ContractName } from 'app/containers/BlockChainProvider/types';
import { useContractCall } from './useContractCall';

export function useContractCallWithValue<T = string>(
  contractName: ContractName,
  methodName: string,
  defaultValue: T | any = '0',
  ...args: any
): { value: T; loading: boolean; error: string | null } {
  const { value, loading, error } = useContractCall<T>(
    contractName,
    methodName,
    ...args,
  );

  const [fixedValue, setFixedValue] = useState(
    value !== null ? value : defaultValue,
  );

  useEffect(() => {
    setFixedValue(value !== null ? value : defaultValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, JSON.stringify(defaultValue)]);

  return { value: fixedValue, loading, error };
}
