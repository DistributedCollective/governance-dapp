import React, { useCallback, useState } from 'react';
import { useIsConnected } from '../../../hooks/useIsConnected';
import { LinkToExplorer } from '../../../components/LinkToExplorer';
import { network } from '../../BlockChainProvider/network';
import { useAccount } from '../../../hooks/useAccount';
import { useContractCall } from '../../../hooks/useContractCall';
import { numberFromWei, kFormatter } from 'utils/helpers';

interface Props {
  proposalId: number;
  voutesAgainst: number;
  voutesFor: number;
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
      const tx = await network.send(
        'governorAlpha',
        'castVote',
        [props.proposalId, support, { from: account }],
        { type: 'vote' },
      );
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
    <div className="xl:flex items-center justify-between mt-10">
      <button
        className="vote__success w-full xl:w-auto bg-turquoise focus:bg-opacity-50 hover:bg-opacity-40 focus:outline-none transition duration-500 ease-in-out bg-opacity-10 rounded-xl mb-4 xl:mb-0 border xl:px-10 px-3 py-3 text-center xl:text-lg text-sm text-turquoise border-turquoise"
        type="button"
        onClick={() => handleVote(true)}
      >
        {kFormatter(numberFromWei(props.voutesFor || 0))} Votes For
      </button>
      <button
        className="vote__danger w-full xl:w-auto bg-red focus:bg-opacity-50 hover:bg-opacity-40 focus:outline-none transition duration-500 ease-in-out bg-opacity-10 rounded-xl border xl:px-10 px-3 py-3 text-center xl:text-lg text-sm text-red border-red"
        type="button"
        onClick={() => handleVote(false)}
      >
        {kFormatter(numberFromWei(props.voutesAgainst || 0))} Votes Against
      </button>
    </div>
  );
}
