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
  condition?: boolean,
  ...args: any
): ContractCallResponse<T> {
  const { syncBlockNumber } = useSelector(selectBlockChainProvider);
  const [state, setState] = useState<ContractCallResponse<T>>({
    value: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if ((condition !== undefined && condition) || condition === undefined) {
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
            console.error(contractName, methodName, args, error);
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
    } else {
      setState(prevState => ({ ...prevState, loading: false }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    contractName,
    methodName,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(args),
    syncBlockNumber,
    condition,
  ]);

  return state;
}
