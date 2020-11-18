import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Header } from '../../components/Header/Loadable';
import { Footer } from '../../components/Footer/Loadable';
import { network } from '../BlockChainProvider/network';
import { Proposal } from '../../../types/Proposal';
import { ProposalRow } from '../ProposalRow/Loadable';

export function HomePage() {
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
      if (proposalCount > 3) {
        to = proposalCount - 3;
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
        <title>Home Page</title>
        <meta name="description" content="A Boilerplate application homepage" />
      </Helmet>
      <Header />
      <main>
        <div className="bg-black">
          <div className="container">
            <h2 className="text-white pt-20 pb-8">Governance Overview</h2>

            {/*<div className="flex flex-col pb-8 md:flex-row md:space-x-4">*/}
            {/*  <Link*/}
            {/*    to="/sov"*/}
            {/*    className="flex flex-row flex-no-wrap justify-between bg-gray-900 text-white p-3 w-full md:w-1/2 mb-3 md:mb-0"*/}
            {/*  >*/}
            {/*    <div>*/}
            {/*      <div className="text-white text-xl">*/}
            {/*        {(123456).toLocaleString()}*/}
            {/*      </div>*/}
            {/*      <div className="text-gray-600 text-sm">SOV Remaining</div>*/}
            {/*    </div>*/}
            {/*    <div className="flex flex-col items-end justify-center w-1/2 border-1 border-red-300">*/}
            {/*      <div className="uppercase text-sm text-green-500 font-bold">*/}
            {/*        View*/}
            {/*      </div>*/}
            {/*      <div className="mt-3 w-full">*/}
            {/*        <VoteProgress value={0} max={0} color="green" />*/}
            {/*      </div>*/}
            {/*    </div>*/}
            {/*  </Link>*/}
            {/*  <div className="flex flex-row space-x-4 w-full md:w-1/2">*/}
            {/*    <div className="d-flex bg-gray-900 text-white p-3 w-1/2">*/}
            {/*      <div className="text-white text-xl">*/}
            {/*        {(0).toLocaleString()}*/}
            {/*      </div>*/}
            {/*      <div className="text-gray-600 text-sm">Votes Delegated</div>*/}
            {/*    </div>*/}
            {/*    <div className="d-flex bg-gray-900 text-white p-3 w-1/2">*/}
            {/*      <div className="text-white text-xl">*/}
            {/*        {(0).toLocaleString()}*/}
            {/*      </div>*/}
            {/*      <div className="text-gray-600 text-sm">Voting Addresses</div>*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*</div>*/}

            <div className="bg-white rounded-t shadow p-3">
              <h4 className="font-bold">Recent Proposals</h4>
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
            {total > items.length && (
              <Link
                to="/proposals"
                className="block uppercase text-center px-3 py-2 font-bold text-sm hover:text-green-500 transition easy-in-out duration-300 border-t-1"
              >
                View All Proposals
              </Link>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
