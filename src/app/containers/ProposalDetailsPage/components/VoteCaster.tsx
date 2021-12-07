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
import { Popover2 } from '@blueprintjs/popover2';

interface Props {
  proposalId: number;
  contractName: ContractName;
  votesAgainst: string;
  proposal: Proposal;
  votesFor: string;
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
      <div className="text-white px-3 py-2 w-2/3 mt-2">
        <div className="text-xs text-gray-500">Vote Cast</div>
        <div className={`truncate text-sm ${loading && 'skeleton'}`}>
          <LinkToExplorer
            txHash={txHash}
            className="text-white hover:text-gold"
          />
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
            You Voted {kFormatter(numberFromWei(d.votes))} for
          </div>
        ) : (
          <div className="tracking-normal vote__danger rounded-xl bg-red bg-opacity-30 border xl:px-12 px-3 py-3 text-center xl:text-lg text-sm text-red border-red">
            You Voted {kFormatter(numberFromWei(d.votes))} against
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="xl:flex items-center justify-between mt-10">
      <Popover2
        interactionKind="hover"
        minimal={true}
        placement="top"
        popoverClassName="bp3-tooltip2"
        content={
          <>
            You will cast {kFormatter(numberFromWei(votesCurrent.value || 0))}{' '}
            votes for
          </>
        }
      >
        <p className="text-gold p-0 m-0 duration-300 hover:opacity-70 transition cursor-pointer">
          <button
            className="tracking-normal vote__success w-full xl:w-auto bg-turquoise focus:bg-opacity-50 hover:bg-opacity-40 focus:outline-none transition duration-500 ease-in-out bg-opacity-30 rounded-xl mb-4 xl:mb-0 border xl:px-12 px-3 py-3 text-center xl:text-lg text-sm text-turquoise border-turquoise"
            type="button"
            onClick={() => handleVote(true)}
          >
            Vote For
          </button>
        </p>
      </Popover2>
      <Popover2
        interactionKind="hover"
        minimal={true}
        placement="top"
        popoverClassName="bp3-tooltip2"
        content={
          <>
            You will cast {kFormatter(numberFromWei(votesCurrent.value || 0))}{' '}
            votes against
          </>
        }
      >
        <p className="text-gold p-0 m-0 duration-300 hover:opacity-70 transition cursor-pointer">
          <button
            className="tracking-normal vote__danger w-full xl:w-auto bg-red focus:bg-opacity-50 hover:bg-opacity-40 focus:outline-none transition duration-500 ease-in-out bg-opacity-30 rounded-xl border xl:px-12 px-3 py-3 text-center xl:text-lg text-sm text-red border-red"
            type="button"
            onClick={() => handleVote(false)}
          >
            Vote Against
          </button>
        </p>
      </Popover2>
    </div>
  );
}
