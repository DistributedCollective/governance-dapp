/**
 *
 * StakePage
 *
 */

import React, { useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { reducer, sliceKey } from './slice';
import { selectStakePage } from './selectors';
import { stakePageSaga } from './saga';
import { Header } from '../../components/Header/Loadable';
import { Footer } from '../../components/Footer/Loadable';
import { VoteProgress } from '../../components/VoteProgress';
import { useContractCallWithValue } from '../../hooks/useContractCallWithValue';
import { useAccount } from '../../hooks/useAccount';
import { network } from '../BlockChainProvider/network';
import { fromWei, genesisAddress, getContract } from '../../../utils/helpers';
import { useWeiAmount } from '../../hooks/useWeiAmount';
import { LinkToExplorer } from '../../components/LinkToExplorer';

interface Props {}

export function StakePage(props: Props) {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: stakePageSaga });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const stakePage = useSelector(selectStakePage);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useDispatch();

  const account = useAccount();
  const balanceOf = useContractCallWithValue(
    'staking',
    'balanceOf',
    '0',
    account,
  );

  const voteBalance = useContractCallWithValue(
    'staking',
    'getCurrentVotes',
    '-',
    account,
  );

  const sovBalanceOf = useContractCallWithValue(
    'sovToken',
    'balanceOf',
    '0',
    account,
  );

  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<string[]>([]);

  const weiAmount = useWeiAmount(amount);

  const validate = () => {
    if (loading) return false;
    const num = Number(amount);
    if (!num || isNaN(num) || num <= 0) return false;
    return num * 1e18 <= sovBalanceOf.value;
  };

  const handleSubmit = useCallback(
    async e => {
      e.preventDefault();
      setLoading(true);
      let nonce = await network.nonce(account);
      const allowance = await network.call('sovToken', 'allowance', [
        account,
        getContract('staking').address,
      ]);

      if (allowance < weiAmount) {
        const approveTx = await network.send(
          'sovToken',
          'approve',
          getContract('staking').address,
          weiAmount,
          {
            from: account,
            nonce,
          },
        );
        setTxHash(prevState => [...prevState, approveTx]);
        nonce += 1;
      }

      const stakeTx = await network.send(
        'staking',
        'stake',
        weiAmount,
        1209600, // two weeks
        genesisAddress,
        genesisAddress,
        { from: account, nonce },
      );
      setLoading(false);
      setTxHash(prevState => [...prevState, stakeTx]);
    },
    [weiAmount, account],
  );

  return (
    <>
      <Helmet>
        <title>Stake</title>
      </Helmet>
      <Header />
      <main>
        <div className="bg-black">
          <div className="container">
            <h2 className="text-white pt-20 pb-8">Staking</h2>

            <div className="flex flex-col pb-8 md:flex-row md:space-x-4">
              <div className="flex flex-row flex-no-wrap justify-between bg-gray-900 text-white p-3 w-full md:w-1/2 mb-3 md:mb-0">
                <div>
                  <div
                    className={`text-white text-xl ${
                      balanceOf.loading && 'skeleton'
                    }`}
                  >
                    {Number(fromWei(balanceOf.value)).toFixed(4)}
                  </div>
                  <div className="text-gray-600 text-sm">You staked</div>
                </div>
                <div className="flex flex-col items-end justify-center w-1/2 border-1 border-red-300">
                  <div className="mt-5 w-full">
                    <VoteProgress value={600} max={1000} color="green" />
                  </div>
                </div>
              </div>
              <div className="flex flex-row flex-no-wrap justify-between bg-gray-900 text-white p-3 w-full md:w-1/2 mb-3 md:mb-0">
                <div>
                  <div
                    className={`text-white text-xl ${
                      voteBalance.loading && 'skeleton'
                    }`}
                  >
                    {voteBalance.value}
                  </div>
                  <div className="text-gray-600 text-sm">Votes</div>
                </div>
              </div>
            </div>
            <div className="flex space-x-4">
              <div className="bg-white rounded-t shadow p-3 md:w-2/3">
                <h4 className="font-bold">Stake</h4>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="flex flex-row space-x-4">
            <div className="md:w-2/3 bg-white rounded-b shadow p-3">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="amount"
                  >
                    Amount
                  </label>
                  <div className="flex space-x-4">
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="username"
                      type="text"
                      placeholder="Amount"
                      value={amount}
                      onChange={e => setAmount(e.currentTarget.value)}
                    />
                    <button
                      type="button"
                      className=""
                      onClick={() =>
                        setAmount((sovBalanceOf.value / 1e18).toFixed(18))
                      }
                    >
                      MAX
                    </button>
                  </div>
                  <div className="text-gray-700 text-xs mt-3">
                    Balance:{' '}
                    <span
                      className={`text-gray-900 ${
                        sovBalanceOf.loading && 'skeleton'
                      }`}
                    >
                      {(sovBalanceOf.value / 1e18).toFixed(4)}
                    </span>{' '}
                    SoV
                  </div>
                </div>

                <button
                  type="submit"
                  className={`bg-green-500 text-white px-4 py-2 rounded ${
                    !validate() && 'opacity-50 cursor-not-allowed'
                  }`}
                  disabled={!validate()}
                >
                  Stake
                </button>

                <div>
                  {txHash.map(e => (
                    <div key={e} className="mt-3">
                      <LinkToExplorer
                        txHash={e}
                        className="text-gray-600 hover:text-gray-900"
                      />
                    </div>
                  ))}
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
