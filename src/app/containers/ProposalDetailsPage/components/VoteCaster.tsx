import React, { useCallback, useState } from 'react';
import { useIsConnected } from '../../../hooks/useIsConnected';
import { LinkToExplorer } from '../../../components/LinkToExplorer';
import { network } from '../../BlockChainProvider/network';
import { useAccount } from '../../../hooks/useAccount';
import { useContractCall } from '../../../hooks/useContractCall';
import { numberFromWei, kFormatter } from 'utils/helpers';
import { ContractName } from '../../BlockChainProvider/types';
import { Proposal } from 'types/Proposal';
import { useStaking_getPriorVotes } from '../../../hooks/staking/useStaking_getPriorVotes';

interface Props {
  proposalId: number;
  contractName: ContractName;
  voutesAgainst: number;
  proposal: Proposal;
  voutesFor: number;
}

export function VoteCaster(props: Props) {
  const isConnected = useIsConnected();
  const account = useAccount();

  const receipt = useContractCall(
    props.contractName || 'governorAdmin',
    'getReceipt',
    undefined,
    props.proposalId,
    account,
  );

  const votesCurrent = useStaking_getPriorVotes(
    account,
    props.proposal.startBlock,
    Number(props.proposal.startTime),
  );

  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState('');

  const handleVote = useCallback(
    async (support: boolean) => {
      setLoading(true);
      const tx = await network.send(
        props.contractName || 'governorAdmin',
        'castVote',
        [props.proposalId, support, { from: account }],
        { type: 'vote' },
      );
      setTxHash(tx);
      setLoading(false);
    },
    [account, props.proposalId, props.contractName],
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
      <div className="xl:flex items-center justify-between mt-20">
        {d.support ? (
          <div className="tracking-normal vote__success rounded-xl bg-turquoise bg-opacity-30 bg-opacity-30 mb-4 xl:mb-0 border xl:px-12 px-3 py-3 text-center xl:text-lg text-sm text-turquoise border-turquoise">
            You Voted {kFormatter(numberFromWei(d.votes))}
          </div>
        ) : (
          <div className="tracking-normal vote__danger rounded-xl bg-red border xl:px-12 px-3 py-3 text-center xl:text-lg text-sm text-red border-red">
            {kFormatter(numberFromWei(d.votes))} Votes Against
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="xl:flex items-center justify-between mt-10">
      <button
        className="tracking-normal vote__success w-full xl:w-auto bg-turquoise focus:bg-opacity-50 hover:bg-opacity-40 focus:outline-none transition duration-500 ease-in-out bg-opacity-30 rounded-xl mb-4 xl:mb-0 border xl:px-12 px-3 py-3 text-center xl:text-lg text-sm text-turquoise border-turquoise"
        type="button"
        onClick={() => handleVote(true)}
      >
        {kFormatter(numberFromWei(votesCurrent.value || 0))} Votes For
      </button>
      <button
        className="tracking-normal vote__danger w-full xl:w-auto bg-red focus:bg-opacity-50 hover:bg-opacity-40 focus:outline-none transition duration-500 ease-in-out bg-opacity-30 rounded-xl border xl:px-12 px-3 py-3 text-center xl:text-lg text-sm text-red border-red"
        type="button"
        onClick={() => handleVote(false)}
      >
        {kFormatter(numberFromWei(votesCurrent.value || 0))} Votes Against
      </button>
    </div>
  );
}
