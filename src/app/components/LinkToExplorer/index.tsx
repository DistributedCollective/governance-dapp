/**
 *
 * LinkToExplorer
 *
 */
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { blockExplorers } from '../../containers/BlockChainProvider/classifiers';
import { selectBlockChainProvider } from '../../containers/BlockChainProvider/selectors';

interface Props {
  txHash: string;
  startLength: number;
  endLength: number;
  className: string;
  isAddress?: boolean;
}

export function LinkToExplorer(props: Props) {
  const handleTx = useCallback(() => {
    if (props.txHash && props.startLength && props.endLength) {
      const start = props.txHash.substr(0, props.startLength);
      const end = props.txHash.substr(-props.endLength);
      return `${start} ··· ${end}`;
    }
    return props.txHash;
  }, [props.txHash, props.startLength, props.endLength]);

  const { chainId } = useSelector(selectBlockChainProvider);

  const getUrl = useCallback(() => {
    return blockExplorers[chainId];
  }, [chainId]);

  const [txHash, setTxHash] = useState(handleTx());
  const [url, setUrl] = useState(getUrl());

  useEffect(() => {
    setTxHash(handleTx());
  }, [handleTx, props.txHash, props.startLength, props.endLength]);

  useEffect(() => {
    setUrl(getUrl());
  }, [chainId, getUrl]);

  return (
    <a
      className={props.className}
      href={`${url}/${props.isAddress ? 'address' : 'tx'}/${props.txHash}`}
      target="_blank"
      rel="noreferrer noopener"
    >
      {txHash}
    </a>
  );
}

LinkToExplorer.defaultProps = {
  startLength: 10,
  endLength: 4,
  className: 'ml-1 text-white',
};
