import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';

export function TopAdresses() {
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
                          <circle r="19px" fill="white" cx="19px" cy="19px" />
                        </svg>
                      </div>
                      <div>Username</div>
                    </div>
                  </td>
                  <td className="text-right">1A1z….vfNa</td>
                  <td className="text-right hidden md:table-cell">
                    100,000,000
                  </td>
                  <td className="text-right hidden md:table-cell">112.32%</td>
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
                          <circle r="19px" fill="white" cx="19px" cy="19px" />
                        </svg>
                      </div>
                      <div>Username</div>
                    </div>
                  </td>
                  <td className="text-right">1A1z….vfNa</td>
                  <td className="text-right hidden md:table-cell">
                    100,000,000
                  </td>
                  <td className="text-right hidden md:table-cell">112.32%</td>
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
                          <circle r="19px" fill="white" cx="19px" cy="19px" />
                        </svg>
                      </div>
                      <div>Username</div>
                    </div>
                  </td>
                  <td className="text-right">1A1z….vfNa</td>
                  <td className="text-right hidden md:table-cell">
                    100,000,000
                  </td>
                  <td className="text-right hidden md:table-cell">112.32%</td>
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
                          <circle r="19px" fill="white" cx="19px" cy="19px" />
                        </svg>
                      </div>
                      <div>Username</div>
                    </div>
                  </td>
                  <td className="text-right">1A1z….vfNa</td>
                  <td className="text-right hidden md:table-cell">
                    100,000,000
                  </td>
                  <td className="text-right hidden md:table-cell">112.32%</td>
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
                          <circle r="19px" fill="white" cx="19px" cy="19px" />
                        </svg>
                      </div>
                      <div>Username</div>
                    </div>
                  </td>
                  <td className="text-right">1A1z….vfNa</td>
                  <td className="text-right hidden md:table-cell">
                    100,000,000
                  </td>
                  <td className="text-right hidden md:table-cell">112.32%</td>
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
                          <circle r="19px" fill="white" cx="19px" cy="19px" />
                        </svg>
                      </div>
                      <div>Username</div>
                    </div>
                  </td>
                  <td className="text-right">1A1z….vfNa</td>
                  <td className="text-right hidden md:table-cell">
                    100,000,000
                  </td>
                  <td className="text-right hidden md:table-cell">112.32%</td>
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
    </>
  );
}
