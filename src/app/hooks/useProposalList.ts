import { useEffect, useState } from 'react';
import { network } from '../containers/BlockChainProvider/network';
import { ContractName } from '../containers/BlockChainProvider/types';
import { Proposal } from '../../types/Proposal';

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
      const admin = await getProposalsOf('governorAdmin', page, limit);
      const owner = await getProposalsOf('governorOwner', page, limit);

      const merged = [...admin.items, ...owner.items].sort(
        (a, b) => b.startBlock - a.startBlock,
      );

      setTotal(admin.count + owner.count);

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
      .catch(_ => {
        setLoading(false);
      });
  }, [page, limit]);

  return {
    items,
    loading,
    total,
  };
}

async function getProposalsOf(
  contractName: ContractName,
  page: number,
  limit: number = 0,
) {
  const count = await network
    .call(contractName, 'proposalCount', [])
    .then(e => Number(e));

  let from = count - (page * limit - limit);
  if (from < 0) {
    from = 0;
  }

  let to = from - limit;
  if (to < 0) {
    to = 0;
  }

  const items: MergedProposal[] = [];

  for (let index = from; index > to; index--) {
    const item = ((await network.call(contractName, 'proposals', [
      index,
    ])) as unknown) as Proposal;
    items.push({ ...item, contractName });
  }

  return {
    count,
    items,
  };
}
