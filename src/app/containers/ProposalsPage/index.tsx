import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Header } from '../../components/Header/Loadable';
import { Footer } from '../../components/Footer/Loadable';
import { network } from '../BlockChainProvider/network';
import {
  Proposal,
  ProposalCreatedEvent,
  RowProposal,
} from '../../../types/Proposal';
import { RowSkeleton } from '../../components/PageSkeleton';
import { ProposalListItem } from '../../components/ProposalListItem/Loadable';

export function ProposalsPage() {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<RowProposal[]>([]);
  const [, /*total*/ setTotal] = useState<number>(0);
  useEffect(() => {
    setLoading(true);

    const get = async () => {
      const proposalCount = ((await network.call(
        'governorAlpha',
        'proposalCount',
        [],
      )) as unknown) as number;
      let to = 0;
      if (proposalCount > 25) {
        to = proposalCount - 25;
      }
      const items: RowProposal[] = [];
      for (let index = proposalCount; index > to; index--) {
        const item = ((await network.call('governorAlpha', 'proposals', [
          index,
        ])) as unknown) as Proposal;
        const events = await network.getPastEvents(
          'governorAlpha',
          'ProposalCreated',
          { id: item.id },
          item.startBlock - 1,
          item.endBlock,
        );
        const event = events[0].returnValues as ProposalCreatedEvent;
        items.push({ ...item, description: event.description });
      }
      setItems(items);
      setLoading(false);
      setTotal(proposalCount);
    };

    get().then().catch();
  }, []);
  return (
    <>
      <Helmet>
        <title>Proposals</title>
      </Helmet>
      <Header />
      <main>
        <div className="bg-black">
          <div className="container">
            <Link to="/" className="block text-white pt-8 pb-6">
              &lt; Overview
            </Link>
            <h2 className="text-white pb-8">Governance Proposals</h2>

            <div className="bg-white rounded-t shadow p-3">
              <h4 className="font-bold">All Proposals</h4>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="bg-white rounded-b shadow">
            {loading && (
              <div className="px-5 py-2">
                <RowSkeleton />
                <RowSkeleton />
                <RowSkeleton />
              </div>
            )}
            {items.map(item => (
              <ProposalListItem key={item.id} {...item} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
