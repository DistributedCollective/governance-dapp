import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import { Button } from '@blueprintjs/core';
import { Header } from '../../components/Header/Loadable';
import { Footer } from '../../components/Footer/Loadable';
import { network } from '../BlockChainProvider/network';
import { Proposal } from '../../../types/Proposal';
import { ProposalRow } from '../ProposalRow/Loadable';
import { CustomDialog } from '../../components/CustomDialog';
import { functionsText } from './functionsText';
import { governance_proposalCount } from '../BlockChainProvider/requests/governance';

export function HomePage() {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
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

  const StyledBar = styled.div`
    width: 100%;
    max-width: 800px;
    display: flex;
    height: 32px;
    flex-wrap: nowrap;
    position: relative;
    .progress {
      &__circle {
        width: 55px;
        height: 55px;
        border-radius: 100%;
        display: block;
        position: absolute;
        top: -11px;
        bottom: 0;
        border: 10px solid white;
        transition: all 0.3s;
      }
      &__blue {
        width: 50%;
        border-radius: 24px 0 0 24px;
        background: rgb(78, 205, 196);
        background: linear-gradient(
          90deg,
          rgba(78, 205, 196, 1) 0%,
          rgba(0, 0, 0, 1) 100%
        );
      }
      &__red {
        width: 50%;
        border-radius: 0 24px 24px 0;
        background: rgb(0, 0, 0);
        background: linear-gradient(
          90deg,
          rgba(0, 0, 0, 1) 0%,
          rgba(205, 78, 78, 1) 100%
        );
      }
    }
  `;

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <Helmet>
        <title>SOVRYN Bitocracy</title>
        <meta name="description" content="SOVRYN Bitocracy" />
      </Helmet>
      <Header />
      <Button onClick={handleOpen}>Show dialog</Button>
      <CustomDialog
        show={isOpen}
        onClose={handleClose}
        content={
          <>
            <div className="flex justify-between items-start">
              <h3 className="proposal__title leading-10 font-semibold">
                SIP 0003:
                <br />
                Activation of Genesis Reservation
              </h3>
              <div className="text-right font-semibold">
                <p>
                  Voting ends: 21/02/2021 - 12.00 GMT
                  <br />
                  #3403178
                </p>
              </div>
            </div>
            <div className="flex justify-around mt-24">
              <div className="mx-3 text-right">
                <span className="text-3xl font-semibold leading-5">67.43%</span>
                <p className="text-lg font-light">1,900,000 votes</p>
              </div>
              <StyledBar>
                <div className="progress__blue"></div>
                <div className="progress__red"></div>
                <div className="progress__circle" style={{ left: '32%' }}></div>
              </StyledBar>
              <div className="mx-3">
                <span className="text-3xl font-semibold leading-5">32.57%</span>
                <p className="text-lg font-light">1,900,000 votes</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-20">
              <div className="vote__success rounded-xl border px-10 py-3 text-lg text-turquoise border-turquoise">
                You Voted 3,571K
              </div>
              <div className="vote__danger rounded-xl border  px-10 py-3 text-lg opacity-30 text-red border-red">
                3,571K Votes Against
              </div>
            </div>
            <div className="flex -mx-2 mt-8">
              <div className="rounded-xl border w-2/4 sovryn-table pt-1 pb-3 pr-3 pl-3 mx-2 overflow-y-auto h-48">
                <StyledTable className="w-full text-left table-small font-montserrat">
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Addresses</th>
                      <th>Tx Hash</th>
                      <th>Votes</th>
                    </tr>
                  </thead>
                  <tbody className="mt-5">
                    <tr>
                      <td>Loreum</td>
                      <td>1A1z….vfNa</td>
                      <td>1A1z….vfNa</td>
                      <td>3,571K</td>
                    </tr>
                    <tr>
                      <td>Loreum</td>
                      <td>1A1z….vfNa</td>
                      <td>1A1z….vfNa</td>
                      <td>3,571K</td>
                    </tr>
                    <tr>
                      <td>Loreum</td>
                      <td>1A1z….vfNa</td>
                      <td>1A1z….vfNa</td>
                      <td>3,571K</td>
                    </tr>
                    <tr>
                      <td>Loreum</td>
                      <td>1A1z….vfNa</td>
                      <td>1A1z….vfNa</td>
                      <td>3,571K</td>
                    </tr>
                    <tr>
                      <td>Loreum</td>
                      <td>1A1z….vfNa</td>
                      <td>1A1z….vfNa</td>
                      <td>3,571K</td>
                    </tr>
                    <tr>
                      <td>Loreum</td>
                      <td>1A1z….vfNa</td>
                      <td>1A1z….vfNa</td>
                      <td>3,571K</td>
                    </tr>
                    <tr>
                      <td>Loreum</td>
                      <td>1A1z….vfNa</td>
                      <td>1A1z….vfNa</td>
                      <td>3,571K</td>
                    </tr>
                  </tbody>
                </StyledTable>
              </div>

              <div className="rounded-xl border w-2/4 sovryn-table pt-1 pb-3 pr-3 pl-3 mx-2 overflow-y-auto h-48">
                <StyledTable className="w-full text-left table-small font-montserrat">
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Addresses</th>
                      <th>Tx Hash</th>
                      <th>Votes</th>
                    </tr>
                  </thead>
                  <tbody className="mt-5">
                    <tr>
                      <td>Loreum</td>
                      <td>1A1z….vfNa</td>
                      <td>1A1z….vfNa</td>
                      <td>3,571K</td>
                    </tr>
                    <tr>
                      <td>Loreum</td>
                      <td>1A1z….vfNa</td>
                      <td>1A1z….vfNa</td>
                      <td>3,571K</td>
                    </tr>
                    <tr>
                      <td>Loreum</td>
                      <td>1A1z….vfNa</td>
                      <td>1A1z….vfNa</td>
                      <td>3,571K</td>
                    </tr>
                    <tr>
                      <td>Loreum</td>
                      <td>1A1z….vfNa</td>
                      <td>1A1z….vfNa</td>
                      <td>3,571K</td>
                    </tr>
                    <tr>
                      <td>Loreum</td>
                      <td>1A1z….vfNa</td>
                      <td>1A1z….vfNa</td>
                      <td>3,571K</td>
                    </tr>
                    <tr>
                      <td>Loreum</td>
                      <td>1A1z….vfNa</td>
                      <td>1A1z….vfNa</td>
                      <td>3,571K</td>
                    </tr>
                    <tr>
                      <td>Loreum</td>
                      <td>1A1z….vfNa</td>
                      <td>1A1z….vfNa</td>
                      <td>3,571K</td>
                    </tr>
                  </tbody>
                </StyledTable>
              </div>
            </div>
            <div className="flex mt-10">
              <div className="w-3/4">
                <div className="bg-gray-100 py-8 px-20 rounded-2xl">
                  <h4 className="mb-8 font-semibold text-2xl tracking-widest">
                    Activation of Genesis Reservation
                  </h4>
                  <p className="text-sm">Resolved:</p>
                  <ol className="list-decimal text-sm pl-5 leading-6">
                    <li>
                      The Sovryn protocol will issue up to 2,000,000 cSOV
                      tokens. This represent a 200,000 increase from 1,800,000
                      of SIP 0002.
                    </li>
                    <li>
                      cSOV tokens will provide a pre-reservation mechanism for
                      community members to stake funds in order to receive the
                      right to SOV tokens, on a 1:1 basis with cSOV tokens
                      subject to a vote by SOV holders.
                    </li>
                    <li>
                      These cSOV tokens will be distributed to stakers who have
                      the early community NFTS.
                    </li>
                    <li>
                      The required stake per cSOV token will be 2500 Satoshis
                    </li>
                    <li>
                      Any cSOV tokens converted to SOV will be subject to 10
                      months linear vesting (with 1/10 of the total amount
                      released on a monthly basis) from the date of the end of
                      the SOV public sale.
                    </li>
                    <li>
                      Any cSOV holder that does not actively convert their cSOV
                      to SOV within a two month period after TGE will be able to
                      receive their staked funds.
                    </li>
                  </ol>
                  <p className="font-semibold text-md mt-5 mb-8">
                    sha256:{' '}
                    63817f1519ef0bf4699899acd747ef7a856ddbda1bba7a20ec75eb9da89650b7
                  </p>
                  <p className="font-semibold text-lg mt-16">
                    Function to invoke: setSaleAdmin(address)
                  </p>
                  <p>
                    0x000000000000000000000000d42070b07d4eabb801d76c6929f21749647275ec
                  </p>
                  <p>
                    Contract Address:{' '}
                    <span className="text-gold">
                      0x0106F2Ffbf6A4f5deCe323d20E16E2037e732790
                    </span>
                  </p>
                  <p className="font-thin">Amount to transfer: 0 (r)BTC</p>
                  <div className="border rounded-xl bg-gray-200 p-4 mt-3 mb-10 whitespace-pre h-64 overflow-y-auto">
                    <p className="text-xs font-gray-600">{functionsText}</p>
                  </div>
                  <p className="font-semibold text-lg mt-16">
                    Function to invoke: start(uint256,uint256,uint256
                  </p>
                  <p>
                    0x000000000000000000000000d42070b07d4eabb801d76c6929f21749647275ec
                  </p>
                  <p>
                    Contract Address:{' '}
                    <span className="text-gold">
                      0x0106F2Ffbf6A4f5deCe323d20E16E2037e732790
                    </span>
                  </p>
                  <p className="font-thin">Amount to transfer: 0 (r)BTC</p>
                  <div className="border rounded-xl bg-gray-200 p-4 mt-3 mb-10 whitespace-pre h-64 overflow-y-auto">
                    <p className="text-xs font-gray-600">{functionsText}</p>
                  </div>
                </div>
              </div>
              <div className="w-1/4 px-6 pr-0">
                <div className="flex items-start mb-6">
                  <p className="text-lg max-w-140 leading-4 w-1/2">
                    Proposed by:
                  </p>
                  <div className="w-auto">
                    <p className="text-gold text-sm">0x8540……..1fF1</p>
                  </div>
                </div>
                <div className="flex mb-6">
                  <p className="text-lg max-w-140 leading-4 w-1/2">
                    Proposed on:
                  </p>
                  <div className="w-auto">
                    <p className="text-sm">01/01/2021 - 12.00 GMT</p>
                    <p className="text-gold text-sm">#3402952</p>
                  </div>
                </div>
                <div className="flex mb-6">
                  <p className="text-lg max-w-140 leading-4 w-1/2">Deadline:</p>
                  <div className="w-auto">
                    <p className="text-sm">01/01/2021 - 12.00 GMT</p>
                    <p className="text-gold text-sm">#3402952</p>
                  </div>
                </div>
                <a
                  href="#!"
                  className="border rounded-xl bg-gold bg-opacity-10 hover:bg-opacity-40 transition duration-500 ease-in-out text-gold hover:text-gold hover:no-underline text-lg px-6 inline-block py-3 border-gold"
                >
                  Verify on Github
                </a>
              </div>
            </div>
          </>
        }
      />
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

            <div className="text-center">
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
