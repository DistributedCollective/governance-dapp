import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Scrollbars } from 'react-custom-scrollbars';
import Linkify from 'react-linkify';
import styled from 'styled-components/macro';
import { kFormatter, numberFromWei, prettyTx } from 'utils/helpers';
import { media } from '../../../styles/media';
import { network } from '../BlockChainProvider/network';
import { VoteCaster } from './components/VoteCaster';
import { useIsConnected } from '../../hooks/useIsConnected';
import { blockExplorers } from '../BlockChainProvider/classifiers';
import { ProposalActions } from './components/ProposalActions';
import { ProposalHistory } from './components/ProposalHistory';
import { ProposalStatusBadge } from '../../components/ProposalStatusBadge';
import { useGetProposalState } from '../../hooks/useGetProposalState';
import { Proposal, ProposalState } from '../../../types/Proposal';
import { selectBlockChainProvider } from '../BlockChainProvider/selectors';

export function ProposalDetailsPage() {
  const { id } = useParams<any>();

  const isConnected = useIsConnected();
  const { syncBlockNumber } = useSelector(selectBlockChainProvider);
  const [data, setData] = useState<Proposal>(null as any);
  const [createdEvent, setCreatedEvent] = useState<any>(null as any);
  const [loading, setLoading] = useState(false);
  const [votesLoading, setVotesLoading] = useState(true);
  const [votes, setVotes] = useState<
    { support: boolean; voter: string; votes: number }[]
  >([]);
  const votesForProgressPercents =
    (numberFromWei(data?.forVotes || 0) /
      (numberFromWei(data?.forVotes || 0) +
        numberFromWei(data?.againstVotes || 0))) *
    100;

  const votesAgainstProgressPercents = 100 - votesForProgressPercents;

  const StyledBar = styled.div`
    width: 100%;
    max-width: 60%;
    margin: 0 30px;
    display: flex;
    height: 34px;
    flex-wrap: nowrap;
    position: relative;
    ${media.xl`
      max-width: 750px;
    `}
    .progress {
      &__circle {
        width: 55px;
        height: 55px;
        border-radius: 100%;
        display: block;
        position: absolute;
        top: -10px;
        bottom: 0;
        border: 10px solid white;
        transition: all 0.3s;
        margin: 0 -27.5px;
      }
      &__blue {
        width: 50%;
        border-radius: 24px 0 0 24px;
        background: rgb(78, 205, 196);
        margin-left: -27.5px;
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
        margin-left: 55px;
        margin-right: -27.5px;
        background: linear-gradient(
          90deg,
          rgba(0, 0, 0, 1) 0%,
          rgba(205, 78, 78, 1) 100%
        );
      }
    }
  `;

  useEffect(() => {
    setLoading(true);
    const get = async () => {
      const proposal = ((await network.call('governorAlpha', 'proposals', [
        id,
      ])) as unknown) as Proposal;
      setData(proposal);
      const events = await network.getPastEvents(
        'governorAlpha',
        'ProposalCreated',
        { id: proposal.id },
        proposal.startBlock - 1,
        proposal.endBlock,
      );
      setCreatedEvent(events[0]);
      setLoading(false);
    };
    get().then().catch();
  }, [id, syncBlockNumber]);

  useEffect(() => {
    if (data?.id) {
      setVotesLoading(true);
      network
        .getPastEvents(
          'governorAlpha',
          'VoteCast',
          {
            proposalId: data.id,
          },
          data.startBlock,
          data.endBlock,
        )
        .then(events => {
          setVotes(
            events.map(({ returnValues }) => ({
              support: returnValues.support,
              voter: returnValues.voter,
              votes: returnValues.votes,
            })),
          );
          setVotesLoading(false);
        })
        .catch(console.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(data), syncBlockNumber]);

  const { state, loading: stateLoading } = useGetProposalState(data);

  return (
    <>
      <div className="proposap-detail">
        <div className="xl:flex justify-between items-start">
          <h3
            className={`proposal__title leading-10 font-semibold break-all w-5/6 ${
              loading && 'skeleton'
            }`}
          >
            <Linkify properties={{ target: '_blank' }}>
              {createdEvent?.returnValues?.description || 'No description'}
            </Linkify>
          </h3>
          <div className="text-right font-semibold">
            <p className={` ${loading && 'skeleton'}`}>
              Voting ends: {data?.endBlock}
              <br />
              {data?.id && <>#{data.id}</>}
            </p>
          </div>
        </div>
        {state && !stateLoading && <ProposalStatusBadge state={state} />}
        <div className="flex justify-around xl:mt-24 mt-10">
          <div className="mx-3 text-right">
            <span className="xl:text-3xl text-xl font-semibold leading-5">
              {votesForProgressPercents || 0}%
            </span>
            <p className="xl:text-lg text-sm font-light">
              {kFormatter(numberFromWei(data?.forVotes || 0))} votes
            </p>
          </div>
          <StyledBar>
            <div className="progress__blue"></div>
            <div className="progress__red"></div>
            {!isNaN(votesForProgressPercents) &&
              !isNaN(votesAgainstProgressPercents) && (
                <div
                  className="progress__circle"
                  style={{ right: votesForProgressPercents + '%' }}
                ></div>
              )}
          </StyledBar>
          <div className="mx-3">
            <span className="xl:text-3xl text-xl font-semibold leading-5">
              {votesAgainstProgressPercents || 0}%
            </span>
            <p className="xl:text-lg text-sm font-light">
              {kFormatter(numberFromWei(data?.againstVotes || 0))} votes
            </p>
          </div>
        </div>
        {data?.id && isConnected && state !== ProposalState.Active && (
          <div className="xl:flex items-center justify-between mt-20">
            <div className="vote__success rounded-xl mb-4 xl:mb-0 border xl:px-10 px-3 py-3 text-center xl:text-lg text-sm text-turquoise border-turquoise">
              {kFormatter(numberFromWei(data?.forVotes || 0))} Votes For
            </div>
            <div className="vote__danger rounded-xl border xl:px-10 px-3 py-3 text-center xl:text-lg text-sm text-red border-red">
              {kFormatter(numberFromWei(data?.againstVotes || 0))} Votes Against
            </div>
          </div>
        )}

        {data?.id && isConnected && state === ProposalState.Active && (
          <VoteCaster
            voutesFor={data.forVotes}
            voutesAgainst={data.againstVotes}
            proposalId={data.id}
          />
        )}

        <div className="xl:flex -mx-2 mt-8">
          <Scrollbars
            className="rounded-xl border mb-4 xl:mb-0 xl:w-2/4 sovryn-table pt-1 pb-3 pr-3 pl-3 mx-2 overflow-y-auto h-48"
            style={{ height: 190 }}
          >
            <VotingTable
              items={votes}
              showSupporters={true}
              loading={votesLoading}
            />
          </Scrollbars>
          <Scrollbars
            className="rounded-xl border xl:w-2/4 sovryn-table pt-1 pb-3 pr-3 pl-3 mx-2 overflow-y-auto h-48"
            style={{ height: 190 }}
          >
            <VotingTable
              items={votes}
              showSupporters={false}
              loading={votesLoading}
            />
          </Scrollbars>
        </div>
        <div className="xl:flex mt-10">
          <div className="xl:w-3/4 w-full mb-5 xl:mb-0">
            <div className="bg-gray-100 xl:py-8 py-4 xl:px-20 px-4 rounded-2xl">
              <h4 className="mb-8 font-semibold xl:text-2xl text-xl tracking-widest">
                Activation of Genesis Reservation
              </h4>
              {/* <p className="text-sm">Resolved:</p>
              <ol className="list-decimal text-sm pl-5 leading-6">
                <li>
                  The Sovryn protocol will issue up to 2,000,000 cSOV tokens.
                  This represent a 200,000 increase from 1,800,000 of SIP 0002.
                </li>
                <li>
                  cSOV tokens will provide a pre-reservation mechanism for
                  community members to stake funds in order to receive the right
                  to SOV tokens, on a 1:1 basis with cSOV tokens subject to a
                  vote by SOV holders.
                </li>
                <li>
                  These cSOV tokens will be distributed to stakers who have the
                  early community NFTS.
                </li>
                <li>The required stake per cSOV token will be 2500 Satoshis</li>
                <li>
                  Any cSOV tokens converted to SOV will be subject to 10 months
                  linear vesting (with 1/10 of the total amount released on a
                  monthly basis) from the date of the end of the SOV public
                  sale.
                </li>
                <li>
                  Any cSOV holder that does not actively convert their cSOV to
                  SOV within a two month period after TGE will be able to
                  receive their staked funds.
                </li>
              </ol>
              <p className="font-semibold text-md mt-5 break-words">
                sha256:{' '}
                63817f1519ef0bf4699899acd747ef7a856ddbda1bba7a20ec75eb9da89650b7
              </p> */}
              <ProposalActions proposalId={data?.id} />
            </div>
          </div>
          <div className="xl:w-1/4 w-full px-6 pr-0">
            <ProposalHistory proposal={data} createdEvent={createdEvent} />
            {/* <a
              href="#!"
              className="border rounded-xl bg-gold bg-opacity-10 text-center hover:bg-opacity-40 transition duration-500 ease-in-out text-gold hover:text-gold hover:no-underline text-lg px-6 xl:inline-block block py-3 border-gold"
            >
              Verify on Github
            </a> */}
          </div>
        </div>
      </div>
    </>
  );
}

interface TableProps {
  items: Array<{ support: boolean; voter: string; votes: number }>;
  loading: boolean;
  showSupporters: boolean;
}

function VotingTable(props: TableProps) {
  const [items, setItems] = useState<
    { support: boolean; voter: string; votes: number }[]
  >([]);
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

  useEffect(() => {
    setItems(
      (props.items || []).filter(item => item.support === props.showSupporters),
    );
  }, [props.items, props.showSupporters]);

  return (
    <StyledTable className="w-full text-left table-small font-montserrat">
      <thead>
        <tr>
          <th>Addresses</th>
          <th className="hidden md:table-cell">Tx Hash</th>
          <th>Votes</th>
        </tr>
      </thead>
      <tbody className="mt-5">
        {items.length > 0 && (
          <>
            {items.map((item, index) => (
              <VotingRow
                key={index}
                voter={item.voter}
                votes={numberFromWei(item.votes)}
                loading={props.loading}
              />
            ))}
          </>
        )}
        {items.length < 3 && (
          <>
            {Array(3 - items.length)
              .fill(0)
              .map((_, index) => (
                <VotingRow key={index} loading={props.loading} />
              ))}
          </>
        )}
      </tbody>
    </StyledTable>
  );
}

function VotingRow({
  voter,
  votes,
  loading,
}: {
  voter?: string;
  votes?: number;
  loading?: boolean;
}) {
  const { chainId } = useSelector(selectBlockChainProvider);

  const getUrl = useCallback(() => {
    return blockExplorers[chainId];
  }, [chainId]);

  const [url, setUrl] = useState(getUrl());

  useEffect(() => {
    setUrl(getUrl());
  }, [chainId, getUrl]);

  if (loading) {
    return (
      <tr>
        <td className="skeleton">--------------</td>
        <td className="skeleton hidden md:table-cell">--------------</td>
        <td className="skeleton">--------------</td>
      </tr>
    );
  }

  if (!voter && !votes) {
    return (
      <tr>
        <td>-</td>
        <td className="hidden md:table-cell">-</td>
        <td>-</td>
      </tr>
    );
  }

  return (
    <tr>
      <td>
        <a
          href={`${url}/address/${voter}`}
          target="_blank"
          rel="noreferrer"
          className="text-white transition no-underline p-0 m-0 duration-300 bordered-list-item hover:text-gold hover:no-underline"
        >
          {prettyTx(voter as string)}
        </a>
      </td>
      <td className="hidden md:table-cell">{prettyTx(voter as string)}</td>
      <td>{kFormatter(votes)}</td>
    </tr>
  );
}
