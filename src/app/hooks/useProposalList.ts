import { useEffect, useState } from 'react';
import { ContractName } from '../containers/BlockChainProvider/types';
import { Proposal } from '../../types/Proposal';
import { aggregate } from '@makerdao/multicall';
import { getContract } from 'utils/helpers';
import {
  CHAIN_ID,
  rpcNodes,
} from 'app/containers/BlockChainProvider/classifiers';

const hideExperimentalProposals: Array<[ContractName, number]> = [];

const config = {
  rpcUrl: rpcNodes[CHAIN_ID],
  multicallAddress: getContract('multicall').address,
};

export interface MergedProposal extends Proposal {
  contractName: ContractName;
}

export function useProposalList(page: number, limit: number = 0) {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<MergedProposal[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);

    const get = async () => {
      let adminItemsCount = 0;
      let ownerItemsCount = 0;

      await aggregate(
        [
          {
            target: getContract('governorAdmin').address,
            call: ['proposalCount()(uint256)'],
            returns: [
              [
                'BALANCE_OF_GOVERNOR_ADMIN',
                val => (adminItemsCount = val.toNumber()),
              ],
            ],
          },
          {
            target: getContract('governorOwner').address,
            call: ['proposalCount()(uint256)'],
            returns: [
              [
                'BALANCE_OF_GOVERNOR_OWNER',
                val => (ownerItemsCount = val.toNumber()),
              ],
            ],
          },
        ],
        config,
      );

      setTotal(adminItemsCount + ownerItemsCount);

      const adminPromise = getProposalsOf(
        'governorAdmin',
        getContract('governorAdmin').address,
        adminItemsCount,
        page,
        limit,
      );

      const ownerPromise = getProposalsOf(
        'governorOwner',
        getContract('governorOwner').address,
        ownerItemsCount,
        page,
        limit,
      );

      const [adminItems, ownerItems] = await Promise.all([
        adminPromise,
        ownerPromise,
      ]);

      const merged = [...adminItems, ...ownerItems]
        .sort((a, b) => b.startBlock - a.startBlock)
        .filter(item => {
          const ids = hideExperimentalProposals
            .filter(cc => cc[0] === item.contractName)
            .map(item => item[1]);
          if (ids.length) {
            return !ids.includes(item.id);
          }
          return true;
        });

      if (limit) {
        return merged.slice(0, limit);
      }

      return merged;
    };

    get()
      .then(result => {
        setItems(result);
        setLoading(false);
      })
      .catch(_ => setLoading(false));
  }, [limit, page]);

  return {
    items,
    loading,
    total,
  };
}

async function getProposalsOf(
  contractName: ContractName,
  contractAddress: string,
  count: number,
  page: number,
  limit: number = 0,
) {
  let from = count - (page * limit - limit);
  if (from < 0) {
    from = 0;
  }

  let to = from - limit;
  if (to < 0) {
    to = 0;
  }

  let result: MergedProposal[] = [];

  const calls: any[] = [];

  for (let index = from; index > to; index--) {
    const item: MergedProposal = {
      contractName: contractName,
      id: -100,
      proposer: '',
      eta: 0,
      startBlock: 0,
      endBlock: 0,
      startTime: 0,
      forVotes: '0',
      againstVotes: '0',
      quorum: '0',
      canceled: false,
      executed: false,
      majorityPercentage: '0',
    };

    calls.push({
      target: contractAddress,
      call: [
        'proposals(uint256)(uint256, uint32, uint32, uint96, uint96, uint96, uint96, uint64, uint64, bool, bool, address)',
        index,
      ],
      returns: [
        ['id', val => (item.id = val.toNumber())],
        ['startBlock', val => (item.startBlock = val)],
        ['endBlock', val => (item.endBlock = val)],
        ['forVotes', val => (item.forVotes = val.toString())],
        ['againstVotes', val => (item.againstVotes = val.toString())],
        ['quorum', val => (item.quorum = val.toString())],
        ['majorityPercentage'],
        ['eta', val => (item.eta = val.toNumber())],
        ['startTime', val => (item.startTime = val.toNumber())],
        ['canceled', val => (item.canceled = val)],
        ['executed', val => (item.executed = val)],
        ['proposer', val => (item.proposer = val)],
      ],
    });

    result.push(item);
  }

  await aggregate(calls, config);

  return result;
}
