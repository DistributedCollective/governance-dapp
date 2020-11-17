import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ContractName } from 'app/containers/BlockChainProvider/types';
import { network } from 'app/containers/BlockChainProvider/network';
import { selectBlockChainProvider } from 'app/containers/BlockChainProvider/selectors';

export interface ContractCallResponse<T = string> {
  value: T | null;
  loading: boolean;
  error: string | null;
}

export function useContractCall<T = string>(
  contractName: ContractName,
  methodName: string,
  ...args: any
): ContractCallResponse<T> {
  const { syncBlockNumber } = useSelector(selectBlockChainProvider);
  const [state, setState] = useState<ContractCallResponse<T>>({
    value: null,
    loading: true,
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
            value: value as any,
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
  }, [contractName, methodName, JSON.stringify(args), syncBlockNumber]);

  return state;
}
