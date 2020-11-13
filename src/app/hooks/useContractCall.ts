import { useEffect, useState } from 'react';
import { ContractName } from 'app/containers/BlockChainProvider/types';
import { network } from '../containers/BlockChainProvider/network';

interface ContractCallResponse {
  value: string | null;
  loading: boolean;
  error: string | null;
}

export function useContractCall(
  contractName: ContractName,
  methodName: string,
  ...args: any
): ContractCallResponse {
  const [state, setState] = useState<any>({
    value: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));

    try {
      network
        .call(contractName, methodName, args)
        .then(value => {
          setState(prevState => ({
            ...prevState,
            value,
            loading: false,
            error: null,
          }));
        })
        .catch(error => {
          // todo add logger?
          // silence...
          console.error(error);
          setState(prevState => ({
            ...prevState,
            loading: false,
            value: null,
            error,
          }));
        });
    } catch (error) {
      // todo add winston logger?
      setState(prevState => ({
        ...prevState,
        loading: false,
        value: null,
        error,
      }));
    }

    return () => {
      // todo: find a way to cancel contract call
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractName, methodName, JSON.stringify(args)]);

  return state;
}
