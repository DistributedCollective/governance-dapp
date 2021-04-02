import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components/macro';
import { Footer } from '../../components/Footer/Loadable';
import { ProposalRow } from '../ProposalRow/Loadable';
import { Header } from 'app/components/Header';
import { useProposalList } from '../../hooks/useProposalList';

export function HomePage() {
  const { items, total, loading } = useProposalList(1, 3);
  const location = useLocation();
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
            <h2 className="text-white text-center pt-5 pb-8 tracking-normal">
              SOVRYN Bitocracy
            </h2>
            <div className="flex justify-between items-center">
              <h2 className="font-semibold mb-2 tracking-normal">
                Governance Proposals
              </h2>
              <button></button>
              <Link
                to={{
                  pathname: '/proposals/propose',
                  state: { background: location },
                }}
                className="inline-block text-center px-3 py-2 text-lg font-light hover:text-gold hover:no-underline tracking-normal"
              >
                Propose
              </Link>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="bg-gray-light rounded-b shadow">
            <>
              <div className="rounded-lg bg-gray-lighter border sovryn-table pt-1 pb-3 pr-3 pl-3 mb-5 ">
                <StyledTable className="w-full table-fixed">
                  <thead>
                    <tr>
                      <th className="text-left w-2/3 xl:w-1/5">Title</th>
                      <th className="text-center hidden xl:table-cell xl:w-1/5">
                        Start Block
                      </th>
                      <th className="text-center hidden xl:table-cell xl:w-1/5">
                        Vote Weight
                      </th>
                      <th className="text-center hidden xl:table-cell xl:w-1/5">
                        Voting Ends
                      </th>
                      <th className="text-center w-1/3 xl:w-1/5">Action</th>
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
                    {!loading && total === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center font-normal">
                          No proposals yet.
                        </td>
                      </tr>
                    )}
                    {items.map(item => (
                      <ProposalRow
                        key={item.id + item.contractName}
                        proposal={item}
                      />
                    ))}
                  </tbody>
                </StyledTable>
              </div>
            </>
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
