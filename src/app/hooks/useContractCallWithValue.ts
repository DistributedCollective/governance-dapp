import { useEffect, useState } from 'react';
import { ContractName } from 'app/containers/BlockChainProvider/types';
import { useContractCall } from './useContractCall';

export function useContractCallWithValue(
  contractName: ContractName,
  methodName: string,
  defaultValue: string | any = '0',
  ...args: any
) {
  const { value, loading, error } = useContractCall(
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
