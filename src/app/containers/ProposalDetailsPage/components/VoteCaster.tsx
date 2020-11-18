import React, { useCallback, useState } from 'react';
import { useIsConnected } from '../../../hooks/useIsConnected';
import { LinkToExplorer } from '../../../components/LinkToExplorer';
import { network } from '../../BlockChainProvider/network';
import { useAccount } from '../../../hooks/useAccount';
import { useContractCall } from '../../../hooks/useContractCall';
import { numberFromWei } from '../../../../utils/helpers';

interface Props {
  proposalId: number;
}

export function VoteCaster(props: Props) {
  const isConnected = useIsConnected();
  const account = useAccount();

  const receipt = useContractCall(
    'governorAlpha',
    'getReceipt',
    props.proposalId,
    account,
  );

  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState('');

  const handleVote = useCallback(
    async (support: boolean) => {
      setLoading(true);
      const tx = await network.send('governorAlpha', 'castVote', [
        props.proposalId,
        support,
        { from: account },
      ]);
      setTxHash(tx);
      setLoading(false);
    },
    [account, props.proposalId],
  );

  if (!isConnected || receipt.loading) {
    return <></>;
  }

  if (txHash) {
    return (
      <div className="bg-gray-900 text-white px-3 py-2 w-2/3">
        <div className="text-xs text-gray-500">Vote Cast</div>
        <div className={`truncate text-sm ${loading && 'skeleton'}`}>
          <LinkToExplorer txHash={txHash} className="text-white" />
        </div>
      </div>
    );
  }

  if ((receipt?.value as any)?.hasVoted) {
    const d = receipt.value as any;
    return (
      <div className="bg-gray-900 text-white px-3 py-2 w-2/3">
        <div className="text-xs text-gray-500">You voted</div>
        <div className={`truncate text-sm ${loading && 'skeleton'}`}>
          {numberFromWei(d.votes).toLocaleString()} votes -{' '}
          {d.support ? 'For' : 'Against'}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white px-3 py-2 w-2/3">
      <div className="flex flex-row space-x-4 justify-between items-center">
        <button
          className="block px-3 py-2 bg-green-500 w-1/2"
          type="button"
          onClick={() => handleVote(true)}
        >
          Vote For
        </button>
        <button
          className="block px-3 py-2 bg-gray-500 w-1/2"
          type="button"
          onClick={() => handleVote(false)}
        >
          Vote Against
        </button>
      </div>
    </div>
  );
}
