import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { actions } from 'app/containers/BlockChainProvider/slice';
import { Footer } from '../../components/Footer/Loadable';
import { network } from '../BlockChainProvider/network';
import { Proposal } from '../../../types/Proposal';
import { ProposalRow } from '../ProposalRow/Loadable';
import {
  governance_proposalCount,
  governance_propose,
} from '../BlockChainProvider/requests/governance';
import { selectBlockChainProvider } from '../BlockChainProvider/selectors';
import { Header } from 'app/components/Header';

export function HomePage() {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Proposal[]>([]);
  const [total, setTotal] = useState<number>(0);
  const dispatch = useDispatch();
  const { connected, address } = useSelector(selectBlockChainProvider);
  useEffect(() => {
    setLoading(true);

    const get = async () => {
      const proposalCount = await governance_proposalCount();
      let to = 0;
      if (proposalCount > 3) {
        to = proposalCount - 3;
      }
      const items: Proposal[] = [];
      for (let index = proposalCount; index > to; index--) {
        const item = ((await network.call('governorAdmin', 'proposals', [
          index,
        ])) as unknown) as Proposal;
        items.push(item);
      }
      setItems(items);
      setLoading(false);
      setTotal(proposalCount);
    };

    get().then().catch();
  }, []);

  const StyledTable = styled.table`
    font-weight: 100;
    width: 100%;
    font-size: 14px;
    font-family: 'Work Sans';

    &.sovryn-table-mobile {
      font-size: 12px;
      @media (max-width: 335px) {
        font-size: 11px;
      }
    }
    .table-header div {
      font-weight: 300;
      color: white;
      font-size: 16px;
      padding: 0 22px;
      height: 43px;
    }
    thead tr,
    .table-header:not(.sub-header) {
      height: 40px;
      th {
        font-weight: 300;
        color: white;
        font-size: 16px;
        padding: 0 50px;
        height: 45px;
        line-height: 16px;
        letter-spacing: 0;
      }
    }
    tbody {
      tr {
        td {
          background-color: #1f1f1f;

          &:first-child {
            border-radius: 6px 0 0 6px;
          }

          &:last-child {
            border-radius: 0 6px 6px 0;
          }

          &:only-child {
            border-radius: 6px;
          }
        }
        &:nth-child(odd) {
          td {
            background-color: #1f1f1f;
          }
        }
        &:nth-child(even) {
          td {
            background-color: #181818;
          }
        }
      }
    }
    &.table-small {
      thead tr {
        height: 30px;
        th {
          height: 30px;
          padding: 0 20px;
        }
      }
      tbody tr {
        height: 30px;
        td {
          padding: 0 20px;
        }
        &:nth-child(even) {
          td {
            background-color: #101010;
            &:first-child {
              border-radius: 8px 0 0 6=8px;
            }

            &:last-child {
              border-radius: 0 6px 6px 0;
            }

            &:only-child {
              border-radius: 6px;
            }
          }
        }
      }
    }
    tbody tr,
    .mobile-row {
      height: 80px;

      td {
        padding: 10px 40px;
        color: white;
        font-size: 15px;
        line-height: 27px;
        &:first-child {
          a {
            display: none;
          }
        }
        a {
          color: #fec004;
        }
      }

      &:first-of-type {
        border-top: none;
      }

      &.table-header {
        height: 60%;

        > td {
          font-weight: 300;
          color: white;
          font-size: 16px;
          height: 45px;
          padding-top: 20px;
        }
      }
    }
    .mobile-row {
      align-content: center;
    }
  `;

  const createProposal = useCallback(async () => {
    const nextId = (await governance_proposalCount()) + 1;
    await governance_propose(
      ['0xc37A85e35d7eECC82c4544dcba84CF7E61e1F1a3'],
      ['0'],
      ['setWeightScaling(uint96)'],
      ['0x0000000000000000000000000000000000000000000000000000000000000004'],
      `testing: set weight scaling to 4 ${nextId}`,
      address,
    );
  }, [address]);

  return (
    <>
      <Helmet>
        <title>SOVRYN Bitocracy</title>
        <meta name="description" content="SOVRYN Bitocracy" />
      </Helmet>
      <Header />
      <main>
        <div>
          <div className="container">
            <div className="flex justify-end">
              {connected && address && (
                <>
                  <button
                    className="rounded-md bg-gold bg-opacity-10 focus:outline-none focus:bg-opacity-50 hover:bg-opacity-40 transition duration-500 ease-in-out border px-5 py-2 text-md text-gold border-gold"
                    onClick={() =>
                      dispatch(actions.toggleDelagationDialog(true))
                    }
                  >
                    Delegate Votes
                  </button>
                  <button
                    className="rounded-md bg-gold bg-opacity-10 focus:outline-none focus:bg-opacity-50 hover:bg-opacity-40 transition duration-500 ease-in-out border px-5 py-2 text-md text-gold border-gold"
                    onClick={() => createProposal()}
                  >
                    Make test proposal
                  </button>
                </>
              )}
            </div>
            <h2 className="text-white text-center pt-5 pb-8 tracking-normal">
              SOVRYN Bitocracy
            </h2>
            <h2 className="font-semibold mb-2 tracking-normal">
              Governance Proposals
            </h2>
          </div>
        </div>
        <div className="container">
          <div className="bg-gray-light rounded-b shadow">
            {loading && !items.length ? (
              <>
                <div className="rounded-lg border sovryn-table pt-1 pb-3 pr-3 pl-3 mb-5 ">
                  <div className="flex justify-between items-center w-full space-x-4 py-5 px-5">
                    <div className="w-full skeleton h-4" />
                    <div className="w-full skeleton h-4" />
                    <div className="w-full skeleton h-4" />
                    <div className="w-full skeleton h-4" />
                    <div className="w-full skeleton h-4" />
                  </div>
                  <div className="flex justify-between items-center w-full space-x-4 py-5 px-5">
                    <div className="w-full skeleton h-4" />
                    <div className="w-full skeleton h-4" />
                    <div className="w-full skeleton h-4" />
                    <div className="w-full skeleton h-4" />
                    <div className="w-full skeleton h-4" />
                  </div>
                  <div className="flex justify-between items-center w-full space-x-4 py-5 px-5">
                    <div className="w-full skeleton h-4" />
                    <div className="w-full skeleton h-4" />
                    <div className="w-full skeleton h-4" />
                    <div className="w-full skeleton h-4" />
                    <div className="w-full skeleton h-4" />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="rounded-lg bg-gray-lighter border sovryn-table pt-1 pb-3 pr-3 pl-3 mb-5 ">
                  <StyledTable className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left">Title</th>
                        <th className="text-center hidden xl:table-cell">
                          Start Block
                        </th>
                        <th className="text-center hidden xl:table-cell">
                          Vote Weight
                        </th>
                        <th className="text-center hidden xl:table-cell">
                          Voting Ends
                        </th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="mt-5">
                      {!loading && total === 0 && (
                        <tr>
                          <td colSpan={99}>
                            <i>No proposals yet.</i>
                          </td>
                        </tr>
                      )}
                      {items.map(item => (
                        <ProposalRow key={item.id} proposal={item} />
                      ))}
                    </tbody>
                  </StyledTable>
                </div>
              </>
            )}
            {total > items.length && (
              <div className="text-center mb-5">
                <Link
                  to="/proposals"
                  className="inline-block text-center px-3 py-2 text-lg font-light hover:text-gold hover:no-underline tracking-normal"
                >
                  View All Proposals
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
