import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Header } from '../../components/Header/Loadable';
import { Footer } from '../../components/Footer/Loadable';
import { VoteProgress } from '../../components/VoteProgress';

export function HomePage() {
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

            <div className="flex flex-col pb-8 md:flex-row md:space-x-4">
              <Link
                to="/sov"
                className="flex flex-row flex-no-wrap justify-between bg-gray-900 text-white p-3 w-full md:w-1/2 mb-3 md:mb-0"
              >
                <div>
                  <div className="text-white text-xl">
                    {(123456).toLocaleString()}
                  </div>
                  <div className="text-gray-600 text-sm">SOV Remaining</div>
                </div>
                <div className="flex flex-col items-end justify-center w-1/2 border-1 border-red-300">
                  <div className="uppercase text-sm text-green-500 font-bold">
                    View
                  </div>
                  <div className="mt-3 w-full">
                    <VoteProgress value={600} max={1000} color="green" />
                  </div>
                </div>
              </Link>
              <div className="flex flex-row space-x-4 w-full md:w-1/2">
                <div className="d-flex bg-gray-900 text-white p-3 w-1/2">
                  <div className="text-white text-xl">
                    {(123456).toLocaleString()}
                  </div>
                  <div className="text-gray-600 text-sm">Votes Delegated</div>
                </div>
                <div className="d-flex bg-gray-900 text-white p-3 w-1/2">
                  <div className="text-white text-xl">
                    {(1300).toLocaleString()}
                  </div>
                  <div className="text-gray-600 text-sm">Voting Addresses</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-t shadow p-3">
              <h4 className="font-bold">Recent Proposals</h4>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="bg-white rounded-b shadow">
            <ProposalRow status="active" />
            <ProposalRow status="canceled" />
            <ProposalRow status="completed" />
            <ProposalRow status="completed" />
            <Link
              to="/proposals"
              className="block uppercase text-center px-3 py-2 font-bold text-sm hover:text-green-500 transition easy-in-out duration-300 border-t-1"
            >
              View All Proposals
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

interface ProposalProps {
  status: 'active' | 'completed' | 'canceled';
}

function ProposalRow(props: ProposalProps) {
  return (
    <Link
      to="/proposals/123"
      className="flex px-5 py-3 transition duration-300 bordered-list-item"
    >
      {props.status === 'active' ? (
        <div className="flex justify-between items-center w-full">
          <div className="flex justify-between items-center">
            <div className="pulsating-dot ml-5 mr-8" />
            <div>
              <div className="font-medium mb-2">Delegate UNI 2</div>
              <div className="flex flex-row justify-start items-center">
                <StatusBadge text={props.status} color="indigo" />
                <div className="text-indigo-700 text-xs ml-3">
                  029 • 1 day, 5 hours left
                </div>
              </div>
            </div>
          </div>
          <div className="hidden md:w-1/3">
            <VoteProgress
              max={100000}
              value={60000}
              color="green"
              showVotes={true}
            />
            <VoteProgress
              max={100000}
              value={2500}
              color="gray"
              showVotes={true}
            />
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center w-full">
          <div className="w-full md:w-10/12">
            <div className="font-medium mb-2">Delegate UNI</div>
            <div className="flex flex-row justify-start items-center">
              <StatusBadge
                text={props.status}
                color={props.status === 'completed' ? 'green' : 'gray'}
              />
              <div
                className={`${
                  props.status === 'completed'
                    ? 'text-green-500'
                    : 'text-gray-500'
                } text-xs ml-3`}
              >
                0XX • Executed at November.
              </div>
            </div>
          </div>
          <div className="hidden md:block w-2/12">Executed</div>
        </div>
      )}
    </Link>
  );
}

const borderColorMap = {
  green: 'border-green-500',
  gray: 'border-gray-500',
  indigo: 'border-indigo-700',
};

const colorMap = {
  green: 'text-green-500',
  gray: 'text-gray-500',
  indigo: 'text-indigo-700',
};

function StatusBadge({
  text,
  color,
}: {
  text: string;
  color: 'green' | 'gray' | 'indigo';
}) {
  return (
    <div
      className={`border rounded py-0 px-1 text-xs ${borderColorMap[color]} ${colorMap[color]} text-center`}
      style={{ width: '70px' }}
    >
      {text}
    </div>
  );
}
