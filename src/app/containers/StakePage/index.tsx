/**
 *
 * StakePage
 *
 */

import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { bignumber } from 'mathjs';
import moment from 'moment';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { reducer, sliceKey } from './slice';
import { selectStakePage } from './selectors';
import { stakePageSaga } from './saga';
import { Footer } from '../../components/Footer/Loadable';
import { VoteProgress } from '../../components/VoteProgress';
import { useAccount } from '../../hooks/useAccount';
import { useStaking_getStakes } from '../../hooks/staking/useStaking_getStakes';
import { network } from '../BlockChainProvider/network';
import { getContract, numberFromWei } from '../../../utils/helpers';
import { useWeiAmount } from '../../hooks/useWeiAmount';
import { useSoV_balanceOf } from '../../hooks/sov/useSoV_balanceOf';
import { useStaking_getCurrentVotes } from '../../hooks/staking/useStaking_getCurrentVotes';
import { useStaking_computeWeightByDate } from '../../hooks/staking/useStaking_computeWeightByDate';
import { useStaking_balanceOf } from '../../hooks/staking/useStaking_balanceOf';
import { useStaking_WEIGHT_FACTOR } from '../../hooks/staking/useStaking_WEIGHT_FACTOR';
import { useStaking_currentLock } from '../../hooks/staking/useStaking_currentLock';
import {
  staking_allowance,
  staking_approve,
  staking_extendStakingDuration,
  staking_stake,
  staking_withdraw,
} from '../BlockChainProvider/requests/staking';
import { StakeForm } from './components/StakeForm';
import { PageSkeleton } from '../../components/PageSkeleton';
import { useIsConnected } from '../../hooks/useIsConnected';
import { WithdrawForm } from './components/WithdrawForm';
import { IncreaseStakeForm } from './components/IncreaseStakeForm';
import { useStaking_kickoffTs } from '../../hooks/staking/useStaking_kickoffTs';
// import {
//   governance_proposalCount,
//   governance_propose,
// } from '../BlockChainProvider/requests/governance';
import { StakingDateSelector } from '../../components/StakingDateSelector';
import { Header } from 'app/components/Header';

interface Props {}

const now = new Date();

export function StakePage(props: Props) {
  const isConnected = useIsConnected();
  if (isConnected) {
    return <InnerStakePage />;
  }
  return (
    <>
      <Helmet>
        <title>Stake</title>
      </Helmet>
      <Header />
      <main>
        <div className="bg-black">
          <div className="container">
            <h2 className="text-white pt-5 pb-5">Staking</h2>

            <div className="flex flex-col pb-8 md:flex-row md:space-x-4">
              <div className="flex flex-row flex-no-wrap justify-between bg-gray-light text-white p-3 w-full md:w-1/2 mb-3 md:mb-0">
                <div>
                  <div className={`text-white text-xl`}>-----</div>
                  <div className="text-gray-600 text-sm">You staked</div>
                </div>
                <div className="flex flex-col items-end justify-center w-1/2 border-1 border-red-300">
                  <div className="mt-5 w-full">
                    <VoteProgress value={0} max={100} color="green" />
                  </div>
                </div>
              </div>
              <div className="flex flex-row flex-no-wrap justify-between bg-gray-900 text-white p-3 w-full md:w-1/2 mb-3 md:mb-0">
                <div>
                  <div className={`text-white text-xl`}>-----</div>
                  <div className="text-gray-600 text-sm">Your votes</div>
                </div>
              </div>
            </div>
            <div className="flex space-x-4">
              <div className="bg-gray-light shadow p-3 w-full">
                <h4 className="font-bold">Staking</h4>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="flex flex-row space-x-4">
            <div className="w-full bg-gray-light rounded-b shadow p-3">
              <i>Please connect with your wallet to use staking.</i>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function InnerStakePage(props: Props) {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: stakePageSaga });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const stakePage = useSelector(selectStakePage);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useDispatch();

  const account = useAccount();
  const balanceOf = useStaking_balanceOf(account);
  const WEIGHT_FACTOR = useStaking_WEIGHT_FACTOR();
  const voteBalance = useStaking_getCurrentVotes(account);
  const kickoffTs = useStaking_kickoffTs();
  const getStakes = useStaking_getStakes(account);

  const sovBalanceOf = useSoV_balanceOf(account);
  const totalStakedBalance = useSoV_balanceOf(getContract('staking').address);
  const s = useStaking_currentLock(account);

  const [amount, setAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [timestamp, setTimestamp] = useState<number>(0 as any);
  const [loading, setLoading] = useState(false);
  const [currentLock, setCurrentLock] = useState<Date>(null as any);

  const weiAmount = useWeiAmount(amount);
  const weiWithdrawAmount = useWeiAmount(withdrawAmount);

  const [until, setUntil] = useState<number>(0 as any);
  const [prevTimestamp, setPrevTimestamp] = useState<number>(undefined as any);
  const [stakeForm, setStakeForm] = useState(true);
  const [extendForm, setExtendForm] = useState(false);
  const [withdrawForm, setWithdrawForm] = useState(false);
  const [increaseForm, setIncreaseForm] = useState(false);

  const [weight, setWeight] = useState('');
  const [lockDate, setLockDate] = useState<number>(0 as any);
  const [votingPower, setVotingPower] = useState<number>(0 as any);
  const getWeight = useStaking_computeWeightByDate(
    lockDate,
    Math.round(now.getTime() / 1e3),
  );

  interface Stakes {
    stakes: any[] | any;
    dates: any[] | any;
  }

  const StakesOverview: React.FC<Stakes> = ({ stakes, dates }) => {
    return stakes && dates ? (
      <div className="flex items-center">
        <div className="mr-4">
          {stakes.map((item, i: string) => {
            return (
              <div className="mb-10 mt-6" key={i}>
                Stake amount: <b>{numberFromWei(item).toLocaleString()}</b>
              </div>
            );
          })}
        </div>
        <div className="mr-4">
          {dates.map((item, i: string) => {
            return (
              <div className="flex items-center" key={i}>
                <div className="mb-4 mr-4">
                  End date:{' '}
                  <b>
                    {moment(new Date(parseInt(item) * 1e3)).format(
                      'DD.MM.YYYY',
                    )}
                  </b>
                </div>
                <div className="flex items-center mr-4 mb-4">
                  <button
                    type="button"
                    className="mr-4 bg-green-500 text-white px-4 py-2 rounded mb-2"
                    onClick={() => {
                      setPrevTimestamp(item);
                      setTimestamp(item);
                      setStakeForm(false);
                      setExtendForm(true);
                      setIncreaseForm(false);
                      setWithdrawForm(false);
                    }}
                  >
                    Extend
                  </button>
                  <button
                    type="button"
                    className="mr-4 bg-green-500 text-white px-4 py-2 rounded mb-2"
                    onClick={() => {
                      setTimestamp(item);
                      setUntil(item);
                      setAmount('');
                      setStakeForm(false);
                      setExtendForm(false);
                      setIncreaseForm(false);
                      setWithdrawForm(true);
                    }}
                  >
                    Withdraw
                  </button>
                  <button
                    type="button"
                    className="mr-4 bg-green-500 text-white px-4 py-2 rounded mb-2"
                    onClick={() => {
                      setTimestamp(item);
                      setAmount('');
                      setUntil(item);
                      setStakeForm(false);
                      setExtendForm(false);
                      setIncreaseForm(true);
                      setWithdrawForm(false);
                    }}
                  >
                    Increase
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    ) : (
      <div>Loading</div>
    );
  };

  useEffect(() => {
    setCurrentLock(new Date(Number(s.value) * 1e3));
    if (timestamp && weiAmount && stakeForm) {
      setLockDate(timestamp / 1e3);
      setWeight(getWeight.value);
      setVotingPower(
        (Number(weiAmount) * Number(weight)) / Number(WEIGHT_FACTOR.value),
      );
    } else {
      setLockDate(timestamp);
      setWeight('');
      setVotingPower(0);
    }
  }, [
    s.value,
    getWeight.value,
    weight,
    stakeForm,
    WEIGHT_FACTOR.value,
    weiAmount,
    timestamp,
  ]);

  const validateStakeForm = useCallback(() => {
    if (loading) return false;
    const num = Number(amount);
    if (!num || isNaN(num) || num <= 0) return false;
    if (!timestamp || timestamp < now.getTime()) return false;
    return num * 1e18 <= Number(sovBalanceOf.value);
  }, [loading, amount, sovBalanceOf, timestamp]);

  const validateIncreaseForm = useCallback(() => {
    if (loading) return false;
    const num = Number(amount);
    if (!num || isNaN(num) || num <= 0) return false;
    return num * 1e18 <= Number(sovBalanceOf.value);
  }, [loading, amount, sovBalanceOf]);

  const validateWithdrawForm = useCallback(() => {
    if (loading) return false;
    const num = Number(withdrawAmount);
    if (!num || isNaN(num) || num <= 0) return false;
    if (currentLock && currentLock > now) return false;
    return num * 1e18 <= Number(balanceOf.value);
  }, [loading, withdrawAmount, balanceOf, currentLock]);

  const validateExtendTimeForm = useCallback(() => {
    if (loading) return false;
    return timestamp >= now.getTime();
  }, [loading, timestamp]);

  const handleStakeSubmit = useCallback(
    async e => {
      e.preventDefault();
      setLoading(true);
      try {
        let nonce = await network.nonce(account);
        const allowance = (await staking_allowance(account)) as string;
        if (bignumber(allowance).lessThan(weiAmount)) {
          await staking_approve(sovBalanceOf.value, account, nonce);
          nonce += 1;
        }
        await staking_stake(weiAmount, timestamp / 1e3, account, nonce);
        setLoading(false);
      } catch (e) {
        setLoading(false);
        console.error(e);
      }
    },
    [weiAmount, sovBalanceOf.value, account, timestamp],
  );

  const handleIncreaseStakeSubmit = useCallback(
    async e => {
      e.preventDefault();
      setLoading(true);
      try {
        let nonce = await network.nonce(account);
        const allowance = (await staking_allowance(account)) as string;
        if (bignumber(allowance).lessThan(weiAmount)) {
          await staking_approve(weiAmount, account, nonce);
          nonce += 1;
        }
        await staking_stake(weiAmount, timestamp, account, nonce);
        setLoading(false);
      } catch (e) {
        setLoading(false);
        console.error(e);
      }
    },
    [weiAmount, account, timestamp],
  );

  const handleWithdrawSubmit = useCallback(
    async e => {
      e.preventDefault();
      setLoading(true);
      await staking_withdraw(weiWithdrawAmount, until, account);
      setLoading(false);
    },
    [weiWithdrawAmount, until, account],
  );

  //extend STAKES
  const handleExtendTimeSubmit = useCallback(
    async e => {
      e.preventDefault();
      setLoading(true);
      try {
        await staking_extendStakingDuration(
          prevTimestamp,
          timestamp / 1e3,
          account,
        );
        setLoading(false);
      } catch (e) {
        setLoading(false);
      }
    },
    [prevTimestamp, timestamp, account],
  );

  // const createProposal = useCallback(async () => {
  //   const nextId = (await governance_proposalCount()) + 1;
  //   await governance_propose(
  //     ['0x0a440C27decD34dBb02754e9Ec00d3d3d38a4083'],
  //     ['0'],
  //     ['setWeightScaling(uint96)'],
  //     ['0x0000000000000000000000000000000000000000000000000000000000000004'],
  //     `set weight scaling to 4 ${nextId}`,
  //     account,
  //   );
  // }, [account]);

  return (
    <>
      <Helmet>
        <title>Stake</title>
      </Helmet>
      <Header />
      <main>
        <div className="bg-black">
          <div className="container">
            <h2 className="text-white pt-5 pb-5">Staking</h2>
            {/* <button
              className={`bg-green-500 text-white px-4 py-2 rounded mb-2`}
              type="button"
              onClick={() => createProposal()}
            >
              Add proposal
            </button> */}

            <div className="md:flex align-items-center justify-around">
              <div className="mx-5 bg-gray-light staking-box p-8 rounded-lg w-2/5">
                <p>Total staked SOV</p>
                <p>1,000,000 SOV</p>
                {/* <button className="bg-transparent hover:bg-gold hover:text-gray-light px-8 py-3 text-lg text-gold hover:text-gray-light py-2 px-4 border transition-colors duration-300 ease-in-out border-gold rounded-lg">
                  Add New Stake
                </button> */}
                <button
                  type="button"
                  className={`btn btn-gold-big mt-12`}
                  onClick={() => {
                    setTimestamp(0);
                    setAmount('');
                    setStakeForm(!stakeForm);
                    setExtendForm(false);
                    setIncreaseForm(false);
                    setWithdrawForm(false);
                  }}
                >
                  Add New Stake
                </button>
              </div>
            </div>

            <div className="flex flex-col pb-8 md:flex-row md:space-x-4">
              <div className="flex flex-row flex-no-wrap justify-between bg-gray-900 text-white p-3 w-full md:w-1/2 mb-3 md:mb-0">
                <div>
                  <div
                    className={`text-white text-xl ${
                      balanceOf.loading && 'skeleton'
                    }`}
                  >
                    {numberFromWei(balanceOf.value).toLocaleString()}
                  </div>
                  <div className="text-gray-600 text-sm">You staked</div>
                </div>
                <div className="flex flex-col items-end justify-center w-1/2 border-1 border-red-300">
                  <div className="mt-5 w-full">
                    <VoteProgress
                      value={numberFromWei(balanceOf.value)}
                      max={numberFromWei(totalStakedBalance.value)}
                      color="green"
                    />
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
                    {numberFromWei(voteBalance.value).toLocaleString()}
                  </div>
                  <div className="text-gray-600 text-sm">Your votes</div>
                </div>
              </div>
            </div>
            <div className="flex space-x-4">
              <div className="bg-gray-light rounded-t shadow p-3 w-full">
                <h4 className="font-bold">Staking</h4>
              </div>
            </div>
          </div>
          <div className="container">
            <div className="flex flex-row space-x-4">
              <div className="w-full bg-gray-light rounded-b shadow p-3">
                {balanceOf.loading ? (
                  <>
                    <PageSkeleton />
                  </>
                ) : (
                  <>
                    {balanceOf.value !== '0' && (
                      <>
                        <button
                          type="button"
                          className={`bg-gray-500 text-white px-4 py-2 mb-4 rounded mr-2
                          ${stakeForm && 'bg-green-500'}`}
                          onClick={() => {
                            setTimestamp(0);
                            setAmount('');
                            setStakeForm(!stakeForm);
                            setExtendForm(false);
                            setIncreaseForm(false);
                            setWithdrawForm(false);
                          }}
                        >
                          New Stake
                        </button>
                        {increaseForm === true && (
                          <>
                            <h2>Increase</h2>
                            <IncreaseStakeForm
                              handleSubmit={handleIncreaseStakeSubmit}
                              amount={amount}
                              timestamp={timestamp}
                              onChangeAmount={e => setAmount(e)}
                              sovBalanceOf={sovBalanceOf}
                              isValid={validateIncreaseForm()}
                            />
                          </>
                        )}
                        {extendForm === true && (
                          <>
                            <h2>Extend</h2>
                            {currentLock && kickoffTs.value !== '0' && (
                              <form onSubmit={handleExtendTimeSubmit}>
                                <div className="mb-4">
                                  <StakingDateSelector
                                    title="Select new date"
                                    kickoffTs={Number(kickoffTs.value)}
                                    startTs={currentLock.getTime()}
                                    value={timestamp}
                                    onChange={e => setTimestamp(e)}
                                    stakes={getStakes.value['dates']}
                                    prevExtend={prevTimestamp}
                                  />
                                </div>
                                <div className="flex flex-row justify-between items-center space-x-4">
                                  <button
                                    type="submit"
                                    className={`bg-green-500 text-white px-4 py-2 rounded ${
                                      !validateExtendTimeForm() &&
                                      'opacity-50 cursor-not-allowed'
                                    }`}
                                    disabled={!validateExtendTimeForm()}
                                  >
                                    Extend
                                  </button>
                                  <div>
                                    {prevTimestamp && (
                                      <div className="text-gray-5 mb-4 text-xs">
                                        Previous until:
                                        <br />
                                        <span className="font-bold">
                                          {moment(
                                            new Date(prevTimestamp * 1e3),
                                          ).format('DD.MM.YYYY')}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </form>
                            )}
                          </>
                        )}

                        {withdrawForm === true && (
                          <>
                            <h2>Withdraw</h2>
                            <WithdrawForm
                              handleSubmit={handleWithdrawSubmit}
                              amount={withdrawAmount}
                              until={timestamp}
                              onChangeAmount={e => setWithdrawAmount(e)}
                              balanceOf={balanceOf}
                              isValid={validateWithdrawForm()}
                            />
                          </>
                        )}
                      </>
                    )}

                    {(balanceOf.value === '0' || stakeForm === true) && (
                      <>
                        <h2>New Stake</h2>
                        <StakeForm
                          handleSubmit={handleStakeSubmit}
                          amount={amount}
                          timestamp={timestamp}
                          onChangeAmount={e => setAmount(e)}
                          onChangeTimestamp={e => setTimestamp(e)}
                          sovBalanceOf={sovBalanceOf}
                          isValid={validateStakeForm()}
                          kickoff={kickoffTs}
                          stakes={getStakes.value['dates']}
                          votePower={votingPower}
                        />
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          <br />
          <div className="container">
            <div className="w-full bg-gray-light rounded shadow p-3 pb-5">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                List of staking
              </label>
              <StakesOverview
                dates={getStakes.value['dates']}
                stakes={getStakes.value['stakes']}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
