import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Scrollbars } from 'react-custom-scrollbars';
import { useTranslation } from 'react-i18next';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Linkify from 'react-linkify';
import { Icon } from '@blueprintjs/core';
import styled from 'styled-components/macro';
import { Classes, Tooltip2, Popover2 } from '@blueprintjs/popover2';
import {
  dateByBlocks,
  kFormatter,
  numberFromWei,
  prettyTx,
} from 'utils/helpers';
import { toastSuccess } from 'utils/toaster';
import { translations } from 'locales/i18n';
import { media } from '../../../styles/media';
import { network } from '../BlockChainProvider/network';
import { VoteCaster } from './components/VoteCaster';
import { useIsConnected } from '../../hooks/useIsConnected';
import { blockExplorers } from '../BlockChainProvider/classifiers';
import { ProposalActions } from './components/ProposalActions';
import { ProposalHistory } from './components/ProposalHistory';
import { useGetProposalState } from '../../hooks/useGetProposalState';
import { Proposal, ProposalState } from '../../../types/Proposal';
import { selectBlockChainProvider } from '../BlockChainProvider/selectors';
import { MergedProposal } from '../../hooks/useProposalList';

export function ProposalDetailsPage() {
  const { id, contractName } = useParams<any>();
  const isConnected = useIsConnected();
  const { syncBlockNumber } = useSelector(selectBlockChainProvider);
  const [data, setData] = useState<MergedProposal>(null as any);
  const [createdEvent, setCreatedEvent] = useState<any>(null as any);
  const [loading, setLoading] = useState(false);
  const [votesLoading, setVotesLoading] = useState(true);
  const [votes, setVotes] = useState<
    { support: boolean; voter: string; votes: number; txs: string }[]
  >([]);
  const votesForProgressPercents =
    (numberFromWei(data?.forVotes || 0) /
      (numberFromWei(data?.forVotes || 0) +
        numberFromWei(data?.againstVotes || 0))) *
    100;
  const votesAgainstProgressPercents = 100 - votesForProgressPercents;

  useEffect(() => {
    setLoading(true);
    const get = async () => {
      const proposal = ((await network.call(contractName, 'proposals', [
        id,
      ])) as unknown) as Proposal;
      setData({ ...proposal, contractName });
      const events = await network.getPastEvents(
        contractName,
        'ProposalCreated',
        { id: proposal.id },
        proposal.startBlock - 1,
        proposal.endBlock,
      );
      setCreatedEvent(events[0]);
      setLoading(false);
    };
    get().then().catch();
  }, [id, syncBlockNumber, contractName]);

  useEffect(() => {
    if (data?.id) {
      setVotesLoading(true);
      network
        .getPastEvents(
          data.contractName,
          'VoteCast',
          {
            proposalId: data.id,
          },
          data.startBlock,
          data.endBlock,
        )
        .then(events => {
          setVotes(
            events.map(({ returnValues, transactionHash }) => ({
              support: returnValues.support,
              voter: returnValues.voter,
              votes: returnValues.votes,
              txs: transactionHash,
            })),
          );
          setVotesLoading(false);
        })
        .catch(console.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(data), syncBlockNumber]);

  const { state } = useGetProposalState(data);

  return (
    <>
      <div className="proposap-detail">
        <div className="xl:flex justify-between items-start">
          <h3
            className={`proposal__title font-semibold break-all w-2/3 mt-2 overflow-hidden max-h-24 leading-12 truncate ${
              loading && 'skeleton'
            }`}
          >
            <Linkify properties={{ target: '_blank' }}>
              {createdEvent?.returnValues?.description || 'No description'}
            </Linkify>
          </h3>
          <div className="text-right font-semibold">
            <p
              className={`mt-2 text-lg leading-6 tracking-normal ${
                loading && 'skeleton'
              }`}
            >
              Voting ends:{' '}
              {dateByBlocks(
                data?.startTime,
                createdEvent?.blockNumber,
                data?.endBlock,
              )}
            </p>
          </div>
        </div>
        <div
          className={`flex justify-center xl:mt-20 mt-10
          ${loading && 'skeleton'}`}
        >
          <div className="mr-10 text-right">
            <span className="xl:text-3xl text-xl font-semibold leading-5 tracking-normal">
              {(votesForProgressPercents || 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              %
            </span>
            <Tooltip2
              className={Classes.TOOLTIP2_INDICATOR}
              minimal={true}
              content={
                <p className="text-white text-sm tracking-normal">
                  {numberFromWei(data?.forVotes || 0)} votes
                </p>
              }
              placement="top"
            >
              <p className="xl:text-lg text-sm font-light tracking-normal">
                {kFormatter(numberFromWei(data?.forVotes || 0))} votes
              </p>
            </Tooltip2>
          </div>
          <StyledBar>
            <div className="progress__blue" />
            <div className="progress__red" />
            {!isNaN(votesForProgressPercents) &&
              !isNaN(votesAgainstProgressPercents) && (
                <div
                  className="progress__circle"
                  style={{ right: votesForProgressPercents + '%' }}
                />
              )}
          </StyledBar>
          <div className="ml-10">
            <span className="xl:text-3xl text-xl font-semibold leading-5 tracking-normal">
              {(votesAgainstProgressPercents || 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              %
            </span>
            <Tooltip2
              className={Classes.TOOLTIP2_INDICATOR}
              minimal={true}
              content={
                <p className="text-white text-sm tracking-normal">
                  {numberFromWei(data?.againstVotes || 0)} votes
                </p>
              }
              placement="top"
            >
              <p className="xl:text-lg text-sm font-light tracking-normal">
                {kFormatter(numberFromWei(data?.againstVotes || 0))} votes
              </p>
            </Tooltip2>
          </div>
        </div>
        {data?.id && isConnected && state !== ProposalState.Active && (
          <div className="xl:flex items-center justify-between mt-16">
            <div className="tracking-normal vote__success rounded-xl bg-opacity-30 bg-turquoise mb-4 xl:mb-0 border xl:px-12 px-3 py-3 text-center xl:text-lg text-sm text-turquoise border-turquoise">
              {kFormatter(numberFromWei(data?.forVotes || 0))} Votes For
            </div>
            <div className="tracking-normal vote__danger rounded-xl bg-opacity-30 bg-red border xl:px-12 px-3 py-3 text-center xl:text-lg text-sm text-red border-red">
              {kFormatter(numberFromWei(data?.againstVotes || 0))} Votes Against
            </div>
          </div>
        )}

        {data?.id && isConnected && state === ProposalState.Active && (
          <VoteCaster
            voutesFor={data.forVotes}
            voutesAgainst={data.againstVotes}
            proposalId={data.id}
            proposal={data}
            contractName={data.contractName}
          />
        )}

        <div className="xl:flex -mx-2 mt-8">
          <Scrollbars
            className="rounded-2xl border mb-4 xl:mb-0 xl:w-2/4 sovryn-table pt-1 pb-3 pr-3 pl-3 mx-2 overflow-y-auto h-48"
            style={{ height: 195 }}
          >
            <div className="mx-4">
              <VotingTable
                items={votes}
                showSupporters={true}
                loading={votesLoading}
              />
            </div>
          </Scrollbars>
          <Scrollbars
            className="rounded-2xl border xl:w-2/4 sovryn-table pt-1 pb-3 pr-3 pl-3 mx-2 overflow-y-auto h-48"
            style={{ height: 195 }}
          >
            <div className="mx-4">
              <VotingTable
                items={votes}
                showSupporters={false}
                loading={votesLoading}
              />
            </div>
          </Scrollbars>
        </div>
        <div className="xl:flex mt-10">
          <div className="xl:w-3/4 w-full mb-5 xl:mb-0">
            <div className="bg-gray-100 xl:py-8 py-4 xl:px-20 px-4 rounded-2xl">
              {/*<h4 className="mb-8 font-semibold xl:text-2xl text-xl tracking-widest">*/}
              {/*  {createdEvent.description}*/}
              {/*</h4>*/}
              <p className="break-all mt-8">
                <Linkify properties={{ target: '_blank' }}>
                  {createdEvent?.returnValues?.description || 'No description'}
                </Linkify>
              </p>
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
              <ProposalActions
                proposalId={data?.id}
                contractName={data?.contractName}
              />
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
            <p
              className={`text-gold text-sm tracking-normal leading-3 pt-3 ${
                loading && 'skeleton'
              }`}
            >
              Proposal id: {String(data?.id).padStart(3, '0')}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

interface TableProps {
  items: Array<{ support: boolean; voter: string; votes: number; txs: string }>;
  loading: boolean;
  showSupporters: boolean;
}

function VotingTable(props: TableProps) {
  const [items, setItems] = useState<
    { support: boolean; voter: string; votes: number; txs: string }[]
  >([]);

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
                txs={item.txs}
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
  txs,
  loading,
}: {
  voter?: string;
  votes?: number;
  txs?: string;
  loading?: boolean;
}) {
  const { chainId } = useSelector(selectBlockChainProvider);
  const { t } = useTranslation();

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
        <Popover2
          minimal={true}
          placement="top"
          popoverClassName="bp3-tooltip2"
          content={
            <div className="flex items-center">
              <a
                href={`${url}/address/${voter?.toLocaleLowerCase()}`}
                target="_blank"
                rel="noreferrer"
                className="text-gold text-sm tracking-normal transition no-underline p-0 m-0 duration-300 hover:underline hover:text-gold"
              >
                {voter?.toLocaleLowerCase()}
              </a>
              <CopyToClipboard
                onCopy={() =>
                  toastSuccess(<>{t(translations.onCopy.address)}</>, 'copy')
                }
                text={voter?.toLocaleLowerCase()}
              >
                <Icon
                  title="Copy"
                  icon="duplicate"
                  className="text-white cursor-pointer hover:text-gold ml-2"
                  iconSize={15}
                />
              </CopyToClipboard>
            </div>
          }
        >
          <p className="text-gold p-0 m-0 duration-300 hover:opacity-70 transition cursor-pointer">
            {prettyTx(voter as string)}
          </p>
        </Popover2>
      </td>
      <td className="hidden md:table-cell">
        <Popover2
          minimal={true}
          placement="top"
          popoverClassName="bp3-tooltip2"
          content={
            <div className="flex items-center">
              <a
                href={`${url}/tx/${txs?.toLocaleLowerCase()}`}
                target="_blank"
                rel="noreferrer"
                className="text-gold text-sm tracking-normal transition no-underline p-0 m-0 duration-300 hover:underline hover:text-gold"
              >
                {txs?.toLocaleLowerCase()}
              </a>
              <CopyToClipboard
                onCopy={() =>
                  toastSuccess(<>{t(translations.onCopy.address)}</>, 'copy')
                }
                text={txs?.toLocaleLowerCase()}
              >
                <Icon
                  title="Copy"
                  icon="duplicate"
                  className="text-white cursor-pointer hover:text-gold ml-2"
                  iconSize={15}
                />
              </CopyToClipboard>
            </div>
          }
        >
          <p className="text-gold p-0 m-0 duration-300 hover:opacity-70 transition cursor-pointer">
            {prettyTx(txs as string)}
          </p>
        </Popover2>
      </td>
      <td>
        <Tooltip2
          className={Classes.TOOLTIP2_INDICATOR}
          minimal={true}
          content={
            <p className="text-white text-sm tracking-normal">{votes} votes</p>
          }
          placement="top"
        >
          {kFormatter(votes)}
        </Tooltip2>
      </td>
    </tr>
  );
}

const StyledBar = styled.div`
  width: 100%;
  max-width: 60%;
  position: relative;
  top: -10px;
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
      border: 11px solid white;
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

const StyledTable = styled.table`
  font-weight: 100;
  width: 100%;
  font-size: 14px;
  font-family: 'Work Sans';
  letter-spacing: 0;

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
      height: 38px;
      th {
        height: 38px;
        padding: 0 15px;
      }
    }
    tbody tr {
      height: 30px;
      td {
        padding: 0 15px;
        font-weight: 100;
        font-family: 'Work Sans';
        a {
          color: #fec004;
          font-family: 'Work Sans';
          &:hover {
            text-decoration: underline;
          }
        }
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
