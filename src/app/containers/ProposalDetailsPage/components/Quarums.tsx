import { network } from 'app/containers/BlockChainProvider/network';
import { MergedProposal } from 'app/hooks/useProposalList';
import { bignumber } from 'mathjs';
import React, { useEffect, useMemo, useState } from 'react';
import { kFormatter } from 'utils/helpers';

interface IQuarumsProps {
  proposal?: MergedProposal;
}

export const Quarums: React.FC<IQuarumsProps> = ({ proposal }) => {
  const [loading, setLoading] = useState(true);
  const [totalVotingPower, setTotalVotingPower] = useState('0');

  useEffect(() => {
    if (proposal?.startBlock && proposal?.startTime) {
      setLoading(true);
      network
        .call('staking', 'getPriorTotalVotingPower', [
          proposal.startBlock,
          proposal.startTime,
        ])
        .then(response => {
          setTotalVotingPower(response as string);
          setLoading(false);
        });
    }
  }, [proposal?.startTime, proposal?.startBlock]);

  const supportNeeded = useMemo(
    () =>
      bignumber(proposal?.majorityPercentage || 0)
        .div(totalVotingPower)
        .mul(100)
        .toFixed(9),
    [proposal, totalVotingPower],
  );

  const vpNeeded = useMemo(
    () =>
      bignumber(proposal?.quorum || 0)
        .div(totalVotingPower)
        .mul(100)
        .toFixed(9),
    [proposal, totalVotingPower],
  );

  const votesCast = useMemo(
    () =>
      bignumber(proposal?.forVotes || 0)
        .add(proposal?.againstVotes || 0)
        .toString(),
    [proposal],
  );

  const forPercent = useMemo(
    () =>
      bignumber(proposal?.forVotes || 0)
        .div(votesCast)
        .mul(100)
        .toFixed(9),
    [proposal, votesCast],
  );

  const votedPercent = useMemo(
    () => bignumber(votesCast).div(totalVotingPower).mul(100).toFixed(2),
    [votesCast, totalVotingPower],
  );

  const outcome = useMemo(() => {
    if (
      bignumber(forPercent).greaterThan(supportNeeded) &&
      bignumber(votesCast).greaterThan(proposal?.quorum || 0)
    ) {
      return 'Will succeed';
    }
    return 'Will be defeated.';
  }, [proposal, forPercent, supportNeeded, votesCast]);

  if (loading || !proposal) {
    return <div className="skeleton">Loading, please wait...</div>;
  }

  return (
    <>
      <p className="text-gold text-sm tracking-normal leading-3 pt-3">
        Support Required: &gt;{Number(supportNeeded).toFixed(2)}%
      </p>
      <p className="text-gold text-sm tracking-normal leading-3 pt-3">
        VP needed for quorum: &gt;{kFormatter(Number(proposal.quorum) / 1e18)}{' '}
        (&gt;{Number(vpNeeded).toFixed(2)}%)
      </p>
      <p className="text-gold text-sm tracking-normal leading-3 pt-3">
        VP turnout: {kFormatter(Number(votesCast) / 1e18)} ({votedPercent}%)
      </p>
      <p className="text-gold text-sm tracking-normal leading-3 pt-3">
        Current outcome: {outcome}
      </p>
    </>
  );
};
