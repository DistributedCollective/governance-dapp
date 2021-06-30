import { useEffect, useState } from 'react';
import { ContractName } from '../containers/BlockChainProvider/types';
import { Proposal } from '../../types/Proposal';
import { aggregate } from '@makerdao/multicall';
import { isMainnet } from 'utils/helpers';

const configTestnet = {
  rpcUrl: 'https://public-node.testnet.rsk.co',
  multicallAddress: '0x9e469e1fc7fb4c5d17897b68eaf1afc9df39f103',
};

const configMainnet = {
  rpcUrl: 'https://public-node.rsk.co',
  multicallAddress: '0x6c62bf5440de2cb157205b15c424bceb5c3368f5',
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
            target: '0x1528f0341a1Ea546780caD690F54b4FBE1834ED4',
            call: ['proposalCount()(uint256)'],
            returns: [
              ['BALANCE_OF_GOVERNOR_ADMIN', val => (adminItemsCount = val)],
            ],
          },
          {
            target: '0x058FD3F6a40b92b311B49E5e3E064300600021D7',
            call: ['proposalCount()(uint256)'],
            returns: [
              ['BALANCE_OF_GOVERNOR_OWNER', val => (ownerItemsCount = val)],
            ],
          },
        ],
        isMainnet ? configMainnet : configTestnet,
      );

      setTotal(adminItemsCount + ownerItemsCount);

      const adminItems = await getProposalsOf(
        'governorAdmin',
        '0x1528f0341a1Ea546780caD690F54b4FBE1834ED4',
        adminItemsCount,
        page,
        limit,
      );

      const ownerItems = await getProposalsOf(
        'governorOwner',
        '0x058FD3F6a40b92b311B49E5e3E064300600021D7',
        ownerItemsCount,
        page,
        limit,
      );

      const merged = [...adminItems, ...ownerItems].sort(
        (a, b) => b.startBlock - a.startBlock,
      );

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

  await aggregate(calls, isMainnet ? configMainnet : configTestnet);

  return result;
}
