import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { Header } from '../../components/Header/Loadable';
import { Footer } from '../../components/Footer/Loadable';
import { VoteProgress } from '../../components/VoteProgress';
import { kFormatter, numberFromWei, prettyTx } from '../../../utils/helpers';
import { network } from '../BlockChainProvider/network';
import { getStatus, Proposal, ProposalState } from '../../../types/Proposal';
import { VoteCaster } from './components/VoteCaster';
import { useIsConnected } from '../../hooks/useIsConnected';
import { useSelector } from 'react-redux';
import { selectBlockChainProvider } from '../BlockChainProvider/selectors';
import { blockExplorers } from '../BlockChainProvider/classifiers';
import { ProposalActions } from './components/ProposalActions';
import { ProposalHistory } from './components/ProposalHistory';

export function ProposalDetailsPage() {
  const { id } = useParams();

  const isConnected = useIsConnected();

  const [state, setState] = useState<ProposalState>();
  const [data, setData] = useState<Proposal>(null as any);
  const [createdEvent, setCreatedEvent] = useState<any>(null as any);
  const [loading, setLoading] = useState(false);

  const [votesLoading, setVotesLoading] = useState(true);
  const [votes, setVotes] = useState<
    { support: boolean; voter: string; votes: number }[]
  >([]);

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
  }, [id]);

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
  }, [JSON.stringify(data)]);

  useEffect(() => {
    if (data?.id) {
      network
        .call('governorAlpha', 'state', [data.id])
        .then(e => {
          setState(e as any);
        })
        .catch(console.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(data)]);

  return (
    <>
      <Helmet>
        <title>Proposal Details</title>
      </Helmet>
      <Header />
      <main>
        <div className="bg-black">
          <div className="container">
            <Link to="/" className="block text-white pt-8 pb-6">
              &lt; Proposals
            </Link>
            <div className="pb-8 flex flex-row justify-between">
              <div>
                <h2 className={`text-white ${loading && 'skeleton'}`}>
                  {createdEvent?.returnValues?.description || 'No description'}
                </h2>
                {state !== undefined && (
                  <div className="inline px-1 rounded border text-white text-xs">
                    {getStatus(state as ProposalState)}
                  </div>
                )}
              </div>
              <div className="flex flex-row justify-end space-x-4 w-6/12">
                {data?.id && isConnected && state === ProposalState.Active && (
                  <VoteCaster proposalId={data.id} />
                )}
                <div className="bg-gray-900 text-white px-3 py-2 w-1/3">
                  <div className="text-xs text-gray-500">Proposer</div>
                  <div className={`truncate text-sm ${loading && 'skeleton'}`}>
                    {data?.proposer || '0x00000000000000000'}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-row space-x-4">
              <VotingTableHeader
                title="For"
                votes={numberFromWei(data?.forVotes || 0)}
                maxVotes={numberFromWei(data?.quorum || 0)}
                color="green"
                loading={loading}
              />
              <VotingTableHeader
                title="Against"
                votes={numberFromWei(data?.againstVotes || 0)}
                maxVotes={numberFromWei(data?.quorum || 0)}
                color="gray"
                loading={loading}
              />
            </div>
          </div>
        </div>
        <div className="container">
          <div className="flex flex-row space-x-4 mb-5">
            <VotingTable
              items={votes}
              showSupporters={true}
              loading={votesLoading}
            />
            <VotingTable
              items={votes}
              showSupporters={false}
              loading={votesLoading}
            />
          </div>

          <div className="flex flex-row space-x-4">
            <div className="w-9/12 bg-white rounded shadow">
              <ProposalActions proposalId={data?.id} />
              <div className="px-5 py-2">
                {createdEvent?.returnValues?.description}
              </div>
            </div>
            <ProposalHistory proposal={data} createdEvent={createdEvent} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

interface VotingHeaderProps {
  title: string;
  votes: number;
  maxVotes: number;
  color: 'green' | 'gray';
  loading: boolean;
}

function VotingTableHeader(props: VotingHeaderProps) {
  return (
    <div className="bg-white rounded-t shadow p-3 w-1/2 pb-4">
      <div className="flex flex-row justify-between">
        <h4 className="font-bold">{props.title}</h4>
        <h4 className={`font-bold ${props.loading && 'skeleton'}`}>
          {kFormatter(props.votes)}
        </h4>
      </div>
      <VoteProgress
        value={props.votes}
        max={props.maxVotes}
        color={props.color}
      />
    </div>
  );
}

interface TableProps {
  items: Array<{ support: boolean; voter: string; votes: number }>;
  loading: boolean;
  showSupporters: boolean;
}

function VotingTable(props: TableProps) {
  const items = (props.items || []).filter(
    item => item.support === props.showSupporters,
  );
  return (
    <div className="bg-white rounded-b shadow w-1/2">
      <div className="flex flex-row justify-between text-gray-500 text-xs font-medium bordered-b-gray px-5 py-2">
        <div>{items.length} Addresses</div>
        <div>Votes</div>
      </div>
      {items.length > 0 && (
        <div className="vote-area overflow-y-auto">
          {props.items.map(item => (
            <VotingRow
              key={item.voter}
              voter={item.voter}
              votes={numberFromWei(item.votes)}
              loading={props.loading}
            />
          ))}
        </div>
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
    </div>
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
      <div className="flex flex-row justify-between text-gray-500 transition duration-300 bordered-list-item px-5 py-3">
        <div className="skeleton">--------------</div>
        <div className="skeleton">-------</div>
      </div>
    );
  }

  if (!voter && !votes) {
    return (
      <div className="flex flex-row justify-between text-gray-500 transition duration-300 bordered-list-item px-5 py-3">
        <div>-</div>
        <div>-</div>
      </div>
    );
  }

  return (
    <a
      href={`${url}/address/${voter}`}
      target="_blank"
      rel="noreferrer"
      className="flex flex-row justify-between text-black transition duration-300 bordered-list-item px-5 py-3"
    >
      <div>{prettyTx(voter as string)}</div>
      <div>{votes?.toLocaleString()}</div>
    </a>
  );
}
