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

export function ProposalsPage() {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Proposal[]>([]);
  const [total, setTotal] = useState<number>(0);
  useEffect(() => {
    setLoading(true);

    const get = async () => {
      const proposalCount = await governance_proposalCount();
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
        <div>
          <div className="container">
            <div className="block text-white pt-8 pb-6">
              <Link
                to="/"
                className="text-white hover:no-underline hover:text-gold"
              >
                &lt; Proposals
              </Link>
            </div>
            <h2 className="text-white pb-8">Governance Proposals</h2>

            <div className="bg-gray-light rounded-t shadow p-3">
              <h4 className="font-bold">All Proposals</h4>
            </div>
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
            <>
              <div className="rounded-lg border sovryn-table pt-1 pb-3 pr-3 pl-3 mb-5 ">
                <StyledTable className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left">Title</th>
                      <th className="text-center hidden md:table-cell">
                        Start Block
                      </th>
                      <th className="text-center hidden md:table-cell">
                        Vote Weight
                      </th>
                      <th className="text-center hidden md:table-cell">
                        Voting Ends
                      </th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="mt-5">
                    {loading && !items.length && (
                      <>
                        <tr>
                          <td>
                            <div className="w-full skeleton h-4" />
                          </td>
                          <td>
                            <div className="w-full skeleton h-4" />
                          </td>
                          <td>
                            <div className="w-full skeleton h-4" />
                          </td>
                          <td>
                            <div className="w-full skeleton h-4" />
                          </td>
                          <td>
                            <div className="w-full skeleton h-4" />
                          </td>
                        </tr>
                      </>
                    )}
                    {items.map(item => (
                      <ProposalRow key={item.id} proposal={item} />
                    ))}
                  </tbody>
                </StyledTable>
              </div>
            </>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
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
