import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Header } from '../../components/Header/Loadable';
import { Footer } from '../../components/Footer/Loadable';
import { network } from '../BlockChainProvider/network';
import { Proposal } from '../../../types/Proposal';
import { ProposalRow } from '../ProposalRow/Loadable';

export function ProposalsPage() {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Proposal[]>([]);
  const [total, setTotal] = useState<number>(0);
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
      const items: Proposal[] = [];
      for (let index = proposalCount; index > to; index--) {
        const item = ((await network.call('governorAlpha', 'proposals', [
          index,
        ])) as unknown) as Proposal;
        items.push(item);
      }
      setItems(items);
      setLoading(false);
      setTotal(Number(proposalCount));
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
            <div className="block text-white pt-8 pb-6">
              <Link
                to="/"
                className="text-white hover:no-underline hover:text-gray-500"
              >
                &lt; Proposals
              </Link>
            </div>
            <h2 className="text-white pb-8">Governance Proposals</h2>

            <div className="bg-white rounded-t shadow p-3">
              <h4 className="font-bold">All Proposals</h4>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="bg-white rounded-b shadow">
            {loading && !items.length && (
              <>
                <div className="flex justify-between items-center w-full space-x-4 py-5 px-5">
                  <div className="w-full skeleton h-4" />
                  <div className="w-full skeleton h-4" />
                </div>
              </>
            )}
            {!loading && total === 0 && (
              <>
                <div className="flex justify-between items-center w-full space-x-4 py-5 px-5">
                  <i>No proposals yet.</i>
                </div>
              </>
            )}
            {items.map(item => (
              <ProposalRow key={item.id} proposal={item} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
