/**
 *
 * StakePage
 *
 */

import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Header } from 'app/components/Header';
import moment from 'moment';
import { bignumber } from 'mathjs';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { stakePageSaga } from './saga';
import { selectStakePage } from './selectors';
import { reducer, sliceKey } from './slice';
import { Footer } from '../../components/Footer/Loadable';
import { network } from '../BlockChainProvider/network';
import { useAccount } from '../../hooks/useAccount';
import { useWeiAmount } from '../../hooks/useWeiAmount';
import { numberFromWei } from '../../../utils/helpers';
import { useSoV_balanceOf } from '../../hooks/sov/useSoV_balanceOf';
import { useStaking_getStakes } from '../../hooks/staking/useStaking_getStakes';
import { useStaking_balanceOf } from '../../hooks/staking/useStaking_balanceOf';
import { useVesting_getVesting } from '../../hooks/vesting-registry/useVesting_getVesting';
import { useStaking_WEIGHT_FACTOR } from '../../hooks/staking/useStaking_WEIGHT_FACTOR';
import { useStaking_currentBalance } from '../../hooks/staking/useStaking_currentBalance';
import { useStaking_getCurrentVotes } from '../../hooks/staking/useStaking_getCurrentVotes';
import { useStaking_computeWeightByDate } from '../../hooks/staking/useStaking_computeWeightByDate';
import {
  staking_allowance,
  staking_approve,
  staking_extendStakingDuration,
  staking_stake,
  staking_withdraw,
} from '../BlockChainProvider/requests/staking';
import { Modal } from '../../components/Modal';
import { StakeForm } from './components/StakeForm';
import { WithdrawForm } from './components/WithdrawForm';
import { useIsConnected } from '../../hooks/useIsConnected';
import { ExtendStakeForm } from './components/ExtendStakeForm';
import { IncreaseStakeForm } from './components/IncreaseStakeForm';
import { HistoryEventsTable } from './components/HistoryEventsTable';
import { useStaking_kickoffTs } from '../../hooks/staking/useStaking_kickoffTs';
import { VestingTable } from './components/VestingTable';
import { VestingTeamTable } from './components/VestingTeamTable';
// import {
//   governance_proposalCount,
//   governance_propose,
// } from '../BlockChainProvider/requests/governance';
// import { Icon, Button } from '@blueprintjs/core';
// import { Popover2 } from '@blueprintjs/popover2';
import styled from 'styled-components/macro';
import logoSvg from 'assets/images/sovryn-icon.svg';
import { media } from '../../../styles/media';
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
        <div className="bg-gray-700 tracking-normal">
          <div className="container">
            <h2 className="text-white pt-8 pb-5 pl-10">Staking/Vesting</h2>
            <div className="w-full bg-gray-light text-center rounded-b shadow p-3">
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
  const vesting = useVesting_getVesting(account);
  // const vestingTeam = useVesting_getTeamVesting(account);
  const balanceOfVest = useStaking_balanceOf(vesting.value);
  const s = useStaking_currentBalance(account);

  const [amount, setAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [timestamp, setTimestamp] = useState<number>(0 as any);
  const [loading, setLoading] = useState(false);
  const [currentLock, setCurrentLock] = useState<Date>(null as any);

  const weiAmount = useWeiAmount(amount);
  const weiWithdrawAmount = useWeiAmount(withdrawAmount);

  const [until, setUntil] = useState<number>(0 as any);
  const [prevTimestamp, setPrevTimestamp] = useState<number>(undefined as any);
  const [stakeForm, setStakeForm] = useState(false);
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

  let dates = getStakes.value['dates'];
  let stakes = getStakes.value['stakes'];
  let stakesArray = [];
  if (dates && stakes) {
    stakesArray = dates.map((v, index) => [stakes[index], v]);
  }

  interface Stakes {
    stakes: any[] | any;
  }

  const StakesOverview: React.FC<Stakes> = ({ stakes }) => {
    return stakes.length ? (
      <>
        {stakes.map((item, i: string) => {
          return (
            <tr key={i}>
              <td>
                <div className="username flex items-center">
                  <div>
                    <img src={logoSvg} className="ml-3 mr-3" alt="sov" />
                  </div>
                  <div className="text-sm font-normal hidden xl:block">SOV</div>
                </div>
              </td>
              <td className="text-left font-normal">
                {numberFromWei(item[0])} SOV
              </td>
              <td className="text-left hidden lg:table-cell font-normal">
                {moment(new Date(parseInt(item[1]) * 1e3)).format(
                  'DD/MM/YYYY - h:mm:ss a',
                )}
              </td>
              <td className="text-left hidden lg:table-cell font-normal">
                4 weeks
              </td>
              <td className="text-left hidden lg:table-cell font-normal">
                <p>
                  {moment(new Date(parseInt(item[1]) * 1e3)).format(
                    'DD/MM/YYYY',
                  )}
                  <br />
                  {moment().diff(
                    moment(new Date(parseInt(item[1]) * 1e3)),
                    'days',
                  )}{' '}
                  days
                </p>
              </td>
              <td className="md:text-left lg:text-right hidden md:table-cell max-w-15 min-w-15">
                <div className="flex flex-nowrap">
                  <button
                    type="button"
                    className="text-gold tracking-normal hover:text-gold hover:no-underline hover:bg-gold hover:bg-opacity-30 mr-1 xl:mr-7 px-4 py-2 bordered transition duration-500 ease-in-out rounded-full border border-gold text-sm font-light font-montserrat"
                    onClick={() => {
                      setTimestamp(item[1]);
                      setAmount(item[0]);
                      setUntil(item[1]);
                      setStakeForm(false);
                      setExtendForm(false);
                      setIncreaseForm(true);
                      setWithdrawForm(false);
                    }}
                  >
                    Increase
                  </button>
                  <button
                    type="button"
                    className="text-gold tracking-normal hover:text-gold hover:no-underline hover:bg-gold hover:bg-opacity-30 mr-1 xl:mr-8 px-5 py-2 bordered transition duration-500 ease-in-out rounded-full border border-gold text-sm font-light font-montserrat"
                    onClick={() => {
                      setPrevTimestamp(item[1]);
                      setTimestamp(item[1]);
                      setAmount(item[0]);
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
                    className="text-gold tracking-normal hover:text-gold hover:no-underline hover:bg-gold hover:bg-opacity-30 mr-1 xl:mr-12 px-4 py-2 bordered transition duration-500 ease-in-out rounded-full border border-gold text-sm font-light font-montserrat"
                    onClick={() => {
                      setAmount(item[0]);
                      setWithdrawAmount('');
                      setTimestamp(item[1]);
                      setUntil(item[1]);
                      setStakeForm(false);
                      setExtendForm(false);
                      setIncreaseForm(false);
                      setWithdrawForm(true);
                    }}
                  >
                    Unstake
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </>
    ) : (
      <tr>
        <td
          colSpan={6}
          className={`text-center font-normal ${
            getStakes.loading && 'skeleton'
          }`}
        >
          No stakes yet
        </td>
      </tr>
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
        <div className="bg-gray-700 tracking-normal">
          <div className="container">
            <h2 className="text-white pt-8 pb-5 pl-10">Staking/Vesting</h2>
            {/* <button
              className={`bg-green-500 text-white px-4 py-2 rounded mb-2`}
              type="button"
              onClick={() => createProposal()}
            >
              Add proposal
            </button> */}

            <div className="xl:flex items-stretch justify-around mt-2">
              <div className="mx-2 bg-gray-800 staking-box p-8 pb-6 rounded-2xl w-full xl:w-1/4 mb-5 xl:mb-0">
                <p className="text-lg -mt-1">Total staked SOV</p>
                <p className="text-4-5xl mt-2 mb-6">
                  {numberFromWei(balanceOf.value).toLocaleString()} SOV
                  {balanceOfVest.value !== '0' && (
                    <>
                      <br />
                      {numberFromWei(balanceOfVest.value).toLocaleString()} CSOV
                    </>
                  )}
                </p>
                <Modal
                  show={stakeForm}
                  content={
                    <>
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
                        onCloseModal={() => setStakeForm(!stakeForm)}
                      />
                    </>
                  }
                />
                {balanceOf.value !== '0' && (
                  <button
                    type="button"
                    className="bg-gold bg-opacity-10 hover:text-gold focus:outline-none focus:bg-opacity-50 hover:bg-opacity-40 transition duration-500 ease-in-out px-8 py-3 text-lg text-gold hover:text-gray-light py-3 px-3 border transition-colors duration-300 ease-in-out border-gold rounded-xl"
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
                )}
              </div>

              <div className="mx-2 bg-gray-800 staking-box p-8 pb-6 rounded-2xl w-full xl:w-1/4 text-sm mb-5 xl:mb-0">
                <p className="text-lg -mt-1">Total earned fees Available</p>
                <p className="text-4-5xl mt-2 mb-6">≈ 1000.00 USD</p>
                <div className="flex justify-between items-center mb-1 mt-1 leading-6">
                  <div className="w-1/5">iDoC</div>
                  <div className="w-1/2 ml-6">10.000 ≈ 10.00 USD</div>
                  <Link
                    to={{}}
                    className="text-gold hover:text-gold hover:underline font-medium font-montserrat tracking-normal"
                  >
                    Withdraw
                  </Link>
                </div>
                <div className="flex justify-between items-center mb-1 leading-6">
                  <div className="w-1/5">i(r)BTC</div>
                  <div className="w-1/2 ml-6">10.000 ≈ 10.00 USD</div>
                  <Link
                    to={{}}
                    className="text-gold hover:text-gold hover:underline font-medium font-montserrat tracking-normal"
                  >
                    Withdraw
                  </Link>
                </div>
                <div className="flex justify-between items-center mb-1 leading-6">
                  <div className="w-1/5">iBPro</div>
                  <div className="w-1/2 ml-6">10 ≈ 10.0 USD</div>
                  <Link
                    to={{}}
                    className="text-gold hover:text-gold hover:underline font-medium font-montserrat tracking-normal"
                  >
                    Withdraw
                  </Link>
                </div>
                <div className="flex justify-between items-center leading-6">
                  <div className="w-1/5">iUSDT</div>
                  <div className="w-1/2 ml-6">10.0 ≈ 10.00 USD</div>
                  <Link
                    to={{}}
                    className="text-gold hover:text-gold hover:underline font-medium font-montserrat tracking-normal"
                  >
                    Withdraw
                  </Link>
                </div>
              </div>

              <div className="mx-2 bg-gray-800 staking-box p-8 pb-6 rounded-2xl w-full xl:w-1/4 mb-5 xl:mb-0">
                <p className="text-lg -mt-1">Combined Voting Power </p>
                <p className="text-4-5xl mt-2 mb-6">
                  {numberFromWei(voteBalance.value).toLocaleString()}
                </p>
                <Link
                  to={'/'}
                  className="bg-gold bg-opacity-10 hover:text-gold focus:outline-none focus:bg-opacity-50 hover:bg-opacity-40 transition duration-500 ease-in-out px-8 py-3 text-lg text-gold hover:text-gray-light py-3 px-3 border transition-colors duration-300 ease-in-out border-gold rounded-xl hover:no-underline no-underline inline-block"
                >
                  View Governance
                </Link>
              </div>
            </div>

            <p className="font-semibold text-lg ml-6 mb-4 mt-6">
              Current Stakes
            </p>
            <div className="bg-gray-light rounded-b shadow">
              <div className="rounded-lg border sovryn-table pt-1 pb-0 pr-5 pl-5 mb-5 max-h-96 overflow-y-auto">
                <StyledTable className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left">Asset</th>
                      <th className="text-left">Locked Amount</th>
                      <th className="text-left hidden lg:table-cell">
                        Staking Date
                      </th>
                      <th className="text-left hidden lg:table-cell">
                        Staking Period
                      </th>
                      <th className="text-left hidden lg:table-cell">
                        Unlock Date
                      </th>
                      <th className="text-left hidden md:table-cell max-w-15 min-w-15">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="mt-5 font-montserrat text-xs">
                    <StakesOverview stakes={stakesArray} />
                  </tbody>
                </StyledTable>
              </div>
            </div>

            <p className="font-semibold text-lg ml-6 mb-4 mt-6">
              Current Vests
            </p>
            <div className="bg-gray-light rounded-b shadow">
              <div className="rounded-lg border sovryn-table pt-1 pb-0 pr-5 pl-5 mb-5 max-h-96 overflow-y-auto">
                <StyledTable className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left">Asset</th>
                      <th className="text-left">Locked Amount</th>
                      <th className="text-left hidden lg:table-cell">
                        Staking Date
                      </th>
                      <th className="text-left hidden lg:table-cell">
                        Staking Period
                      </th>
                      <th className="text-left hidden lg:table-cell">
                        Unlock Date
                      </th>
                      <th className="text-left hidden md:table-cell max-w-15 min-w-15">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="mt-5 font-montserrat text-xs">
                    <VestingTable />
                    <VestingTeamTable />
                  </tbody>
                </StyledTable>
              </div>
            </div>

            <p className="font-normal text-lg ml-6 mb-1 mt-16">
              Staking History
            </p>
            <div className="bg-gray-light rounded-b shadow max-h-96 overflow-y-auto mb-10">
              <div className="rounded-lg border sovryn-table pt-1 pb-0 pr-5 pl-5 max-h-96 overflow-y-auto">
                <StyledTable className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left">Asset</th>
                      <th className="text-left hidden lg:table-cell">
                        Staked Amount
                      </th>
                      <th className="text-left hidden lg:table-cell">
                        Staking Date
                      </th>
                      <th className="text-left hidden lg:table-cell">
                        Total Staked
                      </th>
                    </tr>
                  </thead>
                  <tbody className="mt-5 font-montserrat text-xs">
                    <HistoryEventsTable />
                  </tbody>
                </StyledTable>
              </div>
            </div>
          </div>
          <>
            {balanceOf.value !== '0' && (
              <>
                {increaseForm === true && (
                  <Modal
                    show={increaseForm}
                    content={
                      <>
                        <IncreaseStakeForm
                          handleSubmit={handleIncreaseStakeSubmit}
                          amount={amount}
                          timestamp={timestamp}
                          onChangeAmount={e => setAmount(e)}
                          sovBalanceOf={sovBalanceOf}
                          isValid={validateIncreaseForm()}
                          balanceOf={balanceOf}
                          votePower={votingPower}
                          onCloseModal={() => setIncreaseForm(!increaseForm)}
                        />
                      </>
                    }
                  />
                )}
                {extendForm === true && (
                  <Modal
                    show={extendForm}
                    content={
                      <>
                        {currentLock && kickoffTs.value !== '0' && (
                          <ExtendStakeForm
                            handleSubmit={handleExtendTimeSubmit}
                            amount={amount}
                            timestamp={timestamp}
                            onChangeTimestamp={e => setTimestamp(e)}
                            sovBalanceOf={sovBalanceOf}
                            kickoff={kickoffTs}
                            isValid={validateExtendTimeForm()}
                            stakes={getStakes.value['dates']}
                            balanceOf={balanceOf}
                            votePower={votingPower}
                            prevExtend={prevTimestamp}
                            currentLock={currentLock}
                            onCloseModal={() => setExtendForm(!extendForm)}
                          />
                        )}
                      </>
                    }
                  />
                )}
                {withdrawForm === true && (
                  <Modal
                    show={withdrawForm}
                    content={
                      <>
                        <WithdrawForm
                          handleSubmit={handleWithdrawSubmit}
                          withdrawAmount={withdrawAmount}
                          amount={amount}
                          until={timestamp}
                          onChangeAmount={e => setWithdrawAmount(e)}
                          sovBalanceOf={sovBalanceOf}
                          balanceOf={balanceOf}
                          votePower={votingPower}
                          isValid={validateWithdrawForm()}
                          onCloseModal={() => setWithdrawForm(!withdrawForm)}
                        />
                      </>
                    }
                  />
                )}
              </>
            )}
          </>
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
    height: 45px;
  }
  thead tr,
  .table-header:not(.sub-header) {
    height: 40px;
    th {
      font-weight: 300;
      color: white;
      font-size: 14px;
      padding: 0 5px;
      height: 45px;
    }
  }
  tbody {
    tr {
      &:nth-child(odd) {
        td {
          background-color: #282828;
        }
      }
      td {
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
      padding: 0 5px;
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
  ${media.xl`
  thead tr,
  .table-header:not(.sub-header) {
    th {
      padding: 0 15px;
    }
  }
    tbody tr,
    .mobile-row {
      td {
        padding: 0 15px;
      }
    }
  `}
`;
