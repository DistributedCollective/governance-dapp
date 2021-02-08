import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import { Header } from '../../components/Header/Loadable';
import { Footer } from '../../components/Footer/Loadable';
import { network } from '../BlockChainProvider/network';
import { Proposal } from '../../../types/Proposal';
import { ProposalRow } from '../ProposalRow/Loadable';
import { governance_proposalCount } from '../BlockChainProvider/requests/governance';

export function HomePage() {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Proposal[]>([]);
  const [total, setTotal] = useState<number>(0);
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
        const item = ((await network.call('governorAlpha', 'proposals', [
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
      height: 45px;
    }
    thead tr,
    .table-header:not(.sub-header) {
      height: 40px;
      th {
        font-weight: 300;
        color: white;
        font-size: 16px;
        padding: 0 22px;
        height: 45px;
      }
    }
    tbody {
      tr {
        &:nth-child(odd) {
          td {
            background-color: #282828;

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
              border-radius: 6px 0 0 6px;
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
        padding: 0 30px;
        color: white;
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
            <h2 className="text-white text-center pt-5 pb-8">
              SOVRYN Bitocracy
            </h2>
            <h2 className="font-semibold mb-2">Governance Proposals</h2>
          </div>
        </div>
        <div className="container">
          <div className="bg-gray-light rounded-b shadow">
            {!loading && total === 0 && (
              <>
                <div className="flex justify-between items-center w-full space-x-4 py-5 px-5">
                  <i>No proposals yet.</i>
                </div>
              </>
            )}
            {loading && !items.length ? (
              <>
                <div className="rounded-lg border sovryn-table pt-1 pb-3 pr-3 pl-3 mb-5 ">
                  <div className="flex justify-between items-center w-full space-x-4 py-5 px-5">
                    <div className="w-full skeleton h-4" />
                    <div className="w-full skeleton h-4" />
                  </div>
                  <div className="flex justify-between items-center w-full space-x-4 py-5 px-5">
                    <div className="w-full skeleton h-4" />
                    <div className="w-full skeleton h-4" />
                  </div>
                  <div className="flex justify-between items-center w-full space-x-4 py-5 px-5">
                    <div className="w-full skeleton h-4" />
                    <div className="w-full skeleton h-4" />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="rounded-lg border sovryn-table pt-1 pb-3 pr-3 pl-3 mb-5 ">
                  <StyledTable className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left">Title</th>
                        <th className="text-right hidden md:table-cell">
                          Start Block
                        </th>
                        <th className="text-right hidden md:table-cell">
                          Vote Weight
                        </th>
                        <th className="text-right hidden md:table-cell">
                          Voting Ends
                        </th>
                        <th className="text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="mt-5">
                      {items.map(item => (
                        <ProposalRow key={item.id} proposal={item} />
                      ))}
                    </tbody>
                  </StyledTable>
                </div>
              </>
            )}
            {total > items.length && (
              <div className="text-center">
                <Link
                  to="/proposals"
                  className="inline-block text-center px-3 py-2 text-lg font-light hover:text-gold hover:no-underline"
                >
                  View All Proposals
                </Link>
              </div>
            )}
          </div>

          <h2 className="font-semibold mb-2 mt-4">Top addresses</h2>
          <div className="bg-gray-light rounded-b shadow">
            <>
              <div className="rounded-lg border sovryn-table pt-1 pb-3 pr-3 pl-3 mb-5 ">
                <StyledTable className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left">Rank</th>
                      <th className="text-right">Voting Address</th>
                      <th className="text-right hidden md:table-cell">
                        Delegated Voting Power
                      </th>
                      <th className="text-right hidden md:table-cell">
                        Vote Weight
                      </th>
                      <th className="text-right hidden md:table-cell">
                        Proposals Voted
                      </th>
                      <th className="text-right hidden md:table-cell">
                        Proposals Submitted
                      </th>
                    </tr>
                  </thead>
                  <tbody className="mt-5 font-montserrat">
                    <tr>
                      <td>
                        <div className="username flex items-center">
                          <div>01</div>
                          <div>
                            <svg
                              width="38px"
                              height="38px"
                              viewBox="0 0 38 38"
                              className="ml-3 mr-3"
                            >
                              <circle
                                r="19px"
                                fill="white"
                                cx="19px"
                                cy="19px"
                              />
                            </svg>
                          </div>
                          <div>Username</div>
                        </div>
                      </td>
                      <td className="text-right">1A1z….vfNa</td>
                      <td className="text-right hidden md:table-cell">
                        100,000,000
                      </td>
                      <td className="text-right hidden md:table-cell">
                        112.32%
                      </td>
                      <td className="text-right hidden md:table-cell">3</td>
                      <td className="text-right hidden md:table-cell">1</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="username flex items-center">
                          <div>02</div>
                          <div>
                            <svg
                              width="38px"
                              height="38px"
                              viewBox="0 0 38 38"
                              className="ml-3 mr-3"
                            >
                              <circle
                                r="19px"
                                fill="white"
                                cx="19px"
                                cy="19px"
                              />
                            </svg>
                          </div>
                          <div>Username</div>
                        </div>
                      </td>
                      <td className="text-right">1A1z….vfNa</td>
                      <td className="text-right hidden md:table-cell">
                        100,000,000
                      </td>
                      <td className="text-right hidden md:table-cell">
                        112.32%
                      </td>
                      <td className="text-right hidden md:table-cell">3</td>
                      <td className="text-right hidden md:table-cell">1</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="username flex items-center">
                          <div>03</div>
                          <div>
                            <svg
                              width="38px"
                              height="38px"
                              viewBox="0 0 38 38"
                              className="ml-3 mr-3"
                            >
                              <circle
                                r="19px"
                                fill="white"
                                cx="19px"
                                cy="19px"
                              />
                            </svg>
                          </div>
                          <div>Username</div>
                        </div>
                      </td>
                      <td className="text-right">1A1z….vfNa</td>
                      <td className="text-right hidden md:table-cell">
                        100,000,000
                      </td>
                      <td className="text-right hidden md:table-cell">
                        112.32%
                      </td>
                      <td className="text-right hidden md:table-cell">3</td>
                      <td className="text-right hidden md:table-cell">1</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="username flex items-center">
                          <div>04</div>
                          <div>
                            <svg
                              width="38px"
                              height="38px"
                              viewBox="0 0 38 38"
                              className="ml-3 mr-3"
                            >
                              <circle
                                r="19px"
                                fill="white"
                                cx="19px"
                                cy="19px"
                              />
                            </svg>
                          </div>
                          <div>Username</div>
                        </div>
                      </td>
                      <td className="text-right">1A1z….vfNa</td>
                      <td className="text-right hidden md:table-cell">
                        100,000,000
                      </td>
                      <td className="text-right hidden md:table-cell">
                        112.32%
                      </td>
                      <td className="text-right hidden md:table-cell">3</td>
                      <td className="text-right hidden md:table-cell">1</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="username flex items-center">
                          <div>05</div>
                          <div>
                            <svg
                              width="38px"
                              height="38px"
                              viewBox="0 0 38 38"
                              className="ml-3 mr-3"
                            >
                              <circle
                                r="19px"
                                fill="white"
                                cx="19px"
                                cy="19px"
                              />
                            </svg>
                          </div>
                          <div>Username</div>
                        </div>
                      </td>
                      <td className="text-right">1A1z….vfNa</td>
                      <td className="text-right hidden md:table-cell">
                        100,000,000
                      </td>
                      <td className="text-right hidden md:table-cell">
                        112.32%
                      </td>
                      <td className="text-right hidden md:table-cell">3</td>
                      <td className="text-right hidden md:table-cell">1</td>
                    </tr>
                    <tr>
                      <td colSpan={6}>
                        <div className="flex justify-center items-center">
                          <div className="w-2 h-2 bg-white rounded-full mx-1"></div>
                          <div className="w-2 h-2 bg-white rounded-full mx-1"></div>
                          <div className="w-2 h-2 bg-white rounded-full mx-1"></div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="username flex items-center">
                          <div>21</div>
                          <div>
                            <svg
                              width="38px"
                              height="38px"
                              viewBox="0 0 38 38"
                              className="ml-3 mr-3"
                            >
                              <circle
                                r="19px"
                                fill="white"
                                cx="19px"
                                cy="19px"
                              />
                            </svg>
                          </div>
                          <div>Username</div>
                        </div>
                      </td>
                      <td className="text-right">1A1z….vfNa</td>
                      <td className="text-right hidden md:table-cell">
                        100,000,000
                      </td>
                      <td className="text-right hidden md:table-cell">
                        112.32%
                      </td>
                      <td className="text-right hidden md:table-cell">3</td>
                      <td className="text-right hidden md:table-cell">1</td>
                    </tr>
                  </tbody>
                </StyledTable>
              </div>
            </>

            <div className="text-center mb-5">
              <Link
                to="/leaderboard"
                className="inline-block text-center px-3 py-2 text-lg font-light hover:text-gold hover:no-underline"
              >
                View Leaderboard
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
